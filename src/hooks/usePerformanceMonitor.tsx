'use client';

import React, { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  componentName: string;
  priority: 'high' | 'medium' | 'low';
  timestamp: number;
}

interface UsePerformanceMonitorOptions {
  componentName: string;
  priority?: 'high' | 'medium' | 'low';
  enabled?: boolean;
}

/**
 * Hook for monitoring 3D component loading performance
 * Provides insights into lazy loading effectiveness
 */
export function usePerformanceMonitor({
  componentName,
  priority = 'medium',
  enabled = process.env.NODE_ENV === 'development',
}: UsePerformanceMonitorOptions) {
  const startTimeRef = useRef<number | null>(null);
  const metricsRef = useRef<PerformanceMetrics[]>([]);

  // Start performance measurement
  const startMeasurement = useCallback(() => {
    if (!enabled) return;
    
    startTimeRef.current = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎭 [3D Lazy Loading] Started loading: ${componentName} (${priority} priority)`);
    }
  }, [componentName, priority, enabled]);

  // End performance measurement
  const endMeasurement = useCallback(() => {
    if (!enabled || !startTimeRef.current) return;
    
    const loadTime = performance.now() - startTimeRef.current;
    
    const metrics: PerformanceMetrics = {
      loadTime,
      componentName,
      priority,
      timestamp: Date.now(),
    };
    
    metricsRef.current.push(metrics);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(
        `✨ [3D Lazy Loading] Completed: ${componentName} in ${loadTime.toFixed(2)}ms (${priority} priority)`
      );
      
      // Log performance insights
      if (loadTime > 1000) {
        console.warn(`⚠️ [Performance] ${componentName} took ${loadTime.toFixed(2)}ms to load - consider optimization`);
      } else if (loadTime < 100) {
        console.log(`🚀 [Performance] ${componentName} loaded quickly (${loadTime.toFixed(2)}ms)`);
      }
    }
    
    startTimeRef.current = null;
  }, [componentName, priority, enabled]);

  // Get all performance metrics
  const getMetrics = useCallback(() => {
    return [...metricsRef.current];
  }, []);

  // Get average load time by priority
  const getAverageLoadTime = useCallback((filterPriority?: 'high' | 'medium' | 'low') => {
    const filteredMetrics = filterPriority 
      ? metricsRef.current.filter(m => m.priority === filterPriority)
      : metricsRef.current;
    
    if (filteredMetrics.length === 0) return 0;
    
    const totalTime = filteredMetrics.reduce((sum, metric) => sum + metric.loadTime, 0);
    return totalTime / filteredMetrics.length;
  }, []);

  // Log performance summary on unmount (development only)
  useEffect(() => {
    if (!enabled) return;

    return () => {
      if (process.env.NODE_ENV === 'development' && metricsRef.current.length > 0) {
        const avgHigh = getAverageLoadTime('high');
        const avgMedium = getAverageLoadTime('medium');
        const avgLow = getAverageLoadTime('low');
        
        console.group('📊 [3D Lazy Loading Performance Summary]');
        console.log(`High Priority Average: ${avgHigh.toFixed(2)}ms`);
        console.log(`Medium Priority Average: ${avgMedium.toFixed(2)}ms`);
        console.log(`Low Priority Average: ${avgLow.toFixed(2)}ms`);
        console.log(`Total Components Loaded: ${metricsRef.current.length}`);
        console.groupEnd();
      }
    };
  }, [enabled, getAverageLoadTime]);

  return {
    startMeasurement,
    endMeasurement,
    getMetrics,
    getAverageLoadTime,
  };
}

/**
 * Higher-order component to automatically monitor performance
 */
export function withPerformanceMonitoring<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  options: UsePerformanceMonitorOptions
): React.ComponentType<T> {
  const WrappedComponent: React.ComponentType<T> = (props: T) => {
    const { startMeasurement, endMeasurement } = usePerformanceMonitor(options);
    
    useEffect(() => {
      startMeasurement();
      return endMeasurement;
    }, [startMeasurement, endMeasurement]);
    
    return <Component {...props} />;
  };
  
  WrappedComponent.displayName = `withPerformanceMonitoring(${options.componentName})`;
  
  return WrappedComponent;
}