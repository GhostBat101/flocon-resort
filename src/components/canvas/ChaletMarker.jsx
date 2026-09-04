/**
 * ChaletMarker: 3D interactive cabin model anchored with a stone foundation plinth and glowing pulse ring.
 * Communicates with: SceneContainer.jsx, ContentModal.jsx, cabins.js, and terrain.js.
 */

'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { getAssetUrl } from '@/utils/assets';
import { getAlpineElevation } from '@/utils/terrain';

const GLOW_COLOR = '#FFB040';
const STONE_COLOR = '#475569';
const SNOW_BASE_COLOR = '#EBF3F7';
const CABIN_MODEL_PATH = getAssetUrl('/assets/models/cozy_cabin.glb');

function CabinModel() {
  const { scene } = useGLTF(CABIN_MODEL_PATH);
  const clonedScene = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={clonedScene} scale={[1.25, 1.25, 1.25]} position={[0, 0, 0]} />;
}

export default function ChaletMarker({ cabin, onSelect }) {
  const groupRef = useRef();
  const ringRef = useRef();
  const [hovered, setHovered] = useState(false);

  const groundY = getAlpineElevation(cabin.coordinates[0], cabin.coordinates[2]);
  const facingAngle = cabin.coordinates[0] > 0 ? -0.45 : 0.45;

  useFrame((state) => {
    if (ringRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.12;
      ringRef.current.scale.set(scale, scale, 1);
    }
  });

  return (
    <group
      ref={groupRef}
      position={[cabin.coordinates[0], groundY, cabin.coordinates[2]]}
      rotation={[0, facingAngle, 0]}
      onClick={() => onSelect && onSelect(cabin.id)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      className="cursor-pointer"
    >
      <CabinModel />

      <mesh position={[0, -0.42, 0]} receiveShadow>
        <boxGeometry args={[4.4, 0.95, 4.4]} />
        <meshStandardMaterial color={STONE_COLOR} roughness={0.92} flatShading />
      </mesh>

      <mesh position={[0, -0.75, 0]} receiveShadow>
        <cylinderGeometry args={[2.9, 3.7, 0.8, 14]} />
        <meshStandardMaterial color={SNOW_BASE_COLOR} roughness={0.96} flatShading />
      </mesh>

      <pointLight
        position={[0, 2.2, 0]}
        color={GLOW_COLOR}
        intensity={hovered ? 3.5 : 1.6}
        distance={8}
      />

      <mesh
        ref={ringRef}
        position={[0, 0.06, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <ringGeometry args={[2.5, 2.9, 24]} />
        <meshBasicMaterial
          color={GLOW_COLOR}
          transparent
          opacity={hovered ? 0.95 : 0.55}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
