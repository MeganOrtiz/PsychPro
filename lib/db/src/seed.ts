import { db } from "./index";
import { topicsTable, flashcardsTable, quizQuestionsTable, studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable } from "./schema";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding NeuroNotes from course notes...");

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
Neuropsychology is the scientific study of brain-behavior relationships — how the structure and function of the brain influence cognition, emotion, and behavior. Neuropsychologists use standardized assessment to understand how brain damage, disease, or dysfunction affects thinking and everyday functioning.

## Core Brain Regions and Their Functions
**Frontal lobe:** Executive functions (planning, working memory, inhibition, set-shifting), voluntary motor control via the primary motor cortex (precentral gyrus). The prefrontal cortex is the seat of higher reasoning and personality.

**Parietal lobe:** Somatosensory processing (postcentral gyrus), visuospatial integration, math and calculation, attention. The left parietal is involved in language.

**Temporal lobe:** Auditory processing (Heschl's gyri), language comprehension (Wernicke's area — posterior superior temporal gyrus), memory encoding (medial temporal lobe/hippocampus), and face/object recognition.

**Occipital lobe:** Primary visual cortex — processes basic visual features; damage causes cortical blindness, visual agnosias.

## Key Principles
**Contralateral organization:** Most motor and sensory pathways cross — the right hemisphere controls the left body and vice versa.

**Lateralization:** Language is left-hemisphere dominant in ~95% of right-handers. Visuospatial processing is typically right-hemisphere dominant.

**Double dissociation:** Evidence that two functions are truly independent — Patient A impaired on X but not Y; Patient B impaired on Y but not X.

**Diaschisis:** Transient loss of function in brain regions remote from an injury due to disrupted connections — the area is intact but deafferented.

**Cognitive reserve:** Built through education, occupational complexity, and social engagement — buffers against cognitive decline by providing alternative neural strategies.

## Assessment Concepts
**Hold vs. no-hold tests:** Hold tests (vocabulary, fund of knowledge, information) are resistant to brain damage and estimate premorbid IQ. No-hold tests (digit span, processing speed, block design) are sensitive to current impairment.

**Ecological validity:** The extent to which test performance predicts real-world functional abilities — important for treatment planning and capacity evaluations.

**Base rates:** The frequency of a finding in the general population — critical for determining whether a low score is truly abnormal or commonly seen in healthy individuals.

**Statistical vs. clinical significance:** A statistically significant result is unlikely due to chance; a clinically significant result is meaningful for patient functioning — both must be considered together.`
    },
    {
      topicId: T["Cell Biology & Neuron Anatomy"],
      title: "Cell Biology & Neuron Anatomy — Study Guide",
      content: `## Neuron Structure
A neuron has three main parts:
- **Dendrites:** Branching processes that receive synaptic input
- **Cell body (soma):** Contains the nucleus and metabolic machinery
- **Axon:** Single long process that transmits signals to other neurons; begins at the axon hillock

## Resting Membrane Potential
The resting potential is approximately **-70 mV** — the inside of the cell is more negative than the outside. This is maintained by:
- **Na+/K+ ATPase pump:** Pumps 3 Na+ out and 2 K+ in (net negative charge inside)
- **Selective permeability:** The resting membrane is more permeable to K+ than Na+

## Action Potential
The action potential is an **all-or-none** electrical signal triggered when membrane potential reaches threshold (~-55 mV).
1. **Depolarization:** Voltage-gated Na+ channels open → Na+ rushes in → membrane rises to +40 mV
2. **Repolarization:** Na+ channels inactivate; K+ channels open → K+ rushes out → membrane returns to negative
3. **Hyperpolarization (undershoot):** Membrane briefly more negative than resting → then returns to -70 mV

**Refractory periods:**
- Absolute: No stimulus can trigger another AP (Na+ channels inactivated)
- Relative: Stronger-than-normal stimulus required (partial recovery)

## Saltatory Conduction
Myelin (from oligodendrocytes in CNS; Schwann cells in PNS) insulates the axon. Action potentials **jump** between unmyelinated nodes of Ranvier — greatly increasing conduction velocity. Multiple sclerosis destroys myelin, slowing conduction.

## Synaptic Integration
**EPSP (Excitatory PostSynaptic Potential):** Graded depolarization toward threshold
**IPSP (Inhibitory PostSynaptic Potential):** Graded hyperpolarization away from threshold
**Spatial summation:** Multiple simultaneous inputs add together
**Temporal summation:** Rapid repeated inputs from one synapse add together

## Glial Cells
| Cell | Location | Function |
|------|----------|----------|
| Astrocytes | CNS | Support, BBB, synaptogenesis, ion buffering |
| Oligodendrocytes | CNS | Myelin production |
| Schwann cells | PNS | Myelin production |
| Microglia | CNS | Immune defense |
| Ependymal cells | CSF linings | CSF production and circulation |`
    },
    {
      topicId: T["Neurotransmitters & Synaptic Transmission"],
      title: "Neurotransmitters & Synaptic Transmission — Study Guide",
      content: `## Synaptic Transmission
1. Action potential arrives at axon terminal
2. Depolarization opens voltage-gated Ca2+ channels
3. Ca2+ triggers vesicle fusion and neurotransmitter release into the synapse
4. Neurotransmitter binds to postsynaptic receptors
5. Terminated by: reuptake, enzymatic degradation, or diffusion

## Major Neurotransmitters
**Glutamate:** Primary excitatory NT; acts on AMPA (fast), NMDA (coincidence detector — requires depolarization + ligand), and kainate receptors. Critical for LTP and memory.

**GABA:** Primary inhibitory NT; GABA-A (ionotropic, Cl- channel — fast), GABA-B (metabotropic — slow). Targeted by benzodiazepines, alcohol, and barbiturates.

**Dopamine (DA):** Reward, movement, cognition. Pathways:
- Mesolimbic (VTA → nucleus accumbens): reward, motivation
- Mesocortical (VTA → PFC): working memory, executive function — reduced in schizophrenia negative symptoms
- Nigrostriatal (SNc → striatum): motor control — depleted in Parkinson's
- Tuberoinfundibular: inhibits prolactin

**Serotonin (5-HT):** From raphe nuclei; regulates mood, sleep, appetite, impulse control. Low 5-HT linked to depression.

**Norepinephrine (NE):** From locus coeruleus; regulates arousal, attention, fight-or-flight. Implicated in depression and PTSD.

**Acetylcholine (ACh):** Neuromuscular junction, ANS, memory. Cholinergic loss → Alzheimer's disease.

## Receptor Types
| Type | Speed | Example |
|------|-------|---------|
| Ionotropic | Fast (ms) | AMPA, GABA-A, nACh |
| Metabotropic (GPCR) | Slow (s-min) | mGluR, D1/D2, 5-HT1 |

## Key Concepts
**Autoreceptors:** Presynaptic receptors that detect the neuron's own NT → negative feedback, inhibiting further release.

**Long-term potentiation (LTP):** Persistent strengthening of synapses after high-frequency stimulation — the cellular basis of learning and memory; depends on NMDA receptor activation.

**Dopamine hypothesis of schizophrenia:** Excess DA in mesolimbic (positive symptoms) + reduced DA in mesocortical (negative symptoms).`
    },
    {
      topicId: T["Sensory Pathways"],
      title: "Sensory Pathways — Study Guide",
      content: `## Ascending Sensory Pathways
**Dorsal Column-Medial Lemniscal Pathway:**
- Carries: Fine touch, vibration, two-point discrimination, proprioception
- Course: Ipsilateral in spinal cord → nucleus gracilis/cuneatus in medulla → crosses (decussates) → medial lemniscus → thalamus (VPL) → somatosensory cortex
- Clinical note: Dorsal column lesion → ipsilateral loss of fine touch/proprioception below lesion

**Spinothalamic Tract (Anterolateral System):**
- Carries: Pain and temperature (lateral); crude touch and pressure (anterior)
- Course: Enters spinal cord → **immediately crosses** in anterior commissure → ascends contralaterally → thalamus (VPL) → somatosensory cortex
- Clinical note: Spinothalamic lesion → contralateral loss of pain/temperature below lesion

## Brown-Séquard Syndrome (Spinal Hemisection)
| Side | Deficit | Pathway |
|------|---------|---------|
| Ipsilateral | Fine touch/proprioception loss | Dorsal column (crosses in medulla) |
| Contralateral | Pain/temperature loss | Spinothalamic (crosses immediately) |
| Ipsilateral | Motor weakness (UMN) | Corticospinal |

## Descending Motor Pathways
**Corticospinal tract:** Motor cortex (precentral gyrus) → corona radiata → internal capsule → cerebral peduncles → **crosses in medullary pyramids** → lateral corticospinal tract → anterior horn motor neurons → muscles
- UMN lesion: Spasticity, hyperreflexia, Babinski sign, minimal muscle wasting
- LMN lesion: Flaccidity, hyporeflexia, muscle atrophy, fasciculations

## Thalamic Relay
- **VPL (ventral posterior lateral):** Body somatosensory
- **VPM (ventral posterior medial):** Face somatosensory
- **LGN (lateral geniculate):** Visual
- **MGN (medial geniculate):** Auditory
- Olfaction: The ONLY sense that bypasses the thalamus

## Dermatomes
Areas of skin innervated by single spinal nerve roots — used to localize spinal cord or root lesions clinically.

## Cerebellum
The cerebellum receives motor commands (efference copy) and proprioceptive feedback — compares intended vs. actual movement and corrects errors in real time. Damage → ataxia, dysmetria, intention tremor.`
    },
    {
      topicId: T["Sensory Systems"],
      title: "Sensory Systems — Study Guide",
      content: `## Visual System
**Pathway:** Retina → optic nerve → optic chiasm (nasal fibers cross) → optic tract → LGN of thalamus → optic radiations → primary visual cortex (V1, calcarine fissure, occipital lobe)

**Visual field defects:**
- Optic nerve lesion: Monocular blindness
- Optic chiasm lesion: Bitemporal hemianopia
- Optic tract/cortex lesion: Homonymous hemianopia

**Visual streams:**
- Dorsal stream ("where/how"): V1 → parietal cortex — spatial location and action guidance
- Ventral stream ("what"): V1 → temporal cortex — object identity, color, faces

## Auditory System
**Pathway:** Cochlea (hair cells) → cochlear nerve → cochlear nucleus → superior olive → inferior colliculus → MGN of thalamus → primary auditory cortex (Heschl's gyri, superior temporal gyrus)

**Tonotopy:** High frequencies processed at the base of the basilar membrane; low frequencies at the apex.

## Somatosensory System
Primary somatosensory cortex (S1) is in the postcentral gyrus — processes touch, pain, temperature, proprioception in a somatotopic map (homunculus). Lips, hands, and tongue have disproportionately large representations.

**Mechanoreceptors:**
- Meissner's corpuscles: Light touch, texture (fingertips)
- Pacinian corpuscles: Vibration, deep pressure
- Merkel's discs: Sustained pressure, fine spatial detail
- Ruffini endings: Skin stretch

## Vestibular System
Detects head position and movement — semicircular canals (rotation), otolith organs (linear acceleration and gravity). Vestibular information from the inner ear → vestibular nuclei → cerebellum and eye movement centers → cortex for balance awareness.

## Olfactory System
Unique: bypasses the thalamus — olfactory receptor neurons → olfactory bulb → piriform cortex → amygdala and limbic structures. This direct limbic connection explains why smells evoke strong emotional memories.

## Gate Control Theory of Pain
Melzack and Wall: Large-fiber (touch) input activates inhibitory interneurons in the dorsal horn, "closing the gate" and reducing pain signal transmission. This is why rubbing an injury reduces pain.`
    },
    {
      topicId: T["Limbic System & Motivation"],
      title: "Limbic System & Motivation — Study Guide",
      content: `## The Limbic System
The limbic system is a set of interconnected brain structures involved in emotion, memory, and motivation:
- **Hippocampus:** New declarative memory formation, spatial navigation
- **Amygdala:** Emotional processing (especially fear), emotional memory modulation
- **Hypothalamus:** Basic drives (feeding, drinking, sex, temperature, sleep), links CNS to endocrine system
- **Cingulate cortex:** Emotional-cognitive integration, error monitoring, pain
- **Parahippocampal gyrus, fornix, mammillary bodies:** Memory circuits

## Papez Circuit
Hippocampus → Fornix → Mammillary bodies → Anterior thalamus → Cingulate cortex → Entorhinal cortex → Hippocampus — proposed by Papez (1937) as the emotional memory circuit.

## Hypothalamus and Basic Drives
**The Four Fs:** Fighting, Fleeing, Feeding, Fornicating

**Hunger regulation:**
- Lateral hypothalamus ("hunger center"): Lesion → aphagia (failure to eat)
- Ventromedial hypothalamus ("satiety center"): Lesion → hyperphagia (overeating and obesity)

**Orexin/hypocretin:** Lateral hypothalamus peptides that promote wakefulness and regulate appetite — loss of orexin neurons causes narcolepsy.

## Reward and Motivation
**Mesolimbic dopamine system:** VTA → nucleus accumbens (NAcc)
- Drives reward anticipation, motivation, and approach behavior
- Disrupted in addiction (drug hijacks reward circuit) and schizophrenia

**Dopamine and reward prediction:** Dopamine neurons fire in response to unexpected rewards and to cues that predict rewards (reward prediction error).

## The Amygdala
- Fear conditioning: CS (tone) paired with US (shock) → amygdala learns to respond to CS alone
- Klüver-Bucy syndrome (bilateral amygdala/temporal lesions): hyperorality, hypersexuality, emotional placidity, visual agnosia, memory impairment
- Urbach-Wiethe disease: bilateral amygdala calcification → no fear response

## Intrinsic vs. Extrinsic Motivation
- **Intrinsic:** Internal reward, enjoyment, curiosity — tends to be more durable
- **Extrinsic:** External reward (money, grades) — can undermine intrinsic motivation (overjustification effect)
- Both rely on dopamine, but dopamine is especially linked to anticipation and approach`
    },
    {
      topicId: T["Sleep & Circadian Rhythms"],
      title: "Sleep & Circadian Rhythms — Study Guide",
      content: `## Sleep Architecture
A full night of sleep consists of 4-6 cycles (~90 min each), alternating between NREM and REM.

**NREM Stages:**
| Stage | EEG | Features |
|-------|-----|----------|
| N1 | Theta (4-7 Hz) | Light sleep, hypnic jerks |
| N2 | Theta + spindles + K-complexes | Sleep spindles → procedural memory |
| N3 | Delta (0.5-4 Hz) | Deep, slow-wave sleep; most restorative; growth hormone |

**REM Sleep:**
- Desynchronized EEG (like waking), rapid eye movements, complete muscle atonia
- Vivid dreaming; emotional memory consolidation
- REM increases in later cycles; NREM N3 predominates in early cycles

## Circadian Regulation
**Suprachiasmatic nucleus (SCN):** Master circadian clock in the anterior hypothalamus — receives light signals via retinohypothalamic tract; coordinates peripheral clocks throughout the body.

**Melatonin:** Secreted by pineal gland in darkness → signals nighttime → promotes sleep onset. Light (especially blue light) suppresses melatonin secretion.

## Two-Process Model (Borbély)
- **Process S (Homeostatic):** Sleep pressure — adenosine builds up during wakefulness; clears during sleep. Caffeine blocks adenosine receptors.
- **Process C (Circadian):** SCN promotes alertness during the day — both processes must align for good sleep.

## Sleep Disorders
| Disorder | Key Feature | Mechanism |
|----------|-------------|-----------|
| Narcolepsy | Excessive daytime sleepiness, cataplexy | Loss of orexin neurons |
| Sleep apnea | Breathing stops during sleep | Airway collapse (obstructive) or brainstem (central) |
| REM sleep behavior disorder | Acts out dreams | Loss of REM muscle atonia — strongly linked to Parkinson's/DLB |
| Insomnia | Difficulty falling/staying asleep | Hyperarousal; common in older adults |
| Advanced sleep phase | Sleep and wake too early | Circadian clock shift — common in older adults |

## Aging and Sleep
- Decreased N3 slow-wave sleep
- Reduced REM sleep
- More frequent awakenings
- Advanced sleep phase syndrome (earlier bedtime and wake time)
- Insomnia more common`
    },
    {
      topicId: T["Endocrine System & Reproduction"],
      title: "Endocrine System & Reproduction — Study Guide",
      content: `## The HPA Axis (Stress Response)
**Hypothalamus → CRH → Anterior pituitary → ACTH → Adrenal cortex → Cortisol**

Cortisol negative feedback inhibits both the hypothalamus and pituitary. Chronic stress dysregulates this axis — elevated cortisol damages the hippocampus (reduced volume, impaired neurogenesis), impairs memory, and increases risk for depression and PTSD.

## Pituitary Gland
**Anterior pituitary (adenohypophysis) — releases:**
- ACTH (→ adrenal cortex → cortisol)
- TSH (→ thyroid → T3/T4)
- FSH and LH (→ gonads → sex hormones)
- GH (growth hormone — released in pulses during N3 sleep)
- Prolactin (inhibited by dopamine; elevated by antipsychotics)

**Posterior pituitary (neurohypophysis) — releases:**
- Oxytocin (social bonding, maternal behavior, uterine contractions)
- ADH/vasopressin (water reabsorption in kidneys, blood pressure, social behavior)

## Sex Hormones and the Brain
**Estrogen:** Promotes neuroplasticity and synaptic density (especially hippocampus) — neuroprotective. Estrogen loss at menopause → increased risk for cognitive changes and Alzheimer's.

**Testosterone:** Drives male sexual development; organizational (prenatal) and activational (adult) effects on neural circuits.

**Gonadal axis:** GnRH (hypothalamus) → LH + FSH (anterior pituitary) → sex hormones (gonads)

## Organizational vs. Activational Effects
**Organizational:** Occur during critical prenatal periods — permanently shape neural circuits (gender-typical cognitive profiles, sexual orientation). Studied through CAH (congenital adrenal hyperplasia) — prenatal androgen excess in females.

**Activational:** Occur in adulthood — temporary, reversible effects on behavior (testosterone increases aggression and libido; estrogen cycles affect mood).

## Thyroid Hormone
Essential for brain development — hypothyroidism during fetal/neonatal period causes **cretinism** (intellectual disability). In adults, hypothyroidism causes cognitive slowing and depression; hyperthyroidism causes anxiety.

## Adrenal Glands
- **Adrenal cortex:** Cortisol (stress), aldosterone (blood pressure/sodium), sex steroids
- **Adrenal medulla:** Epinephrine and norepinephrine → sympathetic fight-or-flight response`
    },
    {
      topicId: T["Psychopharmacology"],
      title: "Psychopharmacology — Study Guide",
      content: `## Pharmacokinetics vs. Pharmacodynamics
**Pharmacokinetics:** What the body does to the drug — Absorption, Distribution, Metabolism, Excretion (ADME)
**Pharmacodynamics:** What the drug does to the body — receptor binding, agonism/antagonism, tolerance

**Half-life:** Time for plasma concentration to decrease by 50%. Drugs with longer half-lives are more stable but take longer to clear.

## Receptor Pharmacology
**Agonist:** Binds receptor and activates it (mimics NT)
**Antagonist:** Binds but blocks activation (competes with NT)
**Partial agonist:** Activates receptor but less than full agonist
**Allosteric modulator:** Binds site other than active site — changes receptor's response to its natural ligand (e.g., benzodiazepines on GABA-A)

## Antidepressants
| Class | Mechanism | Examples |
|-------|-----------|---------|
| SSRIs | Block SERT (serotonin reuptake) | Fluoxetine, sertraline |
| SNRIs | Block SERT + NET | Venlafaxine, duloxetine |
| TCAs | Block SERT, NET, + anticholinergic | Amitriptyline, nortriptyline |
| MAOIs | Block MAO enzyme | Phenelzine, tranylcypromine |

## Antipsychotics
**Typical (first-gen):** Block D2 receptors → reduce positive symptoms; risk of extrapyramidal symptoms (EPS) and tardive dyskinesia
**Atypical (second-gen):** Block D2 + 5-HT2A → fewer EPS, better for negative symptoms; metabolic side effects

**Tardive dyskinesia:** Involuntary repetitive movements from chronic D2 blockade → dopamine receptor supersensitivity.

## Mood Stabilizers
**Lithium:** Modulates second messengers (inositol, GSK-3β) — neuroprotective; narrow therapeutic window requires blood monitoring.
**Valproate, lamotrigine:** Anticonvulsants also used in bipolar disorder.

## ADHD Medications
**Stimulants:** Methylphenidate (blocks DAT/NET), Amphetamine (blocks + reverses DAT/NET)
**Non-stimulants:** Atomoxetine (selective NET inhibitor), Guanfacine (alpha-2A agonist)

## Blood-Brain Barrier (BBB)
Formed by tight junctions between brain endothelial cells + astrocyte end-feet. Drugs must be lipid-soluble OR use active transporters to cross. Example: Dopamine cannot cross → use levodopa (crosses → converted to DA).`
    },
    {
      topicId: T["Psychological Disorders"],
      title: "Psychological Disorders — Study Guide",
      content: `## Schizophrenia Spectrum
**Positive symptoms** (excess/distortion): Hallucinations, delusions, disorganized speech, catatonia
**Negative symptoms** (deficits): Alogia, avolition, anhedonia, flat affect, asociality
**Cognitive symptoms:** Working memory, processing speed, executive function — often most disabling

**Dopamine hypothesis:** Excess mesolimbic DA (positive symptoms) + reduced mesocortical DA (negative symptoms)
**Glutamate hypothesis:** NMDA hypofunction → disinhibited dopamine — explains why NMDA antagonists (PCP, ketamine) cause schizophrenia-like symptoms

**Brain abnormalities:** Enlarged ventricles, reduced prefrontal gray matter (hypofrontality), hippocampal volume reduction

## Mood Disorders
**Major Depressive Disorder:** Depressed mood or anhedonia + 5+ additional symptoms for ≥2 weeks — affects monoamine systems, HPA axis dysregulation, reduced hippocampal neurogenesis.

**Bipolar Disorder:**
- Bipolar I: At least one full manic episode
- Bipolar II: Hypomania + at least one MDE (never full mania)
- Cyclothymia: Chronic hypomania/depressive symptoms, less severe

**Monoamine hypothesis of depression:** Low serotonin, NE, and/or dopamine → basis for SSRIs, SNRIs, MAOIs.
**Beck's cognitive triad:** Negative views of self, world, and future.

## Anxiety and Trauma Disorders
**PTSD:** Hyperactive amygdala, reduced prefrontal inhibition, hippocampal volume loss. Features: intrusions, avoidance, negative cognition, hyperarousal.

**Learned helplessness (Seligman):** Repeated uncontrollable aversive events → cessation of coping behavior → model for depression.

## Dissociative Disorders
Disruption in integration of consciousness, memory, identity, or perception. Spectrum from mild dissociation (daydreaming) → DID. Linked to trauma/abuse histories.

## Anosognosia
Neurological unawareness of one's own deficit — NOT psychological denial. Caused by right hemisphere dysfunction. Common in schizophrenia (affects medication adherence) and mania.`
    },
    {
      topicId: T["Personality Disorders"],
      title: "Personality Disorders — Study Guide",
      content: `## Overview
Personality disorders are pervasive, inflexible patterns of inner experience and behavior that deviate from cultural expectations, are stable over time, and cause significant distress or functional impairment.

## The Three Clusters
**Cluster A (Odd/Eccentric):**
- Paranoid PD: Pervasive distrust and suspicion
- Schizoid PD: Detachment from social relationships, restricted affect — does NOT desire relationships
- Schizotypal PD: Odd beliefs, magical thinking, perceptual distortions — on a schizophrenia spectrum

**Cluster B (Dramatic/Emotional):**
- Antisocial PD: Disregard for others' rights, deceit, impulsivity, lack of remorse — requires conduct disorder before age 15; low amygdala activity
- Borderline PD: Unstable relationships, identity disturbance, fear of abandonment, impulsivity, self-harm — hyperactive amygdala; treated with DBT
- Histrionic PD: Excessive emotionality, attention-seeking
- Narcissistic PD: Grandiosity, need for admiration, lack of empathy

**Cluster C (Anxious/Fearful):**
- Avoidant PD: Social inhibition, hypersensitivity to rejection — desires relationships (unlike schizoid)
- Dependent PD: Excessive need to be cared for, submissive behavior
- OCPD: Preoccupation with orderliness, perfectionism, and control — ego-syntonic (unlike OCD which is ego-dystonic)

## Neurobiology
- Serotonin dysfunction: Impulsivity and aggression (especially Cluster B)
- Amygdala hyperactivity (BPD): Emotional dysregulation
- Low amygdala activity (ASPD): Reduced fear/empathy
- Prefrontal-limbic imbalance: Impaired emotion regulation
- HPA axis dysregulation: Stress sensitivity

## Treatment
- **DBT (Dialectical Behavior Therapy):** First-line for BPD — skills training in mindfulness, distress tolerance, emotion regulation, and interpersonal effectiveness
- **CBT:** Used across clusters
- **Medication:** Targets symptoms (mood stabilizers, antipsychotics, SSRIs) — no medication treats the disorder itself

## DSM-5 Alternative Model
Section III: Dimensional approach — assesses personality functioning (self-identity, self-direction, empathy, intimacy) and five pathological trait domains: negative affectivity, detachment, antagonism, disinhibition, and psychoticism.`
    },
    {
      topicId: T["ADHD & Medications"],
      title: "ADHD & Medications — Study Guide",
      content: `## ADHD Diagnostic Criteria (DSM-5)
- Persistent pattern of inattention and/or hyperactivity-impulsivity
- Several symptoms present **before age 12**
- Symptoms present in **two or more settings**
- Symptoms interfere with functioning

**Three presentations:**
1. Predominantly Inattentive
2. Predominantly Hyperactive-Impulsive
3. Combined (most common)

**Inattentive symptoms:** Easily distracted, forgetfulness, losing things, failing to finish tasks, avoiding sustained mental effort, not listening, difficulty organizing

**Hyperactive/Impulsive symptoms:** Fidgeting, leaving seat, running/climbing inappropriately, unable to play quietly, "on the go," excessive talking, blurting out answers, difficulty waiting turn, interrupting

## Neurobiology
**Brain regions:** Prefrontal cortex (executive function, inhibition), anterior cingulate (error monitoring), basal ganglia, cerebellum
**Neurotransmitters:** Dopamine and norepinephrine — deficiency in PFC circuits impairs working memory, response inhibition, and sustained attention
**Heritability:** ~70-80% — one of the most heritable psychiatric conditions

## Treatment
**Stimulants (first-line):**
| Medication | Mechanism |
|-----------|-----------|
| Methylphenidate (Ritalin, Concerta) | Blocks DAT and NET — increases DA and NE in PFC |
| Amphetamine (Adderall) | Blocks DAT/NET AND reverses them — stronger effect |

**Non-stimulants:**
| Medication | Mechanism |
|-----------|-----------|
| Atomoxetine (Strattera) | Selective NE reuptake inhibitor — no abuse potential |
| Guanfacine (Intuniv) | Alpha-2A agonist — strengthens PFC circuits |

**Stimulant risks:** Decreased appetite, sleep disruption, elevated heart rate/BP, potential for misuse. Cardiovascular screening before prescribing.

## Neuropsychological Assessment
**Tests used:**
- Continuous Performance Test (CPT): Sustained attention and inhibition
- Working memory tasks: Digit span backward, Letter-Number Sequencing
- Executive function: Trails B, WCST, verbal fluency
- Rating scales: Conners, BASC, BRIEF (self and informant)

## ADHD in Adults
Hyperactivity becomes restlessness and inner sense of tension rather than overt motor behavior. Inattention and executive dysfunction remain prominent and impair work and relationships.`
    },
    {
      topicId: T["Language Processing & Aphasia"],
      title: "Language Processing & Aphasia — Study Guide",
      content: `## Language Areas
**Broca's area:** Left inferior frontal gyrus (Brodmann areas 44/45) — speech production, syntax, articulation. Damage → Broca's aphasia.

**Wernicke's area:** Posterior superior temporal gyrus (BA 22) — language comprehension. Damage → Wernicke's aphasia.

**Arcuate fasciculus:** White matter bundle connecting Broca's and Wernicke's areas. Damage → conduction aphasia.

## The Wernicke-Geschwind Model
Auditory input → Wernicke's area (comprehension) → arcuate fasciculus → Broca's area (production) → motor cortex → speech output. Damage at any point causes a characteristic aphasia.

## Aphasia Classification
| Aphasia | Fluency | Comprehension | Repetition | Lesion |
|---------|---------|--------------|------------|--------|
| Broca's | Non-fluent | Intact | Impaired | Left IFG |
| Wernicke's | Fluent | Impaired | Impaired | Left pSTG |
| Conduction | Fluent | Intact | Impaired | Arcuate fasciculus |
| Global | Non-fluent | Impaired | Impaired | Large left hemisphere |
| Trans. Motor | Non-fluent | Intact | Intact | Near Broca's (SMA) |
| Trans. Sensory | Fluent | Impaired | Intact | Near Wernicke's |
| Anomic | Fluent | Intact | Intact | Variable |

## Speech Errors
**Phonological paraphasia:** Sound-based substitution (e.g., "spoon" → "spool") — Broca's, conduction aphasia
**Semantic paraphasia:** Meaning-based substitution (e.g., "fork" → "knife") — Wernicke's aphasia
**Neologism:** Completely made-up non-word — Wernicke's aphasia
**Jargon aphasia:** Fluent speech that is largely incomprehensible — Wernicke's

## Language Lateralization
Left hemisphere dominant in ~95% of right-handers and ~70% of left-handers. Assessed with Wada test (sodium amobarbital injection that temporarily inactivates one hemisphere) or fMRI language lateralization.

## Related Disorders
**Dysarthria:** Motor speech disorder — slurred speech from muscle weakness, intact language
**Dyslexia:** Phonological processing deficit — left temporoparietal/inferior frontal dysfunction; NOT a visual problem
**Apraxia of speech:** Motor planning disorder for speech — Broca's area/insula damage`
    },
    {
      topicId: T["Apraxia & Agnosia"],
      title: "Apraxia & Agnosia — Study Guide",
      content: `## Apraxia
**Definition:** Inability to perform purposeful, skilled movements despite intact motor strength, sensation, and comprehension — a disorder of motor programming/planning.

**Key principle:** Apraxia is NOT due to weakness, sensory loss, or failure to understand the command.

### Types of Apraxia
| Type | Definition | Lesion |
|------|-----------|--------|
| Ideomotor | Cannot perform to command or imitate (e.g., wave); may perform spontaneously | Left frontal/parietal |
| Ideational | Cannot sequence multi-step tasks (e.g., make coffee) | Frontal lobe |
| Kinetic/Limb-kinetic | Clumsiness in precision acts (e.g., picking up coin) | Corticospinal/frontal |
| Conceptual | Doesn't know how to use tools; selects wrong tool | Left parietal |
| Apraxia of speech | Cannot plan motor movements for speech | Broca's, insula |
| Buccofacial | Cannot perform mouth/face movements on command | Left frontal |
| Constructional | Cannot draw or assemble 2D/3D structures | Parietal |

**Testing order:** Pantomime to command → Imitation → Use of actual object (performance typically improves with object use)

**Error types in ideomotor apraxia:**
- Content error: Wrong pantomime (screwdriver for hammer)
- Postural error: Uses body part as tool
- Spatial/movement error: Correct movement but wrong trajectory or orientation
- Temporal error: Correct elements but wrong timing

## Agnosia
**Definition:** Perception without recognition — inability to recognize stimuli despite intact sensation, attention, and language.

### Visual Agnosia
| Type | Deficit | Intact | Lesion |
|------|---------|--------|--------|
| Apperceptive | Cannot form coherent percept; cannot copy or match | Object knowledge | Diffuse posterior |
| Associative | Can copy and match, cannot recognize | Copying, matching | Occipitotemporal |
| Prosopagnosia | Cannot recognize faces | Emotion, gender, age from face | Fusiform face area (bilateral) |
| Simultagnosia | Cannot perceive whole scene | Individual elements | Bilateral parieto-occipital |

**Balint's syndrome** (bilateral parieto-occipital): Simultagnosia + optic ataxia + oculomotor apraxia

### Hemispatial Neglect
Failure to attend to stimuli on the side contralateral to the lesion (usually right hemisphere → left-sided neglect) — NOT a sensory deficit. Tested with line bisection, cancellation tasks, and drawing tasks.

### Anosognosia
Neurological unawareness of one's own deficit — caused by right hemisphere damage. Common in Alzheimer's, stroke. Differs from psychological denial.`
    },
    {
      topicId: T["Neurocognitive Disorders"],
      title: "Neurocognitive Disorders — Study Guide",
      content: `## Normal Aging vs. MCI vs. Dementia
**Normal aging:** Adaptive skills preserved; some slowing of processing speed; crystallized skills (vocabulary, knowledge) relatively intact; fluid skills (memory, reasoning, speed) decline modestly.

**MCI (Mild Cognitive Impairment):** Prevalence 15-20% in US. Decline beyond normal aging but ADLs largely intact.
- aMCI (amnestic): Memory impaired → more likely to convert to Alzheimer's
- naMCI (non-amnestic): Non-memory domain → less likely to convert
- Processing speed is the hallmark early deficit

**Dementia:** Significant cognitive decline + functional impairment in ADLs

## Cortical vs. Subcortical Dementia
**Cortical (4 As):** Amnesia, Aphasia, Apraxia, Agnosia — e.g., Alzheimer's, FTD
**Subcortical:** Alertness, Attention, Processing speed, Mood/Depression — e.g., Parkinson's, Huntington's, HIV

## Alzheimer's Disease
- Histology: Beta-amyloid plaques (extracellular) + tau tangles (intracellular)
- Progression: Transentorhinal → limbic → neocortex
- Early symptoms: Anterograde memory, naming, planning
- Middle stage: Personality changes, ADL decline
- Late stage: Pneumonia/aspiration common cause of death
- Risk: Age, TBI, sleep, living area, APOE-e4

## Parkinson's Disease
- Cardinal signs: Bradykinesia, resting tremor, rigidity, postural instability (TRAP)
- Pathology: Loss of dopaminergic neurons in substantia nigra, Lewy bodies (alpha-synuclein)
- Cognitive: Subcortical — processing speed, attention, executive function impaired; memory retrieval affected
- Treatment: Levodopa, deep brain stimulation, exercise

## Dementia with Lewy Bodies (DLB)
Core features: Fluctuating cognition, recurrent visual hallucinations, parkinsonism (after cognition onset), REM sleep behavior disorder
- Sensitivity to antipsychotics (can cause severe worsening)
- Most misdiagnosed as Alzheimer's

## Huntington's Disease
- CAG repeat expansion in HTT gene (chromosome 4) — autosomal dominant
- Degeneration of striatum (caudate → "box-car ventricles")
- Symptoms: Chorea, executive dysfunction, psychiatric (depression most common)
- 5 stages; death 10-30 years after symptom onset

## Frontotemporal Dementia (FTD)
- **Behavioral variant (bvFTD):** SHADE — Stereotyped behaviors, Hyperorality, Apathy, Disinhibition, Empathy loss
- **Language variants:** Primary progressive aphasia (non-fluent, semantic, logopenic)
- Earlier onset than Alzheimer's (50s), more rapid progression, behavioral > memory changes early

## Traumatic Brain Injury (TBI)
- All concussions are TBIs; not all TBIs are concussions
- CTE (Chronic Traumatic Encephalopathy): Repetitive TBIs; tau pathology; diagnosed only at autopsy
- HELPS screening: Have you hit your head? Emergency room? Lose consciousness? Problems in daily life? Significant illness?
- Outcomes: Declined processing speed, executive dysfunction, prospective memory impairment

## Capacity vs. Competency
| | Capacity | Competency |
|--|---------|------------|
| Type | Clinical | Legal |
| Who decides | Clinician | Judge |
| Stability | Can change | More permanent |
| Domains | 4: Expression, Understanding, Appreciation, Reasoning | Specific domain |

**MacArthur Competence Assessment Tool (MacCAT):** Gold standard for assessing medical decision-making capacity.

## HIV-Associated Neurocognitive Disorder (HAND) — Frascati Criteria
- ANI: Asymptomatic, 1 SD below in 2+ domains
- MND: Mild Neurocognitive Disorder — mild functional impairment (12% prevalence)
- HAD: HIV-Associated Dementia — significant impairment (2% prevalence)
- Primarily subcortical: basal ganglia (caudate), hippocampus`
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
  console.log(`   ${flashcards.length} flashcards (${topics.length} topics × up to 20 cards)`);
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
