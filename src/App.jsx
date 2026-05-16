import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import CUECF from './components/CUECF';
import './App.css';

// HashRouter avoids the GH-Pages SPA-fallback problem: /projects, /skills,
// /experience all work as direct URLs without any server-side rewrite.
function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/projects" element={<PageShell><Projects /></PageShell>} />
          <Route path="/skills" element={<PageShell><Skills /></PageShell>} />
          <Route path="/experience" element={<PageShell><Experience /></PageShell>} />
          <Route path="/cuecf" element={<PageShell><CUECF /></PageShell>} />
        </Routes>
        <footer className="footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Aadit Kedia. Built with React, R3F &amp; Vite.</p>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}

// Reset scroll on navigation — without this, navigating to /projects after
// scrolling around lands you mid-page.
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Non-landing routes need top padding so the fixed navbar doesn't overlap
// section content. Landing renders the canvas full-bleed and doesn't need it.
function PageShell({ children }) {
  return <main className="page-shell">{children}</main>;
}

export default App;
