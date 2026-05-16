import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshTransmissionMaterial } from '@react-three/drei';
import { makeAccent } from '../materials';
import { useActState } from '../useActState';

const accentMat = makeAccent();

export function Act3GlassSphere({ actIndex }) {
  const ref = useRef(null);
  const inner = useRef(null);
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

    if (inner.current) {
      inner.current.rotation.x = t * 0.55;
      inner.current.rotation.y = t * 0.45;
    }
  });

  return (
    <group ref={ref} visible={false}>
      <mesh>
        <sphereGeometry args={[1.1, 96, 96]} />
        <MeshTransmissionMaterial
          thickness={1.0}
          roughness={0.18}
          transmission={1}
          ior={1.45}
          chromaticAberration={0.26}
          anisotropy={0.25}
          distortion={0.15}
          distortionScale={0.35}
          temporalDistortion={0.06}
          samples={5}
          resolution={512}
          backside
          color="#e8efff"
        />
      </mesh>
      <mesh ref={inner} scale={0.42} material={accentMat}>
        <octahedronGeometry args={[1, 0]} />
      </mesh>
    </group>
  );
}
