// =============================================================================
// Dashboard — PROTECTED.
// ---------------------------------------------------------------------------
// Layout matches the 2026-05 reference: header (PSYCHPRO wordmark + tagline
// "learn. expand. connect."), then a two-column main area with
//   Left:  Begin/Continue Your Journey · Recommended for You (2x2)
//          · Streak + Leaderboard row
//   Right: Spotlight rail (smoky, circular photo, FEATURED WORK label)
//
// DO NOT:
//   - Add a competing wallpaper (no per-page bg image, no extra ::before).
//   - Re-render an inline <h1>PSYCHPRO</h1> wordmark — use <BrandBanner/>.
//   - Resurrect "Hello, there" / "Welcome back, there" — greeting is
//     personalized or omitted (never a placeholder name).
//   - Hardcode brand hex codes — use STUDY_PALETTE tokens.
//   - Replace StudySurface cards with raw bg-card / glass divs.
//
// METRIC ROW (bottom): a full-width row of four glass cards sits below the
// Streak + Leaderboard row — Study Analytics, Recent Activity, Achievements,
// and Today's Reviews. They reuse data the dashboard already fetches
// (recent topics, weekly activity / activity series) plus the existing
// TodayReviews component; Achievements is derived client-side from existing
// stats (no backend). Keep these wrapped in StudySurface so they match.
// =============================================================================
import { useEffect, useMemo, useRef, useState } from "react";
import { authHeaders } from "@/lib/auth-headers";
import { useLocation } from "wouter";
import { useUser } from "@clerk/clerk-react";
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
  Share2,
  Activity,
  Award,
  Clock,
  GraduationCap,
  Lock,
  CheckCircle2,
} from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import smokeBg from "@/assets/bg/brain-clouds.png";
import spotlightPortrait from "@/assets/spotlight/featured.png";
import {
  useGetDashboardSummary,
  useGetTopics,
  useGetLeaderboard,
  getCourseMasteryStatus,
  getGetCourseMasteryStatusQueryKey,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { StudySurface } from "@/components/study/study-surface";
import TodayReviews from "@/components/learning/today-reviews";
import { STUDY_PALETTE as PALETTE } from "@/lib/study-theme";
import { isEpppTopic } from "@/lib/eppp-content";
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

// Brand-family icon palettes — each tile gets a slightly different teal/surf
// gradient so the recommended row feels cohesive instead of rainbow.
const BRAND_TILES = [
  { bg: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`, border: PALETTE.tealDeep },
  { bg: `linear-gradient(135deg, ${PALETTE.tealDeep}, ${PALETTE.teal})`, border: PALETTE.tealDeep },
  { bg: `linear-gradient(135deg, ${PALETTE.surfaceElev}, ${PALETTE.tealDeep})`, border: PALETTE.surfaceElev },
  { bg: `linear-gradient(135deg, ${PALETTE.surf}, ${PALETTE.mist})`, border: PALETTE.teal },
] as const;

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

  const recent = (summary?.recentTopics ?? []) as RecentTopic[];
  const weak = (summary?.weakAreas ?? []) as RecentTopic[];
  const mainTopics = useMemo(
    () => (allTopics ?? []).filter((topic) => !isEpppTopic(topic)),
    [allTopics],
  );
  const mainTopicIds = useMemo(
    () => new Set(mainTopics.map((topic) => topic.id)),
    [mainTopics],
  );
  const mainRecent = useMemo(
    () => recent.filter((topic) => mainTopicIds.has(topic.topicId)),
    [recent, mainTopicIds],
  );
  const mainWeak = useMemo(
    () => weak.filter((topic) => mainTopicIds.has(topic.topicId)),
    [weak, mainTopicIds],
  );

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
  const activitySeries = useMemo(() => buildActivitySeries(mainRecent), [mainRecent]);

  // Pick the first recent topic that isn't fully mastered; fall back to the
  // most-recent entry so returning students always see something to resume.
  const continueTopic = mainRecent.find((r) => r.score < 100) ?? mainRecent[0];

  // Achievements are derived entirely client-side from stats the dashboard
  // already has (streak, topics studied, mastery count, average score) — no
  // new backend. Each badge is "earned" once its threshold is crossed.
  const achievements = useMemo(() => {
    const topicsStudied = mainRecent.length;
    const mastered = mainRecent.filter((r) => r.score >= 80).length;
    const avgScore = topicsStudied
      ? Math.round(mainRecent.reduce((sum, r) => sum + r.score, 0) / topicsStudied)
      : 0;
    return [
      {
        icon: Flame,
        label: "Streak Starter",
        hint: "3-day streak",
        earned: streak >= 3,
      },
      {
        icon: BookOpen,
        label: "Explorer",
        hint: "Study 5 topics",
        earned: topicsStudied >= 5,
      },
      {
        icon: Star,
        label: "Scholar",
        hint: "Master 3 topics",
        earned: mastered >= 3,
      },
      {
        icon: TrendingUp,
        label: "Sharp Mind",
        hint: "80% avg score",
        earned: avgScore >= 80,
      },
    ];
  }, [mainRecent, streak]);

  const courseCategories = useMemo(() => {
    const set = new Set<string>();
    mainTopics.forEach((t) => set.add(t.category || "Other"));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [mainTopics]);

  const recommended = useMemo(() => {
    const seen = new Set<number>();
    const out: RecentTopic[] = [];
    const push = (t: RecentTopic) => {
      if (out.length >= 4 || seen.has(t.topicId)) return;
      seen.add(t.topicId);
      out.push(t);
    };
    const hasHistory = mainRecent.length > 0 || mainWeak.length > 0;
    if (hasHistory) {
      mainWeak.forEach(push);
      mainRecent.filter((r) => r.score < 80).forEach(push);
    }
    // For brand-new users (no history), recommend alphabetically-sorted starter
    // topics so we don't accidentally fall through to the empty state when we
    // actually have a full catalogue to show.
    const catalogue = [...mainTopics].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    catalogue.forEach((t) => {
      push({ id: t.id, topicId: t.id, topicName: t.name, score: 0, lastAccessed: null });
    });
    mainRecent.forEach(push);
    return out;
  }, [mainWeak, mainRecent, mainTopics]);

  return (
    <div
      className="min-h-full study-page-bg"
      data-testid="dashboard-page"
    >
      <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8 pb-4 md:pb-6 lg:pb-8">
        {isOverLimit && (
          <div
            className="rounded-xl p-4 mb-6 flex items-start gap-3 border"
            style={{
              background: "rgba(94,176,200,0.16)",
              borderColor: `${PALETTE.tealDeep}88`,
            }}
            data-testid="banner-over-limit"
          >
            <Zap
              className="w-5 h-5 flex-shrink-0 mt-0.5"
              style={{ color: PALETTE.tealDeep }}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm" style={{ color: PALETTE.mist }}>
                Free limit reached
              </p>
              <p className="text-sm mt-1" style={{ color: `${PALETTE.mist}cc` }}>
                You've used all {summary?.freeLimit ?? 10} free interactions.
                Upgrade to continue studying.
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => navigate("/subscription")}
              data-testid="button-upgrade-banner"
              className="rounded-md px-4"
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
              className="rounded-md px-4"
            >
              Upgrade
            </Button>
          </div>
        )}

        {/* Two-column: main + spotlight rail.
            items-stretch makes the right rail match the full height of the
            left content stack so the Spotlight box top aligns with "Begin
            Your Journey" and its footer aligns with the Streak/Leaderboard row. */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6 items-stretch">
          <div className="min-w-0 space-y-6">
            {/* Begin/Continue Your Journey (full width, top) */}
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
                    className="rounded-md px-5"
                  >
                    Continue Studying
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              ) : (
                <div>
                  <p className="text-sm mb-4" style={{ color: PALETTE.mistSoft }}>
                    Pick a topic to start your first study session. We'll keep
                    track of your progress from here.
                  </p>
                  <Button
                    onClick={() => navigate("/topics")}
                    data-testid="button-begin-journey"
                    className="rounded-md px-5"
                  >
                    Browse Topics
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )}
            </StudySurface>

            {/* Recommended for You — 2x2 grid of 4 topics */}
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
                        className="recommended-tile group w-full flex items-center gap-3 p-3 rounded-lg text-left border transition-all hover:-translate-y-0.5"
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

            {/* Streak (left) + Leaderboard (right) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <StreakCard
                streak={streak}
                series={activitySeries}
                weeklyFlames={weeklyFlames}
              />

              {/* Leaderboard */}
              <StudySurface tone="light" innerClassName="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-4 h-4" style={{ color: PALETTE.tealDeep }} />
                    <h2 className="font-semibold" style={{ color: PALETTE.mist }}>Leaderboard</h2>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/leaderboard")}
                    className="text-xs rounded-full px-3 h-7"
                    data-testid="button-view-leaderboard"
                  >
                    View all
                  </Button>
                </div>
                {!leaderboard ? (
                  <div className="space-y-2">
                    <Skeleton className="h-8 rounded-lg" />
                    <Skeleton className="h-8 rounded-lg" />
                    <Skeleton className="h-8 rounded-lg" />
                  </div>
                ) : leaderboard.entries.length === 0 ? (
                  <p className="text-xs text-center py-4" style={{ color: PALETTE.mistSoft }}>
                    Be the first to land on the board.
                  </p>
                ) : (
                  <div className="space-y-1">
                    {leaderboard.entries.slice(0, 5).map((e) => (
                      <div
                        key={e.rank}
                        className={cn("flex items-center gap-2 px-2 py-1.5 rounded-lg")}
                        style={
                          e.isCurrentUser
                            ? { background: `${PALETTE.teal}1f` }
                            : undefined
                        }
                        data-testid={`leaderboard-row-${e.rank}`}
                      >
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border backdrop-blur-md",
                            e.rank === 1
                              ? "bg-yellow-400/20 text-yellow-200 border-yellow-300/40"
                              : e.rank === 2
                              ? "bg-slate-200/15 text-slate-100 border-slate-200/30"
                              : e.rank === 3
                              ? "bg-amber-500/20 text-amber-200 border-amber-300/35"
                              : "bg-cyan-400/10 text-cyan-100 border-cyan-300/25"
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
                                : "text-white/25"
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

          {/* Spotlight rail — fills the column height (see grid items-stretch) */}
          <aside className="min-w-0">
            <SpotlightCard onCta={(id) => navigate(id ? `/featured-work?submission=${id}` : "/featured-work")} />
          </aside>
        </div>

        {/* Bottom metric row — full-width grid of four glass cards. */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-6">
          {/* Study Analytics — activity/score trend */}
          <StudySurface tone="light" innerClassName="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4" style={{ color: PALETTE.tealDeep }} />
              <h2 className="font-semibold" style={{ color: PALETTE.mist }}>Study Analytics</h2>
            </div>
            {isLoading ? (
              <Skeleton className="h-[140px] rounded-lg" />
            ) : (
              <div style={{ height: 140 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={activitySeries} margin={{ top: 8, right: 8, bottom: 0, left: -22 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(118,228,247,0.12)" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: PALETTE.mistSoft }}
                    />
                    <YAxis
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: PALETTE.mistSoft }}
                      width={36}
                    />
                    <Tooltip
                      cursor={{ stroke: PALETTE.teal, strokeOpacity: 0.25 }}
                      contentStyle={{
                        background: "rgba(6,28,40,0.92)",
                        border: "1px solid rgba(118,228,247,0.25)",
                        borderRadius: 10,
                        color: PALETTE.mist,
                        fontSize: 12,
                      }}
                      labelStyle={{ color: PALETTE.mistSoft }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke={PALETTE.surf}
                      strokeWidth={2.5}
                      dot={{ r: 2.5, fill: PALETTE.teal }}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
          </StudySurface>

          {/* Recent Activity — most recently studied topics */}
          <StudySurface tone="light" innerClassName="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4" style={{ color: PALETTE.tealDeep }} />
              <h2 className="font-semibold" style={{ color: PALETTE.mist }}>Recent Activity</h2>
            </div>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-9 rounded-lg" />
                <Skeleton className="h-9 rounded-lg" />
                <Skeleton className="h-9 rounded-lg" />
              </div>
            ) : mainRecent.length === 0 ? (
              <p className="text-xs" style={{ color: PALETTE.mistSoft }}>
                Study a topic and it'll show up here so you can pick up where you left off.
              </p>
            ) : (
              <ul className="space-y-2">
                {mainRecent.slice(0, 5).map((r) => (
                  <li key={r.id}>
                    <button
                      onClick={() => navigate(`/topics/${r.topicId}`)}
                      className="recommended-tile w-full flex items-center gap-3 px-3 py-2 rounded-lg border text-left transition-all hover:-translate-y-0.5"
                      data-testid={`recent-activity-${r.topicId}`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: PALETTE.mist }}>
                          {r.topicName}
                        </p>
                      </div>
                      <span className="text-xs font-semibold tabular-nums flex-shrink-0" style={{ color: PALETTE.tealDeep }}>
                        {r.score}%
                      </span>
                      <ChevronRight className="w-4 h-4 flex-shrink-0" style={{ color: PALETTE.tealDeep }} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </StudySurface>

          {/* Achievements — milestone badges derived from existing stats */}
          <StudySurface tone="light" innerClassName="p-5">
            <div className="flex items-center gap-2 mb-3">
              <Award className="w-4 h-4" style={{ color: PALETTE.tealDeep }} />
              <h2 className="font-semibold" style={{ color: PALETTE.mist }}>Achievements</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {achievements.map((a) => {
                const Icon = a.icon;
                return (
                  <div
                    key={a.label}
                    className="flex flex-col items-center text-center gap-1.5 p-3 rounded-lg border transition-all"
                    style={
                      a.earned
                        ? {
                            background: "rgba(94,176,200,0.14)",
                            borderColor: "rgba(118,228,247,0.35)",
                          }
                        : {
                            background: "rgba(6,28,40,0.4)",
                            borderColor: "rgba(118,228,247,0.10)",
                            opacity: 0.55,
                          }
                    }
                    data-testid={`achievement-${a.earned ? "earned" : "locked"}`}
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center border"
                      style={
                        a.earned
                          ? {
                              background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`,
                              borderColor: PALETTE.tealDeep,
                            }
                          : {
                              background: "rgba(94,176,200,0.10)",
                              borderColor: "rgba(118,228,247,0.20)",
                            }
                      }
                    >
                      <Icon className="w-4 h-4" style={{ color: a.earned ? "#04222E" : PALETTE.mistSoft }} />
                    </div>
                    <p className="text-[11px] font-semibold leading-tight" style={{ color: PALETTE.mist }}>
                      {a.label}
                    </p>
                    <p className="text-[10px] leading-tight" style={{ color: PALETTE.mistSoft }}>
                      {a.hint}
                    </p>
                  </div>
                );
              })}
            </div>
          </StudySurface>

          {/* Today's Reviews — due spaced-repetition queue (own glass surface) */}
          <TodayReviews topics={mainTopics} />
        </div>

        {/* Course Mastery — full-width capstone row, below all other boxes. One
            tile per course; dull until its mastery exam is passed, then it
            lights up and glows. */}
        <div className="mt-6">
          <CourseMasterySection categories={courseCategories} navigate={navigate} />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// SpotlightCard — tall right-rail card matching the reference comp.
// Smoky brain backdrop bleeds into the card top, centered star + "Spotlight"
// wordmark, circular photo with cyan aura, name + credentials, and a quiet
// FEATURED WORK / share-icon footer that links into /featured-work.
//
// Uses the public /api/featured-work/spotlight endpoint (no auth required) —
// the API rotates a real approved community submission daily. When no
// submission is available we fall back to the signed-in user's profile so
// the card never shows a placeholder name.
// ---------------------------------------------------------------------------
type SpotlightSubmission = {
  id: number;
  workType: string;
  title: string;
  abstract: string;
  submitter: {
    displayName: string;
    role: string | null;
    institution: string | null;
    profilePhotoUrl: string | null;
  };
};

// Pretty-print the workType taxonomy slug ("dissertation", "case_study", …)
// so the spotlight badge reads naturally without a separate lookup table.
function formatWorkType(slug: string | undefined | null): string {
  if (!slug) return "Featured";
  return slug
    .split(/[_\s-]+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

// Mirror of profilePhotoSrc in app-layout: object-storage paths (`/objects/...`)
// must be prefixed with `/api/storage` so the dev/prod proxy routes them to
// the api-server's storage endpoint. Absolute http(s) URLs pass through.
function resolveSpotlightPhoto(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  if (path.startsWith("/objects/")) return `/api/storage${path}`;
  return path;
}

function SpotlightCard({ onCta }: { onCta: (submissionId?: number) => void }) {
  const [spot, setSpot] = useState<SpotlightSubmission | null>(null);
  const [viewerProfilePhoto, setViewerProfilePhoto] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/featured-work/spotlight")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled && d) setSpot(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // Pull the viewer's own /api/profile/me photo so the no-spotlight fallback
  // can use their uploaded portrait before resorting to the Clerk avatar.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/api/profile/me", { headers: await authHeaders() });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled) return;
        setViewerProfilePhoto(typeof data?.profilePhotoUrl === "string" ? data.profilePhotoUrl : null);
      } catch {
        /* silent — avatar falls through to Clerk image or initial */
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  const viewerName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "PsychPro Member";
  const viewerAvatar = user?.imageUrl ?? undefined;
  const viewerProfilePhotoSrc = resolveSpotlightPhoto(viewerProfilePhoto);

  const featuredName = spot ? spot.submitter.displayName : viewerName;
  const featuredRole = spot ? (spot.submitter.role ?? "Contributor") : "PsyD Candidate";
  const featuredInstitution = spot
    ? (spot.submitter.institution ?? "")
    : "Clinical Neuropsychology";

  // Avatar fallback chain:
  //   When a spotlight submission exists: use ONLY the submitter's uploaded
  //   portrait (or the initial-letter circle when absent). We deliberately do
  //   NOT mix in the viewer's photo here — display-name equality isn't a
  //   reliable identity check, and the spotlight payload doesn't expose a
  //   stable user id we can match against.
  //   When no submission has loaded: fall back to the viewer's own profile
  //   photo, then their Clerk avatar, so the card never feels empty.
  //   Final safety net: the bundled spotlightPortrait. Per product call,
  //   we always want a face on this card — never the initial-letter
  //   circle — so the portrait is the last resort in both branches.
  const avatarImage =
    (spot
      ? resolveSpotlightPhoto(spot.submitter.profilePhotoUrl)
      : viewerProfilePhotoSrc ?? viewerAvatar) ?? spotlightPortrait;

  return (
    <StudySurface tone="dark" fillHeight className="w-full" innerClassName="relative overflow-hidden p-7 text-white flex flex-col">
      {/* Smoky brain backdrop bleeds through the entire card — same atmosphere
          as the page background so the spotlight reads as cut from the
          surrounding smoke continuum. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(2,13,18,0.35) 0%, rgba(2,13,18,0.55) 55%, rgba(2,13,18,0.8) 100%), url(${smokeBg})`,
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
          opacity: 0.95,
        }}
      />

      {/* Soft cyan nebula glows around the avatar */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -right-12 w-56 h-56 rounded-full blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${PALETTE.surf}40, transparent)` }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-10 w-48 h-48 rounded-full blur-3xl"
        style={{ background: `radial-gradient(closest-side, ${PALETTE.teal}30, transparent)` }}
      />

      <div className="relative flex flex-1 flex-col">
        {/* Spotlight header — a single star above the wordmark, matching the
            reference comp (no surrounding pill). */}
        <div className="flex flex-col items-center" data-testid="spotlight-title-pill">
          <Star
            className="w-6 h-6"
            strokeWidth={1.5}
            style={{ color: PALETTE.surf, filter: `drop-shadow(0 0 8px ${PALETTE.surf}aa)` }}
          />
          <span
            className="mt-2 text-lg font-semibold text-white tracking-wide"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
          >
            Spotlight
          </span>
        </div>
        <p
          className="text-xs text-center mt-2 leading-relaxed px-2"
          style={{
            color: `${PALETTE.mist}cc`,
            textShadow: "0 1px 6px rgba(0,0,0,0.5)",
          }}
        >
          Highlighting the next generation of clinicians and researchers.
        </p>

        {/* Featured person — circular avatar with cyan spotlight glow.
            flex-1 + justify-center vertically centers this block so the
            portrait sits at the optical center of the full-height card. */}
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="relative mb-5">
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{
                width: 260,
                height: 260,
                background: `radial-gradient(circle, ${PALETTE.surf}55 0%, ${PALETTE.surf}28 28%, ${PALETTE.teal}14 50%, transparent 72%)`,
                filter: "blur(10px)",
                zIndex: 0,
              }}
            />
            <div
              aria-hidden
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full"
              style={{
                width: 170,
                height: 170,
                background: `radial-gradient(circle, ${PALETTE.surf}75 0%, ${PALETTE.surf}30 45%, transparent 75%)`,
                filter: "blur(14px)",
                zIndex: 0,
              }}
            />
            <div
              className="relative w-32 h-32 rounded-full overflow-hidden"
              style={{
                boxShadow: `0 0 0 3px ${PALETTE.surf}cc, 0 0 32px 6px ${PALETTE.surf}66, inset 0 0 0 1px rgba(255,255,255,0.18)`,
                zIndex: 1,
              }}
              data-testid="spotlight-avatar"
            >
              {avatarImage ? (
                <img
                  src={avatarImage}
                  alt={`${featuredName} — featured spotlight`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center text-3xl font-light"
                  style={{
                    background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`,
                    color: PALETTE.cloud,
                  }}
                >
                  {(featuredName ?? "?").slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
          </div>
          <p
            className="text-xl font-semibold tracking-tight text-center px-2"
            data-testid="spotlight-name"
            style={{ textShadow: "0 2px 10px rgba(0,0,0,0.55)" }}
          >
            {featuredName}
          </p>
          {featuredRole && (
            <p
              className="text-sm mt-1 text-center"
              style={{ color: `${PALETTE.mist}cc`, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
            >
              {featuredRole}
            </p>
          )}
          {featuredInstitution && (
            <p
              className="text-sm text-center"
              style={{ color: `${PALETTE.mist}cc`, textShadow: "0 1px 6px rgba(0,0,0,0.5)" }}
            >
              {featuredInstitution}
            </p>
          )}
        </div>

        {/* Submission details — work-type chip + title + truncated abstract.
            Only renders when a real spotlight submission has loaded so the
            empty/fallback state stays clean. The whole block is clickable
            and links into /featured-work?submission=<id>. */}
        {spot && (spot.title || spot.abstract) && (
          <button
            type="button"
            onClick={() => onCta(spot.id)}
            className="group block w-full mt-6 text-left rounded-xl border backdrop-blur-md p-4 transition-all hover:bg-white/[0.08] hover:border-[color:var(--nav-glow,#76e4f7)]/55"
            style={{
              background: "rgba(255,255,255,0.04)",
              borderColor: `${PALETTE.surf}33`,
              boxShadow: "inset 0 1px 0 0 rgba(255,255,255,0.08)",
            }}
            data-testid="spotlight-submission-detail"
          >
            <div className="flex items-center justify-between mb-2">
              <span
                className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] px-2 py-0.5 rounded-full border"
                style={{
                  background: `${PALETTE.surf}1c`,
                  borderColor: `${PALETTE.surf}55`,
                  color: PALETTE.mist,
                }}
              >
                <Sparkles className="w-2.5 h-2.5" />
                {formatWorkType(spot.workType)}
              </span>
              <ArrowUpRight
                className="w-4 h-4 opacity-60 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: PALETTE.mist }}
              />
            </div>
            {spot.title && (
              <p
                className="text-sm font-semibold leading-snug text-white line-clamp-2"
                style={{ textShadow: "0 1px 6px rgba(0,0,0,0.45)" }}
              >
                {spot.title}
              </p>
            )}
            {spot.abstract && (
              <p
                className="text-xs mt-1.5 leading-relaxed line-clamp-3"
                style={{ color: `${PALETTE.mist}b8` }}
              >
                {spot.abstract}
              </p>
            )}
          </button>
        )}

        {/* Footer — muted FEATURED WORK label on the left, share icon right.
            Both targets link into /featured-work (deep-linked to the
            current spotlight submission when one exists). */}
        <div className="mt-8 pt-5 flex items-center justify-between border-t border-white/10">
          <button
            type="button"
            onClick={() => onCta(spot?.id)}
            className="text-[10px] font-semibold tracking-[0.32em] uppercase transition-colors hover:text-white"
            style={{ color: `${PALETTE.mistSoft}cc` }}
            data-testid="spotlight-footer-label"
          >
            Featured Work
          </button>
          <button
            type="button"
            onClick={() => onCta(spot?.id)}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all border"
            style={{
              background: `${PALETTE.surf}14`,
              borderColor: `${PALETTE.surf}38`,
              color: PALETTE.mist,
            }}
            aria-label="View featured work"
            data-testid="button-spotlight-share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </StudySurface>
  );
}

// ---------------------------------------------------------------------------
// StreakCard — count-up streak number + glowing teal sparkline.
// Matches the reference dashboard's "Your Streak 🔥" widget.
// ---------------------------------------------------------------------------
function useCountUp(target: number, durationMs = 1100) {
  const [value, setValue] = useState(0);
  const rafRef = useRef<number | null>(null);
  useEffect(() => {
    if (target <= 0) {
      setValue(0);
      return;
    }
    const start = performance.now();
    const from = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (target - from) * eased));
      if (t < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, durationMs]);
  return value;
}

function CourseMasterySection({
  categories,
  navigate,
}: {
  categories: string[];
  navigate: (to: string) => void;
}) {
  // One status request per course, fetched in parallel. The query key matches
  // the per-course mastery-status hook so the cache is shared with the topics
  // page (no duplicate fetches when navigating between them).
  const queries = useQueries({
    queries: categories.map((category) => ({
      queryKey: getGetCourseMasteryStatusQueryKey(category),
      queryFn: () => getCourseMasteryStatus(category),
      staleTime: 60_000,
    })),
  });

  if (categories.length === 0) return null;

  const masteredCount = queries.filter((q) => q.data?.mastered).length;

  return (
    <StudySurface tone="light" innerClassName="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-4 h-4" style={{ color: PALETTE.tealDeep }} />
          <h2 className="font-semibold" style={{ color: PALETTE.mist }}>
            Course Mastery
          </h2>
        </div>
        <span
          className="text-xs font-semibold tabular-nums"
          style={{ color: PALETTE.tealDeep }}
        >
          {masteredCount}/{categories.length} mastered
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {categories.map((category, i) => {
          const status = queries[i]?.data;
          const isLoading = queries[i]?.isLoading;
          const mastered = !!status?.mastered;
          if (isLoading && !status) {
            return <Skeleton key={category} className="h-[104px] rounded-xl" />;
          }
          const slug = category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          return (
            <button
              key={category}
              onClick={() =>
                navigate(`/courses/${encodeURIComponent(category)}/mastery-exam`)
              }
              className={cn(
                "course-mastery-tile group relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border text-center min-h-[104px]",
                mastered
                  ? "course-mastery-tile--mastered"
                  : "course-mastery-tile--locked",
              )}
              data-testid={`course-mastery-tile-${slug}`}
              title={
                mastered
                  ? `${category} — mastered`
                  : status?.unlocked
                    ? `${category} — mastery exam ready`
                    : `${category} — ${status?.passedTopics ?? 0}/${status?.totalTopics ?? 0} lessons passed`
              }
            >
              {mastered && (
                <CheckCircle2
                  className="absolute top-2 right-2 w-4 h-4 text-white"
                  aria-hidden
                />
              )}
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={
                  mastered
                    ? { background: "rgba(255,255,255,0.16)" }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                      }
                }
              >
                {mastered ? (
                  <GraduationCap className="w-5 h-5 text-white" />
                ) : (
                  <Lock className="w-5 h-5" style={{ color: PALETTE.mistSoft }} />
                )}
              </div>
              <span
                className="text-sm font-semibold leading-tight line-clamp-2"
                style={{ color: mastered ? "#fff" : PALETTE.mist }}
              >
                {category}
              </span>
              <span
                className="text-[11px] font-medium"
                style={{
                  color: mastered ? "rgba(255,255,255,0.85)" : PALETTE.mistSoft,
                }}
              >
                {mastered
                  ? "Mastered"
                  : status?.unlocked
                    ? "Exam ready"
                    : `${status?.passedTopics ?? 0}/${status?.totalTopics ?? 0} lessons`}
              </span>
            </button>
          );
        })}
      </div>
    </StudySurface>
  );
}

function StreakCard({
  streak,
  series,
  weeklyFlames,
}: {
  streak: number;
  series: { day: string; score: number }[];
  weeklyFlames: { label: string; lit: boolean; isToday: boolean }[];
}) {
  const animated = useCountUp(streak, 1200);
  // Ensure the sparkline always has something to draw — when scores are all
  // zero the line collapses to a flat baseline, so we lift it slightly by
  // counting active days as 1's so the trend reads.
  const sparkData = useMemo(() => {
    const allZero = series.every((s) => s.score === 0);
    if (!allZero) return series;
    return weeklyFlames.map((d, i) => ({ day: d.label, score: d.lit ? 1 : 0, i }));
  }, [series, weeklyFlames]);

  const activeDays = weeklyFlames.filter((d) => d.lit).length;

  return (
    <StudySurface tone="light" innerClassName="p-5">
      <div className="flex items-center gap-2 mb-3">
        <h2 className="font-semibold" style={{ color: PALETTE.mist }}>Your Streak</h2>
        <span aria-hidden>🔥</span>
      </div>
      <div className="flex items-end justify-between gap-3 mb-3">
        <div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-5xl font-bold leading-none tabular-nums"
              style={{
                color: PALETTE.mist,
                textShadow: `0 0 24px ${PALETTE.surf}55`,
              }}
              data-testid="text-streak-count"
            >
              {animated}
            </span>
            <span className="text-sm" style={{ color: PALETTE.mistSoft }}>
              day{animated === 1 ? "" : "s"}
            </span>
          </div>
          <p
            className="mt-1 text-[11px] tracking-wide uppercase font-semibold"
            style={{ color: PALETTE.tealDeep }}
          >
            {activeDays}/7 this week
          </p>
        </div>
        <div className="flex-1 max-w-[160px] h-16">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={sparkData} margin={{ top: 6, right: 4, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="streakSparkStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={PALETTE.teal} stopOpacity={0.6} />
                  <stop offset="100%" stopColor={PALETTE.surf} stopOpacity={1} />
                </linearGradient>
                <filter id="streakSparkGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="2.4" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <Line
                type="monotone"
                dataKey="score"
                stroke="url(#streakSparkStroke)"
                strokeWidth={2.25}
                dot={false}
                isAnimationActive
                animationDuration={1000}
                filter="url(#streakSparkGlow)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <p className="text-xs" style={{ color: PALETTE.mistSoft }}>
        {streak === 0
          ? "Study today to start a streak."
          : streak < 3
          ? "You're building momentum!"
          : "Great consistency this week."}
      </p>
    </StudySurface>
  );
}
