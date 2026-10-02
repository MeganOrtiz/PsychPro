import { db, usersTable } from "@workspace/db";
import { and, eq, isNull } from "drizzle-orm";

export const EPPP_PROMO_CODE = "EPPP7";
export const EPPP_PROMO_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

export interface PromoState {
  code: typeof EPPP_PROMO_CODE;
  redeemedAt: Date | null;
  expiresAt: Date | null;
  canRedeem: boolean;
  epppAccessUntil: Date | null;
}

export type RedeemEpppPromoResult =
  | { kind: "invalid" }
  | { kind: "already-redeemed"; state: PromoState }
  | { kind: "redeemed"; state: PromoState };

export function normalizeEpppPromoCode(code: unknown): string {
  return typeof code === "string" ? code.trim().toUpperCase() : "";
}

export function epppPromoExpiresAt(redeemedAt: Date | null): Date | null {
  return redeemedAt
    ? new Date(redeemedAt.getTime() + EPPP_PROMO_DURATION_MS)
    : null;
}

export function effectiveEpppAccessUntil(
  paidAccessUntil: Date | null,
  promoRedeemedAt: Date | null,
): Date | null {
  const promoExpiresAt = epppPromoExpiresAt(promoRedeemedAt);
  if (!paidAccessUntil) return promoExpiresAt;
  if (!promoExpiresAt) return paidAccessUntil;
  return paidAccessUntil.getTime() >= promoExpiresAt.getTime()
    ? paidAccessUntil
    : promoExpiresAt;
}

async function ensurePromoUser(userId: string): Promise<void> {
  await db
    .insert(usersTable)
    .values({
      id: userId,
      subscriptionStatus: "free",
      isAdmin: false,
      onboardingComplete: false,
      usageCount: 0,
    })
    .onConflictDoNothing({ target: usersTable.id });
}

function toPromoState(user: {
  epppAccessUntil: Date | null;
  epppPromoRedeemedAt: Date | null;
}): PromoState {
  const redeemedAt = user.epppPromoRedeemedAt;
  const expiresAt = epppPromoExpiresAt(redeemedAt);
  return {
    code: EPPP_PROMO_CODE,
    redeemedAt,
    expiresAt,
    canRedeem: redeemedAt === null,
    epppAccessUntil: effectiveEpppAccessUntil(user.epppAccessUntil, redeemedAt),
  };
}

export async function getEpppPromoState(
  userId: string,
): Promise<PromoState> {
  await ensurePromoUser(userId);
  const [user] = await db
    .select({
      epppAccessUntil: usersTable.epppAccessUntil,
      epppPromoRedeemedAt: usersTable.epppPromoRedeemedAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!user) throw new Error("Unable to provision user for EPPP promotion");
  return toPromoState(user);
}

export async function redeemEpppPromo(
  userId: string,
  submittedCode: unknown,
  now = new Date(),
): Promise<RedeemEpppPromoResult> {
  if (normalizeEpppPromoCode(submittedCode) !== EPPP_PROMO_CODE) {
    return { kind: "invalid" };
  }

  await ensurePromoUser(userId);

  // A single compare-and-set update arbitrates concurrent requests. Only the
  // promotion timestamp changes; paid EPPP access and PsychPro fields are
  // deliberately untouched.
  const [updated] = await db
    .update(usersTable)
    .set({ epppPromoRedeemedAt: now })
    .where(
      and(
        eq(usersTable.id, userId),
        isNull(usersTable.epppPromoRedeemedAt),
      ),
    )
    .returning({
      epppAccessUntil: usersTable.epppAccessUntil,
      epppPromoRedeemedAt: usersTable.epppPromoRedeemedAt,
    });

  if (updated) return { kind: "redeemed", state: toPromoState(updated) };

  const [existing] = await db
    .select({
      epppAccessUntil: usersTable.epppAccessUntil,
      epppPromoRedeemedAt: usersTable.epppPromoRedeemedAt,
    })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!existing) throw new Error("Unable to read user after EPPP promotion redemption");
  return { kind: "already-redeemed", state: toPromoState(existing) };
}