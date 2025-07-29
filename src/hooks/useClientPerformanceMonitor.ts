'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// Performance metrics interface
interface PerformanceMetrics {
  fps: number;
  frameTime: number;
  memoryUsage?: number;
  drawCalls?: number;
  triangles?: number;
  isStable: boolean;
  performanceLevel: 'excellent' | 'good' | 'fair' | 'poor';
  recommendedAction: 'none' | 'reduce_quality' | 'disable_effects' | 'fallback_mode';
}

// Performance history for trend analysis
interface PerformanceHistory {
  fps: number[];
  frameTime: number[];
  timestamp: number[];
}

// Configuration for performance monitoring
interface PerformanceMonitorConfig {
  enabled: boolean;
  sampleInterval: number; // milliseconds
  historySize: number; // number of samples to keep
  fpsThresholds: {
    excellent: number;
    good: number;
    fair: number;
  };
  stabilityWindow: number; // frames to consider for stability
  autoOptimize: boolean;
}

// Default configuration with 30 FPS as key threshold
const DEFAULT_CONFIG: PerformanceMonitorConfig = {
  enabled: true,
  sampleInterval: 100, // 10 FPS sampling rate
  historySize: 100, // Keep last 100 samples (10 seconds)
  fpsThresholds: {
    excellent: 55, // Above 55 FPS
    good: 40,      // 40-55 FPS
    fair: 30,      // 30-40 FPS (30 FPS is the critical threshold)
    // Below 30 FPS is poor - triggers fallback mode
  },
  stabilityWindow: 30, // Consider last 30 frames for stability
  autoOptimize: false, // Don't auto-optimize by default
};

/**
 * Hook for monitoring real-time performance of 3D components
 * Provides FPS, frame time, and memory usage metrics with trend analysis
 */
export function useClientPerformanceMonitor(config: Partial<PerformanceMonitorConfig> = {}) {
  const monitorConfig = { ...DEFAULT_CONFIG, ...config };
  
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 60,
    frameTime: 16.67,
    isStable: true,
    performanceLevel: 'excellent',
    recommendedAction: 'none',
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const [history, setHistory] = useState<PerformanceHistory>({
    fps: [],
    frameTime: [],
    timestamp: [],
  });

  // Refs for performance tracking
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const fpsHistory = useRef<number[]>([]);
  const frameTimeHistory = useRef<number[]>([]);
  const animationFrameId = useRef<number | undefined>(undefined);
  const sampleIntervalId = useRef<number | undefined>(undefined);

  // Frame measurement function
  const measureFrame = useCallback(() => {
    if (!monitorConfig.enabled) return;

    const now = performance.now();
    const deltaTime = now - lastTime.current;
    
    frameCount.current++;
    frameTimeHistory.current.push(deltaTime);
    
    // Keep only recent frame times
    if (frameTimeHistory.current.length > monitorConfig.stabilityWindow) {
      frameTimeHistory.current.shift();
    }

    lastTime.current = now;
    
    // Continue measuring
    if (isMonitoring) {
      animationFrameId.current = requestAnimationFrame(measureFrame);
    }
  }, [monitorConfig.enabled, monitorConfig.stabilityWindow, isMonitoring]);

  // Calculate performance metrics
  const calculateMetrics = useCallback((): PerformanceMetrics => {
    const frameHistory = frameTimeHistory.current;
    
    if (frameHistory.length === 0) {
      return {
        fps: 60,
        frameTime: 16.67,
        isStable: true,
        performanceLevel: 'excellent',
        recommendedAction: 'none',
      };
    }

    // Calculate average frame time and FPS
    const avgFrameTime = frameHistory.reduce((sum, time) => sum + time, 0) / frameHistory.length;
    const fps = Math.min(60, 1000 / avgFrameTime);

    // Calculate stability (coefficient of variation)
    const variance = frameHistory.reduce((sum, time) => {
      const diff = time - avgFrameTime;
      return sum + diff * diff;
    }, 0) / frameHistory.length;
    const stdDev = Math.sqrt(variance);
    const coefficientOfVariation = stdDev / avgFrameTime;
    const isStable = coefficientOfVariation < 0.2; // 20% variation threshold

    // Determine performance level
    let performanceLevel: PerformanceMetrics['performanceLevel'] = 'poor';
    if (fps >= monitorConfig.fpsThresholds.excellent) {
      performanceLevel = 'excellent';
    } else if (fps >= monitorConfig.fpsThresholds.good) {
      performanceLevel = 'good';
    } else if (fps >= monitorConfig.fpsThresholds.fair) {
      performanceLevel = 'fair';
    }

    // Determine recommended action
    let recommendedAction: PerformanceMetrics['recommendedAction'] = 'none';
    if (fps < 20 || !isStable) {
      recommendedAction = 'fallback_mode';
    } else if (fps < monitorConfig.fpsThresholds.fair) {
      recommendedAction = 'disable_effects';
    } else if (fps < monitorConfig.fpsThresholds.good) {
      recommendedAction = 'reduce_quality';
    }

    // Get memory usage if available
    let memoryUsage: number | undefined;
    if ('memory' in performance && (performance as any).memory) {
      const memory = (performance as any).memory;
      memoryUsage = memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }

    return {
      fps: Math.round(fps * 100) / 100,
      frameTime: Math.round(avgFrameTime * 100) / 100,
      memoryUsage,
      isStable,
      performanceLevel,
      recommendedAction,
    };
  }, [monitorConfig.fpsThresholds]);

  // Sample metrics at regular intervals
  const sampleMetrics = useCallback(() => {
    const newMetrics = calculateMetrics();
    setMetrics(newMetrics);
    
    // Update history
    setHistory(prev => {
      const newHistory = {
        fps: [...prev.fps, newMetrics.fps],
        frameTime: [...prev.frameTime, newMetrics.frameTime],
        timestamp: [...prev.timestamp, Date.now()],
      };
      
      // Trim history to configured size
      if (newHistory.fps.length > monitorConfig.historySize) {
        newHistory.fps.shift();
        newHistory.frameTime.shift();
        newHistory.timestamp.shift();
      }
      
      return newHistory;
    });
  }, [calculateMetrics, monitorConfig.historySize]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (typeof window === 'undefined' || !monitorConfig.enabled) return;
    
    setIsMonitoring(true);
    frameCount.current = 0;
    lastTime.current = performance.now();
    fpsHistory.current = [];
    frameTimeHistory.current = [];
    
    // Start frame measurement
    animationFrameId.current = requestAnimationFrame(measureFrame);
    
    // Start sampling
    sampleIntervalId.current = window.setInterval(sampleMetrics, monitorConfig.sampleInterval);
  }, [monitorConfig.enabled, monitorConfig.sampleInterval, measureFrame, sampleMetrics]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    
    if (sampleIntervalId.current) {
      clearInterval(sampleIntervalId.current);
    }
  }, []);

  // Reset monitoring data
  const resetMetrics = useCallback(() => {
    frameCount.current = 0;
    fpsHistory.current = [];
    frameTimeHistory.current = [];
    setHistory({
      fps: [],
      frameTime: [],
      timestamp: [],
    });
    setMetrics({
      fps: 60,
      frameTime: 16.67,
      isStable: true,
      performanceLevel: 'excellent',
      recommendedAction: 'none',
    });
  }, []);

  // Auto-start monitoring when component mounts
  useEffect(() => {
    if (monitorConfig.enabled) {
      startMonitoring();
    }
    
    return () => {
      stopMonitoring();
    };
  }, [monitorConfig.enabled, startMonitoring, stopMonitoring]);

  // Calculate performance trends
  const getPerformanceTrends = useCallback(() => {
    if (history.fps.length < 10) {
      return {
        fpsTrend: 'stable',
        avgFps: metrics.fps,
        minFps: metrics.fps,
        maxFps: metrics.fps,
        fpsVariance: 0,
      };
    }

    const recentFps = history.fps.slice(-30); // Last 30 samples
    const avgFps = recentFps.reduce((sum, fps) => sum + fps, 0) / recentFps.length;
    const minFps = Math.min(...recentFps);
    const maxFps = Math.max(...recentFps);
    
    // Calculate trend (simple linear regression slope)
    const n = recentFps.length;
    const sumX = n * (n - 1) / 2; // Sum of indices
    const sumY = recentFps.reduce((sum, fps) => sum + fps, 0);
    const sumXY = recentFps.reduce((sum, fps, i) => sum + i * fps, 0);
    const sumX2 = n * (n - 1) * (2 * n - 1) / 6; // Sum of squared indices
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    
    let fpsTrend: 'improving' | 'stable' | 'declining' = 'stable';
    if (slope > 0.5) fpsTrend = 'improving';
    else if (slope < -0.5) fpsTrend = 'declining';
    
    // Calculate variance
    const variance = recentFps.reduce((sum, fps) => {
      const diff = fps - avgFps;
      return sum + diff * diff;
    }, 0) / recentFps.length;
    
    return {
      fpsTrend,
      avgFps: Math.round(avgFps * 100) / 100,
      minFps: Math.round(minFps * 100) / 100,
      maxFps: Math.round(maxFps * 100) / 100,
      fpsVariance: Math.round(variance * 100) / 100,
    };
  }, [history.fps, metrics.fps]);

  return {
    // Current metrics
    metrics,
    history,
    isMonitoring,
    
    // Control functions
    startMonitoring,
    stopMonitoring,
    resetMetrics,
    
    // Analysis
    trends: getPerformanceTrends(),
    
    // Utility functions
    shouldReduceQuality: metrics.recommendedAction === 'reduce_quality' || metrics.recommendedAction === 'disable_effects',
    shouldUseFallback: metrics.recommendedAction === 'fallback_mode',
    isPerformanceGood: metrics.performanceLevel === 'excellent' || metrics.performanceLevel === 'good',
    
    // Configuration
    config: monitorConfig,
  };
}

/**
 * Hook for automatic performance optimization based on monitoring
 */
export function useAutoPerformanceOptimization(
  performanceMonitor: ReturnType<typeof useClientPerformanceMonitor>,
  onOptimizationChange?: (level: 'high' | 'medium' | 'low' | 'minimal') => void
) {
  const [currentOptimizationLevel, setCurrentOptimizationLevel] = useState<'high' | 'medium' | 'low' | 'minimal'>('high');
  const lastOptimizationTime = useRef(0);
  const consecutivePoorFrames = useRef(0);

  useEffect(() => {
    const { metrics } = performanceMonitor;
    const now = Date.now();
    
    // Avoid too frequent optimizations (min 2 seconds between changes)
    if (now - lastOptimizationTime.current < 2000) return;
    
    let newLevel = currentOptimizationLevel;
    
    // Track consecutive poor performance
    if (metrics.performanceLevel === 'poor' || !metrics.isStable) {
      consecutivePoorFrames.current++;
    } else {
      consecutivePoorFrames.current = 0;
    }
    
    // Optimization logic
    if (consecutivePoorFrames.current >= 5) {
      // Multiple consecutive poor frames - reduce quality
      if (currentOptimizationLevel === 'high') {
        newLevel = 'medium';
      } else if (currentOptimizationLevel === 'medium') {
        newLevel = 'low';
      } else if (currentOptimizationLevel === 'low') {
        newLevel = 'minimal';
      }
    } else if (metrics.performanceLevel === 'excellent' && metrics.isStable) {
      // Good performance - potentially increase quality
      if (currentOptimizationLevel === 'minimal') {
        newLevel = 'low';
      } else if (currentOptimizationLevel === 'low') {
        newLevel = 'medium';
      } else if (currentOptimizationLevel === 'medium') {
        newLevel = 'high';
      }
    }
    
    // Apply optimization change
    if (newLevel !== currentOptimizationLevel) {
      setCurrentOptimizationLevel(newLevel);
      lastOptimizationTime.current = now;
      onOptimizationChange?.(newLevel);
    }
  }, [performanceMonitor.metrics, currentOptimizationLevel, onOptimizationChange]);

  return {
    optimizationLevel: currentOptimizationLevel,
    setOptimizationLevel: setCurrentOptimizationLevel,
    isOptimizing: consecutivePoorFrames.current > 0,
  };
}