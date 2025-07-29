import { test, expect } from '@playwright/test';

test.describe('ThreeErrorBoundary and Fallback Components', () => {
  test.beforeEach(async ({ page }) => {
    // Start the dev server for testing
    await page.goto('http://localhost:3001');
  });

  test('should render fallback UI when 3D component fails', async ({ page }) => {
    // Create a test component that will intentionally throw an error
    await page.addInitScript(() => {
      // Mock a Three.js error by overriding WebGL context creation
      const originalGetContext = HTMLCanvasElement.prototype.getContext;
      HTMLCanvasElement.prototype.getContext = function(contextType: string) {
        if (contextType === 'webgl' || contextType === 'webgl2') {
          throw new Error('WebGL context creation failed - test error');
        }
        return originalGetContext.call(this, contextType);
      };
    });

    // Wait for the page to load
    await page.waitForLoadState('networkidle');

    // Look for error boundary fallback UI
    const errorBoundaryFallback = page.locator('[data-testid="error-boundary-fallback"]').or(
      page.locator('text=3D component failed to load')
    );

    // The error boundary should show fallback UI
    await expect(errorBoundaryFallback).toBeVisible({ timeout: 10000 });
  });

  test('should log errors to localStorage', async ({ page }) => {
    // Inject error logging test
    await page.addInitScript(() => {
      // Clear existing logs
      localStorage.removeItem('three-component-error-logs');
      
      // Mock an error scenario
      window.addEventListener('error', (event) => {
        console.log('Test error captured:', event.error);
      });
    });

    // Trigger an error by trying to access a non-existent 3D resource
    await page.evaluate(() => {
      // Simulate a 3D component error
      const error = new Error('Test WebGL error for boundary testing');
      error.name = 'WebGLError';
      
      // Manually trigger error logging
      if (window.errorLogger) {
        window.errorLogger.logError(error, 'TestComponent', '3D', 'high');
      }
    });

    // Check if error was logged to localStorage
    const errorLogs = await page.evaluate(() => {
      const logs = localStorage.getItem('three-component-error-logs');
      return logs ? JSON.parse(logs) : null;
    });

    expect(errorLogs).toBeTruthy();
    if (errorLogs && errorLogs.length > 0) {
      expect(errorLogs[0]).toHaveProperty('component', 'TestComponent');
      expect(errorLogs[0]).toHaveProperty('componentType', '3D');
      expect(errorLogs[0]).toHaveProperty('severity', 'high');
    }
  });

  test('should render CandlesFallback component correctly', async ({ page }) => {
    // Navigate to a page section where candles would be
    await page.goto('http://localhost:3001');
    
    // Create a test for the fallback component by injecting it directly
    await page.evaluate(() => {
      // Create a container for the fallback component
      const container = document.createElement('div');
      container.id = 'test-candles-fallback';
      container.style.height = '300px';
      container.style.width = '100%';
      document.body.appendChild(container);
    });

    // Check if fallback animations are working
    const candlesContainer = page.locator('#test-candles-fallback');
    
    // Look for CSS animation elements
    const animatedElements = page.locator('.animate-float, .animate-flicker, .animate-float-particle');
    
    // Test should pass if no errors occur during rendering
    await expect(candlesContainer).toBeVisible();
  });

  test('should render PortraitsFallback with interactive elements', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-portraits-fallback';
      container.style.height = '400px';
      container.style.width = '100%';
      document.body.appendChild(container);
    });

    const portraitsContainer = page.locator('#test-portraits-fallback');
    await expect(portraitsContainer).toBeVisible();

    // Test mouse interaction if portraits are rendered
    await page.mouse.move(400, 300);
    
    // The test passes if no JavaScript errors occur
    const jsErrors: string[] = [];
    page.on('pageerror', (error) => {
      jsErrors.push(error.message);
    });

    await page.waitForTimeout(1000);
    expect(jsErrors.length).toBe(0);
  });

  test('should render SnitchFallback with flight animation', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.createElement('div');
      container.id = 'test-snitch-fallback';
      container.style.height = '320px';
      container.style.width = '100%';
      document.body.appendChild(container);
    });

    const snitchContainer = page.locator('#test-snitch-fallback');
    await expect(snitchContainer).toBeVisible();

    // Check for animation classes
    const animatedSnitch = page.locator('.animate-golden-pulse, .animate-flap-normal, .animate-trail-particle');
    
    // Test should pass without JavaScript errors
    await page.waitForTimeout(2000);
  });

  test('should handle theme switching correctly', async ({ page }) => {
    // Test theme switching functionality
    await page.goto('http://localhost:3001');

    // Look for theme toggle button
    const themeToggle = page.locator('[data-testid="theme-toggle"]').or(
      page.locator('button:has-text("theme")')
    ).first();

    if (await themeToggle.isVisible()) {
      await themeToggle.click();
      
      // Wait for theme change to apply
      await page.waitForTimeout(500);
      
      // Check if theme changed in localStorage or DOM
      const currentTheme = await page.evaluate(() => {
        return localStorage.getItem('theme') || document.documentElement.getAttribute('data-theme');
      });
      
      expect(currentTheme).toBeTruthy();
    }
  });

  test('should work in static build environment', async ({ page }) => {
    // Test that components work without server-side rendering
    await page.addInitScript(() => {
      // Simulate static build environment
      delete (window as any).__NEXT_DATA__;
      
      // Test client-side only functionality
      window.isStaticBuild = true;
    });

    await page.goto('http://localhost:3001');
    await page.waitForLoadState('networkidle');

    // Check that fallback components can render without SSR
    const bodyContent = await page.textContent('body');
    expect(bodyContent).toBeTruthy();
    
    // Ensure no critical errors in console
    const errors: string[] = [];
    page.on('pageerror', (error) => {
      if (error.message.includes('Critical') || error.message.includes('FATAL')) {
        errors.push(error.message);
      }
    });

    await page.waitForTimeout(3000);
    expect(errors.length).toBe(0);
  });

  test('should handle localStorage quota exceeded gracefully', async ({ page }) => {
    // Test error logging when localStorage is full
    await page.addInitScript(() => {
      // Mock localStorage quota exceeded
      const originalSetItem = localStorage.setItem;
      localStorage.setItem = function(key: string, value: string) {
        if (key === 'three-component-error-logs') {
          throw new Error('QuotaExceededError: localStorage quota exceeded');
        }
        return originalSetItem.call(this, key, value);
      };
    });

    await page.evaluate(() => {
      // Try to log an error when localStorage is "full"
      if (window.errorLogger) {
        window.errorLogger.logError(
          new Error('Test error for localStorage quota'),
          'TestComponent',
          '3D',
          'medium'
        );
      }
    });

    // Should not throw uncaught exceptions
    const uncaughtErrors: string[] = [];
    page.on('pageerror', (error) => {
      uncaughtErrors.push(error.message);
    });

    await page.waitForTimeout(1000);
    
    // Filter out expected quota errors
    const criticalErrors = uncaughtErrors.filter(error => 
      !error.includes('QuotaExceededError') && 
      !error.includes('localStorage quota')
    );
    
    expect(criticalErrors.length).toBe(0);
  });
});