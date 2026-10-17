import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  previewOldTestCleanup, executeOldTestCleanup,
  type OldTestCleanupPreview, type OldTestCleanupResult,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { authHeaders } from "@/lib/auth-headers";

const CONFIRMATION = "DELETE OLD TEST DATA";

export function OldTestAccountCleanup() {
  const { userId } = useAuth();
  const [preview, setPreview] = useState<OldTestCleanupPreview | null>(null);
  const [result, setResult] = useState<OldTestCleanupResult | null>(null);
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState<"preview" | "delete" | null>(null);
  const [error, setError] = useState("");
  const working = useRef(false);
  const mountedUser = useRef(userId);
  useEffect(() => {
    mountedUser.current = userId;
    setPreview(null);
    setResult(null);
    setConfirmation("");
    setError("");
    return () => { mountedUser.current = null; };
  }, [userId]);

  async function inspect() {
    if (working.current || !userId) return;
    working.current = true;
    setBusy("preview");
    setError("");
    setPreview(null);
    setResult(null);
    setConfirmation("");
    try {
      const data = await previewOldTestCleanup({ headers: await authHeaders() });
      if (mountedUser.current === userId) setPreview(data);
    } catch {
      if (mountedUser.current === userId) setError("Could not verify the cleanup preview. Only the protected admin account can use this tool. No data was deleted.");
    } finally {
      working.current = false;
      setBusy(null);
    }
  }

  async function remove() {
    if (working.current || !userId || !preview?.protectedAccountPreserved ||
        !preview.eligibleCount || confirmation !== CONFIRMATION) return;
    working.current = true;
    setBusy("delete");
    setError("");
    const fingerprint = preview.fingerprint;
    setPreview(null);
    setConfirmation("");
    try {
      const data = await executeOldTestCleanup({ confirmation: CONFIRMATION, fingerprint }, {
        headers: await authHeaders(),
      });
      if (mountedUser.current === userId) setResult(data);
    } catch {
      if (mountedUser.current === userId) setError("Cleanup was not confirmed. The preview may have changed or verification may be unavailable. Check a fresh preview before retrying.");
    } finally {
      working.current = false;
      setBusy(null);
    }
  }

  return (
    <section className="rounded-lg border border-border bg-card p-4 space-y-3" aria-labelledby="old-test-cleanup-title" data-testid="old-test-cleanup">
      <div>
        <h3 id="old-test-cleanup-title" className="text-sm font-semibold text-foreground">Historical test-account cleanup</h3>
        <p className="text-sm text-muted-foreground mt-1">
          One-time cleanup of the 28 old test profiles. New signups are never included.
          Your protected admin account, shared courses, and study content are kept.
        </p>
      </div>
      <Button type="button" variant="outline" onClick={inspect} disabled={busy !== null} data-testid="button-preview-old-test-cleanup">
        {busy === "preview" ? "Verifying old profiles…" : "Preview old test profiles"}
      </Button>
      {preview && (
        <div className="space-y-3" aria-live="polite">
          <p className="text-sm text-foreground">
            Environment: <strong>{preview.environment === "production" ? "Published site" : "Development preview"}</strong>.
            {" "}<strong>{preview.eligibleCount}</strong> profiles eligible; {preview.alreadyRemovedCount} already absent;
            {" "}{preview.blockedCount} blocked by safety checks.
          </p>
          {preview.eligibleCount === 0 ? (
            <p className="text-sm text-foreground">There are no eligible old profiles to delete here.</p>
          ) : (
            <>
              <p className="text-sm text-foreground">
                This permanently deletes these profiles and their associated progress, notes, and saved materials.
                Accounts with surviving sign-ins, subscription references, or uploaded source files are skipped.
              </p>
              <label htmlFor="old-test-cleanup-confirm" className="block text-sm text-foreground">
                Type <strong>{CONFIRMATION}</strong> to confirm.
              </label>
              <input id="old-test-cleanup-confirm" className="pp-input-well w-full rounded-md border px-3 py-2 text-foreground"
                value={confirmation} onChange={event => setConfirmation(event.target.value)}
                autoComplete="off" spellCheck={false} data-testid="input-old-test-cleanup-confirm" />
              <Button type="button" variant="destructive" onClick={remove}
                disabled={confirmation !== CONFIRMATION || busy !== null || !preview.protectedAccountPreserved}
                data-testid="button-delete-old-test-cleanup">
                Permanently delete {preview.eligibleCount} old test profiles
              </Button>
            </>
          )}
        </div>
      )}
      {busy === "delete" && <p role="status" className="text-sm text-foreground">Rechecking safety and deleting old test data…</p>}
      {result && (
        <p role="status" className="text-sm text-foreground" data-testid="old-test-cleanup-result">
          Deleted and verified: {result.deletedCount} old profiles.
          {" "}{result.remainingCount} historical profiles remain blocked.
          {" "}{result.protectedAccountPreserved ? "Your admin account is preserved." : "Admin verification requires review."}
          {" "}New accounts and shared study content were not changed.
        </p>
      )}
      {error && <p role="alert" className="text-sm text-foreground">{error}</p>}
    </section>
  );
}
