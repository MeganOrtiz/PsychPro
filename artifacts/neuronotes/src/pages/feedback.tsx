import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/brand/page-title";
import { toast } from "sonner";
import { jsonAuthHeaders } from "@/lib/auth-headers";

const FEEDBACK_TYPES = [
  { value: "bug", label: "Bug Report" },
  { value: "content", label: "Content Suggestion" },
  { value: "general", label: "General Feedback" },
];

const MIN_MESSAGE_LENGTH = 20;
const DEFAULT_TYPE = "general";

const SUCCESS_COPY: Record<string, string> = {
  bug: "Thanks for the bug report — we're on it.",
  content: "Thanks for the suggestion — we'll take a look.",
  general: "Thanks — your feedback has been sent. We read every message and will follow up if needed.",
};

type FieldErrors = { message?: string; submitterEmail?: string };

function extractFieldErrors(body: unknown): FieldErrors | null {
  if (!body || typeof body !== "object") return null;
  const raw = (body as { fieldErrors?: unknown }).fieldErrors;
  if (!raw || typeof raw !== "object") return null;
  const src = raw as Record<string, unknown>;
  const out: FieldErrors = {};
  if (typeof src.message === "string") out.message = src.message;
  if (typeof src.submitterEmail === "string") out.submitterEmail = src.submitterEmail;
  return Object.keys(out).length > 0 ? out : null;
}

export default function FeedbackPage() {
  const [type, setType] = useState(DEFAULT_TYPE);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  function validateClient(): FieldErrors {
    const errs: FieldErrors = {};
    const trimmed = message.trim();
    if (!trimmed) {
      errs.message = "Message is required.";
    } else if (trimmed.length < MIN_MESSAGE_LENGTH) {
      errs.message = `Please add a bit more detail — at least ${MIN_MESSAGE_LENGTH} characters (currently ${trimmed.length}).`;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.submitterEmail = "Please enter a valid email address.";
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clientErrs = validateClient();
    setFieldErrors(clientErrs);
    if (Object.keys(clientErrs).length > 0) return;

    setSubmitting(true);
    const submittedType = type;
    let res: Response;
    try {
      res = await fetch("/api/feedback", {
        method: "POST",
        headers: await jsonAuthHeaders(),
        body: JSON.stringify({
          type: submittedType,
          message: message.trim(),
          submitterEmail: email.trim() || undefined,
        }),
      });
    } catch (networkErr) {
      console.error("[feedback] network error", networkErr);
      toast.error("Can't reach the server. Check your connection and try again.");
      setSubmitting(false);
      return;
    }

    let body: unknown = null;
    try {
      body = await res.clone().json();
    } catch {
      try { body = await res.text(); } catch { body = null; }
    }

    if (res.ok) {
      setMessage("");
      setEmail("");
      setType(DEFAULT_TYPE);
      setFieldErrors({});
      toast.success(SUCCESS_COPY[submittedType] ?? SUCCESS_COPY.general, {
        duration: 4000,
        position: "bottom-right",
      });
      setSubmitting(false);
      return;
    }

    console.error(`[feedback] submit failed: ${res.status}`, body);

    const serverFieldErrors = extractFieldErrors(body);
    if (res.status === 400 && serverFieldErrors) {
      setFieldErrors(serverFieldErrors);
      toast.error("Please fix the highlighted fields and try again.");
    } else if (res.status === 401 || res.status === 403) {
      toast.error("You're not allowed to send feedback right now. Try signing in and try again.");
    } else if (res.status === 429) {
      toast.error("You're sending feedback too quickly. Please wait a moment and try again.");
    } else if (res.status >= 500) {
      toast.error("Something went wrong on our end. Please try again in a minute.");
    } else {
      toast.error(`Couldn't send feedback (error ${res.status}). Please try again.`);
    }
    setSubmitting(false);
  }

  return (
    <div className="min-h-full study-page-bg" data-testid="feedback-page">
      <div className="max-w-lg mx-auto p-4 md:p-6 lg:p-8">
      <PageTitle
        title="Feedback"
        icon={MessageSquare}
        subtitle="Found a bug? Have a suggestion? We want to hear it."
        className="mb-6"
      />

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <div className="flex flex-wrap justify-center gap-2">
            {FEEDBACK_TYPES.map((ft) => {
              const selected = type === ft.value;
              return (
                <button
                  key={ft.value}
                  type="button"
                  onClick={() => setType(ft.value)}
                  aria-pressed={selected}
                  style={{
                    backgroundImage:
                      "linear-gradient(145deg, rgba(12,73,87,0.90), rgba(7,52,63,0.90))",
                  }}
                  className={`grow-0 shrink-0 basis-[calc(50%-0.25rem)] px-3 py-2.5 rounded-md border text-sm font-medium text-center text-foreground transition-all ${
                    selected
                      ? "border-[rgba(118,228,247,0.75)] shadow-[0_0_18px_rgba(118,228,247,0.45)]"
                      : "border-[rgba(118,228,247,0.3)] hover:border-[rgba(118,228,247,0.55)] hover:shadow-[0_0_14px_rgba(118,228,247,0.28)]"
                  }`}
                >
                  {ft.label}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2" htmlFor="feedback-message">Message</label>
          <textarea
            id="feedback-message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              if (fieldErrors.message) setFieldErrors((p) => ({ ...p, message: undefined }));
            }}
            placeholder="Tell us what's on your mind..."
            rows={5}
            aria-invalid={!!fieldErrors.message}
            aria-describedby={fieldErrors.message ? "feedback-message-error" : undefined}
            className={`w-full rounded-lg border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 ${
              fieldErrors.message
                ? "border-red-400/60 bg-card focus:ring-red-400/60"
                : "border-border bg-card focus:ring-primary"
            }`}
          />
          {fieldErrors.message ? (
            <p id="feedback-message-error" className="mt-1.5 text-xs text-red-400" role="alert">
              {fieldErrors.message}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-muted-foreground">At least {MIN_MESSAGE_LENGTH} characters.</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2" htmlFor="feedback-email">
            Email <span className="text-muted-foreground font-normal">(optional, if you'd like a reply)</span>
          </label>
          <input
            id="feedback-email"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (fieldErrors.submitterEmail) setFieldErrors((p) => ({ ...p, submitterEmail: undefined }));
            }}
            placeholder="you@example.com"
            aria-invalid={!!fieldErrors.submitterEmail}
            aria-describedby={fieldErrors.submitterEmail ? "feedback-email-error" : undefined}
            className={`w-full rounded-lg border px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 ${
              fieldErrors.submitterEmail
                ? "border-red-400/60 bg-card focus:ring-red-400/60"
                : "border-border bg-card focus:ring-primary"
            }`}
          />
          {fieldErrors.submitterEmail && (
            <p id="feedback-email-error" className="mt-1.5 text-xs text-red-400" role="alert">
              {fieldErrors.submitterEmail}
            </p>
          )}
        </div>

        <Button type="submit" className="w-full gap-2" disabled={submitting}>
          <Send className="w-4 h-4" />
          {submitting ? "Sending..." : "Send Feedback"}
        </Button>
      </form>
      </div>
    </div>
  );
}
