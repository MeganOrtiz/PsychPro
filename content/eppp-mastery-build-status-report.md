# PsychPro EPPP Mastery System™ Build Status Report

Generated: June 8, 2026  
Source reviewed: cloned GitHub repo at `/Users/meganortiz/Documents/Claude/Projects/PsychPro/PsychPro-app`  
Important scope note: this report reflects the codebase and seed files currently present in the repo. It does not independently verify the live production database unless explicitly noted.

Live content note added from user-provided Claude connector report: Claude reported that 20 EPPP gap-domain lessons were created live in PsychPro through the MCP connector as topic IDs 62-81, with study guides, flashcards, quiz questions, and practice exams. This repo clone does not currently contain a direct export of those rows, so the live counts below are treated as connector-reported pending database verification.

Integration warning: do not run `pnpm --filter @workspace/db run seed:eppp` against the live PsychPro database until the connector-created topics are exported and reconciled. The local seed script creates broad 8-domain/71-KN starter topics and could duplicate or fragment the live content Claude already inserted.

---

## 1. Completed

### Core PsychPro Web App Shell

- Feature name: React/Vite PsychPro web application.
- Files created: `artifacts/neuronotes/src/App.tsx`, `artifacts/neuronotes/src/main.tsx`, `artifacts/neuronotes/src/index.css`, `artifacts/neuronotes/src/components/layout/app-layout.tsx`.
- Database tables created: none directly; uses shared database tables through API.
- API routes created: mounted through `artifacts/api-server/src/routes/index.ts`.
- Frontend pages/components created: landing, auth pages, dashboard, courses/topics, topic detail, flashcards, quizzes, study guides, practice exams, progress, subscription, feedback, Brain Lab, Study Lab, Community pages, EPPP pages.
- Current functionality: authenticated application shell with sidebar navigation, Clerk auth, protected app routes, public landing/privacy/terms, and responsive page structure.
- Screenshot: `screenshots/header-refined.jpg`; additional screenshots exist in `attached_assets/`.

### Authentication and User Profile

- Feature name: Clerk-based authentication with app user profile.
- Files created: `artifacts/neuronotes/src/pages/sign-in.tsx`, `sign-up.tsx`, `onboarding.tsx`, `artifacts/neuronotes/src/components/auth/clerk-token-bridge.tsx`, `require-signed-in.tsx`, `artifacts/api-server/src/routes/users.ts`, `artifacts/api-server/src/lib/userId.ts`.
- Database tables created: `users`.
- API routes created: `GET /api/users/profile`, `POST /api/users/profile`, `GET /api/users/usage`, `POST /api/users/usage`, `DELETE /api/users/me`, admin duplicate/delete routes.
- Frontend pages/components created: sign-in, sign-up, onboarding, protected route wrapper.
- Current functionality: Clerk token is sent to API; user rows auto-create on first profile/entitlement access; onboarding stores role, goal, degree, referral source, and completion status.
- Screenshot: not specifically available.

### Topic/Course Browser

- Feature name: Courses/topics browser.
- Files created: `artifacts/neuronotes/src/pages/topics.tsx`, `topic-detail.tsx`, `artifacts/api-server/src/routes/topics.ts`.
- Database tables created: `topics`, plus `courses` for newer course architecture.
- API routes created: `GET /api/topics`, `GET /api/topics/:topicId`.
- Frontend pages/components created: courses rail, search, topic cards, lesson detail page, study-mode cards.
- Current functionality: users can browse seeded lessons by category/course, search lessons, open a topic, and choose flashcards, quiz, study guide, or practice exam.
- Screenshot: likely among `attached_assets/Screenshot_*.png`, but no exact current-page mapping was verified.

### Study Guides

- Feature name: Study guide delivery.
- Files created: `artifacts/neuronotes/src/pages/study-guide.tsx`, `artifacts/api-server/src/routes/topics.ts`, seed content in `lib/db/src/seed.ts`.
- Database tables created: `study_guides`.
- API routes created: `GET /api/topics/:topicId/study-guide`.
- Frontend pages/components created: study guide page with markdown rendering and upgrade prompt for locked access.
- Current functionality: paid/admin users can load a topic study guide; free users receive server-side `402` and see a locked surface.
- Screenshot: not specifically available.

### Flashcards

- Feature name: topic flashcards.
- Files created: `artifacts/neuronotes/src/pages/flashcards.tsx`, `artifacts/api-server/src/routes/topics.ts`, seed content in `lib/db/src/seed.ts`.
- Database tables created: `flashcards`.
- API routes created: `GET /api/topics/:topicId/flashcards`.
- Frontend pages/components created: flashcard page with flip interaction and upgrade state.
- Current functionality: authenticated users can study flashcards; free users receive first 10 cards only; paid/admin users receive all cards.
- Screenshot: not specifically available.

### Quizzes

- Feature name: topic quizzes.
- Files created: `artifacts/neuronotes/src/pages/quiz.tsx`, `artifacts/api-server/src/routes/topics.ts`, `artifacts/api-server/src/routes/progress.ts`, seed content in `lib/db/src/seed.ts`.
- Database tables created: `quiz_questions`, `quiz_attempts`.
- API routes created: `GET /api/topics/:topicId/quizzes`, `POST /api/quiz-attempts`.
- Frontend pages/components created: multiple-choice quiz page with explanations and result state.
- Current functionality: authenticated users can answer non-exam-only questions and record attempts; free users are server-gated after 1 completed quiz.
- Screenshot: not specifically available.

### Practice Exams

- Feature name: lesson-level practice exams.
- Files created: `artifacts/neuronotes/src/pages/practice-exam.tsx`, `artifacts/api-server/src/routes/topics.ts`, `artifacts/api-server/src/routes/progress.ts`, seed content in `lib/db/src/seed.ts`.
- Database tables created: `practice_exams`, `practice_exam_questions`, `exam_attempts`.
- API routes created: `GET /api/topics/:topicId/practice-exam`, `POST /api/exam-attempts`.
- Frontend pages/components created: exam setup, timed/untimed mode, question flow, results, attempt recording.
- Current functionality: authenticated users can load randomized linked exam questions; free users are server-gated after 1 completed exam; requested question count clamps to available linked questions.
- Screenshot: not specifically available.

### Progress Dashboard

- Feature name: general dashboard summary and progress tracking.
- Files created: `artifacts/neuronotes/src/pages/dashboard.tsx`, `progress.tsx`, `artifacts/api-server/src/routes/progress.ts`.
- Database tables created: `progress`, `quiz_attempts`, `exam_attempts`.
- API routes created: `GET /api/dashboard/summary`, `GET /api/progress`, `GET /api/progress/:topicId`, `POST /api/progress/:topicId`.
- Frontend pages/components created: dashboard, progress page, recent topics, weak areas, weekly activity, progress cards.
- Current functionality: tracks per-topic score, last access, completed quizzes/exams, current streak, weekly activity, average score, recent topics, and weak areas.
- Screenshot: not specifically available.

### Course Mastery Exams, Legacy Category-Based

- Feature name: category-based course mastery exams.
- Files created: `artifacts/api-server/src/routes/course-mastery.ts`, `artifacts/neuronotes/src/pages/course-mastery-exam.tsx`.
- Database tables created: `course_mastery_attempts`; uses `topics`, `quiz_questions`, `exam_attempts`.
- API routes created: `GET /api/courses/:category/mastery-status`, `GET /api/courses/:category/mastery-exam`, `POST /api/course-mastery-attempts`.
- Frontend pages/components created: course mastery exam page reachable from `/courses/:category/mastery-exam`.
- Current functionality: unlocks a category mastery exam after every lesson in that category has a practice exam score of at least 90%; admins bypass prerequisite; records category mastery attempts.
- Screenshot: not specifically available.

### Course Mastery Exams, New CourseId-Based

- Feature name: courseId-based mastery exam architecture.
- Files created: `artifacts/api-server/src/routes/mastery-exams.ts`.
- Database tables created: `courses`, `mastery_exams`, `mastery_exam_questions`, `mastery_exam_attempts`.
- API routes created: `GET /api/courses`, `GET /api/courses/:courseId`, `GET /api/courses/:courseId/mastery-state`, `GET /api/courses/:courseId/mastery-exam`, `POST /api/courses/:courseId/mastery-exam/attempt`, `GET /api/users/me/course-mastery`.
- Frontend pages/components created: no fully migrated courseId frontend found; existing frontend still uses category-based route in multiple places.
- Current functionality: backend supports first-class courses and paid/admin gated mastery exams with configurable passing/mastery/unlock thresholds.
- Screenshot: not available.

### EPPP Mastery Intro Page

- Feature name: EPPP Mastery System landing/hub inside the app.
- Files created: `artifacts/neuronotes/src/pages/eppp.tsx`, nav links in `app-layout.tsx`.
- Database tables created: none.
- API routes created: none.
- Frontend pages/components created: `/eppp`.
- Current functionality: authenticated users can open the EPPP hub, read the EPPP Mastery framing, and click to `/eppp/dashboard` or `/topics`.
- Screenshot: not specifically available.

### EPPP Readiness Dashboard

- Feature name: EPPP readiness dashboard.
- Files created: `artifacts/neuronotes/src/pages/eppp-dashboard.tsx`.
- Database tables created: none directly; uses `topics`, `progress`, `exam_attempts`, `course_mastery_attempts`.
- API routes created: consumes `GET /api/dashboard/summary`, `GET /api/topics`, and category-based `GET /api/courses/:category/mastery-status`.
- Frontend pages/components created: `/eppp/dashboard`, readiness ring, domain progress cards, study-next recommendations, exam-date localStorage field.
- Current functionality: calculates readiness as mean passed/total lesson ratio across topic categories, shows domains mastered, streak, weekly activity, exam countdown, and recommended lessons.
- Screenshot: not specifically available.

### Study Lab

- Feature name: evidence-based learning tools.
- Files created: `artifacts/neuronotes/src/pages/study-lab.tsx`, `components/learning/brain-dump.tsx`, `spaced-repetition.tsx`, `interleaving-mode.tsx`, `elaboration-panel.tsx`, `today-reviews.tsx`.
- Database tables created: none; current tools use local state/localStorage and topic data.
- API routes created: topic reads only.
- Frontend pages/components created: Brain Dump, spaced repetition scheduler, interleaving mode, elaboration prompts, today reviews.
- Current functionality: users can use learning-science tools alongside topics; several pieces persist locally rather than in server-side learning records.
- Screenshot: not specifically available.

### Brain Lab

- Feature name: interactive 3D brain explorer.
- Files created: `artifacts/neuronotes/src/pages/brain-lab.tsx`, `components/brain/brain-3d-view.tsx`, `brain-quiz.tsx`, `artifacts/neuronotes/src/data/brain-structures.ts`.
- Database tables created: none.
- API routes created: none.
- Frontend pages/components created: `/brain-lab`, 3D brain viewer, brain quiz component.
- Current functionality: React Three Fiber brain explorer with clickable anatomical regions and related topic hints.
- Screenshot: images in `attached_assets/` include brain assets/screenshots, but exact current state was not verified.

### Subscription and Entitlements

- Feature name: freemium, Pro/Master, Scholar entitlement system.
- Files created: `artifacts/api-server/src/routes/subscription.ts`, `routes/entitlements.ts`, `lib/entitlements.ts`, `artifacts/neuronotes/src/pages/subscription.tsx`, `components/upgrade-prompt.tsx`, `lib/use-entitlements.ts`.
- Database tables created: uses `users`, `quiz_attempts`, `exam_attempts`.
- API routes created: `GET /api/subscription/plans`, `POST /api/subscription/checkout`, `POST /api/subscription/portal`, `GET /api/subscription/status`, `GET /api/users/entitlements`.
- Frontend pages/components created: subscription page, upgrade prompts, locked cards.
- Current functionality: free users get 10 flashcards per topic, 1 completed quiz total, 1 completed exam total, locked study guides; paid/admin users get full access; Stripe checkout/portal exists.
- Screenshot: not specifically available.

### Scholar Custom Decks

- Feature name: AI-generated custom decks from uploaded/pasted material.
- Files created: `artifacts/api-server/src/routes/custom-decks.ts`, `artifacts/neuronotes/src/pages/my-decks.tsx`, `my-decks-new.tsx`, `my-decks-detail.tsx`, OpenAI integration package files.
- Database tables created: `custom_decks`, `custom_flashcards`, `custom_quiz_questions`, `custom_cloze_items`.
- API routes created: `POST /api/custom-decks`, `GET /api/custom-decks`, `GET /api/custom-decks/:id`, `GET /api/custom-decks/:id/flashcards`, `GET /api/custom-decks/:id/quiz`, `GET /api/custom-decks/:id/cloze`, `DELETE /api/custom-decks/:id`.
- Frontend pages/components created: `/my-decks`, `/my-decks/new`, `/my-decks/:id`.
- Current functionality: Scholar-tier users can upload/paste source material and generate custom study content strictly from source content.
- Screenshot: not specifically available.

### Feedback and Admin Inbox

- Feature name: feedback submission and admin feedback management.
- Files created: `artifacts/api-server/src/routes/feedback.ts`, `artifacts/neuronotes/src/pages/feedback.tsx`, `admin-feedback.tsx`.
- Database tables created: `feedback`.
- API routes created: `GET /api/feedback/is-admin`, `POST /api/feedback`, `GET /api/feedback`, `PATCH /api/feedback/:id/status`.
- Frontend pages/components created: feedback page, admin feedback inbox.
- Current functionality: logged-in users can submit feedback; admins can review/update feedback status.
- Screenshot: not specifically available.

### Community, Profiles, Featured Work, Connections

- Feature name: community layer.
- Files created: `artifacts/api-server/src/routes/profile.ts`, `featured-work.ts`, `connections.ts`, `artifacts/neuronotes/src/pages/profile.tsx`, `featured-work.tsx`, `connections.tsx`, admin pages.
- Database tables created: `user_profiles`, `featured_work`, `community_notifications`, `connection_requests`, `user_blocks`, `connections_audit_log`.
- API routes created: profile, featured work, notifications, connection suggestions/requests/admin endpoints.
- Frontend pages/components created: profile, public profile, featured work, admin featured work, connections, admin connections, notifications bell.
- Current functionality: users can manage profiles, submit featured work, browse approved work, request double-opt-in introductions, and receive notifications.
- Screenshot: not specifically available.

### MCP Content Uploader

- Feature name: admin-only MCP server for content uploading.
- Files created: `artifacts/api-server/src/routes/mcp.ts`, `routes/admin-tokens.ts`, `routes/oauth.ts`, `lib/mcpServer.ts`, `lib/adminTokens.ts`, `lib/oauthStore.ts`.
- Database tables created: `admin_tokens`, `oauth_clients`, `oauth_auth_codes`, `oauth_access_tokens`, `oauth_refresh_tokens`.
- API routes created: `POST /api/mcp`, admin token CRUD, OAuth discovery/register/authorize/token routes.
- Frontend pages/components created: `/admin/tokens`.
- Current functionality: MCP tools can list/add topics, flashcards, quiz questions, study guides, practice exams, mastery exams, and mastery exam questions with bearer-token/OAuth support.
- Screenshot: not specifically available.

### EPPP Source Content Integration, New in This Workspace

- Feature name: EPPP Mastery source content and seed bridge.
- Files created: `content/eppp-mastery-domain-chapters.md`, `content/eppp-expanded-chapter-model.md`, `content/eppp-comprehensive-terms-glossary.md`, `content/psychpro-visual-learning-library-spec.md`, `content/README.md`, `lib/db/src/seed-eppp-master-content.ts`.
- Database tables created: no schema tables created; seed script targets existing `courses`, `topics`, and `study_guides`.
- API routes created: none.
- Frontend pages/components created: none.
- Current functionality: repo now contains source architecture for all 8 EPPP domains and 71 KN chapters; `pnpm --filter @workspace/db run seed:eppp` can create EPPP domain courses, chapter topics, and starter study guides without truncating existing neuroscience content.
- Screenshot: not applicable.

---

## 2. In Progress

### EPPP Domain/KN Content Loading

- Completion percentage: 20%.
- What's working: source files exist; parser validates 8 domains and 71 chapters; seed command added.
- What's not working: not confirmed against live DB; no EPPP-specific flashcards, quiz questions, answer rationales, clinical cases, or full exams generated from this content yet.
- Blockers: decision needed on final placement relative to existing neuroscience topics and Claude Code changes; dependencies not installed locally, so seed script is not typechecked here.

### EPPP Readiness Dashboard

- Completion percentage: 35%.
- What's working: `/eppp/dashboard` exists; calculates readiness from category mastery status; exam date persists locally; shows next lessons.
- What's not working: readiness is not yet a validated EPPP readiness score; it uses topic categories rather than official EPPP domains unless EPPP seed is run and categories align.
- Blockers: needs EPPP domain data loaded, real mastery score model, and analytics events beyond topic/exam scores.

### CourseId-Based Mastery Exam Migration

- Completion percentage: 45%.
- What's working: backend tables and routes exist for first-class `courses`, `mastery_exams`, `mastery_exam_questions`, and `mastery_exam_attempts`.
- What's not working: frontend still primarily uses category-based route `/courses/:category/mastery-exam`; migration is incomplete.
- Blockers: need to decide whether EPPP uses category-based legacy route or newer courseId-based route.

### Visual Learning Library

- Completion percentage: 15%.
- What's working: Brain Lab exists; visual library spec exists; visual palette and asset taxonomy documented.
- What's not working: no metadata table, no browsable visual library route/page, no KN-linked visual assets.
- Blockers: schema/design decision needed for visual assets and relationships.

### Adaptive Learning / Spaced Review

- Completion percentage: 25%.
- What's working: Study Lab has local spaced review scheduler; dashboard computes streak/weekly activity; weak areas sorted by score.
- What's not working: no server-side spaced repetition queue, no confidence ratings, no adaptive weighting, no low-confidence question storage.
- Blockers: missing user interaction/event model and item-level performance tracking.

### Bookmarks, Flags, Notes, Missed Questions

- Completion percentage: 0-10%.
- What's working: product spec and UI concepts mention these; reflections page exists separately.
- What's not working: no dedicated bookmark, flag, note, missed-question, or low-confidence tables found.
- Blockers: schema not built.

### Question Bank Expansion

- Completion percentage: 30% for existing neuroscience content; 5% for EPPP-specific content.
- What's working: existing seeded questions and explanations; quiz/practice exam flows.
- What's not working: EPPP domain-specific questions, competency tags, answer-choice rationales, difficulty metadata beyond simple text, clinical cases, and domain exams are not fully present.
- Blockers: need content production pipeline and schema extensions.

---

## 3. Database Schema

### Existing Tables

| Table | Purpose | Columns | Relationships |
|---|---|---|---|
| `users` | App user account, onboarding, subscription/admin state | `id`, `email`, `role`, `goal`, `degree`, `referral_source`, `subscription_status`, `stripe_customer_id`, `stripe_subscription_id`, `onboarding_complete`, `usage_count`, `progress_score`, `is_admin`, `created_at` | referenced by progress, attempts, feedback, custom decks, profiles, community tables |
| `topics` | Current lesson/topic unit | `id`, `name`, `category`, `description`, `course_id` | `course_id` references `courses.id`; referenced by flashcards, quiz questions, study guides, progress, practice exams, attempts |
| `flashcards` | Seeded topic flashcards | `id`, `topic_id`, `question`, `answer`, `difficulty` | `topic_id` references `topics.id` |
| `quiz_questions` | Seeded multiple-choice questions | `id`, `topic_id`, `question`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `exam_only` | `topic_id` references `topics.id`; linked by practice/mastery exam join tables |
| `study_guides` | Markdown study guide per topic | `id`, `topic_id`, `title`, `content` | `topic_id` references `topics.id` |
| `progress` | User topic score and last access | `id`, `user_id`, `topic_id`, `score`, `last_accessed` | references `users.id` and `topics.id` |
| `practice_exams` | Lesson-level practice exam shell | `id`, `topic_id`, `title`, `time_limit`, `passing_score`, `created_at` | `topic_id` references `topics.id` |
| `practice_exam_questions` | Join table for lesson practice exams | `id`, `exam_id`, `question_id`, `question_order` | references `practice_exams.id` and `quiz_questions.id` |
| `quiz_attempts` | Completed quiz attempts | `id`, `user_id`, `topic_id`, `score`, `total`, `completed_at` | references `users.id` and `topics.id` |
| `exam_attempts` | Completed practice exam attempts | `id`, `user_id`, `topic_id`, `score`, `total`, `completed_at` | references `users.id` and `topics.id` |
| `course_mastery_attempts` | Legacy category-based mastery attempts | `id`, `user_id`, `category`, `score`, `correct`, `total`, `passed`, `completed_at` | references `users.id`; category string maps to `topics.category` |
| `courses` | First-class course/domain entity | `id`, `name`, `description`, `display_order`, `icon_asset`, `created_at` | referenced by `topics.course_id` and `mastery_exams.course_id` |
| `mastery_exams` | CourseId-based mastery exam shell | `id`, `course_id`, `title`, `question_count`, `time_limit_minutes`, `passing_score`, `mastery_score`, `unlock_threshold`, `created_at` | unique `course_id` references `courses.id` |
| `mastery_exam_questions` | Join table for course mastery exam pool | `mastery_exam_id`, `question_id`, `question_order` | references `mastery_exams.id` and `quiz_questions.id`; composite primary key |
| `mastery_exam_attempts` | Attempts for courseId-based mastery exams | `id`, `user_id`, `mastery_exam_id`, `score`, `total`, `percentage`, `completed_at` | references `users.id` and `mastery_exams.id` |
| `feedback` | User feedback inbox | `id`, `user_id`, `submitter_email`, `type`, `message`, `status`, `created_at` | references `users.id` |
| `custom_decks` | Scholar generated/custom source decks | `id`, `user_id`, `title`, `source_text`, `study_guide`, `status`, `tier`, `tools`, `exam_question_count`, `exam_timed`, `created_at` | references `users.id` |
| `custom_flashcards` | Generated custom flashcards | `id`, `deck_id`, `front`, `back`, `difficulty`, `card_order` | references `custom_decks.id` cascade delete |
| `custom_quiz_questions` | Generated custom quiz questions | `id`, `deck_id`, `question`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `question_order` | references `custom_decks.id` cascade delete |
| `custom_cloze_items` | Generated cloze items | `id`, `deck_id`, `sentence`, `answer`, `hint`, `item_order` | references `custom_decks.id` cascade delete |
| `client_error_rate_hits` | Global rate limit state for client error reports | `id`, `client_key`, `hit_at` | no app-content FK |
| `client_error_rate_warnings` | Tracks warning emission for client-error rate limiter | `client_key`, `warned_at` | no app-content FK |
| `admin_tokens` | MCP bearer token hashes | `id`, `user_id`, `token_hash`, `label`, `created_at`, `last_used_at` | references `users.id` |
| `oauth_clients` | MCP OAuth registered clients | `client_id`, `client_id_issued_at`, `redirect_uris_json`, `metadata_json`, `created_at` | none |
| `oauth_auth_codes` | MCP OAuth authorization codes | `code`, `client_id`, `redirect_uri`, `code_challenge`, `expires_at` | linked by client id string |
| `oauth_access_tokens` | MCP OAuth access tokens | `token`, `client_id`, `expires_at` | linked by client id string |
| `oauth_refresh_tokens` | MCP OAuth refresh tokens | `token`, `client_id`, `expires_at`, `current_access_token` | linked by client id string |
| `user_profiles` | Community profile/preferences | `user_id`, `display_name`, `profile_photo_url`, `current_role`, `institution`, `bio`, `interests`, `pref_suggest_connections`, `pref_networking_intros`, `pref_show_on_featured_work`, `pref_show_on_leaderboard`, `created_at`, `updated_at` | `user_id` references `users.id` cascade |
| `featured_work` | Community featured work submissions | `id`, `user_id`, `work_type`, `title`, `abstract`, `file_url`, `external_link`, `coauthors`, `venue`, `display_name`, `interest_tags`, `status`, `admin_note`, `created_at`, `reviewed_at`, `approved_at` | references `users.id` cascade |
| `community_notifications` | In-app notifications | `id`, `user_id`, `kind`, `title`, `body`, `href`, `read_at`, `created_at` | references `users.id` cascade |
| `connection_requests` | Double-opt-in connection requests | `id`, `requester_id`, `recipient_id`, `status`, `shared_tags`, `created_at`, `responded_at`, `intro_email_sent_at` | requester/recipient reference `users.id` cascade |
| `user_blocks` | Community block list | `id`, `blocker_id`, `blocked_id`, `created_at` | blocker/blocked reference `users.id` cascade |
| `connections_audit_log` | Admin audit trail for connection abuse review | `id`, `admin_user_id`, `action`, `target_request_id`, `reason`, `created_at` | target id is not FK-enforced in schema |

### Requested Tables Not Currently Present Under Those Names

- `domains`: not present. Closest equivalent: `courses` for first-class domains/courses, `topics.category` for legacy category/domain.
- `chapters`: not present. Closest equivalent: `topics`.
- `competencies`: not present.
- `questions`: not present as a generic table. Closest equivalent: `quiz_questions`.
- `answer_choices`: not present. Choices are denormalized columns `option_a` through `option_d`.
- `exams`: not present as generic table. Closest equivalents: `practice_exams`, `mastery_exams`.
- `user_progress`: not present under that name. Closest equivalent: `progress`, plus attempts tables.
- `bookmarks`: not present.
- `flags`: not present.
- `notes`: not present. Closest adjacent feature: `reflections` page, but no dedicated note table found in schema.
- `mastery_scores`: not present. Mastery state is derived from scores/attempts rather than stored.

---

## 4. Current User Flow

### Signup to Dashboard

1. User lands on `/`.
2. User clicks landing CTA; unsigned users route to `/sign-in` or `/sign-up`.
3. Clerk handles sign-in/sign-up in `sign-in.tsx` or `sign-up.tsx`.
4. After auth, Clerk fallback redirect sends user to `/dashboard`.
5. `RequireSignedIn` wraps protected app routes.
6. `ClerkTokenBridge` provides bearer token to generated API client and `authHeaders()`.
7. Dashboard loads `/api/dashboard/summary`.
8. If user profile does not exist, profile/entitlement flows auto-create a free user row.
9. User can also complete `/onboarding`, which posts to `/api/users/profile` and stores role, goal, degree, referral source, and onboarding completion.

### Dashboard to Study Content

1. From sidebar, user clicks `Courses` → `/topics`.
2. `/topics` calls `GET /api/topics`.
3. User selects a course/category in the left rail or searches lessons.
4. User clicks a lesson card → `/topics/:id`.
5. Topic detail calls `GET /api/topics/:id` and `GET /api/users/entitlements`.
6. Topic detail displays counts and four study-mode cards: Flashcards, Quiz, Study Guide, Practice Exam.

### Flashcards

1. User clicks Flashcards → `/topics/:id/flashcards`.
2. Frontend calls `GET /api/topics/:id/flashcards`.
3. Server requires Clerk auth and entitlement check.
4. Free user receives first 10 cards only; paid/admin receives all cards.
5. User flips cards in the UI.
6. No server-side item-level card completion/confidence tracking found.

### Quiz

1. User clicks Quiz → `/topics/:id/quiz`.
2. Frontend calls `GET /api/topics/:id/quizzes`.
3. Server blocks a free user who already has 1 completed quiz attempt.
4. User answers multiple-choice questions and sees explanations.
5. On completion, frontend records attempt with `POST /api/quiz-attempts`.
6. Server stores `score`, `total`, `topicId`, `userId`, and `completedAt`.

### Study Guide

1. User clicks Study Guide → `/topics/:id/study-guide`.
2. Frontend calls `GET /api/topics/:id/study-guide`.
3. Free users receive `402` and see a locked prompt.
4. Paid/admin users receive markdown guide content.
5. No server-side guide reading completion tracking found.

### Practice Exam

1. User clicks Practice Exam → `/topics/:id/exam`.
2. Frontend calls `GET /api/topics/:id/practice-exam?count=N`.
3. Server blocks free users who already completed 1 exam.
4. Server returns randomized linked questions, exam metadata, time limit, passing score, and available count.
5. User completes timed or untimed exam.
6. Frontend records attempt with `POST /api/exam-attempts`.
7. Server stores `score`, `total`, `topicId`, `userId`, and `completedAt`.

### Course Mastery

1. From `/topics`, user can trigger `/courses/:category/mastery-exam`.
2. Frontend/server checks `GET /api/courses/:category/mastery-status`.
3. User must score at least 90% on every lesson practice exam in that category to unlock.
4. Admin users bypass the prerequisite.
5. If unlocked, server creates a category-wide randomized exam from all quiz questions in the category.
6. Attempt posts to `POST /api/course-mastery-attempts`.

### EPPP Flow

1. User clicks EPPP Mastery System button in header/sidebar → `/eppp`.
2. User clicks Start Studying/View Progress → `/eppp/dashboard`.
3. EPPP dashboard calls `/api/dashboard/summary`, `/api/topics`, and per-category `/api/courses/:category/mastery-status`.
4. User can set local exam date.
5. User clicks recommended lessons → `/topics/:id`.
6. Current EPPP dashboard depends on whatever topic categories exist in the database; it is not yet hardwired to official EPPP domains. Claude reported that 20 gap-domain topics are live, but the frontend/domain dashboard still needs verification against those live categories.

### Analytics

1. User clicks Progress → `/progress`.
2. Progress page calls progress/topic APIs.
3. Dashboard summary provides total topics, topics studied/completed, quizzes/exams completed, streak, average score, recent topics, weak areas, and weekly activity.
4. No item-level analytics, competency-level analytics, readiness validity model, or missed-question center is currently present.

---

## 5. Missing Features Compared With PsychPro Mastery System Spec

### Fully Implemented or Substantially Implemented

- User accounts.
- Authenticated dashboard.
- Topic/course browser.
- Study guides for existing seeded topics.
- Flashcards for existing seeded topics.
- Quizzes with explanations for existing seeded topics.
- Practice exams for existing seeded topics.
- Basic progress tracking.
- Basic analytics dashboard.
- Free/paid entitlement gating.
- MCP content uploader.
- Brain Lab interactive visual feature.
- Study Lab learning tools.
- EPPP intro page and early readiness dashboard.

### Partially Implemented

- Domain architecture: exists as `topics.category` and newer `courses`, but official EPPP domain model is not fully wired.
- Chapters: topics can function as chapters, but no dedicated chapter table.
- Competency mapping: source content uses KN labels, but no competency table or question competency tags.
- Question bank: existing topic questions exist; Claude reports 20 EPPP gap-domain lessons live with approximately 624 quiz questions, but the local repo seed script has not loaded EPPP-specific questions and the remaining four Part 1 domain files are not present in this workspace.
- Rationales: quiz questions have one `explanation`; no separate correct/incorrect answer rationale model.
- Domain mastery exams: category-based and courseId-based systems exist; Claude reports Ethics has an auto-generated mastery exam, while other new course wrappers were still catching up.
- Analytics: basic scores/streaks/weak areas exist; no competency/difficulty/response-time analytics.
- Readiness score: displayed, but derived from lesson pass ratios, not validated EPPP readiness.
- Study planner: exam date exists locally; no automatic daily/weekly planner.
- Visual Learning Library: spec and Brain Lab exist; no full visual library.
- AI tutor: custom deck generation uses OpenAI; no EPPP tutor constrained to PsychPro content.
- Clinical cases: not loaded as a separate content type.
- Spaced repetition: local scheduler exists; no server-side review queue.

### Not Started or Not Found

- Dedicated `domains`, `chapters`, `competencies`, `answer_choices`, `bookmarks`, `flags`, `notes`, `mastery_scores` tables.
- Missed Question Center.
- Low-confidence tracking.
- Per-question user history.
- Response-time tracking.
- Difficulty-based adaptive engine.
- Full-length 225-question EPPP simulations.
- Clinical Integration Cases per domain.
- Statistics Center calculators.
- Ethics Center decision trees.
- Diagnostic algorithm library.
- Printable/high-resolution visual downloads.
- Offline mode.
- Native mobile experience beyond responsive web.
- Completion certificates/badges tied to EPPP domain completion.
- Leaderboard optional for EPPP specifically.

---

## 6. Mastery Engine Status

### Current Mastery Calculation

- Topic completion threshold: `COMPLETION_THRESHOLD = 70` in `progress.ts`; a topic is counted complete when `progress.score >= 70`.
- Legacy course mastery unlock: every topic in a category must have a practice exam attempt with exact score ratio at least 90%.
- Legacy course mastery pass: category mastery attempt passes at score `>= 90`.
- New courseId mastery unlock: every topic linked to a course must have `progress.score >= mastery_exams.unlock_threshold`, default 90.
- New courseId mastery state:
  - `locked`: prerequisites not met.
  - `not_started`: unlocked, no mastery attempt.
  - `in_progress`: attempted but below passing score.
  - `passed`: above passing score.
  - `mastered`: above mastery score.

### Current Readiness Calculation

- `/eppp/dashboard` computes readiness as the mean of passed/total ratios across current topic categories.
- A domain/category's passed count comes from category mastery status.
- This is a practical placeholder, not a psychometrically validated EPPP readiness model.

### Data Currently Tracked

- User profile/onboarding.
- Subscription status/admin state.
- Per-topic score and last accessed timestamp.
- Quiz attempt score/total/completion timestamp.
- Practice exam attempt score/total/completion timestamp.
- Course mastery attempts.
- Mastery exam attempts in the newer courseId system.
- Dashboard weekly activity from progress/quiz/exam timestamps.
- Custom deck content and generated custom study items.

### Data Not Yet Tracked

- Per-question attempts.
- Answer-choice selection history.
- Response time.
- Confidence rating.
- Bookmark state.
- Flag state.
- Personal notes tied to questions/chapters.
- Missed-question list.
- Spaced repetition due dates server-side.
- Competency/KN-level mastery.
- Difficulty-adjusted mastery.
- Readiness model inputs such as recency, volume, domain weights, confidence, and exam simulation performance.

---

## 7. Question Bank Status

### Live PsychPro Content Reported by Claude Connector

Status: user-provided Claude report says this content is already live in PsychPro. It has not been independently verified from this local repo clone.

- Number of live gap-domain courses/categories reported: 4.
- Number of live gap-domain lessons/topics reported: 20.
- Reported live topic IDs: 62-81.
- Number of live study guides reported: 20.
- Number of live flashcards reported: 1,000.
- Number of live quiz questions reported: approximately 624.
- Number of live rationales reported: approximately 624, assuming each quiz question includes an explanation/rationale field.
- Number of live clinical cases reported: 0 dedicated clinical-case records reported.
- Number of live practice exams reported: 20.
- Number of live course wrappers reported: 4, with async completion caveat.
- Course wrapper caveat: Ethics was reported fully formed with an auto-generated mastery exam; Growth/Lifespan, Cognitive-Affective, and Social/Cultural were reported as still catching up.

Reported live content by course:

| Course/category | Lessons | Topic IDs |
|---|---:|---|
| Ethics, Legal & Professional Issues | 6 | 62-67 |
| Growth & Lifespan Development | 5 | 68-72 |
| Cognitive-Affective Bases | 5 | 73-77 |
| Social & Cultural Bases | 4 | 78-81 |

Reported live lessons:

| Course/category | Lesson titles |
|---|---|
| Ethics, Legal & Professional Issues | APA Code; Confidentiality, Privilege, and Reporting; Informed Consent; Multiple Relationships and Boundaries; Decision-Making Models; Specialty Ethics |
| Growth & Lifespan Development | Foundational Theories; Attachment and Temperament; Middle Childhood and Adolescence; Adulthood; Family Systems |
| Cognitive-Affective Bases | Intelligence; Learning; Memory; Motivation and Emotion; Language and Cognition |
| Social & Cultural Bases | Social Cognition; Group Dynamics; Cultural Psychology; Diversity, Identity, and Oppression |

### Workspace Content Reported by Claude but Not Found Locally

Claude reported that four additional Part 1 domain Markdown files exist in a workspace location outside live PsychPro. A local search of `/Users/meganortiz/Documents/Claude/Projects/PsychPro` did not find these files.

- `EPPP_Part1_Domain1_Biological_Bases.md`: reported 4 lessons.
- `EPPP_Part1_Domain5_Assessment_Diagnosis.md`: reported 5 lessons.
- `EPPP_Part1_Domain6_Treatment_Supervision.md`: reported 5 lessons.
- `EPPP_Part1_Domain7_Research_Methods_Statistics.md`: reported 4 lessons.
- Reported total in those files: 18 study guides, 900 flashcards, approximately 550 quiz questions.

Recommended handling: locate or export these files before creating import scripts. They should be imported as the remaining live content set, not regenerated from the generic 71-KN starter seed unless the product owner explicitly chooses that path.

### Existing Seeded Neuroscience/Neuropsychology Content

- Number of domains/courses loaded: repo documentation says 39 topics across major categories; exact live category count depends on seeded database.
- Number of chapters/topics loaded: 39 existing neuroscience/neuropsychology topics per `replit.md`/`PUBLISHING.md`.
- Number of competencies loaded: 0 dedicated competency records found.
- Number of questions loaded: 935 quiz questions per repo documentation.
- Number of rationales loaded: 935 single-field explanations if seeded count matches documentation.
- Number of clinical cases loaded: 0 dedicated clinical-case content type found.
- Number of exams loaded: 39 practice exams per repo documentation.
- Number of practice exam question links: 738 per repo documentation.
- Number of flashcards loaded: 1,612 per repo documentation.

### EPPP Mastery Source Content Added in Repo

- Number of EPPP domains in source: 8.
- Number of EPPP chapters/KN topics in source: 71.
- Number of EPPP competencies in schema: 0 dedicated records.
- Number of EPPP study guide starters: 71 if `seed:eppp` is run successfully.
- Number of EPPP questions loaded from the repo seed script: 0 generated EPPP-specific quiz questions from new source content.
- Number of EPPP rationales loaded from the repo seed script: 0 generated EPPP-specific rationales from new source content.
- Number of EPPP clinical cases loaded: 0.
- Number of EPPP exams loaded: 0 from new EPPP source content.
- Reconciliation status: local source content and live connector content now need a merge plan before any production seed/import action.

---

## 8. Architecture Review

### Current Backend Architecture

- TypeScript monorepo using pnpm workspaces.
- Express 5 API in `artifacts/api-server`.
- Routes mounted under `/api` through `artifacts/api-server/src/routes/index.ts`.
- Drizzle ORM database package in `lib/db`.
- API schema/codegen package in `lib/api-spec`, `lib/api-client-react`, and `lib/api-zod`.
- OpenAI integration package for custom deck generation.
- Stripe integration for subscriptions.
- MCP route for admin content upload.

### Current Frontend Architecture

- React/Vite SPA in `artifacts/neuronotes`.
- Wouter routing.
- TanStack Query and generated API client.
- shadcn-style UI components under `components/ui`.
- Clerk provider wraps the app.
- AppLayout handles sidebar/navigation and admin/scholar-aware sections.
- Pages are route-level components in `src/pages`.

### Authentication System

- Clerk is the primary identity provider.
- Frontend sends Clerk bearer token through generated API client and direct `authHeaders()`.
- Backend uses `@clerk/express` middleware and `requireUserId`.
- Admin status is re-read from `users.is_admin`.
- MCP/admin token flow is separate from Clerk and uses `MCP_ADMIN_SECRET`, per-token bearer tokens, and OAuth support.

### Database Provider

- PostgreSQL with Drizzle ORM.
- Replit deployment expects `DATABASE_URL`.

### Storage Provider

- Object storage abstraction in `artifacts/api-server/src/lib/objectStorage.ts`.
- Storage routes: `POST /api/storage/uploads/request-url`, `GET /api/storage/public-objects/*`, `GET /api/storage/objects/*`.
- Used by profile photos/featured work/custom uploads depending on route.

---

## 9. Technical Debt

- Two course mastery systems coexist: category-based `course-mastery.ts` and courseId-based `mastery-exams.ts`.
- Frontend still routes to category-based mastery exams while backend has newer courseId routes.
- `topics.category` remains a denormalized shim during migration.
- EPPP readiness score is a placeholder mean of passed lesson ratios, not a validated readiness model.
- Exam date in `/eppp/dashboard` is localStorage-only, not saved to user profile.
- Study Lab spaced repetition is local/localStorage rather than server-side.
- No dedicated domains/chapters/competencies schema despite EPPP spec requiring those concepts.
- Answer choices are denormalized columns; cannot store per-answer rationales cleanly.
- Quiz explanations are single-field rationales; no correct-vs-incorrect rationale model.
- No bookmarks/flags/notes tables.
- No missed-question or low-confidence table.
- No item-level attempt tracking.
- No response-time tracking.
- No competency or difficulty analytics.
- `users.usage_count` and `/users/usage` remain as legacy no-op/counter compatibility.
- Some freemium copy references “Master” while docs also discuss Pro/Scholar; naming should be normalized.
- Existing `seed.ts` truncates child content tables and reseeds legacy content; safe by design but future content systems need careful separation.
- New `seed:eppp` script is not yet typechecked in this clone because `node_modules` is missing.
- `seed:eppp` should not be run against production until topic IDs 62-81 and the Claude-created course wrappers are exported and mapped, because it may create overlapping starter topics.
- The four Claude-reported Markdown source files for Biological Bases, Assessment/Diagnosis, Treatment/Supervision, and Research/Statistics were not found in this accessible workspace.
- EPPP source content is starter-level; not complete educational modules.
- Visual Learning Library has a spec but no schema/page.
- Brain Lab is frontend/static data; not linked to EPPP KN/domain metadata.
- Custom deck AI exists, but no PsychPro-content-grounded AI Tutor exists.
- MCP JSON payload cap is 1MB; adequate for guides, but large batch imports may need chunking.
- Route comments in `mastery-exams.ts` still include “NEW” and old mounting guidance, suggesting migration artifact.
- Documentation says “All 11 pages,” but frontend currently contains many more pages.
- Screenshots exist in assets but are not curated/mapped to current completed features.

---

## 10. Recommended Next Build Tasks

1. Export the live connector-created topics/course wrappers from PsychPro, including topic IDs 62-81, course/category names, study guide IDs, flashcard counts, quiz question counts, practice exam IDs, and mastery exam status.
2. Locate or export the four Claude-reported Markdown source files: Biological Bases, Assessment/Diagnosis, Treatment/Supervision, and Research/Statistics.
3. Build a content reconciliation map that decides which source owns each official EPPP Part 1 domain: existing neuroscience seed, Claude live connector content, Claude Markdown files, or new repo source files.
4. Pause production use of `seed:eppp`; refactor it into a staging-only or missing-content importer once live topic IDs and source files are mapped.
5. Decide final EPPP data architecture: keep current `courses/topics` model with KN metadata or add explicit `domains/chapters/competencies` tables.
6. Resolve mastery exam architecture by choosing category-based or courseId-based system, then migrate frontend/backend to one path.
7. Add competency tagging schema or metadata field so every EPPP lesson/question can map to official KN statements.
8. Extend question schema to support normalized answer choices and rationales for each incorrect option.
9. Build missed-question infrastructure: per-question attempts, incorrect history, flags, bookmarks, notes, and low-confidence markers.
10. Replace placeholder readiness with a real model using domain weights, practice exam performance, recency, difficulty, completion volume, and confidence.
