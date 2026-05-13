import React from 'react';
import ProjectCard from './ProjectCard';

const projectsData = [
  {
    title: "Dyslexia Low-Vision Reader",
    tags: ["Python", "Accessibility"],
    problem: "People with dyslexia and low vision face significant barriers when consuming digital text and literature.",
    solution: "Developed an advanced reader application tailored for accessibility, offering custom text rendering, spacing, and contrast features.",
    learned: "Gained practical experience in building inclusive software tools and applied research principles in human-computer interaction.",
    link: "https://github.com/aaditkedia"
  },
  {
    title: "Research Outreach Automation",
    tags: ["Python", "Flask", "Automation"],
    problem: "Academic researchers waste valuable time manually coordinating and communicating outreach initiatives.",
    solution: "Engineered a web application to automate and streamline email communications and data entry for research outreach.",
    learned: "Strengthened my understanding of backend web frameworks, scripting, and building end-to-end automation pipelines.",
    link: "https://github.com/aaditkedia"
  },
  {
    title: "NeuroLex",
    tags: ["Java", "Python", "SQLite"],
    problem: "Cognitive accessibility issues, such as visual crowding and phonological decoding challenges, often hinder user interaction with digital content.",
    solution: "Developed a Java-based cognitive accessibility engine that algorithmically addresses these specific cognitive needs to improve digital inclusivity.",
    learned: "Deepened expertise in Java and specialized software accessibility standards (WCAG) to create more inclusive technology.",
    link: "https://github.com/aaditkedia/NeuroLex"
  },
  {
    title: "RationalWallet",
    tags: ["Java", "Python", "Flask"],
    problem: "Human cognitive biases, specifically the Sunk Cost Fallacy and Loss Aversion, frequently lead to irrational financial decision-making.",
    solution: "Built an algorithmic cognitive control mechanism that reframes retrospective expenditures against prospective utility to encourage rational choices.",
    learned: "Successfully applied behavioral economics principles to software architecture and refined complex algorithmic design for real-world utility.",
    link: "https://github.com/aaditkedia/RationalWallet"
  },
  {
    title: "CUECF Official Website",
    tags: ["JavaScript", "ReactJS", "TailwindCSS"],
    problem: "A non-profit community foundation required a professional online presence to coordinate eco-cleanup initiatives and engage volunteers.",
    solution: "Designed and developed the official organization website from scratch using JavaScript, establishing a digital hub for environmental action.",
    learned: "Enhanced frontend development skills and learned the importance of digital branding for community-driven organizations like CUECF.",
    link: "https://cuecf.org"
  }
];

const Projects = () => {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2>Featured Projects</h2>
        <div className="projects-list">
          {projectsData.map((project, index) => (
            <ProjectCard key={index} {...project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;