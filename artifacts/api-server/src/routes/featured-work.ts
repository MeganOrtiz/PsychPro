import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  featuredWorkTable,
  notificationsTable,
  userProfilesTable,
  usersTable,
} from "@workspace/db";
import {
  INTEREST_TAGS_SET,
  WORK_TYPE_SET,
  FEATURED_WORK_STATUSES,
  MAX_FEATURED_TITLE_LENGTH,
  MIN_FEATURED_ABSTRACT_LENGTH,
  MAX_FEATURED_ABSTRACT_LENGTH,
  MAX_FEATURED_COAUTHORS_LENGTH,
  MAX_FEATURED_VENUE_LENGTH,
  MAX_FEATURED_INTEREST_TAGS,
  MIN_FEATURED_INTEREST_TAGS,
  MAX_FEATURED_ADMIN_NOTE_LENGTH,
  MAX_DISPLAY_NAME_LENGTH,
  type FeaturedWorkStatus,
} from "@workspace/community";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { requireUserId, getOptionalUserId } from "../lib/userId";
import { requireAdminCaller as requireAdminCallerShared, isCallerAdmin } from "../lib/isAdmin";
import { parseIntParam } from "../lib/params";
import { ObjectStorageService } from "../lib/objectStorage";
import { isUploadOwnedBy, consumeUpload } from "./storage";
import { sendEmail } from "../lib/email";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

// =============================================================================
// Helpers
// =============================================================================

type ApiUser = {
  displayName: string;
  role: string | null;
  institution: string | null;
  prefShowOnFeaturedWork: boolean;
};

type FeaturedWorkRow = typeof featuredWorkTable.$inferSelect;

type SerializedSubmission = {
  id: number;
  userId: string | null;
  workType: string;
  title: string;
  abstract: string;
  fileUrl: string | null;
  externalLink: string | null;
  coauthors: string | null;
  venue: string | null;
  displayName: string;
  interestTags: string[];
  status: FeaturedWorkStatus;
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
  approvedAt: string | null;
  submitter: {
    displayName: string;
    role: string | null;
    institution: string | null;
    isAnonymous: boolean;
  };
};

function parseTags(raw: string | null | undefined): string[] {
  try {
    const parsed = JSON.parse(raw ?? "[]");
    if (Array.isArray(parsed)) {
      return parsed.filter((t): t is string => typeof t === "string");
    }
  } catch {
    /* ignore */
  }
  return [];
}

function serialize(
  row: FeaturedWorkRow,
  submitterProfile: { displayName: string | null; role: string | null; institution: string | null; prefShowOnFeaturedWork: boolean } | null,
  viewerIsOwnerOrAdmin: boolean,
): SerializedSubmission {
  const showProfile = submitterProfile?.prefShowOnFeaturedWork ?? true;
  const hideIdentity = !showProfile && !viewerIsOwnerOrAdmin;
  return {
    id: row.id,
    // Expose userId only when identity is visible (owner, admin, or a
    // non-anonymous public submission). Anonymous (toggle OFF) public
    // payloads omit it so viewers can't correlate submissions back to
    // the same user even after displayName is masked.
    userId: hideIdentity ? null : row.userId,
    workType: row.workType,
    title: row.title,
    abstract: row.abstract,
    fileUrl: row.fileUrl,
    externalLink: row.externalLink,
    coauthors: row.coauthors,
    venue: row.venue,
    displayName: hideIdentity ? "Anonymous contributor" : row.displayName,
    interestTags: parseTags(row.interestTags),
    status: row.status as FeaturedWorkStatus,
    // adminNote contains private reviewer-to-submitter feedback. Only the
    // submitter (owner) and admins should ever see it; public archive
    // viewers must not.
    adminNote: viewerIsOwnerOrAdmin ? row.adminNote : null,
    createdAt: row.createdAt.toISOString(),
    reviewedAt: row.reviewedAt ? row.reviewedAt.toISOString() : null,
    approvedAt: row.approvedAt ? row.approvedAt.toISOString() : null,
    submitter: {
      displayName: hideIdentity
        ? "Anonymous contributor"
        : (submitterProfile?.displayName ?? row.displayName),
      role: hideIdentity ? null : submitterProfile?.role ?? null,
      institution: hideIdentity ? null : submitterProfile?.institution ?? null,
      isAnonymous: hideIdentity,
    },
  };
}

async function loadSubmitterProfiles(userIds: string[]) {
  if (userIds.length === 0) return new Map<string, { displayName: string | null; role: string | null; institution: string | null; prefShowOnFeaturedWork: boolean }>();
  const unique = Array.from(new Set(userIds));
  const rows = await db
    .select({
      userId: userProfilesTable.userId,
      displayName: userProfilesTable.displayName,
      currentRole: userProfilesTable.currentRole,
      institution: userProfilesTable.institution,
      prefShowOnFeaturedWork: userProfilesTable.prefShowOnFeaturedWork,
    })
    .from(userProfilesTable)
    .where(
      unique.length === 1
        ? eq(userProfilesTable.userId, unique[0])
        : sql`${userProfilesTable.userId} = ANY(${unique})`,
    );
  const map = new Map<string, { displayName: string | null; role: string | null; institution: string | null; prefShowOnFeaturedWork: boolean }>();
  for (const r of rows) {
    map.set(r.userId, {
      displayName: r.displayName,
      role: r.currentRole,
      institution: r.institution,
      prefShowOnFeaturedWork: r.prefShowOnFeaturedWork,
    });
  }
  return map;
}

async function isAdmin(userId: string): Promise<boolean> {
  const [u] = await db.select({ isAdmin: usersTable.isAdmin }).from(usersTable).where(eq(usersTable.id, userId));
  return !!u?.isAdmin;
}

// Strict admin gate for Featured Work moderation. Delegates to the shared
// `isCallerAdmin` helper which accepts either `users.isAdmin = true` (set
// with `scripts/src/grant-admin.ts`) OR verified Clerk email matching the
// `ADMIN_EMAILS` allowlist. (The legacy `x-admin-secret` self-promotion
// header was removed for launch.)
async function requireAdminCaller(req: Request, res: Response): Promise<string | null> {
  return requireAdminCallerShared(req, res);
}

// =============================================================================
// Validation
// =============================================================================

type FieldErrors = Record<string, string>;

const URL_RE = /^https?:\/\/[^\s]+$/i;

function validateSubmission(body: unknown): { values: Omit<typeof featuredWorkTable.$inferInsert, "userId"> | null; fieldErrors: FieldErrors } {
  const fieldErrors: FieldErrors = {};
  const src = (body && typeof body === "object" ? body : {}) as Record<string, unknown>;

  const workType = typeof src.workType === "string" ? src.workType.trim() : "";
  if (!workType) fieldErrors.workType = "Please pick a work type.";
  else if (!WORK_TYPE_SET.has(workType)) fieldErrors.workType = "Unknown work type.";

  const title = typeof src.title === "string" ? src.title.trim() : "";
  if (!title) fieldErrors.title = "Title is required.";
  else if (title.length > MAX_FEATURED_TITLE_LENGTH) fieldErrors.title = `Title must be ${MAX_FEATURED_TITLE_LENGTH} characters or fewer.`;

  const abstract = typeof src.abstract === "string" ? src.abstract.trim() : "";
  if (!abstract) fieldErrors.abstract = "Abstract is required.";
  else if (abstract.length < MIN_FEATURED_ABSTRACT_LENGTH) fieldErrors.abstract = `Abstract must be at least ${MIN_FEATURED_ABSTRACT_LENGTH} characters.`;
  else if (abstract.length > MAX_FEATURED_ABSTRACT_LENGTH) fieldErrors.abstract = `Abstract must be ${MAX_FEATURED_ABSTRACT_LENGTH} characters or fewer.`;

  let externalLink: string | null = null;
  if (src.externalLink != null && src.externalLink !== "") {
    if (typeof src.externalLink !== "string" || !URL_RE.test(src.externalLink.trim())) {
      fieldErrors.externalLink = "Please enter a valid URL (starting with http:// or https://).";
    } else {
      externalLink = src.externalLink.trim();
    }
  }

  let coauthors: string | null = null;
  if (src.coauthors != null && src.coauthors !== "") {
    if (typeof src.coauthors !== "string") {
      fieldErrors.coauthors = "Invalid co-authors value.";
    } else {
      const t = src.coauthors.trim();
      if (t.length > MAX_FEATURED_COAUTHORS_LENGTH) {
        fieldErrors.coauthors = `Co-authors must be ${MAX_FEATURED_COAUTHORS_LENGTH} characters or fewer.`;
      } else if (t) {
        coauthors = t;
      }
    }
  }

  let venue: string | null = null;
  if (src.venue != null && src.venue !== "") {
    if (typeof src.venue !== "string") {
      fieldErrors.venue = "Invalid venue value.";
    } else {
      const t = src.venue.trim();
      if (t.length > MAX_FEATURED_VENUE_LENGTH) {
        fieldErrors.venue = `Venue must be ${MAX_FEATURED_VENUE_LENGTH} characters or fewer.`;
      } else if (t) {
        venue = t;
      }
    }
  }

  const displayName = typeof src.displayName === "string" ? src.displayName.trim() : "";
  if (!displayName) fieldErrors.displayName = "Display name is required.";
  else if (displayName.length > MAX_DISPLAY_NAME_LENGTH) fieldErrors.displayName = `Display name must be ${MAX_DISPLAY_NAME_LENGTH} characters or fewer.`;

  let tags: string[] = [];
  if (!Array.isArray(src.interestTags)) {
    fieldErrors.interestTags = "Pick at least one interest tag.";
  } else {
    const cleaned = src.interestTags.filter((t): t is string => typeof t === "string");
    const unknown = cleaned.find((t) => !INTEREST_TAGS_SET.has(t));
    if (unknown) {
      fieldErrors.interestTags = `Unknown tag: ${unknown}.`;
    } else if (cleaned.length < MIN_FEATURED_INTEREST_TAGS) {
      fieldErrors.interestTags = "Pick at least one interest tag.";
    } else if (cleaned.length > MAX_FEATURED_INTEREST_TAGS) {
      fieldErrors.interestTags = `Pick up to ${MAX_FEATURED_INTEREST_TAGS} interest tags.`;
    } else {
      tags = Array.from(new Set(cleaned));
    }
  }

  if (src.consent !== true) {
    fieldErrors.consent = "Please confirm the consent statement to submit.";
  }

  let fileUrl: string | null = null;
  if (src.fileUrl != null && src.fileUrl !== "") {
    if (typeof src.fileUrl !== "string" || !src.fileUrl.startsWith("/objects/")) {
      fieldErrors.fileUrl = "File upload not recognized. Please upload again.";
    } else {
      fileUrl = src.fileUrl;
    }
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { values: null, fieldErrors };
  }

  return {
    values: {
      workType,
      title,
      abstract,
      externalLink,
      coauthors,
      venue,
      displayName,
      interestTags: JSON.stringify(tags),
      fileUrl,
      status: "pending",
    },
    fieldErrors,
  };
}

// =============================================================================
// POST /api/featured-work — create a submission
// =============================================================================

router.post("/featured-work", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const { values, fieldErrors } = validateSubmission(req.body);
    if (!values) {
      res.status(400).json({ error: "Validation failed", fieldErrors });
      return;
    }

    // Ensure FK target.
    const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
    if (!existing) {
      await db.insert(usersTable).values({
        id: userId,
        onboardingComplete: true,
        usageCount: 0,
      }).onConflictDoNothing();
    }

    // Finalize uploaded PDF: verify the caller uploaded this object during the
    // current upload window, then set a private ACL with the submitter as
    // owner so /api/storage/objects/* serves it only to owner + admins. (The
    // ACL is private; public access happens only via the approved status
    // check in our route layer above.)
    let storedFileUrl: string | null = null;
    if (values.fileUrl) {
      if (!isUploadOwnedBy(values.fileUrl, userId)) {
        res.status(400).json({
          error: "Validation failed",
          fieldErrors: { fileUrl: "File upload not recognized. Please upload again." },
        });
        return;
      }
      try {
        // Server-side enforcement: fetch the actually-uploaded object's
        // metadata and verify content-type + size. The /storage/uploads/
        // request-url endpoint only sees client-claimed metadata, so a
        // caller could request a signed URL with claimed application/pdf
        // and then PUT arbitrary bytes. This is the authoritative check.
        const objectFile = await objectStorageService.getObjectEntityFile(values.fileUrl);
        const [metadata] = await objectFile.getMetadata();
        const contentType = String(metadata.contentType ?? "").toLowerCase();
        const sizeBytes = Number(metadata.size ?? 0);
        if (contentType !== "application/pdf") {
          res.status(400).json({
            error: "Validation failed",
            fieldErrors: { fileUrl: "Uploaded file must be a PDF." },
          });
          return;
        }
        if (sizeBytes > 25 * 1024 * 1024) {
          res.status(400).json({
            error: "Validation failed",
            fieldErrors: { fileUrl: "Uploaded file exceeds the 25 MB limit." },
          });
          return;
        }
        // Submit private: the file is owner+admin-only until the submission
        // is approved. The status PATCH endpoint flips it to public on
        // approval and back to private on rejection / revision.
        storedFileUrl = await objectStorageService.trySetObjectEntityAclPolicy(
          values.fileUrl,
          { owner: userId, visibility: "private" },
        );
        consumeUpload(values.fileUrl);
      } catch (aclErr) {
        req.log.warn({ err: aclErr }, "Failed to set ACL on featured-work upload");
        res.status(400).json({
          error: "Validation failed",
          fieldErrors: { fileUrl: "Could not attach uploaded file. Please re-upload." },
        });
        return;
      }
    }

    const [created] = await db
      .insert(featuredWorkTable)
      .values({ ...values, fileUrl: storedFileUrl, userId })
      .returning();

    res.status(201).json(serialize(created, null, true));
  } catch (err) {
    req.log.error({ err }, "Error creating featured work submission");
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// GET /api/featured-work — public approved archive
// =============================================================================

router.get("/featured-work", async (req: Request, res: Response): Promise<void> => {
  try {
    const workTypeFilter = typeof req.query.workType === "string" ? req.query.workType : null;
    const tagFilter = typeof req.query.tag === "string" ? req.query.tag : null;
    const q = typeof req.query.q === "string" ? req.query.q.trim() : "";
    const limit = Math.min(Math.max(parseInt(String(req.query.limit ?? "24"), 10) || 24, 1), 60);
    const offset = Math.max(parseInt(String(req.query.offset ?? "0"), 10) || 0, 0);

    const conditions = [eq(featuredWorkTable.status, "approved")];
    if (workTypeFilter && WORK_TYPE_SET.has(workTypeFilter)) {
      conditions.push(eq(featuredWorkTable.workType, workTypeFilter));
    }
    if (tagFilter && INTEREST_TAGS_SET.has(tagFilter)) {
      // interestTags is stored as JSON-encoded string[]; LIKE works because we
      // always JSON.stringify (so each tag appears as `"<tag>"` exactly).
      conditions.push(sql`${featuredWorkTable.interestTags} LIKE ${"%" + JSON.stringify(tagFilter).slice(1, -1).replace(/[%_]/g, "\\$&") + "%"}`);
    }
    if (q) {
      const escaped = `%${q.replace(/[%_]/g, "\\$&")}%`;
      const titleOrAbstract = or(
        ilike(featuredWorkTable.title, escaped),
        ilike(featuredWorkTable.abstract, escaped),
        ilike(featuredWorkTable.displayName, escaped),
      );
      if (titleOrAbstract) conditions.push(titleOrAbstract);
    }

    const rows = await db
      .select()
      .from(featuredWorkTable)
      .where(and(...conditions))
      .orderBy(desc(featuredWorkTable.approvedAt), desc(featuredWorkTable.createdAt))
      .limit(limit)
      .offset(offset);

    const profileMap = await loadSubmitterProfiles(rows.map((r) => r.userId));
    res.json(rows.map((r) => serialize(r, profileMap.get(r.userId) ?? null, false)));
  } catch (err) {
    req.log.error({ err }, "Error listing featured work");
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// GET /api/featured-work/spotlight — daily-rotating pick
// =============================================================================

router.get("/featured-work/spotlight", async (req: Request, res: Response): Promise<void> => {
  try {
    // Weight toward recent: pull the 25 most recently approved and pick a
    // deterministic index based on today's date so the spotlight rotates
    // ~daily for all viewers, independent of caller.
    const pool = await db
      .select()
      .from(featuredWorkTable)
      .where(eq(featuredWorkTable.status, "approved"))
      .orderBy(desc(featuredWorkTable.approvedAt), desc(featuredWorkTable.createdAt))
      .limit(25);

    if (pool.length === 0) {
      res.json(null);
      return;
    }

    const dayBucket = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
    // Linearly weight the front of the pool (most recent gets ~5x weight).
    const weights = pool.map((_, i) => Math.max(1, pool.length - i));
    const totalWeight = weights.reduce((s, w) => s + w, 0);
    // Pseudo-random index seeded by day bucket, scaled to totalWeight.
    let pick = ((dayBucket * 2654435761) % totalWeight + totalWeight) % totalWeight;
    let idx = 0;
    for (let i = 0; i < weights.length; i++) {
      if (pick < weights[i]) { idx = i; break; }
      pick -= weights[i];
    }

    const chosen = pool[idx];
    const profileMap = await loadSubmitterProfiles([chosen.userId]);
    res.json(serialize(chosen, profileMap.get(chosen.userId) ?? null, false));
  } catch (err) {
    req.log.error({ err }, "Error fetching spotlight");
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// GET /api/featured-work/mine — current user's submissions (any status)
// =============================================================================

router.get("/featured-work/mine", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const rows = await db
      .select()
      .from(featuredWorkTable)
      .where(eq(featuredWorkTable.userId, userId))
      .orderBy(desc(featuredWorkTable.createdAt));
    const profileMap = await loadSubmitterProfiles([userId]);
    res.json(rows.map((r) => serialize(r, profileMap.get(r.userId) ?? null, true)));
  } catch (err) {
    req.log.error({ err }, "Error listing my submissions");
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// GET /api/featured-work/:id — single detail (approved OR owner OR admin)
// =============================================================================

router.get("/featured-work/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseIntParam(req, res, "id");
    if (id === null) return;
    const [row] = await db.select().from(featuredWorkTable).where(eq(featuredWorkTable.id, id));
    if (!row) { res.status(404).json({ error: "Not found" }); return; }

    const callerId = getOptionalUserId(req);
    const isOwner = !!callerId && callerId === row.userId;
    // Use the shared admin check so the allowlisted owner (admin@psychprosuite.com)
    // can view their own non-approved drafts even before the DB row has
    // self-healed via a prior /feedback/is-admin call.
    const callerIsAdmin = callerId ? await isCallerAdmin(req) : false;
    if (row.status !== "approved" && !isOwner && !callerIsAdmin) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const profileMap = await loadSubmitterProfiles([row.userId]);
    res.json(serialize(row, profileMap.get(row.userId) ?? null, isOwner || callerIsAdmin));
  } catch (err) {
    req.log.error({ err }, "Error fetching featured work detail");
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// Admin
// =============================================================================

router.get("/admin/featured-work", async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = await requireAdminCaller(req, res);
    if (!adminId) return;

    const statusFilter = typeof req.query.status === "string" ? req.query.status : null;
    const conditions = [];
    if (statusFilter && (FEATURED_WORK_STATUSES as readonly string[]).includes(statusFilter)) {
      conditions.push(eq(featuredWorkTable.status, statusFilter));
    }
    const rows = await db
      .select()
      .from(featuredWorkTable)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(featuredWorkTable.createdAt));

    const profileMap = await loadSubmitterProfiles(rows.map((r) => r.userId));
    res.json(rows.map((r) => serialize(r, profileMap.get(r.userId) ?? null, true)));
  } catch (err) {
    req.log.error({ err }, "Error listing admin featured work");
    res.status(500).json({ error: "Internal server error" });
  }
});

const VALID_TRANSITIONS: Record<string, FeaturedWorkStatus[]> = {
  pending: ["approved", "rejected", "revision_requested"],
  revision_requested: ["approved", "rejected", "revision_requested"],
  rejected: ["approved", "revision_requested"],
  approved: ["rejected", "revision_requested"],
};

const STATUS_NOTIFICATION: Record<FeaturedWorkStatus, { title: string; body: (note: string | null) => string }> = {
  pending: {
    title: "Submission received",
    body: () => "Your Featured Work submission is awaiting review.",
  },
  approved: {
    title: "Your Featured Work was approved",
    body: () => "It's now live in the Studio archive and eligible for the dashboard spotlight.",
  },
  rejected: {
    title: "Your Featured Work submission was not accepted",
    body: (note) => note ? `Reviewer note: ${note}` : "Please review and consider re-submitting.",
  },
  revision_requested: {
    title: "Revision requested on your Featured Work",
    body: (note) => note ? `Reviewer note: ${note}` : "Please update your submission and re-submit.",
  },
};

router.patch("/admin/featured-work/:id", async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = await requireAdminCaller(req, res);
    if (!adminId) return;
    const id = parseIntParam(req, res, "id");
    if (id === null) return;

    const { status: rawStatus, adminNote: rawNote } = (req.body ?? {}) as { status?: unknown; adminNote?: unknown };
    if (typeof rawStatus !== "string" || !(FEATURED_WORK_STATUSES as readonly string[]).includes(rawStatus)) {
      res.status(400).json({ error: "Invalid status" });
      return;
    }
    const status = rawStatus as FeaturedWorkStatus;
    let adminNote: string | null = null;
    if (rawNote != null && rawNote !== "") {
      if (typeof rawNote !== "string") {
        res.status(400).json({ error: "Invalid adminNote" });
        return;
      }
      const t = rawNote.trim();
      if (t.length > MAX_FEATURED_ADMIN_NOTE_LENGTH) {
        res.status(400).json({ error: `adminNote must be ${MAX_FEATURED_ADMIN_NOTE_LENGTH} characters or fewer.` });
        return;
      }
      adminNote = t || null;
    }

    const [existing] = await db.select().from(featuredWorkTable).where(eq(featuredWorkTable.id, id));
    if (!existing) { res.status(404).json({ error: "Not found" }); return; }

    const allowed = VALID_TRANSITIONS[existing.status] ?? [];
    if (existing.status !== status && !allowed.includes(status)) {
      res.status(400).json({ error: `Cannot transition from ${existing.status} to ${status}` });
      return;
    }

    const now = new Date();
    const patch: Partial<typeof featuredWorkTable.$inferInsert> = {
      status,
      adminNote,
      reviewedAt: now,
    };
    if (status === "approved" && !existing.approvedAt) {
      patch.approvedAt = now;
    }

    const [updated] = await db
      .update(featuredWorkTable)
      .set(patch)
      .where(eq(featuredWorkTable.id, id))
      .returning();

    // Sync the attached PDF's ACL with the moderation decision: approved
    // submissions need a publicly-readable file so the archive download
    // link works for everyone; rejected / revision_requested must revert
    // to private so a previously-approved-then-pulled file is no longer
    // accessible to non-owners.
    if (updated.fileUrl) {
      try {
        const visibility = status === "approved" ? "public" : "private";
        await objectStorageService.trySetObjectEntityAclPolicy(updated.fileUrl, {
          owner: updated.userId,
          visibility,
        });
      } catch (aclErr) {
        req.log.warn({ err: aclErr, id: updated.id }, "Failed to sync featured-work file ACL on status change");
      }
    }

    // In-app notification for the submitter. Email is intentionally omitted —
    // see TODO note below: the email-sender shipped with Connections (#67)
    // can hook into this same call site.
    const tpl = STATUS_NOTIFICATION[status];
    await db.insert(notificationsTable).values({
      userId: existing.userId,
      kind: `featured_work.${status}`,
      title: tpl.title,
      body: tpl.body(adminNote),
      href: `/featured-work?submission=${existing.id}`,
    });

    // Email notification — uses the same email helper as Connections.
    // In dev with no RESEND_API_KEY this logs the payload to the api-server
    // workflow console; in prod with EMAIL_ENABLED + RESEND_API_KEY it sends
    // via Resend. Failures are swallowed so a transient email outage never
    // blocks the moderation decision (in-app notification still succeeds).
    try {
      const [submitter] = await db
        .select({ email: usersTable.email })
        .from(usersTable)
        .where(eq(usersTable.id, existing.userId));
      if (submitter?.email) {
        const noteLine = adminNote ? `\n\nReviewer note: ${adminNote}\n` : "";
        const text =
          `Hi ${updated.displayName},\n\n${tpl.title}.\n\n` +
          `Submission: ${updated.title}${noteLine}\n` +
          `View it here: ${process.env.PUBLIC_APP_URL ?? ""}/featured-work?submission=${updated.id}\n\n` +
          `— PsychPro`;
        await sendEmail({
          to: submitter.email,
          subject: `PsychPro · ${tpl.title}`,
          text,
          html: `<p>Hi ${updated.displayName},</p><p><strong>${tpl.title}.</strong></p>` +
            `<p>Submission: <em>${updated.title}</em></p>` +
            (adminNote ? `<p>Reviewer note: ${adminNote}</p>` : "") +
            `<p><a href="${process.env.PUBLIC_APP_URL ?? ""}/featured-work?submission=${updated.id}">View it on PsychPro</a></p>`,
        });
      }
    } catch (mailErr) {
      req.log.warn({ err: mailErr, id: updated.id }, "Featured Work status email failed (non-fatal)");
    }

    const profileMap = await loadSubmitterProfiles([updated.userId]);
    res.json(serialize(updated, profileMap.get(updated.userId) ?? null, true));
  } catch (err) {
    req.log.error({ err }, "Error updating featured work status");
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// Notifications (lightweight — used by Featured Work today; reusable for #67)
// =============================================================================

router.get("/notifications", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const rows = await db
      .select()
      .from(notificationsTable)
      .where(eq(notificationsTable.userId, userId))
      .orderBy(desc(notificationsTable.createdAt))
      .limit(50);
    res.json(rows.map((r) => ({
      id: r.id,
      kind: r.kind,
      title: r.title,
      body: r.body,
      href: r.href,
      readAt: r.readAt ? r.readAt.toISOString() : null,
      createdAt: r.createdAt.toISOString(),
    })));
  } catch (err) {
    req.log.error({ err }, "Error listing notifications");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/notifications/:id/read", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const id = parseIntParam(req, res, "id");
    if (id === null) return;
    await db.update(notificationsTable)
      .set({ readAt: new Date() })
      .where(and(eq(notificationsTable.id, id), eq(notificationsTable.userId, userId)));
    res.status(204).send();
  } catch (err) {
    req.log.error({ err }, "Error marking notification read");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
