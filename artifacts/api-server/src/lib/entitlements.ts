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

/**
 * Single source of truth for what a user is allowed to do. Subscribed users
 * (pro/scholar) and admins get full access; free users are capped per the
 * constants above. Lifetime counts on the existing attempts tables are used
 * — a free user who has ever completed one quiz cannot start another.
 */
export async function getEntitlements(userId: string): Promise<Entitlements> {
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
  const unrestricted = isAdmin || isSubscribed;

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
