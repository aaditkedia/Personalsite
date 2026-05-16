import './SiteAtmosphere.css';

// Subtle full-bleed ambient layer behind every route so the non-landing
// pages share the landing's atmospheric feel — a fixed radial glow + film
// grain. Sits at z-index 0 under all real content.
export default function SiteAtmosphere() {
  return (
    <div className="site-atmosphere" aria-hidden="true">
      <div className="site-atmosphere__glow" />
      <div className="site-atmosphere__grain" />
    </div>
  );
}
