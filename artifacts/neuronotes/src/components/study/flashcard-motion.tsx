import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Separate deck navigation from the card's reveal rotation. */
export function FlashcardMotion({ cardKey, direction = 1, children }: {
  cardKey: string | number;
  direction?: number;
  children: ReactNode;
}) {
  const reduced = useReducedMotion();
  return (
    <div className="overflow-hidden">
      <AnimatePresence initial={false} mode="wait" custom={direction}>
        <motion.div
          key={cardKey}
          custom={direction}
          variants={{
            enter: (d: number) => ({ x: reduced ? 0 : d * 80, opacity: reduced ? 1 : 0 }),
            visible: { x: 0, opacity: 1 },
            exit: (d: number) => ({ x: reduced ? 0 : -d * 80, opacity: reduced ? 1 : 0 }),
          }}
          initial="enter"
          animate="visible"
          exit="exit"
          transition={{ duration: reduced ? 0 : 0.18, ease: "easeOut" }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export function CustomFlashcard({ cardKey, direction = 1, front, back, flipped, onFlip }: {
  cardKey: string | number;
  direction?: number;
  front: string;
  back: string;
  flipped: boolean;
  onFlip: () => void;
}) {
  return (
    <FlashcardMotion cardKey={cardKey} direction={direction}>
      <button type="button" className="flashcard-container block w-full text-left select-none"
        onClick={onFlip} aria-label={flipped ? "Show question" : "Reveal answer"} aria-pressed={flipped}>
        <div className={`flashcard-inner pp-custom-flashcard ${flipped ? "flipped" : ""}`}>
          <div className="flashcard-front rounded-2xl border-2 border-border bg-card p-6 text-center flex items-center justify-center">
            <p className="text-foreground font-medium text-base leading-relaxed">{front}</p>
          </div>
          <div className="flashcard-back rounded-2xl border-2 border-primary bg-card p-6 text-center flex items-center justify-center">
            <p className="text-foreground font-medium text-base leading-relaxed">{back}</p>
          </div>
        </div>
      </button>
    </FlashcardMotion>
  );
}