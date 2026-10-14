import { useEffect } from "react";
import { useSearch } from "wouter";
import { Check, Zap, Crown, Loader2, Sparkles, Settings, GraduationCap } from "lucide-react";
import { useGetSubscriptionPlans, useGetSubscriptionStatus, useCreateCheckoutSession, useCreatePortalSession } from "@workspace/api-client-react";
import { EpppPromoLink } from "@/components/eppp-promo-link";
import { StudyTrialPanel } from "@/components/study-trial-panel";
import { useEpppPlans, useEpppCheckout } from "@/lib/use-eppp-purchase";
import { useEntitlements } from "@/lib/use-entitlements";
import { useStudyAccess, isTrialSuite, PSYCHPRO_MONTHLY_AI_LIMIT } from "@/lib/use-study-access";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/brand/page-title";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { PP } from "@/lib/palette";
import { trackEvent } from "@/lib/analytics";

const PSYCHPRO_FEATURES = [
  "Every built-in topic: flashcards, quizzes, study guides, and practice exams",
  "Course mastery exams and progress tracking",
  "Upload PDF, DOCX, or TXT notes, or paste text",
  "AI builds flashcards, quizzes, study guides, and exams from your own material",
  `${PSYCHPRO_MONTHLY_AI_LIMIT} AI generation requests per month (each selected tool counts as one)`,
  "EPPP Mastery Suite not included",
];

type Plan = {
  id: string;
  name: string;
  description?: string | null;
  priceId: string;
  unitAmount: number;
  currency: string;
  interval: string;
  tier: string;
};

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(amount / 100);
}

export default function SubscriptionPage() {
  const search = useSearch();
  const trialParam = new URLSearchParams(search).get("trial");
  const focusSuite = isTrialSuite(trialParam) ? trialParam : null;
  const { data: plans, isLoading: plansLoading } = useGetSubscriptionPlans();
  const { data: status, isLoading: statusLoading } = useGetSubscriptionStatus();
  const { data: access } = useStudyAccess();
  const createCheckout = useCreateCheckoutSession();
  const createPortal = useCreatePortalSession();
  const { data: epppPlans, isLoading: epppPlansLoading } = useEpppPlans();
  const { data: entitlements } = useEntitlements();
  const epppCheckout = useEpppCheckout();

  const isActive = status?.status === "active";
  const psychproPaid = !!access?.psychpro.paid || !!access?.psychpro.legacy;
  const grandfathered = !!access?.psychpro.legacy || (psychproPaid && status?.tier === "pro");
  const epppPaid = !!access?.eppp.paid || !!access?.eppp.legacy;
  const currentPeriodEnd = status?.currentPeriodEnd ?? null;

  useEffect(() => {
    if (!focusSuite) return;
    const el = document.getElementById(`plan-${focusSuite}`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [focusSuite]);

  useEffect(() => {
    if (statusLoading) return;
    const params = new URLSearchParams(search);
    const successReturn = params.get("success") === "true";
    const canceledReturn = params.get("canceled") === "true";
    if (!successReturn && !canceledReturn) return;

    if (successReturn) {
      toast.success("Checkout complete. Your subscription status is updated.");
      trackEvent("checkout_returned", { surface: "subscription", outcome: "success_redirect", subscription_active: isActive });
    } else {
      toast("Checkout canceled. Your plan has not changed.");
      trackEvent("checkout_returned", { surface: "subscription", outcome: "canceled" });
    }
    params.delete("success");
    params.delete("canceled");
    const remaining = params.toString();
    window.history.replaceState(
      window.history.state,
      "",
      `${window.location.pathname}${remaining ? `?${remaining}` : ""}${window.location.hash}`,
    );
  }, [isActive, search, statusLoading]);

  const psychproPlans = ((plans as Plan[] | undefined) ?? []).slice().sort((a, b) => a.unitAmount - b.unitAmount);

  async function handleSubscribe(priceId: string) {
    try {
      const selectedPlan = psychproPlans.find((plan) => plan.priceId === priceId);
      const result = await createCheckout.mutateAsync({ data: { priceId } });
      if (result.url) {
        trackEvent("checkout_started", { surface: "subscription", product_tier: "psychpro", billing_interval: selectedPlan?.interval ?? "unknown" });
        window.location.href = result.url;
      }
    } catch {
      toast.error("Could not start checkout. Please try again.");
    }
  }

  async function handleManageSubscription() {
    try {
      const result = await createPortal.mutateAsync();
      if (result.url) {
        trackEvent("billing_portal_opened", { surface: "subscription" });
        window.location.href = result.url;
      }
    } catch {
      toast.error("Could not open the billing portal. Please try again.");
    }
  }

  async function handleEpppCheckout(priceId: string) {
    try {
      const result = await epppCheckout.mutateAsync({ priceId });
      if (result.url) {
        trackEvent("checkout_started", { surface: "subscription", product_tier: "eppp" });
        window.location.href = result.url;
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start checkout. Please try again.");
    }
  }

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const loading = plansLoading || statusLoading;
  const epppUntil = entitlements?.epppAccessUntil ?? null;

  return (
    <div className="min-h-full study-page-bg" data-testid="subscription-page">
      <style>{`
        .sub-plan { position: relative; padding: 24px; scroll-margin-top: 24px; }
        .sub-plan--featured { border-color: rgba(var(--pp-bright-rgb), 0.60); }
        .sub-icon-chip { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 11px; flex-shrink: 0; }
        .sub-bill { position: relative; padding: 16px; }
        .sub-price {
          background: ${P.surf};
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          letter-spacing: -0.01em;
        }
      `}</style>
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
        <PageTitle title="Plans" icon={Crown} subtitle="PsychPro for coursework and your own material. EPPP Mastery Suite for licensure prep." className="mb-6" />

        {psychproPaid && (
          <div className="mat-opaque rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3" style={{ color: PP.text }} data-testid="active-subscription-banner">
            <div className="flex items-center gap-3 flex-1">
              <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: P.surf }} />
              <div>
                <p className="font-semibold text-foreground">You're subscribed to PsychPro</p>
                <p className="text-sm text-muted-foreground">
                  {grandfathered
                    ? "You're on an earlier plan. Your price and access stay exactly as they are; manage billing below."
                    : "Full built-in content plus uploads and AI tools."}
                </p>
                {currentPeriodEnd && <p className="text-xs mt-0.5 text-muted-foreground">Renews: {new Date(currentPeriodEnd).toLocaleDateString()}</p>}
              </div>
            </div>
            <Button variant="outline" size="sm" className="sm:flex-shrink-0" onClick={handleManageSubscription} disabled={createPortal.isPending} data-testid="button-manage-subscription">
              {createPortal.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Opening...</> : <><Settings className="w-4 h-4 mr-2" />Manage subscription</>}
            </Button>
          </div>
        )}

        <div className="space-y-5">
          <div id="plan-psychpro" className="mat-opaque mat-opaque-interactive sub-plan sub-plan--featured" data-testid="psychpro-plan">
            <div className="flex items-center gap-3 mb-5">
              <span className="mat-icon-well sub-icon-chip"><Sparkles className="w-[18px] h-[18px]" style={{ color: P.surf }} /></span>
              <span className="font-semibold text-foreground text-lg">PsychPro</span>
            </div>
            <div className="space-y-2 mb-5">
              {PSYCHPRO_FEATURES.map((f) => (
                <div key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  {f}
                </div>
              ))}
            </div>

            <div className="mb-4"><StudyTrialPanel suite="psychpro" highlight={focusSuite === "psychpro"} onSubscribe={() => scrollTo("psychpro-billing")} /></div>

            <div id="psychpro-billing">
              {loading ? (
                <Skeleton className="h-12 rounded-xl" />
              ) : psychproPlans.length > 0 ? (
                <div className="space-y-3">
                  {psychproPlans.map((plan) => (
                    <div key={plan.priceId} className="mat-glass mat-glass-interactive sub-bill">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground capitalize">Billed {plan.interval}ly</p>
                          {plan.interval === "year" && <p className="text-xs font-semibold" style={{ color: P.surf }}>Save ~33%</p>}
                        </div>
                        <div className="text-right">
                          <p className="sub-price text-3xl font-extrabold">{formatPrice(plan.unitAmount, plan.currency)}</p>
                          <p className="text-xs text-muted-foreground">/{plan.interval}</p>
                        </div>
                      </div>
                      <Button className="w-full" disabled={psychproPaid || createCheckout.isPending} onClick={() => handleSubscribe(plan.priceId)} data-testid={`button-subscribe-${plan.priceId}`}>
                        {createCheckout.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : psychproPaid ? "Current plan" : <><Zap className="w-4 h-4 mr-2" />Subscribe to PsychPro</>}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground"><p className="text-sm">Pricing coming soon</p></div>
              )}
            </div>
          </div>

          <div id="plan-eppp" className="mat-opaque mat-opaque-interactive sub-plan relative" data-testid="eppp-plan">
            <div className="absolute -top-3 left-5 z-10">
              <span className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: P.surf, color: PP.chipInk, boxShadow: `0 0 18px -4px ${P.surf}` }}>EPPP</span>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <span className="mat-icon-well sub-icon-chip"><GraduationCap className="w-[18px] h-[18px]" style={{ color: P.surf }} /></span>
              <span className="font-semibold text-foreground text-lg">EPPP Mastery Suite</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Full access to the EPPP Mastery Suite: knowledge domains, question bank, domain and full-length exams,
              missed-question review, and more. Sold separately; PsychPro does not include EPPP, and EPPP does not include PsychPro.
            </p>

            {epppPaid && (
              <div className="rounded-xl p-3 mb-4 text-sm" style={{ background: `${P.surf}1a`, border: `1px solid ${P.surf}55`, color: PP.text }} data-testid="eppp-active-banner">
                <span className="font-semibold">You have paid EPPP access.</span>
                {epppUntil && <span className="text-muted-foreground"> Active until {new Date(epppUntil).toLocaleDateString()}.</span>}
              </div>
            )}

            <div className="mb-4"><StudyTrialPanel suite="eppp" highlight={focusSuite === "eppp"} onSubscribe={() => scrollTo("eppp-billing")} /></div>
            {!epppPaid && <div className="mb-4"><EpppPromoLink /></div>}

            <div id="eppp-billing">
              {epppPlansLoading ? (
                <Skeleton className="h-12 rounded-xl" />
              ) : (epppPlans?.monthly || (epppPlans?.oneTime?.length ?? 0) > 0) ? (
                <div className="space-y-3">
                  {epppPlans?.monthly && (
                    <div className="mat-glass mat-glass-interactive sub-bill" data-testid="eppp-bill-monthly">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">Monthly subscription</p>
                          <p className="text-xs text-muted-foreground">Cancel anytime</p>
                        </div>
                        <div className="text-right">
                          <p className="sub-price text-3xl font-extrabold">{formatPrice(epppPlans.monthly.unitAmount, epppPlans.monthly.currency)}</p>
                          <p className="text-xs text-muted-foreground">/month</p>
                        </div>
                      </div>
                      <Button className="w-full" disabled={epppPaid || epppCheckout.isPending} onClick={() => handleEpppCheckout(epppPlans.monthly!.priceId)} data-testid="button-eppp-monthly">
                        {epppCheckout.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : epppPaid ? "Current access" : <><Zap className="w-4 h-4 mr-2" />Subscribe monthly</>}
                      </Button>
                    </div>
                  )}
                  {epppPlans?.oneTime?.map((pack) => (
                    <div key={pack.priceId} className="mat-glass mat-glass-interactive sub-bill" data-testid={`eppp-bill-${pack.months}mo`}>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-foreground">{pack.months} months access</p>
                          <p className="text-xs text-muted-foreground">One-time payment</p>
                        </div>
                        <div className="text-right">
                          <p className="sub-price text-3xl font-extrabold">{formatPrice(pack.unitAmount, pack.currency)}</p>
                          <p className="text-xs text-muted-foreground">one-time</p>
                        </div>
                      </div>
                      <Button className="w-full" disabled={epppPaid || epppCheckout.isPending} onClick={() => handleEpppCheckout(pack.priceId)} data-testid={`button-eppp-${pack.months}mo`}>
                        {epppCheckout.isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</> : epppPaid ? "Current access" : <><GraduationCap className="w-4 h-4 mr-2" />Get {pack.months} months</>}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground"><p className="text-sm">Pricing coming soon</p></div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 text-center mt-5">
          <p className="text-sm text-muted-foreground">
            Each suite has one free 7-day trial, started only when you choose. No card required and no automatic charge.
            Books you own stay in your library permanently, whatever your plan.
          </p>
        </div>
      </div>
    </div>
  );
}
