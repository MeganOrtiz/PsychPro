import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CalendarDays, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const INTERVALS = [1, 3, 7, 14] as const;
const DAY_MS = 24 * 60 * 60 * 1000;

interface SrsState {
  startedAt: number;
  completed: number;
  lastReviewedAt: number | null;
}

interface DueItem {
  topicId: number;
  topicName: string;
  stage: number;
  totalStages: number;
  isOverdue: boolean;
  ageDays: number;
}

interface Topic {
  id: number;
  name: string;
}

export interface TodayReviewsProps {
  topics: Topic[] | undefined;
}

function readState(key: string): SrsState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw) as SrsState;
  } catch {
    return null;
  }
}

function findDueItems(topics: Topic[]): DueItem[] {
  if (typeof window === "undefined") return [];
  const now = Date.now();
  const out: DueItem[] = [];
  const byId = new Map(topics.map((t) => [t.id, t.name]));
  // Iterate localStorage keys looking for srs:topic-<id>
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith("srs:topic-")) continue;
    const idStr = key.slice("srs:topic-".length);
    const id = parseInt(idStr, 10);
    if (!Number.isFinite(id)) continue;
    const state = readState(key);
    if (!state) continue;
    if (state.completed >= INTERVALS.length) continue;
    const nextDays = INTERVALS[state.completed];
    const dueAt = state.startedAt + nextDays * DAY_MS;
    if (now >= dueAt) {
      const name = byId.get(id);
      if (!name) continue;
      out.push({
        topicId: id,
        topicName: name,
        stage: state.completed + 1,
        totalStages: INTERVALS.length,
        isOverdue: now - dueAt > DAY_MS,
        ageDays: Math.floor((now - dueAt) / DAY_MS),
      });
    }
  }
  // Most overdue first
  out.sort((a, b) => b.ageDays - a.ageDays);
  return out;
}

export default function TodayReviews({ topics }: TodayReviewsProps) {
  const [, navigate] = useLocation();
  const [items, setItems] = useState<DueItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!topics || topics.length === 0) {
      setItems([]);
      setReady(true);
      return;
    }
    setItems(findDueItems(topics));
    setReady(true);

    function handleStorage(e: StorageEvent) {
      if (!e.key || !e.key.startsWith("srs:topic-")) return;
      setItems(findDueItems(topics!));
    }
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [topics]);

  if (!ready) return null;

  return (
    <section
      className="bg-card border border-border rounded-xl p-5"
      data-testid="today-reviews"
    >
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-4 h-4 text-primary" />
        <h2 className="font-semibold text-foreground">Today's Reviews</h2>
        {items.length > 0 && (
          <span className="ml-auto text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary text-primary-foreground">
            {items.length}
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          <p>
            No reviews due. As you study a topic and mark its retention plan, we'll surface it here on the day it's due.
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {items.slice(0, 5).map((item) => (
            <li key={item.topicId}>
              <button
                onClick={() => navigate(`/topics/${item.topicId}`)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors text-left"
                data-testid={`review-item-${item.topicId}`}
              >
                <span className={cn(
                  "shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold",
                  item.isOverdue
                    ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                    : "bg-primary/10 text-primary",
                )}>
                  {item.stage}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{item.topicName}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.isOverdue ? `${item.ageDays + 1} day${item.ageDays === 0 ? "" : "s"} overdue` : "Ready now"}
                    {" · "}stage {item.stage} of {item.totalStages}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
              </button>
            </li>
          ))}
          {items.length > 5 && (
            <li className="text-xs text-muted-foreground text-center pt-1">
              +{items.length - 5} more due
            </li>
          )}
        </ul>
      )}
    </section>
  );
}
