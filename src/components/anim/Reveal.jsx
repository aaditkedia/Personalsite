import { motion } from 'framer-motion';

const variants = {
  hidden: { opacity: 0, y: 28, filter: 'blur(8px)' },
  show: (delay) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1], delay },
  }),
};

export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', amount = 0.3 }) {
  const Component = motion[Tag] ?? motion.div;
  return (
    <Component
      className={className}
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      custom={delay}
    >
      {children}
    </Component>
  );
}
