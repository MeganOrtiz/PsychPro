import { useEffect, useState } from "react";
import { CalendarDays, Check, Clock, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const INTERVALS = [1, 3, 7, 14] as const;
const DAY_MS = 24 * 60 * 60 * 1000;

export interface SpacedRepetitionProps {
  storageKey: string;
  cardTitle: string;
  cardSummary?: string;
}

interface SrsState {
  startedAt: number;
  completed: number;
  lastReviewedAt: number | null;
}

function loadState(key: string): SrsState {
  if (typeof window === "undefined") return { startedAt: Date.now(), completed: 0, lastReviewedAt: null };
  try {
    const raw = window.localStorage.getItem(`srs:${key}`);
    if (raw) return JSON.parse(raw) as SrsState;
  } catch {
    /* ignore */
  }
  return { startedAt: Date.now(), completed: 0, lastReviewedAt: null };
}

function saveState(key: string, state: SrsState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(`srs:${key}`, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function formatCountdown(ms: number): string {
  if (ms <= 0) return "Ready now";
  const days = Math.floor(ms / DAY_MS);
  const hours = Math.floor((ms % DAY_MS) / (60 * 60 * 1000));
  if (days > 0) return `Review in ${days} day${days === 1 ? "" : "s"}`;
  if (hours > 0) return `Review in ${hours} hr${hours === 1 ? "" : "s"}`;
  const minutes = Math.max(1, Math.floor((ms % (60 * 60 * 1000)) / 60000));
  return `Review in ${minutes} min`;
}

export default function SpacedRepetitionScheduler({ storageKey, cardTitle, cardSummary }: SpacedRepetitionProps) {
  const [state, setState] = useState<SrsState>(() => loadState(storageKey));
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    saveState(storageKey, state);
  }, [storageKey, state]);

  const total = INTERVALS.length;
  const completed = state.completed;
  const isFinished = completed >= total;
  const nextIntervalDays = !isFinished ? INTERVALS[completed] : null;

  // Use absolute Day 1 / Day 3 / Day 7 / Day 14 checkpoints anchored to startedAt
  // so the timeline matches the spec rather than drifting with each review.
  const nextDueAt = nextIntervalDays !== null
    ? state.startedAt + nextIntervalDays * DAY_MS
    : null;

  const ready = nextDueAt !== null && now >= nextDueAt;
  const countdown = nextDueAt !== null ? formatCountdown(nextDueAt - now) : "All intervals complete";

  function markReviewed() {
    setState((prev) => ({ ...prev, completed: Math.min(prev.completed + 1, total), lastReviewedAt: Date.now() }));
  }

  function reset() {
    const fresh: SrsState = { startedAt: Date.now(), completed: 0, lastReviewedAt: null };
    setState(fresh);
  }

  return (
    <section
      className="rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-md p-5 md:p-6 shadow-2xl"
      data-testid="srs-scheduler"
    >
      <header className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
          <CalendarDays className="w-5 h-5 text-white/85" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground">Spaced Repetition</h3>
          <p className="text-xs text-muted-foreground italic">
            Spacing reviews across days strengthens long-term recall.
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
            isFinished
              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
              : ready
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground"
          )}
          data-testid="srs-countdown"
        >
          <Clock className="w-3.5 h-3.5" />
          {isFinished ? "Mastered" : countdown}
        </span>
      </header>

      <div className="mb-4">
        <div className="text-sm font-medium text-foreground mb-0.5">{cardTitle}</div>
        {cardSummary && <p className="text-xs text-muted-foreground">{cardSummary}</p>}
      </div>

      <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {completed} of {total} intervals complete
        </span>
        <span>{Math.round((completed / total) * 100)}%</span>
      </div>
      <div className="w-full bg-muted rounded-full h-1.5 mb-5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all duration-500"
          style={{ width: `${(completed / total) * 100}%` }}
        />
      </div>

      <div className="relative mb-5">
        <div className="absolute top-3.5 left-3 right-3 h-0.5 bg-border" />
        <div
          className="absolute top-3.5 left-3 h-0.5 bg-primary transition-all duration-500"
          style={{ width: `calc(${(completed / Math.max(total - 1, 1)) * 100}% * (100% - 1.5rem) / 100%)` }}
        />
        <ol className="relative grid grid-cols-4 gap-2">
          {INTERVALS.map((days, idx) => {
            const done = idx < completed;
            const isNext = idx === completed && !isFinished;
            return (
              <li key={days} className="flex flex-col items-center gap-2" data-testid={`srs-node-${idx}`}>
                <div
                  className={cn(
                    "w-7 h-7 rounded-full border-2 flex items-center justify-center text-[11px] font-semibold bg-background transition-colors",
                    done
                      ? "border-primary bg-primary text-primary-foreground"
                      : isNext
                        ? "border-primary text-primary ring-4 ring-primary/15"
                        : "border-border text-muted-foreground"
                  )}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                </div>
                <span className={cn("text-[11px] font-medium", isNext ? "text-foreground" : "text-muted-foreground")}>
                  Day {days}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={markReviewed}
          disabled={isFinished || !ready}
          data-testid="srs-mark-reviewed"
        >
          <Check className="w-4 h-4 mr-1.5" />
          Mark as Reviewed
        </Button>
        <Button variant="ghost" size="sm" onClick={reset} data-testid="srs-reset">
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          Reset
        </Button>
      </div>
    </section>
  );
}
