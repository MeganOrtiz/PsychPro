import assert from "node:assert/strict";
import { test } from "node:test";
import { psychproPlanOptions, epppPlanOptions } from "./paid-plan-options.ts";
import { checkoutChoice, checkoutReturnPath, checkoutAuthHref } from "./pending-checkout.ts";

const psychpro = [
  { priceId: "price_PPmonthly", unitAmount: 1999, currency: "usd", interval: "month" },
  { priceId: "price_PPyearly", unitAmount: 15999, currency: "usd", interval: "year" },
];
const eppp = {
  productId: "prod_eppp", name: "EPPP", description: null,
  monthly: { priceId: "price_EPPPmonthly", unitAmount: 9900, currency: "usd", interval: "month" },
  oneTime: [
    { priceId: "price_EPPP6mo", unitAmount: 49900, currency: "usd", months: 6 },
    { priceId: "price_EPPP12mo", unitAmount: 79900, currency: "usd", months: 12 },
    { priceId: "price_unapproved", unitAmount: 24900, currency: "usd", months: 3 },
  ],
};

test("exact existing prices, billing periods, and price IDs are preserved", () => {
  const pp = psychproPlanOptions(psychpro);
  const ep = epppPlanOptions(eppp);
  assert.deepEqual(pp.map(p => [p.priceId, p.amount, p.period]), [
    ["price_PPmonthly", "$19.99", "/ month"], ["price_PPyearly", "$159.99", "/ year"],
  ]);
  assert.deepEqual(ep.map(p => [p.priceId, p.amount, p.period]), [
    ["price_EPPPmonthly", "$99.00", "/ month"],
    ["price_EPPP6mo", "$499.00", "for 6 months"],
    ["price_EPPP12mo", "$799.00", "for 12 months"],
  ]);
  assert.equal(pp.filter(p => p.featured)[0].title, "Yearly");
  assert.equal(ep.filter(p => p.featured)[0].title, "12 months");
});

test("savings are computed, not copied from sample; prepaid does not claim cancellation/renewal", () => {
  const pp = psychproPlanOptions(psychpro);
  const ep = epppPlanOptions(eppp);
  assert.ok(pp[1].features.includes("Save 33% vs. monthly"));
  assert.ok(ep[1].features.includes("Save 16% vs. monthly"));
  assert.ok(ep[2].features.includes("Save 33% vs. monthly"));
  for (const option of ep.slice(1)) {
    assert.equal(option.billingNote, "One-time payment. Does not renew.");
    assert.ok(!option.features.some(f => /cancel/i.test(f)));
  }
});

test("missing catalogs never invent a price or checkout ID", () => {
  assert.deepEqual(psychproPlanOptions([]), []);
  assert.deepEqual(epppPlanOptions(undefined), []);
  assert.deepEqual(psychproPlanOptions([{ ...psychpro[0], unitAmount: 1 }]), []);
});

test("all five plan selections survive signup at root and prefixed artifact paths", () => {
  const choices = [
    ...psychproPlanOptions(psychpro).map(p => ({ suite: "psychpro" as const, priceId: p.priceId })),
    ...epppPlanOptions(eppp).map(p => ({ suite: "eppp" as const, priceId: p.priceId })),
  ];
  for (const choice of choices) {
    assert.deepEqual(checkoutChoice(new URL(checkoutReturnPath(choice), "https://example.com").search), choice);
    for (const base of ["/", "/psychpro/"]) {
      const signup = new URL(checkoutAuthHref(choice, "https://example.com", base), "https://example.com");
      assert.equal(signup.pathname, "/sign-up");
      const target = new URL(signup.searchParams.get("redirect_url")!);
      assert.equal(target.origin, "https://example.com");
      assert.equal(target.pathname, `${base.replace(/\/$/, "")}/subscription`);
      assert.deepEqual(checkoutChoice(target.search), choice);
    }
  }
});

test("invalid suite or price cannot become a resumable checkout", () => {
  for (const search of ["", "checkout=admin&priceId=price_ok", "checkout=eppp&priceId=https://evil.test", "checkout=psychpro&priceId=", "checkout=eppp&priceId=price_bad/../../"]) {
    assert.equal(checkoutChoice(search), null);
  }
});
