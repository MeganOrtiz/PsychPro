import React, { useState } from 'react';
import {
  Bell,
  TrendingUp,
  ArrowUpRight,
  Sparkles,
  BookOpen,
  Brain,
  Trophy,
  Calendar,
  Star,
  Share2,
  Flame,
  ChevronRight,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import TopicTile from '../components/TopicTile';
import CTAButton from '../components/CTAButton';

const RECOMMENDED = [
  { icon: Sparkles, title: 'Psychopharmacology', subtitle: 'Expand your knowledge' },
  { icon: BookOpen, title: 'Neurophysiology', subtitle: 'Strengthen your foundation' },
  { icon: Brain, title: 'Sensory Systems', subtitle: 'Sharpen your skills' },
  { icon: TrendingUp, title: 'Limbic System & Motivation', subtitle: 'Level up next' },
];

const LEADERBOARD = [
  { rank: 1, name: 'Scholar 1785', books: 0, fire: 0 },
  { rank: 2, name: 'Scholar 7135', books: 0, fire: 0 },
];

const REVIEWS = [
  { count: 1, title: 'Objective Measures', stage: 'Ready now · stage 1 of 4' },
  { count: 1, title: 'Neurophysiology', stage: 'Ready now · stage 1 of 4' },
];

export default function Dashboard() {
  const [activeNav, setActiveNav] = useState('dashboard');

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative' }}>
      <Sidebar activeId={activeNav} onSelect={setActiveNav} user={{ name: 'Guest', initial: 'G' }} />

      <main
        style={{
          flex: 1,
          padding: '32px 40px 48px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* ===================== TOP BAR ===================== */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            marginBottom: 32,
          }}
        >
          <div style={{ flex: 1 }} />
          <div style={{ textAlign: 'center', flex: 2 }}>
            <h1
              className="psychpro-wordmark"
              style={{
                fontSize: '1.75rem',
                marginBottom: 8,
                letterSpacing: '0.4em',
              }}
            >
              PSYCHPRO
            </h1>
            <div
              className="psychpro-tagline"
              style={{ fontSize: '0.75rem', letterSpacing: '0.35em' }}
            >
              ADVANCE YOUR MIND. ELEVATE CARE.
            </div>
          </div>
          <div
            style={{
              flex: 1,
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            <button
              aria-label="Notifications"
              style={{
                width: 42,
                height: 42,
                borderRadius: '50%',
                background: 'rgba(15, 33, 56, 0.6)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-soft)',
                transition: 'all var(--t-base)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-glow)';
                e.currentTarget.style.boxShadow = 'var(--glow-soft)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Bell size={18} strokeWidth={1.5} />
            </button>
          </div>
        </div>

        {/* ===================== MAIN GRID ===================== */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 340px',
            gap: 24,
            alignItems: 'start',
          }}
        >
          {/* ---------------- LEFT COLUMN ---------------- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Begin Your Journey */}
            <DashboardCard title="Begin Your Journey" titleIcon={TrendingUp}>
              <p className="muted" style={{ marginBottom: 20, fontSize: '0.9375rem' }}>
                Pick a topic to start your first study session. We'll keep track
                of your progress from here.
              </p>
              <CTAButton iconRight={ArrowUpRight}>Browse Topics</CTAButton>
            </DashboardCard>

            {/* Recommended */}
            <DashboardCard>
              <div style={{ marginBottom: 18 }}>
                <h2
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 500,
                    fontSize: '1.0625rem',
                    color: 'var(--text-primary)',
                    marginBottom: 4,
                  }}
                >
                  Recommended for You
                </h2>
                <div className="muted" style={{ fontSize: '0.875rem' }}>
                  Based on your goals and progress
                </div>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: 12,
                }}
              >
                {RECOMMENDED.map((t) => (
                  <TopicTile
                    key={t.title}
                    icon={t.icon}
                    title={t.title}
                    subtitle={t.subtitle}
                  />
                ))}
              </div>
            </DashboardCard>

            {/* Streak + Leaderboard row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 20,
              }}
            >
              <DashboardCard>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    marginBottom: 16,
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 500,
                      fontSize: '1.0625rem',
                      color: 'var(--text-primary)',
                    }}
                  >
                    Your Streak
                  </h3>
                  <Flame size={16} strokeWidth={1.5} style={{ color: '#FF8A4D' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontWeight: 200,
                      fontSize: '3rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1,
                    }}
                  >
                    0
                  </div>
                  <div className="muted" style={{ fontSize: '0.875rem', paddingBottom: 6 }}>
                    day streak
                  </div>
                </div>
                <div className="muted" style={{ fontSize: '0.8125rem', marginTop: 12 }}>
                  Study today to start a streak.
                </div>
                {/* Sparkline placeholder */}
                <svg
                  viewBox="0 0 200 30"
                  style={{ width: '100%', height: 20, marginTop: 16, opacity: 0.6 }}
                >
                  <path
                    d="M 0 25 Q 40 22 60 18 T 120 12 T 200 8"
                    stroke="var(--cyan-glow)"
                    strokeWidth="1.2"
                    fill="none"
                    style={{ filter: 'drop-shadow(0 0 4px var(--cyan-glow))' }}
                  />
                </svg>
              </DashboardCard>

              <DashboardCard
                titleIcon={Trophy}
                title="Leaderboard"
                trailing={
                  <a href="#" className="nav-link" style={{ fontSize: '0.75rem' }}>
                    View all
                  </a>
                }
              >
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {LEADERBOARD.map((row) => (
                    <li
                      key={row.rank}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        padding: '8px 0',
                      }}
                    >
                      <div
                        style={{
                          width: 24,
                          height: 24,
                          borderRadius: '50%',
                          background: 'rgba(255, 200, 100, 0.15)',
                          border: '1px solid rgba(255, 200, 100, 0.4)',
                          color: '#FFD27A',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                        }}
                      >
                        {row.rank}
                      </div>
                      <div style={{ flex: 1, color: 'var(--text-primary)', fontSize: '0.9375rem' }}>
                        {row.name}
                      </div>
                      <div
                        style={{
                          display: 'flex',
                          gap: 12,
                          color: 'var(--text-secondary)',
                          fontSize: '0.8125rem',
                        }}
                      >
                        <span>📖 {row.books}</span>
                        <span>🔥 {row.fire}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </DashboardCard>
            </div>
          </div>

          {/* ---------------- RIGHT COLUMN (SPOTLIGHT) ---------------- */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <DashboardCard style={{ textAlign: 'center', padding: 28 }}>
              <Star
                size={22}
                strokeWidth={1.5}
                style={{ color: 'var(--cyan-glow)', margin: '0 auto 12px' }}
              />
              <h2
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: '1.25rem',
                  color: 'var(--text-primary)',
                  marginBottom: 10,
                }}
              >
                Spotlight
              </h2>
              <p
                className="muted"
                style={{
                  fontSize: '0.875rem',
                  marginBottom: 24,
                  lineHeight: 1.5,
                }}
              >
                Highlighting the next generation of clinicians and researchers.
              </p>

              {/* Avatar with glow ring */}
              <div
                style={{
                  width: 130,
                  height: 130,
                  margin: '0 auto 18px',
                  borderRadius: '50%',
                  border: '2px solid var(--cyan-glow)',
                  boxShadow: '0 0 28px rgba(77, 228, 255, 0.5)',
                  background:
                    'radial-gradient(circle, rgba(77, 228, 255, 0.15) 0%, rgba(15, 33, 56, 0.6) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.5rem',
                  fontWeight: 300,
                  color: 'var(--cyan-bright)',
                }}
              >
                SK
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 500,
                  fontSize: '1.375rem',
                  color: 'var(--text-primary)',
                  marginBottom: 4,
                }}
              >
                Sarah K.
              </div>
              <div className="muted" style={{ fontSize: '0.9375rem' }}>
                PsyD Candidate
              </div>
              <div className="muted" style={{ fontSize: '0.9375rem', marginBottom: 24 }}>
                Clinical Neuropsychology
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 14,
                }}
              >
                <div className="eyebrow" style={{ color: 'var(--text-muted)' }}>
                  FEATURED WORK
                </div>
                <button
                  aria-label="Share"
                  style={{
                    color: 'var(--cyan-soft)',
                    display: 'flex',
                  }}
                >
                  <Share2 size={16} strokeWidth={1.5} />
                </button>
              </div>

              <CTAButton iconRight={ArrowUpRight} style={{ width: '100%' }}>
                View Feature
              </CTAButton>

              {/* Pagination dots */}
              <div
                style={{
                  display: 'flex',
                  gap: 6,
                  justifyContent: 'center',
                  marginTop: 18,
                }}
              >
                <span
                  style={{
                    width: 20,
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--cyan-glow)',
                  }}
                />
                <span
                  style={{
                    width: 6,
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--border-subtle)',
                  }}
                />
                <span
                  style={{
                    width: 6,
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--border-subtle)',
                  }}
                />
                <span
                  style={{
                    width: 6,
                    height: 4,
                    borderRadius: 2,
                    background: 'var(--border-subtle)',
                  }}
                />
              </div>
            </DashboardCard>

            {/* Today's Reviews */}
            <DashboardCard
              titleIcon={Calendar}
              title="Today's Reviews"
              trailing={
                <span
                  style={{
                    minWidth: 24,
                    height: 24,
                    padding: '0 8px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(77, 228, 255, 0.15)',
                    border: '1px solid var(--border-glow)',
                    color: 'var(--cyan-bright)',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  4
                </span>
              }
            >
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {REVIEWS.map((r, i) => (
                  <li
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      background: 'rgba(15, 33, 56, 0.4)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      transition: 'all var(--t-base)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-glow)';
                      e.currentTarget.style.boxShadow = 'var(--glow-soft)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 'var(--radius-sm)',
                        background: 'rgba(77, 228, 255, 0.12)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--cyan-bright)',
                        fontSize: '0.75rem',
                        fontWeight: 500,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {r.count}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          color: 'var(--text-primary)',
                          fontSize: '0.9375rem',
                          marginBottom: 2,
                        }}
                      >
                        {r.title}
                      </div>
                      <div className="muted" style={{ fontSize: '0.75rem' }}>
                        {r.stage}
                      </div>
                    </div>
                    <ChevronRight
                      size={16}
                      strokeWidth={1.5}
                      style={{ color: 'var(--text-muted)' }}
                    />
                  </li>
                ))}
              </ul>
            </DashboardCard>
          </div>
        </div>
      </main>
    </div>
  );
}
