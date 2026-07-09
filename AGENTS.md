## PsychPro visual system lock

The PsychPro visual system is frozen by default. Do not modify UI, CSS,
Tailwind classes, component styling, layout styling, shared visual primitives,
background assets, color tokens, typography tokens, or design guardrail scripts
unless the owner explicitly asks for an intentional visual-system change.

Before making any intentional visual change in `artifacts/neuronotes`, read
`docs/design-system-lock.md` completely and follow the protocol there.

For non-design tasks, do not touch:

- `artifacts/neuronotes/src/index.css`
- `artifacts/neuronotes/src/lib/study-theme.ts`
- `artifacts/neuronotes/src/components/ui/*`
- `artifacts/neuronotes/src/components/study/*`
- `artifacts/neuronotes/src/pages/*` style blocks, Tailwind classes, or visual copy/layout
- `artifacts/neuronotes/src/assets/bg/*`
- `artifacts/neuronotes/scripts/check-design-drift.mjs`
- `artifacts/neuronotes/scripts/check-surface-hue.mjs`
- `docs/design-system-lock.md`

Never weaken, rewrite, or bypass a design guardrail just to make validation pass.
If a task appears to require changing a guarded visual file but the owner did
not explicitly request a visual-system change, stop and ask for confirmation.

After an intentional visual change, run `pnpm run design:check` from the repo
root and report every visual file changed.
