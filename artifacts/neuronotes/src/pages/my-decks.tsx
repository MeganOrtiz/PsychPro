import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { BookMarked, Trash2, Clock, CheckCircle, AlertCircle, Loader2, Wrench, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { authHeaders } from "@/lib/auth-headers";

type DeckSummary = {
  id: number;
  title: string;
  status: string;
  tier?: "standard" | "pro";
  createdAt: string;
};

function StatusBadge({ status }: { status: string }) {
  if (status === "ready") return (
    <span className="inline-flex items-center gap-1 text-xs text-green-700 dark:text-green-400">
      <CheckCircle className="w-3 h-3" /> Ready
    </span>
  );
  if (status === "processing") return (
    <span className="inline-flex items-center gap-1 text-xs text-yellow-700 dark:text-yellow-400">
      <Loader2 className="w-3 h-3 animate-spin" /> Processing
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 text-xs text-red-600 dark:text-red-400">
      <AlertCircle className="w-3 h-3" /> Error
    </span>
  );
}

export default function MyDecksPage() {
  const [, navigate] = useLocation();
  const [decks, setDecks] = useState<DeckSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<number | null>(null);

  async function loadDecks() {
    try {
      const res = await fetch("/api/custom-decks", { headers: await authHeaders() });
      if (res.status === 403) {
        navigate("/subscription");
        return;
      }
      if (!res.ok) throw new Error("Failed");
      setDecks(await res.json());
    } catch {
      toast.error("Failed to load decks");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadDecks(); }, []);

  async function deleteDeck(id: number, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm("Delete this deck? This cannot be undone.")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/custom-decks/${id}`, { method: "DELETE", headers: await authHeaders() });
      if (!res.ok) throw new Error("Delete failed");
      setDecks((prev) => prev.filter((d) => d.id !== id));
      toast.success("Deck deleted");
    } catch {
      toast.error("Failed to delete deck");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="min-h-full study-page-bg" data-testid="my-decks-page">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Tools</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-4">Tools generated from your own materials</p>
        <div className="grid grid-cols-2 gap-2">
          <Link href="/my-decks/new?tier=standard">
            <Button variant="outline" className="w-full gap-2 justify-center">
              <Wrench className="w-4 h-4" /> Standard Tools
            </Button>
          </Link>
          <Link href="/my-decks/new?tier=pro">
            <Button className="w-full gap-2 justify-center bg-purple-600 hover:bg-purple-700 text-white">
              <Sparkles className="w-4 h-4" /> Pro Tools
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : decks.length === 0 ? (
        <div className="text-center py-16 bg-card border border-border rounded-xl">
          <BookMarked className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
          <p className="font-semibold text-foreground mb-1">No toolkits yet</p>
          <p className="text-sm text-muted-foreground mb-5">Choose Standard or Pro Tools above to upload your study materials and generate your first toolkit.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {decks.map((deck) => (
            <Link key={deck.id} href={deck.status === "ready" ? `/my-decks/${deck.id}` : "#"}>
              <div className={`bg-card border border-border rounded-xl p-5 flex items-center justify-between gap-3 transition-all ${deck.status === "ready" ? "hover:border-primary/40 hover:shadow-sm cursor-pointer" : "opacity-70"}`}>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-foreground truncate">{deck.title}</p>
                    {deck.tier === "pro" ? (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 inline-flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" />Pro</span>
                    ) : (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 inline-flex items-center gap-1"><Wrench className="w-2.5 h-2.5" />Standard</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1">
                    <StatusBadge status={deck.status} />
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(deck.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <button
                  onClick={(e) => deleteDeck(deck.id, e)}
                  disabled={deleting === deck.id}
                  className="p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0"
                >
                  {deleting === deck.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                </button>
              </div>
            </Link>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
