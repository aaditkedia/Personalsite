import React from 'react';
import './ProjectCard.css';
import { FaJava, FaPython, FaReact } from 'react-icons/fa';
import { SiJavascript, SiFlask, SiSqlite } from 'react-icons/si';
import { MdAccessibility, MdPsychology, MdShowChart, MdArchitecture, MdWeb, MdVolunteerActivism } from 'react-icons/md';

const tagToIcon = {
  "Java": <FaJava size={24} color="#1e293b" title="Java" />,
  "Python": <FaPython size={24} color="#1e293b" title="Python" />,
  "JavaScript": <SiJavascript size={24} color="#1e293b" title="JavaScript" />,
  "ReactJS": <FaReact size={24} color="#1e293b" title="ReactJS" />,
  "Flask": <SiFlask size={24} color="#1e293b" title="Flask" />,
  "SQLite": <SiSqlite size={24} color="#1e293b" title="SQLite" />,
  "Accessibility": <MdAccessibility size={24} color="#1e293b" title="Accessibility" />,
  "Cognitive Science": <MdPsychology size={24} color="#1e293b" title="Cognitive Science" />,
  "Behavioral Economics": <MdShowChart size={24} color="#1e293b" title="Behavioral Economics" />,
  "Algorithms": <MdArchitecture size={24} color="#1e293b" title="Algorithms" />,
  "Web Design": <MdWeb size={24} color="#1e293b" title="Web Design" />,
  "Non-Profit": <MdVolunteerActivism size={24} color="#1e293b" title="Non-Profit" />
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
                {tagToIcon[tag] || <MdArchitecture size={24} color="#1e293b" title={tag} />}
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
