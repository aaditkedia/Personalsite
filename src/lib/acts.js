export const NUM_ACTS = 8;

export const ACTS = [
  {
    i: 0,
    key: 'hero',
    copy: 'Aadit Kedia — building at the intersection of *AI* and *humans*.',
    align: 'left',
    small: 'Scroll to explore',
  },
  {
    i: 1,
    key: 'thesis',
    copy: 'From models to *experiences*. From features to *feeling*.',
    align: 'center',
    small: 'A portfolio in motion',
  },
  {
    i: 2,
    key: 'cube',
    copy: 'Tools, agents, communities — each project a *prototype* of an idea worth shipping.',
    align: 'right',
  },
  {
    i: 3,
    key: 'sphere',
    copy: 'Every system has a *signal*. The work is to find it, then make it move.',
    align: 'right',
  },
  {
    i: 4,
    key: 'ribbons',
    copy: 'Networks for *builders*, not algorithms.',
    align: 'center',
  },
  {
    i: 5,
    key: 'rings',
    copy: 'Where reasoning meets *intuition*, real things get built.',
    align: 'left',
  },
  {
    i: 6,
    key: 'iconfield',
    copy: 'Projects, papers, prototypes — the work in *motion*.',
    align: 'center',
  },
  {
    i: 7,
    key: 'human',
    copy: 'Made by *Aadit*. Keep scrolling.',
    align: 'center',
  },
];

export const clamp01 = (x) => Math.max(0, Math.min(1, x));
export const lerp = (a, b, t) => a + (b - a) * t;

// fade-in 0-0.22, hold, fade-out 0.80-1
export function window01(t) {
  if (t <= 0 || t >= 1) return 0;
  if (t < 0.22) return t / 0.22;
  if (t > 0.8) return (1 - t) / 0.2;
  return 1;
}

export function smoothstep(t) {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}
