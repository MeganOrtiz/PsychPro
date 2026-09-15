import { useEffect, useRef } from "react";
import { ArrowRight, Brain } from "lucide-react";
import "./_group.css";

const GLASS = "/__mockup/images/psychpro-teal-glass.webp";
const CLOUDS = "/__mockup/images/landing-layered-drift-clouds.png";
const GLASS_DETAIL = "/__mockup/images/landing-layered-drift-glass.png";
const FILAMENTS = "/__mockup/images/landing-layered-drift-filaments.png";
const CHROME_BRAIN = "/__mockup/images/psychpro-chrome-brain.webp";

export function LayeredDrift() {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = page.querySelector<HTMLElement>(".drift-hero");
      if (!hero) return;
      const distance = Math.max(hero.offsetHeight * 0.9, 1);
      const progress = Math.min(Math.max(window.scrollY / distance, 0), 1);
      page.style.setProperty("--hero-scroll", progress.toFixed(4));
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="drift-page" ref={pageRef}>
      <header className="drift-nav">
        <a className="drift-brand" href="#home" aria-label="PsychPro home">
          <Brain aria-hidden />
          <span>PSYCHPRO</span>
        </a>
        <nav aria-label="Landing sections">
          <a href="#platform">PLATFORM</a>
          <a href="#topics">TOPICS</a>
          <a href="#story">OUR STORY</a>
        </nav>
        <button type="button">LOG IN</button>
      </header>

      <main>
        <section className="drift-hero" id="home">
          <h1>PSYCHPRO</h1>
          <p className="drift-tagline">learn. expand. connect.</p>

          <div className="drift-art" aria-hidden>
            <div className="drift-layer drift-layer--base">
              <img src={GLASS} alt="" />
            </div>
            <div className="drift-layer drift-layer--clouds">
              <img src={CLOUDS} alt="" />
            </div>
            <div className="drift-layer drift-layer--glass">
              <img src={GLASS_DETAIL} alt="" />
            </div>
            <div className="drift-layer drift-layer--filaments">
              <img src={FILAMENTS} alt="" />
            </div>
            <img className="drift-brain" src={CHROME_BRAIN} alt="" />
          </div>

          <p className="drift-headline">Learn Smarter. Not Harder.</p>
          <p className="drift-copy">
            Evidence-based study tools for psych students. Concepts in psychology,
            neuroscience, assessment and intervention for classroom and clinical
            learning all in one space.
          </p>
          <div className="drift-actions">
            <button type="button">
              START LEARNING SMARTER <ArrowRight aria-hidden />
            </button>
            <button type="button">
              EXPLORE THE PLATFORM <ArrowRight aria-hidden />
            </button>
          </div>
          <p className="drift-cue">SCROLL TO MOVE THROUGH THE LAYERS</p>
        </section>

        <section className="drift-preview-section" id="platform">
          <p>THE PSYCHPRO PLATFORM</p>
          <h2>Everything connects as you move forward.</h2>
          <div className="drift-preview-grid">
            <article><span>01</span><h3>Build understanding</h3></article>
            <article><span>02</span><h3>Practice deliberately</h3></article>
            <article><span>03</span><h3>Track your progress</h3></article>
          </div>
        </section>
      </main>
    </div>
  );
}