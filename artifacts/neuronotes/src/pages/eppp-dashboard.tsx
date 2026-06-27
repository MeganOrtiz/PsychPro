import { useMemo, useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "wouter";
import { useUser } from "@clerk/clerk-react";
import {
  Flame,
  CalendarClock,
  ArrowRight,
  Target,
  BookOpen,
  CheckCircle2,
  Pencil,
  Sparkles,
} from "lucide-react";
import { useQueries } from "@tanstack/react-query";
import {
  useGetDashboardSummary,
  useGetTopics,
  getCourseMasteryStatus,
  getGetCourseMasteryStatusQueryKey,
} from "@workspace/api-client-react";
import { groupEpppTopicsByCategory, isEpppKnowledgeTopic } from "@/lib/eppp-content";
import { epppDomainAnchor, epppTopicPath } from "@/lib/eppp-routes";
import { knowledgeDomainIcon } from "@/lib/eppp-icons";

// ---------------------------------------------------------------------------
// EPPP Mastery Suite dashboard — the working "how ready am I" home for the
// licensing-exam track, reached from the /eppp intro page's CTAs. Distinct from
// the general /dashboard. Surfaces five things the user asked for:
//   1. An overall exam-readiness score (mean lesson-mastery across domains)
//   2. Per-domain (content area) progress
//   3. What to study next (weak / unfinished areas)
//   4. Study streak + weekly activity
//   5. An exam-date countdown (persisted locally per user for now)
// Locked cerulean palette (#76E4F7); no mint. All CSS scoped under .epd-*.
//
// Split into a pure presentational view (EpppDashboardView, data via props) and
// a data container (default export). The view is reused by the mockup sandbox
// for visual verification since the live page is auth-gated.
// ---------------------------------------------------------------------------

const C = {
  cyan: "#76E4F7",
  mist: "#A7F3FF",
  cloud: "#F4FBFF",
  ink: "#07333e",
  hairline: "rgba(118,228,247,0.16)",
  hairlineStrong: "rgba(118,228,247,0.32)",
  body: "rgba(225,244,250,0.84)",
  muted: "rgba(186,214,224,0.66)",
};

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export type RecTopic = { topicId: number; topicName: string; score: number };
export type DomainStat = {
  category: string;
  total: number;
  passed: number;
  pct: number;
  mastered: boolean;
  unlocked: boolean;
};

// ---- exam date (localStorage, per user) -----------------------------------
function useExamDate(userId: string) {
  const key = `psychpro.eppp.examDate.${userId}`;
  const [date, setDateState] = useState<string>("");

  useEffect(() => {
    try {
      setDateState(localStorage.getItem(key) ?? "");
    } catch {
      /* ignore */
    }
  }, [key]);

  const setDate = useCallback(
    (value: string) => {
      setDateState(value);
      try {
        if (value) localStorage.setItem(key, value);
        else localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    },
    [key],
  );

  return { date, setDate };
}

function daysUntil(iso: string): number | null {
  if (!iso) return null;
  const target = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function formatExamDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

// ---- readiness ring --------------------------------------------------------
function ReadinessRing({ pct, loading }: { pct: number; loading: boolean }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const clamped = Math.max(0, Math.min(100, pct));
  const offset = circ * (1 - clamped / 100);
  return (
    <div className="epd-ring" data-testid="eppp-readiness-ring">
      <svg viewBox="0 0 128 128" className="epd-ring-svg" aria-hidden>
        <circle cx="64" cy="64" r={r} className="epd-ring-track" />
        <circle
          cx="64"
          cy="64"
          r={r}
          className="epd-ring-fill"
          style={{
            strokeDasharray: circ,
            strokeDashoffset: loading ? circ : offset,
          }}
        />
      </svg>
      <div className="epd-ring-center">
        <span className="epd-ring-num">{loading ? "—" : `${clamped}%`}</span>
        <span className="epd-ring-cap">ready</span>
      </div>
    </div>
  );
}

export interface EpppDashboardViewProps {
  greetingName: string;
  readiness: number;
  readinessLoading: boolean;
  masteredCount: number;
  domainStats: DomainStat[];
  domainsLoading: boolean;
  avgScore: number;
  streak: number;
  weekly: { active: boolean }[];
  activeDays: number;
  examDate: string;
  onSetExamDate: (value: string) => void;
  recommended: RecTopic[];
  recommendedLoading: boolean;
  onNavigate: (to: string) => void;
}

export function EpppDashboardView({
  greetingName,
  readiness,
  readinessLoading,
  masteredCount,
  domainStats,
  domainsLoading,
  avgScore,
  streak,
  weekly,
  activeDays,
  examDate,
  onSetExamDate,
  recommended,
  recommendedLoading,
  onNavigate,
}: EpppDashboardViewProps) {
  const [editingDate, setEditingDate] = useState(false);
  const examDays = daysUntil(examDate);
  void greetingName;

  return (
    <div className="study-page-bg epd-page" data-testid="eppp-dashboard-page">
      <style>{styles}</style>

      <div className="epd-shell">
        {/* Stat row: readiness · streak · exam countdown */}
        <section className="epd-stat-row">
          {/* Readiness */}
          <article className="epd-card epd-card--readiness">
            <ReadinessRing pct={readiness} loading={readinessLoading} />
            <div className="epd-readiness-meta">
              <p className="epd-card-label">
                <Target aria-hidden /> Exam readiness
              </p>
              <p className="epd-readiness-note">
                {masteredCount} of {domainStats.length || "—"} domains mastered
              </p>
              <p className="epd-readiness-sub">
                Avg. score {Math.round(avgScore)}% · based on lessons passed at
                90%+
              </p>
            </div>
          </article>

          {/* Streak */}
          <article className="epd-card epd-card--streak">
            <p className="epd-card-label">
              <Flame aria-hidden /> Study streak
            </p>
            <p className="epd-stat-big">
              {streak}
              <span className="epd-stat-unit">
                {streak === 1 ? "day" : "days"}
              </span>
            </p>
            <div className="epd-week" aria-label="This week's activity">
              {Array.from({ length: 7 }).map((_, i) => {
                const active = weekly[i]?.active;
                return (
                  <div key={i} className="epd-week-col">
                    <span
                      className={`epd-week-dot${active ? " is-active" : ""}`}
                    />
                    <span className="epd-week-lbl">{DAY_LABELS[i]}</span>
                  </div>
                );
              })}
            </div>
            <p className="epd-card-foot">{activeDays}/7 active days this week</p>
          </article>

          {/* Exam countdown */}
          <article className="epd-card epd-card--exam">
            <p className="epd-card-label">
              <CalendarClock aria-hidden /> Exam countdown
            </p>
            {examDate && !editingDate ? (
              <>
                <p className="epd-stat-big">
                  {examDays !== null && examDays >= 0 ? examDays : 0}
                  <span className="epd-stat-unit">
                    {examDays === 1 ? "day" : "days"}
                  </span>
                </p>
                <p className="epd-exam-note">
                  {examDays !== null && examDays < 0
                    ? "Exam date has passed"
                    : `until your EPPP · ${formatExamDate(examDate)}`}
                </p>
                <button
                  type="button"
                  className="epd-exam-edit"
                  onClick={() => setEditingDate(true)}
                  data-testid="eppp-exam-edit"
                >
                  <Pencil aria-hidden /> Change date
                </button>
              </>
            ) : (
              <>
                <p className="epd-exam-prompt">
                  Set your exam date to start the countdown.
                </p>
                <input
                  type="date"
                  className="epd-date-input"
                  value={examDate}
                  onChange={(e) => onSetExamDate(e.target.value)}
                  data-testid="eppp-exam-input"
                />
                <button
                  type="button"
                  className="epd-exam-save"
                  onClick={() => setEditingDate(false)}
                  disabled={!examDate}
                  data-testid="eppp-exam-save"
                >
                  Save date
                </button>
              </>
            )}
          </article>
        </section>

        {/* Domain progress */}
        <section className="epd-section" data-testid="eppp-domain-progress">
          <div className="epd-section-head epd-section-head--hero text-scrim">
            <div>
              <h2 className="epd-section-title">Progress by domain</h2>
            </div>
            <span className="epd-section-meta">
              {domainsLoading
                ? "—"
                : `${masteredCount}/${domainStats.length || 0} mastered`}
            </span>
          </div>

          {domainsLoading ? (
            <div className="epd-domain-grid">
              {(domainStats.length > 0
                ? domainStats
                : [
                    {
                      category: "EPPP domains",
                      total: 0,
                      passed: 0,
                      pct: 0,
                      mastered: false,
                      unlocked: false,
                    },
                  ]
              ).map((d) => {
                const Icon = knowledgeDomainIcon(d.category);
                return (
                <div
                  key={d.category}
                  className="epd-domain epd-domain--loading"
                  data-testid={`eppp-domain-loading-${d.category
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")}`}
                >
                  <div className="epd-domain-top">
                    <span className="epd-domain-head">
                      <span className="epd-domain-icon">
                        <Icon aria-hidden />
                      </span>
                      <span className="epd-domain-name">{d.category}</span>
                    </span>
                  </div>
                  <div className="epd-bar">
                    <span className="epd-bar-fill epd-bar-fill--idle" />
                  </div>
                  <div className="epd-domain-foot">
                    <span>Checking progress…</span>
                  </div>
                </div>
                );
              })}
            </div>
          ) : domainStats.length === 0 ? (
            <div className="epd-empty">
              No EPPP domains are loaded for this dashboard yet.
            </div>
          ) : (
            <div className="epd-domain-grid">
              {domainStats.map((d) => {
                const Icon = knowledgeDomainIcon(d.category);
                return (
                  <Link
                    key={d.category}
                    href={epppDomainAnchor(d.category)}
                    className={`epd-domain${d.mastered ? " is-mastered" : ""}`}
                    data-testid={`eppp-domain-${d.category
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")}`}
                  >
                    <div className="epd-domain-top">
                      <span className="epd-domain-head">
                        <span className="epd-domain-icon">
                          <Icon aria-hidden />
                        </span>
                        <span className="epd-domain-name">{d.category}</span>
                      </span>
                      {d.mastered ? (
                        <span className="epd-badge epd-badge--mastered">
                          <CheckCircle2 aria-hidden /> Mastered
                        </span>
                      ) : null}
                    </div>
                    <div className="epd-bar">
                      <span
                        className="epd-bar-fill"
                        style={{ width: `${d.pct}%` }}
                      />
                    </div>
                    <div className="epd-domain-foot">
                      <span>
                        {d.passed}/{d.total} lessons
                      </span>
                      <span className="epd-domain-pct">{d.pct}%</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* What to study next */}
        <section className="epd-section" data-testid="eppp-study-next">
          <div className="epd-section-head text-scrim text-scrim-start">
            <div>
              <p className="epd-section-eyebrow">KEEP MOVING</p>
              <h2 className="epd-section-title">What to study next</h2>
            </div>
            <Link href="/eppp/suite/domains" className="epd-section-link">
              Browse domains <ArrowRight aria-hidden />
            </Link>
          </div>

          {recommendedLoading ? (
            <div className="epd-empty">Finding your next lessons…</div>
          ) : recommended.length === 0 ? (
            <div className="epd-empty">
              No lessons yet — start with any domain above.
            </div>
          ) : (
            <div className="epd-next-grid">
              {recommended.map((t) => (
                <button
                  key={t.topicId}
                  className="epd-next"
                  onClick={() => onNavigate(epppTopicPath(t.topicId))}
                  data-testid={`eppp-next-${t.topicId}`}
                >
                  <span className="epd-next-icon">
                    {t.score > 0 ? (
                      <Sparkles aria-hidden />
                    ) : (
                      <BookOpen aria-hidden />
                    )}
                  </span>
                  <span className="epd-next-body">
                    <span className="epd-next-name">{t.topicName}</span>
                    <span className="epd-next-meta">
                      {t.score > 0 ? `Last score ${t.score}%` : "Not started"}
                    </span>
                  </span>
                  <ArrowRight className="epd-next-arrow" aria-hidden />
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function EpppDashboardPage() {
  const [, navigate] = useLocation();
  const { user } = useUser();
  const userId = user?.id ?? "anon";

  const { data: summary, isLoading: summaryLoading } = useGetDashboardSummary();
  const { data: allTopics, isLoading: topicsLoading } = useGetTopics();
  const { date: examDate, setDate: setExamDate } = useExamDate(userId);
  const epppTopics = useMemo(
    () => (allTopics ?? []).filter((topic) => isEpppKnowledgeTopic(topic)),
    [allTopics],
  );
  const epppTopicIds = useMemo(
    () => new Set(epppTopics.map((topic) => topic.id)),
    [epppTopics],
  );

  // Domains (content areas) = distinct EPPP topic categories. The general app
  // also has categories like Foundations, Clinical, and Neuropsychology; those
  // belong to the main Courses surface and should not appear as EPPP domains.
  const categories = useMemo(
    () => groupEpppTopicsByCategory(epppTopics).map((group) => group.name),
    [epppTopics],
  );

  // One mastery-status request per domain, in parallel (cache shared with the
  // topics + main dashboard pages via the same query key).
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
      const s = masteryQueries[i]?.data;
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

  const masteredCount = domainStats.filter((d) => d.mastered).length;
  // Mean of raw passed/total ratios (round only the final display value to
  // avoid compounding per-domain rounding error).
  const readiness =
    domainStats.length > 0
      ? Math.round(
          (domainStats.reduce(
            (a, d) => a + (d.total > 0 ? d.passed / d.total : 0),
            0,
          ) /
            domainStats.length) *
            100,
        )
      : 0;

  // What to study next — weak areas first, then unfinished recents, then a
  // sensible fallback so new users still see somewhere to start.
  const recommended = useMemo<RecTopic[]>(() => {
    const seen = new Set<number>();
    const out: RecTopic[] = [];
    const push = (t: RecTopic) => {
      if (out.length >= 4 || seen.has(t.topicId)) return;
      seen.add(t.topicId);
      out.push(t);
    };
    (summary?.weakAreas ?? [])
      .filter((t) => epppTopicIds.has(t.topicId))
      .forEach((t) =>
        push({ topicId: t.topicId, topicName: t.topicName, score: t.score }),
      );
    (summary?.recentTopics ?? [])
      .filter((t) => epppTopicIds.has(t.topicId))
      .filter((t) => t.score < 80)
      .forEach((t) =>
        push({ topicId: t.topicId, topicName: t.topicName, score: t.score }),
      );
    [...epppTopics]
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((t) => push({ topicId: t.id, topicName: t.name, score: 0 }));
    return out;
  }, [summary, epppTopics, epppTopicIds]);

  return (
    <EpppDashboardView
      greetingName={user?.firstName ?? ""}
      readiness={readiness}
      readinessLoading={topicsLoading || masteryLoading || categories.length === 0}
      masteredCount={masteredCount}
      domainStats={domainStats}
      domainsLoading={topicsLoading || masteryLoading}
      avgScore={summary?.averageScore ?? 0}
      streak={summary?.currentStreak ?? 0}
      weekly={summary?.weeklyActivity ?? []}
      activeDays={(summary?.weeklyActivity ?? []).filter((d) => d.active).length}
      examDate={examDate}
      onSetExamDate={setExamDate}
      recommended={recommended}
      recommendedLoading={summaryLoading}
      onNavigate={navigate}
    />
  );
}

const styles = `
.epd-page {
  min-height: 100%;
  padding: clamp(14px, 2.4vw, 28px) clamp(16px, 4vw, 48px) clamp(48px, 6vw, 88px);
}
.epd-shell {
  max-width: 1120px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(18px, 2.4vw, 28px);
}

/* ---- Header ---- */
.epd-head {
  position: relative;
  min-height: clamp(92px, 10vw, 112px);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: clamp(24px, 3vw, 32px) clamp(18px, 4vw, 40px);
  text-align: center;
  border-radius: 16px;
  border: 1px solid ${C.hairlineStrong};
  background: linear-gradient(135deg, hsl(var(--surf-hue) 89% 21% / 0.96), hsl(var(--surf-hue) 87% 19% / 0.92));
  box-shadow: 0 18px 54px -42px rgba(118,228,247,0.78), inset 0 1px 0 rgba(255,255,255,0.08);
}
.epd-head-img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 57%;
  opacity: 0.62;
  filter: saturate(1.06) contrast(1.04);
}
.epd-head-shade {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 50% 52%, hsl(var(--surf-hue) 89% 21% / 0.12) 0%, hsl(var(--surf-hue) 89% 21% / 0.62) 55%, hsl(var(--surf-hue) 89% 21% / 0.94) 100%),
    linear-gradient(90deg, hsl(var(--surf-hue) 89% 21% / 0.96), hsl(var(--surf-hue) 89% 21% / 0.28) 48%, hsl(var(--surf-hue) 89% 21% / 0.96));
}
.epd-title {
  position: relative;
  z-index: 1;
  margin: 0;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(24px, 3.4vw, 34px);
  line-height: 1;
  letter-spacing: 0;
  color: ${C.cloud};
  text-shadow: 0 0 18px ${C.ink}, 0 0 28px rgba(118,228,247,0.36);
}

/* ---- Shared card ---- */
.epd-card {
  position: relative;
  border-radius: 20px;
  padding: clamp(18px, 2vw, 24px);
  background:
    radial-gradient(125% 80% at 50% 0%, rgba(118,228,247,0.06) 0%, rgba(118,228,247,0.00) 58%),
    linear-gradient(145deg, hsl(var(--surf-hue) 90% 18% / 0.90), hsl(var(--surf-hue) 90% 12% / 0.96));
  border: 1px solid rgba(196,232,242,0.22);
  backdrop-filter: blur(9px) saturate(140%);
  -webkit-backdrop-filter: blur(9px) saturate(140%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.10),
    inset 0 0 36px -24px rgba(118,228,247,0.16),
    0 0 20px -10px rgba(118,228,247,0.10),
    0 22px 52px -40px rgba(0,0,0,0.80);
}
.epd-card-label {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  margin: 0;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${C.mist};
}
.epd-card-label svg { width: 15px; height: 15px; color: ${C.cyan}; }
.epd-card-foot { margin: 12px 0 0; font-size: 12px; color: ${C.muted}; }

/* ---- Stat row ---- */
.epd-stat-row {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1fr;
  gap: clamp(14px, 1.6vw, 20px);
}
@media (max-width: 920px) { .epd-stat-row { grid-template-columns: 1fr 1fr; } .epd-card--readiness { grid-column: 1 / -1; } }
@media (max-width: 600px) { .epd-stat-row { grid-template-columns: 1fr; } }

.epd-card--readiness { display: flex; align-items: center; gap: clamp(16px, 2vw, 26px); }
.epd-ring { position: relative; width: 128px; height: 128px; flex-shrink: 0; }
.epd-ring-svg { width: 128px; height: 128px; transform: rotate(-90deg); }
.epd-ring-track { fill: none; stroke: rgba(118,228,247,0.12); stroke-width: 10; }
.epd-ring-fill {
  fill: none;
  stroke: ${C.cyan};
  stroke-width: 10;
  stroke-linecap: round;
  filter: drop-shadow(0 0 6px ${C.cyan}99);
  transition: stroke-dashoffset 900ms cubic-bezier(0.16,1,0.3,1);
}
.epd-ring-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.epd-ring-num { font-size: 30px; font-weight: 700; color: ${C.cloud}; line-height: 1; }
.epd-ring-cap { margin-top: 3px; font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; color: ${C.mist}; }
.epd-readiness-meta { min-width: 0; }
.epd-readiness-note { margin: 10px 0 0; font-size: 15px; font-weight: 600; color: ${C.cloud}; }
.epd-readiness-sub { margin: 6px 0 0; font-size: 12.5px; line-height: 1.5; color: ${C.body}; }

.epd-stat-big {
  margin: 12px 0 0;
  font-size: clamp(34px, 4vw, 44px);
  font-weight: 700;
  line-height: 1;
  color: ${C.cloud};
  display: flex;
  align-items: baseline;
  gap: 8px;
}
.epd-stat-unit { font-size: 14px; font-weight: 500; color: ${C.mist}; }

/* week dots */
.epd-week { display: flex; gap: 8px; margin-top: 16px; }
.epd-week-col { display: flex; flex-direction: column; align-items: center; gap: 6px; }
.epd-week-dot {
  width: 14px; height: 14px; border-radius: 999px;
  background: rgba(118,228,247,0.1);
  border: 1px solid rgba(118,228,247,0.2);
}
.epd-week-dot.is-active {
  background: ${C.cyan};
  border-color: ${C.cyan};
  box-shadow: 0 0 8px ${C.cyan}99;
}
.epd-week-lbl { font-size: 10px; color: ${C.muted}; }

/* exam */
.epd-card--exam { display: flex; flex-direction: column; }
.epd-exam-note { margin: 10px 0 0; font-size: 12.5px; line-height: 1.5; color: ${C.muted}; }
.epd-exam-edit {
  margin-top: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  font-size: 12px;
  font-weight: 600;
  color: ${C.mist};
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}
.epd-exam-edit svg { width: 13px; height: 13px; }
.epd-exam-edit:hover { color: ${C.cloud}; }
.epd-exam-prompt { margin: 12px 0 0; font-size: 13px; line-height: 1.5; color: ${C.body}; }
.epd-date-input {
  margin-top: 12px;
  width: 100%;
  padding: 9px 12px;
  border-radius: 10px;
  font-size: 14px;
  color: ${C.cloud};
  background: hsl(var(--surf-hue) 89% 21% / 0.6);
  border: 1px solid ${C.hairlineStrong};
  color-scheme: dark;
}
.epd-date-input:focus { outline: none; border-color: ${C.cyan}80; }
.epd-exam-save {
  margin-top: 12px;
  align-self: flex-start;
  padding: 9px 18px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  color: ${C.ink};
  border: 1px solid rgba(167,243,255,0.6);
  background: linear-gradient(135deg, ${C.mist} 0%, ${C.cyan} 100%);
  box-shadow: 0 0 18px -6px ${C.cyan}b3;
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}
.epd-exam-save:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 0 26px -4px ${C.cyan}d9; }
.epd-exam-save:disabled { opacity: 0.5; cursor: not-allowed; }

/* ---- Sections ---- */
.epd-section-head {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: clamp(14px, 2vw, 20px);
}
.epd-section-head--hero {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
}
.epd-section-head--hero .epd-section-eyebrow {
  color: #76e4f7;
  text-shadow: 0 0 14px rgba(118, 228, 247, 0.55);
}
.epd-section-head--hero .epd-section-title {
  font-size: clamp(24px, 3vw, 34px);
  color: #ffffff;
  text-shadow: 0 0 22px rgba(118, 228, 247, 0.45);
}
.epd-section-head--hero .epd-section-meta {
  color: #bff4ff;
}
.epd-section-eyebrow {
  margin: 0 0 6px;
  font-size: 11.5px;
  font-weight: 700;
  letter-spacing: 0.16em;
  color: ${C.cloud};
}
.epd-section-title {
  margin: 0;
  font-family: "Outfit", "Inter", system-ui, sans-serif;
  font-weight: 300;
  font-size: clamp(18px, 2.2vw, 26px);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${C.cloud};
}
.epd-section-meta { font-size: 13px; font-weight: 600; color: ${C.cloud}; white-space: nowrap; }
.epd-section-link {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; text-decoration: none; color: ${C.mist};
  white-space: nowrap;
}
.epd-section-link svg { width: 15px; height: 15px; transition: transform 0.2s ease; }
.epd-section-link:hover { color: ${C.cloud}; }
.epd-section-link:hover svg { transform: translateX(3px); }
.epd-empty {
  border-radius: 16px;
  padding: 28px;
  text-align: center;
  font-size: 14px;
  color: ${C.muted};
  border: 1px dashed ${C.hairline};
  background: hsl(var(--surf-hue) 91% 24% / 0.4);
}

/* domain grid */
.epd-domain-grid { display: grid; grid-template-columns: repeat(3, minmax(0,1fr)); gap: clamp(12px, 1.5vw, 18px); }
@media (max-width: 900px) { .epd-domain-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 560px) { .epd-domain-grid { grid-template-columns: 1fr; } }
.epd-domain {
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-radius: 16px;
  padding: 18px;
  text-decoration: none;
  background:
    radial-gradient(125% 80% at 50% 0%, rgba(118,228,247,0.10) 0%, rgba(118,228,247,0.00) 58%),
    linear-gradient(145deg, hsl(var(--surf-hue) 88% 19% / 0.74), hsl(var(--surf-hue) 88% 14% / 0.85));
  border: 1px solid rgba(196,232,242,0.22);
  backdrop-filter: blur(20px) saturate(135%);
  -webkit-backdrop-filter: blur(20px) saturate(135%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.12),
    inset 0 0 40px -22px rgba(118,228,247,0.42),
    0 0 24px -6px rgba(118,228,247,0.28),
    0 24px 60px -42px rgba(0,0,0,0.72);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.3s ease;
}
.epd-domain:hover { transform: translateY(-3px); border-color: ${C.cyan}66; box-shadow: 0 22px 56px -38px rgba(0,0,0,0.7), 0 0 24px -10px ${C.cyan}59; }
.epd-domain.is-mastered {
  border-color: ${C.cyan}5e;
  background:
    radial-gradient(125% 80% at 50% 0%, rgba(118,228,247,0.16) 0%, rgba(118,228,247,0.00) 60%),
    linear-gradient(145deg, hsl(var(--surf-hue) 85% 26% / 0.84), hsl(var(--surf-hue) 89% 19% / 0.90));
}
.epd-domain--loading { opacity: 0.85; }
.epd-bar-fill--idle {
  display: block; height: 100%; width: 35%; border-radius: 999px;
  background: rgba(118,228,247,0.28);
  animation: epd-pulse 1.3s ease-in-out infinite;
}
@keyframes epd-pulse { 0%,100% { opacity: 0.4; } 50% { opacity: 0.9; } }
.epd-domain-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; }
.epd-domain-head { display: flex; align-items: center; gap: 10px; min-width: 0; }
.epd-domain-icon {
  display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0;
  width: 34px; height: 34px; border-radius: 10px;
  color: ${C.cyan}; background: rgba(118,228,247,0.1); border: 1px solid rgba(118,228,247,0.28);
}
.epd-domain-icon svg { width: 17px; height: 17px; }
.epd-domain-name { font-size: 14.5px; font-weight: 600; color: ${C.cloud}; line-height: 1.3; }
.epd-badge {
  display: inline-flex; align-items: center; gap: 4px;
  flex-shrink: 0;
  padding: 3px 9px; border-radius: 999px;
  font-size: 10.5px; font-weight: 700; letter-spacing: 0.02em;
}
.epd-badge svg { width: 12px; height: 12px; }
.epd-badge--mastered { color: ${C.ink}; background: ${C.cyan}; }
.epd-bar { height: 7px; border-radius: 999px; background: rgba(118,228,247,0.1); overflow: hidden; }
.epd-bar-fill {
  display: block; height: 100%; border-radius: 999px;
  background: linear-gradient(90deg, ${C.cyan}, ${C.mist});
  box-shadow: 0 0 8px ${C.cyan}80;
  transition: width 800ms cubic-bezier(0.16,1,0.3,1);
}
.epd-domain-foot { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: ${C.muted}; }
.epd-domain-pct { font-weight: 700; color: ${C.mist}; }

/* study next */
.epd-next-grid { display: grid; grid-template-columns: repeat(2, minmax(0,1fr)); gap: 12px; }
@media (max-width: 700px) { .epd-next-grid { grid-template-columns: 1fr; } }
.epd-next {
  display: flex;
  align-items: center;
  gap: 14px;
  border-radius: 14px;
  padding: 14px 16px;
  text-align: left;
  cursor: pointer;
  background:
    radial-gradient(125% 80% at 50% 0%, rgba(118,228,247,0.10) 0%, rgba(118,228,247,0.00) 58%),
    linear-gradient(145deg, hsl(var(--surf-hue) 88% 19% / 0.74), hsl(var(--surf-hue) 88% 14% / 0.85));
  border: 1px solid rgba(196,232,242,0.22);
  backdrop-filter: blur(20px) saturate(135%);
  -webkit-backdrop-filter: blur(20px) saturate(135%);
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.12),
    inset 0 0 38px -22px rgba(118,228,247,0.40),
    0 0 22px -6px rgba(118,228,247,0.26),
    0 24px 60px -42px rgba(0,0,0,0.72);
  transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.3s ease;
}
.epd-next:hover { transform: translateY(-2px); border-color: ${C.cyan}66; box-shadow: 0 0 24px -12px ${C.cyan}80; }
.epd-next-icon {
  display: inline-flex; align-items: center; justify-content: center;
  width: 40px; height: 40px; flex-shrink: 0;
  border-radius: 11px;
  background: ${C.cyan}16; border: 1px solid ${C.cyan}40; color: ${C.cyan};
}
.epd-next-icon svg { width: 19px; height: 19px; }
.epd-next-body { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1; }
.epd-next-name { font-size: 14px; font-weight: 600; color: ${C.cloud}; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.epd-next-meta { font-size: 12px; color: ${C.body}; }
.epd-next-arrow { width: 16px; height: 16px; color: ${C.mist}; flex-shrink: 0; transition: transform 0.2s ease; }
.epd-next:hover .epd-next-arrow { transform: translateX(3px); }
`;
