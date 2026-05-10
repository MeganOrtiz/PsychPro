// Local-only storage for quiz reflections. Each entry is keyed by
// `quiz-reflection:<topicId>:<questionId>` in window.localStorage.
//
// We persist a JSON object (not just the raw text) so the Reflections
// page in My Tools can render question + correct answer alongside the
// learner's note. A tiny backward-compat path handles older entries
// that were saved as plain strings.

export interface ReflectionRecord {
  text: string;
  topicId: number;
  questionId: number;
  questionText: string;
  correctAnswer: string;
  correctText: string;
  selectedAnswer: string;
  selectedText: string;
  savedAt: string;
}

const PREFIX = "quiz-reflection:";

export function reflectionKey(topicId: number, questionId: number): string {
  return `${PREFIX}${topicId}:${questionId}`;
}

function safeParse(raw: string | null): Partial<ReflectionRecord> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && typeof parsed.text === "string") {
      return parsed as Partial<ReflectionRecord>;
    }
  } catch {
    // Legacy plain-string entry — wrap it.
    return { text: raw };
  }
  return null;
}

export function loadReflectionText(topicId: number, questionId: number): string {
  if (typeof window === "undefined") return "";
  const parsed = safeParse(window.localStorage.getItem(reflectionKey(topicId, questionId)));
  return parsed?.text ?? "";
}

export function saveReflection(record: ReflectionRecord): void {
  if (typeof window === "undefined") return;
  const key = reflectionKey(record.topicId, record.questionId);
  if (record.text.trim().length === 0) {
    window.localStorage.removeItem(key);
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(record));
}

export function deleteReflection(topicId: number, questionId: number): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(reflectionKey(topicId, questionId));
}

// Walk localStorage and return every saved reflection, newest first.
// Legacy plain-string entries are surfaced with placeholder metadata so
// they still appear in the list (the user can re-save from the quiz to
// upgrade them).
export function listAllReflections(): ReflectionRecord[] {
  if (typeof window === "undefined") return [];
  const out: ReflectionRecord[] = [];
  for (let i = 0; i < window.localStorage.length; i += 1) {
    const key = window.localStorage.key(i);
    if (!key || !key.startsWith(PREFIX)) continue;
    const rest = key.slice(PREFIX.length); // "<topicId>:<questionId>"
    const [topicIdStr, questionIdStr] = rest.split(":");
    const topicId = Number(topicIdStr);
    const questionId = Number(questionIdStr);
    if (!Number.isFinite(topicId) || !Number.isFinite(questionId)) continue;

    const parsed = safeParse(window.localStorage.getItem(key));
    if (!parsed || !parsed.text || parsed.text.trim().length === 0) continue;

    out.push({
      text: parsed.text,
      topicId,
      questionId,
      questionText: parsed.questionText ?? "",
      correctAnswer: parsed.correctAnswer ?? "",
      correctText: parsed.correctText ?? "",
      selectedAnswer: parsed.selectedAnswer ?? "",
      selectedText: parsed.selectedText ?? "",
      savedAt: parsed.savedAt ?? "",
    });
  }
  // Newest first when timestamps exist; legacy entries (no savedAt) sink.
  out.sort((a, b) => (b.savedAt || "").localeCompare(a.savedAt || ""));
  return out;
}
