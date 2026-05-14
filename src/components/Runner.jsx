import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Runner.
 *
 * Visual rig priority:
 *   1. `/character.fbx`  — preferred if present + loadable.
 *   2. `/Running.fbx`    — fallback. Ships a Mixamo character mesh and
 *                          works regardless of what character.fbx is.
 *
 * Why the fallback: Three's FBXLoader only accepts FBX 7.0+ binary files.
 * If `character.fbx` is an older format (FBX 6100, etc.) the load throws
 * and the ErrorBoundary swaps to the Running-based rig so the scene
 * always has a real humanoid runner — never the procedural placeholder.
 *
 * Animations: the five Running/Run/Slide/Dive/LookBack/RightTurn clips
 * retarget onto whichever rig wins (Mixamo bone names match across all
 * files), driven through a single useAnimations mixer.
 *
 * All URLs go through `import.meta.env.BASE_URL` so they resolve under
 * the GitHub Pages sub-path (/Personalsite/) in production.
 */
const ASSET = (file) => `${import.meta.env.BASE_URL}${file}`;

const CHARACTER_URL = ASSET('character.fbx');
const RUNNING_URL   = ASSET('Running.fbx');

const ANIMATION_SOURCES = [
  { key: 'run',       url: RUNNING_URL },
  { key: 'slide',     url: ASSET('Running%20Slide.fbx') },
  { key: 'dive',      url: ASSET('Run%20To%20Dive.fbx') },
  { key: 'lookback',  url: ASSET('Run%20Look%20Back.fbx') },
  { key: 'rightturn', url: ASSET('Running%20Right%20Turn.fbx') },
];

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

  const fallback = (
    <Suspense fallback={<PlaceholderBody />}>
      <FBXBody characterUrl={RUNNING_URL} />
    </Suspense>
  );

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, Math.PI, 0]}>
      <FBXErrorBoundary fallback={fallback}>
        <Suspense fallback={<PlaceholderBody />}>
          <FBXBody characterUrl={CHARACTER_URL} />
        </Suspense>
      </FBXErrorBoundary>
    </group>
  );
});

function FBXBody({ characterUrl }) {
  const character = useFBX(characterUrl);

  // Load each clip source. When characterUrl IS Running.fbx (the fallback
  // path), useFBX returns the *same cached scene* for both — that's fine,
  // we still clone the AnimationClips before binding them to the mixer.
  const runFBX       = useFBX(ANIMATION_SOURCES[0].url);
  const slideFBX     = useFBX(ANIMATION_SOURCES[1].url);
  const diveFBX      = useFBX(ANIMATION_SOURCES[2].url);
  const lookbackFBX  = useFBX(ANIMATION_SOURCES[3].url);
  const rightturnFBX = useFBX(ANIMATION_SOURCES[4].url);

  const innerRef = useRef();

  const clips = useMemo(() => {
    const out = [];
    const add = (src, name) => {
      if (!src || src.length === 0) return;
      const c = src[0].clone();
      c.name = name;
      out.push(c);
    };
    add(runFBX.animations,       'run');
    add(slideFBX.animations,     'slide');
    add(diveFBX.animations,      'dive');
    add(lookbackFBX.animations,  'lookback');
    add(rightturnFBX.animations, 'rightturn');
    return out;
  }, [runFBX, slideFBX, diveFBX, lookbackFBX, rightturnFBX]);

  const { actions, mixer } = useAnimations(clips, innerRef);

  useEffect(() => {
    character.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = false;
        child.frustumCulled = false;
        const m = child.material;
        if (m && m.isMeshStandardMaterial) {
          m.roughness = 0.7;
          m.metalness = 0.15;
          m.envMapIntensity = 1.0;
          m.needsUpdate = true;
        } else if (m && m.isMeshPhongMaterial) {
          m.shininess = 30;
          m.specular = new THREE.Color('#222a3a');
          m.needsUpdate = true;
        }
      }
    });
  }, [character]);

  useEffect(() => {
    const run = actions['run'];
    if (!run) return;
    run.reset().fadeIn(0.4).play();
    run.setEffectiveTimeScale(1.05);

    const variantKeys = ['slide', 'dive', 'lookback', 'rightturn'].filter(
      (k) => !!actions[k]
    );

    let alive = true;
    let pendingTimeout;
    let currentOneShot = null;

    const playVariant = (name) => {
      const next = actions[name];
      const cur = actions['run'];
      if (!next || !cur) return;
      next.reset();
      next.setLoop(THREE.LoopOnce, 1);
      next.clampWhenFinished = false;
      next.enabled = true;
      next.setEffectiveTimeScale(name === 'lookback' ? 0.9 : 1.0);
      next.setEffectiveWeight(1.0);
      next.crossFadeFrom(cur, 0.25, false);
      next.play();
      currentOneShot = next;
    };

    const scheduleNext = () => {
      if (!alive) return;
      const delay = 6000 + Math.random() * 5000;
      pendingTimeout = setTimeout(() => {
        if (!alive) return;
        const pick = variantKeys[Math.floor(Math.random() * variantKeys.length)];
        if (pick) playVariant(pick);
        scheduleNext();
      }, delay);
    };

    const onFinished = (e) => {
      if (e.action === currentOneShot) {
        const r = actions['run'];
        if (r) {
          r.reset();
          r.setEffectiveWeight(1.0);
          r.crossFadeFrom(e.action, 0.25, false);
          r.play();
        }
        currentOneShot = null;
      }
    };

    mixer.addEventListener('finished', onFinished);
    scheduleNext();

    return () => {
      alive = false;
      if (pendingTimeout) clearTimeout(pendingTimeout);
      mixer.removeEventListener('finished', onFinished);
    };
  }, [actions, mixer]);

  return (
    <primitive
      ref={innerRef}
      object={character}
      scale={0.013}
      position={[0, 0, 0]}
    />
  );
}

class FBXErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { errored: false };
  }
  static getDerivedStateFromError() {
    return { errored: true };
  }
  componentDidCatch(err) {
    // eslint-disable-next-line no-console
    console.warn(
      '[Runner] character.fbx unloadable — falling back to Running.fbx rig.',
      err?.message || err
    );
  }
  render() {
    if (this.state.errored) return this.props.fallback;
    return this.props.children;
  }
}

function PlaceholderBody() {
  const torso = useRef();
  const lLeg = useRef();
  const rLeg = useRef();
  const lArm = useRef();
  const rArm = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const stride = t * 6;
    if (torso.current) torso.current.position.y = 1.0 + Math.abs(Math.sin(stride)) * 0.12;
    const sw = Math.sin(stride);
    if (lLeg.current) lLeg.current.rotation.x = sw * 0.9;
    if (rLeg.current) rLeg.current.rotation.x = -sw * 0.9;
    if (lArm.current) lArm.current.rotation.x = -sw * 0.7;
    if (rArm.current) rArm.current.rotation.x = sw * 0.7;
  });

  return (
    <group ref={torso} position={[0, 1, 0]}>
      <mesh castShadow>
        <capsuleGeometry args={[0.22, 0.5, 6, 12]} />
        <meshStandardMaterial color="#c9d6ff" roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.17, 16, 16]} />
        <meshStandardMaterial color="#f3e6c2" roughness={0.6} />
      </mesh>
      <group ref={lArm} position={[-0.28, 0.25, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.45, 4, 8]} />
          <meshStandardMaterial color="#c9d6ff" roughness={0.5} />
        </mesh>
      </group>
      <group ref={rArm} position={[0.28, 0.25, 0]}>
        <mesh position={[0, -0.3, 0]} castShadow>
          <capsuleGeometry args={[0.07, 0.45, 4, 8]} />
          <meshStandardMaterial color="#c9d6ff" roughness={0.5} />
        </mesh>
      </group>
      <group ref={lLeg} position={[-0.12, -0.3, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.55, 4, 8]} />
          <meshStandardMaterial color="#1f2937" roughness={0.7} />
        </mesh>
      </group>
      <group ref={rLeg} position={[0.12, -0.3, 0]}>
        <mesh position={[0, -0.4, 0]} castShadow>
          <capsuleGeometry args={[0.09, 0.55, 4, 8]} />
          <meshStandardMaterial color="#1f2937" roughness={0.7} />
        </mesh>
      </group>
    </group>
  );
}

try {
  useFBX.preload(CHARACTER_URL);
  useFBX.preload(RUNNING_URL);
  ANIMATION_SOURCES.forEach((s) => useFBX.preload(s.url));
} catch (_) { /* noop */ }

export default Runner;
