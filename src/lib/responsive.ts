// Responsive Utilities for Harry Potter Portfolio

// Breakpoint constants (matching Tailwind defaults)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// Responsive value type for components
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

// Utility to check if we're on the client side
export const isClient = typeof window !== 'undefined';

// Get current window width (client-side only)
export const getWindowWidth = (): number => {
  if (!isClient) return 0;
  return window.innerWidth;
};

// Check if current viewport matches breakpoint
export const matchesBreakpoint = (breakpoint: Breakpoint): boolean => {
  if (!isClient) return false;
  const width = getWindowWidth();
  const breakpointValue = parseInt(BREAKPOINTS[breakpoint]);
  return width >= breakpointValue;
};

// Get current active breakpoint
export const getCurrentBreakpoint = (): Breakpoint => {
  if (!isClient) return 'sm';
  
  const width = getWindowWidth();
  
  if (width >= 1536) return '2xl';
  if (width >= 1280) return 'xl';
  if (width >= 1024) return 'lg';
  if (width >= 768) return 'md';
  return 'sm';
};

// Resolve responsive value based on current breakpoint
export const resolveResponsiveValue = <T>(
  value: ResponsiveValue<T>,
  currentBreakpoint?: Breakpoint
): T => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const responsiveValue = value as Partial<Record<Breakpoint, T>>;
    const bp = currentBreakpoint || getCurrentBreakpoint();
    const breakpointOrder: Breakpoint[] = ['sm', 'md', 'lg', 'xl', '2xl'];
    const currentIndex = breakpointOrder.indexOf(bp);
    
    // Find the closest defined value at or below current breakpoint
    for (let i = currentIndex; i >= 0; i--) {
      const breakpoint = breakpointOrder[i];
      if (responsiveValue[breakpoint] !== undefined) {
        return responsiveValue[breakpoint] as T;
      }
    }
    
    // Fallback to the first defined value
    for (const breakpoint of breakpointOrder) {
      if (responsiveValue[breakpoint] !== undefined) {
        return responsiveValue[breakpoint] as T;
      }
    }
  }
  
  return value as T;
};

// Generate responsive CSS classes
export const generateResponsiveClasses = (
  property: string,
  value: ResponsiveValue<string | number>
): string[] => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    const classes: string[] = [];
    
    Object.entries(value).forEach(([breakpoint, val]) => {
      if (val !== undefined) {
        const prefix = breakpoint === 'sm' ? '' : `${breakpoint}:`;
        classes.push(`${prefix}${property}-${val}`);
      }
    });
    
    return classes;
  }
  
  return [`${property}-${value}`];
};

// Container size utilities
export const CONTAINER_SIZES = {
  sm: 'max-w-screen-sm',     // 640px
  md: 'max-w-screen-md',     // 768px  
  lg: 'max-w-screen-lg',     // 1024px
  xl: 'max-w-screen-xl',     // 1280px
  '2xl': 'max-w-screen-2xl', // 1536px
  full: 'max-w-full',
  none: 'max-w-none',
} as const;

// Spacing scale for responsive padding/margin
export const SPACING_SCALE = {
  0: '0',
  px: 'px',
  0.5: '0.5',
  1: '1',
  1.5: '1.5', 
  2: '2',
  2.5: '2.5',
  3: '3',
  3.5: '3.5',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: '11',
  12: '12',
  14: '14',
  16: '16',
  20: '20',
  24: '24',
  28: '28',
  32: '32',
  36: '36',
  40: '40',
  44: '44',
  48: '48',
  52: '52',
  56: '56',
  60: '60',
  64: '64',
  72: '72',
  80: '80',
  96: '96',
} as const;

export type SpacingValue = keyof typeof SPACING_SCALE;

// Generate responsive spacing classes
export const getResponsiveSpacing = (
  type: 'p' | 'px' | 'py' | 'pt' | 'pr' | 'pb' | 'pl' | 'm' | 'mx' | 'my' | 'mt' | 'mr' | 'mb' | 'ml',
  value: ResponsiveValue<SpacingValue>
): string => {
  const classes = generateResponsiveClasses(type, value);
  return classes.join(' ');
};

// Media query hook for React components
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = React.useState<boolean>(() => {
    if (!isClient) return false;
    return window.matchMedia(query).matches;
  });

  React.useEffect(() => {
    if (!isClient) return;
    
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

// Breakpoint-specific hooks
export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  return useMediaQuery(`(min-width: ${BREAKPOINTS[breakpoint]})`);
};

export const useCurrentBreakpoint = (): Breakpoint => {
  const is2xl = useBreakpoint('2xl');
  const isXl = useBreakpoint('xl');
  const isLg = useBreakpoint('lg');
  const isMd = useBreakpoint('md');
  
  if (is2xl) return '2xl';
  if (isXl) return 'xl';
  if (isLg) return 'lg';
  if (isMd) return 'md';
  return 'sm';
};

// Layout direction utilities
export const FLEX_DIRECTIONS = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  col: 'flex-col',
  'col-reverse': 'flex-col-reverse',
} as const;

export type FlexDirection = keyof typeof FLEX_DIRECTIONS;

// Alignment utilities  
export const ALIGN_ITEMS = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
} as const;

export const JUSTIFY_CONTENT = {
  start: 'justify-start',
  center: 'justify-center', 
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
} as const;

// React import for hooks
import React from 'react';