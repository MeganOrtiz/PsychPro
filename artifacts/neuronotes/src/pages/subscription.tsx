import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Check, Zap, Crown, Loader2 } from "lucide-react";
import { useGetSubscriptionPlans, useGetSubscriptionStatus, useCreateCheckoutSession } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function SubscriptionPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const { toast } = useToast();

  const { data: plans, isLoading: plansLoading } = useGetSubscriptionPlans();
  const { data: status, isLoading: statusLoading } = useGetSubscriptionStatus();
  const createCheckout = useCreateCheckoutSession();

  useEffect(() => {
    const params = new URLSearchParams(search);
    if (params.get("success") === "true") {
      toast({ title: "Subscription activated!", description: "Welcome to NeuroNotes Pro. Enjoy unlimited access." });
    }
    if (params.get("canceled") === "true") {
      toast({ title: "Checkout canceled", description: "Your plan has not changed." });
    }
  }, [search]);

  const isActive = status?.status === "active";

  const handleSubscribe = async (priceId: string) => {
    try {
      const result = await createCheckout.mutateAsync({ data: { priceId } });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch {
      toast({ title: "Error", description: "Could not start checkout. Please try again.", variant: "destructive" });
    }
  };

  const features = [
    "Unlimited flashcard interactions",
    "Unlimited quiz questions",
    "All study guides",
    "Practice exams",
    "Progress tracking",
    "20+ neuroscience topics",
  ];

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto" data-testid="subscription-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Upgrade</h1>
        <p className="text-muted-foreground text-sm mt-1">Unlock unlimited access to all content</p>
      </div>

      {isActive && (
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6 flex items-center gap-3" data-testid="active-subscription-banner">
          <Crown className="w-5 h-5 text-green-600 dark:text-green-400" />
          <div>
            <p className="font-semibold text-green-900 dark:text-green-300">You're on Pro!</p>
            <p className="text-sm text-green-700 dark:text-green-400">Enjoy unlimited access to all features.</p>
            {status?.currentPeriodEnd && (
              <p className="text-xs text-green-600 dark:text-green-500 mt-0.5">
                Renews: {new Date(status.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Crown className="w-5 h-5 text-primary" />
          <span className="font-bold text-foreground text-lg">NeuroNotes Pro</span>
          <Badge variant="secondary" className="ml-auto">Most Popular</Badge>
        </div>

        <div className="space-y-2 my-6">
          {features.map(feature => (
            <div key={feature} className="flex items-center gap-2 text-sm text-foreground">
              <Check className="w-4 h-4 text-primary flex-shrink-0" />
              {feature}
            </div>
          ))}
        </div>

        {plansLoading || statusLoading ? (
          <Skeleton className="h-12 rounded-xl" />
        ) : plans && plans.length > 0 ? (
          <div className="space-y-3">
            {plans.map(plan => (
              <div key={plan.priceId} className="border border-border rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-foreground">{plan.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">Billed {plan.interval}ly</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      {new Intl.NumberFormat("en-US", { style: "currency", currency: plan.currency.toUpperCase() }).format(plan.unitAmount / 100)}
                    </p>
                    <p className="text-xs text-muted-foreground">/{plan.interval}</p>
                  </div>
                </div>
                <Button
                  className="w-full"
                  disabled={isActive || createCheckout.isPending}
                  onClick={() => handleSubscribe(plan.priceId)}
                  data-testid={`button-subscribe-${plan.priceId}`}
                >
                  {createCheckout.isPending ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Processing...</>
                  ) : isActive ? (
                    "Already Subscribed"
                  ) : (
                    <><Zap className="w-4 h-4 mr-2" />Subscribe Now</>
                  )}
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground" data-testid="no-plans">
            <Zap className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="font-medium">Pricing coming soon</p>
            <p className="text-sm mt-1">Check back shortly for subscription options.</p>
          </div>
        )}
      </div>

      <div className="bg-muted/50 rounded-xl p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Start with <strong className="text-foreground">10 free interactions</strong> — no credit card required.
        </p>
      </div>
    </div>
  );
}
