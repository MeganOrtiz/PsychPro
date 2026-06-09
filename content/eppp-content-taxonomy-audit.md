# PsychPro / EPPP Content Taxonomy Audit

Created: June 9, 2026

Purpose: establish a clear operational map for separating main PsychPro content from EPPP Mastery Suite content before importing, renaming, hiding, or merging any more lessons.

## Current Finding

The visible EPPP content leak was not caused by the dashboard header or Brain Lab work. It was caused by the EPPP Suite reading the shared topic list without filtering it to EPPP-only lessons.

That UI issue has been fixed in:

- `artifacts/neuronotes/src/pages/eppp-suite.tsx`
- `artifacts/neuronotes/src/lib/eppp-content.ts`

The deeper issue remains: the database does not yet have a durable content ownership field. The app is currently using `topics.category`, `topics.course_id`, topic IDs, and frontend helper logic to infer where a lesson belongs.

## Current Data Model Risk

`topics.category` is doing too many jobs at once:

- Main-site course grouping
- EPPP domain grouping
- Legacy category mastery exam key
- Temporary migration bridge while `courses` is adopted
- Frontend filtering source

This creates predictable failure modes:

- A page can accidentally show main PsychPro lessons in EPPP if it reads all topics.
- A Claude/Replit import can create a valid topic that appears in the wrong dashboard.
- A course wrapper can exist without all intended lessons linked by `course_id`.
- Topic IDs 62-81 work as a short-term bridge, but they are not a safe long-term content model.
- Direct links to shared topic routes can still reach any topic unless route-level content guards are added.

## Current Known Sources

| Source | Location | Status | Best Use |
|---|---|---|---|
| Existing PsychPro seed | `lib/db/src/seed.ts` and `lib/db/src/add-*.ts` | Present in repo | Main PsychPro content, neuropsychology depth, assessment support, treatment support |
| EPPP starter architecture | `content/eppp-mastery-domain-chapters.md` | Present in repo | Official 8-domain / 71-KN structure |
| EPPP expanded chapter model | `content/eppp-expanded-chapter-model.md` | Present in repo | Lesson format and depth standard |
| Claude live connector content | Reported as topic IDs 62-81 | Not independently exported here | Candidate primary lessons for four EPPP domains |
| Claude Markdown files for other four domains | Reported by Claude; not found in repo | Missing locally | Candidate primary lessons after recovery/export |

## Known Main PsychPro Content

These are main PsychPro learning assets unless explicitly copied into an EPPP domain as support material.

| Category | Topics Found in Repo |
|---|---|
| Foundations | Neuropsychology Overview; Cell Biology & Neuron Anatomy; Neurotransmitters & Synaptic Transmission; Brain Structures; Cranial Nerves; Vascular System of the Brain |
| Neuroanatomy | Sensory Pathways; Central Nervous System; Peripheral Nervous System; Enteric Nervous System |
| Neuroscience | Sensory Systems; Limbic System & Motivation; Sleep & Circadian Rhythms; Endocrine System & Reproduction; Brain Networks |
| Clinical | Psychopharmacology; ADHD & Medications; Neurocognitive Disorders; Neurodevelopmental Disorders |
| Neuropsychology | Psychological Disorders; Personality Disorders; Language Processing & Aphasia; Apraxia & Agnosia |
| Neuropsychological Assessment | Executive Function; Neuroimaging & Neuromodulation; Forensic Neuropsychology; Validity & Effort Testing |
| Assessment | Cognitive, memory, achievement, language, attention, motor, autism, personality, validity, mood, behavior, executive function, adaptive behavior, trauma, and diagnostic interview measures |
| Psychotherapy | Psychodynamic, Jungian, Adlerian, humanistic, existential, Gestalt, behavior, CBT, third-wave, family/couples, and trauma-focused approaches |
| Research & Statistics | Foundations in Statistics; Quantitative Statistics & Research Methods; Qualitative Research Designs |

## Known / Reported EPPP Content

Reported live in PsychPro through Claude connector:

| EPPP Domain | Reported Lessons | Reported Topic IDs |
|---|---|---|
| Ethics, Legal & Professional Issues | APA Code; Confidentiality/Privilege/Reporting; Informed Consent; Multiple Relationships/Boundaries; Decision-Making Models; Specialty Ethics | 62-67 |
| Growth & Lifespan Development | Foundational Theories; Attachment & Temperament; Middle Childhood & Adolescence; Adulthood; Family Systems | 68-72 |
| Cognitive-Affective Bases | Intelligence; Learning; Memory; Motivation & Emotion; Language & Cognition | 73-77 |
| Social & Cultural Bases | Social Cognition; Group Dynamics; Cultural Psychology; Diversity/Identity/Oppression | 78-81 |

Reported but not yet found in this workspace:

| EPPP Domain | Reported File | Status |
|---|---|---|
| Biological Bases of Behavior | `EPPP_Part1_Domain1_Biological_Bases.md` | Missing locally |
| Assessment & Diagnosis | `EPPP_Part1_Domain5_Assessment_Diagnosis.md` | Missing locally |
| Treatment, Intervention, Prevention & Supervision | `EPPP_Part1_Domain6_Treatment_Supervision.md` | Missing locally |
| Research Methods & Statistics | `EPPP_Part1_Domain7_Research_Methods_Statistics.md` | Missing locally |

## Classification Rules

Use these rules when reviewing live topic exports.

| Classification | Criteria | Action |
|---|---|---|
| Main PsychPro | Neuropsychology, neuroscience, Brain Lab, assessment-measure library, psychotherapy, community, or general study-lab content that is not explicitly mapped to an EPPP domain | Keep on main PsychPro surfaces |
| EPPP Primary | Official Part 1 domain lesson, KN chapter, domain exam, or EPPP-specific study guide/question set | Show in EPPP Mastery Suite |
| EPPP Support | Main PsychPro content that strengthens an EPPP lesson but is too granular or specialized to be the official EPPP chapter | Link from EPPP lesson, use in rationales, practice, cases, or visuals |
| Needs Review | Generic categories such as Assessment, Clinical, Research & Statistics, Psychotherapy, or any topic with ambiguous title/category | Product-owner decision before moving |
| Do Not Import Yet | Claude-reported content not present in repo or not exported from live database | Recover/export first, then compare |

## Domain Ownership Recommendation

Each EPPP domain should have one official learner-facing lesson set. Existing deep PsychPro material should support that lesson set rather than create competing EPPP chapters.

| EPPP Domain | Primary Knowledge Base | Reuse Other Content As |
|---|---|---|
| I. Biological Bases of Behavior | Recovered Claude file or starter architecture merged with existing neuroscience seed | Brain Lab links, visual library, pharmacology questions, biological rationales |
| II. Cognitive-Affective Bases | Claude live lessons if export verifies them | Motivation, language, memory, and learning theory practice |
| III. Social and Cultural Bases | Claude live lessons if export verifies them | Multicultural vignettes, bias/social cognition rationales |
| IV. Growth and Lifespan Development | Claude live lessons if export verifies them | Developmental cases, ADHD/development links |
| V. Assessment and Diagnosis | Recovered Claude file plus existing assessment/diagnosis support | Differential diagnosis, test interpretation, measure-selection practice |
| VI. Treatment, Intervention, Prevention, Supervision | Recovered Claude file plus psychotherapy/treatment content | Intervention matching, supervision cases, treatment rationales |
| VII. Research Methods and Statistics | Recovered Claude file or starter architecture expansion | Formula visuals, research flaw questions, statistics practice |
| VIII. Ethical, Legal, Professional Issues | Claude live lessons if export verifies them | Ethics decision trees, jurisdiction/rule distinction practice |

## Required Long-Term Fix

Add explicit content ownership metadata instead of relying on `topics.category`.

Recommended minimum fields or equivalent tables:

- `content_track`: `psychpro_core`, `eppp`
- `domain_code`: for EPPP, `I` through `VIII`
- `domain_name`: official EPPP domain label
- `kn_code`: official knowledge statement code when applicable
- `content_role`: `primary`, `support`, `practice`, `case`, `visual`, `archived`
- `source`: `repo_seed`, `claude_connector`, `claude_markdown`, `manual`, `import`

This can be implemented as a new metadata table keyed by `topic_id` so the existing topic/content tables do not need a risky rewrite.

## Immediate Reorganization Plan

1. Export the live PsychPro topic inventory from the database that Replit is publishing.
2. Classify every topic as Main PsychPro, EPPP Primary, EPPP Support, Needs Review, or Do Not Import Yet.
3. Confirm whether reported topic IDs 62-81 exist in the same database used by the live app.
4. Confirm whether the four missing Claude Markdown files can be recovered or freshly exported.
5. Create an EPPP content metadata table or import manifest before moving any rows.
6. Keep the EPPP Suite filtered using `isEpppTopic` until metadata exists.
7. Convert overlapping non-primary content into practice, cases, rationales, visual library assets, or support links.
8. Remove disallowed lesson labels and normalize wording before launch.
9. Build route-level guards so EPPP-only pages cannot accidentally surface main content.
10. Only then import the remaining four EPPP domains.

## Current App State After Fix

The EPPP Suite now filters shared topics through `isEpppTopic`, so the dashboard, Domains, Question Bank, Flashcards, and Domain Mastery Exams views should no longer show main-site topics from the shared topic list.

This is a frontend containment fix. It does not yet reorganize the database itself.

## Next Verification Needed

Run `scripts/export-topics-md.mjs` in the environment with the real `DATABASE_URL`, then compare the generated `.local/exports/topics/INDEX.md` against this audit.

No production seeding or import should run until that export is reviewed.
