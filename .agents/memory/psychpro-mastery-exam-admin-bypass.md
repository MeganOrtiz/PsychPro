---
name: PsychPro mastery-exam admin bypass
description: How owner/admin access to course mastery exams works, and the rule to keep gate bypasses consistent.
---

# Admins bypass ALL mastery-exam gates via isCallerAdmin

There are TWO parallel mastery-exam systems and BOTH gate access:
- Legacy **category**-based (`routes/course-mastery.ts`) — the one the frontend UI
  uses today. Gate: prerequisite only (every lesson's practice exam ≥90%). No paywall.
- New **courseId**-based (`routes/mastery-exams.ts`, MCP-authored content). Gates:
  paywall (pro/scholar tier) **and** prerequisite.

The project owner / staff get full access by being admin: each handler computes
`await isCallerAdmin(req)` and ORs it into the unlock decision (`unlocked = isAdmin || …`)
and skips the paywall (`if (!admin && !PRO_TIERS.has(tier))`). `isCallerAdmin` trusts only
a server-verified Clerk identity (users.isAdmin OR a Clerk-VERIFIED email in builtin
`admin@psychprosuite.com` + `ADMIN_EMAILS`), never client input — so this is not an
escalation path.

**Why:** Owner needs to preview/test exams without acing every lesson or paying.

**How to apply:** When adding or editing ANY gate (paywall or prerequisite) in either
file, thread the admin bypass through EVERY handler — both the hard gates AND the
display/state endpoints (list `GET /courses`, `GET /courses/:id`, `mastery-state`,
`users/me/course-mastery`). Missing one leaves the UI showing "locked" for an admin who
can actually pass the hard gate — an inconsistency that's easy to introduce because the
unlock helper is called from ~6 sites. The legacy GET exam route shadows the new
courseId GET exam route (pre-existing route collision), so the app UI access path runs
through `course-mastery.ts`; that's the one that must work for owner testing.

# In-app exams need no authored content; the new MCP system does

The legacy/category exam auto-builds from the course's existing quiz questions, so an
admin can take it immediately. The new courseId system requires a `mastery_exams` row
authored via the MCP tools — `mastery_exams` count was 0 in prod, so that system has
nothing to serve until Claude authors exams.
