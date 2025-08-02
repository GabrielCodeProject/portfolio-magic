'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { useSafeTheme } from '@/components/ThemeProvider';

// =====================================================
// FALLBACK COMPONENT INTERFACES
// =====================================================

interface FallbackBaseProps {
  className?: string;
  children?: React.ReactNode;
  reason?: 'webgl-unsupported' | 'reduced-motion' | 'performance' | 'device-limitation';
}

interface FloatingCandlesFallbackProps extends FallbackBaseProps {
  count?: number;
  spread?: number;
  enableParticles?: boolean;
}

interface MovingPortraitsFallbackProps extends FallbackBaseProps {
  count?: number;
  enableEyeTracking?: boolean;
}

interface GoldenSnitchFallbackProps extends FallbackBaseProps {
  enableTrail?: boolean;
  enableFlightPath?: boolean;
}

// =====================================================
// FLOATING CANDLES 2D FALLBACK
// =====================================================

export const FloatingCandlesFallback: React.FC<FloatingCandlesFallbackProps> = ({
  className,
  count = 6,
  spread = 8,
  enableParticles = true,
  reason = 'webgl-unsupported'
}) => {
  const { isSlytherin } = useSafeTheme();
  
  // Generate candle positions
  const candles = React.useMemo(() => {
    const candleArray = [];
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2 + Math.random() * (spread - 2);
      const x = 50 + (Math.cos(angle) * radius * 3); // Convert to %
      const y = 50 + (Math.sin(angle) * radius * 2);
      
      candleArray.push({
        id: i,
        x: Math.max(10, Math.min(90, x)), // Keep within bounds
        y: Math.max(10, Math.min(90, y)),
        delay: Math.random() * 3,
        scale: 0.8 + Math.random() * 0.4,
      });
    }
    return candleArray;
  }, [count, spread]);

  return (
    <div 
      className={cn(
        'fixed inset-0 pointer-events-none overflow-hidden',
        className
      )}
      role="img"
      aria-label="Magical floating candles background effect"
    >
      {/* Background magical gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-theme-accent/5 to-theme-primary/5" />
      
      {/* Candles */}
      {candles.map((candle) => (
        <div
          key={candle.id}
          className="absolute"
          style={{
            left: `${candle.x}%`,
            top: `${candle.y}%`,
            transform: `scale(${candle.scale})`,
            animationDelay: `${candle.delay}s`,
          }}
        >
          {/* Candle Body */}
          <div className="relative">
            {/* Light glow effect */}
            <div 
              className={cn(
                'absolute -top-2 -left-2 w-8 h-8 rounded-full opacity-60 animate-magical-pulse',
                isSlytherin ? 'bg-green-400/30' : 'bg-amber-400/30'
              )}
              style={{ 
                animationDelay: `${candle.delay}s`,
                filter: 'blur(8px)'
              }}
            />
            
            {/* Candle stick */}
            <div className="relative w-3 h-8 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-sm mx-auto">
              {/* Wax drips */}
              <div className="absolute -left-0.5 top-6 w-1 h-2 bg-yellow-50 rounded-full opacity-80" />
              <div className="absolute -right-0.5 top-4 w-0.5 h-1.5 bg-yellow-50 rounded-full opacity-60" />
            </div>
            
            {/* Flame */}
            <div 
              className={cn(
                'absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-3 rounded-full animate-magical-flicker',
                isSlytherin ? 'bg-green-400' : 'bg-amber-400'
              )}
              style={{ 
                animationDelay: `${candle.delay}s`,
                boxShadow: `0 0 8px ${isSlytherin ? '#10b981' : '#f59e0b'}`
              }}
            />
            
            {/* Floating animation */}
            <div 
              className="absolute inset-0 animate-magical-float"
              style={{ animationDelay: `${candle.delay * 0.5}s` }}
            />
          </div>
          
          {/* Particle effects */}
          {enableParticles && (
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
              {[0, 1, 2].map((particle) => (
                <div
                  key={particle}
                  className={cn(
                    'absolute w-0.5 h-0.5 rounded-full animate-magical-sparkle',
                    isSlytherin ? 'bg-green-300' : 'bg-amber-300'
                  )}
                  style={{
                    left: `${(particle - 1) * 8}px`,
                    top: `${-particle * 4}px`,
                    animationDelay: `${candle.delay + particle * 0.5}s`,
                    animationDuration: '2s',
                  }}
                />
              ))}
            </div>
          )}
        </div>
      ))}
      
      {/* Ambient particle system */}
      {enableParticles && (
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'absolute w-1 h-1 rounded-full opacity-20 animate-magical-drift',
                isSlytherin ? 'bg-green-400' : 'bg-amber-400'
              )}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`,
                animationDuration: `${6 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// =====================================================
// MOVING PORTRAITS 2D FALLBACK
// =====================================================

export const MovingPortraitsFallback: React.FC<MovingPortraitsFallbackProps> = ({
  className,
  count = 4,
  enableEyeTracking = true,
  reason = 'webgl-unsupported'
}) => {
  const { isSlytherin } = useSafeTheme();
  const [mousePosition, setMousePosition] = React.useState({ x: 0.5, y: 0.5 });
  
  // Mouse tracking for eye movement
  React.useEffect(() => {
    if (!enableEyeTracking || reason === 'reduced-motion') return;
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    
    const throttledMouseMove = throttle(handleMouseMove, 100);
    window.addEventListener('mousemove', throttledMouseMove);
    
    return () => window.removeEventListener('mousemove', throttledMouseMove);
  }, [enableEyeTracking, reason]);
  
  // Portrait configurations
  const portraits = React.useMemo(() => [
    { x: 15, y: 20, rotation: -2, scale: 0.9 },
    { x: 75, y: 15, rotation: 1, scale: 1.1 },
    { x: 25, y: 70, rotation: -1, scale: 0.8 },
    { x: 80, y: 75, rotation: 2, scale: 1.0 },
  ].slice(0, count), [count]);

  return (
    <div 
      className={cn(
        'fixed inset-0 pointer-events-none overflow-hidden',
        className
      )}
      role="img"
      aria-label="Magical moving portraits background effect"
    >
      {portraits.map((portrait, index) => (
        <div
          key={index}
          className="absolute transform transition-transform duration-500"
          style={{
            left: `${portrait.x}%`,
            top: `${portrait.y}%`,
            transform: `rotate(${portrait.rotation}deg) scale(${portrait.scale})`,
          }}
        >
          {/* Portrait Frame */}
          <div 
            className={cn(
              'relative w-24 h-32 rounded-lg shadow-xl border-4 overflow-hidden',
              'bg-gradient-to-br from-yellow-900 to-yellow-800',
              isSlytherin ? 'border-green-600' : 'border-amber-600'
            )}
          >
            {/* Frame decorations */}
            <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
              <div className={cn(
                'w-6 h-1 rounded-full',
                isSlytherin ? 'bg-green-400' : 'bg-amber-400'
              )} />
            </div>
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
              <div className={cn(
                'w-6 h-1 rounded-full',
                isSlytherin ? 'bg-green-400' : 'bg-amber-400'
              )} />
            </div>
            
            {/* Portrait Background */}
            <div className="absolute inset-2 bg-gradient-to-br from-gray-800 to-gray-900 rounded">
              {/* Magical gradient overlay */}
              <div 
                className={cn(
                  'absolute inset-0 opacity-20 rounded',
                  isSlytherin ? 'bg-green-400' : 'bg-amber-400'
                )}
              />
              
              {/* Eyes that follow cursor */}
              {enableEyeTracking && reason !== 'reduced-motion' && (
                <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2">
                  <div className="flex space-x-3">
                    {/* Left eye */}
                    <div className="relative w-2 h-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <div 
                        className={cn(
                          'absolute top-0.5 w-1 h-1 rounded-full transition-transform duration-300',
                          isSlytherin ? 'bg-green-400' : 'bg-amber-400'
                        )}
                        style={{
                          left: `${0.25 + (mousePosition.x - 0.5) * 0.3}rem`,
                          transform: `translateY(${(mousePosition.y - 0.5) * 0.2}rem)`
                        }}
                      />
                    </div>
                    
                    {/* Right eye */}
                    <div className="relative w-2 h-2">
                      <div className="w-2 h-2 bg-gray-300 rounded-full" />
                      <div 
                        className={cn(
                          'absolute top-0.5 w-1 h-1 rounded-full transition-transform duration-300',
                          isSlytherin ? 'bg-green-400' : 'bg-amber-400'
                        )}
                        style={{
                          left: `${0.25 + (mousePosition.x - 0.5) * 0.3}rem`,
                          transform: `translateY(${(mousePosition.y - 0.5) * 0.2}rem)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {/* Mystical floating elements */}
              <div className="absolute inset-0">
                {[0, 1, 2].map((orb) => (
                  <div
                    key={orb}
                    className={cn(
                      'absolute w-1 h-1 rounded-full animate-magical-pulse opacity-60',
                      isSlytherin ? 'bg-green-300' : 'bg-amber-300'
                    )}
                    style={{
                      left: `${20 + orb * 25}%`,
                      top: `${60 + orb * 10}%`,
                      animationDelay: `${orb * 0.7}s`,
                      animationDuration: '3s',
                    }}
                  />
                ))}
              </div>
            </div>
            
            {/* Hover animation */}
            <div className="absolute inset-0 animate-magical-breathe opacity-80" />
          </div>
        </div>
      ))}
    </div>
  );
};

// =====================================================
// GOLDEN SNITCH 2D FALLBACK
// =====================================================

export const GoldenSnitchFallback: React.FC<GoldenSnitchFallbackProps> = ({
  className,
  enableTrail = true,
  enableFlightPath = true,
  reason = 'webgl-unsupported'
}) => {
  const { isSlytherin } = useSafeTheme();
  const [position, setPosition] = React.useState({ x: 50, y: 50 });
  const [isActive, setIsActive] = React.useState(true);
  
  // Animate snitch movement
  React.useEffect(() => {
    if (reason === 'reduced-motion') {
      setIsActive(false);
      return;
    }
    
    const interval = setInterval(() => {
      setPosition(prev => ({
        x: Math.max(10, Math.min(90, prev.x + (Math.random() - 0.5) * 20)),
        y: Math.max(10, Math.min(90, prev.y + (Math.random() - 0.5) * 15)),
      }));
    }, 2000);
    
    return () => clearInterval(interval);
  }, [reason]);

  return (
    <div 
      className={cn(
        'fixed inset-0 pointer-events-none overflow-hidden',
        className
      )}
      role="img"
      aria-label="Golden Snitch magical background effect"
    >
      {/* Flight path */}
      {enableFlightPath && isActive && (
        <svg 
          className="absolute inset-0 w-full h-full opacity-20"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            d="M20,20 Q50,80 80,20 Q20,60 60,80 Q80,40 40,60"
            stroke={isSlytherin ? '#10b981' : '#f59e0b'}
            strokeWidth="0.2"
            fill="none"
            strokeDasharray="2,2"
            className="animate-magical-shimmer"
          />
        </svg>
      )}
      
      {/* Golden Snitch */}
      <div
        className={cn(
          'absolute transition-all duration-2000 ease-in-out',
          isActive ? 'animate-magical-levitate' : ''
        )}
        style={{
          left: `${position.x}%`,
          top: `${position.y}%`,
          transform: 'translate(-50%, -50%)',
        }}
      >
        {/* Trail effect */}
        {enableTrail && isActive && (
          <div className="absolute inset-0">
            {[0, 1, 2].map((trail) => (
              <div
                key={trail}
                className={cn(
                  'absolute w-2 h-2 rounded-full opacity-40 animate-magical-fade',
                  isSlytherin ? 'bg-green-400' : 'bg-amber-400'
                )}
                style={{
                  left: `${-trail * 8}px`,
                  top: `${trail * 2}px`,
                  animationDelay: `${trail * 0.2}s`,
                  filter: 'blur(1px)',
                }}
              />
            ))}
          </div>
        )}
        
        {/* Snitch body */}
        <div className="relative">
          {/* Glow effect */}
          <div 
            className={cn(
              'absolute -inset-2 rounded-full opacity-60 animate-magical-pulse',
              isSlytherin ? 'bg-green-400/30' : 'bg-amber-400/30'
            )}
            style={{ filter: 'blur(6px)' }}
          />
          
          {/* Main body */}
          <div 
            className={cn(
              'w-6 h-6 rounded-full shadow-lg relative',
              isSlytherin ? 'bg-gradient-to-br from-green-300 to-green-500' : 'bg-gradient-to-br from-amber-300 to-amber-500'
            )}
          >
            {/* Body band */}
            <div 
              className={cn(
                'absolute top-1/2 left-0 right-0 h-0.5 transform -translate-y-1/2',
                isSlytherin ? 'bg-green-600' : 'bg-amber-600'
              )}
            />
          </div>
          
          {/* Wings */}
          <div className="absolute top-1/2 transform -translate-y-1/2">
            {/* Left wing */}
            <div 
              className={cn(
                'absolute -left-4 w-3 h-2 rounded-full opacity-70 transform -rotate-12',
                reason === 'reduced-motion' ? '' : 'animate-magical-flicker',
                'bg-gradient-to-r from-gray-300 to-white'
              )}
              style={{ 
                clipPath: 'ellipse(80% 100% at 100% 50%)',
                animationDuration: '0.5s'
              }}
            />
            
            {/* Right wing */}
            <div 
              className={cn(
                'absolute -right-4 w-3 h-2 rounded-full opacity-70 transform rotate-12',
                reason === 'reduced-motion' ? '' : 'animate-magical-flicker',
                'bg-gradient-to-l from-gray-300 to-white'
              )}
              style={{ 
                clipPath: 'ellipse(80% 100% at 0% 50%)',
                animationDuration: '0.5s',
                animationDelay: '0.1s'
              }}
            />
          </div>
          
          {/* Sparkles */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'absolute w-0.5 h-0.5 rounded-full animate-magical-sparkle',
                isSlytherin ? 'bg-green-200' : 'bg-amber-200'
              )}
              style={{
                left: `${-8 + i * 4}px`,
                top: `${-4 + (i % 2) * 8}px`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: '2s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// =====================================================
// UNIVERSAL FALLBACK NOTIFICATION
// =====================================================

interface FallbackNotificationProps {
  reason: 'webgl-unsupported' | 'reduced-motion' | 'performance' | 'device-limitation';
  onDismiss?: () => void;
  showDetails?: boolean;
  className?: string;
}

export const FallbackNotification: React.FC<FallbackNotificationProps> = ({
  reason,
  onDismiss,
  showDetails = false,
  className
}) => {
  const { isSlytherin } = useSafeTheme();
  const [isVisible, setIsVisible] = React.useState(true);
  
  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };
  
  const getNotificationContent = () => {
    switch (reason) {
      case 'webgl-unsupported':
        return {
          title: 'Enchanted Mode Unavailable',
          message: 'Your device doesn\'t support advanced magical effects, but the experience remains fully functional.',
          icon: '🔮',
          details: 'WebGL is required for 3D magical elements.'
        };
      case 'reduced-motion':
        return {
          title: 'Calm Magic Mode',
          message: 'Respecting your motion preferences - magical elements are displayed in a gentle, static form.',
          icon: '🕊️',
          details: 'Animations are reduced based on your accessibility settings.'
        };
      case 'performance':
        return {
          title: 'Optimized Magic',
          message: 'Using lightweight magical effects to ensure smooth performance on your device.',
          icon: '⚡',
          details: 'Performance mode enabled for better experience.'
        };
      case 'device-limitation':
        return {
          title: 'Compatible Magic',
          message: 'Magical effects adapted for your device capabilities while maintaining full functionality.',
          icon: '📱',
          details: 'Device limitations detected - using optimized fallbacks.'
        };
      default:
        return {
          title: 'Alternative Magic',
          message: 'Using alternative magical effects for the best possible experience.',
          icon: '✨',
          details: 'Fallback mode active.'
        };
    }
  };
  
  if (!isVisible) return null;
  
  const content = getNotificationContent();
  
  return (
    <div 
      className={cn(
        'fixed top-4 right-4 z-50 max-w-sm',
        'glass rounded-lg p-4 shadow-xl',
        'border border-theme-border-primary',
        'animate-magical-card-entrance',
        className
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start space-x-3">
        <div className="text-2xl animate-magical-pulse">
          {content.icon}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className={cn(
            'font-heading text-sm font-semibold',
            isSlytherin ? 'text-green-400' : 'text-amber-400'
          )}>
            {content.title}
          </div>
          
          <div className="text-xs text-theme-text-secondary mt-1 leading-relaxed">
            {content.message}
          </div>
          
          {showDetails && (
            <div className="text-xs text-theme-text-muted mt-2 italic">
              {content.details}
            </div>
          )}
        </div>
        
        <button
          onClick={handleDismiss}
          className={cn(
            'text-theme-text-muted hover:text-theme-text-primary',
            'transition-colors duration-200 text-lg leading-none',
            'hover:scale-110 transform transition-transform'
          )}
          aria-label="Dismiss notification"
        >
          ×
        </button>
      </div>
    </div>
  );
};

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Throttle function for performance
function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastExecTime = 0;
  
  return function (this: any, ...args: Parameters<T>) {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func.apply(this, args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(this, args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  };
}

// CSS animation classes for magical fade effect
const magicalFadeStyles = `
@keyframes magical-fade {
  0% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
  100% { opacity: 0; transform: scale(0.6); }
}

.animate-magical-fade {
  animation: magical-fade 1s ease-out forwards;
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = magicalFadeStyles;
  document.head.appendChild(styleElement);
}