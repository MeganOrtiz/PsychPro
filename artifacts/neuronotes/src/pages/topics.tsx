import { useEffect, useMemo, useState, type ComponentType, type ReactNode } from "react";
import { useLocation, useSearch } from "wouter";
import {
  Search,
  BookOpen,
  Layers,
  Brain,
  ChevronRight,
  LibraryBig,
  ClipboardList,
  Activity,
  Atom,
  MessagesSquare,
  BarChart3,
  Sparkles,
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

  // Flat A→Z list — used directly when the user is searching.
  const sortedTopics = useMemo(
    () => [...allTopics].sort((a, b) => a.name.localeCompare(b.name)),
    [allTopics],
  );

  // Category hub — group topics by category, sort categories alphabetically,
  // and sort topics within each category alphabetically. Shown when the user
  // is NOT searching.
  const categoryGroups = useMemo(() => {
    const byCategory = new Map<string, Topic[]>();
    for (const t of sortedTopics) {
      const key = t.category || "Other";
      const list = byCategory.get(key) ?? [];
      list.push(t);
      byCategory.set(key, list);
    }
    return Array.from(byCategory.entries())
      .map(([name, items]) => ({ name, items }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [sortedTopics]);

  const showSearchResults = search.trim().length > 0;
  const visibleTopics = useMemo(() => {
    if (!showSearchResults) return sortedTopics;
    const q = search.toLowerCase();
    return sortedTopics.filter(
      t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q),
    );
  }, [sortedTopics, search, showSearchResults]);

  // Which course is open in the right-hand pane. Default to the first
  // category once data loads. Persisted in URL via ?c= so deep links work.
  const courseParam = params.get("c");
  const [activeCourse, setActiveCourse] = useState<string | null>(courseParam);
  useEffect(() => {
    if (activeCourse) return;
    if (categoryGroups.length > 0) setActiveCourse(categoryGroups[0].name);
  }, [categoryGroups, activeCourse]);

  const selectCourse = (name: string) => {
    setActiveCourse(name);
    const next = new URLSearchParams();
    next.set("c", name);
    navigate(`/topics?${next.toString()}`);
  };

  const activeGroup = useMemo(
    () => categoryGroups.find(g => g.name === activeCourse) ?? categoryGroups[0],
    [categoryGroups, activeCourse],
  );

  return (
    <div className="min-h-full study-page-bg" data-testid="topics-page">
      <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8">
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
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Courses</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            {showSearchResults
              ? `Searching all lessons for "${search}"`
              : `${categoryGroups.length} courses · ${allTopics.length} lessons`}
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search lessons..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-9 bg-card border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary/40"
            data-testid="input-search-topics"
          />
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-4">
            <Skeleton className="h-96 rounded-xl hidden lg:block" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-36 rounded-xl" />
              ))}
            </div>
          </div>
        ) : showSearchResults ? (
          visibleTopics.length === 0 ? (
            <div className="text-center py-16">
              <Brain className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No lessons found</p>
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
          )
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
            {/* Left rail — courses */}
            <CourseRail
              courses={categoryGroups}
              activeName={activeGroup?.name ?? null}
              onSelect={selectCourse}
            />

            {/* Right pane — lessons in the active course */}
            <div className="min-w-0">
              {activeGroup ? (
                <CourseLessons
                  group={activeGroup}
                  onLessonClick={id => navigate(`/topics/${id}`)}
                />
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// CourseRail — vertical list of courses (left column on desktop, horizontal
// scrollable chip strip on mobile).
// =============================================================================
function CourseRail({
  courses,
  activeName,
  onSelect,
}: {
  courses: { name: string; items: Topic[] }[];
  activeName: string | null;
  onSelect: (name: string) => void;
}) {
  return (
    <>
      {/* Desktop: vertical sticky rail */}
      <aside
        className="hidden lg:flex flex-col gap-1.5 p-2 rounded-xl bg-card/60 border border-border h-fit lg:sticky lg:top-4"
        aria-label="Courses"
        data-testid="course-rail"
      >
        {courses.map(c => (
          <CourseRailButton
            key={c.name}
            name={c.name}
            count={c.items.length}
            active={c.name === activeName}
            onClick={() => onSelect(c.name)}
          />
        ))}
      </aside>

      {/* Mobile/tablet: horizontal scrolling strip */}
      <div
        className="lg:hidden flex gap-2 overflow-x-auto pb-2 -mx-1 px-1"
        style={{ scrollbarWidth: "thin" }}
        data-testid="course-rail-mobile"
      >
        {courses.map(c => {
          const Icon = CATEGORY_ICONS[c.name] ?? LibraryBig;
          const isActive = c.name === activeName;
          return (
            <button
              key={c.name}
              type="button"
              onClick={() => onSelect(c.name)}
              className={`shrink-0 px-3 py-2 rounded-lg border flex items-center gap-2 text-sm transition-colors ${
                isActive
                  ? "bg-primary/15 border-primary/50 text-foreground"
                  : "bg-card border-border text-muted-foreground hover:text-foreground hover:border-primary/30"
              }`}
              data-testid={`course-pill-${c.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
            >
              <Icon className="w-4 h-4" style={{ color: STUDY_PALETTE.surf }} />
              <span className="font-medium whitespace-nowrap">{c.name}</span>
              <span className="text-[11px] opacity-70">{c.items.length}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function CourseRailButton({
  name,
  count,
  active,
  onClick,
}: {
  name: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  const Icon = CATEGORY_ICONS[name] ?? LibraryBig;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      data-testid={`course-rail-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
      className={`group w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border ${
        active
          ? "bg-primary/15 border-primary/50 text-foreground shadow-[0_6px_18px_-12px_rgba(118,228,247,0.6)]"
          : "bg-transparent border-transparent text-muted-foreground hover:text-foreground hover:bg-primary/5 hover:border-border"
      }`}
    >
      <div
        className="w-9 h-9 rounded-md flex items-center justify-center border shrink-0"
        style={{
          background: active
            ? "rgba(118,228,247,0.18)"
            : "rgba(118,228,247,0.08)",
          borderColor: active
            ? "rgba(118,228,247,0.45)"
            : "rgba(118,228,247,0.2)",
        }}
      >
        <Icon
          className="w-4 h-4"
          style={{
            color: STUDY_PALETTE.surf,
            filter: active
              ? "drop-shadow(0 0 4px rgba(118,228,247,0.8))"
              : undefined,
          }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm leading-tight truncate">{name}</div>
        <div className="text-[11px] opacity-70 mt-0.5">
          {count} {count === 1 ? "lesson" : "lessons"}
        </div>
      </div>
      <ChevronRight
        className={`w-4 h-4 shrink-0 transition-opacity ${
          active ? "opacity-90" : "opacity-0 group-hover:opacity-60"
        }`}
      />
    </button>
  );
}

// =============================================================================
// CourseLessons — right pane: course header + grid of lesson cards.
// =============================================================================
function CourseLessons({
  group,
  onLessonClick,
}: {
  group: { name: string; items: Topic[] };
  onLessonClick: (id: number) => void;
}) {
  const Icon = CATEGORY_ICONS[group.name] ?? LibraryBig;
  return (
    <div data-testid={`course-pane-${group.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>
      {/* Course header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-border">
        <div
          className="w-11 h-11 rounded-lg flex items-center justify-center border"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(58,224,236,0.18), rgba(10,45,61,0.65) 70%)",
            borderColor: "rgba(118,228,247,0.32)",
          }}
        >
          <Icon
            className="w-5 h-5"
            style={{
              color: STUDY_PALETTE.surf,
              filter: "drop-shadow(0 0 4px rgba(118,228,247,0.7))",
            }}
          />
        </div>
        <div className="min-w-0">
          <h2 className="text-lg md:text-xl font-bold text-foreground leading-tight truncate">
            {group.name}
          </h2>
          <p className="text-xs text-muted-foreground">
            {group.items.length} {group.items.length === 1 ? "lesson" : "lessons"}
          </p>
        </div>
      </div>

      {/* Lessons grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {group.items.map(t => (
          <TopicCard key={t.id} topic={t} onClick={() => onLessonClick(t.id)} />
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// CategoryCard
// -----------------------------------------------------------------------------
// Resting state: cerulean line-art icon + category name + "N topics" count.
// On hover or keyboard focus, an absolutely-positioned glass panel slides in
// below the card showing the category's topics as a bulleted list. Each
// bullet is a clickable button that routes to the topic detail page.
// =============================================================================

const CATEGORY_ICONS: Record<string, ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Assessment: ClipboardList,
  Neuropsychology: Activity,
  Neuroscience: Atom,
  Psychology: Brain,
  Psychotherapy: MessagesSquare,
  "Research Methods": BarChart3,
  "Special Topics": Sparkles,
};

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
// One UNIQUE hand-drawn symbol per topic, looked up by exact topic name from
// TOPIC_SYMBOLS. Each symbol is a 64×64 line-art SVG sharing the cerulean
// palette, then given a layered cerulean glow via CSS drop-shadow so the
// symbol feels luminous instead of flat. If a topic name isn't in the map
// (new content added server-side, say) we fall back to a small starburst
// so the UI never breaks.
// =============================================================================
const stroke = STUDY_PALETTE.surf;
const soft = "rgba(118,228,247,0.45)";
const bright = "rgba(167,243,255,0.85)";

// Shared SVG attributes — keeps every symbol visually consistent.
const svgCommon = {
  viewBox: "0 0 64 64",
  fill: "none" as const,
  stroke,
  strokeWidth: 1.45,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

// Each symbol is just the <svg>'s children; the wrapper SVG element is
// applied once in TopicThumbnail. Keeping the symbols as fragments means
// the lookup table stays compact and uniform.
const TOPIC_SYMBOLS: Record<string, ReactNode> = {
  "ADHD & Medications": (
    <>
      {/* Capsule pill with energetic spark trails */}
      <rect x="14" y="28" width="28" height="12" rx="6" />
      <path d="M28 28 V40" />
      <rect x="14" y="28" width="14" height="12" rx="6" fill={soft} stroke="none" />
      <path d="M46 18 l4 4 M48 28 l5 -2 M46 38 l4 4" opacity="0.85" />
      <circle cx="52" cy="22" r="1.5" fill={bright} stroke="none" />
      <circle cx="54" cy="38" r="1.2" fill={bright} stroke="none" />
    </>
  ),
  "Acceptance, Mindfulness, and Third-Wave Approaches": (
    <>
      {/* Lotus flower with center glow */}
      <path d="M32 46 C 22 38, 22 26, 32 18 C 42 26, 42 38, 32 46 z" />
      <path d="M32 46 C 18 42, 14 30, 18 22 C 26 26, 32 36, 32 46 z" opacity="0.85" />
      <path d="M32 46 C 46 42, 50 30, 46 22 C 38 26, 32 36, 32 46 z" opacity="0.85" />
      <ellipse cx="32" cy="44" rx="14" ry="2" opacity="0.4" />
      <circle cx="32" cy="32" r="3" fill={bright} stroke="none" />
    </>
  ),
  "Adlerian, Humanistic, and Existential Approaches": (
    <>
      {/* Figure reaching upward toward radiating sun */}
      <circle cx="32" cy="20" r="6" fill={soft} stroke="none" />
      <path d="M32 14 V8 M40 16 l4 -4 M24 16 l-4 -4 M44 20 h5 M15 20 h5" opacity="0.7" />
      <circle cx="32" cy="38" r="3" />
      <path d="M32 41 V52 M28 45 l-6 4 M36 45 l6 4 M32 32 V35" />
      <path d="M26 30 l-4 -6 M38 30 l4 -6" />
    </>
  ),
  "Analytical Psychology — Jung": (
    <>
      {/* Yin-yang with spiral mandala overlay */}
      <circle cx="32" cy="32" r="20" />
      <path d="M32 12 a10 10 0 0 1 0 20 a10 10 0 0 0 0 20 a20 20 0 0 1 0 -40 z" fill={soft} stroke="none" />
      <circle cx="32" cy="22" r="2.5" fill={bright} stroke="none" />
      <circle cx="32" cy="42" r="2.5" fill={stroke} />
      <path d="M32 32 m-6 0 a6 6 0 1 1 12 0 a4 4 0 1 1 -8 0 a2 2 0 1 1 4 0" opacity="0.5" />
    </>
  ),
  "Apraxia & Agnosia": (
    <>
      {/* Hand reaching with question mark — purposeful action lost */}
      <path d="M22 36 V24 a2 2 0 0 1 4 0 V32 M26 24 V20 a2 2 0 0 1 4 0 V32 M30 22 V20 a2 2 0 0 1 4 0 V32 M34 24 a2 2 0 0 1 4 0 V36 a10 10 0 0 1 -10 10 H24 a8 8 0 0 1 -8 -8 V32 a2 2 0 0 1 4 0 V36" />
      <path d="M44 22 a4 4 0 1 1 4 4 v4 M48 34 v1" opacity="0.85" />
      <circle cx="48" cy="38" r="1.2" fill={bright} stroke="none" />
    </>
  ),
  "Behavior Therapy and Applied Behavior Analysis": (
    <>
      {/* Lever / reward dispenser with reinforcement arrow */}
      <rect x="14" y="20" width="20" height="28" rx="2" />
      <circle cx="24" cy="28" r="3" fill={soft} stroke="none" />
      <path d="M18 38 h12 M18 42 h8" opacity="0.7" />
      <path d="M34 28 H46 a4 4 0 0 1 4 4 v8 a4 4 0 0 1 -4 4 H40" />
      <path d="M40 44 l-3 -3 M40 44 l-3 3" />
      <circle cx="46" cy="22" r="2" fill={bright} stroke="none" />
    </>
  ),
  "Brain Networks": (
    <>
      {/* Densely connected node graph — small-world brain network */}
      <circle cx="14" cy="18" r="2.5" fill={soft} stroke="none" />
      <circle cx="32" cy="10" r="2.5" fill={bright} stroke="none" />
      <circle cx="50" cy="18" r="2.5" fill={soft} stroke="none" />
      <circle cx="18" cy="36" r="2.5" fill={soft} stroke="none" />
      <circle cx="46" cy="36" r="2.5" fill={soft} stroke="none" />
      <circle cx="24" cy="52" r="2.5" fill={bright} stroke="none" />
      <circle cx="40" cy="52" r="2.5" fill={soft} stroke="none" />
      <circle cx="32" cy="30" r="3" fill={bright} stroke="none" />
      <path d="M14 18 L32 10 L50 18 M14 18 L18 36 L32 30 L46 36 L50 18 M18 36 L24 52 L40 52 L46 36 M32 10 L32 30 L24 52 M32 30 L40 52 M14 18 L32 30 L50 18" opacity="0.6" />
    </>
  ),
  "Central Nervous System": (
    <>
      {/* Brain on top, spinal cord with segments below */}
      <path d="M20 16 a8 8 0 0 1 24 0 a6 6 0 0 1 -2 12 H22 a6 6 0 0 1 -2 -12 z" />
      <path d="M32 16 V28" opacity="0.6" />
      <path d="M28 28 H36 V34 a4 4 0 0 1 -8 0 z" />
      <path d="M30 36 h4 v4 h-4 z M30 42 h4 v4 h-4 z M30 48 h4 v4 h-4 z" fill={soft} stroke="none" />
      <path d="M30 36 h4 M30 42 h4 M30 48 h4" />
    </>
  ),
  "Cognitive Therapy, CBT, and Schema Therapy": (
    <>
      {/* Thought cloud with interlocking cognition gears */}
      <path d="M14 32 a6 6 0 0 1 6 -6 a8 8 0 0 1 16 0 a6 6 0 0 1 4 12 H20 a6 6 0 0 1 -6 -6 z" />
      <path d="M18 44 a2 2 0 1 0 0 1 z M22 48 a1.5 1.5 0 1 0 0 1 z" opacity="0.5" />
      <circle cx="26" cy="32" r="3.5" fill={soft} stroke="none" />
      <circle cx="36" cy="32" r="2.5" fill={bright} stroke="none" />
      <path d="M26 27 V30 M26 34 V37 M21 32 H24 M28 32 H31" />
    </>
  ),
  "Cranial Nerves": (
    <>
      {/* Face profile with nerve branches radiating to sense organs */}
      <path d="M40 12 a14 14 0 0 0 -14 14 v8 l-4 6 l4 2 v6 a4 4 0 0 0 4 4 h6" />
      <circle cx="36" cy="26" r="1.5" fill={bright} stroke="none" />
      <path d="M42 22 l8 -6 M44 30 l10 -2 M44 38 l10 4 M40 44 l6 8" opacity="0.75" />
      <circle cx="50" cy="16" r="1.5" fill={soft} stroke="none" />
      <circle cx="54" cy="28" r="1.5" fill={soft} stroke="none" />
      <circle cx="54" cy="42" r="1.5" fill={soft} stroke="none" />
      <circle cx="46" cy="52" r="1.5" fill={soft} stroke="none" />
    </>
  ),
  "Endocrine System & Reproduction": (
    <>
      {/* Stylized gland with hormone molecules drifting outward */}
      <ellipse cx="24" cy="32" rx="10" ry="14" />
      <circle cx="24" cy="28" r="3" fill={soft} stroke="none" />
      <circle cx="22" cy="36" r="2" fill={bright} stroke="none" />
      <circle cx="42" cy="18" r="2" fill={soft} stroke="none" />
      <circle cx="46" cy="22" r="2" fill={bright} stroke="none" />
      <circle cx="44" cy="32" r="2.5" fill={soft} stroke="none" />
      <circle cx="50" cy="36" r="1.5" fill={bright} stroke="none" />
      <circle cx="44" cy="46" r="2" fill={soft} stroke="none" />
      <path d="M42 18 L46 22 M44 32 L50 36" opacity="0.6" />
    </>
  ),
  "Enteric Nervous System": (
    <>
      {/* Coiled intestinal loop with neuronal sparks */}
      <path d="M16 18 q8 -4 16 0 q8 4 16 0 q4 6 0 12 q-8 4 -16 0 q-8 -4 -16 0 q-4 6 0 12 q8 4 16 0 q8 -4 16 0" />
      <circle cx="20" cy="20" r="1.5" fill={bright} stroke="none" />
      <circle cx="44" cy="32" r="1.5" fill={bright} stroke="none" />
      <circle cx="28" cy="46" r="1.5" fill={bright} stroke="none" />
      <circle cx="50" cy="50" r="1.5" fill={soft} stroke="none" />
    </>
  ),
  "Executive Function": (
    <>
      {/* Planner / checklist with directional control arrow */}
      <rect x="14" y="14" width="26" height="36" rx="3" />
      <rect x="22" y="10" width="10" height="6" rx="2" fill={soft} stroke="none" />
      <path d="M18 22 h4 M26 22 h12 M18 30 h4 M26 30 h12 M18 38 h4 M26 38 h10" opacity="0.7" />
      <path d="M19 21 l1.5 1.5 l2.5 -3 M19 29 l1.5 1.5 l2.5 -3" stroke={bright} />
      <path d="M44 30 H54 M50 26 l4 4 l-4 4" />
    </>
  ),
  "Family, Systems, and Couples Therapies": (
    <>
      {/* Three interconnected figures forming a small system */}
      <circle cx="20" cy="22" r="4" />
      <path d="M14 38 a6 6 0 0 1 12 0" />
      <circle cx="44" cy="22" r="4" />
      <path d="M38 38 a6 6 0 0 1 12 0" />
      <circle cx="32" cy="40" r="3.5" fill={soft} stroke="none" />
      <path d="M26 52 a6 6 0 0 1 12 0" />
      <path d="M22 26 L30 38 M42 26 L34 38 M26 40 H38" opacity="0.55" />
    </>
  ),
  "Forensic Neuropsychology": (
    <>
      {/* Brain under scales of justice */}
      <path d="M22 38 a8 8 0 0 1 20 0 a6 6 0 0 1 -3 6 H25 a6 6 0 0 1 -3 -6 z" fill={soft} stroke="none" />
      <path d="M22 38 a8 8 0 0 1 20 0 a6 6 0 0 1 -3 6 H25 a6 6 0 0 1 -3 -6 z" />
      <path d="M32 38 V14 M22 14 H42" />
      <path d="M16 22 L22 14 L28 22 M16 22 a4 4 0 0 0 12 0 z" />
      <path d="M36 22 L42 14 L48 22 M36 22 a4 4 0 0 0 12 0 z" />
    </>
  ),
  "Foundations in Statistics": (
    <>
      {/* Bell curve with standard-deviation markers */}
      <path d="M12 48 C 20 48, 22 16, 32 16 C 42 16, 44 48, 52 48" />
      <path d="M12 50 H52" opacity="0.6" />
      <path d="M22 50 V46 M32 50 V44 M42 50 V46" />
      <path d="M22 50 q5 -10 10 -10 q5 0 10 10 z" fill={soft} stroke="none" opacity="0.7" />
      <circle cx="32" cy="22" r="1.5" fill={bright} stroke="none" />
    </>
  ),
  "Foundations of Psychotherapy": (
    <>
      {/* Two facing chairs — the therapy dyad */}
      <path d="M14 38 V26 a3 3 0 0 1 3 -3 h4 a3 3 0 0 1 3 3 V38" />
      <path d="M12 38 H26 V46 H12 z" fill={soft} stroke="none" />
      <path d="M12 38 H26 V46 H12 z" />
      <path d="M14 46 V52 M24 46 V52" />
      <path d="M38 38 V26 a3 3 0 0 1 3 -3 h4 a3 3 0 0 1 3 3 V38" />
      <path d="M36 38 H50 V46 H36 z" />
      <path d="M38 46 V52 M48 46 V52" />
      <circle cx="32" cy="32" r="1.5" fill={bright} stroke="none" />
    </>
  ),
  "Gestalt, Experiential, and Emotion-Focused Therapy": (
    <>
      {/* Two face profiles forming a vase — classic Gestalt illusion */}
      <path d="M18 12 V52 q8 -4 8 -12 q-4 -4 0 -8 q4 -4 0 -8 q-8 -8 -8 -20 z" fill={soft} stroke="none" />
      <path d="M18 12 V52 q8 -4 8 -12 q-4 -4 0 -8 q4 -4 0 -8 q-8 -8 -8 -20 z" />
      <path d="M46 12 V52 q-8 -4 -8 -12 q4 -4 0 -8 q-4 -4 0 -8 q8 -8 8 -20 z" />
      <circle cx="32" cy="32" r="2" fill={bright} stroke="none" />
    </>
  ),
  "Language Processing & Aphasia": (
    <>
      {/* Speech bubble with floating, scrambling letters */}
      <path d="M12 14 H46 a4 4 0 0 1 4 4 V36 a4 4 0 0 1 -4 4 H26 l-8 8 v-8 h-6 a4 4 0 0 1 -4 -4 V18 a4 4 0 0 1 4 -4 z" />
      <text x="18" y="30" fontSize="10" fontFamily="serif" fill={bright} stroke="none">A</text>
      <text x="28" y="34" fontSize="11" fontFamily="serif" fill={soft} stroke="none">B</text>
      <text x="38" y="28" fontSize="9" fontFamily="serif" fill={bright} stroke="none">C</text>
      <path d="M48 50 l2 -4 l4 2" opacity="0.7" />
    </>
  ),
  "Limbic System & Motivation": (
    <>
      {/* Almond-shaped amygdala with motivational arrows pulsing outward */}
      <path d="M20 32 q12 -16 24 0 q-12 16 -24 0 z" fill={soft} stroke="none" />
      <path d="M20 32 q12 -16 24 0 q-12 16 -24 0 z" />
      <circle cx="32" cy="32" r="3" fill={bright} stroke="none" />
      <path d="M32 18 v-4 M32 50 v-4 M14 32 h4 M50 32 h-4 M22 22 l-3 -3 M42 22 l3 -3 M22 42 l-3 3 M42 42 l3 3" opacity="0.8" />
    </>
  ),
  "Neurocognitive Disorders": (
    <>
      {/* Brain dissolving into particles — cognitive decline */}
      <path d="M16 34 a8 8 0 0 1 4 -14 a10 10 0 0 1 18 -2 a8 8 0 0 1 8 12 a6 6 0 0 1 -4 10 H22 a6 6 0 0 1 -6 -6 z" />
      <path d="M20 26 q4 -2 8 0 M30 30 q4 -2 8 0 M24 36 q4 -2 8 0" opacity="0.6" />
      <circle cx="48" cy="22" r="1" fill={soft} stroke="none" />
      <circle cx="52" cy="30" r="1.5" fill={soft} stroke="none" opacity="0.7" />
      <circle cx="50" cy="40" r="0.8" fill={soft} stroke="none" opacity="0.5" />
      <circle cx="14" cy="44" r="1" fill={soft} stroke="none" opacity="0.5" />
      <circle cx="20" cy="50" r="1.2" fill={soft} stroke="none" opacity="0.4" />
    </>
  ),
  "Neurodevelopmental Disorders": (
    <>
      {/* Growing seedling that branches into a small brain canopy */}
      <path d="M32 52 V28" />
      <path d="M32 40 q-6 -2 -8 -8 q4 -2 8 4 z" fill={soft} stroke="none" />
      <path d="M32 32 q6 -2 8 -8 q-4 -2 -8 4 z" fill={soft} stroke="none" />
      <path d="M26 22 a6 6 0 0 1 12 0 a4 4 0 0 1 -2 8 h-8 a4 4 0 0 1 -2 -8 z" />
      <path d="M32 22 V30" opacity="0.5" />
      <circle cx="28" cy="18" r="1.2" fill={bright} stroke="none" />
      <circle cx="36" cy="18" r="1.2" fill={bright} stroke="none" />
    </>
  ),
  "Neuroimaging & Neuromodulation": (
    <>
      {/* Brain scan slices with crosshair / coil overlay */}
      <ellipse cx="32" cy="32" rx="20" ry="14" />
      <path d="M12 32 H52 M32 18 V46" opacity="0.6" />
      <path d="M22 22 q10 -6 20 0 M22 32 q10 -6 20 0 M22 42 q10 -6 20 0" opacity="0.5" />
      <circle cx="32" cy="32" r="4" fill={bright} stroke="none" />
      <circle cx="32" cy="32" r="8" opacity="0.6" />
    </>
  ),
  "Neurophysiology": (
    <>
      {/* Action potential waveform with axon/soma origin */}
      <circle cx="14" cy="40" r="4" fill={soft} stroke="none" />
      <path d="M10 40 l-2 -3 M10 40 l-2 3 M14 36 l-2 -3 M14 44 l-2 3" opacity="0.7" />
      <path d="M18 40 H22 L24 20 L28 50 L32 30 L36 44 L40 40 H54" />
      <circle cx="24" cy="20" r="1.5" fill={bright} stroke="none" />
    </>
  ),
  "Neuropsychology Overview": (
    <>
      {/* Brain inside a magnifying glass */}
      <circle cx="28" cy="28" r="14" />
      <path d="M38 38 l10 10" strokeWidth="2.5" />
      <path d="M22 28 a4 4 0 0 1 12 0 a3 3 0 0 1 -2 6 h-8 a3 3 0 0 1 -2 -6 z" fill={soft} stroke="none" />
      <path d="M22 28 a4 4 0 0 1 12 0 a3 3 0 0 1 -2 6 h-8 a3 3 0 0 1 -2 -6 z" />
      <path d="M28 22 V34" opacity="0.5" />
    </>
  ),
  "Objective Measures": (
    <>
      {/* Calipers / ruler with precise tick marks */}
      <rect x="10" y="28" width="44" height="10" rx="1" />
      <path d="M14 28 V22 M20 28 V24 M26 28 V22 M32 28 V18 M38 28 V22 M44 28 V24 M50 28 V22" opacity="0.85" />
      <path d="M14 38 V44 M20 38 V42 M26 38 V44 M32 38 V46 M38 38 V44 M44 38 V42 M50 38 V44" opacity="0.85" />
      <rect x="30" y="14" width="4" height="36" fill={soft} stroke="none" opacity="0.5" />
      <circle cx="32" cy="33" r="1.5" fill={bright} stroke="none" />
    </>
  ),
  "Peripheral Nervous System": (
    <>
      {/* Body silhouette with branching peripheral nerves */}
      <circle cx="32" cy="14" r="4" />
      <path d="M32 18 V36 M22 24 H42 M32 36 L24 50 M32 36 L40 50" />
      <path d="M22 24 L14 30 M14 30 L12 38 M14 30 L10 36" opacity="0.7" />
      <path d="M42 24 L50 30 M50 30 L52 38 M50 30 L54 36" opacity="0.7" />
      <path d="M24 50 L22 58 M40 50 L42 58" opacity="0.7" />
      <circle cx="12" cy="38" r="1.2" fill={bright} stroke="none" />
      <circle cx="52" cy="38" r="1.2" fill={bright} stroke="none" />
    </>
  ),
  "Personality Disorders": (
    <>
      {/* Two overlapping theater masks */}
      <path d="M12 18 a10 10 0 0 1 20 0 V32 a10 10 0 0 1 -20 0 z" fill={soft} stroke="none" />
      <path d="M12 18 a10 10 0 0 1 20 0 V32 a10 10 0 0 1 -20 0 z" />
      <path d="M18 22 a1 1 0 1 0 0.1 0 M26 22 a1 1 0 1 0 0.1 0" fill={stroke} />
      <path d="M18 30 q4 -3 8 0" />
      <path d="M32 28 a10 10 0 0 1 20 0 V42 a10 10 0 0 1 -20 0 z" />
      <path d="M38 32 a1 1 0 1 0 0.1 0 M46 32 a1 1 0 1 0 0.1 0" fill={stroke} />
      <path d="M38 42 q4 3 8 0" />
    </>
  ),
  "Psychiatric Disorders": (
    <>
      {/* DSM-style reference book with medical cross */}
      <path d="M14 14 H46 a4 4 0 0 1 4 4 V48 a4 4 0 0 1 -4 4 H14 a2 2 0 0 1 -2 -2 V16 a2 2 0 0 1 2 -2 z" />
      <path d="M14 14 V52" />
      <path d="M28 22 H36 V28 H42 V34 H36 V40 H28 V34 H22 V28 H28 z" fill={soft} stroke="none" />
      <path d="M28 22 H36 V28 H42 V34 H36 V40 H28 V34 H22 V28 H28 z" />
      <path d="M18 18 V48" opacity="0.4" />
    </>
  ),
  "Psychoanalytic and Psychodynamic Approaches": (
    <>
      {/* Iceberg — conscious tip above, unconscious mass below */}
      <path d="M12 36 H52" opacity="0.6" strokeDasharray="2 3" />
      <path d="M24 36 L32 16 L42 36 z" fill={soft} stroke="none" />
      <path d="M24 36 L32 16 L42 36 z" />
      <path d="M14 36 L24 36 L18 50 L46 52 L42 36 L52 36 L48 56 H16 z" fill={soft} stroke="none" opacity="0.6" />
      <path d="M14 36 L24 36 L18 50 L46 52 L42 36 L52 36 L48 56 H16 z" />
      <circle cx="32" cy="22" r="1" fill={bright} stroke="none" />
    </>
  ),
  "Psychopharmacology": (
    <>
      {/* Molecule diagram — hex ring + bonded atoms */}
      <path d="M22 24 L32 18 L42 24 L42 36 L32 42 L22 36 z" />
      <circle cx="22" cy="24" r="2.5" fill={soft} stroke="none" />
      <circle cx="42" cy="24" r="2.5" fill={soft} stroke="none" />
      <circle cx="22" cy="36" r="2.5" fill={soft} stroke="none" />
      <circle cx="42" cy="36" r="2.5" fill={soft} stroke="none" />
      <circle cx="32" cy="18" r="2.5" fill={bright} stroke="none" />
      <circle cx="32" cy="42" r="2.5" fill={bright} stroke="none" />
      <path d="M42 24 L52 18 M42 36 L52 42 M22 24 L12 18 M22 36 L12 42" opacity="0.6" />
      <circle cx="52" cy="18" r="2" fill={bright} stroke="none" />
      <circle cx="12" cy="42" r="2" fill={bright} stroke="none" />
    </>
  ),
  "Qualitative Research Methods": (
    <>
      {/* Quote marks above an open notebook */}
      <path d="M16 18 q-4 4 -4 8 h4 v6 h-6 V22 q0 -4 6 -4 z" fill={soft} stroke="none" />
      <path d="M28 18 q-4 4 -4 8 h4 v6 h-6 V22 q0 -4 6 -4 z" fill={soft} stroke="none" />
      <path d="M14 38 H50 a2 2 0 0 1 2 2 V52 H12 V40 a2 2 0 0 1 2 -2 z" />
      <path d="M18 44 H46 M18 48 H40" opacity="0.7" />
    </>
  ),
  "Quantitative Research Methods": (
    <>
      {/* Bar chart with rising trend line + data point */}
      <path d="M12 52 H54" />
      <path d="M12 52 V12" />
      <rect x="16" y="36" width="6" height="16" fill={soft} stroke="none" />
      <rect x="26" y="28" width="6" height="24" fill={soft} stroke="none" />
      <rect x="36" y="22" width="6" height="30" fill={soft} stroke="none" />
      <rect x="46" y="16" width="6" height="36" fill={soft} stroke="none" />
      <rect x="16" y="36" width="6" height="16" />
      <rect x="26" y="28" width="6" height="24" />
      <rect x="36" y="22" width="6" height="30" />
      <rect x="46" y="16" width="6" height="36" />
      <path d="M19 30 L29 24 L39 18 L49 14" stroke={bright} />
      <circle cx="49" cy="14" r="2" fill={bright} stroke="none" />
    </>
  ),
  "Sensory Systems": (
    <>
      {/* Five-sense cluster: eye, ear, nose, hand, mouth */}
      <path d="M10 18 q6 -6 14 0 q-6 6 -14 0 z" />
      <circle cx="17" cy="18" r="2" fill={bright} stroke="none" />
      <path d="M38 14 a6 6 0 1 1 0 12 q-2 4 -4 4 v-4 q-4 -2 -4 -8 a6 6 0 0 1 8 -4 z" />
      <path d="M14 32 q2 8 6 12 q-2 -6 -6 -12 z" fill={soft} stroke="none" />
      <path d="M28 36 a3 3 0 1 1 6 0 V44 a3 3 0 0 1 -6 0 z" />
      <path d="M44 40 q4 -3 8 0 q-4 4 -8 0 z" fill={bright} stroke="none" />
      <path d="M44 40 q4 -3 8 0 q-4 4 -8 0 z" />
    </>
  ),
  "Sleep & Circadian Rhythms": (
    <>
      {/* Crescent moon + small sun + rhythm waveform */}
      <path d="M26 14 a14 14 0 1 0 14 14 a10 10 0 0 1 -14 -14 z" fill={soft} stroke="none" />
      <path d="M26 14 a14 14 0 1 0 14 14 a10 10 0 0 1 -14 -14 z" />
      <circle cx="48" cy="18" r="3" fill={bright} stroke="none" />
      <path d="M48 12 V14 M48 22 V24 M42 18 H44 M52 18 H54 M44 14 l1 1 M51 22 l1 1" opacity="0.7" />
      <path d="M10 48 q4 -8 8 0 q4 8 8 0 q4 -8 8 0 q4 8 8 0" stroke={bright} />
    </>
  ),
  "Subjective Measures & Rating Scales": (
    <>
      {/* Speech bubble with 1–5 rating dots */}
      <path d="M12 14 H46 a4 4 0 0 1 4 4 V36 a4 4 0 0 1 -4 4 H30 l-8 8 v-8 h-10 a4 4 0 0 1 -4 -4 V18 a4 4 0 0 1 4 -4 z" />
      <circle cx="18" cy="26" r="2" />
      <circle cx="25" cy="26" r="2" fill={soft} stroke="none" />
      <circle cx="32" cy="26" r="2" fill={soft} stroke="none" />
      <circle cx="39" cy="26" r="2.5" fill={bright} stroke="none" />
      <circle cx="46" cy="26" r="2" />
    </>
  ),
  "Trauma-Focused Approaches": (
    <>
      {/* Heart split by a luminous healing seam */}
      <path d="M32 50 C 12 38, 12 18, 24 18 C 28 18, 30 22, 32 24 C 34 22, 36 18, 40 18 C 52 18, 52 38, 32 50 z" fill={soft} stroke="none" />
      <path d="M32 50 C 12 38, 12 18, 24 18 C 28 18, 30 22, 32 24 C 34 22, 36 18, 40 18 C 52 18, 52 38, 32 50 z" />
      <path d="M32 24 L28 30 L34 34 L30 40 L34 46" stroke={bright} strokeWidth="2" />
      <circle cx="32" cy="24" r="1.5" fill={bright} stroke="none" />
      <circle cx="34" cy="46" r="1.5" fill={bright} stroke="none" />
    </>
  ),
  "Validity & Effort Testing": (
    <>
      {/* Bullseye target with checkmark hitting center */}
      <circle cx="32" cy="32" r="20" />
      <circle cx="32" cy="32" r="14" />
      <circle cx="32" cy="32" r="8" fill={soft} stroke="none" />
      <circle cx="32" cy="32" r="8" />
      <circle cx="32" cy="32" r="3" fill={bright} stroke="none" />
      <path d="M22 32 l6 6 l14 -16" stroke={bright} strokeWidth="2.5" />
    </>
  ),
  "Vascular System of the Brain": (
    <>
      {/* Branching cerebral vessels — Circle of Willis suggestion */}
      <path d="M32 16 a8 8 0 0 1 0 16 a8 8 0 0 1 0 -16 z" />
      <path d="M32 32 V44 M24 24 H14 M40 24 H50 M22 36 l-8 8 M42 36 l8 8 M28 44 l-4 8 M36 44 l4 8" />
      <circle cx="32" cy="24" r="2" fill={bright} stroke="none" />
      <circle cx="14" cy="24" r="1.5" fill={soft} stroke="none" />
      <circle cx="50" cy="24" r="1.5" fill={soft} stroke="none" />
      <circle cx="14" cy="44" r="1.5" fill={soft} stroke="none" />
      <circle cx="50" cy="44" r="1.5" fill={soft} stroke="none" />
    </>
  ),
};

// Fallback for any topic name not in the map — small starburst so the
// UI degrades gracefully rather than rendering an empty tile.
const FALLBACK_SYMBOL = (
  <>
    <path d="M32 12 L34 28 L50 32 L34 36 L32 52 L30 36 L14 32 L30 28 z" fill={soft} stroke="none" />
    <path d="M32 12 L34 28 L50 32 L34 36 L32 52 L30 36 L14 32 L30 28 z" />
    <circle cx="32" cy="32" r="2" fill={bright} stroke="none" />
  </>
);

function TopicThumbnail({ topic }: { topic: Topic }) {
  const symbol = TOPIC_SYMBOLS[topic.name] ?? FALLBACK_SYMBOL;

  return (
    <div
      aria-hidden
      className="shrink-0 w-14 h-14 rounded-lg flex items-center justify-center border"
      style={{
        // Slightly stronger gradient base + outer cerulean halo so the
        // glowing symbol inside reads as luminous on top of the dark
        // teal card surface.
        background:
          "radial-gradient(circle at 50% 40%, rgba(58,224,236,0.18), rgba(10,45,61,0.65) 70%)",
        borderColor: "rgba(118,228,247,0.32)",
        boxShadow:
          "inset 0 0 14px rgba(118,228,247,0.10), 0 0 18px -6px rgba(58,224,236,0.35)",
      }}
      data-testid={`topic-thumb-${topic.id}`}
    >
      <div
        className="w-10 h-10"
        style={{
          // Layered drop-shadows give every symbol a soft cerulean glow
          // without needing per-SVG <filter> blocks (which would risk id
          // collisions across the 39-card grid). Two layers — a tight
          // inner halo for definition and a wider outer halo for the
          // dreamy aura.
          filter:
            "drop-shadow(0 0 3px rgba(118,228,247,0.65)) drop-shadow(0 0 9px rgba(58,224,236,0.45))",
        }}
      >
        <svg {...svgCommon} width="100%" height="100%">
          {symbol}
        </svg>
      </div>
    </div>
  );
}
