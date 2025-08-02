'use client';

import React, { Suspense, lazy, useState, useEffect, useRef } from 'react';
import { useLODConfig, shouldRenderComponent } from '@/hooks/useDevicePerformance';
import { useIntersectionObserver as useIntersectionObserverHook } from '@/hooks/useIntersectionObserver';

// Types for lazy loading configuration
type LoadPriority = 'high' | 'medium' | 'low';
type ComponentType = 'floatingCandles' | 'movingPortraits' | 'goldenSnitch' | 'other';

interface Lazy3DConfig {
  loadPriority: LoadPriority;
  componentType: ComponentType;
  enableIntersectionObserver: boolean;
  enableDelayedLoading: boolean;
  errorBoundary?: boolean;
}

interface Lazy3DWrapperProps {
  children: React.ReactNode;
  config: Lazy3DConfig;
}

// Default configuration
const defaultConfig: Lazy3DConfig = {
  loadPriority: 'medium',
  componentType: 'other',
  enableIntersectionObserver: true,
  enableDelayedLoading: true,
  errorBoundary: true,
};

// 3D-native loading indicator using Three.js objects (no HTML)
function ThreeDLoadingIndicator({ opacity = 0.6 }: { opacity?: number }) {
  return (
    <group>
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[0.05, 8, 8]} />
        <meshBasicMaterial 
          color="#8B5CF6" 
          transparent 
          opacity={opacity}
        />
      </mesh>
      <mesh position={[0.2, 0, 0]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial 
          color="#10B981" 
          transparent 
          opacity={opacity * 0.8}
        />
      </mesh>
      <mesh position={[-0.2, 0, 0]}>
        <sphereGeometry args={[0.03, 6, 6]} />
        <meshBasicMaterial 
          color="#F59E0B" 
          transparent 
          opacity={opacity * 0.8}
        />
      </mesh>
    </group>
  );
}

// Error Boundary Component that returns 3D-compatible content
class Lazy3DErrorBoundary extends React.Component<
  { 
    children: React.ReactNode; 
    componentType: ComponentType;
  },
  { hasError: boolean }
> {
  constructor(props: { 
    children: React.ReactNode; 
    componentType: ComponentType;
  }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn(`3D Component Error (${this.props.componentType}):`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return 3D-native fallback (not HTML)
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <planeGeometry args={[2, 1]} />
            <meshBasicMaterial 
              color="#8B5CF6" 
              transparent 
              opacity={0.3}
            />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial 
              color="#F59E0B" 
              transparent 
              opacity={0.6}
            />
          </mesh>
        </group>
      );
    }

    return this.props.children;
  }
}

// Loading delay hook with performance optimization
function useDelayedLoading(delay: number, enabled: boolean): boolean {
  const [isReady, setIsReady] = useState(!enabled);

  useEffect(() => {
    if (!enabled) return;

    // Use requestIdleCallback for better performance if available
    const scheduleLoad = () => {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(() => {
          setTimeout(() => setIsReady(true), delay);
        });
      } else {
        setTimeout(() => setIsReady(true), delay);
      }
    };

    scheduleLoad();
  }, [delay, enabled]);

  return isReady;
}

// Main Lazy3D Wrapper Component - ONLY returns 3D content (no HTML)
export default function Lazy3DWrapper({
  children,
  config,
}: Lazy3DWrapperProps) {
  const finalConfig = { ...defaultConfig, ...config };
  const lodConfig = useLODConfig();
  
  // Check if component should render based on LOD
  const shouldRender = shouldRenderComponent(finalConfig.componentType, lodConfig);
  
  // Delayed loading based on priority with performance considerations
  const loadDelay = {
    high: 0,
    medium: 300,
    low: 800,
  }[finalConfig.loadPriority];
  
  const isDelayReady = useDelayedLoading(loadDelay, finalConfig.enableDelayedLoading);
  
  // Determine if we should load the component
  const shouldLoad = shouldRender && isDelayReady;

  // Performance logging
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && shouldLoad) {
      console.log(`🎭 Loading 3D Component: ${finalConfig.componentType}`, {
        priority: finalConfig.loadPriority,
        lodLevel: lodConfig.level,
        delayed: isDelayReady,
      });
    }
  }, [shouldLoad, finalConfig, lodConfig, isDelayReady]);

  // Don't render anything if LOD says no
  if (!shouldRender) {
    return null;
  }

  // Show 3D loading indicator while not ready
  if (!shouldLoad) {
    return <ThreeDLoadingIndicator opacity={0.4} />;
  }

  // Wrap with error boundary if enabled
  const content = (
    <Suspense fallback={<ThreeDLoadingIndicator opacity={0.6} />}>
      {children}
    </Suspense>
  );

  if (finalConfig.errorBoundary) {
    return (
      <Lazy3DErrorBoundary componentType={finalConfig.componentType}>
        {content}
      </Lazy3DErrorBoundary>
    );
  }

  return content;
}

// Utility function to create lazy 3D components with proper R3F architecture
export function createLazy3DComponent<T extends Record<string, any>>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  config: Partial<Lazy3DConfig> = {}
): React.ComponentType<T> {
  const LazyComponent = lazy(importFn);
  
  return function Lazy3DComponentWrapper(props: T) {
    return (
      <Lazy3DWrapper config={{ ...defaultConfig, ...config }}>
        <LazyComponent {...props} />
      </Lazy3DWrapper>
    );
  };
}

// Pre-configured lazy loaders with proper 3D architecture
export const FloatingCandlesLazy = createLazy3DComponent(
  () => import('./FloatingCandles'),
  {
    loadPriority: 'medium',
    componentType: 'floatingCandles',
    enableIntersectionObserver: false, // Disabled for Canvas components
    enableDelayedLoading: true,
    errorBoundary: true,
  }
);

export const MovingPortraitsLazy = createLazy3DComponent(
  () => import('./MovingPortraits'),
  {
    loadPriority: 'low',
    componentType: 'movingPortraits',
    enableIntersectionObserver: false, // Disabled for Canvas components
    enableDelayedLoading: true,
    errorBoundary: true,
  }
);

export const GoldenSnitchLazy = createLazy3DComponent(
  () => import('./GoldenSnitch'),
  {
    loadPriority: 'high',
    componentType: 'goldenSnitch',
    enableIntersectionObserver: false, // Disabled for Canvas components
    enableDelayedLoading: false, // Load immediately for better UX
    errorBoundary: true,
  }
);