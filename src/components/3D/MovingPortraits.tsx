'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useEffect, useMemo } from 'react';
import * as THREE from 'three';

import { useTheme } from '@/hooks/useTheme';

// LOD quality levels
type PortraitQuality = 'high' | 'medium' | 'low';

// Individual portrait properties
interface PortraitProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: number;
  portraitId: number;
  mousePosition: THREE.Vector2;
  scrollOffset: number;
  quality?: PortraitQuality;
  interactivity?: boolean;
}

// Moving portraits component props
interface MovingPortraitsProps {
  count?: number;
  // LOD props - if provided, override automatic detection
  forceLOD?: PortraitQuality;
  enableInteractivity?: boolean;
}

// Individual Portrait Component
function Portrait({ 
  position, 
  rotation = [0, 0, 0], 
  scale = 1,
  portraitId,
  mousePosition,
  scrollOffset,
  quality = 'medium',
  interactivity = true
}: PortraitProps) {
  const portraitRef = useRef<THREE.Group>(null);
  const eyesRef = useRef<THREE.Group>(null);
  const contentRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  const { size } = useThree();

  // Theme-based colors
  const primaryColor = theme === 'slytherin' ? '#10B981' : '#F59E0B';
  const secondaryColor = theme === 'slytherin' ? '#059669' : '#D97706';
  const frameColor = theme === 'slytherin' ? '#1F2937' : '#8B4513';

  // Portrait-specific animation offset
  const animationOffset = portraitId * 0.7;

  // LOD-based geometry complexity
  const geometryDetails = {
    high: {
      frameSegments: 16,
      canvasSegments: 12,
      eyeSegments: 8,
      animationFidelity: 1.0,
    },
    medium: {
      frameSegments: 8,
      canvasSegments: 6,
      eyeSegments: 6,
      animationFidelity: 0.7,
    },
    low: {
      frameSegments: 4,
      canvasSegments: 4,
      eyeSegments: 4,
      animationFidelity: 0.3,
    },
  };

  const details = geometryDetails[quality];

  // Animation and interaction
  useFrame((state) => {
    if (!portraitRef.current || !eyesRef.current || !contentRef.current) return;

    const time = state.clock.getElapsedTime();

    // Interactive eye tracking (only if interactivity is enabled)
    if (interactivity && eyesRef.current) {
      // Convert mouse position to 3D world coordinates
      const mouse3D = new THREE.Vector3(
        (mousePosition.x * 2 - 1) * (size.width / size.height) * 5,
        -(mousePosition.y * 2 - 1) * 5,
        0
      );

      // Calculate direction from portrait to mouse
      const portraitWorldPos = new THREE.Vector3(...position);
      const direction = mouse3D.clone().sub(portraitWorldPos).normalize();

      // Limit the look-at range
      const maxLookDistance = 0.3 * details.animationFidelity;
      const lookAtX = Math.max(-maxLookDistance, Math.min(maxLookDistance, direction.x * 0.5));
      const lookAtY = Math.max(-maxLookDistance, Math.min(maxLookDistance, direction.y * 0.5));

      // Smooth interpolation for natural movement (reduced fidelity for lower LOD)
      const lerpFactor = 0.05 * details.animationFidelity;
      eyesRef.current.position.x = THREE.MathUtils.lerp(
        eyesRef.current.position.x,
        lookAtX,
        lerpFactor
      );
      eyesRef.current.position.y = THREE.MathUtils.lerp(
        eyesRef.current.position.y,
        lookAtY,
        lerpFactor
      );
    }

    // Idle animations (scaled by animation fidelity)
    const idleFloat = Math.sin(time * 0.5 + animationOffset) * 0.01 * details.animationFidelity;
    const idleTilt = Math.cos(time * 0.3 + animationOffset) * 0.005 * details.animationFidelity;
    
    portraitRef.current.position.y = position[1] + idleFloat;
    portraitRef.current.rotation.z = rotation[2] + idleTilt;

    // Scroll-based effects (only if interactivity is enabled)
    if (interactivity) {
      const scrollInfluence = scrollOffset * 0.001 * details.animationFidelity;
      contentRef.current.rotation.z = scrollInfluence * Math.sin(animationOffset);
    }

    // Subtle pulsing effect for the magical elements (reduced for low LOD)
    const pulseIntensity = quality === 'low' ? 0.05 : 0.1;
    const pulse = 0.8 + Math.sin(time * 2 + animationOffset) * pulseIntensity;
    contentRef.current.scale.setScalar(pulse * details.animationFidelity + (1 - details.animationFidelity));
  });

  // Validate props after all hooks have been called
  if (!position || position.length !== 3) {
    console.warn('Portrait: Invalid position prop provided');
    return null;
  }

  return (
    <group ref={portraitRef} position={position} rotation={rotation}>
      {/* Ornate Frame */}
      <group>
        {/* Main frame border */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[1.8 * scale, 2.4 * scale, 0.1]} />
          <meshStandardMaterial color={frameColor} roughness={0.8} metalness={0.3} />
        </mesh>
        
        {/* Frame decorations */}
        <mesh position={[0, 1.1 * scale, 0]}>
          <boxGeometry args={[0.3 * scale, 0.1 * scale, 0.05]} />
          <meshStandardMaterial color={primaryColor} roughness={0.6} metalness={0.4} />
        </mesh>
        <mesh position={[0, -1.1 * scale, 0]}>
          <boxGeometry args={[0.3 * scale, 0.1 * scale, 0.05]} />
          <meshStandardMaterial color={primaryColor} roughness={0.6} metalness={0.4} />
        </mesh>
        
        {/* Corner ornaments - only render on medium/high quality */}
        {quality !== 'low' && (
          <>
            <mesh position={[0.8 * scale, 1.0 * scale, 0]}>
              <sphereGeometry args={[0.08 * scale, details.frameSegments / 2, details.frameSegments / 2]} />
              <meshStandardMaterial color={secondaryColor} roughness={0.5} metalness={0.5} />
            </mesh>
            <mesh position={[-0.8 * scale, 1.0 * scale, 0]}>
              <sphereGeometry args={[0.08 * scale, details.frameSegments / 2, details.frameSegments / 2]} />
              <meshStandardMaterial color={secondaryColor} roughness={0.5} metalness={0.5} />
            </mesh>
            <mesh position={[0.8 * scale, -1.0 * scale, 0]}>
              <sphereGeometry args={[0.08 * scale, details.frameSegments / 2, details.frameSegments / 2]} />
              <meshStandardMaterial color={secondaryColor} roughness={0.5} metalness={0.5} />
            </mesh>
            <mesh position={[-0.8 * scale, -1.0 * scale, 0]}>
              <sphereGeometry args={[0.08 * scale, details.frameSegments / 2, details.frameSegments / 2]} />
              <meshStandardMaterial color={secondaryColor} roughness={0.5} metalness={0.5} />
            </mesh>
          </>
        )}
      </group>

      {/* Portrait Content */}
      <group ref={contentRef}>
        {/* Background */}
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[1.6 * scale, 2.2 * scale, details.canvasSegments, details.canvasSegments]} />
          <meshStandardMaterial 
            color="#2A2A2A"
            roughness={0.9}
          />
        </mesh>

        {/* Magical gradient overlay */}
        <mesh position={[0, 0, -0.01]}>
          <planeGeometry args={[1.6 * scale, 2.2 * scale]} />
          <meshStandardMaterial 
            color={primaryColor}
            transparent
            opacity={0.2}
            roughness={0.7}
          />
        </mesh>

        {/* Eyes that follow cursor */}
        <group ref={eyesRef}>
          {/* Left eye */}
          <mesh position={[-0.25 * scale, 0.3 * scale, 0.01]}>
            <sphereGeometry args={[0.08 * scale, details.eyeSegments, details.eyeSegments]} />
            <meshStandardMaterial 
              color={secondaryColor}
              emissive={secondaryColor}
              emissiveIntensity={0.3}
            />
          </mesh>
          
          {/* Right eye */}
          <mesh position={[0.25 * scale, 0.3 * scale, 0.01]}>
            <sphereGeometry args={[0.08 * scale, details.eyeSegments, details.eyeSegments]} />
            <meshStandardMaterial 
              color={secondaryColor}
              emissive={secondaryColor}
              emissiveIntensity={0.3}
            />
          </mesh>
        </group>

        {/* Mystical floating elements */}
        <group>
          <mesh position={[0.4 * scale, -0.2 * scale, 0.02]}>
            <sphereGeometry args={[0.03 * scale, 6, 6]} />
            <meshStandardMaterial 
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={0.5}
              transparent
              opacity={0.8}
            />
          </mesh>
          <mesh position={[-0.3 * scale, 0.1 * scale, 0.02]}>
            <sphereGeometry args={[0.02 * scale, 6, 6]} />
            <meshStandardMaterial 
              color={secondaryColor}
              emissive={secondaryColor}
              emissiveIntensity={0.4}
              transparent
              opacity={0.7}
            />
          </mesh>
          <mesh position={[0.1 * scale, -0.5 * scale, 0.02]}>
            <sphereGeometry args={[0.025 * scale, 6, 6]} />
            <meshStandardMaterial 
              color={primaryColor}
              emissive={primaryColor}
              emissiveIntensity={0.6}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
}

// Main Moving Portraits Component
export default function MovingPortraits({
  count,
  forceLOD,
  enableInteractivity
}: MovingPortraitsProps) {
  // Simple defaults without complex LOD config
  const finalCount = count ?? 4;
  const finalEnableInteractivity = enableInteractivity ?? true;
  const quality = forceLOD ?? 'medium';
  const [mousePosition, setMousePosition] = useState(new THREE.Vector2(0.5, 0.5));
  const [scrollOffset, setScrollOffset] = useState(0);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX / window.innerWidth;
      const y = event.clientY / window.innerHeight;
      setMousePosition(new THREE.Vector2(x, y));
    };

    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };

    // Throttle mouse events for performance
    let mouseMoveTimeout: NodeJS.Timeout | undefined;
    const throttledMouseMove = (event: MouseEvent) => {
      if (mouseMoveTimeout) return;
      mouseMoveTimeout = setTimeout(() => {
        handleMouseMove(event);
        mouseMoveTimeout = undefined;
      }, 16); // ~60fps
    };

    // Throttle scroll events
    let scrollTimeout: NodeJS.Timeout | undefined;
    const throttledScroll = () => {
      if (scrollTimeout) return;
      scrollTimeout = setTimeout(() => {
        handleScroll();
        scrollTimeout = undefined;
      }, 16);
    };

    window.addEventListener('mousemove', throttledMouseMove);
    window.addEventListener('scroll', throttledScroll);

    return () => {
      window.removeEventListener('mousemove', throttledMouseMove);
      window.removeEventListener('scroll', throttledScroll);
      if (mouseMoveTimeout) clearTimeout(mouseMoveTimeout);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, []);

  // Generate portrait positions
  const portraits = useMemo(() => {
    const portraitArray = [];
    
    for (let i = 0; i < finalCount; i++) {
      // Position portraits around the scene like they're on walls
      const positions: [number, number, number][] = [
        // Back wall
        [-3, 1, -4],
        [3, 0.5, -4],
        [0, 2, -4],
        [-1.5, -0.5, -4],
        // Side walls
        [-5, 1.5, -1],
        [5, 0, -2],
        [-4, -0.5, 1],
        [4, 2, 0],
      ];

      const rotations: [number, number, number][] = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
        [0, Math.PI / 6, 0], // Slightly angled
        [0, -Math.PI / 6, 0],
        [0, Math.PI / 4, 0],
        [0, -Math.PI / 4, 0],
      ];

      if (i < positions.length) {
        portraitArray.push({
          id: i,
          position: positions[i],
          rotation: rotations[i],
          scale: 0.8 + Math.random() * 0.4, // Size variation
        });
      }
    }
    
    return portraitArray;
  }, [finalCount]);

  return (
    <group>
      {portraits.map((portrait) => (
        <Portrait
          key={portrait.id}
          portraitId={portrait.id}
          position={portrait.position}
          rotation={portrait.rotation}
          scale={portrait.scale}
          mousePosition={mousePosition}
          scrollOffset={scrollOffset}
          quality={quality}
          interactivity={finalEnableInteractivity}
        />
      ))}
    </group>
  );
}