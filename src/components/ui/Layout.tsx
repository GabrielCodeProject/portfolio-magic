import React from 'react';
import { cn } from '@/lib/utils';
import { ResponsiveValue, SpacingValue, getResponsiveSpacing } from '@/lib/responsive';

// Stack Component - Vertical layout with consistent spacing
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  space?: ResponsiveValue<SpacingValue>;
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  children: React.ReactNode;
}

const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, space = 4, align = 'start', justify = 'start', wrap = false, children, ...props }, ref) => {
    const baseClasses = 'flex flex-col';
    
    const alignments = {
      start: 'items-start',
      center: 'items-center', 
      end: 'items-end',
      stretch: 'items-stretch',
    };

    const justifications = {
      start: 'justify-start',
      center: 'justify-center',
      end: 'justify-end',
      between: 'justify-between',
      around: 'justify-around',
      evenly: 'justify-evenly',
    };

    const spaceClass = typeof space === 'object' && space !== null
      ? Object.entries(space).map(([bp, val]) => {
          const prefix = bp === 'sm' ? '' : `${bp}:`;
          return `${prefix}space-y-${val}`;
        }).join(' ')
      : `space-y-${space}`;

    const wrapClass = wrap ? 'flex-wrap' : '';

    return (
      <div
        className={cn(
          baseClasses,
          alignments[align],
          justifications[justify],
          spaceClass,
          wrapClass,
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

Stack.displayName = 'Stack';

// Cluster Component - Horizontal layout with wrapping
export interface ClusterProps extends React.HTMLAttributes<HTMLDivElement> {
  space?: ResponsiveValue<SpacingValue>;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  children: React.ReactNode;
}

const Cluster = React.forwardRef<HTMLDivElement, ClusterProps>(
  ({ className, space = 4, align = 'center', justify = 'start', wrap = true, children, ...props }, ref) => {
    const baseClasses = 'flex flex-row';
    
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

    const spaceClass = typeof space === 'object' && space !== null
      ? Object.entries(space).map(([bp, val]) => {
          const prefix = bp === 'sm' ? '' : `${bp}:`;
          return `${prefix}gap-${val}`;
        }).join(' ')
      : `gap-${space}`;

    const wrapClass = wrap ? 'flex-wrap' : 'flex-nowrap';

    return (
      <div
        className={cn(
          baseClasses,
          alignments[align],
          justifications[justify],
          spaceClass,
          wrapClass,
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

Cluster.displayName = 'Cluster';

// Sidebar Component - Two-column layout with responsive behavior
export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: 'left' | 'right';
  sideWidth?: string | number;
  contentMinWidth?: string | number;
  space?: ResponsiveValue<SpacingValue>;
  noSidebarBreakpoint?: 'sm' | 'md' | 'lg' | 'xl';
  children: [React.ReactNode, React.ReactNode]; // [sidebar, content]
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ 
    className, 
    side = 'left', 
    sideWidth = '250px',
    contentMinWidth = '50%',
    space = 4,
    noSidebarBreakpoint = 'md',
    children,
    ...props 
  }, ref) => {
    const [sidebarContent, mainContent] = children;
    
    const baseClasses = 'flex';
    const breakpointClass = `${noSidebarBreakpoint}:flex-row`;
    const defaultDirection = 'flex-col';
    
    const spaceClass = typeof space === 'object' && space !== null
      ? Object.entries(space).map(([bp, val]) => {
          const prefix = bp === 'sm' ? '' : `${bp}:`;
          return `${prefix}gap-${val}`;
        }).join(' ')
      : `gap-${space}`;

    const sidebarStyles: React.CSSProperties = {
      flexBasis: sideWidth,
      flexShrink: 0,
    };

    const contentStyles: React.CSSProperties = {
      minWidth: contentMinWidth,
      flex: 1,
    };

    return (
      <div
        className={cn(
          baseClasses,
          defaultDirection,
          breakpointClass,
          spaceClass,
          className
        )}
        ref={ref}
        {...props}
      >
        {side === 'left' ? (
          <>
            <div style={sidebarStyles} className={`${noSidebarBreakpoint}:order-first`}>
              {sidebarContent}
            </div>
            <div style={contentStyles}>
              {mainContent}
            </div>
          </>
        ) : (
          <>
            <div style={contentStyles}>
              {mainContent}
            </div>
            <div style={sidebarStyles} className={`${noSidebarBreakpoint}:order-last`}>
              {sidebarContent}
            </div>
          </>
        )}
      </div>
    );
  }
);

Sidebar.displayName = 'Sidebar';

// Center Component - Centers content with max width
export interface CenterProps extends React.HTMLAttributes<HTMLDivElement> {
  maxWidth?: string | number;
  gutters?: ResponsiveValue<SpacingValue>;
  intrinsic?: boolean;
  children: React.ReactNode;
}

const Center = React.forwardRef<HTMLDivElement, CenterProps>(
  ({ className, maxWidth = '1200px', gutters = 4, intrinsic = false, children, ...props }, ref) => {
    const baseClasses = 'mx-auto';
    
    const gutterClass = typeof gutters === 'object' && gutters !== null
      ? Object.entries(gutters).map(([bp, val]) => {
          const prefix = bp === 'sm' ? '' : `${bp}:`;
          return `${prefix}px-${val}`;
        }).join(' ')
      : `px-${gutters}`;

    const intrinsicClasses = intrinsic ? 'flex flex-col items-center' : '';
    
    const styles: React.CSSProperties = {
      maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    };

    return (
      <div
        className={cn(
          baseClasses,
          gutterClass,
          intrinsicClasses,
          className
        )}
        style={styles}
        ref={ref}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Center.displayName = 'Center';

// Box Component - Generic container with responsive padding
export interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: ResponsiveValue<SpacingValue>;
  paddingX?: ResponsiveValue<SpacingValue>;
  paddingY?: ResponsiveValue<SpacingValue>;
  margin?: ResponsiveValue<SpacingValue>;
  marginX?: ResponsiveValue<SpacingValue>;
  marginY?: ResponsiveValue<SpacingValue>;
  children: React.ReactNode;
}

const Box = React.forwardRef<HTMLDivElement, BoxProps>(
  ({ 
    className,
    padding,
    paddingX, 
    paddingY,
    margin,
    marginX,
    marginY,
    children,
    ...props 
  }, ref) => {
    const paddingClass = padding ? getResponsiveSpacing('p', padding) : '';
    const paddingXClass = paddingX ? getResponsiveSpacing('px', paddingX) : '';
    const paddingYClass = paddingY ? getResponsiveSpacing('py', paddingY) : '';
    const marginClass = margin ? getResponsiveSpacing('m', margin) : '';
    const marginXClass = marginX ? getResponsiveSpacing('mx', marginX) : '';
    const marginYClass = marginY ? getResponsiveSpacing('my', marginY) : '';

    return (
      <div
        className={cn(
          paddingClass,
          paddingXClass,
          paddingYClass,
          marginClass,
          marginXClass,
          marginYClass,
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

Box.displayName = 'Box';

export {
  Stack,
  Cluster,
  Sidebar,
  Center,
  Box,
};

export default {
  Stack,
  Cluster,
  Sidebar,
  Center,
  Box,
};