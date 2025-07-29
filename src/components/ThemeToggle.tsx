'use client';

import React, { useEffect, useState } from 'react';

import { useTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className,
  size = 'md',
  showLabels = true,
}) => {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme, isSlytherin, isGryffindor } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading state during hydration
  if (!mounted) {
    return (
      <div className={cn('flex flex-col items-center gap-2', className)}>
        <div className="animate-pulse bg-gray-600 rounded-full h-10 w-20" />
      </div>
    );
  }

  const sizeClasses = {
    sm: {
      container: 'h-8 w-16',
      slider: 'h-6 w-6',
      text: 'text-xs',
    },
    md: {
      container: 'h-10 w-20',
      slider: 'h-8 w-8',
      text: 'text-sm',
    },
    lg: {
      container: 'h-12 w-24',
      slider: 'h-10 w-10',
      text: 'text-base',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      {showLabels && (
        <div className="flex items-center justify-between w-full max-w-xs">
          <span
            className={cn(
              'font-cinzel font-medium transition-all duration-300',
              currentSize.text,
              isSlytherin
                ? 'text-slytherin-400 scale-110 glow-sm'
                : 'text-gray-500 scale-100',
            )}
          >
            Slytherin
          </span>
          <span
            className={cn(
              'font-cinzel font-medium transition-all duration-300',
              currentSize.text,
              isGryffindor
                ? 'text-gryffindor-400 scale-110 glow-sm'
                : 'text-gray-500 scale-100',
            )}
          >
            Gryffindor
          </span>
        </div>
      )}

      <button
        onClick={toggleTheme}
        className={cn(
          'relative rounded-full p-1 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent',
          currentSize.container,
          'glass magical-button',
          isSlytherin
            ? 'bg-gradient-to-r from-slytherin-600 to-slytherinGreen-600 focus:ring-slytherin-400 shadow-glow'
            : 'bg-gradient-to-r from-gryffindor-600 to-gryffindorGold-600 focus:ring-gryffindor-400 shadow-glow',
        )}
        aria-label={`Switch to ${isSlytherin ? 'Gryffindor' : 'Slytherin'} theme`}
        title={`Current theme: ${theme}. Click to switch.`}
      >
        {/* House Symbols Background */}
        <div className="absolute inset-0 flex items-center justify-between px-2 text-xs opacity-50">
          <span className="font-bold">🐍</span>
          <span className="font-bold">🦁</span>
        </div>

        {/* Sliding Indicator */}
        <div
          className={cn(
            'relative rounded-full shadow-magical transition-all duration-300 ease-in-out',
            currentSize.slider,
            'bg-gradient-to-br from-white to-gray-100 border border-white/20',
            'flex items-center justify-center text-lg',
            isSlytherin ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          {/* Active House Symbol */}
          <span
            className={cn(
              'transition-all duration-300 font-bold',
              isSlytherin ? 'text-slytherinGreen-700' : 'text-gryffindor-700',
            )}
          >
            {isSlytherin ? '🐍' : '🦁'}
          </span>

          {/* Magical Sparkle Effect */}
          <div
            className={cn(
              'absolute inset-0 rounded-full animate-pulse transition-colors duration-300',
              isSlytherin
                ? 'bg-slytherinGreen-400/20'
                : 'bg-gryffindorGold-400/20',
            )}
          />
        </div>

        {/* Magical Glow Effect */}
        <div
          className={cn(
            'absolute inset-0 rounded-full transition-all duration-300 pointer-events-none',
            'bg-gradient-to-r opacity-0 hover:opacity-20',
            isSlytherin
              ? 'from-slytherinGreen-400 to-slytherin-400'
              : 'from-gryffindorGold-400 to-gryffindor-400',
          )}
        />
      </button>

      {/* Theme Name Display */}
      {showLabels && (
        <div className="text-center">
          <span
            className={cn(
              'font-philosopher font-medium uppercase tracking-wider transition-all duration-300',
              currentSize.text,
              'magical-text',
            )}
          >
            {theme} House
          </span>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;