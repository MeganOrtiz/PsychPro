import { db } from "./index";
import { topicsTable, flashcardsTable, quizQuestionsTable, studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable } from "./schema";
import { sql } from "drizzle-orm";

function mapQuizQuestions(rawQuestions: Array<{ topicId: number; question: string; options: string; correctAnswer: string; explanation: string }>) {
  return rawQuestions.map(rq => {
    const opts: string[] = JSON.parse(rq.options);
    return {
      topicId: rq.topicId,
      question: rq.question,
      optionA: opts[0],
      optionB: opts[1],
      optionC: opts[2],
      optionD: opts[3],
      correctAnswer: rq.correctAnswer,
      explanation: rq.explanation,
    };
  });
}

async function seed() {
  console.log("Seeding NeuroNotes (15 consolidated topics)...");

  await db.execute(sql`TRUNCATE practice_exam_questions, practice_exams, study_guides, quiz_questions, flashcards, progress, topics RESTART IDENTITY CASCADE`);

  const topics = await db.insert(topicsTable).values([
    { name: "Neuropsychology Overview", category: "Foundations", description: "Introduction to neuropsychology, brain-behavior relationships, and neuropsychological assessment." },
    { name: "Cell Biology & Neuron Anatomy", category: "Foundations", description: "Neuronal structure, membrane potential, action potentials, ion channels, and basic cellular neuroscience." },
    { name: "Neurotransmitters & Synaptic Transmission", category: "Foundations", description: "Neurotransmitter types, synaptic mechanisms, receptor classes, and pharmacological targets." },
    { name: "Sensory Pathways", category: "Neuroanatomy", description: "Ascending sensory and descending motor tracts, spinal cord organization, and pathway anatomy." },
    { name: "Sensory Systems", category: "Neuroscience", description: "Vision, hearing, touch, smell, taste, vestibular function, and motor control — the complete sensory-motor landscape." },
    { name: "Limbic System & Motivation", category: "Neuroscience", description: "Limbic structures, reward circuits, hunger, feeding behavior, and the neuroscience of motivation." },
    { name: "Sleep & Circadian Rhythms", category: "Neuroscience", description: "Sleep stages, circadian regulation, the suprachiasmatic nucleus, melatonin, and sleep disorders." },
    { name: "Endocrine System & Reproduction", category: "Neuroscience", description: "Hormones, HPA axis, pituitary gland, sex steroids, prenatal development, and reproductive neuroscience." },
    { name: "Psychopharmacology", category: "Clinical", description: "Drug mechanisms, neurotransmitter targets, major drug classes, and clinical prescribing principles." },
    { name: "Psychological Disorders", category: "Neuropsychology", description: "Psychosis, schizophrenia spectrum, bipolar, depressive, and dissociative disorders — foundations through diagnosis." },
    { name: "Personality Disorders", category: "Neuropsychology", description: "Cluster A, B, and C personality disorders, diagnostic criteria, and neuropsychological features." },
    { name: "ADHD & Medications", category: "Clinical", description: "ADHD neuroscience, DSM criteria, stimulant and nonstimulant medication classes, and treatment." },
    { name: "Language Processing & Aphasia", category: "Neuropsychology", description: "Language components, aphasia types, brain-language pathways, and speech disorders." },
    { name: "Apraxia & Agnosia", category: "Neuropsychology", description: "Motor planning disorders, perceptual recognition failures, types, and neuroanatomical bases." },
    { name: "Neurocognitive Disorders", category: "Clinical", description: "Huntington's, Parkinson's, Lewy body dementia, TBI, HIV neurocognition, delirium, and cortical pain." },
  ]).returning();

  const T: Record<string, number> = {};
  topics.forEach(t => { T[t.name] = t.id; });

  // ===========================================================================
  // FLASHCARDS
  // ===========================================================================
  const flashcards = [
    // ===== 1. NEUROPSYCHOLOGY OVERVIEW (12 cards) =====
    { topicId: T["Neuropsychology Overview"], question: "What is neuropsychology?", answer: "The scientific study of brain-behavior relationships — how structural and functional brain properties influence cognition, emotion, and behavior.", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What is a double dissociation?", answer: "Evidence that two cognitive functions are independent: lesion A impairs function X but not Y, while lesion B impairs Y but not X.", difficulty: "hard" },
    { topicId: T["Neuropsychology Overview"], question: "What is diaschisis?", answer: "Transient loss of function in brain regions remote from an injury site due to disrupted connections, even when those areas are structurally intact.", difficulty: "hard" },
    { topicId: T["Neuropsychology Overview"], question: "What does the MMSE assess?", answer: "The Mini-Mental State Examination screens for cognitive impairment across orientation, registration, attention, recall, language, and visuoconstruction (max 30 points).", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What is ecological validity in neuropsychological testing?", answer: "The degree to which test performance predicts real-world functional outcomes in patients' daily lives.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is lateralization of brain function?", answer: "The tendency for some functions to be dominant in one hemisphere — e.g., language in left, visuospatial processing in right.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is the Halstead-Reitan Battery?", answer: "A comprehensive neuropsychological test battery assessing sensorimotor and cognitive functions used to detect and characterize brain damage.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is equipotentiality?", answer: "Lashley's concept that any part of cortical tissue can substitute for another in learning; contrasts with strict localization of function.", difficulty: "hard" },
    { topicId: T["Neuropsychology Overview"], question: "What is the difference between anterograde and retrograde amnesia?", answer: "Anterograde: inability to form new memories after injury. Retrograde: loss of memories formed before the injury.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What are the five cognitive domains typically assessed in neuropsychology?", answer: "Attention, memory, language, visuospatial ability, and executive function.", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What is the diathesis-stress model?", answer: "A model proposing that genetic vulnerability (diathesis) interacts with environmental stress to produce psychological disorders; neither alone is sufficient.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is an endophenotype?", answer: "An intermediate biological marker (e.g., cognitive or neuroimaging measure) that lies between genes and observable symptoms, helping to bridge genetic and behavioral levels.", difficulty: "hard" },

    // ===== 2. CELL BIOLOGY & NEURON ANATOMY (12 cards) =====
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the resting membrane potential of a typical neuron?", answer: "Approximately -70 mV, maintained by the Na+/K+ ATPase pump and differential ion permeability.", difficulty: "easy" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is an action potential?", answer: "An all-or-none electrical signal generated at the axon hillock when membrane potential reaches threshold (~-55 mV), propagating down the axon.", difficulty: "easy" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the role of myelin?", answer: "Myelin insulates the axon and enables saltatory conduction — the action potential jumps between nodes of Ranvier, greatly increasing conduction velocity.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is spatial summation?", answer: "Integration of simultaneous inputs from multiple synaptic locations; the combined effect determines whether the postsynaptic neuron fires.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is temporal summation?", answer: "Integration of repeated inputs arriving in rapid succession at the same synapse; each successive EPSP adds to the previous one.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What causes depolarization during an action potential?", answer: "Rapid influx of Na+ through voltage-gated sodium channels, causing the membrane potential to rise from -70 mV toward +40 mV.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the refractory period?", answer: "A period after an action potential (absolute then relative) during which a neuron cannot (absolute) or requires greater than normal stimulation (relative) to fire again.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What are the main types of glial cells?", answer: "Astrocytes (support, synaptogenesis), oligodendrocytes (CNS myelin), Schwann cells (PNS myelin), microglia (immune), and ependymal cells (CSF lining).", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the all-or-none law?", answer: "A neuron either fires a full action potential or doesn't fire at all; the size of the AP does not vary with stimulus intensity (rate law encodes intensity).", difficulty: "easy" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is an EPSP?", answer: "An Excitatory PostSynaptic Potential — a graded depolarization that moves the membrane potential toward threshold, increasing the likelihood of firing.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is an IPSP?", answer: "An Inhibitory PostSynaptic Potential — a graded hyperpolarization that moves membrane potential away from threshold, reducing the likelihood of firing.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the role of voltage-gated K+ channels during repolarization?", answer: "They open after Na+ channels inactivate, allowing K+ to flow out, restoring the negative resting membrane potential.", difficulty: "hard" },

    // ===== 3. NEUROTRANSMITTERS & SYNAPTIC TRANSMISSION (12 cards) =====
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the major excitatory neurotransmitter in the brain?", answer: "Glutamate — acts on AMPA, NMDA, and kainate receptors; involved in nearly 90% of fast excitatory transmission.", difficulty: "easy" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the major inhibitory neurotransmitter in the brain?", answer: "GABA (gamma-aminobutyric acid) — hyperpolarizes neurons by opening Cl- channels; precursor is glutamate.", difficulty: "easy" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the difference between ionotropic and metabotropic receptors?", answer: "Ionotropic receptors are ligand-gated ion channels (fast, direct). Metabotropic (GPCRs) act through second messengers (slower, modulatory).", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are monoamine neurotransmitters?", answer: "Catecholamines (dopamine, norepinephrine, epinephrine) and indolamines (serotonin). They share a single amine group in their structure.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is reuptake?", answer: "The process by which neurotransmitters are transported back into the presynaptic terminal by transporter proteins, terminating their synaptic action.", difficulty: "easy" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is acetylcholine's role at the neuromuscular junction?", answer: "ACh is released from motor neurons, binds nicotinic receptors on muscle fibers, causing depolarization and muscle contraction.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is exocytosis in the context of synaptic transmission?", answer: "The process by which synaptic vesicles fuse with the presynaptic membrane and release neurotransmitter into the synaptic cleft in response to Ca2+ influx.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are neuropeptides?", answer: "Larger protein-derived neurotransmitters (e.g., substance P, endorphins, NPY) that often act as neuromodulators, altering the effect of classical neurotransmitters.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is a drug agonist vs antagonist?", answer: "An agonist mimics a neurotransmitter and activates its receptor. An antagonist blocks the receptor, preventing neurotransmitter binding.", difficulty: "easy" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are the three major dopamine pathways?", answer: "Mesolimbic (reward/pleasure), mesocortical (cognition/attention), and nigrostriatal (motor control/movement).", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is anandamide?", answer: "An endogenous cannabinoid neurotransmitter (endocannabinoid) that acts on CB1 and CB2 receptors; involved in pain, mood, memory, and appetite regulation.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is enzymatic degradation of neurotransmitters?", answer: "Breakdown of neurotransmitters by enzymes in the synaptic cleft — e.g., acetylcholinesterase breaks down ACh; MAO degrades monoamines.", difficulty: "medium" },

    // ===== 4. SENSORY PATHWAYS (12 cards) =====
    { topicId: T["Sensory Pathways"], question: "What does the dorsal column-medial lemniscal pathway carry?", answer: "Fine touch, vibration, and proprioception. Decussates in the medulla (gracile and cuneate nuclei), then ascends to the ventral posterolateral thalamus.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What does the anterolateral (spinothalamic) pathway carry?", answer: "Pain and temperature. Decussates in the spinal cord within 1-2 segments of entry, then ascends to the thalamus.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the corticospinal tract?", answer: "The primary motor pathway from cortex through medullary pyramids (where most fibers cross) to spinal motor neurons; controls voluntary distal limb movement.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the difference between UMN and LMN lesions?", answer: "UMN lesions cause spasticity, hyperreflexia, and Babinski sign. LMN lesions cause flaccidity, hyporeflexia, fasciculations, and muscle atrophy.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What spinal cord levels contain the lateral horn?", answer: "T1-L2 (sympathetic preganglionic neurons) and S2-S4 (parasympathetic preganglionic neurons).", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What is the gray matter organization of the spinal cord?", answer: "Dorsal horns (sensory input), ventral horns (motor output), and lateral horns (autonomic). The H-shaped gray matter is surrounded by white matter tracts.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the thalamus's role in sensory processing?", answer: "The thalamus acts as the primary sensory relay station — all sensory information except olfaction passes through it before reaching the cortex.", difficulty: "easy" },
    { topicId: T["Sensory Pathways"], question: "What is a dermatome?", answer: "A skin region innervated by a single spinal nerve root — key examples: C6=thumb/index, T4=nipple, T10=umbilicus, L4=medial leg/great toe, S1=lateral foot.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the stretch reflex?", answer: "A monosynaptic reflex: muscle spindle Ia afferent → α-motor neuron → same muscle. It detects and resists muscle stretch.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is reciprocal innervation?", answer: "When a flexor muscle contracts, its antagonist extensor is simultaneously inhibited — coordinated by interneurons in the spinal cord.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the conus medullaris?", answer: "The tapered end of the spinal cord, located at approximately L1-L2 in adults.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What is Brown-Séquard syndrome?", answer: "A hemisection of the spinal cord causing ipsilateral loss of motor function and proprioception, and contralateral loss of pain and temperature below the lesion.", difficulty: "hard" },

    // ===== 5. SENSORY SYSTEMS (22 cards) =====
    { topicId: T["Sensory Systems"], question: "What is the visible light spectrum range?", answer: "Approximately 380 to 760 nanometers.", difficulty: "easy" },
    { topicId: T["Sensory Systems"], question: "What is the difference between rods and cones?", answer: "Rods are highly sensitive, concentrated in the periphery, and detect black-and-white in low light. Cones are concentrated in the fovea, detect color, and require bright light.", difficulty: "easy" },
    { topicId: T["Sensory Systems"], question: "What is the retinal-geniculate-striate pathway?", answer: "The primary visual pathway: retina → optic nerve → optic chiasm → lateral geniculate nucleus (LGN) in thalamus → primary visual cortex (V1, striate cortex).", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What are the dorsal and ventral visual streams?", answer: "Dorsal (WHERE): location/movement, visuospatial, unconscious, damage causes neglect. Ventral (WHAT): object recognition, color/form, conscious, damage causes visual agnosia.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is blindsight?", answer: "The ability to respond to visual stimuli in the blind field without conscious awareness — due to residual subcortical visual processing after V1 damage.", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is the basilar membrane's role in hearing?", answer: "It vibrates in response to sound — different frequencies activate different regions (tonotopic map); high frequencies at the base, low at the apex.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the auditory pathway from cochlea to cortex?", answer: "Auditory nerve (CN VIII) → cochlear nuclei (pons/medulla) → superior olives → inferior colliculus (midbrain) → medial geniculate nucleus (thalamus) → primary auditory cortex (temporal lobe).", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What are the three types of cutaneous mechanoreceptors and their functions?", answer: "Pacinian corpuscles (deep vibration, rapidly adapting), Meissner's corpuscles (fine touch, rapidly adapting), Merkel's disks (surface features, slowly adapting), Ruffini endings (skin stretch, slowly adapting).", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is gate control theory of pain?", answer: "Melzack & Wall's theory that non-painful sensory input (touch/vibration) activates inhibitory interneurons in the dorsal horn that 'close the gate' to pain transmission.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the olfactory pathway unique feature?", answer: "Olfaction bypasses the thalamus — olfactory signals go directly from the olfactory bulb to piriform cortex, amygdala, and entorhinal cortex.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What are the five basic tastes?", answer: "Sweet, salty, sour, bitter, and umami. Taste receptors on papillae send signals via CN VII, IX, X to the solitary nucleus, then thalamus, then gustatory cortex.", difficulty: "easy" },
    { topicId: T["Sensory Systems"], question: "What is the vestibular system's primary role?", answer: "Detecting head position and movement. The otolith organs (saccule and utricle) detect linear acceleration; semicircular canals detect rotational acceleration.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the posterior parietal cortex's role in motor control?", answer: "Integrates visual, auditory, and somatosensory input to represent body position in space; sends output to prefrontal cortex for movement initiation.", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is trichromatic color vision theory?", answer: "Young-Helmholtz theory: three types of cones (short/medium/long wavelength) combine their responses to produce color perception.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the opponent-process theory of color vision?", answer: "Hering's theory: color is encoded as opponent pairs (red-green, blue-yellow, black-white), explaining afterimages and color blindness patterns.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is lateral inhibition?", answer: "Inhibition of neighboring neurons by horizontal cells in the retina, enhancing contrast and sharpening edges (Mach band effect).", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is stereognosis?", answer: "The ability to identify objects by touch alone; requires intact somatosensory cortex. Loss is called astereognosia.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the supplementary motor area (SMA)?", answer: "A cortical region active during motor imagery and planning of complex movement sequences; involved in inhibitory control between tasks.", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is the role of the cerebellum in motor control?", answer: "Coordinates timing and precision of movement, compares intended vs actual movement, corrects errors, and is involved in motor learning.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is prosopagnosia?", answer: "Inability to recognize faces; caused by damage to the fusiform face area in the ventral stream (temporal-occipital junction).", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is akinetopsia?", answer: "Inability to perceive visual motion; caused by damage to area MT/V5 in the medial temporal lobe.", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is the medial superior olive's role in hearing?", answer: "Detects interaural time differences (microsecond arrival-time delays between ears) for sound localization in the horizontal plane.", difficulty: "hard" },

    // ===== 6. LIMBIC SYSTEM & MOTIVATION (12 cards) =====
    { topicId: T["Limbic System & Motivation"], question: "What structures form the limbic system?", answer: "Amygdala, hippocampus, hypothalamus, thalamus (anterior nuclei), cingulate cortex, and fornix — involved in emotion, memory, and motivation.", difficulty: "easy" },
    { topicId: T["Limbic System & Motivation"], question: "What is the mesolimbic dopamine pathway's role in reward?", answer: "It mediates wanting/motivation (not just liking); activated by both rewarding and aversive stimuli; driven by prediction and prediction errors.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What are the three aspects of reward?", answer: "Liking (hedonic experience), wanting (incentive motivation), and learning (associating cues with rewards). They are dissociable.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is ghrelin?", answer: "A stomach-secreted hormone that stimulates appetite; rises before meals and falls after eating; acts on the lateral hypothalamus.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is leptin?", answer: "A hormone secreted by adipose tissue that suppresses appetite and increases metabolic rate; acts on the arcuate nucleus of the ventromedial hypothalamus.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is the set point theory of body weight?", answer: "The body maintains a defended weight 'set point' via negative feedback — when weight drops, hunger increases and metabolism decreases.", difficulty: "easy" },
    { topicId: T["Limbic System & Motivation"], question: "What is sensory-specific satiety?", answer: "The decrease in pleasure from a particular food as it is consumed, while appetite for other foods remains — contributes to dietary variety.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is anorexia nervosa's neural profile?", answer: "Associated with anhedonia, low serotonin, altered mesolimbic dopamine (reward deficiency), and hyperactivity of the anterior insula (body image distortion).", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the nucleus accumbens?", answer: "A key structure in the mesolimbic reward circuit; rostral part mediates appetitive behavior, caudal part mediates avoidance.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is glucoprivation?", answer: "A fall in available glucose to brain cells (not just blood glucose) that powerfully triggers feeding behavior via lateral hypothalamus and brainstem glucose sensors.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is Prader-Willi syndrome?", answer: "A genetic disorder characterized by insatiable hunger (hyperphagia), obesity, intellectual disability, and low muscle tone; caused by chromosome 15 defect.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is the positive-incentive perspective on eating?", answer: "We eat not just due to deprivation but because food has incentive value (anticipated pleasure); anticipation of taste and reward drives food-seeking behavior.", difficulty: "medium" },

    // ===== 7. SLEEP & CIRCADIAN RHYTHMS (12 cards) =====
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the suprachiasmatic nucleus (SCN)?", answer: "The brain's biological clock, located in the hypothalamus. It receives light input via the retinohypothalamic tract and controls circadian rhythms.", difficulty: "easy" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is a zeitgeber?", answer: "An external time cue that synchronizes the internal clock to the environment — the most powerful is light, but also includes meals, exercise, and social interaction.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is melatonin and where is it produced?", answer: "Melatonin is a hormone produced by the pineal gland that promotes sleepiness; secretion increases with darkness and is suppressed by light (via SCN-pineal pathway).", difficulty: "easy" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is REM sleep characterized by?", answer: "Rapid eye movements, vivid dreaming, near-complete muscle atonia (preventing acting out dreams), and EEG pattern similar to wakefulness.", difficulty: "easy" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What are the NREM sleep stages?", answer: "N1 (light sleep, theta waves), N2 (sleep spindles and K-complexes), N3 (slow-wave/deep sleep, delta waves) — essential for physical restoration and memory consolidation.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the endogenous circadian period in humans?", answer: "Slightly longer than 24 hours (~24.2 hours) — daily light exposure resets the SCN to remain synchronized with the external 24-hour day.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What do benzodiazepines do to sleep architecture?", answer: "They reduce slow-wave (N3) and REM sleep while increasing N2 sleep; useful for short-term insomnia but disrupt sleep quality.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is jet lag?", answer: "Misalignment between the internal circadian clock and the external environment caused by rapid transmeridian travel; symptoms include fatigue, insomnia, and cognitive impairment.", difficulty: "easy" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "How do morning vs evening chronotypes differ neurologically?", answer: "They differ in SCN timing and period length; genetics (e.g., PER3 gene) influences whether individuals are naturally early or late risers, shifting with age.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What role does the SCN play beyond sleep timing?", answer: "It coordinates body temperature, cortisol secretion, immune function, drug sensitivity, and urination patterns across the 24-hour cycle.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is sleep's role in memory consolidation?", answer: "Slow-wave sleep facilitates hippocampal-cortical transfer of declarative memories; REM sleep is important for procedural and emotional memory processing.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What special retinal cells detect light for circadian regulation?", answer: "Intrinsically photosensitive retinal ganglion cells (ipRGCs) containing melanopsin — they respond to blue light and project directly to the SCN.", difficulty: "hard" },

    // ===== 8. ENDOCRINE SYSTEM & REPRODUCTION (12 cards) =====
    { topicId: T["Endocrine System & Reproduction"], question: "What is the hypothalamopituitary portal system?", answer: "A vascular connection from the hypothalamus to the anterior pituitary that delivers releasing hormones to control pituitary hormone secretion.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the difference between organizational and activational hormone effects?", answer: "Organizational effects: permanent, occur during development, shape anatomical structures. Activational effects: temporary, occur in adulthood, trigger specific behaviors.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is oxytocin?", answer: "A neuropeptide produced by the hypothalamus and released by the posterior pituitary; involved in bonding, trust, labor contractions, and lactation.", difficulty: "easy" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the role of the SRY gene?", answer: "Located on the Y chromosome; triggers production of SRY protein which induces the gonads to develop as testes, driving male sexual differentiation.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is Androgen Insensitivity Syndrome (AIS)?", answer: "A genetic condition where cells cannot respond to androgens; XY individuals develop testes but appear female externally due to lack of androgen effect.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the Wolffian vs Müllerian system?", answer: "Wolffian: develops into male internal sex organs (testosterone-dependent). Müllerian: develops into female internal sex organs (develops in absence of testosterone/AMH).", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What are steroid hormones derived from?", answer: "Cholesterol. They are fat-soluble, cross cell membranes, and act on nuclear receptors to alter gene expression. Include sex steroids and cortisol.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is vasopressin (ADH)?", answer: "Antidiuretic hormone released by the posterior pituitary; controls water retention in the kidneys and plays roles in social bonding and aggression.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What are the three categories of sex organs?", answer: "Gonads (testes/ovaries), internal sex organs (uterus, vas deferens, etc.), and external sex organs (genitalia). All are influenced by prenatal hormone exposure.", difficulty: "easy" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is Turner's Syndrome?", answer: "A condition (45,X) where females have only one X chromosome and no functional gonads; often short stature, infertile, with female-typical development.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is 5-Alpha Reductase Deficiency?", answer: "A condition where XY individuals cannot convert testosterone to DHT; born with female-typical external genitalia but masculinize at puberty as testosterone rises.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What are the three classes of sex hormones?", answer: "Androgens (e.g., testosterone), estrogens (e.g., estradiol), and progestins (e.g., progesterone) — all steroid hormones produced by gonads and adrenal glands.", difficulty: "easy" },

    // ===== 9. PSYCHOPHARMACOLOGY (12 cards) =====
    { topicId: T["Psychopharmacology"], question: "What are the four drug target sites in the synapse?", answer: "Transporters (reuptake, e.g., SSRIs), GPCR/metabotropic receptors, enzymes (e.g., MAOIs), and ligand-gated (ionotropic) ion channels.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is the mechanism of SSRIs?", answer: "SSRIs block the serotonin reuptake transporter (SERT), increasing serotonin availability in the synapse; used for depression, anxiety, and OCD.", difficulty: "easy" },
    { topicId: T["Psychopharmacology"], question: "What is a boxed warning on FDA prescribing information?", answer: "The most serious warning from the FDA, indicating significant risks of serious adverse effects — e.g., increased suicidality risk with antidepressants in young people.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is the difference between pharmacokinetics and pharmacodynamics?", answer: "Pharmacokinetics: what the body does to the drug (absorption, distribution, metabolism, excretion). Pharmacodynamics: what the drug does to the body (receptor binding, mechanism).", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is esketamine (Spravato) and how does it work?", answer: "A nasal spray NMDA receptor antagonist approved for treatment-resistant depression; provides rapid antidepressant effects by modulating glutamate signaling.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is a first-generation vs second-generation antipsychotic?", answer: "FGAs (typical): primarily D2 blockers, high EPS risk. SGAs (atypical): block D2 and 5-HT2A, lower EPS risk but metabolic side effects.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is the difference between a drug's generic name and brand name?", answer: "Generic name (e.g., fluoxetine) is the chemical compound name approved by regulatory bodies. Brand name (e.g., Prozac) is the proprietary name given by the manufacturer.", difficulty: "easy" },
    { topicId: T["Psychopharmacology"], question: "What are long-acting injectables (LAIs)?", answer: "Depot formulations of antipsychotics administered every 2-4 weeks, improving adherence for patients who have difficulty with daily oral medications.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is the endogenous field in neuronal signaling?", answer: "The N-S axis of chemical signaling between presynaptic and postsynaptic neurons — includes action potentials, neurotransmitter release, and postsynaptic response.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What are the four levels of clinical psychologist involvement with medications?", answer: "Not involved, providing information (most common — indirect), general involvement (education/consultation), and prescribing (direct — limited states).", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is off-label prescribing?", answer: "Using an FDA-approved drug for a condition, population, or dose not listed in the official indication; legal and common — prescribers may do this immediately after FDA approval.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What does MAO inhibitor mean pharmacologically?", answer: "Monoamine oxidase inhibitors block the enzyme that degrades dopamine, serotonin, and norepinephrine, increasing monoamine levels; used for depression but have serious dietary restrictions.", difficulty: "medium" },

    // ===== 10. PSYCHOLOGICAL DISORDERS (20 cards) =====
    { topicId: T["Psychological Disorders"], question: "What is the diathesis-stress model of psychopathology?", answer: "Genetic vulnerability (diathesis) interacts with environmental stressors to produce disorder; neither alone is sufficient — genes load the gun, environment pulls the trigger.", difficulty: "easy" },
    { topicId: T["Psychological Disorders"], question: "What are positive symptoms of psychosis (SAPS)?", answer: "Delusions, hallucinations (usually auditory), disorganized speech, bizarre behavior, and positive formal thought disorder (e.g., derailment, tangentiality, clanging).", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is the most common type of hallucination in schizophrenia?", answer: "Auditory hallucinations — often voices commenting on the person's behavior or commanding them. Other types (visual, tactile) are less common and may suggest organic causes.", difficulty: "easy" },
    { topicId: T["Psychological Disorders"], question: "What are the five domains of schizophrenia abnormality per DSM-5?", answer: "Hallucinations, delusions, disorganized thinking/speech, abnormal motor behavior (including catatonia), and negative symptoms (diminished expression, avolition).", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "How do schizophrenia spectrum disorders differ by duration?", answer: "Brief Psychotic Disorder (1 day–1 month), Schizophreniform (1–6 months), Schizophrenia (6+ months with functional decline), Schizoaffective (schizophrenia + mood episodes).", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is the difference between Bipolar I and Bipolar II?", answer: "Bipolar I: full manic episode (1+ week, may require hospitalization). Bipolar II: hypomanic episodes (4+ days) plus major depressive episodes — NO full manic episodes.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is Cyclothymic Disorder?", answer: "2-year period of fluctuating hypomanic and depressive symptoms that don't meet full criteria for either episode; causes significant distress/impairment.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is Persistent Depressive Disorder (PDD)?", answer: "Chronically depressed mood for 2+ years (not symptom-free for more than 2 months); combines former dysthymia and chronic MDD; milder but more chronic than MDD.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is Dissociative Identity Disorder (DID)?", answer: "Two or more distinct personality states with discontinuity in identity, memory, emotion, and behavior; often involves recurrent gaps in recall of traumatic events.", difficulty: "easy" },
    { topicId: T["Psychological Disorders"], question: "What is the difference between depersonalization and derealization?", answer: "Depersonalization: feeling detached from one's own thoughts/feelings/body. Derealization: surroundings feel unreal or dreamlike. Reality testing remains intact in both.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is Dissociative Amnesia with fugue?", answer: "Inability to recall autobiographical information (retrograde amnesia) plus apparently purposeful travel or bewildered wandering, often after significant trauma.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What distinguishes a delusion from a cultural belief?", answer: "Cultural beliefs are shared by the community; delusions are idiosyncratic, often bizarre, resistant to logic, and cause impairment. Clinicians must gather cultural context.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is Disruptive Mood Dysregulation Disorder (DMDD)?", answer: "Severe and recurrent temper outbursts (3+ times/week) plus persistently irritable mood; diagnosed in children ages 6-18 with onset before age 10.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What are negative symptoms of schizophrenia?", answer: "Diminished emotional expression (flat affect), avolition (lack of motivation), alogia (poverty of speech), anhedonia, and social withdrawal.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What are the steps in differential diagnosis?", answer: "Rule out malingering, then substances/medical conditions, determine primary disorder, differentiate from adjustment disorder, establish no-disorder boundary, use decision trees.", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What is the categorical vs dimensional debate in psychopathology?", answer: "Categorical models have strict diagnostic boundaries; dimensional models recognize that symptoms exist on continua across disorders. Evidence supports both approaches.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is Schizoaffective Disorder?", answer: "Schizophrenia criteria plus a concurrent mood episode, BUT hallucinations/delusions must occur for 2+ weeks without a major mood episode during the same period.", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What is Premenstrual Dysphoric Disorder (PMDD)?", answer: "Mood symptoms (depression, anxiety, lability) occurring exclusively in the luteal phase of the menstrual cycle, resolving after menstruation begins.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is formal thought disorder?", answer: "A disturbance in the organization and flow of thinking manifested in speech — includes derailment, tangentiality, incoherence, circumstantiality, and clanging.", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What insight do individuals with thought disorder typically have about their own symptoms?", answer: "Typically poor — individuals can often recognize thought disorder in others but have reduced ability to recognize it in themselves.", difficulty: "hard" },

    // ===== 11. PERSONALITY DISORDERS (12 cards) =====
    { topicId: T["Personality Disorders"], question: "What are the general criteria (A-F) for a personality disorder?", answer: "A: 2+ of cognition/affectivity/interpersonal/impulse; B: inflexible/pervasive; C: significant distress/impairment; D: enduring since at least adolescence; E: not another disorder; F: not a substance.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What are the Cluster A personality disorders?", answer: "Paranoid (distrust/suspiciousness), Schizoid (social detachment, restricted emotion), Schizotypal (eccentric, odd beliefs, uncomfortable with closeness) — the 'odd' cluster.", difficulty: "easy" },
    { topicId: T["Personality Disorders"], question: "What are the Cluster B personality disorders?", answer: "Antisocial, Borderline, Histrionic, and Narcissistic — characterized by dramatic, emotional, or erratic behavior.", difficulty: "easy" },
    { topicId: T["Personality Disorders"], question: "What are the Cluster C personality disorders?", answer: "Avoidant (fear of rejection), Dependent (submissive/excessive need for care), Obsessive-Compulsive (perfectionism/rigidity) — the 'anxious/fearful' cluster.", difficulty: "easy" },
    { topicId: T["Personality Disorders"], question: "What are the diagnostic criteria for Antisocial PD?", answer: "Pervasive disregard for others' rights since age 15; 3+ of: law violations, deceitfulness, impulsivity, aggression, recklessness, irresponsibility, no remorse. Must be 18+.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What are the diagnostic criteria for Borderline PD?", answer: "9 criteria including: frantic efforts to avoid abandonment, unstable relationships (idealization/devaluation), identity disturbance, impulsivity, suicidal behavior, affective instability, chronic emptiness, anger, and paranoid ideation. Need 5+.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is splitting in BPD?", answer: "A defense mechanism where people or things are seen as all-good or all-bad with no integration; others are idealized then suddenly devalued.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What characterizes Paranoid Personality Disorder?", answer: "Pervasive distrust and suspiciousness — suspects exploitation, preoccupied with loyalty, reluctant to confide, reads hidden meaning into benign remarks, holds grudges, suspects infidelity.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What characterizes Schizotypal PD, distinguishing it from Schizoid PD?", answer: "Schizotypal has odd beliefs, magical thinking, unusual perceptual experiences, odd speech, and social anxiety with paranoid features — not just social detachment like Schizoid.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What makes personality disorders different from other mental disorders?", answer: "They are ego-syntonic (the person sees their traits as part of themselves, not symptoms), pervasive across situations, long-standing since adolescence, and difficult to treat.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What does 'contagious' mean in the context of personality disorders?", answer: "Personality disorder symptoms evoke strong reactions in others — therapists and family often feel pulled into enacting complementary roles that reinforce the patient's patterns.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is Narcissistic PD?", answer: "Grandiosity, need for admiration, and lack of empathy; 5+ of: grandiose sense of self, fantasies of success/power, sense of entitlement, exploits others, lacks empathy, envious, arrogant.", difficulty: "medium" },

    // ===== 12. ADHD & MEDICATIONS (12 cards) =====
    { topicId: T["ADHD & Medications"], question: "What are the three brain regions central to ADHD neuroscience?", answer: "Dorsolateral prefrontal cortex (sustained attention, problem-solving), dorsal anterior cingulate (selective attention), orbitofrontal cortex (impulse control).", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What DSM-5 age of onset criterion applies to ADHD?", answer: "Several inattentive or hyperactive-impulsive symptoms must have been present before age 12 and in two or more settings.", difficulty: "easy" },
    { topicId: T["ADHD & Medications"], question: "What is methylphenidate (Ritalin) and how does it work?", answer: "A stimulant that blocks dopamine and norepinephrine reuptake transporters, increasing catecholamine availability in prefrontal regions; multiple delivery systems exist (Concerta, Daytrana patch).", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is Vyvanse (lisdexamfetamine) and how does it differ from Adderall?", answer: "Vyvanse is a prodrug — metabolized in the body to d-amphetamine; longer duration and lower abuse potential than regular amphetamine salts (Adderall).", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What is atomoxetine (Strattera)?", answer: "A non-stimulant SNRI specifically approved for ADHD; selectively inhibits the norepinephrine transporter, increasing NE and dopamine in prefrontal cortex; slower onset than stimulants.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What are common side effects of stimulant medications for ADHD?", answer: "Insomnia, reduced appetite, growth suppression, elevated blood pressure, cardiac effects, and potential for rebound irritability.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is the Jornay PM formulation of methylphenidate?", answer: "Extended-release methylphenidate taken at bedtime — engineered for delayed release so it activates in the morning, helping with morning routine.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What are guanfacine and clonidine used for in ADHD?", answer: "Alpha-2 adrenergic agonists used as second-line nonstimulants; originally developed for hypertension; can reduce impulsivity and improve attention.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is modafinil and how is it used in ADHD?", answer: "A dopamine reuptake inhibitor (Class 4 controlled substance) that reduces excessive sleepiness; used off-label in ADHD; lower abuse potential than amphetamines.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What non-medication interventions are used for ADHD?", answer: "Behavioral modification, IEP/504 plans, parent training in behavior management (PTBM), behavior plan interventions (BPI), and group social skills training.", difficulty: "easy" },
    { topicId: T["ADHD & Medications"], question: "What is ADHD's underlying neurobiological mechanism?", answer: "Dysregulation of frontal-subcortical-cerebellar catecholaminergic circuitry and dopamine transporter abnormalities leading to impaired executive function and attention regulation.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is viloxazine (Qelbree)?", answer: "A newer non-stimulant ADHD medication that modulates serotonergic activity; approved for children and adults, but evidence does not show a clear advantage over atomoxetine.", difficulty: "hard" },

    // ===== 13. LANGUAGE PROCESSING & APHASIA (12 cards) =====
    { topicId: T["Language Processing & Aphasia"], question: "What are the six basic components of language?", answer: "Phonemes (smallest sounds), morphemes (smallest meaning units), syntax (sentence structure rules), semantics (meaning), pragmatics (context), and prosody (rhythm/intonation).", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is Broca's aphasia?", answer: "Non-fluent, agrammatic speech with dysarthria and dysprosody; repetition and naming impaired; comprehension relatively preserved. Lesion: left inferior frontal gyrus (Broca's area).", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is Wernicke's aphasia?", answer: "Fluent but nonsensical speech (jargon aphasia); severely impaired comprehension, repetition, and naming. Lesion: left posterior superior temporal gyrus (Wernicke's area).", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is conduction aphasia?", answer: "Relatively fluent speech with phonemic paraphasias; hallmark is severely impaired repetition with preserved comprehension. Caused by arcuate fasciculus/supramarginal gyrus lesion.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is anomic aphasia?", answer: "Non-localizing aphasia characterized by word-finding difficulty (pauses, circumlocution); comprehension and repetition intact. Most common residual aphasia after recovery.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the difference between Transcortical Motor and Transcortical Sensory aphasia?", answer: "TCM: non-fluent like Broca's, intact repetition, impaired naming/writing. TCS: fluent like Wernicke's with echolalia, severely impaired comprehension, intact repetition.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is Chomsky's deep structure vs surface structure?", answer: "Deep structure: the underlying meaning of an utterance. Surface structure: how it is actually expressed. Transformational rules map between them; different surface forms can share the same deep structure.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is categorical perception in speech?", answer: "Perceiving speech sounds in discrete categories despite continuous acoustic variation — e.g., 'b' and 'p' are perceived as distinct even though voice onset time varies continuously.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the phonemic restoration effect?", answer: "When a phoneme is replaced by noise, listeners still perceive the correct word — the brain uses lexical and contextual knowledge to 'fill in' missing sounds.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is aprosodia?", answer: "Expressive: inability to convey emotional tone in speech (flat, monotone). Receptive: difficulty interpreting others' emotional prosody and paraverbal communication.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is alexia with vs without agraphia?", answer: "Alexia with agraphia: cannot read or write (angular gyrus lesion). Alexia without agraphia: cannot read but CAN write (rare; disconnection of visual cortex from language areas).", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the key feature of perisylvian aphasias?", answer: "Impaired repetition — the perisylvian region includes Broca's area, Wernicke's area, and the arcuate fasciculus; all perisylvian aphasias share repetition difficulty.", difficulty: "hard" },

    // ===== 14. APRAXIA & AGNOSIA (12 cards) =====
    { topicId: T["Apraxia & Agnosia"], question: "What is apraxia?", answer: "Inability to perform purposeful or skilled movements despite intact motor and sensory systems; reflects a deficit in motor planning at the cortical association level.", difficulty: "easy" },
    { topicId: T["Apraxia & Agnosia"], question: "What is ideomotor apraxia?", answer: "Inability to pantomime tool use or follow gestural commands; errors include postural (body part as tool), spatial/trajectory, and temporal errors. Left hemisphere frontal-parietal lesion.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is ideational apraxia?", answer: "Failure to execute a complex, multi-step motor sequence (e.g., making coffee); the sequence of individual acts is disrupted. Associated with frontal lobe lesions.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is conduction apraxia?", answer: "More impaired with imitation than with command; a disconnection syndrome; lesion to left inferior parietal lobe (supramarginal gyrus, arcuate fasciculus).", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is apraxia of speech?", answer: "Difficulty planning and sequencing the motor movements for speech production; automatic speech may be preserved; not caused by weakness (dysarthria) or aphasia.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is agnosia?", answer: "Perception without recognition in any sensory modality — the ability to sense is intact but the brain cannot recognize or interpret what is being perceived.", difficulty: "easy" },
    { topicId: T["Apraxia & Agnosia"], question: "What is visual agnosia?", answer: "Inability to recognize objects by sight despite intact visual acuity and intelligence; caused by damage to the ventral visual stream (temporal-occipital cortex).", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is simultagnosia?", answer: "Inability to perceive more than one object at a time; part of Balint's syndrome (with optic ataxia and oculomotor apraxia); bilateral parietal-occipital damage.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is auditory agnosia?", answer: "Inability to recognize sounds despite intact hearing; specific forms include phonagnosia (familiar voices) and auditory verbal agnosia (word recognition).", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is asomatognosia?", answer: "Failure to recognize one's own body parts or their relationship; may involve hemispatial neglect; associated with right parietal lobe lesions.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is the standard assessment order for apraxia?", answer: "Pantomime to command → imitate the examiner → use the actual object; assess both limbs; tests reveal which level of representation is impaired.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is conceptual apraxia?", answer: "Defective knowledge of tool-object relationships and how tools function; two types — conceptual knowledge (what tools do) and production knowledge (how to use them).", difficulty: "hard" },

    // ===== 15. NEUROCOGNITIVE DISORDERS (22 cards) =====
    { topicId: T["Neurocognitive Disorders"], question: "What is the genetic basis of Huntington's Disease?", answer: "An autosomal dominant mutation in the HTT gene on chromosome 4 — CAG trinucleotide repeats (36+ = pathological) causing an abnormally long polyglutamine stretch.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What neuroanatomy is primarily affected in Huntington's Disease?", answer: "Basal ganglia — degeneration of the caudate (creating 'boxcar ventricles') and putamen; later frontal cortex atrophy causing executive function deficits.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is chorea?", answer: "Involuntary, irregular, rapid movements that flow from one body part to another; the hallmark motor symptom of Huntington's Disease.", difficulty: "easy" },
    { topicId: T["Neurocognitive Disorders"], question: "What psychiatric symptoms often precede motor symptoms in Huntington's?", answer: "Depression (most common), anxiety, OCD symptoms, apathy, irritability, and psychosis — often appear years before motor signs.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What are the Frascati Criteria for HIV neurocognitive disorders?", answer: "ANI (≥1 SD below in 2+ domains, no functional impairment), MND (same plus mild functional impairment, ~12% prevalence), HAD (same plus marked functional impairment, ~2%).", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "How does beta-amyloid differ between HIV and Alzheimer's?", answer: "In HIV, beta-amyloid plaques are intracellular. In Alzheimer's, they are extracellular — this distinction helps differentiate these dementias.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is delirium?", answer: "An acute neuropsychiatric syndrome characterized by fluctuating impairment of attention and consciousness, often with confusion, hallucinations, and disorientation.", difficulty: "easy" },
    { topicId: T["Neurocognitive Disorders"], question: "What are the three subtypes of delirium?", answer: "Hyperactive (agitated, combative — high injury risk), hypoactive (quiet, withdrawn — often missed clinically), and mixed (alternating features of both).", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What primarily distinguishes delirium from dementia?", answer: "Timeline of onset — delirium has an acute (hours to days) and fluctuating course; dementia has a gradual, progressive onset.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the Glasgow Coma Scale (GCS)?", answer: "A 15-point scale assessing consciousness after TBI across three components: eye opening (4), verbal response (5), and motor response (6). Score ≤8 = severe TBI.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the difference between a subdural and epidural hematoma?", answer: "Subdural: venous bleed between dura and arachnoid — slow, seen in elderly/anticoagulants. Epidural: arterial bleed between skull and dura — rapid, classic 'lucid interval'.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is Chronic Traumatic Encephalopathy (CTE)?", answer: "A progressive neurodegenerative disease from repetitive brain trauma; characterized by tau protein accumulation; diagnosed post-mortem; associated with contact sports.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What are the cardinal motor symptoms of Parkinson's Disease?", answer: "Bradykinesia (slow movement, required), tremor (resting, often first symptom), and rigidity (cogwheel or lead pipe). Postural instability appears later.", difficulty: "easy" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the pathophysiology of Parkinson's Disease?", answer: "Progressive degeneration of dopaminergic neurons in the substantia nigra pars compacta, with Lewy body (alpha-synuclein) accumulation; loss of striatal dopamine input.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What are the core features of Dementia with Lewy Bodies (DLB)?", answer: "Fluctuating cognition (especially alertness), parkinsonism (after cognitive decline), recurrent visual hallucinations (80%), and REM sleep behavior disorder.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "How does Lewy body dementia differ from Alzheimer's in presentation?", answer: "DLB shows prominent early hallucinations, fluctuating attention, and parkinsonism. Alzheimer's presents with primary memory impairment first. DLB is most commonly misdiagnosed as Alzheimer's.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is gate control theory of pain?", answer: "Melzack and Wall's theory: non-painful sensory input activates inhibitory interneurons in the dorsal horn that 'close the gate' to pain signals ascending to the brain.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the periaqueductal gray (PAG) and its role in pain?", answer: "A midbrain structure that contains high concentrations of opioid receptors and activates descending pain inhibition pathways; stimulation produces profound analgesia.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What role does the anterior cingulate cortex play in pain?", answer: "It processes the emotional/affective distress component of pain (the 'suffering'). Damage to the cingulate eliminates the emotional distress of pain while leaving sensory detection intact.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is TBI's specific risk profile in older adults?", answer: "Ages 65-74: 1 in 200 incidence; 75+: 1 in 50; 85% from falls; 2-fold increased dementia risk; slower recovery, greater functional dependence, polypharmacy complications.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What cognitive domains are most impaired in HIV-associated neurocognitive disorder?", answer: "Episodic memory, executive function, attention, working memory, fine motor control, and verbal fluency — subcortical pattern with psychomotor slowing.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What cognitive profile distinguishes Alzheimer's from HIV dementia?", answer: "Alzheimer's: cortical, primary amnestic, anomia. HIV dementia: subcortical, mild memory, psychomotor slowing, executive dysfunction, depression prominent at end stage.", difficulty: "hard" },
  ];

  await db.insert(flashcardsTable).values(flashcards);
  console.log(`Inserted ${flashcards.length} flashcards`);

  // ===========================================================================
  // QUIZ QUESTIONS (10+ per topic, 20 for large consolidated topics)
  // ===========================================================================
  const rawQuizQuestions = [
    // ===== 1. NEUROPSYCHOLOGY OVERVIEW =====
    { topicId: T["Neuropsychology Overview"], question: "Which concept states that any cortical area can substitute for another in learning?", options: JSON.stringify(["Equipotentiality","Localization","Lateralization","Diaschisis"]), correctAnswer: "A", explanation: "Lashley's equipotentiality holds that cortical tissue is largely interchangeable for mass action learning, contrasting with strict localization of function." },
    { topicId: T["Neuropsychology Overview"], question: "A patient can form new memories but cannot recall events from before a car accident. This is best described as:", options: JSON.stringify(["Anterograde amnesia","Retrograde amnesia","Dissociative fugue","Transient global amnesia"]), correctAnswer: "B", explanation: "Retrograde amnesia is loss of memories formed before the injury. Anterograde amnesia is failure to form new memories after injury." },
    { topicId: T["Neuropsychology Overview"], question: "What does ecological validity refer to in neuropsychological assessment?", options: JSON.stringify(["How well a test predicts real-world functioning","The physical environment where testing occurs","The statistical validity of norms","Whether raw scores are ecologically stable"]), correctAnswer: "A", explanation: "Ecological validity is the degree to which test performance generalizes to and predicts everyday functional outcomes in patients' lives." },
    { topicId: T["Neuropsychology Overview"], question: "The diathesis-stress model proposes that psychological disorders result from:", options: JSON.stringify(["Genetic vulnerability interacting with environmental stressors","Purely environmental causes","A single dominant gene mutation","Brain lesions alone"]), correctAnswer: "A", explanation: "The diathesis-stress model holds that genetic vulnerability (diathesis) requires environmental stress to trigger disorder — neither factor alone is sufficient." },
    { topicId: T["Neuropsychology Overview"], question: "A double dissociation demonstrates:", options: JSON.stringify(["Two cognitive functions are independent of each other","Two brain areas have identical functions","Memory and language are always paired","One function depends on another"]), correctAnswer: "A", explanation: "A double dissociation shows that lesion A impairs function X but not Y while lesion B impairs Y but not X, proving the two functions are neurally independent." },
    { topicId: T["Neuropsychology Overview"], question: "Diaschisis refers to:", options: JSON.stringify(["Loss of function in regions remote from but connected to a lesion","Direct destruction of neural tissue","Swelling at the injury site","Cognitive reserve depletion"]), correctAnswer: "A", explanation: "Diaschisis is a transient functional loss in structurally intact brain regions that are connected to the lesion site, due to disconnection effects." },
    { topicId: T["Neuropsychology Overview"], question: "Which hemisphere is typically dominant for language processing?", options: JSON.stringify(["Left hemisphere","Right hemisphere","Both equally","Depends entirely on handedness"]), correctAnswer: "A", explanation: "In approximately 95% of right-handers and 70% of left-handers, language is dominant in the left hemisphere." },
    { topicId: T["Neuropsychology Overview"], question: "The MMSE maximum score is:", options: JSON.stringify(["30","100","20","50"]), correctAnswer: "A", explanation: "The Mini-Mental State Examination has a maximum score of 30 points, covering orientation, registration, attention/calculation, recall, language, and visuoconstruction." },
    { topicId: T["Neuropsychology Overview"], question: "An endophenotype is best described as:", options: JSON.stringify(["An intermediate biological marker between genes and symptoms","The same as a clinical symptom","A behavioral phenotype visible to observers","A gene directly causing a disorder"]), correctAnswer: "A", explanation: "An endophenotype (e.g., a cognitive or neuroimaging measure) lies between genetic variants and observable symptoms, bridging the genetic-behavioral gap." },
    { topicId: T["Neuropsychology Overview"], question: "The Halstead-Reitan Battery is primarily used to:", options: JSON.stringify(["Detect and characterize brain damage","Screen for personality disorders","Measure IQ only","Assess anxiety disorders"]), correctAnswer: "A", explanation: "The Halstead-Reitan Battery is a comprehensive neuropsychological battery assessing motor, sensory, and cognitive functions to detect and characterize brain damage." },

    // ===== 2. CELL BIOLOGY & NEURON ANATOMY =====
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "The resting membrane potential of a typical neuron is approximately:", options: JSON.stringify(["-70 mV","+40 mV","0 mV","-55 mV"]), correctAnswer: "A", explanation: "The resting membrane potential is approximately -70 mV, maintained by Na+/K+ ATPase pumps and differential ion permeability." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "Saltatory conduction refers to:", options: JSON.stringify(["Action potentials jumping between nodes of Ranvier","Slower conduction in unmyelinated axons","Ca2+ influx at synaptic terminals","Synaptic vesicle fusion with the membrane"]), correctAnswer: "A", explanation: "Saltatory conduction occurs in myelinated axons — the action potential 'jumps' between exposed nodes of Ranvier, greatly increasing speed and energy efficiency." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "Which ion primarily flows IN during the depolarization phase of an action potential?", options: JSON.stringify(["Na+","K+","Cl-","Ca2+"]), correctAnswer: "A", explanation: "Voltage-gated Na+ channels open at threshold, allowing rapid Na+ influx that drives the membrane potential from -70 mV toward +40 mV." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "The all-or-none law states that:", options: JSON.stringify(["A neuron fires maximally or not at all","Larger stimuli produce larger action potentials","Only one neuron fires at a time","APs decay over distance"]), correctAnswer: "A", explanation: "Once threshold is reached, a full-sized action potential is generated regardless of stimulus intensity; intensity is encoded by firing rate, not AP size." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "Spatial summation in a neuron involves:", options: JSON.stringify(["Integration of simultaneous inputs from multiple synaptic locations","Repeated inputs arriving rapidly in succession","Single large stimuli at one location","Inhibitory input only"]), correctAnswer: "A", explanation: "Spatial summation occurs when multiple synaptic inputs activate the neuron simultaneously from different locations, and their combined effects determine whether threshold is reached." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "Which glial cell type produces myelin in the central nervous system?", options: JSON.stringify(["Oligodendrocytes","Schwann cells","Astrocytes","Microglia"]), correctAnswer: "A", explanation: "Oligodendrocytes myelinate CNS axons. Schwann cells perform the same function in the peripheral nervous system." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "During the absolute refractory period:", options: JSON.stringify(["No action potential can be generated regardless of stimulus strength","A stronger stimulus can trigger another AP","Only inhibitory signals can pass","The neuron is at resting potential"]), correctAnswer: "A", explanation: "During the absolute refractory period, Na+ channels are inactivated — no stimulus, however large, can generate another action potential." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "An EPSP is best described as:", options: JSON.stringify(["A graded depolarization moving membrane potential toward threshold","A graded hyperpolarization reducing firing likelihood","An all-or-none signal at the axon hillock","A chemical signal in the synaptic cleft"]), correctAnswer: "A", explanation: "An EPSP is an excitatory, graded depolarization that moves the postsynaptic membrane potential closer to the threshold for firing." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "The axon hillock is significant because:", options: JSON.stringify(["It is where action potentials are initiated","It receives input from dendrites","It releases neurotransmitters","It is covered by the most myelin"]), correctAnswer: "A", explanation: "The axon hillock has the highest density of voltage-gated Na+ channels and is the site where spatial and temporal summation of inputs determines whether an AP is generated." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "Which of the following best describes temporal summation?", options: JSON.stringify(["Rapid repeated inputs at one synapse add together","Multiple simultaneous inputs from different synapses combine","Inhibitory and excitatory inputs cancel out","A single massive depolarization"]), correctAnswer: "A", explanation: "Temporal summation occurs when a single synapse is activated in rapid succession — each EPSP adds to the previous one before it decays." },

    // ===== 3. NEUROTRANSMITTERS & SYNAPTIC TRANSMISSION =====
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "The major excitatory neurotransmitter in the brain is:", options: JSON.stringify(["Glutamate","GABA","Dopamine","Serotonin"]), correctAnswer: "A", explanation: "Glutamate is the primary excitatory neurotransmitter, acting on AMPA, NMDA, and kainate receptors at approximately 90% of fast excitatory synapses." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "SSRIs work by:", options: JSON.stringify(["Blocking serotonin reuptake transporters","Blocking dopamine D2 receptors","Increasing GABA activity","Inhibiting MAO enzymes"]), correctAnswer: "A", explanation: "SSRIs selectively block the serotonin reuptake transporter (SERT), preventing serotonin from being transported back into the presynaptic terminal." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Ionotropic receptors differ from metabotropic receptors in that they:", options: JSON.stringify(["Are ligand-gated ion channels producing fast, direct effects","Act through second messenger cascades","Are only found postsynaptically","Are exclusively inhibitory"]), correctAnswer: "A", explanation: "Ionotropic receptors are directly coupled ion channels — binding opens the channel immediately (milliseconds). Metabotropic (GPCRs) use slower second messenger cascades." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Which neurotransmitter is degraded by acetylcholinesterase?", options: JSON.stringify(["Acetylcholine","Dopamine","Serotonin","GABA"]), correctAnswer: "A", explanation: "Acetylcholinesterase rapidly breaks down acetylcholine in the synaptic cleft, terminating its action — this is why organophosphate poisoning causes overstimulation." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "The mesolimbic dopamine pathway primarily mediates:", options: JSON.stringify(["Reward, pleasure-seeking, and motivation","Voluntary motor control","Cognitive attention and working memory","Sensory perception"]), correctAnswer: "A", explanation: "The mesolimbic pathway (VTA → nucleus accumbens/limbic structures) mediates reward, wanting, and pleasure; it is activated by both rewarding and aversive stimuli." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Neuropeptides differ from classical neurotransmitters in that they:", options: JSON.stringify(["Are larger molecules acting as neuromodulators with prolonged effects","Are synthesized at the presynaptic terminal","Act only on ionotropic receptors","Are degraded exclusively by reuptake"]), correctAnswer: "A", explanation: "Neuropeptides (e.g., substance P, endorphins) are larger protein fragments synthesized in the cell body, packed in dense-core vesicles, and act as slow neuromodulators." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "An antagonist drug works by:", options: JSON.stringify(["Blocking the receptor without activating it","Mimicking the neurotransmitter and activating the receptor","Increasing neurotransmitter synthesis","Blocking reuptake transporters"]), correctAnswer: "A", explanation: "Antagonists occupy receptors but do not activate them — they block the endogenous neurotransmitter from binding without producing a response." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "GABA produces inhibition primarily by:", options: JSON.stringify(["Opening Cl- channels causing hyperpolarization","Blocking Na+ channels","Inhibiting vesicle release","Activating metabotropic receptors only"]), correctAnswer: "A", explanation: "GABA binds GABA-A receptors (ionotropic), opening Cl- channels. Cl- influx hyperpolarizes the membrane (makes it more negative), reducing firing probability." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Exocytosis in synaptic transmission is triggered by:", options: JSON.stringify(["Ca2+ influx into the presynaptic terminal","Na+ influx into the postsynaptic terminal","K+ efflux from the presynaptic terminal","Cl- influx into the presynaptic terminal"]), correctAnswer: "A", explanation: "When an action potential reaches the terminal, voltage-gated Ca2+ channels open, Ca2+ enters, and triggers vesicle fusion with the membrane and neurotransmitter release." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Anandamide is best described as:", options: JSON.stringify(["An endogenous cannabinoid neurotransmitter","A synthetic opioid","An amino acid neurotransmitter","A catecholamine"]), correctAnswer: "A", explanation: "Anandamide is an endocannabinoid ('bliss molecule' from Sanskrit) that acts on CB1/CB2 receptors; involved in pain, mood, appetite, and memory regulation." },

    // ===== 4. SENSORY PATHWAYS =====
    { topicId: T["Sensory Pathways"], question: "The dorsal column-medial lemniscal pathway carries:", options: JSON.stringify(["Fine touch, vibration, and proprioception","Pain and temperature","Motor commands","Olfactory information"]), correctAnswer: "A", explanation: "The dorsal column-medial lemniscal pathway carries fine touch, vibration sense, and proprioception; it decussates in the medulla." },
    { topicId: T["Sensory Pathways"], question: "Where does the anterolateral (spinothalamic) pathway decussate?", options: JSON.stringify(["Spinal cord, within 1-2 segments of entry","Medulla","Pons","Internal capsule"]), correctAnswer: "A", explanation: "The spinothalamic tract crosses the midline in the spinal cord within 1-2 segments above the level where sensory fibers enter — this explains why pain/temperature loss is contralateral." },
    { topicId: T["Sensory Pathways"], question: "An upper motor neuron lesion produces:", options: JSON.stringify(["Spasticity, hyperreflexia, and Babinski sign","Flaccidity, hyporeflexia, and muscle atrophy","Only sensory deficits","Cerebellar ataxia"]), correctAnswer: "A", explanation: "UMN lesions (cortex, internal capsule, brainstem, spinal cord above anterior horn) cause spasticity, hyperreflexia, and positive Babinski due to loss of descending inhibition." },
    { topicId: T["Sensory Pathways"], question: "The thalamus is the relay station for all sensory modalities EXCEPT:", options: JSON.stringify(["Olfaction","Vision","Hearing","Touch"]), correctAnswer: "A", explanation: "Olfaction uniquely bypasses the thalamus — olfactory signals go directly from the olfactory bulb to piriform cortex and limbic structures." },
    { topicId: T["Sensory Pathways"], question: "Which spinal cord level corresponds to the umbilicus dermatome?", options: JSON.stringify(["T10","L1","T4","C8"]), correctAnswer: "A", explanation: "T10 innervates the umbilicus — a clinically useful landmark. T4 is the nipple level, L1 is the inguinal ligament, C6 is the thumb." },
    { topicId: T["Sensory Pathways"], question: "Brown-Séquard syndrome involves hemisection of the spinal cord, causing:", options: JSON.stringify(["Ipsilateral motor/proprioception loss, contralateral pain/temperature loss","Bilateral loss of all modalities below the lesion","Only ipsilateral sensory loss","Only contralateral motor loss"]), correctAnswer: "A", explanation: "Hemisection causes: ipsilateral loss of motor function and proprioception (same side); contralateral loss of pain and temperature (crosses in cord)." },
    { topicId: T["Sensory Pathways"], question: "What is the stretch reflex arc?", options: JSON.stringify(["Ia afferent from muscle spindle → α-motor neuron → same muscle","Golgi tendon organ → interneuron → antagonist muscle","Free nerve ending → dorsal horn → brain","Motor cortex → corticospinal → α-motor neuron"]), correctAnswer: "A", explanation: "The stretch reflex is monosynaptic: muscle spindle Ia afferent directly synapses on α-motor neurons innervating the same muscle, causing it to contract." },
    { topicId: T["Sensory Pathways"], question: "The conus medullaris is located at approximately:", options: JSON.stringify(["L1-L2","C7","T12","S1"]), correctAnswer: "A", explanation: "The spinal cord tapers to the conus medullaris at approximately L1-L2 in adults. Injuries below this point affect the cauda equina, not the cord itself." },
    { topicId: T["Sensory Pathways"], question: "Reciprocal innervation means:", options: JSON.stringify(["Flexor activation simultaneously inhibits extensor muscles","Both flexors and extensors contract together","Left and right limbs receive opposite commands","Sensory and motor signals alternate"]), correctAnswer: "A", explanation: "Reciprocal innervation is a spinal circuit where interneurons ensure that when a flexor contracts, the opposing extensor is simultaneously inhibited, allowing smooth movement." },
    { topicId: T["Sensory Pathways"], question: "Which tract controls voluntary movement of distal limb muscles (fingers, wrists)?", options: JSON.stringify(["Lateral corticospinal tract","Rubrospinal tract","Vestibulospinal tract","Reticulospinal tract"]), correctAnswer: "A", explanation: "The lateral corticospinal tract (decussating at the medullary pyramids) provides the primary cortical control of fine distal limb movements, especially fingers and wrists." },

    // ===== 5. SENSORY SYSTEMS =====
    { topicId: T["Sensory Systems"], question: "The primary visual pathway from retina to cortex is:", options: JSON.stringify(["Retina → LGN (thalamus) → primary visual cortex (V1)","Retina → superior colliculus → parietal cortex","Retina → pulvinar → frontal eye fields","Retina → hypothalamus → visual cortex"]), correctAnswer: "A", explanation: "The retinal-geniculate-striate pathway is the main visual route: retinal ganglion cells → optic nerve → LGN → primary visual cortex (striate/V1)." },
    { topicId: T["Sensory Systems"], question: "Damage to the ventral (WHAT) visual stream causes:", options: JSON.stringify(["Visual object recognition impairment (visual agnosia)","Visuospatial neglect","Inability to perceive motion","Color blindness only"]), correctAnswer: "A", explanation: "The ventral stream (temporal lobe) processes object identity, color, and form. Damage causes visual agnosia, prosopagnosia, and pattern recognition deficits." },
    { topicId: T["Sensory Systems"], question: "Which type of photoreceptor is most concentrated in the fovea?", options: JSON.stringify(["Cones","Rods","Amacrine cells","Bipolar cells"]), correctAnswer: "A", explanation: "The fovea is densely packed with cones (color, high acuity). Rods dominate the periphery and are sensitive to dim light." },
    { topicId: T["Sensory Systems"], question: "The basilar membrane is organized tonotopically such that:", options: JSON.stringify(["High frequencies activate the base, low frequencies activate the apex","Low frequencies activate the base, high frequencies activate the apex","All frequencies activate the middle equally","Amplitude rather than frequency determines location"]), correctAnswer: "A", explanation: "The basilar membrane has a frequency gradient: high frequencies (20,000 Hz) maximally displace the stiff base; low frequencies (20 Hz) travel to the flexible apex." },
    { topicId: T["Sensory Systems"], question: "Gate control theory of pain proposes that:", options: JSON.stringify(["Non-painful sensory input can inhibit pain transmission in the dorsal horn","Pain gates are located in the midbrain","Endorphins directly block peripheral nociceptors","Pain can only be inhibited by opioid drugs"]), correctAnswer: "A", explanation: "Melzack and Wall's gate control theory: large-diameter fiber activity (touch/vibration) activates inhibitory interneurons in the dorsal horn that 'close the gate' to pain signals." },
    { topicId: T["Sensory Systems"], question: "What makes olfaction unique compared to other sensory systems?", options: JSON.stringify(["It bypasses the thalamus and projects directly to limbic cortex","It is the only bilateral sensory system","It uses the fewest receptor types","It is processed exclusively in the temporal lobe"]), correctAnswer: "A", explanation: "Olfaction is the only sensory modality that does not synapse in the thalamus first — it projects directly from the olfactory bulb to piriform cortex, amygdala, and entorhinal cortex." },
    { topicId: T["Sensory Systems"], question: "The otolith organs (saccule and utricle) detect:", options: JSON.stringify(["Linear acceleration and head tilt","Rotational acceleration","High-frequency sound","Proprioception in the inner ear"]), correctAnswer: "A", explanation: "Otolith organs contain calcium carbonate crystals (otoconia) that displace hair cells in response to linear acceleration and gravity (head tilt), providing information about static and dynamic head position." },
    { topicId: T["Sensory Systems"], question: "Prosopagnosia results from damage to:", options: JSON.stringify(["Fusiform face area (temporal-occipital junction, ventral stream)","Primary visual cortex (V1)","Dorsal stream parietal cortex","Frontal eye fields"]), correctAnswer: "A", explanation: "Prosopagnosia (inability to recognize faces) is caused by damage to the fusiform face area in the ventral visual stream at the temporal-occipital junction." },
    { topicId: T["Sensory Systems"], question: "The dorsal (WHERE) visual stream is involved in:", options: JSON.stringify(["Visuospatial processing, movement perception, and action guidance","Object recognition and color processing","Face recognition and emotional expression","Reading and language"]), correctAnswer: "A", explanation: "The dorsal stream (parietal cortex) processes location, motion, and spatial relationships to guide action. Damage causes neglect, optic ataxia, and spatial processing deficits." },
    { topicId: T["Sensory Systems"], question: "Which structure in the auditory pathway is primarily responsible for sound localization?", options: JSON.stringify(["Superior olivary complex","Inferior colliculus","Medial geniculate nucleus","Primary auditory cortex"]), correctAnswer: "A", explanation: "The superior olivary complex (medial superior olive: interaural time differences; lateral superior olive: intensity differences) is the first site of binaural integration for sound localization." },
    { topicId: T["Sensory Systems"], question: "Trichromatic color vision theory proposes:", options: JSON.stringify(["Three cone types with different peak sensitivities combine to produce color perception","Color is encoded as opponent pairs","Only rods contribute to color vision","Color is processed exclusively in V4"]), correctAnswer: "A", explanation: "Young-Helmholtz trichromatic theory: short (blue), medium (green), and long (red) wavelength cones combine their outputs to produce the full range of perceived colors." },
    { topicId: T["Sensory Systems"], question: "Lateral inhibition in the retina serves to:", options: JSON.stringify(["Enhance contrast and edge detection","Increase overall light sensitivity","Expand the visual field","Enable color constancy"]), correctAnswer: "A", explanation: "Horizontal cells create lateral inhibition in the retina — they inhibit neighboring photoreceptors and bipolar cells, sharpening contrast and creating Mach band illusions." },
    { topicId: T["Sensory Systems"], question: "The supplementary motor area (SMA) is active during:", options: JSON.stringify(["Motor imagery and planning of complex sequences before execution","Execution of simple reflexive movements","Processing of sensory feedback only","Language production"]), correctAnswer: "A", explanation: "The SMA becomes active during mental rehearsal of movements and planning of complex movement sequences, even before the movement begins." },
    { topicId: T["Sensory Systems"], question: "Akinetopsia is caused by damage to:", options: JSON.stringify(["Area MT/V5 in the medial temporal lobe","The fusiform face area","V1 (primary visual cortex)","The superior colliculus"]), correctAnswer: "A", explanation: "Akinetopsia (inability to perceive visual motion) results from damage to area MT/V5 in the medial temporal lobe, a motion-selective cortical region." },
    { topicId: T["Sensory Systems"], question: "Blindsight is best explained by:", options: JSON.stringify(["Residual subcortical visual processing (superior colliculus/pulvinar) without conscious awareness","Recovery of V1 function over time","Intact dorsal stream alone","Neuroplastic reorganization of V2"]), correctAnswer: "A", explanation: "After V1 destruction causing cortical blindness, some patients can still detect and respond to stimuli in the blind field via subcortical routes (superior colliculus → pulvinar → extrastriate cortex) without conscious vision." },

    // ===== 6. LIMBIC SYSTEM & MOTIVATION =====
    { topicId: T["Limbic System & Motivation"], question: "Which structure is the brain's primary biological clock?", options: JSON.stringify(["Suprachiasmatic nucleus (SCN)","Pineal gland","Amygdala","Anterior cingulate cortex"]), correctAnswer: "A", explanation: "The SCN in the hypothalamus is the master circadian pacemaker; it generates endogenous rhythms and synchronizes them to external light cues." },
    { topicId: T["Limbic System & Motivation"], question: "Leptin's primary effect on appetite is to:", options: JSON.stringify(["Suppress appetite and increase metabolic rate","Stimulate appetite like ghrelin","Regulate sleep cycles","Control water retention"]), correctAnswer: "A", explanation: "Leptin is secreted by adipose tissue proportionally to fat stores. It acts on the hypothalamus to suppress appetite, reduce food intake, and increase energy expenditure." },
    { topicId: T["Limbic System & Motivation"], question: "The mesolimbic dopamine system is primarily associated with:", options: JSON.stringify(["Reward, wanting, and motivational salience","Fine motor coordination","Explicit memory formation","Autonomic regulation"]), correctAnswer: "A", explanation: "The mesolimbic pathway (VTA → nucleus accumbens, amygdala, hippocampus) is the core reward system; it signals motivational salience and drives wanting behavior." },
    { topicId: T["Limbic System & Motivation"], question: "What does 'wanting' vs 'liking' distinction mean in reward neuroscience?", options: JSON.stringify(["Wanting (incentive motivation) and liking (hedonic experience) are dissociable processes","Wanting and liking always occur together","Liking depends on dopamine; wanting on serotonin","Both are mediated by the same nucleus accumbens circuits"]), correctAnswer: "A", explanation: "Berridge's model: 'wanting' (incentive salience, dopamine-driven) and 'liking' (hedonic pleasure, opioid-driven) can be separated — addicts may intensely want a drug without liking it." },
    { topicId: T["Limbic System & Motivation"], question: "Ghrelin is secreted by the __ and its main effect is to __:", options: JSON.stringify(["Stomach; stimulate appetite","Adipose tissue; suppress appetite","Liver; regulate blood glucose","Pancreas; promote fat storage"]), correctAnswer: "A", explanation: "Ghrelin is a stomach hormone that rises before meals and falls after eating; it stimulates appetite by acting on the lateral hypothalamus and orexin neurons." },
    { topicId: T["Limbic System & Motivation"], question: "The nucleus accumbens rostral shell mediates:", options: JSON.stringify(["Appetitive/approach behavior","Avoidance and aversion","Memory consolidation","Pain modulation"]), correctAnswer: "A", explanation: "The rostral nucleus accumbens shell is associated with appetitive behaviors and reward approach, while the caudal shell is associated with aversive/avoidance responses." },
    { topicId: T["Limbic System & Motivation"], question: "Anorexia nervosa is neurologically associated with:", options: JSON.stringify(["Mesolimbic dopamine dysregulation, low serotonin, and anterior insula hyperactivity","Hyperactive reward circuits and excessive dopamine","Only hypothalamic dysfunction","Brainstem lesions affecting satiety"]), correctAnswer: "A", explanation: "Anorexia involves anhedonia (dopamine reward deficit), low serotonin, and hyperactive anterior insula that distorts body image — food is perceived as threatening rather than rewarding." },
    { topicId: T["Limbic System & Motivation"], question: "Sensory-specific satiety refers to:", options: JSON.stringify(["Decreased pleasure from a specific food while appetite for other foods remains","General fullness that suppresses all appetite","A taste receptor adaptation to sweet flavors","The brain's inability to process more than one flavor"]), correctAnswer: "A", explanation: "Sensory-specific satiety: as you eat one food, its reward value decreases while appetite for other foods remains — this promotes dietary variety and was evolutionarily adaptive." },
    { topicId: T["Limbic System & Motivation"], question: "The positive-incentive perspective on eating proposes:", options: JSON.stringify(["We eat primarily for anticipated pleasure, not just to correct energy deficits","Only hunger and energy deficit drive eating","Eating is purely a homeostatic process","Appetite is entirely determined by blood glucose"]), correctAnswer: "A", explanation: "The positive-incentive perspective argues that the anticipation of pleasure (incentive value of food) is the primary driver of eating, not deprivation alone." },
    { topicId: T["Limbic System & Motivation"], question: "Prader-Willi syndrome is characterized by:", options: JSON.stringify(["Insatiable hunger, obesity, and cognitive impairment due to chromosome 15 defect","Inability to feel pain","Excessive weight loss and anorexia","Absent hunger signals"]), correctAnswer: "A", explanation: "Prader-Willi syndrome (chromosome 15q11-q13 defect) causes hyperphagia (insatiable hunger), obesity, intellectual disability, and low muscle tone." },

    // ===== 7. SLEEP & CIRCADIAN RHYTHMS =====
    { topicId: T["Sleep & Circadian Rhythms"], question: "The suprachiasmatic nucleus (SCN) receives light input via:", options: JSON.stringify(["Intrinsically photosensitive retinal ganglion cells (ipRGCs) containing melanopsin","Rod photoreceptors","The optic radiation","The lateral geniculate nucleus"]), correctAnswer: "A", explanation: "The retinohypothalamic tract carries light information from ipRGCs (melanopsin-containing ganglion cells, especially sensitive to blue light) directly to the SCN." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "REM sleep is characterized by:", options: JSON.stringify(["Rapid eye movements, vivid dreaming, and muscle atonia","Delta waves and deep physical restoration","Sleep spindles and K-complexes","Reduced brain metabolic activity"]), correctAnswer: "A", explanation: "REM sleep features rapid eye movements, vivid dreaming, near-complete skeletal muscle atonia (preventing acting out dreams), and an EEG pattern similar to waking." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "N3 (slow-wave) sleep is characterized by:", options: JSON.stringify(["Delta waves (< 4 Hz) and deep physical restoration","Rapid eye movements","Sleep spindles and K-complexes","EEG similar to waking"]), correctAnswer: "A", explanation: "N3 is deep slow-wave sleep with high-amplitude delta waves; it is the most restorative stage for physical recovery and is important for declarative memory consolidation." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "Melatonin is secreted by the __ in response to __:", options: JSON.stringify(["Pineal gland; darkness","SCN; light","Anterior pituitary; cortisol decrease","Hippocampus; REM sleep"]), correctAnswer: "A", explanation: "The SCN signals the pineal gland to secrete melatonin in darkness; light (especially blue light) suppresses melatonin secretion via the retinohypothalamic tract." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "Benzodiazepines' effect on sleep architecture includes:", options: JSON.stringify(["Reduced N3 slow-wave sleep and reduced REM","Increased REM and delta sleep","No effect on sleep stage distribution","Only reduction in sleep onset latency without affecting stages"]), correctAnswer: "A", explanation: "Benzodiazepines increase N2 sleep but suppress N3 (slow-wave) and REM sleep — useful for short-term insomnia but disrupting overall sleep quality and memory consolidation." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "The human endogenous circadian period is:", options: JSON.stringify(["Slightly longer than 24 hours (~24.2 hours)","Exactly 24.0 hours","About 25.5 hours","12 hours"]), correctAnswer: "A", explanation: "The endogenous period of the human circadian clock is slightly longer than 24 hours; daily light exposure entrains it to the precise 24-hour environmental cycle." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "Sleep's role in memory consolidation involves:", options: JSON.stringify(["Slow-wave sleep consolidating declarative memories; REM supporting procedural/emotional memories","REM only for all memory types","No relationship between sleep stages and memory types","Only waking learning matters; sleep is passive"]), correctAnswer: "A", explanation: "Slow-wave sleep facilitates hippocampal-cortical transfer of declarative memories; REM sleep is associated with procedural and emotional memory processing." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is a zeitgeber?", options: JSON.stringify(["An external environmental cue that synchronizes the circadian clock","An internal signal generated by the SCN","A sleep disorder treatment","A measure of sleep depth"]), correctAnswer: "A", explanation: "Zeitgeber (German for 'time giver') is any external cue that entrains the circadian clock — light is most powerful, followed by food timing, social interaction, and exercise." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "Jet lag symptoms arise from:", options: JSON.stringify(["Misalignment between the internal circadian clock and the external environment","Sleep deprivation only","Dehydration during air travel","Pressure changes in aircraft"]), correctAnswer: "A", explanation: "Jet lag results from rapid transmeridian travel that shifts the environmental light cycle faster than the SCN can reset, creating circadian misalignment that takes days to weeks to resolve." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "Which of the following does the circadian rhythm NOT regulate?", options: JSON.stringify(["Visual acuity during the day","Body temperature","Cortisol secretion","Drug sensitivity"]), correctAnswer: "A", explanation: "The circadian system regulates body temperature (peaks in late afternoon), cortisol (peaks in early morning), and drug sensitivity — but not baseline visual acuity itself." },

    // ===== 8. ENDOCRINE SYSTEM & REPRODUCTION =====
    { topicId: T["Endocrine System & Reproduction"], question: "Organizational hormone effects differ from activational effects in that they:", options: JSON.stringify(["Are permanent and occur during development, shaping anatomy","Are reversible and occur in adulthood","Only involve sex hormones","Affect only external sex organs"]), correctAnswer: "A", explanation: "Organizational effects occur during critical developmental periods, permanently shaping neural and anatomical structures. Activational effects are temporary and trigger specific adult behaviors." },
    { topicId: T["Endocrine System & Reproduction"], question: "The SRY gene on the Y chromosome triggers:", options: JSON.stringify(["Testicular development and male sexual differentiation","Ovarian development","Estrogen production","Growth hormone release"]), correctAnswer: "A", explanation: "The SRY (sex-determining region of Y) gene produces SRY protein that causes bipotential gonads to differentiate into testes, initiating the cascade of male sexual development." },
    { topicId: T["Endocrine System & Reproduction"], question: "Androgen Insensitivity Syndrome (AIS) results in:", options: JSON.stringify(["XY individuals with testes but female-typical external appearance due to absent androgen receptors","Female genitalia from estrogen excess","Absence of both sets of internal organs","Turner's syndrome phenotype"]), correctAnswer: "A", explanation: "In AIS, androgen receptors are non-functional; XY individuals have testes (producing testosterone and AMH) but androgens cannot masculinize — resulting in female-typical external genitalia." },
    { topicId: T["Endocrine System & Reproduction"], question: "Oxytocin is produced by the __ and released by the __:", options: JSON.stringify(["Hypothalamus; posterior pituitary","Anterior pituitary; bloodstream","Adrenal cortex; adrenal medulla","Pineal gland; direct neural connection"]), correctAnswer: "A", explanation: "Oxytocin is synthesized in hypothalamic nuclei (paraventricular, supraoptic) and transported to the posterior pituitary for release into the bloodstream." },
    { topicId: T["Endocrine System & Reproduction"], question: "Steroid hormones are derived from __ and are characterized by __:", options: JSON.stringify(["Cholesterol; fat-solubility and nuclear receptor action","Tyrosine; water solubility","Amino acids; membrane receptor binding","Glucose; rapid membrane effects"]), correctAnswer: "A", explanation: "Steroid hormones (sex steroids, cortisol, aldosterone) are synthesized from cholesterol; their fat-solubility allows them to cross cell membranes and bind nuclear receptors to alter gene expression." },
    { topicId: T["Endocrine System & Reproduction"], question: "The Müllerian system develops into female internal organs:", options: JSON.stringify(["In the absence of testosterone and anti-Müllerian hormone (AMH)","Only when estrogen is present","In the presence of high testosterone","Only if the XX genotype is present"]), correctAnswer: "A", explanation: "The Müllerian system (→ uterus, fallopian tubes, upper vagina) is the default pathway that develops unless testosterone and AMH are present to suppress it and develop the Wolffian system." },
    { topicId: T["Endocrine System & Reproduction"], question: "5-Alpha Reductase Deficiency results in:", options: JSON.stringify(["XY individuals with female-typical external genitalia at birth who masculinize at puberty","Female external and internal genitalia with XX genotype","Complete male development without any ambiguity","AIS-like presentation but with functional androgen receptors"]), correctAnswer: "A", explanation: "Without 5-alpha reductase, XY individuals cannot convert testosterone to DHT (needed for external male genitalia); born appearing female but masculinize significantly at puberty as testosterone rises." },
    { topicId: T["Endocrine System & Reproduction"], question: "Vasopressin (ADH) primary functions include:", options: JSON.stringify(["Water retention in kidneys and social bonding behaviors","Stimulating hunger","Triggering uterine contractions","Regulating thyroid function"]), correctAnswer: "A", explanation: "Vasopressin (ADH) acts on kidney tubules to promote water reabsorption; it also influences social bonding, aggression, and stress responses in the brain." },
    { topicId: T["Endocrine System & Reproduction"], question: "Turner's Syndrome (45,X) is characterized by:", options: JSON.stringify(["Single X chromosome, no functional gonads, short stature, female-typical development","Two X chromosomes plus one Y","Male external genitalia with no internal organs","Insensitivity to androgens"]), correctAnswer: "A", explanation: "Turner's syndrome (monosomy X) results in non-functional streak gonads, short stature, infertility, and female-typical development without hormone replacement." },
    { topicId: T["Endocrine System & Reproduction"], question: "The hypothalamo-pituitary-gonadal axis operates via:", options: JSON.stringify(["Negative feedback — gonadal steroids inhibit GnRH and gonadotropin release","Positive feedback only","No feedback — it is an open system","Direct neural control without hormones"]), correctAnswer: "A", explanation: "The HPG axis uses primarily negative feedback: gonadal steroids (testosterone, estradiol) inhibit GnRH from the hypothalamus and LH/FSH from the anterior pituitary, maintaining hormonal homeostasis." },

    // ===== 9. PSYCHOPHARMACOLOGY =====
    { topicId: T["Psychopharmacology"], question: "A boxed warning on an FDA drug label indicates:", options: JSON.stringify(["The most serious risk warnings associated with the drug","A minor cautionary note","Off-label use recommendations","A warning about drug interactions only"]), correctAnswer: "A", explanation: "A boxed (black box) warning is the FDA's strongest safety warning, indicating serious or life-threatening risks — e.g., suicidality risk with antidepressants in young patients." },
    { topicId: T["Psychopharmacology"], question: "What is the primary mechanism of MAO inhibitors (MAOIs)?", options: JSON.stringify(["Block the enzyme that degrades monoamines, increasing DA/5-HT/NE","Block dopamine D2 receptors","Block serotonin reuptake only","Potentiate GABA-A receptor activity"]), correctAnswer: "A", explanation: "MAOIs prevent monoamine oxidase from degrading dopamine, serotonin, and norepinephrine, increasing their levels; require tyramine-free diet to avoid hypertensive crisis." },
    { topicId: T["Psychopharmacology"], question: "Esketamine (Spravato) treats depression by targeting:", options: JSON.stringify(["NMDA (glutamate) receptors via nasal spray","SERT (serotonin transporter)","Dopamine D2 receptors","GABA-B receptors"]), correctAnswer: "A", explanation: "Esketamine is an NMDA receptor antagonist approved for treatment-resistant depression; unlike traditional antidepressants, it provides rapid relief (within hours) by modulating glutamate transmission." },
    { topicId: T["Psychopharmacology"], question: "Second-generation antipsychotics (SGAs) differ from first-generation (FGAs) by:", options: JSON.stringify(["Blocking both D2 and 5-HT2A receptors, causing fewer extrapyramidal symptoms","Blocking only D2 receptors with higher potency","Having no metabolic side effects","Being exclusively partial agonists"]), correctAnswer: "A", explanation: "SGAs (atypical antipsychotics) block both D2 and serotonin 5-HT2A receptors, reducing extrapyramidal side effects compared to FGAs, but carry metabolic risks (weight gain, diabetes)." },
    { topicId: T["Psychopharmacology"], question: "The exogenous field in neuronal signaling refers to:", options: JSON.stringify(["Medications, drugs, toxins, and hormones acting on the synaptic field","Endogenous neurotransmitter signaling","Glial-mediated modulation","Action potential propagation along the axon"]), correctAnswer: "A", explanation: "The exogenous (E-W) field comprises external substances (medications, recreational drugs, toxins) that act at various synaptic target sites to modify neurotransmission." },
    { topicId: T["Psychopharmacology"], question: "Off-label prescribing refers to:", options: JSON.stringify(["Using an FDA-approved drug for an indication, population, or dose not specified in labeling","Using a non-FDA-approved drug","Using a drug without monitoring","Prescribing generic medications"]), correctAnswer: "A", explanation: "Off-label prescribing is legal and common — once a drug is approved by the FDA, clinicians may prescribe it for any purpose they deem clinically appropriate, even if not listed in the labeling." },
    { topicId: T["Psychopharmacology"], question: "Long-acting injectable (LAI) antipsychotics are primarily used to:", options: JSON.stringify(["Improve medication adherence in patients with chronic psychotic disorders","Achieve faster onset than oral medications","Treat acute psychotic episodes","Reduce side effects compared to oral formulations"]), correctAnswer: "A", explanation: "LAIs (depot formulations given every 2-4 weeks) address non-adherence — a major cause of relapse in schizophrenia — by eliminating the need for daily oral medications." },
    { topicId: T["Psychopharmacology"], question: "Pharmacokinetics describes:", options: JSON.stringify(["What the body does to the drug (ADME)","What the drug does to the body","The drug's mechanism of action","The receptor binding profile"]), correctAnswer: "A", explanation: "Pharmacokinetics (ADME): Absorption, Distribution, Metabolism, Excretion — how the body processes the drug. Pharmacodynamics describes the drug's effects on the body." },
    { topicId: T["Psychopharmacology"], question: "Voltage-gated ion channels are targeted by which drug class?", options: JSON.stringify(["Anticonvulsants/antiepileptics (e.g., phenytoin)","SSRIs","Benzodiazepines","Typical antipsychotics"]), correctAnswer: "A", explanation: "Anticonvulsants like phenytoin and carbamazepine target voltage-gated Na+ or Ca2+ channels to reduce neuronal excitability, preventing seizure spread." },
    { topicId: T["Psychopharmacology"], question: "The majority of clinical psychologists' involvement with psychopharmacology is:", options: JSON.stringify(["Providing information — psychoeducation, assessment, and consultation","Prescribing medications","No involvement at all","Administering IV medications"]), correctAnswer: "A", explanation: "Most clinical psychologists are in the 'providing information' role — they educate patients, assess responses, consult with prescribers, and collaborate — but do not prescribe (except in a few U.S. states/military)." },

    // ===== 10. PSYCHOLOGICAL DISORDERS =====
    { topicId: T["Psychological Disorders"], question: "Which duration criterion distinguishes Schizophrenia from Schizophreniform Disorder?", options: JSON.stringify(["Schizophrenia requires 6+ months; Schizophreniform is 1-6 months","Schizophrenia requires only 1 month; Schizophreniform requires 6 months","Both require identical duration","Duration is irrelevant to the distinction"]), correctAnswer: "A", explanation: "Schizophreniform disorder has the same symptoms as schizophrenia but duration of 1-6 months; schizophrenia requires at least 6 months of symptoms including prodrome/residual phases." },
    { topicId: T["Psychological Disorders"], question: "In Bipolar I disorder, a manic episode must last at least:", options: JSON.stringify(["1 week (or any duration if hospitalization required)","4 days","2 weeks","1 month"]), correctAnswer: "A", explanation: "A manic episode in Bipolar I must last at least 1 week, or any duration if so severe that hospitalization is required to prevent harm." },
    { topicId: T["Psychological Disorders"], question: "The hallmark distinction of Schizoaffective Disorder is:", options: JSON.stringify(["Psychotic symptoms must occur for 2+ weeks WITHOUT a concurrent mood episode","Only mood symptoms with psychotic features during mood episodes","Continuous cycling between depression and mania without psychosis","Schizophrenia plus ADHD"]), correctAnswer: "A", explanation: "Schizoaffective requires schizophrenic symptoms occurring for at least 2 weeks in the absence of major mood episodes — this distinguishes it from a mood disorder with psychotic features." },
    { topicId: T["Psychological Disorders"], question: "Dissociative Identity Disorder (DID) was previously called:", options: JSON.stringify(["Multiple Personality Disorder","Borderline Personality Disorder","Fugue State","Conversion Disorder"]), correctAnswer: "A", explanation: "DID was formerly known as Multiple Personality Disorder; it involves two or more distinct personality states with amnesia for events occurring in alternate states." },
    { topicId: T["Psychological Disorders"], question: "In Depersonalization/Derealization Disorder, reality testing is:", options: JSON.stringify(["Intact — the person knows the experience is unreal","Impaired — the person cannot distinguish reality","Absent entirely","Only present during episodes"]), correctAnswer: "A", explanation: "A key feature of depersonalization/derealization disorder is that reality testing remains intact throughout — patients know they are experiencing unusual symptoms but cannot control them." },
    { topicId: T["Psychological Disorders"], question: "Disruptive Mood Dysregulation Disorder (DMDD) is diagnosed in:", options: JSON.stringify(["Children ages 6-18 with onset before age 10","Adults with persistent irritability","Adolescents only after puberty","Any age with 2+ weeks of low mood"]), correctAnswer: "A", explanation: "DMDD criteria include severe/recurrent temper outbursts 3+ times/week, diagnosed only in ages 6-18 with symptom onset before age 10, present for 12+ months in multiple settings." },
    { topicId: T["Psychological Disorders"], question: "Negative symptoms of schizophrenia include:", options: JSON.stringify(["Avolition, flat affect, alogia, anhedonia, and social withdrawal","Hallucinations and delusions","Disorganized speech","Agitation and bizarre behavior"]), correctAnswer: "A", explanation: "Negative symptoms represent diminished or absent normal functions: avolition (motivation loss), flat affect, alogia (poverty of speech), anhedonia, and asociality." },
    { topicId: T["Psychological Disorders"], question: "The categorical vs dimensional debate in psychopathology centers on:", options: JSON.stringify(["Whether disorders have clear boundaries or exist on a continuum","Whether biology or environment causes disorders","Whether diagnosis or treatment should come first","Whether the DSM or ICD should be used"]), correctAnswer: "A", explanation: "Categorical models impose discrete diagnostic boundaries; dimensional models recognize that symptoms exist on continua and overlap across disorders — evidence supports elements of both approaches." },
    { topicId: T["Psychological Disorders"], question: "Dissociative Amnesia typically involves:", options: JSON.stringify(["Retrograde amnesia localized around a traumatic event","Anterograde amnesia for all new memories","Global amnesia with no retained memory","Procedural memory loss only"]), correctAnswer: "A", explanation: "Dissociative amnesia typically involves inability to recall autobiographical information (retrograde) around a specific traumatic or stressful event, inconsistent with ordinary forgetting." },
    { topicId: T["Psychological Disorders"], question: "Premenstrual Dysphoric Disorder (PMDD) symptoms occur:", options: JSON.stringify(["Exclusively in the luteal phase of the menstrual cycle","Throughout the entire month","Only during the follicular phase","Continuously without cyclical pattern"]), correctAnswer: "A", explanation: "PMDD symptoms (depression, anxiety, lability, irritability) appear in the luteal phase (after ovulation) and resolve within a few days of menstruation — cyclical timing is diagnostic." },
    { topicId: T["Psychological Disorders"], question: "What is formal thought disorder?", options: JSON.stringify(["Disorganized thinking manifested as disorganized speech (derailment, tangentiality, incoherence)","Delusional beliefs about thought insertion","Impaired working memory","Auditory hallucinations about thoughts"]), correctAnswer: "A", explanation: "Formal thought disorder is a disturbance in the form/organization of thinking, manifested as disorganized speech patterns: derailment, tangentiality, incoherence, circumstantiality, clanging." },

    // ===== 11. PERSONALITY DISORDERS =====
    { topicId: T["Personality Disorders"], question: "Criterion A for any personality disorder requires dysfunction in at least 2 of the following areas:", options: JSON.stringify(["Cognition, affectivity, interpersonal functioning, or impulse control","Mood, sleep, appetite, or social relationships","Perception, memory, language, or reasoning","Attention, motivation, self-care, or work"]), correctAnswer: "A", explanation: "DSM-5 Criterion A for personality disorders requires the pattern to manifest in at least 2 of: cognition (ways of perceiving self/others), affectivity, interpersonal functioning, or impulse control." },
    { topicId: T["Personality Disorders"], question: "Schizotypal PD is distinguished from Schizoid PD by:", options: JSON.stringify(["Magical thinking, odd perceptual experiences, and eccentric speech in Schizotypal","Greater social isolation in Schizotypal","Presence of psychosis in Schizotypal","Schizoid includes paranoid features; Schizotypal does not"]), correctAnswer: "A", explanation: "Schizotypal PD involves cognitive/perceptual distortions (magical thinking, ideas of reference, odd experiences) and eccentric behavior, while Schizoid involves purely social detachment without these features." },
    { topicId: T["Personality Disorders"], question: "Borderline Personality Disorder requires how many of 9 criteria?", options: JSON.stringify(["5 or more","All 9","At least 3","Any 2"]), correctAnswer: "A", explanation: "BPD requires 5 or more of 9 criteria: abandonment fears, unstable relationships, identity disturbance, impulsivity, suicidal behavior, affective instability, emptiness, anger, and paranoid ideation." },
    { topicId: T["Personality Disorders"], question: "What is 'splitting' in Borderline PD?", options: JSON.stringify(["Seeing people as all-good or all-bad with no integration","Dissociating during stress","Creating multiple personalities","A cognitive distortion about time"]), correctAnswer: "A", explanation: "Splitting is a primitive defense mechanism in BPD: people and situations are perceived as either idealized (all-good) or devalued (all-bad), rapidly shifting between extremes." },
    { topicId: T["Personality Disorders"], question: "Antisocial PD requires that conduct disorder symptoms were present:", options: JSON.stringify(["Before age 15","Before age 18","Before age 10","At any age"]), correctAnswer: "A", explanation: "For antisocial PD, DSM requires a history of conduct disorder symptoms before age 15, plus the individual must be at least 18 years old at time of diagnosis." },
    { topicId: T["Personality Disorders"], question: "What makes personality disorders 'ego-syntonic'?", options: JSON.stringify(["The person experiences their traits as natural extensions of themselves, not symptoms","The person has insight into their disorder","The person seeks treatment readily","Symptoms are congruent with external reality"]), correctAnswer: "A", explanation: "Ego-syntonic means the personality traits feel natural and comfortable to the individual — they don't perceive them as problems, making insight and motivation for change difficult to achieve." },
    { topicId: T["Personality Disorders"], question: "Paranoid Personality Disorder is characterized by:", options: JSON.stringify(["Pervasive distrust and suspiciousness — suspects exploitation, holds grudges, perceives attacks on character","Odd magical beliefs and social isolation","Dramatic emotional swings and self-harm","Grandiosity and need for admiration"]), correctAnswer: "A", explanation: "Paranoid PD involves pervasive, unwarranted suspiciousness: suspects others of exploitation, reads hidden meaning into remarks, holds grudges, and suspects fidelity without evidence." },
    { topicId: T["Personality Disorders"], question: "Which cluster do Avoidant, Dependent, and OC Personality Disorders belong to?", options: JSON.stringify(["Cluster C (anxious/fearful)","Cluster A (odd/eccentric)","Cluster B (dramatic/emotional)","No cluster — they stand alone"]), correctAnswer: "A", explanation: "Cluster C ('anxious or fearful'): Avoidant (fear of rejection/criticism), Dependent (excessive need for care/decisions made by others), and OCPD (rigidity, perfectionism, control)." },
    { topicId: T["Personality Disorders"], question: "Narcissistic Personality Disorder requires:", options: JSON.stringify(["Grandiosity, need for admiration, and lack of empathy with 5+ of 9 criteria","Only grandiosity — no other criteria needed","Presence since childhood, not adulthood","Comorbid antisocial traits always"]), correctAnswer: "A", explanation: "NPD requires a pervasive pattern of grandiosity, excessive need for admiration, and lack of empathy, with 5+ of 9 specific criteria present across contexts beginning by early adulthood." },
    { topicId: T["Personality Disorders"], question: "What does it mean that personality disorders are 'contagious' in clinical settings?", options: JSON.stringify(["They evoke strong complementary reactions in clinicians and others, reinforcing dysfunctional patterns","They literally spread from patient to therapist","Patients infect other patients","Symptoms worsen in group settings"]), correctAnswer: "A", explanation: "Personality disorder traits evoke characteristic reactions in others — e.g., a patient using passive-aggressive behavior pulls for resentment from the clinician, who may then act in ways that reinforce the pattern." },

    // ===== 12. ADHD & MEDICATIONS =====
    { topicId: T["ADHD & Medications"], question: "ADHD symptoms must have been present before age:", options: JSON.stringify(["12","18","6","5"]), correctAnswer: "A", explanation: "DSM-5 requires that several ADHD symptoms were present before age 12, though diagnosis can occur at any age if symptoms meet other criteria." },
    { topicId: T["ADHD & Medications"], question: "Methylphenidate's primary mechanism of action is:", options: JSON.stringify(["Blocking dopamine and norepinephrine reuptake transporters","Stimulating dopamine synthesis","Blocking D2 receptors","Increasing serotonin availability"]), correctAnswer: "A", explanation: "Methylphenidate blocks the DAT and NET transporters, preventing reuptake of dopamine and norepinephrine, increasing their availability in prefrontal synapses." },
    { topicId: T["ADHD & Medications"], question: "Lisdexamfetamine (Vyvanse) is a prodrug, meaning:", options: JSON.stringify(["It is inactive until metabolized in the body to active d-amphetamine","It has faster onset than regular amphetamine","It does not affect dopamine","It is a non-stimulant"]), correctAnswer: "A", explanation: "Vyvanse is enzymatically cleaved in red blood cells to release active d-amphetamine; this prodrug design produces smoother onset/offset and lower abuse potential than immediate-release amphetamine." },
    { topicId: T["ADHD & Medications"], question: "Atomoxetine (Strattera) differs from stimulants in that it:", options: JSON.stringify(["Selectively inhibits norepinephrine reuptake; non-stimulant; slower onset","Is a dopamine precursor","Has immediate effects like methylphenidate","Is a Schedule II controlled substance"]), correctAnswer: "A", explanation: "Atomoxetine is a selective NRI (not a stimulant, not controlled); it takes several weeks for full effect, has no abuse potential, and may have off-label benefits for depression." },
    { topicId: T["ADHD & Medications"], question: "The Concerta (OROS methylphenidate) delivery system uses:", options: JSON.stringify(["Osmotic pump technology for sustained release throughout the day","A skin patch","Delayed release activated at bedtime","Prodrug metabolism in the liver"]), correctAnswer: "A", explanation: "Concerta uses OROS (Osmotic Release Oral System) technology — water enters the capsule, expanding a polymer that pushes methylphenidate out at a controlled rate over ~12 hours." },
    { topicId: T["ADHD & Medications"], question: "What are IEP and 504 plans?", options: JSON.stringify(["Educational accommodations for students with disabilities; IEP (individualized education program) and 504 (non-special education accommodations)","Medication management protocols","Behavioral rating scales","Insurance approval documents"]), correctAnswer: "A", explanation: "IEPs (special education, Individuals with Disabilities Education Act) provide individualized specialized instruction; 504 plans (Rehabilitation Act) provide accommodations/modifications without special education placement." },
    { topicId: T["ADHD & Medications"], question: "Which brain circuit is primarily dysregulated in ADHD?", options: JSON.stringify(["Frontal-subcortical-cerebellar catecholaminergic circuits","Hippocampal-entorhinal memory circuits","Amygdala-prefrontal emotion regulation circuits","Primary sensory processing circuits"]), correctAnswer: "A", explanation: "ADHD involves dysregulation of frontal-subcortical (basal ganglia) and cerebellar catecholaminergic circuits, leading to impaired executive function, attention regulation, and impulse control." },
    { topicId: T["ADHD & Medications"], question: "Daytrana is a unique methylphenidate formulation because it:", options: JSON.stringify(["Is a transdermal patch that can be removed to shorten effect duration","Is taken at bedtime for next-day effect","Is a nasal spray","Is a liquid formulation only"]), correctAnswer: "A", explanation: "Daytrana is a methylphenidate transdermal patch; its benefit is that it can be removed early if the patient needs to sleep sooner than expected, allowing flexible duration management." },
    { topicId: T["ADHD & Medications"], question: "Which nonstimulant ADHD medication modulates serotonergic activity and was approved more recently?", options: JSON.stringify(["Viloxazine (Qelbree)","Atomoxetine (Strattera)","Guanfacine (Intuniv)","Clonidine (Kapvay)"]), correctAnswer: "A", explanation: "Viloxazine (Qelbree) modulates serotonergic activity and was FDA-approved more recently; however, evidence does not show a clear advantage over atomoxetine for most patients." },
    { topicId: T["ADHD & Medications"], question: "Common side effects of ADHD stimulant medications include:", options: JSON.stringify(["Insomnia, appetite suppression, elevated blood pressure, and growth suppression","Sedation, weight gain, and metabolic syndrome","Hallucinations and mania in all patients","Diarrhea and increased appetite"]), correctAnswer: "A", explanation: "Stimulant side effects: insomnia (especially if taken late), reduced appetite (can suppress growth in children), elevated heart rate/BP, and rarely cardiac concerns — monitoring is essential." },

    // ===== 13. LANGUAGE PROCESSING & APHASIA =====
    { topicId: T["Language Processing & Aphasia"], question: "Broca's aphasia is characterized by:", options: JSON.stringify(["Non-fluent, agrammatic speech with relatively preserved comprehension","Fluent jargon speech with impaired comprehension","Impaired repetition with intact comprehension","Normal speech with only word-finding difficulty"]), correctAnswer: "A", explanation: "Broca's aphasia: non-fluent, effortful, telegraphic/agrammatic speech; comprehension relatively preserved; repetition and naming impaired; dysarthria and dysprosody common." },
    { topicId: T["Language Processing & Aphasia"], question: "The hallmark feature of Conduction Aphasia is:", options: JSON.stringify(["Severely impaired repetition despite relatively intact comprehension and fluency","Non-fluent speech with poor comprehension","Fluent speech with no other deficits","Only naming difficulty"]), correctAnswer: "A", explanation: "Conduction aphasia's defining feature is disproportionately impaired repetition compared to relatively spared fluency and comprehension; caused by arcuate fasciculus disconnection." },
    { topicId: T["Language Processing & Aphasia"], question: "Wernicke's aphasia is characterized by:", options: JSON.stringify(["Fluent, nonsensical speech (jargon) with severely impaired comprehension","Non-fluent, effortful speech with good comprehension","Impaired repetition only","Good comprehension but word-finding difficulty"]), correctAnswer: "A", explanation: "Wernicke's aphasia: fluent output with paraphasias and neologisms but severely impaired comprehension, repetition, naming, reading, and writing; lesion in posterior superior temporal gyrus." },
    { topicId: T["Language Processing & Aphasia"], question: "Chomsky's concept of 'universal grammar' proposes:", options: JSON.stringify(["Children are born with an innate language acquisition device that includes fundamental grammatical rules","Language is entirely learned from the environment","Grammar differs fundamentally across all languages","Adults learn grammar better than children"]), correctAnswer: "A", explanation: "Chomsky proposed that humans are born with an innate Language Acquisition Device (LAD) containing universal grammar — this explains why children acquire language rapidly without explicit instruction." },
    { topicId: T["Language Processing & Aphasia"], question: "The phonemic restoration effect demonstrates:", options: JSON.stringify(["Top-down processing — listeners use context to fill in missing speech sounds","Bottom-up processing dominates speech perception","Categorical perception of phonemes","The independence of speech from semantic context"]), correctAnswer: "A", explanation: "The phonemic restoration effect: listeners perceive a phoneme replaced by noise as if it were present, demonstrating that top-down lexical and contextual knowledge influences speech perception." },
    { topicId: T["Language Processing & Aphasia"], question: "Anomic aphasia is best described as:", options: JSON.stringify(["Non-localizing aphasia with preserved repetition/comprehension and impaired word-finding","Severe comprehension impairment","Non-fluent speech with agrammatism","Fluent jargon speech"]), correctAnswer: "A", explanation: "Anomic aphasia: circumlocutions and word-finding pauses (e.g., 'the thing you use to...'); comprehension and repetition intact; not localizing — can result from lesions anywhere in language network." },
    { topicId: T["Language Processing & Aphasia"], question: "Transcortical Motor Aphasia differs from Broca's aphasia by:", options: JSON.stringify(["Intact repetition in Transcortical Motor (lesion spares arcuate fasciculus/perisylvian region)","More severe comprehension impairment in Transcortical Motor","Fluent output in Transcortical Motor","Right hemisphere lesion in Transcortical Motor"]), correctAnswer: "A", explanation: "Transcortical Motor aphasia is non-fluent like Broca's but repetition is intact (sometimes echolalic); this is because the perisylvian language loop is preserved, unlike in Broca's aphasia." },
    { topicId: T["Language Processing & Aphasia"], question: "Expressive aprosodia involves:", options: JSON.stringify(["Inability to convey emotional tone, stress, and rhythm in speech — sounding flat/monotone","Difficulty interpreting others' emotional prosody","Inability to comprehend any speech","Word-finding difficulties only"]), correctAnswer: "A", explanation: "Expressive aprosodia: the person cannot modulate pitch, stress, and rhythm to convey emotion, resulting in monotone, flat-sounding speech; associated with right hemisphere frontal damage." },
    { topicId: T["Language Processing & Aphasia"], question: "The TRACE model of speech perception is characterized by:", options: JSON.stringify(["Interactive activation with bidirectional (top-down and bottom-up) connections between feature, phoneme, and word levels","Only bottom-up processing","Recognition based solely on the first phoneme","Serial, stage-by-stage processing"]), correctAnswer: "A", explanation: "The TRACE model involves interactive activation: features activate phonemes which activate words, but activated words also feed back down to influence phoneme perception — explaining context effects." },
    { topicId: T["Language Processing & Aphasia"], question: "Alexia without agraphia (pure alexia) results from:", options: JSON.stringify(["Disconnection between visual cortex and language areas — can write but cannot read","Angular gyrus lesion damaging both reading and writing","Wernicke's area damage","Broca's area damage"]), correctAnswer: "A", explanation: "Pure alexia (alexia without agraphia): visual information cannot reach language areas (disconnection); remarkably, patients can write normally but cannot read even their own handwriting." },

    // ===== 14. APRAXIA & AGNOSIA =====
    { topicId: T["Apraxia & Agnosia"], question: "Apraxia differs from other motor disorders in that:", options: JSON.stringify(["Weakness, sensory loss, and cerebellar dysfunction are absent — it is a cortical planning deficit","It always involves muscle weakness","It is caused by basal ganglia degeneration","It only affects speech production"]), correctAnswer: "A", explanation: "Apraxia is a disorder of motor planning/programming at the cortical association level — primary motor and sensory pathways are intact; the deficit is in higher-order movement organization." },
    { topicId: T["Apraxia & Agnosia"], question: "Ideomotor apraxia errors include:", options: JSON.stringify(["Using body part as the tool (e.g., finger as a toothbrush), spatial trajectory errors, and timing errors","Only completely omitting the action","Substituting an entirely different purposeful movement","Confusing tools from different categories"]), correctAnswer: "A", explanation: "Ideomotor apraxia errors: content errors (substitute different pantomime), postural errors (body part as tool), spatial errors (wrong trajectory/orientation), and temporal/sequencing errors." },
    { topicId: T["Apraxia & Agnosia"], question: "Ideational apraxia involves:", options: JSON.stringify(["Failure to organize a complex multi-step sequence of actions (e.g., making tea)","Inability to perform single gestures","Only affecting non-dominant hand","Impairment only when using real objects"]), correctAnswer: "A", explanation: "Ideational apraxia: the conceptual plan for a complex, sequenced multi-step task is disrupted — individual actions may be possible but the overall sequence fails (frontal lobe lesion)." },
    { topicId: T["Apraxia & Agnosia"], question: "Agnosia is best defined as:", options: JSON.stringify(["Perception without recognition — sensory processing intact but identification fails","Complete loss of sensory input in one modality","An inability to produce motor responses","Amnesia for sensory experiences"]), correctAnswer: "A", explanation: "Agnosia: the ability to sense is intact but the brain cannot recognize or interpret what is sensed — it is a failure of higher-order perceptual processing, not primary sensation." },
    { topicId: T["Apraxia & Agnosia"], question: "Prosopagnosia results from damage to:", options: JSON.stringify(["Fusiform face area (ventral temporal-occipital cortex)","Primary visual cortex V1","Frontal eye fields","Anterior cingulate cortex"]), correctAnswer: "A", explanation: "Prosopagnosia (inability to recognize familiar faces) results from damage to the fusiform face area, a region in the ventral visual stream specialized for face processing." },
    { topicId: T["Apraxia & Agnosia"], question: "In the standard apraxia assessment, the correct order is:", options: JSON.stringify(["Pantomime to command → imitate examiner → use actual object","Use actual object → imitate → pantomime","Imitate → pantomime → comprehension test","Any order — sequence does not matter"]), correctAnswer: "A", explanation: "Assessment progresses from the most demanding (pantomime from verbal command, requires internal representation) to easiest (actual object use), revealing which level of representation is impaired." },
    { topicId: T["Apraxia & Agnosia"], question: "Balint's syndrome involves:", options: JSON.stringify(["Simultanagnosia, optic ataxia, and oculomotor apraxia from bilateral parietal-occipital damage","Inability to recognize sounds","Impaired face recognition only","Hemispatial neglect from right parietal damage"]), correctAnswer: "A", explanation: "Balint's syndrome: simultanagnosia (can only see one object at a time), optic ataxia (misreaching), and oculomotor apraxia (difficulty directing gaze voluntarily); bilateral parieto-occipital damage." },
    { topicId: T["Apraxia & Agnosia"], question: "Apraxia of speech involves:", options: JSON.stringify(["Difficulty planning articulatory movements for speech despite intact phonation and comprehension","Weak muscles of articulation","Deficient phonological representation","Right hemisphere motor planning"]), correctAnswer: "A", explanation: "Apraxia of speech: impaired planning and sequencing of speech articulatory movements; automatic/reactive speech (counting, swearing) may be preserved; not caused by weakness (dysarthria) or language deficit." },
    { topicId: T["Apraxia & Agnosia"], question: "Conduction apraxia is characterized by:", options: JSON.stringify(["More impaired with imitation than with command; disconnection syndrome","Equally impaired on command and imitation","Only affecting dominant hand","Preserved imitation and impaired object use"]), correctAnswer: "A", explanation: "Conduction apraxia: imitation is paradoxically more impaired than pantomime to command — thought to reflect a disconnection between the visual representation of the gesture and motor programming." },
    { topicId: T["Apraxia & Agnosia"], question: "Asomatognosia refers to:", options: JSON.stringify(["Failure to recognize own body parts or their relationship to each other","Inability to recognize objects by touch","Loss of proprioception in limbs","Impaired body image in eating disorders"]), correctAnswer: "A", explanation: "Asomatognosia is a disturbance in body schema — failure to recognize or acknowledge one's own body parts; associated with right parietal lesions and often co-occurs with hemispatial neglect." },

    // ===== 15. NEUROCOGNITIVE DISORDERS =====
    { topicId: T["Neurocognitive Disorders"], question: "The genetic mutation in Huntington's Disease involves:", options: JSON.stringify(["CAG trinucleotide repeats (36+) in the HTT gene on chromosome 4","A mutation in the APOE gene on chromosome 19","Trinucleotide repeat on chromosome 21","Autosomal recessive inheritance"]), correctAnswer: "A", explanation: "Huntington's is caused by autosomal dominant expansion of CAG repeats in the HTT gene on chromosome 4; 36+ repeats are pathological, 10-27 are normal, and repeat length correlates with onset age." },
    { topicId: T["Neurocognitive Disorders"], question: "The classic triad of iNPH (idiopathic Normal Pressure Hydrocephalus) includes:", options: JSON.stringify(["Magnetic gait, cognitive impairment, and urinary incontinence","Tremor, rigidity, and bradykinesia","Hallucinations, fluctuating cognition, and parkinsonism","Chorea, depression, and executive dysfunction"]), correctAnswer: "A", explanation: "iNPH classic triad: magnetic gait (feet appear glued to floor), cognitive impairment, and urinary urgency/incontinence — caused by excess CSF compressing periventricular tracts." },
    { topicId: T["Neurocognitive Disorders"], question: "Delirium is primarily distinguished from dementia by:", options: JSON.stringify(["Acute onset and fluctuating course in delirium vs gradual progression in dementia","Delirium involves memory loss but dementia does not","Delirium is irreversible; dementia is treatable","Dementia causes more severe agitation"]), correctAnswer: "A", explanation: "Delirium has acute (hours to days) onset with fluctuating course — symptoms vary dramatically throughout the day. Dementia has a gradual, progressive onset without rapid fluctuations." },
    { topicId: T["Neurocognitive Disorders"], question: "The Glasgow Coma Scale (GCS) assesses:", options: JSON.stringify(["Eye opening, verbal response, and motor response (max 15)","Only verbal responses (max 15)","Reflexes, memory, and orientation","Blood pressure, pupil reaction, and motor tone"]), correctAnswer: "A", explanation: "GCS = Eye opening (4) + Verbal response (5) + Motor response (6) = max 15. Score ≤8 indicates severe TBI/coma; it is the standard acute TBI severity classification tool." },
    { topicId: T["Neurocognitive Disorders"], question: "Parkinson's Disease pathophysiology centers on:", options: JSON.stringify(["Loss of dopaminergic neurons in substantia nigra pars compacta with Lewy body (alpha-synuclein) accumulation","Cholinergic neuron loss in the nucleus basalis","Glutamate excitotoxicity in the striatum","Tau protein tangles in the cortex"]), correctAnswer: "A", explanation: "PD involves progressive degeneration of dopaminergic neurons in the substantia nigra pars compacta, Lewy body formation, and resulting loss of striatal dopamine input causing motor and cognitive symptoms." },
    { topicId: T["Neurocognitive Disorders"], question: "The core features of Dementia with Lewy Bodies (DLB) include:", options: JSON.stringify(["Fluctuating cognition, visual hallucinations, parkinsonism, and REM sleep behavior disorder","Chorea, executive dysfunction, and depression","Magnetic gait, incontinence, and hydrocephalus","Aphasia, apraxia, and agnosia as first symptoms"]), correctAnswer: "A", explanation: "DLB core features: fluctuating alertness/cognition, recurrent visual hallucinations (80%), parkinsonism (after cognitive decline), and REM sleep behavior disorder (acting out dreams)." },
    { topicId: T["Neurocognitive Disorders"], question: "Chronic Traumatic Encephalopathy (CTE) is:", options: JSON.stringify(["A progressive tau pathology from repetitive brain trauma, diagnosed post-mortem","Identical to Alzheimer's disease","Caused by a single severe TBI","Always accompanied by immediate loss of consciousness"]), correctAnswer: "A", explanation: "CTE is a neurodegenerative disease caused by repetitive brain trauma (not a single injury); characterized by hyperphosphorylated tau deposits; currently can only be confirmed at autopsy." },
    { topicId: T["Neurocognitive Disorders"], question: "The Frascati Criteria distinguish ANI from HAD primarily by:", options: JSON.stringify(["Functional impairment — ANI has none; MND has mild; HAD has marked impairment","Cognitive domain scores only","CD4 count and viral load","Neuroimaging findings"]), correctAnswer: "A", explanation: "All three HIV neurocognitive categories require ≥1 SD impairment in 2+ cognitive domains; the distinction is functional impairment: ANI=none, MND=mild, HAD=marked impairment in daily activities." },
    { topicId: T["Neurocognitive Disorders"], question: "The anterior cingulate cortex's role in pain is to process:", options: JSON.stringify(["The emotional/affective distress component of pain (the suffering)","The sensory-discriminative component (location and intensity)","Motor responses to pain","Descending pain inhibition"]), correctAnswer: "A", explanation: "The anterior cingulate processes the 'unpleasantness' or emotional suffering of pain. Cingulotomy (surgical lesioning) can eliminate pain distress while leaving the sensory detection of pain intact." },
    { topicId: T["Neurocognitive Disorders"], question: "What distinguishes resting tremor in Parkinson's from action tremor?", options: JSON.stringify(["Resting tremor occurs at rest and diminishes with voluntary movement; action tremor occurs during movement","Both types occur only during voluntary movement","Resting tremor is more disabling than action tremor in all cases","Action tremor is more common in Parkinson's"]), correctAnswer: "A", explanation: "Parkinson's tremor is characteristically a resting tremor ('pill-rolling') that improves with voluntary movement. Action/intention tremors (worsening with movement) suggest cerebellar pathology." },
  ];

  const quizQuestions = mapQuizQuestions(rawQuizQuestions);
  await db.insert(quizQuestionsTable).values(quizQuestions);
  console.log(`Inserted ${quizQuestions.length} quiz questions`);

  // ===========================================================================
  // STUDY GUIDES (1 per topic)
  // ===========================================================================
  const studyGuides = [
    {
      topicId: T["Neuropsychology Overview"],
      title: "Neuropsychology Overview",
      content: `# Neuropsychology Overview

## What is Neuropsychology?
Neuropsychology studies the relationship between brain structure/function and behavior, cognition, and emotion. It bridges neuroscience and clinical psychology.

## Core Concepts

### Localization vs Mass Action
- **Localizationism**: specific brain regions perform specific functions (Broca, Wernicke)
- **Equipotentiality** (Lashley): any cortical tissue can substitute for another in learning
- **Modern view**: both apply — modular functions exist within distributed networks

### Key Principles
- **Lateralization**: language typically left; visuospatial typically right hemisphere
- **Double dissociation**: strongest evidence that two functions are neurally independent
- **Diaschisis**: loss of function in remote but connected brain regions after a lesion
- **Plasticity**: the brain's ability to reorganize, especially after injury

## Neuropsychological Assessment

### Major Batteries
| Battery | Key Features |
|---------|-------------|
| Halstead-Reitan | Comprehensive motor and cognitive functions |
| Luria-Nebraska | Motor, rhythm, tactile, visual, speech, writing, memory |
| MMSE | Rapid 30-point screen for cognitive impairment |

### Five Core Cognitive Domains
1. **Attention** — sustained, selective, divided
2. **Memory** — anterograde vs retrograde, implicit vs explicit
3. **Language** — fluency, comprehension, naming, repetition
4. **Visuospatial** — construction, perception, navigation
5. **Executive Function** — planning, flexibility, inhibition

### Ecological Validity
The degree to which test performance predicts real-world daily function — critical for treatment planning.

## Theoretical Models
- **Diathesis-stress model**: genetic vulnerability + environmental stress → disorder
- **Endophenotype**: intermediate biological markers linking genes to symptoms
- **Differential diagnosis**: rule out malingering → substances → medical conditions → primary disorder`,
    },
    {
      topicId: T["Cell Biology & Neuron Anatomy"],
      title: "Cell Biology & Neuron Anatomy",
      content: `# Cell Biology & Neuron Anatomy

## Neuron Structure
- **Soma (cell body)**: contains nucleus and organelles
- **Dendrites**: receive input from other neurons
- **Axon hillock**: integration zone where APs are initiated
- **Axon**: conducts AP to terminals
- **Axon terminals (boutons)**: release neurotransmitter

## Membrane Potential

### Resting State (~-70 mV)
- Maintained by Na+/K+ ATPase (3 Na+ out, 2 K+ in)
- K+ selectively permeable at rest (K+ leaks out)
- Cl- and large organic anions: impermeable

### Action Potential Phases
| Phase | Ion Flow | Voltage |
|-------|----------|---------|
| Depolarization | Na+ rushes IN | -70 → +40 mV |
| Repolarization | K+ rushes OUT | +40 → -70 mV |
| Hyperpolarization (undershoot) | K+ channels still open | below -70 mV |
| Refractory period | Na+ channels inactivated | recovery |

### Key Laws
- **All-or-none**: APs are fixed size; intensity encoded by firing rate (rate law)
- **Threshold**: ~-55 mV (EPSP must bring membrane to threshold)

## Synaptic Integration

### Summation
- **Spatial**: simultaneous inputs from multiple locations
- **Temporal**: rapid repeated inputs at same synapse

### Postsynaptic Potentials
- **EPSP**: depolarization → increases firing probability
- **IPSP**: hyperpolarization → decreases firing probability

## Myelination and Conduction

| Feature | Myelinated | Unmyelinated |
|---------|------------|--------------|
| Conduction type | Saltatory (jumps between nodes of Ranvier) | Continuous |
| Speed | Fast (up to 120 m/s) | Slow (0.5–2 m/s) |
| Example | Motor neurons, dorsal columns | Pain (C fibers) |

## Glial Cells
| Type | Location | Function |
|------|----------|----------|
| Astrocytes | CNS | Support, synaptogenesis, BBB |
| Oligodendrocytes | CNS | Myelination |
| Schwann cells | PNS | Myelination |
| Microglia | CNS | Immune surveillance |`,
    },
    {
      topicId: T["Neurotransmitters & Synaptic Transmission"],
      title: "Neurotransmitters & Synaptic Transmission",
      content: `# Neurotransmitters & Synaptic Transmission

## Synaptic Transmission Process
1. Action potential arrives at presynaptic terminal
2. Voltage-gated **Ca2+** channels open
3. Vesicles fuse with membrane (exocytosis)
4. Neurotransmitter released into synaptic cleft
5. Binds postsynaptic receptors → response
6. Termination: reuptake, enzymatic degradation, or diffusion

## Major Neurotransmitters

### Amino Acids (Fast Transmission)
| NT | Type | Receptors | Function |
|----|------|-----------|----------|
| Glutamate | Excitatory | AMPA, NMDA, Kainate | 90% of fast excitation; precursor to GABA |
| GABA | Inhibitory | GABA-A (Cl-), GABA-B (K+) | Primary inhibition; anxiety, seizures |

### Monoamines (Modulatory)
| NT | Pathway | Function |
|----|---------|----------|
| Dopamine | Mesolimbic (reward), Mesocortical (cognition), Nigrostriatal (motor) | Reward, movement, attention |
| Serotonin (5-HT) | Raphe nuclei → cortex | Mood, sleep, appetite |
| Norepinephrine | Locus coeruleus → cortex | Arousal, attention, stress |
| Epinephrine | Adrenal medulla | Peripheral stress response |

### Others
- **Acetylcholine**: NMJ, memory (hippocampus), autonomic
- **Anandamide**: endocannabinoid; pain, mood, appetite, memory
- **Nitric oxide (NO)**: gaseous retrograde messenger; learning
- **Endorphins**: opioid neuropeptides; pain relief

## Receptor Types

| Type | Mechanism | Speed | Example |
|------|-----------|-------|---------|
| Ionotropic (ligand-gated) | Directly opens ion channel | Fast (ms) | AMPA, GABA-A, nACh |
| Metabotropic (GPCR) | Second messenger cascade | Slow (seconds-minutes) | mGluR, D1/D2, 5-HT1A |

## Termination of Synaptic Action
1. **Reuptake**: transporter proteins return NT to presynaptic terminal
2. **Enzymatic degradation**: e.g., AChE degrades ACh; MAO degrades monoamines
3. **Diffusion**: NT drifts away from synapse

## Pharmacological Targets
- **Reuptake transporters**: SSRIs, SNRIs, methylphenidate
- **Enzymes**: MAOIs, AChE inhibitors (donepezil)
- **Ionotropic receptors**: benzodiazepines (GABA-A), ketamine (NMDA)
- **Metabotropic receptors**: antipsychotics (D2), beta-blockers (β-AR)
- **Voltage-gated channels**: anticonvulsants (Na+, Ca2+)`,
    },
    {
      topicId: T["Sensory Pathways"],
      title: "Sensory Pathways",
      content: `# Sensory Pathways

## Spinal Cord Organization

### Cross-Section Anatomy
- **Gray matter (H-shaped)**: dorsal horns (sensory), ventral horns (motor), lateral horns (T1-L2: sympathetic; S2-S4: parasympathetic)
- **White matter**: surrounds gray matter; organized into ascending and descending tracts

## Major Ascending (Sensory) Tracts

| Tract | Modality | Decussation | Destination |
|-------|----------|-------------|-------------|
| Dorsal columns (DCML) | Fine touch, vibration, proprioception | Medulla (gracile/cuneate nuclei) | VPL thalamus → primary somatosensory cortex |
| Anterolateral (spinothalamic) | Pain, temperature, crude touch | Spinal cord (1-2 levels above entry) | VPL thalamus → somatosensory cortex |
| Spinoreticular | Pain (affective component) | Spinal cord | Reticular formation → limbic system |

## Major Descending (Motor) Tracts

| Tract | Function | Decussation | Control |
|-------|----------|-------------|---------|
| Lateral corticospinal | Fine distal limb movement | Medullary pyramids | Contralateral extremities |
| Corticorubrospinal | Arm/leg movement | Red nucleus → medulla | Contralateral |
| Ventromedial corticospinal | Head, neck, trunk | Brainstem | Bilateral, ipsilateral |

## Upper vs Lower Motor Neuron Lesions
| Sign | UMN | LMN |
|------|-----|-----|
| Tone | Increased (spasticity) | Decreased (flaccidity) |
| Reflexes | Hyperreflexia | Hyporeflexia/areflexia |
| Muscle | No atrophy (disuse only) | Atrophy + fasciculations |
| Babinski | Positive | Absent/negative |

## Key Dermatomes
| Level | Region |
|-------|--------|
| C6 | Thumb and index finger |
| T4 | Nipple |
| T10 | Umbilicus |
| L1 | Inguinal ligament |
| L4 | Medial leg, great toe |
| S1 | Lateral foot, heel |

## Spinal Reflexes
- **Stretch reflex (monosynaptic)**: Ia afferent → α-motor neuron → same muscle; basis of tendon reflexes
- **Reciprocal innervation**: flexor excitation simultaneously inhibits extensors (via Ia inhibitory interneurons)
- **Withdrawal reflex**: polysynaptic; pain → flexion; protective

## Brown-Séquard Syndrome (Cord Hemisection)
- **Ipsilateral**: motor loss, proprioception/vibration loss (below lesion)
- **Contralateral**: pain/temperature loss (1-2 levels below lesion)`,
    },
    {
      topicId: T["Sensory Systems"],
      title: "Sensory Systems: Vision, Hearing, Touch, Chemical Senses, Vestibular & Motor Control",
      content: `# Sensory Systems

## Vision

### Visual Anatomy
- **Fovea**: highest acuity; densely packed cones; retinal layers thin here
- **Blind spot**: where optic nerve exits; no photoreceptors
- **Rods**: periphery, dim light, black-and-white, high convergence
- **Cones**: fovea, bright light, color vision, low convergence (1:1 in fovea)

### Visual Pathway (Retinal-Geniculate-Striate)
Retina → Optic nerve → Optic chiasm (nasal fibers cross) → LGN (thalamus) → Primary visual cortex (V1, striate cortex, occipital lobe)

### Visual Streams
| Stream | Direction | Function | Damage |
|--------|-----------|----------|--------|
| Ventral (WHAT) | → Temporal lobe | Object identity, color, form | Visual agnosia, prosopagnosia |
| Dorsal (WHERE/HOW) | → Parietal lobe | Location, motion, action guidance | Neglect, optic ataxia, simultanagnosia |

### Color Vision Theories
- **Trichromatic (Young-Helmholtz)**: 3 cone types (S/M/L) combine outputs
- **Opponent-process (Hering)**: red-green, blue-yellow, black-white opponent pairs — explains afterimages and color blindness

### Clinical Syndromes
- **Blindsight**: subcortical visual processing (superior colliculus) without conscious awareness after V1 loss
- **Prosopagnosia**: face recognition failure; fusiform face area (ventral stream)
- **Akinetopsia**: motion blindness; area MT/V5 damage

---

## Hearing

### Ear Anatomy
- **Outer**: pinna, external auditory canal, tympanic membrane
- **Middle**: ossicles (malleus → incus → stapes); amplification
- **Inner**: cochlea (hearing), vestibular organs (balance)

### Auditory Pathway
Cochlear hair cells → Auditory nerve (CN VIII) → Cochlear nuclei (pons/medulla) → Superior olivary complex → Inferior colliculus (midbrain) → Medial geniculate nucleus (thalamus) → Primary auditory cortex (Heschl's gyri, superior temporal gyrus)

### Key Concepts
- **Tonotopy**: frequency organized spatially (basilar membrane: base=high, apex=low)
- **Sound localization**: medial superior olive (interaural time), lateral superior olive (interaural intensity)

---

## Touch & Somatosensory System

### Cutaneous Receptors
| Receptor | Stimulus | Adaptation |
|----------|----------|------------|
| Pacinian corpuscle | Deep vibration, sudden displacement | Rapidly adapting |
| Meissner's corpuscle | Fine touch, low-frequency vibration | Rapidly adapting |
| Merkel's disk | Surface features, sustained pressure | Slowly adapting |
| Ruffini ending | Skin stretch, joint angle | Slowly adapting |
| Free nerve endings | Pain, temperature | Variable |

### Pain Pathways
- **Sharp pain**: Aδ fibers (myelinated) → fast, localized
- **Dull/chronic pain**: C fibers (unmyelinated) → slow, burning, diffuse
- **Gate control theory**: dorsal horn inhibitory interneurons suppress pain when activated by touch/vibration input
- **Descending inhibition**: PAG → raphe nuclei → dorsal horn; endorphins/cannabinoids

---

## Chemical Senses

### Olfaction (Smell)
- Receptors: olfactory epithelium, cilia in nasal mucus; replenished monthly
- **Unique pathway**: bypasses thalamus → olfactory bulb → piriform cortex, amygdala, entorhinal cortex
- Clinical: **anosmia** (often from head trauma severing olfactory nerves through cribriform plate)

### Gustation (Taste)
- 5 basic tastes: sweet, salty, sour, bitter, umami
- Papillae → taste buds → ~50 receptors/bud
- Pathway: CN VII, IX, X → solitary nucleus (medulla) → VPM thalamus → insula/operculum (gustatory cortex)
- Clinical: **ageusia** (rare due to redundant cranial nerve innervation)

---

## Vestibular System
- **Saccule and utricle** (otolith organs): linear acceleration and static head tilt; otoconia (calcium carbonate crystals)
- **Semicircular canals**: rotational acceleration (3 planes)
- Projects to: cerebellum, spinal cord (VST), and oculomotor nuclei (VOR)

---

## Motor Control

### Cortical Motor Areas
| Area | Function |
|------|----------|
| Primary motor cortex (M1) | Execution of voluntary movement; somatotopic |
| Premotor cortex | Planning, posture, anticipation of movement outcomes |
| Supplementary motor area (SMA) | Sequencing, motor imagery, inhibitory control |
| Posterior parietal cortex | Integrates sensory inputs for spatial movement planning |

### Basal Ganglia Role
- Selects and inhibits competing motor programs
- Dopamine from substantia nigra modulates direct (go) and indirect (no-go) pathways`,
    },
    {
      topicId: T["Limbic System & Motivation"],
      title: "Limbic System & Motivation",
      content: `# Limbic System & Motivation

## Limbic System Structures
| Structure | Key Functions |
|-----------|---------------|
| Amygdala | Fear conditioning, emotional memory, threat detection |
| Hippocampus | Spatial navigation, declarative memory, context |
| Hypothalamus | Homeostasis, hunger/satiety, reproduction, autonomic |
| Thalamus (anterior) | Relay for limbic circuits |
| Cingulate cortex | Emotion-cognition integration, pain affect |
| Fornix | Major output pathway from hippocampus |

## Dopamine and Reward

### Three Dopamine Pathways
| Pathway | Origin → Destination | Function |
|---------|---------------------|----------|
| Mesolimbic | VTA → NAcc, amygdala, hippocampus | Reward, wanting, motivational salience |
| Mesocortical | VTA → prefrontal cortex | Cognition, attention, working memory |
| Nigrostriatal | Substantia nigra → striatum | Motor control, procedural learning |

### Three Aspects of Reward (Berridge)
1. **Liking**: hedonic pleasure (opioid systems in NAcc)
2. **Wanting**: incentive salience, motivational drive (dopamine)
3. **Learning**: associating cues with rewards (dopamine prediction error)

## Hunger and Feeding

### Key Signals
| Signal | Source | Effect |
|--------|--------|--------|
| Ghrelin | Stomach | ↑ Hunger (rises before meals) |
| Leptin | Adipose tissue | ↓ Hunger (signals fat stores) |
| Insulin | Pancreas | ↓ Hunger; promotes fat storage |
| NPY/Orexin | Lateral hypothalamus | ↑ Hunger |

### Eating Disorders — Neural Profiles
- **Anorexia**: mesolimbic dopamine dysregulation, low serotonin, anterior insula hyperactivity (food perceived as threatening), anhedonia
- **Bulimia**: OCD-like neural overlap, serotonin implicated, distorted body image

## Environmental Factors in Eating
- Serving size, social facilitation, appetizer effect
- **Sensory-specific satiety**: palatability decreases for eaten foods while other foods remain appealing
- **Positive-incentive perspective**: anticipated pleasure drives eating more than caloric deficit`,
    },
    {
      topicId: T["Sleep & Circadian Rhythms"],
      title: "Sleep & Circadian Rhythms",
      content: `# Sleep & Circadian Rhythms

## Circadian Biology

### The Suprachiasmatic Nucleus (SCN)
- Located in the anterior hypothalamus
- Master pacemaker: generates ~24.2-hour endogenous rhythms
- Receives photic input from ipRGCs (melanopsin, blue light) via retinohypothalamic tract
- Synchronizes peripheral clocks throughout the body

### Zeitgebers
External time cues: **light** (most powerful) > food timing > exercise > social interaction > temperature

### Melatonin
- Produced by **pineal gland** (posterior to tectum)
- Secreted in darkness; suppressed by light
- Promotes sleep onset; timed by SCN → retina → SCN → pineal pathway

## Sleep Architecture

### NREM Stages
| Stage | EEG | Features |
|-------|-----|----------|
| N1 | Theta waves | Light sleep, hypnic jerks |
| N2 | Sleep spindles, K-complexes | True sleep onset |
| N3 | Delta waves | Slow-wave sleep; most restorative |

### REM Sleep
- Paradoxical sleep: EEG like waking
- Muscle atonia (brainstem-mediated)
- Vivid, narrative dreaming
- Critical for emotional and procedural memory

## Sleep and Memory
- **N3 slow-wave sleep**: hippocampal → cortical transfer of declarative memories
- **REM sleep**: procedural learning, emotional memory processing, threat consolidation

## Circadian Regulation of Physiology
| Function | Timing |
|----------|--------|
| Core body temperature | Peaks ~5-7 PM |
| Cortisol | Peaks ~8 AM (stress preparation) |
| Melatonin | Peaks ~2-4 AM |
| Blood pressure | Lowest during sleep |

## Clinical Applications
- **Jet lag**: rapid transmeridian travel; days to weeks to re-entrain
- **Shift work**: chronic circadian misalignment → metabolic and cognitive risks
- **Benzodiazepines**: ↑N2, ↓N3 and REM; short-term benefit but disrupts sleep quality
- **Chronotypes**: morning (earlier SCN phase) vs evening (later SCN phase); genetic (PER3)`,
    },
    {
      topicId: T["Endocrine System & Reproduction"],
      title: "Endocrine System & Reproduction",
      content: `# Endocrine System & Reproduction

## Endocrine vs Exocrine
- **Endocrine**: release hormones into bloodstream → distant targets
- **Exocrine**: release into ducts → local surfaces (e.g., sweat, saliva)

## Hormone Classes
| Class | Derived From | Solubility | Receptor Location |
|-------|-------------|------------|-------------------|
| Amines | Tyrosine | Water-soluble | Membrane |
| Peptides/Proteins | Amino acids | Water-soluble | Membrane |
| Steroids | Cholesterol | Fat-soluble | Nuclear |

## Hypothalamic-Pituitary Axis
- **Posterior pituitary**: neural extension; releases oxytocin and vasopressin (ADH)
- **Anterior pituitary**: controlled by hypothalamic releasing hormones via portal blood
- **HPA axis**: CRH (hypothalamus) → ACTH (anterior pituitary) → cortisol (adrenal cortex)

## Hormone Effects
- **Organizational**: permanent; occur during critical developmental windows; shape neural/anatomical structures
- **Activational**: temporary; occur in adulthood; trigger specific behaviors (e.g., sexual behavior)

## Sexual Differentiation

### Prenatal Sequence
1. Genetic sex (XX or XY) established at fertilization
2. **SRY gene** (Y chromosome) → SRY protein → testes develop
3. Testes → testosterone → Wolffian system develops (vas deferens, seminal vesicles)
4. Testes → AMH → Müllerian system degenerates
5. Without testosterone: Müllerian system → uterus, fallopian tubes; Wolffian degenerates

### Genetic Conditions
| Condition | Genetics | Presentation |
|-----------|----------|--------------|
| AIS | XY; absent androgen receptors | Female-typical external; testes present |
| 5-Alpha Reductase Deficiency | XY; no DHT | Female-typical external at birth; masculinize at puberty |
| Turner's Syndrome | 45,X | No gonads; short stature; female-typical |
| Persistent Müllerian Duct Syndrome | XY; absent AMH/receptors | Both internal organ sets |

## Key Hormones
| Hormone | Source | Functions |
|---------|--------|-----------|
| Oxytocin | Hypothalamus/posterior pituitary | Bonding, labor, lactation, trust |
| Vasopressin (ADH) | Hypothalamus/posterior pituitary | Water retention, social bonding, aggression |
| Testosterone | Testes (Leydig cells) | Androgenization, libido, aggression |
| Estradiol | Ovaries | Female development, neuroprotection |
| Cortisol | Adrenal cortex | Stress response, immunosuppression, metabolism |`,
    },
    {
      topicId: T["Psychopharmacology"],
      title: "Psychopharmacology",
      content: `# Psychopharmacology

## Levels of Psychologist Involvement
1. Not involved
2. **Providing information** (majority) — psychoeducation, assessment, consultation, indirect
3. General involvement — education, assessment, intervention, collaboration
4. Prescribing (direct) — limited states/military

## Drug Nomenclature
- **Chemical name**: full chemical structure (e.g., fluoxetine hydrochloride)
- **Generic name**: approved non-proprietary name (e.g., fluoxetine)
- **Brand name**: manufacturer's proprietary name (e.g., Prozac)

## FDA Prescribing Information Structure
Boxed warning → Indications/usage → Dosage → Contraindications → Warnings → Adverse reactions → Drug interactions → Specific populations → Pharmacology (PK/PD) → Clinical studies

## Drug Target Sites

### The Exogenous Field (E-W axis)
External substances acting on synaptic components:

| Target | Examples | Drugs |
|--------|----------|-------|
| Reuptake transporters | DAT, SERT, NET | SSRIs, SNRIs, methylphenidate |
| GPCR/metabotropic receptors | D2, 5-HT2A, β-AR | Antipsychotics, antidepressants |
| Enzymes | MAO, AChE | MAOIs, donepezil |
| Ionotropic (ligand-gated) ion channels | GABA-A, NMDA | Benzodiazepines, esketamine |
| Voltage-gated ion channels | Na+, Ca2+ channels | Anticonvulsants |

## Major Drug Classes

### Antidepressants
| Class | Mechanism | Key Examples |
|-------|-----------|--------------|
| SSRI | Block SERT | Fluoxetine, sertraline, escitalopram |
| SNRI | Block SERT + NET | Venlafaxine, duloxetine |
| MAOI | Inhibit MAO | Phenelzine (dietary restrictions required) |
| Esketamine | NMDA antagonist | Spravato (nasal spray; rapid onset) |

### Antipsychotics
| Generation | Mechanism | Side Effects |
|-----------|-----------|--------------|
| FGA (typical) | D2 blockade | High EPS, tardive dyskinesia |
| SGA (atypical) | D2 + 5-HT2A blockade | Metabolic syndrome, weight gain |

### Mood Stabilizers
- **Lithium**: unknown exact mechanism; gold standard for bipolar
- **Valproate, lamotrigine**: anticonvulsants used as mood stabilizers

### Anxiolytics
- **Benzodiazepines**: potentiate GABA-A; fast but tolerance/dependence risk
- **Buspirone**: partial 5-HT1A agonist; no dependence risk

## Off-Label Prescribing
Physicians may prescribe any FDA-approved drug for any purpose immediately after approval; clinician-authored (professionally-based) resources can discuss off-label uses unlike regulatory prescribing information.`,
    },
    {
      topicId: T["Psychological Disorders"],
      title: "Psychological Disorders: Psychosis, Schizophrenia Spectrum, Mood, and Dissociative Disorders",
      content: `# Psychological Disorders

## Foundations of Psychopathology

### Diathesis-Stress Model
Genetic vulnerability × Environmental stressors → Disorder
- Neither factor alone is sufficient
- **Endophenotype**: intermediate biological markers (e.g., working memory deficits) linking genes to symptoms

### Categorical vs Dimensional
- **Categorical**: strict DSM boundaries; present or absent
- **Dimensional**: symptoms on a continuum; overlap across disorders
- Evidence supports both — DSM-5 increasingly incorporates dimensional elements

### Differential Diagnosis Steps
1. Rule out **malingering** and **factitious disorder**
2. Rule out **substance use** and **medical conditions**
3. Determine the **primary disorder**
4. Differentiate from **adjustment disorder**
5. Establish **no disorder** if criteria not met

---

## Psychosis and Schizophrenia Spectrum

### Five Domains (DSM-5)
1. **Hallucinations** (any sense; auditory most common)
2. **Delusions** (persecutory, referential, grandiose, erotomanic, nihilistic, somatic)
3. **Disorganized thinking/speech** (derailment, tangentiality, incoherence)
4. **Abnormal motor behavior** (including catatonia)
5. **Negative symptoms** (flat affect, avolition, alogia, anhedonia, asociality)

### Spectrum Disorders by Duration
| Disorder | Duration |
|----------|----------|
| Brief Psychotic Disorder | 1 day – 1 month |
| Schizophreniform | 1 – 6 months |
| Schizophrenia | 6+ months with functional decline |
| Schizoaffective | Schizophrenia criteria + mood episodes; 2+ weeks of psychosis without mood episode |
| Delusional Disorder | 1+ month; non-bizarre delusions; no other Criterion A |

---

## Bipolar and Depressive Disorders

### Bipolar Spectrum
| Disorder | Key Feature |
|----------|-------------|
| Bipolar I | Full manic episode (1+ week or hospitalized) |
| Bipolar II | Hypomanic (4+ days) + MDD; NO full mania |
| Cyclothymic | 2-year fluctuating mood; not meeting full episode criteria |

### Depressive Disorders
| Disorder | Duration | Key Features |
|----------|----------|--------------|
| MDD | 2+ weeks | 5+ symptoms; no mania/hypomania |
| PDD | 2+ years | Chronic; not symptom-free > 2 months |
| DMDD | Childhood | Severe temper outbursts 3+/week; ages 6-18 |
| PMDD | Luteal phase | Mood symptoms tied to menstrual cycle |

---

## Dissociative Disorders

### Dissociative Identity Disorder (DID)
- Two or more distinct personality states
- Recurrent gaps in autobiographical memory (amnesia)
- Significant distress/impairment
- Positive symptoms: division of identity, depersonalization/derealization
- Negative symptoms: amnesia, inability to access information

### Dissociative Amnesia
- Retrograde amnesia localized to traumatic events
- **With dissociative fugue**: purposeful travel or bewildered wandering
- Individual may not realize they have memory gaps

### Depersonalization/Derealization Disorder
- **Depersonalization**: feeling detached from thoughts/feelings/body
- **Derealization**: surroundings feel unreal or dreamlike
- **Reality testing remains intact** throughout episodes

---

## Clinical Considerations
- **Cultural competence**: distinguish delusions from shared cultural/religious beliefs
- **Insight**: individuals with thought disorder can often recognize it in others but not in themselves
- **Comorbidity**: mood and psychotic disorders frequently co-occur`,
    },
    {
      topicId: T["Personality Disorders"],
      title: "Personality Disorders",
      content: `# Personality Disorders

## General Criteria (Must meet A through F)
- **A**: Manifested in 2+ of: cognition, affectivity, interpersonal functioning, impulse control
- **B**: Inflexible and pervasive across personal and social situations
- **C**: Clinically significant distress or impairment
- **D**: Stable and long duration, traceable to adolescence/early adulthood
- **E**: Not better explained by another mental disorder
- **F**: Not attributable to a substance or medical condition

### Key Clinical Features
- **Ego-syntonic**: traits feel natural and self-consistent (unlike ego-dystonic symptoms in depression/OCD)
- **"Contagious"**: evoke strong complementary reactions in clinicians and others
- **Pattern-based**: embedded in relational patterns, not just symptomatic states

---

## Cluster A — Odd/Eccentric

| Disorder | Core Feature | 4+ Criteria Include |
|----------|-------------|---------------------|
| Paranoid PD | Pervasive distrust/suspiciousness | Suspects exploitation, reads hidden meaning, holds grudges, suspects infidelity |
| Schizoid PD | Social detachment, restricted affect | No desire for relationships, solitary, no close friends, indifferent to praise/criticism |
| Schizotypal PD | Cognitive/perceptual distortions + social discomfort | Magical thinking, odd beliefs, unusual perceptions, eccentric behavior, excessive social anxiety |

---

## Cluster B — Dramatic/Emotional/Erratic

| Disorder | Core Feature | Key Criteria |
|----------|-------------|--------------|
| Antisocial PD | Disregard for others' rights | 3+ of: law violations, deceit, impulsivity, aggression, recklessness, irresponsibility, no remorse; conduct disorder before 15 |
| Borderline PD | Instability in relationships, self-image, affect + impulsivity | 5+ of 9: abandonment fear, unstable relationships (splitting), identity disturbance, impulsivity, suicidal behavior, affective instability, emptiness, anger, paranoid ideation |
| Histrionic PD | Excessive emotionality and attention-seeking | Uncomfortable when not center of attention; dramatic, theatrical |
| Narcissistic PD | Grandiosity, need for admiration, lack of empathy | 5+ of 9: grandiose self-importance, fantasies of success, sense of entitlement, exploits others, lacks empathy, envious, arrogant |

---

## Cluster C — Anxious/Fearful

| Disorder | Core Feature |
|----------|-------------|
| Avoidant PD | Social inhibition, feelings of inadequacy, hypersensitivity to criticism |
| Dependent PD | Excessive need to be taken care of; submissive, clinging |
| OCPD | Preoccupation with orderliness, perfectionism, control (distinct from OCD) |

---

## Treatment Considerations
- Build therapeutic alliance before confronting defenses
- Manage **countertransference** (the clinician's emotional reactions to the patient)
- For immature defenses: warmth, peer/group limit-setting, empathy to regulate anxiety
- Gradual interpretation — make defenses **ego-dystonic** before expecting change`,
    },
    {
      topicId: T["ADHD & Medications"],
      title: "ADHD & Medications",
      content: `# ADHD & Medications

## Neurobiology of ADHD

### Core Dysregulation
- **Frontal-subcortical-cerebellar catecholaminergic circuits**
- Dopamine transporter (DAT) abnormalities
- Deficient NE modulation of prefrontal cortex

### Key Brain Regions
| Region | ADHD-Relevant Function |
|--------|----------------------|
| Dorsal anterior cingulate | Selective attention |
| Dorsolateral prefrontal cortex | Sustained attention, problem-solving, working memory |
| Orbitofrontal cortex | Impulse control |
| Premotor cortex | Hyperactivity |
| Cerebellum | Timing, motor coordination |

## DSM-5 Diagnosis
- Symptoms present **before age 12**
- Present in **2+ settings**
- Types: Predominantly Inattentive, Predominantly Hyperactive-Impulsive, Combined
- More common in males; highly comorbid (anxiety, depression, learning disorders)

---

## Stimulant Medications (Class II Controlled Substances)

### Methylphenidate (blocks DAT + NET)
| Formulation | Delivery | Duration |
|-------------|----------|----------|
| Ritalin | Immediate release | 4-6 hrs |
| Ritalin LA | Beaded capsule | 8-10 hrs |
| Concerta (OROS) | Osmotic pump | 10-12 hrs |
| Daytrana | Transdermal patch | Flexible (removable) |
| Jornay PM | Delayed-release | Taken at bedtime; activates AM |

### Amphetamines (block DAT + NET; also increase release)
| Formulation | Notes |
|-------------|-------|
| Adderall | Mixed amphetamine salts |
| Adderall XR | Extended release |
| Vyvanse (lisdexamfetamine) | Prodrug; lower abuse potential; 40% of ADHD Rx |

---

## Non-Stimulant Medications

| Drug | Class | Mechanism | Notes |
|------|-------|-----------|-------|
| Atomoxetine (Strattera) | SNRI | Selective NRI | Slower onset; off-label for MDD; no controlled substance |
| Viloxazine (Qelbree) | NRI + serotonin modulator | Newer; no clear advantage over Strattera |
| Guanfacine (Intuniv) | Alpha-2 agonist | Second line; also reduces anxiety |
| Clonidine (Kapvay) | Alpha-2 agonist | Second line; originally for hypertension |
| Modafinil/Armodafinil | Dopamine RI | Class IV; reduces sleepiness; cognitive boost |

---

## Non-Medication Interventions
- **Behavioral modification**: contingency management
- **IEP** (Individuals with Disabilities Education Act): individualized education with specialized services
- **504 Plan**: accommodations without special education placement
- **PTBM**: parent training in behavioral management
- **Group social skills training**

## Common Side Effects (Stimulants)
- Insomnia (especially with late dosing)
- Appetite suppression / weight loss
- Growth suppression in children (monitor height/weight)
- Elevated heart rate and blood pressure
- Rarely: tics, mood lability, cardiac concerns`,
    },
    {
      topicId: T["Language Processing & Aphasia"],
      title: "Language Processing & Aphasia",
      content: `# Language Processing & Aphasia

## Language Components
| Component | Definition | Example |
|-----------|-----------|---------|
| Phonemes | Smallest units of sound | /b/, /p/, /k/ |
| Morphemes | Smallest units of meaning | "un-" + "happy" = unhappy |
| Syntax | Rules for sentence structure | SVO order in English |
| Semantics | Meaning of words and sentences | "bank" (financial vs river) |
| Pragmatics | Context and social use | Sarcasm, implicature |
| Prosody | Rhythm, stress, and intonation | Differentiates questions from statements |

## Chomsky's Model
- **Universal grammar**: innate language acquisition device (LAD)
- **Deep structure**: underlying meaning
- **Surface structure**: how the meaning is expressed
- **Transformational rules**: map between deep and surface structures

---

## Aphasia Classification

### Perisylvian Syndromes (Impaired Repetition)
| Aphasia | Fluency | Comprehension | Repetition | Lesion |
|---------|---------|---------------|------------|--------|
| Broca's | Non-fluent, agrammatic | Relatively intact | Impaired | Left IFG (Broca's area) |
| Wernicke's | Fluent, jargon | Severely impaired | Impaired | Left posterior STG |
| Conduction | Relatively fluent, paraphasias | Relatively intact | Severely impaired | Arcuate fasciculus / supramarginal gyrus |
| Global | Non-fluent | Severely impaired | Severely impaired | Large perisylvian |

### Extrasylvian (Transcortical) Syndromes (Intact Repetition)
| Aphasia | Fluency | Comprehension | Repetition | Notes |
|---------|---------|---------------|------------|-------|
| Transcortical Motor (TCM) | Non-fluent | Intact | Intact | Like Broca's but repetition spared |
| Transcortical Sensory (TCS) | Fluent | Impaired | Intact | Like Wernicke's; may have echolalia |
| Mixed Transcortical | Non-fluent | Impaired | Intact | Echolalia prominent |

### Non-Localizing
- **Anomic aphasia**: word-finding difficulty, circumlocution; comprehension and repetition intact; most common residual aphasia

---

## Related Disorders
| Disorder | Description |
|----------|-------------|
| Alexia with agraphia | Cannot read or write; angular gyrus lesion |
| Alexia without agraphia (pure alexia) | Cannot read; can write; visual-language disconnection |
| Expressive aprosodia | Cannot convey emotional tone in speech |
| Receptive aprosodia | Cannot interpret others' emotional prosody |

---

## Speech Perception Models
- **TRACE Model**: interactive activation — top-down and bottom-up processing bidirectionally connect features, phonemes, and words
- **Cohort Model**: word recognition begins with the first phoneme; candidate pool narrows as more input arrives
- **Phonemic restoration effect**: listeners fill in missing phonemes using lexical/contextual top-down knowledge`,
    },
    {
      topicId: T["Apraxia & Agnosia"],
      title: "Apraxia & Agnosia",
      content: `# Apraxia & Agnosia

## Apraxia Overview
**Definition**: Inability to perform purposeful/skilled movements despite:
- Intact primary motor function (no weakness)
- Intact sensory function
- Understanding the task
- Willingness to perform

Apraxia involves dysfunction in **cortical motor planning** (association cortex level).

---

## Types of Apraxia

| Type | Core Deficit | Lesion Site | Test |
|------|-------------|-------------|------|
| Kinetic (limb-kinetic) | Clumsiness in precision acts; motor degradation | Corticospinal, corticobasal, prefrontal | Finger tapping, grooved pegboard |
| Ideomotor | Pantomime errors on command or imitation | Left frontoparietal, arcuate fasciculus | Pantomime tool use |
| Ideational | Failure of complex multi-step sequences | Frontal lobes | "Show me how to mail a letter" |
| Conduction | Imitation more impaired than command | Left inferior parietal, arcuate | Imitate examiner |
| Conceptual | Tool-object relationship knowledge deficit | Left parietal; Alzheimer's | Select correct tool for task |
| Apraxia of speech | Articulatory planning deficit; automatic speech preserved | Broca's area, insula, premotor, SMA | Connected speech, word repetition |

### Ideomotor Apraxia Error Types
- **Content errors**: substitute different pantomime (wrong movement)
- **Postural errors**: use body part as the tool (e.g., finger as toothbrush)
- **Spatial movement errors**: wrong trajectory or body orientation
- **Temporal errors**: timing or sequencing wrong

---

## Assessment Protocol
**Order**: Pantomime to command → Imitate examiner → Use actual object
- Assess **both limbs** (apraxia can be unilateral or bilateral)
- Cross-modality testing reveals which representational level is impaired

---

## Types of Agnosia

### Visual Agnosia
- **Apperceptive**: failure at perceptual level (cannot copy shapes)
- **Associative**: perception intact but cannot assign meaning (can copy but not name)
- **Prosopagnosia**: face recognition failure; fusiform face area (ventral stream)
- **Akinetopsia**: motion perception failure; area MT/V5

### Auditory Agnosia
- Cannot recognize sounds despite intact hearing
- **Phonagnosia**: familiar voices
- **Auditory verbal agnosia**: cannot recognize words (with intact phoneme perception)

### Somatosensory Agnosia
- **Astereognosia**: cannot identify objects by touch; requires intact somatosensory cortex
- **Asomatognosia**: failure to recognize own body parts; right parietal lesion

### Balint's Syndrome
Bilateral parietal-occipital lesion causing:
1. **Simultanagnosia**: can only perceive one object at a time
2. **Optic ataxia**: misreaching under visual guidance
3. **Oculomotor apraxia**: difficulty voluntarily directing gaze`,
    },
    {
      topicId: T["Neurocognitive Disorders"],
      title: "Neurocognitive Disorders: Huntington's, Parkinson's, Lewy Body, TBI, HIV, Delirium & Pain",
      content: `# Neurocognitive Disorders

## Huntington's Disease (HD)

### Genetics
- **Autosomal dominant**: single HTT gene mutation on chromosome 4
- CAG trinucleotide repeats: normal (10–27), intermediate (27–35), pathological (36+)
- Longer repeat length = earlier onset (anticipation)

### Pathophysiology
- Excitotoxicity (glutamate), mitochondrial dysfunction, protein misfolding
- **Basal ganglia degeneration**: caudate → "boxcar ventricles" on imaging

### Neuropsychological Profile
- **Motor**: chorea, dystonia, dysphagia, motor impersistence
- **Cognitive**: executive dysfunction, memory encoding/retrieval, visuospatial
- **Psychiatric** (often precedes motor): depression (most common), anxiety, OCD features, psychosis

---

## Parkinson's Disease (PD)

### Pathophysiology
- Loss of dopaminergic neurons in **substantia nigra pars compacta**
- **Lewy bodies** (alpha-synuclein accumulations) in neurons
- Gut-brain connection: alpha-synuclein may originate in enteric nervous system

### Cardinal Symptoms
1. **Bradykinesia** (required for diagnosis)
2. **Tremor** (resting, pill-rolling; improves with action)
3. **Rigidity** (cogwheel or lead-pipe; bilateral)
4. Postural instability (later)

### Neuropsychological Features
- 50–80% develop dementia
- Subcortical pattern: executive function, attention, processing speed
- Visual hallucinations (75% later; often benign with insight initially)
- Depression, apathy, sleep disturbance

---

## Dementia with Lewy Bodies (DLB)

### Core Features (2 required for probable DLB)
1. **Fluctuating cognition** (especially alertness; staring spells)
2. **Visual hallucinations** (80%; often formed, recurring, not distressing early)
3. **Parkinsonism** (after cognitive onset — distinguishes from PD dementia)
4. **REM sleep behavior disorder** (acts out dreams; loss of muscle atonia)

### Key Distinguishing Features vs Alzheimer's
- DLB: early hallucinations, prominent attention/executive impairment, parkinsonism
- AD: primary amnestic presentation first, cortical pattern
- DLB most commonly **misdiagnosed as Alzheimer's disease**
- **Neuroleptic sensitivity**: antipsychotics can cause severe reactions in DLB

---

## Traumatic Brain Injury (TBI)

### Severity Classification
| Level | GCS Score | LOC |
|-------|-----------|-----|
| Mild (concussion) | 13-15 | <30 min |
| Moderate | 9-12 | 30 min – 24 hrs |
| Severe | ≤8 | >24 hrs |

### Vascular Injuries
- **Epidural hematoma**: arterial bleed between skull and dura; "lucid interval"
- **Subdural hematoma**: venous bleed between dura and arachnoid; common in elderly on anticoagulants
- **Subarachnoid hemorrhage**: between pia and arachnoid; thunderclap headache

### Chronic Traumatic Encephalopathy (CTE)
- Repetitive brain trauma → tau protein accumulation
- Diagnosed post-mortem only; associated with contact sports
- Progressive; impairs executive function, mood, behavior

---

## HIV-Associated Neurocognitive Disorders (HAND)

### Frascati Criteria
| Category | Cognitive Deficit | Functional Impact |
|----------|-------------------|-------------------|
| ANI | ≥1 SD below in 2+ domains | None |
| MND | ≥1 SD below in 2+ domains | Mild (~12%) |
| HAD | ≥1 SD below in 2+ domains | Marked (~2%) |

### Neuropsychological Profile
- **Subcortical pattern**: executive dysfunction, psychomotor slowing, memory retrieval
- Amyloid: intracellular (HIV) vs extracellular (Alzheimer's)

---

## Delirium

### Characteristics
- **Acute onset**, fluctuating course (varies throughout the day)
- Impaired attention and arousal (primary)
- Confusion, hallucinations, delusions, disorientation

### Subtypes
| Type | Behavior | Clinical Challenge |
|------|----------|-------------------|
| Hyperactive | Agitated, combative | Injury risk |
| Hypoactive | Quiet, withdrawn | Frequently missed |
| Mixed | Alternating | Most common |

### Key Differential: Delirium vs Dementia
- Delirium: acute/hours; fluctuating; often reversible
- Dementia: gradual/months-years; progressive; generally irreversible

---

## Cortical Pain Processing

### Pain Pathways
- **Sharp pain**: Aδ fibers (myelinated) → spinothalamic → thalamus → somatosensory cortex
- **Dull/chronic pain**: C fibers (unmyelinated) → spinoreticular → limbic system

### Key Brain Regions in Pain
| Region | Function |
|--------|----------|
| Anterior cingulate cortex | Emotional/affective component of pain (suffering) |
| Somatosensory cortex | Sensory-discriminative (location, intensity) |
| Prefrontal cortex | Cognitive appraisal, coping |
| Periaqueductal gray (PAG) | Endogenous opioid analgesia; descending inhibition |

### Gate Control Theory (Melzack & Wall)
- Large-diameter A-β fibers (touch) activate inhibitory interneurons in dorsal horn
- These interneurons "close the gate" to C-fiber pain transmission
- Basis for TENS, massage, and distraction for pain relief`,
    },
  ];

  await db.insert(studyGuidesTable).values(studyGuides);
  console.log(`Inserted ${studyGuides.length} study guides`);

  // ===========================================================================
  // PRACTICE EXAMS + QUESTION LINKS
  // ===========================================================================
  const allTopics = await db.select().from(topicsTable);
  const allQuizQuestions = await db.select().from(quizQuestionsTable);

  const practiceExamValues = allTopics.map(topic => ({
    topicId: topic.id,
    title: `${topic.name} Practice Exam`,
    timeLimit: 600,
    passingScore: 70,
  }));

  const insertedExams = await db.insert(practiceExamsTable).values(practiceExamValues).returning();
  console.log(`Inserted ${insertedExams.length} practice exams`);

  const examQuestionRows: Array<{ examId: number; questionId: number; questionOrder: number }> = [];
  for (const exam of insertedExams) {
    const topicQs = allQuizQuestions.filter(q => q.topicId === exam.topicId).slice(0, 10);
    topicQs.forEach((q, i) => {
      examQuestionRows.push({ examId: exam.id, questionId: q.id, questionOrder: i + 1 });
    });
  }

  if (examQuestionRows.length > 0) {
    await db.insert(practiceExamQuestionsTable).values(examQuestionRows);
    console.log(`Inserted ${examQuestionRows.length} practice exam question links`);
  }

  console.log("Seeding complete!");
  console.log(`Summary: ${flashcards.length} flashcards, ${quizQuestions.length} quiz questions, ${studyGuides.length} study guides, ${insertedExams.length} practice exams`);
}

seed()
  .then(() => { console.log("Done!"); process.exit(0); })
  .catch(err => { console.error("Seed error:", err); process.exit(1); });
