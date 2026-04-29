import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Check, Zap, Crown, Loader2, BookMarked, Sparkles, Settings, FileText, Download, Receipt } from "lucide-react";
import { useGetSubscriptionPlans, useGetSubscriptionStatus, useCreateCheckoutSession, useCreatePortalSession, useGetSubscriptionInvoices, type Invoice } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const PRO_FEATURES = [
  "Unlimited flashcard interactions",
  "Unlimited quiz questions",
  "All 15 study guides",
  "Practice exams",
  "Progress tracking",
];

const SCHOLAR_FEATURES = [
  "Everything in Pro",
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

const INVOICE_STATUS_STYLES: Record<string, string> = {
  paid: "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300",
  open: "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300",
  uncollectible: "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300",
  void: "bg-muted text-muted-foreground",
  draft: "bg-muted text-muted-foreground",
};

function InvoiceHistory({ invoices, loading, hasActiveSub }: { invoices: Invoice[] | undefined; loading: boolean; hasActiveSub: boolean }) {
  // Don't show the section to users who have never had a subscription and
  // therefore have no payment history to surface.
  if (!loading && (!invoices || invoices.length === 0)) {
    return null;
  }

  return (
    <div className="bg-card border border-border rounded-xl p-5 mb-6" data-testid="invoice-history">
      <div className="flex items-center gap-2 mb-4">
        <Receipt className="w-4 h-4 text-primary" />
        <span className="font-semibold text-foreground">Payment history</span>
      </div>

      {loading ? (
        <div className="space-y-2">
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
          <Skeleton className="h-12 rounded-lg" />
        </div>
      ) : (
        <ul className="divide-y divide-border">
          {invoices!.map((inv) => {
            const amount = inv.status === "paid" ? inv.amountPaid : inv.amountDue;
            const statusClass = INVOICE_STATUS_STYLES[inv.status] ?? "bg-muted text-muted-foreground";
            return (
              <li key={inv.id} className="flex items-center justify-between gap-3 py-3" data-testid={`invoice-row-${inv.id}`}>
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">
                      {new Date(inv.created).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                    </p>
                    {inv.number && (
                      <p className="text-xs text-muted-foreground truncate">#{inv.number}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-sm font-semibold text-foreground tabular-nums">
                    {formatPrice(amount, inv.currency)}
                  </span>
                  <Badge variant="secondary" className={`capitalize ${statusClass}`}>
                    {inv.status}
                  </Badge>
                  {inv.invoicePdf || inv.hostedInvoiceUrl ? (
                    <a
                      href={(inv.invoicePdf ?? inv.hostedInvoiceUrl) as string}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center text-primary hover:text-primary/80 p-1.5 rounded-md hover:bg-muted"
                      aria-label="Download invoice PDF"
                      data-testid={`invoice-download-${inv.id}`}
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      )}
      {!hasActiveSub && invoices && invoices.length > 0 && (
        <p className="text-xs text-muted-foreground mt-3">
          Showing your most recent invoices.
        </p>
      )}
    </div>
  );
}

type StatusData = { status: string; tier?: string; subscriptionId?: string; currentPeriodEnd?: string };

export default function SubscriptionPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const { data: plans, isLoading: plansLoading } = useGetSubscriptionPlans();
  const { data: status, isLoading: statusLoading } = useGetSubscriptionStatus();
  // The Stripe Customer Portal opens in a full-page redirect, so returning
  // to /subscription remounts this page and the query refetches on mount.
  const { data: invoices, isLoading: invoicesLoading } = useGetSubscriptionInvoices();
  const createCheckout = useCreateCheckoutSession();
  const createPortal = useCreatePortalSession();

  const [statusData, setStatusData] = useState<StatusData | null>(null);

  useEffect(() => {
    fetch("/api/subscription/status")
      .then((r) => r.json())
      .then(setStatusData)
      .catch(() => {});
  }, []);

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
  const isPro = isActive && statusData?.tier !== "scholar";
  const isScholar = isActive && statusData?.tier === "scholar";

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
    <div className="min-h-full bg-background" data-testid="subscription-page">
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
        <div className={`border rounded-xl p-4 mb-6 flex flex-col sm:flex-row sm:items-center gap-3 ${isScholar ? "bg-purple-50 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800" : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"}`} data-testid="active-subscription-banner">
          <div className="flex items-center gap-3 flex-1">
            {isScholar ? <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0" /> : <Crown className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />}
            <div>
              <p className={`font-semibold ${isScholar ? "text-purple-900 dark:text-purple-300" : "text-green-900 dark:text-green-300"}`}>
                {isScholar ? "You're on Scholar!" : "You're on Pro!"}
              </p>
              <p className={`text-sm ${isScholar ? "text-purple-700 dark:text-purple-400" : "text-green-700 dark:text-green-400"}`}>
                {isScholar ? "You have full access including custom study decks." : "Enjoy unlimited access to all built-in content."}
              </p>
              {statusData?.currentPeriodEnd && (
                <p className={`text-xs mt-0.5 ${isScholar ? "text-purple-600 dark:text-purple-500" : "text-green-600 dark:text-green-500"}`}>
                  Renews: {new Date(statusData.currentPeriodEnd).toLocaleDateString()}
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

      <InvoiceHistory invoices={invoices} loading={invoicesLoading} hasActiveSub={isPro || isScholar} />

      <div className="space-y-5">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Crown className="w-4 h-4 text-primary" />
            <span className="font-semibold text-foreground text-lg">PsychPro Pro</span>
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
                      <><Zap className="w-4 h-4 mr-2" />Subscribe to Pro</>
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

        <div className="bg-card border-2 border-purple-200 dark:border-purple-800 rounded-xl p-5 relative">
          <div className="absolute -top-3 left-5">
            <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">NEW</span>
          </div>
          <div className="flex items-center gap-2 mb-4">
            <BookMarked className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span className="font-semibold text-foreground text-lg">PsychPro Scholar</span>
            <Badge className="ml-auto bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-0">Best Value</Badge>
          </div>

          <div className="space-y-2 mb-5">
            {SCHOLAR_FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm text-foreground">
                <Check className={`w-4 h-4 flex-shrink-0 ${f.startsWith("Everything") ? "text-primary" : "text-purple-500"}`} />
                {f}
              </div>
            ))}
          </div>

          {loading ? (
            <Skeleton className="h-12 rounded-xl" />
          ) : scholarPlans.length > 0 ? (
            <div className="space-y-3">
              {scholarPlans.map((plan) => (
                <div key={plan.priceId} className="border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-semibold text-foreground capitalize">Billed {plan.interval}ly</p>
                      {plan.interval === "year" && <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Save ~33%</p>}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-foreground">{formatPrice(plan.unitAmount, plan.currency)}</p>
                      <p className="text-xs text-muted-foreground">/{plan.interval}</p>
                    </div>
                  </div>
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
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

      <div className="bg-card border border-border rounded-xl p-4 text-center mt-5">
        <p className="text-sm text-muted-foreground">
          Start with <strong className="text-foreground">10 free interactions</strong> — no credit card required.
        </p>
      </div>
      </div>
    </div>
  );
}
