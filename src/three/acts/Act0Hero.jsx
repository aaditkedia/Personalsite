import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { COLORS } from '../materials';
import { useActState } from '../useActState';

export function Act0Hero({ actIndex }) {
  const ref = useRef(null);
  const matRef = useRef(null);
  const portraitRef = useRef(null);
  const ringRef = useRef(null);
  const { refresh } = useActState(actIndex);

  const tex = useTexture(`${import.meta.env.BASE_URL}aadit-headshot.png`);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;

  useFrame((state) => {
    const { local, visible } = refresh();
    if (!ref.current) return;
    if (visible < 0.002) {
      ref.current.visible = false;
      return;
    }
    ref.current.visible = true;
    const t = state.clock.elapsedTime;

    // Group itself: no Y spin (would rotate the portrait off-axis); just gentle drift.
    ref.current.position.y = Math.sin(t * 0.4) * 0.08;
    ref.current.position.x = Math.cos(t * 0.3) * 0.04;

    if (matRef.current) {
      const pulse = 0.32 + Math.sin(t * 0.6) * 0.06;
      matRef.current.opacity = pulse * visible;
    }

    if (portraitRef.current) {
      // Subtle sway, gentle scale breathing.
      portraitRef.current.rotation.y = Math.sin(t * 0.45) * 0.18;
      portraitRef.current.rotation.x = Math.sin(t * 0.3) * 0.08;
      const bs = 1 + Math.sin(t * 0.7) * 0.025;
      portraitRef.current.scale.setScalar(bs);
    }

    if (ringRef.current) {
      // Counter-rotating accent ring.
      ringRef.current.rotation.z = -t * 0.25;
    }

    const s = (1.0 + local * 0.15) * visible;
    ref.current.scale.setScalar(s);
  });

  return (
    <group ref={ref} position={[0, 0, 0]} visible={false}>
      {/* Outer additive halo (glow), centered behind the portrait. */}
      <mesh position={[0, 0.45, 0]}>
        <sphereGeometry args={[0.95, 64, 64]} />
        <meshBasicMaterial
          ref={matRef}
          color={COLORS.glow}
          transparent
          opacity={0.32}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh position={[0, 0.45, 0]} scale={2.4}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial
          color={COLORS.glow}
          transparent
          opacity={0.09}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Slow counter-rotating accent ring just outside the portrait. */}
      <mesh ref={ringRef} position={[0, 0.45, 0.02]}>
        <ringGeometry args={[0.78, 0.82, 128]} />
        <meshBasicMaterial
          color={COLORS.glow}
          transparent
          opacity={0.65}
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Portrait disk floating above the glow's bright center. */}
      <mesh ref={portraitRef} position={[0, 0.45, 0.05]}>
        <circleGeometry args={[0.75, 128]} />
        <meshBasicMaterial map={tex} toneMapped={false} />
      </mesh>
    </group>
  );
}
