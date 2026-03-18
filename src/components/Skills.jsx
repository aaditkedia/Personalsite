import React from 'react';
import './Skills.css';

const skillCategories = [
  {
    name: "Languages",
    skills: ["Java", "Python", "JavaScript", "SQL"]
  },
  {
    name: "Web & Backend",
    skills: ["React", "Flask", "REST APIs", "Web Scraping", "SQLite"]
  },
  {
    name: "Leadership",
    skills: ["Co-Founder & Chairman (CUECF)", "Eagle Scout", "Community Organizing", "Project Management"]
  }
];

const Skills = () => {
  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2>Technical Skills</h2>
        <div className="skills-grid">
          {skillCategories.map((category, index) => (
            <div key={index} className="skill-category">
              <h3>{category.name}</h3>
              <div className="skill-list">
                {category.skills.map(skill => (
                  <div key={skill} className="skill-item">
                    <span className="skill-dot"></span>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
