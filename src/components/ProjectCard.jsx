import React from 'react';
import './ProjectCard.css';

const ProjectCard = ({ title, problem, solution, learned, tags, link }) => {
  return (
    <div className="project-card">
      <div className="project-header">
        <h3>{title}</h3>
        <div className="project-tags">
          {tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
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
