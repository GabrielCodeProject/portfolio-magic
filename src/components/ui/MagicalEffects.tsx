import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

// Floating Particles Component
export interface FloatingParticlesProps {
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'gold' | 'ember' | 'frost' | 'purple';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  count = 20,
  size = 'md',
  color = 'gold',
  speed = 'normal',
  className,
}) => {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; left: number }>>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: count }, (_, i) => ({
      id: i,
      delay: Math.random() * 8,
      left: Math.random() * 100,
    }));
    setParticles(newParticles);
  }, [count]);

  const sizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  const colorClasses = {
    gold: 'bg-gradient-to-r from-yellow-400 to-amber-500',
    ember: 'bg-gradient-to-r from-orange-400 to-red-500',
    frost: 'bg-gradient-to-r from-blue-400 to-cyan-500',
    purple: 'bg-gradient-to-r from-purple-400 to-violet-500',
  };

  const speedClasses = {
    slow: 'animate-magical-particle-1',
    normal: 'animate-magical-particle-2',
    fast: 'animate-magical-sparkle',
  };

  return (
    <div className={cn('fixed inset-0 pointer-events-none z-0', className)}>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={cn(
            'absolute rounded-full opacity-60',
            sizeClasses[size],
            colorClasses[color],
            speedClasses[speed]
          )}
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

// Magical Sparkles Component
export interface MagicalSparklesProps {
  density?: 'low' | 'medium' | 'high';
  className?: string;
}

const MagicalSparkles: React.FC<MagicalSparklesProps> = ({
  density = 'medium',
  className,
}) => {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number; delay: number }>>([]);

  useEffect(() => {
    const counts = { low: 15, medium: 30, high: 50 };
    const count = counts[density];

    const newSparkles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 4 + 2,
      delay: Math.random() * 3,
    }));
    setSparkles(newSparkles);
  }, [density]);

  return (
    <div className={cn('absolute inset-0 pointer-events-none', className)}>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            animationDelay: `${sparkle.delay}s`,
          }}
        >
          <div
            className="animate-magical-sparkle opacity-40"
            style={{
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              background: 'radial-gradient(circle, var(--magical-shimmer) 0%, transparent 70%)',
              borderRadius: '50%',
            }}
          />
        </div>
      ))}
    </div>
  );
};

// Magical Aura Component
export interface MagicalAuraProps {
  variant?: 'gentle' | 'intense' | 'mystical';
  color?: 'theme' | 'gold' | 'purple' | 'frost';
  className?: string;
  children: React.ReactNode;
}

const MagicalAura: React.FC<MagicalAuraProps> = ({
  variant = 'gentle',
  color = 'theme',
  className,
  children,
}) => {
  const variants = {
    gentle: 'animate-magical-breathe',
    intense: 'animate-magical-glow-pulse',
    mystical: 'animate-magical-phase',
  };

  const colors = {
    theme: 'shadow-glow',
    gold: 'shadow-[0_0_30px_rgba(251,191,36,0.4)]',
    purple: 'shadow-[0_0_30px_rgba(147,51,234,0.4)]',
    frost: 'shadow-[0_0_30px_rgba(6,182,212,0.4)]',
  };

  return (
    <div className={cn('relative', variants[variant], colors[color], className)}>
      {children}
    </div>
  );
};

// Magical Trail Component
export interface MagicalTrailProps {
  trigger?: boolean;
  color?: 'gold' | 'purple' | 'frost' | 'ember';
  intensity?: 'subtle' | 'normal' | 'intense';
  className?: string;
  children: React.ReactNode;
}

const MagicalTrail: React.FC<MagicalTrailProps> = ({
  trigger = false,
  color = 'gold',
  intensity = 'normal',
  className,
  children,
}) => {
  const [trails, setTrails] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!trigger) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newTrail = { id: Date.now(), x, y };
    setTrails(prev => [...prev, newTrail].slice(-10)); // Keep last 10 trails

    setTimeout(() => {
      setTrails(prev => prev.filter(trail => trail.id !== newTrail.id));
    }, 1000);
  };

  const colors = {
    gold: 'bg-gradient-radial from-yellow-400/40 to-transparent',
    purple: 'bg-gradient-radial from-purple-400/40 to-transparent',
    frost: 'bg-gradient-radial from-cyan-400/40 to-transparent',
    ember: 'bg-gradient-radial from-orange-400/40 to-transparent',
  };

  const sizes = {
    subtle: 'w-4 h-4',
    normal: 'w-8 h-8',
    intense: 'w-12 h-12',
  };

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      onMouseMove={handleMouseMove}
    >
      {children}
      {trails.map((trail) => (
        <div
          key={trail.id}
          className={cn(
            'absolute pointer-events-none rounded-full animate-magical-phase',
            colors[color],
            sizes[intensity]
          )}
          style={{
            left: `${trail.x}%`,
            top: `${trail.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      ))}
    </div>
  );
};

// Enchanted Border Component
export interface EnchantedBorderProps {
  variant?: 'glow' | 'shimmer' | 'sparkle';
  thickness?: 'thin' | 'normal' | 'thick';
  color?: 'theme' | 'gold' | 'purple' | 'frost';
  className?: string;
  children: React.ReactNode;
}

const EnchantedBorder: React.FC<EnchantedBorderProps> = ({
  variant = 'glow',
  thickness = 'normal',
  color = 'theme',
  className,
  children,
}) => {
  const variants = {
    glow: 'animate-magical-glow-pulse',
    shimmer: 'animate-magical-shimmer',
    sparkle: 'animate-magical-sparkle',
  };

  const thicknesses = {
    thin: 'border',
    normal: 'border-2',
    thick: 'border-4',
  };

  const colors = {
    theme: 'border-theme-accent',
    gold: 'border-yellow-400',
    purple: 'border-purple-400',
    frost: 'border-cyan-400',
  };

  return (
    <div
      className={cn(
        'relative rounded-lg',
        thicknesses[thickness],
        colors[color],
        variants[variant],
        className
      )}
    >
      {children}
      <MagicalSparkles density="low" />
    </div>
  );
};

// Levitating Element Component
export interface LevitatingElementProps {
  intensity?: 'gentle' | 'normal' | 'strong';
  rotation?: boolean;
  className?: string;
  children: React.ReactNode;
}

const LevitatingElement: React.FC<LevitatingElementProps> = ({
  intensity = 'normal',
  rotation = false,
  className,
  children,
}) => {
  const intensities = {
    gentle: 'animate-magical-float',
    normal: 'animate-magical-levitate',
    strong: 'animate-magical-drift',
  };

  const rotationClass = rotation ? 'animate-magical-rotate' : '';

  return (
    <div className={cn(intensities[intensity], rotationClass, className)}>
      {children}
    </div>
  );
};

export {
  FloatingParticles,
  MagicalSparkles,
  MagicalAura,
  MagicalTrail,
  EnchantedBorder,
  LevitatingElement,
};