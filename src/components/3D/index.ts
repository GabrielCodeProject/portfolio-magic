// 3D Scene Components
export { default as ThreeScene, ThreeSceneWithErrorBoundary } from './ThreeScene';
export { default as FloatingCandles } from './FloatingCandles';
export { default as MovingPortraits } from './MovingPortraits';
export { default as GoldenSnitch } from './GoldenSnitch';

// Legacy lazy loading utilities (deprecated - use Enhanced versions)
export { default as Lazy3DWrapper, withLazy3D, createLazy3DComponent } from './Lazy3DWrapper';

// Note: Some enhanced components temporarily disabled due to missing dependencies
// Enable them when implementing the full solution

// Error boundary (legacy)
export { default as ThreeErrorBoundary } from './ThreeErrorBoundary';

// Context-Aware Fallback System (New Long-term Solution)
export {
  default as ContextAwareFallback,
  CanvasProvider,
  useIsInCanvas,
  EnhancedThreeErrorBoundary as ContextAwareErrorBoundary,
  EnhancedClientPerformanceGate as ContextAwarePerformanceGate,
  EnhancedLazy3DWrapper as ContextAwareLazy3DWrapper
} from './ContextAwareFallback';

// Usage examples
export {
  default as CompleteAppExample,
  BasicUsageExample,
  PerformanceGatedExample,
  LazyWrapperExample
} from './ExampleUsage';
