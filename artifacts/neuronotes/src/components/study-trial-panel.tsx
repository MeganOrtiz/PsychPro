import { useLocation } from "wouter";
import { CalendarClock, Loader2, Sparkles, GraduationCap, ShieldCheck, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PP, alpha } from "@/lib/palette";
import { trackEvent } from "@/lib/analytics";
import {
  useStudyAccess,
  useStartTrial,
  trialPhase,
  formatTrialDate,
  apiErrorMessage,
  PSYCHPRO_TRIAL_AI_LIMIT,
  type TrialSuite,
} from "@/lib/use-study-access";

const SUITE_LABEL: Record<TrialSuite, string> = {
  psychpro: "PsychPro",
  eppp: "EPPP Mastery Suite",
};

/**
 * Explicit, one-time 7-day trial control for a single suite. Starting only
 * ever happens from the button here; no card, no auto-charge.
 */
export function StudyTrialPanel({
  suite,
  highlight,
  onSubscribe,
}: {
  suite: TrialSuite;
  highlight?: boolean;
  onSubscribe?: () => void;
}) {
  const [, navigate] = useLocation();
  const { data, isLoading, isError, refetch } = useStudyAccess();
  const start = useStartTrial();
  const s = data?.[suite];
  const phase = trialPhase(s);
  const ai = data?.aiUsage;
  const Icon = suite === "eppp" ? GraduationCap : Sparkles;
  const tint = suite === "eppp" ? alpha(PP.amberSoft, 0.18) : alpha(PP.promoTealHi, 0.12);

  if (isLoading) return <Skeleton className="h-28 rounded-xl" />;
  if (isError)
    return (
      <div className="rounded-xl p-4 text-sm flex items-center justify-between gap-3 mat-glass">
        <span>Couldn't load your trial status.</span>
        <Button size="sm" variant="outline" onClick={() => refetch()} data-testid={`button-retry-access-${suite}`}>Retry</Button>
      </div>
    );
  if (phase === "paid" || phase === "none") return null;

  function begin() {
    start.mutate(
      { suite },
      {
        onSuccess: (res) => {
          trackEvent("trial_started", { suite });
          toast.success(`Your ${SUITE_LABEL[suite]} week is on. It ends ${formatTrialDate(res[suite].expiresAt)}.`);
          if (suite === "eppp") navigate("/eppp/suite");
        },
        onError: (err) => {
          if ((err as { status?: number })?.status === 409) {
            toast("This trial was already started or your plan is already paid. Status refreshed.");
          } else {
            toast.error(apiErrorMessage(err, "Couldn't start your trial. Please try again."));
          }
        },
      },
    );
  }

  return (
    <div
      className="rounded-xl p-4 mat-glass"
      style={{ background: tint, outline: highlight ? `2px solid ${alpha(PP.text, 0.14)}` : undefined, color: PP.text }}
      data-testid={`trial-panel-${suite}`}
    >
      <div className="flex items-start gap-3">
        <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0 space-y-1.5">
          {phase === "available" && (
            <>
              <p className="font-semibold">Try {SUITE_LABEL[suite]} free for 7 days</p>
              <p className="text-sm text-muted-foreground">
                The week starts only when you press the button. No card required and nothing is charged
                when it ends. One trial per suite.
                {suite === "psychpro" && ` Includes ${PSYCHPRO_TRIAL_AI_LIMIT} AI generation requests total.`}
              </p>
              <Button className="mt-2" onClick={begin} disabled={start.isPending} data-testid={`button-start-trial-${suite}`}>
                {start.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ShieldCheck className="w-4 h-4 mr-2" />}
                Start my free week
              </Button>
            </>
          )}
          {phase === "active" && (
            <>
              <p className="font-semibold">Your {SUITE_LABEL[suite]} trial is active</p>
              <p className="text-sm flex items-center gap-1.5" data-testid={`text-trial-ends-${suite}`}>
                <CalendarClock className="w-4 h-4" /> Ends {formatTrialDate(s?.expiresAt)}
              </p>
              {suite === "psychpro" && ai && !ai.unlimited && (
                <p className="text-sm" data-testid="text-trial-ai-remaining">
                  AI generation requests left: <strong>{ai.remaining ?? 0}</strong> of {ai.limit ?? PSYCHPRO_TRIAL_AI_LIMIT}
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                When it ends, your progress and materials are kept. Subscribe any time to keep studying.
              </p>
            </>
          )}
          {phase === "expired" && (
            <>
              <p className="font-semibold">Your {SUITE_LABEL[suite]} trial ended {formatTrialDate(s?.expiresAt)}</p>
              <p className="text-sm text-muted-foreground">
                Nothing was deleted. Your progress{suite === "psychpro" ? ", decks, and uploaded sources are" : " is"} saved
                and will be waiting when you subscribe.
              </p>
              {onSubscribe && (
                <Button className="mt-2" onClick={onSubscribe} data-testid={`button-trial-subscribe-${suite}`}>
                  Subscribe to continue <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
