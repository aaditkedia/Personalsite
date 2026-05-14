import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Vite serves the site under /Personalsite/ on Pages, / in dev.
const ASSET = (file) => `${import.meta.env.BASE_URL}${file}`;

const URL_RUN   = ASSET('running.glb');
const URL_DIVE  = ASSET('runtodive.glb');
const URL_SLIDE = ASSET('runtoslide.glb');
const URL_TURN  = ASSET('runningrightturn.glb');
const URL_LOOK  = ASSET('lookback.glb');

// dive → run → slide → run → right-turn → run → look-back → run → (loop)
const SEQUENCE = [
  { url: URL_DIVE,  loop: false },
  { url: URL_RUN,   loop: true,  holdMs: 3500 },
  { url: URL_SLIDE, loop: false },
  { url: URL_RUN,   loop: true,  holdMs: 3500 },
  { url: URL_TURN,  loop: false },
  { url: URL_RUN,   loop: true,  holdMs: 3500 },
  { url: URL_LOOK,  loop: false },
  { url: URL_RUN,   loop: true,  holdMs: 3500 },
];

const Runner = React.forwardRef(function Runner(_, groupRef) {
  const [step, setStep] = useState(0);

  // Side-to-side drift on the outer group — drives the chase camera's
  // banking via DroneCamera's lateralDelta read.
  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime();
    groupRef.current.position.x =
      Math.sin(t * 0.6) * 1.4 + Math.sin(t * 1.7) * 0.4;
    const dx = Math.cos(t * 0.6) * 0.6 * 1.4 + Math.cos(t * 1.7) * 1.7 * 0.4;
    groupRef.current.rotation.y = Math.atan2(dx, 8) * 0.8;
  });

  const advance = useCallback(
    () => setStep((s) => (s + 1) % SEQUENCE.length),
    []
  );

  const current = SEQUENCE[step];

  return (
    <group ref={groupRef}>
      <Suspense fallback={null}>
        {/* key={step} forces a clean remount on every sequence advance —
            new mixer, new action, no cross-clip state to drag along. */}
        <Clip key={step} {...current} onDone={advance} />
      </Suspense>
    </group>
  );
});

function Clip({ url, loop, holdMs, onDone }) {
  const ref = useRef();
  const { scene, animations } = useGLTF(url);
  const { actions, mixer } = useAnimations(animations, ref);

  // Pick the longest clip in this file — guards against the T-pose 0-frame
  // clip some Mixamo GLBs ship at index 0.
  const clipName = useMemo(() => {
    if (!animations || animations.length === 0) return null;
    let best = animations[0];
    for (let i = 1; i < animations.length; i++) {
      if (animations[i].duration > best.duration) best = animations[i];
    }
    return best.name;
  }, [animations]);

  // Auto-fit the model: scale so it's ~2 world units tall and drop the
  // feet onto the runway (y=0). Mixamo GLB exports inconsistently come
  // out in cm or m units; computing the box removes the guessing.
  useEffect(() => {
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);
    scene.scale.setScalar(1);
    scene.updateMatrixWorld(true);

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.frustumCulled = false;
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    if (size.y > 0 && Number.isFinite(size.y)) {
      const factor = 2.0 / size.y;
      scene.scale.setScalar(factor);
      scene.updateMatrixWorld(true);
      const grounded = new THREE.Box3().setFromObject(scene);
      scene.position.y = -grounded.min.y;
    }
  }, [scene]);

  // Drive the action, schedule the next step when it ends (one-shot) or
  // after holdMs (looping run).
  useEffect(() => {
    if (!clipName) return;
    const action = actions[clipName];
    if (!action) return;

    action.reset();
    action.setEffectiveWeight(1);

    if (loop) {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.setEffectiveTimeScale(0.9);
      action.play();
      const t = setTimeout(onDone, holdMs);
      return () => { clearTimeout(t); action.stop(); };
    }

    action.setLoop(THREE.LoopOnce, 1);
    action.clampWhenFinished = true;
    action.play();
    const onFinished = () => onDone();
    mixer.addEventListener('finished', onFinished);
    return () => {
      mixer.removeEventListener('finished', onFinished);
      action.stop();
    };
  }, [actions, mixer, clipName, loop, holdMs, onDone]);

  return <primitive ref={ref} object={scene} />;
}

useGLTF.preload(URL_RUN);
useGLTF.preload(URL_DIVE);
useGLTF.preload(URL_SLIDE);
useGLTF.preload(URL_TURN);
useGLTF.preload(URL_LOOK);

export default Runner;
