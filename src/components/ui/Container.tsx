import React from 'react';
import { cn } from '@/lib/utils';

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
  children: React.ReactNode;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'lg', padding = 'md', center = false, children, ...props }, ref) => {
    const baseClasses = 'w-full mx-auto';
    
    const sizes = {
      sm: 'max-w-screen-sm',     // 640px
      md: 'max-w-screen-md',     // 768px
      lg: 'max-w-screen-lg',     // 1024px
      xl: 'max-w-screen-xl',     // 1280px
      full: 'max-w-full',
    };

    const paddings = {
      none: '',
      sm: 'px-4 sm:px-6',
      md: 'px-4 sm:px-6 lg:px-8',
      lg: 'px-6 sm:px-8 lg:px-12',
    };

    const centerClasses = center ? 'flex items-center justify-center' : '';

    return (
      <div
        className={cn(
          baseClasses,
          sizes[size],
          paddings[padding],
          centerClasses,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'default' | 'magical' | 'fullscreen';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, variant = 'default', padding = 'lg', children, ...props }, ref) => {
    const baseClasses = 'relative w-full';
    
    const variants = {
      default: '',
      magical: 'bg-gradient-to-br from-theme-bg-primary to-theme-bg-secondary',
      fullscreen: 'min-h-screen flex items-center',
    };

    const paddings = {
      none: '',
      sm: 'py-8',
      md: 'py-12',
      lg: 'py-16',
      xl: 'py-24',
    };

    return (
      <section
        className={cn(
          baseClasses,
          variants[variant],
          paddings[padding],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </section>
    );
  }
);

Section.displayName = 'Section';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  children: React.ReactNode;
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  ({ 
    className, 
    direction = 'row', 
    align = 'start', 
    justify = 'start', 
    wrap = false,
    gap = 'none',
    children, 
    ...props 
  }, ref) => {
    const baseClasses = 'flex';
    
    const directions = {
      row: 'flex-row',
      col: 'flex-col',
      'row-reverse': 'flex-row-reverse',
      'col-reverse': 'flex-col-reverse',
    };

    const alignments = {
      start: 'items-start',
      center: 'items-center',
      end: 'items-end',
      stretch: 'items-stretch',
      baseline: 'items-baseline',
    };

    const justifications = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    const gaps = {
      none: '',
      xs: 'gap-1',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
    };

    const wrapClasses = wrap ? 'flex-wrap' : '';

    return (
      <div
        className={cn(
          baseClasses,
          directions[direction],
          alignments[align],
          justifications[justify],
          gaps[gap],
          wrapClasses,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Flex.displayName = 'Flex';

export { Container, Section, Flex };
export default Container;