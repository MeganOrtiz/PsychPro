export type Suite = "psychpro" | "eppp";

export type PreviewKey =
  | "pp-dashboard" | "pp-courses" | "pp-brain" | "pp-tools" | "pp-uploads" | "pp-library"
  | "ep-dashboard" | "ep-domains" | "ep-exams" | "ep-cases" | "ep-missed";

export interface TourStop {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  points: string[];
  preview: PreviewKey;
  label: string;
}

export interface SuiteTour {
  name: string;
  short: string;
  tagline: string;
  intro: string;
  highlights: string[];
  stops: TourStop[];
}

export const TOURS: Record<Suite, SuiteTour> = {
  psychpro: {
    name: "PsychPro Suite",
    short: "PsychPro",
    tagline: "Coursework, brain anatomy, and your own notes in one place.",
    intro:
      "A walk through the screens you would actually use: courses organized by topic, an interactive Brain Lab, built-in study formats, and tools for the material you bring yourself.",
    highlights: ["Courses", "Brain Lab", "Study tools", "Your uploads", "Progress"],
    stops: [
      {
        id: "dashboard", eyebrow: "Dashboard", title: "Start where you left off",
        body: "Your home base recommends what to review next and keeps courses, recent activity, and study momentum in view.",
        points: ["Recommended topics", "Recent activity", "Study streak and weekly progress"],
        preview: "pp-dashboard", label: "PsychPro dashboard",
      },
      {
        id: "courses", eyebrow: "Courses", title: "Topics organized like a curriculum",
        body: "Coursework is grouped into categories such as Neuroscience, Assessment, and Psychotherapy, each with its own topics and a cumulative course mastery exam.",
        points: ["Category-based course list", "Topic-level progress", "Course mastery exam"],
        preview: "pp-courses", label: "Courses",
      },
      {
        id: "brain-lab", eyebrow: "Brain Lab", title: "Connect structure to function",
        body: "Rotate between anatomical views, find labeled structures, and test yourself on what each region does.",
        points: ["Lateral, medial, dorsal, ventral and coronal views", "Labeled structures", "Built-in identification quiz"],
        preview: "pp-brain", label: "Brain Lab",
      },
      {
        id: "tools", eyebrow: "Study tools", title: "Four ways to study each topic",
        body: "Each topic includes built-in flashcards, quizzes, study guides, and practice exams, with explanations for every question.",
        points: ["Flashcards", "Quizzes with explanations", "Study guides", "Practice exams"],
        preview: "pp-tools", label: "Study tools",
      },
      {
        id: "uploads", eyebrow: "Your material", title: "Bring your own notes",
        body: "Upload PDF, DOCX, or TXT files, or paste notes, then use the AI tools to turn them into study materials. Paid months include 50 generation requests.",
        points: ["PDF, DOCX, TXT or pasted text", "Generate flashcards and quizzes", "Return to your saved study sets"],
        preview: "pp-uploads", label: "Uploads and AI tools",
      },
      {
        id: "library", eyebrow: "Library & community", title: "Keep learning beyond a study session",
        body: "My Library keeps your owned and earned books together across both suites. Reflections gives you room to think, while Featured Work showcases contributions from the PsychPro community.",
        points: ["Shared book library", "Featured work", "Personal reflections"],
        preview: "pp-library", label: "Library",
      },
    ],
  },
  eppp: {
    name: "EPPP Mastery Suite",
    short: "EPPP",
    tagline: "A focused workspace for licensure preparation.",
    intro:
      "A separate suite built around the EPPP knowledge domains, with practice at every scale from a single lesson to a full-length exam.",
    highlights: ["Knowledge domains", "Practice exams", "Clinical cases", "Missed questions", "Readiness"],
    stops: [
      {
        id: "dashboard", eyebrow: "Readiness", title: "See how ready you are",
        body: "The EPPP dashboard shows exam readiness, progress by domain, your study streak, an exam-date countdown, and what to study next.",
        points: ["Readiness ring", "Exam countdown", "What to study next"],
        preview: "ep-dashboard", label: "EPPP dashboard",
      },
      {
        id: "domains", eyebrow: "Knowledge domains", title: "Every domain, broken into lessons",
        body: "Lessons and study guides are organized by the EPPP knowledge domains, so you always know which content area you are working in.",
        points: ["Eight knowledge domains", "Lessons and study guides", "Mastery tracked per domain"],
        preview: "ep-domains", label: "Knowledge domains",
      },
      {
        id: "exams", eyebrow: "Practice exams", title: "Mastery, domain, and full-length",
        body: "Check a single lesson, a whole domain, or sit a full-length practice exam that mirrors the real test experience.",
        points: ["Mastery exams", "Domain exams", "Full-length practice exams"],
        preview: "ep-exams", label: "Practice exams",
      },
      {
        id: "cases", eyebrow: "Clinical integration", title: "Apply concepts to cases",
        body: "Clinical integration cases connect content across domains, and rapid review keeps key facts fresh in short sessions.",
        points: ["Clinical integration cases", "Rapid review", "Flashcards and question bank"],
        preview: "ep-cases", label: "Clinical integration",
      },
      {
        id: "missed", eyebrow: "Missed questions", title: "Turn mistakes into review",
        body: "Questions you miss are collected in one place so you can revisit them with explanations and close the gaps.",
        points: ["Automatic missed-question list", "Explanations", "Targeted re-practice"],
        preview: "ep-missed", label: "Missed-question review",
      },
    ],
  },
};

export const EPPP_DOMAINS = [
  "Biological Bases of Behavior",
  "Cognitive-Affective Bases",
  "Social and Cultural Bases",
  "Growth and Lifespan Development",
  "Assessment and Diagnosis",
  "Treatment, Intervention, and Prevention",
  "Research Methods and Statistics",
  "Ethical, Legal, and Professional Issues",
];
