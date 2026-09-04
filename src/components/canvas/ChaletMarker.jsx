/**
 * ChaletMarker: 3D interactive cabin model positioned along the spline with glowing pulse ring.
 * Communicates with: SceneContainer.jsx, ContentModal.jsx, and cabins.js.
 */

'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { getAssetUrl } from '@/utils/assets';

const GLOW_COLOR = '#FFB040';
const CABIN_MODEL_PATH = getAssetUrl('/assets/models/cozy_cabin.glb');

function CabinModel() {
  const { scene } = useGLTF(CABIN_MODEL_PATH);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={clonedScene} scale={[1.1, 1.1, 1.1]} />;
}

export default function ChaletMarker({ cabin, onSelect }) {
  const groupRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.12;
      ringRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group
      ref={groupRef}
      position={cabin.coordinates}
      onClick={() => onSelect && onSelect(cabin.id)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      className="cursor-pointer"
    >
      <CabinModel />

      <pointLight
        position={[0, 1.8, 0]}
        color={GLOW_COLOR}
        intensity={hovered ? 3.0 : 1.2}
        distance={6}
      />

      <mesh
        ref={ringRef}
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[2.0, 2.35, 16]} />
        <meshBasicMaterial
          color={GLOW_COLOR}
          transparent
          opacity={hovered ? 0.9 : 0.45}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
