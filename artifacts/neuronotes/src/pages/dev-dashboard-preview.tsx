// DEV-ONLY throwaway preview route (/__dashboard-preview) — verifies the
// dashboard backdrop artwork + brand wordmark placement without Clerk auth.
// Renders the real EpppDashboardView with mock props, and a main-dashboard
// mimic (same .dashboard-artwork/.dashboard-brand classes). Safe to delete.
import { EpppDashboardView } from "@/pages/eppp-dashboard";
import type { DomainStat, RecTopic } from "@/pages/eppp-dashboard";

const domains: DomainStat[] = [
  { category: "Biological Bases", total: 8, passed: 6, pct: 75, mastered: false, unlocked: true },
  { category: "Cognitive-Affective", total: 6, passed: 6, pct: 100, mastered: true, unlocked: true },
  { category: "Social & Cultural", total: 5, passed: 2, pct: 40, mastered: false, unlocked: true },
  { category: "Growth & Lifespan", total: 7, passed: 0, pct: 0, mastered: false, unlocked: false },
];

const recommended: RecTopic[] = [
  { topicId: 1, topicName: "Neuroanatomy", score: 62 },
  { topicId: 2, topicName: "Psychopharmacology", score: 71 },
  { topicId: 3, topicName: "Ethics & Law", score: 55 },
];

export default function DevDashboardPreview() {
  const mode = new URLSearchParams(window.location.search).get("view") ?? "eppp";

  if (mode === "main") {
    // Mimic app-layout: 288px sidebar column + 64px top bar, scrollable main.
    return (
      <div className="study-page-bg flex min-h-screen">
        <aside className="hidden md:block w-64 m-4 rounded-2xl" style={{ background: "var(--pp-surface)", border: "1px solid var(--pp-line)" }} />
        <div className="flex-1 flex flex-col min-h-screen max-h-screen">
          <div style={{ height: 64 }} />
          <div className="flex-1 overflow-y-auto">
        <div className="min-h-full dashboard-page dashboard-artwork">
          <div className="dashboard-brand">
            <h1>PsychPro</h1>
          </div>
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8 pt-4 md:pt-6 lg:pt-8 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="mat-opaque p-6" style={{ minHeight: 180 }}>
                  <p className="font-semibold">Panel {i}</p>
                  <p className="text-sm mt-2">Placeholder card to check layering over the backdrop.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
          </div>
        </div>
      </div>
    );
  }

  // Mimic the EPPP suite layout: 288px sidebar column + 64px top bar.
  return (
    <div className="study-page-bg flex min-h-screen">
      <aside className="hidden md:block w-64 m-4 rounded-2xl flex-shrink-0" style={{ background: "var(--pp-surface)", border: "1px solid var(--pp-line)" }} />
      <div className="flex-1 flex flex-col min-h-screen max-h-screen min-w-0">
        <div style={{ height: 64 }} />
        <div className="flex-1 overflow-y-auto">
          <EppView />
        </div>
      </div>
    </div>
  );
}

function EppView() {
  return (
    <EpppDashboardView
      greetingName="Preview"
      readiness={62}
      readinessLoading={false}
      masteredCount={1}
      domainStats={domains}
      domainsLoading={false}
      avgScore={78}
      streak={5}
      weekly={[true, true, false, true, true, false, false].map((active) => ({ active }))}
      activeDays={4}
      examDate="2026-09-15"
      onSetExamDate={() => {}}
      recommended={recommended}
      recommendedLoading={false}
      onNavigate={() => {}}
    />
  );
}
