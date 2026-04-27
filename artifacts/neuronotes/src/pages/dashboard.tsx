import { useMemo, type ComponentType } from "react";
import { useLocation } from "wouter";
import {
  BookOpen,
  Brain,
  Trophy,
  Zap,
  ChevronRight,
  Bell,
  Flame,
  Star,
  Target,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
  Map as MapIcon,
} from "lucide-react";
import { useGetDashboardSummary, useGetTopics, useGetLeaderboard, useGetUserProgress } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser, UserButton } from "@clerk/react";
import { cn } from "@/lib/utils";
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

function computeStreak(recent: RecentTopic[]) {
  const days = new Set(
    recent
      .map((r) => (r.lastAccessed ? dayKey(new Date(r.lastAccessed)) : null))
      .filter(Boolean) as string[]
  );
  let streak = 0;
  const cursor = startOfDay(new Date());
  while (days.has(cursor.toISOString())) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function computeWeeklyFlames(recent: RecentTopic[]) {
  const days = new Set(
    recent
      .map((r) => (r.lastAccessed ? dayKey(new Date(r.lastAccessed)) : null))
      .filter(Boolean) as string[]
  );
  const today = new Date();
  const weekStart = startOfDay(new Date(today));
  weekStart.setDate(today.getDate() - today.getDay());
  return Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return {
      label: DAY_LABELS[i],
      lit: days.has(d.toISOString()),
      isToday: d.getTime() === startOfDay(today).getTime(),
    };
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
  const { user } = useUser();
  const { data: summary, isLoading } = useGetDashboardSummary();
  const { data: allTopics } = useGetTopics();
  const { data: leaderboard } = useGetLeaderboard();
  const { data: progress } = useGetUserProgress();

  const isOverLimit =
    summary &&
    summary.usageCount >= summary.freeLimit &&
    summary.subscriptionStatus === "free";

  const firstName =
    user?.firstName ||
    user?.username ||
    user?.emailAddresses?.[0]?.emailAddress?.split("@")[0] ||
    "there";

  const recent = (summary?.recentTopics ?? []) as RecentTopic[];
  const weak = (summary?.weakAreas ?? []) as RecentTopic[];

  const streak = useMemo(() => computeStreak(recent), [recent]);
  const weeklyFlames = useMemo(() => computeWeeklyFlames(recent), [recent]);
  const activitySeries = useMemo(() => buildActivitySeries(recent), [recent]);

  const todaysTopics = useMemo(() => {
    const today = startOfDay(new Date()).toISOString();
    const ids = new Set(
      recent
        .filter(
          (r) =>
            r.lastAccessed && dayKey(new Date(r.lastAccessed)) === today
        )
        .map((r) => r.topicId)
    );
    return ids.size;
  }, [recent]);

  const dailyGoal = 3;
  const continueTopic = recent[0];
  const recommended = useMemo(() => {
    const seen = new Set<number>();
    const out: RecentTopic[] = [];
    const push = (t: RecentTopic) => {
      if (out.length >= 4 || seen.has(t.topicId)) return;
      seen.add(t.topicId);
      out.push(t);
    };
    weak.forEach(push);
    recent.filter((r) => r.score < 80).forEach(push);
    (allTopics ?? []).forEach((t) => {
      push({ id: t.id, topicId: t.id, topicName: t.name, score: 0, lastAccessed: null });
    });
    recent.forEach(push);
    return out;
  }, [weak, recent, allTopics]);

  const masteryByCategory = useMemo(() => {
    const scoreByTopic = new Map<number, number>();
    (progress ?? []).forEach((p) => {
      const cur = scoreByTopic.get(p.topicId);
      if (cur === undefined || p.score > cur) scoreByTopic.set(p.topicId, p.score);
    });
    const groups = new Map<string, Array<{ id: number; name: string; score: number | null }>>();
    (allTopics ?? []).forEach((t) => {
      const cat = t.category ?? "Other";
      const score = scoreByTopic.has(t.id) ? scoreByTopic.get(t.id)! : null;
      if (!groups.has(cat)) groups.set(cat, []);
      groups.get(cat)!.push({ id: t.id, name: t.name, score });
    });
    return Array.from(groups.entries()).map(([category, items]) => ({
      category,
      items: items.sort((a, b) => a.name.localeCompare(b.name)),
    }));
  }, [allTopics, progress]);

  const masteryStats = useMemo(() => {
    const all = masteryByCategory.flatMap((g) => g.items);
    const studied = all.filter((t) => t.score !== null);
    const strong = studied.filter((t) => (t.score ?? 0) >= 85).length;
    return { total: all.length, studied: studied.length, strong };
  }, [masteryByCategory]);

  const totalTopics = (allTopics ?? []).length;
  const usageCount = summary?.usageCount ?? 0;
  const freeLimit = summary?.freeLimit ?? 10;
  const isPaid = summary?.subscriptionStatus && summary.subscriptionStatus !== "free";

  return (
    <div
      className="min-h-full bg-gradient-to-br from-sky-50/60 via-background to-rose-50/40 dark:from-slate-950 dark:via-background dark:to-slate-950"
      data-testid="dashboard-page"
    >
      <div className="max-w-[1400px] mx-auto p-4 md:p-6 lg:p-8">
        {/* Top header */}
        <header className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Hello, {firstName} <span aria-hidden>👋</span>
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Let's keep learning and growing your mind.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              className="relative w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors"
              data-testid="dashboard-notifications"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-foreground" />
            </button>
            <UserButton />
          </div>
        </header>

        {isOverLimit && (
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-amber-900 dark:text-amber-300 text-sm">
                Free limit reached
              </p>
              <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">
                You've used all 10 free interactions. Upgrade to continue
                studying.
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

        {/* Two-column: main + spotlight rail */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6">
          <div className="min-w-0 space-y-6">
            {/* Stats: 4 pastel cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading ? (
                Array(4)
                  .fill(0)
                  .map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)
              ) : (
                <>
                  <StatCard
                    icon={BookOpen}
                    iconBg="bg-sky-100 dark:bg-sky-500/15"
                    iconColor="text-sky-600 dark:text-sky-400"
                    cardBg="from-sky-50 to-sky-100/40 dark:from-sky-950/30 dark:to-sky-900/10 border-sky-100 dark:border-sky-900/40"
                    value={totalTopics}
                    label="Topics Available"
                    caption="Browse the library"
                  />
                  <StatCard
                    icon={Brain}
                    iconBg="bg-rose-100 dark:bg-rose-500/15"
                    iconColor="text-rose-600 dark:text-rose-400"
                    cardBg="from-rose-50 to-rose-100/40 dark:from-rose-950/30 dark:to-rose-900/10 border-rose-100 dark:border-rose-900/40"
                    value={summary?.topicsStudied ?? 0}
                    label="Topics Studied"
                    caption={
                      (summary?.topicsStudied ?? 0) === 0
                        ? "Pick one to begin"
                        : "Keep going!"
                    }
                  />
                  <StatCard
                    icon={Trophy}
                    iconBg="bg-amber-100 dark:bg-amber-500/15"
                    iconColor="text-amber-600 dark:text-amber-400"
                    cardBg="from-amber-50 to-amber-100/40 dark:from-amber-950/30 dark:to-amber-900/10 border-amber-100 dark:border-amber-900/40"
                    value={`${summary?.averageScore ?? 0}%`}
                    label="Average Score"
                    caption="Across all topics"
                  />
                  <StatCard
                    icon={Zap}
                    iconBg="bg-indigo-100 dark:bg-indigo-500/15"
                    iconColor="text-indigo-600 dark:text-indigo-400"
                    cardBg="from-indigo-50 to-indigo-100/40 dark:from-indigo-950/30 dark:to-indigo-900/10 border-indigo-100 dark:border-indigo-900/40"
                    value={isPaid ? "Pro" : `${usageCount}/${freeLimit}`}
                    label="Interactions"
                    caption={isPaid ? "Unlimited access" : "Start a session!"}
                  />
                </>
              )}
            </div>

            {/* Hero: Continue + Daily Goal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-foreground">Continue Your Journey</h2>
                </div>
                {isLoading ? (
                  <Skeleton className="h-24 rounded-lg" />
                ) : continueTopic ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-medium text-foreground truncate">
                        {continueTopic.topicName}
                      </p>
                      <span className="text-sm text-muted-foreground">
                        {continueTopic.score}%
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden mb-4">
                      <div
                        className="h-full bg-primary transition-all"
                        style={{ width: `${continueTopic.score}%` }}
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
                  <div className="text-center py-4">
                    <p className="text-sm text-muted-foreground mb-3">
                      No active topic yet. Browse the library to begin.
                    </p>
                    <Button onClick={() => navigate("/topics")} data-testid="button-browse-empty">
                      Browse Categories
                    </Button>
                  </div>
                )}
              </div>

              <DailyGoalCard completed={todaysTopics} goal={dailyGoal} />
            </div>

            {/* Recommended for You */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-foreground">Recommended for You</h2>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Based on your goals and progress
                </p>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <Skeleton className="h-14 rounded-lg" />
                  <Skeleton className="h-14 rounded-lg" />
                </div>
              ) : recommended.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {recommended.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => navigate(`/topics/${t.topicId}`)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left border border-border"
                      data-testid={`recommended-${t.topicId}`}
                    >
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {t.topicName}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Study a few topics and we'll suggest what to tackle next.
                </p>
              )}
            </div>

            {/* Streak + Recent Activity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-card border border-border rounded-xl p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <h2 className="font-semibold text-foreground">Your Streak</h2>
                </div>
                <div className="flex flex-col items-center text-center mb-4">
                  <span className="text-4xl font-bold text-foreground leading-none">{streak}</span>
                  <span className="text-sm text-muted-foreground mt-1">day streak</span>
                </div>
                <div className="grid grid-cols-7 gap-1 mb-3">
                  {weeklyFlames.map((d, i) => (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <Flame
                        className={cn(
                          "w-5 h-5 transition-colors",
                          d.lit ? "text-orange-500 fill-orange-500" : "text-muted-foreground/30"
                        )}
                      />
                      <span
                        className={cn(
                          "text-xs",
                          d.isToday ? "text-foreground font-semibold" : "text-muted-foreground"
                        )}
                      >
                        {d.label}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  {streak === 0
                    ? "Study today to start a streak."
                    : streak < 3
                    ? "You're building momentum."
                    : "Great consistency this week."}
                </p>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h2 className="font-semibold text-foreground mb-4">Recent Activity</h2>
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-12 rounded-lg" />
                    <Skeleton className="h-12 rounded-lg" />
                    <Skeleton className="h-12 rounded-lg" />
                  </div>
                ) : recent.length > 0 ? (
                  <div className="space-y-3">
                    {recent.slice(0, 3).map((t) => (
                      <button
                        key={t.id}
                        onClick={() => navigate(`/topics/${t.topicId}`)}
                        className="w-full flex items-center gap-3 hover:bg-muted -mx-2 px-2 py-1.5 rounded-lg transition-colors text-left"
                        data-testid={`recent-${t.topicId}`}
                      >
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Brain className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {t.topicName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t.score >= 80 ? "Strong performance" : t.score > 0 ? `Score ${t.score}%` : "Started"}
                          </p>
                        </div>
                      </button>
                    ))}
                    <button
                      onClick={() => navigate("/progress")}
                      className="w-full text-xs text-primary hover:underline pt-2"
                      data-testid="button-view-all-activity"
                    >
                      View all activity →
                    </button>
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-6">
                    Your study history will appear here.
                  </p>
                )}
              </div>
            </div>

            {/* Mastery Map (full-width) */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    <MapIcon className="w-4 h-4 text-primary" />
                    <h2 className="font-semibold text-foreground">Mastery Map</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {masteryStats.studied}/{masteryStats.total} topics started · {masteryStats.strong} strong
                  </p>
                </div>
                <MasteryLegend />
              </div>

              {masteryByCategory.length === 0 ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-2">
                    {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="w-40 h-20 rounded-lg shrink-0" />)}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {masteryByCategory.map((group) => (
                    <div key={group.category}>
                      <div className="flex items-baseline justify-between mb-2">
                        <p className="text-xs uppercase tracking-wide text-muted-foreground">
                          {group.category}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {group.items.filter((t) => t.score !== null).length}/{group.items.length}
                        </p>
                      </div>
                      <div className="relative">
                        <div
                          className="-mx-1 px-1 overflow-x-auto pb-2 [scrollbar-width:thin]"
                          data-testid={`mastery-strip-${group.category.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <div className="flex gap-2 min-w-max">
                            {group.items.map((t) => (
                              <MasteryTile
                                key={t.id}
                                name={t.name}
                                score={t.score}
                                onClick={() => navigate(`/topics/${t.id}`)}
                              />
                            ))}
                          </div>
                        </div>
                        <div className="pointer-events-none absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-card to-transparent" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Spotlight rail */}
          <aside className="lg:sticky lg:top-6 self-start space-y-4">
            <SpotlightCard onCta={() => navigate("/feature-request")} />

            <div className="bg-card border border-border rounded-xl p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" />
                  <h2 className="font-semibold text-foreground">Leaderboard</h2>
                </div>
                <span className="text-xs text-muted-foreground">Top 5</span>
              </div>
              {!leaderboard ? (
                <div className="space-y-2">
                  <Skeleton className="h-8 rounded-lg" />
                  <Skeleton className="h-8 rounded-lg" />
                  <Skeleton className="h-8 rounded-lg" />
                </div>
              ) : leaderboard.entries.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">
                  Be the first to land on the board.
                </p>
              ) : (
                <div className="space-y-1 flex-1">
                  {leaderboard.entries.slice(0, 5).map((e) => (
                    <div
                      key={e.userId}
                      className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-lg",
                        e.isCurrentUser ? "bg-primary/5" : ""
                      )}
                      data-testid={`rail-leaderboard-row-${e.rank}`}
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
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {e.rank}
                      </div>
                      <p className="text-sm font-medium text-foreground truncate flex-1 min-w-0">
                        {e.displayName}
                        {e.isCurrentUser && (
                          <span className="ml-1.5 text-xs text-primary font-semibold">
                            You
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-1 flex-shrink-0" title="Topics completed">
                        <BookOpen className="w-3 h-3 text-muted-foreground" />
                        <span className="text-xs font-semibold text-foreground tabular-nums">
                          {e.topicsCompleted}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0" title="Streak">
                        <Flame
                          className={cn(
                            "w-3 h-3",
                            e.streak > 0
                              ? "text-orange-500 fill-orange-500"
                              : "text-muted-foreground/40"
                          )}
                        />
                        <span className="text-xs font-semibold text-foreground tabular-nums">
                          {e.streak}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  cardBg,
  value,
  label,
  caption,
}: {
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  cardBg?: string;
  value: string | number;
  label: string;
  caption?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl p-4 flex items-center gap-3 border bg-gradient-to-br shadow-sm",
        cardBg ?? "from-card to-card border-border",
      )}
      data-testid={`stat-${label.replace(/\s/g, "-").toLowerCase()}`}
    >
      <div className={cn("w-12 h-12 shrink-0 rounded-xl flex items-center justify-center", iconBg)}>
        <Icon className={cn("w-6 h-6", iconColor)} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-2xl font-bold text-foreground leading-none">{value}</div>
        <div className="text-xs font-medium text-foreground/80 mt-1.5 truncate">{label}</div>
        {caption && (
          <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{caption}</div>
        )}
      </div>
    </div>
  );
}

function DailyGoalCard({ completed, goal }: { completed: number; goal: number }) {
  const pct = Math.min((completed / goal) * 100, 100);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="bg-card border border-border rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Target className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-foreground">Daily Goal</h2>
      </div>
      <div className="flex flex-col items-center">
        <div className="relative w-28 h-28">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="hsl(var(--muted))"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="hsl(var(--primary))"
              strokeWidth="8"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-500"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-xl font-bold text-foreground">
              {completed}/{goal}
            </span>
            <span className="text-[10px] text-muted-foreground">topics</span>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
          <Flame className="w-3 h-3 text-orange-500" />
          {completed >= goal ? "Goal reached" : "Keep it up"}
        </p>
      </div>
    </div>
  );
}

function masteryColors(score: number | null) {
  if (score === null) {
    return "bg-muted/60 text-muted-foreground hover:bg-muted border-transparent";
  }
  if (score >= 85) {
    return "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-950/50 dark:text-green-300 dark:hover:bg-green-950/70 border-transparent";
  }
  if (score >= 70) {
    return "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-950/70 border-transparent";
  }
  if (score >= 50) {
    return "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-950/70 border-transparent";
  }
  return "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-950/50 dark:text-red-300 dark:hover:bg-red-950/70 border-transparent";
}

function topicInitials(name: string) {
  const cleaned = name.replace(/[^A-Za-z0-9 ]/g, "").trim();
  const words = cleaned.split(/\s+/).filter(Boolean);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return "?";
}

function MasteryTile({
  name,
  score,
  onClick,
}: {
  name: string;
  score: number | null;
  onClick: () => void;
}) {
  const label = score === null ? `${name} — Not started` : `${name} — ${score}%`;
  const badge = score === null ? "New" : `${score}%`;
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      data-testid={`mastery-tile-${name.replace(/\s+/g, "-").toLowerCase()}`}
      className={cn(
        "shrink-0 w-40 h-20 rounded-lg border flex flex-col justify-between p-2.5 text-left transition-colors",
        masteryColors(score)
      )}
    >
      <span className="text-[12px] font-medium leading-tight line-clamp-2">{name}</span>
      <span className="text-[11px] font-semibold opacity-80">{badge}</span>
    </button>
  );
}

function MasteryLegend() {
  const items: Array<{ label: string; cls: string }> = [
    { label: "New", cls: "bg-muted/60" },
    { label: "<50", cls: "bg-red-200 dark:bg-red-950/70" },
    { label: "50-69", cls: "bg-amber-200 dark:bg-amber-950/70" },
    { label: "70-84", cls: "bg-blue-200 dark:bg-blue-950/70" },
    { label: "85+", cls: "bg-green-200 dark:bg-green-950/70" },
  ];
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {items.map((it) => (
        <div key={it.label} className="flex items-center gap-1">
          <span className={cn("w-3 h-3 rounded", it.cls)} aria-hidden />
          <span className="text-[11px] text-muted-foreground">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

function SpotlightCard({ onCta }: { onCta: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 text-white bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950">
      {/* Starry shimmer */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 18% 22%, rgba(255,255,255,.7), transparent 60%), radial-gradient(1.2px 1.2px at 65% 14%, rgba(255,255,255,.6), transparent 60%), radial-gradient(1px 1px at 82% 38%, rgba(255,255,255,.55), transparent 60%), radial-gradient(1.4px 1.4px at 32% 62%, rgba(255,255,255,.45), transparent 60%), radial-gradient(1px 1px at 75% 78%, rgba(255,255,255,.5), transparent 60%), radial-gradient(1px 1px at 12% 86%, rgba(255,255,255,.4), transparent 60%)",
        }}
      />
      {/* Soft accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(56,189,248,.45), transparent)" }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -left-10 w-44 h-44 rounded-full blur-3xl"
        style={{ background: "radial-gradient(closest-side, rgba(168,85,247,.35), transparent)" }}
      />

      <div className="relative">
        <div className="flex items-center justify-center mb-2">
          <Star className="w-5 h-5 text-amber-300 fill-amber-300/40" />
        </div>
        <h3 className="text-lg font-bold text-center">PsychPro Spotlight</h3>
        <p className="text-sm text-slate-300 text-center mt-1 mb-6">
          Highlighting the next generation of clinicians and researchers.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-4 backdrop-blur-sm">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-sky-400 via-indigo-500 to-purple-600 flex items-center justify-center mb-3 shadow-lg shadow-indigo-500/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-semibold">A space for your work</p>
            <p className="text-xs text-slate-300 mt-1">
              Dissertations, research, and clinical milestones from the PsychPro
              community will be featured here.
            </p>
          </div>
        </div>

        <Button
          onClick={onCta}
          className="w-full bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white border-0 shadow-md shadow-indigo-500/30"
          data-testid="button-spotlight-cta"
        >
          Submit your work
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
