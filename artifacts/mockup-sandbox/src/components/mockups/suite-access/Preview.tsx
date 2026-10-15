import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Brain,
  Check,
  ChevronDown,
  CircleHelp,
  Crown,
  ExternalLink,
  LockKeyhole,
  RotateCcw,
  Sparkles,
  X,
} from "lucide-react";
import "./_group.css";
import "./preview.css";

type Scenario = "both" | "psych" | "eppp" | "expired" | "new";
type Suite = "psych" | "eppp";
type View = "chooser" | "route" | "welcome" | "confirm" | "success" | "opened";
type Notice = "account" | "billing" | "library" | "checkout" | null;

const scenarios: { id: Scenario; label: string }[] = [
  { id: "both", label: "Both active" },
  { id: "psych", label: "PsychPro only" },
  { id: "eppp", label: "EPPP only" },
  { id: "expired", label: "Both expired" },
  { id: "new", label: "New account" },
];

function SuiteMark({ suite, large = false }: { suite: Suite; large?: boolean }) {
  return (
    <span className={`sap-mark ${suite === "psych" ? "sap-mark--psych" : "sap-mark--eppp"} ${large ? "sap-mark--large" : ""}`}>
      {suite === "psych" ? <Brain aria-hidden="true" /> : <Crown aria-hidden="true" />}
      <span>{suite === "psych" ? "PSYCHPRO" : "EPPP"}</span>
    </span>
  );
}

function suiteName(suite: Suite) { return suite === "psych" ? "PsychPro" : "EPPP"; }

export function Preview() {
  const [scenario, setScenario] = useState<Scenario>("both");
  const [view, setView] = useState<View>("chooser");
  const [target, setTarget] = useState<Suite>("psych");
  const [trialOn, setTrialOn] = useState<{ psych: boolean; eppp: boolean }>({ psych: false, eppp: false });
  const [notice, setNotice] = useState<Notice>(null);
  const [previewMessage, setPreviewMessage] = useState("");
  const closeRef = useRef<HTMLButtonElement>(null);
  const noticeCloseRef = useRef<HTMLButtonElement>(null);

  const active = {
    psych: scenario === "both" || scenario === "psych" || trialOn.psych,
    eppp: scenario === "both" || scenario === "eppp" || trialOn.eppp,
  };
  const expired = scenario === "expired";
  const newAccount = scenario === "new";
  const oneActive = (scenario === "psych" || scenario === "eppp") && !trialOn.psych && !trialOn.eppp;

  useEffect(() => {
    if (view === "confirm") closeRef.current?.focus();
    if (notice) noticeCloseRef.current?.focus();
    if (view !== "confirm" && !notice) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (notice) setNotice(null);
        else setView("welcome");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view, notice]);

  const setScenarioAndReset = (next: Scenario) => {
    setScenario(next);
    setView("chooser");
    setPreviewMessage("");
    setTrialOn({ psych: false, eppp: false });
  };
  const openSuite = (suite: Suite) => {
    setTarget(suite);
    setView("opened");
  };
  const goToTarget = (suite: Suite) => {
    setTarget(suite);
    setView("route");
  };
  const showNotice = (kind: Exclude<Notice, null>) => {
    setNotice(kind);
    window.setTimeout(() => setNotice(null), 3800);
  };
  const beginTrial = (suite: Suite) => {
    setTarget(suite);
    setView("confirm");
  };
  const confirmTrial = () => {
    setTrialOn((before) => ({ ...before, [target]: true }));
    setPreviewMessage(`${suiteName(target)}'s seven-day trial was started in this local preview only.`);
    setView("success");
  };
  const chooseOther = (suite: Suite) => {
    setTarget(suite);
    if (active[suite]) setView("route");
    else setView("welcome");
  };

  const accountTools = (
    <div className="sap-account-tools" aria-label="Account tools">
      <button type="button" onClick={() => showNotice("account")}><CircleHelp aria-hidden="true" /> Account</button>
      <button type="button" onClick={() => showNotice("billing")}><BadgeCheck aria-hidden="true" /> Billing</button>
      <button type="button" onClick={() => showNotice("library")}><BookOpen aria-hidden="true" /> My Library</button>
    </div>
  );

  return (
    <main className="suite-access-preview sap-page">
      <header className="sap-header">
        <div className="sap-wordmarks"><SuiteMark suite="psych" /><span aria-hidden="true">×</span><SuiteMark suite="eppp" /></div>
        <div className="sap-header-side"><span className="sap-preview-pill"><span />Interactive preview · No account changes</span><button type="button" className="sap-avatar" onClick={() => showNotice("account")} aria-label="Open account preview">M</button></div>
      </header>

      <div className="sap-layout">
        <aside className="sap-review-rail" aria-label="Preview scenario controls">
          <div className="sap-review-label"><span>PREVIEW SCENARIO</span><ChevronDown aria-hidden="true" /></div>
          <p>Reviewer-only controls. These are not proposed member settings.</p>
          <div className="sap-scenario-list" role="group" aria-label="Choose an access scenario">
            {scenarios.map((item) => (
              <button key={item.id} type="button" className={scenario === item.id ? "is-current" : ""} aria-pressed={scenario === item.id} onClick={() => setScenarioAndReset(item.id)}>
                <span className={`sap-scenario-dot sap-scenario-dot--${item.id}`} />{item.label}
                {scenario === item.id && <Check aria-hidden="true" />}
              </button>
            ))}
          </div>
          <div className="sap-rail-rule" />
          {accountTools}
          <div className="sap-rail-note"><LockKeyhole aria-hidden="true" /><span>One account; each suite checks its own access.</span></div>
        </aside>

        <section className="sap-content" aria-live="polite">
          {view === "chooser" && (
            <>
              <div className="sap-page-intro">
                <span className="sap-eyebrow">{newAccount ? "WELCOME" : "YOUR LEARNING SPACES"}</span>
                <h1>{newAccount ? <>One account.<br />Choose where to begin.</> : <>Where would you like<br className="sap-desktop-break" /> to continue?</>}</h1>
                <p>{newAccount ? "Choose a suite to explore. Each free week starts only when you explicitly confirm it." : scenario === "both" ? "Your account has access to both suites. Pick the workspace you want to open." : scenario === "expired" ? "Your access has ended, but your saved progress and materials are still here." : `Your ${scenario === "psych" ? "PsychPro" : "EPPP"} access is active. Your other suite has its own access and trial.`}</p>
              </div>

              {oneActive && (
                <div className="sap-routing-banner">
                  <span className="sap-route-icon"><ArrowRight aria-hidden="true" /></span>
                  <div><strong>General sign-in routes directly to {scenario === "psych" ? "PsychPro" : "EPPP"}.</strong><span>To open the other suite, switch below. Inactive access will not open suite content.</span></div>
                </div>
              )}
              {scenario === "expired" && (
                <div className="sap-routing-banner sap-routing-banner--expired">
                  <span className="sap-route-icon"><RotateCcw aria-hidden="true" /></span>
                  <div><strong>Both free weeks have ended.</strong><span>Choose either suite to see its subscription options. Neither trial can be repeated.</span></div>
                </div>
              )}

              <div className="sap-suite-grid">
                <article className={`sap-suite-card sap-suite-card--psych ${!active.psych && !newAccount ? "sap-suite-card--inactive" : ""}`}>
                  <div className="sap-card-top"><SuiteMark suite="psych" large /><span className={`sap-access-tag ${active.psych ? "sap-access-tag--active" : "sap-access-tag--inactive"}`}>{active.psych ? "ACTIVE" : newAccount ? "AVAILABLE" : expired ? "EXPIRED" : "INACTIVE"}</span></div>
                  <div className="sap-card-body">
                    <h2>PsychPro Suite</h2>
                    <p className="sap-card-description">Build understanding across psychology, neuroscience, assessment, and intervention.</p>
                    <div className="sap-card-detail">
                      {active.psych ? <><Check aria-hidden="true" /><span>{trialOn.psych ? "7-day trial · started in this preview" : "Full suite access"}</span></> :
                        expired ? <><RotateCcw aria-hidden="true" /><span>Access expired · progress retained</span></> :
                          <><LockKeyhole aria-hidden="true" /><span>{newAccount ? "7 days free · starts on confirmation" : "Not included in your current access"}</span></>}
                    </div>
                    {newAccount && !active.psych ? <button type="button" className="sa-chrome-button sap-card-action" onClick={() => beginTrial("psych")}>Start PsychPro free week <ArrowRight aria-hidden="true" /></button> :
                      active.psych ? <button type="button" className="sa-chrome-button sap-card-action" onClick={() => openSuite("psych")}>Open PsychPro <ArrowRight aria-hidden="true" /></button> :
                        <button type="button" className="sa-chrome-button sap-card-action" onClick={() => goToTarget("psych")}>{expired ? "View PsychPro plans" : "Switch to PsychPro"} <ArrowRight aria-hidden="true" /></button>}
                  </div>
                  <div className="sap-card-foot"><span>{active.psych ? "PsychPro progress stays in PsychPro." : "Your PsychPro materials stay saved."}</span>{active.psych && <span>{trialOn.psych ? "Sample trial end · Oct 22" : scenario === "both" ? "Sample trial end · Oct 22" : "Independent access"}</span>}</div>
                </article>

                <article className={`sap-suite-card sap-suite-card--eppp ${!active.eppp && !newAccount ? "sap-suite-card--inactive" : ""}`}>
                  <div className="sap-card-top"><SuiteMark suite="eppp" large /><span className={`sap-access-tag ${active.eppp ? "sap-access-tag--active" : "sap-access-tag--inactive"}`}>{active.eppp ? "ACTIVE" : newAccount ? "AVAILABLE" : expired ? "EXPIRED" : "INACTIVE"}</span></div>
                  <div className="sap-card-body">
                    <h2>EPPP Mastery Suite</h2>
                    <p className="sap-card-description">A focused path through exam domains, practice questions, and review resources.</p>
                    <div className="sap-card-detail">
                      {active.eppp ? <><Check aria-hidden="true" /><span>{trialOn.eppp ? "7-day trial · started in this preview" : "Full suite access"}</span></> :
                        expired ? <><RotateCcw aria-hidden="true" /><span>Access expired · progress retained</span></> :
                          <><LockKeyhole aria-hidden="true" /><span>{newAccount ? "7 days free · starts on confirmation" : "Not included in your current access"}</span></>}
                    </div>
                    {newAccount && !active.eppp ? <button type="button" className="sa-chrome-button sap-card-action" onClick={() => beginTrial("eppp")}>Start EPPP free week <ArrowRight aria-hidden="true" /></button> :
                      active.eppp ? <button type="button" className="sa-chrome-button sap-card-action" onClick={() => openSuite("eppp")}>Open EPPP <ArrowRight aria-hidden="true" /></button> :
                        <button type="button" className="sa-chrome-button sap-card-action" onClick={() => goToTarget("eppp")}>{expired ? "View EPPP plans" : "Switch to EPPP"} <ArrowRight aria-hidden="true" /></button>}
                  </div>
                  <div className="sap-card-foot"><span>{active.eppp ? "EPPP progress stays in EPPP." : "Your EPPP materials stay saved."}{scenario === "expired" ? " No repeat trial." : ""}</span>{active.eppp && <span>{trialOn.eppp ? "Sample trial end · Oct 22" : scenario === "both" ? "Sample trial end · Oct 25" : "Independent access"}</span>}</div>
                </article>
              </div>

              {scenario === "both" && (
                <div className="sap-both-note"><Sparkles aria-hidden="true" /><span><strong>Two separate journeys.</strong> Dates shown are sample/demo only. Starting a later trial for the other suite never resets this one.</span></div>
              )}
              {scenario === "expired" && (
                <div className="sap-plan-strip">
                  <div><strong>PsychPro</strong><span>$19.99 / month · $159.99 / year</span></div>
                  <div><strong>EPPP</strong><span>$99 / month · $499 / 6 months · $799 / 12 months</span></div>
                  <button type="button" className="sap-link-button" onClick={() => showNotice("checkout")}>Plan details <ExternalLink aria-hidden="true" /></button>
                </div>
              )}
            </>
          )}

          {view === "route" && (
            <section className={`sap-state-panel ${target === "psych" ? "sap-state-panel--psych" : "sap-state-panel--eppp"}`}>
              <button type="button" className="sap-back-link" onClick={() => setView("chooser")}><ArrowLeft aria-hidden="true" /> Back to suite chooser</button>
              <SuiteMark suite={target} large />
              <span className="sap-eyebrow">ACCESS CHECK</span>
              <h1>{active[target] ? `${suiteName(target)} is ready.` : `${suiteName(target)} is not active.`}</h1>
              <p>{active[target] ? `An active ${suiteName(target)} entitlement would route you to that suite only. This preview does not load a dashboard.` : "Switching suites does not grant access. The selected suite opens its welcome and activation options instead."}</p>
              {active[target] ? <button type="button" className="sa-chrome-button" onClick={() => openSuite(target)}>Preview destination confirmation <ArrowRight aria-hidden="true" /></button> :
                <button type="button" className="sa-chrome-button" onClick={() => setView("welcome")}>Continue to {suiteName(target)} welcome <ArrowRight aria-hidden="true" /></button>}
              <p className="sap-retention-note"><BookOpen aria-hidden="true" />Your other suite, owned books, account, and billing remain separate from this access check.</p>
            </section>
          )}

          {view === "welcome" && (
            <section className={`sap-state-panel sap-welcome-panel ${target === "psych" ? "sap-state-panel--psych" : "sap-state-panel--eppp"}`}>
              <button type="button" className="sap-back-link" onClick={() => setView("chooser")}><ArrowLeft aria-hidden="true" /> Back to suite chooser</button>
              <SuiteMark suite={target} large />
              <span className="sap-eyebrow">{expired ? "SUBSCRIPTION OPTIONS" : "SUITE WELCOME"}</span>
              <h1>{expired ? `Return to ${suiteName(target)}.` : `A separate week for ${suiteName(target)}.`}</h1>
              <p>{expired ? "This suite's trial has already been used. Choose a subscription to restore access; your saved progress and materials remain." : "Only an explicit confirmation starts this suite's one-time seven-day trial. Switching, signing in, and onboarding do not start it."}</p>
              {expired ? (
                <div className="sap-plan-options">
                  {target === "psych" ? <>
                    <button type="button" onClick={() => showNotice("checkout")}><strong>$19.99</strong><span>Monthly subscription</span><ArrowRight aria-hidden="true" /></button>
                    <button type="button" onClick={() => showNotice("checkout")}><strong>$159.99</strong><span>Annual subscription</span><ArrowRight aria-hidden="true" /></button>
                  </> : <>
                    <button type="button" onClick={() => showNotice("checkout")}><strong>$99</strong><span>Monthly · recurring</span><ArrowRight aria-hidden="true" /></button>
                    <button type="button" onClick={() => showNotice("checkout")}><strong>$499</strong><span>6 months · one-time</span><ArrowRight aria-hidden="true" /></button>
                    <button type="button" onClick={() => showNotice("checkout")}><strong>$799</strong><span>12 months · one-time</span><ArrowRight aria-hidden="true" /></button>
                  </>}
                </div>
              ) : (
                <>
                  <div className="sap-trial-terms">
                    <span><Check aria-hidden="true" />7 days, starts only when confirmed</span>
                    <span><Check aria-hidden="true" />No card · no automatic charge</span>
                    <span><Check aria-hidden="true" />This suite only · once ever</span>
                  </div>
                  <div className="sap-after-trial">{target === "psych" ? "After trial, if you choose: $19.99/month or $159.99/year · 5 AI requests in trial, 50 per paid month." : "After trial, if you choose: $99/month, $499/6 months, or $799/12 months."}</div>
                  <button type="button" className="sa-chrome-button sap-start-button" onClick={() => beginTrial(target)}>Start {suiteName(target)} free week <ArrowRight aria-hidden="true" /></button>
                </>
              )}
              <p className="sap-retention-note"><BookOpen aria-hidden="true" />Your existing account, billing, owned books, and saved materials are retained.</p>
            </section>
          )}

          {view === "success" && (
            <section className="sap-state-panel sap-success-panel">
              <span className="sap-success-mark"><Check aria-hidden="true" /></span>
              <span className="sap-eyebrow">LOCAL PREVIEW CONFIRMATION</span>
              <h1>{suiteName(target)}'s week is marked started.</h1>
              <p>{previewMessage} In a real product, the selected suite's clock would start now; the other suite's access would remain unchanged.</p>
              <div className="sap-success-summary"><SuiteMark suite={target} /><span>Trial: 7 days · no card · no automatic charge</span><span>Sample end date · Jun 18</span></div>
              <button type="button" className="sa-chrome-button" onClick={() => openSuite(target)}>Open {suiteName(target)} destination <ArrowRight aria-hidden="true" /></button>
              <button type="button" className="sap-back-link sap-success-back" onClick={() => setView("chooser")}><ArrowLeft aria-hidden="true" /> Return to chooser</button>
            </section>
          )}

          {view === "opened" && (
            <section className={`sap-state-panel sap-opened-panel ${target === "psych" ? "sap-state-panel--psych" : "sap-state-panel--eppp"}`}>
              <button type="button" className="sap-back-link" onClick={() => setView("chooser")}><ArrowLeft aria-hidden="true" /> Back to suite chooser</button>
              <span className="sap-opened-mark"><SuiteMark suite={target} large /></span>
              <span className="sap-eyebrow">DESTINATION CONFIRMATION</span>
              <h1>{suiteName(target)} would open.</h1>
              <p>This is a safe destination confirmation—not a dashboard. Access is scoped to {suiteName(target)}; no live app navigation or account change occurs in this prototype.</p>
              <div className="sap-confirmation-card">
                <span className="sap-confirmation-icon"><Check aria-hidden="true" /></span>
                <div><strong>Access path verified</strong><span>{active[target] ? "Active suite · direct destination" : "Trial started in this preview · destination available"}</span></div>
              </div>
              <button type="button" className="sa-chrome-button" onClick={() => chooseOther(target === "psych" ? "eppp" : "psych")}>Switch suite <ArrowRight aria-hidden="true" /></button>
              <button type="button" className="sap-back-link sap-opened-back" onClick={() => setView("chooser")}>Return to account overview</button>
            </section>
          )}
        </section>
      </div>

      {view === "confirm" && (
        <div className="sap-dialog-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setView("welcome"); }}>
          <section className="sap-dialog" role="dialog" aria-modal="true" aria-labelledby="sap-dialog-title" aria-describedby="sap-dialog-copy">
            <button ref={closeRef} className="sap-dialog-close" type="button" onClick={() => setView("welcome")} aria-label="Close trial confirmation"><X aria-hidden="true" /></button>
            <span className={`sap-dialog-icon ${target === "psych" ? "sap-dialog-icon--psych" : "sap-dialog-icon--eppp"}`}><Sparkles aria-hidden="true" /></span>
            <span className="sap-eyebrow">EXPLICIT START · {suiteName(target).toUpperCase()} ONLY</span>
            <h2 id="sap-dialog-title">Start your free 7-day week?</h2>
            <p id="sap-dialog-copy">Confirming starts the {suiteName(target)} trial now in this local preview. It does not start or reset the other suite's clock.</p>
            <div className="sap-dialog-assurances"><span><Check aria-hidden="true" />No card required</span><span><Check aria-hidden="true" />No automatic charge</span><span><Check aria-hidden="true" />Once ever for this suite</span></div>
            <button className="sa-chrome-button sap-dialog-confirm" type="button" onClick={confirmTrial}>Confirm start · {suiteName(target)} <ArrowRight aria-hidden="true" /></button>
            <button type="button" className="sap-dialog-cancel" onClick={() => setView("welcome")}>Not now</button>
          </section>
        </div>
      )}
      {notice && (
        <div className="sap-notice-scrim" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setNotice(null); }}>
          <section className="sap-notice" role="dialog" aria-modal="true" aria-labelledby="sap-notice-title">
            <button ref={noticeCloseRef} type="button" className="sap-dialog-close" onClick={() => setNotice(null)} aria-label="Close preview note"><X aria-hidden="true" /></button>
            <span className="sap-eyebrow">PREVIEW NOTE</span>
            <h2 id="sap-notice-title">{notice === "checkout" ? "No checkout in this prototype." : notice === "billing" ? "Billing stays with your account." : notice === "library" ? "Your library stays available." : "Shared account details."}</h2>
            <p>{notice === "checkout" ? "The plan choices are illustrative only. No payment method, subscription, or checkout is created." : notice === "billing" ? "This control represents the existing shared billing area; navigation is intentionally not implemented here." : notice === "library" ? "Owned books and materials are retained across suite access changes." : "One account serves both suites. This prototype does not navigate to or change account details."}</p>
            <button type="button" className="sa-chrome-button" onClick={() => setNotice(null)}>Got it</button>
          </section>
        </div>
      )}
      {previewMessage && view === "chooser" && <div className="sap-sr-status" role="status">{previewMessage}</div>}
    </main>
  );
}
