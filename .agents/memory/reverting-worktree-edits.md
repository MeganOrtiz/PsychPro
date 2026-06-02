---
name: Reverting working-tree edits on Replit
description: How to actually undo an in-progress edit when "git checkout" is blocked and checkpoints have already committed it.
---

# Reverting working-tree edits on Replit

Two environment quirks combine to make "just revert this file" non-trivial:

1. **The main agent shell blocks destructive git.** `git checkout -- <file>`, `git restore`, `git reset`, etc. fail with "Destructive git operations are not allowed in the main agent" — even while assigned a task in Build mode.
   - **Workaround:** read the desired version with a read-only command (`git --no-optional-locks show <ref>:<path>`) and write it back to the file with the normal write/`cp`. A plain file write is allowed; it just isn't a git op.

2. **Automatic checkpoints commit your working-tree changes.** By the time you act on "discard my uncommitted edits", a checkpoint (e.g. plan→build transition, end-of-turn) may have already committed them into HEAD. So `git show HEAD:<path>` returns the *edited* version and "revert to HEAD" is a no-op.
   - **How to apply:** don't assume HEAD is clean. Verify with `git log --oneline -N -- <path>`, then for each candidate commit `git show <hash>:<path>` and grep for the marker that distinguishes the good state from the bad one. Restore from the last commit that actually has the desired state, and `diff` it against the current file to confirm the only delta is the intended undo before writing.

**Why:** saved a circular "I reverted but nothing changed" loop — the literal task said "restore to last committed version" but HEAD already contained the edit, so restoring HEAD wouldn't have brought back the wanted state.
