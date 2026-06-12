import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { Clock, Timer, GraduationCap, Lock, BookOpen } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { useGetCourseMasteryExam, useRecordCourseMasteryAttempt } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { StudySurface } from "@/components/study/study-surface";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { PageTitle } from "@/components/brand/page-title";
import { isEpppTopic } from "@/lib/eppp-content";
import { epppDomainAnchor, epppMasteryExamPath, isEpppRoute } from "@/lib/eppp-routes";
import UpgradePrompt from "@/components/upgrade-prompt";

interface Props {
  params: { category: string };
}

export default function CourseMasteryExamPage({ params }: Props) {
  const [location, navigate] = useLocation();
  const category = decodeURIComponent(params.category);
  const inEppp = isEpppRoute(location);
  const backToCourseList = inEppp ? epppDomainAnchor(category) : "/topics";
  const courseListLabel = inEppp ? "Back to EPPP Domains" : "Back to Courses";

  const [started, setStarted] = useState(false);
  const [timed, setTimed] = useState(true);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: exam, isLoading, error } = useGetCourseMasteryExam(category);
  const recordAttempt = useRecordCourseMasteryAttempt();
  const fetchError = error as { status?: number } | null;

  useEffect(() => {
    if (!inEppp && isEpppTopic({ id: -1, name: category, category })) {
      navigate(epppMasteryExamPath(category));
    }
  }, [category, inEppp, navigate]);

  const questions = exam?.questions ?? [];
  const total = questions.length;
  const passingScore = exam?.passingScore ?? 90;
  // Total exam time budget in seconds. 0/null means untimed.
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
    const correct = qs.filter((q) => ans[q.id] === q.correctAnswer).length;
    const score = qs.length > 0 ? Math.round((correct / qs.length) * 100) : 0;
    if (qs.length > 0) {
      recordAttempt.mutate({
        data: { category, score, correct, total: qs.length },
      });
    }
    setSubmitted(true);
  };

  useEffect(() => {
    if (started && timed && examIsTimeable && !submitted) {
      setTimeLeft(examTimeLimitSec);
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
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
  }, [started, timed, submitted, examTimeLimitSec, examIsTimeable]);

  const handleSubmit = () => { submitRef.current(); };

  const handleAnswer = (qId: number, key: string) => {
    if (answers[qId]) return;
    setAnswers((prev) => ({ ...prev, [qId]: key }));
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const correct = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  const score = total > 0 ? Math.round((correct / total) * 100) : 0;

  // -------------------------------------------------------------------------
  // Paywall — Master/Scholar unlock the main-site mastery exam; EPPP mastery
  // exams require the separate EPPP Mastery Suite access. Server returns 402.
  // -------------------------------------------------------------------------
  if (fetchError?.status === 402) {
    return (
      <div className="min-h-full study-page-bg" data-testid="mastery-paywall">
        <UpgradePrompt
          reason={inEppp ? "eppp" : "generic"}
          onDismiss={() => navigate(backToCourseList)}
        />
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Locked — the server enforces the all-lessons-complete gate and returns 403.
  // -------------------------------------------------------------------------
  if (fetchError?.status === 403) {
    return (
      <div className="min-h-full study-page-bg" data-testid="mastery-locked">
        <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8 text-center">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4 border"
            style={{
              background: "linear-gradient(135deg, rgba(19, 115, 139, 0.9), rgba(12, 72, 87, 0.95))",
              borderColor: `${P.surf}55`,
            }}
          >
            <Lock className="w-6 h-6" style={{ color: P.surf }} />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Mastery exam locked</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Score 90% or higher on the practice exam for every lesson in {category} to unlock the Course Mastery Exam.
          </p>
          <Button onClick={() => navigate(backToCourseList)} data-testid="button-back-locked">
            {courseListLabel}
          </Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Not found / no questions.
  // -------------------------------------------------------------------------
  if (fetchError?.status === 404) {
    return (
      <div className="min-h-full study-page-bg" data-testid="mastery-notfound">
        <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8 text-center">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 border"
            style={{ background: `linear-gradient(135deg, ${P.tealDeep}, ${P.teal})`, borderColor: P.tealDeep }}
          >
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No mastery exam available</h2>
          <p className="text-sm text-muted-foreground mb-6">
            This course doesn't have a mastery exam set up yet. Please try again later.
          </p>
          <Button onClick={() => navigate(backToCourseList)} data-testid="button-back-notfound">
            {courseListLabel}
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-full study-page-bg">
        <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8 space-y-4">
          <Skeleton className="h-8 w-1/2 rounded-lg" />
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Results.
  // -------------------------------------------------------------------------
  if (submitted) {
    const passed = score >= passingScore;
    return (
      <div className="min-h-full study-page-bg" data-testid="mastery-results">
        <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
          <div className="text-center mb-8">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border"
              style={{
                background: passed ? `linear-gradient(135deg, #1f6070, ${P.tealDeep})` : "rgba(244,180,98,0.18)",
                borderColor: passed ? P.tealDeep : "rgba(244,180,98,0.55)",
                boxShadow: passed ? `0 18px 40px -18px ${P.tealDeep}cc` : "none",
              }}
            >
              <span className="text-3xl font-bold" style={{ color: passed ? "#FFFFFF" : "#B8453A" }}>{score}%</span>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-1">
              {passed ? "Course Mastered!" : "Not quite — keep going"}
            </h2>
            <p className="text-muted-foreground">
              {correct}/{total} correct · {passingScore}% needed to pass
            </p>
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
            <Button variant="outline" onClick={() => navigate(backToCourseList)} data-testid="button-back-to-courses">{courseListLabel}</Button>
            <Button
              onClick={() => {
                submittedRef.current = false;
                setSubmitted(false);
                setStarted(false);
                setAnswers({});
                setIndex(0);
                setTimeLeft(0);
              }}
              data-testid="button-retake"
            >
              Retake
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Empty (unlocked but no questions returned).
  // -------------------------------------------------------------------------
  if (started && total === 0) {
    return (
      <div className="min-h-full study-page-bg" data-testid="mastery-empty">
        <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8 text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">No questions available</h2>
          <Button onClick={() => navigate(backToCourseList)} className="mt-4">{courseListLabel}</Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Setup.
  // -------------------------------------------------------------------------
  if (!started) {
    const estMinutes = Math.max(1, Math.round((examTimeLimitSec || total * 60) / 60));
    return (
      <div className="min-h-full study-page-bg" data-testid="mastery-setup">
        <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8">
          <Breadcrumbs items={[
            { label: inEppp ? "EPPP Domains" : "Courses", href: backToCourseList },
            { label: category, href: backToCourseList },
            { label: "Mastery Exam" },
          ]} />
          <PageTitle
            title="Course Mastery Exam"
            icon={GraduationCap}
            subtitle={`${category} · Comprehensive Exam`}
            className="mb-8"
          />

          <div className="rounded-2xl border border-border bg-card p-5 mb-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold text-foreground">{total} Questions</span>
            </div>
            <ul className="space-y-1.5 text-sm text-white/70">
              <li>Drawn from every lesson in this course</li>
              <li>{passingScore}% required to pass</li>
              <li>{examIsTimeable ? `~${estMinutes} minutes when timed` : "Untimed"}</li>
            </ul>
          </div>

          <div className="mb-6">
            <StudySurface tone="light" innerClassName="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="timed-switch" className="text-base font-semibold text-foreground">Timed Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    {examIsTimeable ? "Race against the clock" : "This exam has no time limit"}
                  </p>
                </div>
                <Switch
                  id="timed-switch"
                  checked={timed && examIsTimeable}
                  onCheckedChange={setTimed}
                  disabled={!examIsTimeable}
                  data-testid="switch-timed"
                />
              </div>
            </StudySurface>
          </div>

          <Button
            size="lg"
            className="w-full"
            disabled={total === 0}
            onClick={() => setStarted(true)}
            data-testid="button-start-mastery"
          >
            {timed && examIsTimeable
              ? <><Timer className="w-4 h-4 mr-2" />Start Timed Mastery Exam</>
              : "Start Mastery Exam"}
          </Button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------------------
  // Question flow.
  // -------------------------------------------------------------------------
  const q = questions[index];

  return (
    <div className="min-h-full study-page-bg" data-testid="mastery-page">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: P.tealDeep }}>{index + 1}/{total}</span>
          {timed && examIsTimeable && (
            <div className={`flex items-center gap-1.5 text-sm font-semibold ${timeLeft < 60 ? "text-red-500" : "text-foreground"}`} data-testid="timer">
              <Clock className="w-4 h-4" />
              {formatTime(timeLeft)}
            </div>
          )}
        </div>

        <div className="w-full rounded-full h-1.5 mb-6 overflow-hidden" style={{ background: "rgba(47, 168, 198,0.12)" }}>
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: `${((index + 1) / total) * 100}%`,
              background: `linear-gradient(90deg, ${P.teal}, ${P.surf})`,
            }}
          />
        </div>

        <StudySurface tone="light" glow innerClassName="p-6 md:p-7 mb-6">
          <p className="text-base md:text-lg font-medium leading-relaxed text-white" data-testid="text-mastery-question">{q.question}</p>
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
            let cls = "w-full text-left px-4 py-3.5 rounded-md border text-sm transition-all flex items-center gap-3";
            if (!isAnswered) {
              cls += " hover:-translate-y-0.5 quiz-option-hover";
              style = {
                background: "linear-gradient(135deg, rgba(19, 115, 139, 0.78), rgba(12, 72, 87, 0.86))",
                borderColor: `${P.surf}55`,
                color: P.cloud,
                boxShadow: `0 8px 22px -12px ${P.teal}66, inset 0 1px 0 0 rgba(255,255,255,0.06)`,
              };
            } else if (isSelected) {
              cls += " text-white font-medium";
              style = {
                background: `linear-gradient(135deg, #1f6070, ${P.tealDeep})`,
                borderColor: P.tealDeep,
                boxShadow: `0 14px 32px -16px ${P.tealDeep}cc`,
              };
            } else {
              cls += " opacity-55";
              style = {
                background: "linear-gradient(135deg, rgba(19, 115, 139, 0.78), rgba(12, 72, 87, 0.86))",
                borderColor: `${P.surf}25`,
                color: `${P.cloud}aa`,
              };
            }
            return (
              <button
                key={key}
                onClick={() => handleAnswer(q.id, key)}
                disabled={isAnswered}
                data-testid={`mastery-option-${key}`}
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
                else setIndex((i) => i + 1);
              }}
              className="w-full"
              data-testid="button-next-mastery"
            >
              {index + 1 >= total ? "Submit Exam" : "Next Question"}
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => {
                setAnswers((prev) => ({ ...prev, [q.id]: "" }));
                if (index + 1 >= total) handleSubmit();
                else setIndex((i) => i + 1);
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
