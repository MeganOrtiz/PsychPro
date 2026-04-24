import { TrendingUp, BookOpen, Target, Clock } from "lucide-react";

export function WeeklySummary() {
  const stats = [
    { icon: BookOpen, label: "Topics", value: "12", tone: "text-blue-600" },
    { icon: Target, label: "Avg Score", value: "84%", tone: "text-emerald-600" },
    { icon: Clock, label: "Time", value: "3.2h", tone: "text-purple-600" },
  ];

  const bars = [40, 65, 30, 80, 55, 90, 70];
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-xl p-5 w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-foreground">This Week</h2>
          <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18%</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {stats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="bg-muted/40 rounded-lg p-2.5">
                <Icon className={"w-3.5 h-3.5 mb-1.5 " + s.tone} />
                <p className="text-base font-bold text-foreground tabular-nums leading-tight">
                  {s.value}
                </p>
                <p className="text-[10px] text-muted-foreground font-medium">
                  {s.label}
                </p>
              </div>
            );
          })}
        </div>

        <div className="flex items-end justify-between h-12 gap-1.5">
          {bars.map((h, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full bg-primary/70 rounded-sm"
                style={{ height: `${h}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-1">
          {days.map((d, i) => (
            <span
              key={i}
              className="flex-1 text-center text-[10px] text-muted-foreground font-medium"
            >
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
