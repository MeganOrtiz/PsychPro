// Canonical billing-model regression test
// =====================================================================
// Locks the SINGLE source of truth in src/lib/tierMapping.ts so a future
// refactor or rebase cannot silently reintroduce a second, competing
// access model. It asserts the three invariants that define the model:
//
//   1. GENERAL subscription mapping (Master/Scholar):
//        Stripe metadata "pro"/"master" → stored "active"
//        Stripe metadata "scholar"      → stored "scholar"
//        anything else / unapproved     → null (caller treats as free)
//      and the stored-status → tier / API-shape mappings, including the
//      "master" == "active" == "pro" alias and tolerated legacy
//      "trialing".
//
//   2. EPPP is a SEPARATE access level:
//        the EPPP product NEVER maps to a Master/Scholar subscription
//        status, and the subscription tiers never classify as EPPP.
//
//   3. The single canonical surface is the one every billing path imports
//      from — entitlements.ts re-exports the same `Tier`, and the live
//      route files reference tierMapping rather than re-declaring the
//      mappings inline (the "no second model" guard).

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

import {
  APPROVED_SUBSCRIPTION_TIERS,
  ACTIVE_SUBSCRIPTION_STATUSES,
  EPPP_TIER,
  isApprovedSubscriptionTier,
  isEpppTierMetadata,
  normalizeTierMetadata,
  subscriptionStatusApiShape,
  subscriptionStatusFromTierMetadata,
  tierFromStatus,
} from "../src/lib/tierMapping";

class AssertionError extends Error {}
function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new AssertionError(message);
}
function eq(actual: unknown, expected: unknown, label: string): void {
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

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, "..", "src");

// ---------------------------------------------------------------------
// 1. Stripe metadata → stored subscription_status
// ---------------------------------------------------------------------

test("subscriptionStatusFromTierMetadata: master & pro are aliases → 'active'", () => {
  eq(subscriptionStatusFromTierMetadata("pro"), "active", "pro");
  eq(subscriptionStatusFromTierMetadata("master"), "active", "master");
  // Case-insensitive (Stripe dashboard may store "Master"/"Pro").
  eq(subscriptionStatusFromTierMetadata("Master"), "active", "Master");
  eq(subscriptionStatusFromTierMetadata("PRO"), "active", "PRO");
});

test("subscriptionStatusFromTierMetadata: scholar → 'scholar'", () => {
  eq(subscriptionStatusFromTierMetadata("scholar"), "scholar", "scholar");
  eq(subscriptionStatusFromTierMetadata("Scholar"), "scholar", "Scholar");
});

test("subscriptionStatusFromTierMetadata: EPPP & unknown & empty → null (free)", () => {
  eq(subscriptionStatusFromTierMetadata("eppp"), null, "eppp");
  eq(subscriptionStatusFromTierMetadata("anything-else"), null, "unknown");
  eq(subscriptionStatusFromTierMetadata(""), null, "empty");
  eq(subscriptionStatusFromTierMetadata(undefined), null, "undefined");
  eq(subscriptionStatusFromTierMetadata(null), null, "null");
});

test("approved-tier allowlist contains exactly pro/master/scholar", () => {
  eq([...APPROVED_SUBSCRIPTION_TIERS].sort(), ["master", "pro", "scholar"], "allowlist");
  assert(isApprovedSubscriptionTier("pro"), "pro approved");
  assert(isApprovedSubscriptionTier("master"), "master approved");
  assert(isApprovedSubscriptionTier("scholar"), "scholar approved");
  assert(isApprovedSubscriptionTier("SCHOLAR"), "case-insensitive approved");
  assert(!isApprovedSubscriptionTier("eppp"), "eppp NOT a general approved tier");
  assert(!isApprovedSubscriptionTier("free"), "free NOT approved");
  assert(!isApprovedSubscriptionTier(undefined), "undefined NOT approved");
});

// ---------------------------------------------------------------------
// 2. stored subscription_status → internal Tier
// ---------------------------------------------------------------------

test("tierFromStatus: active/pro/trialing → 'pro'", () => {
  eq(tierFromStatus("active"), "pro", "active");
  eq(tierFromStatus("pro"), "pro", "pro");
  eq(tierFromStatus("trialing"), "pro", "trialing");
});

test("tierFromStatus: scholar → 'scholar'", () => {
  eq(tierFromStatus("scholar"), "scholar", "scholar");
});

test("tierFromStatus: free/unknown/null → 'free'", () => {
  eq(tierFromStatus("free"), "free", "free");
  eq(tierFromStatus("eppp"), "free", "eppp is NOT a general tier");
  eq(tierFromStatus("canceled"), "free", "canceled");
  eq(tierFromStatus(undefined), "free", "undefined");
  eq(tierFromStatus(null), "free", "null");
});

test("entitlements.ts re-exports the SAME Tier from tierMapping (one type)", async () => {
  // A runtime import proves the module loads; the type identity is enforced by
  // tsc. This guards against entitlements.ts re-declaring its own Tier union.
  const ent = await import("../src/lib/entitlements");
  assert(typeof ent.getEntitlements === "function", "getEntitlements exported");
});

// ---------------------------------------------------------------------
// 3. stored subscription_status → GET /subscription/status {status,tier}
// ---------------------------------------------------------------------

test("subscriptionStatusApiShape mirrors the documented response shape", () => {
  eq(subscriptionStatusApiShape("scholar"), { status: "active", tier: "scholar" }, "scholar");
  eq(subscriptionStatusApiShape("active"), { status: "active", tier: "pro" }, "active");
  eq(subscriptionStatusApiShape("pro"), { status: "active", tier: "pro" }, "pro");
  eq(subscriptionStatusApiShape("trialing"), { status: "active", tier: "pro" }, "trialing");
  eq(subscriptionStatusApiShape("free"), { status: "free", tier: "free" }, "free");
  eq(subscriptionStatusApiShape(undefined), { status: "free", tier: "free" }, "undefined");
  eq(subscriptionStatusApiShape("eppp"), { status: "free", tier: "free" }, "eppp never general");
});

// ---------------------------------------------------------------------
// 4. EPPP separation invariants
// ---------------------------------------------------------------------

test("EPPP product never maps to a Master/Scholar subscription status", () => {
  eq(EPPP_TIER, "eppp", "EPPP_TIER constant");
  assert(isEpppTierMetadata("eppp"), "eppp recognized");
  assert(isEpppTierMetadata("EPPP"), "case-insensitive eppp");
  // The EPPP product must produce a null subscription status (i.e. it never
  // grants a general subscription) ...
  eq(subscriptionStatusFromTierMetadata(EPPP_TIER), null, "eppp → null status");
  eq(tierFromStatus(EPPP_TIER), "free", "eppp status → free tier");
  // ... and the general tiers must never classify as EPPP.
  for (const t of APPROVED_SUBSCRIPTION_TIERS) {
    assert(!isEpppTierMetadata(t), `${t} must NOT be EPPP`);
  }
  assert(!isEpppTierMetadata("scholar"), "scholar not eppp");
  assert(!isEpppTierMetadata(undefined), "undefined not eppp");
});

test("active paid statuses are exactly the general paid set (EPPP excluded)", () => {
  eq(
    [...ACTIVE_SUBSCRIPTION_STATUSES].sort(),
    ["active", "pro", "scholar", "trialing"],
    "active statuses",
  );
  assert(!ACTIVE_SUBSCRIPTION_STATUSES.has("eppp"), "eppp is NOT a general paid status");
  assert(!ACTIVE_SUBSCRIPTION_STATUSES.has("free"), "free is NOT paid");
});

test("normalizeTierMetadata lower-cases and passes through nullish", () => {
  eq(normalizeTierMetadata("Master"), "master", "Master");
  eq(normalizeTierMetadata("eppp"), "eppp", "eppp");
  eq(normalizeTierMetadata(undefined), undefined, "undefined");
  eq(normalizeTierMetadata(null), undefined, "null");
});

// ---------------------------------------------------------------------
// 5. "No second model" guard — the live billing files must reference the
//    canonical module rather than re-declaring the mappings inline. This
//    is the structural alarm: if someone re-introduces a private copy of
//    the allowlist / status mapping, this fails loudly.
// ---------------------------------------------------------------------

function readSrc(rel: string): string {
  return readFileSync(path.join(srcDir, rel), "utf8");
}

test("billing files import from lib/tierMapping (single source of truth)", () => {
  const files: Array<[string, RegExp]> = [
    ["lib/entitlements.ts", /from "\.\/tierMapping"/],
    ["webhookHandlers.ts", /from "\.\/lib\/tierMapping"/],
    ["routes/subscription.ts", /from "\.\.\/lib\/tierMapping"/],
    ["routes/eppp-purchase.ts", /from "\.\.\/lib\/tierMapping"/],
    ["routes/custom-decks.ts", /from "\.\.\/lib\/tierMapping"/],
  ];
  for (const [rel, re] of files) {
    const src = readSrc(rel);
    assert(re.test(src), `${rel} must import from lib/tierMapping (canonical model)`);
  }
});

test("billing files do NOT re-declare the tier allowlist / status mapping inline", () => {
  // These literal sets are the canonical model. Outside tierMapping.ts no
  // billing file should re-declare them — duplication is exactly how a second
  // competing model creeps back in.
  const forbidden: Array<[string, RegExp, string]> = [
    [
      "webhookHandlers.ts",
      /new Set\(\s*\[\s*"pro",\s*"master",\s*"scholar"/,
      "inline APPROVED_TIERS allowlist",
    ],
    [
      "routes/subscription.ts",
      /new Set\(\s*\[\s*"active",\s*"pro",\s*"scholar",\s*"trialing"/,
      "inline ACTIVE_STATUSES set",
    ],
    [
      "routes/custom-decks.ts",
      /new Set\(\s*\[\s*"scholar",\s*"active",\s*"pro",\s*"trialing"/,
      "inline PAID_SUBSCRIPTION_STATUSES set",
    ],
  ];
  for (const [rel, re, what] of forbidden) {
    const src = readSrc(rel);
    assert(!re.test(src), `${rel} re-declares the ${what} inline — use lib/tierMapping instead`);
  }
});

// ---------------------------------------------------------------------
async function main(): Promise<void> {
  let failures = 0;
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
  // entitlements.ts transitively opens a pg pool at import time; close it so
  // the test process can exit cleanly.
  try {
    const { pool } = await import("@workspace/db");
    await pool.end();
  } catch {
    // ignore — pool may never have opened.
  }
  if (failures > 0) {
    console.error(`\n❌ ${failures} of ${tests.length} test(s) failed`);
    process.exit(1);
  }
  console.log(`\n✅ All ${tests.length} billing-model test(s) passed`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err instanceof Error ? (err.stack ?? err.message) : err);
  process.exit(1);
});
