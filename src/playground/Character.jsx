import { useEffect, useMemo, useRef } from 'react';
import { useAnimations, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const ASSET = (file) => `${import.meta.env.BASE_URL}${file}`;

const ANIMATION_URLS = {
  running: ASSET('running.glb'),
  lookback: ASSET('lookback.glb'),
  rightTurn: ASSET('runningrightturn.glb'),
  dive: ASSET('runtodive.glb'),
  slide: ASSET('runtoslide.glb'),
};

// Use one of the Mixamo animation exports as the character source. They each
// ship with both the rigged mesh and a clip, so we get a guaranteed-visible
// model without juggling char.glb (which is an empty/posed export here).
const CHARACTER_URL = ANIMATION_URLS.running;

Object.values(ANIMATION_URLS).forEach((u) => useGLTF.preload(u));

const CROSSFADE = 0.28;
const ONESHOTS = new Set(['dive', 'slide', 'rightTurn', 'lookback']);

export function Character({ animationKey, onAnimationEnd }) {
  const group = useRef(null);
  // useAnimations needs to drive the same skeleton the clips reference, so we
  // use the raw scene rather than a clone — clipping would re-bind the bones
  // and leave the rig stuck in T-pose.
  const { scene } = useGLTF(CHARACTER_URL);

  const running = useGLTF(ANIMATION_URLS.running);
  const lookback = useGLTF(ANIMATION_URLS.lookback);
  const rightTurn = useGLTF(ANIMATION_URLS.rightTurn);
  const dive = useGLTF(ANIMATION_URLS.dive);
  const slide = useGLTF(ANIMATION_URLS.slide);

  const clips = useMemo(() => {
    const out = [];
    const push = (gltf, name) => {
      gltf.animations.forEach((c) => {
        const clone = c.clone();
        clone.name = name;
        out.push(clone);
      });
    };
    push(running, 'running');
    push(lookback, 'lookback');
    push(rightTurn, 'rightTurn');
    push(dive, 'dive');
    push(slide, 'slide');
    return out;
  }, [running, lookback, rightTurn, dive, slide]);

  const { actions, mixer } = useAnimations(clips, group);

  // Auto-fit to ~2.2 world units tall and ground feet on y=0.
  useEffect(() => {
    if (!scene) return;
    scene.position.set(0, 0, 0);
    scene.rotation.set(0, 0, 0);
    scene.scale.setScalar(1);
    scene.updateMatrixWorld(true);

    scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        child.frustumCulled = false;
      }
    });

    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    if (size.y > 0 && Number.isFinite(size.y)) {
      const factor = 2.2 / size.y;
      scene.scale.setScalar(factor);
      scene.updateMatrixWorld(true);
      const grounded = new THREE.Box3().setFromObject(scene);
      scene.position.y = -grounded.min.y;
    }
  }, [scene]);

  useEffect(() => {
    if (!actions || Object.keys(actions).length === 0) return;
    const next = actions[animationKey];
    if (!next) return;

    Object.values(actions).forEach((a) => {
      if (a !== next && a.isRunning()) a.fadeOut(CROSSFADE);
    });

    next.reset();
    if (ONESHOTS.has(animationKey)) {
      next.setLoop(THREE.LoopOnce, 1);
      next.clampWhenFinished = true;
    } else {
      next.setLoop(THREE.LoopRepeat, Infinity);
      next.clampWhenFinished = false;
    }
    next.fadeIn(CROSSFADE).play();
  }, [animationKey, actions]);

  useEffect(() => {
    if (!mixer) return undefined;
    const handler = (e) => {
      const name = e.action?.getClip()?.name;
      if (name && ONESHOTS.has(name)) onAnimationEnd?.(name);
    };
    mixer.addEventListener('finished', handler);
    return () => mixer.removeEventListener('finished', handler);
  }, [mixer, onAnimationEnd]);

  return <primitive ref={group} object={scene} />;
}
