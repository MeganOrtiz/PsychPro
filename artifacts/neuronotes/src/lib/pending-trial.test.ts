import assert from "node:assert/strict";
import { test } from "node:test";
import { trialEntryHref } from "./pending-trial.ts";

test("both signed-in trial buttons enter the requested suite's onboarding", () => {
  for (const suite of ["psychpro", "eppp"] as const) {
    assert.equal(trialEntryHref(suite, true, "https://example.com", "/"), `/onboarding?suite=${suite}`);
  }
});

test("signup carries either suite to the auth resolver without depending on storage", () => {
  for (const base of ["/", "/psychpro/"]) {
    for (const suite of ["psychpro", "eppp"] as const) {
      const href = trialEntryHref(suite, false, "https://example.com", base);
      const signup = new URL(href, "https://example.com");
      assert.equal(signup.pathname, "/sign-up");
      const destination = new URL(signup.searchParams.get("redirect_url")!);
      assert.equal(destination.origin, "https://example.com");
      assert.equal(destination.pathname, `${base.replace(/\/$/, "")}/welcome`);
      assert.equal(destination.searchParams.get("suite"), suite);
      assert.ok(!href.includes("subscription"));
      assert.ok(!href.includes("promo"));
    }
  }
});
