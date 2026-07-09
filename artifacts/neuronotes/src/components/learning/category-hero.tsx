import {
  Brain,
  Activity,
  Zap,
  Eye,
  Heart,
  Moon,
  Database,
  Sparkles,
  Pill,
  Microscope,
  Stethoscope,
  Shapes,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ThemeSpec {
  icons: LucideIcon[];
  gradient: string;
  iconColor: string;
  accentDot: string;
}

const DEFAULT_THEME: ThemeSpec = {
  icons: [Brain, Sparkles, Shapes],
  gradient: "from-white/5 via-white/[0.02] to-transparent",
  iconColor: "text-neutral-300",
  accentDot: "bg-neutral-500/40",
};

const THEMES: Array<{ match: RegExp; theme: ThemeSpec }> = [
  {
    match: /cell|neuron|anatomy|biology/i,
    theme: {
      icons: [Microscope, Activity, Brain],
      gradient: "from-white/5 via-white/[0.02] to-transparent",
      iconColor: "text-neutral-300",
      accentDot: "bg-neutral-500/40",
    },
  },
  {
    match: /neurotransmit|synap|chemical|receptor|pharma/i,
    theme: {
      icons: [Pill, Zap, Activity],
      gradient: "from-white/5 via-white/[0.02] to-transparent",
      iconColor: "text-neutral-300",
      accentDot: "bg-neutral-500/40",
    },
  },
  {
    match: /sensory|vision|hearing|touch|smell|taste|vestibular|motor|perception/i,
    theme: {
      icons: [Eye, Activity, Sparkles],
      gradient: "from-white/5 via-white/[0.02] to-transparent",
      iconColor: "text-neutral-300",
      accentDot: "bg-neutral-500/40",
    },
  },
  {
    match: /limbic|motivation|emotion|reward/i,
    theme: {
      icons: [Heart, Brain, Sparkles],
      gradient: "from-white/5 via-white/[0.02] to-transparent",
      iconColor: "text-neutral-300",
      accentDot: "bg-neutral-500/40",
    },
  },
  {
    match: /sleep|circadian|wake|rhythm/i,
    theme: {
      icons: [Moon, Sparkles, Activity],
      gradient: "from-white/5 via-white/[0.02] to-transparent",
      iconColor: "text-neutral-300",
      accentDot: "bg-neutral-500/40",
    },
  },
  {
    match: /memory|learning|cogniti|attention|executive|language/i,
    theme: {
      icons: [Database, Brain, Activity],
      gradient: "from-white/5 via-white/[0.02] to-transparent",
      iconColor: "text-neutral-300",
      accentDot: "bg-neutral-500/40",
    },
  },
  {
    match: /disorder|psychopath|clinic|mood|anxie|adhd|autis|schizo/i,
    theme: {
      icons: [Stethoscope, Brain, Heart],
      gradient: "from-white/5 via-white/[0.02] to-transparent",
      iconColor: "text-neutral-300",
      accentDot: "bg-neutral-500/40",
    },
  },
];

function pickTheme(category: string): ThemeSpec {
  for (const { match, theme } of THEMES) {
    if (match.test(category)) return theme;
  }
  return DEFAULT_THEME;
}

export interface CategoryHeroProps {
  category: string;
  topicName: string;
}

export default function CategoryHero({ category, topicName }: CategoryHeroProps) {
  const theme = pickTheme(category);
  const [PrimaryIcon, IconA, IconB] = theme.icons;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br ${theme.gradient} mb-4`}
      data-testid="category-hero"
    >
      {/* decorative dots */}
      <div className="absolute inset-0 pointer-events-none opacity-60" aria-hidden>
        <span className={`absolute top-3 right-6 w-1.5 h-1.5 rounded-full ${theme.accentDot}`} />
        <span className={`absolute top-10 right-16 w-1 h-1 rounded-full ${theme.accentDot}`} />
        <span className={`absolute bottom-4 left-8 w-1 h-1 rounded-full ${theme.accentDot}`} />
        <span className={`absolute bottom-10 left-20 w-1.5 h-1.5 rounded-full ${theme.accentDot}`} />
      </div>

      <div className="relative flex items-center gap-4 px-5 py-5 md:px-6 md:py-6">
        <div className="relative shrink-0">
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-background/80 border border-border flex items-center justify-center shadow-sm ${theme.iconColor}`}>
            <PrimaryIcon className="w-8 h-8 md:w-10 md:h-10" strokeWidth={1.6} />
          </div>
          <div className={`absolute -top-1.5 -right-1.5 w-7 h-7 rounded-lg bg-background border border-border flex items-center justify-center shadow-sm ${theme.iconColor}`}>
            <IconA className="w-3.5 h-3.5" strokeWidth={1.8} />
          </div>
          <div className={`absolute -bottom-1.5 -left-1.5 w-6 h-6 rounded-lg bg-background border border-border flex items-center justify-center shadow-sm ${theme.iconColor}`}>
            <IconB className="w-3 h-3" strokeWidth={1.8} />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">{category}</p>
          <h1 className="text-xl md:text-2xl font-bold text-foreground leading-tight">{topicName}</h1>
        </div>
      </div>
    </div>
  );
}
