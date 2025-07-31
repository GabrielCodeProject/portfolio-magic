import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ClientPerformanceGate, withClientPerformanceGate, usePerformanceGateContext } from './ClientPerformanceGate';

// Mock all dependencies
jest.mock('@/utils/deviceCapabilities', () => ({
  getDeviceCapabilities: jest.fn(),
  canRenderComponent: jest.fn(),
}));

jest.mock('@/utils/performanceThresholds', () => ({
  getPerformanceTier: jest.fn(),
  getThresholdConfigForDevice: jest.fn(),
  shouldEnableComponent: jest.fn(),
  getFpsThresholds: jest.fn(),
  logPerformanceTier: jest.fn(),
}));

jest.mock('@/hooks/useClientPerformanceMonitor', () => ({
  useClientPerformanceMonitor: jest.fn(),
}));

jest.mock('@/hooks/useRAFFpsMonitor', () => ({
  useEnhancedFpsMonitor: jest.fn(),
}));

jest.mock('@/utils/performanceMetricsStorage', () => ({
  usePerformanceMetricsStorage: jest.fn(),
}));

jest.mock('@/components/ui', () => ({
  LoadingSpinner: ({ text, size, variant }: any) => (
    <div data-testid="loading-spinner" data-size={size} data-variant={variant}>
      {text}
    </div>
  ),
}));

// Import mocked functions
import { getDeviceCapabilities, canRenderComponent } from '@/utils/deviceCapabilities';
import { 
  getPerformanceTier, 
  getThresholdConfigForDevice, 
  shouldEnableComponent,
  getFpsThresholds,
  logPerformanceTier 
} from '@/utils/performanceThresholds';
import { useClientPerformanceMonitor } from '@/hooks/useClientPerformanceMonitor';
import { useEnhancedFpsMonitor } from '@/hooks/useRAFFpsMonitor';
import { usePerformanceMetricsStorage } from '@/utils/performanceMetricsStorage';

// Mock console methods
const mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

// Typed mocks
const mockGetDeviceCapabilities = getDeviceCapabilities as jest.MockedFunction<typeof getDeviceCapabilities>;
const mockCanRenderComponent = canRenderComponent as jest.MockedFunction<typeof canRenderComponent>;
const mockGetPerformanceTier = getPerformanceTier as jest.MockedFunction<typeof getPerformanceTier>;
const mockGetThresholdConfigForDevice = getThresholdConfigForDevice as jest.MockedFunction<typeof getThresholdConfigForDevice>;
const mockShouldEnableComponent = shouldEnableComponent as jest.MockedFunction<typeof shouldEnableComponent>;
const mockLogPerformanceTier = logPerformanceTier as jest.MockedFunction<typeof logPerformanceTier>;

const mockUseClientPerformanceMonitor = useClientPerformanceMonitor as jest.MockedFunction<typeof useClientPerformanceMonitor>;
const mockUseEnhancedFpsMonitor = useEnhancedFpsMonitor as jest.MockedFunction<typeof useEnhancedFpsMonitor>;
const mockUsePerformanceMetricsStorage = usePerformanceMetricsStorage as jest.MockedFunction<typeof usePerformanceMetricsStorage>;

// Test component
const TestComponent: React.FC = () => (
  <div data-testid="test-3d-component">3D Component Content</div>
);

const TestFallback: React.FC = () => (
  <div data-testid="test-fallback">Fallback Content</div>
);

describe('ClientPerformanceGate', () => {
  const originalEnv = process.env.NODE_ENV;

  // Mock performance monitor return values
  const mockPerformanceMonitor = {
    metrics: {
      fps: 60,
      frameTime: 16.7,
      performanceLevel: 'excellent' as const,
      isStable: true,
      memoryUsage: 512,
    },
    trends: {
      fpsTrend: 'stable' as const,
      frameTimeTrend: 'stable' as const,
    },
    startMonitoring: jest.fn(),
    stopMonitoring: jest.fn(),
    isMonitoring: false,
  };

  const mockRafFpsMonitor = {
    currentFps: 60,
    averageFps: 58.5,
    threshold: 30,
    isLowFps: false,
    performanceLevel: 'excellent' as const,
    shouldUseFallback: false,
    timeSinceStart: 0,
    isMonitoring: false,
    sustainedLowFpsStart: null,
    startMonitoring: jest.fn(),
    stopMonitoring: jest.fn(),
  };

  const mockMetricsStorage = {
    isEnabled: true,
    logCapabilityMetric: jest.fn(),
    logThresholdMetric: jest.fn(),
    logComponentMetric: jest.fn(),
    logPerformanceMetric: jest.fn(),
    clear: jest.fn(),
    export: jest.fn(),
  };

  const mockHighEndCapabilities = {
    class: 'high-end' as const,
    level: 'high' as const,
    canRender3D: true,
    webGLVersion: 2,
    maxTextureSize: 8192,
    maxViewportDims: [8192, 8192] as [number, number],
    extensions: ['EXT_texture_filter_anisotropic'],
  };

  const mockLowEndCapabilities = {
    class: 'low-end' as const,
    level: 'low' as const,
    canRender3D: false,
    webGLVersion: 1,
    maxTextureSize: 2048,
    maxViewportDims: [2048, 2048] as [number, number],
    extensions: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleLog.mockClear();
    mockConsoleError.mockClear();

    // Setup default mocks
    mockUseClientPerformanceMonitor.mockReturnValue(mockPerformanceMonitor);
    mockUseEnhancedFpsMonitor.mockReturnValue(mockRafFpsMonitor);
    mockUsePerformanceMetricsStorage.mockReturnValue(mockMetricsStorage);

    mockGetThresholdConfigForDevice.mockReturnValue({
      components: {
        candles: true,
        portraits: true,
        snitch: true,
        all: true,
      },
      renderingSettings: {
        particleCount: 100,
        complexityLevel: 'high',
        textureQuality: 'high',
        shadowQuality: 'high',
      },
    });

    // Setup default successful capability detection
    mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
    mockGetPerformanceTier.mockReturnValue('high-end');
    mockShouldEnableComponent.mockReturnValue(true);
    
    // Setup default FPS thresholds
    const mockGetFpsThresholds = getFpsThresholds as jest.MockedFunction<typeof getFpsThresholds>;
    mockGetFpsThresholds.mockReturnValue({
      minimum: 30,
      target: 60,
      degradation: 25,
    });

    // Don't mock setTimeout globally to avoid interfering with testing-library
    // Individual tests can mock it if needed
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
    jest.restoreAllMocks();
  });

  describe('SSR/Static Export Compatibility', () => {
    it('should handle client-side hydration correctly', () => {
      // In test environment, the component immediately becomes client-side
      // This tests that it handles the transition correctly
      const { container } = render(
        <ClientPerformanceGate>
          <TestComponent />
        </ClientPerformanceGate>
      );

      // Should show loading state initially (client-side behavior)
      expect(container.firstChild).not.toBeNull();
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });

    it('should handle static export scenario gracefully', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      render(
        <ClientPerformanceGate componentType="candles">
          <TestComponent />
        </ClientPerformanceGate>
      );

      // Wait for client-side detection
      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockGetDeviceCapabilities).toHaveBeenCalled();
      expect(mockGetPerformanceTier).toHaveBeenCalledWith(mockHighEndCapabilities);
    });
  });

  describe('Client-Side Detection', () => {
    it('should detect high-end device capabilities and enable 3D', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      const onCapabilitiesDetected = jest.fn();

      render(
        <ClientPerformanceGate 
          componentType="candles" 
          onCapabilitiesDetected={onCapabilitiesDetected}
        >
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(onCapabilitiesDetected).toHaveBeenCalledWith(mockHighEndCapabilities);
      expect(mockShouldEnableComponent).toHaveBeenCalledWith('candles', mockHighEndCapabilities);
    });

    it('should detect low-end device capabilities and show fallback', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockLowEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('low-end');
      mockShouldEnableComponent.mockReturnValue(false);

      render(
        <ClientPerformanceGate 
          componentType="snitch"
          fallback={<TestFallback />}
        >
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-fallback')).toBeInTheDocument();
      });

      expect(screen.queryByTestId('test-3d-component')).not.toBeInTheDocument();
      expect(mockShouldEnableComponent).toHaveBeenCalledWith('snitch', mockLowEndCapabilities);
    });

    it('should handle capability detection errors gracefully', async () => {
      const detectionError = new Error('WebGL context creation failed');
      mockGetDeviceCapabilities.mockImplementation(() => {
        throw detectionError;
      });

      render(
        <ClientPerformanceGate fallback={<TestFallback />}>
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-fallback')).toBeInTheDocument();
      });

      expect(mockConsoleError).toHaveBeenCalledWith('Failed to detect device capabilities:', detectionError);
      expect(screen.queryByTestId('test-3d-component')).not.toBeInTheDocument();
    });

    it('should use general component logic when componentType is not specified', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');

      render(
        <ClientPerformanceGate>
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      // Should not call shouldEnableComponent for general type
      expect(mockShouldEnableComponent).not.toHaveBeenCalled();
    });
  });

  describe('Conditional Rendering Logic', () => {
    it('should render loading state initially', () => {
      render(
        <ClientPerformanceGate>
          <TestComponent />
        </ClientPerformanceGate>
      );

      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      expect(screen.getByText('Detecting device capabilities...')).toBeInTheDocument();
    });

    it('should render custom loading component when provided', () => {
      const CustomLoader = () => <div data-testid="custom-loader">Custom Loading...</div>;

      render(
        <ClientPerformanceGate loadingComponent={<CustomLoader />}>
          <TestComponent />
        </ClientPerformanceGate>
      );

      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });

    it('should render default fallback when device cannot render 3D', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockLowEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('low-end');
      mockShouldEnableComponent.mockReturnValue(false);

      render(
        <ClientPerformanceGate componentType="portraits">
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByText('3D effects not supported on this device')).toBeInTheDocument();
      });
    });

    it('should render custom fallback when provided', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockLowEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('low-end');
      mockShouldEnableComponent.mockReturnValue(false);

      render(
        <ClientPerformanceGate 
          componentType="portraits"
          fallback={<TestFallback />}
        >
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-fallback')).toBeInTheDocument();
      });

      expect(screen.queryByText('3D effects not supported on this device')).not.toBeInTheDocument();
    });

    it('should apply className and id props to the container', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      const { container } = render(
        <ClientPerformanceGate 
          className="test-class" 
          id="test-id"
          componentType="candles"
        >
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      const gateContainer = container.firstChild as HTMLElement;
      expect(gateContainer).toHaveClass('test-class');
      expect(gateContainer).toHaveAttribute('id', 'test-id');
    });
  });

  describe('Performance Monitoring Integration', () => {
    it('should start RAF FPS monitoring when 3D component renders', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      render(
        <ClientPerformanceGate 
          componentType="candles"
          enablePerformanceMonitoring={true}
        >
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockRafFpsMonitor.startMonitoring).toHaveBeenCalled();
    });

    it('should not start monitoring when performance monitoring is disabled', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      render(
        <ClientPerformanceGate 
          componentType="candles"
          enablePerformanceMonitoring={false}
        >
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockRafFpsMonitor.startMonitoring).not.toHaveBeenCalled();
    });

    it('should handle performance degradation callback', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      const onPerformanceChange = jest.fn();
      let performanceDegradationCallback: (() => void) | undefined;

      // Capture the performance degradation callback
      mockUseEnhancedFpsMonitor.mockImplementation((componentType, onDegrade, onRecover) => {
        performanceDegradationCallback = onDegrade;
        return mockRafFpsMonitor;
      });

      render(
        <ClientPerformanceGate 
          componentType="candles"
          onPerformanceChange={onPerformanceChange}
        >
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      // Simulate performance degradation
      act(() => {
        performanceDegradationCallback?.();
      });

      expect(onPerformanceChange).toHaveBeenCalledWith(false);
    });

    it('should handle performance recovery callback', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      const onPerformanceChange = jest.fn();
      let performanceRecoveryCallback: (() => void) | undefined;

      // Capture the performance recovery callback
      mockUseEnhancedFpsMonitor.mockImplementation((componentType, onDegrade, onRecover) => {
        performanceRecoveryCallback = onRecover;
        return mockRafFpsMonitor;
      });

      render(
        <ClientPerformanceGate 
          componentType="candles"
          onPerformanceChange={onPerformanceChange}
        >
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      // Simulate performance recovery
      act(() => {
        performanceRecoveryCallback?.();
      });

      expect(onPerformanceChange).toHaveBeenCalledWith(true);
    });
  });

  describe('Performance Thresholds', () => {
    it('should handle low-end device tier correctly', async () => {
      const lowEndConfig = {
        components: {
          candles: false,
          portraits: false,
          snitch: false,
          all: false,
        },
        renderingSettings: {
          particleCount: 10,
          complexityLevel: 'low',
          textureQuality: 'low',
          shadowQuality: 'disabled',
        },
      };

      mockGetDeviceCapabilities.mockReturnValue(mockLowEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('low-end');
      mockGetThresholdConfigForDevice.mockReturnValue(lowEndConfig);
      mockShouldEnableComponent.mockReturnValue(false);

      render(
        <ClientPerformanceGate 
          componentType="candles"
          fallback={<TestFallback />}
        >
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-fallback')).toBeInTheDocument();
      });

      expect(mockGetThresholdConfigForDevice).toHaveBeenCalledWith(mockLowEndCapabilities);
      expect(mockShouldEnableComponent).toHaveBeenCalledWith('candles', mockLowEndCapabilities);
    });

    it('should handle mid-range device tier correctly', async () => {
      const midRangeCapabilities = {
        class: 'mid-range' as const,
        level: 'medium' as const,
        canRender3D: true,
        webGLVersion: 2,
        maxTextureSize: 4096,
        maxViewportDims: [4096, 4096] as [number, number],
        extensions: ['EXT_texture_filter_anisotropic'],
      };

      const midRangeConfig = {
        components: {
          candles: true,
          portraits: false,
          snitch: false,
          all: false,
        },
        renderingSettings: {
          particleCount: 50,
          complexityLevel: 'medium',
          textureQuality: 'medium',
          shadowQuality: 'medium',
        },
      };

      mockGetDeviceCapabilities.mockReturnValue(midRangeCapabilities);
      mockGetPerformanceTier.mockReturnValue('mid-range');
      mockGetThresholdConfigForDevice.mockReturnValue(midRangeConfig);
      mockShouldEnableComponent.mockReturnValue(true);

      render(
        <ClientPerformanceGate componentType="candles">
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockGetPerformanceTier).toHaveBeenCalledWith(midRangeCapabilities);
      expect(mockShouldEnableComponent).toHaveBeenCalledWith('candles', midRangeCapabilities);
    });

    it('should handle high-end device tier correctly', async () => {
      const highEndConfig = {
        components: {
          candles: true,
          portraits: true,
          snitch: true,
          all: true,
        },
        renderingSettings: {
          particleCount: 200,
          complexityLevel: 'high',
          textureQuality: 'high',
          shadowQuality: 'high',
        },
      };

      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockGetThresholdConfigForDevice.mockReturnValue(highEndConfig);
      mockShouldEnableComponent.mockReturnValue(true);

      render(
        <ClientPerformanceGate componentType="snitch">
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockGetThresholdConfigForDevice).toHaveBeenCalledWith(mockHighEndCapabilities);
      expect(mockShouldEnableComponent).toHaveBeenCalledWith('snitch', mockHighEndCapabilities);
    });
  });

  describe('Metrics Storage Integration', () => {
    it('should log capability metrics when metrics storage is enabled', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      render(
        <ClientPerformanceGate componentType="candles">
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockMetricsStorage.logCapabilityMetric).toHaveBeenCalledWith({
        deviceClass: 'high-end',
        performanceLevel: 'high',
        canRender3D: true,
        webGLSupported: true,
        webGL2Supported: true,
        memoryEstimate: 4096,
        cores: expect.any(Number),
        score: 75,
      });
    });

    it('should log threshold metrics when metrics storage is enabled', async () => {
      const thresholdConfig = {
        components: {
          candles: true,
          portraits: true,
          snitch: true,
          all: true,
        },
        renderingSettings: {
          particleCount: 100,
          complexityLevel: 'high',
          textureQuality: 'high',
          shadowQuality: 'high',
        },
      };

      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockGetThresholdConfigForDevice.mockReturnValue(thresholdConfig);
      mockShouldEnableComponent.mockReturnValue(true);

      render(
        <ClientPerformanceGate componentType="candles">
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockMetricsStorage.logThresholdMetric).toHaveBeenCalledWith({
        tier: 'high-end',
        enabledComponents: thresholdConfig.components,
        settings: thresholdConfig.renderingSettings,
      });
    });

    it('should log component decision metrics', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      render(
        <ClientPerformanceGate componentType="candles">
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockMetricsStorage.logComponentMetric).toHaveBeenCalledWith({
        componentType: 'candles',
        shouldRender: true,
        reason: 'device_capable',
        fallbackUsed: false,
      });
    });

    it('should not log metrics when storage is disabled', async () => {
      const disabledMetricsStorage = {
        ...mockMetricsStorage,
        isEnabled: false,
      };

      mockUsePerformanceMetricsStorage.mockReturnValue(disabledMetricsStorage);
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      render(
        <ClientPerformanceGate componentType="candles">
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockMetricsStorage.logCapabilityMetric).not.toHaveBeenCalled();
      expect(mockMetricsStorage.logThresholdMetric).not.toHaveBeenCalled();
      expect(mockMetricsStorage.logComponentMetric).not.toHaveBeenCalled();
    });
  });

  describe('Development Mode Logging', () => {
    it('should log performance tier information in development mode', async () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true });

      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      const thresholdConfig = {
        components: { candles: true, portraits: true, snitch: true, all: true },
        renderingSettings: {
          particleCount: 100,
          complexityLevel: 'high',
          textureQuality: 'high',
          shadowQuality: 'high',
        },
      };

      mockGetThresholdConfigForDevice.mockReturnValue(thresholdConfig);

      render(
        <ClientPerformanceGate componentType="candles">
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockLogPerformanceTier).toHaveBeenCalledWith(mockHighEndCapabilities);
      expect(mockConsoleLog).toHaveBeenCalledWith(
        '[ClientPerformanceGate:candles] Component decision:',
        {
          tier: 'high-end',
          shouldRender: true,
          enabledComponents: thresholdConfig.components,
          settings: thresholdConfig.renderingSettings,
        }
      );
    });

    it('should not log performance information in production mode', async () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true });

      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      render(
        <ClientPerformanceGate componentType="candles">
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockLogPerformanceTier).not.toHaveBeenCalled();
      expect(mockConsoleLog).not.toHaveBeenCalledWith(
        expect.stringContaining('[ClientPerformanceGate:candles]'),
        expect.any(Object)
      );
    });
  });

  describe('Higher-Order Component', () => {
    it('should work as a higher-order component', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      const WrappedComponent = withClientPerformanceGate(TestComponent, {
        componentType: 'portraits',
        fallback: <TestFallback />,
      });

      render(<WrappedComponent />);

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockShouldEnableComponent).toHaveBeenCalledWith('portraits', mockHighEndCapabilities);
    });

    it('should pass props through to wrapped component', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      const PropsTestComponent: React.FC<{ testProp: string }> = ({ testProp }) => (
        <div data-testid="props-component">{testProp}</div>
      );

      const WrappedComponent = withClientPerformanceGate(PropsTestComponent, {
        componentType: 'candles',
      });

      render(<WrappedComponent testProp="test-value" />);

      await waitFor(() => {
        expect(screen.getByTestId('props-component')).toBeInTheDocument();
        expect(screen.getByText('test-value')).toBeInTheDocument();
      });
    });
  });

  describe('Performance Gate Context Hook', () => {
    it('should provide performance gate context', () => {
      const TestConsumer: React.FC = () => {
        const context = usePerformanceGateContext();
        return (
          <div data-testid="context-consumer">
            {context.isPerformanceMonitored ? 'Monitored' : 'Not Monitored'}
          </div>
        );
      };

      render(<TestConsumer />);

      expect(screen.getByTestId('context-consumer')).toBeInTheDocument();
      expect(screen.getByText('Monitored')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle undefined navigator.hardwareConcurrency', async () => {
      const originalNavigator = global.navigator;
      
      // Mock navigator without hardwareConcurrency
      Object.defineProperty(global, 'navigator', {
        value: {},
        writable: true,
      });

      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      render(
        <ClientPerformanceGate componentType="candles">
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockMetricsStorage.logCapabilityMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          cores: 4, // Should default to 4
        })
      );

      // Restore navigator
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('should handle missing navigator object', async () => {
      const originalNavigator = global.navigator;
      
      // Remove navigator entirely
      delete (global as any).navigator;

      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      render(
        <ClientPerformanceGate componentType="candles">
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockMetricsStorage.logCapabilityMetric).toHaveBeenCalledWith(
        expect.objectContaining({
          cores: 4, // Should default to 4
        })
      );

      // Restore navigator
      Object.defineProperty(global, 'navigator', {
        value: originalNavigator,
        writable: true,
      });
    });

    it('should handle performance monitoring disable mid-render', async () => {
      mockGetDeviceCapabilities.mockReturnValue(mockHighEndCapabilities);
      mockGetPerformanceTier.mockReturnValue('high-end');
      mockShouldEnableComponent.mockReturnValue(true);

      const { rerender } = render(
        <ClientPerformanceGate 
          componentType="candles"
          enablePerformanceMonitoring={true}
        >
          <TestComponent />
        </ClientPerformanceGate>
      );

      await waitFor(() => {
        expect(screen.getByTestId('test-3d-component')).toBeInTheDocument();
      });

      expect(mockRafFpsMonitor.startMonitoring).toHaveBeenCalled();

      // Disable performance monitoring
      rerender(
        <ClientPerformanceGate 
          componentType="candles"
          enablePerformanceMonitoring={false}
        >
          <TestComponent />
        </ClientPerformanceGate>
      );

      expect(mockRafFpsMonitor.stopMonitoring).toHaveBeenCalled();
    });
  });
});