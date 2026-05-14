import React, { useEffect, useRef, useState } from 'react';
import DroneScene from './DroneScene';
import './LandingPage.css';

const LandingPage = () => {
  const hudRef = useRef();
  const rootRef = useRef();
  const [active, setActive] = useState(true);

  // Pause the entire WebGL frameloop when the landing is scrolled off-screen.
  // Single biggest perf win — projects/skills/experience can scroll smoothly
  // because the GPU isn't grinding through a full 3D render every frame.
  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting && entry.intersectionRatio > 0.05),
      { threshold: [0, 0.05, 0.5, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Pause if the tab is hidden, too.
  useEffect(() => {
    const onVis = () => setActive((cur) => (document.hidden ? false : cur));
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  return (
    <section id="landing" className="landing" ref={rootRef}>
      <div className="landing-canvas">
        <DroneScene hudRef={hudRef} active={active} />
      </div>

      <div className="landing-vignette" aria-hidden="true" />
      <div className="landing-noise" aria-hidden="true" />
      <div className="landing-scanline" aria-hidden="true" />

      <div className="landing-overlay">
        <div className="hud-corner hud-tl">
          <div className="hud-dot" />
          <div className="hud-stack">
            <div className="hud-brand">AADIT KEDIA</div>
            <div className="hud-sub">// Software Engineer &amp; Founder</div>
          </div>
        </div>

        <div className="hud-corner hud-tr">
          <div className="hud-tag">REC ●</div>
          <div className="hud-mono">CAM-01 / FPV / 4K</div>
        </div>

        <nav className="hud-nav" aria-label="Primary">
          <a href="#projects" className="hud-link"><span>[ </span>PROJECTS<span> ]</span></a>
          <a href="#experience" className="hud-link"><span>[ </span>EXPERIENCE<span> ]</span></a>
          <a href="#skills" className="hud-link"><span>[ </span>ARSENAL<span> ]</span></a>
          <a href="https://cuecf.org" target="_blank" rel="noopener noreferrer" className="hud-link"><span>[ </span>CUECF / NON-PROFIT<span> ]</span></a>
        </nav>

        <div className="hud-corner hud-bl">
          <div className="hud-mono small">CHASE / OFFSET (-3, 2.2, +6)</div>
          <div className="hud-mono small">TARGET / SUBJECT-01</div>
          <div className="hud-mono small">STATUS / TRACKING</div>
        </div>

        <div className="hud-corner hud-br">
          <div className="hud-mono small" ref={hudRef}>X 0.00  Y 0.00  Z 0.00</div>
          <a href="#projects" className="hud-cta">SCROLL TO ENTER ↓</a>
        </div>

        <div className="hud-reticle" aria-hidden="true">
          <span /><span /><span /><span />
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
