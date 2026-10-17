import { Link } from "wouter";
import { Brain, Crown, ArrowRight } from "lucide-react";
import type { StudyAccess } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { formatTrialDate, trialPhase } from "@/lib/use-study-access";
import { suiteOnboardingPath } from "@/lib/suite-entry";
import "./suite-chooser.css";

export function SuiteChooser({ access }: { access: StudyAccess }) {
  return (
    <main className="study-page-bg min-h-screen px-6 py-16" data-testid="suite-chooser">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-semibold text-center">Choose your suite</h1>
        <p className="text-center text-foreground">Each suite has its own access and free week.</p>
        <div className="grid gap-6 md:grid-cols-2">
          {(["psychpro", "eppp"] as const).map(suite => {
            const status = access[suite];
            const phase = trialPhase(status);
            const Icon = suite === "psychpro" ? Brain : Crown;
            const title = suite === "psychpro" ? "PsychPro" : "EPPP Mastery Suite";
            const href = status.hasAccess
              ? suite === "psychpro" ? "/dashboard" : "/eppp/suite"
              : status.canStart ? suiteOnboardingPath(suite) : "/subscription";
            return (
              <section key={suite} className="mat-glass rounded-2xl p-8 flex flex-col gap-5" data-testid={`suite-choice-${suite}`}>
                <Icon className="w-10 h-10 mx-auto" aria-hidden />
                <h2 className="text-2xl text-center font-semibold">{title}</h2>
                <p className="text-foreground text-center">
                  {phase === "paid" ? "Your paid access is active."
                    : phase === "active" ? `Your free week ends ${formatTrialDate(status.expiresAt)}.`
                    : phase === "available" ? "Your separate 7-day free trial is available. Complete onboarding to begin."
                    : "Your free week has ended. Your progress and saved materials are kept."}
                </p>
                <Button asChild className={`mt-auto suite-choice-button suite-choice-button--${suite}`}>
                  <Link href={href} data-testid={`button-enter-${suite}`}>
                    {status.hasAccess ? `Enter ${title}` : status.canStart ? "Start my free week" : "See plans"}
                    <ArrowRight className="w-4 h-4" aria-hidden />
                  </Link>
                </Button>
              </section>
            );
          })}
        </div>
        <div className="text-center"><Link href="/my-library">My Library</Link></div>
      </div>
    </main>
  );
}
