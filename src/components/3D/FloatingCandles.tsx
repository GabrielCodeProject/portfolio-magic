'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';

import { useTheme } from '@/hooks/useTheme';
import { useLODConfig, shouldRenderComponent, useDevicePerformance } from '@/hooks/useDevicePerformance';

// Individual candle properties
interface CandleProps {
  position: [number, number, number];
  scale?: number;
  animationOffset?: number;
  lightIntensity?: number;
  enableShadows?: boolean;
  geometryComplexity?: number;
  shadowMapSize?: number;
}

// Floating candles component props
interface FloatingCandlesProps {
  // Optional props to override LOD system (primarily for testing)
  count?: number;
  spread?: number;
  candleScale?: number;
  lightIntensity?: number;
}

// Individual Candle Component
function Candle({ 
  position, 
  scale = 1, 
  animationOffset = 0, 
  lightIntensity = 0.5,
  enableShadows = true,
  geometryComplexity = 1.0,
  shadowMapSize = 512
}: CandleProps) {
  const candleRef = useRef<THREE.Group>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  const flameRef = useRef<THREE.Mesh>(null);
  const { theme } = useTheme();

  // Theme-based colors
  const flameColor = theme === 'slytherin' ? '#10B981' : '#F59E0B';
  const lightColor = theme === 'slytherin' ? '#059669' : '#D97706';

  // LOD-based geometry complexity - dynamically calculated
  const candleSegments = Math.max(4, Math.floor(12 * geometryComplexity));
  const flameSegments = Math.max(4, Math.floor(8 * geometryComplexity));

  // Animation
  useFrame((state) => {
    if (candleRef.current) {
      const time = state.clock.getElapsedTime();
      const floatY = Math.sin(time * 0.8 + animationOffset) * 0.1;
      const bobX = Math.cos(time * 0.6 + animationOffset) * 0.05;
      
      candleRef.current.position.y = position[1] + floatY;
      candleRef.current.position.x = position[0] + bobX;
      candleRef.current.rotation.z = Math.sin(time * 0.4 + animationOffset) * 0.02;
    }

    // Animate flame flickering
    if (flameRef.current && lightRef.current) {
      const time = state.clock.getElapsedTime();
      const flicker = 0.8 + Math.sin(time * 8 + animationOffset) * 0.1 + Math.sin(time * 12 + animationOffset) * 0.05;
      
      flameRef.current.scale.setScalar(flicker * scale * 0.3);
      lightRef.current.intensity = lightIntensity * flicker;
    }
  });

  return (
    <group ref={candleRef} position={position}>
      {/* Candle Body */}
      <mesh castShadow={enableShadows} receiveShadow={enableShadows} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.08 * scale, 0.1 * scale, 1.2 * scale, candleSegments]} />
        <meshStandardMaterial 
          color="#F5F5DC"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>

      {/* Candle Wax Drips - only render on medium/high complexity */}
      {geometryComplexity > 0.4 && (
        <mesh castShadow={enableShadows} position={[0.05 * scale, -0.3 * scale, 0]}>
          <sphereGeometry args={[0.03 * scale, Math.max(4, Math.floor(candleSegments / 2)), 4]} />
        <meshStandardMaterial 
          color="#F0F0E6"
          roughness={0.9}
          metalness={0}
        />
        </mesh>
      )}

      {/* Candle Wick */}
      <mesh position={[0, 0.6 * scale, 0]}>
        <cylinderGeometry args={[0.01 * scale, 0.01 * scale, 0.1 * scale, 4]} />
        <meshStandardMaterial color="#2D1810" />
      </mesh>

      {/* Flame */}
      <mesh 
        ref={flameRef}
        position={[0, 0.7 * scale, 0]}
      >
        <sphereGeometry args={[0.06 * scale, flameSegments, flameSegments]} />
        <meshStandardMaterial 
          color={flameColor}
          emissive={flameColor}
          emissiveIntensity={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Point Light */}
      <pointLight
        ref={lightRef}
        position={[0, 0.7 * scale, 0]}
        color={lightColor}
        intensity={lightIntensity}
        distance={3}
        decay={2}
        castShadow={enableShadows}
        shadow-mapSize-width={shadowMapSize}
        shadow-mapSize-height={shadowMapSize}
        shadow-camera-near={0.1}
        shadow-camera-far={5}
      />
    </group>
  );
}

// Main FloatingCandles Component
export default function FloatingCandles({
  count,
  spread = 8,
  candleScale = 1,
  lightIntensity = 0.5,
}: FloatingCandlesProps) {
  const lodConfig = useLODConfig();
  const devicePerformance = useDevicePerformance();
  
  // Check if component should render at all
  if (!shouldRenderComponent('floatingCandles', lodConfig)) {
    return null;
  }
  
  // Get LOD configuration
  const config = lodConfig.getComponentConfig('floatingCandles');
  if (!config) {
    console.warn('FloatingCandles: No LOD configuration found');
    return null;
  }
  
  // Use LOD config with optional overrides
  const finalCount = count ?? config.instanceCount ?? 6;
  const finalLightIntensity = lightIntensity;
  const finalEnableShadows = config.enableShadows ?? false;
  const geometryComplexity = config.geometryComplexity ?? 0.7;
  const shadowMapSize = config.shadowMapSize ?? 512;
  
  // Performance logging
  if (process.env.NODE_ENV === 'development') {
    console.log('🕯️ FloatingCandles LOD Config:', {
      level: lodConfig.level,
      count: finalCount,
      shadows: finalEnableShadows,
      complexity: geometryComplexity,
      isMobile: devicePerformance.isMobile,
    });
  }
  
  // Generate candle positions
  const candles = useMemo(() => {
    const candleArray = [];
    
    for (let i = 0; i < finalCount; i++) {
      // Create positions in a scattered pattern around the scene
      const angle = (i / finalCount) * Math.PI * 2;
      const radius = 2 + Math.random() * (spread - 2);
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
      const y = -1 + Math.random() * 3; // Vary height
      
      candleArray.push({
        id: i,
        position: [x, y, z] as [number, number, number],
        animationOffset: Math.random() * Math.PI * 2,
        scale: candleScale * (0.8 + Math.random() * 0.4), // Slight size variation
      });
    }
    
    return candleArray;
  }, [finalCount, spread, candleScale]);

  return (
    <group>
      {candles.map((candle) => (
        <Candle
          key={candle.id}
          position={candle.position}
          scale={candle.scale}
          animationOffset={candle.animationOffset}
          lightIntensity={finalLightIntensity}
          enableShadows={finalEnableShadows}
          geometryComplexity={geometryComplexity}
          shadowMapSize={shadowMapSize}
        />
      ))}
    </group>
  );
}