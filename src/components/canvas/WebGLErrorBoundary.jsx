/**
 * WebGLErrorBoundary: Resilient React error boundary intercepting WebGL failures in privacy browsers.
 * Communicates with: DesktopShowcase.jsx, LegacyFallback.jsx, and SceneContainer.jsx.
 */

'use client';

import React, { Component } from 'react';
import LegacyFallback from '@/components/tiers/LegacyFallback';

export default class WebGLErrorBoundary extends Component {
  state = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (typeof window !== 'undefined' && window.console) {
      console.warn('Flocon Resort: WebGL context creation failed. Safely transitioning to Legacy Tier.', error);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <LegacyFallback />;
    }
    return this.props.children;
  }
}
