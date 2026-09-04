/**
 * useScrollSpline: Translates scroll progress into 3D Catmull-Rom ski piste coordinates and metrics.
 * Communicates with: SplineCameraController.jsx, SceneContainer.jsx, and useAudioSystem.js.
 */

'use client';

import { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export function useScrollSpline(triggerRef) {
  const uRef = useRef(0.0);
  const velocityRef = useRef(0.0);

  const curve = useMemo(() => {
    const spline = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 52, -160),
      new THREE.Vector3(24, 40, -100),
      new THREE.Vector3(14, 34, -60),
      new THREE.Vector3(-26, 26, -10),
      new THREE.Vector3(-16, 20, 25),
      new THREE.Vector3(20, 12, 65),
      new THREE.Vector3(12, 8, 85),
      new THREE.Vector3(0, 2.5, 110),
      new THREE.Vector3(0, 1.2, 125),
    ]);
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

  const getTrackMetrics = (progressValue = uRef.current) => {
    const clampedU = Math.max(0, Math.min(0.999, progressValue));
    const position = curve.getPointAt(clampedU);
    const tangent = curve.getTangentAt(clampedU).normalize();

    return {
      u: clampedU,
      position,
      tangent,
      velocity: velocityRef.current,
    };
  };

  return {
    curve,
    uRef,
    velocityRef,
    getTrackMetrics,
    getSnowballMetrics: getTrackMetrics,
  };
}
