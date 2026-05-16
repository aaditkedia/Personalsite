import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '../../lib/smoothScroll';

function parseBold(input) {
  return input.replace(/\*([^*]+)\*/g, '<b>$1</b>');
}

export function RevealText({ children, delay = 0, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    if (prefersReduced) {
      gsap.set(el, { yPercent: 0, opacity: 1, filter: 'blur(0px)' });
      return undefined;
    }

    gsap.set(el, { yPercent: 30, opacity: 0, filter: 'blur(12px)' });
    const tween = gsap.to(el, {
      yPercent: 0,
      opacity: 1,
      filter: 'blur(0px)',
      duration: 1.1,
      ease: 'power3.out',
      delay,
      scrollTrigger: {
        trigger: el,
        start: 'top 92%',
        once: true,
      },
    });

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [delay]);

  if (typeof children === 'string') {
    return (
      <span
        ref={ref}
        className={`scroll-reveal ${className}`}
        dangerouslySetInnerHTML={{ __html: parseBold(children) }}
      />
    );
  }

  return (
    <span ref={ref} className={`scroll-reveal ${className}`}>
      {children}
    </span>
  );
}
