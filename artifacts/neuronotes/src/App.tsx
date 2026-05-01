import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
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
import StudyLabPage from "@/pages/study-lab";
import AdminFeedbackPage from "@/pages/admin-feedback";
import MyDecksPage from "@/pages/my-decks";
import NewDeckPage from "@/pages/my-decks-new";
import MyDeckDetailPage from "@/pages/my-decks-detail";
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

const PROD_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;
const DEV_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY_DEV as string | undefined;

const VERIFIED_CLERK_FAPI = "clerk.auth.psychprosuite.com";

function isLiveProductionHost(): boolean {
  if (typeof window === "undefined") return true;
  const h = window.location.hostname;
  return h === "psychprosuite.com" || h === "www.psychprosuite.com";
}

function decodeClerkFapi(key: string | undefined): string | null {
  if (!key) return null;
  const m = key.match(/^pk_(?:live|test)_(.+)$/);
  if (!m) return null;
  try {
    const decoded = atob(m[1]);
    return decoded.replace(/\$+$/, "");
  } catch {
    return null;
  }
}

function pickClerkKey(): string | null {
  const onProd = isLiveProductionHost();
  if (onProd) {
    const liveCandidates = [PROD_KEY, DEV_KEY].filter(
      (k): k is string => !!k && k.startsWith("pk_live_"),
    );
    const verified = liveCandidates.find(
      (k) => decodeClerkFapi(k) === VERIFIED_CLERK_FAPI,
    );
    if (verified) return verified;
    return PROD_KEY ?? liveCandidates[0] ?? null;
  }
  const hasUsableDevKey = !!DEV_KEY && DEV_KEY.startsWith("pk_test_");
  if (hasUsableDevKey) return DEV_KEY!;
  return null;
}

const clerkPubKey = pickClerkKey();

function PreviewUnavailable() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto text-2xl font-semibold">
          PP
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">PsychPro preview</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Sign-in is locked to the live domain, so the in-workspace preview can't load
          the full app here. Open the live site to use everything.
        </p>
        <a
          href="https://psychprosuite.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-5 py-2.5 text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          Open psychprosuite.com
        </a>
        <p className="text-xs text-muted-foreground/80 pt-2">
          To enable the in-workspace preview, add a Clerk Development publishable key
          (starts with <code className="font-mono">pk_test_</code>) as the secret
          <code className="font-mono"> VITE_CLERK_PUBLISHABLE_KEY_DEV</code>.
        </p>
      </div>
    </div>
  );
}

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
      {import.meta.env.DEV ? <Route path="/__crash-test" component={CrashTestPage} /> : null}
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
            <Route path="/study-lab" component={StudyLabPage} />
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
  if (!clerkPubKey) {
    return (
      <ErrorBoundary>
        <PreviewUnavailable />
      </ErrorBoundary>
    );
  }
  return (
    <ErrorBoundary>
      <ClerkProvider publishableKey={clerkPubKey} signInUrl="/sign-in" signUpUrl="/sign-up">
        <ClerkTokenSetup />
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <AuthRouter />
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
