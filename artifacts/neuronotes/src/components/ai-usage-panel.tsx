import { Sparkles, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { StudyAiUsage } from "@workspace/api-client-react";
import { formatTrialDate } from "@/lib/use-study-access";

/** Pre-submission AI allowance readout for the upload/generate form. */
export function AiUsagePanel({
  selectedUnits,
  selectedLabels,
  hasAccess,
  expired,
  loading,
  usage,
  onRenew,
}: {
  selectedUnits: number;
  selectedLabels: string[];
  hasAccess: boolean;
  expired: boolean;
  loading: boolean;
  usage: StudyAiUsage | undefined;
  onRenew: () => void;
}) {
  if (loading) return <Skeleton className="h-20 rounded-xl" />;

  if (!hasAccess) {
    return (
      <div className="rounded-xl border border-border p-4 text-sm flex flex-col sm:flex-row sm:items-center gap-3" data-testid="panel-ai-usage">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
        <p className="flex-1 text-foreground/80">
          {expired
            ? "Your PsychPro free week has ended. Your existing decks and sources are saved; new generation resumes when you subscribe."
            : "New AI generation needs PsychPro or an active free week."}
        </p>
        <Button type="button" size="sm" onClick={onRenew} data-testid="button-ai-renew">
          {expired ? "Subscribe" : "See plans"}
        </Button>
      </div>
    );
  }

  const unlimited = !usage || usage.unlimited;
  const remaining = usage?.remaining ?? 0;
  const over = !unlimited && remaining < selectedUnits;
  const pct = !unlimited && usage?.limit ? Math.min(100, (usage.used / usage.limit) * 100) : 0;

  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2" data-testid="panel-ai-usage">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="flex items-center gap-1.5 font-medium text-foreground">
          <Sparkles className="w-4 h-4 text-primary" /> AI generation requests
        </span>
        <span className="text-foreground" data-testid="text-ai-remaining">
          {unlimited ? "Unlimited on your plan" : `${remaining} of ${usage?.limit} left`}
        </span>
      </div>
      {!unlimited && (
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <div className="h-full bg-primary origin-left" style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
      )}
      <p className="text-xs text-muted-foreground" data-testid="text-ai-selected-units">
        This request uses <strong className="text-foreground">{selectedUnits}</strong> {selectedUnits === 1 ? "unit" : "units"}
        {selectedLabels.length > 0 && ` (${selectedLabels.join(", ")})`}. Each selected output tool counts as one.
        {!unlimited && usage?.resetsAt && ` Allowance resets ${formatTrialDate(usage.resetsAt)}.`}
      </p>
      {over && (
        <p className="text-xs font-medium text-destructive" data-testid="text-ai-over-limit">
          Not enough requests left for this selection. Your saved decks stay available.
        </p>
      )}
    </div>
  );
}
