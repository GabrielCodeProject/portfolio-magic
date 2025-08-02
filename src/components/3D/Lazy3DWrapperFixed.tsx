'use client';

import React, { Suspense, lazy } from 'react';
import { useLODConfig, shouldRenderComponent } from '@/hooks/useDevicePerformance';

// Types for lazy loading configuration
type LoadPriority = 'high' | 'medium' | 'low';
type ComponentType = 'floatingCandles' | 'movingPortraits' | 'goldenSnitch' | 'other';

interface Lazy3DConfig {
  loadPriority: LoadPriority;
  componentType: ComponentType;
  errorBoundary?: boolean;
}

const defaultConfig: Lazy3DConfig = {
  loadPriority: 'medium',
  componentType: 'other',
  errorBoundary: true,
};

// Simple 3D loading indicator using Three.js primitives
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

// Error boundary that returns Three.js primitives instead of HTML
class Lazy3DErrorBoundary extends React.Component<
  { children: React.ReactNode; componentType: ComponentType },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn(`3D Component Error (${this.props.componentType}):`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Return a simple 3D object as fallback instead of HTML
      return (
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshBasicMaterial color="#ff0000" transparent opacity={0.3} />
        </mesh>
      );
    }

    return this.props.children;
  }
}

// Main wrapper component - NO HTML elements, only Three.js objects
interface Lazy3DWrapperProps {
  children: React.ReactNode;
  config?: Partial<Lazy3DConfig>;
}

function Lazy3DWrapper({ children, config = {} }: Lazy3DWrapperProps) {
  const lodConfig = useLODConfig();
  const finalConfig = { ...defaultConfig, ...config };
  
  // Check if component should render based on LOD
  const shouldRender = shouldRenderComponent(finalConfig.componentType, lodConfig);
  
  // Don't render anything if LOD says no
  if (!shouldRender) {
    return null;
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

// Utility function to create lazy 3D components
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

// Export the lazy components
export const FloatingCandlesLazy = createLazy3DComponent(
  () => import('./InstancedCandles'),
  {
    loadPriority: 'medium',
    componentType: 'floatingCandles',
    errorBoundary: true,
  }
);

export const MovingPortraitsLazy = createLazy3DComponent(
  () => import('./MovingPortraits'),
  {
    loadPriority: 'low',
    componentType: 'movingPortraits',
    errorBoundary: true,
  }
);

export const GoldenSnitchLazy = createLazy3DComponent(
  () => import('./GoldenSnitch'),
  {
    loadPriority: 'high',
    componentType: 'goldenSnitch',
    errorBoundary: true,
  }
);