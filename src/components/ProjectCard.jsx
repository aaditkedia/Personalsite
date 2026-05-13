import React from 'react';
import './ProjectCard.css';
import { FaJava, FaPython, FaReact, FaCode, FaNodeJs, FaDocker } from 'react-icons/fa';
import {
  SiJavascript,
  SiTypescript,
  SiFlask,
  SiFastapi,
  SiSqlite,
  SiTailwindcss,
  SiNextdotjs,
  SiSupabase,
  SiPostgresql,
  SiNeo4J,
  SiFlutter,
  SiDart,
  SiPrisma,
  SiLangchain,
  SiThreedotjs,
} from 'react-icons/si';

const ICON_COLOR = '#7aa7ff';

const tagToIcon = {
  "Java":         <FaJava size={22} color={ICON_COLOR} title="Java" />,
  "Python":       <FaPython size={22} color={ICON_COLOR} title="Python" />,
  "JavaScript":   <SiJavascript size={22} color={ICON_COLOR} title="JavaScript" />,
  "TypeScript":   <SiTypescript size={22} color={ICON_COLOR} title="TypeScript" />,
  "ReactJS":      <FaReact size={22} color={ICON_COLOR} title="ReactJS" />,
  "React":        <FaReact size={22} color={ICON_COLOR} title="React" />,
  "Next.js":      <SiNextdotjs size={22} color={ICON_COLOR} title="Next.js" />,
  "Node.js":      <FaNodeJs size={22} color={ICON_COLOR} title="Node.js" />,
  "Flask":        <SiFlask size={22} color={ICON_COLOR} title="Flask" />,
  "FastAPI":      <SiFastapi size={22} color={ICON_COLOR} title="FastAPI" />,
  "SQLite":       <SiSqlite size={22} color={ICON_COLOR} title="SQLite" />,
  "TailwindCSS":  <SiTailwindcss size={22} color={ICON_COLOR} title="TailwindCSS" />,
  "Supabase":     <SiSupabase size={22} color={ICON_COLOR} title="Supabase" />,
  "PostgreSQL":   <SiPostgresql size={22} color={ICON_COLOR} title="PostgreSQL" />,
  "Neo4j":        <SiNeo4J size={22} color={ICON_COLOR} title="Neo4j" />,
  "Flutter":      <SiFlutter size={22} color={ICON_COLOR} title="Flutter" />,
  "Dart":         <SiDart size={22} color={ICON_COLOR} title="Dart" />,
  "Prisma":       <SiPrisma size={22} color={ICON_COLOR} title="Prisma" />,
  "LangGraph":    <SiLangchain size={22} color={ICON_COLOR} title="LangGraph" />,
  "Docker":       <FaDocker size={22} color={ICON_COLOR} title="Docker" />,
  "Three.js":     <SiThreedotjs size={22} color={ICON_COLOR} title="Three.js" />,
};

const ProjectCard = ({ title, problem, solution, learned, tags = [], link, date }) => {
  return (
    <div className="project-card">
      <div className="project-header">
        <div className="project-heading">
          <h3>{title}</h3>
          <div className="project-tech-icons">
            {tags.map(tag => (
              <span key={tag} className="tech-icon" title={tag}>
                {tagToIcon[tag] || <FaCode size={22} color={ICON_COLOR} title={tag} />}
              </span>
            ))}
          </div>
          <div className="project-tag-list">
            {tags.map(tag => (
              <span key={tag} className="project-tag-pill">{tag}</span>
            ))}
          </div>
        </div>
        {date && <span className="project-date">{date}</span>}
      </div>

      <div className="project-content">
        <div className="project-section">
          <h4>The Problem</h4>
          <p>{problem}</p>
        </div>

        <div className="project-section">
          <h4>The Solution</h4>
          <p>{solution}</p>
        </div>

        <div className="project-section">
          <h4>What I Learned</h4>
          <p>{learned}</p>
        </div>
      </div>

      {link && (
        <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">
          View Project &rarr;
        </a>
      )}
    </div>
  );
};

export default ProjectCard;
