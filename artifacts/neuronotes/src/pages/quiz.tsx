import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, CheckCircle, XCircle, ChevronRight } from "lucide-react";
import { useGetQuizzesByTopic, useIncrementUserUsage, useGetUserUsage } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import UpgradePrompt from "@/components/upgrade-prompt";

interface Props {
  params: { id: string };
}

export default function QuizPage({ params }: Props) {
  const [, navigate] = useLocation();
  const topicId = parseInt(params.id);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const { data: questions, isLoading } = useGetQuizzesByTopic(topicId);
  const { data: usage } = useGetUserUsage();
  const incrementUsage = useIncrementUserUsage();

  const current = questions?.[index];
  const total = questions?.length ?? 0;

  const options = current
    ? [
        { key: "A", text: current.optionA },
        { key: "B", text: current.optionB },
        { key: "C", text: current.optionC },
        { key: "D", text: current.optionD },
      ]
    : [];

  const handleSelect = async (key: string) => {
    if (selected) return;
    if (usage?.isOverLimit) {
      setShowUpgrade(true);
      return;
    }
    await incrementUsage.mutateAsync();
    setSelected(key);
    setShowExplanation(true);
    if (key === current?.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (index + 1 >= total) {
      setCompleted(true);
    } else {
      setSelected(null);
      setShowExplanation(false);
      setIndex(i => i + 1);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  if (showUpgrade) {
    return <UpgradePrompt onDismiss={() => setShowUpgrade(false)} />;
  }

  if (completed) {
    const percent = Math.round((score / total) * 100);
    return (
      <div className="p-4 md:p-6 max-w-lg mx-auto text-center" data-testid="quiz-complete">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${percent >= 70 ? "bg-green-100 dark:bg-green-900/30" : "bg-amber-100 dark:bg-amber-900/30"}`}>
          <span className="text-3xl font-bold text-foreground">{percent}%</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h2>
        <p className="text-muted-foreground mb-8">You scored {score} out of {total} questions.</p>
        <div className="flex gap-3 justify-center">
          <Button variant="outline" onClick={() => navigate(`/topics/${topicId}`)} data-testid="button-back-to-topic">
            Back to Topic
          </Button>
          <Button onClick={handleRestart} data-testid="button-retake">
            Retake Quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto" data-testid="quiz-page">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(`/topics/${topicId}`)} className="text-muted-foreground hover:text-foreground" data-testid="button-back">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Quiz</h1>
        </div>
        <span className="text-sm text-muted-foreground font-medium">{index + 1}/{total}</span>
      </div>

      <div className="w-full bg-muted rounded-full h-1.5 mb-6">
        <div
          className="bg-primary h-1.5 rounded-full transition-all"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-xl" />
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
      ) : !current ? (
        <div className="text-center py-16 text-muted-foreground">No questions for this topic.</div>
      ) : (
        <>
          <div className="bg-card border border-border rounded-xl p-5 mb-6" data-testid="quiz-question-card">
            <p className="text-foreground font-medium leading-relaxed" data-testid="text-question">
              {current.question}
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {options.map(({ key, text }) => {
              const isSelected = selected === key;
              const isCorrect = key === current.correctAnswer;
              let className = "w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all flex items-center gap-3";

              if (!selected) {
                className += " border-border bg-card hover:border-primary/40 hover:bg-muted/50 text-foreground";
              } else if (isCorrect) {
                className += " border-green-400 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-300";
              } else if (isSelected && !isCorrect) {
                className += " border-red-400 bg-red-50 dark:bg-red-950/30 text-red-800 dark:text-red-300";
              } else {
                className += " border-border bg-card text-muted-foreground opacity-70";
              }

              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  disabled={!!selected}
                  data-testid={`option-${key}`}
                  className={className}
                >
                  <span className={cn(
                    "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
                    !selected ? "bg-muted text-foreground" :
                    isCorrect ? "bg-green-500 text-white" :
                    isSelected ? "bg-red-500 text-white" :
                    "bg-muted text-muted-foreground"
                  )}>
                    {key}
                  </span>
                  <span className="flex-1">{text}</span>
                  {selected && isCorrect && <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />}
                  {selected && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6" data-testid="explanation-box">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1">Explanation</p>
              <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">{current.explanation}</p>
            </div>
          )}

          {selected && (
            <Button onClick={handleNext} className="w-full" data-testid="button-next">
              {index + 1 >= total ? "See Results" : "Next Question"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </>
      )}
    </div>
  );
}
