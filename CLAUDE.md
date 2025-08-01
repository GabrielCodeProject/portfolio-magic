# Harry Potter Portfolio - Comprehensive Project Documentation

## 🎯 Project Overview

This is a **Next.js 15.4.4** Harry Potter-themed portfolio website featuring immersive 3D graphics, dual house theming (Slytherin vs Gryffindor), and modern web technologies. The project showcases advanced React patterns, Three.js integration, and performance optimization techniques.

### Key Features

- 🎭 **3D Magic**: Interactive floating candles, moving portraits, and Golden Snitch
- 📱 **Responsive Design**: Mobile-first approach with magical animations
- 🔍 **SEO Ready**: Static export with comprehensive meta tags

---

## 🏗️ Architecture Overview

### Application Structure

```
Next.js 15.4.4 (App Router)
├── Static Export Configuration
├── React 19.1.0 + TypeScript 5
├── Three.js/React Three Fiber (3D Graphics)
├── Tailwind CSS 4 (Styling)
├── Dual Theme System (CSS Variables)
└── Performance Optimizations
```

### Core Design Patterns

- **Component-Based Architecture**: Modular, reusable components
- **Custom Hook Pattern**: Centralized logic (useTheme, useIntersectionObserver)
- **Provider Pattern**: Theme context management
- **Lazy Loading Pattern**: Performance-optimized 3D components
- **Error Boundary Pattern**: Graceful 3D fallbacks
- **Static Generation**: Optimized for GitHub Pages deployment

---

## 📁 Project Structure

```
portfolio-magic/
├── src/
│   ├── app/                     # Next.js App Router
│   │   ├── layout.tsx          # Root layout with theme provider
│   │   ├── page.tsx            # Main portfolio page
│   │   └── globals.css         # Global styles & CSS variables
│   │
│   ├── components/             # React Components
│   │   ├── 3D/                # Three.js/R3F Components
│   │   │   ├── ThreeScene.tsx  # Main 3D scene wrapper
│   │   │   ├── FloatingCandles.tsx
│   │   │   ├── MovingPortraits.tsx
│   │   │   ├── GoldenSnitch.tsx
│   │   │   └── Lazy3DWrapper.tsx # Performance optimization
│   │   │
│   │   ├── ui/                 # Reusable UI Components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── LoadingSpinner.tsx
│   │   │   └── MagicalEffects.tsx
│   │   │
│   │   ├── Hero.tsx            # Portfolio sections
│   │   ├── About.tsx
│   │   ├── Projects.tsx
│   │   ├── Services.tsx
│   │   ├── Navigation.tsx
│   │   ├── ThemeProvider.tsx   # Theme context management
│   │   └── ThemeToggle.tsx     # House switching component
│   │
│   ├── hooks/                  # Custom React Hooks
│   │   ├── useTheme.ts         # Theme management
│   │   └── useIntersectionObserver.ts
│   │
│   ├── lib/                    # Utility Libraries
│   │   ├── constants.ts        # App configuration
│   │   ├── theme.ts           # Theme utilities
│   │   ├── magical-utils.ts   # UI effect utilities
│   │   └── utils.ts           # General utilities
│   │
│   ├── data/                   # Static Data
│   │   ├── projects.ts         # Portfolio projects
│   │   └── services.ts         # Service offerings
│   │
│   └── types/                  # TypeScript Definitions
│       └── index.ts            # Global type definitions
│
├── public/                     # Static Assets
├── tests/                      # E2E Tests (Playwright)
└── Configuration Files
    ├── next.config.ts          # Next.js configuration
    ├── tailwind.config.js      # Tailwind CSS setup
    ├── jest.config.mjs         # Jest testing setup
    └── playwright.config.ts    # E2E testing setup
```

---

#### CSS Variables System (`src/app/globals.css`)

- **Dynamic Theme Variables**: CSS custom properties that update based on theme
- **Magical Color Palette**: Specialized colors for magical effects
- **Responsive Typography**: Font families (Cinzel, Philosopher, Uncial Antiqua)
- **Animation Keyframes**: Custom animations for magical effects

#### Theme Provider (`src/components/ThemeProvider.tsx`)

- **Context-based State Management**: React Context for theme state
- **Local Storage Persistence**: Theme preference saved across sessions
- **Hydration Safe**: Prevents SSR/client mismatch issues
- **TypeScript Integration**: Fully typed theme system

---

## 🎭 3D Graphics Architecture

### Three.js/React Three Fiber Setup

#### Core 3D Scene (`src/components/3D/ThreeScene.tsx`)

```typescript
// Key Features:
- WebGL Support Detection
- Reduced Motion Support
- Performance Monitoring
- Error Boundaries
- Responsive Pixel Ratio
- Shadow Mapping
- Fog Effects
```

#### 3D Components

1. **FloatingCandles.tsx**
   - Floating animation with physics
   - Dynamic lighting effects
   - Configurable count and spread
   - Performance-optimized instancing

2. **MovingPortraits.tsx**
   - Portrait frame animations
   - Interactive hover effects
   - Staggered loading animations

3. **GoldenSnitch.tsx**
   - Complex flight patterns
   - Boundary constraints
   - Interactive mouse following
   - Particle trail effects

---

### Key Configuration Files

#### Next.js Configuration (`next.config.ts`)

- **Static Export**: `output: 'export'` for GitHub Pages
- **Trailing Slash**: GitHub Pages routing compatibility
- **Three.js Transpilation**: `transpilePackages: ['three']`
- **Image Optimization**: Disabled for static export
- **Webpack Fallbacks**: Node.js polyfills for client-side

---

## 🎯 Development Guidelines

### Component Creation Guidelines

#### Standard Component Template

```typescript
'use client'; // If client-side only

import React from 'react';
import { cn } from '@/lib/utils';

interface ComponentProps {
  // Props with clear types
  className?: string;
  children?: React.ReactNode;
}

export default function Component({
  className,
  children,
  ...props
}: ComponentProps) {
  return (
    <div className={cn('base-classes', className)} {...props}>
      {children}
    </div>
  );
}
```

#### 3D Component Best Practices

```typescript
// 1. Always wrap in Suspense
<Suspense fallback={<LoadingSpinner />}>
  <ThreeDComponent />
</Suspense>

// 2. Use lazy loading for performance
const LazyComponent = createLazy3DComponent(
  () => import('./Component'),
  { loadPriority: 'medium' }
);

// 3. Include error boundaries
export function ComponentWithErrorBoundary(props) {
  try {
    return <Component {...props} />;
  } catch (error) {
    return <ErrorFallback error={error} />;
  }
}

// 4. Respect user preferences
const prefersReducedMotion = useReducedMotion();
if (prefersReducedMotion) return <StaticFallback />;
```

### Performance Considerations

#### 3D Component Optimization

1. **Lazy Loading**: Load 3D components only when needed
2. **Priority Loading**: Stagger loading by importance
3. **Intersection Observer**: Load based on viewport visibility
4. **WebGL Detection**: Provide fallbacks for unsupported devices
5. **Reduced Motion**: Respect user accessibility preferences

#### Bundle Optimization

1. **Dynamic Imports**: Split code at component level
2. **Tree Shaking**: Import only needed utilities
3. **Static Export**: Pre-render all possible pages
4. **Image Optimization**: Disabled for static export compatibility

## 📚 Learning Resources

### Next.js & React

- [Next.js App Router Documentation](https://nextjs.org/docs)
- [React 19 Features](https://react.dev/)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)

### 3D Graphics

- [React Three Fiber Documentation](https://docs.pmnd.rs/react-three-fiber)
- [Three.js Fundamentals](https://threejs.org/docs/)
- [WebGL Performance Optimization](https://web.dev/webgl-performance/)

### Styling & Design

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)
- [Accessible Design Patterns](https://www.w3.org/WAI/ARIA/apg/)

---

_This documentation provides comprehensive context for working with the Harry Potter Portfolio codebase. For specific implementation details, refer to the component files and their accompanying tests._
