import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  topicsTable,
  flashcardsTable,
  quizQuestionsTable,
  studyGuidesTable,
  practiceExamsTable,
  practiceExamQuestionsTable,
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
      "**Full Scale IQ (FSIQ)** — overall intellectual ability across the five primary indices; the headline summary score",
      "**Verbal Comprehension Index (VCI)** — verbal reasoning, vocabulary, and acquired word knowledge",
      "**Visual Spatial Index (VSI)** — visual perception, spatial reasoning, and the ability to construct or manipulate visual designs",
      "**Fluid Reasoning Index (FRI)** — novel problem-solving and inductive / quantitative reasoning with minimal reliance on prior knowledge",
      "**Working Memory Index (WMI)** — short-term auditory storage and the ability to mentally manipulate that information",
      "**Processing Speed Index (PSI)** — speed and efficiency of simple visual scanning and graphomotor responding",
      "**General Ability Index (GAI)** — VCI + VSI + FRI; an estimate of overall ability that pulls less from working memory and processing speed",
      "**Cognitive Proficiency Index (CPI)** — WMI + PSI; reflects the efficiency with which cognitive material is registered and acted on",
      "**Nonverbal Index (NVI)** — overall ability estimate with reduced verbal demands; useful when language is a confound",
      "**Nonmotor Index (NMI)** — overall ability with minimal motor and graphomotor demands",
      "**Verbal Expanded Crystallized Index (VECI)** — broader sample of acquired verbal knowledge than VCI alone",
      "**Expanded Fluid Index (EFI)** — broader sample of fluid-reasoning performance",
      "**Quantitative Reasoning Index (QRI)** — numerical and quantitative reasoning",
      "**Expanded Processing Speed Index (EPSI)** — broader sample of processing-speed performance",
      "**Multidomain Reasoning Plus Speed Index (MRPSI)** — reasoning under speeded conditions",
      "**Auditory Working Memory Index — Recall (AWMI-R)** — recall component of auditory working memory",
      "**Auditory Working Memory Index — Manipulation (AWMI-M)** — mental manipulation component of auditory working memory",
      "**Expanded Working Memory Index (EWMI)** — broader sample of working-memory performance across modalities",
      "**Expanded Visual Spatial Index (EVSI)** — broader sample of visual-spatial performance",
      "**Visual Working Memory Index (VWMI)** — short-term storage and manipulation of visual information",
      "**Visual Reasoning Index (VRI)** — reasoning with primarily visual material",
    ],
    rememberThis: "Co-normed with the WMS-5 — pair them when memory and intellect are both in question.",
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
      "**Full Scale IQ (FSIQ)** — overall intellectual ability across the five primary indices",
      "**Verbal Comprehension Index (VCI)** — verbal reasoning, vocabulary, and word knowledge",
      "**Visual Spatial Index (VSI)** — visual perception, spatial reasoning, and design construction",
      "**Fluid Reasoning Index (FRI)** — abstract problem-solving and inductive reasoning with novel material",
      "**Working Memory Index (WMI)** — short-term storage and mental manipulation of auditory information",
      "**Processing Speed Index (PSI)** — speed and accuracy of simple visual processing under time limits",
      "**General Ability Index (GAI)** — overall ability estimate from the verbal and reasoning indices; less affected by working memory and processing speed",
      "**Cognitive Proficiency Index (CPI)** — efficiency composite combining working memory and processing speed",
      "**Nonverbal Index (NVI)** — overall ability with reduced verbal demands",
      "**Expanded Fluid Index (EFI)** — broader sample of fluid-reasoning performance",
      "**Quantitative Reasoning Index (QRI)** — numerical and quantitative reasoning",
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
      "**Full Scale IQ (FSIQ)** — overall intellectual ability across the available age-appropriate indices",
      "**General Ability Index (GAI)** — verbal and visual-spatial composite, less affected by working memory and processing speed",
      "**Verbal Comprehension Index (VCI)** — early vocabulary, word knowledge, and verbal reasoning (all ages)",
      "**Visual Spatial Index (VSI)** — visual perception and basic spatial reasoning (all ages)",
      "**Fluid Reasoning Index (FRI)** — early inductive and quantitative reasoning (ages 4:0 – 7:7)",
      "**Working Memory Index (WMI)** — short-term storage of visual and verbal information (ages 4:0 – 7:7)",
      "**Processing Speed Index (PSI)** — early visual scanning and graphomotor speed (ages 4:0 – 7:7)",
    ],
    rememberThis: "Younger band (2:6 – 3:11) yields VCI, VSI, and FSIQ only; the full five-index profile starts at 4:0.",
  },
  {
    test: "WASI-II",
    fullName: "Wechsler Abbreviated Scale of Intelligence, Second Edition",
    format: "Performance battery (brief)",
    oneLine: "Quick screener of cognitive ability when a full Wechsler isn't needed.",
    ages: "6:0 – 90:11",
    whatYoullSee: ["Verbal Comprehension", "Perceptual Reasoning"],
    scoresToKnow: [
      "**Full Scale IQ — 2 (FSIQ-2)** — quickest estimate of overall ability",
      "**Full Scale IQ — 4 (FSIQ-4)** — more reliable estimate of overall ability",
      "**Verbal Comprehension Index (VCI)** — verbal reasoning and word knowledge",
      "**Perceptual Reasoning Index (PRI)** — visual-spatial and fluid reasoning",
    ],
    rememberThis: "Pick FSIQ-2 for a fast screen; FSIQ-4 when you need a more dependable estimate.",
  },
  {
    test: "KABC-II",
    fullName: "Kaufman Assessment Battery for Children, Second Edition",
    format: "Performance battery",
    oneLine: "Children's IQ battery with two interpretive frameworks.",
    ages: "3:0 – 18:11",
    whatYoullSee: [
      "Sequential Processing",
      "Simultaneous Processing",
      "Learning",
      "Planning",
      "Knowledge",
    ],
    scoresToKnow: [
      "**Mental Processing Index (MPI)** — overall ability estimate built from reasoning, memory, and visual processing; pulls minimally from acquired knowledge, useful when crystallized knowledge could be a confound",
      "**Fluid-Crystallized Index (FCI)** — overall ability estimate that includes acquired knowledge alongside reasoning and processing",
      "**Sequential Processing scale** — short-term and working memory for information presented in serial order",
      "**Simultaneous Processing scale** — visual processing and the ability to integrate spatial information into a whole",
      "**Learning scale** — paired-associate learning and storage of new information",
      "**Planning scale** — fluid reasoning and strategy formation (school-age and older)",
      "**Knowledge scale** — vocabulary and acquired verbal knowledge (school-age and older)",
    ],
    rememberThis: "Use the MPI when language or cultural background could disadvantage a knowledge-loaded score; use the FCI when acquired learning is part of the question.",
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
      "**Total Scale Index** — overall cognitive estimate across the five domains",
      "**Immediate Memory Index** — list and story learning across initial trials",
      "**Visuospatial / Constructional Index** — visual perception, line orientation, and figure copy",
      "**Language Index** — picture naming and semantic fluency",
      "**Attention Index** — basic attention and short-term auditory span",
      "**Delayed Memory Index** — recall and recognition of list, story, and figure information after a delay",
    ],
    rememberThis: "Parallel forms make it the go-to for serial assessment after stroke or traumatic brain injury.",
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
      "**Total NAB Index** — overall cognitive estimate across all five modules",
      "**Attention Module Index** — basic and complex attention, working memory, and processing speed",
      "**Language Module Index** — naming, comprehension, reading, and writing",
      "**Memory Module Index** — verbal and visual learning and recall",
      "**Spatial Module Index** — visual discrimination, design construction, and visuospatial judgment",
      "**Executive Functions Module Index** — concept formation, generative fluency, and judgment",
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
      "**Attention and Executive Functioning domain** — sustained attention, inhibition, set-shifting, and planning",
      "**Language domain** — phonological processing, oral comprehension, and verbal generativity",
      "**Memory and Learning domain** — verbal and visual encoding, recall, and recognition",
      "**Sensorimotor domain** — fine motor control, imitation, and sensory perception",
      "**Visuospatial Processing domain** — visual discrimination, geometric reasoning, and route finding",
      "**Social Perception domain** — recognition of facial affect and theory of mind",
    ],
    rememberThis: "There is no global IQ-equivalent — interpret at the domain level.",
  },
  {
    test: "WJ V",
    fullName: "Woodcock-Johnson Tests, Fifth Edition",
    format: "Performance battery",
    oneLine: "Combined cognitive + achievement battery; fully digital.",
    ages: "2:0 – 90:11",
    whatYoullSee: [
      "Cognitive abilities",
      "Academic achievement",
    ],
    scoresToKnow: [
      "**General Intellectual Ability (GIA)** — overall cognitive estimate from the cognitive battery",
      "**Brief Intellectual Ability (BIA)** — quick estimate of overall ability",
      "**Comprehension-Knowledge cluster** — vocabulary, general knowledge, and verbal reasoning",
      "**Fluid Reasoning cluster** — novel problem solving and inductive / deductive reasoning",
      "**Short-Term Working Memory cluster** — short-term storage and mental manipulation",
      "**Processing Speed cluster** — speed of simple cognitive tasks under timed conditions",
      "**Auditory Processing cluster** — analysis and synthesis of speech sounds",
      "**Long-Term Storage cluster** — encoding and storage of new information into long-term memory",
      "**Retrieval Fluency cluster** — speed and ease of retrieving stored information",
      "**Visual Processing cluster** — analyzing and manipulating visual patterns and spatial information",
      "**Broad Achievement Composite** — overall academic achievement across the academic clusters",
      "**Reading cluster** — word identification, reading fluency, and comprehension",
      "**Math cluster** — calculation, fluency, and applied problem solving",
      "**Written Language cluster** — spelling, writing fluency, and written expression",
      "**Oral Language cluster** — listening comprehension and oral expression",
      "**Academic Knowledge cluster** — knowledge of science, social studies, and humanities content",
      "**Academic Skills, Academic Fluency, and Academic Applications composites** — cross-domain measures of basic skill, speeded performance, and applied use",
    ],
    rememberThis: "Cognitive and achievement batteries can be co-administered, so cognitive-academic discrepancies are easy to interpret on the same normative sample.",
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
      "**Cognitive Scale Index** — early problem solving, exploration, and concept development",
      "**Receptive Communication scale** — what the child understands from spoken language and gesture",
      "**Expressive Communication scale** — what the child produces verbally and pre-verbally",
      "**Language Composite** — combined Receptive + Expressive Communication",
      "**Fine Motor scale** — precise grasping, manipulation, and visual-motor coordination",
      "**Gross Motor scale** — large-muscle control, balance, and locomotion",
      "**Motor Composite** — combined Fine + Gross Motor",
      "**Social-Emotional Scale (caregiver report)** — interactive engagement, self-regulation, and emotional reciprocity",
      "**Adaptive Behavior Composite (caregiver report)** — daily-living, social, and conceptual functioning",
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
      "**School Readiness Composite (SRC)** — overall readiness across the early-concept domains assessed",
      "**Domain scores** — Colors, Letters / Sounds, Numbers / Counting, Sizes / Comparisons, and Shapes",
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
      "Effort / Validity",
      "Daily Living Skills",
      "Premorbid Functioning",
    ],
    scoresToKnow: [
      "**Social Perception Score** — recognition of facial affect and prosody",
      "**Word Choice and Reliable Digit Span** — embedded effort / validity scores",
      "**Activities of Daily Living Scale (ADLS)** — informant-rated everyday functioning",
      "**Test of Premorbid Functioning (ToPF)** — predicted FSIQ and GAI based on word reading and demographics",
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
      "**Total Recall (Trials 1–5)** — total words recalled across the five learning trials; the headline learning score",
      "**Short-Delay Free Recall** — words recalled spontaneously after the interference list",
      "**Short-Delay Cued Recall** — words recalled after semantic category cues",
      "**Long-Delay Free Recall** — spontaneous recall after a 20-minute delay",
      "**Long-Delay Cued Recall** — recall after the long delay with semantic cues",
      "**Long-Delay Recognition Hits and False Positives** — discriminating learned words from foils",
      "**Discriminability Index** — overall accuracy of recognition (hits versus false positives)",
      "**Response Bias (c)** — tendency to say 'yes' versus 'no' on recognition",
      "**Process scores — Intrusions, Repetitions, Semantic / Serial Clustering** — reveal the learning strategy used, not just the totals",
    ],
    rememberThis: "Process scores (intrusions, clustering, response bias) reveal the strategy behind the score, not just the headline number.",
  },
  {
    test: "ChAMP",
    fullName: "Child and Adolescent Memory Profile",
    format: "Performance",
    oneLine: "Verbal and visual memory battery for children and teens.",
    ages: "5:0 – 21:11",
    whatYoullSee: ["Verbal Memory", "Visual Memory"],
    scoresToKnow: [
      "**Verbal Memory Index** — encoding and recall of word-list and story material",
      "**Visual Memory Index** — encoding and recall of visual designs and locations",
      "**Learning and Memory Index** — overall composite combining verbal and visual learning",
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
      "**Composite Memory Index (CMI)** — overall memory composite across verbal and nonverbal material",
      "**Verbal Memory Index (VMI)** — list, story, and paired-associate verbal learning",
      "**Nonverbal Memory Index (NMI)** — recall of visual designs, locations, and faces",
      "**Delayed Recall Index (DRI)** — retention of learned material after a delay",
      "**Learning Index (LI)** — improvement across repeated learning trials",
      "**Attention / Concentration Index (ACI)** — short-term attention and digit / letter span",
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
      "**Academic Skills Battery (ASB) Composite** — overall achievement across reading, math, and written language",
      "**Reading Composite** — letter / word recognition, reading comprehension, and fluency",
      "**Math Composite** — calculation, problem solving, and math fluency",
      "**Written Language Composite** — spelling, written expression, and writing fluency",
      "**Oral Language Composite** — listening comprehension and oral expression",
      "**Sound-Symbol Composite** — letter-sound knowledge and decoding-related skills",
      "**Decoding Composite** — phonetic and word-attack skills",
      "**Reading Fluency Composite** — speed of single-word and connected-text reading",
      "**Reading Understanding Composite** — comprehension of read material",
      "**Oral Fluency Composite** — speed of word and sentence-level oral production",
      "**Comprehension Composite** — understanding across reading and listening",
      "**Expression Composite** — writing and oral expression",
      "**Orthographic Processing Composite** — recognition of letter patterns and spelling-relevant visual processing",
      "**Academic Fluency Composite** — speed across reading, math, and writing fluency tasks",
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
      "**Total Achievement Composite** — overall academic achievement across all domains",
      "**Oral Language Composite** — listening comprehension and oral expression",
      "**Total Reading Composite** — overall reading skill across decoding, comprehension, and fluency",
      "**Basic Reading Composite** — single-word reading and pseudoword decoding",
      "**Reading Comprehension and Fluency Composite** — connected-text reading speed and understanding",
      "**Written Expression Composite** — spelling, sentence composition, and essay writing",
      "**Mathematics Composite** — numerical operations and applied problem solving",
      "**Math Fluency Composite** — speed of basic addition, subtraction, and multiplication",
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
      "**Word Reading** — single-word recognition and pronunciation",
      "**Sentence Comprehension** — comprehension of brief written sentences with cloze-style items",
      "**Spelling** — written spelling of dictated words",
      "**Math Computation** — paper-and-pencil arithmetic",
      "**Reading Composite** — Word Reading + Sentence Comprehension; an overall reading estimate",
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
      "**Global Reading Index (GRI)** — overall reading achievement composite",
      "**Phonological Index** — decoding, sound blending, and other sound-based reading processes (phonological dyslexia profile)",
      "**Surface Index** — orthographic / sight-word recognition and spelling (surface dyslexia profile)",
      "**Mixed Index** — combined breakdown across phonological and orthographic systems",
      "**Process scores** — finer-grained scores that pinpoint specific reading processes for intervention planning",
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
      "**Global Math Index (GMI)** — overall mathematics achievement composite",
      "**Procedural Index** — calculation, computation, and execution of math procedures",
      "**Verbal Index** — verbal mathematical reasoning, word problems, and language demands of math",
      "**Semantic Index** — number sense, magnitude estimation, and mathematical concepts",
      "**Process scores** — finer-grained scores that pinpoint specific math processes for intervention planning",
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
      "**Global Writing Index (GWI)** — overall writing achievement composite",
      "**Phonological Index** — sound-based spelling errors (phonological dysgraphia profile)",
      "**Surface Index** — orthographic / sight-word spelling errors (surface dysgraphia profile)",
      "**Mixed Index** — combined breakdown across phonological and orthographic systems",
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
      "**Total Dyslexia Index (TDI)** — overall composite indicating dyslexia risk and severity",
      "**Phonological Awareness Index** — manipulation of speech sounds (segmentation, blending, deletion)",
      "**Rapid Automatized Naming Index** — speed of retrieving familiar visual symbols",
      "**Orthographic Processing Index** — recognition of letter patterns and visual word forms",
      "**Reading Fluency Index** — speed and accuracy of connected-text reading",
      "**Reading Comprehension Index** — understanding of read material",
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
      "**Phonological Awareness Composite** — manipulation of phonemes, syllables, and rhymes",
      "**Phonological Memory Composite** — short-term storage of phonological information",
      "**Rapid Symbolic Naming Composite** — speed of naming familiar letters and digits",
      "**Rapid Non-Symbolic Naming Composite** — speed of naming familiar colors and objects",
      "**Alternative Phonological Awareness Composite** — additional phonological tasks for in-depth analysis",
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
      "**At-Risk Quotient (ARQ)** — overall risk indicator for early reading difficulty",
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
      "**Screening Score** — overall At-Risk / Not At-Risk classification",
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
      "**Screening Score** — overall At-Risk / Not At-Risk classification",
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
      "**Core Language Score (CLS)** — headline composite of overall language ability",
      "**Receptive Language Index** — comprehension of words, sentences, and directions",
      "**Expressive Language Index** — production of words, sentences, and structured spoken language",
      "**Language Content Index** — semantic knowledge — what words and ideas mean",
      "**Language Structure Index** — syntactic and morphological skills — how language is put together",
      "**Language Memory Index** — short-term recall and manipulation of language material",
      "**Pragmatics Profile** — functional and social use of language",
      "**Reading and Writing Index** — connected-text reading and written expression (older ages)",
    ],
  },
  {
    test: "CASL / CASL-II",
    fullName: "Comprehensive Assessment of Spoken Language",
    format: "Performance",
    oneLine: "Oral language battery covering comprehension and expression across four domains.",
    ages: "3:0 – 21:11",
    whatYoullSee: [
      "Lexical / Semantic",
      "Syntactic",
      "Supralinguistic",
      "Pragmatic",
    ],
    scoresToKnow: [
      "**Oral Language Index (OLI)** — overall composite of spoken-language ability",
      "**Core Language Index** — primary composite of core spoken-language ability",
      "**Lexical / Semantic Index** — word knowledge and meaning",
      "**Syntactic Index** — sentence structure and grammar",
      "**Supralinguistic Index** — higher-order language including inference, ambiguity, and figurative language",
      "**Pragmatic Index** — social use of language in context",
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
      "**Receptive Vocabulary Standard Score** — single-word listening vocabulary",
      "**Growth Scale Value (GSV)** — vocabulary on a continuous, age-independent scale; useful for tracking change over time",
    ],
    rememberThis: "Pairs naturally with the EVT-3 — receptive vocabulary (PPVT) versus expressive vocabulary (EVT).",
  },
  {
    test: "EVT-3",
    fullName: "Expressive Vocabulary Test, Third Edition",
    format: "Performance",
    oneLine: "Expressive vocabulary and word retrieval — name the picture.",
    ages: "2:6 – 90+",
    whatYoullSee: ["Expressive Vocabulary", "Word Retrieval"],
    scoresToKnow: [
      "**Expressive Vocabulary Total Score** — single-word labeling and synonym-generation vocabulary",
      "**Growth Scale Value (GSV)** — expressive vocabulary on a continuous, age-independent scale",
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
      "**Acquisition Score** — total receptive vocabulary acquired",
      "**Vocabulary Age Equivalent** — age-equivalent estimate of vocabulary level",
      "**Language Acquisition Index** — composite estimate of vocabulary development",
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
      "**Pragmatic Language Index** — overall composite of functional and social language use",
      "**Domain scores** — Utterance, Discourse, Nonliteral Language, Nonverbal Communication, and Social Relations",
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
      "**Composite Score** — overall auditory-processing composite",
      "**Filtered Words** — recognition of words with degraded acoustic information",
      "**Auditory Figure Ground** — speech recognition against a background of noise",
      "**Competing Words** — recognition of two different words presented to each ear simultaneously",
      "**Competing Sentences** — recognition of competing sentences across the two ears",
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
      "**Color-Word Interference (Stroop)** — inhibition of automatic word reading to name ink color; measures response inhibition and switching",
      "**Design Fluency** — generating novel visual designs under time and rule constraints; measures visual fluency and rule monitoring",
      "**Proverb Test** — interpreting figurative language; measures abstract verbal reasoning",
      "**Sorting Test** — sorting cards by self-generated rules; measures cognitive flexibility and concept formation",
      "**Tower Test** — moving disks to a goal state in the fewest moves; measures spatial planning and impulse control",
      "**Trail Making Test** — alternating between numbers and letters; measures visual-motor set shifting",
      "**Twenty Questions** — narrowing categories with yes/no questions; measures deductive reasoning",
      "**Verbal Fluency** — generating words by letter or category, including switching; measures generative fluency",
      "**Word Context** — inferring word meanings from sentence clues; measures verbal abstraction",
    ],
    rememberThis: "There is no global summary score — interpret each task's scaled scores individually and look at the pattern across tasks.",
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
      "**Categories Completed** — number of sorting categories successfully solved",
      "**Perseverative Responses** — repeated use of a sorting rule that is no longer correct",
      "**Perseverative Errors** — perseverative responses that were also incorrect",
      "**Non-Perseverative Errors** — incorrect responses that were not perseverative",
      "**Conceptual Level Responses** — strings of correct responses suggesting genuine understanding of the rule",
      "**Trials to Complete First Category** — efficiency of initial concept formation",
      "**Failure to Maintain Set** — losing a correct sorting rule mid-category",
      "**Learning to Learn** — improvement in efficiency from one category to the next",
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
      "**Detectability (d')** — sensitivity to detecting targets versus non-targets",
      "**Omissions** — missed targets (inattention indicator)",
      "**Commissions** — responses to non-targets (impulsivity indicator)",
      "**Perseverations** — extra responses too quickly after the prior one",
      "**Hit Reaction Time** — average response speed to targets",
      "**Hit Reaction Time Standard Error** — variability in response speed",
      "**Variability** — inconsistency of response timing across the task",
      "**Response Style (Beta)** — overall tendency to respond cautiously or impulsively",
      "**ADHD Confidence Index** — overall index of similarity to clinical ADHD profiles",
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
      "**PASAT Total Score** — total correct sums across the trial; the headline score",
      "**Paced Serial Addition Score** — performance at each stimulus rate (typically 2.4 and 1.6 seconds between digits)",
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
      "**Selective Attention** — focusing on a target while ignoring distractors",
      "**Sustained Attention** — maintaining attention over time on a low-stimulation task",
      "**Attentional Switching** — flexibility in shifting attention between targets",
      "**Task scores** — derived from everyday-style tasks tapping each attention domain",
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
      "**Overall Attention Score** — composite estimate across the attention domains",
      "**Selective Attention** — focusing on a target while ignoring competing visual information",
      "**Sustained Attention** — maintaining attention over time on a low-stimulation task",
      "**Attentional Control / Switching** — flexibly shifting attention between rules or targets",
      "**Response Inhibition** — withholding a prepotent motor response on cue",
    ],
  },
  {
    test: "BEERY (VMI)",
    fullName: "Beery-Buktenica Developmental Test of Visual-Motor Integration",
    format: "Performance",
    oneLine: "Copy-the-design test of visual-motor integration with supplemental visual perception and motor coordination components.",
    ages: "2:0 – 18:11; 19:0 – 100:11",
    whatYoullSee: [
      "Visual-Motor Integration (copy designs)",
      "Visual Perception",
      "Motor Coordination",
    ],
    scoresToKnow: [
      "**Visual-Motor Integration Standard Score** — main composite from the design-copy task",
      "**Visual Perception Standard Score** — discrimination of forms without a motor component",
      "**Motor Coordination Standard Score** — tracing precision without a perceptual judgment component",
    ],
    rememberThis: "Comparing the VMI score to the supplemental Visual Perception and Motor Coordination scores helps tell whether a low VMI is driven by perception, motor control, or the integration of the two.",
  },
  {
    test: "WRAVMA",
    fullName: "Wide Range Assessment of Visual Motor Abilities",
    format: "Performance",
    oneLine: "Visual-motor battery with separate drawing, matching, and pegboard tasks.",
    ages: "3:0 – 17:11",
    whatYoullSee: ["Drawing", "Matching", "Pegboard"],
    scoresToKnow: [
      "**Drawing Standard Score** — design-copy performance",
      "**Matching Standard Score** — visual-perceptual matching without a motor demand",
      "**Pegboard Standard Score** — fine motor control without a perceptual demand",
      "**Visual Motor Integration Composite** — overall integration of visual perception and motor control",
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
      "**Dominant Hand Tapping Rate** — average taps per 10-second trial with the dominant hand",
      "**Non-Dominant Hand Tapping Rate** — average taps per trial with the non-dominant hand",
      "**Dominant / Non-Dominant Ratio** — typical asymmetry; deviations can suggest lateralized motor problems",
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
      "**Toddler Module (12–30 months)** — administered to infants and young toddlers; uses Ranges of Concern instead of cutoff scores",
      "**Module 1** — for examinees with no consistent phrase speech",
      "**Module 2** — for examinees with phrase speech but not yet fluent",
      "**Module 3** — for verbally fluent children and younger adolescents",
      "**Module 4** — for verbally fluent older adolescents and adults",
      "**Calibrated Severity Score (CSS) — Social Affect (SA)** — severity of social-communication symptoms on a 1–10 scale",
      "**Calibrated Severity Score (CSS) — Restricted and Repetitive Behaviors (RRB)** — severity of restricted-repetitive behavior symptoms on a 1–10 scale",
      "**Overall CSS** — combined severity score across SA and RRB",
    ],
    rememberThis: "Choose the module by the examinee's expressive language level — not by chronological age.",
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
      "**Overall Autism Spectrum Rating** — clinician-derived determination of autism spectrum presentation",
      "**Sensory Use and Interests / Repetitive Behaviors domain** — sensory-driven behavior and routines",
      "**Social and Emotional Skills domain** — reciprocal social engagement and emotional understanding",
      "**Language domain** — qualitative description of communicative language use",
      "**Cognitive Awareness domain** — examinee's self-understanding of their experience",
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
    scoresToKnow: [
      "**Asperger's Index (Total Score)** — overall likelihood that the presentation is more consistent with an Asperger's-style profile than high-functioning autism",
      "**Subscale ratings** — Language, Social Interaction, Sensory / Motor, and Behavioral Patterns",
    ],
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
      "**CAM Algorithm Score** — Delirium Present versus Delirium Absent",
      "**Feature 1 — Acute Onset and Fluctuating Course** — required for a positive screen",
      "**Feature 2 — Inattention** — required for a positive screen",
      "**Feature 3 — Disorganized Thinking** — supports a positive screen",
      "**Feature 4 — Altered Level of Consciousness** — supports a positive screen",
    ],
    rememberThis: "Algorithm: Features 1 and 2 must both be present, plus either Feature 3 or Feature 4.",
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
      "**Page 1 — Engagement and Cognitive Processing** — complexity, organization, and effort invested in responses",
      "**Page 1 — Memory** — accuracy and clarity of perception",
      "**Page 1 — Perception and Thinking Problems** — markers of disordered thinking and perceptual distortion",
      "**Page 2 — Stress and Distress** — markers of acute distress, dysphoria, and morbid imagery",
      "**Page 2 — Self and Other Representation** — interpersonal themes and self-representation",
      "**Complexity** — overall richness and organization of responses",
      "**Ego Impairment Index — 3 (EII-3)** — composite of perceptual, thinking, and reality-testing problems",
      "**Suicide Concern Composite (SC-Comp)** — composite of variables associated with suicide risk",
      "**Thought and Perception Composite (TP-Comp)** — composite of thought and perceptual disturbance variables",
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
      "**No standardized index scores** — interpretation is qualitative",
      "**Themes** — recurring story themes (e.g., achievement, aggression, intimacy)",
      "**Needs and Press** — needs of the central character and environmental forces acting on them",
      "**Narrative structure** — coherence, perspective-taking, and resolution of the stories",
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
      "**Theme Overview Scales** — recurring story themes (popular versus atypical content)",
      "**Available Resources Scales** — interpersonal supports the child draws on (Reliance on Others, Support, Family Acceptance, Limit Setting)",
      "**Problem Identification, Resolution, Emotion, and Outcome scales** — story-construction process variables",
      "**Clinical Scales** — Anxiety, Aggression, Depression, Rejection, and Unusual / Atypical Responses",
      "**Ego Functioning Scales** — broad indicators of self-organization and emotional tone",
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
      "**Adjustment Score** — overall maladjustment estimate from the rated stem responses",
      "**Individual item ratings** — each completed stem is scored on a conflict / neutral / positive scale",
    ],
  },
  {
    test: "TOMM",
    fullName: "Test of Memory Malingering",
    format: "Performance validity test",
    oneLine: "Visual-recognition validity measure used to assess effort.",
    ages: "16:0 – 84:11",
    whatYoullSee: ["Trial 1", "Trial 2", "Retention", "Recognition"],
    scoresToKnow: [
      "**Trial 1** — initial recognition learning",
      "**Trial 2** — recognition after a second study trial; the headline trial",
      "**Retention** — recognition after a delay",
      "**Pass / Fail cutoffs** — standard cutoffs flag suboptimal effort regardless of true cognitive ability",
    ],
  },
  {
    test: "MSVT",
    fullName: "Medical Symptom Validity Test",
    format: "Performance validity test (computerized)",
    oneLine: "Brief computerized validity measure with embedded recall and recognition trials.",
    ages: "Adult",
    whatYoullSee: [
      "Immediate Recognition",
      "Delayed Recognition",
      "Consistency",
    ],
    scoresToKnow: [
      "**Immediate Recognition (IR)** — recognition after immediate exposure",
      "**Delayed Recognition (DR)** — recognition after a delay",
      "**Consistency (CNS)** — agreement between IR and DR",
      "**Paired Associates (PA)** — recall of the paired-associate items",
      "**Free Recall (FR)** — spontaneous recall without cues",
      "**Pass / Fail cutoffs** — IR, DR, and CNS each carry a cutoff for valid effort",
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
      "**Immediate Memory Index** — performance on the immediate recognition trial",
      "**Delayed Memory Index** — performance on the delayed recognition trial",
      "**Consistency Index** — agreement between the immediate and delayed trials",
      "**Pass / Fail determination** — standard cutoffs flag suboptimal effort",
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
      "**Total Correct Score (0–15)** — number of items recalled from the simple visual array",
      "**Recognition Score** — items correctly identified on a recognition trial",
      "**Combined Score** — recall plus recognition; the primary effort indicator",
      "**Pass / Fail cutoffs** — cutoffs flag suboptimal effort even when actual memory is intact",
    ],
  },
  {
    test: "PdPVTS",
    fullName: "Pediatric Performance Validity Test Suite",
    format: "Performance validity test (battery)",
    oneLine: "Pediatric validity battery bundling several effort measures.",
    ages: "5:0 – 18:11",
    whatYoullSee: [
      "Performance Validity",
      "Memory Validity",
      "Effort",
    ],
    scoresToKnow: [
      "**Performance Validity Index** — overall composite across the bundled validity measures",
      "**Component scores** — TOMM-C (child version of the TOMM), MSVT-C, and Rey-15-C",
      "**Pass / Fail classification** — bundled effort decision for pediatric / adolescent assessment",
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
      "**Predicted FSIQ** — predicted pre-injury Full Scale IQ from word reading combined with demographic variables",
      "**Predicted GAI** — predicted pre-injury General Ability Index",
      "**Confidence intervals** — bounds on the predicted scores; useful for benchmarking current performance against expected baseline",
    ],
    rememberThis: "Use the predicted scores as the 'expected baseline' before interpreting current cognitive performance.",
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
      "**Total Score (0–63)** — overall anxiety severity",
      "**Severity bands** — Minimal (0–7), Mild (8–15), Moderate (16–25), Severe (26–63)",
      "**Item content** — sorts into Subjective Anxiety, Neurophysiological, Autonomic, and Panic symptom clusters",
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
      "**Total Score (0–63)** — overall depression severity",
      "**Severity bands** — Minimal (0–13), Mild (14–19), Moderate (20–28), Severe (29–63)",
      "**Cognitive-Affective Subscale** — guilt, hopelessness, and self-criticism items",
      "**Somatic-Vegetative Subscale** — sleep, appetite, fatigue, and concentration items",
    ],
    rememberThis: "Same 0–63 range as the BAI — keep the populations and severity bands straight.",
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
      "**BDI-Y — Depression** — sad mood, negative thoughts about self, and life concerns",
      "**BAI-Y — Anxiety** — worry, fearful thoughts, and physiological symptoms of anxiety",
      "**BANI-Y — Anger** — angry thoughts, physiological arousal, and reactivity to others",
      "**BDBI-Y — Disruptive Behavior** — defiance, conduct problems, and antisocial-style attitudes",
      "**BSCI-Y — Self-Concept** — self-perceived competence and self-worth (higher scores = better self-concept)",
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
      "**Total Score** — overall depressive-symptom severity",
      "**Emotional Problems composite** — mood and self-evaluation difficulties (Negative Mood / Physical Symptoms, Negative Self-Esteem)",
      "**Functional Problems composite** — interference with daily life (Ineffectiveness, Interpersonal Problems)",
      "**Self-Report, Parent, and Teacher forms** — multi-informant view of the child's symptoms",
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
      "**VRIN-r — Variable Response Inconsistency** — random or careless responding",
      "**TRIN-r — True Response Inconsistency** — fixed yes-saying or no-saying response sets",
      "**CRIN — Combined Response Inconsistency** — overall inconsistent responding",
      "**F-r — Infrequent Responses** — endorsement of items rare in the general population",
      "**Fp-r — Infrequent Psychopathology Responses** — items rare even in clinical samples (suggests overreporting)",
      "**Fs — Infrequent Somatic Responses** — endorsement of unusual somatic complaints",
      "**FBS-r — Symptom Validity Scale** — pattern of complaints associated with non-credible symptom reporting",
      "**RBS — Response Bias Scale** — non-credible cognitive complaints",
      "**L-r — Uncommon Virtues** — over-claiming of positive attributes (defensive responding)",
      "**K-r — Adjustment Validity** — defensive minimization of psychological problems",
      "**EID — Emotional / Internalizing Dysfunction** — broad internalizing distress (anxiety, depression, demoralization)",
      "**THD — Thought Dysfunction** — disordered thinking and unusual perceptual experiences",
      "**BXD — Behavioral / Externalizing Dysfunction** — impulsivity, antisocial behavior, and acting out",
      "**Restructured Clinical (RC) Scales (9)** — focused, lower-overlap revisions of the original Clinical Scales",
      "**Somatic / Cognitive Scales (10)** — health, neurological, and cognitive complaints",
      "**Internalizing Scales (9)** — fine-grained internalizing constructs (anxiety, fears, anger proneness, etc.)",
      "**Externalizing Scales (7)** — substance use, antisocial behavior, and impulsivity",
      "**Interpersonal Scales (4)** — family problems, interpersonal passivity, social avoidance, and disaffiliativeness",
      "**PSY-5 Scales (5)** — Aggressiveness, Psychoticism, Disconstraint, Negative Emotionality / Neuroticism, and Introversion / Low Positive Emotionality",
      "**Interest Scales (2)** — Aesthetic-Literary and Mechanical-Physical interests",
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
      "**Validity Scales (4)** — Inconsistency, Infrequency, Negative Impression Management, and Positive Impression Management",
      "**Clinical Scales (11)** — Somatic Complaints, Anxiety, Anxiety-Related Disorders, Depression, Mania, Paranoia, Schizophrenia, Borderline Features, Antisocial Features, Alcohol Problems, Drug Problems",
      "**Treatment Consideration Scales (5)** — Aggression, Suicidal Ideation, Stress, Nonsupport, and Treatment Rejection",
      "**Interpersonal Scales (2)** — Dominance and Warmth (interpersonal style, not pathology)",
      "**Subscales (31)** — finer-grained subscales nested within select clinical scales (e.g., DEP-Cognitive, ANX-Physiological)",
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
      "**Modifying Indices** — Disclosure, Desirability, Debasement, and an Invalidity index assess response style",
      "**Clinical Personality Pattern Scales (14)** — long-standing personality styles and traits",
      "**Severe Personality Pathology Scales (3)** — more severe and dysregulated personality patterns (Schizotypal, Borderline, Paranoid)",
      "**Clinical Syndrome Scales (10)** — current symptom syndromes such as Anxiety, PTSD, Bipolar Spectrum, and Major Depression",
      "**Severe Clinical Syndrome Scales (3)** — Thought Disorder, Major Depression severity, and Delusional Disorder",
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
      "**Personality Patterns Scales (12)** — adolescent personality styles such as Submissive, Dramatizing, Egotistic, and Unruly",
      "**Expressed Concerns Scales (8)** — concerns relevant to adolescence including Identity Diffusion, Body Disapproval, Family Discord, and Childhood Abuse",
      "**Clinical Syndromes Scales (7)** — current symptom syndromes such as Eating Dysfunctions, Substance Misuse Proneness, and Suicidality",
      "**Modifying Indices** — Disclosure, Desirability, and Debasement assess adolescent response style",
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
      "**Personality Patterns scales** — Confident, Outgoing, Conforming, Submissive, Inhibited, Unruly, and Unstable",
      "**Expressed Concerns scales** — Reality Distortions, Childhood Abuse, Anxiety / Fears, and Disruptive Behaviors",
      "**Clinical Signs scales** — Depressive Moods, Cognitive Deficits, and Attention Deficits",
      "**No global composite** — interpretation is at the scale level",
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
      "**Inattention / Executive Dysfunction Scale** — symptoms of inattention and everyday executive-functioning difficulties",
      "**Hyperactivity Scale** — overactive motor behavior and restlessness",
      "**Impulsivity Scale** — acting without thinking, interrupting, and difficulty waiting",
      "**Emotional Dysregulation Scale** — irritability, frustration tolerance, and emotional reactivity",
      "**Multi-informant T-scores and percentiles** — Parent, Teacher, and Self-Report forms scored on the same metric",
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
      "**Inattention Total Score** — current inattentive symptoms",
      "**Hyperactivity Total Score** — current hyperactive symptoms",
      "**Impulsivity Total Score** — current impulsive symptoms",
      "**Sluggish Cognitive Tempo (SCT) Total Score** — daydreaming, mental fog, and slowed cognitive style",
      "**Current Symptoms scale** — adult symptom count over the past six months",
      "**Childhood Symptoms scale** — retrospective rating of symptoms during ages 5–12",
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
      "**Inattention symptom count** — number of inattentive symptoms in childhood and adulthood",
      "**Hyperactivity / Impulsivity symptom count** — number of hyperactive-impulsive symptoms in childhood and adulthood",
      "**Diagnostic determination** — meets versus does not meet diagnostic criteria, by presentation",
      "**Impairment ratings** — functional impairment in education, work, relationships, and daily life",
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
      "**Diagnostic determinations** — current and past episodes for each disorder category (Mood, Psychotic, Anxiety, Behavioral, Substance, etc.)",
      "**Severity ratings** — symptom-level severity ratings on rated items",
      "**No continuous index scores** — output is categorical with severity per item",
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
      "**Behavioral Symptoms Index (BSI)** — overall behavioral and emotional concern composite",
      "**Externalizing Problems composite** — Hyperactivity, Aggression, and Conduct Problems",
      "**Internalizing Problems composite** — Anxiety, Depression, and Somatization",
      "**Adaptive Skills composite** — Adaptability, Social Skills, Leadership, Activities of Daily Living, and Functional Communication",
      "**School Problems composite (Teacher form)** — Attention Problems and Learning Problems",
      "**Clinical scales** — Hyperactivity, Aggression, Conduct Problems, Anxiety, Depression, Somatization, Atypicality, Withdrawal, and Attention Problems",
      "**Adaptive scales** — Adaptability, Social Skills, Leadership, Activities of Daily Living, and Functional Communication",
      "**Multi-informant forms** — Parent, Teacher, and Self-Report",
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
      "**Total Problems** — overall behavioral and emotional concern composite",
      "**Internalizing composite** — Anxious / Depressed, Withdrawn / Depressed, and Somatic Complaints",
      "**Externalizing composite** — Rule-Breaking and Aggressive Behavior",
      "**Syndrome Scales (8)** — Anxious / Depressed, Withdrawn / Depressed, Somatic Complaints, Social Problems, Thought Problems, Attention Problems, Rule-Breaking, and Aggressive Behavior",
      "**DSM-Oriented Scales** — Depressive Problems, Anxiety Problems, Somatic Problems, Attention Deficit / Hyperactivity Problems, Oppositional Defiant Problems, and Conduct Problems",
      "**Competence Scales** — Activities, Social, and School functioning",
      "**Companion forms** — Teacher Report Form (TRF) and Youth Self-Report (YSR)",
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
      "**Total Problems** — overall behavioral and emotional concern composite",
      "**Internalizing composite** — Emotionally Reactive, Anxious / Depressed, Somatic Complaints, and Withdrawn",
      "**Externalizing composite** — Attention Problems and Aggressive Behavior",
      "**Syndrome Scales (7)** — Emotionally Reactive, Anxious / Depressed, Somatic Complaints, Withdrawn, Sleep Problems, Attention Problems, and Aggressive Behavior",
      "**DSM-Oriented Scales** — Depressive Problems, Anxiety Problems, Autism Spectrum Problems, Attention Deficit / Hyperactivity Problems, and Oppositional Defiant Problems",
      "**Companion form** — Caregiver-Teacher Report Form (C-TRF)",
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
      "**Total Problems** — overall composite of behavioral and emotional concerns",
      "**Internalizing composite** — Anxious / Depressed, Withdrawn, and Somatic Complaints",
      "**Externalizing composite** — Aggressive Behavior, Rule-Breaking, and Intrusive",
      "**Syndrome Scales (8)** — Anxious / Depressed, Withdrawn, Somatic Complaints, Thought Problems, Attention Problems, Aggressive Behavior, Rule-Breaking, and Intrusive",
      "**DSM-Oriented Scales** — Depressive Problems, Anxiety Problems, Somatic Problems, Avoidant Personality Problems, Attention Deficit / Hyperactivity Problems, and Antisocial Personality Problems",
      "**Adaptive Functioning scales** — Friends, Spouse / Partner, Family, and Job",
    ],
    rememberThis: "Use the OABCL for ages 60+ and pair with the ASR (self-report) for a multi-informant adult profile.",
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
      "**Global Executive Composite (GEC)** — overall everyday executive functioning",
      "**Behavioral Regulation Index (BRI)** — Inhibit and Self-Monitor",
      "**Emotion Regulation Index (ERI)** — Shift and Emotional Control",
      "**Cognitive Regulation Index (CRI)** — Initiate, Working Memory, Plan / Organize, Task-Monitor, and Organization of Materials",
      "**Inhibit scale** — withholding impulsive responses",
      "**Self-Monitor scale** — awareness of one's own behavior and impact",
      "**Shift scale** — cognitive and behavioral flexibility",
      "**Emotional Control scale** — modulation of emotional responses",
      "**Initiate scale** — beginning a task or activity independently",
      "**Working Memory scale** — holding information in mind to complete a task",
      "**Plan / Organize scale** — anticipating future events and organizing materials",
      "**Task-Monitor scale** — checking work for accuracy and completion",
      "**Organization of Materials scale** — keeping belongings and workspaces organized",
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
      "**Global Executive Composite (GEC)** — overall everyday executive functioning",
      "**Behavioral Regulation Index (BRI)** — Inhibit, Shift, Emotional Control, and Self-Monitor",
      "**Metacognition Index (MI)** — Initiate, Working Memory, Plan / Organize, Task Monitor, and Organization of Materials",
    ],
    rememberThis: "BRIEF-2 has three indices (BRI / ERI / CRI); BRIEF-A has two (BRI / MI).",
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
      "**General Adaptive Composite (GAC)** — overall adaptive functioning across the three domains",
      "**Conceptual Composite** — Communication, Functional Academics, and Self-Direction",
      "**Social Composite** — Leisure and Social",
      "**Practical Composite** — Community Use, Home / School Living, Health and Safety, Self-Care, and Work (when applicable)",
      "**Skill Area scaled scores** — Communication, Community Use, Functional Academics, Home / School Living, Health and Safety, Leisure, Self-Care, Self-Direction, Social, and Work",
    ],
    rememberThis: "Often required to support intellectual disability and autism diagnoses alongside cognitive testing.",
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
      "**Broad Independence Score** — overall adaptive composite across the four cluster scores",
      "**Motor Skills cluster** — gross and fine motor functioning",
      "**Social Interaction and Communication cluster** — social engagement and language use",
      "**Personal Living Skills cluster** — eating, dressing, toileting, and personal self-care",
      "**Community Living Skills cluster** — money management, time, and community navigation",
      "**Maladaptive Behavior Indexes** — General, Internalized, Asocial, and Externalized maladaptive behavior",
      "**Support Score** — derived index combining adaptive skill and maladaptive behavior to estimate level of support needed",
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
      "**SRS Total T-score** — overall composite of social-impairment severity",
      "**Social Awareness scale** — picking up on social cues",
      "**Social Cognition scale** — interpreting social information once perceived",
      "**Social Communication scale** — using language for reciprocal communication",
      "**Social Motivation scale** — interest in and engagement with social interaction",
      "**Restricted Interests and Repetitive Behavior scale** — stereotyped, repetitive, and ritualistic behavior",
      "**Social Communication and Interaction (SCI) subscale** — combined Awareness, Cognition, Communication, and Motivation",
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
      "**Total Score** — overall trauma-related belief disturbance",
      "**Safety subscale** — beliefs about personal and others' safety",
      "**Trust subscale** — beliefs about the trustworthiness of self and others",
      "**Power subscale** — beliefs about personal control and the ability to influence others",
      "**Esteem subscale** — beliefs about self-worth and the worth of others",
      "**Intimacy subscale** — beliefs about closeness with self and others",
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
      "**Sense of Mastery Index** — optimism, self-efficacy, and adaptability",
      "**Sense of Relatedness Index** — perceived social support and trust in others",
      "**Emotional Reactivity Index** — sensitivity, recovery, and impairment under emotional stress",
      "**Resource Index** — overall protective resources (Mastery + Relatedness)",
      "**Vulnerability Index** — discrepancy between Resources and Emotional Reactivity",
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
      "**Categorical determinations** — Present / Absent / Threshold / Subthreshold for each diagnosis",
      "**Cluster A modules** — Paranoid, Schizoid, and Schizotypal Personality Disorders",
      "**Cluster B modules** — Antisocial, Borderline, Histrionic, and Narcissistic Personality Disorders",
      "**Cluster C modules** — Avoidant, Dependent, and Obsessive-Compulsive Personality Disorders",
      "**Other Specified Personality Disorders** — symptoms that do not meet criteria for a specific PD",
      "**No continuous index scores** — output is categorical",
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
      out.push(`Age range: ${m.ages}`);
      out.push("");
      out.push(`**Indices**`);
      for (const s of m.scoresToKnow) out.push(`- ${s}`);
      out.push("");
      if (m.rememberThis) {
        out.push(`**Key notes**`);
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
  // Remove existing exam links first so we can safely delete the underlying questions.
  const existingExams = await db
    .select({ id: practiceExamsTable.id })
    .from(practiceExamsTable)
    .where(eq(practiceExamsTable.topicId, topicId));
  for (const e of existingExams) {
    await db
      .delete(practiceExamQuestionsTable)
      .where(eq(practiceExamQuestionsTable.examId, e.id));
  }
  await db
    .delete(quizQuestionsTable)
    .where(eq(quizQuestionsTable.topicId, topicId));
  if (questions.length > 0) {
    await db.insert(quizQuestionsTable).values(
      questions.map((q) => ({ topicId, ...q })),
    );
  }
}

async function ensurePracticeExam(
  topicId: number,
  title: string,
) {
  // Make sure exactly one practice exam row exists for this topic, then link
  // every quiz question for the topic to it (in deterministic order).
  let [exam] = await db
    .select()
    .from(practiceExamsTable)
    .where(eq(practiceExamsTable.topicId, topicId));
  if (!exam) {
    [exam] = await db
      .insert(practiceExamsTable)
      .values({ topicId, title, timeLimit: 4500, passingScore: 70 })
      .returning();
  }
  await db
    .delete(practiceExamQuestionsTable)
    .where(eq(practiceExamQuestionsTable.examId, exam.id));
  const qs = await db
    .select({ id: quizQuestionsTable.id })
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.topicId, topicId));
  if (qs.length > 0) {
    await db.insert(practiceExamQuestionsTable).values(
      qs.map((q, i) => ({
        examId: exam.id,
        questionId: q.id,
        questionOrder: i,
      })),
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
        "**Use the quick-reference table** at the top of each group to compare age range and what each test covers at a glance.",
        "**Read the cards** when you need depth — every card lists the test's age range followed by every index, composite, or scale you'd see on a report, with a brief plain-English description of what it measures.",
        "**For exam-style recall**, focus on the headline composite for each test plus the names and meanings of its primary indices.",
      ],
      objectiveMeasures,
      objectiveGroups,
    ),
  );

  await replaceFlashcards(objectiveId, [
    { question: "What does the WAIS-5 measure and for what age range?", answer: "The Wechsler Adult Intelligence Scale, Fifth Edition is a broadband cognitive ability measure for adolescents and adults (16:0 – 90:11). It is co-normed with the WMS-5 and yields a Full Scale IQ plus five primary indices: VCI, VSI, FRI, WMI, and PSI.", difficulty: "easy" },
    { question: "What are the five primary index scores on the WISC-V?", answer: "Verbal Comprehension Index (VCI), Visual Spatial Index (VSI), Fluid Reasoning Index (FRI), Working Memory Index (WMI), and Processing Speed Index (PSI). Together they combine into the Full Scale IQ.", difficulty: "easy" },
    { question: "What ages does the WPPSI-IV cover and how is the battery split?", answer: "The Wechsler Preschool and Primary Scale of Intelligence, Fourth Edition covers 2:6 – 7:7. Because young children's abilities differ across the age range, it splits into two age bands (2:6 – 3:11 and 4:0 – 7:7) with battery composition tailored to each band, and yields a Full Scale IQ plus primary indices for verbal, visual-spatial, fluid, working memory, and processing-speed abilities (the youngest band omits some indices).", difficulty: "medium" },
    { question: "What is the WASI-II and when is it typically used?", answer: "The Wechsler Abbreviated Scale of Intelligence, Second Edition (6:0 – 90:11) is a brief intellectual screen. A two-subtest form yields a quick Full Scale IQ estimate; a four-subtest form adds Verbal Comprehension and Perceptual Reasoning index estimates. It is used for screening, re-evaluation, or research — not as a substitute for a full battery.", difficulty: "easy" },
    { question: "What does the KABC-II measure and what alternative composite does it offer?", answer: "The Kaufman Assessment Battery for Children, Second Edition (3:0 – 18:11) is a children's cognitive battery. It produces a Mental Processing Index (MPI) — a culture-reduced composite that omits acquired knowledge — alongside a Fluid-Crystallized Index (FCI) that includes a knowledge component. This split lets clinicians choose the composite that best fits the child's background.", difficulty: "medium" },
    { question: "How does the D-KEFS Color-Word Interference task assess executive function?", answer: "It is a Stroop-style task that measures inhibition of automatic responses — the examinee must suppress reading the color word and instead name the ink color, indexing prepotent response inhibition.", difficulty: "medium" },
    { question: "What is the ADOS-2 used for and how is severity quantified?", answer: "The Autism Diagnostic Observation Schedule, Second Edition is a semi-structured observation for autism spectrum disorder. Severity is quantified with the Calibrated Severity Score (CSS) for Social Affect and for Restricted / Repetitive Behaviors. It includes a Toddler Module plus Modules 1–4. Module choice is driven by language level, not age.", difficulty: "medium" },
    { question: "What is the Test of Premorbid Functioning (ToPF) used for?", answer: "It estimates pre-injury intellectual functioning by combining word reading performance with demographic variables to generate a Predicted FSIQ and Predicted GAI with confidence intervals — useful for benchmarking current performance against expected baseline.", difficulty: "medium" },
    { question: "What is the RBANS designed for?", answer: "The Repeatable Battery for the Assessment of Neuropsychological Status is a brief broadband cognitive measure (12:0 – 89:11), often used with older adults. It yields a Total Scale Index plus domain indices for Immediate Memory, Visuospatial / Constructional, Language, Attention, and Delayed Memory. Parallel forms make it the go-to for serial assessment.", difficulty: "easy" },
    { question: "What is the NAB and when is it used?", answer: "The Neuropsychological Assessment Battery (18:0 – 97:11) is a comprehensive adult neuropsychological battery. It yields a Total NAB Index plus module indices for Attention, Language, Memory, Spatial, and Executive Functions, and offers a shorter Screening Module that flags whether deeper testing in any module is warranted.", difficulty: "medium" },
    { question: "What is the NEPSY-II designed to do?", answer: "The Developmental NEuroPSYchological Assessment, Second Edition (3:0 – 16:11) is a flexible, child-focused neuropsychological battery. Rather than a single global IQ, it yields domain scores across Attention/Executive Functioning, Language, Memory & Learning, Sensorimotor, Social Perception, and Visuospatial Processing — clinicians select only the subtests relevant to the referral question.", difficulty: "medium" },
    { question: "Name three performance validity tests covered in this topic.", answer: "Test of Memory Malingering (TOMM), Medical Symptom Validity Test (MSVT), and the Rey 15-Item Test (REY-15 / FIT). The Pediatric Performance Validity Test Suite (PdPVTS) bundles pediatric versions for ages 5–18.", difficulty: "medium" },
    { question: "How does the TOMM detect non-credible memory performance?", answer: "The Test of Memory Malingering presents 50 line-drawing items across two learning trials and an optional retention trial. Because the task looks hard but is actually easy for genuinely impaired patients, performance well below cutoffs on Trial 2 / Retention suggests sub-optimal effort rather than true memory impairment.", difficulty: "medium" },
    { question: "What does the CVLT-3 measure and what are its core indices?", answer: "The California Verbal Learning Test, Third Edition assesses verbal learning and memory. Core indices include Total Recall (Trials 1–5 T-score), Short- and Long-Delay Free / Cued Recall, Long-Delay Recognition Hits, False Positives, Discriminability, Response Bias, Intrusions, Repetitions, and Semantic / Serial Clustering. The process scores reveal the strategy behind the score.", difficulty: "hard" },
    { question: "What is the ChAMP and what does it cover?", answer: "The Child and Adolescent Memory Profile (5:0 – 21:11) is a brief memory battery for youth. It samples verbal and visual memory across immediate and delayed recall, plus recognition, yielding a memory composite alongside index scores so clinicians can compare strengths and weaknesses across modality and delay.", difficulty: "medium" },
    { question: "What does the TOMAL-2 measure?", answer: "The Test of Memory and Learning, Second Edition (5:0 – 59:11) is a broad memory battery. It yields a Composite Memory Index plus indices for Verbal Memory, Nonverbal Memory, Verbal Delayed Recall, Learning, Attention/Concentration, Sequential Memory, Free Recall, and Associative Recall, allowing detailed profiling of memory strengths and weaknesses.", difficulty: "hard" },
    { question: "What broad cognitive abilities does the WJ V Cognitive Battery measure?", answer: "Comprehension-Knowledge (vocabulary and general knowledge), Fluid Reasoning (novel problem-solving), Short-Term Working Memory, Processing Speed, Auditory Processing (analyzing speech sounds), Long-Term Storage (encoding new information), Retrieval Fluency (speed of retrieving stored information), and Visual Processing.", difficulty: "hard" },
    { question: "What is the WCST used to assess?", answer: "The Wisconsin Card Sorting Task assesses executive functioning — particularly abstract reasoning and cognitive shifting. Key scores include Categories Completed, Perseverative Responses, Perseverative Errors, Failure to Maintain Set, and Conceptual Level Responses.", difficulty: "medium" },
    { question: "What do the WIAT-III and KTEA-3 measure?", answer: "Both are comprehensive academic achievement batteries. The WIAT-III (4:0 – 50:11) covers Oral Language, Reading, Written Expression, and Mathematics with a Total Achievement Composite. The KTEA-3 (4:6 – 25:11) yields an Academic Skills Battery composite plus Reading, Math, Written Language, and Oral Language composites.", difficulty: "medium" },
    { question: "What is the WRAT5 and what does it cover?", answer: "The Wide Range Achievement Test, Fifth Edition (5:0 – 85:11+) is a brief academic achievement screen. It samples Word Reading, Sentence Comprehension (which combine into a Reading Composite), Spelling, and Math Computation, plus a total achievement composite — useful when a quick achievement snapshot is needed rather than a full battery.", difficulty: "easy" },
    { question: "What are the Feifer FAR, FAM, and FAW designed for?", answer: "These are diagnostic academic batteries that look at how a student fails — not just whether they fail. The FAR profiles reading subtypes (e.g., dysphonetic, surface, mixed), the FAM profiles math subtypes (procedural, semantic, etc.), and the FAW profiles writing breakdowns. Each yields an overall index plus process scores that point to instructional targets.", difficulty: "hard" },
    { question: "What does the CTOPP-2 assess?", answer: "The Comprehensive Test of Phonological Processing, Second Edition (4:0 – 24:11) measures the phonological skills that underlie reading. It yields composites for Phonological Awareness (manipulating speech sounds), Phonological Memory (holding sound-based information), and Rapid Symbolic / Non-Symbolic Naming (speed of retrieving familiar labels), plus Alternate Phonological Awareness composites for follow-up testing.", difficulty: "medium" },
    { question: "What does the CELF-5 measure and what are its key composites?", answer: "The Clinical Evaluation of Language Fundamentals, Fifth Edition (CELF-5: 5:0 – 21:11; CELF-P2 for preschool) is a comprehensive language battery. It yields a Core Language Score plus Receptive Language, Expressive Language, Language Content, Language Structure, and Language Memory indices to characterize language strengths and weaknesses.", difficulty: "medium" },
    { question: "How are the PPVT-5 and EVT-3 paired in practice?", answer: "The Peabody Picture Vocabulary Test, Fifth Edition (PPVT-5) measures receptive vocabulary — the examinee points to a picture matching a spoken word. The Expressive Vocabulary Test, Third Edition (EVT-3) measures expressive vocabulary — the examinee names pictures or provides synonyms. Co-normed, they let clinicians compare receptive vs. expressive vocabulary directly.", difficulty: "medium" },
    { question: "What is the SCAN-3 and who is it for?", answer: "The Tests for Auditory Processing Disorders (SCAN-3) come in Children (5:0 – 12:11) and Adolescents/Adults (13:0 – 50:11) versions. They screen central auditory processing through tasks like filtered words, auditory figure-ground, competing words, and competing sentences, helping flag when a fuller audiological evaluation is needed.", difficulty: "medium" },
    { question: "What does the CPT-III measure and what indices does it yield?", answer: "The Conners Continuous Performance Test, Third Edition is a 14-minute computerized vigilance task. It yields indices including Detectability (d′), Omissions, Commissions, Hit Reaction Time, HRT Standard Deviation, Variability, Perseverations, and HRT by block / by ISI — together flagging inattention, impulsive responding, and inconsistent vigilance.", difficulty: "hard" },
    { question: "What does the PASAT measure?", answer: "The Paced Auditory Serial Addition Task (16:0+) presents single digits at a fixed pace and asks the examinee to add each new digit to the one immediately preceding it. Scores reflect sustained attention, working memory, and information-processing speed under pressure — frequently used in MS and TBI evaluations.", difficulty: "medium" },
    { question: "What does the BEERY VMI measure?", answer: "The Beery-Buktenica Developmental Test of Visual-Motor Integration measures visual-motor abilities. The main score reflects integration of visual perception with motor control, and supplemental Visual Perception and Motor Coordination scores help isolate which component is driving any difficulty.", difficulty: "easy" },
    { question: "Why might a clinician add the BEERY supplemental tests to the main VMI?", answer: "If a child scores low on the main VMI, the supplemental Visual Perception (motor-free) and Motor Coordination (perception-light) scores help pinpoint whether the difficulty stems from the perceptual side, the motor side, or true integration of the two — guiding intervention targets.", difficulty: "medium" },
    { question: "What is the Finger Tapping Test (FTT) used for?", answer: "The Finger Tapping Test (15:0 – 90:0) measures fine motor speed. The examinee taps a key as fast as possible across timed trials with each hand. Dominant vs. non-dominant tap rates can flag lateralized motor slowing and are often included in broader neuropsychological screens.", difficulty: "easy" },
    { question: "Compare the ADOS-2 and the MIGDAS-2 in autism evaluation.", answer: "Both are observation-based autism measures. The ADOS-2 uses standardized 'presses' and yields algorithm scores plus Calibrated Severity Scores. The MIGDAS-2 (Monteiro Interview Guidelines for Diagnosing the Autism Spectrum, Second Edition) is a sensory-based, conversational protocol with Pre-Verbal/Minimally Verbal, Verbal Child, and Verbal Adolescent/Adult guides — useful when a more naturalistic interaction better fits the examinee.", difficulty: "hard" },
    { question: "What is the KADI used for?", answer: "The Krug Asperger's Disorder Index (6:0 – 21:0) is a brief informant rating designed to distinguish Asperger's-style presentations from high-functioning autism and from non-spectrum conditions. It yields a total index plus diagnostic decision categories — useful as a screen rather than a stand-alone diagnostic tool.", difficulty: "medium" },
    { question: "What is the CAM and where is it used?", answer: "The Confusion Assessment Method is a brief, structured bedside protocol used to detect delirium. Its algorithm requires acute onset/fluctuating course and inattention, plus either disorganized thinking or altered consciousness. It is widely used in hospital and consult-liaison settings.", difficulty: "medium" },
    { question: "What is the R-PAS and how does it differ from older Rorschach systems?", answer: "The Rorschach Performance Assessment System replaces older systems with international norms, an optimized R-Optimized administration that targets ~24 responses, and structured Page-1/Page-2 indices (e.g., EII-3, SC-Comp, TP-Comp). It provides clearer psychometric grounding than legacy approaches.", difficulty: "hard" },
    { question: "How are the TAT and Roberts-2 different from the R-PAS?", answer: "The TAT (Thematic Apperception Test) and Roberts-2 use story-telling to ambiguous picture cards and are scored for thematic content. They are generally interpreted clinically/qualitatively rather than via the standardized indices used by the R-PAS, which has explicit administration rules and quantitative composite scores.", difficulty: "medium" },
    { question: "What does the Rotter Sentence Completion measure?", answer: "The Rotter Incomplete Sentences Blank presents stems (e.g., 'I wish…') for the examinee to finish. Responses are scored for adjustment level along a continuum and reviewed qualitatively for themes — used as a brief projective adjunct rather than a stand-alone diagnostic tool.", difficulty: "easy" },
    { question: "Why is the MSVT an embedded performance validity option?", answer: "The Medical Symptom Validity Test is a brief, computerized verbal-recognition task with effort indicators (Immediate Recognition, Delayed Recognition, Consistency) and a memory profile that distinguishes likely effort failure from genuine impairment, while also yielding usable memory data — making it efficient to embed in larger batteries.", difficulty: "medium" },
    { question: "What is the MVP and who is it for?", answer: "The Memory Validity Profile (5:0 – 16:11) is a pediatric performance validity measure that uses age-appropriate verbal and visual recognition trials to flag sub-optimal effort in children — important because adult validity cutoffs are not appropriate for younger examinees.", difficulty: "medium" },
    { question: "What does the BAYLEY-III assess and across what domains?", answer: "The Bayley Scales of Infant and Toddler Development, Third Edition (1 month – 42 months) is the gold-standard developmental assessment for infants and toddlers. It yields composite scores for Cognitive, Language (Receptive + Expressive), and Motor (Fine + Gross) development, with caregiver-report scales for Social-Emotional and Adaptive Behavior.", difficulty: "medium" },
    { question: "What is the BSRA and when is it used?", answer: "The Bracken School Readiness Assessment, Third Edition (3:0 – 6:11) screens early concept knowledge — colors, letters, numbers/counting, sizes/comparisons, and shapes — to gauge readiness for kindergarten and early elementary instruction. It yields a School Readiness Composite plus subtest scores.", difficulty: "easy" },
    { question: "What is the ACS and how is it used with the Wechsler family?", answer: "The Advanced Clinical Solutions is a supplementary kit used with Wechsler scales (e.g., WAIS, WMS). It provides additional indices for premorbid estimation, social cognition, effort/validity, and demographic/test-pair comparisons, allowing clinicians to extract more clinically relevant information from administered Wechsler tasks.", difficulty: "hard" },
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
      question: "A clinician needs a quick estimate of intellectual functioning for a re-evaluation. Which measure is best suited?",
      optionA: "WAIS-5",
      optionB: "WASI-II",
      optionC: "KABC-II",
      optionD: "WJ V Cognitive",
      correctAnswer: "B",
      explanation: "The Wechsler Abbreviated Scale of Intelligence, Second Edition (WASI-II) is a brief intellectual screen with two- and four-subtest forms that yield quick FSIQ estimates — well suited for re-evaluations and screening, not full diagnosis.",
    },
    {
      question: "Which children's cognitive battery offers a culture-reduced composite that omits acquired knowledge alongside a traditional knowledge-inclusive composite?",
      optionA: "WISC-V",
      optionB: "WPPSI-IV",
      optionC: "KABC-II",
      optionD: "RBANS",
      correctAnswer: "C",
      explanation: "The Kaufman Assessment Battery for Children, Second Edition (KABC-II) offers the Mental Processing Index (MPI), a culture-reduced composite, alongside the Fluid-Crystallized Index (FCI), which includes acquired knowledge.",
    },
    {
      question: "Which D-KEFS task most directly measures inhibition of automatic responses?",
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
      question: "Which performance validity measure is specifically designed for pediatric examinees (5:0 – 16:11)?",
      optionA: "TOMM",
      optionB: "MSVT",
      optionC: "Rey-15 (FIT)",
      optionD: "MVP",
      correctAnswer: "D",
      explanation: "The Memory Validity Profile (MVP) uses age-appropriate verbal and visual recognition trials to flag sub-optimal effort in children, since adult cutoffs are not appropriate for younger examinees.",
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
      question: "Which child-focused neuropsychological battery is organized into Attention/Executive, Language, Memory & Learning, Sensorimotor, Social Perception, and Visuospatial domains?",
      optionA: "WISC-V",
      optionB: "NEPSY-II",
      optionC: "KABC-II",
      optionD: "BAYLEY-III",
      correctAnswer: "B",
      explanation: "The NEPSY-II (Developmental NEuroPSYchological Assessment, Second Edition) is organized by neuropsychological domains, with clinicians selecting only the subtests relevant to the referral question.",
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
    {
      question: "Which measure assesses verbal learning and memory and yields process scores like Semantic / Serial Clustering and Discriminability?",
      optionA: "CVLT-3",
      optionB: "ChAMP",
      optionC: "TOMAL-2",
      optionD: "RBANS",
      correctAnswer: "A",
      explanation: "The California Verbal Learning Test, Third Edition (CVLT-3) yields detailed process scores — including clustering strategy, discriminability, response bias, intrusions, and repetitions — alongside total recall and recognition indices.",
    },
    {
      question: "Which measure is the gold-standard developmental assessment for infants and toddlers (1 – 42 months)?",
      optionA: "BSRA",
      optionB: "BAYLEY-III",
      optionC: "WPPSI-IV",
      optionD: "KABC-II",
      correctAnswer: "B",
      explanation: "The Bayley Scales of Infant and Toddler Development, Third Edition is the standard infant/toddler developmental assessment, yielding Cognitive, Language, Motor, Social-Emotional, and Adaptive composites.",
    },
    {
      question: "Which brief screener checks early concept knowledge — colors, letters, numbers, sizes, and shapes — for kindergarten readiness?",
      optionA: "BSRA",
      optionB: "WIAT-III",
      optionC: "KTEA-3",
      optionD: "WRAT5",
      correctAnswer: "A",
      explanation: "The Bracken School Readiness Assessment, Third Edition (3:0 – 6:11) screens early concept knowledge to gauge readiness for kindergarten and early elementary instruction.",
    },
    {
      question: "Which two co-normed measures pair receptive vocabulary with expressive vocabulary?",
      optionA: "CELF-5 and CASL",
      optionB: "PPVT-5 and EVT-3",
      optionC: "WIAT-III and KTEA-3",
      optionD: "FAR and FAW",
      correctAnswer: "B",
      explanation: "The Peabody Picture Vocabulary Test, Fifth Edition (receptive) and Expressive Vocabulary Test, Third Edition (expressive) are co-normed, allowing direct comparison of receptive vs. expressive vocabulary.",
    },
    {
      question: "Which measure samples Phonological Awareness, Phonological Memory, and Rapid Naming?",
      optionA: "CTOPP-2",
      optionB: "CELF-5",
      optionC: "FAR",
      optionD: "DST-II",
      correctAnswer: "A",
      explanation: "The Comprehensive Test of Phonological Processing, Second Edition (CTOPP-2) measures the phonological skills underlying reading: phonological awareness, phonological memory, and rapid naming.",
    },
    {
      question: "Which measure most directly assesses sustained attention and information-processing speed under pressure using paced auditory addition?",
      optionA: "CPT-III",
      optionB: "PASAT",
      optionC: "TEA",
      optionD: "WCST",
      correctAnswer: "B",
      explanation: "The Paced Auditory Serial Addition Task (PASAT) presents single digits at a fixed pace and asks the examinee to add each new digit to the prior one — taxing sustained attention, working memory, and processing speed.",
    },
    {
      question: "Which measure is a 14-minute computerized vigilance task yielding indices like Detectability, Omissions, and HRT Variability?",
      optionA: "PASAT",
      optionB: "TEA",
      optionC: "CPT-III",
      optionD: "WCST",
      correctAnswer: "C",
      explanation: "The Conners Continuous Performance Test, Third Edition (CPT-III) is a 14-minute computerized vigilance task with indices including Detectability, Omissions, Commissions, Hit Reaction Time, and HRT Variability.",
    },
    {
      question: "Which measure assesses executive functioning by requiring the examinee to discover and shift sorting principles based on feedback?",
      optionA: "WCST",
      optionB: "D-KEFS Tower",
      optionC: "PASAT",
      optionD: "CPT-III",
      correctAnswer: "A",
      explanation: "The Wisconsin Card Sorting Task assesses abstract reasoning and cognitive shifting, with key indices like Categories Completed, Perseverative Responses, and Failure to Maintain Set.",
    },
    {
      question: "Which measure is the brief bedside protocol used to detect delirium based on acute onset, inattention, and disorganized thinking or altered consciousness?",
      optionA: "TOMM",
      optionB: "RBANS",
      optionC: "CAM",
      optionD: "MSVT",
      correctAnswer: "C",
      explanation: "The Confusion Assessment Method (CAM) is a brief bedside protocol whose algorithm requires acute onset/fluctuating course and inattention, plus either disorganized thinking or altered consciousness.",
    },
    {
      question: "Which measure assesses visual-motor integration and offers supplemental Visual Perception and Motor Coordination scores?",
      optionA: "WRAVMA",
      optionB: "BEERY (VMI)",
      optionC: "FTT",
      optionD: "BSRA",
      correctAnswer: "B",
      explanation: "The Beery-Buktenica Developmental Test of Visual-Motor Integration (BEERY VMI) measures integration of visual perception with motor control, with supplemental Visual Perception and Motor Coordination scores to isolate the source of any difficulty.",
    },
    {
      question: "Which battery is the comprehensive adult neuropsychological measure with modules for Attention, Language, Memory, Spatial, and Executive Functions plus a Screening Module?",
      optionA: "RBANS",
      optionB: "NAB",
      optionC: "WJ V Cognitive",
      optionD: "NEPSY-II",
      correctAnswer: "B",
      explanation: "The Neuropsychological Assessment Battery (NAB; 18:0 – 97:11) yields a Total NAB Index plus module indices for Attention, Language, Memory, Spatial, and Executive Functions, and offers a Screening Module to flag where deeper testing is needed.",
    },
    {
      question: "Which observation-based autism measure uses sensory-based, conversational guides for Pre-Verbal/Minimally Verbal, Verbal Child, and Verbal Adolescent/Adult examinees?",
      optionA: "ADOS-2",
      optionB: "MIGDAS-2",
      optionC: "KADI",
      optionD: "SRS-2",
      correctAnswer: "B",
      explanation: "The Monteiro Interview Guidelines for Diagnosing the Autism Spectrum, Second Edition (MIGDAS-2) is a sensory-based, conversational autism protocol with guides matched to language level.",
    },
    {
      question: "Which Feifer battery profiles different reading subtypes to guide instructional targeting?",
      optionA: "FAM",
      optionB: "FAW",
      optionC: "FAR",
      optionD: "TOD",
      correctAnswer: "C",
      explanation: "The Feifer Assessment of Reading (FAR) profiles reading breakdown subtypes (e.g., dysphonetic, surface, mixed) and yields process scores that point to instructional targets.",
    },
    {
      question: "Which measure most directly samples fine motor speed across dominant and non-dominant hands?",
      optionA: "BEERY (VMI)",
      optionB: "WRAVMA",
      optionC: "FTT",
      optionD: "PASAT",
      correctAnswer: "C",
      explanation: "The Finger Tapping Test (FTT) measures fine motor speed by having the examinee tap a key as fast as possible across timed trials with each hand, often flagging lateralized motor slowing.",
    },
    {
      question: "Which kit is a supplementary set used with Wechsler scales for premorbid estimation, social cognition, and effort/validity indices?",
      optionA: "ACS",
      optionB: "ToPF",
      optionC: "NAB",
      optionD: "RBANS",
      correctAnswer: "A",
      explanation: "The Advanced Clinical Solutions (ACS) is a supplementary kit used with Wechsler scales (e.g., WAIS, WMS) to provide additional indices including premorbid estimation, social cognition, and effort/validity.",
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
    { question: "What does the BYI cover and for what age range?", answer: "The Beck Youth Inventories (7:0 – 18:11) is a set of brief self-report scales for children and adolescents covering depression, anxiety, anger, disruptive behavior, and self-concept. Each inventory yields its own T-score, allowing clinicians to flag elevations across emotional and behavioral domains.", difficulty: "medium" },
    { question: "What is the CDI-2 and what informant forms are available?", answer: "The Children's Depression Inventory, Second Edition (7:0 – 17:11) measures depression severity in youth. It includes a Self-Report (Long and Short forms) plus Parent and Teacher rating scales, yielding a Total Score with Emotional Problems and Functional Problems subscales — useful for triangulating across informants.", difficulty: "medium" },
    { question: "What composites and informant forms does the BASC-3 provide?", answer: "Composites: Behavioral Symptoms Index (BSI), Externalizing Problems, Internalizing Problems, and Adaptive Skills. Forms include Parent, Teacher, and Self-Report — yielding scales for hyperactivity, aggression, conduct, anxiety, depression, somatization, atypicality, withdrawal, attention, adaptability, social skills, leadership, ADL, and functional communication.", difficulty: "medium" },
    { question: "What does the BRIEF-2 measure and what are its three index scores?", answer: "The BRIEF-2 measures executive functioning behaviors at home and school in children and adolescents (5:0 – 18:11). It yields the Global Executive Composite (GEC) and three index scores: Behavioral Regulation Index (BRI), Emotion Regulation Index (ERI), and Cognitive Regulation Index (CRI).", difficulty: "medium" },
    { question: "How do the BRIEF-2 and BRIEF-A differ?", answer: "BRIEF-2 is for children and adolescents (5:0 – 18:11) and produces three indices (BRI, ERI, CRI). BRIEF-A is for adults (18:0 – 90:0) and produces two indices: Behavioral Regulation (BRI) and Metacognition (MI). BRIEF-A includes Self-Report and Informant Report forms.", difficulty: "medium" },
    { question: "Why is it important that executive-function rating scales (BRIEF-2 / BRIEF-A) capture everyday behavior?", answer: "Performance-based executive measures (e.g., D-KEFS, WCST) assess capacity in a structured, low-distraction setting. Rating scales like the BRIEF-2 / BRIEF-A capture how executive skills actually show up in daily life — at home, school, or work — which often diverges from in-office performance. Combining both gives a fuller picture.", difficulty: "hard" },
    { question: "What does the SCID-5 cover and what scoring approach does it use?", answer: "The Structured Clinical Interview for DSM-5 covers personality disorders across Cluster A (Paranoid, Schizoid, Schizotypal), Cluster B (Antisocial, Borderline, Histrionic, Narcissistic), Cluster C (Avoidant, Dependent, Obsessive-Compulsive), and Other Specified. It produces categorical determinations (Present / Absent / Threshold / Subthreshold) — no continuous index scores.", difficulty: "medium" },
    { question: "What does the KSADS cover and how is it administered?", answer: "The Kiddie Schedule for Affective Disorders and Schizophrenia is a semi-structured diagnostic interview for children and adolescents. It surveys current and past episodes of mood, anxiety, psychotic, behavioral, eating, and substance-use disorders, integrating parent and child interviews to produce DSM-aligned diagnoses.", difficulty: "hard" },
    { question: "What does the DIVA cover?", answer: "The Diagnostic Interview for ADHD in Adults is a semi-structured interview that surveys DSM symptoms of inattention and hyperactivity-impulsivity, age-of-onset evidence, and impairment across multiple life domains (work, study, relationships, daily routines). It is used to formalize an adult ADHD diagnosis rather than as a screen.", difficulty: "medium" },
    { question: "What does the MMPI-3 measure and what are its higher-order scales?", answer: "The Minnesota Multiphasic Personality Inventory, Third Edition is a broadband personality measure. Higher-Order Scales (3): Emotional / Internalizing Dysfunction (EID), Thought Dysfunction (THD), and Behavioral / Externalizing Dysfunction (BXD). It also includes 10 Validity Scales, 9 Restructured Clinical Scales, and PSY-5 Scales.", difficulty: "hard" },
    { question: "Why are validity scales important on broadband personality inventories?", answer: "Validity scales (e.g., on MMPI-3, PAI, MCMI-IV, MACI-II) flag inconsistent responding, over-reporting, under-reporting, infrequent endorsements, and impression-management styles. Without confirming validity, clinical scale elevations can be misleading — so validity is checked first, before interpreting any clinical scales.", difficulty: "hard" },
    { question: "What does the PAI measure and what are its higher-order scales?", answer: "The Personality Assessment Inventory (18:0+) is a self-report broadband personality measure. It yields 4 Validity Scales, 11 Clinical Scales (e.g., Somatic Complaints, Anxiety, Depression, Mania, Paranoia, Schizophrenia, Borderline Features, Antisocial Features, Alcohol/Drug Problems), 5 Treatment Consideration scales, and 2 Interpersonal scales — useful for comprehensive personality and clinical screening.", difficulty: "hard" },
    { question: "What does the MCMI-IV measure?", answer: "The Millon Clinical Multiaxial Inventory, Fourth Edition (18:0+) is a broadband personality and psychopathology inventory aligned with Millon's evolutionary theory. It yields Modifying Indices (validity), Clinical Personality Patterns, Severe Personality Pathology, Clinical Syndromes, and Severe Clinical Syndromes — used in adult clinical evaluation.", difficulty: "hard" },
    { question: "What is the MACI-II and how is it different from the M-PACI?", answer: "The Millon Adolescent Clinical Inventory, Second Edition (MACI-II; 13:0 – 19:0) is a broadband self-report personality and psychopathology measure for adolescents. The Millon Pre-Adolescent Clinical Inventory (M-PACI; 9:0 – 12:0) is a briefer downward extension for pre-adolescents — both yield validity and clinical scales scaled to developmental level.", difficulty: "medium" },
    { question: "What does the ABAS-3 measure and what is the General Adaptive Composite?", answer: "The Adaptive Behavior Assessment System, Third Edition measures daily living skills across Conceptual, Social, and Practical domains. The General Adaptive Composite (GAC) summarizes overall adaptive functioning across skill areas including communication, community use, functional academics, home/school living, health and safety, leisure, self-care, self-direction, social, and work.", difficulty: "medium" },
    { question: "What does the SIB-R measure?", answer: "The Scales of Independent Behavior, Revised (3 months – 80+) is an adaptive behavior measure organized into Motor Skills, Social Interaction & Communication Skills, Personal Living Skills, and Community Living Skills, plus a problem-behavior component. It is informant-based and helps document adaptive functioning across the lifespan.", difficulty: "hard" },
    { question: "What does the SRS-2 assess?", answer: "The Social Responsiveness Scale, Second Edition identifies the presence and severity of social impairment associated with autism. It yields the SRS Total Score (T-score) and subscales for Social Awareness, Social Cognition, Social Communication, Social Motivation, and Restricted / Repetitive Behaviors plus a Social Communication and Interaction (SCI) subscale.", difficulty: "easy" },
    { question: "What is the Conners-4 used for and what informant forms are available?", answer: "The Conners-4 (Conners Fourth Edition) assesses ADHD symptoms, associated impairments, and common co-occurring problems in children and youth (6:0 – 18:11). It is multi-informant with Parent, Teacher, and Self-Report forms and yields T-scores and percentiles across four Content Scales: Inattention / Executive Dysfunction, Hyperactivity, Impulsivity, and Emotional Dysregulation.", difficulty: "medium" },
    { question: "How does the BAARS-IV approach adult ADHD?", answer: "The Barkley Adult ADHD Rating Scale, Fourth Edition assesses current and retrospective childhood symptoms across Inattention, Hyperactivity, Impulsivity, and Sluggish Cognitive Tempo (SCT). It includes Self-Report and Other-Report forms and provides DSM-5 symptom counts.", difficulty: "medium" },
    { question: "Which measures make up the ASEBA family referenced here?", answer: "Child Behavior Checklist (CBCL) for school-age (6–18) and Preschool (1.5–5), Adult Behavior Checklist (ABCL) for ages 18–59 (observer / collateral report), plus companion forms TRF, YSR, C-TRF, ASR, and OABCL for ages 60+.", difficulty: "hard" },
    { question: "What composites does the CBCL (school-age) yield?", answer: "The school-age CBCL yields broadband Internalizing, Externalizing, and Total Problems composites alongside syndrome scales (e.g., Anxious/Depressed, Withdrawn/Depressed, Somatic Complaints, Social Problems, Thought Problems, Attention Problems, Rule-Breaking Behavior, Aggressive Behavior) and DSM-oriented scales — all interpreted from caregiver report.", difficulty: "medium" },
    { question: "What does the ABCL add over the CBCL?", answer: "The Adult Behavior Checklist (18:0 – 59:11) extends the ASEBA framework into adulthood using observer/collateral report. It yields Internalizing, Externalizing, and Total Problems composites along with adult-relevant syndrome and DSM-oriented scales — letting clinicians use a consistent informant-report framework across child, adolescent, and adult ages.", difficulty: "hard" },
    { question: "What does the TABS measure and who is it for?", answer: "The Trauma and Attachment Beliefs Scale (9:0 – 18:11 for youth and 18+ for adult forms) measures trauma-related disruptions in beliefs about safety, trust, esteem, intimacy, and control for both self and others. It helps characterize the cognitive impact of trauma in addition to symptom-based measures.", difficulty: "medium" },
    { question: "What does the RSCA measure?", answer: "The Resiliency Scales for Children and Adolescents (9:0 – 18:11) is a self-report measure of resilience. It yields scales for Sense of Mastery, Sense of Relatedness, and Emotional Reactivity — providing a strengths-oriented view that complements problem-focused inventories.", difficulty: "easy" },
    { question: "Why are multi-informant ratings (parent + teacher + self) emphasized for ADHD assessment?", answer: "ADHD symptoms vary by setting, and informants notice different things — caregivers see home routines, teachers see structured academic demands, and youth notice internal experiences others miss. Multi-informant tools (e.g., Conners-4, BASC-3) cross-validate elevations across settings, which is required for a credible diagnosis.", difficulty: "hard" },
    { question: "How do the SRS-2, ADOS-2, and MIGDAS-2 fit together in autism evaluation?", answer: "The SRS-2 is an informant rating scale that quantifies social impairment from the rater's perspective. The ADOS-2 and MIGDAS-2 are observation-based protocols administered to the examinee. Combining a rating scale with direct observation gives a multi-method picture, which is the standard for autism evaluation.", difficulty: "hard" },
    { question: "Why might a clinician choose a structured interview (e.g., SCID-5, KSADS, DIVA) over a self-report inventory?", answer: "Structured interviews let clinicians clarify items, follow up ambiguous responses, and check whether reported experiences meet diagnostic thresholds. They are higher-touch but yield diagnostic-level decisions, whereas self-report inventories yield severity scores and elevations that still require clinical interpretation.", difficulty: "medium" },
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
      question: "Which adult executive-function rating scale yields Behavioral Regulation (BRI) and Metacognition (MI) indices?",
      optionA: "BRIEF-2",
      optionB: "BRIEF-A",
      optionC: "BAARS-IV",
      optionD: "Conners-4",
      correctAnswer: "B",
      explanation: "The BRIEF-A is the adult version of the BRIEF and yields two indices: Behavioral Regulation (BRI) and Metacognition (MI). The BRIEF-2 is the child/adolescent version with three indices.",
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
      question: "Which broadband personality inventory yields Validity, Clinical (e.g., Somatic Complaints, Anxiety, Depression, Borderline Features), Treatment Consideration, and Interpersonal scales?",
      optionA: "MMPI-3",
      optionB: "PAI",
      optionC: "MCMI-IV",
      optionD: "MACI-II",
      correctAnswer: "B",
      explanation: "The Personality Assessment Inventory (PAI) is organized into 4 Validity Scales, 11 Clinical Scales, 5 Treatment Consideration scales, and 2 Interpersonal scales.",
    },
    {
      question: "Which adolescent broadband personality inventory is anchored in Millon's evolutionary framework?",
      optionA: "MMPI-3",
      optionB: "PAI",
      optionC: "MACI-II",
      optionD: "BASC-3 Self-Report",
      correctAnswer: "C",
      explanation: "The Millon Adolescent Clinical Inventory, Second Edition (MACI-II) is the adolescent inventory in Millon's framework, with adult and pre-adolescent counterparts (MCMI-IV and M-PACI).",
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
      question: "Which semi-structured interview is designed to formalize an adult ADHD diagnosis through DSM symptom counts, age of onset, and functional impairment evidence?",
      optionA: "BAARS-IV",
      optionB: "DIVA",
      optionC: "Conners-4",
      optionD: "KSADS",
      correctAnswer: "B",
      explanation: "The Diagnostic Interview for ADHD in Adults (DIVA) is a semi-structured interview used to formalize adult ADHD diagnoses. BAARS-IV and Conners-4 are rating scales; KSADS targets youth disorders broadly.",
    },
    {
      question: "Which semi-structured interview integrates parent and child interviews to assess current and past episodes of mood, anxiety, psychotic, behavioral, eating, and substance-use disorders in youth?",
      optionA: "SCID-5",
      optionB: "DIVA",
      optionC: "KSADS",
      optionD: "MIGDAS-2",
      correctAnswer: "C",
      explanation: "The Kiddie Schedule for Affective Disorders and Schizophrenia (KSADS) is the semi-structured diagnostic interview for children and adolescents, integrating parent and child interviews.",
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
      question: "Which adaptive behavior measure organizes scores into Motor Skills, Social Interaction & Communication, Personal Living, and Community Living domains across the full lifespan?",
      optionA: "ABAS-3",
      optionB: "SIB-R",
      optionC: "BASC-3",
      optionD: "TABS",
      correctAnswer: "B",
      explanation: "The Scales of Independent Behavior, Revised (SIB-R) is organized into Motor Skills, Social Interaction & Communication, Personal Living, and Community Living, plus a problem-behavior component.",
    },
    {
      question: "Which Beck inventory yields a 0–63 total with Minimal, Mild, Moderate, and Severe classifications and includes Cognitive-Affective and Somatic-Vegetative subscales?",
      optionA: "BAI",
      optionB: "BYI",
      optionC: "BDI-II",
      optionD: "CDI-2",
      correctAnswer: "C",
      explanation: "The BDI-II measures depression severity (0–63) and includes the Cognitive-Affective and Somatic-Vegetative subscales.",
    },
    {
      question: "Which Beck inventory measures anxiety severity through subjective, neurophysiological, autonomic, and panic symptoms?",
      optionA: "BAI",
      optionB: "BDI-II",
      optionC: "BYI",
      optionD: "CDI-2",
      correctAnswer: "A",
      explanation: "The Beck Anxiety Inventory (BAI) measures anxiety severity (0–63 total) across subjective, neurophysiological, autonomic, and panic symptom clusters.",
    },
    {
      question: "Which set of brief self-report scales for youth covers depression, anxiety, anger, disruptive behavior, and self-concept?",
      optionA: "CDI-2",
      optionB: "BYI",
      optionC: "BASC-3 Self-Report",
      optionD: "RSCA",
      correctAnswer: "B",
      explanation: "The Beck Youth Inventories (BYI; 7:0 – 18:11) is a set of brief self-report scales covering depression, anxiety, anger, disruptive behavior, and self-concept — each yielding its own T-score.",
    },
    {
      question: "Which youth depression measure includes Self-Report (Long and Short), Parent, and Teacher rating forms?",
      optionA: "BDI-II",
      optionB: "BYI",
      optionC: "CDI-2",
      optionD: "BASC-3",
      correctAnswer: "C",
      explanation: "The Children's Depression Inventory, Second Edition (CDI-2) includes Self-Report (Long and Short), Parent, and Teacher rating scales — useful for triangulating across informants.",
    },
    {
      question: "Which informant-report measure yields broadband Internalizing, Externalizing, and Total Problems composites alongside DSM-oriented and syndrome scales for school-age children?",
      optionA: "BASC-3",
      optionB: "Conners-4",
      optionC: "CBCL (Child)",
      optionD: "BRIEF-2",
      correctAnswer: "C",
      explanation: "The school-age CBCL is the ASEBA caregiver report measure that yields Internalizing, Externalizing, and Total Problems composites along with syndrome and DSM-oriented scales.",
    },
    {
      question: "Which ASEBA measure extends the Internalizing / Externalizing / Total Problems framework to adults using observer/collateral report?",
      optionA: "ABCL",
      optionB: "ASR",
      optionC: "OABCL",
      optionD: "CBCL (Preschool)",
      correctAnswer: "A",
      explanation: "The Adult Behavior Checklist (ABCL; 18:0 – 59:11) is the ASEBA observer/collateral measure for adults, paralleling the CBCL framework.",
    },
    {
      question: "Which youth measure characterizes trauma-related disruptions in beliefs about safety, trust, esteem, intimacy, and control?",
      optionA: "RSCA",
      optionB: "TABS",
      optionC: "CDI-2",
      optionD: "BYI",
      correctAnswer: "B",
      explanation: "The Trauma and Attachment Beliefs Scale (TABS) measures trauma-related belief disruptions across safety, trust, esteem, intimacy, and control — for self and others.",
    },
    {
      question: "Which youth self-report measure focuses on resilience through Sense of Mastery, Sense of Relatedness, and Emotional Reactivity scales?",
      optionA: "BYI",
      optionB: "RSCA",
      optionC: "BASC-3 Self-Report",
      optionD: "CDI-2",
      correctAnswer: "B",
      explanation: "The Resiliency Scales for Children and Adolescents (RSCA) is a strengths-oriented self-report measure of Mastery, Relatedness, and Emotional Reactivity.",
    },
    {
      question: "Which Conners-4 content scales are most central to ADHD assessment in youth?",
      optionA: "Internalizing, Externalizing, Adaptive, BSI",
      optionB: "Inattention/Executive Dysfunction, Hyperactivity, Impulsivity, Emotional Dysregulation",
      optionC: "BRI, ERI, CRI, GEC",
      optionD: "EID, THD, BXD",
      correctAnswer: "B",
      explanation: "The Conners-4 yields four Content Scales: Inattention/Executive Dysfunction, Hyperactivity, Impulsivity, and Emotional Dysregulation, captured across Parent, Teacher, and Self-Report informants.",
    },
    {
      question: "Which adult ADHD rating scale assesses both current and retrospective childhood symptoms and includes a Sluggish Cognitive Tempo component?",
      optionA: "BAARS-IV",
      optionB: "DIVA",
      optionC: "Conners-4",
      optionD: "BRIEF-A",
      correctAnswer: "A",
      explanation: "The Barkley Adult ADHD Rating Scale, Fourth Edition (BAARS-IV) assesses current and retrospective childhood symptoms across inattention, hyperactivity, impulsivity, and Sluggish Cognitive Tempo, with Self-Report and Other-Report forms.",
    },
    {
      question: "Why is interpreting validity scales (e.g., on MMPI-3, PAI) considered the first step in scoring a broadband personality inventory?",
      optionA: "They convert raw scores into T-scores",
      optionB: "They flag inconsistent responding, over-reporting, under-reporting, and impression management before any clinical scale is interpreted",
      optionC: "They calculate the Full Scale IQ equivalent",
      optionD: "They reorder the clinical scales by severity",
      correctAnswer: "B",
      explanation: "Validity scales tell you whether the response set is interpretable. Without confirming validity, clinical scale elevations can be misleading, so they are reviewed first.",
    },
    {
      question: "Why are multi-informant ratings (parent + teacher + self) emphasized in ADHD evaluation?",
      optionA: "ADHD requires direct cognitive testing only",
      optionB: "Symptoms vary by setting and informants notice different things, so multi-informant ratings cross-validate elevations across home, school, and self",
      optionC: "They reduce the cost of evaluation",
      optionD: "Self-report alone is sufficient",
      correctAnswer: "B",
      explanation: "Multi-informant ratings are emphasized because ADHD presentations vary by setting; cross-informant agreement strengthens the diagnostic case.",
    },
    {
      question: "Which combination is most consistent with current best practice for autism evaluation?",
      optionA: "ADOS-2 alone",
      optionB: "Self-report personality inventory + cognitive battery",
      optionC: "An informant rating scale (e.g., SRS-2) plus a direct observation protocol (e.g., ADOS-2 or MIGDAS-2)",
      optionD: "Brief screen only",
      correctAnswer: "C",
      explanation: "Multi-method autism evaluation pairs an informant rating scale with a direct observation protocol, supplemented by clinical interview and developmental history.",
    },
    {
      question: "Which is true of the BRIEF-A vs. the BRIEF-2?",
      optionA: "Both are performance-based executive function tasks",
      optionB: "BRIEF-A yields three indices (BRI, ERI, CRI); BRIEF-2 yields two (BRI, MI)",
      optionC: "BRIEF-A is for adults and yields BRI and Metacognition (MI); BRIEF-2 is for children/adolescents and yields BRI, ERI, and CRI",
      optionD: "BRIEF-A is administered only by interview, while BRIEF-2 is self-report only",
      correctAnswer: "C",
      explanation: "BRIEF-A is the adult rating scale (BRI + MI). BRIEF-2 is the child/adolescent rating scale (BRI + ERI + CRI). Both are rating scales — not performance-based — administered as self- and informant-report.",
    },
  ]);

  await ensurePracticeExam(objectiveId, "Objective Measures — Practice Exam");
  await ensurePracticeExam(subjectiveId, "Subjective Measures & Rating Scales — Practice Exam");

  console.log("✓ Done seeding Assessment measure topics.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
