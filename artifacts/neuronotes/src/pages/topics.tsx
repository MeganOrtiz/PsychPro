import { useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { Search, BookOpen, Layers, Brain, ChevronRight, ChevronLeft, LibraryBig } from "lucide-react";
import { useGetTopics } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { STUDY_PALETTE } from "@/lib/study-theme";
import assessmentImg from "@/assets/topics/assessment.png";
import neuropsychologyImg from "@/assets/topics/neuropsychology.png";
import neuroscienceImg from "@/assets/topics/neuroscience.png";
import psychologyImg from "@/assets/topics/psychology.png";
import psychotherapyImg from "@/assets/topics/psychotherapy.png";
import researchMethodsImg from "@/assets/topics/research-methods.png";
import specialTopicsImg from "@/assets/topics/special-topics.png";

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

const CATEGORY_IMAGES: Record<string, string> = {
  Assessment: assessmentImg,
  Neuropsychology: neuropsychologyImg,
  Neuroscience: neuroscienceImg,
  Psychology: psychologyImg,
  Psychotherapy: psychotherapyImg,
  "Research Methods": researchMethodsImg,
  "Special Topics": specialTopicsImg,
};

export default function TopicsPage() {
  const [, navigate] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const selectedCategory = params.get("category");
  const search = params.get("q") ?? "";

  const setSelectedCategory = (cat: string | null) => {
    const next = new URLSearchParams();
    if (cat) next.set("category", cat);
    const qs = next.toString();
    navigate(qs ? `/topics?${qs}` : "/topics");
  };

  const setSearch = (value: string) => {
    const next = new URLSearchParams();
    if (selectedCategory) next.set("category", selectedCategory);
    if (value) next.set("q", value);
    const qs = next.toString();
    navigate(qs ? `/topics?${qs}` : "/topics");
  };

  const { data: topics, isLoading } = useGetTopics();

  const allTopics = topics ?? [];

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of allTopics) {
      counts.set(t.category, (counts.get(t.category) ?? 0) + 1);
    }
    // Include reserved (empty) categories from CATEGORY_ORDER too, so user sees the full taxonomy.
    const all = Array.from(new Set([...CATEGORY_ORDER, ...counts.keys()])).sort((a, b) =>
      a.localeCompare(b),
    );
    return all
      .map(name => ({ name, count: counts.get(name) ?? 0 }))
      .filter(c => c.count > 0);
  }, [allTopics]);

  const searchedTopics = useMemo(() => {
    if (!search) return [];
    const q = search.toLowerCase();
    const scope = selectedCategory
      ? allTopics.filter(t => t.category === selectedCategory)
      : allTopics;
    return scope.filter(
      t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    );
  }, [allTopics, search, selectedCategory]);

  const categoryTopics = useMemo(() => {
    if (!selectedCategory) return [];
    return allTopics.filter(t => t.category === selectedCategory);
  }, [allTopics, selectedCategory]);

  const showSearchResults = search.trim().length > 0;
  const showCategoryView = !showSearchResults && selectedCategory !== null;
  const showCategoriesGrid = !showSearchResults && selectedCategory === null;

  return (
    <div
      className="min-h-full study-page-bg"
      data-testid="topics-page"
    >
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
      <div className="mb-6">
        {showCategoryView ? (
          <button
            onClick={() => setSelectedCategory(null)}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3"
            data-testid="button-back-to-categories"
          >
            <ChevronLeft className="w-4 h-4" />
            All categories
          </button>
        ) : null}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center border"
            style={{
              background: "rgba(88,201,243,0.14)",
              borderColor: "rgba(88,201,243,0.35)",
            }}
          >
            <LibraryBig className="w-5 h-5" style={{ color: STUDY_PALETTE.surf }} />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {showCategoryView ? selectedCategory : "Topics"}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {showSearchResults && selectedCategory
            ? `Searching in ${selectedCategory} for "${search}"`
            : showCategoryView
            ? `Browse ${categoryTopics.length} ${categoryTopics.length === 1 ? "topic" : "topics"}`
            : "Choose a topic area to start exploring"}
        </p>
      </div>

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

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      ) : showSearchResults ? (
        searchedTopics.length === 0 ? (
          <div className="text-center py-16">
            <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No topics found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchedTopics.map(topic => (
              <TopicCard key={topic.id} topic={topic} onClick={() => navigate(`/topics/${topic.id}`)} showCategory />
            ))}
          </div>
        )
      ) : showCategoriesGrid ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map(cat => (
            <CategoryCard
              key={cat.name}
              name={cat.name}
              topics={allTopics.filter(t => t.category === cat.name)}
              onOpenCategory={() => setSelectedCategory(cat.name)}
              onOpenTopic={(id) => navigate(`/topics/${id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categoryTopics.map(topic => (
            <TopicCard key={topic.id} topic={topic} onClick={() => navigate(`/topics/${topic.id}`)} />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}

interface TopicCardProps {
  topic: {
    id: number;
    name: string;
    description: string;
    category: string;
    flashcardCount: number;
    quizCount: number;
  };
  onClick: () => void;
  showCategory?: boolean;
}

function TopicCard({ topic, onClick, showCategory }: TopicCardProps) {
  return (
    <div
      onClick={onClick}
      data-testid={`card-topic-${topic.id}`}
      className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-2">
        {showCategory ? (
          <span className="text-xs text-muted-foreground">{topic.category}</span>
        ) : <span />}
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
      <h3 className="font-semibold text-foreground mb-1.5">{topic.name}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{topic.description}</p>
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
  );
}

interface CategoryCardProps {
  name: string;
  topics: Array<{ id: number; name: string }>;
  onOpenCategory: () => void;
  onOpenTopic: (id: number) => void;
}

function CategoryCard({ name, topics, onOpenCategory, onOpenTopic }: CategoryCardProps) {
  const image = CATEGORY_IMAGES[name];
  const slug = name.toLowerCase().replace(/\s+/g, "-");

  return (
    <div
      onClick={() => onOpenCategory()}
      data-testid={`card-category-${slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10 aspect-[16/10] transition-all cursor-pointer hover:-translate-y-0.5 hover:border-[color:var(--surf,#58C9F3)]/55"
      style={{
        ["--surf" as never]: STUDY_PALETTE.surf,
        background: STUDY_PALETTE.surface,
        boxShadow: "0 4px 14px -8px rgba(0,0,0,0.4)",
        // Glow on hover via box-shadow transition.
        transition: "transform .3s ease, border-color .3s ease, box-shadow .3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 14px 34px -10px ${STUDY_PALETTE.surf}66, 0 0 0 1px ${STUDY_PALETTE.surf}33`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "0 4px 14px -8px rgba(0,0,0,0.4)";
      }}
    >
      {/* Hero image — full color, lightly toned down so it sits naturally
          on the dark navy page without out-shouting it. */}
      {image ? (
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-25"
          loading="lazy"
          style={{ filter: "saturate(0.92) brightness(0.96)" }}
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />
      )}
      {/* Bottom-up overlay so the title remains readable on the image. */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/15 transition-opacity duration-300 group-hover:opacity-0" />
      {/* Hover overlay — solid dark backdrop for the topic list. */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `linear-gradient(180deg, ${STUDY_PALETTE.surfaceElev}f0 0%, ${STUDY_PALETTE.surface}f5 100%)`,
        }}
      />

      {/* Default label (visible when not hovered) */}
      <div className="relative h-full w-full p-4 flex flex-col justify-end text-white pointer-events-none transition-opacity duration-300 group-hover:opacity-0">
        <h3 className="font-semibold leading-tight text-lg drop-shadow-md">{name}</h3>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-xs text-white/85">
            {topics.length} {topics.length === 1 ? "topic" : "topics"}
          </p>
          {/* B-7: removed "Hover to preview" desktop label — on touch
              devices it was misleading and on desktop the hover state is
              self-evident. Single, device-agnostic affordance only. */}
          <span className="inline-flex items-center gap-1 text-xs font-medium text-white/90">
            <span>Tap to open</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      {/* Hover state — topic list overlaid on top of the dark backdrop */}
      {(
        <div className="absolute inset-0 p-4 flex flex-col opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h3 className="font-semibold leading-tight text-white">{name}</h3>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onOpenCategory();
              }}
              className="inline-flex items-center gap-1 text-[11px] font-medium text-white/80 hover:text-white"
              data-testid={`button-view-all-${slug}`}
            >
              View all
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <ul className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-1 text-sm">
            {topics.map((t) => (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenTopic(t.id);
                  }}
                  data-testid={`button-topic-${t.id}`}
                  className="w-full text-left px-2 py-1.5 rounded-md text-white/90 hover:bg-white/[0.08] hover:text-white flex items-center gap-2 transition-colors"
                >
                  <ChevronRight className="w-3 h-3 shrink-0 text-white/50" />
                  <span className="truncate">{t.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
