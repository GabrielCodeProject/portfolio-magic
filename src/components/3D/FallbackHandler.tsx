'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LoadingSpinner } from '@/components/ui';
import { 
  FloatingCandlesFallback, 
  MovingPortraitsFallback, 
  GoldenSnitchFallback,
  FallbackNotification 
} from '@/components/ui/MagicalFallbacks';

// =====================================================
// TYPES AND INTERFACES
// =====================================================

type FallbackReason = 'webgl-unsupported' | 'reduced-motion' | 'performance' | 'device-limitation';

interface FallbackConfig {
  enableNotification: boolean;
  enableProgressiveEnhancement: boolean;
  fallbackDelay: number;
  showFallbackDetails: boolean;
  respectReducedMotion: boolean;
}

interface ComponentFallbackProps {
  children: React.ReactNode;
  fallbackComponent: React.ComponentType<any>;
  fallbackProps?: Record<string, any>;
  componentName: string;
  priority: 'high' | 'medium' | 'low';
  config?: Partial<FallbackConfig>;
  className?: string;
}

interface FallbackContextType {
  registerFallback: (componentName: string, reason: FallbackReason) => void;
  isUsingFallbacks: boolean;
  fallbackComponents: Set<string>;
  globalReason: FallbackReason | null;
}

// =====================================================
// FALLBACK CONTEXT
// =====================================================

const FallbackContext = React.createContext<FallbackContextType | null>(null);

export const useFallback = () => {
  const context = React.useContext(FallbackContext);
  if (!context) {
    throw new Error('useFallback must be used within a FallbackProvider');
  }
  return context;
};

// =====================================================
// DEVICE AND CAPABILITY DETECTION
// =====================================================

interface DeviceCapabilities {
  webglSupported: boolean;
  prefersReducedMotion: boolean;
  isLowEndDevice: boolean;
  isMobile: boolean;
  memoryLevel: 'low' | 'medium' | 'high';
  performanceLevel: 'low' | 'medium' | 'high';
}

const useDeviceCapabilities = (): DeviceCapabilities => {
  const [capabilities, setCapabilities] = useState<DeviceCapabilities>({
    webglSupported: true,
    prefersReducedMotion: false,
    isLowEndDevice: false,
    isMobile: false,
    memoryLevel: 'medium',
    performanceLevel: 'medium'
  });

  useEffect(() => {
    const detectCapabilities = () => {
      // WebGL detection
      const webglSupported = (() => {
        try {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
          return !!context;
        } catch {
          return false;
        }
      })();

      // Reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      // Mobile detection
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      // Memory detection (if available)
      const memory = (navigator as any).deviceMemory;
      const memoryLevel: 'low' | 'medium' | 'high' = 
        memory ? (memory <= 2 ? 'low' : memory <= 4 ? 'medium' : 'high') : 'medium';

      // Hardware concurrency (CPU cores)
      const cores = navigator.hardwareConcurrency || 4;
      
      // Performance level estimation
      const performanceLevel: 'low' | 'medium' | 'high' = (() => {
        if (!webglSupported) return 'low';
        if (isMobile && memoryLevel === 'low') return 'low';
        if (cores <= 2 && memoryLevel === 'low') return 'low';
        if (cores >= 6 && memoryLevel === 'high') return 'high';
        return 'medium';
      })();

      // Low-end device detection
      const isLowEndDevice = performanceLevel === 'low' || (isMobile && memoryLevel === 'low');

      setCapabilities({
        webglSupported,
        prefersReducedMotion,
        isLowEndDevice,
        isMobile,
        memoryLevel,
        performanceLevel
      });
    };

    detectCapabilities();

    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => detectCapabilities();
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return capabilities;
};

// =====================================================
// PROGRESSIVE ENHANCEMENT HANDLER
// =====================================================

interface ProgressiveEnhancementProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  enabledBy: 'webgl' | 'performance' | 'motion' | 'memory';
  delay?: number;
  className?: string;
}

const ProgressiveEnhancement: React.FC<ProgressiveEnhancementProps> = ({
  children,
  fallback,
  enabledBy,
  delay = 0,
  className
}) => {
  const capabilities = useDeviceCapabilities();
  const [showEnhanced, setShowEnhanced] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const shouldEnhance = (() => {
      switch (enabledBy) {
        case 'webgl':
          return capabilities.webglSupported && !capabilities.prefersReducedMotion;
        case 'performance':
          return capabilities.performanceLevel !== 'low';
        case 'motion':
          return !capabilities.prefersReducedMotion;
        case 'memory':
          return capabilities.memoryLevel !== 'low';
        default:
          return false;
      }
    })();

    if (shouldEnhance) {
      const enhancementTimer = setTimeout(() => {
        setShowEnhanced(true);
      }, delay);

      return () => clearTimeout(enhancementTimer);
    }
  }, [capabilities, enabledBy, delay, isReady]);

  if (!isReady) {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <LoadingSpinner size="sm" variant="magical" />
      </div>
    );
  }

  return (
    <div className={className}>
      {showEnhanced ? children : fallback}
    </div>
  );
};

// =====================================================
// COMPONENT FALLBACK WRAPPER
// =====================================================

const defaultFallbackConfig: FallbackConfig = {
  enableNotification: true,
  enableProgressiveEnhancement: true,
  fallbackDelay: 1000,
  showFallbackDetails: false,
  respectReducedMotion: true,
};

export const ComponentFallback: React.FC<ComponentFallbackProps> = ({
  children,
  fallbackComponent: FallbackComponent,
  fallbackProps = {},
  componentName,
  priority,
  config = {},
  className
}) => {
  const finalConfig = { ...defaultFallbackConfig, ...config };
  const capabilities = useDeviceCapabilities();
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fallbackReason, setFallbackReason] = useState<FallbackReason | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  // Determine fallback reason
  useEffect(() => {
    const determineFallbackReason = (): FallbackReason | null => {
      if (hasError) return 'device-limitation';
      if (!capabilities.webglSupported) return 'webgl-unsupported';
      if (capabilities.prefersReducedMotion && finalConfig.respectReducedMotion) return 'reduced-motion';
      if (capabilities.isLowEndDevice || capabilities.performanceLevel === 'low') return 'performance';
      if (capabilities.isMobile && priority === 'low') return 'device-limitation';
      return null;  // No fallback needed
    };

    const reason = determineFallbackReason();
    setFallbackReason(reason);
    
    if (reason && finalConfig.enableNotification) {
      const timer = setTimeout(() => {
        setShowNotification(true);
      }, finalConfig.fallbackDelay);
      
      return () => clearTimeout(timer);
    }
  }, [capabilities, hasError, priority, finalConfig, componentName]);

  // Loading timeout
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    useEffect(() => {
      const handleError = (error: ErrorEvent) => {
        console.warn(`3D Component Error (${componentName}):`, error);
        setHasError(true);
      };

      window.addEventListener('error', handleError);
      return () => window.removeEventListener('error', handleError);
    }, []);

    return <>{children}</>;
  };

  // If we need a fallback, render it
  if (fallbackReason) {
    return (
      <div className={cn('relative', className)}>
        <FallbackComponent
          reason={fallbackReason}
          {...fallbackProps}
        />
        
        {showNotification && (
          <FallbackNotification
            reason={fallbackReason}
            onDismiss={() => setShowNotification(false)}
            showDetails={finalConfig.showFallbackDetails}
          />
        )}
      </div>
    );
  }

  // Progressive enhancement approach
  if (finalConfig.enableProgressiveEnhancement) {
    return (
      <div className={className}>
        <ProgressiveEnhancement
          enabledBy="webgl"
          fallback={
            <FallbackComponent
              reason="performance"
              {...fallbackProps}
            />
          }
          delay={priority === 'high' ? 0 : priority === 'medium' ? 500 : 1000}
        >
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="flex items-center justify-center p-8">
                  <LoadingSpinner 
                    size="lg" 
                    variant="magical" 
                    text={`Loading magical ${componentName}...`}
                  />
                </div>
              }
            >
              {children}
            </Suspense>
          </ErrorBoundary>
        </ProgressiveEnhancement>
      </div>
    );
  }

  // Standard loading with error boundary
  return (
    <div className={className}>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="flex items-center justify-center p-8">
              <LoadingSpinner 
                size="lg" 
                variant="magical" 
                text={`Preparing ${componentName}...`}
              />
            </div>
          }
        >
          {children}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

// =====================================================
// GLOBAL FALLBACK PROVIDER
// =====================================================

interface FallbackProviderProps {
  children: React.ReactNode;
  config?: Partial<FallbackConfig>;
}

export const FallbackProvider: React.FC<FallbackProviderProps> = ({
  children,
  config = {}
}) => {
  const [fallbackComponents, setFallbackComponents] = useState<Set<string>>(new Set());
  const [globalReason, setGlobalReason] = useState<FallbackReason | null>(null);
  const capabilities = useDeviceCapabilities();
  
  const registerFallback = (componentName: string, reason: FallbackReason) => {
    setFallbackComponents(prev => new Set([...prev, componentName]));
    
    // Set global reason if not already set, prioritizing more severe reasons
    if (!globalReason || 
        (reason === 'webgl-unsupported' && globalReason !== 'webgl-unsupported') ||
        (reason === 'device-limitation' && globalReason === 'performance')) {
      setGlobalReason(reason);
    }
  };
  
  const isUsingFallbacks = fallbackComponents.size > 0;
  
  // Global fallback detection
  useEffect(() => {
    if (!capabilities.webglSupported) {
      setGlobalReason('webgl-unsupported');
    } else if (capabilities.prefersReducedMotion) {
      setGlobalReason('reduced-motion');
    } else if (capabilities.isLowEndDevice) {
      setGlobalReason('performance');
    }
  }, [capabilities]);
  
  const contextValue: FallbackContextType = {
    registerFallback,
    isUsingFallbacks,
    fallbackComponents,
    globalReason,
  };
  
  return (
    <FallbackContext.Provider value={contextValue}>
      {children}
      
      {/* Global notification for widespread fallbacks */}
      {isUsingFallbacks && fallbackComponents.size > 2 && globalReason && (
        <div className="fixed bottom-4 left-4 z-50">
          <div className="glass rounded-lg p-3 text-sm text-theme-text-secondary max-w-xs">
            <div className="flex items-center space-x-2">
              <div className="text-lg">✨</div>
              <div>
                <div className="font-semibold">Optimized Experience</div>
                <div className="text-xs opacity-80">
                  Using optimized magical effects for better performance
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </FallbackContext.Provider>
  );
};

// =====================================================
// SPECIFIC COMPONENT WRAPPERS
// =====================================================

export const FloatingCandlesWithFallback: React.FC<{
  children: React.ReactNode;
  count?: number;
  className?: string;
}> = ({ children, count, className }) => (
  <ComponentFallback
    componentName="Floating Candles"
    priority="medium"
    fallbackComponent={FloatingCandlesFallback}
    fallbackProps={{ count }}
    className={className}
  >
    {children}
  </ComponentFallback>
);

export const MovingPortraitsWithFallback: React.FC<{
  children: React.ReactNode;
  count?: number;
  className?: string;
}> = ({ children, count, className }) => (
  <ComponentFallback
    componentName="Moving Portraits"
    priority="low"
    fallbackComponent={MovingPortraitsFallback}
    fallbackProps={{ count }}
    className={className}
  >
    {children}
  </ComponentFallback>
);

export const GoldenSnitchWithFallback: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <ComponentFallback
    componentName="Golden Snitch"
    priority="high"
    fallbackComponent={GoldenSnitchFallback}
    fallbackProps={{}}
    className={className}
  >
    {children}
  </ComponentFallback>
);

// =====================================================
// PERFORMANCE MONITORING HOOK
// =====================================================

export const usePerformanceMonitoring = () => {
  const [metrics, setMetrics] = useState({
    fps: 60,
    memoryUsage: 0,
    renderTime: 0,
    isPerformant: true,
  });

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let animationFrame: number;

    const monitor = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
        const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
        
        setMetrics(prev => ({
          ...prev,
          fps,
          memoryUsage,
          isPerformant: fps > 30 && (memoryUsage < 50000000 || memoryUsage === 0),
        }));
        
        frameCount = 0;
        lastTime = currentTime;
      }
      
      animationFrame = requestAnimationFrame(monitor);
    };

    monitor();
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, []);

  return metrics;
};