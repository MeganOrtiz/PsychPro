import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkProvider, useUser, useAuth } from "@clerk/react";
import { useEffect } from "react";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import LandingPage from "@/pages/landing";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";
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
import AdminFeedbackPage from "@/pages/admin-feedback";
import MyDecksPage from "@/pages/my-decks";
import NewDeckPage from "@/pages/my-decks-new";
import MyDeckDetailPage from "@/pages/my-decks-detail";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/app-layout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkTokenSetup() {
  const { getToken } = useAuth();

  useEffect(() => {
    setAuthTokenGetter(async () => {
      try {
        return await getToken();
      } catch {
        return null;
      }
    });
    return () => {
      setAuthTokenGetter(null);
    };
  }, [getToken]);

  return null;
}

function AuthRouter() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/sign-in" component={SignInPage} />
      <Route path="/sign-up" component={SignUpPage} />
      {isSignedIn ? (
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
            <Route path="/admin/feedback" component={AdminFeedbackPage} />
            <Route path="/my-decks" component={MyDecksPage} />
            <Route path="/my-decks/new" component={NewDeckPage} />
            <Route path="/my-decks/:id" component={MyDeckDetailPage} />
            <Route component={NotFound} />
          </Switch>
        </AppLayout>
      ) : (
        <Route component={LandingPage} />
      )}
    </Switch>
  );
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey} signInUrl="/sign-in" signUpUrl="/sign-up">
      <ClerkTokenSetup />
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AuthRouter />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

export default App;
