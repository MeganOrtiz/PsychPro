---
name: PsychPro practice_exams.time_limit mixed units
description: The time_limit column has inconsistent units across rows; the exam runner treats it as seconds.
---

**Rule:** `practice_exams.time_limit` is consumed as **SECONDS** by the exam runner (`artifacts/neuronotes/src/pages/practice-exam.tsx` → `examTimeLimitSec = exam.timeLimit`; `formatTime` renders `MM:SS`). But the prod data is **inconsistent**: many rows hold minutes-like values (15/35/40/45/50/90) while others hold seconds-like values (600/1500/4500). There is NO single global interpretation that is correct for every row.

**Why:** The EPPP full-length exams were seeded with `time_limit = 255` intending 255 *minutes*, but the seconds-based runner rendered it as 4:15. Owner wanted 255 minutes, i.e. `255 * 60 = 15300` seconds.

**How to apply:**
- To make a specific exam show N minutes, store `N * 60` (seconds) — do NOT "fix" the whole column or flip the frontend to minutes; that would break the rows already storing seconds.
- Production DB is read-only to tooling and dev usually lacks the EPPP/full-length rows, so data corrections go through an **idempotent api-server startup backfill** (see `backfillFullLengthExamTime` in `lib/db/src/backfill-full-length-exam-time-core.ts`, wired in `artifacts/api-server/src/index.ts`), never a manual prod UPDATE. The fix only lands in prod on deploy.
- The full-length backfill guard (`time_limit < 3600` → set 15300, scoped to topic name ILIKE '%Full-Length%') is intentionally narrow: idempotent and won't clobber a deliberately large value.
