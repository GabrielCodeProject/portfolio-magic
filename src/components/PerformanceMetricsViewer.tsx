'use client';

import React, { useEffect, useState } from 'react';
import { 
  performanceMetricsStorage, 
  developmentUtils,
  type PerformanceMetric,
  type FpsMetric,
  type EventMetric
} from '@/utils/performanceMetricsStorage';

/**
 * Development component for viewing stored performance metrics
 * Only shows in development mode
 */
export function PerformanceMetricsViewer({ 
  position = 'bottom-right',
  minimized = true 
}: {
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  minimized?: boolean;
}) {
  const [isVisible, setIsVisible] = useState(!minimized);
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [summary, setSummary] = useState<ReturnType<typeof performanceMetricsStorage.getPerformanceSummary>>();
  const [selectedTab, setSelectedTab] = useState<'summary' | 'fps' | 'events' | 'raw'>('summary');
  const [isClient, setIsClient] = useState(false);

  // Only render in development mode and client-side
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Refresh data periodically
  useEffect(() => {
    if (!isClient || process.env.NODE_ENV !== 'development') return;

    const refreshData = () => {
      setMetrics(performanceMetricsStorage.getRecentMetrics(100));
      setSummary(performanceMetricsStorage.getPerformanceSummary());
    };

    refreshData();
    const interval = setInterval(refreshData, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [isClient]);

  // Don't render on server or in production
  if (!isClient || process.env.NODE_ENV !== 'development') {
    return null;
  }

  const positionClasses = {
    'top-left': 'top-4 left-4',
    'top-right': 'top-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'bottom-right': 'bottom-4 right-4',
  };

  // Minimized view
  if (!isVisible) {
    return (
      <div className={`fixed ${positionClasses[position]} z-50`}>
        <button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-xs font-mono shadow-lg"
        >
          📊 Metrics ({summary?.totalMetrics || 0})
        </button>
      </div>
    );
  }

  // Full view
  return (
    <div className={`fixed ${positionClasses[position]} z-50 bg-black/95 text-white rounded-lg shadow-2xl max-w-md w-96`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-700">
        <h3 className="font-bold text-sm">Performance Metrics</h3>
        <div className="flex gap-2">
          <button
            onClick={() => {
              developmentUtils.logSummary();
              console.log('📊 Full metrics report:\n' + developmentUtils.generateReport());
            }}
            className="text-xs bg-green-600 hover:bg-green-700 px-2 py-1 rounded"
            title="Log to console"
          >
            📋
          </button>
          <button
            onClick={() => performanceMetricsStorage.clear()}
            className="text-xs bg-red-600 hover:bg-red-700 px-2 py-1 rounded"
            title="Clear all metrics"
          >
            🗑️
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="text-xs bg-gray-600 hover:bg-gray-700 px-2 py-1 rounded"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex border-b border-gray-700">
        {(['summary', 'fps', 'events', 'raw'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-3 py-2 text-xs font-mono capitalize ${
              selectedTab === tab 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-3 max-h-96 overflow-y-auto text-xs font-mono">
        {selectedTab === 'summary' && (
          <SummaryTab summary={summary} />
        )}
        
        {selectedTab === 'fps' && (
          <FpsTab metrics={metrics.filter(m => m.type === 'fps') as FpsMetric[]} />
        )}
        
        {selectedTab === 'events' && (
          <EventsTab metrics={metrics.filter(m => m.type === 'event') as EventMetric[]} />
        )}
        
        {selectedTab === 'raw' && (
          <RawTab metrics={metrics.slice(0, 20)} />
        )}
      </div>
    </div>
  );
}

// Summary tab component
function SummaryTab({ summary }: { summary?: ReturnType<typeof performanceMetricsStorage.getPerformanceSummary> }) {
  if (!summary) return <div>Loading...</div>;

  return (
    <div className="space-y-3">
      <div>
        <div className="text-yellow-400 font-semibold">Overview</div>
        <div>Total Metrics: {summary.totalMetrics}</div>
        <div>Sessions: {summary.sessionCount}</div>
        <div>Average FPS: {summary.avgFps}</div>
      </div>

      <div>
        <div className="text-blue-400 font-semibold">Events</div>
        <div className="text-red-400">Low FPS: {summary.sustainedLowFpsEvents}</div>
        <div className="text-green-400">Recovery: {summary.recoveryEvents}</div>
      </div>

      <div>
        <div className="text-purple-400 font-semibold">Components</div>
        {Object.entries(summary.componentsEnabled).map(([component, count]) => (
          <div key={component}>
            {component}: {count}x
          </div>
        ))}
      </div>

      <div>
        <div className="text-gray-400 font-semibold">Types</div>
        {Object.entries(summary.metricsByType).map(([type, count]) => (
          <div key={type}>
            {type}: {count}
          </div>
        ))}
      </div>

      {summary.oldestMetric && (
        <div className="text-xs text-gray-500">
          Range: {new Date(summary.oldestMetric).toLocaleTimeString()} - 
          {new Date(summary.newestMetric!).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

// FPS tab component  
function FpsTab({ metrics }: { metrics: FpsMetric[] }) {
  const recentFps = metrics.slice(0, 10);

  return (
    <div className="space-y-2">
      <div className="text-yellow-400 font-semibold">Recent FPS Metrics</div>
      {recentFps.map((metric, index) => (
        <div key={metric.id} className="border-b border-gray-700 pb-2">
          <div className="flex justify-between">
            <span className="text-blue-400">{metric.data.componentType}</span>
            <span className="text-xs text-gray-400">
              {new Date(metric.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Current: {metric.data.currentFps.toFixed(1)} FPS</span>
            <span>Avg: {metric.data.averageFps.toFixed(1)} FPS</span>
          </div>
          <div className="flex justify-between">
            <span>Threshold: {metric.data.threshold}</span>
            <span className={metric.data.isLowFps ? 'text-red-400' : 'text-green-400'}>
              {metric.data.isLowFps ? 'LOW' : 'OK'}
            </span>
          </div>
          <div>Level: {metric.data.performanceLevel}</div>
        </div>
      ))}
      {recentFps.length === 0 && (
        <div className="text-gray-500">No FPS metrics recorded yet</div>
      )}
    </div>
  );
}

// Events tab component
function EventsTab({ metrics }: { metrics: EventMetric[] }) {
  const recentEvents = metrics.slice(0, 15);

  return (
    <div className="space-y-2">
      <div className="text-yellow-400 font-semibold">Recent Events</div>
      {recentEvents.map((metric) => (
        <div key={metric.id} className="border-b border-gray-700 pb-2">
          <div className="flex justify-between">
            <span className={
              metric.data.eventType === 'degradation' ? 'text-red-400' :
              metric.data.eventType === 'recovery' ? 'text-green-400' :
              metric.data.eventType === 'error' ? 'text-red-500' :
              'text-blue-400'
            }>
              {metric.data.eventType.toUpperCase()}
            </span>
            <span className="text-xs text-gray-400">
              {new Date(metric.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div>Component: {metric.data.componentType}</div>
          <div>Severity: {metric.data.severity}</div>
          {metric.data.details.averageFps && (
            <div>FPS: {metric.data.details.averageFps.toFixed(1)}</div>
          )}
          {metric.data.details.duration && (
            <div>Duration: {metric.data.details.duration}ms</div>
          )}
        </div>
      ))}
      {recentEvents.length === 0 && (
        <div className="text-gray-500">No events recorded yet</div>
      )}
    </div>
  );
}

// Raw data tab component
function RawTab({ metrics }: { metrics: PerformanceMetric[] }) {
  return (
    <div className="space-y-2">
      <div className="text-yellow-400 font-semibold">Raw Metrics (Latest 20)</div>
      {metrics.map((metric) => (
        <div key={metric.id} className="border-b border-gray-700 pb-2">
          <div className="flex justify-between">
            <span className="text-blue-400">{metric.type}</span>
            <span className="text-xs text-gray-400">
              {new Date(metric.timestamp).toLocaleTimeString()}
            </span>
          </div>
          <div className="text-xs text-gray-300 max-w-full break-words">
            {JSON.stringify(metric.data, null, 2).slice(0, 200)}
            {JSON.stringify(metric.data).length > 200 && '...'}
          </div>
        </div>
      ))}
      {metrics.length === 0 && (
        <div className="text-gray-500">No metrics recorded yet</div>
      )}
    </div>
  );
}

export default PerformanceMetricsViewer;