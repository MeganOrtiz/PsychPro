import { lazy, Suspense } from "react";
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
import AppLayout from "@/components/layout/app-layout";
import { ErrorBoundary } from "@/components/error-boundary";
import { FullScreenLoader } from "@/components/full-screen-loader";
import { STUDY_PALETTE as P } from "@/lib/study-theme";
import { PP } from "@/lib/palette";

// Route-level splitting keeps the public landing and onboarding entry paths
// from downloading the entire signed-in application (including Brain Lab's 3D
// stack, EPPP, dashboards, and admin pages) before their first paint.
const SignInPage = lazy(() => import("@/pages/sign-in"));
const SignUpPage = lazy(() => import("@/pages/sign-up"));
const LandingPage = lazy(() => import("@/pages/landing"));
const PrivacyPage = lazy(() => import("@/pages/privacy"));
const TermsPage = lazy(() => import("@/pages/terms"));
const OnboardingPage = lazy(() => import("@/pages/onboarding"));
const DashboardPage = lazy(() => import("@/pages/dashboard"));
const TopicsPage = lazy(() => import("@/pages/topics"));
const TopicDetailPage = lazy(() => import("@/pages/topic-detail"));
const FlashcardsPage = lazy(() => import("@/pages/flashcards"));
const QuizPage = lazy(() => import("@/pages/quiz"));
const StudyGuidePage = lazy(() => import("@/pages/study-guide"));
const PracticeExamPage = lazy(() => import("@/pages/practice-exam"));
const CourseMasteryExamPage = lazy(() => import("@/pages/course-mastery-exam"));
const ProgressPage = lazy(() => import("@/pages/progress"));
const LeaderboardPage = lazy(() => import("@/pages/leaderboard"));
const SubscriptionPage = lazy(() => import("@/pages/subscription"));
const FeedbackPage = lazy(() => import("@/pages/feedback"));
const FeatureRequestPage = lazy(() => import("@/pages/feature-request"));
const FeaturedWorkPage = lazy(() => import("@/pages/featured-work"));
const AdminFeaturedWorkPage = lazy(() => import("@/pages/admin-featured-work"));
const ConnectionsPage = lazy(() => import("@/pages/connections"));
const AdminConnectionsPage = lazy(() => import("@/pages/admin-connections"));
const PublicProfilePage = lazy(() => import("@/pages/public-profile"));
const ResourcesPage = lazy(() => import("@/pages/resources"));
const StudyLabPage = lazy(() => import("@/pages/study-lab"));
const BrainLabPage = lazy(() => import("@/pages/brain-lab"));
const EpppPage = lazy(() => import("@/pages/eppp"));
const AdminFeedbackPage = lazy(() => import("@/pages/admin-feedback"));
const AdminTokensPage = lazy(() => import("@/pages/admin-tokens"));
const MyDecksPage = lazy(() => import("@/pages/my-decks"));
const NewDeckPage = lazy(() => import("@/pages/my-decks-new"));
const MyDeckDetailPage = lazy(() => import("@/pages/my-decks-detail"));
const ReflectionsPage = lazy(() => import("@/pages/reflections"));
const ProfilePage = lazy(() => import("@/pages/profile"));
const EpppSuitePage = lazy(() => import("@/pages/eppp-suite"));
const NotFound = lazy(() => import("@/pages/not-found"));
const CrashTestPage = lazy(() => import("@/pages/crash-test"));
const DevGlassPreview = lazy(() => import("@/pages/dev-glass-preview"));

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
      {/* DEV-ONLY: temporary unauthenticated Brain Lab route for visual audit.
          Remove after audit. */}
      {import.meta.env.DEV && (
        <Route path="/__brainlab-audit">
          {() => (
            <AppLayout>
              <BrainLabPage />
            </AppLayout>
          )}
        </Route>
      )}
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
        appearance={{
          // Global dark theming so Clerk popovers rendered outside the
          // sign-in/sign-up pages (UserButton menu, account modals) match
          // the PsychPro blue material system instead of Clerk's light
          // defaults. The sign-in/sign-up pages layer their own element
          // overrides on top of these variables.
          variables: {
            colorPrimary: P.surf,
            colorBackground: P.surface,
            colorText: P.cloud,
            colorTextSecondary: P.mistSoft,
            colorInputBackground: P.ink,
            colorInputText: P.cloud,
            colorDanger: PP.red,
            colorWarning: P.surf,
            borderRadius: "0.75rem",
            fontFamily: "inherit",
          },
        }}
      >
        <ClerkTokenBridge />
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={basePath}>
              <Suspense fallback={<FullScreenLoader label="Loading PsychPro…" />}>
                <AppRouter />
              </Suspense>
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
