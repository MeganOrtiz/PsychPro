---
name: PsychPro course mastery exam gate
description: How the Course Mastery Exam unlock/mastery state is computed and why exam_attempts (not progress.score) is the source of truth.
---

# Course Mastery Exam gating

NOTE — TWO PARALLEL SYSTEMS NOW COEXIST:
1. LEGACY (this doc): course = `topics.category` STRING; routes in
   `routes/course-mastery.ts` (`/courses/:category/mastery-status`,
   `/courses/:category/mastery-exam`); gating source of truth = `examAttemptsTable`.
2. NEW courseId-based: first-class `coursesTable` + `masteryExamsTable` /
   `masteryExamQuestionsTable` / `masteryExamAttemptsTable`; routes in
   `routes/mastery-exams.ts` (`/courses/:courseId/...`). The owner-authored new
   handler computes unlock from `progress.score`, which CONTRADICTS rule below.
   Reconcile to `examAttemptsTable` when the frontend is wired (still pending).

The Course Mastery Exam for a course (legacy: a course = `topics.category`)
UNLOCKS only when EVERY lesson's PRACTICE EXAM has been passed at
>= 90%. A course is MASTERED when its mastery exam is passed at >= 90%.

**Source of truth = `examAttemptsTable`, never `progress.score`.**
**Why:** `progress.score` is written by BOTH quizzes and practice exams, so it
cannot distinguish a passed practice exam from a quiz score — it would silently
unlock courses the owner's rule says should stay locked. `examAttemptsTable.score`
is the raw correct count (0..total); percentage = score/total.

**One shared helper, two callers.** `computeCourseMasteryStatus(userId, category)`
returns `{category, unlocked, mastered, passingScore, totalTopics, passedTopics,
bestMasteryScore, lessons:[{topicId,name,bestExamPct,passed}]}`. Both the
`mastery-exam` 403 gate and the `mastery-status` endpoint (which drives the
topics-page unlock button) call it, so server and UI can never disagree.
**How to apply:** if you add another surface that needs unlock state, call the
helper — do not re-derive the rule.

**Gate math must compare the EXACT ratio, not a rounded percentage.**
Use `score/total*100 >= 90` (or `score*100 >= 90*total`); round ONLY for the
display field `bestExamPct`.
**Why:** `Math.round(89.6) === 90`, so a rounded-then-compared gate wrongly
unlocks lessons below a true 90%. Caught in code review.
