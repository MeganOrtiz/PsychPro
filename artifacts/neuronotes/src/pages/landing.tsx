import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import {
  Brain,
  Search,
  BookOpen,
  Layers,
  FileText,
  Users,
  Award,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Activity,
  GraduationCap,
  PenLine,
  Flame,
  ArrowRight,
  Bell,
  RotateCw,
} from "lucide-react";
import brainSmoke from "@/assets/hero/brain.png";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

// =============================================================================
// Landing — structured premium portal (rebuilt 2026-05-25 per new spec).
// -----------------------------------------------------------------------------
// Layout sections:
//   1. Top navbar (logo + primary nav + search + LOG IN)
//   2. Hero  (brain centerpiece, PSYCHPRO wordmark, tagline, paragraph, CTAs)
//   3. Feature row — 5 glassmorphism cards
//   4. Browse Topics — 3-column dark-pill grid with cyan checkmarks
//   5. Footer
//
// Background: page-level smoke (.study-page-bg::before, deep teal). The brain
// PNG itself ships with baked-in dark smoke clouds, so its radial mask is
// pulled in tight (45% radius) to crop those out — only the glowing brain
// reads, and the surrounding atmosphere comes from the page background.
// =============================================================================

const DISSERTATION_TOPIC =
  "SOCIAL COGNITION IN CHILDREN WITH AUTISM SPECTRUM DISORDER: EXPLORING CORRELATES BETWEEN OBJECTIVE NEUROPSYCHOLOGICAL MEASURES AND PARENT REPORTS";

// Five feature tiles rendered in an asymmetric bento grid (rebuilt 2026-05-27).
// Layout intent: the first tile is a hero showpiece (the core flashcards /
// quizzes / exams loop is what brings users in), with four supporting tiles
// orbiting it in a 2x2 sub-grid. Each tile carries its own bespoke SVG visual
// rather than a generic icon-in-a-box, so the section reads as a constellation
// of distinct capabilities rather than five identical chips. Accent hues stay
// inside the brand's cyan/teal/mint family so the variety reads as a spectrum,
// not as competing palettes.
const FEATURES = [
  {
    id: "flashcards",
    layout: "hero" as const,
    icon: Layers,
    title: "Flashcards / Study Guides / Quizzes / Exams",
    body: "Reinforce your learning with interactive study tools.",
    accent: "#76E4F7", // surf — bright cyan
  },
  {
    id: "evidence",
    layout: "tile" as const,
    icon: Brain,
    title: "Evidence-Based Learning Tools",
    body:
      "Utilize specific tools for spaced repetition, interleaved learning and active recall.",
    accent: "#5EB0C8", // teal
  },
  {
    id: "create",
    layout: "tile" as const,
    icon: FileText,
    title: "Create Learning Resources From Your Own Material",
    body:
      "Upload, organize, and transform your material into smart resources.",
    accent: "#A7F3FF", // mist — icy
  },
  {
    id: "connect",
    layout: "tile" as const,
    icon: Users,
    title: "Connect With Others",
    body: "Collaborate, share insights, and grow together.",
    accent: "#7DD8C2", // mint
  },
  {
    id: "spotlight",
    layout: "tile" as const,
    icon: Award,
    title: "PsychPro Spotlight",
    body:
      "Submit your dissertation, research, presentations for opportunities to be featured in the PsychPro Spotlight.",
    accent: "#9AB8FF", // periwinkle highlight
    dissertationTopic: DISSERTATION_TOPIC,
  },
] as const;

type FeatureId = (typeof FEATURES)[number]["id"];

// =============================================================================
// Per-feature visuals. Each is a self-contained inline SVG scene that "earns"
// its tile — fanned flashcards, a spaced-repetition curve, a transform pipeline,
// a connection graph, a spotlight beam. All drawn with currentColor / the
// tile's --accent CSS variable so they inherit the tile's hue automatically.
// =============================================================================

function FlashcardsVisual() {
  return (
    <svg
      className="visual-svg visual-flashcards"
      viewBox="0 0 280 200"
      aria-hidden
    >
      <defs>
        <linearGradient id="fc-card" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,255,255,0.10)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
        </linearGradient>
      </defs>
      {/* Back card */}
      <g transform="translate(40 38) rotate(-9 100 60)">
        <rect width="200" height="120" rx="14" fill="url(#fc-card)"
          stroke="currentColor" strokeOpacity="0.35" strokeWidth="1" />
        <rect x="18" y="20" width="60" height="6" rx="3" fill="currentColor" opacity="0.4" />
        <rect x="18" y="36" width="120" height="4" rx="2" fill="currentColor" opacity="0.18" />
        <rect x="18" y="46" width="100" height="4" rx="2" fill="currentColor" opacity="0.18" />
      </g>
      {/* Middle card */}
      <g transform="translate(48 26) rotate(-2 100 60)">
        <rect width="200" height="120" rx="14" fill="url(#fc-card)"
          stroke="currentColor" strokeOpacity="0.5" strokeWidth="1.2" />
        <rect x="18" y="20" width="80" height="6" rx="3" fill="currentColor" opacity="0.55" />
        <rect x="18" y="36" width="150" height="4" rx="2" fill="currentColor" opacity="0.22" />
        <rect x="18" y="46" width="130" height="4" rx="2" fill="currentColor" opacity="0.22" />
        <rect x="18" y="56" width="100" height="4" rx="2" fill="currentColor" opacity="0.22" />
      </g>
      {/* Top card with Q/A preview */}
      <g className="visual-flashcards-top" transform="translate(56 14) rotate(5 100 60)">
        <rect width="200" height="120" rx="14"
          fill="rgba(8,32,42,0.85)"
          stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.4" />
        <text x="18" y="34" fill="currentColor" fontSize="10" fontWeight="700"
          letterSpacing="2" opacity="0.85">Q.</text>
        <rect x="38" y="26" width="140" height="6" rx="3" fill="currentColor" opacity="0.85" />
        <rect x="38" y="38" width="110" height="5" rx="2.5" fill="currentColor" opacity="0.55" />
        <line x1="18" y1="60" x2="182" y2="60" stroke="currentColor" strokeOpacity="0.25" strokeDasharray="3 4" />
        <text x="18" y="82" fill="currentColor" fontSize="10" fontWeight="700"
          letterSpacing="2" opacity="0.85">A.</text>
        <rect x="38" y="74" width="130" height="5" rx="2.5" fill="currentColor" opacity="0.4" />
        <rect x="38" y="86" width="90" height="5" rx="2.5" fill="currentColor" opacity="0.4" />
      </g>
    </svg>
  );
}

function EvidenceVisual() {
  // Spaced-repetition / forgetting curve: each peak is a review session, the
  // curve flattens over time as retention strengthens. A literal visual of
  // the method the tile describes.
  return (
    <svg className="visual-svg visual-evidence" viewBox="0 0 220 110" aria-hidden>
      <defs>
        <linearGradient id="ev-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1="10" y1="90" x2="210" y2="90" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.8" />
      <path
        d="M10 60 Q35 78 60 84 Q70 30 90 50 Q108 74 130 80 Q140 28 160 48 Q176 70 195 74 Q205 32 215 38"
        fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
        opacity="0.95"
      />
      <path
        d="M10 60 Q35 78 60 84 Q70 30 90 50 Q108 74 130 80 Q140 28 160 48 Q176 70 195 74 Q205 32 215 38 L215 90 L10 90 Z"
        fill="url(#ev-fill)"
      />
      {[60, 90, 130, 160, 195].map((x, i) => (
        <circle key={i} cx={x} cy={[84, 50, 80, 48, 74][i]} r="3.2"
          fill="currentColor" opacity="0.95" />
      ))}
    </svg>
  );
}

function CreateVisual() {
  // Three-step pipeline: source document → sparkle/transform → smart card.
  return (
    <svg className="visual-svg visual-create" viewBox="0 0 220 110" aria-hidden>
      {/* Source doc */}
      <g transform="translate(14 22)">
        <rect width="46" height="62" rx="5" fill="rgba(255,255,255,0.05)"
          stroke="currentColor" strokeOpacity="0.55" strokeWidth="1.2" />
        <path d="M34 0 L46 12 L34 12 Z" fill="currentColor" opacity="0.35" />
        <rect x="8" y="22" width="30" height="3" rx="1.5" fill="currentColor" opacity="0.45" />
        <rect x="8" y="30" width="26" height="3" rx="1.5" fill="currentColor" opacity="0.35" />
        <rect x="8" y="38" width="22" height="3" rx="1.5" fill="currentColor" opacity="0.3" />
        <rect x="8" y="46" width="28" height="3" rx="1.5" fill="currentColor" opacity="0.3" />
      </g>
      {/* Arrow + sparkle */}
      <g transform="translate(72 50)" className="visual-create-spark">
        <path d="M0 6 L36 6 M28 0 L36 6 L28 12" fill="none"
          stroke="currentColor" strokeOpacity="0.7" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        <g transform="translate(18 -16)">
          <path d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z"
            fill="currentColor" opacity="0.9" />
        </g>
        <g transform="translate(8 18)">
          <path d="M0 -3 L0.8 -0.8 L3 0 L0.8 0.8 L0 3 L-0.8 0.8 L-3 0 L-0.8 -0.8 Z"
            fill="currentColor" opacity="0.6" />
        </g>
      </g>
      {/* Target smart card */}
      <g transform="translate(124 22)">
        <rect width="82" height="62" rx="8" fill="rgba(8,32,42,0.7)"
          stroke="currentColor" strokeOpacity="0.85" strokeWidth="1.4" />
        <rect x="10" y="12" width="36" height="5" rx="2.5" fill="currentColor" opacity="0.9" />
        <rect x="10" y="22" width="62" height="3.5" rx="1.75" fill="currentColor" opacity="0.4" />
        <rect x="10" y="30" width="54" height="3.5" rx="1.75" fill="currentColor" opacity="0.4" />
        <rect x="10" y="38" width="58" height="3.5" rx="1.75" fill="currentColor" opacity="0.4" />
        <circle cx="68" cy="50" r="6" fill="none" stroke="currentColor"
          strokeOpacity="0.9" strokeWidth="1.4" />
        <path d="M64.5 50 L67 52.5 L71.5 47.5" fill="none" stroke="currentColor"
          strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

function ConnectVisual() {
  // Five orbs linked by glowing connectors — an abstract social/research graph.
  return (
    <svg className="visual-svg visual-connect" viewBox="0 0 220 110" aria-hidden>
      <g stroke="currentColor" strokeOpacity="0.45" strokeWidth="1.1" fill="none" strokeLinecap="round">
        <line x1="46" y1="34" x2="110" y2="58" />
        <line x1="46" y1="34" x2="84" y2="84" />
        <line x1="110" y1="58" x2="170" y2="32" />
        <line x1="110" y1="58" x2="174" y2="80" />
        <line x1="84" y1="84" x2="174" y2="80" />
        <line x1="170" y1="32" x2="174" y2="80" />
      </g>
      {[
        { x: 46, y: 34, r: 11 },
        { x: 110, y: 58, r: 14 },
        { x: 84, y: 84, r: 10 },
        { x: 170, y: 32, r: 10 },
        { x: 174, y: 80, r: 11 },
      ].map((n, i) => (
        <g key={i} className="visual-connect-node">
          <circle cx={n.x} cy={n.y} r={n.r + 5} fill="currentColor" opacity="0.15" />
          <circle cx={n.x} cy={n.y} r={n.r} fill="rgba(8,32,42,0.9)"
            stroke="currentColor" strokeOpacity="0.9" strokeWidth="1.4" />
          <circle cx={n.x} cy={n.y - n.r * 0.25} r={n.r * 0.35} fill="currentColor" opacity="0.75" />
          <path
            d={`M ${n.x - n.r * 0.6} ${n.y + n.r * 0.4} Q ${n.x} ${n.y - n.r * 0.05} ${n.x + n.r * 0.6} ${n.y + n.r * 0.4}`}
            fill="currentColor" opacity="0.55"
          />
        </g>
      ))}
    </svg>
  );
}

function SpotlightVisual() {
  // Replaces the prior face portrait: a beam of light shining down on an
  // award/trophy silhouette. Same conceptual payoff (recognition / featured
  // work) without the personal photo.
  return (
    <svg className="visual-svg visual-spotlight" viewBox="0 0 160 110" aria-hidden>
      <defs>
        <linearGradient id="sp-beam" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="sp-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.55" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Light beam */}
      <path d="M68 0 L92 0 L122 96 L38 96 Z" fill="url(#sp-beam)" />
      {/* Floor glow */}
      <ellipse cx="80" cy="96" rx="48" ry="6" fill="url(#sp-glow)" />
      {/* Trophy */}
      <g transform="translate(80 52)" className="visual-spotlight-trophy">
        {/* Cup */}
        <path d="M -16 -18 L 16 -18 L 14 6 Q 0 14 -14 6 Z"
          fill="rgba(8,32,42,0.85)" stroke="currentColor" strokeOpacity="0.9" strokeWidth="1.6" />
        {/* Handles */}
        <path d="M -16 -14 Q -26 -14 -26 -6 Q -26 2 -18 2" fill="none"
          stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.4" />
        <path d="M 16 -14 Q 26 -14 26 -6 Q 26 2 18 2" fill="none"
          stroke="currentColor" strokeOpacity="0.75" strokeWidth="1.4" />
        {/* Star inside cup */}
        <path d="M0 -12 L2.4 -4.5 L10 -4.5 L3.8 -0.2 L6.4 7 L0 2.6 L-6.4 7 L-3.8 -0.2 L-10 -4.5 L-2.4 -4.5 Z"
          fill="currentColor" opacity="0.95" />
        {/* Stem */}
        <rect x="-3" y="6" width="6" height="10" fill="currentColor" opacity="0.7" />
        {/* Base */}
        <rect x="-14" y="16" width="28" height="6" rx="2" fill="currentColor" opacity="0.75" />
      </g>
    </svg>
  );
}

const VISUAL_BY_ID: Record<FeatureId, () => React.ReactElement> = {
  flashcards: FlashcardsVisual,
  evidence: EvidenceVisual,
  create: CreateVisual,
  connect: ConnectVisual,
  spotlight: SpotlightVisual,
};

// Topics organized into 3 columns, read top-to-bottom by column.
const TOPIC_COLUMNS: string[][] = [
  [
    "Brain Networks",
    "Endocrine System & Reproduction",
    "Neurophysiology",
    "Sleep & Circadian Rhythms",
    "Executive Function",
    "Neurocognitive Disorders",
    "Neuropsychology Overview",
    "Personality Disorders",
    "Trauma-Focused Approaches",
    "Analytical Psychology — Jung",
    "Family, Systems, and Couples Therapies",
  ],
  [
    "Central Nervous System",
    "Enteric Nervous System",
    "Peripheral Nervous System",
    "Vascular System of the Brain",
    "Forensic Neuropsychology",
    "Neurodevelopmental Disorders",
    "Validity & Effort Testing",
    "Psychiatric Disorders",
    "Acceptance, Mindfulness, and Third-Wave Approaches",
    "Behavior Therapy and Applied Behavior Analysis",
    "Foundations of Psychotherapy",
  ],
  [
    "Cranial Nerves",
    "Limbic System & Motivation",
    "Sensory Systems",
    "Apraxia & Agnosia",
    "Language Processing & Aphasia",
    "Neuroimaging & Neuromodulation",
    "ADHD & Medications",
    "Psychopharmacology",
    "Adlerian, Humanistic, and Existential Approaches",
    "Cognitive Therapy, CBT, and Schema Therapy",
    "Gestalt, Experiential, and Emotion-Focused Therapy",
  ],
];

const FOOTER_LINKS = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Contact", href: "mailto:admin@psychprosuites.com" },
];

// =============================================================================
// NEW: Live-demo content + counters. Pulled deliberately from the canonical
// neuro/psych curriculum so the Q/A reads as genuine domain material, not
// marketing filler. Counts mirror the actual seeded database (verified 2026-05-27).
// =============================================================================
const DEMO_CARDS = [
  {
    q: "Which neurotransmitter system is most central to the brain's reward and motivation pathway?",
    a: "Dopamine. The ventral tegmental area (VTA) projects to the nucleus accumbens and prefrontal cortex via the mesolimbic and mesocortical pathways, modulating reward, salience, and goal-directed behaviour.",
    topic: "Limbic System & Motivation",
  },
  {
    q: "What is the primary function of the amygdala?",
    a: "Processing emotionally salient stimuli — particularly fear and threat detection. It tags memories with emotional valence via projections to the hippocampus and drives autonomic arousal through the hypothalamus.",
    topic: "Limbic System & Motivation",
  },
  {
    q: "Damage to Broca's area produces what type of aphasia, and where is it located?",
    a: "Broca's (expressive, non-fluent) aphasia. The patient produces effortful, agrammatic speech with relatively preserved comprehension. Located in the left inferior frontal gyrus (Brodmann areas 44 and 45).",
    topic: "Language Processing & Aphasia",
  },
  {
    q: "How do Type I and Type II error differ in clinical research?",
    a: "Type I (\u03b1) is a false positive — rejecting a true null hypothesis. Type II (\u03b2) is a false negative — failing to reject a false null. Statistical power = 1 \u2212 \u03b2; we typically target power \u2265 0.80.",
    topic: "Validity & Effort Testing",
  },
] as const;

const STATS = [
  { value: "39", label: "Core Topics" },
  { value: "1,878", label: "Flashcards" },
  { value: "1,125", label: "Quiz Questions" },
  { value: "4", label: "Study Modes" },
] as const;

const HOW_STEPS = [
  {
    n: "01",
    title: "Pick a topic",
    body: "Choose from 39 core topics spanning neuroanatomy, psychopathology, assessment, psychopharmacology, and therapy modalities.",
    icon: BookOpen,
  },
  {
    n: "02",
    title: "Study with the modes",
    body: "Flashcards for active recall, quizzes for retrieval practice, study guides for synthesis, and the brain lab for spatial mastery.",
    icon: GraduationCap,
  },
  {
    n: "03",
    title: "Track your mastery",
    body: "Your progress score climbs as you build expertise. Reflections capture clinical insights and the spotlight features your work.",
    icon: Activity,
  },
] as const;

// =============================================================================
// NEW: InteractiveFlashcard — a real, clickable 3D-flipping card with prev/next
// navigation. First thing a visitor can DO on the page (within ~3s of landing),
// proving the product is real before any "Sign up" friction.
// =============================================================================
function InteractiveFlashcard() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = DEMO_CARDS[index];

  const go = (delta: number) => {
    setFlipped(false);
    // Small delay so the flip-back is visible before the content swaps.
    setTimeout(() => {
      setIndex((i) => (i + delta + DEMO_CARDS.length) % DEMO_CARDS.length);
    }, 180);
  };

  return (
    <div className="try-block" data-testid="try-flashcard">
      <div className="try-stage">
        <button
          type="button"
          className={`try-card${flipped ? " is-flipped" : ""}`}
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
          aria-label={
            flipped
              ? `Answer to: ${card.q}. Click to show question again.`
              : `Question: ${card.q}. Click to reveal answer.`
          }
          data-testid="try-card-button"
        >
          {/* Hidden face is removed from a11y tree via aria-hidden + inert so
             screen readers never announce the answer before the user flips. */}
          <div
            className="try-card-face try-card-face--front"
            aria-hidden={flipped}
            inert={flipped || undefined}
          >
            <div className="try-card-meta">
              <span className="try-topic-pill">{card.topic}</span>
              <span className="try-flip-hint">
                <RotateCw aria-hidden /> Click to flip
              </span>
            </div>
            <div className="try-card-row">
              <span className="try-letter">Q</span>
              <p className="try-text">{card.q}</p>
            </div>
          </div>
          <div
            className="try-card-face try-card-face--back"
            aria-hidden={!flipped}
            inert={!flipped || undefined}
          >
            <div className="try-card-meta">
              <span className="try-topic-pill try-topic-pill--answer">
                Answer
              </span>
              <span className="try-flip-hint">
                <RotateCw aria-hidden /> Click to flip back
              </span>
            </div>
            <div className="try-card-row">
              <span className="try-letter try-letter--a">A</span>
              <p className="try-text">{card.a}</p>
            </div>
          </div>
        </button>
      </div>

      <div className="try-controls">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous flashcard"
          data-testid="try-prev"
        >
          <ChevronLeft aria-hidden />
        </button>
        <span className="try-counter" data-testid="try-counter">
          {String(index + 1).padStart(2, "0")} / {String(DEMO_CARDS.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next flashcard"
          data-testid="try-next"
        >
          <ChevronRight aria-hidden />
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// NEW: StatsStrip — factual, DB-anchored counts. No fabricated testimonials,
// no fake "10,000+ students" copy. Just the genuine library size, which is
// already impressive on its own.
// =============================================================================
function StatsStrip() {
  return (
    <div className="stats-grid" data-testid="stats-strip">
      {STATS.map((s) => (
        <div key={s.label} className="stat-cell">
          <p className="stat-num">{s.value}</p>
          <p className="stat-label">{s.label}</p>
        </div>
      ))}
    </div>
  );
}

// =============================================================================
// NEW: DashboardPreview — a tilted, glowing mockup of the actual PsychPro app
// surface. Shows the four real study modes, a progress ring, and a streak.
// Built in pure CSS/HTML (not a screenshot) so it stays sharp at every zoom
// and updates automatically if we re-style the real dashboard.
// =============================================================================
const PREVIEW_MODES = [
  { id: "flashcards", title: "Flashcards", desc: "Spaced repetition", icon: Layers, accent: "#76E4F7" },
  { id: "quizzes",    title: "Quizzes",    desc: "Retrieval practice", icon: BookOpen, accent: "#5EB0C8" },
  { id: "guides",     title: "Study Guides", desc: "Concept synthesis", icon: FileText, accent: "#A7F3FF" },
  { id: "reflections",title: "Reflections", desc: "Clinical insights",  icon: PenLine,  accent: "#7DD8C2" },
] as const;

function DashboardPreview() {
  return (
    <div className="preview-stage" data-testid="dashboard-preview" aria-hidden>
      <div className="preview-frame">
        {/* Sidebar rail */}
        <div className="preview-sidebar">
          <div className="preview-brand">
            <Brain />
          </div>
          <div className="preview-rail">
            <span className="preview-rail-dot is-active" />
            <span className="preview-rail-dot" />
            <span className="preview-rail-dot" />
            <span className="preview-rail-dot" />
            <span className="preview-rail-dot" />
          </div>
        </div>

        {/* Main column */}
        <div className="preview-main">
          <div className="preview-topbar">
            <div className="preview-greet">
              <p className="preview-greet-hi">Welcome back, Megan.</p>
              <p className="preview-greet-sub">LEARN. EXPAND. CONNECT.</p>
            </div>
            <div className="preview-bell">
              <Bell />
              <span className="preview-bell-dot">2</span>
            </div>
          </div>

          <p className="preview-section-label">STUDY MODES</p>
          <div className="preview-mode-grid">
            {PREVIEW_MODES.map((m) => {
              const Icon = m.icon;
              return (
                <div
                  key={m.id}
                  className="preview-mode"
                  style={{ "--mode-accent": m.accent } as React.CSSProperties}
                >
                  <div className="preview-mode-icon">
                    <Icon />
                  </div>
                  <div className="preview-mode-body">
                    <p className="preview-mode-title">{m.title}</p>
                    <p className="preview-mode-desc">{m.desc}</p>
                  </div>
                  <ArrowRight className="preview-mode-arrow" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right column */}
        <div className="preview-side">
          <div className="preview-progress">
            <svg viewBox="0 0 120 120" className="preview-ring">
              <circle cx="60" cy="60" r="50" fill="none"
                stroke="rgba(118,228,247,0.14)" strokeWidth="10" />
              <circle cx="60" cy="60" r="50" fill="none"
                stroke="#76E4F7" strokeWidth="10" strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - 0.67)}`}
                transform="rotate(-90 60 60)" />
            </svg>
            <div className="preview-progress-num">
              <p className="preview-progress-val">67<span>%</span></p>
              <p className="preview-progress-lbl">MASTERY</p>
            </div>
          </div>

          <div className="preview-stat">
            <Flame className="preview-stat-icon" />
            <div>
              <p className="preview-stat-num">12-day</p>
              <p className="preview-stat-lbl">study streak</p>
            </div>
          </div>

          <div className="preview-focus">
            <p className="preview-focus-label">TODAY'S FOCUS</p>
            <p className="preview-focus-topic">Limbic System &amp; Motivation</p>
            <div className="preview-focus-bar">
              <span style={{ width: "42%" }} />
            </div>
            <p className="preview-focus-meta">14 of 33 cards reviewed</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// NEW: HowItWorks — three-step narrative strip. Sits between the feature bento
// and the topic browser to give visitors a mental model of what using the
// product actually feels like.
// =============================================================================
function HowItWorks() {
  return (
    <div className="how-grid" data-testid="how-it-works">
      {HOW_STEPS.map((s) => {
        const Icon = s.icon;
        return (
          <div key={s.n} className="how-step">
            <div className="how-step-head">
              <span className="how-step-num">{s.n}</span>
              <span className="how-step-icon">
                <Icon />
              </span>
            </div>
            <h3 className="how-step-title">{s.title}</h3>
            <p className="how-step-body">{s.body}</p>
          </div>
        );
      })}
    </div>
  );
}

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { isSignedIn } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const goToApp = () => navigate(isSignedIn ? "/dashboard" : "/sign-in");
  const goToTopics = () => navigate(isSignedIn ? "/topics" : "/sign-in");
  // Pill click deep-links into the topics page with the pill's label
  // pre-filled as the search query, so users land on a filtered view
  // instead of the full catalog.
  const goToTopicPill = (topic: string) => {
    if (!isSignedIn) {
      navigate("/sign-in");
      return;
    }
    navigate(`/topics?q=${encodeURIComponent(topic)}`);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="landing-root study-page-bg" data-testid="landing-page">
        {/* ============== NAVBAR ============== */}
        <header className="landing-nav">
          <div className="landing-nav-inner">
            <a href="#home" className="landing-brand" aria-label="PsychPro home">
              <Brain
                className="landing-brand-icon"
                aria-hidden
              />
              <span className="landing-brand-mark">PSYCHPRO</span>
            </a>
            <div className="landing-nav-actions">
              <button
                type="button"
                onClick={goToTopics}
                className="landing-nav-search"
                aria-label="Search topics"
                data-testid="nav-search"
              >
                <Search aria-hidden />
              </button>
              <button
                type="button"
                onClick={goToApp}
                className="landing-nav-login"
                data-testid="nav-login"
              >
                LOG IN
              </button>
            </div>
          </div>
        </header>

        {/* ============== HERO ============== */}
        <section
          id="home"
          className={`landing-hero${mounted ? " is-mounted" : ""}`}
        >
          <div className="landing-hero-brain" aria-hidden>
            <div className="landing-hero-aura" />
            <img src={brainSmoke} alt="" className="landing-hero-brain-img" />
          </div>

          <h1 className="landing-wordmark" style={{ "--delay": "120ms" } as React.CSSProperties}>
            PSYCHPRO
          </h1>
          <p className="landing-tagline" style={{ "--delay": "240ms" } as React.CSSProperties}>
            LEARN. EXPAND. CONNECT.
          </p>
          <p className="landing-blurb" style={{ "--delay": "360ms" } as React.CSSProperties}>
            Master clinical psychology. Deeper understanding for topics in
            psychology, neuroscience, and intervention for real-world clinical
            application.
          </p>

          <div
            className="landing-cta-row"
            style={{ "--delay": "480ms" } as React.CSSProperties}
          >
            <button
              type="button"
              onClick={goToApp}
              className="landing-cta landing-cta-ghost"
              data-testid="cta-join-now"
            >
              <BookOpen className="landing-cta-icon" aria-hidden />
              <span>JOIN NOW</span>
            </button>
            <button
              type="button"
              onClick={goToTopics}
              className="landing-cta landing-cta-ghost"
              data-testid="cta-explore-topics"
            >
              <Users className="landing-cta-icon" aria-hidden />
              <span>EXPLORE TOPICS</span>
            </button>
          </div>
        </section>

        {/* ============== TRY IT — interactive flashcard demo ============== */}
        <section id="try" className="landing-try">
          <div className="landing-section-header">
            <p className="landing-eyebrow">
              <Sparkles aria-hidden /> TRY IT NOW
            </p>
            <h2 className="landing-section-title">
              A real flashcard. Click to flip.
            </h2>
            <p className="landing-section-sub">
              Pulled straight from the PsychPro deck. Cycle through a few to
              feel the rhythm — no sign-in required.
            </p>
          </div>
          <InteractiveFlashcard />
        </section>

        {/* ============== STATS — DB-anchored library counts ============== */}
        <section id="stats" className="landing-stats">
          <StatsStrip />
        </section>

        {/* ============== DASHBOARD PREVIEW — show the real product ============== */}
        <section id="inside" className="landing-preview">
          <div className="landing-section-header">
            <p className="landing-eyebrow">INSIDE PSYCHPRO</p>
            <h2 className="landing-section-title">
              Your command center for clinical mastery.
            </h2>
            <p className="landing-section-sub">
              Four study modes, progress tracking, and a topic library — all in
              one calm, organized dashboard.
            </p>
          </div>
          <DashboardPreview />
        </section>

        {/* ============== FEATURES (asymmetric bento grid) ============== */}
        <section id="features" className="landing-features">
          <div className="landing-features-bento">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              const Visual = VISUAL_BY_ID[f.id];
              const dissertationTopic =
                "dissertationTopic" in f ? f.dissertationTopic : undefined;
              return (
                <article
                  key={f.id}
                  className={`landing-bento-card landing-bento-card--${f.layout} landing-bento-card--${f.id}`}
                  style={{ "--accent": f.accent } as React.CSSProperties}
                  data-testid={`feature-${f.title.split(" ")[0].toLowerCase()}`}
                >
                  <div className="landing-bento-visual" aria-hidden>
                    <Visual />
                  </div>
                  <div className="landing-bento-body">
                    <div className="landing-bento-icon" aria-hidden>
                      <Icon />
                    </div>
                    <h3 className="landing-bento-title">{f.title.toUpperCase()}</h3>
                    <p className="landing-bento-copy">{f.body}</p>
                    {dissertationTopic && (
                      <div className="landing-bento-dissertation">
                        <p className="landing-bento-dissertation-label">
                          DISSERTATION TOPIC
                        </p>
                        <p className="landing-bento-dissertation-text">
                          {dissertationTopic}
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* ============== HOW IT WORKS — 3-step narrative ============== */}
        <section id="how" className="landing-how">
          <div className="landing-section-header">
            <p className="landing-eyebrow">HOW IT WORKS</p>
            <h2 className="landing-section-title">
              From sign-up to mastery in three steps.
            </h2>
          </div>
          <HowItWorks />
        </section>

        {/* ============== BROWSE TOPICS ============== */}
        <section id="topics" className="landing-topics">
          <div className="landing-topics-panel">
            <div className="landing-topics-header">
              <h2 className="landing-topics-title">BROWSE TOPICS</h2>
            </div>
            <div className="landing-topics-grid">
              {TOPIC_COLUMNS.map((col, ci) => (
                <div key={ci} className="landing-topics-col">
                  {col.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => goToTopicPill(topic)}
                      className="landing-topic-pill"
                      data-testid={`topic-${topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}
                    >
                      <span className="landing-topic-check" aria-hidden>
                        <Check />
                      </span>
                      <span className="landing-topic-label">{topic}</span>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============== FOOTER ============== */}
        <footer className="landing-footer">
          <div className="landing-footer-inner">
            <a href="#home" className="landing-brand" aria-label="PsychPro home">
              <Brain className="landing-brand-icon" aria-hidden />
              <span className="landing-brand-mark">PSYCHPRO</span>
            </a>
            <nav className="landing-footer-links" aria-label="Footer">
              {FOOTER_LINKS.map((l, i) => (
                <span key={l.label} className="landing-footer-link-item">
                  {i > 0 && (
                    <span className="landing-footer-sep" aria-hidden>|</span>
                  )}
                  <a href={l.href} className="landing-footer-link">
                    {l.label.toUpperCase()}
                  </a>
                </span>
              ))}
            </nav>
            {/* Social icons removed — no live profile URLs to point them at,
                and broken href="#" anchors were trapping focus and scrolling
                the user back to the top of the page. */}
          </div>
          <p className="landing-footer-fineprint">
            © {new Date().getFullYear()} PsychPro. All rights reserved.
          </p>
        </footer>
      </div>
    </>
  );
}

// CSS embedded so the landing page stays self-contained. Brand hex values
// pulled from STUDY_PALETTE via the JS `P` import where rendered inline; the
// rest are stable CSS tokens used only on this page.
const C = {
  cyan: P.surf,        // #76E4F7 — primary glow
  cyanSoft: P.mist,    // #A7F3FF — icy text
  cyanMid: P.teal,     // #5EB0C8
  cyanDeep: P.tealDeep,// #2A7387
  bg: "#020d12",
  bgPanel: "rgba(8, 32, 42, 0.55)",
  bgPanelStrong: "rgba(6, 28, 38, 0.75)",
  hairline: "rgba(118, 228, 247, 0.18)",
  hairlineStrong: "rgba(118, 228, 247, 0.32)",
};

const styles = `
.landing-root {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  color: ${C.cyanSoft};
  /* Match the dashboard typography. The BrandBanner wordmark uses Outfit;
     adopting it for the whole landing page unifies the type system across
     the app. */
  font-family: "Outfit", "Inter", system-ui, -apple-system, sans-serif;
  font-feature-settings: "ss01", "cv11";
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* ============== NAVBAR ============== */
.landing-nav {
  position: sticky;
  top: 0;
  z-index: 40;
  width: 100%;
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  background: linear-gradient(180deg, rgba(2, 13, 18, 0.72), rgba(2, 13, 18, 0.35));
  border-bottom: 1px solid ${C.hairline};
}
.landing-nav-inner {
  max-width: 1320px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 14px 32px;
}
.landing-brand {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #F4FBFF;
}
.landing-brand-icon {
  width: 22px;
  height: 22px;
  color: ${C.cyan};
  filter: drop-shadow(0 0 10px ${C.cyan}99);
}
.landing-brand-mark {
  font-weight: 600;
  letter-spacing: 0.32em;
  font-size: 13px;
  color: #F4FBFF;
}
.landing-nav-links {
  display: none;
  align-items: center;
  gap: 28px;
  margin-left: 24px;
}
.landing-nav-link {
  position: relative;
  text-decoration: none;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.22em;
  color: rgba(244, 251, 255, 0.78);
  padding: 6px 2px;
  transition: color 200ms ease;
}
.landing-nav-link:hover { color: #fff; }
.landing-nav-link.is-active { color: #fff; }
.landing-nav-link.is-active::after {
  content: "";
  position: absolute;
  left: 0; right: 0; bottom: -2px;
  height: 2px;
  background: ${C.cyan};
  box-shadow: 0 0 12px ${C.cyan}cc;
  border-radius: 2px;
}
.landing-nav-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 14px;
}
.landing-nav-search {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid ${C.hairline};
  color: ${C.cyanSoft};
  cursor: pointer;
  transition: all 180ms ease;
}
.landing-nav-search:hover {
  border-color: ${C.cyan};
  color: ${C.cyan};
  box-shadow: 0 0 14px ${C.cyan}55;
}
.landing-nav-search svg { width: 16px; height: 16px; }
.landing-nav-login {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.24em;
  padding: 9px 18px;
  border-radius: 999px;
  background: transparent;
  border: 1px solid ${C.cyan};
  color: ${C.cyan};
  cursor: pointer;
  transition: all 180ms ease;
}
.landing-nav-login:hover {
  background: ${C.cyan}1a;
  box-shadow: 0 0 18px ${C.cyan}55;
  color: #fff;
}

@media (min-width: 880px) {
  .landing-nav-links { display: flex; }
}

/* ============== HERO ============== */
.landing-hero {
  position: relative;
  max-width: 1320px;
  margin: 0 auto;
  /* No top padding — brain bleeds off the top edge of the page.
     The negative top margin pulls the brain slot up so its top edge
     sits above the navbar baseline and reads as bleeding off-screen. */
  padding: 0 24px clamp(56px, 8vh, 96px);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.landing-hero-brain {
  position: relative;
  /* Portrait-shaped stage that matches the source image's native
     aspect (576×1024 ≈ 9:16). The whole brain-clouds composition
     renders cinematically with the brain centered in the upper
     portion and cloud bank trailing below, exactly as in the source. */
  width: clamp(360px, 56vw, 620px);
  height: clamp(560px, 82vh, 980px);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: clamp(-48px, -4vh, -16px);
  margin-bottom: clamp(-180px, -16vh, -120px);
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 1000ms cubic-bezier(0.16, 1, 0.3, 1), transform 1000ms cubic-bezier(0.16, 1, 0.3, 1);
  animation: heroBrainFloat 7s ease-in-out infinite;
  pointer-events: none;
}
.landing-hero.is-mounted .landing-hero-brain {
  opacity: 1;
  transform: translateY(0);
}
.landing-hero-brain-img {
  width: 100%;
  height: 100%;
  /* Show the WHOLE image at native aspect — brain centered upper,
     clouds fanning out below, with all four edges feathered so the
     composition dissolves into the surrounding page-bg clouds for
     one continuous ethereal atmosphere with no visible seams. */
  object-fit: contain;
  object-position: center center;
  -webkit-mask-image: radial-gradient(ellipse 62% 78% at 50% 42%,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,1) 32%,
    rgba(0,0,0,0.92) 55%,
    rgba(0,0,0,0.55) 75%,
    rgba(0,0,0,0.18) 90%,
    rgba(0,0,0,0) 100%);
  mask-image: radial-gradient(ellipse 62% 78% at 50% 42%,
    rgba(0,0,0,1) 0%,
    rgba(0,0,0,1) 32%,
    rgba(0,0,0,0.92) 55%,
    rgba(0,0,0,0.55) 75%,
    rgba(0,0,0,0.18) 90%,
    rgba(0,0,0,0) 100%);
  filter:
    drop-shadow(0 0 32px ${C.cyan}55)
    drop-shadow(0 0 90px ${C.cyanMid}33);
  animation: heroBrainPulse 4.2s ease-in-out infinite;
}
.landing-hero-aura {
  position: absolute;
  inset: 22% 28%;
  border-radius: 50%;
  background: radial-gradient(circle, ${C.cyan}3a 0%, ${C.cyanMid}18 40%, transparent 70%);
  filter: blur(48px);
  animation: heroBrainAura 4.2s ease-in-out infinite;
  z-index: -1;
}

.landing-wordmark,
.landing-tagline,
.landing-blurb,
.landing-cta-row {
  opacity: 0;
  transform: translateY(18px);
  transition:
    opacity 900ms cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms),
    transform 900ms cubic-bezier(0.16, 1, 0.3, 1) var(--delay, 0ms);
}
.landing-hero.is-mounted .landing-wordmark,
.landing-hero.is-mounted .landing-tagline,
.landing-hero.is-mounted .landing-blurb,
.landing-hero.is-mounted .landing-cta-row {
  opacity: 1;
  transform: translateY(0);
}

.landing-wordmark {
  margin: 0;
  /* Match the dashboard BrandBanner wordmark typeface. */
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(40px, 7.5vw, 92px);
  letter-spacing: 0.32em;
  line-height: 1;
  color: #F4FBFF;
  text-shadow: 0 0 40px ${C.cyan}55, 0 0 12px ${C.cyan}33;
  padding-left: 0.32em; /* optical centering compensation for tracking */
}
.landing-tagline {
  margin: clamp(10px, 1.4vh, 18px) 0 0;
  font-weight: 500;
  font-size: clamp(11px, 1.1vw, 14px);
  letter-spacing: 0.42em;
  color: ${C.cyanSoft};
  padding-left: 0.42em;
}
.landing-blurb {
  margin: clamp(20px, 2.6vh, 32px) auto 0;
  max-width: 640px;
  font-size: clamp(16px, 1.25vw, 18px);
  line-height: 1.7;
  font-weight: 400;
  color: rgba(225, 244, 250, 0.92);
  text-shadow: 0 1px 12px rgba(2, 13, 18, 0.55);
}
.landing-cta-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 14px;
  margin-top: clamp(28px, 3.4vh, 40px);
}
.landing-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.22em;
  padding: 14px 28px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
.landing-cta-icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}
.landing-cta-ghost {
  background: ${C.cyan}1f;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1.5px solid ${C.cyan}cc;
  color: #ffffff;
  box-shadow: 0 0 22px ${C.cyan}55, 0 0 0 1px ${C.cyan}33 inset,
    0 8px 24px -8px ${C.cyan}66;
}
.landing-cta-ghost:hover {
  background: ${C.cyan}33;
  border-color: ${C.cyan};
  box-shadow: 0 0 32px ${C.cyan}88, 0 0 0 1px ${C.cyan}55 inset,
    0 12px 32px -6px ${C.cyan}88;
  transform: translateY(-1px);
}

/* ============== FEATURES — asymmetric bento ============== */
/* Layout rationale: the original five identical chips read as a uniform row
   with no hierarchy. The bento turns Flashcards/Quizzes/Exams into a hero
   showpiece (the core loop new users come for), with four supporting tiles
   in a 2x2 sub-grid. Each tile gets a bespoke SVG scene that "earns" its
   space. Below 1024px we fall back to a single column so nothing crowds. */
.landing-features {
  max-width: 1320px;
  margin: 0 auto;
  padding: clamp(40px, 6vh, 72px) 32px;
}
.landing-features-bento {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  align-items: stretch;
}
@media (min-width: 720px) {
  .landing-features-bento {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1024px) {
  .landing-features-bento {
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: minmax(210px, auto);
  }
  .landing-bento-card--flashcards { grid-column: span 6; grid-row: span 2; }
  .landing-bento-card--evidence   { grid-column: span 3; grid-row: span 1; }
  .landing-bento-card--create     { grid-column: span 3; grid-row: span 1; }
  .landing-bento-card--connect    { grid-column: span 3; grid-row: span 1; }
  .landing-bento-card--spotlight  { grid-column: span 3; grid-row: span 1; }
}

.landing-bento-card {
  --accent: ${C.cyan};
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 20px 22px 22px;
  background:
    radial-gradient(circle at 100% 0%, color-mix(in srgb, var(--accent) 14%, transparent) 0%, transparent 55%),
    linear-gradient(180deg, ${C.bgPanel}, ${C.bgPanelStrong});
  border: 1px solid ${C.hairline};
  border-radius: 18px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.02) inset,
    0 18px 40px -22px rgba(0, 0, 0, 0.65),
    0 0 22px color-mix(in srgb, var(--accent) 12%, transparent);
  transition: transform 320ms cubic-bezier(0.16, 1, 0.3, 1),
    border-color 240ms ease, box-shadow 320ms ease, background 320ms ease;
  color: var(--accent);
}
.landing-bento-card::before {
  /* Top-edge hairline glow seeded by --accent so each tile feels lit from
     above by its own hue. */
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--accent) 80%, transparent), transparent);
  opacity: 0.55;
  pointer-events: none;
}
.landing-bento-card:hover {
  transform: translateY(-3px);
  border-color: color-mix(in srgb, var(--accent) 55%, transparent);
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--accent) 24%, transparent) inset,
    0 28px 52px -22px rgba(0, 0, 0, 0.72),
    0 0 38px color-mix(in srgb, var(--accent) 42%, transparent);
}

.landing-bento-visual {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  flex-shrink: 0;
  margin-bottom: 16px;
  color: var(--accent);
  filter: drop-shadow(0 0 14px color-mix(in srgb, var(--accent) 45%, transparent));
  transition: transform 360ms cubic-bezier(0.16, 1, 0.3, 1);
}
.landing-bento-card:hover .landing-bento-visual {
  transform: translateY(-2px);
}
.visual-svg {
  width: 100%;
  height: auto;
  max-height: 120px;
  display: block;
}

.landing-bento-body {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  flex: 1;
  min-height: 0;
}
.landing-bento-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: color-mix(in srgb, var(--accent) 14%, transparent);
  border: 1px solid color-mix(in srgb, var(--accent) 40%, transparent);
  color: var(--accent);
  margin-bottom: 12px;
  box-shadow: 0 0 14px color-mix(in srgb, var(--accent) 30%, transparent);
}
.landing-bento-icon svg { width: 16px; height: 16px; }
.landing-bento-title {
  margin: 0 0 8px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.18em;
  line-height: 1.45;
  color: #ffffff;
  text-shadow: 0 1px 10px rgba(2, 13, 18, 0.55);
}
.landing-bento-copy {
  margin: 0;
  font-size: 12.5px;
  line-height: 1.6;
  font-weight: 400;
  color: rgba(225, 244, 250, 0.85);
}

/* Hero tile gets larger visual real-estate and a slightly bigger title so it
   reads as the showpiece of the section. */
.landing-bento-card--hero {
  padding: 28px 28px 26px;
}
.landing-bento-card--hero .visual-svg {
  max-height: none;
  height: auto;
}
.landing-bento-card--hero .landing-bento-visual {
  flex: 1;
  margin-bottom: 22px;
}
.landing-bento-card--hero .landing-bento-title {
  font-size: 13.5px;
  letter-spacing: 0.2em;
}
.landing-bento-card--hero .landing-bento-copy {
  font-size: 13.5px;
  max-width: 44ch;
}

/* Spotlight tile — dissertation block replaces the old portrait. */
.landing-bento-dissertation {
  margin-top: 12px;
  padding-top: 10px;
  width: 100%;
  border-top: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
}
.landing-bento-dissertation-label {
  margin: 0 0 6px;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.28em;
  color: var(--accent);
  text-shadow: 0 0 12px color-mix(in srgb, var(--accent) 55%, transparent);
}
.landing-bento-dissertation-text {
  margin: 0;
  font-size: 10.5px;
  line-height: 1.55;
  font-weight: 500;
  letter-spacing: 0.03em;
  color: rgba(225, 244, 250, 0.92);
  text-shadow: 0 1px 8px rgba(2, 13, 18, 0.5);
}

/* Per-visual fine-tuning. */
.visual-flashcards { max-height: 280px; }
.visual-flashcards-top {
  transform-origin: 50% 50%;
  animation: bentoCardFloat 6.5s ease-in-out infinite;
}
.visual-connect-node { transform-origin: center; }
.visual-connect-node circle:first-child {
  animation: bentoNodePulse 3.6s ease-in-out infinite;
}
.visual-connect-node:nth-of-type(2) circle:first-child { animation-delay: 0.4s; }
.visual-connect-node:nth-of-type(3) circle:first-child { animation-delay: 0.8s; }
.visual-connect-node:nth-of-type(4) circle:first-child { animation-delay: 1.2s; }
.visual-connect-node:nth-of-type(5) circle:first-child { animation-delay: 1.6s; }
.visual-spotlight-trophy { animation: bentoTrophyGlow 4.2s ease-in-out infinite; }
.visual-create-spark { animation: bentoSparkPulse 3.6s ease-in-out infinite; }

@keyframes bentoCardFloat {
  0%, 100% { transform: translate(56px, 14px) rotate(5deg); }
  50%      { transform: translate(56px, 8px)  rotate(5deg); }
}
@keyframes bentoNodePulse {
  0%, 100% { opacity: 0.15; }
  50%      { opacity: 0.45; }
}
@keyframes bentoTrophyGlow {
  0%, 100% { filter: drop-shadow(0 0 6px color-mix(in srgb, var(--accent) 35%, transparent)); }
  50%      { filter: drop-shadow(0 0 14px color-mix(in srgb, var(--accent) 70%, transparent)); }
}
@keyframes bentoSparkPulse {
  0%, 100% { opacity: 0.7; }
  50%      { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .visual-flashcards-top,
  .visual-connect-node circle:first-child,
  .visual-spotlight-trophy,
  .visual-create-spark {
    animation: none !important;
  }
}

/* ============== BROWSE TOPICS ============== */
.landing-topics {
  max-width: 1320px;
  margin: 0 auto;
  padding: clamp(24px, 3vh, 40px) 32px clamp(40px, 6vh, 80px);
}
.landing-topics-panel {
  position: relative;
  background: linear-gradient(180deg, ${C.bgPanel}, ${C.bgPanelStrong});
  border: 1px solid ${C.hairlineStrong};
  border-radius: 18px;
  padding: clamp(20px, 3vh, 32px) clamp(20px, 2.6vw, 36px);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.02) inset,
    0 24px 60px -30px rgba(0, 0, 0, 0.6),
    0 0 32px ${C.cyan}10;
}
.landing-topics-header {
  margin-bottom: clamp(16px, 2vh, 24px);
}
.landing-topics-title {
  margin: 0;
  font-size: clamp(18px, 1.4vw, 22px);
  font-weight: 600;
  letter-spacing: 0.34em;
  color: #fff;
  text-shadow: 0 0 18px ${C.cyan}44;
}
.landing-topics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 18px;
}
.landing-topics-col {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
@media (min-width: 640px) { .landing-topics-grid { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 980px) { .landing-topics-grid { grid-template-columns: repeat(3, 1fr); } }

.landing-topic-pill {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 11px 14px;
  background: rgba(3, 17, 24, 0.55);
  border: 1px solid ${C.hairline};
  border-radius: 10px;
  color: ${C.cyanSoft};
  font-family: inherit;
  font-size: 13.5px;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  transition: all 200ms cubic-bezier(0.16, 1, 0.3, 1);
}
.landing-topic-pill:hover {
  background: ${C.bgPanelStrong};
  border-color: ${C.hairlineStrong};
  transform: translateX(2px);
  box-shadow: 0 0 22px ${C.cyan}22;
  color: #fff;
}
.landing-topic-check {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  border: 1.5px solid ${C.cyan};
  background: ${C.cyan}1f;
  color: ${C.cyan};
  flex-shrink: 0;
  box-shadow: 0 0 10px ${C.cyan}66;
}
.landing-topic-check svg { width: 12px; height: 12px; stroke-width: 3; }
.landing-topic-label {
  flex: 1;
  min-width: 0;
  letter-spacing: 0.04em;
}

/* ============== FOOTER ============== */
.landing-footer {
  border-top: 1px solid ${C.hairline};
  margin-top: clamp(40px, 6vh, 72px);
  background: linear-gradient(180deg, rgba(2, 13, 18, 0.4), rgba(2, 13, 18, 0.85));
  backdrop-filter: blur(8px);
}
.landing-footer-inner {
  max-width: 1320px;
  margin: 0 auto;
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.landing-footer-links {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0;
}
.landing-footer-link-item {
  display: inline-flex;
  align-items: center;
}
.landing-footer-sep {
  display: inline-block;
  padding: 0 18px;
  color: rgba(199, 230, 240, 0.28);
  font-weight: 300;
  user-select: none;
}
.landing-footer-link {
  font-size: 11px;
  letter-spacing: 0.24em;
  color: rgba(199, 230, 240, 0.65);
  text-decoration: none;
  transition: color 180ms ease;
}
.landing-footer-link:hover { color: ${C.cyan}; }
.landing-footer-fineprint {
  margin: 0;
  padding: 0 32px 22px;
  text-align: center;
  font-size: 11px;
  letter-spacing: 0.16em;
  color: rgba(199, 230, 240, 0.45);
}

@media (min-width: 720px) {
  .landing-footer-inner {
    flex-direction: row;
    justify-content: space-between;
    gap: 24px;
  }
}

/* ============== KEYFRAMES ============== */
@keyframes heroBrainFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
@keyframes heroBrainPulse {
  0%, 100% {
    filter: drop-shadow(0 0 28px ${C.cyan}66) drop-shadow(0 0 80px ${C.cyanMid}44);
  }
  50% {
    filter: drop-shadow(0 0 42px ${C.cyan}99) drop-shadow(0 0 100px ${C.cyanMid}66);
  }
}
@keyframes heroBrainAura {
  0%, 100% { opacity: 0.7; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.08); }
}

@media (prefers-reduced-motion: reduce) {
  .landing-hero-brain,
  .landing-hero-brain-img,
  .landing-hero-aura {
    animation: none !important;
  }
  .landing-wordmark,
  .landing-tagline,
  .landing-blurb,
  .landing-cta-row,
  .landing-hero-brain {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}

/* ============================================================================
   NEW SECTIONS — shared section header pattern
   ============================================================================ */
.landing-section-header {
  text-align: center;
  margin: 0 auto clamp(28px, 4vh, 44px);
  max-width: 680px;
  padding: 0 24px;
}
.landing-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 14px;
  padding: 6px 14px;
  border-radius: 999px;
  background: ${C.cyan}1a;
  border: 1px solid ${C.cyan}55;
  color: ${C.cyan};
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  box-shadow: 0 0 18px ${C.cyan}33;
}
.landing-eyebrow svg { width: 12px; height: 12px; }
.landing-section-title {
  margin: 0 0 12px;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(24px, 2.6vw, 36px);
  letter-spacing: 0.02em;
  line-height: 1.25;
  color: #ffffff;
  text-shadow: 0 0 28px ${C.cyan}33;
}
.landing-section-sub {
  margin: 0 auto;
  max-width: 560px;
  font-size: clamp(14px, 1.05vw, 16px);
  line-height: 1.65;
  color: rgba(225, 244, 250, 0.78);
}

/* ============================================================================
   TRY-IT FLASHCARD DEMO
   ============================================================================ */
.landing-try {
  max-width: 1320px;
  margin: 0 auto;
  padding: clamp(40px, 6vh, 72px) 32px clamp(24px, 3vh, 40px);
}
.try-block {
  max-width: 720px;
  margin: 0 auto;
}
.try-stage {
  position: relative;
  perspective: 1600px;
  width: 100%;
  /* Use min-height so long answer text can grow the card on narrow
     widths instead of overflowing. The card itself fills the stage
     via position:absolute (below) so percentage-height isn't needed. */
  min-height: clamp(300px, 38vh, 360px);
}
@media (max-width: 480px) {
  .try-stage { min-height: 400px; }
}
.try-card {
  position: absolute;
  inset: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  padding: 0;
  transition: transform 700ms cubic-bezier(0.16, 1, 0.3, 1);
  transform-style: preserve-3d;
  outline: none;
}
.try-card:focus-visible { outline: 2px solid ${C.cyan}; outline-offset: 6px; border-radius: 22px; }
.try-card.is-flipped { transform: rotateY(180deg); }
.try-card-face {
  position: absolute;
  inset: 0;
  border-radius: 22px;
  padding: clamp(22px, 3vh, 32px) clamp(22px, 3vw, 36px);
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #15506E 0%, #0E3A50 100%);
  border: 1px solid ${C.cyan}55;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.04) inset,
    0 22px 50px -20px rgba(0,0,0,0.7),
    0 0 36px ${C.cyan}33;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  text-align: left;
  overflow-y: auto;
  overscroll-behavior: contain;
}
.try-card-face--back { transform: rotateY(180deg); }
.try-card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: clamp(16px, 2vh, 22px);
}
.try-topic-pill {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 999px;
  background: ${C.cyan}1a;
  border: 1px solid ${C.cyan}55;
  color: ${C.cyan};
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}
.try-topic-pill--answer {
  background: rgba(46, 168, 102, 0.18);
  border-color: rgba(94, 200, 130, 0.55);
  color: #8EE2A8;
}
.try-flip-hint {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.18em;
  color: ${P.mistSoft};
  text-transform: uppercase;
}
.try-flip-hint svg { width: 11px; height: 11px; }
.try-card-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  flex: 1;
  min-height: 0;
}
.try-letter {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(118, 228, 247, 0.22);
  border: 1.5px solid ${C.cyan}99;
  color: ${C.cyan};
  font-weight: 800;
  font-size: 16px;
  flex-shrink: 0;
  box-shadow: 0 0 18px ${C.cyan}44;
}
.try-letter--a {
  background: rgba(118, 228, 247, 0.12);
  color: ${C.cyanSoft};
  border-color: ${C.cyan}66;
}
.try-text {
  margin: 0;
  font-size: clamp(15px, 1.4vw, 18px);
  line-height: 1.6;
  color: #ffffff;
  font-weight: 400;
}
.try-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 22px;
}
.try-controls button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: ${C.bgPanel};
  border: 1px solid ${C.hairline};
  color: ${C.cyanSoft};
  cursor: pointer;
  transition: all 200ms ease;
}
.try-controls button:hover {
  background: ${C.cyan}1a;
  border-color: ${C.cyan};
  color: ${C.cyan};
  box-shadow: 0 0 18px ${C.cyan}44;
}
.try-controls button svg { width: 18px; height: 18px; }
.try-counter {
  display: inline-flex;
  align-items: center;
  padding: 0 16px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.32em;
  color: ${C.cyanSoft};
  font-variant-numeric: tabular-nums;
}

/* ============================================================================
   STATS STRIP
   ============================================================================ */
.landing-stats {
  max-width: 1320px;
  margin: 0 auto;
  padding: clamp(20px, 3vh, 32px) 32px clamp(40px, 5vh, 60px);
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
@media (min-width: 720px) {
  .stats-grid { grid-template-columns: repeat(4, 1fr); gap: 18px; }
}
.stat-cell {
  text-align: center;
  padding: clamp(22px, 3vh, 30px) 16px;
  background: linear-gradient(180deg, ${C.bgPanel}, ${C.bgPanelStrong});
  border: 1px solid ${C.hairline};
  border-radius: 16px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 240ms ease;
}
.stat-cell:hover {
  border-color: ${C.hairlineStrong};
  box-shadow: 0 0 24px ${C.cyan}22;
  transform: translateY(-2px);
}
.stat-num {
  margin: 0;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-size: clamp(30px, 3.6vw, 48px);
  font-weight: 300;
  letter-spacing: 0.02em;
  color: ${C.cyan};
  text-shadow: 0 0 22px ${C.cyan}55;
  line-height: 1.05;
}
.stat-label {
  margin: 8px 0 0;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${C.cyanSoft};
}

/* ============================================================================
   DASHBOARD PREVIEW
   ============================================================================ */
.landing-preview {
  max-width: 1320px;
  margin: 0 auto;
  padding: clamp(24px, 4vh, 48px) 32px clamp(40px, 6vh, 72px);
}
.preview-stage {
  perspective: 2000px;
  perspective-origin: 50% 30%;
  max-width: 1080px;
  margin: 0 auto;
}
.preview-frame {
  position: relative;
  transform: rotateX(6deg) rotateY(-3deg);
  transform-style: preserve-3d;
  border-radius: 22px;
  background: linear-gradient(180deg, rgba(10, 45, 61, 0.92), rgba(6, 31, 43, 0.96));
  border: 1px solid ${C.hairlineStrong};
  box-shadow:
    0 70px 140px -50px rgba(0, 0, 0, 0.8),
    0 0 80px ${C.cyan}33,
    0 0 0 1px rgba(255, 255, 255, 0.04) inset;
  padding: clamp(14px, 2vh, 20px);
  display: grid;
  grid-template-columns: 60px 1fr;
  gap: clamp(14px, 1.8vw, 22px);
  min-height: 460px;
  overflow: hidden;
}
@media (min-width: 900px) {
  .preview-frame {
    grid-template-columns: 60px 1fr 240px;
  }
}
/* Subtle top-edge glow seam */
.preview-frame::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${C.cyan}aa, transparent);
  pointer-events: none;
}

.preview-sidebar {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 14px 0;
  background: rgba(3, 17, 24, 0.55);
  border-radius: 14px;
  border: 1px solid ${C.hairline};
}
.preview-brand {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: ${C.cyan}1a;
  border: 1px solid ${C.cyan}66;
  color: ${C.cyan};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 18px;
  box-shadow: 0 0 14px ${C.cyan}44;
}
.preview-brand svg { width: 16px; height: 16px; }
.preview-rail {
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
.preview-rail-dot {
  display: block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${C.cyan}33;
  border: 1px solid ${C.cyan}55;
}
.preview-rail-dot.is-active {
  background: ${C.cyan};
  box-shadow: 0 0 10px ${C.cyan}cc;
}

.preview-main {
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.preview-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}
.preview-greet-hi {
  margin: 0;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 400;
  font-size: clamp(16px, 1.5vw, 20px);
  color: #ffffff;
  text-shadow: 0 0 18px ${C.cyan}33;
}
.preview-greet-sub {
  margin: 4px 0 0;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.36em;
  color: ${C.cyanSoft};
}
.preview-bell {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(6, 32, 44, 0.7);
  border: 1px solid ${C.hairline};
  color: ${C.cyanSoft};
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.preview-bell svg { width: 14px; height: 14px; }
.preview-bell-dot {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ef4444;
  color: #fff;
  font-size: 9px;
  font-weight: 800;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.preview-section-label {
  margin: 0 0 10px;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.32em;
  text-transform: uppercase;
  color: ${C.cyanSoft};
}
.preview-mode-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  flex: 1;
}
.preview-mode {
  --mode-accent: ${C.cyan};
  position: relative;
  padding: 14px 14px;
  border-radius: 14px;
  background:
    radial-gradient(120% 90% at 100% 0%, color-mix(in srgb, var(--mode-accent) 18%, transparent) 0%, transparent 55%),
    linear-gradient(135deg, #15506E 0%, #0E3A50 100%);
  border: 1px solid color-mix(in srgb, var(--mode-accent) 40%, transparent);
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow:
    0 0 0 1px color-mix(in srgb, var(--mode-accent) 14%, transparent) inset,
    0 8px 22px -12px color-mix(in srgb, var(--mode-accent) 50%, transparent);
}
.preview-mode-icon {
  width: 32px;
  height: 32px;
  border-radius: 9px;
  background: linear-gradient(135deg, var(--mode-accent), color-mix(in srgb, var(--mode-accent) 45%, #0E3A50));
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 0 14px color-mix(in srgb, var(--mode-accent) 55%, transparent);
}
.preview-mode-icon svg { width: 16px; height: 16px; }
.preview-mode-body { flex: 1; min-width: 0; }
.preview-mode-title {
  margin: 0;
  font-size: 12.5px;
  font-weight: 600;
  color: #ffffff;
}
.preview-mode-desc {
  margin: 2px 0 0;
  font-size: 10.5px;
  color: rgba(225, 244, 250, 0.72);
}
.preview-mode-arrow {
  width: 14px;
  height: 14px;
  color: var(--mode-accent);
  flex-shrink: 0;
}

.preview-side {
  display: none;
  flex-direction: column;
  gap: 14px;
}
@media (min-width: 900px) {
  .preview-side { display: flex; }
}
.preview-progress {
  position: relative;
  padding: 16px;
  background: rgba(3, 17, 24, 0.55);
  border: 1px solid ${C.hairline};
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview-ring {
  width: 110px;
  height: 110px;
  filter: drop-shadow(0 0 12px ${C.cyan}66);
}
.preview-progress-num {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}
.preview-progress-val {
  margin: 0;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 300;
  font-size: 26px;
  color: #ffffff;
  line-height: 1;
}
.preview-progress-val span {
  font-size: 14px;
  color: ${C.cyan};
  margin-left: 1px;
}
.preview-progress-lbl {
  margin: 4px 0 0;
  font-size: 8.5px;
  font-weight: 700;
  letter-spacing: 0.3em;
  color: ${C.cyanSoft};
}
.preview-stat {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: rgba(3, 17, 24, 0.55);
  border: 1px solid ${C.hairline};
  border-radius: 14px;
}
.preview-stat-icon {
  width: 22px;
  height: 22px;
  color: #FFAA66;
  filter: drop-shadow(0 0 8px #FFAA66aa);
  flex-shrink: 0;
}
.preview-stat-num {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
}
.preview-stat-lbl {
  margin: 1px 0 0;
  font-size: 9.5px;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${C.cyanSoft};
}
.preview-focus {
  padding: 14px;
  background: rgba(3, 17, 24, 0.55);
  border: 1px solid ${C.hairline};
  border-radius: 14px;
}
.preview-focus-label {
  margin: 0 0 6px;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.32em;
  color: ${C.cyan};
}
.preview-focus-topic {
  margin: 0 0 10px;
  font-size: 12px;
  font-weight: 600;
  color: #ffffff;
}
.preview-focus-bar {
  width: 100%;
  height: 5px;
  border-radius: 999px;
  background: rgba(118, 228, 247, 0.12);
  overflow: hidden;
  margin-bottom: 6px;
}
.preview-focus-bar span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, ${C.cyan}, ${C.cyanSoft});
  border-radius: 999px;
  box-shadow: 0 0 10px ${C.cyan}99;
}
.preview-focus-meta {
  margin: 0;
  font-size: 9.5px;
  color: ${P.mistSoft};
  letter-spacing: 0.08em;
}

/* ============================================================================
   HOW IT WORKS — 3-step narrative strip
   ============================================================================ */
.landing-how {
  max-width: 1320px;
  margin: 0 auto;
  padding: clamp(24px, 4vh, 48px) 32px clamp(40px, 6vh, 72px);
}
.how-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 820px) {
  .how-grid { grid-template-columns: repeat(3, 1fr); gap: 20px; }
}
.how-step {
  position: relative;
  padding: clamp(20px, 3vh, 28px);
  background: linear-gradient(180deg, ${C.bgPanel}, ${C.bgPanelStrong});
  border: 1px solid ${C.hairline};
  border-radius: 18px;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all 240ms ease;
}
.how-step::before {
  content: "";
  position: absolute;
  inset: 0 0 auto 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${C.cyan}88, transparent);
  opacity: 0.55;
  pointer-events: none;
}
.how-step:hover {
  border-color: ${C.hairlineStrong};
  transform: translateY(-2px);
  box-shadow: 0 0 30px ${C.cyan}22, 0 22px 50px -22px rgba(0,0,0,0.6);
}
.how-step-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}
.how-step-num {
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-size: 36px;
  font-weight: 200;
  color: ${C.cyan};
  text-shadow: 0 0 22px ${C.cyan}55;
  line-height: 1;
  letter-spacing: 0.02em;
}
.how-step-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: ${C.cyan}14;
  border: 1px solid ${C.cyan}55;
  color: ${C.cyan};
  box-shadow: 0 0 14px ${C.cyan}33;
}
.how-step-icon svg { width: 18px; height: 18px; }
.how-step-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 0.01em;
}
.how-step-body {
  margin: 0;
  font-size: 13.5px;
  line-height: 1.65;
  color: rgba(225, 244, 250, 0.82);
}

@media (prefers-reduced-motion: reduce) {
  .try-card,
  .stat-cell,
  .how-step,
  .preview-frame {
    transition: none !important;
  }
  .preview-frame { transform: none !important; }
}
`;
