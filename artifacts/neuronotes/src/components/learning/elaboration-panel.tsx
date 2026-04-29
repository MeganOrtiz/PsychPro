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
      className="rounded-2xl border border-yellow-200 dark:border-yellow-900/40 bg-gradient-to-br from-yellow-50/80 to-amber-50/40 dark:from-yellow-950/20 dark:to-amber-950/10 p-5 md:p-6 shadow-sm"
      data-testid="elaboration-panel"
    >
      <header className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-yellow-400/25 flex items-center justify-center shrink-0">
          <Lightbulb className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground">Elaboration</h3>
          <p className="text-xs text-muted-foreground italic">
            Deep processing = stronger, more accessible memory.
          </p>
        </div>
      </header>

      {context && (
        <div className="mb-4 text-xs text-muted-foreground border-l-4 border-yellow-300 dark:border-yellow-700 pl-3 py-1">
          {context}
        </div>
      )}

      <div className="border-l-4 border-yellow-400 dark:border-yellow-600 pl-4 mb-4 min-h-[3rem]">
        <div className="text-[10px] uppercase tracking-wider text-yellow-700/80 dark:text-yellow-400/80 font-semibold mb-1">
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
        className="bg-background/80 border-yellow-200 dark:border-yellow-900/40 focus-visible:ring-yellow-400/40 mb-3 resize-y"
        data-testid="elaboration-note"
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={nextPrompt}
          className="border-yellow-300 text-yellow-800 hover:bg-yellow-100 dark:border-yellow-800 dark:text-yellow-300 dark:hover:bg-yellow-900/30"
          data-testid="elaboration-new-prompt"
        >
          <Shuffle className="w-3.5 h-3.5 mr-1.5" />
          New Prompt
        </Button>
        <Button
          size="sm"
          onClick={() => setSaved(true)}
          className="bg-yellow-500 hover:bg-yellow-600 text-white"
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
