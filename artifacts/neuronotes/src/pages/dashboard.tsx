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
  Award,
  Target,
  TrendingUp,
  Sparkles,
  ArrowUpRight,
} from "lucide-react";
import { useGetDashboardSummary } from "@workspace/api-client-react";
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
  const recommended = (weak.length > 0 ? weak : recent).slice(0, 2);

  const hasFirstTopic = (summary?.topicsStudied ?? 0) >= 1;
  const hasStreak = streak >= 3;
  const hasHighScore = recent.some((r) => r.score >= 80);
  const unlockedCount = [hasFirstTopic, hasStreak, hasHighScore].filter(Boolean).length;

  return (
    <div className="min-h-full bg-background" data-testid="dashboard-page">
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
            {/* Stats: 2 centered cards */}
            <div className="grid grid-cols-2 gap-4">
              {isLoading ? (
                Array(2)
                  .fill(0)
                  .map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)
              ) : (
                <>
                  <StatCard
                    icon={Brain}
                    iconBg="bg-violet-100 dark:bg-violet-950/40"
                    iconColor="text-violet-600 dark:text-violet-400"
                    value={summary?.topicsStudied ?? 0}
                    label="Topics Studied"
                  />
                  <StatCard
                    icon={Trophy}
                    iconBg="bg-amber-100 dark:bg-amber-950/40"
                    iconColor="text-amber-600 dark:text-amber-400"
                    value={`${summary?.averageScore ?? 0}%`}
                    label="Average Score"
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
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-4 h-4 text-primary" />
                <h2 className="font-semibold text-foreground">Recommended for You</h2>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Based on your goals and progress
              </p>
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
                        <p className="text-xs text-muted-foreground truncate">
                          {t.score < 70 ? "Strengthen your foundation" : "Expand your knowledge"}
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

            {/* Achievements (full-width horizontal) */}
            <div className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-foreground">Achievements</h2>
                <span className="text-xs text-muted-foreground">{unlockedCount}/3 unlocked</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <AchievementCard
                  icon={Star}
                  title="First Steps"
                  sub="Complete your first topic"
                  unlocked={hasFirstTopic}
                />
                <AchievementCard
                  icon={Flame}
                  title="Streak Starter"
                  sub="Study 3 days in a row"
                  unlocked={hasStreak}
                />
                <AchievementCard
                  icon={Award}
                  title="Score Master"
                  sub="Get 80% or higher"
                  unlocked={hasHighScore}
                />
              </div>
            </div>
          </div>

          {/* Spotlight rail */}
          <aside className="lg:sticky lg:top-6 self-start">
            <SpotlightCard onCta={() => navigate("/feature-request")} />
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
  value,
  label,
}: {
  icon: ComponentType<{ className?: string }>;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
}) {
  return (
    <div
      className="bg-card border border-border rounded-xl p-5 flex flex-col items-center text-center"
      data-testid={`stat-${label.replace(/\s/g, "-").toLowerCase()}`}
    >
      <div className={cn("w-11 h-11 rounded-full flex items-center justify-center mb-3", iconBg)}>
        <Icon className={cn("w-5 h-5", iconColor)} />
      </div>
      <div className="text-3xl font-bold text-foreground leading-none">{value}</div>
      <div className="text-sm text-muted-foreground mt-2">{label}</div>
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

function AchievementCard({
  icon: Icon,
  title,
  sub,
  unlocked,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  sub: string;
  unlocked: boolean;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center text-center p-4 rounded-lg border",
        unlocked
          ? "bg-primary/5 border-primary/20"
          : "bg-muted/30 border-border opacity-70"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-full flex items-center justify-center mb-2",
          unlocked ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="w-5 h-5" />
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
    </div>
  );
}

function SpotlightCard({ onCta }: { onCta: () => void }) {
  return (
    <div className="bg-gradient-to-b from-slate-800 to-slate-900 dark:from-slate-900 dark:to-slate-950 text-white rounded-2xl p-6 overflow-hidden relative">
      <div className="absolute top-0 right-0 w-40 h-40 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative">
        <div className="flex items-center justify-center mb-2">
          <Star className="w-5 h-5 text-amber-300" />
        </div>
        <h3 className="text-lg font-bold text-center">PsychPro Spotlight</h3>
        <p className="text-sm text-slate-300 text-center mt-1 mb-6">
          Highlighting the next generation of clinicians and researchers.
        </p>

        <div className="bg-white/5 border border-white/10 rounded-xl p-5 mb-4">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary to-sky-700 flex items-center justify-center mb-3">
              <Sparkles className="w-8 h-8 text-white/80" />
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
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          data-testid="button-spotlight-cta"
        >
          Submit your work
          <ArrowUpRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
