/**
 * Forest: High-performance instanced pine forest flanking the ski piste corridor.
 * Communicates with: SceneContainer.jsx, MountainSlope.jsx, and useScrollSpline.js.
 */

'use client';

import React, { useRef, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';

const DUMMY = new THREE.Object3D();
const SCRATCH_COLOR = new THREE.Color();
const PALETTE_GREENS = ['#1B382F', '#24453A', '#2D4A43', '#162E26', '#35564B'];

export default function Forest({ curve, count = 550 }) {
  const meshRef = useRef();

  const treeGeometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(1.2, 3.8, 5);
    geom.translate(0, 1.9, 0);
    return geom;
  }, []);

  const treeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      roughness: 0.88,
      metalness: 0.05,
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

      const slopeY = 54 - ((z + 180) / 320) * 52;
      const rollingNoise = Math.sin(x * 0.04) * 3.5 + Math.cos(z * 0.03) * 2.8;
      y = Math.max(0.2, slopeY + rollingNoise - 0.2);

      const scale = 0.85 + Math.random() * 1.1;
      const rotY = Math.random() * Math.PI * 2;
      const tiltX = (Math.random() - 0.5) * 0.12;
      const tiltZ = (Math.random() - 0.5) * 0.12;
      const colorHex = PALETTE_GREENS[Math.floor(Math.random() * PALETTE_GREENS.length)];

      instances.push({ x, y, z, rotY, tiltX, tiltZ, scale, colorHex });
    }
    return instances;
  }, [curve, count]);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    treeData.forEach((tree, i) => {
      DUMMY.position.set(tree.x, tree.y, tree.z);
      DUMMY.rotation.set(tree.tiltX, tree.rotY, tree.tiltZ);
      DUMMY.scale.set(tree.scale, tree.scale, tree.scale);
      DUMMY.updateMatrix();

      meshRef.current.setMatrixAt(i, DUMMY.matrix);
      SCRATCH_COLOR.set(tree.colorHex);
      meshRef.current.setColorAt(i, SCRATCH_COLOR);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) {
      meshRef.current.instanceColor.needsUpdate = true;
    }
    meshRef.current.computeBoundingSphere();
  }, [treeData]);

  return (
    <instancedMesh
      ref={meshRef}
      args={[treeGeometry, treeMaterial, count]}
      castShadow
      receiveShadow
    />
  );
}
