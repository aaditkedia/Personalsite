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
      camera={{ position: [0, 0, 4], fov: 38, near: 0.1, far: 50 }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[2.5, 3, 2]} intensity={0.9} color="#F4E2C2" />
      <directionalLight position={[-2.5, 1, -1]} intensity={0.55} color="#D9A063" />
      <pointLight position={[0, 0, 2]} intensity={0.4} color="#F2C98C" />

      <Suspense fallback={null}>
        <Environment preset="sunset" />
        <Rig />
      </Suspense>

      <EffectComposer multisampling={0}>
        {isMobile ? (
          <>
            <Bloom
              intensity={0.95}
              luminanceThreshold={0.55}
              luminanceSmoothing={0.32}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.28} darkness={0.55} />
            <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
          </>
        ) : (
          <>
            <Bloom
              intensity={0.95}
              luminanceThreshold={0.55}
              luminanceSmoothing={0.32}
              mipmapBlur
            />
            <DepthOfField focusDistance={0.02} focalLength={0.05} bokehScale={1.6} />
            <Vignette eskil={false} offset={0.28} darkness={0.55} />
            <Noise opacity={0.04} blendFunction={BlendFunction.OVERLAY} />
          </>
        )}
      </EffectComposer>
    </Canvas>
  );
}
