import { Check } from "lucide-react";
import { DeviceFrame } from "./device-frame";
import { Preview, hasShot } from "./previews";
import type { Suite, TourStop as Stop } from "./tour-data";

const NAV_ACTIVE: Record<string, string> = {
  "pp-dashboard": "Dashboard", "pp-courses": "Courses", "pp-brain": "Brain Lab", "pp-tools": "Courses",
  "pp-uploads": "Study Lab", "pp-library": "My Library", "ep-dashboard": "Dashboard", "ep-domains": "Part 1: Knowledge",
  "ep-exams": "Full-Length Exams", "ep-cases": "Clinical Integrated Cases", "ep-missed": "Missed Questions",
};

export function TourStop({ suite, stop, index }: { suite: Suite; stop: Stop; index: number }) {
  return (
    <section
      id={stop.id}
      className={`xp-stop${index % 2 ? " xp-stop--rev" : ""}`}
      data-xp-reveal
      data-testid={`tour-stop-${stop.id}`}
    >
      <div className="xp-stop-media">
        <DeviceFrame suite={suite} active={NAV_ACTIVE[stop.preview]} label={stop.label} bare={hasShot(stop.preview)}>
          <Preview k={stop.preview} />
        </DeviceFrame>
      </div>
      <div className="xp-stop-copy">
        <p className="xp-eyebrow">{stop.eyebrow}</p>
        <h3>{stop.title}</h3>
        <p className="xp-body">{stop.body}</p>
        <ul>
          {stop.points.map((p) => <li key={p}><Check aria-hidden /> {p}</li>)}
        </ul>
      </div>
    </section>
  );
}
