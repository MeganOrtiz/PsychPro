import React, { useState } from 'react';
import { Search } from 'lucide-react';
import BrainMark from './BrainMark';
import CTAButton from './CTAButton';

const NAV_ITEMS = ['HOME', 'COURSES', 'RESOURCES', 'COMMUNITY', 'ABOUT'];

/**
 * Header
 * Top navigation bar for the landing page. Transparent — sits over the nebula.
 */
export default function Header({ activeItem = 'HOME', onNavigate, onLogin }) {
  return (
    <header
      style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '24px 48px',
        maxWidth: 1400,
        margin: '0 auto',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <BrainMark size={28} />
        <span
          className="psychpro-wordmark"
          style={{ fontSize: '1.125rem', letterSpacing: '0.35em' }}
        >
          PSYCHPRO
        </span>
      </div>

      {/* Center nav */}
      <nav style={{ display: 'flex', gap: 40 }}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item}
            href={`#${item.toLowerCase()}`}
            className={`nav-link ${activeItem === item ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate?.(item);
            }}
          >
            {item}
          </a>
        ))}
      </nav>

      {/* Right cluster */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
        <button
          aria-label="Search"
          style={{
            color: 'var(--text-primary)',
            display: 'flex',
            transition: 'color var(--t-base)',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--cyan-bright)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
        >
          <Search size={18} strokeWidth={1.5} />
        </button>
        <CTAButton size="small" onClick={onLogin}>
          LOG IN
        </CTAButton>
      </div>
    </header>
  );
}
