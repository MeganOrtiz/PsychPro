import { useEffect } from "react";
import { useLocation } from "wouter";
import { useGetUserProfile } from "@workspace/api-client-react";
import { useEntitlements } from "@/lib/use-entitlements";
import { FullScreenLoader } from "@/components/full-screen-loader";

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
  const [, navigate] = useLocation();
  const { data: profile, isLoading: profileLoading, isError: profileError } = useGetUserProfile();
  const { data: entitlements, isLoading: entLoading } = useEntitlements();

  useEffect(() => {
    // On a profile error, fall through to /dashboard — RequireOnboarded will
    // re-check and present its own blocking retry if the profile still can't
    // load, so we never strand the user here.
    if (profileError) {
      navigate("/dashboard", { replace: true });
      return;
    }
    if (profileLoading || !profile) return;

    if (!profile.onboardingComplete) {
      navigate("/onboarding", { replace: true });
      return;
    }

    // Wait for entitlements so EPPP buyers aren't sent to the main dashboard by
    // mistake. If entitlements fail to load they stay undefined -> dashboard.
    if (entLoading) return;
    const goEppp = !!entitlements?.epppAccess && !entitlements?.isAdmin;
    navigate(goEppp ? "/eppp/suite" : "/dashboard", { replace: true });
  }, [profile, profileLoading, profileError, entitlements, entLoading, navigate]);

  return <FullScreenLoader testId="post-auth-redirect" />;
}
