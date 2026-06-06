export type BrainSystem =
  | "cortex"
  | "limbic"
  | "diencephalon"
  | "basal-ganglia"
  | "white-matter"
  | "brainstem"
  | "cerebellum"
  | "ventricle";

export type BrainLayer = "cortex" | "subcortical" | "deep" | "ventricle";

export type StructureShape = "lobe" | "ellipsoid" | "arch" | "crescent" | "tube";

// Anatomical PART TYPE — drives label color-coding in the flat (2D) atlas views.
// Each type gets one harmonious shade (see CATEGORY_META) so learners can read a
// diagram by structure type at a glance: every gyrus one color, every sulcus
// another, and so on. PsychPro-harmonious (cool-dominant, never mint #5EEAD4).
export type PartCategory =
  | "lobe"
  | "gyrus"
  | "sulcus"
  | "pole"
  | "lobule"
  | "area"
  | "nucleus"
  | "white-matter"
  | "ventricle"
  | "brainstem"
  | "cerebellum";

// Rich, structured long-form content for the detail panel. Each block is a small
// tagged shape so the renderer can lay out prose, bullet lists, sub-headings, and
// "term — description" pairs (used for the anatomical/assessment tables) without
// any markdown parsing. Optional — only the in-depth structures (e.g. the four
// lobes) supply it; everything else keeps the concise four-field format.
export type DetailBlock =
  | { h: string } // sub-heading within a section
  | { p: string } // paragraph
  | { ul: string[] } // bullet list
  | { dl: { term: string; desc: string }[] }; // term/description pairs (tables)

export interface RichDetail {
  anatomy?: DetailBlock[];
  functions?: DetailBlock[];
  connections?: DetailBlock[];
  clinical?: DetailBlock[];
  assessment?: DetailBlock[];
}

export interface BrainStructure {
  id: string;
  name: string;
  shortName: string;
  system: BrainSystem;
  category: PartCategory;
  layer: BrainLayer;
  paired: boolean;
  shape: StructureShape;
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  displacement: number;
  segments: number;
  color: string;
  overview: string;
  functions: string[];
  neuropsych: string[];
  conditions: string[];
  topicHints: string[];
  // Optional in-depth reference content shown in the detail panel tabs.
  detail?: RichDetail;
}

export const SYSTEM_META: Record<BrainSystem, { label: string; color: string; description: string }> = {
  cortex: {
    label: "Cerebral Cortex",
    color: "#58C9F3",
    description: "Outer mantle of grey matter responsible for higher cognition, perception, and voluntary movement.",
  },
  limbic: {
    label: "Limbic System",
    color: "#7DD8E8",
    description: "Deep structures driving emotion, motivation, and the encoding of long-term memory.",
  },
  diencephalon: {
    label: "Diencephalon",
    color: "#3FB6D9",
    description: "Central relay region — thalamus, hypothalamus, and pituitary — coordinating sensation, homeostasis, and hormones.",
  },
  "basal-ganglia": {
    label: "Basal Ganglia",
    color: "#9DEAFF",
    description: "Subcortical motor-control nuclei deeply involved in habit learning, reward, and movement initiation.",
  },
  "white-matter": {
    label: "White Matter Tracts",
    color: "#BDE5FF",
    description: "Myelinated fiber bundles that bridge cortical regions and connect the two hemispheres.",
  },
  brainstem: {
    label: "Brainstem",
    color: "#1C4E75",
    description: "Midbrain, pons, and medulla — vital autonomic centers and origin of most cranial nerves.",
  },
  cerebellum: {
    label: "Cerebellum",
    color: "#2FA0C6",
    description: "The 'little brain' behind the brainstem, coordinating movement, balance, and motor learning.",
  },
  ventricle: {
    label: "Ventricular System",
    color: "#5FA8C9",
    description: "CSF-filled cavities that cushion the brain and clear metabolic waste.",
  },
};

// Color key for the anatomical part types. Cool-dominant and harmonious with the
// PsychPro palette (cerulean core), with a few restrained warm accents (pole/amber,
// lobule/rose, brainstem/gold, cerebellum/coral) so all 11 types stay legible
// against the dark glass atlas. Never mint #5EEAD4.
export const CATEGORY_META: Record<PartCategory, { label: string; color: string; description: string }> = {
  lobe: {
    label: "Lobe",
    color: "#76E4F7",
    description: "One of the brain's major cortical divisions.",
  },
  gyrus: {
    label: "Gyrus",
    color: "#8AB4FF",
    description: "A raised ridge of cortex between two sulci.",
  },
  sulcus: {
    label: "Sulcus / Fissure",
    color: "#B79CF2",
    description: "A groove or infolding separating gyri or lobes.",
  },
  pole: {
    label: "Pole",
    color: "#F2B66B",
    description: "The rounded anterior or posterior tip of a lobe.",
  },
  lobule: {
    label: "Lobule",
    color: "#F49AC0",
    description: "A smaller cortical subdivision bounded by sulci.",
  },
  area: {
    label: "Functional Area",
    color: "#3FB6D9",
    description: "A cortical region defined by its function rather than its folds.",
  },
  nucleus: {
    label: "Nucleus / Deep Grey",
    color: "#7E8CE8",
    description: "A cluster of grey-matter cell bodies deep in the brain.",
  },
  "white-matter": {
    label: "White Matter",
    color: "#BDE5FF",
    description: "Myelinated fiber tracts connecting regions.",
  },
  ventricle: {
    label: "Ventricle",
    color: "#6FC6DE",
    description: "A CSF-filled cavity within the brain.",
  },
  brainstem: {
    label: "Brainstem",
    color: "#F2D06B",
    description: "Midbrain, pons, and medulla — vital autonomic centers.",
  },
  cerebellum: {
    label: "Cerebellum",
    color: "#FF98A8",
    description: "The 'little brain' coordinating movement and balance.",
  },
};

// Single place that assigns an anatomical TYPE to every structure id. The final
// BRAIN_STRUCTURES array below injects each structure's `category` and a
// category-driven `color` from this map, so chips, search dots, detail accents,
// and the 2D atlas labels all recolor by part type automatically.
const CATEGORY_BY_ID: Record<string, PartCategory> = {
  // Lobes
  "frontal-lobe": "lobe",
  "parietal-lobe": "lobe",
  "temporal-lobe": "lobe",
  "occipital-lobe": "lobe",
  // Functional cortical areas
  "prefrontal-cortex": "area",
  "orbitofrontal-cortex": "area",
  "motor-cortex": "area",
  "somatosensory-cortex": "area",
  "anterior-cingulate": "area",
  "posterior-cingulate": "area",
  "insular-cortex": "area",
  "broca-area": "area",
  "wernicke-area": "area",
  "auditory-cortex": "area",
  "lateral-occipital-cortex": "area",
  "pars-opercularis": "area",
  "pars-triangularis": "area",
  "pars-orbitalis": "area",
  // Gyri
  "supramarginal-gyrus": "gyrus",
  "angular-gyrus": "gyrus",
  "superior-frontal-gyrus": "gyrus",
  "middle-frontal-gyrus": "gyrus",
  "inferior-frontal-gyrus": "gyrus",
  "precentral-gyrus": "gyrus",
  "postcentral-gyrus": "gyrus",
  "superior-temporal-gyrus": "gyrus",
  "middle-temporal-gyrus": "gyrus",
  "inferior-temporal-gyrus": "gyrus",
  "cingulate-gyrus": "gyrus",
  "parahippocampal-gyrus": "gyrus",
  "fusiform-gyrus": "gyrus",
  "lingual-gyrus": "gyrus",
  "gyrus-rectus": "gyrus",
  cuneus: "gyrus",
  precuneus: "gyrus",
  uncus: "gyrus",
  // Sulci & fissures
  "central-sulcus": "sulcus",
  "lateral-sulcus": "sulcus",
  "superior-frontal-sulcus": "sulcus",
  "inferior-frontal-sulcus": "sulcus",
  "superior-temporal-sulcus": "sulcus",
  "inferior-temporal-sulcus": "sulcus",
  "intraparietal-sulcus": "sulcus",
  "calcarine-sulcus": "sulcus",
  "parieto-occipital-sulcus": "sulcus",
  "cingulate-sulcus": "sulcus",
  "longitudinal-fissure": "sulcus",
  "horizontal-fissure": "sulcus",
  // Poles
  "frontal-pole": "pole",
  "temporal-pole": "pole",
  "occipital-pole": "pole",
  // Lobules
  "superior-parietal-lobule": "lobule",
  "inferior-parietal-lobule": "lobule",
  "paracentral-lobule": "lobule",
  // Nuclei / deep grey
  hippocampus: "nucleus",
  amygdala: "nucleus",
  "mammillary-bodies": "nucleus",
  thalamus: "nucleus",
  hypothalamus: "nucleus",
  pituitary: "nucleus",
  caudate: "nucleus",
  putamen: "nucleus",
  "globus-pallidus": "nucleus",
  "substantia-nigra": "nucleus",
  "nucleus-accumbens": "nucleus",
  "locus-coeruleus": "nucleus",
  "pineal-gland": "nucleus",
  claustrum: "nucleus",
  "olfactory-bulb": "nucleus",
  // White matter
  fornix: "white-matter",
  "corpus-callosum": "white-matter",
  "internal-capsule": "white-matter",
  "external-capsule": "white-matter",
  "optic-chiasm": "white-matter",
  // Ventricles
  "lateral-ventricles": "ventricle",
  "third-ventricle": "ventricle",
  // Brainstem
  midbrain: "brainstem",
  pons: "brainstem",
  medulla: "brainstem",
  "spinal-cord": "brainstem",
  // Cerebellum
  cerebellum: "cerebellum",
  "cerebellar-hemisphere": "cerebellum",
  "cerebellar-folia": "cerebellum",
};

type StructureDef = Omit<BrainStructure, "category">;

const STRUCTURE_DEFS: StructureDef[] = [
  // ──────────────── CORTICAL LOBES (4) ────────────────
  {
    id: "frontal-lobe",
    name: "Frontal Lobe",
    shortName: "Frontal",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, 0.45, 1.05],
    scale: [1.55, 1.15, 1.25],
    displacement: 0.18,
    segments: 6,
    color: "#58C9F3",
    overview:
      "The largest cortical lobe, occupying the anterior third of each hemisphere. It spans from the central sulcus (posteriorly) and the lateral fissure (inferiorly) to the frontal pole, and houses the primary motor cortex, premotor cortex, and supplementary motor area alongside the prefrontal regions that define personality, planning, and self-regulation. As the seat of executive function, expressive language, and social-emotional control, it is the cortical region most often implicated in neuropsychological syndromes — and the last to fully mature, with development continuing into the mid-twenties.",
    functions: [
      "Voluntary motor planning and execution",
      "Expressive language (Broca's area, dominant hemisphere)",
      "Working memory and attentional control",
      "Personality, judgment, and impulse regulation",
      "Goal-directed behavior and decision making",
    ],
    neuropsych: [
      "Anchors the central executive — the cognitive system most often assessed in neuropsych batteries (Stroop, Trails, Wisconsin Card Sort)",
      "Frontal release signs (grasp, snout, palmomental) suggest diffuse frontal pathology",
      "Distinguishes 'apathetic' vs 'disinhibited' frontal syndromes depending on which subregion is affected",
      "Late maturation (~age 25) explains heightened risk-taking in adolescents",
    ],
    conditions: [
      "Frontotemporal dementia (behavioral variant)",
      "Traumatic brain injury — most vulnerable to coup/contrecoup damage",
      "ADHD — reduced frontal volume and connectivity",
      "Schizophrenia — hypofrontality on functional imaging",
    ],
    topicHints: ["Neuropsychology Overview", "Executive Function & Frontal Lobe Syndromes"],
    detail: {
      anatomy: [
        { h: "Boundaries" },
        {
          p: "The frontal lobe occupies the anterior third of each cerebral hemisphere. Its posterior border is the central sulcus (sulcus of Rolando), which separates it from the parietal lobe. Inferiorly, the lateral (Sylvian) fissure divides it from the temporal lobe. Medially, the longitudinal fissure separates the two frontal lobes, and the cingulate sulcus marks the boundary between frontal cortex and the underlying cingulate gyrus on the medial surface.",
        },
        { h: "Major gyri and sulci" },
        {
          p: "The lateral surface is divided by the precentral sulcus, superior frontal sulcus, and inferior frontal sulcus into four major gyri:",
        },
        {
          ul: [
            "Precentral gyrus — anterior to the central sulcus; houses primary motor cortex",
            "Superior frontal gyrus — above the superior frontal sulcus",
            "Middle frontal gyrus — between the superior and inferior frontal sulci",
            "Inferior frontal gyrus (IFG) — below the inferior frontal sulcus; subdivided into pars opercularis, pars triangularis, and pars orbitalis",
          ],
        },
        {
          p: "The orbital (inferior) surface contains the orbital gyri and the medial gyrus rectus. The medial surface includes the medial extension of the superior frontal gyrus, the paracentral lobule (containing medial M1 and medial premotor regions), and the anterior cingulate gyrus.",
        },
        { h: "Functional subdivisions" },
        {
          dl: [
            { term: "Primary motor cortex (M1)", desc: "Precentral gyrus — voluntary movement execution; somatotopic homunculus" },
            { term: "Premotor cortex (PMC)", desc: "Lateral premotor strip, anterior to M1 — externally guided movement, motor planning, mirror system" },
            { term: "Supplementary motor area (SMA)", desc: "Medial premotor cortex — internally generated movement, sequencing, bimanual coordination" },
            { term: "Frontal eye fields (FEF)", desc: "Posterior middle frontal gyrus — voluntary saccades, attentional control" },
            { term: "Broca's area (dominant)", desc: "Pars opercularis and pars triangularis of IFG — expressive language, syntactic processing, articulatory planning" },
            { term: "Dorsolateral prefrontal cortex (DLPFC)", desc: "Middle frontal gyrus — executive function, working memory, cognitive control" },
            { term: "Ventromedial prefrontal cortex (vmPFC)", desc: "Medial inferior frontal cortex — value-based decision-making, emotional regulation, self-referential processing" },
            { term: "Orbitofrontal cortex (OFC)", desc: "Orbital surface — reward processing, social behavior, response inhibition" },
            { term: "Anterior cingulate cortex (ACC)", desc: "Medial frontal, dorsal to corpus callosum — conflict monitoring, error detection, motivational drive" },
            { term: "Frontopolar cortex", desc: "Anterior pole of frontal lobe — prospective memory, multitasking, abstract relational reasoning" },
          ],
        },
        { h: "Vascular supply" },
        {
          ul: [
            "Anterior cerebral artery (ACA): medial frontal cortex, including SMA, the medial strip of M1 (lower extremity representation), medial prefrontal regions, and the anterior cingulate",
            "Middle cerebral artery (MCA): lateral frontal cortex, including the lateral aspect of M1 (face and upper extremity), premotor cortex, Broca's area, and dorsolateral prefrontal cortex",
            "Anterior communicating artery (ACoA) territory: medial-basal frontal cortex; aneurysm rupture commonly produces a distinctive amnestic-confabulatory-disinhibition syndrome",
          ],
        },
        { h: "Key white matter tracts" },
        {
          ul: [
            "Superior longitudinal fasciculus (SLF) — connects frontal cortex to parietal and temporal regions; the arcuate fasciculus component links Broca's and Wernicke's areas",
            "Uncinate fasciculus — connects orbitofrontal and ventrolateral prefrontal cortex to anterior temporal lobe; implicated in semantic memory and social-emotional processing",
            "Cingulum bundle — runs within the cingulate gyrus; links prefrontal cortex to limbic and parahippocampal structures",
            "Frontal aslant tract — connects pre-SMA/SMA to inferior frontal gyrus; supports speech initiation and verbal fluency",
            "Corticospinal tract — descending motor output from M1 (and contributions from premotor cortex)",
            "Frontostriatal-thalamocortical loops — five parallel circuits (motor, oculomotor, dorsolateral prefrontal, lateral orbitofrontal, anterior cingulate) integrating prefrontal cortex with basal ganglia and thalamus",
          ],
        },
        { h: "Developmental note" },
        {
          p: "The frontal lobes, particularly the prefrontal cortex, are the last cortical regions to fully myelinate and reach structural maturity, with development continuing into the mid-twenties. This protracted maturation underlies the developmental trajectory of executive function and is clinically relevant in pediatric and adolescent assessment.",
        },
      ],
      functions: [
        { h: "Motor" },
        {
          ul: [
            "M1 executes voluntary movement, with somatotopic organization following the classic motor homunculus (medial-to-lateral: lower extremity → trunk → upper extremity → face)",
            "Premotor cortex supports externally cued movement, action observation, and reaching/grasping under sensory guidance",
            "SMA governs internally generated and sequenced movement, bimanual coordination, and preparation for self-initiated action",
            "Frontal eye fields generate voluntary saccades and contribute to top-down attentional shifts",
          ],
        },
        { h: "Executive function" },
        {
          p: "Executive functions are predominantly mediated by the dorsolateral prefrontal cortex and its connections, and encompass:",
        },
        {
          ul: [
            "Working memory — active manipulation of information, not merely passive maintenance",
            "Cognitive flexibility / set-shifting — switching between rules, response sets, or task demands",
            "Response inhibition — suppression of prepotent or automatic responses",
            "Planning and problem-solving — generating, sequencing, and executing goal-directed steps",
            "Abstract reasoning and concept formation",
            "Sustained and divided attention",
            "Verbal and design fluency — generative output under retrieval constraint",
            "Self-monitoring — evaluating performance against goals",
          ],
        },
        { h: "Language (dominant hemisphere)" },
        {
          ul: [
            "Broca's area supports expressive language, including syntactic construction and articulatory motor planning",
            "Frontal aslant tract and pre-SMA contribute to speech initiation and fluency",
            "Dominant frontal cortex also contributes to verbal fluency, lexical retrieval, and discourse organization",
          ],
        },
        { h: "Social-emotional and decision-making" },
        {
          p: "Mediated primarily by orbitofrontal, ventromedial prefrontal, and anterior cingulate cortices:",
        },
        {
          ul: [
            "Reward valuation and reinforcement learning — encoding subjective value of stimuli and outcomes",
            "Decision-making under uncertainty — integrating somatic-emotional signals (somatic marker hypothesis)",
            "Social cognition — theory of mind, perspective-taking, empathy",
            "Emotional regulation — top-down modulation of limbic activity",
            "Behavioral inhibition — suppression of socially inappropriate or impulsive responses",
          ],
        },
        { h: "Motivation and drive" },
        {
          p: "The anterior cingulate cortex and medial frontal cortex support:",
        },
        {
          ul: [
            "Behavioral initiation and drive",
            "Conflict monitoring and error detection",
            "Effort allocation and cost-benefit weighting",
            "Sustained motivation toward goals",
          ],
        },
        { h: "Lateralization" },
        {
          ul: [
            "Left (dominant) frontal lobe is preferentially engaged in verbal working memory, verbal fluency, language production, and approach-related affect",
            "Right (non-dominant) frontal lobe is preferentially engaged in design fluency, visuospatial working memory, sustained attention/vigilance, and avoidance/withdrawal-related affect; right frontal dysfunction is also more associated with anosognosia and certain disinhibition presentations",
          ],
        },
      ],
      clinical: [
        { h: "The three classical prefrontal syndromes" },
        { h: "Dorsolateral prefrontal syndrome (dysexecutive)" },
        {
          p: "The \"cognitive\" frontal syndrome. Features include impaired planning and problem-solving, working memory deficits, cognitive inflexibility with perseveration, reduced verbal and design fluency, impaired abstract reasoning, and stimulus-bound behavior. Personality is often relatively preserved compared to other frontal syndromes.",
        },
        { h: "Orbitofrontal syndrome (disinhibited)" },
        {
          p: "Characterized by behavioral disinhibition, impulsivity, socially inappropriate conduct, emotional lability, poor judgment, and reward-driven decision-making. Utilization behavior (automatic, environment-triggered use of objects) and acquired sociopathy can occur in severe cases. The Phineas Gage case remains the prototypical presentation. Basic cognitive abilities on structured testing may appear intact, masking the severity of real-world dysfunction.",
        },
        { h: "Medial frontal / anterior cingulate syndrome (apathetic)" },
        {
          p: "Marked by apathy and abulia — diminished spontaneous behavior, speech, and emotional expression. Severe bilateral medial frontal damage can produce akinetic mutism, in which the patient is awake but immobile and silent despite preserved arousal. Transcortical motor aphasia can occur with left medial frontal lesions affecting SMA or pre-SMA. Anterior cerebral artery infarcts are the prototypical etiology.",
        },
        { h: "Aphasia syndromes" },
        {
          ul: [
            "Broca's aphasia — non-fluent, effortful speech with agrammatism; relatively preserved auditory comprehension; impaired repetition; often accompanied by right hemiparesis (face and arm)",
            "Transcortical motor aphasia — non-fluent with preserved repetition; associated with SMA or watershed lesions sparing perisylvian language cortex",
            "Apraxia of speech / aphemia — impaired motor planning of speech with relatively preserved language",
          ],
        },
        { h: "Frontal release signs (primitive reflexes)" },
        {
          p: "Reemergence of developmentally early reflexes suggests bilateral frontal dysfunction and loss of cortical inhibition:",
        },
        {
          ul: [
            "Grasp reflex",
            "Palmomental reflex",
            "Snout reflex",
            "Rooting reflex",
            "Glabellar (Myerson's) sign",
          ],
        },
        { h: "Stroke syndromes" },
        {
          ul: [
            "Anterior cerebral artery infarct — contralateral lower extremity weakness greater than arm/face, abulia, urinary incontinence, transcortical motor aphasia (dominant hemisphere), grasp reflex",
            "Middle cerebral artery superior division infarct — contralateral face and upper extremity weakness, Broca's aphasia (dominant hemisphere), conjugate gaze deviation toward the lesion, contralateral neglect (non-dominant)",
            "Anterior communicating artery aneurysm rupture — basal forebrain and orbitomedial frontal damage producing amnesia, confabulation, and personality change",
          ],
        },
        { h: "Neurodegenerative localization" },
        {
          ul: [
            "Behavioral variant frontotemporal dementia (bvFTD) — predominant orbitofrontal, ventromedial prefrontal, and anterior cingulate atrophy; core features include behavioral disinhibition, apathy, loss of empathy, perseverative or compulsive behavior, hyperorality, and dysexecutive cognition",
            "Non-fluent / agrammatic variant primary progressive aphasia (nfvPPA) — left inferior frontal gyrus and insular atrophy; agrammatism and apraxia of speech",
            "Progressive supranuclear palsy (PSP) and corticobasal syndrome (CBS) — frontostriatal degeneration with executive dysfunction, behavioral change, and motor features (vertical gaze palsy in PSP; limb apraxia and alien limb in CBS)",
            "Alzheimer disease — though primarily temporoparietal, can show prefrontal involvement later in the disease, contributing to executive and behavioral changes",
          ],
        },
        { h: "Traumatic brain injury" },
        {
          p: "The orbitofrontal cortex and anterior temporal poles are predilection sites for contusion in closed-head injury due to the bony irregularities of the anterior and middle cranial fossae. Post-TBI executive dysfunction, disinhibition, apathy, and emotional dysregulation are common regardless of injury mechanism.",
        },
        { h: "Other frontal-localized presentations" },
        {
          ul: [
            "Pseudobulbar affect — pathological laughing or crying with bilateral corticobulbar involvement",
            "Witzelsucht — inappropriate facetious humor associated with orbitofrontal lesions, particularly right-sided",
            "Environmental dependency syndrome — utilization and imitation behavior with bilateral orbitofrontal/medial frontal damage",
            "Anosognosia for hemiplegia — denial of motor deficit, more common with right frontal involvement",
          ],
        },
      ],
      assessment: [
        { h: "Executive function measures" },
        {
          dl: [
            { term: "Set-shifting / cognitive flexibility", desc: "Wisconsin Card Sorting Test (WCST), Trail Making Test Part B, D-KEFS Trail Making (Number-Letter Switching), D-KEFS Color-Word Interference (Switching), D-KEFS Sorting" },
            { term: "Response inhibition", desc: "Stroop Color-Word, D-KEFS Color-Word Interference (Inhibition), Go/No-Go, Hayling Sentence Completion, Conners CPT-3" },
            { term: "Working memory", desc: "WAIS-5 / WAIS-IV Digit Span (Backward, Sequencing), Letter-Number Sequencing, WMS-IV Spatial Addition, n-back paradigms" },
            { term: "Planning / problem-solving", desc: "Tower of London, D-KEFS Tower Test, NAB Mazes, Porteus Mazes" },
            { term: "Verbal fluency", desc: "Controlled Oral Word Association Test (FAS), category fluency (animals, supermarket items), D-KEFS Verbal Fluency" },
            { term: "Design fluency", desc: "D-KEFS Design Fluency, Ruff Figural Fluency Test" },
            { term: "Abstract reasoning / concept formation", desc: "WAIS Similarities, WAIS Matrix Reasoning, D-KEFS Twenty Questions, D-KEFS Proverb" },
            { term: "Decision-making under uncertainty", desc: "Iowa Gambling Task (IGT)" },
            { term: "Composite executive batteries", desc: "Delis-Kaplan Executive Function System (D-KEFS), Frontal Assessment Battery (FAB), Behavioral Assessment of the Dysexecutive Syndrome (BADS), NEPSY-II (pediatric)" },
          ],
        },
        { h: "Behavioral rating scales" },
        {
          ul: [
            "BRIEF-2 and BRIEF-A / BRIEF-SR — Behavior Rating Inventory of Executive Function; parent, teacher, and self-report forms across ages",
            "FrSBe — Frontal Systems Behavior Scale; assesses apathy, disinhibition, and executive dysfunction with self and family-rated forms",
            "DEX — Dysexecutive Questionnaire (part of the BADS)",
            "NPI — Neuropsychiatric Inventory; commonly used in dementia evaluations to capture frontally mediated behavioral change",
            "CBI-R — Cambridge Behavioural Inventory-Revised; sensitive to bvFTD-related behavioral change",
          ],
        },
        { h: "Motor, praxis, and lateralizing measures" },
        {
          ul: [
            "Luria sequences — fist-edge-palm, alternating hand sequences",
            "Apraxia screens — limb-kinetic, ideomotor, ideational praxis examination",
            "Bimanual coordination tasks — sensitive to SMA dysfunction",
            "Finger Tapping Test and Grooved Pegboard — lateralizing motor speed and dexterity",
            "Reciprocal motor programs — Go/No-Go tapping paradigms",
          ],
        },
        { h: "Language measures (frontal-relevant)" },
        {
          ul: [
            "Boston Diagnostic Aphasia Examination (BDAE)",
            "Western Aphasia Battery-Revised (WAB-R)",
            "Boston Naming Test — confrontation naming with frontal contribution to retrieval",
            "Apraxia of Speech Rating Scale",
            "Connected speech sampling — evaluation of grammar, fluency, and discourse organization (e.g., Cookie Theft picture description)",
          ],
        },
        { h: "Bedside screening for frontal dysfunction" },
        {
          ul: [
            "Luria three-step (fist-edge-palm)",
            "Go/No-Go tapping (e.g., \"tap twice when I tap once; do not tap when I tap twice\")",
            "Frontal release signs examination",
            "Phonemic fluency at bedside (FAS or single-letter)",
            "Frontal Assessment Battery (FAB) — six-item bedside screen including similarities, fluency, motor sequencing, conflicting instructions, Go/No-Go, and prehension behavior",
            "Cookie Theft picture description for discourse, fluency, and agrammatism",
          ],
        },
      ],
    },
  },
  {
    id: "parietal-lobe",
    name: "Parietal Lobe",
    shortName: "Parietal",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, 0.85, -0.4],
    scale: [1.55, 1.0, 1.25],
    displacement: 0.16,
    segments: 6,
    color: "#7DD8E8",
    overview:
      "Occupies the superior posterior region of each hemisphere, bounded by the central sulcus anteriorly and the Sylvian fissure inferiorly. It houses the primary somatosensory cortex and the somatosensory association cortex, anchors the dorsal 'where/how' visual stream for visually guided action, and supports spatial attention, the body schema, praxis, number processing, and — in the dominant hemisphere — reading, writing, and calculation. As a result it is central to neglect, the apraxias, Gerstmann and Bálint syndromes, and the cortical sensory deficits.",
    functions: [
      "Primary somatosensation (postcentral gyrus)",
      "Spatial attention and visuospatial mapping",
      "Numerical processing and arithmetic",
      "Body schema and self-localization",
      "Cross-modal sensory integration",
    ],
    neuropsych: [
      "Right parietal damage produces hemispatial neglect — patients fail to attend to the left half of space and may deny the deficit (anosognosia)",
      "Left parietal damage may yield Gerstmann syndrome (agraphia, acalculia, finger agnosia, left-right disorientation)",
      "Constructional apraxia is assessed with clock-drawing and Rey-Osterrieth figure copying",
      "Posterior parietal cortex underlies visuospatial working memory",
    ],
    conditions: [
      "Hemispatial neglect after right MCA stroke",
      "Balint syndrome (bilateral parietal damage)",
      "Posterior cortical atrophy (Alzheimer's variant)",
      "Apraxia syndromes",
    ],
    topicHints: ["Apraxia & Agnosia", "Visuospatial Processing"],
    detail: {
      anatomy: [
        { h: "Boundaries" },
        {
          p: "The parietal lobe occupies the superior posterior region of each cerebral hemisphere. Its anterior border is the central sulcus, separating it from the frontal lobe; the lateral (Sylvian) fissure forms the inferior border, separating it from the temporal lobe. Posteriorly, the parieto-occipital sulcus marks the boundary with the occipital lobe on the medial surface, while on the lateral surface an arbitrary line from the preoccipital notch to the parieto-occipital sulcus serves as the conventional boundary.",
        },
        { h: "Major gyri and sulci" },
        {
          p: "The lateral surface is organized around two key sulci — the postcentral sulcus and the intraparietal sulcus (IPS) — which divide the lobe into three principal regions:",
        },
        {
          ul: [
            "Postcentral gyrus — between the central and postcentral sulci; contains primary somatosensory cortex",
            "Superior parietal lobule (SPL) — above the intraparietal sulcus; somatosensory association and dorsal-stream visuospatial processing",
            "Inferior parietal lobule (IPL) — below the intraparietal sulcus; subdivided into the supramarginal gyrus (wrapping the posterior end of the lateral fissure) and the angular gyrus (wrapping the posterior end of the superior temporal sulcus)",
          ],
        },
        {
          p: "The medial surface contains the precuneus, bounded anteriorly by the marginal branch of the cingulate sulcus and posteriorly by the parieto-occipital sulcus. The medial extension of the postcentral gyrus forms the posterior portion of the paracentral lobule, containing the somatosensory representation of the lower extremity.",
        },
        { h: "Functional subdivisions" },
        {
          dl: [
            { term: "Primary somatosensory cortex (S1)", desc: "Postcentral gyrus — tactile, proprioceptive, and pain/temperature processing; somatotopic homunculus" },
            { term: "Somatosensory association cortex", desc: "Superior parietal lobule — higher-order tactile processing, stereognosis, body schema" },
            { term: "Posterior parietal cortex (dorsal stream)", desc: "SPL and IPS — visuospatial attention, visually guided action, \"where/how\" processing" },
            { term: "Supramarginal gyrus (dominant)", desc: "Anterior IPL — phonological processing, ideomotor praxis, articulatory rehearsal" },
            { term: "Angular gyrus (dominant)", desc: "Posterior IPL — reading, writing, calculation, semantic integration" },
            { term: "Inferior parietal lobule (non-dominant)", desc: "Right IPL, especially temporoparietal junction — spatial attention, body awareness, social cognition" },
            { term: "Intraparietal sulcus (IPS)", desc: "Sulcus dividing SPL from IPL — number processing, saccadic eye movements, attention shifting" },
            { term: "Precuneus", desc: "Medial parietal — default mode network, self-referential processing, episodic memory retrieval, visuospatial imagery" },
            { term: "Temporoparietal junction (TPJ)", desc: "Posterior STG / IPL border — theory of mind, agency, reorienting attention" },
          ],
        },
        { h: "Vascular supply" },
        {
          ul: [
            "Middle cerebral artery (MCA) — lateral parietal cortex including the lateral postcentral gyrus (face/upper-extremity sensory), supramarginal and angular gyri; superior division supplies superior parietal regions, inferior division the inferior parietal cortex",
            "Anterior cerebral artery (ACA) — medial parietal cortex including the precuneus and the medial postcentral gyrus (lower-extremity sensory)",
            "Posterior cerebral artery (PCA) — small contribution to posterior medial parietal cortex; parieto-occipital junction territory",
            "MCA-PCA watershed — posterior parietal cortex sits at this watershed and is vulnerable in hypoperfusion, producing Bálint's syndrome features and (with dominant involvement) transcortical sensory aphasia",
          ],
        },
        { h: "Key white matter tracts" },
        {
          ul: [
            "Superior longitudinal fasciculus (SLF) — connects parietal to frontal cortex; dorsal subdivisions support visuospatial attention, ventral subdivisions phonological/articulatory processing",
            "Arcuate fasciculus — passes through parietal white matter linking Wernicke's and Broca's areas; damage produces conduction aphasia",
            "Inferior fronto-occipital fasciculus (IFOF) — long association tract passing through parietal white matter",
            "Internal capsule (posterior limb) — carries somatosensory thalamocortical projections from VPL/VPM thalamus to S1",
            "Cingulum — runs through medial parietal white matter connecting precuneus and posterior cingulate to frontal and temporal regions",
            "Optic radiations (parietal portion / Baum's loop) — superior optic radiations carrying inferior visual field information; lesions produce contralateral inferior quadrantanopia",
          ],
        },
        { h: "Developmental note" },
        {
          p: "Parietal cortex undergoes prolonged development, with the inferior parietal lobule among the last cortical regions to reach full structural maturity. The protracted development of parietal-frontal connectivity supports the maturation of visuospatial attention, working memory, and mathematical cognition across childhood and adolescence. Pediatric parietal dysfunction can manifest as developmental coordination disorder, dyscalculia, or nonverbal learning profiles.",
        },
      ],
      functions: [
        { h: "Somatosensory processing" },
        {
          ul: [
            "Primary somatosensory cortex (S1) processes tactile, proprioceptive, vibratory, and pain/temperature information from the contralateral body, with somatotopic organization (sensory homunculus)",
            "Somatosensory association cortex in the SPL integrates basic sensory features for higher-order percepts: stereognosis (tactile object recognition), graphesthesia (tactile letter/number identification), and two-point discrimination",
          ],
        },
        { h: "Body schema and proprioception" },
        {
          p: "The parietal lobe, particularly the right inferior parietal cortex, maintains the internal representation of the body in space — the body schema. This includes awareness of limb position, ownership of body parts, and the spatial relationship of the body to the environment.",
        },
        { h: "Visuospatial attention" },
        {
          ul: [
            "Right parietal cortex is preferentially engaged in spatial attention across both hemifields, which is why right parietal lesions produce dense contralateral neglect while left parietal lesions typically do not produce comparable right-sided neglect",
            "The dorsal attention network (intraparietal sulcus, superior parietal lobule, frontal eye fields) supports top-down, goal-directed attention",
            "The ventral attention network (temporoparietal junction, ventral frontal cortex; right-lateralized) supports stimulus-driven reorienting",
          ],
        },
        { h: "Dorsal visual stream" },
        {
          p: "The dorsal \"where/how\" stream projects from primary visual cortex through posterior parietal cortex and supports visually guided reaching and grasping, spatial localization of objects, and visuomotor transformation (translating vision into action). Optic ataxia results from disruption of this pathway.",
        },
        { h: "Praxis" },
        {
          ul: [
            "Left inferior parietal cortex (particularly supramarginal gyrus) stores motor programs (\"praxicons\") for skilled, learned movements",
            "Damage produces ideomotor apraxia — impaired execution of learned gestures despite intact motor and sensory function",
            "The praxis system follows a left-hemisphere dominant organization in most right-handed individuals, regardless of which hand performs the action",
          ],
        },
        { h: "Language and academic functions (dominant hemisphere)" },
        {
          ul: [
            "Supramarginal gyrus supports phonological processing and the phonological-loop component of working memory",
            "Angular gyrus supports reading (visual-to-phonological mapping), writing, calculation, and semantic integration",
            "The dominant parietal lobe is critical for the cross-modal integration required for literacy and numeracy",
          ],
        },
        { h: "Number processing" },
        {
          p: "The intraparietal sulcus bilaterally houses representations of numerical magnitude (the \"number sense\") and supports both symbolic and non-symbolic numerical comparison. Calculation engages a broader parietal network including the angular gyrus for verbal arithmetic facts and the intraparietal sulcus for quantity manipulation.",
        },
        { h: "Self-referential and default mode processing" },
        {
          p: "The precuneus is a hub of the default mode network and supports self-referential processing, episodic memory retrieval, visuospatial imagery, and conscious self-awareness. It is among the most metabolically active regions of the resting brain.",
        },
        { h: "Lateralization" },
        {
          ul: [
            "Left (dominant) parietal lobe — language-related parietal functions (reading, writing, calculation), praxis, phonological working memory, finger gnosis, right-left orientation",
            "Right (non-dominant) parietal lobe — spatial attention, body schema, constructional ability, prosodic comprehension, face-processing contributions, mental rotation, awareness of deficits",
          ],
        },
      ],
      clinical: [
        { h: "Right (non-dominant) parietal syndromes" },
        { h: "Hemispatial neglect (left neglect)" },
        {
          p: "Failure to attend, respond to, or report stimuli on the contralateral (left) side of space, not attributable to primary sensory or motor deficit. Most severe and persistent with right inferior parietal or temporoparietal junction lesions. Manifestations include:",
        },
        {
          ul: [
            "Visual neglect on cancellation, line bisection, and drawing tasks (omission of left-sided detail)",
            "Personal neglect (failure to groom or dress the left body)",
            "Representational neglect (failure to describe left-sided detail of imagined scenes)",
            "Extinction to double simultaneous stimulation",
            "Reading neglect (dyslexia for left side of text or word)",
          ],
        },
        { h: "Anosognosia for hemiplegia (Babinski's syndrome)" },
        {
          p: "Denial or unawareness of motor (and sometimes sensory) deficit following right hemisphere damage, classically right parietal and insular regions. Patients may insist they can move a paralyzed limb or rationalize the deficit. Often co-occurs with neglect but is dissociable.",
        },
        { h: "Asomatognosia and somatoparaphrenia" },
        {
          ul: [
            "Asomatognosia — loss of awareness or recognition of one half of the body",
            "Somatoparaphrenia — delusional misidentification of the affected limb (denial of ownership, attribution to another person)",
          ],
        },
        { h: "Constructional apraxia" },
        {
          p: "Impaired ability to draw, copy, or assemble two- and three-dimensional designs. Right parietal lesions classically produce disorganized, fragmented constructions with loss of spatial relationships; left parietal lesions produce simplified constructions with preserved spatial layout.",
        },
        { h: "Dressing apraxia" },
        {
          p: "Difficulty orienting clothing to the body, typically associated with right parietal damage; reflects body schema and visuospatial dysfunction rather than true apraxia.",
        },
        { h: "Topographic disorientation (egocentric type)" },
        {
          p: "Right posterior parietal lesions can disrupt the egocentric (self-centered) spatial reference frame, producing disorientation in familiar environments distinct from landmark agnosia or hippocampal-based disorientation.",
        },
        { h: "Misoplegia and pusher syndrome" },
        {
          ul: [
            "Misoplegia — hatred toward, or hostility directed at, the paralyzed limb",
            "Pusher syndrome (contraversive pushing) — active pushing toward the hemiparetic side with resistance to passive correction; associated with right posterior parietal lesions",
          ],
        },
        { h: "Left (dominant) parietal syndromes" },
        { h: "Gerstmann syndrome" },
        {
          p: "A tetrad classically attributed to left angular gyrus damage: (1) acalculia (specifically anarithmetria), (2) agraphia (writing impairment, not purely motor), (3) finger agnosia (inability to identify, name, or differentiate fingers), and (4) right-left disorientation. Pure Gerstmann syndrome is rare; partial presentations and association with other left parietal features (aphasia, alexia) are more common.",
        },
        { h: "Ideomotor apraxia" },
        {
          p: "Impaired performance of learned skilled movements to verbal command or imitation, despite preserved comprehension, motor function, and object recognition. Includes spatial, temporal, and content errors in pantomimed actions. Most prominent with left parietal lesions, often involving the supramarginal gyrus.",
        },
        { h: "Conduction aphasia" },
        {
          p: "Fluent speech with relatively preserved comprehension but disproportionate impairment of repetition and frequent phonemic paraphasias. Lesion: supramarginal gyrus or underlying arcuate fasciculus.",
        },
        { h: "Alexia with agraphia" },
        {
          p: "Acquired impairment of both reading and writing with relatively preserved oral language. Classic lesion: left angular gyrus, distinguishing it from pure alexia (alexia without agraphia) of the occipitotemporal region.",
        },
        { h: "Ideational apraxia" },
        {
          p: "Impairment in sequencing multi-step actions and using objects appropriately, often associated with bilateral or diffuse parietal damage.",
        },
        { h: "Bilateral parietal syndromes" },
        { h: "Bálint's syndrome" },
        {
          p: "Triad following bilateral posterior parietal damage (typically MCA-PCA watershed territory):",
        },
        {
          ul: [
            "Simultanagnosia — inability to perceive more than one object or aspect of a scene at a time",
            "Optic ataxia — impaired visually guided reaching despite preserved visual perception and motor function",
            "Oculomotor apraxia (psychic gaze paralysis) — inability to voluntarily redirect gaze to a new visual target",
          ],
        },
        { h: "Posterior cortical atrophy (Benson syndrome)" },
        {
          p: "Neurodegenerative syndrome with predominant posterior (parietal, occipital, posterior temporal) atrophy, most commonly underlying Alzheimer disease pathology. Features include visuospatial dysfunction, Bálint's and Gerstmann syndrome features, environmental disorientation, alexia, and apperceptive visual agnosia, with relatively preserved memory and behavior early in the course.",
        },
        { h: "Cortical sensory syndromes" },
        {
          p: "With preserved primary sensation, parietal damage produces deficits in higher-order somatosensory processing:",
        },
        {
          ul: [
            "Astereognosis (tactile agnosia) — inability to identify objects by touch",
            "Agraphesthesia — inability to identify numbers or letters traced on the skin",
            "Impaired two-point discrimination",
            "Impaired tactile localization",
            "Extinction to double simultaneous stimulation — failure to perceive the contralesional stimulus when both sides are stimulated, even with intact single-stimulus detection",
          ],
        },
        { h: "Visual field defects" },
        {
          p: "Contralateral inferior quadrantanopia (\"pie on the floor\") — damage to the superior optic radiations (Baum's loop) passing through deep parietal white matter.",
        },
        { h: "Stroke syndromes" },
        {
          ul: [
            "MCA superior division (parietal extension) — contralateral cortical sensory loss in face and arm, contralateral hemiparesis (with frontal extension), aphasic features if dominant, neglect if non-dominant",
            "MCA inferior division (dominant) — Wernicke's aphasia with parietal extension producing alexia with agraphia and conduction aphasia features",
            "MCA inferior division (non-dominant) — dense left neglect, anosognosia, constructional and dressing apraxia",
            "ACA infarct (medial parietal extension) — contralateral lower-extremity sensory loss",
            "Watershed infarct (MCA-PCA) — Bálint's syndrome, transcortical sensory aphasia (dominant hemisphere)",
          ],
        },
        { h: "Neurodegenerative localization" },
        {
          ul: [
            "Alzheimer disease — parietotemporal hypometabolism and atrophy in the typical amnestic presentation; predominant parietal involvement underlies emerging visuospatial and praxis deficits",
            "Posterior cortical atrophy (Benson syndrome) — posterior cortical phenotype of AD (most commonly) with predominant parietal and occipital atrophy",
            "Logopenic variant PPA — left posterior temporoparietal atrophy producing word-retrieval deficits, sentence-repetition impairment, and phonological errors; AD pathology in most cases",
            "Corticobasal syndrome (CBS) — asymmetric parietal and frontal atrophy producing limb apraxia, cortical sensory loss, alien limb phenomenon, and asymmetric parkinsonism; multiple underlying pathologies (CBD, AD, PSP)",
            "Creutzfeldt-Jakob disease (Heidenhain variant) — predominant occipitoparietal involvement with cortical visual disturbance and rapidly progressive dementia",
          ],
        },
        { h: "Traumatic brain injury" },
        {
          p: "The parietal lobes are less commonly a predilection site for contusion than the frontal and temporal lobes, but diffuse axonal injury can disrupt parietal white matter tracts (particularly the SLF and IFOF), contributing to the attention, working memory, and processing-speed deficits common after moderate-to-severe TBI.",
        },
      ],
      assessment: [
        { h: "Cortical sensory testing" },
        {
          p: "Bedside examination with eyes closed:",
        },
        {
          ul: [
            "Stereognosis — identification of objects placed in the hand (coin, key, paperclip)",
            "Graphesthesia — identification of numbers or letters traced on the palm",
            "Two-point discrimination — minimum separation perceived as two stimuli",
            "Tactile localization — pointing to where one was touched",
            "Double simultaneous stimulation — testing for tactile extinction",
            "Joint position sense (proprioception) and vibratory sense — primarily peripheral, but also engage parietal processing",
          ],
        },
        { h: "Visuospatial and constructional measures" },
        {
          dl: [
            { term: "Judgment of Line Orientation (JLO)", desc: "Matching line angles to a standard array; right parietal sensitive" },
            { term: "Hooper Visual Organization Test", desc: "Mental reassembly of fragmented object pictures" },
            { term: "Visual Object and Space Perception Battery (VOSP)", desc: "Separate object perception and space perception subtests" },
            { term: "Rey-Osterrieth Complex Figure (copy)", desc: "Constructional ability, organizational strategy" },
            { term: "WAIS Block Design", desc: "Visuospatial construction and analysis" },
            { term: "WAIS Visual Puzzles", desc: "Mental rotation and visuospatial reasoning" },
            { term: "WAIS Matrix Reasoning", desc: "Non-verbal abstract reasoning with a visuospatial component" },
            { term: "Clock Drawing Test", desc: "Construction, planning, neglect; multiple scoring systems" },
            { term: "Bender Gestalt-II", desc: "Visuomotor integration" },
            { term: "Beery VMI", desc: "Visual-motor integration, including pediatric forms" },
          ],
        },
        { h: "Neglect screening" },
        {
          dl: [
            { term: "Line Bisection", desc: "Marking the midpoint of horizontal lines" },
            { term: "Albert's Test", desc: "Cancellation of randomly distributed lines" },
            { term: "Star Cancellation", desc: "Identification of small targets among distractors" },
            { term: "Letter or Bell Cancellation", desc: "Visual search tasks for neglect detection" },
            { term: "Behavioral Inattention Test (BIT)", desc: "Conventional and behavioral subtests of neglect" },
            { term: "Catherine Bergego Scale", desc: "Observational assessment of neglect in everyday activities" },
            { term: "Drawing tasks (clock, daisy, scene copy)", desc: "Spontaneous drawing for left-sided omissions" },
            { term: "Reading and writing samples", desc: "Detection of left-sided neglect dyslexia and dysgraphia" },
          ],
        },
        { h: "Praxis testing" },
        {
          ul: [
            "Ideomotor praxis — pantomime of tool use, gesture imitation, transitive and intransitive movements",
            "Ideational praxis — multi-step sequenced tasks (e.g., letter-in-envelope)",
            "Buccofacial praxis — facial gestures and oral movements",
            "Limb-kinetic praxis — fine motor dexterity (finger tapping, Grooved Pegboard)",
            "Florida Apraxia Battery — standardized praxis assessment",
            "Western Aphasia Battery Apraxia subtest — screening within aphasia evaluation",
          ],
        },
        { h: "Number processing and calculation" },
        {
          ul: [
            "WAIS-5 / WAIS-IV Arithmetic — verbally administered mental arithmetic",
            "WIAT-4 Math subtests — Numerical Operations, Math Problem Solving",
            "Woodcock-Johnson IV Math subtests — Calculation, Math Facts Fluency, Applied Problems",
            "Wide Range Achievement Test-5 (WRAT-5) Math Computation",
            "NEPSY-II Math subtests (pediatric)",
            "Number comparison and approximate magnitude tasks — for dyscalculia assessment",
            "Written calculation — bedside assessment of acalculia",
          ],
        },
        { h: "Reading and writing" },
        {
          ul: [
            "WIAT-4 Reading and Writing subtests — Word Reading, Pseudoword Decoding, Reading Comprehension, Spelling, Sentence Composition",
            "Woodcock-Johnson IV Achievement — Letter-Word Identification, Passage Comprehension, Spelling",
            "Gray Oral Reading Tests-5 (GORT-5) — oral reading fluency and comprehension",
            "Test of Written Language (TOWL-4)",
            "Spontaneous writing samples — for spatial dysgraphia and neglect dysgraphia",
            "Oral reading — for assessment of acquired alexias",
          ],
        },
        { h: "Gerstmann screen and related measures" },
        {
          ul: [
            "Finger naming and finger localization — examiner touches or indicates fingers for naming",
            "Right-left orientation — on self, on examiner, and with crossed commands (e.g., \"touch your left ear with your right hand\")",
            "Calculation — written and mental arithmetic",
            "Writing to dictation and spontaneous writing",
            "These four tasks can be administered together as a brief Gerstmann screen",
          ],
        },
        { h: "Body schema and self-awareness" },
        {
          ul: [
            "Anosognosia rating scales (e.g., Bisiach scale, Anosognosia Questionnaire)",
            "Self vs. other localization tasks — pointing to body parts on self and examiner",
            "Personal neglect assessments — comb-and-razor test, fluff test",
          ],
        },
        { h: "Social cognition (TPJ-relevant)" },
        {
          ul: [
            "Reading the Mind in the Eyes Test — engages temporoparietal regions",
            "False belief tasks (e.g., Strange Stories, faux pas recognition) — theory of mind",
          ],
        },
        { h: "Bedside screening for parietal dysfunction" },
        {
          ul: [
            "Cortical sensory examination (stereognosis, graphesthesia, two-point discrimination, double simultaneous stimulation)",
            "Drawing tasks (clock, daisy, three-dimensional cube, intersecting pentagons)",
            "Line bisection and simple cancellation",
            "Mental arithmetic (serial subtraction, single calculations)",
            "Praxis screen — pantomime to command (e.g., \"show me how you would brush your teeth\")",
            "Finger gnosis and right-left orientation",
            "Reading aloud and spontaneous writing sample",
            "Spatial scanning during conversation and history-taking — observation for spontaneous neglect of one side",
          ],
        },
      ],
    },
  },
  {
    id: "temporal-lobe",
    name: "Temporal Lobe",
    shortName: "Temporal",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [1.3, 0.0, 0.15],
    scale: [0.9, 0.85, 1.4],
    rotation: [0, 0, -0.15],
    displacement: 0.15,
    segments: 6,
    color: "#3FB6D9",
    overview:
      "Lateral lobes situated below the Sylvian fissure, occupying the inferolateral aspect of each hemisphere from the temporal pole back to the occipital boundary. They house the primary auditory cortex and (on the dominant side) Wernicke's area for language comprehension, the ventral 'what' visual stream for object, face, and word recognition, and — on their medial surfaces — the hippocampus, entorhinal/perirhinal cortex, and amygdala that form the core of the declarative memory and emotional-salience systems. As a result the temporal lobe is central to aphasia, amnesia, the agnosias, and temporal-lobe epilepsy.",
    functions: [
      "Primary auditory cortex (Heschl's gyrus)",
      "Receptive language (Wernicke's area, dominant side)",
      "Visual object and face recognition (inferior/fusiform)",
      "Verbal and non-verbal memory consolidation",
      "Emotional and social-cue processing",
    ],
    neuropsych: [
      "Left temporal lesions impair verbal memory (Logical Memory, RAVLT); right temporal lesions impair visual/figural memory",
      "Wernicke's aphasia presents as fluent but meaningless speech with poor comprehension",
      "Semantic dementia degrades knowledge of word meanings and object identities",
      "Mesial temporal sclerosis is the most common cause of refractory temporal-lobe epilepsy",
    ],
    conditions: [
      "Temporal-lobe epilepsy",
      "Semantic dementia",
      "Herpes simplex encephalitis (preferentially attacks medial temporal)",
      "Prosopagnosia (right fusiform damage)",
    ],
    topicHints: ["Language Processing & Aphasia", "Memory Systems"],
    detail: {
      anatomy: [
        { h: "Boundaries" },
        {
          p: "The temporal lobe occupies the inferolateral aspect of each cerebral hemisphere. Its superior border is the lateral (Sylvian) fissure, which separates it from the frontal and parietal lobes. Posteriorly it transitions into the occipital lobe along a less distinct boundary — on the lateral surface the convention is the temporo-occipital line (from the preoccipital notch to the parieto-occipital sulcus), and on the medial surface the boundary follows the collateral sulcus and the isthmus of the cingulate gyrus. The anterior temporal pole is the rostral tip.",
        },
        { h: "Major gyri and sulci" },
        {
          p: "The lateral surface is organized by the superior and inferior temporal sulci into three parallel gyri running anteroposteriorly:",
        },
        {
          ul: [
            "Superior temporal gyrus (STG) — above the superior temporal sulcus; contains auditory cortex and, in the dominant hemisphere, Wernicke's area",
            "Middle temporal gyrus (MTG) — between the superior and inferior temporal sulci; language semantics, multimodal integration, and biological-motion perception",
            "Inferior temporal gyrus (ITG) — below the inferior temporal sulcus; ventral visual stream and object recognition",
          ],
        },
        {
          p: "The superior temporal plane (upper surface of the STG, hidden within the Sylvian fissure) contains Heschl's gyrus (transverse temporal gyrus / primary auditory cortex), the planum temporale (auditory association cortex posterior to Heschl's, typically larger on the left and a critical substrate of Wernicke's area), and the planum polare anteriorly.",
        },
        {
          p: "The inferior (basal) surface contains, from lateral to medial: the inferior temporal gyrus (wrapping from the lateral surface), the fusiform (occipitotemporal) gyrus (ventral-stream face and word recognition), the parahippocampal gyrus (containing entorhinal and perirhinal cortices anteriorly), and the uncus — the medially curled anterior end of the parahippocampal gyrus, overlying the amygdala.",
        },
        { h: "Functional subdivisions" },
        {
          dl: [
            { term: "Primary auditory cortex (A1)", desc: "Heschl's gyrus — tonotopic processing of sound" },
            { term: "Auditory association cortex", desc: "Superior temporal plane and STG surrounding Heschl's — pitch, timbre, complex sound and music processing" },
            { term: "Wernicke's area (dominant)", desc: "Posterior STG extending onto the planum temporale — auditory-verbal comprehension, phonological processing" },
            { term: "Anterior temporal lobe (ATL)", desc: "Temporal pole and anterior MTG/ITG — semantic memory hub; person and concept knowledge" },
            { term: "Fusiform face area (FFA)", desc: "Mid-fusiform gyrus, typically right-lateralized — face recognition, expert visual category processing" },
            { term: "Visual word form area (VWFA)", desc: "Left mid-fusiform / occipitotemporal cortex — orthographic word recognition" },
            { term: "Parahippocampal place area (PPA)", desc: "Parahippocampal gyrus — scene and place recognition, spatial context" },
            { term: "Hippocampus", desc: "Medial temporal lobe, within the temporal horn of the lateral ventricle — episodic and relational memory encoding and retrieval" },
            { term: "Entorhinal cortex", desc: "Anterior parahippocampal gyrus — gateway to the hippocampus; convergent neocortical input" },
            { term: "Perirhinal cortex", desc: "Lateral to entorhinal along the rhinal sulcus — object/item familiarity and recognition memory" },
            { term: "Amygdala", desc: "Anterior medial temporal lobe, deep to the uncus — emotional processing, fear learning, salience" },
            { term: "Superior temporal sulcus (STS)", desc: "Sulcus between STG and MTG — biological motion, gaze and face dynamics, social perception" },
          ],
        },
        { h: "Vascular supply" },
        {
          ul: [
            "Middle cerebral artery (MCA), inferior division — lateral temporal cortex including STG (Wernicke's area), MTG, and lateral ITG",
            "Posterior cerebral artery (PCA) — medial and inferior temporal lobe, including hippocampus, parahippocampal gyrus, fusiform gyrus, and uncus; anterior temporal branches also supply the temporal pole",
            "Anterior choroidal artery — uncus, anterior hippocampus, and amygdala; small infarcts can produce memory and emotional changes",
          ],
        },
        { h: "Key white matter tracts" },
        {
          ul: [
            "Inferior longitudinal fasciculus (ILF) — connects occipital cortex to anterior temporal lobe; visual object recognition and visual-semantic integration",
            "Uncinate fasciculus — hooks from anterior temporal lobe to orbitofrontal and ventrolateral prefrontal cortex; semantic memory, social-emotional processing",
            "Arcuate fasciculus / superior longitudinal fasciculus — connects posterior temporal cortex (Wernicke's) with inferior frontal cortex (Broca's); damage produces conduction aphasia",
            "Inferior fronto-occipital fasciculus (IFOF) — long association tract from occipital/posterior temporal cortex to inferior frontal cortex; semantic processing",
            "Fornix — major hippocampal output to mammillary bodies, anterior thalamus, and septal nuclei (Papez circuit); lesions produce amnesia",
            "Cingulum — runs above the corpus callosum and curves into the parahippocampal gyrus; links medial temporal memory structures to cingulate and frontal cortex",
          ],
        },
        { h: "Developmental note" },
        {
          p: "The medial temporal lobe undergoes rapid early development, supporting the emergence of explicit memory across the second year of life. The hippocampus shows continued structural maturation into adolescence, and the protracted development of MTL-prefrontal connectivity is relevant to the maturation of strategic memory and source monitoring across childhood and adolescence.",
        },
      ],
      functions: [
        { h: "Auditory processing" },
        {
          ul: [
            "Primary auditory cortex (A1) is tonotopically organized; processes basic acoustic features (frequency, intensity, temporal structure)",
            "Auditory association cortex supports recognition of complex sounds, music, environmental sounds, and prosody",
            "Right STG shows relative specialization for music, pitch, and prosody",
            "Left STG shows relative specialization for speech-sound (phonological) processing",
          ],
        },
        { h: "Language comprehension (dominant hemisphere)" },
        {
          ul: [
            "Wernicke's area supports auditory-verbal comprehension and phonological-to-lexical mapping",
            "MTG and ITG contribute to lexical-semantic retrieval and word meaning",
            "Anterior temporal lobe functions as a semantic memory hub, integrating multimodal conceptual knowledge",
          ],
        },
        { h: "Memory" },
        {
          p: "The medial temporal lobe (MTL) memory system supports declarative (explicit) memory:",
        },
        {
          ul: [
            "Hippocampus — encoding and retrieval of episodic memories; binding of multimodal features into coherent representations; spatial/relational memory",
            "Entorhinal cortex — major bidirectional gateway between hippocampus and neocortex",
            "Perirhinal cortex — item-level familiarity and recognition; visual object memory",
            "Parahippocampal cortex — scene and contextual memory",
          ],
        },
        {
          p: "The MTL system is selectively involved in declarative memory; procedural, motor, and emotional learning depend on other systems (basal ganglia, cerebellum, amygdala).",
        },
        { h: "Visual recognition (ventral stream)" },
        {
          p: "The ventral occipitotemporal cortex constitutes the \"what\" pathway:",
        },
        {
          ul: [
            "Object recognition in lateral occipital and inferior temporal cortex",
            "Face recognition in the fusiform face area",
            "Place and scene recognition in the parahippocampal place area",
            "Word recognition in the left occipitotemporal visual word form area",
          ],
        },
        { h: "Social and emotional" },
        {
          ul: [
            "Amygdala — fear conditioning, emotional salience detection, modulation of memory for emotional events, processing of facial expressions of emotion",
            "Superior temporal sulcus — biological motion, gaze direction, facial movement, theory of mind",
            "Anterior temporal lobe — person-specific semantic knowledge, social concept representation",
          ],
        },
        { h: "Lateralization" },
        {
          ul: [
            "Left (dominant) temporal lobe is preferentially engaged in language comprehension, verbal memory, and verbal semantic processing",
            "Right (non-dominant) temporal lobe is preferentially engaged in visuospatial memory, face recognition, music processing, and prosody",
          ],
        },
      ],
      clinical: [
        { h: "Aphasia syndromes (dominant hemisphere)" },
        { h: "Wernicke's aphasia" },
        {
          p: "Fluent, well-articulated speech that is empty of content, with frequent paraphasic errors (phonemic and semantic) and neologisms. Auditory comprehension, repetition, and naming are all impaired, and patients often lack awareness of their deficits. Lesion: posterior STG and adjacent supramarginal gyrus (MCA inferior-division territory).",
        },
        { h: "Transcortical sensory aphasia" },
        {
          p: "Fluent with impaired comprehension but preserved repetition; patients may echo what is said without understanding it. Lesion: temporoparietal watershed, sparing perisylvian cortex.",
        },
        { h: "Conduction aphasia" },
        {
          p: "Fluent speech with relatively preserved comprehension but disproportionate impairment of repetition, particularly for unfamiliar phrases, with prominent phonemic paraphasias. Lesion: arcuate fasciculus or supramarginal gyrus.",
        },
        { h: "Pure word deafness" },
        {
          p: "Selective impairment of auditory-verbal comprehension with preserved reading, writing, and recognition of nonverbal sounds. Lesion: bilateral STG, or a unilateral dominant subcortical lesion disconnecting A1 from Wernicke's area.",
        },
        { h: "Semantic variant PPA (semantic dementia)" },
        {
          p: "Progressive loss of semantic knowledge with anomia, impaired single-word comprehension, and surface dyslexia; speech is fluent but empty. Lesion: bilateral anterior temporal atrophy, typically left-predominant.",
        },
        { h: "Memory disorders" },
        { h: "Bilateral medial temporal lobe amnesia" },
        {
          p: "The prototype is the case of H.M. (Henry Molaison), who developed dense anterograde amnesia after bilateral MTL resection. Hallmarks: severe anterograde amnesia for declarative material; variable retrograde amnesia with a temporal gradient (Ribot's law); preserved working memory and procedural learning; and preserved semantic knowledge acquired before injury.",
        },
        { h: "Material-specific memory deficits" },
        {
          ul: [
            "Left MTL — verbal memory deficits (word lists, story recall)",
            "Right MTL — visuospatial memory deficits (figure recall, spatial layouts, face recognition)",
          ],
        },
        { h: "Transient global amnesia (TGA)" },
        {
          p: "Sudden-onset, time-limited (typically < 24 hours) anterograde amnesia with repetitive questioning and preserved personal identity and remote memory. Hippocampal/MTL involvement is implicated; the course is benign.",
        },
        { h: "Diencephalic amnesia (e.g., Korsakoff syndrome)" },
        {
          p: "Although not temporal in origin, mammillary body and anterior thalamic damage produces amnesia clinically similar to MTL amnesia and is part of the broader Papez circuit.",
        },
        { h: "Temporal lobe epilepsy (TLE)" },
        {
          p: "The most common focal epilepsy in adults. Key features:",
        },
        {
          ul: [
            "Mesial temporal sclerosis is the most common pathology — hippocampal atrophy and gliosis",
            "Auras include rising epigastric sensation, déjà vu, jamais vu, fear, olfactory or gustatory hallucinations, and complex visual or auditory experiences",
            "Complex partial seizures with impaired awareness, oroalimentary or manual automatisms, and post-ictal confusion",
            "Interictal memory dysfunction is common, lateralized by side of seizure focus",
            "Geschwind syndrome — described interictal personality features (hyperreligiosity, hypergraphia, hyposexuality, viscosity); controversial as a syndrome",
          ],
        },
        { h: "Visual recognition disorders" },
        {
          ul: [
            "Prosopagnosia — impaired face recognition with preserved other visual recognition; bilateral or right fusiform lesions",
            "Visual object agnosia — apperceptive (cannot integrate visual features) vs. associative (cannot link percept to meaning); occipitotemporal lesions",
            "Pure alexia (alexia without agraphia) — impaired reading with preserved writing; left occipitotemporal lesion damaging the visual word form area or its connections",
            "Topographic disorientation / landmark agnosia — parahippocampal place area damage",
          ],
        },
        { h: "Klüver-Bucy syndrome" },
        {
          p: "Following bilateral anterior temporal lobe damage (including the amygdala): placidity and reduced fear response, hyperorality (oral examination of objects), hypersexuality, visual agnosia (\"psychic blindness\"), hypermetamorphosis (compulsive attention to environmental stimuli), and dietary changes. The full syndrome is rare in humans; partial features occur after bilateral temporal damage from herpes encephalitis, TBI, or bvFTD.",
        },
        { h: "Stroke syndromes" },
        {
          ul: [
            "MCA inferior-division infarct (dominant) — Wernicke's aphasia; contralateral superior quadrantanopia (Meyer's loop) with deeper extension",
            "MCA inferior-division infarct (non-dominant) — visuospatial deficits, prosody-comprehension deficits, sometimes a confusional state",
            "PCA infarct (medial temporal) — amnesia (if bilateral or dominant hippocampus), homonymous hemianopia, alexia without agraphia (left occipitotemporal)",
            "Anterior choroidal artery infarct — small lesions of uncus, anterior hippocampus, and amygdala can produce memory and emotional changes",
          ],
        },
        { h: "Neurodegenerative localization" },
        {
          ul: [
            "Alzheimer disease — earliest pathology in transentorhinal/entorhinal cortex with early hippocampal atrophy; progressive amnestic syndrome",
            "Semantic variant PPA — bilateral anterior temporal atrophy, left-predominant; progressive semantic loss",
            "Logopenic variant PPA — left posterior temporal and inferior parietal atrophy; word-retrieval and sentence-repetition deficits; often Alzheimer pathology",
            "Right temporal variant FTD — right anterior temporal atrophy; prosopagnosia, loss of person knowledge, behavioral and emotional change",
            "Limbic-predominant age-related TDP-43 encephalopathy (LATE) — amnestic dementia of older adults with hippocampal involvement, often mimicking AD",
          ],
        },
        { h: "Other localized presentations" },
        {
          ul: [
            "Herpes simplex encephalitis (HSE) — predilection for medial/inferior temporal lobes and orbitofrontal cortex; severe amnesia and personality change",
            "Limbic encephalitis — autoimmune or paraneoplastic; bilateral medial temporal involvement with subacute amnesia, seizures, and psychiatric symptoms",
            "Auditory hallucinations — superior temporal cortex involvement in primary psychotic disorders and some seizure phenomena",
            "Musicogenic epilepsy — rare seizure type triggered by music, often with a right temporal focus",
          ],
        },
        { h: "Traumatic brain injury" },
        {
          p: "The anterior temporal poles are vulnerable to contusion in closed-head injury alongside the orbitofrontal cortex, due to bony irregularities of the middle cranial fossa. Memory dysfunction, particularly for new learning, is among the most common persistent cognitive sequelae of moderate-to-severe TBI.",
        },
      ],
      assessment: [
        { h: "Verbal memory (left MTL-sensitive)" },
        {
          dl: [
            { term: "California Verbal Learning Test-3 (CVLT-3)", desc: "16-word list learning with semantic structure; learning, interference, delay, recognition" },
            { term: "Hopkins Verbal Learning Test-Revised (HVLT-R)", desc: "12-word list, three categories; briefer alternative" },
            { term: "Rey Auditory Verbal Learning Test (RAVLT)", desc: "15-word list learning" },
            { term: "WMS-IV / WMS-V Logical Memory", desc: "Story recall, immediate and delayed" },
            { term: "WMS-IV / WMS-V Verbal Paired Associates", desc: "Word-pair associative learning" },
            { term: "NAB List Learning", desc: "Word list with three trials" },
            { term: "RBANS List Learning / Story Memory", desc: "Brief screening" },
            { term: "Selective Reminding Test", desc: "Verbal list learning with selective-reminding methodology" },
          ],
        },
        { h: "Visuospatial memory (right MTL-sensitive)" },
        {
          dl: [
            { term: "Brief Visuospatial Memory Test-Revised (BVMT-R)", desc: "Six geometric figures; learning and delayed recall" },
            { term: "Rey-Osterrieth Complex Figure (memory trials)", desc: "Copy followed by immediate and delayed recall" },
            { term: "WMS-IV / WMS-V Visual Reproduction or Designs", desc: "Geometric design recall" },
            { term: "Continuous Visual Memory Test", desc: "Recognition-based visual memory" },
            { term: "Doors and People Test", desc: "Verbal and visual recall and recognition" },
            { term: "Camden Memory Tests", desc: "Recognition memory for faces, scenes, words" },
          ],
        },
        { h: "Recognition memory and item familiarity" },
        {
          ul: [
            "Warrington Recognition Memory Test — words and faces",
            "Camden Memory Tests — including Topographical Recognition Memory",
            "CVLT-3 / HVLT-R / BVMT-R recognition trials — embedded recognition measures contrasting encoding with retrieval failure",
          ],
        },
        { h: "Language (temporal-relevant)" },
        {
          ul: [
            "Boston Naming Test (BNT) — 60-item confrontation naming",
            "Multilingual Naming Test (MINT) — naming measure with cultural breadth",
            "Token Test — auditory-verbal comprehension under varying syntactic demand",
            "Peabody Picture Vocabulary Test-5 (PPVT-5) — receptive vocabulary",
            "Boston Diagnostic Aphasia Examination (BDAE) — comprehensive aphasia battery",
            "Western Aphasia Battery-Revised (WAB-R) — aphasia classification and severity",
            "Semantic (category) fluency — animals, supermarket items; sensitive to temporal-semantic dysfunction (vs. more frontal phonemic fluency)",
          ],
        },
        { h: "Semantic processing" },
        {
          ul: [
            "Pyramids and Palm Trees Test — semantic association across pictures and words",
            "Camel and Cactus Test — semantic association",
            "Word-picture matching tasks — embedded in PPA assessment protocols",
            "Famous faces and famous names tests — person-specific semantic knowledge, sensitive to anterior temporal dysfunction",
          ],
        },
        { h: "Visual recognition and face processing" },
        {
          ul: [
            "Benton Facial Recognition Test (BFRT) — perceptual face matching",
            "Cambridge Face Memory Test (CFMT) — face memory",
            "Visual Object and Space Perception Battery (VOSP) — separate object and space perception subtests",
            "Famous Faces Test — recognition and naming of familiar faces",
          ],
        },
        { h: "Auditory processing" },
        {
          ul: [
            "Speech-Sounds Perception Test (Halstead-Reitan) — phoneme discrimination",
            "Seashore Rhythm Test (Halstead-Reitan) — auditory pattern perception, right temporal sensitivity",
            "Dichotic listening paradigms — hemispheric specialization for auditory-verbal material",
          ],
        },
        { h: "Social cognition (temporal-relevant)" },
        {
          ul: [
            "Reading the Mind in the Eyes Test — mental-state inference from the eye region",
            "The Awareness of Social Inference Test (TASIT) — comprehension of social cues, sarcasm, emotion",
            "Emotion recognition tasks (Ekman 60 Faces, NimStim) — facial emotion identification, amygdala-sensitive",
          ],
        },
        { h: "Bedside screening for temporal dysfunction" },
        {
          ul: [
            "Three- and five-word delayed recall — basic episodic memory screen",
            "Story recall at bedside (e.g., the Babcock Story)",
            "Naming to confrontation — common and low-frequency object naming",
            "Single-word and sentence comprehension — point-to commands of varying complexity",
            "Repetition — single words, phrases, low-probability sentences",
            "Category fluency (animals in 60 seconds) — sensitive to semantic and MTL dysfunction",
            "Famous face recognition — quick semantic memory screen for anterior temporal function",
          ],
        },
      ],
    },
  },
  {
    id: "occipital-lobe",
    name: "Occipital Lobe",
    shortName: "Occipital",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, 0.55, -1.45],
    scale: [1.2, 1.0, 0.85],
    displacement: 0.13,
    segments: 5,
    color: "#9DEAFF",
    overview:
      "The smallest and most functionally specialized of the four lobes, occupying the posterior aspect of each hemisphere and devoted almost entirely to vision. It houses the primary visual cortex (V1) in the calcarine sulcus, organized retinotopically with marked cortical magnification of the central field, and launches the ventral 'what' and dorsal 'where/how' streams through hierarchical extrastriate areas (V2–V5/MT, LOC, V4, FFA, VWFA). As a result it is central to the homonymous field defects, cortical blindness and Anton syndrome, achromatopsia, akinetopsia, the visual agnosias, prosopagnosia, and pure alexia.",
    functions: [
      "Primary visual processing (V1, calcarine cortex)",
      "Feature detection — orientation, motion, color, depth",
      "Visual association and object recognition",
      "Initiation of dorsal ('where') and ventral ('what') streams",
    ],
    neuropsych: [
      "Bilateral occipital damage produces cortical blindness; with anosognosia this is Anton syndrome",
      "Visual field cuts (homonymous hemianopia, quadrantanopia) localize precisely to optic radiations",
      "Visual agnosia (apperceptive vs associative) tested with copying and naming tasks",
      "Achromatopsia and akinetopsia point to specific extrastriate damage",
    ],
    conditions: [
      "Cortical blindness from PCA stroke",
      "Anton syndrome",
      "Posterior cortical atrophy",
      "Charles Bonnet syndrome (visual hallucinations after vision loss)",
    ],
    topicHints: ["Visual System & Agnosia", "Vascular Syndromes"],
    detail: {
      anatomy: [
        { h: "Boundaries" },
        {
          p: "The occipital lobe occupies the posterior aspect of each cerebral hemisphere. Its anterior border on the medial surface is the parieto-occipital sulcus, which separates it from the parietal lobe. On the lateral surface, an arbitrary line from the preoccipital notch to the parieto-occipital sulcus marks the boundary with parietal and temporal cortex. The occipital pole forms the posterior tip. It is the smallest of the four lobes and the most functionally specialized — nearly the entire lobe is devoted to visual processing.",
        },
        { h: "Major gyri and sulci" },
        {
          p: "The calcarine sulcus is the defining anatomical feature on the medial surface. Running anteroposteriorly, it divides the medial occipital cortex into:",
        },
        {
          ul: [
            "Cuneus — wedge-shaped gyrus above the calcarine sulcus, representing the inferior contralateral visual field",
            "Lingual gyrus — below the calcarine sulcus, representing the superior contralateral visual field",
          ],
        },
        {
          p: "The lateral surface contains less distinctly demarcated lateral occipital gyri (superior, middle, and inferior), which house higher-order visual processing regions. The inferior (basal) surface contains the posterior fusiform (occipitotemporal) gyrus, which continues forward into the temporal lobe and houses category-selective regions for words, faces, and other visual objects.",
        },
        { h: "Functional subdivisions" },
        {
          dl: [
            { term: "Primary visual cortex (V1, striate)", desc: "Calcarine sulcus (cuneus above, lingual below) — retinotopic processing of orientation, spatial frequency, contrast, ocular dominance" },
            { term: "V2 (secondary visual cortex)", desc: "Surrounding V1 — contour integration, simple form, figure-ground segregation" },
            { term: "V3 / V3A", desc: "Dorsolateral occipital — dynamic form, motion-defined contours" },
            { term: "V4", desc: "Ventral occipital, fusiform/lingual region — color processing, complex form" },
            { term: "V5 / MT (middle temporal complex)", desc: "Lateral occipitotemporal junction — motion processing, motion-defined shape" },
            { term: "Lateral occipital complex (LOC)", desc: "Lateral occipital cortex — object recognition, shape processing" },
            { term: "Visual word form area (VWFA)", desc: "Left mid-fusiform / occipitotemporal — orthographic word recognition" },
            { term: "Fusiform face area (FFA)", desc: "Mid-fusiform, typically right-lateralized — face recognition" },
            { term: "Occipital pole", desc: "Posterior tip — central (macular) visual field representation, with disproportionate cortical magnification" },
          ],
        },
        {
          p: "Visual cortex is organized retinotopically — adjacent retinal locations map to adjacent cortical locations — and shows substantial cortical magnification of the central visual field, with the macula occupying a disproportionately large portion of V1.",
        },
        { h: "Vascular supply" },
        {
          ul: [
            "Posterior cerebral artery (PCA) — primary supply; the calcarine artery branch supplies V1 and adjacent visual cortex",
            "Middle cerebral artery (MCA) — supplies a small lateral portion of the occipital lobe in some individuals",
            "Occipital pole / macular sparing — the pole representing the central field may receive partial collateral supply, producing macular sparing in PCA infarcts (preserved central vision within an otherwise complete homonymous hemianopia); PCA-MCA collateralization is one proposed contributor",
            "Top of the basilar syndrome — occlusion at the basilar apex compromises bilateral PCA territories, producing bilateral occipital infarction with cortical blindness, often with thalamic and midbrain features",
          ],
        },
        { h: "Key white matter tracts" },
        {
          ul: [
            "Optic radiations (geniculocalcarine tract) — carry visual information from the lateral geniculate nucleus to V1, with three subdivisions",
            "Upper division (Baum's loop) — through parietal white matter; inferior visual field; lesions produce contralateral inferior quadrantanopia (\"pie on the floor\")",
            "Lower division (Meyer's loop) — courses anteriorly through temporal white matter before turning posteriorly; superior visual field; lesions produce contralateral superior quadrantanopia (\"pie in the sky\")",
            "Central division — most direct path to V1",
            "Inferior longitudinal fasciculus (ILF) — connects occipital cortex to anterior temporal lobe; visual object recognition and visual-semantic integration",
            "Inferior fronto-occipital fasciculus (IFOF) — occipital/posterior temporal to inferior frontal cortex; semantic processing",
            "Vertical occipital fasciculus (VOF) — connects dorsal and ventral occipital cortex; communication between the two visual streams",
            "Splenium of the corpus callosum / forceps major — interhemispheric occipital projections; splenial lesions can disconnect right visual cortex from left language cortex, producing pure alexia",
          ],
        },
        { h: "Developmental note" },
        {
          p: "The visual system shows among the earliest and most rapid postnatal cortical development of any sensory system, with V1 reaching near-adult structural maturity within the first year of life. Critical periods in infancy underlie deprivation amblyopia and the time-limited window for treating strabismus and refractive errors. Higher-order visual areas (face processing, reading) continue to specialize across childhood; the visual word form area becomes literacy-tuned only as reading is acquired.",
        },
      ],
      functions: [
        { h: "Primary visual processing" },
        {
          p: "V1 (primary visual cortex) performs the initial cortical analysis of visual input. Each V1 neuron has a small receptive field tuned to:",
        },
        {
          ul: [
            "Orientation (line and edge orientation)",
            "Spatial frequency (fine vs. coarse detail)",
            "Ocular dominance (organized into alternating columns)",
            "Contrast and luminance",
            "Direction of motion (a subset of neurons)",
          ],
        },
        {
          p: "V1 is organized retinotopically with cortical magnification of the central visual field. Surrounding V2 elaborates contour, figure-ground separation, and simple form.",
        },
        { h: "Two visual streams" },
        {
          ul: [
            "Ventral \"what\" stream — projects through V4 and lateral occipital cortex into the temporal lobe; object recognition, color perception, face recognition, word recognition, and scene recognition",
            "Dorsal \"where/how\" stream — projects through V3, V3A, and V5/MT into the posterior parietal cortex; motion perception, spatial localization, and visually guided action",
          ],
        },
        { h: "Specialized visual processing" },
        {
          ul: [
            "V4 is selectively engaged in color processing and complex form; damage produces cerebral achromatopsia",
            "V5/MT is selectively engaged in motion processing; damage produces akinetopsia",
            "Lateral occipital complex (LOC) supports object recognition independent of view, lighting, or size",
            "Fusiform face area (FFA) supports face recognition with right-hemisphere predominance",
            "Visual word form area (VWFA) supports orthographic recognition in left occipitotemporal cortex and becomes specialized with literacy acquisition",
          ],
        },
        { h: "Higher-order visual processing" },
        {
          ul: [
            "Visual mental imagery — V1 and adjacent cortex are engaged in vivid visual imagery, with content-specific overlap with perception",
            "Visual attention — bottom-up modulation by salience and top-down modulation by parietal and frontal attention networks",
            "Reading — coordinated activity across VWFA, V4, and broader ventral-stream regions, integrated with language cortex through the ILF and IFOF",
          ],
        },
        { h: "Lateralization" },
        {
          ul: [
            "Left occipital cortex — preferentially processes the right visual field, the visual word form area, and reading",
            "Right occipital cortex — preferentially processes the left visual field and face processing (FFA)",
          ],
        },
      ],
      clinical: [
        { h: "Visual field defects" },
        {
          p: "The occipital lobe is the most common substrate of clinically encountered homonymous visual field defects:",
        },
        {
          ul: [
            "Homonymous hemianopia — loss of vision in the contralateral half of each eye's visual field; complete V1 lesion of one hemisphere",
            "Macular sparing — preservation of central vision within an otherwise complete hemianopia; characteristic of PCA-territory infarcts",
            "Superior quadrantanopia (\"pie in the sky\") — lingual gyrus lesion below the calcarine sulcus (or Meyer's loop in temporal white matter)",
            "Inferior quadrantanopia (\"pie on the floor\") — cuneus lesion above the calcarine sulcus (or Baum's loop in parietal white matter)",
            "Cortical blindness — bilateral occipital damage; complete loss of visual perception with preserved pupillary reflexes and ocular motility",
            "Riddoch phenomenon — preserved perception of motion within an otherwise blind hemifield, attributed to preserved V5/MT or extrageniculate pathways",
          ],
        },
        { h: "Anton syndrome (visual anosognosia)" },
        {
          p: "Denial of cortical blindness: patients are unaware of their visual loss and confabulate visual experience. Classic presentation following bilateral occipital infarction. Patients may describe their environment in detail despite being completely blind, walk into furniture, and reject suggestions that they cannot see.",
        },
        { h: "Cerebral achromatopsia" },
        {
          p: "Loss of color perception following damage to V4 in the ventral occipitotemporal cortex (lingual and fusiform gyri). Can be bilateral (complete) or unilateral (hemiachromatopsia). Distinct from peripheral color blindness; achromatopsia is acquired and accompanied by other visual disturbances.",
        },
        { h: "Akinetopsia (motion blindness)" },
        {
          p: "Loss of motion perception following bilateral V5/MT damage. Patients perceive motion as a series of static images (\"snapshots\"), with severe functional consequences (e.g., difficulty pouring liquid, crossing the street).",
        },
        { h: "Visual object agnosia" },
        {
          p: "Impaired recognition of visually presented objects despite preserved primary visual function and intact object knowledge through other modalities. Two classical subtypes:",
        },
        {
          ul: [
            "Apperceptive agnosia — impaired perceptual integration of visual features; patients cannot copy or match objects they cannot name; associated with diffuse occipital damage (e.g., carbon monoxide poisoning)",
            "Associative agnosia — preserved perception but inability to associate the percept with meaning; patients can copy or match without recognizing; associated with bilateral occipitotemporal lesions",
          ],
        },
        { h: "Prosopagnosia" },
        {
          p: "Impaired face recognition following bilateral or right-lateralized fusiform damage. Acquired prosopagnosia is distinct from the developmental form. Patients may recognize people by voice, gait, or distinctive features without recognizing the face itself.",
        },
        { h: "Pure alexia (alexia without agraphia)" },
        {
          p: "Acquired impairment of reading with preserved writing, distinct from the alexia of left angular gyrus damage. Classic lesion: left occipital cortex with extension into the splenium of the corpus callosum, disconnecting right visual cortex from left language cortex. Patients can write fluently but cannot read what they have written.",
        },
        { h: "Visual hallucinations" },
        {
          ul: [
            "Simple visual hallucinations (flashes, geometric patterns, photopsias) — primary visual cortex involvement; common in occipital epilepsy and migraine aura",
            "Complex visual hallucinations (people, animals, scenes) — visual association cortex involvement",
            "Charles Bonnet syndrome — complex visual hallucinations in the setting of significant peripheral or central visual loss, with preserved insight; occurs in macular degeneration, glaucoma, and post-stroke hemianopia",
          ],
        },
        { h: "Occipital epilepsy" },
        {
          p: "Visual auras are the hallmark, including:",
        },
        {
          ul: [
            "Elementary visual hallucinations — flashes, colored lights, geometric shapes (contrast with the migraine fortification spectrum, typically longer and more elaborate)",
            "Ictal blindness or visual field defects",
            "Eye deviation and forced eye movements",
            "Postictal headache (can be difficult to distinguish from migraine)",
          ],
        },
        { h: "Bálint's syndrome (parieto-occipital)" },
        {
          p: "Although classically attributed to bilateral parieto-occipital damage, the syndrome can be discussed in the context of either lobe. The triad of simultanagnosia, optic ataxia, and oculomotor apraxia reflects disruption of the dorsal visual stream and posterior parietal-occipital integration.",
        },
        { h: "Stroke syndromes" },
        {
          ul: [
            "PCA infarct (unilateral) — contralateral homonymous hemianopia, often with macular sparing; if dominant (left), may include alexia without agraphia, color anomia, and verbal memory impairment with extension to medial temporal structures",
            "PCA infarct (bilateral) / top of the basilar syndrome — cortical blindness, Anton syndrome, amnesia (if bilateral hippocampi involved), and variable thalamic and brainstem features",
            "MCA-PCA watershed — Bálint's syndrome features (when bilateral)",
            "Cardioembolic stroke — PCA territory is a common destination for cardiac emboli traversing the vertebrobasilar system",
          ],
        },
        { h: "Neurodegenerative localization" },
        {
          ul: [
            "Posterior cortical atrophy (Benson syndrome) — predominant posterior cortical degeneration (occipital, parietal, posterior temporal), most commonly AD pathology; visuospatial dysfunction, Bálint's and Gerstmann features, environmental disorientation, apperceptive agnosia, alexia, with relatively preserved memory and behavior early",
            "Creutzfeldt-Jakob disease (Heidenhain variant) — predominant occipital and parieto-occipital involvement with cortical visual disturbance, agnosia, and rapidly progressive dementia",
            "Dementia with Lewy bodies (DLB) — posterior cortical involvement contributes to characteristic complex visual hallucinations (often well-formed people or animals) and visuospatial dysfunction",
            "Alzheimer disease — although typically parietotemporal early, posterior cortical features can predominate in the PCA variant",
          ],
        },
        { h: "Other localized presentations" },
        {
          ul: [
            "Migraine with aura — visual aura (scintillating scotoma, fortification spectra) reflects cortical spreading depression beginning in occipital cortex",
            "Posterior reversible encephalopathy syndrome (PRES) — posterior-predominant vasogenic edema producing cortical visual disturbance, headache, seizures, and altered mentation; associated with hypertension, eclampsia, and immunosuppressants",
            "Sturge-Weber syndrome — leptomeningeal angiomatosis often involving the occipital region, with cortical calcification, seizures, and visual field defects",
            "Hemianopic dyslexia — reading impairment caused by a visual field defect interfering with normal saccadic reading strategy, dissociable from pure alexia",
          ],
        },
        { h: "Traumatic brain injury" },
        {
          p: "The occipital lobes are less commonly the primary site of contusion than the frontal and temporal lobes (which sit against bony irregularities), but the occipital cortex can be injured by contrecoup mechanisms following frontal impact. Post-traumatic visual disturbances, including visual field defects and higher-order visual processing deficits, occur and are sometimes underrecognized.",
        },
      ],
      assessment: [
        { h: "Visual field testing" },
        {
          ul: [
            "Confrontation testing — bedside assessment of all four quadrants, single and double simultaneous stimulation",
            "Automated perimetry (Humphrey, Goldmann) — formal mapping of visual field defects",
            "Tangent screen and kinetic perimetry — when automated perimetry is unavailable or inappropriate",
            "Visual extinction testing — double simultaneous visual stimulation for cortical visual extinction",
          ],
        },
        { h: "Higher visual function batteries" },
        {
          dl: [
            { term: "Visual Object and Space Perception Battery (VOSP)", desc: "Separate object perception (shape detection, silhouettes, object decision, progressive silhouettes) and space perception (dot counting, position discrimination, number location, cube analysis) subtests" },
            { term: "Birmingham Object Recognition Battery (BORB)", desc: "Comprehensive battery for visual recognition, including length, size, orientation matching and object decision" },
            { term: "Cortical Vision Screening Test (CORVIST)", desc: "Brief screen for cortical visual dysfunction, useful in PCA workup" },
            { term: "Hooper Visual Organization Test", desc: "Mental reassembly of fragmented object images" },
            { term: "Benton Facial Recognition Test (BFRT)", desc: "Perceptual face matching, sensitive to ventral occipitotemporal damage" },
            { term: "Cambridge Face Memory Test (CFMT)", desc: "Memory for unfamiliar faces" },
          ],
        },
        { h: "Color perception" },
        {
          ul: [
            "Ishihara plates — screening for color discrimination (originally for congenital deficits, but useful for hemiachromatopsia detection)",
            "Farnsworth-Munsell 100 Hue Test — fine color discrimination across the spectrum",
            "Color naming and pointing — for color anomia",
            "Color sorting tasks",
          ],
        },
        { h: "Motion perception" },
        {
          p: "Formal motion testing is rare in clinical practice; functional inquiry into difficulties with moving stimuli (pouring liquid, crossing traffic, watching television) is more commonly used to detect akinetopsia.",
        },
        { h: "Reading assessment (occipitotemporal)" },
        {
          ul: [
            "Letter, word, and pseudoword reading — assessing alexia type and severity",
            "Gray Oral Reading Tests-5 (GORT-5) — fluency and comprehension",
            "WIAT-4 Word Reading and Pseudoword Decoding",
            "Tachistoscopic word presentation — for hemialexia detection",
            "Reading aloud with field-defect awareness — observing whether errors track with hemianopic dyslexia versus pure alexia",
          ],
        },
        { h: "Visuoconstructional measures (shared with parietal)" },
        {
          ul: [
            "WAIS Block Design",
            "WAIS Visual Puzzles",
            "Rey-Osterrieth Complex Figure copy",
            "Clock drawing",
            "Cube and intersecting pentagons drawing",
          ],
        },
        { h: "Visual memory measures (shared with temporal)" },
        {
          p: "BVMT-R, Rey-Osterrieth memory trials, WMS-5 Visual Reproduction, and WMS-5 Designs — for visual memory contributions involving occipital-temporal interactions.",
        },
        { h: "Visual scanning and attention" },
        {
          ul: [
            "Trail Making Test Part A — visual scanning under sequencing demand",
            "Cancellation tasks (Letter, Star, Bell) — visual search and inattention",
            "Visual search paradigms — feature and conjunction search",
          ],
        },
        { h: "Hallucination assessment" },
        {
          ul: [
            "Open-ended interview about visual hallucinations — content, frequency, duration, insight, and triggers",
            "Charles Bonnet syndrome screen — visual hallucinations in the context of vision loss with preserved insight",
            "North-East Visual Hallucinations Interview (NEVHI) — structured assessment used in DLB workup",
          ],
        },
        { h: "Anton syndrome screening" },
        {
          p: "When cortical blindness is suspected:",
        },
        {
          ul: [
            "Compare reported visual perception against examiner observations (e.g., walking into objects)",
            "Ask the patient to describe details of the immediate environment, the examiner's clothing, or a worn watch face",
            "Confront the discrepancy gently; insight is characteristically absent",
          ],
        },
        { h: "Bedside screening for occipital dysfunction" },
        {
          ul: [
            "Visual field confrontation including double simultaneous stimulation",
            "Acuity with near card (rule out non-cortical contribution)",
            "Reading aloud a sentence or paragraph",
            "Color naming for common items (banana, sky, blood, grass)",
            "Object naming to confrontation versus naming to description (dissociating agnosia from anomia)",
            "Famous face recognition",
            "Clock drawing and pentagon copy for visuospatial contribution",
            "Description of a complex scene (Cookie Theft) for inattention and simultanagnosia",
          ],
        },
      ],
    },
  },

  // ──────────────── CORTICAL SUBREGIONS (6) ────────────────
  {
    id: "prefrontal-cortex",
    name: "Prefrontal Cortex (DLPFC)",
    shortName: "Prefrontal",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, 0.55, 1.65],
    scale: [1.05, 0.7, 0.45],
    displacement: 0.12,
    segments: 5,
    color: "#BDE5FF",
    overview:
      "Anterior tip of the frontal lobe, especially the dorsolateral prefrontal cortex (DLPFC). The brain's executive boardroom — last region to fully myelinate and most uniquely human.",
    functions: [
      "Working memory maintenance and manipulation",
      "Cognitive flexibility and set-shifting",
      "Goal selection and rule abstraction",
      "Top-down attentional control",
      "Planning and prospective memory",
    ],
    neuropsych: [
      "DLPFC dysfunction is the core mechanism behind perseverative errors on the Wisconsin Card Sorting Test",
      "Reduced DLPFC activity is one of the most replicated findings in major depression — also the FDA-approved target for rTMS",
      "Hypofrontality during n-back tasks is a hallmark of schizophrenia",
      "The 'frontal aging hypothesis' attributes much of normal cognitive decline to prefrontal volume loss",
    ],
    conditions: [
      "Major Depressive Disorder (rTMS target)",
      "Schizophrenia — working memory deficits",
      "ADHD",
      "Frontal-lobe injury executive dysfunction",
    ],
    topicHints: ["Executive Function", "Mood Disorders & Neuromodulation"],
  },
  {
    id: "orbitofrontal-cortex",
    name: "Orbitofrontal Cortex",
    shortName: "OFC",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, -0.25, 1.45],
    scale: [0.95, 0.4, 0.55],
    displacement: 0.1,
    segments: 5,
    color: "#7DD8E8",
    overview:
      "Sits above the orbits of the eyes on the ventral surface of the frontal lobe. Encodes the subjective value of stimuli and links emotion to decision making.",
    functions: [
      "Reward valuation and reversal learning",
      "Encoding subjective preference (food, money, faces)",
      "Inhibition of socially inappropriate impulses",
      "Linking emotion to consequence prediction",
      "Olfactory processing (secondary)",
    ],
    neuropsych: [
      "OFC damage produces 'pseudopsychopathic' personality change — the Phineas Gage pattern of disinhibition without intellectual loss",
      "The Iowa Gambling Task is the classic OFC measure: damaged patients keep choosing high-reward/high-loss decks",
      "Hyperactivity in OFC–striatal loops is a leading model for Obsessive-Compulsive Disorder",
      "Reduced OFC volume correlates with antisocial and borderline personality traits",
    ],
    conditions: [
      "OCD (OFC-striatal hyperactivity)",
      "Acquired sociopathy from OFC trauma",
      "Frontotemporal dementia (behavioral variant)",
      "Substance use disorders",
    ],
    topicHints: ["Decision Making & Reward", "Personality Disorders"],
  },
  {
    id: "motor-cortex",
    name: "Primary Motor Cortex",
    shortName: "Motor Cortex",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, 1.05, 0.3],
    scale: [1.45, 0.22, 0.35],
    displacement: 0.08,
    segments: 5,
    color: "#3FB6D9",
    overview:
      "A thin strip on the precentral gyrus, immediately anterior to the central sulcus. Contains the giant Betz cells whose axons descend the corticospinal tract to drive voluntary movement.",
    functions: [
      "Initiation of voluntary movement",
      "Somatotopic motor map (homunculus)",
      "Fine motor control (especially hand and face)",
      "Origin of corticospinal and corticobulbar tracts",
    ],
    neuropsych: [
      "Lesions produce contralateral upper-motor-neuron weakness — hyperreflexia, spasticity, Babinski sign",
      "The size of each body region on the homunculus reflects motor precision, not body size — hands and lips are huge",
      "Functional reorganization after stroke is the basis of constraint-induced movement therapy",
      "Plays a role in motor imagery and 'mental practice' used in rehab",
    ],
    conditions: [
      "Middle cerebral artery stroke (hand/face weakness)",
      "Anterior cerebral artery stroke (leg weakness)",
      "ALS (motor neuron loss)",
      "Cortical motor seizures (Jacksonian march)",
    ],
    topicHints: ["Motor Pathways", "Stroke Syndromes"],
  },
  {
    id: "somatosensory-cortex",
    name: "Primary Somatosensory Cortex",
    shortName: "Sensory Cortex",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, 1.05, -0.05],
    scale: [1.45, 0.22, 0.35],
    displacement: 0.08,
    segments: 5,
    color: "#9DEAFF",
    overview:
      "Strip on the postcentral gyrus mirroring the motor cortex across the central sulcus. Receives processed touch, pressure, vibration, and proprioception from the contralateral body via the thalamus.",
    functions: [
      "Conscious perception of touch, pain, and temperature",
      "Proprioception and limb position sense",
      "Two-point discrimination",
      "Stereognosis (object recognition by touch)",
    ],
    neuropsych: [
      "Lesions produce contralateral cortical sensory loss — preserved crude touch but lost discrimination, stereognosis, graphesthesia",
      "Tested clinically with two-point discrimination, stereognosis, and double simultaneous stimulation (extinction)",
      "Phantom limb sensation reflects cortical reorganization after amputation",
      "Mirror-touch synesthesia is a heightened cross-activation of this region",
    ],
    conditions: [
      "Cortical sensory loss",
      "Tactile agnosia (astereognosis)",
      "Phantom limb syndrome",
      "Sensory seizures",
    ],
    topicHints: ["Sensory Pathways", "Cortical Mapping"],
  },
  {
    id: "anterior-cingulate",
    name: "Anterior Cingulate Cortex",
    shortName: "ACC",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "arch",
    position: [0, 0.35, 0.55],
    scale: [0.22, 0.55, 0.7],
    displacement: 0.06,
    segments: 5,
    color: "#5FA8C9",
    overview:
      "Curves around the anterior corpus callosum on the medial surface of the frontal lobe. A hub for conflict monitoring, emotional regulation, and the autonomic accompaniment of emotion.",
    functions: [
      "Error detection and conflict monitoring (Stroop)",
      "Effort allocation and motivation",
      "Pain affect — the 'unpleasantness' of pain rather than its location",
      "Autonomic regulation (heart rate, blood pressure)",
      "Social pain and rejection processing",
    ],
    neuropsych: [
      "ACC produces the error-related negativity (ERN) on EEG — exaggerated in OCD, blunted in psychopathy",
      "Akinetic mutism (failure to initiate speech or movement) follows bilateral ACC damage",
      "Subgenual ACC (Brodmann 25) is the deep brain stimulation target for treatment-resistant depression",
      "ACC hyperactivity is part of the 'cortico-striato-thalamo-cortical' loop disrupted in OCD",
    ],
    conditions: [
      "Treatment-resistant depression (DBS target)",
      "OCD",
      "Akinetic mutism",
      "Anxiety disorders (hyperactive threat monitoring)",
    ],
    topicHints: ["Cognitive Control", "Mood Disorders & Neuromodulation"],
  },
  {
    id: "insular-cortex",
    name: "Insular Cortex",
    shortName: "Insula",
    system: "cortex",
    layer: "subcortical",
    paired: true,
    shape: "ellipsoid",
    position: [0.85, 0.05, 0.3],
    scale: [0.18, 0.5, 0.6],
    displacement: 0.05,
    segments: 4,
    color: "#2FA0C6",
    overview:
      "Hidden cortical lobe buried within the lateral sulcus, beneath the temporal lobe's overhang. Acts as the brain's 'interoceptive cortex' — the seat of bodily self-awareness.",
    functions: [
      "Interoception — perception of heart rate, hunger, breathing",
      "Taste processing (primary gustatory cortex)",
      "Emotional awareness and empathy",
      "Visceral autonomic integration",
      "Disgust generation and recognition",
    ],
    neuropsych: [
      "Anterior insula activity predicts subjective emotional intensity in fMRI",
      "Hyperactive insula is implicated in panic disorder and somatic symptom disorders",
      "Insular damage can abolish nicotine cravings — 'forgetting' addiction",
      "Reduced insular gray matter is found in alexithymia (difficulty identifying feelings)",
    ],
    conditions: [
      "Panic disorder",
      "Somatic symptom disorder",
      "Addiction (smoking cessation after insular stroke)",
      "Alexithymia",
    ],
    topicHints: ["Emotion & Interoception", "Anxiety Disorders"],
  },

  // ──────────────── LIMBIC SYSTEM (5) ────────────────
  {
    id: "hippocampus",
    name: "Hippocampus",
    shortName: "Hippocampus",
    system: "limbic",
    layer: "subcortical",
    paired: true,
    shape: "crescent",
    position: [1.0, -0.25, -0.1],
    scale: [0.2, 0.2, 0.7],
    rotation: [0.1, 0, 0.2],
    displacement: 0.05,
    segments: 4,
    color: "#7DD8E8",
    overview:
      "Seahorse-shaped curl of cortex on the medial temporal lobe. Indispensable for forming new declarative memories — without it, today never becomes yesterday.",
    functions: [
      "Encoding episodic and semantic memory",
      "Spatial navigation and cognitive maps (place cells)",
      "Pattern separation and pattern completion",
      "Adult neurogenesis (one of the few neurogenic regions)",
      "Stress regulation via HPA-axis feedback",
    ],
    neuropsych: [
      "Bilateral hippocampal damage produces dense anterograde amnesia (the H.M. case) with preserved working memory and procedural learning",
      "Hippocampal atrophy is the earliest structural marker of Alzheimer's disease",
      "Reduced hippocampal volume is the most replicated brain finding in PTSD and chronic depression",
      "Spared in psychogenic amnesia, distinguishing it from organic memory loss",
    ],
    conditions: [
      "Alzheimer's disease",
      "PTSD (volume reduction)",
      "Mesial temporal sclerosis & epilepsy",
      "Korsakoff syndrome",
    ],
    topicHints: ["Memory Systems", "Neurodegeneration"],
  },
  {
    id: "amygdala",
    name: "Amygdala",
    shortName: "Amygdala",
    system: "limbic",
    layer: "subcortical",
    paired: true,
    shape: "ellipsoid",
    position: [1.0, -0.3, 0.45],
    scale: [0.2, 0.2, 0.22],
    displacement: 0.04,
    segments: 4,
    color: "#3FB6D9",
    overview:
      "Almond-shaped nuclei sitting just anterior to each hippocampus. The brain's threat-detection system and the emotional tagger that decides which experiences become unforgettable.",
    functions: [
      "Fear conditioning and threat detection",
      "Emotional modulation of memory",
      "Recognition of emotional facial expressions",
      "Triggering autonomic fear responses (HPA, sympathetic)",
      "Reward learning (in concert with NAcc)",
    ],
    neuropsych: [
      "Bilateral amygdala damage produces Klüver-Bucy syndrome — placidity, hyperorality, hypersexuality, impaired threat recognition",
      "Hyperactive amygdala on fMRI is a defining feature of PTSD, anxiety disorders, and acute stress",
      "Patient S.M. — bilateral amygdala calcification — cannot experience or recognize fear",
      "Amygdala–prefrontal connectivity underlies emotion regulation skills targeted by CBT and DBT",
    ],
    conditions: [
      "PTSD",
      "Anxiety disorders",
      "Klüver-Bucy syndrome",
      "Urbach-Wiethe disease (selective amygdala calcification)",
    ],
    topicHints: ["Emotion & Fear Learning", "Anxiety & Trauma Disorders"],
  },
  {
    id: "posterior-cingulate",
    name: "Posterior Cingulate Cortex",
    shortName: "PCC",
    system: "limbic",
    layer: "cortex",
    paired: false,
    shape: "arch",
    position: [0, 0.6, -0.55],
    scale: [0.22, 0.5, 0.6],
    displacement: 0.06,
    segments: 4,
    color: "#5FA8C9",
    overview:
      "Sits above the splenium of the corpus callosum on the medial parietal surface. A central node of the Default Mode Network — most active during introspection and mind-wandering.",
    functions: [
      "Self-referential thought and autobiographical recall",
      "Default Mode Network hub",
      "Spatial orientation and visuospatial memory",
      "Monitoring the external environment for changes",
    ],
    neuropsych: [
      "PCC hypometabolism on FDG-PET is one of the earliest signs of Alzheimer's disease",
      "Excessive PCC activity is linked to depressive rumination — calmed by mindfulness training",
      "Disrupted PCC connectivity is a marker of disorders of consciousness (vegetative state)",
      "Lesions can cause topographical disorientation in familiar environments",
    ],
    conditions: [
      "Alzheimer's disease (early hypometabolism)",
      "Depressive rumination",
      "Disorders of consciousness",
      "Topographical amnesia",
    ],
    topicHints: ["Default Mode Network", "Neurodegeneration"],
  },
  {
    id: "fornix",
    name: "Fornix",
    shortName: "Fornix",
    system: "limbic",
    layer: "deep",
    paired: false,
    shape: "arch",
    position: [0, 0.15, -0.05],
    scale: [0.12, 0.35, 0.7],
    displacement: 0.03,
    segments: 4,
    color: "#9DEAFF",
    overview:
      "C-shaped white-matter bundle that arches from each hippocampus forward and down to the mammillary bodies. The hippocampus's principal output highway.",
    functions: [
      "Carries hippocampal output to mammillary bodies and septal nuclei",
      "Closes the Papez circuit of memory",
      "Modulates hippocampal theta rhythm via septal projections",
    ],
    neuropsych: [
      "Fornix lesions produce dense anterograde amnesia even when the hippocampus itself is intact",
      "Atrophy of the fornix is one of the earliest white-matter findings in Alzheimer's disease",
      "Surgical injury during third-ventricle tumor resection is a classic cause of acute amnesia",
      "Diffusion tensor imaging of the fornix is a research biomarker for prodromal dementia",
    ],
    conditions: [
      "Alzheimer's disease (early DTI changes)",
      "Postoperative amnesia",
      "Colloid cyst-related amnesia",
    ],
    topicHints: ["Memory Circuits", "White Matter Disease"],
  },
  {
    id: "mammillary-bodies",
    name: "Mammillary Bodies",
    shortName: "Mammillary",
    system: "limbic",
    layer: "deep",
    paired: true,
    shape: "ellipsoid",
    position: [0.18, -0.45, 0.2],
    scale: [0.13, 0.13, 0.13],
    displacement: 0.03,
    segments: 3,
    color: "#BDE5FF",
    overview:
      "Two small spherical nuclei on the underside of the brain, just behind the pituitary stalk. The output station of the hippocampal–fornix–thalamic memory loop.",
    functions: [
      "Relay memory signals from hippocampus to anterior thalamus",
      "Component of the Papez circuit",
      "Contribute to spatial and contextual memory",
    ],
    neuropsych: [
      "Mammillary atrophy is the diagnostic lesion of Wernicke-Korsakoff syndrome — chronic thiamine deficiency in alcohol use disorder",
      "Korsakoff patients show profound anterograde amnesia with confabulation — a classic neuropsych presentation",
      "Often spared imaging finding in early dementia, helping distinguish from Korsakoff",
    ],
    conditions: [
      "Wernicke-Korsakoff syndrome",
      "Thiamine deficiency states",
      "Bariatric surgery complications",
    ],
    topicHints: ["Memory Circuits", "Substance-Related Cognitive Disorders"],
  },

  // ──────────────── DIENCEPHALON (3) ────────────────
  {
    id: "thalamus",
    name: "Thalamus",
    shortName: "Thalamus",
    system: "diencephalon",
    layer: "deep",
    paired: true,
    shape: "ellipsoid",
    position: [0.32, 0.05, 0.0],
    scale: [0.28, 0.4, 0.6],
    displacement: 0.05,
    segments: 4,
    color: "#3FB6D9",
    overview:
      "Egg-shaped pair of nuclei at the brain's geometric center. Almost every sensory pathway except olfaction, and every cortical loop, is gated through here — earning it the title 'gateway to the cortex.'",
    functions: [
      "Relay sensory input to primary cortical areas",
      "Modulate cortical arousal and consciousness",
      "Coordinate motor signals (VL, VA nuclei)",
      "Mediate cortico-striato-thalamo-cortical loops",
      "Pulvinar contributes to visual attention",
    ],
    neuropsych: [
      "Bilateral medial thalamic strokes can cause 'thalamic dementia' with profound apathy and amnesia",
      "Thalamic pain syndrome (Dejerine-Roussy) follows VPL infarct — burning contralateral pain",
      "Disrupted thalamocortical oscillations are central to fatal familial insomnia and absence seizures",
      "Thalamic volume loss is found in schizophrenia and contributes to sensory gating deficits",
    ],
    conditions: [
      "Thalamic stroke (Dejerine-Roussy)",
      "Fatal familial insomnia (prion disease)",
      "Absence epilepsy",
      "Schizophrenia",
    ],
    topicHints: ["Sensory Gating", "Disorders of Consciousness"],
  },
  {
    id: "hypothalamus",
    name: "Hypothalamus",
    shortName: "Hypothalamus",
    system: "diencephalon",
    layer: "deep",
    paired: false,
    shape: "ellipsoid",
    position: [0, -0.4, 0.25],
    scale: [0.25, 0.2, 0.3],
    displacement: 0.04,
    segments: 4,
    color: "#7DD8E8",
    overview:
      "Small but mighty cluster of nuclei beneath the thalamus, forming the floor of the third ventricle. Master regulator of homeostasis and the hormonal command center of the body.",
    functions: [
      "Regulates appetite, thirst, body temperature, and sleep–wake cycle",
      "Controls the autonomic nervous system",
      "Drives the HPA stress axis (CRH → ACTH → cortisol)",
      "Releases oxytocin and vasopressin via the posterior pituitary",
      "Houses the suprachiasmatic nucleus — the body's master clock",
    ],
    neuropsych: [
      "Chronic HPA-axis hyperactivity is a core neurobiological feature of major depression and PTSD",
      "Hypothalamic damage causes hyperphagia/obesity (ventromedial) or anorexia (lateral) — historic 'dual-center' model",
      "Suprachiasmatic dysfunction underlies seasonal affective disorder and shift-work disorder",
      "Plays a central role in the neurobiology of attachment via oxytocin",
    ],
    conditions: [
      "Cushing's disease",
      "Diabetes insipidus",
      "Eating disorders (hypothalamic dysfunction)",
      "Circadian rhythm disorders",
    ],
    topicHints: ["Stress & HPA Axis", "Sleep & Circadian Rhythms"],
  },
  {
    id: "pituitary",
    name: "Pituitary Gland",
    shortName: "Pituitary",
    system: "diencephalon",
    layer: "deep",
    paired: false,
    shape: "ellipsoid",
    position: [0, -0.7, 0.3],
    scale: [0.13, 0.16, 0.13],
    displacement: 0.02,
    segments: 3,
    color: "#5FA8C9",
    overview:
      "Pea-sized endocrine gland hanging from the hypothalamus on a thin stalk. The 'master gland' — its anterior and posterior lobes secrete hormones that govern growth, reproduction, stress, and metabolism.",
    functions: [
      "Anterior lobe releases ACTH, TSH, GH, FSH, LH, prolactin",
      "Posterior lobe stores and releases oxytocin and vasopressin",
      "Translates hypothalamic signals into endocrine action",
    ],
    neuropsych: [
      "Pituitary adenomas can present neuropsychiatrically with mood changes, fatigue, and psychosis",
      "Hyperprolactinemia (prolactinoma or antipsychotic-induced) causes depression-like fatigue and sexual dysfunction",
      "Cushing's disease (ACTH-secreting adenoma) produces depression in over half of patients",
      "Pituitary apoplexy is a neurosurgical emergency presenting with sudden headache, vision loss, and hormonal crash",
    ],
    conditions: [
      "Pituitary adenoma",
      "Cushing's disease",
      "Sheehan syndrome",
      "Antipsychotic-induced hyperprolactinemia",
    ],
    topicHints: ["Endocrine-Behavioral Interactions", "Medication Side Effects"],
  },

  // ──────────────── BASAL GANGLIA (5) ────────────────
  {
    id: "caudate",
    name: "Caudate Nucleus",
    shortName: "Caudate",
    system: "basal-ganglia",
    layer: "deep",
    paired: true,
    shape: "crescent",
    position: [0.5, 0.2, 0.15],
    scale: [0.16, 0.25, 0.7],
    rotation: [0.1, 0, 0],
    displacement: 0.04,
    segments: 4,
    color: "#9DEAFF",
    overview:
      "C-shaped nucleus that arches alongside the lateral ventricle. Forms the 'associative' input zone of the basal ganglia, weighing context against goals.",
    functions: [
      "Goal-directed action selection",
      "Cognitive flexibility and rule learning",
      "Reward-prediction signaling (with putamen)",
      "Inhibition of competing motor programs",
    ],
    neuropsych: [
      "Caudate atrophy is the pathognomonic imaging finding in Huntington's disease — flattens the lateral ventricle wall",
      "Hyperactive caudate is part of the OCD circuit (with OFC and ACC)",
      "Caudate stroke produces abulia — profound loss of motivation without depressed mood",
      "Reduced caudate volume is found in ADHD",
    ],
    conditions: [
      "Huntington's disease",
      "OCD",
      "ADHD",
      "Vascular abulia",
    ],
    topicHints: ["Movement Disorders", "OCD & Compulsivity"],
  },
  {
    id: "putamen",
    name: "Putamen",
    shortName: "Putamen",
    system: "basal-ganglia",
    layer: "deep",
    paired: true,
    shape: "ellipsoid",
    position: [0.85, 0.0, 0.2],
    scale: [0.2, 0.4, 0.55],
    displacement: 0.04,
    segments: 4,
    color: "#BDE5FF",
    overview:
      "Largest basal ganglion, sitting lateral to the globus pallidus. The 'sensorimotor' input nucleus that drives habit learning and well-practiced movements.",
    functions: [
      "Habit learning and procedural memory",
      "Smooth execution of overlearned movements",
      "Implicit sequence learning",
      "Reinforcement learning via dopaminergic input",
    ],
    neuropsych: [
      "Putamen lesions can produce hemiballismus or dystonia",
      "Reduced putamen volume is one of the most consistent findings in Tourette syndrome",
      "Putaminal hyperactivity is implicated in addiction — habit-driven drug seeking",
      "Striatal beta oscillations are a target for deep brain stimulation in Parkinson's",
    ],
    conditions: [
      "Parkinson's disease",
      "Tourette syndrome",
      "Substance use disorders",
      "Hemiballismus",
    ],
    topicHints: ["Habit Learning", "Movement Disorders"],
  },
  {
    id: "globus-pallidus",
    name: "Globus Pallidus",
    shortName: "Globus Pallidus",
    system: "basal-ganglia",
    layer: "deep",
    paired: true,
    shape: "ellipsoid",
    position: [0.6, -0.05, 0.2],
    scale: [0.15, 0.3, 0.4],
    displacement: 0.03,
    segments: 4,
    color: "#5FA8C9",
    overview:
      "Pale-staining nucleus medial to the putamen, divided into external (GPe) and internal (GPi) segments. The basal ganglia's main output gateway, releasing or applying the brakes on thalamocortical motor loops.",
    functions: [
      "GPi: tonic inhibition of the thalamus (motor brake)",
      "GPe: modulates indirect-pathway output",
      "Final integration point of basal-ganglia signals",
      "Targets the ventrolateral thalamus and motor cortex",
    ],
    neuropsych: [
      "GPi is the most common deep brain stimulation target for Parkinson's disease and dystonia",
      "Bilateral GP lesions (e.g., carbon monoxide poisoning) produce parkinsonism with apathy and obsessive-compulsive symptoms",
      "Pallidal damage is a recognized cause of acquired stuttering",
      "Pallidal calcification (Fahr disease) presents with movement disorders and psychiatric symptoms",
    ],
    conditions: [
      "Parkinson's disease (DBS target)",
      "Dystonia",
      "Carbon monoxide poisoning sequelae",
      "Fahr disease",
    ],
    topicHints: ["Movement Disorders", "Deep Brain Stimulation"],
  },
  {
    id: "substantia-nigra",
    name: "Substantia Nigra",
    shortName: "Substantia Nigra",
    system: "basal-ganglia",
    layer: "deep",
    paired: true,
    shape: "ellipsoid",
    position: [0.18, -0.7, -0.2],
    scale: [0.18, 0.08, 0.18],
    displacement: 0.02,
    segments: 3,
    color: "#1C4E75",
    overview:
      "Darkly pigmented strip in the midbrain, named for its melanin-containing neurons. Source of the dopaminergic projections that fuel the basal ganglia and reward learning.",
    functions: [
      "Pars compacta (SNc): dopamine to dorsal striatum (nigrostriatal pathway)",
      "Pars reticulata (SNr): inhibitory output similar to GPi",
      "Modulates movement initiation and reinforcement learning",
      "Encodes reward-prediction error signals",
    ],
    neuropsych: [
      "SNc neuron loss is the defining lesion of Parkinson's disease — symptoms emerge once ~60–70% are gone",
      "Lewy bodies in SNc are pathognomonic of Parkinson's and Lewy body dementia",
      "Reduced nigrostriatal dopamine in PD also produces depression, apathy, and impaired reward learning",
      "Dopamine replacement (levodopa, agonists) can paradoxically trigger impulse-control disorders",
    ],
    conditions: [
      "Parkinson's disease",
      "Lewy body dementia",
      "Dopamine dysregulation syndrome",
      "MPTP-induced parkinsonism",
    ],
    topicHints: ["Dopamine Systems", "Movement Disorders"],
  },
  {
    id: "nucleus-accumbens",
    name: "Nucleus Accumbens",
    shortName: "NAcc",
    system: "basal-ganglia",
    layer: "deep",
    paired: true,
    shape: "ellipsoid",
    position: [0.25, -0.35, 0.55],
    scale: [0.15, 0.15, 0.2],
    displacement: 0.03,
    segments: 3,
    color: "#7DD8E8",
    overview:
      "Small ventral extension of the striatum where the head of the caudate meets the putamen. The 'pleasure center' — a critical hub of the mesolimbic reward pathway.",
    functions: [
      "Encodes reward anticipation and motivation ('wanting')",
      "Reinforcement of goal-directed behavior",
      "Integrates limbic input (amygdala, hippocampus, vmPFC)",
      "Modulates effort-based decision making",
    ],
    neuropsych: [
      "All major drugs of abuse converge on increasing NAcc dopamine",
      "Blunted NAcc activation to reward (Monetary Incentive Delay task) is a transdiagnostic marker of anhedonia",
      "NAcc is a deep brain stimulation target for severe OCD and treatment-resistant depression",
      "Reduced NAcc volume correlates with the negative symptoms of schizophrenia (avolition)",
    ],
    conditions: [
      "Substance use disorders",
      "Depression (anhedonia)",
      "Treatment-resistant OCD (DBS)",
      "Schizophrenia (avolition)",
    ],
    topicHints: ["Reward & Addiction", "Anhedonia"],
  },

  // ──────────────── WHITE MATTER (1) ────────────────
  {
    id: "corpus-callosum",
    name: "Corpus Callosum",
    shortName: "Corpus Callosum",
    system: "white-matter",
    layer: "deep",
    paired: false,
    shape: "arch",
    position: [0, 0.5, 0.0],
    scale: [0.18, 0.3, 1.3],
    displacement: 0.04,
    segments: 5,
    color: "#BDE5FF",
    overview:
      "The largest white-matter tract in the brain — a thick C-shaped band of ~200 million axons connecting homologous regions of the two hemispheres.",
    functions: [
      "Interhemispheric transfer of sensory, motor, and cognitive information",
      "Coordinates bilateral motor activity",
      "Permits unified perception across both visual fields",
      "Splenium (posterior) carries visual; genu (anterior) carries frontal",
    ],
    neuropsych: [
      "Surgical 'split-brain' (corpus callosotomy for epilepsy) produces the famous Sperry/Gazzaniga findings — left hemisphere can't name objects shown to the right hemisphere alone",
      "Alien hand syndrome can follow anterior callosal damage",
      "Callosal agenesis often presents with subtle social and language deficits resembling autism",
      "Marchiafava-Bignami disease — selective callosal demyelination from chronic alcoholism",
    ],
    conditions: [
      "Split-brain syndrome",
      "Marchiafava-Bignami disease",
      "Callosal agenesis",
      "Multiple sclerosis (callosal plaques)",
    ],
    topicHints: ["Hemispheric Specialization", "White Matter Disease"],
  },

  // ──────────────── BRAINSTEM (3) ────────────────
  {
    id: "midbrain",
    name: "Midbrain",
    shortName: "Midbrain",
    system: "brainstem",
    layer: "deep",
    paired: false,
    shape: "ellipsoid",
    position: [0, -0.85, -0.05],
    scale: [0.35, 0.25, 0.35],
    displacement: 0.04,
    segments: 4,
    color: "#1C4E75",
    overview:
      "Top segment of the brainstem, between the diencephalon and pons. Houses cranial nerve nuclei III and IV, the substantia nigra, and the colliculi for visual and auditory reflexes.",
    functions: [
      "Eye movement control (CN III, IV nuclei)",
      "Visual orienting reflex (superior colliculus)",
      "Auditory relay (inferior colliculus)",
      "Houses the periaqueductal gray for pain modulation",
      "Reticular formation contributes to arousal",
    ],
    neuropsych: [
      "Periaqueductal gray is the brain's endogenous opioid analgesia center — target of placebo and meditation effects",
      "Midbrain dopaminergic neurons in the VTA project to NAcc and PFC, driving reward and motivation",
      "Damage produces classic eye-movement findings: Parinaud syndrome (vertical gaze palsy from dorsal midbrain lesion)",
      "Mesencephalic locomotor region is a DBS target for gait freezing in Parkinson's",
    ],
    conditions: [
      "Parinaud syndrome",
      "Progressive supranuclear palsy",
      "Weber syndrome (midbrain stroke)",
      "Pineal-region tumors",
    ],
    topicHints: ["Cranial Nerves", "Pain Modulation"],
  },
  {
    id: "pons",
    name: "Pons",
    shortName: "Pons",
    system: "brainstem",
    layer: "deep",
    paired: false,
    shape: "ellipsoid",
    position: [0, -1.15, -0.05],
    scale: [0.45, 0.3, 0.4],
    displacement: 0.04,
    segments: 4,
    color: "#3FB6D9",
    overview:
      "Bulging middle segment of the brainstem. Acts as a neural switchboard — its name means 'bridge' — relaying signals between the cerebrum and cerebellum.",
    functions: [
      "Houses cranial nerve nuclei V (trigeminal), VI (abducens), VII (facial), VIII (vestibulocochlear)",
      "Pontine nuclei relay cortical input to the cerebellum",
      "Pontine respiratory centers fine-tune breathing rhythm",
      "Locus coeruleus is the brain's main source of norepinephrine",
      "REM sleep generation (pontine tegmentum)",
    ],
    neuropsych: [
      "Locus coeruleus dysfunction is implicated in depression, anxiety, and PTSD hyperarousal",
      "Ventral pontine stroke can produce locked-in syndrome — full consciousness with only vertical eye movements preserved",
      "Central pontine myelinolysis follows rapid sodium correction in alcoholic or malnourished patients",
      "Pontine reticular formation generates the 'pontine waves' of REM sleep",
    ],
    conditions: [
      "Locked-in syndrome",
      "Central pontine myelinolysis",
      "Pontine hemorrhage",
      "REM sleep behavior disorder",
    ],
    topicHints: ["Sleep Architecture", "Disorders of Consciousness"],
  },
  {
    id: "medulla",
    name: "Medulla Oblongata",
    shortName: "Medulla",
    system: "brainstem",
    layer: "deep",
    paired: false,
    shape: "ellipsoid",
    position: [0, -1.55, -0.1],
    scale: [0.3, 0.35, 0.3],
    displacement: 0.04,
    segments: 4,
    color: "#5FA8C9",
    overview:
      "Lowest segment of the brainstem, continuous with the spinal cord. Contains the autonomic centers that keep us alive — cardiac, respiratory, vasomotor, and reflex.",
    functions: [
      "Cardiac and respiratory rhythm generation",
      "Vasomotor control (blood pressure)",
      "Reflexes — coughing, swallowing, vomiting, sneezing",
      "Pyramidal decussation (motor crossover)",
      "Houses cranial nerve nuclei IX, X, XI, XII",
    ],
    neuropsych: [
      "Lateral medullary (Wallenberg) syndrome produces a classic crossed sensory pattern: ipsilateral facial / contralateral body numbness",
      "Brainstem death is defined by loss of medullary reflexes — apnea testing targets the medullary respiratory center",
      "Chronic opioid use depresses medullary respiratory drive — the mechanism of overdose death",
      "Area postrema (chemoreceptor trigger zone) is the substrate of chemotherapy-induced nausea",
    ],
    conditions: [
      "Wallenberg syndrome",
      "Brainstem death",
      "Opioid overdose (respiratory depression)",
      "Arnold-Chiari malformation",
    ],
    topicHints: ["Autonomic Function", "Substance Use Disorders"],
  },

  {
    id: "locus-coeruleus",
    name: "Locus Coeruleus",
    shortName: "Locus Coeruleus",
    system: "brainstem",
    layer: "deep",
    paired: true,
    shape: "ellipsoid",
    position: [0.12, -1.0, -0.05],
    scale: [0.07, 0.18, 0.12],
    displacement: 0.02,
    segments: 3,
    color: "#7DD8E8",
    overview:
      "Tiny pigmented nucleus in the dorsal pons, near the floor of the fourth ventricle. Despite containing only ~30,000 neurons per side, it is the brain's principal source of norepinephrine and projects to nearly every cortical region.",
    functions: [
      "Sole source of cortical norepinephrine",
      "Modulates arousal, vigilance, and the orienting response",
      "Drives the 'fight or flight' sympathetic surge",
      "Sets the gain on attention and signal-to-noise across cortex",
      "Promotes wakefulness and suppresses REM sleep",
    ],
    neuropsych: [
      "Hyperactive locus coeruleus underlies the hyperarousal cluster of PTSD — the rationale for prazosin (alpha-1 blocker) for trauma nightmares",
      "LC dysregulation contributes to the somatic anxiety response (panic, palpitations, tremor)",
      "LC is among the earliest sites of tau pathology in Alzheimer's — present decades before clinical dementia",
      "Stimulant medications for ADHD increase LC noradrenergic tone, sharpening attention",
    ],
    conditions: [
      "PTSD (hyperarousal)",
      "Panic disorder",
      "Early Alzheimer's pathology",
      "ADHD (NE dysregulation)",
    ],
    topicHints: ["Arousal & Attention Systems", "Anxiety & Trauma Disorders"],
  },

  // ──────────────── CEREBELLUM (1) ────────────────
  {
    id: "cerebellum",
    name: "Cerebellum",
    shortName: "Cerebellum",
    system: "cerebellum",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, -0.65, -1.05],
    scale: [1.35, 0.7, 0.9],
    displacement: 0.06,
    segments: 6,
    color: "#2FA0C6",
    overview:
      "The 'little brain' tucked beneath the occipital lobe and behind the brainstem. Holds more neurons than the cerebrum despite being a fraction of its size — and increasingly recognized as a contributor to cognition and emotion.",
    functions: [
      "Coordinates voluntary movement and timing",
      "Maintains posture and balance",
      "Motor learning and adaptation (e.g., adjusting to prism glasses)",
      "Cognitive sequencing and timing of thought",
      "Modulates emotional regulation (vermis)",
    ],
    neuropsych: [
      "Cerebellar Cognitive-Affective Syndrome (Schmahmann syndrome) presents with executive, visuospatial, language, and emotional changes — without classic motor signs",
      "Reduced cerebellar volume is found in autism, schizophrenia, and ADHD",
      "Tested clinically with finger-to-nose, heel-to-shin, rapid alternating movements, and tandem gait",
      "Cerebellar damage in childhood (e.g., posterior fossa surgery) impairs language and social cognition",
    ],
    conditions: [
      "Spinocerebellar ataxias",
      "Alcoholic cerebellar degeneration",
      "Cerebellar Cognitive-Affective Syndrome",
      "Posterior fossa syndrome",
    ],
    topicHints: ["Motor Learning", "Cerebellum & Cognition"],
  },

  // ──────────────── VENTRICLES (1) ────────────────
  {
    id: "lateral-ventricles",
    name: "Lateral Ventricles",
    shortName: "Ventricles",
    system: "ventricle",
    layer: "ventricle",
    paired: true,
    shape: "crescent",
    position: [0.35, 0.3, -0.1],
    scale: [0.12, 0.45, 1.0],
    displacement: 0.03,
    segments: 4,
    color: "#9DEAFF",
    overview:
      "Paired C-shaped CSF-filled cavities curving through each hemisphere. Their size and shape provide one of the most visible imaging windows into brain pathology.",
    functions: [
      "Produce and circulate cerebrospinal fluid (via choroid plexus)",
      "Provide buoyancy and shock absorption",
      "Glymphatic clearance of metabolic waste during sleep",
      "Connect to the third and fourth ventricles via the foramen of Monro",
    ],
    neuropsych: [
      "Ventricular enlargement (ex vacuo) reflects surrounding brain atrophy — used as an Alzheimer's biomarker",
      "Enlarged ventricles is one of the most replicated structural findings in schizophrenia",
      "Normal pressure hydrocephalus presents with the classic triad: gait apraxia, urinary incontinence, dementia ('wet, wobbly, wacky')",
      "Periventricular white-matter hyperintensities on MRI correlate with vascular cognitive impairment",
    ],
    conditions: [
      "Normal pressure hydrocephalus",
      "Schizophrenia (enlarged ventricles)",
      "Alzheimer's disease (ex vacuo dilation)",
      "Obstructive hydrocephalus",
    ],
    topicHints: ["Neuroimaging Findings", "Vascular Cognitive Impairment"],
  },

  // ──────────────── LANGUAGE & ASSOCIATION CORTEX (5) ────────────────
  {
    id: "broca-area",
    name: "Broca's Area",
    shortName: "Broca's",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [1.05, 0.15, 0.95],
    scale: [0.5, 0.4, 0.45],
    displacement: 0.08,
    segments: 4,
    color: "#58C9F3",
    overview:
      "A region of the inferior frontal gyrus in the dominant (usually left) hemisphere that drives the motor planning of speech. Damage produces effortful, non-fluent output with relatively preserved comprehension.",
    functions: [
      "Speech production and articulation planning",
      "Grammar and syntactic processing",
      "Sequencing the motor program for language output",
    ],
    neuropsych: [
      "Broca's (expressive) aphasia: halting, telegraphic speech with intact comprehension and frustrating awareness of the deficit",
      "Frequently co-occurs with right-sided weakness given the adjacent motor cortex",
    ],
    conditions: ["Expressive (Broca's) aphasia", "Left MCA stroke"],
    topicHints: ["Language & Aphasia", "Neuropsychology Overview"],
  },
  {
    id: "wernicke-area",
    name: "Wernicke's Area",
    shortName: "Wernicke's",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [1.2, 0.15, -0.35],
    scale: [0.5, 0.4, 0.45],
    displacement: 0.08,
    segments: 4,
    color: "#58C9F3",
    overview:
      "A region of the posterior superior temporal gyrus in the dominant hemisphere responsible for language comprehension. Damage yields fluent but meaningless speech and poor understanding.",
    functions: [
      "Comprehension of spoken and written language",
      "Mapping words onto meaning",
      "Monitoring one's own speech for sense",
    ],
    neuropsych: [
      "Wernicke's (receptive) aphasia: fluent but nonsensical speech ('word salad') with impaired comprehension and limited insight",
      "Linked to Broca's area by the arcuate fasciculus — damage to that tract causes conduction aphasia (poor repetition)",
    ],
    conditions: ["Receptive (Wernicke's) aphasia", "Left posterior temporal stroke"],
    topicHints: ["Language & Aphasia", "Neuropsychology Overview"],
  },
  {
    id: "auditory-cortex",
    name: "Primary Auditory Cortex",
    shortName: "Auditory",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [1.3, 0.2, 0.0],
    scale: [0.45, 0.35, 0.5],
    displacement: 0.07,
    segments: 4,
    color: "#58C9F3",
    overview:
      "Sitting on the superior temporal gyrus (Heschl's gyrus), this is the first cortical destination for sound. It is tonotopically organized, mapping sound frequencies across its surface.",
    functions: [
      "Processes pitch, loudness, and the timing of sound",
      "Tonotopic frequency mapping",
      "Feeds auditory input to language and association areas",
    ],
    neuropsych: [
      "Bilateral damage can cause cortical deafness or auditory agnosia despite intact ears",
      "Auditory hallucinations in schizophrenia involve aberrant activity in this region",
    ],
    conditions: ["Auditory agnosia", "Cortical deafness"],
    topicHints: ["Sensory Processing", "Neuropsychology Overview"],
  },
  {
    id: "supramarginal-gyrus",
    name: "Supramarginal Gyrus",
    shortName: "Supramarginal",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [1.15, 0.45, -0.35],
    scale: [0.45, 0.4, 0.4],
    displacement: 0.07,
    segments: 4,
    color: "#58C9F3",
    overview:
      "Part of the inferior parietal lobule wrapping the posterior end of the lateral sulcus. A hub for phonological processing, skilled movement, and integrating touch with action.",
    functions: [
      "Phonological processing of language",
      "Spatial and limb praxis (skilled movement)",
      "Integrates sensory input for the body schema",
    ],
    neuropsych: [
      "A component of Gerstmann syndrome when the dominant inferior parietal lobule is damaged",
      "Lesions contribute to ideomotor apraxia and phonological reading errors",
    ],
    conditions: ["Gerstmann syndrome", "Conduction aphasia"],
    topicHints: ["Parietal Function", "Language & Aphasia"],
  },
  {
    id: "angular-gyrus",
    name: "Angular Gyrus",
    shortName: "Angular",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [1.05, 0.5, -0.7],
    scale: [0.45, 0.4, 0.4],
    displacement: 0.07,
    segments: 4,
    color: "#58C9F3",
    overview:
      "A posterior inferior parietal region at the junction of the temporal, parietal, and occipital lobes. It binds multisensory information for reading, arithmetic, and abstract concept retrieval.",
    functions: [
      "Reading and writing (mapping symbols to meaning)",
      "Number processing and calculation",
      "Semantic memory and metaphor comprehension",
    ],
    neuropsych: [
      "Classic site of Gerstmann syndrome: agraphia, acalculia, finger agnosia, and left-right disorientation",
      "Damage can produce alexia and semantic-level reading errors",
    ],
    conditions: ["Gerstmann syndrome", "Alexia with agraphia"],
    topicHints: ["Parietal Function", "Language & Aphasia"],
  },

  // ──────────────── ADDED WHITE MATTER & MIDLINE (3) ────────────────
  {
    id: "internal-capsule",
    name: "Internal Capsule",
    shortName: "Int. Capsule",
    system: "white-matter",
    layer: "deep",
    paired: true,
    shape: "tube",
    position: [0.6, 0.1, 0.1],
    scale: [0.18, 0.6, 0.5],
    displacement: 0.03,
    segments: 4,
    color: "#BDE5FF",
    overview:
      "A compact band of white matter between the caudate/thalamus and the lentiform nucleus. It funnels nearly all motor and sensory fibers traveling between the cortex and the body.",
    functions: [
      "Carries corticospinal (motor) fibers to the body",
      "Relays thalamocortical sensory projections",
      "Conveys corticobulbar fibers to brainstem nuclei",
    ],
    neuropsych: [
      "A tiny lacunar stroke here can cause a dense pure-motor hemiparesis far out of proportion to the lesion size",
      "Disruption of frontal-subcortical loops can drive executive and emotional change",
    ],
    conditions: ["Lacunar (pure motor) stroke", "Capsular warning syndrome"],
    topicHints: ["Neuroanatomy of Stroke", "Motor Pathways"],
  },
  {
    id: "optic-chiasm",
    name: "Optic Chiasm",
    shortName: "Optic Chiasm",
    system: "white-matter",
    layer: "deep",
    paired: false,
    shape: "tube",
    position: [0, -0.55, 0.55],
    scale: [0.4, 0.12, 0.25],
    displacement: 0.02,
    segments: 4,
    color: "#BDE5FF",
    overview:
      "The X-shaped crossing where the optic nerves meet and nasal retinal fibers decussate. Its position just above the pituitary makes it vulnerable to sellar lesions.",
    functions: [
      "Crosses nasal retinal fibers to the opposite hemisphere",
      "Routes the visual field toward cortical processing",
    ],
    neuropsych: [
      "Compression (classically a pituitary adenoma) causes bitemporal hemianopia — loss of both outer visual fields",
      "The precise lesion site predicts the pattern of visual field loss",
    ],
    conditions: ["Pituitary adenoma", "Craniopharyngioma"],
    topicHints: ["Visual Pathways", "Neuroanatomy"],
  },
  {
    id: "pineal-gland",
    name: "Pineal Gland",
    shortName: "Pineal",
    system: "diencephalon",
    layer: "deep",
    paired: false,
    shape: "ellipsoid",
    position: [0, 0.0, -0.55],
    scale: [0.18, 0.18, 0.18],
    displacement: 0.02,
    segments: 3,
    color: "#3FB6D9",
    overview:
      "A small midline endocrine gland behind the thalamus that secretes melatonin in response to darkness, anchoring the body's circadian rhythm.",
    functions: [
      "Secretes melatonin to regulate the sleep-wake cycle",
      "Synchronizes circadian rhythm to the light-dark cycle",
    ],
    neuropsych: [
      "Often calcifies with age, serving as a useful midline landmark on imaging",
      "Pineal-region tumors can compress the midbrain and cause Parinaud syndrome (upgaze palsy)",
    ],
    conditions: ["Pineal tumors / pinealoma", "Circadian rhythm disruption"],
    topicHints: ["Sleep & Circadian Rhythm", "Neuroendocrine Systems"],
  },

  // ════════════════ FINE LATERAL ANATOMY — FRONTAL ════════════════
  {
    id: "superior-frontal-gyrus",
    name: "Superior Frontal Gyrus",
    shortName: "Sup. Frontal Gyrus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [0, 1.0, 1.1],
    scale: [0.5, 0.3, 0.9],
    displacement: 0.06,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "The uppermost frontal gyrus, running along the dorsomedial edge of the frontal lobe above the superior frontal sulcus. Its posterior end contains the supplementary motor area and the frontal eye fields.",
    functions: [
      "Supplementary motor planning of complex, self-initiated movement",
      "Frontal eye fields — voluntary saccades and gaze shifts",
      "Contributes to working memory and self-awareness networks",
    ],
    neuropsych: [
      "Medial SFG (SMA) lesions cause akinesia and the alien-hand phenomenon",
      "Posterior SFG damage disrupts voluntary gaze and visual search strategy",
    ],
    conditions: ["Supplementary motor area syndrome", "Frontal gaze palsy"],
    topicHints: ["Motor Pathways", "Executive Function & Frontal Lobe Syndromes"],
  },
  {
    id: "middle-frontal-gyrus",
    name: "Middle Frontal Gyrus",
    shortName: "Mid. Frontal Gyrus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [0.6, 0.7, 1.2],
    scale: [0.5, 0.3, 0.9],
    displacement: 0.06,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "The broad central frontal gyrus between the superior and inferior frontal sulci. Houses much of the dorsolateral prefrontal cortex — the executive core — and the posterior frontal eye field.",
    functions: [
      "Dorsolateral prefrontal executive control and working memory",
      "Cognitive set-shifting and planning",
      "Reorienting attention to behaviorally relevant stimuli",
    ],
    neuropsych: [
      "Lesions impair Wisconsin Card Sort and n-back performance (dysexecutive syndrome)",
      "A key rTMS target for treatment-resistant depression",
    ],
    conditions: ["Dysexecutive syndrome", "Major depressive disorder (rTMS target)"],
    topicHints: ["Executive Function & Frontal Lobe Syndromes", "Mood Disorders & Neuromodulation"],
  },
  {
    id: "inferior-frontal-gyrus",
    name: "Inferior Frontal Gyrus",
    shortName: "Inf. Frontal Gyrus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [0.9, 0.3, 1.1],
    scale: [0.5, 0.3, 0.8],
    displacement: 0.06,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "The lowest frontal gyrus, just above the lateral sulcus. On the dominant (usually left) hemisphere its posterior portions form Broca's area; it is divided into the pars opercularis, triangularis, and orbitalis.",
    functions: [
      "Speech production and grammatical processing (dominant side)",
      "Response inhibition and motor stopping (right IFG)",
      "Hierarchical sequencing of language and action",
    ],
    neuropsych: [
      "Left IFG damage produces Broca's (non-fluent, effortful) aphasia",
      "Right IFG is central to the stop-signal model of impulse control, weak in ADHD",
    ],
    conditions: ["Broca's aphasia", "Impulse-control deficits / ADHD"],
    topicHints: ["Language Processing & Aphasia", "Executive Function & Frontal Lobe Syndromes"],
  },
  {
    id: "superior-frontal-sulcus",
    name: "Superior Frontal Sulcus",
    shortName: "Sup. Frontal Sulcus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "tube",
    position: [0.3, 0.85, 1.15],
    scale: [0.05, 0.2, 0.9],
    displacement: 0.02,
    segments: 3,
    color: "#B79CF2",
    overview:
      "The groove separating the superior and middle frontal gyri. Its posterior junction is a reliable landmark for the frontal eye fields on functional imaging.",
    functions: [
      "Surface landmark bounding the superior frontal gyrus",
      "Posterior end approximates the frontal eye field",
      "Guides localization of dorsal attention regions",
    ],
    neuropsych: [
      "Used as an fMRI landmark when mapping spatial-attention and saccade networks",
      "Sulcal morphology is studied as a developmental marker in neurodevelopmental disorders",
    ],
    conditions: ["(Landmark — not a primary lesion site)"],
    topicHints: ["Neuroanatomy Landmarks", "Attention Networks"],
  },
  {
    id: "inferior-frontal-sulcus",
    name: "Inferior Frontal Sulcus",
    shortName: "Inf. Frontal Sulcus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "tube",
    position: [0.6, 0.5, 1.1],
    scale: [0.05, 0.2, 0.85],
    displacement: 0.02,
    segments: 3,
    color: "#B79CF2",
    overview:
      "The groove dividing the middle and inferior frontal gyri. A boundary marker separating dorsolateral prefrontal cortex above from the language/inhibition regions below.",
    functions: [
      "Surface landmark bounding the inferior frontal gyrus",
      "Separates executive (DLPFC) from language cortex",
      "Reference for parcellating lateral prefrontal subregions",
    ],
    neuropsych: [
      "Helps distinguish DLPFC from Broca's-area activation in language fMRI",
      "Sulcal pattern variability informs individualized cortical mapping",
    ],
    conditions: ["(Landmark — not a primary lesion site)"],
    topicHints: ["Neuroanatomy Landmarks", "Language Processing & Aphasia"],
  },
  {
    id: "precentral-gyrus",
    name: "Precentral Gyrus",
    shortName: "Precentral Gyrus",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, 1.05, 0.3],
    scale: [1.3, 0.25, 0.3],
    displacement: 0.06,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "The gyrus immediately anterior to the central sulcus, carrying the primary motor cortex (M1) and its motor homunculus. Origin of the corticospinal tract.",
    functions: [
      "Execution of voluntary movement via Betz cells",
      "Somatotopic motor map — disproportionate hand and face representation",
      "Source of the corticospinal and corticobulbar tracts",
    ],
    neuropsych: [
      "Lesions cause contralateral upper-motor-neuron weakness, spasticity, and Babinski sign",
      "Focal irritation produces a Jacksonian motor march",
    ],
    conditions: ["Middle cerebral artery stroke", "Cortical (Jacksonian) seizures"],
    topicHints: ["Motor Pathways", "Stroke Syndromes"],
  },
  {
    id: "central-sulcus",
    name: "Central Sulcus (of Rolando)",
    shortName: "Central Sulcus",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "tube",
    position: [0, 1.1, 0.1],
    scale: [0.05, 0.5, 0.4],
    displacement: 0.02,
    segments: 3,
    color: "#B79CF2",
    overview:
      "The deep fissure dividing the frontal lobe from the parietal lobe — and the motor cortex (in front) from the somatosensory cortex (behind). The single most important cortical landmark.",
    functions: [
      "Separates the precentral (motor) from postcentral (sensory) gyrus",
      "Marks the frontal–parietal boundary",
      "Primary reference for localizing the sensorimotor strip",
    ],
    neuropsych: [
      "Identifying the central sulcus is the first step in pre-surgical sensorimotor mapping",
      "Its 'inverted omega' hand knob localizes the motor hand area",
    ],
    conditions: ["(Landmark — guides peri-Rolandic surgical planning)"],
    topicHints: ["Neuroanatomy Landmarks", "Motor Pathways"],
  },
  {
    id: "pars-opercularis",
    name: "Pars Opercularis",
    shortName: "Pars Opercularis",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [1.0, 0.25, 0.7],
    scale: [0.25, 0.2, 0.25],
    displacement: 0.04,
    segments: 3,
    color: "#3FB6D9",
    overview:
      "The posterior cap of the inferior frontal gyrus (Brodmann 44). Together with the pars triangularis it forms Broca's area on the dominant hemisphere.",
    functions: [
      "Articulatory and phonological assembly of speech",
      "Syntactic processing (with pars triangularis)",
      "Part of the mirror-neuron system for action understanding",
    ],
    neuropsych: [
      "Damage contributes to the effortful, agrammatic output of Broca's aphasia",
      "Activated during covert speech and verbal working-memory rehearsal",
    ],
    conditions: ["Broca's aphasia", "Apraxia of speech"],
    topicHints: ["Language Processing & Aphasia", "Executive Function & Frontal Lobe Syndromes"],
  },
  {
    id: "pars-triangularis",
    name: "Pars Triangularis",
    shortName: "Pars Triangularis",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [1.05, 0.2, 0.95],
    scale: [0.25, 0.2, 0.25],
    displacement: 0.04,
    segments: 3,
    color: "#3FB6D9",
    overview:
      "The wedge-shaped middle subdivision of the inferior frontal gyrus (Brodmann 45), the anterior half of Broca's area.",
    functions: [
      "Semantic selection and controlled retrieval of words",
      "Syntactic and grammatical processing",
      "Integration of meaning during sentence comprehension",
    ],
    neuropsych: [
      "Implicated in verbal fluency tasks (FAS, category fluency)",
      "Hypoactivation is associated with word-finding difficulty in aphasia and dementia",
    ],
    conditions: ["Broca's / transcortical motor aphasia", "Primary progressive aphasia"],
    topicHints: ["Language Processing & Aphasia", "Neurodegeneration"],
  },
  {
    id: "pars-orbitalis",
    name: "Pars Orbitalis",
    shortName: "Pars Orbitalis",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [1.0, 0.0, 1.1],
    scale: [0.25, 0.2, 0.25],
    displacement: 0.04,
    segments: 3,
    color: "#3FB6D9",
    overview:
      "The anterior-inferior subdivision of the inferior frontal gyrus (Brodmann 47), transitioning toward the orbitofrontal surface.",
    functions: [
      "Semantic processing and controlled language retrieval",
      "Bridges language cortex with orbitofrontal valuation",
      "Contributes to emotional prosody comprehension",
    ],
    neuropsych: [
      "Engaged in tasks requiring effortful semantic selection",
      "Atrophy here features in the semantic variant of primary progressive aphasia",
    ],
    conditions: ["Semantic dementia", "Aphasia syndromes"],
    topicHints: ["Language Processing & Aphasia", "Decision Making & Reward"],
  },
  {
    id: "frontal-pole",
    name: "Frontal Pole",
    shortName: "Frontal Pole",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, 0.4, 1.9],
    scale: [0.5, 0.45, 0.3],
    displacement: 0.05,
    segments: 4,
    color: "#F2B66B",
    overview:
      "The anterior tip of the frontal lobe (Brodmann 10) — the most anterior and evolutionarily newest cortex. Supports the highest-order integration of goals and self-generated thought.",
    functions: [
      "Prospective memory and multitasking (holding goals while doing subtasks)",
      "Metacognition and self-monitoring",
      "Abstract reasoning and relational integration",
    ],
    neuropsych: [
      "Lesions impair multitasking despite intact basic executive tests (the 'Multiple Errands' deficit)",
      "Particularly vulnerable in traumatic brain injury and behavioral-variant FTD",
    ],
    conditions: ["Traumatic brain injury", "Frontotemporal dementia (behavioral variant)"],
    topicHints: ["Executive Function & Frontal Lobe Syndromes", "Traumatic Brain Injury"],
  },

  // ════════════════ FINE LATERAL ANATOMY — PARIETAL ════════════════
  {
    id: "postcentral-gyrus",
    name: "Postcentral Gyrus",
    shortName: "Postcentral Gyrus",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, 1.05, -0.1],
    scale: [1.3, 0.25, 0.3],
    displacement: 0.06,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "The gyrus immediately behind the central sulcus, carrying the primary somatosensory cortex (S1) and its sensory homunculus. Receives touch, proprioception, and temperature from the contralateral body.",
    functions: [
      "Conscious perception of touch, vibration, and proprioception",
      "Somatotopic sensory map mirroring the motor homunculus",
      "Two-point discrimination and stereognosis",
    ],
    neuropsych: [
      "Lesions cause contralateral cortical sensory loss with preserved crude touch",
      "Tested by stereognosis, graphesthesia, and double-simultaneous stimulation (extinction)",
    ],
    conditions: ["Cortical sensory loss", "Sensory seizures"],
    topicHints: ["Sensory Pathways", "Cortical Mapping"],
  },
  {
    id: "superior-parietal-lobule",
    name: "Superior Parietal Lobule",
    shortName: "Sup. Parietal Lobule",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [0.6, 1.0, -0.7],
    scale: [0.5, 0.3, 0.6],
    displacement: 0.06,
    segments: 4,
    color: "#F49AC0",
    overview:
      "The upper parietal region above the intraparietal sulcus (Brodmann 5/7). A core node of the dorsal 'where/how' stream for spatial attention and visually guided action.",
    functions: [
      "Visuospatial attention and spatial working memory",
      "Visually guided reaching and grasping",
      "Integration of body position with the external world",
    ],
    neuropsych: [
      "Damage contributes to optic ataxia and impaired reaching under visual guidance",
      "Bilateral lesions are part of Bálint syndrome (simultanagnosia, optic ataxia, ocular apraxia)",
    ],
    conditions: ["Bálint syndrome", "Optic ataxia"],
    topicHints: ["Visuospatial Processing", "Apraxia & Agnosia"],
  },
  {
    id: "inferior-parietal-lobule",
    name: "Inferior Parietal Lobule",
    shortName: "Inf. Parietal Lobule",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [0.9, 0.7, -0.9],
    scale: [0.5, 0.3, 0.5],
    displacement: 0.06,
    segments: 4,
    color: "#F49AC0",
    overview:
      "The lower parietal region below the intraparietal sulcus, comprising the supramarginal and angular gyri. A multimodal convergence zone for language, number, and the body schema.",
    functions: [
      "Cross-modal integration of language, space, and number",
      "Tool use and gesture (praxis)",
      "Part of the temporoparietal junction for social cognition",
    ],
    neuropsych: [
      "Left-side damage yields Gerstmann syndrome (agraphia, acalculia, finger agnosia, L/R confusion)",
      "Right-side damage produces hemispatial neglect",
    ],
    conditions: ["Gerstmann syndrome", "Hemispatial neglect"],
    topicHints: ["Apraxia & Agnosia", "Visuospatial Processing"],
  },
  {
    id: "intraparietal-sulcus",
    name: "Intraparietal Sulcus",
    shortName: "Intraparietal Sulcus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "tube",
    position: [0.7, 0.85, -0.8],
    scale: [0.05, 0.2, 0.6],
    displacement: 0.02,
    segments: 3,
    color: "#B79CF2",
    overview:
      "The groove dividing the superior and inferior parietal lobules. Its banks form the human homologue of the macaque parietal reach and attention regions.",
    functions: [
      "Top-down control of spatial attention (dorsal attention network)",
      "Numerical magnitude representation",
      "Coordinate transformations for eye and hand movements",
    ],
    neuropsych: [
      "Activity here scales with attentional load and number comparison",
      "Disruption is linked to dyscalculia and attentional deficits",
    ],
    conditions: ["Developmental dyscalculia", "Attention disorders"],
    topicHints: ["Attention Networks", "Visuospatial Processing"],
  },

  // ════════════════ FINE LATERAL ANATOMY — TEMPORAL ════════════════
  {
    id: "superior-temporal-gyrus",
    name: "Superior Temporal Gyrus",
    shortName: "Sup. Temporal Gyrus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [1.3, 0.1, 0.2],
    scale: [0.45, 0.25, 1.1],
    rotation: [0, 0, -0.15],
    displacement: 0.06,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "The uppermost temporal gyrus bordering the lateral sulcus. Contains the primary auditory cortex (Heschl's gyrus) and, posteriorly on the dominant side, Wernicke's area.",
    functions: [
      "Primary and association auditory processing",
      "Receptive language and speech-sound analysis (dominant side)",
      "Voice and prosody perception",
    ],
    neuropsych: [
      "Posterior left STG damage produces Wernicke's (fluent, paraphasic) aphasia",
      "STG abnormalities are among the most replicated findings in schizophrenia (auditory hallucinations)",
    ],
    conditions: ["Wernicke's aphasia", "Schizophrenia (auditory hallucinations)"],
    topicHints: ["Language Processing & Aphasia", "Psychotic Disorders"],
  },
  {
    id: "middle-temporal-gyrus",
    name: "Middle Temporal Gyrus",
    shortName: "Mid. Temporal Gyrus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [1.4, -0.2, 0.2],
    scale: [0.45, 0.25, 1.1],
    rotation: [0, 0, -0.15],
    displacement: 0.06,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "The central temporal gyrus between the superior and inferior temporal sulci. A hub for semantic memory, lexical retrieval, and the visual motion area (V5/MT) at its posterior end.",
    functions: [
      "Lexical-semantic knowledge and word meaning",
      "Visual motion perception (area MT/V5)",
      "Integration of language with conceptual knowledge",
    ],
    neuropsych: [
      "Posterior MTV5 damage causes akinetopsia (motion blindness)",
      "Degeneration contributes to anomia and semantic loss in dementia",
    ],
    conditions: ["Akinetopsia", "Semantic dementia"],
    topicHints: ["Language Processing & Aphasia", "Visual System & Agnosia"],
  },
  {
    id: "inferior-temporal-gyrus",
    name: "Inferior Temporal Gyrus",
    shortName: "Inf. Temporal Gyrus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [1.4, -0.5, 0.2],
    scale: [0.45, 0.25, 1.1],
    rotation: [0, 0, -0.15],
    displacement: 0.06,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "The lowest gyrus on the lateral temporal surface, part of the ventral 'what' stream for high-level visual recognition of objects and forms.",
    functions: [
      "High-level visual object recognition (ventral stream)",
      "Form and feature integration into recognizable wholes",
      "Links visual percepts to semantic knowledge",
    ],
    neuropsych: [
      "Damage contributes to visual (associative) agnosia",
      "Part of the ventral pathway disrupted in posterior cortical atrophy",
    ],
    conditions: ["Visual agnosia", "Posterior cortical atrophy"],
    topicHints: ["Visual System & Agnosia", "Memory Systems"],
  },
  {
    id: "superior-temporal-sulcus",
    name: "Superior Temporal Sulcus",
    shortName: "Sup. Temporal Sulcus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "tube",
    position: [1.35, -0.05, 0.2],
    scale: [0.05, 0.2, 1.1],
    rotation: [0, 0, -0.15],
    displacement: 0.02,
    segments: 3,
    color: "#B79CF2",
    overview:
      "The long groove between the superior and middle temporal gyri. A central hub of the 'social brain' for processing biological motion and others' intentions.",
    functions: [
      "Perception of biological motion and gaze direction",
      "Theory of mind and intention attribution",
      "Multisensory (audiovisual) speech integration",
    ],
    neuropsych: [
      "Dysfunction is implicated in the social-perception deficits of autism spectrum disorder",
      "Activity tracks the perceived animacy and intentionality of stimuli",
    ],
    conditions: ["Autism spectrum disorder", "Social cognition deficits"],
    topicHints: ["Social Cognition", "Language Processing & Aphasia"],
  },
  {
    id: "inferior-temporal-sulcus",
    name: "Inferior Temporal Sulcus",
    shortName: "Inf. Temporal Sulcus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "tube",
    position: [1.4, -0.35, 0.2],
    scale: [0.05, 0.2, 1.05],
    rotation: [0, 0, -0.15],
    displacement: 0.02,
    segments: 3,
    color: "#B79CF2",
    overview:
      "The groove dividing the middle and inferior temporal gyri — a surface landmark on the lateral temporal lobe bordering the ventral visual stream.",
    functions: [
      "Surface landmark bounding the inferior temporal gyrus",
      "Borders ventral-stream object-recognition cortex",
      "Reference for parcellating lateral temporal regions",
    ],
    neuropsych: [
      "Used as an anatomical landmark in temporal-lobe surgical planning",
      "Sulcal depth here is studied in neurodevelopmental imaging",
    ],
    conditions: ["(Landmark — not a primary lesion site)"],
    topicHints: ["Neuroanatomy Landmarks", "Visual System & Agnosia"],
  },
  {
    id: "lateral-sulcus",
    name: "Lateral Sulcus (Sylvian Fissure)",
    shortName: "Lateral Sulcus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "tube",
    position: [1.2, 0.25, 0.4],
    scale: [0.05, 0.3, 1.0],
    rotation: [0, 0, -0.1],
    displacement: 0.02,
    segments: 3,
    color: "#B79CF2",
    overview:
      "The deep, prominent fissure separating the frontal and parietal lobes from the temporal lobe. The insula lies hidden in its depths, and the middle cerebral artery runs within it.",
    functions: [
      "Separates the temporal lobe from the frontal and parietal lobes",
      "Overlies the buried insular cortex",
      "Houses the middle cerebral artery and its branches",
    ],
    neuropsych: [
      "A key landmark for localizing peri-Sylvian language cortex (Broca's and Wernicke's areas)",
      "MCA strokes within it cause the classic aphasia-plus-hemiparesis syndromes",
    ],
    conditions: ["Middle cerebral artery stroke", "Peri-Sylvian aphasias"],
    topicHints: ["Neuroanatomy Landmarks", "Stroke Syndromes"],
  },
  {
    id: "temporal-pole",
    name: "Temporal Pole",
    shortName: "Temporal Pole",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [1.5, -0.2, 1.2],
    scale: [0.4, 0.4, 0.4],
    displacement: 0.05,
    segments: 4,
    color: "#F2B66B",
    overview:
      "The rounded anterior tip of the temporal lobe (Brodmann 38). A convergence zone binding sensory experience with emotion and social meaning — sometimes called the 'semantic hub.'",
    functions: [
      "Amodal semantic integration (the 'hub' of the hub-and-spoke model)",
      "Linking concepts to emotional and social significance",
      "Person-identity and famous-face knowledge",
    ],
    neuropsych: [
      "Bilateral atrophy is the signature of semantic dementia — loss of word and object meaning",
      "Highly susceptible in temporal-lobe epilepsy and herpes encephalitis",
    ],
    conditions: ["Semantic dementia", "Temporal-lobe epilepsy"],
    topicHints: ["Memory Systems", "Language Processing & Aphasia"],
  },

  // ════════════════ FINE LATERAL ANATOMY — OCCIPITAL ════════════════
  {
    id: "occipital-pole",
    name: "Occipital Pole",
    shortName: "Occipital Pole",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, 0.5, -2.0],
    scale: [0.5, 0.5, 0.3],
    displacement: 0.05,
    segments: 4,
    color: "#F2B66B",
    overview:
      "The posterior tip of the occipital lobe, containing the foveal (central-vision) representation of the primary visual cortex.",
    functions: [
      "Central (foveal) visual field representation in V1",
      "High-acuity detail and reading vision",
      "Gateway to the dorsal and ventral visual streams",
    ],
    neuropsych: [
      "Watershed location — vulnerable to hypotensive injury causing macular-sparing/involving field loss",
      "PCA strokes here produce homonymous hemianopia, often with macular sparing",
    ],
    conditions: ["Posterior cerebral artery stroke", "Cortical visual impairment"],
    topicHints: ["Visual System & Agnosia", "Vascular Syndromes"],
  },
  {
    id: "lateral-occipital-cortex",
    name: "Lateral Occipital Cortex",
    shortName: "Lat. Occipital Cortex",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [0.8, 0.4, -1.6],
    scale: [0.4, 0.4, 0.4],
    displacement: 0.05,
    segments: 4,
    color: "#3FB6D9",
    overview:
      "Higher-order visual cortex on the lateral occipital surface (the lateral occipital complex), specialized for recognizing object shape.",
    functions: [
      "Object-shape and form recognition",
      "Figure-ground segmentation",
      "Bridges early visual areas with the ventral 'what' stream",
    ],
    neuropsych: [
      "Damage contributes to apperceptive visual agnosia (failure to perceive whole forms)",
      "Activity distinguishes objects from scrambled images in fMRI",
    ],
    conditions: ["Apperceptive agnosia", "Visual object recognition deficits"],
    topicHints: ["Visual System & Agnosia", "Apraxia & Agnosia"],
  },

  // ════════════════ FINE LATERAL ANATOMY — CEREBELLUM & BRAINSTEM ════════════════
  {
    id: "cerebellar-hemisphere",
    name: "Cerebellar Hemisphere",
    shortName: "Cerebellar Hemisphere",
    system: "cerebellum",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [1.0, -1.2, -1.2],
    scale: [0.7, 0.6, 0.6],
    displacement: 0.05,
    segments: 4,
    color: "#FF98A8",
    overview:
      "The large lateral lobe of the cerebellum flanking the vermis. The lateral (neocerebellar) zones coordinate the timing and precision of skilled limb movement and contribute to cognition.",
    functions: [
      "Coordination and timing of skilled, ipsilateral limb movement",
      "Motor learning and error correction",
      "Cerebellar contribution to language, working memory, and affect",
    ],
    neuropsych: [
      "Hemisphere lesions cause ipsilateral ataxia, dysmetria, and intention tremor",
      "Posterior-lobe damage produces the cerebellar cognitive-affective syndrome (Schmahmann)",
    ],
    conditions: ["Cerebellar ataxia", "Cerebellar cognitive-affective syndrome"],
    topicHints: ["Motor Pathways", "Cerebellar Function & Ataxia"],
  },
  {
    id: "cerebellar-folia",
    name: "Cerebellar Folia",
    shortName: "Cerebellar Folia",
    system: "cerebellum",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0.9, -1.3, -1.4],
    scale: [0.5, 0.4, 0.4],
    displacement: 0.03,
    segments: 4,
    color: "#FF98A8",
    overview:
      "The fine, parallel ridges of cerebellar cortex. Their tight folding packs an enormous surface area — and the bulk of the brain's neurons — into a compact volume.",
    functions: [
      "Vastly expand cerebellar cortical surface area",
      "House the uniform granule–Purkinje cell microcircuit",
      "Give the cerebellum its 'tree of life' (arbor vitae) appearance",
    ],
    neuropsych: [
      "Foliar atrophy on MRI is a hallmark of the spinocerebellar ataxias",
      "Purkinje-cell loss within the folia underlies alcoholic cerebellar degeneration",
    ],
    conditions: ["Spinocerebellar ataxia", "Alcoholic cerebellar degeneration"],
    topicHints: ["Cerebellar Function & Ataxia", "Substance-Related Cognitive Disorders"],
  },
  {
    id: "horizontal-fissure",
    name: "Horizontal Fissure",
    shortName: "Horizontal Fissure",
    system: "cerebellum",
    layer: "cortex",
    paired: false,
    shape: "tube",
    position: [1.0, -1.25, -1.3],
    scale: [0.05, 0.1, 0.7],
    displacement: 0.02,
    segments: 3,
    color: "#B79CF2",
    overview:
      "The deepest fissure of the cerebellum, encircling each hemisphere and dividing the superior from the inferior surface — a useful landmark separating cerebellar lobes.",
    functions: [
      "Divides the superior and inferior cerebellar surfaces",
      "Landmark separating the posterior-lobe lobules",
      "Reference for cerebellar lobular parcellation",
    ],
    neuropsych: [
      "Used as a landmark when localizing cerebellar lesions on imaging",
      "Bounds the posterior lobe most associated with cognition and affect",
    ],
    conditions: ["(Landmark — not a primary lesion site)"],
    topicHints: ["Neuroanatomy Landmarks", "Cerebellar Function & Ataxia"],
  },
  {
    id: "spinal-cord",
    name: "Spinal Cord",
    shortName: "Spinal Cord",
    system: "brainstem",
    layer: "deep",
    paired: false,
    shape: "tube",
    position: [0, -1.8, -0.2],
    scale: [0.2, 0.8, 0.2],
    displacement: 0.03,
    segments: 4,
    color: "#F2D06B",
    overview:
      "The continuation of the medulla below the foramen magnum. The central highway carrying motor commands down and sensory signals up, and the seat of spinal reflexes.",
    functions: [
      "Conducts ascending sensory and descending motor tracts",
      "Mediates stretch and withdrawal reflexes",
      "Houses autonomic (sympathetic/parasympathetic) outflow",
    ],
    neuropsych: [
      "Cord lesions dissociate motor, pain/temperature, and proprioceptive pathways (e.g. Brown-Séquard)",
      "Dorsal-column disease impairs proprioception, producing sensory ataxia",
    ],
    conditions: ["Spinal cord injury", "Subacute combined degeneration (B12)"],
    topicHints: ["Motor Pathways", "Sensory Pathways"],
  },

  // ════════════════ FINE MEDIAL / MIDSAGITTAL ANATOMY ════════════════
  {
    id: "cingulate-gyrus",
    name: "Cingulate Gyrus",
    shortName: "Cingulate Gyrus",
    system: "limbic",
    layer: "cortex",
    paired: false,
    shape: "arch",
    position: [0, 0.6, 0.0],
    scale: [0.2, 0.5, 1.3],
    displacement: 0.05,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "The long arched gyrus wrapping around the corpus callosum on the medial surface. The cortical backbone of the limbic system, spanning the anterior (emotional) and posterior (default-mode) cingulate.",
    functions: [
      "Links emotion, cognition, and autonomic control",
      "Conflict and error monitoring (anterior portion)",
      "Self-referential thought and memory (posterior portion)",
    ],
    neuropsych: [
      "Anterior cingulate damage can cause akinetic mutism and apathy",
      "Cingulate dysfunction features in depression, OCD, and chronic pain",
    ],
    conditions: ["Treatment-resistant depression", "OCD"],
    topicHints: ["Default Mode Network", "Mood Disorders & Neuromodulation"],
  },
  {
    id: "cingulate-sulcus",
    name: "Cingulate Sulcus",
    shortName: "Cingulate Sulcus",
    system: "limbic",
    layer: "cortex",
    paired: false,
    shape: "tube",
    position: [0, 0.85, 0.0],
    scale: [0.05, 0.2, 1.2],
    displacement: 0.02,
    segments: 3,
    color: "#B79CF2",
    overview:
      "The groove arching above the cingulate gyrus, separating it from the superior frontal gyrus and the paracentral lobule on the medial surface.",
    functions: [
      "Separates the cingulate gyrus from the medial frontal cortex",
      "Its marginal branch is a landmark for the paracentral lobule",
      "Reference for locating medial sensorimotor cortex",
    ],
    neuropsych: [
      "The marginal ramus helps localize the central sulcus on midline imaging",
      "Used in parcellating cingulate subregions for connectivity studies",
    ],
    conditions: ["(Landmark — not a primary lesion site)"],
    topicHints: ["Neuroanatomy Landmarks", "Default Mode Network"],
  },
  {
    id: "calcarine-sulcus",
    name: "Calcarine Sulcus",
    shortName: "Calcarine Sulcus",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "tube",
    position: [0, 0.5, -1.6],
    scale: [0.05, 0.2, 0.6],
    displacement: 0.02,
    segments: 3,
    color: "#B79CF2",
    overview:
      "The deep medial occipital groove that houses the primary visual cortex (V1). Its banks above and below carry the lower and upper contralateral visual quadrants.",
    functions: [
      "Site of the primary visual cortex (striate cortex, V1)",
      "Retinotopic map of the contralateral visual field",
      "Splits upper (lingual) and lower (cuneus) field representation",
    ],
    neuropsych: [
      "Lesions cause homonymous hemianopia; partial lesions cause quadrantanopia",
      "Bilateral calcarine damage produces cortical blindness (± Anton syndrome)",
    ],
    conditions: ["Homonymous hemianopia", "Cortical blindness / Anton syndrome"],
    topicHints: ["Visual System & Agnosia", "Vascular Syndromes"],
  },
  {
    id: "parieto-occipital-sulcus",
    name: "Parieto-Occipital Sulcus",
    shortName: "Parieto-Occ. Sulcus",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "tube",
    position: [0, 0.9, -1.3],
    scale: [0.05, 0.4, 0.3],
    displacement: 0.02,
    segments: 3,
    color: "#B79CF2",
    overview:
      "The deep medial fissure marking the boundary between the parietal and occipital lobes. With the calcarine sulcus it bounds the wedge-shaped cuneus.",
    functions: [
      "Separates the parietal lobe from the occipital lobe medially",
      "Bounds the cuneus and precuneus",
      "Landmark for the medial parieto-occipital cortex",
    ],
    neuropsych: [
      "Used to delineate occipital from parietal contributions on imaging",
      "Borders precuneus regions implicated in consciousness and self-processing",
    ],
    conditions: ["(Landmark — not a primary lesion site)"],
    topicHints: ["Neuroanatomy Landmarks", "Visuospatial Processing"],
  },
  {
    id: "cuneus",
    name: "Cuneus",
    shortName: "Cuneus",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, 0.8, -1.6],
    scale: [0.3, 0.4, 0.3],
    displacement: 0.04,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "The wedge of medial occipital cortex between the calcarine and parieto-occipital sulci. Processes the lower contralateral visual field as part of the extended visual cortex.",
    functions: [
      "Visual processing of the lower contralateral visual field",
      "Basic feature and visual-attention modulation",
      "Relays to higher visual association areas",
    ],
    neuropsych: [
      "Lesions contribute to an inferior quadrantanopia",
      "Altered cuneus activity is reported in depression and migraine with aura",
    ],
    conditions: ["Quadrantanopia", "Visual processing disturbance"],
    topicHints: ["Visual System & Agnosia", "Vascular Syndromes"],
  },
  {
    id: "precuneus",
    name: "Precuneus",
    shortName: "Precuneus",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, 1.0, -1.1],
    scale: [0.3, 0.4, 0.4],
    displacement: 0.04,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "The medial parietal cortex in front of the parieto-occipital sulcus. A richly connected core of the default-mode network central to self-awareness and episodic memory.",
    functions: [
      "Self-referential processing and first-person perspective taking",
      "Episodic memory retrieval and mental imagery",
      "Hub of the default-mode network and conscious awareness",
    ],
    neuropsych: [
      "Among the first regions to lose metabolism in early Alzheimer's disease",
      "Deactivates under anesthesia and in disorders of consciousness",
    ],
    conditions: ["Alzheimer's disease", "Disorders of consciousness"],
    topicHints: ["Default Mode Network", "Neurodegeneration"],
  },
  {
    id: "paracentral-lobule",
    name: "Paracentral Lobule",
    shortName: "Paracentral Lobule",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "lobe",
    position: [0, 1.15, -0.1],
    scale: [0.3, 0.3, 0.4],
    displacement: 0.04,
    segments: 4,
    color: "#F49AC0",
    overview:
      "The medial extension of the pre- and postcentral gyri, wrapping over the top of the hemisphere. Contains the motor and sensory representation of the contralateral lower limb and the cortical control of continence.",
    functions: [
      "Motor and sensory control of the contralateral leg and foot",
      "Voluntary control of bladder and bowel sphincters",
      "Medial somatotopic continuation of the sensorimotor strip",
    ],
    neuropsych: [
      "Lesions (e.g. parasagittal meningioma, ACA stroke) cause leg-predominant weakness",
      "Bilateral involvement produces urinary incontinence",
    ],
    conditions: ["Anterior cerebral artery stroke", "Parasagittal meningioma"],
    topicHints: ["Motor Pathways", "Stroke Syndromes"],
  },
  {
    id: "lingual-gyrus",
    name: "Lingual Gyrus",
    shortName: "Lingual Gyrus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [0.4, 0.1, -1.5],
    scale: [0.35, 0.25, 0.5],
    displacement: 0.04,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "A medial occipitotemporal gyrus below the calcarine sulcus, part of the ventral visual stream. Processes the upper contralateral visual field and complex visual features like words and color.",
    functions: [
      "Visual processing of the upper contralateral visual field",
      "Word-form and letter recognition (with adjacent fusiform)",
      "Color and complex feature analysis",
    ],
    neuropsych: [
      "Lesions contribute to superior quadrantanopia and pure alexia",
      "Implicated in visual memory and dream imagery",
    ],
    conditions: ["Superior quadrantanopia", "Pure alexia"],
    topicHints: ["Visual System & Agnosia", "Language Processing & Aphasia"],
  },

  // ════════════════ FINE VENTRAL ANATOMY ════════════════
  {
    id: "gyrus-rectus",
    name: "Gyrus Rectus",
    shortName: "Gyrus Rectus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [0.2, -0.3, 1.6],
    scale: [0.25, 0.2, 0.6],
    displacement: 0.04,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "The straight gyrus on the medial orbital (ventral) surface of the frontal lobe, beside the olfactory tract. Part of the ventromedial prefrontal cortex governing emotion and social behavior.",
    functions: [
      "Ventromedial prefrontal valuation and emotion regulation",
      "Social and moral decision-making",
      "Autonomic correlates of emotional states",
    ],
    neuropsych: [
      "Damage (e.g. anterior communicating artery aneurysm) causes disinhibition and confabulation",
      "Part of the vmPFC network linked to the Iowa Gambling Task",
    ],
    conditions: ["ACoA aneurysm syndrome", "Orbitofrontal injury / disinhibition"],
    topicHints: ["Decision Making & Reward", "Personality Disorders"],
  },
  {
    id: "fusiform-gyrus",
    name: "Fusiform Gyrus",
    shortName: "Fusiform Gyrus",
    system: "cortex",
    layer: "cortex",
    paired: true,
    shape: "lobe",
    position: [0.7, -0.55, -0.3],
    scale: [0.35, 0.25, 0.9],
    displacement: 0.04,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "An occipitotemporal gyrus on the ventral surface, home to the fusiform face area and the visual word-form area. The high-level recognition engine of the ventral stream.",
    functions: [
      "Face recognition (fusiform face area)",
      "Visual word-form recognition for fluent reading",
      "Category-specific recognition of objects and bodies",
    ],
    neuropsych: [
      "Right-side damage produces prosopagnosia (face blindness)",
      "Left-side damage to the visual word-form area causes pure alexia",
    ],
    conditions: ["Prosopagnosia", "Pure alexia"],
    topicHints: ["Visual System & Agnosia", "Language Processing & Aphasia"],
  },
  {
    id: "parahippocampal-gyrus",
    name: "Parahippocampal Gyrus",
    shortName: "Parahippocampal Gyrus",
    system: "limbic",
    layer: "cortex",
    paired: true,
    shape: "crescent",
    position: [0.9, -0.45, -0.1],
    scale: [0.3, 0.25, 0.8],
    displacement: 0.04,
    segments: 4,
    color: "#8AB4FF",
    overview:
      "The medial temporal gyrus wrapping around the hippocampus, including the entorhinal cortex and the parahippocampal place area. The principal cortical gateway into the hippocampal memory system.",
    functions: [
      "Relays neocortical input to and from the hippocampus (entorhinal cortex)",
      "Encoding of spatial context and scenes (place area)",
      "Recognition memory for environmental context",
    ],
    neuropsych: [
      "Entorhinal cortex shows the earliest neurofibrillary tangles in Alzheimer's disease",
      "Damage contributes to topographical disorientation and amnesia",
    ],
    conditions: ["Alzheimer's disease (entorhinal onset)", "Temporal-lobe epilepsy"],
    topicHints: ["Memory Systems", "Neurodegeneration"],
  },
  {
    id: "uncus",
    name: "Uncus",
    shortName: "Uncus",
    system: "limbic",
    layer: "subcortical",
    paired: true,
    shape: "crescent",
    position: [0.8, -0.4, 0.4],
    scale: [0.2, 0.2, 0.25],
    displacement: 0.03,
    segments: 3,
    color: "#8AB4FF",
    overview:
      "The hooked anteromedial tip of the parahippocampal gyrus, overlying the amygdala. It carries primary olfactory cortex and sits at the edge of the tentorial notch.",
    functions: [
      "Primary olfactory (piriform) cortex",
      "Links smell with emotion and memory via the amygdala",
      "Part of the medial temporal memory circuitry",
    ],
    neuropsych: [
      "Seizure foci here cause 'uncinate fits' with olfactory/gustatory hallucinations",
      "Uncal herniation compresses CN III and the midbrain — a neurosurgical emergency",
    ],
    conditions: ["Temporal-lobe epilepsy (uncinate seizures)", "Uncal herniation"],
    topicHints: ["Memory Systems", "Emotion & Fear Learning"],
  },
  {
    id: "olfactory-bulb",
    name: "Olfactory Bulb & Tract",
    shortName: "Olfactory Bulb",
    system: "limbic",
    layer: "deep",
    paired: true,
    shape: "tube",
    position: [0.2, -0.4, 1.4],
    scale: [0.12, 0.12, 0.8],
    displacement: 0.02,
    segments: 3,
    color: "#7E8CE8",
    overview:
      "The flattened bulb and tract on the ventral frontal surface that carry the sense of smell. The only sensory pathway that reaches the cortex without first relaying through the thalamus.",
    functions: [
      "First relay for olfactory signals from the nasal epithelium",
      "Direct projection to piriform cortex and amygdala",
      "Adult neurogenesis site (rodent; debated in humans)",
    ],
    neuropsych: [
      "Anosmia is an early non-motor marker of Parkinson's and Alzheimer's disease",
      "Olfactory-groove meningiomas can cause anosmia with frontal personality change",
    ],
    conditions: ["Hyposmia/anosmia in neurodegeneration", "Olfactory-groove meningioma"],
    topicHints: ["Neurodegeneration", "Emotion & Interoception"],
  },

  // ════════════════ FINE DORSAL ANATOMY ════════════════
  {
    id: "longitudinal-fissure",
    name: "Longitudinal Fissure",
    shortName: "Longitudinal Fissure",
    system: "cortex",
    layer: "cortex",
    paired: false,
    shape: "tube",
    position: [0, 1.2, 0.0],
    scale: [0.05, 0.3, 1.6],
    displacement: 0.02,
    segments: 3,
    color: "#B79CF2",
    overview:
      "The deep midline cleft dividing the two cerebral hemispheres, into which the falx cerebri descends. The corpus callosum bridges across its floor.",
    functions: [
      "Separates the left and right cerebral hemispheres",
      "Holds the falx cerebri dural fold",
      "Floor is crossed by the corpus callosum",
    ],
    neuropsych: [
      "A central landmark for assessing midline shift on imaging after mass lesions",
      "Falcine meningiomas arise along it and may cause bilateral leg weakness",
    ],
    conditions: ["Midline shift (mass effect)", "Falcine meningioma"],
    topicHints: ["Neuroanatomy Landmarks", "Stroke Syndromes"],
  },

  // ════════════════ FINE CORONAL ANATOMY ════════════════
  {
    id: "claustrum",
    name: "Claustrum",
    shortName: "Claustrum",
    system: "basal-ganglia",
    layer: "deep",
    paired: true,
    shape: "tube",
    position: [0.95, 0.0, 0.2],
    scale: [0.04, 0.4, 0.5],
    displacement: 0.02,
    segments: 3,
    color: "#7E8CE8",
    overview:
      "A thin sheet of grey matter between the insula and the putamen, separated by the external and extreme capsules. One of the most densely connected structures in the brain, with proposed roles in awareness.",
    functions: [
      "Widespread reciprocal connections with nearly all cortex",
      "Proposed role in coordinating conscious perception",
      "Cross-modal binding and salience integration",
    ],
    neuropsych: [
      "Electrical stimulation near the claustrum has been reported to interrupt consciousness",
      "Implicated as a target in seizures and disorders of awareness research",
    ],
    conditions: ["(Research target — consciousness & epilepsy)"],
    topicHints: ["Disorders of Consciousness", "Neuroanatomy Landmarks"],
  },
  {
    id: "external-capsule",
    name: "External Capsule",
    shortName: "External Capsule",
    system: "white-matter",
    layer: "deep",
    paired: true,
    shape: "tube",
    position: [0.9, 0.0, 0.1],
    scale: [0.04, 0.5, 0.5],
    displacement: 0.02,
    segments: 3,
    color: "#BDE5FF",
    overview:
      "A thin white-matter lamina between the putamen and the claustrum, carrying corticocortical association fibers including part of the uncinate and inferior fronto-occipital fasciculi.",
    functions: [
      "Carries association fibers linking frontal, temporal, and occipital cortex",
      "Conveys cholinergic projections toward the cortex",
      "Bounds the lateral edge of the lentiform nucleus",
    ],
    neuropsych: [
      "Lacunar infarcts here can disrupt fronto-temporal connectivity",
      "Involved in some leukodystrophies and small-vessel disease patterns",
    ],
    conditions: ["Lacunar stroke", "Small-vessel white-matter disease"],
    topicHints: ["White Matter Disease", "Stroke Syndromes"],
  },
  {
    id: "third-ventricle",
    name: "Third Ventricle",
    shortName: "Third Ventricle",
    system: "ventricle",
    layer: "ventricle",
    paired: false,
    shape: "tube",
    position: [0, 0.0, -0.1],
    scale: [0.06, 0.5, 0.5],
    displacement: 0.02,
    segments: 3,
    color: "#6FC6DE",
    overview:
      "The thin midline CSF cavity between the two thalami, bounded by the diencephalon. It connects to the lateral ventricles via the foramina of Monro and to the fourth ventricle via the cerebral aqueduct.",
    functions: [
      "Channels cerebrospinal fluid along the midline",
      "Bounded by the thalamus, hypothalamus, and their nuclei",
      "Choroid plexus in its roof produces CSF",
    ],
    neuropsych: [
      "Colloid cysts at the foramen of Monro cause positional headaches and acute hydrocephalus",
      "Third-ventricle enlargement is a structural correlate in schizophrenia and dementia",
    ],
    conditions: ["Obstructive hydrocephalus", "Colloid cyst"],
    topicHints: ["Ventricular System & CSF", "Neuroanatomy Landmarks"],
  },
];

// Inject each structure's anatomical TYPE and a type-driven color, so the whole
// UI (chips, search, detail accents, 2D atlas labels) reads by part type.
export const BRAIN_STRUCTURES: BrainStructure[] = STRUCTURE_DEFS.map((s) => {
  const category = CATEGORY_BY_ID[s.id] ?? "area";
  return { ...s, category, color: CATEGORY_META[category].color };
});

export const STRUCTURE_INDEX: Record<string, BrainStructure> = Object.fromEntries(
  BRAIN_STRUCTURES.map((s) => [s.id, s]),
);

export function structuresBySystem(system: BrainSystem): BrainStructure[] {
  return BRAIN_STRUCTURES.filter((s) => s.system === system);
}
