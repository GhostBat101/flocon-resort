/**
 * SceneContainer: R3F Canvas wrapper managing 3D viewport mounting, scene graph, and postprocessing.
 * Communicates with: DesktopShowcase.jsx, Mountain.jsx, and Snowball.jsx.
 */

'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import * as THREE from 'three';
import Mountain from './Mountain';
import Forest from './Forest';
import Snowball from './Snowball';
import ShadowPlane from './ShadowPlane';
import Snowfall from './Snowfall';
import BookingDesk from './BookingDesk';
import ChaletMarker from './ChaletMarker';
import EnvironmentLighting from './EnvironmentLighting';
import SplineCameraController from './SplineCameraController';
import { CABINS } from '@/data/cabins';

export default function SceneContainer({
  progress = 0,
  curve,
  getMetrics,
  onSelectCabin,
  onActivatePhone,
  onActivateLedger,
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[#F3F7F9]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-[#2D4A43] border-t-transparent animate-spin" />
          <p className="font-label text-xs uppercase tracking-widest text-[#2D4A43] font-bold">
            Mounting Alpine Viewport...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [0, 42, 22], fov: 45 }}
        dpr={[1, 1.8]}
        gl={{
          antialias: false,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          <EnvironmentLighting progress={progress} />
          {curve && <SplineCameraController curve={curve} targetProgress={progress} />}

          <Mountain />
          <Forest count={400} />
          <Snowfall count={380} />

          {getMetrics && (
            <>
              <Snowball progress={progress} getMetrics={getMetrics} />
              <ShadowPlane progress={progress} getMetrics={getMetrics} />
            </>
          )}

          {CABINS.map((cabin) => (
            <ChaletMarker
              key={cabin.id}
              cabin={cabin}
              onSelect={onSelectCabin}
            />
          ))}

          <BookingDesk
            onActivatePhone={onActivatePhone}
            onActivateLedger={onActivateLedger}
          />

          <EffectComposer disableNormalPass multisampling={4}>
            <Bloom
              mipmapBlur
              intensity={0.9}
              luminanceThreshold={0.94}
              luminanceSmoothing={0.08}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
