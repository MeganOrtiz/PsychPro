import { Link, useLocation } from "wouter";
import { Layers, BookOpen, FileText, GraduationCap, Beaker, ArrowRight, Lock } from "lucide-react";
import { useGetTopic } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import SpacedRepetitionScheduler from "@/components/learning/spaced-repetition";
import { PageTitle } from "@/components/brand/page-title";
import { Breadcrumbs, type BreadcrumbItem } from "@/components/breadcrumbs";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { useEntitlements } from "@/lib/use-entitlements";
import { epppDomainAnchor, epppTopicModePath, isEpppRoute } from "@/lib/eppp-routes";

interface Props {
  params: { id: string };
}

export default function TopicDetailPage({ params }: Props) {
  const [location, navigate] = useLocation();
  const topicId = parseInt(params.id);
  const inEppp = isEpppRoute(location);
  const { data: topic, isLoading } = useGetTopic(topicId);
  // Free-tier model is now per-content (not per-topic). The topic page itself
  // is never blocked — locks live on the individual mode cards below.
  const { data: ent } = useEntitlements();

  // Per-mode accent palette. Each card gets its own glow color so the
  // four study modes read as distinct destinations instead of a flat
  // stack of identical tiles. Hues stay inside the cerulean / teal /
  // violet family so the palette still feels cohesive with the rest
  // of the app.
  const studyModes = [
    {
      icon: Layers,
      title: "Flashcards",
      description: ent?.flashcardsCapped
        ? `Preview the first ${ent.flashcardPreviewLimit} cards`
        : "Tap to flip and test your recall",
      onClick: () => navigate(inEppp ? epppTopicModePath(topicId, "flashcards") : `/topics/${topicId}/flashcards`),
      testId: "button-flashcards",
      accent: "#5EB0C8",
      accentDeep: "#1F6B83",
      locked: false,
    },
    {
      icon: BookOpen,
      title: "Quiz",
      description: ent?.quizLocked
        ? "Upgrade to Master for unlimited quizzes"
        : "Multiple-choice with explanations",
      onClick: () => navigate(inEppp ? epppTopicModePath(topicId, "quiz") : `/topics/${topicId}/quiz`),
      testId: "button-quiz",
      accent: "#5EB0C8",
      accentDeep: "#1F6B83",
      locked: !!ent?.quizLocked,
    },
    {
      icon: FileText,
      title: "Study Guide",
      description: ent?.studyGuideLocked
        ? "Master feature — comprehensive notes"
        : "Comprehensive scrollable notes",
      onClick: () => navigate(inEppp ? epppTopicModePath(topicId, "study-guide") : `/topics/${topicId}/study-guide`),
      testId: "button-study-guide",
      accent: "#5EB0C8",
      accentDeep: "#1F6B83",
      locked: !!ent?.studyGuideLocked,
    },
    {
      icon: GraduationCap,
      title: "Practice Exam",
      description: ent?.examLocked
        ? "Upgrade to Master for unlimited exams"
        : "Timed or untimed full exam",
      onClick: () => navigate(inEppp ? epppTopicModePath(topicId, "exam") : `/topics/${topicId}/exam`),
      testId: "button-practice-exam",
      accent: "#5EB0C8",
      accentDeep: "#1F6B83",
      locked: !!ent?.examLocked,
    },
  ];

  const crumbs: BreadcrumbItem[] = [
    { label: inEppp ? "EPPP Domains" : "Topics", href: inEppp ? "/eppp/suite/domains" : "/topics" },
    ...(topic?.category
      ? [
          {
            label: topic.category,
            href: inEppp
              ? epppDomainAnchor(topic.category)
              : `/topics#category-${topic.category.toLowerCase().replace(/\s+/g, "-")}`,
          },
        ]
      : []),
    { label: topic?.name ?? "…" },
  ];

  return (
    <div className="min-h-full study-page-bg" data-testid="topic-detail-page">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8">
        <Breadcrumbs items={crumbs} />

        {isLoading ? (
          <div>
            <Skeleton className="h-8 w-2/3 mb-3" />
            <Skeleton className="h-16 mb-6" />
            <div className="grid grid-cols-1 gap-4">
              {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
            </div>
          </div>
        ) : !topic ? (
          <div className="text-center py-16 text-muted-foreground">Topic not found.</div>
        ) : (
          <>
            <PageTitle title={topic.name} subtitle={topic.category} className="mb-4" />
            <p className="text-muted-foreground mb-4 text-center">{topic.description}</p>

            <div className="flex gap-4 mb-6 text-sm text-muted-foreground justify-center">
              <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" />{topic.flashcardCount} flashcards</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{topic.quizCount} questions</span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4" style={{ color: P.tealDeep }} />
              <h2 className="font-semibold text-foreground">Study Modes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {studyModes.map(mode => (
                <button
                  key={mode.title}
                  onClick={mode.onClick}
                  data-testid={mode.testId}
                  aria-label={mode.locked ? `${mode.title} — locked, requires PsychPro Master` : mode.title}
                  className="recommended-tile group relative flex items-center gap-4 p-5 rounded-xl text-left border hover:-translate-y-0.5 active:translate-y-0 overflow-hidden"
                  style={{ color: "#FFFFFF" }}
                >
                  {/* Animated sheen — a faint diagonal highlight that drifts
                      across on hover, the way a glossy button catches light. */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(115deg, transparent 35%, ${mode.accent}22 50%, transparent 65%)`,
                    }}
                  />
                  <div
                    className="relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      // Icon tile gets the accent in concentrated form so it
                      // reads as the card's color signature at a glance.
                      background: `linear-gradient(135deg, ${mode.accent} 0%, ${mode.accentDeep} 100%)`,
                      boxShadow: `
                        0 0 0 1px ${mode.accent}66 inset,
                        0 8px 20px -8px ${mode.accent}aa,
                        0 0 24px -4px ${mode.accent}55
                      `,
                    }}
                  >
                    <mode.icon className="w-5 h-5 text-white drop-shadow" />
                  </div>
                  <div className="relative flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-white text-base">{mode.title}</p>
                      {mode.locked && (
                        <span
                          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(255,255,255,0.18)", color: "#FFFFFF" }}
                          data-testid={`badge-locked-${mode.testId}`}
                        >
                          <Lock className="w-2.5 h-2.5" /> Master
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/75">{mode.description}</p>
                  </div>
                  <ArrowRight
                    className="relative w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5"
                    style={{ color: mode.accent }}
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8 mb-3">
              <div className="flex items-center gap-2">
                <Beaker className="w-4 h-4" style={{ color: P.tealDeep }} />
                <h2 className="font-semibold text-foreground">Retention Plan</h2>
              </div>
              {/* Routes /study-lab in the Lab section, which is being relabeled
                  "Rounds" per the sidebar restructure brief. Route stays the same. */}
              <Link href={inEppp ? "/eppp/suite/study-plan" : "/study-lab"}>
                <span className="text-xs hover:underline cursor-pointer" style={{ color: P.tealDeep }}>
                  Why this works →
                </span>
              </Link>
            </div>
            <SpacedRepetitionScheduler
              storageKey={`topic-${topicId}`}
              cardTitle={topic.name}
              cardSummary="Mark this topic as reviewed each time you finish a study session. Hitting all four checkpoints typically moves material into durable long-term memory."
            />
          </>
        )}
      </div>
    </div>
  );
}
