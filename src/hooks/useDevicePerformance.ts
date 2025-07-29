'use client';

import { useEffect, useState } from 'react';

// Performance levels for LOD system
export type PerformanceLevel = 'high' | 'medium' | 'low';

// Device type classification
export type DeviceType = 'desktop' | 'tablet' | 'mobile';

interface DeviceCapabilities {
  performanceLevel: PerformanceLevel;
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  hardwareConcurrency: number;
  deviceMemory?: number;
  maxTouchPoints: number;
  screenResolution: {
    width: number;
    height: number;
    pixelRatio: number;
  };
  webGLSupported: boolean;
  webGL2Supported: boolean;
}

/**
 * Hook for detecting device performance capabilities and determining appropriate LOD level
 */
export function useDevicePerformance(): DeviceCapabilities {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    performanceLevel: 'medium',
    deviceType: 'desktop',
    isMobile: false,
    isTablet: false,
    isDesktop: true,
    hardwareConcurrency: 4,
    maxTouchPoints: 0,
    screenResolution: {
      width: 1920,
      height: 1080,
      pixelRatio: 1,
    },
    webGLSupported: true,
    webGL2Supported: true,
  });

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') return;

    const detectCapabilities = (): DeviceCapabilities => {
      // Screen and display information
      const width = window.screen.width;
      const height = window.screen.height;
      const pixelRatio = window.devicePixelRatio || 1;

      // Hardware information
      const hardwareConcurrency = navigator.hardwareConcurrency || 4;
      const deviceMemory = (navigator as typeof navigator & { deviceMemory?: number }).deviceMemory;
      const maxTouchPoints = navigator.maxTouchPoints || 0;

      // WebGL support detection
      let webGLSupported = false;
      let webGL2Supported = false;
      
      try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        const gl2 = canvas.getContext('webgl2');
        webGLSupported = !!gl;
        webGL2Supported = !!gl2;
      } catch {
        // WebGL not supported
      }

      // Device type detection
      let deviceType: DeviceType = 'desktop';
      let isMobile = false;
      let isTablet = false;
      let isDesktop = true;

      // Mobile detection using multiple signals
      const userAgent = navigator.userAgent.toLowerCase();
      const mobileKeywords = ['mobile', 'android', 'iphone', 'ipod', 'blackberry', 'windows phone'];
      const tabletKeywords = ['tablet', 'ipad', 'kindle', 'silk'];

      const isMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
      const isTabletUA = tabletKeywords.some(keyword => userAgent.includes(keyword));

      // Screen size-based detection (fallback)
      const isSmallScreen = width <= 768;
      const isMediumScreen = width <= 1024 && width > 768;
      const hasTouch = maxTouchPoints > 0;

      if (isMobileUA || (isSmallScreen && hasTouch)) {
        deviceType = 'mobile';
        isMobile = true;
        isDesktop = false;
      } else if (isTabletUA || (isMediumScreen && hasTouch)) {
        deviceType = 'tablet';
        isTablet = true;
        isDesktop = false;
      }

      // Performance level calculation
      let performanceLevel: PerformanceLevel = 'medium';

      // Factors for performance calculation
      const performanceScore = calculatePerformanceScore({
        hardwareConcurrency,
        deviceMemory,
        screenWidth: width,
        screenHeight: height,
        pixelRatio,
        webGLSupported,
        webGL2Supported,
        deviceType,
      });

      if (performanceScore >= 80) {
        performanceLevel = 'high';
      } else if (performanceScore >= 50) {
        performanceLevel = 'medium';
      } else {
        performanceLevel = 'low';
      }

      return {
        performanceLevel,
        deviceType,
        isMobile,
        isTablet,
        isDesktop,
        hardwareConcurrency,
        deviceMemory,
        maxTouchPoints,
        screenResolution: {
          width,
          height,
          pixelRatio,
        },
        webGLSupported,
        webGL2Supported,
      };
    };

    setCapabilities(detectCapabilities());
  }, []);

  return capabilities;
}

/**
 * Calculate a performance score based on various device capabilities
 */
function calculatePerformanceScore({
  hardwareConcurrency,
  deviceMemory,
  screenWidth,
  screenHeight,
  pixelRatio,
  webGLSupported,
  webGL2Supported,
  deviceType,
}: {
  hardwareConcurrency: number;
  deviceMemory?: number;
  screenWidth: number;
  screenHeight: number;
  pixelRatio: number;
  webGLSupported: boolean;
  webGL2Supported: boolean;
  deviceType: DeviceType;
}): number {
  let score = 0;

  // CPU cores (max 25 points)
  score += Math.min(hardwareConcurrency * 4, 25);

  // Memory (max 20 points)
  if (deviceMemory) {
    score += Math.min(deviceMemory * 3, 20);
  } else {
    // Estimate based on device type
    const memoryEstimate = deviceType === 'mobile' ? 4 : deviceType === 'tablet' ? 6 : 8;
    score += Math.min(memoryEstimate * 3, 20);
  }

  // Screen resolution penalty for high-DPI displays (max -10 points)
  const totalPixels = screenWidth * screenHeight * pixelRatio;
  if (totalPixels > 4000000) { // 4K+ equivalent
    score -= 10;
  } else if (totalPixels > 2000000) { // 2K equivalent
    score -= 5;
  }

  // WebGL support (max 15 points)
  if (webGL2Supported) {
    score += 15;
  } else if (webGLSupported) {
    score += 10;
  }

  // Device type bonus/penalty (max 20 points)
  switch (deviceType) {
    case 'desktop':
      score += 20;
      break;
    case 'tablet':
      score += 10;
      break;
    case 'mobile':
      score += 0; // No bonus for mobile
      break;
  }

  // Normalize to 0-100 scale
  return Math.max(0, Math.min(100, score));
}

/**
 * Hook for getting LOD-specific configurations based on performance level
 */
export function useLODConfig() {
  const { performanceLevel, deviceType } = useDevicePerformance();

  const lodConfig = {
    high: {
      // Desktop high performance
      floatingCandles: {
        count: 8,
        quality: 'high',
        shadows: true,
        lightIntensity: 0.4,
        particleEffects: true,
      },
      movingPortraits: {
        count: 4,
        quality: 'high',
        animationComplexity: 'high',
        interactivity: true,
      },
      goldenSnitch: {
        wingDetail: 'high',
        animationComplexity: 'high',
        trailEffects: true,
        flightComplexity: 'high',
      },
    },
    medium: {
      // Desktop medium performance or tablets
      floatingCandles: {
        count: 6,
        quality: 'medium',
        shadows: true,
        lightIntensity: 0.3,
        particleEffects: false,
      },
      movingPortraits: {
        count: 3,
        quality: 'medium',
        animationComplexity: 'medium',
        interactivity: true,
      },
      goldenSnitch: {
        wingDetail: 'medium',
        animationComplexity: 'medium',
        trailEffects: false,
        flightComplexity: 'medium',
      },
    },
    low: {
      // Mobile devices
      floatingCandles: {
        count: 3,
        quality: 'low',
        shadows: false,
        lightIntensity: 0.2,
        particleEffects: false,
      },
      movingPortraits: {
        count: 2,
        quality: 'low',
        animationComplexity: 'low',
        interactivity: false,
      },
      goldenSnitch: {
        wingDetail: 'low',
        animationComplexity: 'low',
        trailEffects: false,
        flightComplexity: 'low',
      },
    },
  };

  return {
    performanceLevel,
    deviceType,
    config: lodConfig[performanceLevel],
    allConfigs: lodConfig,
  };
}