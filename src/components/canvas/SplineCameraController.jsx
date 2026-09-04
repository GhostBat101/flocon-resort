/**
 * SplineCameraController: First-person skier camera gliding down the winding alpine piste.
 * Communicates with: SceneContainer.jsx and useScrollSpline.js.
 */

'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SCRATCH_POS = new THREE.Vector3();
const SCRATCH_TGT = new THREE.Vector3();
const TARGET_CAM_POS = new THREE.Vector3();
const TARGET_ROT_MAT = new THREE.Matrix4();
const TARGET_QUAT = new THREE.Quaternion();
const UP_VECTOR = new THREE.Vector3(0, 1, 0);

export default function SplineCameraController({ curve, targetProgress = 0 }) {
  const currentU = useRef(0);

  useFrame((state, delta) => {
    if (!curve) return;

    const safeDelta = THREE.MathUtils.clamp(delta, 0.001, 0.05);

    currentU.current = THREE.MathUtils.damp(
      currentU.current,
      targetProgress,
      6.0,
      safeDelta
    );

    const clampedU = THREE.MathUtils.clamp(currentU.current, 0, 0.999);
    curve.getPointAt(clampedU, SCRATCH_POS);

    const tangent = curve.getTangentAt(clampedU).normalize();
    SCRATCH_TGT.copy(SCRATCH_POS).addScaledVector(tangent, 14.0);
    SCRATCH_TGT.y = SCRATCH_POS.y - 0.5;

    TARGET_CAM_POS.set(
      SCRATCH_POS.x,
      SCRATCH_POS.y + 2.4,
      SCRATCH_POS.z
    );

    state.camera.position.lerp(TARGET_CAM_POS, THREE.MathUtils.clamp(safeDelta * 8, 0, 1));

    TARGET_ROT_MAT.lookAt(state.camera.position, SCRATCH_TGT, UP_VECTOR);
    TARGET_QUAT.setFromRotationMatrix(TARGET_ROT_MAT);
    state.camera.quaternion.slerp(TARGET_QUAT, THREE.MathUtils.clamp(safeDelta * 8, 0, 1));
  });

  return null;
}
