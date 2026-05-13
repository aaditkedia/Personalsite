import React from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import './App.css';

function App() {
  return (
    <div className="app">
      <LandingPage />
      <Navbar />
      <main>
        <Projects />
        <Skills />
        <Experience />
      </main>
      <footer className="footer">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Aadit Kedia. Built with React, R3F &amp; Vite.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
