import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

const GUIDE_IDS = [27, 28, 29, 33];

function normalize(content: string): string {
  let c = content;

  // 1. Strip the leading `# Title — Study Guide` line plus any blank lines and `---` that follow it.
  c = c.replace(/^\s*#\s+[^\n]*\n+(?:---\s*\n+)?/, "");

  // 2. Strip numbered prefixes from headings:
  //    `## 1. Overview: Foo` -> `## Overview: Foo`
  //    `### 3.1 Mechanoreceptors` -> `### Mechanoreceptors`
  //    Trailing dot after the number is optional.
  c = c.replace(/^(#{1,6})\s+\d+(?:\.\d+)?\.?\s+/gm, "$1 ");

  // 3. Strip leading emoji/warning glyphs from headings.
  //    Matches one or more leading symbols (⚠ ⚡ 🔑 🧠 🧩 📚 📋 ⭐ etc) and trims following space.
  c = c.replace(/^(#{1,6})\s+([\u26A0\u26A1\u2B50\u2705\u26D4\u2757\u2728]|\p{Extended_Pictographic})+\s*/gmu, "$1 ");

  // 4. Strip standalone horizontal-rule separator lines (`---` on its own line),
  //    collapsing the surrounding blank lines down to a single blank line.
  c = c.replace(/\n\s*\n---\s*\n\s*\n/g, "\n\n");
  // Also handle leading/trailing edge cases
  c = c.replace(/^---\s*\n+/gm, "");

  // 5. Collapse any 3+ consecutive newlines down to exactly 2 (one blank line)
  c = c.replace(/\n{3,}/g, "\n\n");

  return c.trimStart();
}

async function run() {
  for (const id of GUIDE_IDS) {
    const [row] = await db.select({ content: studyGuidesTable.content })
      .from(studyGuidesTable).where(eq(studyGuidesTable.id, id));
    const before = row.content;
    const after = normalize(before);
    await db.update(studyGuidesTable).set({ content: after }).where(eq(studyGuidesTable.id, id));
    console.log(`  ✓ Guide ${id} normalized (${before.length} → ${after.length} chars)`);
  }
  console.log("✅ All four guides normalized to Cell Bio / Sensory style.");
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
