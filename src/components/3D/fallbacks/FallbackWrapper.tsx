'use client';

import React from 'react';

import { useTheme } from '@/hooks/useTheme';
import { Theme } from '@/lib/constants';
import { errorLogger } from '@/utils/errorLogger';

import CandlesFallback from './CandlesFallback';
import PortraitsFallback from './PortraitsFallback';
import SnitchFallback from './SnitchFallback';

interface FallbackWrapperProps {
  componentType: 'candles' | 'portraits' | 'snitch';
  count?: number;
  enableInteractivity?: boolean;
  enableTrailEffects?: boolean;
  bounds?: {
    x: [number, number];
    y: [number, number];
  };
  speed?: number;
  scale?: number;
}

// Convert theme constants to fallback theme strings
const getThemeString = (theme: Theme): 'slytherin' | 'gryffindor' | 'default' => {
  switch (theme) {
    case 'slytherin':
      return 'slytherin';
    case 'gryffindor':
      return 'gryffindor';
    default:
      return 'default';
  }
};

export default function FallbackWrapper({
  componentType,
  count,
  enableInteractivity = true,
  enableTrailEffects = true,
  bounds,
  speed = 1,
  scale = 1,
}: FallbackWrapperProps) {
  const { theme } = useTheme();
  const fallbackTheme = getThemeString(theme);

  // Error boundary for fallback components
  const handleFallbackError = (error: Error, componentName: string) => {
    errorLogger.logFallbackError(error, `${componentName}Fallback`, 'low');
    console.warn(`Fallback component error in ${componentName}:`, error);
  };

  // Render the appropriate fallback component with consistent theming
  try {
    switch (componentType) {
      case 'candles':
        return (
          <div className="w-full h-full relative">
            <CandlesFallback 
              count={count}
              theme={fallbackTheme}
            />
          </div>
        );
      
      case 'portraits':
        return (
          <div className="w-full h-full relative">
            <PortraitsFallback
              count={count}
              theme={fallbackTheme}
              enableInteractivity={enableInteractivity}
            />
          </div>
        );
      
      case 'snitch':
        return (
          <div className="w-full h-full relative">
            <SnitchFallback
              bounds={bounds}
              speed={speed}
              scale={scale}
              theme={fallbackTheme}
              enableTrailEffects={enableTrailEffects}
            />
          </div>
        );
      
      default:
        // Log unknown component type as an error
        const unknownError = new Error(`Unknown component type: ${componentType}`);
        handleFallbackError(unknownError, 'FallbackWrapper');
        
        return (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-yellow-400 mb-2">⚠️</div>
              <p className="text-gray-400 text-sm">
                Unknown component type: {componentType}
              </p>
              {process.env.NODE_ENV === 'development' && (
                <p className="text-gray-500 text-xs mt-2">
                  Check console for details
                </p>
              )}
            </div>
          </div>
        );
    }
  } catch (error) {
    // Catch any rendering errors in fallback components
    handleFallbackError(error as Error, componentType);
    
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 mb-2">🚫</div>
          <p className="text-gray-400 text-sm">
            Fallback component failed
          </p>
          {process.env.NODE_ENV === 'development' && (
            <p className="text-gray-500 text-xs mt-2">
              Error: {(error as Error).message}
            </p>
          )}
        </div>
      </div>
    );
  }
}