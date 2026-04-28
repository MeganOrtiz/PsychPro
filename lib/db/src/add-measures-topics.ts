import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  topicsTable,
  flashcardsTable,
  quizQuestionsTable,
  studyGuidesTable,
} from "./schema";

type MeasureRow = {
  test: string;
  fullName: string;
  format: string;
  oneLine: string;
  ages: string;
  whatYoullSee: string[];
  scoresToKnow: string[];
  rememberThis?: string;
};

type MeasureGroup = {
  name: string;
  blurb: string;
  tests: string[];
};

const objectiveMeasures: MeasureRow[] = [
  {
    test: "WAIS-5",
    fullName: "Wechsler Adult Intelligence Scale, Fifth Edition",
    format: "Performance battery",
    oneLine: "The flagship adult IQ battery; co-normed with the WMS-5.",
    ages: "16:0 – 90:11",
    whatYoullSee: [
      "Verbal Comprehension",
      "Visual Spatial",
      "Fluid Reasoning",
      "Working Memory",
      "Processing Speed",
    ],
    scoresToKnow: [
      "Full Scale IQ (FSIQ) from 7 primary subtests",
      "Five primary indices: VCI, VSI, FRI, WMI, PSI",
      "15 ancillary indices including GAI, CPI, NVI, NMI, VECI, EFI, QRI, EPSI, MRPSI, AWMI-R, AWMI-M, EWMI, EVSI, VWMI, VRI",
      "13 process scores",
      "20 subtests total (10 Primary + 10 Secondary); norms collected 2023–2024",
    ],
    rememberThis: "Co-normed with WMS-5 — pair them when memory and intellect are both in question.",
  },
  {
    test: "WISC-V",
    fullName: "Wechsler Intelligence Scale for Children, Fifth Edition",
    format: "Performance battery",
    oneLine: "Children's broadband IQ battery — same five-domain structure as WAIS-5.",
    ages: "6:0 – 16:11",
    whatYoullSee: [
      "Verbal Comprehension",
      "Visual Spatial",
      "Fluid Reasoning",
      "Working Memory",
      "Processing Speed",
    ],
    scoresToKnow: [
      "Full Scale IQ (FSIQ)",
      "Primary indices: VCI, VSI, FRI, WMI, PSI",
      "Alternate composites: GAI, CPI, NVI, EFI, QRI",
    ],
  },
  {
    test: "WPPSI-IV",
    fullName: "Wechsler Preschool and Primary Scale of Intelligence, Fourth Edition",
    format: "Performance battery",
    oneLine: "The Wechsler IQ test for toddlers and young children.",
    ages: "2:6 – 7:7",
    whatYoullSee: [
      "Verbal Comprehension",
      "Visual Spatial",
      "Fluid Reasoning",
      "Working Memory",
      "Processing Speed",
    ],
    scoresToKnow: [
      "Full Scale IQ (FSIQ) and General Ability Index (GAI)",
      "Ages 4:0 – 7:7: VCI, VSI, FRI, WMI, PSI",
      "Ages 2:6 – 3:11: VCI, VSI, FSIQ only",
    ],
  },
  {
    test: "WASI-II",
    fullName: "Wechsler Abbreviated Scale of Intelligence, Second Edition",
    format: "Performance battery (brief)",
    oneLine: "Quick screener of cognitive ability when a full Wechsler isn't needed.",
    ages: "6:0 – 90:11",
    whatYoullSee: ["Verbal Comprehension", "Perceptual Reasoning"],
    scoresToKnow: [
      "FSIQ-2 (2-subtest) and FSIQ-4 (4-subtest)",
      "VCI: Vocabulary, Similarities",
      "PRI: Matrix Reasoning, Block Design",
    ],
    rememberThis: "Pick FSIQ-2 for a fast screen; FSIQ-4 for a more reliable estimate.",
  },
  {
    test: "KABC-II",
    fullName: "Kaufman Assessment Battery for Children, Second Edition",
    format: "Performance battery",
    oneLine: "CHC-aligned children's IQ battery with two interpretive frameworks.",
    ages: "3:0 – 18:11",
    whatYoullSee: [
      "Sequential / Gsm",
      "Simultaneous / Gv",
      "Learning / Glr",
      "Planning / Gf",
      "Knowledge / Gc",
    ],
    scoresToKnow: [
      "Mental Processing Index (MPI) — non-verbal model",
      "Fluid-Crystallized Index (FCI) — full CHC model",
      "Scale indices for each domain",
    ],
  },
  {
    test: "RBANS",
    fullName: "Repeatable Battery for the Assessment of Neuropsychological Status",
    format: "Performance battery (brief)",
    oneLine: "Brief cognitive screen designed for repeat testing in older adults.",
    ages: "12:0 – 89:11",
    whatYoullSee: [
      "Immediate Memory",
      "Visuospatial / Constructional",
      "Language",
      "Attention",
      "Delayed Memory",
    ],
    scoresToKnow: [
      "Total Scale Index",
      "Five domain indices for each area",
    ],
    rememberThis: "Parallel forms make it the go-to for serial assessment after stroke or TBI.",
  },
  {
    test: "NAB",
    fullName: "Neuropsychological Assessment Battery",
    format: "Performance battery",
    oneLine: "Modular adult neuropsych battery that can be given as full or screening modules.",
    ages: "18:0 – 97:11",
    whatYoullSee: [
      "Attention",
      "Language",
      "Memory",
      "Spatial",
      "Executive Functions",
    ],
    scoresToKnow: [
      "Total NAB Index",
      "Module Indices for each domain",
    ],
  },
  {
    test: "NEPSY-II",
    fullName: "Developmental NEuroPSYchological Assessment, Second Edition",
    format: "Performance battery",
    oneLine: "Children's neuropsych battery covering six functional domains.",
    ages: "3:0 – 16:11",
    whatYoullSee: [
      "Attention / Executive Functions",
      "Language",
      "Memory and Learning",
      "Sensorimotor",
      "Visuospatial Processing",
      "Social Perception",
    ],
    scoresToKnow: [
      "No global composite — interpretation is at the subtest and domain level",
    ],
    rememberThis: "There is no FSIQ-equivalent — report by domain.",
  },
  {
    test: "WJ V",
    fullName: "Woodcock-Johnson Tests, Fifth Edition",
    format: "Performance battery",
    oneLine: "CHC-based combined cognitive + achievement battery; fully digital.",
    ages: "2:0 – 90:11",
    whatYoullSee: [
      "Cognitive: Gc, Gf, Gwm, Gs, Ga, Gl, Gr, Gv",
      "Achievement: Reading, Math, Written Language, Oral Language, Academic Knowledge",
    ],
    scoresToKnow: [
      "Cognitive: GIA (general intellectual ability), BIA (brief), Gf-Gc Composite",
      "CHC cluster scores for each factor: Gc, Gf, Gwm, Gs, Ga, Gl, Gr, Gv",
      "Achievement: Broad Achievement Composite; cluster scores for Reading, Math, Written Language, Oral Language, Academic Knowledge, Academic Skills, Academic Fluency, Academic Applications",
      "WJ V splits prior Long-Term Retrieval into Gl (storage) and Gr (retrieval fluency)",
      "20 COG tests (14 Standard + 6 Extended); 17 new tests vs WJ IV; 9 new clusters",
      "WJ V VTL: 15-test Virtual Test Library for supplemental oral language and linguistic assessment",
      "Post-pandemic norms (2023–2024)",
    ],
    rememberThis: "Built directly on the Cattell-Horn-Carroll model — speak in CHC factors.",
  },
  {
    test: "BAYLEY-III",
    fullName: "Bayley Scales of Infant and Toddler Development, Third Edition",
    format: "Performance + observation",
    oneLine: "Developmental assessment for infants and toddlers.",
    ages: "1 mo – 42 mo",
    whatYoullSee: [
      "Cognitive",
      "Language (Receptive / Expressive)",
      "Motor (Gross / Fine)",
      "Social-Emotional",
      "Adaptive Behavior",
    ],
    scoresToKnow: [
      "Cognitive Scale Index",
      "Language Composite (Receptive / Expressive)",
      "Motor Composite (Fine / Gross)",
      "Social-Emotional Scale",
      "Adaptive Behavior Composite",
    ],
  },
  {
    test: "BSRA",
    fullName: "Bracken School Readiness Assessment, Third Edition",
    format: "Performance (brief)",
    oneLine: "Quick check of school-readiness concepts in young children.",
    ages: "Pre-K – 2nd grade",
    whatYoullSee: [
      "Colors",
      "Letters / Sounds",
      "Numbers / Counting",
      "Sizes / Comparisons",
      "Shapes",
    ],
    scoresToKnow: [
      "School Readiness Composite (SRC)",
      "Subtest scores",
    ],
  },
  {
    test: "ACS",
    fullName: "Advanced Clinical Solutions",
    format: "Add-on to WAIS-IV / WMS-IV",
    oneLine: "Companion suite that adds social cognition, effort, ADLs, and premorbid estimates.",
    ages: "16:0 – 90:11",
    whatYoullSee: [
      "Social Cognition",
      "Effort / validity",
      "Daily Living Skills",
      "Premorbid Functioning",
    ],
    scoresToKnow: [
      "Social Perception Score",
      "Effort scores: Word Choice, Reliability",
      "Activities of Daily Living Scale (ADLS)",
      "Test of Premorbid Functioning (ToPF)",
    ],
  },
  {
    test: "CVLT-3",
    fullName: "California Verbal Learning Test, Third Edition",
    format: "Performance",
    oneLine: "Detailed adult verbal list-learning and memory measure.",
    ages: "16:0 – 89:11",
    whatYoullSee: [
      "List Learning across five trials",
      "Short-Delay Free / Cued Recall",
      "Long-Delay Free / Cued Recall",
      "Recognition with false positives",
    ],
    scoresToKnow: [
      "Total Recall (Trials 1–5 T-score)",
      "Short- and Long-Delay Free / Cued Recall",
      "Long-Delay Recognition Hits and False Positives",
      "Discriminability Index and Response Bias (c)",
      "Process scores: Intrusions, Repetitions, Semantic / Serial Clustering",
    ],
    rememberThis: "Process scores (intrusions, clustering, response bias) reveal the strategy behind the score.",
  },
  {
    test: "ChAMP",
    fullName: "Child and Adolescent Memory Profile",
    format: "Performance",
    oneLine: "Verbal and visual memory battery for children and teens.",
    ages: "5:0 – 21:11",
    whatYoullSee: ["Verbal Memory", "Visual Memory"],
    scoresToKnow: [
      "Verbal Memory Index",
      "Visual Memory Index",
      "Learning and Memory Index",
    ],
  },
  {
    test: "TOMAL-2",
    fullName: "Test of Memory and Learning, Second Edition",
    format: "Performance",
    oneLine: "Comprehensive verbal, nonverbal, and attention memory battery.",
    ages: "5:0 – 59:11",
    whatYoullSee: [
      "Core Memory Indices",
      "Supplementary Memory Indices",
      "Delayed Recall",
      "Attention / Concentration",
    ],
    scoresToKnow: [
      "Composite Memory Index (CMI)",
      "Verbal Memory Index (VMI)",
      "Nonverbal Memory Index (NMI)",
      "Delayed Recall Index (DRI)",
      "Learning Index (LI)",
      "Attention / Concentration Index (ACI)",
    ],
  },
  {
    test: "KTEA-3",
    fullName: "Kaufman Test of Educational Achievement, Third Edition",
    format: "Performance achievement battery",
    oneLine: "Comprehensive academic achievement across reading, math, writing, and oral language.",
    ages: "4:6 – 25:11",
    whatYoullSee: [
      "Reading",
      "Math",
      "Written Language",
      "Oral Language",
      "Academic Skills Battery",
    ],
    scoresToKnow: [
      "Academic Skills Battery (ASB) Composite",
      "Core composites: Reading, Math, Written Language",
      "Supplemental composites: Sound-Symbol, Decoding, Reading Fluency / Understanding, Oral Fluency, Comprehension, Expression, Orthographic Processing, Academic Fluency",
      "Forms A and B (parallel); 19 subtests with error analysis on 10",
    ],
  },
  {
    test: "WIAT-III",
    fullName: "Wechsler Individual Achievement Test, Third Edition",
    format: "Performance achievement battery",
    oneLine: "Wechsler-family achievement battery covering listening, speaking, reading, writing, and math.",
    ages: "4:0 – 50:11",
    whatYoullSee: [
      "Oral Language",
      "Total Reading",
      "Basic Reading",
      "Reading Comprehension & Fluency",
      "Written Expression",
      "Mathematics",
      "Math Fluency",
    ],
    scoresToKnow: [
      "Total Achievement Composite",
      "Domain Composites for each area",
    ],
  },
  {
    test: "WRAT5",
    fullName: "Wide Range Achievement Test, Fifth Edition",
    format: "Performance (brief)",
    oneLine: "Quick reading, spelling, and math screener.",
    ages: "5:0 – 85:11",
    whatYoullSee: [
      "Word Reading",
      "Sentence Comprehension",
      "Spelling",
      "Math Computation",
    ],
    scoresToKnow: [
      "Word Reading SS",
      "Sentence Comprehension SS",
      "Spelling SS",
      "Math Computation SS",
      "Reading Composite SS",
    ],
  },
  {
    test: "FAR",
    fullName: "Feifer Assessment of Reading",
    format: "Performance",
    oneLine: "Diagnostic reading battery built around dyslexia subtypes.",
    ages: "4:0 – 21:11",
    whatYoullSee: [
      "Phonological Dyslexia",
      "Surface Dyslexia",
      "Mixed Dyslexia",
    ],
    scoresToKnow: [
      "Global Reading Index (GRI)",
      "Phonological, Surface, and Mixed Indices",
      "Subtest scores",
    ],
  },
  {
    test: "FAM",
    fullName: "Feifer Assessment of Mathematics",
    format: "Performance",
    oneLine: "Diagnostic math battery built around dyscalculia subtypes.",
    ages: "4:0 – 21:11",
    whatYoullSee: [
      "Procedural Dyscalculia",
      "Verbal Dyscalculia",
      "Semantic Dyscalculia",
    ],
    scoresToKnow: [
      "Global Math Index (GMI)",
      "Procedural, Semantic, and Verbal Indices",
      "Subtest scores",
    ],
  },
  {
    test: "FAW",
    fullName: "Feifer Assessment of Writing",
    format: "Performance",
    oneLine: "Diagnostic writing battery built around dysgraphia subtypes.",
    ages: "4:0 – 21:11",
    whatYoullSee: [
      "Phonological Dysgraphia",
      "Surface Dysgraphia",
      "Mixed Dysgraphia",
    ],
    scoresToKnow: [
      "Global Writing Index (GWI)",
      "Phonological, Surface, and Mixed Indices",
    ],
  },
  {
    test: "TOD",
    fullName: "Test of Dyslexia",
    format: "Performance",
    oneLine: "Comprehensive dyslexia battery for children and adults.",
    ages: "5:0 – 89:11",
    whatYoullSee: [
      "Phonological Awareness",
      "Rapid Automatized Naming",
      "Orthographic Processing",
      "Reading Fluency",
      "Reading Comprehension",
    ],
    scoresToKnow: [
      "Total Dyslexia Index (TDI)",
      "Domain indices for each area",
    ],
  },
  {
    test: "CTOPP-2",
    fullName: "Comprehensive Test of Phonological Processing, Second Edition",
    format: "Performance",
    oneLine: "Phonological processing battery used to flag reading risk.",
    ages: "4:0 – 24:11",
    whatYoullSee: [
      "Phonological Awareness",
      "Phonological Memory",
      "Rapid Symbolic Naming",
      "Rapid Non-Symbolic Naming",
    ],
    scoresToKnow: [
      "Phonological Awareness Composite",
      "Phonological Memory Composite",
      "Rapid Symbolic Naming Composite",
      "Rapid Non-Symbolic Naming Composite",
      "Alternative Phonological Awareness Composite",
    ],
  },
  {
    test: "DEST-II",
    fullName: "Dyslexia Early Screening Test, Second Edition",
    format: "Performance (brief screener)",
    oneLine: "Early-childhood dyslexia screener.",
    ages: "4:6 – 6:5",
    whatYoullSee: [
      "Rapid Naming",
      "Bead Threading",
      "Phonological Discrimination",
      "Postural Stability",
      "Rhyme",
      "Sound Order",
      "Letter Knowledge",
    ],
    scoresToKnow: [
      "At-Risk Quotient (ARQ)",
      "Subtest scores",
    ],
  },
  {
    test: "DST-J",
    fullName: "Dyslexia Screening Test — Junior",
    format: "Performance (brief screener)",
    oneLine: "Dyslexia screener for school-age children.",
    ages: "6:6 – 11:5",
    whatYoullSee: [
      "Rapid Naming",
      "Bead Threading",
      "Phonemic Segmentation",
      "Backwards Digit Span",
      "Nonsense Passage Reading",
      "Spoonerisms",
    ],
    scoresToKnow: [
      "Screening Score (At-Risk / Not At-Risk)",
      "Subtest scores",
    ],
  },
  {
    test: "DST-II",
    fullName: "Dyslexia Screening Test, Second Edition",
    format: "Performance (brief screener)",
    oneLine: "Wide-age dyslexia screener (childhood through older adulthood).",
    ages: "4:6 – 65+",
    whatYoullSee: [
      "Rapid Naming",
      "Bead Threading",
      "Phonemic Segmentation",
      "Backwards Digit Span",
      "Nonsense Passage Reading",
      "Spoonerisms",
    ],
    scoresToKnow: [
      "Screening Score (At-Risk / Not At-Risk)",
      "Subtest scores",
    ],
  },
  {
    test: "CELF-5 / CELF-P2",
    fullName: "Clinical Evaluation of Language Fundamentals, Fifth Edition / Preschool, Second Edition",
    format: "Performance",
    oneLine: "Comprehensive language battery from preschool through young adulthood.",
    ages: "Preschool 3:0 – 6:11; School Age 5:0 – 21:11",
    whatYoullSee: [
      "Core Language",
      "Receptive Language",
      "Expressive Language",
      "Language Content",
      "Language Structure",
      "Language Memory",
    ],
    scoresToKnow: [
      "Core Language Score (CLS)",
      "Receptive / Expressive Language Indices",
      "Language Content / Structure / Memory Indices",
      "Pragmatics Profile",
      "Reading/Writing Index (older ages)",
    ],
  },
  {
    test: "CASL / CASL-II",
    fullName: "Comprehensive Assessment of Spoken Language",
    format: "Performance",
    oneLine: "Oral language battery covering comprehension and expression across four domains.",
    ages: "3:0 – 21:11",
    whatYoullSee: [
      "Lexical/Semantic",
      "Syntactic",
      "Supralinguistic",
      "Pragmatic",
    ],
    scoresToKnow: [
      "Oral Language Index (OLI)",
      "Core Language Index",
      "Lexical/Semantic, Syntactic, Supralinguistic, Pragmatic Indices",
    ],
  },
  {
    test: "PPVT-5",
    fullName: "Peabody Picture Vocabulary Test, Fifth Edition",
    format: "Performance",
    oneLine: "Receptive vocabulary screener — point to the picture that matches the word.",
    ages: "2:6 – 90+",
    whatYoullSee: ["Receptive Vocabulary"],
    scoresToKnow: [
      "Receptive Vocabulary Standard Score",
      "Growth Scale Value (GSV)",
    ],
    rememberThis: "Pairs naturally with the EVT-3 — receptive (PPVT) vs. expressive (EVT) vocabulary.",
  },
  {
    test: "EVT-3",
    fullName: "Expressive Vocabulary Test, Third Edition",
    format: "Performance",
    oneLine: "Expressive vocabulary and word retrieval — name the picture.",
    ages: "2:6 – 90+",
    whatYoullSee: ["Expressive Vocabulary", "Word Retrieval"],
    scoresToKnow: [
      "Expressive Vocabulary Total Score",
      "Growth Scale Value (GSV)",
    ],
  },
  {
    test: "PVAT",
    fullName: "Ortiz Picture Vocabulary Acquisition Test",
    format: "Performance",
    oneLine: "Picture-based receptive vocabulary measure.",
    ages: "2:6 – 22:11",
    whatYoullSee: ["Receptive Vocabulary", "Language Acquisition"],
    scoresToKnow: [
      "Acquisition Score",
      "Vocabulary Age Equivalent",
      "Language Acquisition Index",
    ],
  },
  {
    test: "CAPs",
    fullName: "Comprehensive Assessment of Pragmatics",
    format: "Performance + observation",
    oneLine: "Targeted assessment of pragmatic and social language.",
    ages: "7:0 – 18:11",
    whatYoullSee: [
      "Utterance",
      "Discourse",
      "Nonliteral Language",
      "Nonverbal Communication",
      "Social Relations",
    ],
    scoresToKnow: [
      "Pragmatic Language Index",
      "Subtest scores",
    ],
  },
  {
    test: "SCAN-3",
    fullName: "Tests for Auditory Processing Disorders",
    format: "Performance",
    oneLine: "Screens for auditory processing disorders in adolescents and adults.",
    ages: "13:0 – 50:11",
    whatYoullSee: [
      "Filtered Words",
      "Auditory Figure Ground",
      "Competing Words",
      "Competing Sentences",
    ],
    scoresToKnow: [
      "Composite Score",
      "Subtests: Filtered Words, Auditory Figure Ground, Competing Words (Directed Ear, Free Recall), Competing Sentences",
    ],
  },
  {
    test: "D-KEFS",
    fullName: "Delis-Kaplan Executive Function System",
    format: "Performance",
    oneLine: "Suite of nine executive-function tasks covering planning, inhibition, flexibility, and reasoning.",
    ages: "8:0 – 89:11",
    whatYoullSee: [
      "Color-Word Interference (Stroop)",
      "Design Fluency",
      "Proverb Test",
      "Sorting Test",
      "Tower",
      "Trail Making",
      "Twenty Questions",
      "Verbal Fluency",
      "Word Context",
    ],
    scoresToKnow: [
      "No global composite — interpret subtest scaled scores",
      "Color-Word Interference: inhibition of automatic responses",
      "Design Fluency: visual fluency, rule compliance",
      "Sorting Test / Word Context: cognitive flexibility, hypothesis testing",
      "Tower: spatial planning",
      "Trail Making: visual-motor set-shifting",
      "Verbal Fluency: phonemic generation with switching",
    ],
    rememberThis: "There's no FSIQ-style summary score — speak in subtest performance.",
  },
  {
    test: "WCST",
    fullName: "Wisconsin Card Sorting Task",
    format: "Performance",
    oneLine: "Classic measure of abstract reasoning and cognitive set-shifting.",
    ages: "6:5 – 89:11",
    whatYoullSee: [
      "Perseverative Errors / Responses",
      "Failure to Maintain Set",
      "Conceptual Level Responses",
      "Categories Completed",
    ],
    scoresToKnow: [
      "Categories Completed",
      "Perseverative Responses and Errors",
      "Non-Perseverative Errors",
      "Conceptual Level Responses",
      "Trials to Complete First Category",
      "Failure to Maintain Set",
      "Learning to Learn",
    ],
  },
  {
    test: "CPT-III",
    fullName: "Conners Continuous Performance Test, Third Edition",
    format: "Performance (computerized)",
    oneLine: "Continuous-performance test for sustained attention, impulsivity, and vigilance.",
    ages: "8:0+",
    whatYoullSee: [
      "Inattentiveness (omissions)",
      "Impulsivity (commissions)",
      "Sustained Attention",
      "Response Variability",
    ],
    scoresToKnow: [
      "Detectability (d')",
      "Omissions / Commissions / Perseverations",
      "Hit Reaction Time and HRT Standard Error",
      "Variability and Response Style (Beta)",
      "ADHD Confidence Index",
    ],
  },
  {
    test: "PASAT",
    fullName: "Paced Auditory Serial Addition Task",
    format: "Performance",
    oneLine: "Auditory working-memory and processing-speed task — add each new digit to the previous one.",
    ages: "Adolescent – Adult",
    whatYoullSee: [
      "Auditory Attention",
      "Processing Speed",
      "Mental Flexibility",
      "Calculation Ability",
    ],
    scoresToKnow: [
      "PASAT Total Score (correct responses)",
      "Paced Serial Addition Score",
    ],
  },
  {
    test: "TEA",
    fullName: "Test of Everyday Attention",
    format: "Performance",
    oneLine: "Adult attention battery using everyday-style tasks.",
    ages: "18:0 – 80:11",
    whatYoullSee: [
      "Selective Attention",
      "Sustained Attention",
      "Attentional Switching",
    ],
    scoresToKnow: [
      "Selective, Sustained, and Attentional Switching scores",
      "Subtest scores",
    ],
  },
  {
    test: "TEA-Ch",
    fullName: "Test of Everyday Attention for Children",
    format: "Performance",
    oneLine: "Child version of the TEA — attention plus response inhibition.",
    ages: "6:0 – 16:11",
    whatYoullSee: [
      "Selective Attention",
      "Sustained Attention",
      "Attentional Control",
      "Response Inhibition",
    ],
    scoresToKnow: [
      "Overall Attention Score",
      "Subtests: Sky Search, Score!, Sky Search DT, Score! DT, Creature Counting, Walk/Don't Walk, Opposite Worlds, Code Transmission",
    ],
  },
  {
    test: "BEERY (VMI)",
    fullName: "Beery-Buktenica Developmental Test of Visual-Motor Integration",
    format: "Performance",
    oneLine: "Copy-the-design test of visual-motor integration with two supplemental subtests.",
    ages: "2:0 – 18:11; 19:0 – 100:11",
    whatYoullSee: [
      "Visual-Motor Integration (copy designs)",
      "Visual Perception",
      "Motor Coordination",
    ],
    scoresToKnow: [
      "Visual-Motor Integration SS",
      "Visual Perception SS",
      "Motor Coordination SS",
    ],
  },
  {
    test: "WRAVMA",
    fullName: "Wide Range Assessment of Visual Motor Abilities",
    format: "Performance",
    oneLine: "Visual-motor battery with separate drawing, matching, and pegboard subtests.",
    ages: "3:0 – 17:11",
    whatYoullSee: ["Drawing", "Matching", "Pegboard"],
    scoresToKnow: [
      "Drawing SS",
      "Matching SS",
      "Pegboard SS",
      "Visual Motor Integration Composite",
    ],
  },
  {
    test: "FTT",
    fullName: "Finger Tapping Test",
    format: "Performance",
    oneLine: "Simple motor speed test of upper-extremity tapping rate.",
    ages: "9:0+",
    whatYoullSee: [
      "Dominant Hand Tapping",
      "Non-Dominant Hand Tapping",
    ],
    scoresToKnow: [
      "Dominant Hand Tapping Rate",
      "Non-Dominant Hand Tapping Rate",
      "Dominant / Non-Dominant Ratio",
    ],
  },
  {
    test: "ADOS-2",
    fullName: "Autism Diagnostic Observation Schedule, Second Edition",
    format: "Semi-structured observation",
    oneLine: "Gold-standard observation tool for autism spectrum disorder.",
    ages: "12 mo – Adult",
    whatYoullSee: [
      "Social Affect",
      "Restricted and Repetitive Behaviors",
    ],
    scoresToKnow: [
      "Toddler Module (12–30 mo)",
      "Module 1 (Minimal Verbal)",
      "Module 2 (Phrase Speech)",
      "Module 3 (Fluent / Child-Adolescent)",
      "Module 4 (Fluent / Adolescent-Adult)",
      "Calibrated Severity Score (CSS) for Social Affect and Restricted / Repetitive Behaviors",
    ],
    rememberThis: "Choose the module by language level — not by age.",
  },
  {
    test: "MIGDAS-2",
    fullName: "Monteiro Interview Guidelines for Diagnosing the Autism Spectrum, Second Edition",
    format: "Semi-structured interview / observation",
    oneLine: "Sensory-based interview alternative for autism / Asperger's evaluation.",
    ages: "3:0 – 99:11",
    whatYoullSee: [
      "Sensory Interests / Repetitive Behaviors",
      "Social and Emotional Skills",
      "Language",
      "Cognitive Awareness",
    ],
    scoresToKnow: [
      "Overall Autism Spectrum Rating",
      "Domain scores",
    ],
  },
  {
    test: "KADI",
    fullName: "Krug Asperger's Disorder Index",
    format: "Rating scale",
    oneLine: "Helps distinguish Asperger's-style presentations from high-functioning autism.",
    ages: "6:0 – 22:11",
    whatYoullSee: [
      "Language",
      "Social Interaction",
      "Sensory / Motor",
      "Behavioral Patterns",
    ],
    scoresToKnow: ["KADI Total Score (Asperger's Index)"],
  },
  {
    test: "CAM",
    fullName: "Confusion Assessment Method",
    format: "Brief structured interview / observation",
    oneLine: "Bedside screen for delirium.",
    ages: "Adult",
    whatYoullSee: [
      "Acute Onset and Fluctuating Course",
      "Inattention",
      "Disorganized Thinking",
      "Altered Level of Consciousness",
    ],
    scoresToKnow: [
      "CAM Algorithm Score (Delirium Present / Absent)",
      "Feature ratings for each criterion",
    ],
    rememberThis: "Algorithm: feature 1 + 2 plus either 3 or 4 = positive screen.",
  },
  {
    test: "R-PAS",
    fullName: "Rorschach Performance Assessment System",
    format: "Performance-based projective",
    oneLine: "Standardized Rorschach system with structured indices on Page 1 and Page 2.",
    ages: "5:0+",
    whatYoullSee: [
      "Engagement / Cognitive Processing",
      "Memory",
      "Perception / Thinking Problems",
      "Stress and Distress",
      "Self / Other Representation",
    ],
    scoresToKnow: [
      "Page 1: Engagement & Cognitive Processing, Memory, Perception & Thinking Problems",
      "Page 2: Stress & Distress, Self & Other Representation",
      "Complexity, EII-3, SC-Comp, TP-Comp",
    ],
  },
  {
    test: "TAT",
    fullName: "Thematic Apperception Test",
    format: "Performance-based projective",
    oneLine: "Tell-a-story projective measure scored qualitatively.",
    ages: "5:0 – 79:11",
    whatYoullSee: ["Social and Emotional Functioning (projective)"],
    scoresToKnow: [
      "No standardized index scores",
      "Scored for themes, needs, press, and narrative structure",
    ],
  },
  {
    test: "Roberts-2",
    fullName: "Roberts Apperception Test for Children, Second Edition",
    format: "Performance-based projective",
    oneLine: "Apperception (story-telling) measure designed for children.",
    ages: "6:0 – 18:11",
    whatYoullSee: [
      "Reliance on Others",
      "Support from Others",
      "Family Acceptance",
      "Limit Setting",
      "Ego Functioning",
      "Emotional Tone",
    ],
    scoresToKnow: [
      "Theme Overview Scales",
      "Available Resources Scales",
      "Problem Identification, Resolution, Emotion, Outcome",
      "Clinical Scales: Anxiety, Aggression, Depression, Rejection, Unusual / Atypical Responses",
    ],
  },
  {
    test: "Sentence Completion",
    fullName: "Rotter Incomplete Sentences Blank",
    format: "Self-report projective",
    oneLine: "Open-ended sentence stems scored for overall adjustment.",
    ages: "High school+",
    whatYoullSee: ["Social and Emotional Functioning (projective)"],
    scoresToKnow: [
      "Adjustment Score (overall maladjustment)",
      "Individual item ratings",
    ],
  },
  {
    test: "TOMM",
    fullName: "Test of Memory Malingering",
    format: "Performance validity test",
    oneLine: "Visual-recognition PVT used to assess effort.",
    ages: "16:0 – 84:11",
    whatYoullSee: ["Trial 1", "Trial 2", "Retention", "Recognition"],
    scoresToKnow: [
      "Trial 1, Trial 2, and Retention scores",
      "Recognition score",
      "Pass / Fail cutoffs",
    ],
  },
  {
    test: "MSVT",
    fullName: "Medical Symptom Validity Test",
    format: "Performance validity test (computerized)",
    oneLine: "Brief computerized PVT with embedded recall and recognition trials.",
    ages: "Adult",
    whatYoullSee: [
      "Immediate Recognition",
      "Delayed Recognition",
      "Consistency",
    ],
    scoresToKnow: [
      "Immediate Recognition (IR)",
      "Delayed Recognition (DR)",
      "Consistency (CNS)",
      "Paired Associates (PA) and Free Recall (FR)",
      "Pass / Fail cutoffs",
    ],
  },
  {
    test: "MVP",
    fullName: "Memory Validity Profile",
    format: "Performance validity test",
    oneLine: "Pediatric / adolescent memory validity measure.",
    ages: "5:0 – 21:11",
    whatYoullSee: [
      "Immediate Memory",
      "Delayed Memory",
      "Consistency",
    ],
    scoresToKnow: [
      "Immediate Memory Index",
      "Delayed Memory Index",
      "Consistency Index",
      "Pass / Fail determination",
    ],
  },
  {
    test: "REY-15 (FIT)",
    fullName: "Rey 15-Item Visual Memory Test",
    format: "Performance validity test (brief)",
    oneLine: "Quick 15-item recall + recognition validity screen.",
    ages: "11:0+",
    whatYoullSee: ["Recall", "Recognition", "Effort / Validity"],
    scoresToKnow: [
      "Total Correct Score (0–15)",
      "Recognition Score",
      "Combined Score",
      "Pass / Fail cutoffs",
    ],
  },
  {
    test: "PdPVTS",
    fullName: "Pediatric Performance Validity Test Suite",
    format: "Performance validity test (battery)",
    oneLine: "Pediatric PVT battery bundling several validity measures.",
    ages: "5:0 – 18:11",
    whatYoullSee: [
      "Performance Validity",
      "Memory Validity",
      "Effort",
    ],
    scoresToKnow: [
      "Performance Validity Index",
      "Component scores: TOMM-C, MSVT-C, Rey-15-C",
      "Pass / Fail classification",
    ],
  },
  {
    test: "ToPF",
    fullName: "Test of Premorbid Functioning",
    format: "Performance",
    oneLine: "Estimates pre-injury intellectual ability from word reading + demographics.",
    ages: "16:0 – 90:11",
    whatYoullSee: ["Premorbid Intellectual Functioning"],
    scoresToKnow: [
      "Predicted FSIQ Score",
      "Predicted GAI Score",
      "Confidence intervals for premorbid functioning",
    ],
    rememberThis: "Use it to anchor 'expected baseline' before interpreting current scores.",
  },
];

const subjectiveMeasures: MeasureRow[] = [
  {
    test: "BAI",
    fullName: "Beck Anxiety Inventory",
    format: "Self-report",
    oneLine: "Short self-report inventory of anxiety severity.",
    ages: "17:0 – 80:11",
    whatYoullSee: [
      "Subjective Anxiety",
      "Neurophysiological Symptoms",
      "Autonomic Symptoms",
      "Panic Symptoms",
    ],
    scoresToKnow: [
      "Total Score 0–63",
      "Severity bands: Minimal, Mild, Moderate, Severe",
    ],
  },
  {
    test: "BDI-II",
    fullName: "Beck Depression Inventory, Second Edition",
    format: "Self-report",
    oneLine: "Short self-report inventory of depression severity.",
    ages: "13:0 – 80:11",
    whatYoullSee: [
      "Affective symptoms",
      "Cognitive symptoms",
      "Somatic symptoms",
      "Vegetative symptoms",
    ],
    scoresToKnow: [
      "Total Score 0–63",
      "Severity bands: Minimal, Mild, Moderate, Severe",
      "Cognitive-Affective Subscale",
      "Somatic-Vegetative Subscale",
    ],
    rememberThis: "Same 0–63 range as the BAI — keep the populations straight.",
  },
  {
    test: "BYI",
    fullName: "Beck Youth Inventories",
    format: "Self-report",
    oneLine: "Five short youth inventories for depression, anxiety, anger, disruptive behavior, and self-concept.",
    ages: "7:0 – 18:11",
    whatYoullSee: [
      "Depression",
      "Anxiety",
      "Anger",
      "Disruptive Behavior",
      "Self-Concept",
    ],
    scoresToKnow: [
      "BDI-Y (Depression)",
      "BAI-Y (Anxiety)",
      "BANI-Y (Anger)",
      "BDBI-Y (Disruptive Behavior)",
      "BSCI-Y (Self-Concept)",
    ],
  },
  {
    test: "CDI-2",
    fullName: "Children's Depression Inventory, Second Edition",
    format: "Multi-informant rating scale",
    oneLine: "Depression measure for kids and teens; self, parent, and teacher forms.",
    ages: "7:0 – 17:11",
    whatYoullSee: [
      "Emotional Problems",
      "Functional Problems",
    ],
    scoresToKnow: [
      "Total Score",
      "Emotional Problems: Negative Mood / Physical Symptoms, Negative Self-Esteem",
      "Functional Problems: Ineffectiveness, Interpersonal Problems",
      "Self-Report, Parent, Teacher forms",
    ],
  },
  {
    test: "MMPI-3",
    fullName: "Minnesota Multiphasic Personality Inventory, Third Edition",
    format: "Self-report (broadband)",
    oneLine: "The most widely used broadband personality and psychopathology inventory.",
    ages: "18:0+",
    whatYoullSee: [
      "Validity Scales",
      "Higher-Order Scales",
      "Restructured Clinical Scales",
      "Somatic / Cognitive, Internalizing, Externalizing, Interpersonal Scales",
      "Interest Scales",
      "PSY-5 Scales",
    ],
    scoresToKnow: [
      "10 Validity Scales: VRIN-r, TRIN-r, CRIN, F-r, Fp-r, Fs, FBS-r, RBS, L-r, K-r",
      "3 Higher-Order Scales: EID, THD, BXD",
      "9 Restructured Clinical (RC) Scales",
      "10 Somatic / Cognitive Scales",
      "9 Internalizing, 7 Externalizing, 4 Interpersonal Scales",
      "5 PSY-5 Scales",
      "2 Interest Scales",
    ],
    rememberThis: "Higher-Order = EID, THD, BXD — easy mnemonic for the top of the profile.",
  },
  {
    test: "PAI",
    fullName: "Personality Assessment Inventory",
    format: "Self-report (broadband)",
    oneLine: "Broadband personality inventory with clinical, treatment, and interpersonal scales.",
    ages: "18:0 – 89:11",
    whatYoullSee: [
      "Validity Scales",
      "Clinical Scales",
      "Treatment Consideration Scales",
      "Interpersonal Scales",
    ],
    scoresToKnow: [
      "4 Validity Scales",
      "11 Clinical Scales",
      "5 Treatment Consideration Scales",
      "2 Interpersonal Scales (22 full scales total)",
      "31 subscales embedded within select scales",
    ],
  },
  {
    test: "MCMI-IV",
    fullName: "Millon Clinical Multiaxial Inventory, Fourth Edition",
    format: "Self-report (broadband)",
    oneLine: "Broadband inventory built around Millon's personality theory.",
    ages: "18:0+",
    whatYoullSee: [
      "Clinical Personality Patterns",
      "Severe Personality Pathology",
      "Clinical Syndromes",
      "Severe Clinical Syndromes",
    ],
    scoresToKnow: [
      "Modifying Indices: Disclosure, Desirability, Debasement, Validity",
      "14 Clinical Personality Pattern scales",
      "3 Severe Personality Pathology scales",
      "10 Clinical Syndrome scales",
      "3 Severe Clinical Syndrome scales",
    ],
  },
  {
    test: "MACI-II",
    fullName: "Millon Adolescent Clinical Inventory, Second Edition",
    format: "Self-report (broadband, adolescent)",
    oneLine: "Adolescent broadband measure of personality patterns and clinical concerns.",
    ages: "13:0 – 18:11",
    whatYoullSee: [
      "Personality Patterns",
      "Expressed Concerns",
      "Clinical Syndromes",
    ],
    scoresToKnow: [
      "12 Personality Patterns scales",
      "8 Expressed Concerns scales",
      "7 Clinical Syndromes scales",
      "Modifying Indices: Disclosure, Desirability, Debasement",
    ],
  },
  {
    test: "M-PACI",
    fullName: "Millon Pre-Adolescent Clinical Inventory",
    format: "Self-report (pre-adolescent)",
    oneLine: "Pre-adolescent broadband personality inventory.",
    ages: "9:0 – 12:11",
    whatYoullSee: [
      "Personality patterns and clinical concerns in pre-adolescents",
    ],
    scoresToKnow: [
      "T-scores for 18 scales (e.g., Introversive Feelings, Inhibited Style, Doleful Mood, Submissive, Dramatizing, Egotistic, Unruly, Forceful, Oppositional, Borderline, Self-Demeaning, Anxious, Somatic, Depressive, Identity Diffusion, Social Insensitivity, Social Isolation, Family Discord)",
      "No global composite",
    ],
  },
  {
    test: "Conners-4",
    fullName: "Conners Fourth Edition",
    format: "Multi-informant rating scale",
    oneLine: "ADHD-focused rating scale; parent, teacher, and self-report forms.",
    ages: "6:0 – 18:11",
    whatYoullSee: [
      "Inattention / Executive Dysfunction",
      "Hyperactivity",
      "Impulsivity",
      "Emotional Dysregulation",
    ],
    scoresToKnow: [
      "Content Scales: Inattention/EF, Hyperactivity, Impulsivity, Emotional Dysregulation",
      "T-scores and percentiles",
      "Parent, Teacher, and Self-Report forms",
    ],
  },
  {
    test: "BAARS-IV",
    fullName: "Barkley Adult ADHD Rating Scale, Fourth Edition",
    format: "Self-report and Other-report",
    oneLine: "Adult ADHD severity scale with current and retrospective ratings.",
    ages: "18:0+",
    whatYoullSee: [
      "Inattention",
      "Hyperactivity",
      "Impulsivity",
      "Sluggish Cognitive Tempo",
    ],
    scoresToKnow: [
      "Inattention, Hyperactivity, Impulsivity Total Scores",
      "Sluggish Cognitive Tempo (SCT) Total Score",
      "Current Symptoms scale",
      "Childhood Symptoms scale (retrospective)",
      "DSM-5 ADHD symptom counts",
    ],
  },
  {
    test: "DIVA",
    fullName: "Diagnostic Interview for ADHD in Adults",
    format: "Structured clinical interview",
    oneLine: "Structured clinical interview for adult ADHD diagnosis.",
    ages: "18:0+",
    whatYoullSee: [
      "Inattention (childhood and adulthood)",
      "Hyperactivity / Impulsivity (childhood and adulthood)",
    ],
    scoresToKnow: [
      "Inattention symptom count (childhood & adulthood)",
      "Hyperactivity / Impulsivity symptom count (childhood & adulthood)",
      "DSM-5 criteria met (Yes / No)",
    ],
  },
  {
    test: "KSADS",
    fullName: "Kiddie Schedule for Affective Disorders and Schizophrenia",
    format: "Structured clinical interview",
    oneLine: "Structured interview for mood, psychotic, anxiety, and behavioral disorders in youth.",
    ages: "6:0 – 18:11",
    whatYoullSee: [
      "Mood Disorders",
      "Psychotic Disorders",
      "Anxiety Disorders",
      "Behavioral Disorders",
    ],
    scoresToKnow: [
      "Diagnostic determinations (current and past) per disorder category",
      "No continuous index scores",
    ],
  },
  {
    test: "BASC-3",
    fullName: "Behavior Assessment System for Children, Third Edition",
    format: "Multi-informant rating scale",
    oneLine: "Broad behavioral, social, and emotional rating scale across informants.",
    ages: "2:0 – 21:11",
    whatYoullSee: [
      "Externalizing Problems",
      "Internalizing Problems",
      "Behavioral Symptoms",
      "Adaptive Skills",
    ],
    scoresToKnow: [
      "Behavioral Symptoms Index (BSI)",
      "Externalizing, Internalizing, Adaptive Skills Composites",
      "Scales include: Hyperactivity, Aggression, Conduct Problems, Anxiety, Depression, Somatization, Atypicality, Withdrawal, Attention, Adaptability, Social Skills, Leadership, Activities of Daily Living, Functional Communication",
    ],
  },
  {
    test: "CBCL (Child)",
    fullName: "Child Behavior Checklist (Achenbach / ASEBA)",
    format: "Informant rating scale",
    oneLine: "Caregiver-report behavior and emotion checklist for school-age children.",
    ages: "6:0 – 18:11",
    whatYoullSee: [
      "Internalizing Problems",
      "Externalizing Problems",
      "Total Problems",
      "DSM-Oriented Scales",
      "Social Competence",
    ],
    scoresToKnow: [
      "Total Problems",
      "Internalizing Composite: Anxious/Depressed, Withdrawn/Depressed, Somatic Complaints",
      "Externalizing Composite: Rule-Breaking, Aggressive Behavior",
      "8 Syndrome Scales",
      "DSM-Oriented Scales: Depressive, Anxiety, Somatic, ADHD, ODD, Conduct",
      "Competence Scales: Activities, Social, School",
      "Companion forms: TRF (teacher), YSR (youth self-report)",
    ],
  },
  {
    test: "CBCL (Preschool)",
    fullName: "Child Behavior Checklist for Ages 1.5–5 (ASEBA Preschool)",
    format: "Informant rating scale",
    oneLine: "Caregiver-report behavior and emotion checklist for toddlers and preschoolers.",
    ages: "1:6 – 5:11",
    whatYoullSee: [
      "Internalizing Problems",
      "Externalizing Problems",
      "Total Problems",
      "DSM-Oriented Scales",
    ],
    scoresToKnow: [
      "Total Problems",
      "Internalizing Composite: Emotionally Reactive, Anxious/Depressed, Somatic Complaints, Withdrawn",
      "Externalizing Composite: Attention Problems, Aggressive Behavior",
      "7 Syndrome Scales",
      "DSM-Oriented Scales: Depressive, Anxiety, Autism Spectrum, ADHD, ODD",
      "Companion form: C-TRF (caregiver-teacher)",
    ],
  },
  {
    test: "ABCL",
    fullName: "Adult Behavior Checklist (ASEBA)",
    format: "Informant rating scale (collateral)",
    oneLine: "Observer-report adult behavior checklist that pairs with the ASR.",
    ages: "18:0 – 59:11",
    whatYoullSee: [
      "Internalizing Problems",
      "Externalizing Problems",
      "Total Problems",
      "DSM-Oriented Scales",
      "Adaptive Functioning",
    ],
    scoresToKnow: [
      "Total Problems",
      "Internalizing: Anxious/Depressed, Withdrawn, Somatic Complaints",
      "Externalizing: Aggressive, Rule-Breaking, Intrusive",
      "8 Syndrome Scales",
      "DSM-Oriented: Depressive, Anxiety, Somatic, Avoidant Personality, ADHD, Antisocial Personality",
      "Adaptive Functioning: Friends, Spouse/Partner, Family, Job",
    ],
    rememberThis: "Use OABCL for ages 60+; pairs with ASR (self-report).",
  },
  {
    test: "BRIEF-2",
    fullName: "Behavior Rating Inventory of Executive Function, Second Edition",
    format: "Multi-informant rating scale",
    oneLine: "Everyday-life rating of executive functioning in children and teens.",
    ages: "5:0 – 18:11 (BRIEF-P for 2:0 – 5:11)",
    whatYoullSee: [
      "Behavioral Regulation",
      "Emotional Regulation",
      "Cognitive Regulation",
    ],
    scoresToKnow: [
      "Global Executive Composite (GEC)",
      "Three Indices: BRI, ERI, CRI",
      "Scales: Inhibit, Self-Monitor, Shift, Emotional Control, Initiate, Working Memory, Plan/Organize, Task-Monitor, Organization of Materials",
    ],
  },
  {
    test: "BRIEF-A",
    fullName: "Behavior Rating Inventory of Executive Function — Adult Version",
    format: "Self-report and Informant report",
    oneLine: "Adult version of the BRIEF for everyday executive functioning.",
    ages: "18:0 – 90:0",
    whatYoullSee: [
      "Behavioral Regulation",
      "Metacognition",
      "Global Executive Functioning",
    ],
    scoresToKnow: [
      "Global Executive Composite (GEC)",
      "Two Indices: BRI, MI",
      "Scales: Inhibit, Shift, Emotional Control, Self-Monitor, Initiate, Working Memory, Plan/Organize, Task Monitor, Organization of Materials",
    ],
    rememberThis: "BRIEF-2 has 3 indices (BRI/ERI/CRI); BRIEF-A has 2 (BRI/MI).",
  },
  {
    test: "ABAS-3",
    fullName: "Adaptive Behavior Assessment System, Third Edition",
    format: "Informant rating scale",
    oneLine: "Caregiver / teacher rating of daily-living skills.",
    ages: "Birth – 89:11",
    whatYoullSee: [
      "Conceptual Skills",
      "Social Skills",
      "Practical Skills",
      "General Adaptive Composite",
    ],
    scoresToKnow: [
      "General Adaptive Composite (GAC)",
      "Domain Composites: Conceptual, Social, Practical",
      "Skill Areas: Communication, Community Use, Functional Academics, Home/School Living, Health and Safety, Leisure, Self-Care, Self-Direction, Social, Work",
    ],
    rememberThis: "Often required to support intellectual disability and autism diagnoses.",
  },
  {
    test: "SIB-R",
    fullName: "Scales of Independent Behavior, Revised",
    format: "Informant rating scale",
    oneLine: "Adaptive behavior battery with strong maladaptive-behavior coverage.",
    ages: "Infancy – 80:11",
    whatYoullSee: [
      "Motor Skills",
      "Social Interaction / Communication",
      "Personal Living Skills",
      "Community Living Skills",
      "Maladaptive Behavior",
    ],
    scoresToKnow: [
      "Broad Independence Score",
      "Cluster Scores: Motor, Social Interaction & Communication, Personal Living, Community Living",
      "Maladaptive Behavior Indexes: General, Internalized, Asocial, Externalized",
      "Support Score",
    ],
  },
  {
    test: "SRS-2",
    fullName: "Social Responsiveness Scale, Second Edition",
    format: "Multi-informant rating scale",
    oneLine: "Targeted rating of autism-related social impairment.",
    ages: "2:6+",
    whatYoullSee: [
      "Social Awareness",
      "Social Cognition",
      "Social Communication",
      "Social Motivation",
      "Restricted / Repetitive Behaviors",
    ],
    scoresToKnow: [
      "SRS Total T-score",
      "Subscale T-scores",
      "Social Communication and Interaction (SCI) subscale",
    ],
  },
  {
    test: "TABS",
    fullName: "Trauma and Attachment Beliefs Scale",
    format: "Self-report",
    oneLine: "Self-report on five trauma-related belief domains.",
    ages: "9:0+",
    whatYoullSee: ["Safety", "Trust", "Power", "Esteem", "Intimacy"],
    scoresToKnow: [
      "Total Score",
      "Subscale scores for each domain",
    ],
  },
  {
    test: "RSCA",
    fullName: "Resiliency Scales for Children and Adolescents",
    format: "Self-report",
    oneLine: "Strengths-based self-report on resilience and emotional reactivity.",
    ages: "9:0 – 18:11",
    whatYoullSee: [
      "Sense of Mastery",
      "Sense of Relatedness",
      "Emotional Reactivity",
    ],
    scoresToKnow: [
      "Sense of Mastery Index",
      "Sense of Relatedness Index",
      "Emotional Reactivity Index",
      "Resource Index",
      "Vulnerability Index",
    ],
  },
  {
    test: "SCID-5",
    fullName: "Structured Clinical Interview for DSM-5",
    format: "Structured clinical interview",
    oneLine: "Clinician-administered structured interview producing categorical diagnoses.",
    ages: "18:0+",
    whatYoullSee: [
      "Cluster A (Paranoid, Schizoid, Schizotypal)",
      "Cluster B (Antisocial, Borderline, Histrionic, Narcissistic)",
      "Cluster C (Avoidant, Dependent, Obsessive-Compulsive)",
    ],
    scoresToKnow: [
      "Categorical determinations: Present / Absent / Threshold / Subthreshold",
      "Other Specified Personality Disorders",
      "No continuous index scores",
    ],
  },
];

const objectiveGroups: MeasureGroup[] = [
  {
    name: "Broadband cognitive and intellectual batteries",
    blurb: "General-ability batteries used to characterize overall intellectual functioning across verbal, nonverbal, working memory, processing speed, and reasoning domains. Most produce a global composite (e.g., FSIQ) plus index-level scores.",
    tests: ["WAIS-5", "WISC-V", "WPPSI-IV", "WASI-II", "KABC-II", "RBANS", "NAB", "NEPSY-II", "WJ V", "BAYLEY-III", "BSRA", "ACS"],
  },
  {
    name: "Memory",
    blurb: "Standardized verbal and visual memory measures evaluating encoding, storage, retrieval, learning curves, and recognition.",
    tests: ["CVLT-3", "ChAMP", "TOMAL-2"],
  },
  {
    name: "Academic achievement and learning disabilities",
    blurb: "Performance-based achievement batteries and dyslexia / dyscalculia / dysgraphia screeners. Used for educational planning, eligibility decisions, and characterizing specific learning disorders.",
    tests: ["KTEA-3", "WIAT-III", "WRAT5", "FAR", "FAM", "FAW", "TOD", "CTOPP-2", "DEST-II", "DST-J", "DST-II"],
  },
  {
    name: "Language and communication",
    blurb: "Receptive and expressive language batteries plus pragmatic and auditory-processing measures across the lifespan.",
    tests: ["CELF-5 / CELF-P2", "CASL / CASL-II", "PPVT-5", "EVT-3", "PVAT", "CAPs", "SCAN-3"],
  },
  {
    name: "Attention and executive function",
    blurb: "Performance-based measures of attention, processing speed, working memory, set-shifting, inhibition, planning, and abstract reasoning.",
    tests: ["D-KEFS", "WCST", "CPT-III", "PASAT", "TEA", "TEA-Ch"],
  },
  {
    name: "Motor and visual-motor",
    blurb: "Tests of fine motor control, visual perception, and integration between visual input and motor output.",
    tests: ["BEERY (VMI)", "WRAVMA", "FTT"],
  },
  {
    name: "Autism and developmental diagnostic measures",
    blurb: "Semi-structured observations and interviews used to support diagnosis of autism spectrum disorder and related developmental presentations, plus a brief delirium screen for completeness.",
    tests: ["ADOS-2", "MIGDAS-2", "KADI", "CAM"],
  },
  {
    name: "Projective and performance-based personality",
    blurb: "Open-response measures used to characterize social-emotional functioning, perceptual organization, thought process, and interpersonal themes.",
    tests: ["R-PAS", "TAT", "Roberts-2", "Sentence Completion"],
  },
  {
    name: "Performance validity and premorbid functioning",
    blurb: "Standalone and embedded measures of cognitive effort and symptom validity, plus instruments used to estimate pre-injury intellectual ability.",
    tests: ["TOMM", "MSVT", "MVP", "REY-15 (FIT)", "PdPVTS", "ToPF"],
  },
];

const subjectiveGroups: MeasureGroup[] = [
  {
    name: "Mood, anxiety, and depression",
    blurb: "Self-report (and parent / teacher) symptom scales used to quantify severity and track change in depression and anxiety across the lifespan.",
    tests: ["BAI", "BDI-II", "BYI", "CDI-2"],
  },
  {
    name: "Broadband personality inventories",
    blurb: "Multi-scale personality and psychopathology inventories with validity scales and clinical / personality-pattern scales. Used to characterize symptom presentation, personality structure, and response style.",
    tests: ["MMPI-3", "PAI", "MCMI-IV", "MACI-II", "M-PACI"],
  },
  {
    name: "ADHD rating scales and structured interviews",
    blurb: "Multi-informant rating scales and clinician interviews used to assess ADHD symptoms, associated impairments, and common co-occurring problems across childhood and adulthood.",
    tests: ["Conners-4", "BAARS-IV", "DIVA", "KSADS"],
  },
  {
    name: "Broad behavior rating scales (BASC and ASEBA)",
    blurb: "Multi-informant rating scales that capture internalizing, externalizing, and adaptive behaviors across childhood and adulthood. Includes the BASC-3 and the ASEBA family (CBCL, ABCL, and companion forms).",
    tests: ["BASC-3", "CBCL (Child)", "CBCL (Preschool)", "ABCL"],
  },
  {
    name: "Executive function rating scales",
    blurb: "Behavioral ratings of everyday executive functioning at home, school, and work — complements performance-based EF tasks like the D-KEFS or WCST.",
    tests: ["BRIEF-2", "BRIEF-A"],
  },
  {
    name: "Adaptive behavior",
    blurb: "Caregiver / teacher-report measures of conceptual, social, and practical daily-living skills. Often required for intellectual disability and autism diagnoses.",
    tests: ["ABAS-3", "SIB-R"],
  },
  {
    name: "Autism, trauma, and resilience",
    blurb: "Targeted rating scales for social impairment in autism, trauma-related belief structures, and protective / resiliency factors.",
    tests: ["SRS-2", "TABS", "RSCA"],
  },
  {
    name: "Structured diagnostic interview",
    blurb: "Clinician-administered structured interview producing categorical diagnostic determinations.",
    tests: ["SCID-5"],
  },
];

function escapeTableCell(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function buildStudyGuide(
  title: string,
  intro: string,
  studyTips: string[],
  measures: MeasureRow[],
  groups: MeasureGroup[],
): string {
  const byTest = new Map(measures.map((m) => [m.test, m]));
  const out: string[] = [];

  out.push(`# ${title}`);
  out.push("");
  out.push(intro);
  out.push("");

  // How to use this guide
  out.push(`## How to use this guide`);
  out.push("");
  for (const tip of studyTips) out.push(`- ${tip}`);
  out.push("");

  // Master index
  out.push(`## Master index`);
  out.push("");
  out.push(`Jump to a category below. Within each category you'll find a quick-reference table and one card per measure.`);
  out.push("");
  out.push(`| Group | Instruments |`);
  out.push(`|---|---|`);
  for (const g of groups) {
    out.push(`| **${escapeTableCell(g.name)}** | ${escapeTableCell(g.tests.join(", "))} |`);
  }
  out.push("");

  // Per-group sections
  for (const g of groups) {
    out.push(`## ${g.name}`);
    out.push("");
    out.push(g.blurb);
    out.push("");

    // Quick reference table
    out.push(`| Test | Age range | Measures |`);
    out.push(`|---|---|---|`);
    for (const t of g.tests) {
      const m = byTest.get(t);
      if (!m) continue;
      out.push(
        `| **${escapeTableCell(m.test)}** | ${escapeTableCell(m.ages)} | ${escapeTableCell(m.whatYoullSee.join(", "))} |`,
      );
    }
    out.push("");

    // Detailed per-measure cards
    for (const t of g.tests) {
      const m = byTest.get(t);
      if (!m) continue;

      out.push(`### ${m.test} — ${m.fullName}`);
      out.push("");
      out.push(m.oneLine);
      out.push("");
      out.push(`**At a glance**`);
      out.push(`- **Age range:** ${m.ages}`);
      out.push("");
      out.push(`**What you'll see**`);
      for (const d of m.whatYoullSee) out.push(`- ${d}`);
      out.push("");
      out.push(`**Scores to know**`);
      for (const s of m.scoresToKnow) out.push(`- ${s}`);
      out.push("");
      if (m.rememberThis) {
        out.push(`**Remember this**`);
        out.push(`- ${m.rememberThis}`);
        out.push("");
      }
    }
  }

  return out.join("\n");
}

async function ensureTopic(name: string, description: string): Promise<number> {
  const existing = await db
    .select()
    .from(topicsTable)
    .where(eq(topicsTable.name, name));

  if (existing.length > 0) {
    console.log(`  Topic "${name}" already exists (id=${existing[0].id}); reusing`);
    return existing[0].id;
  }

  const [topic] = await db
    .insert(topicsTable)
    .values({ name, category: "Assessment", description })
    .returning();
  console.log(`  Created topic "${name}" (id=${topic.id})`);
  return topic.id;
}

async function replaceStudyGuide(topicId: number, title: string, content: string) {
  const existing = await db
    .select()
    .from(studyGuidesTable)
    .where(eq(studyGuidesTable.topicId, topicId));
  for (const g of existing) {
    await db.delete(studyGuidesTable).where(eq(studyGuidesTable.id, g.id));
  }
  await db.insert(studyGuidesTable).values({ topicId, title, content });
}

async function replaceFlashcards(
  topicId: number,
  cards: { question: string; answer: string; difficulty: string }[],
) {
  await db.delete(flashcardsTable).where(eq(flashcardsTable.topicId, topicId));
  if (cards.length > 0) {
    await db.insert(flashcardsTable).values(
      cards.map((c) => ({ topicId, ...c })),
    );
  }
}

async function replaceQuizQuestions(
  topicId: number,
  questions: {
    question: string;
    optionA: string;
    optionB: string;
    optionC: string;
    optionD: string;
    correctAnswer: string;
    explanation: string;
  }[],
) {
  await db
    .delete(quizQuestionsTable)
    .where(eq(quizQuestionsTable.topicId, topicId));
  if (questions.length > 0) {
    await db.insert(quizQuestionsTable).values(
      questions.map((q) => ({ topicId, ...q })),
    );
  }
}

async function main() {
  console.log("Seeding Assessment measure topics...");

  // -------- Objective Measures --------
  const objectiveId = await ensureTopic(
    "Objective Measures",
    "Standardized, performance-based instruments where the examinee actively completes tasks under controlled conditions and responses are scored against normative data.",
  );

  await replaceStudyGuide(
    objectiveId,
    "Objective Measures — Reference Guide",
    buildStudyGuide(
      "Objective Measures",
      "Objective measures are standardized, performance-based instruments where the examinee actively completes tasks and responses are scored against normative data. Each measure below is grouped by what it primarily assesses, and every card uses the same scannable layout so you can compare instruments quickly.",
      [
        "**Skim the master index first** to anchor where each test lives.",
        "**Use the quick-reference table** at the top of each group to compare format, ages, and purpose at a glance.",
        "**Read the cards** when you need depth — every card follows the same structure: one-line summary, at-a-glance bar, what you'll see, scores to know, and (when useful) a remember-this hook.",
        "**For exam-style recall**, focus on age range, format, and the headline composite or index for each test.",
      ],
      objectiveMeasures,
      objectiveGroups,
    ),
  );

  await replaceFlashcards(objectiveId, [
    { question: "What does the WAIS-5 measure and for what age range?", answer: "The Wechsler Adult Intelligence Scale, Fifth Edition is a broadband cognitive ability measure for adolescents and adults (16:0 – 90:11). It is co-normed with the WMS-5 and yields a Full Scale IQ plus five primary indices: VCI, VSI, FRI, WMI, and PSI.", difficulty: "easy" },
    { question: "What are the five primary index scores on the WISC-V?", answer: "Verbal Comprehension Index (VCI), Visual Spatial Index (VSI), Fluid Reasoning Index (FRI), Working Memory Index (WMI), and Processing Speed Index (PSI). Together with seven primary subtests they generate the Full Scale IQ.", difficulty: "easy" },
    { question: "How does the D-KEFS Color-Word Interference subtest assess executive function?", answer: "It is a Stroop-style task that measures inhibition of automatic responses — the examinee must suppress reading the color word and instead name the ink color, indexing prepotent response inhibition.", difficulty: "medium" },
    { question: "What is the ADOS-2 used for and how is severity quantified?", answer: "The Autism Diagnostic Observation Schedule, Second Edition is a semi-structured observation for autism spectrum disorder. Severity is quantified with the Calibrated Severity Score (CSS) for Social Affect and for Restricted / Repetitive Behaviors. It includes a Toddler Module plus Modules 1–4. Module choice is driven by language level, not age.", difficulty: "medium" },
    { question: "What is the Test of Premorbid Functioning (ToPF) used for?", answer: "It estimates pre-injury intellectual functioning by combining word reading performance with demographic variables to generate a Predicted FSIQ and Predicted GAI with confidence intervals — useful for benchmarking current performance against expected baseline.", difficulty: "medium" },
    { question: "What is the RBANS designed for?", answer: "The Repeatable Battery for the Assessment of Neuropsychological Status is a brief broadband cognitive measure (12:0 – 89:11), often used with older adults. It yields a Total Scale Index plus domain indices for Immediate Memory, Visuospatial / Constructional, Language, Attention, and Delayed Memory. Parallel forms make it the go-to for serial assessment.", difficulty: "easy" },
    { question: "Name three performance validity tests covered in this topic.", answer: "Test of Memory Malingering (TOMM), Medical Symptom Validity Test (MSVT), and the Rey 15-Item Test (REY-15 / FIT). The Pediatric Performance Validity Test Suite (PdPVTS) bundles pediatric versions for ages 5–18.", difficulty: "medium" },
    { question: "What does the CVLT-3 measure and what are its core indices?", answer: "The California Verbal Learning Test, Third Edition assesses verbal learning and memory. Core indices include Total Recall (Trials 1–5 T-score), Short- and Long-Delay Free / Cued Recall, Long-Delay Recognition Hits, False Positives, Discriminability, Response Bias, Intrusions, Repetitions, and Semantic / Serial Clustering. The process scores reveal the strategy behind the score.", difficulty: "hard" },
    { question: "What CHC factors does the WJ V Cognitive Battery measure?", answer: "Comprehension-Knowledge (Gc), Fluid Reasoning (Gf), Short-Term Working Memory (Gwm), Processing Speed (Gs), Auditory Processing (Ga), Long-Term Storage (Gl), Retrieval Fluency (Gr), and Visual Processing (Gv). The WJ V splits the prior Long-Term Retrieval factor into Gl and Gr.", difficulty: "hard" },
    { question: "What is the WCST used to assess?", answer: "The Wisconsin Card Sorting Task assesses executive functioning — particularly abstract reasoning and cognitive shifting. Key scores include Categories Completed, Perseverative Responses, Perseverative Errors, Failure to Maintain Set, and Conceptual Level Responses.", difficulty: "medium" },
    { question: "What do the WIAT-III and KTEA-3 measure?", answer: "Both are comprehensive academic achievement batteries. The WIAT-III (4:0 – 50:11) covers Oral Language, Reading, Written Expression, and Mathematics with a Total Achievement Composite. The KTEA-3 (4:6 – 25:11) yields an Academic Skills Battery composite plus Reading, Math, Written Language, and Oral Language composites.", difficulty: "medium" },
    { question: "What does the BEERY VMI measure and what subtests are included?", answer: "The Beery-Buktenica Developmental Test of Visual-Motor Integration measures visual-motor abilities and includes three subtests: Visual-Motor Integration (integration of visual and motor skills), Visual Perception (visual perceptual skills), and Motor Coordination (motor control).", difficulty: "easy" },
  ]);

  await replaceQuizQuestions(objectiveId, [
    {
      question: "Which measure is co-normed with the WMS-5 and is intended for ages 16:0 to 90:11?",
      optionA: "WAIS-5",
      optionB: "WISC-V",
      optionC: "WPPSI-IV",
      optionD: "WASI-II",
      correctAnswer: "A",
      explanation: "The Wechsler Adult Intelligence Scale, Fifth Edition (WAIS-5) is co-normed with the WMS-5 and covers ages 16:0 – 90:11. WISC-V covers children, WPPSI-IV covers preschoolers, and WASI-II is a brief screen.",
    },
    {
      question: "Which D-KEFS subtest most directly measures inhibition of automatic responses?",
      optionA: "Tower",
      optionB: "Trail Making",
      optionC: "Color-Word Interference",
      optionD: "Twenty Questions",
      correctAnswer: "C",
      explanation: "Color-Word Interference is a Stroop-style task targeting inhibition of automatic responses. Tower taps planning, Trail Making taps cognitive flexibility, and Twenty Questions taps deductive reasoning.",
    },
    {
      question: "Which performance validity test uses a 15-item visual recognition format?",
      optionA: "TOMM",
      optionB: "MSVT",
      optionC: "Rey-15 (FIT)",
      optionD: "PdPVTS",
      correctAnswer: "C",
      explanation: "The Rey 15-Item Visual Memory Test (also called the FIT) presents 15 simple items and yields total correct, recognition, and combined scores with pass / fail cutoffs.",
    },
    {
      question: "Which broadband cognitive battery is brief, repeatable, and frequently used with older adults?",
      optionA: "NAB",
      optionB: "NEPSY-II",
      optionC: "RBANS",
      optionD: "WJ V",
      correctAnswer: "C",
      explanation: "The RBANS is brief, repeatable, and frequently used with older adults — yielding a Total Scale Index and five domain indices.",
    },
    {
      question: "Which projective measure follows a standardized administration system with structured indices like EII-3 and SC-Comp?",
      optionA: "TAT",
      optionB: "Roberts-2",
      optionC: "R-PAS",
      optionD: "Rotter Sentence Completion",
      correctAnswer: "C",
      explanation: "The Rorschach Performance Assessment System (R-PAS) provides standardized administration and structured indices including EII-3, SC-Comp, and TP-Comp on Pages 1 and 2.",
    },
    {
      question: "Which test estimates premorbid intellectual functioning?",
      optionA: "ToPF",
      optionB: "TOMAL-2",
      optionC: "WCST",
      optionD: "PASAT",
      correctAnswer: "A",
      explanation: "The Test of Premorbid Functioning combines word reading and demographic data to predict pre-injury FSIQ and GAI with confidence intervals.",
    },
  ]);

  // -------- Subjective Measures / Rating Scales --------
  const subjectiveId = await ensureTopic(
    "Subjective Measures & Rating Scales",
    "Self-report and informant-report instruments used to characterize symptoms, behavior, personality, and functioning. Includes broadband personality inventories, mood and anxiety scales, behavior rating scales, adaptive behavior measures, and structured diagnostic interviews.",
  );

  await replaceStudyGuide(
    subjectiveId,
    "Subjective Measures & Rating Scales — Reference Guide",
    buildStudyGuide(
      "Subjective Measures & Rating Scales",
      "Subjective measures rely on the examinee, a caregiver, teacher, or other informant to report symptoms, behaviors, and functioning. Each measure below is grouped by what it primarily assesses, and every card uses the same scannable layout so you can compare instruments quickly.",
      [
        "**Always note the informant** — self-report, caregiver, teacher, multi-informant, or structured interview. The informant changes how you interpret the result.",
        "**Look for the headline composite or T-score** for each measure (e.g., GEC for BRIEF-2, GAC for ABAS-3, BSI for BASC-3, Total Score for BAI / BDI-II).",
        "**Pair related measures** — BAI ↔ BDI-II, BRIEF-2 ↔ BRIEF-A, CBCL ↔ ABCL ↔ companion ASEBA forms.",
        "**Watch validity scales** on broadband personality inventories (MMPI-3, PAI, MCMI-IV, MACI-II) — they tell you whether to trust the scores.",
      ],
      subjectiveMeasures,
      subjectiveGroups,
    ),
  );

  await replaceFlashcards(subjectiveId, [
    { question: "What is the BAI used to assess and what is its score range?", answer: "The Beck Anxiety Inventory measures anxiety severity through subjective, neurophysiological, autonomic, and panic symptoms. The Total Score ranges 0–63 with severity classifications: Minimal, Mild, Moderate, Severe (ages 17:0 – 80:11).", difficulty: "easy" },
    { question: "What is the BDI-II used to assess and how is severity classified?", answer: "The Beck Depression Inventory, Second Edition measures depression severity across affective, cognitive, somatic, and vegetative symptoms. Total Score 0–63 with Minimal, Mild, Moderate, and Severe severity bands; includes Cognitive-Affective and Somatic-Vegetative subscales.", difficulty: "easy" },
    { question: "What composites and informant forms does the BASC-3 provide?", answer: "Composites: Behavioral Symptoms Index (BSI), Externalizing Problems, Internalizing Problems, and Adaptive Skills. Forms include Parent, Teacher, and Self-Report — yielding scales for hyperactivity, aggression, conduct, anxiety, depression, somatization, atypicality, withdrawal, attention, adaptability, social skills, leadership, ADL, and functional communication.", difficulty: "medium" },
    { question: "What does the BRIEF-2 measure and what are its three index scores?", answer: "The BRIEF-2 measures executive functioning behaviors at home and school in children and adolescents (5:0 – 18:11). It yields the Global Executive Composite (GEC) and three index scores: Behavioral Regulation Index (BRI), Emotion Regulation Index (ERI), and Cognitive Regulation Index (CRI).", difficulty: "medium" },
    { question: "How do the BRIEF-2 and BRIEF-A differ?", answer: "BRIEF-2 is for children and adolescents (5:0 – 18:11) and produces three indices (BRI, ERI, CRI). BRIEF-A is for adults (18:0 – 90:0) and produces two indices: Behavioral Regulation (BRI) and Metacognition (MI). BRIEF-A includes Self-Report and Informant Report forms.", difficulty: "medium" },
    { question: "What does the SCID-5 cover and what scoring approach does it use?", answer: "The Structured Clinical Interview for DSM-5 covers personality disorders across Cluster A (Paranoid, Schizoid, Schizotypal), Cluster B (Antisocial, Borderline, Histrionic, Narcissistic), Cluster C (Avoidant, Dependent, Obsessive-Compulsive), and Other Specified. It produces categorical determinations (Present / Absent / Threshold / Subthreshold) — no continuous index scores.", difficulty: "medium" },
    { question: "What does the MMPI-3 measure and what are its higher-order scales?", answer: "The Minnesota Multiphasic Personality Inventory, Third Edition is a broadband personality measure. Higher-Order Scales (3): Emotional / Internalizing Dysfunction (EID), Thought Dysfunction (THD), and Behavioral / Externalizing Dysfunction (BXD). It also includes 10 Validity Scales, 9 Restructured Clinical Scales, and PSY-5 Scales.", difficulty: "hard" },
    { question: "What does the ABAS-3 measure and what is the General Adaptive Composite?", answer: "The Adaptive Behavior Assessment System, Third Edition measures daily living skills across Conceptual, Social, and Practical domains. The General Adaptive Composite (GAC) summarizes overall adaptive functioning across skill areas including communication, community use, functional academics, home/school living, health and safety, leisure, self-care, self-direction, social, and work.", difficulty: "medium" },
    { question: "What does the SRS-2 assess?", answer: "The Social Responsiveness Scale, Second Edition identifies the presence and severity of social impairment associated with autism. It yields the SRS Total Score (T-score) and subscales for Social Awareness, Social Cognition, Social Communication, Social Motivation, and Restricted / Repetitive Behaviors plus a Social Communication and Interaction (SCI) subscale.", difficulty: "easy" },
    { question: "What is the Conners-4 used for and what informant forms are available?", answer: "The Conners-4 (Conners Fourth Edition) assesses ADHD symptoms, associated impairments, and common co-occurring problems in children and youth (6:0 – 18:11). It is multi-informant with Parent, Teacher, and Self-Report forms and yields T-scores and percentiles across four Content Scales: Inattention / Executive Dysfunction, Hyperactivity, Impulsivity, and Emotional Dysregulation.", difficulty: "medium" },
    { question: "How does the BAARS-IV approach adult ADHD?", answer: "The Barkley Adult ADHD Rating Scale, Fourth Edition assesses current and retrospective childhood symptoms across Inattention, Hyperactivity, Impulsivity, and Sluggish Cognitive Tempo (SCT). It includes Self-Report and Other-Report forms and provides DSM-5 symptom counts.", difficulty: "medium" },
    { question: "Which measures make up the ASEBA family referenced here?", answer: "Child Behavior Checklist (CBCL) for school-age (6–18) and Preschool (1.5–5), Adult Behavior Checklist (ABCL) for ages 18–59 (observer / collateral report), plus companion forms TRF, YSR, C-TRF, ASR, and OABCL for ages 60+.", difficulty: "hard" },
  ]);

  await replaceQuizQuestions(subjectiveId, [
    {
      question: "Which measure relies on caregiver, teacher, and self-report to assess executive functioning behaviors in children?",
      optionA: "D-KEFS",
      optionB: "BRIEF-2",
      optionC: "WCST",
      optionD: "TEA-Ch",
      correctAnswer: "B",
      explanation: "BRIEF-2 is a behavior rating scale of executive functioning in everyday settings. D-KEFS, WCST, and TEA-Ch are performance-based tasks.",
    },
    {
      question: "Which broadband personality inventory includes Higher-Order scales for Emotional / Internalizing, Thought, and Behavioral / Externalizing Dysfunction?",
      optionA: "PAI",
      optionB: "MCMI-IV",
      optionC: "MMPI-3",
      optionD: "MACI-II",
      correctAnswer: "C",
      explanation: "The MMPI-3 includes the three Higher-Order scales: EID, THD, and BXD, in addition to validity, restructured clinical, and PSY-5 scales.",
    },
    {
      question: "Which measure produces categorical diagnostic determinations (Present / Absent / Threshold / Subthreshold) for DSM-5 personality disorders?",
      optionA: "PAI",
      optionB: "SCID-5",
      optionC: "MMPI-3",
      optionD: "MACI-II",
      correctAnswer: "B",
      explanation: "The SCID-5 is a structured interview that yields categorical determinations across Clusters A, B, C, and Other Specified personality disorders.",
    },
    {
      question: "Which scale captures social impairment in autism through informant ratings across awareness, cognition, communication, motivation, and restricted / repetitive behaviors?",
      optionA: "SRS-2",
      optionB: "ADOS-2",
      optionC: "MIGDAS-2",
      optionD: "KADI",
      correctAnswer: "A",
      explanation: "The Social Responsiveness Scale, Second Edition (SRS-2) is a rating scale across those five subscales. ADOS-2 and MIGDAS-2 are observation-based; KADI distinguishes Asperger's-style presentations from high-functioning autism.",
    },
    {
      question: "Which adaptive behavior measure organizes scores into Conceptual, Social, and Practical domains under a General Adaptive Composite?",
      optionA: "SIB-R",
      optionB: "ABAS-3",
      optionC: "BASC-3",
      optionD: "RSCA",
      correctAnswer: "B",
      explanation: "The ABAS-3 yields a General Adaptive Composite (GAC) and three domain composites: Conceptual, Social, and Practical.",
    },
    {
      question: "Which Beck inventory yields a 0–63 total with Minimal, Mild, Moderate, and Severe classifications and includes Cognitive-Affective and Somatic-Vegetative subscales?",
      optionA: "BAI",
      optionB: "BYI — BANI-Y",
      optionC: "BDI-II",
      optionD: "CDI-2",
      correctAnswer: "C",
      explanation: "The BDI-II measures depression severity (0–63) and includes the Cognitive-Affective and Somatic-Vegetative subscales.",
    },
  ]);

  console.log("✓ Done seeding Assessment measure topics.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
