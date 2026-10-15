import { test } from "node:test";
import assert from "node:assert/strict";
import { psychproSuiteDestination } from "./psychpro-suite-destination.ts";

test("EPPP-only promo and paid users enter the PsychPro welcome page", () => {
  assert.equal(psychproSuiteDestination(false), "/psychpro/welcome");
});
test("active PsychPro subscribers and trials go to the dashboard", () => {
  assert.equal(psychproSuiteDestination(true), "/dashboard");
});
test("admins keep their dashboard bypass", () => {
  assert.equal(psychproSuiteDestination(false, true), "/dashboard");
});
test("unresolved access never implies PsychPro entitlement", () => {
  assert.equal(psychproSuiteDestination(undefined), "/psychpro/welcome");
});
