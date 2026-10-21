import type React from "react";
import {
  Layers, ClipboardList, BookOpen, GraduationCap, Award, Upload, FileText, Sparkles,
  Folder, Star, CheckCircle2, Circle, Clock, Timer, XCircle, Target, Flame, CalendarClock,
  Stethoscope, Zap,
} from "lucide-react";
import brainLateral from "@/assets/brain-views/lateral.webp";
import { knowledgeDomainIcon } from "@/lib/eppp-icons";
import { EPPP_DOMAINS, type PreviewKey } from "./tour-data";
import { PsychProDashboardLive, EpppDashboardLive } from "./real-dashboards";

function Head({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="xp-p-head">
      <h4>{title}</h4>
      {sub ? <p>{sub}</p> : null}
    </div>
  );
}

function Bar({ pct }: { pct: number }) {
  return <span className="xp-bar-track"><span style={{ transform: `scaleX(${pct / 100})` }} /></span>;
}

function PPCourses() {
  const cats = [["Assessment", 82], ["Foundations", 64], ["Neuroscience", 45], ["Neuropsychology", 30], ["Psychotherapy", 12]] as const;
  return (
    <div className="xp-p">
      <Head title="Courses" sub="Choose a course to see its topics" />
      <div className="xp-split">
        <div className="xp-list">
          {cats.map(([c, p], i) => (
            <div key={c} className={`xp-card xp-mini${i === 0 ? " is-on" : ""}`}><span>{c}</span><Bar pct={p} /></div>
          ))}
        </div>
        <div className="xp-list">
          {["Objective Measures", "Validity and Effort Testing", "Projective Measures", "Intelligence Testing"].map((t, i) => (
            <div key={t} className="xp-card xp-topic">
              {i < 2 ? <CheckCircle2 /> : <Circle />}<span>{t}</span>
              <small>Flashcards · Quiz · Guide · Exam</small>
            </div>
          ))}
          <div className="xp-card xp-topic xp-dashed"><Award /><span>Course Mastery Exam</span></div>
        </div>
      </div>
    </div>
  );
}

function PPBrain() {
  const left = ["Precentral gyrus", "Frontal lobe", "Broca's area", "Temporal lobe"];
  const right = ["Postcentral gyrus", "Parietal lobe", "Occipital lobe", "Cerebellum"];
  return (
    <div className="xp-p">
      <Head title="Brain Lab" />
      <div className="xp-tabs">{["Lateral", "Medial", "Dorsal", "Ventral", "Coronal"].map((t, i) => <span key={t} className={i === 0 ? "is-on" : ""}>{t}</span>)}</div>
      <div className="xp-brain">
        <ul>{left.map((l) => <li key={l}>{l}</li>)}</ul>
        <img src={brainLateral} alt="Lateral view of the brain from the Brain Lab" />
        <ul>{right.map((l) => <li key={l}>{l}</li>)}</ul>
      </div>
    </div>
  );
}

function PPTools() {
  const tools = [
    [Layers, "Flashcards", "Card-based recall"], [ClipboardList, "Quiz", "Explanations for every answer"],
    [BookOpen, "Study Guide", "Need-to-know concepts"], [GraduationCap, "Practice Exam", "Exam-style questions"],
  ] as const;
  return (
    <div className="xp-p">
      <Head title="Study tools" sub="Topic: Classical Conditioning" />
      <div className="xp-grid2">
        {tools.map(([I, t, d]) => (
          <div key={t} className="xp-card xp-tool"><span className="xp-well"><I /></span><b>{t}</b><small>{d}</small></div>
        ))}
      </div>
      <div className="xp-card xp-quiz">
        <p className="xp-k">Quiz · Question 3</p>
        <p className="xp-q">Pairing a neutral stimulus with an unconditioned stimulus produces a:</p>
        <p className="xp-opt">Discriminative stimulus</p>
        <p className="xp-opt is-right"><CheckCircle2 /> Conditioned stimulus</p>
      </div>
    </div>
  );
}

function PPUploads() {
  return (
    <div className="xp-p">
      <Head title="Study Lab" sub="Upload material and generate study tools" />
      <div className="xp-card xp-drop"><Upload /><b>Drop a file or paste your notes</b><small>PDF, DOCX or TXT</small></div>
      <div className="xp-card xp-row xp-file"><FileText /> Lecture 7 - Memory Systems.pdf</div>
      <div className="xp-chips">
        {["Flashcards", "Quiz", "Study guide"].map((c) => <span key={c}><Sparkles /> Generate {c.toLowerCase()}</span>)}
      </div>
    </div>
  );
}

function PPLibrary() {
  return (
    <div className="xp-p">
      <Head title="My Library" sub="Your owned and earned books, shared across both suites" />
      <div className="xp-list">
        <div className="xp-card xp-row"><BookOpen /> Foundations in Clinical Psychology</div>
        <Head title="Elsewhere in PsychPro" />
        <div className="xp-card xp-row"><Star /> Featured Work: community contributions</div>
        <div className="xp-card xp-row"><FileText /> Reflections: a space for your thoughts</div>
      </div>
    </div>
  );
}

function EPDomains() {
  return (
    <div className="xp-p">
      <Head title="Knowledge domains" />
      <div className="xp-grid2">
        {EPPP_DOMAINS.map((d) => {
          const I = knowledgeDomainIcon(d);
          return <div key={d} className="xp-card xp-row xp-domain"><span className="xp-well"><I /></span>{d}</div>;
        })}
      </div>
    </div>
  );
}

function EPExams() {
  const rows = [
    [Award, "Mastery exam", "One lesson, pass to mark it mastered"],
    [Target, "Domain exam", "Every lesson in a content area"],
    [Timer, "Full-length practice exam", "Timed, across all domains"],
  ] as const;
  return (
    <div className="xp-p">
      <Head title="Practice exams" />
      <div className="xp-list">
        {rows.map(([I, t, d]) => (
          <div key={t} className="xp-card xp-exam"><span className="xp-well"><I /></span><span><b>{t}</b><small>{d}</small></span><Clock /></div>
        ))}
      </div>
    </div>
  );
}

function EPCases() {
  return (
    <div className="xp-p">
      <Head title="Clinical integration" sub="Sample case" />
      <div className="xp-card xp-case">
        <p className="xp-k"><Stethoscope /> Case vignette</p>
        <p className="xp-q">A 34-year-old client reports persistent worry, difficulty sleeping, and muscle tension for the past eight months.</p>
        <div className="xp-chips"><span>Assessment</span><span>Treatment</span><span>Ethics</span></div>
      </div>
      <div className="xp-card xp-row"><Zap /> Rapid review: short, high-yield sets</div>
    </div>
  );
}

function EPMissed() {
  return (
    <div className="xp-p">
      <Head title="Missed questions" sub="Review with explanations" />
      <div className="xp-list">
        {["Research Methods and Statistics", "Biological Bases of Behavior", "Ethical, Legal, and Professional Issues"].map((d) => (
          <div key={d} className="xp-card xp-row xp-missed"><XCircle /> <span>{d}</span><small>Review</small></div>
        ))}
      </div>
      <div className="xp-card xp-quiz">
        <p className="xp-k">Explanation</p>
        <p className="xp-q">Type I error is rejecting a true null hypothesis; its probability equals alpha.</p>
      </div>
    </div>
  );
}

const MAP: Record<PreviewKey, () => React.ReactElement> = {
  "pp-dashboard": PsychProDashboardLive, "pp-courses": PPCourses, "pp-brain": PPBrain, "pp-tools": PPTools,
  "pp-uploads": PPUploads, "pp-library": PPLibrary, "ep-dashboard": EpppDashboardLive, "ep-domains": EPDomains,
  "ep-exams": EPExams, "ep-cases": EPCases, "ep-missed": EPMissed,
};

export function Preview({ k, maxVisibleHeight }: { k: PreviewKey; maxVisibleHeight?: number }) {
  if (k === "pp-dashboard") return <PsychProDashboardLive maxVisibleHeight={maxVisibleHeight} />;
  if (k === "ep-dashboard") return <EpppDashboardLive maxVisibleHeight={maxVisibleHeight} />;
  const C = MAP[k];
  return <C />;
}

export function hasShot(k: PreviewKey): boolean {
  return k === "ep-dashboard" || k === "pp-dashboard";
}
