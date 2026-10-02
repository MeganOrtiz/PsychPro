export const PRACTICE_EXAM_TIME_LIMIT_SECONDS = 15 * 60;

/**
 * Topic practice exams have a fixed whole-exam budget. Full-length exams
 * share their storage/endpoint, but must retain their separate sitting budget.
 * Stored legacy topic durations must not shorten the standard practice timer.
 */
export function practiceExamTimeLimit(
  exam: { title: string; timeLimit: number | null },
  topic: { name: string | null; category: string | null } | undefined,
): number | null {
  const fullLength = [exam.title, topic?.name, topic?.category]
    .some(value => /\bfull[\s-]*length\b/i.test(value ?? ""));
  return fullLength ? exam.timeLimit : PRACTICE_EXAM_TIME_LIMIT_SECONDS;
}