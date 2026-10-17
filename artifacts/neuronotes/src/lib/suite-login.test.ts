import assert from "node:assert/strict";
import { test } from "node:test";
import { suiteLoginHref } from "./suite-login.ts";

for (const suite of ["psychpro", "eppp"] as const) {
  const destination = suite === "psychpro" ? "/dashboard" : "/eppp/suite";
  test(`${suite}: signed-in login opens its protected suite, not a trial`, () => {
    assert.equal(suiteLoginHref(suite, true, "https://example.com", "/"), destination);
  });
  test(`${suite}: selected destination survives login at root and artifact base paths`, () => {
    for (const base of ["/", "/psychpro/"]) {
      const login = new URL(suiteLoginHref(suite, false, "https://example.com", base), "https://example.com");
      assert.equal(login.pathname, "/sign-in");
      const target = new URL(login.searchParams.get("redirect_url")!);
      assert.equal(target.origin, "https://example.com");
      assert.equal(target.pathname, `${base.replace(/\/$/, "")}${destination}`);
      assert.equal(target.search, "");
      assert.ok(!target.pathname.includes("onboarding"));
    }
  });
}
