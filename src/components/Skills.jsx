import React from 'react';
import './Skills.css';

const skillsData = [
  { name: "Java", icon: "java" },
  { name: "Python", icon: "python" },
  { name: "JavaScript", icon: "javascript" },
  { name: "ReactJS", icon: "react" },
  { name: "Flask", icon: "flask" },
  { name: "SQLite", icon: "sqlite" },
  { name: "Node.js", icon: "nodedotjs" },
  { name: "Git", icon: "git" },
  { name: "AWS", icon: "amazonaws" },
  { name: "TailwindCSS", icon: "tailwindcss" },
  { name: "VS Code", icon: "visualstudiocode" },
  { name: "PostgreSQL", icon: "postgresql" }
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
                <img 
                  src={`https://cdn.simpleicons.org/${skill.icon}/2563eb`} 
                  alt={skill.name} 
                />
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
