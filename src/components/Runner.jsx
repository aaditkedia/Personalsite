import React, { Suspense, useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Vite serves the site under /Personalsite/ on Pages, / in dev.
const ASSET = (file) => `${import.meta.env.BASE_URL}${file}`;
const CHAR_URL = ASSET('char.glb');

/**
 * Step 1 of the rebuild — STATIC pose, no animation.
 * Goal: get the character actually visible in the chase-camera frame.
 * Animation comes back AFTER we confirm placement works.
 *
 * The magenta pylon is a debug landmark:
 *   - see pylon + character → great, scale/position is right
 *   - see pylon only → GLB loaded but mesh is offscreen / tiny / invisible
 *   - see neither     → camera isn't framing origin (different bug)
 */
const Runner = React.forwardRef(function Runner(_, groupRef) {
  // Outer drift drives the chase camera's bank. Kept identical to the
  // BoilerNet chase rig.
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.x =
      Math.sin(t * 0.6) * 1.4 + Math.sin(t * 1.7) * 0.4;
    const dx = Math.cos(t * 0.6) * 0.6 * 1.4 + Math.cos(t * 1.7) * 1.7 * 0.4;
    groupRef.current.rotation.y = Math.atan2(dx, 8) * 0.8;
  });

  return (
    <group ref={groupRef}>
      <Suspense fallback={<DebugPylon />}>
        <Character />
      </Suspense>
      <DebugPylon />
    </group>
  );
});

function Character() {
  const { scene } = useGLTF(CHAR_URL);
  const ref = useRef();

  // Auto-fit to ~2.2 world units tall, feet on the runway (y=0).
  // Mixamo GLB exports inconsistently come out in cm or m units — measuring
  // the loaded bounding box and rescaling removes the guessing.
  useEffect(() => {
    if (!scene) return;
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);
    scene.scale.setScalar(1);
    scene.updateMatrixWorld(true);

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.frustumCulled = false;
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    if (size.y > 0 && Number.isFinite(size.y)) {
      const factor = 2.2 / size.y;
      scene.scale.setScalar(factor);
      scene.updateMatrixWorld(true);
      const grounded = new THREE.Box3().setFromObject(scene);
      scene.position.y = -grounded.min.y;
    }
  }, [scene]);

  return <primitive ref={ref} object={scene} />;
}

/**
 * Bright emissive pylon at the same world position the character should
 * occupy. If you can see this but not the rig, the GLB isn't the problem
 * the camera is — and we'll have something concrete to debug from.
 */
function DebugPylon() {
  return (
    <mesh position={[0, 1.1, 0]}>
      <boxGeometry args={[0.35, 2.2, 0.35]} />
      <meshStandardMaterial
        color="#ff2dd0"
        emissive="#ff2dd0"
        emissiveIntensity={1.4}
        toneMapped={false}
      />
    </mesh>
  );
}

useGLTF.preload(CHAR_URL);

export default Runner;
