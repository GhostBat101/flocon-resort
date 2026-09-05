/**
 * EnvironmentLighting: Interpolates hemisphere, directional sunlight, and fog across the 3 mountain altitudes.
 * Communicates with: SceneContainer.jsx and useScrollSpline.js.
 */

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SUMMIT_SKY = new THREE.Color('#D8EAF5');
const SUMMIT_GROUND = new THREE.Color('#F3F7F9');
const SUMMIT_SUN = new THREE.Color('#FFFDF8');

const MID_SKY = new THREE.Color('#C8DFEE');
const MID_GROUND = new THREE.Color('#EBF2F7');
const MID_SUN = new THREE.Color('#FFF8EE');

const VALLEY_SKY = new THREE.Color('#9AB8CD');
const VALLEY_GROUND = new THREE.Color('#E2ECF2');
const VALLEY_SUN = new THREE.Color('#FFE9CC');

const CURRENT_SKY = new THREE.Color();
const CURRENT_GROUND = new THREE.Color();
const CURRENT_SUN = new THREE.Color();

export default function EnvironmentLighting({ progress = 0 }) {
  const hemiLightRef = useRef();
  const dirLightRef = useRef();

  useFrame(() => {
    if (!hemiLightRef.current || !dirLightRef.current) return;

    if (progress <= 0.5) {
      const alpha = progress / 0.5;
      CURRENT_SKY.lerpColors(SUMMIT_SKY, MID_SKY, alpha);
      CURRENT_GROUND.lerpColors(SUMMIT_GROUND, MID_GROUND, alpha);
      CURRENT_SUN.lerpColors(SUMMIT_SUN, MID_SUN, alpha);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(1.5, 1.7, alpha);
    } else {
      const alpha = (progress - 0.5) / 0.5;
      CURRENT_SKY.lerpColors(MID_SKY, VALLEY_SKY, alpha);
      CURRENT_GROUND.lerpColors(MID_GROUND, VALLEY_GROUND, alpha);
      CURRENT_SUN.lerpColors(MID_SUN, VALLEY_SUN, alpha);
      dirLightRef.current.intensity = THREE.MathUtils.lerp(1.7, 1.4, alpha);
    }

    hemiLightRef.current.color.copy(CURRENT_SKY);
    hemiLightRef.current.groundColor.copy(CURRENT_GROUND);
    dirLightRef.current.color.copy(CURRENT_SUN);
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <hemisphereLight
        ref={hemiLightRef}
        color="#D8EAF5"
        groundColor="#F3F7F9"
        intensity={0.95}
      />
      <directionalLight
        ref={dirLightRef}
        position={[25, 45, 20]}
        color="#FFFDF8"
        intensity={1.5}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={100}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
      />
    </>
  );
}
