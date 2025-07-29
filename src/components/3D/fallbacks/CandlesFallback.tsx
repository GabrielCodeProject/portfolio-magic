'use client';

import React from 'react';

interface CandlesFallbackProps {
  count?: number;
  theme?: 'slytherin' | 'gryffindor' | 'default';
}

export default function CandlesFallback({ 
  count = 8, 
  theme = 'default' 
}: CandlesFallbackProps) {
  const candles = Array.from({ length: count }, (_, i) => i);
  
  const flameColor = theme === 'slytherin' 
    ? 'from-emerald-400 to-emerald-600' 
    : theme === 'gryffindor' 
    ? 'from-red-400 to-orange-600' 
    : 'from-amber-400 to-orange-600';
  const glowColor = theme === 'slytherin' 
    ? 'shadow-emerald-400/50' 
    : theme === 'gryffindor' 
    ? 'shadow-red-400/50' 
    : 'shadow-amber-400/50';

  // Pre-defined positions and variations for progressive enhancement
  const predefinedVariations = [
    { delay: 0, duration: 2.2, size: 0.9, x: -80, y: -20 },
    { delay: 0.2, duration: 2.8, size: 1.1, x: 70, y: 30 },
    { delay: 0.4, duration: 2.5, size: 0.8, x: -40, y: 60 },
    { delay: 0.6, duration: 2.7, size: 1.0, x: 90, y: -40 },
    { delay: 0.8, duration: 2.3, size: 0.95, x: -60, y: -70 },
    { delay: 1.0, duration: 2.6, size: 0.85, x: 50, y: 80 },
    { delay: 1.2, duration: 2.4, size: 1.05, x: -90, y: 10 },
    { delay: 1.4, duration: 2.9, size: 0.9, x: 20, y: -60 },
  ];

  return (
    <div className="relative w-full h-64 flex items-center justify-center overflow-hidden">
      {candles.map((_, index) => {
        const variation = predefinedVariations[index % predefinedVariations.length];
        const { delay, duration, size, x, y } = variation;
        
        return (
          <div
            key={index}
            className="absolute transform"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: `scale(${size})`,
              animationDelay: `${delay}s`,
            }}
          >
            {/* Candle Body */}
            <div className="relative flex flex-col items-center">
              <div 
                className="w-3 h-16 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-sm shadow-sm animate-float"
                style={{
                  animationDuration: `${duration}s`,
                  animationDelay: `${delay}s`,
                }}
              >
                {/* Wax Drip */}
                <div className="absolute -left-0.5 top-12 w-1.5 h-2 bg-yellow-50 rounded-full opacity-80" />
              </div>
              
              {/* Wick */}
              <div className="w-0.5 h-1 bg-gray-800 rounded-full -mt-px" />
              
              {/* Flame */}
              <div 
                className={`w-2 h-3 bg-gradient-to-t ${flameColor} rounded-full ${glowColor} shadow-lg animate-flicker -mt-0.5`}
                style={{
                  animationDuration: `${0.5 + Math.random() * 0.5}s`,
                  animationDelay: `${delay}s`,
                }}
              />
              
              {/* Glow Effect */}
              <div 
                className={`absolute top-14 w-6 h-6 bg-gradient-radial ${flameColor} rounded-full opacity-30 blur-sm animate-pulse`}
                style={{
                  animationDuration: `${1 + Math.random() * 0.5}s`,
                  animationDelay: `${delay}s`,
                }}
              />
            </div>
          </div>
        );
      })}
      
      {/* Background ambiance */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black/20 pointer-events-none" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { left: 15, top: 25, delay: 0.5 },
          { left: 75, top: 15, delay: 1.2 },
          { left: 35, top: 70, delay: 2.1 },
          { left: 85, top: 55, delay: 0.8 },
          { left: 25, top: 85, delay: 1.8 },
          { left: 65, top: 40, delay: 2.5 },
          { left: 45, top: 10, delay: 1.5 },
          { left: 5, top: 60, delay: 2.2 },
          { left: 95, top: 75, delay: 0.9 },
          { left: 55, top: 90, delay: 1.7 },
          { left: 10, top: 35, delay: 2.8 },
          { left: 80, top: 80, delay: 1.1 },
        ].map((particle, i) => (
          <div
            key={`particle-${i}`}
            className={`absolute w-1 h-1 ${
              theme === 'slytherin' ? 'bg-emerald-400' : 
              theme === 'gryffindor' ? 'bg-red-400' : 
              'bg-amber-400'
            } rounded-full opacity-60 animate-float-particle`}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: '4s',
            }}
          />
        ))}
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-4px) rotate(0.5deg); }
          50% { transform: translateY(-2px) rotate(-0.5deg); }
          75% { transform: translateY(-6px) rotate(0.2deg); }
        }
        
        @keyframes flicker {
          0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.9; }
          25% { transform: scaleY(1.1) scaleX(0.95); opacity: 1; }
          50% { transform: scaleY(0.95) scaleX(1.05); opacity: 0.85; }
          75% { transform: scaleY(1.05) scaleX(0.9); opacity: 0.95; }
        }
        
        @keyframes float-particle {
          0% { transform: translateY(0px) translateX(0px) opacity(0); }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-20px) translateX(5px); opacity: 0; }
        }
        
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
        
        .animate-flicker {
          animation: flicker 0.5s ease-in-out infinite alternate;
        }
        
        .animate-float-particle {
          animation: float-particle 4s linear infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
      `}</style>
    </div>
  );
}