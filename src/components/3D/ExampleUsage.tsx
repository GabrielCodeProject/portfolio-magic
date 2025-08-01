'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { 
  CanvasProvider,
  EnhancedThreeErrorBoundary,
  EnhancedClientPerformanceGate
} from './ContextAwareFallback';

// Example fallback components
const CandlesFallback = () => (
  <div className="flex items-center justify-center p-8 bg-gradient-to-br from-amber-900/20 to-orange-900/20 rounded-lg border border-amber-500/30">
    <div className="text-center">
      <div className="text-4xl mb-3">🕯️</div>
      <h3 className="text-amber-200 font-medium mb-2">Floating Candles</h3>
      <p className="text-amber-300/70 text-sm">
        Magical floating candles would appear here on supported devices
      </p>
    </div>
  </div>
);

const PortraitsFallback = () => (
  <div className="flex items-center justify-center p-8 bg-gradient-to-br from-purple-900/20 to-blue-900/20 rounded-lg border border-purple-500/30">
    <div className="text-center">
      <div className="text-4xl mb-3">🖼️</div>
      <h3 className="text-purple-200 font-medium mb-2">Moving Portraits</h3>
      <p className="text-purple-300/70 text-sm">
        Enchanted moving portraits would be displayed here
      </p>
    </div>
  </div>
);

// Example 3D component (placeholder)
const Example3DComponent = ({ type }: { type: 'candles' | 'portraits' }) => (
  <group>
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial color={type === 'candles' ? '#fbbf24' : '#8b5cf6'} />
    </mesh>
  </group>
);

// Example usage patterns
export function BasicUsageExample() {
  return (
    <div className="w-full h-96 bg-gray-950 rounded-lg overflow-hidden">
      <Canvas>
        <CanvasProvider>
          <EnhancedThreeErrorBoundary
            componentName="BasicExample"
            fallbackComponent={<CandlesFallback />}
          >
            <Example3DComponent type="candles" />
          </EnhancedThreeErrorBoundary>
        </CanvasProvider>
      </Canvas>
    </div>
  );
}

export function PerformanceGatedExample() {
  return (
    <div className="w-full h-96 bg-gray-950 rounded-lg overflow-hidden">
      <Canvas>
        <CanvasProvider>
          <EnhancedClientPerformanceGate
            htmlFallback={<PortraitsFallback />}
            componentType="portraits"
          >
            <EnhancedThreeErrorBoundary
              componentName="PerformanceGatedExample"
              fallbackComponent={<PortraitsFallback />}
            >
              <Example3DComponent type="portraits" />
            </EnhancedThreeErrorBoundary>
          </EnhancedClientPerformanceGate>
        </CanvasProvider>
      </Canvas>
    </div>
  );
}

export function LazyWrapperExample() {
  return (
    <div className="w-full h-96 bg-gray-950 rounded-lg overflow-hidden">
      <Canvas>
        <CanvasProvider>
          <EnhancedThreeErrorBoundary
            componentName="LazyExample"
            fallbackComponent={<CandlesFallback />}
          >
            <Example3DComponent type="candles" />
          </EnhancedThreeErrorBoundary>
        </CanvasProvider>
      </Canvas>
    </div>
  );
}

// Complete application example
export function CompleteAppExample() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Context-Aware Fallback Examples</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Basic Error Boundary</h3>
          <BasicUsageExample />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-300 mb-2">Performance Gated</h3>
          <PerformanceGatedExample />
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">Error Boundary Example</h3>
        <LazyWrapperExample />
      </div>
    </div>
  );
}

export default CompleteAppExample;