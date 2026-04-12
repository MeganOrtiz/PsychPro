import { useLocation } from "wouter";
import { Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UpgradePromptProps {
  onDismiss?: () => void;
}

export default function UpgradePrompt({ onDismiss }: UpgradePromptProps) {
  const [, navigate] = useLocation();

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center" data-testid="upgrade-prompt">
      <div className="w-16 h-16 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-amber-600 dark:text-amber-400" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-3">Free Limit Reached</h2>
      <p className="text-muted-foreground mb-8 leading-relaxed">
        You've used all 10 free interactions. Upgrade to NeuroNotes Pro for unlimited flashcards, quizzes, and exams.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
        <Button
          onClick={() => navigate("/subscription")}
          className="w-full"
          data-testid="button-upgrade"
        >
          <Zap className="w-4 h-4 mr-2" />
          Upgrade Now
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
