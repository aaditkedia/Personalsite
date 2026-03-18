const tagToIcon = {
  "Java": "java",
  "Python": "python",
  "JavaScript": "javascript",
  "ReactJS": "react",
  "Flask": "flask",
  "SQLite": "sqlite",
  "Accessibility": "webaccessibility",
  "Cognitive Science": "brain",
  "Behavioral Economics": "chartbar",
  "Algorithms": "cpu",
  "Web Design": "layout",
  "Non-Profit": "heart"
};

const ProjectCard = ({ title, problem, solution, learned, tags, link }) => {
  return (
    <div className="project-card">
      <div className="project-header">
        <div>
          <h3>{title}</h3>
          <div className="project-tech-icons">
            {tags.map(tag => (
              <img 
                key={tag} 
                src={`https://cdn.simpleicons.org/${tagToIcon[tag] || 'code'}/1e293b`} 
                alt={tag} 
                title={tag}
                className="tech-icon"
              />
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
