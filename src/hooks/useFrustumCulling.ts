'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { FrustumCuller, CullingConfig, getDistanceLOD } from '@/lib/frustum-culling';

export interface CullingResult {
  isVisible: boolean;
  lodLevel: number;
  opacity: number;
  distanceToCamera: number;
}

export function useFrustumCulling(
  position: THREE.Vector3 | [number, number, number],
  config: CullingConfig
): CullingResult {
  const { camera } = useThree();
  const frustumCuller = useRef(new FrustumCuller());
  const positionVec3 = useMemo(() => {
    return Array.isArray(position) ? new THREE.Vector3(...position) : position;
  }, [position]);

  const result = useRef<CullingResult>({
    isVisible: true,
    lodLevel: 1,
    opacity: 1,
    distanceToCamera: 0,
  });

  useFrame(() => {
    // Update frustum from camera
    frustumCuller.current.updateFromCamera(camera);
    
    const distanceToCamera = positionVec3.distanceTo(camera.position);
    
    // Check frustum culling
    const inFrustum = config.enableFrustumCulling
      ? frustumCuller.current.isPointVisible(positionVec3)
      : true;
    
    // Check distance culling
    const distanceResult = getDistanceLOD(positionVec3, camera.position, config);
    
    // Combine results
    result.current = {
      isVisible: inFrustum && distanceResult.visible,
      lodLevel: distanceResult.lodLevel,
      opacity: distanceResult.opacity,
      distanceToCamera,
    };
  });

  return result.current;
}