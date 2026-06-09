# PsychPro EPPP Overlap Adjudication Plan

Created: June 8, 2026

Purpose: decide which overlapping content becomes the primary knowledge base for each EPPP domain, and which content should be reused as practice, rationales, cases, visuals, or adaptive review.

## Working Principle

Each EPPP domain should have one clean instructional source of truth. Duplicate or deeper material should not create competing chapters on the main learning path.

Use content in these roles:

- Primary knowledge base: the official lesson/study-guide content learners see first.
- Practice bank: quiz questions, exam items, answer rationales, case prompts, and mastery checks.
- Reinforcement: common confusion points, examples, adaptive review hooks, and brief remediation snippets.
- Visual library: diagrams, comparison tables, timelines, decision pathways, and brain/assessment maps.
- Advanced enrichment: deeper optional material for learners who want more context after core mastery.

Do not convert glossary terms into flashcards. Flashcards should come from the study guides, questions, and missed concepts.

## Current Known Content Sources

### Repo Source: EPPP Starter Architecture

- File: `content/eppp-mastery-domain-chapters.md`
- Coverage: all 8 domains and 71 KN chapters.
- Best use: official domain/chapter structure, KN mapping, starter prose, learning objectives, and practice prompts.
- Limitation: not yet full study-guide depth.

### Repo Source: Expanded Chapter Model

- File: `content/eppp-expanded-chapter-model.md`
- Coverage: reusable chapter format plus a full KN7 exemplar.
- Best use: content standard for every final knowledge-base lesson.

### Repo Source: Existing App Seed

- File: `lib/db/src/seed.ts`
- Visible topic array in this clone: 15 neuro/neuropsych-heavy topics.
- Repo docs elsewhere report 39 topics, so live database verification is needed.
- Best use: detailed biological, neuropsychological, assessment, diagnostic, and psychopharmacology support content.
- Risk: much of this content is too granular to be the official EPPP domain structure by itself.

Visible seeded topics in this clone:

| Topic | Current category | Best reuse |
|---|---|---|
| Neuropsychology Overview | Foundations | Domain I, V, and neurocognitive assessment enrichment; practice rationales |
| Cell Biology & Neuron Anatomy | Foundations | Domain I primary support or enrichment for KN1 |
| Neurotransmitters & Synaptic Transmission | Foundations | Domain I primary support for KN1/KN2 |
| Sensory Pathways | Neuroanatomy | Domain I enrichment; visual library diagrams |
| Sensory Systems | Neuroscience | Domain I support; visual library diagrams |
| Limbic System & Motivation | Neuroscience | Domain I/II support; motivation and emotion practice |
| Sleep & Circadian Rhythms | Neuroscience | Domain I support; biological and clinical practice |
| Endocrine System & Reproduction | Neuroscience | Domain I/IV support; development and biological practice |
| Psychopharmacology | Clinical | Domain I/VI support; medication and treatment evidence practice |
| Psychological Disorders | Neuropsychology | Domain V primary support or practice bank |
| Personality Disorders | Neuropsychology | Domain V primary support or practice bank |
| ADHD & Medications | Clinical | Domain V/VI support; child assessment and treatment practice |
| Language Processing & Aphasia | Neuropsychology | Domain II support; language/cognition enrichment |
| Apraxia & Agnosia | Neuropsychology | Domain V/neurocognitive support; advanced practice |
| Neurocognitive Disorders | Clinical | Domain V primary support or practice bank |

### Claude Connector-Reported Live Content

Status: reported by Claude through the user; not independently verified here.

- Topic IDs 62-81.
- 20 lessons across Ethics, Growth/Lifespan, Cognitive-Affective, and Social/Cultural.
- Reported assets: 20 study guides, 1,000 flashcards, approximately 624 quiz questions, 20 practice exams.

### Claude-Reported Markdown Files Not Found Locally

- `EPPP_Part1_Domain1_Biological_Bases.md`
- `EPPP_Part1_Domain5_Assessment_Diagnosis.md`
- `EPPP_Part1_Domain6_Treatment_Supervision.md`
- `EPPP_Part1_Domain7_Research_Methods_Statistics.md`

Reported assets: 18 lessons, 18 study guides, 900 flashcards, approximately 550 quiz questions.

## Domain-by-Domain Adjudication

### Domain I: Biological Bases of Behavior

Recommended primary knowledge base:

- Use the EPPP Starter Architecture as the official 5-KN structure.
- Use existing seed content as the main substance for KN1, KN2, and KN5 because it is already strong in neuroscience, psychopharmacology, sensory systems, sleep, endocrine systems, and neuroimaging-adjacent material.
- If Claude's `EPPP_Part1_Domain1_Biological_Bases.md` is recovered, compare it against the seed and keep whichever version is clearer and more EPPP-aligned as the core lesson prose.

Best source by chapter:

| Chapter | Primary source | Reuse remaining content as |
|---|---|---|
| KN1 Neurobiological and Genetic Bases | Existing seed plus starter structure | visual brain maps, applied neurobehavioral vignettes, advanced rationales |
| KN2 Psychopharmacology and Drugs of Abuse | Existing Psychopharmacology and neurotransmitter seed | medication adverse-effect questions, substance-use distractors |
| KN3 Treatment Evidence | Starter architecture or recovered Claude file | treatment-comparison practice items |
| KN4 Behavioral Genetics | Starter architecture or recovered Claude file | brief practice items and common-confusion rationales |
| KN5 Biological Technologies | Starter architecture plus neuropsych assessment content | imaging/test interpretation questions |

Do not make all neuroanatomy topics separate EPPP main-page chapters unless the product owner wants an advanced neuroscience track. They should support the official Domain I path.

### Domain II: Cognitive-Affective Bases of Behavior

Recommended primary knowledge base:

- Use Claude connector-reported live lessons if they are present and visible: Intelligence, Learning, Memory, Motivation and Emotion, Language and Cognition.
- Use `KN7: Learning Principles and Clinical Behavior Change` from the Expanded Chapter Model as the content standard and likely best primary lesson for learning theory.

Overlap handling:

| Existing/other content | Best reuse |
|---|---|
| Limbic System & Motivation | emotion/motivation applied practice and visuals |
| Language Processing & Aphasia | language/cognition enrichment and differential questions |
| Neurocognitive Disorders | memory-related differential reasoning |
| KN6-KN10 starter chapters | structure, objectives, and gaps check against Claude live lessons |

### Domain III: Social and Cultural Bases of Behavior

Recommended primary knowledge base:

- Use Claude connector-reported live lessons as primary if verified: Social Cognition, Group Dynamics, Cultural Psychology, Diversity/Identity/Oppression.
- Use starter chapters to ensure official KN coverage is complete.

Reuse remaining content as:

- vignette-based multicultural reasoning questions
- bias/attribution/common-confusion rationales
- group-process applied cases
- visual comparison matrices for identity, acculturation, prejudice, and social influence

### Domain IV: Growth and Lifespan Development

Recommended primary knowledge base:

- Use Claude connector-reported live lessons as primary if verified: Foundational Theories, Attachment and Temperament, Middle Childhood and Adolescence, Adulthood, Family Systems.
- Use starter chapters to confirm all developmental KN statements are covered.

Overlap handling:

| Existing/other content | Best reuse |
|---|---|
| Endocrine System & Reproduction | puberty, prenatal exposure, and biological-development practice |
| ADHD & Medications | child/adolescent development and intervention vignettes |
| Psychological Disorders | developmental differential examples |

### Domain V: Assessment and Diagnosis

Recommended primary knowledge base:

- Recover Claude's `EPPP_Part1_Domain5_Assessment_Diagnosis.md` if possible and compare it to existing seeded diagnostic/neuropsych content.
- Use the official starter architecture to keep the domain organized around assessment theory, psychometrics, diagnosis, test selection, interpretation, and differential diagnosis.
- Use existing seed topics as substantial support material, especially Psychological Disorders, Personality Disorders, ADHD & Medications, Neurocognitive Disorders, Neuropsychology Overview, Apraxia & Agnosia, and Language Processing & Aphasia.

Best reuse:

- Turn existing disorder content into diagnostic vignettes and differential diagnosis questions.
- Turn neuropsych content into assessment interpretation questions.
- Use detailed disorder prose as answer rationales and remediation snippets rather than multiple competing study-guide chapters.

### Domain VI: Treatment, Intervention, Prevention, and Supervision

Recommended primary knowledge base:

- Recover Claude's `EPPP_Part1_Domain6_Treatment_Supervision.md` if possible.
- Use starter architecture to enforce coverage of intervention selection, evidence-based treatment, prevention, supervision, consultation, and crisis/risk.
- Use existing psychopharmacology and disorder-treatment sections as support, not as the whole treatment domain.

Best reuse:

- medication/treatment interaction questions
- treatment matching vignettes
- supervision/consultation cases
- rationales explaining why a plausible intervention is not first-line

### Domain VII: Research Methods and Statistics

Recommended primary knowledge base:

- Recover Claude's `EPPP_Part1_Domain7_Research_Methods_Statistics.md` if possible.
- If unrecoverable, expand from the starter architecture using the glossary terms and visual library spec.

Best reuse:

- formula cards and visual summaries
- applied statistics items
- research-design flaw questions
- validity/reliability interpretation rationales

Existing seed has limited direct research/statistics coverage, so this domain likely needs the most original build work unless Claude's file is recovered.

### Domain VIII: Ethical, Legal, and Professional Issues

Recommended primary knowledge base:

- Use Claude connector-reported live lessons as primary if verified: APA Code, Confidentiality/Privilege/Reporting, Informed Consent, Multiple Relationships/Boundaries, Decision-Making Models, Specialty Ethics.
- Use starter architecture as the official coverage check.

Best reuse:

- ethics decision-tree visuals
- jurisdiction/rule-distinction rationales
- complex practice vignettes
- missed-question remediation

## Import and Main-Page Rules

1. A domain should show one learner-facing lesson set, not every source file that overlaps.
2. Official EPPP domain names should be the main page grouping.
3. Lesson titles should be plain-language and stable; KN tags can appear as metadata rather than noisy titles if preferred.
4. Existing deep neuro/neuropsych content should be linked from the official EPPP lesson it supports.
5. Practice questions may draw from any source, but every question should have a competency tag and a clear rationale.
6. If a source is weaker as prose but strong as examples, extract examples rather than preserving the full lesson.
7. If two lessons overlap, choose the clearer one for instruction and convert the other into practice, cases, or reinforcement.
8. Do not add glossary-only flashcards.
9. Do not add duplicate topic cards to the main page simply because content exists.
10. Do not seed production until live topic IDs and source ownership are mapped.

## Why Some Claude Topics May Be Visible and Others May Not

The visible Courses page uses `GET /api/topics`, then groups lessons by `topics.category`. It does not read directly from the newer `courses` table for display.

That means a topic is expected to appear on the Courses page if it exists in `topics`. A course wrapper in `courses` is not enough by itself.

Likely causes to verify:

- Topic rows 62-81 may not all exist in the same database environment the frontend is using.
- Some rows may have unexpected `category` values and therefore appear under an unexpected course group.
- Claude may have created course wrappers in `courses` but not linked every lesson through `topics.course_id`.
- The main page may be pointed at production while Claude wrote to staging, or the reverse.
- Some async course-wrapper work may not have finished, especially for Growth/Lifespan, Cognitive-Affective, and Social/Cultural.

Use `content/eppp-live-inventory-queries.sql` to verify the live state before making code or import changes.

## Immediate Work Queue

1. Export live topics 62-81 and verify which appear on the main page.
2. Identify live topics that exist in the database but are hidden or missing from the main page.
3. Locate the four Claude-reported Markdown files or request a fresh export.
4. Build a domain ownership table with one row per official EPPP domain and one row per KN chapter.
5. Decide whether existing seeded neuropsych topics become an advanced support library or are folded into official Domain I/V lessons.
6. Convert overlapping non-primary content into practice items, rationales, cases, visual specs, and remediation snippets.
