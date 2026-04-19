import { db } from "./index";
import { flashcardsTable, quizQuestionsTable } from "./schema";

const TOPIC_ID = 32;

const FLASHCARDS: Array<{ question: string; answer: string; difficulty: string }> = [
  { question: "What is a large-scale brain network?", answer: "A set of widely distributed brain regions whose activity is correlated over time and which share structural connections supporting their coordinated function.", difficulty: "easy" },
  { question: "Name the three ways networks are defined.", answer: "Structural connectivity (white-matter tracts), functional connectivity (correlated activity over time), and effective connectivity (causal influence one region exerts on another).", difficulty: "medium" },
  { question: "What is resting-state fMRI?", answer: "A scan in which the participant lies still without performing a task; low-frequency BOLD fluctuations (below 0.1 Hz) reveal coordinated activity between regions.", difficulty: "medium" },
  { question: "What is a network 'hub'?", answer: "A highly connected region that integrates information across many networks. Examples: posterior cingulate, precuneus, anterior insula, dorsolateral prefrontal cortex.", difficulty: "medium" },
  { question: "Why are hubs disproportionately affected in disease?", answer: "They are metabolically expensive and structurally central, so disruption has widespread downstream effects on network organization.", difficulty: "hard" },
  { question: "What does 'small-world organization' mean for the brain?", answer: "Dense local connections plus a few long-range shortcuts that allow efficient global communication while minimizing wiring cost.", difficulty: "hard" },
  { question: "What are the key nodes of the default mode network (DMN)?", answer: "Medial prefrontal cortex, posterior cingulate cortex/precuneus, inferior parietal lobule/angular gyrus, lateral temporal cortex, and medial temporal lobe.", difficulty: "medium" },
  { question: "What functions does the DMN support?", answer: "Self-referential thought, autobiographical memory, mental simulation (mental time travel), theory of mind, mind-wandering, and moral/social cognition.", difficulty: "medium" },
  { question: "When was the DMN discovered, and how?", answer: "In the 1990s, when researchers noticed certain regions consistently became LESS active during external tasks compared to rest — they were active during inward-focused thought.", difficulty: "medium" },
  { question: "What roughly proportion of waking life is spent mind-wandering?", answer: "Roughly 30 to 50 percent.", difficulty: "easy" },
  { question: "Which network is among the FIRST to show metabolic decline in Alzheimer's disease?", answer: "The default mode network — particularly the posterior cingulate and precuneus, mirroring the distribution of amyloid plaques.", difficulty: "hard" },
  { question: "What are the key nodes of the central executive (frontoparietal) network?", answer: "Dorsolateral prefrontal cortex, posterior parietal cortex (especially the intraparietal sulcus), dorsal anterior cingulate cortex, and lateral prefrontal areas.", difficulty: "medium" },
  { question: "What functions does the central executive network support?", answer: "Working memory, cognitive control, planning and problem solving, attention switching, and decision making under uncertainty.", difficulty: "easy" },
  { question: "How are the DMN and central executive network related?", answer: "They are anticorrelated — when one is active, the other tends to quiet down.", difficulty: "medium" },
  { question: "What syndrome results from damage to the dorsolateral prefrontal cortex?", answer: "The classic dysexecutive syndrome — poor planning, perseveration, reduced working memory, and difficulty adapting to new task demands.", difficulty: "medium" },
  { question: "What are the key nodes of the salience network?", answer: "Anterior insula (especially right) and dorsal anterior cingulate cortex, with subcortical partners including amygdala, ventral striatum, and substantia nigra/VTA.", difficulty: "medium" },
  { question: "What is the salience network's most distinctive role?", answer: "It acts as a switching hub — toggling engagement between the introspective DMN and the goal-directed central executive network depending on demands.", difficulty: "hard" },
  { question: "What is 'aberrant salience attribution' and which disorder is it associated with?", answer: "Tagging irrelevant stimuli as meaningful — a leading account of how delusions form in schizophrenia.", difficulty: "hard" },
  { question: "Which neurodegenerative disease selectively targets the salience network?", answer: "Behavioral variant frontotemporal dementia (bvFTD), with prominent loss of von Economo neurons in the anterior insula and dACC.", difficulty: "hard" },
  { question: "What are the key nodes of the dorsal attention network?", answer: "Frontal eye fields, superior parietal lobule, and intraparietal sulcus — bilaterally.", difficulty: "medium" },
  { question: "What kind of attention does the dorsal attention network support?", answer: "Voluntary, top-down attention — the deliberate allocation of processing resources to a chosen target.", difficulty: "easy" },
  { question: "What syndrome follows bilateral parieto-occipital damage?", answer: "Bálint syndrome — simultanagnosia, optic ataxia, and oculomotor apraxia, reflecting severe breakdown of spatial attention.", difficulty: "medium" },
  { question: "What are the key nodes of the ventral attention network, and how is it lateralized?", answer: "Temporoparietal junction and ventral frontal cortex (inferior and middle frontal gyri). Strongly RIGHT-lateralized in most people.", difficulty: "medium" },
  { question: "Why does right-hemisphere damage cause severe hemispatial neglect, but left-hemisphere damage typically does not?", answer: "The ventral attention network is right-lateralized, so left-hemisphere lesions do not disrupt it. The right hemisphere can still attend bilaterally when the left is damaged.", difficulty: "hard" },
  { question: "What is hemispatial neglect?", answer: "Failure to attend to one side of space (typically the left after right-hemisphere stroke). Patients may ignore food on the left half of a plate, fail to dress the left side, or draw only the right half of a clock.", difficulty: "medium" },
  { question: "What are the key nodes of the sensorimotor network?", answer: "Primary motor cortex (M1), primary somatosensory cortex (S1), supplementary motor area, and premotor cortex, with subcortical participation from thalamus, basal ganglia, and cerebellum.", difficulty: "medium" },
  { question: "How is the sensorimotor network organized in terms of laterality?", answer: "Largely contralaterally organized — each hemisphere controls and senses the opposite side of the body — with modest left-hemisphere dominance for skilled motor sequencing in right-handers.", difficulty: "medium" },
  { question: "What functional sub-divisions does resting-state imaging reveal in the visual network?", answer: "The classical dorsal ('where/how') stream into the parietal lobe and the ventral ('what') stream into the temporal lobe.", difficulty: "medium" },
  { question: "What deficits result from V4 vs V5/MT damage?", answer: "V4 damage causes cortical color blindness (achromatopsia); V5/MT damage causes motion blindness (akinetopsia).", difficulty: "hard" },
  { question: "How is auditory processing lateralized?", answer: "Left hemisphere preferentially processes rapid temporal changes (critical for speech); right hemisphere preferentially processes spectral analysis (pitch, melody, music).", difficulty: "hard" },
  { question: "What are the key nodes of the language network?", answer: "Broca's area (inferior frontal gyrus), Wernicke's area (posterior superior temporal gyrus), arcuate fasciculus, angular gyrus, middle and inferior temporal gyri, supplementary motor area — strongly left-lateralized.", difficulty: "medium" },
  { question: "What proportions of right- and left-handers show left-hemisphere language dominance?", answer: "About 95% of right-handers and about 70% of left-handers.", difficulty: "medium" },
  { question: "What aphasia follows arcuate fasciculus damage, and what is its hallmark?", answer: "Conduction aphasia — profound difficulty with REPETITION despite preserved fluency and comprehension.", difficulty: "hard" },
  { question: "What are the three variants of primary progressive aphasia and what does each target?", answer: "Nonfluent/agrammatic (Broca's area and surrounding left frontal cortex); semantic (anterior temporal lobes); logopenic (left temporoparietal junction).", difficulty: "hard" },
  { question: "What are the key nodes of the limbic / affective network?", answer: "Amygdala, hippocampus, anterior cingulate cortex, orbitofrontal cortex, ventromedial prefrontal cortex, hypothalamus, insula, and ventral striatum.", difficulty: "medium" },
  { question: "What syndrome results from bilateral medial temporal damage including amygdala?", answer: "Klüver–Bucy syndrome — placidity, hyperorality, and hypersexuality.", difficulty: "hard" },
  { question: "What are the key nodes of the reward network (mesocorticolimbic dopamine system)?", answer: "Ventral tegmental area (VTA), nucleus accumbens / ventral striatum, ventromedial prefrontal cortex, orbitofrontal cortex, and amygdala.", difficulty: "medium" },
  { question: "What is a 'reward prediction error'?", answer: "The difference between expected and received reward, signaled by dopamine neurons in the VTA. It drives reinforcement learning.", difficulty: "hard" },
  { question: "What does the discovery of 'cerebellar homologues' of cortical networks imply?", answer: "The cerebellum participates in nearly every cortical network, contributing to cognition and emotion in addition to motor control.", difficulty: "hard" },
  { question: "What is Schmahmann's syndrome?", answer: "Cerebellar cognitive affective syndrome — executive, language, and personality changes from cerebellar damage that disrupts its participation in cortical networks.", difficulty: "hard" },
  { question: "What are the four parallel basal ganglia loops, and what does each support?", answer: "Motor loop (putamen) → movement; associative loop (caudate) → cognition; limbic loop (ventral striatum) → motivation and emotion; oculomotor loop → eye movements.", difficulty: "hard" },
  { question: "What three networks make up the triple network model?", answer: "Default mode network, central executive network, and salience network.", difficulty: "easy" },
  { question: "Who proposed the triple network model and when?", answer: "Vinod Menon, in 2011.", difficulty: "easy" },
  { question: "What is 'diaschisis'?", answer: "The phenomenon in which brain injury produces network-wide effects extending far beyond the lesion itself, due to disrupted connectivity between regions.", difficulty: "hard" },
  { question: "How does network organization change with healthy aging?", answer: "Within-network connectivity tends to decline while between-network connectivity may increase, blurring network boundaries.", difficulty: "medium" },
];

const QUIZZES: Array<{
  question: string; option_a: string; option_b: string; option_c: string; option_d: string;
  correct_answer: string; explanation: string;
}> = [
  {
    question: "Which three networks make up the triple network model proposed by Vinod Menon?",
    option_a: "Default mode, sensorimotor, visual", option_b: "Default mode, central executive, salience", option_c: "Dorsal attention, ventral attention, limbic", option_d: "Reward, language, salience",
    correct_answer: "B",
    explanation: "Menon's 2011 model frames much of higher cognition as the dynamic interaction of the DMN, central executive network, and salience network.",
  },
  {
    question: "Which network was discovered after researchers noticed it became LESS active during externally focused tasks?",
    option_a: "Salience network", option_b: "Central executive network", option_c: "Default mode network", option_d: "Dorsal attention network",
    correct_answer: "C",
    explanation: "The DMN was discovered because a consistent set of regions deactivated during external tasks — they were doing their most active work during inward-focused thought.",
  },
  {
    question: "Which network is most prominently and earliest disrupted in Alzheimer's disease?",
    option_a: "Salience network", option_b: "Sensorimotor network", option_c: "Default mode network", option_d: "Visual network",
    correct_answer: "C",
    explanation: "The DMN — particularly the posterior cingulate and precuneus — shows early metabolic decline and amyloid deposition in Alzheimer's.",
  },
  {
    question: "Which network selectively degenerates in behavioral variant frontotemporal dementia (bvFTD)?",
    option_a: "Default mode network", option_b: "Salience network", option_c: "Reward network", option_d: "Auditory network",
    correct_answer: "B",
    explanation: "bvFTD targets the salience network with prominent loss of von Economo neurons in the anterior insula and dACC, producing disinhibition, loss of empathy, apathy, and compulsive behaviors.",
  },
  {
    question: "Hemispatial neglect most often follows damage to which structure?",
    option_a: "Left temporoparietal junction", option_b: "Right temporoparietal junction", option_c: "Bilateral occipital cortex", option_d: "Left dorsolateral prefrontal cortex",
    correct_answer: "B",
    explanation: "The ventral attention network is right-lateralized, so right TPJ damage disrupts attention to the contralateral (left) side of space.",
  },
  {
    question: "The DMN and central executive network are typically described as:",
    option_a: "Synchronous and equally active", option_b: "Anticorrelated", option_c: "Functionally identical", option_d: "Both inactive at rest",
    correct_answer: "B",
    explanation: "When one network is active, the other tends to deactivate — a hallmark of healthy cognition. Weakening of this anticorrelation is associated with cognitive decline.",
  },
  {
    question: "Which network is described as the brain's 'switching hub' between introspective and goal-directed states?",
    option_a: "Default mode network", option_b: "Salience network", option_c: "Reward network", option_d: "Sensorimotor network",
    correct_answer: "B",
    explanation: "The salience network monitors important internal and external events and toggles engagement between the DMN and central executive network.",
  },
  {
    question: "Conduction aphasia, with profound difficulty in repetition despite preserved fluency and comprehension, follows damage to:",
    option_a: "Broca's area", option_b: "Wernicke's area", option_c: "The arcuate fasciculus", option_d: "The angular gyrus",
    correct_answer: "C",
    explanation: "The arcuate fasciculus connects Broca's and Wernicke's areas; damage disrupts the dorsal-stream pathway that maps sound to articulation.",
  },
  {
    question: "Approximately what percentage of right-handers have left-hemisphere language dominance?",
    option_a: "About 50%", option_b: "About 70%", option_c: "About 95%", option_d: "About 25%",
    correct_answer: "C",
    explanation: "About 95% of right-handers and about 70% of left-handers are left-hemisphere dominant for language.",
  },
  {
    question: "Bilateral parieto-occipital damage producing simultanagnosia, optic ataxia, and oculomotor apraxia is called:",
    option_a: "Klüver–Bucy syndrome", option_b: "Schmahmann's syndrome", option_c: "Bálint syndrome", option_d: "Anton syndrome",
    correct_answer: "C",
    explanation: "Bálint syndrome reflects severe breakdown of the dorsal attention network supporting top-down spatial attention.",
  },
  {
    question: "Which deficit follows V5/MT damage?",
    option_a: "Cortical color blindness", option_b: "Motion blindness (akinetopsia)", option_c: "Prosopagnosia", option_d: "Pure alexia",
    correct_answer: "B",
    explanation: "V5/MT specializes in motion processing; damage produces akinetopsia. V4 damage produces achromatopsia.",
  },
  {
    question: "The auditory network shows clear functional lateralization. Which side processes RAPID TEMPORAL CHANGES essential for speech?",
    option_a: "Left hemisphere", option_b: "Right hemisphere", option_c: "Both equally", option_d: "Neither — this is processed subcortically",
    correct_answer: "A",
    explanation: "The left hemisphere preferentially processes rapid temporal changes (speech); the right hemisphere preferentially processes spectral information (pitch, melody, music).",
  },
  {
    question: "Aberrant salience attribution — tagging irrelevant stimuli as meaningful — is a leading network account of:",
    option_a: "Depression", option_b: "Delusions in schizophrenia", option_c: "Klüver–Bucy syndrome", option_d: "Hemispatial neglect",
    correct_answer: "B",
    explanation: "Salience network dysfunction in schizophrenia leads to inappropriate assignment of meaning to neutral stimuli — a leading account of delusion formation.",
  },
  {
    question: "Which structures are the source of dopamine signals that drive the reward network?",
    option_a: "Locus coeruleus", option_b: "Raphe nuclei", option_c: "Ventral tegmental area (VTA)", option_d: "Nucleus basalis of Meynert",
    correct_answer: "C",
    explanation: "VTA dopamine neurons project to the nucleus accumbens, vmPFC, OFC, and amygdala, providing the reward prediction error signal.",
  },
  {
    question: "Klüver–Bucy syndrome — placidity, hyperorality, hypersexuality — follows bilateral damage to:",
    option_a: "Frontal eye fields", option_b: "Medial temporal lobes including amygdala", option_c: "Cerebellar vermis", option_d: "Posterior parietal cortex",
    correct_answer: "B",
    explanation: "Bilateral medial temporal damage including the amygdala disrupts limbic processing of emotional and motivational salience.",
  },
  {
    question: "Cerebellar cognitive affective syndrome (Schmahmann's syndrome) demonstrates that:",
    option_a: "The cerebellum has no role in cognition", option_b: "The cerebellum participates in cortical networks beyond motor control", option_c: "The cerebellum is purely sensory", option_d: "Cerebellar damage never affects personality",
    correct_answer: "B",
    explanation: "The syndrome reflects disruption of cerebellar contributions to cortical networks supporting cognition and emotion, not just motor function.",
  },
  {
    question: "ADHD is associated with which network pattern?",
    option_a: "Hyperactive central executive network", option_b: "Reduced executive engagement and impaired DMN suppression during tasks", option_c: "Selective salience network degeneration", option_d: "Loss of reward network entirely",
    correct_answer: "B",
    explanation: "ADHD shows reduced executive activity, failure to suppress the DMN during external tasks, and altered salience switching — mirroring the behavioral profile.",
  },
  {
    question: "Which basal ganglia loop, via the putamen, primarily supports movement?",
    option_a: "Motor loop", option_b: "Associative loop", option_c: "Limbic loop", option_d: "Oculomotor loop",
    correct_answer: "A",
    explanation: "The motor loop (putamen) supports movement; the associative loop (caudate) supports cognition; the limbic loop (ventral striatum) supports motivation and emotion.",
  },
  {
    question: "Subgenual anterior cingulate hyperactivity is a network feature of:",
    option_a: "Major depression", option_b: "Schizophrenia", option_c: "Klüver–Bucy syndrome", option_d: "Cortical deafness",
    correct_answer: "A",
    explanation: "Major depression features hyperactivity of the subgenual ACC and amygdala alongside DMN hyperconnectivity — the rationale for subgenual cingulate as a DBS target in treatment-resistant depression.",
  },
  {
    question: "Which is the dominant analytic method used to define networks from resting-state fMRI?",
    option_a: "Single-unit recording", option_b: "Independent component analysis and seed-based correlation", option_c: "Wada test", option_d: "EMG",
    correct_answer: "B",
    explanation: "Resting-state networks are extracted through ICA or seed-based correlation of low-frequency BOLD fluctuations.",
  },
  {
    question: "'Diaschisis' refers to:",
    option_a: "A type of seizure", option_b: "Network-wide effects of focal lesions extending beyond the damaged tissue", option_c: "A form of aphasia", option_d: "Loss of REM sleep",
    correct_answer: "B",
    explanation: "Diaschisis reflects the network perspective: focal damage often produces dysfunction in distant but structurally connected regions.",
  },
  {
    question: "DBS for treatment-resistant depression has targeted which structure as a network hub?",
    option_a: "Subthalamic nucleus", option_b: "Subgenual anterior cingulate", option_c: "Cerebellar vermis", option_d: "Heschl's gyrus",
    correct_answer: "B",
    explanation: "Subgenual cingulate DBS reflects the network-informed view that depression involves a hyperactive subgenual ACC within a disturbed limbic-DMN circuit.",
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
