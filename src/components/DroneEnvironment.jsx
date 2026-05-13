import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SCROLL_SPEED = 14;
const FIELD_DEPTH = 140;
const FIELD_WIDTH = 60;

/** Procedural checkered/grid trail texture so motion is legible. */
function makeTrailTexture() {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0a0f17';
  ctx.fillRect(0, 0, size, size);

  // Subtle horizontal lane stripes.
  ctx.fillStyle = '#10202b';
  for (let i = 0; i < 4; i++) {
    ctx.fillRect(0, (size / 4) * i, size, 2);
  }
  // Dashed center line.
  ctx.fillStyle = '#3b82f6';
  ctx.globalAlpha = 0.35;
  for (let y = 0; y < size; y += 32) {
    ctx.fillRect(size / 2 - 1, y, 2, 16);
  }
  ctx.globalAlpha = 1;

  // Speckle / grit.
  for (let i = 0; i < 400; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const v = 20 + Math.floor(Math.random() * 30);
    ctx.fillStyle = `rgb(${v},${v + 4},${v + 10})`;
    ctx.fillRect(x, y, 1, 1);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 40);
  tex.anisotropy = 8;
  return tex;
}

const ScrollingGround = () => {
  const matRef = useRef();
  const texture = useMemo(() => makeTrailTexture(), []);

  useFrame((_, delta) => {
    if (matRef.current) {
      texture.offset.y -= delta * (SCROLL_SPEED / 6);
    }
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 30]} receiveShadow>
      <planeGeometry args={[FIELD_WIDTH, FIELD_DEPTH, 1, 1]} />
      <meshStandardMaterial
        ref={matRef}
        map={texture}
        roughness={0.95}
        metalness={0.05}
        color="#1b2330"
      />
    </mesh>
  );
};

/**
 * Instanced low-poly monoliths/trees rushing past. Each instance respawns at
 * the far end of the field when it crosses the camera, giving an infinite trail.
 */
const RushingScenery = ({ count = 80 }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const instances = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      arr.push({
        x: side * (4 + Math.random() * 22),
        y: 0,
        z: (Math.random() * FIELD_DEPTH) - 20,
        scale: 0.6 + Math.random() * 2.6,
        rotY: Math.random() * Math.PI * 2,
        tilt: (Math.random() - 0.5) * 0.2,
      });
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < instances.length; i++) {
      const o = instances[i];
      o.z -= delta * SCROLL_SPEED;
      if (o.z < -20) {
        // Recycle to the far end with a fresh lateral offset.
        o.z += FIELD_DEPTH;
        const side = Math.random() > 0.5 ? 1 : -1;
        o.x = side * (4 + Math.random() * 22);
        o.scale = 0.6 + Math.random() * 2.6;
        o.rotY = Math.random() * Math.PI * 2;
      }
      dummy.position.set(o.x, o.y + o.scale * 0.5, o.z);
      dummy.rotation.set(o.tilt, o.rotY, 0);
      dummy.scale.set(o.scale, o.scale * (1.4 + Math.random() * 0.02), o.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} castShadow receiveShadow>
      <coneGeometry args={[0.8, 1.6, 5]} />
      <meshStandardMaterial color="#243245" roughness={0.8} metalness={0.1} flatShading />
    </instancedMesh>
  );
};

/** Drifting low fog volume (just particles) to push atmospheric depth. */
const MistParticles = ({ count = 350 }) => {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * FIELD_WIDTH;
      arr[i * 3 + 1] = Math.random() * 4 + 0.2;
      arr[i * 3 + 2] = Math.random() * FIELD_DEPTH - 20;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] -= delta * SCROLL_SPEED * 0.7;
      if (arr[i * 3 + 2] < -20) arr[i * 3 + 2] += FIELD_DEPTH;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        color="#9bb8ff"
        transparent
        opacity={0.18}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

const DroneEnvironment = () => (
  <>
    <ScrollingGround />
    <RushingScenery count={90} />
    <MistParticles count={400} />
  </>
);

export default DroneEnvironment;
