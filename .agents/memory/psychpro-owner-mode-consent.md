---
name: Owner mode/consent preference
description: Owner expects explicit sign-off before executing work; was surprised when a task assignment triggered a build during a planning session.
---
The owner was upset (2026-07-25) when a task assignment flipped the session into Build mode and work shipped while they thought we were still planning.

**Why:** They said "don't do that again" — they want to clearly know when execution starts, and they do their own pre-publish review.

**How to apply:** When ambiguity exists about whether the owner intended execution vs. planning, confirm before implementing. Before they republish, they expect a thorough verification pass (prod build, guardrails, typecheck, visual check) — offer it proactively.

When the owner explicitly asks to fix issues in the current Build conversation,
do the fixes directly rather than substituting queued follow-up suggestions.

**Why:** The owner objected when “Fix both issues” produced queued work instead
of the requested implementation.

**How to apply:** Distinguish a direct request to work now from acceptance of a
separately assigned background task; do not describe queued suggestions as fixes.
