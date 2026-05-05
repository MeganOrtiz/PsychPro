import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeft, Clock, Timer, BookOpen, FileText, GraduationCap, Beaker, Lightbulb, Brain, ArrowRight } from "lucide-react";
import { useGetPracticeExamByTopic, useGetTopic, useUpdateTopicProgress, useIncrementUserUsage, useRecordExamAttempt } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import UpgradePrompt from "@/components/upgrade-prompt";
import ElaborationPanel from "@/components/learning/elaboration-panel";
import { StudySurface } from "@/components/study/study-surface";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

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
  const [warmupEnabled, setWarmupEnabled] = useState(true);
  const [warmupActive, setWarmupActive] = useState(false);
  const [warmupText, setWarmupText] = useState("");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: exam, isLoading, error } = useGetPracticeExamByTopic(topicId, questionCount ?? undefined);
  const { data: topic } = useGetTopic(topicId);
  const updateProgress = useUpdateTopicProgress();
  const incrementUsage = useIncrementUserUsage();
  const recordAttempt = useRecordExamAttempt();

  const fetchError = error as { status?: number } | null;

  const questions = exam?.questions ?? [];
  const total = questions.length;
  const TIME_PER_QUESTION = 90;

  const answersRef = useRef<Record<number, string>>({});
  const questionsRef = useRef(questions);
  answersRef.current = answers;
  questionsRef.current = questions;

  const submittedRef = useRef(false);
  const submitRef = useRef<() => void>(() => {});
  submitRef.current = () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);
    const qs = questionsRef.current;
    const ans = answersRef.current;
    const correct = qs.filter(q => ans[q.id] === q.correctAnswer).length;
    const score = qs.length > 0 ? Math.round((correct / qs.length) * 100) : 0;
    updateProgress.mutate({ topicId, data: { score } });
    if (qs.length > 0) {
      recordAttempt.mutate({ data: { topicId, score: correct, total: qs.length } });
    }
    setSubmitted(true);
  };

  useEffect(() => {
    if (started && !warmupActive && timed && !submitted) {
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
  }, [started, warmupActive, timed, submitted, total]);

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

  if (started && !isLoading && total === 0) {
    return (
      <div className="min-h-full study-page-bg" data-testid="exam-empty">
        <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border"
            style={{ background: `linear-gradient(135deg, ${P.tealDeep}, ${P.teal})`, borderColor: P.tealDeep }}
          >
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No exam questions available</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This topic doesn't have a practice exam set up yet. Please try again later or pick another topic.
          </p>
          <Button onClick={() => navigate(`/topics/${topicId}`)} data-testid="button-back-empty">
            Back to Topic
          </Button>
        </div>
      </div>
    );
  }

  if (submitted) {
    const passed = score >= 70;
    return (
      <div className="min-h-full study-page-bg" data-testid="exam-results">
        <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="text-center mb-8">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border"
            style={{
              background: passed ? `linear-gradient(135deg, #1F4F66, ${P.tealDeep})` : "rgba(244,180,98,0.18)",
              borderColor: passed ? P.tealDeep : "rgba(244,180,98,0.55)",
              boxShadow: passed ? `0 18px 40px -18px ${P.tealDeep}cc` : "none",
            }}
          >
            <span className={cn("text-3xl font-bold", passed ? "text-white" : "text-amber-700")}>{score}%</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Exam Complete</h2>
          <p className="text-muted-foreground">{correct}/{total} correct</p>
        </div>
        <div className="space-y-3 mb-8">
          {questions.map((q, i) => {
            const yourAnswer = answers[q.id];
            const isCorrect = yourAnswer === q.correctAnswer;
            return (
              <div
                key={q.id}
                className="rounded-xl border p-4 bg-white"
                style={{
                  borderColor: isCorrect ? `${P.surf}66` : "rgba(224,114,96,0.45)",
                  boxShadow: isCorrect
                    ? `0 6px 16px -10px ${P.teal}55`
                    : "0 6px 16px -10px rgba(224,114,96,0.55)",
                }}
              >
                <div className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-bold flex-shrink-0"
                    style={
                      isCorrect
                        ? { background: P.teal, color: "#FFFFFF" }
                        : { background: "rgba(224,114,96,0.85)", color: "#FFFFFF" }
                    }
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground mb-1.5">{q.question}</p>
                    <p className="text-xs text-muted-foreground">
                      Your answer: <span className="font-semibold text-foreground">{yourAnswer || "—"}</span> · Correct: <span className="font-semibold" style={{ color: P.tealDeep }}>{q.correctAnswer}</span>
                    </p>
                    <p className="text-xs leading-relaxed mt-1.5" style={{ color: P.inkSoft }}>{q.explanation}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/topics/${topicId}`)} data-testid="button-back-to-topic">Back to Topic</Button>
          <Button onClick={() => { submittedRef.current = false; setSubmitted(false); setStarted(false); setAnswers({}); setIndex(0); setQuestionCount(null); setWarmupActive(false); setWarmupText(""); setTimeLeft(0); }} data-testid="button-retake">Retake</Button>
        </div>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-full study-page-bg" data-testid="exam-setup">
        <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8">
        <button onClick={() => navigate(`/topics/${topicId}`)} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ChevronLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center border"
            style={{ background: `linear-gradient(135deg, #1F4F66, ${P.tealDeep})`, borderColor: P.tealDeep }}
          >
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Practice Exam</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-8">Choose your exam length to get started</p>

        {/* Question count selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {([25, 50] as QuestionCount[]).map(n => (
            <button
              key={n}
              onClick={() => setQuestionCount(n)}
              data-testid={`button-count-${n}`}
              className="rounded-xl border p-5 text-left transition-all bg-white hover:-translate-y-0.5"
              style={
                questionCount === n
                  ? {
                      borderColor: P.teal,
                      boxShadow: `0 0 0 3px rgba(47,160,198,0.18), 0 14px 32px -16px ${P.teal}88`,
                      background: `linear-gradient(180deg, #FFFFFF, ${P.paperSoft})`,
                    }
                  : {
                      borderColor: `${P.surf}55`,
                      boxShadow: `0 6px 18px -10px ${P.teal}44`,
                    }
              }
            >
              <div className="flex items-center gap-2.5 mb-2">
                {n === 25
                  ? <BookOpen className="w-5 h-5" style={{ color: P.tealDeep }} />
                  : <FileText className="w-5 h-5" style={{ color: P.tealDeep }} />}
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
              <div className="space-y-3 mb-6">
                <StudySurface tone="light" innerClassName="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="timed-switch" className="text-base font-semibold text-foreground">Timed Mode</Label>
                      <p className="text-sm text-muted-foreground">Race against the clock</p>
                    </div>
                    <Switch id="timed-switch" checked={timed} onCheckedChange={setTimed} data-testid="switch-timed" />
                  </div>
                </StudySurface>
                <StudySurface tone="light" innerClassName="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0 pr-3">
                      <Label htmlFor="warmup-switch" className="text-base font-semibold text-foreground flex items-center gap-1.5">
                        <Brain className="w-4 h-4" style={{ color: P.teal }} />
                        Active Recall warm-up
                      </Label>
                      <p className="text-sm text-muted-foreground">Brain-dump before you start (~60 seconds, recommended)</p>
                    </div>
                    <Switch id="warmup-switch" checked={warmupEnabled} onCheckedChange={setWarmupEnabled} data-testid="switch-warmup" />
                  </div>
                </StudySurface>
              </div>
            )}
            <Button
              size="lg"
              className="w-full"
              disabled={questionCount === null}
              onClick={() => {
                if (warmupEnabled) setWarmupActive(true);
                setStarted(true);
              }}
              data-testid="button-start-exam"
            >
              {questionCount === null
                ? "Select exam length above"
                : warmupEnabled
                ? <><Brain className="w-4 h-4 mr-2" />Begin with warm-up</>
                : timed
                ? <><Timer className="w-4 h-4 mr-2" />Start {questionCount}-Question Timed Exam</>
                : `Start ${questionCount}-Question Exam`}
            </Button>
          </>
        )}
        </div>
      </div>
    );
  }

  if (warmupActive) {
    const wordCount = warmupText.trim().split(/\s+/).filter(Boolean).length;
    const ready = wordCount >= 10;
    return (
      <div className="min-h-full study-page-bg" data-testid="exam-warmup">
        <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
          <button onClick={() => { setWarmupActive(false); setStarted(false); }} className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to setup
          </button>
          <section className="rounded-2xl border border-amber-200/60 dark:border-amber-900/40 bg-gradient-to-br from-amber-50/80 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/10 p-6 shadow-sm">
            <header className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center shrink-0">
                <Brain className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-foreground">Warm up your recall</h2>
                <p className="text-xs text-muted-foreground italic">
                  A 60-second brain-dump before a test reliably raises your score — even when you don't peek at notes.
                </p>
              </div>
              <Link href="/study-lab">
                <span className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline cursor-pointer whitespace-nowrap">
                  Why →
                </span>
              </Link>
            </header>
            <p className="text-base font-medium text-foreground mb-4 leading-relaxed">
              List everything you remember about <span className="font-semibold">{topic?.name ?? "this topic"}</span> — key terms, definitions, mechanisms, examples. Don't worry about being neat.
            </p>
            <Textarea
              value={warmupText}
              onChange={(e) => setWarmupText(e.target.value)}
              placeholder="Start typing whatever comes to mind…"
              rows={8}
              className="bg-background/80 border-amber-200 dark:border-amber-900/40 focus-visible:ring-amber-400/40 mb-3 resize-y"
              data-testid="warmup-textarea"
              autoFocus
            />
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <span className="text-xs text-muted-foreground">
                {wordCount === 0
                  ? "Aim for at least 10 words to prime your memory."
                  : `${wordCount} word${wordCount === 1 ? "" : "s"} ${ready ? "— nice." : "— keep going."}`}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setWarmupActive(false); setWarmupText(""); }}
                  data-testid="button-skip-warmup"
                >
                  Skip
                </Button>
                <Button
                  onClick={() => { setWarmupActive(false); setWarmupText(""); }}
                  disabled={!ready}
                  className="bg-amber-500 hover:bg-amber-600 text-white"
                  data-testid="button-begin-exam"
                >
                  Begin Exam
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="min-h-full study-page-bg" data-testid="exam-page">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: P.tealDeep }}>{index + 1}/{total}</span>
        <div className="flex items-center gap-1">
          {timed && (
            <div className={`flex items-center gap-1.5 text-sm font-semibold mr-2 ${timeLeft < 60 ? "text-red-500" : "text-foreground"}`} data-testid="timer">
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate("/study-lab")}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-accent transition-colors"
                data-testid="button-study-lab"
                aria-label="Open Study Lab"
              >
                <Beaker className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Open Study Lab</p>
            </TooltipContent>
          </Tooltip>
          <Sheet>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-foreground p-1.5 rounded-md hover:bg-accent transition-colors"
                    data-testid="button-reflect"
                    aria-label="Open reflection panel"
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Reflect — elaboration prompts</p>
              </TooltipContent>
            </Tooltip>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader className="mb-4">
                <SheetTitle>Reflect on this question</SheetTitle>
                <SheetDescription>
                  A quick elaboration prompt to deepen processing. Notes save to this device.
                </SheetDescription>
              </SheetHeader>
              <ElaborationPanel
                storageKey={`exam-topic-${topicId}`}
                context={q ? `Q${index + 1}: ${q.question}` : undefined}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <div className="w-full rounded-full h-1.5 mb-6 overflow-hidden" style={{ background: "rgba(47,160,198,0.12)" }}>
        <div
          className="h-1.5 rounded-full transition-all"
          style={{
            width: `${((index + 1) / total) * 100}%`,
            background: `linear-gradient(90deg, ${P.teal}, ${P.surf})`,
          }}
        />
      </div>

      <StudySurface tone="light" glow pill={{ text: "Question" }} innerClassName="p-6 md:p-7 mb-6">
        <p className="text-base md:text-lg font-medium leading-relaxed pr-20" style={{ color: P.ink }} data-testid="text-exam-question">{q.question}</p>
      </StudySurface>

      <div className="space-y-2.5 mb-6">
        {[
          { key: "A", text: q.optionA },
          { key: "B", text: q.optionB },
          { key: "C", text: q.optionC },
          { key: "D", text: q.optionD },
        ].map(({ key, text }) => {
          const isSelected = answers[q.id] === key;
          const isAnswered = !!answers[q.id];
          let style: React.CSSProperties = {};
          let cls = "w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all flex items-center gap-3 bg-white";
          if (!isAnswered) {
            cls += " text-foreground hover:-translate-y-0.5";
            style = { borderColor: `${P.surf}55`, boxShadow: `0 6px 18px -10px ${P.teal}55` };
          } else if (isSelected) {
            cls += " text-white font-medium";
            style = {
              background: `linear-gradient(135deg, #1F4F66, ${P.tealDeep})`,
              borderColor: P.tealDeep,
              boxShadow: `0 14px 32px -16px ${P.tealDeep}cc`,
            };
          } else {
            cls += " text-muted-foreground opacity-65";
            style = { borderColor: `${P.surf}33` };
          }
          return (
            <button
              key={key}
              onClick={() => handleAnswer(q.id, key)}
              disabled={isAnswered}
              data-testid={`exam-option-${key}`}
              className={cls}
              style={style}
            >
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border"
                style={
                  !isAnswered
                    ? { background: "rgba(189,229,255,0.55)", color: P.tealDeep, borderColor: `${P.surf}66` }
                    : isSelected
                      ? { background: "rgba(255,255,255,0.22)", color: "#FFFFFF", borderColor: "rgba(255,255,255,0.4)" }
                      : { background: "rgba(189,229,255,0.35)", color: P.tealDeep, borderColor: `${P.surf}33` }
                }
              >{key}</span>
              {text}
            </button>
          );
        })}
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
    </div>
  );
}
