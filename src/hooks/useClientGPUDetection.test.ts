import { renderHook, act } from '@testing-library/react';
import { useClientGPUDetection, useGPURenderingConfig, type GPUTier, type GPUVendor } from './useClientGPUDetection';

// Mock WebGL context
const createMockWebGLContext = (capabilities: Partial<WebGLRenderingContext> = {}) => {
  const mockContext = {
    getParameter: jest.fn(),
    getExtension: jest.fn(),
    getSupportedExtensions: jest.fn(() => ['OES_texture_float', 'WEBGL_depth_texture']),
    ...capabilities,
  } as Partial<WebGLRenderingContext>;

  // Set default parameter values
  (mockContext.getParameter as jest.Mock).mockImplementation((param) => {
    const mockParams: Record<number, any> = {
      [mockContext.MAX_TEXTURE_SIZE as any]: 4096,
      [mockContext.MAX_RENDERBUFFER_SIZE as any]: 4096,
      [mockContext.MAX_VIEWPORT_DIMS as any]: [4096, 4096],
      [mockContext.MAX_VERTEX_ATTRIBS as any]: 16,
      [mockContext.MAX_VARYING_VECTORS as any]: 8,
      [mockContext.MAX_VERTEX_UNIFORM_VECTORS as any]: 256,
      [mockContext.MAX_FRAGMENT_UNIFORM_VECTORS as any]: 256,
      [mockContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS as any]: 32,
      37445: 'NVIDIA Corporation', // UNMASKED_VENDOR_WEBGL
      37446: 'NVIDIA GeForce GTX 1080', // UNMASKED_RENDERER_WEBGL
    };
    return mockParams[param] || null;
  });

  return mockContext;
};

// Mock canvas and WebGL context
const mockCanvas = () => {
  const canvas = {
    getContext: jest.fn(),
  };

  Object.defineProperty(document, 'createElement', {
    value: jest.fn((tagName) => {
      if (tagName === 'canvas') {
        return canvas;
      }
      return {};
    }),
    writable: true,
  });

  return canvas;
};

// Mock navigator.gpu for WebGPU tests
const mockNavigatorGPU = (supported: boolean) => {
  if (supported) {
    Object.defineProperty(navigator, 'gpu', {
      value: {},
      writable: true,
    });
  } else {
    // @ts-ignore
    delete navigator.gpu;
  }
};

describe('useClientGPUDetection', () => {
  let canvas: any;
  let originalWindow: any;

  beforeEach(() => {
    canvas = mockCanvas();
    originalWindow = global.window;
    jest.clearAllMocks();
  });

  afterEach(() => {
    global.window = originalWindow;
    jest.restoreAllMocks();
  });

  describe('Server-side rendering', () => {
    it('should return default capabilities when window is undefined', () => {
      // @ts-ignore
      global.window = undefined;

      const { result } = renderHook(() => useClientGPUDetection());

      expect(result.current).toEqual({
        tier: 'medium',
        vendor: 'unknown',
        renderer: 'Unknown',
        webGLSupported: false,
        webGL2Supported: false,
        webGPUSupported: false,
        maxTextureSize: 2048,
        maxRenderbufferSize: 2048,
        maxViewportDims: [2048, 2048],
        maxVertexAttribs: 16,
        maxVaryingVectors: 8,
        maxVertexUniformVectors: 128,
        maxFragmentUniformVectors: 16,
        maxCombinedTextureImageUnits: 8,
        supportedExtensions: [],
        floatTextureSupport: false,
        depthTextureSupport: false,
        instancingSupport: false,
        vaoSupport: false,
        isLowPowerDevice: true,
        performanceScore: 30,
      });
    });
  });

  describe('WebGL not supported', () => {
    it('should return unsupported capabilities when WebGL is not available', async () => {
      canvas.getContext.mockReturnValue(null);

      const { result } = renderHook(() => useClientGPUDetection());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.tier).toBe('unsupported');
      expect(result.current.webGLSupported).toBe(false);
      expect(result.current.performanceScore).toBe(0);
    });
  });

  describe('WebGL supported scenarios', () => {
    it('should detect high-end NVIDIA GPU correctly', async () => {
      const mockContext = createMockWebGLContext();
      const mockWebGL2Context = createMockWebGLContext();
      
      canvas.getContext.mockImplementation((type) => {
        if (type === 'webgl' || type === 'experimental-webgl') {
          return mockContext;
        }
        if (type === 'webgl2') {
          return mockWebGL2Context;
        }
        return null;
      });

      // Mock debug renderer extension
      (mockContext.getExtension as jest.Mock).mockImplementation((extension) => {
        if (extension === 'WEBGL_debug_renderer_info') {
          return { UNMASKED_VENDOR_WEBGL: 37445, UNMASKED_RENDERER_WEBGL: 37446 };
        }
        if (extension === 'OES_texture_float') return {};
        if (extension === 'WEBGL_depth_texture') return {};
        return null;
      });

      mockNavigatorGPU(true);

      const { result } = renderHook(() => useClientGPUDetection());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.tier).toBe('high');
      expect(result.current.vendor).toBe('nvidia');
      expect(result.current.renderer).toBe('NVIDIA GeForce GTX 1080');
      expect(result.current.webGLSupported).toBe(true);
      expect(result.current.webGL2Supported).toBe(true);
      expect(result.current.webGPUSupported).toBe(true);
      expect(result.current.performanceScore).toBeGreaterThan(80);
    });

    it('should detect AMD GPU correctly', async () => {
      const mockContext = createMockWebGLContext();
      
      canvas.getContext.mockImplementation((type) => {
        if (type === 'webgl' || type === 'experimental-webgl') {
          return mockContext;
        }
        return null;
      });

      // Mock AMD GPU parameters
      (mockContext.getParameter as jest.Mock).mockImplementation((param) => {
        const mockParams: Record<number, any> = {
          [mockContext.MAX_TEXTURE_SIZE as any]: 8192,
          [mockContext.MAX_RENDERBUFFER_SIZE as any]: 8192,
          [mockContext.MAX_VIEWPORT_DIMS as any]: [8192, 8192],
          [mockContext.MAX_VERTEX_ATTRIBS as any]: 16,
          [mockContext.MAX_VARYING_VECTORS as any]: 8,
          [mockContext.MAX_VERTEX_UNIFORM_VECTORS as any]: 256,
          [mockContext.MAX_FRAGMENT_UNIFORM_VECTORS as any]: 256,
          [mockContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS as any]: 32,
          37445: 'AMD', // UNMASKED_VENDOR_WEBGL
          37446: 'AMD Radeon RX 580', // UNMASKED_RENDERER_WEBGL
        };
        return mockParams[param] || null;
      });

      (mockContext.getExtension as jest.Mock).mockImplementation((extension) => {
        if (extension === 'WEBGL_debug_renderer_info') {
          return { UNMASKED_VENDOR_WEBGL: 37445, UNMASKED_RENDERER_WEBGL: 37446 };
        }
        return null;
      });

      const { result } = renderHook(() => useClientGPUDetection());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.vendor).toBe('amd');
      expect(result.current.renderer).toBe('AMD Radeon RX 580');
      expect(result.current.tier).toBe('medium');
    });

    it('should detect Intel integrated graphics correctly', async () => {
      const mockContext = createMockWebGLContext();
      
      canvas.getContext.mockReturnValue(mockContext);

      // Mock Intel GPU parameters
      (mockContext.getParameter as jest.Mock).mockImplementation((param) => {
        const mockParams: Record<number, any> = {
          [mockContext.MAX_TEXTURE_SIZE as any]: 2048,
          [mockContext.MAX_RENDERBUFFER_SIZE as any]: 2048,
          [mockContext.MAX_VIEWPORT_DIMS as any]: [2048, 2048],
          [mockContext.MAX_VERTEX_ATTRIBS as any]: 16,
          [mockContext.MAX_VARYING_VECTORS as any]: 8,
          [mockContext.MAX_VERTEX_UNIFORM_VECTORS as any]: 128,
          [mockContext.MAX_FRAGMENT_UNIFORM_VECTORS as any]: 16,
          [mockContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS as any]: 16,
          37445: 'Intel', // UNMASKED_VENDOR_WEBGL
          37446: 'Intel(R) HD Graphics 4000', // UNMASKED_RENDERER_WEBGL
        };
        return mockParams[param] || null;
      });

      (mockContext.getExtension as jest.Mock).mockImplementation((extension) => {
        if (extension === 'WEBGL_debug_renderer_info') {
          return { UNMASKED_VENDOR_WEBGL: 37445, UNMASKED_RENDERER_WEBGL: 37446 };
        }
        return null;
      });

      const { result } = renderHook(() => useClientGPUDetection());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.vendor).toBe('intel');
      expect(result.current.isLowPowerDevice).toBe(true);
      expect(result.current.tier).toBe('low');
    });

    it('should detect Apple Silicon correctly', async () => {
      const mockContext = createMockWebGLContext();
      
      canvas.getContext.mockReturnValue(mockContext);

      // Mock Apple GPU parameters
      (mockContext.getParameter as jest.Mock).mockImplementation((param) => {
        const mockParams: Record<number, any> = {
          [mockContext.MAX_TEXTURE_SIZE as any]: 16384,
          [mockContext.MAX_RENDERBUFFER_SIZE as any]: 16384,
          [mockContext.MAX_VIEWPORT_DIMS as any]: [16384, 16384],
          [mockContext.MAX_VERTEX_ATTRIBS as any]: 16,
          [mockContext.MAX_VARYING_VECTORS as any]: 8,
          [mockContext.MAX_VERTEX_UNIFORM_VECTORS as any]: 512,
          [mockContext.MAX_FRAGMENT_UNIFORM_VECTORS as any]: 512,
          [mockContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS as any]: 64,
          37445: 'Apple', // UNMASKED_VENDOR_WEBGL
          37446: 'Apple M1', // UNMASKED_RENDERER_WEBGL
        };
        return mockParams[param] || null;
      });

      (mockContext.getExtension as jest.Mock).mockImplementation((extension) => {
        if (extension === 'WEBGL_debug_renderer_info') {
          return { UNMASKED_VENDOR_WEBGL: 37445, UNMASKED_RENDERER_WEBGL: 37446 };
        }
        if (extension === 'OES_texture_float') return {};
        if (extension === 'WEBGL_depth_texture') return {};
        return null;
      });

      const { result } = renderHook(() => useClientGPUDetection());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.vendor).toBe('apple');
      expect(result.current.tier).toBe('high');
      expect(result.current.performanceScore).toBeGreaterThan(80);
    });

    it('should handle GPU detection errors gracefully', async () => {
      canvas.getContext.mockImplementation(() => {
        throw new Error('WebGL context creation failed');
      });

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();

      const { result } = renderHook(() => useClientGPUDetection());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.tier).toBe('unsupported');
      expect(result.current.performanceScore).toBe(0);
      expect(consoleSpy).toHaveBeenCalledWith('GPU detection failed:', expect.any(Error));

      consoleSpy.mockRestore();
    });

    it('should detect mobile/low-power devices correctly', async () => {
      const mockContext = createMockWebGLContext();
      
      canvas.getContext.mockReturnValue(mockContext);

      // Mock mobile GPU parameters
      (mockContext.getParameter as jest.Mock).mockImplementation((param) => {
        const mockParams: Record<number, any> = {
          [mockContext.MAX_TEXTURE_SIZE as any]: 2048,
          [mockContext.MAX_RENDERBUFFER_SIZE as any]: 2048,
          [mockContext.MAX_VIEWPORT_DIMS as any]: [2048, 2048],
          [mockContext.MAX_VERTEX_ATTRIBS as any]: 8,
          [mockContext.MAX_VARYING_VECTORS as any]: 4,
          [mockContext.MAX_VERTEX_UNIFORM_VECTORS as any]: 64,
          [mockContext.MAX_FRAGMENT_UNIFORM_VECTORS as any]: 16,
          [mockContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS as any]: 8,
          37445: 'Qualcomm', // UNMASKED_VENDOR_WEBGL
          37446: 'Adreno (TM) 530', // UNMASKED_RENDERER_WEBGL
        };
        return mockParams[param] || null;
      });

      (mockContext.getExtension as jest.Mock).mockImplementation((extension) => {
        if (extension === 'WEBGL_debug_renderer_info') {
          return { UNMASKED_VENDOR_WEBGL: 37445, UNMASKED_RENDERER_WEBGL: 37446 };
        }
        return null;
      });

      const { result } = renderHook(() => useClientGPUDetection());

      await act(async () => {
        await new Promise(resolve => setTimeout(resolve, 0));
      });

      expect(result.current.vendor).toBe('qualcomm');
      expect(result.current.isLowPowerDevice).toBe(true);
      expect(result.current.tier).toBe('low');
    });
  });
});

describe('useGPURenderingConfig', () => {
  let canvas: any;

  beforeEach(() => {
    canvas = mockCanvas();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should return high-end rendering config for high-tier GPU', async () => {
    const mockContext = createMockWebGLContext();
    const mockWebGL2Context = createMockWebGLContext();
    
    canvas.getContext.mockImplementation((type) => {
      if (type === 'webgl' || type === 'experimental-webgl') {
        return mockContext;
      }
      if (type === 'webgl2') {
        return mockWebGL2Context;
      }
      return null;
    });

    (mockContext.getExtension as jest.Mock).mockImplementation((extension) => {
      if (extension === 'WEBGL_debug_renderer_info') {
        return { UNMASKED_VENDOR_WEBGL: 37445, UNMASKED_RENDERER_WEBGL: 37446 };
      }
      if (extension === 'OES_texture_float') return {};
      if (extension === 'WEBGL_depth_texture') return {};
      return null;
    });

    const { result } = renderHook(() => useGPURenderingConfig());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.config.shadowQuality).toBe('high');
    expect(result.current.config.textureQuality).toBe('high');
    expect(result.current.config.antialiasing).toBe(true);
    expect(result.current.config.postProcessing).toBe(true);
    expect(result.current.shouldRender3D).toBe(true);
    expect(result.current.recommendFallback).toBe(false);
  });

  it('should return low-end rendering config for low-tier GPU', async () => {
    const mockContext = createMockWebGLContext();
    
    canvas.getContext.mockReturnValue(mockContext);

    // Mock low-end GPU parameters
    (mockContext.getParameter as jest.Mock).mockImplementation((param) => {
      const mockParams: Record<number, any> = {
        [mockContext.MAX_TEXTURE_SIZE as any]: 1024,
        [mockContext.MAX_RENDERBUFFER_SIZE as any]: 1024,
        [mockContext.MAX_VIEWPORT_DIMS as any]: [1024, 1024],
        [mockContext.MAX_VERTEX_ATTRIBS as any]: 8,
        [mockContext.MAX_VARYING_VECTORS as any]: 4,
        [mockContext.MAX_VERTEX_UNIFORM_VECTORS as any]: 64,
        [mockContext.MAX_FRAGMENT_UNIFORM_VECTORS as any]: 16,
        [mockContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS as any]: 8,
        37445: 'Intel', // UNMASKED_VENDOR_WEBGL
        37446: 'Intel(R) HD Graphics 2000', // UNMASKED_RENDERER_WEBGL
      };
      return mockParams[param] || null;
    });

    (mockContext.getExtension as jest.Mock).mockImplementation((extension) => {
      if (extension === 'WEBGL_debug_renderer_info') {
        return { UNMASKED_VENDOR_WEBGL: 37445, UNMASKED_RENDERER_WEBGL: 37446 };
      }
      return null;
    });

    const { result } = renderHook(() => useGPURenderingConfig());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.config.shadowQuality).toBe('low');
    expect(result.current.config.textureQuality).toBe('low');
    expect(result.current.config.antialiasing).toBe(false);
    expect(result.current.config.postProcessing).toBe(false);
    expect(result.current.shouldRender3D).toBe(true);
    expect(result.current.recommendFallback).toBe(true);
  });

  it('should recommend no rendering for unsupported GPU', async () => {
    canvas.getContext.mockReturnValue(null);

    const { result } = renderHook(() => useGPURenderingConfig());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.config.shadowQuality).toBe('none');
    expect(result.current.config.maxLights).toBe(0);
    expect(result.current.shouldRender3D).toBe(false);
    expect(result.current.recommendFallback).toBe(true);
  });

  it('should provide access to all rendering configurations', async () => {
    const mockContext = createMockWebGLContext();
    canvas.getContext.mockReturnValue(mockContext);

    const { result } = renderHook(() => useGPURenderingConfig());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.allConfigs).toHaveProperty('high');
    expect(result.current.allConfigs).toHaveProperty('medium');
    expect(result.current.allConfigs).toHaveProperty('low');
    expect(result.current.allConfigs).toHaveProperty('unsupported');
    
    expect(result.current.allConfigs.high.shadowMapSize).toBe(2048);
    expect(result.current.allConfigs.medium.shadowMapSize).toBe(1024);
    expect(result.current.allConfigs.low.shadowMapSize).toBe(512);
    expect(result.current.allConfigs.unsupported.shadowMapSize).toBe(256);
  });
});