/**
 * Wipe development user data so we ship a clean prod without test cruft.
 *
 * Deletes everything that fans out from `users` (progress, quiz attempts,
 * exam attempts, feedback, custom decks + children, connections, user
 * profiles, notifications, billing IDs) and finally the user rows
 * themselves. Content tables (topics, flashcards, quiz_questions,
 * study_guides, practice_exams) are left untouched — re-seed those with
 * `pnpm --filter @workspace/db run seed` if needed.
 *
 * Gated on `CONFIRM_RESET_DEV_USERS=yes` so a stray invocation can't
 * destroy production data.
 *
 * Usage:
 *   CONFIRM_RESET_DEV_USERS=yes \
 *     pnpm --filter @workspace/scripts run reset-dev-users
 */
import { db } from "@workspace/db";
import { sql } from "drizzle-orm";

async function main(): Promise<void> {
  if (process.env.CONFIRM_RESET_DEV_USERS !== "yes") {
    console.error(
      "Refusing to run. Set CONFIRM_RESET_DEV_USERS=yes to confirm you intend to delete all user data.",
    );
    process.exit(1);
  }
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set.");
    process.exit(1);
  }

  console.log("Wiping dev user data…");

  // TRUNCATE … RESTART IDENTITY CASCADE walks every FK that points at
  // `users` and clears those rows too. We name every user-owned table that
  // currently exists in the schema so the cascade surface is auditable —
  // when a new user-owned table is added to `lib/db/src/schema/index.ts`,
  // add it to this list. Content tables (topics, flashcards,
  // quiz_questions, study_guides, practice_exams,
  // practice_exam_questions, admin_tokens, client_error_rate_*) do not
  // reference `users` and stay intact.
  await db.execute(sql`
    TRUNCATE TABLE
      feedback,
      community_notifications,
      connection_requests,
      user_blocks,
      connections_audit_log,
      featured_work,
      user_profiles,
      custom_cloze_items,
      custom_flashcards,
      custom_quiz_questions,
      custom_decks,
      exam_attempts,
      quiz_attempts,
      progress,
      users
    RESTART IDENTITY CASCADE
  `);

  console.log("Done. All user-owned tables truncated.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
