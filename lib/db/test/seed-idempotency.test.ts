import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eq, inArray, sql } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db, pool } from "../src/index";
import {
  usersTable,
  progressTable,
  topicsTable,
  flashcardsTable,
  quizQuestionsTable,
  studyGuidesTable,
  practiceExamsTable,
  practiceExamQuestionsTable,
  quizAttemptsTable,
  examAttemptsTable,
} from "../src/schema";

const __filename = fileURLToPath(import.meta.url);
const PKG_DIR = path.resolve(path.dirname(__filename), "..");
const SEED_PATH = path.join(PKG_DIR, "src", "seed.ts");

const TEST_USER_ID = `seed-idempotency-test-${Date.now()}-${Math.random()
  .toString(36)
  .slice(2, 8)}`;
const TEST_USER_EMAIL = `${TEST_USER_ID}@example.test`;

class AssertionError extends Error {}

function assert(cond: unknown, message: string): asserts cond {
  if (!cond) throw new AssertionError(message);
}

function runSeed(label: string): void {
  console.log(`\n[seed-idempotency] running seed (${label})...`);
  const result = spawnSync("npx", ["tsx", SEED_PATH], {
    cwd: PKG_DIR,
    stdio: ["ignore", "pipe", "pipe"],
    encoding: "utf8",
    env: process.env,
  });
  if (result.status !== 0) {
    process.stderr.write(result.stdout ?? "");
    process.stderr.write(result.stderr ?? "");
    throw new Error(
      `seed.ts (${label}) exited with status ${result.status}`,
    );
  }
  console.log(`[seed-idempotency] seed (${label}) OK`);
}

async function tableCount(table: PgTable): Promise<number> {
  const rows = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(table);
  return Number(rows[0]?.n ?? 0);
}

async function cleanup(): Promise<void> {
  // Order matters: child tables first.
  await db
    .delete(quizAttemptsTable)
    .where(eq(quizAttemptsTable.userId, TEST_USER_ID));
  await db
    .delete(examAttemptsTable)
    .where(eq(examAttemptsTable.userId, TEST_USER_ID));
  await db.delete(progressTable).where(eq(progressTable.userId, TEST_USER_ID));
  await db.delete(usersTable).where(eq(usersTable.id, TEST_USER_ID));
}

async function main() {
  let failed = false;
  try {
    // 1. First seed run — establish a known baseline so the rest of the test
    //    can rely on topics existing regardless of the database's prior state.
    runSeed("baseline");

    // 2. Pick three real topics from the seeded data, looked up by their
    //    well-known seed names rather than by ordinal id, so the test still
    //    targets seeded rows (not unrelated topics created by ad-hoc scripts)
    //    on a heavily pre-populated database. Remember their (id, name) pairs
    //    so we can verify the mapping survives a re-seed.
    const SEEDED_TOPIC_NAMES = [
      "Neuropsychology Overview",
      "Psychopharmacology",
      "Neurocognitive Disorders",
    ];
    const topics = await db
      .select({ id: topicsTable.id, name: topicsTable.name })
      .from(topicsTable)
      .where(inArray(topicsTable.name, SEEDED_TOPIC_NAMES));
    assert(
      topics.length === SEEDED_TOPIC_NAMES.length,
      `expected the seed to have produced topics ${JSON.stringify(
        SEEDED_TOPIC_NAMES,
      )}, only found ${JSON.stringify(topics.map((t) => t.name))}`,
    );
    const topicNameById = new Map<number, string>(
      topics.map((t) => [t.id, t.name]),
    );

    // 3. Insert a fake user with a few progress rows + one quiz attempt and
    //    one exam attempt. These mimic real user data that must survive a
    //    re-seed.
    await db.insert(usersTable).values({
      id: TEST_USER_ID,
      email: TEST_USER_EMAIL,
      role: "student",
    });

    const progressSeed = topics.map((t, i) => ({
      userId: TEST_USER_ID,
      topicId: t.id,
      score: 40 + i * 7,
    }));
    await db.insert(progressTable).values(progressSeed);

    await db.insert(quizAttemptsTable).values({
      userId: TEST_USER_ID,
      topicId: topics[0].id,
      score: 8,
      total: 10,
    });

    await db.insert(examAttemptsTable).values({
      userId: TEST_USER_ID,
      topicId: topics[0].id,
      score: 13,
      total: 20,
    });

    // 4. Re-run seed. This is the action under test: a destructive seed
    //    (e.g. TRUNCATE ... CASCADE on topics, or a non-upsert insert) would
    //    wipe or invalidate the rows we just inserted.
    runSeed("re-run");

    // 5. The user must still exist.
    const userAfter = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, TEST_USER_ID));
    assert(
      userAfter.length === 1,
      `expected fake user to survive re-seed, found ${userAfter.length} rows`,
    );

    // 6. Progress rows must still exist with the same scores AND still point
    //    at the same topic names (i.e. the topic id→name mapping is stable
    //    across re-seeds — the central guarantee Task #7 introduced).
    const progressAfter = await db
      .select()
      .from(progressTable)
      .where(eq(progressTable.userId, TEST_USER_ID));
    assert(
      progressAfter.length === progressSeed.length,
      `expected ${progressSeed.length} progress rows after re-seed, got ${progressAfter.length}`,
    );

    const expectedScoreByTopic = new Map(
      progressSeed.map((p) => [p.topicId, p.score]),
    );
    for (const row of progressAfter) {
      const expectedScore = expectedScoreByTopic.get(row.topicId);
      assert(
        expectedScore !== undefined,
        `progress row for topic ${row.topicId} unexpected — was the topic id reassigned?`,
      );
      assert(
        row.score === expectedScore,
        `progress score for topic ${row.topicId} changed: expected ${expectedScore}, got ${row.score}`,
      );
    }

    const topicsAfter = await db
      .select({ id: topicsTable.id, name: topicsTable.name })
      .from(topicsTable);
    const nameByIdAfter = new Map(topicsAfter.map((t) => [t.id, t.name]));
    for (const [id, originalName] of topicNameById.entries()) {
      const currentName = nameByIdAfter.get(id);
      assert(
        currentName === originalName,
        `topic id ${id} now points at "${currentName}" (was "${originalName}") — re-seed reassigned topic ids and would have orphaned user progress`,
      );
    }

    // 7. Quiz + exam attempts must still exist.
    const quizAttemptsAfter = await db
      .select()
      .from(quizAttemptsTable)
      .where(eq(quizAttemptsTable.userId, TEST_USER_ID));
    assert(
      quizAttemptsAfter.length === 1 && quizAttemptsAfter[0].score === 8,
      `quiz_attempts row did not survive re-seed (found ${quizAttemptsAfter.length} rows)`,
    );

    const examAttemptsAfter = await db
      .select()
      .from(examAttemptsTable)
      .where(eq(examAttemptsTable.userId, TEST_USER_ID));
    assert(
      examAttemptsAfter.length === 1 && examAttemptsAfter[0].score === 13,
      `exam_attempts row did not survive re-seed (found ${examAttemptsAfter.length} rows)`,
    );

    // 8. Content tables must be repopulated (not silently emptied).
    const flashcardCount = await tableCount(flashcardsTable);
    const quizQuestionCount = await tableCount(quizQuestionsTable);
    const studyGuideCount = await tableCount(studyGuidesTable);
    const practiceExamCount = await tableCount(practiceExamsTable);
    const practiceExamQuestionCount = await tableCount(
      practiceExamQuestionsTable,
    );
    assert(flashcardCount > 0, "flashcards table is empty after seed");
    assert(quizQuestionCount > 0, "quiz_questions table is empty after seed");
    assert(studyGuideCount > 0, "study_guides table is empty after seed");
    assert(practiceExamCount > 0, "practice_exams table is empty after seed");
    assert(
      practiceExamQuestionCount > 0,
      "practice_exam_questions table is empty after seed",
    );

    console.log(
      "\n✅ seed-idempotency: user data preserved, content tables repopulated.",
    );
  } catch (err) {
    failed = true;
    console.error("\n❌ seed-idempotency FAILED:");
    console.error(err instanceof Error ? err.stack ?? err.message : err);
  } finally {
    try {
      await cleanup();
    } catch (cleanupErr) {
      console.error("warning: cleanup failed:", cleanupErr);
    }
    await pool.end();
  }
  process.exit(failed ? 1 : 0);
}

main();
