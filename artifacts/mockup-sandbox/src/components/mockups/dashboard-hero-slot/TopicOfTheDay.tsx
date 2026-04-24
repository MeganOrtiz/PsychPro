import { Sparkles, ArrowRight, Clock } from "lucide-react";

export function TopicOfTheDay() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="bg-card border border-border rounded-xl p-5 w-full max-w-sm flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="font-semibold text-foreground">Topic of the Day</h2>
          </div>
          <span className="text-[10px] uppercase tracking-wide text-muted-foreground font-semibold">
            Pick
          </span>
        </div>

        <div className="flex-1 mb-4">
          <p className="text-[11px] uppercase tracking-wide text-primary font-semibold mb-1">
            Frontal Lobe Function
          </p>
          <h3 className="text-lg font-bold text-foreground leading-tight mb-2">
            Executive Control & Working Memory
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            How prefrontal circuits coordinate attention, planning, and goal-directed behavior.
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>~8 min read</span>
          </div>
          <button className="flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors">
            Start
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
