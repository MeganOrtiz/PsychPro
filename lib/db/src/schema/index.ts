import { pgTable, text, serial, integer, timestamp, boolean, bigserial, index, primaryKey } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email"),
  role: text("role"),
  goal: text("goal"),
  degree: text("degree"),
  referralSource: text("referral_source"),
  subscriptionStatus: text("subscription_status").notNull().default("free"),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  // EPPP Mastery Suite is a SEPARATE access level from Master/Scholar. A single
  // expiry date covers all three purchase types: $99/mo subscription (set to the
  // period end, bumped on renewal), $499 one-time (now + 6 months), and $799
  // one-time (now + 12 months). Access = isAdmin || (epppAccessUntil > now).
  epppAccessUntil: timestamp("eppp_access_until"),
  // The $99/mo EPPP subscription id (distinct from stripeSubscriptionId, which
  // tracks the Master/Scholar sub). Null for one-time buyers / non-EPPP users.
  epppSubscriptionId: text("eppp_subscription_id"),
  onboardingComplete: boolean("onboarding_complete").notNull().default(false),
  onboardingCompletedAt: timestamp("onboarding_completed_at"),
  // In-depth onboarding answers (Task #145). learnerRole/studyFocus/epppInterest
  // are single-select strings; learningGoals is a JSON-encoded string[]; the
  // selectedTier/selectedProduct capture the plan the user chose on the tier
  // step (free|pro|scholar|eppp + a human-readable product label).
  learnerRole: text("learner_role"),
  learningGoals: text("learning_goals"),
  studyFocus: text("study_focus"),
  epppInterest: text("eppp_interest"),
  selectedTier: text("selected_tier"),
  selectedProduct: text("selected_product"),
  usageCount: integer("usage_count").notNull().default(0),
  progressScore: integer("progress_score").notNull().default(0),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({ createdAt: true });
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;

export const topicsTable = pgTable("topics", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  // Links a topic ("lesson") to its first-class course. Added alongside the
  // courseId-based Course Mastery Exams system. `category` is kept as a
  // denormalized shim during migration — see coursesTable below.
  courseId: integer("course_id").references(() => coursesTable.id),
}, (t) => [
  index("topics_course_idx").on(t.courseId),
]);

export const insertTopicSchema = createInsertSchema(topicsTable).omit({ id: true });
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type Topic = typeof topicsTable.$inferSelect;

export const flashcardsTable = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => topicsTable.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
}, (t) => [
  index("flashcards_topic_idx").on(t.topicId),
]);

export const insertFlashcardSchema = createInsertSchema(flashcardsTable).omit({ id: true });
export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type Flashcard = typeof flashcardsTable.$inferSelect;

export const quizQuestionsTable = pgTable("quiz_questions", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => topicsTable.id),
  question: text("question").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation").notNull(),
  examOnly: boolean("exam_only").notNull().default(false),
}, (t) => [
  index("quiz_questions_topic_idx").on(t.topicId),
]);

export const insertQuizQuestionSchema = createInsertSchema(quizQuestionsTable).omit({ id: true });
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestionsTable.$inferSelect;

export const studyGuidesTable = pgTable("study_guides", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => topicsTable.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
}, (t) => [
  index("study_guides_topic_idx").on(t.topicId),
]);

export const insertStudyGuideSchema = createInsertSchema(studyGuidesTable).omit({ id: true });
export type InsertStudyGuide = z.infer<typeof insertStudyGuideSchema>;
export type StudyGuide = typeof studyGuidesTable.$inferSelect;

export const progressTable = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id),
  topicId: integer("topic_id").notNull().references(() => topicsTable.id),
  score: integer("score").notNull().default(0),
  lastAccessed: timestamp("last_accessed").notNull().defaultNow(),
}, (t) => [
  index("progress_user_topic_idx").on(t.userId, t.topicId),
  index("progress_topic_idx").on(t.topicId),
]);

export const insertProgressSchema = createInsertSchema(progressTable).omit({ id: true, lastAccessed: true });
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progressTable.$inferSelect;

// Tracks the first time a free-tier user accessed a topic's detail page.
// The free plan allows full, unmetered access to a small number of distinct
// (Removed `freeTopicAccessTable` and its `FreeTopicAccess` type — the
//  "N topics fully unlocked" free-tier model was replaced with per-content
//  caps (10 flashcards/topic + 1 quiz total + 1 exam total). The DB table
//  was dropped. See api-server/src/lib/entitlements.ts for the new model.)

export const practiceExamsTable = pgTable("practice_exams", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => topicsTable.id),
  title: text("title").notNull(),
  timeLimit: integer("time_limit").notNull().default(600),
  passingScore: integer("passing_score").notNull().default(70),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  index("practice_exams_topic_idx").on(t.topicId),
]);

export const insertPracticeExamSchema = createInsertSchema(practiceExamsTable).omit({ id: true, createdAt: true });
export type InsertPracticeExam = z.infer<typeof insertPracticeExamSchema>;
export type PracticeExam = typeof practiceExamsTable.$inferSelect;

export const practiceExamQuestionsTable = pgTable("practice_exam_questions", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull().references(() => practiceExamsTable.id),
  questionId: integer("question_id").notNull().references(() => quizQuestionsTable.id),
  questionOrder: integer("question_order").notNull().default(0),
});

export const insertPracticeExamQuestionSchema = createInsertSchema(practiceExamQuestionsTable).omit({ id: true });
export type InsertPracticeExamQuestion = z.infer<typeof insertPracticeExamQuestionSchema>;
export type PracticeExamQuestion = typeof practiceExamQuestionsTable.$inferSelect;

export const feedbackTable = pgTable("feedback", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id),
  submitterEmail: text("submitter_email"),
  type: text("type").notNull().default("general"),
  message: text("message").notNull(),
  status: text("status").notNull().default("unread"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertFeedbackSchema = createInsertSchema(feedbackTable).omit({ id: true, createdAt: true });
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type Feedback = typeof feedbackTable.$inferSelect;

export const customDecksTable = pgTable("custom_decks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id),
  title: text("title").notNull(),
  sourceText: text("source_text").notNull(),
  studyGuide: text("study_guide"),
  status: text("status").notNull().default("processing"),
  tier: text("tier").notNull().default("standard"),
  tools: text("tools").array().notNull().default(sql`ARRAY[]::text[]`),
  examQuestionCount: integer("exam_question_count").notNull().default(15),
  examTimed: boolean("exam_timed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [
  index("custom_decks_user_idx").on(t.userId),
]);

export const insertCustomDeckSchema = createInsertSchema(customDecksTable).omit({ id: true, createdAt: true });
export type InsertCustomDeck = z.infer<typeof insertCustomDeckSchema>;
export type CustomDeck = typeof customDecksTable.$inferSelect;

export const customFlashcardsTable = pgTable("custom_flashcards", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id").notNull().references(() => customDecksTable.id, { onDelete: "cascade" }),
  front: text("front").notNull(),
  back: text("back").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
  cardOrder: integer("card_order").notNull().default(0),
});

export const insertCustomFlashcardSchema = createInsertSchema(customFlashcardsTable).omit({ id: true });
export type InsertCustomFlashcard = z.infer<typeof insertCustomFlashcardSchema>;
export type CustomFlashcard = typeof customFlashcardsTable.$inferSelect;

export const customQuizQuestionsTable = pgTable("custom_quiz_questions", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id").notNull().references(() => customDecksTable.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  optionA: text("option_a").notNull(),
  optionB: text("option_b").notNull(),
  optionC: text("option_c").notNull(),
  optionD: text("option_d").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  explanation: text("explanation"),
  questionOrder: integer("question_order").notNull().default(0),
});

export const insertCustomQuizQuestionSchema = createInsertSchema(customQuizQuestionsTable).omit({ id: true });
export type InsertCustomQuizQuestion = z.infer<typeof insertCustomQuizQuestionSchema>;
export type CustomQuizQuestion = typeof customQuizQuestionsTable.$inferSelect;

export const customClozeItemsTable = pgTable("custom_cloze_items", {
  id: serial("id").primaryKey(),
  deckId: integer("deck_id").notNull().references(() => customDecksTable.id, { onDelete: "cascade" }),
  sentence: text("sentence").notNull(),
  answer: text("answer").notNull(),
  hint: text("hint"),
  itemOrder: integer("item_order").notNull().default(0),
});

export const insertCustomClozeItemSchema = createInsertSchema(customClozeItemsTable).omit({ id: true });
export type InsertCustomClozeItem = z.infer<typeof insertCustomClozeItemSchema>;
export type CustomClozeItem = typeof customClozeItemsTable.$inferSelect;

export const quizAttemptsTable = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id),
  topicId: integer("topic_id").notNull().references(() => topicsTable.id),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  // IDs of the quiz_questions the user answered incorrectly in this attempt.
  // Nullable for legacy rows recorded before per-question tracking existed.
  // Powers the EPPP "Missed Questions" review tab.
  missedQuestionIds: integer("missed_question_ids").array(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
}, (t) => [
  index("quiz_attempts_user_topic_idx").on(t.userId, t.topicId),
  index("quiz_attempts_topic_idx").on(t.topicId),
]);

export const insertQuizAttemptSchema = createInsertSchema(quizAttemptsTable).omit({ id: true, completedAt: true });
export type InsertQuizAttempt = z.infer<typeof insertQuizAttemptSchema>;
export type QuizAttempt = typeof quizAttemptsTable.$inferSelect;

export const examAttemptsTable = pgTable("exam_attempts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id),
  topicId: integer("topic_id").notNull().references(() => topicsTable.id),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  // IDs of the quiz_questions the user answered incorrectly in this attempt.
  // Nullable for legacy rows recorded before per-question tracking existed.
  // Powers the EPPP "Missed Questions" review tab.
  missedQuestionIds: integer("missed_question_ids").array(),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
}, (t) => [
  index("exam_attempts_user_topic_idx").on(t.userId, t.topicId),
  index("exam_attempts_topic_idx").on(t.topicId),
]);

export const insertExamAttemptSchema = createInsertSchema(examAttemptsTable).omit({ id: true, completedAt: true });
export type InsertExamAttempt = z.infer<typeof insertExamAttemptSchema>;
export type ExamAttempt = typeof examAttemptsTable.$inferSelect;

// Capstone "Course Mastery Exam" attempts. A "course" is the set of topics
// sharing a `topics.category` value — there is no separate courses table — so
// these attempts key off the category string rather than a topicId. score is
// the percentage (0–100); passed reflects the 90% mastery threshold at the
// time of the attempt.
export const courseMasteryAttemptsTable = pgTable("course_mastery_attempts", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id),
  category: text("category").notNull(),
  score: integer("score").notNull(),
  correct: integer("correct").notNull(),
  total: integer("total").notNull(),
  passed: boolean("passed").notNull().default(false),
  completedAt: timestamp("completed_at").notNull().defaultNow(),
});

export const insertCourseMasteryAttemptSchema = createInsertSchema(courseMasteryAttemptsTable).omit({ id: true, completedAt: true });
export type InsertCourseMasteryAttempt = z.infer<typeof insertCourseMasteryAttemptSchema>;
export type CourseMasteryAttempt = typeof courseMasteryAttemptsTable.$inferSelect;

export const clientErrorRateHitsTable = pgTable(
  "client_error_rate_hits",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    clientKey: text("client_key").notNull(),
    hitAt: timestamp("hit_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("client_error_rate_hits_key_time_idx").on(table.clientKey, table.hitAt),
    index("client_error_rate_hits_hit_at_idx").on(table.hitAt),
  ],
);

export type ClientErrorRateHit = typeof clientErrorRateHitsTable.$inferSelect;

export const clientErrorRateWarningsTable = pgTable(
  "client_error_rate_warnings",
  {
    clientKey: text("client_key").primaryKey(),
    warnedAt: timestamp("warned_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("client_error_rate_warnings_warned_at_idx").on(table.warnedAt)],
);

export type ClientErrorRateWarning = typeof clientErrorRateWarningsTable.$inferSelect;

export const adminTokensTable = pgTable("admin_tokens", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id),
  tokenHash: text("token_hash").notNull().unique(),
  label: text("label").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
});

export type AdminToken = typeof adminTokensTable.$inferSelect;

// =============================================================================
// OAuth 2.1 + PKCE (RFC 7591 dynamic client registration) for the MCP route.
//
// Persisted to Postgres so registered clients and issued tokens survive
// server restarts and horizontal scaling (Autoscale). The in-memory version
// previously caused "invalid_client / Unknown client_id" errors whenever a
// new instance handled `/authorize` after `/register` landed on a sibling.
// =============================================================================

export const oauthClientsTable = pgTable("oauth_clients", {
  clientId: text("client_id").primaryKey(),
  clientIdIssuedAt: integer("client_id_issued_at").notNull(),
  redirectUrisJson: text("redirect_uris_json").notNull(),
  metadataJson: text("metadata_json").notNull().default("{}"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
export type OauthClient = typeof oauthClientsTable.$inferSelect;

export const oauthAuthCodesTable = pgTable(
  "oauth_auth_codes",
  {
    code: text("code").primaryKey(),
    clientId: text("client_id").notNull(),
    redirectUri: text("redirect_uri").notNull(),
    codeChallenge: text("code_challenge").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("oauth_auth_codes_expires_idx").on(table.expiresAt)],
);
export type OauthAuthCode = typeof oauthAuthCodesTable.$inferSelect;

export const oauthAccessTokensTable = pgTable(
  "oauth_access_tokens",
  {
    token: text("token").primaryKey(),
    clientId: text("client_id").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  },
  (table) => [index("oauth_access_tokens_expires_idx").on(table.expiresAt)],
);
export type OauthAccessToken = typeof oauthAccessTokensTable.$inferSelect;

export const oauthRefreshTokensTable = pgTable(
  "oauth_refresh_tokens",
  {
    token: text("token").primaryKey(),
    clientId: text("client_id").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    currentAccessToken: text("current_access_token"),
  },
  (table) => [index("oauth_refresh_tokens_expires_idx").on(table.expiresAt)],
);
export type OauthRefreshToken = typeof oauthRefreshTokensTable.$inferSelect;

// =============================================================================
// Community: user profiles & connect preferences (task #65)
//
// Foundation for the Community surface. Backs the Profile page and exposes
// the controlled interests taxonomy as a single source of truth reusable by
// Featured Work (#66) and Connections (#67).
// =============================================================================

export {
  PROFILE_ROLES,
  INTERESTS_TAXONOMY,
  INTEREST_TAGS,
  INTEREST_TAGS_SET,
  MAX_INTERESTS,
  MAX_BIO_LENGTH,
  MAX_DISPLAY_NAME_LENGTH,
  MAX_INSTITUTION_LENGTH,
  WORK_TYPES,
  WORK_TYPE_VALUES,
  WORK_TYPE_SET,
  FEATURED_WORK_STATUSES,
  MAX_FEATURED_TITLE_LENGTH,
  MIN_FEATURED_ABSTRACT_LENGTH,
  MAX_FEATURED_ABSTRACT_LENGTH,
  MAX_FEATURED_COAUTHORS_LENGTH,
  MAX_FEATURED_VENUE_LENGTH,
  MAX_FEATURED_INTEREST_TAGS,
  MIN_FEATURED_INTEREST_TAGS,
  MAX_FEATURED_FILE_BYTES,
  MAX_FEATURED_ADMIN_NOTE_LENGTH,
  FEATURED_WORK_CONSENT_TEXT,
  CONNECTION_REQUEST_STATUSES,
  CONNECTION_REQUESTS_PER_WEEK,
  CONNECTIONS_SUGGESTIONS_PAGE_SIZE,
  CONNECTION_SHARED_TAGS_HIGHLIGHTED,
  CONNECTION_BIO_PREVIEW_LENGTH,
} from "@workspace/community";
export type { ProfileRole, WorkType, FeaturedWorkStatus, ConnectionRequestStatus } from "@workspace/community";


export const userProfilesTable = pgTable("user_profiles", {
  userId: text("user_id")
    .primaryKey()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  profilePhotoUrl: text("profile_photo_url"),
  currentRole: text("current_role"),
  institution: text("institution"),
  bio: text("bio"),
  // JSON-encoded string[] of taxonomy tags (kept simple — no array column to
  // avoid a custom JSON column type in this schema file).
  interests: text("interests").notNull().default("[]"),
  prefSuggestConnections: boolean("pref_suggest_connections")
    .notNull()
    .default(false),
  prefNetworkingIntros: boolean("pref_networking_intros")
    .notNull()
    .default(false),
  prefShowOnFeaturedWork: boolean("pref_show_on_featured_work")
    .notNull()
    .default(true),
  prefShowOnLeaderboard: boolean("pref_show_on_leaderboard")
    .notNull()
    .default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type UserProfile = typeof userProfilesTable.$inferSelect;

// =============================================================================
// Community: Featured Work (task #66)
// =============================================================================

export const featuredWorkTable = pgTable(
  "featured_work",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    workType: text("work_type").notNull(),
    title: text("title").notNull(),
    abstract: text("abstract").notNull(),
    fileUrl: text("file_url"),
    externalLink: text("external_link"),
    coauthors: text("coauthors"),
    venue: text("venue"),
    displayName: text("display_name").notNull(),
    // JSON-encoded string[] of taxonomy tags (kept simple — matches the
    // user_profiles interests column convention).
    interestTags: text("interest_tags").notNull().default("[]"),
    status: text("status").notNull().default("pending"),
    adminNote: text("admin_note"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    approvedAt: timestamp("approved_at", { withTimezone: true }),
  },
  (table) => [
    index("featured_work_status_created_idx").on(table.status, table.createdAt),
    index("featured_work_user_idx").on(table.userId),
  ],
);

export type FeaturedWork = typeof featuredWorkTable.$inferSelect;

// In-app notification rows. Generic enough that the Connections task can
// reuse the same table for connection-request notifications.
export const notificationsTable = pgTable(
  "community_notifications",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    title: text("title").notNull(),
    body: text("body"),
    href: text("href"),
    readAt: timestamp("read_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("community_notifications_user_created_idx").on(table.userId, table.createdAt),
  ],
);

export type CommunityNotification = typeof notificationsTable.$inferSelect;

// =============================================================================
// Community: Connections (task #67)
//
// `connection_requests` stores the lifecycle of a double-opt-in intro. The
// unique partial index on (requester_id, recipient_id) WHERE status='pending'
// makes duplicate pending requests impossible at the DB level (created via
// raw SQL since drizzle-kit does not yet model partial indexes natively).
//
// `user_blocks` is a one-way block list. If (blocker, blocked) exists then
// `blocked` will never appear in `blocker`'s suggestions and any request
// `blocked` sends to `blocker` is silently rejected.
//
// `connections_audit_log` records every "Investigate abuse" reveal so the
// privacy contract spelled out in task-67 is verifiable.
// =============================================================================

export const connectionRequestsTable = pgTable(
  "connection_requests",
  {
    id: serial("id").primaryKey(),
    requesterId: text("requester_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    recipientId: text("recipient_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    status: text("status").notNull().default("pending"),
    // JSON-encoded string[] snapshot of overlapping tags at request time so
    // the recipient always sees the tags that motivated the introduction,
    // even if either user later edits their interests.
    sharedTags: text("shared_tags").notNull().default("[]"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    respondedAt: timestamp("responded_at", { withTimezone: true }),
    introEmailSentAt: timestamp("intro_email_sent_at", { withTimezone: true }),
  },
  (table) => [
    index("connection_requests_requester_idx").on(table.requesterId, table.status),
    index("connection_requests_recipient_idx").on(table.recipientId, table.status),
  ],
);

export type ConnectionRequest = typeof connectionRequestsTable.$inferSelect;

export const userBlocksTable = pgTable(
  "user_blocks",
  {
    id: serial("id").primaryKey(),
    blockerId: text("blocker_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    blockedId: text("blocked_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("user_blocks_blocker_idx").on(table.blockerId),
    index("user_blocks_blocked_idx").on(table.blockedId),
  ],
);

export type UserBlock = typeof userBlocksTable.$inferSelect;

export const connectionsAuditLogTable = pgTable(
  "connections_audit_log",
  {
    id: serial("id").primaryKey(),
    adminUserId: text("admin_user_id").notNull(),
    action: text("action").notNull(),
    targetRequestId: integer("target_request_id"),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    index("connections_audit_admin_idx").on(table.adminUserId, table.createdAt),
  ],
);

export type ConnectionsAuditLog = typeof connectionsAuditLogTable.$inferSelect;

// =============================================================================
// Course Mastery Exams (courseId-based system)
//
// Promotes the `topics.category` string to a first-class `courses` entity and
// adds one capstone "Mastery Exam" per course. This is a PARALLEL system to
// the older `courseMasteryAttemptsTable` (which keys off the category string);
// both coexist while the frontend is migrated in separate, later work.
// =============================================================================

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  displayOrder: integer("display_order").notNull().default(0),
  iconAsset: text("icon_asset"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Course = typeof coursesTable.$inferSelect;

// One mastery exam per course. Thresholds are configurable per-exam so an
// individual course can be tuned without a code change.
export const masteryExamsTable = pgTable("mastery_exams", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id")
    .notNull()
    .unique()
    .references(() => coursesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  questionCount: integer("question_count").notNull().default(75),
  timeLimitMinutes: integer("time_limit_minutes").notNull().default(120),
  passingScore: integer("passing_score").notNull().default(70),
  masteryScore: integer("mastery_score").notNull().default(90),
  // Lesson-level practice-exam score required to unlock this mastery exam.
  unlockThreshold: integer("unlock_threshold").notNull().default(90),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type MasteryExam = typeof masteryExamsTable.$inferSelect;

// Many-to-many between mastery exams and quiz questions. Mastery-only
// integrative questions live in quiz_questions with examOnly=true and are
// linked here exclusively (never appear in topic quizzes / practice exams).
export const masteryExamQuestionsTable = pgTable(
  "mastery_exam_questions",
  {
    masteryExamId: integer("mastery_exam_id")
      .notNull()
      .references(() => masteryExamsTable.id, { onDelete: "cascade" }),
    questionId: integer("question_id")
      .notNull()
      .references(() => quizQuestionsTable.id, { onDelete: "cascade" }),
    questionOrder: integer("question_order").notNull().default(0),
  },
  (t) => [
    primaryKey({ columns: [t.masteryExamId, t.questionId] }),
    index("mastery_exam_questions_exam_idx").on(t.masteryExamId, t.questionOrder),
  ],
);

export type MasteryExamQuestion = typeof masteryExamQuestionsTable.$inferSelect;

// One row per completed attempt. Best-score-wins is computed at query time.
export const masteryExamAttemptsTable = pgTable(
  "mastery_exam_attempts",
  {
    id: serial("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    masteryExamId: integer("mastery_exam_id")
      .notNull()
      .references(() => masteryExamsTable.id, { onDelete: "cascade" }),
    score: integer("score").notNull(), // raw correct count
    total: integer("total").notNull(), // total questions served
    percentage: integer("percentage").notNull(), // pre-computed for fast best-score queries
    completedAt: timestamp("completed_at").notNull().defaultNow(),
  },
  (t) => [
    index("mastery_exam_attempts_user_exam_idx").on(t.userId, t.masteryExamId),
    index("mastery_exam_attempts_user_best_idx").on(t.userId, t.percentage),
  ],
);

export type MasteryExamAttempt = typeof masteryExamAttemptsTable.$inferSelect;
