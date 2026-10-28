import { Skeleton } from "@/components/ui/skeleton";

type RouteLoadingVariant = "page" | "content" | "suite";

/**
 * Lightweight route fallback. The content variant is used inside an existing
 * app shell; page and suite variants are used before a route has mounted its
 * own layout.
 */
export function RouteLoadingSurface({
  variant = "page",
  label = "Loading page",
  testId = "route-loading",
}: {
  variant?: RouteLoadingVariant;
  label?: string;
  testId?: string;
}) {
  if (variant === "suite") {
    return (
      <div
        className="study-page-bg flex min-h-screen gap-4 p-4"
        role="status"
        aria-live="polite"
        aria-busy="true"
        data-testid={testId}
      >
        <span className="sr-only">{label}</span>
        <aside className="hidden w-64 shrink-0 space-y-3 rounded-2xl border border-[var(--pp-line)] bg-[var(--pp-surface)] p-4 md:block">
          <Skeleton className="mx-auto h-6 w-32 motion-reduce:animate-none" />
          <div className="space-y-2 pt-5">
            {Array.from({ length: 7 }, (_, index) => (
              <Skeleton key={index} className="h-9 rounded-lg motion-reduce:animate-none" />
            ))}
          </div>
        </aside>
        <main className="min-w-0 flex-1 space-y-5 px-1 py-2 md:px-4">
          <div className="flex justify-end">
            <Skeleton className="h-9 w-40 rounded-xl motion-reduce:animate-none" />
          </div>
          <div className="mx-auto max-w-5xl space-y-5 pt-4 md:pt-8">
            <Skeleton className="mx-auto h-10 w-64 max-w-full rounded-xl motion-reduce:animate-none" />
            <Skeleton className="h-48 rounded-2xl motion-reduce:animate-none md:h-64" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-28 rounded-2xl motion-reduce:animate-none" />
              <Skeleton className="h-28 rounded-2xl motion-reduce:animate-none" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (variant === "content") {
    return (
      <div
        className="min-h-full p-4 md:p-6"
        role="status"
        aria-live="polite"
        aria-busy="true"
        data-testid={testId}
      >
        <span className="sr-only">{label}</span>
        <div className="mx-auto max-w-6xl space-y-5">
          <Skeleton className="h-8 w-56 max-w-full rounded-lg motion-reduce:animate-none" />
          <Skeleton className="h-36 rounded-2xl motion-reduce:animate-none" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-24 rounded-xl motion-reduce:animate-none" />
            <Skeleton className="h-24 rounded-xl motion-reduce:animate-none" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="study-page-bg min-h-screen px-4 py-10 md:px-8"
      role="status"
      aria-live="polite"
      aria-busy="true"
      data-testid={testId}
    >
      <span className="sr-only">{label}</span>
      <main className="mx-auto max-w-6xl space-y-6 pt-4 md:pt-8">
        <Skeleton className="mx-auto h-10 w-72 max-w-full rounded-xl motion-reduce:animate-none" />
        <Skeleton className="h-48 rounded-2xl motion-reduce:animate-none md:h-64" />
        <div className="grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-28 rounded-2xl motion-reduce:animate-none" />
          <Skeleton className="h-28 rounded-2xl motion-reduce:animate-none" />
        </div>
      </main>
    </div>
  );
}
