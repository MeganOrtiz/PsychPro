import { db } from "./index";
import { topicsTable, flashcardsTable, quizQuestionsTable, studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable } from "./schema";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding PsychPro from course notes...");

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
    { name: "Neurocognitive Disorders", category: "Clinical", description: "Alzheimer's, Parkinson's, Lewy body dementia, Huntington's, TBI, vascular dementia, HIV neurocognition, and capacity assessment." },
  ]).returning();

  const T: Record<string, number> = {};
  topics.forEach(t => { T[t.name] = t.id; });

  // ===========================================================================
  // FLASHCARDS (14 per topic = 210 total)
  // ===========================================================================
  const flashcards = [
    // ===== 1. NEUROPSYCHOLOGY OVERVIEW =====
    { topicId: T["Neuropsychology Overview"], question: "What is neuropsychology?", answer: "The scientific study of brain-behavior relationships — how the structure and function of the brain relate to cognition, emotion, and behavior.", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What is the difference between a neurologist and a neuropsychologist?", answer: "A neurologist focuses on the medical/neurological aspects of brain disorders; a neuropsychologist focuses on cognition, emotion, and behavior using neuropsychological assessment.", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What is a lesion study and why is it important?", answer: "A lesion study examines how damage to a specific brain area affects behavior or cognition, helping establish causal brain-behavior relationships.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is a double dissociation?", answer: "Evidence that two functions are independent: Patient A has impairment in function X but not Y, while Patient B has impairment in Y but not X.", difficulty: "hard" },
    { topicId: T["Neuropsychology Overview"], question: "What are the lobes of the cerebral cortex?", answer: "Frontal (executive, motor), Parietal (somatosensory, spatial), Temporal (auditory, memory, language), and Occipital (visual processing).", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What is the difference between contralateral and ipsilateral?", answer: "Contralateral = opposite side of the body (most motor/sensory pathways cross); Ipsilateral = same side.", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What are hold tests vs. no-hold tests in neuropsychology?", answer: "Hold tests (e.g., vocabulary, fund of knowledge) are resistant to brain damage and estimate premorbid IQ; no-hold tests (e.g., digit span, block design) are sensitive to impairment.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is diaschisis?", answer: "Transient loss of function in brain regions distant from an injury due to disrupted connections, even though those areas are structurally intact.", difficulty: "hard" },
    { topicId: T["Neuropsychology Overview"], question: "What does the frontal lobe do?", answer: "Executive functions: planning, working memory, inhibition, set-shifting, reasoning, and motor control via the primary motor cortex.", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What does the parietal lobe do?", answer: "Integrates sensory information, spatial processing, visuospatial skills, somatosensory processing, and math abilities.", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What is the difference between statistically significant and clinically significant?", answer: "Statistically significant means the result is unlikely due to chance; clinically significant means the result is meaningful and impactful for patient functioning.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is cognitive reserve?", answer: "The brain's resilience to damage built up through education, intellectual activity, and social engagement — allowing some individuals to tolerate more pathology before symptoms appear.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is a base rate in neuropsychological assessment?", answer: "The frequency of a finding in the general population — used to determine whether a low score is truly abnormal or commonly seen in healthy individuals.", difficulty: "hard" },
    { topicId: T["Neuropsychology Overview"], question: "What is ecological validity?", answer: "The degree to which neuropsychological test performance predicts real-world, everyday functional abilities.", difficulty: "medium" },

    // ===== 2. CELL BIOLOGY & NEURON ANATOMY =====
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What are the three main parts of a neuron?", answer: "Cell body (soma), dendrites (receive signals), and axon (transmit signals to other neurons).", difficulty: "easy" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the resting membrane potential?", answer: "Approximately -70 mV, maintained by the Na+/K+ ATPase pump and selectively permeable membranes; the inside of the cell is more negative than the outside.", difficulty: "easy" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is an action potential?", answer: "An all-or-none electrical signal triggered at the axon hillock when membrane potential reaches threshold (~-55 mV), propagating down the axon.", difficulty: "easy" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What causes depolarization during an action potential?", answer: "Rapid influx of Na+ through voltage-gated sodium channels, driving the membrane potential from -70 mV toward +40 mV.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is saltatory conduction?", answer: "The action potential jumps between nodes of Ranvier along a myelinated axon, greatly increasing conduction velocity.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What are oligodendrocytes?", answer: "Glial cells in the CNS that produce the myelin sheath; one oligodendrocyte can myelinate multiple axons.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the axon hillock?", answer: "The region where the axon emerges from the soma; the site of action potential initiation because it has the highest density of voltage-gated Na+ channels.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the all-or-none law?", answer: "A neuron fires a full-sized action potential or does not fire at all — the amplitude does not vary with stimulus strength; intensity is coded by firing rate.", difficulty: "easy" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is spatial summation?", answer: "Integration of simultaneous excitatory and inhibitory inputs from multiple synaptic sites; the combined effect determines whether the postsynaptic neuron reaches threshold.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is temporal summation?", answer: "Integration of rapidly successive inputs at the same synapse; each postsynaptic potential adds before the previous one decays.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the absolute refractory period?", answer: "The period immediately after an action potential during which no stimulus, regardless of strength, can trigger another action potential — Na+ channels are inactivated.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What are astrocytes?", answer: "The most numerous glial cells; they maintain the blood-brain barrier, provide metabolic support, regulate extracellular ion concentrations, and play a role in synaptogenesis.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is an EPSP?", answer: "An Excitatory PostSynaptic Potential — a graded depolarization that moves the membrane potential toward threshold, increasing the probability of firing.", difficulty: "easy" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is an IPSP?", answer: "An Inhibitory PostSynaptic Potential — a graded hyperpolarization that moves the membrane potential away from threshold, decreasing the probability of firing.", difficulty: "easy" },

    // ===== 3. NEUROTRANSMITTERS & SYNAPTIC TRANSMISSION =====
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are the main monoamine neurotransmitters?", answer: "Dopamine, norepinephrine, epinephrine (catecholamines), and serotonin (indolamine) — synthesized from amino acid precursors.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is glutamate's role in the brain?", answer: "Glutamate is the primary excitatory neurotransmitter — it acts on AMPA, NMDA, and kainate receptors and is involved in ~90% of fast excitatory transmission.", difficulty: "easy" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is GABA's role in the brain?", answer: "GABA (gamma-aminobutyric acid) is the primary inhibitory neurotransmitter; GABA-A receptors are ionotropic (Cl- channel) and GABA-B are metabotropic.", difficulty: "easy" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the difference between ionotropic and metabotropic receptors?", answer: "Ionotropic receptors are ion channels — binding causes immediate ion flow; metabotropic receptors are G-protein coupled and have slower, longer-lasting effects via second messengers.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is reuptake?", answer: "The process by which the presynaptic neuron takes back released neurotransmitter from the synapse, terminating its action — targeted by many antidepressants (e.g., SSRIs block serotonin reuptake).", difficulty: "easy" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What does dopamine do in the reward pathway?", answer: "Dopamine in the mesolimbic system (VTA → nucleus accumbens) signals reward prediction and reinforcement, driving motivation and reward-seeking behavior.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the role of acetylcholine in the nervous system?", answer: "Acetylcholine is the neurotransmitter at the neuromuscular junction, in the ANS, and is key to memory/learning (especially in hippocampus) — loss of cholinergic neurons is linked to Alzheimer's.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the dopamine hypothesis of schizophrenia?", answer: "Schizophrenia involves excess dopamine activity in the mesolimbic pathway (positive symptoms) and reduced activity in the mesocortical pathway (negative symptoms).", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are neuropeptides?", answer: "Larger, slower-acting signaling molecules (e.g., endorphins, substance P, oxytocin) that often co-release with classical neurotransmitters and modulate neural activity.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is norepinephrine's role in the brain?", answer: "Norepinephrine (from locus coeruleus) regulates arousal, attention, and the fight-or-flight response; implicated in depression, anxiety, and PTSD.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is an autoreceptor?", answer: "A presynaptic receptor that detects the neuron's own released neurotransmitter and provides feedback — typically inhibiting further release (self-regulation).", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the NMDA receptor and why is it important?", answer: "An ionotropic glutamate receptor permeable to Ca2+ that requires both ligand binding AND membrane depolarization to open (coincidence detector) — critical for LTP and memory formation.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is long-term potentiation (LTP)?", answer: "A persistent strengthening of synapses based on repeated simultaneous activation — a cellular mechanism underlying learning and memory, dependent on NMDA receptor activation.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is serotonin's role in behavior?", answer: "Serotonin (from raphe nuclei) regulates mood, sleep, appetite, and impulse control; low serotonin is linked to depression and anxiety.", difficulty: "easy" },

    // ===== 4. SENSORY PATHWAYS =====
    { topicId: T["Sensory Pathways"], question: "What is the dorsal column-medial lemniscal pathway?", answer: "An ascending sensory pathway carrying fine touch, vibration, and proprioception — ipsilateral in spinal cord, crosses at the medulla, and projects to the somatosensory cortex.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What does the spinothalamic tract carry?", answer: "Pain, temperature, and crude touch — it crosses immediately in the spinal cord and ascends contralaterally to the thalamus.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the corticospinal tract?", answer: "The primary descending motor pathway from motor cortex to spinal motor neurons; crosses in the medulla (pyramidal decussation), controlling voluntary movement of the contralateral body.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is a dermatome?", answer: "A strip of skin innervated by a single spinal nerve root — dermatome maps are used clinically to localize spinal cord or nerve injuries.", difficulty: "easy" },
    { topicId: T["Sensory Pathways"], question: "What is the difference between UMN and LMN lesions?", answer: "Upper motor neuron (UMN) lesions cause spasticity and hyperreflexia; lower motor neuron (LMN) lesions cause flaccidity, muscle wasting, and hyporeflexia.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "Where does the dorsal column pathway cross?", answer: "In the medulla (at the nucleus gracilis and cuneatus level) — not in the spinal cord. This is why ipsilateral column deficits indicate spinal pathology.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What is the role of the thalamus in sensory processing?", answer: "The thalamus acts as the relay station for almost all sensory information (except olfaction) en route to the cortex; the lateral geniculate nucleus relays visual; medial geniculate relays auditory.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What does the cerebellum do?", answer: "The cerebellum coordinates movement, balance, and fine motor control — it compares intended vs. actual movement and makes corrections; damage causes ataxia.", difficulty: "easy" },
    { topicId: T["Sensory Pathways"], question: "What is the reticular activating system (RAS)?", answer: "A network in the brainstem that regulates arousal, consciousness, and attention by sending activating signals to the cortex — damage causes coma or reduced consciousness.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is Brown-Séquard syndrome?", answer: "Hemisection of the spinal cord causing ipsilateral loss of fine touch and proprioception (dorsal column) and contralateral loss of pain and temperature (spinothalamic) below the lesion.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What are the three meninges layers?", answer: "Dura mater (outermost), arachnoid mater (middle), and pia mater (innermost, closely follows brain surface). CSF flows in the subarachnoid space.", difficulty: "easy" },
    { topicId: T["Sensory Pathways"], question: "What is the function of the basal ganglia?", answer: "A group of subcortical nuclei involved in voluntary movement initiation, habit learning, and motor sequence control; degeneration causes Parkinson's and Huntington's disease.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the somatotopic organization of the motor cortex?", answer: "The motor cortex is organized as a 'motor homunculus' — different body regions are mapped spatially, with disproportionately large representations for the hands, face, and tongue.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is proprioception?", answer: "The sense of body position in space — carried by muscle spindles and Golgi tendon organs, transmitted through the dorsal columns, critical for movement coordination.", difficulty: "easy" },

    // ===== 5. SENSORY SYSTEMS =====
    { topicId: T["Sensory Systems"], question: "What is the pathway from retina to visual cortex?", answer: "Retina → optic nerve → optic chiasm (nasal fibers cross) → lateral geniculate nucleus (LGN) of thalamus → primary visual cortex (V1, occipital lobe).", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the 'what' vs. 'where' visual pathway?", answer: "The ventral stream (occipitotemporal) identifies WHAT an object is; the dorsal stream (occipitoparietal) determines WHERE it is and guides action.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the tonotopic organization of the auditory system?", answer: "Different frequencies are processed at different locations along the basilar membrane of the cochlea — high frequencies at the base, low frequencies at the apex.", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "Where is the primary auditory cortex located?", answer: "In the superior temporal gyrus (Heschl's gyri), Brodmann areas 41 and 42, in the temporal lobe — it receives input from the medial geniculate nucleus of the thalamus.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the vestibular system's function?", answer: "Detects head position and movement (acceleration and gravity) using the semicircular canals (rotation) and otolith organs (linear acceleration) — critical for balance and eye stabilization.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the somatosensory cortex and where is it?", answer: "The primary somatosensory cortex (S1) is located in the postcentral gyrus of the parietal lobe — it processes touch, pain, temperature, and proprioception in a somatotopic map.", difficulty: "easy" },
    { topicId: T["Sensory Systems"], question: "What is pain gate theory?", answer: "Melzack and Wall's theory that non-painful stimuli (large fiber input) can 'close the gate' in the dorsal horn, reducing pain signal transmission to the brain.", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is the olfactory system's unique anatomical feature?", answer: "Olfaction is the only sense that does not relay through the thalamus — olfactory signals go directly from the olfactory bulb to the piriform cortex and limbic system.", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is the role of the superior colliculus?", answer: "A midbrain structure that controls reflexive eye movements (saccades) and visual orienting responses toward sudden stimuli.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What are the different types of skin mechanoreceptors?", answer: "Meissner's corpuscles (light touch, texture), Pacinian corpuscles (vibration, deep pressure), Merkel's discs (sustained pressure, shape), and Ruffini endings (skin stretch).", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is achromatopsia?", answer: "The inability to perceive color — caused by damage to V4 in the ventral visual stream (color processing area).", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is homonymous hemianopia?", answer: "Loss of vision in the same half of the visual field in both eyes — caused by damage to the optic tract or visual cortex on one side (e.g., right cortex lesion → left visual field loss).", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the function of the cerebellum in motor control?", answer: "The cerebellum fine-tunes movement timing and coordination by comparing intended movement (efference copy) with actual movement feedback — lesions cause ataxia, dysmetria, and intention tremor.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the dorsal vs. ventral visual stream?", answer: "Dorsal stream: 'where/how' pathway (occipital → parietal), guides movement; Ventral stream: 'what' pathway (occipital → temporal), identifies objects, faces, and color.", difficulty: "medium" },

    // ===== 6. LIMBIC SYSTEM & MOTIVATION =====
    { topicId: T["Limbic System & Motivation"], question: "What structures make up the limbic system?", answer: "Hippocampus, amygdala, cingulate cortex, parahippocampal gyrus, fornix, mammillary bodies, thalamus, and hypothalamus — together they regulate emotion and memory.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is the role of the hippocampus?", answer: "The hippocampus is critical for forming new declarative memories (episodic and semantic) and spatial navigation — bilateral damage (like in H.M.) causes severe anterograde amnesia.", difficulty: "easy" },
    { topicId: T["Limbic System & Motivation"], question: "What does the amygdala do?", answer: "The amygdala processes emotional significance of stimuli, especially fear and threat — it modulates memory consolidation for emotionally charged events and drives fear conditioning.", difficulty: "easy" },
    { topicId: T["Limbic System & Motivation"], question: "What is the Papez circuit?", answer: "A circuit linking hippocampus → fornix → mammillary bodies → thalamus → cingulate cortex → entorhinal cortex → hippocampus, proposed by James Papez as the basis of emotional experience.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the role of the hypothalamus?", answer: "The hypothalamus regulates hunger, thirst, body temperature, sexual behavior, circadian rhythms, and the HPA stress axis — it links the nervous and endocrine systems.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is the mesolimbic dopamine pathway?", answer: "The reward pathway from the VTA (ventral tegmental area) to the nucleus accumbens — drives motivation, reward, and pleasure; disrupted in addiction and schizophrenia.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What are the lateral and ventromedial hypothalamus's roles in hunger?", answer: "Lateral hypothalamus is the 'hunger center' (lesion → aphagia/starvation); ventromedial hypothalamus is the 'satiety center' (lesion → hyperphagia and obesity).", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the role of orexin/hypocretin?", answer: "Neuropeptides from the lateral hypothalamus that promote wakefulness and regulate appetite; loss of orexin neurons causes narcolepsy.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What are the four Fs of hypothalamic function?", answer: "Fighting, Fleeing, Feeding, and Fornicating — the four basic drives regulated by the hypothalamus.", difficulty: "easy" },
    { topicId: T["Limbic System & Motivation"], question: "What is Klüver-Bucy syndrome?", answer: "A syndrome caused by bilateral amygdala and temporal lobe lesions; features include hypersexuality, hyperorality, emotional blunting, visual agnosia, and memory impairment.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the role of the cingulate cortex?", answer: "The anterior cingulate cortex integrates emotional and cognitive processing, plays a role in error monitoring, decision-making, and pain perception.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is intrinsic vs. extrinsic motivation?", answer: "Intrinsic motivation comes from internal rewards (e.g., enjoyment); extrinsic motivation comes from external rewards (e.g., money). Dopamine underlies both but is especially linked to reward anticipation.", difficulty: "easy" },
    { topicId: T["Limbic System & Motivation"], question: "What neurotransmitter is most associated with the reward system?", answer: "Dopamine — released in the nucleus accumbens in response to rewarding stimuli and the anticipation of reward; drives approach behavior and learning.", difficulty: "easy" },
    { topicId: T["Limbic System & Motivation"], question: "What is Urbach-Wiethe disease and why is it neuropsychologically significant?", answer: "A rare condition that calcifies the amygdala bilaterally — patients show no fear response, providing evidence that the amygdala is critical for processing fear.", difficulty: "hard" },

    // ===== 7. SLEEP & CIRCADIAN RHYTHMS =====
    { topicId: T["Sleep & Circadian Rhythms"], question: "What are the stages of NREM sleep?", answer: "NREM has 3 stages: N1 (light sleep, theta waves), N2 (sleep spindles, K-complexes), and N3 (deep/slow-wave sleep, delta waves). Most restorative sleep occurs in N3.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What characterizes REM sleep?", answer: "REM sleep features vivid dreaming, rapid eye movements, muscle atonia (paralysis), and brain activity similar to wakefulness (desynchronized EEG). It is critical for emotional memory processing.", difficulty: "easy" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the suprachiasmatic nucleus (SCN)?", answer: "The SCN in the hypothalamus is the brain's master circadian clock — it receives light signals from the retina via the retinohypothalamic tract and regulates the sleep-wake cycle.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the role of melatonin in sleep?", answer: "Melatonin is released by the pineal gland in darkness — it signals that it is nighttime, promoting sleep onset and regulating the circadian rhythm.", difficulty: "easy" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is narcolepsy?", answer: "A sleep disorder caused by loss of orexin (hypocretin) neurons in the lateral hypothalamus — features include excessive daytime sleepiness, cataplexy (sudden muscle weakness), sleep paralysis, and hypnagogic hallucinations.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is sleep apnea?", answer: "A disorder where breathing repeatedly stops during sleep — obstructive (airway collapse) or central (brain doesn't signal breathing). Causes fragmented sleep, hypoxia, and cognitive impairment.", difficulty: "easy" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the two-process model of sleep regulation?", answer: "Sleep is regulated by Process S (homeostatic sleep pressure — adenosine builds up with wakefulness) and Process C (circadian clock from the SCN). Both must align for quality sleep.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is adenosine's role in sleep?", answer: "Adenosine accumulates in the brain during wakefulness, increasing sleep pressure — caffeine works by blocking adenosine receptors, promoting wakefulness.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is REM sleep behavior disorder?", answer: "A parasomnia where the normal muscle atonia of REM is absent — patients physically act out their dreams, often injuring themselves or their partners; strongly associated with Parkinson's disease and DLB.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What happens to sleep stages in older adults?", answer: "Older adults show decreased N3 (slow-wave) sleep, reduced REM, more frequent awakenings, earlier sleep phase (advanced sleep phase syndrome), and more insomnia.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is a sleep spindle?", answer: "A burst of oscillatory neural activity (12-14 Hz) generated by thalamocortical circuits during N2 sleep — associated with memory consolidation, especially procedural learning.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What brain region generates the NREM slow waves?", answer: "The cortex generates slow oscillations in N3, coordinated by thalamocortical circuits — these are associated with memory consolidation and physical restoration.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is insomnia and what are its cognitive consequences?", answer: "Insomnia is difficulty falling or staying asleep; it impairs attention, memory consolidation, executive function, and mood regulation.", difficulty: "easy" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What EEG pattern is seen during relaxed wakefulness?", answer: "Alpha waves (8-12 Hz) predominate during relaxed, eyes-closed wakefulness; they are replaced by beta waves with active mental engagement.", difficulty: "medium" },

    // ===== 8. ENDOCRINE SYSTEM & REPRODUCTION =====
    { topicId: T["Endocrine System & Reproduction"], question: "What is the hypothalamic-pituitary-adrenal (HPA) axis?", answer: "The stress response system: hypothalamus releases CRH → anterior pituitary releases ACTH → adrenal cortex releases cortisol — cortisol then feeds back to inhibit the system.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What are the two divisions of the pituitary gland?", answer: "Anterior pituitary (adenohypophysis) — releases FSH, LH, ACTH, TSH, GH, prolactin via hormones from the hypothalamus; Posterior pituitary (neurohypophysis) — releases oxytocin and ADH (vasopressin).", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is cortisol's effect on the brain?", answer: "Chronic high cortisol damages the hippocampus (reducing volume and neurogenesis), impairs memory consolidation, and increases anxiety — the HPA axis dysregulation is linked to depression and PTSD.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the role of estrogen in the brain?", answer: "Estrogen promotes neuroplasticity, synaptic connectivity (especially in the hippocampus), and has neuroprotective effects — estrogen loss at menopause is associated with memory changes.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the role of testosterone in development?", answer: "Testosterone (from the testes) drives male sexual development, puberty changes, and has organizational effects on the brain during prenatal development — affecting neural circuitry for behavior.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is oxytocin's role?", answer: "Oxytocin (released from posterior pituitary) promotes social bonding, trust, maternal behavior, and uterine contractions during childbirth — often called the 'bonding hormone'.", difficulty: "easy" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the gonadal hormone axis?", answer: "GnRH (hypothalamus) → LH and FSH (anterior pituitary) → testosterone/estrogen/progesterone (gonads) — gonadal hormones feed back to regulate the axis.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the organizational vs. activational effect of hormones?", answer: "Organizational effects occur during prenatal development and permanently shape neural circuits; activational effects occur in adulthood and temporarily alter behavior (e.g., testosterone's effect on aggression).", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is ADH (vasopressin) and what does it do?", answer: "Antidiuretic hormone is released from the posterior pituitary — it increases water reabsorption in the kidneys to regulate fluid balance and blood pressure; also influences social behavior.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the role of the thyroid hormone in brain development?", answer: "Thyroid hormone is essential for normal brain development — hypothyroidism during development causes cretinism (intellectual disability); in adults it affects cognition and mood.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the adrenal medulla and what does it secrete?", answer: "The adrenal medulla secretes epinephrine (adrenaline) and norepinephrine in response to sympathetic nervous system activation during the fight-or-flight response.", difficulty: "easy" },
    { topicId: T["Endocrine System & Reproduction"], question: "What are the organizational effects of prenatal androgens on the brain?", answer: "Prenatal androgens masculinize neural circuits affecting spatial cognition, aggression, and sexual orientation — studied through conditions like congenital adrenal hyperplasia (CAH).", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is prolactin?", answer: "Prolactin is released from the anterior pituitary — it stimulates milk production (lactation) and is regulated by dopamine (which inhibits prolactin release). Antipsychotics block dopamine, raising prolactin.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What does growth hormone (GH) do?", answer: "GH from the anterior pituitary promotes body growth, protein synthesis, and fat metabolism — secreted in pulses during deep sleep; deficiency leads to short stature.", difficulty: "easy" },

    // ===== 9. PSYCHOPHARMACOLOGY =====
    { topicId: T["Psychopharmacology"], question: "What is the mechanism of SSRIs?", answer: "Selective serotonin reuptake inhibitors block the serotonin transporter (SERT), preventing reuptake of serotonin into the presynaptic neuron — increasing serotonin in the synaptic cleft.", difficulty: "easy" },
    { topicId: T["Psychopharmacology"], question: "What is the difference between agonist and antagonist?", answer: "An agonist binds to a receptor and activates it; an antagonist binds but does not activate it and blocks the agonist from binding.", difficulty: "easy" },
    { topicId: T["Psychopharmacology"], question: "How do benzodiazepines work?", answer: "Benzodiazepines (e.g., diazepam) are positive allosteric modulators of GABA-A receptors — they increase the frequency of Cl- channel opening when GABA is present, enhancing inhibitory effects.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is the mechanism of antipsychotics?", answer: "First-generation (typical) antipsychotics (e.g., haloperidol) primarily block D2 dopamine receptors. Second-generation (atypical) antipsychotics also block serotonin receptors with fewer extrapyramidal side effects.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is tardive dyskinesia?", answer: "A side effect of long-term antipsychotic use — involuntary, repetitive movements (especially of the face, lips, tongue) caused by dopamine receptor supersensitivity from chronic D2 blockade.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What are MAOIs and how do they work?", answer: "Monoamine oxidase inhibitors block the enzyme MAO that degrades monoamines (serotonin, norepinephrine, dopamine) — increasing their availability. Dietary restrictions needed (tyramine interactions).", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is lithium's mechanism in bipolar disorder?", answer: "Lithium's exact mechanism is unclear — it modulates second messenger systems (inositol phosphate, GSK-3β), reduces neuronal excitability, and has neuroprotective effects. It stabilizes mood in bipolar disorder.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What are stimulants and how do they work in ADHD?", answer: "Stimulants (e.g., methylphenidate, amphetamine) increase dopamine and norepinephrine in the prefrontal cortex — improving attention, impulse control, and working memory in ADHD.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is the half-life of a drug?", answer: "The time it takes for the drug's plasma concentration to decrease by 50% — drugs with longer half-lives have more sustained effects and take longer to clear.", difficulty: "easy" },
    { topicId: T["Psychopharmacology"], question: "What are opioids and how do they work?", answer: "Opioids (e.g., morphine, oxycodone) bind to mu, delta, and kappa opioid receptors in the brain and spinal cord — reducing pain perception and producing euphoria; highly addictive.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is the blood-brain barrier (BBB)?", answer: "A selective barrier formed by tight junctions between brain endothelial cells that restricts entry of many substances — drugs must be lipid-soluble or use active transport to enter the CNS.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is levodopa and why is it used in Parkinson's disease?", answer: "Levodopa is the precursor to dopamine — it crosses the BBB (dopamine cannot) and is converted to dopamine in the brain, replenishing depleted dopamine in the substantia nigra.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is drug tolerance?", answer: "Reduced response to a drug after repeated exposure — requires higher doses to achieve the same effect. Can result from receptor downregulation, increased metabolism, or cellular adaptation.", difficulty: "easy" },
    { topicId: T["Psychopharmacology"], question: "What are SNRIs?", answer: "Serotonin-norepinephrine reuptake inhibitors (e.g., venlafaxine, duloxetine) block both SERT and NET — used for depression, anxiety, and chronic pain.", difficulty: "medium" },

    // ===== 10. PSYCHOLOGICAL DISORDERS =====
    { topicId: T["Psychological Disorders"], question: "What are the positive symptoms of schizophrenia?", answer: "Positive symptoms are additions to normal experience: hallucinations, delusions, disorganized speech, and disorganized behavior.", difficulty: "easy" },
    { topicId: T["Psychological Disorders"], question: "What are the negative symptoms of schizophrenia?", answer: "Negative symptoms are deficits in normal function: alogia (poverty of speech), avolition (lack of motivation), anhedonia (inability to feel pleasure), flat affect, and asociality.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What brain abnormalities are seen in schizophrenia?", answer: "Enlarged ventricles, reduced prefrontal cortex activity (hypofrontality), reduced gray matter (especially temporal and frontal), and reduced hippocampal volume.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is the glutamate hypothesis of schizophrenia?", answer: "NMDA receptor hypofunction (especially on inhibitory interneurons) leads to excess dopamine and glutamate release — supported by ketamine and PCP (NMDA blockers) producing schizophrenia-like symptoms.", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What distinguishes bipolar I from bipolar II?", answer: "Bipolar I requires at least one manic episode (full manic episode may be without depression); Bipolar II requires at least one hypomanic episode and at least one major depressive episode — never a full manic episode.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is the monoamine hypothesis of depression?", answer: "Depression results from deficiencies in serotonin, norepinephrine, and/or dopamine — the basis for antidepressant treatments like SSRIs, SNRIs, and TCAs.", difficulty: "easy" },
    { topicId: T["Psychological Disorders"], question: "What is PTSD and what brain regions are involved?", answer: "Post-traumatic stress disorder involves hyperactive amygdala (fear response), reduced prefrontal inhibition of amygdala, and hippocampal volume loss affecting contextual fear memory.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is learned helplessness?", answer: "A state where an organism stops trying to escape aversive situations after repeated uncontrollable exposure — Seligman's model of depression, involving reduced motivation and behavioral inhibition.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is dissociation?", answer: "A disruption in the normal integration of consciousness, memory, identity, or perception — ranges from mild dissociation (daydreaming) to dissociative identity disorder (DID).", difficulty: "easy" },
    { topicId: T["Psychological Disorders"], question: "What are cognitive distortions in depression?", answer: "Aaron Beck's concept: negative automatic thoughts, arbitrary inference, overgeneralization, and the cognitive triad (negative views of self, world, and future).", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is a psychotic break vs. psychosis?", answer: "Psychosis is an ongoing state of losing contact with reality (hallucinations, delusions); a psychotic break refers to a sudden, often first episode of psychosis.", difficulty: "easy" },
    { topicId: T["Psychological Disorders"], question: "What is anosognosia in psychiatric disorders?", answer: "Lack of awareness of one's own mental illness — common in schizophrenia and mania, it is a neurological phenomenon related to right hemisphere dysfunction, not denial.", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What is catatonia?", answer: "A psychomotor syndrome involving motor immobility, mutism, negativism, or bizarre posturing — seen in schizophrenia, bipolar disorder, and as a response to medical conditions.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is schizoaffective disorder?", answer: "A disorder meeting criteria for both schizophrenia and a major mood episode (depressive or manic) — mood and psychotic symptoms occur concurrently and independently.", difficulty: "medium" },

    // ===== 11. PERSONALITY DISORDERS =====
    { topicId: T["Personality Disorders"], question: "What are the three personality disorder clusters?", answer: "Cluster A (odd/eccentric): paranoid, schizoid, schizotypal; Cluster B (dramatic/emotional): antisocial, borderline, histrionic, narcissistic; Cluster C (anxious/fearful): avoidant, dependent, obsessive-compulsive.", difficulty: "easy" },
    { topicId: T["Personality Disorders"], question: "What is borderline personality disorder (BPD)?", answer: "A Cluster B disorder characterized by unstable relationships, fear of abandonment, identity disturbance, impulsivity, self-harm, and emotional dysregulation — linked to amygdala hyperreactivity.", difficulty: "easy" },
    { topicId: T["Personality Disorders"], question: "What is antisocial personality disorder (ASPD)?", answer: "A Cluster B disorder featuring persistent disregard for others' rights, deceitfulness, impulsivity, aggression, and lack of remorse — must have conduct disorder history before age 15; associated with low amygdala activity.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What brain abnormalities are associated with BPD?", answer: "Hyperactive amygdala response to emotional stimuli, reduced prefrontal control of the amygdala, and altered anterior cingulate functioning affecting emotional regulation.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is schizotypal personality disorder?", answer: "A Cluster A disorder with odd beliefs, magical thinking, social isolation, and perceptual distortions — genetically related to schizophrenia but without full psychotic episodes.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is narcissistic personality disorder (NPD)?", answer: "A Cluster B disorder with grandiosity, need for admiration, lack of empathy, and entitlement — research suggests reduced gray matter in regions related to empathy and emotional regulation.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is the difference between a personality disorder and a personality trait?", answer: "A personality disorder is pervasive, inflexible, and causes significant distress or functional impairment — a personality trait is simply a consistent way of thinking and behaving.", difficulty: "easy" },
    { topicId: T["Personality Disorders"], question: "What is dialectical behavior therapy (DBT)?", answer: "A treatment developed by Marsha Linehan specifically for BPD — it combines cognitive-behavioral techniques with mindfulness and balances acceptance with change strategies.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is paranoid personality disorder?", answer: "A Cluster A disorder characterized by pervasive distrust and suspicion of others — individuals interpret others' motives as malevolent without sufficient basis.", difficulty: "easy" },
    { topicId: T["Personality Disorders"], question: "What is avoidant personality disorder?", answer: "A Cluster C disorder with social inhibition, feelings of inadequacy, and hypersensitivity to negative evaluation — unlike schizoid PD, patients desire social connection but fear rejection.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What neurobiological factors are linked to personality disorders generally?", answer: "Serotonin system dysfunction (impulsivity, aggression), dopamine dysregulation (paranoia, impulsivity), HPA axis dysregulation (stress sensitivity), and prefrontal-limbic imbalance.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is histrionic personality disorder?", answer: "A Cluster B disorder with excessive emotionality and attention-seeking behavior, discomfort when not the center of attention, rapidly shifting emotions, and seductive behavior.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is obsessive-compulsive personality disorder (OCPD) vs. OCD?", answer: "OCPD (Cluster C) is an ego-syntonic personality style of perfectionism, control, and rigidity — the individual is fine with it. OCD involves ego-dystonic intrusive obsessions and compulsions causing distress.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is the alternative DSM-5 model for personality disorders?", answer: "The DSM-5 Section III model assesses personality functioning (self/interpersonal) and pathological personality traits (negative affectivity, detachment, antagonism, disinhibition, psychoticism) as a dimensional approach.", difficulty: "hard" },

    // ===== 12. ADHD & MEDICATIONS =====
    { topicId: T["ADHD & Medications"], question: "What are the three DSM-5 presentations of ADHD?", answer: "Predominantly Inattentive, Predominantly Hyperactive-Impulsive, and Combined Presentation — symptoms must be present in at least two settings and impair functioning.", difficulty: "easy" },
    { topicId: T["ADHD & Medications"], question: "What brain regions are implicated in ADHD?", answer: "Prefrontal cortex (executive function, inhibition), anterior cingulate cortex (error monitoring), basal ganglia and cerebellum (timing and motor), and dopamine/norepinephrine circuits.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is the mechanism of methylphenidate (Ritalin)?", answer: "Methylphenidate blocks dopamine and norepinephrine reuptake transporters (DAT and NET), increasing DA and NE in the prefrontal cortex and improving executive function.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "How does amphetamine differ from methylphenidate?", answer: "Amphetamine (e.g., Adderall) both blocks reuptake AND reverses the transporter, actively pumping dopamine and norepinephrine out of the presynaptic neuron — stronger and longer-acting effect.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What is atomoxetine and how does it work?", answer: "Atomoxetine (Strattera) is a selective NE reuptake inhibitor (SNRI) — it is non-stimulant, has no abuse potential, and is FDA-approved for ADHD; particularly useful when stimulants are contraindicated.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What are DSM-5 age requirements for ADHD diagnosis?", answer: "Several inattentive or hyperactive-impulsive symptoms must be present before age 12 and cause impairment in two or more settings (e.g., home and school).", difficulty: "easy" },
    { topicId: T["ADHD & Medications"], question: "What is the heritability of ADHD?", answer: "ADHD has a heritability of approximately 70-80% — it is one of the most heritable psychiatric disorders, with multiple genes affecting dopamine and norepinephrine systems.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "How does ADHD differ in adults vs. children?", answer: "In adults, hyperactivity often presents as restlessness and subjective sense of tension rather than overt motor hyperactivity — inattention and executive function deficits remain prominent.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What are common inattentive symptoms of ADHD?", answer: "Difficulty sustaining attention, easily distracted, forgetfulness, losing things, failing to finish tasks, not listening when spoken to directly, and avoiding tasks requiring sustained mental effort.", difficulty: "easy" },
    { topicId: T["ADHD & Medications"], question: "What is guanfacine (Intuniv) and how does it work?", answer: "Guanfacine is a selective alpha-2A adrenergic agonist — it strengthens prefrontal cortex connections by reducing noisy neural firing, improving working memory and impulse control in ADHD.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What cognitive functions are most impaired in ADHD?", answer: "Working memory, response inhibition, sustained attention, set-shifting, and planning — all executive functions dependent on the prefrontal cortex and dopamine/norepinephrine signaling.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What are executive functions?", answer: "Higher-order cognitive processes managed by the prefrontal cortex: working memory, inhibition of prepotent responses, cognitive flexibility/set-shifting, planning, and goal-directed behavior.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is the Continuous Performance Test (CPT)?", answer: "A neuropsychological test of sustained attention and impulse control — the patient responds to target stimuli and must inhibit responses to non-targets; widely used in ADHD assessment.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What are the risks of stimulant medications?", answer: "Side effects include decreased appetite, sleep disruption, elevated heart rate and blood pressure, and potential for abuse — cardiovascular screening is recommended before prescribing.", difficulty: "easy" },

    // ===== 13. LANGUAGE PROCESSING & APHASIA =====
    { topicId: T["Language Processing & Aphasia"], question: "What is Broca's area and what aphasia results from its damage?", answer: "Broca's area (left inferior frontal gyrus, Brodmann areas 44/45) is responsible for speech production — damage causes Broca's aphasia: non-fluent, effortful speech with relatively preserved comprehension.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is Wernicke's area and what aphasia results from its damage?", answer: "Wernicke's area (posterior superior temporal gyrus) is responsible for language comprehension — damage causes Wernicke's aphasia: fluent but meaningless speech with poor comprehension.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the arcuate fasciculus?", answer: "A white matter bundle connecting Broca's and Wernicke's areas — damage causes conduction aphasia: intact comprehension, relatively intact production, but severely impaired repetition.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is anomia?", answer: "Difficulty retrieving words and names — can occur in isolation (anomic aphasia) or as part of other aphasias; often the last deficit to resolve in aphasia recovery.", difficulty: "easy" },
    { topicId: T["Language Processing & Aphasia"], question: "What is transcortical motor aphasia?", answer: "Non-fluent aphasia with good comprehension and good repetition — caused by lesions around Broca's area (supplementary motor area), isolating but sparing the perisylvian language region.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is transcortical sensory aphasia?", answer: "Fluent aphasia with poor comprehension but relatively preserved repetition — caused by lesions around Wernicke's area; repetition is intact because perisylvian language core is spared.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What are the components of language assessed in aphasia evaluation?", answer: "Fluency of output, comprehension, repetition, naming, reading, and writing — these six dimensions distinguish different aphasia types.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is phonological paraphasia?", answer: "A speech error where the substitution is based on sound similarities to the target word (e.g., saying 'spoon' as 'spool') — common in conduction and Broca's aphasia.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is semantic paraphasia?", answer: "A speech error where the substitution is semantically related to the target word (e.g., saying 'knife' instead of 'fork') — common in Wernicke's aphasia.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is global aphasia?", answer: "Severe impairment of all language functions — non-fluent, poor comprehension, poor repetition; caused by large left hemisphere lesions involving both Broca's and Wernicke's areas.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is dysarthria?", answer: "A motor speech disorder caused by weakness, paralysis, or lack of coordination of speech muscles — speech is slurred but language comprehension and grammar are intact.", difficulty: "easy" },
    { topicId: T["Language Processing & Aphasia"], question: "What is dyslexia at a neurological level?", answer: "Dyslexia involves differences in the phonological processing regions of the left hemisphere, particularly the left temporoparietal and inferior frontal regions — not a visual problem.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the Wernicke-Geschwind model of language?", answer: "A model where auditory input → Wernicke's area (comprehension) → arcuate fasciculus → Broca's area (production) → motor cortex → speech; damage at any point causes a different aphasia type.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What brain hemisphere dominates language in most people?", answer: "The left hemisphere dominates language in ~95% of right-handed individuals and ~70% of left-handers — language lateralization is assessed with Wada test (sodium amobarbital injection).", difficulty: "easy" },

    // ===== 14. APRAXIA & AGNOSIA =====
    { topicId: T["Apraxia & Agnosia"], question: "What is apraxia?", answer: "The inability to perform purposeful, skilled movements despite having intact motor ability, sensation, and comprehension — a disorder of motor planning from cortical association area damage.", difficulty: "easy" },
    { topicId: T["Apraxia & Agnosia"], question: "What is ideomotor apraxia?", answer: "Inability to perform a movement on verbal command or by imitation (e.g., 'wave goodbye'), even though the person can sometimes perform it spontaneously — lesions to left frontal and parietal areas.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is ideational apraxia?", answer: "Failure to perform a sequenced, multi-step action (e.g., folding a letter and putting it in an envelope) — a disorder of the conceptual knowledge of action sequences; associated with frontal lesions.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is kinetic (limb-kinetic) apraxia?", answer: "Clumsiness in performing fine, precision motor acts (e.g., picking up a coin) — caused by lesions to corticospinal, corticobasal, or prefrontal areas; tested with finger tapping and grooved pegboard.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is apraxia of speech?", answer: "Inability to plan the motor movements for speech — lesions to Broca's area, insula, premotor, or supplementary motor areas; automatic speech may be preserved while volitional speech is impaired.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is the order of testing in apraxia assessment?", answer: "Pantomime to command → imitation → use of actual object. Performance often improves from command to object use.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is agnosia?", answer: "Perception without recognition — the inability to recognize stimuli despite intact sensory function, attention, and language. It can affect any sensory modality.", difficulty: "easy" },
    { topicId: T["Apraxia & Agnosia"], question: "What is apperceptive agnosia?", answer: "Inability to form a coherent visual percept from individual elements — the patient cannot recognize, copy, or match objects; caused by diffuse posterior brain damage.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is associative agnosia?", answer: "The patient can copy and match objects but cannot recognize them or access their meaning — a failure to link intact visual percept with semantic knowledge; caused by occipitotemporal damage.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is prosopagnosia?", answer: "The inability to recognize familiar faces — patients can often identify gender, age, and emotion from a face, but cannot recognize the specific person; caused by bilateral fusiform face area damage.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is simultagnosia?", answer: "Inability to perceive more than one object at a time — the patient sees individual elements but cannot process the 'whole' visual scene; occurs in Balint's syndrome with bilateral parieto-occipital lesions.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is hemispatial neglect?", answer: "Failure to attend to stimuli on the side contralateral to a brain lesion (usually right hemisphere) — not due to sensory loss; tested with line bisection, cancellation tasks, and copy tasks.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is Balint's syndrome?", answer: "A triad of simultagnosia (cannot process whole scene), optic ataxia (inaccurate reaching), and oculomotor apraxia (inability to voluntarily move eyes to targets) — caused by bilateral parieto-occipital lesions.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is anosognosia?", answer: "Unawareness of one's own neurological deficit (e.g., not knowing one is paralyzed or has memory loss) — not psychological denial; caused by right hemisphere damage and prevalent in Alzheimer's.", difficulty: "medium" },

    // ===== 15. NEUROCOGNITIVE DISORDERS =====
    { topicId: T["Neurocognitive Disorders"], question: "What are the 4 As of cortical dementia?", answer: "Amnesia (memory loss), Aphasia (language), Apraxia (motor planning), and Agnosia (recognition) — seen in Alzheimer's and other cortical dementias.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What are the histological hallmarks of Alzheimer's disease?", answer: "Beta-amyloid plaques (extracellular) and tau neurofibrillary tangles (intracellular) — discovered by Alois Alzheimer in 1906 using histological staining.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the difference between cortical and subcortical dementia?", answer: "Cortical: aphasia, apraxia, agnosia, amnesia (retrieval deficits) — e.g., Alzheimer's. Subcortical: alertness, attention, processing speed, and mood changes (depression) — e.g., Huntington's, Parkinson's.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is Huntington's disease and what gene causes it?", answer: "A fatal hereditary neurodegenerative disease caused by a CAG repeat expansion in the HTT gene on chromosome 4 — causes progressive chorea, cognitive decline, and psychiatric symptoms.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What are the cardinal motor symptoms of Parkinson's disease?", answer: "Bradykinesia (slow movement), resting tremor (unilateral, improves with movement), rigidity (lead pipe/cogwheel), and postural instability — TRAP acronym.", difficulty: "easy" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the neuropathological basis of Parkinson's disease?", answer: "Progressive loss of dopaminergic neurons in the substantia nigra pars compacta, with Lewy body (alpha-synuclein) accumulation — symptoms appear when ~60-80% of neurons are lost.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is dementia with Lewy bodies (DLB)?", answer: "The second most common dementia after Alzheimer's — characterized by fluctuating cognition, recurrent visual hallucinations, parkinsonism, and REM sleep behavior disorder.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is mild cognitive impairment (MCI)?", answer: "Cognitive decline beyond normal aging but not meeting dementia criteria — aMCI (amnestic) is more likely to convert to Alzheimer's; naMCI (non-amnestic) is less likely. Prevalence 15-20% in the US.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the triad of normal pressure hydrocephalus (NPH)?", answer: "Gait disturbance ('magnetic gait' — feet feel glued to the floor), urinary incontinence, and cognitive impairment — caused by excess CSF in ventricles without elevated pressure.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the difference between capacity and competency?", answer: "Capacity is a clinical determination (can change) that a patient can make informed medical decisions; competency is a legal determination (permanent, decided by a judge).", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is chronic traumatic encephalopathy (CTE)?", answer: "A neurodegenerative disease caused by repetitive traumatic brain injuries (TBI) — formerly called 'punch drunk syndrome'; diagnosed definitively only at autopsy.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is frontotemporal dementia (FTD)?", answer: "A dementia affecting the frontal and temporal lobes — the behavioral variant (bvFTD) presents with disinhibition, apathy, hyperorality, stereotyped behaviors, and empathy loss (SHADE acronym); onset typically 50s.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the Frascati criteria for HIV-Associated Neurocognitive Disorder (HAND)?", answer: "Three levels: ANI (asymptomatic, 1 SD below in 2+ domains), MND (mild, with functional impairment, 12% prevalence), and HAD (HIV-associated dementia, 2% prevalence, significant impairment).", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What are the cognitive domains typically impaired in vascular dementia?", answer: "Processing speed and complex attention (most impaired), executive function, and memory — depends on the location and extent of vascular lesions (cortical vs. subcortical strokes).", difficulty: "medium" },

    // ===== SUPPLEMENTARY — NEUROPSYCHOLOGY OVERVIEW =====
    { topicId: T["Neuropsychology Overview"], question: "What is symptom validity testing (SVT)?", answer: "Tests designed to detect poor effort or malingering in neuropsychological evaluation (e.g., TOMM, WMT) — embedded validity indicators are also used within standard batteries.", difficulty: "hard" },
    { topicId: T["Neuropsychology Overview"], question: "What is the Boston Process Approach?", answer: "A neuropsychological assessment method that focuses on HOW a patient solves problems (the process and error types), not just the score — errors provide qualitative information about brain dysfunction.", difficulty: "hard" },
    { topicId: T["Neuropsychology Overview"], question: "What is the Halstead-Reitan Neuropsychological Battery (HRB)?", answer: "One of the most widely used comprehensive neuropsychological batteries assessing sensorimotor, perceptual, and cognitive functions — includes Category Test, Tactual Performance Test, and more.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is the difference between reliability and validity in testing?", answer: "Reliability = consistency of measurement across time or raters. Validity = accuracy — does the test actually measure what it claims to measure? A test can be reliable but not valid.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is the WAIS-IV and what does it measure?", answer: "The Wechsler Adult Intelligence Scale-IV measures intelligence through four index scores: Verbal Comprehension, Perceptual Reasoning, Working Memory, and Processing Speed — widely used in neuropsychological evaluations.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What does the Trail Making Test (TMT) measure?", answer: "TMT-A measures attention and processing speed (connect 1-2-3...); TMT-B measures cognitive flexibility and executive function (connect 1-A-2-B...) — the B-A difference reflects pure executive demand.", difficulty: "medium" },

    // ===== SUPPLEMENTARY — CELL BIOLOGY & NEURON ANATOMY =====
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What are the main types of neurons by morphology?", answer: "Multipolar (most CNS neurons, multiple dendrites + one axon), bipolar (sensory neurons, retina, olfactory), unipolar (dorsal root ganglia sensory neurons), and pseudounipolar (single process that splits).", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is anterograde axonal transport?", answer: "Movement of materials FROM the cell body TOWARD the axon terminal (e.g., neurotransmitter vesicles) — powered by kinesin motor proteins along microtubules.", difficulty: "hard" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is retrograde axonal transport and why is it clinically important?", answer: "Movement FROM axon terminal BACK to the cell body — used for trophic signals (e.g., NGF) and exploited by viruses (rabies, herpes simplex) and toxins to reach the CNS.", difficulty: "hard" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is Wallerian degeneration?", answer: "Degeneration of the distal segment of an axon after it is severed from the cell body — the axon and myelin break down distal to the injury, and Schwann cells/macrophages clear debris.", difficulty: "hard" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is Hebbian plasticity?", answer: "'Neurons that fire together, wire together' — Hebb's rule: when a presynaptic neuron repeatedly activates a postsynaptic neuron, the synaptic connection is strengthened. The cellular basis of associative learning.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What are gap junctions (electrical synapses)?", answer: "Direct ion channel connections between neurons allowing instantaneous, bidirectional electrical transmission — faster than chemical synapses; important in synchronizing neural networks (e.g., oscillations).", difficulty: "hard" },

    // ===== SUPPLEMENTARY — NEUROTRANSMITTERS & SYNAPTIC TRANSMISSION =====
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the endocannabinoid system?", answer: "A retrograde signaling system using lipid-based messengers (anandamide, 2-AG) — released by the postsynaptic neuron, they travel backward to activate CB1 receptors on the presynaptic neuron, suppressing neurotransmitter release (DSI/DSE).", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is glutamate excitotoxicity?", answer: "Excessive glutamate activation of NMDA receptors leads to massive Ca2+ influx, activating destructive enzymes (proteases, lipases, endonucleases) — a key mechanism of neuronal death in stroke, TBI, and neurodegenerative diseases.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is BDNF and what does it do?", answer: "Brain-Derived Neurotrophic Factor is a neurotrophin that promotes neuron survival, synaptic plasticity, and neurogenesis. BDNF signaling via TrkB receptors is critical for LTP, learning, and memory — reduced in depression.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is histamine's role in the brain?", answer: "Histamine from the tuberomammillary nucleus of the hypothalamus promotes wakefulness and arousal — antihistamines that cross the BBB cause sedation by blocking H1 receptors.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is glycine's role in the CNS?", answer: "Glycine is the primary inhibitory neurotransmitter in the spinal cord and brainstem — it acts on glycine receptors (Cl- channels) causing hyperpolarization; also serves as a co-agonist for NMDA receptors.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the difference between presynaptic and postsynaptic inhibition?", answer: "Presynaptic inhibition reduces neurotransmitter release from the presynaptic terminal (e.g., via autoreceptors or GABA-B receptors); postsynaptic inhibition hyperpolarizes the postsynaptic cell via IPSPs, reducing its response.", difficulty: "hard" },

    // ===== SUPPLEMENTARY — SENSORY PATHWAYS =====
    { topicId: T["Sensory Pathways"], question: "How many cranial nerves are there and which carries vision?", answer: "There are 12 cranial nerves. CN II (optic nerve) carries visual information. CN I is olfactory, CN VIII is auditory/vestibular, CN X (vagus) is the longest and regulates visceral functions.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the trigeminal nerve (CN V) and what does it carry?", answer: "CN V is the trigeminal nerve — the major sensory nerve of the face. It carries pain, temperature, and touch from the face to the thalamus (VPM) via the trigeminal nuclear complex; also motor to jaw muscles.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the corticobulbar tract?", answer: "A descending motor pathway from the motor cortex to the brainstem cranial nerve nuclei — controls voluntary movements of the face, tongue, and throat; distinguished from corticospinal which goes to the spinal cord.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the anterior commissure vs. corpus callosum?", answer: "Both are white matter commissures connecting the two hemispheres. The corpus callosum is the main one (connecting most cortical areas); the anterior commissure connects the olfactory and anterior temporal regions.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the internal capsule?", answer: "A dense band of white matter through which corticospinal, corticobulbar, and thalamocortical fibers pass — it separates the thalamus from the basal ganglia. Lesions (e.g., lacunar strokes) cause dense contralateral motor deficits.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What is the substantia gelatinosa?", answer: "A region in the dorsal horn of the spinal cord (Rexed lamina II) where pain and temperature signals synapse — a key site for pain modulation, targeted by opioids and the gate control mechanism.", difficulty: "hard" },

    // ===== SUPPLEMENTARY — SENSORY SYSTEMS =====
    { topicId: T["Sensory Systems"], question: "What is the difference between A-delta and C fibers in pain?", answer: "A-delta fibers are myelinated, fast (sharp/acute 'first pain'); C fibers are unmyelinated, slow (burning/aching 'second pain'). Both respond to noxious stimuli and synapse in the dorsal horn.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is phantom limb pain and what causes it?", answer: "Pain perceived as coming from an amputated limb — caused by reorganization of the somatosensory cortex and ongoing firing of central neurons that previously received input from the missing limb.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is referred pain?", answer: "Pain felt at a location other than the site of injury — caused by convergence of visceral and somatic afferents onto the same spinal cord neurons (e.g., heart attack pain radiating to the left arm).", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the difference between conductive and sensorineural hearing loss?", answer: "Conductive loss: problem in the outer/middle ear transmitting sound (e.g., fluid, ossicle damage) — treatable. Sensorineural loss: damage to cochlear hair cells or auditory nerve — usually permanent.", difficulty: "easy" },
    { topicId: T["Sensory Systems"], question: "What is the fovea and why is it important?", answer: "The fovea is the central region of the retina with the highest density of cone photoreceptors — it provides highest visual acuity for fine detail and color. It is the point of fixation.", difficulty: "easy" },
    { topicId: T["Sensory Systems"], question: "What is the optic chiasm and what happens there?", answer: "The point where the optic nerves partially cross — nasal (medial) retinal fibers cross to the opposite hemisphere; temporal (lateral) fibers stay ipsilateral. Lesions cause bitemporal hemianopia (tunnel vision).", difficulty: "medium" },

    // ===== SUPPLEMENTARY — LIMBIC SYSTEM & MOTIVATION =====
    { topicId: T["Limbic System & Motivation"], question: "What is reward prediction error?", answer: "The difference between expected and actual reward — when reward is better than expected, dopamine neurons fire; when worse, they suppress. This signal drives learning and is exploited by addictive drugs.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the bed nucleus of the stria terminalis (BNST) and its role?", answer: "An extended amygdala structure critically involved in sustained anxiety and anticipatory fear (as opposed to the central amygdala which mediates acute fear responses) — a key target in anxiety disorder research.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "How do addictive drugs hijack the reward system?", answer: "Most addictive drugs (e.g., cocaine, opioids, alcohol) cause supraphysiological dopamine release in the nucleus accumbens — this creates strong reward memories, drug-seeking behavior, and eventual tolerance/withdrawal.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is the default mode network (DMN)?", answer: "A brain network active during rest and self-referential thought (medial prefrontal, posterior cingulate, angular gyrus, hippocampus) — disrupted in depression, PTSD, schizophrenia, and impaired in TBI.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the role of the septal area in the limbic system?", answer: "The septal nuclei modulate aggression, social behavior, and reward — septal stimulation produces pleasure; lesions cause 'septal rage' with heightened aggression and hypersexuality.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is hedonic adaptation (set point theory)?", answer: "The tendency for individuals to return to a relatively stable level of happiness despite major positive or negative events — the brain adapts to new circumstances and resets the baseline hedonic level.", difficulty: "medium" },

    // ===== SUPPLEMENTARY — SLEEP & CIRCADIAN RHYTHMS =====
    { topicId: T["Sleep & Circadian Rhythms"], question: "What cognitive functions are most impaired by sleep deprivation?", answer: "Sustained attention and vigilance are most impaired, followed by working memory, executive function, and emotional regulation — even modest sleep restriction (6 hrs/night) accumulates a significant cognitive debt.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is delayed sleep phase syndrome (DSPS)?", answer: "A circadian rhythm disorder where the sleep-wake cycle is shifted to later times (e.g., 3am-11am) — common in adolescents; treated with light therapy in the morning and melatonin in the evening.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What are somnambulism (sleepwalking) and night terrors?", answer: "Both are NREM parasomnias occurring during slow-wave (N3) sleep — sleepwalking involves complex motor behavior; night terrors involve sudden arousal with intense fear and autonomic activation, with no dream recall.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is CBT-I?", answer: "Cognitive Behavioral Therapy for Insomnia — the first-line treatment for chronic insomnia; includes sleep restriction, stimulus control, sleep hygiene, and cognitive restructuring. More effective than medication long-term.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What are hypnagogic and hypnopompic hallucinations?", answer: "Hypnagogic hallucinations occur while falling asleep (onset); hypnopompic occur while waking. Both are vivid sensory experiences — common in narcolepsy, but can also occur in healthy individuals.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "Why is sleep important for memory consolidation?", answer: "Sleep, especially N3 (slow-wave) and REM, consolidates newly learned information — N3 slow oscillations coupled with sleep spindles replay hippocampal memories to neocortex; REM consolidates emotional and procedural memories.", difficulty: "medium" },

    // ===== SUPPLEMENTARY — ENDOCRINE SYSTEM & REPRODUCTION =====
    { topicId: T["Endocrine System & Reproduction"], question: "What are leptin and ghrelin and how do they regulate appetite?", answer: "Leptin (from fat cells) signals satiety to the hypothalamus — high leptin suppresses appetite. Ghrelin (from stomach) signals hunger — rises before meals, falls after eating. Both regulate the hypothalamic hunger circuits.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "How does insulin affect the brain?", answer: "The brain has insulin receptors — insulin modulates synaptic plasticity, promotes neuron survival, and regulates appetite. Insulin resistance is a risk factor for Alzheimer's disease ('Type 3 diabetes' hypothesis).", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What are sex differences in stress response?", answer: "Males show a more pronounced 'fight-or-flight' response; females are more likely to show 'tend-and-befriend' (oxytocin-mediated social affiliation under stress). Estrogen modulates HPA axis reactivity — women are more vulnerable to PTSD.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the role of DHEA (dehydroepiandrosterone)?", answer: "An adrenal steroid that serves as a precursor to sex hormones — highest levels in young adulthood, declines with age. May have neuroprotective effects and is associated with mood and cognitive function.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the gut-brain axis?", answer: "The bidirectional communication network between the gastrointestinal tract and the brain — the vagus nerve is a major pathway; gut microbiome composition influences mood, anxiety, and cognition via serotonin (90% produced in gut) and other signals.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is stress-induced analgesia?", answer: "Pain suppression during acute stress — mediated by endogenous opioids, endocannabinoids, and norepinephrine via the descending pain modulation system from the periaqueductal gray (PAG) to the dorsal horn.", difficulty: "hard" },

    // ===== SUPPLEMENTARY — PSYCHOPHARMACOLOGY =====
    { topicId: T["Psychopharmacology"], question: "What is neuroleptic malignant syndrome (NMS)?", answer: "A rare but life-threatening reaction to antipsychotics — characterized by FEVER, muscle rigidity, altered consciousness, and autonomic instability. Caused by sudden dopamine blockade. Treated by stopping the drug and supportive care.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is serotonin syndrome?", answer: "A potentially life-threatening condition caused by excess serotonergic activity (e.g., combining SSRIs + MAOIs) — triad of: altered mental status, autonomic instability, and neuromuscular abnormalities (clonus, hyperreflexia, tremor).", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is the CYP450 system and why is it important in pharmacology?", answer: "A family of liver enzymes that metabolize most drugs — CYP3A4 metabolizes ~50% of drugs. Inhibitors (e.g., fluoxetine) can raise drug levels (toxicity risk); inducers (e.g., carbamazepine) can lower levels (treatment failure).", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is a partial agonist in receptor pharmacology?", answer: "A drug that binds a receptor and activates it, but produces a submaximal response — in the presence of a full agonist, it acts as an antagonist (competitive); examples include buspirone (5-HT1A) and buprenorphine (mu opioid).", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is the difference between physical dependence and addiction?", answer: "Physical dependence = physiological adaptation requiring drug to function normally (withdrawal if stopped — can occur with prescribed drugs). Addiction = compulsive drug seeking despite harm (a brain disease involving reward circuits).", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What are cholinesterase inhibitors and when are they used?", answer: "Drugs that inhibit acetylcholinesterase (e.g., donepezil, rivastigmine) — increase acetylcholine in the synaptic cleft; used in Alzheimer's disease, DLB, and other dementias with cholinergic deficits. Symptomatic, not disease-modifying.", difficulty: "medium" },

    // ===== SUPPLEMENTARY — PSYCHOLOGICAL DISORDERS =====
    { topicId: T["Psychological Disorders"], question: "What brain circuit is implicated in OCD?", answer: "The cortico-striato-thalamo-cortical (CSTC) loop — hyperactivity in the orbitofrontal cortex (OFC) drives the striatum, creating perseverative loops of anxiety and compulsive behavior. Treated by SSRIs and CBT (exposure/response prevention).", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What is panic disorder and what is its neurobiology?", answer: "Recurrent unexpected panic attacks — driven by hyperactive amygdala and altered sensitivity to CO2 (suffocation alarm system). The locus coeruleus NE system is also implicated; treated with SSRIs and CBT.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is anorexia nervosa and what are its neuropsychological features?", answer: "AN involves severe food restriction with distorted body image — associated with elevated harm avoidance, perfectionism, rigid thinking (executive dysfunction), and altered reward signaling (reduced dopamine response to food). High heritability (~50-80%).", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What is the kindling model of bipolar disorder?", answer: "Early episodes may be triggered by psychosocial stress, but with each episode, the threshold for new episodes decreases — later episodes can occur spontaneously without identifiable triggers. Supports early treatment intervention.", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What is the difference between somatic symptom disorder and conversion disorder?", answer: "Somatic symptom disorder: medically unexplained physical symptoms + excessive psychological response to them. Conversion disorder (functional neurological symptom disorder): neurological symptoms (paralysis, blindness) inconsistent with organic disease.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What are the negative cognitive effects of depression on the brain?", answer: "Depression is associated with reduced hippocampal volume (cortisol-mediated), impaired memory encoding and retrieval, attentional bias to negative stimuli, slowed processing speed, and executive dysfunction.", difficulty: "medium" },

    // ===== SUPPLEMENTARY — PERSONALITY DISORDERS =====
    { topicId: T["Personality Disorders"], question: "What is 'splitting' in borderline personality disorder?", answer: "A primitive defense mechanism where the person sees others (and themselves) as entirely good or entirely bad, unable to integrate positive and negative qualities — also called 'black-and-white thinking' or idealization/devaluation.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is mentalization-based treatment (MBT)?", answer: "A psychodynamic therapy for BPD developed by Bateman and Fonagy — targets the impaired ability to mentalize (understand one's own and others' mental states) that underlies BPD's emotional and relational problems.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is the prevalence of personality disorders in the general population?", answer: "Approximately 10-15% of the general population meets criteria for at least one personality disorder — Cluster C (anxious) disorders are most common, with OCPD and avoidant being most prevalent.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is the neurobiology of psychopathy (related to ASPD)?", answer: "Psychopathy is associated with reduced amygdala volume and reactivity (reduced fear/empathy), diminished skin conductance response to threat, and structural differences in the ventromedial PFC and anterior cingulate.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is schizoid personality disorder and how does it differ from schizotypal?", answer: "Schizoid PD (Cluster A): pervasive detachment, restricted affect, and no desire for relationships — no odd beliefs or perceptual distortions. Schizotypal PD: odd beliefs, magical thinking, perceptual distortions, and is genetically linked to schizophrenia.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is the role of emotion dysregulation in personality disorders?", answer: "Emotion dysregulation (intense emotional reactivity, slow return to baseline, difficulty labeling and managing emotions) is a transdiagnostic feature across Cluster B disorders — especially BPD — and is a primary treatment target.", difficulty: "medium" },

    // ===== SUPPLEMENTARY — ADHD & MEDICATIONS =====
    { topicId: T["ADHD & Medications"], question: "What is Barkley's executive function model of ADHD?", answer: "Barkley proposes ADHD is fundamentally a deficit in behavioral inhibition that impairs five executive functions: working memory, self-regulation of affect, internalization of speech, reconstitution, and motivation/arousal.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "How does ADHD presentation differ by sex?", answer: "Males: more hyperactive-impulsive behavior, detected earlier. Females: more inattentive presentation, more internalizing symptoms, diagnosed later and underdiagnosed — can lead to delayed treatment and greater functional impairment.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is sluggish cognitive tempo (SCT)?", answer: "A distinct attention profile (possibly separate from ADHD) with daydreaming, mental fogginess, slow processing, and hypoactivity — responds better to non-stimulant medications (atomoxetine) than hyperactive ADHD.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What are common psychiatric comorbidities in ADHD?", answer: "ADHD commonly co-occurs with: ODD/conduct disorder, anxiety disorders, depression, learning disabilities, substance use disorders, and in adults — personality disorders. Comorbidities must be assessed and treated.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What neuroimaging findings are associated with ADHD?", answer: "Reduced volume and delayed cortical maturation in the prefrontal cortex, caudate nucleus, and cerebellum; reduced activation of PFC and anterior cingulate on fMRI tasks requiring inhibition and working memory.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "Why is multimethod assessment important in ADHD diagnosis?", answer: "ADHD diagnosis should integrate: clinical interview, rating scales from multiple informants (parent, teacher, self), neuropsychological testing, and review of school records — no single test diagnoses ADHD; symptoms must be pervasive across settings.", difficulty: "medium" },

    // ===== SUPPLEMENTARY — LANGUAGE PROCESSING & APHASIA =====
    { topicId: T["Language Processing & Aphasia"], question: "What is prosody and which hemisphere processes it?", answer: "Prosody is the melody, rhythm, and intonation of speech — it conveys emotional meaning and emphasis. The right hemisphere is primarily responsible for processing and producing emotional prosody.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is pure alexia (alexia without agraphia)?", answer: "Inability to read but preserved writing — caused by damage to the left occipital cortex and splenium of the corpus callosum; visual information cannot reach the left hemisphere language areas but writing is intact.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is surface dyslexia vs. phonological dyslexia?", answer: "Surface dyslexia: reads by sounding out (phonics) — struggles with irregular words (e.g., 'yacht'); phonological dyslexia: cannot sound out novel words — relies on whole-word visual memory. Different underlying impairments.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the role of the right hemisphere in language?", answer: "The right hemisphere processes figurative language, humor, metaphors, inference, narrative comprehension, and pragmatics — right hemisphere damage can cause 'right hemisphere communication disorder' with intact basic language.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is agrammatism in Broca's aphasia?", answer: "A feature of non-fluent aphasia where grammatical morphemes (articles, prepositions, verb endings) are omitted — speech is telegraphic (content words without grammatical structure): 'I... walk... store... yesterday.'", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is primary progressive aphasia (PPA)?", answer: "A neurodegenerative syndrome where language deteriorates progressively while other cognitive functions are relatively preserved (at least initially) — three variants: non-fluent/agrammatic, semantic, and logopenic (associated with Alzheimer's).", difficulty: "hard" },

    // ===== SUPPLEMENTARY — APRAXIA & AGNOSIA =====
    { topicId: T["Apraxia & Agnosia"], question: "What is astereognosis (tactile agnosia)?", answer: "The inability to recognize objects by touch alone despite intact somatosensory sensation — a form of agnosia in the tactile modality; tested by placing objects in the patient's hand while preventing vision.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is auditory agnosia?", answer: "Inability to recognize sounds (e.g., music, environmental sounds, speech) despite intact hearing — can be selective (e.g., pure word deafness: cannot recognize speech sounds but can recognize non-speech sounds).", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is autotopagnosia?", answer: "The inability to point to or name parts of one's own body on command — a disorder of body schema associated with left parietal lesions; distinct from neglect because it involves recognition, not attention.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is the difference between neglect and extinction?", answer: "Neglect: failure to report, respond to, or orient toward contralesional stimuli even in isolation. Extinction: stimuli on the affected side are perceived in isolation but 'extinguished' when competing with a stimulus on the intact side.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is constructional apraxia?", answer: "The inability to draw or assemble 2D or 3D structures (e.g., copy a clock, build with blocks) despite no motor weakness — can result from left or right hemisphere damage but right hemisphere lesions produce more severe deficits.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is finger agnosia?", answer: "Inability to identify, name, or differentiate individual fingers — associated with left parietal (angular gyrus) lesions; part of Gerstmann's syndrome (finger agnosia + acalculia + agraphia + left-right disorientation).", difficulty: "hard" },

    // ===== SUPPLEMENTARY — NEUROCOGNITIVE DISORDERS =====
    { topicId: T["Neurocognitive Disorders"], question: "What is Creutzfeldt-Jakob disease (CJD)?", answer: "A rapidly progressive fatal prion disease — misfolded prion proteins trigger chain-reaction misfolding of normal proteins causing spongiform encephalopathy. Features: rapid dementia, myoclonus, ataxia, and death within 1 year.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is sundowning in dementia?", answer: "Worsening confusion, agitation, and behavioral disturbance in the late afternoon/evening in dementia patients — linked to disrupted circadian rhythms, reduced sensory cues, fatigue, and altered sleep-wake cycles.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What are BPSD (Behavioral and Psychological Symptoms of Dementia)?", answer: "Non-cognitive symptoms of dementia including agitation, aggression, wandering, sleep disturbance, depression, psychosis, apathy, and disinhibition — highly distressing for caregivers and often trigger institutionalization.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the MoCA (Montreal Cognitive Assessment) and what does it detect?", answer: "A 10-minute cognitive screening tool (max 30 points) that is more sensitive than the MMSE for detecting MCI — tests visuospatial/executive function, naming, memory, attention, language, abstraction, and orientation.", difficulty: "easy" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the MacArthur Competence Assessment Tool (MacCAT)?", answer: "The gold standard structured tool for assessing medical decision-making capacity — evaluates the four Appelbaum criteria: Understanding, Appreciation, Reasoning, and Expressing a Choice.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What vascular risk factors are most associated with cognitive decline?", answer: "Hypertension (especially midlife), diabetes, hyperlipidemia, atrial fibrillation, smoking, obesity, and physical inactivity — all cause brain microangiopathy and increase risk of vascular dementia and Alzheimer's.", difficulty: "medium" },

    // ===== EXPANDED BATCH — NEUROPSYCHOLOGY OVERVIEW (30 more) =====
    { topicId: T["Neuropsychology Overview"], question: "What does the Rey-Osterrieth Complex Figure Test (ROCFT) assess?", answer: "Visuoconstructional ability (copy phase), visual memory (immediate/delayed recall), and planning/organizational strategy — errors in copy reflect executive/visuospatial deficits; poor recall reflects visual memory impairment.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is the California Verbal Learning Test (CVLT) and what does it measure?", answer: "A word list learning test that yields scores for immediate recall, learning rate, semantic clustering, intrusion errors, recognition discriminability, and delayed recall — a comprehensive measure of verbal episodic memory.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What does the Stroop Color-Word Test measure?", answer: "Cognitive inhibition and response interference — the interference condition requires naming the ink color of color-words (e.g., 'RED' written in blue ink), stressing the prefrontal cortex and anterior cingulate cortex.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is the Wisconsin Card Sorting Test (WCST) and what does it measure?", answer: "A test of cognitive flexibility and set-shifting — patients sort cards by an unstated rule and must shift when the rule changes; perseverative errors reflect frontal lobe dysfunction.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What does the Continuous Performance Test (CPT) measure?", answer: "Sustained attention and vigilance — the patient watches a stream of stimuli and responds to targets; sensitive to ADHD, TBI, and psychosis.", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What is the Digit Span test and what does it measure?", answer: "Forward Digit Span measures attention/phonological loop; Backward Digit Span measures working memory (manipulation); Sequencing Digit Span adds a mental reordering demand. All from the WAIS-IV.", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What blood vessel supplies most of the lateral cortex (language areas)?", answer: "The middle cerebral artery (MCA) — the largest branch of the internal carotid artery; supplies the lateral frontal, parietal, and temporal lobes, including Broca's and Wernicke's areas.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What does the anterior cerebral artery (ACA) supply?", answer: "The medial frontal and parietal lobes (including the motor/sensory cortex for the leg/foot), the cingulate gyrus, and the corpus callosum — ACA strokes produce contralateral leg weakness and personality changes.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What does the posterior cerebral artery (PCA) supply?", answer: "The occipital lobe (primary visual cortex), medial temporal (hippocampus), and thalamus — PCA strokes cause contralateral homonymous hemianopia, visual agnosias, and memory deficits.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is the circle of Willis?", answer: "An anastomotic ring of arteries at the base of the brain (ICA, ACA, AComA, MCA, PCA, PComA, basilar) — provides collateral blood flow to protect against occlusion of any single vessel.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is diffusion tensor imaging (DTI)?", answer: "An MRI technique that measures water diffusion along white matter tracts — reveals structural connectivity between brain regions; used to assess white matter integrity in TBI, MS, and neurodegenerative diseases.", difficulty: "hard" },
    { topicId: T["Neuropsychology Overview"], question: "What does PET (positron emission tomography) measure in neuropsychology?", answer: "Functional brain activity via radioactive tracers — FDG-PET measures glucose metabolism (hypometabolism in Alzheimer's); amyloid PET and tau PET detect AD pathology in vivo.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What does EEG measure?", answer: "Electroencephalography records electrical activity from the brain via scalp electrodes — measures brain oscillations (delta, theta, alpha, beta, gamma) and is used to diagnose epilepsy and sleep disorders.", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What is the WRAT (Wide Range Achievement Test)?", answer: "A brief academic achievement test that assesses reading (word recognition), spelling, and math — reading subtest is highly correlated with IQ and used to estimate premorbid cognitive ability.", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What is the difference between sensitivity and specificity in neuropsychological testing?", answer: "Sensitivity = true positive rate (how well a test identifies those WITH the condition); Specificity = true negative rate (how well it identifies those WITHOUT). Good tests need both, but there is often a trade-off.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is positive predictive value (PPV) and why does it depend on base rates?", answer: "PPV is the probability that a positive test result indicates true disease — it depends heavily on the base rate (prevalence) of the condition in the tested population; low prevalence = many false positives even with high specificity.", difficulty: "hard" },
    { topicId: T["Neuropsychology Overview"], question: "What is test-retest reliability?", answer: "The consistency of a test's scores across two testing sessions — affected by practice effects, state changes, and measurement error. Important for tracking change over time in longitudinal neuropsychological assessment.", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What is localizationist theory vs. holistic/equipotentiality theory?", answer: "Localizationists (Broca, Wernicke) propose specific functions are tied to specific brain regions. Holists (Lashley) propose the brain works as a whole — the mass action and equipotentiality principles. Modern view integrates both.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is mass action in neuroscience (Lashley)?", answer: "Lashley's principle that the amount of cortical tissue involved (not its specific location) determines the degree of learning impairment — a challenge to strict localizationism.", difficulty: "hard" },
    { topicId: T["Neuropsychology Overview"], question: "What is Korsakoff's syndrome?", answer: "An amnestic disorder from severe thiamine (B1) deficiency (often due to chronic alcoholism) — bilateral mammillary body and thalamic damage causes profound anterograde amnesia with confabulation. Treated with thiamine.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is anterograde vs. retrograde amnesia?", answer: "Anterograde amnesia = inability to form new memories after a brain injury. Retrograde amnesia = inability to recall memories from before the injury (often gradient — remote memories more preserved).", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What is the temporal gradient in retrograde amnesia?", answer: "Memories from closer to the time of injury are more vulnerable — older, more remote memories are better consolidated and more resistant to amnesia-producing damage.", difficulty: "hard" },
    { topicId: T["Neuropsychology Overview"], question: "What is confabulation?", answer: "Producing confident but erroneous memories without intent to deceive — 'honest lying' caused by frontal lobe damage impairing memory monitoring and error detection; classic in Korsakoff's syndrome and ventromedial PFC lesions.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is the Brief Visuospatial Memory Test-Revised (BVMT-R)?", answer: "A test of visual learning and memory using geometric figures — measures immediate recall, learning over 3 trials, delayed recall, recognition, and copy — the visual memory analog of the HVLT-R for verbal memory.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is the Hopkins Verbal Learning Test-Revised (HVLT-R)?", answer: "A brief verbal learning test using 12 words across semantic categories — yields total learning, retention (delayed recall %), recognition discriminability — widely used in medical settings and cognitively impaired populations.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is the difference between encoding, storage, and retrieval memory failures?", answer: "Encoding failure = information never enters long-term memory (e.g., severe TBI). Storage failure = information is lost over time (e.g., hippocampal disease). Retrieval failure = stored information cannot be accessed (e.g., frontal lobe lesions — cued recall helps).", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is the Delis-Kaplan Executive Function System (D-KEFS)?", answer: "A comprehensive battery assessing executive functions — includes Trail Making Test, Color-Word Interference (Stroop), Verbal Fluency (FAS + category), Sorting Test, and Tower test — provides normed subtests across the lifespan.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What are the 8 cognitive domains typically assessed in a neuropsychological evaluation?", answer: "Attention/Concentration, Processing Speed, Memory (verbal/visual encoding, storage, retrieval), Executive Functions, Language, Visuospatial Abilities, Sensorimotor Function, and Emotional/Behavioral Functioning.", difficulty: "medium" },
    { topicId: T["Neuropsychology Overview"], question: "What is the category fluency test?", answer: "Patient names as many items from a category (e.g., animals) in 60 seconds — assesses semantic memory organization, word retrieval, and processing speed; impaired in semantic dementia and Alzheimer's disease.", difficulty: "easy" },
    { topicId: T["Neuropsychology Overview"], question: "What is phonemic (letter) fluency and how does it differ from category fluency?", answer: "Letter fluency (FAS test): patient names words beginning with a given letter — more frontal executive demand. Category fluency: more temporal/semantic memory demand. FAS is more sensitive to frontal lobe dysfunction.", difficulty: "medium" },

    // ===== EXPANDED BATCH — CELL BIOLOGY & NEURON ANATOMY (30 more) =====
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the phospholipid bilayer of the neuronal membrane?", answer: "The cell membrane consists of two layers of phospholipids with hydrophilic heads facing outward and hydrophobic tails facing inward — embedded with ion channels, receptors, and transport proteins.", difficulty: "easy" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the Na+/K+ ATPase pump and why is it important?", answer: "An active transporter that maintains resting membrane potential by pumping 3 Na+ out and 2 K+ in per ATP — essential for repolarizing the membrane after action potentials; ~30-40% of neuron's energy budget.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is an ionotropic receptor?", answer: "A receptor that is directly coupled to an ion channel — ligand binding opens the channel immediately (fast), causing rapid ion flux (e.g., AMPA, NMDA, GABA-A, nicotinic ACh receptors).", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is a metabotropic receptor?", answer: "A receptor coupled to G-proteins — ligand binding activates intracellular signaling cascades (slower, longer-lasting effects), modulating ion channels indirectly (e.g., GABA-B, mGluR, all muscarinic receptors, most monoamine receptors).", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is long-term potentiation (LTP) and which receptor is central to it?", answer: "LTP is a lasting increase in synaptic strength following high-frequency stimulation — the NMDA receptor acts as a coincidence detector (requires both glutamate + postsynaptic depolarization to remove Mg2+ block and allow Ca2+ influx).", difficulty: "hard" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the role of Ca2+ influx in LTP?", answer: "Ca2+ entering through NMDA receptors activates CaMKII, which phosphorylates AMPA receptors (increasing conductance) and triggers insertion of new AMPA receptors into the synapse — the cellular mechanism of synaptic strengthening.", difficulty: "hard" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is long-term depression (LTD)?", answer: "A persistent decrease in synaptic strength from low-frequency stimulation — involves dephosphorylation and endocytosis (removal) of AMPA receptors from the synapse; a mechanism for forgetting and synaptic refinement.", difficulty: "hard" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the blood-brain barrier (BBB) and what forms it?", answer: "A selective barrier that restricts substance entry into the brain — formed by specialized endothelial cells with tight junctions (no pores), surrounded by astrocyte end-feet and pericytes. Lipid-soluble molecules, gases, and glucose pass; most drugs do not.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What are microglia?", answer: "The resident immune cells of the CNS — derived from macrophage lineage; in normal conditions they 'survey' the brain; when activated (e.g., by infection or injury), they phagocytose debris and release inflammatory cytokines.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What are ependymal cells?", answer: "Glial cells lining the ventricular system and central canal of the spinal cord — they produce cerebrospinal fluid (CSF) and serve as a barrier between CSF and brain parenchyma; contain cilia that circulate CSF.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is adult neurogenesis and where does it occur?", answer: "The generation of new neurons in the adult brain — occurs in the subgranular zone (SGZ) of the hippocampal dentate gyrus and the subventricular zone (SVZ). Exercise, learning, and antidepressants promote neurogenesis.", difficulty: "hard" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is synaptic pruning?", answer: "The elimination of excess synaptic connections during development — driven by activity (use-dependent: active synapses survive), mediated by microglia engulfing complement-tagged synapses. Critical for neural circuit refinement.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the relative refractory period?", answer: "The period after the absolute refractory period when a neuron can fire if stimulated strongly enough — due to K+ channels still open (hyperpolarization); a stronger-than-normal stimulus is needed to reach threshold.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is spatial summation?", answer: "The additive effect of simultaneous EPSPs arriving from multiple synapses at different locations — if the combined depolarization reaches threshold at the axon hillock, an action potential fires.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the synaptic vesicle cycle?", answer: "Vesicles containing neurotransmitter are docked at the active zone via SNARE proteins (synaptobrevin, SNAP-25, syntaxin) — Ca2+ influx triggers fusion and exocytosis; vesicles are then recycled via endocytosis.", difficulty: "hard" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is frequency coding in neurons?", answer: "Information is encoded in the rate (frequency) of action potentials — stronger stimuli produce higher firing frequencies. This is because action potential amplitude is fixed (all-or-none law).", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the threshold potential?", answer: "Approximately -55 mV — the membrane potential at which voltage-gated Na+ channels open sufficiently to produce a self-regenerating action potential. Stimuli that depolarize to this level trigger firing.", difficulty: "easy" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is myelination and when does it occur in development?", answer: "The process of Schwann cells (PNS) or oligodendrocytes (CNS) wrapping axons with myelin — begins prenatally and continues into the 3rd decade of life; the frontal lobes are the last to fully myelinate.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What are dendritic spines and what is their function?", answer: "Small protrusions on dendrites that receive most excitatory synaptic input — they compartmentalize Ca2+ signaling and allow individual synaptic plasticity. Spine density and morphology change with learning and are altered in intellectual disability.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is neuronal apoptosis in development?", answer: "Programmed cell death that eliminates ~50% of neurons during development — neurons compete for trophic factors (e.g., NGF); those that fail to establish functional connections die via caspase-mediated apoptosis.", difficulty: "hard" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the role of BDNF in synaptic plasticity?", answer: "BDNF (from TrkB receptor signaling) promotes LTP by increasing AMPA receptor insertion, actin polymerization in spines, and gene expression for synaptic proteins — critical for memory consolidation.", difficulty: "hard" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is cortical neurogenesis and when does it peak?", answer: "Most cortical neurons are born from progenitors in the ventricular zone between gestational weeks 6-24 in humans, migrating along radial glia to their cortical layer in an 'inside-out' fashion (deepest layers first).", difficulty: "hard" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is demyelinating disease and give an example?", answer: "Diseases that damage the myelin sheath — Multiple sclerosis (MS) is the most common, with immune-mediated destruction of CNS myelin causing demyelinating plaques; leads to slowed conduction and neurological deficits.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is excitatory/inhibitory balance and why does it matter?", answer: "The balance of excitatory (glutamatergic) and inhibitory (GABAergic) inputs determines neuronal firing — disruption is implicated in epilepsy (too much excitation), schizophrenia (E/I imbalance), autism, and anxiety.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the perisynaptic astrocyte's role?", answer: "Astrocytes surrounding synapses clear glutamate via transporters (GLAST, GLT-1) to prevent excitotoxicity, recycle glutamine to neurons (glutamate-glutamine cycle), and modulate synaptic transmission — forming the 'tripartite synapse'.", difficulty: "hard" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is action potential propagation velocity and what determines it?", answer: "Speed of action potential conduction along an axon — determined by axon diameter (larger = faster) and myelination (myelinated > unmyelinated). Myelinated A-alpha fibers: ~70-120 m/s; unmyelinated C fibers: 0.5-2 m/s.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the difference between Schwann cells and oligodendrocytes?", answer: "Both produce myelin — Schwann cells are in the PNS and myelinate ONE axon segment each; oligodendrocytes are in the CNS and can myelinate up to 50 axon segments simultaneously.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What are cerebrospinal fluid (CSF) functions?", answer: "CSF cushions the brain from mechanical trauma, removes metabolic waste (including Aβ via the glymphatic system — especially during sleep), delivers nutrients, and maintains electrolyte homeostasis.", difficulty: "medium" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the glymphatic system?", answer: "A brain-wide waste clearance system where CSF flows along perivascular spaces, flushing out metabolic waste (including amyloid-beta and tau) into the lymphatic system — primarily active during sleep; dysfunction may contribute to AD.", difficulty: "hard" },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is depolarization block (vs. inhibition)?", answer: "When a neuron is excessively depolarized and voltage-gated Na+ channels become inactivated — the cell becomes unable to fire despite being more depolarized than resting potential. Exploited by some antiepileptic drugs.", difficulty: "hard" },

    // ===== EXPANDED BATCH — NEUROTRANSMITTERS & SYNAPTIC TRANSMISSION (30 more) =====
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are the four dopamine pathways in the brain?", answer: "1) Mesolimbic (VTA → nucleus accumbens): reward/motivation; 2) Mesocortical (VTA → PFC): executive function/working memory; 3) Nigrostriatal (SN → striatum): motor control; 4) Tuberoinfundibular (hypothalamus → pituitary): inhibits prolactin.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "How is dopamine synthesized?", answer: "Tyrosine → L-DOPA (via tyrosine hydroxylase, the rate-limiting enzyme) → Dopamine (via DOPA decarboxylase). Stored in vesicles, released into synapse, and reuptaken by DAT (dopamine transporter).", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the difference between D1-like and D2-like dopamine receptors?", answer: "D1-like (D1, D5): coupled to Gs proteins, increase cAMP — excitatory; D2-like (D2, D3, D4): coupled to Gi proteins, decrease cAMP — inhibitory; D2 is the primary target of antipsychotic medications.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are the two types of monoamine oxidase (MAO)?", answer: "MAO-A: preferentially metabolizes serotonin, norepinephrine, and epinephrine — inhibited by irreversible MAOIs and moclobemide; MAO-B: preferentially metabolizes dopamine and phenethylamine — inhibited by selegiline (used in Parkinson's).", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "How is serotonin (5-HT) synthesized?", answer: "Tryptophan → 5-HTP (via tryptophan hydroxylase, rate-limiting) → Serotonin (via AAAD). Released into synapse, reuptaken by SERT (serotonin transporter) — target of SSRIs; metabolized by MAO-A to 5-HIAA.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the main serotonin nucleus and where does it project?", answer: "The raphe nuclei (in the brainstem) are the main serotonergic nuclei — they project widely throughout the brain (cortex, limbic, basal ganglia, cerebellum, spinal cord), modulating mood, sleep, appetite, and pain.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is norepinephrine (NE) and where is it produced?", answer: "NE (noradrenaline) is a monoamine neurotransmitter synthesized from dopamine via dopamine-β-hydroxylase — primarily produced in the locus coeruleus (LC) of the brainstem, projecting diffusely throughout the brain; mediates arousal and stress response.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are the nicotinic acetylcholine receptor (nAChR) and its clinical relevance?", answer: "Ionotropic receptor permeable to Na+, K+, and Ca2+ — found at neuromuscular junctions and CNS (autonomic ganglia, VTA); target of nicotine (addictive) and succinylcholine (muscle relaxant in anesthesia).", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are muscarinic acetylcholine receptors and their clinical relevance?", answer: "Metabotropic G-protein coupled receptors (M1-M5) — M1 in cortex/hippocampus: cognition; M2 in heart: slows rate; M3 in glands: secretion. Blocked by anticholinergics (atropine, antihistamines) causing dry mouth, urinary retention, confusion.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the cAMP second messenger pathway?", answer: "Receptor (Gs) → adenylate cyclase → ATP → cAMP → PKA (protein kinase A) → phosphorylates ion channels and transcription factors. Activated by dopamine (D1), serotonin (5-HT4), adrenergic receptors (β).", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the PLC (phospholipase C) second messenger pathway?", answer: "Receptor (Gq) → PLC → PIP2 → IP3 + DAG; IP3 releases Ca2+ from ER; DAG activates PKC — activated by muscarinic M1/M3, 5-HT2, α1-adrenergic, mGluR group I receptors.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are AMPA receptors and how do they differ from NMDA receptors?", answer: "AMPA receptors: fast, always open when glutamate binds (Na+ influx, depolarization). NMDA receptors: require glutamate + postsynaptic depolarization to remove Mg2+ block + glycine co-agonist — allow Ca2+ influx triggering LTP.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the GABA-A receptor and what are its clinical modulating sites?", answer: "Ionotropic Cl- channel (hyperpolarization = inhibition) — benzodiazepines bind the BZD site (between α and γ subunits) to increase channel opening frequency; barbiturates increase open duration; alcohol also potentiates GABA-A.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is GABA-B and how does it differ from GABA-A?", answer: "GABA-B is a metabotropic Gi-coupled receptor — located presynaptically (reducing neurotransmitter release as autoreceptor) and postsynaptically (activating K+ channels, hyperpolarization); baclofen is a GABA-B agonist used for spasticity.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is substance P and what does it do?", answer: "A neuropeptide (11 amino acids) released from C-fibers in the spinal cord dorsal horn — activates NK1 receptors, transmitting pain signals. High concentrations in pain pathways, substantia nigra, and amygdala.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is neuropeptide Y (NPY) and its function?", answer: "One of the most abundant neuropeptides in the brain — potently stimulates appetite (orexigenic) in the hypothalamus; also anxiolytic; high in the arcuate nucleus responding to fasting/ghrelin signals.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the dopamine transporter (DAT) and its clinical relevance?", answer: "DAT reuptakes dopamine from the synapse into the presynaptic neuron — cocaine blocks DAT (and SERT, NET), dramatically increasing monoamine levels. Methylphenidate also blocks DAT/NET but more gradually.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are autoreceptors?", answer: "Presynaptic receptors that respond to the neuron's own neurotransmitter — function as negative feedback: when NT levels rise, autoreceptors reduce synthesis and release (e.g., D2 autoreceptors in dopamine neurons, 5-HT1A in raphe).", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is acetylcholinesterase and where is it clinically targeted?", answer: "The enzyme that breaks down acetylcholine in the synapse — inhibited by acetylcholinesterase inhibitors (AChEI): donepezil, rivastigmine, galantamine for Alzheimer's; organophosphates (nerve agents/pesticides) also inhibit it, causing cholinergic crisis.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are enkephalins and endorphins?", answer: "Endogenous opioid peptides — enkephalins (met-enkephalin, leu-enkephalin) act on delta and mu receptors; beta-endorphin acts on mu receptors. Released during stress, exercise, and pain — produce analgesia and euphoria.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are the three types of opioid receptors and their effects?", answer: "Mu (μ): analgesia, euphoria, respiratory depression, physical dependence; Kappa (κ): analgesia, dysphoria, sedation; Delta (δ): analgesia, antidepressant effects. All are Gi-coupled, reducing cAMP and neuronal excitability.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is nitric oxide (NO) as a neurotransmitter?", answer: "A gaseous, membrane-permeable retrograde messenger — synthesized by nitric oxide synthase (NOS) in response to Ca2+ influx; diffuses back to the presynaptic terminal, enhancing glutamate release; important in LTP and cerebrovascular regulation.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "How does amphetamine differ from cocaine in mechanism?", answer: "Cocaine blocks monoamine reuptake transporters (DAT, SERT, NET). Amphetamine additionally enters the presynaptic terminal, causing DAT to run in reverse and releasing dopamine from vesicles into the cytoplasm — more potent dopamine release.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the cholinergic basal forebrain system?", answer: "Cholinergic neurons in the nucleus basalis of Meynert (NBM), diagonal band of Broca, and medial septum — project widely to cortex and hippocampus, modulating attention, memory, and arousal. Degenerate in Alzheimer's disease.", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is reuptake vs. enzymatic degradation of neurotransmitters?", answer: "Reuptake: transporter proteins (DAT, SERT, NET) return the NT to the presynaptic cell for reuse (main mechanism for monoamines). Enzymatic degradation: enzymes break down the NT in the synapse (main for ACh via AChE; also MAO for monoamines).", difficulty: "medium" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the mesocortical dopamine pathway and its function?", answer: "Projects from the VTA to the prefrontal cortex — modulates cognitive functions (executive function, working memory, attention). Hypofunction in this pathway is associated with negative symptoms and cognitive deficits of schizophrenia.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is ketamine's mechanism of action?", answer: "NMDA receptor antagonist — blocks the receptor channel when open. At sub-anesthetic doses, produces rapid antidepressant effects (hours, not weeks) — now FDA-approved as esketamine (Spravato) for treatment-resistant depression.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is the glutamate-glutamine cycle?", answer: "Released glutamate is taken up by astrocytes → converted to glutamine (by glutamine synthetase) → shuttled back to neurons → reconverted to glutamate (by glutaminase). This recycling maintains the synaptic pool of glutamate.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What is co-release of neurotransmitters?", answer: "Many neurons release more than one neurotransmitter (e.g., dopamine + glutamate, or a classical NT + a neuropeptide) — neuropeptides are typically co-released during high-frequency firing and have neuromodulatory effects.", difficulty: "hard" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "What are kainate receptors?", answer: "A third type of ionotropic glutamate receptor (besides AMPA and NMDA) — important in modulating synaptic transmission and epilepsy. Kainic acid (from red algae) activates these receptors and is used to induce experimental seizures.", difficulty: "hard" },

    // ===== EXPANDED BATCH — SENSORY PATHWAYS (30 more) =====
    { topicId: T["Sensory Pathways"], question: "What is the dorsal column-medial lemniscal (DCML) pathway?", answer: "Carries fine touch, proprioception, and vibration — first-order neurons enter spinal cord and ascend ipsilaterally in the dorsal columns (fasciculus gracilis for legs, fasciculus cuneatus for arms) to the medulla, then cross to the medial lemniscus → VPL thalamus → somatosensory cortex.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the spinothalamic tract and what does it carry?", answer: "Carries pain, temperature, and crude touch — first-order neurons synapse in the dorsal horn, second-order neurons cross immediately in the spinal cord (anterior commissure) and ascend in the anterolateral column → thalamus (VPL) → somatosensory cortex.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is Brown-Séquard syndrome?", answer: "Hemisection of the spinal cord causing: ipsilateral loss of DCML sensations (fine touch, proprioception) AND ipsilateral motor loss BELOW the lesion; contralateral loss of pain and temperature BELOW the lesion (spinothalamic crossover).", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What are the features of upper motor neuron (UMN) lesions?", answer: "Spasticity (increased tone), hyperreflexia (exaggerated deep tendon reflexes), clonus, Babinski sign (upgoing toe), weakness without atrophy initially — lesion is in the CNS (cortex, brainstem, or spinal cord ABOVE the anterior horn).", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What are the features of lower motor neuron (LMN) lesions?", answer: "Flaccidity (decreased tone), hyporeflexia/areflexia, fasciculations, and muscle atrophy — lesion is in the anterior horn cell, ventral root, peripheral nerve, or neuromuscular junction.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the basal ganglia direct pathway?", answer: "Cortex → striatum → GPi/SNr (via direct D1 receptors) → thalamus → cortex — INHIBITS GPi, RELEASING thalamic inhibition, FACILITATING movement. Dopamine FACILITATES this pathway via D1.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What is the basal ganglia indirect pathway?", answer: "Cortex → striatum → GPe → STN → GPi/SNr → thalamus → cortex — EXCITES GPi, INCREASING thalamic inhibition, SUPPRESSING movement. Dopamine INHIBITS this pathway via D2, reducing movement suppression.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What happens in Parkinson's disease to the direct and indirect pathways?", answer: "Loss of dopamine from the substantia nigra → reduced D1 stimulation (direct pathway down) and reduced D2 inhibition (indirect pathway up) → INCREASED GPi activity → EXCESSIVE thalamic inhibition → bradykinesia and rigidity.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What are the three functional parts of the cerebellum?", answer: "1) Vestibulocerebellum (flocculonodular): balance and eye movement; 2) Spinocerebellum (vermis, intermediate): limb coordination, gait; 3) Cerebrocerebellum (lateral hemispheres): planning and motor learning.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What are the signs of cerebellar dysfunction?", answer: "DANISH: Dysdiadochokinesia (impaired rapid alternating movements), Ataxia (gait), Nystagmus, Intention tremor (worse on target), Slurred speech (dysarthria), Hypotonia — ipsilateral to the lesion.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the proprioceptive pathway (dorsal column)?", answer: "Proprioception (joint position sense) and vibration travel in the dorsal columns — fasciculus gracilis (legs) and fasciculus cuneatus (arms) — to the nucleus gracilis/cuneatus in the medulla, then decussate to the medial lemniscus and → VPL → S1.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the VPL and VPM thalamic nuclei and what do they relay?", answer: "VPL (ventral posterolateral): relays body somatosensory (pain, touch, proprioception) to S1 cortex. VPM (ventral posteromedial): relays face somatosensory (via trigeminal) and taste (via NTS) to S1 cortex and insula.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the lateral geniculate nucleus (LGN)?", answer: "Thalamic relay nucleus for vision — receives input from the optic tract and projects to the primary visual cortex (V1) in the occipital lobe via the optic radiation. Damage causes contralateral homonymous hemianopia.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the optic radiation and where does it run?", answer: "White matter tract from LGN to V1 — the inferior fibers (carrying superior visual fields) loop through the temporal lobe (Meyer's loop) before reaching the calcarine fissure; temporal lobe lesions cause 'pie in the sky' (superior visual field defect).", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What is the corticospinal tract (CST)?", answer: "The primary voluntary motor pathway — originates in M1 (primary motor cortex), descends through the internal capsule, crosses in the medullary pyramids (pyramidal decussation), then descends as the lateral CST to synapse on anterior horn cells.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the motor homunculus?", answer: "The somatotopic organization of the primary motor cortex (M1) — body is mapped in an inverted, distorted representation: leg/foot medially (near the longitudinal fissure), hand/fingers and face laterally; regions with fine motor control (hand, face) have the largest representation.", difficulty: "easy" },
    { topicId: T["Sensory Pathways"], question: "What is the somatosensory homunculus?", answer: "The somatotopic organization of S1 (postcentral gyrus) — mirrors the motor homunculus with largest areas for lips, tongue, and fingers, reflecting their high density of sensory receptors; medial → feet/legs, lateral → face.", difficulty: "easy" },
    { topicId: T["Sensory Pathways"], question: "What is syringomyelia?", answer: "A fluid-filled cavity (syrinx) within the spinal cord — destroys the anterior commissure, causing bilateral loss of pain and temperature at the level of the lesion (cape distribution) while preserving proprioception (dorsal columns intact).", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What is the posterolateral funiculus and what disease damages it?", answer: "The dorsal columns (fasciculi gracilis + cuneatus) — damaged by vitamin B12 deficiency (subacute combined degeneration), causing dorsal column dysfunction (loss of proprioception and vibration) and corticospinal tract degeneration.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What is Horner's syndrome?", answer: "Ipsilateral ptosis (drooping eyelid), miosis (small pupil), and anhidrosis (lack of sweating on face) — from disruption of the sympathetic pathway at any level (hypothalamus, brainstem, C8-T1, cervical sympathetic chain).", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What is the spinocerebellar tract?", answer: "Carries proprioceptive information from muscles and joints to the cerebellum (for smooth movement coordination) — the dorsal spinocerebellar tract carries information from the lower limbs ipsilaterally; the anterior carries crossed information.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the thalamus and what are its major functions?", answer: "The thalamus is the brain's relay and integration hub — almost all sensory information (except smell) passes through it. Major nuclei relay vision (LGN), hearing (MGN), somatosensory (VPL/VPM), motor (VA/VL), and emotion (anterior, mediodorsal).", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is cauda equina syndrome?", answer: "Compression of the cauda equina (lumbar and sacral nerve roots below L1-L2 cord termination) — causes LMN signs (flaccidity, areflexia), saddle anesthesia, bladder/bowel dysfunction, and bilateral leg weakness — a neurosurgical emergency.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What is the posterior limb of the internal capsule?", answer: "Contains corticospinal (voluntary motor) and thalamocortical sensory fibers — most commonly damaged in lacunar strokes from small vessel disease; causes dense contralateral hemiplegia and hemisensory loss.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What are Rexed laminae?", answer: "The 10 laminar zones of the spinal cord gray matter — Lamina I-II (marginal zone/substantia gelatinosa): pain/temperature input; Lamina III-IV: touch; Lamina V: wide dynamic range neurons; Lamina IX: motor neurons.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What is the red nucleus?", answer: "A large nucleus in the midbrain tegmentum receiving cerebellar and cortical input — gives rise to the rubrospinal tract (lateral brainstem/spinal cord), contributing to voluntary limb movement; relatively minor in humans compared to primates.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What are the anterior horn cells of the spinal cord?", answer: "The cell bodies of lower motor neurons (LMNs) in the ventral gray horn — their axons exit via ventral roots to innervate skeletal muscles; alpha motor neurons control muscle fibers, gamma motor neurons regulate muscle spindle sensitivity.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is the rubrospinal tract?", answer: "Originates in the red nucleus (midbrain), immediately crosses midline, descends in the lateral white matter — aids voluntary control of distal limb muscles; relatively minor in humans but may contribute to motor recovery after CST damage.", difficulty: "hard" },
    { topicId: T["Sensory Pathways"], question: "What is the vestibulospinal tract?", answer: "Originates in the vestibular nuclei (brainstem) and descends to the spinal cord — facilitates extensor muscle activity and maintains balance/posture; activated by vestibular input signaling head movement.", difficulty: "medium" },
    { topicId: T["Sensory Pathways"], question: "What is a dermatome?", answer: "A skin region innervated by a single spinal nerve root — important for localizing spinal cord or nerve root lesions. C7 = middle finger; T4 = nipple; T10 = umbilicus; L4 = medial leg; S1 = lateral foot.", difficulty: "medium" },

    // ===== EXPANDED BATCH — SENSORY SYSTEMS (30 more) =====
    { topicId: T["Sensory Systems"], question: "What is the vestibular system and what does it detect?", answer: "The vestibular system (inner ear) detects head movement and position: semicircular canals detect rotational acceleration (angular); otolith organs (utricle = horizontal, saccule = vertical) detect linear acceleration and gravity.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the vestibulocochlear nerve (CN VIII)?", answer: "CN VIII has two branches: Cochlear (hearing — from spiral ganglion cells of the cochlea) and Vestibular (balance — from vestibular ganglion cells). Damage causes sensorineural hearing loss, tinnitus, and/or vestibular dysfunction.", difficulty: "easy" },
    { topicId: T["Sensory Systems"], question: "What is the olfactory pathway and why is it unique?", answer: "CN I (olfactory) → olfactory bulb → olfactory tract → piriform cortex and amygdala — unique because it is the ONLY sensory system that does NOT relay through the thalamus before reaching cortex; it has direct limbic connections.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the taste pathway?", answer: "Taste receptor cells → CN VII (anterior 2/3 tongue), CN IX (posterior 1/3), CN X (epiglottis) → nucleus tractus solitarius (NTS) → VPM thalamus → insular and frontal opercular cortex.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the ventral (what) visual stream?", answer: "Runs from V1 through V2, V4 → inferotemporal (IT) cortex — processes object identity, color, and face recognition. Damage causes visual agnosias (inability to recognize objects despite seeing them).", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the dorsal (where/how) visual stream?", answer: "Runs from V1 through V2, V5 (MT) → posterior parietal cortex — processes spatial location, motion detection, and visual guidance of action. Damage causes optic ataxia, neglect, and deficits in visually guided movement.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What are rods vs. cones and their distribution in the retina?", answer: "Rods: ~120 million, periphery of retina, sensitive to dim light (scotopic vision), no color discrimination. Cones: ~6 million, concentrated in fovea, require bright light, provide color (photopic) and high-acuity vision.", difficulty: "easy" },
    { topicId: T["Sensory Systems"], question: "What is the gate control theory of pain?", answer: "Melzack and Wall (1965): 'gates' in the dorsal horn (substantia gelatinosa) modulate pain transmission — large-diameter Aβ fibers (touch) can inhibit small-diameter C/Aδ pain fiber signals; explains why rubbing a hurt area reduces pain.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the periaqueductal gray (PAG) and its role in pain?", answer: "The PAG (midbrain) is the primary center for endogenous pain control — activated by stress, opioids, and emotions; it drives descending inhibition via the rostroventral medulla (RVM) to the dorsal horn, suppressing pain transmission via NE and 5-HT.", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is place coding in the cochlea?", answer: "Different frequencies are processed at different locations along the basilar membrane — high frequencies at the base (stiff), low frequencies at the apex (flaccid). This tonotopic organization is preserved up to auditory cortex.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the auditory cortex and where is it located?", answer: "Primary auditory cortex (A1) is located in Heschl's gyri (transverse temporal gyri) of the superior temporal plane — it receives tonotopically organized input from the MGN and is responsible for basic pitch discrimination.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What are Meissner's, Merkel's, Ruffini's, and Pacinian corpuscles?", answer: "Mechanoreceptors for touch: Meissner's (fingertip ridges — fine touch, fast adapting); Merkel's (skin ridges — fine touch, slow adapting); Ruffini's (deep dermis — stretch/pressure, slow adapting); Pacinian (deep, fast vibration, fast adapting).", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is two-point discrimination and what does it test?", answer: "The ability to perceive two separate stimuli as distinct — tests the density of mechanoreceptors and cortical somatosensory representation; highest acuity at the fingertips (~2mm); impaired by dorsal column or S1 lesions.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is proprioception and what are its receptors?", answer: "Proprioception = sense of body position and movement — receptors include muscle spindles (detect muscle stretch via Ia afferents), Golgi tendon organs (detect muscle tension via Ib afferents), and joint receptors; travels in the dorsal columns.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the muscle spindle and how does it work?", answer: "Intrafusal muscle fibers inside a capsule — detect muscle stretch; Ia afferents signal stretch velocity; II afferents signal static position; gamma motor neurons regulate spindle sensitivity independent of alpha motor neuron activity.", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is the Golgi tendon organ (GTO)?", answer: "Proprioceptive receptor located at the muscle-tendon junction — detects muscle tension via Ib afferents; high tension activates Ib fibers that inhibit the same muscle (autogenic inhibition) to prevent tendon damage.", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is tinnitus and what causes it?", answer: "Phantom sounds (ringing, buzzing) — most commonly caused by hair cell damage in the cochlea leading to reduced peripheral input and compensatory increases in central auditory cortex activity (similar to phantom limb mechanisms).", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is V1 (primary visual cortex) and its basic organization?", answer: "V1 (striate cortex) in the calcarine fissure of the occipital lobe — retinotopically organized, processes orientation, spatial frequency, and basic visual features; the fovea is massively over-represented (cortical magnification).", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is V5/MT and its function?", answer: "V5 (area MT — middle temporal) is specialized for visual motion processing — receives input from V1 and M-pathway ganglion cells; damage causes akinetopsia (inability to perceive motion, world appears as still frames).", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is hyperalgesia vs. allodynia?", answer: "Hyperalgesia: exaggerated pain response to a normally painful stimulus (increased pain sensitivity). Allodynia: pain in response to a normally non-painful stimulus (e.g., light touch hurting). Both indicate central sensitization.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is central sensitization in pain?", answer: "Increased responsiveness of central pain-processing neurons following repeated nociceptive input — leads to hyperalgesia and allodynia; underlies chronic pain conditions (fibromyalgia, CRPS, post-herpetic neuralgia).", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is benign paroxysmal positional vertigo (BPPV)?", answer: "The most common cause of vertigo — otoconia (calcium crystals) displaced into the semicircular canals falsely signal head rotation; treated with repositioning maneuvers (Epley maneuver) that move the crystals out.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is congenital anosmia and what syndrome is it associated with?", answer: "Inability to smell from birth — associated with Kallmann syndrome (X-linked): anosmia + hypogonadotropic hypogonadism (due to failed GnRH neuron migration along the olfactory nerve). Olfactory bulbs are absent on MRI.", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is color blindness and which photoreceptors are involved?", answer: "Inherited deficiency in cone photopigments — most common is red-green color blindness (M- or L-cone deficiency), X-linked, affecting ~8% of males. Total color blindness (achromatopsia) from complete cone absence is very rare.", difficulty: "easy" },
    { topicId: T["Sensory Systems"], question: "What is the tonotopic organization of the auditory system?", answer: "Frequency mapping is maintained throughout the auditory pathway (cochlea → cochlear nuclei → superior olive → inferior colliculus → MGN → A1) — high frequencies and low frequencies are processed in distinct, organized spatial areas at each level.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the difference between absolute and relative analgesia?", answer: "Absolute analgesia = complete loss of pain sensation. Relative analgesia (hypoalgesia) = reduced sensitivity to pain. Analgesia without loss of touch indicates selective C/Aδ fiber dysfunction (e.g., syringomyelia pattern).", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is cortical magnification factor in the visual cortex?", answer: "The fovea (central vision) has a disproportionately large representation in V1 relative to its retinal area — because foveal vision has the highest cone density and the most ganglion cells, requiring more cortical processing area.", difficulty: "hard" },
    { topicId: T["Sensory Systems"], question: "What is the stapedius reflex?", answer: "A protective reflex where the stapedius muscle (CN VII) tightens the stapes against loud sounds to protect the cochlea — absent in CN VII palsy (one test for Bell's palsy) and used diagnostically in middle ear assessments.", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is cutaneous (skin) mechanoreception and which modalities does it serve?", answer: "Skin receptors detect touch, pressure, vibration, and texture — different receptor types serve different functions: Meissner's (flutter vibration, slip detection), Pacinian (high-frequency vibration), Merkel's (form and texture), Ruffini (skin stretch).", difficulty: "medium" },
    { topicId: T["Sensory Systems"], question: "What is the somatosensory cortex (S1) and where is it located?", answer: "S1 (primary somatosensory cortex) is in the postcentral gyrus of the parietal lobe (Brodmann areas 1, 2, 3a, 3b) — receives somatosensory input via VPL/VPM and maps the body in the sensory homunculus.", difficulty: "easy" },

    // ===== EXPANDED BATCH — LIMBIC SYSTEM & MOTIVATION (30 more) =====
    { topicId: T["Limbic System & Motivation"], question: "What is the hippocampus and its subregions?", answer: "A medial temporal lobe structure critical for episodic and spatial memory — subregions: dentate gyrus (DG, inputs), CA3 (pattern completion, autobiographical memory), CA1 (pattern separation output), subiculum (output to entorhinal cortex), entorhinal cortex (gateway).", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the Papez circuit?", answer: "A circuit proposed for emotion and memory: hippocampus → fornix → mammillary bodies → anterior thalamus → cingulate cortex → entorhinal cortex → hippocampus. Disrupted in Korsakoff's (mammillary bodies + anterior thalamus damaged).", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What are the types of long-term memory?", answer: "Explicit (declarative): Episodic (personal experiences, 'remembering') and Semantic (general knowledge, 'knowing'). Implicit (nondeclarative): Procedural (motor skills, habits), Priming (perceptual facilitation), Classical conditioning, Habituation.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "Which brain structure is critical for classical (fear) conditioning?", answer: "The amygdala — specifically the basolateral amygdala (BLA) learns CS-US associations (fear conditioning), while the central nucleus (CeA) drives fear expression (freezing, autonomic responses). Amygdala damage blocks fear conditioning.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is procedural memory and which brain structures support it?", answer: "Procedural memory = motor skills and habits (e.g., riding a bike) — supported by the basal ganglia (habit formation) and cerebellum (motor refinement). These structures are spared in anterograde amnesia from hippocampal damage.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is semantic memory and where is it stored?", answer: "General factual knowledge independent of personal experience (e.g., 'Paris is the capital of France') — distributed throughout the association cortex, especially the anterior temporal lobes; selectively damaged in semantic dementia.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is priming memory?", answer: "Implicit memory where prior exposure to a stimulus facilitates later processing — occurs without conscious awareness; survives hippocampal damage. Example: faster word completion for recently seen words.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is the fornix and what happens if it is damaged?", answer: "A major white matter output tract of the hippocampus, projecting to the mammillary bodies and septal nuclei — bilateral fornix damage (e.g., from colloid cyst, surgery) causes anterograde amnesia similar to hippocampal damage.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is HM (the famous amnesia patient)?", answer: "Henry Molaison — bilateral hippocampal/medial temporal lobectomy for epilepsy; profound anterograde amnesia with intact remote memory (before surgery), normal IQ, and intact implicit memory (motor learning) — demonstrated hippocampal role in episodic memory.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is the orbitofrontal cortex (OFC) and its role in motivation?", answer: "The OFC (ventral prefrontal cortex) integrates emotional, interoceptive, and reward information to assign value to stimuli and guide decision-making — OFC lesions cause impaired reward-based decision making (Iowa Gambling Task deficit) and inappropriate social behavior.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the Iowa Gambling Task?", answer: "A neuropsychological task simulating real-world decision making under uncertainty — participants choose from decks with varying rewards/penalties; normally healthy individuals develop somatic markers (emotional signals) to guide choices; vmPFC and amygdala patients fail.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is oxytocin and its role in social behavior?", answer: "A neuropeptide from the hypothalamus — promotes trust, bonding, mother-infant attachment, pair bonding, and reduces amygdala reactivity to social threats. Called the 'love hormone' or 'bonding hormone'; intranasal oxytocin is being researched for autism.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is the anterior cingulate cortex (ACC) and its role?", answer: "A frontal midline region (Brodmann area 24/25) — the dorsal ACC is involved in cognitive conflict detection and error monitoring; the subgenual ACC (area 25) is involved in emotional regulation and is hyperactive in depression (target of DBS).", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is stress-induced hippocampal atrophy?", answer: "Chronic stress → sustained cortisol elevation → glucocorticoid receptor activation → reduced BDNF, reduced neurogenesis, and dendritic retraction in CA3 → hippocampal volume reduction. Associated with depression, PTSD, and Cushing's syndrome.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is extinction of fear memory?", answer: "The gradual reduction of conditioned fear through repeated CS exposure without the US — extinction involves new inhibitory learning (not erasure) mediated by PFC (vmPFC) inhibiting the amygdala; the context-dependent nature of extinction underlies relapse.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the cingulate cortex and its three subdivisions?", answer: "Anterior cingulate (ACC): conflict monitoring, pain; Mid-cingulate: motor control, error detection; Posterior cingulate (PCC): self-referential thought, part of default mode network. The cingulate is a key limbic-cortical interface.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What are mirror neurons?", answer: "Neurons that fire both when performing an action and when observing another perform the same action — discovered in macaque premotor cortex; proposed to underlie imitation, empathy, and theory of mind in humans (though debated).", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is the mesolimbic dopamine system's role in addiction?", answer: "Addictive drugs cause supraphysiological dopamine release in the nucleus accumbens (NAc) — this creates a powerful reward memory, sensitization (greater cue-triggered craving), and eventually anhedonia from downregulated dopamine receptors.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the endocannabinoid system's role in learning and memory?", answer: "Endocannabinoids (anandamide, 2-AG) facilitate extinction of fearful memories and allow forgetting — CB1 receptor blockade impairs extinction; exogenous cannabis can disrupt memory encoding and consolidation.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is theory of mind (mentalizing) and which brain regions support it?", answer: "Theory of mind = the ability to attribute mental states to others (beliefs, desires, intentions) — supported by the temporoparietal junction (TPJ), medial PFC, posterior superior temporal sulcus, and anterior temporal lobes.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is the difference between incentive salience and hedonic pleasure?", answer: "Incentive salience = wanting/craving driven by dopamine (motivates approaching reward). Hedonic pleasure = liking/pleasure driven by opioids and endocannabinoids in the NAc. In addiction, wanting increases while liking decreases.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the concept of reconsolidation?", answer: "When a stored memory is recalled, it re-enters a labile state and must be re-consolidated — providing an opportunity to modify or erase the memory with protein synthesis inhibitors or propranolol (blocking reconsolidation). Clinical implications for PTSD treatment.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the hippocampal theta rhythm?", answer: "A 4-8 Hz oscillation in the hippocampus during active exploration and REM sleep — coordinates the timing of place cell firing, facilitates information encoding, and synchronizes hippocampus with entorhinal cortex for memory formation.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the insular cortex (insula) and what does it process?", answer: "A cortical region buried within the lateral sulcus — processes interoception (awareness of body states), pain, taste, disgust, emotional awareness, and risk/uncertainty. Plays a key role in addiction (craving) and in body dysmorphic conditions.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is Papez-related amnesia?", answer: "Amnesia resulting from damage to the Papez circuit (especially mammillary bodies and dorsomedial thalamus) — caused by Wernicke-Korsakoff syndrome, thalamic infarcts, herpes encephalitis. Produces dense anterograde amnesia and confabulation.", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is the ventral tegmental area (VTA)?", answer: "The primary source of dopaminergic neurons forming the mesolimbic and mesocortical pathways — activated by unexpected rewards and conditioned cues; encodes reward value and motivational salience; central to addiction, motivation, and psychiatric disorders.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is the lateral hypothalamus (LH) and its role in feeding?", answer: "The 'feeding center' — stimulation causes eating, lesions cause starvation (aphagia). Contains orexin/hypocretin neurons (wakefulness, reward) and MCH neurons (feeding); coordinates reward-based and energy-homeostasis aspects of feeding.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What are place cells and grid cells?", answer: "Place cells (hippocampus): fire selectively when the animal is in a specific location (cognitive map). Grid cells (entorhinal cortex): fire in a hexagonal grid pattern across an environment, providing the coordinate system for spatial navigation (O'Keefe & Moser, Nobel Prize 2014).", difficulty: "hard" },
    { topicId: T["Limbic System & Motivation"], question: "What is Klüver-Bucy syndrome's specific amygdala connection?", answer: "Bilateral amygdala removal abolishes fear and threat recognition — animals approach snakes, respond with hypersexuality, and put objects in their mouths (hyperorality). The amygdala is essential for assigning motivational/emotional significance to stimuli.", difficulty: "medium" },
    { topicId: T["Limbic System & Motivation"], question: "What is the concept of 'somatic markers' (Damasio)?", answer: "Somatic marker hypothesis: the body provides emotion-based signals (somatic states) that guide decision-making — vmPFC lesions disconnect these signals from choices, causing poor real-world decisions despite intact logic (as in Phineas Gage).", difficulty: "hard" },

    // ===== EXPANDED BATCH — SLEEP & CIRCADIAN RHYTHMS (30 more) =====
    { topicId: T["Sleep & Circadian Rhythms"], question: "What are K-complexes and sleep spindles and when do they appear?", answer: "K-complexes: large biphasic waveforms occurring in response to external stimuli during N2 sleep. Sleep spindles: 12-15 Hz bursts of activity in N2 sleep generated by thalamocortical circuits — both are hallmarks of N2 (light NREM) sleep.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is delta wave sleep?", answer: "High-amplitude, low-frequency (<2 Hz) EEG waves characterizing N3 (slow-wave) sleep — the deepest NREM stage; hardest to arouse from; associated with physical restoration, growth hormone release, and memory consolidation.", difficulty: "easy" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What are PGO waves in REM sleep?", answer: "Ponto-geniculo-occipital (PGO) waves are phasic bursts of electrical activity during REM sleep originating in the pons and propagating to the LGN and occipital cortex — proposed to be the neurological substrate of dream imagery.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the two-process model of sleep regulation?", answer: "Borbély's model: Process S (homeostatic sleep pressure) — adenosine builds up during waking and is cleared during sleep; Process C (circadian drive for wakefulness) — driven by the SCN. Sleep occurs when Process S overcomes Process C.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What are the core circadian clock genes?", answer: "CLOCK and BMAL1 (positive regulators) activate transcription of PER (Period) and CRY (Cryptochrome) genes — PER/CRY proteins accumulate and then feedback to inhibit CLOCK/BMAL1 (negative feedback). This cycle takes ~24 hours.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the role of adenosine in sleep pressure?", answer: "Adenosine accumulates in the brain during prolonged wakefulness (a byproduct of neuronal activity) and promotes sleep by inhibiting wakefulness-promoting neurons in the basal forebrain. Caffeine works by blocking adenosine receptors (A1, A2A).", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is obstructive sleep apnea (OSA) and its cognitive effects?", answer: "Repetitive upper airway collapse during sleep → apnea episodes → hypoxia → arousals → fragmented sleep. Cognitive consequences: impaired attention, memory, and executive function; increased risk of dementia; treated with CPAP.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is REM sleep behavior disorder (RBD)?", answer: "A parasomnia where muscle atonia during REM is absent — patients act out vivid/violent dreams, injuring themselves or bed partners. RBD is a prodromal marker for Parkinson's disease, DLB, and MSA — may precede motor symptoms by years.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the sleep-promoting role of the ventrolateral preoptic area (VLPO)?", answer: "The VLPO (anterior hypothalamus) is the primary sleep-promoting nucleus — VLPO GABAergic neurons inhibit wakefulness-promoting systems (LC, raphe, TMN) during sleep; VLPO is damaged in aging and associated with insomnia.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the 'flip-flop switch' model of sleep-wake transitions?", answer: "The VLPO (sleep) and monoaminergic arousal systems (LC, raphe, TMN) mutually inhibit each other — creating a bistable switch that ensures rapid, full transitions between sleep and wake states rather than gradual drift.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the function of orexin/hypocretin?", answer: "Orexin neurons (lateral hypothalamus) stabilize the flip-flop switch by strongly promoting wakefulness and suppressing REM sleep — orexin deficiency causes narcolepsy type 1 (cataplexy), as the wake switch becomes unstable.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What are the phases of the normal sleep cycle?", answer: "N1 → N2 → N3 → (back up to N2) → REM — each cycle lasts ~90 minutes; early cycles have more N3, later cycles have more REM; 4-6 cycles per night; REM episodes lengthen through the night.", difficulty: "easy" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "How does REM sleep differ from NREM sleep in terms of EEG?", answer: "REM: desynchronized (low-amplitude, mixed-frequency) EEG — resembles waking EEG; accompanied by muscle atonia, REMs, and dreaming. NREM: synchronized (high-amplitude, slow waves in N3) — quieter EEG with slow oscillations.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is melatonin and how is it regulated?", answer: "A hormone synthesized from serotonin in the pineal gland — secretion is driven by darkness (SCN → paraventricular nucleus → superior cervical ganglion → pineal). Peaks at 2-3am, suppressed by light; used for jet lag and DSPS treatment.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What changes in sleep architecture occur across the lifespan?", answer: "Infants: ~50% REM, shorter cycles; adults: ~20% REM, 20% N3; elderly: dramatically reduced N3, fragmented sleep, earlier wake time, reduced REM. These changes contribute to cognitive aging and dementia risk.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is idiopathic hypersomnia?", answer: "Excessive daytime sleepiness despite adequate nighttime sleep — long sleep time (>11 hours), sleep inertia (difficulty waking), and non-refreshing naps. Distinguishable from narcolepsy by absence of cataplexy and normal MSLT sleep onset REM.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the Multiple Sleep Latency Test (MSLT)?", answer: "A daytime nap test used to diagnose narcolepsy and hypersomnia — measures sleep onset latency (normal >10 min; <8 min = pathological sleepiness) and sleep onset REM periods (SOREMPs, ≥2 = narcolepsy).", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the maintenance of wakefulness test (MWT)?", answer: "The patient tries to STAY AWAKE in a dark, quiet room — measures ability to maintain wakefulness (relevant for driving, occupational safety); complements MSLT in evaluating excessive sleepiness.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is seasonal affective disorder (SAD) and how does sleep relate?", answer: "Depression with seasonal pattern (fall/winter onset, spring remission) — caused by reduced light exposure affecting circadian rhythms and serotonin/melatonin; features hypersomnia, carbohydrate craving. Treated with bright light therapy (10,000 lux).", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What are the polysomnography (PSG) measures?", answer: "PSG records: EEG (brain waves), EOG (eye movements), EMG (muscle tone — chin), ECG (heart rhythm), airflow, oxygen saturation, respiratory effort — the gold standard for diagnosing sleep disorders.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is sleep inertia and when is it worst?", answer: "Grogginess, disorientation, and impaired performance immediately after waking — worst when awakening from deep N3 sleep; can last 15-30 minutes. Most dangerous for operators needing immediate alertness (pilots, military).", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the role of the locus coeruleus (LC) in wake-sleep regulation?", answer: "The LC (NE) fires maximally during waking (alertness), slows during NREM, and is completely silent during REM — this silence during REM is necessary for REM-related phenomena and is regulated by the VLPO.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "How does sleep deprivation affect the immune system?", answer: "Sleep deprivation reduces natural killer cell activity, impairs T-cell and B-cell function, and increases pro-inflammatory cytokines (IL-6, TNF-α) — short-sleepers have higher rates of infection and poorer vaccine responses.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the actigraph and what does it measure?", answer: "A wrist-worn accelerometer that monitors rest-activity cycles over days to weeks — estimates sleep timing, duration, and circadian patterns in natural settings; less accurate than PSG but better for longitudinal, real-world assessment.", difficulty: "easy" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What are the diagnostic criteria for narcolepsy type 1?", answer: "Excessive daytime sleepiness + cataplexy (sudden muscle weakness triggered by positive emotion) + MSLT showing mean sleep latency <8 min and ≥2 SOREMPs — definitively confirmed by low CSF orexin/hypocretin levels (<110 pg/mL).", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "How does alcohol affect sleep architecture?", answer: "Alcohol promotes N3 in the first half of sleep (deeper initially) but suppresses and delays REM — as blood alcohol drops in the second half, rebound REM causes fragmented sleep, vivid dreams, and early morning awakening.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is stimulus control therapy (SCT) in CBT-I?", answer: "A behavioral CBT-I component: reassociating the bed with sleep (only use bed for sleep/sex, get up if awake >20 min, maintain consistent wake time) — counteracts the conditioned arousal that develops in chronic insomnia.", difficulty: "medium" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What are the wakefulness-promoting brain systems?", answer: "Multiple monoaminergic ascending arousal systems: Locus coeruleus (NE), Raphe nuclei (5-HT), Tuberomammillary nucleus (histamine), VTA (dopamine), Basal forebrain (ACh), Lateral hypothalamus (orexin) — all converge to activate the cortex.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the glymphatic system's relationship to sleep?", answer: "The glymphatic system (CSF-based waste clearance) is ~10x more active during NREM sleep — it clears amyloid-beta and tau from the brain; chronic sleep deprivation reduces glymphatic function and may accelerate Alzheimer's pathology.", difficulty: "hard" },
    { topicId: T["Sleep & Circadian Rhythms"], question: "What is the 'rebound' phenomenon after sleep deprivation?", answer: "After sleep deprivation, recovery sleep has increases in both N3 (homeostatic response to adenosine buildup) and REM — the increase in N3 takes priority in early recovery, while REM rebounds in later recovery sleep.", difficulty: "medium" },

    // ===== EXPANDED BATCH — ENDOCRINE SYSTEM & REPRODUCTION (30 more) =====
    { topicId: T["Endocrine System & Reproduction"], question: "What are the hormones of the anterior pituitary (adenohypophysis)?", answer: "Six hormones: GH (growth hormone), TSH (thyroid-stimulating), ACTH (adrenocorticotropic), FSH (follicle-stimulating), LH (luteinizing), and PRL (prolactin) — each regulated by hypothalamic releasing/inhibiting hormones.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What are ADH (vasopressin) and oxytocin and where are they made?", answer: "Both neuropeptides are synthesized in the hypothalamus (paraventricular and supraoptic nuclei) but released from the posterior pituitary (neurohypophysis). ADH regulates water retention; oxytocin regulates uterine contractions and milk letdown.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What are the cognitive effects of hypothyroidism?", answer: "Hypothyroidism causes 'myxedema madness' in severe cases — slowed processing, poor memory, depression, psychosis, and dementia-like symptoms. Thyroid hormone is essential for myelination in the developing brain; neonatal hypothyroidism causes intellectual disability (cretinism).", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is Cushing's syndrome and its neuropsychological effects?", answer: "Chronic cortisol excess (from adrenal tumor, pituitary adenoma, or exogenous steroids) — neuropsychological effects: hippocampal atrophy (reduced volume), memory impairment, depression, cognitive slowing, and emotional lability.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is Addison's disease and its neuropsychiatric manifestations?", answer: "Primary adrenal insufficiency causing cortisol deficiency — neuropsychiatric effects: fatigue, depression, psychosis ('Addisonian crisis'), apathy, irritability, and cognitive impairment; treated with hydrocortisone replacement.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is congenital adrenal hyperplasia (CAH) and its effects on the brain?", answer: "21-hydroxylase deficiency → excess adrenal androgens. Girls with CAH are exposed to high prenatal androgens → masculinized digit ratio (2D:4D), more male-typical play behavior and spatial cognition — evidence for prenatal androgen effects on the brain.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the hypothalamic-pituitary-thyroid (HPT) axis?", answer: "TRH (hypothalamus) → TSH (anterior pituitary) → T3/T4 (thyroid gland) — negative feedback: T3/T4 suppress TRH and TSH. T4 is converted to active T3 in peripheral tissues. T3 is critical for neuronal development and metabolism.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the role of estrogen in brain function?", answer: "Estrogen (17β-estradiol) has multiple neuroprotective effects — promotes dendritic spine density, increases ACh synthesis, supports serotonergic and dopaminergic function, and modulates memory (hippocampus has high estrogen receptor density); relates to cognitive decline during menopause.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the role of testosterone in cognition?", answer: "Testosterone influences spatial cognition (beneficial for 3D rotation), risk-taking, and competitive behavior — men have higher testosterone and show spatial advantages; testosterone also has neuroprotective effects. Low testosterone in men → depression, fatigue, cognitive decline.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is prolactin and when is it elevated?", answer: "A pituitary hormone promoting milk production — elevated by suckling, stress, and antipsychotics (which block D2 dopamine receptors on prolactin-secreting cells; dopamine normally inhibits prolactin release). Hyperprolactinemia causes menstrual disruption and galactorrhea.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the role of glucocorticoids (cortisol) in memory?", answer: "Moderate cortisol enhances memory consolidation (stress-state-dependent memory). Chronic high cortisol is damaging: reduces hippocampal BDNF, inhibits neurogenesis, causes dendritic retraction → impaired memory and increased vulnerability to PTSD.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the organizational vs. activational distinction for sex hormones?", answer: "Organizational effects: permanent brain-masculinizing/feminizing effects of sex hormones during sensitive developmental windows (prenatal and early postnatal). Activational effects: reversible, transient effects of hormones in adulthood (e.g., testosterone's effects on mood).", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the HPA axis negative feedback loop?", answer: "CRH (hypothalamus) → ACTH (pituitary) → cortisol (adrenal cortex) → cortisol feeds back to INHIBIT CRH and ACTH production (negative feedback). Chronic stress can impair this feedback, leading to sustained cortisol elevation.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the dexamethasone suppression test?", answer: "Dexamethasone (synthetic glucocorticoid) should suppress cortisol in healthy individuals (HPA feedback intact) — non-suppression indicates HPA dysregulation (seen in melancholic depression, Cushing's, chronic stress). Used as a biological marker.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the allostatic load?", answer: "The cumulative 'wear and tear' on the brain and body from chronic stress and HPA activation — leads to cardiovascular disease, immune dysfunction, hippocampal atrophy, and impaired cognitive function. Related to socioeconomic and racial health disparities.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the role of the paraventricular nucleus (PVN) of the hypothalamus?", answer: "The PVN produces CRH, ADH, and oxytocin — it integrates stress signals and coordinates the HPA axis response; also regulates autonomic nervous system (ANS) through its projections to the brainstem and spinal cord.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the suprachiasmatic nucleus (SCN) and its relation to endocrine rhythms?", answer: "The SCN (master circadian clock in the anterior hypothalamus) controls the circadian rhythms of cortisol, melatonin, GH, and other hormones — cortisol peaks in the morning (driving arousal); GH pulses during N3 sleep.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is puberty and its effect on the brain?", answer: "Rising sex hormones during puberty trigger significant brain remodeling — synaptic pruning in PFC (ongoing until mid-20s), increased limbic system reactivity (emotional sensitivity), myelination progression, and changes in risk-taking and reward sensitivity.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the masculinized vs. feminized brain concept?", answer: "Prenatal testosterone exposure masculinizes the brain — affects sexually dimorphic structures (e.g., INAH-3 in the preoptic area, SDN-POA), cognitive profiles, and sexual orientation. The brain is default female without androgen influence.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is growth hormone (GH) and its cognitive effects?", answer: "GH from the anterior pituitary promotes physical growth via IGF-1 — adult GH deficiency (e.g., from pituitary surgery) causes fatigue, depression, impaired cognitive function, and reduced quality of life; GH pulses during slow-wave sleep.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the effect of chronic stress on the immune system?", answer: "Chronic cortisol suppresses immune function (anti-inflammatory) — reduces T-cell proliferation, NK cell activity, and antibody production. However, psychological stress also activates proinflammatory cytokines via other pathways, creating a complex relationship.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is PCOS (polycystic ovary syndrome) and its neuropsychological relevance?", answer: "A common endocrine disorder (excess androgens, irregular periods) — associated with depression, anxiety, and increased risk of cognitive impairment; higher prenatal androgen exposure in PCOS daughters affects neurodevelopment.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the renin-angiotensin-aldosterone system (RAAS) and its brain connection?", answer: "Angiotensin II acts on the brain (subfornical organ, not protected by BBB) to drive thirst and salt appetite; aldosterone regulates kidney Na+/K+ balance. The brain RAAS also modulates stress responses, anxiety, and blood pressure centrally.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the role of the amygdala in the stress response?", answer: "The amygdala receives threat signals and activates the HPA axis via CRH projections to the hypothalamus — it amplifies stress responses and encodes emotional memories. Amygdala hyperactivity in PTSD perpetuates HPA dysregulation.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the prenatal stress hypothesis?", answer: "Maternal stress during pregnancy → elevated cortisol crosses placenta → fetal HPA sensitization → offspring with heightened stress reactivity, increased anxiety, and vulnerable to psychiatric disorders — one mechanism for early-life adversity effects.", difficulty: "hard" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the role of thyroid hormones in neonatal brain development?", answer: "T3 is critical for CNS myelination, neuronal migration, and differentiation — neonatal hypothyroidism (cretinism) causes severe intellectual disability, deaf-mutism, and growth failure. Neonatal thyroid screening (PKU test) detects this early.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the digit ratio (2D:4D) and its endocrine significance?", answer: "The ratio of index finger (2D) to ring finger (4D) length — smaller ratio (ring > index) indicates higher prenatal testosterone exposure; larger ratio indicates lower. Used as a proxy for prenatal androgen exposure in research.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is ACTH and where does it come from?", answer: "Adrenocorticotropic hormone from the anterior pituitary — derived from POMC (pro-opiomelanocortin, the same precursor as beta-endorphin and MSH); stimulates the adrenal cortex to produce cortisol and adrenal androgens.", difficulty: "medium" },
    { topicId: T["Endocrine System & Reproduction"], question: "What is the melatonin rhythm and its clinical uses?", answer: "Melatonin secretion begins ~2 hours before habitual sleep onset (dim-light melatonin onset, DLMO) — used to phase shift circadian rhythms in jet lag, shift work, and DSPS. Low-dose melatonin has minimal direct sleep-inducing effects but shifts timing.", difficulty: "medium" },

    // ===== EXPANDED BATCH — PSYCHOPHARMACOLOGY (30 more) =====
    { topicId: T["Psychopharmacology"], question: "What is the volume of distribution (Vd) of a drug?", answer: "A theoretical volume that relates the drug dose to the plasma concentration — a large Vd means the drug distributes extensively into tissues (e.g., lipophilic drugs). Vd = Dose / Plasma concentration at time zero.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is the half-life of a drug and why does it matter clinically?", answer: "Time for plasma drug concentration to fall by 50% — drugs take ~4-5 half-lives to reach steady-state and 4-5 half-lives to be cleared. Long half-life: fewer doses needed, less withdrawal risk; short half-life: more doses required, greater withdrawal symptoms.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is bioavailability and what affects it?", answer: "The fraction of an oral dose that reaches systemic circulation — reduced by first-pass hepatic metabolism. IV drugs have 100% bioavailability. Highly metabolized drugs (e.g., morphine, propranolol) have low oral bioavailability.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is the benzodiazepine mechanism of action?", answer: "BZDs are positive allosteric modulators of GABA-A receptors — they bind between the α and γ subunits, increasing the FREQUENCY of Cl- channel opening in response to GABA. This enhances inhibitory neurotransmission → sedation, anxiolysis, anticonvulsant, muscle relaxant effects.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "How do barbiturates differ from benzodiazepines at GABA-A receptors?", answer: "Barbiturates increase the DURATION of Cl- channel opening (vs. BZD frequency); at high doses can activate GABA-A without GABA. This greater efficacy makes overdose more dangerous — barbiturates were replaced by BZDs for most clinical uses.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is lithium's mechanism of action?", answer: "Not fully understood — lithium inhibits inositol monophosphatase (depleting IP3 precursors for PLC signaling) and glycogen synthase kinase-3β (GSK-3β), and modulates gene expression. Narrow therapeutic window (0.6-1.2 mEq/L); requires regular monitoring.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What are the first-generation (typical) antipsychotics?", answer: "Block D2 dopamine receptors — examples: haloperidol, chlorpromazine, fluphenazine. Effective for positive symptoms; extrapyramidal side effects (EPS) common: acute dystonia, akathisia, parkinsonism, tardive dyskinesia from nigrostriatal D2 blockade.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What are second-generation (atypical) antipsychotics and how do they differ?", answer: "Block D2 AND 5-HT2A receptors (and others) — examples: olanzapine, quetiapine, risperidone, clozapine, aripiprazole. Lower EPS risk; key side effects: metabolic syndrome (weight gain, diabetes risk), QTc prolongation; clozapine: agranulocytosis (requires WBC monitoring).", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is tardive dyskinesia and what causes it?", answer: "Involuntary repetitive movements (lip smacking, tongue protrusion, choreiform) from chronic D2 blockade — caused by dopamine receptor upregulation in the nigrostriatal system; can be irreversible. Treated with VMAT2 inhibitors (valbenazine, deutetrabenazine).", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What are the SSRI medications and their mechanism?", answer: "Selective serotonin reuptake inhibitors (e.g., fluoxetine, sertraline, escitalopram) block SERT — increasing synaptic serotonin. First-line for depression, anxiety, OCD, PTSD; side effects: sexual dysfunction, GI symptoms, initial activation/anxiety; delayed onset (2-4 weeks).", difficulty: "easy" },
    { topicId: T["Psychopharmacology"], question: "What are SNRIs and how do they differ from SSRIs?", answer: "Serotonin-Norepinephrine Reuptake Inhibitors (e.g., venlafaxine, duloxetine) block both SERT and NET — used for depression, anxiety, pain, and fibromyalgia; more noradrenergic effects (e.g., increased blood pressure, sweating) than SSRIs.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What are tricyclic antidepressants (TCAs) and their side effects?", answer: "TCAs (e.g., amitriptyline, nortriptyline, imipramine) block SERT, NET, and multiple other receptors (H1, muscarinic, α1, Na+ channels) — lethal in overdose (cardiac arrhythmia); anticholinergic side effects (dry mouth, constipation, urinary retention, confusion).", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What are irreversible MAOIs and why are they dangerous?", answer: "Monoamine oxidase inhibitors (e.g., phenelzine, tranylcypromine) irreversibly inhibit MAO-A and B — prevent monoamine breakdown; effective for treatment-resistant depression and atypical depression. Require tyramine-free diet (cheese, wine, cured meats) or risk hypertensive crisis.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is the tyramine reaction?", answer: "Tyramine (in aged cheeses, wine, cured meats) is normally metabolized by MAO in the gut wall — with MAOIs blocking MAO, tyramine enters circulation, displaces NE from vesicles, causing dangerous hypertensive crisis (severe headache, stroke risk).", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is naltrexone and when is it used?", answer: "An opioid receptor antagonist (blocks mu, kappa, delta) — used for opioid use disorder (prevents euphoria from opioids) and alcohol use disorder (reduces cravings by blocking alcohol-induced endorphin release). Long-acting injectable formulation (Vivitrol) improves adherence.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is buprenorphine and how does it work?", answer: "A partial mu opioid agonist / kappa antagonist — high receptor affinity (displaces full agonists) but ceiling effect on respiratory depression, making it safer than full agonists. Used for opioid use disorder (Suboxone = buprenorphine + naloxone).", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is methadone and its properties?", answer: "A full mu opioid agonist with long half-life (24-36 hrs) and NMDA receptor antagonism — used for opioid use disorder maintenance and chronic pain. Risks: QTc prolongation, drug accumulation (overdose risk), drug interactions via CYP3A4.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is the mechanism of valproic acid (valproate)?", answer: "A mood stabilizer and anticonvulsant — mechanisms include: blocking Na+ channels (stabilizes neuronal membranes), enhancing GABA activity (inhibiting GABA-T, the enzyme that breaks down GABA), and inhibiting histone deacetylases. Used for bipolar and epilepsy.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is lamotrigine and its mechanism?", answer: "An anticonvulsant/mood stabilizer — blocks voltage-gated Na+ channels, reducing glutamate release. Particularly effective for bipolar depression; must be titrated slowly to prevent Stevens-Johnson syndrome (severe rash).", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is guanfacine and why is it used in ADHD?", answer: "A selective alpha-2A adrenergic agonist — acts on postsynaptic receptors in the PFC to strengthen PFC networks and improve working memory and impulse control. Non-stimulant ADHD treatment; also used for PTSD nightmares.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is first-pass metabolism?", answer: "Drugs absorbed orally pass through the liver before reaching systemic circulation — the liver metabolizes a fraction, reducing bioavailability. High first-pass drugs (e.g., morphine, propranolol, lidocaine) require much larger oral doses than parenteral.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What are the phases of drug metabolism?", answer: "Phase I: oxidation, reduction, hydrolysis (mainly CYP enzymes) — typically activate or reveal reactive groups; Phase II: conjugation (glucuronidation, sulfation, acetylation) — makes drug more water-soluble for excretion.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is protein binding of drugs and its clinical significance?", answer: "Many drugs bind to plasma proteins (albumin, α1-acid glycoprotein) — only the unbound (free) drug is pharmacologically active. Highly protein-bound drugs have longer half-lives and can be displaced by competing drugs, causing toxicity.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is akathisia and how is it treated?", answer: "An antipsychotic side effect (EPS) — subjective restlessness and inner drive to move; patients cannot sit still, pace constantly; can be confused with agitation or anxiety. Treated with propranolol (beta-blocker), benzodiazepines, or dose reduction.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is bupropion and its mechanism?", answer: "An atypical antidepressant that inhibits NET and DAT (not SERT) — no sexual side effects; also used for smoking cessation (Zyban) and ADHD. Risk: lowers seizure threshold (contraindicated in eating disorders/seizure history).", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is mirtazapine and its mechanism?", answer: "A noradrenergic and specific serotonergic antidepressant (NaSSA) — blocks α2 autoreceptors (increasing NE and 5-HT release), H1 receptors (sedation, weight gain), 5-HT2/3 receptors. Good for insomnia and weight loss associated depression.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is the black box warning on antidepressants for youth?", answer: "FDA black box warning: SSRIs and SNRIs may increase suicidal ideation and behavior in children, adolescents, and young adults (up to age 25) — clinical monitoring is required, especially in the first weeks of treatment.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is the mechanism of buspirone?", answer: "A partial 5-HT1A agonist (serotonin autoreceptor) — used for generalized anxiety disorder; takes 2-4 weeks to work (not PRN); no abuse potential, no sedation. Mechanism: reduces autoreceptor inhibition → increased serotonergic tone.", difficulty: "hard" },
    { topicId: T["Psychopharmacology"], question: "What is the CIWA scale and when is it used?", answer: "Clinical Institute Withdrawal Assessment for Alcohol — a standardized scale measuring alcohol withdrawal severity (tremor, diaphoresis, hallucinations, seizure risk); guides medication management (BZD dosing) in alcohol detoxification.", difficulty: "medium" },
    { topicId: T["Psychopharmacology"], question: "What is disulfiram (Antabuse) and its mechanism?", answer: "Blocks aldehyde dehydrogenase (ALDH) — alcohol → acetaldehyde (normally converted to acetate by ALDH); without ALDH, acetaldehyde accumulates → flushing, nausea, vomiting, palpitations. Creates aversive conditioning to alcohol.", difficulty: "medium" },

    // ===== EXPANDED BATCH — PSYCHOLOGICAL DISORDERS (30 more) =====
    { topicId: T["Psychological Disorders"], question: "What are positive symptoms of schizophrenia?", answer: "Hallucinations (most commonly auditory — command, commenting, or conversing voices), delusions (fixed false beliefs — paranoid most common), disorganized speech, and disorganized/catatonic behavior — respond best to antipsychotics.", difficulty: "easy" },
    { topicId: T["Psychological Disorders"], question: "What are negative symptoms of schizophrenia?", answer: "The '5 As': Alogia (poverty of speech), Affective blunting (flat affect), Anhedonia (inability to experience pleasure), Avolition (lack of motivation), Asociality — less responsive to antipsychotics; overlap with depression.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What are cognitive symptoms of schizophrenia?", answer: "Impairments in working memory, processing speed, executive function, verbal learning and memory, and social cognition — among the strongest predictors of functional outcome (employment, independent living). Not well addressed by antipsychotics.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is the dopamine hypothesis of schizophrenia?", answer: "Positive symptoms result from excess dopamine activity in the mesolimbic pathway (D2 overactivity) — supported by: D2 blockade treats positive symptoms; dopaminergic drugs (amphetamine, cocaine) can induce psychosis; PET shows excess striatal dopamine.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is the glutamate hypothesis of schizophrenia?", answer: "NMDA receptor hypofunction explains both positive AND negative/cognitive symptoms — supported by: PCP and ketamine (NMDA antagonists) induce schizophrenia-like symptoms including negative and cognitive symptoms, which D2 blockers do not.", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What are the DSM-5 criteria for major depressive disorder (MDD)?", answer: "5+ of 9 symptoms for ≥2 weeks (must include depressed mood or anhedonia): depressed mood, anhedonia, weight/appetite change, insomnia/hypersomnia, psychomotor agitation/retardation, fatigue, worthlessness/guilt, concentration difficulty, recurrent suicidal ideation.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is the monoamine hypothesis of depression?", answer: "Depression results from deficiency of monoamines (serotonin, norepinephrine, dopamine) — supported by antidepressant mechanism (reuptake blockade) but too simple: antidepressants work acutely but take 2-4 weeks for clinical effect (suggesting downstream changes are key).", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is the neuroplasticity hypothesis of depression?", answer: "Depression involves impaired neuroplasticity — reduced BDNF, hippocampal neurogenesis, and synaptic strength; antidepressants work by restoring BDNF and plasticity mechanisms over 2-4 weeks. Exercise and ketamine also restore plasticity rapidly.", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What is PTSD and what brain changes are associated with it?", answer: "PTSD: hyperactive amygdala (fear reactivity), reduced hippocampal volume (impaired contextual fear regulation), impaired vmPFC (cannot inhibit amygdala) — produces hyperarousal, flashbacks, nightmares, avoidance. HPA axis often dysregulated.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What are evidence-based treatments for PTSD?", answer: "First-line: Prolonged Exposure (PE), Cognitive Processing Therapy (CPT), and EMDR (Eye Movement Desensitization and Reprocessing) — all trauma-focused. SSRIs (sertraline, paroxetine) are FDA-approved pharmacotherapy. Prazosin for nightmares.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is generalized anxiety disorder (GAD)?", answer: "Excessive, uncontrollable worry about multiple domains (work, health, family) for ≥6 months — with 3+ somatic symptoms (fatigue, tension, irritability, concentration difficulty, sleep disturbance, restlessness). Treated with SSRIs/SNRIs or buspirone.", difficulty: "easy" },
    { topicId: T["Psychological Disorders"], question: "What is the cognitive model of depression (Beck)?", answer: "Beck's cognitive triad: negative views of self ('I am worthless'), world ('Everything is hopeless'), and future ('Nothing will get better') — maintained by cognitive distortions (all-or-nothing thinking, catastrophizing, mind reading). CBT targets these.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is learned helplessness and its relation to depression?", answer: "Seligman's model: animals exposed to inescapable shock become passive and fail to escape even when escape is possible — analogous to depression; the cognitive triad element of hopelessness (no control over outcomes). Reversed by behavioral activation.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is ECT (electroconvulsive therapy) and when is it used?", answer: "ECT delivers brief electrical seizures under general anesthesia — highly effective for severe, treatment-resistant depression, catatonia, and psychotic depression. Main side effect: short-term memory impairment. Mechanisms include increased BDNF and neuroplasticity.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is catatonia and what causes it?", answer: "A psychomotor syndrome with features: stupor (unresponsive), mutism, posturing, waxy flexibility, echolalia, stereotypy — can occur in bipolar, depression, schizophrenia, or as a medical condition. Treated with benzodiazepines or ECT.", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What is dissociative identity disorder (DID)?", answer: "Formerly multiple personality disorder — presence of two or more distinct personality states (alters) with amnesia between states; etiologically linked to severe childhood trauma and disrupted attachment; controversial diagnosis.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is the role of the immune system in depression?", answer: "Proinflammatory cytokines (IL-1β, IL-6, TNF-α) can cause 'sickness behavior' (fatigue, anhedonia, social withdrawal) — resembling depression. High C-reactive protein (CRP) predicts poor antidepressant response; anti-inflammatory treatments may have antidepressant effects.", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What are the specifiers for bipolar I vs. II disorder?", answer: "Bipolar I: at least one manic episode (may include psychosis, requires hospitalization). Bipolar II: hypomania + major depression (NEVER a full manic episode); often misdiagnosed as unipolar depression because depressive episodes dominate.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is cyclothymic disorder?", answer: "≥2 years of hypomanic + depressive symptoms that never meet full criteria for hypomanic or major depressive episodes — a milder bipolar spectrum condition; associated with significant functional impairment despite milder symptoms.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What are the DSM-5 psychotic symptom criteria for schizophrenia?", answer: "Two or more symptoms for ≥1 month (at least one must be hallucinations, delusions, or disorganized speech): hallucinations, delusions, disorganized speech, grossly disorganized behavior, negative symptoms — with functional decline for ≥6 months.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is Capgras delusion and what causes it?", answer: "The delusion that a familiar person has been replaced by an identical impostor — caused by disconnection between facial recognition (intact) and the emotional familiarity response (absent, from amygdala disconnection from FFA); seen in schizophrenia and dementia.", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What is somatic symptom disorder and its DSM criteria?", answer: "One or more distressing physical symptoms + excessive thoughts, feelings, or behaviors related to symptoms (anxiety, disproportionate time/energy devoted) for ≥6 months — the focus is on the maladaptive psychological response, not symptom explanation.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is body dysmorphic disorder (BDD)?", answer: "Preoccupation with perceived defects in physical appearance (slight or imaginary) — extreme distress, repetitive behaviors (mirror checking, skin picking), and impaired functioning. High comorbidity with OCD (serotonergic treatment response) and suicidality.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is the allostatic model of addiction?", answer: "Koob and Le Moal: addiction involves shifting the hedonic setpoint — chronic drug use causes neuroadaptations that decrease baseline reward (opponent process, decreased dopamine function) and increase stress systems (CRH, dynorphin), driving compulsive use to restore normal functioning.", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What is the biological basis of panic attacks?", answer: "Panic attacks involve: noradrenergic hyperactivation (locus coeruleus firing), amygdala threat response, and hypersensitivity to CO2 (suffocation alarm system). Lactate infusion and CO2 inhalation provoke panic in susceptible individuals.", difficulty: "hard" },
    { topicId: T["Psychological Disorders"], question: "What distinguishes specific phobia from social anxiety disorder?", answer: "Specific phobia: fear of a specific object/situation (animals, heights, blood-injection-injury, situational). Social anxiety disorder: fear of scrutiny and humiliation in social/performance situations. Both involve anticipatory anxiety and avoidance.", difficulty: "easy" },
    { topicId: T["Psychological Disorders"], question: "What is the diathesis-stress model of psychopathology?", answer: "Mental disorders arise from the interaction of a diathesis (biological vulnerability/predisposition) and environmental stressors — neither alone is sufficient; explains why not everyone with genetic risk develops illness, and why stress triggers symptoms only in vulnerable individuals.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is selective mutism?", answer: "A childhood anxiety disorder (DSM-5) characterized by failure to speak in specific social situations (school) despite speaking normally in other settings (home) — for ≥1 month, causing functional impairment; not explained by communication disorder or autism.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is reactive attachment disorder (RAD)?", answer: "A trauma/neglect-related disorder in children — persistent emotional withdrawal (not seeking comfort), social-emotional disturbance, and negative affect; caused by insufficient caregiving. Distinguishable from autism by response to enriched caregiving.", difficulty: "medium" },
    { topicId: T["Psychological Disorders"], question: "What is the neurobiology of social anxiety disorder (SAD)?", answer: "SAD involves: amygdala hyperreactivity to social threat cues, reduced anterior cingulate cortex modulation, and altered 5-HT1A receptor function. Neuroimaging shows heightened amygdala response to faces in SAD — normalized by SSRIs and CBT.", difficulty: "hard" },

    // ===== EXPANDED BATCH — PERSONALITY DISORDERS (30 more) =====
    { topicId: T["Personality Disorders"], question: "What is the alternative DSM-5 model for personality disorders?", answer: "Section III of DSM-5 proposes a dimensional model based on Self functioning (identity + self-direction) and Interpersonal functioning (empathy + intimacy) — supplemented by five pathological personality trait domains (negative affectivity, detachment, antagonism, disinhibition, psychoticism).", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What are the DSM-5 diagnostic criteria for borderline personality disorder?", answer: "5 of 9 criteria: fear of abandonment, unstable relationships (idealization/devaluation), unstable identity, impulsivity in ≥2 areas, suicidal behavior/self-harm, affective instability, chronic emptiness, intense anger, paranoid ideation/dissociation under stress.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is narcissistic personality disorder (NPD)?", answer: "Grandiosity (real or fantasized), lack of empathy, need for admiration — 5+ of 9 criteria: grandiose sense of self, fantasies of success/power, specialness, requiring admiration, entitlement, exploitativeness, lack of empathy, envy, arrogance.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is histrionic personality disorder (HPD)?", answer: "Pervasive pattern of excessive emotionality and attention-seeking — theatrical, rapidly shifting emotions, uses physical appearance to draw attention, impressionistic speech, easily influenced, considers relationships closer than they are.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is the difference between paranoid PD and schizotypal PD?", answer: "Paranoid PD: pervasive mistrust and suspicion of others; NO magical thinking or perceptual distortions. Schizotypal PD: odd beliefs, magical thinking, perceptual illusions, eccentric behavior, and social anxiety — genetically linked to schizophrenia.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is avoidant personality disorder and how does it differ from social anxiety disorder?", answer: "AvPD: pervasive pattern of social inhibition, feelings of inadequacy, and hypersensitivity to rejection affecting multiple areas. SAD: fear of specific social/performance situations. AvPD is more pervasive, involving self-concept (identity); both respond to CBT and SSRIs.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is dependent personality disorder?", answer: "Excessive need to be taken care of, leading to submissive/clinging behavior and fear of separation — difficulty making decisions without reassurance, fear of being alone, going to great lengths to obtain support; associated with anxious attachment.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What are the four DBT skills modules?", answer: "Mindfulness (core): observe and participate non-judgmentally; Distress Tolerance: accept and survive crises (TIPP, ACCEPTS, IMPROVE); Emotion Regulation: understand and reduce vulnerability; Interpersonal Effectiveness: maintain relationships while meeting needs (DEAR MAN, GIVE, FAST).", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is transference-focused psychotherapy (TFP)?", answer: "A psychodynamic treatment for BPD developed by Kernberg — focuses on analyzing the transference relationship between patient and therapist to identify and work through split object representations and understand primitive defenses (splitting, projective identification).", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is schema therapy for personality disorders?", answer: "Developed by Young — targets early maladaptive schemas (core beliefs and feelings developed in childhood) through limited re-parenting, experiential techniques (imagery, chair work), and behavioral pattern-breaking. Effective for avoidant PD and BPD.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is projective identification?", answer: "A primitive defense: the person projects unwanted feelings into another person AND then identifies with that person — subtly pressuring them to behave in a way consistent with the projection. Classic in BPD and NPD; important to recognize in therapeutic relationships.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is idealization and devaluation in BPD?", answer: "Rapid oscillation between seeing someone as perfect/wonderful (idealization) and seeing them as completely bad/worthless (devaluation) — driven by splitting. Triggered by perceived failures of the idealized person; hallmark of BPD attachment instability.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is the heritability of personality disorders?", answer: "PDs are moderately heritable (~40-60%) — ASPD has the highest heritability; genetic factors contribute mainly through the underlying dimensional traits (e.g., neuroticism, impulsivity, antagonism) rather than the categorical disorder itself.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is childhood trauma's role in personality disorders?", answer: "Early-life trauma (abuse, neglect, attachment disruption) is a major risk factor for BPD — 70-80% of BPD patients report childhood trauma. Trauma disrupts emotional regulation, attachment security, and theory of mind development.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is schizoid personality disorder and how is it treated?", answer: "Schizoid PD: pervasive detachment from social relationships, restricted emotional expression, preference for solitude — no desire for social connection (vs. avoidant PD: wants connection but fears rejection). No evidence-based psychotherapy; supportive therapy occasionally.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is the prevalence and gender distribution of BPD?", answer: "BPD prevalence: ~1-2% general population, up to 20% psychiatric inpatients — previously believed to be predominantly female (3:1), but this reflects diagnostic bias; community studies show equal male:female prevalence, males more often diagnosed ASPD.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What are the 'big five' personality traits (OCEAN)?", answer: "Openness to experience, Conscientiousness, Extraversion, Agreeableness, Neuroticism — a widely validated dimensional model; personality disorders can be understood as maladaptive extremes of these normal trait dimensions (e.g., BPD = high neuroticism + low agreeableness).", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is narcissistic injury and narcissistic rage?", answer: "Narcissistic injury: a wound to the narcissist's inflated self-image (criticism, failure, perceived disrespect) — often followed by narcissistic rage (explosive, disproportionate anger, humiliation of the 'injurer') as a defense against the underlying shame.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is the antisocial/psychopathy distinction?", answer: "ASPD (DSM): a behavioral pattern of repeatedly violating others' rights — focuses on conduct; psychopathy (Hare PCL-R): adds affective/interpersonal features (shallow affect, lack of remorse, grandiosity, deceit) not required for ASPD. All psychopaths meet ASPD, not vice versa.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is the MCMI-IV (Millon Clinical Multiaxial Inventory)?", answer: "A self-report personality inventory based on Millon's biosocial learning theory — 195 items assessing all DSM personality disorder styles and clinical syndromes; widely used in forensic and clinical settings alongside the MMPI-3.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is emotional invalidation and its role in BPD?", answer: "Marsha Linehan's biosocial model: BPD results from biological emotional sensitivity + chronic invalidating environment (dismissing emotions as wrong/bad) → failure to learn emotion regulation skills → BPD. DBT provides the 'missing' skills.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What are dissociative symptoms in BPD?", answer: "BPD Criterion 9 — transient, stress-related dissociation or paranoid ideation: depersonalization (feeling detached from oneself) or derealization (world feels unreal) occurring under extreme stress; not persistent as in dissociative identity disorder.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is the Psychopathy Checklist-Revised (PCL-R)?", answer: "Hare's 20-item rating scale for psychopathy — based on semi-structured interview and file review; Factor 1: interpersonal/affective features (glibness, lack of empathy, callousness); Factor 2: antisocial lifestyle (impulsivity, irresponsibility). Score ≥30 = psychopathy.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is identity diffusion in personality disorders?", answer: "A lack of coherent, stable sense of self — seen in BPD (unstable self-image, goals, values, sexual identity) and in the Kernberg model as the fundamental deficit underlying borderline personality organization (splitting-based).", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What are the negative health outcomes associated with personality disorders?", answer: "Increased rates of suicide (BPD: 8-10% completed), substance use disorders, cardiovascular disease, reduced life expectancy (ASPD), impaired occupational and social functioning, and high healthcare utilization — significant public health burden.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is the role of dopamine in novelty-seeking traits?", answer: "High novelty-seeking (associated with ASPD, NPD, histrionic PD) correlates with D4 dopamine receptor polymorphisms and low baseline dopamine tone — the brain seeks stimulation to normalize dopamine. Low harm avoidance reflects this dopaminergic hyperactivity.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is an introject in psychodynamic theory?", answer: "An internal representation of a significant other (usually from childhood) that becomes part of the person's inner world — malignant introjects from abusive/neglectful caregivers drive self-destructive behavior and self-criticism in personality disorders.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What does 'ego-syntonic' mean in personality disorders?", answer: "The symptoms are experienced as consistent with and acceptable to the person's self-image — they don't feel distressed by the traits themselves (unlike OCD, which is ego-dystonic). This is why PD patients often don't seek help and resist treatment.", difficulty: "medium" },
    { topicId: T["Personality Disorders"], question: "What is the outcome of treatment for BPD?", answer: "BPD has better long-term prognosis than often assumed — longitudinal studies (MSAD, CLPS) show most patients no longer meet criteria by their 30s-40s; however, functional recovery (employment, relationships) lags behind symptom remission. DBT reduces parasuicidality.", difficulty: "hard" },
    { topicId: T["Personality Disorders"], question: "What is the paranoid PD's clinical picture?", answer: "Pervasive mistrust and suspicion beginning by early adulthood — suspects others of exploiting/harming them, is reluctant to confide, bears grudges, reads threatening meanings into benign remarks, suspects infidelity without evidence; distinguished from paranoid schizophrenia by absence of psychosis.", difficulty: "medium" },

    // ===== EXPANDED BATCH — ADHD & MEDICATIONS (30 more) =====
    { topicId: T["ADHD & Medications"], question: "What are the DSM-5 symptom domains for ADHD?", answer: "Two domains: Inattention (9 symptoms: fails to attend to details, difficulty sustaining attention, doesn't listen, doesn't follow through, difficulty organizing, avoids sustained mental effort, loses things, easily distracted, forgetful) and Hyperactivity/Impulsivity (9 symptoms).", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What are the DSM-5 diagnostic requirements for ADHD?", answer: "6+ symptoms (5+ for adults ≥17) in one or both domains for ≥6 months; symptoms before age 12; impairment in ≥2 settings; symptoms not better explained by another disorder. Three presentations: inattentive, hyperactive-impulsive, combined.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What brain regions show structural differences in ADHD?", answer: "Reduced volume and delayed maturation in the prefrontal cortex (especially right PFC), caudate nucleus, cerebellum, and corpus callosum — the PFC maturation delay averages 3 years in childhood ADHD; largely normalized in adults.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What is the neuropsychological profile of ADHD?", answer: "Deficits in response inhibition, working memory, sustained attention, planning/organization, processing speed, and reward sensitivity — performance is inconsistent (fluctuating, not uniformly impaired) and worsens with less engaging tasks.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is the mechanism of methylphenidate?", answer: "Blocks DAT and NET (dopamine and norepinephrine reuptake transporters) — increases synaptic DA and NE in the PFC, improving signal-to-noise ratio and strengthening PFC networks. D-MPH (dexmethylphenidate) is the more active enantiomer.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is the mechanism of amphetamine salts (Adderall) in ADHD?", answer: "Amphetamine salts block DAT/NET AND cause reverse transport (flooding the synapse with DA and NE by reversing transporter direction and displacing vesicular stores) — stronger dopamine release than methylphenidate; also effects on serotonin at higher doses.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What is atomoxetine (Strattera) and how does it work?", answer: "A selective norepinephrine reuptake inhibitor (SNRI, not stimulant) — blocks NET in the PFC, increasing NE and indirectly DA in PFC. FDA-approved for ADHD in adults and children; full benefit requires 4-6 weeks; no abuse potential.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is extended-release (XR) vs. immediate-release (IR) stimulant formulation?", answer: "IR stimulants last 4-6 hours, requiring multiple daily doses. XR formulations provide 8-12 hours of coverage from a single dose (using various delivery systems: OROS, osmotic, beaded) — better for classroom/workday coverage and less 'rebound' effect.", difficulty: "easy" },
    { topicId: T["ADHD & Medications"], question: "What is the differential diagnosis of ADHD in adults?", answer: "Must rule out: anxiety disorders (worry-driven distractibility), bipolar disorder (mood-driven impulsivity/racing thoughts), depression (cognitive slowing), sleep disorders, substance use, learning disabilities, and personality disorders — ADHD must be developmental, not acquired.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What is ADHD without hyperactivity (predominantly inattentive type)?", answer: "The inattentive presentation lacks hyperactivity/impulsivity — characterized by daydreaming, disorganization, forgetting, difficulty following conversations, and slow processing. Often missed, especially in girls; may overlap with sluggish cognitive tempo.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What are the common side effects of stimulant medications?", answer: "Appetite suppression (especially at lunch time), insomnia (difficulty falling asleep), increased heart rate/blood pressure, headaches, irritability (especially when wearing off — 'rebound'), and mild growth deceleration with long-term use in children.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is parent-child interaction therapy (PCIT) and its relevance to ADHD?", answer: "An evidence-based behavior therapy for young children with ADHD and oppositional behavior — trains parents in child-directed interaction (building relationship) and parent-directed interaction (consistent discipline). First-line for preschool ADHD before medication.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is neurofeedback in ADHD treatment?", answer: "Real-time EEG feedback training aimed at increasing beta waves (focus) and suppressing theta waves (inattention) — some evidence for efficacy in ADHD but less well-established than stimulants; classified as possibly efficacious by practice guidelines.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What are IEP and 504 plans and how do they relate to ADHD?", answer: "IEP (Individualized Education Program): under IDEA for students with disabilities affecting education; provides specialized instruction + accommodations. Section 504: civil rights law providing accommodations (extra time, preferential seating) without specialized instruction. ADHD qualifies for both.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is the CAARS (Conners' Adult ADHD Rating Scale)?", answer: "A widely used self-report and observer rating scale for adult ADHD — assesses inattention, hyperactivity, impulsivity, DSM-IV ADHD symptoms, and ADHD index; includes validity scales; standardized norms for adults.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What are the DSM-5 changes to ADHD criteria from DSM-IV?", answer: "Key changes: age of onset raised from 7 to 12 years; symptom threshold for adults lowered to 5 (from 6); autism spectrum disorder is no longer an exclusion; ADHD subtypes renamed 'presentations'; recognition of adult ADHD improved.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is the relationship between ADHD and substance use disorders?", answer: "ADHD significantly increases risk for SUD (~2x): impulsivity drives experimentation; self-medication of ADHD symptoms; neurobiological overlap (mesolimbic dopamine hypofunction). Treating ADHD with stimulants in childhood reduces (not increases) long-term SUD risk.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What is working memory and why is it central to ADHD?", answer: "Working memory = holding and manipulating information in mind temporarily — consistently impaired in ADHD (rating scales and tasks); Barkley considers it the core cognitive deficit mediating behavioral inhibition failures; poor WM predicts academic and occupational difficulties.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What are environmental risk factors for ADHD?", answer: "Prenatal alcohol and tobacco exposure, lead exposure, prematurity/low birth weight, maternal stress, and institutional deprivation — all increase ADHD risk; however, ADHD is predominantly genetic (~75% heritability, one of the most heritable psychiatric conditions).", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is the heritability of ADHD?", answer: "~75-80% heritable from twin studies — polygenic, with many common variants of small effect; rare copy number variants (CNVs) contribute; key genes include those regulating dopaminergic (DRD4, DAT1) and noradrenergic (NET1, SNAP25) systems.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What is emotional dysregulation in ADHD?", answer: "A significant but underrecognized ADHD feature — low frustration tolerance, irritability, poor emotional inhibition, and rejection sensitive dysphoria (RSD); Barkley includes emotional regulation in his EF model. Associated with worse impairment than core ADHD symptoms.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is the ADHD rating scale-5 (ADHD-RS-5)?", answer: "The standard symptom severity rating scale for ADHD — 18 items mapping directly onto DSM-5 criteria; available for parent (ages 5-17), teacher, and self-report (adults) versions; commonly used in clinical trials and routine assessment.", difficulty: "easy" },
    { topicId: T["ADHD & Medications"], question: "What is continuous performance (sustained attention) and how is it tested in ADHD?", answer: "Sustained attention = maintaining vigilance over time — tested with the CPT-3 (Conners' CPT): patient responds to a target letter and inhibits responses to non-targets for 14 minutes; ADHD individuals show increased omission errors (inattention) and commission errors (impulsivity).", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "How does ADHD affect academic performance?", answer: "ADHD significantly impairs reading (phonological decoding, fluency, comprehension), writing (compositional, handwriting), and math (working memory demands) — 40-60% of ADHD children have comorbid learning disabilities requiring separate intervention.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is the difference between ADHD and anxiety in terms of attention problems?", answer: "ADHD inattention: consistent across settings, triggered by boredom, related to executive dysfunction, present since childhood. Anxiety inattention: worry-driven, fluctuates with stress level, associated with hypervigilance to threat, may have later onset. Both can co-occur.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What is the FDA indication age range for stimulants?", answer: "Amphetamines (Adderall): approved age 3+. Methylphenidate: approved age 6+. Atomoxetine: approved age 6+. For preschool children (3-5), behavior therapy is recommended first; medication is only added if significant impairment persists.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is the SNAP-IV rating scale?", answer: "Swanson, Nolan, and Pelham scale — a commonly used 26-item ADHD symptom rating scale (18 DSM items + 8 ODD items) for teachers and parents; provides norms and can track medication response; one of the most widely used in pediatric settings.", difficulty: "easy" },
    { topicId: T["ADHD & Medications"], question: "What is rejection sensitive dysphoria (RSD)?", answer: "An extreme emotional sensitivity to perceived rejection or criticism — proposed by Dodson as a major but underrecognized ADHD feature; causes intense, brief, and overwhelming emotional pain; may look like borderline PD but is more episodic and context-specific.", difficulty: "hard" },
    { topicId: T["ADHD & Medications"], question: "What are the driving risks associated with ADHD?", answer: "ADHD significantly increases motor vehicle accident risk (1.5-2.5x) — due to inattention, impulsivity, and speeding; stimulant medication reduces accident risk; ADHD adults should be counseled about driving safety.", difficulty: "medium" },
    { topicId: T["ADHD & Medications"], question: "What is the relationship between ADHD and sleep disorders?", answer: "ADHD is highly comorbid with sleep disorders (50-70%): delayed sleep phase, difficulty falling asleep, restless sleep, night waking, and morning grogginess — may be related to dopaminergic dysregulation of circadian timing; stimulants can worsen sleep if taken late.", difficulty: "medium" },

    // ===== EXPANDED BATCH — LANGUAGE PROCESSING & APHASIA (30 more) =====
    { topicId: T["Language Processing & Aphasia"], question: "What is the Wernicke-Geschwind model of language?", answer: "A classical neurological model: Broca's area (inferior frontal gyrus) = speech production; Wernicke's area (posterior superior temporal) = comprehension; arcuate fasciculus = white matter connecting them. Damage produces distinct aphasia syndromes.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the arcuate fasciculus and what aphasia results from its damage?", answer: "The arcuate fasciculus is the major white matter tract connecting Wernicke's (temporal) with Broca's (frontal) areas — damage produces conduction aphasia: fluent speech, impaired repetition, but relatively intact comprehension; frequent phonemic paraphasias.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is global aphasia?", answer: "The most severe aphasia — all language modalities profoundly impaired: non-fluent speech, poor comprehension, failed repetition, anomia. Caused by large left hemisphere lesion affecting both Broca's and Wernicke's areas (usually MCA territory stroke).", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is transcortical motor aphasia (TCMA)?", answer: "Non-fluent speech, impaired initiation, intact comprehension, INTACT repetition (preserved arcuate fasciculus) — caused by lesions in the supplementary motor area (SMA) or anterior to Broca's area; the patient can repeat but not initiate spontaneous speech.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is transcortical sensory aphasia (TCSA)?", answer: "Fluent (often echolalic) speech, impaired comprehension, INTACT repetition — caused by lesions posterior/inferior to Wernicke's area; similar to Wernicke's but with preserved repetition. Associated with Alzheimer's disease and posterior watershed infarcts.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is anomic aphasia?", answer: "Fluent speech, intact comprehension, intact repetition — only deficit is prominent word-finding difficulty (anomia); the mildest and most common aphasia type. Can result from any left hemisphere damage or be the residual state after recovery from other aphasias.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What are the three types of primary progressive aphasia (PPA)?", answer: "1) Non-fluent/agrammatic (NFPA): effortful, agrammatic speech; left frontoparietal; associated with FTLD-TDP/MAPT. 2) Semantic (svPPA): fluent but semantic memory loss; bilateral anterior temporal; associated with TDP-43. 3) Logopenic (lv-PPA): slow, word-finding pauses; left temporoparietal; associated with Alzheimer's.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the dual-route model of reading?", answer: "Two reading pathways: Lexical (whole word) route: recognizes familiar words as visual patterns. Phonological (sounding out) route: converts letters to phonemes. Surface dyslexia: lexical route damaged (can't read irregular words). Phonological dyslexia: phonological route damaged (can't read novel words).", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is deep dyslexia?", answer: "Reading by meaning — patients make semantic errors (read 'dog' as 'cat'), cannot read non-words, have frequent visual errors; suggests reading relies entirely on semantic associations when both lexical and phonological routes are damaged.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is developmental dyslexia and its neural basis?", answer: "A specific learning disorder in reading — phonological processing deficit (difficulty manipulating speech sounds); neurologically: reduced planum temporale asymmetry, ectopias in perisylvian language cortex, reduced grey matter in left temporal-parietal regions.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is phonological awareness and its importance?", answer: "The ability to identify and manipulate the sound structure of language (syllables, onset-rime, phonemes) — the best predictor of early reading success; impaired in dyslexia; trained in effective reading interventions (e.g., Orton-Gillingham).", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the Boston Diagnostic Aphasia Examination (BDAE)?", answer: "A comprehensive aphasia battery developed by Goodglass and Kaplan — assesses fluency, comprehension, repetition, naming, reading, and writing; determines aphasia type (Broca's, Wernicke's, etc.) and severity; the gold standard for aphasia classification.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the Western Aphasia Battery-Revised (WAB-R)?", answer: "A standardized battery yielding the Aphasia Quotient (AQ) and Cortical Quotient — tests spontaneous speech, comprehension, repetition, naming, reading, writing, and praxis; more efficient than BDAE; widely used in clinical settings.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is constraint-induced language therapy (CILT)?", answer: "An aphasia rehabilitation approach based on the principles of constraint-induced movement therapy — patients are 'forced' to use verbal communication (constraint from gestural communication) in massed, intensive practice; evidence shows improved language output.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is aprosodia?", answer: "Impaired production (motor aprosodia) or comprehension (sensory aprosodia) of emotional prosody — caused by right hemisphere damage; patients may speak in a monotone (motor) or fail to understand emotional tone in others' speech (sensory).", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is echolalia and what conditions cause it?", answer: "Involuntary repetition of the words just spoken by another person — occurs in transcortical aphasias (especially mixed transcortical/isolation aphasia), autism spectrum disorder, frontotemporal dementia, and as a developmental phase in normal language acquisition.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is palilalia?", answer: "Involuntary, compulsive repetition of the patient's own words or phrases (usually with increasing speed and decreasing volume) — associated with basal ganglia disorders (Tourette's, Parkinson's disease, post-encephalitic parkinsonism), frontal lobe lesions.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the role of the supplementary motor area (SMA) in language?", answer: "The SMA (medial premotor cortex) initiates voluntary speech — damage causes akinetic mutism (no speech) or reduced verbal initiation with echolalia; plays a role in timing and sequential motor programming of speech; activates bilaterally during speech.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is bilingualism's effect on the brain?", answer: "Managing two languages uses shared neural networks (left perisylvian) — bilinguals show smaller L2 regions of activation with greater proficiency; bilingualism may contribute to cognitive reserve, delaying dementia onset by ~5 years (controversial); separation of languages facilitated by the ACC.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What are paraphasias and what types are there?", answer: "Errors in word selection during aphasia — Phonemic (literal) paraphasia: substitution/addition of sounds (e.g., 'par' for 'car'); Semantic (verbal) paraphasia: substitution of related word (e.g., 'dog' for 'cat'); Neologistic: non-word productions (e.g., 'flug').", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the planum temporale and its significance?", answer: "A region in the superior temporal plane (posterior to Heschl's gyri) — typically larger on the left, corresponding to Wernicke's area; one of the most reliably asymmetric brain regions; reduced or reversed asymmetry in dyslexia.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the difference between aphasia, dysarthria, and apraxia of speech?", answer: "Aphasia: language system impairment (formulation, comprehension); Dysarthria: motor execution disorder (weakness, coordination) — speech sounds distorted but language intact; Apraxia of speech: motor programming disorder — inconsistent speech errors, improved with slow rate and repetition.", difficulty: "medium" },
    { topicId: T["Language Processing & Aphasia"], question: "What is agraphia and its types?", answer: "Acquired writing disorder — Phonological agraphia: cannot write non-words (phonological route damaged); Lexical (surface) agraphia: phonological writing is intact but cannot spell irregular words correctly; Deep agraphia: semantic errors in writing.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the angular gyrus and its role in language?", answer: "The angular gyrus (inferior parietal, BA 39) is critical for cross-modal association (connecting visual word form with auditory and semantic information) — lesions cause alexia, agraphia, Gerstmann's syndrome; important in both reading and higher-level language.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the supramarginal gyrus and its role?", answer: "Located in the inferior parietal lobule (BA 40) — involved in phonological processing and the phonological loop of working memory; damage contributes to conduction aphasia, and is part of the dorsal language stream connecting temporal to frontal regions.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is Sign language and its neural representation?", answer: "Sign languages (e.g., ASL) are fully structured languages processed by the same left-hemisphere perisylvian regions as spoken language — deaf signers with left hemisphere lesions get sign aphasia (not right hemisphere, demonstrating language representation is modality-independent).", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is right hemisphere communication disorder?", answer: "Impairment in figurative language, humor, inference, pragmatics, narrative comprehension, and emotional prosody comprehension following right hemisphere damage — despite intact basic language (grammar, lexicon, literal meaning). Often overlooked clinically.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is semantic dementia and its language profile?", answer: "Semantic variant PPA — fluent speech with empty content, severe anomia, impaired single-word comprehension, and surface dyslexia; caused by bilateral (especially left) anterior temporal lobe atrophy; conceptual/semantic knowledge is lost systematically.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the functional MRI (fMRI) contribution to language understanding?", answer: "fMRI has revealed the distributed language network beyond the classical Wernicke-Geschwind model — including bilateral temporal regions, inferior frontal sulcus, premotor cortex, angular gyrus, and temporal-parietal junction; important for pre-surgical language mapping.", difficulty: "hard" },
    { topicId: T["Language Processing & Aphasia"], question: "What is the Intracarotid Sodium Amobarbital (WADA) test?", answer: "Sodium amobarbital is injected into one carotid artery, temporarily anesthetizing that hemisphere — used before epilepsy surgery to determine language lateralization and assess memory function, to predict post-surgical deficits.", difficulty: "hard" },

    // ===== EXPANDED BATCH — APRAXIA & AGNOSIA (30 more) =====
    { topicId: T["Apraxia & Agnosia"], question: "What is ideomotor apraxia?", answer: "The inability to perform learned movements to command or imitation despite knowing what to do and having intact motor/sensory systems — errors are spatiotemporal (wrong posture, orientation, trajectory); caused by left parietal or premotor lesions; tested by asking patient to gesture (e.g., 'show me how to wave').", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is ideational apraxia?", answer: "Impaired sequencing of complex multi-step tool use actions (conceptual errors) — cannot organize the steps of an action (e.g., makes coffee in wrong order); associated with left parietal/temporal or diffuse bilateral damage; tested by asking patient to perform real tool use sequences.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is limb-kinetic apraxia?", answer: "Loss of fine, precise limb movements — movements are crude, clumsy, and incoordinate despite intact strength; caused by contralateral premotor cortex or M1 lesion; often difficult to distinguish from mild pyramidal weakness or corticobasal syndrome feature.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is oral apraxia (buccofacial apraxia)?", answer: "Inability to perform voluntary oral/facial movements to command (e.g., 'show your teeth', 'blow out a candle') despite intact reflexive movements and oral motor strength — caused by left frontal/premotor lesions; often co-occurs with Broca's aphasia.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is dressing apraxia?", answer: "Inability to dress correctly despite intact motor skills — caused by right parietal lesions affecting spatial processing; associated with spatial neglect and visuospatial deficits rather than true praxis deficits; technically a visuospatial-motor disorder.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is callosal apraxia?", answer: "Left-hand apraxia in response to verbal commands from a right-handed patient with corpus callosum damage — the right hemisphere cannot receive language commands (cross-callosal disconnection from left language areas) but left hand can still imitate.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is Bálint's syndrome and its three components?", answer: "A bilateral parieto-occipital syndrome: 1) Simultanagnosia (cannot process more than one object at a time); 2) Optic ataxia (misreaching for visually presented objects); 3) Oculomotor apraxia (inability to voluntarily direct gaze to peripheral targets).", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is simultanagnosia?", answer: "Inability to perceive more than one object at a time despite intact low-level vision — patients can identify individual objects but cannot perceive the whole scene (trees but not the forest); caused by bilateral parieto-occipital lesions (part of Bálint's syndrome).", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is optic ataxia?", answer: "Misreaching for visually guided targets despite intact vision and motor strength — caused by bilateral posterior parietal lesions (dorsal visual stream damage); an inability to translate visual spatial information into accurate motor commands.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is apperceptive visual agnosia?", answer: "Failure to recognize objects due to impaired perceptual analysis — cannot match or copy objects; cannot recognize them from different viewpoints; caused by bilateral occipital lesions (e.g., CO poisoning, bilateral PCA strokes); distinguished from associative agnosia by inability to copy.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is associative visual agnosia?", answer: "Perceptual analysis is intact (can copy and match objects) but cannot attach meaning/identity to them — the 'percept' is not connected to stored knowledge; caused by disconnection between occipital visual processing and temporal semantic memory areas.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is prosopagnosia?", answer: "Inability to recognize familiar faces — can perceive and describe faces but cannot identify them, relying on voice, gait, or context; caused by bilateral fusiform gyrus/right temporal-occipital damage; some developmental (congenital) cases lack clear lesions.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is the fusiform face area (FFA)?", answer: "A region in the fusiform gyrus (inferior temporal cortex, right hemisphere dominant) specialized for face processing — activated by faces more than objects; damage causes prosopagnosia; controversy exists about whether it is exclusively face-specific or expert-level object recognition.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is category-specific agnosia?", answer: "Agnosia for one category of objects while others are preserved — e.g., some patients lose knowledge of living things (animals, plants) but not artifacts (tools), and vice versa; reflects distributed semantic organization with biological vs. functional knowledge networks.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is hemispatial neglect and which hemisphere lesion causes it most severely?", answer: "Neglect of stimuli in the contralesional hemispace — RIGHT hemisphere damage causes more severe and persistent neglect (left neglect) than left hemisphere; due to right hemisphere dominance for spatial attention (bilateral), while left hemisphere only attends right space.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is anosognosia?", answer: "Unawareness or denial of one's own neurological deficit — e.g., a patient with hemiplegia who denies being paralyzed; associated with right parietal lesions and often accompanies hemispatial neglect; reflects higher-order metacognitive and self-monitoring failures.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is Anton's syndrome?", answer: "Cortical blindness with anosognosia — patients are blind from bilateral occipital lesions but deny being blind, confabulating visual experiences. The brain generates plausible 'visual' perceptions without real visual input, and self-monitoring fails to detect the error.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is Capgras delusion related to agnosia?", answer: "The delusion that a familiar person is an impostor — explained by intact face perception (FFA) with disrupted connection to the emotional/autonomic response (amygdala disconnection) — seeing the face but feeling no emotional familiarity, leading to the 'impostor' interpretation.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is the Cotard delusion?", answer: "The nihilistic delusion that one is dead, does not exist, or has lost internal organs — associated with severe depression with psychotic features, right hemisphere damage, or depersonalization; may result from disrupted body representation and emotional processing.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is allesthesia?", answer: "A phenomenon where tactile or visual stimuli perceived on one side are experienced as coming from the opposite side — associated with parietal lobe lesions and may be seen alongside neglect; represents a mislocalization of sensory signals.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is visual object agnosia distinguished from visual spatial agnosia?", answer: "Object agnosia: cannot identify objects despite seeing them (ventral stream deficit — temporal/occipital). Spatial agnosia: cannot localize or navigate space despite recognizing objects (dorsal stream deficit — parietal). Double dissociation between 'what' and 'where' pathways.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is the praxis representational system (Rothi et al.)?", answer: "A model of praxis: left hemisphere stores 'action production systems' — a praxis lexicon (stored tool-use programs) and a praxis semantic system. Ideomotor apraxia results from damage to these stores or their connections to frontal motor output systems.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is the alien hand sign?", answer: "One hand performs involuntary, goal-directed actions conflicting with the patient's intentions — seen in corpus callosum lesions (callosal alien hand) and corticobasal syndrome (frontal alien hand); reflects one hemisphere's autonomous motor programming.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is hemisomatognosia?", answer: "Failure to acknowledge one side of the body as belonging to oneself — the patient may claim the affected limb is not theirs or belongs to someone else (somatoparaphrenia); associated with right parietal lesions and hemispatial neglect.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is color agnosia vs. color anomia?", answer: "Color agnosia: inability to match or sort colors correctly (perceptual failure). Color anomia: cannot name colors despite correct matching (disconnection between visual processing and language). Color anomia is a disconnection syndrome from corpus callosum or left occipital lesion.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is pure word blindness and how does it relate to agnosia?", answer: "Pure word blindness (pure alexia) is a form of visual agnosia specific to written words — words are not recognized despite intact visual perception of objects and intact writing ability. A selective disconnection of the visual word form area from language areas.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is the lesion for constructional apraxia and why is it worse with right vs. left lesions?", answer: "Can occur with either hemisphere — RIGHT parietal lesions: severe visuospatial errors (fragmented, disorganized drawings). LEFT parietal lesions: simplified drawings, lose internal details but maintain overall configuration. Right hemisphere dominant for spatial organization.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is tactile agnosia distinguished from astereognosia?", answer: "Tactile agnosia: intact sensation but cannot identify objects by touch (higher-order recognition failure — similar to visual agnosia in touch modality). Astereognosia is a broader term often used interchangeably with tactile agnosia — inability to recognize objects by touch.", difficulty: "medium" },
    { topicId: T["Apraxia & Agnosia"], question: "What is the split-brain syndrome?", answer: "After corpus callosum section (commissurotomy for epilepsy): right hand cannot act on information presented to the right hemisphere; left visual field (RH) objects cannot be named but can be matched by touch with the left hand; RH and LH operate independently.", difficulty: "hard" },
    { topicId: T["Apraxia & Agnosia"], question: "What is multimodal agnosia?", answer: "Failure to recognize objects across multiple sensory modalities (visual, tactile, auditory) — implies damage to stored semantic/conceptual knowledge itself rather than a sensory modality-specific recognition pathway; seen in semantic dementia.", difficulty: "hard" },

    // ===== EXPANDED BATCH — NEUROCOGNITIVE DISORDERS (30 more) =====
    { topicId: T["Neurocognitive Disorders"], question: "What is the amyloid cascade hypothesis of Alzheimer's disease?", answer: "Amyloid-β (Aβ42) aggregation is the initiating event — Aβ forms oligomers (toxic) and plaques → triggers tau hyperphosphorylation → neurofibrillary tangles → neuroinflammation → synaptic loss → neurodegeneration. Validated by genetics (APOE4, APP, PSEN1/2 mutations).", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is APOE4 and its risk for Alzheimer's?", answer: "The ε4 allele of apolipoprotein E is the largest genetic risk factor for sporadic AD — one copy increases risk ~3x; two copies ~8-12x; APOE4 impairs Aβ clearance. APOE2 is protective. APOE4 also affects age of onset.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What are the biomarkers used in diagnosing Alzheimer's disease?", answer: "A/T/N framework: Amyloid pathology (Aβ PET, CSF Aβ42↓), Tau pathology (tau PET, CSF p-tau↑), Neurodegeneration (FDG-PET, MRI atrophy, CSF total-tau↑). These allow preclinical AD diagnosis before cognitive symptoms.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What are the familial (early-onset) Alzheimer's disease genes?", answer: "Autosomal dominant mutations causing early-onset AD (<65): APP (amyloid precursor protein) mutations → excess Aβ42 production; PSEN1 (most common FAD gene, presenilin-1) and PSEN2 (presenilin-2) mutations → impaired γ-secretase → excess Aβ42.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the Clinical Dementia Rating (CDR)?", answer: "A structured interview rating dementia severity across 6 domains (memory, orientation, judgment, community affairs, home/hobbies, personal care) — rated 0 (normal), 0.5 (MCI/questionable), 1 (mild), 2 (moderate), 3 (severe). CDR Sum of Boxes provides more granular staging.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the Global Deterioration Scale (GDS)?", answer: "Reisberg's 7-stage scale for dementia severity — Stage 1 (normal) through Stage 7 (severe AD — no speech, incontinent, bedridden); used in research and clinical settings; stages 2-3 correspond to MCI/prodromal AD.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the typical pattern of memory loss in Alzheimer's disease?", answer: "Episodic memory (recently experienced events) is most impaired first — particularly delayed recall (forgetting what was just told); semantic and remote memories are more preserved early; procedural memory is often preserved until late stages.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the '1-year rule' in DLB diagnosis?", answer: "To diagnose dementia with Lewy bodies, the dementia must either precede parkinsonism OR develop within 1 year of parkinsonism onset — if parkinsonism precedes dementia by >1 year, the diagnosis is Parkinson's disease dementia (PDD), though the pathologies overlap.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the Neuropsychiatric Inventory (NPI)?", answer: "A structured caregiver interview assessing 12 behavioral/psychological symptoms of dementia: delusions, hallucinations, agitation, depression, anxiety, euphoria, apathy, disinhibition, irritability, aberrant motor behavior, sleep, and appetite disturbances — with frequency × severity scores.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the Glasgow Coma Scale (GCS)?", answer: "Measures consciousness after TBI: Eye opening (1-4) + Verbal response (1-5) + Motor response (1-6) = 3-15; GCS ≤8 = severe TBI; 9-12 = moderate; 13-15 = mild. Used acutely in the ED to guide management and prognosis.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is post-concussion syndrome (PCS)?", answer: "Persistent symptoms after mild TBI — headache, fatigue, dizziness, cognitive difficulties, sleep disturbance, emotional lability, and depression lasting weeks to months. Biopsychosocial model: biological injury + psychological factors + social context.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is second impact syndrome?", answer: "A second concussion before the first has resolved — can cause massive cerebral edema and is potentially fatal; thought to involve impaired cerebrovascular autoregulation; occurs disproportionately in young athletes (adolescents).", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What are Lewy bodies and in which diseases do they appear?", answer: "Intraneuronal inclusions containing aggregated alpha-synuclein — found in: Parkinson's disease (substantia nigra), Parkinson's disease dementia (PDD), Dementia with Lewy bodies (DLB), and Incidental Lewy body disease (asymptomatic). Alpha-synuclein aggregation is the pathological hallmark.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the neuropsychological profile of Parkinson's disease?", answer: "Primarily frontal-subcortical: executive dysfunction (planning, set-shifting, working memory), processing speed slowing, visuospatial difficulties — relative sparing of naming and verbal memory encoding (compared to AD). Dementia occurs in ~80% after 20 years.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is progressive supranuclear palsy (PSP)?", answer: "A frontotemporal tauopathy — key features: vertical gaze palsy (cannot look down voluntarily), pseudobulbar palsy, postural instability with backward falls, axial rigidity, frontal-subcortical dementia. Tau accumulates in neurons and glia (4R tauopathy).", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is corticobasal syndrome (CBS)?", answer: "Presents with asymmetric rigidity, limb apraxia, alien hand sign, cortical sensory loss, myoclonus, and cognitive decline — often caused by corticobasal degeneration (CBD, 4R tauopathy) but CBS can also be caused by AD, PSP, or FTD pathologies.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is multiple system atrophy (MSA)?", answer: "A synucleinopathy with parkinsonism + autonomic failure + cerebellar ataxia — MSA-P (Shy-Drager variant): parkinsonism-predominant; MSA-C: cerebellar-predominant. Autonomic failure (orthostatic hypotension, urinary incontinence) is a defining feature. Poor prognosis.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the difference between Parkinson's disease dementia (PDD) and DLB?", answer: "Both are Lewy body diseases — PDD: parkinsonism well-established (>1 year) before dementia onset; DLB: dementia develops within 1 year of parkinsonism OR before. Clinically managed similarly (avoid antipsychotics); the distinction is mainly for research purposes.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the MMSE (Mini-Mental State Examination)?", answer: "A 30-point cognitive screening tool assessing orientation (10), registration/recall (6), attention/calculation (5), language (8), and construction (1) — widely used but not sensitive for MCI; ≤23-24 suggests dementia. Replaced in research by the MoCA.", difficulty: "easy" },
    { topicId: T["Neurocognitive Disorders"], question: "What is semantic variant PPA and what brain region is affected?", answer: "Semantic dementia/svPPA: bilateral anterior temporal lobe atrophy (left > right) — causes loss of conceptual knowledge, severe anomia, impaired single-word comprehension, surface dyslexia/dysgraphia; episodic memory and visuospatial skills relatively preserved.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the neuropsychological profile of Huntington's disease?", answer: "Subcortical dementia: executive dysfunction, processing speed slowing, procedural memory and motor learning impairment, depression, irritability, impulsivity — verbal and visuospatial skills relatively preserved; the cognitive decline mirrors the motor decline progression.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What are the clinical features of Wilson's disease?", answer: "An autosomal recessive copper metabolism disorder (ATP7B mutation) — copper accumulates in liver, brain, and eyes (Kayser-Fleischer rings); neuropsychiatric: tremor, dysarthria, psychiatric symptoms (personality change, psychosis), cognitive decline. Treatable with copper chelation.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is normal pressure hydrocephalus (NPH) mechanism and treatment?", answer: "Excess CSF in ventricles without elevated opening pressure — CSF circulation impairment; ventricular enlargement compresses periventricular white matter (especially corticospinal tracts → magnetic gait). Treatment: CSF shunting (ventriculoperitoneal shunt) reverses gait and incontinence; cognition improves less.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What are the HAND (HIV-Associated Neurocognitive Disorder) treatments?", answer: "Combination antiretroviral therapy (cART) is the primary treatment — suppressing viral load improves neurocognitive function; neurological complications from opportunistic infections (cryptococcal meningitis, PML) require additional targeted treatment. HAND prevalence reduced but not eliminated by cART.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What are the four Appelbaum capacity criteria?", answer: "1) Communicating a Choice (express a decision); 2) Understanding (grasp the information disclosed); 3) Appreciation (apply it to one's own situation); 4) Reasoning (weigh risks/benefits, consequences). All four must be assessed; capacity is decision-specific.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the epidemiology of Alzheimer's disease?", answer: "~6.7 million Americans have AD (2023) — prevalence doubles every 5 years after 65 (5% at 65-74, 13% at 75-84, 33% at 85+); risk factors: age (#1), APOE4, female sex, cardiovascular risk factors, lower education, family history. The most common dementia worldwide.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the Dementia Rating Scale-2 (DRS-2)?", answer: "A comprehensive standardized cognitive assessment battery for dementia — 36 tasks across 5 subscales: Attention, Initiation/Perseveration, Construction, Conceptualization, and Memory; total score 144 points; validated for Parkinson's, Alzheimer's, and related conditions.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is pseudodementia?", answer: "Cognitive impairment that mimics dementia but is caused by a reversible psychiatric condition — most commonly severe depression; features: subjective memory complaints, poor effort on testing, can answer 'I don't know', responds to antidepressant treatment. Also called depression-related cognitive dysfunction.", difficulty: "medium" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the role of tau in neurodegeneration?", answer: "Tau is a microtubule-associated protein stabilizing axonal structure — hyperphosphorylation causes tau to detach from microtubules, misfold, and form neurofibrillary tangles (NFTs). NFTs are toxic and spread in a stereotyped pattern (Braak staging) in Alzheimer's disease.", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is Pick's disease and Pick bodies?", answer: "A specific pathology causing behavioral variant FTD — rounded, silver-staining intraneuronal inclusions containing 3R tau (Pick bodies) in the frontal and temporal cortex; distinct from AD (mixed 3R + 4R tau) and PSP/CBD (4R tau).", difficulty: "hard" },
    { topicId: T["Neurocognitive Disorders"], question: "What is the 'islands of memory' phenomenon in dementia?", answer: "Some patients with advanced dementia retain patches of well-preserved memory (often remote autobiographical memories or highly over-learned skills) amid otherwise severe cognitive decline — reflects relative preservation of posterior cortical regions and emotional memory networks.", difficulty: "hard" },
  ];

  await db.insert(flashcardsTable).values(flashcards);

  // ===========================================================================
  // QUIZ QUESTIONS (10 per topic = 150 total)
  // ===========================================================================
  const rawQuizQuestions = [
    // ===== 1. NEUROPSYCHOLOGY OVERVIEW =====
    { topicId: T["Neuropsychology Overview"], question: "Which lobe of the brain is primarily responsible for executive functioning?", options: JSON.stringify(["Frontal lobe","Parietal lobe","Temporal lobe","Occipital lobe"]), correctAnswer: "A", explanation: "The frontal lobe houses the prefrontal cortex, which is responsible for executive functions including planning, working memory, inhibition, and decision-making." },
    { topicId: T["Neuropsychology Overview"], question: "A lesion to the right hemisphere would cause motor impairment on which side?", options: JSON.stringify(["Right side","Left side","Both sides","Neither side"]), correctAnswer: "B", explanation: "Most motor and sensory pathways are contralateral — the right hemisphere controls the left side of the body." },
    { topicId: T["Neuropsychology Overview"], question: "What is the primary purpose of 'hold' tests in neuropsychological assessment?", options: JSON.stringify(["To assess current impairment","To estimate premorbid intellectual functioning","To measure attention","To evaluate motor speed"]), correctAnswer: "B", explanation: "Hold tests (e.g., vocabulary, fund of knowledge) are resistant to brain damage and are used to estimate an individual's premorbid intellectual functioning." },
    { topicId: T["Neuropsychology Overview"], question: "Which of the following best defines a double dissociation?", options: JSON.stringify(["Two tasks that both rely on the same brain area","Patient A impaired on X not Y, Patient B impaired on Y not X","Both tasks are impaired by the same lesion","Two patients with identical symptoms"]), correctAnswer: "B", explanation: "A double dissociation demonstrates that two cognitive functions are independent: one lesion impairs function X but not Y, while a different lesion impairs Y but not X." },
    { topicId: T["Neuropsychology Overview"], question: "What does the parietal lobe primarily process?", options: JSON.stringify(["Language production","Visual object recognition","Somatosensory and spatial information","Auditory processing"]), correctAnswer: "C", explanation: "The parietal lobe processes somatosensory information (touch, proprioception) and spatial processing. The left parietal is also involved in language." },
    { topicId: T["Neuropsychology Overview"], question: "Ecological validity in neuropsychological assessment refers to:", options: JSON.stringify(["Statistical significance of test norms","How well test performance predicts real-world functioning","The ability of tests to detect lesion size","How long a test battery takes"]), correctAnswer: "B", explanation: "Ecological validity is the degree to which performance on neuropsychological tests predicts real-world, daily life functional abilities." },
    { topicId: T["Neuropsychology Overview"], question: "The concept of cognitive reserve suggests that:", options: JSON.stringify(["All individuals decline at the same rate","Education and mental activity buffer against cognitive decline","Brain damage always produces immediate symptoms","Memory is the first function to decline"]), correctAnswer: "B", explanation: "Cognitive reserve — built through education, intellectual activity, and social engagement — allows some individuals to tolerate greater brain pathology before showing cognitive symptoms." },
    { topicId: T["Neuropsychology Overview"], question: "Diaschisis refers to:", options: JSON.stringify(["Permanent damage at a lesion site","Loss of function in brain regions distant from the injury","Compensatory reorganization of brain function","Structural atrophy of the cortex"]), correctAnswer: "B", explanation: "Diaschisis is the transient loss of function in brain regions remote from an injury site due to disrupted connections, even though those regions are structurally intact." },
    { topicId: T["Neuropsychology Overview"], question: "What is the difference between statistically significant and clinically significant findings?", options: JSON.stringify(["They mean the same thing","Statistically significant means unlikely by chance; clinically significant means meaningful for functioning","Clinical significance requires larger samples","Statistical significance requires larger effect sizes"]), correctAnswer: "B", explanation: "A statistically significant result is unlikely due to chance; a clinically significant result is meaningful and has real impact on the patient's functioning — the two do not always co-occur." },
    { topicId: T["Neuropsychology Overview"], question: "Which brain structure is primarily responsible for forming new declarative memories?", options: JSON.stringify(["Amygdala","Cerebellum","Hippocampus","Basal ganglia"]), correctAnswer: "C", explanation: "The hippocampus is critical for forming new explicit (declarative) memories — both episodic and semantic. Bilateral hippocampal damage causes severe anterograde amnesia." },

    // ===== 2. CELL BIOLOGY & NEURON ANATOMY =====
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the resting membrane potential of a typical neuron?", options: JSON.stringify(["-70 mV","+40 mV","-55 mV","0 mV"]), correctAnswer: "A", explanation: "The resting membrane potential is approximately -70 mV, maintained by the Na+/K+ ATPase pump and differential ion permeability." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "Where does the action potential initiate?", options: JSON.stringify(["Dendrites","Cell body (soma)","Axon hillock","Node of Ranvier"]), correctAnswer: "C", explanation: "The axon hillock has the highest density of voltage-gated Na+ channels and is where the action potential is initiated when threshold is reached." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What causes rapid depolarization during an action potential?", options: JSON.stringify(["K+ influx","Na+ influx","Cl- influx","Ca2+ efflux"]), correctAnswer: "B", explanation: "Rapid influx of Na+ through voltage-gated sodium channels drives the membrane potential from -70 mV toward +40 mV during depolarization." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "What is the function of oligodendrocytes?", options: JSON.stringify(["Provide immune defense","Produce myelin in the CNS","Produce myelin in the PNS","Regulate synaptic transmission"]), correctAnswer: "B", explanation: "Oligodendrocytes produce the myelin sheath in the central nervous system — one oligodendrocyte can myelinate multiple axons. Schwann cells perform this function in the PNS." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "Saltatory conduction refers to:", options: JSON.stringify(["Action potentials conducted at a constant speed","Action potentials jumping between nodes of Ranvier","Transmission across unmyelinated axons","Inhibitory postsynaptic potentials"]), correctAnswer: "B", explanation: "Saltatory conduction is the action potential 'jumping' between nodes of Ranvier in myelinated axons, greatly increasing conduction velocity." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "An EPSP is:", options: JSON.stringify(["A hyperpolarization that inhibits firing","A depolarization that moves membrane potential toward threshold","Complete membrane depolarization","An action potential in the postsynaptic cell"]), correctAnswer: "B", explanation: "An EPSP (Excitatory PostSynaptic Potential) is a graded depolarization that moves the membrane potential toward threshold, increasing the likelihood of an action potential." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "The all-or-none law states that:", options: JSON.stringify(["Larger stimuli produce larger action potentials","Action potential amplitude is graded by stimulus strength","Neurons either fire fully or not at all","Neurons always respond to every stimulus"]), correctAnswer: "C", explanation: "According to the all-or-none law, a neuron fires a full-sized action potential or none at all — amplitude is constant and doesn't vary with stimulus strength." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "Temporal summation occurs when:", options: JSON.stringify(["Multiple synapses fire simultaneously","One synapse fires repeatedly in rapid succession","Two neurons form a new connection","The action potential travels very fast"]), correctAnswer: "B", explanation: "Temporal summation occurs when a single synapse fires rapidly, allowing successive EPSPs to add together before the previous one decays." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "Astrocytes primarily function to:", options: JSON.stringify(["Produce myelin in the PNS","Act as the brain's immune cells","Support neurons and maintain blood-brain barrier","Transmit action potentials"]), correctAnswer: "C", explanation: "Astrocytes are the most numerous glial cells — they provide metabolic support, maintain the blood-brain barrier, regulate extracellular ions, and play a role in synaptogenesis." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "During the absolute refractory period, a neuron:", options: JSON.stringify(["Requires a stronger stimulus to fire","Cannot fire regardless of stimulus strength","Has elevated membrane potential","Is hyperpolarized above resting potential"]), correctAnswer: "B", explanation: "During the absolute refractory period, voltage-gated Na+ channels are inactivated and the neuron cannot fire another action potential regardless of stimulus strength." },

    // ===== 3. NEUROTRANSMITTERS & SYNAPTIC TRANSMISSION =====
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Which neurotransmitter is the primary excitatory neurotransmitter in the brain?", options: JSON.stringify(["GABA","Dopamine","Glutamate","Serotonin"]), correctAnswer: "C", explanation: "Glutamate is the primary excitatory neurotransmitter — it acts on AMPA, NMDA, and kainate receptors and is involved in nearly 90% of fast excitatory transmission." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "SSRIs treat depression by:", options: JSON.stringify(["Blocking dopamine receptors","Increasing serotonin synthesis","Blocking serotonin reuptake","Activating GABA receptors"]), correctAnswer: "C", explanation: "SSRIs (selective serotonin reuptake inhibitors) block the serotonin transporter (SERT), preventing reuptake and increasing serotonin availability in the synaptic cleft." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Metabotropic receptors differ from ionotropic receptors in that they:", options: JSON.stringify(["Directly gate ion channels","Use G-proteins and second messengers for slower, longer effects","Only respond to glutamate","Are found only at inhibitory synapses"]), correctAnswer: "B", explanation: "Metabotropic receptors are G-protein coupled receptors that produce slower, longer-lasting effects through intracellular second messenger cascades, unlike ionotropic receptors that directly open ion channels." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "The mesolimbic dopamine pathway is primarily associated with:", options: JSON.stringify(["Motor control","Reward and motivation","Sleep regulation","Pain modulation"]), correctAnswer: "B", explanation: "The mesolimbic pathway (VTA → nucleus accumbens) is the brain's reward circuit — it signals reward prediction and drives motivational behavior." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "The NMDA receptor requires which two conditions to open?", options: JSON.stringify(["High calcium and GABA binding","Glutamate binding AND membrane depolarization","Mg2+ and dopamine","Acetylcholine and glycine"]), correctAnswer: "B", explanation: "The NMDA receptor is a coincidence detector — it requires both glutamate binding AND membrane depolarization (to expel the Mg2+ block), making it critical for LTP and memory." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Loss of cholinergic neurons in the basal forebrain is most closely linked to:", options: JSON.stringify(["Parkinson's disease","Alzheimer's disease","Huntington's disease","Schizophrenia"]), correctAnswer: "B", explanation: "Alzheimer's disease is characterized by loss of cholinergic neurons in the nucleus basalis of Meynert (basal forebrain), contributing to memory and cognitive deficits." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "An autoreceptor is:", options: JSON.stringify(["A postsynaptic receptor for all neurotransmitters","A presynaptic receptor that detects the neuron's own neurotransmitter","A receptor that enhances excitatory transmission","A receptor for hormones only"]), correctAnswer: "B", explanation: "Autoreceptors are presynaptic receptors that detect the neuron's own released neurotransmitter and typically provide negative feedback to inhibit further release." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Norepinephrine from the locus coeruleus is primarily involved in:", options: JSON.stringify(["Memory consolidation","Appetite regulation","Arousal, attention, and fight-or-flight","Visual processing"]), correctAnswer: "C", explanation: "Norepinephrine from the locus coeruleus regulates arousal, attention, and the fight-or-flight response — it is implicated in depression, anxiety, and PTSD." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Long-term potentiation (LTP) is considered the cellular basis of:", options: JSON.stringify(["Motor learning only","Emotional responses","Learning and memory","Habituation only"]), correctAnswer: "C", explanation: "LTP is a persistent strengthening of synaptic connections following high-frequency stimulation — it is the leading cellular mechanism for learning and memory, dependent on NMDA receptor activation." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Which neurotransmitter acts at the neuromuscular junction?", options: JSON.stringify(["Dopamine","Glutamate","Acetylcholine","Serotonin"]), correctAnswer: "C", explanation: "Acetylcholine (ACh) is the neurotransmitter at the neuromuscular junction — it binds to nicotinic receptors on muscle cells to trigger contraction." },

    // ===== 4. SENSORY PATHWAYS =====
    { topicId: T["Sensory Pathways"], question: "The dorsal column-medial lemniscal pathway carries:", options: JSON.stringify(["Pain and temperature","Fine touch, vibration, and proprioception","Auditory signals","Visual signals"]), correctAnswer: "B", explanation: "The dorsal column-medial lemniscal pathway carries fine touch, vibration, and proprioception — it travels ipsilaterally in the spinal cord and crosses at the medulla." },
    { topicId: T["Sensory Pathways"], question: "Where does the spinothalamic tract cross?", options: JSON.stringify(["In the medulla","In the thalamus","Immediately in the spinal cord","In the cortex"]), correctAnswer: "C", explanation: "The spinothalamic tract (pain and temperature) crosses immediately at the level it enters the spinal cord — this is why a lesion causes contralateral loss of pain and temperature below the level of injury." },
    { topicId: T["Sensory Pathways"], question: "A patient with a right hemisphere stroke would be expected to have motor weakness:", options: JSON.stringify(["On the right side","On the left side","On both sides","On neither side"]), correctAnswer: "B", explanation: "The corticospinal tract crosses in the medulla — a right hemisphere lesion causes left-sided motor weakness (contralateral deficit)." },
    { topicId: T["Sensory Pathways"], question: "Upper motor neuron lesions characteristically produce:", options: JSON.stringify(["Flaccidity and muscle wasting","Spasticity and hyperreflexia","Loss of pain and temperature","Loss of proprioception"]), correctAnswer: "B", explanation: "Upper motor neuron (UMN) lesions (above the anterior horn) cause spasticity, hyperreflexia, and Babinski sign — unlike lower motor neuron lesions which cause flaccidity." },
    { topicId: T["Sensory Pathways"], question: "Which structure acts as the main sensory relay station?", options: JSON.stringify(["Hypothalamus","Thalamus","Basal ganglia","Cerebellum"]), correctAnswer: "B", explanation: "The thalamus is the main relay station for nearly all sensory information (except smell) on the way to the cortex — it organizes and filters sensory input." },
    { topicId: T["Sensory Pathways"], question: "The lateral geniculate nucleus of the thalamus relays which sensory information?", options: JSON.stringify(["Auditory","Somatosensory","Visual","Olfactory"]), correctAnswer: "C", explanation: "The lateral geniculate nucleus (LGN) of the thalamus is the relay for visual information from the retina to the primary visual cortex (V1)." },
    { topicId: T["Sensory Pathways"], question: "Brown-Séquard syndrome results from:", options: JSON.stringify(["Complete spinal cord transection","Hemisection of the spinal cord","Dorsal column damage only","Brainstem infarction"]), correctAnswer: "B", explanation: "Brown-Séquard syndrome (hemisection) causes ipsilateral loss of fine touch and proprioception (dorsal column, crosses higher) and contralateral loss of pain/temperature (spinothalamic, crosses immediately) below the lesion." },
    { topicId: T["Sensory Pathways"], question: "What is a dermatome?", options: JSON.stringify(["A region of the brain","A strip of skin innervated by a single spinal nerve root","A type of neuron","A brain imaging technique"]), correctAnswer: "B", explanation: "A dermatome is an area of skin innervated by a single spinal nerve root — dermatome maps are used clinically to localize spinal cord and nerve root injuries." },
    { topicId: T["Sensory Pathways"], question: "The basal ganglia are primarily involved in:", options: JSON.stringify(["Sensory relay","Voluntary movement initiation and habit learning","Reflex control","Visual processing"]), correctAnswer: "B", explanation: "The basal ganglia (striatum, globus pallidus, subthalamic nucleus, substantia nigra) are involved in initiating voluntary movement, habit learning, and motor sequence control." },
    { topicId: T["Sensory Pathways"], question: "Cerebellar damage most commonly causes:", options: JSON.stringify(["Weakness and paralysis","Sensory loss","Ataxia and incoordination","Memory loss"]), correctAnswer: "C", explanation: "Cerebellar damage causes ataxia (coordination problems), dysmetria (past-pointing), and intention tremor — the cerebellum fine-tunes movement and compares intended vs. actual movement." },

    // ===== 5. SENSORY SYSTEMS =====
    { topicId: T["Sensory Systems"], question: "The retina sends visual signals to the lateral geniculate nucleus via:", options: JSON.stringify(["The optic radiation","The optic tract","The visual cortex","The superior colliculus"]), correctAnswer: "B", explanation: "Visual signals travel: retina → optic nerve → optic chiasm → optic tract → lateral geniculate nucleus (LGN) of the thalamus → primary visual cortex." },
    { topicId: T["Sensory Systems"], question: "The ventral visual stream is primarily involved in:", options: JSON.stringify(["Localizing where objects are","Identifying what objects are","Processing movement","Controlling eye movements"]), correctAnswer: "B", explanation: "The ventral stream (occipitotemporal 'what' pathway) processes object identity, color, and face recognition — the dorsal stream (occipitoparietal 'where/how' pathway) processes location and action guidance." },
    { topicId: T["Sensory Systems"], question: "Which part of the basilar membrane responds to high frequencies?", options: JSON.stringify(["Apex","Base","Middle","Equally throughout"]), correctAnswer: "B", explanation: "Tonotopic organization: high-frequency sounds are processed at the base of the basilar membrane; low-frequency sounds at the apex — discovered by Georg von Békésy." },
    { topicId: T["Sensory Systems"], question: "Olfaction is unique among the senses because:", options: JSON.stringify(["It has no cortical representation","It does not relay through the thalamus","It is processed in the parietal lobe","It only uses one receptor type"]), correctAnswer: "B", explanation: "Olfaction is the only sense that bypasses the thalamus — olfactory signals go directly from the olfactory bulb to the piriform cortex and limbic structures." },
    { topicId: T["Sensory Systems"], question: "The primary somatosensory cortex is located in:", options: JSON.stringify(["Precentral gyrus","Postcentral gyrus","Superior temporal gyrus","Calcarine fissure"]), correctAnswer: "B", explanation: "S1 (primary somatosensory cortex) is in the postcentral gyrus of the parietal lobe — it processes touch, pain, temperature, and proprioception in a somatotopic map." },
    { topicId: T["Sensory Systems"], question: "The semicircular canals detect:", options: JSON.stringify(["Linear acceleration","Rotational head movements","Sound frequency","Pain"]), correctAnswer: "B", explanation: "The three semicircular canals in the inner ear detect rotational (angular) acceleration of the head — the otolith organs (utricle and saccule) detect linear acceleration and gravity." },
    { topicId: T["Sensory Systems"], question: "Homonymous hemianopia is caused by damage to:", options: JSON.stringify(["The retina","The optic chiasm","The optic tract or visual cortex unilaterally","The primary somatosensory cortex"]), correctAnswer: "C", explanation: "Homonymous hemianopia (loss of vision in the same half of both visual fields) results from damage to the optic tract or visual cortex on one side — e.g., right cortex damage → left visual field loss." },
    { topicId: T["Sensory Systems"], question: "The superior colliculus is primarily responsible for:", options: JSON.stringify(["Color vision","Depth perception","Reflexive orienting toward visual stimuli","Sound localization"]), correctAnswer: "C", explanation: "The superior colliculus in the midbrain controls reflexive eye movements and visual orienting responses toward sudden stimuli — it is important for directing attention." },
    { topicId: T["Sensory Systems"], question: "Pain gate theory was proposed by:", options: JSON.stringify(["Broca and Wernicke","Ramón y Cajal","Melzack and Wall","Penfield and Milner"]), correctAnswer: "C", explanation: "Ronald Melzack and Patrick Wall proposed gate control theory of pain — non-painful sensory stimuli (large fiber input) can 'close the gate' in the dorsal horn, inhibiting pain signal transmission." },
    { topicId: T["Sensory Systems"], question: "Which area of the cortex processes primary auditory information?", options: JSON.stringify(["Primary visual cortex","Postcentral gyrus","Heschl's gyri (superior temporal gyrus)","Prefrontal cortex"]), correctAnswer: "C", explanation: "The primary auditory cortex is located in Heschl's gyri (Brodmann areas 41/42) in the superior temporal gyrus — it receives input from the medial geniculate nucleus of the thalamus." },

    // ===== 6. LIMBIC SYSTEM & MOTIVATION =====
    { topicId: T["Limbic System & Motivation"], question: "The amygdala is primarily associated with:", options: JSON.stringify(["Language comprehension","Emotional processing, especially fear","Visual recognition","Motor planning"]), correctAnswer: "B", explanation: "The amygdala processes emotional significance, particularly fear and threat — it drives fear conditioning and modulates memory for emotionally significant events." },
    { topicId: T["Limbic System & Motivation"], question: "Bilateral lesions to the hippocampus cause:", options: JSON.stringify(["Loss of all long-term memories","Severe anterograde amnesia (inability to form new declarative memories)","Blindness","Personality changes"]), correctAnswer: "B", explanation: "Bilateral hippocampal damage causes severe anterograde amnesia — the inability to form new explicit memories. Patient H.M. is the classic case; he retained intact procedural learning." },
    { topicId: T["Limbic System & Motivation"], question: "The lateral hypothalamus is known as the 'hunger center' because:", options: JSON.stringify(["Lesions cause obesity","Lesions cause aphagia (failure to eat) and starvation","It releases cortisol","It controls insulin secretion"]), correctAnswer: "B", explanation: "The lateral hypothalamus stimulates feeding — lesions result in aphagia (failure to eat) and eventual starvation. The ventromedial hypothalamus is the satiety center." },
    { topicId: T["Limbic System & Motivation"], question: "The mesolimbic dopamine pathway runs from:", options: JSON.stringify(["Locus coeruleus to frontal cortex","VTA to nucleus accumbens","Substantia nigra to striatum","Raphe nuclei to hippocampus"]), correctAnswer: "B", explanation: "The mesolimbic pathway runs from the ventral tegmental area (VTA) to the nucleus accumbens — it is the brain's primary reward circuit, essential for motivation and reinforcement." },
    { topicId: T["Limbic System & Motivation"], question: "Klüver-Bucy syndrome results from bilateral damage to:", options: JSON.stringify(["Hippocampus","Frontal lobes","Amygdala and temporal lobes","Cerebellum"]), correctAnswer: "C", explanation: "Klüver-Bucy syndrome — caused by bilateral amygdala and temporal lobe lesions — produces hyperorality, hypersexuality, visual agnosia, emotional placidity, and memory impairment." },
    { topicId: T["Limbic System & Motivation"], question: "The Papez circuit's primary function is:", options: JSON.stringify(["Processing visual information","Regulating sleep","Emotional memory processing","Motor coordination"]), correctAnswer: "C", explanation: "The Papez circuit (hippocampus → fornix → mammillary bodies → thalamus → cingulate cortex) is involved in emotional memory processing — proposed by James Papez in 1937." },
    { topicId: T["Limbic System & Motivation"], question: "Narcolepsy is caused by loss of which neurons?", options: JSON.stringify(["Dopamine neurons in the VTA","Serotonin neurons in the raphe","Orexin/hypocretin neurons in the lateral hypothalamus","Norepinephrine neurons in the locus coeruleus"]), correctAnswer: "C", explanation: "Narcolepsy results from the loss of orexin (hypocretin) neurons in the lateral hypothalamus — these neurons promote wakefulness, and their loss causes excessive daytime sleepiness and cataplexy." },
    { topicId: T["Limbic System & Motivation"], question: "The hypothalamus is sometimes described with the 'Four Fs' — which are they?", options: JSON.stringify(["Feeling, forming, firing, fixing","Fighting, fleeing, feeding, fornicating","Frontal, limbic, temporal, parietal","Focus, filter, file, forget"]), correctAnswer: "B", explanation: "The four Fs represent the basic survival drives regulated by the hypothalamus: fighting, fleeing, feeding, and fornicating (reproduction)." },
    { topicId: T["Limbic System & Motivation"], question: "The anterior cingulate cortex is involved in:", options: JSON.stringify(["Primary visual processing","Error monitoring and emotional-cognitive integration","Auditory processing","Olfactory processing"]), correctAnswer: "B", explanation: "The anterior cingulate cortex integrates emotional and cognitive processing — it plays a role in error monitoring, decision-making, pain perception, and conflict detection." },
    { topicId: T["Limbic System & Motivation"], question: "Intrinsic motivation differs from extrinsic motivation in that:", options: JSON.stringify(["It is driven by external rewards","It comes from internal enjoyment and interest","It is always stronger than extrinsic","It doesn't involve dopamine"]), correctAnswer: "B", explanation: "Intrinsic motivation comes from internal interest and enjoyment; extrinsic motivation comes from external rewards. Dopamine is involved in both but particularly drives reward anticipation and approach behavior." },

    // ===== 7. SLEEP & CIRCADIAN RHYTHMS =====
    { topicId: T["Sleep & Circadian Rhythms"], question: "Which structure is the master circadian clock?", options: JSON.stringify(["Pineal gland","Suprachiasmatic nucleus","Amygdala","Reticular activating system"]), correctAnswer: "B", explanation: "The suprachiasmatic nucleus (SCN) in the hypothalamus is the brain's master circadian clock — it receives light input from the retina and regulates 24-hour biological rhythms." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "REM sleep is characterized by:", options: JSON.stringify(["Delta waves and deep sleep","Vivid dreaming, muscle atonia, and brain activity similar to wakefulness","Slow oscillations and memory consolidation","Stage N2 sleep spindles"]), correctAnswer: "B", explanation: "REM sleep features rapid eye movements, vivid dreaming, brain activity resembling wakefulness (desynchronized EEG), and muscle atonia (paralysis preventing acting out dreams)." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "Adenosine's role in sleep regulation is to:", options: JSON.stringify(["Block melatonin receptors","Promote wakefulness","Build up during wakefulness, increasing sleep pressure","Activate the SCN"]), correctAnswer: "C", explanation: "Adenosine accumulates in the brain during wakefulness — it acts as a 'sleep debt' molecule, increasing sleep pressure. Caffeine promotes wakefulness by blocking adenosine receptors." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "N3 (slow-wave) sleep is characterized by:", options: JSON.stringify(["REM atonia and dreaming","Alpha waves","Delta waves and is the most physically restorative","Sleep spindles and K-complexes"]), correctAnswer: "C", explanation: "N3 (slow-wave) sleep is characterized by delta waves (0.5-4 Hz) — it is the deepest NREM stage and is most associated with physical restoration and growth hormone release." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "REM sleep behavior disorder is strongly associated with:", options: JSON.stringify(["Insomnia","Narcolepsy","Parkinson's disease and dementia with Lewy bodies","Major depressive disorder"]), correctAnswer: "C", explanation: "REM sleep behavior disorder (loss of muscle atonia, acting out dreams) is strongly associated with synucleinopathies — Parkinson's disease, DLB, and MSA — often preceding motor symptoms by years." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "Which sleep disorder is caused by orexin neuron loss?", options: JSON.stringify(["Insomnia","Sleep apnea","Narcolepsy","REM sleep behavior disorder"]), correctAnswer: "C", explanation: "Narcolepsy is caused by loss of orexin (hypocretin) neurons in the lateral hypothalamus — features include excessive daytime sleepiness, cataplexy, sleep paralysis, and hypnagogic hallucinations." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "The pineal gland's role in sleep is to:", options: JSON.stringify(["Generate the circadian clock","Release melatonin in darkness to signal nighttime","Regulate adenosine","Control REM sleep"]), correctAnswer: "B", explanation: "The pineal gland releases melatonin in response to darkness — melatonin signals that it is nighttime, promoting sleep onset and synchronizing the circadian rhythm." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "Sleep spindles occur during which stage?", options: JSON.stringify(["N1","N2","N3","REM"]), correctAnswer: "B", explanation: "Sleep spindles (12-14 Hz bursts) occur during N2 sleep — they are generated by thalamocortical circuits and are associated with memory consolidation, especially procedural memory." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "Advanced sleep phase syndrome in older adults means:", options: JSON.stringify(["They need more sleep than younger adults","They fall asleep later and wake up later","They become sleepier earlier and wake up earlier","They have more REM sleep"]), correctAnswer: "C", explanation: "Advanced sleep phase syndrome (common in older adults) involves earlier circadian timing — they become sleepy earlier in the evening and wake earlier in the morning." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "The two-process model of sleep proposes sleep is regulated by:", options: JSON.stringify(["Adenosine and cortisol","Homeostatic sleep pressure (Process S) and the circadian clock (Process C)","REM and NREM balance","Melatonin and serotonin"]), correctAnswer: "B", explanation: "The two-process model: Process S (homeostatic sleep pressure driven by adenosine) and Process C (circadian clock from the SCN) — both must align for optimal sleep quality." },

    // ===== 8. ENDOCRINE SYSTEM & REPRODUCTION =====
    { topicId: T["Endocrine System & Reproduction"], question: "The HPA axis stress response sequence is:", options: JSON.stringify(["ACTH → CRH → Cortisol","CRH → ACTH → Cortisol","Cortisol → CRH → ACTH","ADH → Cortisol → ACTH"]), correctAnswer: "B", explanation: "The HPA axis: hypothalamus releases CRH → anterior pituitary releases ACTH → adrenal cortex releases cortisol — cortisol then feeds back to inhibit the hypothalamus and pituitary." },
    { topicId: T["Endocrine System & Reproduction"], question: "Oxytocin is released from the:", options: JSON.stringify(["Adrenal cortex","Anterior pituitary","Posterior pituitary","Pineal gland"]), correctAnswer: "C", explanation: "Oxytocin is synthesized in the hypothalamus and released from the posterior pituitary (neurohypophysis) — it promotes social bonding, maternal behavior, and uterine contractions." },
    { topicId: T["Endocrine System & Reproduction"], question: "Chronic elevated cortisol most significantly damages which brain region?", options: JSON.stringify(["Amygdala","Hippocampus","Cerebellum","Occipital cortex"]), correctAnswer: "B", explanation: "Chronic high cortisol damages the hippocampus — reducing volume, impairing neurogenesis, and affecting memory consolidation. HPA axis dysregulation is linked to depression and PTSD." },
    { topicId: T["Endocrine System & Reproduction"], question: "Organizational effects of hormones differ from activational effects in that they:", options: JSON.stringify(["Are temporary and reversible","Occur only in adulthood","Occur prenatally and permanently shape neural circuits","Affect only reproductive behaviors"]), correctAnswer: "C", explanation: "Organizational effects occur during critical prenatal development periods and permanently shape neural circuits; activational effects occur in adulthood and are temporary and reversible." },
    { topicId: T["Endocrine System & Reproduction"], question: "Antipsychotic drugs elevate prolactin levels because they:", options: JSON.stringify(["Block serotonin receptors","Block dopamine receptors, which normally inhibit prolactin release","Stimulate the posterior pituitary","Activate estrogen receptors"]), correctAnswer: "B", explanation: "Dopamine normally inhibits prolactin release from the anterior pituitary. Antipsychotics block D2 receptors, reducing this inhibition and elevating prolactin levels (hyperprolactinemia)." },
    { topicId: T["Endocrine System & Reproduction"], question: "The gonadotropin-releasing hormone (GnRH) is released from:", options: JSON.stringify(["Anterior pituitary","Gonads","Hypothalamus","Adrenal cortex"]), correctAnswer: "C", explanation: "GnRH is released from the hypothalamus — it stimulates the anterior pituitary to release LH and FSH, which in turn stimulate the gonads to produce sex hormones." },
    { topicId: T["Endocrine System & Reproduction"], question: "Thyroid hormone is essential during development because:", options: JSON.stringify(["It regulates cortisol","Deficiency during development causes intellectual disability (cretinism)","It stimulates growth hormone release","It is required for sleep"]), correctAnswer: "B", explanation: "Thyroid hormone is critical for brain development — hypothyroidism during fetal or early postnatal development causes cretinism, characterized by intellectual disability and growth failure." },
    { topicId: T["Endocrine System & Reproduction"], question: "ADH (antidiuretic hormone) primarily functions to:", options: JSON.stringify(["Stimulate cortisol release","Regulate water reabsorption in kidneys","Promote lactation","Stimulate male sex development"]), correctAnswer: "B", explanation: "ADH (vasopressin) is released from the posterior pituitary and acts on kidneys to increase water reabsorption, maintaining fluid balance and blood pressure." },
    { topicId: T["Endocrine System & Reproduction"], question: "Growth hormone (GH) is primarily released:", options: JSON.stringify(["Continuously throughout the day","During exercise only","In pulses during deep (N3) sleep","After eating"]), correctAnswer: "C", explanation: "Growth hormone is secreted in pulses during N3 (slow-wave) sleep — this is one of the reasons deep sleep is especially important for physical restoration and growth in children." },
    { topicId: T["Endocrine System & Reproduction"], question: "The adrenal medulla secretes which neurotransmitters?", options: JSON.stringify(["Cortisol and aldosterone","Epinephrine and norepinephrine","Oxytocin and ADH","FSH and LH"]), correctAnswer: "B", explanation: "The adrenal medulla secretes epinephrine (adrenaline) and norepinephrine into the bloodstream during sympathetic nervous system activation — preparing the body for fight-or-flight." },

    // ===== 9. PSYCHOPHARMACOLOGY =====
    { topicId: T["Psychopharmacology"], question: "How do benzodiazepines produce their anxiolytic effects?", options: JSON.stringify(["Blocking D2 receptors","Blocking NMDA receptors","Enhancing GABA-A receptor function","Inhibiting serotonin reuptake"]), correctAnswer: "C", explanation: "Benzodiazepines are positive allosteric modulators of GABA-A receptors — they increase the frequency of Cl- channel opening when GABA is present, enhancing inhibitory neurotransmission." },
    { topicId: T["Psychopharmacology"], question: "Tardive dyskinesia is caused by:", options: JSON.stringify(["Short-term benzodiazepine use","Long-term antipsychotic use causing dopamine receptor supersensitivity","SSRI overdose","Stimulant abuse"]), correctAnswer: "B", explanation: "Tardive dyskinesia results from chronic D2 receptor blockade by antipsychotics — the receptors become supersensitive, leading to involuntary repetitive movements, especially facial and oral." },
    { topicId: T["Psychopharmacology"], question: "Levodopa is used in Parkinson's disease because:", options: JSON.stringify(["It blocks acetylcholine receptors","It can cross the blood-brain barrier and be converted to dopamine","It is a direct dopamine agonist","It prevents alpha-synuclein accumulation"]), correctAnswer: "B", explanation: "Dopamine cannot cross the blood-brain barrier, but its precursor levodopa can — once in the brain, it is converted to dopamine by DOPA decarboxylase, replenishing depleted dopamine." },
    { topicId: T["Psychopharmacology"], question: "The blood-brain barrier (BBB) is formed by:", options: JSON.stringify(["Tight junctions between astrocytes","Tight junctions between brain endothelial cells","Myelin sheaths around blood vessels","The meninges"]), correctAnswer: "B", explanation: "The BBB is formed by tight junctions between the endothelial cells lining brain capillaries — drugs must be lipid-soluble or use active transport to cross it." },
    { topicId: T["Psychopharmacology"], question: "MAOIs work by:", options: JSON.stringify(["Blocking dopamine receptors","Inhibiting the enzyme that breaks down monoamines","Blocking serotonin reuptake","Activating GABA receptors"]), correctAnswer: "B", explanation: "MAOIs (monoamine oxidase inhibitors) block the enzyme MAO that degrades monoamines (serotonin, norepinephrine, dopamine) — increasing their availability. Dietary tyramine restrictions are necessary." },
    { topicId: T["Psychopharmacology"], question: "Drug tolerance is defined as:", options: JSON.stringify(["Increased response with repeated use","Reduced response with repeated use, requiring higher doses","Adverse reactions to a drug","Physical dependence"]), correctAnswer: "B", explanation: "Drug tolerance is a reduced response to a drug after repeated exposure — requiring higher doses to achieve the same effect, due to receptor downregulation or increased drug metabolism." },
    { topicId: T["Psychopharmacology"], question: "Atypical antipsychotics differ from typical antipsychotics in that they:", options: JSON.stringify(["Only block D2 receptors","Block both D2 and serotonin receptors, with fewer extrapyramidal side effects","Are not FDA-approved","Have no effect on negative symptoms"]), correctAnswer: "B", explanation: "Atypical (second-generation) antipsychotics block both D2 and 5-HT2A receptors — they have fewer extrapyramidal side effects and are more effective for negative symptoms than typical antipsychotics." },
    { topicId: T["Psychopharmacology"], question: "Opioids produce analgesia by acting on:", options: JSON.stringify(["Dopamine receptors","GABA-A receptors","Mu, delta, and kappa opioid receptors","NMDA receptors"]), correctAnswer: "C", explanation: "Opioids bind to mu, delta, and kappa opioid receptors in the brain and spinal cord — reducing pain perception, producing euphoria, and suppressing respiration at high doses." },
    { topicId: T["Psychopharmacology"], question: "What is the mechanism of amphetamine in ADHD treatment?", options: JSON.stringify(["Blocks reuptake of dopamine and norepinephrine only","Both blocks reuptake and reverses transporters, actively pumping out DA and NE","Only blocks norepinephrine reuptake","Acts on GABA receptors"]), correctAnswer: "B", explanation: "Amphetamine both blocks reuptake transporters AND reverses them, actively pumping dopamine and norepinephrine out of the presynaptic neuron — stronger and longer-acting than methylphenidate." },
    { topicId: T["Psychopharmacology"], question: "Lithium is used primarily for:", options: JSON.stringify(["Schizophrenia","Bipolar disorder mood stabilization","ADHD","Anxiety disorders"]), correctAnswer: "B", explanation: "Lithium is a mood stabilizer used in bipolar disorder — it modulates second messenger systems (inositol phosphate, GSK-3β) and has neuroprotective effects. Requires blood level monitoring due to narrow therapeutic window." },

    // ===== 10. PSYCHOLOGICAL DISORDERS =====
    { topicId: T["Psychological Disorders"], question: "Positive symptoms of schizophrenia include:", options: JSON.stringify(["Flat affect and avolition","Hallucinations and delusions","Memory loss and aphasia","Depression and anxiety"]), correctAnswer: "B", explanation: "Positive symptoms are additions to normal experience: hallucinations, delusions, disorganized speech and behavior — they respond better to antipsychotic medication than negative symptoms." },
    { topicId: T["Psychological Disorders"], question: "The glutamate hypothesis of schizophrenia proposes that:", options: JSON.stringify(["Excess glutamate causes psychosis","NMDA receptor hypofunction leads to dopamine dysregulation","Glutamate is the primary treatment target","AMPA receptors are overactive"]), correctAnswer: "B", explanation: "NMDA receptor hypofunction (especially on inhibitory interneurons) disinhibits dopamine release and glutamate — supported by NMDA antagonists (ketamine, PCP) producing schizophrenia-like symptoms." },
    { topicId: T["Psychological Disorders"], question: "Bipolar I disorder requires:", options: JSON.stringify(["Only depressive episodes","At least one full manic episode","Only hypomanic episodes","Both manic and psychotic episodes"]), correctAnswer: "B", explanation: "Bipolar I requires at least one full manic episode — depressive episodes are common but not required for diagnosis. Bipolar II requires hypomania plus at least one major depressive episode." },
    { topicId: T["Psychological Disorders"], question: "The monoamine hypothesis of depression proposes:", options: JSON.stringify(["Excess dopamine causes depression","Deficiency of serotonin, norepinephrine, and/or dopamine underlies depression","Depression is caused by GABA excess","Cortisol deficiency causes depression"]), correctAnswer: "B", explanation: "The monoamine hypothesis proposes that depression results from deficiency of serotonin, norepinephrine, and/or dopamine — the basis for antidepressant medications including SSRIs and SNRIs." },
    { topicId: T["Psychological Disorders"], question: "Structural brain abnormalities in schizophrenia include:", options: JSON.stringify(["Enlarged hippocampus","Enlarged ventricles and reduced prefrontal gray matter","Cerebellar atrophy","Thickened corpus callosum"]), correctAnswer: "B", explanation: "Schizophrenia is associated with enlarged lateral ventricles, reduced prefrontal cortex gray matter (hypofrontality), and reduced hippocampal volume — findings that are present even at first episode." },
    { topicId: T["Psychological Disorders"], question: "Learned helplessness (Seligman) is a model of:", options: JSON.stringify(["Anxiety","Schizophrenia","Depression","PTSD only"]), correctAnswer: "C", explanation: "Seligman's learned helplessness model proposes that depression results from repeated uncontrollable aversive situations — the organism stops trying to escape and becomes passive and helpless." },
    { topicId: T["Psychological Disorders"], question: "PTSD involves which brain abnormalities?", options: JSON.stringify(["Underactive amygdala and overactive prefrontal cortex","Hyperactive amygdala, reduced prefrontal inhibition, and hippocampal volume loss","Enlarged hippocampus and reduced amygdala","Cerebellar atrophy"]), correctAnswer: "B", explanation: "PTSD features hyperactive amygdala (exaggerated fear), insufficient prefrontal inhibition of the amygdala, and hippocampal volume loss affecting contextual memory processing." },
    { topicId: T["Psychological Disorders"], question: "Anosognosia in psychiatric disorders refers to:", options: JSON.stringify(["Denial of illness as a psychological defense","Neurological unawareness of one's own mental illness","Exaggerating symptoms","Faking illness"]), correctAnswer: "B", explanation: "Anosognosia is neurological unawareness of one's own illness — common in schizophrenia and mania. It is caused by right hemisphere dysfunction, not psychological denial, and significantly affects treatment compliance." },
    { topicId: T["Psychological Disorders"], question: "Dissociation is best defined as:", options: JSON.stringify(["A mood disorder","Disruption in the normal integration of consciousness, memory, or identity","Excessive emotional expression","A psychotic symptom"]), correctAnswer: "B", explanation: "Dissociation is a disruption in the normal integration of consciousness, memory, identity, or perception — ranging from mild (daydreaming) to severe (DID — dissociative identity disorder)." },
    { topicId: T["Psychological Disorders"], question: "Beck's cognitive triad in depression consists of negative views of:", options: JSON.stringify(["Past, present, and future","Self, world, and future","Self, others, and sleep","Mood, thought, and behavior"]), correctAnswer: "B", explanation: "Aaron Beck's cognitive triad describes the three negative thinking patterns in depression: negative views of the self, the world, and the future — the basis of cognitive behavioral therapy for depression." },

    // ===== 11. PERSONALITY DISORDERS =====
    { topicId: T["Personality Disorders"], question: "Borderline personality disorder is classified in which cluster?", options: JSON.stringify(["Cluster A (odd/eccentric)","Cluster B (dramatic/emotional)","Cluster C (anxious/fearful)","Cluster D"]), correctAnswer: "B", explanation: "BPD is a Cluster B (dramatic, emotional, erratic) disorder — others in Cluster B include antisocial, histrionic, and narcissistic PDs." },
    { topicId: T["Personality Disorders"], question: "Antisocial personality disorder (ASPD) requires:", options: JSON.stringify(["The presence of psychosis","A history of conduct disorder before age 15","Only adult criminal behavior","Narcissistic traits"]), correctAnswer: "B", explanation: "ASPD requires a history of conduct disorder before age 15 — it is then diagnosed in adults (18+) with a persistent pattern of disregard for others, deceit, impulsivity, and lack of remorse." },
    { topicId: T["Personality Disorders"], question: "Dialectical behavior therapy (DBT) was developed specifically for:", options: JSON.stringify(["Antisocial personality disorder","Narcissistic personality disorder","Borderline personality disorder","Schizotypal personality disorder"]), correctAnswer: "C", explanation: "DBT was developed by Marsha Linehan specifically for BPD — it combines cognitive-behavioral techniques with mindfulness, balancing acceptance and change strategies to address emotional dysregulation." },
    { topicId: T["Personality Disorders"], question: "Schizotypal personality disorder is categorized as Cluster A and is:", options: JSON.stringify(["Genetically unrelated to schizophrenia","On a spectrum with schizophrenia but without full psychotic episodes","Characterized by dramatic emotional behavior","The same as schizophrenia"]), correctAnswer: "B", explanation: "Schizotypal PD (Cluster A) is genetically related to schizophrenia — it features odd beliefs, magical thinking, social isolation, and perceptual distortions but does not include full psychotic breaks." },
    { topicId: T["Personality Disorders"], question: "What brain abnormality is most consistently associated with BPD?", options: JSON.stringify(["Reduced hippocampal volume","Hyperactive amygdala and reduced prefrontal inhibition","Enlarged ventricles","Cerebellar atrophy"]), correctAnswer: "B", explanation: "BPD features amygdala hyperreactivity to emotional stimuli and insufficient prefrontal cortex inhibition of the amygdala — contributing to emotional dysregulation and impulsivity." },
    { topicId: T["Personality Disorders"], question: "OCPD differs from OCD in that OCPD is:", options: JSON.stringify(["More treatable with SSRIs","Ego-syntonic (the person is okay with it) and involves perfectionism and rigidity as a personality style","Only diagnosed in women","Associated with more severe anxiety"]), correctAnswer: "B", explanation: "OCPD is ego-syntonic — individuals with OCPD see their perfectionism and rigidity as appropriate and fine. OCD is ego-dystonic — the obsessions are recognized as intrusive and unwanted." },
    { topicId: T["Personality Disorders"], question: "Avoidant personality disorder is characterized by:", options: JSON.stringify(["Desire for isolation with no interest in relationships","Social inhibition and desire for connection but hypersensitivity to rejection","Grandiosity and lack of empathy","Odd beliefs and magical thinking"]), correctAnswer: "B", explanation: "Avoidant PD (Cluster C) involves social inhibition and feelings of inadequacy with hypersensitivity to rejection — unlike schizoid PD, patients with AVPD actually desire relationships but fear rejection." },
    { topicId: T["Personality Disorders"], question: "The neurobiological factor most linked to impulsivity in personality disorders is:", options: JSON.stringify(["Dopamine excess","Serotonin system dysfunction","Norepinephrine deficiency","Cortisol excess"]), correctAnswer: "B", explanation: "Serotonin system dysfunction is most consistently linked to impulsivity and aggression across personality disorders — reduced serotonin functioning correlates with impulsive and aggressive behavior." },
    { topicId: T["Personality Disorders"], question: "Paranoid personality disorder is characterized by:", options: JSON.stringify(["Odd beliefs and magical thinking","Pervasive distrust and suspicion of others without sufficient basis","Emotional instability and fear of abandonment","Detachment and indifference to relationships"]), correctAnswer: "B", explanation: "Paranoid PD (Cluster A) is characterized by pervasive, unjustified distrust and suspicion — individuals interpret others' motives as malevolent without sufficient reason." },
    { topicId: T["Personality Disorders"], question: "The alternative DSM-5 dimensional model for personality disorders assesses:", options: JSON.stringify(["Only Cluster B disorders","Personality functioning plus pathological trait domains (negative affectivity, detachment, antagonism, disinhibition, psychoticism)","Only social functioning","Cognitive ability"]), correctAnswer: "B", explanation: "The alternative DSM-5 Section III model uses a dimensional approach — assessing self/interpersonal functioning AND five pathological trait domains, providing a more nuanced and empirically supported framework." },

    // ===== 12. ADHD & MEDICATIONS =====
    { topicId: T["ADHD & Medications"], question: "The DSM-5 requires ADHD symptoms to be present before age:", options: JSON.stringify(["18","16","12","10"]), correctAnswer: "C", explanation: "DSM-5 requires that several inattentive or hyperactive-impulsive symptoms were present before age 12 (changed from 7 in DSM-IV) and must cause impairment in two or more settings." },
    { topicId: T["ADHD & Medications"], question: "The primary mechanism of methylphenidate (Ritalin) is:", options: JSON.stringify(["Serotonin reuptake inhibition","Blocking dopamine and norepinephrine reuptake transporters (DAT and NET)","Reversing the dopamine transporter","Blocking alpha-2 receptors"]), correctAnswer: "B", explanation: "Methylphenidate blocks the dopamine transporter (DAT) and norepinephrine transporter (NET) — increasing DA and NE in the prefrontal cortex to improve executive function." },
    { topicId: T["ADHD & Medications"], question: "Which brain region is most implicated in ADHD?", options: JSON.stringify(["Occipital cortex","Hippocampus","Prefrontal cortex and anterior cingulate","Cerebellum only"]), correctAnswer: "C", explanation: "The prefrontal cortex (working memory, inhibition) and anterior cingulate cortex (error monitoring) are most implicated in ADHD — dopamine and norepinephrine dysfunction in these circuits drives core symptoms." },
    { topicId: T["ADHD & Medications"], question: "Atomoxetine (Strattera) is classified as:", options: JSON.stringify(["A stimulant","A non-stimulant selective NE reuptake inhibitor","An SSRI","A dopamine agonist"]), correctAnswer: "B", explanation: "Atomoxetine is a selective norepinephrine reuptake inhibitor — it is FDA-approved for ADHD, has no abuse potential, and is particularly useful when stimulants are contraindicated (e.g., substance use)." },
    { topicId: T["ADHD & Medications"], question: "The heritability of ADHD is approximately:", options: JSON.stringify(["10-20%","30-40%","50-60%","70-80%"]), correctAnswer: "D", explanation: "ADHD has a heritability of approximately 70-80% — it is among the most heritable psychiatric disorders, with multiple genes affecting dopamine and norepinephrine systems." },
    { topicId: T["ADHD & Medications"], question: "Amphetamine differs from methylphenidate because it:", options: JSON.stringify(["Only blocks serotonin reuptake","Both blocks the reuptake transporter AND reverses it, actively releasing DA and NE","Acts exclusively on NE","Has a shorter duration of action"]), correctAnswer: "B", explanation: "Amphetamine both blocks DAT/NET AND reverses them, actively pumping dopamine and norepinephrine out of the presynaptic neuron — this makes it stronger and longer-acting than methylphenidate." },
    { topicId: T["ADHD & Medications"], question: "Guanfacine (Intuniv) works for ADHD by:", options: JSON.stringify(["Blocking D2 receptors","Activating alpha-2A adrenergic receptors in the prefrontal cortex","Inhibiting serotonin reuptake","Increasing GABA activity"]), correctAnswer: "B", explanation: "Guanfacine is a selective alpha-2A adrenergic agonist — it strengthens PFC neural network connections by reducing noisy firing, improving working memory, attention, and impulse control." },
    { topicId: T["ADHD & Medications"], question: "Working memory deficits are a core feature of ADHD because:", options: JSON.stringify(["ADHD affects the hippocampus","Working memory depends on the prefrontal cortex and dopamine/NE signaling","Working memory is a sensory function","It is caused by cerebellar damage"]), correctAnswer: "B", explanation: "Working memory depends on prefrontal cortex dopamine and norepinephrine signaling — deficient DA/NE in ADHD impairs the ability to hold and manipulate information in mind." },
    { topicId: T["ADHD & Medications"], question: "Common risks of stimulant medication for ADHD include:", options: JSON.stringify(["Weight gain and increased sleep","Decreased appetite, sleep disruption, and elevated heart rate/blood pressure","Sedation and cognitive slowing","Memory loss and confusion"]), correctAnswer: "B", explanation: "Stimulant side effects include decreased appetite, sleep disruption, elevated heart rate/blood pressure, and potential for abuse — cardiovascular screening is recommended prior to prescribing." },
    { topicId: T["ADHD & Medications"], question: "The Continuous Performance Test (CPT) primarily assesses:", options: JSON.stringify(["Language abilities","Memory consolidation","Sustained attention and impulse control","Visual-spatial skills"]), correctAnswer: "C", explanation: "The CPT requires sustained vigilance and response inhibition — the participant responds to target stimuli and inhibits responses to non-targets, making it a key measure in ADHD evaluation." },

    // ===== 13. LANGUAGE PROCESSING & APHASIA =====
    { topicId: T["Language Processing & Aphasia"], question: "Broca's aphasia is characterized by:", options: JSON.stringify(["Fluent speech with poor comprehension","Non-fluent, effortful speech with relatively preserved comprehension","Normal speech but poor repetition","Total loss of all language"]), correctAnswer: "B", explanation: "Broca's aphasia (left inferior frontal gyrus damage) produces non-fluent, effortful, telegraphic speech with relatively preserved comprehension — the patient understands but struggles to produce speech." },
    { topicId: T["Language Processing & Aphasia"], question: "Wernicke's aphasia is characterized by:", options: JSON.stringify(["Non-fluent speech with intact comprehension","Fluent but meaningless speech with poor comprehension","Good repetition with poor production","Loss of all language functions"]), correctAnswer: "B", explanation: "Wernicke's aphasia (posterior superior temporal gyrus damage) produces fluent but semantically empty speech (word salad, paraphasias) with severely impaired comprehension." },
    { topicId: T["Language Processing & Aphasia"], question: "Conduction aphasia is caused by damage to:", options: JSON.stringify(["Broca's area","Wernicke's area","The arcuate fasciculus connecting Broca's and Wernicke's areas","The primary motor cortex"]), correctAnswer: "C", explanation: "Conduction aphasia results from arcuate fasciculus damage — disconnecting Broca's from Wernicke's areas. Speech is fluent, comprehension is adequate, but repetition is severely impaired." },
    { topicId: T["Language Processing & Aphasia"], question: "Global aphasia involves:", options: JSON.stringify(["Only impaired production","Only impaired comprehension","Severely impaired production, comprehension, and repetition","Good repetition with all other functions impaired"]), correctAnswer: "C", explanation: "Global aphasia — caused by large left hemisphere lesions involving both Broca's and Wernicke's areas — severely impairs all language functions: fluency, comprehension, and repetition." },
    { topicId: T["Language Processing & Aphasia"], question: "A semantic paraphasia is:", options: JSON.stringify(["Substituting a phonologically similar word","Substituting a semantically related word","Difficulty with repetition","Total word retrieval failure"]), correctAnswer: "B", explanation: "Semantic paraphasia involves substituting a semantically related word for the target (e.g., saying 'knife' for 'fork') — common in Wernicke's aphasia." },
    { topicId: T["Language Processing & Aphasia"], question: "The six components assessed in aphasia evaluation are:", options: JSON.stringify(["Memory, attention, executive, language, spatial, and motor","Fluency, comprehension, repetition, naming, reading, and writing","Syntax, semantics, phonology, morphology, pragmatics, and prosody","Hearing, vision, touch, taste, smell, and proprioception"]), correctAnswer: "B", explanation: "Aphasia is characterized along six dimensions: fluency of output, comprehension, repetition, naming, reading, and writing — these distinguish different aphasia types." },
    { topicId: T["Language Processing & Aphasia"], question: "Language dominance in right-handed individuals is:", options: JSON.stringify(["Right hemisphere in ~95%","Left hemisphere in ~95%","Equal left and right in ~50%","Right hemisphere in ~50%"]), correctAnswer: "B", explanation: "Language is dominant in the left hemisphere in approximately 95% of right-handers and about 70% of left-handers — assessed clinically with the Wada test." },
    { topicId: T["Language Processing & Aphasia"], question: "Dysarthria differs from aphasia in that dysarthria:", options: JSON.stringify(["Involves comprehension problems","Is a language disorder","Is a motor speech disorder with intact language","Is caused by left hemisphere lesions only"]), correctAnswer: "C", explanation: "Dysarthria is a motor speech disorder — slurred speech from weakness or incoordination of speech muscles — with intact language (grammar, comprehension, and word finding are normal)." },
    { topicId: T["Language Processing & Aphasia"], question: "Transcortical motor aphasia features:", options: JSON.stringify(["Poor repetition and poor comprehension","Non-fluent speech, good comprehension, and preserved repetition","Fluent speech with neologisms","Complete mutism"]), correctAnswer: "B", explanation: "Transcortical motor aphasia (supplementary motor area lesion, sparing perisylvian language core) produces non-fluent speech with good comprehension and strikingly preserved repetition." },
    { topicId: T["Language Processing & Aphasia"], question: "Anomia is:", options: JSON.stringify(["Inability to hear speech sounds","Difficulty retrieving words and names","Inability to repeat words","Loss of reading ability"]), correctAnswer: "B", explanation: "Anomia is word-finding difficulty — impaired ability to retrieve names and words. It occurs in many aphasia types and is typically the last deficit to resolve in aphasia recovery." },

    // ===== 14. APRAXIA & AGNOSIA =====
    { topicId: T["Apraxia & Agnosia"], question: "Apraxia is defined as:", options: JSON.stringify(["Muscle weakness affecting movement","Inability to perform purposeful movements despite intact motor function and comprehension","Sensory loss impairing movement","Memory loss affecting learned movements"]), correctAnswer: "B", explanation: "Apraxia is the inability to perform purposeful, skilled movements despite intact motor strength, sensation, and comprehension — it is a disorder of motor planning from cortical association area damage." },
    { topicId: T["Apraxia & Agnosia"], question: "Ideomotor apraxia primarily affects:", options: JSON.stringify(["Multi-step task sequences","Performance of movements on verbal command or imitation","Fine motor precision only","Spontaneous automatic movements"]), correctAnswer: "B", explanation: "Ideomotor apraxia: inability to perform movements to verbal command (e.g., 'wave goodbye') or by imitation — though spontaneous performance in context may be preserved." },
    { topicId: T["Apraxia & Agnosia"], question: "What is the correct order for testing apraxia?", options: JSON.stringify(["Use object → imitate → command","Command → imitate → use object","Imitate → command → use object","Command → use object → imitate"]), correctAnswer: "B", explanation: "Apraxia is tested from most to least abstract: pantomime to command → imitation → use of actual object. Performance typically improves moving toward object use." },
    { topicId: T["Apraxia & Agnosia"], question: "Prosopagnosia is defined as:", options: JSON.stringify(["Inability to recognize any visual objects","Inability to recognize familiar faces","Inability to name objects","Inability to read words"]), correctAnswer: "B", explanation: "Prosopagnosia is the inability to recognize familiar faces despite intact basic visual perception — caused by bilateral damage to the fusiform face area. Patients can identify gender, age, and emotion from faces." },
    { topicId: T["Apraxia & Agnosia"], question: "Associative agnosia differs from apperceptive agnosia in that:", options: JSON.stringify(["The patient cannot copy objects","The patient can perceive and copy objects but cannot recognize them or access their meaning","The patient has motor weakness","The patient has language comprehension problems"]), correctAnswer: "B", explanation: "In associative agnosia, basic visual perception is intact (patient can copy and match objects) but they cannot recognize the object or access its semantic meaning — an agnosia of recognition, not perception." },
    { topicId: T["Apraxia & Agnosia"], question: "Hemispatial neglect is best characterized as:", options: JSON.stringify(["Primary sensory loss on one side","Failure to attend to or respond to stimuli on the contralesional side","A visual field defect","A motor paralysis"]), correctAnswer: "B", explanation: "Hemispatial neglect is the failure to attend to stimuli on the side contralateral to a brain lesion (usually right hemisphere) — it is not a sensory loss but an attentional deficit." },
    { topicId: T["Apraxia & Agnosia"], question: "Balint's syndrome consists of:", options: JSON.stringify(["Prosopagnosia, alexia, and agraphia","Simultagnosia, optic ataxia, and oculomotor apraxia","Ideomotor apraxia, ideational apraxia, and constructional apraxia","Hemispatial neglect, hemianopia, and hemiplegia"]), correctAnswer: "B", explanation: "Balint's syndrome (bilateral parieto-occipital lesions) consists of simultagnosia (cannot process whole scene), optic ataxia (inaccurate reaching), and oculomotor apraxia (inability to voluntarily move eyes)." },
    { topicId: T["Apraxia & Agnosia"], question: "The 'what' pathway in visual agnosia research refers to:", options: JSON.stringify(["Dorsal occipitoparietal pathway","Ventral occipitotemporal pathway","The optic chiasm","The primary visual cortex"]), correctAnswer: "B", explanation: "The ventral stream (occipitotemporal) is the 'what' pathway — it processes object identity, color, and faces. Associative agnosia and prosopagnosia involve damage along this pathway." },
    { topicId: T["Apraxia & Agnosia"], question: "Anosognosia is:", options: JSON.stringify(["Deliberate faking of symptoms","Psychological denial of illness","Neurological unawareness of one's own deficit, caused by right hemisphere damage","A type of aphasia"]), correctAnswer: "C", explanation: "Anosognosia is a neurological phenomenon — unawareness of one's own deficit (e.g., being unaware of paralysis or memory loss) — caused by right hemisphere damage and prevalent in Alzheimer's disease." },
    { topicId: T["Apraxia & Agnosia"], question: "Kinetic (limb-kinetic) apraxia is tested by:", options: JSON.stringify(["Verbal command to wave","Copying complex figures","Finger tapping and grooved pegboard tasks","Clock drawing"]), correctAnswer: "C", explanation: "Kinetic apraxia is clumsiness in precision motor acts — tested by finger tapping speed, grooved pegboard, and other fine motor dexterity tasks." },

    // ===== 15. NEUROCOGNITIVE DISORDERS =====
    { topicId: T["Neurocognitive Disorders"], question: "The 4 As of cortical dementia are:", options: JSON.stringify(["Anxiety, Agitation, Apathy, Abulia","Amnesia, Aphasia, Apraxia, Agnosia","Alogia, Avolition, Anhedonia, Asociality","Ataxia, Apraxia, Aphasia, Akinesia"]), correctAnswer: "B", explanation: "Cortical dementia (e.g., Alzheimer's) is characterized by the 4 As: Amnesia (memory), Aphasia (language), Apraxia (motor planning), and Agnosia (recognition)." },
    { topicId: T["Neurocognitive Disorders"], question: "The HTT gene mutation in Huntington's disease involves:", options: JSON.stringify(["Tau protein aggregation","CAG repeat expansion on chromosome 4","APOE-e4 allele","Alpha-synuclein accumulation"]), correctAnswer: "B", explanation: "Huntington's disease is caused by expansion of CAG repeats (>36) in the HTT gene on chromosome 4 — resulting in a toxic protein that causes neuronal death, especially in the striatum." },
    { topicId: T["Neurocognitive Disorders"], question: "The core features of dementia with Lewy bodies (DLB) include:", options: JSON.stringify(["Memory loss, depression, and stroke","Fluctuating cognition, visual hallucinations, parkinsonism, and REM sleep behavior disorder","Chorea, psychiatric symptoms, and executive dysfunction","Aphasia, apraxia, and agnosia"]), correctAnswer: "B", explanation: "DLB's core features: fluctuating cognition (variable alertness), recurrent visual hallucinations, parkinsonism (after cognitive decline), and REM sleep behavior disorder — important for differentiating from Alzheimer's." },
    { topicId: T["Neurocognitive Disorders"], question: "Levodopa is less effective in PSP (progressive supranuclear palsy) compared to Parkinson's because:", options: JSON.stringify(["PSP has more dopamine","PSP pathology involves different neurotransmitter systems beyond dopamine alone","Levodopa cannot cross the BBB","PSP patients are older"]), correctAnswer: "B", explanation: "Unlike Parkinson's, PSP involves more widespread tau pathology affecting multiple neurotransmitter systems — levodopa provides minimal benefit in most PSP cases." },
    { topicId: T["Neurocognitive Disorders"], question: "Mild cognitive impairment (MCI) prevalence in the US is approximately:", options: JSON.stringify(["1-2%","5-8%","15-20%","30-40%"]), correctAnswer: "C", explanation: "MCI prevalence is approximately 15-20% in the US — it represents the transitional state between normal aging and dementia, with aMCI (amnestic) more likely to convert to Alzheimer's." },
    { topicId: T["Neurocognitive Disorders"], question: "The 'magnetic gait' in Normal Pressure Hydrocephalus (NPH) is characterized by:", options: JSON.stringify(["Very fast, wide-based walking","Feet appearing stuck to the floor with small shuffling steps","Falling backwards","Stomping gate"]), correctAnswer: "B", explanation: "The magnetic gait of NPH involves feet that appear 'glued to the floor' — small shuffling steps with difficulty initiating movement and turning, caused by CSF pressure on the periventricular corticospinal tracts." },
    { topicId: T["Neurocognitive Disorders"], question: "Chronic traumatic encephalopathy (CTE) is:", options: JSON.stringify(["A genetic neurodegenerative disease","A neurodegenerative disease from repetitive TBIs, diagnosed definitively at autopsy","An acquired stroke syndrome","The same as Alzheimer's disease"]), correctAnswer: "B", explanation: "CTE is a progressive neurodegenerative disease caused by repetitive traumatic brain injuries — once called 'punch drunk syndrome'; it can only be definitively diagnosed at autopsy through tau pathology examination." },
    { topicId: T["Neurocognitive Disorders"], question: "The behavioral variant of frontotemporal dementia (bvFTD) is best characterized by:", options: JSON.stringify(["Early memory loss and aphasia","Disinhibition, apathy, hyperorality, stereotyped behaviors, and empathy loss (SHADE)","Progressive visual-spatial decline","Hallucinations and parkinsonism"]), correctAnswer: "B", explanation: "bvFTD features SHADE: Stereotyped behaviors, Hyperorality, Apathy, Disinhibition, and Empathy loss — caused by frontal and anterior temporal degeneration, with memory relatively spared early." },
    { topicId: T["Neurocognitive Disorders"], question: "Capacity vs. competency: which is a clinical determination?", options: JSON.stringify(["Competency","Neither","Capacity","Both"]), correctAnswer: "C", explanation: "Capacity is a clinical determination made by a physician or psychologist — it can change over time. Competency is a legal determination made by a judge — it is more permanent and harder to change." },
    { topicId: T["Neurocognitive Disorders"], question: "HIV-associated neurocognitive disorder (HAND) primarily affects which brain region?", options: JSON.stringify(["Cortex (especially temporal)","Subcortical structures — especially basal ganglia (caudate and putamen) and hippocampus","Cerebellum","Brainstem"]), correctAnswer: "B", explanation: "HAND preferentially affects subcortical structures — the basal ganglia (putamen and caudate, with most atrophy in the caudate) and hippocampus — producing a subcortical dementia profile." },

    // ===== SUPPLEMENTARY QUIZ — NEUROPSYCHOLOGY OVERVIEW =====
    { topicId: T["Neuropsychology Overview"], question: "Symptom validity tests (SVTs) are used in neuropsychological evaluation to:", options: JSON.stringify(["Assess language comprehension","Detect insufficient effort or malingering","Screen for dementia","Measure IQ"]), correctAnswer: "B", explanation: "SVTs (e.g., TOMM, WMT) detect poor effort or intentional symptom exaggeration — essential in forensic, disability, and medicolegal evaluations to ensure the data accurately reflects the patient's abilities." },
    { topicId: T["Neuropsychology Overview"], question: "The Trail Making Test Part B primarily measures:", options: JSON.stringify(["Visual acuity","Processing speed only","Cognitive flexibility and executive function","Long-term memory"]), correctAnswer: "C", explanation: "TMT-B requires alternating between number and letter sequences (1-A-2-B...) — it measures cognitive flexibility, set-shifting, and executive function. The B-A difference score isolates the executive component from pure processing speed." },
    { topicId: T["Neuropsychology Overview"], question: "Which of the following is a 'hold' test resistant to brain damage?", options: JSON.stringify(["Digit Span Backward","Block Design","Vocabulary","Processing Speed Index"]), correctAnswer: "C", explanation: "Vocabulary is a 'hold' test — it reflects overlearned, crystallized knowledge that is resistant to brain damage and used to estimate premorbid intellectual functioning. Block Design and processing speed are 'no-hold' tests sensitive to impairment." },
    { topicId: T["Neuropsychology Overview"], question: "The Boston Process Approach to neuropsychological assessment focuses on:", options: JSON.stringify(["Only the total test score","Standard normative comparison","How the patient solves problems, not just whether they succeed","Using only performance-based tests"]), correctAnswer: "C", explanation: "The Boston Process Approach examines qualitative error patterns and solution strategies — how a patient attempts tasks provides rich information about the nature of brain dysfunction beyond simple pass/fail scores." },
    { topicId: T["Neuropsychology Overview"], question: "Reliability in neuropsychological assessment means:", options: JSON.stringify(["The test measures what it claims to measure","The test consistently produces the same results across time and raters","The test predicts everyday functioning","The test is culturally fair"]), correctAnswer: "B", explanation: "Reliability is consistency — a reliable test produces stable, reproducible results across time (test-retest reliability) and scorers (inter-rater reliability). Validity (measuring what it claims) is a separate concept." },

    // ===== SUPPLEMENTARY QUIZ — CELL BIOLOGY & NEURON ANATOMY =====
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "Anterograde axonal transport moves materials:", options: JSON.stringify(["From axon terminal to cell body","From cell body to axon terminal","Between neurons","Only in unmyelinated axons"]), correctAnswer: "B", explanation: "Anterograde transport moves materials FROM the cell body TOWARD the axon terminal (e.g., neurotransmitter vesicles, proteins) — powered by kinesin along microtubules." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "Wallerian degeneration refers to:", options: JSON.stringify(["Death of the neuronal cell body","Degeneration of the axon segment distal to a cut","Demyelination of the whole axon","Sprouting of new axon terminals"]), correctAnswer: "B", explanation: "Wallerian degeneration is the programmed breakdown of the axon segment distal to an injury — Schwann cells and macrophages clear the debris, creating a pathway for potential axon regrowth." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "Hebbian plasticity is summarized by:", options: JSON.stringify(["'Use it or lose it'","'Neurons that fire together, wire together'","'The strongest synapse wins'","'Inhibition shapes excitation'"]), correctAnswer: "B", explanation: "Hebb's rule states that simultaneous activation of pre- and postsynaptic neurons strengthens their synaptic connection — the cellular basis of associative learning and the foundation of LTP." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "Gap junctions (electrical synapses) differ from chemical synapses in that they:", options: JSON.stringify(["Use neurotransmitters","Are unidirectional","Allow direct ion flow between cells — faster and bidirectional","Only exist in the PNS"]), correctAnswer: "C", explanation: "Gap junctions are direct ion channels between adjacent cells — they allow instantaneous, bidirectional electrical transmission without neurotransmitters; important for synchronizing neural networks." },
    { topicId: T["Cell Biology & Neuron Anatomy"], question: "A pseudounipolar neuron has:", options: JSON.stringify(["Two separate dendrites and one axon","A single process that splits into two branches serving as both axon and dendrite","No axon","Multiple axons"]), correctAnswer: "B", explanation: "Pseudounipolar neurons (found in dorsal root ganglia) have one process that splits — one branch goes to the periphery (sensory receptor) and one to the spinal cord; they lack traditional dendrites." },

    // ===== SUPPLEMENTARY QUIZ — NEUROTRANSMITTERS & SYNAPTIC TRANSMISSION =====
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Glutamate excitotoxicity involves:", options: JSON.stringify(["Too little glutamate release","Excessive NMDA activation causing toxic Ca2+ influx and cell death","GABA receptor overstimulation","Blocking of AMPA receptors"]), correctAnswer: "B", explanation: "Excessive glutamate activates NMDA receptors, causing massive Ca2+ influx — this activates destructive enzymes (proteases, lipases) and triggers mitochondrial dysfunction, a key mechanism in stroke, TBI, and neurodegeneration." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "BDNF (Brain-Derived Neurotrophic Factor) is significant because it:", options: JSON.stringify(["Is the primary inhibitory neurotransmitter","Promotes neuronal survival, synaptic plasticity, and neurogenesis — reduced in depression","Is only active during development","Blocks NMDA receptors"]), correctAnswer: "B", explanation: "BDNF signals through TrkB receptors and is critical for LTP, synaptic plasticity, and neurogenesis. Exercise increases BDNF. Reduced BDNF is implicated in depression — antidepressants partly work by increasing BDNF." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Histamine in the brain promotes:", options: JSON.stringify(["Sleep","Wakefulness and arousal","Pain modulation","Motor control"]), correctAnswer: "B", explanation: "Histamine from the tuberomammillary nucleus promotes wakefulness — antihistamines that cross the BBB (e.g., diphenhydramine) cause sedation by blocking H1 receptors." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "The endocannabinoid system uses retrograde signaling, meaning:", options: JSON.stringify(["Signals travel from the presynaptic to postsynaptic neuron","The postsynaptic neuron sends signals BACK to the presynaptic neuron to suppress release","Signals travel along the axon to the terminal","Signals go from the cell body to dendrites"]), correctAnswer: "B", explanation: "Endocannabinoids (anandamide, 2-AG) are released by the postsynaptic neuron and travel backward to activate CB1 receptors on the presynaptic neuron — suppressing neurotransmitter release (DSI/DSE)." },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], question: "Glycine acts as a co-agonist for which receptor?", options: JSON.stringify(["AMPA","GABA-A","NMDA","Muscarinic"]), correctAnswer: "C", explanation: "The NMDA receptor requires glycine (or D-serine) binding at its co-agonist site in addition to glutamate — without glycine, glutamate alone cannot activate NMDA receptors." },

    // ===== SUPPLEMENTARY QUIZ — SENSORY PATHWAYS =====
    { topicId: T["Sensory Pathways"], question: "The internal capsule is clinically significant because:", options: JSON.stringify(["It is the seat of memory","Dense motor and sensory fibers pass through it — lacunar infarcts cause contralateral deficits","It is the location of the hippocampus","It produces cerebrospinal fluid"]), correctAnswer: "B", explanation: "The internal capsule is a white matter bottleneck containing corticospinal, corticobulbar, and thalamocortical fibers — small lacunar strokes cause dense contralateral motor deficits disproportionate to lesion size." },
    { topicId: T["Sensory Pathways"], question: "The trigeminal nerve (CN V) carries which type of information from the face?", options: JSON.stringify(["Motor only","Auditory","Pain, temperature, and touch from the face","Taste"]), correctAnswer: "C", explanation: "CN V (trigeminal) is the main sensory nerve of the face — it carries pain, temperature, and touch from the face to the VPM (ventral posterior medial) nucleus of the thalamus; also has motor fibers to the jaw muscles." },
    { topicId: T["Sensory Pathways"], question: "A lesion of the optic chiasm causes:", options: JSON.stringify(["Complete blindness","Monocular blindness","Bitemporal hemianopia (tunnel vision)","Left homonymous hemianopia"]), correctAnswer: "C", explanation: "The optic chiasm is where nasal retinal fibers cross — damage here disrupts both nasal fiber pathways, causing loss of the temporal visual fields in both eyes (bitemporal hemianopia / 'tunnel vision')." },
    { topicId: T["Sensory Pathways"], question: "Which thalamic nucleus relays auditory information to the cortex?", options: JSON.stringify(["Ventral posterior lateral (VPL)","Lateral geniculate nucleus (LGN)","Medial geniculate nucleus (MGN)","Pulvinar"]), correctAnswer: "C", explanation: "The medial geniculate nucleus (MGN) of the thalamus is the auditory relay — it receives input from the inferior colliculus and projects to Heschl's gyri in the superior temporal lobe." },
    { topicId: T["Sensory Pathways"], question: "The corticobulbar tract controls:", options: JSON.stringify(["Movement of the limbs","Voluntary movement of the face, tongue, and throat (brainstem cranial nerve nuclei)","Coordination of movements via the cerebellum","Autonomic regulation"]), correctAnswer: "B", explanation: "The corticobulbar tract descends from motor cortex to cranial nerve nuclei in the brainstem — controlling face, tongue, and throat movements. Distinguished from the corticospinal tract which controls limb/trunk movement." },

    // ===== SUPPLEMENTARY QUIZ — SENSORY SYSTEMS =====
    { topicId: T["Sensory Systems"], question: "A-delta pain fibers differ from C fibers in that they are:", options: JSON.stringify(["Unmyelinated and slow","Myelinated and transmit sharp 'first pain' faster","Located only in the face","Responsible for temperature only"]), correctAnswer: "B", explanation: "A-delta fibers are thinly myelinated — they transmit sharp, acute 'first pain' faster. C fibers are unmyelinated — they transmit slow, burning/aching 'second pain'. Both synapse in the dorsal horn." },
    { topicId: T["Sensory Systems"], question: "Referred pain (e.g., left arm pain in a heart attack) occurs because:", options: JSON.stringify(["Pain travels faster from the arm","Visceral and somatic afferents converge on the same spinal neurons","The heart sends pain directly to the arm","Pain is hallucinated during stress"]), correctAnswer: "B", explanation: "Referred pain occurs because visceral afferents and somatic afferents from areas like the left arm converge on the same dorsal horn neurons — the brain misattributes the pain location to the familiar somatic site." },
    { topicId: T["Sensory Systems"], question: "Sensorineural hearing loss differs from conductive hearing loss in that:", options: JSON.stringify(["It can be corrected with hearing aids alone","It involves the outer or middle ear","It involves damage to cochlear hair cells or the auditory nerve — often permanent","It is only unilateral"]), correctAnswer: "C", explanation: "Sensorineural hearing loss results from damage to inner ear hair cells or the auditory nerve — often permanent and the most common type. Conductive hearing loss is from outer/middle ear problems and is often treatable." },
    { topicId: T["Sensory Systems"], question: "The fovea of the retina provides the highest visual acuity because:", options: JSON.stringify(["It has the highest density of rod photoreceptors","It has the highest concentration of cone photoreceptors and each cone has its own dedicated ganglion cell","It is closest to the lens","It processes peripheral vision"]), correctAnswer: "B", explanation: "The fovea has a high density of cones (color, detail) with a 1:1 cone-to-ganglion cell ratio — allowing maximum spatial resolution. It is the point of fixation for detailed vision." },
    { topicId: T["Sensory Systems"], question: "Phantom limb pain is primarily explained by:", options: JSON.stringify(["Nerve regeneration at the stump","Cortical reorganization of the somatosensory cortex and ongoing central sensitization","Psychological denial of the amputation","Infection at the amputation site"]), correctAnswer: "B", explanation: "Phantom limb pain involves maladaptive cortical reorganization — neighboring cortical areas expand into the deafferented zone, and central neurons keep firing in the absence of peripheral input, generating perceived pain from the missing limb." },

    // ===== SUPPLEMENTARY QUIZ — LIMBIC SYSTEM & MOTIVATION =====
    { topicId: T["Limbic System & Motivation"], question: "Reward prediction error signals are primarily carried by:", options: JSON.stringify(["Serotonin from the raphe nuclei","Dopamine neurons that fire when reward exceeds expectation and suppress when it falls short","Norepinephrine from the locus coeruleus","GABA interneurons in the hippocampus"]), correctAnswer: "B", explanation: "Dopamine neurons encode reward prediction error — firing briskly when reward exceeds expectation (+RPE) and suppressing below baseline when expected reward is omitted (-RPE). This signal drives learning and is key to addiction." },
    { topicId: T["Limbic System & Motivation"], question: "The default mode network (DMN) is most active during:", options: JSON.stringify(["Focused attention tasks","Sensory processing","Rest and self-referential thinking (mind-wandering, autobiographical memory)","Rapid eye movement sleep"]), correctAnswer: "C", explanation: "The DMN (medial PFC, posterior cingulate, angular gyrus, hippocampus) is active during rest, self-reflection, and mind-wandering — it deactivates during focused external tasks. Disrupted in depression, PTSD, and TBI." },
    { topicId: T["Limbic System & Motivation"], question: "The bed nucleus of the stria terminalis (BNST) is primarily associated with:", options: JSON.stringify(["Acute fear responses to immediate threats","Sustained anxiety and anticipatory fear responses","Visual processing","Reward and motivation"]), correctAnswer: "B", explanation: "The BNST (extended amygdala) mediates sustained, unpredictable anxiety and anticipatory fear — distinguishable from the central amygdala which mediates acute, stimulus-specific fear responses." },
    { topicId: T["Limbic System & Motivation"], question: "Klüver-Bucy syndrome results from bilateral damage to the:", options: JSON.stringify(["Prefrontal cortex","Hippocampus","Amygdala and temporal lobes","Hypothalamus"]), correctAnswer: "C", explanation: "Klüver-Bucy syndrome from bilateral amygdala/temporal lesions produces hyperorality, hypersexuality, emotional placidity (loss of fear and aggression), visual agnosia, and memory impairment." },
    { topicId: T["Limbic System & Motivation"], question: "The ventromedial hypothalamus acts as a satiety center — damage to it causes:", options: JSON.stringify(["Starvation and failure to eat","Excessive eating (hyperphagia) and obesity","Increased aggression","Narcolepsy"]), correctAnswer: "B", explanation: "The ventromedial hypothalamus (VMH) is the 'satiety center' — VMH lesions remove the inhibition on feeding, leading to hyperphagia and dramatic obesity. The lateral hypothalamus is the opposing 'hunger center'." },

    // ===== SUPPLEMENTARY QUIZ — SLEEP & CIRCADIAN RHYTHMS =====
    { topicId: T["Sleep & Circadian Rhythms"], question: "Sleepwalking (somnambulism) occurs during which sleep stage?", options: JSON.stringify(["REM sleep","N1 light sleep","N3 slow-wave (deep NREM) sleep","Sleep onset"]), correctAnswer: "C", explanation: "Sleepwalking is a NREM parasomnia that occurs during N3 (slow-wave) sleep — typically in the first third of the night. The person has no dream recall and is hard to awaken." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "Cognitive Behavioral Therapy for Insomnia (CBT-I) is:", options: JSON.stringify(["Second-line to sleep medications","The first-line treatment for chronic insomnia — more effective than medication long-term","Only effective for acute insomnia","A type of biofeedback"]), correctAnswer: "B", explanation: "CBT-I is the gold-standard, first-line treatment for chronic insomnia — it includes sleep restriction, stimulus control, sleep hygiene, and cognitive restructuring. It is more effective than medication with no side effects." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "Delayed sleep phase syndrome is most common in:", options: JSON.stringify(["Elderly adults","Young children","Adolescents and young adults","Middle-aged adults"]), correctAnswer: "C", explanation: "DSPS (falling asleep very late and waking late) is most common in adolescents and young adults — driven by biological circadian delay during puberty. It can cause daytime sleepiness and school/work impairment." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "The primary purpose of sleep restriction in CBT-I is to:", options: JSON.stringify(["Increase total sleep time immediately","Build homeostatic sleep pressure to consolidate and improve sleep quality","Eliminate REM sleep","Treat sleep apnea"]), correctAnswer: "B", explanation: "Sleep restriction limits time in bed to the actual sleep time — it builds homeostatic sleep pressure (adenosine), consolidates sleep into fewer, more efficient hours, and then gradually extends bed time." },
    { topicId: T["Sleep & Circadian Rhythms"], question: "Sleep deprivation primarily affects which cognitive function first?", options: JSON.stringify(["Language production","Long-term memory","Sustained attention and vigilance","Spatial reasoning"]), correctAnswer: "C", explanation: "Sustained attention/vigilance is the cognitive function most sensitive to sleep deprivation — even moderate restriction causes measurable vigilance lapses on tasks like the Psychomotor Vigilance Task (PVT)." },

    // ===== SUPPLEMENTARY QUIZ — ENDOCRINE SYSTEM & REPRODUCTION =====
    { topicId: T["Endocrine System & Reproduction"], question: "Leptin and ghrelin regulate appetite by:", options: JSON.stringify(["Acting on the cerebellum","Leptin (from fat cells) promotes satiety; ghrelin (from stomach) promotes hunger — both act on hypothalamic circuits","Both promoting hunger","Acting on the brainstem only"]), correctAnswer: "B", explanation: "Leptin signals adequate fat stores → suppresses appetite via the hypothalamus. Ghrelin rises before meals and falls after eating → stimulates appetite. In obesity, leptin resistance can develop." },
    { topicId: T["Endocrine System & Reproduction"], question: "The gut-brain axis refers to:", options: JSON.stringify(["The connection between gut motility and motor function","Bidirectional communication between the GI tract and brain via vagus nerve, microbiome, and immune pathways","The effect of alcohol on the gut","Autonomic control of digestion"]), correctAnswer: "B", explanation: "The gut-brain axis is the bidirectional network linking GI tract and brain — the gut microbiome influences mood and cognition via serotonin (90% produced in gut), vagal signals, and immune pathways." },
    { topicId: T["Endocrine System & Reproduction"], question: "Insulin resistance in the brain is associated with:", options: JSON.stringify(["Faster cognitive processing","Increased neuroplasticity","Increased risk for Alzheimer's disease ('Type 3 diabetes' hypothesis)","Better synaptic transmission"]), correctAnswer: "C", explanation: "Brain insulin resistance impairs synaptic plasticity and neuronal survival — the 'Type 3 diabetes' hypothesis proposes that insulin signaling defects in the brain contribute to Alzheimer's disease pathogenesis." },
    { topicId: T["Endocrine System & Reproduction"], question: "Sex differences in stress response include:", options: JSON.stringify(["Males show more tend-and-befriend; females show more fight-or-flight","Females show more tend-and-befriend (oxytocin-mediated); males show more fight-or-flight","No biological differences","Females are more sensitive to cortisol but less to epinephrine"]), correctAnswer: "B", explanation: "Under stress, males tend toward fight-or-flight (sympathetic + HPA); females tend toward 'tend-and-befriend' — affiliating with others, partly mediated by oxytocin. Women have greater risk for PTSD and anxiety disorders." },
    { topicId: T["Endocrine System & Reproduction"], question: "Stress-induced analgesia (pain suppression during extreme stress) is mediated by:", options: JSON.stringify(["Dopamine from the VTA","Endogenous opioids, endocannabinoids, and NE from the descending pain modulation system (PAG)","GABA from the spinal cord","Acetylcholine from the basal forebrain"]), correctAnswer: "B", explanation: "During acute stress, the periaqueductal gray (PAG) activates descending pain modulation pathways — releasing endogenous opioids, endocannabinoids, and NE to suppress pain signals in the dorsal horn." },

    // ===== SUPPLEMENTARY QUIZ — PSYCHOPHARMACOLOGY =====
    { topicId: T["Psychopharmacology"], question: "Neuroleptic malignant syndrome (NMS) is characterized by:", options: JSON.stringify(["Fever, rigidity, altered consciousness, and autonomic instability","Involuntary facial movements only","Sedation and weight gain","Excessive salivation and tremor"]), correctAnswer: "A", explanation: "NMS is a rare, life-threatening antipsychotic reaction — FEVER (high), severe muscle rigidity, altered consciousness, and autonomic instability. Caused by sudden dopamine blockade. Medical emergency." },
    { topicId: T["Psychopharmacology"], question: "Serotonin syndrome differs from NMS in that serotonin syndrome:", options: JSON.stringify(["Is caused by too little serotonin","Is caused by excess serotonergic activity and features clonus/hyperreflexia/tremor rather than lead-pipe rigidity","Only occurs with SSRI overdose","Is not life-threatening"]), correctAnswer: "B", explanation: "Serotonin syndrome (excess 5-HT): mental status change + autonomic instability + neuromuscular signs (clonus, hyperreflexia, tremor, hyperthermia). NMS (dopamine blockade): rigidity is 'lead-pipe', onset is slower." },
    { topicId: T["Psychopharmacology"], question: "CYP450 enzyme inhibitors are clinically important because they:", options: JSON.stringify(["Speed up drug metabolism, reducing drug levels","Slow drug metabolism, raising levels of co-administered drugs — risk of toxicity","Block all drug absorption","Only affect first-pass metabolism"]), correctAnswer: "B", explanation: "CYP inhibitors (e.g., fluoxetine inhibits CYP2D6) prevent metabolism of co-administered drugs — raising their plasma levels to potentially toxic concentrations. Drug-drug interactions are a major clinical concern." },
    { topicId: T["Psychopharmacology"], question: "Cholinesterase inhibitors (e.g., donepezil) are used in Alzheimer's disease because:", options: JSON.stringify(["They clear amyloid plaques","They prevent tau formation","They increase acetylcholine by blocking its breakdown — compensating for cholinergic neuron loss","They block NMDA receptors"]), correctAnswer: "C", explanation: "In Alzheimer's, cholinergic neurons in the basal forebrain degenerate — cholinesterase inhibitors compensate by preventing ACh breakdown, increasing its availability in the synapse. Symptomatic benefit, not disease-modifying." },
    { topicId: T["Psychopharmacology"], question: "Physical dependence differs from addiction in that:", options: JSON.stringify(["Physical dependence always indicates addiction","Physical dependence is physiological adaptation to a drug (can occur with prescribed medications); addiction is compulsive use despite harm","Addiction requires tolerance","Physical dependence only occurs with illicit drugs"]), correctAnswer: "B", explanation: "Physical dependence (withdrawal if stopped) can develop with many medications (e.g., antidepressants, corticosteroids, opioids for pain) without addiction. Addiction is compulsive, reward-driven drug seeking despite harmful consequences." },

    // ===== SUPPLEMENTARY QUIZ — PSYCHOLOGICAL DISORDERS =====
    { topicId: T["Psychological Disorders"], question: "OCD involves hyperactivity in which brain circuit?", options: JSON.stringify(["Hippocampal-amygdala circuit","Cortico-striato-thalamo-cortical (CSTC) loop","Mesolimbic dopamine pathway","Cerebello-thalamic circuit"]), correctAnswer: "B", explanation: "OCD involves hyperactivity in the CSTC loop — particularly the orbitofrontal cortex (OFC) and caudate. This creates repetitive, anxiety-driven loops. First-line treatment: SSRIs + ERP (Exposure and Response Prevention) CBT." },
    { topicId: T["Psychological Disorders"], question: "Panic disorder is neurobiologically associated with:", options: JSON.stringify(["Reduced dopamine in the nucleus accumbens","Hyperactive amygdala and altered CO2/suffocation alarm system","Frontal lobe atrophy","Cerebellar dysfunction"]), correctAnswer: "B", explanation: "Panic disorder features hyperactive amygdala responses and altered sensitivity to CO2 inhalation (suffocation alarm system). The locus coeruleus NE system contributes to autonomic surges during panic attacks." },
    { topicId: T["Psychological Disorders"], question: "The kindling model of bipolar disorder suggests:", options: JSON.stringify(["Episodes occur at exactly regular intervals","Early episodes need stress triggers; later episodes become autonomous — supporting early intervention","Bipolar is caused by viral infection","All episodes are of equal severity"]), correctAnswer: "B", explanation: "The kindling model: early bipolar episodes require psychosocial stress, but with each episode the seizure-like lowering of threshold means later episodes can occur spontaneously — a key argument for prophylactic mood stabilizer treatment." },
    { topicId: T["Psychological Disorders"], question: "The neuropsychological effects of depression include:", options: JSON.stringify(["Enhanced memory and faster processing","Reduced hippocampal volume, impaired memory encoding, slowed processing, and executive dysfunction","Improved attention and concentration","Increased cortical thickness"]), correctAnswer: "B", explanation: "Depression is associated with reduced hippocampal volume (from chronic cortisol), impaired episodic memory, attentional bias to negative stimuli, slowed processing speed, and executive dysfunction — all of which can be mistaken for dementia." },
    { topicId: T["Psychological Disorders"], question: "Anorexia nervosa is associated with which neuropsychological features?", options: JSON.stringify(["Impulsivity and risk-taking","Rigid thinking, perfectionism, executive dysfunction, and altered reward signaling for food","Verbal memory deficits only","Right hemisphere dysfunction"]), correctAnswer: "B", explanation: "AN is associated with elevated harm avoidance, rigid cognitive style, executive dysfunction (especially set-shifting), and reduced dopamine reward response to food — high heritability (~50-80%) with neurobiological underpinnings." },

    // ===== SUPPLEMENTARY QUIZ — PERSONALITY DISORDERS =====
    { topicId: T["Personality Disorders"], question: "'Splitting' in BPD refers to:", options: JSON.stringify(["Dissociative identity disorder","Seeing people as entirely good or entirely bad without integration of both qualities","A cognitive deficit in abstract thinking","The tendency to split attention between two tasks"]), correctAnswer: "B", explanation: "Splitting is a primitive defense mechanism — the person alternates between idealization and devaluation, unable to integrate positive and negative qualities in the same person. A hallmark of BPD." },
    { topicId: T["Personality Disorders"], question: "Mentalization-Based Treatment (MBT) for BPD specifically targets:", options: JSON.stringify(["Behavioral avoidance","The impaired ability to understand one's own and others' mental states (mentalizing)","Core beliefs and schemas","Trauma processing"]), correctAnswer: "B", explanation: "MBT (Bateman & Fonagy) addresses the impaired mentalization (theory of mind) capacity in BPD — helping patients understand mental states drives better emotion regulation and relationship stability." },
    { topicId: T["Personality Disorders"], question: "The neurobiology of psychopathy is most associated with:", options: JSON.stringify(["Hyperactive amygdala","Reduced amygdala reactivity and structural differences in vmPFC — blunted fear and empathy responses","Elevated cortisol","Serotonin excess"]), correctAnswer: "B", explanation: "Psychopathy features reduced amygdala volume and activity (blunted fear, empathy) and vmPFC structural differences — reduced skin conductance to threatening stimuli reflects the core affective deficit." },
    { topicId: T["Personality Disorders"], question: "Emotion dysregulation in personality disorders is best described as:", options: JSON.stringify(["Only present in BPD","A purely behavioral problem","Intense emotional reactivity with slow return to baseline — a transdiagnostic feature across Cluster B","A symptom of psychosis"]), correctAnswer: "C", explanation: "Emotion dysregulation — characterized by intense emotional reactions, slow return to baseline, and difficulty identifying/managing emotions — is a core transdiagnostic feature of Cluster B disorders and a primary treatment target." },
    { topicId: T["Personality Disorders"], question: "OCPD differs from OCD because OCPD:", options: JSON.stringify(["Involves more intrusive obsessions","Is ego-syntonic — the perfectionism and rigidity feel appropriate and comfortable to the individual","Is always accompanied by compulsions","Responds better to SSRIs"]), correctAnswer: "B", explanation: "OCPD is ego-syntonic — the person sees their perfectionism and control as appropriate, a part of their identity. OCD is ego-dystonic — obsessions and compulsions feel intrusive and distressing." },

    // ===== SUPPLEMENTARY QUIZ — ADHD & MEDICATIONS =====
    { topicId: T["ADHD & Medications"], question: "Barkley's model of ADHD proposes that the core deficit is:", options: JSON.stringify(["Inattention only","Hyperactivity only","Impaired behavioral inhibition leading to downstream executive function deficits","A sensory processing problem"]), correctAnswer: "C", explanation: "Barkley proposes ADHD is fundamentally a deficit in behavioral inhibition — this impairs all downstream executive functions: working memory, self-regulation, internalization of speech, reconstitution, and motivation regulation." },
    { topicId: T["ADHD & Medications"], question: "How is ADHD more commonly missed in girls compared to boys?", options: JSON.stringify(["Girls have more severe hyperactivity","Girls more often present with the inattentive type — which is less disruptive and more likely to be overlooked","Girls score higher on rating scales","Girls respond differently to all medications"]), correctAnswer: "B", explanation: "Girls with ADHD more commonly present with the predominantly inattentive type — daydreaming, disorganization, forgetting — rather than hyperactive/impulsive behavior. This less-disruptive presentation leads to later and underdiagnosis." },
    { topicId: T["ADHD & Medications"], question: "Which of the following is a common psychiatric comorbidity with ADHD?", options: JSON.stringify(["Parkinson's disease","Schizophrenia","Anxiety disorders, depression, and oppositional defiant disorder","Dementia"]), correctAnswer: "C", explanation: "ADHD commonly co-occurs with anxiety disorders (~50%), depression, ODD/conduct disorder, learning disabilities, and substance use disorders — comorbidities must be assessed as they affect treatment planning." },
    { topicId: T["ADHD & Medications"], question: "Why is multimethod assessment essential for ADHD diagnosis?", options: JSON.stringify(["Because rating scales alone are sufficient","Because no single test diagnoses ADHD — symptoms must be verified across settings using clinical interview, rating scales, and neurocognitive measures","Because neuroimaging is required","Because ADHD changes presentation every year"]), correctAnswer: "B", explanation: "ADHD diagnosis requires convergent evidence across methods and settings — clinical interview, multi-informant rating scales (parent, teacher, self), and neuropsychological testing. A single test or scale cannot diagnose ADHD." },
    { topicId: T["ADHD & Medications"], question: "Sluggish cognitive tempo (SCT) is best described as:", options: JSON.stringify(["Another name for ADHD-Inattentive type","A distinct attention profile with daydreaming, mental fog, slow processing, and hypoactivity — may respond differently to medications","A form of narcolepsy","A reading disorder"]), correctAnswer: "B", explanation: "SCT is a distinct attention profile characterized by daydreaming, mental fogginess, hypoactivity, and slow processing — may represent a syndrome separate from ADHD, and responds better to atomoxetine than stimulants." },

    // ===== SUPPLEMENTARY QUIZ — LANGUAGE PROCESSING & APHASIA =====
    { topicId: T["Language Processing & Aphasia"], question: "Emotional prosody (the melody and intonation conveying emotion in speech) is primarily processed by:", options: JSON.stringify(["Broca's area in the left hemisphere","The right hemisphere","The cerebellum","The basal ganglia"]), correctAnswer: "B", explanation: "The right hemisphere is primarily responsible for processing and producing emotional prosody — right hemisphere damage can impair the ability to express or interpret emotional tone in speech (aprosodia)." },
    { topicId: T["Language Processing & Aphasia"], question: "Primary progressive aphasia (PPA) is defined by:", options: JSON.stringify(["Sudden onset aphasia after stroke","Progressive language deterioration while other cognitive functions remain relatively preserved — a neurodegenerative syndrome","Global cognitive decline from the beginning","Aphasia caused by brain tumor"]), correctAnswer: "B", explanation: "PPA is a neurodegenerative syndrome where language progressively deteriorates while memory and other cognitive functions are relatively spared (initially) — three variants: non-fluent/agrammatic, semantic, and logopenic." },
    { topicId: T["Language Processing & Aphasia"], question: "Agrammatism in Broca's aphasia means:", options: JSON.stringify(["The patient cannot understand grammar","The patient produces speech without grammatical morphemes — telegraphic (content words only)","The patient has no speech at all","The patient speaks only in questions"]), correctAnswer: "B", explanation: "Agrammatism: grammatical morphemes (articles, prepositions, verb endings, auxiliaries) are omitted — speech is telegraphic: 'I... walk... store... buy... bread.' Content words are preserved but grammar is stripped." },
    { topicId: T["Language Processing & Aphasia"], question: "Pure alexia (alexia without agraphia) is caused by:", options: JSON.stringify(["Broca's area damage","Right hemisphere damage","Left occipital cortex + corpus callosum splenium damage — visual information cannot reach left language areas","Temporal lobe damage"]), correctAnswer: "C", explanation: "Pure alexia disconnects visual information from left hemisphere language areas — left occipital damage makes the right visual hemifield blind; the corpus callosum splenium lesion blocks right visual cortex from sending to left language areas. Writing is preserved." },
    { topicId: T["Language Processing & Aphasia"], question: "The right hemisphere's role in language is best described as:", options: JSON.stringify(["None — language is entirely left hemisphere","Processing literal word meanings only","Figurative language, humor, inference, metaphors, narrative comprehension, and pragmatics","Phonological processing"]), correctAnswer: "C", explanation: "The right hemisphere handles non-literal aspects of language: humor, metaphors, figurative language, narrative comprehension, inference, and pragmatics. Right hemisphere communication disorder impairs these skills with intact basic language." },

    // ===== SUPPLEMENTARY QUIZ — APRAXIA & AGNOSIA =====
    { topicId: T["Apraxia & Agnosia"], question: "Astereognosis (tactile agnosia) is:", options: JSON.stringify(["Loss of pain sensation in the hands","Inability to recognize objects by touch despite intact sensation","Weakness in the hands","Loss of proprioception"]), correctAnswer: "B", explanation: "Astereognosis is the inability to identify objects by touch alone (with vision excluded) despite intact somatosensation — it reflects higher-order tactile recognition deficits, typically from parietal lobe damage." },
    { topicId: T["Apraxia & Agnosia"], question: "Gerstmann's syndrome (left angular gyrus lesion) consists of:", options: JSON.stringify(["Hemiplegia, hemianopia, and hemisensory loss","Finger agnosia, acalculia, agraphia, and left-right disorientation","Apraxia, agnosia, aphasia, and amnesia","Visual agnosia, prosopagnosia, and neglect"]), correctAnswer: "B", explanation: "Gerstmann's syndrome (left angular gyrus/parietal lesion): four features — finger agnosia (cannot identify individual fingers), acalculia (math deficit), agraphia (writing deficit), and left-right disorientation." },
    { topicId: T["Apraxia & Agnosia"], question: "Extinction (sensory extinction) is best defined as:", options: JSON.stringify(["Complete loss of sensation on one side","Inability to detect stimuli on the neglected side in isolation","Reporting the neglected-side stimulus as absent ONLY when simultaneously stimulated on the intact side","A form of visual field defect"]), correctAnswer: "C", explanation: "Extinction: the patient detects unilateral stimuli normally, but when stimulated simultaneously on both sides, the contralesional stimulus is extinguished — attentional competition favors the ipsilesional side." },
    { topicId: T["Apraxia & Agnosia"], question: "Constructional apraxia most severely impairs which activities?", options: JSON.stringify(["Speaking","Drawing, copying, and assembling spatial structures — despite intact motor strength","Reading","Mathematical calculation"]), correctAnswer: "B", explanation: "Constructional apraxia impairs the ability to draw, copy designs, and assemble structures (e.g., blocks, puzzles) — not from motor weakness, but from deficits in spatial planning and visuoconstructive processing." },
    { topicId: T["Apraxia & Agnosia"], question: "Auditory agnosia differs from cortical deafness in that:", options: JSON.stringify(["They are the same condition","Auditory agnosia: sounds are heard but cannot be recognized; cortical deafness: no sound perception despite intact peripheral hearing","Auditory agnosia only affects music","Cortical deafness affects only speech"]), correctAnswer: "B", explanation: "In cortical deafness, auditory information doesn't reach conscious perception — sounds are not heard. In auditory agnosia, sounds are heard but cannot be recognized or categorized; perception is intact but recognition fails." },

    // ===== SUPPLEMENTARY QUIZ — NEUROCOGNITIVE DISORDERS =====
    { topicId: T["Neurocognitive Disorders"], question: "Creutzfeldt-Jakob disease (CJD) is caused by:", options: JSON.stringify(["A virus","A bacterium","Misfolded prion proteins causing spongiform encephalopathy","An autoimmune reaction"]), correctAnswer: "C", explanation: "CJD is a prion disease — misfolded prion proteins trigger chain-reaction misfolding of normal prion proteins, causing spongiform (sponge-like) encephalopathy. Rapidly progressive (months), fatal, with no treatment." },
    { topicId: T["Neurocognitive Disorders"], question: "Sundowning in dementia refers to:", options: JSON.stringify(["Morning confusion upon waking","Worsening agitation and confusion in the late afternoon and evening","Nocturnal hallucinations only","A permanent vegetative state"]), correctAnswer: "B", explanation: "Sundowning refers to worsening confusion, agitation, and behavioral disturbance in the late afternoon/evening — linked to disrupted circadian rhythms, fatigue, and reduced environmental cues in dementia." },
    { topicId: T["Neurocognitive Disorders"], question: "The MoCA (Montreal Cognitive Assessment) is preferred over the MMSE for detecting MCI because:", options: JSON.stringify(["It is shorter","It has better sensitivity for detecting mild cognitive impairment — includes executive function, visuospatial, and attention tasks that MMSE misses","It requires no education adjustment","It is better validated in all populations"]), correctAnswer: "B", explanation: "The MoCA is more sensitive than the MMSE for MCI — it includes tasks like clock drawing, trail-making segment, verbal fluency, and abstraction that detect subtle executive and attention deficits missed by the MMSE." },
    { topicId: T["Neurocognitive Disorders"], question: "Key midlife vascular risk factors for dementia include:", options: JSON.stringify(["High education and bilingualism","Hypertension, diabetes, hyperlipidemia, smoking, and obesity","Physical exercise and Mediterranean diet","Sleep quality and stress management"]), correctAnswer: "B", explanation: "Midlife hypertension, diabetes, hyperlipidemia, smoking, and obesity are the most evidence-based modifiable risk factors for dementia — particularly vascular dementia and Alzheimer's disease. Control of these factors reduces risk." },
    { topicId: T["Neurocognitive Disorders"], question: "BPSD (Behavioral and Psychological Symptoms of Dementia) includes:", options: JSON.stringify(["Only memory problems","Agitation, aggression, wandering, psychosis, depression, apathy, sleep disturbance, and disinhibition","Only aphasia and apraxia","Cognitive deficits alone"]), correctAnswer: "B", explanation: "BPSD encompasses non-cognitive symptoms — agitation, aggression, psychosis, depression, apathy, sleep disturbance, and disinhibition. They are highly distressing for caregivers and are often the trigger for institutionalization." },
  ];

  const quizQuestionsToInsert = rawQuizQuestions.map(rq => {
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
      examOnly: false,
    };
  });

  const insertedQuestions = await db.insert(quizQuestionsTable).values(quizQuestionsToInsert).returning();

  // ===========================================================================
  // STUDY GUIDES (1 per topic = 15 total)
  // ===========================================================================
  const studyGuides = [
    {
      topicId: T["Neuropsychology Overview"],
      title: "Neuropsychology Overview — Study Guide",
      content: `## What Is Neuropsychology?
Neuropsychology is the scientific discipline that studies brain-behavior relationships — how the structure, function, and health of the brain determine cognition, emotion, behavior, and everyday functioning. It sits at the intersection of neuroscience, psychology, and clinical medicine. Clinical neuropsychologists use standardized assessments to characterize cognitive strengths and weaknesses in individuals with known or suspected brain conditions, guide diagnosis, inform treatment, and monitor change over time.

The field emerged from wartime neurology (Luria, Head, Goldstein) and has grown into a sophisticated specialty with applications in dementia evaluation, TBI rehabilitation, pre-surgical planning (epilepsy, tumor resection), medicolegal forensic assessment, and pediatric neurodevelopmental evaluation.

## Historical Foundations

**Paul Broca (1861):** Described a patient ("Tan") with preserved comprehension but nonfluent speech — localizing speech production to the left inferior frontal gyrus (Broca's area). This was the first strong evidence for cerebral localization of language.

**Carl Wernicke (1874):** Identified a posterior superior temporal lesion producing fluent but meaningless speech with comprehension failure (Wernicke's aphasia). Together with Broca's discovery, this launched localizationism.

**Alexander Luria:** A Soviet neuropsychologist who developed a holistic-functional systems approach — brain functions are implemented by distributed, hierarchically organized networks. His "neuropsychological battery" assessed the entire brain systematically. He emphasized functional compensation and rehabilitative neuropsychology.

**Roger Sperry (Nobel 1981):** Split-brain research demonstrating the independent cognitive specializations of the left and right hemispheres in patients with severed corpus callosa.

**Milner & Scoville's HM case (1957):** Bilateral hippocampal resection produced profound anterograde amnesia while sparing immediate memory, remote memory, and implicit learning — establishing the hippocampus as critical for episodic memory formation.

## Core Brain Regions and Their Functions

**Frontal Lobe:** The frontal lobe (anterior to the central sulcus) subserves executive functions — planning, decision-making, working memory, response inhibition, cognitive flexibility, and social regulation. The primary motor cortex (precentral gyrus) controls voluntary movement with a contralateral, somatotopic organization. The prefrontal cortex (PFC) can be divided into:
- Dorsolateral PFC (dlPFC): working memory, executive control, verbal fluency, attention
- Orbitofrontal/ventromedial PFC (OFC/vmPFC): decision-making, reward processing, social behavior, emotional regulation
- Medial PFC / supplementary motor area (SMA): willed action, speech initiation, cingulate-frontal integration

Frontal lesions may produce: executive dysfunction, personality change, disinhibition, perseveration, apraxia, utilization behavior, or apathy.

**Parietal Lobe:** Posterior to the central sulcus; the postcentral gyrus is the primary somatosensory cortex (S1) receiving input from VPL/VPM thalamus in a homuncular organization. The superior parietal lobule processes spatial attention and proprioception. The inferior parietal lobule (supramarginal and angular gyri) integrates multimodal sensory information and is critical for language, calculation (acalculia), praxis, and visuospatial processing. Gerstmann's syndrome (angular gyrus lesion) presents with acalculia, agraphia, finger agnosia, and left-right disorientation. Right parietal lesions produce hemispatial neglect and visuospatial deficits.

**Temporal Lobe:** The superior temporal plane contains primary auditory cortex (Heschl's gyri) and Wernicke's area (posterior superior temporal gyrus, BA 22). The medial temporal lobe (MTL) — hippocampus, entorhinal cortex, perirhinal cortex, parahippocampal cortex — is essential for episodic memory encoding and consolidation. The inferior temporal gyrus supports object recognition (ventral visual stream). The fusiform gyrus (fusiform face area, FFA) is specialized for face recognition (prosopagnosia with damage).

**Occipital Lobe:** Primary visual cortex (V1, striate cortex) in the calcarine fissure processes basic visual features (orientation, spatial frequency, color). Extrastriate areas: V2/V3 (intermediate processing), V4 (color), V5/MT (motion). Bilateral V1 destruction causes cortical blindness; lesions to association areas cause visual agnosias.

**Subcortical structures:** The basal ganglia (striatum, globus pallidus, substantia nigra, subthalamic nucleus) are involved in motor control, habit learning, and reward. The thalamus relays and gates most sensory information to cortex. The cerebellum coordinates motor timing, motor learning, and increasingly recognized cognitive/affective processing.

## Key Organizing Principles

**Contralateral organization:** Motor and somatosensory pathways cross the midline — the right hemisphere controls the left body. The visual system has a more complex arrangement: the right visual field projects to the left hemisphere, and vice versa, regardless of which eye receives the input.

**Lateralization:** Language is left-hemisphere dominant in approximately 95% of right-handers and 70% of left-handers. The right hemisphere is dominant for visuospatial processing, emotional prosody, and global visual processing. This is not absolute — the right hemisphere contributes significantly to language pragmatics, discourse, and humor.

**Cerebral dominance is hand-dependent:** Strong left-handers have a much higher rate of right or bilateral language representation. This is clinically relevant for neurosurgical planning and Wada testing.

**Double dissociation:** The gold-standard evidence that two cognitive functions depend on different neural substrates — Patient A is impaired on Task X but not Y; Patient B is impaired on Y but not X. Single dissociations are insufficient as one task may simply be more difficult.

**Diaschisis:** First described by von Monakow — acute injury to one brain region causes transient loss of function in anatomically connected but structurally intact remote regions, due to sudden loss of neural drive. Explains why acute focal injury initially produces more widespread deficits that partially recover.

**Neuroplasticity:** The brain's capacity to reorganize in response to experience, learning, or injury — mechanisms include LTP, axonal sprouting, dendritic arborization, unmasking of latent pathways, and neurogenesis (limited in adults). Plasticity is greatest early in development (sensitive periods) and provides the neural basis for cognitive rehabilitation.

**Cognitive reserve:** An individual's resilience to brain pathology — built through education, cognitively stimulating occupations, bilingualism, social engagement, and physical activity. Patients with high reserve may show less clinical impairment despite equivalent neuropathology, and their decline may be faster once reserve is exhausted.

## The Neuropsychological Evaluation

A comprehensive neuropsychological evaluation typically includes:

**1. Clinical interview:** Presenting complaint, medical/psychiatric/neurodevelopmental history, academic and occupational history, medications, substance use, and informant interview.

**2. Behavioral observation:** Language fluency, motor signs, affect, effort, engagement, and cooperation.

**3. Cognitive battery across major domains:**
- Intellectual ability (WAIS-IV/5)
- Attention and processing speed
- Memory (verbal and visual, encoding vs. retrieval)
- Language (naming, fluency, comprehension)
- Visuospatial and visuoconstructional abilities
- Executive functions (planning, flexibility, inhibition)
- Motor and sensorimotor functions
- Emotional and behavioral functioning

**4. Validity and effort measures:** To ensure test results reflect genuine ability — both symptom validity tests (SVTs) and performance validity tests (PVTs). Suboptimal effort/feigning invalidates findings.

**5. Integration and report:** Results are interpreted relative to normative data, demographic adjustments (age, education, sex), estimated premorbid ability, and clinical context.

## Major Assessment Tools

| Domain | Tool | What It Measures |
|--------|------|-----------------|
| Intelligence | WAIS-IV | Full-Scale IQ, 4 factor indices |
| Memory | WMS-IV | Verbal/Visual Immediate & Delayed Memory |
| Verbal Memory | CVLT-II, HVLT-R | Word list learning, recall, recognition |
| Visual Memory | BVMT-R, RCFT | Geometric figure learning and recall |
| Attention/WM | Digit Span (WAIS), CPT | Phonological loop, sustained attention |
| Executive Function | D-KEFS (TMT, Stroop, WCST) | Flexibility, inhibition, fluency |
| Visuospatial | RCFT Copy, JOLO | Constructional ability, spatial judgment |
| Language | BNT, MAE, BDAE | Naming, aphasia classification |
| Premorbid Estimate | WRAT-5 Reading, TOPF | Reading-based IQ estimate |
| Personality/Behavior | MMPI-3, PAI, BRIEF | Psychological/behavioral measures |

## Psychometric Concepts

**Reliability** is the consistency of a test — test-retest reliability is especially important in neuropsychology when monitoring longitudinal change. Practice effects (improvement with repeated testing) must be accounted for using reliable change indices.

**Validity** is whether a test measures what it claims to — neuropsychological tests should have construct validity (linked to specific cognitive abilities) and ecological validity (predict real-world functioning).

**Standard scores and T-scores:** Most neuropsychological tests use age-corrected normative comparisons. Standard scores: mean 100, SD 15. T-scores: mean 50, SD 10. Scaled scores: mean 10, SD 3. Knowing where a patient falls in the normative distribution is essential.

**Base rates:** The frequency of a finding in a healthy comparison sample. A score at the 10th percentile may or may not be "impaired" depending on the base rate in the normative population — many healthy people score at or below the 10th percentile on any one test by chance.

**Hold vs. No-hold tests:** Hold tests (vocabulary, general information, reading recognition) are resistant to brain damage and estimate premorbid ability. No-hold tests (processing speed, new learning, fluid reasoning) are sensitive to current brain dysfunction — comparing them reveals the degree of decline.

## Blood Supply: Clinical Neuroanatomy

**Middle Cerebral Artery (MCA):** Largest intracranial artery — supplies the lateral convexity including Broca's area, Wernicke's area, primary sensorimotor cortex for the face/hand/arm, and the insula. MCA stroke produces contralateral hemiplegia (face/arm > leg), hemisensory loss, and usually aphasia (dominant) or neglect (nondominant).

**Anterior Cerebral Artery (ACA):** Supplies the medial frontal and parietal lobes — motor/sensory cortex for the leg/foot, cingulate gyrus, and anterior corpus callosum. ACA stroke causes contralateral leg weakness and may produce abulia, personality change, and anterior disconnection syndromes.

**Posterior Cerebral Artery (PCA):** Supplies the occipital lobe, medial temporal (hippocampus), and thalamus. PCA stroke causes contralateral homonymous hemianopia, visual agnosias, and anterograde amnesia (from hippocampal ischemia).

**Posterior Inferior Cerebellar Artery (PICA):** Occlusion causes lateral medullary (Wallenberg's) syndrome — ipsilateral facial sensory loss, Horner's syndrome, dysphagia, hoarseness; contralateral body pain/temperature loss.

## Diffusion Tensor Imaging (DTI)

DTI maps white matter tract integrity by measuring the directionality of water diffusion — high directionality (fractional anisotropy, FA) indicates intact myelin/axonal structure; reduced FA indicates damage. DTI can trace major tracts (arcuate fasciculus, corticospinal tract, uncinate fasciculus) and is used in TBI, MS, and surgical planning.

## Functional Imaging

**PET (Positron Emission Tomography):** Measures metabolic activity or receptor density using radioactive tracers. FDG-PET (glucose metabolism) shows characteristic hypometabolic patterns in Alzheimer's (temporoparietal) vs. FTD (frontal). Amyloid PET and tau PET allow in vivo detection of AD pathology.

**fMRI:** Measures BOLD (blood oxygen level-dependent) signal — a surrogate for neuronal activity. Used in language lateralization mapping, cognitive neuroscience research, and neurosurgical planning.

## Syndromes to Know

**Korsakoff's Syndrome:** Thiamine deficiency (usually from chronic alcoholism) causing bilateral mammillary body and dorsomedial thalamic damage — profound anterograde amnesia with intact remote memory, confabulation, and apathy. Treat with parenteral thiamine.

**Disconnection Syndromes:** Damage to white matter tracts connecting regions produces characteristic syndromes (e.g., conduction aphasia from arcuate fasciculus damage; callosal syndromes from corpus callosum lesions; alexia without agraphia from left occipital + splenium damage).

**Pseudodementia:** Cognitive impairment mimicking dementia caused by severe depression — features: subjective complaints exceed objective deficits, inconsistent performance, can answer "I don't know," responds to treatment. Remains a controversial term; better called depression-related cognitive dysfunction.`
    },
    {
      topicId: T["Cell Biology & Neuron Anatomy"],
      title: "Cell Biology & Neuron Anatomy — Study Guide",
      content: `## The Neuron: Fundamental Unit of the Nervous System

A neuron is a specialized cell capable of receiving, integrating, and transmitting electrical signals. The adult human brain contains approximately 86 billion neurons and roughly 100 trillion synaptic connections. Neurons are anatomically and functionally diverse, but share core structural components.

## Neuron Structure and Classification

**Structural components:**
- **Dendrites:** Branching processes that receive synaptic input from other neurons. Covered in dendritic spines — small protrusions that host most excitatory synapses and allow compartmentalized calcium signaling.
- **Cell body (soma):** Contains the nucleus, rough ER (Nissl substance — site of protein synthesis), Golgi apparatus, mitochondria, and cytoskeleton. Site of metabolic activity and gene expression.
- **Axon hillock:** The initial segment of the axon emerging from the soma — the site of action potential initiation due to the highest density of voltage-gated Na+ channels.
- **Axon:** A single elongated process that transmits action potentials distally. Can be myelinated (faster) or unmyelinated.
- **Axon terminal (bouton):** The presynaptic terminal containing synaptic vesicles loaded with neurotransmitter.

**Classification by morphology:**
- Multipolar: Most CNS neurons — one axon, many dendrites
- Bipolar: Sensory neurons (retina, olfactory epithelium, cochlea)
- Unipolar/Pseudounipolar: Primary sensory neurons in dorsal root ganglia

**Classification by function:**
- Sensory (afferent): Carry information toward the CNS
- Motor (efferent): Carry commands from CNS to muscles/glands
- Interneurons: Connect neurons within the CNS — the most numerous class (~99% of all neurons)

## The Resting Membrane Potential

The resting membrane potential is approximately **-70 mV** — the inside of the neuron is electrically negative relative to the outside. This is established and maintained by:

**1. The Na+/K+ ATPase pump:** An active transporter (uses ATP) that extrudes 3 Na+ ions out and imports 2 K+ ions for every cycle — generating a net outward positive current and consuming ~30-40% of the neuron's energy.

**2. Selective permeability:** At rest, the membrane is much more permeable to K+ than Na+ (through leak channels). K+ diffuses outward down its concentration gradient, leaving behind negative charges inside — creating the negative resting potential.

**3. Nernst equilibrium potentials:** Each ion has a different equilibrium potential (where its electrical and concentration gradients balance): E_K ≈ -90 mV, E_Na ≈ +60 mV, E_Cl ≈ -70 mV. The resting potential sits near E_K, reflecting the high K+ permeability.

## The Action Potential

The action potential is an **all-or-none** explosive reversal of membrane potential that propagates along the axon without decrement.

**Stages:**
1. **Depolarization to threshold:** Graded EPSPs at the axon hillock summate; when the membrane reaches approximately **-55 mV** (threshold), voltage-gated Na+ channels open.
2. **Rising phase:** Na+ channels open rapidly → massive Na+ influx → membrane depolarizes to approximately **+40 mV**.
3. **Falling phase (repolarization):** Na+ channels inactivate (fast inactivation gate closes); delayed rectifier K+ channels open → K+ efflux → membrane rapidly repolarizes.
4. **Hyperpolarization (undershoot):** K+ channels remain open briefly beyond resting potential → membrane more negative than -70 mV.
5. **Return to resting:** Leak channels and pump activity restore -70 mV.

**Refractory periods:**
- **Absolute refractory period:** During Na+ channel inactivation — NO action potential possible regardless of stimulus strength. Sets the maximum firing frequency.
- **Relative refractory period:** During hyperpolarization — a STRONGER than normal stimulus is required. Allows directional propagation.

**All-or-none law:** Once threshold is reached, action potential amplitude is fixed — it does not vary with stimulus intensity. Stimulus intensity is encoded by the FREQUENCY of action potentials (rate coding).

## Propagation and Conduction Velocity

Action potentials propagate along the axon by a sequential depolarization of adjacent membrane regions. Conduction velocity is determined by:

**Axon diameter:** Larger diameter = lower resistance = faster conduction. Large myelinated Aα fibers (proprioception, motor): 70-120 m/s; Small unmyelinated C fibers (pain, temperature): 0.5-2 m/s.

**Myelination:** Myelin (produced by oligodendrocytes in CNS, Schwann cells in PNS) wraps the axon in concentric lipid layers, greatly increasing membrane resistance and decreasing capacitance between nodes of Ranvier. Action potentials **jump from node to node** (saltatory conduction), dramatically increasing speed while reducing energy cost.

**Nodes of Ranvier:** The unmyelinated gaps in the myelin sheath where Na+ channels are densely concentrated — the only sites where ionic current flows across the membrane in myelinated fibers.

**Clinical relevance of demyelination:** Multiple sclerosis (MS) — immune-mediated destruction of CNS myelin produces slowed, blocked, or fatigued conduction → sensory symptoms, weakness, optic neuritis, ataxia, cognitive impairment. Symptoms worsen with heat (Uhthoff's phenomenon).

## Synaptic Integration

**EPSP (Excitatory Postsynaptic Potential):** Depolarizing graded potential produced when excitatory transmitters (glutamate) open cation channels (Na+, K+). Brings membrane closer to threshold.

**IPSP (Inhibitory Postsynaptic Potential):** Hyperpolarizing (or stabilizing at resting potential) graded potential produced when inhibitory transmitters (GABA) open Cl- channels. Moves membrane away from threshold.

**Spatial summation:** Multiple simultaneous EPSPs from different synaptic locations summate algebraically at the axon hillock. Simultaneous IPSPs and EPSPs cancel.

**Temporal summation:** Rapidly successive EPSPs from a single synapse summate if each arrives before the previous one has decayed (~5-15 ms). Allows high-frequency presynaptic firing to trigger postsynaptic action potentials.

**Inhibitory control:** IPSPs are critical for sculpting neural activity — they prevent runaway excitation (as in epilepsy), shape the timing and pattern of action potentials, and enable signal-to-noise ratio improvement. Feedforward and feedback inhibition are core circuit motifs.

## The Synapse and Neurotransmitter Release

**Synaptic structure:** The synapse consists of the presynaptic terminal, synaptic cleft (~20 nm wide), and postsynaptic density with receptor proteins. The active zone of the presynaptic terminal is where vesicle docking and fusion occur.

**Synaptic vesicle cycle:**
1. Neurotransmitter synthesis and loading into vesicles (via vesicular transporters)
2. Vesicle docking and priming at the active zone (via SNARE proteins: synaptobrevin, SNAP-25, syntaxin)
3. Action potential arrives → voltage-gated Ca2+ channels open → Ca2+ influx
4. Ca2+ binds synaptotagmin → triggers SNARE complex formation → vesicle fusion → exocytosis
5. Neurotransmitter diffuses across cleft → binds postsynaptic receptors
6. Termination: reuptake (monoamines), enzymatic degradation (ACh), or diffusion
7. Vesicle membrane retrieved by endocytosis → refilled and recycled

## Glial Cells

Glia are non-neuronal cells that support, protect, and modulate neural function. They outnumber neurons by approximately 10:1.

| Cell Type | Location | Primary Functions |
|-----------|----------|------------------|
| Astrocytes | CNS | Structural support; BBB maintenance (end-feet); glutamate reuptake; K+ buffering; synaptogenesis; glucose supply; neuroinflammation |
| Oligodendrocytes | CNS | Myelin production (each can myelinate 50+ axon segments) |
| Schwann cells | PNS | Myelin production (one cell myelinates one axon segment); nerve regeneration guidance |
| Microglia | CNS | Resident immune cells; surveying brain; phagocytosis of debris and synapses; cytokine release in neuroinflammation |
| Ependymal cells | Ventricular walls | CSF production and circulation; barrier between CSF and brain parenchyma; cilia generate CSF flow |

## The Tripartite Synapse

Astrocytes surrounding synapses (perisynaptic astrocytic processes) are not passive bystanders — they:
- Take up glutamate via GLAST/GLT-1 transporters (preventing excitotoxicity)
- Convert glutamate to glutamine and recycle it to neurons (glutamate-glutamine cycle)
- Release gliotransmitters (ATP, D-serine, glutamate) that modulate synaptic strength
- Regulate K+ concentration in the extracellular space after neuronal firing

This three-way interaction between pre- and postsynaptic neuron + astrocyte is the "tripartite synapse."

## Long-Term Potentiation (LTP) and Long-Term Depression (LTD)

**LTP:** Persistent (hours to days) increase in synaptic strength following high-frequency stimulation. The canonical mechanism:
1. High-frequency presynaptic firing releases glutamate
2. AMPA receptors depolarize the postsynaptic membrane
3. Sufficient depolarization removes the Mg2+ block from NMDA receptors
4. Na+ and Ca2+ enter through NMDA receptors (Ca2+ is the key trigger)
5. Ca2+ activates CaMKII → phosphorylates existing AMPA receptors (increased conductance) AND triggers insertion of new AMPA receptors (increased number)
6. Late LTP: protein synthesis, structural changes in dendritic spines (enlarged spine heads, new spines)

LTP requires both pre- and postsynaptic activity simultaneously — the NMDA receptor acts as a **molecular coincidence detector** for Hebbian plasticity ("neurons that fire together, wire together").

**LTD:** Persistent decrease in synaptic strength following low-frequency stimulation — involves dephosphorylation and endocytosis (removal) of AMPA receptors from the synapse. LTD is important for synaptic refinement, motor learning, and adaptive forgetting.

## Blood-Brain Barrier (BBB)

The BBB is a critical selective permeability barrier protecting the brain from circulating toxins, pathogens, and immune cells. It is formed by:
- Specialized brain endothelial cells with tight junctions (occludins, claudins, ZO proteins) — no transcellular pores
- Astrocyte end-feet surrounding capillaries (maintaining BBB integrity, not a physical barrier themselves)
- Pericytes embedded in the basement membrane

**Substances that cross the BBB:**
- Lipid-soluble (non-polar) molecules: O2, CO2, alcohol, anesthetics, many drugs
- Small uncharged molecules: water, glucose (via GLUT1)
- Specifically transported: amino acids, vitamins, certain drugs

**Substances blocked:** Most hydrophilic drugs, proteins, many toxins, immune cells (except during neuroinflammation)

**Circumventricular organs (CVOs):** Areas lacking a complete BBB (area postrema, subfornical organ, OVLT) — allow the brain to monitor blood composition (osmolality, glucose, hormones, toxins).

**Clinical relevance:** Drug delivery to the CNS is a major challenge — many effective systemic drugs don't penetrate the BBB. Strategies include prodrugs (levodopa → dopamine), nanoparticles, focused ultrasound BBB opening, and lipid encapsulation.

## Neuroplasticity and Neurogenesis

**Adult neurogenesis** (ongoing production of new neurons) occurs in two regions:
1. **Subgranular zone (SGZ)** of the dentate gyrus (hippocampus) — new granule cells that integrate into hippocampal circuits, important for pattern separation and memory
2. **Subventricular zone (SVZ)** — new neurons migrate to the olfactory bulb via the rostral migratory stream

Adult neurogenesis is promoted by: exercise, environmental enrichment, learning, antidepressants. It is inhibited by: stress, sleep deprivation, alcohol, aging.

**Synaptic pruning:** During development (~postnatal through adolescence), excess synapses are eliminated in an activity-dependent manner. Microglia engulf complement-tagged synapses. This pruning refines neural circuits — over-pruning is implicated in schizophrenia; under-pruning may relate to autism spectrum disorder.

## Neurodevelopmental Timeline

- **Weeks 3-4:** Neural tube formation (neurulation) — failure → anencephaly, spina bifida
- **Weeks 6-24:** Peak cortical neurogenesis in the ventricular zone; neurons migrate along radial glia
- **Inside-out pattern:** Deepest cortical layers (V, VI) form first; layers II/III form last
- **Postnatal:** Myelination begins; continues through 3rd decade of life (frontal lobes last)
- **Critical/sensitive periods:** Windows of heightened plasticity (e.g., language before puberty, vision columns in infancy)

## Neurodegeneration Mechanisms

Common pathways in neurodegeneration:
- **Protein aggregation:** Misfolded proteins (Aβ, tau, alpha-synuclein, TDP-43, FUS) resist degradation, form toxic oligomers and aggregates
- **Mitochondrial dysfunction:** Reduced ATP production, increased ROS generation
- **Neuroinflammation:** Microglial activation and astrogliosis — protective initially but chronically damaging
- **Excitotoxicity:** Excess glutamate → sustained NMDA receptor activation → Ca2+ overload → cell death
- **Apoptosis vs. necrosis:** Apoptosis = programmed, orderly cell death via caspases; necrosis = disordered cell death from acute injury, triggers inflammation`
    },
    {
      topicId: T["Neurotransmitters & Synaptic Transmission"],
      title: "Neurotransmitters & Synaptic Transmission — Study Guide",
      content: `## Overview of Neurotransmission

Chemical synaptic transmission is the primary means of neuron-to-neuron communication in the brain. When an action potential arrives at the axon terminal, voltage-gated Ca2+ channels open, Ca2+ enters, and neurotransmitter-filled vesicles fuse with the presynaptic membrane (exocytosis). The neurotransmitter (NT) diffuses across the ~20 nm synaptic cleft and binds postsynaptic receptors. Transmission is terminated by reuptake (monoamines), enzymatic degradation (ACh), or diffusion.

Neurotransmitters must meet criteria: synthesized in neurons, released by neurons, act on specific receptors, and have a mechanism of inactivation. There are two functional classes: classical small-molecule NTs (amino acids and monoamines) and neuropeptides.

## Amino Acid Neurotransmitters

### Glutamate — The Primary Excitatory NT

Glutamate is the most abundant excitatory NT in the CNS — present in approximately 80% of synapses. It is synthesized from glutamine (via glutaminase) or from the Krebs cycle (α-ketoglutarate → glutamate via transamination).

**Glutamate receptors:**

| Receptor | Type | Mechanism | Key Role |
|----------|------|-----------|----------|
| AMPA | Ionotropic | Na+/K+ channel — fast depolarization | Routine synaptic transmission |
| NMDA | Ionotropic | Ca2+/Na+/K+ — requires depolarization + ligand + glycine co-agonist | LTP, coincidence detection |
| Kainate | Ionotropic | Na+/K+ — modulate transmission | Epilepsy susceptibility |
| mGluR (Group I) | Metabotropic (Gq) | PLC → IP3 + DAG → Ca2+, PKC | Modulation; synaptic plasticity |
| mGluR (Group II/III) | Metabotropic (Gi) | ↓ cAMP — autoreceptors | Presynaptic inhibition |

The **NMDA receptor** is the molecular coincidence detector — it requires simultaneous glutamate binding AND postsynaptic depolarization (to remove the Mg2+ block that plugs the channel at resting potential) AND glycine/D-serine co-agonist. This dual gating makes it ideal for detecting correlated pre- and postsynaptic activity (Hebbian learning). The resulting Ca2+ influx triggers LTP.

**Excitotoxicity:** Excessive glutamate (from ischemia, TBI, seizures) → sustained NMDA receptor activation → massive Ca2+ overload → mitochondrial damage, ROS generation, and neuronal apoptosis/necrosis.

**Clinical relevance:** NMDA antagonists (ketamine, memantine, PCP) block the receptor. Ketamine at sub-anesthetic doses produces rapid antidepressant effects (esketamine/Spravato FDA-approved for treatment-resistant depression). PCP (phencyclidine) at recreational doses produces schizophrenia-like psychosis — supporting the glutamate hypothesis of schizophrenia. Memantine is used in moderate-severe Alzheimer's disease to reduce excitotoxic burden.

### GABA — The Primary Inhibitory NT

γ-Aminobutyric acid (GABA) is the main inhibitory NT in the CNS — synthesized from glutamate via glutamate decarboxylase (GAD), requiring pyridoxal phosphate (B6 derivative).

**GABA-A receptor:** Ionotropic pentameric Cl- channel (5 subunits: typically 2α, 2β, 1γ or δ). GABA binding opens the channel → Cl- influx → hyperpolarization (or shunting inhibition). Key allosteric modulation sites:
- **Benzodiazepine site** (between α and γ subunits): BZDs increase FREQUENCY of Cl- channel opening → anxiolytic, sedative, anticonvulsant, muscle relaxant effects
- **Barbiturate site** (β subunit): barbiturates increase DURATION of channel opening; at high doses, open without GABA — making overdose more dangerous
- **Alcohol site:** Ethanol potentiates GABA-A; acute intoxication mimics BZD effects; withdrawal = GABA-A hypoactivity = seizures/delirium tremens
- **Neurosteroid site:** Endogenous neurosteroids (allopregnanolone) also potentiate GABA-A — basis for brexanolone (postpartum depression treatment)

**GABA-B receptor:** Metabotropic (Gi-coupled) — located on presynaptic terminals (reduces NT release as autoreceptor) and postsynaptic membranes (activates K+ channels → slower, longer-lasting hyperpolarization). Baclofen (GABA-B agonist) treats spasticity.

### Glycine

Glycine is the primary inhibitory NT in the brainstem and spinal cord — acts on glycine-gated Cl- channels. Strychnine (rat poison) is a glycine receptor antagonist → produces convulsions and spastic paralysis. Glycine is also the co-agonist of NMDA receptors (different binding site) — here it is excitatory (permissive for NMDA opening).

## Monoamine Neurotransmitters

Monoamines are synthesized from amino acid precursors, released from small networks of neurons that diffusely project throughout the brain — exerting neuromodulatory (slow, widespread, state-setting) rather than point-to-point information transfer effects.

### Dopamine (DA)

**Synthesis:** Tyrosine → L-DOPA (via tyrosine hydroxylase, TH — the rate-limiting enzyme, a key regulatory target) → Dopamine (via DOPA decarboxylase/AAAD). Stored in vesicles by VMAT2.

**Inactivation:** Reuptake by DAT (dopamine transporter — blocked by cocaine, methylphenidate); metabolized by MAO-A/B → DOPAC → HVA, or COMT → 3-MT.

**Receptors:** D1-like (D1, D5): Gs → ↑ cAMP → PKA activation — excitatory; D2-like (D2, D3, D4): Gi → ↓ cAMP — inhibitory. D2 is the primary antipsychotic target.

**The Four DA Pathways:**

| Pathway | Origin | Destination | Function | Clinical Relevance |
|---------|--------|-------------|----------|--------------------|
| Mesolimbic | VTA | Nucleus accumbens (NAc) | Reward, motivation, emotional salience | Addiction, positive symptoms of schizophrenia |
| Mesocortical | VTA | Prefrontal cortex | Executive function, working memory | Negative/cognitive symptoms of schizophrenia |
| Nigrostriatal | SNc | Striatum (caudate/putamen) | Motor control, habit learning | Parkinson's disease (cell loss), EPS from antipsychotics |
| Tuberoinfundibular | Hypothalamus | Anterior pituitary | Inhibits prolactin secretion | Antipsychotic-induced hyperprolactinemia |

### Serotonin (5-Hydroxytryptamine, 5-HT)

**Synthesis:** Tryptophan → 5-Hydroxytryptophan (5-HTP) via tryptophan hydroxylase (rate-limiting) → Serotonin via AAAD.

**Origin:** Raphe nuclei (dorsal and median raphe) in the brainstem — project throughout the brain (cortex, basal ganglia, limbic system, cerebellum, spinal cord).

**Inactivation:** Reuptake by SERT (serotonin transporter — blocked by SSRIs); metabolized by MAO-A → 5-HIAA (measured in urine as serotonin metabolite marker).

**Functions:** Mood regulation, impulse control, sleep (promotes NREM), appetite suppression, cognitive flexibility, social behavior. Serotonin deficiency is associated with depression, anxiety, OCD, and impulsive aggression.

**14 receptor subtypes (5-HT1 through 5-HT7):** Most are Gq or Gi metabotropic; 5-HT3 is the only ionotropic serotonin receptor (Na+/K+ channel — antiemetic drugs like ondansetron block it).

### Norepinephrine (NE / Noradrenaline)

**Synthesis:** Dopamine → NE via dopamine-β-hydroxylase (DBH). Released from sympathetic postganglionic neurons (PNS) and from the locus coeruleus (LC) in the CNS.

**Locus coeruleus:** Small bilateral nucleus in the pons — the largest source of noradrenergic innervation in the CNS; projects diffusely to the entire brain. LC fires maximally during waking/arousal, slowly during NREM, and is silent during REM.

**Functions:** Arousal, attention, vigilance, fight-or-flight stress response, mood, memory consolidation. Implicated in PTSD (hyperactivation), depression (deficiency), and ADHD (PFC NE hypofunction).

**Receptors:** α1 (Gq — vasoconstriction, cognition), α2 (Gi — presynaptic autoreceptor, lowers NE release; also postsynaptic in PFC), β1/2 (Gs — cardiac effects, memory). Alpha-2 agonists (clonidine, guanfacine) reduce NE release and are used for PTSD, hypertension, and ADHD.

### Acetylcholine (ACh)

**Synthesis:** Choline + Acetyl-CoA via choline acetyltransferase (ChAT) — choline uptake is rate-limiting.

**Inactivation:** Enzymatic degradation in the synapse by acetylcholinesterase (AChE) → acetate + choline. AChE inhibitors (donepezil, rivastigmine, galantamine) used in Alzheimer's disease. Organophosphates (nerve agents, pesticides) irreversibly inhibit AChE → cholinergic crisis.

**Receptor types:**
- **Nicotinic (nAChR):** Ionotropic — permeable to Na+, K+, Ca2+; at NMJ (muscle-type), in autonomic ganglia, and in CNS (VTA, cortex); blocked by curare/succinylcholine; activated by nicotine → addiction.
- **Muscarinic (mAChR):** Metabotropic — M1 (Gq, cortex — cognition), M2 (Gi, heart — slows rate), M3 (Gq, smooth muscle/glands — secretion). Blocked by anticholinergics (atropine, scopolamine, antihistamines, TCAs) → dry mouth, urinary retention, constipation, tachycardia, confusion.

**CNS cholinergic systems:** Basal forebrain — nucleus basalis of Meynert (NBM), diagonal band, medial septum — project to cortex and hippocampus, modulating attention, memory, and arousal. These neurons degenerate in Alzheimer's disease, providing the rationale for AChEI treatment.

## Histamine

Histamine is synthesized from histidine (via histidine decarboxylase) in the tuberomammillary nucleus (TMN) of the posterior hypothalamus — the only source of CNS histamine. Histaminergic neurons fire maximally during waking and are silent during sleep; histamine promotes wakefulness. H1 blockers (antihistamines: diphenhydramine, hydroxyzine, mirtazapine) are sedating because they cross the BBB and block histamine's waking effects.

## Neuropeptides

Neuropeptides are chains of amino acids (3-50) synthesized in the cell body and transported to terminals — they are typically co-released with classical NTs at high firing frequencies and have slower, longer-lasting neuromodulatory effects.

**Opioid peptides:**
- Beta-endorphin: μ receptor — pain relief, euphoria (released during exercise, stress, orgasm)
- Enkephalins: μ and δ receptors — pain modulation in spinal cord dorsal horn
- Dynorphins: κ receptor — analgesia, dysphoria, stress responses

**Opioid receptors (all Gi-coupled):**
- μ (Mu): analgesia, euphoria, respiratory depression, constipation, physical dependence — target of morphine, heroin, fentanyl, buprenorphine
- κ (Kappa): analgesia, dysphoria, sedation — target of nalbuphine, dynorphin
- δ (Delta): analgesia, mood modulation

**Substance P:** Tachykinin released from C-fibers in the dorsal horn → NK1 receptor → pain transmission. NK1 antagonists are antiemetics (aprepitant).

**Neuropeptide Y (NPY):** Most abundant brain peptide — orexigenic (increases appetite); anxiolytic effects. High in arcuate nucleus; released in response to fasting/ghrelin.

**Orexin/Hypocretin:** Lateral hypothalamus neurons; promote wakefulness, reward, and appetite. Loss of orexin neurons causes narcolepsy type 1.

**Oxytocin and ADH (vasopressin):** Synthesized in hypothalamus (PVN), released from posterior pituitary — act centrally as neuromodulators in addition to peripheral hormonal effects.

## Second Messenger Systems

**cAMP pathway (Gs → adenylate cyclase → cAMP → PKA):** Activated by D1/D5 dopamine, β-adrenergic, 5-HT4/6/7, glucagon, histamine H2. PKA phosphorylates ion channels, transcription factors (CREB), and AMPA receptors — important for memory consolidation.

**PLC pathway (Gq → PLC → IP3 + DAG → Ca2+ release + PKC):** Activated by M1/M3 muscarinic, α1-adrenergic, 5-HT2, mGluR Group I, histamine H1. DAG activates PKC; IP3 releases Ca2+ from ER stores.

**cGMP pathway:** Activated by nitric oxide → guanylate cyclase → cGMP → PKG. Important in smooth muscle relaxation and synaptic signaling (retrograde NO messenger in LTP).

## Retrograde Signaling: Endocannabinoids

Endocannabinoids (anandamide, 2-AG) are synthesized on-demand in the postsynaptic neuron (from membrane phospholipids) — they are released into the synapse and travel backward to bind presynaptic CB1 receptors, reducing NT release (depolarization-induced suppression of inhibition, DSI, or excitation, DSE). This retrograde signaling allows the postsynaptic neuron to regulate its own input.

**Clinical relevance:** Cannabis (THC is a CB1 partial agonist) disrupts this fine-tuned modulation — impairing memory consolidation (hippocampal CB1 blockade of GABA/glutamate balance), increasing appetite, and producing anxiolytic or anxiogenic effects depending on dose and context.

## Nitric Oxide (NO) as a Neuromodulator

NO is synthesized from L-arginine by neuronal NOS (nNOS), activated by Ca2+/calmodulin (after Ca2+ entry via NMDA receptors). As a gas, NO diffuses freely across membranes — it is a retrograde messenger in LTP (diffuses back to strengthen the presynaptic terminal). NO also regulates cerebrovascular tone (vasodilation via smooth muscle cGMP).

## CYP450 Enzymes in Psychopharmacology

The cytochrome P450 (CYP450) enzyme family in the liver metabolizes most psychotropic drugs. Key isoforms:

| Enzyme | Drugs Metabolized | Important Interactions |
|--------|------------------|----------------------|
| CYP2D6 | Many antidepressants, antipsychotics, opioids | Poor metabolizers get toxicity; fluoxetine/paroxetine inhibit it |
| CYP3A4 | Benzodiazepines, carbamazepine, most antipsychotics | Inhibited by ketoconazole, erythromycin; induced by rifampin, carbamazepine |
| CYP1A2 | Clozapine, olanzapine, caffeine, theophylline | Induced by smoking (important: hospitalized patients who quit smoking need dose adjustment) |
| CYP2C19 | Citalopram, escitalopram, diazepam | Poor metabolizers need lower SSRI doses |`
    },
    {
      topicId: T["Sensory Pathways"],
      title: "Sensory Pathways — Study Guide",
      content: `## Overview of Sensory Pathways

The nervous system uses highly organized pathways to transmit sensory information from the periphery to the cerebral cortex. Each pathway has three (or sometimes more) neuron chains, crosses the midline at specific points, and terminates in dedicated cortical areas. Understanding these pathways allows precise localization of lesions based on patterns of sensory loss.

The key principle: WHERE the pathway crosses the midline determines whether a lesion produces ipsilateral or contralateral deficits.

## The Dorsal Column-Medial Lemniscal (DCML) Pathway

**What it carries:** Fine touch (discriminative), vibration, two-point discrimination, joint position sense (proprioception), and conscious proprioception.

**First-order neuron:** Peripheral receptor → dorsal root ganglion cell → enters spinal cord → ascends IPSILATERALLY in the dorsal columns:
- **Fasciculus gracilis** (medial): lower limb and lower trunk (sacral/lumbar fibers)
- **Fasciculus cuneatus** (lateral): upper limb and upper trunk (thoracic/cervical fibers)

**Second-order neuron:** Synapse in the nucleus gracilis or cuneatus (medulla) → axons **cross the midline** (internal arcuate fibers = sensory decussation in the medulla) → ascend in the medial lemniscus → terminate in the VPL nucleus of the thalamus.

**Third-order neuron:** VPL thalamus → internal capsule (posterior limb) → primary somatosensory cortex (S1, postcentral gyrus) — somatotopically organized.

**Clinical lesion pattern:** A dorsal column lesion produces ipsilateral (same side as lesion) loss of fine touch, proprioception, and vibration BELOW the lesion. The deficits appear ipsilateral because the pathway has not yet crossed.

## The Spinothalamic Tract (Anterolateral System)

**What it carries:** Pain (nociception), temperature (thermal), and crude touch/pressure.

**First-order neuron:** Peripheral nociceptors/thermoreceptors → dorsal root ganglion → enters spinal cord → synapses in the dorsal horn (laminae I, II for pain/temperature; V for WDR neurons).

**Second-order neuron:** Immediately **crosses the midline** via the anterior white commissure (just anterior to the central canal) → ascends in the CONTRALATERAL anterolateral white matter:
- **Lateral spinothalamic tract:** Pain and temperature
- **Anterior spinothalamic tract:** Crude touch and pressure
→ Terminates in the VPL nucleus of the thalamus.

**Third-order neuron:** VPL thalamus → S1 cortex.

**Clinical lesion pattern:** A spinothalamic lesion produces contralateral loss of pain and temperature BELOW the lesion level (because it crossed immediately in the cord). 

## Brown-Séquard Syndrome: The Teaching Case

Brown-Séquard syndrome results from hemisection (half-transection) of the spinal cord. It demonstrates the different crossing levels of the DCML and spinothalamic pathways:

| Deficit | Side | Pathway Explanation |
|---------|------|---------------------|
| Fine touch, proprioception, vibration loss | Ipsilateral (same side as lesion) | DCML uncrossed in cord — crosses in medulla above lesion |
| Pain and temperature loss | Contralateral (opposite side) | Spinothalamic crosses immediately — lost from opposite side below lesion |
| UMN weakness | Ipsilateral | Corticospinal tract crosses in medulla — lost ipsilateral below lesion |
| LMN weakness (at lesion level only) | Ipsilateral | Local anterior horn cell destruction |

This pattern of ipsilateral DCML loss + contralateral spinothalamic loss is pathognomonic for Brown-Séquard.

## Other Important Spinal Cord Syndromes

**Complete cord transection:** Bilateral loss of ALL sensation and voluntary motor function below the lesion. Bladder/bowel dysfunction. Spinal shock initially (flaccidity, areflexia) → evolves to spastic paraplegia/quadriplegia with UMN signs.

**Syringomyelia:** A fluid-filled cavity within the spinal cord — destroys the anterior white commissure first. Selective bilateral loss of pain and temperature at the lesion level (crossing spinothalamic fibers destroyed) with preserved DCML sensation. "Cape distribution" across shoulders/arms. Associated with Arnold-Chiari malformation.

**Subacute Combined Degeneration (SCD):** Vitamin B12 deficiency — demyelination of dorsal columns (proprioception/vibration loss) AND corticospinal tracts (UMN signs). Both ipsilateral because both affected tracts are ipsilateral before they cross.

**Anterior Cord Syndrome:** Damage to the anterior 2/3 of the cord (e.g., from anterior spinal artery occlusion) — bilateral loss of pain/temperature (spinothalamic) and motor function (corticospinal) BELOW lesion, with PRESERVED proprioception and vibration (dorsal columns posterior, spared).

**Central Cord Syndrome:** Damage to the central cord (e.g., hyperextension in the elderly) — classically sacral sparing (outermost fibers), with arms weaker than legs (arm fibers more central in CST), and variable sensory loss.

**Cauda Equina Syndrome:** Below L1-L2 (where the cord ends) — compression of the cauda equina (lumbosacral nerve roots). LMN signs (flaccidity, areflexia, atrophy), saddle anesthesia, bilateral leg weakness, bladder/bowel/sexual dysfunction. Surgical emergency.

## The Corticospinal Tract (Descending Motor)

**Origin:** Primary motor cortex (M1, precentral gyrus) and premotor/supplementary motor areas → descend through the corona radiata → posterior limb of the internal capsule → cerebral peduncles (midbrain) → pons (divided by pontine nuclei) → pyramids of the medulla → **cross at the pyramidal decussation (caudal medulla)** → lateral corticospinal tract → anterior horn cells (lower motor neurons) → neuromuscular junction → muscles.

A small fraction (~15%) remains uncrossed as the anterior corticospinal tract — controls axial muscles bilaterally.

**Motor homunculus:** Somatotopic organization in M1 (precentral gyrus) — inverted body representation: leg/foot medially (near interhemispheric fissure), arm/hand and face laterally. The hand (especially thumb and index finger) and face/tongue occupy disproportionately large areas, reflecting their fine motor control demands.

**UMN vs. LMN Lesion Signs:**

| Feature | UMN Lesion | LMN Lesion |
|---------|-----------|-----------|
| Tone | Increased (spasticity) | Decreased (flaccidity) |
| Reflexes | Hyperreflexia, clonus | Hyporeflexia/areflexia |
| Pathologic reflexes | Babinski sign positive | No Babinski |
| Muscle bulk | Minimal atrophy initially | Rapid atrophy + fasciculations |
| Location of lesion | Brain/spinal cord (above anterior horn) | Anterior horn/nerve root/NMJ/muscle |

## The Basal Ganglia Motor Circuit

The basal ganglia modulate thalamo-cortical output through direct and indirect pathways:

**Direct pathway (facilitates movement):**
Cortex → Striatum (D1 receptors) → Internal Globus Pallidus (GPi) / SNr → INHIBITED → Thalamus (VA/VL) → RELEASED (less inhibited) → Cortex → Motor output FACILITATED
Dopamine via D1 receptors FACILITATES the direct pathway (excites striatum → inhibits GPi).

**Indirect pathway (inhibits movement):**
Cortex → Striatum (D2 receptors) → External Globus Pallidus (GPe) → INHIBITED → Subthalamic Nucleus (STN) → RELEASED (less inhibited) → GPi → EXCITED → Thalamus → INHIBITED → Cortex → Motor output SUPPRESSED
Dopamine via D2 receptors INHIBITS the indirect pathway (inhibits striatum → disinhibits GPe → inhibits STN → reduces GPi activity).

**Parkinson's disease:** Loss of SNc dopamine → direct pathway down (less movement facilitation) AND indirect pathway up (more movement suppression) → NET RESULT: excessive GPi activity, excessive thalamic inhibition → bradykinesia, rigidity, akinesia.

**Hemiballism:** Lesion of the contralateral STN (e.g., from lacunar infarct) → STN cannot excite GPi → reduced GPi output → thalamus disinhibited → wild flinging movements of one arm/leg.

## The Cerebellum: Sensorimotor Coordination

The cerebellum does not initiate movement — it compares motor commands (efference copy from motor cortex) with actual movement (proprioceptive feedback) and sends corrective signals.

**Anatomical organization:**
- **Vestibulocerebellum** (flocculonodular lobe): Balance and eye movement — connected to vestibular nuclei
- **Spinocerebellum** (vermis + intermediate hemispheres): Limb and trunk coordination, gait — receives spinocerebellar tracts
- **Cerebrocerebellum** (lateral hemispheres): Motor planning, timing — connected to cortex via red nucleus and thalamus

**DANISH signs of cerebellar dysfunction:**
- Dysdiadochokinesia — impaired rapid alternating movements
- Ataxia — gait ataxia (wide-based, staggering)
- Nystagmus — rapid involuntary eye movements
- Intention tremor — tremor worsens as limb approaches target
- Slurred speech (Scanning/dysarthria)
- Hypotonia — decreased muscle tone
Cerebellar deficits are IPSILATERAL to the lesion (unlike cerebral cortex deficits which are contralateral).

## Thalamic Relay Nuclei

The thalamus is the brain's relay and integration hub — nearly all sensory information (except smell) passes through specific thalamic nuclei before reaching the cortex:

| Nucleus | Afferent Input | Cortical Target | Function |
|---------|---------------|----------------|---------|
| VPL | Spinal cord/medial lemniscus (body somatosensory) | S1 (postcentral gyrus) | Body touch, pain, proprioception |
| VPM | Trigeminal nucleus (face), NTS (taste) | S1, insula | Face touch, taste |
| LGN | Optic tract (visual) | V1 (calcarine cortex) | Vision |
| MGN | Inferior colliculus (auditory) | A1 (Heschl's gyri) | Hearing |
| VA/VL | Basal ganglia, cerebellum | Motor cortex, premotor | Motor control |
| MD | Frontal lobe, limbic | PFC | Executive, emotion, memory |
| Anterior | Mammillary bodies (Papez circuit) | Cingulate cortex | Emotion, memory |
| Pulvinar | Superior colliculus, visual cortex | Posterior association cortex | Visual attention |

**Thalamic infarcts** can produce profound, unusual syndromes — mediodorsal thalamic infarct produces dense amnesia (Korsakoff-like); posterolateral infarct produces Dejerine-Roussy syndrome (thalamic pain syndrome with burning allodynia).

## Cranial Nerves and Their Pathways

While a full cranial nerve review is a separate topic, key points for sensory pathway understanding:

**CN V (Trigeminal):** Three divisions (V1 ophthalmic, V2 maxillary, V3 mandibular) carry face sensation → trigeminal sensory nucleus (pontine chief nucleus for fine touch; spinal trigeminal nucleus for pain/temperature) → VPM thalamus → S1.

**CN VII (Facial):** Motor to facial muscles; taste from anterior 2/3 tongue → chorda tympani → NTS.

**CN VIII (Vestibulocochlear):** Cochlear division: spiral ganglion → cochlear nucleus → superior olive → inferior colliculus → MGN → A1. Vestibular division: vestibular ganglion → vestibular nuclei → cerebellum + thalamus.

**CN IX (Glossopharyngeal):** Taste from posterior 1/3 tongue, carotid body/sinus → NTS.

**CN X (Vagus):** Visceral sensory from thorax/abdomen → NTS; taste from epiglottis.`
    },
    {
      topicId: T["Sensory Systems"],
      title: "Sensory Systems — Study Guide",
      content: `## The Visual System

Vision is the dominant human sense, occupying approximately 30% of the neocortex in its processing.

### Retinal Organization

The retina contains photoreceptors, bipolar cells, ganglion cells, and supporting cells:

**Photoreceptors:**
- **Rods:** ~120 million, concentrated in the periphery, extremely light-sensitive (scotopic/dim light vision), contain rhodopsin, no color discrimination. The fovea has NO rods.
- **Cones:** ~6 million, concentrated in the fovea centralis (100% cones at fovea center), require bright light (photopic vision), provide color discrimination (S/M/L-cone types for blue/green/red wavelengths) and high spatial acuity.

The fovea has the highest density of cones, the smallest receptive fields, and a direct connection to large ganglion cells — providing maximal visual acuity. Peripheral vision is primarily rod-based and used for motion detection.

### Retinal Ganglion Cells and the Optic Pathways

Retinal ganglion cells (RGCs) have two major types:
- **Magnocellular (M-cells / parasol RGCs):** Large, fast-conducting, motion-sensitive — project to M-layers of LGN → dorsal visual stream
- **Parvocellular (P-cells / midget RGCs):** Small, slow, color/form sensitive — project to P-layers of LGN → ventral visual stream

**Visual pathway:**
Retina → Optic nerve (CN II) → Optic chiasm (nasal fibers from each retina CROSS; temporal fibers remain ipsilateral) → Optic tract → LGN (lateral geniculate nucleus of thalamus) → Optic radiation → V1 (primary visual cortex, calcarine fissure)

**Key crossing at the optic chiasm:** The nasal half of each retina (which receives the temporal visual field) crosses at the chiasm. This means:
- Left visual field → both left eyes' temporal retina + right eyes' nasal retina → right optic tract → right LGN → right V1
- Right visual field → right eyes' temporal retina + left eyes' nasal retina → left optic tract → left LGN → left V1

### Visual Field Defects and Their Localization

| Location of Lesion | Visual Field Defect | Examples |
|-------------------|---------------------|---------|
| Optic nerve | Monocular blindness (one eye) | Optic neuritis (MS), optic nerve glioma |
| Optic chiasm | Bitemporal hemianopia (tunnel vision) | Pituitary adenoma compressing chiasm |
| Optic tract | Contralateral homonymous hemianopia | MCA stroke |
| Temporal lobe (Meyer's loop) | Contralateral superior quadrantanopia ('pie in the sky') | Temporal lobe surgery |
| Parietal lobe (optic radiation) | Contralateral inferior quadrantanopia | Parietal stroke |
| Occipital lobe (V1) | Contralateral homonymous hemianopia + macular sparing | PCA stroke (macular cortex dual supply) |
| Bilateral V1 | Cortical blindness | Bilateral PCA occlusion, CO poisoning |

### The Dorsal and Ventral Visual Streams

After V1, visual processing divides into two major streams:

**Ventral stream ("what" pathway):** V1 → V2 → V4 → inferotemporal (IT) cortex
- Processes object identity, color, shape, and face recognition
- Damage → visual agnosias, prosopagnosia, achromatopsia (color blindness from cortical lesion)

**Dorsal stream ("where/how" pathway):** V1 → V2 → V5/MT → posterior parietal cortex (PPC)
- Processes spatial location, motion, and visual guidance of action
- Damage → optic ataxia (misdirected reaching), neglect, simultanagnosia, akinetopsia (inability to perceive motion)

### The Auditory System

Sound waves → tympanic membrane → ossicles (malleus, incus, stapes) → oval window → cochlea (basilar membrane vibrates).

**Tonotopy (place coding):** High-frequency sounds (4,000+ Hz) vibrate the stiff BASE of the basilar membrane; low-frequency sounds vibrate the flexible APEX. This frequency-to-place mapping is preserved throughout the auditory pathway — every relay nucleus and auditory cortex is tonotopically organized.

**Auditory pathway:**
Cochlear hair cells (inner hair cells transduce mechanical to electrical) → cochlear nerve (spiral ganglion cells) → Cochlear nucleus (ipsilateral, in pons) → Superior olive (BILATERAL — first site of binaural integration; used for sound localization via interaural time and intensity differences) → Inferior colliculus (midbrain) → Medial geniculate nucleus (MGN, thalamus) → Primary auditory cortex (A1, Heschl's gyri, superior temporal plane)

**Note:** Auditory pathways are BILATERALLY represented from the level of the superior olive — unilateral lesions above the cochlear nucleus rarely cause significant hearing loss in a single ear. Complete deafness from a unilateral central lesion is very rare; bilateral deafness from unilateral cortex is almost impossible.

**Presbycusis:** Age-related sensorineural hearing loss — progressive loss of cochlear hair cells, especially at high frequencies; treated with hearing aids or cochlear implants.

### The Somatosensory System

Primary somatosensory cortex (S1) in the postcentral gyrus (Brodmann areas 3a, 3b, 1, 2) receives VPL thalamic input and maps the body somatotopically (sensory homunculus). 3b receives cutaneous input (touch), 3a receives deep input (proprioception/muscle spindles), areas 1 and 2 receive more complex integrated somatosensory information.

**Cutaneous mechanoreceptors:**

| Receptor | Location | Adaptation | Detects |
|----------|----------|-----------|---------|
| Meissner's corpuscle | Fingertips, lips | Rapidly adapting | Flutter vibration (10-50 Hz), slip/texture, object manipulation |
| Merkel's disc | Fingerprints, lips, genitalia | Slowly adapting | Fine spatial detail, form, sustained pressure |
| Pacinian corpuscle | Deep dermis/subcutaneous, joints | Very rapidly adapting | High-frequency vibration (100-300 Hz), transmitted vibration |
| Ruffini's ending | Deep dermis | Slowly adapting | Skin stretch, joint rotation, warmth |
| Free nerve endings | Everywhere | Variable | Pain, temperature, itch, crude touch |

**Two-point discrimination:** Tests the spatial resolution of mechanoreception — the minimum distance at which two separate stimuli are perceived as distinct. Highest acuity at the fingertips (~2 mm), poorest on the back (~70 mm), reflecting receptor density and cortical magnification factor. Impaired by S1 lesions.

**Proprioception receptors:**
- **Muscle spindles:** Detect muscle stretch — Ia afferents (velocity, diameter 12-20 μm, myelinated) and II afferents (static stretch). Gamma motor neurons control spindle sensitivity (intrafusal fibers).
- **Golgi tendon organs (GTOs):** At the muscle-tendon junction — detect muscle tension via Ib afferents. High tension activates Ib → autogenic inhibition (prevents tendon damage), relaxing the same muscle.
- **Joint receptors (Ruffini, Pacinian in joint capsule):** Static joint position and movement.

### The Vestibular System

The vestibular apparatus in the inner ear detects head position and motion:

**Semicircular canals (3 pairs: horizontal, anterior, posterior):** Detect rotational (angular) acceleration in three planes. Hair cells within the ampulla detect endolymph flow caused by head rotation — the crista ampullaris.

**Otolith organs:**
- **Utricle:** Horizontal plane — detects linear horizontal acceleration and gravity (static head tilt)
- **Saccule:** Vertical plane — detects vertical linear acceleration (elevators, jumping)

**Vestibular pathway:** Vestibular ganglion (Scarpa's ganglion) → vestibular nuclei (brainstem) → cerebellum (flocculonodular) for balance; → thalamus → insular/parietal cortex for spatial orientation; → spinal cord (vestibulospinal tract for posture); → CN III/IV/VI nuclei (VOR — vestibulo-ocular reflex) for eye movement compensation.

**BPPV (Benign Paroxysmal Positional Vertigo):** Most common cause of vertigo — displaced otoconia (calcium carbonate crystals) settle in the semicircular canal (usually posterior), falsely signaling head rotation. Brief, intense vertigo on head position change. Treated by repositioning maneuvers (Dix-Hallpike diagnosis; Epley maneuver treatment).

### The Olfactory System

**Unique properties:** The olfactory system is the ONLY sensory modality that:
1. Does NOT relay through the thalamus before reaching cortex
2. Has direct synaptic connections to limbic structures (amygdala, piriform cortex)

**Olfactory pathway:** Olfactory receptor neurons (in nasal epithelium, replaced every 30-60 days) → axons form olfactory nerve (CN I) → olfactory bulb (first relay, glomeruli) → olfactory tract → primary olfactory cortex (piriform cortex, anterior insular) and amygdala

**Clinical relevance:** Loss of smell (anosmia) — from head trauma (shearing of olfactory nerves at cribriform plate), viral infections (COVID-19, post-infectious anosmia), or Alzheimer's/Parkinson's (early marker). Kallmann syndrome: anosmia + hypogonadotropic hypogonadism (olfactory bulb aplasia + GnRH neuron migration failure).

The direct limbic connection explains why odors powerfully evoke emotional memories (Proust phenomenon) — this is due to direct olfactory→amygdala→hippocampal pathways bypassing cortical filtering.

### Pain: Nociception and Modulation

**Nociceptors and fiber types:**
- C fibers (unmyelinated, 0.5-2 m/s): Slow burning pain, temperature, itch — polymodal (respond to multiple stimuli)
- Aδ fibers (thin myelinated, 5-30 m/s): First/sharp pain, cold temperature
- Aβ fibers (thick myelinated, 30-70 m/s): Touch and pressure (normally non-painful)

**Gate Control Theory (Melzack and Wall, 1965):** Substantia gelatinosa (lamina II) interneurons can "gate" pain transmission — activation of large-diameter Aβ fibers (touch) excites inhibitory interneurons that suppress C/Aδ fiber signals at the dorsal horn. This explains why rubbing or vibrating an injured area reduces pain.

**Descending pain modulation:** The periaqueductal gray (PAG) of the midbrain is the central hub for endogenous analgesia — activated by stress, opioids, and placebo. PAG → rostroventromedial medulla (RVM) → dorsal horn → releases NE and 5-HT to inhibit pain transmission. Serotonin/NE reuptake inhibitors (SNRIs) enhance this descending inhibition.

**Central sensitization:** After sustained nociceptive input, spinal dorsal horn neurons become hyperexcitable (wind-up, LTP in pain circuits) — the AMPA receptor response increases and NMDA receptors mediate amplification. This is the neurological basis of chronic pain disorders, fibromyalgia, and phantom limb pain.

**Hyperalgesia vs. allodynia:**
- Hyperalgesia: Exaggerated pain from normally painful stimuli (increased gain)
- Allodynia: Pain from normally non-painful stimuli (threshold shift — Aβ activation becomes painful via central sensitization)

### The Taste System (Gustation)

Taste buds (on tongue papillae, soft palate, epiglottis) contain chemoreceptor cells detecting the five basic tastes: sweet, salty, sour, bitter, and umami (savory/glutamate).

**Taste pathway:**
- Anterior 2/3 tongue → CN VII (chorda tympani branch)
- Posterior 1/3 tongue → CN IX (glossopharyngeal)
- Epiglottis → CN X (vagus)
→ All converge on the nucleus tractus solitarius (NTS) in the medulla
→ NTS → VPM thalamus (taste-specific region, VPMpc)
→ Primary gustatory cortex (insular/frontal opercular cortex)

Taste is heavily integrated with olfaction (retronasal olfaction contributes 80% of what we perceive as flavor). Combined gustatory-olfactory damage is common in COVID-19.`
    },
    {
      topicId: T["Limbic System & Motivation"],
      title: "Limbic System & Motivation — Study Guide",
      content: `## The Limbic System: Overview

The term "limbic system" (from Latin limbus = border) describes a collection of cortical and subcortical brain structures forming a ring around the brainstem. Originally proposed by MacLean (1952) as a "visceral brain" subserving emotion and motivation, the limbic system is now understood more broadly as a network supporting emotion, memory, social behavior, motivation, and homeostatic regulation.

**Core limbic structures:**
- Hippocampus and parahippocampal region (episodic memory, spatial navigation)
- Amygdala (emotional valuation, fear, social cognition)
- Hypothalamus (homeostatic drives, HPA axis, ANS control)
- Anterior cingulate cortex (conflict monitoring, pain, motivation)
- Posterior cingulate cortex (self-referential thought, default mode network)
- Orbitofrontal cortex (reward valuation, decision-making)
- Septal nuclei (reward, social behavior)
- Fornix, mammillary bodies, anterior thalamus (Papez circuit)

## The Hippocampus: Memory Formation and Spatial Navigation

The hippocampus is a curved, seahorse-shaped structure in the medial temporal lobe — present bilaterally. Its primary role is in **episodic memory encoding** (forming new declarative memories) and **spatial navigation** (cognitive mapping).

**Hippocampal subfields:**
- **Dentate gyrus (DG):** Receives input from the entorhinal cortex via the perforant path; site of adult neurogenesis; critical for pattern separation (distinguishing similar memories)
- **CA3:** Receives DG input via mossy fibers; has extensive recurrent connections (Schaffer collaterals to CA1); supports pattern completion and associative memory
- **CA1:** Receives CA3 input via Schaffer collaterals; receives direct entorhinal input via temporoammonic pathway; primary output to subiculum
- **Subiculum:** Major output zone → entorhinal cortex → neocortex (memory consolidation)
- **Entorhinal cortex:** The gateway between hippocampus and neocortex — converges multimodal input and receives grid cell input (spatial coordinates)

**Pattern separation vs. pattern completion:**
- Pattern separation (DG): Distinguishing similar experiences as distinct memories (e.g., remembering today's lunch from yesterday's)
- Pattern completion (CA3): Reconstructing a full memory from partial cues (e.g., recognizing a place from a fragment of it)

**HM (Henry Molaison):** The most important patient in memory neuroscience — bilateral hippocampal/medial temporal lobectomy for intractable epilepsy produced:
- Profound anterograde amnesia (could not form new episodic memories)
- Intact remote memory for events before surgery (memory is consolidated to neocortex over time)
- Intact immediate (working) memory
- Intact procedural/motor learning (could learn mirror drawing)
- Intact priming
This demonstrated the hippocampus is required for episodic memory formation but NOT for immediate memory or implicit learning.

## The Papez Circuit: Memory and Emotion

James Papez (1937) proposed a neural circuit for emotion that includes:
**Hippocampus → Fornix → Mammillary bodies (hypothalamus) → Anterior thalamus → Cingulate cortex → Entorhinal cortex → Hippocampus**

The fornix is the major white matter output tract of the hippocampus — damage (from colloid cysts, surgery, trauma) can cause anterograde amnesia.

**Clinical relevance:** Korsakoff's syndrome damages the mammillary bodies and dorsomedial thalamus — interrupting the Papez circuit → profound anterograde amnesia and confabulation.

## Types of Memory

**Explicit (declarative) memory:** Requires conscious recollection
- **Episodic memory:** Personally experienced events with temporal-spatial context ("remembering") — hippocampus-dependent; first lost in Alzheimer's disease
- **Semantic memory:** General factual knowledge independent of personal experience ("knowing") — distributed in temporal association cortex; selectively impaired in semantic dementia

**Implicit (non-declarative) memory:** Does not require conscious recall
- **Procedural memory (habits and skills):** Motor learning (riding a bike, tying shoes) — basal ganglia and cerebellum; spared in Alzheimer's and amnestic syndromes
- **Priming:** Facilitated processing of previously encountered stimuli without conscious recognition — right hemisphere neocortex; spared in amnesia
- **Classical conditioning:** Learned emotional/autonomic responses to conditioned stimuli — amygdala (emotional conditioning), cerebellum (eye-blink conditioning)
- **Habituation and sensitization:** Non-associative learning — mediated by local reflex circuits

## The Amygdala: Emotional Valuation and Fear

The amygdala (almond-shaped) sits in the anterior medial temporal lobe — its two main subdivisions have distinct functions:

**Basolateral amygdala (BLA):** Receives sensory input from cortex and thalamus — the BLA is the site of fear memory formation (CS-US association). It assigns emotional significance (salience) to stimuli. The BLA projects to:
- Central nucleus (fear expression)
- PFC (modulates emotional cognition)
- Hippocampus (emotional memory modulation)

**Central nucleus (CeA):** The output of the amygdala — drives fear expression via projections to:
- Hypothalamus (autonomic responses: heart rate increase, blood pressure)
- PAG (freezing behavior)
- Locus coeruleus (NE release, arousal)
- Brainstem motor nuclei (facial fear expression)

**Fear conditioning:** Pairing a neutral stimulus (CS: a tone) with an aversive stimulus (US: a foot shock) → CS alone elicits fear responses (CR). The BLA learns the CS-US association; the CeA drives the fear responses. LeDoux's two routes to the amygdala:
- "High road": CS → Cortex → Thalamus → Amygdala — slower, allows cortical processing
- "Low road": CS → Thalamus → Amygdala directly — faster (40 ms), allows rapid threat response before full conscious processing

**Extinction:** Repeated CS presentation without the US gradually reduces conditioned fear — extinction involves new inhibitory learning (the original fear memory is suppressed, not erased) mediated by the vmPFC inhibiting the BLA. Context-dependency of extinction explains why fear returns in the original context (renewal effect) — the basis of exposure therapy limitations.

**Klüver-Bucy syndrome:** Bilateral amygdalectomy in rhesus monkeys → emotional placidity (no fear), hyperorality (putting objects in mouth), hypersexuality, visual agnosia, dietary changes. In humans (herpes encephalitis, trauma, surgery): similar features, docility, inappropriate approach behavior.

## The Hypothalamus: Homeostasis and Drive States

The hypothalamus is a small structure (~4g) forming the floor of the diencephalon — despite its small size, it controls all homeostatic and survival drives.

**Hypothalamic nuclei and functions:**

| Nucleus | Location | Function |
|---------|----------|---------|
| Lateral hypothalamus (LH) | Lateral zone | Hunger/feeding center; orexin/hypocretin neurons (wakefulness, reward) |
| Ventromedial hypothalamus (VMH) | Medial zone | Satiety center; sexual behavior |
| Arcuate nucleus | Mediobasal | NPY/AgRP (orexigenic), POMC/CART (anorexigenic); GnRH; TRH |
| Paraventricular nucleus (PVN) | Medial | CRH (stress), oxytocin, ADH; ANS control |
| Supraoptic nucleus (SON) | Lateral | ADH, oxytocin production |
| Preoptic area | Anterior | Thermoregulation, sexual differentiation, sleep (VLPO) |
| Suprachiasmatic nucleus (SCN) | Anterior | Master circadian clock |
| Posterior hypothalamus | Posterior | Wakefulness (histamine, orexin); body temperature regulation |

**Feeding regulation:**
- Ghrelin (stomach) → arcuate nucleus NPY/AgRP neurons → hunger
- Leptin (fat tissue) → arcuate nucleus POMC neurons → satiety
- Lateral hypothalamus lesion → aphagia (refuses to eat), weight loss → starvation
- VMH lesion → hyperphagia (cannot stop eating), obesity

## The Reward System

**Mesolimbic dopamine system:** The nucleus accumbens (NAc) in the ventral striatum receives dopamine from the VTA and glutamate from the PFC, hippocampus, amygdala, and thalamus — it integrates motivational signals to drive reward-seeking behavior.

**Dopamine and reward prediction errors:** Dopamine neurons encode a reward prediction error signal (Schultz):
- Unexpected reward → dopamine burst (phasic)
- Expected reward received → no change
- Expected reward omitted → dopamine dip (negative prediction error)
This signal drives learning — updating the "value" of stimuli and actions based on their outcomes.

**Incentive salience vs. hedonic pleasure (Berridge):**
- "Wanting" (incentive salience) is driven by dopamine — the motivational drive to seek a reward
- "Liking" (hedonic pleasure) is driven by opioids and endocannabinoids in the NAc "hedonic hotspots"
- Addiction separates these: wanting increases dramatically while liking decreases — addicts crave but don't enjoy

**The orbitofrontal cortex (OFC):** Assigns subjective value to rewards by integrating sensory, emotional, and cognitive information — OFC lesions impair reversal learning (cannot update stimulus-reward associations when they change) and produce poor real-world decision-making (Iowa Gambling Task deficit).

## The Cingulate Cortex

**Anterior cingulate cortex (ACC):** Divided into dorsal ACC (dACC, area 24) and subgenual ACC (sgACC, area 25):
- dACC: Conflict monitoring (detects when responses conflict), error detection, pain (affective component), cognitive effort, motivation
- sgACC (area 25): Emotional regulation, depression (hyperactive in depression — the target of deep brain stimulation for treatment-resistant depression)

**Posterior cingulate cortex (PCC):** Core node of the **default mode network (DMN)** — active during rest, self-referential thought, episodic memory retrieval, and mind-wandering. Deactivated during focused attention. PCC is an early site of amyloid accumulation in Alzheimer's disease.

**Mid-cingulate cortex:** Motor function, response selection, error processing.

## Oxytocin, Social Behavior, and Attachment

Oxytocin (hypothalamus → posterior pituitary) is a key neuromodulator of social behavior:
- Promotes mother-infant bonding, pair-bonding (prairie voles), and trust
- Reduces amygdala reactivity to social threats
- Facilitates social approach, social memory, and affiliative behaviors
- Intranasal oxytocin is being researched for autism spectrum disorder (limited clinical efficacy so far)

**Attachment theory (Bowlby/Ainsworth):** The quality of early caregiver attachment (secure vs. insecure — anxious, avoidant, disorganized) shapes lifelong stress responses, social relationships, and mental health outcomes — mediated by early oxytocin system programming and HPA axis calibration.

## Hippocampus and Stress

**Cortisol and hippocampal damage:** The hippocampus expresses high levels of glucocorticoid receptors — initially, cortisol facilitates memory consolidation of stressful events (adaptive). With CHRONIC stress/cortisol elevation:
- Reduced BDNF and neurogenesis in the dentate gyrus
- Dendritic retraction in CA3 pyramidal neurons
- Reduced hippocampal volume (seen on MRI in depression, PTSD, Cushing's syndrome, childhood adversity)
- Impaired context-dependent learning and memory

This forms a vicious cycle: stress impairs hippocampal-based regulation of the HPA axis (hippocampus normally inhibits CRH), → worsening HPA dysregulation → more cortisol → more hippocampal damage.

## Default Mode Network (DMN)

The DMN is a large-scale brain network that is ACTIVE during rest and DEACTIVATED during focused external tasks. Core nodes: medial PFC, posterior cingulate cortex (PCC), angular gyrus, lateral temporal cortex, hippocampus. Functions: self-referential thought, mind-wandering, episodic memory, future planning, social cognition. The DMN is disrupted in Alzheimer's disease (PCC and medial PFC lose connectivity), schizophrenia (excessive DMN activity), depression, and autism.`
    },
    {
      topicId: T["Sleep & Circadian Rhythms"],
      title: "Sleep & Circadian Rhythms — Study Guide",
      content: `## Overview

Sleep is not simply a state of unconsciousness — it is an actively generated, highly organized brain state essential for health, cognition, and survival. It occupies approximately one-third of human life. Modern sleep science has revealed sleep's roles in memory consolidation, metabolic waste clearance, immune function, hormonal regulation, and emotional processing.

## Sleep Architecture and Staging

Sleep is divided into two primary states: NREM (non-rapid eye movement) and REM (rapid eye movement) sleep.

### NREM Sleep

**Stage N1 (5-10% of sleep):**
- Transitional light sleep — theta waves (4-7 Hz), slow rolling eye movements
- Easy to arouse; hypnagogic hallucinations and hypnic jerks may occur
- Transition from wakefulness to sleep

**Stage N2 (45-55% of sleep):**
- Hallmarks: **sleep spindles** (11-15 Hz bursts of activity, generated by reticular thalamic neurons — function: protecting sleep from external stimuli and facilitating procedural memory consolidation) and **K-complexes** (large biphasic waveforms triggered by external stimuli — serving as a brief arousal suppression mechanism)
- Medium-depth sleep; heart rate and body temperature begin to fall

**Stage N3 (15-25% of sleep, slow-wave sleep):**
- High-amplitude, low-frequency delta waves (0.5-4 Hz, >75 μV) — the "deepest" NREM stage
- Most restorative: tissue repair, growth hormone release (peak GH pulse occurs here), immune function
- Hardest to arouse from; stage of sleepwalking and sleep terrors
- Memory function: N3 slow oscillations drive hippocampal-neocortical dialogue (sharp-wave ripples + cortical slow oscillations + sleep spindles = a coordinated system for memory consolidation — transferring episodic memories from hippocampus to neocortex)

**NREM progression:** N3 predominates in the first 1/3 of the night; later cycles have progressively less N3.

### REM Sleep

**Characteristics:**
- **Desynchronized (activated) EEG:** Low-amplitude, mixed-frequency — closely resembles waking EEG
- **Rapid eye movements (REMs):** Conjugate bursts of horizontal eye movements
- **Complete skeletal muscle atonia:** Active inhibition from the brainstem (glycine/GABA inhibit spinal motor neurons) — prevents acting out dreams
- **Vivid, narrative dreaming:** Most vivid, emotional dreams occur here
- **Autonomic variability:** Heart rate and breathing become irregular; males experience penile erections

**PGO waves:** Ponto-geniculo-occipital electrical waves originate in the pontine brainstem during REM → propagate to LGN and occipital cortex — thought to generate dream imagery.

**Functions of REM sleep:**
- Emotional memory processing and regulation (amygdala-hippocampal reprocessing)
- Synaptic downscaling (synaptic homeostasis hypothesis — pruning over-potentiated synapses)
- Pattern extraction and creativity (loose associative thinking during REM may underlie insight)
- Procedural memory consolidation (motor learning, declarative memory integration)

**REM progression:** REM periods lengthen through the night — REM predominates in the last 1/3 of the night. The total sleep cycle of ~90 minutes reflects an ultradian rhythm.

### Normal Sleep Cycle Summary

A typical adult night: 7-9 hours, 4-6 90-minute cycles. Pattern:
N1 → N2 → N3 → N2 → REM (30-90 min) → N1/N2 → N3... Early night: N3-rich. Late night: REM-rich.

## Circadian Regulation

### The Suprachiasmatic Nucleus (SCN)

The SCN in the anterior hypothalamus is the master circadian clock — approximately 20,000 neurons that self-sustain a 24.2-hour (slightly longer than 24 hours) cycle, entrained daily by light.

**Retinohypothalamic tract (RHT):** Specialized ipRGCs (intrinsically photosensitive retinal ganglion cells) containing melanopsin respond to blue-wavelength light → directly project to the SCN → reset (entrain) the clock to the environmental light-dark cycle. The SCN then coordinates peripheral clocks throughout the body via hormonal (melatonin, cortisol) and neural (ANS) signals.

**The molecular clock:** CLOCK and BMAL1 proteins dimerize → activate transcription of PER (Period 1, 2, 3) and CRY (Cryptochrome 1, 2) genes → PER/CRY proteins accumulate, dimerize, and translocate to the nucleus → inhibit CLOCK/BMAL1 → their own transcription is suppressed → PER/CRY degrade → CLOCK/BMAL1 activity recovers → cycle repeats (~24 hours). This transcription-translation negative feedback loop is the molecular basis of circadian timing.

### Melatonin

Synthesized from serotonin in the pineal gland:
Serotonin → N-acetylserotonin (via AANAT) → Melatonin (via HIOMT)

The SCN drives sympathetic innervation to the pineal gland — melatonin secretion begins ~2 hours before habitual sleep onset (the dim-light melatonin onset, DLMO, is a reliable marker of circadian phase). Melatonin peaks around 2-3am and suppresses during daylight.

**Functions:** Circadian signal for darkness/nighttime (not a sleep hormone per se); shifts circadian phase (useful for jet lag, DSPS); antioxidant effects; immunomodulatory.

**Clinical uses:** Low-dose melatonin (0.5-1 mg) ~5 hours before desired bedtime for DSPS or jet lag. Higher doses (3-10 mg) are commonly used as sleep aids but have modest direct hypnotic effects.

### Cortisol Rhythm

Cortisol (from the adrenal cortex) follows a robust circadian rhythm — peaks in the early morning (cortisol awakening response, CAR, ~30-45 minutes after waking) and reaches a nadir around midnight. The morning cortisol surge promotes alertness, gluconeogenesis, and immune activation. This is driven by the SCN → PVN → sympathetic nervous system → adrenal cortex.

## Two-Process Model of Sleep Regulation (Borbély, 1982)

This is the dominant model explaining sleep timing and depth:

**Process S (Sleep Homeostasis):** A buildup of sleep pressure during wakefulness — primarily mediated by adenosine (a byproduct of ATP metabolism accumulating extracellularly during neuronal activity). Adenosine builds up in the basal forebrain and promotes sleep by inhibiting arousal-promoting cholinergic and orexin neurons. Sleep clears adenosine, reducing sleep pressure.

**Caffeine** is an adenosine receptor antagonist (A1 and A2A receptors) — it blocks the sleep pressure signal without actually reducing adenosine. When caffeine wears off, accumulated adenosine surges (the "crash").

**Process C (Circadian Drive):** The SCN generates a circadian wake-promoting signal that OPPOSES sleepiness during the day — preventing us from falling asleep despite accumulating sleep pressure. At night, the circadian drive for wakefulness wanes, allowing sleep pressure to dominate.

**The wake-maintenance zone (WMZ):** In the early evening (~6-8 pm), both sleep pressure (Process S) and circadian wake drive (Process C) are high — making this a paradoxically difficult time to sleep despite fatigue (the "forbidden zone for sleep").

## The Flip-Flop Switch: Wake/Sleep Transitions

The sleep-wake switch is modeled as a mutually inhibitory interaction (flip-flop) between:
- **Sleep-promoting:** VLPO (ventrolateral preoptic area) — GABAergic/galaninergic neurons in the anterior hypothalamus actively inhibit arousal centers during sleep
- **Wake-promoting:** Multiple ascending arousal system nodes: LC (NE), Raphe (5-HT), TMN (histamine), VTA (DA), basal forebrain (ACh), lateral hypothalamus (orexin)

Each side inhibits the other — creating a stable bistable switch that rapidly transitions between full sleep and full wakefulness (avoiding drowsy intermediate states for an animal that must respond to threats).

**Orexin's role in the switch:** Orexin/hypocretin neurons in the lateral hypothalamus stabilize the wake side of the switch — providing tonic excitation to all arousal-promoting systems. Without orexin, the switch is unstable, randomly flipping between sleep and wake during the day → narcolepsy.

## Wakefulness-Promoting Brain Systems

| System | Nucleus | NT | Function |
|--------|---------|-----|---------|
| Noradrenergic | Locus coeruleus | NE | Alertness, attention, stress |
| Serotonergic | Dorsal raphe | 5-HT | Arousal, mood regulation |
| Histaminergic | Tuberomammillary | Histamine | Cortical arousal — antihistamines are sedating |
| Cholinergic | Basal forebrain, LDT/PPT | ACh | Cortical activation, REM generation |
| Dopaminergic | VTA | DA | Motivation, arousal |
| Orexinergic | Lateral hypothalamus | Orexin | Switch stabilizer, appetite |

## Major Sleep Disorders

### Insomnia Disorder
Most prevalent sleep disorder — difficulty initiating or maintaining sleep, or early morning awakening, causing daytime impairment; for ≥3 nights/week for ≥3 months.

**3P Model (Spielman):** Predisposing factors (anxiety, hyperarousal trait) + Precipitating factors (stress, medical illness) + Perpetuating factors (maladaptive beliefs, extended time in bed, irregular schedule) → chronic insomnia.

**CBT-I (Cognitive-Behavioral Therapy for Insomnia):** First-line treatment — components include:
- Sleep restriction therapy (limits time in bed to match actual sleep time, building sleep pressure)
- Stimulus control (bed only for sleep/sex; get up if awake >20 min)
- Sleep hygiene (consistent wake time, limit caffeine/alcohol, dark cool environment)
- Relaxation techniques
- Cognitive restructuring (address catastrophic beliefs about sleep loss)
CBT-I is more effective than medication long-term.

### Narcolepsy

**Type 1 (with cataplexy):** Loss of orexin-producing neurons in the lateral hypothalamus (autoimmune basis — HLA-DQB1*06:02; post-influenza/H1N1 vaccination cases) → flip-flop switch instability.
Symptoms: Excessive daytime sleepiness (EDS), cataplexy (sudden bilateral muscle weakness/atonia triggered by strong positive emotions — laughter, excitement), sleep paralysis, hypnagogic/hypnopompic hallucinations, fragmented nighttime sleep.
Diagnosis: MSLT showing mean sleep latency <8 min with ≥2 SOREMPs; CSF orexin <110 pg/mL is pathognomonic.
Treatment: Stimulants (modafinil, amphetamines) for EDS; sodium oxybate (GHB) for cataplexy + EDS + nighttime sleep; venlafaxine/SSRIs for cataplexy.

**Type 2 (without cataplexy):** EDS + ≥2 SOREMPs on MSLT; normal orexin levels; milder form.

### REM Sleep Behavior Disorder (RBD)

Absence of normal REM muscle atonia → patients physically act out vivid (often violent) dreams — punching, kicking, shouting, injuring themselves or partners. Confirmed by PSG showing REM without atonia.

**Critical clinical importance:** Idiopathic RBD is a powerful prodromal marker for synucleinopathies (Parkinson's disease, DLB, MSA) — >80% of RBD patients develop one of these diseases within 10-15 years. RBD may precede motor symptoms by decades.

### Obstructive Sleep Apnea (OSA)

Recurrent upper airway collapse during sleep → apnea episodes → oxygen desaturation → arousals → fragmented sleep.

**Risk factors:** Obesity, male sex, age, macroglossia, retrognathia, large tonsils.

**Cognitive consequences:** Impaired sustained attention, working memory, executive function, and increased dementia risk. Mechanism: intermittent hypoxia + sleep fragmentation → neuroinflammation, oxidative stress, hippocampal damage.

**Diagnosis:** Polysomnography (PSG) — apnea-hypopnea index (AHI): ≥5 = mild, ≥15 = moderate, ≥30 = severe.

**Treatment:** CPAP (continuous positive airway pressure) — gold standard; mandibular advancement devices for mild-moderate OSA; positional therapy; weight loss; surgery (UPPP, hypoglossal nerve stimulation).

### Circadian Rhythm Sleep-Wake Disorders

- **Delayed Sleep Phase Syndrome (DSPS):** Circadian clock delayed → can only fall asleep late (2-6 am), cannot rise early. Common in adolescents; treated with morning bright light + evening melatonin + sleep restriction.
- **Advanced Sleep Phase Syndrome (ASPS):** Circadian clock advanced → falls asleep early evening, wakes very early. Common in elderly.
- **Non-24-hour sleep-wake disorder:** Free-running circadian clock (most common in totally blind individuals who lack light input to SCN).
- **Shift work disorder:** Misalignment between work schedule and circadian clock → insomnia, excessive sleepiness.
- **Jet lag:** Rapid transmeridian travel → misalignment; eastward travel (advancing clock) is harder than westward.

## Sleep and Memory Consolidation

**Declarative memory (hippocampus-dependent):** NREM sleep (especially N3) promotes consolidation through hippocampal-neocortical dialogue:
- During N3: Hippocampal sharp-wave ripples (SWR) replay recently encoded memories
- These SWR are coupled with cortical slow oscillations and thalamic sleep spindles in a precise temporal sequence
- This "memory replay" gradually transfers episodic memories to long-term neocortical storage

**Procedural/motor memory:** REM sleep and N2 sleep spindles promote motor sequence learning — the quantity of sleep spindles correlates with motor learning consolidation.

**Emotional memory:** REM sleep specifically processes emotional memories — the "sleep to forget, sleep to remember" hypothesis (Walker): REM strips the emotional charge from memories while preserving the content. This is disrupted in PTSD (fragmented REM, early awakening).

## Sleep and the Glymphatic System

During NREM sleep, the interstitial space between brain cells expands by ~60% and CSF flows more rapidly through perivascular channels (the glymphatic system) — clearing metabolic waste products including amyloid-beta and tau proteins. This clearance is ~10x more efficient during sleep than during waking. Chronic sleep deprivation reduces glymphatic clearance → accumulation of Aβ → potential acceleration of Alzheimer's pathology.`
    },
    {
      topicId: T["Endocrine System & Reproduction"],
      title: "Endocrine System & Reproduction — Study Guide",
      content: `## Overview of the Neuroendocrine System

The endocrine system and the nervous system work in concert to regulate virtually all aspects of physiology and behavior. The hypothalamus is the master integrator — it receives information from the brain, blood, and visceral organs, and coordinates endocrine output through the pituitary gland. This chapter covers the major hypothalamic-pituitary axes, sex hormones and the brain, stress physiology, and the organizational/activational framework for hormonal brain effects.

## Hypothalamic Control

The hypothalamus regulates the anterior pituitary through releasing and inhibiting hormones delivered via the hypothalamic-pituitary portal system (a short portal blood supply directly connecting hypothalamic neurons to pituitary cells):

| Hypothalamic Hormone | Effect on Pituitary | Anterior Pituitary Hormone | Target Organ | End Product |
|---------------------|--------------------|-----------------------------|-------------|------------|
| TRH (Thyrotropin-releasing) | Stimulates | TSH | Thyroid | T3, T4 |
| CRH (Corticotropin-releasing) | Stimulates | ACTH | Adrenal cortex | Cortisol, androgens |
| GnRH (Gonadotropin-releasing) | Stimulates | FSH + LH | Gonads | Sex hormones, gametes |
| GHRH (Growth hormone-releasing) | Stimulates | GH | Liver/Tissues | IGF-1 |
| Somatostatin | Inhibits | GH (and TSH) | — | — |
| Dopamine | Inhibits | Prolactin | — | — |

## The Posterior Pituitary

Unlike the anterior pituitary (which produces its own hormones under hypothalamic control), the posterior pituitary (neurohypophysis) STORES and RELEASES hormones produced in the hypothalamus:

**Oxytocin** (produced in the PVN and SON):
- Peripheral: stimulates uterine contractions during labor, milk let-down during breastfeeding
- Central: promotes social bonding, mother-infant attachment, pair bonding, trust, and sexual behavior; reduces amygdala reactivity to social threats
- Secreted in pulses during orgasm in both sexes

**ADH (Antidiuretic Hormone / Vasopressin)** (produced in SON and PVN):
- Peripheral: acts on V2 receptors in kidney collecting ducts → water reabsorption (antidiuresis); V1 receptors → vasoconstriction
- Central: V1a receptors in the brain → memory, social behavior, aggression; V1b in pituitary → modulates HPA axis

**SIADH (Syndrome of Inappropriate ADH secretion):** Excess ADH → hyponatremia → neurological symptoms (confusion, seizures). Causes: CNS lesions, pulmonary disease, SSRIs.
**Diabetes insipidus:** ADH deficiency → inability to concentrate urine → polydipsia/polyuria → hypernatremia.

## The HPA Axis: Stress Response

The hypothalamic-pituitary-adrenal (HPA) axis is the body's primary stress-response system:

**CRH (from the paraventricular nucleus)** → portal system → anterior pituitary → **ACTH** (adrenocorticotropic hormone, derived from POMC, the same precursor as beta-endorphin and MSH) → bloodstream → adrenal cortex → **Cortisol** (glucocorticoid)

**Cortisol actions:** Mobilizes glucose (gluconeogenesis), anti-inflammatory (short-term), immunosuppressive (chronic), promotes arousal and alertness, enhances memory consolidation for emotional/stressful events.

**Negative feedback:** Cortisol feeds back to INHIBIT both CRH (at hypothalamus) and ACTH (at pituitary) secretion — rapidly shutting off the stress response once the threat is resolved. The hippocampus (rich in glucocorticoid receptors) also drives this feedback.

### Dexamethasone Suppression Test

Administration of dexamethasone (a synthetic glucocorticoid) should suppress cortisol production via HPA feedback. **Non-suppression** (cortisol remains high) indicates HPA dysregulation — seen in:
- Melancholic/severe depression
- Cushing's disease/syndrome
- Chronic stress
- PTSD (paradoxically, some PTSD patients show hyper-suppression/enhanced feedback due to sensitized GR)

### Chronic Stress and Hippocampal Damage

Prolonged cortisol exposure damages the hippocampus — the mechanism:
1. Excess glucocorticoids reduce BDNF expression
2. Suppress neurogenesis in the dentate gyrus
3. Cause dendritic retraction in CA3 pyramidal neurons
4. Impair glutamate reuptake (contributing to excitotoxicity)

→ Reduced hippocampal volume (demonstrated by MRI in depression, PTSD, Cushing's syndrome, early life adversity)
→ Impaired memory and spatial navigation
→ Reduced HPA feedback → worse HPA dysregulation (vicious cycle)

### Allostatic Load

"Wear and tear" from chronic stress and repeated HPA activation — cardiovascular disease (hypertension, atherosclerosis), metabolic disease (insulin resistance, obesity), immune dysfunction, hippocampal atrophy, and cognitive decline. Allostatic load is a mediating mechanism for the health consequences of chronic stress, poverty, and racism.

## Adrenal Gland Function

**Adrenal cortex (three layers):**
- **Zona glomerulosa (outermost):** Mineralocorticoids (aldosterone) — regulated by RAAS; kidney Na+ retention, K+ excretion, blood pressure regulation
- **Zona fasciculata (middle):** Glucocorticoids (cortisol) — regulated by ACTH/CRH; stress response, metabolism, immune function
- **Zona reticularis (innermost):** Adrenal androgens (DHEA, androstenedione) — regulated by ACTH; precursor to sex hormones

**Adrenal medulla (center):** Derived from neural crest (sympathetic ganglionic cells) — secretes catecholamines: epinephrine (80%) and norepinephrine (20%) directly into blood in response to sympathetic activation ("fight-or-flight"). Unlike adrenal cortex, medullary response is rapid (seconds).

**Cushing's syndrome:** Chronic excess cortisol — from exogenous glucocorticoids (iatrogenic, most common), pituitary adenoma (Cushing's disease, ACTH excess), adrenal tumor, or ectopic ACTH. Neuropsychological effects: hippocampal atrophy, memory impairment, depression/anxiety, cognitive slowing, emotional lability.

**Addison's disease (primary adrenal insufficiency):** Destruction of adrenal cortex (autoimmune most common) → cortisol and aldosterone deficiency. Neuropsychiatric effects: fatigue, depression, cognitive slowing, psychosis in severe deficiency. Treated with hydrocortisone + fludrocortisone.

**Congenital Adrenal Hyperplasia (CAH):** Most commonly 21-hydroxylase deficiency → cannot synthesize cortisol → ACTH rises (due to loss of feedback) → adrenal androgens oversynthesized → prenatal androgen excess. Girls with CAH show masculinized external genitalia, and studies show more male-typical play behavior, spatial cognition, and sexual orientation (organizational androgen effects).

## The HPT Axis: Thyroid and the Brain

**TRH (hypothalamus) → TSH (anterior pituitary) → Thyroid → T4 (inactive) → T3 (active, converted by deiodinase in peripheral tissues and brain)**

T3 binds intracellular nuclear receptors → regulates gene transcription.

**T3 and brain development:** Critical during fetal and neonatal development for:
- Myelination of CNS white matter
- Neuronal migration and differentiation
- Synaptogenesis and synaptic pruning

**Neonatal hypothyroidism (cretinism):** Untreated congenital hypothyroidism → severe intellectual disability, deaf-mutism, growth failure, and neurological deficits. Universal neonatal thyroid screening (PKU card test) is essential.

**Adult hypothyroidism:** Cognitive slowing ("myxedema brain"), memory impairment, depression, psychosis ("myxedema madness" in severe cases). Can mimic dementia (reversible). Treated with levothyroxine.

**Adult hyperthyroidism:** Anxiety, restlessness, emotional lability, tremor, heat intolerance. Graves' disease (autoimmune hyperthyroidism).

## Sex Hormones and the Brain

### Organizational vs. Activational Effects

**Organizational effects** (permanent, occur during sensitive developmental periods):
- Prenatal testosterone exposure masculinizes the brain during critical windows
- These effects are irreversible once the sensitive period closes
- Studied in CAH (excess prenatal androgens), androgen insensitivity syndrome (AIS), and digit ratio (2D:4D)
- The brain is "default female" — without androgen signaling, feminization occurs

**Activational effects** (transient, occur at any age when hormones are present):
- Testosterone in adult males: enhances spatial cognition, 3D mental rotation, risk-taking, libido, competitive behavior
- Estrogen in adult females: enhances verbal memory, executive function, mood; its loss at menopause → cognitive changes and increased AD risk

### Estrogen and the Brain

Estrogen (17β-estradiol) has widespread effects on the CNS:
- Promotes dendritic spine density and synaptogenesis (hippocampus most affected)
- Increases ACh synthesis (basal forebrain) and enhances cholinergic neurotransmission
- Supports serotonergic and dopaminergic system function
- Anti-inflammatory and neuroprotective effects
- Modulates HPA axis reactivity

**Menopause and cognition:** Estrogen decline → reduced cholinergic and serotonergic function → verbal memory and processing speed decline; increased Alzheimer's disease risk. Hormone replacement therapy (HRT) timing hypothesis: early postmenopausal HRT may be neuroprotective, but late HRT (>10 years after menopause) may increase risk.

### Testosterone and the Brain

- Higher testosterone → enhanced visuospatial ability (especially 3D rotation, mental rotation tasks)
- Testosterone influences amygdala and hypothalamic function → aggression, libido, dominance
- Male brains are exposed to a testosterone surge in the 2nd trimester (prenatal) and at puberty — organizational vs. activational effects
- Adult male testosterone deficiency (hypogonadism): depression, fatigue, reduced libido, cognitive decline, metabolic syndrome

### Prolactin

Secreted by anterior pituitary lactotrophs — primarily stimulated by suckling and suppressed by dopamine. Functions: stimulate milk production; regulate reproductive cycles (inhibits GnRH → anovulation/amenorrhea during breastfeeding).

**Hyperprolactinemia:** Excess prolactin — from dopamine antagonists (antipsychotics — D2 blockade → removes tonic DA inhibition of prolactin → prolactin rises), pituitary adenoma, hypothyroidism. Consequences: menstrual irregularity, galactorrhea, infertility, sexual dysfunction. Antipsychotics with lower prolactin elevation: quetiapine, clozapine, aripiprazole.

## Growth Hormone and IGF-1

GH (pituitary) is released in pulses — largest pulse during N3 sleep. GH acts on the liver to produce IGF-1 (insulin-like growth factor 1), which mediates most of GH's anabolic effects.

**GH deficiency in adults:** Fatigue, depression, decreased cognitive function, reduced lean mass and bone density, increased cardiovascular risk. Adult GH therapy can improve some of these outcomes.

**Ghrelin:** A "hunger hormone" from the stomach that also stimulates GH release — rise before meals (hunger signal); high in sleep deprivation (increasing appetite); also activates DA neurons in the VTA (rewarding properties).

## Puberty and Adolescent Brain Development

Rising sex hormones (GnRH pulse → LH/FSH → testosterone/estrogen) at puberty trigger:
- Second wave of synaptic overproduction followed by pruning
- Progressive myelination (PFC last to fully myelinate, completing into the mid-20s)
- Increased limbic system reactivity (heightened emotional sensitivity and reward-seeking)
- Relative imbalance between mature limbic/subcortical systems and still-maturing PFC → adolescent risk-taking, sensation-seeking, peer sensitivity, and emotional volatility
- Sleep architecture shifts: more N3, later DLMO → delayed sleep phase (adolescent "night owl" pattern is biological, not laziness)

## The Renin-Angiotensin-Aldosterone System (RAAS) and the Brain

The brain has its own RAAS — angiotensin II acts on circumventricular organs (not protected by BBB: subfornical organ, OVLT, area postrema) to drive thirst, sodium appetite, and vasopressin release. The central RAAS also modulates blood pressure regulation, stress responses, anxiety, and cognitive function.

**Angiotensin-converting enzyme (ACE) inhibitors and ARBs** cross the BBB and may have neuroprotective effects — ACE inhibitors are associated with reduced dementia risk in some observational studies (mechanism unclear, possibly reducing neuroinflammation and cerebrovascular damage).`
    },
    {
      topicId: T["Psychopharmacology"],
      title: "Psychopharmacology — Study Guide",
      content: `## Core Pharmacology Concepts

### Pharmacokinetics (ADME): What the Body Does to the Drug

**Absorption:** The process of a drug entering the bloodstream. Oral administration requires absorption from the GI tract. Rate depends on: lipophilicity, drug ionization (acid vs. base), GI motility, and formulation.

**Distribution:** Once in the bloodstream, drugs distribute to tissues. Volume of distribution (Vd) = Dose / Plasma concentration. A large Vd (e.g., diazepam, chlorpromazine) means the drug distributes extensively into tissues (lipophilic, high fat solubility). Drugs must be lipophilic to cross the blood-brain barrier.

**Protein binding:** Many drugs bind to plasma proteins (albumin, α1-acid glycoprotein). Only the UNBOUND (free) fraction is pharmacologically active. Highly protein-bound drugs (diazepam: 99%) have smaller free fraction — drug interactions that displace protein binding can cause toxicity.

**Metabolism:** Primarily hepatic (CYP450 enzymes). Phase I (oxidation/reduction/hydrolysis) → Phase II (conjugation: glucuronidation, sulfation, acetylation). The liver may also convert prodrugs to active forms (codeine → morphine via CYP2D6).

**Excretion:** Primarily renal (glomerular filtration, tubular secretion). Renal failure impairs clearance of renally excreted drugs (e.g., lithium — dangerous accumulation). Also: biliary/fecal excretion.

**First-pass effect:** Orally absorbed drugs pass through the liver before reaching systemic circulation — a fraction is metabolized, reducing bioavailability. High first-pass drugs: morphine (oral bioavailability ~25%), propranolol, lidocaine. IV administration bypasses first-pass.

**Half-life (t1/2):** Time for plasma concentration to fall by 50%. Drugs reach steady state after ~4-5 half-lives; similarly, they are cleared after ~4-5 half-lives after discontinuation. Clinical significance:
- Short t1/2 (e.g., triazolam): frequent dosing, more rebound/withdrawal risk
- Long t1/2 (e.g., fluoxetine t1/2 = 2-6 days; norfluoxetine = 7-15 days): less withdrawal, but drug interactions persist weeks after stopping

### Pharmacodynamics: What the Drug Does to the Body

**Agonist:** Binds receptor → activates it (mimics endogenous NT)
**Partial agonist:** Binds and activates but with less than maximal efficacy — at high doses, it displaces full agonists and reduces response (buprenorphine displaces full opioid agonists)
**Antagonist:** Binds without activating (competitive — can be overcome with more agonist; irreversible — cannot)
**Inverse agonist:** Binds and decreases baseline receptor activity
**Allosteric modulator:** Binds a different site, changing the receptor's response to its ligand (BZDs on GABA-A)

**Tolerance:** Reduced response to a drug with repeated administration — mechanisms: receptor downregulation, desensitization (uncoupling), increased metabolism (CYP induction), and behavioral tolerance.

**Dependence vs. addiction:** Physical dependence = physiological adaptation requiring drug to maintain homeostasis (withdrawal on discontinuation). Addiction (substance use disorder) = compulsive drug-seeking despite consequences — a complex brain disorder involving dopamine reward pathways.

## Antidepressants

### SSRIs (Selective Serotonin Reuptake Inhibitors)
**Mechanism:** Block SERT → increased synaptic serotonin
**Examples:** Fluoxetine (Prozac), sertraline (Zoloft), escitalopram (Lexapro), paroxetine (Paxil), citalopram (Celexa)
**Indications:** Depression, GAD, panic disorder, OCD, PTSD, social anxiety, PMDD
**Side effects:** Sexual dysfunction (most common long-term complaint), GI upset, initial agitation/anxiety, weight gain (long-term), hyponatremia (via SIADH, especially elderly), serotonin syndrome (with MAOIs)
**Onset:** 2-4 weeks for antidepressant effect (immediate neurobiological effects on serotonin, but downstream plasticity/BDNF changes take weeks)
**CYP interactions:** Fluoxetine and paroxetine are potent CYP2D6 inhibitors

### SNRIs (Serotonin-Norepinephrine Reuptake Inhibitors)
**Mechanism:** Block both SERT and NET
**Examples:** Venlafaxine (Effexor), duloxetine (Cymbalta), desvenlafaxine (Pristiq), levomilnacipran (Fetzima)
**Advantages over SSRIs:** Effective for neuropathic pain (duloxetine FDA-approved for diabetic neuropathy, fibromyalgia), broader efficacy in some SSRI non-responders
**Additional side effects:** Hypertension (NE vasoconstriction, especially high-dose venlafaxine), sweating, discontinuation syndrome (venlafaxine notorious — must taper slowly)

### TCAs (Tricyclic Antidepressants)
**Mechanism:** Block SERT + NET + multiple other receptors (H1, M1/M3, α1, Na+ channels)
**Examples:** Amitriptyline, nortriptyline, imipramine, clomipramine (OCD), desipramine
**Anticholinergic effects (M1/M3 blockade):** Dry mouth, urinary retention, constipation, blurred vision, tachycardia, confusion/delirium (in elderly)
**Lethality in overdose:** Na+ channel blockade → cardiac arrhythmia (wide QRS, QTc prolongation) → dangerous; not first-line due to safety profile
**Clinical uses now:** Neuropathic pain, migraine prophylaxis, insomnia (low-dose amitriptyline), OCD (clomipramine)

### MAOIs (Monoamine Oxidase Inhibitors)
**Mechanism:** Inhibit MAO enzyme → less catecholamine/serotonin breakdown → increased monoamines
**Irreversible:** Phenelzine, tranylcypromine (non-selective: inhibit both MAO-A and MAO-B)
**Reversible/selective:** Moclobemide (MAO-A inhibitor — RIMA; fewer dietary restrictions), selegiline (MAO-B inhibitor at low dose — used in Parkinson's; at higher doses inhibits MAO-A)
**Tyramine reaction (cheese reaction):** Tyramine (in aged cheese, wine, cured meat, fermented foods) is normally metabolized by MAO in the gut wall → with MAOIs blocking this, tyramine enters circulation → massive catecholamine release → hypertensive crisis (explosive headache, stroke risk). Requires tyramine-free diet.
**Serotonin syndrome (with other serotonergic drugs):** Hyperthermia, muscle rigidity, clonus, autonomic instability, mental status changes — a medical emergency.
**Indications:** Atypical depression (with reversed neurovegetative features), treatment-resistant depression

### Other Antidepressants
| Drug | Class | Unique Features |
|------|-------|----------------|
| Bupropion (Wellbutrin) | NDRI (NE+DA reuptake inhibitor) | No sexual side effects; also used for smoking cessation; lowers seizure threshold |
| Mirtazapine (Remeron) | α2/H1/5-HT2/3 antagonist | Sedating (H1), weight-promoting, no sexual SEs; good for insomnia/poor appetite |
| Vortioxetine (Trintellix) | Multimodal: SERT blocker + 5-HT1A agonist + 5-HT3/7 antagonist | Cognitive benefits; pro-serotonergic |
| Trazodone | 5-HT2A antagonist + weak SERT inhibitor | Highly sedating low-dose → used as non-habit-forming sleep aid |
| Esketamine (Spravato) | NMDA antagonist (intranasal) | Rapid-acting (hours); for TRD and MDD with acute suicidality; dissociative SE |

## Antipsychotics

**Dopamine hypothesis:** Positive symptoms of schizophrenia = excess mesolimbic DA. All effective antipsychotics block D2 receptors to some degree.

### Typical (First-Generation) Antipsychotics (FGAs)
**High-potency:** Haloperidol (Haldol), fluphenazine, thiothixene — potent D2 blockade → high EPS risk, low sedation
**Low-potency:** Chlorpromazine, thioridazine — less potent D2, more anticholinergic/antihistaminergic → more sedation, less EPS

**EPS (Extrapyramidal Symptoms — from nigrostriatal D2 blockade):**
- Acute dystonia (within hours-days): Sudden sustained muscle contractions (torticollis, oculogyric crisis) — treat with anticholinergic (benztropine)
- Akathisia (days-weeks): Subjective restlessness, inner need to move — treat with propranolol, BZD, dose reduction
- Drug-induced Parkinsonism (weeks): Bradykinesia, rigidity, tremor — treat with anticholinergic or dose reduction
- Tardive dyskinesia (months-years): Involuntary repetitive oro-facial-lingual movements from D2 receptor upregulation (supersensitivity) — may be irreversible; treat with VMAT2 inhibitors (valbenazine, deutetrabenazine)

### Atypical (Second-Generation) Antipsychotics (SGAs)
**Mechanism:** Block D2 + 5-HT2A (and variable effects on other receptors). Fast D2 dissociation ("loose binding") hypothesis may explain lower EPS.

| Drug | Key Receptor Profile | Notable Features |
|------|---------------------|-----------------|
| Clozapine | D4>D2, 5-HT2A, M, H1, α1 | Most effective for treatment-resistant schizophrenia; risk: agranulocytosis (requires WBC monitoring), seizures, weight gain, myocarditis |
| Olanzapine | D2, 5-HT2A, M, H1 | High metabolic syndrome risk (weight gain, diabetes, dyslipidemia) |
| Quetiapine | D2 (weak), 5-HT2A, H1, α1 | Low EPS; sedating; widely used for insomnia/anxiety off-label |
| Risperidone | D2, 5-HT2A, α1 | Moderate EPS risk; highest prolactin elevation of all SGAs |
| Aripiprazole | D2 partial agonist, 5-HT1A partial agonist | Low metabolic SE; activating (can worsen akathisia); weight-neutral |
| Ziprasidone | D2, 5-HT2A, α1, 5-HT/NE reuptake inhibitor | QTc prolongation risk; lowest metabolic effects |
| Lurasidone | D2, 5-HT2A, 5-HT7, α2C | FDA-approved for bipolar depression; must take with food |

## Mood Stabilizers

**Lithium:** The oldest and most proven mood stabilizer.
- Mechanisms: Inhibits inositol monophosphatase (depletes PIP2 signaling), inhibits GSK-3β, modulates gene expression/BDNF, neuroprotective
- Therapeutic range: 0.6-1.2 mEq/L (narrow therapeutic window!)
- Monitoring: Serum levels, renal function (lithium is renally excreted), thyroid (lithium causes hypothyroidism), EKG (T-wave changes)
- Toxicity: >1.5 mEq/L → tremor, ataxia; >2.0 → confusion, seizures; >2.5 → cardiac arrhythmia, death
- Drug interactions: NSAIDs, thiazides, ACE inhibitors → increase lithium levels (reduced renal clearance)
- Special advantage: Antisuicidal properties (reduces completed suicide by ~50% in bipolar disorder)

**Valproic acid (Valproate, Depakote):**
- Mechanisms: Na+ channel blockade (stabilizes neuronal membrane), ↑ GABA (inhibits GABA-T), histone deacetylase inhibition, modulates PKC
- Uses: Bipolar I mania (especially mixed features/rapid cycling), epilepsy (multiple types), migraine prophylaxis
- Side effects: Teratogenic (neural tube defects — requires folate supplementation, contraindicated in pregnancy), weight gain, hair loss, tremor, hepatotoxicity (rare), polycystic ovarian syndrome

**Lamotrigine (Lamictal):**
- Mechanism: Blocks voltage-gated Na+ channels → reduces glutamate release
- Particularly effective for: Bipolar depression (FDA-approved), bipolar maintenance, epilepsy
- Titration: Must be titrated VERY slowly over 6 weeks (rapid titration → Stevens-Johnson syndrome, a dangerous immune-mediated rash)
- Drug interaction: Valproate dramatically INCREASES lamotrigine levels (half the dose needed); carbamazepine induces its metabolism

**Carbamazepine (Tegretol):**
- Na+ channel blocker — effective for bipolar I mania, trigeminal neuralgia, epilepsy
- Strong CYP3A4 inducer (increases its own metabolism and many other drugs)
- Risk: Agranulocytosis, hyponatremia (SIADH), teratogen (spina bifida)

## Anxiolytics and Sedative-Hypnotics

**Benzodiazepines:**
- Mechanism: Positive allosteric modulators of GABA-A receptors — increase Cl- channel OPENING FREQUENCY in response to GABA
- Used for: Acute anxiety, panic disorder, alcohol withdrawal, seizures, procedural sedation, muscle spasm, insomnia (short-term)
- Risks: Sedation, cognitive impairment, falls (elderly), tolerance, physical dependence, respiratory depression (especially with opioids or alcohol — synergistic), rebound anxiety
- Short-acting (high addiction potential): Alprazolam (Xanax), lorazepam (Ativan), triazolam
- Long-acting (less withdrawal): Diazepam (Valium), clonazepam (Klonopin), chlordiazepoxide (for alcohol withdrawal)

**Z-drugs (non-benzodiazepine hypnotics):**
- Zolpidem (Ambien), zaleplon, eszopiclone — also act on GABA-A (at BZD site) but more specific for α1 subunit → more sedative-selective, less anxiolytic/muscle relaxant
- Still carry risks of dependence, amnesia (sleepwalking with complex behaviors), and abuse

**Buspirone:**
- Partial 5-HT1A agonist → serotonergic modulation; some D2 antagonism
- Used for: GAD; requires 2-4 weeks for therapeutic effect (not PRN)
- No sedation, no abuse potential, no withdrawal — but patients expect immediate BZD-like effect and may not persist

## Stimulants (ADHD and Narcolepsy)

| Drug | Mechanism | Duration | Notes |
|------|-----------|----------|-------|
| Methylphenidate | Blocks DAT + NET | IR: 4-6h; XR: 8-12h | More gradual; D-MPH is active enantiomer (Focalin) |
| Amphetamine salts | Blocks + reverses DAT/NET; displaces vesicular DA | IR: 4-6h; XR: 8-12h | Stronger DA effect; lisdexamfetamine (Vyvanse) is pro-drug (longer, smoother) |
| Modafinil | Uncertain — inhibits DAT; promotes orexin/H | Once daily | Approved narcolepsy; off-label ADHD, shift work; much lower abuse potential |

## Opioid Pharmacology

**Receptor types:** Mu (μ), Kappa (κ), Delta (δ) — all Gi-coupled, reduce neuronal excitability
- **Mu:** Analgesia, euphoria, respiratory depression, constipation, miosis, physical dependence — target of morphine, oxycodone, fentanyl, heroin
- **Kappa:** Analgesia, dysphoria, psychotomimetic effects — target of dynorphin, nalbuphine
- **Delta:** Analgesia, mood modulation

**Key opioid medications:**
| Drug | Type | Key Feature |
|------|------|------------|
| Morphine | Full μ agonist | Prototype; poor oral bioavailability (~25%) from first-pass |
| Oxycodone | Full μ agonist | Oral bioavailability ~60-87%; common abuse target |
| Fentanyl | Full μ agonist | 100x more potent than morphine; transdermal patch, IV, nasal |
| Buprenorphine | Partial μ agonist / κ antagonist | Ceiling on respiratory depression; high receptor affinity (displaces full agonists); Suboxone (+ naloxone sublingual) for OUD |
| Methadone | Full μ agonist | Long t1/2 (24-36h); NMDA antagonism; QTc prolongation; OUD maintenance |
| Naloxone | μ antagonist (IV/IN) | Opioid overdose reversal; blocks euphoria in Suboxone |
| Naltrexone | μ/κ/δ antagonist (oral, long-acting IM) | OUD maintenance; alcohol use disorder (blocks endorphin reinforcement) |`
    },
    {
      topicId: T["Psychological Disorders"],
      title: "Psychological Disorders — Study Guide",
      content: `## Classification Systems and Foundations

The DSM-5 (Diagnostic and Statistical Manual, 5th Edition) provides categorical diagnoses based on clinical criteria. The ICD-11 (International Classification of Diseases) is the international equivalent. Both systems are moving toward dimensional conceptualizations, recognizing that mental disorders exist on spectra and share common neurobiological features (e.g., the Research Domain Criteria / RDoC framework).

Key DSM-5 changes from DSM-IV: Removal of the multiaxial system; Autism spectrum disorder consolidation; ADHD recognized in adults; PTSD moved from anxiety disorders to "Trauma- and Stressor-Related Disorders"; OCD has its own chapter.

## Schizophrenia Spectrum Disorders

### Diagnostic Criteria (DSM-5)
Two or more of the following for ≥1 month (at least one must be #1, 2, or 3):
1. Delusions
2. Hallucinations
3. Disorganized speech
4. Grossly disorganized or catatonic behavior
5. Negative symptoms

Plus: Significant social/occupational dysfunction; continuous signs for ≥6 months (including at least 1 month of active symptoms).

### Symptom Dimensions

**Positive symptoms:** Excess or distortion of normal functions
- Hallucinations: Most commonly auditory (command hallucinations, commenting, conversing voices); can be visual, olfactory, tactile
- Delusions: Fixed false beliefs — paranoid/persecutory (most common), referential, grandiose, somatic, erotomanic. Must be assessed for level of conviction and systematization.
- Disorganized speech: Looseness of associations, tangentiality, circumstantiality, neologisms, word salad, clanging
- Catatonia: Stupor, waxy flexibility, echolalia, echopraxia, posturing

**Negative symptoms (the "5 A's"):**
- Alogia: Poverty of speech or speech content
- Affective blunting: Reduced emotional expression
- Anhedonia: Inability to experience pleasure
- Avolition: Lack of motivation
- Asociality: Social withdrawal

**Cognitive symptoms (most impairing for long-term outcomes):** Working memory, verbal learning and memory, processing speed, executive function, sustained attention, social cognition — an average 1.5-2 SD below healthy controls. Current antipsychotics don't adequately treat cognitive symptoms.

### Neurobiological Models

**Dopamine hypothesis:** Mesolimbic DA hyperactivity → positive symptoms; mesocortical DA hypoactivity → negative and cognitive symptoms. Evidence: All effective antipsychotics block D2; dopaminergic drugs (amphetamine, cocaine, L-DOPA) can induce psychosis; PET shows elevated presynaptic dopamine synthesis capacity in schizophrenia.

**Glutamate/NMDA hypothesis:** NMDA receptor hypofunction → disinhibition of DA release AND direct negative/cognitive symptoms. Evidence: PCP and ketamine (NMDA antagonists) reproduce the full syndrome including negative/cognitive symptoms that D2 blockers cannot produce. PV+ fast-spiking interneurons (GABAergic) are particularly dependent on NMDA function — their hypofunction → cortical desynchronization and E/I imbalance.

**Neurodevelopmental model:** Risk factors: prenatal infection (especially influenza in 2nd trimester), obstetric complications, urban birth, cannabis exposure in adolescence, advanced paternal age. The illness begins with abnormal neurodevelopment — subtle premorbid cognitive deficits and social withdrawal precede the first psychotic break by years.

**Brain structural changes:** Enlarged ventricles (lateral > third), reduced prefrontal gray matter (hypofrontality on PET), reduced hippocampal/amygdala volume, reduced thalamic volume, decreased cortical thickness — these are present before antipsychotics, implying they are part of the illness.

## Mood Disorders

### Major Depressive Disorder (MDD)

**DSM-5 Criteria:** ≥5 symptoms for ≥2 weeks, at least one being depressed mood OR anhedonia:
1. Depressed mood
2. Anhedonia (loss of interest/pleasure)
3. Weight/appetite change (increase or decrease)
4. Insomnia or hypersomnia
5. Psychomotor agitation or retardation (observable)
6. Fatigue or energy loss
7. Worthlessness or excessive/inappropriate guilt
8. Difficulty concentrating or indecisiveness
9. Recurrent thoughts of death, suicidal ideation, plan, or attempt

**Subtypes/specifiers:** With anxious distress, mixed features, melancholic features, atypical features, psychotic features, peripartum onset, seasonal pattern, catatonia.

**Epidemiology:** Lifetime prevalence ~20%; 2:1 female:male ratio (post-puberty); leading cause of disability worldwide.

### Neurobiological Models

**Monoamine hypothesis:** Deficiency of 5-HT and NE (and/or DA) → depression. Supporting evidence: monoamine-depleting drugs (reserpine) can cause depression; antidepressants increase monoamines. But hypothesis is too simplistic — drug effect is immediate while clinical response takes 2-4 weeks.

**Neuroplasticity/BDNF hypothesis:** Depression involves reduced BDNF, impaired hippocampal neurogenesis, reduced dendritic complexity — the 2-4 week antidepressant delay corresponds to the time needed to restore neuroplasticity changes. Ketamine's rapid antidepressant effect (within hours) bypasses this timeline through a different mechanism.

**HPA dysregulation:** Elevated cortisol, non-suppression on DST, hypercortisolemia → hippocampal damage → worsening depression (vicious cycle). CRH is elevated in cerebrospinal fluid of depressed patients.

**Inflammatory hypothesis:** Elevated pro-inflammatory cytokines (IL-6, TNF-α, CRP) are associated with depression, reduced antidepressant response, and depression-like "sickness behavior." Anti-inflammatory treatments may have antidepressant effects in high-inflammation subtypes.

### Bipolar Disorders

**Bipolar I Disorder:** At least one lifetime manic episode (may include psychosis, requires hospitalization or causes marked impairment).
- Full manic episode: Expansive/irritable mood + increased energy for ≥1 week (or any duration if hospitalized); ≥3 of DIGFAST: Distractibility, Impulsivity, Grandiosity, Flight of ideas, Activity/agitation, Sleep decreased (feels rested with less sleep), Talkativeness

**Bipolar II Disorder:** Hypomanic episodes (not full mania — ≥4 days, no psychosis, no hospitalization) + at least one MDE. Depressive episodes are primary; hypomania may be ego-syntonic (patients often don't report it). Frequently misdiagnosed as unipolar depression — implications: antidepressants alone can trigger mania or rapid cycling.

**Cyclothymic Disorder:** ≥2 years of subthreshold hypomanic and depressive symptoms — never meeting full criteria; often a precursor to bipolar I or II.

### Mood Disorder Treatments

| Treatment | Mechanism | Indications | Notes |
|-----------|-----------|------------|-------|
| SSRIs | SERT blockade | MDD, bipolar depression (+ mood stabilizer) | 2-4 weeks onset |
| ECT | Generalized seizure | Severe/TRD depression, catatonia, psychotic depression | Rapid (1-2 weeks); memory SE |
| Lithium | Multi-mechanistic | Bipolar I+II maintenance; TRD augmentation | Antisuicidal effect |
| Valproate | Na+ channel/GABA | Bipolar I acute mania; rapid cycling | Teratogenic |
| Lamotrigine | Na+ channel | Bipolar depression; maintenance | SJS risk; slow titration |
| rTMS | Magnetic stimulation | TRD | Non-invasive; targets left dlPFC |

## Anxiety and Related Disorders

### PTSD (Post-Traumatic Stress Disorder)

**Diagnostic Criteria (DSM-5):** Exposure to actual or threatened death/injury/sexual violence PLUS 4 symptom clusters for ≥1 month with impairment:
1. **Intrusion:** Intrusive memories/flashbacks, nightmares, psychological/physiological reactivity to trauma cues
2. **Avoidance:** Avoidance of memories, feelings, or external reminders
3. **Negative Cognitions/Mood:** Distorted blame, persistent negative emotions, loss of interest, detachment, emotional numbing, amnesia for aspects of trauma
4. **Hyperarousal/Reactivity:** Hypervigilance, exaggerated startle, sleep disturbance, irritability/aggression, reckless behavior, concentration problems

**Neurobiological model:**
- Amygdala: Hyperreactive to threat cues (conditioned fear is not extinguishing)
- vmPFC: Reduced ability to inhibit amygdala → impaired extinction
- Hippocampus: Reduced volume (stress-induced) → impaired contextual fear regulation, difficulty distinguishing safe from dangerous contexts
- HPA axis: Often dysregulated (hypocortisolemia with enhanced GR sensitivity in some PTSD patients)
- LC/NE: Hyperactive → hyperarousal, startle

**Evidence-based treatments:**
- Prolonged Exposure (PE): Systematic in vivo and imaginal exposure to trauma memories and cues — extinguishes conditioned fear through habituation and new learning
- Cognitive Processing Therapy (CPT): Addresses maladaptive cognitions (stuck points) about the trauma and its aftermath
- EMDR (Eye Movement Desensitization and Reprocessing): Bilateral stimulation (eye movements) while processing traumatic memories — mechanism debated; likely involves distraction enabling extinction
- Medications: Sertraline and paroxetine (FDA-approved); prazosin (alpha-1 blocker) for nightmares; guanfacine (alpha-2 agonist) reduces hyperarousal

### OCD and Related Disorders

OCD: Obsessions (intrusive, unwanted thoughts/images/urges) + Compulsions (repetitive behaviors/mental acts reducing obsessional distress) — time-consuming (>1 hour/day), causing impairment. Ego-dystonic (patient recognizes obsessions as excessive).

**Neural circuit:** Cortico-striato-thalamo-cortical (CSTC) loop dysfunction — hyperactivation of orbitofrontal cortex → ventromedial caudate → thalamus → OFC (positive feedback loop). OFC hyperactivity = "error signal" that won't reset. This circuit is modulated by serotonin.

**Treatment:** ERP (Exposure and Response Prevention) — the gold standard behavioral treatment. SSRIs (higher doses than depression). Augmentation: antipsychotics, clomipramine (TCA with strong SRI effect). Severe/refractory: DBS (deep brain stimulation to the nucleus accumbens), TMS.

### Panic Disorder

Recurrent unexpected panic attacks + worry about attacks or behavioral change for ≥1 month. Panic attacks: sudden surge of fear/discomfort with ≥4 somatic/cognitive symptoms.

**Neurobiological model:** CO2 hypersensitivity ("suffocation alarm") — brainstem chemoreceptors interpret CO2 as suffocation signal → activates amygdala → panic. The LC (NE) is hyperactivated. Sodium lactate infusion and CO2 inhalation can provoke attacks in susceptible individuals.

**Treatment:** SSRIs (first-line); SNRI (venlafaxine); BZDs for acute relief; CBT with interoceptive exposure.

## Neurodevelopmental Disorders

### Autism Spectrum Disorder (ASD)

**DSM-5 Criteria:** Two domains:
1. Social communication and interaction deficits (all three): social-emotional reciprocity, nonverbal communication, developing/maintaining relationships
2. Restricted, repetitive behaviors (≥2 of 4): stereotyped movements/speech, insistence on sameness, restricted interests, sensory hypo/hyperreactivity

**Neurobiological models:**
- E/I imbalance: Excess excitation or insufficient inhibition in cortical circuits
- Connectivity changes: Local over-connectivity (within regions) with long-range under-connectivity
- Default mode network hypoconnectivity → self-referential and social processing deficits
- Mirror neuron system dysfunction (proposed but controversial)
- Cerebellar abnormalities (Purkinje cell loss)
- Genetics: Highly heritable (~80%); hundreds of genes implicated (CNVs, SNPs); de novo mutations account for many cases

**Treatment:** No pharmacological cure. ABA (Applied Behavior Analysis) for behavioral skills; speech/language therapy; social skills training; school supports. Aripiprazole and risperidone FDA-approved for irritability/aggression in ASD.

## Dissociative Disorders

A spectrum of disorders involving disruption in the integration of consciousness, memory, identity, emotion, perception, behavior, and sense of self:

**Dissociative Identity Disorder (DID):** ≥2 distinct personality states with amnesia between them; etiologically linked to severe early childhood trauma and attachment disruption. The most controversial diagnosis in psychiatry.

**Depersonalization-Derealization Disorder:** Persistent feelings of being detached from one's own mental processes or body (depersonalization) or from the external world (derealization) while reality testing remains intact. Associated with temporal and parietal cortex abnormalities, reduced limbic activation.`
    },
    {
      topicId: T["Personality Disorders"],
      title: "Personality Disorders — Study Guide",
      content: `## What Are Personality Disorders?

Personality disorders (PDs) are enduring, inflexible patterns of inner experience and behavior that deviate markedly from cultural expectations, are pervasive across situations, are stable over time (onset traceable to adolescence or early adulthood), and cause significant distress or functional impairment. Unlike Axis I disorders, personality disorders are ego-syntonic — the traits feel consistent with the person's sense of self, which is why they are less likely to be brought as a chief complaint and why they resist treatment.

DSM-5 lists 10 specific PDs grouped into 3 clusters, plus a catch-all "personality disorder — other specified."

## DSM-5 Clusters: Overview

### Cluster A — Odd/Eccentric (Schizophrenia Spectrum)

**Paranoid Personality Disorder:**
- Pervasive distrust and suspicion of others (motives interpreted as malevolent)
- Reluctant to confide (fear information will be used against them)
- Perceives attacks on character/reputation that others don't see
- Bears grudges; suspects infidelity without justification
- Distinguished from paranoid schizophrenia by ABSENCE of true psychosis

**Schizoid Personality Disorder:**
- Pervasive detachment from social relationships; genuinely does NOT desire relationships (vs. avoidant PD = wants but fears)
- Restricted emotional expression; appears cold, indifferent
- Prefers solitary activities; little interest in sexual experiences
- No psychosis; not on the schizophrenia spectrum (unlike schizotypal)
- Difficult to treat; no proven psychotherapy

**Schizotypal Personality Disorder:**
- Magical thinking, odd beliefs, ideas of reference (not delusions)
- Unusual perceptual experiences (not hallucinations — "I feel a presence")
- Eccentric behavior and appearance; odd speech (vague, circumstantial)
- Social anxiety that doesn't decrease with familiarity (compared to avoidant PD)
- Genetically linked to schizophrenia — may be part of the schizophrenia spectrum
- Low-dose antipsychotics may reduce cognitive-perceptual symptoms

### Cluster B — Dramatic/Emotional/Erratic

**Antisocial Personality Disorder (ASPD):**
DSM-5 requires: Conduct disorder before age 15 (the childhood predecessor); ≥18 years old; then pervasive disregard for and violation of others' rights:
- Repeated law-breaking, deceitfulness, impulsivity, irritability/aggressiveness
- Reckless disregard for safety, consistent irresponsibility, lack of remorse

Neurobiological profile: Reduced amygdala gray matter and reactivity (blunted fear responses, reduced autonomic reactivity to punishment) — explains poor punishment learning. Reduced PFC activity → poor impulse control. Low NE arousal → sensation-seeking. Low MAO activity → more impulsive aggression.

**ASPD vs. Psychopathy (Hare PCL-R):** ASPD focuses on behaviors; psychopathy adds affective/interpersonal features:
- Factor 1 (affective/interpersonal): Grandiose sense of self-worth, glibness/superficial charm, pathological lying, manipulativeness, callousness/lack of empathy, shallow affect, failure to accept responsibility
- Factor 2 (antisocial lifestyle): Need for stimulation, impulsivity, irresponsibility, criminal versatility
All psychopaths meet ASPD criteria; ~25% of ASPD patients meet psychopathy criteria.

**Borderline Personality Disorder (BPD):**
DSM-5: ≥5 of 9 criteria:
1. Frantic efforts to avoid real or imagined abandonment
2. Unstable, intense relationships alternating between idealization and devaluation (splitting)
3. Unstable self-image or sense of self (identity diffusion)
4. Impulsivity in ≥2 potentially self-damaging areas (spending, sex, substance use, reckless driving, binge eating)
5. Recurrent suicidal behavior, gestures, threats, or self-mutilating behavior
6. Affective instability due to marked mood reactivity (intense but brief episodic dysphoria, irritability, or anxiety — hours to days, not weeks)
7. Chronic feelings of emptiness
8. Inappropriate intense anger or difficulty controlling anger
9. Transient, stress-related paranoid ideation or severe dissociative symptoms

**Neurobiology of BPD:**
- Amygdala hyperreactivity (emotional dysregulation, hair-trigger anger)
- Reduced prefrontal (ACC, dlPFC) volume and function (impaired top-down emotional regulation)
- HPA axis hyperreactivity (stress sensitivity)
- Serotonergic dysregulation (impulsive aggression, self-harm)

**Linehan's Biosocial Theory:** BPD results from biological emotional sensitivity (high reactivity, slow return to baseline) interacting with an invalidating environment (consistently dismissing/punishing emotional expression) → failure to learn emotional regulation skills. DBT provides the "missing" skills.

**Treatment (DBT — Dialectical Behavior Therapy):**
Four skill modules:
1. Mindfulness: Observe and participate non-judgmentally in the present moment; the core skill upon which all others depend
2. Distress Tolerance: Surviving crises without making them worse — TIPP (Temperature, Intense exercise, Paced breathing, Progressive relaxation), ACCEPTS (Activities, Contributing, Comparisons, Emotions opposite, Pushing away, Thoughts, Sensations), Radical acceptance
3. Emotion Regulation: Identifying, labeling, and modifying emotional responses; opposite action; reducing vulnerability (PLEASE: treating PhysicaL illness, balanced Eating, Avoiding mood-altering substances, Sleeping adequately, Exercise)
4. Interpersonal Effectiveness: Communicating needs and maintaining relationships — DEAR MAN (Describe, Express, Assert, Reinforce, stay Mindful, Appear confident, Negotiate) for getting what you need; GIVE for relationship maintenance; FAST for self-respect

**Narcissistic Personality Disorder (NPD):**
≥5 of 9 criteria: Grandiose sense of self-importance, preoccupation with fantasies of unlimited success/power/brilliance, belief in own specialness (can only be understood by other high-status people), requires admiration, sense of entitlement, exploits others, lacks empathy, envious of others/believes others envy them, arrogant behaviors.

Grandiose vs. Vulnerable (covert) narcissism: The DSM describes the overt/grandiose type; vulnerable narcissism (fragile, shame-prone, hypersensitive to slights) is a clinical variant that may present with depression and social anxiety. Both share underlying entitlement and impaired empathy.

Narcissistic injury and rage: When the grandiose self is challenged → narcissistic injury → shame → narcissistic rage (explosive, vindictive anger aimed at restoring self-image) or depressive collapse.

**Histrionic Personality Disorder (HPD):**
≥5 of 8 criteria: Uncomfortable when not center of attention, sexually seductive/provocative behavior, rapidly shifting/shallow emotions, uses physical appearance to draw attention, impressionistic and vague speech, theatrical/exaggerated emotional expression, suggestible, considers relationships more intimate than they are. High comorbidity with somatoform disorders. More often diagnosed in women (though gender bias in diagnosis exists).

### Cluster C — Anxious/Fearful

**Avoidant Personality Disorder:**
Social inhibition, feelings of inadequacy, hypersensitivity to negative evaluation — pervasive across situations, deeply embedded in self-concept. KEY DISTINCTION from SAD: AvPD is more pervasive (affects identity, self-concept, all relationships, not just specific social/performance situations). Both respond to SSRIs and CBT; AvPD may require more intensive treatment addressing core schemas.

**Dependent Personality Disorder:**
Excessive need to be cared for → clinging behavior, fear of separation. Difficulty making decisions without excessive advice/reassurance; volunteers for unpleasant tasks to maintain nurturance; quickly seeks another relationship after one ends. Associated with anxious attachment style; historically more often diagnosed in women.

**Obsessive-Compulsive Personality Disorder (OCPD):**
Pervasive preoccupation with orderliness, perfectionism, and control at the expense of flexibility, openness, and efficiency. Ego-syntonic (feels right to the patient) — contrast with OCD, which is ego-dystonic (intrusive obsessions feel alien).
OCPD features: Preoccupied with rules/lists/schedules; perfectionism interferes with completion; overdevoted to work (not for economic necessity); inflexible about ethics/morality; hoards objects; miserly; rigid/stubborn.

## Psychodynamic Concepts in Personality Disorders

**Splitting:** Inability to hold ambivalent feelings — people are either all good or all bad. Primary defense in BPD and NPD. Leads to idealization → devaluation cycles in relationships.

**Projective identification:** Projecting unwanted feelings INTO another person AND then relating to them as if they truly have those qualities — subtly inducing the projected feelings. Important countertransference concept for therapists.

**Object relations:** Internal representations of self and others (introjects) formed in early development. Malignant introjects (from abusive or neglectful caregivers) drive self-destructive behavior and pathological relationship patterns.

**Ego-syntonic vs. ego-dystonic:** Ego-syntonic symptoms feel consistent with self → less motivation for change. Ego-dystonic symptoms feel alien → motivates help-seeking. Most PDs are ego-syntonic; OCD is notably ego-dystonic.

## Assessment Tools

**MMPI-3 (Minnesota Multiphasic Personality Inventory-3):** The gold-standard self-report measure of psychopathology — includes RC scales, somatic complaint scales, and PSY-5 dimensional personality scales. Includes extensive validity scales (overreporting, underreporting, inconsistency) — essential for forensic contexts.

**MCMI-IV (Millon Clinical Multiaxial Inventory-4):** Based on Millon's biosocial theory — 195 items assessing all DSM personality disorder styles and clinical syndromes. Widely used in forensic evaluations alongside the MMPI.

**Structured Clinical Interview for DSM Personality Disorders (SCID-5-PD):** Semi-structured diagnostic interview covering all 10 DSM-5 PDs — gold standard for research diagnosis.

**PCL-R (Hare Psychopathy Checklist-Revised):** 20-item rating scale (semi-structured interview + file review) for psychopathy — widely used in forensic and correctional settings. Score ≥30 = psychopathy; average in forensic samples: ~22.

## Prognosis and Outcomes

BPD has better long-term prognosis than commonly assumed — longitudinal studies (MSAD, CLPS) show the majority of patients no longer meet criteria by their 30s-40s (especially impulsivity and self-harm). However, functional outcomes (employment, relationships, quality of life) lag behind symptom remission. DBT reduces parasuicidality and hospitalizations.

ASPD with psychopathy features has the poorest treatment response — aggressive outward behavior may decrease with age, but the underlying affective deficits tend to persist. No empirically validated treatment for psychopathy; some evidence that intensive treatment in highly controlled settings can reduce recidivism slightly.

NPD is often treatment-resistant — the grandiose self-image is ego-syntonic, making self-reflection painful. Narcissistic injury during therapy (feeling criticized by the therapist) frequently leads to premature termination. Long-term psychodynamic therapy is the most evidence-informed approach.`
    },
    {
      topicId: T["ADHD & Medications"],
      title: "ADHD & Medications — Study Guide",
      content: `## Overview and Definition

Attention-Deficit/Hyperactivity Disorder (ADHD) is a neurodevelopmental disorder characterized by persistent, developmentally inappropriate levels of inattention, hyperactivity, and/or impulsivity that interfere with functioning across multiple settings. It is one of the most heritable and prevalent psychiatric disorders (~5-8% in children, 2-5% in adults), with a strong genetic basis (~75-80% heritability from twin studies).

ADHD is a lifespan condition — most children with ADHD continue to meet criteria in adulthood, though the presentation shifts from overt hyperactivity to subjective restlessness, inattention, executive dysfunction, and emotional dysregulation.

## DSM-5 Diagnostic Criteria

### Symptom Domains

**Inattention (9 symptoms):** The patient often:
1. Fails to give close attention to details or makes careless mistakes
2. Has difficulty sustaining attention during tasks or play
3. Does not seem to listen when spoken to directly
4. Does not follow through on instructions, fails to finish work
5. Has difficulty organizing tasks/activities
6. Avoids/dislikes tasks requiring sustained mental effort
7. Loses things necessary for tasks
8. Is easily distracted by extraneous stimuli
9. Is forgetful in daily activities

**Hyperactivity/Impulsivity (9 symptoms):** The patient often:
1. Fidgets with hands/feet or squirms in seat
2. Leaves seat when expected to remain seated
3. Runs about or climbs inappropriately (or subjective restlessness in adults)
4. Unable to play quietly
5. Is "on the go," acting as if "driven by a motor"
6. Talks excessively
7. Blurts out answers before questions are completed
8. Has difficulty waiting their turn
9. Interrupts or intrudes on others

**Diagnostic requirements:**
- **Threshold:** ≥6 symptoms in ≥1 domain for children; ≥5 symptoms for adults (≥17)
- **Duration:** Symptoms present for ≥6 months
- **Developmental onset:** Several symptoms present BEFORE AGE 12 (changed from 7 in DSM-IV)
- **Pervasive impairment:** Evidence of impairment in ≥2 settings (home, school, work, social)
- **Rule-outs:** Not better explained by another mental disorder

**Three presentations:**
1. Predominantly Inattentive (ADHD-PIA) — formerly ADD
2. Predominantly Hyperactive-Impulsive (ADHD-PHIA)
3. Combined presentation (ADHD-C) — most common overall

### Changes from DSM-IV to DSM-5
- Age of onset raised from 7 to 12
- Symptom threshold lowered for adults (5 vs. 6)
- ASD no longer an exclusion criterion (can now comorbidly diagnose)
- Presentations (not subtypes) — recognizing within-person variability over time

## Neurobiology of ADHD

### Brain Regions Affected

**Prefrontal cortex (PFC):** The most consistently affected region — particularly the right dorsolateral PFC, inferior frontal gyrus, and anterior cingulate cortex. These regions are critical for response inhibition, working memory, sustained attention, and cognitive flexibility. In ADHD children, PFC maturation is delayed by ~3 years on average (Shaw et al., 2007) — the cortical maturation eventually catches up in most, which may explain symptom improvement with age.

**Striatum (caudate nucleus):** Reduced volume; delayed maturation — striatal dopamine is critical for reward processing, habit formation, and the initiation of appropriate actions.

**Cerebellum:** Consistently smaller in ADHD — the cerebellum contributes to timing, motor coordination, and increasingly to cognitive processing speed; cerebellar differences may explain timing and coordination difficulties.

**Corpus callosum:** Reduced size in several regions — affecting interhemispheric communication and contributing to coordination deficits.

### Neurotransmitter Systems

**Dopamine:** Reduced tonic DA in PFC circuits impairs the "signal-to-noise" ratio of PFC processing — working memory representations are unstable, allowing irrelevant stimuli to intrude. Phasic DA in the striatum is involved in reward timing and habit learning.

**Norepinephrine:** NE in the PFC (via alpha-2A receptors) strengthens synaptic connections in PFC networks, enhancing working memory and focused attention. NE deficiency → distractibility, impulsive responding. Guanfacine (alpha-2A agonist) and atomoxetine (NET inhibitor) target NE systems.

**The "dual pathway model" (Sonuga-Barke):** Two relatively independent cognitive deficits contribute to ADHD:
1. Executive dysfunction (PFC/dlPFC) — inattention, working memory, response inhibition
2. Motivational/reward pathway dysfunction (mesolimbic DA) — delay aversion, reward sensitivity, emotional dysregulation

## Neuropsychological Profile

ADHD is associated with deficits across multiple cognitive domains, though performance is INCONSISTENT (fluctuating, not uniformly impaired):

| Domain | Typical ADHD Deficit | Test Examples |
|--------|---------------------|--------------|
| Sustained attention | High variability, difficulty over time | CPT (Conners' CPT), d2 Attention Test |
| Response inhibition | Commission errors (false positives), stop-signal reaction time | CPT, Stop-Signal Task, Stroop |
| Working memory | Digit span backward, letter-number sequencing | WAIS WMI, WRAML, CANTAB |
| Processing speed | Slower processing, especially under pressure | WAIS PSI, Coding, Symbol Search |
| Executive function | Planning, flexibility, organization | WCST, Trails B, BRIEF (self-report) |
| Emotional regulation | Rejection sensitivity, frustration | ERC, DERS, clinical interview |

**Important caveat:** No single neuropsychological test is diagnostic of ADHD — diagnosis requires clinical history, DSM criteria, multi-informant rating scales, and functional impairment evaluation. Neuropsychological testing can characterize the cognitive profile, identify comorbidities, and guide accommodations.

## Assessment Tools

**Rating Scales (multi-informant — parent, teacher, self):**
- **Conners' Rating Scales-3 (CRS-3):** Comprehensive ADHD rating scale for children; multiple subscales including DSM-5 ADHD symptoms, oppositional, learning, and executive function; extensive normative database
- **CAARS (Conners' Adult ADHD Rating Scale):** Self-report and observer; well-validated for adult ADHD; includes validity indices
- **ADHD Rating Scale-5 (ADHD-RS-5):** Direct DSM-5 mapping; widely used in clinical trials
- **SNAP-IV (Swanson, Nolan, Pelham):** 26-item scale used in research and medication monitoring
- **BRIEF (Behavior Rating Inventory of Executive Function):** Assesses real-world executive function across ecological settings — the everyday manifestation of EF difficulties

**Cognitive/Attention Tests:**
- **CPT-3 (Conners' Continuous Performance Test-3):** 14-minute sustained attention test with omission/commission errors and reaction time variability
- **TOVA (Test of Variables of Attention):** Non-language-based CPT
- **IVA+ (Integrated Visual and Auditory CPT):** Combines visual and auditory modalities

## Pharmacological Treatment

### Stimulants (First-Line)

**Methylphenidate (MPH):**
- Block DAT and NET → increased DA and NE in PFC synapses
- Available formulations: Immediate-release (Ritalin: 4-6h), Extended-release (Concerta OROS: 10-12h; Focalin XR: D-MPH only, 8-10h; Aptensio, Jornay PM for morning adherence)
- D-methylphenidate (Focalin) is the pharmacologically active enantiomer

**Amphetamine salts:**
- Block DAT/NET AND cause reverse transport (release of DA from vesicles and cytoplasm through reversed DAT) — stronger/faster DA release than MPH
- Available formulations: Mixed amphetamine salts (Adderall IR: 4-6h; XR: 8-10h), Lisdexamfetamine (Vyvanse: prodrug activated by red blood cells → d-amphetamine; very smooth onset/offset, 10-14h; lowest abuse potential among stimulants), d-amphetamine (Dexedrine)
- Approved age ranges: Amphetamines ≥3 years; methylphenidate ≥6 years

**Stimulant side effects:**
- Appetite suppression (particularly at lunchtime) — usually attenuates with continued use
- Sleep onset difficulty (if taken too late in the day)
- Mild growth deceleration (~1-2 cm) with long-term use in children — may resolve after puberty
- Cardiovascular: small increases in heart rate and blood pressure — requires baseline screening; contraindicated in structural heart disease
- Potential for misuse (especially in adults/college students seeking academic enhancement)

**Optimizing stimulant use:**
- Start low, titrate slowly
- Long-acting formulations preferred (once daily → better adherence, smoother coverage, less diversion)
- Drug holidays may help growth and appetite on weekends/vacations
- Monitor BP, HR, height, weight, and sleep at follow-up visits

### Non-Stimulant Medications

**Atomoxetine (Strattera):**
- Selective NET inhibitor (not a stimulant; no DA reuptake blockade)
- Increases NE (and indirectly DA) in the PFC
- Onset: 4-6 weeks for full therapeutic benefit
- Advantages: No abuse potential; can be used with substance use history; may also help anxiety and tic disorders
- FDA-approved for adults AND children ≥6 years
- Side effects: Initial GI upset (nausea, decreased appetite), sedation, increased BP/HR, rare hepatotoxicity; black box warning for suicidality in children

**Guanfacine (Intuniv) and Clonidine (Kapvay):**
- Alpha-2A adrenergic receptor agonists — selectively target postsynaptic alpha-2A receptors in the PFC, strengthening PFC working memory networks
- Guanfacine: More alpha-2A selective; extended-release preferred; FDA-approved for ADHD in children 6-17; also used for PTSD nightmares and anxiety augmentation
- Clonidine: Less alpha-2A selective; also blocks alpha-2B/C (more sedation); used for sleep problems associated with ADHD, tic disorders, aggression
- Advantages over stimulants: No abuse potential; reduces hyperactivity, impulsivity, aggression, and emotional dysregulation; can be combined with stimulants for residual symptoms
- Side effects: Sedation, hypotension, bradycardia, rebound hypertension if stopped abruptly

**Bupropion:** NDRI (NE/DA reuptake inhibitor) — second-line non-stimulant; also used in adult ADHD with comorbid depression or substance use; less evidence than atomoxetine.

## Non-Pharmacological Treatments

**Behavioral interventions (first-line for preschool ADHD; adjunctive at all ages):**
- **Parent Training (PT):** Parents learn to use behavioral reinforcement, clear commands, consistent consequences, and positive attention — reduces ADHD-related oppositional behavior; first-line for children <6
- **PCIT (Parent-Child Interaction Therapy):** Evidence-based approach for young children combining relationship enhancement and behavior management
- **Behavioral Classroom Management:** Teacher-implemented contingencies, seating, schedules, token economies — effective in school settings
- **Organizational Skills Training:** Evidence-based for older children and adolescents — improves homework management, materials organization, time planning

**CBT for Adults with ADHD:** Addresses cognitive distortions, time management, organizational skills, and procrastination — most effective when combined with medication.

**Neurofeedback:** Real-time EEG feedback targeting theta/alpha reduction and beta wave enhancement — classified as "possibly efficacious" by professional guidelines; considerably weaker evidence than stimulant medication.

**Exercise:** Aerobic exercise has acute positive effects on ADHD-related executive function and sustained attention — increases DA and NE in PFC; may be especially valuable as an adjunct.

## School Accommodations

**Section 504 (Rehabilitation Act):** Protects students with disabilities (including ADHD) from discrimination — provides accommodations (extended time, preferential seating, reduced distraction testing environment, movement breaks).

**IEP (Individualized Education Program under IDEA):** For students whose ADHD significantly affects educational performance — provides specialized instruction, related services, and accommodations.

**Common accommodations:** Extended time (1.5x or 2x), testing in separate room, reduced assignment length, frequent breaks, preferential seating, oral administration of tests, behavioral checklists, homework modifications.

## Comorbidities

ADHD rarely occurs in isolation — comorbidity is the rule, not the exception:
- Oppositional Defiant Disorder (ODD): ~50% of children with ADHD
- Conduct Disorder: ~20-25%
- Anxiety Disorders: ~25-50%
- Learning Disabilities: ~30-50%
- Depression: ~25% (especially adults)
- Bipolar Disorder: ~20-30% of adults with ADHD
- Substance Use Disorders: ~2x elevated risk
- Tic Disorders/Tourette's: ~10-15%
- Sleep Disorders: 50-70%

Treating comorbidities often requires separate interventions — ADHD medications may worsen some comorbidities (stimulants can exacerbate anxiety; watch for mood destabilization in those with bipolar).`
    },
    {
      topicId: T["Language Processing & Aphasia"],
      title: "Language Processing & Aphasia — Study Guide",
      content: `## Neural Basis of Language

Language is the most complex and uniquely human cognitive ability. Contrary to the simple Wernicke-Geschwind model, modern neuroimaging and lesion studies reveal that language depends on a distributed bilateral network — though left hemisphere dominance (~95% of right-handers) means left hemisphere lesions most consistently produce aphasia.

### Language Brain Regions

**Broca's area (Brodmann areas 44/45, left inferior frontal gyrus — pars opercularis + triangularis):**
- Speech production, phonological encoding, grammatical processing, syntax
- Pars opercularis (44): Phonological processing, speech motor programming
- Pars triangularis (45): Semantic processing, syntactic computation
- Also important for non-linguistic functions: music, action understanding (motor resonance)

**Wernicke's area (Brodmann area 22, left posterior superior temporal gyrus):**
- Auditory language comprehension
- Recognizes the sound patterns (phonological forms) of words and maps them to meaning
- Part of the planum temporale (PT) — typically larger on the left (anatomical basis of language lateralization)

**Arcuate fasciculus:** A major white matter tract curving around the Sylvian fissure to connect temporal (Wernicke's) with frontal (Broca's) language areas — carries phonological information for repetition. Damage → conduction aphasia.

**Angular gyrus (BA 39, inferior parietal):**
- Cross-modal (visual-auditory-semantic) association
- Reading: Maps visual word forms onto phonological and semantic representations
- Calculation (acalculia), writing (agraphia), body naming (finger agnosia in Gerstmann's)

**Supramarginal gyrus (BA 40, inferior parietal):**
- Phonological processing and working memory (phonological loop)
- Part of the dorsal language stream

**Supplementary motor area (SMA, medial premotor):**
- Initiates spontaneous speech and voluntary vocalization
- SMA damage → akinetic mutism, reduced spontaneous speech with relatively preserved repetition (transcortical motor aphasia)

**Insula (insular cortex):**
- Articulatory programming — involved in apraxia of speech (with damage)
- Integration of motor and sensory aspects of speech

### Dual-Stream Language Model (Hickok and Poeppel)

A modern replacement for the classic Wernicke-Geschwind model:

**Dorsal stream:** Bilateral, left-dominant — superior temporal to frontal motor/premotor regions via arcuate fasciculus and SLF (superior longitudinal fasciculus). Function: Maps sound onto articulation; speech production, repetition, phonological processing. The dorsal stream is critical for effortful speech and learning to speak.

**Ventral stream:** Bilateral, right-dominant — posterior superior temporal to middle and inferior temporal regions. Function: Maps sound onto meaning; comprehension, semantic processing, recognition of familiar words. The ventral stream is critical for comprehension of familiar, meaningful speech.

## Aphasia: Acquired Language Disorders

Aphasia is an acquired language disorder from brain damage — affecting comprehension, production, repetition, naming, reading, and/or writing. NOT a disorder of intelligence or movement (distinguish from dysarthria/apraxia of speech).

### The Three Key Dimensions

All aphasia classification uses three clinical dimensions:
1. **Fluency:** Is spontaneous speech produced in normal-length phrases (fluent) or is it labored, halting, reduced in length (non-fluent)?
2. **Comprehension:** Does the patient understand spoken language (intact) or is comprehension impaired?
3. **Repetition:** Can the patient repeat spoken phrases accurately (intact) or is repetition impaired?

### Comprehensive Aphasia Classification Table

| Aphasia Type | Fluency | Comprehension | Repetition | Naming | Primary Lesion Site |
|--------------|---------|--------------|------------|--------|---------------------|
| Broca's | Non-fluent | Intact | Impaired | Impaired | Left IFG (BA 44/45) + adjacent premotor |
| Wernicke's | Fluent | Impaired | Impaired | Impaired | Left posterior STG (BA 22) |
| Conduction | Fluent | Intact | Impaired | Impaired | Arcuate fasciculus / supramarginal gyrus |
| Global | Non-fluent | Impaired | Impaired | Impaired | Large left MCA territory |
| Transcortical Motor | Non-fluent | Intact | **Intact** | Impaired | SMA / anterior to Broca's, left ACA territory |
| Transcortical Sensory | Fluent | Impaired | **Intact** | Impaired | Posterior/inferior to Wernicke's; watershed |
| Mixed Transcortical (Isolation) | Non-fluent | Impaired | **Intact** | Impaired | Bilateral watershed; CO poisoning |
| Anomic | Fluent | Intact | Intact | **Impaired** | Variable; often angular gyrus or temporal |

### Broca's Aphasia (Non-Fluent)
- Non-fluent, effortful speech — phrases are short (1-4 words), telegraphic (content words without function words/inflections), agrammatic
- Comprehension is relatively intact for simple sentences but impaired for grammatically complex sentences (passive, embedded clauses)
- Repetition impaired; naming impaired
- Phonological paraphasias (sound-based errors: "spoon" → "toon")
- Patient is typically aware of and frustrated by their errors — good prognosis for partial recovery
- Often with right hemiplegia (face/arm > leg) from adjacent motor cortex involvement
- Can also involve Broca's aphasia "by disconnection" from intact Broca's area

### Wernicke's Aphasia (Fluent)
- Fluent speech with normal phrase length and prosody, but often linguistically empty (paraphasias, neologisms) → jargon aphasia
- Semantic paraphasias: word substitutions from the same category ("fork" → "knife")
- Neologisms: completely invented non-words ("I want the flumper")
- Comprehension severely impaired — patient often unaware of errors (anosognosia for the aphasia)
- Repetition impaired; naming severely impaired
- No accompanying motor deficit (pure temporal lesion)
- Psychiatric misdiagnosis risk (florid jargon can resemble psychosis)

### Conduction Aphasia
- Fluent speech with intact comprehension but severely impaired repetition
- Lesion: Arcuate fasciculus (or supramarginal gyrus) — disconnects phonological input from production
- Frequent phonemic paraphasias during repetition attempts + CONDUITE D'APPROCHE (patient tries to correct errors, gets closer and closer to target word — approaching behavior)
- Naming impaired; reading aloud impaired; comprehension intact
- Prognosis generally good

### Transcortical Aphasias
The key feature: REPETITION IS INTACT (arcuate fasciculus preserved — the route from Wernicke's to Broca's is intact)
- TCMA: ACA territory (SMA, medial frontal) — non-fluent, intact comprehension, echolalia; patient can repeat in full sentences they cannot initiate spontaneously
- TCSA: Posterior watershed — fluent, impaired comprehension, intact repetition; often echolalic
- Mixed Transcortical (Isolation aphasia): Both ACA and PCA watershed areas (e.g., CO poisoning, cardiac arrest) — non-fluent, impaired comprehension, but able to REPEAT and complete songs/well-learned sequences (the isolated perisylvian language island)

### Anomic Aphasia
- Fluent, comprehension intact, repetition intact — only consistent deficit is ANOMIA (word-finding difficulty)
- Most common residual aphasia after recovery from any other type
- Also seen with angular gyrus lesions, temporal pole lesions, or as the sole feature of early Alzheimer's disease or primary progressive aphasia (logopenic variant)

## Types of Speech Errors (Paraphasias)

| Error Type | Description | Example | Typical Aphasia |
|------------|-------------|---------|----------------|
| Phonemic/literal paraphasia | Sound-based substitution/addition | "pork" for "fork", "spool" for "spoon" | Conduction, Broca's |
| Semantic/verbal paraphasia | Related word substituted | "fork" for "spoon", "chair" for "table" | Wernicke's |
| Neologistic paraphasia | Completely invented non-word | "flumper", "glig" | Severe Wernicke's |
| Circumlocution | Describing a word you can't retrieve | "The thing you eat with" (for fork) | Anomic aphasia |
| Perseveration | Repeating a previous response | Previous target word reappears | Frontal lesions, severe aphasia |

## Assessment Tools

**Boston Diagnostic Aphasia Examination (BDAE-3):** The gold standard comprehensive aphasia battery developed by Goodglass and Kaplan — assesses all language modalities with standardized scoring; classifies aphasia type; provides profiles for treatment planning.

**Western Aphasia Battery-Revised (WAB-R):** Yields the Aphasia Quotient (AQ) on a 100-point scale; also assesses reading, writing, and praxis; faster than BDAE; widely used clinically; well-validated.

**Boston Naming Test (BNT):** 60-item confrontation naming test; sensitive to anomia from any cause; normative data for age and education.

**Peabody Picture Vocabulary Test (PPVT-5):** Receptive vocabulary measure; useful when motor and expressive language are impaired.

## Related Disorders

### Dysarthria
Motor speech disorder from weakness, slowness, or incoordination of speech muscles — speech sounds are slurred, imprecise, or distorted, but LANGUAGE FORMULATION IS INTACT. Types based on lesion:
- Spastic (bilateral UMN): Strained-strangled voice, slow, nasal
- Ataxic (cerebellum): Irregular, scanning speech (equal stress on all syllables)
- Hypokinetic (Parkinson's): Soft, monotone, festinating; hypophonia
- Hyperkinetic (basal ganglia, e.g., Huntington's): Variable, irregular
- Flaccid (LMN, e.g., ALS, Guillain-Barré): Breathy, nasal, weak

### Apraxia of Speech (AOS)
Motor programming disorder affecting the sequencing of articulatory movements — distinct from dysarthria (strength is normal) and aphasia (language formulation is intact). Features: Inconsistent articulatory errors that worsen with longer/more complex utterances, improve with slower rate and repetition; groping/searching movements; trial-and-error self-corrections. Caused by left anterior insula and inferior premotor lesions.

### Reading Disorders (Dyslexia and Alexias)

**Developmental dyslexia:** A specific learning disorder in reading — the most common learning disability (~10% prevalence). Core deficit: phonological processing (segmenting and manipulating speech sounds). Neural basis: Reduced activation in left temporoparietal and occipito-temporal regions; reduced planum temporale leftward asymmetry; ectopias in perisylvian cortex.

**Acquired alexia (reading disorders from brain damage):**
- Pure alexia (alexia without agraphia): Reading severely impaired while writing is preserved; caused by left occipital lesion + splenium damage — disconnects the visual word form area from language areas; patients can write but cannot read what they just wrote
- Surface alexia: Cannot read irregular words (rely on phonics) — lexical (whole-word) reading route damaged
- Phonological alexia: Cannot read non-words (cannot use phonics) — phonological reading route damaged
- Deep dyslexia: Cannot read non-words AND makes semantic errors (reading "cat" as "dog") — both routes severely damaged, only semantic route partially intact

### Primary Progressive Aphasia (PPA)

A neurodegenerative syndrome in which language is the predominant area of decline (at least for the first 2 years):

| PPA Variant | Key Features | Brain Atrophy | Underlying Pathology |
|-------------|-------------|--------------|---------------------|
| Nonfluent/agrammatic (nfvPPA) | Effortful, agrammatic speech; motor speech features (AOS); relative comprehension sparing | Left frontal/premotor/insula | FTLD-tau (MAPT) or TDP-43 |
| Semantic (svPPA) | Fluent but semantically empty; severe anomia; impaired single-word comprehension; surface dyslexia/agraphia; semantic memory loss | Bilateral anterior temporal (L>R) | FTLD-TDP type C |
| Logopenic (lvPPA) | Slow speech with word-finding pauses; impaired single-word retrieval; impaired repetition of long phrases; relative comprehension sparing; no motor speech or agrammatism | Left temporoparietal | Alzheimer's disease pathology |`
    },
    {
      topicId: T["Apraxia & Agnosia"],
      title: "Apraxia & Agnosia — Study Guide",
      content: `## Overview and Definitions

### Apraxia
Apraxia is an acquired disorder of skilled, purposeful movement that cannot be explained by elementary motor deficits (weakness, paralysis, ataxia), sensory impairment, comprehension failure, or inattention. The patient knows what they are trying to do — the defect lies in the neural programs that specify how to do it.

**Key diagnostic principle:** Apraxia must be distinguished from:
- Weakness/paralysis (paresis) — the patient cannot move, not just poorly
- Sensory loss — would affect feedback-dependent movements
- Ataxia — uncoordinated but not an error in movement type
- Comprehension failure — a patient who doesn't understand the command cannot be tested for apraxia
- Dementia — global cognitive impairment complicates praxis testing

### Agnosia
Agnosia is the inability to recognize objects, people, sounds, or stimuli despite intact elementary perception (the sensory organs and basic perceptual processing are functional). The defect lies in higher-level recognition and meaning-attribution processes.

**Key diagnostic principle:** "Perception without recognition." The patient can perceive the stimulus (can copy a drawing, match objects) but cannot identify it. If the defect were purely perceptual, they could not copy or match.

## Types of Apraxia

### Ideomotor Apraxia (IMA)

**Definition:** Impaired ability to perform skilled limb movements to command or imitation, despite intact knowledge of what the movement should be and intact elementary motor function.

**Characteristics:**
- Spatial errors: Wrong hand posture, incorrect tool orientation, wrong relationship of hand to object
- Temporal errors: Poor sequencing, timing, or smoothness of movement
- Errors are more prominent on command, somewhat better with imitation, best with actual object use (the "command < imitation < object use" gradient)

**Testing:** Ask patient to:
- Pantomime tool use ("Show me how you would use a hammer/comb/toothbrush")
- Make communicative gestures ("Wave goodbye," "Salute," "Hitchhike")
- Imitate examiner's meaningless gestures (assess praxis limb movements free of semantic knowledge)

**Lesion:** Left parietal lobe (supramarginal gyrus, inferior parietal lobule) OR left premotor cortex — the "praxis representational system" is predominantly left hemisphere. Left-hemisphere lesions cause bilateral IMA (both hands affected, as right hemisphere cannot generate appropriate programs).

**Note on "praxis in the action production system" (Rothi et al.):** The left inferior parietal lobe stores "action production systems" — learned motor programs for tool use. Damage to the store → IMA when generating from command/imitation. Damage to the connection between the store and motor output → IMA on command/imitation but not actual use.

### Ideational Apraxia

**Definition:** Impaired ability to organize and sequence the logical ORDER of a multi-step activity involving tool use — a breakdown in the conceptual plan (what step comes next?) rather than the motor execution of individual steps.

**Characteristics:**
- The patient can often perform each individual step competently, but cannot organize them into a coherent sequence
- Errors: Steps done in wrong order, steps omitted, same step repeated, wrong object selected for a given step
- Example: Making a cup of tea — fills cup first, then adds bag, then pours water; or puts toothpaste on a spoon

**Lesion:** Bilateral posterior cerebral lesions, left temporoparietal, or diffuse dementia — ideational apraxia is commonly seen in Alzheimer's disease.

**Testing:** Ask patient to perform a multi-step real-object task (make toast, take medication, wrap a gift). Ideational errors are most apparent in complex real-world tasks, unlike ideomotor errors which are most apparent on command.

### Limb-Kinetic Apraxia

**Definition:** Loss of fine, dexterous, precisely timed limb movements — movements are slow, clumsy, and lack smoothness despite adequate strength.

**Characteristics:**
- Each movement element is performed, but without the finesse and timing of skilled movement
- Particularly affects independent finger movements and fine manipulation
- Contralateral to the lesion (unlike IMA which is typically bilateral)

**Lesion:** Contralateral primary motor cortex (M1) or immediately adjacent premotor cortex — often difficult to distinguish from mild corticospinal tract weakness.

**Clinical relevance:** Limb-kinetic apraxia is a core feature of corticobasal syndrome (CBS) — the "alien limb" phenomenon may be related.

### Oral/Buccofacial Apraxia

**Definition:** Inability to perform voluntary non-speech oral movements to command (e.g., "blow out a candle," "click your tongue," "stick out your tongue") despite intact reflexive oral movements (chewing, swallowing) and intact oral motor strength.

**Characteristics:**
- Oral movements to command are impaired, but automatic movements (chewing, coughing, blowing on hot food) are intact
- Often co-occurs with Broca's aphasia and apraxia of speech (but distinct from it)

**Lesion:** Left inferior premotor/frontal operculum — same area as Broca's aphasia; helps explain their co-occurrence after left MCA strokes.

**Testing:** "Show me how you would use a straw," "Pretend to blow out a candle," "Click your tongue."

### Oculomotor Apraxia

**Definition:** Inability to voluntarily direct gaze to a peripheral target — the patient cannot make a saccade to a target on command, though they can fixate once their eyes land on it by another route (head turn). Reflexive saccades (e.g., to sudden movement) may be preserved.

**Lesion:** Bilateral frontal eye fields (FEF) or posterior parietal cortex.

**Ocular motor apraxia is a component of Bálint's syndrome.**

### Constructional Apraxia

**Definition:** Impaired ability to draw, copy, or construct two- or three-dimensional figures or designs — errors in spatial organization and representation.

**Characteristics by laterality:**
- LEFT parietal lesion: Simplified, reduced detail, may omit elements — internal details lost, but overall shape maintained
- RIGHT parietal lesion: Severe disorganization, fragmented — overall shape lost, elements placed in wrong spatial relations; often more severe impairment

**Testing:** Copy a clock, a house, the Rey-O Complex Figure, geometric shapes. Constructional errors are assessed in all comprehensive neuropsychological evaluations.

### Gait Apraxia (Apraxia of Gait)

**Definition:** Severely impaired gait (gait "freezing," shuffling, magnetic gait) despite intact lower limb motor and sensory function when lying down.

**Lesion:** Bilateral frontal lobe or frontal white matter — associated with normal pressure hydrocephalus (NPH), multiple strokes, leukodystrophies.

**Clinical distinction:** NPH triad: magnetic gait (widened base, short shuffling steps, feet "stuck to floor") + urinary incontinence + dementia. Treated with ventriculoperitoneal shunt.

## Bálint's Syndrome

Bálint's syndrome results from bilateral posterior parieto-occipital lesions — disrupting the interface between visual perception and spatial cognition:

**Three Components:**

1. **Simultanagnosia:** Cannot perceive more than one object at a time — "forest but not the trees" is reversed (they see individual trees but cannot perceive the forest). Patient can identify one object at a time but cannot integrate multiple elements into a scene. With a picture of a cat sitting on a chair: sees the cat OR the chair but not both simultaneously.

2. **Optic ataxia:** Misreaching for visually guided targets — the patient can identify an object but cannot accurately direct the hand toward it under visual guidance. Distinct from cerebellar ataxia (no incoordination otherwise). Reflects dysfunction of the dorsal stream's transformation of spatial visual information into motor commands.

3. **Oculomotor apraxia:** Voluntary gaze shifts to peripheral targets are impaired — the patient cannot voluntarily look at a target despite wanting to; head-turning may be used as a compensatory strategy.

## Types of Agnosia

### Visual Agnosias

**Apperceptive visual agnosia:**
- **Level of failure:** Perceptual — the patient cannot form a stable, accurate percept of the object
- **Hallmark:** Cannot match or copy objects correctly (fails the basic perceptual requirement)
- Cannot recognize objects from any viewpoint; cannot sort by shape
- Caused by bilateral occipital damage (diffuse, e.g., CO poisoning, bilateral PCA strokes, anoxia)
- Patient is NOT blind (can detect edges, motion, light) but perceptual synthesis fails

**Associative visual agnosia:**
- **Level of failure:** Semantic — can form the percept (can copy and match objects accurately) but cannot access meaning/identity
- Has the "percept" but it is "stripped of meaning"
- Can match objects accurately but cannot name or describe their function
- Caused by left temporal-occipital disconnection (visual processing → semantic memory disconnection)

**Object agnosia:** Cannot recognize everyday objects — either apperceptive or associative.

**Prosopagnosia (Face agnosia):**
- Cannot recognize FAMILIAR FACES despite intact face perception — cannot identify family members, celebrities, or their own face in photographs by sight alone
- Relies on non-facial cues: voice, gait, hairstyle, context
- Often intact low-level face processing (can perceive faces, detect facial expressions)
- Lesion: Bilateral fusiform gyrus (fusiform face area, FFA) — usually temporal-occipital; right unilateral can cause transient prosopagnosia; some developmental (congenital) cases without clear lesion
- Associated with difficulty recognizing other highly similar within-category items (cars in car experts, birds in birders) — experts use the same FFA network

**Category-specific agnosia:** Agnosia selective for one semantic category:
- Living things (animals, plants, faces) with intact nonliving things (tools, vehicles) — OR vice versa
- Reflects the distributed organization of semantic knowledge in the temporal lobe (biological knowledge: medial and inferior temporal; functional/tool knowledge: more lateral and frontal)

**Achromatopsia (cortical color blindness):**
- Acquired inability to perceive color despite intact color detection — sees in shades of gray
- Lesion: Bilateral V4 (color area in lingual and fusiform gyri) — from bilateral PCA strokes
- Different from: Color anomia (can match colors but cannot name them) and color agnosia (poor color-concept matching)

**Akinetopsia:** Acquired inability to perceive motion — the world appears as still frames (like a stroboscopic effect)
- Lesion: Bilateral V5/MT — very rare condition
- Cannot track moving objects; cannot see water pouring into a glass (appears frozen)

### Hemispatial Neglect

**Definition:** Failure to attend to or respond to stimuli on one side of space — not due to sensory or motor deficit.

**Characteristics:**
- Right hemisphere lesions (especially right parietal lobe) cause more severe and persistent left neglect than left hemisphere lesions cause right neglect
- Explains asymmetry: Right hemisphere attends to BOTH sides; left hemisphere only attends to the right side. So right hemisphere damage = only left hemisphere attends = right side only = left neglect
- Multiple forms of neglect: Personal neglect (own body), peripersonal neglect (nearby space), extrapersonal neglect (far space); allocentric vs. egocentric reference frames

**Testing:**
- Line bisection: Patient bisects horizontal lines — neglect patients bisect to the RIGHT of center
- Cancellation (stars, letters): Patient marks targets on a page — neglect patients miss left-side targets
- Drawing: Asked to draw a clock, flower, house — left side is omitted or underrepresented
- Reading: Neglects left side of words (parahemianopia)

**Anosognosia:** Unawareness of one's own neurological deficit — may deny being paralyzed (Anton-Babinski), or deny being blind (Anton's syndrome). More common with right hemisphere lesions. Important for rehabilitation planning and safety (patient may attempt to walk despite paralysis).

### Auditory Agnosia

**Pure word deafness:** Cannot recognize spoken words despite intact hearing of non-speech sounds — the patient can hear that someone is speaking but cannot decode the words; reading and writing are preserved. Rare; bilateral superior temporal lesions.

**Auditory agnosia for non-speech:** Cannot recognize environmental sounds (a dog barking, a phone ringing) but can recognize speech — double dissociation from pure word deafness.

**Amusia (tone deafness):** Inability to recognize or reproduce musical tones — right hemisphere lesions are more likely to impair melody recognition; left to impair rhythm. Acquired from stroke or tumor.

## The Alien Hand Sign

The alien hand (anarchic hand) is a striking phenomenon where one hand performs involuntary, goal-directed actions that are contrary to the patient's intentions — as if the hand has a will of its own. Two main types:

**Callosal alien hand (posterior variant):** From corpus callosum lesion — typically the LEFT hand (under right hemisphere control) reaches, grasps, or undoes what the right hand is doing; related to release from left hemisphere supervision.

**Frontal alien hand (anterior variant):** From medial frontal lesion — the hand may grasp and not release (groping reflex), reach reflexively for objects, or perform simple repetitive movements. Seen in corticobasal syndrome (CBS) as an early, very asymmetric feature.`
    },
    {
      topicId: T["Neurocognitive Disorders"],
      title: "Neurocognitive Disorders — Study Guide",
      content: `## Overview and Classification

Neurocognitive disorders (NCDs) are conditions characterized by acquired cognitive decline from a prior level of performance — representing a departure from baseline functioning. DSM-5 distinguishes two severity levels:

**Minor Neurocognitive Disorder (Mild Cognitive Impairment, MCI):** Modest cognitive decline (typically 1-2 SD below normative mean on testing) that does NOT impair functional independence. The patient compensates with strategies, takes longer, or requires more effort — but manages independently. MCI is a high-risk state for progression to dementia.

**Major Neurocognitive Disorder (Dementia):** Substantial cognitive decline (typically >2 SD) that DOES impair functional independence — the patient requires assistance with everyday activities (initially instrumental, then basic ADLs). Cognitive decline is documented by history AND objective testing.

## Alzheimer's Disease (AD)

### Epidemiology
AD is the most common cause of dementia, accounting for 60-70% of all dementia cases. ~6.7 million Americans have AD (2023), with prevalence doubling every 5 years after age 65: ~5% at 65-74, ~13% at 75-84, ~33% at 85+. The 2nd leading cause of death in adults over 65 in the US. Women are disproportionately affected (not only due to longer life expectancy but possibly due to hormonal and genetic factors).

### Pathophysiology: The Amyloid Cascade Hypothesis

**Amyloid-beta (Aβ):** APP (amyloid precursor protein) is cleaved by β-secretase (BACE1) and γ-secretase (presenilin complex) → Aβ40/42 peptides. Aβ42 is more hydrophobic and prone to aggregation → oligomers → protofibrils → amyloid plaques (senile plaques, neuritic plaques). Oligomers are the most neurotoxic species (not the plaques themselves).

**Tau neurofibrillary tangles (NFTs):** In normal neurons, tau protein stabilizes microtubules in axons. In AD, tau becomes hyperphosphorylated → detaches from microtubules (which collapse) → tau pairs into helical filaments → NFTs. NFTs accumulate in a stereotyped pattern (Braak staging: I-II = transentorhinal; III-IV = limbic; V-VI = neocortex).

**Neuroinflammation:** Activated microglia and astrocytes release IL-1β, TNF-α, complement proteins — initially phagocytosing Aβ but chronically contributing to synaptic damage. APOE4 impairs Aβ clearance and promotes neuroinflammation.

**Synaptic failure and neuronal loss:** The final common pathway — synaptic density loss is the best correlate of cognitive impairment in AD (not plaque or tangle burden per se). Loss of cholinergic neurons in the NBM is an early feature.

### Genetic Risk Factors

**Sporadic AD (>90% of cases):** APOE genotype is the largest risk factor:
- APOE ε4: 1 copy → ~3x increased risk; 2 copies → ~8-12x increased risk
- APOE ε2: PROTECTIVE (reduces risk by ~40% vs ε3)
- APOE ε3: Neutral (most common allele)
APOE4 impairs Aβ clearance, promotes tau pathology, and accelerates neuroinflammation.

**Familial/Early-Onset AD (<1% of all AD; onset often <65):**
- PSEN1 (presenilin-1): Most common FAD gene (~400 mutations); autosomal dominant; causes early-onset AD (often 30s-50s) by altering γ-secretase → increased Aβ42/Aβ40 ratio
- PSEN2 (presenilin-2): Rarer; slightly later onset than PSEN1
- APP mutations: Around the β- and γ-secretase cleavage sites; autosomal dominant; cause overproduction of Aβ42. APP is on chromosome 21 — explains why Down syndrome patients develop AD pathology by age 40 (trisomy 21 = 3 copies of APP gene)

### The A/T/N Biomarker Framework (NIA-AA, 2018)

Allows biological staging of AD independent of clinical symptoms:
- **A (Amyloid):** CSF Aβ42 decreased (trapped in plaques); Amyloid PET positive (amyloid tracers: florbetapir, florbetaben, flutemetamol)
- **T (Tau):** CSF phospho-tau elevated; Tau PET positive (tau tracers: flortaucipir)
- **N (Neurodegeneration):** FDG-PET hypometabolism (temporoparietal); Structural MRI atrophy (hippocampus, entorhinal cortex); CSF total-tau elevated

A+/T+/N- = AD without neurodegeneration; A+/T+/N+ = full AD pathology. This allows identification of preclinical AD (biomarker-positive but cognitively normal) — the primary target for disease-modifying trials.

### Clinical Staging

**Preclinical AD:** Biomarker-positive but cognitively normal (A+ stage); no subjective or objective impairment.

**Prodromal AD (MCI due to AD):** Subjective memory complaint + objective episodic memory impairment (especially delayed recall) + biomarker evidence of AD + functional independence maintained.

**Mild AD:** Episodic memory impairment prominent; some difficulties with complex IADLs (managing finances, medications); still largely independent.

**Moderate AD:** Multiple cognitive domains impaired; significant IADL impairment; requires assistance with basic ADLs; behavioral symptoms emerge (wandering, sleep disturbance, agitation).

**Severe AD:** Profoundly impaired across all domains; completely dependent; minimal verbal output (may reduce to a few words or no speech); bed-bound in terminal stages; death usually from aspiration pneumonia.

**CDR (Clinical Dementia Rating):** Standardized global staging of dementia — 6 domains rated 0-3; sum of boxes (CDR-SB) provides more sensitive change detection for clinical trials.

### Characteristic Neuropsychological Profile

| Domain | Typical Finding |
|--------|----------------|
| Episodic memory | First and most severely impaired — encoding deficit (rapid forgetting); poor delayed recall; little benefit from cuing |
| Language | Anomia emerges early; semantic paraphasias; semantic fluency worse than letter fluency |
| Executive function | Impaired later; frontal symptoms more prominent in moderate-severe stages |
| Visuospatial | Impaired in moderate stages |
| Attention | Mildly impaired early; severe disruption late |
| Procedural memory | Relatively spared until late stages |
| Insight | Progressively impaired (anosognosia for deficits) |

### Treatment

**Cholinesterase inhibitors (AChEIs):** Donepezil (Aricept), rivastigmine (Exelon), galantamine (Razadyne) — inhibit AChE → increase synaptic ACh. Used for mild-moderate AD. Modest symptomatic benefits (0.5-1.5 points on MMSE scales); side effects: GI (nausea, diarrhea), bradycardia, vivid dreams, syncope.

**Memantine (Namenda):** NMDA receptor antagonist (uncompetitive — blocks the channel under conditions of sustained activation but not brief physiological activation) → reduces excitotoxic burden. Used for moderate-severe AD; can be combined with AChEIs.

**Anti-amyloid immunotherapies:** Lecanemab (Leqembi, FDA-approved 2023) and donanemab — monoclonal antibodies targeting Aβ plaques; reduce amyloid burden significantly; modest slowing of clinical progression (~27-35% slowing of CDR-SB decline); risk: ARIA (amyloid-related imaging abnormalities — edema and microhemorrhages). Most effective in early stages.

## Vascular Dementia

Second most common cause of dementia (~15-20%). Caused by cerebrovascular disease — strokes, lacunar infarcts, white matter disease (leukoaraiosis from small vessel disease), or strategic infarcts.

**Clinical features:**
- Stepwise cognitive decline (worsens after each stroke event) — distinct from gradual AD decline
- Prominent executive dysfunction and processing speed slowing (frontal-subcortical circuit damage)
- Focal neurological signs (lateralizing weakness, gait impairment)
- Neuroimaging: White matter hyperintensities, lacunar infarcts, evidence of ischemic lesions

**Vascular cognitive impairment without dementia (VCI):** Many patients have cognitive impairment from small vessel disease without meeting dementia criteria — an important risk state.

## Dementia with Lewy Bodies (DLB)

**Core features (≥2 = probable DLB):**
- Fluctuating cognition with pronounced variation in alertness and attention
- Recurrent visual hallucinations (typically well-formed, detailed — people or animals)
- REM sleep behavior disorder (often preceding dementia by years)
- Parkinsonism (bradykinesia, rigidity, tremor)

**Supportive features:** Severe neuroleptic sensitivity (typical antipsychotics can cause irreversible worsening — dangerous — use only quetiapine/clozapine if needed), reduced dopamine transporter on DAT-SPECT, low uptake on MIBG cardiac scintigraphy.

**The 1-year rule:** If parkinsonism precedes dementia by >1 year → PD Dementia (PDD); if dementia precedes or occurs within 1 year of parkinsonism → DLB. The biological distinction is unclear; the pathologies (alpha-synuclein Lewy bodies) are identical.

**Neuropsychological profile:** Prominent attention fluctuation, visuospatial deficits (worse than AD for stage), executive dysfunction — memory relatively preserved compared to AD.

## Frontotemporal Dementia (FTD)

A group of non-Alzheimer's neurodegenerative dementias with selective frontal and temporal lobe atrophy. Second most common dementia in those under 65.

**Behavioral variant FTD (bvFTD):**
- Early personality change and behavioral disinhibition (socially inappropriate behavior, impulsivity)
- Apathy, loss of empathy, perseverative/stereotyped behaviors
- Hyperorality (dietary changes, preference for sweets, oral exploration of objects)
- Executive dysfunction prominent; memory often relatively spared early
- Brain: Bilateral frontal > temporal atrophy; often right-predominant early

**Primary Progressive Aphasias (PPA):** See Language Processing study guide for nfvPPA, svPPA, and lvPPA.

**Pathology:** Heterogeneous — FTLD-TDP (most common: TDP-43 inclusions), FTLD-tau (Pick's disease: 3R tau; CBD, PSP: 4R tau; MAPT mutations), FTLD-FUS.

**Genetics:** ~40% have family history; C9orf72 hexanucleotide repeat expansion most common pathogenic variant (also causes ALS); MAPT and GRN mutations.

## Movement Disorder Dementias

**Parkinson's Disease Dementia (PDD):** ~80% of PD patients develop dementia after 20 years. Frontal-subcortical pattern: executive dysfunction, attention impairment, visuospatial difficulties, behavioral problems. Memory less affected than in AD (retrieval > encoding deficit).

**Progressive Supranuclear Palsy (PSP):** PSP-Richardson syndrome (most common): Downward vertical gaze palsy (cardinal feature), backward falls, axial rigidity, pseudobulbar palsy (emotional incontinence), frontal-subcortical dementia. Pathology: 4R tau accumulation in neurons and glia (tuft-shaped astrocytes, coiled bodies, NFTs). Poor prognosis: death within ~7 years.

**Corticobasal Syndrome (CBS):** Highly asymmetric presentation — unilateral limb apraxia, rigidity, myoclonus, cortical sensory loss, alien limb, dementia. CBS is a clinical syndrome — the pathology may be CBD (4R tau), PSP, or AD.

**Huntington's Disease:** Autosomal dominant CAG repeat expansion in the HTT gene on chromosome 4 — trinucleotide repeat disorder (anticipation: expands and worsens with generations). Striatal (caudate) neurodegeneration → subcortical dementia, chorea, personality changes, psychiatric symptoms (depression, irritability, psychosis), and motor decline. Mean onset: 35-44; invariably fatal.

## Traumatic Brain Injury (TBI)

### Severity Classification (GCS)
Glasgow Coma Scale: Eye opening (1-4) + Verbal (1-5) + Motor (1-6) = 3-15
- Mild TBI (concussion): GCS 13-15; LOC <30 min; PTA <24h
- Moderate TBI: GCS 9-12; LOC 30 min-24h; PTA 1-7 days
- Severe TBI: GCS ≤8; LOC >24h; PTA >7 days

### Post-Concussion Syndrome (PCS)
Persistent symptoms after mild TBI — headache (most common), dizziness, fatigue, cognitive complaints ("brain fog," memory, concentration), mood changes, sleep disturbance. Typically resolves within 1-3 months; ~15-20% have symptoms beyond 3 months (persistent PCS). Biopsychosocial model: injury + pre-existing vulnerability (anxiety, depression, prior TBI) + psychosocial factors (compensation, litigation, secondary gain) + behavioral factors.

**Second Impact Syndrome:** A second concussion before the first has fully resolved — can cause catastrophic cerebral edema due to impaired vascular autoregulation; potentially fatal; predominantly seen in adolescent athletes. Basis for return-to-play protocols.

**Chronic Traumatic Encephalopathy (CTE):** A tauopathy found at autopsy in former athletes (football, boxing) and military veterans with repetitive head impacts — NOT diagnosable in vivo (diagnosis requires neuropathology). Biomarkers being developed. Clinical features: Behavioral/mood changes, cognitive decline. Causal link to repetitive head impacts is strongly supported.

## Prion Diseases

### Creutzfeldt-Jakob Disease (CJD)
A rare (~1 per million/year) but rapidly progressive and uniformly fatal prion disease.

**Pathophysiology:** Misfolded prion protein (PrPSc) acts as a template, converting normal PrP (PrPC) into misfolded form — cascading "protein-only" infection (no DNA or RNA required). Misfolded PrP is resistant to protease degradation → accumulates → spongiform encephalopathy (vacuolation of brain tissue).

**Clinical features:** Rapidly progressive dementia (weeks to months → death usually within 1 year), myoclonus (pathognomonic for CJD when rapid dementia is present), ataxia, visual disturbances (in Heidenhain variant), behavioral changes, akinetic mutism terminally.

**Diagnostic features:**
- EEG: Periodic sharp wave complexes (1-2 Hz) — not specific but suggestive
- MRI (DWI): Cortical ribboning, basal ganglia hyperintensity
- CSF: 14-3-3 protein elevated (marker of rapid neuronal destruction); RT-QuIC (real-time quaking-induced conversion) — highly sensitive and specific for prion disease
- Brain biopsy/autopsy: Spongiform changes, PrPSc immunostaining

**Types:**
- Sporadic CJD (sCJD): Most common (85%); no clear etiology; usually affects those 55-75
- Familial CJD: PRNP gene mutations (~10-15%)
- Variant CJD (vCJD): From bovine spongiform encephalopathy (mad cow disease) exposure; affects younger patients; predominant psychiatric features early

### Other Prion Diseases
- Fatal familial insomnia (FFI): Thalamic degeneration, refractory insomnia, dysautonomia
- Gerstmann-Sträussler-Scheinker disease (GSS): PRNP mutation; ataxia-prominent
- Kuru: Ritual cannibalism in Papua New Guinea (now eliminated)

## Neurocognitive Assessment Tools

| Tool | Purpose | Domain |
|------|---------|--------|
| MMSE | Brief screening (30 points) | Global cognition — not sensitive for MCI |
| MoCA | Sensitive MCI/dementia screen (30 points) | Global cognition + executive/visuospatial |
| CDR | Severity staging | Global dementia staging |
| GDS (Reisberg) | 7-stage severity scale | Global severity for research |
| NPI | Behavioral/psychological symptoms | Neuropsychiatric inventory for BPSD |
| FAST | Functional assessment staging | Functional decline staging (AD) |
| DRS-2 | Comprehensive battery | Attention, Initiation, Construction, Conceptualization, Memory |
| RBANS | Brief neuropsychological battery | 12 subtests — 5 cognitive domains |

## Neurocognitive Disorders in Special Populations

### HIV-Associated Neurocognitive Disorder (HAND)
HIV enters the CNS via infected macrophages/microglia — releases neurotoxic viral proteins (gp120, Tat) and provokes neuroinflammation. HAND exists on a spectrum:
- Asymptomatic NCI: Cognitive deficits on testing but no functional impact
- Mild NCI: Mild functional impact
- HIV-associated dementia (HAD): Major NCI — most severe form, largely eliminated by cART

**Treatment:** Combination antiretroviral therapy (cART) is the primary treatment — viral suppression improves neurocognitive function and prevents HAD.

### Normal Pressure Hydrocephalus (NPH)
The classic triad: Gait disturbance (magnetic/apraxic gait — first and most prominent), urinary incontinence, cognitive impairment (executive, attentional).

**Pathophysiology:** CSF circulation impaired → ventricles enlarge (dilated but opening pressure normal on LP) → periventricular white matter compression → gait circuit disruption. The cortex is relatively spared early.

**Diagnosis:** MRI showing ventricular enlargement out of proportion to sulcal atrophy (Evans' index >0.3); LP large-volume tap test (removing 30-50 mL CSF) → if gait improves transiently → positive tap test → good surgical candidate.

**Treatment:** Ventriculoperitoneal (VP) shunt — gait improves most (and quickly), incontinence improves next, cognitive symptoms least reliably. Most successful in patients identified early.`
    },
  ];
  await db.insert(studyGuidesTable).values(studyGuides);

  // ===========================================================================
  // PRACTICE EXAMS (1 per topic, each using 5 questions from that topic's quiz)
  // ===========================================================================
  // Group inserted questions by topicId
  const questionsByTopic: Record<number, number[]> = {};
  for (const q of insertedQuestions) {
    if (!questionsByTopic[q.topicId]) questionsByTopic[q.topicId] = [];
    questionsByTopic[q.topicId].push(q.id);
  }

  const examDefs = [
    { topicId: T["Neuropsychology Overview"], title: "Neuropsychology Overview — Practice Exam" },
    { topicId: T["Cell Biology & Neuron Anatomy"], title: "Cell Biology & Neuron Anatomy — Practice Exam" },
    { topicId: T["Neurotransmitters & Synaptic Transmission"], title: "Neurotransmitters & Synaptic Transmission — Practice Exam" },
    { topicId: T["Sensory Pathways"], title: "Sensory Pathways — Practice Exam" },
    { topicId: T["Sensory Systems"], title: "Sensory Systems — Practice Exam" },
    { topicId: T["Limbic System & Motivation"], title: "Limbic System & Motivation — Practice Exam" },
    { topicId: T["Sleep & Circadian Rhythms"], title: "Sleep & Circadian Rhythms — Practice Exam" },
    { topicId: T["Endocrine System & Reproduction"], title: "Endocrine System & Reproduction — Practice Exam" },
    { topicId: T["Psychopharmacology"], title: "Psychopharmacology — Practice Exam" },
    { topicId: T["Psychological Disorders"], title: "Psychological Disorders — Practice Exam" },
    { topicId: T["Personality Disorders"], title: "Personality Disorders — Practice Exam" },
    { topicId: T["ADHD & Medications"], title: "ADHD & Medications — Practice Exam" },
    { topicId: T["Language Processing & Aphasia"], title: "Language Processing & Aphasia — Practice Exam" },
    { topicId: T["Apraxia & Agnosia"], title: "Apraxia & Agnosia — Practice Exam" },
    { topicId: T["Neurocognitive Disorders"], title: "Neurocognitive Disorders — Practice Exam" },
  ];

  const insertedExams = await db.insert(practiceExamsTable).values(
    examDefs.map(e => ({
      topicId: e.topicId,
      title: e.title,
      timeLimit: 600,
      passingScore: 70,
    }))
  ).returning();

  const examQuestionLinks = [];
  for (const exam of insertedExams) {
    const qIds = questionsByTopic[exam.topicId] ?? [];
    const selected = qIds.slice(0, 5);
    for (let i = 0; i < selected.length; i++) {
      examQuestionLinks.push({
        examId: exam.id,
        questionId: selected[i],
        questionOrder: i + 1,
      });
    }
  }

  if (examQuestionLinks.length > 0) {
    await db.insert(practiceExamQuestionsTable).values(examQuestionLinks);
  }

  console.log("✅ Seed complete (course notes + supplementary content):");
  console.log(`   ${flashcards.length} flashcards (${topics.length} topics × 50 cards each)`);
  console.log(`   ${quizQuestionsToInsert.length} quiz questions`);
  console.log(`   ${studyGuides.length} study guides`);
  console.log(`   ${insertedExams.length} practice exams`);
}

seed()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
