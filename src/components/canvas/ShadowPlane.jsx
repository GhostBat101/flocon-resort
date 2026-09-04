/**
 * ShadowPlane: Dynamic circular contact shadow sliding beneath the snowball mesh.
 * Communicates with: SceneContainer.jsx and Snowball.jsx.
 */

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SHADOW_COLOR = '#2D4A43';

export default function ShadowPlane({ progress = 0, getMetrics }) {
  const meshRef = useRef();

  useFrame(() => {
    if (!meshRef.current || !getMetrics) return;

    const metrics = getMetrics(progress);
    meshRef.current.position.set(metrics.position.x, metrics.position.y - 0.8 * metrics.scale, metrics.position.z);
    meshRef.current.scale.set(metrics.scale * 1.2, metrics.scale * 1.2, 1);
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.9, 16]} />
      <meshBasicMaterial
        color={SHADOW_COLOR}
        transparent
        opacity={0.28}
        depthWrite={false}
      />
    </mesh>
  );
}
