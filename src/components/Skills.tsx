'use client';

import React, { useEffect, useRef, useState } from 'react';

import { useSafeTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface Skill {
  name: string;
  icon: string;
  level: number; // 1-100
  masteryTitle: string;
  experience: string;
  description: string;
  category: string;
}

interface SkillCategory {
  title: string;
  subtitle: string;
  skills: Skill[];
  color: string;
}

interface SkillsProps {
  className?: string;
}

export const Skills: React.FC<SkillsProps> = ({ className }) => {
  const { isSlytherin, isGryffindor } = useSafeTheme();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [magicalParticles, setMagicalParticles] = useState<Array<{left: number, top: number, delay: number}>>([]);
  const [backgroundParticles, setBackgroundParticles] = useState<Array<{left: number, top: number, delay: number, duration: number}>>([]);
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

  // Generate particles on client side to avoid hydration mismatch
  useEffect(() => {
    const newMagicalParticles = Array.from({ length: 15 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.2,
    }));
    setMagicalParticles(newMagicalParticles);

    const newBackgroundParticles = Array.from({ length: 10 }, (_, i) => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.8,
      duration: 12 + Math.random() * 6,
    }));
    setBackgroundParticles(newBackgroundParticles);
  }, []);

  const getMasteryTitle = (level: number): string => {
    if (level >= 95) return 'Archmage';
    if (level >= 80) return 'Master';
    if (level >= 60) return 'Expert';
    if (level >= 40) return 'Adept';
    return 'Apprentice';
  };

  const getMasteryColor = (level: number): string => {
    if (level >= 95) return isSlytherin ? 'text-emerald-300' : 'text-amber-300';
    if (level >= 80) return isSlytherin ? 'text-green-400' : 'text-red-400';
    if (level >= 60) return isSlytherin ? 'text-green-500' : 'text-orange-400';
    if (level >= 40) return isSlytherin ? 'text-teal-400' : 'text-yellow-400';
    return 'text-gray-400';
  };

  const skillCategories: SkillCategory[] = [
    {
      title: 'Frontend Enchantments',
      subtitle: 'Spells for crafting magical user interfaces',
      color: isSlytherin ? 'from-green-400 to-emerald-600' : 'from-red-400 to-orange-500',
      skills: [
        {
          name: 'React',
          icon: '⚛️',
          level: 90,
          masteryTitle: getMasteryTitle(90),
          experience: '4+ years',
          description: 'Master of component sorcery and state management spells',
          category: 'frontend'
        },
        {
          name: 'Next.js',
          icon: '▲',
          level: 85,
          masteryTitle: getMasteryTitle(85),
          experience: '3+ years',
          description: 'Full-stack wizardry with server-side enchantments',
          category: 'frontend'
        },
        {
          name: 'TypeScript',
          icon: '📘',
          level: 88,
          masteryTitle: getMasteryTitle(88),
          experience: '3+ years',
          description: 'Type-safe magic preventing runtime curses',
          category: 'frontend'
        },
        {
          name: 'Tailwind CSS',
          icon: '🎨',
          level: 92,
          masteryTitle: getMasteryTitle(92),
          experience: '4+ years',
          description: 'Utility-first styling spells for rapid development',
          category: 'frontend'
        },
        {
          name: 'JavaScript',
          icon: '⚡',
          level: 95,
          masteryTitle: getMasteryTitle(95),
          experience: '5+ years',
          description: 'The ancient language of web magic mastery',
          category: 'frontend'
        },
        {
          name: 'HTML & CSS',
          icon: '🏗️',
          level: 98,
          masteryTitle: getMasteryTitle(98),
          experience: '6+ years',
          description: 'Foundation stones of all web enchantments',
          category: 'frontend'
        }
      ]
    },
    {
      title: 'Backend Sorcery',
      subtitle: 'Dark arts of server-side magic',
      color: isSlytherin ? 'from-purple-400 to-indigo-600' : 'from-purple-400 to-pink-500',
      skills: [
        {
          name: 'Node.js',
          icon: '🟢',
          level: 75,
          masteryTitle: getMasteryTitle(75),
          experience: '3+ years',
          description: 'Server-side JavaScript sorcery and API conjuring',
          category: 'backend'
        },
        {
          name: 'Python',
          icon: '🐍',
          level: 70,
          masteryTitle: getMasteryTitle(70),
          experience: '2+ years',
          description: 'Serpentine scripting for automation and analysis',
          category: 'backend'
        },
        {
          name: 'Databases',
          icon: '🗄️',
          level: 72,
          masteryTitle: getMasteryTitle(72),
          experience: '3+ years',
          description: 'MongoDB, PostgreSQL - data preservation spells',
          category: 'backend'
        },
        {
          name: 'REST APIs',
          icon: '🔗',
          level: 80,
          masteryTitle: getMasteryTitle(80),
          experience: '4+ years',
          description: 'Crafting communication channels between realms',
          category: 'backend'
        },
        {
          name: 'GraphQL',
          icon: '🔮',
          level: 65,
          masteryTitle: getMasteryTitle(65),
          experience: '2+ years',
          description: 'Query language magic for efficient data fetching',
          category: 'backend'
        }
      ]
    },
    {
      title: 'Design Mysticism',
      subtitle: 'Arts of visual enchantment and user experience',
      color: isSlytherin ? 'from-teal-400 to-cyan-600' : 'from-pink-400 to-rose-500',
      skills: [
        {
          name: 'UI/UX Design',
          icon: '🎭',
          level: 78,
          masteryTitle: getMasteryTitle(78),
          experience: '4+ years',
          description: 'Crafting intuitive and beautiful user journeys',
          category: 'design'
        },
        {
          name: 'Figma',
          icon: '🖌️',
          level: 75,
          masteryTitle: getMasteryTitle(75),
          experience: '3+ years',
          description: 'Design collaboration and prototyping sorcery',
          category: 'design'
        },
        {
          name: 'Design Systems',
          icon: '📐',
          level: 82,
          masteryTitle: getMasteryTitle(82),
          experience: '3+ years',
          description: 'Creating consistent magical component libraries',
          category: 'design'
        },
        {
          name: 'Responsive Design',
          icon: '📱',
          level: 90,
          masteryTitle: getMasteryTitle(90),
          experience: '5+ years',
          description: 'Multi-device adaptation spells and mobile magic',
          category: 'design'
        },
        {
          name: 'Accessibility',
          icon: '♿',
          level: 85,
          masteryTitle: getMasteryTitle(85),
          experience: '4+ years',
          description: 'Inclusive design magic for all users',
          category: 'design'
        }
      ]
    },
    {
      title: 'DevOps Wizardry',
      subtitle: 'Deployment magic and infrastructure spells',
      color: isSlytherin ? 'from-slate-400 to-gray-600' : 'from-indigo-400 to-blue-500',
      skills: [
        {
          name: 'Git & GitHub',
          icon: '🌟',
          level: 92,
          masteryTitle: getMasteryTitle(92),
          experience: '5+ years',
          description: 'Version control magic and collaboration spells',
          category: 'devops'
        },
        {
          name: 'CI/CD',
          icon: '🔄',
          level: 70,
          masteryTitle: getMasteryTitle(70),
          experience: '2+ years',
          description: 'Automated deployment and testing enchantments',
          category: 'devops'
        },
        {
          name: 'Cloud Services',
          icon: '☁️',
          level: 75,
          masteryTitle: getMasteryTitle(75),
          experience: '3+ years',
          description: 'AWS, Vercel, Netlify - cloud magic mastery',
          category: 'devops'
        },
        {
          name: 'Performance',
          icon: '⚡',
          level: 83,
          masteryTitle: getMasteryTitle(83),
          experience: '4+ years',
          description: 'Speed optimization spells and loading enchantments',
          category: 'devops'
        },
        {
          name: 'Docker',
          icon: '🐳',
          level: 45,
          masteryTitle: getMasteryTitle(45),
          experience: '1+ years',
          description: 'Containerization magic for consistent environments',
          category: 'devops'
        }
      ]
    }
  ];

  const SkillCard = ({ skill, index }: { skill: Skill; index: number }) => (
    <div
      className={cn(
        'group relative p-6 rounded-lg glass border transition-all duration-500 hover:scale-105',
        'border-theme-border-primary hover:border-theme-border-accent',
        'cursor-pointer transform-gpu',
        isVisible && 'animate-magical-levitate'
      )}
      style={{
        animationDelay: `${index * 0.1}s`,
        animationDuration: '3s'
      }}
      onMouseEnter={() => setHoveredSkill(skill.name)}
      onMouseLeave={() => setHoveredSkill(null)}
    >
      {/* Magical Aura */}
      <div className={cn(
        'absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-300',
        'bg-gradient-to-br pointer-events-none',
        isSlytherin 
          ? 'from-green-400 to-emerald-600'
          : 'from-red-400 to-amber-600'
      )} />

      {/* Skill Header */}
      <div className="relative z-10 mb-4">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-2xl">{skill.icon}</span>
          <h3 className="font-cinzel font-semibold text-lg text-theme-text-primary">
            {skill.name}
          </h3>
        </div>
        
        {/* Mastery Level */}
        <div className="flex items-center gap-2">
          <span className={cn('text-sm font-philosopher font-medium', getMasteryColor(skill.level))}>
            {skill.masteryTitle}
          </span>
          <span className="text-xs text-theme-text-muted">
            {skill.experience}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative z-10 mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-philosopher text-theme-text-secondary">
            Mastery Level
          </span>
          <span className="text-xs font-philosopher text-theme-text-secondary">
            {skill.level}%
          </span>
        </div>
        
        <div className="w-full bg-theme-bg-secondary rounded-full h-2 overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000 ease-out',
              'bg-gradient-to-r',
              isSlytherin 
                ? 'from-green-400 to-emerald-500'
                : 'from-red-400 to-amber-500',
              isVisible && 'animate-magical-shimmer'
            )}
            style={{
              width: isVisible ? `${skill.level}%` : '0%',
              transitionDelay: `${index * 0.1}s`
            }}
          />
        </div>
      </div>

      {/* Description */}
      <p className="relative z-10 text-sm font-philosopher text-theme-text-secondary leading-relaxed">
        {skill.description}
      </p>

      {/* Hover Effect Particles */}
      {hoveredSkill === skill.name && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {magicalParticles.slice(0, 6).map((particle, i) => (
            <div
              key={i}
              className={cn(
                'absolute w-1 h-1 rounded-full animate-magical-sparkle',
                isSlytherin ? 'bg-green-400' : 'bg-red-400'
              )}
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                animationDelay: `${particle.delay}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      className={cn(
        'relative py-20 overflow-hidden',
        'bg-gradient-to-br from-theme-bg-secondary via-theme-bg-primary to-theme-bg-tertiary',
        className
      )}
    >
      {/* Magical Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {backgroundParticles.map((particle, i) => (
          <div
            key={i}
            className={cn(
              'absolute w-1 h-1 rounded-full animate-magical-drift opacity-10',
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
            'transition-all duration-1000 delay-200',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            <span className="magical-text animate-magical-shimmer">
              Magical
            </span>
            <br />
            <span className="text-theme-text-primary">Disciplines</span>
          </h2>
          <p className={cn(
            'font-philosopher text-lg md:text-xl text-theme-text-secondary max-w-3xl mx-auto',
            'transition-all duration-1000 delay-400',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          )}>
            Years of dedicated study in the arcane arts of web development. 
            Each skill mastered through countless hours of practice, debugging rituals, 
            and the occasional late-night coding séance.
          </p>
        </div>

        {/* Skills Categories */}
        <div className="space-y-16">
          {skillCategories.map((category, categoryIndex) => (
            <div
              key={category.title}
              className={cn(
                'transition-all duration-1000',
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              )}
              style={{ transitionDelay: `${600 + categoryIndex * 200}ms` }}
            >
              {/* Category Header */}
              <div className="text-center mb-8">
                <h3 className="font-cinzel text-2xl md:text-3xl font-bold mb-2">
                  <span className={cn('bg-gradient-to-r bg-clip-text text-transparent', category.color)}>
                    {category.title}
                  </span>
                </h3>
                <p className="font-philosopher text-theme-text-secondary">
                  {category.subtitle}
                </p>
              </div>

              {/* Skills Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.skills.map((skill, skillIndex) => (
                  <SkillCard 
                    key={skill.name} 
                    skill={skill} 
                    index={categoryIndex * 10 + skillIndex} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call to Action */}
        <div className={cn(
          'text-center mt-16 transition-all duration-1000',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )} style={{ transitionDelay: '1600ms' }}>
          <p className="font-philosopher text-lg text-theme-text-secondary mb-8">
            Ready to combine these magical abilities for your next project?
          </p>
          <button className={cn(
            'btn-base btn-primary magical-button group px-8 py-4 text-lg font-semibold',
            'relative overflow-hidden'
          )}>
            <span className="relative z-10">Let's Cast Some Spells</span>
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

export default Skills;