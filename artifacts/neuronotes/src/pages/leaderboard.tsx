import { Trophy, Flame, BookOpen, Medal } from "lucide-react";
import { useGetLeaderboard } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function rankBadge(rank: number) {
  if (rank === 1) return { color: "text-yellow-500", bg: "bg-yellow-500/10" };
  if (rank === 2) return { color: "text-slate-400", bg: "bg-slate-400/10" };
  if (rank === 3) return { color: "text-amber-700", bg: "bg-amber-700/10" };
  return { color: "text-muted-foreground", bg: "bg-muted" };
}

export default function LeaderboardPage() {
  const { data, isLoading } = useGetLeaderboard();
  const entries = data?.entries ?? [];
  const currentUser = data?.currentUser ?? null;

  return (
    <div className="min-h-full bg-background" data-testid="leaderboard-page">
      <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Leaderboard
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Top scholars by topics completed and study streak.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-4 py-3 border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-7 md:col-span-6">Scholar</div>
            <div className="col-span-2 md:col-span-3 text-center md:text-right">
              <span className="hidden md:inline">Topics Completed</span>
              <span className="md:hidden">Topics</span>
            </div>
            <div className="col-span-2 text-center md:text-right">Streak</div>
          </div>

          {isLoading ? (
            <div className="divide-y divide-border">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="px-4 py-4">
                  <Skeleton className="h-6" />
                </div>
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="px-4 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No one's on the board yet. Complete a topic to claim the top spot.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {entries.map((e) => {
                const badge = rankBadge(e.rank);
                return (
                  <div
                    key={e.rank}
                    className={cn(
                      "grid grid-cols-12 gap-2 items-center px-4 py-3 transition-colors",
                      e.isCurrentUser
                        ? "bg-primary/5"
                        : "hover:bg-muted/40"
                    )}
                    data-testid={`leaderboard-row-${e.rank}`}
                  >
                    <div className="col-span-1 flex justify-center">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold",
                          badge.bg,
                          badge.color
                        )}
                      >
                        {e.rank <= 3 ? <Medal className="w-4 h-4" /> : e.rank}
                      </div>
                    </div>
                    <div className="col-span-7 md:col-span-6 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {e.displayName}
                        {e.isCurrentUser && (
                          <span className="ml-2 text-xs text-primary font-semibold">
                            You
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="col-span-2 md:col-span-3 flex items-center justify-center md:justify-end gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-muted-foreground hidden md:inline" />
                      <span className="text-sm font-semibold text-foreground tabular-nums">
                        {e.topicsCompleted}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-center md:justify-end gap-1.5">
                      <Flame
                        className={cn(
                          "w-3.5 h-3.5",
                          e.streak > 0
                            ? "text-orange-500 fill-orange-500"
                            : "text-muted-foreground/40"
                        )}
                      />
                      <span className="text-sm font-semibold text-foreground tabular-nums">
                        {e.streak}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {currentUser && (
          <div className="mt-4 bg-card border border-border rounded-xl px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Your Rank
            </p>
            <div className="grid grid-cols-12 gap-2 items-center">
              <div className="col-span-1 flex justify-center">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                  {currentUser.rank}
                </div>
              </div>
              <div className="col-span-7 md:col-span-6 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {currentUser.displayName}
                  <span className="ml-2 text-xs text-primary font-semibold">
                    You
                  </span>
                </p>
              </div>
              <div className="col-span-2 md:col-span-3 flex items-center justify-center md:justify-end gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-muted-foreground hidden md:inline" />
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {currentUser.topicsCompleted}
                </span>
              </div>
              <div className="col-span-2 flex items-center justify-center md:justify-end gap-1.5">
                <Flame
                  className={cn(
                    "w-3.5 h-3.5",
                    currentUser.streak > 0
                      ? "text-orange-500 fill-orange-500"
                      : "text-muted-foreground/40"
                  )}
                />
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {currentUser.streak}
                </span>
              </div>
            </div>
          </div>
        )}

        {data && (
          <p className="text-xs text-muted-foreground text-center mt-4">
            {data.totalParticipants}{" "}
            {data.totalParticipants === 1 ? "scholar" : "scholars"} on the board
          </p>
        )}
      </div>
    </div>
  );
}
