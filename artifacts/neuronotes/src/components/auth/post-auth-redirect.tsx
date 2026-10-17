import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useGetUserProfile } from "@workspace/api-client-react";
import { useEntitlements } from "@/lib/use-entitlements";
import { FullScreenLoader } from "@/components/full-screen-loader";
import { getPromoReturn } from "@/lib/eppp-promo-return";
import { readPendingTrial } from "@/lib/pending-trial";
import { QueryError } from "@/components/query-error";
import { isTrialSuite } from "@/lib/use-study-access";
import { readPendingCheckout, checkoutReturnPath } from "@/lib/pending-checkout";

/**
 * Post-authentication landing resolver. Clerk redirects here after sign-in /
 * sign-up; we then send the user to the correct destination:
 *   - onboarding incomplete            -> /onboarding
 *   - completed + EPPP access (buyer)  -> /eppp/suite
 *   - completed, everyone else         -> /dashboard
 *
 * This keeps EPPP buyers landing in the EPPP Mastery Suite on every sign-in,
 * not just at the end of onboarding. It only decides a destination — the
 * protected routes themselves remain guarded by RequireOnboarded.
 *
 * Admins are intentionally excluded from the EPPP-suite redirect: admin
 * accounts auto-qualify for epppAccess (admin bypass), so without this they'd
 * always be sent to /eppp/suite. They land on /dashboard instead; genuine EPPP
 * buyers (driven by epppAccessUntil) still go to the suite.
 */
export function PostAuthRedirect() {
  const pendingCheckout = readPendingCheckout();
  return pendingCheckout
    ? <CheckoutRedirect destination={checkoutReturnPath(pendingCheckout)} />
    : <SuitePostAuthRedirect />;
}

function CheckoutRedirect({ destination }: { destination: string }) {
  const [, navigate] = useLocation();
  useEffect(() => {
    navigate(destination, { replace: true });
  }, [destination, navigate]);
  return <FullScreenLoader testId="post-auth-redirect" />;
}

function SuitePostAuthRedirect() {
  const [, navigate] = useLocation();
  const promoReturn = getPromoReturn(useSearch());
  const requested = new URLSearchParams(useSearch()).get("suite");
  const requestedSuite = isTrialSuite(requested) ? requested : null;
  const { data: profile, isLoading: profileLoading, isError: profileError, refetch: retryProfile } = useGetUserProfile();
  const { data: entitlements, isLoading: entLoading, isError: entError, refetch: retryEntitlements } = useEntitlements();

  useEffect(() => {
    if (profileError) return;
    if (profileLoading || !profile) return;

    // A selected suite always re-enters onboarding, including for accounts
    // that already completed it for the other suite. Old promo auth returns
    // also resolve here instead of the removed promo page.
    const pendingTrial = requestedSuite ?? (promoReturn ? "eppp" : readPendingTrial());
    if (pendingTrial) {
      navigate(`/onboarding?suite=${pendingTrial}`, { replace: true });
      return;
    }
    if (!profile.onboardingComplete) {
      navigate("/onboarding", { replace: true });
      return;
    }

    // Wait for entitlements so EPPP buyers aren't sent to the main dashboard by
    // mistake. If entitlements fail to load they stay undefined -> dashboard.
    if (entLoading || entError) return;
    const goEppp = !!entitlements?.epppAccess && !entitlements?.isAdmin;
    navigate(goEppp ? "/eppp/suite" : "/dashboard", { replace: true });
  }, [profile, profileLoading, profileError, entitlements, entLoading, entError, navigate, promoReturn, requestedSuite]);

  if (profileError || entError) {
    return <QueryError message="We couldn't confirm your account access. Retry to continue to the correct suite." onRetry={() => Promise.all([retryProfile(), retryEntitlements()])} />;
  }
  return <FullScreenLoader testId="post-auth-redirect" />;
}
