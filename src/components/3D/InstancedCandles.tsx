'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/hooks/useTheme';
import { useLODConfig, shouldRenderComponent } from '@/hooks/useDevicePerformance';

interface CandleInstance {
  id: number;
  position: THREE.Vector3;
  animationOffset: number;
  scale: number;
  matrix: THREE.Matrix4;
  visible: boolean;
}

interface InstancedCandlesProps {
  count?: number;
  spread?: number;
  candleScale?: number;
  lightIntensity?: number;
}

export default function InstancedCandles({
  count,
  spread = 8,
  candleScale = 1,
  lightIntensity = 0.5,
}: InstancedCandlesProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const lightGroupRef = useRef<THREE.Group>(null);
  const lodConfig = useLODConfig();
  const { theme } = useTheme();

  // Check if component should render
  if (!shouldRenderComponent('floatingCandles', lodConfig)) {
    return null;
  }

  const config = lodConfig.getComponentConfig('floatingCandles');
  if (!config) return null;

  const finalCount = count ?? config.instanceCount ?? 6;
  const geometryComplexity = config.geometryComplexity ?? 0.7;
  const enableShadows = config.enableShadows ?? false;

  // Culling configuration
  const cullingConfig = useMemo(() => ({
    maxRenderDistance: 15,
    fadeStartDistance: 12,
    enableFrustumCulling: true,
    enableDistanceCulling: true,
  }), []);

  // Generate candle instances
  const instances = useMemo(() => {
    const candleInstances: CandleInstance[] = [];
    
    for (let i = 0; i < finalCount; i++) {
      const angle = (i / finalCount) * Math.PI * 2;
      const radius = 2 + Math.random() * (spread - 2);
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 2;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 2;
      const y = -1 + Math.random() * 3;
      
      candleInstances.push({
        id: i,
        position: new THREE.Vector3(x, y, z),
        animationOffset: Math.random() * Math.PI * 2,
        scale: candleScale * (0.8 + Math.random() * 0.4),
        matrix: new THREE.Matrix4(),
        visible: true,
      });
    }
    
    return candleInstances;
  }, [finalCount, spread, candleScale]);

  // Geometry with LOD complexity
  const candleSegments = Math.max(4, Math.floor(12 * geometryComplexity));

  // Animation and culling
  useFrame((state) => {
    if (!meshRef.current) return;

    const time = state.clock.getElapsedTime();
    let visibleCount = 0;

    instances.forEach((instance, index) => {
      // Animation
      const floatY = Math.sin(time * 0.8 + instance.animationOffset) * 0.1;
      const bobX = Math.cos(time * 0.6 + instance.animationOffset) * 0.05;
      const tilt = Math.sin(time * 0.4 + instance.animationOffset) * 0.02;

      const position = instance.position.clone();
      position.y += floatY;
      position.x += bobX;

      // Create transformation matrix
      instance.matrix.makeRotationZ(tilt);
      instance.matrix.setPosition(position);
      instance.matrix.multiplyScalar(instance.scale);

      // Simple distance culling for instanced mesh
      const distanceToCamera = position.distanceTo(state.camera.position);
      instance.visible = distanceToCamera < cullingConfig.maxRenderDistance;

      if (instance.visible) {
        visibleCount++;
        meshRef.current!.setMatrixAt(index, instance.matrix);
      } else {
        // Hide by scaling to zero
        const hiddenMatrix = instance.matrix.clone().multiplyScalar(0);
        meshRef.current!.setMatrixAt(index, hiddenMatrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.count = visibleCount; // Optimize draw calls
  });

  const flameColor = theme === 'slytherin' ? '#10B981' : '#F59E0B';

  return (
    <group>
      {/* Instanced Candle Bodies */}
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, finalCount]}
        castShadow={enableShadows}
        receiveShadow={enableShadows}
      >
        <cylinderGeometry args={[0.08 * candleScale, 0.1 * candleScale, 1.2 * candleScale, candleSegments]} />
        <meshStandardMaterial color="#F5F5DC" roughness={0.8} metalness={0.1} />
      </instancedMesh>

      {/* Individual lights (fewer instances for performance) */}
      <group ref={lightGroupRef}>
        {instances.slice(0, Math.min(6, finalCount)).map((instance) => (
          <pointLight
            key={instance.id}
            position={instance.position.toArray()}
            color={flameColor}
            intensity={lightIntensity * 0.5}
            distance={3}
            decay={2}
            castShadow={enableShadows}
          />
        ))}
      </group>
    </group>
  );
}