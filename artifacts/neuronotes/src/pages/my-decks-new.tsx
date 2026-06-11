import { useState, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import {
  Upload, FileText, X, Loader2, Sparkles, AlertCircle, BookOpen, Wand2,
  Layers, BookMarked, GraduationCap, Timer, Pencil, Wrench, Shuffle, Repeat,
  ArrowRight, ChevronLeft,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { authHeaders } from "@/lib/auth-headers";
import { PageTitle } from "@/components/brand/page-title";

type InputMode = "text" | "file";
type AiMode = "strict" | "enhance";

type StandardTool = "flashcards" | "quiz" | "studyGuide" | "exam";
type ProTool = "match" | "cloze" | "review";
type ToolId = StandardTool | ProTool;

type ToolDef = {
  id: ToolId;
  label: string;
  blurb: string;
  longBlurb: string;
  icon: React.ComponentType<{ className?: string }>;
};

const STANDARD_TOOLS: ToolDef[] = [
  {
    id: "flashcards",
    label: "Flashcards",
    blurb: "Card pool for active recall.",
    longBlurb: "Generate a set of front/back cards from your material so you can drill yourself, retrieve, and reinforce — the highest-yield study move there is.",
    icon: Layers,
  },
  {
    id: "quiz",
    label: "Quiz",
    blurb: "Multiple-choice questions to test understanding.",
    longBlurb: "AI-generated multiple-choice items with plausible distractors. Great for self-testing and identifying weak spots before a real exam.",
    icon: BookMarked,
  },
  {
    id: "studyGuide",
    label: "Study Guide",
    blurb: "Organized markdown summary of the material.",
    longBlurb: "A clean, structured rundown of the source material — headings, key terms, and bullet summaries you can scan or print.",
    icon: BookOpen,
  },
  {
    id: "exam",
    label: "Practice Exam",
    blurb: "Timed test pulled from the quiz pool.",
    longBlurb: "A longer, exam-style assessment drawn from your quiz items. Optional timer mimics test conditions for realistic prep.",
    icon: GraduationCap,
  },
];

const PRO_TOOLS: ToolDef[] = [
  {
    id: "match",
    label: "Matching Game",
    blurb: "Pair terms with their definitions.",
    longBlurb: "A timed pairing game built from your card pool — strengthens recognition and term-definition links through retrieval and play.",
    icon: Shuffle,
  },
  {
    id: "cloze",
    label: "Fill-in-the-Blank",
    blurb: "Cloze sentences for active recall.",
    longBlurb: "Sentences with key terms blanked out. Forces production rather than recognition — one of the strongest active-recall formats.",
    icon: Pencil,
  },
  {
    id: "review",
    label: "Spaced Review",
    blurb: "SM-2 spaced repetition deck.",
    longBlurb: "An adaptive review deck that schedules each card based on how well you recalled it — the gold standard for long-term retention.",
    icon: Repeat,
  },
];

const FLASHCARD_OPTIONS = [15, 25, 40] as const;
const QUIZ_OPTIONS = [10, 15, 25] as const;
const EXAM_OPTIONS = [15, 25, 50] as const;
const CLOZE_OPTIONS = [10, 20, 30] as const;

export default function NewDeckPage() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const tier: "standard" | "pro" = new URLSearchParams(search).get("tier") === "pro" ? "pro" : "standard";
  const isPro = tier === "pro";
  const toolCatalog = isPro ? PRO_TOOLS : STANDARD_TOOLS;

  const [active, setActive] = useState<ToolId | null>(null);
  const [mode, setMode] = useState<InputMode>("text");
  const [aiMode, setAiMode] = useState<AiMode>("enhance");
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [flashcardCount, setFlashcardCount] = useState<number>(25);
  const [quizCount, setQuizCount] = useState<number>(15);
  const [examQuestionCount, setExamQuestionCount] = useState<number>(15);
  const [examTimed, setExamTimed] = useState<boolean>(false);
  const [clozeCount, setClozeCount] = useState<number>(10);
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
    if (!active) return;
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
      const tool = toolCatalog.find((t) => t.id === active)!;
      formData.append("title", title.trim() || `My ${tool.label}`);
      formData.append("aiMode", aiMode);
      formData.append("tier", tier);
      formData.append("tools", JSON.stringify([active]));
      formData.append("flashcardCount", String(flashcardCount));
      formData.append("quizCount", String(quizCount));
      formData.append("examQuestionCount", String(examQuestionCount));
      formData.append("examTimed", String(examTimed));
      formData.append("clozeCount", String(clozeCount));
      if (mode === "file" && file) {
        formData.append("file", file);
      } else {
        formData.append("text", text);
      }

      const res = await fetch("/api/custom-decks", { method: "POST", body: formData, headers: await authHeaders() });
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

  // ─────────────────────────────────────────────────────────────────────────
  // Detail view — single-tool config + generate (mirrors Study Lab detail)
  // ─────────────────────────────────────────────────────────────────────────
  if (active) {
    const tool = toolCatalog.find((t) => t.id === active)!;
    const showFlashcardCount =
      active === "flashcards" || active === "match" || active === "review";
    const showQuizCount = active === "quiz" || active === "exam";
    const showExamControls = active === "exam";
    const showClozeCount = active === "cloze";
    const showCustomization =
      showFlashcardCount || showQuizCount || showExamControls || showClozeCount;

    return (
      <div className="min-h-full study-page-bg" data-testid={`tools-detail-${active}`}>
        <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8">
          <button
            onClick={() => setActive(null)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 font-medium"
            data-testid="back-to-tools"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Tools
          </button>

          <PageTitle title={tool.label} icon={tool.icon as LucideIcon} subtitle={tool.longBlurb} />

          {generating ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <div>
                <p className="font-semibold text-foreground text-lg">Generating your {tool.label.toLowerCase()}…</p>
                <p className="text-muted-foreground text-sm mt-1">This takes 20–40 seconds. Please don't close this page.</p>
              </div>
              <Loader2 className="w-6 h-6 text-primary animate-spin mt-2" />
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5 bg-card border border-border rounded-2xl p-5 md:p-7 mt-4">
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

              {/* AI Mode toggle */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">AI Mode</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAiMode("strict")}
                    className={`flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all ${
                      aiMode === "strict"
                        ? "border-primary bg-card shadow-[0_0_18px_rgba(118,228,247,0.22)]"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <BookOpen className={`w-4 h-4 ${aiMode === "strict" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm font-semibold ${aiMode === "strict" ? "text-primary" : "text-foreground"}`}>Source Only</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight">Strictly from your content — no outside information added</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAiMode("enhance")}
                    className={`flex flex-col items-start gap-1 p-3 rounded-xl border-2 text-left transition-all ${
                      aiMode === "enhance"
                        ? "border-primary bg-card shadow-[0_0_18px_rgba(118,228,247,0.22)]"
                        : "border-border bg-card hover:border-primary/40"
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <Wand2 className={`w-4 h-4 ${aiMode === "enhance" ? "text-primary" : "text-muted-foreground"}`} />
                      <span className={`text-sm font-semibold ${aiMode === "enhance" ? "text-primary" : "text-foreground"}`}>
                        Enhance
                        <span className="ml-1.5 text-[10px] font-medium bg-primary/15 text-primary px-1.5 py-0.5 rounded-full">Recommended</span>
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-tight">AI adds examples & fills gaps using related context</p>
                  </button>
                </div>
              </div>

              {/* Tool customization */}
              {showCustomization && (
                <div className="space-y-4 rounded-xl border border-border bg-card p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Customize</p>
                    <p className="text-xs text-muted-foreground">Choose how much content the AI generates.</p>
                  </div>

                  {showFlashcardCount && (
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1.5">
                        <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                        {active === "flashcards" ? "Flashcards" : "Card pool size"}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {FLASHCARD_OPTIONS.map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setFlashcardCount(n)}
                            className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                              flashcardCount === n
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {n} cards
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {showQuizCount && (
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1.5">
                        <BookMarked className="w-3.5 h-3.5 text-muted-foreground" /> Quiz pool size
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {QUIZ_OPTIONS.map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setQuizCount(n)}
                            className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                              quizCount === n
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {n} q
                          </button>
                        ))}
                      </div>
                      {active === "exam" && (
                        <p className="text-[11px] text-muted-foreground mt-1.5">Exam pulls from this quiz pool.</p>
                      )}
                    </div>
                  )}

                  {showExamControls && (
                    <>
                      <div>
                        <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1.5">
                          <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" /> Practice exam length
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {EXAM_OPTIONS.map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => setExamQuestionCount(n)}
                              className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                                examQuestionCount === n
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border bg-card text-muted-foreground hover:bg-muted"
                              }`}
                            >
                              {n} q
                            </button>
                          ))}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setExamTimed(!examTimed)}
                        className={`w-full flex items-center justify-between gap-2 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                          examTimed ? "border-primary bg-primary/10 text-primary" : "border-border bg-card text-foreground hover:bg-muted"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <Timer className="w-4 h-4" />
                          <span className="font-medium">Timed exam mode</span>
                        </span>
                        <span className="text-xs">{examTimed ? "On (90s/q)" : "Off"}</span>
                      </button>
                    </>
                  )}

                  {showClozeCount && (
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-medium text-foreground mb-1.5">
                        <Pencil className="w-3.5 h-3.5 text-muted-foreground" /> Number of cloze items
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {CLOZE_OPTIONS.map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setClozeCount(n)}
                            className={`py-2 rounded-lg border text-sm font-medium transition-colors ${
                              clozeCount === n
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border bg-card text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            {n} items
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Study material */}
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

              {/* Contextual info banner */}
              {aiMode === "strict" ? (
                <div className="border border-primary/30 bg-primary/5 rounded-xl p-3 flex gap-2">
                  <AlertCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/80">All generated content is derived exclusively from your source material — no outside information is added.</p>
                </div>
              ) : (
                <div className="border border-primary/30 bg-primary/5 rounded-xl p-3 flex gap-2">
                  <Wand2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/80">AI uses your content as the foundation and may add relevant examples, clarify incomplete notes, and fill gaps using related neuroscience knowledge.</p>
                </div>
              )}

              <div className="flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => setActive(null)}>
                  Back
                </Button>
                <Button type="submit" className="flex-1 gap-2" data-testid="generate-tool">
                  <Sparkles className="w-4 h-4" />
                  Generate
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Landing — Study Lab style 4-card grid
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full study-page-bg" data-testid="my-decks-new-page">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        <PageTitle
          title={isPro ? "Pro Tools" : "Standard Tools"}
          icon={isPro ? Sparkles : Wrench}
          subtitle={
            isPro
              ? "Three advanced tools to deepen mastery. Choose one to generate from your notes."
              : "Four core tools to study any material in PsychPro. Choose one to generate from your notes."
          }
          className="mb-8"
        />

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${isPro ? "lg:grid-cols-3" : "lg:grid-cols-4"} gap-4 mb-8`}
        >
          {toolCatalog.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              data-testid={`tool-card-${t.id}`}
              className="group text-left rounded-2xl border border-border bg-card p-5 shadow-sm hover:shadow-md hover:border-primary/40 hover:-translate-y-0.5 transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/15 transition-colors">
                <t.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-1.5">{t.label}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-snug">{t.blurb}</p>
              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                Start <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
              </span>
            </button>
          ))}
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <h2 className="text-lg md:text-xl font-semibold text-foreground mb-2">
            Looking for the other side?
          </h2>
          <p className="text-sm text-muted-foreground mb-4 max-w-xl mx-auto">
            {isPro
              ? "Standard Tools cover flashcards, quizzes, study guides, and practice exams — the everyday essentials."
              : "Pro Tools add matching games, fill-in-the-blank items, and an SM-2 spaced-review deck for long-term retention."}
          </p>
          <Button
            variant="outline"
            onClick={() => navigate(isPro ? "/my-decks/new?tier=standard" : "/my-decks/new?tier=pro")}
            data-testid="switch-tier-cta"
          >
            {isPro ? "View Standard Tools" : "View Pro Tools"}
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
