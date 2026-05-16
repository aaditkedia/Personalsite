import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { Suspense, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { makeChrome } from '../three/materials';
import './PageBackground3D.css';

const chromeMat = makeChrome();
chromeMat.roughness = 0.18;
chromeMat.envMapIntensity = 0.9;

function ChromeKnot({ baseX = 1.6, baseScale = 0.95 }) {
  const ref = useRef(null);
  const { mouse } = useThree();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (!ref.current) return;
    ref.current.rotation.y = t * 0.08;
    ref.current.rotation.x = THREE.MathUtils.lerp(
      ref.current.rotation.x,
      mouse.y * 0.15 + Math.sin(t * 0.2) * 0.08,
      0.04
    );
    ref.current.position.x = THREE.MathUtils.lerp(
      ref.current.position.x,
      baseX + mouse.x * 0.5,
      0.04
    );
    ref.current.position.y = Math.sin(t * 0.25) * 0.12;
  });

  return (
    <mesh ref={ref} material={chromeMat} position={[baseX, 0.2, 0]} scale={baseScale}>
      <torusKnotGeometry args={[0.7, 0.22, 220, 28, 2, 3]} />
    </mesh>
  );
}

export default function PageBackground3D() {
  // Defer mount slightly so route nav doesn't double-init the WebGL context.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const isMobile =
    typeof window !== 'undefined' && window.innerWidth < 680;
  const dpr = isMobile ? [1, 1.3] : [1, 1.6];

  if (!mounted) return null;

  return (
    <div className="page-bg-3d" aria-hidden="true">
      <Canvas
        dpr={dpr}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        camera={{ position: [0, 0, 4], fov: isMobile ? 50 : 42, near: 0.1, far: 30 }}
      >
        <ambientLight intensity={0.22} />
        <directionalLight position={[2, 3, 2]} intensity={0.5} color="#d0dffc" />
        <directionalLight position={[-2, -1, -1]} intensity={0.3} color="#b78cff" />
        <pointLight position={[0, 0, 2]} intensity={0.18} color="#7aa7ff" />

        <Suspense fallback={null}>
          <Environment preset="city" environmentIntensity={0.35} />
          <ChromeKnot baseX={isMobile ? 2.6 : 1.6} baseScale={isMobile ? 0.7 : 0.95} />
        </Suspense>

        <EffectComposer multisampling={0}>
          <Bloom intensity={0.35} luminanceThreshold={0.78} luminanceSmoothing={0.4} mipmapBlur />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
