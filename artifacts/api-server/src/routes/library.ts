import { Router, type Request, type Response } from "express";
import { and, eq } from "drizzle-orm";
import {
  db,
  feedbackTable,
  libraryBooksTable,
  userLibraryBooksTable,
} from "@workspace/db";
import {
  ClaimFeedbackBookResponse,
  GetBookLibraryResponse,
} from "@workspace/api-zod";
import {
  ensureFeedbackBookCatalog,
  feedbackBookAvailable,
  FEEDBACK_REWARD_BOOK_ID,
  grantFeedbackBookOwnership,
  getOwnedLibraryBookPdf,
  hasSavedFeedback,
  logCatalogBootstrapFailure,
} from "../lib/bookLibrary";
import { ObjectNotFoundError, ObjectStorageService } from "../lib/objectStorage";
import { getObjectAclPolicy } from "../lib/objectAcl";
import { requireUserId } from "../lib/userId";

const router = Router();
const storage = new ObjectStorageService();
const SERVER_STORAGE_OWNER = "__psychpro_library_catalog__";
const BOOK_TITLE = "Foundations in Clinical Psychology, Volume 1";

async function getOwnedBooks(userId: string) {
  const rows = await db
    .select({
      id: libraryBooksTable.id,
      title: libraryBooksTable.title,
      description: libraryBooksTable.description,
      coverUrl: libraryBooksTable.coverUrl,
      pageCount: libraryBooksTable.pageCount,
      grantedAt: userLibraryBooksTable.grantedAt,
      source: userLibraryBooksTable.source,
    })
    .from(userLibraryBooksTable)
    .innerJoin(libraryBooksTable, eq(userLibraryBooksTable.bookId, libraryBooksTable.id))
    .where(eq(userLibraryBooksTable.userId, userId))
    .orderBy(userLibraryBooksTable.grantedAt);
  return rows.map((book) => ({ ...book, grantedAt: book.grantedAt.toISOString() }));
}

router.get("/library", async (req: Request, res: Response): Promise<void> => {
  const userId = requireUserId(req, res);
  if (!userId) return;
  try {
    const [owned] = await db
      .select({ id: userLibraryBooksTable.id })
      .from(userLibraryBooksTable)
      .where(
        and(
          eq(userLibraryBooksTable.userId, userId),
          eq(userLibraryBooksTable.bookId, FEEDBACK_REWARD_BOOK_ID),
        ),
      )
      .limit(1);
    const [eligibleFeedback] = await db
      .select({ id: feedbackTable.id })
      .from(feedbackTable)
      .where(eq(feedbackTable.userId, userId))
      .limit(1);
    const available = await feedbackBookAvailable();
    const response = GetBookLibraryResponse.parse({
      books: await getOwnedBooks(userId),
      reward: {
        bookId: FEEDBACK_REWARD_BOOK_ID,
        title: BOOK_TITLE,
        owned: Boolean(owned),
        eligible: Boolean(eligibleFeedback),
        available,
      },
    });
    res.json(response);
  } catch (err) {
    req.log.error({ err }, "Error fetching shared book library");
    res.status(500).json({ error: "Unable to load library" });
  }
});

router.post("/library/claim", async (req: Request, res: Response): Promise<void> => {
  const userId = requireUserId(req, res);
  if (!userId) return;
  try {
    if (!(await hasSavedFeedback(db, userId))) {
      res.status(403).json({ error: "Saved feedback is required to claim this book" });
      return;
    }
    try {
      await ensureFeedbackBookCatalog();
    } catch (err) {
      logCatalogBootstrapFailure(err);
      res.status(503).json({ error: "Feedback reward is temporarily unavailable" });
      return;
    }
    const result = await db.transaction(async (tx) => {
      if (!(await hasSavedFeedback(tx, userId))) return { kind: "ineligible" as const };

      const [book] = await tx
        .select()
        .from(libraryBooksTable)
        .where(eq(libraryBooksTable.id, FEEDBACK_REWARD_BOOK_ID))
        .limit(1);
      if (!book) return { kind: "unavailable" as const };

      const inserted = await grantFeedbackBookOwnership(tx, userId);
      const [owned] = await tx
        .select({
          id: libraryBooksTable.id,
          title: libraryBooksTable.title,
          description: libraryBooksTable.description,
          coverUrl: libraryBooksTable.coverUrl,
          pageCount: libraryBooksTable.pageCount,
          grantedAt: userLibraryBooksTable.grantedAt,
          source: userLibraryBooksTable.source,
        })
        .from(userLibraryBooksTable)
        .innerJoin(libraryBooksTable, eq(userLibraryBooksTable.bookId, libraryBooksTable.id))
        .where(
          and(
            eq(userLibraryBooksTable.userId, userId),
            eq(userLibraryBooksTable.bookId, FEEDBACK_REWARD_BOOK_ID),
          ),
        )
        .limit(1);
      if (!owned) throw new Error("Reward ownership insert did not persist");
      return {
        kind: "claimed" as const,
        alreadyOwned: !inserted,
        book: { ...owned, grantedAt: owned.grantedAt.toISOString() },
      };
    });

    if (result.kind === "ineligible") {
      res.status(403).json({ error: "Saved feedback is required to claim this book" });
      return;
    }
    if (result.kind === "unavailable") {
      res.status(503).json({ error: "Feedback reward is temporarily unavailable" });
      return;
    }
    res.json(ClaimFeedbackBookResponse.parse({
      book: result.book,
      alreadyOwned: result.alreadyOwned,
    }));
  } catch (err) {
    req.log.error({ err }, "Error claiming feedback reward book");
    res.status(500).json({ error: "Unable to claim feedback reward" });
  }
});

router.get("/library/books/:bookId/pdf", async (req: Request, res: Response): Promise<void> => {
  const userId = requireUserId(req, res);
  if (!userId) return;
  const bookId = Array.isArray(req.params.bookId) ? req.params.bookId[0] : req.params.bookId;
  try {
    const owned = await getOwnedLibraryBookPdf(userId, bookId);
    if (!owned) {
      res.status(403).json({ error: "Book ownership is required" });
      return;
    }
    const objectFile = await storage.getObjectEntityFile(owned.pdfObjectPath);
    const acl = await getObjectAclPolicy(objectFile);
    if (acl?.visibility !== "private" || acl.owner !== SERVER_STORAGE_OWNER) {
      req.log.error({ bookId }, "Library PDF object ACL is not private server-owned");
      res.status(404).json({ error: "Book PDF not found" });
      return;
    }
    const [metadata] = await objectFile.getMetadata();
    const download = req.query.download === "1" || req.query.download === "true";
    const filename = `${owned.title.replace(/[^a-z0-9._-]+/gi, "-")}.pdf`;
    res.set({
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "private, no-store, max-age=0",
      Pragma: "no-cache",
      "X-Content-Type-Options": "nosniff",
    });
    if (metadata.size) res.setHeader("Content-Length", String(metadata.size));
    objectFile.createReadStream()
      .on("error", (err) => {
        req.log.error({ err, bookId }, "Error streaming library PDF");
        if (!res.headersSent) res.status(500);
        res.end();
      })
      .pipe(res);
  } catch (err) {
    if (err instanceof ObjectNotFoundError) {
      res.status(404).json({ error: "Book PDF not found" });
      return;
    }
    req.log.error({ err, bookId }, "Error serving library PDF");
    res.status(500).json({ error: "Unable to serve book PDF" });
  }
});

export default router;