/** Retry reads only when another attempt can reasonably help. Never retry writes. */
export function retryQuery(failureCount: number, error: unknown): boolean {
  const { status, name } = (error ?? {}) as { status?: number; name?: string };
  if (name === "AbortError") return false;
  if (status && status < 500 && status !== 408 && status !== 429) return false;
  return failureCount < 2;
}
