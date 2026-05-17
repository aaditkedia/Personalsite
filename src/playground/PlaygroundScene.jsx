import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Character } from './Character';

function TrackFloor() {
  return (
    <group>
      {/* Main track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 60]} />
        <meshStandardMaterial
          color="#0d1322"
          roughness={0.85}
          metalness={0.15}
        />
      </mesh>
      {/* Glowing lane stripes */}
      {[-3, -1, 1, 3].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.01, 0]}>
          <planeGeometry args={[0.08, 60]} />
          <meshBasicMaterial color="#7aa7ff" transparent opacity={0.32} />
        </mesh>
      ))}
      {/* Center line, slightly brighter */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.011, 0]}>
        <planeGeometry args={[0.04, 60]} />
        <meshBasicMaterial color="#b78cff" transparent opacity={0.55} />
      </mesh>
    </group>
  );
}

function RigCamera({ targetRef }) {
  useFrame((state) => {
    // Soft chase: camera leans toward the character as it drifts.
    const lerp = (a, b, t) => a + (b - a) * t;
    const tx = targetRef.current?.position?.x ?? 0;
    state.camera.position.x = lerp(state.camera.position.x, tx * 0.6, 0.08);
    state.camera.lookAt(tx * 0.3, 1.1, 0);
  });
  return null;
}

function CharacterRig({ characterRef, animationKey, onAnimationEnd }) {
  useFrame((state) => {
    if (!characterRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle side drift so the runner never sits perfectly still.
    characterRef.current.position.x = Math.sin(t * 0.6) * 0.6;
  });

  return (
    <group ref={characterRef}>
      <Suspense fallback={null}>
        <Character animationKey={animationKey} onAnimationEnd={onAnimationEnd} />
      </Suspense>
    </group>
  );
}

export function PlaygroundScene({ animationKey, onAnimationEnd }) {
  const characterRef = useRef(null);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 680;

  return (
    <Canvas
      shadows
      dpr={[1, 1.8]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
      }}
      camera={
        isMobile
          ? { position: [0, 2.2, 8.5], fov: 42, near: 0.1, far: 60 }
          : { position: [0, 1.8, 5.2], fov: 38, near: 0.1, far: 60 }
      }
    >
      <color attach="background" args={['#050810']} />
      <fog attach="fog" args={['#050810', 12, 36]} />

      <ambientLight intensity={0.35} />
      <directionalLight
        position={[4, 8, 4]}
        intensity={0.9}
        color="#d0dffc"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
      />
      <pointLight position={[0, 2.5, 4]} intensity={0.6} color="#b78cff" />
      <pointLight position={[-3, 1.5, -2]} intensity={0.4} color="#7aa7ff" />

      <Suspense fallback={null}>
        <Environment preset="city" environmentIntensity={0.4} />
      </Suspense>

      <TrackFloor />
      <ContactShadows
        position={[0, 0.005, 0]}
        opacity={0.55}
        scale={10}
        blur={2.4}
        far={4}
        color="#000"
      />

      <CharacterRig
        characterRef={characterRef}
        animationKey={animationKey}
        onAnimationEnd={onAnimationEnd}
      />

      <RigCamera targetRef={characterRef} />

      <EffectComposer multisampling={0}>
        <Bloom intensity={0.55} luminanceThreshold={0.72} luminanceSmoothing={0.4} mipmapBlur />
        <Vignette eskil={false} offset={0.3} darkness={0.55} />
      </EffectComposer>
    </Canvas>
  );
}
