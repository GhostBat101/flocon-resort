/**
 * ChaletMarker: 3D interactive cabin model positioned along the spline with glowing pulse ring.
 * Communicates with: SceneContainer.jsx, ContentModal.jsx, and cabins.js.
 */

'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

const WALL_COLOR = '#5C4033';
const ROOF_SNOW_COLOR = '#F3F7F9';
const CHIMNEY_COLOR = '#9EBBC9';
const GLOW_COLOR = '#FFB040';

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
      <mesh position={[0, 0.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 1.8, 2.8]} />
        <meshStandardMaterial color={WALL_COLOR} roughness={0.85} flatShading />
      </mesh>

      <mesh position={[0, 2.3, 0]} rotation={[0, 0, 0]} castShadow receiveShadow>
        <coneGeometry args={[2.6, 1.4, 4]} />
        <meshStandardMaterial color={ROOF_SNOW_COLOR} roughness={0.6} flatShading />
      </mesh>

      <mesh position={[0.7, 2.2, 0.6]} castShadow>
        <boxGeometry args={[0.5, 1.2, 0.5]} />
        <meshStandardMaterial color={CHIMNEY_COLOR} roughness={0.9} flatShading />
      </mesh>

      <mesh position={[0, 0.8, -1.42]}>
        <boxGeometry args={[0.7, 1.2, 0.05]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} flatShading />
      </mesh>

      <mesh position={[-1.22, 0.9, 0]} rotation={[0, Math.PI / 2, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.05]} />
        <meshStandardMaterial
          color={GLOW_COLOR}
          emissive={GLOW_COLOR}
          emissiveIntensity={hovered ? 2.5 : 1.2}
          roughness={0.2}
          flatShading
        />
      </mesh>

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
