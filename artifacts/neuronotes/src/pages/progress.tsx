import { useLocation } from "wouter";
import { Trophy, TrendingUp, Target, ChevronRight } from "lucide-react";
import { useGetUserProgress, useGetDashboardSummary } from "@workspace/api-client-react";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProgressPage() {
  const [, navigate] = useLocation();
  const { data: progress, isLoading } = useGetUserProgress();
  const { data: summary } = useGetDashboardSummary();

  const sorted = [...(progress ?? [])].sort((a, b) => b.score - a.score);
  const weakAreas = [...(progress ?? [])].sort((a, b) => a.score - b.score).slice(0, 5);

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto" data-testid="progress-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Progress</h1>
        <p className="text-muted-foreground text-sm mt-1">Track your performance across topics</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <Trophy className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-foreground">{summary?.averageScore ?? 0}%</div>
          <div className="text-xs text-muted-foreground">Avg Score</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <TrendingUp className="w-5 h-5 text-primary mx-auto mb-1" />
          <div className="text-xl font-bold text-foreground">{summary?.topicsStudied ?? 0}</div>
          <div className="text-xs text-muted-foreground">Topics Studied</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 text-center">
          <Target className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <div className="text-xl font-bold text-foreground">{summary?.totalTopics ?? 0}</div>
          <div className="text-xs text-muted-foreground">Total Topics</div>
        </div>
      </div>

      {(progress?.length ?? 0) > 0 && (
        <div className="bg-card border border-border rounded-xl p-5 mb-6">
          <h2 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-red-500" /> Areas to Improve
          </h2>
          <div className="space-y-2">
            {weakAreas.map(item => (
              <div key={item.id} className="text-sm text-muted-foreground flex items-center justify-between gap-2">
                <span>{item.topicName}</span>
                <span className="font-medium text-foreground">{item.score}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <h2 className="font-semibold text-foreground mb-3">All Topics</h2>
      {isLoading ? (
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : (progress?.length ?? 0) === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl" data-testid="no-progress">
          <Trophy className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground font-medium">No progress recorded yet</p>
          <p className="text-sm text-muted-foreground mt-1">Complete quizzes and exams to track your progress</p>
          <button
            onClick={() => navigate("/topics")}
            className="mt-4 text-primary text-sm hover:underline"
            data-testid="link-browse-topics"
          >
            Browse topics →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {sorted.map(item => (
            <div
              key={item.id}
              className="bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/40 transition-colors"
              onClick={() => navigate(`/topics/${item.topicId}`)}
              data-testid={`progress-topic-${item.topicId}`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground text-sm">{item.topicName}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-foreground">{item.score}%</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </div>
              <Progress value={item.score} className="h-1.5" />
              <p className="text-xs text-muted-foreground mt-1">
                Last studied: {new Date(item.lastAccessed).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
