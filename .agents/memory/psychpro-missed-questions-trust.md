---
name: PsychPro missed-questions trust boundary
description: Why client-submitted missedQuestionIds must be ownership-validated before persistence
---

# Missed-questions content-leak vector

The EPPP "Missed Questions" feature stores `missedQuestionIds` on quiz/exam
attempts, and `GET /eppp/missed-questions` later resolves those IDs to FULL
question text + options + correct answer + explanation.

**Rule:** any client-submitted question ID that will later be resolved back to
full question content MUST be ownership-validated server-side at write time —
keep only IDs that belong to the question set the attempt could legitimately
have served:
- quiz attempt → `quiz_questions` rows for the attempt's `topicId`
- exam attempt → questions linked via `practice_exam_questions` to the topic's
  practice/full-length exam

**Why:** integer-only validation is not enough. A free/locked user could POST
arbitrary IDs (from paid or unrelated topics) and then read the protected
content back out through the missed-questions endpoint — a broken-access-control
content leak. Caught in code review.

**How to apply:** validate in `recordAttempt` (artifacts/api-server progress.ts)
before insert; drop non-matching IDs (store `undefined` if none survive). Note
full-length exams pull questions from many home topics, so do NOT validate exam
misses by `quizQuestions.topicId == attempt.topicId` — validate via the exam's
linked question set instead.
