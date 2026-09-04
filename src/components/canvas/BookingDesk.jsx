/**
 * BookingDesk: Valley mountain base 3D interactive booking desk with phone and ledger.
 * Communicates with: SceneContainer.jsx, BookingController.jsx, and useAudioSystem.js.
 */

'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';

const DESK_WOOD_COLOR = '#5C4033';
const PHONE_RED_COLOR = '#D32F2F';
const GOLD_ACCENT_COLOR = '#FFB040';
const GUESTBOOK_COLOR = '#2D4A43';

export default function BookingDesk({ onActivatePhone, onActivateLedger }) {
  const phoneRef = useRef();
  const [hoveredPhone, setHoveredPhone] = useState(false);

  useFrame((state, delta) => {
    if (phoneRef.current && hoveredPhone) {
      phoneRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 35) * 0.08;
    } else if (phoneRef.current) {
      phoneRef.current.rotation.z = 0;
    }
  });

  return (
    <group position={[0, 0.4, 0]}>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.6, 0.18, 1.8]} />
        <meshStandardMaterial color={DESK_WOOD_COLOR} roughness={0.8} flatShading />
      </mesh>

      <mesh position={[-1.6, 0.35, -0.7]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 5]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[1.6, 0.35, -0.7]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 5]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[-1.6, 0.35, 0.7]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 5]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} flatShading />
      </mesh>
      <mesh position={[1.6, 0.35, 0.7]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.7, 5]} />
        <meshStandardMaterial color="#3E2723" roughness={0.9} flatShading />
      </mesh>

      <group
        ref={phoneRef}
        position={[-0.8, 0.85, 0.2]}
        onClick={onActivatePhone}
        onPointerOver={() => setHoveredPhone(true)}
        onPointerOut={() => setHoveredPhone(false)}
      >
        <mesh castShadow>
          <boxGeometry args={[0.5, 0.2, 0.5]} />
          <meshStandardMaterial color={PHONE_RED_COLOR} roughness={0.3} flatShading />
        </mesh>
        <mesh position={[0, 0.15, -0.05]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.16, 0.16, 0.04, 8]} />
          <meshStandardMaterial color={GOLD_ACCENT_COLOR} roughness={0.2} metalness={0.8} flatShading />
        </mesh>
        <mesh position={[0, 0.22, 0.05]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.06, 0.06, 0.7, 6]} />
          <meshStandardMaterial color={PHONE_RED_COLOR} roughness={0.3} flatShading />
        </mesh>
      </group>

      <group position={[0.7, 0.8, 0.1]} onClick={onActivateLedger}>
        <mesh castShadow rotation={[-Math.PI / 2, 0, 0.15]}>
          <boxGeometry args={[0.8, 0.6, 0.08]} />
          <meshStandardMaterial color={GUESTBOOK_COLOR} roughness={0.7} flatShading />
        </mesh>
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0.15]}>
          <boxGeometry args={[0.74, 0.54, 0.04]} />
          <meshStandardMaterial color="#F3F7F9" roughness={0.9} flatShading />
        </mesh>
      </group>

      <mesh position={[0, 0.82, -0.6]} castShadow>
        <cylinderGeometry args={[0.1, 0.15, 0.35, 6]} />
        <meshStandardMaterial
          color={GOLD_ACCENT_COLOR}
          emissive={GOLD_ACCENT_COLOR}
          emissiveIntensity={1.8}
          roughness={0.2}
          flatShading
        />
      </mesh>
      <pointLight position={[0, 1.2, -0.6]} color={GOLD_ACCENT_COLOR} intensity={1.5} distance={5} />
    </group>
  );
}
