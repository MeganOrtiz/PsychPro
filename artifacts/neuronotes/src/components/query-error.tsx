import { Button } from "@/components/ui/button";

/** A failed read must not masquerade as empty content or zero progress. */
export function QueryError({ onRetry, message = "We couldn't load this information. Please try again." }: {
  onRetry: () => unknown;
  message?: string;
}) {
  return (
    <div role="alert" className="p-6 text-center space-y-3">
      <p className="text-sm text-foreground">{message}</p>
      <Button variant="outline" onClick={() => void onRetry()}>Try again</Button>
    </div>
  );
}
