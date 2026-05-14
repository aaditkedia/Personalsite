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
  // char.glb = skinned mesh + skeleton. The five action GLBs contribute
  // only AnimationClips.
  const charGLB  = useGLTF(CHAR_URL);
  const runGLB   = useGLTF(RUNNING_URL);
  const slideGLB = useGLTF(SLIDE_URL);
  const diveGLB  = useGLTF(DIVE_URL);
  const lookGLB  = useGLTF(LOOKBACK_URL);
  const turnGLB  = useGLTF(RIGHTTURN_URL);

  const ref = useRef();
  const charScene = charGLB.scene;

  // FBX→GLB converters strip the ':' from Mixamo bone names on the skeleton
  // (`mixamorigHips`) but leave animation tracks referencing the original
  // (`mixamorig:Hips`). When that happens, useAnimations binds zero tracks
  // and the rig stays in T-pose. Detect what naming the rig uses and
  // rewrite clip track names to match.
  const sceneNaming = useMemo(() => {
    let colon = false, noColon = false;
    charScene.traverse((n) => {
      if (!n.name) return;
      if (n.name.startsWith('mixamorig:')) colon = true;
      else if (/^mixamorig[A-Z]/.test(n.name)) noColon = true;
    });
    return colon ? 'colon' : (noColon ? 'nocolon' : 'unknown');
  }, [charScene]);

  const clips = useMemo(() => {
    const pickLongest = (anims) => {
      if (!anims || anims.length === 0) return null;
      let best = anims[0];
      for (let i = 1; i < anims.length; i++) {
        if (anims[i].duration > best.duration) best = anims[i];
      }
      return best;
    };

    const adapt = (clip, name) => {
      if (!clip) return null;
      const c = clip.clone();
      c.name = name;
      c.tracks = c.tracks.map((t) => {
        const tt = t.clone();
        if (sceneNaming === 'nocolon') {
          tt.name = tt.name.replace('mixamorig:', 'mixamorig');
        } else if (sceneNaming === 'colon') {
          tt.name = tt.name.replace(/^mixamorig(?!:)/, 'mixamorig:');
        }
        return tt;
      });
      return c;
    };

    return [
      adapt(pickLongest(runGLB.animations),   'run'),
      adapt(pickLongest(slideGLB.animations), 'slide'),
      adapt(pickLongest(diveGLB.animations),  'dive'),
      adapt(pickLongest(lookGLB.animations),  'lookback'),
      adapt(pickLongest(turnGLB.animations),  'rightturn'),
    ].filter(Boolean);
  }, [runGLB, slideGLB, diveGLB, lookGLB, turnGLB, sceneNaming]);

  const { actions, mixer } = useAnimations(clips, ref);

  // Auto-scale the rig to a known world height and drop its feet to Y=0.
  // We can't trust a fixed scale constant: different Mixamo GLB export
  // pipelines emit cm-unit (×180) and m-unit (×1.8) characters, and a
  // wrong guess either hides the rig (too small) or swallows the camera
  // (too big — exactly what we hit at scale=1).
  useEffect(() => {
    charScene.position.set(0, 0, 0);
    charScene.scale.setScalar(1);
    charScene.updateMatrixWorld(true);
    charScene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.frustumCulled = false;
        if (child.geometry) {
          child.geometry.computeBoundingBox();
          child.geometry.computeBoundingSphere();
        }
      }
    });

    const box = new THREE.Box3().setFromObject(charScene);
    const size = box.getSize(new THREE.Vector3());
    const TARGET_HEIGHT = 2.4;
    if (size.y > 0 && Number.isFinite(size.y)) {
      const factor = TARGET_HEIGHT / size.y;
      charScene.scale.setScalar(factor);
      charScene.updateMatrixWorld(true);
      const box2 = new THREE.Box3().setFromObject(charScene);
      // Feet sit on the neon runway (y=0).
      charScene.position.y = -box2.min.y;
    }
  }, [charScene]);

  // Deterministic sequence:
  //   dive → run → slide → run → rightturn → run → lookback → run → (loop)
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
        idx = (idx + 1) % sequence.length;
        pending = setTimeout(() => { if (alive) playOneShot(sequence[idx]); }, 0);
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
      pending = setTimeout(() => { if (alive) playOneShot(sequence[idx]); }, RUN_HOLD_MS);
    };

    mixer.addEventListener('finished', onFinished);
    startRunLoop();
    pending = setTimeout(() => { if (alive) playOneShot(sequence[idx]); }, 60);

    return () => {
      alive = false;
      if (pending) clearTimeout(pending);
      mixer.removeEventListener('finished', onFinished);
    };
  }, [actions, mixer]);

  return <primitive ref={ref} object={charScene} />;
}

useGLTF.preload(CHAR_URL);
useGLTF.preload(RUNNING_URL);
useGLTF.preload(SLIDE_URL);
useGLTF.preload(DIVE_URL);
useGLTF.preload(LOOKBACK_URL);
useGLTF.preload(RIGHTTURN_URL);

export default Runner;
