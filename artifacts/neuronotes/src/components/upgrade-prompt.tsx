import { useLocation } from "wouter";
import { Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { useStudyAccess, trialPhase } from "@/lib/use-study-access";

export type UpgradeReason =
  | "quiz"          // free user finished their 1 lifetime quiz
  | "exam"          // free user finished their 1 lifetime practice exam
  | "studyGuide"    // study guides are paid-only
  | "flashcards"    // (rarely surfaced — flashcards are capped, not blocked)
  | "eppp"          // EPPP Mastery Suite — a SEPARATE access level
  | "generic";      // fallback when the caller doesn't know

interface UpgradePromptProps {
  onDismiss?: () => void;
  reason?: UpgradeReason;
}

const COPY: Record<UpgradeReason, { title: string; body: string }> = {
  quiz: {
    title: "Quiz limit reached",
    body: "Subscribe to PsychPro, or start your free week, for unlimited quizzes, exams, and study guides.",
  },
  exam: {
    title: "Practice exam limit reached",
    body: "Subscribe to PsychPro, or start your free week, for unlimited practice exams across every topic.",
  },
  studyGuide: {
    title: "Study guides are included in PsychPro",
    body: "Subscribe to PsychPro, or start your free week, to unlock comprehensive study guides for every topic.",
  },
  flashcards: {
    title: "See every flashcard",
    body: "Subscribe to PsychPro, or start your free week, to study every card in the deck.",
  },
  eppp: {
    title: "Unlock the EPPP Mastery Suite",
    body: "The EPPP Mastery Suite is a separate access level from PsychPro, with its own free week. Get full access with a monthly subscription or a one-time 6- or 12-month pass.",
  },
  generic: {
    title: "Upgrade to keep going",
    body: "Subscribe to PsychPro, or start your free week, for unlimited flashcards, quizzes, exams, and study guides.",
  },
};

export default function UpgradePrompt({ onDismiss, reason = "generic" }: UpgradePromptProps) {
  const [, navigate] = useLocation();
  const { data: access } = useStudyAccess();
  const suite = reason === "eppp" ? "eppp" : "psychpro";
  const expired = trialPhase(access?.[suite]) === "expired";
  const title = expired ? `Your ${suite === "eppp" ? "EPPP Mastery Suite" : "PsychPro"} free week has ended` : COPY[reason].title;
  const body = expired
    ? "Your progress and saved materials are still here. Choose a paid plan to continue studying in this suite."
    : COPY[reason].body;

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center" data-testid="upgrade-prompt">
      <div
        className="mat-icon-well mat-icon-well--round w-16 h-16 flex items-center justify-center mb-6"
      >
        <Lock className="w-8 h-8" style={{ color: P.tealDeep }} />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">{title}</h2>
      <p className="text-muted-foreground mb-8 leading-relaxed">{body}</p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button
          onClick={() => navigate("/subscription")}
          className="w-full"
          data-testid="button-upgrade"
        >
          <Zap className="w-4 h-4 mr-2" />
          See plans
        </Button>
        {onDismiss && (
          <Button variant="outline" onClick={onDismiss} className="w-full" data-testid="button-dismiss">
            Go Back
          </Button>
        )}
      </div>
    </div>
  );
}
