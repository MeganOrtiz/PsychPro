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
