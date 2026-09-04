/**
 * useScrollSpline: Translates scroll progress into 3D Catmull-Rom spline coordinates and metrics.
 * Communicates with: Snowball.jsx, SceneContainer.jsx, and useAudioSystem.js.
 */

'use client';

import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function useScrollSpline(triggerRef) {
  const uRef = useRef(0.0);
  const velocityRef = useRef(0.0);
  const previousPosition = useRef(new THREE.Vector3(0, 50, 0));

  const curve = useMemo(() => {
    const spline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 50, 0),
      new THREE.Vector3(12, 40, -10),
      new THREE.Vector3(-14, 30, 8),
      new THREE.Vector3(16, 20, -12),
      new THREE.Vector3(-8, 10, 14),
      new THREE.Vector3(0, 0, 0),
    ]);
    spline.curveType = 'centripetal';
    spline.arcLengthDivisions = 300;
    return spline;
  }, []);

  useEffect(() => {
    if (!triggerRef?.current || typeof window === 'undefined') return;

    const proxy = { u: 0.0 };

    const ctx = gsap.context(() => {
      gsap.to(proxy, {
        u: 1.0,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5,
          onUpdate: (self) => {
            velocityRef.current = self.getVelocity();
          },
        },
        onUpdate: () => {
          uRef.current = proxy.u;
        },
      });
    }, triggerRef);

    return () => ctx.revert();
  }, [triggerRef]);

  const getSnowballMetrics = (progressValue = uRef.current) => {
    const clampedU = Math.max(0, Math.min(0.999, progressValue));
    const position = curve.getPointAt(clampedU);
    const tangent = curve.getTangentAt(clampedU).normalize();
    const scale = 1.0 + Math.log1p(clampedU * 1.5) * 1.15;
    const dist = position.distanceTo(previousPosition.current);
    previousPosition.current.copy(position);
    const deltaTheta = dist / (0.5 * scale);

    return {
      u: clampedU,
      position,
      tangent,
      scale,
      deltaTheta,
      velocity: velocityRef.current,
    };
  };

  return { curve, uRef, velocityRef, getSnowballMetrics };
}
