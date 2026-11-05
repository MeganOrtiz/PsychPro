import { createHash } from "node:crypto";

export const PINNED_TEST_CLEANUP_CONFIRMATION = "DELETE PINNED TEST ACCOUNTS";
export const PROTECTED_OWNER_EMAIL = "admin@psychprosuite.com";

export type PinnedCleanupEnvironment = "development" | "production";
export type PinnedCleanupReason =
  | "protected"
  | "billing_reference"
  | "uploaded_source"
  | "identity_mismatch"
  | "verification_unavailable";

export type PinnedTestAccount = Readonly<{ id: string; email: string }>;

// This inventory is intentionally static. It was assembled from the
// read-only environment inventory and is never expanded from runtime email
// searches. Development currently has no matching app profiles.
export const PINNED_TEST_ACCOUNT_INVENTORY: Record<
  PinnedCleanupEnvironment,
  readonly PinnedTestAccount[]
> = {
  development: [],
  production: [
    { id: "user_3KyLRq5RJf2tr9w19fTHmUHxDCT", email: "44.gaudy-wavier@icloud.com" },
    { id: "user_3L1TOOplVcEnRxORkM1nylhmVwv", email: "meganortiz71@gmail.com" },
    { id: "user_3L1Tlbv5TvUE7M4VUR5f0og3L0D", email: "meganortiz71@yahoo.com" },
  ],
};

export type PinnedCleanupObservedState = {
  profilePresent: boolean;
  profileEmail: string | null;
  isAdmin: boolean;
  subscriptionStatus: string | null;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  epppSubscriptionId: string | null;
  epppAccessUntil: Date | string | null;
  hasPaidReceipt: boolean;
  hasUploadedSource: boolean;
  signInPresent: boolean;
  signInEmail: string | null;
  signInHasProtectedEmail: boolean;
};

export function cleanupEnvironment(nodeEnv = process.env.NODE_ENV): PinnedCleanupEnvironment {
  return nodeEnv === "production" ? "production" : "development";
}

export function normalizeCleanupEmail(email: string | null | undefined): string {
  return email?.trim().toLowerCase() ?? "";
}

export function pinnedCleanupBlockReason(
  target: PinnedTestAccount,
  state: PinnedCleanupObservedState,
  callerId: string,
): PinnedCleanupReason | null {
  if (
    target.id === callerId ||
    normalizeCleanupEmail(target.email) === PROTECTED_OWNER_EMAIL ||
    state.isAdmin ||
    state.signInHasProtectedEmail ||
    (state.profilePresent && normalizeCleanupEmail(state.profileEmail) === PROTECTED_OWNER_EMAIL)
  ) {
    return "protected";
  }

  if (
    state.stripeCustomerId ||
    state.stripeSubscriptionId ||
    state.epppSubscriptionId ||
    state.epppAccessUntil ||
    state.hasPaidReceipt ||
    (state.profilePresent && state.subscriptionStatus !== "free")
  ) {
    return "billing_reference";
  }

  if (state.hasUploadedSource) return "uploaded_source";

  if (
    (state.profilePresent && normalizeCleanupEmail(state.profileEmail) !== normalizeCleanupEmail(target.email)) ||
    (state.signInPresent && normalizeCleanupEmail(state.signInEmail) !== normalizeCleanupEmail(target.email))
  ) {
    return "identity_mismatch";
  }

  return null;
}

export function pinnedCleanupFingerprint(
  environment: PinnedCleanupEnvironment,
  callerId: string,
  items: Array<{ target: PinnedTestAccount; state: PinnedCleanupObservedState; reason: PinnedCleanupReason | null }>,
): string {
  const canonical = {
    environment,
    callerId,
    items: [...items]
      .sort((a, b) => a.target.id.localeCompare(b.target.id))
      .map(({ target, state, reason }) => ({
        id: target.id,
        expectedEmail: normalizeCleanupEmail(target.email),
        profilePresent: state.profilePresent,
        profileEmail: normalizeCleanupEmail(state.profileEmail),
        isAdmin: state.isAdmin,
        subscriptionStatus: state.subscriptionStatus,
        hasStripeCustomer: Boolean(state.stripeCustomerId),
        hasStripeSubscription: Boolean(state.stripeSubscriptionId),
        hasEpppSubscription: Boolean(state.epppSubscriptionId),
        hasEpppPaidAccess: Boolean(state.epppAccessUntil),
        hasPaidReceipt: state.hasPaidReceipt,
        hasUploadedSource: state.hasUploadedSource,
        signInPresent: state.signInPresent,
        signInEmail: normalizeCleanupEmail(state.signInEmail),
        signInHasProtectedEmail: state.signInHasProtectedEmail,
        reason,
      })),
  };
  return createHash("sha256").update(JSON.stringify(canonical)).digest("hex");
}

export function assertPinnedCleanupConfirmation(
  confirmation: string,
  suppliedFingerprint: string,
  currentFingerprint: string,
): void {
  if (confirmation !== PINNED_TEST_CLEANUP_CONFIRMATION) {
    throw new PinnedCleanupSafetyError("Type DELETE PINNED TEST ACCOUNTS to confirm.", 400);
  }
  if (suppliedFingerprint !== currentFingerprint) {
    throw new PinnedCleanupSafetyError("The preview changed. Review a fresh preview before deleting.", 409);
  }
}

export class PinnedCleanupSafetyError extends Error {
  constructor(message: string, public status = 409) {
    super(message);
  }
}
