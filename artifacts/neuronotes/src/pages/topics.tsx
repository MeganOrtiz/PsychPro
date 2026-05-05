import { useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import { Search, BookOpen, Layers, Brain, ChevronRight, ChevronLeft, LibraryBig } from "lucide-react";
import { useGetTopics } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import assessmentImg from "@/assets/topics/assessment.png";
import clinicalCasesImg from "@/assets/topics/clinical-cases.png";
import neuropsychologyImg from "@/assets/topics/neuropsychology.png";
import neuroscienceImg from "@/assets/topics/neuroscience.png";
import psychologyImg from "@/assets/topics/psychology.png";
import psychotherapyImg from "@/assets/topics/psychotherapy.png";
import researchMethodsImg from "@/assets/topics/research-methods.png";
import specialTopicsImg from "@/assets/topics/special-topics.png";

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

const CATEGORY_IMAGES: Record<string, string> = {
  Assessment: assessmentImg,
  "Clinical Cases": clinicalCasesImg,
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
            {showCategoryView ? selectedCategory : "Topics"}
          </h1>
        </div>
        <p className="text-sm text-muted-foreground">
          {showCategoryView
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {categories.map(cat => {
            const isEmpty = cat.count === 0;
            const image = CATEGORY_IMAGES[cat.name];
            return (
              <button
                key={cat.name}
                type="button"
                onClick={() => !isEmpty && setSelectedCategory(cat.name)}
                disabled={isEmpty}
                data-testid={`card-category-${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                className={`group relative overflow-hidden rounded-2xl text-left border border-border bg-card aspect-[16/10] transition-all ${
                  isEmpty
                    ? "opacity-60 cursor-not-allowed"
                    : "cursor-pointer hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5"
                }`}
              >
                {image ? (
                  <img
                    src={image}
                    alt=""
                    aria-hidden
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-primary/5" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/10" />
                <div className="relative h-full w-full p-4 flex flex-col justify-end text-white">
                  <h3 className="font-semibold leading-tight text-lg drop-shadow-md">
                    {cat.name}
                  </h3>
                  <div className="mt-1 flex items-center justify-between">
                    <p className="text-xs text-white/85">
                      {isEmpty ? "Coming soon" : `${cat.count} ${cat.count === 1 ? "topic" : "topics"}`}
                    </p>
                    {!isEmpty && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-white/90 group-hover:text-white">
                        Explore
                        <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    )}
                  </div>
                </div>
              </button>
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
