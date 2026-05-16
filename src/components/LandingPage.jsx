import { Link } from 'react-router-dom';
import { Scene } from '../three/Scene';
import { ACTS } from '../lib/acts';
import { Section } from './scroll/Section';
import { Glow, Vignette, Grain } from './scroll/Atmosphere';
import { ProgressBar } from './scroll/ProgressBar';
import './LandingPage.css';

// Lenis smooth-scroll is now mounted once in App.jsx so it works on every
// route — this component just renders the canvas + sections.
export default function LandingPage() {
  return (
    <div className="scroll-landing">
      <ProgressBar />
      <Glow />
      <Scene />
      <main className="scroll-sections">
        {ACTS.map((act) => (
          <Section key={act.key} act={act} />
        ))}
      </main>
      <div className="scroll-landing__cta">
        <div className="scroll-landing__cta-links">
          <Link to="/projects" className="scroll-landing__cta-link">Projects →</Link>
          <Link to="/experience" className="scroll-landing__cta-link">Experience</Link>
          <Link to="/skills" className="scroll-landing__cta-link">Skills</Link>
          <Link to="/cuecf" className="scroll-landing__cta-link">CUECF</Link>
        </div>
      </div>
      <Vignette />
      <Grain />
    </div>
  );
}
