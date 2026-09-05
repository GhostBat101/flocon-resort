/**
 * Forest: Instanced multi-species alpine forest and winter bushes grounded to mountain terrain.
 * Communicates with: SceneContainer.jsx, MountainSlope.jsx, useScrollSpline.js, and terrain.js.
 */

'use client';

import React, { useRef, useMemo, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { getAssetUrl } from '@/utils/assets';
import { getAlpineElevation } from '@/utils/terrain';

const FOLIAGE_MODEL_PATH = getAssetUrl('/assets/models/alpine_foliage.glb');
const DUMMY = new THREE.Object3D();
const UP_VECTOR = new THREE.Vector3(0, 1, 0);

const TREE_COUNTS = {
  tieredPine: 160,
  slenderFir: 140,
  twistedPine: 110,
  deadWinter: 70,
};

const BUSH_COUNTS = {
  snowMound: 90,
  bareTwig: 80,
  alpineScrub: 70,
};

function createPlantData(curve, count, minOffset, maxOffset, minScale, maxScale, tiltFactor) {
  const instances = [];

  for (let i = 0; i < count; i += 1) {
    let x = 0;
    let z = 0;

    if (curve) {
      const t = Math.random();
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t).normalize();
      const binormal = new THREE.Vector3().crossVectors(tangent, UP_VECTOR).normalize();
      const side = Math.random() > 0.5 ? 1 : -1;
      const offset = minOffset + Math.pow(Math.random(), 0.75) * (maxOffset - minOffset);

      x = point.x + binormal.x * side * offset + (Math.random() - 0.5) * 4;
      z = point.z + binormal.z * side * offset + (Math.random() - 0.5) * 4;
    } else {
      x = (Math.random() - 0.5) * 160;
      z = (Math.random() - 0.5) * 320;
    }

    x = Math.max(-135, Math.min(135, x));
    z = Math.max(-180, Math.min(145, z));
    const y = getAlpineElevation(x, z);

    const scale = minScale + Math.random() * (maxScale - minScale);
    const rotY = Math.random() * Math.PI * 2;
    const tiltX = (Math.random() - 0.5) * tiltFactor;
    const tiltZ = (Math.random() - 0.5) * tiltFactor;

    instances.push({ x, y, z, rotY, tiltX, tiltZ, scale });
  }

  return instances;
}

function PlantTypeInstances({ modelGroup, instances }) {
  const meshRefs = useRef([]);

  useLayoutEffect(() => {
    if (!modelGroup || !instances || instances.length === 0) return;

    for (let i = 0; i < instances.length; i += 1) {
      const inst = instances[i];
      DUMMY.position.set(inst.x, inst.y, inst.z);
      DUMMY.rotation.set(inst.tiltX, inst.rotY, inst.tiltZ);
      DUMMY.scale.set(inst.scale, inst.scale, inst.scale);
      DUMMY.updateMatrix();

      for (let m = 0; m < meshRefs.current.length; m += 1) {
        const mesh = meshRefs.current[m];
        if (mesh) {
          mesh.setMatrixAt(i, DUMMY.matrix);
        }
      }
    }

    for (let m = 0; m < meshRefs.current.length; m += 1) {
      const mesh = meshRefs.current[m];
      if (mesh) {
        mesh.instanceMatrix.needsUpdate = true;
        mesh.computeBoundingSphere();
      }
    }
  }, [modelGroup, instances]);

  if (!modelGroup || !instances || instances.length === 0) return null;

  return (
    <group>
      {modelGroup.children.map((child, idx) => (
        <instancedMesh
          key={child.name || idx}
          ref={(el) => {
            meshRefs.current[idx] = el;
          }}
          args={[child.geometry, child.material, instances.length]}
          castShadow
          receiveShadow
        />
      ))}
    </group>
  );
}

export default function Forest({ curve }) {
  const { nodes } = useGLTF(FOLIAGE_MODEL_PATH);

  const tieredPineInstances = useMemo(
    () => createPlantData(curve, TREE_COUNTS.tieredPine, 8.0, 62.0, 0.85, 1.4, 0.08),
    [curve]
  );
  const slenderFirInstances = useMemo(
    () => createPlantData(curve, TREE_COUNTS.slenderFir, 7.5, 55.0, 0.9, 1.45, 0.07),
    [curve]
  );
  const twistedPineInstances = useMemo(
    () => createPlantData(curve, TREE_COUNTS.twistedPine, 11.0, 68.0, 0.8, 1.35, 0.12),
    [curve]
  );
  const deadWinterInstances = useMemo(
    () => createPlantData(curve, TREE_COUNTS.deadWinter, 9.0, 65.0, 0.75, 1.3, 0.14),
    [curve]
  );

  const snowMoundInstances = useMemo(
    () => createPlantData(curve, BUSH_COUNTS.snowMound, 4.5, 45.0, 0.7, 1.3, 0.08),
    [curve]
  );
  const bareTwigInstances = useMemo(
    () => createPlantData(curve, BUSH_COUNTS.bareTwig, 5.0, 48.0, 0.65, 1.25, 0.1),
    [curve]
  );
  const alpineScrubInstances = useMemo(
    () => createPlantData(curve, BUSH_COUNTS.alpineScrub, 4.0, 42.0, 0.7, 1.3, 0.08),
    [curve]
  );

  return (
    <group>
      <PlantTypeInstances modelGroup={nodes.Tree_Pine_Tiered} instances={tieredPineInstances} />
      <PlantTypeInstances modelGroup={nodes.Tree_Fir_Slender} instances={slenderFirInstances} />
      <PlantTypeInstances modelGroup={nodes.Tree_Pine_Twisted} instances={twistedPineInstances} />
      <PlantTypeInstances modelGroup={nodes.Tree_Dead_Winter} instances={deadWinterInstances} />
      <PlantTypeInstances modelGroup={nodes.Bush_Snow_Mound} instances={snowMoundInstances} />
      <PlantTypeInstances modelGroup={nodes.Bush_Bare_Twig} instances={bareTwigInstances} />
      <PlantTypeInstances modelGroup={nodes.Bush_Alpine_Scrub} instances={alpineScrubInstances} />
    </group>
  );
}

useGLTF.preload(FOLIAGE_MODEL_PATH);
