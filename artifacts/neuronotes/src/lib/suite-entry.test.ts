import assert from "node:assert/strict";
import { test } from "node:test";
import { studySuiteForPath, suiteEntryDecision, suiteOnboardingPath, generalSuiteDestination } from "./suite-entry.ts";

test("EPPP dashboard, default shell, aliases and study deep links all require EPPP", () => {
  for (const path of ["/eppp", "/eppp/dashboard", "/eppp/suite", "/eppp/suite/performance-analytics", "/eppp/suite/part-1", "/eppp/topics/123/exam", "/eppp/skills"]) {
    assert.equal(studySuiteForPath(path), "eppp", path);
  }
});
test("PsychPro dashboard and study pages require PsychPro independently", () => {
  for (const path of ["/dashboard", "/topics", "/topics/123/quiz", "/courses/example/mastery-exam", "/brain-lab", "/study-lab"]) {
    assert.equal(studySuiteForPath(path), "psychpro", path);
  }
});
test("account books, notes, feedback and history stay available after expiry", () => {
  for (const path of ["/profile", "/subscription", "/onboarding", "/progress", "/my-library", "/reflections", "/eppp/suite/my-library", "/eppp/suite/my-notes", "/eppp/suite/reflections", "/eppp/suite/feedback"]) {
    assert.equal(studySuiteForPath(path), null, path);
  }
});
for (const suite of ["psychpro", "eppp"] as const) {
  test(`${suite}: unknown access fails closed; unused trial requires onboarding; expiry cannot restart`, () => {
    assert.equal(suiteEntryDecision(undefined), "loading");
    assert.equal(suiteEntryDecision({ hasAccess: false, canStart: true }), "onboarding");
    assert.equal(suiteOnboardingPath(suite), `/onboarding?suite=${suite}`);
    assert.equal(suiteEntryDecision({ hasAccess: false, canStart: false }), "expired");
    assert.equal(suiteEntryDecision({ hasAccess: true, canStart: false }), "open");
  });
}
test("general sign-in chooses correctly for neither, either, both, and admin access", () => {
  const no = { hasAccess: false, canStart: true };
  const yes = { hasAccess: true, canStart: false };
  assert.equal(generalSuiteDestination({ psychpro: no, eppp: no }), null);
  assert.equal(generalSuiteDestination({ psychpro: yes, eppp: no }), "/dashboard");
  assert.equal(generalSuiteDestination({ psychpro: no, eppp: yes }), "/eppp/suite");
  assert.equal(generalSuiteDestination({ psychpro: yes, eppp: yes }), null);
  assert.equal(generalSuiteDestination({ psychpro: yes, eppp: yes }, true), "/dashboard");
});
