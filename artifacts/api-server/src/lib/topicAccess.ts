import type { Response } from "express";
import { db } from "@workspace/db";
import { usersTable, freeTopicAccessTable, progressTable } from "@workspace/db";
import { and, eq, sql } from "drizzle-orm";

// Server-side source of truth for the free-tier topic cap. Mirrors
// FREE_TOPIC_LIMIT on the client (artifacts/neuronotes/src/lib/limits.ts).
export const FREE_TOPIC_LIMIT = 2;

function isSubscribedStatus(s: string | null | undefined): boolean {
  return s === "active" || s === "pro" || s === "trialing" || s === "scholar";
}

type AccessResult =
  | { allowed: true; usedTopics: number | null }
  | {
      allowed: false;
      status: 402;
      body: {
        error: string;
        message: string;
        usedTopics: number;
        freeLimit: number;
        isOverLimit: true;
      };
    };

/**
 * Enforces the free-tier "N topics, fully unlocked" rule for any route that
 * serves topic-scoped content (flashcards, quizzes, study guide, practice
 * exam). Subscribed users and admins always pass.
 *
 * Strategy (race-safe under modest concurrency):
 *   1. If the user has never been gated before, backfill `free_topic_access`
 *      from their `progress` history so existing accounts don't suddenly
 *      "lose" topics they've already worked on.
 *   2. Attempt to claim a slot with `INSERT … ON CONFLICT DO NOTHING`. If
 *      `RETURNING` is empty, the user already had this topic — no new slot
 *      is consumed.
 *   3. Re-count the user's rows. If the count now exceeds the limit AND we
 *      just inserted, roll back that single insert and deny. This makes
 *      two simultaneous "new topic" requests safe: at most one wins.
 */
export async function assertTopicAccess(
  userId: string,
  topicId: number,
): Promise<AccessResult> {
  let [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    [user] = await db
      .insert(usersTable)
      .values({ id: userId, subscriptionStatus: "free", isAdmin: false, onboardingComplete: false, usageCount: 0 })
      .returning();
  }

  if (user.isAdmin || isSubscribedStatus(user.subscriptionStatus)) {
    return { allowed: true, usedTopics: null };
  }

  // Backfill from progress when free_topic_access has no rows for this user.
  const existingBefore = await db
    .select({ topicId: freeTopicAccessTable.topicId })
    .from(freeTopicAccessTable)
    .where(eq(freeTopicAccessTable.userId, userId));
  if (existingBefore.length === 0) {
    const prior = await db
      .select({ topicId: progressTable.topicId })
      .from(progressTable)
      .where(eq(progressTable.userId, userId));
    const uniquePriorIds = Array.from(new Set(prior.map((r) => r.topicId)));
    if (uniquePriorIds.length > 0) {
      await db
        .insert(freeTopicAccessTable)
        .values(uniquePriorIds.map((tid) => ({ userId, topicId: tid })))
        .onConflictDoNothing();
    }
  }

  // Claim attempt. Empty `inserted` => user already had this topic.
  const inserted = await db
    .insert(freeTopicAccessTable)
    .values({ userId, topicId })
    .onConflictDoNothing()
    .returning({ topicId: freeTopicAccessTable.topicId });

  const [{ c }] = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(freeTopicAccessTable)
    .where(eq(freeTopicAccessTable.userId, userId));
  const usedTopics = Number(c);

  if (usedTopics > FREE_TOPIC_LIMIT) {
    if (inserted.length > 0) {
      // Roll back: we're the request that pushed the user over.
      await db
        .delete(freeTopicAccessTable)
        .where(
          and(eq(freeTopicAccessTable.userId, userId), eq(freeTopicAccessTable.topicId, topicId)),
        );
    }
    return {
      allowed: false,
      status: 402,
      body: {
        error: "Free topic limit reached",
        message: `Free accounts get full access to ${FREE_TOPIC_LIMIT} topics. Upgrade to PsychPro Master for unlimited topics.`,
        usedTopics: usedTopics - (inserted.length > 0 ? 1 : 0),
        freeLimit: FREE_TOPIC_LIMIT,
        isOverLimit: true,
      },
    };
  }

  return { allowed: true, usedTopics };
}

/**
 * Convenience wrapper: enforce access and short-circuit the response with
 * 402 if denied. Returns `true` when the caller may proceed.
 */
export async function enforceTopicAccess(
  userId: string,
  topicId: number,
  res: Response,
): Promise<boolean> {
  const result = await assertTopicAccess(userId, topicId);
  if (result.allowed) return true;
  res.status(result.status).json(result.body);
  return false;
}
