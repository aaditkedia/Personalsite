import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile sheet whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Non-landing routes always get the solid pill background — the
  // transparent style only makes sense over the hero canvas.
  const onLanding = location.pathname === '/';
  const solid = scrolled || !onLanding;

  return (
    <nav className={`navbar ${solid ? 'is-scrolled' : ''}`}>
      <div className="container nav-container">
        <div className="logo">
          <NavLink to="/">AK<span>//</span></NavLink>
        </div>
        <div className={`nav-links ${isOpen ? 'active' : ''}`}>
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/skills">Skills</NavLink>
          <NavLink to="/experience">Experience</NavLink>
          <NavLink to="/cuecf">CUECF</NavLink>
        </div>
        <button
          className="mobile-menu-toggle"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span className={`bar ${isOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isOpen ? 'active' : ''}`}></span>
          <span className={`bar ${isOpen ? 'active' : ''}`}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
