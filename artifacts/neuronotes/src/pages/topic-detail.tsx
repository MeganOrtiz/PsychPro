import { Link, useLocation } from "wouter";
import { Layers, BookOpen, FileText, GraduationCap, ChevronLeft, Beaker, ArrowRight } from "lucide-react";
import { useGetTopic } from "@workspace/api-client-react";
import { Skeleton } from "@/components/ui/skeleton";
import SpacedRepetitionScheduler from "@/components/learning/spaced-repetition";
import CategoryHero from "@/components/learning/category-hero";
import { STUDY_PALETTE as P } from "@/lib/study-theme";

interface Props {
  params: { id: string };
}

export default function TopicDetailPage({ params }: Props) {
  const [, navigate] = useLocation();
  const topicId = parseInt(params.id);
  const { data: topic, isLoading } = useGetTopic(topicId);

  const studyModes = [
    {
      icon: Layers,
      title: "Flashcards",
      description: "Tap to flip and test your recall",
      gradient: `linear-gradient(135deg, ${P.teal}, ${P.surf})`,
      onClick: () => navigate(`/topics/${topicId}/flashcards`),
      testId: "button-flashcards",
    },
    {
      icon: BookOpen,
      title: "Quiz",
      description: "Multiple-choice with explanations",
      gradient: `linear-gradient(135deg, ${P.surf}, ${P.mist})`,
      onClick: () => navigate(`/topics/${topicId}/quiz`),
      testId: "button-quiz",
    },
    {
      icon: FileText,
      title: "Study Guide",
      description: "Comprehensive scrollable notes",
      gradient: `linear-gradient(135deg, ${P.tealDeep}, ${P.teal})`,
      onClick: () => navigate(`/topics/${topicId}/study-guide`),
      testId: "button-study-guide",
    },
    {
      icon: GraduationCap,
      title: "Practice Exam",
      description: "Timed or untimed full exam",
      gradient: `linear-gradient(135deg, #1F4F66, ${P.tealDeep})`,
      onClick: () => navigate(`/topics/${topicId}/exam`),
      testId: "button-practice-exam",
    },
  ];

  return (
    <div className="min-h-full study-page-bg" data-testid="topic-detail-page">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
        <button
          onClick={() => navigate("/topics")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          data-testid="button-back"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Topics
        </button>

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
            <CategoryHero category={topic.category} topicName={topic.name} />
            <p className="text-muted-foreground mb-4">{topic.description}</p>

            <div className="flex gap-4 mb-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" />{topic.flashcardCount} flashcards</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{topic.quizCount} questions</span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4" style={{ color: P.tealDeep }} />
              <h2 className="font-semibold text-foreground">Study Modes</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {studyModes.map(mode => (
                <button
                  key={mode.title}
                  onClick={mode.onClick}
                  data-testid={mode.testId}
                  className="group flex items-center gap-4 p-5 rounded-xl border bg-white text-left transition-all hover:-translate-y-0.5"
                  style={{
                    borderColor: `${P.surf}55`,
                    boxShadow: `0 10px 28px -16px ${P.teal}66`,
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center border shrink-0 transition-transform group-hover:scale-105"
                    style={{ background: mode.gradient, borderColor: P.tealDeep }}
                  >
                    <mode.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{mode.title}</p>
                    <p className="text-sm text-muted-foreground">{mode.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: P.tealDeep }} />
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mt-8 mb-3">
              <div className="flex items-center gap-2">
                <Beaker className="w-4 h-4" style={{ color: P.tealDeep }} />
                <h2 className="font-semibold text-foreground">Retention Plan</h2>
              </div>
              <Link href="/study-lab">
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
