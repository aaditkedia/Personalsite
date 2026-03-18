import React from 'react';
import './Skills.css';
import { FaJava, FaPython, FaReact, FaNodeJs, FaGitAlt, FaAws } from 'react-icons/fa';
import { SiJavascript, SiFlask, SiSqlite, SiTailwindcss, SiPostgresql } from 'react-icons/si';
import { VscVscode } from 'react-icons/vsc';

const skillsData = [
  { name: "Java", icon: <FaJava size={48} color="#2563eb" /> },
  { name: "Python", icon: <FaPython size={48} color="#2563eb" /> },
  { name: "JavaScript", icon: <SiJavascript size={48} color="#2563eb" /> },
  { name: "ReactJS", icon: <FaReact size={48} color="#2563eb" /> },
  { name: "Flask", icon: <SiFlask size={48} color="#2563eb" /> },
  { name: "SQLite", icon: <SiSqlite size={48} color="#2563eb" /> },
  { name: "Node.js", icon: <FaNodeJs size={48} color="#2563eb" /> },
  { name: "Git", icon: <FaGitAlt size={48} color="#2563eb" /> },
  { name: "AWS", icon: <FaAws size={48} color="#2563eb" /> },
  { name: "TailwindCSS", icon: <SiTailwindcss size={48} color="#2563eb" /> },
  { name: "VS Code", icon: <VscVscode size={48} color="#2563eb" /> },
  { name: "PostgreSQL", icon: <SiPostgresql size={48} color="#2563eb" /> }
];

const Skills = () => {
  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2>Technical Arsenal</h2>
        <div className="skills-widgets">
          {skillsData.map((skill, index) => (
            <div key={index} className="skill-widget">
              <div className="skill-icon">
                {skill.icon}
              </div>
              <span className="skill-name">{skill.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
