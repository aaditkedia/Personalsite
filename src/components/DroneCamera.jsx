import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

const idealOffset = new THREE.Vector3(-3, 2.2, -5);
const lookAhead = new THREE.Vector3(0, 1.4, 4);
const tmpIdeal = new THREE.Vector3();
const tmpTarget = new THREE.Vector3();

/**
 * FPV drone chase camera. Lerps toward an offset behind/above the runner,
 * banks into lateral motion, and locks onto a point slightly ahead of the
 * runner's chest so the camera reads as physically reacting to the subject.
 */
const DroneCamera = ({ runnerRef, hudRef }) => {
  const camRef = useRef();
  const prevTargetX = useRef(0);
  const { size } = useThree();

  useFrame((_, delta) => {
    const cam = camRef.current;
    const runner = runnerRef.current;
    if (!cam || !runner) return;

    // Compute the world-space ideal position (runner pos + drone offset).
    tmpIdeal.copy(idealOffset).add(runner.position);

    // Heavy cinematic lag — frame-rate-independent damping toward target.
    const lerpAmt = 1 - Math.pow(0.001, delta);
    cam.position.lerp(tmpIdeal, Math.min(lerpAmt * 1.2, 0.25));

    // Look slightly ahead/up of the runner's chest.
    tmpTarget.copy(lookAhead).add(runner.position);
    cam.lookAt(tmpTarget);

    // Aerodynamic banking — roll into the runner's lateral motion.
    const dx = runner.position.x - prevTargetX.current;
    prevTargetX.current = runner.position.x;
    const targetRoll = THREE.MathUtils.clamp(-dx * 8, -0.35, 0.35);
    cam.rotation.z = THREE.MathUtils.lerp(cam.rotation.z, targetRoll, Math.min(lerpAmt * 1.5, 0.3));

    // Update HUD readout (camera position + roll) for the FPV overlay.
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
      fov={55}
      near={0.1}
      far={200}
      position={[-3, 2.2, -5]}
    />
  );
};

export default DroneCamera;
