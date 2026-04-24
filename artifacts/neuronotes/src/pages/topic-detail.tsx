import { useLocation } from "wouter";
import { Layers, BookOpen, FileText, GraduationCap, ChevronLeft, Clock } from "lucide-react";
import { useGetTopic } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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
      color: "text-blue-500",
      bg: "bg-blue-50 dark:bg-blue-950/30",
      border: "border-blue-200 dark:border-blue-800",
      onClick: () => navigate(`/topics/${topicId}/flashcards`),
      testId: "button-flashcards",
    },
    {
      icon: BookOpen,
      title: "Quiz",
      description: "Multiple-choice with explanations",
      color: "text-green-500",
      bg: "bg-green-50 dark:bg-green-950/30",
      border: "border-green-200 dark:border-green-800",
      onClick: () => navigate(`/topics/${topicId}/quiz`),
      testId: "button-quiz",
    },
    {
      icon: FileText,
      title: "Study Guide",
      description: "Comprehensive scrollable notes",
      color: "text-purple-500",
      bg: "bg-purple-50 dark:bg-purple-950/30",
      border: "border-purple-200 dark:border-purple-800",
      onClick: () => navigate(`/topics/${topicId}/study-guide`),
      testId: "button-study-guide",
    },
    {
      icon: GraduationCap,
      title: "Practice Exam",
      description: "Timed or untimed full exam",
      color: "text-amber-500",
      bg: "bg-amber-50 dark:bg-amber-950/30",
      border: "border-amber-200 dark:border-amber-800",
      onClick: () => navigate(`/topics/${topicId}/exam`),
      testId: "button-practice-exam",
    },
  ];

  return (
    <div className="min-h-full bg-background" data-testid="topic-detail-page">
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
            <Badge variant="secondary" className="mb-3">{topic.category}</Badge>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{topic.name}</h1>
            <p className="text-muted-foreground mb-4">{topic.description}</p>

            <div className="flex gap-4 mb-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5"><Layers className="w-4 h-4" />{topic.flashcardCount} flashcards</span>
              <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{topic.quizCount} questions</span>
            </div>

            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-4 h-4 text-primary" />
              <h2 className="font-semibold text-foreground">Study Modes</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {studyModes.map(mode => (
                <button
                  key={mode.title}
                  onClick={mode.onClick}
                  data-testid={mode.testId}
                  className="flex items-center gap-4 p-5 rounded-xl border border-border bg-card text-left hover:border-primary/40 hover:shadow-sm transition-all"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mode.bg}`}>
                    <mode.icon className={`w-5 h-5 ${mode.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{mode.title}</p>
                    <p className="text-sm text-muted-foreground">{mode.description}</p>
                  </div>
                  <ChevronLeft className="w-4 h-4 text-muted-foreground rotate-180" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
