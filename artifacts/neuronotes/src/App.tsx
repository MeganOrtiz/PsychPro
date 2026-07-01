import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ClerkTokenBridge } from "@/components/auth/clerk-token-bridge";
import { RequireSignedIn } from "@/components/auth/require-signed-in";
import { RequireOnboarded } from "@/components/auth/require-onboarded";
import { PostAuthRedirect } from "@/components/auth/post-auth-redirect";
import SignInPage from "@/pages/sign-in";
import SignUpPage from "@/pages/sign-up";
import LandingPage from "@/pages/landing";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import OnboardingPage from "@/pages/onboarding";
import DashboardPage from "@/pages/dashboard";
import TopicsPage from "@/pages/topics";
import TopicDetailPage from "@/pages/topic-detail";
import FlashcardsPage from "@/pages/flashcards";
import QuizPage from "@/pages/quiz";
import StudyGuidePage from "@/pages/study-guide";
import PracticeExamPage from "@/pages/practice-exam";
import CourseMasteryExamPage from "@/pages/course-mastery-exam";
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
import EpppPage from "@/pages/eppp";
import AdminFeedbackPage from "@/pages/admin-feedback";
import AdminTokensPage from "@/pages/admin-tokens";
import MyDecksPage from "@/pages/my-decks";
import NewDeckPage from "@/pages/my-decks-new";
import MyDeckDetailPage from "@/pages/my-decks-detail";
import ReflectionsPage from "@/pages/reflections";
import ProfilePage from "@/pages/profile";
import EpppSuitePage from "@/pages/eppp-suite";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/app-layout";
import { ErrorBoundary } from "@/components/error-boundary";
import CrashTestPage from "@/pages/crash-test";
import DevGlassPreview from "@/pages/dev-glass-preview";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// In dev builds, prefer VITE_CLERK_PUBLISHABLE_KEY_DEV when set so the
// Replit dev domain can use a dev Clerk instance instead of the production
// keys (which reject any origin other than auth.psychprosuite.com). Falls
// back to the prod publishable key when the dev override is not set, so
// production builds and existing dev setups are unaffected.
// Tolerate values accidentally pasted with their env-var name prefix
// (e.g. "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...") or wrapped in
// quotes/whitespace, by extracting the bare pk_test_/pk_live_ token.
function normalizeClerkKey(value: string | undefined): string | undefined {
  if (!value) return value;
  const match = value.match(/pk_(?:test|live)_[^\s"']+/);
  return match ? match[0] : value.trim();
}

const devClerkPublishableKey = normalizeClerkKey(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY_DEV as string | undefined,
);
const prodClerkPublishableKey = normalizeClerkKey(
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined,
);
const clerkPublishableKey: string | undefined = import.meta.env.DEV
  ? devClerkPublishableKey || prodClerkPublishableKey
  : prodClerkPublishableKey;
if (!clerkPublishableKey) {
  throw new Error("Missing VITE_CLERK_PUBLISHABLE_KEY environment variable");
}

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/sign-in/*?" component={SignInPage} />
      <Route path="/sign-up/*?" component={SignUpPage} />
      {import.meta.env.DEV ? <Route path="/__crash-test" component={CrashTestPage} /> : null}
      {import.meta.env.DEV ? <Route path="/__glass-preview" component={DevGlassPreview} /> : null}
      <Route path="/eppp">
        {() => (
          <RequireOnboarded>
            <EpppPage />
          </RequireOnboarded>
        )}
      </Route>
      <Route path="/eppp/suite/:tab?">
        {(params) => (
          <RequireOnboarded>
            <EpppSuitePage tab={params.tab} />
          </RequireOnboarded>
        )}
      </Route>
      <Route path="/eppp/dashboard">
        {() => (
          <RequireOnboarded>
            <EpppSuitePage tab="performance-analytics" />
          </RequireOnboarded>
        )}
      </Route>
      <Route path="/eppp/skills">
        {() => (
          <RequireOnboarded>
            <EpppSuitePage tab="part-2-skills" />
          </RequireOnboarded>
        )}
      </Route>
      <Route path="/eppp/clinical-cases">
        {() => (
          <RequireOnboarded>
            <EpppSuitePage tab="clinical-cases" />
          </RequireOnboarded>
        )}
      </Route>
      <Route path="/eppp/rapid-review">
        {() => (
          <RequireOnboarded>
            <EpppSuitePage tab="rapid-review" />
          </RequireOnboarded>
        )}
      </Route>
      <Route path="/eppp/topics/:id">
        {(params) => (
          <RequireOnboarded>
            <TopicDetailPage params={params} />
          </RequireOnboarded>
        )}
      </Route>
      <Route path="/eppp/topics/:id/flashcards">
        {(params) => (
          <RequireOnboarded>
            <FlashcardsPage params={params} />
          </RequireOnboarded>
        )}
      </Route>
      <Route path="/eppp/topics/:id/quiz">
        {(params) => (
          <RequireOnboarded>
            <QuizPage params={params} />
          </RequireOnboarded>
        )}
      </Route>
      <Route path="/eppp/topics/:id/study-guide">
        {(params) => (
          <RequireOnboarded>
            <StudyGuidePage params={params} />
          </RequireOnboarded>
        )}
      </Route>
      <Route path="/eppp/topics/:id/exam">
        {(params) => (
          <RequireOnboarded>
            <PracticeExamPage params={params} />
          </RequireOnboarded>
        )}
      </Route>
      <Route path="/eppp/courses/:category/mastery-exam">
        {(params) => (
          <RequireOnboarded>
            <CourseMasteryExamPage params={params} />
          </RequireOnboarded>
        )}
      </Route>
      <Route path="/welcome">
        {() => (
          <RequireSignedIn>
            <PostAuthRedirect />
          </RequireSignedIn>
        )}
      </Route>
      <Route path="/onboarding">
        {() => (
          <RequireSignedIn>
            <OnboardingPage />
          </RequireSignedIn>
        )}
      </Route>
      {/* Subscription/plans is reachable without finishing onboarding so the
          landing "Browse courses" CTA can show plan options instead of forcing
          the onboarding flow. Auth-gated (RequireSignedIn) but not
          onboarding-gated. */}
      <Route path="/subscription">
        {() => (
          <RequireSignedIn>
            <AppLayout>
              <SubscriptionPage />
            </AppLayout>
          </RequireSignedIn>
        )}
      </Route>
      <Route>
        <RequireOnboarded>
          <AppLayout>
            <Switch>
            <Route path="/dashboard" component={DashboardPage} />
            <Route path="/topics" component={TopicsPage} />
            <Route path="/topics/:id" component={TopicDetailPage} />
            <Route path="/topics/:id/flashcards" component={FlashcardsPage} />
            <Route path="/topics/:id/quiz" component={QuizPage} />
            <Route path="/topics/:id/study-guide" component={StudyGuidePage} />
            <Route path="/topics/:id/exam" component={PracticeExamPage} />
            <Route path="/courses/:category/mastery-exam" component={CourseMasteryExamPage} />
            <Route path="/progress" component={ProgressPage} />
            <Route path="/leaderboard" component={LeaderboardPage} />
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
        </RequireOnboarded>
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
