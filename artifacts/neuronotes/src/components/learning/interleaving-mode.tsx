import { useMemo, useState } from "react";
import { Shuffle, Layers, ChevronLeft, ChevronRight, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

export interface InterleaveCard {
  topic: string;
  question: string;
  answer: string;
}

export interface InterleavingModeProps {
  cards: InterleaveCard[];
}

const TOPIC_PALETTE: Record<string, string> = {
  default0: "bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300",
  default1: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
  default2: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  default3: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300",
  default4: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
  default5: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/40 dark:text-cyan-300",
};

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export default function InterleavingMode({ cards }: InterleavingModeProps) {
  const [mode, setMode] = useState<"interleaved" | "blocked">("interleaved");
  const [seed, setSeed] = useState(() => Math.floor(Math.random() * 10000));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [shuffleAnimKey, setShuffleAnimKey] = useState(0);

  const topics = useMemo(() => Array.from(new Set(cards.map((c) => c.topic))), [cards]);
  const topicColor = useMemo(() => {
    const map: Record<string, string> = {};
    topics.forEach((t, i) => {
      map[t] = TOPIC_PALETTE[`default${i % 6}`];
    });
    return map;
  }, [topics]);

  const ordered = useMemo(() => {
    if (mode === "blocked") {
      const grouped: InterleaveCard[] = [];
      topics.forEach((t) => grouped.push(...cards.filter((c) => c.topic === t)));
      return grouped;
    }
    return seededShuffle(cards, seed);
  }, [cards, mode, seed, topics]);

  const total = ordered.length;
  const current = ordered[index];
  const finished = index >= total;

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    topics.forEach((t) => (c[t] = 0));
    ordered.slice(0, Math.min(index + 1, total)).forEach((card) => {
      c[card.topic] = (c[card.topic] ?? 0) + 1;
    });
    return c;
  }, [ordered, index, topics, total]);

  function toggleMode(checked: boolean) {
    setMode(checked ? "interleaved" : "blocked");
    setIndex(0);
    setRevealed(false);
    setShuffleAnimKey((k) => k + 1);
  }

  function next() {
    setRevealed(false);
    setIndex((i) => Math.min(i + 1, total));
  }

  function prev() {
    setRevealed(false);
    setIndex((i) => Math.max(i - 1, 0));
  }

  function restart() {
    setIndex(0);
    setRevealed(false);
    setSeed(Math.floor(Math.random() * 10000));
    setShuffleAnimKey((k) => k + 1);
  }

  const totalSeen = Math.min(index + (finished ? 0 : 1), total);

  return (
    <section
      className="rounded-2xl border border-border bg-card p-5 md:p-6 shadow-sm"
      data-testid="interleaving-mode"
    >
      <header className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-violet-500/15 flex items-center justify-center shrink-0">
          <Shuffle
            key={shuffleAnimKey}
            className={cn(
              "w-5 h-5 text-violet-600 dark:text-violet-400 transition-transform duration-500",
              "animate-spin-once"
            )}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground">Mixed Mode</h3>
          <p className="text-xs text-muted-foreground italic">
            Mixing topics forces your brain to discriminate — that's where durable learning comes from.
          </p>
        </div>
      </header>

      <div className="flex items-center justify-between gap-4 mb-4 p-3 rounded-lg bg-muted/40 border border-border">
        <div className="flex items-center gap-2 text-sm">
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span className={cn("font-medium", mode === "blocked" ? "text-foreground" : "text-muted-foreground")}>
            Blocked
          </span>
        </div>
        <Switch
          checked={mode === "interleaved"}
          onCheckedChange={toggleMode}
          data-testid="interleaving-toggle"
          aria-label="Toggle interleaved mode"
        />
        <div className="flex items-center gap-2 text-sm">
          <span className={cn("font-medium", mode === "interleaved" ? "text-foreground" : "text-muted-foreground")}>
            Interleaved
          </span>
          <Shuffle className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>Topic distribution</span>
          <span>
            {totalSeen} / {total}
          </span>
        </div>
        <div className="flex h-2 rounded-full overflow-hidden bg-muted">
          {topics.map((t) => {
            const pct = totalSeen > 0 ? (counts[t] / totalSeen) * 100 : 0;
            return (
              <div
                key={t}
                className={cn("transition-all", topicColor[t].split(" ")[0])}
                style={{ width: `${pct}%` }}
                title={`${t}: ${counts[t]}`}
              />
            );
          })}
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {topics.map((t) => (
            <span
              key={t}
              className={cn("text-[11px] font-medium px-2 py-0.5 rounded-full", topicColor[t])}
            >
              {t} · {counts[t]}
            </span>
          ))}
        </div>
      </div>

      {finished ? (
        <div className="rounded-xl border border-border bg-background p-6 text-center animate-fade-in" data-testid="interleaving-summary">
          <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <h4 className="text-base font-semibold text-foreground mb-1">Session complete</h4>
          <p className="text-sm text-muted-foreground mb-4">
            You worked through {total} cards across {topics.length} topic{topics.length === 1 ? "" : "s"}.
          </p>
          <Button onClick={restart} data-testid="interleaving-restart">
            <Shuffle className="w-4 h-4 mr-1.5" /> Reshuffle and start over
          </Button>
        </div>
      ) : current ? (
        <div className="rounded-xl border border-border bg-background p-5 min-h-[12rem] flex flex-col">
          <span
            className={cn("self-start text-[11px] font-medium px-2 py-0.5 rounded-full mb-3", topicColor[current.topic])}
            data-testid="interleaving-card-topic"
          >
            {current.topic}
          </span>
          <p className="text-base font-medium text-foreground leading-relaxed mb-3" data-testid="interleaving-card-question">
            {current.question}
          </p>
          {revealed ? (
            <div className="text-sm text-muted-foreground leading-relaxed border-t border-border pt-3 animate-fade-in" data-testid="interleaving-card-answer">
              {current.answer}
            </div>
          ) : (
            <Button variant="outline" size="sm" className="self-start mt-auto" onClick={() => setRevealed(true)} data-testid="interleaving-reveal">
              Show answer
            </Button>
          )}
        </div>
      ) : null}

      <div className="flex items-center justify-between mt-4">
        <Button variant="outline" size="sm" onClick={prev} disabled={index === 0} data-testid="interleaving-prev">
          <ChevronLeft className="w-4 h-4 mr-1" /> Previous
        </Button>
        <span className="text-xs text-muted-foreground">
          {finished ? "Done" : `Card ${index + 1} of ${total}`}
        </span>
        <Button size="sm" onClick={next} disabled={finished} data-testid="interleaving-next">
          {index === total - 1 ? "Finish" : "Next"} <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </section>
  );
}
