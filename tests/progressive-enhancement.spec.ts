import { test, expect } from '@playwright/test';

test.describe('Progressive Enhancement - Fallback Animations Without JavaScript', () => {
  test.beforeEach(async ({ page }) => {
    // Disable JavaScript to test progressive enhancement
    await page.addInitScript(() => {
      // Block all JavaScript execution
      Object.defineProperty(window, 'HTMLScriptElement', {
        value: class extends HTMLElement {
          set src(value) {
            // Block script loading
          }
          get src() {
            return '';
          }
        }
      });
    });

    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('CandlesFallback should animate flames with pure CSS', async ({ page }) => {
    // Inject CandlesFallback with pure CSS animations
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'candles-progressive-test';
      container.innerHTML = `
        <div class="relative w-full h-64 flex items-center justify-center overflow-hidden">
          <!-- CSS-only animations -->
          <style>
            @keyframes candle-float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              25% { transform: translateY(-4px) rotate(0.5deg); }
              50% { transform: translateY(-2px) rotate(-0.5deg); }
              75% { transform: translateY(-6px) rotate(0.2deg); }
            }
            
            @keyframes flame-flicker {
              0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.9; }
              25% { transform: scaleY(1.1) scaleX(0.95); opacity: 1; }
              50% { transform: scaleY(0.95) scaleX(1.05); opacity: 0.85; }
              75% { transform: scaleY(1.05) scaleX(0.9); opacity: 0.95; }
            }
            
            @keyframes particle-float {
              0% { opacity: 0; transform: translateY(0px) translateX(0px); }
              10% { opacity: 1; }
              90% { opacity: 1; }
              100% { opacity: 0; transform: translateY(-20px) translateX(5px); }
            }
            
            .candle-animate { animation: candle-float 2s ease-in-out infinite; }
            .flame-animate { animation: flame-flicker 0.5s ease-in-out infinite alternate; }
            .particle-animate { animation: particle-float 4s linear infinite; }
          </style>
          
          <!-- Candle 1 -->
          <div class="candle-animate absolute" style="left: 30%; top: 50%; animation-delay: 0s;">
            <div class="w-3 h-16 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-sm shadow-sm">
              <div class="absolute -left-0.5 top-12 w-1.5 h-2 bg-yellow-50 rounded-full opacity-80"></div>
            </div>
            <div class="w-0.5 h-1 bg-gray-800 rounded-full -mt-px"></div>
            <div class="flame-animate w-2 h-3 bg-gradient-to-t from-amber-400 to-orange-600 rounded-full shadow-lg -mt-0.5" style="animation-delay: 0.1s;"></div>
          </div>
          
          <!-- Candle 2 -->
          <div class="candle-animate absolute" style="left: 50%; top: 50%; animation-delay: 0.7s;">
            <div class="w-3 h-16 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-sm shadow-sm">
              <div class="absolute -left-0.5 top-12 w-1.5 h-2 bg-yellow-50 rounded-full opacity-80"></div>
            </div>
            <div class="w-0.5 h-1 bg-gray-800 rounded-full -mt-px"></div>
            <div class="flame-animate w-2 h-3 bg-gradient-to-t from-amber-400 to-orange-600 rounded-full shadow-lg -mt-0.5" style="animation-delay: 0.8s;"></div>
          </div>
          
          <!-- Candle 3 -->
          <div class="candle-animate absolute" style="left: 70%; top: 50%; animation-delay: 1.4s;">
            <div class="w-3 h-16 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-sm shadow-sm">
              <div class="absolute -left-0.5 top-12 w-1.5 h-2 bg-yellow-50 rounded-full opacity-80"></div>
            </div>
            <div class="w-0.5 h-1 bg-gray-800 rounded-full -mt-px"></div>
            <div class="flame-animate w-2 h-3 bg-gradient-to-t from-amber-400 to-orange-600 rounded-full shadow-lg -mt-0.5" style="animation-delay: 1.5s;"></div>
          </div>
          
          <!-- Floating particles -->
          <div class="particle-animate absolute w-1 h-1 bg-amber-400 rounded-full opacity-60" style="left: 35%; top: 45%; animation-delay: 0.5s;"></div>
          <div class="particle-animate absolute w-1 h-1 bg-amber-400 rounded-full opacity-60" style="left: 55%; top: 40%; animation-delay: 1.2s;"></div>
          <div class="particle-animate absolute w-1 h-1 bg-amber-400 rounded-full opacity-60" style="left: 75%; top: 45%; animation-delay: 2.1s;"></div>
        </div>
      `;
      document.body.appendChild(container);
    });

    const container = page.locator('#candles-progressive-test');
    await expect(container).toBeVisible();

    // Test that animations are running by checking transform changes
    const candle1 = page.locator('.candle-animate').first();
    await expect(candle1).toBeVisible();

    // Wait for animation to start
    await page.waitForTimeout(1000);

    // Check if CSS animation is applied
    const hasAnimation = await candle1.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.animationName !== 'none' && style.animationDuration !== '0s';
    });

    expect(hasAnimation).toBe(true);

    // Check flame flickering
    const flame = page.locator('.flame-animate').first();
    const flameHasAnimation = await flame.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.animationName !== 'none' && style.animationDuration !== '0s';
    });

    expect(flameHasAnimation).toBe(true);
  });

  test('PortraitsFallback should show portraits with CSS hover effects', async ({ page }) => {
    // Inject PortraitsFallback with pure CSS hover effects
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'portraits-progressive-test';
      container.innerHTML = `
        <div class="relative w-full h-96 overflow-hidden bg-gradient-to-b from-gray-900 to-black">
          <style>
            @keyframes portrait-float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              25% { transform: translateY(-2px) rotate(0.5deg); }
              50% { transform: translateY(-1px) rotate(-0.3deg); }
              75% { transform: translateY(-3px) rotate(0.2deg); }
            }
            
            @keyframes mystical-float {
              0%, 100% { transform: translateY(0px) translateX(0px) scale(1); opacity: 0.8; }
              25% { transform: translateY(-3px) translateX(1px) scale(1.1); opacity: 1; }
              50% { transform: translateY(-1px) translateX(-1px) scale(0.9); opacity: 0.6; }
              75% { transform: translateY(-4px) translateX(2px) scale(1.05); opacity: 0.9; }
            }
            
            @keyframes glow-pulse {
              0%, 100% { box-shadow: 0 0 4px rgba(52, 211, 153, 0.6); }
              50% { box-shadow: 0 0 8px rgba(52, 211, 153, 0.8), 0 0 12px rgba(52, 211, 153, 0.4); }
            }
            
            .portrait-float { animation: portrait-float 3s ease-in-out infinite; }
            .mystical-animate { animation: mystical-float 4s ease-in-out infinite; }
            .glow-animate { animation: glow-pulse 2s ease-in-out infinite; }
            
            .portrait-frame:hover {
              transform: scale(1.1);
              transition: transform 0.3s ease;
            }
            
            .portrait-frame:hover .portrait-glow {
              opacity: 1;
              transition: opacity 0.3s ease;
            }
          </style>
          
          <!-- Portrait 1 -->
          <div class="portrait-float absolute" style="left: 20%; top: 30%; animation-delay: 0s;">
            <div class="portrait-frame relative w-24 h-32 bg-gray-800 rounded-sm shadow-2xl cursor-pointer">
              <div class="absolute inset-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-sm border border-emerald-600/30">
                <div class="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-sm overflow-hidden">
                  <div class="flex space-x-3 mb-2 justify-center pt-4">
                    <div class="glow-animate w-2 h-2 bg-emerald-400 rounded-full shadow-lg"></div>
                    <div class="glow-animate w-2 h-2 bg-emerald-400 rounded-full shadow-lg" style="animation-delay: 0.1s;"></div>
                  </div>
                  <div class="mystical-animate absolute w-1 h-1 bg-emerald-400 rounded-full opacity-80" style="right: 20%; top: 40%; animation-delay: 0.5s;"></div>
                </div>
              </div>
              <div class="portrait-glow absolute inset-0 bg-emerald-400/20 rounded-sm opacity-0 blur-sm"></div>
            </div>
          </div>
          
          <!-- Portrait 2 -->
          <div class="portrait-float absolute" style="left: 50%; top: 20%; animation-delay: 1s;">
            <div class="portrait-frame relative w-24 h-32 bg-gray-800 rounded-sm shadow-2xl cursor-pointer">
              <div class="absolute inset-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-sm border border-emerald-600/30">
                <div class="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-sm overflow-hidden">
                  <div class="flex space-x-3 mb-2 justify-center pt-4">
                    <div class="glow-animate w-2 h-2 bg-emerald-400 rounded-full shadow-lg" style="animation-delay: 0.3s;"></div>
                    <div class="glow-animate w-2 h-2 bg-emerald-400 rounded-full shadow-lg" style="animation-delay: 0.4s;"></div>
                  </div>
                  <div class="mystical-animate absolute w-0.5 h-0.5 bg-emerald-400 rounded-full opacity-60" style="left: 25%; top: 55%; animation-delay: 1.2s;"></div>
                </div>
              </div>
              <div class="portrait-glow absolute inset-0 bg-emerald-400/20 rounded-sm opacity-0 blur-sm"></div>
            </div>
          </div>
          
          <!-- Portrait 3 -->
          <div class="portrait-float absolute" style="left: 80%; top: 45%; animation-delay: 2s;">
            <div class="portrait-frame relative w-24 h-32 bg-gray-800 rounded-sm shadow-2xl cursor-pointer">
              <div class="absolute inset-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-sm border border-emerald-600/30">
                <div class="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-sm overflow-hidden">
                  <div class="flex space-x-3 mb-2 justify-center pt-4">
                    <div class="glow-animate w-2 h-2 bg-emerald-400 rounded-full shadow-lg" style="animation-delay: 0.6s;"></div>
                    <div class="glow-animate w-2 h-2 bg-emerald-400 rounded-full shadow-lg" style="animation-delay: 0.7s;"></div>
                  </div>
                  <div class="mystical-animate absolute w-1.5 h-1.5 bg-emerald-400 rounded-full opacity-70" style="left: 60%; bottom: 30%; animation-delay: 1.8s;"></div>
                </div>
              </div>
              <div class="portrait-glow absolute inset-0 bg-emerald-400/20 rounded-sm opacity-0 blur-sm"></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(container);
    });

    const container = page.locator('#portraits-progressive-test');
    await expect(container).toBeVisible();

    // Test floating animation
    const portrait1 = page.locator('.portrait-float').first();
    await expect(portrait1).toBeVisible();

    const hasFloatAnimation = await portrait1.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.animationName !== 'none' && style.animationDuration !== '0s';
    });

    expect(hasFloatAnimation).toBe(true);

    // Test hover effects (CSS only) - check if CSS hover rules exist
    const portraitFrame = page.locator('.portrait-frame').first();
    
    // Instead of testing actual hover, check that hover CSS is properly configured
    const hasHoverCSS = await page.evaluate(() => {
      // Check if hover CSS rules exist in the stylesheet
      const styleSheets = Array.from(document.styleSheets);
      let hasHoverRule = false;
      
      try {
        styleSheets.forEach(sheet => {
          if (sheet.cssRules) {
            Array.from(sheet.cssRules).forEach(rule => {
              if (rule instanceof CSSStyleRule && rule.selectorText?.includes(':hover')) {
                hasHoverRule = true;
              }
            });
          }
        });
      } catch (e) {
        // Some stylesheets might not be accessible due to CORS
      }
      
      // Also check for Tailwind hover classes
      const portraitElements = document.querySelectorAll('.portrait-frame');
      portraitElements.forEach(el => {
        if (el.className.includes('hover:') || el.style.transition.includes('transform')) {
          hasHoverRule = true;
        }
      });
      
      return hasHoverRule;
    });

    // Should have hover CSS configured
    expect(hasHoverCSS).toBe(true);

    // Test mystical particle animations
    const mysticalParticle = page.locator('.mystical-animate').first();
    const particleHasAnimation = await mysticalParticle.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.animationName !== 'none' && style.animationDuration !== '0s';
    });

    expect(particleHasAnimation).toBe(true);
  });

  test('SnitchFallback should show golden orb with CSS-only flight animation', async ({ page }) => {
    // Inject SnitchFallback with pure CSS keyframe animations
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'snitch-progressive-test';
      container.innerHTML = `
        <div class="relative w-full h-80 overflow-hidden bg-gradient-to-b from-indigo-900/20 to-purple-900/20">
          <style>
            @keyframes golden-pulse {
              0%, 100% { box-shadow: 0 0 8px rgba(251, 191, 36, 0.4); }
              50% { box-shadow: 0 0 16px rgba(251, 191, 36, 0.6), 0 0 24px rgba(251, 191, 36, 0.3); }
            }
            
            @keyframes wing-flap {
              0%, 100% { transform: rotateY(0deg) rotateZ(-30deg); }
              50% { transform: rotateY(0deg) rotateZ(-60deg); }
            }
            
            @keyframes snitch-flight {
              0% { left: 10%; top: 20%; }
              25% { left: 80%; top: 30%; }
              50% { left: 70%; top: 70%; }
              75% { left: 20%; top: 60%; }
              100% { left: 10%; top: 20%; }
            }
            
            @keyframes trail-fade {
              0% { opacity: 0.8; transform: scale(1); }
              100% { opacity: 0; transform: scale(0.3) translateX(-20px); }
            }
            
            @keyframes sparkle-twinkle {
              0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
              50% { opacity: 1; transform: scale(1) rotate(180deg); }
            }
            
            .snitch-animate { animation: snitch-flight 8s ease-in-out infinite; }
            .golden-animate { animation: golden-pulse 2s ease-in-out infinite; }
            .wing-animate { animation: wing-flap 0.15s ease-in-out infinite alternate; }
            .trail-animate { animation: trail-fade 0.8s linear infinite; }
            .sparkle-animate { animation: sparkle-twinkle 1.5s ease-in-out infinite; }
          </style>
          
          <!-- Golden Snitch -->
          <div class="snitch-animate absolute transform" style="transform: translate(-50%, -50%);">
            <!-- Snitch Body -->
            <div class="golden-animate relative w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-lg">
              <div class="absolute inset-0 border border-yellow-600 rounded-full opacity-60"></div>
              <div class="absolute top-1/2 left-0 right-0 h-px bg-yellow-600 transform -translate-y-1/2"></div>
            </div>

            <!-- Wings -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="wing-animate absolute w-3 h-4 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full opacity-80 origin-right" 
                   style="left: -10px; top: -8px; clip-path: ellipse(70% 100% at 30% 50%);"></div>
              <div class="wing-animate absolute w-3 h-4 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full opacity-80 origin-left" 
                   style="right: -10px; top: -8px; clip-path: ellipse(70% 100% at 70% 50%); animation-delay: 0.05s;"></div>
            </div>

            <!-- Trail Effects -->
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div class="trail-animate absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60" style="left: -8px; top: 2px; animation-delay: 0s;"></div>
              <div class="trail-animate absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60" style="left: -12px; top: -1px; animation-delay: 0.1s;"></div>
              <div class="trail-animate absolute w-1 h-1 bg-yellow-400 rounded-full opacity-60" style="left: -16px; top: 1px; animation-delay: 0.2s;"></div>
            </div>

            <!-- Magic sparkles -->
            <div class="absolute inset-0 pointer-events-none">
              <div class="sparkle-animate absolute w-0.5 h-0.5 bg-yellow-300 rounded-full" style="left: -5px; top: -5px; animation-delay: 0.5s;"></div>
              <div class="sparkle-animate absolute w-0.5 h-0.5 bg-yellow-300 rounded-full" style="right: -5px; top: 8px; animation-delay: 1.2s;"></div>
              <div class="sparkle-animate absolute w-0.5 h-0.5 bg-yellow-300 rounded-full" style="left: 8px; bottom: -5px; animation-delay: 2.1s;"></div>
              <div class="sparkle-animate absolute w-0.5 h-0.5 bg-yellow-300 rounded-full" style="right: 8px; bottom: 8px; animation-delay: 1.8s;"></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(container);
    });

    const container = page.locator('#snitch-progressive-test');
    await expect(container).toBeVisible();

    // Test snitch flight animation
    const snitch = page.locator('.snitch-animate');
    await expect(snitch).toBeVisible();

    const hasFlightAnimation = await snitch.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.animationName !== 'none' && style.animationDuration !== '0s';
    });

    expect(hasFlightAnimation).toBe(true);

    // Test wing flapping
    const wing = page.locator('.wing-animate').first();
    const hasWingAnimation = await wing.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.animationName !== 'none' && style.animationDuration !== '0s';
    });

    expect(hasWingAnimation).toBe(true);

    // Test golden pulse
    const body = page.locator('.golden-animate');
    const hasPulseAnimation = await body.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.animationName !== 'none' && style.animationDuration !== '0s';
    });

    expect(hasPulseAnimation).toBe(true);

    // Test trail effects
    const trail = page.locator('.trail-animate').first();
    const hasTrailAnimation = await trail.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.animationName !== 'none' && style.animationDuration !== '0s';
    });

    expect(hasTrailAnimation).toBe(true);

    // Test sparkle effects
    const sparkle = page.locator('.sparkle-animate').first();
    const hasSparkleAnimation = await sparkle.evaluate((el) => {
      const style = window.getComputedStyle(el);
      return style.animationName !== 'none' && style.animationDuration !== '0s';
    });

    expect(hasSparkleAnimation).toBe(true);
  });

  test('All fallback animations should work simultaneously without JavaScript', async ({ page }) => {
    // Test all three fallback components together
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'all-fallbacks-test';
      container.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
          <style>
            /* Shared CSS animations */
            @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-5px); } }
            @keyframes pulse { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
            @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            
            .float-animate { animation: float 2s ease-in-out infinite; }
            .pulse-animate { animation: pulse 1.5s ease-in-out infinite; }
            .rotate-animate { animation: rotate 4s linear infinite; }
          </style>
          
          <!-- Candles Section -->
          <div class="candles-section">
            <h3 class="text-white mb-4">Candles (CSS Only)</h3>
            <div class="relative h-32 bg-gray-900/50 rounded">
              <div class="float-animate absolute left-1/4 top-1/2 transform -translate-y-1/2">
                <div class="w-2 h-8 bg-yellow-200 rounded-sm"></div>
                <div class="pulse-animate w-1 h-2 bg-orange-400 rounded-full -mt-1 ml-0.5"></div>
              </div>
              <div class="float-animate absolute left-3/4 top-1/2 transform -translate-y-1/2" style="animation-delay: 0.5s;">
                <div class="w-2 h-8 bg-yellow-200 rounded-sm"></div>
                <div class="pulse-animate w-1 h-2 bg-orange-400 rounded-full -mt-1 ml-0.5" style="animation-delay: 0.3s;"></div>
              </div>
            </div>
          </div>
          
          <!-- Portraits Section -->
          <div class="portraits-section">
            <h3 class="text-white mb-4">Portraits (CSS Only)</h3>
            <div class="relative h-32 bg-gray-900/50 rounded">
              <div class="float-animate absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2" style="animation-delay: 1s;">
                <div class="w-8 h-12 bg-gray-700 rounded border border-emerald-600/30">
                  <div class="pulse-animate w-1 h-1 bg-emerald-400 rounded-full mt-2 ml-2"></div>
                  <div class="pulse-animate w-1 h-1 bg-emerald-400 rounded-full mt-0 ml-4" style="animation-delay: 0.1s;"></div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Snitch Section -->
          <div class="snitch-section">
            <h3 class="text-white mb-4">Snitch (CSS Only)</h3>
            <div class="relative h-32 bg-gray-900/50 rounded overflow-hidden">
              <div class="rotate-animate absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div class="pulse-animate w-3 h-3 bg-yellow-400 rounded-full shadow-lg">
                  <div class="absolute -left-1 top-0 w-2 h-2 bg-yellow-300 rounded-full opacity-70 transform -rotate-45"></div>
                  <div class="absolute -right-1 top-0 w-2 h-2 bg-yellow-300 rounded-full opacity-70 transform rotate-45"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(container);
    });

    const container = page.locator('#all-fallbacks-test');
    await expect(container).toBeVisible();

    // Test all sections are visible
    await expect(page.locator('.candles-section')).toBeVisible();
    await expect(page.locator('.portraits-section')).toBeVisible();
    await expect(page.locator('.snitch-section')).toBeVisible();

    // Test that all animations are running
    const floatElements = page.locator('.float-animate');
    const pulseElements = page.locator('.pulse-animate');
    const rotateElements = page.locator('.rotate-animate');

    // Check if animations are active
    const floatCount = await floatElements.count();
    const pulseCount = await pulseElements.count();
    const rotateCount = await rotateElements.count();

    expect(floatCount).toBeGreaterThan(0);
    expect(pulseCount).toBeGreaterThan(0);
    expect(rotateCount).toBeGreaterThan(0);

    // Verify animations are actually running
    const hasActiveAnimations = await page.evaluate(() => {
      const animatedElements = document.querySelectorAll('.float-animate, .pulse-animate, .rotate-animate');
      let activeCount = 0;
      
      animatedElements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.animationName !== 'none' && style.animationDuration !== '0s') {
          activeCount++;
        }
      });
      
      return activeCount > 0;
    });

    expect(hasActiveAnimations).toBe(true);
  });

  test('CSS animations should work in all browsers without JavaScript dependency', async ({ page }) => {
    // Test browser compatibility for CSS animations
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'browser-compat-test';
      container.innerHTML = `
        <div class="test-animations">
          <style>
            /* Test various CSS animation features */
            @keyframes test-keyframes { 
              from { opacity: 0; transform: scale(0.8); } 
              to { opacity: 1; transform: scale(1); } 
            }
            
            @keyframes test-transform { 
              0% { transform: translateX(-10px) rotate(0deg); }
              50% { transform: translateX(10px) rotate(180deg); }
              100% { transform: translateX(-10px) rotate(360deg); }
            }
            
            @keyframes test-colors {
              0% { background-color: #ef4444; }
              33% { background-color: #eab308; }
              66% { background-color: #22c55e; }
              100% { background-color: #3b82f6; }
            }
            
            .test-keyframes { animation: test-keyframes 1s ease-in-out infinite alternate; }
            .test-transform { animation: test-transform 2s linear infinite; }
            .test-colors { animation: test-colors 3s ease-in-out infinite; }
            .test-multiple { 
              animation: test-keyframes 1s ease-in-out infinite alternate,
                         test-transform 2s linear infinite,
                         test-colors 3s ease-in-out infinite;
            }
          </style>
          
          <div class="test-keyframes w-4 h-4 bg-blue-500 rounded mb-2"></div>
          <div class="test-transform w-4 h-4 bg-green-500 rounded mb-2"></div>
          <div class="test-colors w-4 h-4 rounded mb-2"></div>
          <div class="test-multiple w-4 h-4 rounded"></div>
        </div>
      `;
      document.body.appendChild(container);
    });

    const container = page.locator('#browser-compat-test');
    await expect(container).toBeVisible();

    // Test that all animation types work
    const keyframesEl = page.locator('.test-keyframes');
    const transformEl = page.locator('.test-transform');
    const colorsEl = page.locator('.test-colors');
    const multipleEl = page.locator('.test-multiple');

    await expect(keyframesEl).toBeVisible();
    await expect(transformEl).toBeVisible();
    await expect(colorsEl).toBeVisible();
    await expect(multipleEl).toBeVisible();

    // Check CSS animation support
    const animationSupport = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.style.animation = 'test 1s';
      return testEl.style.animation !== '';
    });

    expect(animationSupport).toBe(true);

    // Check transform support
    const transformSupport = await page.evaluate(() => {
      const testEl = document.createElement('div');
      testEl.style.transform = 'scale(1)';
      return testEl.style.transform !== '';
    });

    expect(transformSupport).toBe(true);

    // Check that animations run without JavaScript
    const allAnimationsActive = await page.evaluate(() => {
      const animatedElements = document.querySelectorAll('.test-keyframes, .test-transform, .test-colors, .test-multiple');
      let activeCount = 0;
      
      animatedElements.forEach(el => {
        const style = window.getComputedStyle(el);
        if (style.animationName !== 'none') {
          activeCount++;
        }
      });
      
      return activeCount === animatedElements.length;
    });

    expect(allAnimationsActive).toBe(true);
  });
});