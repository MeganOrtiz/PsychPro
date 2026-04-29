import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeft, CheckCircle, XCircle, ChevronRight, BookOpen, Lightbulb } from "lucide-react";
import { useGetQuizzesByTopic, useUpdateTopicProgress, useIncrementUserUsage, useRecordQuizAttempt } from "@workspace/api-client-react";
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
  const [reflection, setReflection] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const { data: questions, isLoading, error } = useGetQuizzesByTopic(topicId);
  const updateProgress = useUpdateTopicProgress();
  const incrementUsage = useIncrementUserUsage();
  const recordAttempt = useRecordQuizAttempt();

  const fetchError = error as { status?: number } | null;
  if (fetchError?.status === 402) {
    return <UpgradePrompt onDismiss={() => navigate(`/topics/${topicId}`)} />;
  }

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
    try {
      await incrementUsage.mutateAsync();
    } catch (err) {
      const e = err as { status?: number };
      if (e?.status === 402) {
        setShowUpgrade(true);
        return;
      }
    }
    setSelected(key);
    setShowExplanation(true);
    if (key === current?.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = async () => {
    if (completed) return;
    if (index + 1 >= total) {
      setCompleted(true);
      const percent = total > 0 ? Math.round((score / total) * 100) : 0;
      try {
        await updateProgress.mutateAsync({ topicId, data: { score: percent } });
      } catch {
        // non-blocking
      }
      if (total > 0) {
        try {
          await recordAttempt.mutateAsync({ data: { topicId, score, total } });
        } catch {
          // non-blocking
        }
      }
    } else {
      setSelected(null);
      setShowExplanation(false);
      setReflection("");
      setReflectionSaved(false);
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
      <div className="min-h-full bg-background" data-testid="quiz-complete">
        <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8 text-center">
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
      </div>
    );
  }

  return (
    <div className="min-h-full bg-background" data-testid="quiz-page">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(`/topics/${topicId}`)} className="text-muted-foreground hover:text-foreground" data-testid="button-back">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
          <BookOpen className="w-5 h-5 text-green-500" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Quiz</h1>
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
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4" data-testid="explanation-box">
              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider mb-1">Explanation</p>
              <p className="text-sm text-blue-900 dark:text-blue-200 leading-relaxed">{current.explanation}</p>
            </div>
          )}

          {showExplanation && selected && selected !== current.correctAnswer && (
            <div
              className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6"
              data-testid="reflect-prompt"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Reflect</p>
                <Link href="/study-lab">
                  <span className="ml-auto text-[11px] text-amber-700 dark:text-amber-400 hover:underline cursor-pointer">
                    Why this works →
                  </span>
                </Link>
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mb-2 leading-relaxed">
                Explain in one sentence why <span className="font-semibold">{current.correctAnswer}</span> was correct (and what tripped you up). Writing it out, even briefly, locks the correction into memory.
              </p>
              <textarea
                value={reflection}
                onChange={(e) => { setReflection(e.target.value); setReflectionSaved(false); }}
                placeholder="In your own words…"
                rows={2}
                className="w-full text-sm rounded-lg border border-amber-300/60 dark:border-amber-800/60 bg-white/60 dark:bg-background/40 px-3 py-2 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
                data-testid="textarea-reflection"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] text-muted-foreground">
                  Stays on this device — for your eyes only.
                </p>
                <button
                  type="button"
                  onClick={() => setReflectionSaved(true)}
                  disabled={reflection.trim().length === 0 || reflectionSaved}
                  className="text-xs font-medium px-2.5 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  data-testid="button-save-reflection"
                >
                  {reflectionSaved ? "Saved ✓" : "Lock it in"}
                </button>
              </div>
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
    </div>
  );
}
