import { test } from "node:test";
import assert from "node:assert/strict";
import { psychproSuiteDestination } from "./psychpro-suite-destination.ts";

test("EPPP-only users repeat onboarding before starting PsychPro", () => {
  assert.equal(psychproSuiteDestination(false, false, true), "/onboarding?suite=psychpro");
});
test("active PsychPro subscribers and trials go to the dashboard", () => {
  assert.equal(psychproSuiteDestination(true), "/dashboard");
});
test("admins keep their dashboard bypass", () => {
  assert.equal(psychproSuiteDestination(false, true), "/dashboard");
});
test("unresolved access never implies PsychPro entitlement", () => {
  assert.equal(psychproSuiteDestination(undefined), "/onboarding?suite=psychpro");
});
test("expired PsychPro trials cannot restart through the suite switch", () => {
  assert.equal(psychproSuiteDestination(false, false, false), "/subscription");
});
