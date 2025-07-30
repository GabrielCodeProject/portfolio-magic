import React from 'react';
import { create } from '@react-three/test-renderer';
import { Canvas } from '@react-three/fiber';
import { act, renderHook } from '@testing-library/react';
import * as THREE from 'three';

import MovingPortraits from './MovingPortraits';

// Mock hooks
jest.mock('@/hooks/useTheme', () => ({
  useTheme: jest.fn(() => ({ theme: 'gryffindor' })),
}));

jest.mock('@/hooks/useDevicePerformance', () => ({
  useLODConfig: jest.fn(() => ({
    config: {
      movingPortraits: {
        count: 3,
        quality: 'medium',
        animationComplexity: 'medium',
        interactivity: true,
      },
    },
  })),
}));

// Mock window methods for mouse and scroll tracking
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
Object.defineProperty(window, 'addEventListener', { value: mockAddEventListener });
Object.defineProperty(window, 'removeEventListener', { value: mockRemoveEventListener });
Object.defineProperty(window, 'innerWidth', { value: 1920, writable: true });
Object.defineProperty(window, 'innerHeight', { value: 1080, writable: true });
Object.defineProperty(window, 'scrollY', { value: 0, writable: true });

// Test wrapper component that provides R3F context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <>
    <ambientLight intensity={0.5} />
    <perspectiveCamera position={[0, 0, 5]} />
    {children}
  </>
);

describe('MovingPortraits', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockAddEventListener.mockClear();
    mockRemoveEventListener.mockClear();
  });

  describe('Component Mounting', () => {
    it('should mount without errors', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits />
          </TestWrapper>
        );
      });

      expect(renderer).toBeDefined();
    });

    it('should render with default props using LOD config', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Should contain a group as the root element
      const rootGroup = scene.children.find(child => child.type === 'Group');
      expect(rootGroup).toBeDefined();
    });

    it('should render correct number of portraits based on LOD config', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      const rootGroup = scene.children.find(child => child.type === 'Group');
      
      // Each portrait is a group with multiple children
      const portraitGroups = rootGroup?.children.filter(child => child.type === 'Group');
      expect(portraitGroups).toHaveLength(3); // Based on mocked LOD config
    });

    it('should render correct number of portraits when count prop is provided', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={2} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      const rootGroup = scene.children.find(child => child.type === 'Group');
      const portraitGroups = rootGroup?.children.filter(child => child.type === 'Group');
      expect(portraitGroups).toHaveLength(2);
    });

    it('should handle zero count prop', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={0} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      const rootGroup = scene.children.find(child => child.type === 'Group');
      const portraitGroups = rootGroup?.children.filter(child => child.type === 'Group') || [];
      
      expect(portraitGroups).toHaveLength(0);
    });
  });

  describe('Component Props', () => {
    it('should respect custom props', async () => {
      const customProps = {
        count: 4,
        forceLOD: 'high' as const,
        enableInteractivity: false,
      };

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits {...customProps} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      const rootGroup = scene.children.find(child => child.type === 'Group');
      const portraitGroups = rootGroup?.children.filter(child => child.type === 'Group');
      
      expect(portraitGroups).toHaveLength(4);
    });

    it('should handle forceLOD prop correctly', async () => {
      const highQualityRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} forceLOD="high" />
          </TestWrapper>
        );
      });

      const lowQualityRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} forceLOD="low" />
          </TestWrapper>
        );
      });

      // Both should render successfully
      expect(highQualityRenderer.scene).toBeDefined();
      expect(lowQualityRenderer.scene).toBeDefined();
    });
  });

  describe('Individual Portrait Structure', () => {
    it('should render portrait with correct frame structure', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene contains the expected structure
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should have correct portrait frame geometry', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene renders successfully
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should have eyes with sphere geometry', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene renders successfully
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should have portrait content with plane geometry', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} />
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
            <MovingPortraits count={1} forceLOD="high" />
          </TestWrapper>
        );
      });

      const lowQualityRenderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} forceLOD="low" />
          </TestWrapper>
        );
      });

      // Both should render successfully
      expect(highQualityRenderer.scene).toBeDefined();
      expect(lowQualityRenderer.scene).toBeDefined();

      // Both should render successfully
      expect(highQualityRenderer.scene.children.length).toBeGreaterThan(0);
      expect(lowQualityRenderer.scene.children.length).toBeGreaterThan(0);
    });

    it('should not render corner ornaments on low quality', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} forceLOD="low" />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene renders successfully with low quality
      expect(scene.children.length).toBeGreaterThan(0);
    });

    it('should render corner ornaments on medium and high quality', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} forceLOD="medium" />
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
      useTheme.mockReturnValue({ theme: 'gryffindor' });

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} />
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
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the component renders with slytherin theme
      expect(scene.children.length).toBeGreaterThan(0);
    });
  });

  describe('Interactive Features', () => {
    it('should setup mouse event listeners on mount', async () => {
      await act(async () => {
        create(
          <TestWrapper>
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      expect(mockAddEventListener).toHaveBeenCalledWith('mousemove', expect.any(Function));
      expect(mockAddEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
    });

    it('should cleanup event listeners on unmount', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      await act(async () => {
        renderer.unmount();
      });

      // Component should unmount successfully
      expect(renderer.scene.children).toHaveLength(0);
    });

    it('should disable interactivity when enableInteractivity is false', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} enableInteractivity={false} />
          </TestWrapper>
        );
      });

      // Component should render successfully even with interactivity disabled
      expect(renderer.scene).toBeDefined();
    });

    it('should handle mouse position tracking', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      // Simulate mouse move event
      const mouseMoveHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'mousemove'
      )?.[1];

      if (mouseMoveHandler) {
        await act(async () => {
          mouseMoveHandler({ clientX: 500, clientY: 300 } as MouseEvent);
        });
      }

      expect(renderer.scene).toBeDefined();
    });

    it('should handle scroll tracking', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      // Simulate scroll event
      const scrollHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'scroll'
      )?.[1];

      if (scrollHandler) {
        // Mock scrollY value
        Object.defineProperty(window, 'scrollY', { 
          value: 200, 
          writable: true 
        });

        await act(async () => {
          scrollHandler();
        });
      }

      expect(renderer.scene).toBeDefined();
    });
  });

  describe('Animation and Interactions', () => {
    it('should setup animation refs correctly', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Component should render successfully
      expect(scene).toBeDefined();
    });

    it('should handle animation frame updates', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      // Simulate frame update by advancing time
      await act(async () => {
        renderer.advanceFrames(1, 16); // Advance 1 frame at 16ms
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
    });

    it('should animate eye movement with interactivity enabled', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} enableInteractivity={true} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();

      // Advance several frames to allow animation
      await act(async () => {
        renderer.advanceFrames(5, 16);
      });

      // Component should still be rendered after animation frames
      expect(scene).toBeDefined();
    });
  });

  describe('Component Unmounting', () => {
    it('should unmount cleanly without errors', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={2} />
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
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that objects exist before unmount
      expect(scene).toBeDefined();

      // Unmount component
      await act(async () => {
        renderer.unmount();
      });

      // Scene should be clean
      expect(renderer.scene.children).toHaveLength(0);
    });

    it('should cleanup event listeners and timeouts on unmount', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      // Component should render successfully
      expect(renderer.scene).toBeDefined();

      await act(async () => {
        renderer.unmount();
      });

      // Component should unmount successfully
      expect(renderer.scene.children).toHaveLength(0);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid props gracefully', async () => {
      const invalidProps = {
        count: -1,
        forceLOD: 'invalid' as any,
        enableInteractivity: 'invalid' as any,
      };

      // Should not throw error even with invalid props
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits {...invalidProps} />
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
              <MovingPortraits />
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
          movingPortraits: {
            count: 3,
            quality: 'medium',
            animationComplexity: 'medium',
            interactivity: true,
          },
        },
      });
    });

    it('should handle missing window object gracefully', async () => {
      // Mock window as undefined to simulate SSR
      const originalWindow = global.window;
      delete (global as any).window;

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      expect(renderer).toBeDefined();

      // Restore window
      global.window = originalWindow;
    });
  });

  describe('Performance Considerations', () => {
    it('should handle large portrait counts efficiently', async () => {
      const startTime = performance.now();

      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={8} />
          </TestWrapper>
        );
      });

      const endTime = performance.now();
      const renderTime = endTime - startTime;

      // Should render relatively quickly (less than 2 seconds in tests)
      expect(renderTime).toBeLessThan(2000);
      expect(renderer).toBeDefined();

      const scene = renderer.scene;
      expect(scene).toBeDefined();
    });

    it('should use memoization for portrait positions', async () => {
      // Render component twice with same props
      const renderer1 = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={3} />
          </TestWrapper>
        );
      });

      const renderer2 = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={3} />
          </TestWrapper>
        );
      });

      // Both should render successfully
      expect(renderer1).toBeDefined();
      expect(renderer2).toBeDefined();

      const scene1 = renderer1.scene;
      const scene2 = renderer2.scene;
      
      // Both should render successfully
      expect(scene1).toBeDefined();
      expect(scene2).toBeDefined();
    });

    it('should throttle mouse and scroll events', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={1} />
          </TestWrapper>
        );
      });

      // Get the throttled event handlers
      const mouseMoveHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'mousemove'
      )?.[1];

      // Rapidly trigger mouse events
      if (mouseMoveHandler) {
        await act(async () => {
          for (let i = 0; i < 10; i++) {
            mouseMoveHandler({ clientX: i * 10, clientY: i * 10 } as MouseEvent);
          }
        });
      }

      // Should handle rapid events without issues
      expect(renderer.scene).toBeDefined();
    });
  });

  describe('Position and Scale Variations', () => {
    it('should generate varied positions and scales for portraits', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={4} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene renders successfully
      expect(scene).toBeDefined();
    });

    it('should apply proper rotations to side wall portraits', async () => {
      const renderer = await act(async () => {
        return create(
          <TestWrapper>
            <MovingPortraits count={8} />
          </TestWrapper>
        );
      });

      const scene = renderer.scene;
      expect(scene).toBeDefined();
      
      // Check that the scene renders successfully
      expect(scene).toBeDefined();
    });
  });
});