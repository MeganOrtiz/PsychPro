import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

async function fix() {
  console.log("Fixing remaining italic patterns...");

  // ---- CNS Guide (id=28) ----
  const cnsResult = await db.select({ content: studyGuidesTable.content })
    .from(studyGuidesTable).where(eq(studyGuidesTable.id, 28));
  let cns = cnsResult[0].content;

  cns = cns.replace(
    "*Regions without BBB:* The circumventricular organs",
    "**Regions without a blood-brain barrier:** The circumventricular organs"
  );
  cns = cns.replace(
    "*Lesion:* Ipsilateral loss of fine touch and proprioception below the lesion (e.g., dorsal column lesion in MS, B12 deficiency)",
    "A lesion here produces ipsilateral loss of fine touch and proprioception below the lesion level — the pattern seen with dorsal column damage in MS and B12 deficiency."
  );
  cns = cns.replace(
    "*Lesion:* Contralateral loss of pain and temperature starting 1-2 levels below the lesion (e.g., hemisection of spinal cord = Brown-Séquard syndrome)",
    "A lesion here produces contralateral loss of pain and temperature beginning 1-2 levels below the injury — the pattern seen in Brown-Séquard hemisection."
  );

  await db.update(studyGuidesTable).set({ content: cns }).where(eq(studyGuidesTable.id, 28));
  console.log("  ✓ CNS remaining italics fixed");

  // ---- PNS Guide (id=29) ----
  const pnsResult = await db.select({ content: studyGuidesTable.content })
    .from(studyGuidesTable).where(eq(studyGuidesTable.id, 29));
  let pns = pnsResult[0].content;

  pns = pns.replace(
    "*Adrenal medulla exception:* Preganglionic fiber synapses directly on chromaffin cells",
    "**Adrenal medulla exception:** The preganglionic fiber synapses directly on chromaffin cells"
  );

  await db.update(studyGuidesTable).set({ content: pns }).where(eq(studyGuidesTable.id, 29));
  console.log("  ✓ PNS remaining italics fixed");

  // ---- ENS Guide (id=27) ----
  const ensResult = await db.select({ content: studyGuidesTable.content })
    .from(studyGuidesTable).where(eq(studyGuidesTable.id, 27));
  let ens = ensResult[0].content;

  ens = ens.replace(
    "but the ICC-set rhythm determines the *timing* template.",
    "but the ICC-set rhythm determines the timing template."
  );

  await db.update(studyGuidesTable).set({ content: ens }).where(eq(studyGuidesTable.id, 27));
  console.log("  ✓ ENS remaining italics fixed");

  // ---- Neurocognitive Guide (id=33) ----
  const ncdResult = await db.select({ content: studyGuidesTable.content })
    .from(studyGuidesTable).where(eq(studyGuidesTable.id, 33));
  let ncd = ncdResult[0].content;

  ncd = ncd.replace(
    "*Probable DLB* = 2+ core features. *Possible DLB* = 1 core feature.",
    "**Probable DLB** requires 2 or more core features. **Possible DLB** requires 1 core feature."
  );

  ncd = ncd.replace(
    "**1. Gait disturbance** *(most prominent; typically earliest feature)*",
    "**1. Gait disturbance** — the most prominent and typically earliest feature"
  );
  ncd = ncd.replace(
    "**2. Urinary incontinence** *(typically precedes frank incontinence with urgency)*",
    "**2. Urinary incontinence** — urgency and frequency typically precede frank incontinence"
  );
  ncd = ncd.replace(
    "**3. Cognitive impairment** *(frontal-subcortical pattern)*",
    "**3. Cognitive impairment** — frontal-subcortical pattern"
  );

  await db.update(studyGuidesTable).set({ content: ncd }).where(eq(studyGuidesTable.id, 33));
  console.log("  ✓ Neurocognitive remaining italics fixed");

  console.log("✅ All italic cleanup complete.");
}

fix().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
