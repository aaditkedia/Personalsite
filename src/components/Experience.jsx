import React from 'react';
import './Experience.css';

const experienceData = [
  {
    title: "Co-Founder & Chairman",
    organization: "Community United Eco-Cleanup Foundation (CUECF)",
    period: "2023 - Present",
    description: "Leading a non-profit organization dedicated to environmental sustainability through community-driven cleanup initiatives and service projects."
  },
  {
    title: "Eagle Scout",
    organization: "Boy Scouts of America",
    period: "Achieved 2023",
    description: "Successfully managed and completed an extensive service project, demonstrating leadership, discipline, and commitment to community service."
  },
  {
    title: "AI Software Engineer & Full Stack Student",
    organization: "Purdue University",
    period: "2024 - Present",
    description: "Specializing in software development, algorithmic design, and cognitive accessibility research with a focus on AI-driven solutions."
  }
];

const Experience = () => {
  return (
    <section id="experience" className="experience">
      <div className="container">
        <h2>Professional Journey</h2>
        <div className="experience-timeline">
          {experienceData.map((exp, index) => (
            <div key={index} className="experience-item">
              <div className="experience-header">
                <h3>{exp.title}</h3>
                <span className="period">{exp.period}</span>
              </div>
              <h4 className="organization">{exp.organization}</h4>
              <p>{exp.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;
