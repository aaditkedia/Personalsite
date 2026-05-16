import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

const SPRING = { stiffness: 220, damping: 22, mass: 0.4 };

// Mouse-tracked 3D perspective tilt. Wrap a card to give it that
// "premium product page" depth feel without any WebGL.
export function Tilt3D({
  children,
  max = 8,
  scale = 1.015,
  className = '',
  perspective = 900,
  shine = true,
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, SPRING);
  const sy = useSpring(y, SPRING);

  // -1..1 to deg. We flip sy → rotateX so moving the cursor up tilts the card
  // back toward you (standard product-page convention).
  const rotateX = useTransform(sy, [-1, 1], [max, -max]);
  const rotateY = useTransform(sx, [-1, 1], [-max, max]);

  // Light sheen that follows the cursor across the card.
  const shineX = useTransform(sx, [-1, 1], ['0%', '100%']);
  const shineY = useTransform(sy, [-1, 1], ['0%', '100%']);

  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    x.set(px * 2 - 1);
    y.set(py * 2 - 1);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={`tilt3d ${className}`.trim()}
      style={{
        perspective,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
          willChange: 'transform',
        }}
        whileHover={{ scale }}
        transition={{ scale: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
      >
        {children}
        {shine && (
          <motion.div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              borderRadius: 'inherit',
              background: useTransform(
                [shineX, shineY],
                ([sx, sy]) =>
                  `radial-gradient(280px circle at ${sx} ${sy}, rgba(122,167,255,0.16), rgba(122,167,255,0) 60%)`,
              ),
              mixBlendMode: 'screen',
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
