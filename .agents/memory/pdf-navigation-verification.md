---
name: PDF navigation verification
description: Verify PDF bookmarks and index links semantically, not just by destination validity.
---

A PDF destination within the page range is not enough to prove that navigation works. Check that the destination contains the intended topic, and resolve repeated headings within their own chapter.

**Why:** A textbook's entire bookmark tree pointed to the copyright page even though every destination was technically valid. Global heading searches also misdirected recurring headings such as Learning Objectives.

**How to apply:** Test bookmarks for chapters and repeated section titles against their actual sections. For multi-reference index entries, make each printed page reference link to its own destination, rather than routing all numbers to the first reference.