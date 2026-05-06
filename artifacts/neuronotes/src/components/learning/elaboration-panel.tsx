import { useEffect, useState } from "react";
import { Lightbulb, Shuffle, Save, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const DEFAULT_PROMPTS = [
  "Why does this make sense clinically?",
  "How would you explain this to a patient's parent?",
  "What case or client does this remind you of?",
  "How does this connect to what you studied yesterday?",
  "Where could this concept be misapplied — and what would the consequence be?",
  "What's the simplest analogy that captures the mechanism?",
];

export interface ElaborationPanelProps {
  storageKey: string;
  prompts?: string[];
  context?: string;
}

export default function ElaborationPanel({ storageKey, prompts = DEFAULT_PROMPTS, context }: ElaborationPanelProps) {
  const [promptIndex, setPromptIndex] = useState(0);
  const [promptKey, setPromptKey] = useState(0);
  const initial = typeof window !== "undefined"
    ? window.localStorage.getItem(`elaboration:${storageKey}`) ?? ""
    : "";
  const [note, setNote] = useState(initial);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(`elaboration:${storageKey}`, note);
  }, [storageKey, note]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 1600);
    return () => clearTimeout(t);
  }, [saved]);

  function nextPrompt() {
    setPromptIndex((i) => (i + 1) % prompts.length);
    setPromptKey((k) => k + 1);
  }

  return (
    <aside
      className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm"
      data-testid="elaboration-panel"
    >
      <header className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground">Elaboration</h3>
          <p className="text-xs text-muted-foreground italic">
            Deep processing = stronger, more accessible memory.
          </p>
        </div>
      </header>

      {context && (
        <div className="mb-4 text-xs text-muted-foreground border-l-4 border-border pl-3 py-1">
          {context}
        </div>
      )}

      <div className="border-l-4 border-primary/40 pl-4 mb-4 min-h-[3rem]">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1">
          Prompt
        </div>
        <p
          key={promptKey}
          className="text-base font-medium text-foreground leading-snug animate-fade-in"
          data-testid="elaboration-prompt"
        >
          {prompts[promptIndex]}
        </p>
      </div>

      <Textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Jot a quick elaboration — even one sentence helps consolidate it."
        rows={4}
        className="bg-background border-input text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40 mb-3 resize-y"
        data-testid="elaboration-note"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={nextPrompt}
          data-testid="elaboration-new-prompt"
        >
          <Shuffle className="w-3.5 h-3.5 mr-1.5" />
          New Prompt
        </Button>
        <Button
          size="sm"
          onClick={() => setSaved(true)}
          data-testid="elaboration-save"
        >
          {saved ? (
            <>
              <Check className="w-3.5 h-3.5 mr-1.5" /> Saved
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5 mr-1.5" /> Save note
            </>
          )}
        </Button>
        <span className="text-[11px] text-muted-foreground ml-auto">
          {note.trim().length > 0 ? `${note.trim().length} chars · saved locally` : "Notes save to this device"}
        </span>
      </div>
    </aside>
  );
}
