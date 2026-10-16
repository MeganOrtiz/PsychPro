import type { PaidPlanOption } from "@/components/billing/paid-plans-view";
import type { EpppPlans } from "./use-eppp-purchase";

export type PsychproCatalogPlan = {
  priceId: string;
  unitAmount: number;
  currency: string;
  interval: string;
};

const money = (amount: number, currency: string) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: currency.toUpperCase() }).format(amount / 100);

function savings(total: number, monthly: number | undefined, months: number) {
  if (!monthly || monthly * months <= total) return null;
  return `Save ${Math.round((1 - total / (monthly * months)) * 100)}% vs. monthly`;
}

/** Use catalog amounts/IDs only. Never sell the sample's nonexistent 3-month pack. */
export function psychproPlanOptions(catalog: PsychproCatalogPlan[]): PaidPlanOption[] {
  const monthly = catalog.find(p => p.interval === "month" && p.currency === "usd" && p.unitAmount === 1999);
  const yearly = catalog.find(p => p.interval === "year" && p.currency === "usd" && p.unitAmount === 15999);
  return [monthly, yearly].flatMap(plan => {
    if (!plan) return [];
    const annual = plan.interval === "year";
    const saving = annual ? savings(plan.unitAmount, monthly?.unitAmount, 12) : null;
    return [{
      priceId: plan.priceId,
      title: annual ? "Yearly" : "Monthly",
      amount: money(plan.unitAmount, plan.currency),
      period: annual ? "/ year" : "/ month",
      billingNote: annual ? "Billed annually. Renews yearly." : "Billed monthly. Renews monthly.",
      features: ["Full access to PsychPro Suite", ...(saving ? [saving] : ["Flexible month-to-month study"]), "Cancel renewal anytime"],
      featured: annual,
      badge: annual ? "Best value" : undefined,
    }];
  });
}

export function epppPlanOptions(catalog: EpppPlans | undefined): PaidPlanOption[] {
  if (!catalog) return [];
  const monthly = catalog.monthly?.unitAmount === 9900 && catalog.monthly.currency === "usd" ? catalog.monthly : null;
  const packs = catalog.oneTime.filter(p =>
    p.currency === "usd" && ((p.months === 6 && p.unitAmount === 49900) || (p.months === 12 && p.unitAmount === 79900)),
  ).sort((a, b) => a.months - b.months);
  const options: PaidPlanOption[] = monthly ? [{
    priceId: monthly.priceId,
    title: "Monthly",
    amount: money(monthly.unitAmount, monthly.currency),
    period: "/ month",
    billingNote: "Billed monthly. Renews monthly.",
    features: ["Full access to EPPP Mastery Suite", "Cancel renewal anytime", "Flexible month-to-month prep"],
  }] : [];
  for (const pack of packs) {
    const saving = savings(pack.unitAmount, monthly?.unitAmount, pack.months);
    options.push({
      priceId: pack.priceId,
      title: `${pack.months} months`,
      amount: money(pack.unitAmount, pack.currency),
      period: `for ${pack.months} months`,
      billingNote: "One-time payment. Does not renew.",
      features: ["Full access to EPPP Mastery Suite", ...(saving ? [saving] : []), `${pack.months} months of access`, "No automatic renewal"],
      featured: pack.months === 12,
      badge: pack.months === 12 ? "Best value" : undefined,
    });
  }
  return options;
}
