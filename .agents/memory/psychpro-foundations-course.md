---
name: PsychPro "Foundations" main-site course
description: What the "Foundations" category means now, how it's seeded, and the stale-script collision to avoid.
---

# "Foundations" is the psychology-foundations course

The main-site course **Foundations** = history of psychology, social determinants,
social psychology, community psychology, organizational psychology (started as
5 content-free PLACEHOLDER lessons; content authored later via Claude/MCP into prod).

# Repairing already-seeded rows in prod (descriptions etc.)

The lessons were first seeded as content-free placeholders (description =
"Placeholder lesson — content coming soon."). Content was later authored via
Claude/MCP, but Claude did NOT touch the topic descriptions, so they stayed on
the placeholder. Because the seed insert uses `ON CONFLICT DO NOTHING`, changing
the seed array alone will NOT update existing rows. To fix already-present prod
rows, the startup backfill also runs a **guarded UPDATE** (set real description
WHERE name = X AND description = the exact old placeholder string). Guarding on
the old value keeps it idempotent and prevents clobbering later manual edits.
Same pattern applies to any future field repair on prod-seeded content.

# How a NEW main-site course reaches prod

Courses are promoted from distinct `topics.category` by `backfillCoursesFromTopics`
on api-server startup (the ONLY path that seeds prod — prod is read-only to tooling).
To add a new course end-to-end:
1. Idempotent startup backfill that inserts its topics (category = course name),
   `ON CONFLICT DO NOTHING` on unique `topics.name`. For Foundations:
   `lib/db/src/backfill-foundations-topics-core.ts`, wired in api-server `index.ts`
   BEFORE the course backfill (chained via `.finally`) so the course row is
   created + linked in the same boot.
2. Register the category in `COURSE_DISPLAY_ORDER` + `COURSE_DESCRIPTIONS`
   (backfill-courses-core.ts) or it falls back to order 99 / null description.
3. Add the icon in `CATEGORY_ICONS` (topics.tsx); the course rail sorts categories
   ALPHABETICALLY (displayOrder is for other course-table views, not that rail).

# STALE collision: lib/db/src/add-foundation-topics.ts

That old script inserts NEUROANATOMY topics (Brain Structures, Cranial Nerves,
Vascular System of the Brain) under `category: "Foundations"`. It was never applied
(those topics live under "Neuroscience" now). **Do NOT run it** — it would pollute
the psychology Foundations course with neuroanatomy lessons.
