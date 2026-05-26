import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { BookMarked, Layers, FileText, GraduationCap, ChevronLeft, ChevronRight, RotateCcw, CheckCircle, XCircle, AlertCircle, Timer, Pencil, Shuffle, Repeat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import { shuffle } from "@/lib/shuffle";
import { authHeaders } from "@/lib/auth-headers";

type Deck = { id: number; title: string; studyGuide: string | null; status: string; tier?: "standard" | "pro"; tools?: string[]; examQuestionCount?: number; examTimed?: boolean };
type Flashcard = { id: number; front: string; back: string; difficulty: string; cardOrder: number };
type QuizQuestion = { id: number; question: string; optionA: string; optionB: string; optionC: string; optionD: string; correctAnswer: string; explanation: string | null; questionOrder: number };
type ClozeItem = { id: number; sentence: string; answer: string; hint: string | null; itemOrder: number };

type Tab = "flashcards" | "quiz" | "cloze" | "match" | "review" | "study-guide" | "exam";

const STANDARD_TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }>; toolId: string }[] = [
  { id: "flashcards", label: "Flashcards", icon: Layers, toolId: "flashcards" },
  { id: "quiz", label: "Quiz", icon: BookMarked, toolId: "quiz" },
  { id: "study-guide", label: "Study Guide", icon: FileText, toolId: "studyGuide" },
  { id: "exam", label: "Practice Exam", icon: GraduationCap, toolId: "exam" },
];

const PRO_TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }>; toolId: string }[] = [
  { id: "match", label: "Matching", icon: Shuffle, toolId: "match" },
  { id: "cloze", label: "Fill-in-Blank", icon: Pencil, toolId: "cloze" },
  { id: "review", label: "Spaced Review", icon: Repeat, toolId: "review" },
];

function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const map: Record<string, string> = {
    easy: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${map[difficulty] || map.medium}`}>{difficulty}</span>;
}

function FlashcardsView({ cards }: { cards: Flashcard[] }) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = cards[index];

  function next() { setIndex((i) => (i + 1) % cards.length); setFlipped(false); }
  function prev() { setIndex((i) => (i - 1 + cards.length) % cards.length); setFlipped(false); }

  if (!card) return <p className="text-muted-foreground text-center py-8">No flashcards generated.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{index + 1} / {cards.length}</span>
      </div>
      <div
        className="relative w-full cursor-pointer select-none"
        style={{ minHeight: 200 }}
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`w-full rounded-2xl border-2 p-6 text-center transition-all duration-300 ${flipped ? "border-primary bg-primary/5" : "border-border bg-card"}`} style={{ minHeight: 200 }}>
          <div className="flex flex-col items-center h-full gap-3" style={{ minHeight: 164 }}>
            <div className="w-full flex justify-start">
              <DifficultyBadge difficulty={card.difficulty} />
            </div>
            <div className="flex-1 flex items-center justify-center">
              <p className="text-foreground font-medium text-base leading-relaxed">{flipped ? card.back : card.front}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" className="flex-1 gap-2" onClick={prev}><ChevronLeft className="w-4 h-4" />Prev</Button>
        <Button variant="outline" className="flex-1 gap-2" onClick={() => setFlipped(false)}><RotateCcw className="w-4 h-4" />Flip</Button>
        <Button className="flex-1 gap-2" onClick={next}>Next<ChevronRight className="w-4 h-4" /></Button>
      </div>
    </div>
  );
}

function QuizView({ questions, isExam, examLength, timed }: { questions: QuizQuestion[]; isExam?: boolean; examLength?: number; timed?: boolean }) {
  const targetLen = isExam ? Math.min(examLength ?? 15, questions.length) : questions.length;
  const examQuestions = isExam ? questions.slice(0, targetLen) : questions;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [index, setIndex] = useState(0);
  const totalSeconds = (isExam && timed) ? examQuestions.length * 90 : 0;
  const [secondsLeft, setSecondsLeft] = useState<number>(totalSeconds);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const q = examQuestions[index];
  const score = submitted ? examQuestions.filter((q) => answers[q.id] === q.correctAnswer).length : 0;

  const OPTIONS: [string, string][] = q ? [["A", q.optionA], ["B", q.optionB], ["C", q.optionC], ["D", q.optionD]] : [];

  useEffect(() => {
    if (!isExam || !timed || submitted) return;
    timerRef.current = setInterval(() => {
      // Updater must be pure — React invokes it twice in dev StrictMode for
      // purity checks, so any side effects inside (setSubmitted, setIndex)
      // would double-fire. Just decrement here; the auto-submit effect below
      // observes secondsLeft hitting zero and triggers the end-of-exam state.
      setSecondsLeft((s) => (s <= 0 ? 0 : s - 1));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isExam, timed, submitted]);

  // Auto-submit when the timer runs out. Kept separate from the tick effect so
  // the state updater above can stay pure (see comment in tick effect).
  useEffect(() => {
    if (!isExam || !timed || submitted) return;
    if (secondsLeft > 0) return;
    setSubmitted(true);
    setIndex(examQuestions.length);
  }, [isExam, timed, submitted, secondsLeft, examQuestions.length]);

  function reset() {
    setAnswers({}); setSubmitted(false); setIndex(0);
    setSecondsLeft(totalSeconds);
  }

  const fmtTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (examQuestions.length === 0) return <p className="text-muted-foreground text-center py-8">No questions generated.</p>;

  if (submitted && index >= examQuestions.length) {
    const pct = Math.round((score / examQuestions.length) * 100);
    return (
      <div className="text-center py-10 space-y-4">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto text-2xl font-bold ${pct >= 70 ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"}`}>
          {pct}%
        </div>
        <div>
          <p className="text-xl font-bold text-foreground">{score} / {examQuestions.length} correct</p>
          <p className="text-muted-foreground text-sm mt-1">{pct >= 90 ? "Excellent work!" : pct >= 70 ? "Good job!" : "Keep studying!"}</p>
        </div>
        <Button onClick={reset} className="gap-2"><RotateCcw className="w-4 h-4" />Retake</Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Question {index + 1} / {examQuestions.length}</span>
        {isExam && timed ? (
          <span className={`flex items-center gap-1 text-xs font-medium ${secondsLeft < 60 ? "text-red-600" : "text-foreground"}`}>
            <Timer className="w-3.5 h-3.5" />{fmtTime(secondsLeft)}
          </span>
        ) : !isExam ? (
          <span className="text-xs">{Object.keys(answers).length} answered</span>
        ) : null}
      </div>

      <div className="bg-card border border-border rounded-xl p-4">
        <p className="font-medium text-foreground leading-relaxed">{q.question}</p>
      </div>

      <div className="space-y-2">
        {OPTIONS.map(([key, text]) => {
          const selected = answers[q.id] === key;
          const correct = q.correctAnswer === key;
          let cls = "border border-border bg-card text-foreground hover:border-primary/40";
          if (submitted) {
            if (correct) cls = "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300";
            else if (selected && !correct) cls = "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300";
          } else if (selected) {
            cls = "border-primary bg-primary/10 text-primary";
          }

          return (
            <button
              key={key}
              disabled={submitted}
              onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: key }))}
              className={`w-full text-left rounded-xl px-4 py-3 text-sm transition-colors ${cls} flex items-start gap-3`}
            >
              <span className="font-bold flex-shrink-0 w-5">{key}.</span>
              <span>{text}</span>
              {submitted && correct && <CheckCircle className="w-4 h-4 text-green-600 ml-auto flex-shrink-0 mt-0.5" />}
              {submitted && selected && !correct && <XCircle className="w-4 h-4 text-red-500 ml-auto flex-shrink-0 mt-0.5" />}
            </button>
          );
        })}
      </div>

      {submitted && q.explanation && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-3">
          <p className="text-xs font-semibold text-blue-800 dark:text-blue-300 mb-1">Explanation</p>
          <p className="text-sm text-blue-700 dark:text-blue-400">{q.explanation}</p>
        </div>
      )}

      <div className="flex gap-3">
        {!submitted ? (
          <>
            <Button variant="outline" className="flex-1" disabled={index === 0} onClick={() => setIndex((i) => i - 1)}>
              <ChevronLeft className="w-4 h-4 mr-1" />Prev
            </Button>
            {answers[q.id] && index < examQuestions.length - 1 ? (
              <Button className="flex-1" onClick={() => { setIndex((i) => i + 1); }}>
                Next<ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            ) : answers[q.id] ? (
              <Button className="flex-1" onClick={() => setSubmitted(true)}>Submit</Button>
            ) : (
              <Button className="flex-1" disabled>Select an answer</Button>
            )}
          </>
        ) : (
          <>
            {index > 0 && <Button variant="outline" onClick={() => setIndex((i) => i - 1)}><ChevronLeft className="w-4 h-4 mr-1" />Prev</Button>}
            {index < examQuestions.length - 1 ? (
              <Button className="flex-1" onClick={() => setIndex((i) => i + 1)}>Next<ChevronRight className="w-4 h-4 ml-1" /></Button>
            ) : (
              <Button className="flex-1" onClick={() => setIndex(examQuestions.length)}>View Results</Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function ClozeView({ items }: { items: ClozeItem[] }) {
  const [index, setIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [revealed, setRevealed] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const item = items[index];

  function next() {
    setIndex((i) => (i + 1) % items.length);
    setGuess(""); setRevealed(false); setShowHint(false);
  }
  function check() {
    setRevealed(true);
  }

  if (!item) return <p className="text-muted-foreground text-center py-8">No fill-in-the-blank items were generated for this deck.</p>;

  const correct = revealed && guess.trim().toLowerCase() === item.answer.trim().toLowerCase();
  const parts = item.sentence.split("___");

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{index + 1} / {items.length}</span>
        {item.hint && (
          <button onClick={() => setShowHint(!showHint)} className="text-xs text-primary hover:underline">
            {showHint ? "Hide hint" : "Show hint"}
          </button>
        )}
      </div>

      <div className="bg-card border border-border rounded-xl p-5 space-y-3">
        <p className="text-foreground leading-relaxed">
          {parts[0]}
          <span className={`inline-block min-w-[80px] px-2 py-0.5 mx-1 rounded border-b-2 font-semibold ${
            revealed ? (correct ? "border-green-500 text-green-700 dark:text-green-400" : "border-red-400 text-red-600") : "border-primary text-primary"
          }`}>
            {revealed ? item.answer : (guess || "______")}
          </span>
          {parts[1] ?? ""}
        </p>
        {showHint && item.hint && (
          <p className="text-xs text-muted-foreground italic">Hint: {item.hint}</p>
        )}
      </div>

      {!revealed ? (
        <input
          type="text"
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") check(); }}
          placeholder="Type your answer…"
          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          autoFocus
        />
      ) : (
        <div className={`rounded-xl p-3 text-sm ${correct ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300" : "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"}`}>
          {correct ? <><CheckCircle className="w-4 h-4 inline mr-1" />Correct!</> : <>The answer was <strong>{item.answer}</strong></>}
        </div>
      )}

      <div className="flex gap-3">
        {!revealed ? (
          <Button className="flex-1" onClick={check} disabled={!guess.trim()}>Check answer</Button>
        ) : (
          <Button className="flex-1 gap-2" onClick={next}>Next<ChevronRight className="w-4 h-4" /></Button>
        )}
      </div>
    </div>
  );
}

function MatchingView({ cards }: { cards: Flashcard[] }) {
  const PAIR_COUNT = Math.min(6, cards.length);

  type Pair = { id: number; front: string; back: string };
  const buildRound = useCallback((): { pairs: Pair[]; shuffledFronts: Pair[]; shuffledBacks: Pair[] } => {
    const shuffled = shuffle(cards).slice(0, PAIR_COUNT);
    const pairs = shuffled.map((c) => ({ id: c.id, front: c.front, back: c.back }));
    return {
      pairs,
      shuffledFronts: shuffle(pairs),
      shuffledBacks: shuffle(pairs),
    };
  }, [cards, PAIR_COUNT]);

  const [round, setRound] = useState(buildRound);
  const [selectedFront, setSelectedFront] = useState<number | null>(null);
  const [selectedBack, setSelectedBack] = useState<number | null>(null);
  const [matched, setMatched] = useState<Set<number>>(new Set());
  const [wrongFlash, setWrongFlash] = useState<{ front: number; back: number } | null>(null);

  useEffect(() => {
    if (selectedFront == null || selectedBack == null) return undefined;
    if (selectedFront === selectedBack) {
      setMatched((m) => new Set([...m, selectedFront]));
      setSelectedFront(null); setSelectedBack(null);
      return undefined;
    }
    setWrongFlash({ front: selectedFront, back: selectedBack });
    const t = setTimeout(() => {
      setWrongFlash(null);
      setSelectedFront(null);
      setSelectedBack(null);
    }, 600);
    return () => clearTimeout(t);
  }, [selectedFront, selectedBack]);

  const allMatched = matched.size === round.pairs.length && round.pairs.length > 0;

  function newRound() {
    setRound(buildRound());
    setSelectedFront(null); setSelectedBack(null); setMatched(new Set()); setWrongFlash(null);
  }

  if (cards.length === 0) return <p className="text-muted-foreground text-center py-8">Add some flashcards to play matching.</p>;

  function tileClass(id: number, side: "front" | "back") {
    if (matched.has(id)) return "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 opacity-60";
    const selected = side === "front" ? selectedFront === id : selectedBack === id;
    if (wrongFlash && ((side === "front" && wrongFlash.front === id) || (side === "back" && wrongFlash.back === id))) {
      return "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700";
    }
    if (selected) return "border-primary bg-primary/10 text-primary";
    return "border-border bg-card text-foreground hover:border-primary/40";
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Matched {matched.size} / {round.pairs.length}</span>
        <button onClick={newRound} className="flex items-center gap-1 text-xs text-primary hover:underline">
          <RotateCcw className="w-3 h-3" /> New round
        </button>
      </div>

      {allMatched ? (
        <div className="text-center py-8 space-y-3">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <p className="font-semibold text-foreground">All pairs matched!</p>
          <Button onClick={newRound} className="gap-2"><RotateCcw className="w-4 h-4" />Play again</Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            {round.shuffledFronts.map((p) => (
              <button
                key={`f-${p.id}`}
                disabled={matched.has(p.id)}
                onClick={() => setSelectedFront(p.id)}
                className={`w-full rounded-xl px-3 py-3 text-xs text-left border-2 transition-colors ${tileClass(p.id, "front")}`}
              >
                {p.front}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {round.shuffledBacks.map((p) => (
              <button
                key={`b-${p.id}`}
                disabled={matched.has(p.id)}
                onClick={() => setSelectedBack(p.id)}
                className={`w-full rounded-xl px-3 py-3 text-xs text-left border-2 transition-colors ${tileClass(p.id, "back")}`}
              >
                {p.back}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

type Rating = "again" | "hard" | "good" | "easy";
type ReviewState = { ease: number; intervalDays: number; due: number; reps: number };

function ReviewView({ deckId, cards }: { deckId: number; cards: Flashcard[] }) {
  const storageKey = `psychpro:srs:${deckId}`;
  const [progress, setProgress] = useState<Record<number, ReviewState>>({});
  const [flipped, setFlipped] = useState(false);
  const [sessionDone, setSessionDone] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setProgress(JSON.parse(raw));
    } catch { /* ignore */ }
  }, [storageKey]);

  function saveProgress(p: Record<number, ReviewState>) {
    setProgress(p);
    try { localStorage.setItem(storageKey, JSON.stringify(p)); } catch { /* ignore */ }
  }

  const now = Date.now();
  const due = cards.filter((c) => {
    const s = progress[c.id];
    return !s || s.due <= now;
  });

  const card = due[0];

  function rate(r: Rating) {
    if (!card) return;
    const prev = progress[card.id] ?? { ease: 2.5, intervalDays: 0, due: 0, reps: 0 };
    let { ease, intervalDays, reps } = prev;
    if (r === "again") {
      reps = 0;
      intervalDays = 0;
      ease = Math.max(1.3, ease - 0.2);
    } else {
      reps += 1;
      const factor = r === "hard" ? 1.2 : r === "good" ? ease : ease * 1.3;
      intervalDays = reps === 1 ? (r === "easy" ? 3 : 1) : Math.max(1, Math.round(intervalDays * factor));
      if (r === "hard") ease = Math.max(1.3, ease - 0.15);
      if (r === "easy") ease = ease + 0.15;
    }
    const dueAt = r === "again" ? now + 60_000 : now + intervalDays * 24 * 60 * 60 * 1000;
    const next = { ...progress, [card.id]: { ease, intervalDays, due: dueAt, reps } };
    saveProgress(next);
    setFlipped(false);
    if (due.length === 1) setSessionDone(true);
  }

  function resetProgress() {
    saveProgress({});
    setSessionDone(false);
  }

  if (cards.length === 0) return <p className="text-muted-foreground text-center py-8">No flashcards available.</p>;

  if (sessionDone || !card) {
    const nextDueMs = Object.values(progress).reduce<number | null>((acc, s) => acc === null || s.due < acc ? s.due : acc, null);
    const nextLabel = nextDueMs ? new Date(nextDueMs).toLocaleString() : "—";
    return (
      <div className="text-center py-10 space-y-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 mx-auto flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-foreground">No cards due right now.</p>
          <p className="text-xs text-muted-foreground mt-1">Next review: {nextLabel}</p>
        </div>
        <Button variant="outline" onClick={resetProgress} className="gap-2">
          <RotateCcw className="w-4 h-4" />Reset progress
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>{due.length} due</span>
        <span className="text-xs">Rep {(progress[card.id]?.reps ?? 0) + 1}</span>
      </div>

      <div
        className="cursor-pointer select-none rounded-2xl border-2 border-border bg-card p-6 text-center"
        style={{ minHeight: 200 }}
        onClick={() => setFlipped(!flipped)}
      >
        <div className="flex items-center justify-center" style={{ minHeight: 164 }}>
          <p className="text-foreground font-medium leading-relaxed">{flipped ? card.back : card.front}</p>
        </div>
      </div>

      {!flipped ? (
        <Button className="w-full gap-2" onClick={() => setFlipped(true)}>
          <RotateCcw className="w-4 h-4" />Show answer
        </Button>
      ) : (
        <div className="grid grid-cols-4 gap-2">
          <button onClick={() => rate("again")} className="py-2 rounded-lg text-xs font-medium border border-red-400 bg-red-50 dark:bg-red-900/20 text-red-700 hover:bg-red-100">Again</button>
          <button onClick={() => rate("hard")} className="py-2 rounded-lg text-xs font-medium border border-amber-400 bg-amber-50 dark:bg-amber-900/20 text-amber-700 hover:bg-amber-100">Hard</button>
          <button onClick={() => rate("good")} className="py-2 rounded-lg text-xs font-medium border border-blue-400 bg-blue-50 dark:bg-blue-900/20 text-blue-700 hover:bg-blue-100">Good</button>
          <button onClick={() => rate("easy")} className="py-2 rounded-lg text-xs font-medium border border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 hover:bg-green-100">Easy</button>
        </div>
      )}
    </div>
  );
}

function StudyGuideView({ content }: { content: string }) {
  if (!content) return <p className="text-muted-foreground text-center py-8">No study guide generated.</p>;
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}

export default function MyDeckDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
  const [clozeItems, setClozeItems] = useState<ClozeItem[]>([]);
  const [tab, setTab] = useState<Tab | null>(null);
  const [loading, setLoading] = useState(true);
  const baseTabs = deck?.tier === "pro" ? PRO_TABS : STANDARD_TABS;
  const selectedToolIds = deck?.tools && deck.tools.length > 0 ? deck.tools : null;
  const tabs = selectedToolIds
    ? baseTabs.filter((t) => selectedToolIds.includes(t.toolId))
    : baseTabs;
  const fallbackTab: Tab = tabs[0]?.id ?? (deck?.tier === "pro" ? "match" : "flashcards");
  const activeTab: Tab = tab ?? fallbackTab;

  useEffect(() => {
    if (!deck) return;
    if (tab && !tabs.some((t) => t.id === tab)) {
      setTab(tabs[0]?.id ?? null);
    }
  }, [deck, tab, tabs]);

  const loadDeck = useCallback(async () => {
    try {
      const headers = await authHeaders();
      const [deckRes, cardsRes, quizRes, clozeRes] = await Promise.all([
        fetch(`/api/custom-decks/${id}`, { headers }),
        fetch(`/api/custom-decks/${id}/flashcards`, { headers }),
        fetch(`/api/custom-decks/${id}/quiz`, { headers }),
        fetch(`/api/custom-decks/${id}/cloze`, { headers }),
      ]);
      if (deckRes.status === 404) { navigate("/my-decks"); return; }
      if (!deckRes.ok) throw new Error("Failed");
      setDeck(await deckRes.json());
      if (cardsRes.ok) setFlashcards(await cardsRes.json());
      if (quizRes.ok) setQuizQuestions(await quizRes.json());
      if (clozeRes.ok) setClozeItems(await clozeRes.json());
    } catch {
      toast.error("Failed to load deck");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadDeck(); }, [loadDeck]);

  if (loading) {
    return (
      <div className="min-h-full study-page-bg">
        <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8 space-y-4">
          <Skeleton className="h-10 w-48 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!deck) return null;

  if (deck.status !== "ready") {
    return (
      <div className="min-h-full study-page-bg">
        <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8 text-center py-16">
          <AlertCircle className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="font-semibold text-foreground mb-1">This deck is not ready yet.</p>
          <p className="text-sm text-muted-foreground mb-5">Status: {deck.status}</p>
          <Button variant="outline" onClick={() => navigate("/my-decks")}>Back to My Decks</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full study-page-bg" data-testid="my-decks-detail-page">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
      <button onClick={() => navigate("/my-decks")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ChevronLeft className="w-4 h-4" /> My Decks
      </button>

      <div className="mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{deck.title}</h1>
          {deck.tier === "pro" ? (
            <Badge className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200">Pro Tools</Badge>
          ) : (
            <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200">Standard Tools</Badge>
          )}
        </div>
        <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
          {deck.tier === "pro" ? (
            <>
              <span>{flashcards.length} cards</span>
              <span>·</span>
              <span>{clozeItems.length} fill-in items</span>
            </>
          ) : (
            <>
              <span>{flashcards.length} flashcards</span>
              <span>·</span>
              <span>{quizQuestions.length} quiz questions</span>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-1 bg-muted/60 rounded-xl p-1 mb-5 overflow-x-auto">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${activeTab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <t.icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      <div>
        {activeTab === "flashcards" && <FlashcardsView cards={flashcards} />}
        {activeTab === "quiz" && <QuizView questions={quizQuestions} />}
        {activeTab === "cloze" && <ClozeView items={clozeItems} />}
        {activeTab === "match" && <MatchingView cards={flashcards} />}
        {activeTab === "review" && <ReviewView deckId={deck.id} cards={flashcards} />}
        {activeTab === "study-guide" && <StudyGuideView content={deck.studyGuide ?? ""} />}
        {activeTab === "exam" && (
          <QuizView
            questions={quizQuestions}
            isExam
            examLength={deck.examQuestionCount ?? 15}
            timed={deck.examTimed ?? false}
          />
        )}
      </div>
      </div>
    </div>
  );
}
