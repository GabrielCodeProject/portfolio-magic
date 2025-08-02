'use client';

import dynamic from 'next/dynamic';

import { 
  FloatingCandlesLazy, 
  MovingPortraitsLazy, 
  GoldenSnitchLazy 
} from '@/components/3D/Lazy3DWrapperFixed';
import About from '@/components/About';
import Contact from '@/components/Contact';
import Hero from '@/components/Hero';
import Navigation from '@/components/Navigation';
import Projects from '@/components/Projects';
import Services from '@/components/Services';
import Skills from '@/components/Skills';

// Enhanced ThreeScene with integrated fallback support
const ThreeScene = dynamic(() => import('@/components/3D/ThreeScene'), {
  ssr: false,
  loading: () => null, // Avoid HTML elements in Canvas context
});

export default function Home() {
  return (
    <div className='relative'>
      {/* 3D Scene Background - Properly Architected */}
      <ThreeScene
        config={{
          enableShadows: true,
          enableFog: true,
          cameraPosition: [0, 0, 8],
          cameraFov: 60,
        }}
        enablePerformanceMonitor={process.env.NODE_ENV === 'development'}
      >
        {/* Lazy-loaded 3D Components - Now properly separated from HTML */}
        <FloatingCandlesLazy
          count={6}
          spread={6}
        />

        <MovingPortraitsLazy
          count={4}
        />

        <GoldenSnitchLazy
          bounds={{
            x: [-5, 5],
            y: [-1, 5],
            z: [-4, 4],
          }}
          speed={1.2}
          scale={1}
        />
      </ThreeScene>

      {/* HTML Content - Outside Canvas */}
      <Navigation />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Services />
      <Contact />
    </div>
  );
}
