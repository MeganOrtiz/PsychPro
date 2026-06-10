import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  Star, Send, Search, Filter, Upload, FileText, ExternalLink, X, Loader2, User as UserIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/brand/page-title";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  WORK_TYPES,
  INTERESTS_TAXONOMY,
  FEATURED_WORK_CONSENT_TEXT,
  MAX_FEATURED_TITLE_LENGTH,
  MIN_FEATURED_ABSTRACT_LENGTH,
  MAX_FEATURED_ABSTRACT_LENGTH,
  MAX_FEATURED_INTEREST_TAGS,
  MAX_FEATURED_FILE_BYTES,
  MAX_FEATURED_COAUTHORS_LENGTH,
  MAX_FEATURED_VENUE_LENGTH,
  workTypeLabel,
} from "@workspace/community";
import { authHeaders, jsonAuthHeaders } from "@/lib/auth-headers";

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

const ABSTRACT_PREVIEW = 220;

function headers(): Promise<Record<string, string>> { return authHeaders(); }
function jsonHeaders(): Promise<Record<string, string>> { return jsonAuthHeaders(); }
function objectsUrl(p: string | null): string | null {
  if (!p) return null;
  if (p.startsWith("http")) return p;
  if (p.startsWith("/objects/")) return `/api/storage${p}`;
  return p;
}

export default function FeaturedWorkPage() {
  const [location, navigate] = useLocation();
  const [tab, setTab] = useState<"archive" | "submit">("archive");
  const [archive, setArchive] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [workTypeFilter, setWorkTypeFilter] = useState<string>("");
  const [tagFilter, setTagFilter] = useState<string>("");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState<Submission | null>(null);

  async function loadArchive() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (workTypeFilter) params.set("workType", workTypeFilter);
      if (tagFilter) params.set("tag", tagFilter);
      if (q.trim()) params.set("q", q.trim());
      const res = await fetch(`/api/featured-work?${params.toString()}`, { headers: await headers() });
      if (!res.ok) throw new Error();
      setArchive(await res.json());
    } catch {
      toast.error("Couldn't load Featured Work archive.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadArchive(); /* eslint-disable-next-line */ }, [workTypeFilter, tagFilter]);
  useEffect(() => { const t = setTimeout(loadArchive, 300); return () => clearTimeout(t); /* eslint-disable-next-line */ }, [q]);

  // Deep-link: /featured-work?submission=ID opens detail
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const subId = sp.get("submission");
    if (subId) {
      (async () => {
        const h = await headers();
        fetch(`/api/featured-work/${subId}`, { headers: h })
          .then((r) => (r.ok ? r.json() : null))
          .then((d) => { if (d) setDetail(d); })
          .catch(() => {});
      })();
    }
  }, [location]);

  return (
    <div className="min-h-full study-page-bg" data-testid="featured-work-page">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div>
          <PageTitle
            title="Featured Work"
            icon={Star}
            subtitle="Share your work, get featured, and discover what others in the PsychPro community are creating. Approved submissions appear in the archive below and are eligible for the dashboard spotlight."
            className="mb-4"
          />
          <div className="flex justify-center">
            <Button onClick={() => setTab("submit")} className="gap-2" data-testid="button-open-submit">
              <Send className="w-4 h-4" /> Submit Your Work
            </Button>
          </div>
        </div>

        <div className="flex gap-2 border-b border-border">
          {(["archive", "submit"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                tab === t ? "border-primary text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
              data-testid={`tab-${t}`}
            >
              {t === "archive" ? "Archive" : "Submit"}
            </button>
          ))}
        </div>

        {tab === "submit" ? (
          <SubmitForm onSubmitted={() => { setTab("archive"); loadArchive(); }} />
        ) : (
          <Archive
            entries={archive}
            loading={loading}
            workTypeFilter={workTypeFilter}
            setWorkTypeFilter={setWorkTypeFilter}
            tagFilter={tagFilter}
            setTagFilter={setTagFilter}
            q={q}
            setQ={setQ}
            onOpen={(s) => { setDetail(s); navigate(`/featured-work?submission=${s.id}`, { replace: true }); }}
          />
        )}
      </div>

      {detail && (
        <DetailModal
          submission={detail}
          onClose={() => { setDetail(null); navigate("/featured-work", { replace: true }); }}
        />
      )}
    </div>
  );
}

// =============================================================================
// Archive
// =============================================================================

function Archive(props: {
  entries: Submission[]; loading: boolean;
  workTypeFilter: string; setWorkTypeFilter: (v: string) => void;
  tagFilter: string; setTagFilter: (v: string) => void;
  q: string; setQ: (v: string) => void;
  onOpen: (s: Submission) => void;
}) {
  const { entries, loading, workTypeFilter, setWorkTypeFilter, tagFilter, setTagFilter, q, setQ, onOpen } = props;
  return (
    <div className="space-y-4">
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-foreground">
          <Filter className="w-4 h-4" /> Filters
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search title, abstract, contributor…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg"
            data-testid="input-search"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={!workTypeFilter} onClick={() => setWorkTypeFilter("")}>All types</Chip>
          {WORK_TYPES.map((w) => (
            <Chip key={w.value} active={workTypeFilter === w.value} onClick={() => setWorkTypeFilter(workTypeFilter === w.value ? "" : w.value)}>
              {w.label}
            </Chip>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <Chip active={!tagFilter} onClick={() => setTagFilter("")}>All tags</Chip>
          {INTERESTS_TAXONOMY.flatMap((g) => g.tags).map((t) => (
            <Chip key={t} active={tagFilter === t} onClick={() => setTagFilter(tagFilter === t ? "" : t)}>{t}</Chip>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-56 rounded-2xl" />)}
        </div>
      ) : entries.length === 0 ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center text-muted-foreground">
          <Star className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium text-foreground mb-1">No featured work yet</p>
          <p className="text-sm max-w-md mx-auto">
            Be the first to share your work — submit research, a dissertation, a poster, or a presentation for a chance to be featured.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {entries.map((s) => <SubmissionCard key={s.id} s={s} onOpen={() => onOpen(s)} />)}
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
        active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >{children}</button>
  );
}

function SubmissionCard({ s, onOpen }: { s: Submission; onOpen: () => void }) {
  const preview = s.abstract.length > ABSTRACT_PREVIEW ? `${s.abstract.slice(0, ABSTRACT_PREVIEW).trimEnd()}…` : s.abstract;
  return (
    <button
      type="button"
      onClick={onOpen}
      className="bg-card border border-border rounded-2xl p-5 text-left transition-transform hover:-translate-y-0.5 flex flex-col gap-3"
      data-testid={`card-submission-${s.id}`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-primary/15 text-primary border border-primary/25">
          {workTypeLabel(s.workType)}
        </span>
        <span className="text-[11px] text-muted-foreground">
          {new Date(s.approvedAt ?? s.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </span>
      </div>
      <h3 className="text-base font-semibold text-foreground line-clamp-3">{s.title}</h3>
      <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed flex-1">{preview}</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-3">
        <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center"><UserIcon className="w-3.5 h-3.5 text-primary" /></div>
        <div className="min-w-0">
          <div className="truncate text-foreground font-medium">{s.submitter.displayName}</div>
          {(s.submitter.role || s.submitter.institution) && (
            <div className="truncate">{[s.submitter.role, s.submitter.institution].filter(Boolean).join(" · ")}</div>
          )}
        </div>
      </div>
      {s.interestTags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {s.interestTags.slice(0, 3).map((t) => (
            <span key={t} className="px-1.5 py-0.5 rounded-full text-[10px] bg-muted text-muted-foreground">{t}</span>
          ))}
          {s.interestTags.length > 3 && <span className="text-[10px] text-muted-foreground">+{s.interestTags.length - 3}</span>}
        </div>
      )}
    </button>
  );
}

// =============================================================================
// Detail modal
// =============================================================================

function DetailModal({ submission, onClose }: { submission: Submission; onClose: () => void }) {
  const fileHref = objectsUrl(submission.fileUrl);
  // Esc-to-close is the keyboard equivalent of the backdrop click. Listening
  // on window (not the dialog div) so focus inside any inner control still
  // dismisses the modal — this is the WCAG 2.1 expectation for a modal.
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
      className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="submission-detail-title"
    >
      <div
        className="bg-card border border-border rounded-2xl w-full max-w-2xl my-8 p-6 md:p-8 relative"
        onClick={(e) => e.stopPropagation()}
        data-testid="modal-submission-detail"
      >
        <button
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 w-9 h-9 rounded-lg bg-muted hover:bg-muted/70 flex items-center justify-center"
        ><X className="w-4 h-4" /></button>
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-primary/15 text-primary border border-primary/25">
            {workTypeLabel(submission.workType)}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(submission.approvedAt ?? submission.createdAt).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </div>
        <h2 id="submission-detail-title" className="text-xl md:text-2xl font-bold text-foreground mb-3">{submission.title}</h2>
        <div className="flex items-center gap-3 mb-5 text-sm">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center"><UserIcon className="w-5 h-5 text-primary" /></div>
          <div>
            <div className="text-foreground font-medium">{submission.submitter.displayName}</div>
            {(submission.submitter.role || submission.submitter.institution) && (
              <div className="text-xs text-muted-foreground">
                {[submission.submitter.role, submission.submitter.institution].filter(Boolean).join(" · ")}
              </div>
            )}
          </div>
        </div>
        <div className="prose prose-invert prose-sm max-w-none mb-5">
          <p className="whitespace-pre-wrap text-foreground/90 text-sm leading-relaxed">{submission.abstract}</p>
        </div>
        {(submission.coauthors || submission.venue) && (
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-5">
            {submission.coauthors && <div><dt className="text-muted-foreground uppercase tracking-wide mb-0.5">Co-authors</dt><dd className="text-foreground">{submission.coauthors}</dd></div>}
            {submission.venue && <div><dt className="text-muted-foreground uppercase tracking-wide mb-0.5">Venue / Publication</dt><dd className="text-foreground">{submission.venue}</dd></div>}
          </dl>
        )}
        {submission.interestTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {submission.interestTags.map((t) => (
              <span key={t} className="px-2 py-0.5 rounded-full text-[11px] bg-muted text-muted-foreground">{t}</span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap gap-2">
          {fileHref && (
            <Button asChild size="sm" data-testid="link-pdf">
              <a href={fileHref} target="_blank" rel="noopener noreferrer">
                <FileText className="w-4 h-4" /> Download PDF
              </a>
            </Button>
          )}
          {submission.externalLink && (
            <Button asChild variant="outline" size="sm" data-testid="link-external">
              <a href={submission.externalLink} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" /> Open link
              </a>
            </Button>
          )}
          {!submission.submitter.isAnonymous && submission.userId && (
            <Button asChild variant="outline" size="sm" data-testid="link-submitter-profile">
              <a href={`/u/${encodeURIComponent(submission.userId)}`}>
                <UserIcon className="w-4 h-4" /> View submitter profile
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// Submission form
// =============================================================================

type Profile = { displayName: string | null };

type FormState = {
  workType: string; title: string; abstract: string; externalLink: string;
  coauthors: string; venue: string; displayName: string;
  interestTags: string[]; consent: boolean; fileUrl: string | null;
  fileName: string | null;
};

const INITIAL: FormState = {
  workType: "research", title: "", abstract: "", externalLink: "",
  coauthors: "", venue: "", displayName: "",
  interestTags: [], consent: false, fileUrl: null, fileName: null,
};

function SubmitForm({ onSubmitted }: { onSubmitted: () => void }) {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const h = await headers();
      fetch("/api/profile/me", { headers: h })
        .then((r) => (r.ok ? r.json() : null))
        .then((p: Profile | null) => {
          if (p?.displayName) setForm((f) => ({ ...f, displayName: f.displayName || p.displayName! }));
        })
        .finally(() => setProfileLoaded(true));
    })();
  }, []);

  function update<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
    if (errs[k as string]) setErrs((p) => ({ ...p, [k as string]: "" }));
  }
  function toggleTag(t: string) {
    setForm((f) => {
      if (f.interestTags.includes(t)) return { ...f, interestTags: f.interestTags.filter((x) => x !== t) };
      if (f.interestTags.length >= MAX_FEATURED_INTEREST_TAGS) {
        toast.error(`You can pick up to ${MAX_FEATURED_INTEREST_TAGS} tags.`);
        return f;
      }
      return { ...f, interestTags: [...f.interestTags, t] };
    });
    if (errs.interestTags) setErrs((p) => ({ ...p, interestTags: "" }));
  }

  async function handleFile(file: File) {
    if (file.type !== "application/pdf") {
      setErrs((p) => ({ ...p, fileUrl: "Only PDF files are allowed." }));
      return;
    }
    if (file.size > MAX_FEATURED_FILE_BYTES) {
      setErrs((p) => ({ ...p, fileUrl: `File is too large — max ${Math.floor(MAX_FEATURED_FILE_BYTES / (1024 * 1024))} MB.` }));
      return;
    }
    setUploading(true);
    try {
      const reqRes = await fetch("/api/storage/uploads/request-url", {
        method: "POST",
        headers: await jsonHeaders(),
        body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }),
      });
      if (!reqRes.ok) throw new Error("upload request failed");
      const { uploadURL, objectPath } = await reqRes.json();
      const putRes = await fetch(uploadURL, { method: "PUT", headers: { "Content-Type": file.type }, body: file });
      if (!putRes.ok) throw new Error("upload failed");
      setForm((f) => ({ ...f, fileUrl: objectPath, fileName: file.name }));
      setErrs((p) => ({ ...p, fileUrl: "" }));
    } catch {
      toast.error("File upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/featured-work", {
        method: "POST",
        headers: await jsonHeaders(),
        body: JSON.stringify({
          workType: form.workType,
          title: form.title.trim(),
          abstract: form.abstract.trim(),
          externalLink: form.externalLink.trim() || undefined,
          coauthors: form.coauthors.trim() || undefined,
          venue: form.venue.trim() || undefined,
          displayName: form.displayName.trim(),
          interestTags: form.interestTags,
          consent: form.consent,
          fileUrl: form.fileUrl || undefined,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 400 && body?.fieldErrors) {
        setErrs(body.fieldErrors);
        toast.error("Please fix the highlighted fields and try again.");
        return;
      }
      if (!res.ok) {
        toast.error("Couldn't submit. Please try again.");
        return;
      }
      toast.success("Submitted! Our team reviews every entry. You'll be notified when a decision is made.");
      setForm(INITIAL);
      setErrs({});
      onSubmitted();
    } finally {
      setSubmitting(false);
    }
  }

  if (!profileLoaded) return <Skeleton className="h-96 rounded-2xl" />;

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-5 md:p-7 space-y-6" noValidate data-testid="form-submit">
      {/* Work type */}
      <Field label="Type of work" error={errs.workType}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {WORK_TYPES.map((w) => (
            <button
              key={w.value}
              type="button"
              onClick={() => update("workType", w.value)}
              className={`px-3 py-2.5 rounded-lg border text-sm font-medium text-left transition-colors ${
                form.workType === w.value ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:bg-muted"
              }`}
            >{w.label}</button>
          ))}
        </div>
      </Field>

      {/* Title */}
      <Field label="Title" error={errs.title} hint={`${form.title.length} / ${MAX_FEATURED_TITLE_LENGTH}`}>
        <input
          type="text"
          value={form.title}
          maxLength={MAX_FEATURED_TITLE_LENGTH}
          onChange={(e) => update("title", e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm"
          placeholder="e.g. Executive function across the developmental lifespan"
          data-testid="input-title"
        />
      </Field>

      {/* Abstract */}
      <Field
        label="Abstract"
        error={errs.abstract}
        hint={`${form.abstract.length} / ${MAX_FEATURED_ABSTRACT_LENGTH}  (min ${MIN_FEATURED_ABSTRACT_LENGTH})`}
      >
        <textarea
          rows={8}
          value={form.abstract}
          maxLength={MAX_FEATURED_ABSTRACT_LENGTH}
          onChange={(e) => update("abstract", e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm resize-y"
          placeholder="Plain-text abstract describing your work, methods, key findings, and significance."
          data-testid="input-abstract"
        />
      </Field>

      {/* PDF + link */}
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="PDF upload (optional, ≤25 MB)" error={errs.fileUrl}>
          {form.fileUrl ? (
            <div className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg bg-muted/40 text-sm">
              <FileText className="w-4 h-4 text-primary" />
              <span className="truncate text-foreground flex-1">{form.fileName ?? "Attached file"}</span>
              <button type="button" onClick={() => setForm((f) => ({ ...f, fileUrl: null, fileName: null }))} className="text-xs text-muted-foreground hover:text-foreground">Remove</button>
            </div>
          ) : (
            <label className="flex items-center justify-center gap-2 px-3 py-3 border border-dashed border-border rounded-lg cursor-pointer text-sm text-muted-foreground hover:text-foreground hover:bg-muted/40">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              {uploading ? "Uploading…" : "Choose a PDF"}
              <input type="file" accept="application/pdf" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </label>
          )}
        </Field>
        <Field label="External link (optional)" error={errs.externalLink}>
          <input
            type="url"
            value={form.externalLink}
            onChange={(e) => update("externalLink", e.target.value)}
            placeholder="https://… (DOI, preprint, repository)"
            className="w-full rounded-lg px-3 py-2 text-sm"
            data-testid="input-link"
          />
        </Field>
      </div>

      {/* Coauthors / venue */}
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Co-authors (optional)" error={errs.coauthors}>
          <input
            type="text"
            value={form.coauthors}
            maxLength={MAX_FEATURED_COAUTHORS_LENGTH}
            onChange={(e) => update("coauthors", e.target.value)}
            placeholder="Comma-separated names"
            className="w-full rounded-lg px-3 py-2 text-sm"
          />
        </Field>
        <Field label="Venue / Publication (optional)" error={errs.venue}>
          <input
            type="text"
            value={form.venue}
            maxLength={MAX_FEATURED_VENUE_LENGTH}
            onChange={(e) => update("venue", e.target.value)}
            placeholder="Journal, conference, or institution"
            className="w-full rounded-lg px-3 py-2 text-sm"
          />
        </Field>
      </div>

      {/* Interest tags */}
      <Field label={`Interest tags (1–${MAX_FEATURED_INTEREST_TAGS}, choose at least one)`} error={errs.interestTags} hint={`${form.interestTags.length} selected`}>
        <div className="space-y-3">
          {INTERESTS_TAXONOMY.map((g) => (
            <div key={g.category}>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1.5">{g.category}</p>
              <div className="flex flex-wrap gap-1.5">
                {g.tags.map((t) => {
                  const selected = form.interestTags.includes(t);
                  return (
                    <button
                      type="button"
                      key={t}
                      onClick={() => toggleTag(t)}
                      className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${
                        selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-foreground hover:bg-muted"
                      }`}
                    >{t}</button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Field>

      {/* Display name */}
      <Field label="Display name on submission" error={errs.displayName} hint="Defaults to your profile display name.">
        <input
          type="text"
          value={form.displayName}
          onChange={(e) => update("displayName", e.target.value)}
          className="w-full rounded-lg px-3 py-2 text-sm"
          data-testid="input-display-name"
        />
      </Field>

      {/* Consent */}
      <div className={`rounded-xl border p-4 ${errs.consent ? "border-red-400/60" : "border-border"}`}>
        <label className="flex items-start gap-3 text-sm text-foreground cursor-pointer">
          <input
            type="checkbox"
            checked={form.consent}
            onChange={(e) => update("consent", e.target.checked)}
            className="mt-0.5"
            data-testid="checkbox-consent"
          />
          <span>{FEATURED_WORK_CONSENT_TEXT}</span>
        </label>
        {errs.consent && <p role="alert" className="text-xs text-red-400 mt-2">{errs.consent}</p>}
      </div>

      <Button type="submit" disabled={submitting || uploading} className="gap-2" data-testid="button-submit-featured">
        <Send className="w-4 h-4" />{submitting ? "Submitting…" : "Submit for review"}
      </Button>
    </form>
  );
}

function Field({ label, error, hint, children }: { label: string; error?: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-2 mb-2">
        <label className="block text-sm font-medium text-foreground">{label}</label>
        {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
      {error && <p role="alert" className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

