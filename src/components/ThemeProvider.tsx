'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

import { THEMES, type Theme } from '@/lib/constants';
import {
  applyTheme,
  getStoredTheme,
  getThemeColors,
  setStoredTheme,
  type ThemeColors,
} from '@/lib/theme';

interface ThemeContextType {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isSlytherin: boolean;
  isGryffindor: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  defaultTheme = THEMES.SLYTHERIN,
}) => {
  const [theme, setThemeState] = useState<Theme>(defaultTheme);
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    const storedTheme = getStoredTheme();
    setThemeState(storedTheme);
    applyTheme(storedTheme);
    setMounted(true);
  }, []);

  // Apply theme changes
  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
      setStoredTheme(theme);
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const newTheme =
      theme === THEMES.SLYTHERIN ? THEMES.GRYFFINDOR : THEMES.SLYTHERIN;
    setTheme(newTheme);
  };

  const colors = getThemeColors(theme);

  const value: ThemeContextType = {
    theme,
    colors,
    toggleTheme,
    setTheme,
    isSlytherin: theme === THEMES.SLYTHERIN,
    isGryffindor: theme === THEMES.GRYFFINDOR,
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        {children}
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Safe hook that provides defaults when outside ThemeProvider
export const useSafeTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  
  // Return defaults when outside ThemeProvider context
  if (context === undefined) {
    return {
      theme: THEMES.SLYTHERIN,
      colors: getThemeColors(THEMES.SLYTHERIN),
      toggleTheme: () => {},
      setTheme: () => {},
      isSlytherin: true,
      isGryffindor: false,
    };
  }
  
  return context;
};

export default ThemeProvider;