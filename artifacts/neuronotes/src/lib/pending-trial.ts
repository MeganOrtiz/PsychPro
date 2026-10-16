import type { TrialSuite } from "@/lib/use-study-access";

// Remembers which suite a visitor chose through signup and suite onboarding.
// This is intent only: it NEVER starts a trial by itself.
const KEY = "psychpro:pending-trial";

/** Keep suite intent in the auth URL too, even when sessionStorage is blocked. */
export function trialEntryHref(suite: TrialSuite, signedIn: boolean, origin: string, basePath: string): string {
  if (signedIn) return `/onboarding?suite=${suite}`;
  const base = basePath.replace(/\/$/, "");
  const welcome = new URL(`${base}/welcome`, origin);
  welcome.searchParams.set("suite", suite);
  return `/sign-up?redirect_url=${encodeURIComponent(welcome.href)}`;
}

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
