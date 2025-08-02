'use client';

import React from 'react';
import { useDevicePerformance } from '@/hooks/useDevicePerformance';

interface MobileLoadingIndicatorProps {
  isLoading: boolean;
  progress?: number;
  message?: string;
  className?: string;
}

/**
 * Mobile-optimized loading indicator that provides appropriate feedback
 * for 3D content loading on mobile devices with battery considerations
 */
export default function MobileLoadingIndicator({
  isLoading,
  progress = 0,
  message = 'Loading magical experience...',
  className = '',
}: MobileLoadingIndicatorProps) {
  const devicePerformance = useDevicePerformance();

  if (!isLoading) return null;

  // Different messaging based on device performance
  const getLoadingMessage = () => {
    if (devicePerformance.isLowPowerDevice) {
      return 'Optimizing for your device...';
    }
    if (devicePerformance.isMobile) {
      return 'Preparing mobile experience...';
    }
    return message;
  };

  return (
    <div className={`
      fixed inset-0 z-50 
      bg-theme-primary/20 backdrop-blur-sm
      flex items-center justify-center
      ${className}
    `}>
      <div className="
        bg-theme-card border border-theme-border-primary
        rounded-lg p-6 max-w-sm mx-4
        backdrop-filter backdrop-blur-md
        shadow-magical
      ">
        {/* Loading Spinner - Battery-friendly animation */}
        <div className="relative w-12 h-12 mx-auto mb-4">
          <div className="
            absolute inset-0 rounded-full border-2 
            border-theme-primary/20
          "></div>
          <div className="
            absolute inset-0 rounded-full border-2 border-transparent
            border-t-theme-primary
            animate-spin
            transition-opacity duration-300
          "></div>
          
          {/* Progress indicator for mobile */}
          {devicePerformance.isMobile && progress > 0 && (
            <div className="
              absolute inset-2 rounded-full 
              flex items-center justify-center
              text-xs font-medium text-theme-text-primary
            ">
              {Math.round(progress)}%
            </div>
          )}
        </div>

        {/* Loading Message */}
        <p className="
          text-center text-theme-text-secondary 
          text-sm font-medium mb-2
        ">
          {getLoadingMessage()}
        </p>

        {/* Performance-specific hints */}
        {devicePerformance.isLowPowerDevice && (
          <p className="
            text-center text-theme-text-muted 
            text-xs leading-relaxed
          ">
            We're reducing visual effects to preserve your battery life
          </p>
        )}

        {/* Progress Bar for Mobile */}
        {devicePerformance.isMobile && (
          <div className="mt-3">
            <div className="
              w-full h-1 bg-theme-bg-secondary 
              rounded-full overflow-hidden
            ">
              <div 
                className="
                  h-full bg-gradient-to-r 
                  from-theme-primary to-theme-secondary
                  rounded-full transition-all duration-300 ease-out
                "
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Device-specific loading tips */}
        {devicePerformance.isMobile && (
          <div className="mt-4 text-center">
            <p className="text-xs text-theme-text-muted">
              💡 Tip: Rotate to landscape for the best experience
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Lightweight loading skeleton for 3D component placeholders
 */
export function Mobile3DLoadingSkeleton({ className = '' }: { className?: string }) {
  const devicePerformance = useDevicePerformance();

  return (
    <div className={`
      animate-pulse bg-theme-bg-card
      border border-theme-border-primary rounded-lg
      ${className}
    `}>
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-theme-primary/50 rounded-full animate-magical-pulse" />
          <div className="h-2 bg-theme-bg-secondary rounded flex-1" />
        </div>
        
        {!devicePerformance.isLowPowerDevice && (
          <>
            <div className="h-2 bg-theme-bg-secondary rounded w-3/4" />
            <div className="h-2 bg-theme-bg-secondary rounded w-1/2" />
          </>
        )}
        
        <div className="text-center pt-2">
          <span className="text-xs text-theme-text-muted">
            {devicePerformance.isMobile ? 'Loading mobile view...' : 'Loading 3D scene...'}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Progressive loading component that shows different content based on loading state
 */
export function ProgressiveLoader({
  isLoading,
  loadingComponent,
  children,
  fallbackComponent,
}: {
  isLoading: boolean;
  loadingComponent: React.ReactNode;
  children: React.ReactNode;
  fallbackComponent?: React.ReactNode;
}) {
  const devicePerformance = useDevicePerformance();

  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  // On very low performance devices, show fallback if available
  if (devicePerformance.isLowPowerDevice && fallbackComponent) {
    return <>{fallbackComponent}</>;
  }

  return <>{children}</>;
}