import { useMemo, useState } from "react";
import { Beaker, Brain, CalendarDays, Shuffle, Lightbulb, ArrowRight, ChevronLeft, BookOpen, Info } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "wouter";
import { useQueries } from "@tanstack/react-query";
import {
  useGetTopics,
  getFlashcardsByTopic,
  type Topic,
  type Flashcard,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PageTitle } from "@/components/brand/page-title";
import BrainDump from "@/components/learning/brain-dump";
import SpacedRepetitionScheduler from "@/components/learning/spaced-repetition";
import InterleavingMode, { type InterleaveCard } from "@/components/learning/interleaving-mode";
import ElaborationPanel from "@/components/learning/elaboration-panel";

type TechId = "active-recall" | "spaced" | "mixed" | "elaboration";

const TECHNIQUES: {
  id: TechId;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  blurb: string;
  longBlurb: string;
  howToUse: string;
}[] = [
  {
    id: "active-recall",
    icon: Brain,
    title: "Active Recall",
    blurb: "Retrieve information to strengthen memory pathways.",
    longBlurb: "Pull the answer out of your head before checking — that retrieval effort is what makes the memory stick.",
    howToUse: "Pick a topic. We'll show you one of its flashcards as a prompt. Write what you remember, then reveal the answer.",
  },
  {
    id: "spaced",
    icon: CalendarDays,
    title: "Spaced Repetition",
    blurb: "Review over time to build long-term retention.",
    longBlurb: "Review at expanding intervals (Day 1, 3, 7, 14) so each return interrupts the forgetting curve.",
    howToUse: "Pick a topic and start its retention plan. Each day-checkpoint appears in Today's Reviews on your home page when it's due — this is a multi-day plan, not a same-session activity.",
  },
  {
    id: "mixed",
    icon: Shuffle,
    title: "Mixed Mode",
    blurb: "Mix topics over time to improve discrimination and flexibility.",
    longBlurb: "Interleaving forces your brain to choose the right strategy, not just repeat one — durable learning.",
    howToUse: "Pick two or more of your topics. We'll interleave their real flashcards so you have to discriminate between them.",
  },
  {
    id: "elaboration",
    icon: Lightbulb,
    title: "Elaboration",
    blurb: "Connect ideas and explain why they make sense.",
    longBlurb: "Why does this make sense? How does it connect to what you already know? Generative answers consolidate it.",
    howToUse: "Pick a topic to anchor your reflection. Generative prompts help you connect what you've learned to clinical reality.",
  },
];

// ---------------------------------------------------------------------------
// Topic pickers — small inline components reused across the four techniques.
// ---------------------------------------------------------------------------

function TopicGridSingle({
  topics,
  value,
  onChange,
  requireFlashcards = false,
}: {
  topics: Topic[];
  value: number | null;
  onChange: (id: number) => void;
  requireFlashcards?: boolean;
}) {
  const eligible = requireFlashcards
    ? topics.filter((t) => (t.flashcardCount ?? 0) > 0)
    : topics;

  if (eligible.length === 0) {
    return (
      <EmptyTopics
        message={
          requireFlashcards
            ? "None of your topics have flashcards yet. Open a topic and generate flashcards to use this technique."
            : "No topics in your library yet."
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" data-testid="topic-picker-single">
      {eligible.map((t) => {
        const active = value === t.id;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            data-testid={`topic-option-${t.id}`}
            className={cn(
              "text-left rounded-lg border p-3 transition-all",
              active
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/40 hover:bg-muted/50",
            )}
          >
            <div className="text-sm font-medium text-foreground">{t.name}</div>
            <div className="text-[11px] text-white/70 mt-0.5">
              {t.flashcardCount ?? 0} cards · {t.quizCount ?? 0} quiz Qs
            </div>
          </button>
        );
      })}
    </div>
  );
}

function TopicGridMulti({
  topics,
  selected,
  onToggle,
  max = 6,
}: {
  topics: Topic[];
  selected: Set<number>;
  onToggle: (id: number) => void;
  max?: number;
}) {
  const eligible = topics.filter((t) => (t.flashcardCount ?? 0) > 0);

  if (eligible.length === 0) {
    return (
      <EmptyTopics message="None of your topics have flashcards yet. Open a topic and generate flashcards to interleave." />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2" data-testid="topic-picker-multi">
      {eligible.map((t) => {
        const active = selected.has(t.id);
        const atMax = !active && selected.size >= max;
        return (
          <button
            key={t.id}
            onClick={() => onToggle(t.id)}
            disabled={atMax}
            data-testid={`topic-option-${t.id}`}
            className={cn(
              "text-left rounded-lg border p-3 transition-all",
              active
                ? "border-primary bg-primary/10"
                : "border-border bg-card hover:border-primary/40 hover:bg-muted/50",
              atMax && "opacity-40 cursor-not-allowed",
            )}
          >
            <div className="flex items-start gap-2">
              <span
                className={cn(
                  "shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center text-[10px] font-bold",
                  active
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border bg-background",
                )}
              >
                {active ? "✓" : ""}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-medium text-foreground truncate">{t.name}</div>
                <div className="text-[11px] text-white/70 mt-0.5">
                  {t.flashcardCount ?? 0} cards
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

function EmptyTopics({ message }: { message: string }) {
  return (
    <div
      className="rounded-lg border border-dashed border-border bg-muted/30 p-6 text-center"
      data-testid="topic-picker-empty"
    >
      <BookOpen className="w-6 h-6 text-white/70 mx-auto mb-2" />
      <p className="text-sm text-white/70 mb-3">{message}</p>
      <Link href="/topics">
        <Button variant="outline" size="sm" data-testid="empty-topics-cta">
          Browse topics
        </Button>
      </Link>
    </div>
  );
}

function HowToBanner({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2">
      <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
      <p className="text-xs text-white/70 leading-snug">{children}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Technique containers — each handles its own picker + content.
// ---------------------------------------------------------------------------

function ActiveRecallView({ topics, howToUse }: { topics: Topic[]; howToUse: string }) {
  const [topicId, setTopicId] = useState<number | null>(null);
  const [recallIndex, setRecallIndex] = useState(0);

  const { data: cards } = useQueries({
    queries: [
      {
        queryKey: ["flashcardsByTopic", topicId],
        queryFn: () => (topicId ? getFlashcardsByTopic(topicId) : Promise.resolve([] as Flashcard[])),
        enabled: !!topicId,
      },
    ],
    combine: (results) => ({
      data: results[0].data,
      isLoading: results[0].isLoading,
    }),
  });

  const topic = topics.find((t) => t.id === topicId);

  if (!topicId) {
    return (
      <>
        <HowToBanner>{howToUse}</HowToBanner>
        <TopicGridSingle topics={topics} value={null} onChange={setTopicId} requireFlashcards />
      </>
    );
  }

  if (!cards) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  if (cards.length === 0) {
    return (
      <EmptyTopics message="No flashcards available for this topic. Pick another or generate cards on the topic page." />
    );
  }

  const current = cards[recallIndex % cards.length];
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-white/70">
        <span>Recalling from</span>
        <span className="font-medium text-foreground">{topic?.name}</span>
        <span className="ml-auto">
          Card {(recallIndex % cards.length) + 1} of {cards.length}
        </span>
        <button
          onClick={() => {
            setTopicId(null);
            setRecallIndex(0);
          }}
          className="text-primary hover:underline"
          data-testid="recall-change-topic"
        >
          Change topic
        </button>
      </div>
      <BrainDump
        storageKey={`lab-recall-${topicId}-${recallIndex}`}
        topic={topic?.name ?? "Topic"}
        prompt={current.question}
        answer={current.answer}
        onNext={() => setRecallIndex((i) => i + 1)}
      />
    </div>
  );
}

function SpacedView({ topics, howToUse }: { topics: Topic[]; howToUse: string }) {
  const [topicId, setTopicId] = useState<number | null>(null);
  const topic = topics.find((t) => t.id === topicId);

  if (!topicId || !topic) {
    return (
      <>
        <HowToBanner>{howToUse}</HowToBanner>
        <TopicGridSingle topics={topics} value={null} onChange={setTopicId} />
      </>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-white/70">
        <span>Scheduling</span>
        <span className="font-medium text-foreground">{topic.name}</span>
        <button
          onClick={() => setTopicId(null)}
          className="ml-auto text-primary hover:underline"
          data-testid="spaced-change-topic"
        >
          Change topic
        </button>
      </div>
      {/* KEY FIX: storageKey={`topic-${id}`} matches what TodayReviews reads
          (srs:topic-<id>). Lab-scheduled reviews now surface in Today's Reviews. */}
      <SpacedRepetitionScheduler
        storageKey={`topic-${topicId}`}
        cardTitle={topic.name}
        cardSummary="Each checkpoint unlocks at the listed day. When it's ready, it'll appear in Today's Reviews on your home page."
      />
    </div>
  );
}

function MixedView({ topics, howToUse }: { topics: Topic[]; howToUse: string }) {
  // Default selection: top 3 topics by flashcard count.
  const defaultSelection = useMemo(() => {
    const ranked = [...topics]
      .filter((t) => (t.flashcardCount ?? 0) > 0)
      .sort((a, b) => (b.flashcardCount ?? 0) - (a.flashcardCount ?? 0))
      .slice(0, 3)
      .map((t) => t.id);
    return new Set(ranked);
  }, [topics]);
  const [selected, setSelected] = useState<Set<number>>(defaultSelection);
  const [started, setStarted] = useState(false);

  const selectedIds = useMemo(() => Array.from(selected), [selected]);

  const { data: allCards, isLoading } = useQueries({
    queries: selectedIds.map((id) => ({
      queryKey: ["flashcardsByTopic", id],
      queryFn: () => getFlashcardsByTopic(id),
      enabled: started,
    })),
    combine: (results) => ({
      data: results.flatMap((r, idx) =>
        (r.data ?? []).map<InterleaveCard>((fc) => ({
          topic: topics.find((t) => t.id === selectedIds[idx])?.name ?? "Topic",
          question: fc.question,
          answer: fc.answer,
        })),
      ),
      isLoading: results.some((r) => r.isLoading),
    }),
  });

  function toggle(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  if (!started) {
    return (
      <div className="space-y-4">
        <HowToBanner>{howToUse}</HowToBanner>
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground">Pick topics to interleave</h4>
          <span className="text-xs text-white/70">
            {selected.size} selected · max 6
          </span>
        </div>
        <TopicGridMulti topics={topics} selected={selected} onToggle={toggle} max={6} />
        <Button
          onClick={() => setStarted(true)}
          disabled={selected.size < 2}
          className="w-full"
          data-testid="mixed-start"
        >
          {selected.size < 2
            ? "Pick at least 2 topics"
            : `Start mixed session (${selected.size} topics)`}
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      </div>
    );
  }

  if (isLoading || !allCards) {
    return <Skeleton className="h-64 w-full rounded-2xl" />;
  }

  if (allCards.length === 0) {
    return (
      <EmptyTopics message="No flashcards across the selected topics. Pick different topics or generate cards first." />
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-white/70">
        <span>Interleaving</span>
        <span className="font-medium text-foreground">
          {selectedIds.length} topic{selectedIds.length === 1 ? "" : "s"} ·{" "}
          {allCards.length} cards
        </span>
        <button
          onClick={() => setStarted(false)}
          className="ml-auto text-primary hover:underline"
          data-testid="mixed-change-topics"
        >
          Change topics
        </button>
      </div>
      <InterleavingMode cards={allCards} />
    </div>
  );
}

function ElaborationView({ topics, howToUse }: { topics: Topic[]; howToUse: string }) {
  const [topicId, setTopicId] = useState<number | null>(null);
  const topic = topics.find((t) => t.id === topicId);

  if (!topicId || !topic) {
    return (
      <>
        <HowToBanner>{howToUse}</HowToBanner>
        <TopicGridSingle topics={topics} value={null} onChange={setTopicId} />
      </>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-white/70">
        <span>Elaborating on</span>
        <span className="font-medium text-foreground">{topic.name}</span>
        <button
          onClick={() => setTopicId(null)}
          className="ml-auto text-primary hover:underline"
          data-testid="elab-change-topic"
        >
          Change topic
        </button>
      </div>
      <ElaborationPanel
        storageKey={`lab-elab-topic-${topicId}`}
        context={`Reflecting on ${topic.name}. Use these prompts to connect this topic to clinical reality, other topics you know, or cases you've seen.`}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function StudyLabPage() {
  const [active, setActive] = useState<TechId | null>(null);
  const { data: topics, isLoading } = useGetTopics();

  if (active) {
    const tech = TECHNIQUES.find((t) => t.id === active)!;
    return (
      <div className="min-h-full study-page-bg" data-testid={`study-lab-detail-${active}`}>
        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
          <button
            onClick={() => setActive(null)}
            className="flex items-center gap-1 text-sm text-white/70 hover:text-foreground mb-4 font-medium"
            data-testid="back-to-techniques"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Techniques
          </button>

          <PageTitle title={tech.title} icon={tech.icon as LucideIcon} subtitle={tech.longBlurb} />

          {isLoading || !topics ? (
            <Skeleton className="h-64 w-full rounded-2xl" />
          ) : (
            <>
              {active === "active-recall" && (
                <ActiveRecallView topics={topics} howToUse={tech.howToUse} />
              )}
              {active === "spaced" && <SpacedView topics={topics} howToUse={tech.howToUse} />}
              {active === "mixed" && <MixedView topics={topics} howToUse={tech.howToUse} />}
              {active === "elaboration" && (
                <ElaborationView topics={topics} howToUse={tech.howToUse} />
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full study-page-bg" data-testid="study-lab-page">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <PageTitle
          title="Study Lab"
          icon={Beaker}
          subtitle="Four evidence-based techniques applied to your topics. Pick a technique to get started."
          className="mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TECHNIQUES.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              data-testid={`tech-card-${t.id}`}
              className="group text-left rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <t.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1.5">{t.title}</h3>
              <p className="text-sm text-white/70 mb-4 leading-snug">{t.blurb}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Start <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            Create Custom Tools
          </h2>
          <p className="text-sm text-white/70 mb-4 max-w-xl mx-auto">
            Generate flashcards, quizzes, study guides, and practice exams from your own notes or text.
          </p>
          <Link href="/my-decks/new?tier=standard">
            <Button data-testid="study-lab-cta">
              Create Tools <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
