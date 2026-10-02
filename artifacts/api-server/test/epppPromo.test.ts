import { db, pool } from "@workspace/db";
import {
  examAttemptsTable,
  libraryBooksTable,
  quizAttemptsTable,
  topicsTable,
  userLibraryBooksTable,
  usersTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { getEntitlements } from "../src/lib/entitlements";
import {
  EPPP_PROMO_DURATION_MS,
  getEpppPromoState,
  redeemEpppPromo,
} from "../src/lib/epppPromo";

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

const RUN = `it-eppp-promo-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const userIds: string[] = [];
let topicId = 0;
const bookIds: string[] = [];

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

test("redemption expires exactly seven days from redemption and leaves existing paid access intact", async () => {
  const paidUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const userId = await makeUser({
    epppAccessUntil: paidUntil,
    subscriptionStatus: "scholar",
    selectedTier: "scholar",
    selectedProduct: "Scholar Annual",
    goal: "preserve goal",
    degree: "preserve degree",
    referralSource: "preserve referral",
  });
  const now = new Date();
  const result = await redeemEpppPromo(userId, "  ePpP7  ", now);
  assert(result.kind === "redeemed", "valid case-insensitive, trimmed code should redeem");
  eq_(result.state.redeemedAt?.getTime(), now.getTime(), "redemption instant");
  eq_(
    result.state.expiresAt?.getTime(),
    now.getTime() + EPPP_PROMO_DURATION_MS,
    "promotion expiration",
  );
  eq_(result.state.epppAccessUntil?.getTime(), paidUntil.getTime(), "effective access retains later paid expiry");

  const [stored] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  eq_(stored.epppAccessUntil?.getTime(), paidUntil.getTime(), "paid expiry is not changed");
  eq_(stored.subscriptionStatus, "scholar", "PsychPro subscription tier is unchanged");
  eq_(stored.selectedTier, "scholar", "selected tier is unchanged");
  eq_(stored.selectedProduct, "Scholar Annual", "selected product is unchanged");
  eq_(stored.goal, "preserve goal", "onboarding goal is unchanged");
  eq_(stored.degree, "preserve degree", "onboarding degree is unchanged");
  eq_(stored.referralSource, "preserve referral", "referral source is unchanged");
});

test("promo expiry extends only effective access when existing paid access ends sooner", async () => {
  const now = new Date();
  const paidUntil = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const userId = await makeUser({ epppAccessUntil: paidUntil });
  const result = await redeemEpppPromo(userId, "EPPP7", now);
  assert(result.kind === "redeemed", "promotion should redeem");
  eq_(
    result.state.epppAccessUntil?.getTime(),
    now.getTime() + 7 * 24 * 60 * 60 * 1000,
    "effective access is the later of paid expiry and promo expiry",
  );
  eq_(
    result.state.expiresAt?.getTime(),
    now.getTime() + EPPP_PROMO_DURATION_MS,
    "promo expiry remains derived from redemption time",
  );

  // A later Stripe renewal changes paid expiry, but the promo window remains
  // anchored to redeemedAt and effective access naturally follows the later
  // paid entitlement.
  const renewedPaidUntil = new Date(now.getTime() + 45 * 24 * 60 * 60 * 1000);
  await db
    .update(usersTable)
    .set({ epppAccessUntil: renewedPaidUntil })
    .where(eq(usersTable.id, userId));
  const renewedState = await getEpppPromoState(userId);
  eq_(renewedState.expiresAt?.getTime(), now.getTime() + EPPP_PROMO_DURATION_MS, "Stripe updates do not extend promo expiry");
  eq_(renewedState.epppAccessUntil?.getTime(), renewedPaidUntil.getTime(), "effective EPPP expiry includes later paid access");
  const entitlements = await getEntitlements(userId, { eppp: true });
  eq_(entitlements.epppAccessUntil, renewedPaidUntil.toISOString(), "live entitlement reflects Stripe's later paid expiry");
});

test("invalid code is rejected without changing redemption state", async () => {
  const userId = await makeUser();
  const invalid = await redeemEpppPromo(userId, " EPPP 7 ");
  eq_(invalid.kind, "invalid", "invalid code result");
  const state = await getEpppPromoState(userId);
  eq_(state.canRedeem, true, "invalid code does not consume promotion");
  eq_(state.redeemedAt, null, "invalid code leaves redeemedAt null");
});

test("conditional redemption allows exactly one winner for concurrent requests", async () => {
  const userId = await makeUser();
  const redeemedAt = new Date();
  const [first, second] = await Promise.all([
    redeemEpppPromo(userId, "EPPP7", redeemedAt),
    redeemEpppPromo(userId, " eppp7 ", redeemedAt),
  ]);
  const results = [first.kind, second.kind].sort();
  eq_(results, ["already-redeemed", "redeemed"], "single conditional update permits one winner");
  const state = await getEpppPromoState(userId);
  eq_(state.canRedeem, false, "concurrent redemption is permanently consumed");
  eq_(state.redeemedAt?.getTime(), redeemedAt.getTime(), "stored redemption timestamp");
});

test("live promotion grants EPPP tools to a non-admin free account without changing main-suite limits or books", async () => {
  const userId = await makeUser({ subscriptionStatus: "free", isAdmin: false });
  await db.insert(quizAttemptsTable).values([
    { userId, topicId, score: 1, total: 2 },
    { userId, topicId, score: 1, total: 2 },
  ]);
  await db.insert(examAttemptsTable).values([
    { userId, topicId, score: 1, total: 2 },
    { userId, topicId, score: 1, total: 2 },
  ]);

  const bookId = `${RUN}-book`;
  bookIds.push(bookId);
  await db.insert(libraryBooksTable).values({
    id: bookId,
    title: "Preserved library book",
    description: "Test fixture",
    pdfObjectPath: `test/${bookId}.pdf`,
    contentHash: `hash-${bookId}`,
  });
  await db.insert(userLibraryBooksTable).values({ userId, bookId, source: "test" });

  const result = await redeemEpppPromo(userId, "EPPP7");
  assert(result.kind === "redeemed", "free account should redeem promotion");

  const eppp = await getEntitlements(userId, { eppp: true });
  eq_(eppp.tier, "free", "promotion does not change PsychPro tier");
  eq_(eppp.isAdmin, false, "test account is not admin");
  eq_(eppp.epppAccess, true, "live promo grants EPPP entitlement");
  eq_(
    { flashcardsCapped: eppp.flashcardsCapped, quizLocked: eppp.quizLocked, examLocked: eppp.examLocked, studyGuideLocked: eppp.studyGuideLocked },
    { flashcardsCapped: false, quizLocked: false, examLocked: false, studyGuideLocked: false },
    "all EPPP study tools are unlocked despite lifetime free limits",
  );

  const general = await getEntitlements(userId);
  eq_(general.epppAccess, true, "promo status is visible but separate from the general suite");
  eq_(
    { flashcardsCapped: general.flashcardsCapped, quizLocked: general.quizLocked, examLocked: general.examLocked, studyGuideLocked: general.studyGuideLocked },
    { flashcardsCapped: true, quizLocked: true, examLocked: true, studyGuideLocked: true },
    "main-suite free limits remain closed",
  );
  const [ownedBook] = await db
    .select({ bookId: userLibraryBooksTable.bookId })
    .from(userLibraryBooksTable)
    .where(eq(userLibraryBooksTable.userId, userId));
  eq_(ownedBook?.bookId, bookId, "existing library ownership remains intact");

  const expiredAt = new Date(Date.now() - EPPP_PROMO_DURATION_MS - 1000);
  await db
    .update(usersTable)
    .set({ epppPromoRedeemedAt: expiredAt, epppAccessUntil: null })
    .where(eq(usersTable.id, userId));
  const expired = await getEntitlements(userId, { eppp: true });
  eq_(expired.epppAccess, false, "expired promo no longer grants effective EPPP access");
});

async function setup(): Promise<void> {
  const [topic] = await db
    .insert(topicsTable)
    .values({
      name: `${RUN}-topic`,
      category: "__test__",
      description: "temporary EPPP promo entitlement test topic",
    })
    .returning();
  topicId = topic.id;
}

async function teardown(): Promise<void> {
  for (const userId of userIds) {
    await db.delete(quizAttemptsTable).where(eq(quizAttemptsTable.userId, userId));
    await db.delete(examAttemptsTable).where(eq(examAttemptsTable.userId, userId));
    await db.delete(userLibraryBooksTable).where(eq(userLibraryBooksTable.userId, userId));
    await db.delete(usersTable).where(eq(usersTable.id, userId));
  }
  for (const bookId of bookIds) {
    await db.delete(libraryBooksTable).where(eq(libraryBooksTable.id, bookId));
  }
  if (topicId) await db.delete(topicsTable).where(eq(topicsTable.id, topicId));
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
    console.error(`\n❌ ${failures} of ${tests.length} EPPP promo test(s) failed`);
    process.exit(1);
  }
  console.log(`\n✅ All ${tests.length} EPPP promo integration test(s) passed`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err instanceof Error ? (err.stack ?? err.message) : err);
  process.exit(1);
});