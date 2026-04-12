import { useState } from "react";
import { useLocation } from "wouter";
import { Search, BookOpen, Layers, Brain, ChevronRight } from "lucide-react";
import { useGetTopics } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function TopicsPage() {
  const [, navigate] = useLocation();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: topics, isLoading } = useGetTopics();

  const categories = ["All", ...Array.from(new Set(topics?.map(t => t.category) ?? []))];

  const filtered = (topics ?? []).filter(topic => {
    const matchesSearch = topic.name.toLowerCase().includes(search.toLowerCase()) ||
      topic.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === "All" || topic.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto" data-testid="topics-page">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Topics</h1>
        <p className="text-muted-foreground text-sm mt-1">Browse all neuroscience topics</p>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search topics..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-9"
          data-testid="input-search-topics"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            data-testid={`filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === cat
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-36 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No topics found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(topic => (
            <div
              key={topic.id}
              onClick={() => navigate(`/topics/${topic.id}`)}
              data-testid={`card-topic-${topic.id}`}
              className="bg-card border border-border rounded-xl p-5 cursor-pointer hover:border-primary/40 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <Badge variant="secondary" className="text-xs">{topic.category}</Badge>
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
          ))}
        </div>
      )}
    </div>
  );
}
