/**
 * Forest: High-performance instanced pine forest using Three.js InstancedMesh.
 * Communicates with: SceneContainer.jsx and Mountain.jsx.
 */

'use client';

import React, { useRef, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';

const DUMMY = new THREE.Object3D();
const SCRATCH_COLOR = new THREE.Color();
const PALETTE_GREENS = ['#2D4A43', '#385950', '#1F342F', '#466D62'];

export default function Forest({ count = 450 }) {
  const meshRef = useRef();

  const treeGeometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(0.85, 2.4, 5);
    geom.translate(0, 1.2, 0);
    return geom;
  }, []);

  const treeMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      roughness: 0.85,
      metalness: 0.05,
      flatShading: true,
    });
  }, []);

  const treeData = useMemo(() => {
    const instances = [];
    for (let i = 0; i < count; i++) {
      const radius = 8 + Math.sqrt(Math.random()) * 20;
      const angle = (i / count) * Math.PI * 16 + Math.random() * 0.4;
      const x = Math.cos(angle) * radius + (Math.random() - 0.5) * 3;
      const z = Math.sin(angle) * radius + (Math.random() - 0.5) * 3;
      const normalizedDist = Math.min(1.0, radius / 28);
      const y = Math.max(0.1, (1.0 - normalizedDist) * 22 - Math.random() * 1.5);

      const scale = 0.7 + Math.random() * 0.6;
      const rotY = Math.random() * Math.PI * 2;
      const tiltX = (Math.random() - 0.5) * 0.14;
      const tiltZ = (Math.random() - 0.5) * 0.14;
      const colorHex = PALETTE_GREENS[Math.floor(Math.random() * PALETTE_GREENS.length)];

      instances.push({ x, y, z, rotY, tiltX, tiltZ, scale, colorHex });
    }
    return instances;
  }, [count]);

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
