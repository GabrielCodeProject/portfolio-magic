'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { getDeviceCapabilities, canRenderComponent, type DeviceCapabilities } from '@/utils/deviceCapabilities';
import { 
  getPerformanceTier, 
  getThresholdConfigForDevice, 
  shouldEnableComponent,
  getFpsThresholds,
  logPerformanceTier,
  type PerformanceTier 
} from '@/utils/performanceThresholds';
import { useClientPerformanceMonitor } from '@/hooks/useClientPerformanceMonitor';
import { useEnhancedFpsMonitor } from '@/hooks/useRAFFpsMonitor';
import { usePerformanceMetricsStorage } from '@/utils/performanceMetricsStorage';
import { LoadingSpinner } from '@/components/ui';

// Props for the ClientPerformanceGate component
interface ClientPerformanceGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  componentType?: 'candles' | 'portraits' | 'snitch' | 'general';
  enablePerformanceMonitoring?: boolean;
  minFpsThreshold?: number;
  sustainedCheckDuration?: number; // milliseconds
  onPerformanceChange?: (isGoodPerformance: boolean) => void;
  onCapabilitiesDetected?: (capabilities: DeviceCapabilities) => void;
  loadingComponent?: React.ReactNode;
  className?: string;
  id?: string;
}

// Internal state for performance gate
interface PerformanceGateState {
  isClient: boolean;
  capabilities: DeviceCapabilities | null;
  performanceTier: PerformanceTier | null;
  shouldRender3D: boolean;
  isPerformanceGood: boolean;
  isLoading: boolean;
  hasError: boolean;
  errorMessage?: string;
}

/**
 * ClientPerformanceGate Component
 * 
 * A gate component that conditionally renders 3D components based on:
 * - Client-side device capability detection
 * - Real-time performance monitoring
 * - Static export compatibility
 * 
 * Features:
 * - Hydration-safe client-side detection
 * - Progressive enhancement approach
 * - Automatic fallback to 2D components
 * - Real-time FPS monitoring with thresholds
 * - Development mode performance logging
 */
export function ClientPerformanceGate({
  children,
  fallback,
  componentType = 'general',
  enablePerformanceMonitoring = true,
  minFpsThreshold = 30,
  sustainedCheckDuration = 5000,
  onPerformanceChange,
  onCapabilitiesDetected,
  loadingComponent,
  className,
  id,
}: ClientPerformanceGateProps) {
  // State management
  const [state, setState] = useState<PerformanceGateState>({
    isClient: false,
    capabilities: null,
    performanceTier: null,
    shouldRender3D: false,
    isPerformanceGood: true,
    isLoading: true,
    hasError: false,
  });

  // Initialize metrics storage
  const metricsStorage = usePerformanceMetricsStorage(enablePerformanceMonitoring);

  // Get tier-specific FPS thresholds
  const tierFpsThresholds = state.performanceTier ? getFpsThresholds(state.performanceTier) : null;
  const effectiveMinFps = tierFpsThresholds?.minimum || minFpsThreshold;

  // Enhanced RAF-based FPS monitoring with 30 FPS threshold and 5-second sustained check
  const rafFpsMonitor = useEnhancedFpsMonitor(
    componentType !== 'general' ? componentType : 'general',
    () => {
      // Performance degradation detected - switch to fallback
      setState(prev => ({ ...prev, isPerformanceGood: false }));
      onPerformanceChange?.(false);
    },
    () => {
      // Performance recovered - re-enable 3D
      setState(prev => ({ ...prev, isPerformanceGood: true }));
      onPerformanceChange?.(true);
    }
  );

  // Legacy performance monitoring (kept for compatibility)
  const performanceMonitor = useClientPerformanceMonitor({
    enabled: enablePerformanceMonitoring && state.shouldRender3D,
    sampleInterval: 100,
    historySize: 50,
    fpsThresholds: {
      excellent: tierFpsThresholds?.target || 55,
      good: tierFpsThresholds?.minimum || (minFpsThreshold + 10),
      fair: tierFpsThresholds?.degradation || minFpsThreshold,
    },
    autoOptimize: false,
  });

  // Client-side capability detection
  useEffect(() => {
    // Mark as client-side to avoid hydration mismatches
    setState(prev => ({ ...prev, isClient: true }));

    // Detect capabilities asynchronously to avoid blocking
    const detectCapabilities = async () => {
      try {
        // Add small delay to ensure DOM is ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const capabilities = getDeviceCapabilities();
        const performanceTier = getPerformanceTier(capabilities);
        const thresholdConfig = getThresholdConfigForDevice(capabilities);
        
        // Determine if this specific component should render using new threshold system
        let shouldRender = capabilities.canRender3D;
        if (componentType !== 'general') {
          shouldRender = shouldEnableComponent(componentType, capabilities);
        }

        setState(prev => ({
          ...prev,
          capabilities,
          performanceTier,
          shouldRender3D: shouldRender,
          isLoading: false,
        }));

        // Notify parent component
        onCapabilitiesDetected?.(capabilities);

        // Log metrics to storage
        if (metricsStorage.isEnabled) {
          // Log capability metrics
          metricsStorage.logCapabilityMetric({
            deviceClass: capabilities.class,
            performanceLevel: capabilities.level,
            canRender3D: capabilities.canRender3D,
            webGLSupported: true, // We know this if we got here
            webGL2Supported: true, // Assume true for now, could be enhanced
            memoryEstimate: 4096, // Could be enhanced with actual detection
            cores: typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4,
            score: 75, // Could calculate actual score
          });

          // Log threshold metrics
          metricsStorage.logThresholdMetric({
            tier: performanceTier,
            enabledComponents: thresholdConfig.components,
            settings: thresholdConfig.renderingSettings,
          });

          // Log component decision
          metricsStorage.logComponentMetric({
            componentType,
            shouldRender,
            reason: shouldRender ? 'device_capable' : 'device_insufficient',
            fallbackUsed: !shouldRender,
          });
        }

        // Log performance tier information in development
        if (process.env.NODE_ENV === 'development') {
          logPerformanceTier(capabilities);
          console.log(`[ClientPerformanceGate:${componentType}] Component decision:`, {
            tier: performanceTier,
            shouldRender,
            enabledComponents: thresholdConfig.components,
            settings: thresholdConfig.renderingSettings,
          });
        }
      } catch (error) {
        console.error('Failed to detect device capabilities:', error);
        setState(prev => ({
          ...prev,
          hasError: true,
          errorMessage: error instanceof Error ? error.message : 'Unknown error',
          shouldRender3D: false,
          isLoading: false,
        }));
      }
    };

    detectCapabilities();
  }, [componentType, onCapabilitiesDetected]);

  // RAF-based FPS monitoring is now handled automatically by useEnhancedFpsMonitor
  // The monitoring starts when the component should render 3D and stops when disabled
  useEffect(() => {
    // Enable/disable RAF monitoring based on 3D rendering state and user preference
    if (enablePerformanceMonitoring && state.shouldRender3D) {
      if (!rafFpsMonitor.isMonitoring) {
        rafFpsMonitor.startMonitoring();
      }
    } else {
      if (rafFpsMonitor.isMonitoring) {
        rafFpsMonitor.stopMonitoring();
      }
    }
  }, [enablePerformanceMonitoring, state.shouldRender3D, rafFpsMonitor]);

  // SSR/Static generation: return nothing to avoid hydration issues
  if (!state.isClient) {
    return null;
  }

  // Loading state
  if (state.isLoading) {
    return (
      <div className={className} id={id}>
        {loadingComponent || (
          <div className="flex items-center justify-center p-4">
            <LoadingSpinner 
              size="sm" 
              variant="magical" 
              text="Detecting device capabilities..." 
            />
          </div>
        )}
      </div>
    );
  }

  // Error state
  if (state.hasError) {
    return (
      <div className={className} id={id}>
        {fallback || (
          <div className="flex items-center justify-center p-4 text-theme-text-muted">
            <span className="text-sm">3D effects unavailable</span>
          </div>
        )}
      </div>
    );
  }

  // Determine what to render based on capabilities and performance
  const shouldShowFallback = !state.shouldRender3D || !state.isPerformanceGood;

  if (shouldShowFallback) {
    return (
      <div className={className} id={id}>
        {fallback || (
          <div className="flex items-center justify-center p-4 text-theme-text-muted">
            <span className="text-sm">
              {!state.shouldRender3D 
                ? "3D effects not supported on this device" 
                : "Using optimized version for better performance"}
            </span>
          </div>
        )}
      </div>
    );
  }

  // Render 3D content with error boundary
  return (
    <div className={className} id={id}>
      <Suspense 
        fallback={
          loadingComponent || (
            <div className="flex items-center justify-center p-4">
              <LoadingSpinner 
                size="sm" 
                variant="magical" 
                text="Loading 3D component..." 
              />
            </div>
          )
        }
      >
        <PerformanceWrapper
          performanceMonitor={performanceMonitor}
          rafFpsMonitor={rafFpsMonitor}
          componentType={componentType}
          enableMonitoring={enablePerformanceMonitoring}
        >
          {children}
        </PerformanceWrapper>
      </Suspense>
    </div>
  );
}

/**
 * Wrapper component that provides performance context to 3D components
 */
interface PerformanceWrapperProps {
  children: React.ReactNode;
  performanceMonitor: ReturnType<typeof useClientPerformanceMonitor>;
  rafFpsMonitor: ReturnType<typeof useEnhancedFpsMonitor>;
  componentType: string;
  enableMonitoring: boolean;
}

function PerformanceWrapper({ 
  children, 
  performanceMonitor, 
  rafFpsMonitor,
  componentType, 
  enableMonitoring 
}: PerformanceWrapperProps) {
  useEffect(() => {
    if (!enableMonitoring) return;

    // Log RAF-based FPS metrics in development (primary monitoring)
    if (process.env.NODE_ENV === 'development') {
      const logInterval = setInterval(() => {
        console.log(`[RAF-FPS:${componentType}]`, {
          currentFps: rafFpsMonitor.currentFps.toFixed(1),
          averageFps: rafFpsMonitor.averageFps.toFixed(1),
          threshold: rafFpsMonitor.threshold,
          isLowFps: rafFpsMonitor.isLowFps,
          performanceLevel: rafFpsMonitor.performanceLevel,
          shouldUseFallback: rafFpsMonitor.shouldUseFallback,
          timeSinceStart: rafFpsMonitor.timeSinceStart,
          monitoring: rafFpsMonitor.isMonitoring,
        });

        // Also log legacy monitor for comparison
        const { metrics, trends } = performanceMonitor;
        console.log(`[Legacy:${componentType}]`, {
          fps: metrics.fps,
          frameTime: metrics.frameTime,
          level: metrics.performanceLevel,
          stable: metrics.isStable,
          trend: trends.fpsTrend,
        });
      }, 5000);

      return () => clearInterval(logInterval);
    }
  }, [performanceMonitor, rafFpsMonitor, componentType, enableMonitoring]);

  return <>{children}</>;
}

/**
 * Higher-order component version of ClientPerformanceGate
 */
export function withClientPerformanceGate<P extends object>(
  Component: React.ComponentType<P>,
  gateProps?: Partial<ClientPerformanceGateProps>
) {
  return function WrappedComponent(props: P) {
    return (
      <ClientPerformanceGate {...gateProps}>
        <Component {...props} />
      </ClientPerformanceGate>
    );
  };
}

/**
 * Hook for accessing performance gate context (for child components)
 */
export function usePerformanceGateContext() {
  // This would be used by child 3D components to access performance info
  // For now, return a simple interface
  return {
    isPerformanceMonitored: true,
    // Add more context as needed
  };
}

/**
 * Utility component for development-mode performance debugging
 * Now shows RAF-based FPS monitoring data
 */
export function PerformanceDebugger({ 
  performanceMonitor,
  rafFpsMonitor,
  position = 'top-right' 
}: {
  performanceMonitor?: ReturnType<typeof useClientPerformanceMonitor>;
  rafFpsMonitor?: ReturnType<typeof useEnhancedFpsMonitor>;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}) {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 bg-black/80 text-white p-3 rounded-lg text-xs font-mono`}>
      <div className="font-bold mb-2">RAF FPS Monitor</div>
      
      {rafFpsMonitor && (
        <>
          <div className="text-yellow-400">Current: {rafFpsMonitor.currentFps.toFixed(1)} FPS</div>
          <div className="text-blue-400">Average: {rafFpsMonitor.averageFps.toFixed(1)} FPS</div>
          <div>Threshold: {rafFpsMonitor.threshold} FPS</div>
          <div className={rafFpsMonitor.isLowFps ? 'text-red-400' : 'text-green-400'}>
            Status: {rafFpsMonitor.isLowFps ? 'LOW FPS' : 'GOOD'}
          </div>
          <div>Level: {rafFpsMonitor.performanceLevel}</div>
          <div>Monitoring: {rafFpsMonitor.isMonitoring ? '✓' : '✗'}</div>
          {rafFpsMonitor.sustainedLowFpsStart && (
            <div className="text-red-400">
              Low FPS: {Math.round(rafFpsMonitor.timeSinceStart / 1000)}s
            </div>
          )}
        </>
      )}

      {performanceMonitor && (
        <>
          <div className="border-t border-gray-600 mt-2 pt-2">
            <div className="font-bold mb-1">Legacy Monitor</div>
            <div>FPS: {performanceMonitor.metrics.fps.toFixed(1)}</div>
            <div>Frame: {performanceMonitor.metrics.frameTime.toFixed(1)}ms</div>
            <div>Stable: {performanceMonitor.metrics.isStable ? '✓' : '✗'}</div>
            {performanceMonitor.metrics.memoryUsage && (
              <div>Memory: {performanceMonitor.metrics.memoryUsage.toFixed(1)}MB</div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default ClientPerformanceGate;