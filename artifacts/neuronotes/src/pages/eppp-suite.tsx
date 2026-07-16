import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { UserButton } from "@clerk/clerk-react";
import {
  GraduationCap,
  Layers,
  Stethoscope,
  ClipboardCheck,
  ClipboardList,
  XCircle,
  BookOpen,
  Zap,
  BarChart3,
  Library,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Brain,
  Atom,
  Users,
  Baby,
  Scale,
  CheckCircle2,
  Lock,
  Sparkles,
  Printer,
  NotebookPen,
  Lightbulb,
  Trash2,
  Save,
} from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import {
  useGetTopics,
  useGetEpppMissedQuestions,
  getCourseMasteryStatus,
  getGetCourseMasteryStatusQueryKey,
  type Topic,
  type CourseMasteryStatus,
  type EpppMissedQuestion,
} from "@workspace/api-client-react";
import { STUDY_PALETTE } from "@/lib/study-theme";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEntitlements } from "@/lib/use-entitlements";
import UpgradePrompt from "@/components/upgrade-prompt";
import { NotificationsBell } from "@/components/notifications-bell";
import { cn } from "@/lib/utils";
import { PP, alpha } from "@/lib/palette";
import {
  groupEpppClinicalCases,
  groupEpppTopicsByCategory,
  getEpppClinicalCaseDomain,
  getEpppClinicalCasePart,
  getEpppDisplayCategory,
  getEpppExamPart,
  getEpppFullLengthExamPart,
  getEpppQuickReferenceGuides,
  isEpppClinicalCase,
  isEpppFullLengthExam,
  isEpppKnowledgeTopic,
  isEpppPart2Topic,
  isEpppTopic,
  type EpppExamPart,
} from "@/lib/eppp-content";
import { epppDomainAnchor, epppDomainSlug, epppMasteryExamPath, epppTopicModePath, epppTopicPath } from "@/lib/eppp-routes";
import { knowledgeDomainIcon } from "@/lib/eppp-icons";
import {
  listAllReflections,
  deleteReflection,
  type ReflectionRecord,
} from "@/lib/reflections";
import EpppDashboardPage from "@/pages/eppp-dashboard";
import { ResourcesContent } from "@/pages/resources";

// ---------------------------------------------------------------------------
// EPPP Mastery Suite — a dedicated, EPPP-only workspace with its own left-column
// navigation that replaces the main app sidebar while inside the
// Suite. Reached from the glowing "EPPP Mastery Suite" button in the top
// header. Styled congruently with the main dashboard/app (same dark-glass
// sidebar, smoke backdrop, nav-glass pills, locked cerulean text-dim — no mint).
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
  cyan: PP.cyan,
  mist: PP.textDim,
  cloud: PP.text,
  ink: PP.deep,
  hairline: alpha(PP.ocean, 0.16),
  hairlineStrong: alpha(PP.cyan, 0.32),
  body: alpha(PP.text, 0.84),
  muted: alpha(PP.gray178, 0.66),
};

type TabSlug =
  | "study-plan"
  | "domains"
  | "part-2-skills"
  | "clinical-cases"
  | "domain-mastery-exams"
  | "full-length-exams"
  | "missed-questions"
  | "rapid-review"
  | "reflections"
  | "my-notes"
  | "performance-analytics"
  | "resources";

type TabDef = {
  slug: TabSlug;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  section?: string;
};

// Exact order requested by the owner: Dashboard sits at the top, then the
// learning lanes, assessments, review, reference, and the planning placeholder.
const TABS: TabDef[] = [
  { slug: "performance-analytics", label: "Dashboard", icon: BarChart3, section: "Overview" },
  { slug: "domains", label: "Part 1: Knowledge", icon: Layers, section: "Learn" },
  { slug: "part-2-skills", label: "Part 2: Skills", icon: Brain, section: "Learn" },
  { slug: "clinical-cases", label: "Clinical Integrated Cases", icon: Stethoscope, section: "Learn" },
  { slug: "domain-mastery-exams", label: "Domain Mastery Exams", icon: GraduationCap, section: "Assess" },
  { slug: "full-length-exams", label: "Full-Length Exams", icon: ClipboardCheck, section: "Assess" },
  { slug: "missed-questions", label: "Missed Questions", icon: XCircle, section: "Review" },
  { slug: "rapid-review", label: "Quick Reference Guide", icon: Zap, section: "Review" },
  { slug: "reflections", label: "Reflections", icon: Lightbulb, section: "Journal" },
  { slug: "my-notes", label: "My Notes", icon: NotebookPen, section: "Journal" },
  { slug: "resources", label: "Resources", icon: Library, section: "Reference" },
  { slug: "study-plan", label: "Study Plan", icon: ClipboardList, section: "Plan" },
];

const DEFAULT_TAB: TabSlug = "performance-analytics";

// Edge-fade mask for the sidebar brain artwork so it melts into the smoky
// column backdrop instead of reading as a hard rectangle.

// Question Bank reaches Part 1 via a legacy deep-link (it was retired as a
// sub-tab and now opens the Knowledge rail). Clinical Integration Cases is now
// its own top-level tab ("clinical-cases"), and Rapid Review / Quick Reference
// Guides are a dedicated top-level tab too — neither is a Part 1 sub-tab.
const MOVED_INTO_PART1: Record<string, TabSlug> = {
  "question-bank": "domains",
};

// Legacy deep-link aliases — the combined "Reflections & My Notes" tab was
// split into two separate top-level tabs. Old links land on Reflections.
const LEGACY_TAB_ALIASES: Record<string, TabSlug> = {
  "reflections-notes": "reflections",
};

// Reuse the main-app sidebar pill recipe (classes defined in index.css).
const NAV_ITEM_BASE =
  "nav-glass group relative flex items-center gap-2.5 px-3 py-2 rounded-[8px] cursor-pointer transition-all duration-200 ease-in-out border ";
const NAV_ITEM_IDLE = "nav-glass-idle eps-nav-item-idle";
const NAV_ITEM_ACTIVE = "nav-glass-active eps-nav-item-active";

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

function useEpppDomains(part: "part1" | "part2" = "part1") {
  const { allTopics, topicsLoading } = useEpppTopics(part);

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
  const { data: entitlements, isLoading: entLoading } = useEntitlements();
  const epppUnlocked = !!entitlements?.epppAccess;

  // EPPP Mastery Suite is a SEPARATE access level. Gate the whole suite behind
  // EPPP access (admins are included via computeEpppAccess on the server). Show
  // a neutral loader while entitlements resolve so non-buyers never glimpse the
  // suite content before the lock screen renders.
  if (entLoading) {
    return (
      <div
        className="study-page-bg flex min-h-screen items-center justify-center"
        data-testid="eppp-suite-loading"
      >
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }
  if (!epppUnlocked) {
    return (
      <div
        className="study-page-bg flex min-h-screen items-center justify-center"
        data-testid="eppp-suite-locked"
      >
        <style>{styles}</style>
        <UpgradePrompt reason="eppp" onDismiss={() => navigate("/dashboard")} />
      </div>
    );
  }

  const requestedTab = tab
    ? MOVED_INTO_PART1[tab] ?? LEGACY_TAB_ALIASES[tab] ?? tab
    : tab;
  const activeSlug: TabSlug = TABS.some((t) => t.slug === requestedTab)
    ? (requestedTab as TabSlug)
    : DEFAULT_TAB;
  // The big centered "EPPP Mastery Suite" wordmark + laser beam is shown only on
  // the suite's Dashboard tab, mirroring the main-site dashboard hero.
  const isEpppDash = activeSlug === "performance-analytics";

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
          background: `hsl(var(--surf-hue) var(--surf-sat) 6% / 0.66)`,
          backgroundSize: "cover, cover",
          backgroundPosition: "center, center",
          backgroundRepeat: "no-repeat, no-repeat",
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
            background: "transparent",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -top-16 -right-12 w-56 h-56 rounded-full blur-3xl"
          style={{ background: `transparent` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -left-12 w-56 h-56 rounded-full blur-3xl"
          style={{ background: `transparent` }}
        />

        {/* Brand header — plain wordmark (black-foundation reset). The mobile
            close control overlays the top-right. */}
        <div className="relative px-3 pt-5 pb-3">
          <p
            className="text-center font-light"
            style={{ letterSpacing: "0.32em", textIndent: "0.32em", fontSize: "15px", color: C.cloud }}
            data-testid="eppp-sidebar-wordmark"
          >
            EPPP SUITE
          </p>
          <button
            className="md:hidden absolute top-3 right-3 text-white/80"
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

        {/* Back to PsychPro — moved out of the top bar (owner, 2026-07-09:
            the header button was throwing off the page-title spacing) into a
            fixed slot at the bottom of the suite sidebar. */}
        <div className="relative px-3 pb-3">
          <Link
            href="/dashboard"
            className="eppp-launch-btn eppp-launch-btn--sidebar"
            data-testid="eppp-suite-back-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="eppp-launch-btn__inner">
              <ArrowLeft aria-hidden />
              <span>Back to PsychPro</span>
            </span>
          </Link>
        </div>
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
        <header
          className={cn(
            "relative hidden md:flex justify-end gap-3 px-6",
            isEpppDash ? "items-start pt-3 pb-3 min-h-[116px]" : "items-center py-3",
          )}
        >
          {/* Dashboard-only hero wordmark — a large centered "EPPP MASTERY
              SUITE" title wrapped in a soft cyan halo glow-bloom (no underline),
              filling the open space between the sidebar and the right-side
              control cluster. pointer-events-none so it never blocks the
              controls. Other suite tabs keep a clean top bar. */}
          {isEpppDash && (
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center pr-[clamp(96px,9vw,140px)]"
            >
              <span
                className="relative font-light whitespace-nowrap"
                style={{
                  fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
                  fontSize: "clamp(34px, 3.6vw, 50px)",
                  letterSpacing: "0.24em",
                  textIndent: "0.24em",
                  color: C.cloud,
                  textShadow: "0 1px 14px rgba(var(--pp-black-rgb),0.5)",
                }}
                data-testid="eppp-topbar-wordmark"
              >
                EPPP MASTERY SUITE
              </span>
              {/* Signal-beam underline — a crisp tapered beam with a soft
                  underglow pool and a luminous center node. Impactful but
                  restrained. */}
              <span
                aria-hidden
                className="relative flex items-center justify-center"
                style={{ marginTop: "16px", width: "min(540px, 66%)", height: "16px" }}
              >
                <span
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    background: "rgba(var(--pp-bright-rgb),0)",
                    filter: "blur(4px)",
                  }}
                />
                <span
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "1.5px",
                    borderRadius: "9999px",
                    background: "rgba(var(--pp-bright-rgb),0)",
                  }}
                />
              </span>
            </div>
          )}
          <div className="flex items-center gap-3">
            {!isMobile && <NotificationsBell />}
            <UserButton
              afterSignOutUrl={import.meta.env.BASE_URL.replace(/\/$/, "") || "/"}
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10 rounded-full ring-1 eps-avatar-ring",
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
      return <Part1Panel onNavigate={onNavigate} />;
    case "part-2-skills":
      return <Part2SkillsPanel onNavigate={onNavigate} />;
    case "clinical-cases":
      return <ClinicalCasesPanel onNavigate={onNavigate} />;
    case "domain-mastery-exams":
      return <DomainMasteryExamsPanel onNavigate={onNavigate} />;
    case "rapid-review":
      return <RapidReviewPanel onNavigate={onNavigate} />;
    case "reflections":
      return <ReflectionsPanel />;
    case "my-notes":
      return <MyNotesPanel />;
    case "study-plan":
      return (
        <ComingSoonPanel
          eyebrow="PLAN"
          title="Study Plan"
          icon={ClipboardList}
          description="A personalized, date-aware study schedule that sequences domains and lessons toward your exam date — so you always know what to study next."
        />
      );
    case "full-length-exams":
      return <FullLengthExamsPanel onNavigate={onNavigate} />;
    case "missed-questions":
      return <MissedQuestionsPanel onNavigate={onNavigate} />;
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
    <header className="eps-head text-scrim">
      <p className="eps-eyebrow">{eyebrow}</p>
      <h1 className="eps-title">{title}</h1>
      <p className="eps-sub">{subtitle}</p>
    </header>
  );
}

// ---- Part 1: Knowledge (sub-tab body) -------------------------------------
// Knowledge sub-tab — mirrors the main-site Courses page: a left rail of every
// EPPP content domain and a right pane showing the selected domain's lessons as
// cards. Default-selects the first domain; lessons open their topic page.
function KnowledgeBody({
  onNavigate,
  part = "part1",
}: {
  onNavigate: (to: string) => void;
  part?: "part1" | "part2";
}) {
  const { allTopics, topicsLoading, domainStats, domainsLoading } =
    useEpppDomains(part);

  const groups = useMemo(
    () => groupEpppTopicsByCategory(allTopics),
    [allTopics],
  );
  const statByName = useMemo(() => {
    const map = new Map<string, DomainStat>();
    for (const stat of domainStats) map.set(stat.category, stat);
    return map;
  }, [domainStats]);

  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  // Honor a `#<domain-slug>` anchor (from epppDomainAnchor) so deep links and
  // "back to domain" links open the matching domain in the rail.
  const selectDomainFromHash = useMemo(
    () => (slug: string) => {
      if (!slug) return;
      const match = groups.find((g) => epppDomainSlug(g.name) === slug);
      if (match) setActiveDomain(match.name);
    },
    [groups],
  );

  // Apply the initial hash once topics have loaded (deep link / full reload).
  // One-shot so a later topics refetch or a manual rail click isn't overridden.
  const initialHashApplied = useRef(false);
  useEffect(() => {
    if (initialHashApplied.current || typeof window === "undefined") return;
    if (groups.length === 0) return;
    selectDomainFromHash(window.location.hash.replace(/^#/, ""));
    initialHashApplied.current = true;
  }, [groups, selectDomainFromHash]);

  // React to genuine hash changes (browser back/forward, edited URL). These
  // don't fire on manual rail clicks, which never touch the URL hash.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onHashChange = () =>
      selectDomainFromHash(window.location.hash.replace(/^#/, ""));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [selectDomainFromHash]);

  const activeName =
    activeDomain && groups.some((g) => g.name === activeDomain)
      ? activeDomain
      : (groups[0]?.name ?? null);
  const activeGroup = groups.find((g) => g.name === activeName) ?? null;
  const masteredCount = domainStats.filter((d) => d.mastered).length;

  if (topicsLoading && groups.length === 0) {
    return <div className="mat-glass eps-empty">Loading your domains…</div>;
  }
  if (groups.length === 0) {
    return <div className="mat-glass eps-empty">No EPPP domains are available yet.</div>;
  }

  return (
    <>
      <div className="eps-section-head">
        <span className="eps-section-meta">
          {masteredCount}/{groups.length} mastered
        </span>
      </div>

      <div className="eps-kb-grid">
        <aside className="mat-opaque eps-kb-rail" aria-label="EPPP content domains">
          {groups.map((group) => {
            const stat = statByName.get(group.name);
            const Icon = knowledgeDomainIcon(group.name);
            const isActive = group.name === activeName;
            const pct = stat?.pct ?? 0;
            const mastered = !!stat?.mastered;
            return (
              <button
                key={group.name}
                type="button"
                aria-pressed={isActive}
                className={cn("mat-glass mat-glass-interactive eps-kb-rail-item", isActive && "is-active")}
                onClick={() => setActiveDomain(group.name)}
                data-testid={`eppp-knowledge-rail-${slugify(group.name)}`}
              >
                <span className="mat-icon-well eps-kb-rail-icon">
                  <Icon aria-hidden />
                </span>
                <span className="eps-kb-rail-text">
                  <span className="eps-kb-rail-name">{group.name}</span>
                  <span className="eps-kb-rail-meta">
                    {group.items.length}{" "}
                    {group.items.length === 1 ? "lesson" : "lessons"}
                  </span>
                  <span className="eps-kb-rail-bar">
                    {domainsLoading ? (
                      <span className="eps-kb-rail-bar-fill is-idle" />
                    ) : (
                      <span
                        className="eps-kb-rail-bar-fill"
                        style={{ width: `${pct}%` }}
                      />
                    )}
                  </span>
                </span>
                <span className="eps-kb-rail-aside">
                  {mastered ? (
                    <CheckCircle2
                      aria-label="Mastered"
                      className="eps-kb-rail-check"
                    />
                  ) : domainsLoading ? null : (
                    <span className="eps-kb-rail-pct">{pct}%</span>
                  )}
                </span>
              </button>
            );
          })}
        </aside>

        <div className="eps-kb-content">
          {activeGroup && (
            <KnowledgeDomainPane
              group={activeGroup}
              stat={statByName.get(activeGroup.name)}
              onNavigate={onNavigate}
            />
          )}
        </div>
      </div>
    </>
  );
}

function KnowledgeDomainPane({
  group,
  stat,
  onNavigate,
}: {
  group: { name: string; items: Topic[] };
  stat?: DomainStat;
  onNavigate: (to: string) => void;
}) {
  const Icon = knowledgeDomainIcon(group.name);
  return (
    <div data-testid={`eppp-knowledge-pane-${slugify(group.name)}`}>
      <div className="eps-kb-head">
        <span className="mat-icon-well eps-kb-head-icon">
          <Icon aria-hidden />
        </span>
        <div className="eps-kb-head-text">
          <h2 className="eps-kb-head-name">{group.name}</h2>
          <p className="eps-kb-head-meta">
            {group.items.length}{" "}
            {group.items.length === 1 ? "lesson" : "lessons"}
            {stat?.mastered ? " · Mastered" : ""}
          </p>
        </div>
      </div>

      {group.items.length === 0 ? (
        <div className="mat-glass eps-empty">No lessons in this domain yet.</div>
      ) : (
        <div className="eps-kb-lessons">
          {group.items.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className="mat-glass mat-glass-interactive eps-kb-lesson"
              onClick={() => onNavigate(epppTopicPath(topic.id))}
              data-testid={`eppp-knowledge-lesson-${topic.id}`}
            >
              <span className="mat-icon-well eps-kb-lesson-icon">
                <BookOpen aria-hidden />
              </span>
              <span className="eps-kb-lesson-body">
                <span className="eps-kb-lesson-title">{topic.name}</span>
                {topic.description && (
                  <span className="eps-kb-lesson-desc">{topic.description}</span>
                )}
                <span className="eps-kb-lesson-meta">
                  {topic.flashcardCount ?? 0} cards · {topic.quizCount ?? 0}{" "}
                  questions
                </span>
              </span>
              <ArrowRight aria-hidden className="eps-kb-lesson-arrow" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Domain Mastery Exams -------------------------------------------------
// Part 1 (8 knowledge domains) and Part 2 (6 skill domains) each get a sub-tab.
// Every domain's 100-question capstone exam unlocks once all of its lessons are
// passed at 90%+; mirrors the Knowledge rail's per-part domain set.
function DomainMasteryBody({
  part,
  onNavigate,
}: {
  part: EpppExamPart;
  onNavigate: (to: string) => void;
}) {
  const { domainStats, domainsLoading } = useEpppDomains(part);
  const masteredCount = domainStats.filter((d) => d.mastered).length;

  return (
    <>
      <div className="eps-section-head">
        <span className="eps-section-meta">
          {domainStats.length === 0
            ? "Loading…"
            : `${masteredCount}/${domainStats.length} mastered`}
        </span>
      </div>

      {domainStats.length === 0 ? (
        <div className="mat-glass eps-empty">Loading your domains…</div>
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
                className={cn("mat-opaque eps-exam-row", `is-${state}`)}
                data-testid={`eppp-mastery-${slugify(d.category)}`}
              >
                <span className="mat-icon-well eps-exam-icon">
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
                        ? "Ready to sit · up to 100 questions"
                        : domainsLoading
                          ? "Checking progress…"
                          : `${d.passed}/${d.total} lessons passed · 90%+ each to unlock`}
                  </span>
                </div>
                {state === "locked" ? (
                  <button
                    className="eppp-launch-btn eps-exam-cta eps-exam-cta--ghost"
                    onClick={() => onNavigate(epppDomainAnchor(d.category))}
                    data-testid={`eppp-mastery-study-${slugify(d.category)}`}
                  >
                    Study lessons <ArrowRight aria-hidden />
                  </button>
                ) : (
                  <button
                    className="eppp-launch-btn eps-exam-cta"
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
    </>
  );
}

const MASTERY_SUBTABS: { key: EpppExamPart; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "part1", label: "Part 1: Knowledge", icon: Layers },
  { key: "part2", label: "Part 2: Skills", icon: Brain },
];

function DomainMasteryExamsPanel({ onNavigate }: { onNavigate: (to: string) => void }) {
  const [part, setPart] = useState<EpppExamPart>("part1");

  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-mastery-exams">
      <div className="eps-shell">
        <PanelHead
          eyebrow="PROVE MASTERY"
          title="Domain Mastery Exams"
          subtitle="Capstone exams (up to 100 questions) unlock once you've passed every lesson in a content area at 90%+. Pass the exam at 90%+ to master the domain."
        />

        <div className="eps-subtabs" role="tablist" aria-label="Exam parts">
          {MASTERY_SUBTABS.map((t) => {
            const isActive = t.key === part;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={cn("eppp-launch-btn eps-subtab", isActive && "is-active")}
                onClick={() => setPart(t.key)}
                data-testid={`eppp-mastery-subtab-${t.key}`}
              >
                <t.icon aria-hidden />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <DomainMasteryBody key={part} part={part} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

// ---- Part 2 Skills --------------------------------------------------------
// Mirrors Part 1 exactly: a left rail of the six EPPP Part 2 skill domains and
// a right pane of that domain's lessons. Each lesson opens its topic page with
// the same flashcards / quiz / study-guide / practice-exam modes as Part 1.
function Part2SkillsPanel({ onNavigate }: { onNavigate: (to: string) => void }) {
  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-part-2-skills">
      <div className="eps-shell">
        <PanelHead
          eyebrow="APPLIED SKILLS"
          title="Part 2: Skills"
          subtitle="The applied EPPP skill domains. Open a domain to work through its lessons — each lesson has flashcards, a quiz, a study guide, and a practice exam."
        />
        <KnowledgeBody onNavigate={onNavigate} part="part2" />
      </div>
    </div>
  );
}

// ---- Clinical Integration Cases (sub-tab body) ----------------------------
function ClinicalCasesBody({ part, onNavigate }: { part: EpppExamPart; onNavigate: (to: string) => void }) {
  const { data: allTopics, isLoading } = useGetTopics();

  const grouped = useMemo(() => {
    const inPart = ((allTopics ?? []) as Topic[]).filter(
      (t) => isEpppClinicalCase(t) && getEpppClinicalCasePart(t) === part,
    );
    return groupEpppClinicalCases(inPart).map(
      (group) => [group.name, group.items] as const,
    );
  }, [allTopics, part]);

  if (isLoading) {
    return <div className="mat-glass eps-empty">Loading cases…</div>;
  }
  if (grouped.length === 0) {
    return (
      <div className="mat-glass eps-empty">
        No {part === "part1" ? "Part 1" : "Part 2"} clinical integration cases are available yet.
      </div>
    );
  }
  return (
    <div className="eps-groups">
      {grouped.map(([domain, cases]) => (
        <section key={domain} className="eps-group">
          <div className="eps-group-head">
            <Stethoscope className="eps-group-icon" aria-hidden />
            <h2 className="eps-group-title">{domain}</h2>
            <span className="eps-group-count">{cases.length} cases</span>
          </div>
          <div className="eps-topic-grid">
            {cases.map((t) => {
              const questionCount = t.quizCount ?? 0;
              return (
                <button
                  key={t.id}
                  className="mat-glass mat-glass-interactive eps-topic"
                  onClick={() => onNavigate(epppTopicModePath(t.id, "study-guide"))}
                  data-testid={`eppp-clinical-case-${t.id}`}
                >
                  <span className="mat-icon-well eps-topic-icon">
                    <Stethoscope aria-hidden />
                  </span>
                  <span className="eps-topic-body">
                    <span className="eps-topic-name">{t.name}</span>
                    <span className="eps-topic-meta">
                      {questionCount > 0
                        ? `${questionCount} integrated questions`
                        : "Case study"}
                    </span>
                  </span>
                  <span className="eps-topic-cta">
                    Open case <ArrowRight aria-hidden />
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

// ---- Part 1 shell (Knowledge only — Clinical Cases is its own top-level tab)
function Part1Panel({ onNavigate }: { onNavigate: (to: string) => void }) {
  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-domains">
      <div className="eps-shell">
        <PanelHead
          eyebrow="CONTENT AREAS"
          title="Part 1: Knowledge"
          subtitle="Your progress across every EPPP content area. Open a domain to work through its lessons — each lesson has flashcards, a quiz, a study guide, and a practice exam."
        />
        <KnowledgeBody onNavigate={onNavigate} />
      </div>
    </div>
  );
}

// ---- Clinical Integration Cases (top-level tab) ---------------------------
const CLINICAL_CASE_SUBTABS: { key: EpppExamPart; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: "part1", label: "Part 1", icon: Layers },
  { key: "part2", label: "Part 2", icon: Brain },
];

function ClinicalCasesPanel({ onNavigate }: { onNavigate: (to: string) => void }) {
  const [part, setPart] = useState<EpppExamPart>("part1");

  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-clinical-cases">
      <div className="eps-shell">
        <PanelHead
          eyebrow="APPLY"
          title="Clinical Integration Cases"
          subtitle="Realistic clinical scenarios that put core EPPP concepts into practice. Work the case, then answer the integrated questions to test your reasoning."
        />

        <div className="eps-subtabs eps-subtabs--center" role="tablist" aria-label="Case parts">
          {CLINICAL_CASE_SUBTABS.map((t) => {
            const isActive = t.key === part;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={cn("eppp-launch-btn eps-subtab", isActive && "is-active")}
                onClick={() => setPart(t.key)}
                data-testid={`eppp-clinical-subtab-${t.key}`}
              >
                <t.icon aria-hidden />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        <ClinicalCasesBody key={part} part={part} onNavigate={onNavigate} />
      </div>
    </div>
  );
}

// ---- Resources ------------------------------------------------------------
function EpppResourcesPanel() {
  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-resources">
      <div className="eps-shell">
        <PanelHead
          eyebrow="REFERENCE"
          title="Resources"
          subtitle="The primary sources, clinical frameworks, and research databases that inform PsychPro's study content. All links open in a new tab."
        />
        <div data-testid="eppp-resources-contained">
          <ResourcesContent />
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
        <div className="mat-opaque eps-soon" data-testid="eppp-coming-soon">
          <div className="eps-soon-glow" aria-hidden />
          <span className="mat-icon-well eps-soon-icon">
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

// ---- Full-Length Exams ----------------------------------------------------
// One timed, full-length simulation per part. Launches the practice-exam runner
// in `?full=1` mode, which serves every question in the exam topic under a timer.
function FullLengthExamsPanel({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { data: allTopics, isLoading } = useGetTopics();
  const [part, setPart] = useState<EpppExamPart>("part1");

  const examByPart = useMemo(() => {
    const map: Record<EpppExamPart, Topic | null> = { part1: null, part2: null };
    for (const t of (allTopics ?? []) as Topic[]) {
      const p = getEpppFullLengthExamPart(t);
      if (p && !map[p]) map[p] = t;
    }
    return map;
  }, [allTopics]);

  const exam = examByPart[part];

  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-full-length-exams">
      <div className="eps-shell">
        <PanelHead
          eyebrow="EXAM SIMULATION"
          title="Full-Length Exams"
          subtitle="Sit a complete, timed EPPP simulation end-to-end. Build the stamina and pacing the real exam demands."
        />

        <div className="eps-subtabs eps-subtabs--center" role="tablist" aria-label="Exam parts">
          {MASTERY_SUBTABS.map((t) => {
            const isActive = t.key === part;
            return (
              <button
                key={t.key}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={cn("eppp-launch-btn eps-subtab", isActive && "is-active")}
                onClick={() => setPart(t.key)}
                data-testid={`eppp-full-length-subtab-${t.key}`}
              >
                <t.icon aria-hidden />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {isLoading ? (
          <div className="mat-glass eps-empty">Loading exam…</div>
        ) : !exam ? (
          <div className="mat-glass eps-empty">
            The {part === "part1" ? "Part 1" : "Part 2"} full-length exam isn't available yet.
          </div>
        ) : (
          <div className="mat-opaque eps-fl-card" data-testid={`eppp-full-length-${part}`}>
            <div className="eps-fl-head">
              <span className="mat-icon-well eps-fl-icon">
                <ClipboardCheck aria-hidden />
              </span>
              <div className="eps-fl-head-text">
                <h2 className="eps-fl-title">{exam.name}</h2>
                <p className="eps-fl-meta">
                  {exam.quizCount ?? 0} questions · timed simulation
                </p>
              </div>
            </div>
            <button
              className="eps-fl-cta btn-glass-strong"
              onClick={() => onNavigate(`${epppTopicModePath(exam.id, "exam")}?full=1`)}
              data-testid={`eppp-full-length-start-${part}`}
            >
              Start full-length exam <ArrowRight aria-hidden />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ---- Rapid Review (Quick Reference Guides) --------------------------------
// The consolidated Quick Reference Guides (one per Part 1 domain), printable,
// plus a write-in "My Notes" scratchpad persisted locally on the device.
const RAPID_REVIEW_NOTES_KEY = "eppp:rapid-review:my-notes";

type SavedNote = { id: string; text: string; savedAt: number };

// Saved notes are persisted locally as a JSON array. Older builds stored a
// single free-text scratchpad string under the same key, so we migrate that
// into one saved note on first read.
function loadSavedNotes(): SavedNote[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(RAPID_REVIEW_NOTES_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed
        .filter(
          (n): n is SavedNote =>
            !!n && typeof n.id === "string" && typeof n.text === "string",
        )
        .map((n) => ({
          ...n,
          savedAt: typeof n.savedAt === "number" ? n.savedAt : Date.now(),
        }));
    }
  } catch {
    // Legacy single-string scratchpad — fall through to migration below.
  }
  if (!raw.trim()) return [];
  // Legacy single-string scratchpad: migrate it into one saved note and
  // persist the JSON-array format so we only ever do this conversion once.
  const migrated: SavedNote[] = [
    { id: `legacy-${Date.now()}`, text: raw, savedAt: Date.now() },
  ];
  persistSavedNotes(migrated);
  return migrated;
}

function persistSavedNotes(notes: SavedNote[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(RAPID_REVIEW_NOTES_KEY, JSON.stringify(notes));
}

// A private note-taking scratchpad: write a note, Save it, and it is stored on
// this device and listed right below the box. Shared by the Quick Reference
// Guides tab and the standalone My Notes tab.
function MyNotesScratchpad() {
  const [draft, setDraft] = useState("");
  const [notes, setNotes] = useState<SavedNote[]>([]);

  useEffect(() => {
    setNotes(loadSavedNotes());
  }, []);

  const persist = (next: SavedNote[]) => {
    setNotes(next);
    persistSavedNotes(next);
  };

  const handleSave = () => {
    const text = draft.trim();
    if (!text) return;
    persist([
      {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text,
        savedAt: Date.now(),
      },
      ...notes,
    ]);
    setDraft("");
  };

  const handleDelete = (id: string) => persist(notes.filter((n) => n.id !== id));

  return (
    <section className="mat-opaque eps-notes" data-testid="eppp-my-notes">
      <div className="eps-notes-head">
        <span className="mat-icon-well eps-notes-icon">
          <NotebookPen aria-hidden />
        </span>
        <div>
          <h2 className="eps-notes-title">My Notes</h2>
          <p className="eps-notes-sub">Write down thoughts for now and later recall</p>
        </div>
      </div>
      <textarea
        className="eps-notes-area"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Jot down mnemonics, formulas, and the facts you keep forgetting…"
        data-testid="eppp-my-notes-input"
      />
      <div className="eps-notes-actions">
        <button
          className="eps-save-btn"
          onClick={handleSave}
          disabled={!draft.trim()}
          data-testid="eppp-my-notes-save"
        >
          <Save aria-hidden /> Save note
        </button>
      </div>
      {notes.length > 0 && (
        <div className="eps-notes-saved" data-testid="eppp-my-notes-saved">
          {notes.map((n) => (
            <article key={n.id} className="mat-glass eps-note-card" data-testid={`eppp-my-note-${n.id}`}>
              <p className="eps-note-text">{n.text}</p>
              <div className="eps-note-foot">
                <span className="eps-note-date">
                  {new Date(n.savedAt).toLocaleDateString(undefined, {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <button
                  className="eppp-launch-btn eps-ghost-btn"
                  onClick={() => handleDelete(n.id)}
                  data-testid={`eppp-my-note-delete-${n.id}`}
                >
                  <Trash2 aria-hidden /> Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function RapidReviewPanel({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { data: allTopics, isLoading } = useGetTopics();
  const guides = useMemo(
    () => getEpppQuickReferenceGuides((allTopics ?? []) as Topic[]),
    [allTopics],
  );

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    const w = window.open("", "_blank", "width=820,height=900");
    if (!w) return;
    const esc = (s: string) =>
      s.replace(/[&<>]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[ch] as string));
    const list = guides.map((g) => `<li>${esc(g.name)}</li>`).join("");
    const savedNotes = loadSavedNotes();
    const notesHtml = savedNotes.length
      ? savedNotes.map((n) => `<div class="notes">${esc(n.text)}</div>`).join("")
      : `<div class="notes"></div>`;
    w.document.write(
      `<!doctype html><html><head><title>EPPP Quick Reference Guides</title>` +
        `<style>body{font-family:Georgia,serif;margin:40px;color:${PP.printInk};line-height:1.55}` +
        `h1{font-size:22px}h2{font-size:16px;margin-top:28px}ul{padding-left:20px}` +
        `.notes{white-space:pre-wrap;border:1px solid ${PP.printBorder};border-radius:8px;padding:16px;min-height:80px;margin-bottom:10px}` +
        `</style></head><body><h1>EPPP Quick Reference Guides</h1>` +
        `<h2>Quick Reference Guides</h2><ul>${list}</ul>` +
        `<h2>My Notes</h2>${notesHtml}</body></html>`,
    );
    w.document.close();
    w.focus();
    w.print();
  };

  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-rapid-review">
      <div className="eps-shell">
        <PanelHead
          eyebrow="FINAL PASS"
          title="Quick Reference Guides"
          subtitle="Consolidated Quick Reference Guides — one per Part 1 domain. Skim, print, and capture your own high-yield notes before exam day."
        />

        <div className="eps-section-head eps-section-head--split">
          <span className="eps-section-meta">
            {isLoading
              ? "Loading…"
              : `${guides.length} quick reference ${guides.length === 1 ? "guide" : "guides"}`}
          </span>
          <button className="eppp-launch-btn eps-ghost-btn" onClick={handlePrint} data-testid="eppp-rapid-review-print">
            <Printer aria-hidden /> Print
          </button>
        </div>

        {isLoading ? (
          <div className="mat-glass eps-empty">Loading review sheets…</div>
        ) : guides.length === 0 ? (
          <div className="mat-glass eps-empty">No quick reference guides are available yet.</div>
        ) : (
          <div className="eps-topic-grid">
            {guides.map((t) => (
              <button
                key={t.id}
                className="mat-glass mat-glass-interactive eps-topic"
                onClick={() => onNavigate(epppTopicModePath(t.id, "study-guide"))}
                data-testid={`eppp-quick-reference-${t.id}`}
              >
                <span className="mat-icon-well eps-topic-icon">
                  <Zap aria-hidden />
                </span>
                <span className="eps-topic-body">
                  <span className="eps-topic-name">{t.name}</span>
                  <span className="eps-topic-meta">Quick reference guide</span>
                </span>
                <span className="eps-topic-cta">
                  Open <ArrowRight aria-hidden />
                </span>
              </button>
            ))}
          </div>
        )}

        <MyNotesScratchpad />
      </div>
    </div>
  );
}

// ---- Reflections ----------------------------------------------------------
// A device-local journal of every "Lock it in" reflection saved during quizzes
// (from @/lib/reflections). Nothing here is sent to a server.
function ReflectionsPanel() {
  const { data: allTopics } = useGetTopics();
  const topicNameById = useMemo(() => {
    const m = new Map<number, string>();
    ((allTopics ?? []) as Topic[]).forEach((t) => m.set(t.id, t.name));
    return m;
  }, [allTopics]);

  const [reflections, setReflections] = useState<ReflectionRecord[]>([]);
  // Avoid a flash of the empty state before localStorage is read on mount.
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setReflections(listAllReflections());
    setHydrated(true);
  }, []);

  const handleDeleteReflection = (topicId: number, questionId: number) => {
    deleteReflection(topicId, questionId);
    setReflections(listAllReflections());
  };

  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-reflections">
      <div className="eps-shell">
        <PanelHead
          eyebrow="JOURNAL"
          title="Reflections"
          subtitle="Every “Lock it in” reflection you've saved during quizzes. These live on this device only — never sent to a server."
        />

        <div className="eps-section-head">
          <span className="eps-section-meta">
            {!hydrated
              ? "Loading…"
              : `${reflections.length} saved ${reflections.length === 1 ? "reflection" : "reflections"}`}
          </span>
        </div>

        {!hydrated ? (
          <div className="mat-glass eps-empty">Loading your reflections…</div>
        ) : reflections.length === 0 ? (
          <div className="mat-glass eps-empty">
            No reflections yet. When you miss a quiz question, write a one-sentence
            “why” in the Reflect box and tap “Lock it in” — your saved reflections
            collect here.
          </div>
        ) : (
          <div className="eps-mq-list">
            {reflections.map((r) => (
              <article
                key={`${r.topicId}-${r.questionId}`}
                className="mat-opaque eps-mq-card"
                data-testid={`eppp-reflection-${r.topicId}-${r.questionId}`}
              >
                <div className="eps-mq-tags">
                  <span className="eps-mq-tag is-domain">
                    {topicNameById.get(r.topicId) ?? `Topic #${r.topicId}`}
                  </span>
                  {r.savedAt && (
                    <span className="eps-mq-tag">
                      {new Date(r.savedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
                {r.questionText && <p className="eps-mq-q">{r.questionText}</p>}
                {r.correctText && (
                  <p className="eps-mq-explain">
                    <strong>Correct ({r.correctAnswer}):</strong> {r.correctText}
                  </p>
                )}
                <p className="eps-reflection-note">{r.text}</p>
                <div className="eps-mq-actions">
                  <button
                    className="eppp-launch-btn eps-ghost-btn"
                    onClick={() => handleDeleteReflection(r.topicId, r.questionId)}
                    data-testid={`eppp-reflection-delete-${r.topicId}-${r.questionId}`}
                  >
                    <Trash2 aria-hidden /> Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ---- My Notes -------------------------------------------------------------
// A private note-taking scratchpad persisted locally on the device. Shares its
// storage key with the Quick Reference Guides tab so the same notes surface in
// both places. Nothing here is sent to a server.
function MyNotesPanel() {
  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-my-notes">
      <div className="eps-shell">
        <PanelHead
          eyebrow="JOURNAL"
          title="My Notes"
          subtitle="Write down thoughts for now and later recall"
        />

        <MyNotesScratchpad />
      </div>
    </div>
  );
}

// ---- Missed Questions -----------------------------------------------------
// Every question answered incorrectly across quizzes and exams, bucketed
// client-side by part + domain (the EPPP taxonomy lives in eppp-content.ts).
// The backend returns each missed question with its home topic; we classify
// here so filtering stays consistent with the rest of the suite.
type MissedFilterPart = "all" | EpppExamPart;
type MissedTopicLike = { id: number; name: string; category: string };

function missedQuestionPart(topic: MissedTopicLike): EpppExamPart | null {
  const p = getEpppExamPart(topic);
  if (p) return p;
  const fl = getEpppFullLengthExamPart(topic);
  if (fl) return fl;
  if (isEpppClinicalCase(topic)) return getEpppClinicalCasePart(topic);
  return null;
}

function missedQuestionDomain(topic: MissedTopicLike): string {
  if (isEpppClinicalCase(topic)) return getEpppClinicalCaseDomain(topic);
  if (isEpppFullLengthExam(topic)) return "Full-Length Exam";
  return getEpppDisplayCategory(topic);
}

const MISSED_PART_FILTERS: { key: MissedFilterPart; label: string }[] = [
  { key: "all", label: "All parts" },
  { key: "part1", label: "Part 1" },
  { key: "part2", label: "Part 2" },
];

function MissedQuestionsPanel({ onNavigate }: { onNavigate: (to: string) => void }) {
  const { data, isLoading } = useGetEpppMissedQuestions();
  const [part, setPart] = useState<MissedFilterPart>("all");
  const [domain, setDomain] = useState<string>("all");
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});

  const decorated = useMemo(() => {
    const list = (data?.questions ?? []) as EpppMissedQuestion[];
    return list
      .map((q) => {
        const topic: MissedTopicLike = { id: q.topicId, name: q.topicName, category: q.topicCategory };
        return {
          q,
          part: missedQuestionPart(topic),
          domain: missedQuestionDomain(topic),
          isEppp: isEpppTopic(topic) || isEpppClinicalCase(topic) || isEpppFullLengthExam(topic),
        };
      })
      .filter((d) => d.isEppp);
  }, [data]);

  const partFiltered = useMemo(
    () => decorated.filter((d) => part === "all" || d.part === part),
    [decorated, part],
  );

  const domains = useMemo(() => {
    const set = new Set<string>();
    for (const d of partFiltered) set.add(d.domain);
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [partFiltered]);

  useEffect(() => {
    if (domain !== "all" && !domains.includes(domain)) setDomain("all");
  }, [domains, domain]);

  const visible = useMemo(
    () => partFiltered.filter((d) => domain === "all" || d.domain === domain),
    [partFiltered, domain],
  );

  return (
    <div className="study-page-bg eps-panel" data-testid="eppp-panel-missed-questions">
      <div className="eps-shell">
        <PanelHead
          eyebrow="REVIEW"
          title="Missed Questions"
          subtitle="Every question you've gotten wrong, gathered in one place. Filter by part and domain to target your weak spots."
        />

        {isLoading ? (
          <div className="mat-glass eps-empty">Loading your missed questions…</div>
        ) : decorated.length === 0 ? (
          <div className="mat-glass eps-empty">
            No missed questions yet. As you take quizzes and exams, the ones you miss
            collect here for focused review.
          </div>
        ) : (
          <>
            <div className="eps-mq-filters">
              <div className="eps-subtabs" role="tablist" aria-label="Filter by part">
                {MISSED_PART_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    role="tab"
                    aria-selected={part === f.key}
                    className={cn("eppp-launch-btn eps-subtab", part === f.key && "is-active")}
                    onClick={() => setPart(f.key)}
                    data-testid={`eppp-missed-part-${f.key}`}
                  >
                    <span>{f.label}</span>
                  </button>
                ))}
              </div>
              <label className="eps-mq-domain">
                <span className="eps-mq-domain-label">Domain</span>
                <select
                  className="eps-mq-select"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  data-testid="eppp-missed-domain-select"
                >
                  <option value="all">All domains</option>
                  {domains.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="eps-section-head">
              <span className="eps-section-meta">
                {visible.length} {visible.length === 1 ? "question" : "questions"}
              </span>
            </div>

            {visible.length === 0 ? (
              <div className="mat-glass eps-empty">No missed questions match this filter.</div>
            ) : (
              <div className="eps-mq-list">
                {visible.map(({ q, domain: dom, part: qp }) => {
                  const open = !!revealed[q.id];
                  const opts: { key: string; text: string }[] = [
                    { key: "A", text: q.optionA },
                    { key: "B", text: q.optionB },
                    { key: "C", text: q.optionC },
                    { key: "D", text: q.optionD },
                  ];
                  return (
                    <article key={q.id} className="mat-opaque eps-mq-card" data-testid={`eppp-missed-question-${q.id}`}>
                      <div className="eps-mq-tags">
                        <span className="eps-mq-tag">
                          {qp === "part2" ? "Part 2" : qp === "part1" ? "Part 1" : "EPPP"}
                        </span>
                        <span className="eps-mq-tag is-domain">{dom}</span>
                        {q.timesMissed > 1 && (
                          <span className="eps-mq-tag is-count">Missed {q.timesMissed}×</span>
                        )}
                      </div>
                      <p className="eps-mq-q">{q.question}</p>
                      {open ? (
                        <>
                          <div className="eps-mq-options">
                            {opts.map((o) => (
                              <div
                                key={o.key}
                                className={cn("eps-mq-option", o.key === q.correctAnswer && "is-correct")}
                              >
                                <span className="eps-mq-option-key">{o.key}</span>
                                <span>{o.text}</span>
                                {o.key === q.correctAnswer && (
                                  <CheckCircle2 className="eps-mq-option-check" aria-hidden />
                                )}
                              </div>
                            ))}
                          </div>
                          {q.explanation && (
                            <p className="eps-mq-explain">
                              <strong>Why:</strong> {q.explanation}
                            </p>
                          )}
                          <div className="eps-mq-actions">
                            <button
                              className="eppp-launch-btn eps-ghost-btn"
                              onClick={() => setRevealed((r) => ({ ...r, [q.id]: false }))}
                              data-testid={`eppp-missed-hide-${q.id}`}
                            >
                              Hide answer
                            </button>
                            <button
                              className="eps-mq-study btn-glass"
                              onClick={() => onNavigate(epppTopicPath(q.topicId))}
                              data-testid={`eppp-missed-study-${q.id}`}
                            >
                              Study {q.topicName} <ArrowRight aria-hidden />
                            </button>
                          </div>
                        </>
                      ) : (
                        <button
                          className="eppp-launch-btn eps-ghost-btn"
                          onClick={() => setRevealed((r) => ({ ...r, [q.id]: true }))}
                          data-testid={`eppp-missed-reveal-${q.id}`}
                        >
                          Show answer & explanation
                        </button>
                      )}
                    </article>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const styles = `
.eps-nav-section {
  margin: 14px 8px 6px;
  font-size: 9.5px;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${alpha(PP.textDim, 0.85)};
}
.eps-nav-section:first-child { margin-top: 4px; }
.eps-nav-item-idle { color: var(--pp-text-dim); }
.eps-nav-item-idle:hover { color: ${C.cloud}; }
.eps-nav-item-active { color: ${C.mist}; }
.eps-avatar-ring { --tw-ring-color: ${alpha(PP.textDim, 0.4)}; }

/* ---- desktop crumb bar ---- */
.eps-crumb-mark { font-weight: 600; letter-spacing: 0.18em; font-size: 12px; color: ${C.cloud}; }
.eps-crumb-sep { width: 1px; height: 16px; background: ${C.hairlineStrong}; flex-shrink: 0; }
.eps-crumb-page { font-size: 13px; font-weight: 500; color: ${C.mist}; }
.eps-back-app {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 8px 14px; border-radius: 8px;
  font-size: 12.5px; font-weight: 600; text-decoration: none; white-space: nowrap;
  color: ${C.mist}; border: 1px solid ${C.hairlineStrong}; background: var(--pp-tile-stronger);
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
  font-family: var(--app-font-sans);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${C.cloud};
}
.eps-title {
  margin: 0;
  font-family: var(--app-font-sans);
  font-weight: 300;
  font-size: clamp(22px, 3.2vw, 36px);
  line-height: 1.1;
  letter-spacing: 0.32em;
  padding-left: 0.32em;
  text-transform: uppercase;
  max-width: 100%;
  overflow-wrap: anywhere;
  color: ${C.cloud};
}
.eps-sub { margin: 14px 0 0; max-width: 640px; font-size: clamp(13px, 1vw, 15px); line-height: 1.6; color: ${C.cloud}; }
@media (max-width: 640px) {
  .eps-title { letter-spacing: 0.18em; padding-left: 0.18em; }
}

.eps-section-head { display: flex; align-items: center; justify-content: flex-end; margin-top: -4px; }
.eps-section-meta { font-size: 13px; font-weight: 600; color: ${C.mist}; }
.eps-empty {
  padding: 28px; text-align: center; font-size: 14px; color: ${C.muted};
  border-style: dashed;
}

/* ---- Knowledge sub-tab: course-style rail + lessons pane ---- */
@keyframes eps-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.9; } }
.eps-kb-grid { display: grid; grid-template-columns: 280px minmax(0, 1fr); gap: clamp(14px, 1.8vw, 20px); align-items: start; }
@media (max-width: 900px) { .eps-kb-grid { grid-template-columns: 1fr; } }

.eps-kb-rail {
  position: sticky; top: 16px;
  display: flex; flex-direction: column; gap: 8px;
  padding: 10px;
}
@media (max-width: 900px) {
  .eps-kb-rail {
    position: static;
    flex-direction: row; flex-wrap: nowrap;
    overflow-x: auto; padding-bottom: 8px;
    scrollbar-width: thin;
  }
  .eps-kb-rail-item { flex: 0 0 auto; min-width: 220px; }
}
.eps-kb-rail-item {
  display: grid; grid-template-columns: 36px minmax(0, 1fr) auto; gap: 11px; align-items: center;
  text-align: left; cursor: pointer;
  padding: 11px 12px;
}
.eps-kb-rail-item:hover { transform: none; }
.eps-kb-rail-item:focus-visible,
.eps-kb-lesson:focus-visible { outline: 2px solid ${C.cyan}; outline-offset: 2px; }
.eps-kb-rail-item.is-active {
  border-color: rgba(var(--pp-bright-rgb), 0.60);
  background: var(--pp-tile-strong);
}
.eps-kb-rail-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 36px; height: 36px; flex-shrink: 0; border-radius: 10px;
  color: ${C.cyan};
}
.eps-kb-rail-icon svg { width: 17px; height: 17px; }
.eps-kb-rail-text { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
.eps-kb-rail-name {
  font-size: 13.5px; font-weight: 600; color: ${C.cloud}; line-height: 1.25;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.eps-kb-rail-meta { font-size: 11px; color: ${C.mist}; }
.eps-kb-rail-bar { height: 5px; border-radius: 999px; background: var(--pp-tile); overflow: hidden; }
.eps-kb-rail-bar-fill { display: block; height: 100%; border-radius: 999px; background: ${C.mist}; transition: width 800ms cubic-bezier(0.16,1,0.3,1); }
.eps-kb-rail-bar-fill.is-idle { width: 35%; background: var(--pp-tile-strong); box-shadow: none; animation: eps-pulse 1.3s ease-in-out infinite; }
.eps-kb-rail-aside { display: inline-flex; align-items: center; justify-content: flex-end; min-width: 34px; }
.eps-kb-rail-pct { font-size: 11.5px; font-weight: 700; color: ${C.mist}; }
.eps-kb-rail-check { width: 17px; height: 17px; color: ${C.cyan}; }

.eps-kb-content { min-width: 0; }
.eps-kb-head {
  display: flex; align-items: center; gap: 12px;
  margin-bottom: 16px; padding-bottom: 13px;
  border-bottom: 1px solid ${C.hairline};
}
.eps-kb-head-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 44px; height: 44px; flex-shrink: 0;
  color: ${C.cyan};
}
.eps-kb-head-icon svg { width: 20px; height: 20px; }
.eps-kb-head-text { min-width: 0; }
.eps-kb-head-name { margin: 0; font-size: clamp(17px, 2vw, 21px); font-weight: 600; line-height: 1.2; color: ${C.cloud}; }
.eps-kb-head-meta { margin: 3px 0 0; font-size: 12.5px; color: ${C.muted}; }
.eps-kb-lessons { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
@media (max-width: 1180px) { .eps-kb-lessons { grid-template-columns: 1fr; } }
.eps-kb-lesson {
  display: grid; grid-template-columns: 38px minmax(0, 1fr) 18px; gap: 12px; align-items: center;
  text-align: left; cursor: pointer;
  padding: 15px;
}
.eps-kb-lesson-icon {
  display: inline-flex; align-items: center; justify-content: center; align-self: start;
  width: 38px; height: 38px; flex-shrink: 0; border-radius: 10px;
  color: ${C.cyan};
}
.eps-kb-lesson-icon svg { width: 17px; height: 17px; }
.eps-kb-lesson-body { min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.eps-kb-lesson-title { font-size: 14px; font-weight: 650; line-height: 1.25; color: ${C.cloud}; }
.eps-kb-lesson-desc {
  font-size: 12px; line-height: 1.45; color: ${C.mist}ee;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.eps-kb-lesson-meta { font-size: 11px; color: ${C.mist}cc; }
.eps-kb-lesson-arrow { width: 17px; height: 17px; align-self: center; color: ${C.cyan}; opacity: 1; }

/* ---- mastery exam list ---- */
.eps-exam-list { display: flex; flex-direction: column; gap: 12px; }
.eps-exam-row {
  display: flex; align-items: center; gap: 16px;
  padding: 16px 18px;
}
.eps-exam-row.is-mastered {
  border-color: rgba(var(--pp-bright-rgb), 0.60);
}
.eps-exam-row.is-locked { opacity: 0.9; }
.eps-exam-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 42px; height: 42px; flex-shrink: 0;
  color: ${C.cyan};
}
.eps-exam-row.is-locked .eps-exam-icon { background: var(--pp-navy); border-color: ${C.hairline}; color: ${C.muted}; }
.eps-exam-icon svg { width: 19px; height: 19px; }
.eps-exam-body { display: flex; flex-direction: column; gap: 3px; min-width: 0; flex: 1; }
.eps-exam-name { font-size: 15px; font-weight: 600; color: ${C.cloud}; }
.eps-exam-meta { font-size: 12.5px; color: ${C.muted}; line-height: 1.4; }
.eps-exam-cta { gap: 6px; flex-shrink: 0; height: auto; padding: 9px 16px; font-weight: 700; }
.eps-exam-cta svg { width: 15px; height: 15px; }
.eps-exam-cta--ghost {
  color: ${C.mist}; background: var(--pp-tile-stronger); border-color: ${C.hairlineStrong}; box-shadow: none;
}
.eps-exam-cta--ghost:hover { border-color: ${C.cyan}80; color: ${C.cloud}; box-shadow: none; }

/* ---- topic groups (question bank / flashcards) ---- */
.eps-groups { display: flex; flex-direction: column; gap: clamp(20px, 2.6vw, 30px); }
.eps-group-head { display: flex; align-items: center; gap: 10px; margin-bottom: 14px; }
.eps-group-icon { width: 16px; height: 16px; color: ${C.cyan}; flex-shrink: 0; }
.eps-group-title {
  margin: 0;
  font-family: var(--app-font-sans);
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
  padding: 14px 16px;
}
.eps-topic.is-disabled { opacity: 0.55; cursor: not-allowed; }
.eps-topic-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; flex-shrink: 0; border-radius: 11px;
  color: ${C.cyan};
}
.eps-topic-icon svg { width: 18px; height: 18px; }
.eps-topic-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.eps-topic-name { font-size: 14px; font-weight: 600; color: ${C.cloud}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.eps-topic-meta { font-size: 12px; color: ${C.muted}; }
.eps-topic-cta {
  display: inline-flex; align-items: center; gap: 6px; flex-shrink: 0;
  padding: 8px 14px; border-radius: 8px;
  font-size: 12.5px; font-weight: 700; color: ${C.cloud};
  background: var(--pp-tile-strong);
  border: 1px solid rgba(var(--pp-cyan-rgb),0.5);
  box-shadow: inset 0 1px 0 rgba(var(--pp-white-rgb),0.1);
  transition: background 0.2s ease, border-color 0.2s ease, box-shadow 0.3s ease;
}
.eps-topic-cta svg { width: 14px; height: 14px; transition: transform 0.2s ease; }
.eps-topic:hover:not(.is-disabled) .eps-topic-cta {
  background: var(--pp-tile-stronger); border-color: rgba(var(--pp-cyan-rgb),0.65);
  box-shadow: inset 0 1px 0 rgba(var(--pp-white-rgb),0.12);
}
.eps-topic:hover:not(.is-disabled) .eps-topic-cta svg { transform: translateX(3px); }
.eps-topic:active:not(.is-disabled) .eps-topic-cta { background: var(--pp-tile-stronger); box-shadow: inset 0 1px 0 rgba(var(--pp-white-rgb),0.14); }

/* ---- Part 1 sub-tabs ---- */
.eps-subtabs { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin-bottom: clamp(20px, 2.4vw, 28px); }
/* Part toggles / filters compose the shared .eppp-launch-btn recipe; only
   sizing lives here. */
.eps-subtab { gap: 8px; }
.eps-subtab svg { width: 16px; height: 16px; flex-shrink: 0; color: var(--pp-text-dim); }
/* Clinical Cases / Full-length part toggle: same recipe, larger. */
.eps-subtabs--center { justify-content: center; }
.eps-subtabs--center .eps-subtab {
  height: 48px; padding: 0 26px; font-size: 15px; gap: 9px;
}
.eps-subtabs--center .eps-subtab svg { width: 18px; height: 18px; }

.eps-build-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(14px, 2vw, 20px);
}
.eps-build-card,
.eps-contract-card {
  padding: clamp(18px, 2.4vw, 26px);
}
.eps-build-card.is-active {
  border-color: var(--pp-line-bright);
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
  background: var(--pp-tile);
  border: 1px solid ${C.hairline};
  color: ${C.mist};
  font-size: 11.5px;
  font-weight: 700;
  line-height: 1.25;
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
  padding: clamp(40px, 6vw, 72px) clamp(24px, 4vw, 56px);
}
.eps-soon-glow { position: absolute; top: -45%; left: 50%; transform: translateX(-50%); width: 70%; height: 120%; background: transparent; pointer-events: none; }
.eps-soon-icon {
  position: relative; display: inline-flex; align-items: center; justify-content: center;
  width: 60px; height: 60px; margin-bottom: 18px; border-radius: 16px;
  color: ${C.cyan};
}
.eps-soon-icon svg { width: 28px; height: 28px; }
.eps-soon-pill {
  position: relative; display: inline-flex; align-items: center; gap: 6px;
  padding: 5px 13px; border-radius: 999px; margin-bottom: 16px;
  font-size: 11.5px; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase;
  color: ${C.mist}; background: var(--pp-tile); border: 1px solid ${C.hairlineStrong};
}
.eps-soon-pill svg { width: 13px; height: 13px; }
.eps-soon-title { position: relative; margin: 0; font-size: clamp(20px, 2.6vw, 28px); font-weight: 700; color: var(--pp-text); }
.eps-soon-text { position: relative; margin: 12px auto 0; max-width: 560px; font-size: 14.5px; line-height: 1.7; color: ${C.body}; }

/* ---- Shared ghost button + split section head ---- */
.eps-section-head--split { justify-content: center; gap: 16px; }
/* Print / inline action buttons compose the shared .eppp-launch-btn recipe. */
.eps-ghost-btn { gap: 8px; }
.eps-ghost-btn svg { width: 16px; height: 16px; color: var(--pp-text-dim); }

/* ---- Full-Length Exams ---- */
.eps-fl-card {
  padding: clamp(20px, 2.6vw, 30px); text-align: center;
}
.eps-fl-head { display: flex; align-items: center; justify-content: center; gap: 16px; }
.eps-fl-icon {
  display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
  width: 52px; height: 52px; border-radius: 14px;
  color: ${C.cyan};
}
.eps-fl-icon svg { width: 26px; height: 26px; }
.eps-fl-head-text { min-width: 0; }
.eps-fl-title { margin: 0; font-size: clamp(18px, 2.2vw, 23px); font-weight: 700; color: ${C.cloud}; }
.eps-fl-meta { margin: 4px 0 0; font-size: 14px; color: ${C.mist}; }
.eps-fl-features { display: flex; flex-wrap: wrap; justify-content: center; gap: 10px; margin: 20px 0 24px; }
.eps-fl-feature {
  display: inline-flex; align-items: center; gap: 7px; font-size: 12.5px; font-weight: 600;
  color: ${C.cloud}; padding: 7px 12px; border-radius: 999px;
  background: var(--pp-tile); border: 1px solid rgba(var(--pp-cyan-rgb),0.3);
}
.eps-fl-feature svg { width: 14px; height: 14px; }
.eps-fl-cta {
  display: inline-flex; align-items: center; gap: 8px; cursor: pointer;
  padding: 12px 22px; font-size: 14px; font-weight: 700;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}
.eps-fl-cta svg { width: 16px; height: 16px; transition: transform 0.2s ease; }
.eps-fl-cta:hover { transform: translateY(-1px); }
.eps-fl-cta:hover svg { transform: translateX(3px); }

/* ---- Rapid Review notes ---- */
.eps-notes {
  margin-top: clamp(22px, 2.6vw, 32px); padding: clamp(18px, 2.4vw, 26px);
}
.eps-notes-head { display: flex; align-items: center; justify-content: center; text-align: center; gap: 13px; margin-bottom: 14px; }
.eps-notes-icon {
  display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
  width: 40px; height: 40px; border-radius: 11px;
  color: ${C.cyan};
}
.eps-notes-icon svg { width: 20px; height: 20px; }
.eps-notes-title { margin: 0; font-size: 16px; font-weight: 800; color: ${C.cloud}; }
.eps-notes-sub { margin: 2px 0 0; font-size: 12.5px; font-weight: 600; color: ${C.body}; }
.eps-notes-area {
  width: 100%; min-height: 180px; resize: vertical; box-sizing: border-box;
  border-radius: 12px; padding: 14px 16px; font-size: 14px; line-height: 1.6;
  color: ${C.cloud}; background: var(--pp-tile); border: 1px solid ${C.hairlineStrong};
  font-family: inherit;
}
.eps-notes-area::placeholder { color: ${C.muted}; }
.eps-notes-area:focus { outline: none; border-color: ${C.cyan}80; box-shadow: 0 0 0 3px rgba(var(--pp-cyan-rgb),0.12); }
.eps-notes-actions { display: flex; justify-content: flex-end; margin-top: 12px; }
.eps-save-btn {
  display: inline-flex; align-items: center; gap: 7px; cursor: pointer;
  border-radius: 8px; padding: 9px 18px; font-size: 13px; font-weight: 700;
  color: ${C.ink}; background: ${C.cyan}; border: 1px solid ${C.cyan};
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
}
.eps-save-btn svg { width: 15px; height: 15px; }
.eps-save-btn:hover { transform: translateY(-1px); }
.eps-save-btn:active { transform: translateY(0); }
.eps-save-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; box-shadow: none; }
.eps-notes-saved { display: flex; flex-direction: column; gap: 12px; margin-top: 18px; }
.eps-note-card {
  padding: 14px 16px;
}
.eps-note-text { margin: 0; font-size: 14px; line-height: 1.6; color: ${C.cloud}; white-space: pre-wrap; }
.eps-note-foot { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-top: 10px; }
.eps-note-date { font-size: 12px; font-weight: 600; color: ${C.muted}; }

/* ---- Missed Questions ---- */
.eps-mq-filters { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 14px; margin-bottom: 18px; }
.eps-mq-filters .eps-subtabs { margin-bottom: 0; }
.eps-mq-domain { display: inline-flex; align-items: center; gap: 9px; }
.eps-mq-domain-label { font-size: 12.5px; font-weight: 600; color: ${C.muted}; }
.eps-mq-select {
  appearance: none; cursor: pointer; padding: 9px 30px 9px 14px; border-radius: 10px;
  font-size: 13px; font-weight: 600; color: ${C.cloud};
  background: var(--pp-tile-stronger) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23d6d6d6' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center;
  border: 1px solid ${C.hairlineStrong}; max-width: 280px;
}
.eps-mq-select:focus { outline: none; border-color: ${C.cyan}80; }
.eps-mq-list { display: flex; flex-direction: column; gap: 14px; }
.eps-mq-card {
  padding: clamp(16px, 2vw, 22px);
}
.eps-mq-tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 12px; }
.eps-mq-tag {
  display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 999px;
  font-size: 11px; font-weight: 700; letter-spacing: 0.03em; text-transform: uppercase;
  color: ${C.mist}; background: var(--pp-tile); border: 1px solid ${C.hairline};
}
.eps-mq-tag.is-domain { text-transform: none; letter-spacing: 0; color: ${C.body}; }
.eps-mq-tag.is-count { color: ${PP.red300}; background: ${alpha(PP.red400, 0.12)}; border-color: ${alpha(PP.red400, 0.3)}; }
.eps-mq-q { margin: 0 0 14px; font-size: 15px; line-height: 1.6; font-weight: 600; color: ${C.cloud}; }
.eps-mq-options { display: flex; flex-direction: column; gap: 8px; margin-bottom: 14px; }
.eps-mq-option {
  display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-radius: 10px;
  font-size: 13.5px; line-height: 1.5; color: ${C.body};
  background: var(--pp-navy); border: 1px solid ${C.hairline};
}
.eps-mq-option.is-correct { color: ${C.cloud}; background: var(--pp-tile); border-color: ${C.hairlineStrong}; }
.eps-mq-option-key {
  display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
  width: 24px; height: 24px; border-radius: 7px; font-size: 12px; font-weight: 700;
  color: ${C.mist}; background: var(--pp-tile);
}
.eps-mq-option.is-correct .eps-mq-option-key { color: ${C.ink}; background: ${C.cyan}; }
.eps-mq-option-check { width: 16px; height: 16px; margin-left: auto; flex-shrink: 0; color: ${C.cyan}; }
.eps-mq-explain {
  margin: 0 0 14px; padding: 12px 14px; border-radius: 10px; font-size: 13px; line-height: 1.65;
  color: ${C.body}; background: var(--pp-navy); border: 1px solid ${C.hairlineStrong};
}
.eps-mq-explain strong { color: ${C.mist}; }
.eps-mq-actions { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; }
.eps-mq-study {
  display: inline-flex; align-items: center; gap: 7px; cursor: pointer; margin-left: auto;
  padding: 9px 16px; font-size: 13px; font-weight: 700;
  transition: transform 0.2s ease;
}
.eps-mq-study svg { width: 14px; height: 14px; transition: transform 0.2s ease; }
.eps-mq-study:hover { transform: translateY(-1px); }
.eps-mq-study:hover svg { transform: translateX(3px); }
.eps-reflection-note {
  margin: 0 0 14px; padding: 12px 14px; border-radius: 10px;
  font-size: 13.5px; line-height: 1.6; color: ${C.cloud}; white-space: pre-wrap;
  background: var(--pp-navy); border-left: 3px solid ${C.cyan};
}
@media (max-width: 640px) {
  .eps-mq-filters { flex-direction: column; align-items: stretch; }
  .eps-mq-domain { justify-content: space-between; }
  .eps-mq-select { max-width: none; flex: 1; }
  .eps-mq-study { margin-left: 0; }
}
`;
