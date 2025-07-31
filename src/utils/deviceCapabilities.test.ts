/**
 * Unit tests for device capability detection utilities
 * Tests WebGL context testing and other device detection methods
 */

import {
  isBrowser,
  getWebGLCapabilities,
  calculateDeviceScore,
  classifyDevice,
  getDeviceCapabilities,
  performanceStorage,
} from './deviceCapabilities';

describe('Device Capabilities Utilities - WebGL Focus', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isBrowser', () => {
    test('returns true in jsdom environment', () => {
      expect(isBrowser()).toBe(true);
    });
  });

  describe('getWebGLCapabilities - Core WebGL Testing', () => {
    test('handles WebGL parameters correctly with debug extension', () => {
      // Mock WebGL context with specific parameters
      const mockWebGLContext = {
        getExtension: jest.fn((name: string) => {
          if (name === 'WEBGL_debug_renderer_info') {
            return {
              UNMASKED_VENDOR_WEBGL: 37445,
              UNMASKED_RENDERER_WEBGL: 37446,
            };
          }
          return null;
        }),
        getParameter: jest.fn((param: number) => {
          switch (param) {
            case 37445: return 'NVIDIA Corporation';
            case 37446: return 'NVIDIA GeForce RTX 3080';
            case 3379: return 16384; // MAX_TEXTURE_SIZE
            case 34024: return 16384; // MAX_RENDERBUFFER_SIZE
            default: return 0;
          }
        }),
        MAX_TEXTURE_SIZE: 3379,
        MAX_RENDERBUFFER_SIZE: 34024,
      };

      // Mock HTMLCanvasElement.getContext for this test
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = jest.fn((contextType) => {
        if (contextType === 'webgl' || contextType === 'experimental-webgl') {
          return mockWebGLContext;
        }
        if (contextType === 'webgl2') {
          return mockWebGLContext; // Also support WebGL 2
        }
        return null;
      });

      const capabilities = getWebGLCapabilities();

      expect(capabilities.webgl1).toBe(true);
      expect(capabilities.webgl2).toBe(true);
      expect(capabilities.maxTextureSize).toBe(16384);
      expect(capabilities.maxRenderbufferSize).toBe(16384);
      expect(capabilities.vendor).toBe('NVIDIA Corporation');
      expect(capabilities.renderer).toBe('NVIDIA GeForce RTX 3080');

      // Verify the WebGL context was properly queried
      expect(mockWebGLContext.getExtension).toHaveBeenCalledWith('WEBGL_debug_renderer_info');
      expect(mockWebGLContext.getParameter).toHaveBeenCalledWith(37445); // UNMASKED_VENDOR_WEBGL
      expect(mockWebGLContext.getParameter).toHaveBeenCalledWith(37446); // UNMASKED_RENDERER_WEBGL
      expect(mockWebGLContext.getParameter).toHaveBeenCalledWith(3379); // MAX_TEXTURE_SIZE
      expect(mockWebGLContext.getParameter).toHaveBeenCalledWith(34024); // MAX_RENDERBUFFER_SIZE

      // Restore original
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    test('handles WebGL context creation failure', () => {
      // Mock HTMLCanvasElement.getContext to return null
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = jest.fn(() => null);

      const capabilities = getWebGLCapabilities();

      expect(capabilities.webgl1).toBe(false);
      expect(capabilities.webgl2).toBe(false);
      expect(capabilities.maxTextureSize).toBe(0);
      expect(capabilities.vendor).toBe('Unknown');
      expect(capabilities.renderer).toBe('Unknown');

      // Restore original
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    test('handles WebGL errors gracefully', () => {
      // Mock HTMLCanvasElement.getContext to throw error
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = jest.fn(() => {
        throw new Error('WebGL not supported');
      });

      const capabilities = getWebGLCapabilities();

      expect(capabilities.webgl1).toBe(false);
      expect(capabilities.webgl2).toBe(false);
      expect(capabilities.maxTextureSize).toBe(0);
      expect(capabilities.vendor).toBe('Unknown');
      expect(capabilities.renderer).toBe('Unknown');

      // Restore original
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    test('detects different GPU vendors correctly', () => {
      const gpuScenarios = [
        { vendor: 'Intel Corporation', renderer: 'Intel HD Graphics 4000', expectedLowEnd: true },
        { vendor: 'NVIDIA Corporation', renderer: 'NVIDIA GeForce RTX 3080', expectedLowEnd: false },
        { vendor: 'AMD', renderer: 'AMD Radeon RX 6800 XT', expectedLowEnd: false },
      ];

      gpuScenarios.forEach(scenario => {
        const mockWebGLContext = {
          getExtension: jest.fn((name: string) => {
            if (name === 'WEBGL_debug_renderer_info') {
              return {
                UNMASKED_VENDOR_WEBGL: 37445,
                UNMASKED_RENDERER_WEBGL: 37446,
              };
            }
            return null;
          }),
          getParameter: jest.fn((param: number) => {
            switch (param) {
              case 37445: return scenario.vendor;
              case 37446: return scenario.renderer;
              case 3379: return scenario.expectedLowEnd ? 4096 : 16384;
              case 34024: return scenario.expectedLowEnd ? 4096 : 16384;
              default: return 0;
            }
          }),
          MAX_TEXTURE_SIZE: 3379,
          MAX_RENDERBUFFER_SIZE: 34024,
        };

        // Mock for this iteration
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        HTMLCanvasElement.prototype.getContext = jest.fn(() => mockWebGLContext);

        const capabilities = getWebGLCapabilities();

        expect(capabilities.vendor).toBe(scenario.vendor);
        expect(capabilities.renderer).toBe(scenario.renderer);
        expect(capabilities.webgl1).toBe(true);
        
        const expectedTextureSize = scenario.expectedLowEnd ? 4096 : 16384;
        expect(capabilities.maxTextureSize).toBe(expectedTextureSize);

        // Restore for next iteration
        HTMLCanvasElement.prototype.getContext = originalGetContext;
      });
    });

    test('handles experimental-webgl fallback correctly', () => {
      const mockWebGLContext = {
        getExtension: jest.fn().mockReturnValue(null),
        getParameter: jest.fn(() => 8192),
        MAX_TEXTURE_SIZE: 3379,
        MAX_RENDERBUFFER_SIZE: 34024,
      };

      // Mock to only support experimental-webgl
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = jest.fn((contextType) => {
        if (contextType === 'experimental-webgl') {
          return mockWebGLContext;
        }
        return null;
      });

      const capabilities = getWebGLCapabilities();

      expect(capabilities.webgl1).toBe(true);
      expect(capabilities.webgl2).toBe(false);

      // Restore original
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    test('handles missing debug extension gracefully', () => {
      const mockWebGLContext = {
        getExtension: jest.fn().mockReturnValue(null), // No debug extension
        getParameter: jest.fn((param: number) => {
          switch (param) {
            case 3379: return 4096; // MAX_TEXTURE_SIZE
            case 34024: return 4096; // MAX_RENDERBUFFER_SIZE
            default: return 0;
          }
        }),
        MAX_TEXTURE_SIZE: 3379,
        MAX_RENDERBUFFER_SIZE: 34024,
      };

      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = jest.fn((contextType) => {
        if (contextType === 'webgl' || contextType === 'experimental-webgl') {
          return mockWebGLContext;
        }
        return null;
      });

      const capabilities = getWebGLCapabilities();

      expect(capabilities.webgl1).toBe(true);
      expect(capabilities.webgl2).toBe(false);
      expect(capabilities.maxTextureSize).toBe(4096);
      expect(capabilities.vendor).toBe('Unknown');
      expect(capabilities.renderer).toBe('Unknown');

      // Restore original
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });

    test('properly queries WebGL context parameters', () => {
      const mockWebGLContext = {
        getExtension: jest.fn((name: string) => {
          if (name === 'WEBGL_debug_renderer_info') {
            return {
              UNMASKED_VENDOR_WEBGL: 37445,
              UNMASKED_RENDERER_WEBGL: 37446,
            };
          }
          return null;
        }),
        getParameter: jest.fn((param: number) => {
          switch (param) {
            case 37445: return 'AMD';
            case 37446: return 'AMD Radeon RX 7900 XTX';
            case 3379: return 32768; // High-end MAX_TEXTURE_SIZE
            case 34024: return 32768; // High-end MAX_RENDERBUFFER_SIZE
            default: return 0;
          }
        }),
        MAX_TEXTURE_SIZE: 3379,
        MAX_RENDERBUFFER_SIZE: 34024,
      };

      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = jest.fn((contextType) => {
        if (contextType === 'webgl' || contextType === 'experimental-webgl') {
          return mockWebGLContext;
        }
        if (contextType === 'webgl2') {
          return mockWebGLContext; // Support WebGL 2
        }
        return null;
      });

      const capabilities = getWebGLCapabilities();

      expect(capabilities.webgl1).toBe(true);
      expect(capabilities.webgl2).toBe(true);
      expect(capabilities.maxTextureSize).toBe(32768);
      expect(capabilities.maxRenderbufferSize).toBe(32768);
      expect(capabilities.vendor).toBe('AMD');
      expect(capabilities.renderer).toBe('AMD Radeon RX 7900 XTX');

      // Verify that the WebGL context was properly queried for all parameters
      expect(mockWebGLContext.getExtension).toHaveBeenCalledWith('WEBGL_debug_renderer_info');
      expect(mockWebGLContext.getParameter).toHaveBeenCalledWith(37445); // UNMASKED_VENDOR_WEBGL
      expect(mockWebGLContext.getParameter).toHaveBeenCalledWith(37446); // UNMASKED_RENDERER_WEBGL
      expect(mockWebGLContext.getParameter).toHaveBeenCalledWith(3379); // MAX_TEXTURE_SIZE
      expect(mockWebGLContext.getParameter).toHaveBeenCalledWith(34024); // MAX_RENDERBUFFER_SIZE

      // Restore original
      HTMLCanvasElement.prototype.getContext = originalGetContext;
    });
  });

  describe('Device Detection Core Functions', () => {
    test('calculateDeviceScore returns valid score', () => {
      const score = calculateDeviceScore();
      expect(typeof score).toBe('number');
      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
    });

    test('classifyDevice returns valid device class', () => {
      const deviceClass = classifyDevice();
      expect(['desktop-high', 'desktop-low', 'tablet', 'mobile-high', 'mobile-low']).toContain(deviceClass);
    });

    test('getDeviceCapabilities returns complete capabilities object', () => {
      const capabilities = getDeviceCapabilities();
      
      expect(capabilities).toHaveProperty('class');
      expect(capabilities).toHaveProperty('level');
      expect(capabilities).toHaveProperty('canRender3D');
      expect(capabilities).toHaveProperty('shouldUseCandles');
      expect(capabilities).toHaveProperty('shouldUsePortraits');
      expect(capabilities).toHaveProperty('shouldUseSnitch');
      expect(capabilities).toHaveProperty('maxComplexity');
      expect(capabilities).toHaveProperty('recommendedSettings');
      
      // Validate types
      expect(typeof capabilities.canRender3D).toBe('boolean');
      expect(typeof capabilities.shouldUseCandles).toBe('boolean');
      expect(['high', 'medium', 'low', 'none']).toContain(capabilities.maxComplexity);
    });
  });

  describe('Performance Storage - Basic Testing', () => {
    test('saves metrics with proper structure', () => {
      // Mock localStorage
      const setItemSpy = jest.fn();
      Object.defineProperty(window, 'localStorage', {
        value: { setItem: setItemSpy },
        writable: true,
      });

      // Mock process.env for development mode
      const originalEnv = process.env;
      process.env = { ...originalEnv, NODE_ENV: 'development' };

      const metrics = { fps: 60, memory: 100 };
      
      performanceStorage.saveMetrics(metrics);
      
      expect(setItemSpy).toHaveBeenCalled();
      const calls = setItemSpy.mock.calls;
      expect(calls[0][0]).toMatch(/^perf_metrics_\d+$/);
      
      const savedData = JSON.parse(calls[0][1]);
      expect(savedData.fps).toBe(60);
      expect(savedData.memory).toBe(100);
      expect(savedData.timestamp).toBeDefined();

      // Restore
      process.env = originalEnv;
    });

    test('handles storage errors without throwing', () => {
      // Mock localStorage to throw error
      Object.defineProperty(window, 'localStorage', {
        value: {
          setItem: jest.fn(() => {
            throw new Error('Storage quota exceeded');
          }),
        },
        writable: true,
      });

      const originalEnv = process.env;
      process.env = { ...originalEnv, NODE_ENV: 'development' };
      
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
      
      // Should not throw an error
      try {
        performanceStorage.saveMetrics({ fps: 60 });
        expect(true).toBe(true); // Test passes if no error thrown
      } catch (error) {
        fail('performanceStorage.saveMetrics should not throw');
      }
      
      expect(consoleSpy).toHaveBeenCalled();
      
      consoleSpy.mockRestore();
      process.env = originalEnv;
    });
  });
});