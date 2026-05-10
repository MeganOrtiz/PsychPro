import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ChevronLeft, CheckCircle, XCircle, ChevronRight, BookOpen, Lightbulb } from "lucide-react";
import { useGetQuizzesByTopic, useUpdateTopicProgress, useIncrementUserUsage, useRecordQuizAttempt } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import UpgradePrompt from "@/components/upgrade-prompt";
import { StudySurface } from "@/components/study/study-surface";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { loadReflectionText, saveReflection } from "@/lib/reflections";

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

  // Persist reflections per-question to localStorage so they survive
  // moving between questions, finishing the quiz, and full page reloads.
  // The Reflections page in My Tools reads from the same store.
  const currentQuestion = questions?.[index];
  useEffect(() => {
    if (!currentQuestion) return;
    const stored = loadReflectionText(topicId, currentQuestion.id);
    setReflection(stored);
    setReflectionSaved(stored.trim().length > 0);
  }, [topicId, currentQuestion?.id]);
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
      // Reflection state is reloaded by the useEffect on question change,
      // so we don't wipe it here — that lets a saved reflection re-appear
      // if the user navigates back via restart later.
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
                // Cerulean glow on hover — `quiz-option-hover` class is
                // defined in index.css and ramps up the box-shadow + adds
                // a subtle border-color shift on :hover.
                cls += " hover:-translate-y-0.5 quiz-option-hover";
                style = {
                  background: `linear-gradient(135deg, ${P.surface}f2, ${P.bg}f2)`,
                  borderColor: `${P.surf}40`,
                  color: P.mist,
                  boxShadow: `0 6px 18px -10px ${P.teal}55`,
                };
              } else if (isCorrect) {
                // Correct answer turns emerald green, mirroring the red
                // we use for an incorrect selection.
                cls += " text-white";
                style = {
                  background: "linear-gradient(135deg, #1E7A4E, #2BA866)",
                  borderColor: "#1E7A4E",
                  boxShadow: "0 14px 32px -16px rgba(43,168,102,0.7)",
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
              className="rounded-xl p-4 mb-6 border"
              style={{
                background: `linear-gradient(135deg, ${P.surface}f0, ${P.bg}f0)`,
                borderColor: `${P.surf}33`,
              }}
              data-testid="reflect-prompt"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4" style={{ color: `${P.mist}cc` }} />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: P.mist }}>Reflect</p>
                <Link href="/study-lab">
                  <span className="ml-auto text-[11px] hover:underline cursor-pointer" style={{ color: `${P.mist}99` }}>
                    Why this works →
                  </span>
                </Link>
              </div>
              <p className="text-xs mb-2 leading-relaxed" style={{ color: `${P.mist}cc` }}>
                Explain in one sentence why <span className="font-semibold" style={{ color: P.mist }}>{current.correctAnswer}</span> was correct (and what tripped you up). Writing it out, even briefly, locks the correction into memory.
              </p>
              <textarea
                value={reflection}
                onChange={(e) => {
                  setReflection(e.target.value);
                  setReflectionSaved(false);
                }}
                placeholder="In your own words…"
                rows={2}
                className="w-full text-sm rounded-lg border px-3 py-2 placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 resize-none"
                style={{
                  background: `${P.bg}cc`,
                  borderColor: `${P.surf}33`,
                  color: P.mist,
                  // @ts-expect-error CSS custom property for ring color
                  "--tw-ring-color": `${P.surf}55`,
                }}
                data-testid="textarea-reflection"
              />
              <div className="flex items-center justify-between mt-2 gap-3">
                <p className="text-[11px]" style={{ color: `${P.mist}77` }}>
                  Saved to this device. Review anytime in{" "}
                  <Link href="/reflections">
                    <span
                      className="underline cursor-pointer hover:text-white"
                      style={{ color: `${P.mist}cc` }}
                      data-testid="link-my-tools-reflections"
                    >
                      My Tools → Reflections
                    </span>
                  </Link>
                  .
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (!currentQuestion) return;
                    const correctText =
                      options.find((o) => o.key === current.correctAnswer)?.text ?? "";
                    const selectedText =
                      options.find((o) => o.key === selected)?.text ?? "";
                    saveReflection({
                      text: reflection,
                      topicId,
                      questionId: currentQuestion.id,
                      questionText: current.question,
                      correctAnswer: current.correctAnswer,
                      correctText,
                      selectedAnswer: selected ?? "",
                      selectedText,
                      savedAt: new Date().toISOString(),
                    });
                    setReflectionSaved(true);
                  }}
                  disabled={reflection.trim().length === 0 || reflectionSaved}
                  className="text-xs font-medium px-2.5 py-1 rounded-md text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  style={{
                    background: reflectionSaved
                      ? `linear-gradient(135deg, ${P.surf}55, ${P.surf}33)`
                      : `linear-gradient(135deg, ${P.tealDeep}, ${P.teal})`,
                  }}
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
