import * as THREE from 'three';

// Bounding sphere for culling calculations
export interface BoundingSphere {
  center: THREE.Vector3;
  radius: number;
}

// Distance-based culling configuration
export interface CullingConfig {
  maxRenderDistance: number;
  fadeStartDistance?: number;
  enableFrustumCulling: boolean;
  enableDistanceCulling: boolean;
}

// Frustum culling utilities
export class FrustumCuller {
  private frustum: THREE.Frustum;
  private cameraMatrix: THREE.Matrix4;

  constructor() {
    this.frustum = new THREE.Frustum();
    this.cameraMatrix = new THREE.Matrix4();
  }

  updateFromCamera(camera: THREE.Camera): void {
    this.cameraMatrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    this.frustum.setFromProjectionMatrix(this.cameraMatrix);
  }

  isPointVisible(point: THREE.Vector3): boolean {
    return this.frustum.containsPoint(point);
  }

  isSphereVisible(sphere: BoundingSphere): boolean {
    return this.frustum.intersectsSphere(new THREE.Sphere(sphere.center, sphere.radius));
  }

  isBoxVisible(box: THREE.Box3): boolean {
    return this.frustum.intersectsBox(box);
  }
}

// Distance-based culling
export function getDistanceLOD(
  objectPosition: THREE.Vector3,
  cameraPosition: THREE.Vector3,
  config: CullingConfig
): { visible: boolean; lodLevel: number; opacity: number } {
  const distance = objectPosition.distanceTo(cameraPosition);
  
  if (!config.enableDistanceCulling) {
    return { visible: true, lodLevel: 1, opacity: 1 };
  }

  if (distance > config.maxRenderDistance) {
    return { visible: false, lodLevel: 0, opacity: 0 };
  }

  // Calculate LOD level (0-1)
  const lodLevel = 1 - Math.min(distance / config.maxRenderDistance, 1);
  
  // Calculate fade opacity
  let opacity = 1;
  if (config.fadeStartDistance && distance > config.fadeStartDistance) {
    const fadeRange = config.maxRenderDistance - config.fadeStartDistance;
    const fadeDistance = distance - config.fadeStartDistance;
    opacity = 1 - (fadeDistance / fadeRange);
  }

  return { visible: true, lodLevel, opacity: Math.max(0, opacity) };
}