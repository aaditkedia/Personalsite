import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { makeChrome } from '../materials';
import { useActState } from '../useActState';

const chromeMat = makeChrome();
chromeMat.roughness = 0.12;
chromeMat.envMapIntensity = 1.1;

export function Act2GlassCube({ actIndex }) {
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
    ref.current.rotation.x = local * Math.PI * 0.85 + t * 0.06;
    ref.current.rotation.y = local * Math.PI * 1.1 + t * 0.08;
    ref.current.position.x = (local - 0.5) * 0.7;
    ref.current.position.y = Math.sin(t * 0.4 + local * 6) * 0.06;
    const s = (0.9 + local * 0.18) * visible;
    ref.current.scale.setScalar(s);
  });

  return (
    <group ref={ref} visible={false}>
      <RoundedBox args={[1.45, 1.45, 1.45]} radius={0.14} smoothness={5} material={chromeMat} />
    </group>
  );
}
