// 3D Scene Components
export { default as ThreeScene, ThreeSceneWithErrorBoundary } from './ThreeScene';
export { default as FloatingCandles } from './FloatingCandles';
export { default as MovingPortraits } from './MovingPortraits';
export { default as GoldenSnitch } from './GoldenSnitch';

// Enhanced Lazy Loading with Fallback Support
export { 
  default as Lazy3DWrapper, 
  createLazy3DComponent,
  FloatingCandlesLazy,
  MovingPortraitsLazy,
  GoldenSnitchLazy,
  LazyFloatingCandles,
  LazyMovingPortraits,
  LazyGoldenSnitch
} from './Lazy3DWrapper';

// Fallback System
export {
  FallbackProvider,
  ComponentFallback,
  FloatingCandlesWithFallback,
  MovingPortraitsWithFallback,
  GoldenSnitchWithFallback,
  usePerformanceMonitoring,
  useFallback
} from './FallbackHandler';

// 2D Fallback Components
export {
  FloatingCandlesFallback,
  MovingPortraitsFallback,
  GoldenSnitchFallback,
  FallbackNotification
} from '../ui/MagicalFallbacks';
