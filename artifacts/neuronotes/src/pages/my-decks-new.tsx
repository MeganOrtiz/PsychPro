import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Upload, FileText, X, Loader2, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type InputMode = "text" | "file";

export default function NewDeckPage() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState<InputMode>("text");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [generating, setGenerating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = ".pdf,.docx,.doc,.txt";

  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const ok = f.name.match(/\.(pdf|docx?|txt)$/i);
    if (!ok) { toast.error("Only PDF, DOCX, or TXT files are supported"); return; }
    setFile(f);
  }

  function removeFile() {
    setFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "text" && text.trim().length < 50) {
      toast.error("Please paste at least a few paragraphs of study material.");
      return;
    }
    if (mode === "file" && !file) {
      toast.error("Please select a file to upload.");
      return;
    }

    setGenerating(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim() || "My Study Deck");
      if (mode === "file" && file) {
        formData.append("file", file);
      } else {
        formData.append("text", text);
      }

      const res = await fetch("/api/custom-decks", { method: "POST", body: formData });
      if (res.status === 403) {
        toast.error("Scholar subscription required to create custom decks.");
        navigate("/subscription");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create deck");
      }
      const deck = await res.json();
      toast.success("Study materials generated successfully!");
      navigate(`/my-decks/${deck.id}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to generate study materials";
      toast.error(message);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-lg mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-primary" />
          <h1 className="text-2xl font-bold text-foreground">Create Study Deck</h1>
        </div>
        <p className="text-muted-foreground text-sm">Upload your notes or paste text — we'll generate flashcards, quizzes, a study guide, and a practice exam from your exact content.</p>
      </div>

      {generating ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-primary animate-pulse" />
          </div>
          <div>
            <p className="font-semibold text-foreground text-lg">Generating your study materials…</p>
            <p className="text-muted-foreground text-sm mt-1">This takes 20–40 seconds. Please don't close this page.</p>
          </div>
          <Loader2 className="w-6 h-6 text-primary animate-spin mt-2" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Deck Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 5 Notes, Midterm Review…"
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Study Material</label>
            <div className="flex rounded-lg border border-border overflow-hidden mb-3">
              <button
                type="button"
                onClick={() => setMode("text")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "text" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
              >
                <FileText className="w-4 h-4 inline mr-1.5" />
                Paste Text
              </button>
              <button
                type="button"
                onClick={() => setMode("file")}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${mode === "file" ? "bg-primary text-primary-foreground" : "bg-card text-muted-foreground hover:bg-muted"}`}
              >
                <Upload className="w-4 h-4 inline mr-1.5" />
                Upload File
              </button>
            </div>

            {mode === "text" ? (
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your lecture notes, textbook sections, or any study material here…"
                rows={10}
                className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              />
            ) : (
              <div>
                {file ? (
                  <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-xl">
                    <FileText className="w-8 h-8 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(0)} KB</p>
                    </div>
                    <button type="button" onClick={removeFile} className="p-1 rounded-lg hover:bg-muted transition-colors">
                      <X className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary/40 hover:bg-primary/5 transition-colors">
                    <Upload className="w-10 h-10 text-muted-foreground opacity-60" />
                    <div className="text-center">
                      <p className="text-sm font-medium text-foreground">Click to upload or drag & drop</p>
                      <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, or TXT — up to 20 MB</p>
                    </div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept={ACCEPTED}
                      onChange={onFileChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            )}
          </div>

          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 flex gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300">All generated content is derived exclusively from your source material — no outside information is added.</p>
          </div>

          <div className="flex gap-3">
            <Button type="button" variant="outline" className="flex-1" onClick={() => navigate("/my-decks")}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 gap-2">
              <Sparkles className="w-4 h-4" />
              Generate Study Materials
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
