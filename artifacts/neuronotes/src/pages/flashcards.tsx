import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { ChevronLeft, ChevronRight, RotateCcw, Layers, Lightbulb, Beaker, Lock, Zap } from "lucide-react";
import { useGetFlashcardsByTopic, useGetTopic } from "@workspace/api-client-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import UpgradePrompt from "@/components/upgrade-prompt";
import ElaborationPanel from "@/components/learning/elaboration-panel";
import { StudySurface } from "@/components/study/study-surface";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { useEntitlements } from "@/lib/use-entitlements";
import { PageTitle } from "@/components/brand/page-title";
import { epppTopicPath, isEpppRoute } from "@/lib/eppp-routes";
import { isEpppTopic } from "@/lib/eppp-content";

interface Props {
  params: { id: string };
}

const difficultyStyles: Record<string, { bg: string; color: string; border: string; label: string }> = {
  easy:   { bg: "rgba(189,229,255,0.55)", color: P.tealDeep, border: `${P.surf}66`, label: "Easy" },
  medium: { bg: "rgba(88,201,243,0.20)",  color: P.tealDeep, border: `${P.teal}55`, label: "Medium" },
  hard:   { bg: "rgba(244,114,98,0.16)",  color: "#B8453A",  border: "rgba(244,114,98,0.45)", label: "Hard" },
};

export default function FlashcardsPage({ params }: Props) {
  const [location, navigate] = useLocation();
  const topicId = parseInt(params.id);
  const inEppp = isEpppRoute(location);
  const backToTopic = inEppp ? epppTopicPath(topicId) : `/topics/${topicId}`;
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);

  const { data: flashcards, isLoading, error } = useGetFlashcardsByTopic(topicId);
  const { data: topic } = useGetTopic(topicId);
  const { data: ent } = useEntitlements();

  useEffect(() => {
    if (!inEppp && topic && isEpppTopic(topic)) {
      navigate(`${epppTopicPath(topicId)}/flashcards`);
    }
  }, [inEppp, navigate, topic, topicId]);

  const current = flashcards?.[index];
  const total = flashcards?.length ?? 0;
  // Free-tier preview: server slices to FREE_FLASHCARD_PREVIEW. If the topic
  // actually has more cards than we received, show the upgrade overlay once
  // the user reaches the last previewed card.
  const totalAvailable = topic?.flashcardCount ?? total;
  const isCapped = !!ent?.flashcardsCapped && totalAvailable > total;
  const onLastPreviewCard = isCapped && index >= total - 1;

  const fetchError = error as { status?: number } | null;
  if (fetchError?.status === 402) {
    return <UpgradePrompt reason="flashcards" onDismiss={() => navigate(backToTopic)} />;
  }

  // Free-tier gating now happens once on the topic detail page (see
  // useTopicAccessGate). Inside a topic the user already has access to,
  // flips/answers are unmetered.
  const handleFlip = () => {
    setFlipped((f) => !f);
  };

  const handleNext = () => {
    setFlipped(false);
    setTimeout(() => setIndex(i => Math.min(i + 1, total - 1)), 150);
  };

  const handlePrev = () => {
    setFlipped(false);
    setTimeout(() => setIndex(i => Math.max(i - 1, 0)), 150);
  };

  const handleRestart = () => {
    setFlipped(false);
    setIndex(0);
  };

  if (showUpgrade) {
    return <UpgradePrompt onDismiss={() => setShowUpgrade(false)} />;
  }

  return (
    <div className="min-h-full study-page-bg" data-testid="flashcards-page">
      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:p-8">
      <Breadcrumbs items={[
        { label: inEppp ? "EPPP Domains" : "Topics", href: inEppp ? "/eppp/suite/domains" : "/topics" },
        { label: topic?.name ?? "Topic", href: backToTopic },
        { label: "Flashcards" },
      ]} />
      <div className="relative mb-6">
        <PageTitle
          title="Flashcards"
          icon={Layers}
          subtitle={
            !isLoading
              ? isCapped
                ? `Showing ${total} of ${totalAvailable} cards`
                : `${total} cards`
              : undefined
          }
          className="mb-0"
        />
        <div className="absolute right-0 top-0 flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate(inEppp ? "/eppp/suite/study-plan" : "/study-lab")}
                className="text-muted-foreground hover:text-foreground p-1.5 rounded-none hover:bg-accent transition-colors"
                data-testid="button-study-lab"
                aria-label="Open Study Lab"
              >
                <Beaker className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Open Study Lab — evidence-based techniques</p>
            </TooltipContent>
          </Tooltip>
          <Sheet>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <button
                    className="text-muted-foreground hover:text-foreground p-1.5 rounded-none hover:bg-accent transition-colors"
                    data-testid="button-reflect"
                    aria-label="Open elaboration panel"
                  >
                    <Lightbulb className="w-4 h-4" />
                  </button>
                </SheetTrigger>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Reflect — elaboration prompts to deepen learning</p>
              </TooltipContent>
            </Tooltip>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader className="mb-4">
                <SheetTitle>Reflect on this card</SheetTitle>
                <SheetDescription>
                  Use a prompt to elaborate on what you just studied. Notes save to this device.
                </SheetDescription>
              </SheetHeader>
              <ElaborationPanel
                storageKey={`flashcards-topic-${topicId}`}
                context={current ? `Card ${index + 1} of ${total}: ${current.question}` : undefined}
              />
            </SheetContent>
          </Sheet>
          <Tooltip>
            <TooltipTrigger asChild>
              <button onClick={handleRestart} className="text-muted-foreground hover:text-foreground p-1.5 rounded-none hover:bg-accent transition-colors" data-testid="button-restart" aria-label="Restart">
                <RotateCcw className="w-4 h-4" />
              </button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Restart deck</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {isLoading ? (
        <Skeleton className="h-72 rounded-2xl" />
      ) : total === 0 ? (
        <div className="text-center py-16 text-muted-foreground">No flashcards for this topic.</div>
      ) : (
        <>
          <div className="text-center text-xs font-semibold tracking-wider uppercase mb-3" style={{ color: P.tealDeep }}>
            Card {index + 1} of {total}
          </div>

          <div className="relative mb-4">
            <div className="w-full rounded-full h-1.5 mb-8 overflow-hidden" style={{ background: "rgba(47,160,198,0.12)" }}>
              <div
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: `${((index + 1) / total) * 100}%`,
                  background: `linear-gradient(90deg, ${P.teal}, ${P.surf})`,
                }}
              />
            </div>

            <div
              className="flashcard-container cursor-pointer select-none"
              onClick={handleFlip}
              data-testid="flashcard"
            >
              <div className={`flashcard-inner min-h-64 md:min-h-80 ${flipped ? "flipped" : ""}`}>
                <div className="flashcard-front">
                  <StudySurface
                    tone="card-front"
                    glow
                    pill={current ? { text: difficultyStyles[current.difficulty]?.label ?? current.difficulty } : undefined}
                    fillHeight
                    innerClassName="p-8 md:p-10 min-h-64 md:min-h-80 flex flex-col justify-center items-center"
                  >
                    <div className="flex-1 flex items-center justify-center w-full">
                      <p
                        className="text-center text-lg md:text-xl font-medium leading-relaxed text-white"
                        data-testid="text-flashcard-question"
                      >
                        {current?.question}
                      </p>
                    </div>
                    <p className="text-[11px] mt-4 tracking-wide uppercase text-white/70">
                      Tap to reveal answer
                    </p>
                  </StudySurface>
                </div>
                <div className="flashcard-back">
                  <StudySurface
                    tone="accent"
                    pill={{ text: "Answer" }}
                    fillHeight
                    innerClassName="p-8 md:p-10 min-h-64 md:min-h-80 flex flex-col items-center justify-center"
                  >
                    <p
                      className="text-center text-base md:text-lg leading-relaxed text-white font-medium"
                      data-testid="text-flashcard-answer"
                    >
                      {current?.answer}
                    </p>
                  </StudySurface>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <Button variant="outline" onClick={handlePrev} disabled={index === 0} data-testid="button-prev">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button onClick={handleNext} disabled={index === total - 1} data-testid="button-next">
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {/* Shown-but-locked CTA: appears once a free user reaches the last
              previewed card in a deck that has more cards on the server. */}
          {onLastPreviewCard && (
            <div
              className="mt-6 rounded-xl border p-5 text-center"
              style={{
                background: `linear-gradient(135deg, ${P.bg}, ${P.surface})`,
                borderColor: `${P.surf}55`,
                boxShadow: `0 14px 32px -18px ${P.tealDeep}aa`,
              }}
              data-testid="flashcards-upgrade-cta"
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
                style={{ background: `rgba(94,176,200,0.25)`, border: `1px solid ${P.surf}55` }}
              >
                <Lock className="w-5 h-5 text-white" />
              </div>
              <p className="font-semibold text-white mb-1">
                {totalAvailable - total} more {totalAvailable - total === 1 ? "card" : "cards"} waiting
              </p>
              <p className="text-sm text-white/75 mb-4">
                Upgrade to PsychPro Master to study every card in this deck.
              </p>
              <Button onClick={() => navigate("/subscription")} data-testid="button-upgrade-from-flashcards">
                <Zap className="w-4 h-4 mr-2" />
                Upgrade to Master
              </Button>
            </div>
          )}
        </>
      )}
      </div>
    </div>
  );
}
