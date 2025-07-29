'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePerformanceMetricsStorage } from '@/utils/performanceMetricsStorage';

// FPS monitoring configuration
interface RAFFpsMonitorConfig {
  enabled: boolean;
  sustainedCheckDuration: number; // milliseconds (default 5000 = 5 seconds)
  fpsThreshold: number; // default 30 FPS
  samplingInterval: number; // how often to check FPS (milliseconds)
  onSustainedLowFps?: (averageFps: number, duration: number) => void;
  onFpsRecovered?: (averageFps: number) => void;
  debugMode?: boolean;
  enableMetricsStorage?: boolean;
}

// FPS monitoring state
interface FpsMonitorState {
  currentFps: number;
  averageFps: number;
  isLowFps: boolean;
  sustainedLowFpsStart: number | null;
  frameCount: number;
  lastTimestamp: number;
  fpsHistory: number[];
}

// Default configuration
const DEFAULT_CONFIG: RAFFpsMonitorConfig = {
  enabled: true,
  sustainedCheckDuration: 5000, // 5 seconds as specified in task
  fpsThreshold: 30, // 30 FPS as specified in task
  samplingInterval: 1000, // Check every second
  debugMode: false,
  enableMetricsStorage: true, // Enable metrics storage by default in development
};

/**
 * Hook for RAF-based FPS monitoring with 30 FPS threshold and 5-second sustained check
 * Specifically implements the requirements from Task 1.7
 */
export function useRAFFpsMonitor(config: Partial<RAFFpsMonitorConfig> = {}) {
  const monitorConfig = { ...DEFAULT_CONFIG, ...config };
  
  // Initialize metrics storage
  const metricsStorage = usePerformanceMetricsStorage(monitorConfig.enableMetricsStorage);
  
  const [state, setState] = useState<FpsMonitorState>({
    currentFps: 60,
    averageFps: 60,
    isLowFps: false,
    sustainedLowFpsStart: null,
    frameCount: 0,
    lastTimestamp: 0,
    fpsHistory: [],
  });

  // Refs for RAF loop
  const rafId = useRef<number | undefined>(undefined);
  const startTime = useRef<number>(0);
  const frameCountRef = useRef<number>(0);
  const lastSampleTime = useRef<number>(0);
  const fpsHistoryRef = useRef<number[]>([]);
  const sustainedLowFpsStartRef = useRef<number | null>(null);

  // RAF-based frame measurement
  const measureFrame = useCallback((timestamp: number) => {
    if (!monitorConfig.enabled) return;

    // Initialize on first frame
    if (startTime.current === 0) {
      startTime.current = timestamp;
      lastSampleTime.current = timestamp;
      frameCountRef.current = 0;
    }

    frameCountRef.current++;

    // Calculate FPS every sampling interval
    const timeSinceLastSample = timestamp - lastSampleTime.current;
    if (timeSinceLastSample >= monitorConfig.samplingInterval) {
      const fps = (frameCountRef.current * 1000) / timeSinceLastSample;
      
      // Update FPS history (keep last 10 samples for 10-second window)
      fpsHistoryRef.current.push(fps);
      if (fpsHistoryRef.current.length > 10) {
        fpsHistoryRef.current.shift();
      }

      // Calculate average FPS over history
      const averageFps = fpsHistoryRef.current.reduce((sum, f) => sum + f, 0) / fpsHistoryRef.current.length;
      
      // Check if FPS is below threshold
      const isCurrentlyLowFps = fps < monitorConfig.fpsThreshold;
      
      // Handle sustained low FPS detection
      const currentTime = Date.now();
      
      if (isCurrentlyLowFps) {
        // Start tracking sustained low FPS
        if (sustainedLowFpsStartRef.current === null) {
          sustainedLowFpsStartRef.current = currentTime;
          
          if (monitorConfig.debugMode) {
            console.log(`[RAFFpsMonitor] Low FPS detected: ${fps.toFixed(1)} (threshold: ${monitorConfig.fpsThreshold})`);
          }
        } else {
          // Check if sustained period has elapsed
          const sustainedDuration = currentTime - sustainedLowFpsStartRef.current;
          if (sustainedDuration >= monitorConfig.sustainedCheckDuration) {
            // Trigger sustained low FPS callback
            if (!state.isLowFps) {
              monitorConfig.onSustainedLowFps?.(averageFps, sustainedDuration);
              
              if (monitorConfig.debugMode) {
                console.warn(`[RAFFpsMonitor] Sustained low FPS triggered after ${sustainedDuration}ms, average: ${averageFps.toFixed(1)}`);
              }
            }
          }
        }
      } else {
        // FPS recovered
        if (sustainedLowFpsStartRef.current !== null) {
          sustainedLowFpsStartRef.current = null;
          
          if (state.isLowFps) {
            monitorConfig.onFpsRecovered?.(averageFps);
            
            if (monitorConfig.debugMode) {
              console.log(`[RAFFpsMonitor] FPS recovered: ${fps.toFixed(1)}, average: ${averageFps.toFixed(1)}`);
            }
          }
        }
      }

      // Determine if we're in low FPS state
      const isInLowFpsState = sustainedLowFpsStartRef.current !== null && 
                             (currentTime - sustainedLowFpsStartRef.current) >= monitorConfig.sustainedCheckDuration;

      // Log FPS metrics to storage
      if (metricsStorage.isEnabled) {
        metricsStorage.logFpsMetric({
          componentType: 'general', // Will be overridden in enhanced monitor
          currentFps: fps,
          averageFps,
          threshold: monitorConfig.fpsThreshold,
          isLowFps: isInLowFpsState,
          performanceLevel: averageFps >= 50 ? 'excellent' : 
                           averageFps >= 40 ? 'good' : 
                           averageFps >= 30 ? 'fair' : 'poor',
          timeSinceStart: sustainedLowFpsStartRef.current ? currentTime - sustainedLowFpsStartRef.current : 0,
          fpsHistory: [...fpsHistoryRef.current],
        });
      }

      // Update state
      setState(prev => ({
        ...prev,
        currentFps: fps,
        averageFps,
        isLowFps: isInLowFpsState,
        sustainedLowFpsStart: sustainedLowFpsStartRef.current,
        frameCount: frameCountRef.current,
        lastTimestamp: timestamp,
        fpsHistory: [...fpsHistoryRef.current],
      }));

      // Reset counters for next sample
      frameCountRef.current = 0;
      lastSampleTime.current = timestamp;
    }

    // Continue RAF loop
    if (monitorConfig.enabled) {
      rafId.current = requestAnimationFrame(measureFrame);
    }
  }, [
    monitorConfig.enabled,
    monitorConfig.fpsThreshold,
    monitorConfig.samplingInterval,
    monitorConfig.sustainedCheckDuration,
    monitorConfig.onSustainedLowFps,
    monitorConfig.onFpsRecovered,
    monitorConfig.debugMode,
    state.isLowFps
  ]);

  // Start monitoring
  const startMonitoring = useCallback(() => {
    if (!monitorConfig.enabled || typeof window === 'undefined') return;

    // Reset state
    startTime.current = 0;
    frameCountRef.current = 0;
    lastSampleTime.current = 0;
    fpsHistoryRef.current = [];
    sustainedLowFpsStartRef.current = null;

    setState({
      currentFps: 60,
      averageFps: 60,
      isLowFps: false,
      sustainedLowFpsStart: null,
      frameCount: 0,
      lastTimestamp: 0,
      fpsHistory: [],
    });

    // Start RAF loop
    rafId.current = requestAnimationFrame(measureFrame);

    if (monitorConfig.debugMode) {
      console.log('[RAFFpsMonitor] Started monitoring with config:', {
        fpsThreshold: monitorConfig.fpsThreshold,
        sustainedCheckDuration: monitorConfig.sustainedCheckDuration,
        samplingInterval: monitorConfig.samplingInterval,
      });
    }
  }, [monitorConfig, measureFrame]);

  // Stop monitoring
  const stopMonitoring = useCallback(() => {
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = undefined;
    }

    if (monitorConfig.debugMode) {
      console.log('[RAFFpsMonitor] Stopped monitoring');
    }
  }, [monitorConfig.debugMode]);

  // Auto-start/stop based on enabled flag
  useEffect(() => {
    if (monitorConfig.enabled) {
      startMonitoring();
    } else {
      stopMonitoring();
    }

    return () => {
      stopMonitoring();
    };
  }, [monitorConfig.enabled, startMonitoring, stopMonitoring]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  return {
    // Current metrics
    currentFps: state.currentFps,
    averageFps: state.averageFps,
    isLowFps: state.isLowFps,
    fpsHistory: state.fpsHistory,

    // Status
    isMonitoring: rafId.current !== undefined,
    sustainedLowFpsStart: state.sustainedLowFpsStart,
    
    // Control functions
    startMonitoring,
    stopMonitoring,

    // Configuration
    config: monitorConfig,
    threshold: monitorConfig.fpsThreshold,

    // Utility functions
    isBelowThreshold: state.currentFps < monitorConfig.fpsThreshold,
    timeSinceStart: state.sustainedLowFpsStart ? Date.now() - state.sustainedLowFpsStart : 0,
    
    // Performance insights
    performanceLevel: state.averageFps >= 50 ? 'excellent' : 
                     state.averageFps >= 40 ? 'good' : 
                     state.averageFps >= 30 ? 'fair' : 'poor',
  };
}

/**
 * Enhanced hook that combines RAF FPS monitoring with component-specific thresholds
 */
export function useEnhancedFpsMonitor(
  componentType: 'candles' | 'portraits' | 'snitch' | 'general' = 'general',
  onPerformanceDegradation?: () => void,
  onPerformanceRecovered?: () => void
) {
  // Initialize metrics storage for this component
  const metricsStorage = usePerformanceMetricsStorage(true);

  // Get component-specific thresholds
  const getComponentThreshold = (type: typeof componentType): number => {
    switch (type) {
      case 'candles': return 25; // Candles can run at lower FPS
      case 'portraits': return 30; // Portraits need 30 FPS minimum
      case 'snitch': return 35; // Snitch needs higher FPS for smooth animation
      default: return 30; // General 30 FPS threshold as specified
    }
  };

  const threshold = getComponentThreshold(componentType);

  const monitor = useRAFFpsMonitor({
    enabled: true,
    fpsThreshold: threshold,
    sustainedCheckDuration: 5000, // 5 seconds as specified in task
    samplingInterval: 1000,
    debugMode: process.env.NODE_ENV === 'development',
    enableMetricsStorage: true,
    onSustainedLowFps: (avgFps, duration) => {
      console.warn(`[${componentType}] Performance degraded: ${avgFps.toFixed(1)} FPS for ${duration}ms`);
      
      // Log degradation event
      if (metricsStorage.isEnabled) {
        metricsStorage.logEventMetric({
          eventType: 'degradation',
          componentType,
          details: {
            averageFps: avgFps,
            threshold,
            duration,
            timestamp: Date.now(),
          },
          severity: avgFps < 20 ? 'high' : avgFps < 25 ? 'medium' : 'low',
        });
      }
      
      onPerformanceDegradation?.();
    },
    onFpsRecovered: (avgFps) => {
      console.log(`[${componentType}] Performance recovered: ${avgFps.toFixed(1)} FPS`);
      
      // Log recovery event
      if (metricsStorage.isEnabled) {
        metricsStorage.logEventMetric({
          eventType: 'recovery',
          componentType,
          details: {
            averageFps: avgFps,
            threshold,
            timestamp: Date.now(),
          },
          severity: 'low',
        });
      }
      
      onPerformanceRecovered?.();
    },
  });

  // Override the general component type in FPS metrics with the specific component type
  useEffect(() => {
    // This is a bit of a hack, but we need to update the logged metrics to have the correct component type
    // The base monitor logs 'general', but we want the specific component type
    if (metricsStorage.isEnabled && monitor.isMonitoring) {
      const intervalId = setInterval(() => {
        metricsStorage.logFpsMetric({
          componentType,
          currentFps: monitor.currentFps,
          averageFps: monitor.averageFps,
          threshold: monitor.threshold,
          isLowFps: monitor.isLowFps,
          performanceLevel: monitor.performanceLevel,
          timeSinceStart: monitor.timeSinceStart,
          fpsHistory: monitor.fpsHistory,
        });
      }, 5000); // Log every 5 seconds

      return () => clearInterval(intervalId);
    }
  }, [metricsStorage.isEnabled, monitor, componentType]);

  return {
    ...monitor,
    componentType,
    threshold,
    shouldUseFallback: monitor.isLowFps,
  };
}

export default useRAFFpsMonitor;