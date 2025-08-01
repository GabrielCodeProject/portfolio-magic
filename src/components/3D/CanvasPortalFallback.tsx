'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

// Portal fallback state management
interface FallbackState {
  id: string;
  component: React.ReactNode;
  visible: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface CanvasPortalContextValue {
  showFallback: (id: string, component: React.ReactNode, priority?: 'low' | 'medium' | 'high') => void;
  hideFallback: (id: string) => void;
  clearAllFallbacks: () => void;
}

const CanvasPortalContext = createContext<CanvasPortalContextValue | null>(null);

/**
 * Provider that manages fallback states and renders them outside Canvas context
 * This solves the R3F namespace issue by using React Portals
 */
export function CanvasPortalProvider({ children }: { children: React.ReactNode }) {
  const [fallbacks, setFallbacks] = useState<Map<string, FallbackState>>(new Map());
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  // Create portal container on mount
  useEffect(() => {
    const container = document.createElement('div');
    container.id = 'canvas-fallback-portal';
    container.className = 'fixed inset-0 pointer-events-none z-40';
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (document.body.contains(container)) {
        document.body.removeChild(container);
      }
    };
  }, []);

  const showFallback = useCallback((id: string, component: React.ReactNode, priority: 'low' | 'medium' | 'high' = 'medium') => {
    setFallbacks(prev => {
      const newFallbacks = new Map(prev);
      newFallbacks.set(id, {
        id,
        component,
        visible: true,
        priority,
      });
      return newFallbacks;
    });
  }, []);

  const hideFallback = useCallback((id: string) => {
    setFallbacks(prev => {
      const newFallbacks = new Map(prev);
      const fallback = newFallbacks.get(id);
      if (fallback) {
        newFallbacks.set(id, { ...fallback, visible: false });
      }
      return newFallbacks;
    });

    // Remove after animation
    setTimeout(() => {
      setFallbacks(prev => {
        const newFallbacks = new Map(prev);
        newFallbacks.delete(id);
        return newFallbacks;
      });
    }, 300);
  }, []);

  const clearAllFallbacks = useCallback(() => {
    setFallbacks(new Map());
  }, []);

  const contextValue: CanvasPortalContextValue = {
    showFallback,
    hideFallback,
    clearAllFallbacks,
  };

  // Sort fallbacks by priority (high priority renders on top)
  const sortedFallbacks = Array.from(fallbacks.values()).sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <CanvasPortalContext.Provider value={contextValue}>
      {children}
      {portalContainer && sortedFallbacks.map(fallback => 
        fallback.visible && createPortal(
          <div
            key={fallback.id}
            className={`transition-opacity duration-300 ${
              fallback.visible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ zIndex: 40 + sortedFallbacks.indexOf(fallback) }}
          >
            {fallback.component}
          </div>,
          portalContainer
        )
      )}
    </CanvasPortalContext.Provider>
  );
}

/**
 * Hook to access portal fallback functionality from inside Canvas components
 */
export function useCanvasPortalFallback() {
  const context = useContext(CanvasPortalContext);
  if (!context) {
    throw new Error('useCanvasPortalFallback must be used within a CanvasPortalProvider');
  }
  return context;
}

/**
 * Component that can be used inside Canvas context to trigger HTML fallbacks outside
 */
interface CanvasPortalFallbackProps {
  id: string;
  fallbackComponent: React.ReactNode;
  priority?: 'low' | 'medium' | 'high';
  visible: boolean;
  children?: React.ReactNode;
}

export function CanvasPortalFallback({
  id,
  fallbackComponent,
  priority = 'medium',
  visible,
  children,
}: CanvasPortalFallbackProps) {
  const { showFallback, hideFallback } = useCanvasPortalFallback();

  useEffect(() => {
    if (visible) {
      showFallback(id, fallbackComponent, priority);
    } else {
      hideFallback(id);
    }

    return () => {
      hideFallback(id);
    };
  }, [id, fallbackComponent, priority, visible, showFallback, hideFallback]);

  // Return null for Canvas context (no HTML elements)
  return <>{children}</>;
}