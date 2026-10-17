const ALLOWED_LEARNER_ROLES = new Set([
  "Undergraduate student",
  "Graduate student",
  "Postdoc",
  "Licensed clinician / professional",
  "Researcher / lecturer",
  "Lifelong learner",
]);
const ALLOWED_LEARNING_GOALS = new Set([
  "Prepare for the EPPP",
  "Optimize studying",
  "Deepen clinical knowledge and application",
  "Prepare for course exams",
  "Sharpen DSM-5 & diagnostic criteria",
  "Prep for clinical rotations / practicum",
]);
const ALLOWED_STUDY_FOCUS = new Set([
  "Rote memorization",
  "Flashcards",
  "Study guides",
  "Short quizzes",
  "Long-form practice exams",
  "Spaced intervals",
]);
const ALLOWED_EPPP_INTEREST = new Set([
  "Yes — I'm actively preparing",
  "Soon — within the next year",
  "Just exploring for now",
  "Not pursuing the EPPP",
]);
// Suite choice is onboarding intent, not a billing status or access grant.
// Retain legacy saved selections while accepting both current suite names.
const ALLOWED_TIERS = new Set(["psychpro", "eppp", "free", "pro", "scholar"]);

/** Validate progressive and final onboarding saves with the same allowlists. */
export function validateOnboardingEnums(body: Record<string, unknown>): string | null {
  const single: [string, unknown, Set<string>][] = [
    ["learnerRole", body.learnerRole, ALLOWED_LEARNER_ROLES],
    ["studyFocus", body.studyFocus, ALLOWED_STUDY_FOCUS],
    ["epppInterest", body.epppInterest, ALLOWED_EPPP_INTEREST],
    ["selectedTier", body.selectedTier, ALLOWED_TIERS],
  ];
  for (const [name, value, allowed] of single) {
    if (value === undefined || value === null) continue;
    if (typeof value !== "string") return `Invalid ${name}`;
    const trimmed = value.trim();
    if (trimmed && !allowed.has(trimmed)) return `Invalid ${name}`;
  }
  if (body.learningGoals !== undefined && body.learningGoals !== null) {
    if (!Array.isArray(body.learningGoals)) return "Invalid learningGoals";
    for (const g of body.learningGoals) {
      if (typeof g !== "string") return "Invalid learningGoals";
      const trimmed = g.trim();
      if (trimmed && !ALLOWED_LEARNING_GOALS.has(trimmed)) return "Invalid learningGoals";
    }
  }
  return null;
}
