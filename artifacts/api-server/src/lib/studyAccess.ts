import { db, usersTable, aiGenerationUsageTable } from "@workspace/db";
import { and, eq, isNull, sql } from "drizzle-orm";
import { aiWindow, suiteAccess } from "./studyAccessModel";

export class StudyAccessError extends Error {
  constructor(message: string, public status = 403, public code = "study_access_required") { super(message); }
}

export async function ensureStudyUser(userId: string) {
  await db.insert(usersTable).values({ id: userId }).onConflictDoNothing({ target: usersTable.id });
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) throw new Error("Unable to read study account");
  return user;
}

export async function getStudyAccess(userId: string) {
  const user = await ensureStudyUser(userId);
  const window = aiWindow(user);
  const [row] = await db.select({ used: sql<number>`coalesce(sum(${aiGenerationUsageTable.units}), 0)::int` })
    .from(aiGenerationUsageTable)
    .where(and(eq(aiGenerationUsageTable.userId, userId), eq(aiGenerationUsageTable.windowKey, window.key)));
  const used = Number(row?.used ?? 0);
  return { ...suiteAccess(user), aiUsage: {
    limit: window.limit, used, remaining: window.limit === null ? null : Math.max(0, window.limit - used),
    resetsAt: window.end?.toISOString() ?? null, unlimited: window.limit === null,
  } };
}

export async function startStudyTrial(userId: string, suite: "psychpro" | "eppp", now = new Date()) {
  await ensureStudyUser(userId);
  await db.transaction(async tx => {
    const [user] = await tx.select().from(usersTable).where(eq(usersTable.id, userId)).for("update");
    if (!suiteAccess(user, now)[suite].canStart) throw new StudyAccessError("This trial has already been claimed, or you already have access.", 409, "trial_unavailable");
    const column = suite === "psychpro" ? usersTable.psychproTrialStartedAt : usersTable.epppPromoRedeemedAt;
    await tx.update(usersTable)
      .set(suite === "psychpro" ? { psychproTrialStartedAt: now } : { epppPromoRedeemedAt: now })
      .where(and(eq(usersTable.id, userId), isNull(column)));
  });
  return getStudyAccess(userId);
}

// Lock the account row so concurrent requests on different server instances
// cannot both spend the last unit. Reserve BEFORE calling the AI provider.
export async function reserveAiGeneration(userId: string, units: number): Promise<number | null> {
  if (!Number.isInteger(units) || units < 1 || units > 7) throw new StudyAccessError("Invalid generation request.", 400);
  return db.transaction(async tx => {
    const [user] = await tx.select().from(usersTable).where(eq(usersTable.id, userId)).for("update");
    if (!user || !suiteAccess(user).psychpro.hasAccess) throw new StudyAccessError("Start your PsychPro free week or subscribe to generate study materials.");
    const window = aiWindow(user);
    if (window.limit === null) return null;
    const [usage] = await tx.select({ used: sql<number>`coalesce(sum(${aiGenerationUsageTable.units}), 0)::int` })
      .from(aiGenerationUsageTable)
      .where(and(eq(aiGenerationUsageTable.userId, userId), eq(aiGenerationUsageTable.windowKey, window.key)));
    if (Number(usage.used) + units > window.limit) {
      throw new StudyAccessError(`AI allowance exceeded. This request uses ${units} generations; ${Math.max(0, window.limit - Number(usage.used))} remain.`, 429, "ai_allowance_exceeded");
    }
    const [reservation] = await tx.insert(aiGenerationUsageTable).values({ userId, windowKey: window.key, units }).returning();
    return reservation.id;
  });
}

export async function refundAiGeneration(id: number | null) {
  if (id !== null) await db.delete(aiGenerationUsageTable).where(eq(aiGenerationUsageTable.id, id));
}
