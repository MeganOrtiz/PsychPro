import assert from "node:assert/strict";
import { test } from "node:test";
import { buildPromoAuthHref, getPromoReturn } from "./eppp-promo-return.ts";

const search = (destination: string) => `returnTo=${encodeURIComponent(destination)}`;

test("auth links carry the promo through welcome under either artifact base path", () => {
  for (const base of ["/", "/psychpro/"]) {
    for (const mode of ["sign-up", "sign-in"] as const) {
      const href = buildPromoAuthHref(mode, " EPPP7 ", "https://example.com", base);
      const auth = new URL(href, "https://example.com");
      assert.equal(auth.pathname, `${base.replace(/\/$/, "")}/${mode}`);
      const welcome = new URL(auth.searchParams.get("redirect_url")!);
      assert.equal(welcome.origin, "https://example.com");
      assert.equal(welcome.pathname, `${base.replace(/\/$/, "")}/welcome`);
      assert.equal(getPromoReturn(welcome.search), "/eppp/promo?code=EPPP7");
    }
  }
});

test("preserves the EPPP campaign through auth and onboarding", () => {
  assert.equal(getPromoReturn(search("/eppp/promo?code=EPPP7")), "/eppp/promo?code=EPPP7");
  assert.equal(getPromoReturn(search("/eppp/promo")), "/eppp/promo");
  assert.equal(getPromoReturn(search("/eppp/promo?code= eppp7 ")), "/eppp/promo?code=eppp7");
});

test("normal auth has no promo redirect", () => {
  assert.equal(getPromoReturn(""), null);
  assert.equal(getPromoReturn("unrelated=true"), null);
});

test("rejects external URLs, unrelated paths, path tricks and malformed codes", () => {
  for (const destination of [
    "https://example.com/eppp/promo",
    "//example.com/eppp/promo",
    "/dashboard",
    "/eppp/promo/../subscription",
    "/eppp/promotional",
    "/eppp/promo?code=",
    `/eppp/promo?code=${"x".repeat(65)}`,
  ]) assert.equal(getPromoReturn(search(destination)), null, destination);
});