import {
  adminTokensTable,
  aiGenerationUsageTable,
  courseMasteryAttemptsTable,
  customDecksTable,
  db,
  examAttemptsTable,
  feedbackTable,
  progressTable,
  quizAttemptsTable,
  stripePurchaseReceiptsTable,
  usersTable,
} from "@workspace/db";
import { and, eq, inArray, isNotNull, sql } from "drizzle-orm";
import {
  assertPinnedCleanupConfirmation,
  cleanupEnvironment,
  normalizeCleanupEmail,
  PINNED_TEST_ACCOUNT_INVENTORY,
  pinnedCleanupBlockReason,
  pinnedCleanupFingerprint,
  PinnedCleanupSafetyError,
  PROTECTED_OWNER_EMAIL,
  type PinnedCleanupEnvironment,
  type PinnedCleanupObservedState,
  type PinnedTestAccount,
} from "./targetedTestCleanupPolicy";

type SelectDatabase = Pick<typeof db, "select">;
type CleanupTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

type PrivatePreviewItem = {
  target: PinnedTestAccount;
  state: PinnedCleanupObservedState;
  reason: ReturnType<typeof pinnedCleanupBlockReason>;
  status: "eligible" | "blocked" | "already_absent";
};

type PublicExecutionItem = {
  email: string;
  identity: "deleted" | "already_absent" | "retained" | "failed";
  appData: "deleted" | "already_absent" | "retained" | "failed";
  reason: ReturnType<typeof pinnedCleanupBlockReason>;
};

type ClerkRestUser = {
  primary_email_address_id?: unknown;
  email_addresses?: Array<{
    id?: unknown;
    email_address?: unknown;
    verification?: { status?: unknown } | null;
  }>;
};

function errorStatus(error: unknown): number | null {
  if (!error || typeof error !== "object") return null;
  const value = error as { status?: unknown; statusCode?: unknown };
  if (typeof value.status === "number") return value.status;
  if (typeof value.statusCode === "number") return value.statusCode;
  return null;
}

function clerkApiKey(): string {
  const production = process.env.NODE_ENV === "production";
  const key = production ? process.env.CLERK_SECRET_KEY : process.env.CLERK_SK_OVERRIDE;
  if (!key || (production ? !key.startsWith("sk_live_") : !key.startsWith("sk_test_"))) {
    throw new PinnedCleanupSafetyError(
      "The identity provider is not configured for this environment. Nothing was deleted.",
      503,
    );
  }
  return key;
}

async function clerkIdentity(id: string): Promise<{
  present: boolean;
  email: string | null;
  hasProtectedEmail: boolean;
}> {
  try {
    const response = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(id)}`, {
      headers: { Authorization: `Bearer ${clerkApiKey()}` },
      signal: AbortSignal.timeout(6000),
    });
    if (response.status === 404) {
      return { present: false, email: null, hasProtectedEmail: false };
    }
    if (!response.ok) {
      throw new PinnedCleanupSafetyError(
        "Sign-in identity verification is unavailable. Nothing was deleted.",
        503,
      );
    }
    const user = await response.json() as ClerkRestUser;
    const addresses = Array.isArray(user.email_addresses) ? user.email_addresses : [];
    const primary = addresses.find((address) => address.id === user.primary_email_address_id);
    if (
      !primary ||
      primary.verification?.status !== "verified" ||
      typeof primary.email_address !== "string"
    ) {
      throw new PinnedCleanupSafetyError(
        "A pinned sign-in identity could not be safely verified. Nothing was deleted.",
        503,
      );
    }
    return {
      present: true,
      email: primary.email_address,
      hasProtectedEmail: addresses.some(
        (address) => normalizeCleanupEmail(
          typeof address.email_address === "string" ? address.email_address : null,
        ) === PROTECTED_OWNER_EMAIL,
      ),
    };
  } catch (error) {
    if (error instanceof PinnedCleanupSafetyError) throw error;
    if (errorStatus(error) === 404) {
      return { present: false, email: null, hasProtectedEmail: false };
    }
    throw new PinnedCleanupSafetyError(
      "Sign-in identity verification is unavailable. Nothing was deleted.",
      503,
    );
  }
}

async function assertOwnerDatabaseRow(
  database: SelectDatabase,
  callerId: string,
): Promise<void> {
  const [owner] = await database
    .select({ id: usersTable.id, email: usersTable.email, isAdmin: usersTable.isAdmin })
    .from(usersTable)
    .where(eq(usersTable.id, callerId));
  if (
    !owner?.isAdmin ||
    normalizeCleanupEmail(owner.email) !== PROTECTED_OWNER_EMAIL
  ) {
    throw new PinnedCleanupSafetyError("Only the protected owner account can run this cleanup.", 403);
  }
}

async function loadObservedState(
  database: SelectDatabase,
  target: PinnedTestAccount,
): Promise<PinnedCleanupObservedState> {
  const [profile] = await database
    .select({
      id: usersTable.id,
      email: usersTable.email,
      isAdmin: usersTable.isAdmin,
      subscriptionStatus: usersTable.subscriptionStatus,
      stripeCustomerId: usersTable.stripeCustomerId,
      stripeSubscriptionId: usersTable.stripeSubscriptionId,
      epppSubscriptionId: usersTable.epppSubscriptionId,
      epppAccessUntil: usersTable.epppAccessUntil,
    })
    .from(usersTable)
    .where(eq(usersTable.id, target.id));

  if (profile && profile.id !== target.id) {
    throw new PinnedCleanupSafetyError("Pinned profile verification failed. Nothing was deleted.", 503);
  }

  const [receipt] = profile
    ? await database
        .select({ checkoutSessionId: stripePurchaseReceiptsTable.checkoutSessionId })
        .from(stripePurchaseReceiptsTable)
        .where(eq(stripePurchaseReceiptsTable.userId, target.id))
        .limit(1)
    : [];
  const [uploadedSource] = profile
    ? await database
        .select({ userId: customDecksTable.userId })
        .from(customDecksTable)
        .where(and(eq(customDecksTable.userId, target.id), isNotNull(customDecksTable.sourceFilePath)))
        .limit(1)
    : [];
  const identity = await clerkIdentity(target.id);

  return {
    profilePresent: Boolean(profile),
    profileEmail: profile?.email ?? null,
    isAdmin: profile?.isAdmin ?? false,
    subscriptionStatus: profile?.subscriptionStatus ?? null,
    stripeCustomerId: profile?.stripeCustomerId ?? null,
    stripeSubscriptionId: profile?.stripeSubscriptionId ?? null,
    epppSubscriptionId: profile?.epppSubscriptionId ?? null,
    epppAccessUntil: profile?.epppAccessUntil ?? null,
    hasPaidReceipt: Boolean(receipt),
    hasUploadedSource: Boolean(uploadedSource),
    signInPresent: identity.present,
    signInEmail: identity.email,
    signInHasProtectedEmail: identity.hasProtectedEmail,
  };
}

function privatePreviewItem(
  target: PinnedTestAccount,
  state: PinnedCleanupObservedState,
  callerId: string,
): PrivatePreviewItem {
  const reason = pinnedCleanupBlockReason(target, state, callerId);
  const status = reason
    ? "blocked"
    : !state.profilePresent && !state.signInPresent
      ? "already_absent"
      : "eligible";
  return { target, state, reason, status };
}

function publicPreviewItem(item: PrivatePreviewItem) {
  return {
    email: item.target.email,
    profilePresent: item.state.profilePresent,
    signInPresent: item.state.signInPresent,
    status: item.status,
    reason: item.reason,
  };
}

async function buildPreview(
  database: SelectDatabase,
  callerId: string,
  environment: PinnedCleanupEnvironment,
): Promise<{ items: PrivatePreviewItem[]; public: {
  environment: PinnedCleanupEnvironment;
  eligibleCount: number;
  blockedCount: number;
  alreadyAbsentCount: number;
  items: ReturnType<typeof publicPreviewItem>[];
  fingerprint: string;
  protectedAccountPreserved: true;
} }> {
  await assertOwnerDatabaseRow(database, callerId);
  const targets = PINNED_TEST_ACCOUNT_INVENTORY[environment];
  const items: PrivatePreviewItem[] = [];
  for (const target of targets) {
    items.push(privatePreviewItem(target, await loadObservedState(database, target), callerId));
  }
  return {
    items,
    public: {
      environment,
      eligibleCount: items.filter((item) => item.status === "eligible").length,
      blockedCount: items.filter((item) => item.status === "blocked").length,
      alreadyAbsentCount: items.filter((item) => item.status === "already_absent").length,
      items: items.map(publicPreviewItem),
      fingerprint: pinnedCleanupFingerprint(
        environment,
        callerId,
        items.map(({ target, state, reason }) => ({ target, state, reason })),
      ),
      protectedAccountPreserved: true,
    },
  };
}

export async function previewPinnedTestCleanup(
  callerId: string,
  environment = cleanupEnvironment(),
) {
  return (await buildPreview(db, callerId, environment)).public;
}

function hasBillingReference(profile: {
  subscriptionStatus: string;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  epppSubscriptionId: string | null;
  epppAccessUntil: Date | null;
}): boolean {
  return Boolean(
    profile.stripeCustomerId ||
    profile.stripeSubscriptionId ||
    profile.epppSubscriptionId ||
    profile.epppAccessUntil ||
    profile.subscriptionStatus !== "free",
  );
}

async function deleteAccountRows(
  tx: CleanupTransaction,
  callerId: string,
  target: PinnedTestAccount,
): Promise<boolean> {
  await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('pinned-test-account-cleanup'))`);
  await tx.select({ id: usersTable.id })
    .from(usersTable)
    .where(inArray(usersTable.id, [target.id, callerId]))
    .for("update");

  const [owner] = await tx
    .select({ id: usersTable.id, email: usersTable.email, isAdmin: usersTable.isAdmin })
    .from(usersTable)
    .where(eq(usersTable.id, callerId));
  if (!owner?.isAdmin || normalizeCleanupEmail(owner.email) !== PROTECTED_OWNER_EMAIL) {
    throw new PinnedCleanupSafetyError("Owner verification changed. No profile data was deleted.", 403);
  }

  const [profile] = await tx
    .select({
      id: usersTable.id,
      email: usersTable.email,
      isAdmin: usersTable.isAdmin,
      subscriptionStatus: usersTable.subscriptionStatus,
      stripeCustomerId: usersTable.stripeCustomerId,
      stripeSubscriptionId: usersTable.stripeSubscriptionId,
      epppSubscriptionId: usersTable.epppSubscriptionId,
      epppAccessUntil: usersTable.epppAccessUntil,
    })
    .from(usersTable)
    .where(eq(usersTable.id, target.id));
  if (!profile) return false;

  if (
    normalizeCleanupEmail(profile.email) !== normalizeCleanupEmail(target.email) ||
    profile.isAdmin ||
    normalizeCleanupEmail(profile.email) === PROTECTED_OWNER_EMAIL
  ) {
    throw new PinnedCleanupSafetyError("Pinned profile identity changed. Its data was retained.", 409);
  }
  if (hasBillingReference(profile)) {
    throw new PinnedCleanupSafetyError("A billing reference appeared. The profile data was retained.", 409);
  }

  const [receipt] = await tx
    .select({ checkoutSessionId: stripePurchaseReceiptsTable.checkoutSessionId })
    .from(stripePurchaseReceiptsTable)
    .where(eq(stripePurchaseReceiptsTable.userId, target.id))
    .limit(1);
  const [uploadedSource] = await tx
    .select({ userId: customDecksTable.userId })
    .from(customDecksTable)
    .where(and(eq(customDecksTable.userId, target.id), isNotNull(customDecksTable.sourceFilePath)))
    .limit(1);
  if (receipt) {
    throw new PinnedCleanupSafetyError("A paid purchase record appeared. The profile data was retained.", 409);
  }
  if (uploadedSource) {
    throw new PinnedCleanupSafetyError("An uploaded source appeared. The profile data was retained.", 409);
  }

  // Remove only user-owned records that do not cascade. Upload source files,
  // Stripe records, shared catalog content, and other users' data are never
  // touched by this operation.
  await tx.delete(customDecksTable).where(eq(customDecksTable.userId, target.id));
  await tx.delete(courseMasteryAttemptsTable).where(eq(courseMasteryAttemptsTable.userId, target.id));
  await tx.delete(progressTable).where(eq(progressTable.userId, target.id));
  await tx.delete(quizAttemptsTable).where(eq(quizAttemptsTable.userId, target.id));
  await tx.delete(examAttemptsTable).where(eq(examAttemptsTable.userId, target.id));
  await tx.delete(feedbackTable).where(eq(feedbackTable.userId, target.id));
  await tx.delete(adminTokensTable).where(eq(adminTokensTable.userId, target.id));
  await tx.delete(aiGenerationUsageTable).where(eq(aiGenerationUsageTable.userId, target.id));
  await tx.delete(usersTable).where(eq(usersTable.id, target.id));

  const [remaining] = await tx
    .select({ id: usersTable.id })
    .from(usersTable)
    .where(eq(usersTable.id, target.id));
  if (remaining) {
    throw new PinnedCleanupSafetyError("Profile deletion could not be verified. The transaction was rolled back.", 503);
  }
  return true;
}

async function deleteClerkIdentity(target: PinnedTestAccount): Promise<void> {
  const response = await fetch(
    `https://api.clerk.com/v1/users/${encodeURIComponent(target.id)}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${clerkApiKey()}` },
      signal: AbortSignal.timeout(6000),
    },
  );
  if (!response.ok && response.status !== 404) {
    throw new PinnedCleanupSafetyError(
      "The pinned sign-in could not be removed. Its profile data was retained.",
      503,
    );
  }

  const afterDelete = await clerkIdentity(target.id);
  if (afterDelete.present) {
    throw new PinnedCleanupSafetyError(
      "Sign-in removal could not be verified. Its profile data was retained.",
      503,
    );
  }
}

export async function executePinnedTestCleanup(
  callerId: string,
  confirmation: string,
  fingerprint: string,
  environment = cleanupEnvironment(),
) {
  const fresh = await buildPreview(db, callerId, environment);
  assertPinnedCleanupConfirmation(confirmation, fingerprint, fresh.public.fingerprint);

  let deletedCount = 0;
  let identityOnlyCount = 0;
  let blockedCount = fresh.public.blockedCount;
  let failedCount = 0;
  const outcomes: PublicExecutionItem[] = [];

  for (const original of fresh.items) {
    if (original.status === "blocked") {
      outcomes.push({
        email: original.target.email,
        identity: original.state.signInPresent ? "retained" : "already_absent",
        appData: original.state.profilePresent ? "retained" : "already_absent",
        reason: original.reason,
      });
      continue;
    }
    if (original.status === "already_absent") {
      outcomes.push({
        email: original.target.email,
        identity: "already_absent",
        appData: "already_absent",
        reason: null,
      });
      continue;
    }

    // Recheck the individual pinned identity immediately before acting. The
    // all-target fingerprint above prevents a stale preview from starting.
    let current: PrivatePreviewItem;
    try {
      current = privatePreviewItem(
        original.target,
        await loadObservedState(db, original.target),
        callerId,
      );
    } catch {
      failedCount += 1;
      outcomes.push({
        email: original.target.email,
        identity: original.state.signInPresent ? "retained" : "already_absent",
        appData: original.state.profilePresent ? "retained" : "already_absent",
        reason: "verification_unavailable",
      });
      continue;
    }

    const originalStateHash = pinnedCleanupFingerprint(environment, callerId, [
      { target: original.target, state: original.state, reason: original.reason },
    ]);
    const currentStateHash = pinnedCleanupFingerprint(environment, callerId, [
      { target: current.target, state: current.state, reason: current.reason },
    ]);
    if (current.status !== "eligible" || originalStateHash !== currentStateHash) {
      const reason = current.reason ?? "identity_mismatch";
      if (current.status !== "already_absent") blockedCount += 1;
      outcomes.push({
        email: current.target.email,
        identity: current.state.signInPresent ? "retained" : "already_absent",
        appData: current.state.profilePresent ? "retained" : "already_absent",
        reason,
      });
      continue;
    }

    const hadIdentity = current.state.signInPresent;
    let identityRemoved = false;
    let identityOutcome: PublicExecutionItem["identity"] = hadIdentity ? "failed" : "already_absent";
    let appDataOutcome: PublicExecutionItem["appData"] = current.state.profilePresent
      ? "retained"
      : "already_absent";
    try {
      if (hadIdentity) {
        await deleteClerkIdentity(current.target);
        identityRemoved = true;
        identityOutcome = "deleted";
      }
      const removedProfile = await db.transaction((tx) =>
        deleteAccountRows(tx, callerId, current.target),
      );
      appDataOutcome = removedProfile ? "deleted" : "already_absent";
      const fullyAbsent =
        (identityOutcome === "deleted" || identityOutcome === "already_absent") &&
        (appDataOutcome === "deleted" || appDataOutcome === "already_absent");
      if (fullyAbsent) deletedCount += 1;
      else failedCount += 1;
      outcomes.push({
        email: current.target.email,
        identity: identityOutcome,
        appData: appDataOutcome,
        reason: fullyAbsent ? null : "verification_unavailable",
      });
    } catch {
      if (identityRemoved) {
        // Clerk deletion is not reversible. Keep the app profile if its
        // transaction failed, and surface this as a retryable partial result.
        try {
          const [profile] = await db
            .select({ id: usersTable.id })
            .from(usersTable)
            .where(eq(usersTable.id, current.target.id));
          if (profile) {
            identityOnlyCount += 1;
            appDataOutcome = "failed";
          } else {
            deletedCount += 1;
            appDataOutcome = "already_absent";
          }
        } catch {
          identityOnlyCount += 1;
          appDataOutcome = "failed";
        }
      } else {
        failedCount += 1;
      }
      outcomes.push({
        email: current.target.email,
        identity: identityRemoved ? "deleted" : identityOutcome,
        appData: appDataOutcome,
        reason: "verification_unavailable",
      });
    }
  }

  return {
    deletedCount,
    identityOnlyCount,
    blockedCount,
    failedCount,
    items: outcomes,
    protectedAccountPreserved: true as const,
  };
}
