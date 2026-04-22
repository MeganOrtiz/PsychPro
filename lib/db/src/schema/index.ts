import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
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
  onboardingComplete: boolean("onboarding_complete").notNull().default(false),
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
  name: text("name").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
});

export const insertTopicSchema = createInsertSchema(topicsTable).omit({ id: true });
export type InsertTopic = z.infer<typeof insertTopicSchema>;
export type Topic = typeof topicsTable.$inferSelect;

export const flashcardsTable = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => topicsTable.id),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  difficulty: text("difficulty").notNull().default("medium"),
});

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
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestionsTable).omit({ id: true });
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type QuizQuestion = typeof quizQuestionsTable.$inferSelect;

export const studyGuidesTable = pgTable("study_guides", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => topicsTable.id),
  title: text("title").notNull(),
  content: text("content").notNull(),
});

export const insertStudyGuideSchema = createInsertSchema(studyGuidesTable).omit({ id: true });
export type InsertStudyGuide = z.infer<typeof insertStudyGuideSchema>;
export type StudyGuide = typeof studyGuidesTable.$inferSelect;

export const progressTable = pgTable("progress", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull().references(() => usersTable.id),
  topicId: integer("topic_id").notNull().references(() => topicsTable.id),
  score: integer("score").notNull().default(0),
  lastAccessed: timestamp("last_accessed").notNull().defaultNow(),
});

export const insertProgressSchema = createInsertSchema(progressTable).omit({ id: true, lastAccessed: true });
export type InsertProgress = z.infer<typeof insertProgressSchema>;
export type Progress = typeof progressTable.$inferSelect;

export const practiceExamsTable = pgTable("practice_exams", {
  id: serial("id").primaryKey(),
  topicId: integer("topic_id").notNull().references(() => topicsTable.id),
  title: text("title").notNull(),
  timeLimit: integer("time_limit").notNull().default(600),
  passingScore: integer("passing_score").notNull().default(70),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

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
  examQuestionCount: integer("exam_question_count").notNull().default(15),
  examTimed: boolean("exam_timed").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

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
