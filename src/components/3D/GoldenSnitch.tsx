'use client';

import { useFrame } from '@react-three/fiber';
import { useRef, useState, useMemo } from 'react';
import * as THREE from 'three';

// Flight states for different behaviors
type FlightState = 'searching' | 'darting' | 'hovering' | 'evasive';

// Golden Snitch component props
interface GoldenSnitchProps {
  bounds?: {
    x: [number, number];
    y: [number, number];
    z: [number, number];
  };
  speed?: number;
  scale?: number;
}

// Individual Wing Component
function Wing({ 
  side, 
  flapIntensity, 
  flapSpeed 
}: { 
  side: 'left' | 'right';
  flapIntensity: number;
  flapSpeed: number;
}) {
  const wingRef = useRef<THREE.Mesh>(null);
  const sideMultiplier = side === 'left' ? -1 : 1;

  useFrame((state) => {
    if (!wingRef.current) return;

    const time = state.clock.getElapsedTime();
    const flapPhase = side === 'left' ? 0 : Math.PI * 0.1; // Slight phase offset between wings
    
    // Wing flapping animation
    const flapAngle = Math.sin(time * flapSpeed + flapPhase) * flapIntensity;
    wingRef.current.rotation.z = (Math.PI * 0.3 * sideMultiplier) + flapAngle;
    
    // Slight forward/backward wing movement
    const forwardMotion = Math.cos(time * flapSpeed + flapPhase) * 0.1;
    wingRef.current.rotation.x = forwardMotion;
  });

  return (
    <mesh 
      ref={wingRef}
      position={[0.15 * sideMultiplier, 0, 0]}
    >
      {/* Wing geometry - delicate wing shape */}
      <planeGeometry args={[0.3, 0.4]} />
      <meshStandardMaterial
        color="#FFE55C"
        transparent
        opacity={0.8}
        side={THREE.DoubleSide}
        roughness={0.2}
        metalness={0.3}
      />
    </mesh>
  );
}

// Main Golden Snitch Component
export default function GoldenSnitch({
  bounds = {
    x: [-6, 6],
    y: [-2, 4],
    z: [-6, 6]
  },
  speed = 1,
  scale = 1
}: GoldenSnitchProps) {
  const snitchRef = useRef<THREE.Group>(null);
  const [currentTarget, setCurrentTarget] = useState<THREE.Vector3>(new THREE.Vector3(0, 2, 0));
  const [flightState, setFlightState] = useState<FlightState>('searching');
  const [stateTimer, setStateTimer] = useState(0);
  const [velocity, setVelocity] = useState(new THREE.Vector3());

  // Flight parameters based on state
  const flightParams = useMemo(() => {
    switch (flightState) {
      case 'searching':
        return { maxSpeed: 1.5 * speed, flapSpeed: 8, flapIntensity: 0.4, agility: 0.02 };
      case 'darting':
        return { maxSpeed: 4 * speed, flapSpeed: 15, flapIntensity: 0.6, agility: 0.08 };
      case 'hovering':
        return { maxSpeed: 0.2 * speed, flapSpeed: 4, flapIntensity: 0.2, agility: 0.01 };
      case 'evasive':
        return { maxSpeed: 5 * speed, flapSpeed: 20, flapIntensity: 0.8, agility: 0.1 };
      default:
        return { maxSpeed: 1.5 * speed, flapSpeed: 8, flapIntensity: 0.4, agility: 0.02 };
    }
  }, [flightState, speed]);

  // Generate new random target within bounds
  const generateNewTarget = () => {
    const newTarget = new THREE.Vector3(
      bounds.x[0] + Math.random() * (bounds.x[1] - bounds.x[0]),
      bounds.y[0] + Math.random() * (bounds.y[1] - bounds.y[0]),
      bounds.z[0] + Math.random() * (bounds.z[1] - bounds.z[0])
    );
    setCurrentTarget(newTarget);
  };

  // Change flight state based on conditions
  const updateFlightState = (deltaTime: number) => {
    setStateTimer(prev => prev + deltaTime);

    // State transition logic
    if (stateTimer > 3 && flightState === 'searching') {
      if (Math.random() < 0.3) {
        setFlightState('darting');
        setStateTimer(0);
        generateNewTarget();
      } else if (Math.random() < 0.1) {
        setFlightState('hovering');
        setStateTimer(0);
      }
    } else if (stateTimer > 1.5 && flightState === 'darting') {
      if (Math.random() < 0.4) {
        setFlightState('searching');
        setStateTimer(0);
      } else if (Math.random() < 0.2) {
        setFlightState('hovering');
        setStateTimer(0);
      }
    } else if (stateTimer > 2 && flightState === 'hovering') {
      if (Math.random() < 0.6) {
        setFlightState('searching');
        setStateTimer(0);
        generateNewTarget();
      } else if (Math.random() < 0.3) {
        setFlightState('darting');
        setStateTimer(0);
        generateNewTarget();
      }
    } else if (stateTimer > 1 && flightState === 'evasive') {
      setFlightState('searching');
      setStateTimer(0);
      generateNewTarget();
    }
  };

  // Animation and movement
  useFrame((state, deltaTime) => {
    if (!snitchRef.current) return;

    updateFlightState(deltaTime);

    const currentPosition = snitchRef.current.position.clone();
    const targetDirection = currentTarget.clone().sub(currentPosition);
    const distanceToTarget = targetDirection.length();

    // Check if we need a new target
    if (distanceToTarget < 0.5 || stateTimer > 8) {
      generateNewTarget();
      setStateTimer(0);
    }

    // Calculate desired velocity based on flight state
    let desiredVelocity = new THREE.Vector3();
    
    if (flightState === 'hovering') {
      // Small random movements while hovering
      const time = state.clock.getElapsedTime();
      desiredVelocity.set(
        Math.sin(time * 2) * 0.1,
        Math.cos(time * 1.5) * 0.1,
        Math.sin(time * 1.7) * 0.1
      );
    } else {
      // Move toward target
      targetDirection.normalize();
      desiredVelocity = targetDirection.multiplyScalar(flightParams.maxSpeed);
      
      // Add some randomness for erratic movement
      if (flightState === 'darting' || flightState === 'evasive') {
        const randomness = new THREE.Vector3(
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2,
          (Math.random() - 0.5) * 2
        ).multiplyScalar(0.5);
        desiredVelocity.add(randomness);
      }
    }

    // Smooth velocity changes
    velocity.lerp(desiredVelocity, flightParams.agility);

    // Update position
    const newPosition = currentPosition.clone().add(velocity.clone().multiplyScalar(deltaTime));
    
    // Boundary constraints with smooth bouncing
    if (newPosition.x < bounds.x[0] || newPosition.x > bounds.x[1]) {
      velocity.x *= -0.8;
      newPosition.x = THREE.MathUtils.clamp(newPosition.x, bounds.x[0], bounds.x[1]);
    }
    if (newPosition.y < bounds.y[0] || newPosition.y > bounds.y[1]) {
      velocity.y *= -0.8;
      newPosition.y = THREE.MathUtils.clamp(newPosition.y, bounds.y[0], bounds.y[1]);
    }
    if (newPosition.z < bounds.z[0] || newPosition.z > bounds.z[1]) {
      velocity.z *= -0.8;
      newPosition.z = THREE.MathUtils.clamp(newPosition.z, bounds.z[0], bounds.z[1]);
    }

    snitchRef.current.position.copy(newPosition);

    // Orient the Snitch to face movement direction
    if (velocity.length() > 0.1) {
      const direction = velocity.clone().normalize();
      const targetQuaternion = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, 1),
        direction
      );
      snitchRef.current.quaternion.slerp(targetQuaternion, 0.1);
    }

    // Add slight bobbing motion
    const time = state.clock.getElapsedTime();
    const bobOffset = Math.sin(time * 6) * 0.02;
    snitchRef.current.position.y += bobOffset;
  });

  return (
    <group ref={snitchRef} scale={scale}>
      {/* Golden Snitch Body */}
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial
          color="#FFD700"
          metalness={0.9}
          roughness={0.1}
          emissive="#FFD700"
          emissiveIntensity={0.1}
        />
      </mesh>

      {/* Body details - central band */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.1, 0.01, 8, 16]} />
        <meshStandardMaterial
          color="#FFA500"
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Wings */}
      <group>
        <Wing 
          side="left" 
          flapIntensity={flightParams.flapIntensity} 
          flapSpeed={flightParams.flapSpeed} 
        />
        <Wing 
          side="right" 
          flapIntensity={flightParams.flapIntensity} 
          flapSpeed={flightParams.flapSpeed} 
        />
      </group>

      {/* Subtle point light for magical glow */}
      <pointLight
        position={[0, 0, 0]}
        color="#FFD700"
        intensity={0.2}
        distance={2}
        decay={2}
      />

      {/* Wing trail particles (subtle magical effect) */}
      <group>
        <mesh position={[-0.2, 0, -0.1]}>
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
        <mesh position={[0.2, 0, -0.1]}>
          <sphereGeometry args={[0.01, 4, 4]} />
          <meshStandardMaterial
            color="#FFD700"
            emissive="#FFD700"
            emissiveIntensity={0.5}
            transparent
            opacity={0.6}
          />
        </mesh>
      </group>
    </group>
  );
}