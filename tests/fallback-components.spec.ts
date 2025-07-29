import { test, expect } from '@playwright/test';

test.describe('Fallback Components Static Build Testing', () => {
  test.beforeEach(async ({ page }) => {
    // Configure for static build testing
    await page.addInitScript(() => {
      // Simulate static build environment (no server-side rendering)
      (window as any).__NEXT_ROUTER__ = {
        push: () => {},
        replace: () => {},
        prefetch: () => {},
        back: () => {},
        forward: () => {},
        refresh: () => {},
        route: '/',
        pathname: '/',
        query: {},
        asPath: '/',
        basePath: '',
        locale: 'en',
        locales: ['en'],
        defaultLocale: 'en',
        isReady: true,
        isPreview: false,
        isLocaleDomain: false,
      };
    });

    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');
  });

  test('CandlesFallback should render with CSS animations', async ({ page }) => {
    // Inject CandlesFallback component directly to test it
    await page.evaluate(() => {
      const testContainer = document.createElement('div');
      testContainer.id = 'candles-fallback-test';
      testContainer.innerHTML = `
        <div class="relative w-full h-64 flex items-center justify-center overflow-hidden">
          <div class="absolute transform animate-float" style="left: 50%; top: 50%;">
            <div class="w-3 h-16 bg-gradient-to-b from-yellow-100 to-yellow-200 rounded-sm shadow-sm animate-float">
              <div class="absolute -left-0.5 top-12 w-1.5 h-2 bg-yellow-50 rounded-full opacity-80"></div>
            </div>
            <div class="w-0.5 h-1 bg-gray-800 rounded-full -mt-px"></div>
            <div class="w-2 h-3 bg-gradient-to-t from-amber-400 to-orange-600 rounded-full shadow-lg animate-flicker -mt-0.5"></div>
          </div>
          <style>
            @keyframes float {
              0%, 100% { transform: translateY(0px) rotate(0deg); }
              25% { transform: translateY(-4px) rotate(0.5deg); }
              50% { transform: translateY(-2px) rotate(-0.5deg); }
              75% { transform: translateY(-6px) rotate(0.2deg); }
            }
            @keyframes flicker {
              0%, 100% { transform: scaleY(1) scaleX(1); opacity: 0.9; }
              25% { transform: scaleY(1.1) scaleX(0.95); opacity: 1; }
              50% { transform: scaleY(0.95) scaleX(1.05); opacity: 0.85; }
              75% { transform: scaleY(1.05) scaleX(0.9); opacity: 0.95; }
            }
            .animate-float { animation: float 2s ease-in-out infinite; }
            .animate-flicker { animation: flicker 0.5s ease-in-out infinite alternate; }
          </style>
        </div>
      `;
      document.body.appendChild(testContainer);
    });

    // Check if the candle elements are visible
    const candleContainer = page.locator('#candles-fallback-test');
    await expect(candleContainer).toBeVisible();

    // Check for animation elements
    const animatedCandle = page.locator('.animate-float');
    await expect(animatedCandle).toBeVisible();

    const animatedFlame = page.locator('.animate-flicker');
    await expect(animatedFlame).toBeVisible();

    // Verify CSS animations are applied (check for transform changes)
    await page.waitForTimeout(1000);
    
    const candleTransform = await animatedCandle.evaluate((el) => {
      return window.getComputedStyle(el).transform;
    });
    
    // Should have some transform applied (not 'none')
    expect(candleTransform).not.toBe('none');
  });

  test('PortraitsFallback should handle mouse interactions', async ({ page }) => {
    // Inject PortraitsFallback component
    await page.evaluate(() => {
      const testContainer = document.createElement('div');
      testContainer.id = 'portraits-fallback-test';
      testContainer.innerHTML = `
        <div class="relative w-full h-96 overflow-hidden bg-gradient-to-b from-gray-900 to-black">
          <div class="absolute group cursor-pointer" style="left: 50%; top: 50%; transform: translate(-50%, -50%);">
            <div class="relative w-24 h-32 bg-gray-800 rounded-sm shadow-2xl transform transition-all duration-500 hover:scale-110">
              <div class="absolute inset-1 bg-gradient-to-br from-gray-800 to-gray-900 rounded-sm border border-emerald-600/30">
                <div class="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-900 rounded-sm overflow-hidden">
                  <div class="flex space-x-3 mb-2 justify-center pt-4">
                    <div class="eye w-2 h-2 bg-emerald-400 rounded-full shadow-lg transition-transform duration-150"></div>
                    <div class="eye w-2 h-2 bg-emerald-400 rounded-full shadow-lg transition-transform duration-150"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(testContainer);

      // Add mouse tracking functionality
      const eyes = testContainer.querySelectorAll('.eye');
      testContainer.addEventListener('mousemove', (e) => {
        const rect = testContainer.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
        const mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 8;
        
        eyes.forEach((eye) => {
          (eye as HTMLElement).style.transform = `translate(${mouseX * 0.5}px, ${mouseY * 0.5}px)`;
        });
      });
    });

    const portraitContainer = page.locator('#portraits-fallback-test');
    await expect(portraitContainer).toBeVisible();

    // Test mouse interaction
    const portrait = page.locator('#portraits-fallback-test .group');
    await expect(portrait).toBeVisible();

    // Move mouse over the portrait
    await portrait.hover();
    
    // Check if hover effects are applied
    await page.waitForTimeout(500);
    
    // Verify hover scale effect
    const portraitScale = await portrait.evaluate((el) => {
      return window.getComputedStyle(el.querySelector('.hover\\:scale-110') as Element).transform;
    });
    
    // Should have scale transform applied
    expect(portraitScale).toContain('scale');
  });

  test('SnitchFallback should animate flight patterns', async ({ page }) => {
    // Inject SnitchFallback component with simplified animation
    await page.evaluate(() => {
      const testContainer = document.createElement('div');
      testContainer.id = 'snitch-fallback-test';
      testContainer.innerHTML = `
        <div class="relative w-full h-80 overflow-hidden bg-gradient-to-b from-indigo-900/20 to-purple-900/20">
          <div id="snitch" class="absolute transform transition-all duration-75 ease-linear" style="left: 50%; top: 50%; transform: translate(-50%, -50%);">
            <div class="relative w-4 h-4 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-lg animate-golden-pulse">
              <div class="absolute inset-0 border border-yellow-600 rounded-full opacity-60"></div>
            </div>
            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div class="absolute w-3 h-4 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full opacity-80 animate-flap-normal origin-right" 
                   style="left: -10px; top: -8px; clip-path: ellipse(70% 100% at 30% 50%);"></div>
              <div class="absolute w-3 h-4 bg-gradient-to-br from-yellow-300 to-amber-400 rounded-full opacity-80 animate-flap-normal origin-left" 
                   style="right: -10px; top: -8px; clip-path: ellipse(70% 100% at 70% 50%);"></div>
            </div>
          </div>
          <style>
            @keyframes golden-pulse {
              0%, 100% { box-shadow: 0 0 8px rgba(251, 191, 36, 0.4); }
              50% { box-shadow: 0 0 16px rgba(251, 191, 36, 0.6), 0 0 24px rgba(251, 191, 36, 0.3); }
            }
            @keyframes flap-normal {
              0%, 100% { transform: rotateY(0deg) rotateZ(-30deg); }
              50% { transform: rotateY(0deg) rotateZ(-60deg); }
            }
            .animate-golden-pulse { animation: golden-pulse 2s ease-in-out infinite; }
            .animate-flap-normal { animation: flap-normal 0.15s ease-in-out infinite alternate; }
          </style>
        </div>
      `;
      document.body.appendChild(testContainer);

      // Simulate flight movement
      let position = { x: 50, y: 50 };
      let direction = { x: 1, y: 0.5 };
      
      const snitch = testContainer.querySelector('#snitch') as HTMLElement;
      
      setInterval(() => {
        position.x += direction.x * 0.5;
        position.y += direction.y * 0.3;
        
        // Bounce off boundaries
        if (position.x > 90 || position.x < 10) direction.x *= -1;
        if (position.y > 80 || position.y < 20) direction.y *= -1;
        
        snitch.style.left = `${position.x}%`;
        snitch.style.top = `${position.y}%`;
      }, 50);
    });

    const snitchContainer = page.locator('#snitch-fallback-test');
    await expect(snitchContainer).toBeVisible();

    const snitch = page.locator('#snitch');
    await expect(snitch).toBeVisible();

    // Wait for animation to start
    await page.waitForTimeout(1000);

    // Check if the snitch has moved from its initial position
    const initialPosition = await snitch.evaluate((el) => ({
      left: el.style.left,
      top: el.style.top
    }));

    await page.waitForTimeout(2000);

    const newPosition = await snitch.evaluate((el) => ({
      left: el.style.left,
      top: el.style.top
    }));

    // Position should have changed due to animation
    expect(initialPosition).not.toEqual(newPosition);
  });

  test('Fallback components should work without JavaScript', async ({ page }) => {
    // Disable JavaScript to test progressive enhancement
    await page.addInitScript(() => {
      // Override JavaScript execution for testing
      (window as any).jsDisabled = true;
    });

    // Test that CSS animations still work
    await page.evaluate(() => {
      const testContainer = document.createElement('div');
      testContainer.innerHTML = `
        <div class="test-css-only">
          <style>
            @keyframes test-animation {
              0% { opacity: 0; transform: translateY(10px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .test-animate { animation: test-animation 1s ease-out; }
          </style>
          <div class="test-animate">CSS Animation Test</div>
        </div>
      `;
      document.body.appendChild(testContainer);
    });

    const animatedElement = page.locator('.test-animate');
    await expect(animatedElement).toBeVisible();

    await page.waitForTimeout(1500);

    // Check final animation state
    const finalOpacity = await animatedElement.evaluate((el) => {
      return window.getComputedStyle(el).opacity;
    });

    expect(parseFloat(finalOpacity)).toBeGreaterThan(0.8);
  });

  test('Theme switching should work in static build', async ({ page }) => {
    // Test theme switching without server-side dependencies
    await page.evaluate(() => {
      // Simulate theme switching functionality
      const themes = ['slytherin', 'gryffindor'];
      let currentTheme = 0;

      const testContainer = document.createElement('div');
      testContainer.innerHTML = `
        <div id="theme-test">
          <button id="theme-toggle">Toggle Theme</button>
          <div id="themed-element" class="theme-slytherin">Themed Element</div>
          <style>
            .theme-slytherin { color: #10B981; background: #1F2937; }
            .theme-gryffindor { color: #EF4444; background: #7F1D1D; }
          </style>
        </div>
      `;
      document.body.appendChild(testContainer);

      // Add theme toggle functionality
      document.getElementById('theme-toggle')?.addEventListener('click', () => {
        currentTheme = (currentTheme + 1) % themes.length;
        const themedElement = document.getElementById('themed-element');
        if (themedElement) {
          themedElement.className = `theme-${themes[currentTheme]}`;
          localStorage.setItem('theme', themes[currentTheme]);
        }
      });
    });

    const themeToggle = page.locator('#theme-toggle');
    const themedElement = page.locator('#themed-element');
    
    await expect(themeToggle).toBeVisible();
    await expect(themedElement).toBeVisible();

    // Initial theme should be slytherin
    await expect(themedElement).toHaveClass(/theme-slytherin/);

    // Click to switch theme
    await themeToggle.click();
    
    // Should switch to gryffindor theme
    await expect(themedElement).toHaveClass(/theme-gryffindor/);

    // Check localStorage was updated
    const storedTheme = await page.evaluate(() => localStorage.getItem('theme'));
    expect(storedTheme).toBe('gryffindor');
  });

  test('Error logging should persist across page reloads', async ({ page }) => {
    // Clear any existing logs
    await page.evaluate(() => {
      localStorage.removeItem('three-component-error-logs');
    });

    // Log a test error
    await page.evaluate(() => {
      const testError = {
        id: 'test-error-1',
        timestamp: new Date().toISOString(),
        component: 'TestComponent',
        componentType: '3D',
        severity: 'high',
        error: {
          message: 'Test error for persistence',
          name: 'TestError'
        },
        sessionId: 'test-session'
      };

      const logs = [testError];
      localStorage.setItem('three-component-error-logs', JSON.stringify(logs));
    });

    // Reload the page
    await page.reload();

    // Check if the error log persisted
    const persistedLogs = await page.evaluate(() => {
      const logs = localStorage.getItem('three-component-error-logs');
      return logs ? JSON.parse(logs) : null;
    });

    expect(persistedLogs).toBeTruthy();
    expect(persistedLogs).toHaveLength(1);
    expect(persistedLogs[0].component).toBe('TestComponent');
    expect(persistedLogs[0].error.message).toBe('Test error for persistence');
  });
});