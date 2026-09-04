/**
 * SplineCameraController: First-person skier camera gliding down the winding alpine piste.
 * Communicates with: SceneContainer.jsx and useScrollSpline.js.
 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SCRATCH_POS = new THREE.Vector3();
const SCRATCH_LOOK = new THREE.Vector3();
const TARGET_ROT_MAT = new THREE.Matrix4();
const TARGET_QUAT = new THREE.Quaternion();
const UP_VECTOR = new THREE.Vector3(0, 1, 0);

export default function SplineCameraController({ curve, targetProgress = 0 }) {
  const currentU = useRef(0);

  useFrame((state, delta) => {
    if (!curve) return;

    currentU.current = THREE.MathUtils.damp(
      currentU.current,
      targetProgress,
      6.0,
      delta
    );

    const clampedU = THREE.MathUtils.clamp(currentU.current, 0, 0.999);
    curve.getPointAt(clampedU, SCRATCH_POS);

    const lookAheadU = THREE.MathUtils.clamp(clampedU + 0.042, 0, 0.999);
    curve.getPointAt(lookAheadU, SCRATCH_LOOK);

    const targetCamPos = new THREE.Vector3(
      SCRATCH_POS.x,
      SCRATCH_POS.y + 2.3,
      SCRATCH_POS.z
    );

    state.camera.position.lerp(targetCamPos, THREE.MathUtils.clamp(delta * 9, 0, 1));

    const lookTarget = new THREE.Vector3(
      SCRATCH_LOOK.x,
      SCRATCH_LOOK.y + 1.6,
      SCRATCH_LOOK.z
    );

    TARGET_ROT_MAT.lookAt(state.camera.position, lookTarget, UP_VECTOR);
    TARGET_QUAT.setFromRotationMatrix(TARGET_ROT_MAT);
    state.camera.quaternion.slerp(TARGET_QUAT, THREE.MathUtils.clamp(delta * 9, 0, 1));
  });

  return null;
}
