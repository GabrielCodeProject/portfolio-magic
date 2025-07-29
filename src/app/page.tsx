'use client';

import dynamic from 'next/dynamic';

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
  loading: () => <LoadingSpinner size="lg" text="Loading theme..." />,
});

const ThreeScene = dynamic(() => import('@/components/3D/ThreeScene'), {
  ssr: false,
  loading: () => <LoadingSpinner size="lg" variant="magical" text="Loading magical elements..." />,
});

const FloatingCandles = dynamic(() => import('@/components/3D/FloatingCandles'), {
  ssr: false,
});

const MovingPortraits = dynamic(() => import('@/components/3D/MovingPortraits'), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="relative">
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
        <FloatingCandles 
          count={6}
          spread={6}
          candleScale={0.8}
          lightIntensity={0.3}
        />
        <MovingPortraits 
          count={4}
        />
      </ThreeScene>

      {/* Navigation */}
      <Navigation />

      {/* Fixed Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle size="md" />
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

      {/* Demo Sections - Temporary for development */}
      <section className="min-h-screen flex flex-col items-center justify-center p-8 bg-theme-bg-secondary">
        {/* Loading Spinner Demo */}
        <div className="mb-12">
          <h2 className="font-cinzel text-2xl font-semibold mb-6 text-center text-theme-text-primary">
            Magical Loading Spinners
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 glass p-6 rounded-lg">
            <div className="text-center">
              <LoadingSpinner variant="circular" size="md" />
              <p className="text-xs text-theme-text-muted mt-2">Circular</p>
            </div>
            <div className="text-center">
              <LoadingSpinner variant="dots" size="md" />
              <p className="text-xs text-theme-text-muted mt-2">Dots</p>
            </div>
            <div className="text-center">
              <LoadingSpinner variant="orb" size="md" />
              <p className="text-xs text-theme-text-muted mt-2">Orb</p>
            </div>
            <div className="text-center">
              <LoadingSpinner variant="magical" size="md" />
              <p className="text-xs text-theme-text-muted mt-2">Magical</p>
            </div>
            <div className="text-center">
              <LoadingSpinner variant="snitch" size="md" />
              <p className="text-xs text-theme-text-muted mt-2">Snitch</p>
            </div>
          </div>
        </div>

        {/* Demo Content */}
        <div className="glass p-8 rounded-lg max-w-4xl w-full text-center">
          <h2 className="font-cinzel text-3xl font-semibold mb-6 text-theme-text-primary">
            Choose Your Magical Path
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="p-6 rounded-lg bg-slytherin-900/20 border border-slytherin-500/30">
              <div className="text-4xl mb-4">🐍</div>
              <h3 className="font-cinzel text-xl font-semibold text-slytherinGreen-400 mb-3">
                House Slytherin
              </h3>
              <p className="text-sm text-theme-text-secondary">
                Cunning, ambitious, and resourceful. Perfect for developers who
                value efficiency and elegant solutions.
              </p>
            </div>
            <div className="p-6 rounded-lg bg-gryffindor-900/20 border border-gryffindor-500/30">
              <div className="text-4xl mb-4">🦁</div>
              <h3 className="font-cinzel text-xl font-semibold text-gryffindorGold-400 mb-3">
                House Gryffindor
              </h3>
              <p className="text-sm text-theme-text-secondary">
                Brave, daring, and bold. Ideal for developers who take on
                challenging projects and push boundaries.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="font-philosopher text-sm text-theme-text-muted">
            Portfolio Theme System Demo • More sections coming soon
          </p>
        </div>
      </section>
    </div>
  );
}
