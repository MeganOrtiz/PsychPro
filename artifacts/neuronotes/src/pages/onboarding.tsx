import { useState } from "react";
import { useLocation } from "wouter";
import { Brain, ChevronRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUpsertUserProfile } from "@workspace/api-client-react";
import { useUser } from "@clerk/react";
import { useToast } from "@/hooks/use-toast";

const steps = [
  {
    id: "role",
    title: "What best describes you?",
    options: [
      "Undergraduate student",
      "Graduate/PhD student",
      "Medical student",
      "Resident/Fellow",
      "Licensed clinician",
      "Researcher",
      "Other",
    ],
  },
  {
    id: "goal",
    title: "What is your primary goal?",
    options: [
      "Pass board exams",
      "Ace course exams",
      "Deepen clinical knowledge",
      "Research preparation",
      "General learning",
    ],
  },
  {
    id: "degree",
    title: "What degree are you working toward?",
    options: [
      "BSc / BA",
      "MSc / MA",
      "PhD / PsyD",
      "MD / DO",
      "Already licensed",
      "Not applicable",
    ],
  },
  {
    id: "referralSource",
    title: "How did you hear about us?",
    options: [
      "Professor or instructor",
      "Fellow student",
      "Social media",
      "Google search",
      "Other",
    ],
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [, navigate] = useLocation();
  const { user } = useUser();
  const { toast } = useToast();
  const upsertProfile = useUpsertUserProfile();

  const step = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleSelect = (option: string) => {
    setSelections(prev => ({ ...prev, [step.id]: option }));
  };

  const handleNext = async () => {
    if (!selections[step.id]) return;

    if (isLastStep) {
      try {
        await upsertProfile.mutateAsync({
          data: {
            email: user?.emailAddresses[0]?.emailAddress,
            role: selections["role"],
            goal: selections["goal"],
            degree: selections["degree"],
            referralSource: selections["referralSource"],
            onboardingComplete: true,
          },
        });
        navigate("/dashboard");
      } catch {
        toast({ title: "Error", description: "Could not save profile. Please try again.", variant: "destructive" });
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleSkip = async () => {
    try {
      await upsertProfile.mutateAsync({
        data: {
          email: user?.emailAddresses[0]?.emailAddress,
          onboardingComplete: true,
        },
      });
    } catch {
      // silent
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4" data-testid="onboarding-page">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Brain className="w-7 h-7 text-primary" />
          <span className="font-bold text-xl text-foreground">PsychPro</span>
        </div>

        <div className="flex gap-1.5 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-1.5 rounded-full transition-colors ${i <= currentStep ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>

        <div className="bg-card rounded-2xl border border-border shadow-sm p-6 md:p-8">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Step {currentStep + 1} of {steps.length}
          </p>
          <h1 className="text-xl md:text-2xl font-bold text-foreground mb-6">{step.title}</h1>

          <div className="space-y-3 mb-8">
            {step.options.map((option) => {
              const selected = selections[step.id] === option;
              return (
                <button
                  key={option}
                  onClick={() => handleSelect(option)}
                  data-testid={`option-${option.replace(/\s+/g, "-").toLowerCase()}`}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all flex items-center justify-between ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/50"
                  }`}
                >
                  {option}
                  {selected && <Check className="w-4 h-4 text-primary flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={handleSkip}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip setup
            </button>
            <Button
              onClick={handleNext}
              disabled={!selections[step.id] || upsertProfile.isPending}
              data-testid="button-next"
            >
              {isLastStep ? "Get Started" : "Next"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
