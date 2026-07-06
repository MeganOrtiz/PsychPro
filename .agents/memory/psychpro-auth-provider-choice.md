---
name: PsychPro auth provider choice
description: Why PsychPro uses Clerk (not Replit Auth) and why RA→Clerk migration is off the table.
---

PsychPro authenticates end users with **external Clerk** (owner's own Clerk account + custom `auth.psychprosuite.com` domain). Do NOT switch it to Replit Auth.

**Why:** Replit Auth (OIDC) forces every end user to have a Replit account — the first login shows a "PsychPro would like to access your Replit account" consent screen. PsychPro's audience is psychology/EPPP students, a general consumer audience that mostly has no Replit account, so that screen is a signup-killer. A Replit-Auth migration was built and published once (mid-2026) and immediately reverted for exactly this reason.

**How to apply:**
- Keep Clerk. If asked to remove the Replit-account requirement, the answer is "already handled — that's what Clerk is for."
- Replit-managed Clerk is NOT available here: migrating an app that is currently on Replit Auth over to Clerk (managed OR external) is **not supported** by the clerk-auth tooling, and a hand-built managed migration must not be attempted. See clerk-auth SKILL.md "Intent: Migrating from Replit Auth".
- The clean reversal path (should this ever recur): the RA migration was one self-contained commit; restore every file it touched from the pre-migration parent via `git show <parent>:<path>` + write, delete the RA-added files, `pnpm install`, restart api-server + neuronotes. See reverting-worktree-edits.md.
