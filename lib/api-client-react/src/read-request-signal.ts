/** Portable timeout/cancellation composition (also used by the Expo client). */
export function readRequestSignal(caller?: AbortSignal | null, timeoutMs = 20_000) {
  const controller = new AbortController();
  const abort = () => controller.abort(caller?.reason);
  if (caller?.aborted) abort();
  else caller?.addEventListener("abort", abort, { once: true });
  const timer = setTimeout(() => {
    controller.abort(Object.assign(new Error("The request timed out. Please try again."), { name: "TimeoutError" }));
  }, timeoutMs);
  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(timer);
      caller?.removeEventListener("abort", abort);
    },
  };
}
