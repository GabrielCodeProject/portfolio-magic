'use client';

import React, { 
  useContext, 
  createContext, 
  ReactNode, 
  useEffect, 
  useState
} from 'react';
import { createPortal } from 'react-dom';

// Canvas context to track rendering environment
const CanvasContext = createContext<boolean>(false);

export const CanvasProvider = ({ children }: { children: ReactNode }) => (
  <CanvasContext.Provider value={true}>{children}</CanvasContext.Provider>
);

export const useIsInCanvas = () => useContext(CanvasContext);

// Portal container management
const PORTAL_ID = 'r3f-fallback-portal';

function getOrCreatePortalContainer(): HTMLElement {
  let container = document.getElementById(PORTAL_ID);
  if (!container) {
    container = document.createElement('div');
    container.id = PORTAL_ID;
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(container);
  }
  return container;
}

// Context-aware fallback component
interface ContextAwareFallbackProps {
  canvasFallback?: ReactNode;
  htmlFallback: ReactNode;
  children?: ReactNode;
  priority?: 'low' | 'medium' | 'high';
  className?: string;
}

export function ContextAwareFallback({ 
  canvasFallback, 
  htmlFallback, 
  children,
  priority = 'medium',
  className
}: ContextAwareFallbackProps) {
  const isInCanvas = useIsInCanvas();
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);
  
  // Initialize portal container on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPortalContainer(getOrCreatePortalContainer());
    }
  }, []);

  // If we have children, render them
  if (children) return <>{children}</>;
  
  // If we're in Canvas context
  if (isInCanvas) {
    return canvasFallback || null;
  }
  
  // If we're not in Canvas and have portal container, render HTML fallback via portal
  if (portalContainer && htmlFallback) {
    const portalContent = (
      <div 
        className={`
          fixed inset-0 flex items-center justify-center
          pointer-events-auto backdrop-blur-sm bg-black/20
          ${priority === 'high' ? 'z-[10000]' : 
            priority === 'medium' ? 'z-[9999]' : 'z-[9998]'}
          ${className || ''}
        `}
        style={{
          animation: 'fadeIn 0.3s ease-out'
        }}
      >
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        {htmlFallback}
      </div>
    );
    
    return createPortal(portalContent, portalContainer);
  }
  
  // Fallback to regular HTML rendering
  return htmlFallback;
}

// Enhanced error boundary with context awareness
interface EnhancedThreeErrorBoundaryProps {
  children: ReactNode;
  fallbackComponent?: ReactNode;
  componentName?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

class EnhancedThreeErrorBoundaryClass extends React.Component<
  EnhancedThreeErrorBoundaryProps, 
  ErrorBoundaryState
> {
  constructor(props: EnhancedThreeErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { componentName = 'Unknown3DComponent', severity = 'high', onError } = this.props;
    
    // Store error ID for debugging
    this.setState({ 
      errorId: `${componentName}_${Date.now()}` 
    });

    // Call parent error handler
    onError?.(error, errorInfo);

    // Enhanced 3D-specific error logging
    if (process.env.NODE_ENV === 'development') {
      console.group(`🎮 Enhanced 3D Component Error: ${componentName}`);
      console.error('Error Details:', error);
      console.error('Component Stack:', errorInfo.componentStack);
      console.error('Error ID:', this.state.errorId);
      console.groupEnd();
    }
  }

  render() {
    if (this.state.hasError) {
      const defaultFallback = (
        <div className="flex items-center justify-center p-8 bg-gray-900/90 rounded-lg border border-red-500/30">
          <div className="text-center">
            <div className="text-red-400 mb-2 text-2xl">⚠️</div>
            <p className="text-gray-300 text-sm font-medium mb-1">
              3D Component Error
            </p>
            <p className="text-gray-500 text-xs">
              {this.props.componentName || 'Unknown component'} failed to render
            </p>
            {process.env.NODE_ENV === 'development' && this.state.errorId && (
              <p className="text-gray-600 text-xs mt-2 font-mono">
                ID: {this.state.errorId}
              </p>
            )}
          </div>
        </div>
      );

      return (
        <ContextAwareFallback
          canvasFallback={
            // 3D-safe error visualization
            <group>
              <mesh position={[0, 0, 0]}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshBasicMaterial color="#ef4444" opacity={0.3} transparent />
              </mesh>
            </group>
          }
          htmlFallback={this.props.fallbackComponent || defaultFallback}
          priority={this.props.severity === 'critical' ? 'high' : 'medium'}
        />
      );
    }

    return this.props.children;
  }
}

export function EnhancedThreeErrorBoundary(props: EnhancedThreeErrorBoundaryProps) {
  return <EnhancedThreeErrorBoundaryClass {...props} />;
}

// Enhanced performance gate with context awareness
interface EnhancedClientPerformanceGateProps {
  children: ReactNode;
  htmlFallback?: ReactNode;
  loadingComponent?: ReactNode;
  componentType?: string;
  onPerformanceChange?: (isGoodPerformance: boolean) => void;
}

export function EnhancedClientPerformanceGate({
  children,
  htmlFallback,
  loadingComponent,
  componentType = 'general',
  onPerformanceChange
}: EnhancedClientPerformanceGateProps) {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [shouldRender3D, setShouldRender3D] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Simulate capability detection
    const timer = setTimeout(() => {
      setShouldRender3D(true);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Default fallbacks
  const defaultLoadingFallback = (
    <div className="flex items-center justify-center p-6 bg-gray-900/50 rounded-lg">
      <div className="text-center">
        <div className="animate-spin w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-gray-400 text-sm">Loading {componentType}...</p>
      </div>
    </div>
  );

  const defaultHtmlFallback = (
    <div className="flex items-center justify-center p-6 bg-gray-900/30 rounded-lg border border-gray-700/30">
      <div className="text-center">
        <div className="text-gray-400 mb-2">📱</div>
        <p className="text-gray-500 text-sm">
          3D content not available on this device
        </p>
      </div>
    </div>
  );

  if (!isClient) {
    return null; // SSR safety
  }

  if (isLoading) {
    return (
      <ContextAwareFallback
        canvasFallback={null}
        htmlFallback={loadingComponent || defaultLoadingFallback}
        priority="low"
      />
    );
  }

  if (!shouldRender3D) {
    return (
      <ContextAwareFallback
        canvasFallback={null}
        htmlFallback={htmlFallback || defaultHtmlFallback}
        priority="medium"
      />
    );
  }

  return <>{children}</>;
}

// Lazy 3D wrapper with context awareness
interface EnhancedLazy3DWrapperProps {
  children: ReactNode;
  htmlFallback?: ReactNode;
  errorFallback?: ReactNode;
  componentName?: string;
  shouldLoad?: boolean;
}

export function EnhancedLazy3DWrapper({
  children,
  htmlFallback,
  errorFallback,
  componentName = 'Lazy3DComponent',
  shouldLoad = true
}: EnhancedLazy3DWrapperProps) {
  return (
    <CanvasProvider>
      <group>
        {shouldLoad ? (
          <React.Suspense fallback={null}>
            <EnhancedThreeErrorBoundary
              fallbackComponent={errorFallback}
              componentName={componentName}
            >
              <EnhancedClientPerformanceGate
                htmlFallback={htmlFallback}
                componentType={componentName}
              >
                {children}
              </EnhancedClientPerformanceGate>
            </EnhancedThreeErrorBoundary>
          </React.Suspense>
        ) : null}
      </group>
    </CanvasProvider>
  );
}

export default ContextAwareFallback;