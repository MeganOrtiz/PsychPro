import { useMemo, useState } from "react";
import { Link, useLocation } from "wouter";
import { UserButton } from "@clerk/clerk-react";
import {
  GraduationCap,
  Layers,
  FileQuestion,
  Stethoscope,
  ClipboardCheck,
  ClipboardList,
  XCircle,
  BookMarked,
  Zap,
  BarChart3,
  Library,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Brain,
  CheckCircle2,
  Lock,
  Sparkles,
} from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import {
  useGetTopics,
  getCourseMasteryStatus,
  getGetCourseMasteryStatusQueryKey,
  type Topic,
  type CourseMasteryStatus,
} from "@workspace/api-client-react";
import { STUDY_PALETTE } from "@/lib/study-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { NotificationsBell } from "@/components/notifications-bell";
import { cn } from "@/lib/utils";
import {
  groupEpppTopicsByCategory,
  isEpppKnowledgeTopic,
  isEpppPart2Topic,
} from "@/lib/eppp-content";
import { epppDomainAnchor, epppMasteryExamPath, epppTopicModePath } from "@/lib/eppp-routes";
import smokeBg from "@/assets/bg/brain-clouds.png";
import EpppDashboardPage from "@/pages/eppp-dashboard";

// ---------------------------------------------------------------------------
// EPPP Mastery Suite — a dedicated, EPPP-only workspace with its own left-column
// navigation that replaces the main app sidebar while inside the
// Suite. Reached from the glowing "EPPP Mastery Suite" button in the top
// header. Styled congruently with the main dashboard/app (same dark-glass
// sidebar, smoke backdrop, nav-glass pills, locked cerulean #76E4F7 — no mint).
//
// Wired tabs reuse existing data but keep users inside the EPPP Suite:
// Part 1 Knowledge, Question Bank, Domain Mastery Exams, Flashcards all surface
// EPPP Part 1 topic/category + mastery data; Part 2 Skills is a separate
// applied-skills lane ready for Claude uploads. Performance Analytics folds in
// the existing /eppp/dashboard readiness view. Net-new tabs (Study Plan,
// Clinical Integration Cases, Full-Length Exams, Missed Questions, Rapid Review)
// are on-brand "in development" placeholders.
// ---------------------------------------------------------------------------

const C = {
  cyan: "#76E4F7",
  mist: "#A7F3FF",
  cloud: "#F4FBFF",
  ink: "#03151D",
  hairline: "rgba(118,228,247,0.16)",
  hairlineStrong: "rgba(118,228,247,0.32)",
  body: "rgba(225,244,250,0.84)",
  muted: "rgba(186,214,224,0.66)",
};

type TabSlug =
  | "study-plan"
  | "domains"
  | "part-2-skills"
  | "question-bank"
  | "clinical-cases"
  | "domain-mastery-exams"
  | "full-length-exams"
  | "missed-questions"
  | "flashcards"
  | "rapid-review"
  | "performance-analytics"
  | "resources";

type TabDef = {
  slug: TabSlug;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: string;
};

// Exact order requested by the owner.
const TABS: TabDef[] = [
  { slug: "study-plan", label: "Study Plan", icon: ClipboardList, section: "Plan" },
  { slug: "domains", label: "Part 1: Knowledge", icon: Layers, section: "Learn" },
  { slug: "part-2-skills", label: "Part 2: Skills", icon: Brain, section: "Learn" },
  { slug: "question-bank", label: "Question Bank", icon: FileQuestion, section: "Practice" },
  { slug: "clinical-cases", label: "Clinical Integration Cases", icon: Stethoscope, section: "Practice" },
  { slug: "domain-mastery-exams", label: "Domain Mastery Exams", icon: GraduationCap, section: "Assess" },
  { slug: "full-length-exams", label: "Full-Length Exams", icon: ClipboardCheck, section: "Assess" },
  { slug: "missed-questions", label: "Missed Questions", icon: XCircle, section: "Review" },
  { slug: "flashcards", label: "Flashcards", icon: BookMarked, section: "Review" },
  { slug: "rapid-review", label: "Rapid Review", icon: Zap, section: "Review" },
  { slug: "performance-analytics", label: "Performance Analytics", icon: BarChart3, section: "Track" },
  { slug: "resources", label: "Resources", icon: Library, section: "Reference" },
];

const DEFAULT_TAB: TabSlug = "performance-analytics";

// Reuse the main-app sidebar pill recipe (classes defined in index.css).
const NAV_ITEM_BASE =
  "nav-glass group relative flex items-center gap-2.5 px-3 py-2 rounded-[8px] cursor-pointer transition-all duration-200 ease-in-out border backdrop-blur-md";
const NAV_ITEM_IDLE = "nav-glass-idle text-[#B9D2DA] hover:text-[#A7F3FF]";
const NAV_ITEM_ACTIVE = "nav-glass-active text-[#A7F3FF]";

function navItemClass(isActive: boolean) {
  return cn(NAV_ITEM_BASE, isActive ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE);
}

function slugify(category: string): string {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// ---- shared domain/mastery data -------------------------------------------
type DomainStat = {
  category: string;
  total: number;
  passed: number;
  pct: number;
  mastered: boolean;
  unlocked: boolean;
};

// Topics-only — used by Question Bank / Flashcards, which never need mastery
// status and therefore must not trigger the per-category status fan-out.
function useEpppTopics(part: "part1" | "part2" = "part1") {
  const { data: allTopics, isLoading: topicsLoading } = useGetTopics();
  const epppTopics = useMemo(
    () =>
      ((allTopics ?? []) as Topic[]).filter((topic) =>
        part === "part2" ? isEpppPart2Topic(topic) : isEpppKnowledgeTopic(topic),
      ),
    [allTopics, part],
  );
  return { allTopics: epppTopics, topicsLoading };
}

function useEpppDomains() {
  const { allTopics, topicsLoading } = useEpppTopics();

  const categories = useMemo(() => {
    return groupEpppTopicsByCategory(allTopics).map((group) => group.name);
  }, [allTopics]);

  const masteryQueries = useQueries({
    queries: categories.map((category) => ({
      queryKey: getGetCourseMasteryStatusQueryKey(category),
      queryFn: () => getCourseMasteryStatus(category),
      staleTime: 60_000,
    })),
  });

  const masteryLoading =
    categories.length > 0 && masteryQueries.some((q) => q.isLoading);
  const masteryKey = masteryQueries.map((q) => q.dataUpdatedAt).join(",");

  const domainStats = useMemo<DomainStat[]>(() => {
    return categories.map((category, i) => {
      const s = masteryQueries[i]?.data as CourseMasteryStatus | undefined;
      const total = s?.totalTopics ?? 0;
      const passed = s?.passedTopics ?? 0;
      const pct = total > 0 ? Math.round((passed / total) * 100) : 0;
      return {
        category,
        total,
        passed,
        pct,
        mastered: !!s?.mastered,
        unlocked: !!s?.unlocked,
      };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, masteryKey]);

  return {
    allTopics,
    topicsLoading,
    domainStats,
    domainsLoading: masteryLoading,
  };
}

// ===========================================================================
// Shell
// ===========================================================================
export default function EpppSuitePage({ tab }: { tab?: string }) {
  const [, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const activeSlug: TabSlug = TABS.some((t) => t.slug === tab)
    ? (tab as TabSlug)
    : DEFAULT_TAB;

  return (
    <div className="study-page-bg flex min-h-screen" data-testid="eppp-suite">
      <style>{styles}</style>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 flex flex-col transition-transform duration-300 md:sticky md:top-4 md:bottom-auto md:self-start md:h-[calc(100vh-2rem)] md:translate-x-0 overflow-hidden m-4 rounded-2xl",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
        style={{
          ["--nav-glow" as never]: STUDY_PALETTE.surf,
          background: `linear-gradient(180deg, rgba(2,13,18,0.35) 0%, rgba(2,13,18,0.55) 55%, rgba(2,13,18,0.8) 100%), url(${smokeBg}), linear-gradient(180deg, ${STUDY_PALETTE.surfaceElev}, ${STUDY_PALETTE.surface})`,
          backgroundSize: "cover, cover, cover",
          backgroundPosition: "center, center, center",
          backgroundRepeat: "no-repeat, no-repeat, no-repeat",
          border: `1px solid ${STUDY_PALETTE.surf}55`,
          boxShadow: `0 20px 60px -20px ${STUDY_PALETTE.teal}77`,
        }}
        data-testid="eppp-suite-sidebar"
      >
        {/* Starry shimmer — same recipe as the main sidebar */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 18% 12%, rgba(255,255,255,.85), transparent 60%), radial-gradient(1.2px 1.2px at 65% 8%, rgba(255,255,255,.7), transparent 60%), radial-gradient(1px 1px at 82% 28%, rgba(255,255,255,.6), transparent 60%), radial-gradient(1.4px 1.4px at 32% 52%, rgba(255,255,255,.45), transparent 60%), radial-gradient(1px 1px at 75% 68%, rgba(255,255,255,.5), transparent 60%), radial-gradient(1px 1px at 12% 76%, rgba(255,255,255,.45), transparent 60%), radial-gradient(1.2px 1.2px at 88% 90%, rgba(255,255,255,.55), transparent 60%), radial-gradient(0.8px 0.8px at 45% 22%, rgba(255,255,255,.5), transparent 60%), radial-gradient(0.8px 0.8px at 25% 38%, rgba(255,255,255,.4), transparent 60%), radial-gradient(1px 1px at 60% 80%, rgba(255,255,255,.4), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-12 w-56 h-56 rounded-full blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${STUDY_PALETTE.surf}33, transparent)` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-12 w-56 h-56 rounded-full blur-3xl"
          style={{ background: `radial-gradient(closest-side, ${STUDY_PALETTE.teal}2e, transparent)` }}
        />

        {/* Brand header */}
        <div className="relative flex items-start justify-between px-4 pt-4 pb-2">
          <div className="eps-brand">
            <span className="eps-brand-icon">
              <GraduationCap aria-hidden />
            </span>
            <span className="eps-brand-text">
              <span className="eps-brand-word">EPPP</span>
              <span className="eps-brand-eyebrow">Mastery Suite</span>
            </span>
          </div>
          <button
            className="md:hidden text-white/80 mt-1"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="relative flex-1 p-3 space-y-1 overflow-y-auto">
          {TABS.map((t, index) => {
            const isActive = t.slug === activeSlug;
            const showSection = t.section && t.section !== TABS[index - 1]?.section;
            return (
              <div key={t.slug}>
                {showSection && <p className="eps-nav-section">{t.section}</p>}
                <Link
                  href={`/eppp/suite/${t.slug}`}
                  onClick={() => setSidebarOpen(false)}
                  data-testid={`eppp-tab-${t.slug}`}
                >
                  <div className={navItemClass(isActive)}>
                    <t.icon className="w-4 h-4 flex-shrink-0" />
                    <span className="text-sm font-medium flex-1 min-w-0">{t.label}</span>
                    {isActive && <ChevronRight className="w-4 h-4 flex-shrink-0" />}
                  </div>
                </Link>
              </div>
            );
          })}
        </nav>

      </aside>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top bar */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            data-testid="eppp-suite-menu-toggle"
            className="inline-flex items-center justify-center h-9 w-9 rounded-md text-foreground"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <GraduationCap className="w-6 h-6 text-primary" />
          <span className="font-bold text-foreground">Mastery Suite</span>
          <div className="ml-auto flex items-center gap-2.5">
            {isMobile && <NotificationsBell />}
            <UserButton afterSignOutUrl={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"} />
          </div>
        </header>

        {/* Desktop top bar */}
        <header className="hidden md:flex items-center justify-end gap-3 px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="eppp-launch-btn" data-testid="eppp-suite-back-desktop">
              <span className="eppp-launch-btn__inner">
                <ArrowLeft aria-hidden />
                <span>Back to PsychPro</span>
              </span>
            </Link>
            {!isMobile && <NotificationsBell />}
            <UserButton
              afterSignOutUrl={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 rounded-full ring-1 ring-[#76E4F7]/40",
                },
              }}
            />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto" data-testid="eppp-suite-content">
          <SuiteContent slug={activeSlug} onNavigate={navigate} />
        </main>
      </div>
    </div>
  );
}

// ===========================================================================
// Tab content router
// ===========================================================================
function SuiteContent({
  slug,
  onNavigate,
}: {
  slug: TabSlug;
  onNavigate: (to: string) => void;
}) {
  switch (slug) {
    case "performance-analytics":
      return <EpppDashboardPage />;
    case "resources":
      return <EpppResourcesPanel />;
    case "domains":
      return <DomainsPanel onNavigate={onNavigate} />;
    case "part-2-skills":
      return <Part2SkillsPanel onNavigate={onNavigate} />;
    case "domain-mastery-exams":
      return <DomainMasteryExamsPanel onNavigate={onNavigate} />;
    case "question-bank":
      return (
        <TopicDirectoryPanel
          eyebrow="PRACTICE"
          title="Question Bank"
          subtitle="Practice questions for every lesson, organized by content area. Drill a topic to sharpen recall and reasoning."
          icon={FileQuestion}
          countField="quizCount"
          countNoun="questions"
          hrefFor={(id) => epppTopicModePath(id, "quiz")}
          ctaLabel="Practice"
          emptyHint="No practice questions are available yet."
          onNavigate={onNavigate}
        />
      );
    case "flashcards":
      return (
        <TopicDirectoryPanel
          eyebrow="ACTIVE RECALL"
          title="Flashcards"
          subtitle="Spaced-repetition flashcard decks for every lesson, organized by content area."
          icon={BookMarked}
          countField="flashcardCount"
          countNoun="cards"
          hrefFor={(id) => epppTopicModePath(id, "flashcards")}
          ctaLabel="Study deck"
          emptyHint="No flashcard decks are available yet."
          onNavigate={onNavigate}
        />
      );
    case "study-plan":
      return (
        <ComingSoonPanel
          eyebrow="PLAN"
          title="Study Plan"
          icon={ClipboardList}
          description="A personalized, date-aware study schedule that sequences domains and lessons toward your exam date — so you always know what to study next."
        />
      );
    case "clinical-cases":
      return <ClinicalCasesPanel />;
    case "full-length-exams":
      return (
        <ComingSoonPanel
          eyebrow="SIMULATE"
          title="Full-Length Exams"
          icon={ClipboardCheck}
          description="Timed, full-length practice exams that mirror the scope and pacing of the EPPP, with detailed score reports across every content area."
        />
      );
    case "missed-questions":
      return (
        <ComingSoonPanel
          eyebrow="REVIEW"
          title="Missed Questions"
          icon={XCircle}
          description="Every question you've missed, gathered in one place for targeted review and spaced repetition until you've truly mastered it."
        />
      );
    case "rapid-review":
      return <RapidReviewPanel />;
    default:
      return <EpppDashboardPage />;
  }
}

// ---- panel header ---------------------------------------------------------
function PanelHead({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <header className="eps-head">
      <p className="eps-eyebrow">{eyebrow}</p>
      <h1 className="eps-title">{title}</h1>
      <p className="eps-sub">{subtitle}</p>
    </header>
  );
}

// ---- Domains --------------------------------------------------------------
function DomainsPanel({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { domainStats, domainsLoading } = useEpppDomains();
  const masteredCount = domainStats.filter((d) => d.mastered).length;

  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-domains">
      <div className="eps-shell">
        <PanelHead
          eyebrow="CONTENT AREAS"
          title="Domains"
          subtitle="Your progress across every EPPP content area. Open a domain to keep working through its lessons and capstone mastery exam."
        />

        <div className="eps-section-head">
          <span className="eps-section-meta">
            {domainStats.length === 0
              ? "Loading…"
              : `${masteredCount}/${domainStats.length} mastered`}
          </span>
        </div>

        {domainStats.length === 0 ? (
          <div className="eps-empty">Loading your domains…</div>
        ) : (
          <div className="eps-domain-grid">
            {domainStats.map((d) => {
              const dest = d.unlocked
                ? epppMasteryExamPath(d.category)
                : epppDomainAnchor(d.category);
              return (
                <button
                  key={d.category}
                  className={cn("eps-domain", d.mastered && "is-mastered", domainsLoading && "is-loading")}
                  onClick={() => onNavigate(dest)}
                  data-testid={`eppp-domain-${slugify(d.category)}`}
                >
                  <div className="eps-domain-top">
                    <span className="eps-domain-name">{d.category}</span>
                    {d.mastered ? (
                      <span className="eps-badge eps-badge--mastered">
                        <CheckCircle2 aria-hidden /> Mastered
                      </span>
                    ) : d.unlocked ? (
                      <span className="eps-badge eps-badge--ready">Exam ready</span>
                    ) : null}
                  </div>
                  <div className="eps-bar">
                    {domainsLoading ? (
                      <span className="eps-bar-fill eps-bar-fill--idle" />
                    ) : (
                      <span className="eps-bar-fill" style={{ width: `${d.pct}%` }} />
                    )}
                  </div>
                  <div className="eps-domain-foot">
                    <span>
                      {domainsLoading ? "Checking progress…" : `${d.passed}/${d.total} lessons`}
                    </span>
                    {!domainsLoading && <span className="eps-domain-pct">{d.pct}%</span>}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Domain Mastery Exams -------------------------------------------------
function DomainMasteryExamsPanel({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { domainStats, domainsLoading } = useEpppDomains();
  const masteredCount = domainStats.filter((d) => d.mastered).length;

  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-mastery-exams">
      <div className="eps-shell">
        <PanelHead
          eyebrow="PROVE MASTERY"
          title="Domain Mastery Exams"
          subtitle="Capstone exams unlock once you've passed every lesson in a content area at 90%+. Pass the exam at 90%+ to master the domain."
        />

        <div className="eps-section-head">
          <span className="eps-section-meta">
            {domainStats.length === 0
              ? "Loading…"
              : `${masteredCount}/${domainStats.length} mastered`}
          </span>
        </div>

        {domainStats.length === 0 ? (
          <div className="eps-empty">Loading your domains…</div>
        ) : (
          <div className="eps-exam-list">
            {domainStats.map((d) => {
              const state = d.mastered
                ? "mastered"
                : d.unlocked
                  ? "ready"
                  : "locked";
              return (
                <div
                  key={d.category}
                  className={cn("eps-exam-row", `is-${state}`)}
                  data-testid={`eppp-mastery-${slugify(d.category)}`}
                >
                  <span className="eps-exam-icon">
                    {state === "mastered" ? (
                      <CheckCircle2 aria-hidden />
                    ) : state === "ready" ? (
                      <GraduationCap aria-hidden />
                    ) : (
                      <Lock aria-hidden />
                    )}
                  </span>
                  <div className="eps-exam-body">
                    <span className="eps-exam-name">{d.category}</span>
                    <span className="eps-exam-meta">
                      {state === "mastered"
                        ? "Mastered — passed at 90%+"
                        : state === "ready"
                          ? "Ready to sit · all lessons passed"
                          : domainsLoading
                            ? "Checking progress…"
                            : `${d.passed}/${d.total} lessons passed · 90%+ each to unlock`}
                    </span>
                  </div>
                  {state === "locked" ? (
                    <button
                      className="eps-exam-cta eps-exam-cta--ghost"
                      onClick={() => onNavigate(epppDomainAnchor(d.category))}
                      data-testid={`eppp-mastery-study-${slugify(d.category)}`}
                    >
                      Study lessons <ArrowRight aria-hidden />
                    </button>
                  ) : (
                    <button
                      className="eps-exam-cta"
                      onClick={() =>
                        onNavigate(epppMasteryExamPath(d.category))
                      }
                      data-testid={`eppp-mastery-open-${slugify(d.category)}`}
                    >
                      {state === "mastered" ? "Retake exam" : "Start exam"} <ArrowRight aria-hidden />
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Topic directory (Question Bank / Flashcards) -------------------------
function TopicDirectoryPanel({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  countField,
  countNoun,
  hrefFor,
  ctaLabel,
  emptyHint,
  onNavigate,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  countField: "quizCount" | "flashcardCount";
  countNoun: string;
  hrefFor: (topicId: number) => string;
  ctaLabel: string;
  emptyHint: string;
  onNavigate: (to: string) => void;
}) {
  const { allTopics, topicsLoading } = useEpppTopics();

  const grouped = useMemo(() => {
    return groupEpppTopicsByCategory(allTopics).map((group) => [group.name, group.items] as const);
  }, [allTopics]);

  return (
    <div className="study-page-bg eps-panel" data-testid={`eppp-panel-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="eps-shell">
        <PanelHead eyebrow={eyebrow} title={title} subtitle={subtitle} />

        {topicsLoading ? (
          <div className="eps-empty">Loading lessons…</div>
        ) : grouped.length === 0 ? (
          <div className="eps-empty">{emptyHint}</div>
        ) : (
          <div className="eps-groups">
            {grouped.map(([category, topics]) => (
              <section key={category} className="eps-group">
                <div className="eps-group-head">
                  <Layers className="eps-group-icon" aria-hidden />
                  <h2 className="eps-group-title">{category}</h2>
                  <span className="eps-group-count">{topics.length} lessons</span>
                </div>
                <div className="eps-topic-grid">
                  {topics.map((t) => {
                    const count = (t[countField] as number) ?? 0;
                    const disabled = count <= 0;
                    return (
                      <button
                        key={t.id}
                        className={cn("eps-topic", disabled && "is-disabled")}
                        onClick={() => !disabled && onNavigate(hrefFor(t.id))}
                        disabled={disabled}
                        data-testid={`eppp-topic-${t.id}`}
                      >
                        <span className="eps-topic-icon">
                          <Icon aria-hidden />
                        </span>
                        <span className="eps-topic-body">
                          <span className="eps-topic-name">{t.name}</span>
                          <span className="eps-topic-meta">
                            {disabled ? `No ${countNoun} yet` : `${count} ${countNoun}`}
                          </span>
                        </span>
                        {!disabled && (
                          <span className="eps-topic-cta">
                            {ctaLabel} <ArrowRight aria-hidden />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Part 2 Skills --------------------------------------------------------
const PART2_SKILL_SHELLS = [
  "Assessment and Intervention Skills",
  "Consultation and Supervision Skills",
  "Scientific Thinking and Evidence Use",
  "Professional Ethics and Legal Decision-Making",
  "Communication, Relationships, and Diversity",
  "Clinical Reasoning and Applied Judgment",
];

function Part2SkillsPanel({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { allTopics, topicsLoading } = useEpppTopics("part2");

  const grouped = useMemo(() => {
    return groupEpppTopicsByCategory(allTopics).map((group) => [group.name, group.items] as const);
  }, [allTopics]);

  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-part-2-skills">
      <div className="eps-shell">
        <PanelHead
          eyebrow="APPLIED SKILLS"
          title="Part 2: Skills"
          subtitle="Applied EPPP material belongs here: decision-making, clinical reasoning, communication, supervision, ethics judgment, and case-based skill practice."
        />

        {topicsLoading ? (
          <div className="eps-empty">Loading Part 2 skills…</div>
        ) : grouped.length === 0 ? (
          <div className="eps-import-panel" data-testid="eppp-part2-upload-contract">
            <div className="eps-import-copy">
              <span className="eps-soon-pill">
                <Sparkles aria-hidden /> Ready for upload
              </span>
              <h2 className="eps-soon-title">Part 2 content has a home now</h2>
              <p className="eps-soon-text">
                Tell Claude to load each Part 2 lesson as EPPP content and prefix
                its category with <strong>Part 2:</strong> or <strong>EPPP Skills:</strong>.
                These lessons will appear here instead of mixing into Part 1 domains
                or the main PsychPro course library.
              </p>
            </div>
            <div className="eps-skill-shells" aria-label="Planned Part 2 skill domains">
              {PART2_SKILL_SHELLS.map((domain) => (
                <div key={domain} className="eps-skill-shell">
                  <Brain aria-hidden />
                  <span>{domain}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="eps-groups">
            {grouped.map(([category, topics]) => (
              <section key={category} className="eps-group">
                <div className="eps-group-head">
                  <Brain className="eps-group-icon" aria-hidden />
                  <h2 className="eps-group-title">{category}</h2>
                  <span className="eps-group-count">{topics.length} skills</span>
                </div>
                <div className="eps-topic-grid">
                  {topics.map((t) => {
                    const questionCount = t.quizCount ?? 0;
                    return (
                      <button
                        key={t.id}
                        className="eps-topic"
                        onClick={() => onNavigate(epppTopicModePath(t.id, "study-guide"))}
                        data-testid={`eppp-part2-skill-${t.id}`}
                      >
                        <span className="eps-topic-icon">
                          <Brain aria-hidden />
                        </span>
                        <span className="eps-topic-body">
                          <span className="eps-topic-name">{t.name}</span>
                          <span className="eps-topic-meta">
                            {questionCount > 0
                              ? `${questionCount} applied questions`
                              : "Skill lesson"}
                          </span>
                        </span>
                        <span className="eps-topic-cta">
                          Open skill <ArrowRight aria-hidden />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Clinical cases + rapid review foundations ---------------------------
const PART1_KNOWLEDGE_DOMAINS = [
  "Biological Bases of Behavior",
  "Cognitive-Affective Bases of Behavior",
  "Social and Cultural Bases of Behavior",
  "Growth and Lifespan Development",
  "Assessment and Diagnosis",
  "Treatment, Intervention, Prevention, and Supervision",
  "Research Methods and Statistics",
  "Ethical, Legal, and Professional Issues",
];

const PART2_SKILL_PHASES = [
  "Assessment and Intervention Skills",
  "Consultation and Supervision Skills",
  "Scientific Thinking and Evidence Use",
  "Professional Ethics and Legal Decision-Making",
  "Communication, Relationships, and Diversity",
  "Clinical Reasoning and Applied Judgment",
];

function ClinicalCasesPanel() {
  return (
    <ContentCreationPanel
      eyebrow="APPLY"
      title="Clinical Integration Cases"
      icon={Stethoscope}
      part1Title="Part 1 cases first"
      part1Description="Build cases from the Part 1 knowledge domains so learners practice applying core EPPP concepts before layering in Part 2 skill judgment."
      part1Items={PART1_KNOWLEDGE_DOMAINS}
      part2Title="Part 2 cases next"
      part2Description="After Part 1 cases are loaded, add skill-heavy cases that emphasize judgment, communication, consultation, supervision, and ethics decision-making."
      part2Items={PART2_SKILL_PHASES}
      contractLines={[
        "Use case stems with setting, client/context, presenting issue, and decision point.",
        "Tag every case as Part 1 or Part 2 before upload.",
        "Attach questions, rationales, competencies, and difficulty metadata to the case.",
      ]}
    />
  );
}

function RapidReviewPanel() {
  return (
    <ContentCreationPanel
      eyebrow="REINFORCE"
      title="Rapid Review"
      icon={Zap}
      part1Title="Part 1 review first"
      part1Description="Create concise recall sheets and final-pass review prompts for each Part 1 knowledge domain before adding Part 2 applied review."
      part1Items={PART1_KNOWLEDGE_DOMAINS}
      part2Title="Part 2 review next"
      part2Description="Then create applied review drills for clinical reasoning, decision-making, supervision, consultation, ethics, and diversity-centered practice."
      part2Items={PART2_SKILL_PHASES}
      contractLines={[
        "Keep Rapid Review separate from full chapters and flashcards.",
        "Use concise bullets, traps, compare/contrast frames, and quick retrieval prompts.",
        "Tag each review asset as Part 1 or Part 2 before upload.",
      ]}
    />
  );
}

function ContentCreationPanel({
  eyebrow,
  title,
  icon: Icon,
  part1Title,
  part1Description,
  part1Items,
  part2Title,
  part2Description,
  part2Items,
  contractLines,
}: {
  eyebrow: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  part1Title: string;
  part1Description: string;
  part1Items: string[];
  part2Title: string;
  part2Description: string;
  part2Items: string[];
  contractLines: string[];
}) {
  return (
    <div className="study-page-bg eps-panel" data-testid={`eppp-panel-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="eps-shell">
        <PanelHead
          eyebrow={eyebrow}
          title={title}
          subtitle="This section is ready to be built in sequence: Part 1 first, then Part 2. Content loaded here stays inside the EPPP Mastery Suite."
        />

        <div className="eps-build-grid">
          <section className="eps-build-card is-active">
            <div className="eps-build-kicker">
              <Icon aria-hidden />
              <span>Build now</span>
            </div>
            <h2>{part1Title}</h2>
            <p>{part1Description}</p>
            <div className="eps-build-list">
              {part1Items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>

          <section className="eps-build-card">
            <div className="eps-build-kicker">
              <Brain aria-hidden />
              <span>Build second</span>
            </div>
            <h2>{part2Title}</h2>
            <p>{part2Description}</p>
            <div className="eps-build-list">
              {part2Items.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </section>
        </div>

        <section className="eps-contract-card">
          <span className="eps-soon-pill">
            <Sparkles aria-hidden /> Upload contract
          </span>
          <h2>Claude should create Part 1 content for this section first</h2>
          <ul>
            {contractLines.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

// ---- EPPP-only resources --------------------------------------------------
function EpppResourcesPanel() {
  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-resources">
      <div className="eps-shell">
        <PanelHead
          eyebrow="REFERENCE"
          title="Resources"
          subtitle="EPPP-only reference material will live here. Main PsychPro resources stay on the main site."
        />
        <div className="eps-soon" data-testid="eppp-resources-contained">
          <div className="eps-soon-glow" aria-hidden />
          <span className="eps-soon-icon">
            <Library aria-hidden />
          </span>
          <span className="eps-soon-pill">
            <Sparkles aria-hidden /> EPPP workspace
          </span>
          <h2 className="eps-soon-title">EPPP resources only</h2>
          <p className="eps-soon-text">
            This area is reserved for EPPP-specific references, decision trees,
            formulas, and review assets. General PsychPro resources are not
            shown inside the EPPP dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}

// ---- Coming soon ----------------------------------------------------------
function ComingSoonPanel({
  eyebrow,
  title,
  icon: Icon,
  description,
}: {
  eyebrow: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}) {
  return (
    <div className="study-page-bg eps-panel" data-testid={`eppp-panel-${title.toLowerCase().replace(/\s+/g, "-")}`}>
      <div className="eps-shell">
        <PanelHead eyebrow={eyebrow} title={title} subtitle={description} />
        <div className="eps-soon" data-testid="eppp-coming-soon">
          <div className="eps-soon-glow" aria-hidden />
          <span className="eps-soon-icon">
            <Icon aria-hidden />
          </span>
          <span className="eps-soon-pill">
            <Sparkles aria-hidden /> In development
          </span>
          <h2 className="eps-soon-title">{title} is on the way</h2>
          <p className="eps-soon-text">{description}</p>
        </div>
      </div>
    </div>
  );
}

const styles = `
/* ---- sidebar brand ---- */
.eps-brand { display: flex; align-items: center; gap: 11px; }
.eps-brand-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; flex-shrink: 0;
  border-radius: 11px;
  background: ${C.cyan}16; border: 1px solid ${C.cyan}45; color: ${C.cyan};
  box-shadow: 0 0 18px -4px ${C.cyan}80;
}
.eps-brand-icon svg { width: 18px; height: 18px; }
.eps-brand-text { display: flex; flex-direction: column; line-height: 1; }
.eps-brand-word {
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 300; font-size: 18px; letter-spacing: 0.22em; padding-left: 0.22em;
  color: ${C.cloud}; text-shadow: 0 0 18px ${C.cyan}3a;
}
.eps-brand-eyebrow {
  margin-top: 5px; font-size: 10px; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; color: ${C.mist};
}
.eps-nav-section {
  margin: 14px 8px 6px;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(167,243,255,0.58);
}
.eps-nav-section:first-child { margin-top: 4px; }

/* ---- desktop crumb bar ---- */
.eps-crumb-mark { font-weight: 600; letter-spacing: 0.18em; font-size: 12px; color: ${C.cloud}; }
.eps-crumb-sep { width: 1px; height: 16px; background: ${C.hairlineStrong}; flex-shrink: 0; }
.eps-crumb-page { font-size: 13px; font-weight: 500; color: ${C.mist}; }
.eps-back-app {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 999px;
  font-size: 12.5px; font-weight: 600; text-decoration: none; white-space: nowrap;
  color: ${C.mist}; border: 1px solid ${C.hairlineStrong}; background: rgba(12,28,38,0.5);
  transition: transform 0.2s ease, border-color 0.2s ease, color 0.2s ease;
}
.eps-back-app svg { width: 14px; height: 14px; }
.eps-back-app:hover { transform: translateY(-1px); border-color: ${C.cyan}80; color: ${C.cloud}; }

/* ---- panel scaffold ---- */
.eps-panel { min-height: 100%; padding: clamp(20px, 3.5vw, 44px) clamp(16px, 4vw, 48px) clamp(48px, 6vw, 88px); }
.eps-shell { max-width: 1120px; margin: 0 auto; display: flex; flex-direction: column; gap: clamp(20px, 2.6vw, 30px); }
.eps-head { display: flex; flex-direction: column; align-items: center; text-align: center; }
.eps-eyebrow {
  margin: 0 0 10px;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${C.mist};
}
.eps-title {
  margin: 0;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(22px, 3.2vw, 36px);
  line-height: 1.1;
  letter-spacing: 0.32em;
  padding-left: 0.32em;
  text-transform: uppercase;
  max-width: 100%;
  overflow-wrap: anywhere;
  color: ${C.cloud}; text-shadow: 0 0 32px ${C.cyan}2e;
}
.eps-sub { margin: 14px 0 0; max-width: 640px; font-size: clamp(13px, 1vw, 15px); line-height: 1.6; color: ${C.body}; }
@media (max-width: 640px) {
  .eps-title { letter-spacing: 0.18em; padding-left: 0.18em; }
}

.eps-section-head { display: flex; align-items: center; justify-content: flex-end; margin-top: -4px; }
.eps-section-meta { font-size: 13px; font-weight: 600; color: ${C.mist}; }
.eps-empty {
  border-radius: 16px; padding: 28px; text-align: center; font-size: 14px; color: ${C.muted};
  border: 1px dashed ${C.hairline}; background: rgba(6,28,40,0.4);
}

/* ---- domain grid ---- */
.eps-domain-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(12px, 1.5vw, 18px); }
@media (max-width: 900px) { .eps-domain-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 560px) { .eps-domain-grid { grid-template-columns: 1fr; } }
.eps-domain {
  display: flex; flex-direction: column; gap: 12px; text-align: left; cursor: pointer;
  border-radius: 16px; padding: 18px;
  background: linear-gradient(145deg, rgba(10,45,61,0.5), rgba(6,28,40,0.62));
  border: 1px solid ${C.hairline};
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.3s ease;
}
.eps-domain:hover { transform: translateY(-3px); border-color: ${C.cyan}66; box-shadow: 0 22px 56px -38px rgba(0,0,0,0.7), 0 0 24px -10px ${C.cyan}59; }
.eps-domain.is-mastered { border-color: ${C.cyan}5e; background: linear-gradient(145deg, rgba(14,60,80,0.62), rgba(8,36,48,0.7)); }
.eps-domain.is-loading { opacity: 0.85; }
.eps-domain-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.eps-domain-name { font-size: 14.5px; font-weight: 600; color: ${C.cloud}; line-height: 1.3; }
.eps-badge { display: inline-flex; align-items: center; gap: 4px; flex-shrink: 0; padding: 3px 9px; border-radius: 999px; font-size: 10.5px; font-weight: 700; }
.eps-badge svg { width: 12px; height: 12px; }
.eps-badge--mastered { color: ${C.ink}; background: ${C.cyan}; }
.eps-badge--ready { color: ${C.mist}; background: rgba(118,228,247,0.14); border: 1px solid ${C.hairlineStrong}; }
.eps-bar { height: 7px; border-radius: 999px; background: rgba(118,228,247,0.1); overflow: hidden; }
.eps-bar-fill { display: block; height: 100%; border-radius: 999px; background: linear-gradient(90deg, ${C.cyan}, ${C.mist}); box-shadow: 0 0 8px ${C.cyan}80; transition: width 800ms cubic-bezier(0.16,1,0.3,1); }
.eps-bar-fill--idle { width: 35%; background: rgba(118,228,247,0.28); box-shadow: none; animation: eps-pulse 1.3s ease-in-out infinite; }
@keyframes eps-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.9; } }
.eps-domain-foot { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: ${C.muted}; }
.eps-domain-pct { font-weight: 700; color: ${C.mist}; }

/* ---- mastery exam list ---- */
.eps-exam-list { display: flex; flex-direction: column; gap: 12px; }
.eps-exam-row {
  display: flex; align-items: center; gap: 16px;
  border-radius: 16px; padding: 16px 18px;
  background: linear-gradient(145deg, rgba(10,45,61,0.5), rgba(6,28,40,0.62));
  border: 1px solid ${C.hairline};
}
.eps-exam-row.is-mastered { border-color: ${C.cyan}5e; background: linear-gradient(145deg, rgba(14,60,80,0.6), rgba(8,36,48,0.68)); }
.eps-exam-row.is-locked { opacity: 0.9; }
.eps-exam-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 42px; height: 42px; flex-shrink: 0; border-radius: 12px;
  background: ${C.cyan}14; border: 1px solid ${C.cyan}38; color: ${C.cyan};
}
.eps-exam-row.is-locked .eps-exam-icon { background: rgba(118,228,247,0.06); border-color: ${C.hairline}; color: ${C.muted}; }
.eps-exam-icon svg { width: 19px; height: 19px; }
.eps-exam-body { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
.eps-exam-name { font-size: 15px; font-weight: 600; color: ${C.cloud}; }
.eps-exam-meta { font-size: 12.5px; color: ${C.muted}; line-height: 1.4; }
.eps-exam-cta {
  display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0; cursor: pointer;
  padding: 9px 16px; border-radius: 999px; font-size: 13px; font-weight: 700; white-space: nowrap;
  color: ${C.ink}; border: 1px solid rgba(167,243,255,0.6);
  background: linear-gradient(135deg, ${C.mist} 0%, ${C.cyan} 100%);
  box-shadow: 0 0 18px -6px ${C.cyan}b3; transition: transform 0.2s ease, box-shadow 0.3s ease;
}
.eps-exam-cta svg { width: 15px; height: 15px; }
.eps-exam-cta:hover { transform: translateY(-1px); box-shadow: 0 0 26px -4px ${C.cyan}d9; }
.eps-exam-cta--ghost {
  color: ${C.mist}; background: rgba(12,28,38,0.55); border: 1px solid ${C.hairlineStrong}; box-shadow: none;
}
.eps-exam-cta--ghost:hover { border-color: ${C.cyan}80; color: ${C.cloud}; box-shadow: none; }

/* ---- topic groups (question bank / flashcards) ---- */
.eps-groups { display: flex; flex-direction: column; gap: clamp(20px, 2.6vw, 30px); }
.eps-group-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.eps-group-icon { width: 16px; height: 16px; color: ${C.cyan}; flex-shrink: 0; }
.eps-group-title {
  margin: 0;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-size: clamp(16px, 1.8vw, 21px);
  font-weight: 300;
  letter-spacing: 0.18em;
  line-height: 1.25;
  text-transform: uppercase;
  min-width: 0;
  color: ${C.cloud};
}
.eps-group-count { margin-left: auto; font-size: 12px; font-weight: 600; color: ${C.muted}; }
.eps-topic-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
@media (max-width: 760px) { .eps-topic-grid { grid-template-columns: 1fr; } }
.eps-topic {
  display: flex; align-items: center; gap: 14px; text-align: left; cursor: pointer;
  border-radius: 14px; padding: 14px 16px;
  background: linear-gradient(145deg, rgba(10,45,61,0.5), rgba(6,28,40,0.6));
  border: 1px solid ${C.hairline};
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.3s ease;
}
.eps-topic:hover:not(.is-disabled) { transform: translateY(-2px); border-color: ${C.cyan}66; box-shadow: 0 0 24px -12px ${C.cyan}80; }
.eps-topic.is-disabled { opacity: 0.55; cursor: not-allowed; }
.eps-topic-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; flex-shrink: 0; border-radius: 11px;
  background: ${C.cyan}16; border: 1px solid ${C.cyan}40; color: ${C.cyan};
}
.eps-topic-icon svg { width: 18px; height: 18px; }
.eps-topic-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.eps-topic-name { font-size: 14px; font-weight: 600; color: ${C.cloud}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.eps-topic-meta { font-size: 12px; color: ${C.muted}; }
.eps-topic-cta { display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0; font-size: 12.5px; font-weight: 700; color: ${C.mist}; }
.eps-topic-cta svg { width: 14px; height: 14px; transition: transform 0.2s ease; }
.eps-topic:hover:not(.is-disabled) .eps-topic-cta svg { transform: translateX(3px); }

/* ---- Part 2 upload / skills shell ---- */
.eps-import-panel {
  display: grid;
  grid-template-columns: minmax(0, 0.95fr) minmax(280px, 1.05fr);
  gap: clamp(14px, 2vw, 22px);
  border-radius: 18px;
  padding: clamp(18px, 2.4vw, 26px);
  background:
    radial-gradient(circle at 18% 12%, ${C.cyan}24, transparent 34%),
    linear-gradient(145deg, rgba(10,45,61,0.58), rgba(6,28,40,0.72));
  border: 1px solid ${C.hairlineStrong};
  box-shadow: 0 24px 80px -52px rgba(0,0,0,0.8), inset 0 0 42px rgba(118,228,247,0.04);
}
.eps-import-copy { display: flex; flex-direction: column; justify-content: center; gap: 12px; min-width: 0; }
.eps-import-copy .eps-soon-text { max-width: 560px; }
.eps-import-copy strong { color: ${C.mist}; font-weight: 700; }
.eps-skill-shells { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 10px; }
.eps-skill-shell {
  display: flex; align-items: center; gap: 10px; min-width: 0;
  border-radius: 13px; padding: 13px 14px;
  background: rgba(2,19,27,0.54);
  border: 1px solid ${C.hairline};
  color: ${C.body};
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.35;
}
.eps-skill-shell svg { width: 16px; height: 16px; flex-shrink: 0; color: ${C.cyan}; }
@media (max-width: 860px) {
  .eps-import-panel { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .eps-skill-shells { grid-template-columns: 1fr; }
}

/* ---- staged content creation panels ---- */
.eps-build-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(14px, 2vw, 20px);
}
.eps-build-card,
.eps-contract-card {
  border-radius: 18px;
  padding: clamp(18px, 2.4vw, 26px);
  background: linear-gradient(145deg, rgba(10,45,61,0.48), rgba(6,28,40,0.7));
  border: 1px solid ${C.hairline};
  box-shadow: 0 22px 70px -54px rgba(0,0,0,0.82);
}
.eps-build-card.is-active {
  background:
    radial-gradient(circle at 18% 0%, ${C.cyan}22, transparent 36%),
    linear-gradient(145deg, rgba(14,60,80,0.62), rgba(6,28,40,0.72));
  border-color: ${C.hairlineStrong};
}
.eps-build-kicker {
  display: inline-flex; align-items: center; gap: 7px;
  margin-bottom: 14px;
  font-size: 11px; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase;
  color: ${C.mist};
}
.eps-build-kicker svg { width: 15px; height: 15px; color: ${C.cyan}; }
.eps-build-card h2,
.eps-contract-card h2 {
  margin: 0;
  font-size: clamp(18px, 2.1vw, 24px);
  font-weight: 700;
  color: ${C.cloud};
}
.eps-build-card p {
  margin: 10px 0 0;
  font-size: 13.5px;
  line-height: 1.6;
  color: ${C.body};
}
.eps-build-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 18px;
}
.eps-build-list span {
  display: inline-flex;
  border-radius: 999px;
  padding: 6px 10px;
  background: rgba(118,228,247,0.1);
  border: 1px solid ${C.hairline};
  color: ${C.mist};
  font-size: 11.5px;
  font-weight: 700;
  line-height: 1.25;
}
.eps-contract-card {
  background:
    linear-gradient(90deg, rgba(118,228,247,0.16), transparent 44%),
    rgba(2,19,27,0.58);
}
.eps-contract-card ul {
  margin: 16px 0 0;
  padding-left: 18px;
  color: ${C.body};
  font-size: 13.5px;
  line-height: 1.7;
}
.eps-contract-card li + li { margin-top: 7px; }
@media (max-width: 820px) {
  .eps-build-grid { grid-template-columns: 1fr; }
}

/* ---- coming soon ---- */
.eps-soon {
  position: relative; overflow: hidden;
  display: flex; flex-direction: column; align-items: center; text-align: center;
  border-radius: 22px; padding: clamp(40px, 6vw, 72px) clamp(24px, 4vw, 56px);
  background: linear-gradient(150deg, rgba(14,60,80,0.55), rgba(6,28,38,0.8));
  border: 1px solid ${C.hairlineStrong};
  box-shadow: 0 40px 100px -52px rgba(0,0,0,0.78), 0 0 48px ${C.cyan}16;
}
.eps-soon-glow { position: absolute; top: -45%; left: 50%; transform: translateX(-50%); width: 70%; height: 120%; background: radial-gradient(circle, ${C.cyan}24 0%, transparent 62%); pointer-events: none; }
.eps-soon-icon {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  width: 60px; height: 60px; margin-bottom: 18px; border-radius: 16px;
  background: ${C.cyan}1a; border: 1px solid ${C.cyan}59; color: ${C.cyan}; box-shadow: 0 0 24px ${C.cyan}4d;
}
.eps-soon-icon svg { width: 28px; height: 28px; }
.eps-soon-pill {
  position: relative; display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 13px; border-radius: 999px; margin-bottom: 16px;
  font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  color: ${C.mist}; background: rgba(118,228,247,0.12); border: 1px solid ${C.hairlineStrong};
}
.eps-soon-pill svg { width: 13px; height: 13px; }
.eps-soon-title { position: relative; margin: 0; font-size: clamp(20px, 2.6vw, 28px); font-weight: 700; color: #EAF7FB; }
.eps-soon-text { position: relative; margin: 12px auto 0; max-width: 560px; font-size: 14.5px; line-height: 1.7; color: ${C.body}; }
`;
