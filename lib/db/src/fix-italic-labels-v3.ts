import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

async function fix() {
  console.log("Final italic cleanup...");

  // ENS - remove *simultaneously* italic emphasis
  const ensResult = await db.select({ content: studyGuidesTable.content })
    .from(studyGuidesTable).where(eq(studyGuidesTable.id, 27));
  let ens = ensResult[0].content;
  ens = ens.split("*simultaneously*").join("simultaneously");
  await db.update(studyGuidesTable).set({ content: ens }).where(eq(studyGuidesTable.id, 27));
  console.log("  ✓ ENS fixed");

  // CNS - convert *Modality: ...* italic labels to clean headings
  const cnsResult = await db.select({ content: studyGuidesTable.content })
    .from(studyGuidesTable).where(eq(studyGuidesTable.id, 28));
  let cns = cnsResult[0].content;

  cns = cns.replace(
    "*Modality: Fine touch, vibration, proprioception, two-point discrimination*",
    "Carries: fine touch, vibration, proprioception, two-point discrimination"
  );
  cns = cns.replace(
    "*Modality: Pain, temperature, crude touch*",
    "Carries: pain, temperature, crude touch"
  );

  await db.update(studyGuidesTable).set({ content: cns }).where(eq(studyGuidesTable.id, 28));
  console.log("  ✓ CNS fixed");

  console.log("✅ Final italic cleanup complete. All guides clean.");
}

fix().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
