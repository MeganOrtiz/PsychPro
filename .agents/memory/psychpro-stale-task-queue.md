---
name: PsychPro task queue contains stale entries
description: Old PENDING tasks may describe already-fixed problems; verify against code/Stripe before citing them as gaps.
---

The project task queue (55+ entries) predates much completed work. Confirmed stale as of 2026-07-31: "Tag the Master plan in Stripe" (metadata already set: master/Scholar/eppp, code lower-cases and accepts them) and "Make the two full-length exams launchable" (FullLengthExamsPanel fully built with start buttons). "#16 invoices pagination" duplicates a newer draft.

**Why:** Citing stale tasks as "functional gaps" to the owner produced false alarms twice in one session; the owner reacted strongly both times.

**How to apply:** Before summarizing outstanding work or calling something broken, spot-check any old PENDING task's claim against the current code (or live Stripe/DB state). The task list is a to-do queue, not a status report.
