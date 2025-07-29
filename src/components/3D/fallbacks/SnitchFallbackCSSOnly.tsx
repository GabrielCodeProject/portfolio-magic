'use client';

import React from 'react';

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

export default function SnitchFallbackCSSOnly({
  bounds = {
    x: [10, 90],
    y: [10, 80]
  },
  speed = 1,
  scale = 1,
  theme = 'default',
  enableTrailEffects = true
}: SnitchFallbackProps) {
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

  return (
    <div className="relative w-full h-80 overflow-hidden bg-gradient-to-b from-indigo-900/20 to-purple-900/20">
      {/* Golden Snitch with CSS-only flight animation */}
      <div className="snitch-flight-path absolute" style={{ transform: `scale(${scale})` }}>
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
            className={`absolute w-3 h-4 bg-gradient-to-br ${wingColor} rounded-full opacity-80 animate-wing-flap origin-right`}
            style={{
              left: '-10px',
              top: '-8px',
              transformOrigin: 'right center',
              clipPath: 'ellipse(70% 100% at 30% 50%)',
            }}
          />
          
          {/* Right Wing */}
          <div 
            className={`absolute w-3 h-4 bg-gradient-to-br ${wingColor} rounded-full opacity-80 animate-wing-flap origin-left`}
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
            {[
              { left: -8, top: 0, delay: 0 },
              { left: -12, top: 1, delay: 0.1 },
              { left: -16, top: -1, delay: 0.2 },
            ].map((trail, i) => (
              <div
                key={i}
                className={`absolute w-1 h-1 bg-${
                  theme === 'slytherin' ? 'yellow-600' : 
                  theme === 'gryffindor' ? 'orange-400' : 
                  'yellow-400'
                } rounded-full animate-trail-particle opacity-60`}
                style={{
                  left: `${trail.left}px`,
                  top: `${trail.top}px`,
                  animationDelay: `${trail.delay}s`,
                  animationDuration: '0.8s',
                }}
              />
            ))}
          </div>
        )}

        {/* Magic sparkles around the snitch */}
        <div className="absolute inset-0 pointer-events-none">
          {[
            { left: -5, top: -5, delay: 0.5 },
            { left: 15, top: 8, delay: 1.2 },
            { left: 8, top: -15, delay: 2.1 },
            { left: -8, top: 12, delay: 1.8 },
          ].map((sparkle, i) => (
            <div
              key={`sparkle-${i}`}
              className={`absolute w-0.5 h-0.5 bg-${
                theme === 'slytherin' ? 'yellow-400' : 
                theme === 'gryffindor' ? 'orange-300' : 
                'yellow-300'
              } rounded-full animate-sparkle`}
              style={{
                left: `${sparkle.left}px`,
                top: `${sparkle.top}px`,
                animationDelay: `${sparkle.delay}s`,
                animationDuration: '1.5s',
              }}
            />
          ))}
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes snitch-flight {
          0% { left: 20%; top: 30%; transform: rotate(0deg) scale(${scale}); }
          12.5% { left: 80%; top: 20%; transform: rotate(45deg) scale(${scale}); }
          25% { left: 85%; top: 60%; transform: rotate(90deg) scale(${scale}); }
          37.5% { left: 70%; top: 80%; transform: rotate(135deg) scale(${scale}); }
          50% { left: 30%; top: 75%; transform: rotate(180deg) scale(${scale}); }
          62.5% { left: 10%; top: 65%; transform: rotate(225deg) scale(${scale}); }
          75% { left: 15%; top: 35%; transform: rotate(270deg) scale(${scale}); }
          87.5% { left: 40%; top: 15%; transform: rotate(315deg) scale(${scale}); }
          100% { left: 20%; top: 30%; transform: rotate(360deg) scale(${scale}); }
        }
        
        @keyframes wing-flap {
          0%, 100% { transform: rotateY(0deg) rotateZ(-30deg); }
          50% { transform: rotateY(0deg) rotateZ(-60deg); }
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
        
        .snitch-flight-path {
          animation: snitch-flight ${12 / speed}s ease-in-out infinite;
        }
        
        .animate-wing-flap {
          animation: wing-flap ${0.15 / speed}s ease-in-out infinite alternate;
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