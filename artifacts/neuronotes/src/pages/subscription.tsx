import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link, useLocation, useSearch } from "wouter";
import { useGetSubscriptionPlans, useGetSubscriptionStatus, useGetUserProfile, getGetSubscriptionStatusQueryKey, getGetUserProfileQueryKey, useCreateCheckoutSession, useCreatePortalSession } from "@workspace/api-client-react";
import { toast } from "sonner";
import { PaidPlansView } from "@/components/billing/paid-plans-view";
import { useAuthReady } from "@/components/auth/clerk-token-bridge";
import { useEpppPlans, useEpppCheckout } from "@/lib/use-eppp-purchase";
import { useStudyAccess } from "@/lib/use-study-access";
import { psychproPlanOptions, epppPlanOptions } from "@/lib/paid-plan-options";
import { checkoutChoice, checkoutAuthHref, rememberPendingCheckout, readPendingCheckout, clearPendingCheckout, type CheckoutChoice } from "@/lib/pending-checkout";
import { clearPendingTrial } from "@/lib/pending-trial";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { trackEvent } from "@/lib/analytics";
import { useBillingReturn } from "@/lib/use-billing-return";
import { QueryError } from "@/components/query-error";

export default function SubscriptionPage() {
  useBillingReturn();
  const { isLoaded, isSignedIn } = useAuth();
  const authReady = useAuthReady();
  const [, navigate] = useLocation();
  const search = useSearch();
  const authenticated = authReady && !!isSignedIn;
  const plans = useGetSubscriptionPlans();
  const epppPlans = useEpppPlans();
  const access = useStudyAccess();
  const status = useGetSubscriptionStatus({ query: { queryKey: getGetSubscriptionStatusQueryKey(), enabled: authenticated } });
  const profile = useGetUserProfile({ query: { queryKey: getGetUserProfileQueryKey(), enabled: authenticated } });
  const psychproCheckout = useCreateCheckoutSession();
  const epppCheckout = useEpppCheckout();
  const portal = useCreatePortalSession();
  const [busyPriceId, setBusyPriceId] = useState<string | null>(null);
  const submitting = useRef(false);
  const resumed = useRef<string | null>(null);

  const psychproOptions = psychproPlanOptions(plans.data ?? []);
  const epppOptions = epppPlanOptions(epppPlans.data);
  const psychproPaid = !!access.data?.psychpro.paid || !!access.data?.psychpro.legacy;
  const epppPaid = !!access.data?.eppp.paid || !!access.data?.eppp.legacy;
  const accessPending = authenticated && (access.isLoading || !access.data || access.isError);

  useEffect(() => { document.title = "Choose your plan | PsychPro"; }, []);

  function clearResumeIntent() {
    clearPendingCheckout();
    const url = new URL(window.location.href);
    url.searchParams.delete("checkout");
    url.searchParams.delete("priceId");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
  }

  async function selectPlan(suite: CheckoutChoice["suite"], priceId: string) {
    if (submitting.current || !isLoaded || !authReady) return;
    const options = suite === "psychpro" ? psychproOptions : epppOptions;
    if (!options.some(plan => plan.priceId === priceId)) {
      toast.error("This plan is unavailable. Please select a listed plan.");
      return;
    }
    clearPendingTrial();
    if (!isSignedIn) {
      const choice = { suite, priceId };
      rememberPendingCheckout(choice);
      navigate(checkoutAuthHref(choice, window.location.origin, import.meta.env.BASE_URL));
      return;
    }
    if (accessPending || (suite === "psychpro" ? psychproPaid : epppPaid)) return;
    submitting.current = true;
    setBusyPriceId(priceId);
    clearResumeIntent();
    try {
      const result = suite === "psychpro"
        ? await psychproCheckout.mutateAsync({ data: { priceId, successPath: "/subscription?success=true" } })
        : await epppCheckout.mutateAsync({ priceId });
      if (!result.url) throw new Error("Checkout did not return a payment link. Please try again.");
      const destination = new URL(result.url);
      if (destination.protocol !== "https:" || destination.hostname !== "checkout.stripe.com") {
        throw new Error("An invalid payment link was returned. Please try again.");
      }
      trackEvent("checkout_started", { surface: "subscription", product_tier: suite, price_id: priceId });
      window.location.assign(destination.href);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not start checkout. Please try again.");
    } finally {
      submitting.current = false;
      setBusyPriceId(null);
    }
  }

  // An explicit card choice survives auth without forcing trial onboarding.
  // Validate its ID against the live suite catalog before contacting Stripe.
  useEffect(() => {
    if (!authenticated || accessPending || plans.isLoading || epppPlans.isLoading) return;
    const choice = checkoutChoice(search) ?? readPendingCheckout();
    if (!choice) return;
    if (choice.suite === "psychpro" ? plans.isError : epppPlans.isError) return;
    const key = `${choice.suite}:${choice.priceId}`;
    if (resumed.current === key) return;
    resumed.current = key;
    const options = choice.suite === "psychpro" ? psychproOptions : epppOptions;
    if (!options.some(plan => plan.priceId === choice.priceId)) {
      clearResumeIntent();
      toast.error("That plan is no longer available. Please choose a listed plan.");
      return;
    }
    if (choice.suite === "psychpro" ? psychproPaid : epppPaid) {
      clearResumeIntent();
      toast("You already have paid access to this suite. You can manage your billing below.");
      return;
    }
    void selectPlan(choice.suite, choice.priceId);
  }, [authenticated, accessPending, search, plans.isLoading, epppPlans.isLoading, plans.isError, epppPlans.isError, psychproPaid, epppPaid, psychproOptions, epppOptions]);

  async function manageBilling() {
    try {
      const result = await portal.mutateAsync();
      if (!result.url) throw new Error("No billing link was returned.");
      window.location.assign(result.url);
    } catch {
      toast.error("Could not open billing. Please try again.");
    }
  }

  function pricingState(loading: boolean, error: boolean, count: number, expected: number, retry: () => unknown, suite: string) {
    if (loading) return <Skeleton className="h-80 rounded-xl" />;
    if (error || count !== expected) return <QueryError message={`We couldn't load all ${suite} plans. Please retry.`} onRetry={retry} />;
    return undefined;
  }

  const accountStatus = authenticated ? (
    <div className="plans-account-status">
      {access.isError && <QueryError message="We couldn't confirm your current access. Please retry before purchasing." onRetry={() => access.refetch()} />}
      {status.isError && <QueryError message="We couldn't confirm billing status." onRetry={() => status.refetch()} />}
      {(psychproPaid || epppPaid) && (
        <div className="plans-current-access" data-testid="active-subscription-banner">
          <p>
            You have paid access to {psychproPaid && epppPaid ? "both suites" : psychproPaid ? "PsychPro" : "EPPP Mastery Suite"}.
            {access.data?.psychpro.legacy ? " Your existing price and access are unchanged." : ""}
          </p>
          <div className="plans-account-actions">
            {psychproPaid && <Link href={profile.data?.onboardingComplete ? "/dashboard" : "/onboarding?suite=psychpro"}>Open PsychPro →</Link>}
            {epppPaid && <Link href={profile.data?.onboardingComplete ? "/eppp/suite" : "/onboarding?suite=eppp"}>Open EPPP Mastery Suite →</Link>}
            <Button variant="outline" size="sm" onClick={() => void manageBilling()} disabled={portal.isPending} data-testid="button-manage-subscription">
              {portal.isPending ? "Opening…" : "Manage billing"}
            </Button>
          </div>
        </div>
      )}
    </div>
  ) : undefined;

  return <PaidPlansView
    psychproPlans={psychproOptions}
    epppPlans={epppOptions}
    onSelect={(suite, priceId) => void selectPlan(suite, priceId)}
    busyPriceId={busyPriceId}
    psychproDisabled={!isLoaded || !authReady || accessPending || psychproPaid}
    epppDisabled={!isLoaded || !authReady || accessPending || epppPaid}
    psychproState={pricingState(plans.isLoading, plans.isError, psychproOptions.length, 2, () => plans.refetch(), "PsychPro")}
    epppState={pricingState(epppPlans.isLoading, epppPlans.isError, epppOptions.length, 3, () => epppPlans.refetch(), "EPPP")}
    accountStatus={accountStatus}
  />;
}
