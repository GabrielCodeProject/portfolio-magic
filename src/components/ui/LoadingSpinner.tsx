'use client';

import React from 'react';

import { useSafeTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  /**
   * Size variant of the spinner
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  
  /**
   * Visual variant of the spinner
   */
  variant?: 'circular' | 'dots' | 'orb' | 'magical' | 'snitch';
  
  /**
   * Optional text to display below the spinner
   */
  text?: string;
  
  /**
   * Custom className for styling
   */
  className?: string;
  
  /**
   * Color variant - defaults to theme colors
   */
  color?: 'theme' | 'gold' | 'silver' | 'emerald' | 'crimson';
  
  /**
   * Animation speed
   */
  speed?: 'slow' | 'normal' | 'fast';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  variant = 'circular',
  text,
  className,
  color = 'theme',
  speed = 'normal',
}) => {
  const { isSlytherin, isGryffindor } = useSafeTheme();

  // Size configurations
  const sizeClasses = {
    xs: {
      container: 'w-4 h-4',
      dot: 'w-1 h-1',
      text: 'text-xs mt-1',
      orb: 'w-4 h-4',
    },
    sm: {
      container: 'w-6 h-6',
      dot: 'w-1.5 h-1.5',
      text: 'text-sm mt-2',
      orb: 'w-6 h-6',
    },
    md: {
      container: 'w-8 h-8',
      dot: 'w-2 h-2',
      text: 'text-base mt-3',
      orb: 'w-8 h-8',
    },
    lg: {
      container: 'w-12 h-12',
      dot: 'w-3 h-3',
      text: 'text-lg mt-4',
      orb: 'w-12 h-12',
    },
    xl: {
      container: 'w-16 h-16',
      dot: 'w-4 h-4',
      text: 'text-xl mt-6',
      orb: 'w-16 h-16',
    },
  };

  // Color configurations based on theme and color prop
  const getColorClasses = () => {
    if (color === 'theme') {
      return isSlytherin
        ? {
            primary: 'border-green-500 text-green-400',
            gradient: 'from-green-400 to-emerald-500',
            glow: 'shadow-[0_0_20px_rgba(34,197,94,0.4)]',
            sparkle: 'bg-green-400',
          }
        : {
            primary: 'border-red-500 text-red-400',
            gradient: 'from-red-400 to-amber-500',
            glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
            sparkle: 'bg-red-400',
          };
    }

    const colorMap = {
      gold: {
        primary: 'border-yellow-500 text-yellow-400',
        gradient: 'from-yellow-400 to-amber-500',
        glow: 'shadow-[0_0_20px_rgba(251,191,36,0.4)]',
        sparkle: 'bg-yellow-400',
      },
      silver: {
        primary: 'border-gray-400 text-gray-300',
        gradient: 'from-gray-300 to-slate-400',
        glow: 'shadow-[0_0_20px_rgba(148,163,184,0.4)]',
        sparkle: 'bg-gray-400',
      },
      emerald: {
        primary: 'border-emerald-500 text-emerald-400',
        gradient: 'from-emerald-400 to-green-500',
        glow: 'shadow-[0_0_20px_rgba(34,197,94,0.4)]',
        sparkle: 'bg-emerald-400',
      },
      crimson: {
        primary: 'border-red-500 text-red-400',
        gradient: 'from-red-400 to-rose-500',
        glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]',
        sparkle: 'bg-red-400',
      },
    };

    return colorMap[color];
  };

  // Speed configurations
  const speedClasses = {
    slow: 'duration-2000',
    normal: 'duration-1000',
    fast: 'duration-500',
  };

  const currentSize = sizeClasses[size];
  const colors = getColorClasses();
  const currentSpeed = speedClasses[speed];

  // Circular Spinner (Classic rotating ring)
  const CircularSpinner = () => (
    <div
      className={cn(
        'animate-magical-rotate border-2 border-transparent rounded-full',
        currentSize.container,
        colors.primary,
        colors.glow,
        currentSpeed
      )}
      style={{
        borderTopColor: 'currentColor',
        borderRightColor: 'currentColor',
      }}
    />
  );

  // Dots Spinner (Three bouncing dots)
  const DotsSpinner = () => (
    <div className={cn('flex space-x-1', currentSize.container)}>
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'rounded-full animate-magical-pulse bg-gradient-to-r',
            currentSize.dot,
            colors.gradient,
            colors.glow
          )}
          style={{
            animationDelay: `${index * 0.2}s`,
            animationDuration: '1.2s',
          }}
        />
      ))}
    </div>
  );

  // Magical Orb Spinner (Pulsing orb with particles)
  const OrbSpinner = () => (
    <div className="relative">
      <div
        className={cn(
          'rounded-full bg-gradient-to-r animate-magical-breathe',
          currentSize.orb,
          colors.gradient,
          colors.glow
        )}
      />
      {/* Orbiting particles */}
      {[0, 1, 2].map((index) => (
        <div
          key={index}
          className={cn(
            'absolute top-1/2 left-1/2 w-1 h-1 rounded-full animate-magical-rotate',
            colors.sparkle
          )}
          style={{
            transformOrigin: size === 'xs' ? '12px 0' : size === 'sm' ? '18px 0' : size === 'md' ? '24px 0' : size === 'lg' ? '36px 0' : '48px 0',
            animationDelay: `${index * 0.33}s`,
            animationDuration: '2s',
          }}
        />
      ))}
    </div>
  );

  // Advanced Magical Spinner (Complex magical effect)
  const MagicalSpinner = () => (
    <div className="relative">
      {/* Main spinning circle */}
      <div
        className={cn(
          'rounded-full border-2 border-dashed animate-magical-rotate',
          currentSize.container,
          colors.primary,
          colors.glow
        )}
      />
      
      {/* Inner magical core */}
      <div
        className={cn(
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          'rounded-full bg-gradient-to-r animate-magical-pulse',
          size === 'xs' ? 'w-2 h-2' : size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-8 h-8',
          colors.gradient
        )}
      />
      
      {/* Magical sparkles */}
      {[0, 1, 2, 3, 4].map((index) => (
        <div
          key={index}
          className={cn(
            'absolute w-0.5 h-0.5 rounded-full animate-magical-sparkle',
            colors.sparkle
          )}
          style={{
            top: `${20 + Math.sin(index * 1.26) * 30}%`,
            left: `${20 + Math.cos(index * 1.26) * 30}%`,
            animationDelay: `${index * 0.3}s`,
          }}
        />
      ))}
    </div>
  );

  // Golden Snitch Spinner (Harry Potter themed)
  const SnitchSpinner = () => (
    <div className="relative">
      {/* Snitch body */}
      <div
        className={cn(
          'rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 animate-magical-levitate',
          currentSize.orb,
          'shadow-[0_0_20px_rgba(251,191,36,0.6)]'
        )}
      />
      
      {/* Wings */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full">
        <div
          className={cn(
            'bg-gradient-to-r from-gray-300 to-white rounded-full animate-magical-flicker',
            size === 'xs' ? 'w-2 h-1' : size === 'sm' ? 'w-3 h-1.5' : size === 'md' ? 'w-4 h-2' : size === 'lg' ? 'w-6 h-3' : 'w-8 h-4',
            'opacity-70'
          )}
          style={{ clipPath: 'ellipse(80% 100% at 100% 50%)' }}
        />
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full">
        <div
          className={cn(
            'bg-gradient-to-l from-gray-300 to-white rounded-full animate-magical-flicker',
            size === 'xs' ? 'w-2 h-1' : size === 'sm' ? 'w-3 h-1.5' : size === 'md' ? 'w-4 h-2' : size === 'lg' ? 'w-6 h-3' : 'w-8 h-4',
            'opacity-70'
          )}
          style={{ clipPath: 'ellipse(80% 100% at 0% 50%)' }}
        />
      </div>
      
      {/* Flight trail */}
      <div
        className={cn(
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          'bg-gradient-to-r from-yellow-400/40 to-transparent rounded-full animate-magical-rotate',
          size === 'xs' ? 'w-8 h-8' : size === 'sm' ? 'w-12 h-12' : size === 'md' ? 'w-16 h-16' : size === 'lg' ? 'w-24 h-24' : 'w-32 h-32'
        )}
        style={{ zIndex: -1 }}
      />
    </div>
  );

  // Render appropriate spinner variant
  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return <DotsSpinner />;
      case 'orb':
        return <OrbSpinner />;
      case 'magical':
        return <MagicalSpinner />;
      case 'snitch':
        return <SnitchSpinner />;
      default:
        return <CircularSpinner />;
    }
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div className="relative">
        {renderSpinner()}
      </div>
      
      {text && (
        <div
          className={cn(
            'font-philosopher text-center magical-text',
            currentSize.text,
            colors.primary
          )}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner;