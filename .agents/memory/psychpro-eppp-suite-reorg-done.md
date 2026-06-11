---
name: PsychPro EPPP suite reorg already implemented
description: The pasted "EPPP Mastery Suite reorg" T001–T010 session plan is stale; the suite already implements it and has moved past it.
---

The EPPP Mastery Suite (`artifacts/neuronotes/src/pages/eppp-suite.tsx` + `lib/eppp-content.ts`) already implements the target reorg described in the pasted T001–T010 plan, and in places reflects NEWER owner decisions that contradict that plan.

**Already done (do not redo):** `isEpppQuickReference` + `getEpppQuickReferenceGuides` + the `getEpppExamPart`/`groupEpppTopicsByCategory` exclusions exist; Question Bank sub-tab retired (deep-link now opens Knowledge rail); Domain Mastery Exams + Full-Length Exams both have Part 1/Part 2 sub-tabs; Rapid Review/Quick Reference is a top-level tab; every tab is wired to a real panel.

**Plan conflicts with current code (current code wins unless owner says otherwise):**
- Clinical Integration Cases is intentionally its OWN top-level tab (with Part 1/Part 2 sub-tabs), NOT a Part 1 sub-tab as the plan asks.
- There is no standalone Flashcards tab to remove (flashcards are reached via lesson/topic pages).
- Reflections and My Notes were deliberately split into two separate top-level tabs.

**Why:** A prior session/task agent already merged this reorg; the pasted plan predates it. Re-running it would regress deliberate owner decisions (e.g. move clinical-cases back, delete Reflections/My Notes).

**How to apply:** If handed this plan again, diff against the live code FIRST. Treat the code comments in eppp-suite.tsx (TABS region ~124-153) as the current owner intent. Only implement genuinely-missing deltas the owner re-confirms.
