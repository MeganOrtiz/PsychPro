import { useEffect, useState } from "react";
import { Sentry } from "@/lib/sentry";

function ExplodingChild(): null {
  throw new Error("Intentional ErrorBoundary test crash");
}

export default function CrashTestPage() {
  const [boom, setBoom] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("auto") === "1") {
      setBoom(true);
    }
  }, []);

  if (boom) {
    return <ExplodingChild />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-xl font-semibold text-foreground">Error boundary test</h1>
        <p className="text-sm text-muted-foreground">
          Click the button to throw a render error and verify the top-level
          boundary catches it. Available in development only.
        </p>
        <button
          type="button"
          onClick={() => setBoom(true)}
          className="inline-flex items-center justify-center gap-2 rounded-md bg-destructive text-destructive-foreground px-4 py-2 text-sm font-medium hover:opacity-90"
          data-testid="button-trigger-crash"
        >
          Trigger crash
        </button>
        <button
          type="button"
          onClick={() => {
            const id = Sentry.captureException(
              new Error("Sentry frontend test event (dev-only)"),
            );
            console.info("[sentry] test event captured", id);
          }}
          className="inline-flex items-center justify-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
          data-testid="button-sentry-test"
        >
          Send test event to Sentry
        </button>
      </div>
    </div>
  );
}
