/**
 * Mountain: Static low-poly faceted mountain terrain mesh for the 3D alpine landscape.
 * Communicates with: SceneContainer.jsx and globals.css.
 */

'use client';

import React from 'react';

const SUMMIT_COLOR = '#F3F7F9';
const MID_SLOPE_COLOR = '#D6E4EB';
const BASE_ROCK_COLOR = '#9EBBC9';
const VALLEY_TERRAIN_COLOR = '#385950';

export default function Mountain() {
  return (
    <group position={[0, -2, 0]}>
      <mesh position={[0, 24, 0]} castShadow receiveShadow>
        <coneGeometry args={[14, 28, 7]} />
        <meshStandardMaterial color={SUMMIT_COLOR} roughness={0.7} flatShading />
      </mesh>

      <mesh position={[7, 16, -6]} castShadow receiveShadow>
        <coneGeometry args={[11, 20, 6]} />
        <meshStandardMaterial color={MID_SLOPE_COLOR} roughness={0.75} flatShading />
      </mesh>

      <mesh position={[-8, 14, 6]} castShadow receiveShadow>
        <coneGeometry args={[10, 18, 6]} />
        <meshStandardMaterial color={MID_SLOPE_COLOR} roughness={0.75} flatShading />
      </mesh>

      <mesh position={[10, 8, 8]} castShadow receiveShadow>
        <coneGeometry args={[9, 14, 5]} />
        <meshStandardMaterial color={BASE_ROCK_COLOR} roughness={0.85} flatShading />
      </mesh>

      <mesh position={[-12, 6, -10]} castShadow receiveShadow>
        <coneGeometry args={[12, 16, 6]} />
        <meshStandardMaterial color={BASE_ROCK_COLOR} roughness={0.85} flatShading />
      </mesh>

      <mesh position={[0, 0, 0]} receiveShadow>
        <cylinderGeometry args={[26, 32, 4, 10]} />
        <meshStandardMaterial color={VALLEY_TERRAIN_COLOR} roughness={0.9} flatShading />
      </mesh>

      <mesh position={[0, -2, 0]} receiveShadow>
        <cylinderGeometry args={[36, 44, 4, 12]} />
        <meshStandardMaterial color="#2D4A43" roughness={0.95} flatShading />
      </mesh>
    </group>
  );
}
