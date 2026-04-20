import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

async function run() {
  const result = await db.select({ content: studyGuidesTable.content })
    .from(studyGuidesTable).where(eq(studyGuidesTable.id, 19));
  let content = result[0].content;

  // Convert all h4 headings (####) in the dyslexia subtypes to bold inline subheadings
  content = content.replace(/^#### (.+)$/gm, "**$1**");

  await db.update(studyGuidesTable).set({ content }).where(eq(studyGuidesTable.id, 19));
  console.log("✅ Dyslexia subtype headings cleaned up.");
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
