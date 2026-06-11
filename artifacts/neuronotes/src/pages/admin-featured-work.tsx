import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ShieldCheck, RefreshCw, Check, X, MessageCircle, ExternalLink, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/brand/page-title";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { workTypeLabel } from "@workspace/community";
import { authHeaders } from "@/lib/auth-headers";

type Submission = {
  id: number;
  userId: string | null;
  workType: string;
  title: string;
  abstract: string;
  fileUrl: string | null;
  externalLink: string | null;
  coauthors: string | null;
  venue: string | null;
  displayName: string;
  interestTags: string[];
  status: "pending" | "approved" | "rejected" | "revision_requested";
  adminNote: string | null;
  createdAt: string;
  reviewedAt: string | null;
  approvedAt: string | null;
  submitter: { displayName: string; role: string | null; institution: string | null; isAnonymous: boolean };
};

const STATUSES = ["pending", "approved", "revision_requested", "rejected"] as const;
type Status = typeof STATUSES[number];

const STATUS_LABEL: Record<Status, string> = {
  pending: "Pending",
  approved: "Approved",
  revision_requested: "Revision Requested",
  rejected: "Rejected",
};

const STATUS_PILL: Record<Status, string> = {
  pending: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  approved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  revision_requested: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  rejected: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

function headers(): Promise<Record<string, string>> { return authHeaders(); }
function objectsUrl(p: string | null): string | null {
  if (!p) return null;
  if (p.startsWith("http")) return p;
  if (p.startsWith("/objects/")) return `/api/storage${p}`;
  return p;
}

export default function AdminFeaturedWorkPage() {
  const [, navigate] = useLocation();
  const [entries, setEntries] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Status>("pending");
  const [actionFor, setActionFor] = useState<{ id: number; status: Status } | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/featured-work", { headers: await headers() });
      if (res.status === 403 || res.status === 401) { navigate("/dashboard"); return; }
      if (!res.ok) throw new Error();
      setEntries(await res.json());
    } catch {
      toast.error("Failed to load submissions.");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const filtered = entries.filter((e) => e.status === filter);
  const counts = STATUSES.reduce((acc, s) => ({ ...acc, [s]: entries.filter((e) => e.status === s).length }), {} as Record<Status, number>);

  async function applyAction(id: number, status: Status, adminNote?: string) {
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/featured-work/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...(await headers()) },
        body: JSON.stringify({ status, adminNote }),
      });
      if (!res.ok) throw new Error();
      const updated: Submission = await res.json();
      setEntries((prev) => prev.map((e) => (e.id === id ? updated : e)));
      setActionFor(null);
      setNote("");
      toast.success(`Submission ${status === "approved" ? "approved" : status === "rejected" ? "rejected" : "marked needs revision"}.`);
    } catch {
      toast.error("Action failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-full study-page-bg" data-testid="admin-featured-work-page">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        <PageTitle
          title="Manage Featured Work"
          icon={ShieldCheck}
          subtitle={`${entries.length} total submission${entries.length !== 1 ? "s" : ""}`}
          className="mb-4"
        />
        <div className="flex justify-center mb-6">
          <Button variant="outline" size="sm" onClick={load} className="gap-1.5"><RefreshCw className="w-3.5 h-3.5" />Refresh</Button>
        </div>

        <div className="flex gap-2 mb-5 flex-wrap">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                filter === s ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted"
              }`}
              data-testid={`tab-status-${s}`}
            >{STATUS_LABEL[s]} ({counts[s]})</button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 rounded-xl" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground bg-card border border-border rounded-xl">
            <ShieldCheck className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No {STATUS_LABEL[filter].toLowerCase()} submissions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((s) => {
              const fileHref = objectsUrl(s.fileUrl);
              return (
                <div key={s.id} className="bg-card border border-border rounded-xl p-4" data-testid={`row-submission-${s.id}`}>
                  <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap min-w-0">
                      <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-muted text-foreground">{workTypeLabel(s.workType)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${STATUS_PILL[s.status as Status]}`}>{STATUS_LABEL[s.status as Status]}</span>
                      <span className="text-[11px] text-muted-foreground">{s.submitter.displayName}{s.submitter.institution ? ` · ${s.submitter.institution}` : ""}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">{new Date(s.createdAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground mb-1.5">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3 whitespace-pre-wrap">{s.abstract}</p>
                  {s.interestTags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {s.interestTags.map((t) => <span key={t} className="px-1.5 py-0.5 rounded-full text-[10px] bg-muted text-muted-foreground">{t}</span>)}
                    </div>
                  )}
                  {s.adminNote && (
                    <div className="text-xs text-muted-foreground bg-muted/40 rounded-lg px-3 py-2 mb-3">
                      <span className="font-semibold text-foreground">Reviewer note:</span> {s.adminNote}
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {fileHref && (
                      <a href={fileHref} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-2.5 py-1">
                        <FileText className="w-3 h-3" /> PDF
                      </a>
                    )}
                    {s.externalLink && (
                      <a href={s.externalLink} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded-md px-2.5 py-1">
                        <ExternalLink className="w-3 h-3" /> Link
                      </a>
                    )}
                    <div className="flex-1" />
                    {s.status !== "approved" && (
                      <button onClick={() => applyAction(s.id, "approved")} disabled={busy} className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 rounded-md px-2.5 py-1">
                        <Check className="w-3 h-3" /> Approve
                      </button>
                    )}
                    {s.status !== "revision_requested" && (
                      <button onClick={() => { setActionFor({ id: s.id, status: "revision_requested" }); setNote(s.adminNote ?? ""); }} className="inline-flex items-center gap-1 text-xs text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 rounded-md px-2.5 py-1">
                        <MessageCircle className="w-3 h-3" /> Request revision
                      </button>
                    )}
                    {s.status !== "rejected" && (
                      <button onClick={() => { setActionFor({ id: s.id, status: "rejected" }); setNote(s.adminNote ?? ""); }} className="inline-flex items-center gap-1 text-xs text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-md px-2.5 py-1">
                        <X className="w-3 h-3" /> Reject
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {actionFor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => !busy && setActionFor(null)}>
          <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-semibold text-foreground mb-2">{actionFor.status === "rejected" ? "Reject submission" : "Request a revision"}</h2>
            <p className="text-xs text-muted-foreground mb-3">{actionFor.status === "rejected" ? "Optional: tell the submitter why." : "Optional: describe what needs to change."}</p>
            <textarea
              rows={4}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm mb-4"
              placeholder="Note for the submitter (optional)…"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => setActionFor(null)} disabled={busy}>Cancel</Button>
              <Button size="sm" onClick={() => applyAction(actionFor.id, actionFor.status, note.trim() || undefined)} disabled={busy} className="gap-1.5">
                {busy && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
