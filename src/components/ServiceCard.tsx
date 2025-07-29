'use client';

import React, { useState } from 'react';

import { useSafeTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';
import { Service } from '@/types';

interface ServiceCardProps {
  service: Service;
  index: number;
  className?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ 
  service, 
  index,
  className 
}) => {
  const { isSlytherin } = useSafeTheme();
  const [isHovered, setIsHovered] = useState(false);

  const categoryColors = {
    web: isSlytherin ? 'border-slytherinGreen-500' : 'border-gryffindorGold-500',
    frontend: isSlytherin ? 'border-emerald-500' : 'border-amber-500',
    backend: isSlytherin ? 'border-slate-500' : 'border-orange-500',
    '3d': isSlytherin ? 'border-green-500' : 'border-yellow-500',
    design: isSlytherin ? 'border-teal-500' : 'border-red-500',
    consulting: isSlytherin ? 'border-cyan-500' : 'border-pink-500'
  };

  const categoryGradients = {
    web: isSlytherin 
      ? 'from-slytherinGreen-600/20 to-emerald-600/20' 
      : 'from-gryffindorGold-600/20 to-amber-600/20',
    frontend: isSlytherin 
      ? 'from-emerald-600/20 to-green-600/20' 
      : 'from-amber-600/20 to-yellow-600/20',
    backend: isSlytherin 
      ? 'from-slate-600/20 to-gray-600/20' 
      : 'from-orange-600/20 to-red-600/20',
    '3d': isSlytherin 
      ? 'from-green-600/20 to-teal-600/20' 
      : 'from-yellow-600/20 to-orange-600/20',
    design: isSlytherin 
      ? 'from-teal-600/20 to-cyan-600/20' 
      : 'from-red-600/20 to-pink-600/20',
    consulting: isSlytherin 
      ? 'from-cyan-600/20 to-blue-600/20' 
      : 'from-pink-600/20 to-purple-600/20'
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl transition-all duration-500',
        'glass border-2 border-transparent hover:border-opacity-50',
        'magical-hover-lift magical-tilt magical-card-entrance',
        isHovered && categoryColors[service.category],
        'hover:shadow-magical',
        className
      )}
      style={{
        animationDelay: `${index * 200}ms`,
        animationFillMode: 'both'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient overlay */}
      <div 
        className={cn(
          'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500',
          'bg-gradient-to-br',
          categoryGradients[service.category]
        )}
      />

      {/* Card Content */}
      <div className="relative p-8">
        {/* Service Icon */}
        <div className="mb-6 flex items-center justify-between">
          <div 
            className={cn(
              'w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all duration-300',
              'bg-gradient-to-br from-theme-bg-tertiary to-theme-bg-secondary',
              'group-hover:scale-110 group-hover:rotate-12',
              isHovered && 'animate-bounce'
            )}
          >
            {service.icon}
          </div>

          {/* Category Badge */}
          <span 
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm',
              'bg-theme-bg-tertiary/50 text-theme-text-muted border',
              categoryColors[service.category]
            )}
          >
            {service.category.toUpperCase()}
          </span>
        </div>

        {/* Service Title & Subtitle */}
        <div className="mb-4">
          <h3 className={cn(
            'font-cinzel text-xl font-semibold mb-2 transition-colors duration-300',
            'text-theme-text-primary group-hover:text-theme-accent'
          )}>
            {service.title}
          </h3>
          <p className={cn(
            'font-philosopher text-sm font-medium transition-colors duration-300',
            isSlytherin ? 'text-slytherinGreen-400' : 'text-gryffindorGold-400',
            'group-hover:text-theme-accent'
          )}>
            {service.subtitle}
          </p>
        </div>

        {/* Service Description */}
        <p className="text-theme-text-secondary text-sm leading-relaxed mb-6">
          {service.description}
        </p>

        {/* Features List */}
        <div className="mb-6">
          <h4 className="font-philosopher text-sm font-semibold text-theme-text-primary mb-3">
            What&apos;s Included:
          </h4>
          <ul className="space-y-2">
            {service.features.slice(0, 4).map((feature, featureIndex) => (
              <li
                key={feature}
                className={cn(
                  'flex items-center gap-2 text-xs text-theme-text-secondary transition-all duration-300',
                  'animate-in fade-in slide-in-from-left-4'
                )}
                style={{
                  animationDelay: `${(index * 200) + (featureIndex * 100)}ms`,
                  animationFillMode: 'both'
                }}
              >
                <span 
                  className={cn(
                    'w-1.5 h-1.5 rounded-full flex-shrink-0',
                    isSlytherin ? 'bg-slytherinGreen-400' : 'bg-gryffindorGold-400'
                  )}
                />
                <span className="group-hover:text-theme-text-primary transition-colors duration-300">
                  {feature}
                </span>
              </li>
            ))}
            {service.features.length > 4 && (
              <li className="text-xs text-theme-text-muted italic">
                +{service.features.length - 4} more magical features...
              </li>
            )}
          </ul>
        </div>

        {/* Technologies */}
        <div className="mb-6">
          <h4 className="font-philosopher text-sm font-semibold text-theme-text-primary mb-3">
            Magical Tools:
          </h4>
          <div className="flex flex-wrap gap-2">
            {service.technologies.slice(0, 4).map((tech, techIndex) => (
              <span
                key={tech}
                className={cn(
                  'px-2 py-1 rounded-md text-xs font-medium transition-all duration-300',
                  'bg-theme-bg-tertiary text-theme-text-muted',
                  'group-hover:bg-theme-accent/10 group-hover:text-theme-accent',
                  'animate-in fade-in slide-in-from-bottom-4'
                )}
                style={{
                  animationDelay: `${(index * 200) + (techIndex * 100)}ms`,
                  animationFillMode: 'both'
                }}
              >
                {tech}
              </span>
            ))}
            {service.technologies.length > 4 && (
              <span className="px-2 py-1 rounded-md text-xs font-medium bg-theme-bg-tertiary text-theme-text-muted">
                +{service.technologies.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Call to Action */}
        {service.ctaText && service.ctaLink && (
          <a
            href={service.ctaLink}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300',
              'magical-button hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
              'w-full justify-center',
              isSlytherin
                ? 'bg-gradient-to-r from-slytherinGreen-600 to-emerald-600 text-white hover:from-slytherinGreen-500 hover:to-emerald-500 focus:ring-slytherinGreen-400'
                : 'bg-gradient-to-r from-gryffindorGold-600 to-amber-600 text-white hover:from-gryffindorGold-500 hover:to-amber-500 focus:ring-gryffindorGold-400'
            )}
          >
            <span>{service.ctaText}</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        )}
      </div>

      {/* Magical sparkle effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'absolute w-1 h-1 rounded-full animate-ping',
                isSlytherin ? 'bg-slytherinGreen-400' : 'bg-gryffindorGold-400'
              )}
              style={{
                left: `${10 + (i * 12)}%`,
                top: `${10 + (i * 10)}%`,
                animationDelay: `${i * 200}ms`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};