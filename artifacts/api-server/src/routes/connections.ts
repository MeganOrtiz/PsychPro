import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import {
  connectionRequestsTable,
  connectionsAuditLogTable,
  notificationsTable,
  userBlocksTable,
  userProfilesTable,
  usersTable,
} from "@workspace/db";
import {
  CONNECTION_REQUESTS_PER_WEEK,
  CONNECTIONS_SUGGESTIONS_PAGE_SIZE,
  CONNECTION_SHARED_TAGS_HIGHLIGHTED,
  CONNECTION_BIO_PREVIEW_LENGTH,
} from "@workspace/community";
import { and, count, desc, eq, gt, gte, inArray, ne, or, sql } from "drizzle-orm";
import { requireUserId } from "../lib/userId";
import { parseIntParam } from "../lib/params";
import { sendEmail } from "../lib/email";

const router: IRouter = Router();

// =============================================================================
// Helpers
// =============================================================================

type ProfileRow = typeof userProfilesTable.$inferSelect;

function parseTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((t): t is string => typeof t === "string");
  } catch {
    return [];
  }
}

function intersection(a: string[], b: string[]): string[] {
  const setB = new Set(b);
  const seen = new Set<string>();
  const out: string[] = [];
  for (const t of a) {
    if (setB.has(t) && !seen.has(t)) {
      seen.add(t);
      out.push(t);
    }
  }
  return out;
}

function bioPreview(bio: string | null): string | null {
  if (!bio) return null;
  if (bio.length <= CONNECTION_BIO_PREVIEW_LENGTH) return bio;
  return `${bio.slice(0, CONNECTION_BIO_PREVIEW_LENGTH).trimEnd()}…`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function getProfile(userId: string): Promise<ProfileRow | null> {
  const [row] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.userId, userId));
  return row ?? null;
}

async function isAdmin(userId: string): Promise<boolean> {
  const [u] = await db
    .select({ isAdmin: usersTable.isAdmin })
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  return !!u?.isAdmin;
}

async function requireAdminCaller(req: Request, res: Response): Promise<string | null> {
  const userId = requireUserId(req, res);
  if (!userId) return null;
  if (await isAdmin(userId)) return userId;
  res.status(403).json({ error: "Admin access required" });
  return null;
}

// =============================================================================
// Suggestions
// =============================================================================

router.get("/connections/suggestions", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    const me = await getProfile(userId);
    if (!me) {
      res.json({ suggestions: [], hasMore: false });
      return;
    }
    const myTags = parseTags(me.interests);
    // Double opt-in is the privacy contract: a caller who has either
    // toggle off cannot see suggestions AND must not be suggested to
    // others. The latter is enforced by the candidate filter below; the
    // former is enforced here.
    if (
      !me.prefSuggestConnections ||
      !me.prefNetworkingIntros ||
      myTags.length === 0
    ) {
      res.json({ suggestions: [], hasMore: false, total: 0 });
      return;
    }

    const limit = Math.min(
      Number(req.query.limit) || CONNECTIONS_SUGGESTIONS_PAGE_SIZE,
      50,
    );
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    // Candidates: opted-in profiles other than the caller.
    const candidates = await db
      .select({
        userId: userProfilesTable.userId,
        displayName: userProfilesTable.displayName,
        profilePhotoUrl: userProfilesTable.profilePhotoUrl,
        currentRole: userProfilesTable.currentRole,
        institution: userProfilesTable.institution,
        bio: userProfilesTable.bio,
        interests: userProfilesTable.interests,
        updatedAt: userProfilesTable.updatedAt,
      })
      .from(userProfilesTable)
      .where(
        and(
          ne(userProfilesTable.userId, userId),
          eq(userProfilesTable.prefSuggestConnections, true),
          eq(userProfilesTable.prefNetworkingIntros, true),
        ),
      );

    // Exclude: blocked-by-me, blocked-me, already-connected (accepted),
    // already-declined-from-me, currently-pending-from-me.
    const [blockedRows, requestRows] = await Promise.all([
      db
        .select({ blocker: userBlocksTable.blockerId, blocked: userBlocksTable.blockedId })
        .from(userBlocksTable)
        .where(
          or(eq(userBlocksTable.blockerId, userId), eq(userBlocksTable.blockedId, userId)),
        ),
      db
        .select({
          requesterId: connectionRequestsTable.requesterId,
          recipientId: connectionRequestsTable.recipientId,
          status: connectionRequestsTable.status,
        })
        .from(connectionRequestsTable)
        .where(
          or(
            eq(connectionRequestsTable.requesterId, userId),
            eq(connectionRequestsTable.recipientId, userId),
          ),
        ),
    ]);

    const excluded = new Set<string>();
    for (const b of blockedRows) {
      if (b.blocker === userId) excluded.add(b.blocked);
      if (b.blocked === userId) excluded.add(b.blocker);
    }
    for (const r of requestRows) {
      const other = r.requesterId === userId ? r.recipientId : r.requesterId;
      // Hide ANY existing relationship in either direction: accepted,
      // blocked, declined (resolved final states) AND pending (in flight).
      // Showing someone who already has a pending request with the caller
      // — even if the caller is the recipient — would invite duplicate
      // outgoing requests and confuse the flow. The Incoming list is the
      // correct surface for pending-to-me requests.
      if (
        r.status === "accepted" ||
        r.status === "blocked" ||
        r.status === "declined" ||
        r.status === "pending"
      ) {
        excluded.add(other);
      }
    }

    type Scored = {
      userId: string;
      displayName: string;
      profilePhotoUrl: string | null;
      currentRole: string | null;
      institution: string | null;
      bioPreview: string | null;
      sharedTags: string[];
      highlightedTags: string[];
      overlapCount: number;
      updatedAt: Date;
    };

    const scored: Scored[] = [];
    for (const c of candidates) {
      if (excluded.has(c.userId)) continue;
      const tags = parseTags(c.interests);
      const shared = intersection(myTags, tags);
      if (shared.length === 0) continue;
      scored.push({
        userId: c.userId,
        displayName: c.displayName ?? "Anonymous member",
        profilePhotoUrl: c.profilePhotoUrl,
        currentRole: c.currentRole,
        institution: c.institution,
        bioPreview: bioPreview(c.bio),
        sharedTags: shared,
        highlightedTags: shared.slice(0, CONNECTION_SHARED_TAGS_HIGHLIGHTED),
        overlapCount: shared.length,
        updatedAt: c.updatedAt,
      });
    }

    scored.sort((a, b) => {
      if (b.overlapCount !== a.overlapCount) return b.overlapCount - a.overlapCount;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });

    const page = scored.slice(offset, offset + limit);
    res.json({
      suggestions: page.map((s) => ({
        userId: s.userId,
        displayName: s.displayName,
        profilePhotoUrl: s.profilePhotoUrl,
        currentRole: s.currentRole,
        institution: s.institution,
        bioPreview: s.bioPreview,
        sharedTags: s.sharedTags,
        highlightedTags: s.highlightedTags,
        overlapCount: s.overlapCount,
      })),
      hasMore: scored.length > offset + limit,
      total: scored.length,
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching connection suggestions");
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// Outgoing request
// =============================================================================

router.post("/connections/requests", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const { recipientId } = (req.body ?? {}) as { recipientId?: string };
    if (typeof recipientId !== "string" || !recipientId.trim()) {
      res.status(400).json({ error: "recipientId is required" });
      return;
    }
    if (recipientId === userId) {
      res.status(400).json({ error: "Cannot connect with yourself" });
      return;
    }

    const [me, recipient] = await Promise.all([getProfile(userId), getProfile(recipientId)]);
    if (!recipient) {
      res.status(404).json({ error: "Recipient not found" });
      return;
    }
    if (!me || !me.prefSuggestConnections || !me.prefNetworkingIntros) {
      // Requester must also be opted in to both toggles. This makes the
      // intro genuinely double opt-in (task #67 privacy contract).
      res.status(403).json({
        error:
          "Turn on connection suggestions and networking introductions in your profile before sending a request.",
      });
      return;
    }
    if (!recipient.prefSuggestConnections || !recipient.prefNetworkingIntros) {
      res.status(403).json({ error: "Recipient is not open to introductions" });
      return;
    }

    // Recipient blocked me — fail silently as if request went through so we
    // never reveal the block status.
    const [blockRow] = await db
      .select()
      .from(userBlocksTable)
      .where(
        and(eq(userBlocksTable.blockerId, recipientId), eq(userBlocksTable.blockedId, userId)),
      );
    if (blockRow) {
      res.status(202).json({ status: "sent", silent: true });
      return;
    }

    // Existing non-cancellable request between us — block duplicates.
    const [existing] = await db
      .select()
      .from(connectionRequestsTable)
      .where(
        and(
          or(
            and(
              eq(connectionRequestsTable.requesterId, userId),
              eq(connectionRequestsTable.recipientId, recipientId),
            ),
            and(
              eq(connectionRequestsTable.requesterId, recipientId),
              eq(connectionRequestsTable.recipientId, userId),
            ),
          ),
          inArray(connectionRequestsTable.status, ["pending", "accepted", "declined", "blocked"]),
        ),
      );
    if (existing) {
      if (existing.status === "pending") {
        // Idempotent — repeat submissions of the same pending pair return
        // the existing row instead of erroring. This makes the client safe
        // to retry on flaky networks without producing 409 noise.
        res.status(200).json({
          id: existing.id,
          status: existing.status,
          recipientDisplayName: recipient.displayName,
          sharedTags: parseTags(existing.sharedTags),
          duplicate: true,
        });
        return;
      }
      res.status(409).json({ error: "You can't request this connection right now." });
      return;
    }

    // Rate limit: 5 outgoing per rolling 7 days.
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [{ value: outgoingCount }] = await db
      .select({ value: count() })
      .from(connectionRequestsTable)
      .where(
        and(
          eq(connectionRequestsTable.requesterId, userId),
          gt(connectionRequestsTable.createdAt, since),
        ),
      );
    if (Number(outgoingCount) >= CONNECTION_REQUESTS_PER_WEEK) {
      res.status(429).json({
        error: `You've sent the maximum of ${CONNECTION_REQUESTS_PER_WEEK} connection requests this week. Try again in a few days.`,
      });
      return;
    }

    // Snapshot shared tags at request time. Suggestions only surface
    // overlapping profiles, so an empty overlap here means the caller
    // is hitting the API directly outside the intended flow; reject to
    // preserve the "shared-interest match" contract.
    const myTags = parseTags(me?.interests ?? null);
    const theirTags = parseTags(recipient.interests);
    const shared = intersection(myTags, theirTags);
    if (shared.length === 0) {
      res.status(400).json({
        error:
          "You don't share any interest tags with this member yet. Add overlapping interests to your profile to connect.",
      });
      return;
    }

    let created: typeof connectionRequestsTable.$inferSelect;
    try {
      [created] = await db
        .insert(connectionRequestsTable)
        .values({
          requesterId: userId,
          recipientId,
          status: "pending",
          sharedTags: JSON.stringify(shared),
        })
        .returning();
    } catch (insertErr) {
      // Race against the partial unique index — another concurrent POST
      // beat us to inserting the same (requester, recipient) pending row.
      // Treat as idempotent and return the existing row, matching the
      // duplicate-check branch above.
      const code = (insertErr as { code?: string } | null)?.code;
      if (code === "23505") {
        const [existingRow] = await db
          .select()
          .from(connectionRequestsTable)
          .where(
            and(
              eq(connectionRequestsTable.requesterId, userId),
              eq(connectionRequestsTable.recipientId, recipientId),
              eq(connectionRequestsTable.status, "pending"),
            ),
          );
        if (existingRow) {
          res.status(200).json({
            id: existingRow.id,
            status: existingRow.status,
            recipientDisplayName: recipient.displayName,
            sharedTags: parseTags(existingRow.sharedTags),
            duplicate: true,
          });
          return;
        }
      }
      throw insertErr;
    }

    // Notification for recipient — does NOT include the requester's email.
    const appUrl = process.env.PUBLIC_APP_URL ?? "https://psychpro.app";
    const incomingUrl = `${appUrl}/connections?incoming=${created.id}`;
    const topShared = shared.slice(0, CONNECTION_SHARED_TAGS_HIGHLIGHTED).join(", ") ||
      "shared interests";
    await db.insert(notificationsTable).values({
      userId: recipientId,
      kind: "connection.request",
      title: "Someone wants to connect",
      body: `A fellow PsychPro user is interested in connecting based on your shared interest in ${topShared}.`,
      href: `/connections?incoming=${created.id}`,
    });

    // Email recipient — no requester email leaked.
    const [recipientUser] = await db
      .select({ email: usersTable.email })
      .from(usersTable)
      .where(eq(usersTable.id, recipientId));
    if (recipientUser?.email) {
      const recipName = recipient.displayName ?? "there";
      await sendEmail({
        to: recipientUser.email,
        subject: "Someone on PsychPro wants to connect",
        text:
          `Hi ${recipName},\n\n` +
          `A fellow PsychPro user is interested in connecting based on your ` +
          `shared interest in ${topShared}.\n\n` +
          `View their profile and decide if you'd like to connect: ` +
          `${incomingUrl}\n\n` +
          `If you accept, we'll send one introduction email to both of you. ` +
          `If you decline, we'll silently close the request and they won't be notified.`,
        html:
          `<p>Hi ${escapeHtml(recipName)},</p>` +
          `<p>A fellow PsychPro user is interested in connecting based on your ` +
          `shared interest in <strong>${escapeHtml(topShared)}</strong>.</p>` +
          `<p><a href="${incomingUrl}">` +
          `View their profile and decide</a>.</p>` +
          `<p>If you accept, we'll send one introduction email to both of you. ` +
          `If you decline, we'll silently close the request and they won't be notified.</p>`,
      });
    }

    res.status(201).json({
      id: created.id,
      status: created.status,
      recipientDisplayName: recipient.displayName,
      sharedTags: shared,
    });
  } catch (err) {
    req.log.error({ err }, "Error creating connection request");
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// Incoming list (pending requests where caller is recipient)
// =============================================================================

router.get("/connections/incoming", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const rows = await db
      .select()
      .from(connectionRequestsTable)
      .where(
        and(
          eq(connectionRequestsTable.recipientId, userId),
          eq(connectionRequestsTable.status, "pending"),
        ),
      )
      .orderBy(desc(connectionRequestsTable.createdAt));

    if (rows.length === 0) {
      res.json([]);
      return;
    }

    const requesterIds = Array.from(new Set(rows.map((r) => r.requesterId)));
    const profiles = await db
      .select()
      .from(userProfilesTable)
      .where(inArray(userProfilesTable.userId, requesterIds));
    const profMap = new Map<string, ProfileRow>(profiles.map((p) => [p.userId, p]));

    res.json(
      rows.map((r) => {
        const p = profMap.get(r.requesterId);
        return {
          id: r.id,
          // We expose the requester userId so the UI can deep-link to their
          // public profile page (/u/:userId). The public profile route
          // already enforces prefShowOnFeaturedWork; even when hidden, the
          // recipient still has enough context (name, role, shared tags) to
          // decide.
          requesterId: r.requesterId,
          requesterDisplayName: p?.displayName ?? "PsychPro member",
          requesterRole: p?.currentRole ?? null,
          requesterInstitution: p?.institution ?? null,
          requesterBio: p?.bio ?? null,
          sharedTags: parseTags(r.sharedTags),
          createdAt: r.createdAt.toISOString(),
        };
      }),
    );
  } catch (err) {
    req.log.error({ err }, "Error listing incoming requests");
    res.status(500).json({ error: "Internal server error" });
  }
});

// =============================================================================
// Respond
// =============================================================================

router.post(
  "/connections/requests/:id/respond",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = requireUserId(req, res);
      if (!userId) return;
      const id = parseIntParam(req, res, "id");
      if (id === null) return;
      const { action } = (req.body ?? {}) as { action?: string };
      if (action !== "accept" && action !== "decline" && action !== "block") {
        res.status(400).json({ error: "action must be 'accept' | 'decline' | 'block'" });
        return;
      }

      const [request] = await db
        .select()
        .from(connectionRequestsTable)
        .where(eq(connectionRequestsTable.id, id));
      if (!request) {
        res.status(404).json({ error: "Request not found" });
        return;
      }
      if (request.recipientId !== userId) {
        res.status(403).json({ error: "Not your request to respond to" });
        return;
      }
      if (request.status !== "pending") {
        res.status(409).json({ error: "Request is no longer pending" });
        return;
      }

      const now = new Date();
      const sharedTags = parseTags(request.sharedTags);

      if (action === "decline") {
        await db
          .update(connectionRequestsTable)
          .set({ status: "declined", respondedAt: now })
          .where(eq(connectionRequestsTable.id, id));
        // Intentionally NO notification to requester per task spec.
        res.json({ id, status: "declined" });
        return;
      }

      if (action === "block") {
        await db
          .update(connectionRequestsTable)
          .set({ status: "blocked", respondedAt: now })
          .where(eq(connectionRequestsTable.id, id));
        // Add to blocker's block list (recipient blocks requester).
        await db
          .insert(userBlocksTable)
          .values({ blockerId: userId, blockedId: request.requesterId });
        res.json({ id, status: "blocked" });
        return;
      }

      // Accept — send single intro email CC'ing both users.
      const [requesterUser, recipientUser] = await Promise.all([
        db
          .select({ email: usersTable.email })
          .from(usersTable)
          .where(eq(usersTable.id, request.requesterId))
          .then((rows) => rows[0]),
        db
          .select({ email: usersTable.email })
          .from(usersTable)
          .where(eq(usersTable.id, userId))
          .then((rows) => rows[0]),
      ]);
      const [requesterProfile, recipientProfile] = await Promise.all([
        getProfile(request.requesterId),
        getProfile(userId),
      ]);

      // The user-facing contract for "Accept" is "we send a single intro
      // email to both of you". If either party is missing an email on file
      // we cannot honor that contract, so we refuse the accept (leaving the
      // request pending) and surface a clear, actionable error rather than
      // silently mark accepted with no email sent.
      if (!requesterUser?.email || !recipientUser?.email) {
        req.log.warn(
          {
            requestId: id,
            requesterHasEmail: !!requesterUser?.email,
            recipientHasEmail: !!recipientUser?.email,
          },
          "Accept refused: missing email on one or both users",
        );
        res.status(422).json({
          error:
            "We couldn't send the intro email because one of you doesn't have an email on file. Please add it in your account and try again.",
        });
        return;
      }

      let introEmailSentAt: Date | null = null;
      {
        const aName = requesterProfile?.displayName ?? "PsychPro member";
        const bName = recipientProfile?.displayName ?? "PsychPro member";
        const tagList = sharedTags.length > 0 ? sharedTags.join(", ") : "shared interests";
        const body = (who: string, role: string | null, inst: string | null, bio: string | null) =>
          `${who}${role ? ` — ${role}` : ""}${inst ? ` (${inst})` : ""}` +
          (bio ? `\n${bio}` : "");

        const text =
          `Hi ${aName} and ${bName},\n\n` +
          `You both opted in to PsychPro introductions and your interests overlap on: ${tagList}.\n\n` +
          `--- ${aName} ---\n` +
          `${body(aName, requesterProfile?.currentRole ?? null, requesterProfile?.institution ?? null, requesterProfile?.bio ?? null)}\n\n` +
          `--- ${bName} ---\n` +
          `${body(bName, recipientProfile?.currentRole ?? null, recipientProfile?.institution ?? null, recipientProfile?.bio ?? null)}\n\n` +
          `From here, PsychPro steps out of the conversation — just reply-all to keep it going.`;

        const html =
          `<p>Hi ${escapeHtml(aName)} and ${escapeHtml(bName)},</p>` +
          `<p>You both opted in to PsychPro introductions and your interests overlap on: ` +
          `<strong>${escapeHtml(tagList)}</strong>.</p>` +
          `<h3>${escapeHtml(aName)}</h3>` +
          `<p>${escapeHtml(requesterProfile?.currentRole ?? "")}` +
          `${requesterProfile?.institution ? ` — ${escapeHtml(requesterProfile.institution)}` : ""}</p>` +
          `${requesterProfile?.bio ? `<p>${escapeHtml(requesterProfile.bio)}</p>` : ""}` +
          `<h3>${escapeHtml(bName)}</h3>` +
          `<p>${escapeHtml(recipientProfile?.currentRole ?? "")}` +
          `${recipientProfile?.institution ? ` — ${escapeHtml(recipientProfile.institution)}` : ""}</p>` +
          `${recipientProfile?.bio ? `<p>${escapeHtml(recipientProfile.bio)}</p>` : ""}` +
          `<p><em>From here, PsychPro steps out of the conversation — just reply-all to keep it going.</em></p>`;

        const result = await sendEmail({
          to: requesterUser.email,
          cc: recipientUser.email,
          subject: `PsychPro intro: ${aName} ↔ ${bName}`,
          text,
          html,
        });
        if (!result.ok) {
          req.log.error({ result }, "Intro email send failed");
          res.status(502).json({
            error:
              "We couldn't send the intro email right now. Please try again in a moment — your request is still pending.",
          });
          return;
        }
        introEmailSentAt = now;
      }

      await db
        .update(connectionRequestsTable)
        .set({ status: "accepted", respondedAt: now, introEmailSentAt })
        .where(eq(connectionRequestsTable.id, id));

      res.json({ id, status: "accepted", introEmailSentAt: introEmailSentAt?.toISOString() ?? null });
    } catch (err) {
      req.log.error({ err }, "Error responding to connection request");
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

// =============================================================================
// Admin: aggregate stats only
// =============================================================================

router.get("/admin/connections/stats", async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = await requireAdminCaller(req, res);
    if (!adminId) return;
    const days = Math.min(Math.max(Number(req.query.days) || 30, 1), 365);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const rows = await db
      .select({
        status: connectionRequestsTable.status,
        value: count(),
      })
      .from(connectionRequestsTable)
      .where(gte(connectionRequestsTable.createdAt, since))
      .groupBy(connectionRequestsTable.status);

    const stats = { pending: 0, accepted: 0, declined: 0, blocked: 0 };
    for (const r of rows) {
      if (r.status in stats) {
        (stats as Record<string, number>)[r.status] = Number(r.value);
      }
    }
    const [{ value: introSentValue }] = await db
      .select({ value: count() })
      .from(connectionRequestsTable)
      .where(
        and(
          gte(connectionRequestsTable.createdAt, since),
          sql`${connectionRequestsTable.introEmailSentAt} is not null`,
        ),
      );

    const [{ value: blockListValue }] = await db
      .select({ value: count() })
      .from(userBlocksTable)
      .where(gte(userBlocksTable.createdAt, since));

    res.json({
      days,
      ...stats,
      introEmailsSent: Number(introSentValue),
      blocksRecorded: Number(blockListValue),
    });
  } catch (err) {
    req.log.error({ err }, "Error fetching connection stats");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/admin/connections/audit", async (req: Request, res: Response): Promise<void> => {
  try {
    const adminId = await requireAdminCaller(req, res);
    if (!adminId) return;
    const { reason, targetRequestId } = (req.body ?? {}) as {
      reason?: string;
      targetRequestId?: number;
    };
    if (!reason || typeof reason !== "string" || reason.trim().length < 10) {
      res.status(400).json({ error: "Reason (≥10 chars) is required for an audit reveal." });
      return;
    }
    await db.insert(connectionsAuditLogTable).values({
      adminUserId: adminId,
      action: "investigate_abuse",
      targetRequestId: typeof targetRequestId === "number" ? targetRequestId : null,
      reason: reason.trim(),
    });
    res.status(201).json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Error writing audit log");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
