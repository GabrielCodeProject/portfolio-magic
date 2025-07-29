// Export all fallback components for easy importing
export { default as CandlesFallback } from './CandlesFallback';
export { default as PortraitsFallback } from './PortraitsFallback';
export { default as SnitchFallback } from './SnitchFallback';
export { default as SnitchFallbackCSSOnly } from './SnitchFallbackCSSOnly';

// Fallback component mapping for easy lookup
export const FALLBACK_COMPONENTS = {
  candles: 'CandlesFallback',
  portraits: 'PortraitsFallback',
  snitch: 'SnitchFallback',
  snitchCSSOnly: 'SnitchFallbackCSSOnly',
} as const;

export type FallbackComponentType = keyof typeof FALLBACK_COMPONENTS;