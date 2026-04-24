import { useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, RotateCcw, Layers } from "lucide-react";
import { useGetFlashcardsByTopic, useIncrementUserUsage } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import UpgradePrompt from "@/components/upgrade-prompt";

interface Props {
  params: { id: string };
}

const difficultyColors: Record<string, string> = {
  easy: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
  hard: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400",
};

export default function FlashcardsPage({ params }: Props) {
  const [, navigate] = useLocation();
  const topicId = parseInt(params.id);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const { data: flashcards, isLoading, error } = useGetFlashcardsByTopic(topicId);
  const incrementUsage = useIncrementUserUsage();

  const current = flashcards?.[index];
  const total = flashcards?.length ?? 0;

  const fetchError = error as { status?: number } | null;
  if (fetchError?.status === 402) {
    return <UpgradePrompt onDismiss={() => navigate(`/topics/${topicId}`)} />;
  }

  const handleFlip = async () => {
    if (flipped) {
      setFlipped(false);
      return;
    }
    try {
      await incrementUsage.mutateAsync();
    } catch (err) {
      const e = err as { status?: number };
      if (e?.status === 402) {
        setShowUpgrade(true);
        return;
      }
    }
    setFlipped(true);
  };

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => setIndex(i => Math.min(i + 1, total - 1)), 150);
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(() => setIndex(i => Math.max(i - 1, 0)), 150);
  };

  const handleRestart = () => {
    setFlipped(false);
    setIndex(0);
  };

  if (showUpgrade) {
    return <UpgradePrompt onDismiss={() => setShowUpgrade(false)} />;
  }

  return (
    <div className="min-h-full bg-background" data-testid="flashcards-page">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(`/topics/${topicId}`)}
          className="text-muted-foreground hover:text-foreground"
          data-testid="button-back"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
          <Layers className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Flashcards</h1>
          {!isLoading && <p className="text-sm text-muted-foreground">{total} cards</p>}
        </div>
        <button onClick={handleRestart} className="ml-auto text-muted-foreground hover:text-foreground" data-testid="button-restart" aria-label="Restart">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {isLoading ? (
        <Skeleton className="h-72 rounded-2xl" />
      ) : total === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No flashcards for this topic.</div>
      ) : (
        <>
          <div className="text-center text-sm text-muted-foreground mb-4">
            {index + 1} / {total}
          </div>

          <div className="relative mb-4">
            <div className="w-full bg-muted rounded-full h-1.5 mb-6">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${((index + 1) / total) * 100}%` }}
              />
            </div>

            <div
              className="flashcard-container cursor-pointer select-none"
              onClick={handleFlip}
              data-testid="flashcard"
            >
              <div className={`flashcard-inner min-h-64 md:min-h-72 ${flipped ? "flipped" : ""}`}>
                <div className="flashcard-front bg-card border border-border rounded-2xl p-8 flex flex-col items-start min-h-64 md:min-h-72 shadow-sm">
                  {current && (
                    <Badge className={`mb-4 ${difficultyColors[current.difficulty] || ""}`}>
                      {current.difficulty}
                    </Badge>
                  )}
                  <div className="flex-1 flex items-center justify-center w-full">
                    <p className="text-center text-lg font-medium text-foreground leading-relaxed" data-testid="text-flashcard-question">
                      {current?.question}
                    </p>
                  </div>
                </div>
                <div className="flashcard-back bg-primary rounded-2xl p-8 flex flex-col items-center justify-center min-h-64 md:min-h-72 shadow-sm">
                  <div className="text-xs text-primary-foreground/70 uppercase tracking-wider mb-4">Answer</div>
                  <p className="text-center text-base text-primary-foreground leading-relaxed" data-testid="text-flashcard-answer">
                    {current?.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" onClick={handlePrev} disabled={index === 0} data-testid="button-prev">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button onClick={handleNext} disabled={index === total - 1} data-testid="button-next">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </>
      )}
      </div>
    </div>
  );
}
