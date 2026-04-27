import { useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { Search, BookOpen, Layers, Brain, ChevronRight, ChevronLeft, FolderOpen, LibraryBig } from "lucide-react";
import { useGetTopics } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const CATEGORY_ORDER = [
  "Neuroscience",
  "Psychology",
  "Neuropsychology",
  "Assessment",
  "Psychotherapy",
  "Research Methods",
  "Special Topics",
  "Clinical Cases",
];

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
    if (value) next.set("q", value);
    else if (selectedCategory) next.set("category", selectedCategory);
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
    return all.map(name => ({ name, count: counts.get(name) ?? 0 }));
  }, [allTopics]);

  const searchedTopics = useMemo(() => {
    if (!search) return [];
    const q = search.toLowerCase();
    return allTopics.filter(
      t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    );
  }, [allTopics, search]);

  const categoryTopics = useMemo(() => {
    if (!selectedCategory) return [];
    return allTopics.filter(t => t.category === selectedCategory);
  }, [allTopics, selectedCategory]);

  const showSearchResults = search.trim().length > 0;
  const showCategoryView = !showSearchResults && selectedCategory !== null;
  const showCategoriesGrid = !showSearchResults && selectedCategory === null;

  return (
    <div className="min-h-full bg-background" data-testid="topics-page">
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
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <LibraryBig className="w-5 h-5 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {showCategoryView ? selectedCategory : "Categories"}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {showCategoryView
            ? `Browse ${categoryTopics.length} ${categoryTopics.length === 1 ? "topic" : "topics"}`
            : "Choose a category to browse topics"}
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search topics..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
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
        <div className="flex flex-col gap-3">
          {categories.map(cat => {
            const isEmpty = cat.count === 0;
            return (
              <div
                key={cat.name}
                onClick={() => !isEmpty && setSelectedCategory(cat.name)}
                data-testid={`card-category-${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                className={`bg-card border border-border rounded-xl px-4 py-3 flex items-center gap-4 transition-all ${
                  isEmpty
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer hover:border-primary/40 hover:shadow-sm"
                }`}
              >
                <div className="w-10 h-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FolderOpen className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground leading-tight truncate">{cat.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isEmpty ? "Coming soon" : `${cat.count} ${cat.count === 1 ? "topic" : "topics"}`}
                  </p>
                </div>
                {!isEmpty && <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />}
              </div>
            );
          })}
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
