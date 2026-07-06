import { Loader2 } from "lucide-react";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

/**
 * Single, branded full-screen loader shared by every transitional state in the
 * auth/onboarding flow (Clerk boot, post-auth redirect resolver, onboarding
 * gate). Sits on the canonical .study-page-bg nebula so consecutive transitions
 * share one continuous backdrop instead of flashing between bare screens.
 */
export function FullScreenLoader({
  label = "Loading…",
  testId,
}: {
  label?: string;
  testId?: string;
}) {
  return (
    <div
      className="study-page-bg flex min-h-screen flex-col items-center justify-center gap-3"
      data-testid={testId}
    >
      <Loader2 className="h-7 w-7 animate-spin" style={{ color: P.surf }} aria-hidden />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
