import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeft, CheckCircle, XCircle, ChevronRight, BookOpen, Lightbulb } from "lucide-react";
import { useGetQuizzesByTopic, useUpdateTopicProgress, useIncrementUserUsage, useRecordQuizAttempt } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import UpgradePrompt from "@/components/upgrade-prompt";
import { StudySurface } from "@/components/study/study-surface";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

interface Props {
  params: { id: string };
}

export default function QuizPage({ params }: Props) {
  const [, navigate] = useLocation();
  const topicId = parseInt(params.id);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [reflection, setReflection] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const { data: questions, isLoading, error } = useGetQuizzesByTopic(topicId);
  const updateProgress = useUpdateTopicProgress();
  const incrementUsage = useIncrementUserUsage();
  const recordAttempt = useRecordQuizAttempt();

  const fetchError = error as { status?: number } | null;
  if (fetchError?.status === 402) {
    return <UpgradePrompt onDismiss={() => navigate(`/topics/${topicId}`)} />;
  }

  const current = questions?.[index];
  const total = questions?.length ?? 0;

  const options = current
    ? [
        { key: "A", text: current.optionA },
        { key: "B", text: current.optionB },
        { key: "C", text: current.optionC },
        { key: "D", text: current.optionD },
      ]
    : [];

  const handleSelect = async (key: string) => {
    if (selected) return;
    try {
      await incrementUsage.mutateAsync();
    } catch (err) {
      const e = err as { status?: number };
      if (e?.status === 402) {
        setShowUpgrade(true);
        return;
      }
    }
    setSelected(key);
    setShowExplanation(true);
    if (key === current?.correctAnswer) {
      setScore(s => s + 1);
    }
  };

  const handleNext = async () => {
    if (completed) return;
    if (index + 1 >= total) {
      setCompleted(true);
      const percent = total > 0 ? Math.round((score / total) * 100) : 0;
      try {
        await updateProgress.mutateAsync({ topicId, data: { score: percent } });
      } catch {
        // non-blocking
      }
      if (total > 0) {
        try {
          await recordAttempt.mutateAsync({ data: { topicId, score, total } });
        } catch {
          // non-blocking
        }
      }
    } else {
      setSelected(null);
      setShowExplanation(false);
      setReflection("");
      setReflectionSaved(false);
      setIndex(i => i + 1);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  if (showUpgrade) {
    return <UpgradePrompt onDismiss={() => setShowUpgrade(false)} />;
  }

  if (completed) {
    const percent = Math.round((score / total) * 100);
    const passed = percent >= 70;
    return (
      <div className="min-h-full study-page-bg" data-testid="quiz-complete">
        <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8 text-center">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border"
            style={{
              background: passed
                ? `linear-gradient(135deg, #1F4F66, ${P.tealDeep})`
                : "rgba(244,180,98,0.18)",
              borderColor: passed ? P.tealDeep : "rgba(244,180,98,0.55)",
              boxShadow: passed ? `0 18px 40px -18px ${P.tealDeep}cc` : "none",
            }}
          >
            <span className={cn("text-3xl font-bold", passed ? "text-white" : "text-amber-700")}>{percent}%</span>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Complete!</h2>
          <p className="text-muted-foreground mb-8">You scored {score} out of {total} questions.</p>
          <div className="flex gap-3 justify-center">
            <Button variant="outline" onClick={() => navigate(`/topics/${topicId}`)} data-testid="button-back-to-topic">
              Back to Topic
            </Button>
            <Button onClick={handleRestart} data-testid="button-retake">
              Retake Quiz
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full study-page-bg" data-testid="quiz-page">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(`/topics/${topicId}`)} className="text-muted-foreground hover:text-foreground" data-testid="button-back">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center border"
          style={{ background: `linear-gradient(135deg, ${P.teal}, ${P.surf})`, borderColor: P.tealDeep }}
        >
          <BookOpen className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Quiz</h1>
        </div>
        <span className="text-xs font-semibold tracking-wider uppercase" style={{ color: P.tealDeep }}>{index + 1}/{total}</span>
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

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-24 rounded-xl" />
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-14 rounded-xl" />)}
        </div>
      ) : !current ? (
        <div className="text-center py-16 text-muted-foreground">No questions for this topic.</div>
      ) : (
        <>
          <StudySurface
            tone="light"
            glow
            pill={{ text: "Question" }}
            innerClassName="p-6 md:p-7 mb-6"
            testId="quiz-question-card"
          >
            <p
              className="text-base md:text-lg font-medium leading-relaxed pr-20 text-white"
              data-testid="text-question"
            >
              {current.question}
            </p>
          </StudySurface>

          <div className="space-y-2.5 mb-6">
            {options.map(({ key, text }) => {
              const isSelected = selected === key;
              const isCorrect = key === current.correctAnswer;

              const baseClass = "w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all flex items-center gap-3";

              let style: React.CSSProperties = {};
              let cls = baseClass;

              if (!selected) {
                cls += " hover:-translate-y-0.5";
                style = {
                  background: `linear-gradient(135deg, ${P.surface}f2, ${P.bg}f2)`,
                  borderColor: `${P.surf}40`,
                  color: P.mist,
                  boxShadow: `0 6px 18px -10px ${P.teal}55`,
                };
              } else if (isCorrect) {
                cls += " text-white";
                style = {
                  background: `linear-gradient(135deg, #1F4F66, ${P.tealDeep})`,
                  borderColor: P.tealDeep,
                  boxShadow: `0 14px 32px -16px ${P.tealDeep}cc`,
                };
              } else if (isSelected && !isCorrect) {
                cls += " text-white";
                style = {
                  background: "linear-gradient(135deg, #9C3A30, #B8453A)",
                  borderColor: "#7A2C24",
                  boxShadow: "0 14px 32px -16px rgba(122,44,36,0.65)",
                };
              } else {
                cls += " opacity-55";
                style = {
                  background: `linear-gradient(135deg, ${P.surface}cc, ${P.bg}cc)`,
                  borderColor: `${P.surf}25`,
                  color: `${P.mist}aa`,
                };
              }

              return (
                <button
                  key={key}
                  onClick={() => handleSelect(key)}
                  disabled={!!selected}
                  data-testid={`option-${key}`}
                  className={cls}
                  style={style}
                >
                  <span
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 border",
                      !selected ? "" : "border-white/40",
                    )}
                    style={
                      !selected
                        ? { background: "rgba(189,229,255,0.55)", color: P.tealDeep, borderColor: `${P.surf}66` }
                        : isSelected || isCorrect
                          ? { background: "rgba(255,255,255,0.22)", color: "#FFFFFF" }
                          : { background: "rgba(189,229,255,0.35)", color: P.tealDeep, borderColor: `${P.surf}33` }
                    }
                  >
                    {key}
                  </span>
                  <span className="flex-1">{text}</span>
                  {selected && isCorrect && <CheckCircle className="w-4 h-4 text-white flex-shrink-0" />}
                  {selected && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-white flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <StudySurface
              tone="light"
              pill={{ text: "Why" }}
              innerClassName="p-4 md:p-5 mb-4"
              testId="explanation-box"
            >
              <p className="text-sm leading-relaxed pr-16" style={{ color: P.ink }}>{current.explanation}</p>
            </StudySurface>
          )}

          {showExplanation && selected && selected !== current.correctAnswer && (
            <div
              className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6"
              data-testid="reflect-prompt"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 uppercase tracking-wider">Reflect</p>
                <Link href="/study-lab">
                  <span className="ml-auto text-[11px] text-amber-700 dark:text-amber-400 hover:underline cursor-pointer">
                    Why this works →
                  </span>
                </Link>
              </div>
              <p className="text-xs text-amber-800/80 dark:text-amber-300/80 mb-2 leading-relaxed">
                Explain in one sentence why <span className="font-semibold">{current.correctAnswer}</span> was correct (and what tripped you up). Writing it out, even briefly, locks the correction into memory.
              </p>
              <textarea
                value={reflection}
                onChange={(e) => { setReflection(e.target.value); setReflectionSaved(false); }}
                placeholder="In your own words…"
                rows={2}
                className="w-full text-sm rounded-lg border border-amber-300/60 dark:border-amber-800/60 bg-white/60 dark:bg-background/40 px-3 py-2 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-amber-400/40 resize-none"
                data-testid="textarea-reflection"
              />
              <div className="flex items-center justify-between mt-2">
                <p className="text-[11px] text-muted-foreground">
                  Stays on this device — for your eyes only.
                </p>
                <button
                  type="button"
                  onClick={() => setReflectionSaved(true)}
                  disabled={reflection.trim().length === 0 || reflectionSaved}
                  className="text-xs font-medium px-2.5 py-1 rounded-md bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  data-testid="button-save-reflection"
                >
                  {reflectionSaved ? "Saved ✓" : "Lock it in"}
                </button>
              </div>
            </div>
          )}

          {selected && (
            <Button onClick={handleNext} className="w-full" data-testid="button-next">
              {index + 1 >= total ? "See Results" : "Next Question"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </>
      )}
      </div>
    </div>
  );
}
