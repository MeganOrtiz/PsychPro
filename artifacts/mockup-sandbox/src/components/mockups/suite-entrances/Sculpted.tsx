import { useState } from "react";
import { ArrowUpRight, Brain, Crown } from "lucide-react";
import "./_sculpted.css";

type SuiteKey = "psychpro" | "eppp";

const previewNotes: Record<SuiteKey, string> = {
  psychpro:
    "A calm starting point for learning, review, and applying psychology concepts.",
  eppp:
    "Explore structured domain lessons, clinical integration cases, and full-length practice exams.",
};

export function Sculpted() {
  const [activePreview, setActivePreview] = useState<SuiteKey | null>(null);

  return (
    <main className="suite-sculpted">
      <section className="suite-sculpted__grid" aria-label="Choose a PsychPro suite">
        <article className="suite-sculpted__card suite-sculpted__card--psychpro">
          <div className="suite-sculpted__art suite-sculpted__art--psychpro" aria-hidden="true">
            <img src="/__mockup/images/psychpro-teal-glass.webp" alt="" />
          </div>
          <div className="suite-sculpted__edge suite-sculpted__edge--psychpro" aria-hidden="true" />

          <div className="suite-sculpted__content">
            <div className="suite-sculpted__identity">
              <span className="suite-sculpted__icon suite-sculpted__icon--brain">
                <Brain size={19} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="suite-sculpted__label">PsychPro Suite</span>
            </div>
            <div className="suite-sculpted__copy">
              <h2>PsychPro Suite</h2>
              <p>
                A focused place to learn, review, and put psychology concepts
                into practice—with study tools built for steady progress.
              </p>
            </div>
            <div className="suite-sculpted__action-row">
              <button
                className="suite-sculpted__button"
                type="button"
                aria-expanded={activePreview === "psychpro"}
                aria-controls="psychpro-preview-note"
                onClick={() =>
                  setActivePreview(activePreview === "psychpro" ? null : "psychpro")
                }
              >
                Explore suite <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
              </button>
              <span className="suite-sculpted__descriptor">LEARN · REVIEW · APPLY</span>
            </div>
            {activePreview === "psychpro" && (
              <p className="suite-sculpted__preview" id="psychpro-preview-note" role="status">
                {previewNotes.psychpro}
              </p>
            )}
          </div>
        </article>

        <article className="suite-sculpted__card suite-sculpted__card--eppp">
          <div className="suite-sculpted__art suite-sculpted__art--eppp" aria-hidden="true">
            <img src="/__mockup/images/psychpro-teal-glass.webp" alt="" />
          </div>
          <div className="suite-sculpted__edge suite-sculpted__edge--eppp" aria-hidden="true" />

          <div className="suite-sculpted__content">
            <div className="suite-sculpted__identity">
              <span className="suite-sculpted__icon suite-sculpted__icon--crown">
                <Crown size={19} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="suite-sculpted__label">EPPP Mastery Suite</span>
            </div>
            <div className="suite-sculpted__copy">
              <h2>EPPP Mastery Suite</h2>
              <p>
                Structured lessons across EPPP domains, clinical integration
                cases, and full-length practice exams support conceptual
                understanding, critical thinking, and active application.
              </p>
            </div>
            <div className="suite-sculpted__action-row">
              <button
                className="suite-sculpted__button"
                type="button"
                aria-expanded={activePreview === "eppp"}
                aria-controls="eppp-preview-note"
                onClick={() =>
                  setActivePreview(activePreview === "eppp" ? null : "eppp")
                }
              >
                Explore suite <ArrowUpRight size={16} strokeWidth={1.8} aria-hidden="true" />
              </button>
              <span className="suite-sculpted__descriptor">DOMAIN-BASED PREPARATION</span>
            </div>
            {activePreview === "eppp" && (
              <p className="suite-sculpted__preview" id="eppp-preview-note" role="status">
                {previewNotes.eppp}
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}