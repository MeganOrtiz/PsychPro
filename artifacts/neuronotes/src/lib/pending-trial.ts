import type { TrialSuite } from "@/lib/use-study-access";

// Remembers which suite a visitor chose on the landing page so onboarding /
// the plans page can offer the matching explicit "Start my free week" action.
// This is intent only: it NEVER starts a trial by itself.
const KEY = "psychpro:pending-trial";

export function rememberPendingTrial(suite: TrialSuite) {
  try { window.sessionStorage.setItem(KEY, suite); } catch { /* storage unavailable */ }
}

export function readPendingTrial(): TrialSuite | null {
  try {
    const v = window.sessionStorage.getItem(KEY);
    return v === "psychpro" || v === "eppp" ? v : null;
  } catch {
    return null;
  }
}

export function clearPendingTrial() {
  try { window.sessionStorage.removeItem(KEY); } catch { /* storage unavailable */ }
}
