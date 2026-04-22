import { Router, type Request, type Response } from "express";
import multer from "multer";
import { db } from "@workspace/db";
import {
  usersTable,
  customDecksTable,
  customFlashcardsTable,
  customQuizQuestionsTable,
} from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { getAuth } from "@clerk/express";
import { openai } from "@workspace/integrations-openai-ai-server";

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

function getUserId(req: Request): string | null {
  return getAuth(req).userId ?? null;
}

const PAID_STATUSES = ["active", "trialing", "pro", "scholar"];

async function getUser(userId: string) {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  return user ?? null;
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

async function generateFlashcards(sourceText: string, aiMode: "strict" | "enhance", count: number): Promise<Array<{ front: string; back: string; difficulty: string }>> {
  const response = await openai.chat.completions.create({
    model: "gpt-5.2",
    max_completion_tokens: 8192,
    messages: [
      { role: "system", content: buildSystemPrompt(sourceText, aiMode) },
      {
        role: "user",
        content: `Generate exactly ${count} flashcards from the source text. Each flashcard must have a "front" (question/term) and "back" (answer/definition). Set "difficulty" to "easy", "medium", or "hard" based on the concept complexity. Aim for a mix of difficulties.

Respond with a JSON object: { "flashcards": [ { "front": "...", "back": "...", "difficulty": "..." }, ... ] }`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  return parsed.flashcards ?? [];
}

async function generateQuizQuestions(sourceText: string, aiMode: "strict" | "enhance", count: number): Promise<Array<{
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
        content: `Generate exactly ${count} multiple-choice quiz questions from the source text. Each question must have exactly four options (A, B, C, D) with only one correct answer. Include a brief explanation citing the source material.

Respond with a JSON object: { "questions": [ { "question": "...", "optionA": "...", "optionB": "...", "optionC": "...", "optionD": "...", "correctAnswer": "A" | "B" | "C" | "D", "explanation": "..." }, ... ] }`,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  return parsed.questions ?? [];
}

async function generateStudyGuide(sourceText: string, aiMode: "strict" | "enhance"): Promise<string> {
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
  });

  const content = response.choices[0]?.message?.content ?? "{}";
  const parsed = JSON.parse(content);
  return parsed.studyGuide ?? "";
}

router.post(
  "/custom-decks",
  upload.single("file"),
  async (req: Request, res: Response): Promise<void> => {
    try {
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

      const title: string = req.body?.title?.trim() || "My Study Deck";
      const rawAiMode = req.body?.aiMode;
      const aiMode: "strict" | "enhance" = rawAiMode === "strict" ? "strict" : "enhance";

      const ALLOWED_FLASHCARDS = [15, 25, 40];
      const ALLOWED_QUIZ = [10, 15, 25];
      const ALLOWED_EXAM = [15, 25, 50];
      const parseChoice = (raw: unknown, allowed: number[], fallback: number): number => {
        const n = parseInt(String(raw ?? ""), 10);
        return allowed.includes(n) ? n : fallback;
      };
      const flashcardCount = parseChoice(req.body?.flashcardCount, ALLOWED_FLASHCARDS, 25);
      const quizCount = parseChoice(req.body?.quizCount, ALLOWED_QUIZ, 15);
      const examQuestionCount = parseChoice(req.body?.examQuestionCount, ALLOWED_EXAM, 15);
      const examTimed = req.body?.examTimed === "true" || req.body?.examTimed === true;

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
        .values({ userId, title, sourceText, status: "processing", examQuestionCount, examTimed })
        .returning();

      try {
        const [flashcards, quizQuestions, studyGuide] = await Promise.all([
          generateFlashcards(sourceText, aiMode, flashcardCount),
          generateQuizQuestions(sourceText, aiMode, quizCount),
          generateStudyGuide(sourceText, aiMode),
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
  }
);

router.get("/custom-decks", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

    const decks = await db
      .select({ id: customDecksTable.id, title: customDecksTable.title, status: customDecksTable.status, createdAt: customDecksTable.createdAt })
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

    const deckId = parseInt(req.params.id, 10);
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

    const deckId = parseInt(req.params.id, 10);
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

    const deckId = parseInt(req.params.id, 10);
    const [deck] = await db.select({ userId: customDecksTable.userId }).from(customDecksTable).where(eq(customDecksTable.id, deckId));
    if (!deck || deck.userId !== userId) { res.status(404).json({ error: "Not found" }); return; }

    const questions = await db.select().from(customQuizQuestionsTable).where(eq(customQuizQuestionsTable.deckId, deckId));
    res.json(questions.sort((a, b) => a.questionOrder - b.questionOrder));
  } catch (err) {
    req.log.error({ err }, "Error fetching custom quiz questions");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/custom-decks/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = getUserId(req);
    if (!userId) { res.status(401).json({ error: "Unauthorized" }); return; }

    const deckId = parseInt(req.params.id, 10);
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
