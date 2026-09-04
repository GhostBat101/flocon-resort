/**
 * Forest: High-performance instanced pine forest flanking the ski piste corridor grounded to alpine terrain.
 * Communicates with: SceneContainer.jsx, MountainSlope.jsx, useScrollSpline.js, and terrain.js.
 */

'use client';

import React, { useRef, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { getAlpineElevation } from '@/utils/terrain';

const DUMMY = new THREE.Object3D();
const SCRATCH_COLOR = new THREE.Color();
const TRUNK_COLOR = '#3B2A1D';
const PALETTE_GREENS = ['#1B382F', '#24453A', '#2D4A43', '#162E26', '#35564B'];

export default function Forest({ curve, count = 550 }) {
  const foliageRef = useRef();
  const trunkRef = useRef();

  const foliageGeometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(1.35, 3.8, 5);
    geom.translate(0, 2.6, 0);
    return geom;
  }, []);

  const foliageMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      roughness: 0.88,
      metalness: 0.05,
      flatShading: true,
    });
  }, []);

  const trunkGeometry = useMemo(() => {
    const geom = new THREE.CylinderGeometry(0.18, 0.26, 3.2, 5);
    geom.translate(0, 0.2, 0);
    return geom;
  }, []);

  const trunkMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: TRUNK_COLOR,
      roughness: 0.94,
      metalness: 0.02,
      flatShading: true,
    });
  }, []);

  const treeData = useMemo(() => {
    const instances = [];
    const upVector = new THREE.Vector3(0, 1, 0);

    for (let i = 0; i < count; i += 1) {
      let x = 0;
      let y = 0;
      let z = 0;

      if (curve) {
        const t = Math.random();
        const point = curve.getPointAt(t);
        const tangent = curve.getTangentAt(t).normalize();
        const binormal = new THREE.Vector3().crossVectors(tangent, upVector).normalize();
        const side = Math.random() > 0.5 ? 1 : -1;
        const offset = 7.5 + Math.pow(Math.random(), 0.75) * 55;

        x = point.x + binormal.x * side * offset + (Math.random() - 0.5) * 4;
        z = point.z + binormal.z * side * offset + (Math.random() - 0.5) * 4;
      } else {
        x = (Math.random() - 0.5) * 160;
        z = (Math.random() - 0.5) * 320;
      }

      x = Math.max(-135, Math.min(135, x));
      z = Math.max(-180, Math.min(145, z));
      y = getAlpineElevation(x, z);

      const scale = 0.85 + Math.random() * 1.1;
      const rotY = Math.random() * Math.PI * 2;
      const tiltX = (Math.random() - 0.5) * 0.08;
      const tiltZ = (Math.random() - 0.5) * 0.08;
      const colorHex = PALETTE_GREENS[Math.floor(Math.random() * PALETTE_GREENS.length)];

      instances.push({ x, y, z, rotY, tiltX, tiltZ, scale, colorHex });
    }
    return instances;
  }, [curve, count]);

  useLayoutEffect(() => {
    if (!foliageRef.current || !trunkRef.current) return;

    treeData.forEach((tree, i) => {
      DUMMY.position.set(tree.x, tree.y, tree.z);
      DUMMY.rotation.set(tree.tiltX, tree.rotY, tree.tiltZ);
      DUMMY.scale.set(tree.scale, tree.scale, tree.scale);
      DUMMY.updateMatrix();

      foliageRef.current.setMatrixAt(i, DUMMY.matrix);
      trunkRef.current.setMatrixAt(i, DUMMY.matrix);

      SCRATCH_COLOR.set(tree.colorHex);
      foliageRef.current.setColorAt(i, SCRATCH_COLOR);
    });

    foliageRef.current.instanceMatrix.needsUpdate = true;
    trunkRef.current.instanceMatrix.needsUpdate = true;

    if (foliageRef.current.instanceColor) {
      foliageRef.current.instanceColor.needsUpdate = true;
    }

    foliageRef.current.computeBoundingSphere();
    trunkRef.current.computeBoundingSphere();
  }, [treeData]);

  return (
    <group>
      <instancedMesh
        ref={trunkRef}
        args={[trunkGeometry, trunkMaterial, count]}
        castShadow
        receiveShadow
      />
      <instancedMesh
        ref={foliageRef}
        args={[foliageGeometry, foliageMaterial, count]}
        castShadow
        receiveShadow
      />
    </group>
  );
}
