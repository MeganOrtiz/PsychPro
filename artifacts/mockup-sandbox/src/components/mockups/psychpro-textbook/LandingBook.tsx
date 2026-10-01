import { useEffect, useState } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import { BrainLabSection, LandingFrame, MethodSection } from "./_LandingContext";
import "./_book.css";

function BookSection() {
  const [previewNote, setPreviewNote] = useState(false);

  return (
    <section id="textbook-preview" className="landing-section pp-book" aria-labelledby="pp-book-title">
      <div className="pp-book-inner">
        <div className="pp-book-copy">
          <p className="landing-eyebrow landing-eyebrow--left pp-book-eyebrow">
            THE GUIDED LEARNING SERIES
          </p>
          <p className="pp-book-volume">VOLUME 01 <span aria-hidden="true">/</span> FOUNDATIONS</p>
          <h2 className="pp-book-title" id="pp-book-title">
            Foundations in
            <br />
            <em>Clinical Psychology</em>
          </h2>
          <p className="pp-book-description">
            Volume 1 of the PsychPro Guided Learning Series, authored by
            PsychPro’s creator.
          </p>

          <div className="pp-book-meta" aria-label="Book details">
            <div className="pp-book-meta-item">
              <span className="pp-book-meta-label">SERIES</span>
              <span>Guided Learning Series</span>
            </div>
            <div className="pp-book-meta-item">
              <span className="pp-book-meta-label">BY</span>
              <span>PsychPro’s creator</span>
            </div>
          </div>

          <div className="pp-book-formats">
            <span className="pp-format-mark" aria-hidden="true"><CircleCheck /></span>
            <span>Print and digital editions planned</span>
          </div>

          <button
            type="button"
            className="landing-cta landing-cta-primary pp-book-cta"
            onClick={() => setPreviewNote((visible) => !visible)}
            aria-expanded={previewNote}
            aria-describedby="pp-book-preview-note"
          >
            <span>Explore the textbook</span>
            <ArrowRight aria-hidden="true" />
          </button>
          <p
            className={`pp-book-preview-note${previewNote ? " is-visible" : ""}`}
            id="pp-book-preview-note"
            role="status"
            aria-live="polite"
          >
            This is a visual preview. Textbook access and navigation will be
            decided later.
          </p>
        </div>

        <figure className="pp-book-art">
          <div className="pp-book-art-frame">
            <div className="pp-book-art-wash" aria-hidden="true" />
            <img
              src="/__mockup/images/psychpro-foundations-book.jpeg"
              alt="PsychPro Guided Learning Series, Volume 1: Foundations in Clinical Psychology. A white hardback book with a chrome brain and turquoise fluid artwork on its cover."
              className="pp-book-photo"
              width={683}
              height={1024}
            />
          </div>
          <figcaption>
            Volume 1 · Guided Learning Series
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export function LandingBook() {
  useEffect(() => {
    const frame = requestAnimationFrame(() =>
      document.getElementById("textbook-preview")?.scrollIntoView({ behavior: "instant" }),
    );
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <LandingFrame>
      <MethodSection />
      <BookSection />
      <BrainLabSection />
    </LandingFrame>
  );
}

export default LandingBook;