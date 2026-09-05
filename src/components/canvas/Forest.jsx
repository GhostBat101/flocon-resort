/**
 * Forest: Instanced authentic alpine evergreen forest and snow bushes grounded to mountain terrain.
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
  classicPine: 160,
  slenderFir: 150,
  dwarfPine: 110,
  windwardSpruce: 100,
};

const BUSH_COUNTS = {
  alpineMound: 110,
  alpineShrub: 110,
};

function createPlantData(curve, count, minOffset, maxOffset, minScale, maxScale, tiltFactor) {
  const instances = [];
  const safeClearance = 8.4;

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

      x = point.x + binormal.x * side * offset + (Math.random() - 0.5) * 2;
      z = point.z + binormal.z * side * offset + (Math.random() - 0.5) * 2;

      const distToTrackCenter = Math.hypot(x - point.x, z - point.z);
      if (distToTrackCenter < safeClearance) {
        x = point.x + binormal.x * side * (safeClearance + 1.2 + Math.random() * 2);
        z = point.z + binormal.z * side * (safeClearance + 1.2 + Math.random() * 2);
      }
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

  const classicPineInstances = useMemo(
    () => createPlantData(curve, TREE_COUNTS.classicPine, 9.0, 62.0, 0.85, 1.35, 0.08),
    [curve]
  );
  const slenderFirInstances = useMemo(
    () => createPlantData(curve, TREE_COUNTS.slenderFir, 8.8, 55.0, 0.90, 1.40, 0.07),
    [curve]
  );
  const dwarfPineInstances = useMemo(
    () => createPlantData(curve, TREE_COUNTS.dwarfPine, 10.0, 65.0, 0.80, 1.25, 0.09),
    [curve]
  );
  const windwardSpruceInstances = useMemo(
    () => createPlantData(curve, TREE_COUNTS.windwardSpruce, 9.5, 60.0, 0.85, 1.30, 0.10),
    [curve]
  );

  const alpineMoundInstances = useMemo(
    () => createPlantData(curve, BUSH_COUNTS.alpineMound, 8.6, 45.0, 0.70, 1.25, 0.08),
    [curve]
  );
  const alpineShrubInstances = useMemo(
    () => createPlantData(curve, BUSH_COUNTS.alpineShrub, 8.4, 42.0, 0.75, 1.30, 0.08),
    [curve]
  );

  return (
    <group>
      <PlantTypeInstances modelGroup={nodes.Tree_Pine_Classic} instances={classicPineInstances} />
      <PlantTypeInstances modelGroup={nodes.Tree_Fir_Slender} instances={slenderFirInstances} />
      <PlantTypeInstances modelGroup={nodes.Tree_Pine_Dwarf} instances={dwarfPineInstances} />
      <PlantTypeInstances modelGroup={nodes.Tree_Spruce_Windward} instances={windwardSpruceInstances} />
      <PlantTypeInstances modelGroup={nodes.Bush_Alpine_Mound} instances={alpineMoundInstances} />
      <PlantTypeInstances modelGroup={nodes.Bush_Alpine_Shrub} instances={alpineShrubInstances} />
    </group>
  );
}

useGLTF.preload(FOLIAGE_MODEL_PATH);
