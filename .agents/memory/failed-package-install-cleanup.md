---
name: Failed package-install cleanup
description: Package installation can leave unrelated project changes even when the package itself fails.
---

A failed Python package installation can still create root Python scaffolding and add Nix system packages. Treat a failed installation as potentially non-atomic.

**Why:** Installing PyMuPDF for a document review failed because the destination was inside the read-only Nix store, but the installer had already created Python project scaffolding and added system dependencies.

**How to apply:** Inspect the workspace diff after a failed install. Remove only confirmed tool-created scaffolding, and remove unwanted system packages through the package-management callbacks. For one-off analysis, an already-prepared unpacked wheel in the package cache can be used without changing application dependencies.