'use client';

import dynamic from 'next/dynamic';

import { createLazy3DComponent, FloatingCandles } from '@/components/3D';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Skills from '@/components/Skills';
import { LoadingSpinner } from '@/components/ui';

const ThemeToggle = dynamic(() => import('@/components/ThemeToggle'), {
  ssr: false,
  loading: () => <LoadingSpinner size='lg' text='Loading theme...' />,
});

// High priority: Core ThreeScene (loads immediately when visible)
const ThreeScene = dynamic(() => import('@/components/3D/ThreeScene'), {
  ssr: false,
  loading: () => (
    <LoadingSpinner
      size='lg'
      variant='magical'
      text='Loading magical elements...'
    />
  ),
});

// Medium priority: Atmospheric effects (loads with slight delay)
const LazyFloatingCandles = createLazy3DComponent(
  () => import('@/components/3D/FloatingCandles'),
  {
    loadPriority: 'medium',
    loadingText: 'Lighting the candles...',
    threshold: 0.2,
    rootMargin: '150px',
  }
);

// Low priority: Complex interactions (loads last)
const LazyMovingPortraits = createLazy3DComponent(
  () => import('@/components/3D/MovingPortraits'),
  {
    loadPriority: 'low',
    loadingText: 'Awakening the portraits...',
    threshold: 0.1,
    rootMargin: '100px',
  }
);

const LazyGoldenSnitch = createLazy3DComponent(
  () => import('@/components/3D/GoldenSnitch'),
  {
    loadPriority: 'low',
    loadingText: 'Releasing the Golden Snitch...',
    threshold: 0.1,
    rootMargin: '100px',
    delayMs: 200, // Additional delay for the most complex component
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
        {/*  problem seem to come from the lazy loading of the 3D components */}
        {/*
        <FloatingCandles
          count={6}
          spread={6}
          candleScale={0.8}
          lightIntensity={0.3}
        />
        */}
        <LazyFloatingCandles 
          count={6}
          spread={6}
          candleScale={0.8}
          lightIntensity={0.3}
        />
        <LazyMovingPortraits 
          count={4}
        />
        <LazyGoldenSnitch 
          bounds={{
            x: [-5, 5],
            y: [-1, 5],
            z: [-4, 4]
          }}
          speed={1.2}
          scale={1}
        />
      </ThreeScene>

      {/* Navigation */}
      <Navigation />

      {/* Fixed Theme Toggle */}
      <div className='fixed top-6 right-6 z-50'>
        <ThemeToggle size='md' />
      </div>

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
