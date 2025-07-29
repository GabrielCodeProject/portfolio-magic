// Magical Utilities for Text Effects and Gradients

import { cn } from './utils';

// Magical gradient presets
export const MAGICAL_GRADIENTS = {
  // Theme-based gradients
  slytherin: 'bg-gradient-to-r from-slytherin-500 via-slytherinGreen-500 to-slytherinSilver-400',
  gryffindor: 'bg-gradient-to-r from-gryffindor-500 via-gryffindorGold-500 to-gryffindorGold-400',
  
  // Magical element gradients
  fire: 'bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400',
  water: 'bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400',
  earth: 'bg-gradient-to-r from-green-700 via-green-500 to-lime-400',
  air: 'bg-gradient-to-r from-gray-400 via-blue-300 to-white',
  
  // Mystical gradients
  aurora: 'bg-gradient-to-r from-purple-500 via-pink-500 to-green-400',
  sunset: 'bg-gradient-to-r from-orange-500 via-red-500 to-purple-600',
  ocean: 'bg-gradient-to-r from-blue-600 via-teal-500 to-cyan-400',
  forest: 'bg-gradient-to-r from-green-800 via-green-600 to-lime-500',
  
  // Magical artifact gradients
  golden: 'bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-400',
  silver: 'bg-gradient-to-r from-gray-300 via-gray-100 to-white',
  copper: 'bg-gradient-to-r from-orange-600 via-amber-600 to-red-500',
  crystal: 'bg-gradient-to-r from-purple-300 via-pink-200 to-blue-200',
  
  // Animated gradients (for use with shimmer effect)
  shimmer: 'bg-gradient-to-r from-transparent via-white/20 to-transparent',
  glow: 'bg-gradient-radial from-yellow-400/30 via-orange-400/20 to-transparent',
} as const;

export type MagicalGradient = keyof typeof MAGICAL_GRADIENTS;

// Text effect utilities
export const createMagicalText = (
  text: string,
  effect: 'shimmer' | 'glow' | 'typewriter' | 'enchanted' = 'shimmer',
  gradient: MagicalGradient = 'golden'
): string => {
  const baseClasses = 'font-heading font-bold';
  const gradientClass = MAGICAL_GRADIENTS[gradient];
  
  const effects = {
    shimmer: 'magical-text animate-magical-shimmer bg-clip-text text-transparent',
    glow: 'animate-magical-text-glow',
    typewriter: 'animate-magical-typewriter',
    enchanted: 'magical-text-hover',
  };
  
  return cn(baseClasses, gradientClass, effects[effect]);
};

// Magical background utilities
export const createMagicalBackground = (
  variant: 'subtle' | 'intense' | 'animated' = 'subtle',
  theme: 'light' | 'dark' = 'dark'
): string => {
  const base = theme === 'dark' 
    ? 'bg-gradient-to-br from-theme-bg-primary to-theme-bg-secondary'
    : 'bg-gradient-to-br from-gray-50 to-white';
  
  const variants = {
    subtle: base,
    intense: cn(base, 'relative before:absolute before:inset-0 before:bg-magical-stars before:opacity-30'),
    animated: cn(base, 'animate-magical-breathe'),
  };
  
  return variants[variant];
};

// Magical border utilities
export const createMagicalBorder = (
  style: 'glow' | 'shimmer' | 'enchanted' = 'glow',
  color: 'theme' | 'gold' | 'silver' | 'crystal' = 'theme'
): string => {
  const baseClasses = 'border-2 rounded-lg';
  
  const colors = {
    theme: 'border-theme-accent',
    gold: 'border-yellow-400',
    silver: 'border-gray-300',
    crystal: 'border-purple-300',
  };
  
  const styles = {
    glow: 'animate-magical-glow-pulse shadow-glow',
    shimmer: 'animate-magical-shimmer',
    enchanted: 'magical-hover-glow',
  };
  
  return cn(baseClasses, colors[color], styles[style]);
};

// Magical card utilities
export const createMagicalCard = (
  variant: 'glass' | 'parchment' | 'crystal' | 'shadow' = 'glass',
  interactive: boolean = true
): string => {
  const baseClasses = 'rounded-lg p-6 transition-all duration-300';
  
  const variants = {
    glass: 'glass border border-theme-border-primary backdrop-blur-magical',
    parchment: 'parchment border border-amber-200 bg-magical-paper text-magical-ink',
    crystal: 'bg-gradient-to-br from-purple-100/10 to-pink-100/10 border border-purple-200/20 backdrop-blur-sm',
    shadow: 'bg-theme-bg-card border border-theme-border-primary shadow-magical',
  };
  
  const interactiveClass = interactive ? 'magical-card cursor-pointer' : '';
  
  return cn(baseClasses, variants[variant], interactiveClass);
};

// Magical button utilities
export const createMagicalButton = (
  variant: 'primary' | 'secondary' | 'enchanted' | 'ghost' = 'primary',
  size: 'sm' | 'md' | 'lg' = 'md',
  magical: boolean = false
): string => {
  const baseClasses = 'btn-base inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'btn-primary magical-button',
    secondary: 'btn-secondary',
    enchanted: 'magical-button-enchanted',
    ghost: 'bg-transparent border border-theme-border-primary text-theme-text-secondary hover:bg-theme-bg-card',
  };
  
  const sizes = {
    sm: 'btn-sm px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'btn-lg px-6 py-3 text-base',
  };
  
  const magicalClass = magical ? 'magical-hover-intense animate-magical-glow-pulse' : '';
  
  return cn(baseClasses, variants[variant], sizes[size], magicalClass);
};

// CSS variable generators for dynamic theming
export const generateMagicalGlow = (
  color: string,
  intensity: 'low' | 'medium' | 'high' = 'medium'
): React.CSSProperties => {
  const intensities = {
    low: '0.2',
    medium: '0.4',
    high: '0.6',
  };
  
  return {
    boxShadow: `0 0 20px ${color}${intensities[intensity]}, 0 0 40px ${color}${intensities[intensity]}`,
  };
};

export const generateMagicalGradient = (
  colors: string[],
  direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' = 'to-r'
): React.CSSProperties => {
  const colorStops = colors.join(', ');
  return {
    background: `linear-gradient(${direction.replace('to-', '')}, ${colorStops})`,
  };
};

// Animation delay utilities
export const getRandomDelay = (min: number = 0, max: number = 3): number => {
  return Math.random() * (max - min) + min;
};

export const staggerDelay = (index: number, increment: number = 0.1): number => {
  return index * increment;
};

// Magical particle utilities
export const generateParticleConfig = (
  type: 'sparkles' | 'embers' | 'stars' | 'bubbles' = 'sparkles'
) => {
  const configs = {
    sparkles: {
      count: 30,
      size: 'sm' as const,
      color: 'gold' as const,
      speed: 'normal' as const,
    },
    embers: {
      count: 15,
      size: 'md' as const,
      color: 'ember' as const,
      speed: 'slow' as const,
    },
    stars: {
      count: 50,
      size: 'sm' as const,
      color: 'frost' as const,
      speed: 'slow' as const,
    },
    bubbles: {
      count: 20,
      size: 'lg' as const,
      color: 'purple' as const,
      speed: 'normal' as const,
    },
  };
  
  return configs[type];
};

// Theme-aware utilities
export const getMagicalThemeColor = (
  theme: 'slytherin' | 'gryffindor',
  variant: 'primary' | 'secondary' | 'accent' = 'primary'
): string => {
  const colors = {
    slytherin: {
      primary: '#1a5490',
      secondary: '#2d5016',
      accent: '#6c757d',
    },
    gryffindor: {
      primary: '#740001',
      secondary: '#eab308',
      accent: '#fbbf24',
    },
  };
  
  return colors[theme][variant];
};

// Performance utilities for magical effects
export const shouldUseReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const getMagicalAnimationClass = (
  animation: string,
  respectMotionPreference: boolean = true
): string => {
  if (respectMotionPreference && shouldUseReducedMotion()) {
    return ''; // Return no animation class if user prefers reduced motion
  }
  return animation;
};

// Utility to create CSS custom properties for magical effects
export const createMagicalCSSProperties = (
  properties: Record<string, string | number>
): React.CSSProperties => {
  const cssProps: Record<string, string> = {};
  Object.entries(properties).forEach(([key, value]) => {
    cssProps[`--magical-${key}`] = typeof value === 'number' ? `${value}px` : value;
  });
  return cssProps as React.CSSProperties;
};