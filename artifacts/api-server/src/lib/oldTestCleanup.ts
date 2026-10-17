import {
  db, usersTable, customDecksTable, progressTable, quizAttemptsTable,
  examAttemptsTable, courseMasteryAttemptsTable, feedbackTable,
  adminTokensTable, aiGenerationUsageTable,
} from "@workspace/db";
import { eq, inArray, isNotNull, and, sql } from "drizzle-orm";
import {
  OLD_TEST_ACCOUNT_IDS, isProtectedCleanupEmail, cleanupBlockReason,
  cleanupFingerprint, assertCleanupConfirmation, CleanupSafetyError,
} from "./oldTestCleanupPolicy";

type Database = Pick<typeof db, "select">;
type CleanupTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

async function signInExists(id: string): Promise<boolean> {
  // These pre-Clerk legacy IDs cannot identify a Clerk sign-in. They are
  // eligible only because they are individually pinned in the approved batch.
  if (!id.startsWith("user_")) return false;
  const production = process.env.NODE_ENV === "production";
  const key = (!production && process.env.CLERK_SK_OVERRIDE) || process.env.CLERK_SECRET_KEY;
  if (!key || (production && !key.startsWith("sk_live_"))) {
    throw new CleanupSafetyError("Identity verification is not configured safely.", 503);
  }
  const response = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(id)}`, {
    headers: { Authorization: `Bearer ${key}` },
    signal: AbortSignal.timeout(6000),
  });
  if (response.status === 404) return false;
  if (response.ok) return true;
  throw new CleanupSafetyError("Cannot verify old sign-ins right now. Nothing was deleted.", 503);
}

export async function buildOldTestCleanupPreview(database: Database, callerId: string) {
  const [caller] = await database.select().from(usersTable).where(eq(usersTable.id, callerId));
  if (!caller?.isAdmin || !isProtectedCleanupEmail(caller.email)) {
    throw new CleanupSafetyError("Only the protected owner account can run this cleanup.", 403);
  }
  const accounts = await database.select({
    id: usersTable.id, email: usersTable.email,
    stripeSubscriptionId: usersTable.stripeSubscriptionId,
    epppSubscriptionId: usersTable.epppSubscriptionId,
  }).from(usersTable).where(inArray(usersTable.id, [...OLD_TEST_ACCOUNT_IDS]));
  const uploaded = await database.select({ userId: customDecksTable.userId }).from(customDecksTable)
    .where(and(inArray(customDecksTable.userId, [...OLD_TEST_ACCOUNT_IDS]), isNotNull(customDecksTable.sourceFilePath)));
  const uploadOwners = new Set(uploaded.map(row => row.userId));
  const eligible = [];
  // Sequential requests keep this one-time action below Clerk burst limits.
  for (const account of accounts) {
    const preblocked = cleanupBlockReason(account, callerId, false, uploadOwners.has(account.id));
    if (preblocked) continue;
    if (!cleanupBlockReason(account, callerId, await signInExists(account.id), false)) eligible.push(account);
  }
  return {
    eligible,
    public: {
      eligibleCount: eligible.length,
      blockedCount: accounts.length - eligible.length,
      alreadyRemovedCount: OLD_TEST_ACCOUNT_IDS.length - accounts.length,
      fingerprint: cleanupFingerprint(eligible, callerId),
      environment: process.env.NODE_ENV === "production" ? "production" as const : "development" as const,
      protectedAccountPreserved: true,
    },
  };
}

export async function previewOldTestCleanup(callerId: string) {
  return (await buildOldTestCleanupPreview(db, callerId)).public;
}

export async function executeOldTestCleanup(callerId: string, confirmation: string, fingerprint: string) {
  return db.transaction(tx => cleanupOldTestAccountsInTransaction(tx, callerId, confirmation, fingerprint));
}

export async function cleanupOldTestAccountsInTransaction(
  tx: CleanupTransaction, callerId: string, confirmation: string, fingerprint: string,
) {
    // Serialize this fixed batch and lock every extant target + the caller.
    // Recheck protection, subscriptions and Clerk *inside* the transaction.
    await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('old-test-account-cleanup'))`);
    await tx.select({ id: usersTable.id }).from(usersTable)
      .where(inArray(usersTable.id, [...OLD_TEST_ACCOUNT_IDS, callerId])).for("update");
    const preview = await buildOldTestCleanupPreview(tx, callerId);
    assertCleanupConfirmation(confirmation, fingerprint, preview.public.fingerprint);
    const ids = preview.eligible.map(account => account.id);
    if (ids.length) {
      // Only account-owned rows are removed. Shared content and the protected
      // admin's records are never touched. Remaining user FKs cascade.
      await tx.delete(customDecksTable).where(inArray(customDecksTable.userId, ids));
      await tx.delete(courseMasteryAttemptsTable).where(inArray(courseMasteryAttemptsTable.userId, ids));
      await tx.delete(progressTable).where(inArray(progressTable.userId, ids));
      await tx.delete(quizAttemptsTable).where(inArray(quizAttemptsTable.userId, ids));
      await tx.delete(examAttemptsTable).where(inArray(examAttemptsTable.userId, ids));
      await tx.delete(feedbackTable).where(inArray(feedbackTable.userId, ids));
      await tx.delete(adminTokensTable).where(inArray(adminTokensTable.userId, ids));
      await tx.delete(aiGenerationUsageTable).where(inArray(aiGenerationUsageTable.userId, ids));
      await tx.delete(usersTable).where(inArray(usersTable.id, ids));
      const remaining = await tx.select({ id: usersTable.id }).from(usersTable).where(inArray(usersTable.id, ids));
      if (remaining.length) throw new CleanupSafetyError("Deletion verification failed. Changes were rolled back.", 503);
    }
    const [admin] = await tx.select().from(usersTable).where(eq(usersTable.id, callerId));
    if (!admin?.isAdmin || !isProtectedCleanupEmail(admin.email)) {
      throw new CleanupSafetyError("Admin verification failed. Changes were rolled back.", 503);
    }
    return {
      deletedCount: ids.length,
      remainingCount: preview.public.blockedCount,
      blockedCount: preview.public.blockedCount,
      protectedAccountPreserved: true,
    };
}
