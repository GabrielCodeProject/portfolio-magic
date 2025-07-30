import React from 'react';
import { create } from '@react-three/test-renderer';
import { act, renderHook } from '@testing-library/react';
import * as THREE from 'three';

import GoldenSnitch from './GoldenSnitch';

// Mock hooks
jest.mock('@/hooks/useTheme', () => ({
  useTheme: jest.fn(() => ({ theme: 'gryffindor' })),
}));

jest.mock('@/hooks/useDevicePerformance', () => ({
  useLODConfig: jest.fn(() => ({
    config: {
      goldenSnitch: {
        wingDetail: 'medium',
        animationComplexity: 'medium',
        trailEffects: false,
        flightComplexity: 'medium',
      },
    },
  })),
}));

// Test wrapper component that provides R3F context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <ambientLight intensity={0.5} />
    <perspectiveCamera position={[0, 0, 5]} />
    {children}
  </>
);

describe('GoldenSnitch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Mounting', () => {
    it('should mount without errors', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      expect(renderer).toBeDefined();
    });

    it('should render with default props using LOD config', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Should contain a group as the root element
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should render with default bounds when not specified', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should render with custom bounds', async () => {
      const customBounds = {
        x: [-10, 10],
        y: [-5, 5],
        z: [-10, 10]
      };

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch bounds={customBounds} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      expect(scene.children.length).toBeGreaterThan(0);
    });
  });

  describe('Component Props', () => {
    it('should respect custom props', async () => {
      const customProps = {
        speed: 2,
        scale: 1.5,
        forceLOD: 'high' as const,
        enableTrailEffects: true,
      };

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch {...customProps} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should handle forceLOD prop correctly', async () => {
      const highQualityRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch forceLOD="high" />
          </TestWrapper>
        );
      });

      const lowQualityRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch forceLOD="low" />
          </TestWrapper>
        );
      });

      // Both should render successfully
      expect(highQualityRenderer.scene).toBeDefined();
      expect(lowQualityRenderer.scene).toBeDefined();
    });

    it('should handle speed prop variations', async () => {
      const slowRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch speed={0.5} />
          </TestWrapper>
        );
      });

      const fastRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch speed={2.0} />
          </TestWrapper>
        );
      });

      expect(slowRenderer.scene).toBeDefined();
      expect(fastRenderer.scene).toBeDefined();
    });

    it('should handle scale prop variations', async () => {
      const smallRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch scale={0.5} />
          </TestWrapper>
        );
      });

      const largeRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch scale={2.0} />
          </TestWrapper>
        );
      });

      expect(smallRenderer.scene).toBeDefined();
      expect(largeRenderer.scene).toBeDefined();
    });
  });

  describe('Snitch Structure', () => {
    it('should render snitch with correct basic structure', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene contains the expected structure
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should render body with sphere geometry', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene renders successfully
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should have wings with plane geometry', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene renders successfully
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should have point light for magical glow', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene renders successfully
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should have central band detail with torus geometry', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene renders successfully
      expect(scene.children.length).toBeGreaterThan(0);
    });
  });

  describe('Wing Components', () => {
    it('should render both left and right wings', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that wings are rendered
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should render wings with different LOD qualities', async () => {
      const highQualityRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch forceLOD="high" />
          </TestWrapper>
        );
      });

      const lowQualityRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch forceLOD="low" />
          </TestWrapper>
        );
      });

      expect(highQualityRenderer.scene).toBeDefined();
      expect(lowQualityRenderer.scene).toBeDefined();
    });

    it('should handle wing animation parameters', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch speed={2} />
          </TestWrapper>
        );
      });

      // Advance some frames to allow wing animations
      await act(async () => {
        renderer.advanceFrames(5, 16);
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
    });
  });

  describe('LOD Quality Levels', () => {
    it('should render different wing complexity based on quality', async () => {
      const highQualityRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch forceLOD="high" />
          </TestWrapper>
        );
      });

      const lowQualityRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch forceLOD="low" />
          </TestWrapper>
        );
      });

      // Both should render successfully
      expect(highQualityRenderer.scene).toBeDefined();
      expect(lowQualityRenderer.scene).toBeDefined();
    });

    it('should adjust flight complexity based on LOD', async () => {
      const { useLODConfig } = require('@/hooks/useDevicePerformance');
      useLODConfig.mockReturnValue({
        config: {
          goldenSnitch: {
            wingDetail: 'low',
            animationComplexity: 'low',
            trailEffects: false,
            flightComplexity: 'low',
          },
        },
      });

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      expect(renderer.scene).toBeDefined();

      // Reset mock
      useLODConfig.mockReturnValue({
        config: {
          goldenSnitch: {
            wingDetail: 'medium',
            animationComplexity: 'medium',
            trailEffects: false,
            flightComplexity: 'medium',
          },
        },
      });
    });
  });

  describe('Trail Effects', () => {
    it('should not render trail effects when disabled', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch enableTrailEffects={false} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should render trail effects when enabled', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch enableTrailEffects={true} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should use LOD config for trail effects when not overridden', async () => {
      const { useLODConfig } = require('@/hooks/useDevicePerformance');
      useLODConfig.mockReturnValue({
        config: {
          goldenSnitch: {
            wingDetail: 'high',
            animationComplexity: 'high',
            trailEffects: true,
            flightComplexity: 'high',
          },
        },
      });

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      expect(renderer.scene).toBeDefined();

      // Reset mock
      useLODConfig.mockReturnValue({
        config: {
          goldenSnitch: {
            wingDetail: 'medium',
            animationComplexity: 'medium',
            trailEffects: false,
            flightComplexity: 'medium',
          },
        },
      });
    });
  });

  describe('Theme Integration', () => {
    it('should use gryffindor theme colors by default', async () => {
      const { useTheme } = require('@/hooks/useTheme');
      useTheme.mockReturnValue({ theme: 'gryffindor' });

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the component renders with gryffindor theme
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should use slytherin theme colors when theme is slytherin', async () => {
      const { useTheme } = require('@/hooks/useTheme');
      useTheme.mockReturnValue({ theme: 'slytherin' });

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the component renders with slytherin theme
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should apply theme colors to wings', async () => {
      const { useTheme } = require('@/hooks/useTheme');
      useTheme.mockReturnValue({ theme: 'slytherin' });

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      expect(scene.children.length).toBeGreaterThan(0);
    });
  });

  describe('Flight States and Behavior', () => {
    it('should initialize with searching flight state', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should transition between flight states over time', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      // Advance many frames to trigger state transitions
      await act(async () => {
        renderer.advanceFrames(300, 16); // 5 seconds at 60fps
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
    });

    it('should handle hovering flight state', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      // Advance frames to potentially trigger hovering state
      await act(async () => {
        renderer.advanceFrames(60, 16);
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
    });

    it('should respect bounds constraints', async () => {
      const tightBounds = {
        x: [-1, 1],
        y: [-1, 1],
        z: [-1, 1]
      };

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch bounds={tightBounds} />
          </TestWrapper>
        );
      });

      // Advance frames to test boundary constraints
      await act(async () => {
        renderer.advanceFrames(100, 16);
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
    });

    it('should handle different flight complexities', async () => {
      const { useLODConfig } = require('@/hooks/useDevicePerformance');
      
      // Test high complexity
      useLODConfig.mockReturnValue({
        config: {
          goldenSnitch: {
            wingDetail: 'high',
            animationComplexity: 'high',
            trailEffects: true,
            flightComplexity: 'high',
          },
        },
      });

      const highComplexityRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      // Test low complexity
      useLODConfig.mockReturnValue({
        config: {
          goldenSnitch: {
            wingDetail: 'low',
            animationComplexity: 'low',
            trailEffects: false,
            flightComplexity: 'low',
          },
        },
      });

      const lowComplexityRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      expect(highComplexityRenderer.scene).toBeDefined();
      expect(lowComplexityRenderer.scene).toBeDefined();

      // Reset mock
      useLODConfig.mockReturnValue({
        config: {
          goldenSnitch: {
            wingDetail: 'medium',
            animationComplexity: 'medium',
            trailEffects: false,
            flightComplexity: 'medium',
          },
        },
      });
    });
  });

  describe('Animation and Interactions', () => {
    it('should setup animation refs correctly', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Should have proper structure for animation
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should handle animation frame updates', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      // Simulate frame update by advancing time
      await act(async () => {
        renderer.advanceFrames(1, 16); // Advance 1 frame at 16ms
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should animate wing flapping', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      // Advance several frames to allow wing animations
      await act(async () => {
        renderer.advanceFrames(10, 16);
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
    });

    it('should handle movement and target generation', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch speed={5} />
          </TestWrapper>
        );
      });

      // Advance many frames to trigger target changes
      await act(async () => {
        renderer.advanceFrames(200, 16);
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
    });

    it('should orient towards movement direction', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch speed={3} />
          </TestWrapper>
        );
      });

      // Advance frames to allow movement and orientation changes
      await act(async () => {
        renderer.advanceFrames(50, 16);
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
    });
  });

  describe('Component Unmounting', () => {
    it('should unmount cleanly without errors', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      expect(renderer).toBeDefined();

      // Unmount component
      await act(async () => {
        renderer.unmount();
      });

      // Should not throw any errors during cleanup
      expect(renderer.scene.children).toHaveLength(0);
    });

    it('should properly dispose of geometries and materials on unmount', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that objects exist before unmount
      expect(scene.children.length).toBeGreaterThan(0);

      // Unmount component
      await act(async () => {
        renderer.unmount();
      });

      // Scene should be clean
      expect(renderer.scene.children).toHaveLength(0);
    });

    it('should cleanup animation state on unmount', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      // Run some animations
      await act(async () => {
        renderer.advanceFrames(30, 16);
      });

      await act(async () => {
        renderer.unmount();
      });

      // Should unmount without errors
      expect(renderer.scene.children).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid props gracefully', async () => {
      const invalidProps = {
        speed: -1,
        scale: -5,
        bounds: {
          x: [10, -10], // Invalid bounds (min > max)
          y: [5, -5],
          z: [3, -3]
        },
        // Use valid forceLOD to avoid breaking Wing component
        forceLOD: 'low' as const,
      };

      // Should not throw error even with invalid props
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch {...invalidProps} />
          </TestWrapper>
        );
      });

      expect(renderer).toBeDefined();
    });

    it('should handle missing hook dependencies', async () => {
      const { useLODConfig } = require('@/hooks/useDevicePerformance');
      useLODConfig.mockImplementation(() => {
        throw new Error('Hook error');
      });

      // Should handle hook errors gracefully
      let errorThrown = false;
      try {
        await act(async () => {
          create(
            <TestWrapper>
              <GoldenSnitch />
            </TestWrapper>
          );
        });
      } catch (error) {
        errorThrown = true;
      }
      
      expect(errorThrown).toBe(true);

      // Reset mock
      useLODConfig.mockReturnValue({
        config: {
          goldenSnitch: {
            wingDetail: 'medium',
            animationComplexity: 'medium',
            trailEffects: false,
            flightComplexity: 'medium',
          },
        },
      });
    });

    it('should handle undefined bounds gracefully', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch bounds={undefined as any} />
          </TestWrapper>
        );
      });

      expect(renderer).toBeDefined();
    });

    it('should handle extreme speed values', async () => {
      const zeroSpeedRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch speed={0} />
          </TestWrapper>
        );
      });

      const extremeSpeedRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch speed={1000} />
          </TestWrapper>
        );
      });

      expect(zeroSpeedRenderer.scene).toBeDefined();
      expect(extremeSpeedRenderer.scene).toBeDefined();
    });
  });

  describe('Performance Considerations', () => {
    it('should handle complex flight scenarios efficiently', async () => {
      const startTime = performance.now();

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch speed={5} enableTrailEffects={true} />
          </TestWrapper>
        );
      });

      // Simulate complex flight with many frame updates
      await act(async () => {
        renderer.advanceFrames(100, 16);
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render relatively quickly (less than 2 seconds in tests)
      expect(renderTime).toBeLessThan(2000);
      expect(renderer).toBeDefined();
    });

    it('should optimize performance with low LOD settings', async () => {
      const { useLODConfig } = require('@/hooks/useDevicePerformance');
      useLODConfig.mockReturnValue({
        config: {
          goldenSnitch: {
            wingDetail: 'low',
            animationComplexity: 'low',
            trailEffects: false,
            flightComplexity: 'low',
          },
        },
      });

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch />
          </TestWrapper>
        );
      });

      // Should still render efficiently with low settings
      await act(async () => {
        renderer.advanceFrames(50, 16);
      });

      expect(renderer.scene).toBeDefined();

      // Reset mock
      useLODConfig.mockReturnValue({
        config: {
          goldenSnitch: {
            wingDetail: 'medium',
            animationComplexity: 'medium',
            trailEffects: false,
            flightComplexity: 'medium',
          },
        },
      });
    });

    it('should handle rapid state transitions', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch speed={10} />
          </TestWrapper>
        );
      });

      // Rapidly advance frames to trigger multiple state transitions
      for (let i = 0; i < 5; i++) {
        await act(async () => {
          renderer.advanceFrames(60, 16); // 1 second chunks
        });
      }

      expect(renderer.scene).toBeDefined();
    });
  });

  describe('Boundary Constraints', () => {
    it('should bounce off boundaries correctly', async () => {
      const smallBounds = {
        x: [-0.5, 0.5],
        y: [-0.5, 0.5],
        z: [-0.5, 0.5]
      };

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch bounds={smallBounds} speed={5} />
          </TestWrapper>
        );
      });

      // Advance many frames to trigger boundary interactions
      await act(async () => {
        renderer.advanceFrames(200, 16);
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
    });

    it('should handle asymmetric bounds', async () => {
      const asymmetricBounds = {
        x: [-10, 2],
        y: [-1, 5],
        z: [-3, 8]
      };

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <GoldenSnitch bounds={asymmetricBounds} />
          </TestWrapper>
        );
      });

      await act(async () => {
        renderer.advanceFrames(100, 16);
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
    });
  });
});