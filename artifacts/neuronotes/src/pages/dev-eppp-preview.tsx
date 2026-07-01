import { EpppDashboardView, type DomainStat } from "@/pages/eppp-dashboard";

// DEV-ONLY visual-verification route (/__eppp-preview). The live EPPP dashboard
// is auth-gated, so this renders the pure presentational view with static mock
// data that mirrors the June-27 reference screenshot, letting us screenshot the
// card glass + background treatment without signing in. Not shipped in prod.
const DOMAINS: DomainStat[] = [
  { category: "Assessment and Diagnosis", total: 5, passed: 0, pct: 0, mastered: false, unlocked: true },
  { category: "Biological Bases of Behavior", total: 4, passed: 0, pct: 0, mastered: false, unlocked: true },
  { category: "Cognitive-Affective Bases of Behavior", total: 5, passed: 0, pct: 0, mastered: false, unlocked: true },
  { category: "Ethics, Legal & Professional Issues", total: 6, passed: 0, pct: 0, mastered: false, unlocked: true },
  { category: "Growth & Lifespan Development", total: 5, passed: 0, pct: 0, mastered: false, unlocked: true },
  { category: "Research Methods and Statistics", total: 4, passed: 0, pct: 0, mastered: false, unlocked: true },
  { category: "Social & Cultural Bases of Behavior", total: 5, passed: 0, pct: 0, mastered: false, unlocked: true },
  { category: "Treatment, Intervention & Prevention", total: 6, passed: 0, pct: 0, mastered: false, unlocked: true },
];

export default function DevEpppPreview() {
  return (
    <EpppDashboardView
      greetingName=""
      readiness={0}
      readinessLoading={false}
      masteredCount={0}
      domainStats={DOMAINS}
      domainsLoading={false}
      avgScore={17}
      streak={0}
      weekly={Array.from({ length: 7 }, () => ({ active: false }))}
      activeDays={0}
      examDate="2026-06-27"
      onSetExamDate={() => {}}
      recommended={[]}
      recommendedLoading={false}
      onNavigate={() => {}}
    />
  );
}
