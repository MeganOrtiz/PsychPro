# PsychPro EPPP Content Reconciliation

Created: June 8, 2026

Purpose: reconcile the current repo, Claude connector-created live content, and Claude-reported external Markdown files before any additional EPPP import or seed action.

## Current Content Sources

### Source A: Existing PsychPro Repo Seed

- Location: `lib/db/src/seed.ts`
- Reported by repo docs: 39 topics, 1,612 flashcards, 935 quiz questions, 39 study guides, 39 practice exams, 738 practice exam question links.
- Domain emphasis: existing neuroscience/neuropsychology-heavy PsychPro content.
- Risk: existing seed truncates child content tables before reseeding legacy content. It should be treated separately from any production EPPP import workflow.

### Source B: Local EPPP Starter Architecture

- Location: `content/eppp-mastery-domain-chapters.md`
- Import script: `lib/db/src/seed-eppp-master-content.ts`
- Planned output: 8 EPPP domain courses, 71 KN chapter topics, 71 starter study guides.
- Current limitation: starter content only; no full quiz bank, answer choices, or practice exams.
- Production warning: do not run against live PsychPro until Source C is exported and mapped.

### Source C: Claude Connector-Reported Live Content

Status: reported by Claude through the user; not independently verified from this repo clone.

- Live topics reported: topic IDs 62-81.
- Live lessons reported: 20.
- Live study guides reported: 20.
- Live flashcards reported: 1,000.
- Live quiz questions reported: approximately 624.
- Live practice exams reported: 20.
- Course wrapper caveat: Ethics reported complete with mastery exam; remaining new course wrappers reported as async build in progress.

| Domain | Lessons | Topic IDs |
|---|---:|---|
| Ethics, Legal & Professional Issues | 6 | 62-67 |
| Growth & Lifespan Development | 5 | 68-72 |
| Cognitive-Affective Bases | 5 | 73-77 |
| Social & Cultural Bases | 4 | 78-81 |

### Source D: Claude-Reported Markdown Files Not Found Here

These files were reported by Claude but were not found under `/Users/meganortiz/Documents/Claude/Projects/PsychPro`.

- `EPPP_Part1_Domain1_Biological_Bases.md`
- `EPPP_Part1_Domain5_Assessment_Diagnosis.md`
- `EPPP_Part1_Domain6_Treatment_Supervision.md`
- `EPPP_Part1_Domain7_Research_Methods_Statistics.md`

Reported content: 18 lessons, 18 study guides, 900 flashcards, approximately 550 quiz questions.

## Reconciliation Decisions Needed

1. Determine whether Source C is production, staging, or another PsychPro environment.
2. Export Source C rows from live PsychPro before modifying imports.
3. Locate Source D files or regenerate them only if they cannot be recovered.
4. Decide whether official EPPP domains should be represented as `courses`, `topics.category`, or new `domains` records.
5. Decide whether KN statements should be stored as structured `competencies` or topic/question metadata.
6. Decide whether Source B should remain a planning skeleton or become a staging importer.
7. Map topic IDs 62-81 to official domain codes and KN statements.
8. Verify whether the 20 live practice exams are linked through `practice_exam_questions`.
9. Verify whether course mastery exams exist in `mastery_exams` or legacy category mastery.
10. Verify whether Claude-created content includes any labels that should be normalized before launch.

## Immediate Safe Next Step

Export a live content inventory from PsychPro and compare it against this table before seeding or importing anything else.
