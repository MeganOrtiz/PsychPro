import { useMemo } from "react";
import { useLocation, useSearch } from "wouter";
import {
  Search,
  BookOpen,
  Layers,
  Brain,
  ChevronRight,
  ChevronLeft,
  Heart,
  ClipboardCheck,
  Armchair,
  BarChart3,
  Sparkles,
  Stethoscope,
  FolderOpen,
  Compass,
  ArrowUpRight,
  type LucideIcon,
} from "lucide-react";
import { useGetTopics } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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

interface CategoryMeta {
  icon: LucideIcon;
  description: string;
  iconColor: string;
  iconBg: string;
}

const CATEGORY_META: Record<string, CategoryMeta> = {
  Neuroscience: {
    icon: Brain,
    description: "Explore the biological foundations of the brain and nervous system.",
    iconColor: "text-sky-600 dark:text-sky-400",
    iconBg: "bg-sky-100 dark:bg-sky-500/10",
  },
  Psychology: {
    icon: Heart,
    description: "Learn core concepts in behavior, cognition, and mental processes.",
    iconColor: "text-rose-600 dark:text-rose-400",
    iconBg: "bg-rose-100 dark:bg-rose-500/10",
  },
  Neuropsychology: {
    icon: Brain,
    description: "Study the relationship between brain function and behavior.",
    iconColor: "text-violet-600 dark:text-violet-400",
    iconBg: "bg-violet-100 dark:bg-violet-500/10",
  },
  Assessment: {
    icon: ClipboardCheck,
    description: "Discover tools and methods for evaluation and measurement.",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    iconBg: "bg-emerald-100 dark:bg-emerald-500/10",
  },
  Psychotherapy: {
    icon: Armchair,
    description: "Explore evidence-based approaches to support mental well-being.",
    iconColor: "text-amber-600 dark:text-amber-400",
    iconBg: "bg-amber-100 dark:bg-amber-500/10",
  },
  "Research Methods": {
    icon: BarChart3,
    description: "Build your skills in research design, analysis, and interpretation.",
    iconColor: "text-indigo-600 dark:text-indigo-400",
    iconBg: "bg-indigo-100 dark:bg-indigo-500/10",
  },
  "Special Topics": {
    icon: Sparkles,
    description: "Dive into specialty areas and advanced clinical content.",
    iconColor: "text-fuchsia-600 dark:text-fuchsia-400",
    iconBg: "bg-fuchsia-100 dark:bg-fuchsia-500/10",
  },
  "Clinical Cases": {
    icon: Stethoscope,
    description: "Apply your knowledge through realistic case scenarios.",
    iconColor: "text-teal-600 dark:text-teal-400",
    iconBg: "bg-teal-100 dark:bg-teal-500/10",
  },
};

const FALLBACK_META: CategoryMeta = {
  icon: FolderOpen,
  description: "Browse topics in this category.",
  iconColor: "text-primary",
  iconBg: "bg-primary/10",
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
      <div className="max-w-5xl mx-auto p-4 md:p-6 lg:p-8">
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
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {showCategoryView ? selectedCategory : "Categories"}
            </h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {showCategoryView
              ? `Browse ${categoryTopics.length} ${categoryTopics.length === 1 ? "topic" : "topics"}`
              : "Choose a category to browse topics and continue learning."}
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search topics..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-11 h-12 rounded-full bg-card"
            data-testid="input-search-topics"
          />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-2xl" />)}
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
                <TopicCard
                  key={topic.id}
                  topic={topic}
                  onClick={() => navigate(`/topics/${topic.id}`)}
                  showCategory
                />
              ))}
            </div>
          )
        ) : showCategoriesGrid ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map(cat => {
                const meta = CATEGORY_META[cat.name] ?? FALLBACK_META;
                const Icon = meta.icon;
                const isEmpty = cat.count === 0;
                return (
                  <div
                    key={cat.name}
                    onClick={() => !isEmpty && setSelectedCategory(cat.name)}
                    data-testid={`card-category-${cat.name.toLowerCase().replace(/\s+/g, "-")}`}
                    className={`group bg-card border border-border rounded-2xl p-5 flex items-center gap-4 transition-all ${
                      isEmpty
                        ? "opacity-60 cursor-not-allowed"
                        : "cursor-pointer hover:border-primary/40 hover:shadow-md"
                    }`}
                  >
                    <div
                      className={`w-14 h-14 shrink-0 rounded-full ${meta.iconBg} flex items-center justify-center`}
                    >
                      <Icon className={`w-7 h-7 ${meta.iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-lg leading-tight mb-0.5">
                        {cat.name}
                      </h3>
                      <p className="text-sm text-primary font-medium mb-1">
                        {isEmpty
                          ? "Coming soon"
                          : `${cat.count} ${cat.count === 1 ? "topic" : "topics"}`}
                      </p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {meta.description}
                      </p>
                    </div>
                    {!isEmpty && (
                      <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0 group-hover:text-foreground transition-colors" />
                    )}
                  </div>
                );
              })}
            </div>

            <div
              className="mt-6 bg-card border border-border rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              data-testid="card-suggest-topic"
            >
              <div className="w-12 h-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                <Compass className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground leading-tight">
                  Can&apos;t find what you&apos;re looking for?
                </h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Suggest a topic or request a new category and help shape PsychPro.
                </p>
              </div>
              <Button
                onClick={() => navigate("/feature-request")}
                className="shrink-0 gap-2"
                data-testid="button-suggest-topic"
              >
                Suggest a Topic
                <ArrowUpRight className="w-4 h-4" />
              </Button>
            </div>
          </>
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
