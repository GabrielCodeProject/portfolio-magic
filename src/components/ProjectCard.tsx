'use client';

import React, { useState } from 'react';

import { useSafeTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';
import { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  index: number;
  className?: string;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ 
  project, 
  index,
  className 
}) => {
  const { isSlytherin, isGryffindor } = useSafeTheme();
  const [isHovered, setIsHovered] = useState(false);

  const categoryColors = {
    web: isSlytherin ? 'border-slytherinGreen-500' : 'border-gryffindorGold-500',
    mobile: isSlytherin ? 'border-slytherin-500' : 'border-gryffindor-500',
    '3d': isSlytherin ? 'border-emerald-500' : 'border-amber-500',
    other: isSlytherin ? 'border-slate-500' : 'border-orange-500'
  };

  const categoryIcons = {
    web: '🌐',
    mobile: '📱',
    '3d': '🎮',
    other: '⚡'
  };

  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-xl transition-all duration-500',
        'glass border-2 border-transparent hover:border-opacity-50',
        'magical-hover-lift magical-tilt magical-card-entrance',
        isHovered && categoryColors[project.category],
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
          'absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500',
          isSlytherin 
            ? 'bg-gradient-to-br from-slytherinGreen-400 to-slytherin-600'
            : 'bg-gradient-to-br from-gryffindorGold-400 to-gryffindor-600'
        )}
      />

      {/* Project image placeholder */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-700 to-slate-800">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl opacity-30">{categoryIcons[project.category]}</div>
        </div>
        
        {/* Hover overlay */}
        <div 
          className={cn(
            'absolute inset-0 opacity-0 group-hover:opacity-80 transition-all duration-500',
            'bg-gradient-to-t from-black/80 via-transparent to-transparent',
            'flex items-end justify-center pb-4'
          )}
        >
          <div className="flex gap-3">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300',
                  'bg-white/20 backdrop-blur-sm hover:bg-white/30',
                  'text-white hover:scale-105 focus:outline-none focus:ring-2',
                  isSlytherin ? 'focus:ring-slytherinGreen-400' : 'focus:ring-gryffindorGold-400'
                )}
                onClick={(e) => e.stopPropagation()}
              >
                Live Demo
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300',
                  'bg-white/20 backdrop-blur-sm hover:bg-white/30',
                  'text-white hover:scale-105 focus:outline-none focus:ring-2',
                  isSlytherin ? 'focus:ring-slytherinGreen-400' : 'focus:ring-gryffindorGold-400'
                )}
                onClick={(e) => e.stopPropagation()}
              >
                GitHub
              </a>
            )}
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute top-3 right-3">
          <span 
            className={cn(
              'px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm',
              'bg-black/30 text-white border',
              categoryColors[project.category]
            )}
          >
            {project.category.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Project content */}
      <div className="p-6">
        <h3 className={cn(
          'font-cinzel text-xl font-semibold mb-3 transition-colors duration-300',
          'text-theme-text-primary group-hover:text-theme-accent'
        )}>
          {project.title}
        </h3>

        <p className="text-theme-text-secondary text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Technologies */}
        <div className="flex flex-wrap gap-2">
          {project.technologies.slice(0, 4).map((tech, techIndex) => (
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
          {project.technologies.length > 4 && (
            <span className="px-2 py-1 rounded-md text-xs font-medium bg-theme-bg-tertiary text-theme-text-muted">
              +{project.technologies.length - 4} more
            </span>
          )}
        </div>
      </div>

      {/* Magical sparkle effect */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'absolute w-1 h-1 rounded-full animate-ping',
                isSlytherin ? 'bg-slytherinGreen-400' : 'bg-gryffindorGold-400'
              )}
              style={{
                left: `${20 + (i * 15)}%`,
                top: `${10 + (i * 20)}%`,
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