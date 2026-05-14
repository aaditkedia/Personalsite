import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

// Vite serves the site under /Personalsite/ on Pages, / in dev.
const ASSET = (file) => `${import.meta.env.BASE_URL}${file}`;

const RUNNING_URL   = ASSET('Running.fbx');
const SLIDE_URL     = ASSET('Running%20Slide.fbx');
const DIVE_URL      = ASSET('Run%20To%20Dive.fbx');
const LOOKBACK_URL  = ASSET('Run%20Look%20Back.fbx');
const RIGHTTURN_URL = ASSET('Running%20Right%20Turn.fbx');

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
  // Running.fbx ships a usable Mixamo character mesh AND the run clip.
  // The four variant files contribute only their AnimationClips.
  const base       = useFBX(RUNNING_URL);
  const slideFBX   = useFBX(SLIDE_URL);
  const diveFBX    = useFBX(DIVE_URL);
  const lookFBX    = useFBX(LOOKBACK_URL);
  const turnFBX    = useFBX(RIGHTTURN_URL);

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
      pickLongest(base.animations,     'run'),
      pickLongest(slideFBX.animations, 'slide'),
      pickLongest(diveFBX.animations,  'dive'),
      pickLongest(lookFBX.animations,  'lookback'),
      pickLongest(turnFBX.animations,  'rightturn'),
    ].filter(Boolean);
  }, [base, slideFBX, diveFBX, lookFBX, turnFBX]);

  const { actions, mixer } = useAnimations(clips, ref);

  // Shadow + culling pass.
  useEffect(() => {
    base.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.frustumCulled = false;
      }
    });
  }, [base]);

  // Drive the run loop; schedule random one-shot variants every 18–28s.
  useEffect(() => {
    // Defensive: silence every action before activating run. The mixer
    // can't blend a stale clip onto the rig if no other action is hot.
    Object.values(actions).forEach((a) => {
      if (a) { a.stop(); a.enabled = false; a.setEffectiveWeight(0); }
    });

    const run = actions['run'];
    if (!run) return;
    run.enabled = true;
    run.setLoop(THREE.LoopRepeat, Infinity);
    run.setEffectiveWeight(1);
    run.setEffectiveTimeScale(0.7);
    run.reset().fadeIn(0.4).play();

    const variants = ['slide', 'dive', 'lookback', 'rightturn'].filter((k) => actions[k]);
    let alive = true;
    let pending;
    let oneShot = null;

    const playVariant = (name) => {
      const next = actions[name];
      if (!next) return;
      variants.forEach((k) => {
        if (k !== name && actions[k]) {
          actions[k].stop(); actions[k].enabled = false;
        }
      });
      next.enabled = true;
      next.reset();
      next.setLoop(THREE.LoopOnce, 1);
      next.clampWhenFinished = true;
      next.setEffectiveWeight(1);
      next.setEffectiveTimeScale(name === 'lookback' ? 0.9 : 1);
      next.crossFadeFrom(run, 0.25, false);
      next.play();
      oneShot = next;
    };

    const schedule = () => {
      if (!alive) return;
      pending = setTimeout(() => {
        if (!alive) return;
        playVariant(variants[Math.floor(Math.random() * variants.length)]);
        schedule();
      }, 18000 + Math.random() * 10000);
    };

    const onFinished = (e) => {
      if (e.action !== oneShot) return;
      run.enabled = true;
      run.reset();
      run.setEffectiveWeight(1);
      run.crossFadeFrom(e.action, 0.25, false);
      run.play();
      const dead = e.action;
      setTimeout(() => { dead.stop(); dead.enabled = false; }, 350);
      oneShot = null;
    };

    mixer.addEventListener('finished', onFinished);
    schedule();

    return () => {
      alive = false;
      if (pending) clearTimeout(pending);
      mixer.removeEventListener('finished', onFinished);
    };
  }, [actions, mixer]);

  return <primitive ref={ref} object={base} scale={0.013} />;
}

useFBX.preload(RUNNING_URL);
useFBX.preload(SLIDE_URL);
useFBX.preload(DIVE_URL);
useFBX.preload(LOOKBACK_URL);
useFBX.preload(RIGHTTURN_URL);

export default Runner;
