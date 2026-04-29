export interface ClientErrorPayload {
  message: string;
  stack?: string;
  componentStack?: string;
  url?: string;
  userAgent?: string;
}

const REPORT_ENDPOINT = "/api/client-errors";
const DEDUPE_WINDOW_MS = 5000;

const recentErrors = new Map<string, number>();

function shouldReport(key: string, now: number = Date.now()): boolean {
  const last = recentErrors.get(key);
  if (last !== undefined && now - last < DEDUPE_WINDOW_MS) {
    return false;
  }
  recentErrors.set(key, now);
  if (recentErrors.size > 50) {
    for (const [k, ts] of recentErrors) {
      if (now - ts >= DEDUPE_WINDOW_MS) recentErrors.delete(k);
    }
  }
  return true;
}

function dedupeKey(payload: ClientErrorPayload): string {
  const stackHead = payload.stack ? payload.stack.split("\n").slice(0, 2).join("|") : "";
  return `${payload.message}::${stackHead}`;
}

export function reportClientError(payload: ClientErrorPayload): void {
  if (!shouldReport(dedupeKey(payload))) return;

  try {
    const body = JSON.stringify(payload);
    if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
      const blob = new Blob([body], { type: "application/json" });
      const ok = navigator.sendBeacon(REPORT_ENDPOINT, blob);
      if (ok) return;
    }
    void fetch(REPORT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {
      // Reporting must never throw — swallow network errors.
    });
  } catch {
    // Reporting must never throw.
  }
}

function buildBasePayload(message: string, stack?: string): ClientErrorPayload {
  return {
    message: message || "Unknown error",
    stack,
    url: typeof window !== "undefined" ? window.location.href : undefined,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };
}

function payloadFromUnknown(value: unknown, fallbackMessage: string): ClientErrorPayload {
  if (value instanceof Error) {
    return buildBasePayload(value.message || fallbackMessage, value.stack);
  }
  if (typeof value === "string") {
    return buildBasePayload(value);
  }
  if (value && typeof value === "object") {
    const obj = value as { message?: unknown; stack?: unknown };
    const message =
      typeof obj.message === "string" && obj.message ? obj.message : fallbackMessage;
    const stack = typeof obj.stack === "string" ? obj.stack : undefined;
    return buildBasePayload(message, stack);
  }
  return buildBasePayload(fallbackMessage);
}

let listenersInstalled = false;

export function installGlobalErrorListeners(): void {
  if (listenersInstalled) return;
  if (typeof window === "undefined") return;
  listenersInstalled = true;

  window.addEventListener("error", (event: ErrorEvent) => {
    const payload =
      event.error !== undefined && event.error !== null
        ? payloadFromUnknown(event.error, event.message || "Uncaught error")
        : buildBasePayload(event.message || "Uncaught error");
    reportClientError(payload);
  });

  window.addEventListener("unhandledrejection", (event: PromiseRejectionEvent) => {
    const payload = payloadFromUnknown(event.reason, "Unhandled promise rejection");
    reportClientError(payload);
  });
}

export function __runDevSanityCheck(): void {
  if (typeof window === "undefined") return;
  setTimeout(() => {
    throw new Error("[dev sanity] global error listener check");
  }, 0);
}
