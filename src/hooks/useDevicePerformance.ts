'use client';

import { useState, useEffect } from 'react';

export interface LODConfig {
  [componentName: string]: {
    lowDetail: {
      instanceCount?: number;
      particleCount?: number;
      enableShadows?: boolean;
      enableReflections?: boolean;
      geometryComplexity?: number;
      shadowMapSize?: number;
      enableInteractivity?: boolean;
      animationFidelity?: number;
    };
    mediumDetail: {
      instanceCount?: number;
      particleCount?: number;
      enableShadows?: boolean;
      enableReflections?: boolean;
      geometryComplexity?: number;
      shadowMapSize?: number;
      enableInteractivity?: boolean;
      animationFidelity?: number;
    };
    highDetail: {
      instanceCount?: number;
      particleCount?: number;
      enableShadows?: boolean;
      enableReflections?: boolean;
      geometryComplexity?: number;
      shadowMapSize?: number;
      enableInteractivity?: boolean;
      animationFidelity?: number;
    };
  };
}

export type LODLevel = 'low' | 'medium' | 'high';

export interface DevicePerformance {
  level: LODLevel;
  memoryMB: number;
  isLowPowerDevice: boolean;
  isMobile: boolean;
  supportedFeatures: {
    webgl2: boolean;
    shadows: boolean;
    floatTextures: boolean;
  };
}

const defaultLODConfig: LODConfig = {
  floatingCandles: {
    lowDetail: {
      instanceCount: 3,
      enableShadows: false,
      enableReflections: false,
      geometryComplexity: 0.3,
      shadowMapSize: 256,
    },
    mediumDetail: {
      instanceCount: 6,
      enableShadows: true,
      enableReflections: false,
      geometryComplexity: 0.7,
      shadowMapSize: 512,
    },
    highDetail: {
      instanceCount: 12,
      enableShadows: true,
      enableReflections: true,
      geometryComplexity: 1.0,
      shadowMapSize: 1024,
    },
  },
  movingPortraits: {
    lowDetail: {
      instanceCount: 2,
      enableShadows: false,
      enableReflections: false,
      geometryComplexity: 0.4,
      shadowMapSize: 256,
      enableInteractivity: false,
      animationFidelity: 0.3,
    },
    mediumDetail: {
      instanceCount: 4,
      enableShadows: false,
      enableReflections: true,
      geometryComplexity: 0.7,
      shadowMapSize: 512,
      enableInteractivity: true,
      animationFidelity: 0.7,
    },
    highDetail: {
      instanceCount: 6,
      enableShadows: true,
      enableReflections: true,
      geometryComplexity: 1.0,
      shadowMapSize: 1024,
      enableInteractivity: true,
      animationFidelity: 1.0,
    },
  },
  goldenSnitch: {
    lowDetail: {
      particleCount: 20,
      enableShadows: false,
      enableReflections: false,
      geometryComplexity: 0.3,
      shadowMapSize: 256,
      enableInteractivity: false,
      animationFidelity: 0.3,
    },
    mediumDetail: {
      particleCount: 50,
      enableShadows: true,
      enableReflections: false,
      geometryComplexity: 0.7,
      shadowMapSize: 512,
      enableInteractivity: true,
      animationFidelity: 0.7,
    },
    highDetail: {
      particleCount: 100,
      enableShadows: true,
      enableReflections: true,
      geometryComplexity: 1.0,
      shadowMapSize: 1024,
      enableInteractivity: true,
      animationFidelity: 1.0,
    },
  },
};

function detectDevicePerformance(): DevicePerformance {
  if (typeof window === 'undefined') {
    return {
      level: 'medium',
      memoryMB: 4096,
      isLowPowerDevice: false,
      isMobile: false,
      supportedFeatures: {
        webgl2: true,
        shadows: true,
        floatTextures: true,
      },
    };
  }

  // Check device memory
  const memoryMB = (navigator as any).deviceMemory 
    ? (navigator as any).deviceMemory * 1024 
    : 4096; // Default to 4GB if not available

  // Check hardware concurrency (CPU cores)
  const cpuCores = navigator.hardwareConcurrency || 4;

  // Check WebGL capabilities
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  
  const supportedFeatures = {
    webgl2: !!canvas.getContext('webgl2'),
    shadows: gl ? gl.getExtension('WEBGL_depth_texture') !== null : false,
    floatTextures: gl ? gl.getExtension('OES_texture_float') !== null : false,
  };

  // Determine performance level
  let level: LODLevel = 'medium';
  let isLowPowerDevice = false;

  if (memoryMB < 2048 || cpuCores < 4) {
    level = 'low';
    isLowPowerDevice = true;
  } else if (memoryMB > 8192 && cpuCores >= 8 && supportedFeatures.webgl2) {
    level = 'high';
  }

  // Check for mobile devices
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  if (isMobile) {
    level = level === 'high' ? 'medium' : 'low';
    isLowPowerDevice = true;
  }

  return {
    level,
    memoryMB,
    isLowPowerDevice,
    isMobile,
    supportedFeatures,
  };
}

export function useDevicePerformance() {
  const [performance, setPerformance] = useState<DevicePerformance>(() => 
    detectDevicePerformance()
  );

  useEffect(() => {
    // Re-detect on mount to ensure accurate client-side detection
    setPerformance(detectDevicePerformance());
  }, []);

  return performance;
}

export function useLODConfig() {
  const devicePerformance = useDevicePerformance();

  return {
    config: defaultLODConfig,
    level: devicePerformance.level,
    getComponentConfig: (componentName: string) => {
      const componentConfig = defaultLODConfig[componentName];
      if (!componentConfig) {
        return null;
      }

      const levelKey = `${devicePerformance.level}Detail` as keyof typeof componentConfig;
      return componentConfig[levelKey];
    },
  };
}

// Utility function to check if component should be rendered at all
export function shouldRenderComponent(componentName: string, lodConfig: any): boolean {
  const config = lodConfig.getComponentConfig(componentName);
  if (!config) return false;
  
  // Check if instance count is 0 (disabled)
  if ('instanceCount' in config && config.instanceCount === 0) {
    return false;
  }
  
  // Check if particle count is 0 (disabled)
  if ('particleCount' in config && config.particleCount === 0) {
    return false;
  }
  
  return true;
}

// Utility function to get performance-adjusted delay for animations
export function getPerformanceAdjustedDelay(baseDelay: number, devicePerformance: DevicePerformance): number {
  if (devicePerformance.isMobile) {
    // Increase delays on mobile to reduce battery drain
    return baseDelay * (devicePerformance.isLowPowerDevice ? 2 : 1.5);
  }
  return baseDelay;
}