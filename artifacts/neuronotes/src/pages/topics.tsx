import { useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import {
  Search,
  BookOpen,
  Layers,
  Brain,
  ChevronRight,
  LibraryBig,
} from "lucide-react";
import { useGetTopics } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { STUDY_PALETTE } from "@/lib/study-theme";

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

  // Single flat A→Z list. The previous chip-rail category navigation and
  // per-category sections were removed at the user's request — topics are
  // now a single alphabetical library, with the user's category still
  // shown as a small label on each card for context.
  const sortedTopics = useMemo(
    () => [...allTopics].sort((a, b) => a.name.localeCompare(b.name)),
    [allTopics],
  );

  const showSearchResults = search.trim().length > 0;
  const visibleTopics = useMemo(() => {
    if (!showSearchResults) return sortedTopics;
    const q = search.toLowerCase();
    return sortedTopics.filter(
      t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    );
  }, [sortedTopics, search, showSearchResults]);

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
              : `Browse the full library — ${allTopics.length} topics, A to Z`}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40"
            data-testid="input-search-topics"
          />
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(9)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
          </div>
        ) : visibleTopics.length === 0 ? (
          <div className="text-center py-16">
            <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No topics found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleTopics.map(topic => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onClick={() => navigate(`/topics/${topic.id}`)}
                showCategory
              />
            ))}
          </div>
        )}
      </div>
    </div>
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
// thumbnail across reloads.
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
        return (
          <svg {...common}>
            <path d="M22 16 a10 10 0 0 0 0 20 a8 8 0 0 0 4 8 h12 a8 8 0 0 0 4 -8 a10 10 0 0 0 0 -20 a8 8 0 0 0 -20 0 z" />
            <path d="M22 30 h4 l3 -6 l4 12 l3 -6 h6" opacity="0.8" />
          </svg>
        );
      case 3:
        return (
          <svg {...common}>
            <rect x="18" y="14" width="28" height="38" rx="3" />
            <rect x="26" y="10" width="12" height="8" rx="2" fill={soft} stroke="none" />
            <path d="M24 28 h16 M24 36 h16 M24 44 h10" opacity="0.7" />
            <path d="M38 42 l3 3 l5 -7" stroke={stroke} strokeWidth="1.5" />
          </svg>
        );
      case 4:
        return (
          <svg {...common}>
            <path d="M12 20 h22 a4 4 0 0 1 4 4 v10 a4 4 0 0 1 -4 4 h-6 l-6 6 v-6 h-10 a4 4 0 0 1 -4 -4 v-10 a4 4 0 0 1 4 -4 z" />
            <path d="M30 30 h18 a4 4 0 0 1 4 4 v8 a4 4 0 0 1 -4 4 h-12 l-4 4 v-4" opacity="0.6" />
          </svg>
        );
      case 5:
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
        return (
          <svg {...common}>
            <path d="M32 12 L34 28 L50 32 L34 36 L32 52 L30 36 L14 32 L30 28 z" fill={soft} />
            <path d="M48 14 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 z" opacity="0.7" />
          </svg>
        );
      case 7:
        return (
          <svg {...common}>
            <path d="M22 12 C 32 22, 32 22, 22 32 S 32 42, 22 52" />
            <path d="M42 12 C 32 22, 32 22, 42 32 S 32 42, 42 52" />
            <path d="M24 18 H40 M26 26 H38 M26 38 H38 M24 46 H40" opacity="0.6" />
          </svg>
        );
      case 8:
        return (
          <svg {...common}>
            <path d="M10 16 H30 a4 4 0 0 1 4 4 V52 a4 4 0 0 0 -4 -4 H10 z" />
            <path d="M54 16 H34 a4 4 0 0 0 -4 4 V52 a4 4 0 0 1 4 -4 H54 z" />
            <path d="M16 24 H26 M16 30 H26 M38 24 H48 M38 30 H48" opacity="0.55" />
            <path d="M40 12 V22 L43 19 L46 22 V12 z" fill={soft} stroke="none" />
          </svg>
        );
      case 9:
        return (
          <svg {...common}>
            <circle cx="32" cy="32" r="4" fill={soft} stroke="none" />
            <circle cx="32" cy="32" r="10" opacity="0.85" />
            <circle cx="32" cy="32" r="16" opacity="0.55" />
            <circle cx="32" cy="32" r="22" opacity="0.3" />
          </svg>
        );
      default: {
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
