import { useState } from "react";
import { ArrowUpRight, Brain, Crown } from "lucide-react";
import "./_blended.css";

type Suite = "psychpro" | "eppp";

export function Blended() {
  const [preview, setPreview] = useState<Suite | null>(null);

  return (
    <main className="suite-blended">
      <section className="suite-blended__grid" aria-label="PsychPro learning suites">
        <article className="suite-blended__card suite-blended__card--psychpro">
          <div className="suite-blended__art suite-blended__art--psychpro" aria-hidden="true">
            <div className="suite-blended__art-wash" />
            <img src="/__mockup/images/psychpro-teal-glass.webp" alt="" />
            <span className="suite-blended__art-line suite-blended__art-line--one" />
            <span className="suite-blended__art-line suite-blended__art-line--two" />
            <span className="suite-blended__art-caption">LEARN · PRACTICE · CONNECT</span>
          </div>
          <div className="suite-blended__content">
            <div className="suite-blended__identity">
              <span className="suite-blended__icon">
                <Brain size={19} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="suite-blended__label">PsychPro Suite</span>
            </div>
            <h2>PsychPro Suite</h2>
            <p className="suite-blended__description">
              A home for psychology learning: build understanding with focused
              study, active practice, and concepts brought closer to clinical work.
            </p>
            <div className="suite-blended__bottom">
              <span className="suite-blended__note">For students &amp; clinicians</span>
              <button
                className="suite-blended__button"
                type="button"
                aria-expanded={preview === "psychpro"}
                aria-controls="blended-psychpro-preview"
                onClick={() => setPreview(preview === "psychpro" ? null : "psychpro")}
              >
                Explore suite
                <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>
            {preview === "psychpro" && (
              <p className="suite-blended__preview" id="blended-psychpro-preview" role="status">
                Explore psychology study tools built for learning, recall, and clinical connection.
              </p>
            )}
          </div>
        </article>

        <article className="suite-blended__card suite-blended__card--eppp">
          <div className="suite-blended__art suite-blended__art--eppp" aria-hidden="true">
            <div className="suite-blended__art-wash" />
            <img src="/__mockup/images/psychpro-teal-glass.webp" alt="" />
            <span className="suite-blended__orbit suite-blended__orbit--one" />
            <span className="suite-blended__orbit suite-blended__orbit--two" />
            <span className="suite-blended__art-caption">A FOCUSED PATH THROUGH THE DOMAINS</span>
          </div>
          <div className="suite-blended__content">
            <div className="suite-blended__identity">
              <span className="suite-blended__icon">
                <Crown size={19} strokeWidth={1.8} aria-hidden="true" />
              </span>
              <span className="suite-blended__label">EPPP Mastery Suite</span>
            </div>
            <h2>EPPP Mastery Suite</h2>
            <p className="suite-blended__description">
              Structured lessons across EPPP domains, clinical integration cases,
              and full-length practice exams support conceptual understanding,
              critical thinking, and active application.
            </p>
            <div className="suite-blended__bottom">
              <span className="suite-blended__note">Dedicated EPPP preparation</span>
              <button
                className="suite-blended__button"
                type="button"
                aria-expanded={preview === "eppp"}
                aria-controls="blended-eppp-preview"
                onClick={() => setPreview(preview === "eppp" ? null : "eppp")}
              >
                Explore suite
                <ArrowUpRight size={15} strokeWidth={1.8} aria-hidden="true" />
              </button>
            </div>
            {preview === "eppp" && (
              <p className="suite-blended__preview" id="blended-eppp-preview" role="status">
                A closer look at domain lessons, clinical case examples, and practice exams.
              </p>
            )}
          </div>
        </article>
      </section>
    </main>
  );
}