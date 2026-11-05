import { useEffect, useRef, useState } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import {
  executeTargetedTestCleanup,
  previewTargetedTestCleanup,
  type TargetedTestCleanupPreview,
  type TargetedTestCleanupResult,
} from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { authHeaders } from "@/lib/auth-headers";

const CONFIRMATION = "DELETE PINNED TEST ACCOUNTS";
const OWNER_EMAIL = "admin@psychprosuite.com";

const REASON_COPY: Record<string, string> = {
  protected: "Protected administrator account",
  billing_reference: "Stripe, subscription, or paid-access record needs separate review",
  uploaded_source: "Uploaded source file needs separate review",
  identity_mismatch: "The sign-in or profile email no longer matches the pinned record",
  verification_unavailable: "Identity or profile verification needs to be retried",
};

export function PinnedTestAccountCleanup() {
  const { userId } = useAuth();
  const { isLoaded, user } = useUser();
  const verifiedOwner =
    user?.primaryEmailAddress?.emailAddress.trim().toLowerCase() === OWNER_EMAIL &&
    user.primaryEmailAddress.verification?.status === "verified";
  const [preview, setPreview] = useState<TargetedTestCleanupPreview | null>(null);
  const [result, setResult] = useState<TargetedTestCleanupResult | null>(null);
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
    return () => {
      mountedUser.current = null;
    };
  }, [userId]);

  if (!isLoaded || !verifiedOwner) return null;

  async function inspect() {
    if (working.current || !userId) return;
    working.current = true;
    setBusy("preview");
    setError("");
    setPreview(null);
    setResult(null);
    setConfirmation("");
    try {
      const data = await previewTargetedTestCleanup({ headers: await authHeaders() });
      if (mountedUser.current === userId) setPreview(data);
    } catch {
      if (mountedUser.current === userId) {
        setError("Could not verify the pinned-account preview. Nothing was deleted.");
      }
    } finally {
      working.current = false;
      setBusy(null);
    }
  }

  async function remove() {
    if (
      working.current ||
      !userId ||
      !preview?.protectedAccountPreserved ||
      !preview.eligibleCount ||
      confirmation !== CONFIRMATION
    ) {
      return;
    }

    working.current = true;
    setBusy("delete");
    setError("");
    const fingerprint = preview.fingerprint;
    setPreview(null);
    setConfirmation("");
    try {
      const data = await executeTargetedTestCleanup(
        { confirmation: CONFIRMATION, fingerprint },
        { headers: await authHeaders() },
      );
      if (mountedUser.current === userId) setResult(data);
    } catch {
      if (mountedUser.current === userId) {
        setError("Cleanup was not completed. The preview may have changed or identity verification may be unavailable. Review a fresh preview before retrying.");
      }
    } finally {
      working.current = false;
      setBusy(null);
    }
  }

  return (
    <section
      className="rounded-lg border border-border bg-card p-4 space-y-3"
      aria-labelledby="pinned-test-cleanup-title"
      data-testid="pinned-test-cleanup"
    >
      <div>
        <h3 id="pinned-test-cleanup-title" className="text-sm font-semibold text-foreground">
          Current tester-account cleanup
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Only the accounts pinned in the approved inventory are considered. New signups,
          shared study content, and the protected admin account are never selected.
          Billing-linked accounts and accounts with uploaded source files are blocked.
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={inspect}
        disabled={busy !== null}
        data-testid="button-preview-pinned-test-cleanup"
      >
        {busy === "preview" ? "Verifying pinned accounts…" : "Preview pinned test accounts"}
      </Button>

      {preview && (
        <div className="space-y-3" aria-live="polite" data-testid="pinned-cleanup-preview">
          <p className="text-sm text-foreground">
            Environment:{" "}
            <strong>
              {preview.environment === "production" ? "Published site" : "Development preview"}
            </strong>
            . <strong>{preview.eligibleCount}</strong> eligible, {preview.blockedCount} blocked,
            {" "}{preview.alreadyAbsentCount} already absent.
          </p>

          {preview.items.length === 0 ? (
            <p className="text-sm text-foreground">
              There are no accounts in this environment’s pinned cleanup inventory.
            </p>
          ) : (
            <ul className="space-y-2">
              {preview.items.map((item, index) => (
                <li
                  key={`${item.email}-${index}`}
                  className="rounded-md border border-border bg-background p-3"
                  data-testid={`row-pinned-cleanup-${index + 1}`}
                >
                  <p className="text-sm font-medium text-foreground">{item.email}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Profile: {item.profilePresent ? "present" : "absent"} · Sign-in:{" "}
                    {item.signInPresent ? "present" : "absent"} ·{" "}
                    {item.status === "already_absent"
                      ? "already absent"
                      : item.status === "eligible"
                        ? "eligible"
                        : "blocked"}
                  </p>
                  {item.reason && (
                    <p className="mt-1 text-xs text-foreground">
                      {REASON_COPY[item.reason] ?? "Safety check requires review"}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}

          {preview.eligibleCount > 0 && (
            <>
              <p className="text-sm text-foreground">
                This permanently removes eligible login identities and their app-owned profile,
                progress, attempts, and saved materials. Any billing-linked or uploaded-source
                account stays untouched.
              </p>
              <label htmlFor="pinned-test-cleanup-confirm" className="block text-sm text-foreground">
                Type <strong>{CONFIRMATION}</strong> to confirm.
              </label>
              <input
                id="pinned-test-cleanup-confirm"
                className="pp-input-well w-full rounded-md border px-3 py-2 text-foreground"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                autoComplete="off"
                spellCheck={false}
                data-testid="input-pinned-test-cleanup-confirm"
              />
              <Button
                type="button"
                variant="destructive"
                onClick={remove}
                disabled={
                  confirmation !== CONFIRMATION ||
                  busy !== null ||
                  !preview.protectedAccountPreserved
                }
                data-testid="button-delete-pinned-test-cleanup"
              >
                Permanently delete {preview.eligibleCount} pinned test account
                {preview.eligibleCount === 1 ? "" : "s"}
              </Button>
            </>
          )}
        </div>
      )}

      {busy === "delete" && (
        <p role="status" className="text-sm text-foreground">
          Rechecking the pinned accounts and removing eligible test data…
        </p>
      )}
      {result && (
        <p role="status" className="text-sm text-foreground" data-testid="pinned-cleanup-result">
          Removed and verified: {result.deletedCount}. {result.blockedCount} stayed blocked.
          {result.identityOnlyCount > 0 &&
            ` ${result.identityOnlyCount} login identity was removed, but its profile data was retained after a database error; preview and retry to finish.`}
          {result.failedCount > 0 &&
            ` ${result.failedCount} account could not be safely completed; preview and retry.`}
          {" "}{result.protectedAccountPreserved
            ? "The protected admin account was preserved."
            : "Owner verification requires review."}
          {" "}New signups and shared study content were not changed.
        </p>
      )}
      {result && result.items.length > 0 && (
        <ul className="space-y-2" aria-label="Cleanup results" data-testid="pinned-cleanup-results">
          {result.items.map((item, index) => (
            <li
              key={`${item.email}-${index}`}
              className="rounded-md border border-border bg-background p-3"
              data-testid={`row-pinned-cleanup-result-${index + 1}`}
            >
              <p className="text-sm font-medium text-foreground">{item.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Sign-in: {item.identity.replaceAll("_", " ")} · App data:{" "}
                {item.appData.replaceAll("_", " ")}
              </p>
              {item.reason && (
                <p className="mt-1 text-xs text-foreground">
                  {REASON_COPY[item.reason] ?? "Review required"}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
      {error && (
        <p role="alert" className="text-sm text-foreground" data-testid="pinned-cleanup-error">
          {error}
        </p>
      )}
    </section>
  );
}
