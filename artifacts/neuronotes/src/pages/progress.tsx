import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ChevronRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Circle,
  BarChart3,
} from "lucide-react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useGetUserProgress, useGetTopics } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { STUDY_PALETTE } from "@/lib/study-theme";
import { PageTitle } from "@/components/brand/page-title";
import { isEpppTopic } from "@/lib/eppp-content";

// B-9: shared score thresholds. Centralized so the strong/weak split, the
// per-topic icon color, and the score-badge color tier never disagree.
const STRONG_SCORE = 80;
const WEAK_SCORE = 70;
const P = STUDY_PALETTE;

type ProgressFilter = "all" | "studied" | "notStarted";

function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "";
  const diff = Date.now() - t;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export default function ProgressPage() {
  const [, navigate] = useLocation();
  const { data: progress, isLoading: progressLoading } = useGetUserProgress();
  const { data: topics, isLoading: topicsLoading } = useGetTopics();
  const [filter, setFilter] = useState<ProgressFilter>("all");

  const isLoading = progressLoading || topicsLoading;

  const mainTopics = useMemo(
    () => (topics ?? []).filter((topic) => !isEpppTopic(topic)),
    [topics],
  );
  const mainTopicIds = useMemo(
    () => new Set(mainTopics.map((topic) => topic.id)),
    [mainTopics],
  );
  const mainProgress = useMemo(
    () => (progress ?? []).filter((p) => mainTopicIds.has(p.topicId)),
    [progress, mainTopicIds],
  );

  const progressMap = new Map(mainProgress.map(p => [p.topicId, p]));

  const topicsWithProgress = mainTopics.map(t => ({
    ...t,
    progress: progressMap.get(t.id) ?? null,
  }));

  const studied = topicsWithProgress.filter(t => t.progress !== null);
  const notStarted = topicsWithProgress.filter(t => t.progress === null);
  const avgScore =
    studied.length > 0
      ? Math.round(
          studied.reduce((sum, t) => sum + (t.progress?.score ?? 0), 0) /
            studied.length,
        )
      : 0;
  // Canonical thresholds (B-9): strong >= STRONG_SCORE, weak < WEAK_SCORE.
  const strong = studied
    .filter(t => (t.progress?.score ?? 0) >= STRONG_SCORE)
    .sort((a, b) => (b.progress?.score ?? 0) - (a.progress?.score ?? 0));
  const weak = studied
    .filter(t => (t.progress?.score ?? 0) < WEAK_SCORE)
    .sort((a, b) => (a.progress?.score ?? 0) - (b.progress?.score ?? 0));

  const categories = Array.from(
    new Set(mainTopics.map(t => t.category)),
  ).filter(Boolean);

  // P-2: 14-day activity trend bucketed by day. Each bucket's avgScore is
  // the average score across topics whose lastAccessed falls in that day.
  const trendData = useMemo(() => {
    const days: { day: string; avgScore: number | null }[] = [];
    const now = new Date();
    const startOfDay = (d: Date) => {
      const x = new Date(d);
      x.setHours(0, 0, 0, 0);
      return x;
    };
    const todayStart = startOfDay(now).getTime();
    const buckets = new Map<number, number[]>();
    for (const p of mainProgress) {
      if (!p.lastAccessed) continue;
      const t = new Date(p.lastAccessed).getTime();
      const bucketStart = startOfDay(new Date(t)).getTime();
      const arr = buckets.get(bucketStart) ?? [];
      arr.push(p.score ?? 0);
      buckets.set(bucketStart, arr);
    }
    for (let i = 13; i >= 0; i--) {
      const dayStart = todayStart - i * 86400000;
      const label = new Date(dayStart).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      const scores = buckets.get(dayStart);
      const avg = scores && scores.length > 0
        ? Math.round(scores.reduce((s, n) => s + n, 0) / scores.length)
        : null;
      days.push({ day: label, avgScore: avg });
    }
    return days;
  }, [mainProgress]);

  const filteredCatTopics = (
    catTopics: typeof topicsWithProgress,
  ): typeof topicsWithProgress =>
    filter === "studied"
      ? catTopics.filter(t => t.progress)
      : filter === "notStarted"
      ? catTopics.filter(t => !t.progress)
      : catTopics;

  if (isLoading) {
    return (
      <div className="min-h-full study-page-bg">
        <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-4">
          <Skeleton className="h-10 w-48" />
          <div className="grid grid-cols-3 gap-4">
            {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  const isEmpty = studied.length === 0;

  const filterPills: { id: ProgressFilter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "studied", label: "Studied" },
    { id: "notStarted", label: "Not started" },
  ];

  return (
    <div className="min-h-full study-page-bg" data-testid="progress-page">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <PageTitle
        title="My Progress"
        icon={BarChart3}
        subtitle={`${studied.length} of ${topicsWithProgress.length} topics studied`}
      />

      {/* Empty state (X-4) */}
      {isEmpty && (
        <div className="bg-card border border-border rounded-xl p-8 text-center mb-6" data-testid="empty-state-progress">
          <BarChart3
            className="w-10 h-10 mx-auto mb-3"
            style={{ color: STUDY_PALETTE.inkSoft }}
          />
          <h2 className="text-lg font-semibold text-foreground mb-2">No progress yet</h2>
          <p className="text-sm text-white/70 mb-4 max-w-sm mx-auto">
            Start a topic and your scores, streaks, and strengths will track here.
          </p>
          <Button
            onClick={() => navigate("/topics")}
            data-testid="button-empty-progress-cta"
          >
            Browse Topics
          </Button>
        </div>
      )}

      {/* Summary Stats (hidden when empty) */}
      {!isEmpty && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-foreground">{studied.length}</div>
            <div className="text-xs text-white/70 mt-0.5">Topics Studied</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div
              className="text-2xl font-bold"
              style={{
                color:
                  avgScore >= STRONG_SCORE ? P.tealDeep
                  : avgScore >= WEAK_SCORE ? P.teal
                  : avgScore >= 50 ? P.surf
                  : P.inkSoft,
              }}
            >
              {`${avgScore}%`}
            </div>
            <div className="text-xs text-white/70 mt-0.5">Average Score</div>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white/70">{notStarted.length}</div>
            <div className="text-xs text-white/70 mt-0.5">Not Started</div>
          </div>
        </div>
      )}

      {/* P-2: Recent activity trend */}
      {!isEmpty && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6" data-testid="activity-trend-card">
          <h2 className="text-sm font-semibold text-foreground mb-2">
            Recent activity trend
          </h2>
          <div style={{ height: 140 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(94,176,200,0.15)" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11 }} domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="avgScore"
                  stroke={STUDY_PALETTE.teal}
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: STUDY_PALETTE.teal }}
                  connectNulls
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Highlights row — recolored from green/amber to the study palette */}
      {!isEmpty && (weak.length > 0 || strong.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {weak.length > 0 && (
            <div
              className="rounded-xl p-4 border"
              style={{ background: `${P.paperSoft}`, borderColor: `${P.surf}55` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4" style={{ color: P.tealDeep }} />
                <h2 className="font-semibold text-sm" style={{ color: P.ink }}>Needs Work</h2>
              </div>
              <div className="space-y-2">
                {weak.slice(0, 3).map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(`/topics/${t.id}`)}
                  >
                    <span className="text-sm truncate mr-2" style={{ color: P.ink }}>{t.name}</span>
                    <ScoreBadge score={t.progress?.score ?? 0} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {strong.length > 0 && (
            <div
              className="rounded-xl p-4 border"
              style={{
                background: `linear-gradient(135deg, ${P.surface}, ${P.bg})`,
                borderColor: `${P.surf}66`,
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4" style={{ color: P.surf }} />
                <h2 className="font-semibold text-sm text-white">Strong Areas</h2>
              </div>
              <div className="space-y-2">
                {strong.slice(0, 3).map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(`/topics/${t.id}`)}
                  >
                    <span className="text-sm truncate mr-2 text-white/90">{t.name}</span>
                    <ScoreBadge score={t.progress?.score ?? 0} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* P-3: Filter pills */}
      <div className="flex items-center gap-2 mb-4 flex-wrap" data-testid="progress-filter-pills">
        {filterPills.map(p => {
          const active = filter === p.id;
          return (
            <button
              key={p.id}
              onClick={() => setFilter(p.id)}
              data-testid={`filter-${p.id}`}
              className={`text-xs font-medium px-3 py-1.5 rounded-md border transition-colors ${
                active
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-white/70 border-border hover:text-foreground"
              }`}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* All Topics by Category */}
      <div className="space-y-4">
        {categories.map(category => {
          const catTopics = filteredCatTopics(
            topicsWithProgress.filter(t => t.category === category),
          );
          if (catTopics.length === 0) return null;
          const catStudied = catTopics.filter(t => t.progress).length;
          return (
            <div key={category} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <h2 className="font-semibold text-sm text-foreground">{category}</h2>
                <span className="text-xs text-white/70">{catStudied}/{catTopics.length} studied</span>
              </div>
              <div className="divide-y divide-border">
                {catTopics.map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => navigate(`/topics/${t.id}`)}
                    data-testid={`progress-topic-${t.id}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {t.progress ? (
                        (t.progress.score ?? 0) >= STRONG_SCORE ? (
                          <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: P.tealDeep }} />
                        ) : (t.progress.score ?? 0) >= WEAK_SCORE ? (
                          <TrendingUp className="w-4 h-4 flex-shrink-0" style={{ color: P.teal }} />
                        ) : (
                          <AlertCircle className="w-4 h-4 flex-shrink-0" style={{ color: P.surf }} />
                        )
                      ) : (
                        <Circle className="w-4 h-4 text-white/70/40 flex-shrink-0" />
                      )}
                      <span className={`text-sm truncate ${t.progress ? "text-foreground" : "text-white/70"}`}>
                        {t.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {t.progress ? (
                        <>
                          <ScoreBadge score={t.progress.score ?? 0} />
                          {t.progress.lastAccessed && (
                            <span className="text-[11px] text-white/70 hidden sm:inline">
                              {timeAgo(t.progress.lastAccessed)}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-white/70">Not started</span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  // Tiers match the icons / strong-vs-weak split on the rest of the page.
  const style: { background: string; color: string } =
    score >= STRONG_SCORE
      ? { background: "rgba(31,107,131,0.15)", color: P.tealDeep }
      : score >= WEAK_SCORE
      ? { background: "rgba(47,160,198,0.15)", color: P.teal }
      : { background: "rgba(94,176,200,0.18)", color: P.tealDeep };
  return (
    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={style}>
      {score}%
    </span>
  );
}
