'use client';

import React, { useState, useEffect } from 'react';

interface SnitchFallbackProps {
  bounds?: {
    x: [number, number];
    y: [number, number];
  };
  speed?: number;
  scale?: number;
  theme?: 'slytherin' | 'gryffindor' | 'default';
  enableTrailEffects?: boolean;
}

type FlightState = 'searching' | 'darting' | 'hovering' | 'evasive';

export default function SnitchFallback({
  bounds = {
    x: [10, 90], // Percentage-based bounds
    y: [10, 80]
  },
  speed = 1,
  scale = 1,
  theme = 'default',
  enableTrailEffects = true
}: SnitchFallbackProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 });
  const [target, setTarget] = useState({ x: 50, y: 50 });
  const [flightState, setFlightState] = useState<FlightState>('searching');
  const [stateTimer, setStateTimer] = useState(0);
  const [velocity, setVelocity] = useState({ x: 0, y: 0 });

  const bodyColor = theme === 'slytherin' 
    ? 'from-yellow-600 to-yellow-700' 
    : theme === 'gryffindor' 
    ? 'from-yellow-400 to-orange-500'
    : 'from-yellow-400 to-yellow-500';
  const wingColor = theme === 'slytherin' 
    ? 'from-yellow-600 to-amber-700' 
    : theme === 'gryffindor' 
    ? 'from-orange-300 to-red-400'
    : 'from-yellow-300 to-amber-400';
  const glowColor = theme === 'slytherin' 
    ? 'shadow-yellow-600/50' 
    : theme === 'gryffindor' 
    ? 'shadow-orange-400/60'
    : 'shadow-yellow-400/60';

  // Generate new random target within bounds
  const generateNewTarget = () => {
    const newTarget = {
      x: bounds.x[0] + Math.random() * (bounds.x[1] - bounds.x[0]),
      y: bounds.y[0] + Math.random() * (bounds.y[1] - bounds.y[0])
    };
    setTarget(newTarget);
  };

  // Flight parameters based on state
  const getFlightParams = () => {
    switch (flightState) {
      case 'searching':
        return { maxSpeed: 0.8 * speed, agility: 0.03 };
      case 'darting':
        return { maxSpeed: 2.5 * speed, agility: 0.08 };
      case 'hovering':
        return { maxSpeed: 0.1 * speed, agility: 0.01 };
      case 'evasive':
        return { maxSpeed: 3 * speed, agility: 0.1 };
      default:
        return { maxSpeed: 0.8 * speed, agility: 0.03 };
    }
  };

  // Animation loop
  useEffect(() => {
    const interval = setInterval(() => {
      setStateTimer(prev => prev + 0.016); // ~60fps

      // State transitions
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
        }
      }

      setPosition(prevPosition => {
        const targetDirection = {
          x: target.x - prevPosition.x,
          y: target.y - prevPosition.y
        };
        const distanceToTarget = Math.sqrt(targetDirection.x ** 2 + targetDirection.y ** 2);

        // Generate new target if close or timer expired
        if (distanceToTarget < 2 || stateTimer > 8) {
          generateNewTarget();
          setStateTimer(0);
        }

        const params = getFlightParams();
        let desiredVelocity = { x: 0, y: 0 };

        if (flightState === 'hovering') {
          // Small circular movements while hovering
          const time = Date.now() * 0.002;
          desiredVelocity = {
            x: Math.sin(time * 2) * 0.5,
            y: Math.cos(time * 1.5) * 0.5
          };
        } else {
          // Move toward target
          const distance = Math.sqrt(targetDirection.x ** 2 + targetDirection.y ** 2);
          if (distance > 0) {
            desiredVelocity = {
              x: (targetDirection.x / distance) * params.maxSpeed,
              y: (targetDirection.y / distance) * params.maxSpeed
            };

            // Add randomness for erratic movement
            if (flightState === 'darting' || flightState === 'evasive') {
              desiredVelocity.x += (Math.random() - 0.5) * 1;
              desiredVelocity.y += (Math.random() - 0.5) * 1;
            }
          }
        }

        // Smooth velocity changes (lerp)
        setVelocity(prevVelocity => ({
          x: prevVelocity.x + (desiredVelocity.x - prevVelocity.x) * params.agility,
          y: prevVelocity.y + (desiredVelocity.y - prevVelocity.y) * params.agility
        }));

        // Update position with boundary constraints
        const newPosition = {
          x: Math.max(bounds.x[0], Math.min(bounds.x[1], prevPosition.x + velocity.x)),
          y: Math.max(bounds.y[0], Math.min(bounds.y[1], prevPosition.y + velocity.y))
        };

        // Bounce off boundaries
        if (newPosition.x <= bounds.x[0] || newPosition.x >= bounds.x[1]) {
          setVelocity(prev => ({ ...prev, x: prev.x * -0.8 }));
        }
        if (newPosition.y <= bounds.y[0] || newPosition.y >= bounds.y[1]) {
          setVelocity(prev => ({ ...prev, y: prev.y * -0.8 }));
        }

        return newPosition;
      });
    }, 16);

    return () => clearInterval(interval);
  }, [target, flightState, stateTimer, velocity, bounds, speed]);

  // Calculate rotation based on velocity
  const rotation = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI);

  // Wing flap intensity based on flight state
  const flapIntensity = flightState === 'darting' ? 'animate-flap-fast' : 
                       flightState === 'hovering' ? 'animate-flap-slow' : 
                       'animate-flap-normal';

  return (
    <div className="relative w-full h-80 overflow-hidden bg-gradient-to-b from-indigo-900/20 to-purple-900/20">
      {/* Golden Snitch */}
      <div
        className="absolute transform transition-all duration-75 ease-linear"
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: `translate(-50%, -50%) scale(${scale}) rotate(${rotation}deg)`,
        }}
      >
        {/* Snitch Body */}
        <div className={`relative w-4 h-4 bg-gradient-to-br ${bodyColor} rounded-full ${glowColor} shadow-lg animate-golden-pulse`}>
          {/* Central band detail */}
          <div className="absolute inset-0 border border-yellow-600 rounded-full opacity-60" />
          <div className="absolute top-1/2 left-0 right-0 h-px bg-yellow-600 transform -translate-y-1/2" />
          
          {/* Body glow effect */}
          <div className={`absolute inset-0 bg-gradient-radial ${bodyColor} rounded-full opacity-60 blur-sm animate-pulse`} />
        </div>

        {/* Wings */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {/* Left Wing */}
          <div 
            className={`absolute w-3 h-4 bg-gradient-to-br ${wingColor} rounded-full opacity-80 ${flapIntensity} origin-right`}
            style={{
              left: '-10px',
              top: '-8px',
              transformOrigin: 'right center',
              clipPath: 'ellipse(70% 100% at 30% 50%)',
            }}
          />
          
          {/* Right Wing */}
          <div 
            className={`absolute w-3 h-4 bg-gradient-to-br ${wingColor} rounded-full opacity-80 ${flapIntensity} origin-left`}
            style={{
              right: '-10px',
              top: '-8px',
              transformOrigin: 'left center',
              clipPath: 'ellipse(70% 100% at 70% 50%)',
              animationDelay: '0.05s',
            }}
          />
        </div>

        {/* Trail Effects */}
        {enableTrailEffects && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {Array.from({ length: 3 }, (_, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 bg-${
              theme === 'slytherin' ? 'yellow-600' : 
              theme === 'gryffindor' ? 'orange-400' : 
              'yellow-400'
            } rounded-full animate-trail-particle opacity-60`}
                style={{
                  left: `${-8 - i * 4}px`,
                  top: `${(Math.random() - 0.5) * 8}px`,
                  animationDelay: `${i * 0.1}s`,
                  animationDuration: '0.8s',
                }}
              />
            ))}
          </div>
        )}

        {/* Magic sparkles around the snitch */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 4 }, (_, i) => (
            <div
              key={`sparkle-${i}`}
              className={`absolute w-0.5 h-0.5 bg-${
                theme === 'slytherin' ? 'yellow-400' : 
                theme === 'gryffindor' ? 'orange-300' : 
                'yellow-300'
              } rounded-full animate-sparkle`}
              style={{
                left: `${Math.random() * 20 - 10}px`,
                top: `${Math.random() * 20 - 10}px`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Flight state indicator (optional, for debugging) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-2 left-2 text-xs text-yellow-400 bg-black/50 px-2 py-1 rounded">
          State: {flightState}
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes flap-fast {
          0%, 100% { transform: rotateY(0deg) rotateZ(-30deg); }
          50% { transform: rotateY(0deg) rotateZ(-80deg); }
        }
        
        @keyframes flap-normal {
          0%, 100% { transform: rotateY(0deg) rotateZ(-30deg); }
          50% { transform: rotateY(0deg) rotateZ(-60deg); }
        }
        
        @keyframes flap-slow {
          0%, 100% { transform: rotateY(0deg) rotateZ(-30deg); }
          50% { transform: rotateY(0deg) rotateZ(-45deg); }
        }
        
        @keyframes golden-pulse {
          0%, 100% { box-shadow: 0 0 8px rgba(251, 191, 36, 0.4); }
          50% { box-shadow: 0 0 16px rgba(251, 191, 36, 0.6), 0 0 24px rgba(251, 191, 36, 0.3); }
        }
        
        @keyframes trail-particle {
          0% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.3) translateX(-20px); }
        }
        
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
        
        .animate-flap-fast {
          animation: flap-fast 0.1s ease-in-out infinite alternate;
        }
        
        .animate-flap-normal {
          animation: flap-normal 0.15s ease-in-out infinite alternate;
        }
        
        .animate-flap-slow {
          animation: flap-slow 0.3s ease-in-out infinite alternate;
        }
        
        .animate-golden-pulse {
          animation: golden-pulse 2s ease-in-out infinite;
        }
        
        .animate-trail-particle {
          animation: trail-particle 0.8s linear infinite;
        }
        
        .animate-sparkle {
          animation: sparkle 1.5s ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}