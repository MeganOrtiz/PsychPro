import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Users, Sparkles, X, Loader2, Check, Ban, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/brand/page-title";
import { authHeaders as buildAuthHeaders, jsonAuthHeaders } from "@/lib/auth-headers";

type Suggestion = {
  userId: string;
  displayName: string;
  profilePhotoUrl: string | null;
  currentRole: string | null;
  institution: string | null;
  bioPreview: string | null;
  sharedTags: string[];
  highlightedTags: string[];
  overlapCount: number;
};

type Incoming = {
  id: number;
  requesterId: string;
  requesterDisplayName: string;
  requesterRole: string | null;
  requesterInstitution: string | null;
  requesterBio: string | null;
  sharedTags: string[];
  createdAt: string;
};

async function authHeaders(): Promise<HeadersInit> {
  return jsonAuthHeaders();
}
async function readAuthHeaders(): Promise<HeadersInit> {
  return buildAuthHeaders();
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("") || "?";
}

export default function ConnectionsPage() {
  const [location] = useLocation();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [requesting, setRequesting] = useState<Set<string>>(new Set());
  const [sent, setSent] = useState<Set<string>>(new Set());
  const [incoming, setIncoming] = useState<Incoming[]>([]);
  const [active, setActive] = useState<Incoming | null>(null);
  const [responding, setResponding] = useState(false);

  async function loadSuggestions(nextOffset = 0, append = false) {
    setLoading(true);
    try {
      const res = await fetch(`/api/connections/suggestions?offset=${nextOffset}`, {
        headers: await authHeaders(),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSuggestions((prev) => (append ? [...prev, ...data.suggestions] : data.suggestions));
      setHasMore(!!data.hasMore);
      setOffset(nextOffset);
    } catch (err) {
      console.error("[connections] load suggestions failed", err);
    } finally {
      setLoading(false);
    }
  }

  async function loadIncoming() {
    try {
      const res = await fetch("/api/connections/incoming", { headers: await authHeaders() });
      if (!res.ok) return;
      const data = (await res.json()) as Incoming[];
      setIncoming(data);
      const params = new URLSearchParams(location.split("?")[1] ?? "");
      const incomingId = params.get("incoming");
      if (incomingId) {
        const match = data.find((r) => r.id === Number(incomingId));
        if (match) setActive(match);
      }
    } catch (err) {
      console.error("[connections] load incoming failed", err);
    }
  }

  useEffect(() => {
    loadSuggestions(0, false);
    loadIncoming();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function requestIntro(s: Suggestion) {
    if (requesting.has(s.userId) || sent.has(s.userId)) return;
    setRequesting((p) => new Set(p).add(s.userId));
    try {
      const res = await fetch("/api/connections/requests", {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ recipientId: s.userId }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.ok || res.status === 202) {
        setSent((p) => new Set(p).add(s.userId));
        toast.success(
          `We've sent your interest to ${s.displayName}. If they're also interested, we'll connect you both via email.`,
          { duration: 6000 },
        );
      } else if (res.status === 429) {
        toast.error(body.error ?? "You've reached this week's connection limit.");
      } else if (res.status === 409) {
        toast.error(body.error ?? "You can't request this connection right now.");
        setSent((p) => new Set(p).add(s.userId));
      } else {
        toast.error(body.error ?? `Couldn't send request (error ${res.status}).`);
      }
    } catch (err) {
      console.error("[connections] request failed", err);
      toast.error("Couldn't send request. Please try again.");
    } finally {
      setRequesting((p) => {
        const next = new Set(p);
        next.delete(s.userId);
        return next;
      });
    }
  }

  async function respond(request: Incoming, action: "accept" | "decline" | "block") {
    setResponding(true);
    try {
      const res = await fetch(`/api/connections/requests/${request.id}/respond`, {
        method: "POST",
        headers: await authHeaders(),
        body: JSON.stringify({ action }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(body.error ?? `Couldn't respond (error ${res.status}).`);
        return;
      }
      if (action === "accept") {
        toast.success(
          `Intro email sent! ${request.requesterDisplayName} and you have been connected — check your inbox.`,
          { duration: 6000 },
        );
      } else if (action === "decline") {
        toast.success("Request declined. They won't be notified.");
      } else {
        toast.success(`Blocked. ${request.requesterDisplayName} won't be able to contact you again.`);
      }
      setIncoming((prev) => prev.filter((r) => r.id !== request.id));
      setActive(null);
    } finally {
      setResponding(false);
    }
  }

  return (
    <div className="min-h-full study-page-bg" data-testid="connections-page">
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
        <PageTitle
          title="Connections"
          icon={Users}
          subtitle="Find collaborators in your areas of interest and stay in touch with the PsychPro team. Introductions are double opt-in and happen by email — your address is never shown in the app."
          className="mb-6"
        />

        {incoming.length > 0 && (
          <div className="bg-card rounded-2xl p-5 mb-6" data-testid="incoming-requests-banner">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">
                Incoming intro request{incoming.length > 1 ? "s" : ""} ({incoming.length})
              </h2>
            </div>
            <div className="space-y-2">
              {incoming.map((req) => (
                <button
                  key={req.id}
                  onClick={() => setActive(req)}
                  className="w-full text-left rounded-lg p-3 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 transition-all"
                  data-testid={`incoming-${req.id}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-foreground truncate">
                        {req.requesterDisplayName}
                        {req.requesterRole && (
                          <span className="text-muted-foreground font-normal">
                            {" "}— {req.requesterRole}
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Shared: {req.sharedTags.slice(0, 3).join(", ") || "shared interests"}
                      </p>
                    </div>
                    <span className="text-xs text-primary font-semibold flex-shrink-0">
                      View & respond →
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && suggestions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Loading suggestions…</p>
        ) : suggestions.length === 0 ? (
          <div className="bg-card rounded-2xl p-8 text-center">
            <p className="text-sm text-muted-foreground">
              No suggestions yet. Fill out more interests on your profile or wait for new members to
              join.
            </p>
            <Link href="/profile">
              <Button className="mt-4">Edit your profile</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((s) => (
                <SuggestionCard
                  key={s.userId}
                  suggestion={s}
                  pending={requesting.has(s.userId)}
                  sent={sent.has(s.userId)}
                  onRequest={() => requestIntro(s)}
                />
              ))}
            </div>
            {hasMore && (
              <div className="flex justify-center mt-6">
                <Button
                  onClick={() => loadSuggestions(offset + 12, true)}
                  disabled={loading}
                  data-testid="button-show-more"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Show more"}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {active && (
        <IncomingRequestModal
          request={active}
          onClose={() => setActive(null)}
          onRespond={(action) => respond(active, action)}
          busy={responding}
        />
      )}
    </div>
  );
}

function SuggestionCard({
  suggestion,
  pending,
  sent,
  onRequest,
}: {
  suggestion: Suggestion;
  pending: boolean;
  sent: boolean;
  onRequest: () => void;
}) {
  return (
    <div className="bg-card rounded-2xl p-5 flex flex-col" data-testid={`suggestion-${suggestion.userId}`}>
      <div className="flex items-start gap-3 mb-3">
        {suggestion.profilePhotoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={suggestion.profilePhotoUrl}
            alt={suggestion.displayName}
            className="w-12 h-12 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-primary/15 text-primary flex items-center justify-center font-semibold flex-shrink-0">
            {initials(suggestion.displayName)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <Link href={`/u/${suggestion.userId}`}>
            <p className="text-sm font-semibold text-foreground truncate hover:underline cursor-pointer">
              {suggestion.displayName}
            </p>
          </Link>
          {suggestion.currentRole && (
            <p className="text-xs text-muted-foreground truncate">{suggestion.currentRole}</p>
          )}
          {suggestion.institution && (
            <p className="text-xs text-muted-foreground truncate">{suggestion.institution}</p>
          )}
        </div>
      </div>

      {suggestion.bioPreview && (
        <p className="text-xs text-muted-foreground mb-3 line-clamp-3">{suggestion.bioPreview}</p>
      )}

      <div className="flex flex-wrap gap-1.5 mb-4">
        {suggestion.highlightedTags.map((t) => (
          <span
            key={t}
            className="text-[11px] px-2 py-0.5 rounded-full font-medium border border-primary/40 bg-primary/10 text-primary"
            title="Shared with you"
          >
            ✦ {t}
          </span>
        ))}
        {suggestion.overlapCount > suggestion.highlightedTags.length && (
          <span className="text-[11px] text-muted-foreground self-center">
            +{suggestion.overlapCount - suggestion.highlightedTags.length} more shared
          </span>
        )}
      </div>

      <Button
        className="mt-auto w-full"
        onClick={onRequest}
        disabled={pending || sent}
        data-testid={`button-request-${suggestion.userId}`}
      >
        {pending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : sent ? (
          <>
            <Check className="w-4 h-4 mr-1" /> Request sent
          </>
        ) : (
          "Request introduction"
        )}
      </Button>
    </div>
  );
}

function IncomingRequestModal({
  request,
  onClose,
  onRespond,
  busy,
}: {
  request: Incoming;
  onClose: () => void;
  onRespond: (action: "accept" | "decline" | "block") => void;
  busy: boolean;
}) {
  // Esc-to-close — WCAG 2.1 expectation for any dialog. Listening on window
  // ensures focus inside any inner control still dismisses the modal.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      data-testid="incoming-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="incoming-request-title"
    >
      <div
        className="bg-card rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-primary font-semibold mb-1">
                Connection request
              </p>
              <h2 id="incoming-request-title" className="text-xl font-bold text-foreground">{request.requesterDisplayName}</h2>
              {(request.requesterRole || request.requesterInstitution) && (
                <p className="text-sm text-muted-foreground mt-1">
                  {[request.requesterRole, request.requesterInstitution].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {request.requesterBio && (
            <p className="text-sm text-foreground/90 mb-4 whitespace-pre-wrap">
              {request.requesterBio}
            </p>
          )}

          <div className="mb-5">
            <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold mb-2">
              Shared interests
            </p>
            <div className="flex flex-wrap gap-1.5">
              {request.sharedTags.length === 0 ? (
                <span className="text-xs text-muted-foreground">No tags overlap right now.</span>
              ) : (
                request.sharedTags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-2 py-0.5 rounded-full border border-primary/40 bg-primary/10 text-primary"
                  >
                    ✦ {t}
                  </span>
                ))
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground mb-5">
            If you accept, we'll send one introduction email to both of you. From there, PsychPro
            steps out — the conversation lives in your inbox. Decline silently closes the request;
            block prevents them from contacting you again.
          </p>

          <div className="flex flex-col-reverse sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => onRespond("block")}
              disabled={busy}
              className="sm:flex-1"
              data-testid="button-block"
            >
              <Ban className="w-4 h-4 mr-1" /> Block
            </Button>
            <Button
              variant="outline"
              onClick={() => onRespond("decline")}
              disabled={busy}
              className="sm:flex-1"
              data-testid="button-decline"
            >
              <UserMinus className="w-4 h-4 mr-1" /> Decline
            </Button>
            <Button
              onClick={() => onRespond("accept")}
              disabled={busy}
              className="sm:flex-1"
              data-testid="button-accept"
            >
              {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>
                  <Check className="w-4 h-4 mr-1" /> Accept & introduce
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
