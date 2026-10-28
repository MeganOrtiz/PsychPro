import type { ReactNode } from "react";
import { useLocation } from "wouter";
import { useStudyAccess } from "@/lib/use-study-access";
import { StudyTrialPanel } from "@/components/study-trial-panel";
import { Button } from "@/components/ui/button";
import { RouteLoadingSurface } from "@/components/route-loading-surface";

// Only interactive paid study routes. Account, history, source downloads,
// personal notes, dashboards and owned books remain available after expiry.
export function StudyAccessGate({ children }: { children: ReactNode }) {
  const [path] = useLocation();
  const required = /^\/topics\/[^/]+\/(flashcards|quiz|study-guide|exam)/.test(path) ||
    /^\/courses\/[^/]+\/mastery-exam/.test(path) ||
    path === "/brain-lab" || path === "/study-lab" ||
    (/^\/my-decks\/[^/]+$/.test(path) && path !== "/my-decks/new");
  return required ? <PaidStudyContent>{children}</PaidStudyContent> : <>{children}</>;
}

function PaidStudyContent({ children }: { children: ReactNode }) {
  const { data, isLoading, isError, refetch } = useStudyAccess();
  if (isLoading || !data && !isError) {
    return <RouteLoadingSurface variant="content" label="Checking study access" />;
  }
  if (isError) return <div className="p-6"><p>We couldn’t check study access.</p><Button onClick={() => void refetch()}>Try again</Button></div>;
  if (!data?.psychpro.hasAccess) return (
    <div className="max-w-xl mx-auto p-6 space-y-4" data-testid="study-access-paused">
      <h1 className="text-2xl font-semibold">Your study materials are saved</h1>
      <p className="text-muted-foreground">Start your free week or subscribe to study. Your progress, notes, saved sources, and owned books stay in your account.</p>
      <StudyTrialPanel suite="psychpro" />
    </div>
  );
  return <>{children}</>;
}
