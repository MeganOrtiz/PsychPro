import type { ReactNode } from "react";
import { Link } from "wouter";
import {
  ArrowLeft,
  BarChart3,
  Brain,
  Check,
  ClipboardList,
  FileText,
  Layers,
  ListChecks,
  Loader2,
  Target,
  type LucideIcon,
} from "lucide-react";
import psychproBrain from "@/assets/psychpro-chrome-brain.webp";
import epppCrown from "@/assets/eppp-chrome-crown.webp";
import "./paid-plans.css";

export type PaidPlanOption = {
  priceId: string;
  title: string;
  amount: string;
  period: string;
  billingNote: string;
  features: string[];
  featured?: boolean;
  badge?: string;
};

type Suite = "psychpro" | "eppp";

export interface PaidPlansViewProps {
  psychproPlans: PaidPlanOption[];
  epppPlans: PaidPlanOption[];
  onSelect: (suite: Suite, priceId: string) => void;
  busyPriceId: string | null;
  psychproDisabled?: boolean;
  epppDisabled?: boolean;
  psychproState?: ReactNode;
  epppState?: ReactNode;
  accountStatus?: ReactNode;
}

type Feature = { icon: LucideIcon; label: string };

const PSYCHPRO_FEATURES: Feature[] = [
  { icon: Layers, label: "Flashcards & Quizzes" },
  { icon: ClipboardList, label: "Study Guides & Resources" },
  { icon: Brain, label: "Interactive 3D Brain Lab" },
  { icon: BarChart3, label: "Progress Tracking" },
];

const EPPP_FEATURES: Feature[] = [
  { icon: FileText, label: "8 EPPP Domains" },
  { icon: Target, label: "Full-Length Practice Exams" },
  { icon: ListChecks, label: "Missed Question Review" },
  { icon: BarChart3, label: "Readiness Tracking" },
];

function PlanTile({ suite, plan, disabled, busyPriceId, onSelect }: {
  suite: Suite;
  plan: PaidPlanOption;
  disabled: boolean;
  busyPriceId: string | null;
  onSelect: PaidPlansViewProps["onSelect"];
}) {
  const busy = busyPriceId === plan.priceId;
  const locked = disabled || busyPriceId !== null;
  const id = suite === "psychpro" ? `button-subscribe-${plan.priceId}` : `button-eppp-${plan.priceId}`;
  return (
    <button
      type="button"
      className={`ppl-tile${plan.featured ? " is-featured" : ""}${busy ? " is-busy" : ""}`}
      data-testid={id}
      id={id}
      data-price-id={plan.priceId}
      data-suite={suite}
      disabled={locked}
      aria-busy={busy || undefined}
      onClick={() => onSelect(suite, plan.priceId)}
    >
      {plan.badge ? <span className="ppl-badge">{plan.badge}</span> : <span className="ppl-badge-spacer" aria-hidden />}
      <span className="ppl-tile-title">{plan.title}</span>
      <span className="ppl-price">
        <span className="ppl-amount">{plan.amount}</span>
        <span className="ppl-period">{plan.period}</span>
      </span>
      <span className="ppl-note">{plan.billingNote}</span>
      <span className="ppl-rule" aria-hidden />
      <span className="ppl-list">
        {plan.features.map((f) => (
          <span key={f} className="ppl-li">
            <Check aria-hidden className="ppl-check" />
            <span>{f}</span>
          </span>
        ))}
      </span>
      {busy && <span className="ppl-cta" role="status"><Loader2 className="ppl-spin" aria-hidden />Opening checkout</span>}
    </button>
  );
}

function SuitePanel({ suite, art, title, tagline, intro, features, extra, plans, state, disabled, busyPriceId, onSelect }: {
  suite: Suite;
  art: string;
  title: string;
  tagline: string;
  intro: string;
  features: Feature[];
  extra?: string;
  plans: PaidPlanOption[];
  state?: ReactNode;
  disabled: boolean;
  busyPriceId: string | null;
  onSelect: PaidPlansViewProps["onSelect"];
}) {
  return (
    <section className={`ppl-suite ppl-suite--${suite}`} aria-labelledby={`ppl-${suite}-title`} data-testid={`plans-suite-${suite}`}>
      <img src={art} alt="" aria-hidden className="ppl-art" width={1200} height={951} />
      <h2 id={`ppl-${suite}-title`} className="ppl-suite-title">{title}</h2>
      <p className="ppl-tagline">{tagline}</p>
      <p className="ppl-intro">{intro}</p>
      <ul className="ppl-band">
        {features.map(({ icon: Icon, label }) => (
          <li key={label}><Icon aria-hidden /><span>{label}</span></li>
        ))}
      </ul>
      {extra ? <p className="ppl-extra">{extra}</p> : null}
      {state ? (
        <div className="ppl-state">{state}</div>
      ) : (
        <div className={`ppl-grid ppl-grid--${Math.min(plans.length, 3)}`}>
          {plans.map((p) => (
            <PlanTile key={p.priceId} suite={suite} plan={p} disabled={disabled} busyPriceId={busyPriceId} onSelect={onSelect} />
          ))}
        </div>
      )}
      <p className="ppl-foot">
        <span>Purchased separately</span><span aria-hidden>|</span><span>All prices in USD</span>
      </p>
    </section>
  );
}

export function PaidPlansView(props: PaidPlansViewProps) {
  const { psychproPlans, epppPlans, onSelect, busyPriceId, psychproDisabled = false, epppDisabled = false, psychproState, epppState, accountStatus } = props;
  return (
    <div className="ppl-root" data-testid="paid-plans-view">
      <header className="ppl-header">
        <Link href="/" className="ppl-home" aria-label="PsychPro home">PSYCHPRO</Link>
        <Link href="/" className="ppl-back" data-testid="link-back-home">
          <ArrowLeft aria-hidden /> Back to home
        </Link>
      </header>
      <main className="ppl-main">
        <h1 className="ppl-h1">Choose Your Plan</h1>
        <p className="ppl-sub">Two powerful suites. One streamlined way to study, grow, and reach your goals.</p>
        {accountStatus ? <div className="ppl-account">{accountStatus}</div> : null}
        <div className="ppl-suites">
          <SuitePanel
            suite="psychpro" art={psychproBrain} title="PsychPro Suite" tagline="Learn. Connect. Expand."
            intro="Flashcards, quizzes, study guides, practice exams, and the Brain Lab, all in one place."
            features={PSYCHPRO_FEATURES}
            extra="Upload PDFs, DOCX, or TXT files or paste notes, then generate study materials with 50 AI generation requests per paid month."
            plans={psychproPlans} state={psychproState} disabled={psychproDisabled} busyPriceId={busyPriceId} onSelect={onSelect}
          />
          <SuitePanel
            suite="eppp" art={epppCrown} title="EPPP Mastery Suite" tagline="Study With Confidence."
            intro="Domain-specific lessons, full-length practice exams, missed-question review, and clinical cases — all in one system."
            extra="Includes the question bank, domain mastery exams, clinical integration cases, and rapid review."
            features={EPPP_FEATURES}
            plans={epppPlans} state={epppState} disabled={epppDisabled} busyPriceId={busyPriceId} onSelect={onSelect}
          />
        </div>
      </main>
    </div>
  );
}

export default PaidPlansView;
