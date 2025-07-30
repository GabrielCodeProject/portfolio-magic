'use client';

import dynamic from 'next/dynamic';
import { Suspense, useState, useEffect } from 'react';

import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
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
 * Provides progressive loading with different priority levels
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
  const [shouldLoad, setShouldLoad] = useState(true); // Always load in Canvas context
  
  // For Canvas context, we can't use intersection observer
  // So we'll use a simple delay-based loading
  useEffect(() => {
    if (!enabled) return;

    const priorityDelays = {
      high: 0,
      medium: 100,
      low: 300,
    };

    const totalDelay = priorityDelays[loadPriority] + delayMs;
    
    if (totalDelay > 0) {
      setShouldLoad(false);
      const timer = setTimeout(() => {
        setShouldLoad(true);
      }, totalDelay);
      
      return () => clearTimeout(timer);
    }
  }, [loadPriority, delayMs, enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <group>
      {shouldLoad ? (
        <Suspense fallback={null}>
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