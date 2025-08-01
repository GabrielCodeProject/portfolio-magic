import { ClientErrorLogger, errorLogger, type ErrorLogEntry } from './errorLogger';

// Mock localStorage
const createMockLocalStorage = () => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
};

let mockLocalStorage = createMockLocalStorage();

// Mock console methods
const mockConsole = {
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  log: jest.fn(),
};

describe('ClientErrorLogger', () => {
  let logger: ClientErrorLogger;
  let originalWindow: any;
  let originalLocalStorage: any;
  let originalConsole: any;

  beforeEach(() => {
    originalWindow = global.window;
    originalLocalStorage = global.localStorage;
    originalConsole = global.console;

    // Create fresh mock for each test
    mockLocalStorage = createMockLocalStorage();
    
    // Clear mocks
    jest.clearAllMocks();

    // Mock window and localStorage
    global.window = {
      location: { href: 'https://example.com/test' },
      innerWidth: 1920,
      innerHeight: 1080,
      localStorage: mockLocalStorage,
    } as any;

    global.localStorage = mockLocalStorage as any;

    global.navigator = {
      userAgent: 'Mozilla/5.0 (Test Browser)',
    } as any;

    global.document = {
      documentElement: {
        getAttribute: jest.fn(() => 'dark'),
      },
    } as any;

    // Mock console
    global.console = mockConsole as any;

    // Create fresh logger instance
    logger = new ClientErrorLogger();

    // Clear mocks
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  afterEach(() => {
    global.window = originalWindow;
    global.localStorage = originalLocalStorage;
    global.console = originalConsole;
  });

  describe('Constructor and Configuration', () => {
    it('should initialize with default configuration', () => {
      const defaultLogger = new ClientErrorLogger();
      expect(defaultLogger).toBeDefined();
    });

    it('should accept custom configuration', () => {
      const customLogger = new ClientErrorLogger({
        maxLogs: 50,
        enableConsoleLogging: false,
        enableLocalStorage: false,
        logLevels: ['high', 'critical'],
      });
      expect(customLogger).toBeDefined();
    });
  });

  describe('Error Logging', () => {
    it('should log error with all required information', () => {
      const testError = new Error('Test error message');
      testError.stack = 'Error stack trace';

      logger.logError(testError, 'TestComponent');

      expect(mockConsole.warn).toHaveBeenCalled();
      expect(mockLocalStorage.setItem).toHaveBeenCalled();

      const logCall = mockLocalStorage.setItem.mock.calls[0];
      const logData = JSON.parse(logCall[1]);
      const logEntry = logData[0] as ErrorLogEntry;

      expect(logEntry.component).toBe('TestComponent');
      expect(logEntry.componentType).toBe('3D');
      expect(logEntry.severity).toBe('medium');
      expect(logEntry.error.message).toBe('Test error message');
      expect(logEntry.error.stack).toBe('Error stack trace');
      expect(logEntry.error.name).toBe('Error');
      expect(logEntry.timestamp).toBeDefined();
      expect(logEntry.id).toBeDefined();
      expect(logEntry.sessionId).toBeDefined();
    });

    it('should include context information', () => {
      const testError = new Error('Context test');
      logger.logError(testError, 'ContextComponent');

      const logCall = mockLocalStorage.setItem.mock.calls[0];
      const logData = JSON.parse(logCall[1]);
      const logEntry = logData[0] as ErrorLogEntry;

      expect(logEntry.context?.userAgent).toBe('Mozilla/5.0 (Test Browser)');
      expect(logEntry.context?.url).toBe('https://example.com/test');
      expect(logEntry.context?.viewport).toEqual({ width: 1920, height: 1080 });
      expect(logEntry.context?.theme).toBe('dark');
    });

    it('should handle different severity levels correctly', () => {
      const testError = new Error('Severity test');

      // Test critical level
      logger.logError(testError, 'CriticalComponent', '3D', 'critical');
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('[3D][CRITICAL][CriticalComponent]'),
        expect.any(Object)
      );

      // Test high level
      logger.logError(testError, 'HighComponent', '3D', 'high');
      expect(mockConsole.error).toHaveBeenCalledWith(
        expect.stringContaining('[3D][HIGH][HighComponent]'),
        expect.any(Object)
      );

      // Test medium level
      logger.logError(testError, 'MediumComponent', '3D', 'medium');
      expect(mockConsole.warn).toHaveBeenCalledWith(
        expect.stringContaining('[3D][MEDIUM][MediumComponent]'),
        expect.any(Object)
      );

      // Test low level
      logger.logError(testError, 'LowComponent', '3D', 'low');
      expect(mockConsole.info).toHaveBeenCalledWith(
        expect.stringContaining('[3D][LOW][LowComponent]'),
        expect.any(Object)
      );
    });

    it('should handle different component types', () => {
      const testError = new Error('Component type test');

      logger.logError(testError, 'ThreeComponent', '3D', 'medium');
      logger.logError(testError, 'FallbackComponent', 'fallback', 'low');
      logger.logError(testError, 'BoundaryComponent', 'boundary', 'high');
      logger.logError(testError, 'PerformanceComponent', 'performance', 'medium');

      const logs = logger.getLogs();
      expect(logs).toHaveLength(4);
      expect(logs[0].componentType).toBe('3D');
      expect(logs[1].componentType).toBe('fallback');
      expect(logs[2].componentType).toBe('boundary');
      expect(logs[3].componentType).toBe('performance');
    });

    it('should respect log level configuration', () => {
      const restrictedLogger = new ClientErrorLogger({
        logLevels: ['high', 'critical'],
      });

      const testError = new Error('Log level test');

      restrictedLogger.logError(testError, 'TestComponent', '3D', 'low');
      restrictedLogger.logError(testError, 'TestComponent', '3D', 'medium');
      restrictedLogger.logError(testError, 'TestComponent', '3D', 'high');

      const logs = restrictedLogger.getLogs();
      expect(logs).toHaveLength(1);
      expect(logs[0].severity).toBe('high');
    });

    it('should handle additional context', () => {
      const testError = new Error('Additional context test');
      const additionalContext = {
        performanceData: { fps: 30, memory: 512 },
        componentStack: 'Component stack trace',
      };

      logger.logError(testError, 'ContextComponent', '3D', 'medium', additionalContext);

      const logs = logger.getLogs();
      expect(logs[0].context?.performanceData).toEqual(additionalContext.performanceData);
      expect(logs[0].context?.componentStack).toBe(additionalContext.componentStack);
    });
  });

  describe('Storage Management', () => {
    it('should maintain maximum log count', () => {
      const smallLogger = new ClientErrorLogger({ maxLogs: 3 });
      const testError = new Error('Max logs test');

      // Add 5 logs to exceed maxLogs
      for (let i = 0; i < 5; i++) {
        smallLogger.logError(testError, `Component${i}`);
      }

      const logs = smallLogger.getLogs();
      expect(logs).toHaveLength(3);
      // Should keep the most recent logs (Component2, Component3, Component4)
      expect(logs[0].component).toBe('Component2');
      expect(logs[1].component).toBe('Component3');
      expect(logs[2].component).toBe('Component4');
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage full');
      });

      const testError = new Error('Storage error test');
      logger.logError(testError, 'StorageTestComponent');

      expect(mockConsole.error).toHaveBeenCalledWith(
        '[ErrorLogger] Failed to save to localStorage:',
        expect.any(Error)
      );
    });

    it('should handle localStorage parse errors gracefully', () => {
      // Mock localStorage to return invalid JSON
      mockLocalStorage.getItem.mockReturnValue('invalid json');

      const logs = logger.getLogs();
      expect(logs).toEqual([]);
      expect(mockConsole.error).toHaveBeenCalledWith(
        '[ErrorLogger] Failed to parse logs from localStorage:',
        expect.any(Error)
      );
    });

    it('should clear logs correctly', () => {
      const testError = new Error('Clear test');
      logger.logError(testError, 'ClearTestComponent');

      expect(logger.getLogs()).toHaveLength(1);

      logger.clearLogs();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('three-component-error-logs');
    });

    it('should handle clear logs errors gracefully', () => {
      mockLocalStorage.removeItem.mockImplementation(() => {
        throw new Error('Clear failed');
      });

      logger.clearLogs();
      expect(mockConsole.error).toHaveBeenCalledWith(
        '[ErrorLogger] Failed to clear logs:',
        expect.any(Error)
      );
    });
  });

  describe('Log Filtering and Retrieval', () => {
    beforeEach(() => {
      // Add test logs
      const testError = new Error('Filter test');
      logger.logError(testError, 'ComponentA', '3D', 'high');
      logger.logError(testError, 'ComponentB', 'fallback', 'low');
      logger.logError(testError, 'ComponentA', 'boundary', 'medium');
      logger.logError(testError, 'ComponentC', '3D', 'high');
    });

    it('should filter logs by component', () => {
      const componentALogs = logger.getLogsByComponent('ComponentA');
      expect(componentALogs).toHaveLength(2);
      expect(componentALogs.every(log => log.component === 'ComponentA')).toBe(true);
    });

    it('should filter logs by severity', () => {
      const highSeverityLogs = logger.getLogsBySeverity('high');
      expect(highSeverityLogs).toHaveLength(2);
      expect(highSeverityLogs.every(log => log.severity === 'high')).toBe(true);
    });

    it('should filter logs by session', () => {
      const sessionLogs = logger.getLogsForSession();
      expect(sessionLogs).toHaveLength(4);

      // Test with specific session ID
      const firstLog = logger.getLogs()[0];
      const specificSessionLogs = logger.getLogsForSession(firstLog.sessionId);
      expect(specificSessionLogs).toHaveLength(4);
    });

    it('should export logs as JSON string', () => {
      const exportedLogs = logger.exportLogs();
      const parsedLogs = JSON.parse(exportedLogs);
      expect(Array.isArray(parsedLogs)).toBe(true);
      expect(parsedLogs).toHaveLength(4);
    });
  });

  describe('Helper Methods', () => {
    it('should log React errors correctly', () => {
      const testError = new Error('React error');
      const errorInfo = {
        componentStack: 'React component stack',
      } as React.ErrorInfo;

      logger.logReactError(testError, errorInfo, 'ReactComponent', 'critical');

      const logs = logger.getLogs();
      const reactLog = logs[logs.length - 1];

      expect(reactLog.componentType).toBe('boundary');
      expect(reactLog.severity).toBe('critical');
      expect(reactLog.context?.componentStack).toBe('React component stack');
    });

    it('should log performance errors correctly', () => {
      const testError = new Error('Performance error');
      const performanceData = { fps: 15, memory: 1024 };

      logger.logPerformanceError(testError, 'PerformanceComponent', performanceData, 'high');

      const logs = logger.getLogs();
      const perfLog = logs[logs.length - 1];

      expect(perfLog.componentType).toBe('performance');
      expect(perfLog.severity).toBe('high');
      expect(perfLog.context?.performanceData).toEqual(performanceData);
    });

    it('should log fallback errors correctly', () => {
      const testError = new Error('Fallback error');

      logger.logFallbackError(testError, 'FallbackComponent', 'medium');

      const logs = logger.getLogs();
      const fallbackLog = logs[logs.length - 1];

      expect(fallbackLog.componentType).toBe('fallback');
      expect(fallbackLog.severity).toBe('medium');
      expect(fallbackLog.component).toBe('FallbackComponent');
    });
  });

  describe('Server-Side Rendering Compatibility', () => {
    it('should handle undefined window gracefully', () => {
      const originalWindow = global.window;
      global.window = undefined as any;

      const ssrLogger = new ClientErrorLogger();
      const testError = new Error('SSR test');

      ssrLogger.logError(testError, 'SSRComponent');

      expect(ssrLogger.getLogs()).toEqual([]);
      
      // Restore window
      global.window = originalWindow;
    });

    it('should return empty context when window is undefined', () => {
      const originalWindow = global.window;
      global.window = undefined as any;

      const ssrLogger = new ClientErrorLogger();
      const logs = ssrLogger.getLogs();

      expect(logs).toEqual([]);
      
      // Restore window
      global.window = originalWindow;
    });
  });

  describe('Console Logging Configuration', () => {
    it('should respect console logging configuration', () => {
      const noConsoleLogger = new ClientErrorLogger({
        enableConsoleLogging: false,
      });

      const testError = new Error('No console test');
      noConsoleLogger.logError(testError, 'NoConsoleComponent');

      expect(mockConsole.warn).not.toHaveBeenCalled();
      expect(mockConsole.error).not.toHaveBeenCalled();
      expect(mockConsole.info).not.toHaveBeenCalled();
      expect(mockConsole.log).not.toHaveBeenCalled();
    });

    it('should respect localStorage configuration', () => {
      const noStorageLogger = new ClientErrorLogger({
        enableLocalStorage: false,
      });

      const testError = new Error('No storage test');
      noStorageLogger.logError(testError, 'NoStorageComponent');

      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });
  });
});

describe('Singleton errorLogger', () => {
  it('should export a singleton instance', () => {
    expect(errorLogger).toBeDefined();
    expect(errorLogger).toBeInstanceOf(ClientErrorLogger);
  });

  it('should be the same instance across imports', () => {
    const { errorLogger: importedLogger } = require('./errorLogger');
    expect(importedLogger).toBe(errorLogger);
  });
});