import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MessageSquare, Clock, CheckCheck, Bug, Lightbulb, Sparkles, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageTitle } from "@/components/brand/page-title";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { authHeaders, jsonAuthHeaders } from "@/lib/auth-headers";

type FeedbackEntry = {
  id: number;
  userId: string;
  email: string | null;
  submitterEmail: string | null;
  role: string | null;
  type: string;
  message: string;
  status: "unread" | "read" | "resolved";
  createdAt: string;
};

const TYPE_ICONS: Record<string, React.ReactNode> = {
  bug: <Bug className="w-3.5 h-3.5" />,
  content: <MessageSquare className="w-3.5 h-3.5" />,
  feature: <Lightbulb className="w-3.5 h-3.5" />,
  general: <Sparkles className="w-3.5 h-3.5" />,
};

const STATUS_COLORS: Record<string, string> = {
  unread: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  read: "bg-muted text-muted-foreground",
  resolved: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
};

export default function AdminFeedbackPage() {
  const [, navigate] = useLocation();
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "read" | "resolved">("all");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/feedback", { headers: await authHeaders() });
      if (res.status === 403) {
        navigate("/dashboard");
        return;
      }
      if (!res.ok) throw new Error("Failed");
      setEntries(await res.json());
    } catch {
      toast.error("Failed to load feedback");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function setStatus(id: number, status: string) {
    try {
      const res = await fetch(`/api/feedback/${id}/status`, {
        method: "PATCH",
        headers: await jsonAuthHeaders(),
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      setEntries((prev) => prev.map((e) => e.id === id ? { ...e, status: status as FeedbackEntry["status"] } : e));
    } catch {
      toast.error("Failed to update status");
    }
  }

  const filtered = filter === "all" ? entries : entries.filter((e) => e.status === filter);
  const unreadCount = entries.filter((e) => e.status === "unread").length;

  return (
    <div className="min-h-full study-page-bg" data-testid="admin-feedback-page">
      <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
      <PageTitle
        title="Feedback Inbox"
        icon={MessageSquare}
        subtitle={`${entries.length} total submission${entries.length !== 1 ? "s" : ""}${unreadCount > 0 ? ` · ${unreadCount} unread` : ""}`}
        className="mb-4"
      />
      <div className="flex justify-center mb-6">
        <Button variant="outline" size="sm" onClick={load} className="gap-1.5 flex-shrink-0">
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </Button>
      </div>

      <div className="flex gap-2 mb-5 flex-wrap">
        {(["all", "unread", "read", "resolved"] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-none text-xs font-medium border transition-colors capitalize ${
              filter === s
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            {s}{s === "all" ? ` (${entries.length})` : ` (${entries.filter((e) => e.status === s).length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="font-medium">No {filter !== "all" ? filter : ""} feedback yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((entry) => (
            <div
              key={entry.id}
              className={`bg-card border rounded-xl p-4 transition-colors ${
                entry.status === "unread" ? "border-primary/40" : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 flex-wrap min-w-0">
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-foreground capitalize`}>
                    {TYPE_ICONS[entry.type] || TYPE_ICONS.general}
                    {entry.type}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[entry.status]}`}>
                    {entry.status}
                  </span>
                  <span className="text-xs text-muted-foreground truncate">
                    {entry.email || entry.submitterEmail || entry.role || entry.userId.slice(0, 12) + "…"}
                    {entry.submitterEmail && entry.email && entry.submitterEmail !== entry.email && (
                      <span className="ml-1 opacity-70">· reply: {entry.submitterEmail}</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap flex-shrink-0">
                  <Clock className="w-3 h-3" />
                  {new Date(entry.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>

              <p className="text-sm text-foreground leading-relaxed mb-3 whitespace-pre-wrap">{entry.message}</p>

              <div className="flex gap-2">
                {entry.status !== "read" && (
                  <button
                    onClick={() => setStatus(entry.id, "read")}
                    className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-none px-2.5 py-1 transition-colors"
                  >
                    Mark read
                  </button>
                )}
                {entry.status !== "resolved" && (
                  <button
                    onClick={() => setStatus(entry.id, "resolved")}
                    className="text-xs text-green-700 dark:text-green-400 hover:text-green-800 border border-green-200 dark:border-green-800 rounded-none px-2.5 py-1 transition-colors flex items-center gap-1"
                  >
                    <CheckCheck className="w-3 h-3" />
                    Resolve
                  </button>
                )}
                {entry.status === "resolved" && (
                  <button
                    onClick={() => setStatus(entry.id, "unread")}
                    className="text-xs text-muted-foreground hover:text-foreground border border-border rounded-none px-2.5 py-1 transition-colors"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
