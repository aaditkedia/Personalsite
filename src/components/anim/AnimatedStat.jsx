import { useEffect, useRef, useState } from 'react';

// Parse "1,500+" → { num: 1500, prefix: '', suffix: '+', formatter: thousands }
// Parse "$1,600+" → { num: 1600, prefix: '$', suffix: '+', formatter: thousands }
// Falls back to printing the raw string for non-numeric values like "Ongoing".
function parse(value) {
  const m = String(value).match(/^(\D*)([\d,.]+)(.*)$/);
  if (!m) return null;
  const numeric = Number(m[2].replace(/,/g, ''));
  if (!Number.isFinite(numeric)) return null;
  const hasComma = m[2].includes(',');
  return {
    prefix: m[1] || '',
    num: numeric,
    suffix: m[3] || '',
    format: (n) => (hasComma ? Math.round(n).toLocaleString() : String(Math.round(n))),
  };
}

export function AnimatedStat({ value, duration = 1.4 }) {
  const ref = useRef(null);
  const [current, setCurrent] = useState(0);
  const parsed = parse(value);

  useEffect(() => {
    if (!parsed) return;
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCurrent(parsed.num);
      return undefined;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 3);
        let rafId;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / (duration * 1000));
          setCurrent(parsed.num * ease(t));
          if (t < 1) {
            rafId = requestAnimationFrame(tick);
          }
        };
        rafId = requestAnimationFrame(tick);
        io.disconnect();
        return () => cancelAnimationFrame(rafId);
      },
      { threshold: 0.45 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, [parsed, duration]);

  if (!parsed) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {parsed.prefix}
      {parsed.format(current)}
      {parsed.suffix}
    </span>
  );
}
