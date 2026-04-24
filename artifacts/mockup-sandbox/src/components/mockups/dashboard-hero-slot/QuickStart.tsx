import { Layers, Brain, FileText, ArrowRight } from "lucide-react";

export function QuickStart() {
  const actions = [
    {
      icon: Layers,
      label: "Flashcards",
      sub: "Quick recall drill",
      tone: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: Brain,
      label: "Quiz",
      sub: "10 mixed questions",
      tone: "bg-purple-500/10 text-purple-600",
    },
    {
      icon: FileText,
      label: "Practice Exam",
      sub: "Timed full-length",
      tone: "bg-emerald-500/10 text-emerald-600",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-xl p-5 w-full max-w-sm">
        <h2 className="font-semibold text-foreground mb-3">Jump back in</h2>

        <div className="space-y-2">
          {actions.map((a) => {
            const Icon = a.icon;
            return (
              <button
                key={a.label}
                className="w-full flex items-center gap-3 p-2.5 rounded-lg border border-border hover:bg-accent/50 transition-colors text-left group"
              >
                <div
                  className={
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 " +
                    a.tone
                  }
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    {a.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {a.sub}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
