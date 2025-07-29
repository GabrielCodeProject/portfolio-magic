'use client';

import React, { useEffect, useRef, useState } from 'react';

import { ServiceCard } from '@/components/ServiceCard';
import { useSafeTheme } from '@/components/ThemeProvider';
import { services } from '@/data/services';
import { cn } from '@/lib/utils';

interface ServicesProps {
  className?: string;
}

export const Services: React.FC<ServicesProps> = ({ className }) => {
  const { isSlytherin } = useSafeTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [backgroundParticles, setBackgroundParticles] = useState<Array<{
    left: number;
    top: number;
    delay: number;
    duration: number;
  }>>([]);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Generate background particles on client side to avoid hydration mismatch
  useEffect(() => {
    const newParticles = Array.from({ length: 12 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 1.2,
      duration: 15 + Math.random() * 10,
    }));
    setBackgroundParticles(newParticles);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative min-h-screen py-20 px-6 overflow-hidden',
        'bg-gradient-to-br from-theme-bg-secondary via-theme-bg-primary to-theme-bg-secondary',
        className
      )}
      id="services"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div 
          className={cn(
            'absolute w-80 h-80 rounded-full opacity-15 blur-3xl transition-all duration-1000',
            isSlytherin 
              ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
              : 'bg-gradient-to-r from-amber-500 to-orange-500',
            isVisible ? 'animate-pulse' : ''
          )}
          style={{ 
            top: '15%', 
            right: '10%',
            animationDuration: '12s'
          }}
        />
        <div 
          className={cn(
            'absolute w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-1000',
            isSlytherin 
              ? 'bg-gradient-to-r from-slytherinGreen-500 to-green-500' 
              : 'bg-gradient-to-r from-gryffindorGold-500 to-yellow-500',
            isVisible ? 'animate-pulse' : ''
          )}
          style={{ 
            bottom: '10%', 
            left: '5%',
            animationDuration: '15s',
            animationDelay: '3s'
          }}
        />

        {/* Floating Particles */}
        {backgroundParticles.map((particle, index) => (
          <div
            key={index}
            className={cn(
              'absolute w-2 h-2 rounded-full opacity-20 animate-bounce',
              isSlytherin ? 'bg-emerald-400' : 'bg-amber-400'
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

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div 
            className={cn(
              'inline-flex items-center gap-3 mb-6 transition-all duration-1000',
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            )}
          >
            <div 
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-lg',
                isSlytherin 
                  ? 'bg-emerald-600/20 text-emerald-400' 
                  : 'bg-amber-600/20 text-amber-400'
              )}
            >
              🪄
            </div>
            <span 
              className={cn(
                'font-philosopher text-sm uppercase tracking-wider font-medium',
                isSlytherin ? 'text-emerald-400' : 'text-amber-400'
              )}
            >
              Magical Services
            </span>
          </div>

          <h2 
            className={cn(
              'font-cinzel text-4xl md:text-5xl font-bold mb-6 transition-all duration-1000',
              'text-theme-text-primary',
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '200ms' }}
          >
            Transform Ideas Into{' '}
            <span 
              className={cn(
                'magical-text bg-gradient-to-r bg-clip-text text-transparent',
                isSlytherin 
                  ? 'from-emerald-400 to-teal-400' 
                  : 'from-amber-400 to-orange-400'
              )}
            >
              Digital Magic
            </span>
          </h2>

          <p 
            className={cn(
              'font-philosopher text-lg text-theme-text-secondary max-w-3xl mx-auto leading-relaxed transition-all duration-1000',
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '400ms' }}
          >
            From concept to digital reality, I offer a comprehensive suite of magical services 
            to bring your wildest technological dreams to life. Whether you need a stunning website, 
            an immersive 3D experience, or strategic guidance, every spell is cast with precision and purpose.
          </p>
        </div>

        {/* Services Grid */}
        <div 
          className={cn(
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000',
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          )}
          style={{ transitionDelay: '600ms' }}
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.id}
              service={service}
              index={index}
              className="h-full"
            />
          ))}
        </div>

        {/* Call to Action */}
        <div 
          className={cn(
            'text-center mt-16 transition-all duration-1000',
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          )}
          style={{ transitionDelay: '800ms' }}
        >
          <div className="glass p-8 rounded-xl max-w-2xl mx-auto">
            <h3 className="font-cinzel text-2xl font-semibold text-theme-text-primary mb-4">
              Ready to Begin Your Digital Quest?
            </h3>
            <p className="font-philosopher text-theme-text-secondary mb-6">
              Every great project starts with a conversation. Let&apos;s discuss your vision 
              and discover how we can transform your ideas into extraordinary digital experiences 
              that captivate, engage, and deliver results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#contact"
                className={cn(
                  'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300',
                  'magical-button hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  isSlytherin
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 focus:ring-emerald-400'
                    : 'bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:from-amber-500 hover:to-orange-500 focus:ring-amber-400'
                )}
              >
                <span>Start Your Project</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <a
                href="#projects"
                className={cn(
                  'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300',
                  'border-2 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'bg-transparent hover:bg-theme-bg-tertiary',
                  isSlytherin
                    ? 'border-emerald-500 text-emerald-400 hover:border-emerald-400 focus:ring-emerald-400'
                    : 'border-amber-500 text-amber-400 hover:border-amber-400 focus:ring-amber-400'
                )}
              >
                <span>View My Work</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-theme-border to-transparent" />
    </section>
  );
};

export default Services;