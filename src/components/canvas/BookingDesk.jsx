/**
 * BookingDesk: Valley mountain base 3D interactive booking desk with phone and ledger.
 * Communicates with: SceneContainer.jsx, BookingController.jsx, and useAudioSystem.js.
 */

'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { getAssetUrl } from '@/utils/assets';

const GOLD_ACCENT_COLOR = '#FFB040';
const DESK_MODEL_PATH = getAssetUrl('/assets/models/booking_desk.glb');
const PHONE_MODEL_PATH = getAssetUrl('/assets/models/rotary_phone.glb');

function DeskModel() {
  const { scene } = useGLTF(DESK_MODEL_PATH);
  return <primitive object={scene} position={[0, -0.4, 0]} scale={[0.9, 0.9, 0.9]} />;
}

function PhoneModel() {
  const { scene } = useGLTF(PHONE_MODEL_PATH);
  return <primitive object={scene} scale={[0.42, 0.42, 0.42]} />;
}

export default function BookingDesk({
  position = [0, 0.8, 125],
  onActivatePhone,
  onActivateLedger,
}) {
  const phoneRef = useRef();
  const [hoveredPhone, setHoveredPhone] = useState(false);

  useFrame((state) => {
    if (phoneRef.current && hoveredPhone) {
      phoneRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 35) * 0.08;
    } else if (phoneRef.current) {
      phoneRef.current.rotation.z = 0;
    }
  });

  return (
    <group position={position}>
      <DeskModel />

      <group
        ref={phoneRef}
        position={[-0.85, 0.95, 0.15]}
        onClick={onActivatePhone}
        onPointerOver={() => setHoveredPhone(true)}
        onPointerOut={() => setHoveredPhone(false)}
        className="cursor-pointer"
      >
        <PhoneModel />
      </group>

      <group
        position={[0.7, 0.95, 0.1]}
        onClick={onActivateLedger}
        className="cursor-pointer"
      >
        <mesh visible={false}>
          <boxGeometry args={[1.1, 0.4, 0.9]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      </group>

      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.8, 3.2, 24]} />
        <meshBasicMaterial
          color={GOLD_ACCENT_COLOR}
          transparent
          opacity={0.65}
          depthWrite={false}
        />
      </mesh>

      <pointLight position={[0, 1.8, -0.4]} color={GOLD_ACCENT_COLOR} intensity={2.2} distance={8} />
    </group>
  );
}
