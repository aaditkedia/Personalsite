import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

/**
 * Drone camera — direct port of the BoilerNet locomotive-chase kinematics.
 *
 *   <group ref={cameraGroupRef}>     ← the drone body. Owns position + lookAt.
 *     <PerspectiveCamera>            ← the lens. Owns ONLY the roll.
 *   </group>
 *
 * Why decoupled: the group's lookAt() rebuilds its rotation matrix every
 * frame to point at the runner. If we tried to also apply roll on the
 * same Object3D, lookAt would clobber it next frame and the camera would
 * fight itself. Putting the lens inside the group means the roll lives
 * on a different Object3D — lookAt rotates the parent, roll rolls the
 * child, and the two transforms compose cleanly via the scene graph.
 *
 * The runner stays mostly in place on a "treadmill" of scrolling scenery,
 * so the camera's banking is driven by the runner's organic side-to-side
 * drift (Sine sum in Runner.jsx) rather than a track curve like the
 * BoilerNet train.
 */
const DroneCamera = ({ runnerRef, hudRef }) => {
  const cameraGroupRef = useRef();
  const cameraRef = useRef();
  const currentRoll = useRef(0);
  const { size } = useThree();

  // Signature BoilerNet pursuit offset: behind/in-front of the subject,
  // slightly elevated, slightly to the side. With the runner rotated 180°
  // in Runner.jsx, world -Z is *in front of* the runner's face, so this
  // offset puts the camera ahead of the runner, framing it as the rig
  // charges toward the lens.
  const pursuitOffset = useMemo(() => new THREE.Vector3(-3, 2, -6), []);
  const idealPos = useMemo(() => new THREE.Vector3(), []);
  const targetLookAt = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const runner = runnerRef.current;
    const camGroup = cameraGroupRef.current;
    const cam = cameraRef.current;
    if (!runner || !camGroup || !cam) return;

    const runnerPos = runner.position;

    // 1. Calculate the ideal FPV position relative to the drifting runner.
    idealPos.set(
      runnerPos.x + pursuitOffset.x,
      runnerPos.y + pursuitOffset.y,
      runnerPos.z + pursuitOffset.z
    );

    // 2. The Heavy Lag — 0.05 gives the camera that physical drone weight.
    camGroup.position.lerp(idealPos, 0.05);

    // 3. Aerodynamic Banking. Lateral delta = how far ahead of camera the
    //    runner has drifted in X. As the runner sways, the camera "catches
    //    up" but tilts into the motion — exactly like a chase drone leaning
    //    into a turn.
    const lateralDelta = runnerPos.x - camGroup.position.x;
    const targetRoll = lateralDelta * 0.08;
    currentRoll.current = THREE.MathUtils.lerp(
      currentRoll.current,
      targetRoll,
      0.05
    );
    // Apply roll directly to the lens — NOT to the group. The group's
    // lookAt below will rebuild parent rotation but won't touch this.
    cam.rotation.z = currentRoll.current;

    // 4. Target Lock — look at a point slightly above the runner's origin
    //    and beyond, so the chest sits high-centered in frame.
    targetLookAt.set(runnerPos.x, runnerPos.y + 1.2, runnerPos.z + 5);
    camGroup.lookAt(targetLookAt);

    // HUD readout (FPV drone overlay).
    if (hudRef && hudRef.current) {
      const p = camGroup.position;
      hudRef.current.textContent =
        `X ${p.x.toFixed(2)}  Y ${p.y.toFixed(2)}  Z ${p.z.toFixed(2)}  ` +
        `R ${(currentRoll.current * 180 / Math.PI).toFixed(1)}°  ` +
        `${size.width}x${size.height}`;
    }
  });

  return (
    <group ref={cameraGroupRef}>
      <PerspectiveCamera
        ref={cameraRef}
        makeDefault
        fov={75}
        near={0.1}
        far={220}
        position={[0, 0, 0]}
      />
    </group>
  );
};

export default DroneCamera;
