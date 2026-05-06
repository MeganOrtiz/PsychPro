import { useState } from "react";
import { Brain, Eye, RotateCcw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export interface BrainDumpProps {
  topic: string;
  prompt: string;
  answer: string;
  storageKey?: string;
}

export default function BrainDump({ topic, prompt, answer, storageKey }: BrainDumpProps) {
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
      <header className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Brain className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground">Active Recall</h3>
          <p className="text-xs text-muted-foreground italic">
            Retrieval strengthens memory pathways far more than re-exposure.
          </p>
        </div>
      </header>

      <div className="mb-2 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
        {topic}
      </div>
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
      )}
    </section>
  );
}
