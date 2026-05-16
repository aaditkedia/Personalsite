import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { makeChrome, makeCore } from '../materials';
import { useActState } from '../useActState';

const ringMat = makeChrome();
ringMat.roughness = 0.2;
const coreMat = makeCore();

export function Act5Rings({ actIndex }) {
  const ref = useRef(null);
  const rings = useRef(null);
  const core = useRef(null);
  const { refresh } = useActState(actIndex);

  useFrame((state, dt) => {
    const { local, visible } = refresh();
    if (!ref.current) return;
    if (visible < 0.002) {
      ref.current.visible = false;
      return;
    }
    ref.current.visible = true;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = local * Math.PI * 0.4 + t * 0.04;
    const s = (0.95 + local * 0.12) * visible;
    ref.current.scale.setScalar(s);

    if (rings.current) {
      rings.current.children.forEach((ring, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        ring.rotation.x += dt * (0.15 + i * 0.12) * dir;
        ring.rotation.y += dt * (0.08 + i * 0.08) * dir;
      });
    }
    if (core.current) {
      core.current.rotation.x = t * 0.6;
      core.current.rotation.y = t * 0.5;
    }
  });

  const radii = [0.85, 1.15, 1.45, 1.78];

  return (
    <group ref={ref} visible={false}>
      <group ref={rings}>
        {radii.map((r, i) => (
          <mesh
            key={i}
            material={ringMat}
            rotation={[i * 0.3, i * 0.5, i * 0.2]}
          >
            <torusGeometry args={[r, 0.022, 12, 200]} />
          </mesh>
        ))}
      </group>
      <mesh ref={core} scale={0.45} material={coreMat}>
        <octahedronGeometry args={[1, 0]} />
      </mesh>
    </group>
  );
}
