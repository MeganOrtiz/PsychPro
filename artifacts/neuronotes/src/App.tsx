import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setUserIdProvider } from "@workspace/api-client-react";
import { getOrCreateAnonymousUserId } from "@/lib/anonymous-user";
import LandingPage from "@/pages/landing";
import OnboardingPage from "@/pages/onboarding";
import DashboardPage from "@/pages/dashboard";
import TopicsPage from "@/pages/topics";
import TopicDetailPage from "@/pages/topic-detail";
import FlashcardsPage from "@/pages/flashcards";
import QuizPage from "@/pages/quiz";
import StudyGuidePage from "@/pages/study-guide";
import PracticeExamPage from "@/pages/practice-exam";
import ProgressPage from "@/pages/progress";
import LeaderboardPage from "@/pages/leaderboard";
import SubscriptionPage from "@/pages/subscription";
import FeedbackPage from "@/pages/feedback";
import FeatureRequestPage from "@/pages/feature-request";
import ResourcesPage from "@/pages/resources";
import StudyLabPage from "@/pages/study-lab";
import BrainLabPage from "@/pages/brain-lab";
import AdminFeedbackPage from "@/pages/admin-feedback";
import AdminTokensPage from "@/pages/admin-tokens";
import MyDecksPage from "@/pages/my-decks";
import NewDeckPage from "@/pages/my-decks-new";
import MyDeckDetailPage from "@/pages/my-decks-detail";
import ReflectionsPage from "@/pages/reflections";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/app-layout";
import { ErrorBoundary } from "@/components/error-boundary";
import CrashTestPage from "@/pages/crash-test";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

setUserIdProvider(() => getOrCreateAnonymousUserId());

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      {import.meta.env.DEV ? <Route path="/__crash-test" component={CrashTestPage} /> : null}
      <Route>
        <AppLayout>
          <Switch>
            <Route path="/onboarding" component={OnboardingPage} />
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/topics" component={TopicsPage} />
            <Route path="/topics/:id" component={TopicDetailPage} />
            <Route path="/topics/:id/flashcards" component={FlashcardsPage} />
            <Route path="/topics/:id/quiz" component={QuizPage} />
            <Route path="/topics/:id/study-guide" component={StudyGuidePage} />
            <Route path="/topics/:id/exam" component={PracticeExamPage} />
            <Route path="/progress" component={ProgressPage} />
            <Route path="/leaderboard" component={LeaderboardPage} />
            <Route path="/subscription" component={SubscriptionPage} />
            <Route path="/feedback" component={FeedbackPage} />
            <Route path="/feature-request" component={FeatureRequestPage} />
            <Route path="/resources" component={ResourcesPage} />
            <Route path="/study-lab" component={StudyLabPage} />
            <Route path="/brain-lab" component={BrainLabPage} />
            <Route path="/admin/feedback" component={AdminFeedbackPage} />
            <Route path="/admin/tokens" component={AdminTokensPage} />
            <Route path="/my-decks" component={MyDecksPage} />
            <Route path="/my-decks/new" component={NewDeckPage} />
            <Route path="/my-decks/:id" component={MyDeckDetailPage} />
            <Route path="/reflections" component={ReflectionsPage} />
            <Route path="/profile" component={ProfilePage} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AppRouter />
          </WouterRouter>
          <Toaster />
          <SonnerToaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
