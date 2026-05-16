import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import { useActState } from '../useActState';

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
      <RoundedBox args={[1.45, 1.45, 1.45]} radius={0.14} smoothness={5}>
        <MeshTransmissionMaterial
          thickness={0.45}
          roughness={0.28}
          transmission={1}
          ior={1.35}
          chromaticAberration={0.06}
          anisotropy={0.18}
          distortion={0.08}
          distortionScale={0.25}
          temporalDistortion={0.03}
          samples={4}
          resolution={384}
          backside
          color="#c8d4ee"
        />
      </RoundedBox>
    </group>
  );
}
