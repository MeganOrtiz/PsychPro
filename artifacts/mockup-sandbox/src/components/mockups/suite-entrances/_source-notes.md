# EPPP intro extraction notes

## Source markup and copy

Extracted from `artifacts/neuronotes/src/pages/landing.tsx`, EPPP Mastery
System section (lines 397–417). This is the EPPP intro only, not the separate
general mastery, tools, or other landing sections.

Exact source JSX (with the surrounding explanatory comment omitted):

```tsx
<section id="eppp" className="landing-section landing-mastery" data-reveal>
  <div className="landing-mastery-card">
    <div className="landing-mastery-icon">
      <GraduationCap aria-hidden />
    </div>
    <p className="landing-eyebrow">EPPP PREP</p>
    <h2 className="landing-section-title">
      The PsychPro EPPP Mastery System&trade;
    </h2>
    <p className="landing-mastery-text">
      The PsychPro EPPP Mastery System&trade; is a system of learning
      resources designed to promote mastery of EPPP content through
      conceptual understanding, critical thinking, and active
      application. Featuring structured lessons in each domain, clinical
      integration case examples, and full-length practice exams, the
      system equips learners with the knowledge and confidence needed
      for both EPPP success and real-world clinical practice.
    </p>
  </div>
</section>
```

## Relevant source styling and feature copy

The section's existing copy is the EPPP PREP eyebrow, the PsychPro EPPP
Mastery System™ title, and the paragraph above: structured lessons in each
domain, clinical integration case examples, and full-length practice exams
support conceptual understanding, critical thinking, active application, and
EPPP / real-world clinical confidence. The `GraduationCap` icon is from
`lucide-react`.

Relevant source rules from `landing.tsx` (CSS-in-JS color interpolations
resolved using `src/lib/palette.ts`):

- Font: Montserrat (`--app-font-sans` resolves to
  `'Montserrat', 'Inter', 'SF Pro Display', sans-serif`); section title weight
  300, eyebrow weight 700.
- Eyebrow: 12.5px, 0.4em tracking, 12px gap, 10px bottom margin; color
  `#14171a`. Pseudo rules are transparent in the source.
- Title: `clamp(26px, 3.4vw, 44px)`, 300 weight, 0.01em tracking, 1.14 line
  height; color `#14171a`.
- Section: max-width 1180px, centered, `clamp(22px, 3.4vh, 42px) 32px` padding;
  mastery section max-width 1020px.
- Card: 22px radius, `clamp(30px, 4.4vw, 52px)` padding, white at 92%
  opacity, 1px `rgba(75, 81, 87, 0.58)` border, and the source three-layer
  shadow recipe.
- Icon tile: 56px square, 15px radius, 18px bottom margin; resolved source
  accent `#24282c` with the original 8-digit-alpha fills/border/glow.
- Body: max-width 760px, `clamp(16px, 2vh, 22px)` top margin,
  `clamp(14px, 1.1vw, 16.5px)` font size, 1.78 line height,
  `rgba(36, 40, 44, 0.84)` color.

Source card and icon recipes, with token values resolved:

```css
.landing-mastery-card {
  border-radius: 22px;
  padding: clamp(30px, 4.4vw, 52px);
  background: hsl(0 0% 100% / 0.92);
  border: 1px solid rgba(75, 81, 87, 0.58);
  box-shadow: 0 36px 90px -40px rgba(0, 0, 0, 0.15),
    0 0 48px #24282c33, 0 0 0 1px #24282c22 inset;
}
.landing-mastery-icon {
  width: 56px;
  height: 56px;
  margin-bottom: 18px;
  border-radius: 15px;
  background: #24282c18;
  border: 1px solid #24282c55;
  color: #24282c;
  box-shadow: 0 0 22px #24282c44;
}
```

The original section's `data-reveal` attribute is retained, but the isolated
baseline is forced visible because the landing-page IntersectionObserver is
not part of this extraction. The outer wrapper is white and fills the preview
viewport; no page navigation or other landing content is included.

## Asset verification

`heroTealGlass` is `psychpro-teal-glass.webp`. The main asset at
`artifacts/neuronotes/src/assets/psychpro-teal-glass.webp` and the existing
sandbox copy at `artifacts/mockup-sandbox/public/images/psychpro-teal-glass.webp`
have matching SHA-256 `ae157434fe3e68113093e4c4cac21b51497b12245f4f2aa771f1669da8041af9`.
The extracted EPPP intro does not use this asset or the floating brain.