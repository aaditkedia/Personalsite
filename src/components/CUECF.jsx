import './CUECF.css';
import { Reveal } from './anim/Reveal';
import { Magnetic } from './anim/Magnetic';
import { AnimatedStat } from './anim/AnimatedStat';

const stats = [
  { number: '15+', label: 'Restoration projects' },
  { number: '1,500+', label: 'Volunteer hours' },
  { number: '75+', label: 'Volunteer community' },
  { number: '$1,600+', label: 'Funds raised' },
];

const featured = [
  {
    title: 'LCCD Tree Planting',
    partner: 'Lehigh County Conservation District',
    blurb: 'Planted 30+ native trees across Lehigh County after clearing invasives with a 10+ volunteer crew.',
  },
  {
    title: 'Riparian Buffer Repair — Wayne A Grube Park',
    partner: 'Wildlands Conservancy',
    blurb: 'Protected 50+ saplings and pulled invasives along stream buffers; repeated the work at Trexler Nature Preserve.',
  },
  {
    title: 'Whitehall Birdhouse Cleanup',
    partner: 'Whitehall Township',
    blurb: 'Cleared overgrowth around 30+ township birdhouses and repositioned ones in unusable locations.',
  },
  {
    title: 'E-Recycling Day',
    partner: 'Whitehall Township',
    blurb: 'Hauled and sorted hundreds of pounds of e-waste with the township to keep it out of landfill.',
  },
  {
    title: 'Invasive Species Removal — Whitehall Parkway',
    partner: 'Whitehall Township',
    blurb: 'Removed three target invasive species and built brush-pile habitats for local wildlife.',
  },
  {
    title: 'Education — Springhouse & Hindu Temple Society',
    partner: 'Parkland School District · Hindu Temple Society',
    blurb: 'Built and ran conservation talks, trivia games, and craft programs for elementary and middle school students.',
  },
];

const partners = [
  'Whitehall Township',
  'Wildlands Conservancy',
  'Lehigh County Conservation District',
  'Lehigh Gap Nature Center',
  'Lehigh Valley Audubon',
  'Hindu Temple Society',
  'Springhouse Middle School',
  'Boy Scouts of America',
];

const CUECF = () => {
  return (
    <section id="cuecf" className="cuecf">
      <div className="container">
        <Reveal as="header" className="cuecf-hero">
          <img
            src={`${import.meta.env.BASE_URL}logo-cuecf.png`}
            alt="CUECF logo"
            className="cuecf-logo"
            loading="eager"
          />
          <p className="cuecf-eyebrow">Non-Profit · Founded 2023</p>
          <h2>CUECF — Community United Environmental Conservation Foundation</h2>
          <p className="cuecf-lede">
            A volunteer-run environmental non-profit operating across the Lehigh Valley, PA.
            Founded and chaired by Aadit Kedia in June 2023 with a focus on tangible, on-the-ground
            restoration work alongside local townships, conservancies, and community partners.
          </p>
        </Reveal>

        <div className="cuecf-stats">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08} className="cuecf-stat">
              <div className="cuecf-stat__number">
                <AnimatedStat value={s.number} />
              </div>
              <div className="cuecf-stat__label">{s.label}</div>
            </Reveal>
          ))}
        </div>

        <div className="cuecf-grid">
          <Reveal className="cuecf-block">
            <h3>Mission</h3>
            <p>
              Restore, protect, and educate. CUECF runs hands-on environmental projects —
              invasive species removal, riparian buffer repair, tree planting, e-waste
              recycling, roadside cleanups — and pairs them with community education
              programs aimed at younger students.
            </p>
          </Reveal>

          <Reveal delay={0.12} className="cuecf-block">
            <h3>Founder</h3>
            <div className="cuecf-founder">
              <img
                src={`${import.meta.env.BASE_URL}aadit-headshot.png`}
                alt="Aadit Kedia"
                className="cuecf-founder__photo"
                loading="lazy"
              />
              <p>
                Founded by <strong>Aadit Kedia</strong> in June 2023 while in high school in
                Allentown, PA. CUECF was incorporated as an LLC and ran its first restoration
                project (Whitehall Birdhouse Cleanup) the same year. Aadit serves as Chairman,
                built the full-stack volunteer platform, and continues to lead project
                planning and partner outreach while studying AI + CS at Purdue.
              </p>
            </div>
          </Reveal>
        </div>

        <div className="cuecf-section">
          <Reveal as="h3">Featured Projects</Reveal>
          <div className="cuecf-projects">
            {featured.map((p, i) => (
              <Reveal key={p.title} delay={(i % 2) * 0.08} as="article" className="cuecf-project">
                <h4>{p.title}</h4>
                <p className="cuecf-project__partner">{p.partner}</p>
                <p className="cuecf-project__blurb">{p.blurb}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="cuecf-section">
          <Reveal as="h3">Partner Organizations</Reveal>
          <Reveal as="ul" className="cuecf-partners" delay={0.05}>
            {partners.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </Reveal>
        </div>

        <Reveal className="cuecf-cta">
          <p>
            Full project archive, photo galleries, team bios, and volunteer sign-up:
          </p>
          <Magnetic>
            <a
              href="https://cuecf.org"
              target="_blank"
              rel="noopener noreferrer"
              className="cuecf-cta__link"
            >
              Visit cuecf.org &rarr;
            </a>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
};

export default CUECF;
