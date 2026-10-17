import assert from "node:assert/strict";
import { validateOnboardingEnums } from "../src/lib/onboardingValidation";

for (const suite of ["psychpro", "eppp"]) {
  for (const complete of [false, true]) {
    assert.equal(validateOnboardingEnums({
      learnerRole: "Graduate student",
      learningGoals: ["Prepare for course exams", "Prepare for the EPPP"],
      studyFocus: "Rote memorization",
      epppInterest: "Not pursuing the EPPP",
      selectedTier: suite,
      selectedProduct: suite === "psychpro" ? "PsychPro" : "EPPP Mastery Suite",
      ...(complete ? { onboardingComplete: true } : {}),
    }), null, `${suite} ${complete ? "final" : "progressive"} save must be accepted`);
  }
}
for (const legacy of ["free", "pro", "scholar"]) {
  assert.equal(validateOnboardingEnums({ selectedTier: legacy }), null);
}
assert.equal(validateOnboardingEnums({}), null);
assert.equal(validateOnboardingEnums({ selectedTier: "admin" }), "Invalid selectedTier");
assert.equal(validateOnboardingEnums({ selectedTier: 1 }), "Invalid selectedTier");
assert.equal(validateOnboardingEnums({ learnerRole: "unknown" }), "Invalid learnerRole");
assert.equal(validateOnboardingEnums({ learningGoals: ["unknown"] }), "Invalid learningGoals");
assert.equal(validateOnboardingEnums({ learningGoals: "Prepare for the EPPP" }), "Invalid learningGoals");
assert.equal(validateOnboardingEnums({ studyFocus: "unknown" }), "Invalid studyFocus");
assert.equal(validateOnboardingEnums({ epppInterest: "unknown" }), "Invalid epppInterest");
console.log("✓ Both suite onboarding payloads accepted; legacy values preserved; invalid answers rejected");
