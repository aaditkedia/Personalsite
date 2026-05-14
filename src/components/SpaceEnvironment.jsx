import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars } from '@react-three/drei';
import * as THREE from 'three';

const SCROLL_SPEED = 18;
const FIELD_DEPTH = 140;
const FIELD_WIDTH = 70;

/* ----------------------------- Textures ---------------------------------- */

function makeGasGiantTexture(palette) {
  const size = 384;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  palette.forEach((c, i) => grad.addColorStop(i / (palette.length - 1), c));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  for (let band = 0; band < 18; band++) {
    const y = (band / 18) * size;
    ctx.fillStyle = `rgba(0,0,0,${0.07 + Math.random() * 0.12})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    for (let x = 0; x <= size; x += 12) {
      ctx.lineTo(x, y + Math.sin((x / size) * Math.PI * 4 + band) * 5);
    }
    ctx.lineTo(size, y + 14);
    for (let x = size; x >= 0; x -= 12) {
      ctx.lineTo(x, y + 14 + Math.sin((x / size) * Math.PI * 4 + band * 1.3) * 5);
    }
    ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = 'rgba(120, 40, 20, 0.5)';
  ctx.beginPath();
  ctx.ellipse(size * 0.35, size * 0.55, size * 0.08, size * 0.045, 0, 0, Math.PI * 2);
  ctx.fill();
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeRockyPlanetTexture(palette) {
  const size = 384;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = palette[0];
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 140; i++) {
    const r = 6 + Math.random() * 40;
    ctx.fillStyle = palette[1 + Math.floor(Math.random() * (palette.length - 1))];
    ctx.globalAlpha = 0.35 + Math.random() * 0.3;
    ctx.beginPath();
    ctx.arc(Math.random() * size, Math.random() * size, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function makeNebulaTexture() {
  const size = 768;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#04060f';
  ctx.fillRect(0, 0, size, size);
  const colors = [
    'rgba(110, 90, 220, 0.20)',
    'rgba(60, 180, 255, 0.16)',
    'rgba(255, 100, 180, 0.14)',
    'rgba(255, 200, 120, 0.08)',
  ];
  for (let i = 0; i < 20; i++) {
    const x = Math.random() * size, y = Math.random() * size;
    const r = 80 + Math.random() * 240;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, colors[i % colors.length]);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  for (let i = 0; i < 450; i++) {
    ctx.fillStyle = `rgba(255,255,255,${0.4 + Math.random() * 0.6})`;
    ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeNeonGridTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#02040a';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = 'rgba(122, 200, 255, 0.55)';
  ctx.lineWidth = 1.2;
  const cells = 16;
  for (let i = 0; i <= cells; i++) {
    const p = (i / cells) * size;
    ctx.beginPath();
    ctx.moveTo(p, 0); ctx.lineTo(p, size);
    ctx.moveTo(0, p); ctx.lineTo(size, p);
    ctx.stroke();
  }
  const grad = ctx.createLinearGradient(0, 0, 0, size);
  grad.addColorStop(0, 'rgba(122, 200, 255, 0)');
  grad.addColorStop(0.5, 'rgba(122, 200, 255, 0.35)');
  grad.addColorStop(1, 'rgba(122, 200, 255, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(size / 2 - 12, 0, 24, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 18);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/* --------------------------------- Planets ------------------------------- */

const Planet = ({ position, radius, texture, ring = null, emissive = '#000000', spin = 0.04 }) => {
  const meshRef = useRef();
  const ringRef = useRef();
  useFrame((_, dt) => {
    if (meshRef.current) meshRef.current.rotation.y += dt * spin;
    if (ringRef.current) ringRef.current.rotation.z += dt * spin * 0.3;
  });
  return (
    <group position={position}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          map={texture}
          roughness={0.85}
          metalness={0.0}
          emissive={emissive}
          emissiveIntensity={0.08}
        />
      </mesh>
      {ring && (
        <mesh ref={ringRef} rotation={[Math.PI / 2.4, 0, 0]}>
          <ringGeometry args={[radius * ring.inner, radius * ring.outer, 64]} />
          <meshBasicMaterial
            color={ring.color}
            side={THREE.DoubleSide}
            transparent
            opacity={ring.opacity ?? 0.55}
          />
        </mesh>
      )}
      <mesh scale={[radius * 1.18, radius * 1.18, radius * 1.18]}>
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial color={ring?.color || '#7aa7ff'} transparent opacity={0.05} />
      </mesh>
    </group>
  );
};

const Planets = () => {
  const gas    = useMemo(() => makeGasGiantTexture(['#f5c98e', '#d8945a', '#a8602c', '#6d3a18', '#caa07d']), []);
  const ringed = useMemo(() => makeGasGiantTexture(['#dcd5b8', '#b4a87a', '#7b6c44', '#d6c79a']), []);
  const rocky  = useMemo(() => makeRockyPlanetTexture(['#3a4f7a', '#5e87b8', '#2a3a55', '#a8c0db', '#1a2236']), []);
  const mars   = useMemo(() => makeRockyPlanetTexture(['#6b2a18', '#a85530', '#4a1b10', '#c97a4e']), []);

  // Placed in -Z direction (in front of the camera, behind the runner from
  // the camera's viewpoint) so they sit beautifully behind the action.
  return (
    <>
      <Planet position={[-55, 14, -75]} radius={14} texture={gas}    emissive="#3a1c08" spin={0.02} />
      <Planet position={[ 45, 18, -95]} radius={9}  texture={ringed} ring={{ inner: 1.35, outer: 2.1, color: '#d6c79a', opacity: 0.5 }} spin={0.03} />
      <Planet position={[-30,  6, -50]} radius={4.5} texture={rocky} emissive="#0a1b2e" spin={0.06} />
      <Planet position={[ 22,  4, -38]} radius={2.6} texture={mars}  emissive="#1a0904" spin={0.08} />
    </>
  );
};

/* --------------------------- Nebula backdrop ----------------------------- */
/* Two layers:
   - Sky sphere: inverted, encloses the camera so corners are never empty.
     Camera is INSIDE this sphere, so the nebula always fills the FOV.
   - Mid plane: closer parallax detail (subtle rotation).                  */

const NebulaSky = () => {
  const tex = useMemo(() => makeNebulaTexture(), []);
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.y += dt * 0.0025;
  });
  return (
    <mesh ref={ref} renderOrder={-10}>
      <sphereGeometry args={[200, 32, 32]} />
      <meshBasicMaterial
        map={tex}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        toneMapped={false}
      />
    </mesh>
  );
};

const NebulaBackdrop = () => {
  const tex = useMemo(() => makeNebulaTexture(), []);
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += dt * 0.0015;
  });
  return (
    <mesh ref={ref} position={[0, 10, -120]}>
      {/* Wide enough to fully cover a 75°-FOV camera at z=-8 → spans ~167u. */}
      <planeGeometry args={[420, 260]} />
      <meshBasicMaterial map={tex} transparent opacity={0.7} depthWrite={false} fog={false} />
    </mesh>
  );
};

/* ------------------------------ Neon runway ------------------------------ */

const NeonRunway = () => {
  const tex = useMemo(() => makeNeonGridTexture(), []);
  useFrame((_, dt) => {
    // Scroll so the grid appears to fly *into* the camera.
    tex.offset.y += dt * (SCROLL_SPEED / 6);
  });
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -30]} receiveShadow>
        <planeGeometry args={[FIELD_WIDTH, FIELD_DEPTH, 1, 1]} />
        <meshStandardMaterial
          map={tex}
          roughness={0.4}
          metalness={0.6}
          emissive="#1a4a82"
          emissiveMap={tex}
          emissiveIntensity={0.9}
          color="#0a1424"
        />
      </mesh>
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[side * (FIELD_WIDTH / 2 - 1.2), 0.01, -30]}
        >
          <planeGeometry args={[0.4, FIELD_DEPTH]} />
          <meshBasicMaterial color="#7ad9ff" transparent opacity={0.75} />
        </mesh>
      ))}
    </>
  );
};

/* ------------------ Rushing crystal/asteroid debris ---------------------- */
/* Spawns far ahead (-Z) and flies *toward* the camera (+Z). Falls past the
   lens off to the side and recycles back to the far distance.            */

const RushingDebris = ({ count = 70 }) => {
  const meshRef = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const instances = useMemo(() => {
    const arr = [];
    for (let i = 0; i < count; i++) {
      const side = Math.random() > 0.5 ? 1 : -1;
      arr.push({
        x: side * (5 + Math.random() * 28),
        y: 0.5 + Math.random() * 6,
        z: -FIELD_DEPTH + Math.random() * FIELD_DEPTH,
        scale: 0.4 + Math.random() * 1.8,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        spin: (Math.random() - 0.5) * 1.4,
      });
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    for (let i = 0; i < instances.length; i++) {
      const o = instances[i];
      // Move toward camera in +Z.
      o.z += delta * SCROLL_SPEED * (0.7 + (o.scale - 0.4) / 2);
      o.rotY += delta * o.spin;
      if (o.z > 15) {
        o.z -= FIELD_DEPTH + Math.random() * 20;
        const side = Math.random() > 0.5 ? 1 : -1;
        o.x = side * (5 + Math.random() * 28);
        o.y = 0.5 + Math.random() * 6;
        o.scale = 0.4 + Math.random() * 1.8;
      }
      dummy.position.set(o.x, o.y, o.z);
      dummy.rotation.set(o.rotX, o.rotY, o.rotZ);
      dummy.scale.setScalar(o.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} castShadow>
      <octahedronGeometry args={[0.7, 0]} />
      <meshStandardMaterial
        color="#3b4d6e"
        roughness={0.55}
        metalness={0.6}
        emissive="#0a1424"
        emissiveIntensity={0.4}
        flatShading
      />
    </instancedMesh>
  );
};

/* ------------------------------ Cosmic dust ------------------------------ */

const CosmicDust = ({ count = 280 }) => {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * FIELD_WIDTH * 1.1;
      arr[i * 3 + 1] = Math.random() * 12;
      arr[i * 3 + 2] = -FIELD_DEPTH + Math.random() * FIELD_DEPTH;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const arr = ref.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 2] += delta * SCROLL_SPEED * 1.1;
      if (arr[i * 3 + 2] > 15) arr[i * 3 + 2] -= FIELD_DEPTH;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.08}
        color="#cfe1ff"
        transparent
        opacity={0.7}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  );
};

/* --------------------------------- Root ---------------------------------- */

const SpaceEnvironment = () => (
  <>
    {/* Deep-navy exponential fog blends distant geometry into the nebula
        instead of clipping to pure black at the screen edges. */}
    <fogExp2 attach="fog" args={['#080a1a', 0.0085]} />
    <NebulaSky />
    <Stars radius={180} depth={100} count={4500} factor={3} saturation={0} fade speed={0.5} />
    <NebulaBackdrop />
    <Planets />
    <NeonRunway />
    <RushingDebris count={70} />
    <CosmicDust count={280} />
  </>
);

export default SpaceEnvironment;
