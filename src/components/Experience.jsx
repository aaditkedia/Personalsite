import React from 'react';
import './Experience.css';

const experienceData = [
  {
    title: "B.S. in Artificial Intelligence & Computer Science (Planned)",
    organization: "Purdue University — West Lafayette, IN",
    period: "Aug 2025 — May 2029",
    description: "Pursuing a dual major in AI and CS. Coursework spans systems, algorithms, and applied ML; outside class, building research-grade tooling on top of LangGraph, Neo4j, and modern frontend stacks."
  },
  {
    title: "Founder & Chairman",
    organization: "CUECF, LLC — Allentown, PA",
    period: "Jun 2023 — Present",
    description: "Built and deployed a full-stack web platform managing volunteer sign-ups, project listings, and donor communications. Organized 7+ restoration projects (1,500+ volunteer hours), secured $1,600+ in fundraising, and led 20+ volunteers across concurrent initiatives."
  },
  {
    title: "Social Media Manager (Internship)",
    organization: "Parkland High School — Allentown, PA",
    period: "Sep 2022 — May 2023",
    description: "Managed official district social media accounts; produced photo and video content that grew reach across the student and parent community."
  },
  {
    title: "Eagle Scout",
    organization: "Boy Scouts of America",
    period: "Achieved 2023",
    description: "Planned and executed an extensive service project — a working exercise in scope, leadership, and seeing a long-running commitment to completion."
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
