import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Check, Zap, Crown, Loader2, BookMarked, Sparkles, Settings, GraduationCap } from "lucide-react";
import { useGetSubscriptionPlans, useGetSubscriptionStatus, useCreateCheckoutSession, useCreatePortalSession } from "@workspace/api-client-react";
import { useEpppPlans, useEpppCheckout } from "@/lib/use-eppp-purchase";
import { useEntitlements } from "@/lib/use-entitlements";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/brand/page-title";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { FREE_FLASHCARD_PREVIEW, FREE_QUIZ_LIMIT, FREE_EXAM_LIMIT } from "@/lib/limits";

// B-1: display name is "Master" (the internal subscriptionStatus / Stripe
// metadata stays "pro" — see api-server/routes/subscription.ts).
const PRO_DISPLAY_NAME = "Master";

const PRO_FEATURES = [
  "Unlimited topics, flashcards, quizzes, and exams",
  "Study guides for every topic",
  "Practice exams",
  "Progress tracking",
];

const SCHOLAR_FEATURES = [
  `Everything in ${PRO_DISPLAY_NAME}`,
  "Upload PDF, DOCX, or TXT notes",
  "Paste text directly",
  "AI generates flashcards from your content only",
  "AI generates quiz questions from your content only",
  "AI generates a study guide from your content only",
  "Practice exams from your uploaded material",
  "Unlimited custom study decks",
];

type Plan = {
  id: string;
  name: string;
  description: string | null;
  priceId: string;
  unitAmount: number;
  currency: string;
  interval: string;
};

function formatPrice(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(amount / 100);
}

export default function SubscriptionPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const { data: plans, isLoading: plansLoading } = useGetSubscriptionPlans();
  const { data: status, isLoading: statusLoading } = useGetSubscriptionStatus();
  const createCheckout = useCreateCheckoutSession();
  const createPortal = useCreatePortalSession();
  const { data: epppPlans, isLoading: epppPlansLoading } = useEpppPlans();
  const { data: entitlements } = useEntitlements();
  const epppCheckout = useEpppCheckout();

  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get("success") === "true") {
      toast.success("Subscription activated! Welcome to PsychPro.");
    }
    if (params.get("canceled") === "true") {
      toast("Checkout canceled. Your plan has not changed.");
    }
  }, [search]);

  const isActive = status?.status === "active";
  const tier = status?.tier ?? null;
  const isScholar = isActive && tier === "scholar";
  const isPro = isActive && !isScholar;
  const currentPeriodEnd = status?.currentPeriodEnd ?? null;

  const proPlans = (plans as Plan[] | undefined)?.filter((p) => !p.name.toLowerCase().includes("scholar")) ?? [];
  const scholarPlans = (plans as Plan[] | undefined)?.filter((p) => p.name.toLowerCase().includes("scholar")) ?? [];

  async function handleSubscribe(priceId: string) {
    try {
      const result = await createCheckout.mutateAsync({ data: { priceId } });
      if (result.url) window.location.href = result.url;
    } catch {
      toast.error("Could not start checkout. Please try again.");
    }
  }

  async function handleManageSubscription() {
    try {
      const result = await createPortal.mutateAsync();
      if (result.url) window.location.href = result.url;
    } catch {
      toast.error("Could not open the billing portal. Please try again.");
    }
  }

  async function handleEpppCheckout(priceId: string) {
    try {
      const result = await epppCheckout.mutateAsync({ priceId });
      if (result.url) window.location.href = result.url;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not start checkout. Please try again.");
    }
  }

  const loading = plansLoading || statusLoading;
  const epppActive = !!entitlements?.epppAccess;
  const epppUntil = entitlements?.epppAccessUntil ?? null;

  return (
    <div className="min-h-full study-page-bg" data-testid="subscription-page">
      <style>{`
        .sub-plan {
          position: relative;
          border-radius: 18px;
          padding: 24px;
          background:
            radial-gradient(135% 90% at 100% 0%, ${P.surf}1f, transparent 58%),
            linear-gradient(158deg, ${P.surface}, ${P.bg});
          border: 1px solid ${P.surf}33;
          box-shadow: 0 20px 44px -26px rgba(0,0,0,0.85), inset 0 1px 0 ${P.surf}1a;
          transition: transform 240ms ease, box-shadow 240ms ease, border-color 240ms ease;
        }
        .sub-plan::before {
          content: "";
          position: absolute;
          inset: 0 22px auto 22px;
          height: 2px;
          border-radius: 0 0 3px 3px;
          background: linear-gradient(90deg, transparent, ${P.surf}, transparent);
          opacity: 0.8;
        }
        .sub-plan--featured {
          border-color: ${P.surf}55;
          box-shadow: 0 24px 54px -24px rgba(0,0,0,0.9), 0 0 0 1px ${P.surf}22, 0 0 46px -18px ${P.surf}66;
        }
        .sub-plan:hover {
          transform: translateY(-3px);
          border-color: ${P.surf}80;
          box-shadow: 0 30px 64px -24px rgba(0,0,0,0.92), 0 0 52px -16px ${P.surf}80;
        }
        .sub-icon-chip {
          display: inline-flex; align-items: center; justify-content: center;
          width: 36px; height: 36px; border-radius: 11px; flex-shrink: 0;
          background: ${P.surf}1f; border: 1px solid ${P.surf}45;
          box-shadow: 0 0 20px -7px ${P.surf}99, inset 0 1px 0 ${P.surf}26;
        }
        .sub-bill {
          position: relative;
          border-radius: 14px;
          padding: 16px;
          background: linear-gradient(150deg, ${P.surfaceElev}59, ${P.bg}cc);
          border: 1px solid ${P.surf}26;
          transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
        }
        .sub-bill:hover {
          transform: translateY(-2px);
          border-color: ${P.surf}5e;
          box-shadow: 0 18px 36px -24px rgba(0,0,0,0.85), 0 0 28px -14px ${P.surf}73;
        }
        .sub-price {
          background: linear-gradient(180deg, ${P.mist}, ${P.surf});
          -webkit-background-clip: text; background-clip: text;
          -webkit-text-fill-color: transparent; color: transparent;
          filter: drop-shadow(0 0 14px ${P.surf}55);
          letter-spacing: -0.01em;
        }
      `}</style>
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
      <PageTitle
        title="Upgrade"
        icon={Crown}
        subtitle="Choose the plan that fits your study goals"
        className="mb-6"
      />

      {(isPro || isScholar) && (
        <div
          className="border rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3"
          style={{
            background:
              "radial-gradient(125% 80% at 50% 0%, rgba(118,228,247,0.14) 0%, rgba(118,228,247,0.00) 58%), linear-gradient(145deg, rgba(11,54,70,0.81), rgba(6,33,46,0.90))",
            borderColor: "rgba(118,228,247,0.26)",
            backdropFilter: "blur(18px) saturate(135%)",
            WebkitBackdropFilter: "blur(18px) saturate(135%)",
            boxShadow:
              "inset 0 1px 0 rgba(255,255,255,0.13), inset 0 0 44px -22px rgba(118,228,247,0.48), 0 0 32px -10px rgba(118,228,247,0.38), 0 20px 46px -26px rgba(0,0,0,0.66)",
            color: "#FFFFFF",
          }}
          data-testid="active-subscription-banner"
        >
          <div className="flex items-center gap-3 flex-1">
            {isScholar
              ? <Sparkles className="w-5 h-5 flex-shrink-0" style={{ color: P.surf }} />
              : <Crown className="w-5 h-5 flex-shrink-0" style={{ color: P.surf }} />}
            <div>
              <p className="font-semibold text-white">
                {isScholar ? "You're on Scholar!" : `You're on ${PRO_DISPLAY_NAME}!`}
              </p>
              <p className="text-sm text-white/80">
                {isScholar ? "You have full access including custom study decks." : "Enjoy unlimited access to all built-in content."}
              </p>
              {currentPeriodEnd && (
                <p className="text-xs mt-0.5 text-white/60">
                  Renews: {new Date(currentPeriodEnd).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="sm:flex-shrink-0"
            onClick={handleManageSubscription}
            disabled={createPortal.isPending}
            data-testid="button-manage-subscription"
          >
            {createPortal.isPending ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Opening...</>
            ) : (
              <><Settings className="w-4 h-4 mr-2" />Manage subscription</>
            )}
          </Button>
        </div>
      )}

      <div className="space-y-5">
        <div className="sub-plan sub-plan--featured">
          <div className="flex items-center gap-3 mb-5">
            <span className="sub-icon-chip">
              <Crown className="w-[18px] h-[18px]" style={{ color: P.surf }} />
            </span>
            <span className="font-semibold text-foreground text-lg">PsychPro {PRO_DISPLAY_NAME}</span>
            <Badge
              className="ml-auto border-0 text-[#06232D] font-semibold"
              style={{ background: P.surf, boxShadow: `0 0 18px -4px ${P.surf}` }}
            >
              Most Popular
            </Badge>
          </div>

          <div className="space-y-2 mb-5">
            {PRO_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                <Check className="w-4 h-4 text-primary flex-shrink-0" />
                {f}
              </div>
            ))}
          </div>

          {loading ? (
            <Skeleton className="h-12 rounded-xl" />
          ) : proPlans.length > 0 ? (
            <div className="space-y-3">
              {proPlans.map((plan) => (
                <div key={plan.priceId} className="sub-bill">
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
                  <Button
                    className="w-full"
                    disabled={isPro || isScholar || createCheckout.isPending}
                    onClick={() => handleSubscribe(plan.priceId)}
                    data-testid={`button-subscribe-${plan.priceId}`}
                  >
                    {createCheckout.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                    ) : isPro || isScholar ? (
                      isScholar ? "Included in Scholar" : "Current Plan"
                    ) : (
                      <><Zap className="w-4 h-4 mr-2" />Subscribe to {PRO_DISPLAY_NAME}</>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">Pricing coming soon</p>
            </div>
          )}
        </div>

        {/* Scholar tier — recolored from purple to the cerulean/teal study
            palette so it sits in the same brand family as the rest of the app. */}
        <div className="sub-plan relative">
          <div className="absolute -top-3 left-5 z-10">
            <span
              className="text-[#06232D] text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: P.surf, boxShadow: `0 0 18px -4px ${P.surf}` }}
            >
              NEW
            </span>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <span className="sub-icon-chip">
              <BookMarked className="w-[18px] h-[18px]" style={{ color: P.surf }} />
            </span>
            <span className="font-semibold text-foreground text-lg">PsychPro Scholar</span>
            <Badge
              className="ml-auto border-0 text-[#06232D] font-semibold"
              style={{ background: P.teal, boxShadow: `0 0 18px -4px ${P.teal}` }}
            >
              Best Value
            </Badge>
          </div>

          <div className="space-y-2 mb-5">
            {SCHOLAR_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                <Check
                  className="w-4 h-4 flex-shrink-0"
                  style={{ color: f.startsWith("Everything") ? undefined : P.tealDeep }}
                />
                {f}
              </div>
            ))}
          </div>

          {loading ? (
            <Skeleton className="h-12 rounded-xl" />
          ) : scholarPlans.length > 0 ? (
            <div className="space-y-3">
              {scholarPlans.map((plan) => (
                <div key={plan.priceId} className="sub-bill">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground capitalize">Billed {plan.interval}ly</p>
                      {plan.interval === "year" && (
                        <p className="text-xs font-medium" style={{ color: P.tealDeep }}>Save ~33%</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="sub-price text-3xl font-extrabold">{formatPrice(plan.unitAmount, plan.currency)}</p>
                      <p className="text-xs text-muted-foreground">/{plan.interval}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full text-white"
                    style={{ background: P.tealDeep }}
                    disabled={isScholar || createCheckout.isPending}
                    onClick={() => handleSubscribe(plan.priceId)}
                    data-testid={`button-subscribe-${plan.priceId}`}
                  >
                    {createCheckout.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                    ) : isScholar ? (
                      "Current Plan"
                    ) : (
                      <><Sparkles className="w-4 h-4 mr-2" />Subscribe to Scholar</>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">Pricing coming soon</p>
            </div>
          )}
        </div>

        {/* EPPP Mastery Suite — a SEPARATE access level, sold independently of
            Master & Scholar. Three options: $99/mo, or one-time 6mo / 12mo. */}
        <div className="sub-plan relative" data-testid="eppp-plan">
          <div className="absolute -top-3 left-5 z-10">
            <span
              className="text-[#06232D] text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: P.surf, boxShadow: `0 0 18px -4px ${P.surf}` }}
            >
              EPPP
            </span>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <span className="sub-icon-chip">
              <GraduationCap className="w-[18px] h-[18px]" style={{ color: P.surf }} />
            </span>
            <span className="font-semibold text-foreground text-lg">EPPP Mastery Suite</span>
            <Badge
              className="ml-auto border-0 text-[#06232D] font-semibold"
              style={{ background: P.surf, boxShadow: `0 0 18px -4px ${P.surf}` }}
            >
              Separate access
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Full access to the EPPP Mastery Suite — knowledge domains, question
            bank, domain &amp; full-length exams, missed-question review, and more.
            Sold separately from Master &amp; Scholar.
          </p>

          {epppActive && (
            <div
              className="rounded-xl p-3 mb-4 text-sm"
              style={{ background: `${P.surf}1a`, border: `1px solid ${P.surf}55`, color: "#FFFFFF" }}
              data-testid="eppp-active-banner"
            >
              <span className="font-semibold">You have EPPP access.</span>
              {epppUntil && (
                <span className="text-white/80">
                  {" "}Active until {new Date(epppUntil).toLocaleDateString()}.
                </span>
              )}
            </div>
          )}

          {epppPlansLoading ? (
            <Skeleton className="h-12 rounded-xl" />
          ) : (epppPlans?.monthly || (epppPlans?.oneTime?.length ?? 0) > 0) ? (
            <div className="space-y-3">
              {epppPlans?.monthly && (
                <div className="sub-bill" data-testid="eppp-bill-monthly">
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
                  <Button
                    className="w-full"
                    disabled={epppCheckout.isPending}
                    onClick={() => handleEpppCheckout(epppPlans.monthly!.priceId)}
                    data-testid="button-eppp-monthly"
                  >
                    {epppCheckout.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                    ) : (
                      <><Zap className="w-4 h-4 mr-2" />Subscribe monthly</>
                    )}
                  </Button>
                </div>
              )}

              {epppPlans?.oneTime?.map((pack) => (
                <div key={pack.priceId} className="sub-bill" data-testid={`eppp-bill-${pack.months}mo`}>
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
                  <Button
                    className="w-full"
                    disabled={epppCheckout.isPending}
                    onClick={() => handleEpppCheckout(pack.priceId)}
                    data-testid={`button-eppp-${pack.months}mo`}
                  >
                    {epppCheckout.isPending ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                    ) : (
                      <><GraduationCap className="w-4 h-4 mr-2" />Get {pack.months} months</>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p className="text-sm">Pricing coming soon</p>
            </div>
          )}
        </div>
      </div>

      {/* B-14: the free tier is no longer "N topics fully unlocked" — it's
          a permanent preview across every topic. Copy reflects that. */}
      <div className="bg-card border border-border rounded-xl p-4 text-center mt-5">
        <p className="text-sm text-muted-foreground">
          Free includes <strong className="text-foreground">{FREE_FLASHCARD_PREVIEW} flashcards per topic</strong>,{" "}
          <strong className="text-foreground">{FREE_QUIZ_LIMIT} quiz</strong>, and{" "}
          <strong className="text-foreground">{FREE_EXAM_LIMIT} practice exam</strong> — no credit card required.
        </p>
      </div>
      </div>
    </div>
  );
}
