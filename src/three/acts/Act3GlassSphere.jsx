import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { makeChrome } from '../materials';
import { useActState } from '../useActState';

const chromeMat = makeChrome();
chromeMat.roughness = 0.12;
chromeMat.envMapIntensity = 1.1;

export function Act3GlassSphere({ actIndex }) {
  const ref = useRef(null);
  const { refresh } = useActState(actIndex);

  useFrame((state) => {
    const { local, visible } = refresh();
    if (!ref.current) return;
    if (visible < 0.002) {
      ref.current.visible = false;
      return;
    }
    ref.current.visible = true;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.12 + local * Math.PI * 0.6;
    ref.current.position.y = Math.sin(t * 0.3) * 0.05;
    const s = (0.95 + local * 0.12) * visible;
    ref.current.scale.setScalar(s);
  });

  return (
    <group ref={ref} visible={false}>
      <mesh material={chromeMat}>
        <sphereGeometry args={[1.1, 96, 96]} />
      </mesh>
    </group>
  );
}
