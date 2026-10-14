import { tierFromStatus, type Tier } from "./tierMapping";

export const TRIAL_MS = 7 * 24 * 60 * 60 * 1000;
export const TRIAL_AI_LIMIT = 5;
export const MONTHLY_AI_LIMIT = 50;

export type AccessUser = {
  subscriptionStatus: string;
  isAdmin: boolean | null;
  psychproTrialStartedAt: Date | null;
  psychproPlanVersion: number;
  psychproBillingPeriodStartedAt: Date | null;
  epppPromoRedeemedAt: Date | null;
  epppAccessUntil: Date | null;
};

export function trialEnds(start: Date | null): Date | null {
  return start ? new Date(start.getTime() + TRIAL_MS) : null;
}

export function effectivePsychproTier(user: Pick<AccessUser, "subscriptionStatus" | "psychproTrialStartedAt">, now = new Date()): Tier {
  const paid = tierFromStatus(user.subscriptionStatus);
  if (paid !== "free") return paid;
  return (trialEnds(user.psychproTrialStartedAt)?.getTime() ?? 0) > now.getTime() ? "scholar" : "free";
}

function suite(start: Date | null, paid: boolean, admin: boolean, legacy: boolean, now: Date) {
  const expires = trialEnds(start);
  const active = !!expires && expires > now;
  return {
    startedAt: start?.toISOString() ?? null,
    expiresAt: expires?.toISOString() ?? null,
    canStart: !start && !paid && !admin,
    active,
    hasAccess: paid || active || admin,
    paid,
    legacy,
  };
}

export function suiteAccess(user: AccessUser, now = new Date()) {
  const paid = tierFromStatus(user.subscriptionStatus) !== "free";
  const epppPaid = !!user.epppAccessUntil && user.epppAccessUntil > now;
  return {
    psychpro: suite(user.psychproTrialStartedAt, paid, !!user.isAdmin, paid && user.psychproPlanVersion < 2, now),
    eppp: suite(user.epppPromoRedeemedAt, epppPaid, !!user.isAdmin, false, now),
  };
}

// Advance from the actual billing anniversary, clamping short months without
// drifting January 31 -> February 28 -> March 28. Annual plans reset monthly too.
export function monthlyWindow(anchor: Date, now: Date) {
  const atMonth = (offset: number) => {
    const date = new Date(anchor);
    date.setUTCDate(1);
    date.setUTCMonth(anchor.getUTCMonth() + offset);
    const last = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 0)).getUTCDate();
    date.setUTCDate(Math.min(anchor.getUTCDate(), last));
    return date;
  };
  let offset = Math.max(0, (now.getUTCFullYear() - anchor.getUTCFullYear()) * 12 + now.getUTCMonth() - anchor.getUTCMonth());
  if (atMonth(offset) > now && offset > 0) offset--;
  return { start: atMonth(offset), end: atMonth(offset + 1) };
}

export function aiWindow(user: AccessUser, now = new Date()) {
  const access = suiteAccess(user, now).psychpro;
  if (user.isAdmin || access.legacy) return { limit: null, key: "unlimited", end: null };
  if (access.paid) {
    // New-plan checkout/webhooks always persist the Stripe billing anchor.
    if (!user.psychproBillingPeriodStartedAt) throw new Error("PsychPro billing anchor unavailable; refresh billing status.");
    const window = monthlyWindow(user.psychproBillingPeriodStartedAt, now);
    return { limit: MONTHLY_AI_LIMIT, key: `paid:${window.start.toISOString()}`, end: window.end };
  }
  if (access.active && user.psychproTrialStartedAt) {
    return { limit: TRIAL_AI_LIMIT, key: `trial:${user.psychproTrialStartedAt.toISOString()}`, end: trialEnds(user.psychproTrialStartedAt) };
  }
  return { limit: 0, key: "inactive", end: null };
}
