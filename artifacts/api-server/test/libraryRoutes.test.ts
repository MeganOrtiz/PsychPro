/**
 * Exercise real routers, DB transactions, and private stored PDF bytes.
 * Clerk's verified request identity is stubbed ONLY in this isolated test app;
 * no production middleware or authentication setting is changed.
 */
import assert from "node:assert/strict";
import { randomUUID, createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import type { Server } from "node:http";
import express from "express";
import { and, eq, inArray } from "drizzle-orm";
import { db, pool, feedbackTable, libraryBooksTable, userLibraryBooksTable, usersTable } from "@workspace/db";
import feedbackRouter from "../src/routes/feedback";
import libraryRouter from "../src/routes/library";
import storageRouter from "../src/routes/storage";
import { ensureFeedbackBookCatalog, FEEDBACK_REWARD_BOOK_ID } from "../src/lib/bookLibrary";

const prefix = `library-routes-${randomUUID()}`;
const ids = { owner: `${prefix}-owner`, historic: `${prefix}-historic`, other: `${prefix}-other` };
let server: Server | undefined;

async function main() {
  try {
    await ensureFeedbackBookCatalog();
    await db.insert(usersTable).values([
      { id: ids.owner, subscriptionStatus: "pro", epppAccessUntil: new Date(Date.now() + 86_400_000) },
      { id: ids.historic },
      { id: ids.other },
    ]);
    const app = express();
    app.use(express.json());
    app.use((req, _res, next) => {
      const alias = req.header("x-test-account") as keyof typeof ids | undefined;
      const userId = alias && ids[alias] ? ids[alias] : null;
      Object.defineProperty(req, "auth", {
        value: () => ({ userId, sessionId: userId ? "test-session" : null, tokenType: "session_token" }),
      });
      req.log = { error() {}, warn() {}, info() {}, debug() {} } as unknown as typeof req.log;
      next();
    });
    app.use("/api", libraryRouter, feedbackRouter, storageRouter);
    server = app.listen(0, "127.0.0.1");
    await new Promise<void>((resolve) => server!.once("listening", resolve));
    const address = server.address();
    assert(address && typeof address !== "string");
    const base = `http://127.0.0.1:${address.port}/api`;
    async function request(path: string, account?: keyof typeof ids, body?: unknown) {
      return fetch(base + path, {
        method: body === undefined ? "GET" : "POST",
        headers: { ...(account ? { "x-test-account": account } : {}), "Content-Type": "application/json" },
        ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      });
    }

    assert.equal((await request("/library")).status, 401);
    assert.equal((await request("/library/claim", undefined, {})).status, 401);
    assert.equal((await request("/library/claim", "other", { eligible: true, userId: ids.owner })).status, 403);
    assert.equal((await request(`/library/books/${FEEDBACK_REWARD_BOOK_ID}/pdf`, "other")).status, 403);

    const empty = await (await request("/library", "owner")).json();
    assert.equal(empty.books.length, 0);
    assert.equal(empty.reward.eligible, false);
    assert.equal(empty.reward.available, true);
    const invalid = await request("/feedback", "owner", { message: "short" });
    assert.equal(invalid.status, 400);
    const first = await request("/feedback", "owner", {
      type: "bug", message: "Some explanations are confusing and could be improved.",
    });
    assert.equal(first.status, 201);
    assert.deepEqual((await first.json()).reward, {
      available: true, alreadyOwned: false, bookId: FEEDBACK_REWARD_BOOK_ID,
    });
    const repeated = await request("/feedback", "owner", {
      type: "general", message: "This is additional honest website feedback from the same account.",
    });
    assert.equal(repeated.status, 201);
    assert.equal((await repeated.json()).reward.alreadyOwned, true);
    const library = await (await request("/library", "owner")).json();
    assert.equal(library.books.length, 1);
    assert.equal(library.books[0].id, FEEDBACK_REWARD_BOOK_ID);
    assert.equal(library.books[0].pageCount, 775);
    assert.equal("pdfObjectPath" in library.books[0], false);
    assert.equal(library.reward.owned, true);

    // Subscription expiry does not remove an account-owned book.
    await db.update(usersTable).set({ subscriptionStatus: "free", epppAccessUntil: null }).where(eq(usersTable.id, ids.owner));
    assert.equal((await (await request("/library", "owner")).json()).books.length, 1);

    await db.insert(feedbackTable).values({
      userId: ids.historic, type: "general", message: "Feedback saved before the book library launched.", status: "read",
    });
    assert.equal((await (await request("/library", "historic")).json()).reward.eligible, true);
    const claimed = await request("/library/claim", "historic", {});
    assert.equal(claimed.status, 200);
    assert.equal((await claimed.json()).alreadyOwned, false);
    const reclaimed = await request("/library/claim", "historic", {});
    assert.equal((await reclaimed.json()).alreadyOwned, true);

    const pdf = await request(`/library/books/${FEEDBACK_REWARD_BOOK_ID}/pdf`, "owner");
    assert.equal(pdf.status, 200);
    assert.match(pdf.headers.get("Content-Type")!, /^application\/pdf/);
    assert.match(pdf.headers.get("Cache-Control")!, /private, no-store/);
    assert.match(pdf.headers.get("Content-Disposition")!, /^inline/);
    const actual = Buffer.from(await pdf.arrayBuffer());
    const original = await readFile("assets/books/psychpro-foundations-v1.pdf");
    assert.equal(createHash("sha256").update(actual).digest("hex"), createHash("sha256").update(original).digest("hex"));
    const download = await request(`/library/books/${FEEDBACK_REWARD_BOOK_ID}/pdf?download=1`, "owner");
    assert.match(download.headers.get("Content-Disposition")!, /^attachment/);
    await download.arrayBuffer();

    const [book] = await db.select().from(libraryBooksTable).where(eq(libraryBooksTable.id, FEEDBACK_REWARD_BOOK_ID));
    const generic = await request(`/storage${book.pdfObjectPath}`, "owner");
    assert([403, 404].includes(generic.status), "generic storage must not bypass book ownership");
    const publicPath = book.pdfObjectPath.replace(/^\/objects\//, "");
    assert.equal((await request(`/storage/public-objects/${publicPath}`, "owner")).status, 404);
    const grants = await db.select().from(userLibraryBooksTable).where(and(
      eq(userLibraryBooksTable.userId, ids.owner), eq(userLibraryBooksTable.bookId, FEEDBACK_REWARD_BOOK_ID),
    ));
    assert.equal(grants.length, 1);
    process.stdout.write("Library router checks passed: saved feedback, repeat grants, historic claims, subscription expiry, protected exact PDF bytes, and alternate-path denial.\n");
  } finally {
    if (server) await new Promise<void>((resolve) => server!.close(() => resolve()));
    await db.delete(feedbackTable).where(inArray(feedbackTable.userId, Object.values(ids)));
    await db.delete(usersTable).where(inArray(usersTable.id, Object.values(ids)));
    await pool.end();
  }
}
main().catch((error) => { process.stderr.write(`${error.stack ?? error}\n`); process.exitCode = 1; });