import assert from "node:assert/strict";
import { test } from "node:test";
import { checkoutResumeState, checkoutChoice, checkoutAuthHref } from "./pending-checkout.ts";

const catalogs = () => ({
  psychpro: { isLoading: false, isError: false, paid: false, priceIds: ["price_psychMonthly", "price_psychAnnual"] },
  eppp: { isLoading: false, isError: false, paid: false, priceIds: ["price_epppMonthly", "price_epppSix", "price_epppTwelve"] },
});

for (const suite of ["psychpro", "eppp"] as const) {
  for (const priceId of catalogs()[suite].priceIds) {
    test(`${suite} ${priceId}: survives signup and ignores unrelated catalog delays/errors`, () => {
      const choice = { suite, priceId };
      const auth = new URL(checkoutAuthHref(choice, "https://example.com", "/"), "https://example.com");
      assert.deepEqual(checkoutChoice(new URL(auth.searchParams.get("redirect_url")!).search), choice);
      const state = catalogs();
      const other = suite === "psychpro" ? "eppp" : "psychpro";
      state[other] = { isLoading: true, isError: true, paid: true, priceIds: [] };
      assert.equal(checkoutResumeState(choice, state), "ready");
      state[suite].isLoading = true;
      assert.equal(checkoutResumeState(choice, state), "loading");
      state[suite].isLoading = false;
      state[suite].isError = true;
      assert.equal(checkoutResumeState(choice, state), "error");
      state[suite].isError = false;
      state[suite].paid = true;
      assert.equal(checkoutResumeState(choice, state), "paid");
      state[suite].paid = false;
      assert.equal(checkoutResumeState({ suite, priceId: "price_removed" }, state), "unavailable");
      assert.equal(checkoutResumeState({ suite: other, priceId }, catalogs()), "unavailable");
    });
  }
}
