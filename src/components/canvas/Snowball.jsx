/**
 * Snowball: Dynamic faceted snowball mesh executing spline trajectory and logarithmic mass scaling.
 * Communicates with: SceneContainer.jsx and useScrollSpline.js.
 */

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SCRATCH_ROT_AXIS = new THREE.Vector3(1, 0, 0);
const WORLD_UP = new THREE.Vector3(0, 1, 0);
const TANGENT_AXIS = new THREE.Vector3();

export default function Snowball({ progress = 0, getMetrics }) {
  const meshRef = useRef();
  const rotationAngleRef = useRef(0);

  useFrame((state, delta) => {
    if (!meshRef.current || !getMetrics) return;

    const metrics = getMetrics(progress);
    meshRef.current.position.copy(metrics.position);
    meshRef.current.scale.set(metrics.scale, metrics.scale, metrics.scale);

    rotationAngleRef.current += metrics.deltaTheta + delta * 0.4;
    TANGENT_AXIS.crossVectors(metrics.tangent, WORLD_UP).normalize();
    meshRef.current.rotateOnWorldAxis(TANGENT_AXIS, metrics.deltaTheta);
  });

  return (
    <mesh ref={meshRef} castShadow>
      <icosahedronGeometry args={[0.9, 2]} />
      <meshStandardMaterial
        color="#FFFFFF"
        roughness={0.4}
        metalness={0.05}
        flatShading
      />
    </mesh>
  );
}
