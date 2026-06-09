export type EpppTopicLike = {
  id: number;
  name: string;
  description?: string;
  category?: string;
};

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

const MAIN_SITE_ONLY_CATEGORIES = [
  "research methods",
  "research & statistics",
];

function normalized(value: string | undefined): string {
  return (value ?? "").toLowerCase().replace(/\s+/g, " ").trim();
}

export function isEpppTopic(topic: EpppTopicLike): boolean {
  const category = normalized(topic.category);
  const name = normalized(topic.name);

  if (MAIN_SITE_ONLY_CATEGORIES.includes(category)) {
    return false;
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
  for (const topic of topics.filter(isEpppTopic)) {
    const category = topic.category || "EPPP";
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
