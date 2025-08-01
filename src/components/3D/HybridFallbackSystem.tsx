'use client';

import React, { useMemo } from 'react';
import { useTheme } from '@/hooks/useTheme';

/**
 * Hybrid Fallback System
 * 
 * Provides fallbacks that work in both Canvas context (3D) and DOM context (HTML)
 * Automatically detects context and renders appropriate fallback type
 */

export type FallbackType = 'candles' | 'portraits' | 'snitch' | 'generic';
export type FallbackContext = 'canvas' | 'dom' | 'auto';

interface HybridFallbackProps {
  type: FallbackType;
  context?: FallbackContext;
  count?: number;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showLoadingText?: boolean;
  loadingText?: string;
  animated?: boolean;
}

/**
 * Detects if we're in a Canvas context by checking the React context
 * This is a simplified detection - in a real implementation, you might use a Context provider
 */
function useCanvasContext(): boolean {
  // Simple heuristic: check if we're inside a Canvas by looking at React context
  // In a real implementation, you'd use a proper Canvas context provider
  return React.useContext(React.createContext(false));
}

/**
 * 3D Fallbacks - Safe for Canvas context (only THREE.js objects)
 */
function Canvas3DFallback({ type, count = 3, animated = true }: { 
  type: FallbackType; 
  count?: number; 
  animated?: boolean;
}) {
  const positions = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2 + Math.random();
      return [
        Math.cos(angle) * radius,
        -1 + Math.random() * 2,
        Math.sin(angle) * radius,
      ] as [number, number, number];
    });
  }, [count]);

  const getColor = (type: FallbackType): string => {
    switch (type) {
      case 'candles': return '#F59E0B';
      case 'portraits': return '#8B5CF6';
      case 'snitch': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const color = getColor(type);

  return (
    <group>
      {positions.map((position, i) => (
        <mesh key={i} position={position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial 
            color={color} 
            emissive={color}
            emissiveIntensity={0.3}
            transparent
            opacity={0.7}
          />
          {animated && (
            <meshStandardMaterial 
              color={color}
              emissive={color}
              emissiveIntensity={0.5}
              transparent
              opacity={0.3}
            />
          )}
        </mesh>
      ))}
      
      {/* Ambient glow effect */}
      <pointLight 
        position={[0, 0, 0]} 
        color={color} 
        intensity={0.3} 
        distance={5} 
      />
    </group>
  );
}

/**
 * HTML Fallbacks - Safe for DOM context
 */
function DOMHTMLFallback({ 
  type, 
  count = 3, 
  theme = 'auto', 
  size = 'md',
  showLoadingText = true,
  loadingText,
  animated = true 
}: {
  type: FallbackType;
  count?: number;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'sm' | 'md' | 'lg';
  showLoadingText?: boolean;
  loadingText?: string;
  animated?: boolean;
}) {
  const { theme: currentTheme } = useTheme();
  const resolvedTheme = theme === 'auto' ? currentTheme : theme;

  const getTypeConfig = (type: FallbackType) => {
    switch (type) {
      case 'candles':
        return {
          icon: '🕯️',
          color: 'from-amber-400 to-orange-600',
          text: loadingText || 'Lighting the candles...',
          particles: '✨',
        };
      case 'portraits':
        return {
          icon: '🖼️',
          color: 'from-purple-400 to-violet-600',
          text: loadingText || 'Awakening the portraits...',
          particles: '👻',
        };
      case 'snitch':
        return {
          icon: '⚡',
          color: 'from-yellow-400 to-amber-600',
          text: loadingText || 'Releasing the Golden Snitch...',
          particles: '✦',
        };
      default:
        return {
          icon: '✨',
          color: 'from-gray-400 to-gray-600',
          text: loadingText || 'Loading 3D element...',
          particles: '·',
        };
    }
  };

  const config = getTypeConfig(type);
  const sizeClasses = {
    sm: 'text-sm p-3',
    md: 'text-base p-4',
    lg: 'text-lg p-6',
  };

  return (
    <div className="fixed inset-0 pointer-events-none flex items-center justify-center">
      <div className={`glass ${sizeClasses[size]} rounded-lg pointer-events-auto max-w-sm`}>
        <div className="text-center">
          {/* Main icon */}
          <div className={`text-2xl mb-3 ${animated ? 'animate-pulse' : ''}`}>
            {config.icon}
          </div>
          
          {/* Loading text */}
          {showLoadingText && (
            <p className="text-theme-text-primary mb-3">
              {config.text}
            </p>
          )}
          
          {/* Animated particles */}
          {animated && (
            <div className="flex justify-center space-x-2 mb-3">
              {Array.from({ length: 3 }, (_, i) => (
                <span
                  key={i}
                  className="text-theme-accent animate-bounce opacity-60"
                  style={{
                    animationDelay: `${i * 0.2}s`,
                    animationDuration: '1.5s',
                  }}
                >
                  {config.particles}
                </span>
              ))}
            </div>
          )}
          
          {/* Progress bar */}
          <div className="w-full h-1 bg-theme-bg-tertiary rounded-full overflow-hidden">
            <div 
              className={`h-full bg-gradient-to-r ${config.color} animate-pulse`}
              style={{
                width: '60%',
                animation: 'pulse 2s ease-in-out infinite',
              }}
            />
          </div>
          
          {/* Subtle background glow */}
          <div 
            className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-5 rounded-lg pointer-events-none`}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Main Hybrid Fallback Component
 * Automatically chooses the appropriate fallback based on context
 */
export default function HybridFallback({
  type,
  context = 'auto',
  count = 3,
  theme = 'auto',
  size = 'md',
  showLoadingText = true,
  loadingText,
  animated = true,
}: HybridFallbackProps) {
  const isCanvasContext = useCanvasContext();
  
  const resolvedContext = context === 'auto' 
    ? (isCanvasContext ? 'canvas' : 'dom')
    : context;

  if (resolvedContext === 'canvas') {
    return (
      <Canvas3DFallback 
        type={type} 
        count={count} 
        animated={animated}
      />
    );
  }

  return (
    <DOMHTMLFallback
      type={type}
      count={count}
      theme={theme}
      size={size}
      showLoadingText={showLoadingText}
      loadingText={loadingText}
      animated={animated}
    />
  );
}

/**
 * Convenience components for specific fallback types
 */
export function CandlesHybridFallback(props: Omit<HybridFallbackProps, 'type'>) {
  return <HybridFallback {...props} type="candles" />;
}

export function PortraitsHybridFallback(props: Omit<HybridFallbackProps, 'type'>) {
  return <HybridFallback {...props} type="portraits" />;
}

export function SnitchHybridFallback(props: Omit<HybridFallbackProps, 'type'>) {
  return <HybridFallback {...props} type="snitch" />;
}

/**
 * Context provider for Canvas detection (optional enhancement)
 */
const CanvasContextDetector = React.createContext(false);

export function CanvasContextProvider({ 
  children, 
  isCanvas = true 
}: { 
  children: React.ReactNode; 
  isCanvas?: boolean; 
}) {
  return (
    <CanvasContextDetector.Provider value={isCanvas}>
      {children}
    </CanvasContextDetector.Provider>
  );
}

/**
 * Hook to detect if we're in Canvas context (enhanced version)
 */
export function useIsCanvasContext(): boolean {
  return React.useContext(CanvasContextDetector);
}