import { Router, type Request, type Response, type IRouter } from "express";
import { getAuth } from "@clerk/express";
import { clientErrorsRateLimit } from "../middlewares/clientErrorsRateLimit";

const router: IRouter = Router();

export const MAX_FIELD_LENGTH = 4000;
export const MAX_URL_LENGTH = 1000;
export const MAX_USER_AGENT_LENGTH = 500;
export const MAX_RELEASE_ID_LENGTH = 200;

function asString(value: unknown, max = MAX_FIELD_LENGTH): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

router.post("/client-errors", clientErrorsRateLimit, (req: Request, res: Response): void => {
  const body = (req.body ?? {}) as Record<string, unknown>;

  const message = asString(body.message) ?? "Unknown client error";
  const stack = asString(body.stack);
  const componentStack = asString(body.componentStack);
  const url = asString(body.url, MAX_URL_LENGTH);
  const userAgent = asString(body.userAgent, MAX_USER_AGENT_LENGTH);
  const releaseId = asString(body.releaseId, MAX_RELEASE_ID_LENGTH);

  const userId = getAuth(req).userId ?? null;

  req.log.error(
    {
      clientError: {
        message,
        stack,
        componentStack,
        url,
        userAgent,
        releaseId,
        userId,
      },
    },
    "Client-side error reported",
  );

  res.status(204).end();
});

export default router;
