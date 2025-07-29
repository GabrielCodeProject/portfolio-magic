/**
 * Performance Thresholds Configuration
 * Defines client-side performance thresholds for 3D component rendering
 * Compatible with Next.js static export and GitHub Pages
 */

import { type DeviceCapabilities } from './deviceCapabilities';

// Performance tier system as specified in PRD
export type PerformanceTier = 'high-end' | 'mid-range' | 'low-end';

// Component enablement matrix
export interface ComponentMatrix {
  candles: boolean;
  portraits: boolean;
  snitch: boolean;
}

// Threshold configuration
export interface PerformanceThresholdConfig {
  tier: PerformanceTier;
  minScore: number;
  maxScore: number;
  components: ComponentMatrix;
  description: string;
  deviceExamples: string[];
  renderingSettings: {
    maxCandles: number;
    maxPortraits: number;
    enableSnitchTrail: boolean;
    enableShadows: boolean;
    enableParticles: boolean;
    textureQuality: 'high' | 'medium' | 'low';
    animationComplexity: 'high' | 'medium' | 'low' | 'none';
  };
}

/**
 * Performance threshold definitions
 * Based on device capability scoring (0-100)
 */
export const PERFORMANCE_THRESHOLDS: PerformanceThresholdConfig[] = [
  {
    tier: 'high-end',
    minScore: 70,
    maxScore: 100,
    components: {
      candles: true,
      portraits: true,
      snitch: true,
    },
    description: 'High-performance devices that can handle all 3D components with full quality',
    deviceExamples: [
      'Desktop with dedicated GPU',
      'High-end laptops',
      'Latest MacBooks with M1/M2/M3',
      'Gaming laptops',
      'Workstations'
    ],
    renderingSettings: {
      maxCandles: 8,
      maxPortraits: 4,
      enableSnitchTrail: true,
      enableShadows: true,
      enableParticles: true,
      textureQuality: 'high',
      animationComplexity: 'high',
    },
  },
  {
    tier: 'mid-range',
    minScore: 40,
    maxScore: 69,
    components: {
      candles: true,
      portraits: false,
      snitch: false,
    },
    description: 'Mid-range devices that can handle simple 3D components (candles only)',
    deviceExamples: [
      'Older desktops with integrated graphics',
      'Mid-range laptops',
      'Tablets with decent processors',
      'Some high-end mobile devices',
      'Chromebooks with Intel graphics'
    ],
    renderingSettings: {
      maxCandles: 4,
      maxPortraits: 0,
      enableSnitchTrail: false,
      enableShadows: false,
      enableParticles: false,
      textureQuality: 'medium',
      animationComplexity: 'low',
    },
  },
  {
    tier: 'low-end',
    minScore: 0,
    maxScore: 39,
    components: {
      candles: false,
      portraits: false,
      snitch: false,
    },
    description: 'Low-end devices that should use 2D fallbacks for all components',
    deviceExamples: [
      'Mobile phones',
      'Old tablets',
      'Low-end Chromebooks',
      'Devices with very limited RAM',
      'Devices without WebGL support'
    ],
    renderingSettings: {
      maxCandles: 0,
      maxPortraits: 0,
      enableSnitchTrail: false,
      enableShadows: false,
      enableParticles: false,
      textureQuality: 'low',
      animationComplexity: 'none',
    },
  },
];

/**
 * Get performance tier based on device capabilities
 */
export function getPerformanceTier(capabilities: DeviceCapabilities): PerformanceTier {
  // Calculate a comprehensive score based on multiple factors
  const score = calculateComprehensiveScore(capabilities);
  
  // Find matching threshold
  for (const threshold of PERFORMANCE_THRESHOLDS) {
    if (score >= threshold.minScore && score <= threshold.maxScore) {
      return threshold.tier;
    }
  }
  
  // Fallback to low-end for safety
  return 'low-end';
}

/**
 * Get threshold configuration for a specific tier
 */
export function getThresholdConfig(tier: PerformanceTier): PerformanceThresholdConfig {
  const config = PERFORMANCE_THRESHOLDS.find(t => t.tier === tier);
  if (!config) {
    throw new Error(`Unknown performance tier: ${tier}`);
  }
  return config;
}

/**
 * Get threshold configuration based on device capabilities
 */
export function getThresholdConfigForDevice(capabilities: DeviceCapabilities): PerformanceThresholdConfig {
  const tier = getPerformanceTier(capabilities);
  return getThresholdConfig(tier);
}

/**
 * Check if a specific component should be enabled
 */
export function shouldEnableComponent(
  component: keyof ComponentMatrix,
  capabilities: DeviceCapabilities
): boolean {
  const config = getThresholdConfigForDevice(capabilities);
  return config.components[component];
}

/**
 * Get recommended settings for the device
 */
export function getRecommendedSettings(capabilities: DeviceCapabilities) {
  const config = getThresholdConfigForDevice(capabilities);
  return config.renderingSettings;
}

/**
 * Calculate a comprehensive performance score
 * This is more detailed than the basic scoring in deviceCapabilities
 */
function calculateComprehensiveScore(capabilities: DeviceCapabilities): number {
  let score = 0;
  
  // Base score from device class (40 points max)
  switch (capabilities.class) {
    case 'desktop-high':
      score += 40;
      break;
    case 'desktop-low':
      score += 25;
      break;
    case 'tablet':
      score += 15;
      break;
    case 'mobile-high':
      score += 10;
      break;
    case 'mobile-low':
      score += 0;
      break;
  }
  
  // WebGL capabilities (20 points max)
  if (!isBrowser()) {
    score += 10; // Neutral score for SSR
  } else {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl');
      const gl2 = canvas.getContext('webgl2');
      
      if (gl2) {
        score += 20; // WebGL 2 support
      } else if (gl) {
        score += 12; // WebGL 1 only
        
        // Check for important extensions
        const extensions = gl.getSupportedExtensions() || [];
        if (extensions.includes('OES_texture_float')) score += 2;
        if (extensions.includes('WEBGL_depth_texture')) score += 2;
        if (extensions.includes('ANGLE_instanced_arrays')) score += 2;
        
        // Check texture size support
        const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        if (maxTextureSize >= 4096) score += 2;
      }
    } catch {
      // WebGL not supported
      score += 0;
    }
  }
  
  // Memory estimation (15 points max)
  if (isBrowser()) {
    const memory = getEstimatedMemory();
    if (memory >= 8192) {
      score += 15; // 8GB+
    } else if (memory >= 4096) {
      score += 12; // 4GB+
    } else if (memory >= 2048) {
      score += 8;  // 2GB+
    } else if (memory >= 1024) {
      score += 4;  // 1GB+
    }
  } else {
    score += 8; // Neutral for SSR
  }
  
  // CPU cores (10 points max)
  if (isBrowser()) {
    const cores = navigator.hardwareConcurrency || 1;
    score += Math.min(cores * 1.5, 10);
  } else {
    score += 5; // Neutral for SSR
  }
  
  // Screen resolution consideration (10 points max)
  if (isBrowser()) {
    const pixels = window.screen.width * window.screen.height;
    const pixelRatio = window.devicePixelRatio || 1;
    const totalPixels = pixels * pixelRatio;
    
    if (totalPixels > 4000000) {
      score += 10; // 4K+ displays
    } else if (totalPixels > 2000000) {
      score += 8;  // 2K displays
    } else if (totalPixels > 1000000) {
      score += 5;  // 1080p displays
    }
  } else {
    score += 5; // Neutral for SSR
  }
  
  // Additional penalties for known low-performance indicators
  if (isBrowser()) {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Mobile device penalty
    if (userAgent.includes('mobile') || userAgent.includes('android')) {
      score -= 15;
    }
    
    // Old browser penalty
    if (userAgent.includes('chrome/')) {
      const chromeVersion = parseInt(userAgent.split('chrome/')[1]);
      if (chromeVersion < 90) score -= 5;
    }
    
    // Low memory warning
    if ((navigator as any).deviceMemory && (navigator as any).deviceMemory < 2) {
      score -= 10;
    }
  }
  
  // Normalize to 0-100 range
  return Math.max(0, Math.min(100, score));
}

/**
 * Estimate device memory when Device Memory API is not available
 */
function getEstimatedMemory(): number {
  if (!isBrowser()) return 4096; // Default for SSR
  
  // Use Device Memory API if available
  const deviceMemory = (navigator as any).deviceMemory;
  if (deviceMemory) {
    return deviceMemory * 1024; // Convert GB to MB
  }
  
  // Fallback estimation based on other factors
  const cores = navigator.hardwareConcurrency || 1;
  const screenPixels = window.screen.width * window.screen.height;
  const userAgent = navigator.userAgent.toLowerCase();
  
  // Mobile device estimation
  if (userAgent.includes('mobile') || userAgent.includes('android')) {
    if (cores >= 8) return 6144;  // 6GB (high-end mobile)
    if (cores >= 6) return 4096;  // 4GB (mid-range mobile)
    return 2048; // 2GB (low-end mobile)
  }
  
  // Desktop/laptop estimation
  if (cores >= 8 && screenPixels >= 2073600) {
    return 16384; // 16GB (high-end desktop)
  } else if (cores >= 6) {
    return 8192;  // 8GB (mid-range desktop)
  } else if (cores >= 4) {
    return 4096;  // 4GB (entry desktop)
  } else {
    return 2048;  // 2GB (old/low-end)
  }
}

/**
 * Check if running in browser environment
 */
function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

/**
 * Performance monitoring thresholds for runtime adjustments
 */
export const FPS_THRESHOLDS = {
  HIGH_END: {
    target: 60,
    minimum: 45,
    degradation: 40,
  },
  MID_RANGE: {
    target: 45,
    minimum: 30,
    degradation: 25,
  },
  LOW_END: {
    target: 30,
    minimum: 20,
    degradation: 15,
  },
} as const;

/**
 * Get FPS thresholds for a performance tier
 */
export function getFpsThresholds(tier: PerformanceTier) {
  switch (tier) {
    case 'high-end':
      return FPS_THRESHOLDS.HIGH_END;
    case 'mid-range':
      return FPS_THRESHOLDS.MID_RANGE;
    case 'low-end':
      return FPS_THRESHOLDS.LOW_END;
    default:
      return FPS_THRESHOLDS.LOW_END;
  }
}

/**
 * Utility to log performance tier information (development only)
 */
export function logPerformanceTier(capabilities: DeviceCapabilities): void {
  if (process.env.NODE_ENV !== 'development') return;
  
  const tier = getPerformanceTier(capabilities);
  const config = getThresholdConfig(tier);
  const score = calculateComprehensiveScore(capabilities);
  
  console.group(`[Performance Tier: ${tier.toUpperCase()}]`);
  console.log('Score:', score);
  console.log('Device Class:', capabilities.class);
  console.log('Enabled Components:', config.components);
  console.log('Settings:', config.renderingSettings);
  console.log('Description:', config.description);
  console.groupEnd();
}

/**
 * Export all thresholds for external configuration
 */
export { PERFORMANCE_THRESHOLDS as default };