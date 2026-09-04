/**
 * Snowfall: Dynamic 3D snowfall particle system with wind drift and altitude fade.
 * Communicates with: SceneContainer.jsx.
 */

'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';

export default function Snowfall({ count = 420 }) {
  const pointsRef = useRef();

  const [positions, speeds, drifts] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const drf = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 44;
      pos[i * 3 + 1] = Math.random() * 40;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 44;
      spd[i] = 0.04 + Math.random() * 0.05;
      drf[i] = (Math.random() - 0.5) * 0.02;
    }
    return [pos, spd, drf];
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current) return;
    const array = pointsRef.current.geometry.attributes.position.array;

    for (let i = 0; i < count; i++) {
      array[i * 3 + 1] -= speeds[i];
      array[i * 3] += drifts[i];

      if (array[i * 3 + 1] < -2) {
        array[i * 3 + 1] = 38;
        array[i * 3] = (Math.random() - 0.5) * 44;
        array[i * 3 + 2] = (Math.random() - 0.5) * 44;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.14}
        color="#FFFFFF"
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}
