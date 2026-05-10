#!/usr/bin/env node
import { Client } from "pg";
import { mkdir, writeFile, rm } from "node:fs/promises";
import { join } from "node:path";

const OUT_DIR = ".local/exports/topics";

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const pad = (n) => String(n).padStart(3, "0");

const client = new Client({ connectionString: process.env.DATABASE_URL });
await client.connect();

await rm(OUT_DIR, { recursive: true, force: true });
await mkdir(OUT_DIR, { recursive: true });

const { rows: topics } = await client.query(
  "SELECT id, name, category, description FROM topics ORDER BY category, id"
);

const indexLines = ["# Topic Content Index", "", `_${topics.length} topics. One markdown file per topic in this folder._`, ""];
const byCat = new Map();
for (const t of topics) {
  if (!byCat.has(t.category)) byCat.set(t.category, []);
  byCat.get(t.category).push(t);
}

for (const [cat, list] of byCat) {
  indexLines.push(`## ${cat}`, "");
  for (const t of list) {
    const file = `${pad(t.id)}-${slugify(t.name)}.md`;
    indexLines.push(`- [${t.name}](./${file}) — id ${t.id}`);
  }
  indexLines.push("");
}

await writeFile(join(OUT_DIR, "INDEX.md"), indexLines.join("\n"));

for (const t of topics) {
  const [{ rows: fcs }, { rows: qzs }, { rows: sgs }, { rows: exs }] = await Promise.all([
    client.query(
      "SELECT id, question, answer, difficulty FROM flashcards WHERE topic_id=$1 ORDER BY id",
      [t.id]
    ),
    client.query(
      "SELECT id, question, option_a, option_b, option_c, option_d, correct_answer, explanation, exam_only FROM quiz_questions WHERE topic_id=$1 ORDER BY id",
      [t.id]
    ),
    client.query(
      "SELECT id, title, content FROM study_guides WHERE topic_id=$1 ORDER BY id",
      [t.id]
    ),
    client.query(
      "SELECT id, title, time_limit, passing_score FROM practice_exams WHERE topic_id=$1 ORDER BY id",
      [t.id]
    ),
  ]);

  const out = [];
  out.push(`# ${t.name}`);
  out.push("");
  out.push(`- **Topic ID:** ${t.id}`);
  out.push(`- **Category:** ${t.category}`);
  out.push(`- **Flashcards:** ${fcs.length}`);
  out.push(`- **Quiz questions:** ${qzs.length} (${qzs.filter((q) => q.exam_only).length} exam-only)`);
  out.push(`- **Study guides:** ${sgs.length}`);
  out.push(`- **Practice exams:** ${exs.length}`);
  out.push("");
  out.push("## Description");
  out.push("");
  out.push(t.description || "_(none)_");
  out.push("");

  out.push("## Study Guides");
  out.push("");
  if (sgs.length === 0) out.push("_(none)_");
  for (const g of sgs) {
    out.push(`### ${g.title}  \n_(study_guide id ${g.id})_`);
    out.push("");
    out.push(g.content);
    out.push("");
  }

  out.push("## Flashcards");
  out.push("");
  if (fcs.length === 0) out.push("_(none)_");
  for (const f of fcs) {
    out.push(`### Flashcard ${f.id} _(${f.difficulty})_`);
    out.push(`- **Q:** ${f.question}`);
    out.push(`- **A:** ${f.answer}`);
    out.push("");
  }

  out.push("## Quiz Questions");
  out.push("");
  if (qzs.length === 0) out.push("_(none)_");
  for (const q of qzs) {
    out.push(`### Quiz ${q.id}${q.exam_only ? " _(exam-only)_" : ""}`);
    out.push(`**Q:** ${q.question}`);
    out.push("");
    out.push(`- A) ${q.option_a}`);
    out.push(`- B) ${q.option_b}`);
    out.push(`- C) ${q.option_c}`);
    out.push(`- D) ${q.option_d}`);
    out.push("");
    out.push(`**Correct:** ${q.correct_answer}`);
    out.push("");
    out.push(`**Explanation:** ${q.explanation}`);
    out.push("");
  }

  out.push("## Practice Exams");
  out.push("");
  if (exs.length === 0) out.push("_(none)_");
  for (const e of exs) {
    out.push(`### ${e.title} _(exam id ${e.id}, ${e.time_limit ?? "—"}s limit, pass ${e.passing_score}%)_`);
    out.push("");
  }

  const file = `${pad(t.id)}-${slugify(t.name)}.md`;
  await writeFile(join(OUT_DIR, file), out.join("\n"));
}

await client.end();
console.log(`Exported ${topics.length} topics → ${OUT_DIR}/`);
