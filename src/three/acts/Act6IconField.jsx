import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../../lib/useScrollProgress';
import { useActState } from '../useActState';

const COUNT = 16;

const tileMat = new THREE.MeshStandardMaterial({
  color: '#0d1322',
  metalness: 0.45,
  roughness: 0.55,
  transparent: true,
  opacity: 0.95,
});

const accents = ['#7aa7ff', '#9bb8ff', '#b78cff', '#a6c4ff', '#f1f5ff'];

export function Act6IconField({ actIndex }) {
  const ref = useRef(null);
  const inner = useRef(null);
  const { refresh } = useActState(actIndex);

  const tiles = useMemo(() => {
    const f = (v) => v - Math.floor(v);
    return new Array(COUNT).fill(0).map((_, i) => {
      const s = Math.sin(i * 12.9898) * 43758.5453;
      const s2 = Math.sin(i * 7.81) * 21342.123;
      const s3 = Math.sin(i * 3.71) * 99891.13;
      return {
        pos: [
          (f(s) - 0.5) * 4.4,
          (f(s2) - 0.5) * 3.0,
          (f(s3) - 0.5) * 4.0 - 0.5,
        ],
        rot: [f(s) * Math.PI, f(s2) * Math.PI, f(s3) * Math.PI],
        spin: 0.15 + f(s + s2) * 0.4,
        accent: accents[i % accents.length],
      };
    });
  }, []);

  useFrame((_, dt) => {
    const { local, visible } = refresh();
    if (!ref.current) return;
    if (visible < 0.002) {
      ref.current.visible = false;
      return;
    }
    ref.current.visible = true;
    const pointer = useScrollProgress.getState().pointer;

    ref.current.rotation.y = THREE.MathUtils.lerp(
      ref.current.rotation.y,
      pointer.x * 0.35 + local * 0.5,
      0.05
    );
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      pointer.y * 0.18,
      0.05
    );
    ref.current.position.z = local * 3.2 - 0.4;

    if (inner.current) {
      inner.current.children.forEach((child, i) => {
        const tile = tiles[i];
        if (!tile) return;
        child.rotation.x += dt * tile.spin * 0.35;
        child.rotation.y += dt * tile.spin * 0.25;
      });
    }

    const s = (0.95 + local * 0.1) * visible;
    ref.current.scale.setScalar(s);
  });

  return (
    <group ref={ref} visible={false}>
      <group ref={inner}>
        {tiles.map((tile, i) => (
          <group key={i} position={tile.pos} rotation={tile.rot}>
            <mesh material={tileMat}>
              <boxGeometry args={[0.42, 0.42, 0.07]} />
            </mesh>
            <mesh position={[0, 0, 0.036]}>
              <circleGeometry args={[0.13, 24]} />
              <meshBasicMaterial color={tile.accent} transparent opacity={0.78} />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
}
