export function isEpppRoute(pathname: string): boolean {
  return pathname === "/eppp" || pathname.startsWith("/eppp/");
}

export function epppTopicPath(topicId: number | string): string {
  return `/eppp/topics/${topicId}`;
}

export function epppTopicModePath(
  topicId: number | string,
  mode: "flashcards" | "quiz" | "study-guide" | "exam",
): string {
  return `${epppTopicPath(topicId)}/${mode}`;
}

export function epppDomainSlug(category: string): string {
  return category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function epppDomainAnchor(category: string): string {
  return `/eppp/suite/domains#${epppDomainSlug(category)}`;
}

export function epppSkillsPath(): string {
  return "/eppp/skills";
}

export function epppClinicalCasesPath(): string {
  return "/eppp/clinical-cases";
}

export function epppRapidReviewPath(): string {
  return "/eppp/rapid-review";
}

export function epppMasteryExamPath(category: string): string {
  return `/eppp/courses/${encodeURIComponent(category)}/mastery-exam`;
}
