import * as THREE from 'three';

// Aligned with index.css:
// --primary #7aa7ff, --secondary #b78cff, --bg #050810, --surface #0d1322,
// --text #f1f5ff, --text-muted #8da3c4
export const COLORS = {
  glow: new THREE.Color('#7aa7ff'),
  accent: new THREE.Color('#b78cff'),
  accentDeep: new THREE.Color('#6b4a99'),
  ink: new THREE.Color('#050810'),
  cool: new THREE.Color('#f1f5ff'),
};

export function makeChrome() {
  return new THREE.MeshStandardMaterial({
    color: '#9eb5d8',
    metalness: 1,
    roughness: 0.32,
    envMapIntensity: 0.75,
  });
}

export function makeAccent() {
  return new THREE.MeshStandardMaterial({
    color: COLORS.accent,
    metalness: 1,
    roughness: 0.32,
    emissive: COLORS.accentDeep,
    emissiveIntensity: 0.08,
    envMapIntensity: 0.7,
  });
}

export function makeTileBody() {
  return new THREE.MeshStandardMaterial({
    color: '#0d1322',
    metalness: 0.4,
    roughness: 0.65,
  });
}

export function makeCore() {
  return new THREE.MeshStandardMaterial({
    color: '#7aa7ff',
    emissive: COLORS.glow,
    emissiveIntensity: 0.9,
    metalness: 0.4,
    roughness: 0.35,
  });
}

// Back-compat alias so existing imports of makeCopper keep working.
export const makeCopper = makeAccent;
