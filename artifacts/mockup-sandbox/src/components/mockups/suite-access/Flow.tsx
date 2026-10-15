import {
  ArrowDown,
  ArrowRight,
  Brain,
  Check,
  Crown,
  KeyRound,
  LockKeyhole,
  RotateCcw,
  ShieldCheck,
  SquareArrowOutUpRight,
  UserRoundPlus,
} from "lucide-react";
import "./_group.css";
import "./flow.css";

function Brand({ suite }: { suite: "psych" | "eppp" }) {
  const PsychIcon = suite === "psych";
  return (
    <span className={`sa-brand ${PsychIcon ? "sa-brand--psych" : "sa-brand--eppp"}`}>
      {PsychIcon ? <Brain aria-hidden="true" /> : <Crown aria-hidden="true" />}
      {PsychIcon ? "PSYCHPRO" : "EPPP"}
    </span>
  );
}

function Node({ label, detail, icon: Icon, className = "" }: {
  label: string;
  detail: string;
  icon: typeof UserRoundPlus;
  className?: string;
}) {
  return (
    <div className={`saf-node ${className}`}>
      <span className="saf-node-icon"><Icon aria-hidden="true" /></span>
      <div><strong>{label}</strong><span>{detail}</span></div>
    </div>
  );
}

export function Flow() {
  return (
    <main className="suite-access-flow saf-page">
      <header className="saf-header">
        <div className="saf-brandline"><Brand suite="psych" /><span className="sa-divider">×</span><Brand suite="eppp" /></div>
        <span className="saf-kicker">ACCESS MODEL · DESIGN PREVIEW</span>
      </header>

      <section className="saf-intro">
        <div className="saf-overline">ONE ACCOUNT. TWO INDEPENDENT SUITES.</div>
        <h1>Choose a destination.<br /><em>Keep each journey yours.</em></h1>
        <p>Signup and sign-in establish the shared account. A trial begins only when a member explicitly starts it for a specific suite.</p>
      </section>

      <section className="saf-first-journey" aria-labelledby="saf-first-title">
        <div className="saf-section-heading">
          <span className="saf-index">01</span>
          <div><h2 id="saf-first-title">First visit from the landing page</h2><p>Target intent survives the shared setup; access opens only to that target.</p></div>
        </div>
        <div className="saf-first-track">
          <Node label="Landing page" detail="Choose PsychPro or EPPP" icon={SquareArrowOutUpRight} />
          <ArrowRight className="saf-track-arrow" aria-hidden="true" />
          <Node label="Shared onboarding" detail="One account · destination kept · no trial clock" icon={UserRoundPlus} />
          <ArrowRight className="saf-track-arrow" aria-hidden="true" />
          <div className="saf-choice-node">
            <span className="saf-choice-title">Explicitly start one suite</span>
            <div className="saf-choice-cards">
              <div className="saf-mini-card saf-mini-card--psych"><Brand suite="psych" /><span>Start PsychPro week</span></div>
              <div className="saf-mini-card saf-mini-card--eppp"><Brand suite="eppp" /><span>Start EPPP week</span></div>
            </div>
            <small>Only the selected suite's seven-day clock begins.</small>
          </div>
          <ArrowRight className="saf-track-arrow" aria-hidden="true" />
          <div className="saf-dash-pair">
            <Node label="PsychPro dashboard" detail="PsychPro access only" icon={Brain} className="saf-node--psych" />
            <Node label="EPPP dashboard" detail="EPPP access only" icon={Crown} className="saf-node--eppp" />
          </div>
        </div>
        <div className="saf-clock-note"><RotateCcw aria-hidden="true" /><span><strong>Independent clocks:</strong> the other suite may be started later—even while the first week is running. Starting it never resets the first.</span></div>
      </section>

      <section className="saf-return" aria-labelledby="saf-return-title">
        <div className="saf-section-heading">
          <span className="saf-index">02</span>
          <div><h2 id="saf-return-title">Returning sign-in · resolve access every time</h2><p>General login never guesses from last-used suite.</p></div>
        </div>
        <div className="saf-return-grid">
          <article className="saf-return-card saf-return-card--both">
            <div className="saf-case-title"><span className="saf-case-dot saf-dot--both" />Both active</div>
            <Node label="General sign-in" detail="Password / identity verified" icon={KeyRound} />
            <ArrowDown className="saf-down" aria-hidden="true" />
            <div className="saf-result saf-result--chooser"><strong>Suite chooser</strong><span>Always ask which active suite to open.</span></div>
            <div className="saf-two-brands"><Brand suite="psych" /><Brand suite="eppp" /></div>
          </article>
          <article className="saf-return-card">
            <div className="saf-case-title"><span className="saf-case-dot saf-dot--psych" />PsychPro only</div>
            <Node label="General sign-in" detail="One active entitlement" icon={KeyRound} />
            <ArrowDown className="saf-down" aria-hidden="true" />
            <div className="saf-result saf-result--psych"><strong>Open PsychPro</strong><span>Direct to its dashboard. No EPPP access inferred.</span></div>
          </article>
          <article className="saf-return-card">
            <div className="saf-case-title"><span className="saf-case-dot saf-dot--eppp" />EPPP only</div>
            <Node label="General sign-in" detail="One active entitlement" icon={KeyRound} />
            <ArrowDown className="saf-down" aria-hidden="true" />
            <div className="saf-result saf-result--eppp"><strong>Open EPPP</strong><span>Direct to its dashboard. No PsychPro access inferred.</span></div>
          </article>
          <article className="saf-return-card saf-return-card--expired">
            <div className="saf-case-title"><span className="saf-case-dot saf-dot--off" />Neither active / expired</div>
            <Node label="General sign-in" detail="Account and saved work retained" icon={KeyRound} />
            <ArrowDown className="saf-down" aria-hidden="true" />
            <div className="saf-result saf-result--expired"><strong>Choose a suite</strong><span>Unused trial → explicit start. Used trial → subscribe. Never repeat a free week.</span></div>
          </article>
        </div>
      </section>

      <section className="saf-switch" aria-labelledby="saf-switch-title">
        <div className="saf-section-heading">
          <span className="saf-index">03</span>
          <div><h2 id="saf-switch-title">Suite switch is an access check, not a shortcut</h2><p>Account, billing, books, and saved progress remain shared or retained; content authorization stays suite-specific.</p></div>
        </div>
        <div className="saf-switch-track">
          <div className="saf-switch-start"><Brand suite="psych" /><span>Member chooses “Switch suite”</span></div>
          <ArrowRight className="saf-track-arrow" aria-hidden="true" />
          <div className="saf-switch-branches">
            <div className="saf-branch saf-branch--active"><ShieldCheck aria-hidden="true" /><span><strong>Target active</strong>Open its dashboard.</span></div>
            <div className="saf-branch saf-branch--inactive"><LockKeyhole aria-hidden="true" /><span><strong>Target inactive</strong>Show its welcome / activation—not content.</span></div>
            <div className="saf-branch saf-branch--expired"><RotateCcw aria-hidden="true" /><span><strong>Target expired</strong>Subscription choices; preserve work, no repeat week.</span></div>
          </div>
        </div>
      </section>

      <footer className="saf-footer">
        <div><Check aria-hidden="true" /><span><strong>Promo eligibility follows EPPP eligibility.</strong> A promo never grants a second EPPP trial week.</span></div>
        <div><Check aria-hidden="true" /><span><strong>Separate subscriptions.</strong> PsychPro: $19.99/month or $159.99/year. EPPP: $99/month, $499/6 months, or $799/12 months.</span></div>
        <p>Valid destination and promo context are preserved, subject to target access · no permanent free tier · admin bypass is outside this member flow.</p>
      </footer>
    </main>
  );
}
