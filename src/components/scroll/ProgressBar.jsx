import { useEffect, useRef } from 'react';
import { useScrollProgress } from '../../lib/useScrollProgress';

export function ProgressBar() {
  const fillRef = useRef(null);

  useEffect(() => {
    const unsub = useScrollProgress.subscribe((state) => {
      if (fillRef.current) {
        fillRef.current.style.transform = `scaleX(${state.progress})`;
      }
    });
    return unsub;
  }, []);

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div ref={fillRef} className="scroll-progress__fill" />
    </div>
  );
}
