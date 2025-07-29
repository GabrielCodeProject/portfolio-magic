'use client';

import React, { useEffect, useRef, useState } from 'react';

import { ProjectCard } from '@/components/ProjectCard';
import { useSafeTheme } from '@/components/ThemeProvider';
import { featuredProjects, nonFeaturedProjects, getAllProjects } from '@/data/projects';
import { cn } from '@/lib/utils';

interface ProjectsProps {
  className?: string;
}

export const Projects: React.FC<ProjectsProps> = ({ className }) => {
  const { isSlytherin, isGryffindor } = useSafeTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [isExpanding, setIsExpanding] = useState(false);
  const [backgroundParticles, setBackgroundParticles] = useState<Array<{
    left: number;
    top: number;
    delay: number;
    duration: number;
  }>>([]);
  const sectionRef = useRef<HTMLElement>(null);

  // Calculate which projects to display
  const displayedProjects = showAllProjects ? getAllProjects() : featuredProjects;
  const hasMoreProjects = nonFeaturedProjects.length > 0;

  // Toggle projects visibility with smooth animation
  const toggleProjects = async () => {
    if (isExpanding) return; // Prevent multiple clicks during animation
    
    setIsExpanding(true);
    setShowAllProjects(!showAllProjects);
    
    // Reset expanding state after animation completes
    setTimeout(() => {
      setIsExpanding(false);
    }, 600);
  };

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
    const newParticles = Array.from({ length: 15 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.8,
      duration: 12 + Math.random() * 8,
    }));
    setBackgroundParticles(newParticles);
  }, []);

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative min-h-screen py-20 px-6 overflow-hidden',
        'bg-gradient-to-br from-theme-bg-primary via-theme-bg-secondary to-theme-bg-primary',
        className
      )}
      id="projects"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div 
          className={cn(
            'absolute w-96 h-96 rounded-full opacity-10 blur-3xl transition-all duration-1000',
            isSlytherin 
              ? 'bg-gradient-to-r from-slytherinGreen-500 to-emerald-500' 
              : 'bg-gradient-to-r from-gryffindorGold-500 to-amber-500',
            isVisible ? 'animate-pulse' : ''
          )}
          style={{ 
            top: '10%', 
            left: '70%',
            animationDuration: '8s'
          }}
        />
        <div 
          className={cn(
            'absolute w-80 h-80 rounded-full opacity-10 blur-3xl transition-all duration-1000',
            isSlytherin 
              ? 'bg-gradient-to-r from-slytherin-600 to-slate-600' 
              : 'bg-gradient-to-r from-gryffindor-600 to-red-600',
            isVisible ? 'animate-pulse' : ''
          )}
          style={{ 
            bottom: '20%', 
            left: '10%',
            animationDuration: '10s',
            animationDelay: '2s'
          }}
        />

        {/* Floating Particles */}
        {backgroundParticles.map((particle, index) => (
          <div
            key={index}
            className={cn(
              'absolute w-2 h-2 rounded-full opacity-30 animate-bounce',
              isSlytherin ? 'bg-slytherinGreen-400' : 'bg-gryffindorGold-400'
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
                  ? 'bg-slytherinGreen-600/20 text-slytherinGreen-400' 
                  : 'bg-gryffindorGold-600/20 text-gryffindorGold-400'
              )}
            >
              ⚡
            </div>
            <span 
              className={cn(
                'font-philosopher text-sm uppercase tracking-wider font-medium',
                isSlytherin ? 'text-slytherinGreen-400' : 'text-gryffindorGold-400'
              )}
            >
              Magical Creations
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
            {showAllProjects ? 'All ' : 'Featured '}
            <span 
              className={cn(
                'magical-text bg-gradient-to-r bg-clip-text text-transparent',
                isSlytherin 
                  ? 'from-slytherinGreen-400 to-emerald-400' 
                  : 'from-gryffindorGold-400 to-amber-400'
              )}
            >
              Projects
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
            Behold the digital spells I&apos;ve crafted—each project a testament to the magic 
            that happens when creativity meets code. From enchanted APIs to mystical 3D realms, 
            these creations showcase the power of modern web sorcery.
          </p>
        </div>

        {/* Projects Grid */}
        <div 
          className={cn(
            'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-600',
            isVisible 
              ? 'opacity-100 translate-y-0' 
              : 'opacity-0 translate-y-8'
          )}
          style={{ transitionDelay: '600ms' }}
        >
          {displayedProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={showAllProjects && index >= featuredProjects.length ? index - featuredProjects.length : index}
              className={cn(
                'h-full transition-all duration-500',
                showAllProjects && index >= featuredProjects.length
                  ? 'animate-in fade-in slide-in-from-bottom-8'
                  : ''
              )}
              style={{
                animationDelay: showAllProjects && index >= featuredProjects.length 
                  ? `${(index - featuredProjects.length) * 100}ms` 
                  : undefined,
                animationFillMode: 'both'
              }}
            />
          ))}
        </div>

        {/* Show More/Less Toggle Button */}
        {hasMoreProjects && (
          <div 
            className={cn(
              'text-center mt-12 transition-all duration-1000',
              isVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            )}
            style={{ transitionDelay: '700ms' }}
          >
            <button
              onClick={toggleProjects}
              disabled={isExpanding}
              className={cn(
                'group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-medium transition-all duration-300',
                'magical-button hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
                'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
                isSlytherin
                  ? 'bg-gradient-to-r from-slate-700 to-slate-600 text-white hover:from-slate-600 hover:to-slate-500 focus:ring-slytherinGreen-400 border border-slytherinGreen-500/30'
                  : 'bg-gradient-to-r from-slate-700 to-slate-600 text-white hover:from-slate-600 hover:to-slate-500 focus:ring-gryffindorGold-400 border border-gryffindorGold-500/30'
              )}
              aria-expanded={showAllProjects}
              aria-label={showAllProjects ? 'Show fewer projects' : 'Show more projects'}
            >
              {/* Button Icon */}
              <div 
                className={cn(
                  'w-5 h-5 transition-transform duration-300',
                  showAllProjects ? 'rotate-180' : 'rotate-0'
                )}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Button Text */}
              <span className="font-philosopher">
                {showAllProjects ? 'Show Less' : `Show ${nonFeaturedProjects.length} More Projects`}
              </span>

              {/* Magical sparkle effect on hover */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'absolute w-1 h-1 rounded-full animate-ping',
                      isSlytherin ? 'bg-slytherinGreen-400' : 'bg-gryffindorGold-400'
                    )}
                    style={{
                      left: `${20 + (i * 20)}%`,
                      top: `${30 + (i * 10)}%`,
                      animationDelay: `${i * 150}ms`,
                      animationDuration: '1.5s'
                    }}
                  />
                ))}
              </div>
            </button>
          </div>
        )}

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
              Seeking More Magical Creations?
            </h3>
            <p className="font-philosopher text-theme-text-secondary mb-6">
              These featured projects are just the beginning. Visit my GitHub to explore 
              the full spellbook of repositories and ongoing magical experiments.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300',
                'magical-button hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
                isSlytherin
                  ? 'bg-gradient-to-r from-slytherinGreen-600 to-emerald-600 text-white hover:from-slytherinGreen-500 hover:to-emerald-500 focus:ring-slytherinGreen-400'
                  : 'bg-gradient-to-r from-gryffindorGold-600 to-amber-600 text-white hover:from-gryffindorGold-500 hover:to-amber-500 focus:ring-gryffindorGold-400'
              )}
            >
              <span>View All Projects</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-theme-border to-transparent" />
    </section>
  );
};

export default Projects;