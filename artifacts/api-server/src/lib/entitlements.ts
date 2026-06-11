import { db } from "@workspace/db";
import { usersTable, quizAttemptsTable, examAttemptsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

// Authoritative free-tier caps. Mirrored on the client in
// artifacts/neuronotes/src/lib/limits.ts — keep in sync.
export const FREE_FLASHCARD_PREVIEW = 10;
export const FREE_QUIZ_LIMIT = 1;
export const FREE_EXAM_LIMIT = 1;

export type Tier = "free" | "pro" | "scholar";

export type Entitlements = {
  tier: Tier;
  isAdmin: boolean;
  isSubscribed: boolean;
  // EPPP Mastery Suite access is a SEPARATE access level from Master/Scholar.
  // It is driven by the expiry date on usersTable.epppAccessUntil (set by the
  // $99/mo EPPP subscription or the $499/$799 one-time purchases) and is never
  // granted by the Master/Scholar subscription. Admins get everything.
  epppAccess: boolean;
  epppAccessUntil: string | null;
  flashcardPreviewLimit: number;
  quizLimit: number;
  examLimit: number;
  quizzesCompleted: number;
  examsCompleted: number;
  flashcardsCapped: boolean;
  quizLocked: boolean;
  examLocked: boolean;
  studyGuideLocked: boolean;
};

function tierFromStatus(s: string | null | undefined): Tier {
  if (s === "scholar") return "scholar";
  if (s === "active" || s === "pro" || s === "trialing") return "pro";
  return "free";
}

type EpppUserFields = {
  epppAccessUntil: Date | null;
  isAdmin: boolean | null;
};

/** True when the user currently has EPPP Mastery Suite access. */
export function computeEpppAccess(user: EpppUserFields): boolean {
  if (user.isAdmin) return true;
  return !!user.epppAccessUntil && user.epppAccessUntil.getTime() > Date.now();
}

/**
 * Standalone EPPP access check for callers (e.g. mastery-exams) that gate EPPP
 * content without needing the full entitlements payload.
 */
export async function hasEpppAccess(userId: string | null | undefined): Promise<boolean> {
  if (!userId) return false;
  const [user] = await db
    .select({ epppAccessUntil: usersTable.epppAccessUntil, isAdmin: usersTable.isAdmin })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!user) return false;
  return computeEpppAccess(user);
}

/**
 * Single source of truth for what a user is allowed to do.
 *
 * For GENERAL (main-site) content, access is governed by the Master/Scholar
 * subscription tier. For EPPP content, pass `{ eppp: true }` — access is then
 * governed by EPPP access (epppAccessUntil) and NOT by the subscription. Admins
 * bypass both. Free users are capped per the constants above (lifetime counts
 * on the attempts tables — a free user who has ever completed one quiz cannot
 * start another).
 */
export async function getEntitlements(
  userId: string,
  opts?: { eppp?: boolean },
): Promise<Entitlements> {
  let [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    [user] = await db
      .insert(usersTable)
      .values({ id: userId, subscriptionStatus: "free", isAdmin: false, onboardingComplete: false, usageCount: 0 })
      .returning();
  }

  const tier = tierFromStatus(user.subscriptionStatus);
  const isAdmin = !!user.isAdmin;
  const isSubscribed = tier !== "free";
  const epppAccess = computeEpppAccess(user);

  // When evaluating EPPP content, the Master/Scholar subscription does NOT
  // unlock it — only EPPP access (or admin) does. Conversely, EPPP access does
  // not unlock general content (that path keeps `isSubscribed`).
  const forEppp = opts?.eppp === true;
  const unrestricted = isAdmin || (forEppp ? epppAccess : isSubscribed);

  const [{ qc }] = await db
    .select({ qc: sql<number>`count(*)::int` })
    .from(quizAttemptsTable)
    .where(eq(quizAttemptsTable.userId, userId));
  const [{ ec }] = await db
    .select({ ec: sql<number>`count(*)::int` })
    .from(examAttemptsTable)
    .where(eq(examAttemptsTable.userId, userId));
  const quizzesCompleted = Number(qc);
  const examsCompleted = Number(ec);

  return {
    tier,
    isAdmin,
    isSubscribed,
    epppAccess,
    epppAccessUntil: user.epppAccessUntil ? user.epppAccessUntil.toISOString() : null,
    flashcardPreviewLimit: FREE_FLASHCARD_PREVIEW,
    quizLimit: FREE_QUIZ_LIMIT,
    examLimit: FREE_EXAM_LIMIT,
    quizzesCompleted,
    examsCompleted,
    flashcardsCapped: !unrestricted,
    quizLocked: !unrestricted && quizzesCompleted >= FREE_QUIZ_LIMIT,
    examLocked: !unrestricted && examsCompleted >= FREE_EXAM_LIMIT,
    studyGuideLocked: !unrestricted,
  };
}
