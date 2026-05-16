import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeChrome } from '../materials';
import { useActState } from '../useActState';

const PARTICLE_COUNT = 2600;

const chrome = makeChrome();
chrome.color.set('#d0dffc');
chrome.roughness = 0.22;
chrome.metalness = 1;

export function Act7ChromeHuman({ actIndex }) {
  const ref = useRef(null);
  const bust = useRef(null);
  const { refresh } = useActState(actIndex);

  const { positions, velocities, baseOffset } = useMemo(() => {
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const baseOffset = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 0.08 * Math.random();
      const ox = r * Math.sin(phi) * Math.cos(theta);
      const oy = r * Math.sin(phi) * Math.sin(theta) + 0.6;
      const oz = r * Math.cos(phi);
      positions[i * 3] = ox;
      positions[i * 3 + 1] = oy;
      positions[i * 3 + 2] = oz;
      baseOffset[i * 3] = ox;
      baseOffset[i * 3 + 1] = oy;
      baseOffset[i * 3 + 2] = oz;

      const speed = 0.6 + Math.random() * 1.5;
      velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed + 0.7;
      velocities[i * 3 + 2] = Math.cos(phi) * speed;
    }
    return { positions, velocities, baseOffset };
  }, []);

  const particleGeom = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return g;
  }, [positions]);

  const particleMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        color: '#7aa7ff',
        size: 0.024,
        transparent: true,
        opacity: 0.85,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      }),
    []
  );

  useFrame((state) => {
    const { local, visible } = refresh();
    if (!ref.current) return;
    if (visible < 0.002) {
      ref.current.visible = false;
      return;
    }
    ref.current.visible = true;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.18 + local * Math.PI * 0.6;
    const s = (0.95 + local * 0.1) * visible;
    ref.current.scale.setScalar(s);

    if (bust.current) {
      bust.current.rotation.y = -t * 0.06;
    }

    const life = Math.pow(Math.max(0.001, local), 1.4);
    const pos = particleGeom.attributes.position.array;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ix = i * 3;
      pos[ix] = baseOffset[ix] + velocities[ix] * life * 1.1;
      pos[ix + 1] = baseOffset[ix + 1] + velocities[ix + 1] * life * 1.05;
      pos[ix + 2] = baseOffset[ix + 2] + velocities[ix + 2] * life * 1.1;
    }
    particleGeom.attributes.position.needsUpdate = true;
    particleMat.opacity = Math.max(0, 0.95 - life * 0.85) * visible;
  });

  return (
    <group ref={ref} visible={false}>
      <mesh ref={bust} position={[0, 0.1, 0]} material={chrome}>
        <torusKnotGeometry args={[0.55, 0.18, 220, 28, 2, 3]} />
      </mesh>
      <points geometry={particleGeom} material={particleMat} />
    </group>
  );
}
