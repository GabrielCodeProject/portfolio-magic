'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { usePerformanceMonitor } from '@/hooks/usePerformanceMonitor';
import { LoadingSpinner } from '@/components/ui';

// Priority levels for progressive loading
export type LoadPriority = 'high' | 'medium' | 'low';

interface Lazy3DWrapperProps {
  children?: React.ReactNode;
  loadPriority?: LoadPriority;
  placeholder?: React.ReactNode;
  loadingText?: string;
  className?: string;
  enabled?: boolean;
  // Intersection observer options
  threshold?: number;
  rootMargin?: string;
  // Performance options
  delayMs?: number; // Additional delay before loading
  preload?: boolean; // Whether to preload when near viewport
}

/**
 * Wrapper component for lazy loading 3D elements based on viewport visibility
 * Provides progressive loading with different priority levels and intersection-based loading
 */
export default function Lazy3DWrapper({
  children,
  loadPriority = 'medium',
  placeholder,
  loadingText = 'Loading 3D elements...',
  className = '',
  enabled = true,
  threshold = 0.1,
  rootMargin = '100px', // Start loading before element enters viewport
  delayMs = 0,
  preload = false,
}: Lazy3DWrapperProps) {
  // State management for loading phases
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  
  // Performance monitoring for development
  const { startMeasurement, endMeasurement } = usePerformanceMonitor({
    componentName: loadingText || `${loadPriority}-priority-3d-component`,
    priority: loadPriority,
    enabled: process.env.NODE_ENV === 'development',
  });
  
  // Handle mounting for SSR compatibility
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Priority-based loading with optimized timing for better UX
  useEffect(() => {
    if (!enabled || !isMounted) return;

    const priorityDelays = {
      high: 50,    // Load almost immediately for critical elements
      medium: 150, // Small delay for smoother loading sequence
      low: 400,    // Longer delay for less critical elements
    };

    const totalDelay = priorityDelays[loadPriority] + delayMs;
    
    // Start loading process
    setIsLoading(true);
    startMeasurement();
    
    const timer = setTimeout(() => {
      setShouldLoad(true);
      // Keep loading state for a smooth transition
      setTimeout(() => {
        setIsLoading(false);
        endMeasurement();
      }, 200);
    }, totalDelay);
    
    return () => {
      clearTimeout(timer);
      setIsLoading(false);
    };
  }, [loadPriority, delayMs, enabled, isMounted, startMeasurement, endMeasurement]);

  if (!enabled) {
    return <group>{children}</group>;
  }

  // Don't render anything during SSR to prevent hydration mismatches
  if (!isMounted) {
    return <group />;
  }

  // Show loading placeholder while loading
  if (isLoading && !shouldLoad) {
    return (
      <group>
        {/* Minimal 3D loading indicator - a simple pulsing sphere */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial 
            color="#8B5CF6" 
            transparent 
            opacity={0.6}
          />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      {shouldLoad ? (
        <Suspense 
          fallback={
            <group>
              {/* Loading placeholder visible during component loading */}
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.05, 6, 6]} />
                <meshBasicMaterial 
                  color="#10B981" 
                  transparent 
                  opacity={0.4}
                />
              </mesh>
            </group>
          }
        >
          {children}
        </Suspense>
      ) : null}
    </group>
  );
}

// Higher-order component for creating lazy-loaded 3D components
export function withLazy3D(
  Component: React.ComponentType<any>,
  options: Omit<Lazy3DWrapperProps, 'children'> = {}
) {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const LazyComponent = (props: any) => (
    <Lazy3DWrapper {...options}>
      <Component {...props} />
    </Lazy3DWrapper>
  );

  LazyComponent.displayName = `withLazy3D(${displayName})`;
  
  return LazyComponent;
}

// Utility function to create dynamically imported lazy 3D components
export function createLazy3DComponent(
  importFn: () => Promise<{ default: React.ComponentType<any> }>,
  wrapperOptions: Omit<Lazy3DWrapperProps, 'children'> = {}
) {
  const DynamicComponent = dynamic(importFn, {
    ssr: false,
    loading: () => null, // Avoid HTML elements in Canvas context
  });

  return withLazy3D(DynamicComponent, wrapperOptions);
}