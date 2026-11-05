type RemovalOutcome = "deleted" | "already_absent" | "retained" | "failed";

/** Orchestrates one already-authorized target; never removes app data before verified sign-in removal. */
export async function removeVerifiedPinnedTarget(
  state: { signInPresent: boolean; profilePresent: boolean },
  operations: {
    deleteIdentity: () => Promise<void>;
    deleteAppData: () => Promise<boolean>;
    profileExists: () => Promise<boolean>;
  },
): Promise<{ identity: RemovalOutcome; appData: RemovalOutcome }> {
  let identity: RemovalOutcome = state.signInPresent ? "retained" : "already_absent";
  let appData: RemovalOutcome = state.profilePresent ? "retained" : "already_absent";
  try {
    if (state.signInPresent) {
      await operations.deleteIdentity();
      identity = "deleted";
    }
    appData = await operations.deleteAppData() ? "deleted" : "already_absent";
  } catch {
    if (identity === "deleted") {
      try {
        appData = await operations.profileExists() ? "failed" : "already_absent";
      } catch {
        appData = "failed";
      }
    } else if (identity === "already_absent") {
      appData = "failed";
    } else {
      identity = "failed";
    }
  }
  return { identity, appData };
}
