import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useScrollProgress } from '../lib/useScrollProgress';

import { Act0Hero } from './acts/Act0Hero';
import { Act1Thesis } from './acts/Act1Thesis';
import { Act2GlassCube } from './acts/Act2GlassCube';
import { Act3GlassSphere } from './acts/Act3GlassSphere';
import { Act4Ribbons } from './acts/Act4Ribbons';
import { Act5Rings } from './acts/Act5Rings';
import { Act6IconField } from './acts/Act6IconField';
import { Act7ChromeHuman } from './acts/Act7ChromeHuman';

const isMobile =
  typeof window !== 'undefined' && window.innerWidth < 680;
const BASE_Z = isMobile ? 6.8 : 4;

export function Rig() {
  const groupRef = useRef(null);

  useFrame((state) => {
    const p = useScrollProgress.getState().progress;
    const pointer = useScrollProgress.getState().pointer;

    if (groupRef.current) {
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.05,
        0.04
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        pointer.y * 0.03,
        0.04
      );
    }

    state.camera.position.z = BASE_Z + Math.sin(p * Math.PI) * 0.2;
  });

  return (
    <group ref={groupRef}>
      <Act0Hero actIndex={0} />
      <Act1Thesis actIndex={1} />
      <Act2GlassCube actIndex={2} />
      <Act3GlassSphere actIndex={3} />
      <Act4Ribbons actIndex={4} />
      <Act5Rings actIndex={5} />
      <Act6IconField actIndex={6} />
      <Act7ChromeHuman actIndex={7} />
    </group>
  );
}
