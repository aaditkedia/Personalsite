import React from 'react';
import ProjectCard from './ProjectCard';

const projectsData = [
  {
    title: "NeuroLex",
    tags: ["Java", "Accessibility", "Cognitive Science"],
    problem: "Cognitive accessibility issues, such as visual crowding and phonological decoding challenges, often hinder user interaction with digital content.",
    solution: "Developed a Java-based cognitive accessibility engine that algorithmically addresses these specific cognitive needs to improve digital inclusivity.",
    learned: "Deepened expertise in Java and specialized software accessibility standards (WCAG) to create more inclusive technology.",
    link: "https://github.com/aaditkedia/NeuroLex"
  },
  {
    title: "RationalWallet",
    tags: ["Java", "Behavioral Economics", "Algorithms"],
    problem: "Human cognitive biases, specifically the Sunk Cost Fallacy and Loss Aversion, frequently lead to irrational financial decision-making.",
    solution: "Built an algorithmic cognitive control mechanism that reframes retrospective expenditures against prospective utility to encourage rational choices.",
    learned: "Successfully applied behavioral economics principles to software architecture and refined complex algorithmic design for real-world utility.",
    link: "https://github.com/aaditkedia/RationalWallet"
  },
  {
    title: "Purdue Dining Menu Scraper",
    tags: ["Python", "Flask", "SQLite"],
    problem: "The lack of a centralized, programmatically accessible way to track and view Purdue dining hall menus for students.",
    solution: "Created a robust web scraper using Python, Flask, and SQLite that provides a clean REST API for real-time dining menu data.",
    learned: "Gained proficiency in web scraping techniques (BeautifulSoup), REST API development, and managing concurrent HTTP requests efficiently.",
    link: "https://github.com/aaditkedia/PurdueWebAppMenuScrapper"
  },
  {
    title: "CUECF Official Website",
    tags: ["JavaScript", "Web Design", "Non-Profit"],
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
