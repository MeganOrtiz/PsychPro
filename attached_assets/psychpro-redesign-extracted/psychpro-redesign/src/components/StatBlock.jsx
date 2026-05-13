import React from 'react';

/**
 * StatBlock
 * Used in the "Trusted By" row on the landing page.
 */
export default function StatBlock({ icon: Icon, value, label }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 10,
        flex: 1,
      }}
    >
      <div style={{ color: 'var(--cyan-glow)' }}>
        <Icon size={28} strokeWidth={1.25} />
      </div>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 300,
          fontSize: '1.75rem',
          color: 'var(--text-primary)',
          letterSpacing: '0.02em',
        }}
      >
        {value}
      </div>
      <div className="eyebrow" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </div>
    </div>
  );
}
