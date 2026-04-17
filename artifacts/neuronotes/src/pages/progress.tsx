import { useLocation } from "wouter";
import { Brain, ChevronRight, TrendingUp, AlertCircle, CheckCircle2, Circle } from "lucide-react";
import { useGetUserProgress, useGetTopics } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressPage() {
  const [, navigate] = useLocation();
  const { data: progress, isLoading: progressLoading } = useGetUserProgress();
  const { data: topics, isLoading: topicsLoading } = useGetTopics();

  const isLoading = progressLoading || topicsLoading;

  const progressMap = new Map((progress ?? []).map(p => [p.topicId, p]));

  const topicsWithProgress = (topics ?? []).map(t => ({
    ...t,
    progress: progressMap.get(t.id) ?? null,
  }));

  const studied = topicsWithProgress.filter(t => t.progress !== null);
  const notStarted = topicsWithProgress.filter(t => t.progress === null);
  const avgScore = studied.length > 0
    ? Math.round(studied.reduce((sum, t) => sum + (t.progress?.score ?? 0), 0) / studied.length)
    : 0;
  const strong = studied.filter(t => (t.progress?.score ?? 0) >= 80).sort((a, b) => (b.progress?.score ?? 0) - (a.progress?.score ?? 0));
  const weak = studied.filter(t => (t.progress?.score ?? 0) < 70).sort((a, b) => (a.progress?.score ?? 0) - (b.progress?.score ?? 0));

  const categories = Array.from(new Set((topics ?? []).map(t => t.category))).filter(Boolean);

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-3 gap-4">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto" data-testid="progress-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">My Progress</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {studied.length} of {topicsWithProgress.length} topics studied
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-foreground">{studied.length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Topics Studied</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className={`text-2xl font-bold ${
            avgScore >= 80 ? "text-green-600 dark:text-green-400"
            : avgScore >= 60 ? "text-amber-600 dark:text-amber-400"
            : avgScore > 0 ? "text-red-600 dark:text-red-400"
            : "text-muted-foreground"
          }`}>
            {studied.length > 0 ? `${avgScore}%` : "—"}
          </div>
          <div className="text-xs text-muted-foreground mt-0.5">Average Score</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-muted-foreground">{notStarted.length}</div>
          <div className="text-xs text-muted-foreground mt-0.5">Not Started</div>
        </div>
      </div>

      {/* Highlights row */}
      {(weak.length > 0 || strong.length > 0) && (
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {weak.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <h2 className="font-semibold text-amber-900 dark:text-amber-300 text-sm">Needs Work</h2>
              </div>
              <div className="space-y-2">
                {weak.slice(0, 3).map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(`/topics/${t.id}`)}
                  >
                    <span className="text-sm text-amber-800 dark:text-amber-300 truncate mr-2">{t.name}</span>
                    <ScoreBadge score={t.progress?.score ?? 0} />
                  </div>
                ))}
              </div>
            </div>
          )}
          {strong.length > 0 && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                <h2 className="font-semibold text-green-900 dark:text-green-300 text-sm">Strong Areas</h2>
              </div>
              <div className="space-y-2">
                {strong.slice(0, 3).map(t => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => navigate(`/topics/${t.id}`)}
                  >
                    <span className="text-sm text-green-800 dark:text-green-300 truncate mr-2">{t.name}</span>
                    <ScoreBadge score={t.progress?.score ?? 0} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Topics by Category */}
      <div className="space-y-4">
        {categories.map(category => {
          const catTopics = topicsWithProgress.filter(t => t.category === category);
          const catStudied = catTopics.filter(t => t.progress).length;
          return (
            <div key={category} className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-border bg-muted/30 flex items-center justify-between">
                <h2 className="font-semibold text-sm text-foreground">{category}</h2>
                <span className="text-xs text-muted-foreground">{catStudied}/{catTopics.length} studied</span>
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
                        (t.progress.score ?? 0) >= 80 ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (t.progress.score ?? 0) >= 60 ? (
                          <TrendingUp className="w-4 h-4 text-amber-500 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )
                      ) : (
                        <Circle className="w-4 h-4 text-muted-foreground/40 flex-shrink-0" />
                      )}
                      <span className={`text-sm truncate ${t.progress ? "text-foreground" : "text-muted-foreground"}`}>
                        {t.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                      {t.progress ? (
                        <>
                          <ScoreBadge score={t.progress.score ?? 0} />
                          <span className="text-xs text-muted-foreground hidden sm:block">
                            {new Date(t.progress.lastAccessed).toLocaleDateString()}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">Not started</span>
                      )}
                      <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state */}
      {studied.length === 0 && (
        <div className="text-center py-12 mt-6 bg-card border border-border rounded-xl">
          <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-medium text-foreground">No scores yet</p>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Complete a quiz or exam to start tracking your progress</p>
          <button
            onClick={() => navigate("/topics")}
            className="text-primary text-sm font-medium hover:underline"
            data-testid="link-browse-topics"
          >
            Browse topics →
          </button>
        </div>
      )}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80
    ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
    : score >= 60
    ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"
    : "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400";
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${color}`}>
      {score}%
    </span>
  );
}
