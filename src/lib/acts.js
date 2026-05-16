export const NUM_ACTS = 8;

export const ACTS = [
  {
    i: 0,
    key: 'hero',
    copy: "Hi, I'm *Aadit Kedia*. Purdue freshman, *AI + Computer Science*.",
    align: 'center',
    small: 'Scroll to explore',
    photo: 'aadit-headshot.png',
    photoAlt: 'Aadit Kedia',
    photoSize: 'large',
  },
  {
    i: 1,
    key: 'thesis',
    copy: 'Building *tools, agents, and communities* that put builders first.',
    align: 'center',
    small: 'Projects · Experience · CUECF below',
  },
  {
    i: 2,
    key: 'cube',
    copy: 'Currently shipping *BoilerNet* — a network for Purdue founders, alumni, mentors, and investors.',
    align: 'right',
  },
  {
    i: 3,
    key: 'sphere',
    copy: 'Founded *CUECF* in 2023. 7+ environmental restoration projects, 1,500+ volunteer hours, $1,600+ raised.',
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
    copy: 'Always learning, always shipping — *Python, TypeScript, R3F, LLM APIs.*',
    align: 'left',
  },
  {
    i: 6,
    key: 'iconfield',
    copy: '*Projects, papers, prototypes* — the work in motion.',
    align: 'center',
  },
  {
    i: 7,
    key: 'human',
    copy: 'Made by *Aadit*. Scroll up — or jump to my projects, experience, and CUECF below.',
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
