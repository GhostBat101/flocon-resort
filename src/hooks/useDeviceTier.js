/**
 * useDeviceTier: Evaluates device capability, WebGL support, and reduced motion for adaptive tier routing.
 * Communicates with: page.jsx and useGlobalStore.jsx.
 */

'use client';

import { useState, useEffect } from 'react';

export function useDeviceTier() {
  const [tier, setTier] = useState('loading');

  useEffect(() => {
    const checkTier = () => {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReducedMotion) {
        setTier('mobile');
        return;
      }

      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        setTier('legacy');
        return;
      }

      const width = window.innerWidth;
      const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

      if (width < 768) {
        setTier('mobile');
      } else if (width >= 768 && width <= 1024 && isTouch) {
        setTier('tablet');
      } else {
        setTier('desktop');
      }
    };

    checkTier();
    window.addEventListener('resize', checkTier);
    return () => window.removeEventListener('resize', checkTier);
  }, []);

  return tier;
}
