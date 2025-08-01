'use client';

import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';

// Canvas component states
export type CanvasComponentState = 'loading' | 'loaded' | 'error' | 'disabled';

export interface ComponentStateInfo {
  id: string;
  name: string;
  state: CanvasComponentState;
  loadProgress?: number; // 0-100
  errorMessage?: string;
  priority?: 'low' | 'medium' | 'high';
  lastUpdated: number;
}

interface CanvasStateContextValue {
  // Component state management
  registerComponent: (id: string, name: string, priority?: 'low' | 'medium' | 'high') => void;
  updateComponentState: (id: string, state: CanvasComponentState, progress?: number, error?: string) => void;
  getComponentState: (id: string) => ComponentStateInfo | undefined;
  getAllComponents: () => ComponentStateInfo[];
  
  // Global Canvas state
  globalState: 'initializing' | 'loading' | 'ready' | 'error';
  overallProgress: number; // 0-100
  
  // Fallback coordination
  shouldShowFallbacks: boolean;
  fallbackReason?: 'loading' | 'error' | 'performance' | 'disabled';
  
  // Performance metrics
  renderTime?: number;
  frameRate?: number;
  memoryUsage?: number;
}

const CanvasStateContext = createContext<CanvasStateContextValue | null>(null);

/**
 * Coordinates state between Canvas components and DOM fallbacks
 * Provides centralized state management for 3D component loading states
 */
export function CanvasStateProvider({ children }: { children: React.ReactNode }) {
  const [components, setComponents] = useState<Map<string, ComponentStateInfo>>(new Map());
  const [globalState, setGlobalState] = useState<'initializing' | 'loading' | 'ready' | 'error'>('initializing');
  const [performanceMetrics, setPerformanceMetrics] = useState<{
    renderTime?: number;
    frameRate?: number;
    memoryUsage?: number;
  }>({});
  
  const frameCountRef = useRef(0);
  const lastFrameTimeRef = useRef(performance.now());

  const registerComponent = useCallback((id: string, name: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    setComponents(prev => {
      const newComponents = new Map(prev);
      newComponents.set(id, {
        id,
        name,
        state: 'loading',
        priority,
        lastUpdated: Date.now(),
      });
      return newComponents;
    });
  }, []);

  const updateComponentState = useCallback((
    id: string, 
    state: CanvasComponentState, 
    progress?: number, 
    error?: string
  ) => {
    setComponents(prev => {
      const newComponents = new Map(prev);
      const existing = newComponents.get(id);
      
      if (existing) {
        newComponents.set(id, {
          ...existing,
          state,
          loadProgress: progress,
          errorMessage: error,
          lastUpdated: Date.now(),
        });
      }
      
      return newComponents;
    });
  }, []);

  const getComponentState = useCallback((id: string) => {
    return components.get(id);
  }, [components]);

  const getAllComponents = useCallback(() => {
    return Array.from(components.values());
  }, [components]);

  // Calculate global state based on component states
  const overallProgress = React.useMemo(() => {
    const componentArray = Array.from(components.values());
    if (componentArray.length === 0) return 0;
    
    const totalProgress = componentArray.reduce((sum, comp) => {
      if (comp.state === 'loaded') return sum + 100;
      if (comp.state === 'loading') return sum + (comp.loadProgress || 0);
      if (comp.state === 'error' || comp.state === 'disabled') return sum + 0;
      return sum;
    }, 0);
    
    return Math.round(totalProgress / componentArray.length);
  }, [components]);

  // Update global state based on component states
  useEffect(() => {
    const componentArray = Array.from(components.values());
    
    if (componentArray.length === 0) {
      setGlobalState('initializing');
      return;
    }
    
    const hasErrors = componentArray.some(comp => comp.state === 'error');
    const allLoaded = componentArray.every(comp => comp.state === 'loaded' || comp.state === 'disabled');
    const hasLoading = componentArray.some(comp => comp.state === 'loading');
    
    if (hasErrors && !allLoaded) {
      setGlobalState('error');
    } else if (allLoaded) {
      setGlobalState('ready');
    } else if (hasLoading) {
      setGlobalState('loading');
    } else {
      setGlobalState('initializing');
    }
  }, [components]);

  // Determine if fallbacks should be shown
  const shouldShowFallbacks = React.useMemo(() => {
    return globalState === 'loading' || globalState === 'error' || globalState === 'initializing';
  }, [globalState]);

  const fallbackReason = React.useMemo((): 'loading' | 'error' | 'performance' | 'disabled' | undefined => {
    if (globalState === 'error') return 'error';
    if (globalState === 'loading' || globalState === 'initializing') return 'loading';
    
    const componentArray = Array.from(components.values());
    const hasDisabled = componentArray.some(comp => comp.state === 'disabled');
    if (hasDisabled) return 'performance';
    
    return undefined;
  }, [globalState, components]);

  // Performance monitoring
  useEffect(() => {
    let animationId: number;
    
    const measurePerformance = () => {
      const now = performance.now();
      frameCountRef.current++;
      
      // Calculate FPS every second
      if (now - lastFrameTimeRef.current >= 1000) {
        const fps = Math.round((frameCountRef.current * 1000) / (now - lastFrameTimeRef.current));
        
        setPerformanceMetrics(prev => ({
          ...prev,
          frameRate: fps,
          renderTime: now - lastFrameTimeRef.current,
        }));
        
        frameCountRef.current = 0;
        lastFrameTimeRef.current = now;
      }
      
      animationId = requestAnimationFrame(measurePerformance);
    };
    
    if (globalState === 'ready') {
      animationId = requestAnimationFrame(measurePerformance);
    }
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [globalState]);

  const contextValue: CanvasStateContextValue = {
    registerComponent,
    updateComponentState,
    getComponentState,
    getAllComponents,
    globalState,
    overallProgress,
    shouldShowFallbacks,
    fallbackReason,
    renderTime: performanceMetrics.renderTime,
    frameRate: performanceMetrics.frameRate,
    memoryUsage: performanceMetrics.memoryUsage,
  };

  return (
    <CanvasStateContext.Provider value={contextValue}>
      {children}
    </CanvasStateContext.Provider>
  );
}

/**
 * Hook to access Canvas state coordination functionality
 */
export function useCanvasStateCoordinator() {
  const context = useContext(CanvasStateContext);
  if (!context) {
    throw new Error('useCanvasStateCoordinator must be used within a CanvasStateProvider');
  }
  return context;
}

/**
 * Hook for components to register and manage their state
 */
export function useCanvasComponentState(
  id: string, 
  name: string, 
  priority: 'low' | 'medium' | 'high' = 'medium'
) {
  const { registerComponent, updateComponentState, getComponentState } = useCanvasStateCoordinator();
  
  // Register component on mount
  useEffect(() => {
    registerComponent(id, name, priority);
  }, [id, name, priority, registerComponent]);
  
  const setState = useCallback((
    state: CanvasComponentState, 
    progress?: number, 
    error?: string
  ) => {
    updateComponentState(id, state, progress, error);
  }, [id, updateComponentState]);
  
  const currentState = getComponentState(id);
  
  return {
    state: currentState?.state || 'loading',
    progress: currentState?.loadProgress || 0,
    error: currentState?.errorMessage,
    setState,
  };
}

/**
 * Global state indicator component that can be rendered outside Canvas
 */
export function CanvasLoadingIndicator() {
  const { globalState, overallProgress, fallbackReason, frameRate } = useCanvasStateCoordinator();
  
  if (globalState === 'ready') return null;
  
  const getStateMessage = () => {
    switch (globalState) {
      case 'initializing':
        return 'Preparing 3D environment...';
      case 'loading':
        return 'Loading magical elements...';
      case 'error':
        return 'Some 3D effects are unavailable';
      default:
        return 'Loading...';
    }
  };
  
  const getStateIcon = () => {
    switch (globalState) {
      case 'initializing':
        return '⚡';
      case 'loading':
        return '✨';
      case 'error':
        return '⚠️';
      default:
        return '⏳';
    }
  };
  
  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      <div className="glass p-3 rounded-lg flex items-center space-x-3 pointer-events-auto">
        <div className="text-lg animate-pulse">
          {getStateIcon()}
        </div>
        <div className="flex flex-col">
          <p className="text-sm text-theme-text-primary">
            {getStateMessage()}
          </p>
          {globalState === 'loading' && (
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-20 h-1 bg-theme-bg-tertiary rounded-full overflow-hidden">
                <div 
                  className="h-full bg-theme-accent transition-all duration-300"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>
              <span className="text-xs text-theme-text-muted">
                {overallProgress}%
              </span>
            </div>
          )}
          {process.env.NODE_ENV === 'development' && frameRate && (
            <p className="text-xs text-theme-text-muted mt-1">
              {frameRate} FPS
            </p>
          )}
        </div>
      </div>
    </div>
  );
}