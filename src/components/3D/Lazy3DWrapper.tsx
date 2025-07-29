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
  const [shouldLoad, setShouldLoad] = useState(!enabled);
  const [isLoading, setIsLoading] = useState(false);
  const [loadStarted, setLoadStarted] = useState(false);

  const { ref, isIntersecting, hasIntersected } = useIntersectionObserver({
    threshold,
    rootMargin,
    triggerOnce: true,
    enabled,
  });

  // Priority-based loading delays
  const priorityDelays = {
    high: 0,
    medium: 100,
    low: 300,
  };

  const totalDelay = priorityDelays[loadPriority] + delayMs;

  useEffect(() => {
    if (!enabled) return;

    if (preload || hasIntersected || isIntersecting) {
      if (!loadStarted) {
        setLoadStarted(true);
        setIsLoading(true);

        const timer = setTimeout(() => {
          setShouldLoad(true);
          // Loading state will be handled by Suspense
        }, totalDelay);

        return () => clearTimeout(timer);
      }
    }
  }, [preload, hasIntersected, isIntersecting, totalDelay, loadStarted, enabled]);

  // Default placeholder
  const defaultPlaceholder = (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="glass p-4 rounded-lg">
        <p className="text-sm text-theme-text-muted">
          3D content will load when visible
        </p>
      </div>
    </div>
  );

  // Loading placeholder
  const loadingPlaceholder = (
    <div className="flex items-center justify-center min-h-[200px]">
      <LoadingSpinner 
        size="lg" 
        variant="magical" 
        text={loadingText}
      />
    </div>
  );

  if (!enabled) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div ref={ref} className={className}>
      {shouldLoad ? (
        <Suspense fallback={loadingPlaceholder}>
          {children}
        </Suspense>
      ) : isLoading ? (
        loadingPlaceholder
      ) : (
        placeholder || defaultPlaceholder
      )}
    </div>
  );
}

// Higher-order component for creating lazy-loaded 3D components
export function withLazy3D<ComponentProps extends object>(
  Component: React.ComponentType<ComponentProps>,
  options: Omit<Lazy3DWrapperProps, 'children'> = {}
) {
  const displayName = Component.displayName || Component.name || 'Component';
  
  const LazyComponent = (props: ComponentProps) => (
    <Lazy3DWrapper {...options}>
      <Component {...props} />
    </Lazy3DWrapper>
  );

  LazyComponent.displayName = `withLazy3D(${displayName})`;
  
  return LazyComponent;
}

// Utility function to create dynamically imported lazy 3D components
export function createLazy3DComponent<ComponentProps extends object>(
  importFn: () => Promise<{ default: React.ComponentType<ComponentProps> }>,
  wrapperOptions: Omit<Lazy3DWrapperProps, 'children'> = {}
) {
  const DynamicComponent = dynamic(importFn, {
    ssr: false,
    loading: () => (
      <LoadingSpinner 
        size="lg" 
        variant="magical" 
        text={wrapperOptions.loadingText || 'Loading 3D component...'}
      />
    ),
  });

  return withLazy3D(DynamicComponent, wrapperOptions);
}