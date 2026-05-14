import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Cinematic chase camera ported from BoilerNet.
 *
 *   <group>            ← drone body. Position + lookAt live here.
 *     <PerspectiveCamera>  ← lens. Only the Z-roll lives here.
 *
 * Two Object3Ds = lookAt and roll never overwrite each other.
 */
const DroneCamera = ({ runnerRef, hudRef }) => {
  const groupRef = useRef();
  const camRef = useRef();
  const roll = useRef(0);
  const { size } = useThree();

  const offset    = useMemo(() => new THREE.Vector3(-3, 2, -6), []);
  const idealPos  = useMemo(() => new THREE.Vector3(), []);
  const lookAtPt  = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const runner = runnerRef.current;
    const group = groupRef.current;
    const cam = camRef.current;
    if (!runner || !group || !cam) return;

    const r = runner.position;

    // Heavy drone-weight lag toward the chase point.
    idealPos.set(r.x + offset.x, r.y + offset.y, r.z + offset.z);
    group.position.lerp(idealPos, 0.05);

    // Aerodynamic bank — lateral delta between runner and trailing drone
    // body. Smoothed so the roll doesn't twitch.
    const lateralDelta = r.x - group.position.x;
    const targetRoll = lateralDelta * 0.08;
    roll.current = THREE.MathUtils.lerp(roll.current, targetRoll, 0.05);
    cam.rotation.z = roll.current;

    // Look slightly above the runner, beyond — chest sits high-centered.
    lookAtPt.set(r.x, r.y + 1.2, r.z + 5);
    group.lookAt(lookAtPt);

    if (hudRef?.current) {
      const p = group.position;
      hudRef.current.textContent =
        `X ${p.x.toFixed(2)}  Y ${p.y.toFixed(2)}  Z ${p.z.toFixed(2)}  ` +
        `R ${(roll.current * 180 / Math.PI).toFixed(1)}°  ${size.width}x${size.height}`;
    }
  });

  return (
    <group ref={groupRef}>
      <PerspectiveCamera ref={camRef} makeDefault fov={75} near={0.1} far={220} />
    </group>
  );
};

export default DroneCamera;
