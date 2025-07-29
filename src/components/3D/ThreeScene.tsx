'use client';

import { Canvas } from '@react-three/fiber';
import { Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';

// Note: THREE objects are automatically extended in R3F v9+
// extend(THREE) is no longer needed and can cause TypeScript issues

import { LoadingSpinner } from '@/components/ui';

// Scene configuration interface
interface SceneConfig {
  enableShadows?: boolean;
  enableFog?: boolean;
  backgroundColor?: string;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
}

// Props interface for ThreeScene
interface ThreeSceneProps {
  children?: React.ReactNode;
  config?: SceneConfig;
  className?: string;
  fallbackComponent?: React.ReactNode;
  enablePerformanceMonitor?: boolean;
}

// Default scene configuration
const defaultConfig: SceneConfig = {
  enableShadows: true,
  enableFog: true,
  backgroundColor: 'transparent',
  cameraPosition: [0, 0, 5],
  cameraFov: 75,
};

// Scene content component (separated for better error handling)
function SceneContent({ config }: { config: SceneConfig }) {
  return (
    <>
      {/* Ambient lighting for general illumination */}
      <ambientLight intensity={0.4} />
      
      {/* Directional light for shadows and definition */}
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.8}
        castShadow={config.enableShadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      
      {/* Point light for magical ambiance */}
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#8B5CF6" />
      <pointLight position={[10, -10, -10]} intensity={0.3} color="#10B981" />
      
      {/* Fog for atmospheric depth */}
      {config.enableFog && (
        <fog attach="fog" args={['#1a1a1a', 10, 50]} />
      )}
    </>
  );
}

// Error boundary fallback for 3D content
function ThreeErrorFallback({ error }: { error: Error }) {
  console.warn('3D Scene Error:', error);
  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
      <div className="glass p-4 rounded-lg">
        <p className="text-sm text-theme-text-muted">
          3D effects unavailable
        </p>
      </div>
    </div>
  );
}

// WebGL support detection
function useWebGLSupport() {
  const [isSupported, setIsSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      setIsSupported(!!gl);
    } catch {
      setIsSupported(false);
    }
  }, []);

  return isSupported;
}

// Reduced motion preference detection
function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

export default function ThreeScene({
  children,
  config = {},
  className = '',
  fallbackComponent,
  enablePerformanceMonitor = false,
}: ThreeSceneProps) {
  const webGLSupported = useWebGLSupport();
  const prefersReducedMotion = useReducedMotion();
  const sceneConfig = { ...defaultConfig, ...config };

  // Show loading state while checking WebGL support
  if (webGLSupported === null) {
    return (
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
        <LoadingSpinner size="lg" variant="magical" text="Preparing magical elements..." />
      </div>
    );
  }

  // Show fallback if WebGL is not supported
  if (!webGLSupported) {
    return (
      fallbackComponent || (
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-theme-accent/5 to-theme-primary/5" />
        </div>
      )
    );
  }

  // Show static fallback if user prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-theme-accent/10 to-theme-primary/10">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-theme-accent rounded-full animate-pulse" />
            <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-theme-primary rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-1/2 left-3/4 w-1.5 h-1.5 bg-theme-accent rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 pointer-events-none ${className}`}>
      <Canvas
        shadows={sceneConfig.enableShadows}
        camera={{
          position: sceneConfig.cameraPosition,
          fov: sceneConfig.cameraFov,
        }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl, scene, camera }) => {
          // Enable shadow mapping
          if (sceneConfig.enableShadows) {
            gl.shadowMap.enabled = true;
            gl.shadowMap.type = THREE.PCFSoftShadowMap;
          }

          // Set background
          if (sceneConfig.backgroundColor !== 'transparent') {
            scene.background = null; // Keep transparent for overlay effect
          }

          // Performance optimizations
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          
          // Frustum culling is enabled by default in Three.js
          camera.frustumCulled = true;
        }}
        dpr={[1, 2]} // Responsive pixel ratio
        performance={{ min: 0.8 }} // Adaptive performance
        frameloop={children ? "always" : "demand"} // Enable continuous rendering when children with animations are present
      >
        <Suspense fallback={null}>
          <SceneContent config={sceneConfig} />
          {children}
        </Suspense>
        
        {/* Performance monitor (optional, for development) */}
        {enablePerformanceMonitor && process.env.NODE_ENV === 'development' && (
          <mesh position={[-4, 3, 0]}>
            <planeGeometry args={[2, 1]} />
            <meshBasicMaterial color="#333" transparent opacity={0.8} />
          </mesh>
        )}
      </Canvas>
    </div>
  );
}

// Error boundary wrapper
export function ThreeSceneWithErrorBoundary(props: ThreeSceneProps) {
  try {
    return <ThreeScene {...props} />;
  } catch (error) {
    return <ThreeErrorFallback error={error as Error} />;
  }
}