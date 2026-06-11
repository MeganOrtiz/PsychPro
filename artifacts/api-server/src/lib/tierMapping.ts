// =============================================================================
// CANONICAL BILLING / ENTITLEMENT MODEL — SINGLE SOURCE OF TRUTH
// =============================================================================
//
// Every place that maps Stripe product metadata or the stored
// `users.subscription_status` onto a PsychPro tier MUST go through this module.
// Do NOT re-implement these mappings inline anywhere else — duplicated copies
// are how a "second competing model" gets reintroduced during a refactor or
// rebase. `test/billingModel.test.ts` locks these functions in place.
//
// There are TWO independent access dimensions and they never write to each
// other:
//
//   1. GENERAL subscription (Master / Scholar)
//      - Stored on `users.subscription_status`.
//      - Canonical stored values: "free" | "active" | "scholar"
//        ("active" is what a Master/pro subscription stores).
//      - Legacy aliases still tolerated on read: "pro", "trialing" (== Master).
//      - Stripe products are tagged `metadata.neuronotes_tier`:
//          "pro" | "master"  → internal Master (stored as "active")
//          "scholar"         → Scholar (stored as "scholar")
//        "master" is purely a DISPLAY alias for the internal "pro"/"active".
//
//   2. EPPP Mastery Suite — a SEPARATE, expiry-driven access level.
//      - Driven by `users.epppAccessUntil` / `users.epppSubscriptionId`.
//      - Stripe product tagged `metadata.neuronotes_tier = "eppp"`.
//      - EPPP access NEVER writes `subscription_status`, and a Master/Scholar
//        subscription NEVER grants EPPP access. (See lib/entitlements.ts.)
// =============================================================================

export type Tier = "free" | "pro" | "scholar";

// Stripe `metadata.neuronotes_tier` values that grant a GENERAL (Master/Scholar)
// subscription. "master" is an alias for the internal "pro" tier.
export const APPROVED_SUBSCRIPTION_TIERS: ReadonlySet<string> = new Set([
  "pro",
  "master",
  "scholar",
]);

// Stripe `metadata.neuronotes_tier` value for the SEPARATE EPPP Mastery Suite.
// It must NEVER map to a Master/Scholar subscription status.
export const EPPP_TIER = "eppp";

// Stored `subscription_status` values that count as an active PAID general
// subscription. Canonical write value for Master is "active"; "pro"/"trialing"
// are tolerated legacy aliases.
export const ACTIVE_SUBSCRIPTION_STATUSES: ReadonlySet<string> = new Set([
  "active",
  "pro",
  "scholar",
  "trialing",
]);

/** Lower-cases a Stripe product's `neuronotes_tier` metadata value. */
export function normalizeTierMetadata(
  meta: string | null | undefined,
): string | undefined {
  return meta?.toLowerCase();
}

/** True when a Stripe product's metadata tags it as an approved Master/Scholar plan. */
export function isApprovedSubscriptionTier(meta: string | null | undefined): boolean {
  const t = normalizeTierMetadata(meta);
  return !!t && APPROVED_SUBSCRIPTION_TIERS.has(t);
}

/** True when a Stripe product's metadata tags it as the EPPP Mastery Suite. */
export function isEpppTierMetadata(meta: string | null | undefined): boolean {
  return normalizeTierMetadata(meta) === EPPP_TIER;
}

/**
 * Maps an approved Stripe product's `neuronotes_tier` metadata to the value we
 * STORE in `subscription_status`:
 *   "scholar"            → "scholar"
 *   "pro" | "master"     → "active"
 *   anything else (incl. "eppp", undefined, unknown) → null
 * Callers MUST treat null as "free" — this prevents arbitrary Stripe products
 * from the same account from granting paid entitlements.
 */
export function subscriptionStatusFromTierMetadata(
  meta: string | null | undefined,
): "active" | "scholar" | null {
  const t = normalizeTierMetadata(meta);
  if (!t || !APPROVED_SUBSCRIPTION_TIERS.has(t)) return null;
  if (t === "scholar") return "scholar";
  return "active";
}

/**
 * Maps a stored `subscription_status` onto the internal Tier:
 *   "scholar"                       → "scholar"
 *   "active" | "pro" | "trialing"   → "pro"
 *   anything else (incl. "free")    → "free"
 */
export function tierFromStatus(status: string | null | undefined): Tier {
  if (status === "scholar") return "scholar";
  if (status === "active" || status === "pro" || status === "trialing") return "pro";
  return "free";
}

/**
 * Maps a stored `subscription_status` onto the `{ status, tier }` shape that
 * GET /api/subscription/status returns to the client:
 *   "scholar"                       → { status: "active", tier: "scholar" }
 *   "active" | "pro" | "trialing"   → { status: "active", tier: "pro" }
 *   anything else                   → { status: "free",   tier: "free" }
 */
export function subscriptionStatusApiShape(
  status: string | null | undefined,
): { status: "active" | "free"; tier: Tier } {
  const tier = tierFromStatus(status);
  return tier === "free" ? { status: "free", tier: "free" } : { status: "active", tier };
}
