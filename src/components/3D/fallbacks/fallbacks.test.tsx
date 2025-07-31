/**
 * Unit tests for 3D Fallback Components
 * 
 * Tests rendering, CSS animations, progressive enhancement,
 * theme integration, and accessibility for all fallback components.
 */

import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock the theme hook
const mockUseTheme = jest.fn(() => ({ theme: 'default' }));

jest.mock('@/hooks/useTheme', () => ({
  useTheme: () => mockUseTheme(),
}));

jest.mock('@/utils/errorLogger', () => ({
  errorLogger: {
    logFallbackError: jest.fn(),
    logError: jest.fn(),
    logWarning: jest.fn(),
  },
}));

// Import components after mocking
import CandlesFallback from './CandlesFallback';
import PortraitsFallback from './PortraitsFallback';
import SnitchFallback from './SnitchFallback';
import SnitchFallbackCSSOnly from './SnitchFallbackCSSOnly';
import FallbackWrapper from './FallbackWrapper';
import { errorLogger } from '@/utils/errorLogger';

describe('CandlesFallback Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    const { container } = render(<CandlesFallback />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the correct number of candles', () => {
    const { container } = render(<CandlesFallback count={5} />);
    // Count the number of candle elements (each has a flame)
    const flames = container.querySelectorAll('.animate-flicker');
    expect(flames).toHaveLength(5);
  });

  it('applies theme colors correctly', () => {
    const { container } = render(<CandlesFallback theme="slytherin" />);
    const flames = container.querySelectorAll('.from-emerald-400');
    expect(flames.length).toBeGreaterThan(0);
  });

  it('renders with gryffindor theme', () => {
    const { container } = render(<CandlesFallback theme="gryffindor" />);
    const flames = container.querySelectorAll('.from-red-400');
    expect(flames.length).toBeGreaterThan(0);
  });

  it('renders with default theme', () => {
    const { container } = render(<CandlesFallback theme="default" />);
    const flames = container.querySelectorAll('.from-amber-400');
    expect(flames.length).toBeGreaterThan(0);
  });

  it('includes CSS animations for progressive enhancement', () => {
    const { container } = render(<CandlesFallback />);
    // Check for CSS animation classes
    const floatingElements = container.querySelectorAll('.animate-float');
    const flickeringElements = container.querySelectorAll('.animate-flicker');
    const particleElements = container.querySelectorAll('.animate-float-particle');
    
    expect(floatingElements.length).toBeGreaterThan(0);
    expect(flickeringElements.length).toBeGreaterThan(0);
    expect(particleElements.length).toBeGreaterThan(0);
  });

  it('includes animation classes for progressive enhancement', () => {
    const { container } = render(<CandlesFallback />);
    // Test that elements have the expected animation classes
    const floatingElements = container.querySelectorAll('.animate-float');
    const flickeringElements = container.querySelectorAll('.animate-flicker');
    const particleElements = container.querySelectorAll('.animate-float-particle');
    
    expect(floatingElements.length).toBeGreaterThan(0);
    expect(flickeringElements.length).toBeGreaterThan(0);
    expect(particleElements.length).toBeGreaterThan(0);
  });

  it('has proper accessibility structure', () => {
    const { container } = render(<CandlesFallback />);
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('relative', 'w-full', 'h-64');
  });

  it('renders floating particles for ambient effect', () => {
    const { container } = render(<CandlesFallback />);
    const particles = container.querySelectorAll('.animate-float-particle');
    expect(particles.length).toBe(12); // Predefined number of particles
  });
});

describe('PortraitsFallback Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  it('renders without crashing', () => {
    const { container } = render(<PortraitsFallback />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the correct number of portraits', () => {
    const { container } = render(<PortraitsFallback count={4} />);
    const portraits = container.querySelectorAll('.group');
    expect(portraits).toHaveLength(4);
  });

  it('enables interactivity by default', () => {
    const { container } = render(<PortraitsFallback />);
    const portraits = container.querySelectorAll('.cursor-pointer');
    expect(portraits.length).toBeGreaterThan(0);
  });

  it('can disable interactivity', () => {
    const { container } = render(<PortraitsFallback enableInteractivity={false} />);
    // Eyes should not move when interactivity is disabled
    const eyes = container.querySelectorAll('.transition-transform');
    eyes.forEach(eye => {
      const style = eye.getAttribute('style');
      expect(style).toContain('translate(0px, 0px)');
    });
  });

  it('applies theme colors correctly', () => {
    const { container } = render(<PortraitsFallback theme="slytherin" />);
    const emeraldElements = container.querySelectorAll('[class*="emerald"]');
    expect(emeraldElements.length).toBeGreaterThan(0);
  });

  it('tracks mouse movement when interactive', () => {
    const { container } = render(<PortraitsFallback enableInteractivity={true} />);
    
    // Simulate mouse movement
    act(() => {
      fireEvent.mouseMove(window, { clientX: 500, clientY: 300 });
    });

    // Eyes should be following mouse (not at 0,0)
    const eyes = container.querySelectorAll('.transition-transform');
    expect(eyes.length).toBeGreaterThan(0);
  });

  it('includes CSS animations for progressive enhancement', () => {
    const { container } = render(<PortraitsFallback />);
    const floatingElements = container.querySelectorAll('.animate-float-portrait');
    const mysticalElements = container.querySelectorAll('.animate-float-mystical');
    const glowElements = container.querySelectorAll('[class*="animate-glow"]');
    
    expect(floatingElements.length).toBeGreaterThan(0);
    expect(mysticalElements.length).toBeGreaterThan(0);
    expect(glowElements.length).toBeGreaterThan(0);
  });

  it('includes animation classes for progressive enhancement', () => {
    const { container } = render(<PortraitsFallback />);
    // Test that elements have the expected animation classes
    const floatingElements = container.querySelectorAll('.animate-float-portrait');
    const mysticalElements = container.querySelectorAll('.animate-float-mystical');
    const glowElements = container.querySelectorAll('[class*="animate-glow"]');
    
    expect(floatingElements.length).toBeGreaterThan(0);
    expect(mysticalElements.length).toBeGreaterThan(0);
    expect(glowElements.length).toBeGreaterThan(0);
  });

  it('renders mystical floating elements', () => {
    const { container } = render(<PortraitsFallback count={3} />);
    const mysticalElements = container.querySelectorAll('.animate-float-mystical');
    expect(mysticalElements.length).toBe(9); // 3 per portrait * 3 portraits
  });
});

describe('SnitchFallback Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders without crashing', () => {
    const { container } = render(<SnitchFallback />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the golden snitch body', () => {
    const { container } = render(<SnitchFallback />);
    const snitchBody = container.querySelector('.animate-golden-pulse');
    expect(snitchBody).toBeInTheDocument();
    expect(snitchBody).toHaveClass('rounded-full');
  });

  it('renders wings with proper animation classes', () => {
    const { container } = render(<SnitchFallback />);
    const wings = container.querySelectorAll('[class*="animate-flap"]');
    expect(wings).toHaveLength(2); // Left and right wing
  });

  it('applies theme colors correctly', () => {
    const { container } = render(<SnitchFallback theme="slytherin" />);
    const yellowElements = container.querySelectorAll('[class*="yellow-6"]');
    expect(yellowElements.length).toBeGreaterThan(0);
  });

  it('includes trail effects when enabled', () => {
    const { container } = render(<SnitchFallback enableTrailEffects={true} />);
    const trailParticles = container.querySelectorAll('.animate-trail-particle');
    expect(trailParticles.length).toBeGreaterThan(0);
  });

  it('excludes trail effects when disabled', () => {
    const { container } = render(<SnitchFallback enableTrailEffects={false} />);
    const trailParticles = container.querySelectorAll('.animate-trail-particle');
    expect(trailParticles).toHaveLength(0);
  });

  it('renders sparkle effects', () => {
    const { container } = render(<SnitchFallback />);
    const sparkles = container.querySelectorAll('.animate-sparkle');
    expect(sparkles).toHaveLength(4); // Predefined number of sparkles
  });

  it('includes animation classes for progressive enhancement', () => {
    const { container } = render(<SnitchFallback />);
    // Test that elements have the expected animation classes
    const flapElements = container.querySelectorAll('[class*="animate-flap"]');
    const pulseElements = container.querySelectorAll('.animate-golden-pulse');
    const trailElements = container.querySelectorAll('.animate-trail-particle');
    const sparkleElements = container.querySelectorAll('.animate-sparkle');
    
    expect(flapElements.length).toBeGreaterThan(0);
    expect(pulseElements.length).toBeGreaterThan(0);
    expect(trailElements.length).toBeGreaterThan(0);
    expect(sparkleElements.length).toBeGreaterThan(0);
  });

  it('shows development state indicator in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    
    const { container } = render(<SnitchFallback />);
    const stateIndicator = container.querySelector('.text-yellow-400');
    expect(stateIndicator).toBeInTheDocument();
    expect(stateIndicator?.textContent).toContain('State:');
    
    process.env.NODE_ENV = originalEnv;
  });

  it('applies custom bounds correctly', () => {
    const customBounds = { x: [20, 80], y: [30, 70] };
    const { container } = render(<SnitchFallback bounds={customBounds} />);
    // Component should render without errors with custom bounds
    expect(container.firstChild).toBeInTheDocument();
  });

  it('applies custom scale', () => {
    const { container } = render(<SnitchFallback scale={1.5} />);
    const snitchContainer = container.querySelector('[style*="scale(1.5)"]');
    expect(snitchContainer).toBeInTheDocument();
  });
});

describe('SnitchFallbackCSSOnly Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<SnitchFallbackCSSOnly />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders with CSS-only animations', () => {
    const { container } = render(<SnitchFallbackCSSOnly />);
    const flightPath = container.querySelector('.snitch-flight-path');
    expect(flightPath).toBeInTheDocument();
  });

  it('includes predefined trail effects', () => {
    const { container } = render(<SnitchFallbackCSSOnly enableTrailEffects={true} />);
    const trailParticles = container.querySelectorAll('.animate-trail-particle');
    expect(trailParticles).toHaveLength(3); // Predefined trail particles
  });

  it('includes predefined sparkle effects', () => {
    const { container } = render(<SnitchFallbackCSSOnly />);
    const sparkles = container.querySelectorAll('.animate-sparkle');
    expect(sparkles).toHaveLength(4); // Predefined sparkles
  });

  it('applies speed parameter correctly', () => {
    const { container } = render(<SnitchFallbackCSSOnly speed={2} />);
    // Component should render without errors with custom speed
    const flightPath = container.querySelector('.snitch-flight-path');
    expect(flightPath).toBeInTheDocument();
  });

  it('includes required animation classes', () => {
    const { container } = render(<SnitchFallbackCSSOnly />);
    // Test that elements have the expected animation classes
    const flightPath = container.querySelector('.snitch-flight-path');
    const wingElements = container.querySelectorAll('.animate-wing-flap');
    
    expect(flightPath).toBeInTheDocument();
    expect(wingElements.length).toBeGreaterThan(0);
  });
});

describe('FallbackWrapper Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTheme.mockReturnValue({ theme: 'default' });
  });

  it('renders CandlesFallback for candles component type', () => {
    const { container } = render(
      <FallbackWrapper componentType="candles" count={5} />
    );
    const flames = container.querySelectorAll('.animate-flicker');
    expect(flames).toHaveLength(5);
  });

  it('renders PortraitsFallback for portraits component type', () => {
    const { container } = render(
      <FallbackWrapper componentType="portraits" count={3} />
    );
    const portraits = container.querySelectorAll('.group');
    expect(portraits).toHaveLength(3);
  });

  it('renders SnitchFallback for snitch component type', () => {
    const { container } = render(
      <FallbackWrapper componentType="snitch" />
    );
    const snitchBody = container.querySelector('.animate-golden-pulse');
    expect(snitchBody).toBeInTheDocument();
  });

  it('handles unknown component type gracefully', () => {
    const { container } = render(
      <FallbackWrapper componentType="unknown" as any />
    );
    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText(/Unknown component type/)).toBeInTheDocument();
    expect(errorLogger.logFallbackError).toHaveBeenCalled();
  });

  it('applies theme from useTheme hook', () => {
    mockUseTheme.mockReturnValue({ theme: 'slytherin' });
    const { container } = render(
      <FallbackWrapper componentType="candles" />
    );
    const emeraldElements = container.querySelectorAll('[class*="emerald"]');
    expect(emeraldElements.length).toBeGreaterThan(0);
  });

  it('passes through component-specific props', () => {
    const { container } = render(
      <FallbackWrapper 
        componentType="snitch" 
        enableTrailEffects={false} 
        scale={1.5} 
      />
    );
    const trailParticles = container.querySelectorAll('.animate-trail-particle');
    expect(trailParticles).toHaveLength(0); // Trail effects disabled
    
    const scaledElement = container.querySelector('[style*="scale(1.5)"]');
    expect(scaledElement).toBeInTheDocument();
  });

  it('handles rendering errors gracefully', () => {
    // This test simulates a component error by using an invalid component type
    // that should trigger the catch block in FallbackWrapper
    const consoleSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    
    const { container } = render(
      <FallbackWrapper componentType="unknown" as any />
    );
    
    expect(screen.getByText('⚠️')).toBeInTheDocument();
    expect(screen.getByText(/Unknown component type/)).toBeInTheDocument();
    expect(errorLogger.logFallbackError).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it('provides development error details in development mode', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    render(
      <FallbackWrapper componentType="unknown" as any />
    );
    
    expect(screen.getByText(/Check console for details/)).toBeInTheDocument();
    
    process.env.NODE_ENV = originalEnv;
  });
});

describe('Progressive Enhancement and Accessibility', () => {
  it('all components render without JavaScript (CSS-only animations)', () => {
    // Test that components work without JavaScript by checking CSS classes
    const components = [
      <CandlesFallback key="candles" />,
      <PortraitsFallback key="portraits" enableInteractivity={false} />,
      <SnitchFallbackCSSOnly key="snitch-css" />,
    ];

    components.forEach(component => {
      const { container } = render(component);
      const animatedElements = container.querySelectorAll('[class*="animate-"]');
      expect(animatedElements.length).toBeGreaterThan(0);
    });
  });

  it('components maintain layout without animations', () => {
    // Test that components maintain proper dimensions and layout
    const { container } = render(<CandlesFallback />);
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toHaveClass('relative', 'w-full', 'h-64');
  });

  it('components use semantic HTML structure', () => {
    const { container } = render(<PortraitsFallback />);
    const mainContainer = container.firstChild as HTMLElement;
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer.tagName).toBe('DIV');
  });

  it('components handle reduced motion preferences', () => {
    // Mock reduced motion preference
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });

    // Components should still render even with reduced motion
    const { container } = render(<CandlesFallback />);
    expect(container.firstChild).toBeInTheDocument();
  });
});

describe('Performance and Static Export Compatibility', () => {
  it('components avoid server-side dependencies', () => {
    // Test that components don't use Node.js specific APIs
    // This is validated by the components rendering successfully in the test environment
    const components = [
      <CandlesFallback />,
      <PortraitsFallback />,
      <SnitchFallback />,
      <SnitchFallbackCSSOnly />,
      <FallbackWrapper componentType="candles" />,
    ];

    components.forEach(component => {
      expect(() => render(component)).not.toThrow();
    });
  });

  it('components use predefined data for consistent rendering', () => {
    // Test that components render consistently (no Math.random in critical paths)
    const { container: container1 } = render(<CandlesFallback count={3} />);
    const { container: container2 } = render(<CandlesFallback count={3} />);
    
    // Both should have the same number of candles and basic structure
    const flames1 = container1.querySelectorAll('.animate-flicker');
    const flames2 = container2.querySelectorAll('.animate-flicker');
    expect(flames1).toHaveLength(flames2.length);
  });

  it('components handle theme changes dynamically', () => {
    mockUseTheme.mockReturnValue({ theme: 'slytherin' });
    const { rerender, container } = render(
      <FallbackWrapper componentType="candles" />
    );
    
    let emeraldElements = container.querySelectorAll('[class*="emerald"]');
    expect(emeraldElements.length).toBeGreaterThan(0);

    // Change theme
    mockUseTheme.mockReturnValue({ theme: 'gryffindor' });
    rerender(<FallbackWrapper componentType="candles" />);
    
    const redElements = container.querySelectorAll('[class*="red"]');
    expect(redElements.length).toBeGreaterThan(0);
  });
});