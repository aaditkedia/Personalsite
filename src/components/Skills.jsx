import React from 'react';
import './Skills.css';
import { Reveal } from './anim/Reveal';
import { FaJava, FaPython, FaReact, FaNodeJs, FaGitAlt, FaDocker, FaLinux } from 'react-icons/fa';
import {
  SiJavascript,
  SiTypescript,
  SiFlask,
  SiFastapi,
  SiSqlite,
  SiTailwindcss,
  SiPostgresql,
  SiNextdotjs,
  SiSupabase,
  SiNeo4J,
  SiFlutter,
  SiDart,
  SiPrisma,
  SiLangchain,
  SiPytorch,
  SiHuggingface,
  SiThreedotjs,
  SiVercel,
} from 'react-icons/si';

const COLOR = '#7aa7ff';

const skillsData = [
  // Languages
  { name: "Python",       icon: <FaPython size={42} color={COLOR} /> },
  { name: "TypeScript",   icon: <SiTypescript size={42} color={COLOR} /> },
  { name: "JavaScript",   icon: <SiJavascript size={42} color={COLOR} /> },
  { name: "Java",         icon: <FaJava size={42} color={COLOR} /> },
  { name: "Dart",         icon: <SiDart size={42} color={COLOR} /> },

  // Frontend / runtimes
  { name: "React",        icon: <FaReact size={42} color={COLOR} /> },
  { name: "Next.js",      icon: <SiNextdotjs size={42} color={COLOR} /> },
  { name: "Node.js",      icon: <FaNodeJs size={42} color={COLOR} /> },
  { name: "Flutter",      icon: <SiFlutter size={42} color={COLOR} /> },
  { name: "TailwindCSS",  icon: <SiTailwindcss size={42} color={COLOR} /> },
  { name: "Three.js",     icon: <SiThreedotjs size={42} color={COLOR} /> },

  // Backend
  { name: "FastAPI",      icon: <SiFastapi size={42} color={COLOR} /> },
  { name: "Flask",        icon: <SiFlask size={42} color={COLOR} /> },
  { name: "Prisma",       icon: <SiPrisma size={42} color={COLOR} /> },

  // AI / ML
  { name: "PyTorch",      icon: <SiPytorch size={42} color={COLOR} /> },
  { name: "LangGraph",    icon: <SiLangchain size={42} color={COLOR} /> },
  { name: "Hugging Face", icon: <SiHuggingface size={42} color={COLOR} /> },

  // Data / Cloud
  { name: "PostgreSQL",   icon: <SiPostgresql size={42} color={COLOR} /> },
  { name: "SQLite",       icon: <SiSqlite size={42} color={COLOR} /> },
  { name: "Neo4j",        icon: <SiNeo4J size={42} color={COLOR} /> },
  { name: "Supabase",     icon: <SiSupabase size={42} color={COLOR} /> },
  { name: "Docker",       icon: <FaDocker size={42} color={COLOR} /> },
  { name: "Vercel",       icon: <SiVercel size={42} color={COLOR} /> },

  // Tools
  { name: "Git",          icon: <FaGitAlt size={42} color={COLOR} /> },
  { name: "Linux / WSL",  icon: <FaLinux size={42} color={COLOR} /> },
];

const Skills = () => {
  return (
    <section id="skills" className="skills">
      <div className="container">
        <Reveal as="h2">Technical Arsenal</Reveal>
        <div className="skills-widgets">
          {skillsData.map((skill, index) => (
            <Reveal key={index} delay={(index % 6) * 0.04} amount={0.4} className="skill-widget">
              <div className="skill-icon">
                {skill.icon}
              </div>
              <span className="skill-name">{skill.name}</span>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
