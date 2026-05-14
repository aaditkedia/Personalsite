import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

// Drone hovers in FRONT of the runner (+Z is in front of the rig now that
// the runner is rotated 180°) and looks BACK at the chest — so the runner
// appears to charge into the lens. Same kinematic family as the BoilerNet
// chase, just framed from ahead.
const idealOffset = new THREE.Vector3(-3, 2.2, 6);
const lookAtTarget = new THREE.Vector3(0, 1.4, 0);
const tmpIdeal = new THREE.Vector3();
const tmpTarget = new THREE.Vector3();

const DroneCamera = ({ runnerRef, hudRef }) => {
  const camRef = useRef();
  const prevTargetX = useRef(0);
  const { size } = useThree();

  useFrame((_, delta) => {
    const cam = camRef.current;
    const runner = runnerRef.current;
    if (!cam || !runner) return;

    tmpIdeal.copy(idealOffset).add(runner.position);

    // Frame-rate-independent critically-damped lerp toward target.
    const lerpAmt = 1 - Math.pow(0.001, delta);
    cam.position.lerp(tmpIdeal, Math.min(lerpAmt * 1.2, 0.25));

    // Look at the runner's chest.
    tmpTarget.copy(lookAtTarget).add(runner.position);
    cam.lookAt(tmpTarget);

    // Banking — roll into the runner's lateral motion. Flipped sign because
    // we're now ahead of the subject, so positive runner drift should roll
    // the camera the opposite way for a natural feel.
    const dx = runner.position.x - prevTargetX.current;
    prevTargetX.current = runner.position.x;
    const targetRoll = THREE.MathUtils.clamp(dx * 8, -0.35, 0.35);
    cam.rotation.z = THREE.MathUtils.lerp(cam.rotation.z, targetRoll, Math.min(lerpAmt * 1.5, 0.3));

    if (hudRef && hudRef.current) {
      hudRef.current.textContent =
        `X ${cam.position.x.toFixed(2)}  Y ${cam.position.y.toFixed(2)}  Z ${cam.position.z.toFixed(2)}  ` +
        `R ${(cam.rotation.z * 180 / Math.PI).toFixed(1)}°  ` +
        `${size.width}x${size.height}`;
    }
  });

  return (
    <PerspectiveCamera
      ref={camRef}
      makeDefault
      fov={50}
      near={0.1}
      far={220}
      position={[-3, 2.2, 6]}
    />
  );
};

export default DroneCamera;
