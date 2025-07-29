'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { useSafeTheme } from '@/components/ThemeProvider';
import { cn } from '@/lib/utils';

interface NavigationProps {
  className?: string;
}

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '#home',
    icon: '🏠',
  },
  {
    id: 'about',
    label: 'About',
    href: '#about',
    icon: '📜',
  },
  {
    id: 'skills',
    label: 'Skills',
    href: '#skills',
    icon: '⚡',
  },
  {
    id: 'projects',
    label: 'Projects',
    href: '#projects',
    icon: '🔮',
  },
  {
    id: 'services',
    label: 'Services',
    href: '#services',
    icon: '🪄',
  },
  {
    id: 'contact',
    label: 'Contact',
    href: '#contact',
    icon: '📬',
  },
];

export const Navigation: React.FC<NavigationProps> = ({ className }) => {
  const { isSlytherin } = useSafeTheme();
  const [activeSection, setActiveSection] = useState('home');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll detection for styling and progress
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle active section detection
  useEffect(() => {
    const sections = navItems.map(item => document.getElementById(item.id)).filter(Boolean);
    
    const observerOptions = {
      rootMargin: '-20% 0px -20% 0px',
      threshold: 0.3,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => {
      if (section) observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Smooth scroll to section
  const scrollToSection = useCallback((sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
    setIsMobileMenuOpen(false);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav
        className={cn(
          'fixed top-0 left-0 right-0 z-40 transition-all duration-500',
          isScrolled
            ? 'py-3 glass backdrop-blur-md border-b border-theme-border/50'
            : 'py-6 bg-transparent',
          className
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo/Brand */}
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => scrollToSection('home')}
          >
            <div 
              className={cn(
                'w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all duration-300',
                'group-hover:scale-110',
                isSlytherin 
                  ? 'bg-emerald-600/20 text-emerald-400 group-hover:bg-emerald-600/30' 
                  : 'bg-amber-600/20 text-amber-400 group-hover:bg-amber-600/30'
              )}
            >
              🧙‍♂️
            </div>
            <span className="font-cinzel text-xl font-semibold text-theme-text-primary hidden sm:block">
              Portfolio Magic
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.id)}
                className={cn(
                  'group flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300',
                  'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 magical-button-press',
                  activeSection === item.id
                    ? isSlytherin
                      ? 'bg-emerald-600/20 text-emerald-400 focus:ring-emerald-400'
                      : 'bg-amber-600/20 text-amber-400 focus:ring-amber-400'
                    : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-bg-tertiary focus:ring-theme-accent'
                )}
              >
                <span className="text-base">{item.icon}</span>
                <span>{item.label}</span>
                {activeSection === item.id && (
                  <div 
                    className={cn(
                      'w-1.5 h-1.5 rounded-full animate-pulse',
                      isSlytherin ? 'bg-emerald-400' : 'bg-amber-400'
                    )}
                  />
                )}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={cn(
              'lg:hidden flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-300',
              'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2',
              isMobileMenuOpen
                ? isSlytherin
                  ? 'bg-emerald-600/20 text-emerald-400 focus:ring-emerald-400'
                  : 'bg-amber-600/20 text-amber-400 focus:ring-amber-400'
                : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-bg-tertiary focus:ring-theme-accent'
            )}
            aria-label="Toggle mobile menu"
          >
            <svg
              className={cn('w-6 h-6 transition-transform duration-300', isMobileMenuOpen && 'rotate-90')}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div
          className={cn(
            'lg:hidden absolute top-full left-0 right-0 transition-all duration-500 overflow-hidden',
            isMobileMenuOpen
              ? 'max-h-96 opacity-100'
              : 'max-h-0 opacity-0'
          )}
        >
          <div className="glass backdrop-blur-md border-b border-theme-border/50 mx-6 mt-2 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-3 rounded-lg text-sm font-medium transition-all duration-300',
                    'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 magical-button-press',
                    activeSection === item.id
                      ? isSlytherin
                        ? 'bg-emerald-600/20 text-emerald-400 focus:ring-emerald-400'
                        : 'bg-amber-600/20 text-amber-400 focus:ring-amber-400'
                      : 'text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-bg-tertiary focus:ring-theme-accent'
                  )}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                  {activeSection === item.id && (
                    <div 
                      className={cn(
                        'w-1.5 h-1.5 rounded-full animate-pulse',
                        isSlytherin ? 'bg-emerald-400' : 'bg-amber-400'
                      )}
                    />
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Scroll Progress Indicator */}
      <div
        className={cn(
          'fixed top-0 left-0 h-1 z-50 transition-all duration-300',
          isSlytherin
            ? 'bg-gradient-to-r from-emerald-500 to-teal-500'
            : 'bg-gradient-to-r from-amber-500 to-orange-500'
        )}
        style={{
          width: `${scrollProgress}%`,
        }}
      />

      {/* Floating Action Button - Scroll to Top */}
      {isScrolled && (
        <button
          onClick={() => scrollToSection('home')}
          className={cn(
            'fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full shadow-lg transition-all duration-300',
            'hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2',
            'magical-button backdrop-blur-sm',
            isSlytherin
              ? 'bg-emerald-600/80 text-white hover:bg-emerald-500/90 focus:ring-emerald-400'
              : 'bg-amber-600/80 text-white hover:bg-amber-500/90 focus:ring-amber-400'
          )}
          aria-label="Scroll to top"
        >
          <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
    </>
  );
};

export default Navigation;