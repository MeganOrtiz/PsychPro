import { useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { useGetUserProfile } from "@workspace/api-client-react";
import { RequireSignedIn } from "./require-signed-in";

/**
 * Full-screen neutral loader shown while we resolve whether the signed-in user
 * still needs onboarding. Kept intentionally plain (no app chrome) so it works
 * both inside and outside AppLayout.
 */
function GateLoader() {
  return (
    <div
      className="study-page-bg flex min-h-screen items-center justify-center"
      data-testid="onboarding-gate-loading"
    >
      <p className="text-sm text-muted-foreground">Loading…</p>
    </div>
  );
}

/**
 * Gate that keeps users out of the app until onboarding is complete. Fetches
 * the profile (GET /users/profile auto-creates the row with
 * onboardingComplete=false for brand-new users) and redirects incomplete users
 * to /onboarding. Completed users fall straight through.
 *
 * Fails OPEN: if the profile request errors we render the children rather than
 * trapping the user, so a transient backend hiccup never bricks the whole app.
 */
function OnboardingGate({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const { data: profile, isLoading, isError } = useGetUserProfile();

  const needsOnboarding = !isError && !!profile && !profile.onboardingComplete;

  useEffect(() => {
    if (needsOnboarding) {
      navigate("/onboarding", { replace: true });
    }
  }, [needsOnboarding, navigate]);

  // While loading, or after we've decided to redirect, render the loader so the
  // protected content never flashes before the redirect lands.
  if (isLoading || needsOnboarding) return <GateLoader />;
  return <>{children}</>;
}

/**
 * Convenience guard: requires a Clerk session AND a completed onboarding.
 * Use for every protected route except /onboarding itself (which must stay
 * reachable for incomplete users — wrap that one in plain RequireSignedIn).
 */
export function RequireOnboarded({ children }: { children: ReactNode }) {
  return (
    <RequireSignedIn>
      <OnboardingGate>{children}</OnboardingGate>
    </RequireSignedIn>
  );
}
