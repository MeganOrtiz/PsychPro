// =============================================================================
// Dashboard — PROTECTED.
// ---------------------------------------------------------------------------
// This page inherits the canonical .study-page-bg cerulean-clouds surface
// from src/index.css and uses StudySurface for every card. DO NOT:
//   - Add a competing wallpaper (no per-page bg image, no extra ::before).
//   - Re-render an inline <h1>PSYCHPRO</h1> wordmark — use <BrandBanner/>.
//   - Resurrect "Hello, there" / "Welcome back, there" — greeting is
//     personalized or omitted (never a placeholder name).
//   - Hardcode brand hex codes — use STUDY_PALETTE tokens.
//   - Replace StudySurface cards with raw bg-card / glass divs.
// =============================================================================
import { useEffect, useMemo, useState } from "react";
import { authHeaders } from "@/lib/auth-headers";
import { workTypeLabel } from "@workspace/community";
import { useLocation } from "wouter";
import {
  BookOpen,
  Brain,
  Trophy,
  Zap,
  ChevronRight,
  Flame,
  Star,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Award,
  Medal,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { useGetDashboardSummary, useGetTopics, useGetLeaderboard } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import featuredWorkImage from "@/assets/generated_images/dashboard.png";
import spotlightAvatarImage from "@assets/Screenshot_2026-04-28_at_8.01.18_PM_1779409357019.png";
import spotlightCloudImage from "@assets/Screenshot_2026-05-10_at_3.03.20_PM_1778443775551.png";
import TodayReviews from "@/components/learning/today-reviews";
import { StudySurface } from "@/components/study/study-surface";
import { NotificationsBell } from "@/components/notifications-bell";
import { BrandBanner } from "@/components/brand/brand-banner";
import { STUDY_PALETTE as PALETTE } from "@/lib/study-theme";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

// Brand-family icon palettes — each tile gets a slightly different teal/surf gradient
// so the recommended/recent/achievement rows feel cohesive instead of rainbow.
const BRAND_TILES = [
  { bg: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`, border: PALETTE.tealDeep },
  { bg: `linear-gradient(135deg, ${PALETTE.tealDeep}, ${PALETTE.teal})`, border: PALETTE.tealDeep },
  { bg: `linear-gradient(135deg, #1F4F66, ${PALETTE.tealDeep})`, border: "#1F4F66" },
  { bg: `linear-gradient(135deg, ${PALETTE.surf}, ${PALETTE.mist})`, border: PALETTE.teal },
] as const;

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] font-semibold tracking-[0.18em] uppercase mb-2 ml-1"
      style={{ color: PALETTE.tealDeep }}
    >
      {children}
    </p>
  );
}

type RecentTopic = {
  id: number;
  topicId: number;
  topicName: string;
  score: number;
  lastAccessed?: string | null;
};

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}

function dayKey(d: Date) {
  return startOfDay(d).toISOString();
}

function buildLast7Days() {
  const today = startOfDay(new Date());
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - (6 - i));
    return d;
  });
}

function buildActivitySeries(recent: RecentTopic[]) {
  const buckets = new Map<string, number>();
  recent.forEach((r) => {
    if (!r.lastAccessed) return;
    const key = dayKey(new Date(r.lastAccessed));
    buckets.set(key, (buckets.get(key) ?? 0) + r.score);
  });
  return buildLast7Days().map((d) => {
    const key = d.toISOString();
    return {
      day: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()],
      score: buckets.get(key) ?? 0,
    };
  });
}

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { data: summary, isLoading } = useGetDashboardSummary();
  const { data: allTopics } = useGetTopics();
  const { data: leaderboard } = useGetLeaderboard();

  const isFree =
    !summary?.subscriptionStatus || summary.subscriptionStatus === "free";
  const isOverLimit =
    isFree && summary !== undefined && summary.usageCount >= summary.freeLimit;
  const isApproachingLimit =
    isFree &&
    summary !== undefined &&
    !isOverLimit &&
    summary.usageCount >= Math.ceil(summary.freeLimit * 0.8);

  // Personalized greeting — pulls from /api/profile/me (same source the
  // sidebar uses). While loading we pass greeting={undefined} so the banner
  // shows only the wordmark + tagline (never a placeholder name).
  const [profileDisplayName, setProfileDisplayName] = useState<string | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/profile/me", {
          headers: await authHeaders(),
        });
        if (!res.ok) {
          if (!cancelled) setIsProfileLoading(false);
          return;
        }
        const data = await res.json();
        if (cancelled) return;
        setProfileDisplayName(
          typeof data?.displayName === "string" ? data.displayName : null,
        );
      } catch {
        /* silent — greeting falls back to "Welcome back." */
      } finally {
        if (!cancelled) setIsProfileLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const greetingText = (() => {
    if (isProfileLoading) return undefined;
    const trimmed = (profileDisplayName ?? "").trim();
    if (!trimmed) return "Welcome back.";
    const firstName = trimmed.split(/\s+/)[0];
    return `Welcome back, ${firstName}.`;
  })();

  const recent = (summary?.recentTopics ?? []) as RecentTopic[];
  const weak = (summary?.weakAreas ?? []) as RecentTopic[];

  const streak = summary?.currentStreak ?? 0;
  const weeklyFlames = useMemo(() => {
    const today = startOfDay(new Date()).getTime();
    const source = summary?.weeklyActivity ?? [];
    return source.map((d, i) => {
      const dt = startOfDay(new Date(d.date));
      return {
        label: DAY_LABELS[i],
        lit: d.active,
        isToday: dt.getTime() === today,
      };
    });
  }, [summary?.weeklyActivity]);
  const activitySeries = useMemo(() => buildActivitySeries(recent), [recent]);

  // Pick the first recent topic that isn't fully mastered; fall back to the
  // most-recent entry so returning students always see something to resume.
  const continueTopic = recent.find((r) => r.score < 100) ?? recent[0];

  const recommended = useMemo(() => {
    const seen = new Set<number>();
    const out: RecentTopic[] = [];
    const push = (t: RecentTopic) => {
      if (out.length >= 4 || seen.has(t.topicId)) return;
      seen.add(t.topicId);
      out.push(t);
    };
    const hasHistory = recent.length > 0 || weak.length > 0;
    if (hasHistory) {
      weak.forEach(push);
      recent.filter((r) => r.score < 80).forEach(push);
    }
    // For brand-new users (no history), recommend alphabetically-sorted starter
    // topics so we don't accidentally fall through to the "study a few topics
    // first" empty state when we actually have a full catalogue to show.
    const catalogue = [...(allTopics ?? [])].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    catalogue.forEach((t) => {
      push({ id: t.id, topicId: t.id, topicName: t.name, score: 0, lastAccessed: null });
    });
    recent.forEach(push);
    return out;
  }, [weak, recent, allTopics]);

  const totalTopics = (allTopics ?? []).length;

  return (
    <div
      className="min-h-full study-page-bg"
      data-testid="dashboard-page"
    >
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        {/* Top header — notifications bell + canonical BrandBanner.
            The wordmark + tagline + personalized greeting are all owned by
            BrandBanner so every page renders the brand identically. */}
        <header className="relative mb-8 py-4">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <NotificationsBell />
          </div>
          <BrandBanner size="lg" greeting={greetingText} className="mt-6 mb-8" />
        </header>

        {isOverLimit && (
          <div
            className="rounded-xl p-4 mb-6 flex items-start gap-3 border"
            style={{
              background: "rgba(244,180,98,0.14)",
              borderColor: "rgba(244,180,98,0.55)",
            }}
            data-testid="banner-over-limit"
          >
            <Zap className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-amber-900 text-sm">
                Free limit reached
              </p>
              <p className="text-amber-800 text-sm mt-1">
                You've used all {summary?.freeLimit ?? 10} free interactions.
                Upgrade to continue studying.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate("/subscription")}
              data-testid="button-upgrade-banner"
            >
              Upgrade
            </Button>
          </div>
        )}

        {isApproachingLimit && (
          <div
            className="rounded-xl p-4 mb-6 flex items-start gap-3 border"
            style={{
              background: "rgba(94,176,200,0.12)",
              borderColor: `${PALETTE.surf}66`,
            }}
            data-testid="banner-approaching-limit"
          >
            <Sparkles
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: PALETTE.tealDeep }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: PALETTE.mist }}>
                You're close to your free limit
              </p>
              <p className="text-sm mt-1" style={{ color: PALETTE.mistSoft }}>
                {summary!.usageCount} of {summary!.freeLimit} free interactions
                used. Upgrade now to keep your momentum going.
              </p>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate("/subscription")}
              data-testid="button-upgrade-approaching"
            >
              Upgrade
            </Button>
          </div>
        )}

        {/* Two-column: main + spotlight rail */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
          <div className="min-w-0 space-y-6">
            {/* Begin/Continue Your Journey (full width, top) */}
            <div>
            <StudySurface tone="light" glow innerClassName="p-5">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-4 h-4" style={{ color: PALETTE.tealDeep }} />
                <h2 className="font-semibold" style={{ color: PALETTE.mist }}>
                  {continueTopic ? "Continue Your Journey" : "Begin Your Journey"}
                </h2>
              </div>
              {isLoading ? (
                <Skeleton className="h-24 rounded-lg" />
              ) : continueTopic ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-foreground truncate">
                      {continueTopic.topicName}
                    </p>
                    <span className="text-sm font-semibold" style={{ color: PALETTE.tealDeep }}>
                      {continueTopic.score}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden mb-4" style={{ background: "rgba(47,160,198,0.14)" }}>
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${continueTopic.score}%`,
                        background: `linear-gradient(90deg, ${PALETTE.teal}, ${PALETTE.surf})`,
                      }}
                    />
                  </div>
                  <Button
                    onClick={() => navigate(`/topics/${continueTopic.topicId}`)}
                    data-testid="button-continue-studying"
                  >
                    Continue Studying
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Pick a topic to start your first study session. We'll keep
                    track of your progress from here.
                  </p>
                  <Button
                    onClick={() => navigate("/topics")}
                    data-testid="button-begin-journey"
                  >
                    Browse Topics
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </StudySurface>
            </div>

            {/* Recommended for You — 2x2 grid of 4 topics */}
            <div>
            <StudySurface tone="light" innerClassName="p-5">
              <div className="mb-4">
                <h2 className="font-semibold" style={{ color: PALETTE.mist }}>Recommended for You</h2>
                <p className="text-xs mt-1" style={{ color: PALETTE.mistSoft }}>
                  Based on your goals and progress
                </p>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                  <Skeleton className="h-16 rounded-lg" />
                </div>
              ) : recommended.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommended.slice(0, 4).map((t, idx) => {
                    const tile = BRAND_TILES[idx % BRAND_TILES.length];
                    const meta = [
                      { icon: Sparkles, hint: "Expand your knowledge" },
                      { icon: BookOpen, hint: "Strengthen your foundation" },
                      { icon: Brain, hint: "Sharpen your skills" },
                      { icon: TrendingUp, hint: "Level up next" },
                    ][idx % 4];
                    const Icon = meta.icon;
                    return (
                      <button
                        key={t.id}
                        onClick={() => navigate(`/topics/${t.topicId}`)}
                        className="group w-full flex items-center gap-3 p-3 rounded-lg text-left border transition-all hover:-translate-y-0.5"
                        style={{
                          background: "rgba(8,43,58,0.55)",
                          borderColor: "rgba(94,176,200,0.18)",
                          boxShadow: `0 6px 18px -12px ${PALETTE.teal}66`,
                        }}
                        data-testid={`recommended-${t.topicId}`}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 border transition-transform group-hover:scale-105"
                          style={{ background: tile.bg, borderColor: tile.border }}
                        >
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: PALETTE.mist }}>
                            {t.topicName}
                          </p>
                          <p className="text-xs truncate" style={{ color: PALETTE.mistSoft }}>
                            {meta.hint}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5" style={{ color: PALETTE.tealDeep }} />
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-sm text-center py-6" style={{ color: PALETTE.mistSoft }}>
                  Study a few topics and we'll suggest what to tackle next.
                </p>
              )}
            </StudySurface>
            </div>

            {/* Streak (left) + Leaderboard (right) */}
            <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Your Streak */}
              <StudySurface tone="light" innerClassName="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="font-semibold" style={{ color: PALETTE.mist }}>Your Streak</h2>
                  <span aria-hidden>🔥</span>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold leading-none" style={{ color: PALETTE.mist }}>{streak}</span>
                    <span className="text-sm" style={{ color: PALETTE.mistSoft }}>day streak</span>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {weeklyFlames.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <Flame
                        className={cn(
                          "w-5 h-5 transition-colors",
                          d.lit ? "text-orange-500 fill-orange-500" : "text-slate-300"
                        )}
                      />
                      <span
                        className="text-xs"
                        style={{
                          color: d.isToday ? PALETTE.mist : PALETTE.mistSoft,
                          fontWeight: d.isToday ? 600 : 400,
                        }}
                      >
                        {d.label}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs" style={{ color: PALETTE.mistSoft }}>
                  {streak === 0
                    ? "Study today to start a streak."
                    : streak < 3
                    ? "You're building momentum!"
                    : "Great consistency this week."}
                </p>
              </StudySurface>

              {/* Leaderboard (moved from right rail) */}
              <StudySurface tone="light" innerClassName="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" style={{ color: PALETTE.tealDeep }} />
                    <h2 className="font-semibold" style={{ color: PALETTE.mist }}>Leaderboard</h2>
                  </div>
                  <button
                    onClick={() => navigate("/leaderboard")}
                    className="text-xs hover:underline"
                    style={{ color: PALETTE.tealDeep }}
                    data-testid="button-view-leaderboard"
                  >
                    View all
                  </button>
                </div>
                {!leaderboard ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 rounded-lg" />
                    <Skeleton className="h-8 rounded-lg" />
                    <Skeleton className="h-8 rounded-lg" />
                  </div>
                ) : leaderboard.entries.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">
                    Be the first to land on the board.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {leaderboard.entries.slice(0, 5).map((e) => (
                      <div
                        key={e.rank}
                        className={cn(
                          "flex items-center gap-2 px-2 py-1.5 rounded-lg",
                        )}
                        style={
                          e.isCurrentUser
                            ? { background: `${PALETTE.teal}1f` }
                            : undefined
                        }
                        data-testid={`leaderboard-row-${e.rank}`}
                      >
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                            e.rank === 1
                              ? "bg-yellow-500/15 text-yellow-600"
                              : e.rank === 2
                              ? "bg-slate-400/15 text-slate-500"
                              : e.rank === 3
                              ? "bg-amber-700/15 text-amber-700"
                              : "bg-slate-100 text-slate-500"
                          )}
                        >
                          {e.rank}
                        </div>
                        <p className="text-sm font-medium truncate flex-1 min-w-0" style={{ color: PALETTE.mist }}>
                          {e.displayName}
                          {e.isCurrentUser && (
                            <span
                              className="ml-1.5 text-xs font-semibold"
                              style={{ color: PALETTE.tealDeep }}
                            >
                              You
                            </span>
                          )}
                        </p>
                        <div className="flex items-center gap-1 flex-shrink-0" title="Topics completed">
                          <BookOpen className="w-3 h-3" style={{ color: PALETTE.mistSoft }} />
                          <span className="text-xs font-semibold tabular-nums" style={{ color: PALETTE.mist }}>
                            {e.topicsCompleted}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0" title="Streak">
                          <Flame
                            className={cn(
                              "w-3 h-3",
                              e.streak > 0
                                ? "text-orange-500 fill-orange-500"
                                : "text-slate-300"
                            )}
                          />
                          <span className="text-xs font-semibold tabular-nums" style={{ color: PALETTE.mist }}>
                            {e.streak}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </StudySurface>
            </div>
            </div>

            {/* Study Analytics (full width) + Recent Activity / Achievements (2-col) */}
            <div>
            <div className="space-y-4">
              <StudyAnalyticsCard
                series={activitySeries}
                averageScore={summary?.averageScore ?? 0}
                topicsStudied={summary?.topicsStudied ?? 0}
                totalTopics={totalTopics}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RecentActivityCard
                  isLoading={isLoading}
                  recent={recent}
                  onItemClick={(topicId) => navigate(`/topics/${topicId}`)}
                  onViewAll={() => navigate("/progress")}
                />
                <AchievementsCard
                  streak={streak}
                  topicsStudied={summary?.topicsStudied ?? 0}
                  topicsCompleted={summary?.topicsCompleted ?? 0}
                  quizzesCompleted={summary?.quizzesCompleted ?? 0}
                  examsCompleted={summary?.examsCompleted ?? 0}
                  averageScore={summary?.averageScore ?? 0}
                />
              </div>
            </div>
            </div>

          </div>

          {/* Spotlight rail */}
          <aside className="lg:sticky lg:top-6 self-start space-y-4">
            <SpotlightCard onCta={(id) => navigate(id ? `/featured-work?submission=${id}` : "/featured-work")} />
            <TodayReviews topics={allTopics} />
          </aside>
        </div>
      </div>
    </div>
  );
}

type SpotlightSubmission = {
  id: number;
  workType: string;
  title: string;
  abstract: string;
  submitter: { displayName: string; role: string | null; institution: string | null };
};

const SPOTLIGHT_ABSTRACT_PREVIEW = 150;
function previewAbstract(text: string): string {
  if (text.length <= SPOTLIGHT_ABSTRACT_PREVIEW) return text;
  return `${text.slice(0, SPOTLIGHT_ABSTRACT_PREVIEW).trimEnd()}…`;
}

function SpotlightCard({ onCta }: { onCta: (submissionId?: number) => void }) {
  const [spot, setSpot] = useState<SpotlightSubmission | null>(null);
  useEffect(() => {
    let cancelled = false;
    // Public anonymous-tolerant route — no auth header needed; the API
    // picks a daily-rotating approved submission for everyone.
    fetch("/api/featured-work/spotlight")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled && d) setSpot(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const featuredName = spot ? spot.submitter.displayName : "Sarah K.";
  const featuredRole = spot ? (spot.submitter.role ?? "Contributor") : "PsyD Candidate";
  const featuredInstitution = spot ? (spot.submitter.institution ?? "") : "Clinical Neuropsychology";
  const featuredTypeLabel = spot ? workTypeLabel(spot.workType) : "Featured Work";
  const featuredTitle = spot
    ? spot.title
    : "Dissertation work: SOCIAL COGNITION IN CHILDREN WITH AUTISM SPECTRUM DISORDER: EXPLORING CORRELATES BETWEEN OBJECTIVE NEUROPSYCHOLOGICAL MEASURES AND PARENT REPORTS";
  const featuredAbstractPreview = spot ? previewAbstract(spot.abstract) : null;

  return (
    <StudySurface tone="dark" innerClassName="relative overflow-hidden p-6 text-white">
      {/* Starry shimmer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-80"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 18% 12%, rgba(255,255,255,.85), transparent 60%), radial-gradient(1.2px 1.2px at 65% 8%, rgba(255,255,255,.7), transparent 60%), radial-gradient(1px 1px at 82% 28%, rgba(255,255,255,.6), transparent 60%), radial-gradient(1.4px 1.4px at 32% 52%, rgba(255,255,255,.45), transparent 60%), radial-gradient(1px 1px at 75% 68%, rgba(255,255,255,.5), transparent 60%), radial-gradient(1px 1px at 12% 76%, rgba(255,255,255,.45), transparent 60%), radial-gradient(1.2px 1.2px at 88% 90%, rgba(255,255,255,.55), transparent 60%), radial-gradient(0.8px 0.8px at 45% 22%, rgba(255,255,255,.5), transparent 60%), radial-gradient(0.8px 0.8px at 25% 38%, rgba(255,255,255,.4), transparent 60%), radial-gradient(1px 1px at 60% 80%, rgba(255,255,255,.4), transparent 60%)",
        }}
      />
      {/* Soft nebula glows */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-12 w-56 h-56 rounded-full blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${PALETTE.surf}55, transparent)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${PALETTE.teal}40, transparent)` }}
      />

      {/* Cloud strip — moody beam-of-light backdrop sits behind the wordmark.
          Sized to crop tight to the heading area so it reads as a halo
          rather than a full-card image. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 right-0 h-40 overflow-hidden rounded-t-2xl"
      >
        <img
          src={spotlightCloudImage}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-90"
        />
        {/* Fade the cloud into the card body so the seam disappears. */}
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${PALETTE.surface}dd 75%, ${PALETTE.surface} 100%)`,
          }}
        />
      </div>

      <div className="relative">
        {/* Outlined star (no fill) */}
        <div className="flex items-center justify-center mb-3">
          <Star className="w-7 h-7 text-white" strokeWidth={1.5} />
        </div>
        <h3
          className="text-2xl text-center text-white"
          style={{
            fontFamily: '"Italiana", "Julius Sans One", serif',
            letterSpacing: "0.04em",
            textShadow: "0 2px 12px rgba(0,0,0,0.55)",
          }}
        >
          Spotlight
        </h3>
        <p
          className="text-xs text-center mt-2 mb-6 leading-relaxed px-2"
          style={{
            color: `${PALETTE.mist}cc`,
            textShadow: "0 1px 6px rgba(0,0,0,0.5)",
          }}
        >
          Highlighting the next generation of clinicians and researchers.
        </p>

        {/* Featured person — circular avatar with glow ring */}
        <div className="flex flex-col items-center mb-5">
          <div
            className="relative w-32 h-32 rounded-full overflow-hidden mb-4"
            style={{
              boxShadow: `0 0 0 3px ${PALETTE.surf}aa, 0 0 28px 4px ${PALETTE.surf}55, inset 0 0 0 1px rgba(255,255,255,0.15)`,
            }}
          >
            <img
              src={spotlightAvatarImage}
              alt="Featured spotlight"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <p className="text-xl font-bold tracking-tight text-center px-2">{featuredName}</p>
          {featuredRole && (
            <p
              className="text-sm mt-1 text-center"
              style={{ color: `${PALETTE.mist}cc` }}
            >
              {featuredRole}
            </p>
          )}
          {featuredInstitution && (
            <p
              className="text-sm text-center"
              style={{ color: `${PALETTE.mist}cc` }}
            >
              {featuredInstitution}
            </p>
          )}
        </div>

        {/* Featured work — neuron image as prominent background */}
        <div className="relative overflow-hidden rounded-xl mb-4 ring-1 ring-white/15 shadow-xl">
          <img
            src={featuredWorkImage}
            alt="Neural network — featured dissertation imagery"
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* Subtle bottom-weighted gradient — image stays visible, text remains legible */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(2,6,23,0.85) 0%, rgba(2,6,23,0.55) 40%, rgba(2,6,23,0.15) 75%, rgba(2,6,23,0) 100%)",
            }}
          />
          <div className="relative p-4 pt-24">
            <p
              className="text-[10px] font-bold tracking-widest uppercase mb-2"
              style={{ color: PALETTE.surf, textShadow: "0 1px 4px rgba(0,0,0,0.8)" }}
            >
              {featuredTypeLabel}
            </p>
            <p
              className="text-sm font-semibold text-white leading-snug mb-2 line-clamp-3"
              style={{ textShadow: "0 1px 6px rgba(0,0,0,0.9)" }}
            >
              {featuredTitle}
            </p>
            {featuredAbstractPreview && (
              <p
                className="text-xs text-white/85 leading-relaxed line-clamp-4"
                style={{ textShadow: "0 1px 4px rgba(0,0,0,0.85)" }}
                data-testid="text-spotlight-abstract"
              >
                {featuredAbstractPreview}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => onCta(spot?.id)}
          className="w-full rounded-lg px-4 py-2.5 text-sm font-semibold flex items-center justify-center gap-1.5 transition-all backdrop-blur-sm border"
          style={{
            background: `${PALETTE.teal}33`,
            borderColor: `${PALETTE.surf}66`,
            color: "#fff",
            boxShadow: `0 4px 18px -6px ${PALETTE.teal}aa`,
          }}
          data-testid="button-spotlight-cta"
        >
          View Feature
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
    </StudySurface>
  );
}

function StudyAnalyticsCard({
  series,
  averageScore,
  topicsStudied,
  totalTopics,
}: {
  series: { day: string; score: number }[];
  averageScore: number;
  topicsStudied: number;
  totalTopics: number;
}) {
  const scoreDescriptor =
    averageScore >= 85
      ? "Excellent retention"
      : averageScore >= 70
      ? "On track — keep going"
      : averageScore >= 50
      ? "Building proficiency"
      : averageScore > 0
      ? "Early progress — review weak areas"
      : "Take a quiz to see your score";
  const topicsDescriptor =
    totalTopics === 0
      ? "Topics loading…"
      : topicsStudied === 0
      ? `${totalTopics} topics available`
      : topicsStudied >= totalTopics
      ? "All topics started"
      : `${totalTopics - topicsStudied} topics left to explore`;
  return (
    <StudySurface tone="light" innerClassName="p-5 flex flex-col">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h2 className="font-semibold text-base whitespace-nowrap" style={{ color: PALETTE.mist }}>
          Study Analytics
        </h2>
        <button
          className="flex items-center gap-1 text-xs rounded-full px-3 py-1 transition-colors whitespace-nowrap border"
          style={{
            color: PALETTE.tealDeep,
            background: "rgba(255,255,255,0.7)",
            borderColor: `${PALETTE.surf}55`,
          }}
          data-testid="button-analytics-period"
        >
          This Week
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={series} margin={{ top: 8, right: 12, bottom: 4, left: 0 }}>
            <defs>
              <linearGradient id="studyAnalyticsLine" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={PALETTE.tealDeep} />
                <stop offset="100%" stopColor={PALETTE.surf} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke={`${PALETTE.surf}40`} strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: PALETTE.mistSoft }}
              interval={0}
              padding={{ left: 8, right: 8 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: PALETTE.mistSoft }}
              domain={[0, 100]}
              ticks={[0, 25, 50, 75, 100]}
              width={32}
            />
            <Tooltip
              cursor={{ stroke: PALETTE.surf, strokeWidth: 1 }}
              contentStyle={{
                background: "#FFFFFF",
                border: `1px solid ${PALETTE.surf}80`,
                borderRadius: 8,
                fontSize: 12,
              }}
            />
            <Line
              type="monotone"
              dataKey="score"
              stroke="url(#studyAnalyticsLine)"
              strokeWidth={2.5}
              dot={{ r: 3.5, fill: PALETTE.teal, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: PALETTE.tealDeep }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t" style={{ borderColor: `${PALETTE.surf}40` }}>
        <p className="text-xs font-semibold mb-3" style={{ color: PALETTE.mist }}>
          Performance Overview
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-3xl font-bold leading-none" style={{ color: PALETTE.mist }}>
              {averageScore}%
            </p>
            <p className="text-xs mt-1.5" style={{ color: PALETTE.mistSoft }}>Average Score</p>
            <p className="text-[11px] mt-0.5" style={{ color: PALETTE.tealDeep }}>
              {scoreDescriptor}
            </p>
          </div>
          <div>
            <p className="text-3xl font-bold leading-none" style={{ color: PALETTE.mist }}>
              {topicsStudied}
              {totalTopics > 0 && (
                <span className="text-base font-medium" style={{ color: PALETTE.mistSoft }}>
                  {" "}/ {totalTopics}
                </span>
              )}
            </p>
            <p className="text-xs mt-1.5" style={{ color: PALETTE.mistSoft }}>Topics Studied</p>
            <p className="text-[11px] mt-0.5" style={{ color: PALETTE.mistSoft }}>
              {topicsDescriptor}
            </p>
          </div>
        </div>
      </div>
    </StudySurface>
  );
}

function RecentActivityCard({
  isLoading,
  recent,
  onItemClick,
  onViewAll,
}: {
  isLoading: boolean;
  recent: RecentTopic[];
  onItemClick: (topicId: number) => void;
  onViewAll: () => void;
}) {
  function timeAgo(iso?: string | null) {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return "just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  }

  return (
    <StudySurface tone="light" innerClassName="p-5 flex flex-col">
      <h2 className="font-semibold text-base mb-4" style={{ color: PALETTE.mist }}>
        Recent Activity
      </h2>
      {isLoading ? (
        <div className="space-y-3 flex-1">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
      ) : recent.length > 0 ? (
        <div className="flex-1 space-y-1.5">
          {recent.slice(0, 3).map((t, idx) => {
            const tile = BRAND_TILES[idx % BRAND_TILES.length];
            return (
              <button
                key={t.id}
                onClick={() => onItemClick(t.topicId)}
                className="w-full flex items-center gap-3 hover:bg-white/5 px-2 py-2.5 rounded-lg transition-colors text-left"
                data-testid={`recent-${t.topicId}`}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border"
                  style={{ background: tile.bg, borderColor: tile.border }}
                >
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: PALETTE.mist }}>
                    {t.topicName || "Topic"}
                  </p>
                  <p className="text-xs truncate" style={{ color: PALETTE.mistSoft }}>
                    {t.score >= 80
                      ? `Completed · ${t.score}%`
                      : t.score > 0
                      ? `Started · ${t.score}%`
                      : "Started"}
                  </p>
                </div>
                <span className="text-[11px] flex-shrink-0 ml-2" style={{ color: PALETTE.mistSoft }}>
                  {timeAgo(t.lastAccessed)}
                </span>
              </button>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-center py-6 flex-1" style={{ color: PALETTE.mistSoft }}>
          Your study history will appear here.
        </p>
      )}
      <button
        onClick={onViewAll}
        className="text-xs hover:underline pt-3 text-center mt-3 font-medium border-t"
        style={{ color: PALETTE.tealDeep, borderColor: `${PALETTE.surf}40` }}
        data-testid="button-view-all-activity"
      >
        View all activity →
      </button>
    </StudySurface>
  );
}

function AchievementsCard({
  streak,
  topicsStudied,
  topicsCompleted,
  quizzesCompleted,
  examsCompleted,
  averageScore,
}: {
  streak: number;
  topicsStudied: number;
  topicsCompleted: number;
  quizzesCompleted: number;
  examsCompleted: number;
  averageScore: number;
}) {
  const achievements = [
    {
      icon: Medal,
      label: "First Steps",
      hint: "Complete your first topic",
      unlocked: topicsStudied >= 1,
    },
    {
      icon: Award,
      label: "Streak Starter",
      hint: "Study 3 days in a row",
      unlocked: streak >= 3,
    },
    {
      icon: ShieldCheck,
      label: "Score Master",
      hint: "Average 80% or higher",
      unlocked: averageScore >= 80,
    },
    {
      icon: BookOpen,
      label: "Quiz Veteran",
      hint: "Finish 10 quizzes",
      unlocked: quizzesCompleted >= 10,
    },
    {
      icon: Flame,
      label: "Week Warrior",
      hint: "Maintain a 7-day streak",
      unlocked: streak >= 7,
    },
    {
      icon: Trophy,
      label: "Exam Ready",
      hint: "Complete 5 practice exams",
      unlocked: examsCompleted >= 5,
    },
  ];
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  // topicsCompleted is currently unused in the badge thresholds above but is
  // accepted for future expansion (e.g. a "Topic Master" tier).
  void topicsCompleted;

  return (
    <StudySurface tone="light" innerClassName="p-5 flex flex-col">
      <div className="flex items-start justify-between mb-4 gap-3">
        <div className="min-w-0">
          <h2 className="font-semibold text-base" style={{ color: PALETTE.mist }}>
            Achievements
          </h2>
          <p className="text-xs mt-0.5" style={{ color: PALETTE.mistSoft }}>
            {unlockedCount}/{achievements.length} unlocked
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-1.5">
        {achievements.map((a, idx) => {
          const Icon = a.icon;
          const tile = BRAND_TILES[idx % BRAND_TILES.length];
          return (
            <div
              key={a.label}
              className={cn(
                "flex items-center gap-3 px-2 py-2.5 rounded-lg",
                a.unlocked ? "" : "opacity-55",
              )}
              data-testid={`achievement-${a.label.replace(/\s+/g, "-").toLowerCase()}`}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border"
                style={{
                  background: a.unlocked ? tile.bg : "rgba(148,163,184,0.18)",
                  borderColor: a.unlocked ? tile.border : "transparent",
                }}
              >
                <Icon className={cn("w-4 h-4", a.unlocked ? "text-white" : "text-slate-400")} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate" style={{ color: PALETTE.mist }}>
                  {a.label}
                </p>
                <p className="text-xs truncate" style={{ color: PALETTE.mistSoft }}>
                  {a.hint}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </StudySurface>
  );
}
