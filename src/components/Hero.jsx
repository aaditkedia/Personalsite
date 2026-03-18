import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <span className="hero-tagline">Eagle Scout & Purdue University Student</span>
          <h1>Hi, I'm <span className="highlight">Aadit Kedia.</span></h1>
          <p className="hero-description">
            I am a Full Stack Developer and AI Software Engineer dedicated to building intelligent technology that solves real-world problems. 
            Focused on the intersection of cognitive accessibility and scalable engineering.
          </p>
          <div className="hero-actions">
            <a href="#projects" className="btn btn-primary">View My Projects</a>
            <a href="https://www.linkedin.com/in/aaditkedia/" target="_blank" rel="noopener noreferrer" className="btn btn-outline">LinkedIn</a>
            <a href="https://github.com/aaditkedia" target="_blank" rel="noopener noreferrer" className="btn btn-outline">GitHub</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
