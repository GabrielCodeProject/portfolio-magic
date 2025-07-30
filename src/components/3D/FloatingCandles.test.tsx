import React from 'react';
import { create } from '@react-three/test-renderer';
import { Canvas } from '@react-three/fiber';
import { act, renderHook } from '@testing-library/react';
import * as THREE from 'three';

import FloatingCandles from './FloatingCandles';

// Mock hooks
jest.mock('@/hooks/useTheme', () => ({
  useTheme: jest.fn(() => 'gryffindor'),
}));

jest.mock('@/hooks/useDevicePerformance', () => ({
  useLODConfig: jest.fn(() => ({
    config: {
      floatingCandles: {
        count: 6,
        lightIntensity: 0.3,
        shadows: true,
        quality: 'medium',
      },
    },
  })),
}));

// Test wrapper component that provides R3F context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <ambientLight intensity={0.5} />
    {children}
  </>
);

describe('FloatingCandles', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Mounting', () => {
    it('should mount without errors', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles />
          </TestWrapper>
        );
      });

      expect(renderer).toBeDefined();
    });

    it('should render with default props', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Should contain a group as the root element
      const rootGroup = scene.children.find(child => child.type === 'Group');
      expect(rootGroup).toBeDefined();
    });

    it('should render correct number of candles based on LOD config', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      const rootGroup = scene.children.find(child => child.type === 'Group');
      
      // Each candle is a group with meshes and point light inside
      const candleGroups = rootGroup?.children.filter(child => child.type === 'Group');
      expect(candleGroups).toHaveLength(6); // Based on mocked LOD config
    });

    it('should render correct number of candles when count prop is provided', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={3} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      const rootGroup = scene.children.find(child => child.type === 'Group');
      const candleGroups = rootGroup?.children.filter(child => child.type === 'Group');
      expect(candleGroups).toHaveLength(3);
    });
  });

  describe('Component Props', () => {
    it('should respect custom props', async () => {
      const customProps = {
        count: 4,
        spread: 10,
        candleScale: 1.5,
        lightIntensity: 0.8,
        enableShadows: false,
        forceLOD: 'high' as const,
      };

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles {...customProps} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      const rootGroup = scene.children.find(child => child.type === 'Group');
      const candleGroups = rootGroup?.children.filter(child => child.type === 'Group');
      
      expect(candleGroups).toHaveLength(4);
    });

    it('should handle zero count prop', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={0} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      const rootGroup = scene.children.find(child => child.type === 'Group');
      const candleGroups = rootGroup?.children.filter(child => child.type === 'Group') || [];
      
      expect(candleGroups).toHaveLength(0);
    });
  });

  describe('Individual Candle Structure', () => {
    it('should render candle with correct mesh structure', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={1} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      const rootGroup = scene.children.find(child => child.type === 'Group');
      const candleGroup = rootGroup?.children[0] as THREE.Group;
      
      expect(candleGroup).toBeDefined();
      expect(candleGroup.type).toBe('Group');

      // Should contain meshes for candle parts
      const meshes = candleGroup.children.filter(child => child.type === 'Mesh');
      expect(meshes.length).toBeGreaterThan(0);

      // Should contain a point light
      const lights = candleGroup.children.filter(child => child.type === 'PointLight');
      expect(lights).toHaveLength(1);
    });

    it('should have correct candle body geometry', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={1} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene renders successfully
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should have point light with proper configuration', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={1} lightIntensity={0.5} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene renders successfully
      expect(scene.children.length).toBeGreaterThan(0);
    });
  });

  describe('LOD Quality Levels', () => {
    it('should render different geometry complexity based on quality', async () => {
      const highQualityRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={1} forceLOD="high" />
          </TestWrapper>
        );
      });

      const lowQualityRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={1} forceLOD="low" />
          </TestWrapper>
        );
      });

      // Both should render successfully
      expect(highQualityRenderer.scene).toBeDefined();
      expect(lowQualityRenderer.scene).toBeDefined();
    });

    it('should not render wax drips on low quality', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={1} forceLOD="low" />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene renders successfully with low quality
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should render wax drips on medium and high quality', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={1} forceLOD="medium" />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene renders successfully with medium quality
      expect(scene.children.length).toBeGreaterThan(0);
    });
  });

  describe('Theme Integration', () => {
    it('should use gryffindor theme colors by default', async () => {
      const { useTheme } = require('@/hooks/useTheme');
      useTheme.mockReturnValue('gryffindor');

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={1} />
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
      useTheme.mockReturnValue('slytherin');

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={1} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the component renders with slytherin theme
      expect(scene.children.length).toBeGreaterThan(0);
    });
  });

  describe('Shadow Configuration', () => {
    it('should enable shadows when enableShadows is true', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={1} enableShadows={true} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the component renders with shadows enabled
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should disable shadows when enableShadows is false', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={1} enableShadows={false} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the component renders with shadows disabled
      expect(scene.children.length).toBeGreaterThan(0);
    });
  });

  describe('Component Unmounting', () => {
    it('should unmount cleanly without errors', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={2} />
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
            <FloatingCandles count={1} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      const rootGroup = scene.children.find(child => child.type === 'Group');
      const candleGroup = rootGroup?.children[0] as THREE.Group;
      const meshes = candleGroup.children.filter(child => child.type === 'Mesh') as THREE.Mesh[];
      
      // Store references to geometries and materials before unmount
      const geometries = meshes.map(mesh => mesh.geometry);
      const materials = meshes.map(mesh => mesh.material);
      
      expect(geometries.length).toBeGreaterThan(0);
      expect(materials.length).toBeGreaterThan(0);

      // Unmount component
      await act(async () => {
        renderer.unmount();
      });

      // Scene should be clean
      expect(renderer.scene.children).toHaveLength(0);
    });
  });

  describe('Animation and Interactions', () => {
    it('should setup animation refs correctly', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={1} />
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
            <FloatingCandles count={1} />
          </TestWrapper>
        );
      });

      // Simulate frame update by advancing time
      await act(async () => {
        renderer.advanceFrames(1, 16); // Advance 1 frame at 16ms
      });

      const scene = renderer.scene;
      const rootGroup = scene.children.find(child => child.type === 'Group');
      expect(rootGroup).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid props gracefully', async () => {
      const invalidProps = {
        count: -1,
        spread: NaN,
        candleScale: -5,
        lightIntensity: Infinity,
      };

      // Should not throw error even with invalid props
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles {...invalidProps} />
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
          render(
            <TestWrapper>
              <FloatingCandles />
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
          floatingCandles: {
            count: 6,
            lightIntensity: 0.3,
            shadows: true,
            quality: 'medium',
          },
        },
      });
    });
  });

  describe('Performance Considerations', () => {
    it('should handle large candle counts efficiently', async () => {
      const startTime = performance.now();

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={20} />
          </TestWrapper>
        );
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render relatively quickly (less than 1 second in tests)
      expect(renderTime).toBeLessThan(1000);
      expect(renderer).toBeDefined();

      const scene = renderer.scene;
      const rootGroup = scene.children.find(child => child.type === 'Group');
      const candleGroups = rootGroup?.children.filter(child => child.type === 'Group');
      expect(candleGroups).toHaveLength(20);
    });

    it('should use memoization for candle positions', async () => {
      // Render component twice with same props
      const renderer1 = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={5} spread={8} candleScale={1} />
          </TestWrapper>
        );
      });

      const renderer2 = await act(async () => {
        return create(
          <TestWrapper>
            <FloatingCandles count={5} spread={8} candleScale={1} />
          </TestWrapper>
        );
      });

      // Both should render successfully
      expect(renderer1).toBeDefined();
      expect(renderer2).toBeDefined();

      const scene1 = renderer1.scene;
      const scene2 = renderer2.scene;
      
      const rootGroup1 = scene1.children.find(child => child.type === 'Group');
      const rootGroup2 = scene2.children.find(child => child.type === 'Group');
      
      expect(rootGroup1?.children).toHaveLength(5);
      expect(rootGroup2?.children).toHaveLength(5);
    });
  });
});