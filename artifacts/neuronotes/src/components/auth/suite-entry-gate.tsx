import { useEffect, type ReactNode } from "react";
import { useLocation } from "wouter";
import { useStudyAccess } from "@/lib/use-study-access";
import { studySuiteForPath, suiteEntryDecision, suiteOnboardingPath, type StudySuite } from "@/lib/suite-entry";
import { FullScreenLoader } from "@/components/full-screen-loader";
import { QueryError } from "@/components/query-error";
import UpgradePrompt from "@/components/upgrade-prompt";

/** Applies before page components mount, including direct dashboard URLs. */
export function SuiteEntryGate({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const suite = studySuiteForPath(path);
  return suite ? <CheckedSuite suite={suite}>{children}</CheckedSuite> : <>{children}</>;
}

function CheckedSuite({ suite, children }: { suite: StudySuite; children: ReactNode }) {
  const [path, navigate] = useLocation();
  const access = useStudyAccess();
  const decision = suiteEntryDecision(access.data?.[suite]);
  useEffect(() => {
    if (!access.isError && decision === "onboarding") {
      navigate(suiteOnboardingPath(suite), { replace: true });
    }
  }, [access.isError, decision, suite, navigate]);

  if (access.isError) {
    return <QueryError message="We couldn't confirm your study access. Please retry." onRetry={() => access.refetch()} />;
  }
  if (decision === "loading" || decision === "onboarding") {
    return <FullScreenLoader testId="suite-entry-loading" />;
  }
  if (decision === "expired") {
    // Dashboard history remains accessible after expiry, but the expired
    // notice must be visible and study routes must stay blocked.
    const historyDashboard = path === "/dashboard" || path === "/eppp/dashboard" ||
      path === "/eppp/suite" || path === "/eppp/suite/performance-analytics";
    return (
      <div data-testid={`suite-entry-expired-${suite}`}>
        <UpgradePrompt reason={suite === "eppp" ? "eppp" : "generic"} />
        {historyDashboard ? children : null}
      </div>
    );
  }
  return <>{children}</>;
}
