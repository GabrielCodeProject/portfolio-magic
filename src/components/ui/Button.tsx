import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  magical?: boolean;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', magical = false, children, ...props }, ref) => {
    const baseClasses = 'btn-base inline-flex items-center justify-content-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      primary: 'btn-primary magical-button',
      secondary: 'btn-secondary',
      outline: 'border-2 border-theme-border-accent bg-transparent text-theme-text-primary hover:bg-theme-bg-card hover:shadow-glow',
      ghost: 'bg-transparent text-theme-text-secondary hover:bg-theme-bg-card hover:text-theme-text-primary',
    };

    const sizes = {
      sm: 'btn-sm px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'btn-lg px-6 py-3 text-base',
    };

    const magicalClasses = magical ? 'magical-glow animate-magical-pulse' : '';

    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          magicalClasses,
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;