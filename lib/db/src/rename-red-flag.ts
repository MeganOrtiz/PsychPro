import { db } from "./index";
import { studyGuidesTable } from "./schema";
import { eq } from "drizzle-orm";

type Edit = { id: number; find: string; replace: string; label: string };

const edits: Edit[] = [
  {
    id: 33,
    label: "Topic 33 — PSP falls (diagnostic clue, not a safety issue)",
    find: "Falls in the first 1-2 years of a parkinsonian syndrome are a red flag for PSP vs. PD (where falls typically emerge years later).",
    replace:
      "Falls in the first 1-2 years of a parkinsonian syndrome are an important distinguishing feature of PSP vs. PD (where falls typically emerge years later).",
  },
  {
    id: 10,
    label: "Topic 10 — depression suicide assessment",
    find: "**Red flag:** Always assess for suicidal ideation, plan, intent, and access to means.",
    replace:
      "**Safety alert:** Always assess for suicidal ideation, plan, intent, and access to means.",
  },
  {
    id: 10,
    label: "Topic 10 — late-onset anxiety workup",
    find: "**Red flag:** New-onset anxiety in a previously calm older adult warrants medical workup",
    replace:
      "**Safety alert:** New-onset anxiety in a previously calm older adult warrants medical workup",
  },
  {
    id: 10,
    label: "Topic 10 — BDD suicide risk",
    find: "**Red flag — BDD:** has one of the highest suicide rates in psychiatry.",
    replace:
      "**Safety alert — BDD:** has one of the highest suicide rates in psychiatry.",
  },
  {
    id: 10,
    label: "Topic 10 — anorexia refeeding",
    find: "**Red flag — anorexia:** Severe or rapid weight loss requires medical stabilization",
    replace:
      "**Safety alert — anorexia:** Severe or rapid weight loss requires medical stabilization",
  },
  {
    id: 10,
    label: "Topic 10 — bulimia electrolytes",
    find: "**Red flag — bulimia:** Severe purging can cause hypokalemia",
    replace:
      "**Safety alert — bulimia:** Severe purging can cause hypokalemia",
  },
  {
    id: 10,
    label: "Topic 10 — mandatory reporting",
    find: "**Red flag:** Any indication that a child is currently being abused triggers **mandatory reporting**",
    replace:
      "**Safety alert:** Any indication that a child is currently being abused triggers **mandatory reporting**",
  },
  {
    id: 10,
    label: "Topic 10 — laryngeal dystonia",
    find: "**Red flag — laryngeal dystonia:** Can compromise the airway",
    replace:
      "**Safety alert — laryngeal dystonia:** Can compromise the airway",
  },
];

async function main() {
  const byId = new Map<number, string>();

  for (const { id } of edits) {
    if (byId.has(id)) continue;
    const [row] = await db
      .select({ content: studyGuidesTable.content })
      .from(studyGuidesTable)
      .where(eq(studyGuidesTable.id, id));
    if (!row) throw new Error(`Study guide id=${id} not found`);
    byId.set(id, row.content);
  }

  for (const { id, find, replace, label } of edits) {
    const current = byId.get(id)!;
    if (!current.includes(find)) {
      throw new Error(`❌ pattern not found in id=${id}: ${label}`);
    }
    byId.set(id, current.replace(find, replace));
    console.log(`✓ id=${id}  ${label}`);
  }

  for (const [id, content] of byId) {
    await db
      .update(studyGuidesTable)
      .set({ content })
      .where(eq(studyGuidesTable.id, id));
  }

  console.log(`\n✅ Updated ${byId.size} study guide(s).`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
