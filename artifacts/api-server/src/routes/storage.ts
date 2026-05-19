import { Router, type IRouter, type Request, type Response } from "express";
import { Readable } from "stream";
import { z } from "zod";
import { ObjectStorageService, ObjectNotFoundError } from "../lib/objectStorage";
import { ObjectPermission } from "../lib/objectAcl";
import { getUserId, requireUserId } from "../lib/userId";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

// In-memory mapping of recently-issued upload object IDs -> uploader user ID.
// Used to verify that a /objects/<id> path supplied to PATCH /profile/me (or
// similar finalize-upload endpoints) was actually issued to the caller, so
// users cannot reassign ownership of arbitrary objects they discover.
// Entries expire after UPLOAD_TTL_MS to bound memory.
const UPLOAD_TTL_MS = 60 * 60 * 1000; // 1 hour
const pendingUploads = new Map<string, { userId: string; expiresAt: number }>();

function recordPendingUpload(objectId: string, userId: string): void {
  pendingUploads.set(objectId, { userId, expiresAt: Date.now() + UPLOAD_TTL_MS });
}

function extractObjectId(objectPath: string): string | null {
  if (!objectPath.startsWith("/objects/")) return null;
  const id = objectPath.slice("/objects/".length).split("/")[0];
  return id || null;
}

export function isUploadOwnedBy(objectPath: string, userId: string): boolean {
  const id = extractObjectId(objectPath);
  if (!id) return false;
  const entry = pendingUploads.get(id);
  if (!entry) return false;
  if (entry.expiresAt < Date.now()) {
    pendingUploads.delete(id);
    return false;
  }
  return entry.userId === userId;
}

export function consumeUpload(objectPath: string): void {
  const id = extractObjectId(objectPath);
  if (id) pendingUploads.delete(id);
}

const RequestUploadUrlBody = z.object({
  name: z.string().min(1).max(255),
  size: z.number().int().nonnegative().max(20 * 1024 * 1024),
  contentType: z.string().min(1).max(255),
});

router.post("/storage/uploads/request-url", async (req: Request, res: Response): Promise<void> => {
  const userId = requireUserId(req, res);
  if (!userId) return;
  const parsed = RequestUploadUrlBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Missing or invalid required fields" });
    return;
  }
  try {
    const { name, size, contentType } = parsed.data;
    const uploadURL = await objectStorageService.getObjectEntityUploadURL();
    const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
    const id = extractObjectId(objectPath);
    if (id) recordPendingUpload(id, userId);
    res.json({ uploadURL, objectPath, metadata: { name, size, contentType } });
  } catch (error) {
    req.log.error({ err: error }, "Error generating upload URL");
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
});

router.get("/storage/public-objects/*filePath", async (req: Request, res: Response): Promise<void> => {
  try {
    const raw = req.params.filePath;
    const filePath = Array.isArray(raw) ? raw.join("/") : raw;
    const file = await objectStorageService.searchPublicObject(filePath);
    if (!file) {
      res.status(404).json({ error: "File not found" });
      return;
    }
    const response = await objectStorageService.downloadObject(file);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    req.log.error({ err: error }, "Error serving public object");
    res.status(500).json({ error: "Failed to serve public object" });
  }
});

router.get("/storage/objects/*path", async (req: Request, res: Response): Promise<void> => {
  try {
    const raw = req.params.path;
    const wildcardPath = Array.isArray(raw) ? raw.join("/") : raw;
    const objectPath = `/objects/${wildcardPath}`;
    const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
    const userId = getUserId(req) ?? undefined;
    const allowed = await objectStorageService.canAccessObjectEntity({
      userId,
      objectFile,
      requestedPermission: ObjectPermission.READ,
    });
    if (!allowed) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    const response = await objectStorageService.downloadObject(objectFile);
    res.status(response.status);
    response.headers.forEach((value, key) => res.setHeader(key, value));
    if (response.body) {
      const nodeStream = Readable.fromWeb(response.body as ReadableStream<Uint8Array>);
      nodeStream.pipe(res);
    } else {
      res.end();
    }
  } catch (error) {
    if (error instanceof ObjectNotFoundError) {
      req.log.warn({ err: error }, "Object not found");
      res.status(404).json({ error: "Object not found" });
      return;
    }
    req.log.error({ err: error }, "Error serving object");
    res.status(500).json({ error: "Failed to serve object" });
  }
});

export default router;
