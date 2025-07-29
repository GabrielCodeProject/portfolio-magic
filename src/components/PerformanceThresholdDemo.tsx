'use client';

import React, { useEffect, useState } from 'react';
import { getDeviceCapabilities } from '@/utils/deviceCapabilities';
import { 
  getPerformanceTier, 
  getThresholdConfigForDevice, 
  PERFORMANCE_THRESHOLDS,
  type PerformanceTier 
} from '@/utils/performanceThresholds';

/**
 * Development component to demonstrate the performance threshold system
 * Shows current device tier and what components would be enabled
 */
export function PerformanceThresholdDemo() {
  const [currentTier, setCurrentTier] = useState<PerformanceTier | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    if (typeof window !== 'undefined') {
      const capabilities = getDeviceCapabilities();
      const tier = getPerformanceTier(capabilities);
      setCurrentTier(tier);
    }
  }, []);

  // Don't render on server to avoid hydration mismatch
  if (!isClient) {
    return null;
  }

  const capabilities = getDeviceCapabilities();
  const thresholdConfig = getThresholdConfigForDevice(capabilities);

  return (
    <div className="fixed bottom-4 left-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono max-w-sm z-50">
      <h3 className="font-bold mb-2 text-sm">Performance Threshold System</h3>
      
      <div className="mb-3">
        <div className="text-yellow-400 font-semibold">
          Current Tier: {currentTier?.toUpperCase()}
        </div>
        <div className="text-gray-300">
          Device: {capabilities.class}
        </div>
      </div>

      <div className="mb-3">
        <div className="font-semibold mb-1">Enabled Components:</div>
        <div className="pl-2">
          <div className={thresholdConfig.components.candles ? 'text-green-400' : 'text-red-400'}>
            🕯️ Candles: {thresholdConfig.components.candles ? 'YES' : 'NO'}
          </div>
          <div className={thresholdConfig.components.portraits ? 'text-green-400' : 'text-red-400'}>
            🖼️ Portraits: {thresholdConfig.components.portraits ? 'YES' : 'NO'}
          </div>
          <div className={thresholdConfig.components.snitch ? 'text-green-400' : 'text-red-400'}>
            ⚡ Snitch: {thresholdConfig.components.snitch ? 'YES' : 'NO'}
          </div>
        </div>
      </div>

      <div className="mb-3">
        <div className="font-semibold mb-1">Settings:</div>
        <div className="pl-2 text-xs">
          <div>Max Candles: {thresholdConfig.renderingSettings.maxCandles}</div>
          <div>Shadows: {thresholdConfig.renderingSettings.enableShadows ? 'ON' : 'OFF'}</div>
          <div>Particles: {thresholdConfig.renderingSettings.enableParticles ? 'ON' : 'OFF'}</div>
          <div>Quality: {thresholdConfig.renderingSettings.textureQuality}</div>
        </div>
      </div>

      <div className="border-t border-gray-600 pt-2 mt-2">
        <div className="font-semibold mb-1 text-xs">All Tiers:</div>
        {PERFORMANCE_THRESHOLDS.map((threshold) => (
          <div 
            key={threshold.tier}
            className={`text-xs px-1 ${
              threshold.tier === currentTier 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-400'
            }`}
          >
            {threshold.tier}: {threshold.minScore}-{threshold.maxScore}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PerformanceThresholdDemo;