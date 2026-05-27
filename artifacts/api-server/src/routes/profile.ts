import { Router, type IRouter, type Request, type Response } from "express";
import { db } from "@workspace/db";
import { userProfilesTable, usersTable } from "@workspace/db";
import {
  PROFILE_ROLES,
  INTEREST_TAGS_SET,
  MAX_INTERESTS,
  MAX_BIO_LENGTH,
  MAX_DISPLAY_NAME_LENGTH,
  MAX_INSTITUTION_LENGTH,
} from "@workspace/community";
import { eq } from "drizzle-orm";
import { requireUserId } from "../lib/userId";
import { ObjectStorageService } from "../lib/objectStorage";
import { isUploadOwnedBy, consumeUpload } from "./storage";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

type ProfilePayload = {
  userId: string;
  displayName: string | null;
  profilePhotoUrl: string | null;
  currentRole: string | null;
  institution: string | null;
  bio: string | null;
  interests: string[];
  prefSuggestConnections: boolean;
  prefNetworkingIntros: boolean;
  prefShowOnFeaturedWork: boolean;
};

function serialize(row: typeof userProfilesTable.$inferSelect): ProfilePayload {
  let interests: string[] = [];
  try {
    const parsed = JSON.parse(row.interests ?? "[]");
    if (Array.isArray(parsed)) {
      interests = parsed.filter((t): t is string => typeof t === "string");
    }
  } catch {
    interests = [];
  }
  return {
    userId: row.userId,
    displayName: row.displayName,
    profilePhotoUrl: row.profilePhotoUrl,
    currentRole: row.currentRole,
    institution: row.institution,
    bio: row.bio,
    interests,
    prefSuggestConnections: row.prefSuggestConnections,
    prefNetworkingIntros: row.prefNetworkingIntros,
    prefShowOnFeaturedWork: row.prefShowOnFeaturedWork,
  };
}

async function ensureUser(userId: string): Promise<void> {
  const [existing] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!existing) {
    await db.insert(usersTable).values({
      id: userId,
      onboardingComplete: true,
      usageCount: 0,
    });
  }
}

async function getOrCreateProfile(userId: string): Promise<typeof userProfilesTable.$inferSelect> {
  const [existing] = await db
    .select()
    .from(userProfilesTable)
    .where(eq(userProfilesTable.userId, userId));
  if (existing) return existing;
  await ensureUser(userId);
  const [created] = await db
    .insert(userProfilesTable)
    .values({ userId })
    .returning();
  return created;
}

// Minimal public profile view (display name + role + institution + bio +
// photo). Used by Featured Work detail pages to link from a submission to
// its submitter. Returns 404 if the user has the "Show on featured work"
// toggle OFF so we don't leak identity for anonymous submitters.
router.get("/profile/public/:userId", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.params.userId;
    if (!userId || typeof userId !== "string") { res.status(404).json({ error: "Not found" }); return; }
    const [row] = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.userId, userId));
    if (!row || !row.prefShowOnFeaturedWork) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json({
      userId: row.userId,
      displayName: row.displayName,
      profilePhotoUrl: row.profilePhotoUrl,
      currentRole: row.currentRole,
      institution: row.institution,
      bio: row.bio,
    });
  } catch (err) {
    req.log.error({ err }, "Error loading public profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/profile/me", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;
    const row = await getOrCreateProfile(userId);
    res.json(serialize(row));
  } catch (err) {
    req.log.error({ err }, "Error loading profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

type FieldErrors = Record<string, string>;

function validatePatch(body: unknown): { values: Partial<typeof userProfilesTable.$inferInsert>; fieldErrors: FieldErrors } {
  const fieldErrors: FieldErrors = {};
  const values: Partial<typeof userProfilesTable.$inferInsert> = {};
  const src = (body && typeof body === "object" ? (body as Record<string, unknown>) : {}) as Record<string, unknown>;

  // displayName — required, length-bounded
  if ("displayName" in src) {
    const v = src.displayName;
    if (typeof v !== "string") {
      fieldErrors.displayName = "Display name is required.";
    } else {
      const t = v.trim();
      if (!t) {
        fieldErrors.displayName = "Display name is required.";
      } else if (t.length > MAX_DISPLAY_NAME_LENGTH) {
        fieldErrors.displayName = `Display name must be ${MAX_DISPLAY_NAME_LENGTH} characters or fewer.`;
      } else {
        values.displayName = t;
      }
    }
  }

  if ("currentRole" in src) {
    const v = src.currentRole;
    if (v === null || v === "") {
      values.currentRole = null;
    } else if (typeof v !== "string" || !(PROFILE_ROLES as readonly string[]).includes(v)) {
      fieldErrors.currentRole = "Please pick a role from the list.";
    } else {
      values.currentRole = v;
    }
  }

  if ("institution" in src) {
    const v = src.institution;
    if (v === null || v === "") {
      values.institution = null;
    } else if (typeof v !== "string") {
      fieldErrors.institution = "Institution must be text.";
    } else {
      const t = v.trim();
      if (t.length > MAX_INSTITUTION_LENGTH) {
        fieldErrors.institution = `Institution must be ${MAX_INSTITUTION_LENGTH} characters or fewer.`;
      } else {
        values.institution = t || null;
      }
    }
  }

  if ("bio" in src) {
    const v = src.bio;
    if (v === null || v === "") {
      values.bio = null;
    } else if (typeof v !== "string") {
      fieldErrors.bio = "Bio must be text.";
    } else if (v.length > MAX_BIO_LENGTH) {
      fieldErrors.bio = `Bio must be ${MAX_BIO_LENGTH} characters or fewer (currently ${v.length}).`;
    } else {
      values.bio = v;
    }
  }

  if ("interests" in src) {
    const v = src.interests;
    if (!Array.isArray(v)) {
      fieldErrors.interests = "Interests must be a list.";
    } else if (v.length > MAX_INTERESTS) {
      fieldErrors.interests = `Pick up to ${MAX_INTERESTS} interests.`;
    } else {
      const cleaned: string[] = [];
      for (const item of v) {
        if (typeof item !== "string" || !INTEREST_TAGS_SET.has(item)) {
          fieldErrors.interests = "Interests must come from the provided list.";
          break;
        }
        if (!cleaned.includes(item)) cleaned.push(item);
      }
      if (!fieldErrors.interests) {
        values.interests = JSON.stringify(cleaned);
      }
    }
  }

  if ("profilePhotoUrl" in src) {
    const v = src.profilePhotoUrl;
    if (v === null || v === "") {
      values.profilePhotoUrl = null;
    } else if (typeof v !== "string") {
      fieldErrors.profilePhotoUrl = "Photo URL must be text.";
    } else if (!v.startsWith("/objects/")) {
      // Must be a path returned from our own upload endpoint.
      fieldErrors.profilePhotoUrl = "Photo must be uploaded through the profile page.";
    } else {
      values.profilePhotoUrl = v;
    }
  }

  for (const key of ["prefSuggestConnections", "prefNetworkingIntros", "prefShowOnFeaturedWork"] as const) {
    if (key in src) {
      const v = src[key];
      if (typeof v !== "boolean") {
        fieldErrors[key] = "Toggle value must be true or false.";
      } else {
        values[key] = v;
      }
    }
  }

  return { values, fieldErrors };
}

router.patch("/profile/me", async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = requireUserId(req, res);
    if (!userId) return;

    // Ensure the row exists so we can do a clean UPDATE.
    await getOrCreateProfile(userId);

    const { values, fieldErrors } = validatePatch(req.body);
    if (Object.keys(fieldErrors).length > 0) {
      res.status(400).json({ error: "Validation failed", fieldErrors });
      return;
    }

    // If a profile photo URL was sent, ensure this caller actually uploaded it
    // (prevents cross-user ACL takeover), then bind ownership ACL.
    if (typeof values.profilePhotoUrl === "string" && values.profilePhotoUrl) {
      const normalized = objectStorageService.normalizeObjectEntityPath(values.profilePhotoUrl);
      if (!isUploadOwnedBy(normalized, userId)) {
        res.status(400).json({
          error: "Validation failed",
          fieldErrors: { profilePhotoUrl: "Photo upload not recognized. Please upload again." },
        });
        return;
      }
      // Server-side enforcement: re-fetch the uploaded object's metadata and
      // verify content-type + size. The /storage/uploads/request-url endpoint
      // only sees client-claimed metadata at signing time, so without this
      // check a caller could request a signed URL with claimed image/png and
      // then PUT arbitrary bytes (PDF, executable, oversized payload) before
      // flipping the ACL public. This is the authoritative check.
      try {
        const objectFile = await objectStorageService.getObjectEntityFile(normalized);
        const [metadata] = await objectFile.getMetadata();
        const contentType = String(metadata.contentType ?? "").toLowerCase();
        const sizeBytes = Number(metadata.size ?? 0);
        const ALLOWED_PHOTO_TYPES = new Set([
          "image/png",
          "image/jpeg",
          "image/jpg",
          "image/webp",
        ]);
        const MAX_PHOTO_BYTES = 10 * 1024 * 1024; // 10 MB is plenty for a portrait
        if (!ALLOWED_PHOTO_TYPES.has(contentType)) {
          res.status(400).json({
            error: "Validation failed",
            fieldErrors: { profilePhotoUrl: "Photo must be a PNG, JPEG, or WebP image." },
          });
          return;
        }
        if (sizeBytes <= 0 || sizeBytes > MAX_PHOTO_BYTES) {
          res.status(400).json({
            error: "Validation failed",
            fieldErrors: { profilePhotoUrl: "Photo must be larger than 0 and at most 10 MB." },
          });
          return;
        }
        values.profilePhotoUrl = await objectStorageService.trySetObjectEntityAclPolicy(
          normalized,
          { owner: userId, visibility: "public" },
        );
        consumeUpload(normalized);
      } catch (aclErr) {
        req.log.warn({ err: aclErr }, "Failed to verify/attach profile photo");
        res.status(400).json({
          error: "Validation failed",
          fieldErrors: { profilePhotoUrl: "Could not attach uploaded photo. Please re-upload." },
        });
        return;
      }
    }

    // Enforce displayName invariant: after this PATCH the profile must have a
    // non-empty displayName. (Task #65: displayName is required.)
    const existing = await db
      .select({ displayName: userProfilesTable.displayName })
      .from(userProfilesTable)
      .where(eq(userProfilesTable.userId, userId));
    const finalDisplayName =
      values.displayName !== undefined ? values.displayName : existing[0]?.displayName ?? null;
    if (!finalDisplayName || finalDisplayName.trim().length === 0) {
      res.status(400).json({
        error: "Validation failed",
        fieldErrors: { displayName: "Display name is required." },
      });
      return;
    }

    const [updated] = await db
      .update(userProfilesTable)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(userProfilesTable.userId, userId))
      .returning();

    res.json(serialize(updated));
  } catch (err) {
    req.log.error({ err }, "Error updating profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
