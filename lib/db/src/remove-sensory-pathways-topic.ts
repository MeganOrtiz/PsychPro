import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  topicsTable, flashcardsTable, quizQuestionsTable,
  studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable,
} from "./schema";

async function cleanup() {
  const TOPIC_ID = 4; // Sensory Pathways

  console.log(`Removing Sensory Pathways topic (id=${TOPIC_ID})...`);

  // Find practice exam IDs for this topic
  const exams = await db.select({ id: practiceExamsTable.id }).from(practiceExamsTable).where(eq(practiceExamsTable.topicId, TOPIC_ID));
  for (const exam of exams) {
    await db.delete(practiceExamQuestionsTable).where(eq(practiceExamQuestionsTable.examId, exam.id));
    console.log(`  ✓ Deleted exam questions for exam ${exam.id}`);
  }
  await db.delete(practiceExamsTable).where(eq(practiceExamsTable.topicId, TOPIC_ID));
  console.log("  ✓ Deleted practice exams");

  await db.delete(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, TOPIC_ID));
  console.log("  ✓ Deleted quiz questions");

  await db.delete(flashcardsTable).where(eq(flashcardsTable.topicId, TOPIC_ID));
  console.log("  ✓ Deleted flashcards");

  await db.delete(studyGuidesTable).where(eq(studyGuidesTable.topicId, TOPIC_ID));
  console.log("  ✓ Deleted study guide");

  await db.delete(topicsTable).where(eq(topicsTable.id, TOPIC_ID));
  console.log("  ✓ Deleted topic row");

  console.log("\n✅ Sensory Pathways topic fully removed.");
}

cleanup().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
