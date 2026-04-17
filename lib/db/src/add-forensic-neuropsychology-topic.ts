import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  topicsTable, flashcardsTable, quizQuestionsTable,
  studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable,
} from "./schema";

async function seed() {
  console.log("Seeding Forensic Neuropsychology topic...");

  const [topic] = await db.insert(topicsTable).values({
    name: "Forensic Neuropsychology",
    category: "Neuropsychological Assessment",
    description: "Core legal contexts in neuropsychological practice — competency, criminal responsibility, civil litigation, standard of care, testimony roles, ethics, and best-practice standards.",
  }).returning();

  const topicId = topic.id;
  console.log(`✓ Topic id=${topicId}`);

  const flashcards = [
    { question: "What is forensic neuropsychology?", answer: "The application of neuropsychological knowledge and methods to legal questions — evaluating claimants, defendants, or litigants for courts, administrative hearings, or legal proceedings. The forensic neuropsychologist serves the fact-finder (court), not the examinee.", difficulty: "easy" },
    { question: "What is the primary role difference between a forensic and a clinical neuropsychologist?", answer: "A clinical neuropsychologist's primary obligation is to the patient — serving their treatment interests. A forensic neuropsychologist's primary obligation is to the court — providing objective, unbiased information. The examinee is not the client; the retaining attorney or court is.", difficulty: "medium" },
    { question: "What are the four major legal contexts in which neuropsychologists practice?", answer: "1) Criminal — competency to stand trial, criminal responsibility (sanity). 2) Civil — personal injury, workers' compensation, disability. 3) Administrative — Social Security, disability determinations. 4) Family — guardianship, capacity to make decisions, child custody when cognitive issues are relevant.", difficulty: "medium" },
    { question: "What is competency to stand trial?", answer: "A legal determination (not a clinical diagnosis) of whether a defendant, at the time of trial, has: 1) sufficient present ability to consult with counsel with a reasonable degree of rational understanding, and 2) a rational and factual understanding of the proceedings against them. Standard set by Dusky v. United States (1960).", difficulty: "medium" },
    { question: "What is the Dusky standard?", answer: "The constitutional standard from Dusky v. United States (1960) defining competency to stand trial — the defendant must have: a rational and factual understanding of the proceedings, AND sufficient present ability to consult with counsel with a reasonable degree of rational understanding.", difficulty: "hard" },
    { question: "What is criminal responsibility (sanity)?", answer: "A legal determination of whether, at the time of the alleged offense, the defendant had a mental defect or disease that impaired their ability to know the wrongfulness of their act, or to conform their conduct to the law. This is a retrospective question about mental state at the time of the offense — not at trial.", difficulty: "medium" },
    { question: "What is the M'Naghten standard?", answer: "A historical standard for the insanity defense — the defendant did not know the nature and quality of the act, OR did not know that what they were doing was wrong, because of a defect of reason from a disease of the mind. Used in many jurisdictions.", difficulty: "hard" },
    { question: "What is the Model Penal Code (MPC) standard for insanity?", answer: "A defendant is not responsible for criminal conduct if, as a result of mental disease or defect, they lacked substantial capacity to appreciate the criminality (wrongfulness) of their conduct, or to conform their conduct to the requirements of the law. Broader than M'Naghten — includes volitional prong.", difficulty: "hard" },
    { question: "What is civil litigation and the neuropsychologist's role?", answer: "Civil cases involve disputes between parties (not criminal prosecution). Neuropsychologists evaluate claimants for personal injury (e.g., traumatic brain injury claims), workers' compensation, or disability — assessing whether cognitive deficits exist, their etiology, severity, and relationship to alleged injury.", difficulty: "medium" },
    { question: "What is a base rate and why is it critical in forensic neuropsychological reports?", answer: "A base rate is the prevalence of a finding (symptom, score, pattern) in a specific reference population. In forensic contexts, base rates of cognitive complaints, symptom exaggeration, and performance validity test failure in clinical and litigating populations must be cited — to contextualize whether a finding is meaningful versus expected.", difficulty: "hard" },
    { question: "What is the distinction between a treating clinician and a forensic evaluator?", answer: "A treating clinician advocates for the patient's best interests and has an ongoing therapeutic relationship. A forensic evaluator provides objective, third-party opinions to the legal system — no therapeutic alliance, limited confidentiality, explicit disclosure of purpose. These roles should not be combined for the same individual.", difficulty: "medium" },
    { question: "What does 'objectivity' mean in forensic neuropsychological practice?", answer: "The forensic neuropsychologist presents findings, conclusions, and limitations without advocacy for either party. Conclusions follow the data — they are not shaped by who retained the evaluator. Both supporting and refuting evidence for any conclusion is considered and reported.", difficulty: "medium" },
    { question: "What is malingering in forensic contexts?", answer: "The intentional production or gross exaggeration of cognitive, psychological, or physical symptoms for external gain (e.g., financial compensation, avoiding criminal consequences, obtaining disability status). Malingering is a legal/behavioral finding — not a psychiatric diagnosis — and must be supported by a convergence of evidence.", difficulty: "medium" },
    { question: "What is the difference between malingering and poor effort?", answer: "Poor effort (insufficient effort) describes inadequate performance on cognitive tasks that may reflect various causes — malingering, psychiatric symptoms, secondary gain, low motivation, or misunderstanding. Malingering requires intentionality and external incentive. Poor effort is the behavioral observation; malingering is the inference about intent.", difficulty: "hard" },
    { question: "What is a performance validity test (PVT) and its role in forensic evaluation?", answer: "A PVT is a measure designed to detect non-credible cognitive performance — failure indicates that performance does not represent genuine ability. In forensic contexts, PVTs are a mandatory component of comprehensive evaluation because external incentives for symptom exaggeration are common.", difficulty: "medium" },
    { question: "What is symptom validity testing (SVT)?", answer: "Measures that assess whether self-reported symptoms (psychological, pain, cognitive complaints) are consistent with genuine clinical presentations. SVTs include embedded symptom validity indices within personality instruments and standalone measures of symptom endorsement patterns.", difficulty: "medium" },
    { question: "What are the three legs of forensic neuropsychological opinion support?", answer: "1) Scientific literature and evidence-based standards. 2) Test data and observations from the evaluation. 3) Collateral information (records, interviews). All three must be integrated — no single source dominates a forensic conclusion.", difficulty: "hard" },
    { question: "What is collateral information in forensic neuropsychology?", answer: "Information obtained from sources other than the examinee — medical records, academic records, employment records, police reports, depositions, observations from informants, and neuroimaging reports. Collateral information is essential to verify, contextualize, and challenge self-report in forensic settings.", difficulty: "medium" },
    { question: "What is an independent medical examination (IME)?", answer: "An evaluation requested by an insurance company, employer, or defense attorney — not for treatment but to provide an independent assessment of injury, impairment, or disability. The neuropsychologist is retained as an independent evaluator, not a treater. The examinee is not the client.", difficulty: "medium" },
    { question: "What are the ethical obligations of a forensic neuropsychologist regarding test security?", answer: "APA ethics and professional standards prohibit releasing raw test data (protocols, scoring, stimuli) to unqualified individuals. In forensic settings, raw data may be subpoenaed. The neuropsychologist should provide data to other qualified professionals, object to release to unqualified parties, and follow jurisdiction-specific legal procedures.", difficulty: "hard" },
    { question: "What is the difference between fact witness and expert witness testimony?", answer: "A fact witness testifies to what they personally observed or did (e.g., 'I administered this test and obtained these scores'). An expert witness offers opinions and interpretations beyond lay knowledge — permitted to draw conclusions ('In my opinion, this pattern is consistent with...') based on specialized knowledge.", difficulty: "medium" },
    { question: "What does Daubert standard require for expert testimony?", answer: "Under Daubert v. Merrell Dow (1993), expert testimony must be based on: sufficient facts/data, reliable methods, reliable application of methods to the facts — and the method must be tested, peer-reviewed, have known error rates, and be generally accepted. Trial judges act as gatekeepers of admissibility.", difficulty: "hard" },
    { question: "What is general acceptance (Frye standard)?", answer: "Under Frye v. United States (1923), expert opinion is admissible if based on methods generally accepted within the relevant scientific community. Still used in some jurisdictions — more permissive threshold for admissibility than Daubert but less methodology-focused.", difficulty: "hard" },
    { question: "What is neuropsychological capacity evaluation?", answer: "Assessment of whether an individual has the cognitive ability to make specific decisions — medical consent, financial management, sexual consent, testamentary capacity. These are functional, decision-specific determinations — not global competency — and require context-specific analysis of cognitive and volitional components.", difficulty: "medium" },
    { question: "What is testamentary capacity?", answer: "The legal standard for the mental capacity required to make a valid will — the testator must: know they are making a will, know the nature and extent of their property, know the natural objects of their bounty (heirs), and understand the relationship between these elements. A retrospective neuropsychological evaluation may be requested after death.", difficulty: "hard" },
    { question: "What is the role of neuroimaging evidence in forensic neuropsychological cases?", answer: "Neuroimaging provides structural or functional data that may corroborate (or not) reported injury and cognitive findings. Neuropsychologists must interpret imaging in the context of clinical and performance findings — noting that lesions on imaging do not automatically confirm functional impairment, and normal imaging does not rule out injury.", difficulty: "hard" },
    { question: "What are the AACN (American Academy of Clinical Neuropsychology) practice guidelines for forensic evaluation?", answer: "AACN guidelines recommend: clarity about the evaluator's role, disclosure to the examinee of the purpose and limits of confidentiality, use of well-validated tests, inclusion of performance and symptom validity measures, consideration of alternative hypotheses, and maintaining objectivity without advocacy.", difficulty: "hard" },
    { question: "What is a response bias and how does it differ from cognitive impairment?", answer: "A response bias is a systematic distortion in performance that does not reflect genuine ability — can include underperformance (poor effort, exaggeration) or overreport of symptoms. Cognitive impairment reflects actual reduced ability. Forensic evaluations must disentangle response bias from genuine impairment through convergent evidence.", difficulty: "hard" },
    { question: "Why is the base rate of performance validity test failure important in forensic opinion?", answer: "If PVT failure is common even in genuinely injured populations (e.g., severe TBI), failure alone doesn't establish intentional exaggeration. Conversely, if failure rates in a specific forensic population are known to be elevated relative to clinical controls, this informs the probability that any given failure reflects non-credible performance.", difficulty: "hard" },
    { question: "What ethical obligations apply when a neuropsychologist is hired by a retaining attorney?", answer: "The neuropsychologist remains ethically bound to objectivity regardless of who pays the fee. Advocacy for the retaining party's legal position — shaping conclusions to support the attorney's case — violates professional standards. The obligation is to the data and the court, not the retaining party.", difficulty: "medium" },
    { question: "What does 'limits of confidentiality' disclosure mean in forensic evaluation?", answer: "Before beginning a forensic evaluation, the examiner must inform the examinee that the evaluation is not confidential — findings will be shared with the retaining party and potentially the court. This is not a therapeutic relationship, and the examinee should understand there is no privilege protecting information they share.", difficulty: "medium" },
    { question: "What is retrospective competency evaluation?", answer: "Assessment of a person's mental state at a prior point in time — e.g., whether someone had decision-making capacity when they signed a contract, created a will, or committed an alleged crime. These evaluations rely on historical records, collateral reports, and extrapolation from current findings to past functioning.", difficulty: "hard" },
    { question: "What are the three pillars of a credible forensic neuropsychological report?", answer: "1) Scientific grounding — opinions linked to empirical literature with appropriate base rates. 2) Methodological rigor — well-validated tests, multiple convergent measures, validity assessment. 3) Transparency and balance — acknowledging evidence against the favored conclusion, explicitly considering alternative explanations.", difficulty: "hard" },
  ];

  const inserted = await db.insert(flashcardsTable).values(flashcards.map(f => ({ ...f, topicId }))).returning();
  console.log(`✓ ${inserted.length} flashcards`);

  const regular = [
    { question: "What is the primary obligation of a forensic neuropsychologist to the legal system?", optionA: "Advocate for the retaining attorney's client", optionB: "Provide treatment recommendations for the examinee", optionC: "Provide objective, unbiased opinions to the fact-finder (court)", optionD: "Maintain therapeutic neutrality with the examinee", correctAnswer: "C", explanation: "In forensic roles, the neuropsychologist's primary obligation is to the court and the legal fact-finding process — not to the examinee, the retaining attorney, or any party. Objectivity is the foundational ethical requirement.", examOnly: false },
    { question: "The Dusky standard (1960) defines competency to stand trial as requiring:", optionA: "Freedom from all psychiatric symptoms at the time of trial", optionB: "A rational and factual understanding of proceedings AND sufficient ability to consult with counsel", optionC: "Normal cognitive test performance across all domains", optionD: "A neurological diagnosis explaining the behavioral deficits", correctAnswer: "B", explanation: "Dusky sets a two-part constitutional standard: factual understanding of the proceedings AND rational ability to consult with counsel. It is a functional legal standard, not a clinical diagnosis or test score threshold.", examOnly: false },
    { question: "What distinguishes malingering from poor effort?", optionA: "Malingering is a DSM diagnosis; poor effort is not", optionB: "Poor effort is always intentional; malingering may be unintentional", optionC: "Poor effort is the observed behavior; malingering is the inference of intentionality and external motivation", optionD: "They are synonymous and used interchangeably in forensic reports", correctAnswer: "C", explanation: "Poor effort (insufficient effort) is an objective finding — performance fails validity criteria. Malingering adds the inference of intentional production for external gain. Forensic reports must carefully distinguish what is observed from what is inferred.", examOnly: false },
    { question: "Under the Daubert standard, which criterion is required for expert neuropsychological testimony?", optionA: "The expert must have been qualified by the court in a prior case", optionB: "The methodology must be tested, peer-reviewed, have known error rates, and be generally accepted", optionC: "The expert must agree with the retaining attorney's theory", optionD: "The expert must be board-certified in forensic neuropsychology", correctAnswer: "B", explanation: "Daubert (1993) requires the judge to evaluate scientific methodology: whether it can be/has been tested, peer-reviewed, has known/potential error rates, and is generally accepted. The judge acts as gatekeeper of scientific reliability.", examOnly: false },
    { question: "Why must forensic neuropsychological evaluations include performance validity tests (PVTs)?", optionA: "PVTs are required by law in all forensic settings", optionB: "External incentives for symptom exaggeration are common in litigation, requiring systematic assessment of whether performance reflects genuine ability", optionC: "PVTs replace intelligence testing in forensic contexts", optionD: "PVTs are only used when malingering is already suspected", correctAnswer: "B", explanation: "Forensic contexts involve external incentives (financial gain, avoiding punishment) that motivate non-credible performance. PVTs provide systematic, evidence-based assessment of performance validity — they are a mandatory component, not an optional add-on triggered only by suspicion.", examOnly: false },
    { question: "What is testamentary capacity and who makes the legal determination?", optionA: "Whether a person can testify in court — determined by the judge", optionB: "Whether a person had adequate cognitive capacity to make a valid will — determined by the court based on evidence", optionC: "Whether a person is competent to stand trial — determined by the forensic evaluator", optionD: "The ability to understand and waive Miranda rights — determined by law enforcement", correctAnswer: "B", explanation: "Testamentary capacity requires the testator to know they are making a will, know their property, know their heirs, and understand the relationship between these elements. The legal determination is the court's — neuropsychologists provide evidence, not the legal conclusion.", examOnly: false },
    { question: "What is the ethical requirement regarding limits of confidentiality in forensic evaluation?", optionA: "Confidentiality must be maintained — forensic records are privileged", optionB: "The examiner must inform the examinee before the evaluation that findings will be shared with the retaining party and potentially the court", optionC: "Confidentiality limits apply only to information about third parties", optionD: "Disclosure of confidentiality limits is required only when the examinee requests it", correctAnswer: "B", explanation: "Before beginning a forensic evaluation, the examiner must explain the purpose and non-confidential nature of the evaluation. Unlike therapeutic relationships, forensic evaluations have no therapeutic privilege — informed disclosure protects both the examinee and the evaluator.", examOnly: false },
    { question: "What is the role of collateral information in forensic neuropsychological evaluation?", optionA: "Collateral information is inadmissible and not used in reports", optionB: "It is used to verify, contextualize, and challenge self-report — essential for credible forensic conclusions", optionC: "Collateral information replaces test data when the examinee is uncooperative", optionD: "Collateral information is only relevant in criminal cases", correctAnswer: "B", explanation: "Records and informant data (medical, academic, employment, legal) allow the examiner to check consistency of the examinee's self-report and historical cognitive functioning. Forensic conclusions require convergence across multiple sources — tests alone are insufficient.", examOnly: false },
    { question: "What distinguishes a fact witness from an expert witness in court?", optionA: "Fact witnesses receive higher compensation than expert witnesses", optionB: "Expert witnesses observed the events; fact witnesses rely on records only", optionC: "Fact witnesses report what they personally observed; expert witnesses offer opinions and conclusions based on specialized knowledge", optionD: "There is no distinction — both testify about factual matters", correctAnswer: "C", explanation: "A fact witness (e.g., the treating clinician) testifies only to what they personally did or observed. An expert witness may offer opinions — 'In my professional opinion, this pattern is consistent with TBI.' Experts can synthesize data and draw inferences; fact witnesses cannot.", examOnly: false },
    { question: "What does objectivity require of a forensic neuropsychologist?", optionA: "Presenting only findings that support the retaining party's case", optionB: "Presenting all relevant findings — including those that contradict the favored conclusion — without advocacy for either party", optionC: "Achieving perfect neutrality by declining to offer any opinions", optionD: "Matching the opinion of the opposing expert to avoid conflict", correctAnswer: "B", explanation: "Objectivity means the forensic evaluator considers and reports all relevant evidence — supporting and refuting any hypothesis — and follows the data wherever it leads, regardless of who paid the evaluation fee.", examOnly: false },
  ];

  const examOnly = [
    { question: "The M'Naghten standard for criminal responsibility focuses on:", optionA: "Whether the defendant could control their behavior at the time of the offense", optionB: "Whether the defendant did not know the nature of the act or did not know it was wrong due to a mental disease", optionC: "Whether the defendant lacked substantial capacity to appreciate wrongfulness or conform conduct to law", optionD: "Whether the defendant was experiencing psychotic symptoms during the offense", correctAnswer: "B", explanation: "M'Naghten is a cognitive-only standard — knowledge of the nature of the act and knowledge of its wrongfulness. It does not include a volitional prong (ability to control behavior). The MPC standard includes both cognitive and volitional elements.", examOnly: true },
    { question: "The Model Penal Code (MPC) insanity standard differs from M'Naghten by:", optionA: "Requiring full, not substantial, incapacity", optionB: "Adding a volitional prong — the defendant lacked substantial capacity to conform conduct to the requirements of law", optionC: "Applying only to capital cases", optionD: "Removing the cognitive appreciation element", correctAnswer: "B", explanation: "The MPC uses 'appreciate' (deeper understanding) rather than 'know,' and adds the volitional element (conform conduct to law). M'Naghten is purely cognitive. The MPC is considered broader and more clinically aligned.", examOnly: true },
    { question: "What is the primary reason the treating clinician and forensic evaluator roles should NOT be combined?", optionA: "It is illegal in all jurisdictions", optionB: "Conflicting obligations — treating clinicians advocate for the patient; forensic evaluators must be objective and serve the court. Combining roles undermines both", optionC: "Treating clinicians lack the training to write forensic reports", optionD: "Insurance will not reimburse forensic evaluations by treating clinicians", correctAnswer: "B", explanation: "Role conflicts are the core problem. A treating clinician's duty to advocate for their patient compromises the objectivity required in forensic roles. A forensic evaluator's adversarial stance undermines the therapeutic alliance. APA ethics and specialty guidelines explicitly warn against dual-role conflicts.", examOnly: true },
    { question: "A neuropsychologist is retained by a plaintiff's attorney and finds data that does not support the plaintiff's claimed brain injury. The ethical obligation is to:", optionA: "Report only findings that support the retaining party's theory", optionB: "Withdraw from the case without comment", optionC: "Report all findings objectively — including those that contradict the claimed injury — in the forensic report", optionD: "Request additional tests until supportive data is found", correctAnswer: "C", explanation: "Forensic ethical standards require objectivity regardless of who retains the evaluator. The obligation is to the court and the accuracy of the record — not to the retaining attorney's case theory. Selectively reporting supportive findings constitutes advocacy, not forensic evaluation.", examOnly: true },
    { question: "In forensic neuropsychology, base rates are important because:", optionA: "They determine which tests are statistically significant", optionB: "Without knowing the prevalence of a finding (e.g., PVT failure) in the relevant population, the meaning of any individual finding cannot be properly interpreted", optionC: "Base rates replace clinical judgment in forensic opinions", optionD: "They are only relevant in criminal cases, not civil", correctAnswer: "B", explanation: "Base rates anchor the probabilistic interpretation of findings. For example, knowing the rate of PVT failure in genuine TBI patients vs. litigating claimants determines how much inferential weight any single failure carries. Without base rate context, forensic opinions lack scientific grounding.", examOnly: true },
    { question: "What is retrospective competency evaluation and what are its primary limitations?", optionA: "Evaluation of current trial competency — limited by the time required for testing", optionB: "Assessment of mental state or capacity at a prior point in time — limited by reliance on historical records, informants, and extrapolation rather than direct assessment of the relevant time period", optionC: "Evaluation of a deceased person's brain — limited by absence of direct examination", optionD: "Remote testing via videoconference — limited by technical difficulties", correctAnswer: "B", explanation: "Retrospective evaluations (testamentary capacity, competency at time of signing a contract) require inferring past mental state from historical records and collateral information. The evaluator cannot directly assess the person at the relevant time — a fundamental epistemic limitation that must be acknowledged in the opinion.", examOnly: true },
    { question: "Under Daubert, who serves as the gatekeeper for the admissibility of expert neuropsychological testimony?", optionA: "The jury", optionB: "The retaining attorney", optionC: "The judge", optionD: "The opposing expert", correctAnswer: "C", explanation: "Daubert shifted the gatekeeping role to trial judges — who assess whether the scientific methods underlying expert testimony meet admissibility criteria (testability, peer review, error rates, general acceptance) before testimony reaches the jury.", examOnly: true },
    { question: "What is the significance of releasing raw neuropsychological test data in forensic settings?", optionA: "Raw data must always be provided to both attorneys automatically", optionB: "Raw data may be subpoenaed; the neuropsychologist should comply by providing data to other qualified professionals and appropriately object to release to unqualified parties", optionC: "Raw data has no legal significance in civil litigation", optionD: "Raw data is inadmissible in court and must never be disclosed", correctAnswer: "B", explanation: "Test security and data release create tension in forensic settings. Subpoenas may require data production; the ethical obligation is to release to qualified professionals, invoke test security protections when appropriate, and follow jurisdiction-specific legal procedures — not to refuse all disclosure.", examOnly: true },
    { question: "What does the neuropsychologist's role in civil personal injury litigation specifically involve?", optionA: "Determining legal fault for the injury", optionB: "Assessing whether cognitive deficits exist, their severity and nature, and whether they are causally related to the alleged injury — providing data for the court's determination", optionC: "Prescribing rehabilitation and treatment as the primary goal", optionD: "Advising the plaintiff on legal strategy regarding their claim", correctAnswer: "B", explanation: "In civil personal injury cases, the forensic neuropsychologist assesses the presence and severity of cognitive impairment, determines whether the profile is consistent with the claimed mechanism of injury, considers alternative explanations, and provides objective data for legal proceedings — causation is a legal conclusion, not a clinical one.", examOnly: true },
    { question: "Which of the following best illustrates a response bias rather than genuine cognitive impairment?", optionA: "Consistently slow processing speed across all timed tasks", optionB: "Performance significantly below chance on forced-choice recognition tasks designed to be easy for even severely impaired individuals", optionC: "Impaired immediate recall with intact delayed recall across memory measures", optionD: "Elevated error rate on complex visuospatial construction", correctAnswer: "B", explanation: "Below-chance performance on forced-choice paradigms (where random responding would yield 50%) is impossible to explain by genuine cognitive impairment — it requires active avoidance of correct answers, which is itself a cognitively demanding form of response bias.", examOnly: true },
    { question: "What three sources of information must be integrated to support a credible forensic neuropsychological opinion?", optionA: "Test data, attorney consultation, and the examiner's clinical experience alone", optionB: "Scientific literature, test data from the evaluation, and collateral information (records, interviews)", optionC: "Neuroimaging, cognitive test scores, and the examinee's self-report only", optionD: "DSM criteria, ICD codes, and clinical interview", correctAnswer: "B", explanation: "Credible forensic opinions require convergence across the scientific evidence base (what is known about the condition, base rates, test validity), the evaluation data (tests, observations), and collateral information (records, prior history). Relying on any single source is considered insufficient.", examOnly: true },
  ];

  const allQs = [...regular, ...examOnly].map(q => ({ ...q, topicId }));
  const qs = await db.insert(quizQuestionsTable).values(allQs).returning();
  console.log(`✓ ${qs.length} questions (${regular.length} regular + ${examOnly.length} exam-only)`);

  const sgContent = `# Forensic Neuropsychology — Study Guide

## 1. What Is Forensic Neuropsychology?

The application of neuropsychological knowledge and methods to questions arising in legal proceedings. The forensic neuropsychologist serves the **fact-finder (the court)**, not the examinee or the retaining attorney.

**Key role difference:**
| | Clinical | Forensic |
|---|---|---|
| Primary obligation | The patient | The court / fact-finder |
| Goal | Treatment and benefit | Objective, unbiased opinion |
| Confidentiality | Protected (therapeutic) | Limited (disclosed upfront) |
| Advocacy | Patient's best interests | No advocacy |

---

## 2. Major Legal Contexts

| Context | Typical Questions |
|---|---|
| **Criminal** | Competency to stand trial; criminal responsibility (sanity) |
| **Civil** | Personal injury, TBI claims, disability, workers' compensation |
| **Administrative** | Social Security, disability determinations |
| **Family / Probate** | Guardianship, testamentary capacity, decision-making capacity |

---

## 3. Criminal Law Standards

### Competency to Stand Trial — Dusky Standard (1960)
A constitutional standard requiring that a defendant:
1. Have a **rational and factual understanding** of the proceedings against them
2. Have **sufficient present ability to consult with counsel** with a reasonable degree of rational understanding

- This is a **present-state** question — mental state at the time of trial
- It is a **legal determination** — the court decides, not the clinician

### Criminal Responsibility / Sanity — Retrospective Question
Mental state at the **time of the alleged offense**

| Standard | Description |
|---|---|
| **M'Naghten** | Did not know the nature/quality of the act OR did not know it was wrong — cognitive only |
| **Model Penal Code (MPC)** | Lacked substantial capacity to **appreciate** wrongfulness OR **conform conduct** to law — cognitive + volitional |
| **Irresistible Impulse** | Could not control conduct even with knowledge of wrongfulness |
| **Federal (IDRA 1984)** | Severe mental disease/defect resulting in inability to appreciate wrongfulness — cognitive only, high threshold |

---

## 4. Forensic Evaluation Best Practices

### Mandatory Components
- Clear role disclosure and limits of confidentiality before the evaluation begins
- Performance validity tests (PVTs) — systematic, not selective
- Symptom validity measures (SVTs)
- Review of all available collateral records
- Integration of scientific literature and base rates

### Three Pillars of a Credible Forensic Opinion
1. **Scientific grounding** — empirical literature, base rates, established test validity
2. **Methodological rigor** — well-validated measures, convergent data, validity assessment
3. **Transparency and balance** — acknowledging disconfirming evidence, considering alternative hypotheses

---

## 5. Performance and Symptom Validity

| Concept | Definition |
|---|---|
| **Performance validity test (PVT)** | Measure designed to detect non-credible cognitive performance |
| **Symptom validity test (SVT)** | Measure assessing whether self-reported symptoms match genuine clinical presentations |
| **Poor effort** | Insufficient performance — behavioral observation; may have multiple causes |
| **Malingering** | Intentional exaggeration for external gain — inference requiring convergent evidence |
| **Response bias** | Systematic distortion in performance not reflecting genuine ability |

**Base rates matter:** Knowing the prevalence of PVT failure in genuine clinical populations vs. litigating groups determines how much weight to assign any individual failure.

**Below-chance performance:** On forced-choice paradigms, performance significantly below chance (50%) cannot be explained by genuine impairment — requires active avoidance of correct answers.

---

## 6. Role Conflicts and Ethics

### Treating Clinician vs. Forensic Evaluator
These roles **should not be combined** for the same individual because:
- Treating clinicians advocate for patients → compromises objectivity
- Forensic stance undermines therapeutic alliance
- Different confidentiality obligations conflict

### Objectivity
Forensic neuropsychologists are obligated to present **all findings** — including those that contradict the retaining party's theory — without advocacy. The obligation is to the data and the court.

### Test Security and Raw Data
- Raw data may be subpoenaed in forensic cases
- Release to other qualified professionals is appropriate
- Object to release to unqualified parties using appropriate legal channels
- Follow jurisdiction-specific procedures

---

## 7. Expert Testimony

| Concept | Description |
|---|---|
| **Fact witness** | Testifies to personal observations only — no opinions/interpretations |
| **Expert witness** | May offer opinions based on specialized knowledge |
| **Daubert standard** | Judge as gatekeeper — methodology must be testable, peer-reviewed, have known error rates, and be generally accepted |
| **Frye standard** | General acceptance within the scientific community (still used in some jurisdictions) |

---

## 8. Capacity Evaluations

**Key principle:** Capacity is **decision-specific and context-specific** — a person may have capacity for one decision but not another.

| Type | Requirements |
|---|---|
| **Medical consent capacity** | Understand information, appreciate consequences, reason about options, communicate choice |
| **Testamentary capacity** | Know they are making a will, know their property, know their heirs, understand the relationship |
| **Financial capacity** | Understand financial concepts, manage transactions, protect from exploitation |
| **Retrospective capacity** | Inferred from historical records — primary limitation is the inability to directly assess the person at the relevant time |

---

## 9. Civil Litigation and Neuropsychological Injury Claims

The forensic neuropsychologist assesses:
- Presence and severity of cognitive impairment
- Consistency of the cognitive profile with the claimed mechanism of injury
- Alternative explanations (pre-existing conditions, psychiatric factors, effort)
- Prognosis and functional limitations

**Causation is a legal conclusion — not a clinical one.** The neuropsychologist provides data and opinions about consistency and probability; the court determines legal causation.`;

  const [sg] = await db.insert(studyGuidesTable).values({ topicId, title: "Forensic Neuropsychology — Study Guide", content: sgContent }).returning();
  console.log(`✓ Study guide id=${sg.id}`);

  const [exam] = await db.insert(practiceExamsTable).values({ topicId, title: "Forensic Neuropsychology Practice Exam", timeLimit: 90, passingScore: 70 }).returning();
  const allQsFromDb = await db.select({ id: quizQuestionsTable.id }).from(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, topicId));
  await db.insert(practiceExamQuestionsTable).values(allQsFromDb.map((q, i) => ({ examId: exam.id, questionId: q.id, questionOrder: i + 1 })));
  console.log(`✓ Practice exam linked to ${allQsFromDb.length} questions`);

  console.log(`\n✅ Forensic Neuropsychology (topic ${topicId}) fully seeded!`);
}

seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
