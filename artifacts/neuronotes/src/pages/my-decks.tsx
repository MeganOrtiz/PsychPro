import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { BookMarked, Plus, Trash2, Clock, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

type DeckSummary = {
  id: number;
  title: string;
  status: string;
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
      const res = await fetch("/api/custom-decks");
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
      await fetch(`/api/custom-decks/${id}`, { method: "DELETE" });
      setDecks((prev) => prev.filter((d) => d.id !== id));
      toast.success("Deck deleted");
    } catch {
      toast.error("Failed to delete deck");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BookMarked className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">My Decks</h1>
          </div>
          <p className="text-muted-foreground text-sm">Study tools generated from your own materials</p>
        </div>
        <Link href="/my-decks/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Deck
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : decks.length === 0 ? (
        <div className="text-center py-16 border-2 border-dashed border-border rounded-2xl">
          <BookMarked className="w-12 h-12 mx-auto mb-3 text-muted-foreground opacity-40" />
          <p className="font-semibold text-foreground mb-1">No decks yet</p>
          <p className="text-sm text-muted-foreground mb-5">Upload your notes or paste text to create your first custom study deck.</p>
          <Link href="/my-decks/new">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create Your First Deck
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {decks.map((deck) => (
            <Link key={deck.id} href={deck.status === "ready" ? `/my-decks/${deck.id}` : "#"}>
              <div className={`bg-card border border-border rounded-xl p-4 flex items-center justify-between gap-3 transition-colors ${deck.status === "ready" ? "hover:border-primary/40 cursor-pointer" : "opacity-70"}`}>
                <div className="min-w-0">
                  <p className="font-medium text-foreground truncate">{deck.title}</p>
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
  );
}
