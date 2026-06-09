import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeft, Clock, Timer, BookOpen, FileText, GraduationCap, Beaker, Lightbulb, Brain, ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { useGetPracticeExamByTopic, useGetTopic, useUpdateTopicProgress, useRecordExamAttempt } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
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
import { PageTitle } from "@/components/brand/page-title";
import { epppTopicPath, isEpppRoute } from "@/lib/eppp-routes";

interface Props {
  params: { id: string };
}

type QuestionCount = 25 | 50;

// B-5: when a topic has fewer linked questions than the requested count,
// the server quietly clamps. To avoid the bait-and-switch we surface the
// real cap here and hide options that would be silently downgraded.
const QUESTION_COUNT_OPTIONS: QuestionCount[] = [25, 50];

export default function PracticeExamPage({ params }: Props) {
  const [location, navigate] = useLocation();
  const topicId = parseInt(params.id);
  const inEppp = isEpppRoute(location);
  const backToTopic = inEppp ? epppTopicPath(topicId) : `/topics/${topicId}`;
  const [questionCount, setQuestionCount] = useState<QuestionCount | null>(null);
  const [started, setStarted] = useState(false);
  const [timed, setTimed] = useState(true);
  // B-13: warm-up is off by default. Users opt in when they want it.
  const [warmupEnabled, setWarmupEnabled] = useState(false);
  const [warmupActive, setWarmupActive] = useState(false);
  const [warmupText, setWarmupText] = useState("");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // B-5 (real fix): send the picked count to the server so the user
  // actually receives the number they selected. Before this fix the
  // picker was cosmetic — the server always returned its default. We
  // default to 25 before the user picks so the prefetch still hydrates.
  const requestedCount = questionCount ?? 25;
  const { data: exam, isLoading, error } = useGetPracticeExamByTopic(
    topicId,
    { count: requestedCount },
  );
  const { data: topic } = useGetTopic(topicId);
  const updateProgress = useUpdateTopicProgress();
  const recordAttempt = useRecordExamAttempt();
  const queryClient = useQueryClient();

  const fetchError = error as { status?: number } | null;

  const questions = exam?.questions ?? [];
  const total = questions.length;
  // Total exam time budget in seconds (the `practice_exams.time_limit` column
  // is the whole-exam budget, not per-question — DB default is 600s = 10
  // minutes). Treat 0 or null as untimed so future seeds that opt out of
  // timing keep working.
  const examTimeLimitSec = exam?.timeLimit && exam.timeLimit > 0 ? exam.timeLimit : 0;
  const examIsTimeable = examTimeLimitSec > 0;

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
      recordAttempt.mutate(
        { data: { topicId, score: correct, total: qs.length } },
        {
          // Free-tier caps key off lifetime attempt counts. Invalidate so
          // the next render reflects the new lock immediately (otherwise
          // the user could Retake within the 30s entitlements cache).
          onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["entitlements"] });
          },
        },
      );
    }
    setSubmitted(true);
  };

  useEffect(() => {
    if (started && !warmupActive && timed && examIsTimeable && !submitted) {
      setTimeLeft(examTimeLimitSec);
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
  }, [started, warmupActive, timed, submitted, total, examTimeLimitSec, examIsTimeable]);

  const handleSubmit = () => { submitRef.current(); };

  // Free-tier gating happens on the topic detail page (useTopicAccessGate).
  // Inside an allowed topic, answering is unmetered.
  const handleAnswer = (qId: number, key: string) => {
    if (answers[qId]) return;
    setAnswers(prev => ({ ...prev, [qId]: key }));
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const correct = questions.filter(q => answers[q.id] === q.correctAnswer).length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;

  if (fetchError?.status === 402 || showUpgrade) {
    return <UpgradePrompt reason="exam" onDismiss={() => {
      if (showUpgrade) setShowUpgrade(false);
      else navigate(backToTopic);
    }} />;
  }

  // B-5: examQuestionCount is the actual number of questions linked to this
  // topic's practice exam. If the user can't pick 50 truthfully, the 50
  // option is hidden and the existing 25 is auto-clamped to whatever is
  // available (still ≥ 1).
  const examAvailable = topic?.examQuestionCount ?? Infinity;
  const availableCounts = QUESTION_COUNT_OPTIONS.filter((n) => n <= examAvailable);

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
          <Button onClick={() => navigate(backToTopic)} data-testid="button-back-empty">
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
            <span className="text-3xl font-bold" style={{ color: passed ? "#FFFFFF" : "#B8453A" }}>{score}%</span>
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
                className="rounded-xl border p-4 bg-card"
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
          <Button variant="outline" onClick={() => navigate(backToTopic)} data-testid="button-back-to-topic">Back to Topic</Button>
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
        <Breadcrumbs items={[
          { label: inEppp ? "EPPP Domains" : "Topics", href: inEppp ? "/eppp/suite/domains" : "/topics" },
          { label: topic?.name ?? "Topic", href: backToTopic },
          { label: "Practice Exam" },
        ]} />
        <PageTitle
          title="Practice Exam"
          icon={GraduationCap}
          subtitle="Choose your exam length to get started"
          className="mb-8"
        />

        {/* Question count selector — only counts the topic can actually
            satisfy are rendered (see B-5 note above). If the topic has fewer
            than 25 linked questions, we show a single "max available" tile. */}
        <div className={`grid gap-3 mb-6 ${availableCounts.length === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
          {availableCounts.length === 0 && examAvailable > 0 && (
            <button
              onClick={() => setQuestionCount(Math.min(25, examAvailable) as QuestionCount)}
              data-testid={`button-count-${examAvailable}`}
              className="rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5 bg-card"
              style={{
                borderColor: `${P.surf}55`,
                boxShadow: `0 8px 22px -12px ${P.teal}66`,
              }}
            >
              <div className="flex items-center gap-2.5 mb-2">
                <BookOpen className="w-5 h-5" style={{ color: P.surf }} />
                <span className="text-xl font-bold" style={{ color: P.cloud }}>{examAvailable} Questions</span>
              </div>
              <p className="text-xs" style={{ color: `${P.mist}cc` }}>
                All available exam questions for this topic
              </p>
            </button>
          )}
          {availableCounts.map(n => {
            const isSelected = questionCount === n;
            return (
              <button
                key={n}
                onClick={() => setQuestionCount(n)}
                data-testid={`button-count-${n}`}
                className="rounded-xl border p-5 text-left transition-all hover:-translate-y-0.5 bg-card"
                style={
                  isSelected
                    ? {
                        borderColor: P.surf,
                        boxShadow: `0 0 0 2px ${P.surf}55, 0 14px 32px -14px ${P.teal}99`,
                      }
                    : {
                        borderColor: `${P.surf}55`,
                        boxShadow: `0 8px 22px -12px ${P.teal}66`,
                      }
                }
              >
                <div className="flex items-center gap-2.5 mb-2">
                  {n === 25
                    ? <BookOpen className="w-5 h-5" style={{ color: P.surf }} />
                    : <FileText className="w-5 h-5" style={{ color: P.surf }} />}
                  <span className="text-xl font-bold" style={{ color: P.cloud }}>{n} Questions</span>
                </div>
                <p className="text-xs" style={{ color: `${P.mist}cc` }}>
                  {n === 25 ? "Standard exam • ~37 minutes" : "Full exam • ~75 minutes"}
                </p>
              </button>
            );
          })}
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
                      <p className="text-sm text-muted-foreground">
                        {examIsTimeable ? "Race against the clock" : "This exam has no time limit"}
                      </p>
                    </div>
                    {/* B-3: toggle is disabled (and visually muted) when the
                        underlying exam has no time limit, so users can't pick
                        a setting that has no effect. */}
                    <Switch
                      id="timed-switch"
                      checked={timed && examIsTimeable}
                      onCheckedChange={setTimed}
                      disabled={!examIsTimeable}
                      data-testid="switch-timed"
                    />
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
          {/* Warm-up panel — recolored from amber/orange to the site's
              cerulean / teal palette so it sits in the same visual family as
              the rest of the study UI. Subtitle uses a high-contrast color
              token instead of muted-on-cream, which was unreadable. */}
          <section
            className="rounded-2xl border p-6 shadow-sm"
            style={{
              borderColor: `${P.surf}55`,
              background: `linear-gradient(135deg, ${P.surface}, ${P.bg})`,
              boxShadow: `0 18px 40px -18px ${P.tealDeep}cc`,
            }}
          >
            <header className="flex items-start gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: `rgba(94,176,200,0.18)`, border: `1px solid ${P.surf}55` }}
              >
                <Brain className="w-5 h-5" style={{ color: P.surf }} />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-semibold text-white">Warm up your recall</h2>
                <p className="text-xs text-white/80 italic">
                  A 60-second brain-dump before a test reliably raises your score — even when you don't peek at notes.
                </p>
              </div>
              <Link href={inEppp ? "/eppp/suite/study-plan" : "/study-lab"}>
                <span
                  className="text-[11px] hover:underline cursor-pointer whitespace-nowrap"
                  style={{ color: P.surf }}
                >
                  Why →
                </span>
              </Link>
            </header>
            <p className="text-base font-medium mb-4 leading-relaxed text-white">
              List everything you remember about <span className="font-semibold">{topic?.name ?? "this topic"}</span> — key terms, definitions, mechanisms, examples. Don't worry about being neat.
            </p>
            <Textarea
              value={warmupText}
              onChange={(e) => setWarmupText(e.target.value)}
              placeholder="Start typing whatever comes to mind…"
              rows={8}
              className="mb-3 resize-y text-white placeholder:text-white/40"
              style={{
                background: `${P.bg}cc`,
                borderColor: `${P.surf}55`,
                // @ts-expect-error CSS custom property for focus ring color
                "--tw-ring-color": `${P.surf}66`,
              }}
              data-testid="warmup-textarea"
              autoFocus
            />
            <div className="flex flex-wrap items-center gap-3 justify-between">
              <span className="text-xs text-white/70">
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
                  className="text-white/80 hover:text-white hover:bg-white/10"
                >
                  Skip
                </Button>
                <Button
                  onClick={() => { setWarmupActive(false); setWarmupText(""); }}
                  disabled={!ready}
                  className="text-white"
                  style={{
                    background: `linear-gradient(135deg, ${P.tealDeep}, ${P.teal})`,
                    boxShadow: `0 14px 32px -16px ${P.tealDeep}cc`,
                  }}
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
          {timed && examIsTimeable && (
            <div className={`flex items-center gap-1.5 text-sm font-semibold mr-2 ${timeLeft < 60 ? "text-red-500" : "text-foreground"}`} data-testid="timer">
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          )}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate(inEppp ? "/eppp/suite/study-plan" : "/study-lab")}
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
        <p className="text-base md:text-lg font-medium leading-relaxed pr-20 text-white" data-testid="text-exam-question">{q.question}</p>
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
          let cls = "w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all flex items-center gap-3";
          if (!isAnswered) {
            // Match the quiz's cerulean glass option (index.css quiz-option-hover
            // ramps the glow + border on :hover).
            cls += " hover:-translate-y-0.5 quiz-option-hover";
            style = {
              background:
                "linear-gradient(135deg, rgba(10,45,61,0.78), rgba(2,13,18,0.86))",
              borderColor: `${P.surf}55`,
              color: P.cloud,
              boxShadow: `0 8px 22px -12px ${P.teal}66, inset 0 1px 0 0 rgba(255,255,255,0.06)`,
            };
          } else if (isSelected) {
            cls += " text-white font-medium";
            style = {
              background: `linear-gradient(135deg, #1F4F66, ${P.tealDeep})`,
              borderColor: P.tealDeep,
              boxShadow: `0 14px 32px -16px ${P.tealDeep}cc`,
            };
          } else {
            cls += " opacity-55";
            style = {
              background:
                "linear-gradient(135deg, rgba(10,45,61,0.78), rgba(2,13,18,0.86))",
              borderColor: `${P.surf}25`,
              color: `${P.cloud}aa`,
            };
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
                    ? { background: "rgba(118,228,247,0.20)", color: P.surf, borderColor: `${P.surf}88` }
                    : isSelected
                      ? { background: "rgba(255,255,255,0.22)", color: "#FFFFFF", borderColor: "rgba(255,255,255,0.4)" }
                      : { background: "rgba(118,228,247,0.14)", color: P.surf, borderColor: `${P.surf}55` }
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
            onClick={() => {
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
