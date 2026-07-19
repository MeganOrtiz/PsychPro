import { Router, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { epppStudyPlansTable, topicsTable } from "@workspace/db";
import { eq, inArray } from "drizzle-orm";
import { requireUserId } from "../lib/userId";

const router = Router();

// EPPP Study Plan — one row per user (see eppp_study_plans). GET returns
// defaults when the user has never saved a plan (saved: false) so the client
// can render the builder without a 404 branch. PUT is a full replace/upsert.

const DEFAULT_PLAN = {
  examDate: "",
  selectedTopicIds: [] as number[],
  daysPerWeek: 5,
  saved: false,
};

// -----------------------------------------------------------------------------
// GET /eppp/study-plan
// -----------------------------------------------------------------------------
router.get("/eppp/study-plan", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const [row] = await db
      .select()
      .from(epppStudyPlansTable)
      .where(eq(epppStudyPlansTable.userId, userId));

    if (!row) {
      res.json(DEFAULT_PLAN);
      return;
    }
    res.json({
      examDate: row.examDate,
      selectedTopicIds: row.selectedTopicIds ?? [],
      daysPerWeek: row.daysPerWeek,
      saved: true,
      updatedAt: row.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error fetching EPPP study plan:", error);
    res.status(500).json({ error: "Failed to fetch study plan" });
  }
});

// -----------------------------------------------------------------------------
// PUT /eppp/study-plan
// -----------------------------------------------------------------------------
router.put("/eppp/study-plan", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const body = req.body ?? {};
    const examDate = typeof body.examDate === "string" ? body.examDate.trim() : null;
    const daysPerWeek = Number(body.daysPerWeek);
    const rawIds = body.selectedTopicIds;

    // examDate: "" (unset) or a valid yyyy-mm-dd calendar date.
    if (examDate === null || (examDate !== "" && !/^\d{4}-\d{2}-\d{2}$/.test(examDate))) {
      res.status(400).json({ error: "examDate must be an ISO yyyy-mm-dd string or empty" });
      return;
    }
    if (examDate !== "") {
      const [y, m, d] = examDate.split("-").map(Number);
      const parsed = new Date(Date.UTC(y, m - 1, d));
      if (
        parsed.getUTCFullYear() !== y ||
        parsed.getUTCMonth() !== m - 1 ||
        parsed.getUTCDate() !== d
      ) {
        res.status(400).json({ error: "examDate is not a real calendar date" });
        return;
      }
    }
    if (!Number.isInteger(daysPerWeek) || daysPerWeek < 1 || daysPerWeek > 7) {
      res.status(400).json({ error: "daysPerWeek must be an integer from 1 to 7" });
      return;
    }
    if (!Array.isArray(rawIds) || rawIds.some((v) => !Number.isInteger(v) || v <= 0)) {
      res.status(400).json({ error: "selectedTopicIds must be an array of positive integers" });
      return;
    }
    const ids: number[] = Array.from(new Set(rawIds as number[]));
    if (ids.length > 500) {
      res.status(400).json({ error: "Too many topics selected" });
      return;
    }

    // Only keep IDs that are real topics — silently dropping unknown IDs keeps
    // the plan self-healing if content is ever removed.
    let validIds: number[] = [];
    if (ids.length > 0) {
      const rows = await db
        .select({ id: topicsTable.id })
        .from(topicsTable)
        .where(inArray(topicsTable.id, ids));
      const known = new Set(rows.map((r) => r.id));
      validIds = ids.filter((id) => known.has(id));
    }

    const now = new Date();
    const [row] = await db
      .insert(epppStudyPlansTable)
      .values({
        userId,
        examDate,
        selectedTopicIds: validIds,
        daysPerWeek,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: epppStudyPlansTable.userId,
        set: {
          examDate,
          selectedTopicIds: validIds,
          daysPerWeek,
          updatedAt: now,
        },
      })
      .returning();

    res.json({
      examDate: row.examDate,
      selectedTopicIds: row.selectedTopicIds ?? [],
      daysPerWeek: row.daysPerWeek,
      saved: true,
      updatedAt: row.updatedAt.toISOString(),
    });
  } catch (error) {
    console.error("Error saving EPPP study plan:", error);
    res.status(500).json({ error: "Failed to save study plan" });
  }
});

export default router;
