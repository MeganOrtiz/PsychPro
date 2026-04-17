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

async function addValidityEffortTopic() {
  console.log("Seeding Validity & Effort Testing topic...");

  const [topic] = await db
    .insert(topicsTable)
    .values({
      name: "Validity & Effort Testing",
      category: "Neuropsychological Assessment",
      description:
        "Performance validity tests (PVTs), symptom validity tests (SVTs), malingering criteria (Slick, Bianchini), embedded indices, MMPI validity scales, base rates, interpretation, and ethical considerations in neuropsychological assessment.",
    })
    .returning();

  const topicId = topic.id;
  console.log(`✓ Created topic id=${topicId}`);

  // ============================================================
  // FLASHCARDS (56)
  // ============================================================
  const flashcards = [
    // Foundational Concepts
    {
      question: "What is a Performance Validity Test (PVT)?",
      answer: "A test or embedded index designed to detect invalid or non-credible cognitive performance — assessing whether an examinee is putting forth genuine effort on cognitive tasks. Examples: TOMM, WMT, Reliable Digit Span.",
      difficulty: "easy",
    },
    {
      question: "What is a Symptom Validity Test (SVT)?",
      answer: "A test or scale designed to detect over-reporting, exaggeration, or fabrication of symptoms on self-report measures. Examples: MMPI-2-RF validity scales (F-r, Fp-r, FBS-r, RBS) and the SIMS.",
      difficulty: "easy",
    },
    {
      question: "What is the DSM-5-TR definition of malingering?",
      answer: "The intentional production of false or grossly exaggerated physical or psychological symptoms motivated by external incentives (e.g., financial compensation, avoiding military duty, evading criminal prosecution, obtaining drugs). It is a V-code, not a mental disorder.",
      difficulty: "medium",
    },
    {
      question: "How does malingering differ from factitious disorder?",
      answer: "Malingering is motivated by EXTERNAL incentives (money, legal advantage). Factitious disorder is motivated by INTERNAL psychological needs (assuming the sick role) with no external gain.",
      difficulty: "medium",
    },
    {
      question: "Why is 'non-credible performance' the preferred term over 'malingering'?",
      answer: "Non-credible performance is a neutral, descriptive term that describes what the data show without requiring inference about intent or motivation. 'Malingering' implies intentionality, which cannot be determined from test data alone.",
      difficulty: "medium",
    },
    {
      question: "What are the approximate base rates of non-credible performance across clinical settings?",
      answer: "~40% in forensic/litigation contexts, 15–30% in disability evaluations, and 5–15% in general clinical settings — making validity assessment essential across all neuropsychological evaluations.",
      difficulty: "hard",
    },
    {
      question: "What organizations have declared validity assessment a required element of neuropsychological practice?",
      answer: "The American Academy of Clinical Neuropsychology (AACN) and the National Academy of Neuropsychology (NAN) have both issued position statements requiring validity assessment as a standard component.",
      difficulty: "medium",
    },
    {
      question: "What is secondary gain?",
      answer: "External benefits derived from being or appearing ill — such as financial compensation, disability status, avoidance of responsibility, or attention. Often present in malingering but can also occur in genuine illness.",
      difficulty: "easy",
    },
    // Forced-Choice Paradigm & Floor Effect
    {
      question: "What is the forced-choice paradigm in PVT design?",
      answer: "A two-alternative forced-choice recognition format where the examinee chooses which of two items was previously seen. Random guessing produces ~50% accuracy; below-chance performance (<50%) indicates deliberate wrong-answer choosing — diagnostic of malingering.",
      difficulty: "medium",
    },
    {
      question: "Why is below-chance performance on a forced-choice PVT diagnostic of malingering?",
      answer: "Scoring significantly below 50% on a two-alternative forced-choice task means the examinee knew the correct answer and deliberately chose the wrong one — chance alone would produce ~50% correct.",
      difficulty: "medium",
    },
    {
      question: "What is the floor effect in PVT design?",
      answer: "Well-designed PVTs are easy enough that even patients with genuine moderate-to-severe cognitive impairment (including dementia) score near ceiling. If a dementia patient passes but a younger person fails, genuine impairment cannot explain the failure.",
      difficulty: "medium",
    },
    // Slick Criteria
    {
      question: "What are the four criteria of the Slick criteria for Malingered Neurocognitive Dysfunction (MND)?",
      answer: "Criterion A: External incentive present. Criterion B: Evidence from neuropsychological testing (PVT failure/below-chance). Criterion C: Evidence from self-report (SVT failure/symptom discrepancies). Criterion D: Not fully explained by psychiatric, neurological, or developmental factors.",
      difficulty: "hard",
    },
    {
      question: "What are the three classifications of MND under the Slick criteria?",
      answer: "Definite MND: Below-chance PVT + external incentive + not otherwise explained. Probable MND: 2+ PVT failures, or 1 PVT failure + SVT evidence. Possible MND: Evidence from self-report only or insufficient for higher threshold.",
      difficulty: "hard",
    },
    {
      question: "What is the Bianchini criteria for Malingered Pain-Related Disability (MPRD)?",
      answer: "Adapted from the Slick framework for chronic pain populations. Requires evidence of external incentive, evidence from physical evaluation, evidence from cognitive testing, and evidence from self-report — similar four-criterion structure.",
      difficulty: "hard",
    },
    // TOMM
    {
      question: "What is the TOMM and who developed it?",
      answer: "The Test of Memory Malingering (TOMM), developed by Tombaugh (1996). It presents 50 line drawings in two learning trials with forced-choice recognition. The most widely used PVT in clinical neuropsychology.",
      difficulty: "easy",
    },
    {
      question: "What are the TOMM cutoffs and which trial is used for validity determination?",
      answer: "Trial 2 is the primary validity indicator: ≤44/50 (below 45) indicates non-credible performance. The Retention Trial uses the same ≤44/50 cutoff. Trial 1 is an orientation/learning trial and is NOT used for validity determination.",
      difficulty: "medium",
    },
    {
      question: "What is a key limitation of the TOMM?",
      answer: "It is widely known — attorneys and claimants increasingly coach examinees to pass it. Some research also suggests Trial 1 may detect feigning at ≤42.",
      difficulty: "medium",
    },
    // WMT
    {
      question: "What is the Word Memory Test (WMT)?",
      answer: "Developed by Green (2003), a computerized verbal memory test with effort subtests (Immediate Recognition, Delayed Recognition, Consistency) and memory subtests. Cutoff: <82.5% on IR, DR, or Consistency indicates non-credible performance.",
      difficulty: "medium",
    },
    {
      question: "What is the unique feature of the WMT that distinguishes it from other PVTs?",
      answer: "The WMT separates memory ability from effort — it can identify genuine amnesia versus feigned memory problems by examining the relationship between effort subtests and harder memory indices.",
      difficulty: "hard",
    },
    // Other PVTs
    {
      question: "What is the Victoria Symptom Validity Test (VSVT)?",
      answer: "A computerized 48-item forced-choice test using 5-digit numbers, classified as Easy or Hard items. Provides Valid, Questionable, or Invalid classifications. Below-chance performance on any portion is diagnostic of deliberate feigning.",
      difficulty: "medium",
    },
    {
      question: "What is the Reliable Digit Span (RDS) and how is it calculated?",
      answer: "Developed by Greiffenstein et al. (1994). Calculated by summing the longest digit string correct on BOTH trials of Digits Forward plus the longest on BOTH trials of Digits Backward. Cutoff: ≤7 indicates non-credible performance.",
      difficulty: "medium",
    },
    {
      question: "What is the Rey 15-Item Memory Test and what is its main limitation?",
      answer: "One of the oldest effort measures (Rey, 1941). Examinees view 15 items arranged in a meaningful pattern and reproduce them after 10 seconds. Traditional cutoff <9 items. Main limitation: LOW sensitivity — many malingerers pass it.",
      difficulty: "medium",
    },
    {
      question: "What is the Dot Counting Test (DCT) E-Score and its cutoff?",
      answer: "The E-Score is a composite of grouped-card time, ungrouped-card time, and errors. A score of ≥17 indicates non-credible performance. Non-credible examinees often take excessive time on grouped (easy) cards.",
      difficulty: "hard",
    },
    {
      question: "What is the Coin in the Hand Test and who is it especially useful for?",
      answer: "A brief bedside measure (10 trials) where the examinee identifies which hand holds a coin after a brief distraction. Score <7/10 suggests non-credible performance. Especially useful for Spanish-speaking populations and low-education individuals because it requires no verbal or literacy skills.",
      difficulty: "medium",
    },
    {
      question: "What is the b Test?",
      answer: "A visual scanning task where examinees circle all lowercase 'b' letters among distractors (d, p, q). Appears demanding but is actually simple. Non-credible examinees produce excessive commission errors, d-errors, or total errors disproportionate to genuine impairment.",
      difficulty: "medium",
    },
    // Embedded Indices
    {
      question: "What are embedded PVT indicators?",
      answer: "Validity indicators derived from standard neuropsychological tests (not dedicated PVTs). They provide validity data without adding testing time and are resistant to specific coaching because examinees cannot easily identify them.",
      difficulty: "medium",
    },
    {
      question: "What are the cautions for using Reliable Digit Span?",
      answer: "May produce false positives in individuals with genuine severe attention deficits, low IQ (FSIQ <70), or English as a second language. Clinical context must always be considered.",
      difficulty: "hard",
    },
    {
      question: "What is the CVLT-II Forced Choice Recognition cutoff for non-credible performance?",
      answer: "Performance below 15/16 on the 16 forced-choice items is suspicious; below-chance performance is diagnostic of deliberate feigning.",
      difficulty: "hard",
    },
    // SVTs — MMPI
    {
      question: "What does the MMPI-2-RF F-r scale detect?",
      answer: "F-r (Infrequent Responses): Items endorsed by <10% of the normative sample. Elevations suggest over-reporting of general psychopathology. Cutoff: T ≥100 (T ≥120 is strong evidence).",
      difficulty: "medium",
    },
    {
      question: "What does the MMPI-2-RF Fp-r scale detect and how does it differ from F-r?",
      answer: "Fp-r (Infrequent Psychopathology Responses): Items rarely endorsed even by psychiatric inpatients — more specific to over-reporting than F-r. Useful when the examinee is known to have genuine psychopathology.",
      difficulty: "hard",
    },
    {
      question: "What does the MMPI-2-RF FBS-r scale detect?",
      answer: "FBS-r (Symptom Validity scale): Originally developed by Lees-Haley for personal injury evaluations. Detects over-reporting of somatic and cognitive complaints. Cutoff: T ≥100.",
      difficulty: "medium",
    },
    {
      question: "What does the MMPI-2-RF RBS scale detect?",
      answer: "RBS (Response Bias Scale): Developed specifically to PREDICT PVT failure. Items empirically associated with non-credible cognitive performance. Cutoff: T ≥100.",
      difficulty: "hard",
    },
    {
      question: "What do the MMPI-2-RF L-r and K-r scales detect?",
      answer: "L-r and K-r detect underreporting and defensiveness — relevant in custody evaluations, fitness-for-duty assessments, and pre-employment screenings where examinees minimize problems.",
      difficulty: "medium",
    },
    // SVTs — PAI, SIMS, SIRS
    {
      question: "What are the primary PAI validity scales for detecting over-reporting?",
      answer: "NIM (Negative Impression Management): Over-reporting. PIM (Positive Impression Management): Under-reporting. MAL (Malingering Index): Configural index of 8 features associated with feigning. RDF (Rogers Discriminant Function): Statistically derived discriminant function.",
      difficulty: "hard",
    },
    {
      question: "What is the SIMS and its cutoff?",
      answer: "Structured Inventory of Malingered Symptomatology: A 75-item true/false self-report screening measure. Five subscales (Psychosis, Neurologic Impairment, Amnestic Disorders, Low Intelligence, Affective Disorders). Total score >14 suggests possible feigning. Should NOT be used in isolation.",
      difficulty: "medium",
    },
    {
      question: "What is the SIRS-2 and why is it considered the gold standard?",
      answer: "The Structured Interview of Reported Symptoms (Rogers). The gold standard structured interview for feigned mental illness. Eight primary scales including rare symptoms, symptom combinations, and improbable symptoms. Provides classifications: genuine, indeterminate, probable feigning, definite feigning.",
      difficulty: "hard",
    },
    {
      question: "What is the M-FAST?",
      answer: "The Miller Forensic Assessment of Symptoms Test: A 25-item structured interview screening for feigned mental illness. Includes unusual hallucinations, reported vs. observed symptoms, extreme symptomatology, and rare combinations. Widely used in forensic and PTSD/VA contexts.",
      difficulty: "medium",
    },
    // Interpretation
    {
      question: "What does AACN best practice recommend regarding the number of PVTs?",
      answer: "At least one PVT per hour of testing, with a minimum of TWO independent PVTs in any comprehensive evaluation. Failure on 2+ independent PVTs provides strong evidence of non-credible performance.",
      difficulty: "medium",
    },
    {
      question: "What interpretation framework applies when one PVT is failed?",
      answer: "A single PVT failure requires careful consideration — it may reflect non-credible performance or a false positive. Context, clinical presentation, base rates, and other indicators must all be integrated.",
      difficulty: "medium",
    },
    {
      question: "Why is specificity prioritized over sensitivity in PVT cutoffs?",
      answer: "Because falsely labeling a genuine patient as malingering (false positive) is considered more harmful than missing some malingerers (false negative). Most PVTs maintain specificity ≥90% (≤10% false positive rate in genuine clinical populations).",
      difficulty: "hard",
    },
    {
      question: "How does a low base rate of malingering affect PVT interpretation?",
      answer: "Even a highly accurate PVT produces many false positives when base rates are low (e.g., 5%). This is why multiple PVT failures are required for strong conclusions — no single test result is sufficient.",
      difficulty: "hard",
    },
    // Confounds
    {
      question: "What are the main clinical confounds that can cause PVT failure without malingering?",
      answer: "Genuine severe cognitive impairment (dementia, ID, severe acute TBI), low education/literacy, English as a second language, cultural factors, acute psychiatric distress (severe depression, psychosis, anxiety), and — to a lesser extent — pain and fatigue.",
      difficulty: "hard",
    },
    {
      question: "Why does coaching by attorneys or websites threaten PVT validity?",
      answer: "Coaching can improve malingerers' ability to evade well-known PVTs like the TOMM. Best practice includes using multiple PVTs, including less-publicized measures and embedded indices that examinees cannot easily identify.",
      difficulty: "medium",
    },
    // Special Populations
    {
      question: "Which context has the highest documented rates of non-credible performance?",
      answer: "Mild traumatic brain injury (mTBI) with pending litigation or disability — rates exceeding 40% in litigating mTBI samples. The natural course of uncomplicated mTBI is full recovery within days to weeks.",
      difficulty: "medium",
    },
    {
      question: "Why are adult ADHD evaluations considered high-risk for non-credible performance?",
      answer: "Non-credible performance rates of 15–50% are documented, particularly when evaluations involve stimulant medication access, academic accommodations (extended testing time for board/bar exams), or disability claims.",
      difficulty: "medium",
    },
    {
      question: "What validity measures are most validated for PTSD/veteran VA disability evaluations?",
      answer: "The MMPI-2-RF and MMPI-3 scales (F-r, Fp-r, FBS-r) and the M-FAST have been extensively validated in veteran populations.",
      difficulty: "medium",
    },
    {
      question: "How should the TOMM be interpreted in older adults with dementia?",
      answer: "The TOMM is relatively robust in dementia — patients with dementia typically pass (≥45/50). However, severely impaired patients may fail legitimately, and some simpler measures (e.g., Coin in the Hand) may over-identify invalid performance in severe dementia.",
      difficulty: "hard",
    },
    // Ethics
    {
      question: "What is the ethical obligation regarding test security for PVTs?",
      answer: "APA Ethics Code Standard 9.11 obligates psychologists to maintain test security — specific PVT items, cutoffs, and methods should not be disclosed in ways that could compromise clinical utility, even under legal discovery pressure.",
      difficulty: "medium",
    },
    {
      question: "What should neuropsychologists tell examinees about validity testing during informed consent?",
      answer: "Examinees should be informed that validity measures will be included in the evaluation. Most neuropsychologists do NOT disclose which specific tests are validity measures but DO inform examinees that effort and truthfulness are being assessed.",
      difficulty: "medium",
    },
    {
      question: "What is the recommended language for reporting non-credible performance in a neuropsychological report?",
      answer: "Objective, data-driven language: 'Mr. X's performance on multiple PVTs fell below established cutoffs, indicating non-credible performance.' Distinguish descriptive statements (non-credible performance) from inferential diagnostic labels (malingering).",
      difficulty: "medium",
    },
    {
      question: "What must be present for a neuropsychologist to offer a malingering opinion?",
      answer: "Evidence of: 1) Invalid performance on PVTs/SVTs, AND 2) External incentive for feigning, AND 3) Absence of alternative explanations. All three elements must be demonstrated.",
      difficulty: "hard",
    },
    // Key Researchers
    {
      question: "Who developed the TOMM and the WMT?",
      answer: "TOMM: Tom Tombaugh (1996). WMT and MSVT: Paul Green.",
      difficulty: "medium",
    },
    {
      question: "Who developed the Slick criteria for MND?",
      answer: "Daniel Slick was the lead author of the original 1999 Slick, Sherman, and Iverson criteria for Malingered Neurocognitive Dysfunction, updated in 2020 by Sherman, Slick, and Iverson.",
      difficulty: "medium",
    },
    {
      question: "Who developed the SIRS and SIRS-2?",
      answer: "Richard Rogers — who is also the leading researcher on malingering of psychiatric symptoms.",
      difficulty: "medium",
    },
    {
      question: "Who developed the MMPI-2-RF and MMPI-3 validity scales?",
      answer: "Yossef Ben-Porath was central to the development of the MMPI-2-RF and MMPI-3 validity scale structure.",
      difficulty: "hard",
    },
    // Quick Reference Cutoffs
    {
      question: "What are the cutoffs for the TOMM Trial 2, WMT, Reliable Digit Span, and SIMS?",
      answer: "TOMM Trial 2: ≤44/50 | WMT IR/DR/Consistency: <82.5% | Reliable Digit Span: ≤7 | SIMS total score: >14",
      difficulty: "hard",
    },
    {
      question: "What is the cutoff for the Coin in the Hand Test and the Rey 15-Item Test?",
      answer: "Coin in the Hand: <7/10 suggests non-credible performance. Rey 15-Item: <9 items recalled suggests non-credible performance (though sensitivity is low).",
      difficulty: "medium",
    },
    {
      question: "What is the Medical Symptom Validity Test (MSVT)?",
      answer: "A shorter version of the WMT (~10 minutes) developed by Paul Green. Uses 10 word pairs with immediate recognition, delayed recognition, consistency, paired associates, free recall, and long delay free recall. Used when time is limited.",
      difficulty: "medium",
    },
  ];

  const insertedFlashcards = await db
    .insert(flashcardsTable)
    .values(flashcards.map((f) => ({ ...f, topicId })))
    .returning();
  console.log(`✓ Inserted ${insertedFlashcards.length} flashcards`);

  // ============================================================
  // REGULAR QUIZ QUESTIONS (10)
  // ============================================================
  const regularQuestions = [
    {
      question: "Which term is preferred when describing test performance that falls below credibility thresholds, without implying intent?",
      optionA: "Malingering",
      optionB: "Factitious presentation",
      optionC: "Non-credible performance",
      optionD: "Secondary gain",
      correctAnswer: "C",
      explanation: "'Non-credible performance' is the preferred neutral, descriptive term because it describes what the data show without requiring inference about the examinee's intent or motivation.",
      examOnly: false,
    },
    {
      question: "What does below-chance performance on a two-alternative forced-choice PVT indicate?",
      optionA: "The examinee has genuine severe cognitive impairment",
      optionB: "The examinee knew the correct answers and deliberately chose wrong ones",
      optionC: "The test has poor reliability",
      optionD: "The examinee was fatigued during testing",
      correctAnswer: "B",
      explanation: "Below-chance (<50%) performance on a forced-choice task is statistically impossible without knowing the correct answers and deliberately avoiding them — it is diagnostic of malingering on its own.",
      examOnly: false,
    },
    {
      question: "What is the primary validity indicator on the TOMM and its cutoff?",
      optionA: "Trial 1; ≤42/50",
      optionB: "Retention Trial; ≤40/50",
      optionC: "Trial 2; ≤44/50",
      optionD: "Trial 2; ≤40/50",
      correctAnswer: "C",
      explanation: "TOMM Trial 2 is the primary validity indicator. A score of ≤44/50 (below 45) indicates non-credible performance. The Retention Trial uses the same cutoff.",
      examOnly: false,
    },
    {
      question: "How does malingering differ from factitious disorder?",
      optionA: "Malingering involves internal psychological needs; factitious involves external gain",
      optionB: "Malingering involves external incentives; factitious involves internal psychological motivation",
      optionC: "Malingering is a mental disorder; factitious disorder is a V-code",
      optionD: "They are clinically identical — only the legal context differs",
      correctAnswer: "B",
      explanation: "Malingering is driven by EXTERNAL incentives (financial, legal, avoidance). Factitious disorder is driven by INTERNAL psychological needs (the sick role) without identifiable external gain.",
      examOnly: false,
    },
    {
      question: "What is the minimum number of PVTs recommended per AACN guidelines in a comprehensive evaluation?",
      optionA: "One PVT total",
      optionB: "One PVT per hour of testing, minimum two total",
      optionC: "Three PVTs regardless of evaluation length",
      optionD: "No specific minimum — clinical judgment determines this",
      correctAnswer: "B",
      explanation: "AACN guidelines recommend at least one PVT per hour of testing, with a minimum of two independent PVTs in any comprehensive neuropsychological evaluation.",
      examOnly: false,
    },
    {
      question: "Which MMPI-2-RF scale was specifically developed to PREDICT PVT failure?",
      optionA: "F-r",
      optionB: "Fp-r",
      optionC: "FBS-r",
      optionD: "RBS",
      correctAnswer: "D",
      explanation: "The RBS (Response Bias Scale) was developed specifically to predict failure on performance validity tests. Items were empirically selected based on their association with non-credible cognitive performance.",
      examOnly: false,
    },
    {
      question: "What is the floor effect in PVT design?",
      answer: "A",
      optionA: "PVTs are designed so that even genuinely impaired patients perform near ceiling — making failure by less-impaired examinees clearly non-credible",
      optionB: "PVTs have a floor of 0% that prevents below-chance scoring",
      optionC: "PVTs are placed at the end of the evaluation to reduce fatigue effects",
      optionD: "PVTs measure the floor of cognitive functioning",
      correctAnswer: "A",
      explanation: "The floor effect design ensures that bona fide patients with significant impairment (e.g., dementia) still pass — so when less-impaired examinees fail, genuine cognitive impairment cannot explain it.",
      examOnly: false,
    },
    {
      question: "Which context has the HIGHEST documented base rate of non-credible performance?",
      optionA: "General clinical outpatient settings",
      optionB: "Pediatric neuropsychology evaluations",
      optionC: "Forensic and litigation contexts (particularly mTBI with pending claims)",
      optionD: "Geriatric dementia evaluations",
      correctAnswer: "C",
      explanation: "Non-credible performance rates exceed 40% in forensic/litigation contexts, particularly mTBI evaluations with pending compensation claims — the highest base rates documented across any clinical setting.",
      examOnly: false,
    },
    {
      question: "The SIRS-2 is considered the gold standard for detecting:",
      optionA: "Non-credible cognitive performance",
      optionB: "Feigned mental illness through structured interview",
      optionC: "Somatic complaint exaggeration",
      optionD: "Malingering of pain-related disability",
      correctAnswer: "B",
      explanation: "The Structured Interview of Reported Symptoms (SIRS-2, Rogers) is the gold standard structured interview for feigned mental illness, providing definite, probable, indeterminate, or genuine classifications.",
      examOnly: false,
    },
    {
      question: "Specificity is prioritized over sensitivity in PVT cutoffs because:",
      optionA: "Missing malingerers is more costly than falsely labeling genuine patients",
      optionB: "Falsely labeling a genuine patient as malingering is considered more harmful than missing some malingerers",
      optionC: "Sensitivity cannot be measured in neuropsychological contexts",
      optionD: "High sensitivity increases the risk of Type II error",
      correctAnswer: "B",
      explanation: "A false positive (wrongly labeling a genuine patient as malingering) is considered more harmful than a false negative (missing a malingerer). Most PVTs maintain specificity ≥90% even at the cost of lower sensitivity.",
      examOnly: false,
    },
  ];

  // ============================================================
  // EXAM-ONLY QUESTIONS (40)
  // ============================================================
  const examOnlyQuestions = [
    {
      question: "Which of the following is classified as a V-code rather than a mental disorder in DSM-5-TR?",
      optionA: "Factitious Disorder",
      optionB: "Conversion Disorder",
      optionC: "Malingering",
      optionD: "Somatic Symptom Disorder",
      correctAnswer: "C",
      explanation: "Malingering is a DSM-5-TR V-code (a condition that may be a focus of clinical attention), not a mental disorder — because it describes intentional deception for external gain, not a psychiatric condition.",
      examOnly: true,
    },
    {
      question: "What does the Reliable Digit Span (RDS) measure and who developed it?",
      optionA: "Attention span; Wechsler",
      optionB: "Embedded validity index from Digit Span; Greiffenstein, Baker, and Gola (1994)",
      optionC: "Forced-choice recognition; Tombaugh (1996)",
      optionD: "Working memory capacity; Green (2003)",
      correctAnswer: "B",
      explanation: "RDS is an embedded PVT derived from the Wechsler Digit Span subtest, developed by Greiffenstein, Baker, and Gola (1994). It sums the longest correct strings on both trials of Digits Forward and Digits Backward.",
      examOnly: true,
    },
    {
      question: "Which PVT is particularly useful for examinees with low education or who speak Spanish as their primary language?",
      optionA: "Word Memory Test (WMT)",
      optionB: "TOMM",
      optionC: "Coin in the Hand Test",
      optionD: "b Test",
      correctAnswer: "C",
      explanation: "The Coin in the Hand Test requires no verbal skills or literacy — the examinee simply identifies which hand holds a coin. This makes it especially useful for Spanish-speaking populations and very low education individuals.",
      examOnly: true,
    },
    {
      question: "The WMT's unique design allows it to:",
      optionA: "Detect feigned amnesia by separating effort from genuine memory ability",
      optionB: "Identify malingering using below-chance forced-choice responses only",
      optionC: "Assess motor speed as a proxy for cognitive effort",
      optionD: "Generate DSM diagnostic classifications directly",
      correctAnswer: "A",
      explanation: "The WMT separates effort indices (IR, DR, Consistency) from harder memory indices — when effort subtests are failed but harder memory tasks are relatively preserved, it signals feigned rather than genuine amnesia.",
      examOnly: true,
    },
    {
      question: "The Slick Criterion B (neuropsychological evidence) is met by which of the following?",
      optionA: "Only below-chance PVT performance",
      optionB: "Below-chance performance on forced-choice PVT, OR multiple PVT failures",
      optionC: "SVT failure on self-report measures",
      optionD: "Clinical interview demonstrating external incentive",
      correctAnswer: "B",
      explanation: "Criterion B requires neuropsychological test evidence — either below-chance forced-choice PVT performance (definite indicator) or failure on multiple PVTs.",
      examOnly: true,
    },
    {
      question: "Under Slick criteria, 'Probable MND' requires:",
      optionA: "Below-chance PVT + external incentive only",
      optionB: "Evidence from self-report only",
      optionC: "Two or more PVT failures, or one PVT failure plus SVT evidence",
      optionD: "Failure on a single PVT in a forensic context",
      correctAnswer: "C",
      explanation: "Probable MND = 2+ PVT failures OR 1 PVT failure plus SVT evidence (Criterion C). It does NOT reach the 'Definite' threshold, which requires below-chance performance.",
      examOnly: true,
    },
    {
      question: "A patient with a documented mild TBI 3 years ago in active litigation scores 38/50 on TOMM Trial 2, fails RDS, and has elevated MMPI-2-RF RBS. The most appropriate classification is:",
      optionA: "Possible MND",
      optionB: "Probable MND",
      optionC: "Definite MND",
      optionD: "Cannot classify — insufficient information",
      correctAnswer: "B",
      explanation: "Two independent PVT failures (TOMM + RDS) plus SVT evidence (elevated RBS) with external incentive (litigation) meets Probable MND criteria. Below-chance performance would be needed for Definite.",
      examOnly: true,
    },
    {
      question: "Which MMPI-2-RF scale is MOST specific to over-reporting in individuals with known psychiatric diagnoses?",
      optionA: "F-r",
      optionB: "Fp-r",
      optionC: "FBS-r",
      optionD: "L-r",
      correctAnswer: "B",
      explanation: "Fp-r contains items rarely endorsed even by psychiatric inpatients — making it more specific to over-reporting when the examinee has genuine psychopathology (where F-r might be elevated for legitimate reasons).",
      examOnly: true,
    },
    {
      question: "Which MMPI-2-RF scale is MOST appropriate for detecting symptom exaggeration in a personal injury/somatic complaint evaluation?",
      optionA: "Fp-r",
      optionB: "RBS",
      optionC: "FBS-r",
      optionD: "K-r",
      correctAnswer: "C",
      explanation: "FBS-r (Symptom Validity scale) was developed specifically for personal injury evaluations and detects over-reporting of somatic and cognitive complaints.",
      examOnly: true,
    },
    {
      question: "The PAI Malingering Index (MAL) is:",
      optionA: "A single scale measuring negative impression management",
      optionB: "A configural index based on 8 features associated with feigning",
      optionC: "A statistically derived discriminant function",
      optionD: "A symptom-count index similar to SIMS",
      correctAnswer: "B",
      explanation: "The PAI MAL is a configural index — it counts 8 specific profile features (scale elevations, patterns) empirically associated with feigned presentations, rather than being a traditional scale score.",
      examOnly: true,
    },
    {
      question: "The SIMS is best described as:",
      optionA: "A comprehensive feigning assessment battery",
      optionB: "A 75-item self-report screening measure for feigned psychopathology and cognitive impairment",
      optionC: "A structured interview for forensic use",
      optionD: "An embedded index derived from standard memory tests",
      correctAnswer: "B",
      explanation: "SIMS is a 75-item true/false SCREENING measure — useful for flagging possible feigning but not sufficient for diagnosis alone. Total score >14 suggests possible feigning.",
      examOnly: true,
    },
    {
      question: "A positive predictive value is most influenced by:",
      optionA: "The test's cutoff score",
      optionB: "The base rate of malingering in the evaluation context",
      optionC: "The number of trials in the PVT",
      optionD: "The examinee's educational level",
      correctAnswer: "B",
      explanation: "Even a highly accurate PVT produces more false positives than true positives when base rates are low. Base rate is the most critical factor in determining the positive predictive value of any PVT.",
      examOnly: true,
    },
    {
      question: "Which embedded index is MOST validated across clinical populations?",
      optionA: "Finger Tapping Test",
      optionB: "Category Test Bolter Items",
      optionC: "Reliable Digit Span",
      optionD: "Grooved Pegboard",
      correctAnswer: "C",
      explanation: "Reliable Digit Span is described as one of the most validated embedded indices in neuropsychology, with a large and consistent research base across diverse clinical populations.",
      examOnly: true,
    },
    {
      question: "Which population shows non-credible performance rates of 15–50% in neuropsychological evaluations?",
      optionA: "Geriatric patients with dementia",
      optionB: "Pediatric patients with learning disabilities",
      optionC: "Adults seeking ADHD evaluation (especially for accommodations or stimulant access)",
      optionD: "Stroke rehabilitation patients",
      correctAnswer: "C",
      explanation: "Adult ADHD evaluations are a high-risk context — with rates of 15–50% documented, particularly when evaluations involve stimulant prescriptions, extended testing time accommodations, or disability claims.",
      examOnly: true,
    },
    {
      question: "What is the natural course of uncomplicated mild TBI without malingering?",
      answer: "A",
      optionA: "Full recovery typically within days to weeks in the vast majority of cases",
      optionB: "Persistent cognitive deficits over 3–5 years",
      optionC: "Progressive neurodegeneration",
      optionD: "Permanent memory impairment requiring long-term accommodation",
      correctAnswer: "A",
      explanation: "Research consistently shows uncomplicated mTBI resolves within days to weeks. Persisting cognitive complaints years post-injury in litigation contexts warrant careful validity assessment.",
      examOnly: true,
    },
    {
      question: "Why are embedded PVT indicators resistant to coaching?",
      optionA: "They use complex scoring algorithms that examinees cannot learn",
      optionB: "Examinees typically do not recognize embedded indices as validity measures",
      optionC: "They are only administered after dedicated PVTs",
      optionD: "They require clinical judgment rather than fixed cutoffs",
      correctAnswer: "B",
      explanation: "Embedded indices are derived from standard clinical tests — examinees who try to beat well-known PVTs (like the TOMM) do not realize that Digit Span, CVLT recognition trials, and motor tests are also being used as validity indicators.",
      examOnly: true,
    },
    {
      question: "A child being evaluated for educational accommodations has a 10% base rate of non-credible performance in that context. A PVT with 90% sensitivity and 90% specificity is used. What concern does this raise?",
      optionA: "The test is not sensitive enough for this population",
      optionB: "Even with high accuracy, the low base rate means many failures will be false positives",
      optionC: "Pediatric PVTs cannot use adult cutoffs",
      optionD: "No concern — 90% specificity is sufficient for any base rate",
      correctAnswer: "B",
      explanation: "At a 10% base rate, even a 90/90 PVT will have substantial false positives. Multiple PVT failures and convergent evidence remain essential even when individual tests perform well.",
      examOnly: true,
    },
    {
      question: "Which PVT uses a computerized 48-item format with Easy and Hard items based on 5-digit numbers?",
      optionA: "WMT",
      optionB: "TOMM",
      optionC: "Victoria Symptom Validity Test (VSVT)",
      optionD: "Medical Symptom Validity Test (MSVT)",
      correctAnswer: "C",
      explanation: "The VSVT is a computerized 48-item forced-choice test using 5-digit numbers, classified as Easy or Hard based on response latency and accuracy, providing Valid/Questionable/Invalid classifications.",
      examOnly: true,
    },
    {
      question: "The RDS-R (Reliable Digit Span Revised) incorporates which additional Wechsler condition?",
      optionA: "Letter-Number Sequencing",
      optionB: "Arithmetic",
      optionC: "Digit Span Sequencing",
      optionD: "Spatial Span",
      correctAnswer: "C",
      explanation: "The WAIS-IV added Digit Span Sequencing as a third condition. The RDS-R incorporates all three conditions (Forward, Backward, Sequencing) for a more comprehensive embedded validity indicator.",
      examOnly: true,
    },
    {
      question: "What is the E-Score cutoff on the Dot Counting Test indicating non-credible performance?",
      optionA: "≥10",
      optionB: "≥14",
      optionC: "≥17",
      optionD: "≥20",
      correctAnswer: "C",
      explanation: "The DCT E-Score of ≥17 indicates non-credible performance. The E-Score is a composite of grouped-card time, ungrouped-card time, and error count.",
      examOnly: true,
    },
    {
      question: "Which of the following should raise concern for non-credible performance on the Dot Counting Test?",
      optionA: "Fast performance on ungrouped cards with many errors",
      optionB: "Excessive time on grouped (easy-to-estimate) cards",
      optionC: "Slow performance on ungrouped cards requiring actual counting",
      optionD: "Equal time on grouped and ungrouped cards",
      correctAnswer: "B",
      explanation: "Non-credible examinees often spend disproportionate time on grouped cards (which can be quickly estimated) — suggesting deliberate slowing rather than genuine counting difficulty.",
      examOnly: true,
    },
    {
      question: "The Bianchini criteria for MPRD are adapted from the Slick criteria specifically for:",
      optionA: "Feigned PTSD in veteran populations",
      optionB: "Patients with chronic pain complaints in disability evaluations",
      optionC: "Children undergoing academic accommodation evaluations",
      optionD: "Criminal forensic competency evaluations",
      correctAnswer: "B",
      explanation: "Bianchini, Greve, and Glynn (2005) adapted the Slick MND framework specifically for chronic pain populations (Malingered Pain-Related Disability), recognizing that pain patients frequently show non-credible patterns.",
      examOnly: true,
    },
    {
      question: "What TOMM finding alone does NOT require further supporting evidence to classify as malingering?",
      optionA: "Score of 44/50 on Trial 2",
      optionB: "Score of 38/50 on the Retention Trial",
      optionC: "Below-chance performance on Trial 2",
      optionD: "Elevated MMPI-2-RF Fp-r with TOMM score of 43/50",
      correctAnswer: "C",
      explanation: "Below-chance performance on any forced-choice PVT is diagnostic of deliberate feigning by itself — no additional corroborating evidence is needed because chance alone cannot explain it.",
      examOnly: true,
    },
    {
      question: "The Rey 15-Item Test is best described as having:",
      optionA: "High sensitivity and high specificity",
      optionB: "Low sensitivity but adequate specificity",
      optionC: "High sensitivity but low specificity",
      optionD: "Both low sensitivity and low specificity",
      correctAnswer: "B",
      explanation: "The Rey FIT has LOW sensitivity — many malingerers perform well enough to pass. Its specificity is more acceptable, meaning those who fail are often truly non-credible, but it misses many malingerers.",
      examOnly: true,
    },
    {
      question: "In criminal forensic contexts, which type of feigning is particularly common and requires specific assessment?",
      optionA: "Feigned depression",
      optionB: "Feigned amnesia for the offense",
      optionC: "Feigned ADHD",
      optionD: "Feigned somatic complaints",
      correctAnswer: "B",
      explanation: "Feigned amnesia for the offense is particularly common in criminal forensic contexts — defendants may claim no memory of the crime to avoid criminal responsibility, requiring specific assessment strategies.",
      examOnly: true,
    },
    {
      question: "Which clinical population is MOST likely to produce false positives on verbal PVTs such as the TOMM?",
      optionA: "Patients with mild depression",
      optionB: "Patients with chronic pain",
      optionC: "Non-native English speakers",
      optionD: "Patients with high IQ",
      correctAnswer: "C",
      explanation: "Verbal PVTs can produce false positives in non-native English speakers due to language processing demands, not malingering. Nonverbal measures should be preferred when possible for this population.",
      examOnly: true,
    },
    {
      question: "Paul Green developed the WMT and the MSVT. The MSVT differs from the WMT primarily in:",
      optionA: "Using nonverbal stimuli instead of word pairs",
      optionB: "Being a shorter (~10 minute) version for use when time is limited",
      optionC: "Assessing motor performance rather than memory",
      optionD: "Being designed exclusively for forensic contexts",
      correctAnswer: "B",
      explanation: "The MSVT is a shorter version of the WMT using 10 word pairs instead of 20, designed for time-constrained evaluations while maintaining a similar structure and validity indices.",
      examOnly: true,
    },
    {
      question: "Which ethical standard obligates psychologists to maintain PVT test security?",
      optionA: "APA Standard 3.04 (Avoiding Harm)",
      optionB: "APA Ethics Code Standard 9.11 (Maintaining Test Security)",
      optionC: "APA Standard 4.01 (Maintaining Confidentiality)",
      optionD: "APA Standard 2.01 (Boundaries of Competence)",
      correctAnswer: "B",
      explanation: "APA Ethics Code Standard 9.11 specifically obligates psychologists to maintain test security — not disclosing specific items, cutoffs, or methods in ways that could compromise clinical utility.",
      examOnly: true,
    },
    {
      question: "Which forensic measure for feigned mental illness uses 8 primary scales including rare symptoms, symptom combinations, and improbable symptoms?",
      optionA: "SIMS",
      optionB: "M-FAST",
      optionC: "SIRS-2",
      optionD: "IOP-29",
      correctAnswer: "C",
      explanation: "The SIRS-2 (Structured Interview of Reported Symptoms, Rogers) uses 8 primary scales including rare symptoms, improbable/absurd symptoms, symptom combinations, and symptom onset patterns.",
      examOnly: true,
    },
    {
      question: "The Inventory of Problems-29 (IOP-29) primarily generates which output?",
      optionA: "DSM diagnostic classification",
      optionB: "Slick MND classification",
      optionC: "False Disorder probability score",
      optionD: "Sensitivity/specificity matrix",
      correctAnswer: "C",
      explanation: "The IOP-29 (Viglione et al., 2017) produces a False Disorder probability score and is designed to detect feigned cognitive impairment, psychiatric symptoms, and PTSD — increasingly used in forensic contexts.",
      examOnly: true,
    },
    {
      question: "Kyle Brauer Boone is known for contributions to:",
      optionA: "Development of the TOMM",
      optionB: "SIRS-2 development and malingered psychiatric symptoms",
      optionC: "Embedded indices research and Rey 15-Item enhancements",
      optionD: "MMPI-2-RF validity scale development",
      correctAnswer: "C",
      explanation: "Kyle Brauer Boone has conducted extensive research on embedded validity indices and enhancement of the Rey 15-Item Test (adding a recognition trial to improve sensitivity).",
      examOnly: true,
    },
    {
      question: "A neuropsychologist is asked to give testimony stating definitively that a defendant 'is malingering.' What is required to support this opinion?",
      optionA: "A single failed PVT in a forensic context",
      optionB: "Below-chance performance on at least one PVT",
      optionC: "Evidence of invalid performance AND external incentive AND absence of alternative explanations",
      optionD: "Elevated MMPI-2-RF F-r and Fp-r only",
      correctAnswer: "C",
      explanation: "A malingering determination requires all three: invalid test performance, evidence of external incentive for feigning, and ruling out alternative explanations (genuine impairment, psychiatric factors, etc.).",
      examOnly: true,
    },
    {
      question: "When is the TOMM's floor effect design most critical to validity determination?",
      optionA: "When the examinee is young and highly educated",
      optionB: "When the examinee has documented severe cognitive impairment (e.g., dementia) yet still passes",
      optionC: "When base rates of malingering in the context are very low",
      optionD: "When the examinee is being evaluated for ADHD",
      correctAnswer: "B",
      explanation: "The floor effect matters most when a patient with severe impairment (who 'should' fail) still passes — demonstrating that the task is genuinely easy enough that failure cannot be attributed to real cognitive deficits.",
      examOnly: true,
    },
    {
      question: "Which of the following MOST accurately describes a 'response bias'?",
      optionA: "The examinee's tendency to choose option A on multiple-choice questions",
      optionB: "Any systematic tendency to respond inconsistently with genuine ability or true symptom status",
      optionC: "The researcher's bias in scoring subjective tests",
      optionD: "Variability in test scores due to measurement error",
      correctAnswer: "B",
      explanation: "Response bias is a systematic (not random) pattern of responding that is inconsistent with the examinee's genuine ability or actual symptom status — encompassing both positive and negative response biases.",
      examOnly: true,
    },
    {
      question: "The Conners Adult ADHD Rating Scale Infrequency Index (CII) is used in:",
      optionA: "Geriatric dementia evaluations",
      optionB: "Adult ADHD evaluations to detect non-credible symptom reporting",
      optionC: "Forensic criminal competency evaluations",
      optionD: "Pediatric learning disability evaluations",
      correctAnswer: "B",
      explanation: "The CII is an embedded validity index within the Conners Adult ADHD Rating Scale, used to detect infrequent/implausible responding in adult ADHD evaluations — a high-risk context for non-credible performance.",
      examOnly: true,
    },
    {
      question: "In a validity report, which statement is MOST appropriate?",
      optionA: "'The examinee was malingering throughout the evaluation.'",
      optionB: "'The examinee's poor performance was due to laziness and secondary gain.'",
      optionC: "'The examinee's performance on multiple PVTs fell below established cutoffs, indicating non-credible performance.'",
      optionD: "'Testing was invalid and the examinee deliberately sabotaged the evaluation.'",
      correctAnswer: "C",
      explanation: "Best practice requires objective, data-driven language describing what the data show (non-credible performance below cutoffs) without inferring intent. The distinction between descriptive and inferential statements is clinically and ethically essential.",
      examOnly: true,
    },
    {
      question: "What feature of the b Test makes it a PVT?",
      optionA: "It uses below-chance scoring similar to forced-choice PVTs",
      optionB: "The task appears difficult but is actually easy — excessive errors suggest deliberate underperformance",
      optionC: "It is a computerized adaptive test that adjusts difficulty based on responses",
      optionD: "It measures processing speed, which is resistant to malingering",
      correctAnswer: "B",
      explanation: "The b Test appears complex (letter discrimination among distractors) but is actually simple for anyone with basic literacy. Excessive commission or total errors disproportionate to any genuine impairment indicate non-credible performance.",
      examOnly: true,
    },
    {
      question: "The CVLT-II Forced Choice Recognition cutoff for suspicious performance is:",
      optionA: "Below 12/16",
      optionB: "Below 15/16",
      optionC: "Below 13/16",
      optionD: "Below 14/16",
      correctAnswer: "B",
      explanation: "CVLT-II Forced Choice Recognition: performance below 15/16 is suspicious for non-credible performance; below-chance performance on the 16 items is diagnostic of deliberate feigning.",
      examOnly: true,
    },
    {
      question: "Which of the following is a concern specific to validity testing in pediatric populations?",
      optionA: "Children never malinger",
      optionB: "Pediatric base rates of non-credible performance are identical to adult rates",
      optionC: "Adult cutoffs and measures may not be appropriate; developmental consideration is essential",
      optionD: "PVTs are not required in pediatric evaluations per AACN guidelines",
      correctAnswer: "C",
      explanation: "Pediatric validity testing requires specific measures (e.g., Memory Validity Profile, modified TOMM cutoffs) and careful developmental consideration — adult cutoffs and normative data may not apply.",
      examOnly: true,
    },
    {
      question: "Which of the following best explains why using multiple PVTs from different modalities is recommended?",
      optionA: "Multiple PVTs increase sensitivity without affecting specificity",
      optionB: "It prevents fatigue effects from a single long PVT",
      optionC: "It guards against coaching (less-known measures) and provides convergent validity evidence",
      optionD: "Only two PVTs are needed regardless of session length",
      correctAnswer: "C",
      explanation: "Using multiple PVTs — including well-known and less-publicized measures, standalone and embedded — guards against coaching of specific tests and provides independent convergent evidence of invalid performance.",
      examOnly: true,
    },
  ];

  const allQuestions = [...regularQuestions, ...examOnlyQuestions].map((q) => ({
    ...q,
    topicId,
  }));

  const insertedQs = await db.insert(quizQuestionsTable).values(allQuestions).returning();
  console.log(
    `✓ Inserted ${insertedQs.length} quiz questions (${regularQuestions.length} regular + ${examOnlyQuestions.length} exam-only)`
  );

  // ============================================================
  // STUDY GUIDE
  // ============================================================
  const studyGuideContent = `# Validity & Effort Testing in Neuropsychological Assessment — Study Guide

## 1. Why Validity Testing Matters

Neuropsychological test scores are only meaningful if the examinee is giving genuine effort and reporting symptoms accurately. **Both the AACN and NAN have issued position statements declaring validity assessment a required element — not optional — of standard neuropsychological practice.**

### Base Rates of Non-Credible Performance

| Context | Base Rate |
|---|---|
| Forensic/litigation contexts | ~40% |
| Disability evaluations | 15–30% |
| General clinical settings | 5–15% |

---

## 2. Key Terminology

| Term | Definition |
|---|---|
| **PVT** | Performance Validity Test — detects non-credible cognitive performance |
| **SVT** | Symptom Validity Test — detects over-reporting of symptoms on self-report |
| **Malingering** | Intentional symptom production for EXTERNAL incentives (V-code, not a disorder) |
| **Factitious Disorder** | Intentional symptom production for INTERNAL psychological needs (sick role) |
| **Non-credible performance** | Preferred neutral term — describes data without implying intent |
| **Secondary gain** | External benefits from being/appearing ill (financial, legal, avoidance) |
| **Response bias** | Systematic tendency to respond inconsistently with true ability or symptom status |

---

## 3. Theoretical Foundations

### Forced-Choice Paradigm
- Two-alternative forced-choice format
- Random guessing = ~50% correct
- **Below-chance (<50%) = diagnostic of deliberate wrong-answer choosing**
- Most PVTs are designed to be easy (floor effect) — genuine patients pass

### Floor Effect Design
- Bona fide patients with genuine severe impairment (even dementia) score near ceiling
- If a dementia patient passes and a younger examinee fails → genuine impairment cannot explain failure

---

## 4. Slick Criteria for Malingered Neurocognitive Dysfunction (MND)

| Criterion | Description |
|---|---|
| **A** | Substantial external incentive (litigation, disability, criminal charges) |
| **B** | Neuropsychological testing evidence (below-chance PVT OR multiple PVT failures) |
| **C** | Self-report evidence (SVT failures, symptom discrepancies) |
| **D** | Not fully explained by psychiatric, neurological, or developmental factors |

**Classifications:**
- **Definite MND:** Below-chance PVT + Criteria A + D
- **Probable MND:** 2+ PVT failures, OR 1 PVT failure + SVT evidence
- **Possible MND:** Self-report evidence only, or insufficient for higher threshold

---

## 5. Stand-Alone Performance Validity Tests

| Test | Developer | Format | Cutoff |
|---|---|---|---|
| **TOMM** | Tombaugh (1996) | 50 line drawings, forced-choice | Trial 2 ≤44/50; Retention ≤44/50 |
| **WMT** | Green (2003) | Verbal word pairs, computerized | IR/DR/Consistency <82.5% |
| **MSVT** | Green | Shorter WMT (~10 min), 10 word pairs | Same WMT structure |
| **VSVT** | Slick et al. | 48 forced-choice 5-digit numbers | Below-chance = diagnostic |
| **Rey 15-Item (FIT)** | Rey (1941) | 15 items in meaningful pattern | <9 recalled (low sensitivity) |
| **Dot Counting Test** | Rey/Boone | Dot counting, grouped vs. ungrouped | E-Score ≥17 |
| **b Test** | Boone | Circle all 'b' among d/p/q distractors | Excessive errors |
| **Coin in the Hand** | Pallis | 10 trials, identify coin hand | <7/10 |
| **PDRT** | Binder | Forced-choice 5-digit numbers, 3 blocks | Below-chance = diagnostic |

---

## 6. Embedded Performance Validity Indicators

| Indicator | Derived From | Cutoff |
|---|---|---|
| **Reliable Digit Span (RDS)** | Wechsler Digit Span | ≤7 (DF longest both trials + DB longest both trials) |
| **CVLT-II Forced Choice** | CVLT-II | <15/16 suspicious; below-chance diagnostic |
| **RAVLT Recognition** | RAVLT | Various (e.g., <13/15) |
| **Finger Tapping** | Halstead-Reitan | Below cutoffs without motor pathology |
| **Category Test Bolter Items** | Halstead Category Test | Errors on rarely-missed items |

**Advantage:** No extra testing time; resistant to coaching (examinees don't recognize them as validity measures)

---

## 7. Symptom Validity Tests

### MMPI-2-RF / MMPI-3 Validity Scales

| Scale | Detects | Cutoff |
|---|---|---|
| **F-r** | General psychopathology over-reporting (<10% endorse in normative sample) | T ≥100 (≥120 = strong) |
| **Fp-r** | Over-reporting in those with genuine psychopathology (rarely endorsed by inpatients) | T ≥100 |
| **Fs** | Somatic over-reporting (rarely endorsed by medical patients) | T ≥100 |
| **FBS-r** | Somatic/cognitive over-reporting in personal injury (Symptom Validity) | T ≥100 |
| **RBS** | Predicts PVT failure; empirically associated with non-credible cognitive performance | T ≥100 |
| **L-r / K-r** | Underreporting/defensiveness (custody, fitness-for-duty, pre-employment) | Elevation |

### PAI Validity Scales
- **NIM:** Negative Impression Management (over-reporting)
- **PIM:** Positive Impression Management (under-reporting)
- **MAL:** Configural index of 8 feigning-associated features
- **RDF:** Rogers Discriminant Function (statistically derived)

### Other SVTs

| Measure | Format | Key Feature |
|---|---|---|
| **SIMS** | 75-item true/false self-report | Total >14 = possible feigning; screening only |
| **M-FAST** | 25-item structured interview | Forensic/PTSD contexts; VA screening |
| **SIRS-2** | Structured interview (Rogers) | GOLD STANDARD for feigned mental illness |
| **IOP-29** | Self-report | Produces False Disorder probability score |

---

## 8. Interpretation Framework

### Multiple PVT Rule
- **≥2 independent PVT failures:** Strong evidence — results invalid or extremely cautious interpretation
- **1 PVT failure:** Careful consideration; may be false positive — integrate context and other data
- **Below-chance on any PVT:** Diagnostic by itself — no other evidence needed

### Sensitivity vs. Specificity
- **Sensitivity:** Correctly identifies malingerers (true positive rate)
- **Specificity:** Correctly identifies genuine patients (true negative rate)
- **Most PVTs maintain specificity ≥90%** — because falsely labeling a genuine patient is more harmful than missing a malingerer

### Common Confounds (Can Cause PVT Failure WITHOUT Malingering)
1. Genuine severe cognitive impairment (dementia, ID, severe acute TBI)
2. Very low education or literacy
3. English as a second language
4. Cultural factors and unfamiliarity with testing
5. Acute severe psychiatric distress (psychosis, severe depression)
6. (Pain and fatigue should NOT cause PVT failure on well-validated measures)

---

## 9. Special Population Contexts

| Population | Key Features |
|---|---|
| **mTBI/Litigation** | Highest base rate (>40%); uncomplicated mTBI resolves in days–weeks |
| **Adult ADHD** | 15–50% non-credible; driven by stimulant access, accommodations, disability |
| **PTSD/Veterans** | MMPI-2-RF (F-r, Fp-r, FBS-r) and M-FAST validated in VA contexts |
| **Pediatric** | Use age-specific measures (MVP, modified TOMM); developmental considerations essential |
| **Older Adults** | TOMM robust in dementia; Coin in Hand useful for severe impairment |
| **Criminal Forensic** | Feigned amnesia for offense is common; SIRS-2, M-FAST essential |

---

## 10. Ethical Considerations

| Issue | Standard |
|---|---|
| **Test security** | APA 9.11 — do not disclose items/cutoffs/methods to non-psychologists |
| **Informed consent** | Inform examinees validity is assessed; do NOT specify which tests |
| **Reporting language** | Use objective, data-driven language; distinguish descriptive from inferential statements |
| **Malingering opinion** | Requires: invalid performance + external incentive + no alternative explanation |

---

## 11. Key Researchers

| Researcher | Contribution |
|---|---|
| **Tom Tombaugh** | Developed TOMM (1996) |
| **Paul Green** | Developed WMT and MSVT |
| **Daniel Slick** | Lead author, Slick Criteria for MND |
| **Grant Iverson** | mTBI, effort testing, base rates |
| **Richard Rogers** | SIRS/SIRS-2; leading researcher on feigned psychiatric symptoms |
| **Kyle Brauer Boone** | Embedded indices, Rey 15-Item enhancements |
| **Glenn Larrabee** | Foundational forensic neuropsychology and malingering detection |
| **Yossef Ben-Porath** | MMPI-2-RF and MMPI-3 validity scales |
| **Bianchini & Greve** | MPRD criteria for pain populations |

---

## 12. Quick Reference Cutoffs

| Test | Indicator | Non-Credible Cutoff |
|---|---|---|
| TOMM Trial 2 | Correct responses | ≤44/50 |
| TOMM Retention | Correct responses | ≤44/50 |
| WMT IR/DR/Consistency | Percent correct | <82.5% |
| Reliable Digit Span | DF + DB longest | ≤7 |
| CVLT-II Forced Choice | Correct responses | <15/16 |
| Rey 15-Item | Items recalled | <9 (low sensitivity) |
| Dot Counting (E-Score) | Composite | ≥17 |
| Coin in the Hand | Correct trials | <7/10 |
| SIMS Total | Item count | >14 |
| MMPI-2-RF F-r/Fp-r/FBS-r/RBS | T-score | ≥100 (F-r ≥120 = strong) |`;

  const [studyGuide] = await db
    .insert(studyGuidesTable)
    .values({
      topicId,
      title: "Validity & Effort Testing in Neuropsychological Assessment — Study Guide",
      content: studyGuideContent,
    })
    .returning();
  console.log(`✓ Study guide created id=${studyGuide.id}`);

  // ============================================================
  // PRACTICE EXAM
  // ============================================================
  const [practiceExam] = await db
    .insert(practiceExamsTable)
    .values({
      topicId,
      title: "Validity & Effort Testing Practice Exam",
      timeLimit: 90,
      passingScore: 70,
    })
    .returning();
  console.log(`✓ Practice exam created id=${practiceExam.id}`);

  const allQsFromDb = await db
    .select({ id: quizQuestionsTable.id })
    .from(quizQuestionsTable)
    .where(eq(quizQuestionsTable.topicId, topicId));

  const examQRows = allQsFromDb.map((q, i) => ({
    examId: practiceExam.id,
    questionId: q.id,
    questionOrder: i + 1,
  }));

  await db.insert(practiceExamQuestionsTable).values(examQRows);
  console.log(`✓ Linked ${examQRows.length} questions to practice exam`);

  console.log(`\n✅ Validity & Effort Testing (topic ${topicId}) fully seeded!`);
}

addValidityEffortTopic()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
