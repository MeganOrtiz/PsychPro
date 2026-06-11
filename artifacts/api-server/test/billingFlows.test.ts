// Billing flow integration tests
// =====================================================================
// Exercises the REAL entitlement read path (getEntitlements) against the
// REAL Postgres database, plus the canonical metadata→stored-status step
// that subscription finalization uses, to prove the four user-facing
// guarantees the "bulletproof tier selection" task requires:
//
//   1. A free user who exhausts the capped quiz/exam is correctly LOCKED
//      (the signal the client turns into an upgrade prompt), while a fresh
//      free user still has their first quiz/exam available.
//   2. Selecting Scholar lands on Scholar and selecting Master lands on
//      Master (pro) — never cross-wired — when the chosen plan's tier
//      metadata is finalized into the stored subscription status.
//   3. Buying EPPP grants EPPP access ONLY and never the general
//      Master/Scholar subscription; conversely a Master/Scholar sub never
//      grants EPPP. The two access dimensions stay independent.
//   4. An unknown/untagged plan resolves to the free tier (fail-safe).
//
// Unlike billingModel.test.ts (pure mapping units), this suite writes real
// rows and reads them back through getEntitlements — the same function the
// API serves to the client — so the end-to-end decision is validated, not
// just the lookup tables. The Stripe network call that turns a priceId into
// a product is the only step not exercised here (it has no injection seam);
// the metadata→status decision it feeds is covered via the canonical
// subscriptionStatusFromTierMetadata helper the webhook itself calls.

import { db, pool } from "@workspace/db";
import {
  usersTable,
  topicsTable,
  quizAttemptsTable,
  examAttemptsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";

import { getEntitlements } from "../src/lib/entitlements";
import {
  subscriptionStatusFromTierMetadata,
  tierFromStatus,
} from "../src/lib/tierMapping";

class AssertionError extends Error {}
function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new AssertionError(message);
}
function eq_(actual: unknown, expected: unknown, label: string): void {
  assert(
    JSON.stringify(actual) === JSON.stringify(expected),
    `${label}: expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`,
  );
}

interface TestCase {
  name: string;
  fn: () => void | Promise<void>;
}
const tests: TestCase[] = [];
function test(name: string, fn: () => void | Promise<void>): void {
  tests.push({ name, fn });
}

// Unique, collision-proof identifiers for this run; everything is removed in
// teardown so the suite leaves the database exactly as it found it.
const RUN = `it-billing-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const TOPIC_NAME = `__test_topic_${RUN}`;
let topicId = 0;

const userIds: string[] = [];
async function makeUser(overrides: Partial<typeof usersTable.$inferInsert> = {}): Promise<string> {
  const id = `${RUN}-u${userIds.length}`;
  userIds.push(id);
  await db.insert(usersTable).values({
    id,
    subscriptionStatus: "free",
    isAdmin: false,
    onboardingComplete: false,
    usageCount: 0,
    ...overrides,
  });
  return id;
}

// ---------------------------------------------------------------------
// Scenario 1 — free-cap exhaustion → lock + upgrade signal
// ---------------------------------------------------------------------
test("free user: fresh account has first quiz/exam available, then LOCKS at the cap", async () => {
  const userId = await makeUser();

  // Fresh free user: capped flashcards + study guide, but the first quiz and
  // exam are still available (no attempts yet).
  const fresh = await getEntitlements(userId);
  eq_(fresh.tier, "free", "fresh tier");
  eq_(fresh.isSubscribed, false, "fresh isSubscribed");
  eq_(
    {
      flashcardsCapped: fresh.flashcardsCapped,
      quizLocked: fresh.quizLocked,
      examLocked: fresh.examLocked,
      studyGuideLocked: fresh.studyGuideLocked,
    },
    { flashcardsCapped: true, quizLocked: false, examLocked: false, studyGuideLocked: true },
    "fresh free flags",
  );

  // Use the one free quiz and the one free exam (lifetime caps are 1 / 1).
  await db.insert(quizAttemptsTable).values({ userId, topicId, score: 5, total: 10 });
  await db.insert(examAttemptsTable).values({ userId, topicId, score: 6, total: 10 });

  const after = await getEntitlements(userId);
  eq_(after.quizzesCompleted, 1, "quizzesCompleted");
  eq_(after.examsCompleted, 1, "examsCompleted");
  eq_(
    {
      quizLocked: after.quizLocked,
      examLocked: after.examLocked,
    },
    { quizLocked: true, examLocked: true },
    "free user locks at the cap (client shows the upgrade prompt)",
  );
});

// ---------------------------------------------------------------------
// Scenario 2 — Scholar lands on Scholar, Master lands on Master (pro);
//              never cross-wired. The metadata the user's chosen plan
//              carries is finalized into the stored status the same way the
//              webhook does it, then read back through getEntitlements.
// ---------------------------------------------------------------------
test("selecting Scholar lands on Scholar and Master lands on Master — no cross-wiring", async () => {
  const scholarStatus = subscriptionStatusFromTierMetadata("scholar");
  const masterStatus = subscriptionStatusFromTierMetadata("master");
  assert(scholarStatus !== null, "scholar metadata must finalize to a paid status");
  assert(masterStatus !== null, "master metadata must finalize to a paid status");

  const scholarUser = await makeUser({ subscriptionStatus: scholarStatus! });
  const masterUser = await makeUser({ subscriptionStatus: masterStatus! });

  const scholar = await getEntitlements(scholarUser);
  const master = await getEntitlements(masterUser);

  eq_(scholar.tier, "scholar", "scholar selection → scholar tier");
  eq_(master.tier, "pro", "master selection → pro tier (Master is the display alias)");
  // Cross-wiring guard: each lands on exactly its own tier, never the other.
  assert(scholar.tier !== master.tier, "Scholar and Master must not collapse to the same tier");
  eq_(scholar.isSubscribed, true, "scholar isSubscribed");
  eq_(master.isSubscribed, true, "master isSubscribed");
  // A paid general subscription must NOT confer EPPP access.
  eq_(scholar.epppAccess, false, "scholar has no EPPP access");
  eq_(master.epppAccess, false, "master has no EPPP access");
});

// ---------------------------------------------------------------------
// Scenario 3 — EPPP grants EPPP ONLY, never the general subscription, and
//              the general subscription never grants EPPP.
// ---------------------------------------------------------------------
test("buying EPPP grants EPPP access only — never the general Master/Scholar tier", async () => {
  // EPPP buyer: epppAccessUntil in the future, subscription still free.
  const future = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const epppUser = await makeUser({ subscriptionStatus: "free", epppAccessUntil: future });

  // EPPP content evaluation: access granted.
  const epppView = await getEntitlements(epppUser, { eppp: true });
  eq_(epppView.epppAccess, true, "EPPP buyer has EPPP access");
  // ...but the general subscription is untouched — still free, not subscribed.
  eq_(epppView.tier, "free", "EPPP never sets the general tier");
  eq_(epppView.isSubscribed, false, "EPPP never makes the user a general subscriber");

  // General content evaluation for the same user: still capped like a free
  // user (EPPP does not unlock general content).
  const generalView = await getEntitlements(epppUser, { eppp: false });
  eq_(generalView.flashcardsCapped, true, "EPPP buyer is still capped on general content");
  eq_(generalView.studyGuideLocked, true, "EPPP buyer still locked out of general study guides");
});

test("a Master/Scholar subscriber never gets EPPP access by virtue of the subscription", async () => {
  const scholarUser = await makeUser({
    subscriptionStatus: subscriptionStatusFromTierMetadata("scholar")!,
    epppAccessUntil: null,
  });
  // Even when evaluating EPPP content, a general subscriber without EPPP access
  // is NOT unrestricted there.
  const epppView = await getEntitlements(scholarUser, { eppp: true });
  eq_(epppView.epppAccess, false, "scholar sub does not grant EPPP");
  eq_(epppView.flashcardsCapped, true, "scholar is capped on EPPP content without EPPP access");
});

// ---------------------------------------------------------------------
// Scenario 4 — unknown / untagged plan fails safe to Free
// ---------------------------------------------------------------------
test("an unknown/untagged plan resolves to Free (fail-safe), never an accidental paid tier", async () => {
  // The webhook stores whatever subscriptionStatusFromTierMetadata returns, or
  // "free" when it returns null. An unrecognized tag must finalize to free.
  eq_(subscriptionStatusFromTierMetadata("totally-made-up-tier"), null, "unknown metadata → null status");
  eq_(subscriptionStatusFromTierMetadata(undefined), null, "missing metadata → null status");

  const storedForUnknown = subscriptionStatusFromTierMetadata("totally-made-up-tier") ?? "free";
  const user = await makeUser({ subscriptionStatus: storedForUnknown });

  const ent = await getEntitlements(user);
  eq_(ent.tier, "free", "unknown plan → free tier");
  eq_(ent.isSubscribed, false, "unknown plan → not subscribed");
  // And the stored status itself reads as free through the canonical mapping.
  eq_(tierFromStatus(storedForUnknown), "free", "stored status reads as free");
});

// ---------------------------------------------------------------------
async function setup(): Promise<void> {
  const [topic] = await db
    .insert(topicsTable)
    .values({
      name: TOPIC_NAME,
      category: "__test__",
      description: "temporary topic for billing-flow integration tests",
    })
    .returning();
  topicId = topic.id;
}

async function teardown(): Promise<void> {
  // Remove rows in FK-safe order: attempts → users → topic.
  for (const userId of userIds) {
    await db.delete(quizAttemptsTable).where(eq(quizAttemptsTable.userId, userId));
    await db.delete(examAttemptsTable).where(eq(examAttemptsTable.userId, userId));
    await db.delete(usersTable).where(eq(usersTable.id, userId));
  }
  if (topicId) {
    await db.delete(topicsTable).where(eq(topicsTable.id, topicId));
  }
}

async function main(): Promise<void> {
  let failures = 0;
  try {
    await setup();
    for (const t of tests) {
      process.stdout.write(`• ${t.name} ... `);
      try {
        await t.fn();
        process.stdout.write("OK\n");
      } catch (err) {
        failures += 1;
        process.stdout.write("FAIL\n");
        console.error(err instanceof Error ? (err.stack ?? err.message) : err);
      }
    }
  } finally {
    try {
      await teardown();
    } catch (err) {
      console.error("teardown error:", err instanceof Error ? err.message : err);
    }
    await pool.end().catch(() => undefined);
  }

  if (failures > 0) {
    console.error(`\n❌ ${failures} of ${tests.length} billing-flow test(s) failed`);
    process.exit(1);
  }
  console.log(`\n✅ All ${tests.length} billing-flow integration test(s) passed`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err instanceof Error ? (err.stack ?? err.message) : err);
  process.exit(1);
});
