---
name: PsychPro EPPP suite reorg is final
description: Any pasted "EPPP Mastery Suite reorg" plan is stale; the live suite already implements it and reflects newer owner decisions — owner confirmed leave-as-is.
---

The EPPP Mastery Suite (`artifacts/neuronotes/src/pages/eppp-suite.tsx` + `lib/eppp-content.ts`) already implements the reorg that older pasted plans describe, and in places reflects NEWER owner decisions that contradict those plans. On 2026-06-11 the owner explicitly chose "leave it as-is — don't change anything."

**Deliberate owner deviations (live code wins):**
- Clinical Integration Cases is intentionally its OWN top-level tab, NOT a Part 1 sub-tab.
- There is no standalone Flashcards tab (flashcards are reached via lesson/topic pages).
- Reflections and My Notes are deliberately two separate top-level tabs.

**Why:** A prior session already merged the reorg; pasted plans predate it. Re-running one would regress deliberate owner decisions.

**How to apply:** If handed an EPPP-reorg plan again, diff against live code FIRST and treat the TABS-region comments in eppp-suite.tsx as current owner intent. Only implement genuinely-missing deltas the owner re-confirms.
