---
name: PsychPro EPPP dashboard data gaps
description: Data sources + deliberate gaps for the EPPP Mastery System dashboard (separate from /dashboard).
---

The EPPP Mastery System has its own dashboard at `/eppp/dashboard`, separate from the general `/dashboard`. The `/eppp` page stays as the intro hub; its CTAs route into the dashboard.

**Data sources** (all reused from the main dashboard patterns):
- Readiness + per-domain progress: derive domains from `useGetTopics()` categories, then per-domain `getCourseMasteryStatus(category)` via `useQueries`. Readiness = mean of raw `passedTopics/totalTopics` ratios (round only final display).
- Streak / weekly activity / recommendations: `useGetDashboardSummary()` (currentStreak, weeklyActivity, weakAreas, recentTopics, averageScore).

**Deliberate gaps — do not fabricate:**
- **No stored target exam date** anywhere in the schema. The exam-date countdown is persisted in `localStorage` keyed `psychpro.eppp.examDate.<userId>` (device-local v1). If asked to sync across devices, that needs a real users-table column + endpoint + codegen.
- **No time-spent / minutes field.** Only streak + weeklyActivity active-days exist. Show "active days", never invented minutes.

**Why:** user explicitly wanted readiness, domain progress, study-next, streak/time, and exam countdown — but the backend has no exam-date or time fields, so two of the five are approximated honestly rather than mocked.
