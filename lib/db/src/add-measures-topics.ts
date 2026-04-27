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
  usedFor: string;
  domains: string;
  indices: string;
  ageRange: string;
};

const objectiveMeasures: MeasureRow[] = [
  { test: "ADOS-2", fullName: "Autism Diagnostic Observation Schedule, Second Edition", usedFor: "Autism spectrum disorder", domains: "Social Affect; Restricted and Repetitive Behaviors", indices: "Toddler Module (12–30 mo); Module 1 (Minimal Verbal); Module 2 (Phrase Speech); Module 3 (Fluent / Child-Adolescent); Module 4 (Fluent / Adolescent-Adult); Calibrated Severity Score (CSS) for Social Affect and Restricted/Repetitive Behaviors", ageRange: "12 mo – Adult" },
  { test: "ACS", fullName: "Advanced Clinical Solutions", usedFor: "Links WAIS-IV and WMS-IV with assessments of premorbid functioning, social cognition, effort, and daily living skills", domains: "Social Cognition; Effort; Daily Living Skills; Premorbid Functioning", indices: "Social Perception Score; Effort Score (Word Choice, Reliability); Activities of Daily Living Scale (ADLS); Test of Premorbid Functioning (ToPF)", ageRange: "16:0 – 90:11" },
  { test: "BEERY (VMI)", fullName: "Beery-Buktenica Developmental Test of Visual-Motor Integration", usedFor: "Visual-motor abilities", domains: "Visual-Motor Integration; Visual Perception; Motor Coordination", indices: "Visual-Motor Integration Standard Score; Visual Perception Standard Score; Motor Coordination Standard Score", ageRange: "2:0 – 18:11; 19:0 – 100:11" },
  { test: "BAYLEY-III", fullName: "Bayley Scales of Infant and Toddler Development, Third Edition", usedFor: "Cognitive, language, motor, social-emotional, and adaptive skill assessment in infants and toddlers", domains: "Cognitive; Language (Receptive / Expressive); Motor (Gross / Fine); Social-Emotional; Adaptive Behavior", indices: "Cognitive Scale Index; Language Composite (Receptive Communication, Expressive Communication); Motor Composite (Fine Motor, Gross Motor); Social-Emotional Scale; Adaptive Behavior Composite", ageRange: "1 mo – 42 mo" },
  { test: "BSRA", fullName: "Bracken School Readiness Assessment, Third Edition", usedFor: "School readiness in young children", domains: "Colors; Letters / Sounds; Numbers / Counting; Sizes / Comparisons; Shapes", indices: "School Readiness Composite (SRC); subtest scores", ageRange: "Pre-K – 2nd grade" },
  { test: "CAM", fullName: "Confusion Assessment Method", usedFor: "Identifies delirium", domains: "Acute Onset; Inattention; Altered Level of Consciousness; Disorganized Thinking", indices: "CAM Algorithm Score (Delirium Present / Absent); feature ratings: Acute Onset & Fluctuating Course, Inattention, Disorganized Thinking, Altered Level of Consciousness", ageRange: "Adult" },
  { test: "CAPs", fullName: "Comprehensive Assessment of Pragmatics", usedFor: "Pragmatic language skills and social language development", domains: "Utterance; Discourse; Nonliteral Language; Nonverbal Communication; Social Relations", indices: "Pragmatic Language Index; subtest scores", ageRange: "7:0 – 18:11" },
  { test: "CASL / CASL-II", fullName: "Comprehensive Assessment of Spoken Language", usedFor: "Oral language processing — comprehension and expression across lexical/semantic, syntactic, supralinguistic, and pragmatic domains", domains: "Lexical/Semantic; Syntactic; Supralinguistic; Pragmatic", indices: "Oral Language Index (OLI); Core Language Index; Lexical/Semantic Index; Syntactic Index; Supralinguistic Index; Pragmatic Index", ageRange: "3:0 – 21:11" },
  { test: "CELF-5 / CELF-P2", fullName: "Clinical Evaluation of Language Fundamentals, Fifth Edition / Preschool, Second Edition", usedFor: "Language and communication skills from preschool through adulthood", domains: "Core Language; Receptive Language; Expressive Language; Language Content; Language Structure; Language Memory", indices: "Core Language Score (CLS); Receptive Language Index (RLI); Expressive Language Index (ELI); Language Content Index (LCI); Language Structure Index (LSI); Language Memory Index (LMI); Pragmatics Profile; Reading/Writing Index (older ages)", ageRange: "Preschool 3:0 – 6:11; School Age / Adult 5:0 – 21:11" },
  { test: "ChAMP", fullName: "Child and Adolescent Memory Profile", usedFor: "Visual and verbal memory in children and adolescents", domains: "Verbal Memory; Visual Memory", indices: "Verbal Memory Index; Visual Memory Index; Learning and Memory Index", ageRange: "5:0 – 21:11" },
  { test: "CTOPP-2", fullName: "Comprehensive Test of Phonological Processing, Second Edition", usedFor: "Phonological awareness; identifies potential reading difficulties", domains: "Phonological Awareness; Phonological Memory; Rapid Symbolic Naming; Rapid Non-Symbolic Naming", indices: "Phonological Awareness Composite; Phonological Memory Composite; Rapid Symbolic Naming Composite; Rapid Non-Symbolic Naming Composite; Alternative Phonological Awareness Composite", ageRange: "4:0 – 24:11" },
  { test: "CVLT-3", fullName: "California Verbal Learning Test, Third Edition", usedFor: "Comprehensive assessment of verbal learning and memory deficits", domains: "List Learning; Short-Delay Free / Cued Recall; Long-Delay Free / Cued Recall; Recognition; False Positives", indices: "Total Recall (Trials 1–5 T-score); Short- and Long-Delay Free / Cued Recall; Long-Delay Recognition Hits; False Positives; Discriminability Index; Response Bias (c); Intrusions; Repetitions; Semantic and Serial Clustering", ageRange: "16:0 – 89:11" },
  { test: "CPT-III", fullName: "Conners Continuous Performance Test, Third Edition", usedFor: "Attention, impulsivity, and hyperactivity", domains: "Inattentiveness (Omissions); Impulsivity (Commissions); Sustained Attention; Response Variability", indices: "Detectability (d'); Omissions; Commissions; Perseverations; Hit Reaction Time (HRT); HRT Standard Error; Variability; Response Style (Beta); ADHD Confidence Index", ageRange: "8:0+" },
  { test: "D-KEFS", fullName: "Delis-Kaplan Executive Function System", usedFor: "Higher-level cognitive functions — attention, planning, problem-solving, decision-making", domains: "Color-Word Interference; Design Fluency; Proverb Test; Sorting Test; Tower; Trail Making; Twenty Questions; Verbal Fluency; Word Context", indices: "No composite index; individual subtest scaled scores. Color-Word Interference (Stroop): inhibition of automatic responses. Design Fluency: initiation of problem-solving, fluency in generating visual patterns, rule compliance. Proverb Test: verbal abstraction. Sorting Test: verbal/non-verbal problem-solving, cognitive flexibility, inhibition. Tower: spatial planning, rule learning, inhibition. Trail Making: mental flexibility on visual-motor sequencing. Twenty Questions: deductive reasoning. Verbal Fluency: fluent word generation in a phonemic format while task switching. Word Context: deductive reasoning, hypothesis testing, cognitive flexibility.", ageRange: "8:0 – 89:11" },
  { test: "DEST-II", fullName: "Dyslexia Early Screening Test, Second Edition", usedFor: "Dyslexia screening", domains: "Rapid Naming; Bead Threading; Phonological Discrimination; Postural Stability; Rhyme; Sound Order; Letter Knowledge", indices: "At-Risk Quotient (ARQ); subtest scores", ageRange: "4:6 – 6:5" },
  { test: "DST-J", fullName: "Dyslexia Screening Test — Junior", usedFor: "Dyslexia screening", domains: "Rapid Naming; Bead Threading; Phonemic Segmentation; Backwards Digit Span; Nonsense Passage Reading; Spoonerisms", indices: "Screening Score (At-Risk / Not At-Risk); subtest scores", ageRange: "6:6 – 11:5" },
  { test: "DST-II", fullName: "Dyslexia Screening Test, Second Edition", usedFor: "Dyslexia screening", domains: "Rapid Naming; Bead Threading; Phonemic Segmentation; Backwards Digit Span; Nonsense Passage Reading; Spoonerisms", indices: "Screening Score (At-Risk / Not At-Risk); subtest scores", ageRange: "4:6 – 65+" },
  { test: "EVT-3", fullName: "Expressive Vocabulary Test, Third Edition", usedFor: "Expressive language and word retrieval", domains: "Expressive Vocabulary; Word Retrieval", indices: "Expressive Vocabulary Total Score; Growth Score Value (GSV)", ageRange: "2:6 – 90+" },
  { test: "FAM", fullName: "Feifer Assessment of Mathematics", usedFor: "Comprehensive assessment of mathematics", domains: "Procedural Dyscalculia; Verbal Dyscalculia; Semantic Dyscalculia", indices: "Global Math Index (GMI); Procedural Index; Semantic Index; Verbal Index; subtest scores", ageRange: "4:0 – 21:11" },
  { test: "FAR", fullName: "Feifer Assessment of Reading", usedFor: "Comprehensive assessment of reading", domains: "Phonological Dyslexia; Surface Dyslexia; Mixed Dyslexia", indices: "Global Reading Index (GRI); Phonological Index; Surface Index; Mixed Index; subtest scores", ageRange: "4:0 – 21:11" },
  { test: "FAW", fullName: "Feifer Assessment of Writing", usedFor: "Comprehensive assessment of writing", domains: "Dysgraphia (Phonological, Surface, Mixed)", indices: "Global Writing Index (GWI); Phonological Dysgraphia Index; Surface Dysgraphia Index; Mixed Dysgraphia Index", ageRange: "4:0 – 21:11" },
  { test: "FTT", fullName: "Finger Tapping Test", usedFor: "Motor performance in the upper extremities", domains: "Dominant Hand Tapping; Non-Dominant Hand Tapping", indices: "Dominant Hand Tapping Rate; Non-Dominant Hand Tapping Rate; Dominant / Non-Dominant Ratio", ageRange: "9:0+" },
  { test: "KADI", fullName: "Krug Asperger's Disorder Index", usedFor: "Distinguishes Asperger's from high-functioning autism; informs educational planning", domains: "Language; Social Interaction; Sensory / Motor; Behavioral Patterns", indices: "KADI Total Score (Asperger's Index)", ageRange: "6:0 – 22:11" },
  { test: "KABC-II", fullName: "Kaufman Assessment Battery for Children, Second Edition", usedFor: "Broadband cognitive ability measure for children", domains: "Sequential / Gsm; Simultaneous / Gv; Learning / Glr; Planning / Gf; Knowledge / Gc", indices: "Mental Processing Index (MPI) or Fluid-Crystallized Index (FCI); scale indices for each domain", ageRange: "3:0 – 18:11" },
  { test: "KTEA-3", fullName: "Kaufman Test of Educational Achievement, Third Edition", usedFor: "Comprehensive assessment of academic achievement in reading, math, written language, and oral language", domains: "Reading; Math; Written Language; Oral Language; Academic Skills Battery", indices: "Academic Skills Battery (ASB) Composite; Core Composites: Reading, Math, Written Language; Supplemental Composites: Sound-Symbol, Decoding, Reading Fluency, Reading Understanding, Oral Language, Oral Fluency, Comprehension, Expression, Orthographic Processing, Academic Fluency; Growth Scale Values (GSV); error analysis available for 10 subtests; 19 subtests total, Forms A and B", ageRange: "4:6 – 25:11" },
  { test: "MIGDAS-2", fullName: "Monteiro Interview Guidelines for Diagnosing the Autism Spectrum, Second Edition", usedFor: "Autism / Asperger's", domains: "Sensory Interests / Repetitive Behaviors; Social and Emotional Skills; Language; Cognitive Awareness", indices: "Overall Autism Spectrum Rating; domain scores", ageRange: "3:0 – 99:11" },
  { test: "MSVT", fullName: "Medical Symptom Validity Test", usedFor: "Effort / memory / malingering screening", domains: "Immediate Recognition; Delayed Recognition; Consistency", indices: "Immediate Recognition (IR); Delayed Recognition (DR); Consistency (CNS); Paired Associates (PA); Free Recall (FR); Pass / Fail cutoffs", ageRange: "Adult" },
  { test: "MVP", fullName: "Memory Validity Profile", usedFor: "Effort / memory / malingering screening", domains: "Immediate Memory; Delayed Memory; Consistency", indices: "Immediate Memory Index; Delayed Memory Index; Consistency Index; Pass / Fail determination", ageRange: "5:0 – 21:11" },
  { test: "NAB", fullName: "Neuropsychological Assessment Battery", usedFor: "Broadband cognitive ability measure", domains: "Attention; Language; Memory; Spatial; Executive Functions", indices: "Total NAB Index; Module Indices: Attention, Language, Memory, Spatial, Executive Functions", ageRange: "18:0 – 97:11" },
  { test: "NEPSY-II", fullName: "Developmental NEuroPSYchological Assessment, Second Edition", usedFor: "Sensorimotor function, language, visuospatial processing, memory and learning, attention/executive functions, and social cognition", domains: "Attention / Executive Functions; Language; Memory and Learning; Sensorimotor; Visuospatial Processing; Social Perception", indices: "No global composite; domain scores for each area", ageRange: "3:0 – 16:11" },
  { test: "PASAT", fullName: "Paced Auditory Serial Addition Task", usedFor: "Auditory attentional processing, speed, mental flexibility, and calculation ability", domains: "Auditory Attention; Processing Speed; Mental Flexibility; Calculation Ability", indices: "PASAT Total Score (correct responses); Paced Serial Addition Score", ageRange: "Adolescent – Adult" },
  { test: "PVAT", fullName: "Ortiz Picture Vocabulary Acquisition Test", usedFor: "Receptive language", domains: "Receptive Vocabulary; Language Acquisition", indices: "Acquisition Score; Vocabulary Age Equivalent; Language Acquisition Index", ageRange: "2:6 – 22:11" },
  { test: "PPVT-5", fullName: "Peabody Picture Vocabulary Test, Fifth Edition", usedFor: "Receptive language", domains: "Receptive Vocabulary", indices: "Receptive Vocabulary Score (Standard Score); Growth Scale Value (GSV)", ageRange: "2:6 – 90+" },
  { test: "PdPVTS", fullName: "Pediatric Performance Validity Test Suite", usedFor: "Effort / malingering screening in children", domains: "Performance Validity; Memory Validity; Effort", indices: "Performance Validity Index; individual test scores (TOMM-C, MSVT-C, Rey-15-C); Pass / Fail classification", ageRange: "5:0 – 18:11" },
  { test: "R-PAS", fullName: "Rorschach Performance Assessment System", usedFor: "Projective measure of social and emotional functioning", domains: "Engagement / Cognitive Processing; Memory; Perception / Thinking Problems; Stress and Distress; Self-Perception; Interpersonal Perception", indices: "Page 1: Engagement & Cognitive Processing, Memory, Perception & Thinking Problems. Page 2: Stress & Distress, Self & Other Representation. Complexity; EII-3; SC-Comp; TP-Comp", ageRange: "5:0+" },
  { test: "RBANS", fullName: "Repeatable Battery for the Assessment of Neuropsychological Status", usedFor: "Broadband cognitive ability measure (often used with older adults)", domains: "Immediate Memory; Visuospatial / Constructional; Language; Attention; Delayed Memory", indices: "Total Scale Index; domain indices for each area", ageRange: "12:0 – 89:11" },
  { test: "Roberts-2", fullName: "Roberts Apperception Test for Children, Second Edition", usedFor: "Projective measure of social and emotional functioning", domains: "Reliance on Others; Support from Others; Family Acceptance; Limit Setting; Ego Functioning; Emotional Tone", indices: "Theme Overview Scales; Available Resources Scales; Problem Identification, Resolution, Emotion, Outcome; Clinical Scales: Anxiety, Aggression, Depression, Rejection, Unusual / Atypical Responses", ageRange: "6:0 – 18:11" },
  { test: "SCAN-3", fullName: "Tests for Auditory Processing Disorders", usedFor: "Auditory processing disorders in adolescents and adults", domains: "Filtered Words; Auditory Figure Ground; Competing Words; Competing Sentences", indices: "Composite Score; subtest scores: Filtered Words, Auditory Figure Ground, Competing Words (Directed Ear, Free Recall), Competing Sentences", ageRange: "13:0 – 50:11" },
  { test: "REY-15 (FIT)", fullName: "Rey 15-Item Visual Memory Test", usedFor: "Memory / malingering screening", domains: "Recall; Recognition; Effort / Validity", indices: "Total Correct Score (0–15); Recognition Score; Combined Score; Pass / Fail cutoffs", ageRange: "11:0+" },
  { test: "Sentence Completion", fullName: "Rotter Incomplete Sentences Blank", usedFor: "Projective measure of social and emotional functioning", domains: "Social and Emotional Functioning (Projective)", indices: "Adjustment Score (overall maladjustment); individual item ratings", ageRange: "High school+" },
  { test: "TAT", fullName: "Thematic Apperception Test", usedFor: "Projective measure of social and emotional functioning", domains: "Social and Emotional Functioning (Projective)", indices: "Qualitative analysis; no standardized index scores — scored for themes, needs, press, and narrative structure", ageRange: "5:0 – 79:11" },
  { test: "TEA", fullName: "Test of Everyday Attention", usedFor: "Selective and sustained attention", domains: "Selective Attention; Sustained Attention; Attentional Switching", indices: "Selective Attention Score; Sustained Attention Score; Attentional Switching Score; subtest scores", ageRange: "18:0 – 80:11" },
  { test: "TOD", fullName: "Test of Dyslexia", usedFor: "Comprehensive test for dyslexia in children and adults", domains: "Phonological Awareness; Rapid Automatized Naming; Orthographic Processing; Reading Fluency; Reading Comprehension", indices: "Total Dyslexia Index (TDI); domain indices for each area", ageRange: "5:0 – 89:11" },
  { test: "ToPF", fullName: "Test of Premorbid Functioning", usedFor: "Pre-injury intellectual abilities", domains: "Premorbid Intellectual Functioning", indices: "Predicted FSIQ Score; Predicted GAI Score; confidence intervals for premorbid functioning", ageRange: "16:0 – 90:11" },
  { test: "TOMAL-2", fullName: "Test of Memory and Learning, Second Edition", usedFor: "Recall, attention, learning, and memory", domains: "Core Memory Indices; Supplementary Memory Indices; Delayed Recall; Attention / Concentration", indices: "Composite Memory Index (CMI); Verbal Memory Index (VMI); Nonverbal Memory Index (NMI); Delayed Recall Index (DRI); Learning Index (LI); Attention / Concentration Index (ACI)", ageRange: "5:0 – 59:11" },
  { test: "TEA-Ch", fullName: "Test of Everyday Attention for Children", usedFor: "Response inhibition and selective / sustained attention in children", domains: "Selective Attention; Sustained Attention; Attentional Control; Response Inhibition", indices: "Attention Score (overall); subtest scores: Sky Search, Score!, Sky Search DT, Score! DT, Creature Counting, Walk/Don't Walk, Opposite Worlds, Code Transmission", ageRange: "6:0 – 16:11" },
  { test: "TOMM", fullName: "Test of Memory Malingering", usedFor: "Effort / memory / malingering screening", domains: "Trial 1; Trial 2; Retention; Recognition (Effort / Validity)", indices: "Trial 1 Score; Trial 2 Score; Retention Score; Recognition Score; Pass / Fail cutoffs", ageRange: "16:0 – 84:11" },
  { test: "WAIS-5", fullName: "Wechsler Adult Intelligence Scale, Fifth Edition", usedFor: "Broadband cognitive ability measure for adolescents and adults; co-normed with WMS-5", domains: "Verbal Comprehension; Visual Spatial; Fluid Reasoning; Working Memory; Processing Speed", indices: "Full Scale IQ (FSIQ; from 7 primary subtests); Five Primary Index Scores: VCI, VSI, FRI, WMI, PSI; 15 Ancillary Index Scores including GAI, CPI, NVI, NMI, VECI, EFI, QRI, EPSI, MRPSI, AWMI-R, AWMI-M, EWMI, EVSI, VWMI, VRI; 13 Process Scores; 20 subtests total (10 Primary, 10 Secondary); norms collected 2023–2024, co-normed with WMS-5", ageRange: "16:0 – 90:11" },
  { test: "WASI-II", fullName: "Wechsler Abbreviated Scale of Intelligence, Second Edition", usedFor: "Brief assessment of cognitive abilities", domains: "Verbal Comprehension; Perceptual Reasoning", indices: "Full Scale IQ (2-subtest FSIQ-2; 4-subtest FSIQ-4); Verbal Comprehension Index (Vocabulary, Similarities); Perceptual Reasoning Index (Matrix Reasoning, Block Design)", ageRange: "6:0 – 90:11" },
  { test: "WCST", fullName: "Wisconsin Card Sorting Task", usedFor: "Executive functioning — abstract reasoning and cognitive shifting", domains: "Perseverative Errors; Perseverative Responses; Failure to Maintain Set; Conceptual Level Responses; Categories Completed", indices: "Categories Completed; Perseverative Responses; Perseverative Errors; Non-Perseverative Errors; Conceptual Level Responses; Trials to Complete First Category; Failure to Maintain Set; Learning to Learn", ageRange: "6:5 – 89:11" },
  { test: "WIAT-III", fullName: "Wechsler Individual Achievement Test, Third Edition", usedFor: "Comprehensive assessment of listening, speaking, reading, writing, and math abilities", domains: "Oral Language; Total Reading; Basic Reading; Reading Comprehension & Fluency; Written Expression; Mathematics; Math Fluency", indices: "Total Achievement Composite; Domain Composites for each area", ageRange: "4:0 – 50:11" },
  { test: "WISC-V", fullName: "Wechsler Intelligence Scale for Children, Fifth Edition", usedFor: "Broadband cognitive ability measure for children", domains: "Verbal Comprehension; Visual Spatial; Fluid Reasoning; Working Memory; Processing Speed", indices: "Full Scale IQ (FSIQ); General Ability Index (GAI); Cognitive Proficiency Index (CPI); Nonverbal Index (NVI); Expanded Fluid Index (EFI); Quantitative Reasoning Index (QRI); Primary Index Scores: VCI, VSI, FRI, WMI, PSI", ageRange: "6:0 – 16:11" },
  { test: "WJ V", fullName: "Woodcock-Johnson Tests, Fifth Edition", usedFor: "Comprehensive assessment of cognitive abilities, academic achievement, and oral language; theory-based on the Cattell-Horn-Carroll (CHC) model", domains: "Cognitive: Comprehension-Knowledge (Gc), Fluid Reasoning (Gf), Short-Term Working Memory (Gwm), Processing Speed (Gs), Auditory Processing (Ga), Long-Term Storage (Gl), Retrieval Fluency (Gr), Visual Processing (Gv). Achievement: Reading, Mathematics, Written Language, Oral Language, Academic Knowledge", indices: "Cognitive Battery: General Intellectual Ability (GIA), Brief Intellectual Ability (BIA), Gf-Gc Composite. CHC Cluster Scores: Gc, Gf, Gwm, Gs, Ga, Gl, Gr, Gv (WJ V separates Long-Term Retrieval into Gl and Gr). Achievement Battery: Broad Achievement Composite; Cluster Scores: Reading, Mathematics, Written Language, Oral Language, Academic Knowledge, Academic Skills, Academic Fluency, Academic Applications. WJ V: 20 COG tests (14 Standard + 6 Extended), 17 new tests vs WJ IV, 9 new clusters, fully digital platform. WJ V VTL: 15-test Virtual Test Library for supplemental oral language / linguistic assessment. Post-pandemic norms (2023–2024).", ageRange: "2:0 – 90:11" },
  { test: "WPPSI-IV", fullName: "Wechsler Preschool and Primary Scale of Intelligence, Fourth Edition", usedFor: "Broadband cognitive ability measure for toddlers and young children", domains: "Verbal Comprehension; Visual Spatial; Fluid Reasoning; Working Memory; Processing Speed", indices: "Full Scale IQ (FSIQ); General Ability Index (GAI); Index Scores (4:0–7:7): VCI, VSI, FRI, WMI, PSI. Ages 2:6–3:11: VCI, VSI, FSIQ only", ageRange: "2:6 – 7:7" },
  { test: "WRAT5", fullName: "Wide Range Achievement Test, Fifth Edition", usedFor: "Reading, spelling, and math abilities", domains: "Word Reading; Sentence Comprehension; Spelling; Math Computation; Reading Composite", indices: "Word Reading Standard Score; Sentence Comprehension Standard Score; Spelling Standard Score; Math Computation Standard Score; Reading Composite Standard Score", ageRange: "5:0 – 85:11" },
  { test: "WRAVMA", fullName: "Wide Range Assessment of Visual Motor Abilities", usedFor: "Visual-motor abilities", domains: "Drawing; Matching; Pegboard", indices: "Drawing Standard Score; Matching Standard Score; Pegboard Standard Score; Visual Motor Integration Composite", ageRange: "3:0 – 17:11" },
];

const subjectiveMeasures: MeasureRow[] = [
  { test: "ABAS-3", fullName: "Adaptive Behavior Assessment System, Third Edition", usedFor: "Skills of daily living in children with suspected developmental delays, intellectual disabilities, or autism", domains: "Conceptual Skills; Social Skills; Practical Skills; General Adaptive Composite", indices: "General Adaptive Composite (GAC); Domain Composites: Conceptual, Social, Practical; Skill Area scores: Communication, Community Use, Functional Academics, Home/School Living, Health and Safety, Leisure, Self-Care, Self-Direction, Social, Work", ageRange: "Birth – 89:11" },
  { test: "BAI", fullName: "Beck Anxiety Inventory", usedFor: "Anxiety severity and level", domains: "Subjective Anxiety; Neurophysiological Symptoms; Autonomic Symptoms; Panic Symptoms", indices: "Total Score (0–63); severity classification: Minimal, Mild, Moderate, Severe", ageRange: "17:0 – 80:11" },
  { test: "BASC-3", fullName: "Behavior Assessment System for Children, Third Edition", usedFor: "Behavioral, social, and emotional functioning in children", domains: "Externalizing Problems; Internalizing Problems; Behavioral Symptoms Index; Adaptive Skills", indices: "Behavioral Symptoms Index (BSI); Externalizing Problems Composite; Internalizing Problems Composite; Adaptive Skills Composite. Scales: Hyperactivity, Aggression, Conduct Problems, Anxiety, Depression, Somatization, Atypicality, Withdrawal, Attention Problems, Adaptability, Social Skills, Leadership, Activities of Daily Living, Functional Communication", ageRange: "2:0 – 21:11" },
  { test: "BDI-II", fullName: "Beck Depression Inventory, Second Edition", usedFor: "Depression severity and level", domains: "Affective; Cognitive; Somatic; Vegetative Symptoms of Depression", indices: "Total Score (0–63); severity classification: Minimal, Mild, Moderate, Severe; Cognitive-Affective Subscale; Somatic-Vegetative Subscale", ageRange: "13:0 – 80:11" },
  { test: "BYI", fullName: "Beck Youth Inventories", usedFor: "Depression, anxiety, anger, disruptive behavior, and self-concept in children", domains: "Depression; Anxiety; Anger; Disruptive Behavior; Self-Concept", indices: "Five separate inventories with a Total Score each: BDI-Y (Depression), BAI-Y (Anxiety), BANI-Y (Anger), BDBI-Y (Disruptive Behavior), BSCI-Y (Self-Concept)", ageRange: "7:0 – 18:11" },
  { test: "DIVA", fullName: "Diagnostic Interview for ADHD in Adults", usedFor: "ADHD in adults", domains: "Inattention; Hyperactivity / Impulsivity (Childhood and Adulthood)", indices: "Inattention symptom count (childhood & adulthood); Hyperactivity / Impulsivity symptom count (childhood & adulthood); DSM-5 criteria met (Yes / No)", ageRange: "18:0+" },
  { test: "KSADS", fullName: "Kiddie Schedule for Affective Disorders and Schizophrenia", usedFor: "Mood disorders and schizophrenia in youth", domains: "Mood Disorders; Psychotic Disorders; Anxiety Disorders; Behavioral Disorders", indices: "Diagnostic determinations (current and past) across each disorder category; no continuous index scores", ageRange: "6:0 – 18:11" },
  { test: "M-PACI", fullName: "Millon Pre-Adolescent Clinical Inventory", usedFor: "Broadband personality measure", domains: "Personality patterns and clinical concerns in pre-adolescents", indices: "No global composite; T-scores for 18 scales: Introversive Feelings, Inhibited Style, Doleful Mood, Submissive Style, Dramatizing Style, Egotistic Style, Unruly Style, Forceful Style, Oppositional Style, Borderline Style, Self-Demeaning Style, Anxious Feelings, Somatic Signs, Depressive Moods, Identity Diffusion, Social Insensitivity, Social Isolation, Family Discord", ageRange: "9:0 – 12:11" },
  { test: "MACI-II", fullName: "Millon Adolescent Clinical Inventory, Second Edition", usedFor: "Broadband mental health and behavioral concern measure", domains: "Personality Patterns; Expressed Concerns; Clinical Syndromes", indices: "Personality Patterns scales (12); Expressed Concerns scales (8); Clinical Syndromes scales (7); Modifying Indices: Disclosure, Desirability, Debasement", ageRange: "13:0 – 18:11" },
  { test: "MCMI-IV", fullName: "Millon Clinical Multiaxial Inventory, Fourth Edition", usedFor: "Broadband personality measure", domains: "Clinical Personality Patterns; Severe Personality Pathology; Clinical Syndromes; Severe Clinical Syndromes", indices: "Modifying Indices (Disclosure, Desirability, Debasement, Validity); Clinical Personality Patterns (14 scales); Severe Personality Pathology (3 scales); Clinical Syndromes (10 scales); Severe Clinical Syndromes (3 scales)", ageRange: "18:0+" },
  { test: "MMPI-3", fullName: "Minnesota Multiphasic Personality Inventory, Third Edition", usedFor: "Broadband personality measure", domains: "Validity Scales; Clinical Scales; Restructured Clinical Scales; Somatic / Cognitive Scales; Internalizing Scales; Externalizing Scales; Interpersonal Scales; Interest Scales; PSY-5 Scales", indices: "Validity Scales (10): VRIN-r, TRIN-r, CRIN, F-r, Fp-r, Fs, FBS-r, RBS, L-r, K-r. Higher-Order Scales (3): EID, THD, BXD. Restructured Clinical Scales (9 RC scales). Somatic / Cognitive Scales (10). Internalizing Scales (9). Externalizing Scales (7). Interpersonal Scales (4). PSY-5 Scales (5). Interest Scales (2)", ageRange: "18:0+" },
  { test: "PAI", fullName: "Personality Assessment Inventory", usedFor: "Broadband personality measure", domains: "Clinical Scales; Treatment Scales; Interpersonal Scales; Validity Scales", indices: "No global composite; 4 Validity Scales, 11 Clinical Scales, 5 Treatment Consideration Scales, 2 Interpersonal Scales (22 full scales total); 31 subscales embedded within select scales", ageRange: "18:0 – 89:11" },
  { test: "RSCA", fullName: "Resiliency Scales for Children and Adolescents", usedFor: "Strengths, resiliency, resources, and vulnerabilities", domains: "Sense of Mastery; Sense of Relatedness; Emotional Reactivity", indices: "Sense of Mastery Index; Sense of Relatedness Index; Emotional Reactivity Index; Resource Index; Vulnerability Index", ageRange: "9:0 – 18:11" },
  { test: "SCID-5", fullName: "Structured Clinical Interview for DSM-5", usedFor: "Broadband personality measure across Clusters A, B, and C plus Other Specified Personality Disorders", domains: "Cluster A (Paranoid, Schizoid, Schizotypal); Cluster B (Antisocial, Borderline, Histrionic, Narcissistic); Cluster C (Avoidant, Dependent, Obsessive-Compulsive)", indices: "Diagnostic determinations (Present / Absent / Threshold / Subthreshold) for each personality disorder across Clusters A, B, C, and Other Specified; no continuous index scores", ageRange: "18:0+" },
  { test: "SRS-2", fullName: "Social Responsiveness Scale, Second Edition", usedFor: "Presence or severity of social impairment in autism", domains: "Social Awareness; Social Cognition; Social Communication; Social Motivation; Restricted / Repetitive Behaviors", indices: "SRS Total Score (T-score); subscale T-scores; Social Communication and Interaction (SCI) subscale", ageRange: "2:6+" },
  { test: "TABS", fullName: "Trauma and Attachment Beliefs Scale", usedFor: "Long-term impact of trauma", domains: "Safety; Trust; Power; Esteem; Intimacy", indices: "Total Score; subscale scores for each domain", ageRange: "9:0+" },
  { test: "BAARS-IV", fullName: "Barkley Adult ADHD Rating Scale, Fourth Edition", usedFor: "ADHD symptom severity in adults — current and retrospective childhood symptoms", domains: "Inattention; Hyperactivity; Impulsivity; Sluggish Cognitive Tempo", indices: "Inattention Total Score; Hyperactivity Total Score; Impulsivity Total Score; Sluggish Cognitive Tempo (SCT) Total Score; Current Symptoms scale; Childhood Symptoms scale; ADHD symptom counts for DSM-5 criteria; Self-Report and Other-Report forms", ageRange: "18:0+" },
  { test: "Conners-4", fullName: "Conners Fourth Edition", usedFor: "ADHD symptoms, associated impairments, and common co-occurring problems in children and youth; multi-informant", domains: "Inattention / Executive Dysfunction; Hyperactivity; Impulsivity; Emotional Dysregulation", indices: "Content Scales: Inattention / Executive Dysfunction, Hyperactivity, Impulsivity, Emotional Dysregulation; T-scores and percentiles; multi-informant (Parent, Teacher, Self-Report)", ageRange: "6:0 – 18:11" },
  { test: "BRIEF-2", fullName: "Behavior Rating Inventory of Executive Function, Second Edition", usedFor: "Executive functioning behaviors in home and school settings for children and adolescents", domains: "Behavioral Regulation; Emotional Regulation; Cognitive Regulation", indices: "Global Executive Composite (GEC); Index Scores: BRI, ERI, CRI. Scales: Inhibit, Self-Monitor, Shift, Emotional Control, Initiate, Working Memory, Plan/Organize, Task-Monitor, Organization of Materials", ageRange: "5:0 – 18:11 (BRIEF-P for 2:0 – 5:11)" },
  { test: "BRIEF-A", fullName: "Behavior Rating Inventory of Executive Function — Adult Version", usedFor: "Executive functioning behaviors in adults in everyday environments", domains: "Behavioral Regulation; Metacognition; Global Executive Functioning", indices: "Global Executive Composite (GEC); Index Scores: BRI, MI. Scales: Inhibit, Shift, Emotional Control, Self-Monitor, Initiate, Working Memory, Plan/Organize, Task Monitor, Organization of Materials. Self-Report and Informant Report forms", ageRange: "18:0 – 90:0" },
  { test: "SIB-R", fullName: "Scales of Independent Behavior, Revised", usedFor: "Functional independence and adaptive behavior; maladaptive behavior", domains: "Motor Skills; Social Interaction / Communication; Personal Living Skills; Community Living Skills; Maladaptive Behavior", indices: "Broad Independence Score; Cluster Scores: Motor Skills, Social Interaction and Communication, Personal Living Skills, Community Living Skills; Maladaptive Behavior Indexes: General Maladaptive Index, Internalized, Asocial, Externalized; Support Score", ageRange: "Infancy – 80:11" },
  { test: "CDI-2", fullName: "Children's Depression Inventory, Second Edition", usedFor: "Depression symptoms and their impact in children and adolescents", domains: "Emotional Problems; Functional Problems", indices: "Total Score; Scale Scores: Emotional Problems (Negative Mood / Physical Symptoms, Negative Self-Esteem); Functional Problems (Ineffectiveness, Interpersonal Problems); Self-Report, Parent, Teacher forms", ageRange: "7:0 – 17:11" },
  { test: "CBCL (Child)", fullName: "Child Behavior Checklist (Achenbach System of Empirically Based Assessment — ASEBA)", usedFor: "Behavioral, emotional, and social problems in children and adolescents; part of the ASEBA system", domains: "Internalizing Problems; Externalizing Problems; Total Problems; DSM-Oriented Scales; Social Competence", indices: "Total Problems Score; Internalizing Composite (Anxious/Depressed, Withdrawn/Depressed, Somatic Complaints); Externalizing Composite (Rule-Breaking Behavior, Aggressive Behavior); Syndrome Scales (8); DSM-Oriented Scales: Depressive Problems, Anxiety Problems, Somatic Problems, ADHD Problems, Oppositional Defiant Problems, Conduct Problems; Competence Scales: Activities, Social, School. Companion forms: Teacher Report Form (TRF, 6–18), Youth Self-Report (YSR, 11–18)", ageRange: "6:0 – 18:11" },
  { test: "CBCL (Preschool)", fullName: "Child Behavior Checklist for Ages 1.5–5 (ASEBA Preschool)", usedFor: "Behavioral, emotional, and social problems in toddlers and preschool-age children", domains: "Internalizing Problems; Externalizing Problems; Total Problems; DSM-Oriented Scales", indices: "Total Problems Score; Internalizing Composite (Emotionally Reactive, Anxious/Depressed, Somatic Complaints, Withdrawn); Externalizing Composite (Attention Problems, Aggressive Behavior); Syndrome Scales (7); DSM-Oriented Scales: Depressive Problems, Anxiety Problems, Autism Spectrum Problems, ADHD Problems, Oppositional Defiant Problems. Companion form: Caregiver-Teacher Report Form (C-TRF, 1.5–5)", ageRange: "1:6 – 5:11" },
  { test: "ABCL", fullName: "Adult Behavior Checklist (ASEBA)", usedFor: "Behavioral, emotional, and social problems in adults; observer / collateral report form", domains: "Internalizing Problems; Externalizing Problems; Total Problems; DSM-Oriented Scales; Adaptive Functioning", indices: "Total Problems Score; Internalizing Composite (Anxious/Depressed, Withdrawn, Somatic Complaints); Externalizing Composite (Aggressive Behavior, Rule-Breaking Behavior, Intrusive); Syndrome Scales (8); DSM-Oriented Scales: Depressive Problems, Anxiety Problems, Somatic Problems, Avoidant Personality, ADHD Problems, Antisocial Personality; Adaptive Functioning: Friends, Spouse/Partner, Family, Job. Observer / collateral-report; pairs with ASR (self-report); for ages 60+ use OABCL", ageRange: "18:0 – 59:11" },
];

type MeasureGroup = {
  name: string;
  blurb: string;
  tests: string[];
};

function smartSplit(s: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let buf = "";
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth = Math.max(0, depth - 1);
    if (ch === ";" && depth === 0) {
      const t = buf.trim();
      if (t) parts.push(t);
      buf = "";
    } else {
      buf += ch;
    }
  }
  const last = buf.trim();
  if (last) parts.push(last);
  return parts;
}

function escapeTableCell(s: string): string {
  return s.replace(/\|/g, "\\|").replace(/\n/g, " ");
}

function buildStudyGuide(
  title: string,
  intro: string,
  measures: MeasureRow[],
  groups: MeasureGroup[],
): string {
  const byTest = new Map(measures.map((m) => [m.test, m]));
  const out: string[] = [];

  out.push(`# ${title}`);
  out.push("");
  out.push(intro);
  out.push("");

  // Master at-a-glance index
  out.push(`## Master index`);
  out.push("");
  out.push(`Each instrument is grouped below by what it primarily measures. Use this index to jump to the right section.`);
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

    // Quick reference table for the group
    out.push(`| Test | Full name | What it assesses | Ages |`);
    out.push(`|---|---|---|---|`);
    for (const t of g.tests) {
      const m = byTest.get(t);
      if (!m) continue;
      out.push(
        `| **${escapeTableCell(m.test)}** | ${escapeTableCell(m.fullName)} | ${escapeTableCell(m.usedFor)} | ${escapeTableCell(m.ageRange)} |`,
      );
    }
    out.push("");

    // Detailed per-measure cards
    for (const t of g.tests) {
      const m = byTest.get(t);
      if (!m) continue;
      out.push(`### ${m.test} — ${m.fullName}`);
      out.push("");
      out.push(m.usedFor + ".");
      out.push("");

      out.push(`#### Domains`);
      const domainItems = smartSplit(m.domains);
      if (domainItems.length <= 1) {
        out.push(`- ${m.domains}`);
      } else {
        for (const d of domainItems) out.push(`- ${d}`);
      }
      out.push("");

      out.push(`#### Key indices and scores`);
      const indexItems = smartSplit(m.indices);
      if (indexItems.length <= 1) {
        out.push(`- ${m.indices}`);
      } else {
        for (const x of indexItems) out.push(`- ${x}`);
      }
      out.push("");

      out.push(`**Ages:** ${m.ageRange}`);
      out.push("");
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

const objectiveGroups: MeasureGroup[] = [
  {
    name: "Broadband cognitive and intellectual batteries",
    blurb: "General-ability batteries used to characterize overall intellectual functioning across verbal, nonverbal, working memory, processing speed, and reasoning domains. Most yield a global composite (e.g., Full Scale IQ) plus index-level scores.",
    tests: ["WAIS-5", "WISC-V", "WPPSI-IV", "WASI-II", "KABC-II", "RBANS", "NAB", "NEPSY-II", "WJ V", "BAYLEY-III", "BSRA", "ACS"],
  },
  {
    name: "Memory",
    blurb: "Standardized verbal and visual memory measures used to evaluate encoding, storage, retrieval, learning curves, and recognition.",
    tests: ["CVLT-3", "ChAMP", "TOMAL-2"],
  },
  {
    name: "Academic achievement and learning disabilities",
    blurb: "Performance-based achievement batteries and dyslexia / dyscalculia / dysgraphia screeners. Use these for educational planning, eligibility decisions, and characterizing specific learning disorders.",
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
    blurb: "Tests of fine motor control, visual perception, and the integration between visual input and motor output.",
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
    blurb: "Multi-informant rating scales that capture internalizing, externalizing, and adaptive behaviors across childhood and adulthood. Includes the ASEBA family (CBCL, ABCL, and companion forms) and the BASC-3.",
    tests: ["BASC-3", "CBCL (Child)", "CBCL (Preschool)", "ABCL"],
  },
  {
    name: "Executive function rating scales",
    blurb: "Behavioral ratings of everyday executive functioning at home, school, and work — complements performance-based EF tasks.",
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

async function main() {
  console.log("Seeding Assessment measure topics...");

  // -------- Objective Measures --------
  const objectiveId = await ensureTopic(
    "Objective Measures",
    "Standardized, performance-based instruments used in neuropsychological assessment — including broadband cognitive batteries, achievement tests, language and memory measures, executive function tasks, motor and visual-motor tests, projective measures, and performance validity tests.",
  );

  await replaceStudyGuide(
    objectiveId,
    "Objective Measures — Reference Guide",
    buildStudyGuide(
      "Objective Measures",
      "Objective measures are standardized, performance-based instruments where the examinee actively completes tasks under controlled conditions and responses are scored against normative data. The instruments below are grouped by what they primarily assess. Each group opens with a quick-reference table; below the table, every measure has its own card listing domains, key indices and scores, and the age range for which it is normed.",
      objectiveMeasures,
      objectiveGroups,
    ),
  );

  await replaceFlashcards(objectiveId, [
    { question: "What does the WAIS-5 measure and for what age range?", answer: "The Wechsler Adult Intelligence Scale, Fifth Edition is a broadband cognitive ability measure for adolescents and adults (16:0 – 90:11). It is co-normed with the WMS-5 and yields a Full Scale IQ plus five primary indices: VCI, VSI, FRI, WMI, and PSI.", difficulty: "easy" },
    { question: "What are the five primary index scores on the WISC-V?", answer: "Verbal Comprehension Index (VCI), Visual Spatial Index (VSI), Fluid Reasoning Index (FRI), Working Memory Index (WMI), and Processing Speed Index (PSI). Together with seven primary subtests they generate the Full Scale IQ.", difficulty: "easy" },
    { question: "How does the D-KEFS Color-Word Interference subtest assess executive function?", answer: "It is a Stroop-style task that measures inhibition of automatic responses — the examinee must suppress reading the color word and instead name the ink color, indexing prepotent response inhibition.", difficulty: "medium" },
    { question: "What is the ADOS-2 used for and how is severity quantified?", answer: "The Autism Diagnostic Observation Schedule, Second Edition is a semi-structured observation for autism spectrum disorder. Severity is quantified with the Calibrated Severity Score (CSS) for Social Affect and for Restricted / Repetitive Behaviors. It includes a Toddler Module plus Modules 1–4.", difficulty: "medium" },
    { question: "What is the Test of Premorbid Functioning (ToPF) used for?", answer: "It estimates pre-injury intellectual functioning by combining word reading performance with demographic variables to generate a Predicted FSIQ and Predicted GAI with confidence intervals — useful for benchmarking current performance against expected baseline.", difficulty: "medium" },
    { question: "What is the RBANS designed for?", answer: "The Repeatable Battery for the Assessment of Neuropsychological Status is a brief broadband cognitive measure (12:0 – 89:11), often used with older adults. It yields a Total Scale Index plus domain indices for Immediate Memory, Visuospatial / Constructional, Language, Attention, and Delayed Memory.", difficulty: "easy" },
    { question: "Name three Performance Validity Tests included in or referenced by the spreadsheet.", answer: "Test of Memory Malingering (TOMM), Medical Symptom Validity Test (MSVT), and the Rey 15-Item Test (REY-15 / FIT). The Pediatric Performance Validity Test Suite (PdPVTS) bundles pediatric versions for ages 5–18.", difficulty: "medium" },
    { question: "What does the CVLT-3 measure and what are its core indices?", answer: "The California Verbal Learning Test, Third Edition assesses verbal learning and memory. Core indices include Total Recall (Trials 1–5 T-score), Short- and Long-Delay Free / Cued Recall, Long-Delay Recognition Hits, False Positives, Discriminability, Response Bias, Intrusions, Repetitions, and Semantic / Serial Clustering.", difficulty: "hard" },
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
      question: "Which of the following is the broadband cognitive battery designed primarily for older adults and uses parallel forms for repeat testing?",
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
      "Subjective measures rely on the examinee, a caregiver, teacher, or other informant to report symptoms, behaviors, and functioning. The instruments below are grouped by what they primarily assess. Each group opens with a quick-reference table; below the table, every measure has its own card listing domains, key indices and scores, and the age range for which it is normed.",
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
      explanation: "The Social Responsiveness Scale, Second Edition (SRS-2) is a rating scale across those five subscales. ADOS-2 and MIGDAS-2 are observation-based; KADI distinguishes Asperger's from high-functioning autism.",
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
