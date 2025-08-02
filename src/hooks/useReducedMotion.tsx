'use client';

import { useState, useEffect } from 'react';

/**
 * Hook to detect user's reduced motion preferences
 * Critical for accessibility and mobile battery optimization
 */
export function useReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    // Set initial value
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Listen for changes
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return prefersReducedMotion;
}

/**
 * Hook to provide motion settings based on user preferences and device capabilities
 */
export function useMotionSettings() {
  const prefersReducedMotion = useReducedMotion();
  const [devicePerformance, setDevicePerformance] = useState<{
    isMobile: boolean;
    isLowPowerDevice: boolean;
  }>({
    isMobile: false,
    isLowPowerDevice: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      const memoryMB = (navigator as any).deviceMemory ? (navigator as any).deviceMemory * 1024 : 4096;
      const isLowPowerDevice = memoryMB < 2048;
      
      setDevicePerformance({ isMobile, isLowPowerDevice });
    }
  }, []);

  return {
    // Core motion settings
    shouldAnimate: !prefersReducedMotion,
    shouldUse3D: !prefersReducedMotion && !devicePerformance.isLowPowerDevice,
    shouldUseParticles: !prefersReducedMotion && !devicePerformance.isMobile,
    
    // Animation intensity modifiers
    animationDuration: prefersReducedMotion ? 0 : devicePerformance.isMobile ? 800 : 400,
    animationDelay: devicePerformance.isLowPowerDevice ? 200 : 100,
    
    // 3D-specific settings
    enableShadows: !prefersReducedMotion && !devicePerformance.isMobile,
    enableReflections: !prefersReducedMotion && !devicePerformance.isLowPowerDevice,
    particleCount: prefersReducedMotion ? 0 : devicePerformance.isMobile ? 10 : 50,
    
    // User preferences
    prefersReducedMotion,
    isMobile: devicePerformance.isMobile,
    isLowPowerDevice: devicePerformance.isLowPowerDevice,
  };
}

/**
 * Higher-order component to wrap components with motion controls
 */
export function withMotionControl<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options: {
    fallbackComponent?: React.ComponentType<T>;
    requiresMotion?: boolean;
    requires3D?: boolean;
  } = {}
): React.ComponentType<T> {
  const WrappedComponent: React.ComponentType<T> = (props: T) => {
    const motionSettings = useMotionSettings();
    
    // If component requires motion but user prefers reduced motion
    if (options.requiresMotion && !motionSettings.shouldAnimate) {
      if (options.fallbackComponent) {
        const FallbackComponent = options.fallbackComponent;
        return <FallbackComponent {...props} />;
      }
      return null;
    }
    
    // If component requires 3D but device doesn't support it well
    if (options.requires3D && !motionSettings.shouldUse3D) {
      if (options.fallbackComponent) {
        const FallbackComponent = options.fallbackComponent;
        return <FallbackComponent {...props} />;
      }
      return null;
    }
    
    return <Component {...props} motionSettings={motionSettings} />;
  };
  
  WrappedComponent.displayName = `withMotionControl(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}