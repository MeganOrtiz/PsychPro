import React from 'react';

/**
 * FeatureCard
 * Used in the 4-up row beneath the hero on the landing page.
 */
export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div
      className="glass-card-tight"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 16,
        minHeight: 220,
        padding: 28,
      }}
    >
      <div style={{ color: 'var(--cyan-glow)', marginBottom: 4 }}>
        <Icon size={40} strokeWidth={1.25} />
      </div>
      <h3
        className="psychpro-tagline"
        style={{ fontSize: '0.8125rem', letterSpacing: '0.2em' }}
      >
        {title}
      </h3>
      <p className="muted" style={{ fontSize: '0.9375rem', lineHeight: 1.6 }}>
        {description}
      </p>
    </div>
  );
}
