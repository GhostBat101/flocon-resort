/**
 * ChairliftLine: Environmental ski-lift pylons and overhead cable line spanning the mountain slope.
 * Communicates with: SceneContainer.jsx and Mountain.jsx.
 */

'use client';

import React, { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { getAssetUrl } from '@/utils/assets';

const CABLE_COLOR = '#1A202C';
const PYLON_MODEL_PATH = getAssetUrl('/assets/models/chairlift_pylon.glb');

const PYLON_POSITIONS = [
  [8, 22, -8],
  [-10, 14, 6],
  [12, 6, -6],
];

function PylonModel() {
  const { scene } = useGLTF(PYLON_MODEL_PATH);
  const cloned = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={cloned} scale={[0.85, 0.85, 0.85]} />;
}

export default function ChairliftLine() {
  return (
    <group>
      {PYLON_POSITIONS.map((pos, idx) => (
        <group key={idx} position={pos}>
          <PylonModel />
        </group>
      ))}

      <mesh position={[9, 14, -1]}>
        <cylinderGeometry args={[0.03, 0.03, 26, 4]} />
        <meshBasicMaterial color={CABLE_COLOR} />
      </mesh>
    </group>
  );
}
