import { Router, type Request, type Response, type NextFunction } from "express";
import multer from "multer";
import { db } from "@workspace/db";
import {
  usersTable,
  customDecksTable,
  customFlashcardsTable,
  customQuizQuestionsTable,
  customClozeItemsTable,
} from "@workspace/db";
import { eq, desc, and, gte, count } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { parseIntParam } from "../lib/params";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024, fields: 20, parts: 22 },
});

const MAX_CONCURRENT_JOBS_PER_USER = 2;
const MAX_DECKS_PER_DAY = 10;

function getUserId(req: Request): string | null {
  return getAuth(req).userId ?? null;
}

const PAID_STATUSES = ["active", "trialing", "pro", "scholar"];

async function getUser(userId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  return user ?? null;
}

async function requireScholar(req: Request, res: Response, next: NextFunction): Promise<void> {
  const userId = getUserId(req);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const user = await getUser(userId);
  if (!user || user.subscriptionStatus !== "scholar") {
    res.status(403).json({ error: "Scholar subscription required" });
    return;
  }
  (req as Request & { scholarUser: typeof user }).scholarUser = user;
  next();
}

async function extractTextFromBuffer(buffer: Buffer, mimetype: string): Promise<string> {
  if (mimetype === "application/pdf" || mimetype.includes("pdf")) {
    const pdfParse = (await import("pdf-parse")).default;
    const result = await pdfParse(buffer);
    return result.text;
  }
  if (
    mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimetype.includes("docx") ||
    mimetype.includes("wordprocessingml")
  ) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  return buffer.toString("utf-8");
}

function buildSystemPrompt(sourceText: string, aiMode: "strict" | "enhance"): string {
  if (aiMode === "enhance") {
    return `You are an expert neuroscience and neuropsychology study tool generator. Your primary job is to create study materials based on the provided source text. Use the source text as your foundation and primary reference. You may also:
- Add clarifying examples that help illustrate concepts from the source
- Fill in gaps where the notes are incomplete or shorthand, using accurate neuroscience/neuropsychology knowledge
- Provide richer explanations and context where helpful
- Correct any obvious factual errors in the source with accurate information

Your goal is to make the study materials as useful and comprehensive as possible for the student.

SOURCE TEXT:
---
${sourceText.slice(0, 28000)}
---

Respond ONLY with valid JSON as specified in each request. No markdown, no explanations, just JSON.`;
  }

  return `You are a study tool generator. Your ONLY job is to create study materials derived STRICTLY from the provided source text below. You must NOT add any information, facts, concepts, or details that are not explicitly present in the source text. Every flashcard, question, and piece of content must be directly supported by the source text.

SOURCE TEXT:
---
${sourceText.slice(0, 28000)}
---

Respond ONLY with valid JSON as specified in each request. No markdown, no explanations, just JSON.`;
}

async function generateFlashcards(sourceText: string, aiMode: "strict" | "enhance", cardCount: number, signal?: AbortSignal): Promise<Array<{ front: string; back: string; difficulty: string }>> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: buildSystemPrompt(sourceText, aiMode) },
      {
        role: "user",
        content: `Generate exactly ${cardCount} flashcards from the source text. Each flashcard must have a "front" (question/term) and "back" (answer/definition). Set "difficulty" to "easy", "medium", or "hard" based on the concept complexity. Aim for a mix of difficulties.

Respond with a JSON object: { "flashcards": [ { "front": "...", "back": "...", "difficulty": "..." }, ... ] }`,
      },
    ],
    response_format: { type: "json_object" },
  }, { signal });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  return parsed.flashcards ?? [];
}

async function generateQuizQuestions(sourceText: string, aiMode: "strict" | "enhance", questionCount: number, signal?: AbortSignal): Promise<Array<{
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
}>> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: buildSystemPrompt(sourceText, aiMode) },
      {
        role: "user",
        content: `Generate exactly ${questionCount} multiple-choice quiz questions from the source text. Each question must have exactly four options (A, B, C, D) with only one correct answer. Include a brief explanation citing the source material.

Respond with a JSON object: { "questions": [ { "question": "...", "optionA": "...", "optionB": "...", "optionC": "...", "optionD": "...", "correctAnswer": "A" | "B" | "C" | "D", "explanation": "..." }, ... ] }`,
      },
    ],
    response_format: { type: "json_object" },
  }, { signal });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  return parsed.questions ?? [];
}

async function generateClozeItems(sourceText: string, aiMode: "strict" | "enhance", itemCount: number, signal?: AbortSignal): Promise<Array<{ sentence: string; answer: string; hint?: string }>> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 6144,
    messages: [
      { role: "system", content: buildSystemPrompt(sourceText, aiMode) },
      {
        role: "user",
        content: `Generate exactly ${itemCount} fill-in-the-blank (cloze) study items from the source text. Each item is a single sentence with one important keyword or short phrase replaced by exactly three underscores: ___. The "answer" is the exact word/phrase that fills the blank. Provide a brief "hint" (a category, first letter, or definition fragment) — keep it useful but not a giveaway.

Rules:
- Exactly one ___ blank per sentence
- The blank must be a meaningful term, not a function word
- Sentences should be self-contained and clear
- Vary which terms you blank across items

Respond with a JSON object: { "items": [ { "sentence": "...___...", "answer": "...", "hint": "..." }, ... ] }`,
      },
    ],
    response_format: { type: "json_object" },
  }, { signal });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  return parsed.items ?? [];
}

async function generateStudyGuide(sourceText: string, aiMode: "strict" | "enhance", signal?: AbortSignal): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: buildSystemPrompt(sourceText, aiMode) },
      {
        role: "user",
        content: `Create a comprehensive, well-structured study guide from the source text. Organize the content with clear headings and subheadings. Include all key concepts, definitions, and important details found in the source. Use only information from the source text.

Respond with a JSON object: { "studyGuide": "markdown formatted study guide here" }`,
      },
    ],
    response_format: { type: "json_object" },
  }, { signal });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  return parsed.studyGuide ?? "";
}

router.post(
  "/custom-decks",
  requireScholar,
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    const userId = (req as Request & { scholarUser: { id: string } }).scholarUser.id;

    try {
      const [concurrencyRow] = await db
        .select({ value: count() })
        .from(customDecksTable)
        .where(and(eq(customDecksTable.userId, userId), eq(customDecksTable.status, "processing")));
      if ((concurrencyRow?.value ?? 0) >= MAX_CONCURRENT_JOBS_PER_USER) {
        res.status(429).json({ error: "Too many active generation jobs. Please wait for your current job to finish." });
        return;
      }

      const startOfDay = new Date();
      startOfDay.setUTCHours(0, 0, 0, 0);
      const [dailyRow] = await db
        .select({ value: count() })
        .from(customDecksTable)
        .where(and(eq(customDecksTable.userId, userId), gte(customDecksTable.createdAt, startOfDay)));
      if ((dailyRow?.value ?? 0) >= MAX_DECKS_PER_DAY) {
        res.status(429).json({ error: "Daily deck generation limit reached. Please try again tomorrow." });
        return;
      }

      const abort = new AbortController();
      const { signal } = abort;
      req.on("close", () => abort.abort());

      try {
        const title: string = req.body?.title?.trim() || "My Study Deck";
        const rawAiMode = req.body?.aiMode;
        const aiMode: "strict" | "enhance" = rawAiMode === "strict" ? "strict" : "enhance";
        const tier: "standard" | "pro" = req.body?.tier === "pro" ? "pro" : "standard";

        const STANDARD_TOOL_IDS = ["flashcards", "quiz", "studyGuide", "exam"] as const;
        const PRO_TOOL_IDS = ["match", "cloze", "review"] as const;
        const validToolIds: readonly string[] = tier === "pro" ? PRO_TOOL_IDS : STANDARD_TOOL_IDS;
        let tools: string[] = [];
        const rawTools = req.body?.tools;
        if (typeof rawTools === "string" && rawTools.length > 0) {
          try {
            const parsed = JSON.parse(rawTools);
            if (Array.isArray(parsed)) {
              tools = parsed.filter((t): t is string => typeof t === "string" && validToolIds.includes(t));
            }
          } catch {
            tools = [];
          }
        }
        if (tools.length === 0) {
          tools = [...validToolIds];
        }

        const ALLOWED_FLASHCARDS = [15, 25, 40];
        const ALLOWED_QUIZ = [10, 15, 25];
        const ALLOWED_EXAM = [15, 25, 50];
        const ALLOWED_CLOZE = [0, 10, 20];
        const parseChoice = (raw: unknown, allowed: number[], fallback: number): number => {
          const n = parseInt(String(raw ?? ""), 10);
          return allowed.includes(n) ? n : fallback;
        };
        const flashcardCount = parseChoice(req.body?.flashcardCount, ALLOWED_FLASHCARDS, 25);
        const quizCount = parseChoice(req.body?.quizCount, ALLOWED_QUIZ, 15);
        const examQuestionCount = parseChoice(req.body?.examQuestionCount, ALLOWED_EXAM, 15);
        const clozeCount = parseChoice(req.body?.clozeCount, ALLOWED_CLOZE, 10);
        const examTimed = req.body?.examTimed === "true" || req.body?.examTimed === true;

        const wantsFlashcards = tier === "standard"
          ? tools.includes("flashcards")
          : tools.includes("match") || tools.includes("review");
        const wantsQuiz = tier === "standard" && (tools.includes("quiz") || tools.includes("exam"));
        const wantsStudyGuide = tier === "standard" && tools.includes("studyGuide");
        const wantsCloze = tier === "pro" && tools.includes("cloze");

        let sourceText: string = "";

        if (req.file) {
          sourceText = await extractTextFromBuffer(req.file.buffer, req.file.mimetype);
        } else if (req.body?.text) {
          sourceText = (req.body.text as string).trim();
        }

        if (!sourceText || sourceText.length < 50) {
          res.status(400).json({ error: "Please provide more content — at least a few paragraphs of study material." });
          return;
        }

        const [deck] = await db
          .insert(customDecksTable)
          .values({ userId, title, sourceText, status: "processing", tier, tools, examQuestionCount, examTimed })
          .returning();

        try {
          const [flashcards, quizQuestions, studyGuide, clozeItems] = await Promise.all([
            wantsFlashcards
              ? generateFlashcards(sourceText, aiMode, flashcardCount, signal)
              : Promise.resolve([] as Array<{ front: string; back: string; difficulty: string }>),
            wantsQuiz
              ? generateQuizQuestions(sourceText, aiMode, quizCount, signal)
              : Promise.resolve([] as Array<{ question: string; optionA: string; optionB: string; optionC: string; optionD: string; correctAnswer: string; explanation: string }>),
            wantsStudyGuide
              ? generateStudyGuide(sourceText, aiMode, signal)
              : Promise.resolve(""),
            wantsCloze && clozeCount > 0
              ? generateClozeItems(sourceText, aiMode, clozeCount, signal)
              : Promise.resolve([] as Array<{ sentence: string; answer: string; hint?: string }>),
          ]);

          if (flashcards.length > 0) {
            await db.insert(customFlashcardsTable).values(
              flashcards.map((f, i) => ({
                deckId: deck.id,
                front: f.front,
                back: f.back,
                difficulty: f.difficulty || "medium",
                cardOrder: i,
              }))
            );
          }

          if (quizQuestions.length > 0) {
            await db.insert(customQuizQuestionsTable).values(
              quizQuestions.map((q, i) => ({
                deckId: deck.id,
                question: q.question,
                optionA: q.optionA,
                optionB: q.optionB,
                optionC: q.optionC,
                optionD: q.optionD,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation || "",
                questionOrder: i,
              }))
            );
          }

          if (clozeItems.length > 0) {
            await db.insert(customClozeItemsTable).values(
              clozeItems
                .filter((c) => c.sentence && c.answer)
                .map((c, i) => ({
                  deckId: deck.id,
                  sentence: c.sentence,
                  answer: c.answer,
                  hint: c.hint ?? null,
                  itemOrder: i,
                }))
            );
          }

          const [updated] = await db
            .update(customDecksTable)
            .set({ studyGuide, status: "ready" })
            .where(eq(customDecksTable.id, deck.id))
            .returning();

          res.status(201).json(updated);
        } catch (genErr) {
          await db
            .update(customDecksTable)
            .set({ status: "error" })
            .where(eq(customDecksTable.id, deck.id));
          throw genErr;
        }
      } catch (err) {
        req.log.error({ err }, "Error creating custom deck");
        res.status(500).json({ error: "Failed to generate study materials. Please try again." });
      }
    } catch (err) {
      req.log.error({ err }, "Error checking quota");
      res.status(500).json({ error: "Failed to generate study materials. Please try again." });
    }
  }
);

router.get("/custom-decks", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

    const decks = await db
      .select({ id: customDecksTable.id, title: customDecksTable.title, status: customDecksTable.status, tier: customDecksTable.tier, tools: customDecksTable.tools, createdAt: customDecksTable.createdAt })
      .from(customDecksTable)
      .where(eq(customDecksTable.userId, userId))
      .orderBy(desc(customDecksTable.createdAt));

    res.json(decks);
  } catch (err) {
    req.log.error({ err }, "Error fetching custom decks");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/custom-decks/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

    const deckId = parseIntParam(req, res, "id");
    if (deckId === null) return;
    const [deck] = await db.select().from(customDecksTable).where(eq(customDecksTable.id, deckId));
    if (!deck || deck.userId !== userId) { res.status(404).json({ error: "Not found" }); return; }

    res.json(deck);
  } catch (err) {
    req.log.error({ err }, "Error fetching custom deck");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/custom-decks/:id/flashcards", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

    const deckId = parseIntParam(req, res, "id");
    if (deckId === null) return;
    const [deck] = await db.select({ userId: customDecksTable.userId }).from(customDecksTable).where(eq(customDecksTable.id, deckId));
    if (!deck || deck.userId !== userId) { res.status(404).json({ error: "Not found" }); return; }

    const cards = await db.select().from(customFlashcardsTable).where(eq(customFlashcardsTable.deckId, deckId));
    res.json(cards.sort((a, b) => a.cardOrder - b.cardOrder));
  } catch (err) {
    req.log.error({ err }, "Error fetching custom flashcards");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/custom-decks/:id/quiz", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

    const deckId = parseIntParam(req, res, "id");
    if (deckId === null) return;
    const [deck] = await db.select({ userId: customDecksTable.userId }).from(customDecksTable).where(eq(customDecksTable.id, deckId));
    if (!deck || deck.userId !== userId) { res.status(404).json({ error: "Not found" }); return; }

    const questions = await db.select().from(customQuizQuestionsTable).where(eq(customQuizQuestionsTable.deckId, deckId));
    res.json(questions.sort((a, b) => a.questionOrder - b.questionOrder));
  } catch (err) {
    req.log.error({ err }, "Error fetching custom quiz questions");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/custom-decks/:id/cloze", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

    const deckId = parseIntParam(req, res, "id");
    if (deckId === null) return;
    const [deck] = await db.select({ userId: customDecksTable.userId }).from(customDecksTable).where(eq(customDecksTable.id, deckId));
    if (!deck || deck.userId !== userId) { res.status(404).json({ error: "Not found" }); return; }

    const items = await db.select().from(customClozeItemsTable).where(eq(customClozeItemsTable.deckId, deckId));
    res.json(items.sort((a, b) => a.itemOrder - b.itemOrder));
  } catch (err) {
    req.log.error({ err }, "Error fetching custom cloze items");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/custom-decks/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

    const deckId = parseIntParam(req, res, "id");
    if (deckId === null) return;
    const [deck] = await db.select({ userId: customDecksTable.userId }).from(customDecksTable).where(eq(customDecksTable.id, deckId));
    if (!deck || deck.userId !== userId) { res.status(404).json({ error: "Not found" }); return; }

    await db.delete(customDecksTable).where(eq(customDecksTable.id, deckId));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error deleting custom deck");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
