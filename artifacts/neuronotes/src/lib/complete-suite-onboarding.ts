export type OnboardingSuite = "psychpro" | "eppp";

type AccessSnapshot = Record<OnboardingSuite, { hasAccess: boolean; canStart: boolean }>;

type CompletionActions = {
  saveProfile: () => Promise<boolean>;
  loadAccess: () => Promise<AccessSnapshot>;
  startTrial: (suite: OnboardingSuite) => Promise<AccessSnapshot>;
};

/**
 * Called only from the final onboarding action, never on mount/navigation.
 * The server owns eligibility and the clock; retries cannot renew a trial.
 */
export async function completeSuiteOnboarding(suite: OnboardingSuite, actions: CompletionActions) {
  if (!await actions.saveProfile()) return null;

  let access = await actions.loadAccess();
  const hadAccess = access[suite].hasAccess;
  let started = false;
  if (!hadAccess && access[suite].canStart) {
    try {
      access = await actions.startTrial(suite);
      started = true;
    } catch (error) {
      // Another tab/request may already have claimed the trial or purchased
      // access. Re-read server state; never reset the clock or guess success.
      if ((error as { status?: number })?.status !== 409) throw error;
      access = await actions.loadAccess();
    }
  }

  return {
    started,
    hadAccess,
    destination: access[suite].hasAccess
      ? suite === "eppp" ? "/eppp/suite" : "/dashboard"
      : "/subscription",
  };
}
