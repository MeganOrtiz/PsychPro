// Read-only tour previews of the two real dashboards. The actual page /
// view components render inside an isolated QueryClient that is pre-seeded
// with anonymous sample data and has every query disabled, so nothing is ever
// fetched and no account data is read. Navigation is confined to an in-memory
// router. The app chrome (sidebar + top bar) mirrors layout/app-layout.tsx and
// pages/eppp-suite.tsx without their account-bound widgets.
import { useMemo, type ComponentType, type ReactNode } from "react";
import { Router, type BaseLocationHook } from "wouter";
import { memoryLocation } from "wouter/memory-location";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  LayoutDashboard, BookOpen, Beaker, Brain, Trophy, Library, Lightbulb, Star, Users, MessageSquare,
  BookMarked, Wrench, Sparkles, ChevronRight, GraduationCap, Bell, BarChart3, Layers, Stethoscope,
  ClipboardCheck, XCircle, Zap, NotebookPen, ClipboardList,
} from "lucide-react";
import {
  getGetDashboardSummaryQueryKey, getGetTopicsQueryKey, getGetLeaderboardQueryKey, getGetCourseMasteryStatusQueryKey,
  type DashboardSummary, type Topic, type Leaderboard,
} from "@workspace/api-client-react";
import DashboardPage from "@/pages/dashboard";
import { EpppDashboardView, type DomainStat } from "@/pages/eppp-dashboard";
import { DashboardHeaderBackdrop } from "@/components/dashboard-brand-artwork";
import { navItemClass } from "@/components/layout/sidebar-style";
import { STUDY_PALETTE } from "@/lib/study-theme";
import { PP } from "@/lib/palette";
import { LiveFrame } from "./live-frame";
import { EPPP_DOMAINS } from "./tour-data";

type Icon = ComponentType<{ className?: string }>;
type Item = { label: string; icon: Icon; badge?: boolean };
const noop = () => undefined;

function day(offset: number) {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() + offset);
  return d;
}
function week(active: boolean[]) {
  const today = day(0);
  return active.map((a, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() - today.getDay() + i);
    return { date: d.toISOString(), active: a && d <= today };
  });
}

/* ----------------------------- shared chrome ----------------------------- */

function NavRow({ item, active }: { item: Item; active?: boolean }) {
  const I = item.icon;
  return (
    <div className={navItemClass(!!active)}>
      <I className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-medium flex-1 min-w-0 truncate">{item.label}</span>
      {item.badge ? (
        <span className="inline-flex items-center text-[10px] font-semibold tracking-wide px-1.5 py-0.5 rounded-full text-[var(--nav-hover)] border border-[rgba(var(--pp-cyan-rgb),0.30)]">PRO</span>
      ) : null}
      {active ? <ChevronRight className="w-4 h-4 flex-shrink-0" /> : null}
    </div>
  );
}

function Shell({ wordmark, sections, switchLabel, SwitchIcon, profile, children }: {
  wordmark: string; sections: { title: string; items: Item[] }[]; switchLabel: string; SwitchIcon: Icon; profile: boolean; children: ReactNode;
}) {
  return (
    <div className="study-page-bg flex min-h-screen dashboard-shell-artwork" style={{ position: "relative" }}>
      <DashboardHeaderBackdrop />
      <aside
        className="sticky top-4 self-start w-64 flex flex-col overflow-hidden m-4 rounded-2xl flex-shrink-0"
        style={{ height: "calc(820px - 2rem)", background: "var(--dashboard-sidebar-surface, var(--pp-surface))", border: "1px solid var(--pp-line)", ["--nav-hover" as never]: PP.text, ["--nav-glow" as never]: STUDY_PALETTE.surf }}
      >
        <div className="relative px-3 pt-5 pb-3">
          <p className="text-center font-light" style={{ letterSpacing: "0.4em", textIndent: "0.4em", fontSize: "18px", color: PP.text }}>{wordmark}</p>
        </div>
        <nav className="app-sidebar-nav relative flex-1 p-3 space-y-1 overflow-hidden">
          {sections.map((s, si) => (
            <div key={s.title + si} className="space-y-1">
              {s.title ? <p className="suite-sidebar-section">{s.title}</p> : null}
              {s.items.map((it) => <NavRow key={it.label} item={it} active={si === 0 && it.label === "Dashboard"} />)}
            </div>
          ))}
        </nav>
        {profile ? (
          <div className="relative p-4 border-t border-[rgba(var(--pp-ocean-rgb),0.35)] z-10">
            <div className={navItemClass(false)}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border flex-shrink-0" style={{ background: STUDY_PALETTE.teal, color: PP.text, borderColor: `${STUDY_PALETTE.surf}55` }}>SL</div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate" style={{ color: PP.text }}>Sample learner</p>
                <p className="text-xs truncate" style={{ color: PP.textDim }}>View profile</p>
              </div>
            </div>
          </div>
        ) : null}
      </aside>
      <div className="dashboard-shell-content flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="relative flex items-center justify-end gap-3 px-6 py-3">
          <span className="eppp-launch-btn suite-switch-btn">
            <span className="eppp-launch-btn__inner"><SwitchIcon /><span>{switchLabel}</span></span>
          </span>
          <span className="mat-glass relative w-10 h-10 rounded-md flex items-center justify-center"><Bell className="w-4 h-4" /></span>
          <span className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ring-1 ring-[rgba(var(--pp-cyan-rgb),0.40)]" style={{ background: STUDY_PALETTE.teal, color: PP.text }}>SL</span>
        </header>
        <main className="flex-1">
          <div data-xp-measure>{children}</div>
        </main>
      </div>
    </div>
  );
}

function Sandbox({ path, client, children }: { path: string; client?: QueryClient; children: ReactNode }) {
  const hook = useMemo(() => memoryLocation({ path, static: true }).hook as BaseLocationHook, [path]);
  const qc = useMemo(() => client ?? new QueryClient({ defaultOptions: { queries: { enabled: false, retry: false } } }), [client]);
  return (
    <QueryClientProvider client={qc}>
      <Router hook={hook}>{children}</Router>
    </QueryClientProvider>
  );
}

/* ------------------------------- PsychPro -------------------------------- */

const PP_TOPICS: [number, string, string][] = [
  [9101, "Attachment Theory", "Foundations"], [9102, "Classical Conditioning", "Foundations"], [9103, "Operant Conditioning", "Foundations"],
  [9111, "Objective Measures", "Assessment"], [9112, "Validity and Effort Testing", "Assessment"], [9113, "Intelligence Testing", "Assessment"],
  [9121, "Neurotransmitter Systems", "Neuroscience"], [9122, "Sleep and Circadian Rhythms", "Neuroscience"],
  [9131, "Executive Function", "Neuropsychology"], [9132, "Memory Systems", "Neuropsychology"],
  [9141, "Cognitive Behavioral Therapy", "Psychotherapy"], [9142, "ADHD and Medications", "Psychotherapy"],
];
const PP_MASTERY: Record<string, [number, number, boolean]> = {
  Assessment: [3, 3, true], Foundations: [2, 3, false], Neuropsychology: [1, 2, false], Neuroscience: [1, 2, false], Psychotherapy: [0, 2, false],
};

function psychproClient() {
  const qc = new QueryClient({ defaultOptions: { queries: { enabled: false, retry: false, staleTime: Infinity } } });
  const topics: Topic[] = PP_TOPICS.map(([id, name, category]) => ({ id, name, category, description: "", flashcardCount: 24, quizCount: 12 }));
  const tp = (id: number, score: number, ago: number) => ({
    id: id + 1, userId: "sample", topicId: id, topicName: PP_TOPICS.find((t) => t[0] === id)![1], score, lastAccessed: day(-ago).toISOString(),
  });
  const summary: DashboardSummary = {
    totalTopics: topics.length, topicsStudied: 6, topicsCompleted: 3, quizzesCompleted: 14, examsCompleted: 4,
    currentStreak: 4, averageScore: 78,
    recentTopics: [tp(9112, 64, 0), tp(9102, 88, 1), tp(9132, 71, 2), tp(9111, 92, 3), tp(9101, 83, 4), tp(9121, 57, 6)],
    weakAreas: [tp(9121, 57, 6), tp(9112, 64, 0)],
    weeklyActivity: week([false, true, true, false, true, true, true]),
    subscriptionStatus: "active", usageCount: 0, freeLimit: 50,
  };
  const leaderboard: Leaderboard = {
    totalParticipants: 5,
    entries: [
      { rank: 1, displayName: "Learner A", streak: 12, topicsCompleted: 9, isCurrentUser: false },
      { rank: 2, displayName: "Learner B", streak: 7, topicsCompleted: 7, isCurrentUser: false },
      { rank: 3, displayName: "Sample learner", streak: 4, topicsCompleted: 3, isCurrentUser: true },
      { rank: 4, displayName: "Learner C", streak: 2, topicsCompleted: 3, isCurrentUser: false },
      { rank: 5, displayName: "Learner D", streak: 0, topicsCompleted: 1, isCurrentUser: false },
    ],
  };
  qc.setQueryData(getGetTopicsQueryKey(), topics);
  qc.setQueryData(getGetDashboardSummaryQueryKey(), summary);
  qc.setQueryData(getGetLeaderboardQueryKey(), leaderboard);
  Object.entries(PP_MASTERY).forEach(([category, [passed, total, mastered]]) => {
    qc.setQueryData(getGetCourseMasteryStatusQueryKey(category), {
      category, unlocked: passed === total, mastered, passingScore: 90, totalTopics: total, passedTopics: passed,
    });
  });
  return qc;
}

const PP_SECTIONS = [
  { title: "Learn", items: [
    { label: "Dashboard", icon: LayoutDashboard }, { label: "Courses", icon: BookOpen }, { label: "Study Lab", icon: Beaker },
    { label: "Brain Lab", icon: Brain }, { label: "Progress", icon: Trophy }, { label: "Resources", icon: Library },
  ] },
  { title: "Expand", items: [{ label: "My Library", icon: BookOpen }, { label: "Reflections", icon: Lightbulb }] },
  { title: "Tools Studio", items: [
    { label: "My Tools", icon: BookMarked, badge: true }, { label: "Standard Tools", icon: Wrench, badge: true }, { label: "Pro Tools", icon: Sparkles, badge: true },
  ] },
  { title: "Connect", items: [{ label: "Featured Work", icon: Star }, { label: "Connections", icon: Users }, { label: "Feedback", icon: MessageSquare }] },
];

export function PsychProDashboardLive() {
  const client = useMemo(psychproClient, []);
  return (
    <LiveFrame title="PsychPro dashboard">
      <Sandbox path="/dashboard" client={client}>
        <Shell wordmark="PSYCHPRO" sections={PP_SECTIONS} switchLabel="EPPP Mastery Suite" SwitchIcon={GraduationCap} profile>
          <DashboardPage />
        </Shell>
      </Sandbox>
    </LiveFrame>
  );
}

/* --------------------------------- EPPP ---------------------------------- */

const EP_SECTIONS = [
  { title: "Overview", items: [{ label: "Dashboard", icon: BarChart3 }] },
  { title: "Learn", items: [{ label: "Part 1: Knowledge", icon: Layers }, { label: "Part 2: Skills", icon: Brain }, { label: "Clinical Integrated Cases", icon: Stethoscope }] },
  { title: "Assess", items: [{ label: "Domain Mastery Exams", icon: GraduationCap }, { label: "Full-Length Exams", icon: ClipboardCheck }] },
  { title: "Review", items: [{ label: "Missed Questions", icon: XCircle }, { label: "Quick Reference Guide", icon: Zap }] },
  { title: "Journal", items: [{ label: "Reflections", icon: Lightbulb }, { label: "My Notes", icon: NotebookPen }, { label: "My Library", icon: BookOpen }] },
  { title: "Reference", items: [{ label: "Resources", icon: Library }] },
  { title: "Plan", items: [{ label: "Study Plan", icon: ClipboardList }] },
];

const EP_PROGRESS: [number, number][] = [[6, 6], [4, 7], [3, 6], [5, 8], [2, 7], [3, 9], [1, 6], [4, 8]];

export function EpppDashboardLive() {
  const domainStats: DomainStat[] = EPPP_DOMAINS.map((category, i) => {
    const [passed, total] = EP_PROGRESS[i];
    return { category, passed, total, pct: Math.round((passed / total) * 100), mastered: passed === total, unlocked: passed === total };
  });
  const readiness = Math.round((domainStats.reduce((a, d) => a + d.passed / d.total, 0) / domainStats.length) * 100);
  const exam = day(74);
  const examDate = `${exam.getFullYear()}-${String(exam.getMonth() + 1).padStart(2, "0")}-${String(exam.getDate()).padStart(2, "0")}`;
  const weekly = week([false, true, true, true, false, true, true]);
  return (
    <LiveFrame title="EPPP Mastery Suite dashboard">
      <Sandbox path="/eppp/suite/performance-analytics">
        <Shell wordmark="EPPP SUITE" sections={EP_SECTIONS} switchLabel="PsychPro Suite" SwitchIcon={Brain} profile={false}>
          <EpppDashboardView
            greetingName=""
            readiness={readiness}
            readinessLoading={false}
            masteredCount={domainStats.filter((d) => d.mastered).length}
            domainStats={domainStats}
            domainsLoading={false}
            avgScore={76.4}
            streak={5}
            weekly={weekly}
            activeDays={weekly.filter((d) => d.active).length}
            examDate={examDate}
            onSetExamDate={noop}
            recommended={[
              { topicId: 9201, topicName: "Inferential Statistics", score: 58 },
              { topicId: 9202, topicName: "Neuroanatomy and Localization", score: 66 },
              { topicId: 9203, topicName: "Informed Consent and Confidentiality", score: 0 },
              { topicId: 9204, topicName: "Psychopharmacology", score: 0 },
            ]}
            recommendedLoading={false}
            onNavigate={noop}
          />
        </Shell>
      </Sandbox>
    </LiveFrame>
  );
}
