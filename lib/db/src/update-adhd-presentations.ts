import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

const OLD = `**Three Presentations:**
- **ADHD-PI** (Predominantly Inattentive): formerly ADD
- **ADHD-PHI** (Predominantly Hyperactive-Impulsive): more common in young children
- **ADHD-C** (Combined): most common overall`;

const NEW = `**Three Presentations:**
- Predominantly Inattentive
- Predominantly Hyperactive-Impulsive
- Combined

**Severity:**
- Mild — few symptoms beyond the diagnostic threshold; minor functional impairment
- Moderate — symptoms or functional impairment between mild and severe
- Severe — many symptoms beyond the threshold, several particularly severe symptoms, or marked functional impairment`;

async function run() {
  const result = await db.select({ content: studyGuidesTable.content })
    .from(studyGuidesTable).where(eq(studyGuidesTable.id, 19));
  let content = result[0].content;

  if (!content.includes(OLD)) {
    console.error("❌ Target text not found.");
    process.exit(1);
  }

  content = content.replace(OLD, NEW);
  await db.update(studyGuidesTable).set({ content }).where(eq(studyGuidesTable.id, 19));
  console.log("✅ ADHD presentations & severity updated.");
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
