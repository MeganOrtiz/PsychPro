import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, Clock, Timer, BookOpen, FileText } from "lucide-react";
import { useGetPracticeExamByTopic, useUpdateTopicProgress, useIncrementUserUsage } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import UpgradePrompt from "@/components/upgrade-prompt";

interface Props {
  params: { id: string };
}

type QuestionCount = 25 | 50;

export default function PracticeExamPage({ params }: Props) {
  const [, navigate] = useLocation();
  const topicId = parseInt(params.id);
  const [questionCount, setQuestionCount] = useState<QuestionCount | null>(null);
  const [started, setStarted] = useState(false);
  const [timed, setTimed] = useState(true);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: exam, isLoading, error } = useGetPracticeExamByTopic(topicId, questionCount ?? undefined);
  const updateProgress = useUpdateTopicProgress();
  const incrementUsage = useIncrementUserUsage();

  const fetchError = error as { status?: number } | null;

  const questions = exam?.questions ?? [];
  const total = questions.length;
  const TIME_PER_QUESTION = 90;

  const answersRef = useRef<Record<number, string>>({});
  const questionsRef = useRef(questions);
  answersRef.current = answers;
  questionsRef.current = questions;

  const submitRef = useRef<() => void>(() => {});
  submitRef.current = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    const qs = questionsRef.current;
    const ans = answersRef.current;
    const correct = qs.filter(q => ans[q.id] === q.correctAnswer).length;
    const score = qs.length > 0 ? Math.round((correct / qs.length) * 100) : 0;
    updateProgress.mutate({ topicId, data: { score } });
    setSubmitted(true);
  };

  useEffect(() => {
    if (started && timed && !submitted) {
      setTimeLeft(total * TIME_PER_QUESTION);
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            submitRef.current();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, timed, submitted, total]);

  const handleSubmit = () => { submitRef.current(); };

  const handleAnswer = async (qId: number, key: string) => {
    if (answers[qId]) return;
    try {
      await incrementUsage.mutateAsync();
    } catch (err) {
      const e = err as { status?: number };
      if (e?.status === 402) { setShowUpgrade(true); return; }
    }
    setAnswers(prev => ({ ...prev, [qId]: key }));
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;

  if (fetchError?.status === 402 || showUpgrade) {
    return <UpgradePrompt onDismiss={() => {
      if (showUpgrade) setShowUpgrade(false);
      else navigate(`/topics/${topicId}`);
    }} />;
  }

  if (submitted) {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto" data-testid="exam-results">
        <div className="text-center mb-8">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 ${score >= 70 ? "bg-green-100 dark:bg-green-900/30" : "bg-amber-100 dark:bg-amber-900/30"}`}>
            <span className="text-3xl font-bold text-foreground">{score}%</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Exam Complete</h2>
          <p className="text-muted-foreground">{correct}/{total} correct</p>
        </div>
        <div className="space-y-4 mb-8">
          {questions.map((q, i) => {
            const yourAnswer = answers[q.id];
            const isCorrect = yourAnswer === q.correctAnswer;
            return (
              <div key={q.id} className={`rounded-xl border p-4 ${isCorrect ? "border-green-300 bg-green-50 dark:bg-green-950/20" : "border-red-300 bg-red-50 dark:bg-red-950/20"}`}>
                <p className="text-sm font-medium text-foreground mb-2">{i + 1}. {q.question}</p>
                <p className="text-xs text-muted-foreground">Your answer: {yourAnswer || "Not answered"} | Correct: {q.correctAnswer}</p>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">{q.explanation}</p>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/topics/${topicId}`)} data-testid="button-back-to-topic">Back to Topic</Button>
          <Button onClick={() => { setSubmitted(false); setStarted(false); setAnswers({}); setIndex(0); setQuestionCount(null); }} data-testid="button-retake">Retake</Button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="p-4 md:p-6 max-w-lg mx-auto" data-testid="exam-setup">
        <button onClick={() => navigate(`/topics/${topicId}`)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <h1 className="text-2xl font-bold text-foreground mb-2">Practice Exam</h1>
        <p className="text-muted-foreground mb-8">Choose your exam length to get started</p>

        {/* Question count selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {([25, 50] as QuestionCount[]).map(n => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              data-testid={`button-count-${n}`}
              className={cn(
                "rounded-xl border p-5 text-left transition-all",
                questionCount === n
                  ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                  : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
              )}
            >
              <div className="flex items-center gap-2.5 mb-2">
                {n === 25 ? <BookOpen className="w-5 h-5 text-primary" /> : <FileText className="w-5 h-5 text-primary" />}
                <span className="text-xl font-bold text-foreground">{n} Questions</span>
              </div>
              <p className="text-xs text-muted-foreground">
                {n === 25 ? "Standard exam • ~37 minutes" : "Full exam • ~75 minutes"}
              </p>
            </button>
          ))}
        </div>

        {isLoading && questionCount !== null ? (
          <Skeleton className="h-32 rounded-xl mt-4" />
        ) : (
          <>
            {questionCount !== null && (
              <div className="bg-card border border-border rounded-xl p-5 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="timed-switch" className="text-base font-semibold text-foreground">Timed Mode</Label>
                    <p className="text-sm text-muted-foreground">Race against the clock</p>
                  </div>
                  <Switch id="timed-switch" checked={timed} onCheckedChange={setTimed} data-testid="switch-timed" />
                </div>
              </div>
            )}
            <Button
              size="lg"
              className="w-full"
              disabled={questionCount === null}
              onClick={() => setStarted(true)}
              data-testid="button-start-exam"
            >
              {questionCount === null
                ? "Select exam length above"
                : timed
                ? <><Timer className="w-4 h-4 mr-2" />Start {questionCount}-Question Timed Exam</>
                : `Start ${questionCount}-Question Exam`}
            </Button>
          </>
        )}
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto" data-testid="exam-page">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-muted-foreground">{index + 1}/{total}</span>
        {timed && (
          <div className={`flex items-center gap-1.5 text-sm font-semibold ${timeLeft < 60 ? "text-red-500" : "text-foreground"}`} data-testid="timer">
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        )}
      </div>

      <div className="w-full bg-muted rounded-full h-1.5 mb-6">
        <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <div className="bg-card border border-border rounded-xl p-5 mb-6">
        <p className="font-medium text-foreground leading-relaxed" data-testid="text-exam-question">{q.question}</p>
      </div>

      <div className="space-y-3 mb-6">
        {[
          { key: "A", text: q.optionA },
          { key: "B", text: q.optionB },
          { key: "C", text: q.optionC },
          { key: "D", text: q.optionD },
        ].map(({ key, text }) => (
          <button
            key={key}
            onClick={() => handleAnswer(q.id, key)}
            disabled={!!answers[q.id]}
            data-testid={`exam-option-${key}`}
            className={cn(
              "w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all flex items-center gap-3",
              !answers[q.id]
                ? "border-border bg-card hover:border-primary/40 hover:bg-muted/50 text-foreground"
                : answers[q.id] === key
                ? "border-primary/60 bg-primary/10 text-primary font-medium"
                : "border-border bg-card text-muted-foreground opacity-60"
            )}
          >
            <span className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0",
              answers[q.id] === key ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
            )}>{key}</span>
            {text}
          </button>
        ))}
      </div>

      <div className="flex justify-between">
        {answers[q.id] ? (
          <Button
            onClick={() => {
              if (index + 1 >= total) handleSubmit();
              else setIndex(i => i + 1);
            }}
            className="w-full"
            data-testid="button-next-exam"
          >
            {index + 1 >= total ? "Submit Exam" : "Next Question"}
          </Button>
        ) : (
          <Button
            variant="outline"
            onClick={async () => {
              try { await incrementUsage.mutateAsync(); } catch (err) {
                const e = err as { status?: number };
                if (e?.status === 402) { setShowUpgrade(true); return; }
              }
              setAnswers(prev => ({ ...prev, [q.id]: "" }));
              if (index + 1 >= total) handleSubmit();
              else setIndex(i => i + 1);
            }}
            className="ml-auto"
            data-testid="button-skip"
          >
            Skip
          </Button>
        )}
      </div>
    </div>
  );
}
