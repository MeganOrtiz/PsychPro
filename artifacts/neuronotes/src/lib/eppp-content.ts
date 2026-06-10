export type EpppTopicLike = {
  id: number;
  name: string;
  description?: string;
  category?: string;
};

export type EpppExamPart = "part1" | "part2";

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

const MAIN_SITE_ONLY_CATEGORIES = [
  "research methods",
  "research & statistics",
];

// Clinical integration cases are uploaded as topics whose category embeds this
// phrase (e.g. "EPPP Part 1: Clinical Integration Cases: Biological Bases of
// Behavior"). They must surface ONLY in the dedicated Clinical Integration
// Cases tab — never in Part 1 domains, Part 2 skills, Question Bank, or
// Flashcards — even though they remain EPPP content (kept out of the main site).
const EPPP_CLINICAL_CASE_MARKER = "clinical integration cases";

export function isEpppClinicalCase(topic: EpppTopicLike): boolean {
  return normalized(topic.category).includes(EPPP_CLINICAL_CASE_MARKER);
}

export function getEpppClinicalCaseDomain(topic: EpppTopicLike): string {
  const category = topic.category ?? "";
  const idx = category.toLowerCase().lastIndexOf(`${EPPP_CLINICAL_CASE_MARKER}:`);
  if (idx >= 0) {
    const tail = category.slice(idx + EPPP_CLINICAL_CASE_MARKER.length + 1).trim();
    if (tail) return tail;
  }
  return "Clinical Integration Cases";
}

export function groupEpppClinicalCases<T extends EpppTopicLike>(topics: T[]) {
  const byDomain = new Map<string, T[]>();
  for (const topic of topics.filter(isEpppClinicalCase)) {
    const domain = getEpppClinicalCaseDomain(topic);
    const existing = byDomain.get(domain) ?? [];
    existing.push(topic);
    byDomain.set(domain, existing);
  }

  return Array.from(byDomain.entries())
    .map(([name, items]) => ({
      name,
      items: [...items].sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function normalized(value: string | undefined): string {
  return (value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

export function getEpppExamPart(topic: EpppTopicLike): EpppExamPart | null {
  const category = normalized(topic.category);
  const name = normalized(topic.name);

  if (MAIN_SITE_ONLY_CATEGORIES.includes(category)) {
    return null;
  }

  // Clinical integration cases belong only to their own tab, so they are never
  // classified as Part 1 or Part 2 content.
  if (isEpppClinicalCase(topic)) {
    return null;
  }

  if (
    EPPP_PART2_CATEGORY_MARKERS.some(
      (marker) => category.includes(marker) || name.includes(marker),
    )
  ) {
    return "part2";
  }

  if (isEpppTopic(topic)) {
    return "part1";
  }

  return null;
}

export function isEpppPart2Topic(topic: EpppTopicLike): boolean {
  return getEpppExamPart(topic) === "part2";
}

export function isEpppKnowledgeTopic(topic: EpppTopicLike): boolean {
  return getEpppExamPart(topic) === "part1";
}

export function isEpppTopic(topic: EpppTopicLike): boolean {
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

  // Temporary bridge for the Claude connector-created live lessons. Once the
  // EPPP dashboard has a dedicated content model, replace this with explicit
  // domain/course metadata.
  if (topic.id >= 62 && topic.id <= 81) {
    return true;
  }

  // A few Claude-created lessons may have short names while course wrappers
  // finish. Only name-match uncategorized rows so main-site categories do not
  // leak into the EPPP surface.
  const canUseNameFallback =
    !category || category === "other" || category === "uncategorized";

  return canUseNameFallback && [
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
  ].some((marker) => name.includes(marker));
}

export function groupEpppTopicsByCategory<T extends EpppTopicLike>(topics: T[]) {
  const byCategory = new Map<string, T[]>();
  for (const topic of topics.filter(
    (t) => isEpppTopic(t) && !isEpppClinicalCase(t),
  )) {
    const category = getEpppDisplayCategory(topic);
    const existing = byCategory.get(category) ?? [];
    existing.push(topic);
    byCategory.set(category, existing);
  }

  return Array.from(byCategory.entries())
    .map(([name, items]) => ({
      name,
      items: [...items].sort((a, b) => a.name.localeCompare(b.name)),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getEpppDisplayCategory(topic: EpppTopicLike): string {
  const category = topic.category || "EPPP";
  return category
    .replace(/^eppp\s*[-:]\s*/i, "")
    .replace(/^part\s*(?:2|ii)\s*[-:]\s*/i, "")
    .replace(/^eppp\s+skills\s*[-:]\s*/i, "")
    .trim() || "EPPP";
}
