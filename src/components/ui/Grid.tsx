import React from 'react';
import { cn } from '@/lib/utils';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  gapX?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  gapY?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  autoRows?: 'auto' | 'min' | 'max' | 'fr';
  autoFit?: boolean;
  autoFill?: boolean;
  children: React.ReactNode;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ 
    className, 
    cols = 1, 
    sm, 
    md, 
    lg, 
    xl,
    gap = 'md',
    gapX,
    gapY,
    autoRows = 'auto',
    autoFit = false,
    autoFill = false,
    children, 
    ...props 
  }, ref) => {
    const baseClasses = 'grid';
    
    // Column mapping for responsive grid
    const getColClass = (colCount: number, prefix = '') => {
      const classPrefix = prefix ? `${prefix}:` : '';
      if (autoFit) return `${classPrefix}grid-cols-[repeat(auto-fit,minmax(250px,1fr))]`;
      if (autoFill) return `${classPrefix}grid-cols-[repeat(auto-fill,minmax(250px,1fr))]`;
      return `${classPrefix}grid-cols-${colCount}`;
    };

    const columnClasses = [
      getColClass(cols),
      sm && getColClass(sm, 'sm'),
      md && getColClass(md, 'md'), 
      lg && getColClass(lg, 'lg'),
      xl && getColClass(xl, 'xl'),
    ].filter(Boolean);

    // Gap mapping
    const gaps = {
      none: 'gap-0',
      xs: 'gap-1',
      sm: 'gap-2', 
      md: 'gap-4',
      lg: 'gap-6',
      xl: 'gap-8',
      '2xl': 'gap-12',
    };

    const gapXClasses = {
      none: 'gap-x-0',
      xs: 'gap-x-1',
      sm: 'gap-x-2',
      md: 'gap-x-4', 
      lg: 'gap-x-6',
      xl: 'gap-x-8',
      '2xl': 'gap-x-12',
    };

    const gapYClasses = {
      none: 'gap-y-0',
      xs: 'gap-y-1',
      sm: 'gap-y-2',
      md: 'gap-y-4',
      lg: 'gap-y-6', 
      xl: 'gap-y-8',
      '2xl': 'gap-y-12',
    };

    // Auto rows mapping
    const autoRowsClasses = {
      auto: 'grid-rows-auto',
      min: 'grid-rows-min',
      max: 'grid-rows-max', 
      fr: 'grid-rows-1',
    };

    const gapClass = gapX || gapY ? '' : gaps[gap];
    const gapXClass = gapX ? gapXClasses[gapX] : '';
    const gapYClass = gapY ? gapYClasses[gapY] : '';

    return (
      <div
        className={cn(
          baseClasses,
          ...columnClasses,
          gapClass,
          gapXClass,
          gapYClass,
          autoRowsClasses[autoRows],
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

Grid.displayName = 'Grid';

export interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  spanSm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  spanMd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  spanLg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  spanXl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 'full';
  rowSpan?: 1 | 2 | 3 | 4 | 5 | 6 | 'full';
  start?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 'auto';
  end?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 'auto';
  children: React.ReactNode;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(
  ({ 
    className, 
    span = 1, 
    spanSm,
    spanMd,
    spanLg, 
    spanXl,
    rowSpan,
    start,
    end,
    children, 
    ...props 
  }, ref) => {
    const getSpanClass = (spanCount: number | 'full', prefix = '') => {
      const classPrefix = prefix ? `${prefix}:` : '';
      if (spanCount === 'full') return `${classPrefix}col-span-full`;
      return `${classPrefix}col-span-${spanCount}`;
    };

    const getStartClass = (startPos: number | 'auto', prefix = '') => {
      const classPrefix = prefix ? `${prefix}:` : '';
      if (startPos === 'auto') return `${classPrefix}col-start-auto`;
      return `${classPrefix}col-start-${startPos}`;
    };

    const getEndClass = (endPos: number | 'auto', prefix = '') => {
      const classPrefix = prefix ? `${prefix}:` : '';
      if (endPos === 'auto') return `${classPrefix}col-end-auto`;
      return `${classPrefix}col-end-${endPos}`;
    };

    const spanClasses = [
      getSpanClass(span),
      spanSm && getSpanClass(spanSm, 'sm'),
      spanMd && getSpanClass(spanMd, 'md'),
      spanLg && getSpanClass(spanLg, 'lg'), 
      spanXl && getSpanClass(spanXl, 'xl'),
    ].filter(Boolean);

    const rowSpanClass = rowSpan ? (rowSpan === 'full' ? 'row-span-full' : `row-span-${rowSpan}`) : '';
    const startClass = start ? getStartClass(start) : '';
    const endClass = end ? getEndClass(end) : '';

    return (
      <div
        className={cn(
          ...spanClasses,
          rowSpanClass,
          startClass,
          endClass,
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

GridItem.displayName = 'GridItem';

export { Grid, GridItem };
export default Grid;