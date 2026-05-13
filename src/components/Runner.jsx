import React, { Suspense, useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Runner — outer group is the *stable chase target* for the drone camera.
 * The Sine-wave drift lives on the outer group, so the camera keeps tracking
 * the same Object3D the whole time, regardless of which clip is currently
 * playing on the rig (idle run, slide, dive, right turn, look-back).
 *
 * Five Mixamo FBX files live in /public:
 *   - Running.fbx           (base loop — always playing)
 *   - Running Slide.fbx     (one-shot side dodge)
 *   - Run To Dive.fbx       (one-shot forward dive)
 *   - Run Look Back.fbx     (one-shot glance over shoulder)
 *   - Running Right Turn.fbx(one-shot lateral swing)
 *
 * Only Running.fbx contributes geometry; the rest are loaded purely to lift
 * their AnimationClips and register them on the base rig's AnimationMixer.
 * Mixamo skeletons share bone names, so a clip from any FBX retargets cleanly.
 */

const VARIANT_FILES = [
  { key: 'slide',     url: '/Running%20Slide.fbx' },
  { key: 'dive',      url: '/Run%20To%20Dive.fbx' },
  { key: 'lookback',  url: '/Run%20Look%20Back.fbx' },
  { key: 'rightturn', url: '/Running%20Right%20Turn.fbx' },
];

const Runner = React.forwardRef(function Runner(_, groupRef) {
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (!groupRef.current) return;
    // Lateral drift — two summed sines so the path doesn't feel periodic.
    groupRef.current.position.x =
      Math.sin(t * 0.6) * 1.4 + Math.sin(t * 1.7) * 0.4;

    const driftDx =
      Math.cos(t * 0.6) * 0.6 * 1.4 + Math.cos(t * 1.7) * 1.7 * 0.4;
    groupRef.current.rotation.y = Math.atan2(driftDx, 8) * 0.8;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <FBXErrorBoundary fallback={<PlaceholderBody />}>
        <Suspense fallback={<PlaceholderBody />}>
          <FBXBody />
        </Suspense>
      </FBXErrorBoundary>
    </group>
  );
});

function FBXBody() {
  // Base rig — this is what we render.
  const base = useFBX('/Running.fbx');

  // Load each variant file just for its animation clips. Cached by URL.
  const slide     = useFBX(VARIANT_FILES[0].url);
  const dive      = useFBX(VARIANT_FILES[1].url);
  const lookback  = useFBX(VARIANT_FILES[2].url);
  const rightturn = useFBX(VARIANT_FILES[3].url);

  const innerRef = useRef();

  // Build a single labelled clip list. Clone so we don't mutate the cached
  // AnimationClip objects (which other components could share via HMR).
  const clips = useMemo(() => {
    const out = [];
    const add = (sourceClips, name) => {
      if (!sourceClips || sourceClips.length === 0) return;
      const c = sourceClips[0].clone();
      c.name = name;
      out.push(c);
    };
    add(base.animations, 'run');
    add(slide.animations, 'slide');
    add(dive.animations, 'dive');
    add(lookback.animations, 'lookback');
    add(rightturn.animations, 'rightturn');
    return out;
  }, [base, slide, dive, lookback, rightturn]);

  const { actions, mixer } = useAnimations(clips, innerRef);

  // Material + shadow pass on the base mesh.
  useEffect(() => {
    base.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = false;
        child.frustumCulled = false; // skinned meshes can mis-cull
        if (child.material) {
          child.material.metalness = 0.15;
          child.material.roughness = 0.65;
          child.material.envMapIntensity = 1.0;
        }
      }
    });
  }, [base]);

  // Start the base run loop, then schedule random one-shot variants.
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
      // 6–11 seconds between flourishes.
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
        // Crossfade back to the base run loop.
        const run = actions['run'];
        if (run) {
          run.reset();
          run.setEffectiveWeight(1.0);
          run.crossFadeFrom(e.action, 0.25, false);
          run.play();
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

  // Mixamo exports in centimetres — 0.013 ≈ human scale in our 1u=1m world.
  return (
    <primitive
      ref={innerRef}
      object={base}
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
    console.warn('[Runner] FBX failed to load — using placeholder:', err?.message || err);
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

// Preload all clips so the Suspense barrier resolves in one flight.
try {
  useFBX.preload('/Running.fbx');
  VARIANT_FILES.forEach((v) => useFBX.preload(v.url));
} catch (_) { /* noop */ }

export default Runner;
