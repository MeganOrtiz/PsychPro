---
name: PsychPro glass-button class is the source of truth
description: Which CSS class governs glass+glow buttons in the PsychPro (neuronotes) artifact, and the historical duplicate to watch for.
---

**Rule:** The single source of truth for the glass + cyan-glow button look in `artifacts/neuronotes` is `.btn-glass-strong` / `.btn-glass` (defined in `src/index.css`), wired into the shared `<Button>` component (`src/components/ui/button.tsx`) via the variant map. Do not introduce a parallel `.glass-button`, `.cta-glass`, or similar one-off class.

**Why:** An older `.glass-button` utility lived in `src/index.css` and was hardcoded across pages (notably `pages/dashboard.tsx`). When the shared Button was switched to `.btn-glass-strong`, those hardcoded usages kept rendering with the older, milder style because both classes have equal specificity and the cascade order favored the older one. Result: the landing CTAs looked correct but in-app buttons looked flat — and the discrepancy wasn't caught because nobody grepped for the competing class.

**How to apply:**
- When restyling buttons, grep `rg "glass-button|cta-|btn-"` first to surface every competing class.
- Prefer dropping `className` overrides on `<Button>` — let the variant carry the style.
- If a page needs a custom button look, extend the variant map in `button.tsx`, don't add a parallel utility class.
