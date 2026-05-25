import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useSearch } from "wouter";
import {
  Search,
  BookOpen,
  Layers,
  Brain,
  ChevronRight,
  LibraryBig,
  Users,
  Activity,
  ClipboardList,
  MessagesSquare,
  FlaskConical,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useGetTopics } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { STUDY_PALETTE } from "@/lib/study-theme";

// B-6: "Clinical Cases" intentionally omitted — the category has no
// content and was confusing users who clicked into an empty section.
const CATEGORY_ORDER = [
  "Neuroscience",
  "Psychology",
  "Neuropsychology",
  "Assessment",
  "Psychotherapy",
  "Research Methods",
  "Special Topics",
];

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Neuroscience: Brain,
  Psychology: Users,
  Neuropsychology: Activity,
  Assessment: ClipboardList,
  Psychotherapy: MessagesSquare,
  "Research Methods": FlaskConical,
  "Special Topics": Sparkles,
};

const slugify = (name: string) => name.toLowerCase().replace(/\s+/g, "-");

interface Topic {
  id: number;
  name: string;
  description: string;
  category: string;
  flashcardCount: number;
  quizCount: number;
}

export default function TopicsPage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const search = params.get("q") ?? "";

  const setSearch = (value: string) => {
    const next = new URLSearchParams();
    if (value) next.set("q", value);
    const qs = next.toString();
    navigate(qs ? `/topics?${qs}` : "/topics");
  };

  const { data: topics, isLoading } = useGetTopics();
  const allTopics: Topic[] = topics ?? [];

  // Categories present in data, in CATEGORY_ORDER, with any extras appended.
  const orderedCategories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of allTopics) counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
    const ordered = CATEGORY_ORDER.filter(c => (counts.get(c) ?? 0) > 0);
    const extras = Array.from(counts.keys())
      .filter(c => !CATEGORY_ORDER.includes(c))
      .sort((a, b) => a.localeCompare(b));
    return [...ordered, ...extras].map(name => ({
      name,
      count: counts.get(name) ?? 0,
    }));
  }, [allTopics]);

  const topicsByCategory = useMemo(() => {
    const map = new Map<string, Topic[]>();
    for (const cat of orderedCategories) {
      map.set(
        cat.name,
        allTopics
          .filter(t => t.category === cat.name)
          .sort((a, b) => a.name.localeCompare(b.name)),
      );
    }
    return map;
  }, [allTopics, orderedCategories]);

  const showSearchResults = search.trim().length > 0;
  const searchedTopics = useMemo(() => {
    if (!showSearchResults) return [];
    const q = search.toLowerCase();
    return allTopics.filter(
      t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    );
  }, [allTopics, search, showSearchResults]);

  // Scroll-spy: track which category section is currently in view so the
  // matching chip is highlighted. Disabled while search is active.
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const sectionRefs = useRef(new Map<string, HTMLElement>());
  const railRef = useRef<HTMLDivElement | null>(null);

  const registerSection = (name: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(name, el);
    else sectionRefs.current.delete(name);
  };

  // The app shell renders the page inside `<main data-testid="main-content"
  // className="overflow-y-auto">`, so `window` itself never scrolls. Every
  // scroll read/write in this file must target that container — otherwise
  // category chips and scroll-spy silently no-op.
  const getScrollContainer = (): HTMLElement | null =>
    document.querySelector<HTMLElement>('[data-testid="main-content"]');

  useEffect(() => {
    if (showSearchResults || isLoading) return;
    const refs = sectionRefs.current;
    if (refs.size === 0) return;
    const root = getScrollContainer();
    if (!root) return;

    const observer = new IntersectionObserver(
      entries => {
        // Pick the entry closest to the top of the scroll container.
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          const name = visible[0].target.getAttribute("data-category");
          if (name) setActiveCategory(name);
        }
      },
      {
        // Scoped to the actual scroll container so the math is correct.
        // Trigger when a section header crosses ~140px from the top (just
        // under the sticky chip rail). Bottom margin keeps the last section
        // reachable.
        root,
        rootMargin: "-140px 0px -55% 0px",
        threshold: 0,
      },
    );

    for (const el of refs.values()) observer.observe(el);
    return () => observer.disconnect();
  }, [showSearchResults, isLoading, orderedCategories]);

  // Keep the active chip horizontally visible inside the rail. Use only
  // inline scroll so we don't accidentally scroll the whole page vertically.
  useEffect(() => {
    if (!activeCategory || !railRef.current) return;
    const chip = railRef.current.querySelector<HTMLElement>(
      `[data-chip="${slugify(activeCategory)}"]`,
    );
    if (chip) {
      chip.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  }, [activeCategory]);

  // Honor #category-{slug} hash links (used by topic-detail breadcrumbs).
  useEffect(() => {
    if (showSearchResults || isLoading) return;
    const hash = window.location.hash;
    if (!hash.startsWith("#category-")) return;
    const slug = hash.slice("#category-".length);
    const match = orderedCategories.find(c => slugify(c.name) === slug);
    if (!match) return;
    const id = window.requestAnimationFrame(() => {
      const container = getScrollContainer();
      const el = sectionRefs.current.get(match.name);
      if (container && el) {
        const top =
          el.getBoundingClientRect().top -
          container.getBoundingClientRect().top +
          container.scrollTop -
          120;
        container.scrollTo({ top, behavior: "smooth" });
        setActiveCategory(match.name);
      }
    });
    return () => window.cancelAnimationFrame(id);
  }, [showSearchResults, isLoading, orderedCategories]);

  const scrollToCategory = (name: string | null) => {
    const container = getScrollContainer();
    if (!container) return;
    if (!name) {
      container.scrollTo({ top: 0, behavior: "smooth" });
      setActiveCategory(null);
      return;
    }
    const el = sectionRefs.current.get(name);
    if (el) {
      const top =
        el.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop -
        120;
      container.scrollTo({ top, behavior: "smooth" });
      setActiveCategory(name);
    }
  };

  return (
    <div className="min-h-full study-page-bg" data-testid="topics-page">
      <div className="max-w-6xl mx-auto p-4 md:p-6 lg:p-8">
        {/* Page header */}
        <div className="mb-5">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center border"
              style={{
                background: "rgba(118,228,247,0.14)",
                borderColor: "rgba(118,228,247,0.35)",
              }}
            >
              <LibraryBig className="w-5 h-5" style={{ color: STUDY_PALETTE.surf }} />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Topics</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {showSearchResults
              ? `Searching all topics for "${search}"`
              : "Browse the full library by category"}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40"
            data-testid="input-search-topics"
          />
        </div>

        {/* Sticky category chip rail — hidden while searching */}
        {!showSearchResults && !isLoading && orderedCategories.length > 0 ? (
          <div
            className="sticky top-0 z-20 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 py-3 mb-6 backdrop-blur-md"
            style={{
              background: "linear-gradient(180deg, rgba(3,21,29,0.85), rgba(3,21,29,0.55))",
              borderBottom: "1px solid rgba(118,228,247,0.10)",
            }}
          >
            <div
              ref={railRef}
              className="flex items-center gap-2 overflow-x-auto pb-1 -mb-1 scroll-smooth"
              style={{ scrollbarWidth: "thin" }}
            >
              <CategoryChip
                label="All"
                count={allTopics.length}
                icon={LibraryBig}
                active={activeCategory === null}
                onClick={() => scrollToCategory(null)}
                testId="chip-category-all"
              />
              {orderedCategories.map(cat => (
                <CategoryChip
                  key={cat.name}
                  label={cat.name}
                  count={cat.count}
                  icon={CATEGORY_ICONS[cat.name] ?? Sparkles}
                  active={activeCategory === cat.name}
                  onClick={() => scrollToCategory(cat.name)}
                  testId={`chip-category-${slugify(cat.name)}`}
                />
              ))}
            </div>
          </div>
        ) : null}

        {/* Body */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
          </div>
        ) : showSearchResults ? (
          searchedTopics.length === 0 ? (
            <div className="text-center py-16">
              <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No topics found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchedTopics.map(topic => (
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onClick={() => navigate(`/topics/${topic.id}`)}
                  showCategory
                />
              ))}
            </div>
          )
        ) : (
          <div className="space-y-10">
            {orderedCategories.map(cat => {
              const Icon = CATEGORY_ICONS[cat.name] ?? Sparkles;
              const list = topicsByCategory.get(cat.name) ?? [];
              return (
                <section
                  key={cat.name}
                  ref={registerSection(cat.name)}
                  data-category={cat.name}
                  data-testid={`section-category-${slugify(cat.name)}`}
                  className="scroll-mt-32"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center border shrink-0"
                      style={{
                        background: "rgba(118,228,247,0.12)",
                        borderColor: "rgba(118,228,247,0.30)",
                      }}
                    >
                      <Icon className="w-4.5 h-4.5" style={{ color: STUDY_PALETTE.surf, width: 18, height: 18 }} />
                    </div>
                    <h2 className="text-lg md:text-xl font-semibold text-foreground">{cat.name}</h2>
                    <span className="text-xs text-muted-foreground">
                      {cat.count} {cat.count === 1 ? "topic" : "topics"}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {list.map(topic => (
                      <TopicCard
                        key={topic.id}
                        topic={topic}
                        onClick={() => navigate(`/topics/${topic.id}`)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

interface CategoryChipProps {
  label: string;
  count: number;
  icon: LucideIcon;
  active: boolean;
  onClick: () => void;
  testId: string;
}

function CategoryChip({ label, count, icon: Icon, active, onClick, testId }: CategoryChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-chip={testId.replace("chip-category-", "")}
      data-testid={testId}
      className="group inline-flex items-center gap-2 shrink-0 rounded-full px-3 py-1.5 text-sm transition-all focus:outline-none focus-visible:ring-2"
      style={{
        background: active ? "rgba(118,228,247,0.18)" : "rgba(10,45,61,0.55)",
        border: `1px solid ${active ? "rgba(118,228,247,0.55)" : "rgba(118,228,247,0.18)"}`,
        color: active ? STUDY_PALETTE.mist : STUDY_PALETTE.paperSoft,
        boxShadow: active
          ? "0 6px 18px -8px rgba(118,228,247,0.55), inset 0 1px 0 rgba(255,255,255,0.06)"
          : "none",
      }}
    >
      <Icon className="w-3.5 h-3.5" style={{ color: active ? STUDY_PALETTE.surf : STUDY_PALETTE.teal }} />
      <span className="whitespace-nowrap font-medium">{label}</span>
      <span
        className="text-[11px] px-1.5 py-0.5 rounded-full"
        style={{
          background: active ? "rgba(3,21,29,0.45)" : "rgba(3,21,29,0.5)",
          color: active ? STUDY_PALETTE.mist : STUDY_PALETTE.inkSoft,
        }}
      >
        {count}
      </span>
    </button>
  );
}

interface TopicCardProps {
  topic: Topic;
  onClick: () => void;
  showCategory?: boolean;
}

function TopicCard({ topic, onClick, showCategory }: TopicCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={`card-topic-${topic.id}`}
      className="group text-left bg-card border border-border rounded-xl p-4 cursor-pointer hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-12px_rgba(118,228,247,0.45)] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
    >
      <div className="flex items-start gap-3">
        <TopicThumbnail topic={topic} />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              {showCategory ? (
                <span className="block text-[11px] text-muted-foreground mb-0.5">
                  {topic.category}
                </span>
              ) : null}
              <h3 className="font-semibold text-foreground leading-tight truncate">
                {topic.name}
              </h3>
            </div>
            <ChevronRight className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
          <p className="text-[13px] text-muted-foreground line-clamp-2 mb-3">
            {topic.description}
          </p>
          <div className="flex gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              {topic.flashcardCount} flashcards
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {topic.quizCount} quiz Qs
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}

// =============================================================================
// TopicThumbnail
// -----------------------------------------------------------------------------
// Small decorative tile rendered on the left of each TopicCard. Art is chosen
// per-TOPIC (not per-category) so cards within the same category filter still
// look distinct. We pick from a library of 10 line-art motifs using a hash of
// the topic name as a stable seed — so the same topic always gets the same
// thumbnail across reloads, and within any category view the cards look
// varied rather than identical.
// =============================================================================
function TopicThumbnail({ topic }: { topic: Topic }) {
  const stroke = STUDY_PALETTE.surf;
  const soft = "rgba(118,228,247,0.45)";
  const common = {
    width: "100%",
    height: "100%",
    viewBox: "0 0 64 64",
    fill: "none",
    stroke,
    strokeWidth: 1.25,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  // Stable hash of topic name → integer. Same topic always yields the same
  // motif across sessions (the previous category-keyed approach made every
  // card inside one category look identical, which is the bug being fixed).
  const hashName = (s: string) => {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
      h ^= s.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };
  const motifIndex = hashName(topic.name) % 10;

  const art = (() => {
    switch (motifIndex) {
      case 0:
        // Neural-network nodes connected by lines.
        return (
          <svg {...common}>
            <circle cx="14" cy="18" r="2.5" fill={soft} />
            <circle cx="32" cy="12" r="2.5" fill={soft} />
            <circle cx="50" cy="20" r="2.5" fill={soft} />
            <circle cx="20" cy="36" r="2.5" fill={soft} />
            <circle cx="44" cy="38" r="2.5" fill={soft} />
            <circle cx="32" cy="52" r="2.5" fill={soft} />
            <path d="M14 18 L32 12 L50 20 M14 18 L20 36 L32 52 L44 38 L50 20 M20 36 L44 38 M32 12 L32 52" opacity="0.7" />
          </svg>
        );
      case 1:
        // Two head silhouettes facing each other with a connecting line.
        return (
          <svg {...common}>
            <path d="M22 44 V32 a8 8 0 0 1 16 0 V44" />
            <circle cx="30" cy="20" r="6" />
            <path d="M14 50 H50" opacity="0.5" />
            <circle cx="44" cy="14" r="2" fill={soft} stroke="none" />
            <circle cx="18" cy="14" r="2" fill={soft} stroke="none" />
          </svg>
        );
      case 2:
        // Brain outline with internal activity waveform.
        return (
          <svg {...common}>
            <path d="M22 16 a10 10 0 0 0 0 20 a8 8 0 0 0 4 8 h12 a8 8 0 0 0 4 -8 a10 10 0 0 0 0 -20 a8 8 0 0 0 -20 0 z" />
            <path d="M22 30 h4 l3 -6 l4 12 l3 -6 h6" opacity="0.8" />
          </svg>
        );
      case 3:
        // Clipboard with rows + a checkmark.
        return (
          <svg {...common}>
            <rect x="18" y="14" width="28" height="38" rx="3" />
            <rect x="26" y="10" width="12" height="8" rx="2" fill={soft} stroke="none" />
            <path d="M24 28 h16 M24 36 h16 M24 44 h10" opacity="0.7" />
            <path d="M38 42 l3 3 l5 -7" stroke={stroke} strokeWidth="1.5" />
          </svg>
        );
      case 4:
        // Two speech bubbles overlapping.
        return (
          <svg {...common}>
            <path d="M12 20 h22 a4 4 0 0 1 4 4 v10 a4 4 0 0 1 -4 4 h-6 l-6 6 v-6 h-10 a4 4 0 0 1 -4 -4 v-10 a4 4 0 0 1 4 -4 z" />
            <path d="M30 30 h18 a4 4 0 0 1 4 4 v8 a4 4 0 0 1 -4 4 h-12 l-4 4 v-4" opacity="0.6" />
          </svg>
        );
      case 5:
        // Erlenmeyer flask with measurement marks.
        return (
          <svg {...common}>
            <path d="M26 10 h12 v14 l8 22 a4 4 0 0 1 -4 6 H22 a4 4 0 0 1 -4 -6 l8 -22 z" />
            <path d="M22 38 h20" opacity="0.7" />
            <path d="M30 14 h4 M30 18 h4" opacity="0.5" />
            <circle cx="28" cy="44" r="1.5" fill={soft} stroke="none" />
            <circle cx="36" cy="42" r="1.5" fill={soft} stroke="none" />
          </svg>
        );
      case 6:
        // Sparkle / starburst.
        return (
          <svg {...common}>
            <path d="M32 12 L34 28 L50 32 L34 36 L32 52 L30 36 L14 32 L30 28 z" fill={soft} />
            <path d="M48 14 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 z" opacity="0.7" />
          </svg>
        );
      case 7:
        // DNA double helix — twin sine waves with rungs.
        return (
          <svg {...common}>
            <path d="M22 12 C 32 22, 32 22, 22 32 S 32 42, 22 52" />
            <path d="M42 12 C 32 22, 32 22, 42 32 S 32 42, 42 52" />
            <path d="M24 18 H40 M26 26 H38 M26 38 H38 M24 46 H40" opacity="0.6" />
          </svg>
        );
      case 8:
        // Open book with bookmark — references/library motif.
        return (
          <svg {...common}>
            <path d="M10 16 H30 a4 4 0 0 1 4 4 V52 a4 4 0 0 0 -4 -4 H10 z" />
            <path d="M54 16 H34 a4 4 0 0 0 -4 4 V52 a4 4 0 0 1 4 -4 H54 z" />
            <path d="M16 24 H26 M16 30 H26 M38 24 H48 M38 30 H48" opacity="0.55" />
            <path d="M40 12 V22 L43 19 L46 22 V12 z" fill={soft} stroke="none" />
          </svg>
        );
      case 9:
        // Concentric pulse rings — radiating signal / activity.
        return (
          <svg {...common}>
            <circle cx="32" cy="32" r="4" fill={soft} stroke="none" />
            <circle cx="32" cy="32" r="10" opacity="0.85" />
            <circle cx="32" cy="32" r="16" opacity="0.55" />
            <circle cx="32" cy="32" r="22" opacity="0.3" />
          </svg>
        );
      default: {
        // Unreachable (motifIndex is mod 10), kept for type-safety.
        return (
          <svg {...common}>
            <rect x="14" y="14" width="36" height="36" rx="4" />
            <path d="M14 32 H50 M32 14 V50" opacity="0.5" />
          </svg>
        );
      }
    }
  })();

  return (
    <div
      aria-hidden
      className="shrink-0 w-14 h-14 rounded-lg flex items-center justify-center border"
      style={{
        background: "rgba(10,45,61,0.55)",
        borderColor: "rgba(118,228,247,0.22)",
        boxShadow: "inset 0 0 12px rgba(118,228,247,0.08)",
      }}
      data-testid={`topic-thumb-${topic.id}`}
    >
      <div className="w-10 h-10">{art}</div>
    </div>
  );
}
