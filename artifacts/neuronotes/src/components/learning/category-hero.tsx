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
  gradient: "from-primary/10 via-primary/5 to-transparent",
  iconColor: "text-primary",
  accentDot: "bg-primary/30",
};

const THEMES: Array<{ match: RegExp; theme: ThemeSpec }> = [
  {
    match: /cell|neuron|anatomy|biology/i,
    theme: {
      icons: [Microscope, Activity, Brain],
      gradient: "from-emerald-100 via-teal-50 to-transparent dark:from-emerald-950/40 dark:via-teal-950/20",
      iconColor: "text-emerald-600 dark:text-emerald-400",
      accentDot: "bg-emerald-400/40",
    },
  },
  {
    match: /neurotransmit|synap|chemical|receptor|pharma/i,
    theme: {
      icons: [Pill, Zap, Activity],
      gradient: "from-violet-100 via-purple-50 to-transparent dark:from-violet-950/40 dark:via-purple-950/20",
      iconColor: "text-violet-600 dark:text-violet-400",
      accentDot: "bg-violet-400/40",
    },
  },
  {
    match: /sensory|vision|hearing|touch|smell|taste|vestibular|motor|perception/i,
    theme: {
      icons: [Eye, Activity, Sparkles],
      gradient: "from-sky-100 via-cyan-50 to-transparent dark:from-sky-950/40 dark:via-cyan-950/20",
      iconColor: "text-sky-600 dark:text-sky-400",
      accentDot: "bg-sky-400/40",
    },
  },
  {
    match: /limbic|motivation|emotion|reward/i,
    theme: {
      icons: [Heart, Brain, Sparkles],
      gradient: "from-rose-100 via-pink-50 to-transparent dark:from-rose-950/40 dark:via-pink-950/20",
      iconColor: "text-rose-600 dark:text-rose-400",
      accentDot: "bg-rose-400/40",
    },
  },
  {
    match: /sleep|circadian|wake|rhythm/i,
    theme: {
      icons: [Moon, Sparkles, Activity],
      gradient: "from-indigo-100 via-blue-50 to-transparent dark:from-indigo-950/40 dark:via-blue-950/20",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      accentDot: "bg-indigo-400/40",
    },
  },
  {
    match: /memory|learning|cogniti|attention|executive|language/i,
    theme: {
      icons: [Database, Brain, Activity],
      gradient: "from-amber-100 via-orange-50 to-transparent dark:from-amber-950/40 dark:via-orange-950/20",
      iconColor: "text-amber-600 dark:text-amber-400",
      accentDot: "bg-amber-400/40",
    },
  },
  {
    match: /disorder|psychopath|clinic|mood|anxie|adhd|autis|schizo/i,
    theme: {
      icons: [Stethoscope, Brain, Heart],
      gradient: "from-cyan-100 via-sky-50 to-transparent dark:from-cyan-950/40 dark:via-sky-950/20",
      iconColor: "text-cyan-600 dark:text-cyan-400",
      accentDot: "bg-cyan-400/40",
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
          <div className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center shadow-sm ${theme.iconColor}`}>
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
