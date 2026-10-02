import { and, eq, inArray } from "drizzle-orm";
import {
  db,
  feedbackTable,
  libraryBooksTable,
  pool,
  userLibraryBooksTable,
  usersTable,
} from "@workspace/db";
import { getOwnedLibraryBookPdf, grantFeedbackBookOwnership, hasSavedFeedback } from "../src/lib/bookLibrary";
import { canAccessObject, ObjectPermission } from "../src/lib/objectAcl";
import { isReservedLibraryPdfPath } from "../src/lib/objectStorage";

class AssertionError extends Error {}
function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new AssertionError(message);
}

const RUN = `it-library-${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
const BOOK_ID = `${RUN}-book`;
const userIds = [`${RUN}-previous-feedback`, `${RUN}-both-subscriptions`, `${RUN}-non-owner`];

async function setup(): Promise<void> {
  await db.insert(libraryBooksTable).values({
    id: BOOK_ID,
    title: "Integration test book",
    description: "Private test fixture",
    coverUrl: null,
    pageCount: 1,
    pdfObjectPath: "/objects/library/test/hash.pdf",
    contentHash: "test-hash",
  });
  await db.insert(usersTable).values([
    { id: userIds[0] },
    {
      id: userIds[1],
      subscriptionStatus: "pro",
      epppAccessUntil: new Date(Date.now() + 86_400_000),
    },
    { id: userIds[2] },
  ]);
}

async function teardown(): Promise<void> {
  await db.delete(feedbackTable).where(inArray(feedbackTable.userId, userIds));
  await db.delete(usersTable).where(inArray(usersTable.id, userIds));
  await db.delete(libraryBooksTable).where(eq(libraryBooksTable.id, BOOK_ID));
}

async function main(): Promise<void> {
  try {
    await setup();

    // Accounts with historic feedback remain claim-eligible without sending a
    // new message; this is the server-side evidence the claim endpoint uses.
    assert(!(await hasSavedFeedback(db, userIds[0])), "no feedback should mean ineligible");
    let rejectedNoFeedback = false;
    try {
      await grantFeedbackBookOwnership(db, userIds[2], BOOK_ID);
    } catch {
      rejectedNoFeedback = true;
    }
    assert(rejectedNoFeedback, "the grant helper must refuse accounts without saved feedback");
    await db.insert(feedbackTable).values({
      userId: userIds[0],
      type: "website",
      message: "A prior saved feedback record eligible for the reward.",
      status: "read",
    });
    assert(await hasSavedFeedback(db, userIds[0]), "previous saved feedback should qualify");

    // The DB uniqueness constraint handles parallel requests, repeat
    // submissions, categories, and sentiments; exactly one call creates the
    // shared account/book ownership row.
    const concurrentGrants = await Promise.all(
      Array.from({ length: 12 }, () => grantFeedbackBookOwnership(db, userIds[0], BOOK_ID)),
    );
    assert(
      concurrentGrants.filter(Boolean).length === 1,
      "concurrent/repeated grants must create ownership once",
    );
    const ownerPdf = await getOwnedLibraryBookPdf(userIds[0], BOOK_ID);
    const nonOwnerPdf = await getOwnedLibraryBookPdf(userIds[2], BOOK_ID);
    assert(ownerPdf?.pdfObjectPath === "/objects/library/test/hash.pdf", "owner should resolve its PDF");
    assert(nonOwnerPdf === null, "a non-owner must not resolve the PDF path");

    // Holding both suite subscriptions still resolves to one shared library
    // record. No subscription-specific ownership relation is consulted.
    const dualSubscriptionUser = userIds[1];
    const [dualUser] = await db.select().from(usersTable).where(eq(usersTable.id, dualSubscriptionUser));
    assert(dualUser?.subscriptionStatus === "pro", "fixture has general subscription");
    assert(dualUser?.epppAccessUntil instanceof Date, "fixture has EPPP access");
    await db.insert(feedbackTable).values({
      userId: dualSubscriptionUser,
      type: "other",
      message: "The dual-subscription account saved feedback before claiming.",
      status: "unread",
    });
    await grantFeedbackBookOwnership(db, dualSubscriptionUser, BOOK_ID);
    await grantFeedbackBookOwnership(db, dualSubscriptionUser, BOOK_ID);
    const dualOwnership = await db
      .select({ id: userLibraryBooksTable.id })
      .from(userLibraryBooksTable)
      .where(
        and(
          eq(userLibraryBooksTable.userId, dualSubscriptionUser),
          eq(userLibraryBooksTable.bookId, BOOK_ID),
        ),
      );
    assert(dualOwnership.length === 1, "both subscriptions must still produce one library book");

    // Reserved object paths cannot leak through a public search root which
    // overlaps PRIVATE_OBJECT_DIR, nor through generic private serving.
    const oldPrivateDir = process.env.PRIVATE_OBJECT_DIR;
    process.env.PRIVATE_OBJECT_DIR = "/bucket/private";
    assert(
      isReservedLibraryPdfPath("/bucket/private/library/psychpro-foundations-v1/hash.pdf"),
      "public root overlapping private storage must detect the reserved PDF",
    );
    assert(
      isReservedLibraryPdfPath("library/psychpro-foundations-v1/hash.pdf"),
      "generic /objects path must detect the reserved PDF namespace",
    );
    assert(isReservedLibraryPdfPath("library/other-book/hash.pdf"), "future books share the protected namespace");
    if (oldPrivateDir === undefined) delete process.env.PRIVATE_OBJECT_DIR;
    else process.env.PRIVATE_OBJECT_DIR = oldPrivateDir;

    const privateObject = {
      getMetadata: async () => [{
        metadata: {
          "custom:aclPolicy": JSON.stringify({
            owner: "__psychpro_library_catalog__",
            visibility: "private",
          }),
        },
      }],
    };
    const genericStorageAllowed = await canAccessObject({
      userId: userIds[0],
      objectFile: privateObject as never,
      requestedPermission: ObjectPermission.READ,
    });
    assert(!genericStorageAllowed, "generic storage ACL must deny account access to server-owned private PDF");
    process.stdout.write("✅ Library reward concurrency, eligibility, ownership, subscription, and storage isolation checks passed\n");
  } catch (err) {
    console.error(err instanceof Error ? (err.stack ?? err.message) : err);
    process.exitCode = 1;
  } finally {
    try {
      await teardown();
    } catch (err) {
      console.error("library test teardown failed:", err instanceof Error ? err.message : err);
      process.exitCode = 1;
    }
    await pool.end().catch(() => undefined);
  }
}

void main();