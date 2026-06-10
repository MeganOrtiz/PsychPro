import { useCallback, useMemo, useState } from "react";
import { STUDY_PALETTE as PALETTE } from "@/lib/study-theme";
import {
  Check,
  X,
  MousePointerClick,
  HelpCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  Compass,
} from "lucide-react";

// A single quizzable region: a structure pinned to a specific section view at
// known image-relative coordinates. Built in brain-lab from HOTSPOTS so the
// quiz always uses spots that sit on real anatomy.
export type QuizItem = {
  id: string;
  name: string;
  shortName: string;
  viewKey: string; // groups items that share a diagram (for distractors / find targets)
  viewSrc: string;
  viewName: string;
  x: number;
  y: number;
  blurb?: string; // one-line function, shown on reveal so the quiz teaches
};

type QType = "identify" | "find";

type Question = {
  item: QuizItem;
  type: QType;
  options: QuizItem[]; // identify: 4 choices incl. correct. find: all targets on the view.
};

const ROUND_SIZE = 8;

// Same grayscale normalization the Sections diagram uses, so quiz diagrams look
// congruent with the rest of Brain Lab regardless of source image.
const IMG_FILTER = `grayscale(1) contrast(1.05) brightness(1.03) drop-shadow(0 24px 60px ${PALETTE.bg}) drop-shadow(0 0 40px ${PALETTE.teal}55)`;

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Build a fresh round: pick distinct structures, assign a question type, and
// prepare the options each type needs. "find" needs ≥3 sibling targets on the
// same view to be a fair click test — otherwise it falls back to "identify".
function buildRound(items: QuizItem[]): Question[] {
  const byView = new Map<string, QuizItem[]>();
  for (const it of items) {
    const list = byView.get(it.viewKey);
    if (list) list.push(it);
    else byView.set(it.viewKey, [it]);
  }

  const picks = shuffle(items).slice(0, Math.min(ROUND_SIZE, items.length));

  return picks.map((item, idx) => {
    const siblings = byView.get(item.viewKey) ?? [item];
    // Alternate the leading type for variety, then validate feasibility.
    let type: QType = idx % 2 === 0 ? "identify" : "find";
    if (type === "find" && siblings.length < 3) type = "identify";

    if (type === "find") {
      return { item, type, options: siblings };
    }

    // identify: 1 correct + up to 3 distractors, preferring same-view siblings
    // (more plausible) then filling from the global pool.
    const sameView = shuffle(siblings.filter((s) => s.id !== item.id));
    const others = shuffle(items.filter((s) => s.id !== item.id && s.viewKey !== item.viewKey));
    const distractors = [...sameView, ...others].slice(0, 3);
    const options = shuffle([item, ...distractors]);
    return { item, type, options };
  });
}

// ---------------------------------------------------------------------------
// useBrainQuiz — owns all round/score/answer state. Lifted into a hook so the
// quiz can be rendered SPLIT across two panes: the diagram lives in the brain
// canvas (left) while the prompt + answers live in the detail box (right). Both
// halves read/drive the same controller.
// ---------------------------------------------------------------------------
export type BrainQuizController = {
  round: Question[];
  q: Question | undefined;
  idx: number;
  score: number;
  picked: string | null;
  done: boolean;
  answered: boolean;
  isLast: boolean;
  correctChosen: boolean;
  answer: (chosenId: string) => void;
  next: () => void;
  restart: () => void;
};

export function useBrainQuiz(items: QuizItem[]): BrainQuizController {
  const [roundKey, setRoundKey] = useState(0);
  const round = useMemo(() => buildRound(items), [items, roundKey]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  // null = unanswered. For identify: the picked option id. For find: clicked id.
  const [picked, setPicked] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const q = round[idx];
  const answered = picked !== null;
  const isLast = idx >= round.length - 1;
  const correctChosen = answered && q != null && picked === q.item.id;

  const restart = useCallback(() => {
    setRoundKey((k) => k + 1);
    setIdx(0);
    setScore(0);
    setPicked(null);
    setDone(false);
  }, []);

  const answer = useCallback(
    (chosenId: string) => {
      if (picked !== null || !q) return;
      setPicked(chosenId);
      if (chosenId === q.item.id) setScore((s) => s + 1);
    },
    [picked, q],
  );

  const next = useCallback(() => {
    if (isLast) {
      setDone(true);
      return;
    }
    setIdx((i) => i + 1);
    setPicked(null);
  }, [isLast]);

  return { round, q, idx, score, picked, done, answered, isLast, correctChosen, answer, next, restart };
}

// Marker drawn over the diagram image. Variants change with quiz state so the
// learner gets clear right/wrong/reveal feedback in the cerulean theme.
function QuizMarker({
  x,
  y,
  variant,
  label,
  onClick,
}: {
  x: number;
  y: number;
  variant: "target" | "option" | "correct" | "wrong" | "muted";
  label?: string;
  onClick?: () => void;
}) {
  const styles: Record<typeof variant, { bg: string; ring: string; size: number; pulse: boolean }> = {
    // The spot to identify (question mark stays generic so it's not a giveaway)
    target: { bg: PALETTE.surf, ring: `${PALETTE.surf}`, size: 20, pulse: true },
    // A clickable blank target during "find"
    option: { bg: `${PALETTE.surf}cc`, ring: "#ffffff", size: 16, pulse: false },
    correct: { bg: "#34D399", ring: "#ffffff", size: 20, pulse: true },
    wrong: { bg: "#F87171", ring: "#ffffff", size: 18, pulse: false },
    muted: { bg: `${PALETTE.steel}`, ring: `${PALETTE.steel}`, size: 12, pulse: false },
  } as const;
  const s = styles[variant];
  const interactive = !!onClick;

  const Tag = (interactive ? "button" : "span") as "button" | "span";
  return (
    <Tag
      {...(interactive ? { type: "button" as const, onClick } : {})}
      className="absolute z-10 flex items-center justify-center outline-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: 40,
        height: 40,
        transform: "translate(-50%, -50%)",
        cursor: interactive ? "pointer" : "default",
        background: "transparent",
        border: "none",
        padding: 0,
      }}
      aria-label={label}
    >
      {s.pulse && (
        <span
          className="absolute left-1/2 top-1/2 rounded-full animate-ping"
          style={{
            width: s.size + 10,
            height: s.size + 10,
            marginLeft: -(s.size + 10) / 2,
            marginTop: -(s.size + 10) / 2,
            background: `${s.bg}66`,
          }}
        />
      )}
      <span
        className="block rounded-full transition-transform duration-150"
        style={{
          width: s.size,
          height: s.size,
          background: s.bg,
          border: `2px solid ${s.ring}`,
          boxShadow: `0 0 0 3px ${PALETTE.bg}aa, 0 0 14px 3px ${s.bg}`,
        }}
      >
        {variant === "correct" && (
          <Check className="w-3 h-3 mx-auto" style={{ color: "#06281d", marginTop: 1 }} strokeWidth={3} />
        )}
        {variant === "wrong" && (
          <X className="w-3 h-3 mx-auto" style={{ color: "#3a0d0d", marginTop: 1 }} strokeWidth={3} />
        )}
      </span>
      {label && (variant === "correct" || variant === "wrong") && (
        <span
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[11px] font-semibold"
          style={{
            [x > 58 ? "right" : "left"]: "calc(100% + 8px)",
            background: `${PALETTE.surfaceElev}f2`,
            color: "#fff",
            border: `1px solid ${variant === "correct" ? "#34D399" : "#F87171"}cc`,
          }}
        >
          {label}
        </span>
      )}
    </Tag>
  );
}

// ---------------------------------------------------------------------------
// BrainQuizDiagram — the LEFT half: the section image with quiz markers. For
// "find" questions the markers are the answer (clicking one calls answer); for
// "identify" the single target pulses and the choices live in the panel.
// ---------------------------------------------------------------------------
export function BrainQuizDiagram({
  controller,
  isMobile,
}: {
  controller: BrainQuizController;
  isMobile?: boolean;
}) {
  const { q, answered, picked, done, answer } = controller;

  if (done) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-3 p-6 text-center">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`,
            boxShadow: `0 0 40px -8px ${PALETTE.surf}`,
          }}
        >
          <Trophy className="w-7 h-7" style={{ color: PALETTE.bg }} />
        </div>
        <p className="text-sm font-semibold text-white">Round complete</p>
        <p className="text-xs" style={{ color: `${PALETTE.mist}99` }}>
          Your score is in the panel.
        </p>
      </div>
    );
  }

  if (!q) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center gap-3 p-6 text-center">
        <HelpCircle className="w-8 h-8" style={{ color: PALETTE.surf }} />
        <p className="text-sm font-semibold text-white">Quiz unavailable</p>
        <p className="text-xs" style={{ color: `${PALETTE.mist}99` }}>
          No quizzable regions are loaded yet.
        </p>
      </div>
    );
  }

  return (
    <div className="h-full w-full flex items-center justify-center p-3 md:p-4" data-testid="brain-quiz-diagram">
      <div className="relative max-h-full max-w-full">
        <img
          src={q.item.viewSrc}
          alt={q.item.viewName}
          className="block max-h-full max-w-full object-contain select-none"
          draggable={false}
          style={{ filter: IMG_FILTER, maxHeight: isMobile ? "38vh" : "100%" }}
          data-testid="quiz-diagram"
        />

        {/* IDENTIFY: show only the target marker */}
        {q.type === "identify" && (
          <QuizMarker
            x={q.item.x}
            y={q.item.y}
            variant={answered ? "correct" : "target"}
            label={answered ? q.item.name : undefined}
          />
        )}

        {/* FIND: show all sibling targets as clickable blanks */}
        {q.type === "find" &&
          q.options.map((opt) => {
            let variant: "option" | "correct" | "wrong" | "muted" = "option";
            let label: string | undefined;
            if (answered) {
              if (opt.id === q.item.id) {
                variant = "correct";
                label = q.item.name;
              } else if (opt.id === picked) {
                variant = "wrong";
                label = opt.name;
              } else {
                variant = "muted";
              }
            }
            return (
              <QuizMarker
                key={opt.id}
                x={opt.x}
                y={opt.y}
                variant={variant}
                label={label}
                onClick={answered ? undefined : () => answer(opt.id)}
              />
            );
          })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// BrainQuizPanel — the RIGHT half (the detail box): progress, the prompt, the
// identify choices, the teaching reveal, and the feedback + Next control. Wraps
// itself in the same surface as the "Pick a structure" empty state so it reads
// as the same box.
// ---------------------------------------------------------------------------
function PanelSurface({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="rounded-2xl border h-full flex flex-col overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${PALETTE.surface}, ${PALETTE.bg})`,
        borderColor: `${PALETTE.steel}99`,
      }}
      data-testid="brain-quiz"
    >
      {children}
    </div>
  );
}

export function BrainQuizPanel({
  controller,
  onExit,
}: {
  controller: BrainQuizController;
  onExit?: () => void;
}) {
  const { round, q, idx, score, picked, done, answered, isLast, correctChosen, answer, next, restart } = controller;

  if (!q && !done) {
    return (
      <PanelSurface>
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <HelpCircle className="w-8 h-8" style={{ color: PALETTE.surf }} />
          <p className="text-sm font-semibold text-white">Quiz unavailable</p>
          <p className="text-xs" style={{ color: `${PALETTE.mist}99` }}>
            No quizzable regions are loaded yet.
          </p>
        </div>
      </PanelSurface>
    );
  }

  if (done) {
    const pct = Math.round((score / round.length) * 100);
    const msg =
      pct >= 90
        ? "Outstanding recall."
        : pct >= 70
          ? "Strong work — keep going."
          : pct >= 40
            ? "Good start. Run it again to lock it in."
            : "Review the Sections, then try again.";
    return (
      <PanelSurface>
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-6 text-center" data-testid="quiz-done">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`,
              boxShadow: `0 0 40px -6px ${PALETTE.surf}`,
            }}
          >
            <Trophy className="w-9 h-9" style={{ color: PALETTE.bg }} />
          </div>
          <div>
            <p className="text-3xl font-light text-white" data-testid="quiz-score">
              {score}
              <span style={{ color: `${PALETTE.mist}99` }}> / {round.length}</span>
            </p>
            <p className="text-sm mt-1" style={{ color: PALETTE.surf }}>
              {pct}% correct
            </p>
            <p className="text-xs mt-2 max-w-xs" style={{ color: `${PALETTE.mist}aa` }}>
              {msg}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={restart}
              className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2"
              style={{ background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})`, color: PALETTE.bg }}
              data-testid="button-quiz-restart"
            >
              <RotateCcw className="w-4 h-4" />
              New round
            </button>
            {onExit && (
              <button
                onClick={onExit}
                className="px-4 py-2 rounded-xl text-sm font-medium border flex items-center gap-2"
                style={{ background: `${PALETTE.surface}cc`, borderColor: `${PALETTE.steel}99`, color: PALETTE.mist }}
                data-testid="button-quiz-exit"
              >
                <Compass className="w-4 h-4" />
                Back to explore
              </button>
            )}
          </div>
        </div>
      </PanelSurface>
    );
  }

  if (!q) return null;

  return (
    <PanelSurface>
      {/* Progress + score bar */}
      <div className="flex-shrink-0 px-4 md:px-5 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1.5">
          <span
            className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5"
            style={{ color: PALETTE.surf }}
          >
            {q.type === "identify" ? <HelpCircle className="w-3.5 h-3.5" /> : <MousePointerClick className="w-3.5 h-3.5" />}
            {q.type === "identify" ? "Name the part" : "Find the part"}
          </span>
          <span className="text-[11px] font-medium" style={{ color: `${PALETTE.mist}aa` }}>
            {idx + 1} / {round.length} · Score {score}
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: `${PALETTE.steel}66` }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${((idx + (answered ? 1 : 0)) / round.length) * 100}%`,
              background: `linear-gradient(90deg, ${PALETTE.teal}, ${PALETTE.surf})`,
            }}
          />
        </div>
      </div>

      {/* Prompt */}
      <div className="flex-shrink-0 px-4 md:px-5 pb-1">
        <p className="text-base font-semibold text-white" data-testid="quiz-prompt">
          {q.type === "identify" ? (
            <>What is the highlighted region?</>
          ) : (
            <>
              Click the <span style={{ color: PALETTE.surf, fontWeight: 700 }}>{q.item.name}</span> on the brain
            </>
          )}
        </p>
        <p className="text-[11px] mt-0.5" style={{ color: `${PALETTE.mist}88` }}>
          {q.item.viewName}
        </p>
      </div>

      {/* Answer area (scrolls if tall) */}
      <div className="flex-1 min-h-0 overflow-y-auto px-4 md:px-5 py-2">
        {q.type === "identify" ? (
          <div className="grid grid-cols-1 gap-2">
            {q.options.map((opt) => {
              const isCorrect = opt.id === q.item.id;
              const isPicked = opt.id === picked;
              let bg = `${PALETTE.surface}cc`;
              let border = `${PALETTE.steel}99`;
              let color = "#fff";
              if (answered) {
                if (isCorrect) {
                  bg = "#34D39922";
                  border = "#34D399";
                  color = "#fff";
                } else if (isPicked) {
                  bg = "#F8717122";
                  border = "#F87171";
                } else {
                  color = `${PALETTE.mist}88`;
                }
              }
              return (
                <button
                  key={opt.id}
                  onClick={() => answer(opt.id)}
                  disabled={answered}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium border text-left flex items-center justify-between gap-2 transition-all"
                  style={{ background: bg, borderColor: border, color }}
                  data-testid={`quiz-option-${opt.id}`}
                >
                  <span className="truncate">{opt.name}</span>
                  {answered && isCorrect && <Check className="w-4 h-4 flex-shrink-0" style={{ color: "#34D399" }} />}
                  {answered && isPicked && !isCorrect && <X className="w-4 h-4 flex-shrink-0" style={{ color: "#F87171" }} />}
                </button>
              );
            })}
          </div>
        ) : (
          <div
            className="rounded-xl px-3 py-2.5 flex items-start gap-2"
            style={{ background: `${PALETTE.surf}10`, border: `1px solid ${PALETTE.surf}33` }}
          >
            <MousePointerClick className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: PALETTE.surf }} />
            <p className="text-xs leading-snug" style={{ color: PALETTE.mist }}>
              Click the marker on the brain to answer.
            </p>
          </div>
        )}

        {/* Teaching reveal — turns every answer into a micro-lesson */}
        {answered && q.item.blurb && (
          <div
            className="mt-3 rounded-xl px-3 py-2 flex items-start gap-2"
            style={{
              background: `${PALETTE.surf}14`,
              border: `1px solid ${PALETTE.surf}40`,
            }}
            data-testid="quiz-teach"
          >
            <HelpCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: PALETTE.surf }} />
            <p className="text-xs leading-snug" style={{ color: PALETTE.mist }}>
              <span className="font-semibold" style={{ color: "#fff" }}>{q.item.name}:</span>{" "}
              {q.item.blurb}
            </p>
          </div>
        )}
      </div>

      {/* Feedback + next */}
      <div
        className="flex-shrink-0 px-4 md:px-5 py-3 border-t flex items-center justify-between gap-3 min-h-[56px]"
        style={{ borderColor: `${PALETTE.steel}55` }}
      >
        <span
          className="text-sm font-semibold flex items-center gap-1.5"
          style={{ color: answered ? (correctChosen ? "#34D399" : "#F87171") : "transparent" }}
          data-testid="quiz-feedback"
        >
          {answered &&
            (correctChosen ? (
              <>
                <Check className="w-4 h-4" /> Correct
              </>
            ) : (
              <>
                <X className="w-4 h-4" /> It's the {q.item.name}
              </>
            ))}
        </span>
        <button
          onClick={next}
          disabled={!answered}
          className="px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all"
          style={{
            background: answered ? `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.surf})` : `${PALETTE.steel}66`,
            color: answered ? PALETTE.bg : `${PALETTE.mist}66`,
            cursor: answered ? "pointer" : "not-allowed",
          }}
          data-testid="button-quiz-next"
        >
          {isLast ? "Finish" : "Next"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </PanelSurface>
  );
}

// Composite (stacked) quiz — diagram on top, panel below. Kept for any caller
// that wants the quiz in a single column; Brain Lab now renders the two halves
// split across its two panes via the named exports above.
export default function BrainQuiz({
  items,
  isMobile,
  onExit,
}: {
  items: QuizItem[];
  isMobile?: boolean;
  onExit?: () => void;
}) {
  const controller = useBrainQuiz(items);
  return (
    <div className="h-full w-full flex flex-col gap-3" data-testid="brain-quiz-stacked">
      <div className="flex-1 min-h-0">
        <BrainQuizDiagram controller={controller} isMobile={isMobile} />
      </div>
      <div className="flex-shrink-0">
        <BrainQuizPanel controller={controller} onExit={onExit} />
      </div>
    </div>
  );
}
