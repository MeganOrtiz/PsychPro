import { useState } from "react";
import { ArrowRight, Brain, Crown } from "lucide-react";
import "./_artwork-led.css";

export function ArtworkLed() {
  const [preview, setPreview] = useState<"psychpro" | "eppp" | null>(null);

  return (
    <main className="artwork-led">
      <section className="al-intro" aria-labelledby="al-heading">
        <p className="al-overline">FIND YOUR WAY IN</p>
        <h1 id="al-heading">Two suites. One clearer way to learn.</h1>
        <p className="al-deck">
          Choose the learning space that fits what you’re working toward.
        </p>
      </section>

      <section className="al-suites" aria-label="PsychPro learning suites">
        <article className="al-card al-card--psychpro">
          <div className="al-art al-art--psychpro" aria-hidden="true">
            <span className="al-art-wash" />
            <img src="/__mockup/images/psychpro-teal-glass.webp" alt="" />
            <span className="al-art-caption">LEARN · PRACTICE · CONNECT</span>
            <span className="al-mark al-mark--brain"><Brain /></span>
          </div>
          <div className="al-content">
            <div className="al-label"><Brain aria-hidden="true" /><span>PSYCHPRO SUITE</span></div>
            <h2>PsychPro Suite</h2>
            <p className="al-description">
              A home for psychology learning: build understanding with focused
              study, active practice, and concepts brought closer to clinical work.
            </p>
            <div className="al-bottom">
              <span className="al-note">For students &amp; clinicians</span>
              <button className="al-button" onClick={() => setPreview(preview === "psychpro" ? null : "psychpro")} aria-expanded={preview === "psychpro"}>
                Explore suite <ArrowRight aria-hidden="true" />
              </button>
            </div>
            {preview === "psychpro" && (
              <p className="al-preview" role="status">Explore psychology study tools built for learning, recall, and clinical connection.</p>
            )}
          </div>
        </article>

        <article className="al-card al-card--eppp">
          <div className="al-art al-art--eppp" aria-hidden="true">
            <span className="al-art-wash" />
            <img src="/__mockup/images/psychpro-teal-glass.webp" alt="" />
            <span className="al-orbit al-orbit--one" />
            <span className="al-orbit al-orbit--two" />
            <span className="al-art-caption">A FOCUSED PATH THROUGH THE DOMAINS</span>
            <span className="al-mark al-mark--crown"><Crown /></span>
          </div>
          <div className="al-content">
            <div className="al-label"><Crown aria-hidden="true" /><span>EPPP MASTERY SUITE</span></div>
            <h2>EPPP Mastery Suite</h2>
            <p className="al-description">
              Structured lessons across EPPP domains, clinical integration cases,
              and full-length practice exams support conceptual understanding and
              active application.
            </p>
            <div className="al-bottom">
              <span className="al-note">Dedicated EPPP preparation</span>
              <button className="al-button" onClick={() => setPreview(preview === "eppp" ? null : "eppp")} aria-expanded={preview === "eppp"}>
                Explore suite <ArrowRight aria-hidden="true" />
              </button>
            </div>
            {preview === "eppp" && (
              <p className="al-preview" role="status">A closer look at domain lessons, clinical case examples, and practice exams.</p>
            )}
          </div>
        </article>
      </section>
      <p className="al-footer">Psychology learning, with room to go deeper.</p>
    </main>
  );
}