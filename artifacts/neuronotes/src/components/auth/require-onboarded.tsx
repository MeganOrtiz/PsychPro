import { useEffect } from "react";
import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { useGetUserProfile } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { FullScreenLoader } from "@/components/full-screen-loader";
import { RequireSignedIn } from "./require-signed-in";

/**
 * Full-screen loader shown while we resolve whether the signed-in user still
 * needs onboarding. Uses the shared FullScreenLoader so it matches the rest of
 * the auth/onboarding flow (one continuous nebula backdrop, no app chrome).
 */
function GateLoader() {
  return <FullScreenLoader testId="onboarding-gate-loading" />;
}

/**
 * Blocking error state shown when the profile can't be loaded. We deliberately
 * fail CLOSED (never render protected content on error) so an incomplete user
 * can't slip past the gate, while a retry keeps a transient backend hiccup from
 * permanently trapping the user.
 */
function GateError({ onRetry }: { onRetry: () => void }) {
  return (
    <div
      className="study-page-bg flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center"
      data-testid="onboarding-gate-error"
    >
      <p className="text-sm text-muted-foreground max-w-sm">
        We couldn't load your account just now. Please check your connection and try again.
      </p>
      <Button onClick={onRetry} className="rounded-md px-5" data-testid="button-gate-retry">
        Try again
      </Button>
    </div>
  );
}

/**
 * Gate that keeps users out of the app until onboarding is complete. Fetches
 * the profile (GET /users/profile auto-creates the row with
 * onboardingComplete=false for brand-new users) and redirects incomplete users
 * to /onboarding. Completed users fall straight through.
 *
 * Fails CLOSED: on a profile fetch error we show a blocking retry screen rather
 * than rendering protected content, so an incomplete user can't bypass the gate.
 */
function OnboardingGate({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const { data: profile, isLoading, isError, refetch } = useGetUserProfile();

  const needsOnboarding = !!profile && !profile.onboardingComplete;

  useEffect(() => {
    if (needsOnboarding) {
      navigate("/onboarding", { replace: true });
    }
  }, [needsOnboarding, navigate]);

  if (isLoading) return <GateLoader />;
  if (isError) return <GateError onRetry={() => void refetch()} />;
  // After we've decided to redirect, keep showing the loader so protected
  // content never flashes before the redirect lands.
  if (needsOnboarding) return <GateLoader />;
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
