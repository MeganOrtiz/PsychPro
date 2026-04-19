import { db } from "./index";
import { flashcardsTable, quizQuestionsTable } from "./schema";

const TOPIC_ID = 31;

const FLASHCARDS: Array<{ question: string; answer: string; difficulty: string }> = [
  { question: "What are the two foundational questions to ask of any neuroimaging method?", answer: "(1) Does it show structure or function? (2) What are its spatial and temporal resolutions?", difficulty: "easy" },
  { question: "Define spatial resolution.", answer: "How precisely a method localizes a signal in three-dimensional space.", difficulty: "easy" },
  { question: "Define temporal resolution.", answer: "How quickly a method captures change over time.", difficulty: "easy" },
  { question: "Why is no single imaging modality 'best'?", answer: "Methods that excel in temporal resolution typically sacrifice spatial precision, and vice versa. Choice of modality depends on the clinical question.", difficulty: "medium" },
  { question: "What does an X-ray excel at imaging, and what does it resolve poorly?", answer: "Excellent for hard tissue (bone, calcifications, foreign bodies); poor for soft tissue.", difficulty: "easy" },
  { question: "How does CT differ from plain X-ray?", answer: "CT uses rotating X-ray beams to produce cross-sectional slices that can be reconstructed into 3D images, resolving hard tissue, soft tissue, and blood vessels.", difficulty: "medium" },
  { question: "Why is CT the workhorse of acute neurology?", answer: "It acquires images in seconds, is widely available, tolerates restless patients, and reliably distinguishes fresh blood from brain parenchyma — making it ideal for suspected stroke, trauma, or hemorrhage.", difficulty: "medium" },
  { question: "What does MRI use to generate images, and why is it preferred for parenchymal lesions?", answer: "Powerful magnetic fields and radiofrequency pulses (no ionizing radiation). It offers far higher spatial resolution and unmatched soft-tissue contrast.", difficulty: "medium" },
  { question: "What is the absolute safety constraint of MRI?", answer: "No ferromagnetic metal in or near the scanner — certain pacemakers, cochlear implants, aneurysm clips, or retained metallic foreign bodies may make a patient ineligible.", difficulty: "easy" },
  { question: "What does DTI map, and what makes it possible?", answer: "DTI maps white matter fiber tracts by measuring the diffusion of water molecules, which moves preferentially along the length of myelinated axons.", difficulty: "medium" },
  { question: "What kind of injury can DTI detect that conventional MRI misses?", answer: "Microstructural injury — diffuse axonal injury after head trauma, demyelination, and subtle disconnection syndromes.", difficulty: "hard" },
  { question: "Is DTI structural or functional?", answer: "Structural — but it bridges anatomy and function by providing information about tract integrity.", difficulty: "medium" },
  { question: "What does vascular imaging visualize, and what conditions does it help diagnose?", answer: "The cerebral vasculature directly. It helps diagnose atherosclerotic plaques, arterial stenosis, aneurysms, and arteriovenous malformations.", difficulty: "medium" },
  { question: "What signal does fMRI exploit?", answer: "The BOLD signal — Blood Oxygen Level Dependent contrast — based on differences between oxygenated and deoxygenated hemoglobin in active brain regions.", difficulty: "medium" },
  { question: "Why does fMRI have poor temporal resolution despite good spatial resolution?", answer: "The hemodynamic response unfolds over several seconds, so fMRI cannot follow events on the millisecond timescale of neural firing.", difficulty: "hard" },
  { question: "What does PET measure?", answer: "Metabolism and biochemistry. A radioactive tracer (often a glucose analog) is injected and accumulates in metabolically active tissue.", difficulty: "medium" },
  { question: "What clinical questions is PET uniquely suited to answer?", answer: "Detecting regional metabolic abnormalities — hypometabolism in early Alzheimer's, hypermetabolism in tumors, and tracer-specific imaging of amyloid, tau, or dopamine systems.", difficulty: "hard" },
  { question: "How does SPECT compare to PET?", answer: "SPECT is the less expensive cousin of PET. It uses a longer-lived tracer that distributes by regional cerebral blood flow. Spatial resolution is lower but equipment is more widely available.", difficulty: "medium" },
  { question: "What is EEG's greatest strength and greatest weakness?", answer: "Strength: excellent temporal resolution (millisecond timescale). Weakness: poor spatial resolution because the skull and scalp blur the signal.", difficulty: "easy" },
  { question: "What is EEG's primary clinical role?", answer: "It is the primary diagnostic study for epilepsy.", difficulty: "easy" },
  { question: "How does MEG improve on EEG?", answer: "MEG records magnetic fields rather than electrical signals. Magnetic fields pass through the skull less distorted, giving better spatial resolution while preserving millisecond temporal precision.", difficulty: "medium" },
  { question: "How many sensors does a typical MEG system use, and why does that matter?", answer: "Around 150 sensors arranged around the head, providing whole-head coverage and the ability to localize subcortical activity.", difficulty: "medium" },
  { question: "What is the difference between an evoked potential and an event-related potential (ERP)?", answer: "Evoked potentials measure the brain's response to a simple sensory or motor stimulus. ERPs extend the same logic to cognitive tasks, indexing attention, perception, and decision processes with millisecond precision.", difficulty: "hard" },
  { question: "What is single-unit recording and what is its main limitation?", answer: "An invasive technique that places a microelectrode near a single neuron to record action potentials in real time. Limited to animal research and rare intraoperative or implanted-electrode situations in humans.", difficulty: "medium" },
  { question: "What does EMG measure, and what disorders is it used to evaluate?", answer: "EMG measures the electrical activity of muscle fibers and motor units, used to differentiate muscle disease, neuromuscular junction disorders, and peripheral neuropathies.", difficulty: "medium" },
  { question: "What does transcranial Doppler (TCD) measure?", answer: "Blood flow velocity in major intracranial arteries in real time, useful for bedside continuous monitoring of cerebral hemodynamics.", difficulty: "medium" },
  { question: "Which methods give millisecond-range temporal resolution?", answer: "EEG, MEG, and single-unit recording.", difficulty: "easy" },
  { question: "Which methods are functional but operate on a seconds-to-minutes timescale?", answer: "fMRI, PET, and SPECT.", difficulty: "easy" },
  { question: "List the structural imaging modalities.", answer: "X-ray, CT, MRI, DTI, and vascular imaging.", difficulty: "easy" },
  { question: "List the functional imaging modalities.", answer: "fMRI, PET, SPECT, EEG, MEG, evoked potentials, single-unit recording, and EMG.", difficulty: "easy" },
  { question: "What is ECT and what conditions does it treat?", answer: "Electroconvulsive therapy — a brief electrical current under anesthesia induces a controlled generalized seizure. Treats severe depression, mania, catatonia, and the agitation/aggression of advanced dementia.", difficulty: "medium" },
  { question: "What are the most common adverse effects of ECT?", answer: "Anterograde and retrograde memory disturbance, transient difficulty learning new information, headache, nausea, fatigue, and post-ictal confusion.", difficulty: "medium" },
  { question: "What is TMS and what is its standard cortical target for depression?", answer: "Transcranial magnetic stimulation uses focused magnetic pulses to induce small electrical currents in cortex. The standard target for depression is the dorsolateral prefrontal cortex.", difficulty: "medium" },
  { question: "What conditions is TMS approved to treat?", answer: "Major depressive disorder, obsessive-compulsive disorder, and smoking cessation.", difficulty: "medium" },
  { question: "What is a key limitation of TMS?", answer: "Its reach is limited to superficial cortex — it cannot directly modulate deep brain structures.", difficulty: "hard" },
  { question: "What is DBS, and what conditions is it best established for?", answer: "Deep brain stimulation implants an electrode into a precise deep target connected to a subcutaneous pulse generator. Best established for movement disorders — Parkinson's disease, essential tremor, and dystonia.", difficulty: "medium" },
  { question: "What energy sources are used in modern ablative procedures?", answer: "Heat (radiofrequency or focused ultrasound) and laser energy.", difficulty: "medium" },
  { question: "Why are structural and functional studies typically combined in clinical practice?", answer: "Structural imaging shows anatomy; functional imaging shows activity. Coregistration allows clinicians to read function in its anatomic context, answering different aspects of the same clinical question.", difficulty: "hard" },
  { question: "How does the subtraction design used with PET and ERPs work?", answer: "Two conditions are presented and the response to one is digitally subtracted from the response to the other, isolating the activity uniquely associated with the cognitive process of interest.", difficulty: "hard" },
];

const QUIZZES: Array<{
  question: string; option_a: string; option_b: string; option_c: string; option_d: string;
  correct_answer: string; explanation: string;
}> = [
  {
    question: "Which imaging method offers the best temporal resolution?",
    option_a: "fMRI", option_b: "PET", option_c: "EEG", option_d: "MRI",
    correct_answer: "C",
    explanation: "EEG captures electrical activity on a millisecond timescale. fMRI and PET operate on a seconds-to-minutes timescale; MRI is structural.",
  },
  {
    question: "Which imaging modality is the first-line study in suspected acute stroke or head trauma?",
    option_a: "MRI", option_b: "CT", option_c: "PET", option_d: "fMRI",
    correct_answer: "B",
    explanation: "CT is fast, widely available, tolerates restless patients, and reliably distinguishes fresh blood from brain parenchyma — ideal for acute presentations.",
  },
  {
    question: "fMRI is based on which underlying signal?",
    option_a: "Glucose metabolism", option_b: "Magnetic field changes from neural firing", option_c: "BOLD contrast (oxygenated vs. deoxygenated hemoglobin)", option_d: "Direct measurement of action potentials",
    correct_answer: "C",
    explanation: "fMRI exploits the Blood Oxygen Level Dependent (BOLD) signal — active regions consume oxygen and trigger vasodilation, raising the ratio of oxygenated to deoxygenated hemoglobin.",
  },
  {
    question: "Which modality maps white matter fiber tracts using water diffusion?",
    option_a: "PET", option_b: "DTI", option_c: "SPECT", option_d: "MEG",
    correct_answer: "B",
    explanation: "Diffusion Tensor Imaging tracks the preferential diffusion of water along myelinated axons, allowing reconstruction of major white-matter bundles.",
  },
  {
    question: "Which is an absolute contraindication to MRI?",
    option_a: "Claustrophobia", option_b: "Renal impairment", option_c: "Ferromagnetic metal implants", option_d: "Recent food intake",
    correct_answer: "C",
    explanation: "The strong magnetic field can heat, dislodge, or malfunction ferromagnetic implants. Patients with certain pacemakers, cochlear implants, aneurysm clips, or retained metallic objects may be ineligible.",
  },
  {
    question: "Which modality is the primary diagnostic tool for epilepsy?",
    option_a: "EEG", option_b: "PET", option_c: "MRI", option_d: "CT",
    correct_answer: "A",
    explanation: "EEG records cortical electrical activity at millisecond resolution, making it indispensable for detecting interictal and ictal epileptiform activity.",
  },
  {
    question: "MEG is most distinguished from EEG by which advantage?",
    option_a: "Lower cost", option_b: "Better spatial resolution because magnetic fields pass through the skull less distorted", option_c: "Use of ionizing radiation", option_d: "Direct measurement of metabolism",
    correct_answer: "B",
    explanation: "Magnetic fields are less distorted by the skull and scalp than electrical fields, giving MEG better spatial resolution while preserving millisecond temporal precision.",
  },
  {
    question: "PET imaging requires:",
    option_a: "A strong magnetic field", option_b: "An injected radioactive tracer", option_c: "Surface electrodes only", option_d: "Ionizing X-rays from outside the body",
    correct_answer: "B",
    explanation: "PET injects a radioactive tracer (often a glucose analog) and detects positron emissions from metabolically active tissue.",
  },
  {
    question: "Which of the following is a STRUCTURAL imaging modality?",
    option_a: "fMRI", option_b: "PET", option_c: "CT", option_d: "EEG",
    correct_answer: "C",
    explanation: "CT, X-ray, MRI, DTI, and vascular imaging are structural. fMRI, PET, and EEG are functional.",
  },
  {
    question: "SPECT is sometimes called a 'poor man's PET' because:",
    option_a: "It uses no tracer", option_b: "It has lower spatial resolution but is cheaper and more widely available", option_c: "It requires general anesthesia", option_d: "It only images bone",
    correct_answer: "B",
    explanation: "SPECT uses a longer-lived tracer and produces lower-resolution images of regional cerebral blood flow, but the equipment and tracers are more accessible than PET.",
  },
  {
    question: "Which modality is best suited to detect aneurysms or arteriovenous malformations?",
    option_a: "Vascular imaging (CTA, MRA, catheter angiography)", option_b: "EEG", option_c: "fMRI", option_d: "EMG",
    correct_answer: "A",
    explanation: "Vascular imaging uses contrast in the bloodstream to visualize arteries and veins directly, revealing aneurysms, AVMs, atherosclerosis, and stenosis.",
  },
  {
    question: "ECT is most effective for which of the following?",
    option_a: "Mild generalized anxiety", option_b: "Specific phobias", option_c: "Severe treatment-resistant depression and catatonia", option_d: "Tension headaches",
    correct_answer: "C",
    explanation: "ECT is among the most effective treatments for severe depression, mania, catatonia, and the agitation/aggression of advanced dementia, often when medications have failed.",
  },
  {
    question: "What is the standard cortical target of TMS for major depressive disorder?",
    option_a: "Primary motor cortex", option_b: "Dorsolateral prefrontal cortex", option_c: "Occipital cortex", option_d: "Cerebellum",
    correct_answer: "B",
    explanation: "TMS protocols for depression target the dorsolateral prefrontal cortex, modulating circuits implicated in mood regulation.",
  },
  {
    question: "Which is a major limitation of TMS as a therapeutic tool?",
    option_a: "Requires general anesthesia", option_b: "Cannot directly stimulate deep brain structures", option_c: "Causes generalized seizures", option_d: "Requires surgery to implant",
    correct_answer: "B",
    explanation: "TMS uses surface coils to induce currents in superficial cortex; it cannot directly modulate deep targets — that requires DBS.",
  },
  {
    question: "DBS for Parkinson's disease typically targets:",
    option_a: "The dorsolateral prefrontal cortex", option_b: "The subthalamic nucleus", option_c: "Heschl's gyrus", option_d: "The cerebellar vermis",
    correct_answer: "B",
    explanation: "Subthalamic nucleus DBS (and globus pallidus internus DBS) are established targets for the motor symptoms of Parkinson's disease.",
  },
  {
    question: "Single-unit recording is primarily limited to:",
    option_a: "Routine clinical workups", option_b: "Animal research and rare intraoperative or implanted-electrode situations in humans", option_c: "Outpatient psychiatry", option_d: "Pediatric screening",
    correct_answer: "B",
    explanation: "It is invasive — a microelectrode is placed near a single neuron — making widespread human use impractical outside specialized intraoperative or implanted-device contexts.",
  },
  {
    question: "EMG is used to evaluate disorders of:",
    option_a: "The cerebellum", option_b: "Cortical visual processing", option_c: "Muscle, neuromuscular junction, and peripheral nerve", option_d: "The hippocampus",
    correct_answer: "C",
    explanation: "EMG records electrical activity of muscle fibers and motor units, helping to differentiate muscle disease, neuromuscular junction disorders, and peripheral neuropathies.",
  },
  {
    question: "Which feature of the hemodynamic response limits fMRI temporal resolution?",
    option_a: "It happens too fast for detectors", option_b: "It unfolds over several seconds, far slower than neural firing", option_c: "It depends on radioactive decay", option_d: "It only occurs during sleep",
    correct_answer: "B",
    explanation: "Vasodilation and the resulting BOLD change occur over seconds, so fMRI cannot resolve the millisecond timescale of action potentials.",
  },
  {
    question: "Which combination provides anatomic and metabolic information together?",
    option_a: "X-ray and EMG", option_b: "PET coregistered with MRI or CT", option_c: "EEG and TCD", option_d: "MEG and EMG",
    correct_answer: "B",
    explanation: "PET is commonly coregistered with a CT or MRI image so that metabolic activity can be mapped onto anatomy.",
  },
  {
    question: "Bilateral parieto-occipital damage producing simultanagnosia, optic ataxia, and oculomotor apraxia is classically called:",
    option_a: "Klüver–Bucy syndrome", option_b: "Bálint syndrome", option_c: "Schmahmann's syndrome", option_d: "Anton syndrome",
    correct_answer: "B",
    explanation: "While not unique to imaging, recognizing Bálint syndrome and similar patterns guides which imaging study (typically MRI) and what to look for.",
  },
];

async function run() {
  console.log(`Inserting ${FLASHCARDS.length} flashcards for topic ${TOPIC_ID}...`);
  await db.insert(flashcardsTable).values(
    FLASHCARDS.map(f => ({ topicId: TOPIC_ID, question: f.question, answer: f.answer, difficulty: f.difficulty }))
  );
  console.log(`  ✓ Inserted ${FLASHCARDS.length} flashcards`);

  console.log(`Inserting ${QUIZZES.length} quiz questions for topic ${TOPIC_ID}...`);
  await db.insert(quizQuestionsTable).values(
    QUIZZES.map(q => ({
      topicId: TOPIC_ID,
      question: q.question,
      optionA: q.option_a, optionB: q.option_b, optionC: q.option_c, optionD: q.option_d,
      correctAnswer: q.correct_answer, explanation: q.explanation,
    }))
  );
  console.log(`  ✓ Inserted ${QUIZZES.length} quiz questions`);

  console.log("✅ Done.");
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
