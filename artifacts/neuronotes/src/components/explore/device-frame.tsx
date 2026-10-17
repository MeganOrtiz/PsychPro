import type { ReactNode } from "react";
import { Brain, Crown } from "lucide-react";
import type { Suite } from "./tour-data";

const NAV: Record<Suite, string[]> = {
  psychpro: ["Dashboard", "Courses", "Study Lab", "Brain Lab", "Progress", "My Library", "Featured Work"],
  eppp: ["Dashboard", "Part 1: Knowledge", "Part 2: Skills", "Clinical Integrated Cases", "Domain Mastery Exams", "Full-Length Exams", "Missed Questions", "Quick Reference Guide"],
};

/** Laptop-style frame with a static sidebar, so each preview reads as the real app shell. */
export function DeviceFrame({
  suite, active, label, children, bare = false,
}: { suite: Suite; active: string; label: string; children: ReactNode; bare?: boolean }) {
  const Icon = suite === "eppp" ? Crown : Brain;
  return (
    <figure className="xp-device" aria-label={`${label}, ${bare ? "demo data" : "illustrative preview"}`}>
      <div className="xp-screen">
        <div className="xp-bar" aria-hidden>
          <span /><span /><span />
          <em>{label}</em>
        </div>
        {bare ? (
          <div className="xp-app xp-app--bare">{children}</div>
        ) : (
          <div className="xp-app">
            <aside className="xp-side" aria-hidden>
              <p className="xp-side-brand"><Icon /> {suite === "eppp" ? "EPPP" : "PSYCHPRO"}</p>
              {NAV[suite].map((n) => (
                <span key={n} className={n === active ? "is-on" : ""}>{n}</span>
              ))}
            </aside>
            <div className="xp-main">{children}</div>
          </div>
        )}
      </div>
      <div className="xp-base" aria-hidden />
      <figcaption className="xp-tag">{bare ? "Real dashboard view rendered with demo data" : "Illustrative preview based on the current app, sample content"}</figcaption>
    </figure>
  );
}
