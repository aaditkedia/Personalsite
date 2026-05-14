import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  EffectComposer,
  Bloom,
  Vignette,
  DepthOfField,
} from '@react-three/postprocessing';
import { HalfFloatType } from 'three';
import * as THREE from 'three';

import Runner from './Runner';
import DroneCamera from './DroneCamera';
import SpaceEnvironment from './SpaceEnvironment';

/**
 * One Canvas. Frameloop is gated by the `active` prop so the scene fully
 * stops ticking when the LandingPage scrolls out of view — the biggest
 * single perf win available without losing fidelity.
 */
const DroneScene = ({ hudRef, active = true }) => {
  const runnerRef = useRef();

  return (
    <Canvas
      shadows
      // Cap DPR at 1.5. On retina displays the visual difference vs 2.0 is
      // imperceptible for this kind of moody / bloomy scene but the GPU cost
      // is ~1.8x lower per frame.
      dpr={[1, 1.5]}
      frameloop={active ? 'always' : 'never'}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        stencil: false,
        depth: true,
      }}
      onCreated={({ scene, gl }) => {
        scene.background = new THREE.Color('#03050d');
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        // Let Three default the shadow map type — forcing PCFSoftShadowMap
        // generates a deprecation warning in current Three builds.
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <DroneCamera runnerRef={runnerRef} hudRef={hudRef} />

      {/* Three-point rig — no fill from drei's SoftShadows (that helper
          recompiles shaders per-frame and was the single heaviest cost). */}
      <ambientLight intensity={0.4} color="#5878c8" />
      <hemisphereLight args={['#9bb8ff', '#2a1640', 0.5]} />

      <directionalLight
        position={[10, 16, 6]}
        intensity={1.5}
        color="#dde7ff"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
        shadow-camera-left={-8}
        shadow-camera-right={8}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
        shadow-camera-near={0.5}
        shadow-camera-far={40}
      />
      {/* Cyan rim behind the runner */}
      <pointLight position={[-3, 3.2, -4]} intensity={3.0} distance={16} color="#7adcff" decay={1.8} />
      {/* Warm key from a "planet" direction */}
      <pointLight position={[3, 2.5, 5]} intensity={2.2} distance={14} color="#ffa86b" decay={1.8} />

      <SpaceEnvironment />
      <Runner ref={runnerRef} />

      {/* Light post-chain: Bloom for planet/neon glow, gentle DOF for depth,
          Vignette for lens framing. Dropped ChromaticAberration, Noise, and
          drei SoftShadows — those were the worst offenders for frame time. */}
      {/* HalfFloat framebuffer stops Chromium's glBlitFramebuffer
          depth/stencil format spam when postprocessing samples the scene. */}
      <EffectComposer multisampling={0} disableNormalPass frameBufferType={HalfFloatType}>
        <Bloom
          intensity={0.9}
          luminanceThreshold={0.65}
          luminanceSmoothing={0.25}
          mipmapBlur
          radius={0.7}
        />
        <DepthOfField
          focusDistance={0.012}
          focalLength={0.05}
          bokehScale={2.2}
          height={360}
        />
        <Vignette eskil={false} offset={0.2} darkness={0.85} />
      </EffectComposer>
    </Canvas>
  );
};

export default DroneScene;
