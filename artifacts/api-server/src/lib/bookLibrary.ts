import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { and, eq } from "drizzle-orm";
import {
  db,
  feedbackTable,
  libraryBooksTable,
  userLibraryBooksTable,
} from "@workspace/db";
import { objectStorageClient, ObjectNotFoundError, ObjectStorageService } from "./objectStorage";
import { getObjectAclPolicy } from "./objectAcl";
import { logger } from "./logger";

export const FEEDBACK_REWARD_BOOK_ID = "psychpro-foundations-v1";
export const FEEDBACK_REWARD_SOURCE = "website-feedback";
const SERVER_STORAGE_OWNER = "__psychpro_library_catalog__";
const PDF_RELATIVE_PATH = "assets/books/psychpro-foundations-v1.pdf";
const BOOK_TITLE = "Foundations in Clinical Psychology, Volume 1";
const BOOK_DESCRIPTION =
  "The corrected first volume of Foundations in Clinical Psychology.";
const BOOK_PAGE_COUNT = 775;

const storage = new ObjectStorageService();
let bootstrapInFlight: Promise<void> | null = null;
type LibraryDbExecutor = Pick<typeof db, "select" | "insert">;

export async function hasSavedFeedback(
  executor: LibraryDbExecutor,
  userId: string,
): Promise<boolean> {
  const [feedback] = await executor
    .select({ id: feedbackTable.id })
    .from(feedbackTable)
    .where(eq(feedbackTable.userId, userId))
    .limit(1);
  return Boolean(feedback);
}

/** Inserts the unique feedback reward grant; false means it was already owned. */
export async function grantFeedbackBookOwnership(
  executor: LibraryDbExecutor,
  userId: string,
  bookId = FEEDBACK_REWARD_BOOK_ID,
): Promise<boolean> {
  if (!(await hasSavedFeedback(executor, userId))) {
    throw new Error("Saved feedback is required before granting the feedback reward");
  }
  const [grant] = await executor
    .insert(userLibraryBooksTable)
    .values({
      userId,
      bookId,
      source: FEEDBACK_REWARD_SOURCE,
    })
    .onConflictDoNothing({
      target: [userLibraryBooksTable.userId, userLibraryBooksTable.bookId],
    })
    .returning({ id: userLibraryBooksTable.id });
  return Boolean(grant);
}

export async function getOwnedLibraryBookPdf(userId: string, bookId: string) {
  const [owned] = await db
    .select({
      pdfObjectPath: libraryBooksTable.pdfObjectPath,
      title: libraryBooksTable.title,
    })
    .from(userLibraryBooksTable)
    .innerJoin(libraryBooksTable, eq(userLibraryBooksTable.bookId, libraryBooksTable.id))
    .where(
      and(
        eq(userLibraryBooksTable.userId, userId),
        eq(userLibraryBooksTable.bookId, bookId),
      ),
    )
    .limit(1);
  return owned ?? null;
}

async function resolveAssetPath(): Promise<string> {
  const here = path.dirname(fileURLToPath(import.meta.url));
  const candidates = [
    path.resolve(here, "..", PDF_RELATIVE_PATH),
    path.resolve(here, "..", "..", PDF_RELATIVE_PATH),
  ];
  for (const candidate of candidates) {
    try {
      await readFile(candidate);
      return candidate;
    } catch {
      // Check the alternate source/dist location.
    }
  }
  throw new Error(`Required protected library source asset is missing: ${PDF_RELATIVE_PATH}`);
}

async function bootstrapCatalogBook(): Promise<void> {
  const bytes = await readFile(await resolveAssetPath());
  if (bytes.subarray(0, 5).toString("ascii") !== "%PDF-") {
    throw new Error("The configured library source asset is not a valid PDF");
  }
  const contentHash = createHash("sha256").update(bytes).digest("hex");
  const privateDir = storage.getPrivateObjectDir();
  const [bucketName, ...privateParts] = privateDir.replace(/^\/+/, "").split("/");
  if (!bucketName || privateParts.length === 0) {
    throw new Error("PRIVATE_OBJECT_DIR must include a bucket and private directory");
  }
  const objectName = [...privateParts, "library", FEEDBACK_REWARD_BOOK_ID, `${contentHash}.pdf`].join("/");
  const relativeObjectPath = `library/${FEEDBACK_REWARD_BOOK_ID}/${contentHash}.pdf`;
  const objectFile = objectStorageClient.bucket(bucketName).file(objectName);
  const [exists] = await objectFile.exists();
  if (!exists) {
    try {
      await objectFile.save(bytes, {
        resumable: false,
        preconditionOpts: { ifGenerationMatch: 0 },
        metadata: { contentType: "application/pdf", cacheControl: "private, no-store" },
      });
    } catch (err) {
      // Multiple server instances can bootstrap the same immutable object at
      // once. A generation precondition makes the winner's upload authoritative.
      const [createdByOtherInstance] = await objectFile.exists();
      if (!createdByOtherInstance) throw err;
    }
  }
  await objectFile.setMetadata({
    metadata: {
      "custom:aclPolicy": JSON.stringify({
        owner: SERVER_STORAGE_OWNER,
        visibility: "private",
      }),
    },
  });

  await db
    .insert(libraryBooksTable)
    .values({
      id: FEEDBACK_REWARD_BOOK_ID,
      title: BOOK_TITLE,
      description: BOOK_DESCRIPTION,
      coverUrl: null,
      pageCount: BOOK_PAGE_COUNT,
      pdfObjectPath: `/objects/${relativeObjectPath}`,
      contentHash,
    })
    .onConflictDoUpdate({
      target: libraryBooksTable.id,
      set: {
        title: BOOK_TITLE,
        description: BOOK_DESCRIPTION,
        coverUrl: null,
        pageCount: BOOK_PAGE_COUNT,
        pdfObjectPath: `/objects/${relativeObjectPath}`,
        contentHash,
      },
    });
}

/** Ensures the immutable private object and its catalog row are available. */
export async function ensureFeedbackBookCatalog(): Promise<void> {
  if (!bootstrapInFlight) {
    bootstrapInFlight = bootstrapCatalogBook().catch((err) => {
      bootstrapInFlight = null;
      throw err;
    });
  }
  await bootstrapInFlight;
}

export async function feedbackBookAvailable(): Promise<boolean> {
  const [book] = await db
    .select({
      id: libraryBooksTable.id,
      pdfObjectPath: libraryBooksTable.pdfObjectPath,
    })
    .from(libraryBooksTable)
    .where(eq(libraryBooksTable.id, FEEDBACK_REWARD_BOOK_ID))
    .limit(1);
  if (!book) return false;
  try {
    const file = await storage.getObjectEntityFile(book.pdfObjectPath);
    const acl = await getObjectAclPolicy(file);
    return acl?.visibility === "private" && acl.owner === SERVER_STORAGE_OWNER;
  } catch (err) {
    if (!(err instanceof ObjectNotFoundError)) {
      logger.warn({ err, bookId: FEEDBACK_REWARD_BOOK_ID }, "Unable to verify feedback reward storage");
    }
    return false;
  }
}

export function logCatalogBootstrapFailure(err: unknown): void {
  logger.error({ err, bookId: FEEDBACK_REWARD_BOOK_ID }, "Feedback reward catalog bootstrap failed");
}