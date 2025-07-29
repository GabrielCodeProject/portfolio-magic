'use client';

import React, { useEffect, useState } from 'react';

import { useSafeTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface HeroProps {
  className?: string;
}

export const Hero: React.FC<HeroProps> = ({ className }) => {
  const { isSlytherin, isGryffindor, theme } = useSafeTheme();
  const [particles, setParticles] = useState<Array<{left: number, top: number, delay: number, duration: number}>>([]);

  // Generate particles on client side to avoid hydration mismatch
  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.8,
      duration: 8 + Math.random() * 4,
    }));
    setParticles(newParticles);
  }, []);

  // House crest SVG components
  const SlytherinCrest = () => (
    <svg
      viewBox="0 0 120 140"
      className={cn(
        'w-full h-full fill-current transition-all duration-500',
        isSlytherin ? 'text-green-400' : 'text-gray-500 opacity-50'
      )}
    >
      {/* Shield background */}
      <path
        d="M60 10 L100 30 L100 90 Q100 120 60 130 Q20 120 20 90 L20 30 Z"
        className="fill-slate-800 stroke-current stroke-2"
      />
      
      {/* Serpent design */}
      <path
        d="M40 50 Q50 40 60 50 Q70 40 80 50 Q70 60 60 50 Q50 60 40 50"
        className="fill-current opacity-80"
      />
      <path
        d="M45 70 Q55 60 65 70 Q75 60 85 70 Q75 80 65 70 Q55 80 45 70"
        className="fill-current opacity-60"
      />
      <circle cx="50" cy="45" r="2" className="fill-red-400" />
      <circle cx="70" cy="45" r="2" className="fill-red-400" />
      
      {/* Banner */}
      <rect x="30" y="100" width="60" height="15" className="fill-current opacity-90" />
      <text x="60" y="110" className="fill-slate-800 text-xs font-bold text-anchor-middle">
        SLYTHERIN
      </text>
    </svg>
  );

  const GryffindorCrest = () => (
    <svg
      viewBox="0 0 120 140"
      className={cn(
        'w-full h-full fill-current transition-all duration-500',
        isGryffindor ? 'text-red-400' : 'text-gray-500 opacity-50'
      )}
    >
      {/* Shield background */}
      <path
        d="M60 10 L100 30 L100 90 Q100 120 60 130 Q20 120 20 90 L20 30 Z"
        className="fill-slate-800 stroke-current stroke-2"
      />
      
      {/* Lion design */}
      <circle cx="60" cy="55" r="15" className="fill-current opacity-80" />
      <path
        d="M45 50 Q50 45 55 50 Q60 45 65 50 Q70 45 75 50"
        className="fill-current opacity-90"
      />
      <circle cx="55" cy="50" r="2" className="fill-amber-400" />
      <circle cx="65" cy="50" r="2" className="fill-amber-400" />
      <path
        d="M55 60 Q60 65 65 60"
        className="stroke-current stroke-2 fill-none"
      />
      
      {/* Mane effect */}
      <path
        d="M40 40 Q50 35 60 40 Q70 35 80 40 Q70 50 60 45 Q50 50 40 40"
        className="fill-amber-400 opacity-60"
      />
      
      {/* Banner */}
      <rect x="25" y="100" width="70" height="15" className="fill-current opacity-90" />
      <text x="60" y="110" className="fill-slate-800 text-xs font-bold text-anchor-middle">
        GRYFFINDOR
      </text>
    </svg>
  );

  return (
    <section className={cn('relative min-h-screen flex items-center justify-center overflow-hidden', className)}>
      {/* Background magical effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-theme-bg-primary via-theme-bg-secondary to-theme-bg-primary" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className={cn(
              'absolute w-1 h-1 rounded-full animate-magical-drift',
              isSlytherin ? 'bg-green-400' : 'bg-red-400',
              'opacity-30'
            )}
            style={{
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* House Crests */}
        <div className="flex justify-center items-center mb-8 lg:mb-12">
          <div className="flex items-center gap-8 md:gap-16">
            {/* Slytherin Crest */}
            <div
              className={cn(
                'w-20 h-24 md:w-28 md:h-32 lg:w-32 lg:h-36 transition-all duration-700',
                'animate-magical-levitate cursor-pointer',
                isSlytherin
                  ? 'scale-110 drop-shadow-[0_0_20px_rgba(34,197,94,0.6)] animate-magical-glow-pulse'
                  : 'scale-90 hover:scale-100'
              )}
            >
              <SlytherinCrest />
            </div>

            {/* VS separator */}
            <div className="text-2xl md:text-4xl font-cinzel font-bold text-theme-text-muted animate-magical-pulse">
              VS
            </div>

            {/* Gryffindor Crest */}
            <div
              className={cn(
                'w-20 h-24 md:w-28 md:h-32 lg:w-32 lg:h-36 transition-all duration-700',
                'animate-magical-levitate cursor-pointer',
                isGryffindor
                  ? 'scale-110 drop-shadow-[0_0_20px_rgba(239,68,68,0.6)] animate-magical-glow-pulse'
                  : 'scale-90 hover:scale-100'
              )}
              style={{ animationDelay: '1s' }}
            >
              <GryffindorCrest />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-6 lg:space-y-8">
          {/* Main Title */}
          <h1 className="font-cinzel text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
            <span className="magical-text animate-magical-shimmer">
              Gabriel's Magical
            </span>
            <br />
            <span className="text-theme-text-primary">
              Portfolio
            </span>
          </h1>

          {/* Subtitle */}
          <p className="font-philosopher text-lg sm:text-xl md:text-2xl text-theme-text-secondary max-w-3xl mx-auto leading-relaxed">
            Welcome to a world where{' '}
            <span className={cn(
              'font-semibold',
              isSlytherin ? 'text-green-400' : 'text-red-400'
            )}>
              code meets magic
            </span>
            . Choose your house and embark on a journey through innovative web development, 
            where every pixel is enchanted and every interaction tells a story.
          </p>

          {/* Current House Display */}
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full glass border border-theme-border-primary">
            <span className="text-2xl">
              {isSlytherin ? '🐍' : '🦁'}
            </span>
            <span className="font-cinzel font-semibold text-theme-text-primary">
              House {theme.charAt(0).toUpperCase() + theme.slice(1)}
            </span>
            <div className={cn(
              'w-2 h-2 rounded-full animate-magical-pulse',
              isSlytherin ? 'bg-green-400' : 'bg-red-400'
            )} />
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <button className="btn-base btn-primary magical-button group px-8 py-4 text-lg font-semibold">
              <span className="relative z-10">Explore My Work</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
            
            <button className="btn-base btn-secondary magical-hover px-8 py-4 text-lg font-semibold border-2 border-theme-border-accent">
              About the Wizard
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-magical-float">
            <div className="flex flex-col items-center gap-2 text-theme-text-muted">
              <span className="text-sm font-philosopher">Scroll to discover</span>
              <div className={cn(
                'w-6 h-10 border-2 rounded-full flex justify-center',
                'border-theme-border-primary'
              )}>
                <div className={cn(
                  'w-1 h-3 rounded-full mt-2 animate-magical-pulse',
                  isSlytherin ? 'bg-green-400' : 'bg-red-400'
                )} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Magical aura effect */}
      <div className={cn(
        'absolute inset-0 pointer-events-none',
        'bg-gradient-radial from-transparent via-transparent to-theme-bg-primary',
        'animate-magical-breathe opacity-30'
      )} />
    </section>
  );
};

export default Hero;