'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

/**
 * PROPER ARCHITECTURE: HTML Wrapper Outside Canvas
 * 
 * This component demonstrates the correct pattern for combining
 * intersection observer functionality with React Three Fiber.
 * 
 * Key principles:
 * 1. HTML elements (including intersection observer targets) stay OUTSIDE Canvas
 * 2. 3D content stays INSIDE Canvas
 * 3. State is passed down to 3D components via props
 */

interface IntersectionWrapperProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  rootMargin?: string;
  onVisibilityChange?: (isVisible: boolean) => void;
}

export default function IntersectionWrapper({
  children,
  className = '',
  threshold = 0.1,
  rootMargin = '100px',
  onVisibilityChange,
}: IntersectionWrapperProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  // Use intersection observer hook
  const { ref: intersectionRef, isIntersecting } = useIntersectionObserver({
    threshold,
    rootMargin,
  });

  // Update visibility state and notify parent
  useEffect(() => {
    setIsVisible(isIntersecting);
    onVisibilityChange?.(isIntersecting);
  }, [isIntersecting, onVisibilityChange]);

  return (
    <div ref={intersectionRef} className={className}>
      {children}
    </div>
  );
}

/**
 * Usage Example:
 * 
 * ```tsx
 * // ✅ CORRECT: HTML wrapper outside Canvas, visibility passed as prop
 * <IntersectionWrapper onVisibilityChange={setCanvasVisible}>
 *   <Canvas>
 *     <Scene3D visible={canvasVisible} />
 *   </Canvas>
 * </IntersectionWrapper>
 * 
 * // ❌ WRONG: HTML elements inside Canvas
 * <Canvas>
 *   <div ref={intersectionRef}>
 *     <Scene3D />
 *   </div>
 * </Canvas>
 * ```
 */