import assert from "node:assert/strict";
import { test } from "node:test";
import { db, pool, usersTable, aiGenerationUsageTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { effectivePsychproTier, suiteAccess, monthlyWindow, aiWindow, type AccessUser, TRIAL_MS } from "../src/lib/studyAccessModel";
import { getStudyAccess, startStudyTrial, reserveAiGeneration, refundAiGeneration, StudyAccessError } from "../src/lib/studyAccess";
import { isNewPsychproPrice } from "../src/lib/tierMapping";
import { getEntitlements } from "../src/lib/entitlements";

const now = new Date("2026-10-14T12:00:00Z");
const base: AccessUser = {
  subscriptionStatus: "free", isAdmin: false, psychproTrialStartedAt: null,
  psychproPlanVersion: 0, psychproBillingPeriodStartedAt: null,
  epppPromoRedeemedAt: null, epppAccessUntil: null,
};

test("independent, explicit trials and exact expiry; paid terms remain separate", () => {
  assert.equal(suiteAccess(base, now).psychpro.hasAccess, false);
  assert.equal(suiteAccess(base, now).psychpro.canStart, true);
  const trial = { ...base, psychproTrialStartedAt: now };
  assert.equal(effectivePsychproTier(trial, new Date(now.getTime() + TRIAL_MS - 1)), "scholar");
  assert.equal(effectivePsychproTier(trial, new Date(now.getTime() + TRIAL_MS)), "free");
  assert.equal(suiteAccess(trial, now).eppp.hasAccess, false);
  assert.equal(suiteAccess({ ...base, epppPromoRedeemedAt: now }, now).psychpro.hasAccess, false);
  assert.equal(suiteAccess({ ...trial, subscriptionStatus: "active" }, new Date(now.getTime() + TRIAL_MS)).psychpro.hasAccess, true);
  assert.equal(aiWindow({ ...base, subscriptionStatus: "active" }, now).limit, null);
  assert.equal(aiWindow({ ...base, subscriptionStatus: "scholar" }, now).limit, null);
});

test("monthly and annual quotas use billing anniversary without month-end drift", () => {
  const anchor = new Date("2026-01-31T12:30:00Z");
  const feb = monthlyWindow(anchor, new Date("2026-02-28T12:30:00Z"));
  assert.equal(feb.start.toISOString(), "2026-02-28T12:30:00.000Z");
  assert.equal(feb.end.toISOString(), "2026-03-31T12:30:00.000Z");
  const pre = monthlyWindow(anchor, new Date("2026-02-28T12:29:59Z"));
  assert.equal(pre.start.toISOString(), anchor.toISOString());
  assert.equal(aiWindow({ ...base, psychproTrialStartedAt: now }, now).limit, 5);
  assert.equal(aiWindow({ ...base, subscriptionStatus: "scholar", psychproPlanVersion: 2, psychproBillingPeriodStartedAt: anchor }, now).limit, 50);
});

test("new sales accept only approved PsychPro prices, not legacy or foreign intervals", () => {
  assert.equal(isNewPsychproPrice("Scholar", "usd", 1999, "month"), true);
  assert.equal(isNewPsychproPrice("psychpro", "usd", 1999, "month"), true);
  assert.equal(isNewPsychproPrice("scholar", "usd", 15999, "year"), true);
  assert.equal(isNewPsychproPrice("scholar", "usd", 1999, "month", 1, ""), false, "legacy Scholar prices cannot be used for new purchases");
  for (const args of [
    ["master", "usd", 999, "month", 1], ["eppp", "usd", 1999, "month", 1],
    ["scholar", "usd", 1999, "month", 2], ["scholar", "eur", 1999, "month", 1],
  ] as const) assert.equal(isNewPsychproPrice(...args), false);
});

test("persisted trial opt-in, concurrent redemption/quota, expiry and paid preservation", async () => {
  const id = `study-access-test-${randomUUID()}`;
  try {
    const initial = await getStudyAccess(id);
    assert.equal(initial.psychpro.startedAt, null, "reading/accessing the account must not start a trial");
    assert.equal(initial.psychpro.hasAccess, false);
    const outcomes = await Promise.allSettled([startStudyTrial(id, "psychpro"), startStudyTrial(id, "psychpro")]);
    assert.equal(outcomes.filter(r => r.status === "fulfilled").length, 1);
    const state = await getStudyAccess(id);
    assert.equal(state.psychpro.hasAccess, true);
    assert.equal(state.eppp.hasAccess, false);
    assert.equal(state.aiUsage.remaining, 5);
    assert.equal((await getEntitlements(id)).quizLocked, false);
    const reservations = await Promise.allSettled(Array.from({ length: 8 }, () => reserveAiGeneration(id, 1)));
    const successes = reservations.filter((r): r is PromiseFulfilledResult<number | null> => r.status === "fulfilled");
    assert.equal(successes.length, 5, "parallel requests must not exceed five trial units");
    assert.equal((await getStudyAccess(id)).aiUsage.remaining, 0);
    await refundAiGeneration(successes[0].value);
    assert.equal((await getStudyAccess(id)).aiUsage.remaining, 1, "failed generation is refunded");
    await startStudyTrial(id, "eppp");
    assert.equal((await getStudyAccess(id)).eppp.hasAccess, true);
    await db.update(usersTable).set({ psychproTrialStartedAt: new Date(Date.now() - TRIAL_MS - 1000) }).where(eq(usersTable.id, id));
    assert.equal((await getStudyAccess(id)).psychpro.hasAccess, false);
    assert.equal((await getStudyAccess(id)).eppp.hasAccess, true, "one suite's expiry must not revoke the other");
    const expired = await getEntitlements(id);
    assert.equal(expired.quizLocked, true);
    assert.equal(expired.examLocked, true);
    assert.equal(expired.studyGuideLocked, true);
    assert.equal(expired.flashcardPreviewLimit, 0);
    await assert.rejects(() => reserveAiGeneration(id, 1), StudyAccessError);
    await assert.rejects(() => startStudyTrial(id, "psychpro"), StudyAccessError);
    await db.update(usersTable).set({ subscriptionStatus: "scholar", psychproPlanVersion: 2, psychproBillingPeriodStartedAt: new Date() }).where(eq(usersTable.id, id));
    assert.equal((await getStudyAccess(id)).aiUsage.limit, 50);
    const paid = await reserveAiGeneration(id, 4);
    assert.equal((await getStudyAccess(id)).aiUsage.remaining, 46);
    await refundAiGeneration(paid);
    await db.update(usersTable).set({ subscriptionStatus: "active", psychproPlanVersion: 0 }).where(eq(usersTable.id, id));
    assert.equal((await getStudyAccess(id)).psychpro.legacy, true);
    assert.equal((await getStudyAccess(id)).aiUsage.unlimited, true);
    assert.equal(await reserveAiGeneration(id, 7), null);
  } finally {
    await db.delete(aiGenerationUsageTable).where(eq(aiGenerationUsageTable.userId, id));
    await db.delete(usersTable).where(eq(usersTable.id, id));
    await pool.end();
  }
});
