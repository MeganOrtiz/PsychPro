---
name: PsychPro EPPP special-category routing
description: How "tab-only" EPPP content (clinical cases, rapid review, full-length exams) is kept out of every other suite section.
---

# EPPP special categories surface ONLY in their own tab

Some EPPP content is authored as plain `topics` whose `category` string embeds a
marker, and must appear ONLY in its dedicated suite tab — never in Part 1
Knowledge, Part 2 Skills, Question Bank, Flashcards, Domain Mastery Exams, or
Performance Analytics. Examples and markers (in `eppp-content.ts`):
- Clinical Integration Cases — `"clinical integration cases:"` (colon-anchored, trailing domain)
- Rapid Review — `"rapid review:"` (colon-anchored, trailing domain)
- Full-Length Exams — `"full-length exam"` (substring; category ENDS with the marker, e.g. "EPPP Part 1: Full-Length Exams" / "EPPP Part 2: Full-Length Exams", so colon-anchoring does NOT apply here)

**The exclusion contract (do all of these, or it leaks):**
1. `getEpppExamPart()` returns `null` for the topic → `isEpppKnowledgeTopic` /
   `isEpppPart2Topic` both false → drops it from Knowledge, Part 2, Question
   Bank, Flashcards (all go through `useEpppTopics`).
2. `groupEpppTopicsByCategory()` ALSO filters it out explicitly (defensive; this
   is what Domain Mastery Exams + the dashboard derive their domain list from).
3. Keep `isEpppTopic()` returning TRUE for it (the `eppp` marker) so it stays
   classified as EPPP content and never leaks onto the main non-EPPP site.

**Why:** these surfaces all share the same category-convention helpers, so a new
"special" content type silently appears as a domain everywhere unless excluded at
both chokepoints. Routing is pure string convention — a content rename in prod
(source of truth; dev DB lags) can resurface a topic in the wrong tab.

**How to apply:** when the owner adds a new tab-only EPPP content type, add an
`isEpppX()` marker detector and wire it into BOTH (1) the `getEpppExamPart` guard
and (2) the `groupEpppTopicsByCategory` filter. Verify against the exact prod
category strings (query prod read-only), not dev.
