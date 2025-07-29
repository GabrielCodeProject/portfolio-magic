'use client';

import React, { useState, useEffect } from 'react';

interface PortraitsFallbackProps {
  count?: number;
  theme?: 'slytherin' | 'gryffindor' | 'default';
  enableInteractivity?: boolean;
}

interface PortraitData {
  id: number;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
}

export default function PortraitsFallback({ 
  count = 6, 
  theme = 'default',
  enableInteractivity = true
}: PortraitsFallbackProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [scrollOffset, setScrollOffset] = useState(0);

  const primaryColor = theme === 'slytherin' 
    ? 'emerald' 
    : theme === 'gryffindor' 
    ? 'red' 
    : 'amber';
  const secondaryColor = theme === 'slytherin' 
    ? 'green' 
    : theme === 'gryffindor' 
    ? 'orange' 
    : 'orange';
  const frameColor = theme === 'slytherin' 
    ? 'gray-800' 
    : theme === 'gryffindor' 
    ? 'red-900' 
    : 'amber-900';

  // Pre-defined portrait positions for progressive enhancement (no Math.random)
  const predefinedPortraits: PortraitData[] = [
    { id: 0, position: { x: 20, y: 30 }, rotation: 0, scale: 0.9 },
    { id: 1, position: { x: 80, y: 45 }, rotation: 0, scale: 1.1 },
    { id: 2, position: { x: 50, y: 20 }, rotation: 0, scale: 0.8 },
    { id: 3, position: { x: 25, y: 65 }, rotation: 0, scale: 1.0 },
    { id: 4, position: { x: 15, y: 50 }, rotation: 5, scale: 0.95 },
    { id: 5, position: { x: 85, y: 35 }, rotation: -5, scale: 0.85 },
    { id: 6, position: { x: 10, y: 75 }, rotation: 10, scale: 1.05 },
    { id: 7, position: { x: 90, y: 60 }, rotation: -10, scale: 0.9 },
  ];

  const portraits = predefinedPortraits.slice(0, count);

  // Mouse tracking
  useEffect(() => {
    if (!enableInteractivity) return;

    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX / window.innerWidth,
        y: event.clientY / window.innerHeight,
      });
    };

    const handleScroll = () => {
      setScrollOffset(window.scrollY);
    };

    // Throttle events for performance
    let mouseMoveTimeout: NodeJS.Timeout | undefined;
    const throttledMouseMove = (event: MouseEvent) => {
      if (mouseMoveTimeout) return;
      mouseMoveTimeout = setTimeout(() => {
        handleMouseMove(event);
        mouseMoveTimeout = undefined;
      }, 16);
    };

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
  }, [enableInteractivity]);

  return (
    <div className="relative w-full h-96 overflow-hidden bg-gradient-to-b from-gray-900 to-black">
      {portraits.map((portrait) => {
        const animationDelay = portrait.id * 0.3;
        const eyeOffsetX = enableInteractivity 
          ? (mousePosition.x - 0.5) * 8 
          : 0;
        const eyeOffsetY = enableInteractivity 
          ? (mousePosition.y - 0.5) * 8 
          : 0;
        const scrollInfluence = enableInteractivity 
          ? scrollOffset * 0.02 * Math.sin(portrait.id) : 0;

        return (
          <div
            key={portrait.id}
            className="absolute group cursor-pointer"
            style={{
              left: `${portrait.position.x}%`,
              top: `${portrait.position.y}%`,
              transform: `translate(-50%, -50%) scale(${portrait.scale}) rotate(${portrait.rotation + scrollInfluence}deg)`,
              animationDelay: `${animationDelay}s`,
            }}
          >
            {/* Portrait Frame */}
            <div className={`relative w-24 h-32 bg-${frameColor} rounded-sm shadow-2xl transform transition-all duration-500 hover:scale-110 hover:shadow-xl group-hover:shadow-${primaryColor}-400/30 animate-float-portrait`}>
              {/* Frame border */}
              <div className={`absolute inset-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-sm border border-${primaryColor}-600/30`}>
                
                {/* Portrait background */}
                <div className="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-sm overflow-hidden">
                  
                  {/* Magical overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-br from-${primaryColor}-500/20 to-transparent animate-pulse-slow`} />
                  
                  {/* Portrait content area */}
                  <div className="relative w-full h-full flex flex-col items-center justify-center">
                    
                    {/* Eyes that follow cursor */}
                    <div className="flex space-x-3 mb-2">
                      <div 
                        className={`w-2 h-2 bg-${secondaryColor}-400 rounded-full shadow-lg transition-transform duration-150 animate-glow-${secondaryColor}`}
                        style={{
                          transform: `translate(${eyeOffsetX * 0.5}px, ${eyeOffsetY * 0.5}px)`,
                        }}
                      />
                      <div 
                        className={`w-2 h-2 bg-${secondaryColor}-400 rounded-full shadow-lg transition-transform duration-150 animate-glow-${secondaryColor}`}
                        style={{
                          transform: `translate(${eyeOffsetX * 0.5}px, ${eyeOffsetY * 0.5}px)`,
                        }}
                      />
                    </div>
                    
                    {/* Mystical floating elements */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div 
                        className={`absolute w-1 h-1 bg-${primaryColor}-400 rounded-full animate-float-mystical opacity-80`}
                        style={{ 
                          right: '20%', 
                          top: '40%',
                          animationDelay: `${animationDelay + 0.5}s`,
                        }}
                      />
                      <div 
                        className={`absolute w-0.5 h-0.5 bg-${secondaryColor}-400 rounded-full animate-float-mystical opacity-60`}
                        style={{ 
                          left: '25%', 
                          top: '55%',
                          animationDelay: `${animationDelay + 1}s`,
                        }}
                      />
                      <div 
                        className={`absolute w-1.5 h-1.5 bg-${primaryColor}-400 rounded-full animate-float-mystical opacity-70`}
                        style={{ 
                          left: '60%', 
                          bottom: '30%',
                          animationDelay: `${animationDelay + 1.5}s`,
                        }}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Frame decorations */}
                <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-4 h-1 bg-${primaryColor}-600 rounded-full`} />
                <div className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1 w-4 h-1 bg-${primaryColor}-600 rounded-full`} />
                
                {/* Corner ornaments */}
                <div className={`absolute -top-1 -left-1 w-2 h-2 bg-${secondaryColor}-500 rounded-full animate-pulse-slow`} />
                <div className={`absolute -top-1 -right-1 w-2 h-2 bg-${secondaryColor}-500 rounded-full animate-pulse-slow`} />
                <div className={`absolute -bottom-1 -left-1 w-2 h-2 bg-${secondaryColor}-500 rounded-full animate-pulse-slow`} />
                <div className={`absolute -bottom-1 -right-1 w-2 h-2 bg-${secondaryColor}-500 rounded-full animate-pulse-slow`} />
              </div>
              
              {/* Hover glow effect */}
              <div className={`absolute inset-0 bg-${primaryColor}-400/20 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-sm`} />
            </div>
          </div>
        );
      })}
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float-portrait {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          25% { transform: translateY(-2px) rotate(0.5deg); }
          50% { transform: translateY(-1px) rotate(-0.3deg); }
          75% { transform: translateY(-3px) rotate(0.2deg); }
        }
        
        @keyframes float-mystical {
          0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.8; }
          25% { transform: translateY(-3px) translateX(1px) scale(1.1); opacity: 1; }
          50% { transform: translateY(-1px) translateX(-1px) scale(0.9); opacity: 0.6; }
          75% { transform: translateY(-4px) translateX(2px) scale(1.05); opacity: 0.9; }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        @keyframes glow-emerald {
          0%, 100% { box-shadow: 0 0 4px rgb(52 211 153 / 0.6); }
          50% { box-shadow: 0 0 8px rgb(52 211 153 / 0.8), 0 0 12px rgb(52 211 153 / 0.4); }
        }
        
        @keyframes glow-amber {
          0%, 100% { box-shadow: 0 0 4px rgb(251 191 36 / 0.6); }
          50% { box-shadow: 0 0 8px rgb(251 191 36 / 0.8), 0 0 12px rgb(251 191 36 / 0.4); }
        }
        
        .animate-float-portrait {
          animation: float-portrait 3s ease-in-out infinite;
        }
        
        .animate-float-mystical {
          animation: float-mystical 4s ease-in-out infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-glow-emerald {
          animation: glow-emerald 2s ease-in-out infinite;
        }
        
        .animate-glow-amber {
          animation: glow-amber 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}