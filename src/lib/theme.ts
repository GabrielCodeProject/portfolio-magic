import React from 'react';

import { THEMES, type Theme } from './constants';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: {
    primary: string;
    secondary: string;
  };
  text: {
    primary: string;
    secondary: string;
    muted: string;
  };
  magical: {
    ember: string;
    shimmer: string;
    purple: string;
    frost: string;
    shadow: string;
  };
}

export const themeConfig: Record<Theme, ThemeColors> = {
  [THEMES.SLYTHERIN]: {
    primary: '#1a5490',
    secondary: '#2d5016',
    accent: '#6c757d',
    background: {
      primary: '#0f0f23',
      secondary: '#050510',
    },
    text: {
      primary: '#f8f9fa',
      secondary: '#e9ecef',
      muted: '#adb5bd',
    },
    magical: {
      ember: '#f59e0b',
      shimmer: '#fbbf24',
      purple: '#6b46c1',
      frost: '#06b6d4',
      shadow: '#374151',
    },
  },
  [THEMES.GRYFFINDOR]: {
    primary: '#740001',
    secondary: '#eab308',
    accent: '#fbbf24',
    background: {
      primary: '#0f0f23',
      secondary: '#1a0c06',
    },
    text: {
      primary: '#f8f9fa',
      secondary: '#fed7d7',
      muted: '#fcd34d',
    },
    magical: {
      ember: '#f59e0b',
      shimmer: '#fbbf24',
      purple: '#6b46c1',
      frost: '#06b6d4',
      shadow: '#374151',
    },
  },
};

export const getThemeColors = (theme: Theme): ThemeColors => {
  return themeConfig[theme];
};

export const applyTheme = (theme: Theme): void => {
  // Set data attribute for CSS selectors
  // This approach is preferred as it allows CSS to handle all the variable updates
  document.body.setAttribute('data-theme', theme);
  
  // Also set on document element for broader compatibility
  document.documentElement.setAttribute('data-theme', theme);
};

export const getStoredTheme = (): Theme => {
  if (typeof window === 'undefined') return THEMES.SLYTHERIN;

  try {
    const stored = localStorage.getItem('theme') as Theme;
    return stored && Object.values(THEMES).includes(stored)
      ? stored
      : THEMES.SLYTHERIN;
  } catch {
    return THEMES.SLYTHERIN;
  }
};

export const setStoredTheme = (theme: Theme): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('theme', theme);
  } catch {
    // Silently fail if localStorage is not available
  }
};

// CSS Variable Utilities
export const getCSSVariable = (variable: string): string => {
  if (typeof window === 'undefined') return '';
  return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
};

export const setCSSVariable = (variable: string, value: string): void => {
  if (typeof window === 'undefined') return;
  document.documentElement.style.setProperty(variable, value);
};

// Theme-aware CSS variable getters
export const getThemeVariable = (variable: string): string => {
  return getCSSVariable(`--theme-${variable}`);
};

export const getMagicalVariable = (variable: string): string => {
  return getCSSVariable(`--magical-${variable}`);
};

// Design token utilities
export const spacing = {
  get: (size: string | number): string => getCSSVariable(`--spacing-${size}`),
  px: (pixels: number): string => `${pixels}px`,
  rem: (rems: number): string => `${rems}rem`,
};

export const fontSize = {
  get: (size: string): string => getCSSVariable(`--text-${size}`),
};

export const duration = {
  get: (time: string | number): string => getCSSVariable(`--duration-${time}`),
};

export const shadow = {
  get: (type: string): string => getCSSVariable(`--shadow-${type}`),
};

export const radius = {
  get: (size: string): string => getCSSVariable(`--radius-${size}`),
};

// Component-specific utilities
export const button = {
  height: (size: 'sm' | 'md' | 'lg' = 'md'): string => getCSSVariable(`--btn-height-${size}`),
  paddingX: (size: 'sm' | 'md' | 'lg' = 'md'): string => getCSSVariable(`--btn-padding-x-${size}`),
};

export const card = {
  padding: (): string => getCSSVariable('--card-padding'),
  radius: (): string => getCSSVariable('--card-radius'),
  shadow: (): string => getCSSVariable('--card-shadow'),
};

export const input = {
  height: (): string => getCSSVariable('--input-height'),
  paddingX: (): string => getCSSVariable('--input-padding-x'),
  radius: (): string => getCSSVariable('--input-radius'),
};

// Utility function to create CSS custom properties object for React components
export const createCSSProperties = (properties: Record<string, string>): React.CSSProperties => {
  const cssProps: Record<string, string> = {};
  Object.entries(properties).forEach(([key, value]) => {
    cssProps[`--${key}`] = value;
  });
  return cssProps as React.CSSProperties;
};