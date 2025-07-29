/**
 * Performance Metrics Storage Utility
 * localStorage-based performance metrics storage for development mode
 * Compatible with Next.js static export and GitHub Pages
 */

// Performance metric types
export interface PerformanceMetric {
  id: string;
  timestamp: number;
  sessionId: string;
  type: 'fps' | 'capability' | 'threshold' | 'component' | 'event';
  data: Record<string, any>;
  metadata?: {
    userAgent?: string;
    url?: string;
    viewport?: { width: number; height: number };
    devicePixelRatio?: number;
  };
}

// FPS-specific metrics
export interface FpsMetric extends PerformanceMetric {
  type: 'fps';
  data: {
    componentType: string;
    currentFps: number;
    averageFps: number;
    threshold: number;
    isLowFps: boolean;
    performanceLevel: string;
    timeSinceStart: number;
    fpsHistory: number[];
  };
}

// Device capability metrics
export interface CapabilityMetric extends PerformanceMetric {
  type: 'capability';
  data: {
    deviceClass: string;
    performanceLevel: string;
    canRender3D: boolean;
    webGLSupported: boolean;
    webGL2Supported: boolean;
    memoryEstimate: number;
    cores: number;
    score: number;
  };
}

// Performance threshold metrics
export interface ThresholdMetric extends PerformanceMetric {
  type: 'threshold';
  data: {
    tier: string;
    enabledComponents: {
      candles: boolean;
      portraits: boolean;
      snitch: boolean;
    };
    settings: Record<string, any>;
  };
}

// Component decision metrics
export interface ComponentMetric extends PerformanceMetric {
  type: 'component';
  data: {
    componentType: string;
    shouldRender: boolean;
    reason: string;
    fallbackUsed: boolean;
  };
}

// Performance event metrics (degradation, recovery, errors)
export interface EventMetric extends PerformanceMetric {
  type: 'event';
  data: {
    eventType: 'degradation' | 'recovery' | 'error' | 'fallback_activated' | 'fallback_deactivated';
    componentType: string;
    details: Record<string, any>;
    severity: 'low' | 'medium' | 'high';
  };
}

// Storage configuration
interface StorageConfig {
  enabled: boolean;
  maxEntries: number;
  maxAge: number; // milliseconds
  compressionEnabled: boolean;
  batchSize: number;
}

// Default storage configuration
const DEFAULT_CONFIG: StorageConfig = {
  enabled: true,
  maxEntries: 1000, // Keep last 1000 metrics
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  compressionEnabled: true,
  batchSize: 50, // Process in batches of 50
};

// Session ID for grouping metrics
let currentSessionId: string | null = null;

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Get current session ID, create if doesn't exist
 */
function getSessionId(): string {
  if (!currentSessionId) {
    currentSessionId = generateSessionId();
  }
  return currentSessionId;
}

/**
 * Check if we're in a browser environment and development mode
 */
function isStorageEnabled(): boolean {
  return (
    typeof window !== 'undefined' && 
    typeof localStorage !== 'undefined' &&
    process.env.NODE_ENV === 'development'
  );
}

/**
 * Get metadata for current environment
 */
function getEnvironmentMetadata() {
  if (!isStorageEnabled()) return {};

  return {
    userAgent: navigator.userAgent,
    url: window.location.href,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    devicePixelRatio: window.devicePixelRatio || 1,
  };
}

/**
 * Performance Metrics Storage Class
 */
class PerformanceMetricsStorage {
  private config: StorageConfig;
  private storageKey = 'perf_metrics_v2';
  private indexKey = 'perf_metrics_index_v2';

  constructor(config: Partial<StorageConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Store a performance metric
   */
  store(metric: Omit<PerformanceMetric, 'id' | 'timestamp' | 'sessionId' | 'metadata'>): void {
    if (!isStorageEnabled() || !this.config.enabled) return;

    try {
      const fullMetric: PerformanceMetric = {
        ...metric,
        id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        sessionId: getSessionId(),
        metadata: getEnvironmentMetadata(),
      };

      // Get existing metrics
      const existingMetrics = this.getAllMetrics();
      
      // Add new metric
      existingMetrics.push(fullMetric);
      
      // Clean up old metrics
      const cleanedMetrics = this.cleanupMetrics(existingMetrics);
      
      // Store back to localStorage
      this.storeMetrics(cleanedMetrics);
      
      // Update index
      this.updateIndex(fullMetric);

    } catch (error) {
      console.warn('[PerformanceMetricsStorage] Failed to store metric:', error);
    }
  }

  /**
   * Store FPS metric
   */
  storeFpsMetric(data: FpsMetric['data']): void {
    this.store({
      type: 'fps',
      data,
    });
  }

  /**
   * Store capability metric
   */
  storeCapabilityMetric(data: CapabilityMetric['data']): void {
    this.store({
      type: 'capability',
      data,
    });
  }

  /**
   * Store threshold metric
   */
  storeThresholdMetric(data: ThresholdMetric['data']): void {
    this.store({
      type: 'threshold',
      data,
    });
  }

  /**
   * Store component metric
   */
  storeComponentMetric(data: ComponentMetric['data']): void {
    this.store({
      type: 'component',
      data,
    });
  }

  /**
   * Store event metric
   */
  storeEventMetric(data: EventMetric['data']): void {
    this.store({
      type: 'event',
      data,
    });
  }

  /**
   * Get all stored metrics
   */
  getAllMetrics(): PerformanceMetric[] {
    if (!isStorageEnabled()) return [];

    try {
      const stored = localStorage.getItem(this.storageKey);
      if (!stored) return [];

      const metrics = JSON.parse(stored) as PerformanceMetric[];
      return Array.isArray(metrics) ? metrics : [];
    } catch (error) {
      console.warn('[PerformanceMetricsStorage] Failed to load metrics:', error);
      return [];
    }
  }

  /**
   * Get metrics by type
   */
  getMetricsByType<T extends PerformanceMetric>(type: T['type']): T[] {
    return this.getAllMetrics().filter(metric => metric.type === type) as T[];
  }

  /**
   * Get metrics by session
   */
  getMetricsBySession(sessionId: string): PerformanceMetric[] {
    return this.getAllMetrics().filter(metric => metric.sessionId === sessionId);
  }

  /**
   * Get recent metrics (last N entries)
   */
  getRecentMetrics(count: number = 50): PerformanceMetric[] {
    const allMetrics = this.getAllMetrics();
    return allMetrics
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, count);
  }

  /**
   * Get metrics within time range
   */
  getMetricsInRange(startTime: number, endTime: number): PerformanceMetric[] {
    return this.getAllMetrics().filter(
      metric => metric.timestamp >= startTime && metric.timestamp <= endTime
    );
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    totalMetrics: number;
    sessionCount: number;
    metricsByType: Record<string, number>;
    avgFps: number;
    sustainedLowFpsEvents: number;
    recoveryEvents: number;
    componentsEnabled: Record<string, number>;
    oldestMetric: number | null;
    newestMetric: number | null;
  } {
    const metrics = this.getAllMetrics();
    
    if (metrics.length === 0) {
      return {
        totalMetrics: 0,
        sessionCount: 0,
        metricsByType: {},
        avgFps: 0,
        sustainedLowFpsEvents: 0,
        recoveryEvents: 0,
        componentsEnabled: {},
        oldestMetric: null,
        newestMetric: null,
      };
    }

    // Count by type
    const metricsByType: Record<string, number> = {};
    metrics.forEach(metric => {
      metricsByType[metric.type] = (metricsByType[metric.type] || 0) + 1;
    });

    // Calculate FPS average
    const fpsMetrics = this.getMetricsByType<FpsMetric>('fps');
    const avgFps = fpsMetrics.length > 0 
      ? fpsMetrics.reduce((sum, m) => sum + m.data.currentFps, 0) / fpsMetrics.length 
      : 0;

    // Count events
    const eventMetrics = this.getMetricsByType<EventMetric>('event');
    const sustainedLowFpsEvents = eventMetrics.filter(m => m.data.eventType === 'degradation').length;
    const recoveryEvents = eventMetrics.filter(m => m.data.eventType === 'recovery').length;

    // Count component enablements
    const componentMetrics = this.getMetricsByType<ComponentMetric>('component');
    const componentsEnabled: Record<string, number> = {};
    componentMetrics.forEach(metric => {
      if (metric.data.shouldRender) {
        componentsEnabled[metric.data.componentType] = 
          (componentsEnabled[metric.data.componentType] || 0) + 1;
      }
    });

    // Get unique sessions
    const sessions = new Set(metrics.map(m => m.sessionId));

    // Get time range
    const timestamps = metrics.map(m => m.timestamp);
    
    return {
      totalMetrics: metrics.length,
      sessionCount: sessions.size,
      metricsByType,
      avgFps: Math.round(avgFps * 100) / 100,
      sustainedLowFpsEvents,
      recoveryEvents,
      componentsEnabled,
      oldestMetric: Math.min(...timestamps),
      newestMetric: Math.max(...timestamps),
    };
  }

  /**
   * Clear all stored metrics
   */
  clear(): void {
    if (!isStorageEnabled()) return;

    try {
      localStorage.removeItem(this.storageKey);
      localStorage.removeItem(this.indexKey);
      console.log('[PerformanceMetricsStorage] All metrics cleared');
    } catch (error) {
      console.warn('[PerformanceMetricsStorage] Failed to clear metrics:', error);
    }
  }

  /**
   * Export metrics as JSON
   */
  exportMetrics(): string {
    return JSON.stringify(this.getAllMetrics(), null, 2);
  }

  /**
   * Import metrics from JSON
   */
  importMetrics(jsonData: string): void {
    if (!isStorageEnabled()) return;

    try {
      const importedMetrics = JSON.parse(jsonData) as PerformanceMetric[];
      if (!Array.isArray(importedMetrics)) {
        throw new Error('Invalid metrics format');
      }

      const existingMetrics = this.getAllMetrics();
      const allMetrics = [...existingMetrics, ...importedMetrics];
      const cleanedMetrics = this.cleanupMetrics(allMetrics);
      
      this.storeMetrics(cleanedMetrics);
      console.log(`[PerformanceMetricsStorage] Imported ${importedMetrics.length} metrics`);
    } catch (error) {
      console.error('[PerformanceMetricsStorage] Failed to import metrics:', error);
    }
  }

  /**
   * Private: Store metrics to localStorage
   */
  private storeMetrics(metrics: PerformanceMetric[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(metrics));
    } catch (error) {
      // Handle quota exceeded error
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('[PerformanceMetricsStorage] Storage quota exceeded, removing old metrics');
        const reducedMetrics = metrics.slice(-Math.floor(this.config.maxEntries / 2));
        localStorage.setItem(this.storageKey, JSON.stringify(reducedMetrics));
      } else {
        throw error;
      }
    }
  }

  /**
   * Private: Clean up old metrics
   */
  private cleanupMetrics(metrics: PerformanceMetric[]): PerformanceMetric[] {
    const now = Date.now();
    
    // Remove expired metrics
    let cleaned = metrics.filter(metric => 
      (now - metric.timestamp) < this.config.maxAge
    );
    
    // Limit total number of metrics
    if (cleaned.length > this.config.maxEntries) {
      cleaned = cleaned
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, this.config.maxEntries);
    }
    
    return cleaned;
  }

  /**
   * Private: Update search index
   */
  private updateIndex(metric: PerformanceMetric): void {
    try {
      const existingIndex = JSON.parse(localStorage.getItem(this.indexKey) || '{}');
      
      // Update type index
      if (!existingIndex.byType) existingIndex.byType = {};
      if (!existingIndex.byType[metric.type]) existingIndex.byType[metric.type] = [];
      existingIndex.byType[metric.type].push(metric.id);
      
      // Update session index
      if (!existingIndex.bySession) existingIndex.bySession = {};
      if (!existingIndex.bySession[metric.sessionId]) existingIndex.bySession[metric.sessionId] = [];
      existingIndex.bySession[metric.sessionId].push(metric.id);
      
      localStorage.setItem(this.indexKey, JSON.stringify(existingIndex));
    } catch (error) {
      // Index is optional, don't fail on errors
      console.warn('[PerformanceMetricsStorage] Failed to update index:', error);
    }
  }
}

// Global instance
export const performanceMetricsStorage = new PerformanceMetricsStorage();

/**
 * Hook for automatic performance metrics storage
 */
export function usePerformanceMetricsStorage(enabled: boolean = true) {
  const storage = performanceMetricsStorage;

  // Helper functions for common metric types
  const logFpsMetric = (data: FpsMetric['data']) => {
    if (enabled) storage.storeFpsMetric(data);
  };

  const logCapabilityMetric = (data: CapabilityMetric['data']) => {
    if (enabled) storage.storeCapabilityMetric(data);
  };

  const logThresholdMetric = (data: ThresholdMetric['data']) => {
    if (enabled) storage.storeThresholdMetric(data);
  };

  const logComponentMetric = (data: ComponentMetric['data']) => {
    if (enabled) storage.storeComponentMetric(data);
  };

  const logEventMetric = (data: EventMetric['data']) => {
    if (enabled) storage.storeEventMetric(data);
  };

  return {
    storage,
    logFpsMetric,
    logCapabilityMetric,
    logThresholdMetric,
    logComponentMetric,
    logEventMetric,
    isEnabled: enabled && isStorageEnabled(),
  };
}

/**
 * Development utilities
 */
export const developmentUtils = {
  /**
   * Log current performance summary to console
   */
  logSummary(): void {
    if (!isStorageEnabled()) {
      console.log('[Performance Storage] Not available (production mode or no localStorage)');
      return;
    }

    const summary = performanceMetricsStorage.getPerformanceSummary();
    console.group('[Performance Metrics Summary]');
    console.log('Total Metrics:', summary.totalMetrics);
    console.log('Sessions:', summary.sessionCount);
    console.log('Metrics by Type:', summary.metricsByType);
    console.log('Average FPS:', summary.avgFps);
    console.log('Low FPS Events:', summary.sustainedLowFpsEvents);
    console.log('Recovery Events:', summary.recoveryEvents);
    console.log('Components Enabled:', summary.componentsEnabled);
    console.log('Time Range:', {
      oldest: summary.oldestMetric ? new Date(summary.oldestMetric) : null,
      newest: summary.newestMetric ? new Date(summary.newestMetric) : null,
    });
    console.groupEnd();
  },

  /**
   * Generate performance report
   */
  generateReport(): string {
    const summary = performanceMetricsStorage.getPerformanceSummary();
    const recentMetrics = performanceMetricsStorage.getRecentMetrics(20);
    
    return `
Performance Metrics Report
Generated: ${new Date().toISOString()}

Summary:
- Total Metrics: ${summary.totalMetrics}
- Sessions: ${summary.sessionCount}
- Average FPS: ${summary.avgFps}
- Low FPS Events: ${summary.sustainedLowFpsEvents}
- Recovery Events: ${summary.recoveryEvents}

Recent Activity:
${recentMetrics.map(metric => 
  `- ${new Date(metric.timestamp).toLocaleTimeString()}: ${metric.type} (${metric.data?.componentType || 'general'})`
).join('\n')}

Component Usage:
${Object.entries(summary.componentsEnabled).map(([component, count]) => 
  `- ${component}: ${count} times`
).join('\n')}
    `.trim();
  },
};

export default performanceMetricsStorage;