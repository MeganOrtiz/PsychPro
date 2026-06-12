import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { CheckCircle, XCircle, ChevronRight, BookOpen, Lightbulb } from "lucide-react";
import { useGetQuizzesByTopic, useUpdateTopicProgress, useRecordQuizAttempt, useGetTopic } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import UpgradePrompt from "@/components/upgrade-prompt";
import { StudySurface } from "@/components/study/study-surface";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { PageTitle } from "@/components/brand/page-title";
import { loadReflectionText, saveReflection } from "@/lib/reflections";
import { epppTopicPath, isEpppRoute } from "@/lib/eppp-routes";
import { isEpppTopic } from "@/lib/eppp-content";

interface Props {
  params: { id: string };
}

export default function QuizPage({ params }: Props) {
  const [location, navigate] = useLocation();
  const topicId = parseInt(params.id);
  const inEppp = isEpppRoute(location);
  const backToTopic = inEppp ? epppTopicPath(topicId) : `/topics/${topicId}`;
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [reflection, setReflection] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);
  // IDs of questions answered incorrectly this run — sent with the attempt so
  // the EPPP "Missed Questions" tab can surface them for review.
  const missedIdsRef = useRef<number[]>([]);

  const { data: questions, isLoading, error } = useGetQuizzesByTopic(topicId);
  const { data: topic } = useGetTopic(topicId);

  useEffect(() => {
    if (!inEppp && topic && isEpppTopic(topic)) {
      navigate(`${epppTopicPath(topicId)}/quiz`);
    }
  }, [inEppp, navigate, topic, topicId]);

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
  const recordAttempt = useRecordQuizAttempt();
  const queryClient = useQueryClient();

  const fetchError = error as { status?: number } | null;
  if (fetchError?.status === 402) {
    return <UpgradePrompt onDismiss={() => navigate(backToTopic)} />;
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

  // Free-tier gating happens on the topic detail page (useTopicAccessGate).
  // Inside an allowed topic, answering is unmetered.
  const handleSelect = (key: string) => {
    if (selected) return;
    setSelected(key);
    setShowExplanation(true);
    if (key === current?.correctAnswer) {
      setScore(s => s + 1);
    } else if (current) {
      missedIdsRef.current.push(current.id);
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
          await recordAttempt.mutateAsync({ data: { topicId, score, total, missedQuestionIds: missedIdsRef.current } });
        } catch {
          // non-blocking — server still enforces the cap on the next attempt
        }
        // Free-tier caps key off lifetime attempt counts. Invalidate so
        // the next render reflects the new lock immediately (otherwise a
        // Retake within the 30s entitlements cache would bypass the cap
        // until the cache expires).
        queryClient.invalidateQueries({ queryKey: ["entitlements"] });
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
    missedIdsRef.current = [];
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
                ? `linear-gradient(135deg, #1f6070, ${P.tealDeep})`
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
            <Button variant="outline" onClick={() => navigate(backToTopic)} data-testid="button-back-to-topic">
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
      <Breadcrumbs items={[
        { label: inEppp ? "EPPP Domains" : "Topics", href: inEppp ? "/eppp/suite/domains" : "/topics" },
        { label: topic?.name ?? "Topic", href: backToTopic },
        { label: "Quiz" },
      ]} />
      <PageTitle
        title="Quiz"
        icon={BookOpen}
        subtitle={`Question ${index + 1} of ${total}`}
      />

      {inEppp ? (
        <p
          className="mx-auto max-w-md text-center text-xs font-light leading-relaxed -mt-3 mb-6"
          style={{ color: `${P.mist}cc`, letterSpacing: "0.02em" }}
          data-testid="quiz-eppp-note"
        >
          Quiz questions are randomized and pulled from a bank of 30 total
          questions for each lesson for variability in learning over time.
        </p>
      ) : null}

      <div className="w-full rounded-full h-1.5 mb-6 overflow-hidden" style={{ background: "rgba(47, 168, 198,0.12)" }}>
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
            innerClassName="p-6 md:p-7 mb-6"
            testId="quiz-question-card"
          >
            <p
              className="text-base md:text-lg font-medium leading-relaxed text-white"
              data-testid="text-question"
            >
              {current.question}
            </p>
          </StudySurface>

          <div className="space-y-2.5 mb-6">
            {options.map(({ key, text }) => {
              const isSelected = selected === key;
              const isCorrect = key === current.correctAnswer;

              const baseClass = "w-full text-left px-4 py-3.5 rounded-md border text-sm transition-all flex items-center gap-3";

              let style: React.CSSProperties = {};
              let cls = baseClass;

              if (!selected) {
                // Cerulean glow on hover — `quiz-option-hover` class is
                // defined in index.css and ramps up the box-shadow + adds
                // a subtle border-color shift on :hover.
                // Lightened deep-cerulean glass so the option pills match the
                // Study Mode tiles and rail buttons elsewhere in the app
                // (instead of the previous near-white card).
                cls += " hover:-translate-y-0.5 quiz-option-hover";
                style = {
                  background:
                    "linear-gradient(135deg, rgba(12, 84, 102, 0.78), rgba(8, 49, 59, 0.86))",
                  borderColor: `${P.surf}55`,
                  color: P.cloud,
                  boxShadow: `0 8px 22px -12px ${P.teal}66, inset 0 1px 0 0 rgba(255,255,255,0.06)`,
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
                  background:
                    "linear-gradient(135deg, rgba(12, 84, 102, 0.78), rgba(8, 49, 59, 0.86))",
                  borderColor: `${P.surf}25`,
                  color: `${P.cloud}aa`,
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
                        ? { background: "rgba(118,228,247,0.20)", color: P.surf, borderColor: `${P.surf}88` }
                        : isSelected || isCorrect
                          ? { background: "rgba(255,255,255,0.22)", color: "#FFFFFF" }
                          : { background: "rgba(118,228,247,0.14)", color: P.surf, borderColor: `${P.surf}55` }
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
              <p className="text-sm leading-relaxed pr-16 font-medium" style={{ color: "#FFFFFF" }}>{current.explanation}</p>
            </StudySurface>
          )}

          {showExplanation && selected && selected !== current.correctAnswer && (
            <div
              className="rounded-xl p-4 mb-6 border"
              style={{
                background:
                  "radial-gradient(125% 80% at 50% 0%, rgba(118,228,247,0.12) 0%, rgba(118,228,247,0.00) 58%), linear-gradient(145deg, rgba(12, 72, 87, 0.79), rgba(7, 52, 63, 0.90))",
                borderColor: "rgba(118,228,247,0.24)",
                backdropFilter: "blur(18px) saturate(135%)",
                WebkitBackdropFilter: "blur(18px) saturate(135%)",
                boxShadow:
                  "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 42px -22px rgba(118,228,247,0.45), 0 0 30px -10px rgba(118,228,247,0.34), 0 20px 46px -26px rgba(0,0,0,0.66)",
              }}
              data-testid="reflect-prompt"
            >
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4" style={{ color: `${P.mist}cc` }} />
                <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: P.mist }}>Reflect</p>
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
                  <Link href={inEppp ? "/eppp/suite/missed-questions" : "/reflections"}>
                    <span
                      className="underline cursor-pointer hover:text-white"
                      style={{ color: `${P.mist}cc` }}
                      data-testid="link-my-tools-reflections"
                    >
                      {inEppp ? "Missed Questions" : "My Tools → Reflections"}
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
