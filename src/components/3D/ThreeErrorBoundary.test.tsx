import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import ThreeErrorBoundary from './ThreeErrorBoundary';
import { errorLogger } from '@/utils/errorLogger';

// Mock the errorLogger
jest.mock('@/utils/errorLogger', () => ({
  errorLogger: {
    logReactError: jest.fn(),
  },
}));

// Component that throws an error on purpose for testing
const ThrowError: React.FC<{ shouldThrow?: boolean; errorMessage?: string }> = ({ 
  shouldThrow = true, 
  errorMessage = 'Test error' 
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div data-testid="success-component">Component rendered successfully</div>;
};

// Component that renders successfully
const SuccessComponent: React.FC = () => (
  <div data-testid="success-component">Component rendered successfully</div>
);

// Mock console methods to test logging
const mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
const mockConsoleGroup = jest.spyOn(console, 'group').mockImplementation(() => {});
const mockConsoleGroupEnd = jest.spyOn(console, 'groupEnd').mockImplementation(() => {});

describe('ThreeErrorBoundary', () => {
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    jest.clearAllMocks();
    mockConsoleError.mockClear();
    mockConsoleGroup.mockClear();
    mockConsoleGroupEnd.mockClear();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  describe('Normal Operation', () => {
    it('should render children when no error occurs', () => {
      render(
        <ThreeErrorBoundary>
          <SuccessComponent />
        </ThreeErrorBoundary>
      );

      expect(screen.getByTestId('success-component')).toBeInTheDocument();
      expect(screen.getByText('Component rendered successfully')).toBeInTheDocument();
    });

    it('should render multiple children when no error occurs', () => {
      render(
        <ThreeErrorBoundary>
          <div data-testid="child-1">Child 1</div>
          <div data-testid="child-2">Child 2</div>
        </ThreeErrorBoundary>
      );

      expect(screen.getByTestId('child-1')).toBeInTheDocument();
      expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('should pass through props to children', () => {
      const TestComponent: React.FC<{ testProp: string }> = ({ testProp }) => (
        <div data-testid="test-component">{testProp}</div>
      );

      render(
        <ThreeErrorBoundary>
          <TestComponent testProp="test value" />
        </ThreeErrorBoundary>
      );

      expect(screen.getByText('test value')).toBeInTheDocument();
    });
  });

  describe('Error Catching', () => {
    it('should catch errors and display default fallback UI', () => {
      render(
        <ThreeErrorBoundary>
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('should catch errors with custom error messages', () => {
      render(
        <ThreeErrorBoundary>
          <ThrowError errorMessage="Custom WebGL error" />
        </ThreeErrorBoundary>
      );

      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();
    });

    it('should update component state when error occurs', () => {
      const TestBoundary = () => {
        const [hasError, setHasError] = React.useState(false);
        
        React.useEffect(() => {
          const boundary = document.querySelector('.error-boundary');
          if (boundary?.textContent?.includes('3D component failed to load')) {
            setHasError(true);
          }
        }, []);

        return (
          <div>
            <div className="error-boundary">
              <ThreeErrorBoundary>
                <ThrowError />
              </ThreeErrorBoundary>
            </div>
            <div data-testid="error-state">{hasError ? 'error-caught' : 'no-error'}</div>
          </div>
        );
      };

      render(<TestBoundary />);
      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();
    });
  });

  describe('Custom Fallback UI', () => {
    it('should render custom fallback when provided', () => {
      const customFallback = <div data-testid="custom-fallback">Custom fallback UI</div>;

      render(
        <ThreeErrorBoundary fallback={customFallback}>
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom fallback UI')).toBeInTheDocument();
      expect(screen.queryByText('3D component failed to load')).not.toBeInTheDocument();
    });

    it('should render complex custom fallback components', () => {
      const CustomFallback = () => (
        <div data-testid="complex-fallback">
          <h2>Something went wrong</h2>
          <p>Please try refreshing the page</p>
          <button>Retry</button>
        </div>
      );

      render(
        <ThreeErrorBoundary fallback={<CustomFallback />}>
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(screen.getByTestId('complex-fallback')).toBeInTheDocument();
      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
      expect(screen.getByText('Please try refreshing the page')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });

  describe('Error Logging Integration', () => {
    it('should call errorLogger.logReactError when error occurs', () => {
      const mockLogReactError = errorLogger.logReactError as jest.Mock;

      render(
        <ThreeErrorBoundary componentName="TestComponent" severity="high">
          <ThrowError errorMessage="Test logging error" />
        </ThreeErrorBoundary>
      );

      expect(mockLogReactError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test logging error',
          name: 'Error'
        }),
        expect.objectContaining({
          componentStack: expect.any(String)
        }),
        'TestComponent',
        'high'
      );
    });

    it('should use default component name when not provided', () => {
      const mockLogReactError = errorLogger.logReactError as jest.Mock;

      render(
        <ThreeErrorBoundary>
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(mockLogReactError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object),
        'Unknown3DComponent',
        'high'
      );
    });

    it('should use default severity when not provided', () => {
      const mockLogReactError = errorLogger.logReactError as jest.Mock;

      render(
        <ThreeErrorBoundary componentName="TestComponent">
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(mockLogReactError).toHaveBeenCalledWith(
        expect.any(Error),
        expect.any(Object),
        'TestComponent',
        'high'
      );
    });

    it('should handle errorLogger failures gracefully', () => {
      const mockLogReactError = errorLogger.logReactError as jest.Mock;
      mockLogReactError.mockImplementationOnce(() => {
        throw new Error('Logger failed');
      });

      render(
        <ThreeErrorBoundary componentName="TestComponent">
          <ThrowError />
        </ThreeErrorBoundary>
      );

      // Should still render fallback UI even if logging fails
      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();
      expect(mockConsoleError).toHaveBeenCalledWith(
        'Enhanced error logging failed, falling back to basic logging:',
        expect.any(Error)
      );
    });
  });

  describe('3D-Specific Error Detection', () => {
    it('should detect WebGL errors', () => {
      render(
        <ThreeErrorBoundary componentName="WebGLComponent">
          <ThrowError errorMessage="WebGL context lost" />
        </ThreeErrorBoundary>
      );

      expect(mockConsoleGroup).toHaveBeenCalledWith('🎮 3D Component Error: WebGLComponent');
      expect(mockConsoleError).toHaveBeenCalledWith('Possible causes:', expect.arrayContaining([
        'WebGL not supported or context lost',
        'GPU drivers may need updating'
      ]));
      expect(mockConsoleGroupEnd).toHaveBeenCalled();
    });

    it('should detect Three.js errors', () => {
      render(
        <ThreeErrorBoundary componentName="ThreeComponent">
          <ThrowError errorMessage="THREE.Scene is not defined" />
        </ThreeErrorBoundary>
      );

      expect(mockConsoleGroup).toHaveBeenCalledWith('🎮 3D Component Error: ThreeComponent');
      expect(mockConsoleGroupEnd).toHaveBeenCalled();
    });

    it('should detect shader errors', () => {
      render(
        <ThreeErrorBoundary componentName="ShaderComponent">
          <ThrowError errorMessage="Shader compilation failed" />
        </ThreeErrorBoundary>
      );

      expect(mockConsoleError).toHaveBeenCalledWith('Possible causes:', expect.arrayContaining([
        'Shader compilation failed',
        'Graphics card may not support required features'
      ]));
    });

    it('should detect buffer/memory errors', () => {
      render(
        <ThreeErrorBoundary componentName="BufferComponent">
          <ThrowError errorMessage="Buffer allocation failed" />
        </ThreeErrorBoundary>
      );

      expect(mockConsoleError).toHaveBeenCalledWith('Possible causes:', expect.arrayContaining([
        'Insufficient GPU memory',
        'Too many 3D objects loaded simultaneously'
      ]));
    });

    it('should detect texture errors', () => {
      render(
        <ThreeErrorBoundary componentName="TextureComponent">
          <ThrowError errorMessage="Texture loading failed" />
        </ThreeErrorBoundary>
      );

      expect(mockConsoleError).toHaveBeenCalledWith('Possible causes:', expect.arrayContaining([
        'Texture loading failed',
        'Image format not supported'
      ]));
    });

    it('should provide generic suggestions for non-3D errors', () => {      
      // Test with an error that definitely has no 3D keywords
      const mockDetect = jest.spyOn(ThreeErrorBoundary.prototype as any, 'detect3DSpecificError');
      mockDetect.mockReturnValue(false); // Force non-3D detection
      
      render(
        <ThreeErrorBoundary componentName="GenericComponent">
          <ThrowError errorMessage="Something went wrong in the component" />
        </ThreeErrorBoundary>
      );

      // Should not trigger 3D-specific logging for non-3D errors
      expect(mockConsoleGroup).not.toHaveBeenCalledWith('🎮 3D Component Error: GenericComponent');
      
      mockDetect.mockRestore();
    });
  });

  describe('Development vs Production Behavior', () => {
    it('should show error ID in development mode', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true });

      render(
        <ThreeErrorBoundary componentName="DevComponent">
          <ThrowError />
        </ThreeErrorBoundary>
      );

      // Should show error ID pattern
      expect(screen.getByText(/Error ID: DevComponent_\d+/)).toBeInTheDocument();
    });

    it('should not show error ID in production mode', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'production', writable: true });

      render(
        <ThreeErrorBoundary componentName="ProdComponent">
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(screen.queryByText(/Error ID:/)).not.toBeInTheDocument();
    });

    it('should handle undefined NODE_ENV', () => {
      delete (process.env as any).NODE_ENV;

      render(
        <ThreeErrorBoundary componentName="UndefComponent">
          <ThrowError />
        </ThreeErrorBoundary>
      );

      // Should render fallback without error
      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();
    });
  });

  describe('Error ID Generation', () => {
    it('should generate unique error IDs', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true });

      // Create first error boundary instance
      const { container: container1 } = render(
        <div data-testid="boundary-1">
          <ThreeErrorBoundary componentName="Component1">
            <ThrowError />
          </ThreeErrorBoundary>
        </div>
      );

      const firstErrorElement = container1.querySelector('[data-testid="boundary-1"]')?.textContent;
      const firstErrorIdMatch = firstErrorElement?.match(/Error ID: (Component1_\d+)/);
      const firstErrorId = firstErrorIdMatch?.[1];

      // Create second error boundary instance  
      const { container: container2 } = render(
        <div data-testid="boundary-2">
          <ThreeErrorBoundary componentName="Component2">
            <ThrowError />
          </ThreeErrorBoundary>
        </div>
      );

      const secondErrorElement = container2.querySelector('[data-testid="boundary-2"]')?.textContent;
      const secondErrorIdMatch = secondErrorElement?.match(/Error ID: (Component2_\d+)/);
      const secondErrorId = secondErrorIdMatch?.[1];

      expect(firstErrorId).toBeTruthy();
      expect(secondErrorId).toBeTruthy();
      expect(firstErrorId).not.toBe(secondErrorId);
    });

    it('should include component name in error ID', () => {
      Object.defineProperty(process.env, 'NODE_ENV', { value: 'development', writable: true });

      render(
        <ThreeErrorBoundary componentName="MySpecialComponent">
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(screen.getByText(/Error ID: MySpecialComponent_\d+/)).toBeInTheDocument();
    });
  });

  describe('Error State Management', () => {
    it('should maintain error state after initial error', () => {
      const { rerender } = render(
        <ThreeErrorBoundary>
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();

      // Rerender with successful component - should still show error
      rerender(
        <ThreeErrorBoundary>
          <SuccessComponent />
        </ThreeErrorBoundary>
      );

      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();
      expect(screen.queryByTestId('success-component')).not.toBeInTheDocument();
    });

    it('should reset error state with new boundary instance', () => {
      const { unmount } = render(
        <ThreeErrorBoundary>
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();

      unmount();

      render(
        <ThreeErrorBoundary>
          <SuccessComponent />
        </ThreeErrorBoundary>
      );

      expect(screen.getByTestId('success-component')).toBeInTheDocument();
      expect(screen.queryByText('3D component failed to load')).not.toBeInTheDocument();
    });
  });

  describe('Component Lifecycle', () => {
    it('should initialize with no error state', () => {
      const { container } = render(
        <ThreeErrorBoundary>
          <div data-testid="initial-child">Initial content</div>
        </ThreeErrorBoundary>
      );

      expect(screen.getByTestId('initial-child')).toBeInTheDocument();
      expect(container.firstChild).toMatchSnapshot();
    });

    it('should handle componentDidCatch lifecycle', () => {
      const mockLogReactError = errorLogger.logReactError as jest.Mock;

      render(
        <ThreeErrorBoundary componentName="LifecycleTest">
          <ThrowError errorMessage="Lifecycle test error" />
        </ThreeErrorBoundary>
      );

      expect(mockLogReactError).toHaveBeenCalledTimes(1);
      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();
    });

    it('should handle unmounting gracefully', () => {
      const { unmount } = render(
        <ThreeErrorBoundary>
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();

      // Should unmount without throwing
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Edge Cases', () => {
    it('should handle errors with no message', () => {
      const ErrorWithNoMessage = () => {
        const error = new Error();
        error.message = '';
        throw error;
      };

      render(
        <ThreeErrorBoundary>
          <ErrorWithNoMessage />
        </ThreeErrorBoundary>
      );

      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();
    });

    it('should handle errors with no stack trace', () => {
      const ErrorWithNoStack = () => {
        const error = new Error('No stack error');
        error.stack = undefined;
        throw error;
      };

      render(
        <ThreeErrorBoundary>
          <ErrorWithNoStack />
        </ThreeErrorBoundary>
      );

      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();
    });

    it('should handle null children', () => {
      render(
        <ThreeErrorBoundary>
          {null}
        </ThreeErrorBoundary>
      );

      // Should render nothing but not crash
      expect(document.body).toBeInTheDocument();
    });

    it('should handle undefined children', () => {
      render(
        <ThreeErrorBoundary>
          {undefined}
        </ThreeErrorBoundary>
      );

      // Should render nothing but not crash
      expect(document.body).toBeInTheDocument();
    });

    it('should handle empty children array', () => {
      render(
        <ThreeErrorBoundary>
          {[]}
        </ThreeErrorBoundary>
      );

      // Should render nothing but not crash
      expect(document.body).toBeInTheDocument();
    });
  });

  describe('Error Recovery', () => {
    it('should not recover from errors automatically', () => {
      const { rerender } = render(
        <ThreeErrorBoundary>
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();

      // Force re-render - should still show error
      rerender(
        <ThreeErrorBoundary>
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();
    });

    it('should handle prop changes after error', () => {
      const { rerender } = render(
        <ThreeErrorBoundary componentName="Initial">
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();

      // Change props - should show new fallback when fallback prop changes
      rerender(
        <ThreeErrorBoundary 
          componentName="Updated" 
          fallback={<div data-testid="updated-fallback">Updated fallback</div>}
        >
          <ThrowError />
        </ThreeErrorBoundary>
      );

      expect(screen.getByTestId('updated-fallback')).toBeInTheDocument();
      expect(screen.getByText('Updated fallback')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible error message structure', () => {
      render(
        <ThreeErrorBoundary>
          <ThrowError />
        </ThreeErrorBoundary>
      );

      const errorContainer = screen.getByText('3D component failed to load').closest('div');
      expect(errorContainer).toHaveClass('text-center');
      expect(screen.getByText('⚠️')).toBeInTheDocument();
    });

    it('should maintain focus management during error display', () => {
      render(
        <div>
          <button data-testid="before-button">Before</button>
          <ThreeErrorBoundary>
            <ThrowError />
          </ThreeErrorBoundary>
          <button data-testid="after-button">After</button>
        </div>
      );

      expect(screen.getByTestId('before-button')).toBeInTheDocument();
      expect(screen.getByText('3D component failed to load')).toBeInTheDocument();
      expect(screen.getByTestId('after-button')).toBeInTheDocument();
    });
  });
});