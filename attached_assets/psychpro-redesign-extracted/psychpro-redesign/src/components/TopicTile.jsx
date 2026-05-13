import React from 'react';
import { ChevronRight } from 'lucide-react';

/**
 * TopicTile
 * Row item used in the "Recommended for You" grid on the dashboard.
 */
export default function TopicTile({ icon: Icon, title, subtitle, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: '100%',
        padding: '14px 16px',
        background: 'rgba(15, 33, 56, 0.5)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        cursor: 'pointer',
        transition: 'all var(--t-base)',
        textAlign: 'left',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-glow)';
        e.currentTarget.style.boxShadow = 'var(--glow-soft)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border-subtle)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div className="icon-tile">
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            color: 'var(--text-primary)',
            fontSize: '0.9375rem',
            fontWeight: 500,
            marginBottom: 2,
          }}
        >
          {title}
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
          {subtitle}
        </div>
      </div>
      <ChevronRight size={16} strokeWidth={1.5} style={{ color: 'var(--text-muted)' }} />
    </button>
  );
}
