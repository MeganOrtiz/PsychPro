import { db } from "@workspace/db";
import { topicsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

// =============================================================================
// Server-side EPPP content classifier.
//
// This is a COARSE mirror of the canonical taxonomy in
// artifacts/neuronotes/src/lib/eppp-content.ts (isEpppTopic). It answers the
// single question the gating layer needs — "is this topic / course EPPP
// content?" — so EPPP content can be gated behind EPPP access (epppAccessUntil)
// instead of the Master/Scholar subscription.
//
// IMPORTANT: keep the category markers + id bridge below in sync with the
// frontend isEpppTopic(). The fine-grained sub-routing (Part 1 vs Part 2,
// clinical cases, rapid review, full-length exams, quick reference) lives only
// on the frontend and is intentionally NOT replicated here — gating only needs
// the coarse "is EPPP at all" signal, which is stable.
// =============================================================================

type TopicLike = { id: number; name: string | null; category: string | null };

const EPPP_CATEGORY_MARKERS = [
  "eppp",
  "biological bases",
  "cognitive-affective",
  "cognitive affective",
  "social and cultural",
  "social & cultural",
  "growth and lifespan",
  "growth & lifespan",
  "assessment and diagnosis",
  "assessment & diagnosis",
  "treatment, intervention",
  "treatment intervention",
  "research methods and statistics",
  "research methods & statistics",
  "ethical",
  "ethics",
  "legal",
  "professional issues",
];

const EPPP_PART2_CATEGORY_MARKERS = [
  "part 2",
  "part ii",
  "eppp skills",
  "skills domain",
  "skills domains",
  "applied skills",
  "assessment intervention skills",
  "assessment and intervention skills",
  "consultation and supervision skills",
  "scientific thinking",
  "evidence use",
  "professional ethics and legal decision-making",
  "ethics and legal decision-making",
  "communication relationships diversity",
  "communication, relationships, and diversity",
  "clinical reasoning",
  "applied judgment",
];

// These main-site categories overlap textually with EPPP markers ("research
// methods…") but belong to the general catalog, so they must never classify as
// EPPP. Mirror of MAIN_SITE_ONLY_CATEGORIES in the frontend taxonomy.
const MAIN_SITE_ONLY_CATEGORIES = ["research methods", "research & statistics"];

const EPPP_NAME_FALLBACK_MARKERS = [
  "apa code",
  "confidentiality",
  "informed consent",
  "multiple relationships",
  "boundaries",
  "decision-making models",
  "specialty ethics",
  "attachment",
  "temperament",
  "middle childhood",
  "adolescence",
  "adulthood",
  "family systems",
  "intelligence",
  "learning",
  "memory",
  "motivation",
  "emotion",
  "language",
  "social cognition",
  "group dynamics",
  "cultural psychology",
  "diversity",
  "identity",
  "oppression",
];

function normalized(value: string | null | undefined): string {
  return (value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

export function isEpppTopic(topic: TopicLike): boolean {
  const category = normalized(topic.category);
  const name = normalized(topic.name);

  if (MAIN_SITE_ONLY_CATEGORIES.includes(category)) {
    return false;
  }

  if (
    EPPP_PART2_CATEGORY_MARKERS.some(
      (marker) => category.includes(marker) || name.includes(marker),
    )
  ) {
    return true;
  }

  if (EPPP_CATEGORY_MARKERS.some((marker) => category.includes(marker))) {
    return true;
  }

  // Bridge for the Claude connector-created live lessons (mirror of frontend).
  if (topic.id >= 62 && topic.id <= 81) {
    return true;
  }

  const canUseNameFallback =
    !category || category === "other" || category === "uncategorized";

  return (
    canUseNameFallback &&
    EPPP_NAME_FALLBACK_MARKERS.some((marker) => name.includes(marker))
  );
}

/** Loads a topic by id and returns whether it is EPPP content. */
export async function isEpppTopicId(topicId: number): Promise<boolean> {
  if (!Number.isFinite(topicId)) return false;
  const [t] = await db
    .select({
      id: topicsTable.id,
      name: topicsTable.name,
      category: topicsTable.category,
    })
    .from(topicsTable)
    .where(eq(topicsTable.id, topicId));
  return t ? isEpppTopic(t) : false;
}

/**
 * A course is EPPP if any of its lessons classify as EPPP content. General
 * (main-site) courses carry only main-site categories, so this never
 * false-positives them; EPPP courses carry EPPP categories on their lessons.
 */
export async function isEpppCourse(courseId: number): Promise<boolean> {
  if (!Number.isFinite(courseId)) return false;
  const lessons = await db
    .select({
      id: topicsTable.id,
      name: topicsTable.name,
      category: topicsTable.category,
    })
    .from(topicsTable)
    .where(eq(topicsTable.courseId, courseId));
  return lessons.some(isEpppTopic);
}
