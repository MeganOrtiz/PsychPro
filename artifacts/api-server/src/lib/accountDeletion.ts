import {
  db,
  usersTable,
  sessionsTable,
  customDecksTable,
  progressTable,
  quizAttemptsTable,
  examAttemptsTable,
  feedbackTable,
  adminTokensTable,
} from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { getUncachableStripeClient } from "../stripeClient";
import { logger } from "./logger";

export type AccountDeletionResult = {
  deleted: boolean;
  stripeCanceled: boolean;
  stripeCancelFailed: boolean;
  // Whether the upstream login identity was removed. With Replit Auth the
  // identity is the user's own Replit account, which the app cannot delete —
  // so this is always false. We purge all local data and revoke the user's
  // sessions, but the same Replit account can sign in again (which would
  // re-create a fresh users row via the login upsert). Kept so callers can
  // honestly warn that a removed account may reappear.
  identityDeleted: boolean;
};

/**
 * Fully removes a user account: cancels any active Stripe subscription,
 * deletes all of the user's application data (FK-safe order), and revokes all
 * of the user's server-side sessions so they are signed out everywhere.
 *
 * The Stripe call is best-effort and never blocks the local data deletion — a
 * failure there is logged but does not throw, so a partial outage can't leave
 * the app DB in an inconsistent half-deleted state.
 *
 * Several tables reference `users` WITHOUT `onDelete: cascade`
 * (progress, quiz_attempts, exam_attempts, feedback, admin_tokens,
 * custom_decks) so those rows are removed explicitly first. Cascade-backed
 * tables (user_profiles, featured_work, community_notifications,
 * connection_requests, user_blocks) are cleaned up automatically when the
 * users row goes. custom_decks children cascade off custom_decks. Sessions
 * are keyed by sid (not a users FK) so they are deleted by matching the user
 * id embedded in the session JSON.
 */
export async function deleteUserAccount(userId: string): Promise<AccountDeletionResult> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    return { deleted: false, stripeCanceled: false, stripeCancelFailed: false, identityDeleted: false };
  }

  // 1. Cancel any active Stripe subscription so the user isn't billed after
  //    their account is gone. Best-effort, but a failure is reported back via
  //    `stripeCancelFailed` so the caller can warn that billing may continue.
  let stripeCanceled = false;
  let stripeCancelFailed = false;
  if (user.stripeSubscriptionId) {
    try {
      const stripe = await getUncachableStripeClient();
      await stripe.subscriptions.cancel(user.stripeSubscriptionId);
      stripeCanceled = true;
    } catch (err) {
      stripeCancelFailed = true;
      logger.warn({ err, userId }, "Failed to cancel Stripe subscription during account deletion");
    }
  }

  // 2. Remove all application data, the user's sessions, then the users row,
  //    in one transaction.
  await db.transaction(async (tx) => {
    await tx.delete(customDecksTable).where(eq(customDecksTable.userId, userId));
    await tx.delete(progressTable).where(eq(progressTable.userId, userId));
    await tx.delete(quizAttemptsTable).where(eq(quizAttemptsTable.userId, userId));
    await tx.delete(examAttemptsTable).where(eq(examAttemptsTable.userId, userId));
    await tx.delete(feedbackTable).where(eq(feedbackTable.userId, userId));
    await tx.delete(adminTokensTable).where(eq(adminTokensTable.userId, userId));
    await tx
      .delete(sessionsTable)
      .where(sql`${sessionsTable.sess} -> 'user' ->> 'id' = ${userId}`);
    await tx.delete(usersTable).where(eq(usersTable.id, userId));
  });

  return { deleted: true, stripeCanceled, stripeCancelFailed, identityDeleted: false };
}
