/**
 * SplineCameraController: Jitter-free camera tracking along Catmull-Rom spline with look-ahead quaternion math.
 * Communicates with: SceneContainer.jsx and useScrollSpline.js.
 */

'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SCRATCH_POS = new THREE.Vector3();
const SCRATCH_LOOK = new THREE.Vector3();
const SCRATCH_OFFSET = new THREE.Vector3(0, 3.5, 7.5);
const TARGET_ROT_MAT = new THREE.Matrix4();
const TARGET_QUAT = new THREE.Quaternion();

export default function SplineCameraController({ curve, targetProgress = 0 }) {
  const currentU = useRef(0);

  useFrame((state, delta) => {
    if (!curve) return;

    currentU.current = THREE.MathUtils.damp(
      currentU.current,
      targetProgress,
      5.5,
      delta
    );

    const clampedU = THREE.MathUtils.clamp(currentU.current, 0, 0.999);
    curve.getPointAt(clampedU, SCRATCH_POS);

    const lookAheadU = THREE.MathUtils.clamp(clampedU + 0.03, 0, 0.999);
    curve.getPointAt(lookAheadU, SCRATCH_LOOK);

    state.camera.position.set(
      SCRATCH_POS.x + SCRATCH_OFFSET.x,
      SCRATCH_POS.y + SCRATCH_OFFSET.y,
      SCRATCH_POS.z + SCRATCH_OFFSET.z
    );

    TARGET_ROT_MAT.lookAt(state.camera.position, SCRATCH_LOOK, state.camera.up);
    TARGET_QUAT.setFromRotationMatrix(TARGET_ROT_MAT);
    state.camera.quaternion.slerp(TARGET_QUAT, THREE.MathUtils.clamp(delta * 8, 0, 1));
  });

  return null;
}
