'use client';

import dynamic from 'next/dynamic';

import { createLazy3DComponent } from '@/components/3D';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Skills from '@/components/Skills';

// High priority: Core ThreeScene (loads immediately when visible)
const ThreeScene = dynamic(() => import('@/components/3D/ThreeScene'), {
  ssr: false,
  loading: () => null, // Avoid HTML elements in Canvas context
});

// High priority: Atmospheric effects (loads first for immediate ambiance)
const LazyFloatingCandles = createLazy3DComponent(
  () => import('@/components/3D/FloatingCandles'),
  {
    loadPriority: 'high',
    loadingText: 'Lighting the magical candles...',
    threshold: 0.2,
    rootMargin: '200px', // Load early for better experience
  }
);

// Medium priority: Interactive portraits (loads after candles)
const LazyMovingPortraits = createLazy3DComponent(
  () => import('@/components/3D/MovingPortraits'),
  {
    loadPriority: 'medium',
    loadingText: 'Awakening the portraits...',
    threshold: 0.1,
    rootMargin: '150px',
  }
);

// Low priority: Complex Golden Snitch (loads last)
const LazyGoldenSnitch = createLazy3DComponent(
  () => import('@/components/3D/GoldenSnitch'),
  {
    loadPriority: 'low',
    loadingText: 'Releasing the Golden Snitch...',
    threshold: 0.1,
    rootMargin: '100px',
    delayMs: 100, // Reduced delay for smoother experience
  }
);

export default function Home() {
  return (
    <div className='relative'>
      {/* 3D Scene Background */}
      <ThreeScene
        config={{
          enableShadows: true,
          enableFog: true,
          cameraPosition: [0, 0, 8],
          cameraFov: 60,
        }}
        enablePerformanceMonitor={process.env.NODE_ENV === 'development'}
      >
        <LazyFloatingCandles
          count={6}
          spread={6}
          candleScale={0.8}
          lightIntensity={0.3}
        />

        <LazyMovingPortraits count={4} />

        <LazyGoldenSnitch
          bounds={{
            x: [-5, 5],
            y: [-1, 5],
            z: [-4, 4],
          }}
          speed={1.2}
          scale={1}
        />
      </ThreeScene>

      {/* Navigation */}
      <Navigation />

      {/* Hero Section */}
      <Hero />

      {/* About Section */}
      <About />

      {/* Skills Section */}
      <Skills />

      {/* Projects Section */}
      <Projects />

      {/* Services Section */}
      <Services />

      {/* Contact Section */}
      <Contact />
    </div>
  );
}
