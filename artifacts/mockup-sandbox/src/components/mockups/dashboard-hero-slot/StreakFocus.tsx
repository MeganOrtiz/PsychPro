import { Flame } from "lucide-react";

export function StreakFocus() {
  const days = ["M", "T", "W", "T", "F", "S", "S"];
  const completed = [true, true, true, true, false, false, false];
  const streak = 4;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-xl p-5 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">Study Streak</h2>
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
        </div>

        <div className="flex items-end gap-3 mb-5">
          <span className="text-5xl font-bold text-foreground tabular-nums leading-none">
            {streak}
          </span>
          <span className="text-sm text-muted-foreground pb-1.5">
            day streak
          </span>
        </div>

        <div className="flex items-center justify-between">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5">
              <div
                className={
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold " +
                  (completed[i]
                    ? "bg-orange-500/15 text-orange-600"
                    : "bg-muted text-muted-foreground/60")
                }
              >
                {completed[i] ? <Flame className="w-3.5 h-3.5 fill-orange-500" /> : ""}
              </div>
              <span className="text-[10px] text-muted-foreground font-medium">
                {d}
              </span>
            </div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Study today to keep it alive
        </p>
      </div>
    </div>
  );
}
