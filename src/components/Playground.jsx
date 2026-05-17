import { useCallback, useEffect, useState } from 'react';
import { PlaygroundScene } from '../playground/PlaygroundScene';
import './Playground.css';

const MOVES = [
  { key: 'running', label: 'Run', hint: 'R', keys: ['r'] },
  { key: 'lookback', label: 'Look back', hint: 'L', keys: ['l'] },
  { key: 'rightTurn', label: 'Right turn', hint: '→', keys: ['arrowright', 'd'] },
  { key: 'dive', label: 'Dive', hint: 'Space', keys: [' ', 'space'] },
  { key: 'slide', label: 'Slide', hint: 'S', keys: ['s', 'arrowdown'] },
];

export default function Playground() {
  const [animationKey, setAnimationKey] = useState('running');

  const trigger = useCallback((key) => {
    setAnimationKey(key);
  }, []);

  const handleAnimationEnd = useCallback(() => {
    setAnimationKey('running');
  }, []);

  // Keyboard controls.
  useEffect(() => {
    const onKey = (e) => {
      // Ignore when typing in form fields.
      const target = e.target;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      const k = e.key.toLowerCase();
      const match = MOVES.find((m) => m.keys.includes(k));
      if (match) {
        e.preventDefault();
        trigger(match.key);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [trigger]);

  return (
    <section id="playground" className="playground">
      <div className="playground__canvas-wrap">
        <PlaygroundScene animationKey={animationKey} onAnimationEnd={handleAnimationEnd} />
      </div>

      <div className="playground__hud">
        <div className="playground__title">
          <p className="playground__eyebrow">Playground</p>
          <h2>Animation Sandbox</h2>
          <p className="playground__lede">
            Five Mixamo clips re-rigged onto a single character and crossfaded in
            React Three Fiber. Tap a move or use the keyboard.
          </p>
        </div>

        <div className="playground__moves">
          {MOVES.map((m) => (
            <button
              key={m.key}
              type="button"
              className={`move ${animationKey === m.key ? 'is-active' : ''}`}
              onClick={() => trigger(m.key)}
            >
              <span className="move__label">{m.label}</span>
              <kbd className="move__kbd">{m.hint}</kbd>
            </button>
          ))}
        </div>

        <p className="playground__footnote">
          char.glb + 5 animation clips · loaded with useGLTF + useAnimations · crossfaded at 280 ms.
        </p>
      </div>
    </section>
  );
}
