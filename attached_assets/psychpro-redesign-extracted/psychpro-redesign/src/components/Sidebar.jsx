import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  Brain,
  Trophy,
  Library,
  Bookmark,
  Wrench,
  Sparkles,
  Lightbulb,
  Star,
  MessageSquare,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import BrainMark from './BrainMark';

const NAV_GROUPS = [
  {
    label: 'STUDY',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'topics', label: 'Topics', icon: BookOpen },
      { id: 'study-lab', label: 'Study Lab', icon: FlaskConical },
      { id: 'brain-lab', label: 'Brain Lab', icon: Brain },
      { id: 'progress', label: 'Progress', icon: Trophy },
      { id: 'resources', label: 'Resources', icon: Library },
    ],
  },
  {
    label: 'TOOLKIT',
    items: [
      { id: 'my-tools', label: 'My Tools', icon: Bookmark, pro: true },
      { id: 'standard-tools', label: 'Standard Tools', icon: Wrench, pro: true },
      { id: 'pro-tools', label: 'Pro Tools', icon: Sparkles, pro: true },
      { id: 'reflections', label: 'Reflections', icon: Lightbulb },
    ],
  },
  {
    label: 'COMMUNITY',
    items: [
      { id: 'be-featured', label: 'Be Featured', icon: Star },
      { id: 'feedback', label: 'Feedback', icon: MessageSquare },
    ],
  },
  {
    label: 'ADMIN',
    items: [{ id: 'feedback-inbox', label: 'Feedback Inbox', icon: ShieldCheck }],
  },
];

/**
 * Sidebar
 * Left-rail navigation for the dashboard.
 */
export default function Sidebar({ activeId = 'dashboard', onSelect, user }) {
  return (
    <aside
      style={{
        width: 260,
        minHeight: '100vh',
        background: 'var(--bg-sidebar)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderRight: '1px solid var(--border-faint)',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        position: 'sticky',
        top: 0,
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '4px 12px 28px',
        }}
      >
        <BrainMark size={26} />
        <span
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            fontSize: '1.125rem',
            color: 'var(--text-primary)',
            letterSpacing: '0.02em',
          }}
        >
          PsychPro
        </span>
      </div>

      {/* Nav groups */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {NAV_GROUPS.map((group) => (
          <div key={group.label}>
            <div
              className="eyebrow"
              style={{ padding: '0 12px 8px', fontSize: '0.625rem' }}
            >
              {group.label}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 2 }}>
              {group.items.map((item) => {
                const isActive = item.id === activeId;
                const Icon = item.icon;
                return (
                  <li key={item.id}>
                    <button
                      onClick={() => onSelect?.(item.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: isActive
                          ? 'rgba(77, 228, 255, 0.10)'
                          : 'transparent',
                        border: isActive
                          ? '1px solid var(--border-glow)'
                          : '1px solid transparent',
                        boxShadow: isActive ? 'var(--glow-soft)' : 'none',
                        color: isActive ? 'var(--cyan-bright)' : 'var(--text-secondary)',
                        fontSize: '0.9375rem',
                        fontWeight: 400,
                        textAlign: 'left',
                        transition: 'all var(--t-base)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'rgba(77, 228, 255, 0.05)';
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }
                      }}
                    >
                      <Icon size={18} strokeWidth={1.5} />
                      <span style={{ flex: 1 }}>{item.label}</span>
                      {item.pro && <span className="pro-badge">PRO</span>}
                      {isActive && <ChevronRight size={16} strokeWidth={1.5} />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '12px 8px',
          marginTop: 16,
          borderTop: '1px solid var(--border-faint)',
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'rgba(77, 228, 255, 0.15)',
            border: '1px solid var(--border-glow)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--cyan-bright)',
            fontWeight: 500,
            fontSize: '0.875rem',
          }}
        >
          {(user?.initial || 'G').toUpperCase()}
        </div>
        <span style={{ color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
          {user?.name || 'Guest'}
        </span>
      </div>
    </aside>
  );
}
