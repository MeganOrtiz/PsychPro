import { useLocation } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

// =============================================================================
// Landing — CLEAN SLATE
// -----------------------------------------------------------------------------
// The previous landing page (smoke-cloud background, brain hero image,
// PSYCHPRO wordmark, multi-section marketing layout) was torn out at
// the user's request so the visual design can be rebuilt from scratch.
//
// What's left here is intentionally bare: brand name, one-line tagline,
// and a single CTA that routes signed-in users to the dashboard and
// signed-out users to sign-in. Re-introduce the marketing sections,
// hero artwork, and background treatment incrementally on top of this.
// =============================================================================

export default function LandingPage() {
  const [, navigate] = useLocation();
  const { isSignedIn } = useAuth();

  const goToApp = () => navigate(isSignedIn ? "/dashboard" : "/sign-in");

  return (
    <main
      className="min-h-screen w-full flex items-center justify-center px-6"
      style={{ background: "#03151D", color: "#E8FCFF" }}
      data-testid="landing-page"
    >
      <div className="text-center max-w-xl">
        <h1
          className="text-4xl md:text-5xl font-light tracking-[0.3em]"
          style={{ color: "#E8FCFF" }}
        >
          PSYCHPRO
        </h1>
        <p
          className="mt-4 text-sm tracking-widest uppercase"
          style={{ color: "rgba(232, 252, 255, 0.65)" }}
        >
          Learn. Expand. Connect.
        </p>
        <p className="mt-8 text-base leading-relaxed" style={{ color: "rgba(232, 252, 255, 0.75)" }}>
          Clinical psychology, deeper understanding — built for real-world practice.
        </p>
        <div className="mt-10">
          <Button
            onClick={goToApp}
            size="lg"
            className="px-8"
            data-testid="cta-enter-app"
          >
            {isSignedIn ? "Open dashboard" : "Get started"}
          </Button>
        </div>
      </div>
    </main>
  );
}
