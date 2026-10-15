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

type Billing = "monthly" | "annual";

export function Welcome() {
  const [billing, setBilling] = useState<Billing>("annual");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const previewAction = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3600);
  };

  return (
    <main className="ppw-page">
      <header className="ppw-header">
        <div className="ppw-wordmark" aria-label="PsychPro">
          <Brain aria-hidden="true" />
          <span>PSYCHPRO</span>
          <i>SUITE</i>
        </div>
        <div className="ppw-header-right">
          <span className="ppw-preview-tag"><span /> Preview · no account changes</span>
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
        <div className="ppw-hero-copy">
          <div className="ppw-eyebrow"><span /> A new space for the rest of your learning</div>
          <h1>Your learning,<br /><em>in a wider light.</em></h1>
          <p className="ppw-intro">
            Meet PsychPro Suite: evidence-based study tools for psychology,
            neuroscience, assessment, and clinical learning—all together, and
            ready for the material you bring. Use your same account; there is no
            second account to create.
          </p>
          <div className="ppw-hero-cta">
            <button type="button" className="ppw-primary" onClick={() => setDialogOpen(true)}>
              Start my free week <ArrowRight aria-hidden="true" />
            </button>
            <span>7 days · no card · starts only when you choose</span>
          </div>
          <div className="ppw-trial-note">
            <Sparkles aria-hidden="true" />
            <span><strong>Nothing starts yet.</strong> Your 7-day trial begins only after you explicitly start it.</span>
          </div>
        </div>
        <div className="ppw-art" aria-hidden="true">
          <img className="ppw-splash" src="/__mockup/images/psychpro-welcome-teal-splash.jpg" alt="" />
          <div className="ppw-art-orbit ppw-art-orbit-one" />
          <div className="ppw-art-orbit ppw-art-orbit-two" />
          <img className="ppw-brain" src="/__mockup/images/psychpro-welcome-chrome-brain.webp" alt="" />
          <div className="ppw-art-caption"><span>PSYCHPRO</span><b>LEARN · EXPAND · CONNECT</b></div>
        </div>
      </section>

      <section className="ppw-offer" aria-labelledby="ppw-offer-title">
        <div className="ppw-offer-heading">
          <div>
            <div className="ppw-eyebrow ppw-eyebrow-muted">ONE SUITE. ONE SET OF TOOLS.</div>
            <h2 id="ppw-offer-title">Make room to understand.</h2>
          </div>
          <p>Built-in practice, your own course material, and a place to see your progress take shape.</p>
        </div>
        <div className="ppw-offer-grid">
          <div className="ppw-includes">
            <div className="ppw-feature-list">
              <article className="ppw-feature">
                <div className="ppw-feature-icon"><Layers3 aria-hidden="true" /></div>
                <div><h3>Practice from every angle</h3><p>Flashcards, quizzes, practice exams, and study guides are built in.</p></div>
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
            <div className="ppw-progress-note">
              <div className="ppw-progress-mark"><span /><span /><span /><span /><span /></div>
              <div><strong>See your learning move</strong><span>Progress tracking helps you know what to revisit next.</span></div>
            </div>
          </div>

          <aside className="ppw-pricing">
            <div className="ppw-pricing-top">
              <span className="ppw-pricing-label">PSYCHPRO SUITE</span>
              <span className="ppw-same-access">Same access, either way</span>
            </div>
            <div className="ppw-billing-switch" role="group" aria-label="Billing frequency">
              <button type="button" className={billing === "monthly" ? "is-selected" : ""} onClick={() => setBilling("monthly")}>Monthly</button>
              <button type="button" className={billing === "annual" ? "is-selected" : ""} onClick={() => setBilling("annual")}>Annual <span>Save $79.89</span></button>
            </div>
            <div className="ppw-price-line">
              <strong>{billing === "monthly" ? "$19.99" : "$159.99"}</strong>
              <span>/{billing === "monthly" ? "month" : "year"}</span>
            </div>
            <p className="ppw-price-context">{billing === "monthly" ? "$19.99/month if you choose a subscription after trial." : "$159.99/year if you choose a subscription · equivalent to $13.33/month."}</p>
            <ul className="ppw-benefits">
              <li><Check aria-hidden="true" /> Full PsychPro Suite access</li>
              <li><Check aria-hidden="true" /> 5 AI generation requests during the 7-day trial</li>
              <li><Check aria-hidden="true" /> 50 AI generation requests each paid month</li>
            </ul>
            <button type="button" className="ppw-primary ppw-pricing-cta" onClick={() => setDialogOpen(true)}>
              Start my free week <ArrowRight aria-hidden="true" />
            </button>
            <p className="ppw-no-charge">No payment card. No automatic charge when the free week ends.</p>
          </aside>
        </div>
      </section>

      <footer className="ppw-footer">
        <p><span className="ppw-footer-dot" /> Your EPPP access stays separate and unchanged.</p>
        <button type="button" onClick={() => previewAction("Preview only — returning to EPPP would leave your account unchanged.")}>
          <ArrowLeft aria-hidden="true" /> Return to EPPP
        </button>
      </footer>

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
            <div className="ppw-dialog-summary"><span>{billing === "monthly" ? "$19.99 / month" : "$159.99 / year"}</span><span>5 AI requests during trial</span></div>
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
