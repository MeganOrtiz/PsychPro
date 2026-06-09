# PsychPro Visual Learning Library System

Purpose: Define how PsychPro should build the Visual Learning Library across EPPP domains so visuals feel consistent with the existing site, support mastery, and connect directly to chapters, questions, cases, and analytics.

Core rule: Visuals are not decoration. Every visual must clarify a relationship, distinction, process, sequence, structure, or decision point that is hard to retain through prose alone.

---

## Existing PsychPro Visual Scheme

The current PsychPro design language already exists in the landing and dashboard redesign files.

Primary palette:
- Background navy: `#061827`
- Deep panel navy: `#0A1A2C`
- App panel blue: `#0F2742`
- Atlantic Steel: `#1C4E75`
- Tidepool Teal: `#2FA0C6`
- Summer Surf: `#58C9F3`
- Glacier Mist: `#BDE5FF`
- White: `#FFFFFF`
- Soft ink: light blue-gray text tones
- Desaturated steel accents: used for lower-emphasis anatomical structures

Existing lobe palette:
- Frontal lobe: Atlantic Steel `#1C4E75`
- Parietal lobe: Tidepool Teal `#2FA0C6`
- Temporal lobe: Summer Surf `#58C9F3`
- Occipital lobe: Glacier Mist `#BDE5FF`
- Cerebellum: desaturated steel
- Brainstem: deep steel

Visual style:
- Dark navy interface background
- Cyan/teal emphasis
- Clean SVG diagrams
- Thin borders with low-opacity cyan lines
- Minimal shadows and soft glow
- Rounded components, but diagrams themselves should stay crisp
- Clear labels, not decorative labels
- No cluttered gradients inside educational diagrams
- No stock-looking images when a diagram communicates the idea better

Interaction style:
- Hover or click to reveal more detail
- One active region per visual when possible
- Pins for named regions or key concepts
- Legends that double as controls
- Readout panel below or beside the visual
- Visual state should connect to user progress when available

---

## Visual Library Categories

### 1. Anatomy Maps

Use for:
- brain lobes
- limbic system
- neurotransmitter pathways
- cortical/subcortical structures
- sensory and motor systems

Visual pattern:
- labeled anatomical SVG
- color-coded regions
- numbered pins for named areas
- side legend with function, disorder links, and chapter links
- clickable region readout

Examples:
- Broca vs Wernicke localization map
- limbic system and fear learning map
- basal ganglia and habit/reward loop
- hippocampus and memory consolidation

### 2. Process Flowcharts

Use for:
- ethical decision-making
- differential diagnosis
- treatment selection
- assessment interpretation
- research design selection
- learning and memory processes

Visual pattern:
- left-to-right or top-to-bottom decision flow
- one concept per node
- short labels
- decision diamonds only where there is a real branch
- final nodes should link to next action or related chapter

Examples:
- confidentiality decision pathway
- duty to protect decision pathway
- test selection workflow
- exposure therapy learning loop
- study planner scheduling flow

### 3. Comparison Matrices

Use for:
- easily confused theories
- diagnoses
- statistical concepts
- treatment models
- ethics/legal distinctions
- assessment concepts

Visual pattern:
- compact table
- columns: concept, core idea, clinical example, common confusion, exam-style reasoning
- consistent color accents by domain
- allow sorting or expanding when implemented in app

Examples:
- classical vs operant conditioning
- negative reinforcement vs punishment
- reliability vs validity
- sensitivity vs specificity
- delirium vs dementia
- mania vs hypomania
- Piaget vs Vygotsky vs Erikson vs Kohlberg

### 4. Timelines

Use for:
- lifespan development
- therapy progression
- research phases
- diagnostic course
- memory consolidation and review

Visual pattern:
- horizontal timeline on desktop
- vertical timeline on mobile
- major developmental or process milestones
- brief labels with expandable details

Examples:
- prenatal to late adulthood developmental tasks
- Erikson stages
- Piaget stages
- grief and adjustment process
- spaced review schedule

### 5. Concept Maps

Use for:
- connecting domains
- showing related chapters
- organizing theories
- building integrated clinical reasoning

Visual pattern:
- central concept with surrounding linked nodes
- use line weight to indicate stronger relationships
- avoid excessive node count; show 6-12 meaningful relationships

Examples:
- anxiety maintenance map
- biopsychosocial formulation map
- memory systems concept map
- treatment planning map
- cultural formulation map

### 6. Formula and Interpretation Cards

Use for:
- statistics
- psychometrics
- epidemiology
- assessment interpretation

Visual pattern:
- formula
- plain-language meaning
- miniature worked example
- common confusion point
- when to use it

Examples:
- sensitivity
- specificity
- PPV
- NPV
- effect size
- confidence interval
- reliability
- validity
- power
- Type I and Type II error

### 7. Clinical Reasoning Boards

Use for:
- clinical cases
- differential diagnosis
- treatment planning
- biopsychosocial formulation

Visual pattern:
- vignette summary
- presenting concern
- differential possibilities
- evidence for and against
- next assessment step
- treatment direction

Examples:
- ADHD vs anxiety vs trauma attention complaint
- delirium vs dementia
- panic disorder vs cardiac concern
- school refusal formulation
- substance-induced vs primary mood disorder

### 8. Progress Visuals

Use for:
- dashboard
- domain analytics
- readiness score
- missed question center
- study planner

Visual pattern:
- radar chart for domain balance
- heatmap for study consistency
- retention curve for review timing
- progress bars for domain completion
- mastery map by competency

Examples:
- domain mastery radar
- two-week study heatmap
- forgetting curve with scheduled reviews
- competency mastery grid
- readiness score component breakdown

---

## Domain-to-Visual Mapping

### Domain I: Biological Bases of Behavior

Primary visual types:
- anatomy maps
- neurotransmitter pathway maps
- lesion-function diagrams
- medication mechanism cards
- brain imaging comparison cards

Required visuals:
- brain lobe map
- limbic system map
- neurotransmitter functions chart
- psychotropic medication class comparison
- imaging modality comparison

### Domain II: Cognitive-Affective Bases of Behavior

Primary visual types:
- process diagrams
- comparison matrices
- concept maps
- memory models

Required visuals:
- learning theory comparison matrix
- classical and operant conditioning diagrams
- memory systems map
- emotion theory comparison
- cognition-behavior-affect loop

### Domain III: Social and Cultural Bases of Behavior

Primary visual types:
- systems maps
- identity/context maps
- group process diagrams
- comparison matrices

Required visuals:
- stereotype/prejudice/discrimination distinction
- attribution bias map
- ecological-cultural context map
- intersectionality framework
- oppression levels diagram

### Domain IV: Growth and Lifespan Development

Primary visual types:
- timelines
- stage comparison tables
- ecological systems diagrams
- family systems maps

Required visuals:
- lifespan development timeline
- Piaget stage chart
- Erikson stage chart
- attachment pattern comparison
- Bronfenbrenner ecological systems map

### Domain V: Assessment and Diagnosis

Primary visual types:
- formula cards
- diagnostic decision flows
- psychometric comparison tables
- assessment workflows

Required visuals:
- reliability vs validity matrix
- sensitivity/specificity/PPV/NPV card set
- differential diagnosis workflow
- assessment method comparison
- categorical vs dimensional diagnosis comparison

### Domain VI: Treatment, Intervention, Prevention, and Supervision

Primary visual types:
- treatment selection flows
- intervention mechanism maps
- supervision process diagrams
- prevention level matrices

Required visuals:
- treatment matching flow
- prevention levels matrix
- exposure mechanism diagram
- motivational interviewing change map
- supervision development model

### Domain VII: Research Methods and Statistics

Primary visual types:
- formula cards
- design selection trees
- validity threat maps
- statistics interpretation cards

Required visuals:
- research design comparison matrix
- internal vs external validity map
- Type I vs Type II error table
- power/effect size/significance interpretation card
- evaluation type comparison

### Domain VIII: Ethical, Legal, and Professional Issues

Primary visual types:
- decision trees
- legal/ethical distinction cards
- professional responsibility flows
- technology risk maps

Required visuals:
- ethical decision-making pathway
- confidentiality limits tree
- duty to protect pathway
- informed consent checklist visual
- telepsychology risk map

---

## Visual Asset Metadata

Every visual should eventually have:
- visual_id
- title
- domain
- KN tags
- related chapters
- related glossary terms
- visual type
- short description
- learning purpose
- accessibility alt text
- source notes
- review status
- last reviewed date

Example:

```yaml
visual_id: visual_kn7_learning_theory_matrix
title: Learning Theory Comparison Matrix
domain: Domain II
kn_tags: [KN7, KN12, KN44]
visual_type: comparison_matrix
related_chapters:
  - KN7: Learning Principles and Clinical Behavior Change
  - KN44: Treatment Techniques and Comparative Efficacy
learning_purpose: Helps learners distinguish classical conditioning, operant conditioning, observational learning, and cognitive learning in clinical vignettes.
accessibility_alt_text: A comparison table showing the core mechanism, clinical example, and common confusion point for four learning theory models.
review_status: draft
```

---

## Implementation Order

1. Build a reusable visual component system:
- anatomy map
- comparison matrix
- process flowchart
- timeline
- formula card
- concept map
- decision tree

2. Create one completed visual set for Domain II:
- learning theory matrix
- conditioning diagrams
- memory systems map
- emotion theory comparison
- cognition-affect-behavior loop

3. Attach visuals to expanded chapter modules.

4. Add visual metadata so the AI tutor, search, and related-topic system can retrieve them.

5. Build the Visual Learning Library as a browsable collection with filters:
- domain
- KN tag
- visual type
- related topic
- saved visuals
- recently viewed
- needs review

---

## What Not To Do

- Do not make visuals decorative filler.
- Do not use visuals that require long paragraphs to understand.
- Do not create a separate visual style per domain.
- Do not rely on generic stock illustrations.
- Do not make all visuals blue; use the PsychPro palette with purposeful contrast.
- Do not turn glossary terms into a standalone flashcard deck. Flashcards should come from chapter concepts, clinical reasoning, missed questions, and adaptive review needs.
