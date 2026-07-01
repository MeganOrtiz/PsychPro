import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { useQueries } from "@tanstack/react-query";
import {
  getFlashcardsByTopic,
  getQuizzesByTopic,
  useGetTopics,
  type Flashcard,
  type QuizQuestion,
} from "@workspace/api-client-react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Layers,
  RotateCcw,
  XCircle,
} from "lucide-react";
import { StudySurface } from "@/components/study/study-surface";
import { useEntitlements } from "@/lib/use-entitlements";
import UpgradePrompt from "@/components/upgrade-prompt";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { cn } from "@/lib/utils";

type SessionMode = "flashcards" | "quiz";
type CardItem = Flashcard & { topicName: string };
type QuestionItem = QuizQuestion & { topicName: string };

function roundRobin<T>(groups: T[][]): T[] {
  const result: T[] = [];
  const max = Math.max(0, ...groups.map((group) => group.length));
  for (let index = 0; index < max; index += 1) {
    for (const group of groups) {
      if (group[index]) result.push(group[index]);
    }
  }
  return result;
}

function parseSessionRequest() {
  const params = new URLSearchParams(typeof window === "undefined" ? "" : window.location.search);
  const topicIds = [...new Set(
    (params.get("topics") ?? "")
      .split(",")
      .map(Number)
      .filter((id) => Number.isInteger(id) && id > 0),
  )].slice(0, 40);
  const requestedLimit = Number(params.get("limit"));
  const limit = Number.isInteger(requestedLimit) && requestedLimit > 0
    ? Math.min(requestedLimit, 1000)
    : 20;
  return { topicIds, limit };
}

export default function EpppStudySessionPage({ mode }: { mode: SessionMode }) {
  const [, navigate] = useLocation();
  const { topicIds, limit } = useMemo(parseSessionRequest, []);
  const { data: entitlements, isLoading: entitlementsLoading } = useEntitlements();
  const { data: topics } = useGetTopics();
  const topicNameById = useMemo(
    () => new Map((topics ?? []).map((topic) => [topic.id, topic.name])),
    [topics],
  );

  const contentQueries = useQueries({
    queries: topicIds.map((topicId) => ({
      queryKey: ["eppp-study-session", mode, topicId],
      queryFn: () => mode === "flashcards" ? getFlashcardsByTopic(topicId) : getQuizzesByTopic(topicId),
      staleTime: 60_000,
    })),
  });

  const loading = contentQueries.some((query) => query.isLoading);
  const failed = contentQueries.some((query) => query.isError);
  const cards = useMemo<CardItem[]>(() => {
    if (mode !== "flashcards") return [];
    return roundRobin(
      contentQueries.map((query, index) =>
        ((query.data ?? []) as Flashcard[]).map((card) => ({
          ...card,
          topicName: topicNameById.get(topicIds[index]) ?? "EPPP lesson",
        })),
      ),
    ).slice(0, limit);
  }, [contentQueries, limit, mode, topicIds, topicNameById]);
  const questions = useMemo<QuestionItem[]>(() => {
    if (mode !== "quiz") return [];
    return roundRobin(
      contentQueries.map((query, index) =>
        ((query.data ?? []) as QuizQuestion[]).map((question) => ({
          ...question,
          topicName: topicNameById.get(topicIds[index]) ?? "EPPP lesson",
        })),
      ),
    ).slice(0, limit);
  }, [contentQueries, limit, mode, topicIds, topicNameById]);

  if (entitlementsLoading) {
    return <div className="study-page-bg min-h-screen grid place-items-center text-white/70">Loading session…</div>;
  }
  if (!entitlements?.epppAccess) {
    return <UpgradePrompt reason="eppp" onDismiss={() => navigate("/dashboard")} />;
  }

  return (
    <main className="study-page-bg min-h-screen px-4 py-6 md:px-8 md:py-10" data-testid={`eppp-study-session-${mode}`}>
      <div className="mx-auto max-w-3xl">
        <button
          type="button"
          onClick={() => navigate("/eppp/suite/study-plan")}
          className="mb-6 inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Study Plan
        </button>

        <header className="mb-7 text-center text-scrim">
          <p className="mb-2 text-[11px] font-extrabold tracking-[0.14em] text-[#76E4F7]">MIXED STUDY SESSION</p>
          <h1 className="text-3xl font-light tracking-wide text-white md:text-4xl">
            {mode === "flashcards" ? "Flashcard Deck" : "Practice Quiz"}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/65">
            Interleaved across {topicIds.length} selected {topicIds.length === 1 ? "lesson" : "lessons"} so recall has to travel between domains.
          </p>
        </header>

        {topicIds.length === 0 ? (
          <SessionMessage message="No lessons were selected. Return to Study Plan and choose at least one lesson." />
        ) : loading ? (
          <SessionMessage message="Building your mixed session…" />
        ) : failed ? (
          <SessionMessage message="Some lesson content could not be loaded. Return to Study Plan and try again." />
        ) : mode === "flashcards" ? (
          <FlashcardSession cards={cards} />
        ) : (
          <QuizSession questions={questions} />
        )}
      </div>
    </main>
  );
}

function SessionMessage({ message }: { message: string }) {
  return (
    <StudySurface tone="light" innerClassName="p-10 text-center">
      <p className="text-sm text-white/70">{message}</p>
    </StudySurface>
  );
}

function FlashcardSession({ cards }: { cards: CardItem[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[index];

  if (!card) return <SessionMessage message="The selected lessons do not contain flashcards yet." />;

  const move = (nextIndex: number) => {
    setIndex(nextIndex);
    setFlipped(false);
  };

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-4 text-xs text-white/60">
        <span>{card.topicName}</span><span>Card {index + 1} of {cards.length}</span>
      </div>
      <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[#76E4F7] transition-all" style={{ width: `${((index + 1) / cards.length) * 100}%` }} />
      </div>
      <button type="button" className="block w-full text-left" onClick={() => setFlipped((value) => !value)}>
        <StudySurface
          tone={flipped ? "accent" : "card-front"}
          innerClassName="min-h-[320px] p-8 md:p-11 flex flex-col items-center justify-center text-center"
        >
          <Layers className="mb-6 h-6 w-6 text-[#76E4F7]" />
          <p className="text-lg font-medium leading-relaxed text-white md:text-xl">{flipped ? card.answer : card.question}</p>
          <p className="mt-8 text-[10px] font-bold tracking-[0.12em] text-white/55">{flipped ? "TAP TO SEE PROMPT" : "TAP TO REVEAL ANSWER"}</p>
        </StudySurface>
      </button>
      <div className="mt-5 flex items-center justify-between gap-3">
        <button type="button" disabled={index === 0} onClick={() => move(index - 1)} className="eppp-launch-btn disabled:opacity-35">
          <span className="eppp-launch-btn__inner"><ChevronLeft /> Previous</span>
        </button>
        <button type="button" onClick={() => { setIndex(0); setFlipped(false); }} className="p-2 text-white/55 hover:text-white" aria-label="Restart deck"><RotateCcw className="h-4 w-4" /></button>
        <button type="button" disabled={index === cards.length - 1} onClick={() => move(index + 1)} className="eppp-launch-btn disabled:opacity-35">
          <span className="eppp-launch-btn__inner">Next <ChevronRight /></span>
        </button>
      </div>
    </section>
  );
}

function QuizSession({ questions }: { questions: QuestionItem[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [complete, setComplete] = useState(false);
  const question = questions[index];

  if (!question) return <SessionMessage message="The selected lessons do not contain quiz questions yet." />;

  const select = (answer: string) => {
    if (selected) return;
    setSelected(answer);
    if (answer === question.correctAnswer) setScore((value) => value + 1);
  };
  const next = () => {
    if (index === questions.length - 1) setComplete(true);
    else { setIndex((value) => value + 1); setSelected(null); }
  };
  const restart = () => { setIndex(0); setSelected(null); setScore(0); setComplete(false); };

  if (complete) {
    const percent = Math.round((score / questions.length) * 100);
    return (
      <StudySurface tone="light" innerClassName="p-8 md:p-11 text-center">
        <CheckCircle2 className="mx-auto mb-5 h-10 w-10 text-[#76E4F7]" />
        <h2 className="text-2xl font-semibold text-white">Session complete</h2>
        <p className="mt-3 text-white/70">You answered {score} of {questions.length} correctly ({percent}%).</p>
        <button type="button" onClick={restart} className="eppp-launch-btn mt-7"><span className="eppp-launch-btn__inner"><RotateCcw /> Retake mixed quiz</span></button>
      </StudySurface>
    );
  }

  const options = [
    ["A", question.optionA], ["B", question.optionB], ["C", question.optionC], ["D", question.optionD],
  ] as const;

  return (
    <section>
      <div className="mb-3 flex items-center justify-between gap-4 text-xs text-white/60">
        <span>{question.topicName}</span><span>Question {index + 1} of {questions.length}</span>
      </div>
      <div className="mb-7 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[#76E4F7] transition-all" style={{ width: `${((index + 1) / questions.length) * 100}%` }} />
      </div>
      <StudySurface tone="light" innerClassName="p-6 md:p-8 mb-5">
        <p className="text-base font-medium leading-relaxed text-white md:text-lg">{question.question}</p>
      </StudySurface>
      <div className="space-y-2.5">
        {options.map(([key, text]) => {
          const correct = key === question.correctAnswer;
          const chosen = key === selected;
          return (
            <button
              key={key}
              type="button"
              disabled={!!selected}
              onClick={() => select(key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-[10px] border px-4 py-3.5 text-left text-sm transition-all",
                !selected && "border-[#76E4F7]/25 bg-[#07333e]/80 text-white hover:border-[#76E4F7]/60",
                selected && correct && "border-emerald-400/60 bg-emerald-700/65 text-white",
                selected && chosen && !correct && "border-red-400/60 bg-red-800/65 text-white",
                selected && !chosen && !correct && "border-white/10 bg-[#07333e]/55 text-white/45",
              )}
            >
              <span className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-full border border-current/30 text-xs font-bold">{key}</span>
              <span className="flex-1">{text}</span>
              {selected && correct && <CheckCircle2 className="h-4 w-4" />}
              {selected && chosen && !correct && <XCircle className="h-4 w-4" />}
            </button>
          );
        })}
      </div>
      {selected && (
        <StudySurface tone="light" innerClassName="p-5 mt-5">
          <p className="text-sm leading-relaxed text-white/75"><strong className="text-[#A7F3FF]">Why:</strong> {question.explanation}</p>
        </StudySurface>
      )}
      <div className="mt-5 flex justify-end">
        <button type="button" disabled={!selected} onClick={next} className="eppp-launch-btn disabled:opacity-35">
          <span className="eppp-launch-btn__inner">{index === questions.length - 1 ? "Finish" : "Next question"} <ArrowRight /></span>
        </button>
      </div>
    </section>
  );
}
