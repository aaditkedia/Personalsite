import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { COLORS } from '../materials';
import { useActState } from '../useActState';

export function Act0Hero({ actIndex }) {
  const ref = useRef(null);
  const matRef = useRef(null);
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
    ref.current.rotation.y = t * 0.05;
    ref.current.position.y = Math.sin(t * 0.4) * 0.08;
    ref.current.position.x = Math.cos(t * 0.3) * 0.04;
    if (matRef.current) {
      const pulse = 0.55 + Math.sin(t * 0.6) * 0.08;
      matRef.current.opacity = pulse * visible;
    }
    const s = (1.0 + local * 0.15) * visible;
    ref.current.scale.setScalar(s);
  });

  return (
    <group ref={ref} position={[0, 0, 0]} visible={false}>
      <mesh>
        <sphereGeometry args={[0.95, 64, 64]} />
        <meshBasicMaterial
          ref={matRef}
          color={COLORS.glow}
          transparent
          opacity={0.55}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh scale={2.4}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial
          color={COLORS.glow}
          transparent
          opacity={0.18}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}
