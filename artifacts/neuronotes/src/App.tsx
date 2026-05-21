import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setUserIdProvider } from "@workspace/api-client-react";
import { getOrCreateAnonymousUserId } from "@/lib/anonymous-user";
import { ClerkTokenBridge } from "@/components/auth/clerk-token-bridge";
import { RequireSignedIn } from "@/components/auth/require-signed-in";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";
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
import FeaturedWorkPage from "@/pages/featured-work";
import AdminFeaturedWorkPage from "@/pages/admin-featured-work";
import ConnectionsPage from "@/pages/connections";
import AdminConnectionsPage from "@/pages/admin-connections";
import PublicProfilePage from "@/pages/public-profile";
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

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
if (!clerkPublishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      {import.meta.env.DEV ? <Route path="/__crash-test" component={CrashTestPage} /> : null}
      <Route>
        <RequireSignedIn>
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
            <Route path="/featured-work" component={FeaturedWorkPage} />
            <Route path="/feature-request" component={FeatureRequestPage} />
            <Route path="/admin/featured-work" component={AdminFeaturedWorkPage} />
            <Route path="/connections" component={ConnectionsPage} />
            <Route path="/admin/connections" component={AdminConnectionsPage} />
            <Route path="/u/:userId" component={PublicProfilePage} />
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
        </RequireSignedIn>
      </Route>
    </Switch>
  );
}

function App() {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  return (
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={clerkPublishableKey!}
        signInUrl={`${basePath}/sign-in`}
        signUpUrl={`${basePath}/sign-up`}
        signInFallbackRedirectUrl={`${basePath}/dashboard`}
        signUpFallbackRedirectUrl={`${basePath}/dashboard`}
      >
        <ClerkTokenBridge />
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={basePath}>
              <AppRouter />
            </WouterRouter>
            <Toaster />
            <SonnerToaster />
          </TooltipProvider>
        </QueryClientProvider>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
