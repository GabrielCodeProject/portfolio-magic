'use client';

// Enhanced client-side error logging utility for 3D components and fallbacks

export interface ErrorLogEntry {
  id: string;
  timestamp: string;
  component: string;
  componentType: '3D' | 'fallback' | 'boundary' | 'performance';
  severity: 'low' | 'medium' | 'high' | 'critical';
  error: {
    message: string;
    stack?: string;
    name: string;
  };
  context?: {
    userAgent?: string;
    url?: string;
    viewport?: { width: number; height: number };
    theme?: string;
    performanceData?: any;
    componentStack?: string;
  };
  sessionId: string;
}

export interface ErrorLoggerConfig {
  maxLogs: number;
  enableConsoleLogging: boolean;
  enableLocalStorage: boolean;
  logLevels: ('low' | 'medium' | 'high' | 'critical')[];
}

class ClientErrorLogger {
  private config: ErrorLoggerConfig;
  private sessionId: string;
  private storageKey = 'three-component-error-logs';

  constructor(config: Partial<ErrorLoggerConfig> = {}) {
    this.config = {
      maxLogs: 100,
      enableConsoleLogging: true,
      enableLocalStorage: true,
      logLevels: ['low', 'medium', 'high', 'critical'],
      ...config,
    };

    // Generate unique session ID
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateLogId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getContextInfo(): ErrorLogEntry['context'] {
    if (typeof window === 'undefined') return {};

    return {
      userAgent: navigator.userAgent,
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      theme: document.documentElement.getAttribute('data-theme') || 'unknown',
    };
  }

  logError(
    error: Error,
    componentName: string,
    componentType: ErrorLogEntry['componentType'] = '3D',
    severity: ErrorLogEntry['severity'] = 'medium',
    additionalContext?: Partial<ErrorLogEntry['context']>
  ): void {
    // Check if this severity level should be logged
    if (!this.config.logLevels.includes(severity)) {
      return;
    }

    const logEntry: ErrorLogEntry = {
      id: this.generateLogId(),
      timestamp: new Date().toISOString(),
      component: componentName,
      componentType,
      severity,
      error: {
        message: error.message,
        stack: error.stack,
        name: error.name,
      },
      context: {
        ...this.getContextInfo(),
        ...additionalContext,
      },
      sessionId: this.sessionId,
    };

    // Console logging
    if (this.config.enableConsoleLogging) {
      this.logToConsole(logEntry);
    }

    // localStorage logging
    if (this.config.enableLocalStorage) {
      this.logToStorage(logEntry);
    }
  }

  private logToConsole(logEntry: ErrorLogEntry): void {
    const prefix = `[${logEntry.componentType.toUpperCase()}][${logEntry.severity.toUpperCase()}][${logEntry.component}]`;
    const message = `${prefix} ${logEntry.error.message}`;

    switch (logEntry.severity) {
      case 'critical':
        console.error(message, logEntry);
        break;
      case 'high':
        console.error(message, logEntry);
        break;
      case 'medium':
        console.warn(message, logEntry);
        break;
      case 'low':
        console.info(message, logEntry);
        break;
      default:
        console.log(message, logEntry);
    }
  }

  private logToStorage(logEntry: ErrorLogEntry): void {
    if (typeof window === 'undefined') return;

    try {
      const existingLogs = this.getLogs();
      existingLogs.push(logEntry);

      // Keep only the most recent logs
      if (existingLogs.length > this.config.maxLogs) {
        existingLogs.splice(0, existingLogs.length - this.config.maxLogs);
      }

      localStorage.setItem(this.storageKey, JSON.stringify(existingLogs));
    } catch (storageError) {
      console.error('[ErrorLogger] Failed to save to localStorage:', storageError);
    }
  }

  getLogs(): ErrorLogEntry[] {
    if (typeof window === 'undefined') return [];

    try {
      const logs = localStorage.getItem(this.storageKey);
      return logs ? JSON.parse(logs) : [];
    } catch (parseError) {
      console.error('[ErrorLogger] Failed to parse logs from localStorage:', parseError);
      return [];
    }
  }

  getLogsByComponent(componentName: string): ErrorLogEntry[] {
    return this.getLogs().filter(log => log.component === componentName);
  }

  getLogsBySeverity(severity: ErrorLogEntry['severity']): ErrorLogEntry[] {
    return this.getLogs().filter(log => log.severity === severity);
  }

  getLogsForSession(sessionId?: string): ErrorLogEntry[] {
    const targetSessionId = sessionId || this.sessionId;
    return this.getLogs().filter(log => log.sessionId === targetSessionId);
  }

  clearLogs(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error('[ErrorLogger] Failed to clear logs:', error);
    }
  }

  exportLogs(): string {
    return JSON.stringify(this.getLogs(), null, 2);
  }

  // Helper method for React Error Boundaries
  logReactError(
    error: Error,
    errorInfo: React.ErrorInfo,
    componentName: string,
    severity: ErrorLogEntry['severity'] = 'high'
  ): void {
    this.logError(error, componentName, 'boundary', severity, {
      componentStack: errorInfo.componentStack || undefined,
    });
  }

  // Helper method for performance-related errors
  logPerformanceError(
    error: Error,
    componentName: string,
    performanceData: any,
    severity: ErrorLogEntry['severity'] = 'medium'
  ): void {
    this.logError(error, componentName, 'performance', severity, {
      performanceData,
    });
  }

  // Helper method for fallback component issues
  logFallbackError(
    error: Error,
    componentName: string,
    severity: ErrorLogEntry['severity'] = 'low'
  ): void {
    this.logError(error, componentName, 'fallback', severity);
  }
}

// Create singleton instance
export const errorLogger = new ClientErrorLogger();

// Export types and utilities
export { ClientErrorLogger };
export default errorLogger;