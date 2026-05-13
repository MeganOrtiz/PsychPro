import React, { useState } from 'react';
import NebulaBackground from './components/NebulaBackground';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import './styles/globals.css';

/**
 * App
 *
 * Mounts the persistent NebulaBackground once, then swaps the active page.
 * Replace the simple state-based routing below with your real router
 * (React Router, Next.js, etc.) — just make sure NebulaBackground stays
 * mounted at the root above the route switcher.
 */
export default function App() {
  // Replace with your real routing. This is just a demo toggle.
  const [page, setPage] = useState('landing');

  return (
    <>
      <NebulaBackground />

      {/* Demo page switcher — remove when integrating with real routes */}
      <div
        style={{
          position: 'fixed',
          top: 12,
          left: 12,
          zIndex: 100,
          display: 'flex',
          gap: 8,
          background: 'rgba(15, 33, 56, 0.8)',
          backdropFilter: 'blur(8px)',
          padding: '6px 10px',
          borderRadius: 8,
          border: '1px solid var(--border-subtle)',
        }}
      >
        <button
          onClick={() => setPage('landing')}
          style={{
            color: page === 'landing' ? 'var(--cyan-bright)' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Landing
        </button>
        <span style={{ color: 'var(--text-muted)' }}>|</span>
        <button
          onClick={() => setPage('dashboard')}
          style={{
            color: page === 'dashboard' ? 'var(--cyan-bright)' : 'var(--text-secondary)',
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Dashboard
        </button>
      </div>

      {page === 'landing' ? <Landing /> : <Dashboard />}
    </>
  );
}
