import assert from "node:assert/strict";
import { test } from "node:test";
import { completeSuiteOnboarding } from "./complete-suite-onboarding.ts";

const available = () => ({
  psychpro: { hasAccess: false, canStart: true },
  eppp: { hasAccess: false, canStart: true },
});

test("general setup finishes without choosing, loading, or activating either suite", async () => {
  const calls: string[] = [];
  const result = await completeSuiteOnboarding(null, {
    saveProfile: async () => { calls.push("save"); return true; },
    loadAccess: async () => { assert.fail("General setup must not depend on trial eligibility"); },
    startTrial: async () => { assert.fail("General setup must not start any trial"); },
  });
  assert.deepEqual(calls, ["save"]);
  assert.deepEqual(result, { started: false, hadAccess: false, destination: "/welcome" });
});

for (const suite of ["psychpro", "eppp"] as const) {
  const dashboard = suite === "psychpro" ? "/dashboard" : "/eppp/suite";
  test(`${suite}: save onboarding, start only the chosen trial, then open its dashboard`, async () => {
    const calls: string[] = [];
    const access = available();
    const result = await completeSuiteOnboarding(suite, {
      saveProfile: async () => { calls.push("save"); return true; },
      loadAccess: async () => { calls.push("load"); return access; },
      startTrial: async (target) => {
        calls.push(`start:${target}`);
        access[target] = { hasAccess: true, canStart: false };
        return access;
      },
    });
    assert.deepEqual(calls, ["save", "load", `start:${suite}`]);
    assert.equal(result?.destination, dashboard);
    assert.equal(result?.started, true);
    assert.deepEqual(access[suite === "psychpro" ? "eppp" : "psychpro"], { hasAccess: false, canStart: true });
  });

  test(`${suite}: existing access opens dashboard without starting/resetting a trial`, async () => {
    const access = available();
    access[suite] = { hasAccess: true, canStart: false };
    const result = await completeSuiteOnboarding(suite, {
      saveProfile: async () => true,
      loadAccess: async () => access,
      startTrial: async () => { assert.fail("Must not reset existing access"); },
    });
    assert.deepEqual(result, { started: false, hadAccess: true, destination: dashboard });
  });

  test(`${suite}: expired/ineligible trial goes to paid plans, not a restart`, async () => {
    const access = available();
    access[suite] = { hasAccess: false, canStart: false };
    const result = await completeSuiteOnboarding(suite, {
      saveProfile: async () => true,
      loadAccess: async () => access,
      startTrial: async () => { assert.fail("Must not restart an expired trial"); },
    });
    assert.equal(result?.destination, "/subscription");
    assert.equal(result?.started, false);
  });

  test(`${suite}: duplicate activation re-reads access without another start attempt`, async () => {
    const access = available();
    let loads = 0;
    let starts = 0;
    const result = await completeSuiteOnboarding(suite, {
      saveProfile: async () => true,
      loadAccess: async () => {
        loads++;
        if (loads === 2) access[suite] = { hasAccess: true, canStart: false };
        return access;
      },
      startTrial: async () => { starts++; throw { status: 409 }; },
    });
    assert.equal(loads, 2);
    assert.equal(starts, 1);
    assert.equal(result?.destination, dashboard);
    assert.equal(result?.started, false);
  });
}

test("failed profile save never starts a trial or navigates", async () => {
  assert.equal(await completeSuiteOnboarding("psychpro", {
    saveProfile: async () => false,
    loadAccess: async () => { assert.fail("Must save profile first"); },
    startTrial: async () => { assert.fail("Must save profile first"); },
  }), null);
});

test("activation failure is reported, not converted to dashboard access", async () => {
  await assert.rejects(completeSuiteOnboarding("eppp", {
    saveProfile: async () => true,
    loadAccess: async () => available(),
    startTrial: async () => { throw new Error("Network unavailable"); },
  }), /Network unavailable/);
});

test("access lookup failure never starts a trial or assumes eligibility", async () => {
  await assert.rejects(completeSuiteOnboarding("eppp", {
    saveProfile: async () => true,
    loadAccess: async () => { throw new Error("Access unavailable"); },
    startTrial: async () => { assert.fail("Unknown eligibility must not grant access"); },
  }), /Access unavailable/);
});

test("a conflict with no remaining access goes to plans", async () => {
  const access = available();
  const result = await completeSuiteOnboarding("psychpro", {
    saveProfile: async () => true,
    loadAccess: async () => access,
    startTrial: async () => {
      access.psychpro = { hasAccess: false, canStart: false };
      throw { status: 409 };
    },
  });
  assert.equal(result?.destination, "/subscription");
});
