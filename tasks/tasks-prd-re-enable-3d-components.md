# Task List: Re-enable 3D Components (GitHub Pages Compatible)

## Relevant Files

- `src/components/3D/ThreeErrorBoundary.tsx` - Error boundary component wrapper for 3D components with client-side error logging
- `src/components/3D/ThreeErrorBoundary.test.tsx` - Unit tests for error boundary
- `src/components/ClientPerformanceGate.tsx` - Client-side performance monitoring component for static sites
- `src/components/ClientPerformanceGate.test.tsx` - Unit tests for client-side performance gate
- `src/components/3D/fallbacks/CandlesFallback.tsx` - 2D fallback component for FloatingCandles with CSS animations
- `src/components/3D/fallbacks/PortraitsFallback.tsx` - 2D fallback component for MovingPortraits with interactive eye tracking
- `src/components/3D/fallbacks/SnitchFallback.tsx` - 2D fallback component for GoldenSnitch with intelligent flight AI
- `src/components/3D/fallbacks/index.ts` - Export file for all fallback components
- `src/components/3D/fallbacks/FallbackWrapper.tsx` - Unified wrapper with automatic theme integration
- `src/components/3D/fallbacks/fallbacks.test.tsx` - Unit tests for all fallback components
- `src/hooks/useClientGPUDetection.ts` - Client-side hook for detecting device capabilities (no external deps)
- `src/hooks/useClientGPUDetection.test.ts` - Unit tests for client-side GPU detection
- `src/hooks/useClientPerformanceMonitor.ts` - Client-side hook for monitoring frame rate using RAF
- `src/hooks/useClientPerformanceMonitor.test.ts` - Unit tests for client-side performance monitoring
- `src/utils/deviceCapabilities.ts` - Utility functions for client-side device detection
- `src/utils/deviceCapabilities.test.ts` - Unit tests for device capability detection
- `src/utils/errorLogger.ts` - Enhanced client-side error logging utility with component identification
- `src/app/page.tsx` - Main page component where 3D components need to be uncommented progressively
- `src/components/3D/FloatingCandles.test.tsx` - Unit tests for FloatingCandles component
- `src/components/3D/MovingPortraits.test.tsx` - Unit tests for MovingPortraits component  
- `src/components/3D/GoldenSnitch.test.tsx` - Unit tests for GoldenSnitch component
- `next.config.ts` - Update Next.js config for static export and GitHub Pages compatibility
- `package.json` - Add @react-three/test-renderer for testing (no server-side dependencies)
- `tests/error-boundary.spec.ts` - Playwright tests for error boundary functionality and fallback UI
- `tests/fallback-components.spec.ts` - Playwright tests for fallback component rendering and static build compatibility
- `tests/progressive-enhancement.spec.ts` - Playwright tests for CSS-only animations without JavaScript
- `tests/test-summary.md` - Comprehensive test results and static build readiness assessment
- `tests/progressive-enhancement-summary.md` - Progressive enhancement test results and achievements

### Notes

- Unit tests should typically be placed alongside the code files they are testing (e.g., `MyComponent.tsx` and `MyComponent.test.tsx` in the same directory).
- Use `npx jest [optional/path/to/test/file]` to run tests. Running without a path executes all tests found by the Jest configuration.
- Use React Three Test Renderer for testing 3D components: `@react-three/test-renderer`
- **GitHub Pages Compatibility**: All performance monitoring and device detection must be client-side only
- **No Server Dependencies**: Avoid any Node.js-specific APIs or server-side functionality
- **Static Export Ready**: Ensure all components work with Next.js static export (`output: 'export'`)

## Tasks

- [ ] 1.0 Set up Client-Side Performance Monitoring Infrastructure
  - [x] 1.1 Configure Next.js for static export and GitHub Pages deployment in `next.config.ts`
  - [x] 1.2 Create `useClientGPUDetection` hook using WebGL context and canvas fingerprinting (no external deps)
  - [x] 1.3 Create `useClientPerformanceMonitor` hook using requestAnimationFrame for FPS tracking
  - [x] 1.4 Implement `deviceCapabilities.ts` utility with client-side device detection methods
  - [x] 1.5 Implement `ClientPerformanceGate` component that conditionally renders 3D components based on client detection
  - [x] 1.6 Add client-side performance thresholds (low-end: disable all, mid-range: candles only, high-end: all components)
  - [x] 1.7 Add FPS monitoring with 30 FPS threshold and 5-second sustained check using RAF
  - [x] 1.8 Create localStorage-based performance metrics storage for development mode
  - [x] 1.9 Test static export compatibility (`npm run build && npm run export`)

- [ ] 2.0 Create Error Boundaries and Fallback Components
  - [x] 2.1 Create `ThreeErrorBoundary` component with client-side error logging to localStorage
  - [x] 2.2 Implement `CandlesFallback` component with CSS-animated flame icons (static-compatible)
  - [x] 2.3 Implement `PortraitsFallback` component with static portrait images and CSS hover effects
  - [x] 2.4 Implement `SnitchFallback` component with CSS-animated golden orb using transforms
  - [x] 2.5 Ensure fallback components maintain visual theme and layout consistency for static export
  - [x] 2.6 Add client-side error logging with component identification to console and localStorage
  - [x] 2.7 Test error boundary activation and fallback component rendering in static build
  - [x] 2.8 Ensure all fallback animations work without JavaScript (progressive enhancement)

- [ ] 3.0 Implement Automated Testing Framework (Static-Compatible)
  - [x] 3.1 Set up React Three Test Renderer for 3D component testing (install `@react-three/test-renderer`)
  - [x] 3.2 Create unit tests for `FloatingCandles` component (mounting, unmounting, interactions)
  - [x] 3.3 Create unit tests for `MovingPortraits` component (mounting, unmounting, interactions)
  - [x] 3.4 Create unit tests for `GoldenSnitch` component (mounting, unmounting, interactions)
  - [ ] 3.5 Create unit tests for `ThreeErrorBoundary` (error catching, fallback rendering, localStorage logging)
  - [ ] 3.6 Create unit tests for `ClientPerformanceGate` (client-side detection, conditional rendering)
  - [ ] 3.7 Create unit tests for all fallback components (rendering, CSS animations, progressive enhancement)
  - [ ] 3.8 Create unit tests for client-side performance monitoring hooks (RAF-based FPS tracking)
  - [ ] 3.9 Create unit tests for device capability detection utilities (WebGL context testing)
  - [ ] 3.10 Test static export build process with Jest (ensure tests pass in static context)
  - [ ] 3.11 Achieve 90%+ test coverage for all 3D-related components and hooks

- [ ] 4.0 Progressive Re-enabling of 3D Components (Static-Compatible)
  - [ ] 4.1 Wrap existing 3D components with `ThreeErrorBoundary` and `ClientPerformanceGate`
  - [ ] 4.2 Re-enable `LazyFloatingCandles` component in `src/app/page.tsx` with client-side gating
  - [ ] 4.3 Test FloatingCandles in development (`npm run dev`) - no console errors, proper rendering
  - [ ] 4.4 Test FloatingCandles in static export (`npm run export`) - verify compatibility
  - [ ] 4.5 Run automated tests for FloatingCandles and verify all pass
  - [ ] 4.6 Re-enable `LazyMovingPortraits` component in `src/app/page.tsx` with client-side gating
  - [ ] 4.7 Test MovingPortraits in development and static export (no errors, interactions working)
  - [ ] 4.8 Run automated tests for MovingPortraits and verify all pass
  - [ ] 4.9 Re-enable `LazyGoldenSnitch` component in `src/app/page.tsx` with client-side gating
  - [ ] 4.10 Test GoldenSnitch in development and static export (no errors, animations working)
  - [ ] 4.11 Run automated tests for GoldenSnitch and verify all pass
  - [ ] 4.12 Test fallback components activate correctly on simulated low-end devices

- [ ] 5.0 Integration Testing and GitHub Pages Deployment
  - [ ] 5.1 Run full test suite to ensure no regressions in existing functionality
  - [ ] 5.2 Test client-side performance detection on different simulated device capabilities
  - [ ] 5.3 Verify error boundaries activate correctly when 3D components fail in static build
  - [ ] 5.4 Test fallback components display correctly when 3D is disabled by client detection
  - [ ] 5.5 Verify RAF-based FPS monitoring triggers component complexity reduction
  - [ ] 5.6 Test progressive loading behavior in static export with network throttling
  - [ ] 5.7 Validate that disabling components doesn't break page layout in static build
  - [ ] 5.8 Test static export process (`npm run export`) with all 3D components enabled
  - [ ] 5.9 Deploy to GitHub Pages and test in production environment
  - [ ] 5.10 Document rollback procedure for GitHub Pages (reverting commits, re-commenting components)
  - [ ] 5.11 Create GitHub Pages deployment checklist (static export validation, CNAME, etc.)
  - [ ] 5.12 Verify all success metrics in GitHub Pages environment (zero errors, >30 FPS, 100% fallback success, 90%+ test coverage)
  - [ ] 5.13 Test cross-browser compatibility on GitHub Pages (Chrome, Firefox, Safari, Edge)