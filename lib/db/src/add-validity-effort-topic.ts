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
        "Core frameworks for performance validity and symptom validity in neuropsychological assessment — including clinical reasoning, classification criteria, base rates, interpretation principles, confounds, special populations, and ethical obligations.",
    })
    .returning();

  const topicId = topic.id;
  console.log(`✓ Created topic id=${topicId}`);

  // ============================================================
  // FLASHCARDS (58)
  // ============================================================
  const flashcards = [
    // Foundational Principles
    {
      question: "Why is validity assessment considered an essential component of neuropsychological evaluation?",
      answer: "Neuropsychological test scores are only meaningful if the examinee is giving genuine effort and reporting symptoms accurately. Without valid data, even sophisticated test batteries yield interpretations that are meaningless or actively harmful.",
      difficulty: "easy",
    },
    {
      question: "What is a Performance Validity Test (PVT)?",
      answer: "A test or embedded index designed to detect invalid or non-credible cognitive performance — assessing whether an examinee is genuinely exerting effort on cognitive tasks. Performance validity addresses the cognitive effort domain.",
      difficulty: "easy",
    },
    {
      question: "What is a Symptom Validity Test (SVT)?",
      answer: "A test or scale designed to detect over-reporting, exaggeration, or fabrication of symptoms on self-report measures. SVTs assess the credibility of reported symptoms (e.g., pain, depression, PTSD, cognitive complaints).",
      difficulty: "easy",
    },
    {
      question: "How do performance validity and symptom validity differ?",
      answer: "Performance validity (PVT) addresses non-credible COGNITIVE performance — whether the examinee is genuinely trying on cognitive tests. Symptom validity (SVT) addresses non-credible SYMPTOM REPORTING — whether the examinee is accurately describing their symptoms on self-report.",
      difficulty: "medium",
    },
    {
      question: "What is the DSM-5-TR definition of malingering?",
      answer: "The intentional production of false or grossly exaggerated physical or psychological symptoms motivated by external incentives (e.g., financial compensation, avoiding military duty, evading criminal prosecution, obtaining drugs). It is a V-code, NOT a mental disorder.",
      difficulty: "medium",
    },
    {
      question: "How does malingering differ from factitious disorder?",
      answer: "Malingering: intentional symptom production for EXTERNAL incentives (money, legal advantage, drug access). Factitious disorder: intentional symptom production for INTERNAL psychological needs (assuming the sick role) with no identifiable external gain.",
      difficulty: "medium",
    },
    {
      question: "Why is 'non-credible performance' the preferred clinical term over 'malingering'?",
      answer: "Non-credible performance is a neutral, data-driven descriptor — it describes what the test data show without requiring inference about the examinee's intent or motivation. 'Malingering' implies deliberate deception, which requires additional evidence beyond test results alone.",
      difficulty: "medium",
    },
    {
      question: "What is secondary gain?",
      answer: "External benefits derived from being or appearing ill — such as financial compensation, disability status, avoidance of legal consequences, or avoidance of responsibilities. Often associated with malingering but can also occur in genuine illness.",
      difficulty: "easy",
    },
    {
      question: "What is response bias?",
      answer: "Any systematic tendency to respond to test items in a manner inconsistent with genuine ability or true symptom status. Includes both negative response bias (underperforming) and positive response bias (underreporting).",
      difficulty: "medium",
    },
    {
      question: "What is the distinction between 'effort testing' and 'performance validity testing'?",
      answer: "'Effort testing' is an older term largely synonymous with performance validity testing. Current terminology favors 'performance validity' because invalid performance can result from multiple factors (poor effort, symptom exaggeration, response bias) — not just effort alone.",
      difficulty: "medium",
    },
    // Base Rates
    {
      question: "What are the approximate base rates of non-credible performance across clinical contexts?",
      answer: "~40% in forensic/litigation contexts, 15–30% in disability evaluations, and 5–15% in general clinical settings. These substantial rates make validity assessment essential across all neuropsychological evaluations.",
      difficulty: "medium",
    },
    {
      question: "Why does the base rate of malingering in a given context matter so much for PVT interpretation?",
      answer: "Even a highly accurate PVT produces more false positives than true positives when the base rate is low. In a 5% base-rate setting, a test with 90% sensitivity and specificity still yields many false positives — making multiple convergent failures essential before strong conclusions are drawn.",
      difficulty: "hard",
    },
    {
      question: "Which clinical context has the highest documented base rate of non-credible performance?",
      answer: "Forensic/litigation contexts — particularly mild traumatic brain injury (mTBI) evaluations with pending compensation claims — with rates exceeding 40%.",
      difficulty: "medium",
    },
    {
      question: "What professional bodies have declared validity assessment a required component of neuropsychological evaluation?",
      answer: "The American Academy of Clinical Neuropsychology (AACN) and the National Academy of Neuropsychology (NAN) have both issued consensus position statements declaring that validity assessment is a required — not optional — element of standard neuropsychological practice.",
      difficulty: "medium",
    },
    // Forced-Choice Paradigm
    {
      question: "What is the forced-choice paradigm used in performance validity testing?",
      answer: "A two-alternative forced-choice recognition format where the examinee is shown target stimuli and then asked to identify which of two options was presented. By chance alone, random guessing should yield approximately 50% correct.",
      difficulty: "medium",
    },
    {
      question: "Why is below-chance performance on a forced-choice PVT considered diagnostic of deliberate feigning?",
      answer: "Scoring significantly below 50% on a two-alternative forced-choice task is statistically impossible without knowing the correct answers and deliberately choosing the wrong ones. Random guessing would produce approximately 50%, not less.",
      difficulty: "medium",
    },
    {
      question: "What does below-chance performance require from the examinee neuropsychologically?",
      answer: "The examinee must correctly RECOGNIZE the target and then deliberately SELECT the distractor instead. This requires intact recognition memory — revealing that the examinee can perform the task but is choosing not to.",
      difficulty: "hard",
    },
    {
      question: "What does 'above-chance but below cutoff' performance on a forced-choice PVT indicate?",
      answer: "Even when performance is better than chance (above 50%), if it falls below established normative cutoffs derived from clinical populations with genuine impairment, it still indicates non-credible performance.",
      difficulty: "hard",
    },
    // Floor Effect
    {
      question: "What is the floor effect design in performance validity testing?",
      answer: "Well-designed PVTs are easy enough that even patients with genuine moderate-to-severe cognitive impairment (including dementia) consistently perform near the ceiling. If such patients routinely pass, then failure by less-impaired examinees cannot be attributed to genuine cognitive deficits.",
      difficulty: "medium",
    },
    {
      question: "Why is the floor effect design central to PVT validity?",
      answer: "If a patient with documented severe dementia can pass a task, a younger, educated examinee who fails that same task cannot plausibly attribute the failure to genuine cognitive impairment — the clinical comparison group removes that alternative explanation.",
      difficulty: "medium",
    },
    {
      question: "What type of items are typically used to create the floor effect in PVTs?",
      answer: "Tasks that appear difficult but are actually simple — leveraging pattern redundancy, familiarity, or recognition formats that require minimal cognitive capacity. The appearance of difficulty discourages gaming while the actual task is easy for genuine patients.",
      difficulty: "hard",
    },
    // Slick Criteria
    {
      question: "What are the four criteria of the Slick criteria for Malingered Neurocognitive Dysfunction (MND)?",
      answer: "Criterion A: Substantial external incentive present. Criterion B: Evidence from neuropsychological testing (PVT failure). Criterion C: Evidence from self-report (SVT failure or symptom discrepancies). Criterion D: Behaviors not fully explained by psychiatric, neurological, or developmental factors.",
      difficulty: "hard",
    },
    {
      question: "What distinguishes 'Definite MND' from 'Probable MND' under the Slick criteria?",
      answer: "Definite MND requires BELOW-CHANCE performance on a forced-choice PVT plus Criterion A (external incentive) and Criterion D (no alternative explanation). Probable MND requires two or more PVT failures OR one PVT failure plus SVT evidence — without requiring below-chance performance.",
      difficulty: "hard",
    },
    {
      question: "What is 'Possible MND' under the Slick criteria?",
      answer: "Possible MND is supported by evidence from self-report only (SVT failures, symptom discrepancies) without neuropsychological testing evidence, or when evidence is present but insufficient to meet the Probable threshold.",
      difficulty: "hard",
    },
    {
      question: "What is Criterion D in the Slick criteria and why is it essential?",
      answer: "Criterion D requires that the non-credible behaviors are NOT fully accounted for by psychiatric, neurological, or developmental factors. It prevents mislabeling genuine clinical conditions — alternative explanations must be considered and ruled out.",
      difficulty: "hard",
    },
    {
      question: "How was the Slick criteria updated in the 2020 revision?",
      answer: "The 2020 revision by Sherman, Slick, and Iverson introduced updated terminology, refined the classifications, and better accounted for evidence from embedded validity indicators alongside standalone PVTs.",
      difficulty: "hard",
    },
    {
      question: "What is the Bianchini criteria for Malingered Pain-Related Disability (MPRD)?",
      answer: "Adapted from the Slick MND framework specifically for chronic pain populations. It requires evidence of: external incentive (Criterion A), evidence from physical evaluation (B), evidence from cognitive testing (C), and evidence from self-report (D) — recognizing that pain patients undergoing disability evaluation show substantial rates of non-credible performance.",
      difficulty: "hard",
    },
    // Types of Validity Indicators
    {
      question: "What are the two main categories of performance validity indicators?",
      answer: "1) Standalone PVTs: dedicated tests designed specifically to detect non-credible performance. 2) Embedded indicators: validity indices derived from standard neuropsychological tests, yielding validity data without additional testing time.",
      difficulty: "easy",
    },
    {
      question: "What is the primary advantage of embedded PVT indicators over standalone PVTs?",
      answer: "Embedded indicators require no additional testing time and are resistant to coaching — examinees who attempt to beat well-known standalone PVTs typically do not recognize that standard cognitive tests are simultaneously functioning as validity measures.",
      difficulty: "medium",
    },
    {
      question: "What is the advantage of standalone PVTs over embedded indicators?",
      answer: "Standalone PVTs are typically more extensively validated with larger normative and clinical samples, have published sensitivity/specificity data for specific populations, and are explicitly designed with forced-choice or floor-effect paradigms.",
      difficulty: "medium",
    },
    {
      question: "What is a below-chance paradigm versus a cutoff-based paradigm in PVT interpretation?",
      answer: "Below-chance: performance below 50% on forced-choice tasks is diagnostic of deliberate feigning regardless of other data. Cutoff-based: performance that is above chance but still falls below established normative thresholds from clinical populations with genuine impairment.",
      difficulty: "hard",
    },
    // SVT Concepts
    {
      question: "What are the major categories of symptom over-reporting that SVTs are designed to detect?",
      answer: "1) General psychopathology over-reporting (endorsing rare psychological symptoms), 2) Somatic/cognitive complaint over-reporting (amplifying physical symptoms), 3) Psychiatric symptom fabrication (feigning specific disorders like psychosis or PTSD), 4) Cognitive complaint exaggeration (overstating memory/attention problems).",
      difficulty: "medium",
    },
    {
      question: "What is the difference between over-reporting and underreporting on SVTs?",
      answer: "Over-reporting (negative impression management): exaggerating or fabricating symptoms — common in disability, litigation, and forensic contexts. Underreporting (positive impression management): minimizing or denying problems — common in custody evaluations, pre-employment, and fitness-for-duty contexts.",
      difficulty: "medium",
    },
    {
      question: "What are the main SVT formats used in clinical practice?",
      answer: "1) Self-report rating scales (embedded in personality/symptom inventories), 2) Dedicated self-report symptom validity questionnaires, 3) Structured clinical interviews for feigned mental illness.",
      difficulty: "medium",
    },
    {
      question: "Why should SVT results never be used in isolation to conclude malingering?",
      answer: "SVT results can reflect genuine psychological distress, cultural response styles, or poor comprehension — not just intentional exaggeration. Convergent evidence from multiple sources (PVTs, behavioral observations, record review, clinical interview) is always required.",
      difficulty: "medium",
    },
    // Interpretation Principles
    {
      question: "What is the AACN minimum recommended standard for PVT administration?",
      answer: "At least one PVT per hour of testing, with a minimum of two independent PVTs in any comprehensive neuropsychological evaluation. This ensures adequate detection coverage and reduces reliance on any single test.",
      difficulty: "medium",
    },
    {
      question: "What does failure on two or more independent PVTs indicate?",
      answer: "Two or more independent PVT failures provide strong evidence of non-credible performance. Overall test results should be considered invalid or interpreted with extreme caution — neuropsychological conclusions cannot be reliably drawn from the cognitive data.",
      difficulty: "medium",
    },
    {
      question: "Why are multiple independent PVT failures required for strong conclusions rather than a single failure?",
      answer: "A single PVT failure has meaningful false positive risk, especially in lower-base-rate settings. Multiple independent failures converge to dramatically increase confidence that performance is non-credible, because the probability of multiple chance false positives drops sharply.",
      difficulty: "hard",
    },
    {
      question: "What is sensitivity in the context of PVT interpretation?",
      answer: "Sensitivity is the proportion of truly non-credible examinees correctly identified by the PVT (true positive rate). High sensitivity means few non-credible examinees are missed (low false negatives).",
      difficulty: "medium",
    },
    {
      question: "What is specificity in the context of PVT interpretation?",
      answer: "Specificity is the proportion of truly credible examinees correctly identified as performing genuinely (true negative rate). High specificity means few genuine patients are falsely labeled as non-credible (low false positives).",
      difficulty: "medium",
    },
    {
      question: "Why is specificity prioritized over sensitivity in PVT cutoff selection?",
      answer: "The cost of a false positive (falsely labeling a genuine patient as malingering) is considered greater than the cost of a false negative (missing a malingerer). Most PVT cutoffs are set to maintain specificity ≥90% — protecting genuine patients even at the cost of reduced sensitivity.",
      difficulty: "hard",
    },
    {
      question: "What is positive predictive value (PPV) and why does it matter in validity assessment?",
      answer: "PPV is the probability that a failed PVT reflects true non-credible performance rather than a false positive. PPV is directly determined by the base rate — the same PVT produces much higher PPV in a 40% base-rate forensic setting than in a 5% base-rate outpatient clinic.",
      difficulty: "hard",
    },
    // Confounds
    {
      question: "What genuine clinical conditions can legitimately cause PVT failure without malingering?",
      answer: "Genuine severe cognitive impairment (advanced dementia, intellectual disability, severe acute brain injury), very low education or literacy, English as a second language (for verbal PVTs), acute severe psychiatric distress (florid psychosis, severe depression with cognitive impairment), and significant medication sedation.",
      difficulty: "hard",
    },
    {
      question: "Why do pain and fatigue rarely cause PVT failure on well-designed measures?",
      answer: "Well-designed PVTs use floor-effect paradigms that are simple enough to complete even with significant pain or fatigue. PVT failure requires performance below thresholds established from genuinely impaired populations — pain and fatigue do not impair performance to that degree.",
      difficulty: "hard",
    },
    {
      question: "How can coaching threaten the validity of PVT administration?",
      answer: "Coaching by attorneys, internet resources, or other sources can enable feigning examinees to pass well-known PVTs by educating them on what to expect and how to score above cutoffs while still underperforming on genuine cognitive tests. This is why using multiple measures — including embedded indicators and less-publicized tests — is essential.",
      difficulty: "medium",
    },
    {
      question: "What behavioral indicators during testing may suggest non-credible performance beyond formal PVT scores?",
      answer: "Inconsistency between test performance and observed functional capacity, better performance on harder items than easier items, disproportionate errors relative to neurological findings, unusually slow response times on simple tasks, and qualitatively unusual error patterns.",
      difficulty: "hard",
    },
    {
      question: "What is 'symptom exaggeration' versus 'fabrication' in symptom validity?",
      answer: "Exaggeration: genuine symptoms are present but their severity, frequency, or impact is grossly overstated. Fabrication: symptoms are entirely invented with no genuine clinical basis. Both represent invalid self-report but differ in the degree of underlying genuine pathology.",
      difficulty: "medium",
    },
    // Special Populations
    {
      question: "Why is mTBI with pending litigation the highest-risk context for non-credible performance?",
      answer: "External incentives for claiming persistent symptoms (financial compensation, disability benefits) are strong, and research consistently shows the natural course of uncomplicated mTBI is full recovery within days to weeks — making persisting cognitive claims years post-injury implausible without alternative explanation.",
      difficulty: "medium",
    },
    {
      question: "Why are adult ADHD evaluations a high-risk context for non-credible symptom reporting?",
      answer: "External incentives include stimulant medication access, academic accommodations (extended test time on high-stakes exams like bar/board exams), and disability benefits. Research documents non-credible performance rates of 15–50% in these evaluations.",
      difficulty: "medium",
    },
    {
      question: "What special validity considerations apply in pediatric neuropsychological evaluations?",
      answer: "Base rates of non-credible performance in children are lower than in adults but not negligible. Age-appropriate measures with developmental norms must be used; adult cutoffs and adult-normed PVTs are not appropriate for children.",
      difficulty: "medium",
    },
    {
      question: "What validity challenges are unique to geriatric/dementia evaluations?",
      answer: "Genuine severe cognitive impairment can cause failure on some PVTs even without malingering — particularly at advanced dementia stages. Clinicians must use PVTs validated specifically in dementia populations and account for the possibility that non-credible cutoffs may be too sensitive in this group.",
      difficulty: "hard",
    },
    {
      question: "What validity considerations are important in criminal forensic contexts?",
      answer: "External incentives are very high (competency restoration, criminal responsibility, capital sentencing). Feigned amnesia for the offense is particularly common. Structured forensic interviews for feigned mental illness are essential alongside PVTs.",
      difficulty: "medium",
    },
    {
      question: "Why might non-native English speakers have elevated false positive rates on some PVTs?",
      answer: "Verbal PVTs place linguistic demands that may impair genuine performance in non-native speakers — not because of malingering but due to language processing difficulty. Nonverbal or language-free PVTs should be preferred when possible.",
      difficulty: "medium",
    },
    // Ethical Considerations
    {
      question: "What does test security require of neuropsychologists regarding PVT items and cutoffs?",
      answer: "Professional ethics codes obligate neuropsychologists to protect PVT item content, specific cutoffs, and methods from disclosure to non-psychologists (including attorneys, examinees, and the public). Disclosure compromises clinical utility and allows coaching.",
      difficulty: "medium",
    },
    {
      question: "What should neuropsychologists disclose about validity testing during informed consent?",
      answer: "Examinees should be informed that validity measures will be included — that effort and truthfulness are being assessed. Most neuropsychologists do NOT specify which tests are validity measures but DO make clear that performance credibility is being evaluated.",
      difficulty: "medium",
    },
    {
      question: "What is the obligation to assess validity in forensic contexts?",
      answer: "Failure to assess performance and symptom validity in forensic contexts may itself constitute substandard practice. Professional consensus statements from major neuropsychology organizations declare validity assessment a required — not discretionary — component of evaluation.",
      difficulty: "medium",
    },
    {
      question: "What must be established to support a clinical opinion of malingering (as opposed to non-credible performance)?",
      answer: "Three elements must converge: 1) Evidence of invalid performance on PVTs/SVTs, AND 2) Clear external incentive for feigning, AND 3) Ruling out alternative explanations (genuine impairment, psychiatric disturbance, developmental factors). All three are required — invalid performance alone is insufficient.",
      difficulty: "hard",
    },
    {
      question: "What is the distinction between descriptive reporting and inferential diagnostic reporting of validity findings?",
      answer: "Descriptive: 'Performance on multiple validity measures fell below established credibility thresholds.' Inferential: 'The examinee was malingering.' Descriptive statements are supported by test data alone; inferential diagnostic conclusions require additional evidence of intent and external incentive.",
      difficulty: "hard",
    },
    {
      question: "When is it appropriate for a neuropsychologist to offer a malingering opinion on ultimate issue testimony?",
      answer: "Only when all three Slick-framework elements are met: invalid performance, external incentive, and absence of alternative explanations. Many neuropsychologists prefer to describe data (non-credible performance) and leave the ultimate inference about intent to the trier of fact.",
      difficulty: "hard",
    },
    // Clinical Reasoning
    {
      question: "What is the difference between an omnibus validity conclusion and a domain-specific conclusion?",
      answer: "An omnibus conclusion ('overall testing is invalid') applies when multiple PVTs across cognitive domains fail. A domain-specific conclusion ('memory performance is non-credible but attention appears valid') applies when only some domains show PVT failure — requiring nuanced interpretation.",
      difficulty: "hard",
    },
    {
      question: "How should clinical context modify PVT interpretation?",
      answer: "High base-rate contexts (forensic, disability) warrant heightened sensitivity thresholds — more weight to borderline failures. Low base-rate contexts (general clinical) warrant higher specificity thresholds — requiring more convergent evidence before concluding non-credible performance.",
      difficulty: "hard",
    },
    {
      question: "What is the relationship between symptom validity and performance validity data in clinical decision-making?",
      answer: "PVT and SVT data are complementary and should be integrated. PVT failures indicate non-credible cognitive performance; SVT failures indicate non-credible symptom reporting. Convergent failures across both domains strengthen the evidence for broadly non-credible presentation.",
      difficulty: "medium",
    },
    {
      question: "What does a 'non-credible performance' conclusion mean for the neuropsychological report's cognitive findings?",
      answer: "When performance is non-credible, cognitive test results cannot be interpreted as reflecting the examinee's actual neuropsychological functioning. Results should not be used to support diagnostic conclusions about cognitive impairment and must be clearly flagged as invalid in the report.",
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
      question: "Why is 'non-credible performance' preferred over 'malingering' as a clinical descriptor?",
      optionA: "It is a legal term that offers more protection to neuropsychologists",
      optionB: "It is a data-driven term that describes test findings without requiring inference about intent",
      optionC: "It is more accepted by insurance companies for billing purposes",
      optionD: "It avoids the need for formal diagnostic criteria",
      correctAnswer: "B",
      explanation: "'Non-credible performance' is neutral and descriptive — it reflects what the data show without implying that the examinee is deliberately deceiving. Malingering requires additional evidence of intent and external incentive.",
      examOnly: false,
    },
    {
      question: "What is the statistical logic that makes below-chance performance on a forced-choice PVT diagnostic of deliberate feigning?",
      optionA: "Below-chance performance indicates low cognitive reserve",
      optionB: "Random guessing yields ~50% correct; scoring below this requires knowing the right answer and deliberately choosing wrong",
      optionC: "Below-chance performance is statistically equivalent to chance when samples are small",
      optionD: "Below-chance is only valid when the examinee refuses to respond",
      correctAnswer: "B",
      explanation: "A two-alternative forced-choice task produces ~50% accuracy by random guessing. Scoring significantly below 50% is impossible by chance — it requires recognizing the correct answer and deliberately selecting the wrong one.",
      examOnly: false,
    },
    {
      question: "How does malingering differ from factitious disorder?",
      optionA: "Malingering involves internal motivation (sick role); factitious involves external financial gain",
      optionB: "Malingering is a mental disorder; factitious disorder is a V-code",
      optionC: "Malingering is motivated by external incentives; factitious disorder by internal psychological needs",
      optionD: "They are clinically identical — only the legal context differs",
      correctAnswer: "C",
      explanation: "Malingering = external incentives (money, legal advantage). Factitious disorder = internal psychological needs (assuming the sick role) with no identifiable external gain.",
      examOnly: false,
    },
    {
      question: "The floor effect design in PVTs works because:",
      optionA: "PVT tasks are so difficult that only motivated examinees can pass them",
      optionB: "Genuine patients with significant impairment still perform near ceiling, making failure by less-impaired examinees clinically indefensible",
      optionC: "The floor of cognitive ability correlates with motivation",
      optionD: "PVTs measure the minimum cognitive capacity required for daily function",
      correctAnswer: "B",
      explanation: "When patients with dementia or severe TBI consistently pass a task, failure by a younger or less-impaired examinee cannot be attributed to genuine cognitive impairment — the floor effect removes that explanation.",
      examOnly: false,
    },
    {
      question: "What is the minimum AACN standard for PVT administration in a comprehensive evaluation?",
      optionA: "At least one PVT total",
      optionB: "Three PVTs regardless of evaluation length",
      optionC: "At least one PVT per hour of testing, minimum two total",
      optionD: "PVTs are only required in forensic evaluations",
      correctAnswer: "C",
      explanation: "AACN guidelines specify at least one PVT per hour of testing, with a minimum of two independent PVTs in any comprehensive evaluation — ensuring adequate coverage and independent convergent evidence.",
      examOnly: false,
    },
    {
      question: "A neuropsychological evaluation in a 5% base-rate clinical setting yields one failed PVT. The most appropriate response is:",
      optionA: "Conclude definite malingering — the PVT cutoffs are well-validated",
      optionB: "Carefully consider false positive risk; require convergent evidence from additional validity data before concluding non-credible performance",
      optionC: "Discard all cognitive test results immediately",
      optionD: "Report possible malingering to the referring physician",
      correctAnswer: "B",
      explanation: "At a 5% base rate, even a well-validated PVT produces substantial false positives. A single failure requires careful integration with other data — not an immediate conclusion of non-credible performance.",
      examOnly: false,
    },
    {
      question: "Why are embedded validity indicators particularly resistant to coaching?",
      optionA: "They are administered under time pressure that prevents deliberate manipulation",
      optionB: "Examinees typically do not recognize that standard cognitive tests are simultaneously functioning as validity measures",
      optionC: "They use nonverbal formats that cannot be learned",
      optionD: "Their cutoffs are not published in any literature",
      correctAnswer: "B",
      explanation: "Embedded indicators are derived from standard cognitive tests. Examinees who strategically underperform on identified standalone PVTs often do not adjust their behavior on tests they do not recognize as validity measures.",
      examOnly: false,
    },
    {
      question: "What three elements must converge to support a clinical opinion of malingering?",
      optionA: "Two PVT failures, an elevated SVT score, and poor interview cooperation",
      optionB: "Invalid PVT performance, external incentive for feigning, and absence of alternative explanations",
      optionC: "A forensic referral, below-chance performance, and documented injury history",
      optionD: "SVT failure, PVT failure, and psychiatric comorbidity",
      correctAnswer: "B",
      explanation: "Per established criteria (including the Slick framework): all three must be present — evidence of invalid performance, identifiable external incentive, and ruling out alternative explanations such as genuine impairment.",
      examOnly: false,
    },
    {
      question: "Why does specificity take priority over sensitivity in setting PVT cutoffs?",
      optionA: "Missing a malingerer is considered more harmful than falsely identifying one",
      optionB: "Falsely labeling a genuine patient as malingering is considered more harmful than missing some malingerers",
      optionC: "Sensitivity cannot be mathematically calculated for PVTs",
      optionD: "High sensitivity always implies high specificity",
      correctAnswer: "B",
      explanation: "A false positive — wrongly concluding that a genuine patient is malingering — carries serious clinical and ethical consequences. Most established validity measures use cutoffs that protect genuine patients by maintaining specificity ≥90%.",
      examOnly: false,
    },
    {
      question: "Which of the following BEST describes what a neuropsychologist should tell an examinee during informed consent about validity testing?",
      optionA: "Nothing — disclosing validity testing would compromise the assessment",
      optionB: "The names and cutoffs of all validity tests to be used",
      optionC: "That validity measures will be included and that effort and truthfulness are being assessed — without specifying which tests",
      optionD: "That the evaluation includes tests designed to catch people who are lying",
      correctAnswer: "C",
      explanation: "Examinees have the right to informed consent including that validity is being assessed. However, specifying which tests are validity measures could compromise test security and allow examinees to target those tests specifically.",
      examOnly: false,
    },
  ];

  // ============================================================
  // EXAM-ONLY QUESTIONS (40)
  // ============================================================
  const examOnlyQuestions = [
    {
      question: "Criterion D of the Slick criteria for MND requires that:",
      optionA: "The examinee fails at least two dedicated PVTs",
      optionB: "An external incentive for feigning is clearly identifiable",
      optionC: "Non-credible behaviors are NOT fully accounted for by psychiatric, neurological, or developmental factors",
      optionD: "The examinee demonstrates below-chance performance",
      correctAnswer: "C",
      explanation: "Criterion D is the exclusionary criterion — it requires ruling out genuine clinical explanations. Without it, a patient with severe dementia who fails a PVT could be wrongly classified as malingering.",
      examOnly: true,
    },
    {
      question: "Under the Slick criteria, 'Definite MND' requires which specific evidence beyond Criteria A and D?",
      optionA: "Failure on any two PVTs",
      optionB: "Elevated scores on SVT self-report scales",
      optionC: "Below-chance performance on a forced-choice PVT",
      optionD: "Clinical interview evidence of symptom fabrication",
      correctAnswer: "C",
      explanation: "Definite MND requires below-chance performance on a forced-choice PVT — the only evidence level so strong that it is diagnostic by itself, because it demonstrates the examinee recognized the correct answer and deliberately chose wrong.",
      examOnly: true,
    },
    {
      question: "A patient with a litigated mTBI claim fails two independent PVTs but does not show below-chance performance. The appropriate classification is:",
      optionA: "Definite MND — two PVT failures are sufficient for definite classification",
      optionB: "Possible MND — only self-report evidence is present",
      optionC: "Probable MND — two or more PVT failures without below-chance performance",
      optionD: "Cannot classify — below-chance performance is required for any MND classification",
      correctAnswer: "C",
      explanation: "Two or more PVT failures with external incentive (litigation) and no alternative explanation meets Probable MND criteria. Below-chance performance is required for Definite MND, but Probable does not require it.",
      examOnly: true,
    },
    {
      question: "What makes the forced-choice paradigm clinically powerful even when performance is above chance?",
      optionA: "Any performance above 50% indicates genuine effort",
      optionB: "Performance above chance but below clinical cutoffs derived from impaired populations still indicates non-credible performance",
      optionC: "The forced-choice paradigm only provides valid data when below-chance performance occurs",
      optionD: "Above-chance performance rules out coaching",
      correctAnswer: "B",
      explanation: "Cutoffs are established from patients with documented genuine impairment (dementia, TBI). If those patients score higher than the examinee, the examinee's above-chance-but-below-cutoff performance remains non-credible.",
      examOnly: true,
    },
    {
      question: "How does base rate affect the positive predictive value (PPV) of a PVT?",
      optionA: "Higher base rate of malingering → lower PPV of PVT failures",
      optionB: "Base rate has no effect on PPV — only sensitivity and specificity matter",
      optionC: "Higher base rate of malingering → higher PPV — more of the failures are true positives",
      optionD: "PPV is determined only by sensitivity",
      correctAnswer: "C",
      explanation: "PPV is directly proportional to base rate. In a high base-rate forensic setting (~40%), PVT failures are much more likely to be true positives. In a 5% clinic setting, many failures are false positives even with the same test.",
      examOnly: true,
    },
    {
      question: "A neuropsychologist reports: 'The examinee was deliberately malingering based on his PVT scores.' What is problematic about this statement?",
      optionA: "Nothing — PVT failures directly prove malingering",
      optionB: "It uses inferential diagnostic language (malingering/deliberately) without establishing intent and external incentive beyond test scores",
      optionC: "The term 'deliberately' is acceptable but 'malingering' is not",
      optionD: "Neuropsychologists are not permitted to comment on validity in reports",
      correctAnswer: "B",
      explanation: "PVT failures alone support 'non-credible performance' — a data-driven descriptor. 'Deliberately malingering' requires convergent evidence of external incentive and intent, which cannot be inferred from test scores alone.",
      examOnly: true,
    },
    {
      question: "Why must validity data from different sources (PVT, SVT, behavioral observation, records) be integrated rather than used in isolation?",
      optionA: "Each source is equally weighted and must be averaged",
      optionB: "Convergent evidence across independent sources dramatically increases confidence and reduces the impact of false positives from any single measure",
      optionC: "Individual sources are valid only in combination — none has standalone clinical value",
      optionD: "Integration is required only in forensic settings",
      correctAnswer: "B",
      explanation: "No single validity indicator is infallible. Convergent evidence across PVTs, SVTs, behavioral observations, and records review reduces the probability of false positive conclusions and provides a more defensible clinical opinion.",
      examOnly: true,
    },
    {
      question: "Why is performance validity testing required even in non-forensic general clinical evaluations?",
      optionA: "Malingering only occurs in forensic contexts and requires screening there only",
      optionB: "General clinical settings have 5–15% base rates of non-credible performance, which is clinically significant",
      optionC: "Standard cognitive tests already detect non-credible performance without dedicated PVTs",
      optionD: "Clinical evaluations are protected by therapeutic privilege from validity concerns",
      correctAnswer: "B",
      explanation: "Even in general clinical settings, 5–15% of examinees show non-credible performance — not trivial rates. Without validity testing, clinicians risk making diagnostic and treatment decisions based on invalid data.",
      examOnly: true,
    },
    {
      question: "An examinee performs at a level consistent with severe global amnesia on memory tests but passes a forced-choice recognition PVT that patients with documented severe amnesia routinely pass. What does this pattern indicate?",
      optionA: "The memory tests have poor validity",
      optionB: "The examinee has an unusual presentation of genuine amnesia",
      optionC: "Non-credible performance on the memory tests — the floor effect reveals genuine recognition capacity that contradicts the memory performance",
      optionD: "The PVT was likely coached",
      correctAnswer: "C",
      explanation: "The floor effect is diagnostic here — if the examinee can perform the PVT (which genuine severe amnesics pass), their memory test performance cannot reflect genuine severe amnesia. The inconsistency reveals selective underperformance.",
      examOnly: true,
    },
    {
      question: "How does the 'effort testing' label differ conceptually from 'performance validity testing'?",
      optionA: "Effort testing is used only in forensic contexts; performance validity testing is clinical only",
      optionB: "Effort testing implies a unidimensional construct; performance validity acknowledges multiple factors (poor effort, response bias, symptom exaggeration) can produce invalid results",
      optionC: "They are completely synonymous and the distinction is purely semantic",
      optionD: "Effort testing refers to embedded indicators only",
      correctAnswer: "B",
      explanation: "Current preference for 'performance validity' reflects understanding that invalid performance results from multiple phenomena — not just insufficient effort. It is a more accurate and clinically defensible conceptualization.",
      examOnly: true,
    },
    {
      question: "What is the clinical implication when validity testing reveals non-credible performance on cognitive PVTs but self-report SVTs are within normal limits?",
      optionA: "Overall testing is still fully valid since SVTs are normal",
      optionB: "The examinee may be selectively non-credible in performance domains — domain-specific interpretation is required",
      optionC: "PVT findings should be disregarded when SVTs are normal",
      optionD: "Normal SVTs always override abnormal PVT findings",
      correctAnswer: "B",
      explanation: "Selective non-credibility — performing non-credibly on cognitive tasks but credibly on symptom self-report — is clinically meaningful and requires domain-specific interpretation. It does not negate the PVT findings.",
      examOnly: true,
    },
    {
      question: "Under the Bianchini criteria, what population is the MPRD framework specifically designed for?",
      optionA: "Veterans with combat-related PTSD",
      optionB: "Children undergoing school-based disability evaluations",
      optionC: "Patients with chronic pain complaints in disability evaluations",
      optionD: "Criminal defendants claiming insanity",
      correctAnswer: "C",
      explanation: "The MPRD criteria were developed by Bianchini, Greve, and Glynn specifically for chronic pain populations — recognizing that pain patients in disability evaluations show substantial rates of non-credible performance that the general MND framework did not fully address.",
      examOnly: true,
    },
    {
      question: "Why does mTBI with pending litigation have the highest base rate of non-credible performance among common evaluation contexts?",
      optionA: "mTBI causes permanent neurological damage that produces erratic validity patterns",
      optionB: "Uncomplicated mTBI typically resolves within days to weeks, making persisting cognitive claims in litigation implausible; external financial incentives are also high",
      optionC: "mTBI patients are typically poorly educated and misunderstand testing instructions",
      optionD: "mTBI creates paradoxical enhancement of effort on some tests",
      correctAnswer: "B",
      explanation: "Uncomplicated mTBI resolves quickly in most cases. When examinees claim severe cognitive deficits years post-injury in the context of litigation, the combination of implausible symptom persistence and strong financial incentives predicts high base rates of non-credible performance.",
      examOnly: true,
    },
    {
      question: "What does 'symptom exaggeration' mean in validity testing, and how is it different from fabrication?",
      optionA: "Exaggeration is always intentional; fabrication may be unconscious",
      optionB: "Exaggeration amplifies genuine symptoms beyond their actual severity; fabrication invents symptoms with no genuine basis",
      optionC: "Fabrication involves cognitive symptoms only; exaggeration involves physical symptoms only",
      optionD: "They are clinically identical — only the legal definition differs",
      correctAnswer: "B",
      explanation: "Exaggeration = genuine symptoms present but degree amplified. Fabrication = symptoms entirely invented. Both are forms of invalid symptom reporting but differ in whether a genuine clinical condition underlies the presentation.",
      examOnly: true,
    },
    {
      question: "Which validity approach is MOST resistant to coaching by attorneys who inform clients about specific PVT tests?",
      optionA: "Standalone PVTs with well-established cutoffs",
      optionB: "Embedded validity indicators derived from standard cognitive tests",
      optionC: "Self-report SVT questionnaires",
      optionD: "Clinical interview-based validity assessment",
      correctAnswer: "B",
      explanation: "Embedded indicators are the most coaching-resistant because examinees do not recognize them as validity measures. Even if coached on standalone PVTs, they rarely adjust their behavior on standard cognitive tests they do not realize are functioning as validity indicators.",
      examOnly: true,
    },
    {
      question: "In a forensic criminal context, what specific form of feigning is most commonly encountered?",
      optionA: "Feigned cognitive impairment to obtain disability compensation",
      optionB: "Feigned amnesia for the alleged offense to avoid criminal responsibility",
      optionC: "Feigned ADHD to obtain academic accommodations",
      optionD: "Feigned somatic complaints to access prescription medications",
      correctAnswer: "B",
      explanation: "In criminal forensic evaluations, feigned amnesia for the offense is particularly common — defendants may claim no recollection of the alleged crime to reduce criminal responsibility, requiring specific structured assessment.",
      examOnly: true,
    },
    {
      question: "What is the primary ethical obligation regarding PVT item content and scoring cutoffs?",
      optionA: "Cutoffs must be disclosed to examinees during informed consent",
      optionB: "Cutoffs must be reported in full in all written reports",
      optionC: "Item content, cutoffs, and methods must not be disclosed to non-psychologists because exposure enables coaching",
      optionD: "Cutoffs are proprietary information owned by test publishers only",
      correctAnswer: "C",
      explanation: "Professional ethics codes require psychologists to maintain test security. Disclosing PVT items, cutoffs, or administration methods compromises the clinical utility of these measures by enabling feigning examinees to target and evade them.",
      examOnly: true,
    },
    {
      question: "A single PVT failure in a general clinical setting should lead to:",
      optionA: "Immediate conclusion that all results are invalid",
      optionB: "Reporting probable MND without additional evidence",
      optionC: "Careful consideration of false positive risk, integration with behavioral observations and clinical context, and administration of additional validity measures",
      optionD: "Discarding the evaluation and re-testing with different measures",
      correctAnswer: "C",
      explanation: "A single failure in a low base-rate context has meaningful false positive risk. The appropriate response is careful contextual integration and additional validity data collection — not premature diagnostic conclusions.",
      examOnly: true,
    },
    {
      question: "Genuine acute psychiatric distress (e.g., severe psychosis, suicidal depression) differs from malingered psychiatric symptoms in that:",
      optionA: "Genuine psychiatric distress never affects cognitive test performance",
      optionB: "Genuine psychiatric distress typically produces consistent patterns across test modalities; feigned symptoms tend to be inconsistent and exaggerated",
      optionC: "Genuine psychiatric distress always elevates SVT scales",
      optionD: "Feigned psychiatric distress cannot be detected by structured interviews",
      correctAnswer: "B",
      explanation: "Genuine psychiatric disorders produce characteristic patterns that are consistent across multiple measures and contexts. Feigned disorders tend to show inconsistency, atypical combinations, and exaggeration of rare symptoms — patterns detected by validity measures.",
      examOnly: true,
    },
    {
      question: "What is the relationship between positive predictive value (PPV) and specificity when base rates are low?",
      optionA: "Low base rate increases PPV when specificity is high",
      optionB: "Low base rate decreases PPV even when specificity is high",
      optionC: "Specificity has no effect on PPV — base rate alone determines it",
      optionD: "Low base rate and high specificity produce identical PPV to high base rate settings",
      correctAnswer: "B",
      explanation: "When base rates are low, even high-specificity tests generate a substantial proportion of false positives relative to true positives. PPV = (sensitivity × prevalence) / [(sensitivity × prevalence) + (1 - specificity) × (1 - prevalence)].",
      examOnly: true,
    },
    {
      question: "What is 'symptom coaching' and what does research show about its effect on PVT performance?",
      optionA: "Coaching has no effect on PVT performance because PVTs detect physiological markers",
      optionB: "Coaching can help feigning examinees pass well-known PVTs by educating them on what to expect",
      optionC: "Coaching is only effective for SVT scales, not PVTs",
      optionD: "Coaching improves malingerers' ability on embedded indices but not standalone PVTs",
      correctAnswer: "B",
      explanation: "Research demonstrates that coaching — from attorneys, websites, or other sources — can improve malingerers' ability to evade well-known standalone PVTs. This is a major reason for using multiple measures, including embedded indicators that cannot be specifically targeted.",
      examOnly: true,
    },
    {
      question: "A neuropsychologist evaluates an adult seeking ADHD diagnosis for board exam accommodations. What validity considerations are most important?",
      optionA: "No special validity concerns apply in ADHD evaluations",
      optionB: "Only PVTs are needed — SVTs are not relevant in ADHD evaluations",
      optionC: "Both cognitive performance validity and symptom self-report validity must be assessed; non-credible rates of 15–50% are documented in this context",
      optionD: "ADHD evaluations have low base rates of non-credible performance and standard validity assessment applies",
      correctAnswer: "C",
      explanation: "Adult ADHD evaluations are a high-risk context with documented non-credible performance rates of 15–50%. Both PVTs (cognitive validity) and SVTs (symptom credibility) must be assessed given the strong external incentives present.",
      examOnly: true,
    },
    {
      question: "The Slick criteria Criterion B (neuropsychological testing evidence) includes which types of evidence?",
      optionA: "SVT failures and clinical interview evidence only",
      optionB: "Below-chance PVT performance (definite indicator) and/or multiple above-chance PVT failures below cutoff",
      optionC: "Behavioral observation evidence and file review only",
      optionD: "Any single PVT score below the mean",
      correctAnswer: "B",
      explanation: "Criterion B requires evidence from neuropsychological TESTING — either below-chance forced-choice performance (strongest indicator) or multiple PVT failures at established cutoffs. SVT evidence falls under Criterion C.",
      examOnly: true,
    },
    {
      question: "What clinical pattern is most consistent with non-credible cognitive performance versus genuine cognitive impairment?",
      optionA: "Consistent deficits across all cognitive domains proportional to neurological findings",
      optionB: "Better performance on harder subtests than easier subtests of the same measure",
      optionC: "Performance decline across the evaluation session consistent with fatigue",
      optionD: "Errors concentrated on novel problem-solving tasks with preserved rote learning",
      correctAnswer: "B",
      explanation: "Performing better on harder items than easier items on the same test is a classic indicator of non-credible performance — genuine cognitive impairment affects harder items disproportionately, not easier ones.",
      examOnly: true,
    },
    {
      question: "What is the clinical implication of failing two independent PVTs from different cognitive domains?",
      optionA: "Domain-specific impairment is confirmed in those two areas",
      optionB: "The evaluation provides strong evidence of broadly non-credible performance — no cognitive results should be interpreted as reflecting genuine ability",
      optionC: "One failure should be discarded as a false positive",
      optionD: "The examinee should be referred for psychiatric evaluation before further testing",
      correctAnswer: "B",
      explanation: "Multiple independent failures across cognitive domains indicate broad non-credible performance — not domain-specific. When two or more independent PVTs fail, the overall cognitive battery cannot be interpreted as reflecting genuine neuropsychological functioning.",
      examOnly: true,
    },
    {
      question: "Why must neuropsychologists use PVTs specifically validated for the population being assessed?",
      optionA: "All PVTs perform identically across all populations — validation studies are a formality",
      optionB: "Floor effects and cutoffs are established from specific clinical populations; using wrong population norms increases false positive risk",
      optionC: "Validated PVTs have higher sensitivity than non-validated ones in all contexts",
      optionD: "Validation is only required in forensic evaluations",
      correctAnswer: "B",
      explanation: "PVT cutoffs are established from specific clinical reference groups. Using a PVT validated in a TBI population for a dementia evaluation may produce false positives because the dementia-specific floor effect may be lower. Population match is essential.",
      examOnly: true,
    },
    {
      question: "What is the 'consistency' criterion in evaluating performance validity?",
      optionA: "Consistent improvement across test sessions indicates genuine effort",
      optionB: "Internal consistency of the PVT's items with each other",
      optionC: "Consistency of performance across time, test conditions, and modalities — inconsistencies across comparable tasks may signal non-credible performance",
      optionD: "Whether the examinee consistently follows test instructions",
      correctAnswer: "C",
      explanation: "Evaluating consistency across similar tasks and contexts is a key interpretive principle. Genuine impairment is typically consistent across comparable demands; non-credible performance often shows inconsistencies — better on some versions of a task than structurally identical ones.",
      examOnly: true,
    },
    {
      question: "When clinical history, neuroimaging, and behavioral observation are inconsistent with neuropsychological test scores showing severe impairment, this mismatch is:",
      optionA: "Irrelevant — test scores are the gold standard for cognitive status",
      optionB: "A red flag requiring validity assessment even if the referral did not specify forensic concerns",
      optionC: "Explained by regression to the mean on standardized tests",
      optionD: "Evidence of a new neurological syndrome not captured by imaging",
      correctAnswer: "B",
      explanation: "Inconsistency between test scores and the broader clinical picture is a primary indicator for validity assessment. When test scores show far greater impairment than history, imaging, or daily function would predict, non-credible performance must be considered.",
      examOnly: true,
    },
    {
      question: "An examinee reports complete inability to remember anything from one minute to the next but is able to find the testing room independently after a break and correctly recalls the examiner's name. This behavioral observation:",
      optionA: "Is irrelevant to formal validity assessment",
      optionB: "Is consistent with the cognitive test profile and supports genuine amnesia",
      optionC: "Is discrepant with the claimed level of memory impairment and contributes to Slick Criterion C evidence",
      optionD: "Demonstrates intact prospective memory, which is independent of episodic memory",
      correctAnswer: "C",
      explanation: "Behavioral observations that contradict reported symptoms are a form of Slick Criterion C evidence (self-report discrepancy with observed behavior). An examinee who navigates independently and recalls the examiner's name is demonstrating functional memory that contradicts the reported severity.",
      examOnly: true,
    },
    {
      question: "What distinguishes 'Possible MND' from 'Probable MND' under the Slick criteria in terms of evidence type?",
      optionA: "Possible requires below-chance performance; Probable requires only self-report evidence",
      optionB: "Possible is supported by self-report evidence only (SVT failures, behavioral discrepancies) without neuropsychological testing confirmation",
      optionC: "Possible requires only one domain of evidence; Probable requires two or more domains",
      optionD: "Probable MND and Possible MND are identical in evidence requirements",
      correctAnswer: "B",
      explanation: "Possible MND relies on self-report evidence (Criterion C) alone without neuropsychological testing confirmation (Criterion B). Probable MND requires at least neuropsychological testing evidence (Criterion B).",
      examOnly: true,
    },
    {
      question: "In the context of validity testing, what does 'convergent validity evidence' mean?",
      optionA: "PVT and SVT scores correlating with each other",
      optionB: "Multiple independent indicators from different sources all pointing toward non-credible performance",
      optionC: "The correlation between embedded and standalone PVT scores",
      optionD: "Agreement between the neuropsychologist's clinical judgment and objective PVT findings",
      correctAnswer: "B",
      explanation: "Convergent validity evidence means multiple independent data sources — PVTs, SVTs, behavioral observations, collateral history, records — consistently indicating non-credible performance. Convergence greatly strengthens any validity conclusion.",
      examOnly: true,
    },
    {
      question: "Why is neuropsychological validity assessment especially critical when an evaluation will be used to support disability claims?",
      optionA: "Disability evaluations always involve genuine conditions requiring documentation",
      optionB: "External incentives for appearing maximally impaired are substantial; research shows base rates of 15–30% non-credible performance in disability contexts",
      optionC: "Disability evaluations are legally protected and require different standards",
      optionD: "Standard cognitive tests are sufficient to detect disability-related non-credible performance",
      correctAnswer: "B",
      explanation: "Disability contexts create clear financial incentives for appearing maximally impaired, and research documents 15–30% non-credible performance rates. Without systematic validity assessment, disability determinations may be based on invalid data.",
      examOnly: true,
    },
    {
      question: "What is the role of collateral information (records, informant reports) in validity assessment?",
      optionA: "Collateral information is not admissible in formal validity assessment",
      optionB: "It provides independent evidence against which reported symptoms and test performance can be compared for consistency",
      optionC: "It replaces formal validity testing when sufficient records are available",
      optionD: "It is only useful in pediatric evaluations",
      correctAnswer: "B",
      explanation: "Collateral records and informant reports provide an independent baseline. Discrepancies between observed daily function, prior medical records, and current test performance or self-reported symptoms constitute important validity evidence.",
      examOnly: true,
    },
    {
      question: "A neuropsychologist's report states 'test results are invalid due to non-credible performance and should not be used to make diagnostic or treatment decisions.' This statement:",
      optionA: "Is inappropriate — invalid data should still be used with caution",
      optionB: "Is appropriate — when PVT data indicate non-credible performance, cognitive results cannot support clinical conclusions",
      optionC: "Should only appear in forensic reports, not clinical reports",
      optionD: "Must be accompanied by a malingering diagnosis to be actionable",
      correctAnswer: "B",
      explanation: "When performance validity is compromised, cognitive test data cannot be interpreted as reflecting genuine neuropsychological functioning. Clinical and diagnostic conclusions that depend on those scores are not defensible, and this must be clearly communicated in the report.",
      examOnly: true,
    },
    {
      question: "Under what condition is below-chance performance on a forced-choice PVT insufficient to conclude Definite MND?",
      optionA: "When the examinee has a documented neurological condition",
      optionB: "When Criterion D cannot be satisfied — an alternative explanation fully accounts for the performance",
      optionC: "When only one PVT shows below-chance performance",
      optionD: "Below-chance performance always establishes Definite MND regardless of other criteria",
      correctAnswer: "B",
      explanation: "Even below-chance performance cannot support Definite MND if Criterion D is not met — i.e., if the performance IS fully explained by genuine psychiatric, neurological, or developmental factors. All criteria must be satisfied.",
      examOnly: true,
    },
    {
      question: "How should a neuropsychologist handle tension between legal discovery demands for PVT materials and test security obligations?",
      optionA: "Always comply with legal subpoenas fully — legal demands supersede ethical obligations",
      optionB: "Refuse all discovery requests categorically regardless of legal context",
      optionC: "Seek legal guidance and professional support; professional ethics obligations to maintain test security do not automatically yield to discovery demands",
      optionD: "Provide general descriptions of tests used but not their names or cutoffs",
      correctAnswer: "C",
      explanation: "The tension between legal discovery and test security is a real ethical challenge. Neuropsychologists should consult legal counsel, professional organizations, and ethics consultants — professional obligations to maintain test security do not automatically yield to discovery demands.",
      examOnly: true,
    },
    {
      question: "What is the clinical significance of observing that an examinee's performance worsens on items that LOOK harder but are actually equivalent in difficulty?",
      optionA: "It confirms the examinee has genuine difficulty with visual complexity",
      optionB: "It suggests non-credible performance — genuine impairment tracks actual difficulty, not apparent difficulty",
      optionC: "It indicates the test has poor ecological validity",
      optionD: "It is a normal test-taking strategy observed in anxious examinees",
      correctAnswer: "B",
      explanation: "Genuine cognitive impairment tracks actual task demands, not the perceived complexity of test stimuli. When performance drops on items that look harder but are objectively equivalent, it reveals strategic underperformance rather than true cognitive limitation.",
      examOnly: true,
    },
    {
      question: "What is the relationship between symptom validity testing and diagnostic accuracy of self-report measures?",
      optionA: "SVT failures invalidate self-report data, meaning diagnoses based solely on self-report cannot be supported",
      optionB: "SVT failures increase the accuracy of self-report data by identifying exaggerated items",
      optionC: "SVT scales improve the diagnostic sensitivity of self-report measures",
      optionD: "SVT failures are unrelated to diagnostic conclusions from self-report data",
      correctAnswer: "A",
      explanation: "When SVTs indicate non-credible symptom reporting, the self-report data that underlies diagnostic conclusions is invalid. Diagnoses built solely on self-report measures that have failed SVTs are not clinically defensible.",
      examOnly: true,
    },
    {
      question: "What is the clinical significance of failing a PVT on the EASY condition while performing adequately on the harder condition of the same test?",
      optionA: "This is a normal variability pattern seen in genuine cognitive impairment",
      optionB: "This is a strong indicator of non-credible performance — genuine impairment does not selectively impair easier items while sparing harder ones",
      optionC: "This indicates the easy condition has poor reliability",
      optionD: "This suggests processing speed deficits that disproportionately affect easy tasks",
      correctAnswer: "B",
      explanation: "Failing easy items while passing harder ones is the inverse of what genuine cognitive impairment produces. This performance pattern strongly suggests strategic manipulation — the examinee is deliberately avoiding correct responses on 'obvious' easy items.",
      examOnly: true,
    },
    {
      question: "What does 'stand-alone PVT' mean and how does its role differ from an embedded indicator in a battery?",
      optionA: "Standalone PVTs are always superior because they were specifically designed for validity assessment",
      optionB: "Standalone PVTs are dedicated validity tests used alongside cognitive tests; embedded indicators are derived from standard cognitive tests within the battery and function as validity measures without the examinee's awareness",
      optionC: "Standalone PVTs are used in isolation without a full cognitive battery",
      optionD: "Embedded indicators can only be administered by computer, while standalone PVTs use paper formats",
      correctAnswer: "B",
      explanation: "Standalone PVTs are purpose-built validity tests the examinee can identify. Embedded indicators are hidden within standard cognitive tests — their dual role as validity and cognitive measures is unknown to the examinee, making them coaching-resistant.",
      examOnly: true,
    },
    {
      question: "Which combination of evidence BEST satisfies the Slick criteria for Probable MND?",
      optionA: "External incentive alone with clinician suspicion of feigning",
      optionB: "External incentive + two independent PVT failures + behaviors not fully explained by genuine impairment",
      optionC: "SVT elevation alone with pending litigation",
      optionD: "Below-chance PVT performance without external incentive",
      correctAnswer: "B",
      explanation: "Probable MND under Slick requires: Criterion A (external incentive) + Criterion B (two or more PVT failures OR one PVT failure plus SVT evidence) + Criterion D (not explained by genuine factors). This answer satisfies all required criteria.",
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

Neuropsychological test scores are **only meaningful if the examinee is genuinely effortful and reporting symptoms accurately.** Without valid data, even the most sophisticated battery produces interpretations that are meaningless or actively harmful.

**Professional Standard:** Both the American Academy of Clinical Neuropsychology (AACN) and the National Academy of Neuropsychology (NAN) have issued consensus statements declaring validity assessment a **required — not optional — element** of all neuropsychological evaluations.

### Base Rates of Non-Credible Performance

| Clinical Context | Base Rate |
|---|---|
| Forensic/litigation (especially mTBI) | ~40% |
| Disability evaluations | 15–30% |
| General clinical outpatient settings | 5–15% |
| Pediatric evaluations | Lower, but not negligible |

---

## 2. Core Terminology

| Term | Definition |
|---|---|
| **Performance Validity Test (PVT)** | Detects non-credible *cognitive performance* — assesses whether the examinee is genuinely trying on cognitive tasks |
| **Symptom Validity Test (SVT)** | Detects non-credible *symptom reporting* — assesses whether self-reported symptoms are accurate |
| **Malingering** | Intentional symptom production for **external incentives** (financial, legal, drug access) — V-code, NOT a mental disorder |
| **Factitious Disorder** | Intentional symptom production for **internal psychological needs** (sick role) — no external gain |
| **Non-credible performance** | Preferred neutral, data-driven descriptor — describes what test data show without inferring intent |
| **Secondary gain** | External benefits derived from appearing or being ill |
| **Response bias** | Systematic tendency to respond inconsistently with genuine ability or true symptom status |

**Key distinction:** "Non-credible performance" = data-driven description. "Malingering" = inferential clinical conclusion requiring additional evidence.

---

## 3. The Forced-Choice Paradigm

### How It Works
- Two-alternative forced-choice format: "Which of these two items did you see before?"
- **Random guessing = ~50% correct** by probability
- **Below-chance (<50%):** Statistically impossible without knowing the correct answer and deliberately choosing wrong — **diagnostic of deliberate feigning** by itself

### Clinical Significance of Below-Chance Performance
- Requires the examinee to RECOGNIZE the correct item (demonstrating intact memory)
- Then deliberately AVOID selecting it (demonstrating intentional manipulation)
- No further corroborating evidence is needed for strongest validity conclusions

### Above-Chance But Below Cutoff
- Even performance above 50% can indicate non-credible performance when it falls below cutoffs derived from genuinely impaired clinical populations

---

## 4. The Floor Effect Design

Well-designed PVTs are **easy enough that even patients with genuine moderate-to-severe cognitive impairment consistently pass them.**

**The logic:**
- If a patient with documented moderate dementia passes a task → the task is genuinely easy
- If a younger, educated examinee fails that same task → genuine cognitive impairment cannot explain the failure
- The clinical comparison group eliminates alternative explanations

**Design principle:** Tasks *appear* difficult but exploit pattern redundancy, recognition formats, or familiarity — apparent difficulty deters gaming; actual simplicity protects genuine patients.

---

## 5. The Slick Criteria for Malingered Neurocognitive Dysfunction (MND)

The most widely used framework for classifying non-credible cognitive performance.

| Criterion | Content |
|---|---|
| **A** | Substantial external incentive present (litigation, disability, criminal charges) |
| **B** | Neuropsychological testing evidence (below-chance PVT OR multiple PVT failures) |
| **C** | Self-report evidence (SVT failures OR discrepancies between reported symptoms and observed behavior/records) |
| **D** | Non-credible behaviors NOT fully explained by psychiatric, neurological, or developmental factors |

### Classification Levels

| Level | Requirements |
|---|---|
| **Definite MND** | Below-chance PVT + Criterion A + Criterion D |
| **Probable MND** | 2+ PVT failures OR (1 PVT failure + SVT evidence) + Criterion A + Criterion D |
| **Possible MND** | Criterion C evidence only (self-report), without neuropsychological testing confirmation |

**Critical point:** Criterion D must always be satisfied — alternative explanations must be considered and ruled out at every classification level.

---

## 6. Bianchini Criteria for Malingered Pain-Related Disability (MPRD)

Adapted from the Slick framework specifically for **chronic pain populations** in disability evaluations. Follows the same four-criterion structure (external incentive, physical evaluation evidence, cognitive testing evidence, self-report evidence) with recognition that pain patients frequently show non-credible performance.

---

## 7. Types of Validity Indicators

### Standalone PVTs
- Dedicated tests designed specifically to detect non-credible performance
- Advantages: extensively validated, established sensitivity/specificity, large normative databases
- Limitation: identifiable — examinees who are coached may specifically target these

### Embedded Validity Indicators
- Derived from standard neuropsychological tests (cognitive and motor)
- Advantages: no additional testing time; **highly resistant to coaching** (examinees do not recognize them as validity measures)
- Limitation: typically less extensively validated than standalone PVTs

**Best practice:** Use BOTH — standalone PVTs for primary validity assessment plus embedded indicators for convergent evidence resistant to coaching.

### Symptom Validity Scales
- Embedded in personality and symptom rating scales
- Separate scales for: general over-reporting, somatic complaint exaggeration, psychiatric symptom fabrication, predicting cognitive PVT failure, under-reporting/defensiveness
- Available in both questionnaire (self-report) and structured interview formats
- **Gold standard** for feigned mental illness: structured clinical interview formats

---

## 8. Interpretation Framework

### The Multiple PVT Rule

| Evidence Level | Clinical Conclusion |
|---|---|
| **Below-chance on any forced-choice PVT** | Diagnostic of deliberate feigning — no additional evidence needed |
| **2+ independent PVT failures** | Strong evidence — cognitive results invalid or interpreted with extreme caution |
| **1 PVT failure** | Careful consideration required — may be false positive; integrate all available evidence |

### Sensitivity vs. Specificity

| Concept | Definition | Priority |
|---|---|---|
| **Sensitivity** | True positive rate (detects non-credible examinees) | Secondary |
| **Specificity** | True negative rate (protects genuine patients) | **Primary — ≥90% target** |

**Why specificity first:** Falsely labeling a genuine patient as malingering is considered more harmful than missing a malingerer.

### Base Rate and Positive Predictive Value (PPV)

- PPV is directly determined by base rate
- Same PVT: much higher PPV in 40% forensic context vs. 5% clinical context
- **Low base-rate settings require convergent evidence from multiple sources** before any validity conclusion

---

## 9. Common Confounds — PVT Failure Without Malingering

| Confound | Why It Matters |
|---|---|
| Genuine severe cognitive impairment | Advanced dementia or profound ID may legitimately fail some PVTs |
| Very low education/literacy | Some verbal PVT formats may exceed genuine literacy capacity |
| English as a second language | Verbal PVTs may reflect language barriers, not effort |
| Acute severe psychiatric distress | Florid psychosis or severe depression can impair test performance |
| Cultural unfamiliarity with testing | Response styles vary across cultures |

**Rule out all confounds before any validity conclusion.**

---

## 10. Behavioral Indicators of Non-Credible Performance

Beyond formal PVT scores, clinical observation can identify validity concerns:
- Better performance on HARDER subtests than EASIER subtests of the same task
- Performance inconsistent with observed daily functioning
- Disproportionate errors relative to documented neurological findings
- Unusually slow response times on objectively simple tasks
- Symptom report inconsistent with prior medical records or collateral informants
- Discrepancy between reported severity and actual behavioral capacity during evaluation

---

## 11. Special Population Contexts

| Population | Key Validity Considerations |
|---|---|
| **mTBI/Litigation** | Base rate ~40%; uncomplicated mTBI resolves in days–weeks; persisting claims + litigation = high validity concern |
| **Adult ADHD** | Base rate 15–50%; incentives include stimulant access, extended exam time accommodations, disability |
| **PTSD/Veterans** | High external incentives; structured self-report and interview SVTs well-validated in this population |
| **Pediatric** | Base rates lower but present; age-appropriate measures with developmental norms required |
| **Older Adults/Dementia** | Genuine severe impairment may affect some PVTs; use population-specific validated measures |
| **Criminal Forensic** | Feigned amnesia for offense most common; structured forensic interviews essential |

---

## 12. Ethical Obligations

| Obligation | Standard |
|---|---|
| **Validity assessment is required** | AACN/NAN position statements: required component of all evaluations |
| **Test security** | Do not disclose item content, cutoffs, or methods to non-psychologists |
| **Informed consent** | Inform examinees that validity is being assessed; do NOT specify which tests are validity measures |
| **Reporting language** | Use descriptive (data-driven) language; distinguish from inferential (intent-based) language |
| **Malingering opinions** | Require: invalid performance + external incentive + no alternative explanation |

---

## 13. Clinical Decision-Making Framework

### To Conclude Non-Credible Performance (Descriptive)
1. Multiple independent PVT failures OR below-chance performance
2. Behavioral observations consistent with non-credible pattern
3. Confounds adequately ruled out

### To Conclude Probable/Definite MND (Inferential)
1. All of above, PLUS
2. Clear external incentive (Criterion A)
3. Behaviors not explained by genuine clinical factors (Criterion D)

### When Non-Credible Performance Is Established
- Cognitive test results **cannot be used to support diagnostic conclusions** about cognitive impairment
- Report must clearly document the validity findings and their interpretive implications
- Referral for additional evaluation may be appropriate depending on context`;

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
