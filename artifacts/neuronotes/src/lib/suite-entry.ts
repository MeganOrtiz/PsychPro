export type StudySuite = "psychpro" | "eppp";
type SuiteAccess = { hasAccess: boolean; canStart: boolean };

/** Account-owned history and books remain available without study access. */
export function studySuiteForPath(path: string): StudySuite | null {
  if (/^\/eppp\/suite\/(my-library|reflections|my-notes|feedback)\/?$/.test(path)) return null;
  if (path === "/eppp" || path.startsWith("/eppp/")) return "eppp";
  if (path === "/dashboard" || /^\/(topics|courses|brain-lab|study-lab)(\/|$)/.test(path)) return "psychpro";
  return null;
}

export function suiteEntryDecision(access: SuiteAccess | undefined) {
  if (!access) return "loading";
  if (access.hasAccess) return "open";
  return access.canStart ? "onboarding" : "expired";
}

export function suiteOnboardingPath(suite: StudySuite) {
  return `/onboarding?suite=${suite}`;
}

/** General login never favors EPPP or a previously selected suite. */
export function generalSuiteDestination(access: Record<StudySuite, SuiteAccess>, isAdmin = false) {
  if (isAdmin) return "/dashboard";
  if (access.psychpro.hasAccess && !access.eppp.hasAccess) return "/dashboard";
  if (access.eppp.hasAccess && !access.psychpro.hasAccess) return "/eppp/suite";
  return null; // Both or neither: show accurate suite choices.
}
