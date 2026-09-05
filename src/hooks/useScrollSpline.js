/**
 * useScrollSpline: Translates scroll progress into 3D Catmull-Rom ski piste coordinates grounded to alpine terrain.
 * Communicates with: SplineCameraController.jsx, SceneContainer.jsx, and terrain.js.
 */

'use client';

import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { getAlpineElevation } from '@/utils/terrain';

const PISTE_WAYPOINTS = [
  [0, -160],
  [24, -100],
  [14, -60],
  [-26, -10],
  [-16, 25],
  [20, 65],
  [12, 85],
  [0, 110],
  [0, 122.5],
];

export function useScrollSpline(triggerRef) {
  const uRef = useRef(0.0);
  const velocityRef = useRef(0.0);
  const lastURef = useRef(0.0);
  const lastTimeRef = useRef(Date.now());

  const curve = useMemo(() => {
    const points = PISTE_WAYPOINTS.map(([x, z]) => {
      const y = getAlpineElevation(x, z) + 0.35;
      return new THREE.Vector3(x, y, z);
    });

    const spline = new THREE.CatmullRomCurve3(points);
    spline.curveType = 'centripetal';
    spline.arcLengthDivisions = 400;
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
          scrub: 0.8,
        },
        onUpdate: () => {
          const now = Date.now();
          const dt = Math.max(0.001, (now - lastTimeRef.current) / 1000);
          const deltaU = Math.abs(proxy.u - lastURef.current);
          velocityRef.current = deltaU / dt;
          lastURef.current = proxy.u;
          lastTimeRef.current = now;
          uRef.current = proxy.u;
        },
      });
    }, triggerRef);

    return () => ctx.revert();
  }, [triggerRef]);

  const getVelocity = () => {
    const isStationary = Date.now() - lastTimeRef.current > 70;
    return isStationary ? 0 : velocityRef.current;
  };

  const getTrackMetrics = (progressValue = uRef.current) => {
    const clampedU = Math.max(0, Math.min(0.999, progressValue));
    const position = curve.getPointAt(clampedU);
    const tangent = curve.getTangentAt(clampedU).normalize();

    return {
      u: clampedU,
      position,
      tangent,
      velocity: getVelocity(),
    };
  };

  return {
    curve,
    uRef,
    velocityRef,
    getVelocity,
    getTrackMetrics,
    getSnowballMetrics: getTrackMetrics,
  };
}
