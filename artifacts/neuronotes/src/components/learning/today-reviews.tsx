import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { CalendarDays, ArrowRight, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { StudySurface } from "@/components/study/study-surface";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

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
    <StudySurface tone="light" innerClassName="p-5" testId="today-reviews">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays className="w-4 h-4" style={{ color: P.tealDeep }} />
        <h2 className="font-semibold" style={{ color: P.mist }}>Today's Reviews</h2>
        {items.length > 0 && (
          <span
            className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full border"
            style={{
              background: "rgba(94,176,200,0.16)",
              color: P.surf,
              borderColor: "rgba(118,228,247,0.30)",
            }}
          >
            {items.length}
          </span>
        )}
      </div>
      {items.length === 0 ? (
        <div className="flex items-start gap-2 text-xs" style={{ color: P.mistSoft }}>
          <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: P.tealDeep }} />
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
                className="recommended-tile w-full flex items-center gap-3 px-3 py-2 rounded-md border text-left transition-all hover:-translate-y-0.5"
                data-testid={`review-item-${item.topicId}`}
              >
                <span
                  className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold border"
                  style={
                    item.isOverdue
                      ? {
                          background: `linear-gradient(135deg, ${P.teal}, ${P.surf})`,
                          color: "#05303f",
                          borderColor: P.tealDeep,
                        }
                      : {
                          background: "rgba(94,176,200,0.14)",
                          color: P.surf,
                          borderColor: "rgba(118,228,247,0.30)",
                        }
                  }
                >
                  {item.stage}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: P.mist }}>{item.topicName}</p>
                  <p className="text-[11px]" style={{ color: P.mistSoft }}>
                    {item.isOverdue ? `${item.ageDays + 1} day${item.ageDays === 0 ? "" : "s"} overdue` : "Ready now"}
                    {" · "}stage {item.stage} of {item.totalStages}
                  </p>
                </div>
                <ArrowRight className="w-4 h-4 shrink-0" style={{ color: P.tealDeep }} />
              </button>
            </li>
          ))}
          {items.length > 5 && (
            <li className="text-xs text-center pt-1" style={{ color: P.mistSoft }}>
              +{items.length - 5} more due
            </li>
          )}
        </ul>
      )}
    </StudySurface>
  );
}
