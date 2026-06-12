import { useLocation } from "wouter";
import { Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

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
    body: "Free accounts include one quiz. Upgrade to PsychPro Master for unlimited quizzes, exams, and study guides.",
  },
  exam: {
    title: "Practice exam limit reached",
    body: "Free accounts include one practice exam. Upgrade to PsychPro Master for unlimited practice exams across every topic.",
  },
  studyGuide: {
    title: "Study guides are a Master feature",
    body: "Upgrade to PsychPro Master to unlock comprehensive study guides for every topic.",
  },
  flashcards: {
    title: "See every flashcard",
    body: "Free accounts preview the first 10 cards per topic. Upgrade to PsychPro Master to study every card in the deck.",
  },
  eppp: {
    title: "Unlock the EPPP Mastery Suite",
    body: "The EPPP Mastery Suite is a separate access level from Master & Scholar. Get full access with a monthly subscription or a one-time 6- or 12-month pass.",
  },
  generic: {
    title: "Upgrade to keep going",
    body: "Upgrade to PsychPro Master for unlimited flashcards, quizzes, exams, and study guides.",
  },
};

export default function UpgradePrompt({ onDismiss, reason = "generic" }: UpgradePromptProps) {
  const [, navigate] = useLocation();
  const { title, body } = COPY[reason];

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center" data-testid="upgrade-prompt">
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: `rgba(94, 179, 200,0.18)`, border: `1px solid ${P.surf}55` }}
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
          {reason === "eppp" ? "Unlock Now" : "Upgrade Now"}
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
