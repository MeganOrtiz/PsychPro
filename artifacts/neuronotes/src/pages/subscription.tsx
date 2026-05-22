import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Check, Zap, Crown, Loader2, BookMarked, Sparkles, Settings } from "lucide-react";
import { useGetSubscriptionPlans, useGetSubscriptionStatus, useCreateCheckoutSession, useCreatePortalSession } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
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

  const loading = plansLoading || statusLoading;

  return (
    <div className="min-h-full study-page-bg" data-testid="subscription-page">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Upgrade</h1>
        </div>
        <p className="text-sm text-muted-foreground">Choose the plan that fits your study goals</p>
      </div>

      {(isPro || isScholar) && (
        <div
          className="border rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3"
          style={{
            background: `linear-gradient(135deg, ${P.surface}, ${P.bg})`,
            borderColor: `${P.surf}66`,
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
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground text-lg">PsychPro {PRO_DISPLAY_NAME}</span>
            <Badge variant="secondary" className="ml-auto">Most Popular</Badge>
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
                <div key={plan.priceId} className="border border-border rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground capitalize">Billed {plan.interval}ly</p>
                      {plan.interval === "year" && <p className="text-xs text-green-600 dark:text-green-400 font-medium">Save ~33%</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{formatPrice(plan.unitAmount, plan.currency)}</p>
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
        <div
          className="bg-card border-2 rounded-xl p-5 relative"
          style={{ borderColor: `${P.surf}88` }}
        >
          <div className="absolute -top-3 left-5">
            <span
              className="text-white text-xs font-bold px-3 py-1 rounded-full"
              style={{ background: P.tealDeep }}
            >
              NEW
            </span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <BookMarked className="w-4 h-4" style={{ color: P.tealDeep }} />
            <span className="font-semibold text-foreground text-lg">PsychPro Scholar</span>
            <Badge
              className="ml-auto border-0 text-white"
              style={{ background: P.teal }}
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
                <div
                  key={plan.priceId}
                  className="border rounded-xl p-4"
                  style={{ borderColor: `${P.surf}55` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground capitalize">Billed {plan.interval}ly</p>
                      {plan.interval === "year" && (
                        <p className="text-xs font-medium" style={{ color: P.tealDeep }}>Save ~33%</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{formatPrice(plan.unitAmount, plan.currency)}</p>
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
