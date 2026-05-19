// =============================================================================
// Single source of truth for the PsychPro Community surface (task #65).
//
// Pure-TypeScript constants reused by:
//   - lib/db schema (server-side validation set re-exports)
//   - artifacts/api-server (profile endpoint validation)
//   - artifacts/neuronotes (Profile page picker, Featured Work #66, Connections #67)
//
// MUST stay free of runtime deps (no drizzle, no pg, no node-only imports) so
// it can be bundled into the browser.
// =============================================================================

export const PROFILE_ROLES = [
  "Graduate Student",
  "Doctoral Candidate",
  "Postdoc",
  "Early Career",
  "Licensed Clinician",
  "Faculty",
  "Other",
] as const;
export type ProfileRole = (typeof PROFILE_ROLES)[number];

export const INTERESTS_TAXONOMY = [
  {
    category: "Neuropsychology",
    tags: [
      "Pediatric Neuropsych",
      "Adult Neuropsych",
      "Geriatric Neuropsych",
      "Forensic Neuropsych",
      "Rehabilitation",
      "Sports Concussion",
      "Cross-Cultural Neuropsych",
    ],
  },
  {
    category: "Neurodevelopmental",
    tags: [
      "ASD",
      "ADHD",
      "Intellectual Disability",
      "Learning Disorders",
      "Female Autism Phenotype",
    ],
  },
  {
    category: "Neurocognitive",
    tags: [
      "Alzheimer's & Dementias",
      "TBI",
      "Stroke",
      "Epilepsy",
      "Movement Disorders",
      "MS",
    ],
  },
  {
    category: "Psychopathology",
    tags: [
      "Mood Disorders",
      "Anxiety Disorders",
      "Trauma & PTSD",
      "Psychotic Disorders",
      "Personality Disorders",
      "Eating Disorders",
      "Substance Use",
    ],
  },
  {
    category: "Assessment",
    tags: [
      "Cognitive Assessment",
      "Personality Assessment",
      "Performance Validity",
      "Rating Scales",
      "Test Development",
    ],
  },
  {
    category: "Intervention",
    tags: [
      "CBT",
      "DBT",
      "ACT",
      "EMDR",
      "Psychodynamic",
      "Family Systems",
      "ABA",
      "Behavioral Interventions",
    ],
  },
  {
    category: "Research methods",
    tags: [
      "Quantitative",
      "Qualitative",
      "Mixed Methods",
      "Psychometrics",
      "Meta-Analysis",
      "Single-Case Design",
    ],
  },
  {
    category: "Populations",
    tags: [
      "Pediatric",
      "Adolescent",
      "Adult",
      "Geriatric",
      "LGBTQ+",
      "BIPOC",
      "Veterans",
      "Forensic Populations",
    ],
  },
] as const;

export const INTEREST_TAGS: readonly string[] = INTERESTS_TAXONOMY.flatMap(
  (g) => g.tags,
);
export const INTEREST_TAGS_SET: ReadonlySet<string> = new Set(INTEREST_TAGS);

export const MAX_INTERESTS = 8;
export const MAX_BIO_LENGTH = 300;
export const MAX_DISPLAY_NAME_LENGTH = 80;
export const MAX_INSTITUTION_LENGTH = 120;

// =============================================================================
// Featured Work taxonomy (task #66)
// =============================================================================

export const WORK_TYPES = [
  { value: "research", label: "Research Paper" },
  { value: "dissertation", label: "Dissertation" },
  { value: "poster", label: "Poster Presentation" },
  { value: "conference", label: "Conference Presentation" },
  { value: "other", label: "Other Scholarly Work" },
] as const;

export type WorkType = (typeof WORK_TYPES)[number]["value"];
export const WORK_TYPE_VALUES: readonly WorkType[] = WORK_TYPES.map((w) => w.value);
export const WORK_TYPE_SET: ReadonlySet<string> = new Set(WORK_TYPE_VALUES);

export function workTypeLabel(value: string): string {
  return WORK_TYPES.find((w) => w.value === value)?.label ?? value;
}

export const FEATURED_WORK_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "revision_requested",
] as const;
export type FeaturedWorkStatus = (typeof FEATURED_WORK_STATUSES)[number];

export const MAX_FEATURED_TITLE_LENGTH = 250;
export const MIN_FEATURED_ABSTRACT_LENGTH = 100;
export const MAX_FEATURED_ABSTRACT_LENGTH = 2000;
export const MAX_FEATURED_COAUTHORS_LENGTH = 500;
export const MAX_FEATURED_VENUE_LENGTH = 250;
export const MAX_FEATURED_INTEREST_TAGS = 5;
export const MIN_FEATURED_INTEREST_TAGS = 1;
export const MAX_FEATURED_FILE_BYTES = 25 * 1024 * 1024; // 25 MB
export const MAX_FEATURED_ADMIN_NOTE_LENGTH = 1000;

export const FEATURED_WORK_CONSENT_TEXT =
  "I confirm this is my original work, all client/participant information is appropriately de-identified, and I grant PsychPro permission to display this submission on the platform.";
