import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  FileUp,
  Layers3,
  Sparkles,
  X,
} from "lucide-react";
import "./Welcome.css";

type Plan = "monthly" | "annual";

export function Welcome() {
  const [dialogPlan, setDialogPlan] = useState<Plan | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const previewAction = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3600);
  };
  const openTrialPreview = (plan: Plan | null = null) => {
    setDialogPlan(plan);
    setDialogOpen(true);
  };

  return (
    <main className="ppw-page">
      <header className="ppw-header">
        <div className="ppw-wordmark" aria-label="PsychPro">
          <Brain aria-hidden="true" />
          <span>PSYCHPRO</span>
        </div>
        <div className="ppw-header-right">
          <button
            className="ppw-back"
            type="button"
            onClick={() => previewAction("Preview only — your EPPP workspace has not changed.")}
          >
            <ArrowLeft aria-hidden="true" /> Back to EPPP
          </button>
        </div>
      </header>

      <section className="ppw-hero">
        <img className="ppw-splash" src="/__mockup/images/psychpro-welcome-one-sided-wave.webp" alt="" aria-hidden="true" />
        <h1 className="ppw-hero-title">Learn. Connect. Expand.</h1>
        <div className="ppw-hero-layout">
          <div className="ppw-hero-copy">
            <ul className="ppw-intro-points">
              <li>Evidence-based study tools for psych students.</li>
              <li>Concepts in psychology, neuroscience, assessment, and intervention.</li>
              <li>For classroom and clinical learning – all in one space.</li>
            </ul>
            <div className="ppw-feature-list">
              <article className="ppw-feature">
                <div className="ppw-feature-icon"><Layers3 aria-hidden="true" /></div>
                <div><h3>Learn at your own pace</h3><p>Flashcards, quizzes, practice exams, and study guides are built in.</p></div>
              </article>
              <article className="ppw-feature">
                <div className="ppw-feature-icon"><Brain aria-hidden="true" /></div>
                <div><h3>Explore the Brain Lab</h3><p>Connect neuroanatomy, systems, and function through interactive learning.</p></div>
              </article>
              <article className="ppw-feature">
                <div className="ppw-feature-icon"><FileUp aria-hidden="true" /></div>
                <div><h3>Bring your own material</h3><p>Turn uploaded PDF, DOCX, or TXT files—or pasted notes—into study materials.</p></div>
              </article>
            </div>
          </div>
          <div className="ppw-art" aria-hidden="true">
            <img className="ppw-brain" src="/__mockup/images/psychpro-welcome-chrome-brain.webp" alt="" />
          </div>
        </div>
        <div className="ppw-hero-action">
          <button type="button" className="ppw-primary" onClick={() => openTrialPreview()}>
            Start My Free Trial <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>

      <section className="ppw-offer" aria-labelledby="ppw-offer-title">
        <div className="ppw-offer-heading">
          <h2 id="ppw-offer-title">Commit to Learning Today.</h2>
        </div>
        <div className="ppw-pricing-grid">
          <article className="ppw-pricing">
            <div className="ppw-plan-heading">
              <h3>Monthly</h3>
              <p>PsychPro Suite · full access</p>
            </div>
            <div className="ppw-price-line"><strong>$19.99</strong><span>/ month</span></div>
            <p className="ppw-price-context">If you choose a subscription after your free week.</p>
            <p className="ppw-card-trial">7 days free · starts only when you choose · 5 AI requests · no card · no automatic charge.</p>
            <ul className="ppw-benefits">
              <li><Check aria-hidden="true" /> All flashcards, quizzes, practice exams, and study guides</li>
              <li><Check aria-hidden="true" /> Brain Lab, progress tracking, and your own uploaded or pasted notes</li>
              <li><Check aria-hidden="true" /> 50 AI generation requests each paid month</li>
            </ul>
            <button type="button" className="ppw-primary ppw-pricing-cta" onClick={() => openTrialPreview("monthly")}>
              Start my free week <ArrowRight aria-hidden="true" />
            </button>
          </article>
          <article className="ppw-pricing ppw-pricing--annual">
            <div className="ppw-plan-heading">
              <h3>Annual</h3>
              <p>PsychPro Suite · full access</p>
            </div>
            <div className="ppw-price-line"><strong>$159.99</strong><span>/ year</span></div>
            <p className="ppw-price-context">If you choose an annual subscription after trial · save $79.89 vs monthly · equivalent to $13.33/month.</p>
            <p className="ppw-card-trial">7 days free · starts only when you choose · 5 AI requests · no card · no automatic charge.</p>
            <ul className="ppw-benefits">
              <li><Check aria-hidden="true" /> All flashcards, quizzes, practice exams, and study guides</li>
              <li><Check aria-hidden="true" /> Brain Lab, progress tracking, and your own uploaded or pasted notes</li>
              <li><Check aria-hidden="true" /> 50 AI generation requests each paid month</li>
            </ul>
            <button type="button" className="ppw-primary ppw-pricing-cta" onClick={() => openTrialPreview("annual")}>
              Start my free week <ArrowRight aria-hidden="true" />
            </button>
          </article>
        </div>
      </section>

      {notice && <div className="ppw-toast" role="status">{notice}</div>}
      {dialogOpen && (
        <div className="ppw-dialog-scrim" role="presentation" onMouseDown={(event) => {
          if (event.target === event.currentTarget) setDialogOpen(false);
        }}>
          <section className="ppw-dialog" role="dialog" aria-modal="true" aria-labelledby="ppw-dialog-title">
            <button className="ppw-dialog-close" type="button" onClick={() => setDialogOpen(false)} aria-label="Close preview dialog"><X /></button>
            <div className="ppw-dialog-icon"><Sparkles aria-hidden="true" /></div>
            <div className="ppw-eyebrow">PREVIEW ONLY</div>
            <h2 id="ppw-dialog-title">Your free week is ready to begin.</h2>
            <p>In the live suite, your 7 days would start only after you explicitly confirm. No card is needed, and there is no automatic charge. This preview will not start a trial or change your account.</p>
            <div className="ppw-dialog-summary">
              <span>{dialogPlan === "monthly" ? "$19.99 / month if you choose to subscribe" : dialogPlan === "annual" ? "$159.99 / year if you choose to subscribe" : "Choose monthly or annual after your free week"}</span>
              <span>5 AI requests during trial</span>
            </div>
            <button className="ppw-primary ppw-dialog-confirm" type="button" onClick={() => {
              setDialogOpen(false);
              previewAction("Preview confirmed — no trial started and no account changes made.");
            }}>Confirm preview <ArrowRight aria-hidden="true" /></button>
            <button className="ppw-dialog-cancel" type="button" onClick={() => setDialogOpen(false)}>Not now</button>
          </section>
        </div>
      )}
    </main>
  );
}
