import { Canvas } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  DepthOfField,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { Suspense } from 'react';
import { Rig } from './Rig';

export function Scene() {
  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 680;
  const dpr = isMobile ? [1, 1.3] : [1, 1.8];

  // Mobile: pull camera back + widen FOV so the 3D scenes fit a tall portrait
  // viewport. Rig.jsx reads the same threshold and oscillates around the base z.
  const cameraSetup = isMobile
    ? { position: [0, 0, 6.8], fov: 50, near: 0.1, far: 50 }
    : { position: [0, 0, 4], fov: 38, near: 0.1, far: 50 };

  return (
    <Canvas
      className="scroll-scene-canvas"
      dpr={dpr}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      camera={cameraSetup}
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[2.5, 3, 2]} intensity={0.55} color="#d0dffc" />
      <directionalLight position={[-2.5, 1, -1]} intensity={0.35} color="#7aa7ff" />
      <pointLight position={[0, 0, 2]} intensity={0.22} color="#b78cff" />

      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.45} />
        <Rig />
      </Suspense>

      <EffectComposer multisampling={0}>
        {isMobile ? (
          <>
            <Bloom
              intensity={0.35}
              luminanceThreshold={0.85}
              luminanceSmoothing={0.4}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.28} darkness={0.6} />
            <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
          </>
        ) : (
          <>
            <Bloom
              intensity={0.55}
              luminanceThreshold={0.75}
              luminanceSmoothing={0.35}
              mipmapBlur
            />
            <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={1.4} />
            <Vignette eskil={false} offset={0.28} darkness={0.55} />
            <Noise opacity={0.04} blendFunction={BlendFunction.OVERLAY} />
          </>
        )}
      </EffectComposer>
    </Canvas>
  );
}
