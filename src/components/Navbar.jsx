import React, { useState, useEffect } from 'react';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={`navbar ${scrolled ? 'is-scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="logo">
          <a href="#landing">AK<span>//</span></a>
        </div>
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <a href="#landing" onClick={() => setIsOpen(false)}>Home</a>
          <a href="#projects" onClick={() => setIsOpen(false)}>Projects</a>
          <a href="#skills" onClick={() => setIsOpen(false)}>Skills</a>
          <a href="#experience" onClick={() => setIsOpen(false)}>Experience</a>
        </div>
        <button className="mobile-menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`bar ${isOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
