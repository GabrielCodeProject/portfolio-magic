'use client';

import React, { Component, ReactNode } from 'react';

import { errorLogger } from '@/utils/errorLogger';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
  severity?: 'low' | 'medium' | 'high' | 'critical';
}

interface State {
  hasError: boolean;
  error?: Error;
  errorId?: string;
}

class ThreeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    const { componentName = 'Unknown3DComponent', severity = 'high' } = this.props;
    
    // Enhanced client-side error logging with better component identification
    try {
      errorLogger.logReactError(error, errorInfo, componentName, severity);
      
      // Store error ID for potential debugging
      this.setState({ 
        errorId: `${componentName}_${Date.now()}` 
      });

      // Additional context logging for 3D-specific issues
      const is3DError = this.detect3DSpecificError(error);
      if (is3DError) {
        console.group(`🎮 3D Component Error: ${componentName}`);
        console.error('Error Details:', error);
        console.error('Component Stack:', errorInfo.componentStack);
        console.error('Possible causes:', this.suggest3DErrorCauses(error));
        console.groupEnd();
      }

    } catch (loggingError) {
      // Fallback logging if our enhanced logger fails
      console.error('Enhanced error logging failed, falling back to basic logging:', loggingError);
      console.error(`ThreeErrorBoundary caught error in ${componentName}:`, error, errorInfo);
    }
  }

  private detect3DSpecificError(error: Error): boolean {
    const errorMessage = error.message.toLowerCase();
    const stack = error.stack?.toLowerCase() || '';
    
    const threejsKeywords = [
      'webgl', 'three', 'shader', 'buffer', 'geometry', 'material',
      'texture', 'canvas', 'context', 'renderer', 'scene', 'camera'
    ];
    
    return threejsKeywords.some(keyword => 
      errorMessage.includes(keyword) || stack.includes(keyword)
    );
  }

  private suggest3DErrorCauses(error: Error): string[] {
    const suggestions: string[] = [];
    const errorMessage = error.message.toLowerCase();
    
    if (errorMessage.includes('webgl')) {
      suggestions.push('WebGL not supported or context lost');
      suggestions.push('GPU drivers may need updating');
    }
    
    if (errorMessage.includes('shader')) {
      suggestions.push('Shader compilation failed');
      suggestions.push('Graphics card may not support required features');
    }
    
    if (errorMessage.includes('buffer') || errorMessage.includes('memory')) {
      suggestions.push('Insufficient GPU memory');
      suggestions.push('Too many 3D objects loaded simultaneously');
    }
    
    if (errorMessage.includes('texture')) {
      suggestions.push('Texture loading failed');
      suggestions.push('Image format not supported');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('Generic 3D rendering error');
      suggestions.push('Check browser console for more details');
    }
    
    return suggestions;
  }

  render() {
    if (this.state.hasError) {
      // Return null for Canvas contexts to avoid R3F namespace errors
      // HTML elements cannot be rendered inside React Three Fiber Canvas
      return this.props.fallback || null;
    }

    return this.props.children;
  }
}

export default ThreeErrorBoundary;