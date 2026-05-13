import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { SoftShadows } from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  DepthOfField,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

import Runner from './Runner';
import DroneCamera from './DroneCamera';
import SpaceEnvironment from './SpaceEnvironment';

const DroneScene = ({ hudRef }) => {
  const runnerRef = useRef();

  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        stencil: false,
      }}
      onCreated={({ scene, gl }) => {
        scene.background = new THREE.Color('#03050d');
        // No fog — would dim the stars. Depth cues come from DOF + scale.
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.15;
        gl.shadowMap.type = THREE.PCFSoftShadowMap;
        gl.outputColorSpace = THREE.SRGBColorSpace;
      }}
    >
      <DroneCamera runnerRef={runnerRef} hudRef={hudRef} />

      {/* Soft contact shadows so the rig grounds onto the neon runway */}
      <SoftShadows size={28} samples={12} focus={0.5} />

      {/* Lighting */}
      <ambientLight intensity={0.35} color="#5878c8" />
      <hemisphereLight args={['#9bb8ff', '#2a1640', 0.45]} />

      {/* Cold starlight key */}
      <directionalLight
        position={[10, 16, 6]}
        intensity={1.4}
        color="#dde7ff"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0005}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
        shadow-camera-near={0.5}
        shadow-camera-far={50}
      />
      {/* Drone-mounted cyan rim from behind */}
      <pointLight position={[-3, 3.2, -4]} intensity={3.5} distance={16} color="#7adcff" decay={1.8} />
      {/* Warm planet-glow key on the runner's chest */}
      <pointLight position={[3, 2.5, 5]} intensity={2.2} distance={14} color="#ffa86b" decay={1.8} />
      {/* Magenta nebula bounce from above */}
      <pointLight position={[0, 9, 14]} intensity={1.8} distance={28} color="#c47aff" decay={1.6} />

      <SpaceEnvironment />
      <Runner ref={runnerRef} />

      <EffectComposer multisampling={4} disableNormalPass>
        <DepthOfField
          focusDistance={0.013}
          focalLength={0.045}
          bokehScale={3.5}
          height={520}
        />
        <Bloom
          intensity={1.15}
          luminanceThreshold={0.55}
          luminanceSmoothing={0.25}
          mipmapBlur
          radius={0.85}
        />
        <ChromaticAberration
          blendFunction={BlendFunction.NORMAL}
          offset={[0.0009, 0.0014]}
        />
        <Noise opacity={0.04} />
        <Vignette eskil={false} offset={0.18} darkness={0.9} />
      </EffectComposer>
    </Canvas>
  );
};

export default DroneScene;
