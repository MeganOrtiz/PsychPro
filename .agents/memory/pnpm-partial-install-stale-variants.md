---
name: Partial pnpm/expo install leaves stale .pnpm variants
description: Running expo install (or pnpm add) in one workspace package can break typecheck in a sibling package until a root pnpm install re-links
---
`npx expo install <pkgs>` inside artifacts/psychpro-mobile rewrote the root lockfile but left sibling packages' symlinks pointing at .pnpm variant dirs keyed to the OLD peer versions (e.g. @react-three/fiber keyed to expo@54.0.36). Symptom in neuronotes: sudden TS2339 "pointLight/group does not exist on JSX.IntrinsicElements" — R3F's JSX augmentation stopped resolving.

**Why:** hit 2026-08-24 during the expo 54.0.37 bump; looked like an unrelated R3F/react-types regression.

**How to apply:** after any dependency change in one workspace package, run `pnpm install` at the repo root, then re-run typecheck in sibling packages and restart their workflows (vite re-optimizes on lockfile change).
