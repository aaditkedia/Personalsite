import { useEffect, useMemo, useRef, useState } from 'react';

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
  // Memoize so the effect deps don't change identity every render — that
  // was causing the IntersectionObserver to tear down and re-fire the
  // count-up infinitely.
  const parsed = useMemo(() => parse(value), [value]);
  const [current, setCurrent] = useState(parsed ? 0 : null);

  useEffect(() => {
    if (!parsed) return undefined;
    const node = ref.current;
    if (!node) return undefined;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCurrent(parsed.num);
      return undefined;
    }

    let rafId;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const ease = (t) => 1 - Math.pow(1 - t, 3);
        const tick = (now) => {
          const t = Math.min(1, (now - start) / (duration * 1000));
          setCurrent(parsed.num * ease(t));
          if (t < 1) {
            rafId = requestAnimationFrame(tick);
          }
        };
        rafId = requestAnimationFrame(tick);
      },
      { threshold: 0.45 }
    );
    io.observe(node);

    return () => {
      io.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [parsed, duration]);

  if (!parsed) {
    return <span ref={ref}>{value}</span>;
  }

  return (
    <span ref={ref}>
      {parsed.prefix}
      {parsed.format(current ?? 0)}
      {parsed.suffix}
    </span>
  );
}
