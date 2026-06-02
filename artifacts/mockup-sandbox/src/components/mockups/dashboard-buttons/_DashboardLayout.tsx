import "./_group.css";
import {
  LayoutDashboard,
  BookOpen,
  FlaskConical,
  Brain,
  TrendingUp,
  Library,
  Wrench,
  ArrowUpRight,
  ChevronRight,
  Star,
} from "lucide-react";

const PALETTE = {
  mist: "#A7F3FF",
  mistSoft: "#7FBFD0",
  tealDeep: "#2A7387",
  teal: "#5EB0C8",
  surf: "#76E4F7",
  surfaceElev: "#0E3C50",
};

const TILES = [
  {
    name: "Psychopharmacology",
    hint: "Expand your knowledge",
    icon: Star,
    bg: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`,
    border: PALETTE.tealDeep,
  },
  {
    name: "Neurophysiology",
    hint: "Strengthen your foundation",
    icon: BookOpen,
    bg: `linear-gradient(135deg, ${PALETTE.tealDeep}, ${PALETTE.teal})`,
    border: PALETTE.tealDeep,
  },
  {
    name: "Sensory Systems",
    hint: "Sharpen your skills",
    icon: Brain,
    bg: `linear-gradient(135deg, ${PALETTE.surfaceElev}, ${PALETTE.tealDeep})`,
    border: PALETTE.surfaceElev,
  },
  {
    name: "Limbic System & Mot...",
    hint: "Level up next",
    icon: TrendingUp,
    bg: `linear-gradient(135deg, ${PALETTE.surf}, ${PALETTE.mist})`,
    border: PALETTE.teal,
  },
];

const NAV = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "Topics", icon: BookOpen },
  { label: "Study Lab", icon: FlaskConical },
  { label: "Brain Lab", icon: Brain },
  { label: "Progress", icon: TrendingUp },
  { label: "Resources", icon: Library },
];

export function DashboardLayout({ variant }: { variant: string }) {
  return (
    <div className={`db-stage font-['Inter'] ${variant}`}>
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="w-[210px] shrink-0 px-3 py-5 flex flex-col gap-1">
          <p className="text-[10px] tracking-[0.18em] font-semibold px-3 mb-2" style={{ color: PALETTE.mistSoft }}>
            STUDY
          </p>
          {NAV.map((n) => {
            const Icon = n.icon;
            return (
              <button key={n.label} className={`nav-item ${n.active ? "nav-glass-active" : "nav-glass-idle"}`}>
                <Icon className="w-4 h-4" style={{ color: n.active ? PALETTE.surf : PALETTE.mistSoft }} />
                <span className="flex-1 text-left">{n.label}</span>
                {n.active && <ArrowUpRight className="w-3.5 h-3.5" style={{ color: PALETTE.surf }} />}
              </button>
            );
          })}
          <p className="text-[10px] tracking-[0.18em] font-semibold px-3 mt-4 mb-2" style={{ color: PALETTE.mistSoft }}>
            TOOLKIT
          </p>
          {["My Tools", "Standard Tools", "Pro Tools"].map((t) => (
            <button key={t} className="nav-item nav-glass-idle">
              <Wrench className="w-4 h-4" style={{ color: PALETTE.mistSoft }} />
              <span className="flex-1 text-left">{t}</span>
              <span
                className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                style={{ color: PALETTE.mistSoft, border: "1px solid rgba(182,220,231,0.18)" }}
              >
                PRO
              </span>
            </button>
          ))}
        </aside>

        {/* Main */}
        <main className="flex-1 px-6 py-6 max-w-[640px]">
          {/* Begin Your Journey */}
          <section className="db-card p-5 mb-5">
            <h2 className="font-semibold mb-1 flex items-center gap-2" style={{ color: PALETTE.mist }}>
              <TrendingUp className="w-4 h-4" style={{ color: PALETTE.tealDeep }} /> Begin Your Journey
            </h2>
            <p className="text-sm mb-4" style={{ color: PALETTE.mistSoft }}>
              Pick a topic to start your first study session. We'll keep track of your progress from here.
            </p>
            <button className="btn-glass-strong">
              Browse Topics
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </section>

          {/* Recommended for You */}
          <section className="db-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold" style={{ color: PALETTE.mist }}>Recommended for You</h2>
                <p className="text-xs mt-1" style={{ color: PALETTE.mistSoft }}>Based on your goals and progress</p>
              </div>
              <button className="btn-glass">View all</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {TILES.map((t) => {
                const Icon = t.icon;
                return (
                  <button key={t.name} className="recommended-tile group w-full flex items-center gap-3 p-3 rounded-lg text-left border">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border"
                      style={{ background: t.bg, borderColor: t.border }}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold truncate" style={{ color: PALETTE.mist }}>{t.name}</p>
                      <p className="text-xs truncate" style={{ color: PALETTE.mistSoft }}>{t.hint}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 shrink-0" style={{ color: PALETTE.tealDeep }} />
                  </button>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
