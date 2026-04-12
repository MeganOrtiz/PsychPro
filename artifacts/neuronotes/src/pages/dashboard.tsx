import { useLocation } from "wouter";
import { BookOpen, Brain, Trophy, Zap, ChevronRight, TrendingUp } from "lucide-react";
import { useGetDashboardSummary, useGetUserProfile } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@clerk/react";

export default function DashboardPage() {
  const [, navigate] = useLocation();
  const { user } = useUser();
  const { data: summary, isLoading } = useGetDashboardSummary();
  const { data: profile } = useGetUserProfile();

  const isOverLimit = summary && summary.usageCount >= summary.freeLimit && summary.subscriptionStatus === "free";
  const usagePercent = summary ? Math.min((summary.usageCount / summary.freeLimit) * 100, 100) : 0;

  const firstName = user?.firstName || profile?.role || "Student";

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto" data-testid="dashboard-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Hello, {firstName} 👋</h1>
        <p className="text-muted-foreground text-sm mt-1">Ready to study neuroscience today?</p>
      </div>

      {isOverLimit && (
        <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-amber-900 dark:text-amber-300 text-sm">Free limit reached</p>
            <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">You've used all 10 free interactions. Upgrade to continue studying.</p>
          </div>
          <Button size="sm" onClick={() => navigate("/subscription")} data-testid="button-upgrade-banner">
            Upgrade
          </Button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-xl" />
          ))
        ) : (
          <>
            <StatCard label="Topics Available" value={summary?.totalTopics ?? 0} icon={BookOpen} color="text-blue-500" />
            <StatCard label="Topics Studied" value={summary?.topicsStudied ?? 0} icon={Brain} color="text-primary" />
            <StatCard label="Avg Score" value={`${summary?.averageScore ?? 0}%`} icon={Trophy} color="text-amber-500" />
            <StatCard label="Interactions" value={`${summary?.usageCount ?? 0}/${summary?.freeLimit ?? 10}`} icon={Zap} color="text-purple-500" />
          </>
        )}
      </div>

      {!isLoading && summary && (
        <div className="bg-card border border-border rounded-xl p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Free Usage</span>
            <span className="text-xs text-muted-foreground">{summary.usageCount}/{summary.freeLimit}</span>
          </div>
          <Progress value={usagePercent} className="h-2" />
          {summary.subscriptionStatus !== "active" && (
            <button
              onClick={() => navigate("/subscription")}
              className="text-xs text-primary hover:underline mt-2 block"
            >
              Upgrade for unlimited access →
            </button>
          )}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground">Quick Start</h2>
          </div>
          <div className="space-y-2">
            <ActionButton
              icon={BookOpen}
              label="Browse All Topics"
              onClick={() => navigate("/topics")}
              testId="button-browse-topics"
            />
            <ActionButton
              icon={Trophy}
              label="View My Progress"
              onClick={() => navigate("/progress")}
              testId="button-view-progress"
            />
          </div>
        </div>

        {isLoading ? (
          <Skeleton className="h-48 rounded-xl" />
        ) : (summary?.recentTopics?.length ?? 0) > 0 ? (
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Recent Activity</h2>
            </div>
            <div className="space-y-3">
              {summary!.recentTopics.slice(0, 4).map((t) => (
                <div
                  key={t.id}
                  className="flex items-center justify-between cursor-pointer hover:text-primary transition-colors"
                  onClick={() => navigate(`/topics/${t.topicId}`)}
                  data-testid={`recent-topic-${t.topicId}`}
                >
                  <span className="text-sm text-foreground">{t.topicName}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{t.score}%</span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-xl p-5 flex flex-col items-center justify-center text-center">
            <Brain className="w-8 h-8 text-muted-foreground mb-2" />
            <p className="text-sm font-medium text-foreground">No activity yet</p>
            <p className="text-xs text-muted-foreground mt-1">Start studying to see your progress here</p>
            <Button size="sm" className="mt-3" onClick={() => navigate("/topics")} data-testid="button-start-studying">
              Start Studying
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4" data-testid={`stat-${label.replace(/\s/g, "-").toLowerCase()}`}>
      <Icon className={`w-5 h-5 ${color} mb-2`} />
      <div className="text-xl font-bold text-foreground">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
    </div>
  );
}

function ActionButton({ icon: Icon, label, onClick, testId }: { icon: any; label: string; onClick: () => void; testId?: string }) {
  return (
    <button
      onClick={onClick}
      data-testid={testId}
      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
    >
      <Icon className="w-5 h-5 text-primary flex-shrink-0" />
      <span className="text-sm font-medium text-foreground">{label}</span>
      <ChevronRight className="w-4 h-4 text-muted-foreground ml-auto" />
    </button>
  );
}
