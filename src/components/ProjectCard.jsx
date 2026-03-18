import React from 'react';
import './ProjectCard.css';
import { FaJava, FaPython, FaReact, FaCode } from 'react-icons/fa';
import { SiJavascript, SiFlask, SiSqlite, SiTailwindcss } from 'react-icons/si';

const tagToIcon = {
  "Java": <FaJava size={24} color="#1e293b" title="Java" />,
  "Python": <FaPython size={24} color="#1e293b" title="Python" />,
  "JavaScript": <SiJavascript size={24} color="#1e293b" title="JavaScript" />,
  "ReactJS": <FaReact size={24} color="#1e293b" title="ReactJS" />,
  "Flask": <SiFlask size={24} color="#1e293b" title="Flask" />,
  "SQLite": <SiSqlite size={24} color="#1e293b" title="SQLite" />,
  "TailwindCSS": <SiTailwindcss size={24} color="#1e293b" title="TailwindCSS" />
};

const ProjectCard = ({ title, problem, solution, learned, tags, link }) => {
  return (
    <div className="project-card">
      <div className="project-header">
        <div>
          <h3>{title}</h3>
          <div className="project-tech-icons">
            {tags.map(tag => (
              <span key={tag} className="tech-icon" title={tag}>
                {tagToIcon[tag] || <FaCode size={24} color="#1e293b" title={tag} />}
              </span>
            ))}
          </div>
        </div>
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
