/**
 * ChairliftLine: Environmental ski-lift pylons and overhead cable line spanning the mountain slope.
 * Communicates with: SceneContainer.jsx and Mountain.jsx.
 */

'use client';

import React from 'react';

const STEEL_COLOR = '#626568';
const AMBER_COLOR = '#FFB040';
const CABLE_COLOR = '#1A202C';

const PYLON_POSITIONS = [
  [8, 22, -8],
  [-10, 14, 6],
  [12, 6, -6],
];

export default function ChairliftLine() {
  return (
    <group>
      {PYLON_POSITIONS.map((pos, idx) => (
        <group key={idx} position={pos}>
          <mesh position={[0, 3, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.35, 6, 6]} />
            <meshStandardMaterial color={STEEL_COLOR} roughness={0.5} metalness={0.7} flatShading />
          </mesh>
          <mesh position={[0, 6, 0]} castShadow>
            <boxGeometry args={[3.2, 0.3, 0.3]} />
            <meshStandardMaterial color={STEEL_COLOR} roughness={0.5} metalness={0.7} flatShading />
          </mesh>
          <mesh position={[-1.5, 6, 0]}>
            <boxGeometry args={[0.2, 0.6, 0.3]} />
            <meshStandardMaterial color={AMBER_COLOR} roughness={0.3} flatShading />
          </mesh>
          <mesh position={[1.5, 6, 0]}>
            <boxGeometry args={[0.2, 0.6, 0.3]} />
            <meshStandardMaterial color={AMBER_COLOR} roughness={0.3} flatShading />
          </mesh>
        </group>
      ))}

      <mesh position={[9, 14, -1]}>
        <cylinderGeometry args={[0.03, 0.03, 26, 4]} />
        <meshBasicMaterial color={CABLE_COLOR} />
      </mesh>
    </group>
  );
}
