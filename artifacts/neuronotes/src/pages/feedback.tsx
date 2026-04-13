import { useState } from "react";
import { MessageSquare, Send, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const FEEDBACK_TYPES = [
  { value: "bug", label: "🐛 Bug Report" },
  { value: "content", label: "📚 Content Suggestion" },
  { value: "feature", label: "💡 Feature Request" },
  { value: "general", label: "💬 General Feedback" },
];

export default function FeedbackPage() {
  const [type, setType] = useState("general");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, message }),
      });
      if (!res.ok) throw new Error("Failed to submit");
      setSubmitted(true);
    } catch {
      toast.error("Failed to send feedback. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="p-6 max-w-lg mx-auto">
        <div className="flex flex-col items-center text-center py-16 gap-4">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Thanks for your feedback!</h2>
          <p className="text-muted-foreground text-sm">Your message has been received. We appreciate you helping improve NeuroNotes.</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={() => { setSubmitted(false); setMessage(""); setType("general"); }}
          >
            Send another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <MessageSquare className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Feedback</h1>
        </div>
        <p className="text-muted-foreground text-sm">Found a bug? Have a suggestion? We want to hear it.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Type</label>
          <div className="grid grid-cols-2 gap-2">
            {FEEDBACK_TYPES.map((ft) => (
              <button
                key={ft.value}
                type="button"
                onClick={() => setType(ft.value)}
                className={`px-3 py-2.5 rounded-lg border text-sm font-medium text-left transition-colors ${
                  type === ft.value
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-card text-foreground hover:bg-muted"
                }`}
              >
                {ft.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what's on your mind..."
            rows={5}
            required
            className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <Button type="submit" className="w-full gap-2" disabled={submitting || !message.trim()}>
          <Send className="w-4 h-4" />
          {submitting ? "Sending..." : "Send Feedback"}
        </Button>
      </form>
    </div>
  );
}
