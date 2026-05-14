import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Vite serves the site under /Personalsite/ on Pages, / in dev.
const ASSET = (file) => `${import.meta.env.BASE_URL}${file}`;

const CHAR_URL      = ASSET('char.glb');
const RUNNING_URL   = ASSET('running.glb');
const SLIDE_URL     = ASSET('runtoslide.glb');
const DIVE_URL      = ASSET('runtodive.glb');
const LOOKBACK_URL  = ASSET('lookback.glb');
const RIGHTTURN_URL = ASSET('runningrightturn.glb');

const Runner = React.forwardRef(function Runner(_, groupRef) {
  // Organic side-to-side drift (two summed sines). Drives the chase
  // camera's banking via DroneCamera's `lateralDelta` calculation.
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;
    groupRef.current.position.x =
      Math.sin(t * 0.6) * 1.4 + Math.sin(t * 1.7) * 0.4;
    const driftDx =
      Math.cos(t * 0.6) * 0.6 * 1.4 + Math.cos(t * 1.7) * 1.7 * 0.4;
    groupRef.current.rotation.y = Math.atan2(driftDx, 8) * 0.8;
  });

  return (
    <group ref={groupRef}>
      <Suspense fallback={null}>
        <Rig />
      </Suspense>
    </group>
  );
});

function Rig() {
  // char.glb supplies the skinned mesh + skeleton. The five action GLBs
  // contribute only their AnimationClips — Mixamo's bone names match
  // across exports so the clips bind onto char's rig cleanly.
  const char     = useGLTF(CHAR_URL);
  const runGLB   = useGLTF(RUNNING_URL);
  const slideGLB = useGLTF(SLIDE_URL);
  const diveGLB  = useGLTF(DIVE_URL);
  const lookGLB  = useGLTF(LOOKBACK_URL);
  const turnGLB  = useGLTF(RIGHTTURN_URL);

  const ref = useRef();

  // Pick the longest clip from each source — guards against T-pose
  // clips that some Mixamo exports ship at index 0.
  const clips = useMemo(() => {
    const pickLongest = (anims, name) => {
      if (!anims || anims.length === 0) return null;
      let best = anims[0];
      for (let i = 1; i < anims.length; i++) {
        if (anims[i].duration > best.duration) best = anims[i];
      }
      const c = best.clone();
      c.name = name;
      return c;
    };
    return [
      pickLongest(runGLB.animations,   'run'),
      pickLongest(slideGLB.animations, 'slide'),
      pickLongest(diveGLB.animations,  'dive'),
      pickLongest(lookGLB.animations,  'lookback'),
      pickLongest(turnGLB.animations,  'rightturn'),
    ].filter(Boolean);
  }, [runGLB, slideGLB, diveGLB, lookGLB, turnGLB]);

  const { actions, mixer } = useAnimations(clips, ref);

  // Shadow + culling pass on the character mesh.
  useEffect(() => {
    char.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.frustumCulled = false;
      }
    });
  }, [char]);

  // Deterministic sequence:
  //   dive → run → slide → run → rightturn → run → lookback → run → (loop)
  // The run loop is the connector between every one-shot. When a one-shot
  // finishes we crossfade back to run, hold for RUN_HOLD_MS, then play the
  // next variant in the sequence.
  useEffect(() => {
    Object.values(actions).forEach((a) => {
      if (a) { a.stop(); a.enabled = false; a.setEffectiveWeight(0); }
    });

    const run = actions['run'];
    if (!run) return;

    const sequence = ['dive', 'slide', 'rightturn', 'lookback'];
    const RUN_HOLD_MS = 4200;

    let alive = true;
    let pending = null;
    let idx = 0;
    let activeOneShot = null;

    const startRunLoop = () => {
      run.enabled = true;
      run.setLoop(THREE.LoopRepeat, Infinity);
      run.setEffectiveWeight(1);
      run.setEffectiveTimeScale(0.9);
      run.play();
    };

    const playOneShot = (name) => {
      const next = actions[name];
      if (!next) {
        // Missing clip — skip and advance.
        idx = (idx + 1) % sequence.length;
        pending = setTimeout(() => {
          if (alive) playOneShot(sequence[idx]);
        }, 0);
        return;
      }
      next.enabled = true;
      next.reset();
      next.setLoop(THREE.LoopOnce, 1);
      next.clampWhenFinished = true;
      next.setEffectiveWeight(1);
      next.setEffectiveTimeScale(name === 'lookback' ? 0.9 : 1);
      next.crossFadeFrom(run, 0.25, false);
      next.play();
      activeOneShot = next;
    };

    const onFinished = (e) => {
      if (e.action !== activeOneShot) return;
      const finished = e.action;
      run.enabled = true;
      run.reset();
      run.setEffectiveWeight(1);
      run.crossFadeFrom(finished, 0.25, false);
      run.play();
      setTimeout(() => { finished.stop(); finished.enabled = false; }, 350);
      activeOneShot = null;
      idx = (idx + 1) % sequence.length;
      pending = setTimeout(() => {
        if (alive) playOneShot(sequence[idx]);
      }, RUN_HOLD_MS);
    };

    mixer.addEventListener('finished', onFinished);

    // Prime the rig with run, then immediately transition to dive — the
    // brief run state gives crossFadeFrom a hot action to blend out of.
    startRunLoop();
    pending = setTimeout(() => {
      if (alive) playOneShot(sequence[idx]);
    }, 60);

    return () => {
      alive = false;
      if (pending) clearTimeout(pending);
      mixer.removeEventListener('finished', onFinished);
    };
  }, [actions, mixer]);

  return <primitive ref={ref} object={char.scene} scale={1} />;
}

useGLTF.preload(CHAR_URL);
useGLTF.preload(RUNNING_URL);
useGLTF.preload(SLIDE_URL);
useGLTF.preload(DIVE_URL);
useGLTF.preload(LOOKBACK_URL);
useGLTF.preload(RIGHTTURN_URL);

export default Runner;
