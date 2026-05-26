// =============================================================================
// Dashboard — PROTECTED.
// ---------------------------------------------------------------------------
// Layout matches the 2026-05 reference: header (PSYCHPRO wordmark + tagline
// "advance your mind. elevate care."), then a two-column main area with
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
//   - Re-introduce StudyAnalytics / RecentActivity / Achievements /
//     TodayReviews cards on this page — they don't belong in the
//     reference layout. Those metrics live on /progress.
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
} from "lucide-react";
import smokeBg from "@/assets/bg/brain-clouds.png";
import { useGetDashboardSummary, useGetTopics, useGetLeaderboard } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { StudySurface } from "@/components/study/study-surface";
import { NotificationsBell } from "@/components/notifications-bell";
import { BrandBanner } from "@/components/brand/brand-banner";
import { STUDY_PALETTE as PALETTE } from "@/lib/study-theme";
import {
  ResponsiveContainer,
  LineChart,
  Line,
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
    // topics so we don't accidentally fall through to the empty state when we
    // actually have a full catalogue to show.
    const catalogue = [...(allTopics ?? [])].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    catalogue.forEach((t) => {
      push({ id: t.id, topicId: t.id, topicName: t.name, score: 0, lastAccessed: null });
    });
    recent.forEach(push);
    return out;
  }, [weak, recent, allTopics]);

  return (
    <div
      className="min-h-full study-page-bg"
      data-testid="dashboard-page"
    >
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        {/* Top header — notifications bell + canonical BrandBanner.
            Uses the BrandBanner's canonical "learn. expand. connect."
            tagline so the dashboard and the landing hero stay in sync. */}
        <header className="relative mb-8 py-4">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-3">
            <NotificationsBell />
          </div>
          <BrandBanner
            size="lg"
            greeting={greetingText}
            className="mt-6 mb-8"
          />
        </header>

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
              className="glass-button rounded-md px-4"
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
              className="glass-button rounded-md px-4 border-0"
            >
              Upgrade
            </Button>
          </div>
        )}

        {/* Two-column: main + spotlight rail */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-6">
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
                    className="glass-button rounded-md px-5"
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
                    className="glass-button rounded-md px-5"
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
                  <button
                    onClick={() => navigate("/leaderboard")}
                    className="glass-button text-xs rounded-full px-3 h-7"
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

          {/* Spotlight rail */}
          <aside className="lg:sticky lg:top-6 self-start">
            <SpotlightCard onCta={(id) => navigate(id ? `/featured-work?submission=${id}` : "/featured-work")} />
          </aside>
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
  submitter: { displayName: string; role: string | null; institution: string | null };
};

function SpotlightCard({ onCta }: { onCta: (submissionId?: number) => void }) {
  const [spot, setSpot] = useState<SpotlightSubmission | null>(null);
  const { user } = useUser();

  useEffect(() => {
    let cancelled = false;
    fetch("/api/featured-work/spotlight")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => { if (!cancelled && d) setSpot(d); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const viewerName =
    user?.fullName ||
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.username ||
    user?.primaryEmailAddress?.emailAddress?.split("@")[0] ||
    "PsychPro Member";
  const viewerAvatar = user?.imageUrl ?? undefined;

  const featuredName = spot ? spot.submitter.displayName : viewerName;
  const featuredRole = spot ? (spot.submitter.role ?? "Contributor") : "PsyD Candidate";
  const featuredInstitution = spot
    ? (spot.submitter.institution ?? "")
    : "Clinical Neuropsychology";
  const avatarImage = spot ? undefined : viewerAvatar;

  return (
    <StudySurface tone="dark" innerClassName="relative overflow-hidden p-7 text-white">
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

      <div className="relative">
        {/* Outlined star */}
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
          className="text-xs text-center mt-2 mb-8 leading-relaxed px-2"
          style={{
            color: `${PALETTE.mist}cc`,
            textShadow: "0 1px 6px rgba(0,0,0,0.5)",
          }}
        >
          Highlighting the next generation of clinicians and researchers.
        </p>

        {/* Featured person — circular avatar with cyan spotlight glow */}
        <div className="flex flex-col items-center">
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
              day{streak === 1 ? "" : "s"}
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
