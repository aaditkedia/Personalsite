import { useRef } from 'react';
import { useScrollProgress } from '../lib/useScrollProgress';
import { NUM_ACTS, clamp01, window01 } from '../lib/acts';

export function useActState(actIndex) {
  const ref = useRef({ local: 0, visible: 0 });
  const refresh = () => {
    const p = useScrollProgress.getState().progress;
    const t = p * NUM_ACTS - actIndex;
    ref.current.local = clamp01(t);
    ref.current.visible = window01(t);
    return ref.current;
  };
  return { state: ref, refresh };
}
