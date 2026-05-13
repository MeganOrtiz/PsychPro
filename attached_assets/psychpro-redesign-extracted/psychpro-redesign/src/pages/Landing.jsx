import React from 'react';
import {
  GraduationCap,
  Brain,
  Briefcase,
  Users,
  BookOpen,
  Mail,
  Award,
  Globe,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Quote,
} from 'lucide-react';
import Header from '../components/Header';
import CTAButton from '../components/CTAButton';
import FeatureCard from '../components/FeatureCard';
import StatBlock from '../components/StatBlock';
import BrainMark from '../components/BrainMark';

const FEATURES = [
  {
    icon: GraduationCap,
    title: 'EXPERT-LED COURSES',
    description: 'Learn from leading professionals in clinical psychology.',
  },
  {
    icon: Brain,
    title: 'EVIDENCE-BASED',
    description: 'Content grounded in the latest research and best practices.',
  },
  {
    icon: Briefcase,
    title: 'PRACTICAL TOOLS',
    description: 'Resources and tools you can use in real-world settings.',
  },
  {
    icon: Users,
    title: 'PROFESSIONAL COMMUNITY',
    description: 'Connect, collaborate, and grow with peers worldwide.',
  },
];

const STATS = [
  { icon: Users, value: '25K+', label: 'MEMBERS' },
  { icon: BookOpen, value: '150+', label: 'COURSES' },
  { icon: Award, value: '10K+', label: 'CERTIFICATIONS' },
  { icon: Globe, value: '85+', label: 'COUNTRIES' },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', position: 'relative' }}>
      <Header activeItem="HOME" />

      {/* ===================== HERO ===================== */}
      <section
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: '20px 24px 80px',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Brain hero image */}
        <div
          style={{
            margin: '0 auto 32px',
            width: '100%',
            maxWidth: 600,
            aspectRatio: '1 / 1',
            position: 'relative',
          }}
        >
          {/*
            Replace src with your generated brain image once available.
            Image specs: glowing anatomical brain centered, soft cyan glow,
            surrounded by ethereal blue nebula clouds, NO lightning bolts.
          */}
          <img
            src="/brain-hero.png"
            alt="Glowing brain"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              filter: 'drop-shadow(0 0 60px rgba(77, 228, 255, 0.4))',
            }}
            onError={(e) => {
              // Fallback if asset missing — show a glowing placeholder circle
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div
            className="brain-hero-placeholder"
            style={{
              display: 'none',
              position: 'absolute',
              inset: 0,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(77, 228, 255, 0.3) 0%, rgba(27, 77, 122, 0.15) 40%, transparent 70%)',
              color: 'var(--text-muted)',
              fontSize: '0.875rem',
              letterSpacing: '0.1em',
            }}
          >
            Place brain-hero.png in /public
          </div>
        </div>

        {/* Wordmark */}
        <h1
          className="psychpro-wordmark"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 5rem)',
            marginBottom: 16,
            letterSpacing: 'clamp(0.25em, 0.5vw, 0.45em)',
          }}
        >
          PSYCHPRO
        </h1>

        {/* Tagline */}
        <div
          className="psychpro-tagline"
          style={{ fontSize: '1rem', marginBottom: 32, letterSpacing: '0.4em' }}
        >
          LEARN. EXPAND. CONNECT.
        </div>

        {/* Description */}
        <p
          className="muted"
          style={{
            maxWidth: 580,
            margin: '0 auto 40px',
            fontSize: '1.0625rem',
            lineHeight: 1.7,
          }}
        >
          Your all-in-one platform for mastering clinical psychology through
          expert-led courses, practical tools, and a supportive professional
          community.
        </p>

        {/* CTA buttons */}
        <div
          style={{
            display: 'flex',
            gap: 20,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <CTAButton icon={BookOpen}>EXPLORE COURSES</CTAButton>
          <CTAButton icon={Users}>JOIN COMMUNITY</CTAButton>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px 60px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 20,
          }}
        >
          {FEATURES.map((f) => (
            <FeatureCard
              key={f.title}
              icon={f.icon}
              title={f.title}
              description={f.description}
            />
          ))}
        </div>
      </section>

      {/* ===================== TRUST + TESTIMONIAL ===================== */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px 40px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: 20,
          }}
        >
          {/* Trust card */}
          <div className="glass-card" style={{ padding: 32 }}>
            <h3
              className="psychpro-tagline"
              style={{ marginBottom: 28, fontSize: '0.8125rem', letterSpacing: '0.2em' }}
            >
              TRUSTED BY
              <br />
              PSYCHOLOGY PROFESSIONALS
            </h3>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'space-between' }}>
              {STATS.map((s) => (
                <StatBlock key={s.label} icon={s.icon} value={s.value} label={s.label} />
              ))}
            </div>
          </div>

          {/* Testimonial card */}
          <div
            className="glass-card"
            style={{
              padding: 32,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 24,
            }}
          >
            <div style={{ display: 'flex', gap: 16 }}>
              <Quote
                size={28}
                strokeWidth={1.5}
                style={{ color: 'var(--cyan-glow)', flexShrink: 0 }}
              />
              <p
                style={{
                  color: 'var(--text-primary)',
                  fontSize: '1rem',
                  lineHeight: 1.6,
                  fontStyle: 'normal',
                }}
              >
                PsychPro has transformed the way I learn and apply clinical
                knowledge. The community and resources are unmatched.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '50%',
                  background: 'rgba(77, 228, 255, 0.15)',
                  border: '1px solid var(--border-glow)',
                  flexShrink: 0,
                }}
              />
              <div>
                <div style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                  Dr. Sarah Mitchell
                </div>
                <div className="muted" style={{ fontSize: '0.875rem' }}>
                  Clinical Psychologist
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== NEWSLETTER ===================== */}
      <section
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '0 24px 60px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div
          className="glass-card"
          style={{
            padding: '24px 32px',
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            flexWrap: 'wrap',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              flex: '1 1 240px',
            }}
          >
            <div className="icon-tile">
              <Mail size={20} strokeWidth={1.5} />
            </div>
            <div>
              <div
                className="psychpro-tagline"
                style={{ fontSize: '0.8125rem', letterSpacing: '0.2em', marginBottom: 4 }}
              >
                STAY INSPIRED.
              </div>
              <div className="muted" style={{ fontSize: '0.875rem' }}>
                Get expert insights and updates.
              </div>
            </div>
          </div>
          <input
            type="email"
            placeholder="Your email address"
            className="input-cyan"
            style={{ flex: '2 1 280px', maxWidth: 400 }}
          />
          <CTAButton>SUBSCRIBE</CTAButton>
        </div>
      </section>

      {/* ===================== FOOTER ===================== */}
      <footer
        style={{
          maxWidth: 1200,
          margin: '0 auto',
          padding: '32px 24px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
          borderTop: '1px solid var(--border-faint)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BrainMark size={22} />
          <span
            className="psychpro-wordmark"
            style={{ fontSize: '0.875rem', letterSpacing: '0.3em' }}
          >
            PSYCHPRO
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            color: 'var(--text-secondary)',
            fontSize: '0.8125rem',
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          <a href="#privacy" className="nav-link" style={{ fontSize: '0.75rem' }}>
            Privacy Policy
          </a>
          <span className="divider-vertical" />
          <a href="#terms" className="nav-link" style={{ fontSize: '0.75rem' }}>
            Terms of Service
          </a>
          <span className="divider-vertical" />
          <a href="#contact" className="nav-link" style={{ fontSize: '0.75rem' }}>
            Contact
          </a>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 16,
            color: 'var(--cyan-glow)',
          }}
        >
          {[Linkedin, Twitter, Instagram, Youtube].map((Icon, i) => (
            <a
              key={i}
              href="#"
              style={{
                color: 'var(--cyan-glow)',
                transition: 'color var(--t-base), transform var(--t-base)',
                display: 'flex',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = 'var(--cyan-bright)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--cyan-glow)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Icon size={18} strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
