import { useState } from "react";
import { Eye, RotateCcw, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface BrainDumpProps {
  topic: string;
  prompt: string;
  answer: string;
  storageKey?: string;
  /**
   * Optional callback fired when the user clicks "Next prompt" after
   * revealing the answer. When provided, a Next button is rendered
   * alongside "Try again" so the parent can swap in a fresh prompt.
   */
  onNext?: () => void;
}

export default function BrainDump({ topic, prompt, answer, storageKey, onNext }: BrainDumpProps) {
  const initial = storageKey && typeof window !== "undefined"
    ? window.localStorage.getItem(`braindump:${storageKey}`) ?? ""
    : "";
  const [text, setText] = useState(initial);
  const [revealed, setRevealed] = useState(false);
  const [attempted, setAttempted] = useState(false);

  function handleChange(value: string) {
    setText(value);
    if (storageKey && typeof window !== "undefined") {
      window.localStorage.setItem(`braindump:${storageKey}`, value);
    }
  }

  function handleReveal() {
    setAttempted(text.trim().length > 0);
    setRevealed(true);
  }

  function handleReset() {
    setRevealed(false);
    setAttempted(false);
    handleChange("");
  }

  return (
    <section
      className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm"
      data-testid="brain-dump"
    >
      {/* The page title above the box already says "Active Recall", so
          the box itself leads with the *topic* the prompt belongs to —
          that's the most useful piece of context for the user mid-recall. */}
      <header className="mb-4">
        <div className="text-[11px] uppercase tracking-[0.14em] text-primary/80 font-semibold mb-1">
          Topic
        </div>
        <h3
          className="text-xl md:text-2xl font-bold text-foreground leading-tight"
          data-testid="brain-dump-topic"
        >
          {topic}
        </h3>
      </header>
      <p className="text-base font-medium text-foreground mb-4 leading-relaxed">{prompt}</p>

      <Textarea
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Type everything you remember before peeking…"
        rows={5}
        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40 mb-3 resize-y"
        data-testid="brain-dump-textarea"
        disabled={revealed}
      />

      {!revealed ? (
        <div className="flex flex-wrap items-center gap-2">
          <Button
            onClick={handleReveal}
            className={cn(
              "relative overflow-hidden",
              text.trim().length > 0 && "animate-pulse-glow"
            )}
            data-testid="brain-dump-reveal"
          >
            <Eye className="w-4 h-4 mr-1.5" />
            Reveal Answer
          </Button>
          <span className="text-xs text-muted-foreground">
            {text.length === 0
              ? "Try writing first, even if you're not sure."
              : `${text.trim().split(/\s+/).filter(Boolean).length} words written`}
          </span>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in">
          {attempted && (
            <div className="flex items-center gap-2 text-xs text-primary font-medium">
              <Sparkles className="w-4 h-4" />
              Nice — attempting recall before checking is the high-value move.
            </div>
          )}
          <div className="rounded-xl bg-muted/60 border border-border p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
              Answer
            </div>
            <p
              className="text-sm text-foreground leading-relaxed whitespace-pre-line"
              data-testid="brain-dump-answer"
            >
              {answer}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {onNext && (
              <Button
                onClick={() => {
                  // Reset local state first so the next prompt renders
                  // with a clean textarea + collapsed answer.
                  handleReset();
                  onNext();
                }}
                data-testid="brain-dump-next"
              >
                Next prompt
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              data-testid="brain-dump-reset"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Try again
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
