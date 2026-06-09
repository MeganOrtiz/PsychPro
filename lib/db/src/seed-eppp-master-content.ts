import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { eq, sql } from "drizzle-orm";
import { db } from "./index";
import { coursesTable, studyGuidesTable, topicsTable } from "./schema";

type DomainBlock = {
  title: string;
  weight: string | null;
  chapters: ChapterBlock[];
};

type ChapterBlock = {
  kn: string;
  title: string;
  content: string;
};

const SOURCE_CANDIDATES = [
  path.resolve(process.cwd(), "../../content/eppp-mastery-domain-chapters.md"),
  path.resolve(process.cwd(), "content/eppp-mastery-domain-chapters.md"),
  path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../../content/eppp-mastery-domain-chapters.md"),
];

function parseEpppContent(markdown: string): DomainBlock[] {
  const lines = markdown.split(/\r?\n/);
  const domains: DomainBlock[] = [];
  let currentDomain: DomainBlock | null = null;
  let currentChapter: ChapterBlock | null = null;
  let chapterLines: string[] = [];

  function flushChapter() {
    if (!currentDomain || !currentChapter) return;
    currentChapter.content = chapterLines.join("\n").trim();
    currentDomain.chapters.push(currentChapter);
    currentChapter = null;
    chapterLines = [];
  }

  for (const line of lines) {
    const domainMatch = line.match(/^## (Domain [IVX]+: .+)$/);
    if (domainMatch) {
      flushChapter();
      currentDomain = { title: domainMatch[1], weight: null, chapters: [] };
      domains.push(currentDomain);
      continue;
    }

    if (!currentDomain) continue;

    const weightMatch = line.match(/^Weight:\s*(.+)$/);
    if (weightMatch && !currentChapter) {
      currentDomain.weight = weightMatch[1].trim();
      continue;
    }

    const chapterMatch = line.match(/^### Chapter (KN\d+): (.+)$/);
    if (chapterMatch) {
      flushChapter();
      currentChapter = {
        kn: chapterMatch[1],
        title: chapterMatch[2].trim(),
        content: "",
      };
      chapterLines = [line];
      continue;
    }

    if (currentChapter) chapterLines.push(line);
  }

  flushChapter();
  return domains;
}

async function loadSourceMarkdown(): Promise<string> {
  const failures: string[] = [];
  for (const candidate of SOURCE_CANDIDATES) {
    try {
      return await readFile(candidate, "utf8");
    } catch (err) {
      failures.push(`${candidate}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  throw new Error(`Unable to find EPPP source content.\n${failures.join("\n")}`);
}

function topicName(kn: string, title: string): string {
  return `${kn}: ${title}`;
}

function topicDescription(domain: DomainBlock, chapter: ChapterBlock): string {
  return `${chapter.kn} chapter for ${domain.title}. Covers ${chapter.title.toLowerCase()} within the EPPP Mastery System.`;
}

function studyGuideMarkdown(domain: DomainBlock, chapter: ChapterBlock): string {
  return [
    `# ${chapter.kn}: ${chapter.title}`,
    "",
    `**Domain:** ${domain.title}`,
    domain.weight ? `**EPPP Part 1 Weight:** ${domain.weight}` : "",
    "",
    chapter.content.replace(/^### Chapter KN\d+: .+\n?/, "").trim(),
    "",
    "---",
    "",
    "This starter study guide is part of the PsychPro EPPP Mastery System. Expand using `content/eppp-expanded-chapter-model.md` before treating it as a final learning module.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function seedEpppMasterContent() {
  const markdown = await loadSourceMarkdown();
  const domains = parseEpppContent(markdown);
  const chapterCount = domains.reduce((sum, d) => sum + d.chapters.length, 0);

  if (domains.length !== 8 || chapterCount !== 71) {
    throw new Error(`Expected 8 domains and 71 chapters; parsed ${domains.length} domains and ${chapterCount} chapters.`);
  }

  await db.transaction(async (tx) => {
    for (const [domainIndex, domain] of domains.entries()) {
      const [course] = await tx
        .insert(coursesTable)
        .values({
          name: domain.title,
          description: domain.weight
            ? `EPPP Part 1 domain (${domain.weight} of exam content): ${domain.title}.`
            : `EPPP Part 1 domain: ${domain.title}.`,
          displayOrder: domainIndex + 100,
          iconAsset: "eppp",
        })
        .onConflictDoUpdate({
          target: coursesTable.name,
          set: {
            description: sql`excluded.description`,
            displayOrder: sql`excluded.display_order`,
            iconAsset: sql`excluded.icon_asset`,
          },
        })
        .returning();

      for (const chapter of domain.chapters) {
        const name = topicName(chapter.kn, chapter.title);
        const [topic] = await tx
          .insert(topicsTable)
          .values({
            name,
            category: domain.title,
            description: topicDescription(domain, chapter),
            courseId: course.id,
          })
          .onConflictDoUpdate({
            target: topicsTable.name,
            set: {
              category: sql`excluded.category`,
              description: sql`excluded.description`,
              courseId: sql`excluded.course_id`,
            },
          })
          .returning();

        const guideTitle = `${chapter.kn}: ${chapter.title}`;
        const guideContent = studyGuideMarkdown(domain, chapter);
        const [existingGuide] = await tx.select().from(studyGuidesTable).where(eq(studyGuidesTable.topicId, topic.id));

        if (existingGuide) {
          await tx
            .update(studyGuidesTable)
            .set({ title: guideTitle, content: guideContent })
            .where(eq(studyGuidesTable.id, existingGuide.id));
        } else {
          await tx.insert(studyGuidesTable).values({
            topicId: topic.id,
            title: guideTitle,
            content: guideContent,
          });
        }
      }
    }
  });

  console.log(`Seeded EPPP Mastery content: ${domains.length} domains, ${chapterCount} KN chapters/study guides.`);
}

seedEpppMasterContent().catch((err) => {
  console.error("Error seeding EPPP Mastery content:", err);
  process.exit(1);
});
