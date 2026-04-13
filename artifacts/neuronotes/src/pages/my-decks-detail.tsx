import { useState, useEffect, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { BookMarked, Layers, FileText, GraduationCap, ChevronLeft, ChevronRight, RotateCcw, CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";

type Deck = { id: number; title: string; studyGuide: string | null; status: string };
type Flashcard = { id: number; front: string; back: string; difficulty: string; cardOrder: number };
type QuizQuestion = { id: number; question: string; optionA: string; optionB: string; optionC: string; optionD: string; correctAnswer: string; explanation: string | null; questionOrder: number };

type Tab = "flashcards" | "quiz" | "study-guide" | "exam";

const TAB_CONFIG: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "quiz", label: "Quiz", icon: BookMarked },
  { id: "study-guide", label: "Study Guide", icon: FileText },
  { id: "exam", label: "Practice Exam", icon: GraduationCap },
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
        <DifficultyBadge difficulty={card.difficulty} />
      </div>
      <div
        className="relative w-full cursor-pointer select-none"
        style={{ minHeight: 200 }}
        onClick={() => setFlipped(!flipped)}
      >
        <div className={`w-full rounded-2xl border-2 p-6 text-center transition-all duration-300 ${flipped ? "border-primary bg-primary/5" : "border-border bg-card"}`} style={{ minHeight: 200 }}>
          <div className="flex flex-col items-center justify-center h-full gap-3" style={{ minHeight: 164 }}>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{flipped ? "Answer" : "Question"}</p>
            <p className="text-foreground font-medium text-base leading-relaxed">{flipped ? card.back : card.front}</p>
            <p className="text-xs text-muted-foreground mt-2">{flipped ? "Tap to flip back" : "Tap to reveal answer"}</p>
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

function QuizView({ questions, isExam }: { questions: QuizQuestion[]; isExam?: boolean }) {
  const examQuestions = isExam ? questions.slice(0, 15) : questions;
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [index, setIndex] = useState(0);

  const q = examQuestions[index];
  const score = submitted ? examQuestions.filter((q) => answers[q.id] === q.correctAnswer).length : 0;

  const OPTIONS: [string, string][] = q ? [["A", q.optionA], ["B", q.optionB], ["C", q.optionC], ["D", q.optionD]] : [];

  function reset() { setAnswers({}); setSubmitted(false); setIndex(0); }

  if (!q) return <p className="text-muted-foreground text-center py-8">No questions generated.</p>;

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
        {!isExam && <span className="text-xs">{Object.keys(answers).length} answered</span>}
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
  const [tab, setTab] = useState<Tab>("flashcards");
  const [loading, setLoading] = useState(true);

  const loadDeck = useCallback(async () => {
    try {
      const [deckRes, cardsRes, quizRes] = await Promise.all([
        fetch(`/api/custom-decks/${id}`),
        fetch(`/api/custom-decks/${id}/flashcards`),
        fetch(`/api/custom-decks/${id}/quiz`),
      ]);
      if (deckRes.status === 404) { navigate("/my-decks"); return; }
      if (!deckRes.ok) throw new Error("Failed");
      setDeck(await deckRes.json());
      if (cardsRes.ok) setFlashcards(await cardsRes.json());
      if (quizRes.ok) setQuizQuestions(await quizRes.json());
    } catch {
      toast.error("Failed to load deck");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadDeck(); }, [loadDeck]);

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4">
        <Skeleton className="h-8 w-48 rounded-xl" />
        <Skeleton className="h-12 rounded-xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (!deck) return null;

  if (deck.status !== "ready") {
    return (
      <div className="p-6 max-w-lg mx-auto text-center py-16">
        <AlertCircle className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-40" />
        <p className="font-semibold text-foreground mb-1">This deck is not ready yet.</p>
        <p className="text-sm text-muted-foreground mb-5">Status: {deck.status}</p>
        <Button variant="outline" onClick={() => navigate("/my-decks")}>Back to My Decks</Button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <button onClick={() => navigate("/my-decks")} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
        <ChevronLeft className="w-4 h-4" /> My Decks
      </button>

      <div className="mb-5">
        <h1 className="text-2xl font-bold text-foreground">{deck.title}</h1>
        <div className="flex gap-3 mt-1 text-sm text-muted-foreground">
          <span>{flashcards.length} flashcards</span>
          <span>·</span>
          <span>{quizQuestions.length} quiz questions</span>
        </div>
      </div>

      <div className="flex gap-1 bg-muted/60 rounded-xl p-1 mb-5 overflow-x-auto">
        {TAB_CONFIG.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${tab === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
          >
            <t.icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.label.split(" ")[0]}</span>
          </button>
        ))}
      </div>

      <div>
        {tab === "flashcards" && <FlashcardsView cards={flashcards} />}
        {tab === "quiz" && <QuizView questions={quizQuestions} />}
        {tab === "study-guide" && <StudyGuideView content={deck.studyGuide ?? ""} />}
        {tab === "exam" && <QuizView questions={quizQuestions} isExam />}
      </div>
    </div>
  );
}
