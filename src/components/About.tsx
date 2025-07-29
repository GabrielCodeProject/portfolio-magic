'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useSafeTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface AboutProps {
  className?: string;
}

export const About: React.FC<AboutProps> = ({ className }) => {
  const { isSlytherin, isGryffindor, theme } = useSafeTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{left: number, top: number, delay: number, duration: number}>>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Generate particles on client side to avoid hydration mismatch
  useEffect(() => {
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 1.2,
      duration: 10 + Math.random() * 5,
    }));
    setParticles(newParticles);
  }, []);

  const stats = [
    { 
      value: '5+', 
      label: 'Years of Magic',
      description: 'Crafting digital spells'
    },
    { 
      value: '50+', 
      label: 'Spells Cast',
      description: 'Projects completed'
    },
    { 
      value: '100%', 
      label: 'House Loyalty',
      description: `Devoted ${theme}`
    },
    { 
      value: '∞', 
      label: 'Learning Quest',
      description: 'Always growing'
    },
  ];

  const skills = isSlytherin 
    ? [
        'Cunning Problem Solving',
        'Ambitious Architecture',
        'Strategic Planning',
        'Efficient Solutions',
        'Resource Optimization'
      ]
    : [
        'Brave Innovation',
        'Daring Development', 
        'Bold Leadership',
        'Courageous Challenges',
        'Noble Craftsmanship'
      ];

  return (
    <section
      id="about"
      ref={sectionRef}
      className={cn(
        'relative min-h-screen py-20 overflow-hidden',
        'bg-gradient-to-br from-theme-bg-primary via-theme-bg-secondary to-theme-bg-tertiary',
        className
      )}
    >
      {/* Magical Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle, i) => (
          <div
            key={i}
            className={cn(
              'absolute w-2 h-2 rounded-full animate-magical-drift opacity-20',
              isSlytherin ? 'bg-green-400' : 'bg-red-400'
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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className={cn(
            'font-cinzel text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
            'transition-all duration-1000 delay-300',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            <span className="magical-text animate-magical-shimmer">
              The Wizard's
            </span>
            <br />
            <span className="text-theme-text-primary">Tale</span>
          </h2>
          <p className={cn(
            'font-philosopher text-lg md:text-xl text-theme-text-secondary max-w-3xl mx-auto',
            'transition-all duration-1000 delay-500',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            Every great wizard has an origin story. Here's how magic and code 
            intertwined to create a digital sorcerer dedicated to crafting 
            extraordinary web experiences.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-20">
          {/* Magical Portrait Section */}
          <div className={cn(
            'text-center lg:text-left transition-all duration-1000 delay-700',
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
          )}>
            {/* Avatar Container */}
            <div className="relative inline-block mb-8">
              {/* Magical Aura */}
              <div className={cn(
                'absolute inset-0 rounded-full animate-magical-breathe',
                isSlytherin 
                  ? 'bg-gradient-to-br from-green-400/30 to-emerald-600/30'
                  : 'bg-gradient-to-br from-red-400/30 to-amber-600/30',
                'blur-xl scale-150'
              )} />
              
              {/* Avatar Circle */}
              <div className={cn(
                'relative w-48 h-48 md:w-56 md:h-56 rounded-full',
                'glass border-4 overflow-hidden animate-magical-levitate',
                isSlytherin 
                  ? 'border-green-400/50 shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                  : 'border-red-400/50 shadow-[0_0_30px_rgba(239,68,68,0.4)]'
              )}>
                {/* Placeholder Avatar - Could be replaced with actual image */}
                <div className={cn(
                  'w-full h-full flex items-center justify-center text-6xl md:text-7xl',
                  'bg-gradient-to-br from-theme-bg-card to-theme-bg-tertiary'
                )}>
                  🧙‍♂️
                </div>
                
                {/* Magical Overlay */}
                <div className={cn(
                  'absolute inset-0 rounded-full pointer-events-none',
                  'bg-gradient-to-br opacity-20',
                  isSlytherin 
                    ? 'from-green-400 to-transparent'
                    : 'from-red-400 to-transparent'
                )} />
              </div>

              {/* House Badge */}
              <div className={cn(
                'absolute -bottom-2 -right-2 w-16 h-16 rounded-full',
                'glass border-2 flex items-center justify-center animate-magical-pulse',
                isSlytherin 
                  ? 'border-green-400/50 bg-green-900/30'
                  : 'border-red-400/50 bg-red-900/30'
              )}>
                <span className="text-2xl">
                  {isSlytherin ? '🐍' : '🦁'}
                </span>
              </div>
            </div>

            {/* House Declaration */}
            <div className="space-y-4">
              <h3 className={cn(
                'font-cinzel text-2xl md:text-3xl font-bold',
                isSlytherin ? 'text-green-400' : 'text-red-400'
              )}>
                House {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </h3>
              <p className="font-philosopher text-theme-text-secondary">
                {isSlytherin 
                  ? '"Ambitious, cunning, and resourceful - crafting elegant solutions with strategic precision."'
                  : '"Brave, daring, and bold - pushing boundaries and taking on impossible challenges."'
                }
              </p>
            </div>
          </div>

          {/* Biography Content */}
          <div className={cn(
            'space-y-8 transition-all duration-1000 delay-900',
            isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
          )}>
            {/* Origin Story */}
            <div className="space-y-4">
              <h3 className="font-cinzel text-2xl font-semibold text-theme-text-primary">
                Origin Story
              </h3>
              <p className="font-philosopher text-theme-text-secondary leading-relaxed">
                Like many great wizards, my journey began with curiosity and a desire to create magic. 
                What started as tinkering with HTML spells evolved into mastering the dark arts of 
                JavaScript and the ancient runes of React. Each line of code became an incantation, 
                each project a new adventure in the ever-expanding universe of web development.
              </p>
            </div>

            {/* Current Quest */}
            <div className="space-y-4">
              <h3 className="font-cinzel text-2xl font-semibold text-theme-text-primary">
                Current Quest
              </h3>
              <p className="font-philosopher text-theme-text-secondary leading-relaxed">
                Currently on a mission to bridge the gap between stunning design and powerful 
                functionality. Specializing in creating immersive digital experiences that not 
                only look magical but perform flawlessly across all devices and platforms.
              </p>
            </div>

            {/* Magical Abilities */}
            <div className="space-y-4">
              <h3 className="font-cinzel text-2xl font-semibold text-theme-text-primary">
                Magical Abilities
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {skills.map((skill, index) => (
                  <div
                    key={skill}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-lg glass',
                      'border transition-all duration-300 hover:scale-105',
                      isSlytherin 
                        ? 'border-green-400/30 hover:border-green-400/50'
                        : 'border-red-400/30 hover:border-red-400/50'
                    )}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={cn(
                      'w-2 h-2 rounded-full animate-magical-pulse',
                      isSlytherin ? 'bg-green-400' : 'bg-red-400'
                    )} />
                    <span className="font-philosopher text-sm text-theme-text-secondary">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Magical Stats Section */}
        <div className={cn(
          'grid grid-cols-2 md:grid-cols-4 gap-6 transition-all duration-1000 delay-1100',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                'text-center p-6 rounded-lg glass border transition-all duration-500',
                'hover:scale-105 magical-hover group',
                isSlytherin 
                  ? 'border-green-400/30 hover:border-green-400/50'
                  : 'border-red-400/30 hover:border-red-400/50'
              )}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className={cn(
                'text-3xl md:text-4xl font-bold font-cinzel mb-2 transition-colors duration-300',
                'group-hover:text-theme-primary',
                isSlytherin ? 'text-green-400' : 'text-red-400'
              )}>
                {stat.value}
              </div>
              <div className="font-philosopher text-theme-text-primary text-sm md:text-base font-semibold mb-1">
                {stat.label}
              </div>
              <div className="font-philosopher text-theme-text-muted text-xs md:text-sm">
                {stat.description}
              </div>
              
              {/* Magical glow effect */}
              <div className={cn(
                'absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300',
                'bg-gradient-to-br pointer-events-none',
                isSlytherin 
                  ? 'from-green-400 to-emerald-600'
                  : 'from-red-400 to-amber-600'
              )} />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={cn(
          'text-center mt-16 transition-all duration-1000 delay-1300',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}>
          <p className="font-philosopher text-lg text-theme-text-secondary mb-8">
            Ready to embark on a magical journey together?
          </p>
          <button className={cn(
            'btn-base btn-primary magical-button group px-8 py-4 text-lg font-semibold',
            'relative overflow-hidden'
          )}>
            <span className="relative z-10">Let's Create Magic</span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          </button>
        </div>
      </div>

      {/* Bottom magical border */}
      <div className={cn(
        'absolute bottom-0 left-0 right-0 h-1',
        'bg-gradient-to-r',
        isSlytherin 
          ? 'from-transparent via-green-400 to-transparent'
          : 'from-transparent via-red-400 to-transparent',
        'animate-magical-shimmer'
      )} />
    </section>
  );
};

export default About;