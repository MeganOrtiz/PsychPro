import { useState } from "react";
import { Star, Send, CheckCircle, GraduationCap, Microscope, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const SUBMISSION_TYPES = [
  { value: "dissertation", label: "Dissertation", description: "Doctoral or master's research", icon: GraduationCap },
  { value: "research", label: "Research", description: "Published or in-progress study", icon: Microscope },
  { value: "clinical", label: "Clinical Experience", description: "Cases, practice insights, lessons learned", icon: Stethoscope },
] as const;

type SubmissionType = typeof SUBMISSION_TYPES[number]["value"];

export default function FeatureRequestPage() {
  const [submissionType, setSubmissionType] = useState<SubmissionType>("dissertation");
  const [name, setName] = useState("");
  const [credentials, setCredentials] = useState("");
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!summary.trim()) return;
    setSubmitting(true);
    try {
      const message = [
        `Submission type: ${submissionType}`,
        name.trim() ? `Name: ${name.trim()}` : null,
        credentials.trim() ? `Credentials/affiliation: ${credentials.trim()}` : null,
        title.trim() ? `Title: ${title.trim()}` : null,
        link.trim() ? `Link: ${link.trim()}` : null,
        "",
        "Summary:",
        summary.trim(),
      ].filter((line) => line !== null).join("\n");

      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "spotlight", message }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      toast.error("Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-full study-page-bg">
        <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8">
          <div className="flex flex-col items-center text-center py-16 gap-4">
            <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Submission received</h2>
            <p className="text-muted-foreground text-sm max-w-sm">Thanks for sharing your work. Our team reviews every submission and will reach out if we'd like to feature it on PsychPro.</p>
            <Button
              variant="outline"
              className="mt-2"
              onClick={() => {
                setSubmitted(false);
                setName("");
                setCredentials("");
                setTitle("");
                setSummary("");
                setLink("");
              }}
            >
              Submit another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full study-page-bg" data-testid="feature-request-page">
      <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Star className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Be Featured</h1>
        </div>
        <p className="text-sm text-muted-foreground">Submit your dissertation, research, or clinical experience. Selected work may be highlighted to the PsychPro community.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Type of submission</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {SUBMISSION_TYPES.map((t) => {
              const checked = submissionType === t.value;
              return (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setSubmissionType(t.value)}
                  className={`flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all ${
                    checked
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/40 hover:bg-muted/40"
                  }`}
                >
                  <t.icon className={`w-4 h-4 ${checked ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-sm font-semibold ${checked ? "text-primary" : "text-foreground"}`}>{t.label}</span>
                  <span className="text-[11px] text-muted-foreground leading-snug">{t.description}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Your name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Optional"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Credentials / affiliation</label>
            <input
              type="text"
              value={credentials}
              onChange={(e) => setCredentials(e.target.value)}
              placeholder="e.g. Ph.D. candidate, Psy.D., Univ. of …"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Title of work</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Prefrontal contributions to executive function across the lifespan"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            Summary <span className="text-muted-foreground font-normal">(required)</span>
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Briefly describe your work, the key findings or insights, and why it would be valuable to the PsychPro community."
            rows={6}
            required
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Link to work</label>
          <input
            type="url"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="https://… (DOI, preprint, repository, portfolio)"
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button type="submit" className="w-full gap-2" disabled={submitting || !summary.trim()}>
          <Send className="w-4 h-4" />
          {submitting ? "Submitting..." : "Submit to be featured"}
        </Button>
      </form>
      </div>
    </div>
  );
}
