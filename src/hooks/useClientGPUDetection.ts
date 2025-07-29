'use client';

import { useEffect, useState } from 'react';

// GPU capability levels for 3D rendering decisions
export type GPUTier = 'high' | 'medium' | 'low' | 'unsupported';

// GPU vendor classification
export type GPUVendor = 'nvidia' | 'amd' | 'intel' | 'apple' | 'qualcomm' | 'unknown';

// Detailed GPU information interface
interface GPUCapabilities {
  tier: GPUTier;
  vendor: GPUVendor;
  renderer: string;
  webGLSupported: boolean;
  webGL2Supported: boolean;
  webGPUSupported: boolean;
  maxTextureSize: number;
  maxRenderbufferSize: number;
  maxViewportDims: [number, number];
  maxVertexAttribs: number;
  maxVaryingVectors: number;
  maxVertexUniformVectors: number;
  maxFragmentUniformVectors: number;
  maxCombinedTextureImageUnits: number;
  supportedExtensions: string[];
  floatTextureSupport: boolean;
  depthTextureSupport: boolean;
  instancingSupport: boolean;
  vaoSupport: boolean;
  isLowPowerDevice: boolean;
  performanceScore: number;
}

// Default capabilities for SSR and unsupported browsers
const DEFAULT_CAPABILITIES: GPUCapabilities = {
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
};

/**
 * Hook for detecting client-side GPU capabilities and WebGL support
 * Returns comprehensive GPU information for 3D rendering decisions
 */
export function useClientGPUDetection(): GPUCapabilities {
  const [capabilities, setCapabilities] = useState<GPUCapabilities>(DEFAULT_CAPABILITIES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only run on client-side to avoid hydration mismatches
    if (typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    const detectGPUCapabilities = async (): Promise<GPUCapabilities> => {
      try {
        // Basic WebGL support check
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        const gl2 = canvas.getContext('webgl2');
        
        if (!gl) {
          return {
            ...DEFAULT_CAPABILITIES,
            tier: 'unsupported',
            webGLSupported: false,
            performanceScore: 0,
          };
        }

        // Cast to WebGLRenderingContext for proper typing
        const webglContext = gl as WebGLRenderingContext;

        // Get WebGL context information
        const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
        const vendor = debugInfo ? webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';
        const renderer = debugInfo ? webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';

        // Classify GPU vendor
        const gpuVendor = classifyGPuVendor(vendor, renderer);

        // Get WebGL capabilities
        const maxTextureSize = webglContext.getParameter(webglContext.MAX_TEXTURE_SIZE);
        const maxRenderbufferSize = webglContext.getParameter(webglContext.MAX_RENDERBUFFER_SIZE);
        const maxViewportDims = webglContext.getParameter(webglContext.MAX_VIEWPORT_DIMS);
        const maxVertexAttribs = webglContext.getParameter(webglContext.MAX_VERTEX_ATTRIBS);
        const maxVaryingVectors = webglContext.getParameter(webglContext.MAX_VARYING_VECTORS);
        const maxVertexUniformVectors = webglContext.getParameter(webglContext.MAX_VERTEX_UNIFORM_VECTORS);
        const maxFragmentUniformVectors = webglContext.getParameter(webglContext.MAX_FRAGMENT_UNIFORM_VECTORS);
        const maxCombinedTextureImageUnits = webglContext.getParameter(webglContext.MAX_COMBINED_TEXTURE_IMAGE_UNITS);

        // Check for important extensions
        const supportedExtensions = webglContext.getSupportedExtensions() || [];
        const floatTextureSupport = !!webglContext.getExtension('OES_texture_float');
        const depthTextureSupport = !!webglContext.getExtension('WEBGL_depth_texture') || !!webglContext.getExtension('WEBKIT_WEBGL_depth_texture') || !!webglContext.getExtension('MOZ_WEBGL_depth_texture');
        const instancingSupport = !!webglContext.getExtension('ANGLE_instanced_arrays');
        const vaoSupport = !!webglContext.getExtension('OES_vertex_array_object');

        // Check WebGPU support (experimental)
        let webGPUSupported = false;
        try {
          webGPUSupported = 'gpu' in navigator;
        } catch {
          // WebGPU not supported
        }

        // Detect low-power devices
        const isLowPowerDevice = detectLowPowerDevice(renderer, vendor);

        // Calculate performance score
        const performanceScore = calculateGPUPerformanceScore({
          vendor: gpuVendor,
          renderer,
          maxTextureSize,
          maxRenderbufferSize,
          webGL2Supported: !!gl2,
          webGPUSupported,
          floatTextureSupport,
          depthTextureSupport,
          instancingSupport,
          vaoSupport,
          isLowPowerDevice,
          supportedExtensions,
        });

        // Determine GPU tier based on performance score
        let tier: GPUTier = 'medium';
        if (performanceScore >= 80) {
          tier = 'high';
        } else if (performanceScore >= 50) {
          tier = 'medium';
        } else if (performanceScore >= 20) {
          tier = 'low';
        } else {
          tier = 'unsupported';
        }

        return {
          tier,
          vendor: gpuVendor,
          renderer: renderer.toString(),
          webGLSupported: true,
          webGL2Supported: !!gl2,
          webGPUSupported,
          maxTextureSize,
          maxRenderbufferSize,
          maxViewportDims: [maxViewportDims[0], maxViewportDims[1]],
          maxVertexAttribs,
          maxVaryingVectors,
          maxVertexUniformVectors,
          maxFragmentUniformVectors,
          maxCombinedTextureImageUnits,
          supportedExtensions,
          floatTextureSupport,
          depthTextureSupport,
          instancingSupport,
          vaoSupport,
          isLowPowerDevice,
          performanceScore,
        };

      } catch (error) {
        console.warn('GPU detection failed:', error);
        return {
          ...DEFAULT_CAPABILITIES,
          tier: 'unsupported',
          performanceScore: 0,
        };
      }
    };

    // Run detection asynchronously
    detectGPUCapabilities().then((caps) => {
      setCapabilities(caps);
      setIsLoading(false);
    });
  }, []);

  // Return current capabilities (will be defaults during SSR)
  return capabilities;
}

/**
 * Classify GPU vendor based on vendor and renderer strings
 */
function classifyGPuVendor(vendor: string, renderer: string): GPUVendor {
  const vendorLower = vendor.toLowerCase();
  const rendererLower = renderer.toLowerCase();
  const combined = `${vendorLower} ${rendererLower}`;

  if (combined.includes('nvidia') || combined.includes('geforce') || combined.includes('quadro') || combined.includes('tesla')) {
    return 'nvidia';
  }
  
  if (combined.includes('amd') || combined.includes('radeon') || combined.includes('ati')) {
    return 'amd';
  }
  
  if (combined.includes('intel') || combined.includes('hd graphics') || combined.includes('iris') || combined.includes('uhd graphics')) {
    return 'intel';
  }
  
  if (combined.includes('apple') || combined.includes('m1') || combined.includes('m2') || combined.includes('m3')) {
    return 'apple';
  }
  
  if (combined.includes('qualcomm') || combined.includes('adreno') || combined.includes('snapdragon')) {
    return 'qualcomm';
  }

  return 'unknown';
}

/**
 * Detect if device is likely a low-power/mobile device
 */
function detectLowPowerDevice(renderer: string, vendor: string): boolean {
  const rendererLower = renderer.toLowerCase();
  const vendorLower = vendor.toLowerCase();
  const combined = `${vendorLower} ${rendererLower}`;

  // Mobile GPU indicators
  const mobileIndicators = [
    'adreno',
    'mali',
    'powervr',
    'videocore',
    'tegra',
    'snapdragon',
    'mobile',
    'ios',
    'android'
  ];

  // Low-power integrated GPU indicators
  const lowPowerIndicators = [
    'intel(r) hd graphics',
    'intel(r) uhd graphics',
    'intel(r) iris(r) xe graphics',
    'hd graphics 2000',
    'hd graphics 3000',
    'hd graphics 4000',
    'hd graphics 5000',
    'vega 3',
    'vega 6',
    'vega 8',
  ];

  return mobileIndicators.some(indicator => combined.includes(indicator)) ||
         lowPowerIndicators.some(indicator => combined.includes(indicator));
}

/**
 * Calculate GPU performance score based on various capabilities
 */
function calculateGPUPerformanceScore({
  vendor,
  renderer,
  maxTextureSize,
  maxRenderbufferSize,
  webGL2Supported,
  webGPUSupported,
  floatTextureSupport,
  depthTextureSupport,
  instancingSupport,
  vaoSupport,
  isLowPowerDevice,
  supportedExtensions,
}: {
  vendor: GPUVendor;
  renderer: string;
  maxTextureSize: number;
  maxRenderbufferSize: number;
  webGL2Supported: boolean;
  webGPUSupported: boolean;
  floatTextureSupport: boolean;
  depthTextureSupport: boolean;
  instancingSupport: boolean;
  vaoSupport: boolean;
  isLowPowerDevice: boolean;
  supportedExtensions: string[];
}): number {
  let score = 0;

  // Base score by vendor (max 30 points)
  switch (vendor) {
    case 'nvidia':
      score += 30;
      break;
    case 'amd':
      score += 25;
      break;
    case 'apple':
      score += 28; // M1/M2 chips are very capable
      break;
    case 'intel':
      score += 15; // Integrated graphics
      break;
    case 'qualcomm':
      score += 10; // Mobile GPUs
      break;
    default:
      score += 10;
  }

  // Specific GPU model bonuses/penalties
  const rendererLower = renderer.toLowerCase();
  if (rendererLower.includes('rtx') || rendererLower.includes('gtx 1060') || rendererLower.includes('gtx 1070') || rendererLower.includes('gtx 1080')) {
    score += 20; // High-end NVIDIA
  } else if (rendererLower.includes('rx 580') || rendererLower.includes('rx 590') || rendererLower.includes('rx 6000') || rendererLower.includes('rx 7000')) {
    score += 18; // High-end AMD
  } else if (rendererLower.includes('m1') || rendererLower.includes('m2') || rendererLower.includes('m3')) {
    score += 25; // Apple Silicon
  }

  // Texture size capability (max 15 points)
  if (maxTextureSize >= 16384) {
    score += 15;
  } else if (maxTextureSize >= 8192) {
    score += 12;
  } else if (maxTextureSize >= 4096) {
    score += 8;
  } else if (maxTextureSize >= 2048) {
    score += 4;
  }

  // WebGL 2.0 support (10 points)
  if (webGL2Supported) {
    score += 10;
  }

  // WebGPU support (15 points)
  if (webGPUSupported) {
    score += 15;
  }

  // Important extensions (max 15 points)
  if (floatTextureSupport) score += 4;
  if (depthTextureSupport) score += 3;
  if (instancingSupport) score += 4;
  if (vaoSupport) score += 2;
  score += Math.min(supportedExtensions.length * 0.2, 2); // Bonus for extension support

  // Low power device penalty
  if (isLowPowerDevice) {
    score -= 20;
  }

  // Normalize to 0-100 scale
  return Math.max(0, Math.min(100, score));
}

/**
 * Hook for getting 3D rendering recommendations based on GPU capabilities
 */
export function useGPURenderingConfig() {
  const gpu = useClientGPUDetection();

  const renderingConfig = {
    high: {
      shadowQuality: 'high',
      textureQuality: 'high',
      antialiasing: true,
      anisotropicFiltering: 16,
      particleCount: 'high',
      complexGeometry: true,
      postProcessing: true,
      maxLights: 8,
      shadowMapSize: 2048,
    },
    medium: {
      shadowQuality: 'medium',
      textureQuality: 'medium',
      antialiasing: true,
      anisotropicFiltering: 4,
      particleCount: 'medium',
      complexGeometry: true,
      postProcessing: false,
      maxLights: 4,
      shadowMapSize: 1024,
    },
    low: {
      shadowQuality: 'low',
      textureQuality: 'low',
      antialiasing: false,
      anisotropicFiltering: 1,
      particleCount: 'low',
      complexGeometry: false,
      postProcessing: false,
      maxLights: 2,
      shadowMapSize: 512,
    },
    unsupported: {
      shadowQuality: 'none',
      textureQuality: 'none',
      antialiasing: false,
      anisotropicFiltering: 1,
      particleCount: 'none',
      complexGeometry: false,
      postProcessing: false,
      maxLights: 0,
      shadowMapSize: 256,
    },
  };

  return {
    gpu,
    config: renderingConfig[gpu.tier],
    allConfigs: renderingConfig,
    shouldRender3D: gpu.tier !== 'unsupported',
    recommendFallback: gpu.tier === 'low' || gpu.tier === 'unsupported',
  };
}