'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { useDevicePerformance } from '@/hooks/useDevicePerformance';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import MobileLoadingIndicator from './MobileLoadingIndicator';

interface MobileOptimizedSceneProps {
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
  className?: string;
  enableVR?: boolean;
}

/**
 * Mobile-optimized 3D scene wrapper that provides:
 * - Appropriate loading states for mobile
 * - Performance-based feature toggles
 * - Accessibility considerations
 * - Battery-conscious rendering
 */
export default function MobileOptimizedScene({
  children,
  fallbackComponent,
  className = '',
  enableVR = false,
}: MobileOptimizedSceneProps) {
  const devicePerformance = useDevicePerformance();
  const prefersReducedMotion = useReducedMotion();
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Simulate loading progress for better UX
  useEffect(() => {
    if (!isLoading) return;

    const progressInterval = setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          // Stay at 90% until actual loading completes
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(progressInterval);
  }, [isLoading]);

  // Handle loading completion
  const handleLoadingComplete = () => {
    setLoadingProgress(100);
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  // If user prefers reduced motion, show fallback or simplified version
  if (prefersReducedMotion) {
    return (
      <div className={`relative ${className}`}>
        <div className="
          bg-theme-card border border-theme-border-primary rounded-lg
          p-8 text-center backdrop-filter backdrop-blur-md
        ">
          <div className="w-16 h-16 mx-auto mb-4 opacity-60">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-theme-primary">
              <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"/>
            </svg>
          </div>
          <h3 className="text-lg font-heading font-semibold text-theme-text-primary mb-2">
            Magical Portfolio
          </h3>
          <p className="text-theme-text-muted text-sm mb-4">
            Motion is reduced per your accessibility preferences
          </p>
          {fallbackComponent || (
            <div className="space-y-2">
              <div className="h-2 bg-theme-bg-secondary rounded w-3/4 mx-auto" />
              <div className="h-2 bg-theme-bg-secondary rounded w-1/2 mx-auto" />
              <div className="h-2 bg-theme-bg-secondary rounded w-2/3 mx-auto" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // If device doesn't support WebGL well, show fallback
  if (!devicePerformance.supportedFeatures.webgl2 && devicePerformance.isLowPowerDevice) {
    return (
      <div className={`relative ${className}`}>
        <div className="
          bg-theme-card border border-theme-border-primary rounded-lg
          p-8 text-center backdrop-filter backdrop-blur-md
        ">
          <div className="w-16 h-16 mx-auto mb-4 opacity-60">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-theme-secondary">
              <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/>
            </svg>
          </div>
          <h3 className="text-lg font-heading font-semibold text-theme-text-primary mb-2">
            Portfolio Experience
          </h3>
          <p className="text-theme-text-muted text-sm mb-4">
            Optimized for your device's capabilities
          </p>
          {fallbackComponent || <div className="flex items-center justify-center h-64 text-primary/60">Loading 3D scene...</div>}
        </div>
      </div>
    );
  }

  // Main 3D scene for capable devices
  return (
    <div className={`relative ${className}`}>
      {/* Loading overlay */}
      <MobileLoadingIndicator
        isLoading={isLoading}
        progress={loadingProgress}
        message={
          devicePerformance.isMobile 
            ? 'Preparing mobile 3D experience...' 
            : 'Loading magical elements...'
        }
      />

      {/* Error boundary */}
      {error && (
        <div className="
          absolute inset-0 z-40 bg-theme-bg-overlay
          flex items-center justify-center
        ">
          <div className="
            bg-theme-card border border-red-500/20 rounded-lg
            p-6 max-w-sm mx-4 text-center
          ">
            <div className="w-12 h-12 mx-auto mb-4 text-red-500">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                <path d="M12 2C6.48 2 2 6.48 2 12S6.48 22 12 22 22 17.52 22 12 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"/>
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-theme-text-primary mb-2">
              3D Loading Error
            </h3>
            <p className="text-theme-text-muted text-sm mb-4">{error}</p>
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                setLoadingProgress(0);
              }}
              className="btn-primary btn-sm"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* 3D Canvas with mobile optimizations */}
      <Canvas
        className="w-full h-full"
        camera={{
          position: [0, 0, 5],
          fov: devicePerformance.isMobile ? 60 : 75,
        }}
        dpr={[
          devicePerformance.isLowPowerDevice ? 0.5 : 1,
          devicePerformance.isMobile ? 1.5 : 2
        ]}
        performance={{
          min: devicePerformance.isLowPowerDevice ? 0.2 : 0.5,
          max: devicePerformance.isMobile ? 0.8 : 1,
          debounce: devicePerformance.isMobile ? 300 : 200,
        }}
        gl={{
          powerPreference: devicePerformance.isMobile ? 'low-power' : 'high-performance',
          antialias: !devicePerformance.isLowPowerDevice,
          alpha: true,
          premultipliedAlpha: true,
          preserveDrawingBuffer: false,
        }}
        shadows={devicePerformance.supportedFeatures.shadows && !devicePerformance.isMobile}
        onCreated={(state) => {
          // Mobile-specific optimizations
          if (devicePerformance.isMobile) {
            state.gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          }
          
          // Complete loading after canvas is ready
          handleLoadingComplete();
        }}
        onError={(error) => {
          console.error('3D Scene Error:', error);
          setError('Failed to initialize 3D graphics. Your device may not support this feature.');
          setIsLoading(false);
        }}
      >
        <Suspense 
          fallback={
            // 3D loading fallback - minimal geometry that works in Canvas context
            <group>
              <mesh position={[0, 0, 0]}>
                <sphereGeometry args={[0.1, 8, 8]} />
                <meshBasicMaterial 
                  color="#8B5CF6" 
                  transparent 
                  opacity={0.6}
                />
              </mesh>
            </group>
          }
        >
          {children}
        </Suspense>

        {/* Mobile-specific scene enhancements */}
        {devicePerformance.isMobile && (
          <>
            {/* Reduced fog for better mobile performance */}
            <fog attach="fog" args={['#0f0f23', 1, 15]} />
            
            {/* Ambient light for mobile (less expensive than multiple point lights) */}
            <ambientLight intensity={0.4} />
            <directionalLight
              position={[5, 5, 5]}
              intensity={0.6}
              castShadow={false} // Disable shadows on mobile
            />
          </>
        )}
      </Canvas>

      {/* Mobile performance hint */}
      {devicePerformance.isMobile && !isLoading && (
        <div className="
          absolute bottom-4 right-4 z-30
          bg-theme-card/80 backdrop-blur-sm
          border border-theme-border-primary rounded-lg
          px-3 py-2
        ">
          <p className="text-xs text-theme-text-muted">
            {devicePerformance.level === 'low' ? '🔋' : '⚡'} 
            {devicePerformance.level.charAt(0).toUpperCase() + devicePerformance.level.slice(1)} Quality
          </p>
        </div>
      )}
    </div>
  );
}

/**
 * Hook to provide scene-specific optimizations
 */
export function useSceneOptimizations() {
  const devicePerformance = useDevicePerformance();
  const prefersReducedMotion = useReducedMotion();

  return {
    // Rendering optimizations
    pixelRatio: devicePerformance.isLowPowerDevice ? 0.5 : Math.min(window.devicePixelRatio || 1, 2),
    shadowMapSize: devicePerformance.level === 'low' ? 256 : devicePerformance.level === 'medium' ? 512 : 1024,
    enableShadows: devicePerformance.supportedFeatures.shadows && !devicePerformance.isMobile,
    enableReflections: !devicePerformance.isLowPowerDevice && !prefersReducedMotion,
    
    // Animation optimizations
    animationFPS: devicePerformance.isMobile ? 30 : 60,
    particleCount: devicePerformance.level === 'low' ? 10 : devicePerformance.level === 'medium' ? 25 : 50,
    
    // Battery optimizations
    enableAutoSuspend: devicePerformance.isMobile,
    suspendDelay: devicePerformance.isLowPowerDevice ? 30000 : 60000, // 30s or 60s
    
    // User preferences
    respectsMotion: !prefersReducedMotion,
    devicePerformance,
  };
}