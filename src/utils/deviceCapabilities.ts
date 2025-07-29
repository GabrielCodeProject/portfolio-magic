/**
 * Device Capabilities Utility
 * Client-side utility functions for detecting device capabilities
 * Compatible with Next.js static export and GitHub Pages
 */

// Device capability levels
export type DeviceCapabilityLevel = 'high' | 'medium' | 'low' | 'minimal';

// Device classification
export type DeviceClass = 'desktop-high' | 'desktop-low' | 'tablet' | 'mobile-high' | 'mobile-low';

// Comprehensive device information
export interface DeviceCapabilities {
  class: DeviceClass;
  level: DeviceCapabilityLevel;
  canRender3D: boolean;
  shouldUseCandles: boolean;
  shouldUsePortraits: boolean;
  shouldUseSnitch: boolean;
  maxComplexity: 'high' | 'medium' | 'low' | 'none';
  recommendedSettings: {
    shadows: boolean;
    antialiasing: boolean;
    particleCount: number;
    textureQuality: 'high' | 'medium' | 'low';
    animationComplexity: 'high' | 'medium' | 'low';
  };
}

// Memory thresholds in MB
const MEMORY_THRESHOLDS = {
  HIGH: 8192,   // 8GB+
  MEDIUM: 4096, // 4GB+  
  LOW: 2048,    // 2GB+
  MINIMAL: 1024 // 1GB+
} as const;

// Screen resolution categories
const RESOLUTION_CATEGORIES = {
  HIGH: 2073600,    // 1920x1080+
  MEDIUM: 1048576,  // 1024x1024+
  LOW: 786432,      // 1024x768+
} as const;

/**
 * Detect if we're running in a browser environment
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Detect if device has touch capabilities
 */
export function isTouchDevice(): boolean {
  if (!isBrowser()) return false;
  
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    // @ts-ignore - IE fallback
    navigator.msMaxTouchPoints > 0
  );
}

/**
 * Detect mobile device using multiple heuristics
 */
export function isMobileDevice(): boolean {
  if (!isBrowser()) return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileKeywords = [
    'mobile', 'android', 'iphone', 'ipod', 'blackberry', 
    'windows phone', 'opera mini', 'iemobile'
  ];
  
  const hasMobileUA = mobileKeywords.some(keyword => userAgent.includes(keyword));
  const hasSmallScreen = window.screen.width <= 768;
  const hasTouch = isTouchDevice();
  
  return hasMobileUA || (hasSmallScreen && hasTouch);
}

/**
 * Detect tablet device
 */
export function isTabletDevice(): boolean {
  if (!isBrowser()) return false;
  
  const userAgent = navigator.userAgent.toLowerCase();
  const tabletKeywords = ['tablet', 'ipad', 'kindle', 'silk', 'playbook'];
  
  const hasTabletUA = tabletKeywords.some(keyword => userAgent.includes(keyword));
  const isMediumScreen = window.screen.width > 768 && window.screen.width <= 1024;
  const hasTouch = isTouchDevice();
  
  return hasTabletUA || (isMediumScreen && hasTouch);
}

/**
 * Get estimated device memory
 */
export function getDeviceMemory(): number {
  if (!isBrowser()) return MEMORY_THRESHOLDS.MEDIUM;
  
  // Use Device Memory API if available
  const deviceMemory = (navigator as any).deviceMemory;
  if (deviceMemory) {
    return deviceMemory * 1024; // Convert GB to MB
  }
  
  // Fallback estimation based on device type and other factors
  if (isMobileDevice()) {
    return MEMORY_THRESHOLDS.LOW;
  } else if (isTabletDevice()) {
    return MEMORY_THRESHOLDS.MEDIUM;
  } else {
    // Desktop - estimate based on other factors
    const cores = navigator.hardwareConcurrency || 4;
    const screenPixels = window.screen.width * window.screen.height;
    
    if (cores >= 8 && screenPixels >= RESOLUTION_CATEGORIES.HIGH) {
      return MEMORY_THRESHOLDS.HIGH;
    } else if (cores >= 4) {
      return MEMORY_THRESHOLDS.MEDIUM;
    } else {
      return MEMORY_THRESHOLDS.LOW;
    }
  }
}

/**
 * Check WebGL support and capabilities
 */
export function getWebGLCapabilities(): {
  webgl1: boolean;
  webgl2: boolean;
  maxTextureSize: number;
  maxRenderbufferSize: number;
  vendor: string;
  renderer: string;
} {
  if (!isBrowser()) {
    return {
      webgl1: false,
      webgl2: false,
      maxTextureSize: 0,
      maxRenderbufferSize: 0,
      vendor: 'Unknown',
      renderer: 'Unknown'
    };
  }
  
  try {
    const canvas = document.createElement('canvas');
    const gl1 = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    const gl2 = canvas.getContext('webgl2');
    
    if (!gl1) {
      return {
        webgl1: false,
        webgl2: false,
        maxTextureSize: 0,
        maxRenderbufferSize: 0,
        vendor: 'Unknown',
        renderer: 'Unknown'
      };
    }
    
    // Cast to WebGL context for proper typing
    const webglContext = gl1 as WebGLRenderingContext;
    
    // Get debug info
    const debugInfo = webglContext.getExtension('WEBGL_debug_renderer_info');
    const vendor = debugInfo ? webglContext.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Unknown';
    const renderer = debugInfo ? webglContext.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Unknown';
    
    return {
      webgl1: true,
      webgl2: !!gl2,
      maxTextureSize: webglContext.getParameter(webglContext.MAX_TEXTURE_SIZE),
      maxRenderbufferSize: webglContext.getParameter(webglContext.MAX_RENDERBUFFER_SIZE),
      vendor: vendor.toString(),
      renderer: renderer.toString()
    };
  } catch (error) {
    return {
      webgl1: false,
      webgl2: false,
      maxTextureSize: 0,
      maxRenderbufferSize: 0,
      vendor: 'Unknown',
      renderer: 'Unknown'
    };
  }
}

/**
 * Detect if device is likely low-power
 */
export function isLowPowerDevice(): boolean {
  if (!isBrowser()) return true;
  
  const memory = getDeviceMemory();
  const cores = navigator.hardwareConcurrency || 1;
  const webgl = getWebGLCapabilities();
  
  // Check for mobile devices
  if (isMobileDevice()) {
    return true;
  }
  
  // Check for low memory
  if (memory < MEMORY_THRESHOLDS.LOW) {
    return true;
  }
  
  // Check for low CPU cores
  if (cores < 4) {
    return true;
  }
  
  // Check for weak integrated graphics
  const renderer = webgl.renderer.toLowerCase();
  const lowPowerGPUs = [
    'intel hd graphics',
    'intel uhd graphics',
    'intel iris xe graphics',
    'hd graphics 2000',
    'hd graphics 3000',
    'hd graphics 4000'
  ];
  
  if (lowPowerGPUs.some(gpu => renderer.includes(gpu))) {
    return true;
  }
  
  return false;
}

/**
 * Calculate device performance score (0-100)
 */
export function calculateDeviceScore(): number {
  if (!isBrowser()) return 50; // Neutral score for SSR
  
  let score = 0;
  
  // Memory score (max 25 points)
  const memory = getDeviceMemory();
  if (memory >= MEMORY_THRESHOLDS.HIGH) {
    score += 25;
  } else if (memory >= MEMORY_THRESHOLDS.MEDIUM) {
    score += 18;
  } else if (memory >= MEMORY_THRESHOLDS.LOW) {
    score += 12;
  } else {
    score += 5;
  }
  
  // CPU score (max 20 points)
  const cores = navigator.hardwareConcurrency || 1;
  score += Math.min(cores * 3, 20);
  
  // WebGL score (max 20 points)
  const webgl = getWebGLCapabilities();
  if (webgl.webgl2) {
    score += 20;
  } else if (webgl.webgl1) {
    score += 12;
  }
  
  // Screen resolution score (max 15 points)
  const screenPixels = window.screen.width * window.screen.height * (window.devicePixelRatio || 1);
  if (screenPixels >= RESOLUTION_CATEGORIES.HIGH) {
    score += 15;
  } else if (screenPixels >= RESOLUTION_CATEGORIES.MEDIUM) {
    score += 10;
  } else if (screenPixels >= RESOLUTION_CATEGORIES.LOW) {
    score += 5;
  }
  
  // Device type bonus/penalty (max 20 points)
  if (isMobileDevice()) {
    score += 0; // No bonus for mobile
  } else if (isTabletDevice()) {
    score += 8;
  } else {
    score += 20; // Desktop bonus
  }
  
  // Low power penalty
  if (isLowPowerDevice()) {
    score -= 15;
  }
  
  return Math.max(0, Math.min(100, score));
}

/**
 * Classify device based on all capabilities
 */
export function classifyDevice(): DeviceClass {
  if (!isBrowser()) return 'desktop-low'; // Conservative default for SSR
  
  const score = calculateDeviceScore();
  const webgl = getWebGLCapabilities();
  
  if (isMobileDevice()) {
    return score >= 40 && webgl.webgl1 ? 'mobile-high' : 'mobile-low';
  } else if (isTabletDevice()) {
    return 'tablet';
  } else {
    // Desktop
    return score >= 60 && webgl.webgl2 ? 'desktop-high' : 'desktop-low';
  }
}

/**
 * Get comprehensive device capabilities
 */
export function getDeviceCapabilities(): DeviceCapabilities {
  if (!isBrowser()) {
    // SSR/Static generation defaults
    return {
      class: 'desktop-low',
      level: 'medium',
      canRender3D: false,
      shouldUseCandles: false,
      shouldUsePortraits: false,
      shouldUseSnitch: false,
      maxComplexity: 'low',
      recommendedSettings: {
        shadows: false,
        antialiasing: false,
        particleCount: 0,
        textureQuality: 'low',
        animationComplexity: 'low',
      },
    };
  }
  
  const deviceClass = classifyDevice();
  const score = calculateDeviceScore();
  const webgl = getWebGLCapabilities();
  
  // Determine capability level
  let level: DeviceCapabilityLevel = 'minimal';
  if (score >= 80) {
    level = 'high';
  } else if (score >= 60) {
    level = 'medium';
  } else if (score >= 40) {
    level = 'low';
  }
  
  // Determine what can be rendered
  const canRender3D = webgl.webgl1 && score >= 30;
  const shouldUseCandles = canRender3D && score >= 40;
  const shouldUsePortraits = canRender3D && score >= 50;
  const shouldUseSnitch = canRender3D && score >= 60;
  
  // Determine max complexity
  let maxComplexity: 'high' | 'medium' | 'low' | 'none' = 'none';
  if (canRender3D) {
    if (score >= 75) {
      maxComplexity = 'high';
    } else if (score >= 55) {
      maxComplexity = 'medium';
    } else {
      maxComplexity = 'low';
    }
  }
  
  // Generate recommended settings
  const recommendedSettings = {
    shadows: score >= 70 && webgl.webgl2,
    antialiasing: score >= 60,
    particleCount: Math.max(0, Math.floor((score - 30) / 10)),
    textureQuality: (score >= 70 ? 'high' : score >= 50 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
    animationComplexity: (score >= 75 ? 'high' : score >= 55 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
  };
  
  return {
    class: deviceClass,
    level,
    canRender3D,
    shouldUseCandles,
    shouldUsePortraits,
    shouldUseSnitch,
    maxComplexity,
    recommendedSettings,
  };
}

/**
 * Check if current performance allows for a specific 3D component
 * Now uses the new performance threshold system
 */
export function canRenderComponent(component: 'candles' | 'portraits' | 'snitch'): boolean {
  // Import here to avoid circular dependencies
  const { shouldEnableComponent } = require('./performanceThresholds');
  const capabilities = getDeviceCapabilities();
  
  return shouldEnableComponent(component, capabilities);
}

/**
 * Get performance-appropriate settings for a 3D component
 */
export function getComponentSettings(component: 'candles' | 'portraits' | 'snitch') {
  const capabilities = getDeviceCapabilities();
  const { recommendedSettings, level } = capabilities;
  
  const baseSettings = {
    candles: {
      high: { count: 8, flames: true, shadows: true, particles: true },
      medium: { count: 6, flames: true, shadows: false, particles: false },
      low: { count: 4, flames: false, shadows: false, particles: false },
      minimal: { count: 2, flames: false, shadows: false, particles: false },
    },
    portraits: {
      high: { count: 4, animations: true, interactions: true, quality: 'high' },
      medium: { count: 3, animations: true, interactions: true, quality: 'medium' },
      low: { count: 2, animations: false, interactions: false, quality: 'low' },
      minimal: { count: 1, animations: false, interactions: false, quality: 'low' },
    },
    snitch: {
      high: { wings: true, trail: true, complexity: 'high', speed: 1.0 },
      medium: { wings: true, trail: false, complexity: 'medium', speed: 0.8 },
      low: { wings: false, trail: false, complexity: 'low', speed: 0.6 },
      minimal: { wings: false, trail: false, complexity: 'low', speed: 0.4 },
    },
  };
  
  return {
    ...baseSettings[component][level],
    ...recommendedSettings,
  };
}

/**
 * Storage utilities for development mode performance tracking
 */
export const performanceStorage = {
  /**
   * Save performance metrics to localStorage (development only)
   */
  saveMetrics(metrics: Record<string, any>): void {
    if (!isBrowser() || process.env.NODE_ENV !== 'development') return;
    
    try {
      const timestamp = Date.now();
      const key = `perf_metrics_${timestamp}`;
      localStorage.setItem(key, JSON.stringify({ ...metrics, timestamp }));
      
      // Clean up old entries (keep last 50)
      const keys = Object.keys(localStorage)
        .filter(k => k.startsWith('perf_metrics_'))
        .sort()
        .reverse();
        
      if (keys.length > 50) {
        keys.slice(50).forEach(k => localStorage.removeItem(k));
      }
    } catch (error) {
      console.warn('Failed to save performance metrics:', error);
    }
  },

  /**
   * Load recent performance metrics from localStorage
   */
  loadRecentMetrics(count = 10): Array<Record<string, any>> {
    if (!isBrowser() || process.env.NODE_ENV !== 'development') return [];
    
    try {
      const keys = Object.keys(localStorage)
        .filter(k => k.startsWith('perf_metrics_'))
        .sort()
        .reverse()
        .slice(0, count);
        
      return keys.map(key => {
        try {
          return JSON.parse(localStorage.getItem(key) || '{}');
        } catch {
          return {};
        }
      }).filter(item => Object.keys(item).length > 0);
    } catch (error) {
      console.warn('Failed to load performance metrics:', error);
      return [];
    }
  },

  /**
   * Clear all performance metrics
   */
  clearMetrics(): void {
    if (!isBrowser() || process.env.NODE_ENV !== 'development') return;
    
    try {
      const keys = Object.keys(localStorage).filter(k => k.startsWith('perf_metrics_'));
      keys.forEach(k => localStorage.removeItem(k));
    } catch (error) {
      console.warn('Failed to clear performance metrics:', error);
    }
  }
};