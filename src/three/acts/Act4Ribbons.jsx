import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeChrome, makeAccent } from '../materials';
import { useActState } from '../useActState';

const RING_R = 1.05;
const TUBE_R = 0.07;

const chromeA = makeChrome();
const chromeB = makeChrome();
const accent = makeAccent();
accent.color.set('#b78cff');

const tileMat = new THREE.MeshStandardMaterial({
  color: '#0d1322',
  roughness: 0.5,
  metalness: 0.55,
});

export function Act4Ribbons({ actIndex }) {
  const ref = useRef(null);
  const { refresh } = useActState(actIndex);

  const tilePositions = useMemo(() => {
    const out = [];
    const count = 8;
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2;
      const p = new THREE.Vector3(
        Math.cos(a) * RING_R,
        Math.sin(a) * RING_R,
        0
      );
      const r = new THREE.Euler(0, 0, a + Math.PI / 2);
      out.push({ p, r });
    }
    return out;
  }, []);

  useFrame((state) => {
    const { local, visible } = refresh();
    if (!ref.current) return;
    if (visible < 0.002) {
      ref.current.visible = false;
      return;
    }
    ref.current.visible = true;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.4 + local * Math.PI;
    ref.current.rotation.x = Math.sin(t * 0.2) * 0.25 + local * 0.4;
    const s = (0.95 + local * 0.1) * visible;
    ref.current.scale.setScalar(s);
  });

  return (
    <group ref={ref} visible={false}>
      <mesh material={chromeA}>
        <torusGeometry args={[RING_R, TUBE_R, 32, 220]} />
      </mesh>
      <mesh material={chromeB} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[RING_R, TUBE_R, 32, 220]} />
      </mesh>
      <mesh material={accent} rotation={[0, Math.PI / 2.2, 0]}>
        <torusGeometry args={[RING_R, TUBE_R * 0.85, 32, 220]} />
      </mesh>
      <mesh material={chromeA} rotation={[Math.PI / 3, Math.PI / 3, 0]}>
        <torusGeometry args={[RING_R, TUBE_R * 0.85, 32, 220]} />
      </mesh>

      <group>
        {tilePositions.map((t, i) => (
          <mesh key={i} position={t.p} rotation={t.r} material={tileMat}>
            <boxGeometry args={[0.22, 0.22, 0.05]} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
