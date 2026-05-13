import React from 'react';
import ProjectCard from './ProjectCard';

const projectsData = [
  {
    title: "Neuro-Social Orchestration Platform",
    tags: ["Python", "LangGraph", "Neo4j", "FastAPI", "Docker"],
    date: "Apr 2026",
    problem: "Studying how a piece of media propagates emotionally through a social graph requires stitching together brain-encoding models, knowledge graphs, and agent simulations — work usually scattered across disconnected tools.",
    solution: "Integrated Meta's TRIBE v2 brain encoding model with a LangGraph multi-agent pipeline to map media-triggered neurological responses and simulate emotional propagation across networks, backed by a RAG pipeline over neuroscience literature in Neo4j and served via FastAPI + Streamlit, fully containerized in Docker.",
    learned: "Operating real research-grade ML models inside an orchestration framework, plus designing knowledge-graph schemas that an LLM agent can actually reason over.",
    link: "https://github.com/aaditkedia"
  },
  {
    title: "BoilerNet — Purdue Startup Network",
    tags: ["React", "TypeScript", "Supabase", "PostgreSQL"],
    date: "Jan 2026 — Present",
    problem: "Purdue's founder, alumni, mentor, and investor communities are real but invisible to each other — there is no shared place to discover teams, projects, or capital.",
    solution: "Built a full-stack networking platform with multi-provider OAuth (GitHub, Google, LinkedIn, Twitter, Discord) and Supabase Row-Level Security. Role-based access for student / alumni / mentor / investor, plus a project showcase, team-building board, and admin panel — deployed on Vercel.",
    learned: "Row-Level Security as a real authorization layer (not an afterthought), and how to design a UX that has to serve four very different user roles without becoming four products.",
    link: "https://github.com/aaditkedia"
  },
  {
    title: "Business Strategy Simulation Game",
    tags: ["Next.js", "TypeScript", "Prisma", "Zustand"],
    date: "Mar 2026",
    problem: "Most strategy / case-competition tools are spreadsheet-shaped and don't let teams feel the consequences of their decisions over multiple quarters.",
    solution: "Engineered a multiplayer browser simulation where teams manage competing companies across 4 regions through 10 decision categories. The AI-driven engine computes 5 financial metrics per round — EPS, ROE, stock price, credit rating, brand image — with the full pipeline test-covered in Vitest.",
    learned: "Designing a balanced simulation economy where decisions actually trade off against each other, and using Zustand to keep multi-player state predictable.",
    link: "https://github.com/aaditkedia"
  },
  {
    title: "Contact Graph Mobile App",
    tags: ["Flutter", "Dart", "SQLite"],
    date: "Feb 2026",
    problem: "Your phone's contact list is a flat alphabetical wall — it hides the actual structure of how people in your life are connected to each other.",
    solution: "Cross-platform app (Android / iOS / Web) that imports device contacts and renders them as an interactive force-directed graph using a node/edge schema, with an M:N tag system, smart search, and Material Design 3 UI over a SQLite-backed relationship store.",
    learned: "Force-directed layout math in a constrained mobile runtime, and modeling many-to-many relationships in SQLite without ORM crutches.",
    link: "https://github.com/aaditkedia"
  },
  {
    title: "University Dining Scrapers",
    tags: ["Python", "Node.js", "Flask", "SQLite"],
    date: "Jan 2026",
    problem: "Three university dining systems publish their menus in three incompatible formats — students who want to compare options across campuses have nothing to compare against.",
    solution: "Concurrent scrapers for 3 university dining systems aggregating 63+ menu items with SQLite persistence and caching. A Node.js rewrite hit 4–6× throughput over the Python baseline; the Flask UI adds custom sorting and CSV export.",
    learned: "Concurrency-bound scraping really does benefit from leaving Python — and proper caching matters more than clever parsing for sites that change shape weekly.",
    link: "https://github.com/aaditkedia"
  },
  {
    title: "NeuroLex",
    tags: ["Java", "Python", "SQLite"],
    date: "2024",
    problem: "Cognitive accessibility issues — visual crowding, phonological decoding challenges — often hinder users with dyslexia or low vision from interacting with digital content.",
    solution: "A Java-based cognitive accessibility engine that algorithmically addresses these specific cognitive needs to make digital text more inclusive.",
    learned: "Java's object model under pressure of real accessibility constraints, and how WCAG guidelines compile into concrete software decisions.",
    link: "https://github.com/aaditkedia/NeuroLex"
  },
  {
    title: "RationalWallet",
    tags: ["Java", "Python", "Flask"],
    date: "2024",
    problem: "Cognitive biases — specifically Sunk Cost Fallacy and Loss Aversion — push people into financially irrational decisions every day.",
    solution: "An algorithmic cognitive control mechanism that reframes retrospective expenditures against prospective utility, nudging the user toward rational choices instead of biased ones.",
    learned: "Translating behavioral-economics theory into actual software architecture, and being careful about where 'opinionated' UX crosses into paternalism.",
    link: "https://github.com/aaditkedia/RationalWallet"
  },
  {
    title: "CUECF Official Website",
    tags: ["JavaScript", "ReactJS", "TailwindCSS"],
    date: "2023 — Present",
    problem: "A growing non-profit running real cleanup projects needed a credible online presence — one that could coordinate volunteers and tell donors the story.",
    solution: "Designed and developed the official CUECF site from scratch as the digital hub for volunteer sign-ups, project listings, and donor communications.",
    learned: "Frontend craft in service of a mission, and the discipline of making something simple enough that volunteers actually use it.",
    link: "https://cuecf.org"
  }
];

const Projects = () => {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2>Featured Projects</h2>
        <div className="projects-list">
          {projectsData.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
