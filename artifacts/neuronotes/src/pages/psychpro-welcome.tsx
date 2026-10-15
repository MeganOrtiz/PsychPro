import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { useCreateCheckoutSession, useGetSubscriptionPlans } from "@workspace/api-client-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { apiErrorMessage, trialPhase, useStudyAccess, useStartTrial } from "@/lib/use-study-access";
import brain from "@/assets/psychpro-chrome-brain.webp";
import wave from "@/assets/psychpro-welcome-wave.webp";
import {
  ArrowLeft,
  ArrowRight,
  Brain,
  Check,
  FileUp,
  Layers3,
  Sparkles,
} from "lucide-react";
import "./psychpro-welcome.css";

type Plan = "monthly" | "annual";

export default function PsychproWelcomePage() {
  const [, navigate] = useLocation();
  const access = useStudyAccess();
  const start = useStartTrial();
  const catalog = useGetSubscriptionPlans();
  const checkout = useCreateCheckoutSession();
  const [dialogPlan, setDialogPlan] = useState<Plan | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const phase = trialPhase(access.data?.psychpro);
  const busy = start.isPending || checkout.isPending;
  const ready = !!access.data && !access.isError;
  const canStart = phase === "available";
  const hasAccess = !!access.data?.psychpro.hasAccess;
  const paid = phase === "paid";
  const trialCopy = canStart
    ? "7 days free · starts only when you choose · 5 AI requests · no card · no automatic charge."
    : phase === "active"
      ? "Your PsychPro free week is active. Subscribing is optional; your trial will not automatically charge."
      : phase === "expired"
        ? "Your free week has ended. Your progress and saved materials are kept. Subscribe to continue studying."
        : paid ? "Your PsychPro access is already active." : "Loading your trial status…";
  const plans = Array.isArray(catalog.data) ? catalog.data : [];
  const monthly = plans.find(p => p.interval === "month");
  const annual = plans.find(p => p.interval === "year");
  const formatPrice = (plan: typeof monthly, fallback: string) => plan
    ? new Intl.NumberFormat("en-US", { style: "currency", currency: plan.currency.toUpperCase() }).format(plan.unitAmount / 100)
    : fallback;
  const monthlyPrice = formatPrice(monthly, "$19.99");
  const annualPrice = formatPrice(annual, "$159.99");
  const annualComparison = monthly && annual && monthly.currency === annual.currency
    ? `save ${formatPrice({ ...monthly, unitAmount: monthly.unitAmount * 12 - annual.unitAmount }, "")} vs monthly · equivalent to ${formatPrice({ ...annual, unitAmount: annual.unitAmount / 12 }, "")}/month.`
    : "Billed annually.";

  useEffect(() => {
    document.title = "PsychPro | Learn. Connect. Expand.";
  }, []);

  async function subscribe(plan: Plan) {
    const selected = plan === "annual" ? annual : monthly;
    if (!selected) {
      toast.error("This billing option is unavailable. Please try the plans page.");
      return;
    }
    try {
      const result = await checkout.mutateAsync({ data: { priceId: selected.priceId } });
      if (!result.url) throw new Error("Checkout did not return a link.");
      window.location.assign(result.url);
    } catch (error) {
      toast.error(apiErrorMessage(error, "Could not start checkout. Please try again."));
    }
  }

  function choose(plan: Plan | null = null) {
    if (!ready || busy) return;
    if (paid) { navigate(plan ? "/subscription" : "/dashboard"); return; }
    if (canStart) {
      setDialogPlan(plan);
      setDialogOpen(true);
    } else if (plan) {
      void subscribe(plan);
    } else {
      navigate(hasAccess ? "/dashboard" : "/subscription?trial=psychpro");
    }
  }

  async function beginTrial() {
    if (busy) return;
    try {
      await start.mutateAsync({ suite: "psychpro" });
      setDialogOpen(false);
      toast.success("Your PsychPro free week has started.");
      navigate("/dashboard");
    } catch (error) {
      setDialogOpen(false);
      if ((error as { status?: number }).status === 409) {
        const refreshed = await access.refetch();
        if (refreshed.data?.psychpro.hasAccess) navigate("/dashboard");
        else toast("Your trial was already used. Choose a subscription to continue.");
      } else {
        toast.error(apiErrorMessage(error, "Could not start your trial. Please try again."));
      }
    }
  }
  const openTrialPreview = (plan: Plan | null = null) => {
    choose(plan);
  };

  return (
    <main className="ppw-page">
      <header className="ppw-header">
        <div className="ppw-wordmark" aria-label="PsychPro">
          <Brain aria-hidden="true" />
          <span>PSYCHPRO</span>
        </div>
        <div className="ppw-header-right">
          <Link
            className="ppw-back"
            href="/eppp/suite"
          >
            <ArrowLeft aria-hidden="true" /> Back to EPPP
          </Link>
        </div>
      </header>

      <section className="ppw-hero">
        <img className="ppw-splash" src={wave} alt="" aria-hidden="true" />
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
            <img className="ppw-brain" src={brain} alt="" />
          </div>
        </div>
        <div className="ppw-hero-action">
          <button type="button" className="ppw-primary" disabled={!ready || busy} onClick={() => openTrialPreview()} data-testid="psychpro-welcome-trial">
            {!ready ? "Loading access…" : hasAccess ? "Open PsychPro Dashboard" : canStart ? "Start My Free Trial" : "View PsychPro Plans"} <ArrowRight aria-hidden="true" />
          </button>
          {access.isError && <p role="alert">Could not load your access. <button type="button" onClick={() => access.refetch()}>Retry</button></p>}
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
            <div className="ppw-price-line"><strong>{monthlyPrice}</strong><span>/ month</span></div>
            <p className="ppw-price-context">If you choose a subscription after your free week.</p>
            <p className="ppw-card-trial">{trialCopy}</p>
            <ul className="ppw-benefits">
              <li><Check aria-hidden="true" /> All flashcards, quizzes, practice exams, and study guides</li>
              <li><Check aria-hidden="true" /> Brain Lab, progress tracking, and your own uploaded or pasted notes</li>
              <li><Check aria-hidden="true" /> 50 AI generation requests each paid month</li>
            </ul>
            <button type="button" className="ppw-primary ppw-pricing-cta" disabled={!ready || busy || (!canStart && !paid && !monthly)} onClick={() => openTrialPreview("monthly")} data-testid="psychpro-welcome-monthly">
              {busy ? "Please wait…" : paid ? "Manage plan" : canStart ? "Start my free week" : "Subscribe monthly"} <ArrowRight aria-hidden="true" />
            </button>
          </article>
          <article className="ppw-pricing ppw-pricing--annual">
            <div className="ppw-plan-heading">
              <h3>Annual</h3>
              <p>PsychPro Suite · full access</p>
            </div>
            <div className="ppw-price-line"><strong>{annualPrice}</strong><span>/ year</span></div>
            <p className="ppw-price-context">If you choose an annual subscription after trial · {annualComparison}</p>
            <p className="ppw-card-trial">{trialCopy}</p>
            <ul className="ppw-benefits">
              <li><Check aria-hidden="true" /> All flashcards, quizzes, practice exams, and study guides</li>
              <li><Check aria-hidden="true" /> Brain Lab, progress tracking, and your own uploaded or pasted notes</li>
              <li><Check aria-hidden="true" /> 50 AI generation requests each paid month</li>
            </ul>
            <button type="button" className="ppw-primary ppw-pricing-cta" disabled={!ready || busy || (!canStart && !paid && !annual)} onClick={() => openTrialPreview("annual")} data-testid="psychpro-welcome-annual">
              {busy ? "Please wait…" : paid ? "Manage plan" : canStart ? "Start my free week" : "Subscribe annually"} <ArrowRight aria-hidden="true" />
            </button>
          </article>
        </div>
        {!catalog.isLoading && (catalog.isError || !monthly || !annual) && (
          <p role="status">Some billing options could not be loaded. <button type="button" onClick={() => catalog.refetch()}>Retry</button> or <Link href="/subscription">view plans</Link>.</p>
        )}
      </section>

      <Dialog open={dialogOpen} onOpenChange={open => { if (!start.isPending) setDialogOpen(open); }}>
          <DialogContent className="ppw-live-dialog">
            <div className="ppw-dialog-icon"><Sparkles aria-hidden="true" /></div>
            <DialogTitle>Your free week is ready to begin.</DialogTitle>
            <DialogDescription>Your 7 days start when you confirm below, with 5 AI generation requests. No card is needed and there is no automatic charge. Use your existing account; your EPPP access stays separate and unchanged.</DialogDescription>
            <div className="ppw-dialog-summary">
              <span>{dialogPlan === "monthly" ? `${monthlyPrice} / month if you choose to subscribe` : dialogPlan === "annual" ? `${annualPrice} / year if you choose to subscribe` : "Choose monthly or annual after your free week"}</span>
              <span>5 AI requests during trial</span>
            </div>
            <button className="ppw-primary ppw-dialog-confirm" type="button" disabled={busy} onClick={() => void beginTrial()} data-testid="psychpro-confirm-trial">{start.isPending ? "Starting…" : "Start my free week"} <ArrowRight aria-hidden="true" /></button>
            <button className="ppw-dialog-cancel" type="button" disabled={busy} onClick={() => setDialogOpen(false)}>Not now</button>
          </DialogContent>
      </Dialog>
    </main>
  );
}
