import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

// Fix all italic label patterns across multiple guides
async function fixItalicLabels() {
  console.log("Fixing italic label patterns across all guides...");

  // ---- CNS Guide (id=28) ----
  const cnsResult = await db.select({ content: studyGuidesTable.content })
    .from(studyGuidesTable).where(eq(studyGuidesTable.id, 28));
  let cns = cnsResult[0].content;

  // Meningeal layer italic qualifiers
  cns = cns.replace("**Dura Mater** *(outermost)*", "**Dura Mater** — outermost layer");
  cns = cns.replace("**Arachnoid Mater** *(middle)*", "**Arachnoid Mater** — middle layer");
  cns = cns.replace("**Pia Mater** *(innermost)*", "**Pia Mater** — innermost layer");

  // Glial cell italic subtitles
  cns = cns.replace("**Astrocytes** — *the structural and metabolic backbone*", "**Astrocytes**");
  cns = cns.replace("**Oligodendrocytes** — *the CNS myelin builders*", "**Oligodendrocytes**");
  cns = cns.replace("**Microglia** — *the CNS immune sentinels*", "**Microglia**");
  cns = cns.replace("**Ependymal Cells** — *lining and production*", "**Ependymal Cells**");

  // Clinical correlation italic labels in bullet points
  cns = cns.replace(
    "- *Clinical correlation:* In multiple sclerosis",
    "- In multiple sclerosis"
  );
  cns = cns.replace(
    "- *Clinical correlation:* Chronically activated (dysregulated) microglia",
    "- Chronically activated (dysregulated) microglia"
  );

  // Hypothalamus section — italic structure names → bold
  const hypothalamusItalics = [
    ["*Suprachiasmatic Nucleus (SCN)*", "**Suprachiasmatic Nucleus (SCN)**"],
    ["*Preoptic Area / VLPO*", "**Preoptic Area / VLPO**"],
    ["*Supraoptic and Paraventricular Nuclei (PVN)*", "**Supraoptic and Paraventricular Nuclei (PVN)**"],
    ["*Ventromedial Nucleus (VMH)*", "**Ventromedial Nucleus (VMH)**"],
    ["*Arcuate Nucleus*", "**Arcuate Nucleus**"],
    ["*Lateral Hypothalamic Area (LHA) / Orexin neurons*", "**Lateral Hypothalamic Area / Orexin neurons**"],
    ["*Mammillary Bodies*", "**Mammillary Bodies**"],
    ["*Pineal Gland*", "**Pineal Gland**"],
    ["*Habenula*", "**Habenula**"],
    // Thalamus section
    ["*VPL (Ventral Posterolateral)*", "**VPL (Ventral Posterolateral)**"],
    ["*VPM (Ventral Posteromedial)*", "**VPM (Ventral Posteromedial)**"],
    ["*LGN (Lateral Geniculate Nucleus)*", "**LGN (Lateral Geniculate Nucleus)**"],
    ["*MGN (Medial Geniculate Nucleus)*", "**MGN (Medial Geniculate Nucleus)**"],
    ["*VA/VL (Ventral Anterior/Ventral Lateral)*", "**VA/VL (Ventral Anterior/Ventral Lateral)**"],
    ["*Mediodorsal (MD)*", "**Mediodorsal Nucleus (MD)**"],
    ["*Anterior Nuclear Group*", "**Anterior Nuclear Group**"],
    ["*Pulvinar*", "**Pulvinar**"],
    ["*Thalamic Reticular Nucleus (TRN)*", "**Thalamic Reticular Nucleus (TRN)**"],
  ];
  for (const [from, to] of hypothalamusItalics) {
    cns = cns.split(from).join(to);
  }

  await db.update(studyGuidesTable).set({ content: cns }).where(eq(studyGuidesTable.id, 28));
  console.log("  ✓ CNS guide italic labels fixed (id=28)");

  // ---- Neurocognitive Guide (id=33) ----
  const ncdResult = await db.select({ content: studyGuidesTable.content })
    .from(studyGuidesTable).where(eq(studyGuidesTable.id, 33));
  let ncd = ncdResult[0].content;

  // *Key distinction:* → rewrite as a clean bullet point without italic label
  ncd = ncd.replace(
    "- *Key distinction:* Encoding deficit (poor recognition) vs. subcortical retrieval deficit (recognition preserved)",
    "- Encoding deficit: both free recall AND recognition are impaired (information was never stored). This distinguishes AD from subcortical dementias where recognition is relatively preserved."
  );
  ncd = ncd.replace(
    "- *Key distinction:* Retrieval deficit (recognition preserved) vs. AD's encoding failure",
    "- Retrieval deficit pattern: recognition is relatively preserved; cued recall improves performance. This distinguishes VaD from AD, where both free recall and recognition are impaired."
  );

  // DLB neuropsychological profile
  ncd = ncd.replace(
    "- *Key distinction:* Retrieval deficit (recognition preserved) vs. AD's encoding failure (both impaired)",
    "- Retrieval deficit pattern: recognition relatively preserved. This distinguishes DLB from AD, where encoding failure means both recall and recognition are impaired."
  );

  await db.update(studyGuidesTable).set({ content: ncd }).where(eq(studyGuidesTable.id, 33));
  console.log("  ✓ Neurocognitive guide italic labels fixed (id=33)");

  console.log("✅ All italic label fixes applied.");
}

fixItalicLabels().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
