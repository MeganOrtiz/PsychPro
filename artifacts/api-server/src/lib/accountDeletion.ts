import { clerkClient } from "@clerk/express";
import {
  db,
  usersTable,
  customDecksTable,
  progressTable,
  quizAttemptsTable,
  examAttemptsTable,
  feedbackTable,
  adminTokensTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { getUncachableStripeClient } from "../stripeClient";
import { logger } from "./logger";

export type AccountDeletionResult = {
  deleted: boolean;
  stripeCanceled: boolean;
  stripeCancelFailed: boolean;
  clerkDeleted: boolean;
};

/**
 * Fully removes a user account: cancels any active Stripe subscription,
 * deletes all of the user's application data (FK-safe order), and deletes
 * the Clerk identity so the email can be re-used cleanly.
 *
 * External calls (Stripe, Clerk) are best-effort and never block the local
 * data deletion — a failure there is logged but does not throw, so a partial
 * outage can't leave the app DB in an inconsistent half-deleted state.
 *
 * Several tables reference `users` WITHOUT `onDelete: cascade`
 * (progress, quiz_attempts, exam_attempts, feedback, admin_tokens,
 * custom_decks) so those rows are removed explicitly first. Cascade-backed
 * tables (user_profiles, featured_work, community_notifications,
 * connection_requests, user_blocks) are cleaned up automatically when the
 * users row goes. custom_decks children cascade off custom_decks.
 */
export async function deleteUserAccount(userId: string): Promise<AccountDeletionResult> {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    return { deleted: false, stripeCanceled: false, stripeCancelFailed: false, clerkDeleted: false };
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

  // 2. Remove all application data, then the users row, in one transaction.
  await db.transaction(async (tx) => {
    await tx.delete(customDecksTable).where(eq(customDecksTable.userId, userId));
    await tx.delete(progressTable).where(eq(progressTable.userId, userId));
    await tx.delete(quizAttemptsTable).where(eq(quizAttemptsTable.userId, userId));
    await tx.delete(examAttemptsTable).where(eq(examAttemptsTable.userId, userId));
    await tx.delete(feedbackTable).where(eq(feedbackTable.userId, userId));
    await tx.delete(adminTokensTable).where(eq(adminTokensTable.userId, userId));
    await tx.delete(usersTable).where(eq(usersTable.id, userId));
  });

  // 3. Delete the Clerk identity last, so the local data is already gone
  //    before we drop the ability to authenticate. Best-effort.
  let clerkDeleted = false;
  try {
    await clerkClient.users.deleteUser(userId);
    clerkDeleted = true;
  } catch (err) {
    logger.warn({ err, userId }, "Failed to delete Clerk user during account deletion");
  }

  return { deleted: true, stripeCanceled, stripeCancelFailed, clerkDeleted };
}
