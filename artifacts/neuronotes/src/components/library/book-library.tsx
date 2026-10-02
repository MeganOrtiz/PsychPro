import { useEffect, useRef, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useQueryClient } from "@tanstack/react-query";
import { BookOpen, Download, MessageSquare, RotateCcw } from "lucide-react";
import {
  useGetBookLibrary,
  useClaimFeedbackBook,
  type BookLibraryResponse,
} from "@workspace/api-client-react";
import foundationsCover from "@/assets/psychpro-foundations-book.webp";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FeedbackForm } from "@/components/feedback/feedback-form";
import { authHeaders } from "@/lib/auth-headers";
import type { Suite } from "@/lib/library-routes";

type LibraryBook = BookLibraryResponse["books"][number];

function coverFor(book: LibraryBook): string | null {
  if (book.coverUrl) return book.coverUrl;
  if (book.id === "psychpro-foundations-v1") return foundationsCover;
  return null;
}

function Cover({ book }: { book: LibraryBook }) {
  const src = coverFor(book);
  if (src) {
    return <img src={src} alt={`Cover of ${book.title}`} className="w-24 sm:w-28 rounded-md shrink-0 object-cover" style={{ aspectRatio: "785 / 1181" }} />;
  }
  return (
    <div
      className="w-24 sm:w-28 rounded-md shrink-0 flex items-center justify-center p-2 text-center border border-border bg-card text-muted-foreground"
      style={{ aspectRatio: "785 / 1181" }}
      aria-label={`Cover placeholder for ${book.title}`}
    >
      <BookOpen className="w-6 h-6" />
    </div>
  );
}

function BookRow({ book }: { book: LibraryBook }) {
  const [busy, setBusy] = useState<"read" | "download" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const urls = useRef<string[]>([]);

  useEffect(() => () => { urls.current.forEach((u) => URL.revokeObjectURL(u)); }, []);

  async function fetchPdf(download: boolean): Promise<Blob> {
    const res = await fetch(
      `/api/library/books/${encodeURIComponent(book.id)}/pdf${download ? "?download=1" : ""}`,
      { headers: await authHeaders(), credentials: "include" },
    );
    if (!res.ok) throw new Error(res.status === 403 ? "This book is not in your library." : `Request failed (${res.status}).`);
    if (!res.headers.get("Content-Type")?.toLowerCase().startsWith("application/pdf")) {
      throw new Error("The server did not return a PDF. Please try again.");
    }
    const blob = await res.blob();
    if (blob.size === 0) throw new Error("The PDF was empty. Please try again.");
    return blob;
  }

  async function read() {
    if (busy) return;
    // Open synchronously so the browser treats it as a user-initiated popup.
    const tab = window.open("about:blank", "_blank");
    setBusy("read"); setError(null);
    try {
      const blob = await fetchPdf(false);
      const url = URL.createObjectURL(blob);
      urls.current.push(url);
      if (tab && !tab.closed) tab.location.href = url;
      else window.location.assign(url);
      window.setTimeout(() => {
        URL.revokeObjectURL(url);
        urls.current = urls.current.filter((u) => u !== url);
      }, 5 * 60_000);
    } catch (e) {
      tab?.close();
      setError(e instanceof Error ? e.message : "Could not open the PDF.");
    } finally { setBusy(null); }
  }

  async function download() {
    if (busy) return;
    setBusy("download"); setError(null);
    try {
      const blob = await fetchPdf(true);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${book.title.replace(/[^\w\- ]+/g, "").trim() || "book"}.pdf`;
      document.body.appendChild(a); a.click(); a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not download the PDF.");
    } finally { setBusy(null); }
  }

  return (
    <li className="mat-glass flex gap-4 p-4 rounded-xl" data-testid={`library-book-${book.id}`}>
      <Cover book={book} />
      <div className="min-w-0 flex-1 flex flex-col">
        <h2 className="text-base font-semibold text-foreground">{book.title}</h2>
        {book.description && <p className="mt-1 text-sm text-muted-foreground line-clamp-3">{book.description}</p>}
        <p className="mt-1 text-xs text-muted-foreground">
          {book.pageCount ? `${book.pageCount} pages · ` : ""}Added {new Date(book.grantedAt).toLocaleDateString()}
        </p>
        <div className="mt-auto pt-3 flex flex-wrap gap-2">
          <Button size="sm" className="gap-2" onClick={read} disabled={!!busy} data-testid={`button-read-${book.id}`}>
            <BookOpen className="w-4 h-4" />{busy === "read" ? "Opening..." : "Read PDF"}
          </Button>
          <Button size="sm" variant="outline" className="gap-2" onClick={download} disabled={!!busy} data-testid={`button-download-${book.id}`}>
            <Download className="w-4 h-4" />{busy === "download" ? "Preparing..." : "Download"}
          </Button>
        </div>
        {error && <p role="alert" className="mt-2 text-xs text-red-400" data-testid={`error-book-${book.id}`}>{error}</p>}
      </div>
    </li>
  );
}

export type LibraryViewProps = {
  suite: Suite;
  data?: BookLibraryResponse;
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onClaim?: () => void;
  claiming?: boolean;
  claimError?: string | null;
  feedbackDialog?: React.ReactNode;
};

/** Presentational library: shared by both suites and the DEV preview. */
export function LibraryView({ suite, data, isLoading, isError, onRetry, onClaim, claiming, claimError, feedbackDialog }: LibraryViewProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const books = data?.books ?? [];
  const reward = data?.reward;

  return (
    <section className="p-4 md:p-8 max-w-3xl" data-testid="my-library" data-suite={suite}>
      <h1 className="text-2xl font-semibold text-foreground">My Library</h1>
      <p className="mt-1 mb-6 text-sm text-muted-foreground">Books you own stay with your account in both PsychPro and the EPPP Suite.</p>

      {isLoading ? (
        <div className="space-y-3" data-testid="library-loading" aria-busy>
          {[0, 1].map((i) => <div key={i} className="mat-glass h-40 rounded-xl animate-pulse" />)}
        </div>
      ) : isError ? (
        <div className="mat-glass rounded-xl p-6" role="alert" data-testid="library-error">
          <p className="text-sm text-foreground">We couldn't load your library. Your books are not affected.</p>
          <Button className="mt-3 gap-2" variant="outline" onClick={onRetry} data-testid="library-retry"><RotateCcw className="w-4 h-4" />Try again</Button>
        </div>
      ) : (
        <>
          {books.length === 0 ? (
            <div className="mat-glass rounded-xl p-6" data-testid="library-empty">
              <p className="text-sm font-medium text-foreground">No books yet.</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {reward?.eligible
                  ? reward.available
                    ? "You've already shared feedback, so your textbook is ready to claim."
                    : "You've already shared feedback. Your textbook is being prepared; try claiming it again shortly."
                  : "Share honest feedback to receive your free copy of the textbook."}
              </p>
            </div>
          ) : (
            <ul className="space-y-3" data-testid="library-list">{books.map((b) => <BookRow key={b.id} book={b} />)}</ul>
          )}

          {reward && !reward.owned && (
            <div className="mt-4">
              {reward.eligible ? (
                <Button onClick={onClaim} disabled={claiming} data-testid="button-claim-book">
                  {claiming ? "Claiming..." : "Claim my book"}
                </Button>
              ) : (
                <Button className="gap-2" onClick={() => setFeedbackOpen(true)} data-testid="button-library-feedback">
                  <MessageSquare className="w-4 h-4" />Share feedback
                </Button>
              )}
              {claimError && <p role="alert" className="mt-2 text-xs text-red-400">{claimError}</p>}
            </div>
          )}
        </>
      )}

      <Dialog open={feedbackOpen} onOpenChange={(n) => { if (!submitting) setFeedbackOpen(n); }}>
        <DialogContent className="max-h-[90dvh] overflow-y-auto" data-testid="library-feedback-dialog">
          <DialogHeader>
            <DialogTitle>Share your feedback</DialogTitle>
            <DialogDescription>Honest feedback, positive or negative, earns your textbook.</DialogDescription>
          </DialogHeader>
          {feedbackDialog ?? <FeedbackForm suite={suite} onSubmittingChange={setSubmitting} onClose={() => setFeedbackOpen(false)} />}
        </DialogContent>
      </Dialog>
    </section>
  );
}

/** Account-keyed container used by both /my-library and /eppp/suite/my-library. */
export function BookLibrary({ suite }: { suite: Suite }) {
  const { userId, isLoaded } = useAuth();
  const qc = useQueryClient();
  const q = useGetBookLibrary({
    query: { enabled: isLoaded && !!userId, queryKey: ["/api/library", userId ?? "anon"] as const, staleTime: 0 },
  });
  const claim = useClaimFeedbackBook();
  const [claimError, setClaimError] = useState<string | null>(null);

  function onClaim() {
    setClaimError(null);
    claim.mutate(undefined as never, {
      onSuccess: () => qc.invalidateQueries({ queryKey: ["/api/library"] }),
      onError: () => setClaimError("Couldn't claim your book. Please try again."),
    });
  }

  return (
    <LibraryView
      suite={suite}
      data={q.data}
      isLoading={!isLoaded || q.isLoading}
      isError={q.isError}
      onRetry={() => q.refetch()}
      onClaim={onClaim}
      claiming={claim.isPending}
      claimError={claimError}
    />
  );
}
