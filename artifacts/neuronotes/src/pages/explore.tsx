import { useEffect, useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useAuth } from "@clerk/clerk-react";
import { ArrowLeft, ArrowRight, Brain, Crown } from "lucide-react";
import { rememberPendingTrial, trialEntryHref } from "@/lib/pending-trial";
import { trackEvent } from "@/lib/analytics";
import { TOURS, type Suite } from "@/components/explore/tour-data";
import { TourStop } from "@/components/explore/tour-stop";
import { DeviceFrame } from "@/components/explore/device-frame";
import { Preview, hasShot } from "@/components/explore/previews";
import "@/components/explore/explore.css";

// The approved crop is 390px high at 800px wide; scale that ratio to the
// live dashboard's 1280px canvas so it remains proportionate on mobile.
const HERO_DASHBOARD_PREVIEW_HEIGHT = 624;

function parseSuite(search: string): Suite {
  return new URLSearchParams(search).get("suite") === "eppp" ? "eppp" : "psychpro";
}

function useReveal(key: string) {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-xp-reveal]"));
    if (typeof IntersectionObserver === "undefined") { els.forEach((e) => e.classList.add("is-in")); return; }
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [key]);
}

export default function ExplorePage() {
  const search = useSearch();
  const [, navigate] = useLocation();
  const { isSignedIn } = useAuth();
  const suite = parseSuite(search);
  const tour = TOURS[suite];
  const [fade, setFade] = useState(0);
  useReveal(suite);

  useEffect(() => {
    document.title = `Explore ${tour.name} | PsychPro`;
  }, [tour.name]);

  const choose = (s: Suite) => {
    if (s === suite) return;
    trackEvent("navigation_clicked", { surface: "explore", destination: `/explore?suite=${s}` });
    navigate(`/explore?suite=${s}`);
    setFade((n) => n + 1);
    window.scrollTo({ top: 0 });
  };

  const startTrial = () => {
    trackEvent("trial_cta_clicked", { surface: "explore", suite, signed_in: Boolean(isSignedIn) });
    rememberPendingTrial(suite);
    navigate(trialEntryHref(suite, !!isSignedIn, window.location.origin, import.meta.env.BASE_URL));
  };

  const Ctas = ({ where }: { where: string }) => (
    <div className="xp-ctas">
      <button type="button" onClick={startTrial} className="xp-glass" data-testid={`button-explore-trial-${where}`}>
        Try free for 7 days <ArrowRight aria-hidden />
      </button>
      <Link href="/subscription" className="xp-secondary" data-testid={`link-explore-plans-${where}`}>
        See plans
      </Link>
    </div>
  );

  return (
    <div className="xp-root" data-suite={suite} data-testid="explore-page">
      <header className="xp-nav">
        <Link href="/" className="xp-logo" data-testid="link-explore-home">
          <ArrowLeft aria-hidden /> <Brain aria-hidden /> <span>PSYCHPRO</span>
        </Link>
        <nav className="xp-switch" aria-label="Choose a suite to tour">
          {(["psychpro", "eppp"] as const).map((s) => (
            <button key={s} type="button" aria-pressed={suite === s}
              className={suite === s ? "is-on" : ""} onClick={() => choose(s)} data-testid={`tab-suite-${s}`}>
              {s === "eppp" ? <Crown aria-hidden /> : <Brain aria-hidden />}
              {TOURS[s].short}
            </button>
          ))}
        </nav>
      </header>

      <main key={`${suite}-${fade}`} className="xp-main-flow">
        <section className="xp-intro">
          <p className="xp-eyebrow">Explore the platform</p>
          <h1 data-testid="text-explore-title">{tour.name}</h1>
          <p className="xp-lede">{tour.tagline}</p>
          <div className="xp-hero-preview" id="dashboard">
            <DeviceFrame suite={suite} active="Dashboard" label={tour.stops[0].label} bare={hasShot(tour.stops[0].preview)}>
              <Preview k={tour.stops[0].preview} maxVisibleHeight={HERO_DASHBOARD_PREVIEW_HEIGHT} />
            </DeviceFrame>
          </div>
          <p className="xp-body xp-intro-body">{tour.intro}</p>
          <Ctas where="top" />
          <nav className="xp-index" aria-label="Tour stops">
            {tour.stops.map((s) => (
              <a key={s.id} href={`#${s.id}`} data-testid={`link-stop-${s.id}`}>
                {s.label}
              </a>
            ))}
          </nav>
          {suite === "eppp" ? (
            <p className="xp-note">The EPPP Mastery Suite is purchased separately from PsychPro. Neither unlocks the other.</p>
          ) : (
            <p className="xp-note">Licensure prep lives in the separate EPPP Mastery Suite. <button type="button" onClick={() => choose("eppp")} data-testid="button-switch-eppp">Tour it</button></p>
          )}
        </section>

        <div className="xp-stops">
          {tour.stops.slice(1).map((s, i) => <TourStop key={s.id} suite={suite} stop={s} index={i + 1} />)}
        </div>

        <section className="xp-final" data-xp-reveal>
          <p className="xp-eyebrow">Ready when you are</p>
          <h2>Try the {tour.name} free for seven days</h2>
          <p className="xp-body">Your free week starts only when you finish onboarding. No card is needed and nothing is charged automatically.</p>
          <Ctas where="bottom" />
          <button type="button" className="xp-other" onClick={() => { choose(suite === "eppp" ? "psychpro" : "eppp"); window.scrollTo({ top: 0 }); }} data-testid="button-explore-other">
            Or tour the {TOURS[suite === "eppp" ? "psychpro" : "eppp"].name} <ArrowRight aria-hidden />
          </button>
        </section>
      </main>
    </div>
  );
}
