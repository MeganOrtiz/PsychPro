import { db } from "./index";
import { topicsTable, flashcardsTable, quizQuestionsTable, studyGuidesTable } from "./schema";
import { sql } from "drizzle-orm";

function mapQuizQuestions(rawQuestions: Array<{ topicId: number; question: string; options: string; correctAnswer: string; explanation: string; difficulty?: string }>) {
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
  console.log("Seeding neuroscience content...");

  await db.execute(sql`TRUNCATE study_guides, quiz_questions, flashcards, progress, topics RESTART IDENTITY CASCADE`);

  const topics = await db.insert(topicsTable).values([
    { name: "Neuropsychology Overview", category: "Foundations", description: "Introduction to neuropsychology, brain-behavior relationships, and assessment approaches." },
    { name: "Cell Biology & Neuron Anatomy", category: "Foundations", description: "Neuronal structure, types, glial cells, and basic cellular neuroscience." },
    { name: "Spinal Cord & PNS", category: "Neuroanatomy", description: "Spinal cord organization, peripheral nervous system, dermatomes, and reflex arcs." },
    { name: "Cerebellum", category: "Neuroanatomy", description: "Cerebellar anatomy, circuitry, functions in motor coordination and learning." },
    { name: "Basal Ganglia", category: "Neuroanatomy", description: "Basal ganglia structures, circuits, role in motor control and reward processing." },
    { name: "Brainstem & Diencephalon", category: "Neuroanatomy", description: "Medulla, pons, midbrain, thalamus, hypothalamus anatomy and functions." },
    { name: "Limbic System", category: "Neuroanatomy", description: "Limbic structures, emotional processing, memory, and behavior." },
    { name: "Cerebral Cortex", category: "Neuroanatomy", description: "Cortical lobes, cytoarchitecture, functional areas, and lateralization." },
    { name: "Sensory & Motor Pathways", category: "Neuroanatomy", description: "Ascending sensory and descending motor tracts, pathway organization." },
    { name: "CNS Development", category: "Neuroscience", description: "Neural development from embryo, neurogenesis, migration, and critical periods." },
    { name: "Dementia & Alzheimer's Disease", category: "Clinical", description: "Types of dementia, Alzheimer's pathophysiology, assessment, and management." },
    { name: "Cerebrovascular System", category: "Clinical", description: "Brain vasculature, stroke types, TIA, and vascular syndromes." },
    { name: "Neuroradiology", category: "Clinical", description: "Neuroimaging modalities, CT vs MRI, reading neurological scans." },
    { name: "Multiple Sclerosis", category: "Clinical", description: "MS pathology, subtypes, clinical features, diagnosis, and treatment." },
    { name: "Pain & Nociception", category: "Neuroscience", description: "Pain pathways, nociceptors, central sensitization, chronic pain mechanisms." },
    { name: "Neurogenetics", category: "Neuroscience", description: "Genetic basis of neurological disorders, inheritance patterns, and genomics." },
    { name: "Visual System", category: "Sensory Systems", description: "Visual pathways from retina to cortex, retinotopy, and visual disorders." },
    { name: "Auditory System", category: "Sensory Systems", description: "Auditory pathways, cochlear mechanics, tonotopy, and hearing disorders." },
    { name: "Somatosensory & Touch", category: "Sensory Systems", description: "Touch receptors, somatosensory cortex, body maps, and clinical correlates." },
    { name: "Chemical Senses", category: "Sensory Systems", description: "Olfactory and gustatory systems, receptors, and pathways." },
    { name: "Vestibular System", category: "Sensory Systems", description: "Vestibular organs, pathways, balance, and vertigo disorders." },
    { name: "Motor Control", category: "Neuroscience", description: "Motor cortex, corticospinal tract, motor unit, and movement planning." },
    { name: "Sleep & Circadian Rhythms", category: "Neuroscience", description: "Sleep stages, circadian regulation, sleep disorders, and neurobiology." },
    { name: "Neuroendocrinology", category: "Neuroscience", description: "HPA axis, hypothalamic-pituitary hormones, stress response, and neurohormones." },
    { name: "Psychopathology", category: "Neuropsychology", description: "Major psychiatric disorders, neural correlates, and neuropsychological profiles." },
    { name: "Personality Disorders", category: "Neuropsychology", description: "Personality disorder clusters, neural substrates, and neuropsychological features." },
    { name: "Dissociative Disorders", category: "Neuropsychology", description: "Dissociation, depersonalization, DID, and neurobiological underpinnings." },
    { name: "Psychopharmacology", category: "Clinical", description: "Neurotransmitter systems, drug mechanisms, major drug classes, and side effects." },
    { name: "Coping & Defense Mechanisms", category: "Neuropsychology", description: "Psychological defenses, coping strategies, and their neural correlates." },
  ]).returning();

  const topicMap: Record<string, number> = {};
  topics.forEach(t => { topicMap[t.name] = t.id; });

  // ---------------------------------------------------------------------------
  // FLASHCARDS — 10+ per topic
  // ---------------------------------------------------------------------------
  const flashcards = [
    // ===== NEUROPSYCHOLOGY OVERVIEW (12 cards) =====
    { topicId: topicMap["Neuropsychology Overview"], question: "What is neuropsychology?", answer: "The scientific study of the relationship between brain function and behavior, cognition, and emotion.", difficulty: "easy" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What is the Luria-Nebraska Neuropsychological Battery used for?", answer: "A standardized battery assessing motor, rhythm, tactile, visual, receptive/expressive speech, writing, reading, arithmetic, memory, and intellectual processes.", difficulty: "medium" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What is the difference between a neurologist and a neuropsychologist?", answer: "A neurologist is a physician who diagnoses/treats neurological disorders. A neuropsychologist is a psychologist specializing in brain-behavior relationships and neuropsychological assessment.", difficulty: "easy" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What does lateralization of brain function mean?", answer: "The tendency for some neural functions to be more dominant in one hemisphere (e.g., language typically in left hemisphere, visuospatial in right hemisphere).", difficulty: "medium" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What is diaschisis?", answer: "A transient loss of function in brain regions remote from the site of injury due to disrupted connections, even when those remote areas are structurally intact.", difficulty: "hard" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What is the Halstead-Reitan Battery?", answer: "A comprehensive neuropsychological test battery measuring various cognitive and sensorimotor functions; used to detect and characterize brain damage.", difficulty: "medium" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What is equipotentiality?", answer: "Lashley's concept that any part of cortical tissue could substitute for another in learning; contrasts with strict localization of function.", difficulty: "hard" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What does the MMSE assess?", answer: "The Mini-Mental State Examination screens for cognitive impairment across orientation, registration, attention, recall, language, and visuoconstruction (max 30 points).", difficulty: "easy" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What is ecological validity in neuropsychological assessment?", answer: "The degree to which test performance predicts real-world functional outcomes in patients' daily lives.", difficulty: "medium" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What is a double dissociation?", answer: "Evidence that two cognitive processes are functionally independent: lesion A impairs function X but not Y, while lesion B impairs Y but not X.", difficulty: "hard" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What is the difference between anterograde and retrograde amnesia?", answer: "Anterograde amnesia: inability to form new memories after injury. Retrograde amnesia: loss of memories formed before the injury.", difficulty: "medium" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What are the five cognitive domains typically assessed in neuropsychology?", answer: "Attention, memory, language, visuospatial ability, and executive function.", difficulty: "easy" },

    // ===== CELL BIOLOGY & NEURON ANATOMY (12 cards) =====
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What are the main structural parts of a neuron?", answer: "Cell body (soma), dendrites, axon, axon hillock, axon terminals (boutons), and myelin sheath (in myelinated neurons).", difficulty: "easy" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What is the function of myelin?", answer: "Myelin insulates the axon and speeds up signal conduction via saltatory conduction, jumping between Nodes of Ranvier.", difficulty: "easy" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What are astrocytes and their functions?", answer: "Glial cells that support neurons: regulate ion concentrations, form the blood-brain barrier, provide metabolic support, and respond to injury (gliosis).", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What is an action potential?", answer: "An all-or-none electrical signal: rapid depolarization via Na+ influx, followed by repolarization via K+ efflux. Propagates down the axon.", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What are oligodendrocytes?", answer: "CNS glial cells that produce myelin for multiple axons simultaneously (one oligodendrocyte can myelinate up to 50 axons).", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What is the resting membrane potential of a neuron?", answer: "Approximately -70 mV, maintained by Na+/K+-ATPase pumps and selective membrane permeability.", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What is the difference between EPSP and IPSP?", answer: "EPSP (excitatory postsynaptic potential) depolarizes the membrane toward threshold. IPSP (inhibitory postsynaptic potential) hyperpolarizes it away from threshold.", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What are microglia?", answer: "The resident immune cells of the CNS; they survey the environment, phagocytose debris and pathogens, and become activated in neuroinflammation.", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What is synaptic vesicle release triggered by?", answer: "Calcium influx through voltage-gated Ca2+ channels at the presynaptic terminal when an action potential arrives.", difficulty: "hard" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What is the absolute refractory period?", answer: "A brief time immediately after an action potential when no stimulus can trigger another action potential because Na+ channels are inactivated.", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What is long-term potentiation (LTP)?", answer: "A persistent strengthening of synaptic transmission following high-frequency stimulation, dependent on NMDA receptor activation; thought to underlie learning and memory.", difficulty: "hard" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What are Schwann cells?", answer: "PNS glial cells that produce myelin for peripheral axons (one Schwann cell per myelin segment) and support nerve regeneration after injury.", difficulty: "medium" },

    // ===== SPINAL CORD & PNS (12 cards) =====
    { topicId: topicMap["Spinal Cord & PNS"], question: "What is a dermatome?", answer: "A region of skin innervated by sensory fibers from a single spinal nerve root.", difficulty: "easy" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What is the difference between UMN and LMN lesions?", answer: "UMN lesions: spasticity, hyperreflexia, Babinski sign, minimal atrophy. LMN lesions: flaccid weakness, hyporeflexia, muscle atrophy, fasciculations.", difficulty: "hard" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What is the cauda equina?", answer: "The bundle of spinal nerve roots below the conus medullaris (L1-L2). Damage causes LMN signs in lower limbs, bladder, and bowel dysfunction.", difficulty: "medium" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What spinal levels control the bicep reflex?", answer: "C5-C6 (musculocutaneous nerve).", difficulty: "hard" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What is Brown-Séquard syndrome?", answer: "Hemisection of the spinal cord: ipsilateral loss of motor function and proprioception, contralateral loss of pain and temperature.", difficulty: "hard" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What are the spinal cord enlargements and their levels?", answer: "Cervical enlargement (C4-T1): serves the arms. Lumbosacral enlargement (L2-S3): serves the legs.", difficulty: "medium" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What is the Bell-Magendie law?", answer: "Dorsal roots are sensory (afferent); ventral roots are motor (efferent).", difficulty: "medium" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What is the difference between somatic and autonomic nervous systems?", answer: "Somatic: voluntary control of skeletal muscle. Autonomic: involuntary control of smooth muscle, cardiac muscle, and glands (divided into sympathetic and parasympathetic).", difficulty: "easy" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What characterizes a stretch reflex?", answer: "A monosynaptic reflex: muscle stretch activates Ia afferents → synapse directly on alpha motor neurons → muscle contraction. E.g., knee-jerk reflex (L3-L4).", difficulty: "medium" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What is conus medullaris syndrome?", answer: "Injury at the conus medullaris (T12-L2): mixed UMN/LMN signs, saddle anesthesia, early bladder/bowel dysfunction, erectile dysfunction.", difficulty: "hard" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "Which cranial nerves are purely sensory?", answer: "CN I (olfactory), CN II (optic), and CN VIII (vestibulocochlear).", difficulty: "medium" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What is Horner's syndrome?", answer: "Disruption of the sympathetic supply to the eye: ptosis, miosis, anhidrosis. Caused by lesions along the sympathetic pathway (hypothalamus → ciliospinal center → superior cervical ganglion → eye).", difficulty: "hard" },

    // ===== CEREBELLUM (12 cards) =====
    { topicId: topicMap["Cerebellum"], question: "What are the three functional zones of the cerebellum?", answer: "Vestibulocerebellum (balance, eye movements), spinocerebellum (limb and trunk coordination), cerebrocerebellum (planning fine movements).", difficulty: "hard" },
    { topicId: topicMap["Cerebellum"], question: "What are the key signs of cerebellar damage?", answer: "Ataxia, dysmetria, intention tremor, dysdiadochokinesia, nystagmus, and scanning (ataxic) speech.", difficulty: "medium" },
    { topicId: topicMap["Cerebellum"], question: "What is the Purkinje cell?", answer: "The primary output neuron of the cerebellar cortex; sends inhibitory (GABAergic) signals to the deep cerebellar nuclei.", difficulty: "medium" },
    { topicId: topicMap["Cerebellum"], question: "What is dysmetria?", answer: "The inability to judge distance or scale of movement (under- or overshooting a target); a hallmark of cerebellar dysfunction.", difficulty: "medium" },
    { topicId: topicMap["Cerebellum"], question: "What is dysdiadochokinesia?", answer: "The inability to perform rapid alternating movements (e.g., pronation/supination), indicative of cerebellar dysfunction.", difficulty: "medium" },
    { topicId: topicMap["Cerebellum"], question: "What are the three layers of the cerebellar cortex?", answer: "Molecular layer (outermost), Purkinje cell layer, and granule cell layer (innermost/deepest).", difficulty: "hard" },
    { topicId: topicMap["Cerebellum"], question: "What are the deep cerebellar nuclei?", answer: "Dentate (largest), emboliform, globose, and fastigial nuclei; they are the output nuclei of the cerebellum.", difficulty: "hard" },
    { topicId: topicMap["Cerebellum"], question: "What is the role of mossy fibers vs. climbing fibers?", answer: "Mossy fibers (from spinal cord/brainstem): excite granule cells. Climbing fibers (from inferior olive): directly synapse on Purkinje cells; signal motor errors.", difficulty: "hard" },
    { topicId: topicMap["Cerebellum"], question: "Where does cerebellar output project?", answer: "Via the superior cerebellar peduncle (decussating) to the contralateral thalamus (VL nucleus) and then to motor cortex.", difficulty: "hard" },
    { topicId: topicMap["Cerebellum"], question: "What is truncal ataxia?", answer: "Wide-based unsteady gait and trunk instability due to vermis/midline cerebellar lesions (common in alcoholic cerebellar degeneration).", difficulty: "medium" },
    { topicId: topicMap["Cerebellum"], question: "Which cerebellar syndrome is caused by alcohol abuse?", answer: "Alcoholic cerebellar degeneration: primarily affects the anterior/superior vermis, causing gait ataxia with relative sparing of arm coordination.", difficulty: "medium" },
    { topicId: topicMap["Cerebellum"], question: "What is cerebellar plasticity?", answer: "The cerebellum's capacity to modify its circuitry based on error signals (especially from climbing fibers), supporting motor learning and adaptation.", difficulty: "hard" },

    // ===== BASAL GANGLIA (12 cards) =====
    { topicId: topicMap["Basal Ganglia"], question: "What structures comprise the basal ganglia?", answer: "Striatum (caudate + putamen), globus pallidus (GPi and GPe), subthalamic nucleus (STN), and substantia nigra (SNpc and SNpr).", difficulty: "medium" },
    { topicId: topicMap["Basal Ganglia"], question: "What is the direct pathway in basal ganglia circuitry?", answer: "Striatum (D1) inhibits GPi → thalamus disinhibited → excites motor cortex → facilitates movement.", difficulty: "hard" },
    { topicId: topicMap["Basal Ganglia"], question: "What neurotransmitter is lost in Parkinson's disease and where?", answer: "Dopamine lost in the substantia nigra pars compacta (SNpc), disrupting the nigrostriatal pathway.", difficulty: "medium" },
    { topicId: topicMap["Basal Ganglia"], question: "What are the cardinal features of Parkinson's disease (TRAP)?", answer: "Tremor at rest (pill-rolling), Rigidity (cogwheel), Akinesia/Bradykinesia, and Postural instability.", difficulty: "easy" },
    { topicId: topicMap["Basal Ganglia"], question: "What is the indirect pathway in basal ganglia circuitry?", answer: "Striatum (D2) inhibits GPe → STN disinhibited → excites GPi → thalamus inhibited → cortex suppressed → inhibits movement.", difficulty: "hard" },
    { topicId: topicMap["Basal Ganglia"], question: "What basal ganglia structure is affected in Huntington's disease?", answer: "The striatum (especially the caudate nucleus); loss of medium spiny neurons containing GABA and enkephalin.", difficulty: "medium" },
    { topicId: topicMap["Basal Ganglia"], question: "What is hemiballismus and what causes it?", answer: "Violent, flinging, involuntary movements of the proximal limbs on one side; caused by a lesion in the contralateral subthalamic nucleus.", difficulty: "hard" },
    { topicId: topicMap["Basal Ganglia"], question: "What is the role of dopamine in the basal ganglia?", answer: "Dopamine excites the direct pathway (via D1 receptors, facilitating movement) and inhibits the indirect pathway (via D2 receptors, also facilitating movement).", difficulty: "hard" },
    { topicId: topicMap["Basal Ganglia"], question: "What is the difference between hypokinetic and hyperkinetic basal ganglia disorders?", answer: "Hypokinetic: reduced movement amplitude and speed (e.g., Parkinson's disease). Hyperkinetic: excessive unwanted movements (e.g., Huntington's chorea, hemiballismus).", difficulty: "medium" },
    { topicId: topicMap["Basal Ganglia"], question: "What are D1 and D2 receptors?", answer: "Dopamine receptor subtypes: D1 receptors couple to Gs (stimulate adenylyl cyclase, excitatory); D2 couple to Gi (inhibit adenylyl cyclase, inhibitory).", difficulty: "hard" },
    { topicId: topicMap["Basal Ganglia"], question: "What is the mechanism of action of levodopa in Parkinson's disease?", answer: "Levodopa (L-DOPA) crosses the blood-brain barrier and is converted to dopamine by DOPA decarboxylase, replenishing depleted striatal dopamine.", difficulty: "medium" },
    { topicId: topicMap["Basal Ganglia"], question: "What is Wilson's disease and which brain region is affected?", answer: "A genetic disorder of copper metabolism (ATP7B mutation); copper accumulates in the basal ganglia (especially putamen), causing movement disorders and psychiatric symptoms.", difficulty: "hard" },

    // ===== BRAINSTEM & DIENCEPHALON (12 cards) =====
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What are the three components of the brainstem?", answer: "Midbrain (mesencephalon), pons, and medulla oblongata.", difficulty: "easy" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What is the reticular activating system?", answer: "A network of brainstem nuclei regulating arousal, consciousness, and sleep-wake cycles.", difficulty: "medium" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What are the primary functions of the thalamus?", answer: "Relay station for sensory and motor information to the cortex; regulates consciousness and alertness.", difficulty: "medium" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What does the hypothalamus regulate?", answer: "Homeostasis: temperature, hunger, thirst, circadian rhythms, autonomic function, and hormonal secretion via the pituitary.", difficulty: "medium" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What cranial nerve nuclei are found in the midbrain?", answer: "CN III (oculomotor) and CN IV (trochlear).", difficulty: "hard" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What is Weber's syndrome?", answer: "Midbrain stroke causing ipsilateral CN III palsy (ptosis, mydriasis, 'down and out' eye) and contralateral hemiplegia.", difficulty: "hard" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What is Wallenberg's syndrome?", answer: "Lateral medullary syndrome: ipsilateral facial numbness, Horner's, ataxia, dysphagia; contralateral limb pain/temp loss. Caused by PICA occlusion.", difficulty: "hard" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What is the role of the locus coeruleus?", answer: "A pontine nucleus that is the primary source of norepinephrine in the CNS; involved in arousal, stress response, and attention.", difficulty: "hard" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What is the ventral tegmental area (VTA)?", answer: "A midbrain structure that is the origin of the mesocortical and mesolimbic dopamine pathways; critical for reward, motivation, and addiction.", difficulty: "hard" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What is the epithalamus?", answer: "Part of the diencephalon containing the pineal gland (melatonin secretion/circadian rhythms) and habenula (role in aversion learning).", difficulty: "medium" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What cranial nerves originate from the pons?", answer: "CN V (trigeminal), CN VI (abducens), CN VII (facial), and CN VIII (vestibulocochlear).", difficulty: "medium" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What is the role of the substantia nigra pars reticulata (SNpr)?", answer: "The SNpr is the main output nucleus of the basal ganglia (along with GPi); sends GABAergic (inhibitory) projections to the thalamus.", difficulty: "hard" },

    // ===== LIMBIC SYSTEM (12 cards) =====
    { topicId: topicMap["Limbic System"], question: "What are the key structures of the limbic system?", answer: "Hippocampus, amygdala, cingulate cortex, parahippocampal gyrus, septal nuclei, and mammillary bodies.", difficulty: "medium" },
    { topicId: topicMap["Limbic System"], question: "What is the primary function of the hippocampus?", answer: "Formation of new declarative (episodic and semantic) memories and spatial navigation.", difficulty: "easy" },
    { topicId: topicMap["Limbic System"], question: "What is the role of the amygdala?", answer: "Processing emotional memories (especially fear and threat), emotional responses, and conditioned fear learning.", difficulty: "easy" },
    { topicId: topicMap["Limbic System"], question: "What is the Papez circuit?", answer: "A neural circuit for emotion and memory: hippocampus → fornix → mammillary bodies → anterior thalamus → cingulate cortex → entorhinal cortex → hippocampus.", difficulty: "hard" },
    { topicId: topicMap["Limbic System"], question: "What is Klüver-Bucy syndrome?", answer: "Result of bilateral amygdala damage: hyperphagia, hypersexuality, visual agnosia, docility, and oral exploration of objects.", difficulty: "hard" },
    { topicId: topicMap["Limbic System"], question: "What is the fornix?", answer: "A white matter tract connecting the hippocampus to the mammillary bodies and septal nuclei; a key component of the Papez circuit.", difficulty: "medium" },
    { topicId: topicMap["Limbic System"], question: "What is the entorhinal cortex?", answer: "A parahippocampal region that serves as the main input/output gateway to the hippocampus, processing spatial and sensory information.", difficulty: "hard" },
    { topicId: topicMap["Limbic System"], question: "What role does the anterior cingulate cortex play?", answer: "Error monitoring, conflict detection, emotional regulation, and motivational aspects of behavior.", difficulty: "medium" },
    { topicId: topicMap["Limbic System"], question: "What is the role of the septal nuclei?", answer: "Modulate limbic arousal and emotion; project to hippocampus via the fornix providing cholinergic input; destruction increases aggression in animals.", difficulty: "hard" },
    { topicId: topicMap["Limbic System"], question: "What is Korsakoff syndrome and which limbic structure is involved?", answer: "Anterograde and retrograde amnesia with confabulation due to thiamine deficiency; primarily involves mammillary body and thalamus damage.", difficulty: "hard" },
    { topicId: topicMap["Limbic System"], question: "What is the hippocampal-neocortical memory consolidation model?", answer: "New memories are initially stored in the hippocampus and gradually transferred (consolidated) to distributed neocortical networks during sleep.", difficulty: "hard" },
    { topicId: topicMap["Limbic System"], question: "What is the difference between explicit and implicit memory?", answer: "Explicit (declarative) memory: conscious recollection of facts and events (hippocampus-dependent). Implicit memory: unconscious learning (habits, skills, conditioning) not requiring hippocampus.", difficulty: "medium" },

    // ===== CEREBRAL CORTEX (12 cards) =====
    { topicId: topicMap["Cerebral Cortex"], question: "What are the four cortical lobes and their primary functions?", answer: "Frontal (motor, executive function), Parietal (somatosensory, spatial), Temporal (auditory, language, memory), Occipital (visual processing).", difficulty: "easy" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is Broca's area and what happens when it is damaged?", answer: "Left inferior frontal gyrus (BA 44-45); involved in speech production. Damage causes Broca's aphasia: non-fluent, effortful speech with intact comprehension.", difficulty: "medium" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is Wernicke's area?", answer: "Left posterior superior temporal gyrus (BA 22); involved in language comprehension. Damage causes Wernicke's aphasia: fluent but meaningless speech with poor comprehension.", difficulty: "medium" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is the homunculus?", answer: "A somatotopic map of the body on the motor (precentral gyrus) and somatosensory (postcentral gyrus) cortex, where representation size reflects innervation density.", difficulty: "medium" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is prefrontal cortex dysfunction associated with?", answer: "Deficits in executive function: planning, working memory, impulse control, decision-making, and personality changes.", difficulty: "medium" },
    { topicId: topicMap["Cerebral Cortex"], question: "What are Brodmann areas?", answer: "A map of ~52 cytoarchitecturally distinct regions of the cerebral cortex defined by cell types and layering patterns; used to locate functional areas.", difficulty: "medium" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is cortical neuroplasticity?", answer: "The ability of the cortex to reorganize its structure and function in response to experience, learning, or injury.", difficulty: "medium" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is conduction aphasia?", answer: "Fluent speech and intact comprehension but poor repetition; caused by damage to the arcuate fasciculus connecting Broca's and Wernicke's areas.", difficulty: "hard" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is hemineglect?", answer: "Failure to attend to stimuli on the contralateral side of a brain lesion, typically caused by right parietal lobe damage; the patient ignores the left side of space.", difficulty: "hard" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is the role of the supplementary motor area (SMA)?", answer: "Located in the medial frontal lobe; involved in motor planning, bimanual coordination, and internally generated movements.", difficulty: "hard" },
    { topicId: topicMap["Cerebral Cortex"], question: "What are the six cortical layers?", answer: "I: molecular (plexiform); II: external granular; III: external pyramidal; IV: internal granular (main thalamic input); V: internal pyramidal (Betz cells, major output); VI: multiform/fusiform.", difficulty: "hard" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is Gerstmann's syndrome?", answer: "Damage to left angular gyrus (parietal lobe) causes: acalculia, agraphia, finger agnosia, and left-right disorientation.", difficulty: "hard" },

    // ===== SENSORY & MOTOR PATHWAYS (12 cards) =====
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What does the dorsal column-medial lemniscal pathway carry?", answer: "Fine touch, vibration, proprioception, and two-point discrimination from the contralateral body (crosses in medulla).", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What does the spinothalamic tract carry?", answer: "Pain, temperature, and crude touch; crosses near the spinal level it enters (contralateral sensation).", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What is the corticospinal tract?", answer: "The primary voluntary motor pathway from the motor cortex to spinal alpha motor neurons; decussates in the medullary pyramids (85-90% cross).", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "Where do dorsal column fibers cross?", answer: "In the medulla oblongata, forming the medial lemniscus, then traveling to the contralateral thalamus (VPL nucleus).", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What is the trigeminothalamic pathway?", answer: "Carries pain, temperature, and touch from the face; the trigeminal nucleus → crosses → contralateral VPM thalamus → somatosensory cortex.", difficulty: "hard" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What is the VPL nucleus of the thalamus?", answer: "Ventral posterolateral nucleus: the thalamic relay for body somatosensory information (pain, temperature, touch, proprioception from the trunk and limbs).", difficulty: "hard" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What is the rubrospinal tract?", answer: "A motor tract from the red nucleus (midbrain) to the spinal cord; involved in distal limb muscle control, especially when the corticospinal tract is damaged.", difficulty: "hard" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What is the lateral corticospinal tract's clinical significance?", answer: "It controls ipsilateral limb movements (having already crossed). Damage above the decussation causes contralateral weakness.", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What is a dermatome and why is it clinically important?", answer: "A skin area innervated by a single dorsal root. Clinical importance: allows identification of the level of spinal cord or nerve root lesions.", difficulty: "easy" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What sensory information travels via the spinocerebellar tracts?", answer: "Unconscious proprioception and muscle spindle information from the body to the cerebellum for motor coordination.", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What is the Babinski sign and what does it indicate?", answer: "Extension (dorsiflexion) of the great toe and fanning of the toes on plantar stimulation; indicates UMN lesion (or normal in infants).", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What is referred pain?", answer: "Pain perceived at a location different from the injured tissue, due to convergence of visceral and somatic pain afferents on the same spinal neurons (e.g., MI pain to left arm).", difficulty: "medium" },

    // ===== CNS DEVELOPMENT (12 cards) =====
    { topicId: topicMap["CNS Development"], question: "What is the neural tube?", answer: "The embryonic structure that closes around week 4 of gestation to form the CNS (brain rostrally, spinal cord caudally); failure causes neural tube defects.", difficulty: "easy" },
    { topicId: topicMap["CNS Development"], question: "What is a neural tube defect?", answer: "Failure of the neural tube to close during early development, leading to spina bifida (lower) or anencephaly (upper).", difficulty: "medium" },
    { topicId: topicMap["CNS Development"], question: "What is a critical period in brain development?", answer: "A time window during which the nervous system is especially sensitive to environmental experience, required for normal development of specific functions (e.g., visual cortex in first year).", difficulty: "medium" },
    { topicId: topicMap["CNS Development"], question: "What is synaptic pruning?", answer: "The elimination of excess synapses during development, refining neural circuits based on activity and experience; major phase in adolescence.", difficulty: "easy" },
    { topicId: topicMap["CNS Development"], question: "What is neurogenesis?", answer: "The process of generating new neurons from neural stem or progenitor cells; primarily occurs prenatally, but continues in the adult hippocampus (dentate gyrus) and olfactory bulb.", difficulty: "medium" },
    { topicId: topicMap["CNS Development"], question: "What is lissencephaly?", answer: "A rare brain malformation characterized by absent cortical folding (smooth brain) due to defective neuronal migration; causes severe intellectual disability and seizures.", difficulty: "hard" },
    { topicId: topicMap["CNS Development"], question: "What is the role of BDNF in neural development?", answer: "Brain-derived neurotrophic factor promotes neuronal survival, differentiation, axonal growth, and synaptic plasticity; important in LTP and memory.", difficulty: "hard" },
    { topicId: topicMap["CNS Development"], question: "What is the inside-out pattern of cortical development?", answer: "Cortical neurons are born sequentially; earlier-born neurons occupy deeper layers while later-born neurons migrate through them to populate superficial layers.", difficulty: "hard" },
    { topicId: topicMap["CNS Development"], question: "What is myelination and when does it occur?", answer: "The process of forming myelin sheaths around axons; begins prenatally and continues into the third decade, with frontal lobes myelinating last.", difficulty: "medium" },
    { topicId: topicMap["CNS Development"], question: "What are the three primary brain vesicles in embryonic development?", answer: "Prosencephalon (forebrain), mesencephalon (midbrain), and rhombencephalon (hindbrain); further divided into five secondary vesicles.", difficulty: "medium" },
    { topicId: topicMap["CNS Development"], question: "What is the subventricular zone (SVZ)?", answer: "A germinal zone lining the lateral ventricles; the major site of postnatal neurogenesis that provides new neurons to the olfactory bulb.", difficulty: "hard" },
    { topicId: topicMap["CNS Development"], question: "What environmental factors affect brain development?", answer: "Nutrition (especially folic acid, iodine), toxins (alcohol, lead, fetal alcohol syndrome), infections (rubella, CMV), stress hormones, and social experience all influence brain development.", difficulty: "medium" },

    // ===== DEMENTIA & ALZHEIMER'S DISEASE (12 cards) =====
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What are the hallmark pathological features of Alzheimer's disease?", answer: "Amyloid plaques (extracellular beta-amyloid deposits) and neurofibrillary tangles (intracellular hyperphosphorylated tau).", difficulty: "medium" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What is the earliest cognitive symptom typically seen in Alzheimer's disease?", answer: "Episodic memory impairment, particularly difficulty forming new memories (anterograde amnesia).", difficulty: "easy" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "How does Lewy body dementia differ from Alzheimer's disease?", answer: "Lewy body dementia features fluctuating cognition, visual hallucinations, REM sleep behavior disorder, and parkinsonism; caused by alpha-synuclein deposits.", difficulty: "hard" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What is vascular dementia?", answer: "Cognitive impairment caused by cerebrovascular disease (strokes or small vessel disease), often with stepwise progression and focal deficits.", difficulty: "medium" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What brain regions are first affected in Alzheimer's disease?", answer: "Entorhinal cortex and hippocampus (Braak stages I-II), then spreading to association cortex and eventually primary motor/sensory areas.", difficulty: "hard" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What is frontotemporal dementia (FTD)?", answer: "A group of dementias with prominent frontal and temporal lobe degeneration, causing personality changes, disinhibition, executive dysfunction (behavioral variant) or language deficits.", difficulty: "medium" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What is the amyloid cascade hypothesis?", answer: "The theory that accumulation of amyloid-β (from APP cleavage) initiates a cascade leading to tau pathology, neuroinflammation, synaptic loss, and neurodegeneration in Alzheimer's.", difficulty: "hard" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What is the APOE ε4 allele?", answer: "The strongest genetic risk factor for late-onset Alzheimer's disease; having one copy increases risk ~3x, two copies ~8-12x.", difficulty: "hard" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What medications are used to treat Alzheimer's disease?", answer: "Acetylcholinesterase inhibitors (donepezil, rivastigmine, galantamine) and the NMDA antagonist memantine; they treat symptoms but do not halt progression.", difficulty: "medium" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What is the difference between dementia and delirium?", answer: "Dementia: gradual onset, chronic, stable or progressive, consciousness intact. Delirium: acute onset, fluctuating, reversible, with impaired consciousness/attention.", difficulty: "medium" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What is pseudodementia?", answer: "Cognitive impairment caused by depression that mimics dementia; reversible with treatment of depression.", difficulty: "medium" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What is the role of cholinergic deficits in Alzheimer's disease?", answer: "Loss of cholinergic neurons in the basal nucleus of Meynert leads to widespread cholinergic deficits in cortex; contributes to memory impairment.", difficulty: "hard" },

    // ===== CEREBROVASCULAR SYSTEM (12 cards) =====
    { topicId: topicMap["Cerebrovascular System"], question: "What is the Circle of Willis?", answer: "An anastomotic ring of arteries at the base of the brain connecting anterior (carotid) and posterior (vertebrobasilar) circulation, providing collateral blood flow.", difficulty: "medium" },
    { topicId: topicMap["Cerebrovascular System"], question: "What is the difference between ischemic and hemorrhagic stroke?", answer: "Ischemic stroke: blockage of blood supply (thrombotic or embolic). Hemorrhagic stroke: vessel rupture causing bleeding into brain tissue or subarachnoid space.", difficulty: "easy" },
    { topicId: topicMap["Cerebrovascular System"], question: "What is a TIA?", answer: "Transient Ischemic Attack: brief neurological dysfunction from temporary cerebral ischemia with no permanent infarction; resolves within 24 hours.", difficulty: "easy" },
    { topicId: topicMap["Cerebrovascular System"], question: "What artery supplies the Broca and motor cortex areas?", answer: "The middle cerebral artery (MCA), specifically its superior division.", difficulty: "medium" },
    { topicId: topicMap["Cerebrovascular System"], question: "What are the FAST signs of stroke?", answer: "Face drooping, Arm weakness, Speech difficulty, Time to call emergency services.", difficulty: "easy" },
    { topicId: topicMap["Cerebrovascular System"], question: "What is a watershed infarct?", answer: "Ischemic damage at the border zones between major arterial territories, typically caused by global hypoperfusion (e.g., cardiac arrest).", difficulty: "hard" },
    { topicId: topicMap["Cerebrovascular System"], question: "What is the territory of the anterior cerebral artery (ACA)?", answer: "Medial frontal and parietal lobes; infarction causes leg weakness (more than arm) and behavioral changes.", difficulty: "medium" },
    { topicId: topicMap["Cerebrovascular System"], question: "What is autoregulation of cerebral blood flow?", answer: "The ability of cerebral vessels to maintain constant blood flow despite changes in perfusion pressure (typically MAP 60-150 mmHg).", difficulty: "hard" },
    { topicId: topicMap["Cerebrovascular System"], question: "What is a subarachnoid hemorrhage (SAH)?", answer: "Bleeding into the subarachnoid space, usually from a ruptured aneurysm; presents with sudden severe 'thunderclap' headache, neck stiffness, and photophobia.", difficulty: "medium" },
    { topicId: topicMap["Cerebrovascular System"], question: "What is the blood-brain barrier (BBB)?", answer: "A selective semipermeable barrier formed by cerebral capillary endothelial cells with tight junctions, astrocyte endfeet, and pericytes; protects the CNS from pathogens and toxins.", difficulty: "medium" },
    { topicId: topicMap["Cerebrovascular System"], question: "What is lacunar infarct?", answer: "Small deep infarcts in the basal ganglia, thalamus, internal capsule, or brainstem due to small vessel disease (lipohyalinosis), often from chronic hypertension.", difficulty: "hard" },
    { topicId: topicMap["Cerebrovascular System"], question: "What is the posterior inferior cerebellar artery (PICA) and what syndrome does its occlusion cause?", answer: "PICA supplies the lateral medulla; its occlusion causes Wallenberg's syndrome (lateral medullary syndrome): ipsilateral facial numbness, Horner's, ataxia; contralateral limb pain/temp loss.", difficulty: "hard" },

    // ===== NEURORADIOLOGY (12 cards) =====
    { topicId: topicMap["Neuroradiology"], question: "What appears bright (hyperintense) on T2-weighted MRI?", answer: "Water/fluid appears bright on T2, including CSF, edema, demyelination, and many pathological lesions.", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "What is DWI (diffusion-weighted imaging) used for?", answer: "Detecting acute ischemic stroke — restricted diffusion (bright on DWI, dark on ADC) indicates cytotoxic edema within minutes of ischemia.", difficulty: "hard" },
    { topicId: topicMap["Neuroradiology"], question: "What does CT without contrast best show?", answer: "Acute hemorrhage (hyperdense/bright white) and bony structures; fast and widely available for emergencies.", difficulty: "easy" },
    { topicId: topicMap["Neuroradiology"], question: "What appears bright on T1-weighted MRI?", answer: "Fat and subacute hemorrhage (methemoglobin) appear bright on T1. Useful for anatomical detail and gadolinium enhancement.", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "What does FLAIR MRI show?", answer: "Fluid-Attenuated Inversion Recovery: suppresses CSF signal while keeping T2 lesion signal; excellent for periventricular white matter lesions (e.g., MS plaques, gliosis).", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "What is the role of gadolinium in MRI?", answer: "Gadolinium is an MRI contrast agent that enhances areas where the blood-brain barrier is disrupted (e.g., active MS plaques, tumors, abscesses).", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "What neuroimaging finding is characteristic of MS?", answer: "Periventricular white matter lesions (plaques) on MRI, classically 'Dawson's fingers' perpendicular to the ventricles; high signal on T2/FLAIR.", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "What is PET scanning used for in neurology?", answer: "Positron emission tomography measures metabolic activity; used for detecting amyloid plaques in Alzheimer's, epileptic foci, and brain tumors.", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "What is functional MRI (fMRI)?", answer: "fMRI measures BOLD (blood-oxygen-level-dependent) signal to map brain activity in real time; used in research and presurgical planning.", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "What does a midline shift on CT indicate?", answer: "A shift of midline structures (e.g., septum pellucidum) to one side, indicating significant mass effect from a lesion (hematoma, tumor, edema); > 5mm is clinically significant.", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "What is diffusion tensor imaging (DTI)?", answer: "An MRI technique that maps the direction of water diffusion along white matter tracts, allowing visualization of fiber pathways (tractography).", difficulty: "hard" },
    { topicId: topicMap["Neuroradiology"], question: "What is MR spectroscopy (MRS)?", answer: "A non-invasive technique that measures brain metabolite concentrations (NAA, choline, creatine, lactate, myoinositol) to characterize brain lesions.", difficulty: "hard" },

    // ===== MULTIPLE SCLEROSIS (12 cards) =====
    { topicId: topicMap["Multiple Sclerosis"], question: "What is the pathological hallmark of multiple sclerosis?", answer: "Demyelinating plaques (lesions) in CNS white matter, disseminated in space and time, with inflammatory infiltration.", difficulty: "medium" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What is Uhthoff's phenomenon?", answer: "Temporary worsening of MS symptoms with increased body temperature (e.g., after exercise or hot bath); due to heat impairing conduction in demyelinated axons.", difficulty: "hard" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What is the most common clinical presentation of MS?", answer: "Relapsing-remitting MS (RRMS): episodes of neurological symptoms (relapses) followed by full or partial recovery.", difficulty: "easy" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What are the McDonald criteria?", answer: "Diagnostic criteria for MS requiring evidence of CNS lesions disseminated in space AND time, excluding other diagnoses.", difficulty: "medium" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What is optic neuritis and its association with MS?", answer: "Inflammation of the optic nerve causing painful vision loss; approximately 50% of optic neuritis patients develop MS within 15 years.", difficulty: "medium" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What is Lhermitte's sign?", answer: "An electric shock sensation traveling down the spine with neck flexion; caused by demyelination in the cervical cord; associated with MS.", difficulty: "hard" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What are the four clinical subtypes of MS?", answer: "Relapsing-remitting (RRMS), secondary progressive (SPMS), primary progressive (PPMS), and progressive-relapsing (PRMS).", difficulty: "medium" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What CSF findings are typical of MS?", answer: "Oligoclonal bands (IgG) on electrophoresis, elevated IgG index, mild lymphocytic pleocytosis; found in ~90% of MS patients.", difficulty: "hard" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What is the role of interferons in MS treatment?", answer: "Interferon-beta reduces relapse frequency and MRI lesion burden by modulating immune responses (reducing T-cell activation and crossing of BBB).", difficulty: "medium" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What evoked potentials are used in MS diagnosis?", answer: "Visual evoked potentials (VEPs) show delayed P100 response in optic neuritis/MS; SSEP and BAEP can also show subclinical lesions.", difficulty: "hard" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What is internuclear ophthalmoplegia and why does it occur in MS?", answer: "Failure of adduction on lateral gaze with nystagmus in the abducting eye; caused by a medial longitudinal fasciculus (MLF) lesion, a classic MS finding.", difficulty: "hard" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What is the double vision (diplopia) connection in MS?", answer: "MS lesions in the brainstem (MLF, CN VI, CN III nuclei) can disrupt eye movement coordination, causing diplopia, a common MS symptom.", difficulty: "medium" },

    // ===== PAIN & NOCICEPTION (10 cards) =====
    { topicId: topicMap["Pain & Nociception"], question: "What are the two main types of pain fibers?", answer: "A-delta fibers (fast, sharp, localized pain) and C fibers (slow, burning, diffuse pain).", difficulty: "medium" },
    { topicId: topicMap["Pain & Nociception"], question: "What is central sensitization?", answer: "Increased responsiveness of pain-processing neurons in the CNS following repeated or intense stimulation, contributing to chronic pain and allodynia.", difficulty: "hard" },
    { topicId: topicMap["Pain & Nociception"], question: "What is the gate control theory of pain?", answer: "Non-nociceptive stimuli (large-fiber input) can inhibit pain transmission at the spinal cord by activating inhibitory interneurons, 'closing the gate' to pain signals.", difficulty: "medium" },
    { topicId: topicMap["Pain & Nociception"], question: "What is allodynia?", answer: "Pain from a stimulus that normally would not cause pain (e.g., light touch); a hallmark of central sensitization and neuropathic pain.", difficulty: "medium" },
    { topicId: topicMap["Pain & Nociception"], question: "What is the role of the periaqueductal gray (PAG)?", answer: "A midbrain structure critical for endogenous pain modulation; stimulation activates descending inhibitory pathways (serotonin, norepinephrine, endorphins).", difficulty: "hard" },
    { topicId: topicMap["Pain & Nociception"], question: "What are endogenous opioids?", answer: "Naturally occurring peptides (endorphins, enkephalins, dynorphins) that bind opioid receptors (mu, delta, kappa) to reduce pain.", difficulty: "medium" },
    { topicId: topicMap["Pain & Nociception"], question: "What is phantom limb pain?", answer: "Pain perceived in a limb that has been amputated; caused by cortical reorganization and maladaptive central sensitization.", difficulty: "medium" },
    { topicId: topicMap["Pain & Nociception"], question: "What is the difference between nociceptive and neuropathic pain?", answer: "Nociceptive: caused by tissue damage activating nociceptors (acute, usually well-localized). Neuropathic: caused by nerve damage, often burning/electric, with allodynia/hyperalgesia.", difficulty: "medium" },
    { topicId: topicMap["Pain & Nociception"], question: "What substance P does in pain transmission?", answer: "Substance P is a neuropeptide released by C fibers at the spinal cord; activates NK1 receptors on dorsal horn neurons, facilitating pain transmission.", difficulty: "hard" },
    { topicId: topicMap["Pain & Nociception"], question: "What is fibromyalgia and its neural basis?", answer: "A chronic pain disorder with widespread musculoskeletal pain, fatigue, and tenderness; characterized by central sensitization without peripheral tissue damage.", difficulty: "medium" },

    // ===== NEUROGENETICS (10 cards) =====
    { topicId: topicMap["Neurogenetics"], question: "What gene mutation causes Huntington's disease?", answer: "An expanded CAG trinucleotide repeat (>36 repeats) in the HTT gene on chromosome 4; more repeats correlate with earlier onset.", difficulty: "medium" },
    { topicId: topicMap["Neurogenetics"], question: "What is the mode of inheritance of Huntington's disease?", answer: "Autosomal dominant with complete penetrance.", difficulty: "easy" },
    { topicId: topicMap["Neurogenetics"], question: "What is anticipation in genetics?", answer: "A phenomenon where genetic diseases become more severe or appear at earlier ages in successive generations, often due to expanding trinucleotide repeats.", difficulty: "medium" },
    { topicId: topicMap["Neurogenetics"], question: "What gene is responsible for familial Alzheimer's disease (early-onset)?", answer: "Mutations in APP, PSEN1 (presenilin-1), or PSEN2 (presenilin-2); PSEN1 mutations are most common and cause the most severe early-onset forms.", difficulty: "hard" },
    { topicId: topicMap["Neurogenetics"], question: "What is neurofibromatosis type 1 (NF1)?", answer: "An autosomal dominant disorder (NF1 gene, chromosome 17) causing café-au-lait spots, neurofibromas, Lisch nodules, and learning disabilities.", difficulty: "medium" },
    { topicId: topicMap["Neurogenetics"], question: "What causes Duchenne muscular dystrophy?", answer: "X-linked recessive mutations in the dystrophin gene; absence of dystrophin protein leads to progressive muscle degeneration and weakness.", difficulty: "medium" },
    { topicId: topicMap["Neurogenetics"], question: "What is a trinucleotide repeat disorder?", answer: "A genetic disease caused by unstable expansions of three-nucleotide sequences (e.g., CAG in HD, CGG in Fragile X, CTG in myotonic dystrophy).", difficulty: "medium" },
    { topicId: topicMap["Neurogenetics"], question: "What is Fragile X syndrome?", answer: "The most common inherited cause of intellectual disability; caused by CGG repeat expansion in the FMR1 gene on the X chromosome, silencing FMRP protein.", difficulty: "medium" },
    { topicId: topicMap["Neurogenetics"], question: "What is the BRCA analogy to neurological genetics?", answer: "Like BRCA in breast cancer, APOE ε4 is a susceptibility allele (not deterministic) for Alzheimer's disease, increasing risk without guaranteeing disease.", difficulty: "hard" },
    { topicId: topicMap["Neurogenetics"], question: "What is Rett syndrome?", answer: "A neurodevelopmental disorder almost exclusively in females; caused by MECP2 mutations; characterized by normal early development followed by regression, hand-wringing, and autism features.", difficulty: "hard" },

    // ===== VISUAL SYSTEM (10 cards) =====
    { topicId: topicMap["Visual System"], question: "What visual field defect results from optic chiasm damage?", answer: "Bitemporal hemianopia (loss of both temporal visual fields), classically caused by pituitary tumors compressing the chiasm.", difficulty: "hard" },
    { topicId: topicMap["Visual System"], question: "Where does the optic nerve cross in the brain?", answer: "At the optic chiasm — nasal fibers from each eye cross to the opposite side; temporal fibers remain ipsilateral.", difficulty: "medium" },
    { topicId: topicMap["Visual System"], question: "What is the primary visual cortex?", answer: "V1 (area 17/striate cortex) in the occipital lobe, along the calcarine sulcus; processes basic visual features like orientation, contrast, and motion.", difficulty: "easy" },
    { topicId: topicMap["Visual System"], question: "What is the dorsal visual stream?", answer: "The 'where/how' pathway: from V1 → parietal cortex; processes spatial location, motion, and visuomotor guidance.", difficulty: "medium" },
    { topicId: topicMap["Visual System"], question: "What is the ventral visual stream?", answer: "The 'what' pathway: from V1 → temporal cortex; processes object recognition, color, and face identification.", difficulty: "medium" },
    { topicId: topicMap["Visual System"], question: "What is prosopagnosia?", answer: "The inability to recognize faces despite intact vision; caused by damage to the fusiform face area (right fusiform gyrus).", difficulty: "hard" },
    { topicId: topicMap["Visual System"], question: "What is the lateral geniculate nucleus (LGN)?", answer: "A thalamic nucleus that receives retinal input and relays it to the primary visual cortex (V1) via the optic radiations.", difficulty: "medium" },
    { topicId: topicMap["Visual System"], question: "What is a homonymous hemianopia?", answer: "Loss of the same half of the visual field in both eyes (e.g., right homonymous hemianopia from left occipital or optic radiation lesion).", difficulty: "medium" },
    { topicId: topicMap["Visual System"], question: "What types of photoreceptors are found in the retina?", answer: "Rods (low light, peripheral, no color) and cones (bright light, foveal, three types for color: S/M/L wavelengths).", difficulty: "easy" },
    { topicId: topicMap["Visual System"], question: "What is retinotopic mapping?", answer: "The systematic spatial organization of the visual system where adjacent retinal regions project to adjacent cortical regions; preserved throughout the visual pathway.", difficulty: "medium" },

    // ===== AUDITORY SYSTEM (10 cards) =====
    { topicId: topicMap["Auditory System"], question: "What is tonotopy?", answer: "The systematic organization where different frequencies are processed at different locations: high frequencies at the cochlear base, low frequencies at the apex.", difficulty: "medium" },
    { topicId: topicMap["Auditory System"], question: "What is the primary auditory cortex?", answer: "Heschl's gyrus (A1, Brodmann areas 41-42) in the superior temporal plane; processes pitch, tone, and loudness.", difficulty: "medium" },
    { topicId: topicMap["Auditory System"], question: "What is the role of the cochlea?", answer: "The spiral, fluid-filled inner ear structure that transduces sound vibrations into neural signals via the basilar membrane and hair cells.", difficulty: "easy" },
    { topicId: topicMap["Auditory System"], question: "What is the difference between conductive and sensorineural hearing loss?", answer: "Conductive: mechanical problem transmitting sound (middle/outer ear). Sensorineural: damaged hair cells or auditory nerve. Distinguished by Rinne and Weber tests.", difficulty: "medium" },
    { topicId: topicMap["Auditory System"], question: "What is the auditory brainstem pathway?", answer: "Cochlea → cochlear nuclei (medulla) → superior olivary complex (binaural processing) → inferior colliculus (midbrain) → medial geniculate nucleus (thalamus) → auditory cortex.", difficulty: "hard" },
    { topicId: topicMap["Auditory System"], question: "What is the role of the superior olivary complex?", answer: "Processes interaural time differences (ITD) and interaural level differences (ILD) for sound localization in azimuth.", difficulty: "hard" },
    { topicId: topicMap["Auditory System"], question: "What is otoacoustic emission (OAE)?", answer: "Sound produced by the outer hair cells of the cochlea; used clinically to screen newborn hearing and assess cochlear function.", difficulty: "hard" },
    { topicId: topicMap["Auditory System"], question: "What is pure word deafness?", answer: "The inability to comprehend spoken words despite normal hearing and intact reading/speech; caused by bilateral auditory cortex lesions or disconnection.", difficulty: "hard" },
    { topicId: topicMap["Auditory System"], question: "What does the auditory dorsal stream process?", answer: "Spatial location of sounds and auditory-motor integration ('where' pathway, projecting to posterior parietal cortex).", difficulty: "medium" },
    { topicId: topicMap["Auditory System"], question: "What is tinnitus and its neural mechanism?", answer: "Perception of sound without external stimulus; often caused by cochlear damage → cortical reorganization generating phantom auditory activity.", difficulty: "medium" },

    // ===== SOMATOSENSORY & TOUCH (10 cards) =====
    { topicId: topicMap["Somatosensory & Touch"], question: "What are Meissner's corpuscles?", answer: "Rapidly adapting mechanoreceptors in glabrous (hairless) skin detecting light touch and texture; highest density in fingertips.", difficulty: "medium" },
    { topicId: topicMap["Somatosensory & Touch"], question: "What is the two-point discrimination test?", answer: "Measures the smallest distance at which two simultaneous touch stimuli are perceived as separate; reflects receptor density and cortical magnification.", difficulty: "easy" },
    { topicId: topicMap["Somatosensory & Touch"], question: "What are Pacinian corpuscles?", answer: "Rapidly adapting deep pressure receptors sensitive to vibration (high frequency); located in deeper skin layers and joints.", difficulty: "medium" },
    { topicId: topicMap["Somatosensory & Touch"], question: "What are Merkel's discs?", answer: "Slowly adapting type I mechanoreceptors detecting sustained pressure and fine spatial detail (e.g., reading Braille).", difficulty: "medium" },
    { topicId: topicMap["Somatosensory & Touch"], question: "What is proprioception?", answer: "The sense of body position, limb movement, and muscle tension, mediated by muscle spindles (Ia and II afferents) and Golgi tendon organs.", difficulty: "easy" },
    { topicId: topicMap["Somatosensory & Touch"], question: "What is the somatosensory cortex and where is it?", answer: "The postcentral gyrus (Brodmann areas 1, 2, 3); receives touch, pressure, vibration, temperature, and proprioceptive information from the contralateral body.", difficulty: "easy" },
    { topicId: topicMap["Somatosensory & Touch"], question: "What is astereognosis?", answer: "The inability to identify objects by touch alone with intact sensation; caused by parietal lobe lesions (tactile agnosia).", difficulty: "hard" },
    { topicId: topicMap["Somatosensory & Touch"], question: "What is the cortical magnification factor?", answer: "The disproportionate amount of somatosensory cortex devoted to highly sensitive areas (fingers, lips, tongue) relative to their physical size.", difficulty: "medium" },
    { topicId: topicMap["Somatosensory & Touch"], question: "What are Ruffini endings?", answer: "Slowly adapting mechanoreceptors detecting sustained skin stretch and finger position; thought to contribute to proprioception.", difficulty: "hard" },
    { topicId: topicMap["Somatosensory & Touch"], question: "What is the role of the parietal operculum (S2)?", answer: "The secondary somatosensory cortex processes pain, temperature, and tactile information bilaterally; also involved in tactile learning and memory.", difficulty: "hard" },

    // ===== CHEMICAL SENSES (10 cards) =====
    { topicId: topicMap["Chemical Senses"], question: "What is anosmia and what can cause it?", answer: "Loss of smell. Causes: head trauma (shearing CN I), viral infection (COVID-19), Parkinson's, Alzheimer's, normal aging, nasal polyps.", difficulty: "easy" },
    { topicId: topicMap["Chemical Senses"], question: "What are the five basic tastes?", answer: "Sweet, salty, sour, bitter, and umami (savory).", difficulty: "easy" },
    { topicId: topicMap["Chemical Senses"], question: "What is the olfactory pathway?", answer: "Olfactory epithelium → olfactory nerves (CN I) → olfactory bulb → olfactory cortex (pyriform cortex/amygdala) → thalamus → orbitofrontal cortex.", difficulty: "hard" },
    { topicId: topicMap["Chemical Senses"], question: "How does olfaction differ from other senses in its thalamic relay?", answer: "Olfaction has a direct connection to the limbic system (amygdala, piriform cortex) without first going through the thalamus; all other senses relay through the thalamus.", difficulty: "hard" },
    { topicId: topicMap["Chemical Senses"], question: "What are taste receptor cells and where are they located?", answer: "Specialized cells in taste buds on fungiform, circumvallate, and foliate papillae of the tongue; detect chemical stimuli and synapse with cranial nerves VII, IX, and X.", difficulty: "medium" },
    { topicId: topicMap["Chemical Senses"], question: "What cranial nerves carry taste information?", answer: "CN VII (chorda tympani, anterior 2/3 tongue), CN IX (posterior 1/3 tongue), CN X (epiglottis/pharynx). All converge on the nucleus tractus solitarius.", difficulty: "hard" },
    { topicId: topicMap["Chemical Senses"], question: "What is parosmia?", answer: "A distorted sense of smell where familiar odors are perceived differently, often as unpleasant; common after viral anosmia recovery.", difficulty: "medium" },
    { topicId: topicMap["Chemical Senses"], question: "What is phantosmia?", answer: "Perception of a smell without an external odor stimulus; can occur in temporal lobe epilepsy (olfactory aura), migraines, or after olfactory nerve damage.", difficulty: "medium" },
    { topicId: topicMap["Chemical Senses"], question: "Why is olfactory loss an early sign of Alzheimer's and Parkinson's?", answer: "Olfactory bulb and entorhinal cortex are among the first regions affected in both diseases; olfactory testing may serve as an early biomarker.", difficulty: "hard" },
    { topicId: topicMap["Chemical Senses"], question: "What is the orbitofrontal cortex's role in flavor perception?", answer: "Integrates olfactory and gustatory inputs to create the perception of complex flavors and food reward; critical for flavor learning and palatability.", difficulty: "hard" },

    // ===== VESTIBULAR SYSTEM (10 cards) =====
    { topicId: topicMap["Vestibular System"], question: "What are the semicircular canals and what do they detect?", answer: "Three fluid-filled canals (anterior, posterior, lateral) that detect rotational/angular acceleration of the head.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "What is BPPV?", answer: "Benign Paroxysmal Positional Vertigo: brief vertigo caused by displaced otoconia in semicircular canals, triggered by head position changes.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "What do the otolith organs detect?", answer: "The utricle detects horizontal linear acceleration and head tilt; the saccule detects vertical linear acceleration and gravity.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "What is the vestibulo-ocular reflex (VOR)?", answer: "A reflex that stabilizes gaze during head movement by generating compensatory eye movements in the opposite direction.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "What is Menière's disease?", answer: "An inner ear disorder characterized by episodic vertigo, fluctuating sensorineural hearing loss, tinnitus, and ear fullness; caused by endolymphatic hydrops.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "What is the difference between central and peripheral vertigo?", answer: "Peripheral: unidirectional nystagmus, fatigable, no neurological signs (e.g., BPPV). Central: direction-changing nystagmus, non-fatigable, with neurological signs (e.g., cerebellar stroke).", difficulty: "hard" },
    { topicId: topicMap["Vestibular System"], question: "What is the Epley maneuver?", answer: "A canalith repositioning maneuver to treat BPPV by moving displaced otoconia from the posterior semicircular canal back to the utricle.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "What causes vestibular neuritis?", answer: "Usually viral inflammation of the vestibular nerve (often post-URI), causing acute severe vertigo lasting days without hearing loss; treated with vestibular suppressants.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "What is the HINTS exam used for?", answer: "Head Impulse test, Nystagmus pattern, Test of Skew: a bedside clinical exam to differentiate peripheral vertigo from central (stroke) vertigo.", difficulty: "hard" },
    { topicId: topicMap["Vestibular System"], question: "What is the vestibulocochlear nerve (CN VIII)?", answer: "The eighth cranial nerve with two divisions: the vestibular nerve (balance) and cochlear nerve (hearing); travels through the internal auditory canal.", difficulty: "easy" },

    // ===== MOTOR CONTROL (10 cards) =====
    { topicId: topicMap["Motor Control"], question: "What is the motor unit?", answer: "A single alpha motor neuron and all the muscle fibers it innervates; the basic functional unit of motor control.", difficulty: "easy" },
    { topicId: topicMap["Motor Control"], question: "What is the size principle of motor unit recruitment?", answer: "Small, slow-twitch (fatigue-resistant) motor units are recruited first; larger, fast-twitch units are recruited as force demand increases.", difficulty: "medium" },
    { topicId: topicMap["Motor Control"], question: "What is the primary motor cortex?", answer: "The precentral gyrus (Brodmann area 4); organizes voluntary movements of the contralateral body via the corticospinal tract.", difficulty: "easy" },
    { topicId: topicMap["Motor Control"], question: "What is the role of the premotor cortex (PMC)?", answer: "Located anterior to the primary motor cortex (BA 6); involved in preparation, selection, and external cue-guided movement.", difficulty: "medium" },
    { topicId: topicMap["Motor Control"], question: "What is the role of muscle spindles?", answer: "Intrafusal muscle fibers that detect muscle stretch/length changes; their Ia afferents activate alpha motor neurons to resist stretching (stretch reflex).", difficulty: "medium" },
    { topicId: topicMap["Motor Control"], question: "What are Golgi tendon organs?", answer: "Tension sensors located at muscle-tendon junctions; activate Ib afferents that inhibit the same muscle (autogenic inhibition) to prevent excessive force.", difficulty: "medium" },
    { topicId: topicMap["Motor Control"], question: "What is an EMG (electromyography) and what does it measure?", answer: "A diagnostic test measuring electrical activity in muscles at rest and during contraction; used to distinguish myopathies from neuropathies.", difficulty: "medium" },
    { topicId: topicMap["Motor Control"], question: "What is spasticity and what causes it?", answer: "Velocity-dependent increase in muscle tone with exaggerated stretch reflexes; caused by loss of descending inhibitory control (UMN lesion) over spinal circuits.", difficulty: "medium" },
    { topicId: topicMap["Motor Control"], question: "What is motor homunculus distortion?", answer: "Disproportionate motor cortex representation of the hands and face (large), reflecting the complexity of fine motor control in these regions.", difficulty: "easy" },
    { topicId: topicMap["Motor Control"], question: "What is the role of the supplementary motor area in motor control?", answer: "The SMA (medial BA 6) is critical for internally generated movements, bimanual coordination, and motor planning; active before movement begins.", difficulty: "hard" },

    // ===== SLEEP & CIRCADIAN RHYTHMS (10 cards) =====
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "What are the stages of sleep?", answer: "NREM stages N1 (light sleep), N2 (sleep spindles, K-complexes), N3 (slow-wave/deep sleep); and REM (dreaming, muscle atonia).", difficulty: "easy" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "What is the role of the suprachiasmatic nucleus (SCN)?", answer: "The master circadian clock in the hypothalamus; regulates ~24-hour biological rhythms synchronized to light-dark cycles via retinal input.", difficulty: "medium" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "What is REM sleep behavior disorder?", answer: "Loss of normal REM muscle atonia causing people to act out dreams physically; strongly associated with neurodegenerative diseases (Parkinson's, Lewy body dementia).", difficulty: "hard" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "What is narcolepsy and its neurobiological cause?", answer: "A sleep disorder with excessive daytime sleepiness, cataplexy, sleep paralysis, and hallucinations; caused by loss of hypocretin (orexin) neurons in the hypothalamus.", difficulty: "hard" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "What is the role of adenosine in sleep?", answer: "Adenosine accumulates in the brain during wakefulness, creating sleep pressure; caffeine works by blocking adenosine receptors.", difficulty: "medium" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "What hormones are regulated by circadian rhythms?", answer: "Cortisol (peaks at dawn), melatonin (peaks at night), growth hormone (peaks during slow-wave sleep), and TSH.", difficulty: "medium" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "What is sleep spindle and its significance?", answer: "Brief bursts of 12-15 Hz oscillations in N2 sleep generated by thalamo-cortical circuits; associated with memory consolidation and sleep stability.", difficulty: "hard" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "What is insomnia disorder?", answer: "Persistent difficulty initiating or maintaining sleep, or early morning awakening with daytime distress; the most common sleep disorder.", difficulty: "easy" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "What is obstructive sleep apnea (OSA)?", answer: "Repeated episodes of upper airway obstruction during sleep causing oxygen desaturation and arousal; associated with hypertension, cognitive impairment, and cardiovascular risk.", difficulty: "medium" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "What is the two-process model of sleep regulation?", answer: "Sleep is regulated by Process C (circadian clock, SCN) and Process S (sleep homeostasis/adenosine buildup); interaction determines sleep timing and depth.", difficulty: "hard" },

    // ===== NEUROENDOCRINOLOGY (10 cards) =====
    { topicId: topicMap["Neuroendocrinology"], question: "What is the HPA axis?", answer: "The Hypothalamic-Pituitary-Adrenal axis regulates the stress response: CRH (hypothalamus) → ACTH (pituitary) → cortisol (adrenal cortex).", difficulty: "medium" },
    { topicId: topicMap["Neuroendocrinology"], question: "What is cortisol's effect on the hippocampus?", answer: "Chronic high cortisol causes hippocampal atrophy and suppresses neurogenesis, impairing memory formation; explains cognitive effects of chronic stress and depression.", difficulty: "hard" },
    { topicId: topicMap["Neuroendocrinology"], question: "What is the role of oxytocin?", answer: "A hypothalamic neuropeptide (released from posterior pituitary) promoting social bonding, trust, maternal behavior, and uterine contractions during birth.", difficulty: "medium" },
    { topicId: topicMap["Neuroendocrinology"], question: "What is the difference between releasing hormones and trophic hormones?", answer: "Hypothalamus releases releasing/inhibiting hormones (CRH, TRH, GnRH) → anterior pituitary releases trophic hormones (ACTH, TSH, LH, FSH) → target glands.", difficulty: "medium" },
    { topicId: topicMap["Neuroendocrinology"], question: "What is ADH (vasopressin) and its primary role?", answer: "Antidiuretic hormone released from the posterior pituitary; regulates water retention in the kidneys and blood pressure.", difficulty: "easy" },
    { topicId: topicMap["Neuroendocrinology"], question: "What is the role of the pineal gland?", answer: "Secretes melatonin in response to darkness (via SCN); regulates circadian rhythms and seasonal reproductive cycles.", difficulty: "easy" },
    { topicId: topicMap["Neuroendocrinology"], question: "What is thyroid hormone's role in brain development?", answer: "Critical for myelination, neuronal differentiation, and synaptic development; thyroid deficiency in infancy causes cretinism (intellectual disability).", difficulty: "hard" },
    { topicId: topicMap["Neuroendocrinology"], question: "What is Cushing's syndrome and its neurological effects?", answer: "Excess cortisol (from tumor or exogenous steroids) causes hippocampal atrophy, memory problems, depression, and psychosis.", difficulty: "medium" },
    { topicId: topicMap["Neuroendocrinology"], question: "What is the role of estrogen in the brain?", answer: "Estrogen promotes dendritic spine density, serotonin production, neuroprotection, and cognitive function; estrogen loss at menopause affects memory.", difficulty: "medium" },
    { topicId: topicMap["Neuroendocrinology"], question: "What is the hypothalamic-pituitary-gonadal (HPG) axis?", answer: "GnRH (hypothalamus) → LH and FSH (pituitary) → sex hormones (gonads: testosterone/estrogen); regulates reproduction and influences brain development and mood.", difficulty: "medium" },

    // ===== PSYCHOPATHOLOGY (10 cards) =====
    { topicId: topicMap["Psychopathology"], question: "What are negative symptoms of schizophrenia?", answer: "Reductions or absences of normal functions: flat affect, alogia (poverty of speech), avolition, anhedonia, and social withdrawal.", difficulty: "medium" },
    { topicId: topicMap["Psychopathology"], question: "What is the dopamine hypothesis of schizophrenia?", answer: "Excess dopaminergic activity in the mesolimbic pathway contributes to positive symptoms (hallucinations, delusions); reduced dopamine in the mesocortical pathway relates to negative/cognitive symptoms.", difficulty: "hard" },
    { topicId: topicMap["Psychopathology"], question: "What brain changes are seen in schizophrenia?", answer: "Enlarged ventricles, reduced gray matter (especially prefrontal, temporal, hippocampal), and disrupted white matter connectivity.", difficulty: "medium" },
    { topicId: topicMap["Psychopathology"], question: "What are the core features of major depressive disorder (MDD)?", answer: "Depressed mood and/or anhedonia for ≥2 weeks, plus 4+ of: weight change, sleep disturbance, psychomotor changes, fatigue, worthlessness, concentration problems, suicidal ideation.", difficulty: "medium" },
    { topicId: topicMap["Psychopathology"], question: "What neurotransmitters are implicated in depression?", answer: "Serotonin, norepinephrine, and dopamine deficiencies are implicated; modern theories also emphasize glutamate, neuroinflammation, and HPA axis dysregulation.", difficulty: "medium" },
    { topicId: topicMap["Psychopathology"], question: "What is bipolar disorder and its neural correlates?", answer: "Recurrent episodes of mania and depression; associated with amygdala hyperactivity, prefrontal hypoactivity, and disrupted circadian/sleep regulation.", difficulty: "medium" },
    { topicId: topicMap["Psychopathology"], question: "What is PTSD and its neural basis?", answer: "Post-traumatic stress disorder from trauma exposure; characterized by amygdala hyperactivation, hippocampal atrophy, and reduced vmPFC inhibitory control of fear.", difficulty: "hard" },
    { topicId: topicMap["Psychopathology"], question: "What is anhedonia?", answer: "Loss of pleasure in previously enjoyable activities; a core feature of depression and negative symptoms of schizophrenia; associated with reduced dopamine in reward circuits.", difficulty: "medium" },
    { topicId: topicMap["Psychopathology"], question: "What are the anxiety disorders?", answer: "GAD, panic disorder, social anxiety, specific phobia, agoraphobia, and separation anxiety; all characterized by excessive fear/anxiety and avoidance behavior.", difficulty: "easy" },
    { topicId: topicMap["Psychopathology"], question: "What is the neural circuit of fear?", answer: "Sensory input → amygdala (threat appraisal) → hippocampus (context), hypothalamus (autonomic), prefrontal cortex (regulation); PTSD involves failure of PFC extinction of fear memory.", difficulty: "hard" },

    // ===== PERSONALITY DISORDERS (10 cards) =====
    { topicId: topicMap["Personality Disorders"], question: "What are the three DSM-5 clusters of personality disorders?", answer: "Cluster A (odd/eccentric): paranoid, schizoid, schizotypal. Cluster B (dramatic/emotional): antisocial, borderline, histrionic, narcissistic. Cluster C (anxious/fearful): avoidant, dependent, OCPD.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "What is borderline personality disorder (BPD)?", answer: "Characterized by unstable relationships, self-image, and emotions; impulsivity, fear of abandonment, self-harm, and transient psychotic symptoms.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "What neural abnormalities are associated with BPD?", answer: "Amygdala hyperreactivity, reduced prefrontal regulation of emotion, and abnormalities in the serotonin and HPA systems.", difficulty: "hard" },
    { topicId: topicMap["Personality Disorders"], question: "What is antisocial personality disorder (ASPD)?", answer: "Persistent pattern of disregard for others' rights, deceitfulness, impulsivity, irritability, and lack of remorse; must be ≥18 years with conduct disorder before 15.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "What brain differences are seen in antisocial personality?", answer: "Reduced amygdala and vmPFC volume and activation; reduced fear conditioning; reduced gray matter in frontotemporal regions.", difficulty: "hard" },
    { topicId: topicMap["Personality Disorders"], question: "What is schizotypal personality disorder?", answer: "Odd beliefs, magical thinking, unusual perceptions, eccentric behavior, and social anxiety; genetically related to schizophrenia but less severe.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "What is the difference between a personality disorder and a personality trait?", answer: "Personality traits are inflexible, pervasive, cause significant distress or functional impairment, and have been present since early adulthood to qualify as a personality disorder.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "What treatment is most evidence-based for BPD?", answer: "Dialectical Behavior Therapy (DBT) is the most evidence-based treatment, targeting emotional dysregulation, distress tolerance, and interpersonal effectiveness.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "What is narcissistic personality disorder (NPD)?", answer: "Grandiosity, need for admiration, and lack of empathy; may mask underlying fragile self-esteem; associated with limbic hyperreactivity to threats to self-image.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "What is the role of genetics vs. environment in personality disorders?", answer: "Twin studies show moderate heritability (~40-60%) for personality disorder traits; early trauma and adverse childhood experiences are major environmental risk factors.", difficulty: "medium" },

    // ===== DISSOCIATIVE DISORDERS (10 cards) =====
    { topicId: topicMap["Dissociative Disorders"], question: "What is dissociation?", answer: "A disruption in the normally integrated functions of consciousness, memory, identity, or perception of the environment.", difficulty: "easy" },
    { topicId: topicMap["Dissociative Disorders"], question: "What is dissociative identity disorder (DID)?", answer: "Presence of two or more distinct personality states (alters) that recurrently take control of behavior; associated with severe early trauma.", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "What is depersonalization disorder?", answer: "Persistent or recurrent experiences of feeling detached from one's own mental processes or body (like an outside observer); ego-dystonic and with intact reality testing.", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "What is derealization?", answer: "Experiences of the external world as strange, unreal, or dreamlike; often co-occurs with depersonalization.", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "What is dissociative amnesia?", answer: "Inability to recall important autobiographical information, usually of traumatic nature, too extensive to be ordinary forgetting; may include fugue states.", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "What brain systems are implicated in dissociation?", answer: "Reduced prefrontal cortex activity and increased limbic (amygdala) activity; in depersonalization, hyperactivation of prefrontal emotion-regulation areas inhibiting the amygdala.", difficulty: "hard" },
    { topicId: topicMap["Dissociative Disorders"], question: "What is the relationship between dissociation and trauma?", answer: "Dissociation is thought to be a defense mechanism against overwhelming traumatic experience; high rates of childhood abuse and neglect in DID patients.", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "What is a fugue state?", answer: "Unexpected travel with an inability to recall one's past and confusion about identity; sometimes called dissociative fugue; usually brief and linked to trauma or stress.", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "How do dissociative disorders differ from psychotic disorders?", answer: "In dissociative disorders, reality testing remains intact (the person knows something is wrong); in psychosis, reality testing is impaired.", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "What is the role of serotonin in dissociation?", answer: "Serotonergic dysregulation is implicated; hallucinogens (which act on 5-HT2A receptors) can induce dissociative states; SSRIs can help depersonalization disorder.", difficulty: "hard" },

    // ===== PSYCHOPHARMACOLOGY (12 cards) =====
    { topicId: topicMap["Psychopharmacology"], question: "What are SSRIs and how do they work?", answer: "Selective Serotonin Reuptake Inhibitors block the serotonin transporter (SERT), increasing serotonin in the synapse; first-line for depression and anxiety.", difficulty: "easy" },
    { topicId: topicMap["Psychopharmacology"], question: "What is the difference between typical and atypical antipsychotics?", answer: "Typical (first-generation): primarily D2 receptor antagonists, higher EPS risk. Atypical (second-generation): block D2 and 5-HT2A receptors, lower EPS risk but metabolic side effects.", difficulty: "medium" },
    { topicId: topicMap["Psychopharmacology"], question: "What is tardive dyskinesia?", answer: "A late-onset movement disorder (repetitive, involuntary movements of face/limbs) caused by long-term antipsychotic use and dopamine receptor upregulation.", difficulty: "hard" },
    { topicId: topicMap["Psychopharmacology"], question: "What are benzodiazepines and their mechanism?", answer: "Positive allosteric modulators of GABA-A receptors; enhance chloride influx, reducing neuronal excitability; used for anxiety, insomnia, and seizures.", difficulty: "medium" },
    { topicId: topicMap["Psychopharmacology"], question: "How do lithium's mood-stabilizing effects work?", answer: "Not fully understood; inhibits inositol monophosphatase and GSK-3β, affecting second messenger systems; requires serum monitoring due to narrow therapeutic index.", difficulty: "hard" },
    { topicId: topicMap["Psychopharmacology"], question: "What is the mechanism of tricyclic antidepressants (TCAs)?", answer: "Inhibit reuptake of both serotonin and norepinephrine; also block muscarinic, histaminergic, and alpha-adrenergic receptors causing significant side effects.", difficulty: "medium" },
    { topicId: topicMap["Psychopharmacology"], question: "What is the mechanism of action of MAOIs?", answer: "Monoamine oxidase inhibitors prevent degradation of monoamines (serotonin, norepinephrine, dopamine, tyramine); risk of hypertensive crisis with tyramine-containing foods.", difficulty: "medium" },
    { topicId: topicMap["Psychopharmacology"], question: "What is extrapyramidal syndrome (EPS)?", answer: "Neurological side effects from D2 blockade in the basal ganglia: akathisia (restlessness), acute dystonia, Parkinsonism, and tardive dyskinesia.", difficulty: "medium" },
    { topicId: topicMap["Psychopharmacology"], question: "What is the role of glutamate in psychiatric pharmacology?", answer: "NMDA receptor antagonists (ketamine) produce rapid antidepressant effects; AMPA receptor potentiators are being studied; glutamate dysregulation is implicated in schizophrenia.", difficulty: "hard" },
    { topicId: topicMap["Psychopharmacology"], question: "What is the pharmacological treatment of ADHD?", answer: "Stimulants (methylphenidate, amphetamines) increase prefrontal dopamine and norepinephrine; non-stimulants (atomoxetine, guanfacine) are alternatives.", difficulty: "medium" },
    { topicId: topicMap["Psychopharmacology"], question: "What is neuroleptic malignant syndrome (NMS)?", answer: "A life-threatening reaction to antipsychotics: hyperthermia, muscle rigidity, autonomic instability, and altered consciousness; treated by stopping the drug and dantrolene.", difficulty: "hard" },
    { topicId: topicMap["Psychopharmacology"], question: "What is serotonin syndrome?", answer: "Excess serotonergic activity (from combining serotonergic drugs): agitation, hyperthermia, clonus, diarrhea, and potentially death; different from NMS (rigidity vs. clonus).", difficulty: "hard" },

    // ===== COPING & DEFENSE MECHANISMS (10 cards) =====
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "What are defense mechanisms?", answer: "Unconscious psychological strategies used to protect the ego from anxiety, conflict, or threatening impulses; classified by maturity level.", difficulty: "easy" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "What are mature defense mechanisms?", answer: "Sublimation (channeling into constructive activity), humor, altruism, suppression (conscious delay of addressing conflict), and anticipation.", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "What is repression?", answer: "The unconscious exclusion of distressing thoughts, memories, or feelings from conscious awareness; a foundational psychoanalytic concept.", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "What is projection?", answer: "Attributing one's own unacceptable thoughts, feelings, or impulses to another person (e.g., an angry person accusing others of being hostile).", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "What is reaction formation?", answer: "Behaving in a manner opposite to one's unacceptable feelings or impulses (e.g., being excessively kind to someone you dislike).", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "What is splitting in borderline personality disorder?", answer: "A primitive defense mechanism viewing people as all good or all bad, unable to integrate positive and negative aspects; associated with BPD.", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "What is the difference between problem-focused and emotion-focused coping?", answer: "Problem-focused: directly addressing the stressor. Emotion-focused: managing emotional response to stressor; both can be adaptive depending on the situation.", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "What is rationalization?", answer: "Generating logical-sounding justifications for behaviors actually motivated by unacceptable impulses or feelings.", difficulty: "easy" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "What is intellectualization?", answer: "Avoiding emotional engagement with a problem by focusing on abstract, intellectual analysis; similar to rationalization but emphasizes thinking over feeling.", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "What is displacement?", answer: "Redirecting emotions from an unacceptable target to a safer substitute (e.g., yelling at a family member after a bad day at work).", difficulty: "easy" },
  ];

  await db.insert(flashcardsTable).values(flashcards);
  console.log(`Inserted ${flashcards.length} flashcards`);

  // ---------------------------------------------------------------------------
  // QUIZ QUESTIONS — 10+ per topic
  // ---------------------------------------------------------------------------
  const quizQuestions = [
    // ===== NEUROPSYCHOLOGY OVERVIEW =====
    { topicId: topicMap["Neuropsychology Overview"], question: "Which of the following best defines neuropsychology?", options: JSON.stringify(["A) The study of how neurons communicate with each other", "B) The scientific study of brain-behavior relationships", "C) The pharmacological treatment of brain disorders", "D) The surgical treatment of neurological conditions"]), correctAnswer: "B", explanation: "Neuropsychology is the scientific study of the relationship between brain structure and function on one hand, and behavior and cognition on the other. It combines neuroscience and psychology.", difficulty: "easy" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What is diaschisis?", options: JSON.stringify(["A) A type of memory loss after stroke", "B) Functional loss in brain regions distant from but connected to the injury site", "C) Compensatory growth of new neurons after injury", "D) The direct damage caused by a lesion"]), correctAnswer: "B", explanation: "Diaschisis refers to the temporary loss of function in brain areas that are remote from but connected to an injured area, due to the disruption of connections. These areas are structurally intact.", difficulty: "hard" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What does the MMSE primarily assess?", options: JSON.stringify(["A) Motor speed and coordination", "B) Global cognitive function for screening purposes", "C) Specific memory recall of autobiographical events", "D) Intelligence quotient (IQ)"]), correctAnswer: "B", explanation: "The Mini-Mental State Examination (MMSE) is a brief 30-point screening tool for cognitive impairment covering orientation, registration, attention/calculation, recall, and language.", difficulty: "easy" },
    { topicId: topicMap["Neuropsychology Overview"], question: "Language is predominantly lateralized to which hemisphere?", options: JSON.stringify(["A) Right hemisphere in most people", "B) Left hemisphere in most right-handed people", "C) Equally distributed in both hemispheres", "D) Frontal lobes only"]), correctAnswer: "B", explanation: "Language is left-lateralized in approximately 95% of right-handed individuals and 70% of left-handed individuals.", difficulty: "easy" },
    { topicId: topicMap["Neuropsychology Overview"], question: "A patient can recall events from before their accident but cannot form new memories. This is called:", options: JSON.stringify(["A) Retrograde amnesia only", "B) Anterograde amnesia only", "C) Anterograde amnesia only, affecting new memory formation", "D) Confabulation"]), correctAnswer: "C", explanation: "Anterograde amnesia refers to the inability to form new memories after the causative event. The patient's ability to recall pre-injury memories distinguishes this from retrograde amnesia.", difficulty: "medium" },
    { topicId: topicMap["Neuropsychology Overview"], question: "A double dissociation between two functions would demonstrate:", options: JSON.stringify(["A) That one function depends on the other", "B) That both functions share the same neural substrate", "C) That the two functions are neurally independent", "D) That both functions are impaired by any lesion"]), correctAnswer: "C", explanation: "A double dissociation (lesion A impairs X not Y; lesion B impairs Y not X) demonstrates that the two cognitive functions are neurally independent of each other.", difficulty: "hard" },
    { topicId: topicMap["Neuropsychology Overview"], question: "Which neuropsychological battery uses a fixed battery approach assessing multiple functions?", options: JSON.stringify(["A) Stroop Color-Word Test", "B) Halstead-Reitan Neuropsychological Battery", "C) Rey Auditory Verbal Learning Test", "D) Beck Depression Inventory"]), correctAnswer: "B", explanation: "The Halstead-Reitan Battery uses a fixed-battery approach with multiple tests measuring various cognitive and sensorimotor functions to detect brain damage.", difficulty: "medium" },
    { topicId: topicMap["Neuropsychology Overview"], question: "Ecological validity in neuropsychological assessment refers to:", options: JSON.stringify(["A) Testing in a natural forest setting", "B) Using environmentally safe materials", "C) The degree to which test results predict real-world functioning", "D) Conducting assessments in hospitals"]), correctAnswer: "C", explanation: "Ecological validity refers to the extent to which neuropsychological test performance generalizes to and predicts functioning in the patient's everyday real-world environment.", difficulty: "medium" },
    { topicId: topicMap["Neuropsychology Overview"], question: "Equipotentiality, as proposed by Lashley, suggests that:", options: JSON.stringify(["A) All neurons are equally capable of firing", "B) Any cortical area can substitute for another in learning", "C) The hemispheres have equal cognitive ability", "D) Brain lesions cause equal damage regardless of location"]), correctAnswer: "B", explanation: "Lashley's equipotentiality proposed that any portion of cortical tissue can substitute for another in certain learning functions, contrasting with strict localization of function.", difficulty: "hard" },
    { topicId: topicMap["Neuropsychology Overview"], question: "Which cognitive domain involves monitoring one's own performance and using feedback to improve?", options: JSON.stringify(["A) Episodic memory", "B) Executive function", "C) Visuospatial ability", "D) Language fluency"]), correctAnswer: "B", explanation: "Executive functions include planning, monitoring, updating, and regulating cognitive processes — all mediated primarily by the prefrontal cortex.", difficulty: "medium" },

    // ===== CELL BIOLOGY & NEURON ANATOMY =====
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What is the resting membrane potential of a typical neuron?", options: JSON.stringify(["A) +70 mV", "B) 0 mV", "C) -70 mV", "D) -20 mV"]), correctAnswer: "C", explanation: "The resting membrane potential is approximately -70 mV, maintained by Na+/K+ ATPase pumps and the differential permeability of the membrane to K+ and Na+.", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "Which glial cells produce myelin in the CNS?", options: JSON.stringify(["A) Schwann cells", "B) Astrocytes", "C) Microglia", "D) Oligodendrocytes"]), correctAnswer: "D", explanation: "Oligodendrocytes produce myelin in the CNS (central nervous system). Schwann cells produce myelin in the PNS (peripheral nervous system).", difficulty: "easy" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "Long-term potentiation (LTP) is dependent on activation of which receptor?", options: JSON.stringify(["A) AMPA receptors", "B) NMDA receptors", "C) GABA-A receptors", "D) Metabotropic glutamate receptors"]), correctAnswer: "B", explanation: "LTP requires NMDA receptor activation, which is both ligand-gated (glutamate) and voltage-gated (requires depolarization to remove Mg2+ block); this coincidence detection underlies synaptic strengthening.", difficulty: "hard" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "Which ion primarily flows IN to cause depolarization during an action potential?", options: JSON.stringify(["A) Potassium (K+)", "B) Chloride (Cl-)", "C) Sodium (Na+)", "D) Calcium (Ca2+)"]), correctAnswer: "C", explanation: "During the rising phase of an action potential, voltage-gated Na+ channels open and Na+ rushes into the cell, causing rapid depolarization to approximately +40 mV.", difficulty: "easy" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What triggers neurotransmitter release from presynaptic terminals?", options: JSON.stringify(["A) Ligand binding at the presynaptic membrane", "B) Calcium influx through voltage-gated Ca2+ channels", "C) Sodium influx through NMDA receptors", "D) Potassium efflux during repolarization"]), correctAnswer: "B", explanation: "When an action potential reaches the presynaptic terminal, voltage-gated Ca2+ channels open, Ca2+ influx triggers synaptic vesicle fusion with the membrane and neurotransmitter exocytosis.", difficulty: "hard" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What is saltatory conduction?", options: JSON.stringify(["A) Slow conduction through unmyelinated axons", "B) Conduction of action potentials jumping between Nodes of Ranvier in myelinated axons", "C) Electrical signaling through gap junctions", "D) Retrograde axonal transport"]), correctAnswer: "B", explanation: "Saltatory conduction occurs in myelinated axons where the action potential 'jumps' from one Node of Ranvier to the next, greatly increasing conduction velocity.", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "Microglia are best described as:", options: JSON.stringify(["A) CNS myelin-producing cells", "B) The immune cells of the CNS", "C) Metabolic support cells for neurons", "D) Blood-brain barrier components"]), correctAnswer: "B", explanation: "Microglia are the resident immune cells of the CNS that survey for pathogens, phagocytose debris, and become activated during neuroinflammation.", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "An inhibitory postsynaptic potential (IPSP) makes the cell:", options: JSON.stringify(["A) More likely to fire an action potential", "B) More negative (hyperpolarized), less likely to fire", "C) Exactly at threshold", "D) Temporarily unable to respond to any input"]), correctAnswer: "B", explanation: "IPSPs hyperpolarize the postsynaptic membrane (making it more negative), moving it further from threshold and reducing the likelihood of generating an action potential.", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "The absolute refractory period after an action potential is due to:", options: JSON.stringify(["A) Maximal K+ efflux", "B) Na+ channel inactivation, preventing any new action potential", "C) The Na+/K+ pump restoring the resting potential", "D) Depletion of neurotransmitter vesicles"]), correctAnswer: "B", explanation: "During the absolute refractory period, Na+ channels are inactivated (closed and unresponsive to stimulation), making it impossible to generate another action potential regardless of stimulus strength.", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "Astrocytes contribute to the blood-brain barrier by:", options: JSON.stringify(["A) Producing myelin around cerebral blood vessels", "B) Their endfeet surrounding capillaries and regulating transport", "C) Phagocytosing pathogens entering the CNS", "D) Secreting antibodies into the CSF"]), correctAnswer: "B", explanation: "Astrocyte endfeet surround brain capillaries, contributing to the blood-brain barrier by regulating what substances cross into the brain parenchyma.", difficulty: "medium" },

    // ===== SPINAL CORD & PNS =====
    { topicId: topicMap["Spinal Cord & PNS"], question: "Upper motor neuron (UMN) lesions are characterized by:", options: JSON.stringify(["A) Flaccid paralysis, areflexia, and muscle atrophy", "B) Spasticity, hyperreflexia, and Babinski sign", "C) Fasciculations and hypotonia", "D) Loss of pain and temperature only"]), correctAnswer: "B", explanation: "UMN lesions (above the anterior horn) cause spasticity, hyperreflexia, positive Babinski sign, and minimal muscle atrophy, due to loss of cortical inhibition of spinal circuits.", difficulty: "hard" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "Brown-Séquard syndrome involves hemisection of the spinal cord. Which finding is expected IPSILATERAL to the lesion?", options: JSON.stringify(["A) Loss of pain and temperature sensation", "B) Loss of motor function and proprioception", "C) Loss of all sensation", "D) Intact motor function"]), correctAnswer: "B", explanation: "In Brown-Séquard syndrome, ipsilateral to the lesion: loss of motor function (corticospinal tract) and proprioception/fine touch (dorsal columns). Pain/temperature loss is contralateral (spinothalamic tract crosses near entry).", difficulty: "hard" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "A dermatome is defined as:", options: JSON.stringify(["A) A muscle group innervated by a single motor nerve", "B) A region of skin innervated by a single spinal nerve root", "C) The area of skin over the spinal cord", "D) A reflex arc involving a specific spinal segment"]), correctAnswer: "B", explanation: "A dermatome is an area of skin supplied with sensory fibers from a single dorsal root (spinal nerve root). Dermatome mapping helps localize spinal lesions.", difficulty: "easy" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "The Bell-Magendie law states:", options: JSON.stringify(["A) Dorsal roots are motor, ventral roots are sensory", "B) Dorsal roots are sensory (afferent), ventral roots are motor (efferent)", "C) Both dorsal and ventral roots are mixed", "D) The spinal cord contains only sensory neurons"]), correctAnswer: "B", explanation: "The Bell-Magendie law establishes that dorsal roots carry sensory (afferent) information into the spinal cord, while ventral roots carry motor (efferent) information out.", difficulty: "medium" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "Horner's syndrome includes which triad of findings?", options: JSON.stringify(["A) Ptosis, mydriasis, and anhidrosis", "B) Ptosis, miosis, and anhidrosis", "C) Ptosis, exophthalmos, and miosis", "D) Ophthalmoplegia, miosis, and proptosis"]), correctAnswer: "B", explanation: "Horner's syndrome (sympathetic chain lesion) causes: ptosis (drooping eyelid), miosis (constricted pupil), and anhidrosis (reduced sweating) on the affected side.", difficulty: "hard" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "The cauda equina consists of:", options: JSON.stringify(["A) Lower brainstem nerve roots", "B) Spinal nerve roots below the conus medullaris", "C) The sacral plexus only", "D) Autonomic fibers only"]), correctAnswer: "B", explanation: "The cauda equina ('horse's tail') consists of spinal nerve roots below the conus medullaris (L1-L2 level), descending to their exit foramina. Damage causes LMN signs.", difficulty: "medium" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "Which cranial nerves are PURELY sensory?", options: JSON.stringify(["A) CN III, IV, VI", "B) CN I, II, VIII", "C) CN VII, IX, X", "D) CN V, VII, IX"]), correctAnswer: "B", explanation: "CN I (olfactory), CN II (optic), and CN VIII (vestibulocochlear) are the purely sensory cranial nerves.", difficulty: "medium" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "A stretch reflex is:", options: JSON.stringify(["A) A polysynaptic reflex involving multiple interneurons", "B) A monosynaptic reflex: muscle stretch → Ia afferent → alpha motor neuron → contraction", "C) A reflex that crosses the midline", "D) An autonomic reflex"]), correctAnswer: "B", explanation: "The stretch reflex is monosynaptic: Ia afferents from muscle spindles synapse directly on alpha motor neurons, causing contraction of the same muscle. E.g., knee-jerk reflex (L3-L4).", difficulty: "medium" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "The sympathetic nervous system has its preganglionic neurons in:", options: JSON.stringify(["A) Cranial nerve nuclei only", "B) The thoracolumbar spinal cord (T1-L2)", "C) The sacral spinal cord (S2-S4)", "D) The entire spinal cord"]), correctAnswer: "B", explanation: "Sympathetic preganglionic neurons originate in the intermediolateral cell column of the thoracolumbar spinal cord (T1-L2), hence the 'fight-or-flight' system is also called the thoracolumbar division.", difficulty: "medium" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "A patient presents with wrist drop. Which nerve is most likely damaged?", options: JSON.stringify(["A) Median nerve", "B) Ulnar nerve", "C) Radial nerve", "D) Musculocutaneous nerve"]), correctAnswer: "C", explanation: "Wrist drop (inability to extend the wrist) results from radial nerve damage, which innervates the wrist and finger extensors. Common with humeral shaft fractures or Saturday night palsy.", difficulty: "medium" },

    // ===== CEREBELLUM =====
    { topicId: topicMap["Cerebellum"], question: "The primary output neuron of the cerebellar cortex is the:", options: JSON.stringify(["A) Granule cell", "B) Basket cell", "C) Purkinje cell", "D) Stellate cell"]), correctAnswer: "C", explanation: "Purkinje cells are the principal output neurons of the cerebellar cortex; they send GABAergic (inhibitory) projections to the deep cerebellar nuclei.", difficulty: "medium" },
    { topicId: topicMap["Cerebellum"], question: "Which cerebellar sign is characterized by inability to perform rapid alternating movements?", options: JSON.stringify(["A) Dysmetria", "B) Dysdiadochokinesia", "C) Ataxia", "D) Nystagmus"]), correctAnswer: "B", explanation: "Dysdiadochokinesia is the inability to perform rapid alternating movements (e.g., pronation/supination of the hand), tested clinically as a sign of cerebellar dysfunction.", difficulty: "medium" },
    { topicId: topicMap["Cerebellum"], question: "Cerebellar lesions cause motor deficits on which side of the body?", options: JSON.stringify(["A) Contralateral side always", "B) Ipsilateral side (same side as lesion)", "C) Bilateral deficits", "D) Depends on the type of lesion"]), correctAnswer: "B", explanation: "Cerebellar lesions cause ipsilateral deficits because: cerebellar output crosses to contralateral thalamus/cortex, which then sends corticospinal fibers back across the midline — net effect is ipsilateral.", difficulty: "hard" },
    { topicId: topicMap["Cerebellum"], question: "The cerebellar zone responsible for maintaining balance and eye movements is the:", options: JSON.stringify(["A) Spinocerebellum", "B) Cerebrocerebellum (neocerebellum)", "C) Vestibulocerebellum (flocculonodular lobe)", "D) Intermediate zone"]), correctAnswer: "C", explanation: "The vestibulocerebellum (flocculonodular lobe) receives input from vestibular nuclei and is responsible for balance (equilibrium) and coordinating eye movements.", difficulty: "hard" },
    { topicId: topicMap["Cerebellum"], question: "Climbing fibers, which synapse directly onto Purkinje cells, originate from:", options: JSON.stringify(["A) The dentate nucleus", "B) The inferior olivary nucleus", "C) The pontine nuclei", "D) The spinal cord"]), correctAnswer: "B", explanation: "Climbing fibers originate from the inferior olivary nucleus in the medulla; they synapse powerfully on Purkinje cells and are thought to signal motor errors, driving cerebellar learning.", difficulty: "hard" },
    { topicId: topicMap["Cerebellum"], question: "Alcoholic cerebellar degeneration primarily affects which part of the cerebellum?", options: JSON.stringify(["A) Flocculonodular lobe only", "B) Lateral hemispheres", "C) Anterior/superior vermis", "D) Deep cerebellar nuclei only"]), correctAnswer: "C", explanation: "Alcoholic cerebellar degeneration preferentially damages the anterior/superior vermis, causing primarily gait ataxia with relative sparing of upper limb coordination.", difficulty: "medium" },
    { topicId: topicMap["Cerebellum"], question: "What clinical sign would you expect from a lesion in the cerebellar vermis?", options: JSON.stringify(["A) Limb dysmetria and tremor on one side", "B) Truncal ataxia and wide-based gait", "C) Scanning speech and nystagmus only", "D) Pure visual disturbance"]), correctAnswer: "B", explanation: "The vermis controls axial/midline muscles and balance. Vermis lesions cause truncal ataxia, wide-based gait instability, and head titubation — not primarily limb dysmetria.", difficulty: "medium" },
    { topicId: topicMap["Cerebellum"], question: "The largest deep cerebellar nucleus is the:", options: JSON.stringify(["A) Fastigial nucleus", "B) Globose nucleus", "C) Dentate nucleus", "D) Emboliform nucleus"]), correctAnswer: "C", explanation: "The dentate nucleus is the largest deep cerebellar nucleus and the primary output of the lateral (cerebrocerebellum) hemisphere, projecting to the contralateral thalamus via the superior cerebellar peduncle.", difficulty: "hard" },
    { topicId: topicMap["Cerebellum"], question: "Intention tremor (tremor that worsens as the limb approaches a target) is characteristic of:", options: JSON.stringify(["A) Parkinson's disease (resting tremor)", "B) Essential tremor (action tremor)", "C) Cerebellar dysfunction", "D) Basal ganglia disease"]), correctAnswer: "C", explanation: "Intention tremor that worsens on approach to the target is a hallmark of cerebellar dysfunction, unlike resting tremor (Parkinson's) or action tremor (essential tremor).", difficulty: "medium" },
    { topicId: topicMap["Cerebellum"], question: "Which of the following is NOT a typical sign of cerebellar damage?", options: JSON.stringify(["A) Dysmetria", "B) Ataxic gait", "C) Spasticity and hyperreflexia", "D) Nystagmus"]), correctAnswer: "C", explanation: "Spasticity and hyperreflexia are UMN (upper motor neuron) signs, not cerebellar signs. Cerebellar damage causes hypotonia and hyporeflexia, along with ataxia, dysmetria, and nystagmus.", difficulty: "medium" },

    // ===== BASAL GANGLIA =====
    { topicId: topicMap["Basal Ganglia"], question: "Parkinson's disease is caused by degeneration of dopaminergic neurons in the:", options: JSON.stringify(["A) Caudate nucleus", "B) Substantia nigra pars compacta", "C) Putamen", "D) Globus pallidus interna"]), correctAnswer: "B", explanation: "Parkinson's disease involves the degeneration of dopaminergic neurons in the substantia nigra pars compacta (SNpc), reducing dopamine in the nigrostriatal pathway.", difficulty: "easy" },
    { topicId: topicMap["Basal Ganglia"], question: "Which movement disorder is caused by a subthalamic nucleus lesion?", options: JSON.stringify(["A) Huntington's chorea", "B) Parkinson's resting tremor", "C) Hemiballismus", "D) Dystonia"]), correctAnswer: "C", explanation: "Lesions of the subthalamic nucleus (STN) cause hemiballismus — violent, flinging, involuntary movements of the proximal limb on the contralateral side.", difficulty: "hard" },
    { topicId: topicMap["Basal Ganglia"], question: "In the direct pathway of the basal ganglia, the net effect on movement is:", options: JSON.stringify(["A) Inhibition of movement", "B) Facilitation of movement", "C) No effect on movement", "D) Increased tremor"]), correctAnswer: "B", explanation: "The direct pathway (Striatum D1 → GPi inhibition → thalamus disinhibited → cortex) has a net facilitatory effect on movement by releasing the thalamus from inhibition.", difficulty: "hard" },
    { topicId: topicMap["Basal Ganglia"], question: "The earliest cognitive symptom in Huntington's disease is typically:", options: JSON.stringify(["A) Anterograde amnesia", "B) Executive function deficits", "C) Language impairment", "D) Visual agnosia"]), correctAnswer: "B", explanation: "Huntington's disease causes early subcortical dementia with prominent executive function deficits (planning, working memory, cognitive flexibility) before frank memory loss.", difficulty: "medium" },
    { topicId: topicMap["Basal Ganglia"], question: "Levodopa (L-DOPA) is used in Parkinson's disease because it:", options: JSON.stringify(["A) Blocks dopamine receptors directly", "B) Crosses the blood-brain barrier and is converted to dopamine", "C) Prevents further neurodegeneration", "D) Stimulates norepinephrine production"]), correctAnswer: "B", explanation: "Levodopa crosses the blood-brain barrier (unlike dopamine) and is converted to dopamine by DOPA decarboxylase in remaining nigrostriatal neurons and glia.", difficulty: "medium" },
    { topicId: topicMap["Basal Ganglia"], question: "Dopamine D1 receptors in the striatum are coupled to which intracellular pathway?", options: JSON.stringify(["A) Gi — inhibits adenylyl cyclase", "B) Gq — activates phospholipase C", "C) Gs — activates adenylyl cyclase, increases cAMP", "D) G-independent ion channel"]), correctAnswer: "C", explanation: "D1 receptors couple to Gs proteins which stimulate adenylyl cyclase, increasing cAMP. This is excitatory in the striatum, activating the direct pathway.", difficulty: "hard" },
    { topicId: topicMap["Basal Ganglia"], question: "Wilson's disease affects which basal ganglia structure most prominently?", options: JSON.stringify(["A) Caudate nucleus", "B) Putamen", "C) Globus pallidus", "D) Subthalamic nucleus"]), correctAnswer: "B", explanation: "In Wilson's disease (copper accumulation from ATP7B mutation), the putamen is typically the most prominently affected basal ganglia structure, showing 'eye of the tiger' signal on MRI.", difficulty: "hard" },
    { topicId: topicMap["Basal Ganglia"], question: "The TRAP acronym for Parkinson's disease stands for:", options: JSON.stringify(["A) Tremor, Rigidity, Ataxia, Posture", "B) Tremor at rest, Rigidity, Akinesia/Bradykinesia, Postural instability", "C) Tremor, Reflex loss, Atrophy, Posture loss", "D) Tremor, Rigidity, Apraxia, Pain"]), correctAnswer: "B", explanation: "The cardinal features of Parkinson's disease are: Tremor at rest (pill-rolling), Rigidity (cogwheel), Akinesia/Bradykinesia (slow, reduced movement), Postural instability.", difficulty: "easy" },
    { topicId: topicMap["Basal Ganglia"], question: "Chorea, as seen in Huntington's disease, is caused by:", options: JSON.stringify(["A) Excess dopamine in mesolimbic pathway", "B) Preferential loss of indirect pathway neurons in the striatum", "C) Loss of dopamine in nigrostriatal pathway", "D) Subthalamic nucleus hyperactivity"]), correctAnswer: "B", explanation: "Loss of striatal indirect pathway neurons (D2-expressing, inhibiting GPe) reduces GPi inhibitory output → thalamus over-activated → hyperkinetic (choreiform) movements.", difficulty: "hard" },
    { topicId: topicMap["Basal Ganglia"], question: "Which of the following is a hyperkinetic movement disorder?", options: JSON.stringify(["A) Parkinson's disease", "B) Progressive supranuclear palsy", "C) Huntington's disease", "D) Parkinson-plus syndrome"]), correctAnswer: "C", explanation: "Huntington's disease is a hyperkinetic disorder (characterized by chorea — excessive, involuntary movements). Parkinson's disease is hypokinetic (reduced movement).", difficulty: "easy" },

    // ===== BRAINSTEM & DIENCEPHALON =====
    { topicId: topicMap["Brainstem & Diencephalon"], question: "Which brainstem structure is the primary source of norepinephrine in the CNS?", options: JSON.stringify(["A) Raphe nuclei", "B) Locus coeruleus", "C) Ventral tegmental area", "D) Substantia nigra"]), correctAnswer: "B", explanation: "The locus coeruleus, a pontine nucleus, is the primary source of norepinephrine in the CNS. It projects widely and is involved in arousal, attention, and the stress response.", difficulty: "hard" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "Weber's syndrome is caused by a lesion in the:", options: JSON.stringify(["A) Lateral medulla", "B) Pons", "C) Midbrain", "D) Thalamus"]), correctAnswer: "C", explanation: "Weber's syndrome (midbrain stroke) causes ipsilateral CN III palsy and contralateral hemiplegia from involvement of the CN III nucleus/fascicles and adjacent corticospinal fibers.", difficulty: "hard" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "Wallenberg's syndrome (lateral medullary syndrome) is most commonly caused by occlusion of:", options: JSON.stringify(["A) Anterior inferior cerebellar artery", "B) Middle cerebral artery", "C) Posterior inferior cerebellar artery (PICA)", "D) Anterior spinal artery"]), correctAnswer: "C", explanation: "Wallenberg's syndrome typically results from PICA occlusion (or vertebral artery), affecting the lateral medulla: ipsilateral facial numbness, Horner's syndrome, ataxia; contralateral limb pain/temperature loss.", difficulty: "hard" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What is the primary role of the thalamus?", options: JSON.stringify(["A) Generate motor commands for voluntary movement", "B) Serve as a relay station for sensory/motor information to the cortex", "C) Control autonomic functions", "D) Store long-term memories"]), correctAnswer: "B", explanation: "The thalamus serves as the principal relay station for nearly all sensory (except olfactory) and motor information traveling to and from the cerebral cortex.", difficulty: "medium" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "The ventral tegmental area (VTA) is the origin of which dopamine pathways?", options: JSON.stringify(["A) Nigrostriatal pathway", "B) Mesolimbic and mesocortical pathways", "C) Tuberoinfundibular pathway", "D) Hypothalamo-pituitary pathway"]), correctAnswer: "B", explanation: "The VTA gives rise to the mesolimbic pathway (to nucleus accumbens — reward/motivation) and the mesocortical pathway (to PFC — cognition, working memory).", difficulty: "hard" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "The hypothalamus connects to the pituitary gland via the:", options: JSON.stringify(["A) Fornix", "B) Corpus callosum", "C) Hypophyseal portal system and infundibulum", "D) Medial forebrain bundle"]), correctAnswer: "C", explanation: "The hypothalamus controls the anterior pituitary via the hypophyseal portal blood system (releasing/inhibiting hormones), and the posterior pituitary directly via the infundibular stalk (axons).", difficulty: "medium" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "Cranial nerve VII (facial nerve) exits from which brainstem level?", options: JSON.stringify(["A) Midbrain", "B) Medulla", "C) Pons", "D) Diencephalon"]), correctAnswer: "C", explanation: "CN VII (facial nerve) originates in the pons. Its nucleus and course through the pons also explains the 'facial colliculus' visible on the dorsal pons floor.", difficulty: "medium" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "The reticular activating system (RAS) plays a critical role in:", options: JSON.stringify(["A) Voluntary motor planning", "B) Arousal, consciousness, and sleep-wake cycle regulation", "C) Visual processing", "D) Cerebellar coordination"]), correctAnswer: "B", explanation: "The RAS is a network of brainstem nuclei (reticular formation) that projects to the thalamus and cortex via cholinergic and monoaminergic systems to regulate arousal and consciousness.", difficulty: "medium" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "The pineal gland secretes which hormone in response to darkness?", options: JSON.stringify(["A) Cortisol", "B) Serotonin", "C) Melatonin", "D) Oxytocin"]), correctAnswer: "C", explanation: "The pineal gland secretes melatonin in response to darkness (via the SCN-retinohypothalamic-pineal pathway), regulating circadian rhythms and sleep.", difficulty: "easy" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "Decorticate posturing (upper limb flexion, lower limb extension) indicates a lesion at:", options: JSON.stringify(["A) Below the red nucleus (midbrain)", "B) At or above the level of the red nucleus", "C) In the cerebellum", "D) In the basal ganglia"]), correctAnswer: "B", explanation: "Decorticate posturing reflects an intact red nucleus but lost cortical input — occurs with lesions at or above midbrain. Decerebrate (all extension) occurs with lesions below the red nucleus.", difficulty: "hard" },

    // ===== LIMBIC SYSTEM =====
    { topicId: topicMap["Limbic System"], question: "H.M. (Henry Molaison), who had bilateral hippocampal resection, famously lost the ability to:", options: JSON.stringify(["A) Remember his childhood", "B) Learn new facts and events (anterograde amnesia)", "C) Speak and understand language", "D) Recognize faces"]), correctAnswer: "B", explanation: "H.M. developed severe anterograde amnesia after bilateral hippocampal removal; he could not form new explicit (declarative) memories while retaining implicit learning and remote memories.", difficulty: "medium" },
    { topicId: topicMap["Limbic System"], question: "The amygdala is primarily involved in:", options: JSON.stringify(["A) Spatial navigation", "B) Motor coordination", "C) Emotional processing, especially fear", "D) Language production"]), correctAnswer: "C", explanation: "The amygdala processes emotional memories and responses, especially fear and threat detection. It is critical for conditioned fear learning and emotional memory consolidation.", difficulty: "easy" },
    { topicId: topicMap["Limbic System"], question: "Korsakoff syndrome is caused by deficiency of:", options: JSON.stringify(["A) Vitamin B12", "B) Vitamin B1 (thiamine)", "C) Folate", "D) Niacin"]), correctAnswer: "B", explanation: "Korsakoff syndrome results from thiamine (B1) deficiency (often from alcoholism), causing damage to mammillary bodies and dorsomedial thalamus, leading to anterograde amnesia and confabulation.", difficulty: "hard" },
    { topicId: topicMap["Limbic System"], question: "The Papez circuit includes all of the following EXCEPT:", options: JSON.stringify(["A) Hippocampus", "B) Mammillary bodies", "C) Substantia nigra", "D) Anterior thalamus"]), correctAnswer: "C", explanation: "The Papez circuit for emotion and memory includes: hippocampus → fornix → mammillary bodies → anterior thalamus → cingulate gyrus → entorhinal cortex → hippocampus. The substantia nigra is not part of this circuit.", difficulty: "hard" },
    { topicId: topicMap["Limbic System"], question: "Klüver-Bucy syndrome results from:", options: JSON.stringify(["A) Unilateral prefrontal lesion", "B) Bilateral amygdala damage", "C) Hippocampal bilateral lesion", "D) Thalamic infarct"]), correctAnswer: "B", explanation: "Klüver-Bucy syndrome follows bilateral amygdala damage, causing hyperphagia, hypersexuality, visual agnosia, extreme docility, and oral exploration of objects.", difficulty: "hard" },
    { topicId: topicMap["Limbic System"], question: "The main white matter tract of the Papez circuit connecting hippocampus to mammillary bodies is the:", options: JSON.stringify(["A) Cingulum", "B) Fornix", "C) Uncinate fasciculus", "D) Arcuate fasciculus"]), correctAnswer: "B", explanation: "The fornix is the primary output tract of the hippocampus, connecting it to the mammillary bodies (and septal nuclei) as a key component of the Papez circuit.", difficulty: "medium" },
    { topicId: topicMap["Limbic System"], question: "Declarative memory (facts and events) is dependent on the:", options: JSON.stringify(["A) Basal ganglia", "B) Cerebellum", "C) Hippocampus and related structures", "D) Primary motor cortex"]), correctAnswer: "C", explanation: "Declarative (explicit) memory for facts (semantic) and personal experiences (episodic) depends on the hippocampus, entorhinal cortex, and parahippocampal gyrus.", difficulty: "medium" },
    { topicId: topicMap["Limbic System"], question: "The anterior cingulate cortex (ACC) is primarily associated with:", options: JSON.stringify(["A) Primary somatosensory processing", "B) Error monitoring, conflict detection, and emotional regulation", "C) Visual object recognition", "D) Auditory processing"]), correctAnswer: "B", explanation: "The ACC is involved in error monitoring, cognitive conflict detection, attentional control, and emotional regulation, bridging cognitive and affective processing.", difficulty: "medium" },
    { topicId: topicMap["Limbic System"], question: "Implicit memory (procedural skills, conditioning) is primarily dependent on:", options: JSON.stringify(["A) Hippocampus", "B) Amygdala only", "C) Basal ganglia, cerebellum, and amygdala (depending on type)", "D) Thalamus"]), correctAnswer: "C", explanation: "Implicit memory is hippocampus-independent: procedural/motor skills rely on basal ganglia and cerebellum; classical conditioning relies on the cerebellum (somatic) and amygdala (emotional).", difficulty: "hard" },
    { topicId: topicMap["Limbic System"], question: "Hippocampal neurogenesis in adults occurs primarily in the:", options: JSON.stringify(["A) CA1 region", "B) CA3 region", "C) Dentate gyrus", "D) Subiculum"]), correctAnswer: "C", explanation: "Adult hippocampal neurogenesis occurs in the subgranular zone of the dentate gyrus; new neurons integrate into the dentate-CA3 circuit and are thought to contribute to pattern separation and memory formation.", difficulty: "hard" },

    // ===== CEREBRAL CORTEX =====
    { topicId: topicMap["Cerebral Cortex"], question: "Broca's aphasia is characterized by:", options: JSON.stringify(["A) Fluent speech but poor comprehension", "B) Non-fluent, effortful speech with relatively preserved comprehension", "C) Inability to repeat but normal speech and comprehension", "D) Loss of all language functions"]), correctAnswer: "B", explanation: "Broca's aphasia (expressive aphasia) from left inferior frontal lesion: non-fluent, telegraphic speech with reasonable comprehension. Patient knows what they want to say but cannot produce it fluently.", difficulty: "medium" },
    { topicId: topicMap["Cerebral Cortex"], question: "Which language area is responsible for comprehension?", options: JSON.stringify(["A) Broca's area (left inferior frontal gyrus)", "B) Primary motor cortex", "C) Wernicke's area (left superior temporal gyrus)", "D) Angular gyrus"]), correctAnswer: "C", explanation: "Wernicke's area (posterior superior temporal gyrus, BA 22) is critical for language comprehension. Damage causes Wernicke's aphasia: fluent but meaningless speech, poor comprehension.", difficulty: "easy" },
    { topicId: topicMap["Cerebral Cortex"], question: "Hemineglect most commonly follows lesions to:", options: JSON.stringify(["A) Left frontal lobe", "B) Right parietal lobe", "C) Left temporal lobe", "D) Right occipital lobe"]), correctAnswer: "B", explanation: "Hemineglect (failure to attend to contralateral space) most commonly follows right parietal lobe lesions, causing neglect of the left visual/personal space.", difficulty: "hard" },
    { topicId: topicMap["Cerebral Cortex"], question: "The primary somatosensory cortex is located in the:", options: JSON.stringify(["A) Precentral gyrus", "B) Postcentral gyrus", "C) Superior temporal gyrus", "D) Angular gyrus"]), correctAnswer: "B", explanation: "The primary somatosensory cortex (S1) occupies the postcentral gyrus (Brodmann areas 1, 2, 3), immediately posterior to the central sulcus.", difficulty: "easy" },
    { topicId: topicMap["Cerebral Cortex"], question: "Gerstmann's syndrome (acalculia, agraphia, finger agnosia, left-right disorientation) localizes to:", options: JSON.stringify(["A) Right parietal lobe", "B) Left angular gyrus", "C) Left temporal lobe", "D) Left occipital lobe"]), correctAnswer: "B", explanation: "Gerstmann's syndrome results from damage to the left angular gyrus at the parieto-occipito-temporal junction, disrupting mathematical, writing, and finger knowledge functions.", difficulty: "hard" },
    { topicId: topicMap["Cerebral Cortex"], question: "Which Brodmann area is the primary motor cortex?", options: JSON.stringify(["A) BA 17", "B) BA 4", "C) BA 44", "D) BA 22"]), correctAnswer: "B", explanation: "Brodmann area 4 (BA 4) is the primary motor cortex, located in the precentral gyrus. BA 17 = primary visual cortex; BA 44-45 = Broca's area; BA 22 = Wernicke's area.", difficulty: "medium" },
    { topicId: topicMap["Cerebral Cortex"], question: "Conduction aphasia is caused by damage to the:", options: JSON.stringify(["A) Broca's area", "B) Wernicke's area", "C) Arcuate fasciculus connecting Broca's and Wernicke's areas", "D) Angular gyrus"]), correctAnswer: "C", explanation: "Conduction aphasia results from damage to the arcuate fasciculus (white matter tract connecting Broca's and Wernicke's areas); characterized by fluent speech, intact comprehension, but severely impaired repetition.", difficulty: "hard" },
    { topicId: topicMap["Cerebral Cortex"], question: "A patient with right occipital lobe damage would most likely have:", options: JSON.stringify(["A) Left hemianopia (loss of left visual field)", "B) Right hemianopia (loss of right visual field)", "C) Bitemporal hemianopia", "D) Blindness in the right eye only"]), correctAnswer: "A", explanation: "The right occipital lobe processes the left visual field. Damage to the right primary visual cortex or optic radiations causes left homonymous hemianopia.", difficulty: "medium" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is cortical neuroplasticity?", options: JSON.stringify(["A) The fixed organization of the cortex throughout life", "B) The cortex's ability to reorganize structure and function in response to experience or injury", "C) The growth of new blood vessels in the cortex", "D) The process of myelination of cortical neurons"]), correctAnswer: "B", explanation: "Neuroplasticity refers to the cortex's ability to change its structure, function, and connectivity in response to learning, experience, or injury — the basis of rehabilitation and learning.", difficulty: "medium" },
    { topicId: topicMap["Cerebral Cortex"], question: "The primary visual cortex (V1) is located along:", options: JSON.stringify(["A) The central sulcus", "B) The Sylvian fissure", "C) The calcarine sulcus of the occipital lobe", "D) The intraparietal sulcus"]), correctAnswer: "C", explanation: "V1 (striate cortex, BA 17) is located along the calcarine sulcus (calcarine fissure) on the medial surface of the occipital lobe.", difficulty: "medium" },

    // ===== SENSORY & MOTOR PATHWAYS =====
    { topicId: topicMap["Sensory & Motor Pathways"], question: "The dorsal column–medial lemniscal pathway carries:", options: JSON.stringify(["A) Pain and temperature from the contralateral body", "B) Fine touch, vibration, and proprioception from the ipsilateral body (ascending) then crosses in the medulla", "C) Motor commands from the cortex to the spinal cord", "D) Unconscious proprioception to the cerebellum"]), correctAnswer: "B", explanation: "The dorsal column–medial lemniscal pathway ascends ipsilaterally in the spinal cord (dorsal columns), crosses in the medulla (medial lemniscus), and reaches the contralateral thalamus (VPL).", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "The spinothalamic tract decussates:", options: JSON.stringify(["A) In the medulla", "B) In the midbrain", "C) Within 1-2 spinal cord segments of entry", "D) At the thalamus"]), correctAnswer: "C", explanation: "Spinothalamic tract fibers cross the midline within 1-2 segments of their entry into the spinal cord (through the anterior white commissure), then ascend contralaterally to the VPL thalamus.", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "A lesion at the level of the right medulla affecting the medial lemniscus would cause:", options: JSON.stringify(["A) Loss of fine touch/proprioception on the right body", "B) Loss of fine touch/proprioception on the left body", "C) Loss of pain/temperature on the right body", "D) Motor weakness on the left side"]), correctAnswer: "B", explanation: "The medial lemniscus carries crossed dorsal column information; a right medullary medial lemniscus lesion interrupts fibers from the left body (already crossed), causing left-sided loss of fine touch and proprioception.", difficulty: "hard" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "The lateral corticospinal tract controls:", options: JSON.stringify(["A) Axial and proximal muscles", "B) Distal limb muscles for fine voluntary movement", "C) Autonomic functions", "D) Facial muscles only"]), correctAnswer: "B", explanation: "The lateral corticospinal tract (majority of corticospinal fibers) primarily controls distal limb musculature for fine voluntary movements, especially of the hands.", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "The Babinski sign (extensor plantar response) is a sign of:", options: JSON.stringify(["A) Lower motor neuron damage", "B) Peripheral neuropathy", "C) Upper motor neuron (corticospinal) lesion", "D) Cerebellar disease"]), correctAnswer: "C", explanation: "The Babinski sign — extension of the great toe and fanning of other toes on plantar stimulation — indicates a UMN/corticospinal tract lesion (or is normal in infants).", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "The VPL nucleus of the thalamus is the relay for:", options: JSON.stringify(["A) Taste information", "B) Auditory information from the cochlea", "C) Somatosensory information from the body", "D) Visual information from the retina"]), correctAnswer: "C", explanation: "The ventral posterolateral (VPL) nucleus of the thalamus receives somatosensory (pain, temperature, touch, proprioception) information from the body and relays it to somatosensory cortex.", difficulty: "hard" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "Referred pain is best explained by:", options: JSON.stringify(["A) Direct damage to peripheral nerves", "B) Convergence of visceral and somatic afferents on the same spinal neurons", "C) Cortical mislocalization errors", "D) Thalamic dysfunction"]), correctAnswer: "B", explanation: "Referred pain occurs because visceral and somatic pain afferents converge on the same dorsal horn neurons; the cortex misattributes the pain to the somatic (body surface) location.", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "The corticospinal tract decussates (crosses) at:", options: JSON.stringify(["A) The internal capsule", "B) The medullary pyramids", "C) The spinal cord entry", "D) The cerebral peduncles"]), correctAnswer: "B", explanation: "About 85-90% of corticospinal fibers cross at the medullary pyramids (pyramidal decussation) to form the lateral corticospinal tract on the opposite side.", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "Which tract carries unconscious proprioception from the lower limb to the cerebellum?", options: JSON.stringify(["A) Dorsal column", "B) Spinothalamic tract", "C) Posterior spinocerebellar tract", "D) Rubrospinal tract"]), correctAnswer: "C", explanation: "The posterior spinocerebellar tract carries unconscious proprioception from the lower limb (muscle spindle Ia/II afferents) to the ipsilateral cerebellum via the inferior cerebellar peduncle.", difficulty: "hard" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "Hemisection of the spinal cord at C5 on the right would cause contralateral loss of:", options: JSON.stringify(["A) Motor function", "B) Proprioception and vibration", "C) Pain and temperature sensation", "D) All sensation and movement"]), correctAnswer: "C", explanation: "The spinothalamic tract (pain/temperature) crosses near the spinal cord entry level; a right C5 hemisection disrupts left-side spinothalamic fibers that have already crossed, causing left pain/temperature loss below C5.", difficulty: "hard" },

    // ===== CNS DEVELOPMENT =====
    { topicId: topicMap["CNS Development"], question: "Neural tube closure occurs during which week of embryonic development?", options: JSON.stringify(["A) Week 2", "B) Week 4", "C) Week 8", "D) Week 12"]), correctAnswer: "B", explanation: "The neural tube closes around embryonic week 4 (28-29 days). Failure of closure at different ends causes anencephaly (cranial) or spina bifida (caudal).", difficulty: "medium" },
    { topicId: topicMap["CNS Development"], question: "The cortex develops in an 'inside-out' pattern, meaning:", options: JSON.stringify(["A) Superficial layers are born first", "B) Deep layers are born first; later-born neurons migrate to superficial layers", "C) All layers develop simultaneously", "D) The cortex develops from outside to inside during fetal life"]), correctAnswer: "B", explanation: "Earlier-born neurons occupy deeper cortical layers (VI, V) while later-born neurons migrate through existing layers to populate superficial ones (II, III) — the inside-out gradient.", difficulty: "hard" },
    { topicId: topicMap["CNS Development"], question: "Synaptic pruning is important because:", options: JSON.stringify(["A) It adds new synapses to improve memory", "B) It eliminates weak/unused synapses, refining and strengthening neural circuits", "C) It removes myelin from axons during adolescence", "D) It increases the total number of synapses"]), correctAnswer: "B", explanation: "Synaptic pruning eliminates excess synapses that are weakly used, based on the principle 'use it or lose it,' refining and strengthening the circuits that are actively used.", difficulty: "medium" },
    { topicId: topicMap["CNS Development"], question: "Supplementation with which nutrient prevents neural tube defects?", options: JSON.stringify(["A) Vitamin D", "B) Vitamin B12", "C) Folic acid (vitamin B9)", "D) Iron"]), correctAnswer: "C", explanation: "Folic acid (vitamin B9) taken periconceptionally significantly reduces the risk of neural tube defects (spina bifida, anencephaly).", difficulty: "easy" },
    { topicId: topicMap["CNS Development"], question: "A critical period in brain development refers to:", options: JSON.stringify(["A) The period when neurons die most rapidly", "B) A time window of heightened sensitivity to environmental input for normal development of specific functions", "C) The period of maximum synaptic density", "D) The period after which no new learning can occur"]), correctAnswer: "B", explanation: "Critical periods are windows of heightened neuroplasticity during which specific environmental inputs are necessary for normal development of particular functions (e.g., visual system, language).", difficulty: "medium" },
    { topicId: topicMap["CNS Development"], question: "Which brain region is last to complete myelination in human development?", options: JSON.stringify(["A) Spinal cord", "B) Visual cortex", "C) Brainstem", "D) Prefrontal cortex"]), correctAnswer: "D", explanation: "The prefrontal cortex is among the last brain regions to complete myelination, continuing into the mid-20s. This explains prolonged development of executive functions and impulse control in adolescence.", difficulty: "medium" },
    { topicId: topicMap["CNS Development"], question: "Lissencephaly is characterized by:", options: JSON.stringify(["A) Excessive cortical folding", "B) Smooth brain due to failure of neuronal migration", "C) Absent corpus callosum", "D) Premature closure of fontanelles"]), correctAnswer: "B", explanation: "Lissencephaly ('smooth brain') results from defective neuronal migration during cortical development, causing absent or reduced gyri/sulci. Causes severe intellectual disability and refractory epilepsy.", difficulty: "hard" },
    { topicId: topicMap["CNS Development"], question: "BDNF (Brain-Derived Neurotrophic Factor) is important in neural development because it:", options: JSON.stringify(["A) Prevents myelination of neurons", "B) Promotes neuronal survival, differentiation, and synaptic plasticity", "C) Accelerates apoptosis of excess neurons", "D) Inhibits axonal growth"]), correctAnswer: "B", explanation: "BDNF is a key neurotrophin that promotes neuronal survival, differentiation, axonal and dendritic growth, and synaptic plasticity (including LTP); important for learning and memory.", difficulty: "hard" },
    { topicId: topicMap["CNS Development"], question: "The primary adult site of hippocampal neurogenesis is the:", options: JSON.stringify(["A) CA1 pyramidal layer", "B) CA3 stratum radiatum", "C) Dentate gyrus subgranular zone", "D) Subiculum"]), correctAnswer: "C", explanation: "Adult hippocampal neurogenesis in mammals occurs in the subgranular zone (SGZ) of the dentate gyrus; new granule cells integrate into the dentate-CA3 circuit.", difficulty: "hard" },
    { topicId: topicMap["CNS Development"], question: "Which of the following is NOT a known risk factor for abnormal CNS development?", options: JSON.stringify(["A) Maternal alcohol consumption during pregnancy", "B) Folic acid supplementation", "C) Congenital rubella infection", "D) Lead exposure in early childhood"]), correctAnswer: "B", explanation: "Folic acid supplementation PREVENTS neural tube defects and is protective. Alcohol (fetal alcohol syndrome), rubella (microcephaly), and lead (neurotoxicity) are all risk factors for abnormal CNS development.", difficulty: "medium" },

    // ===== DEMENTIA & ALZHEIMER'S DISEASE =====
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "The hallmark pathological features of Alzheimer's disease include:", options: JSON.stringify(["A) Lewy bodies and dopamine loss", "B) Amyloid plaques and neurofibrillary tangles", "C) Prion proteins and spongiform changes", "D) TDP-43 inclusions and frontotemporal atrophy"]), correctAnswer: "B", explanation: "Alzheimer's disease is characterized by extracellular amyloid-β (beta-amyloid) plaques and intracellular neurofibrillary tangles (hyperphosphorylated tau protein).", difficulty: "medium" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "The earliest cognitive symptom in Alzheimer's disease is typically:", options: JSON.stringify(["A) Language impairment", "B) Visuospatial deficits", "C) Episodic memory impairment (especially anterograde)", "D) Executive dysfunction"]), correctAnswer: "C", explanation: "Early Alzheimer's disease typically presents with episodic memory impairment — difficulty forming new memories (anterograde amnesia) — reflecting early hippocampal and entorhinal cortex pathology.", difficulty: "easy" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "Which genetic variant is the strongest risk factor for LATE-ONSET Alzheimer's disease?", options: JSON.stringify(["A) PSEN1 mutation", "B) APP mutation", "C) APOE ε4 allele", "D) HTT CAG repeat expansion"]), correctAnswer: "C", explanation: "The APOE ε4 allele is the strongest genetic risk factor for sporadic late-onset Alzheimer's disease; one copy triples risk, two copies increases risk ~8-12 fold.", difficulty: "hard" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "Lewy body dementia is distinguished from Alzheimer's by:", options: JSON.stringify(["A) Gradual memory loss as the primary symptom", "B) Fluctuating cognition, visual hallucinations, and parkinsonism", "C) Prominent frontal lobe disinhibition", "D) Exclusively motor symptoms"]), correctAnswer: "B", explanation: "Lewy body dementia features fluctuating cognition, recurrent vivid visual hallucinations, parkinsonism, and REM sleep behavior disorder — caused by alpha-synuclein (Lewy body) deposits.", difficulty: "hard" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "The amyloid cascade hypothesis proposes that:", options: JSON.stringify(["A) Tau accumulation initiates all other Alzheimer's changes", "B) Cholinergic loss is the primary driver of Alzheimer's", "C) Accumulation of amyloid-β initiates a cascade leading to neurodegeneration", "D) Neuroinflammation is the only cause of Alzheimer's"]), correctAnswer: "C", explanation: "The amyloid cascade hypothesis proposes that amyloid-β accumulation (from APP processing) is the initiating event, triggering tau pathology, inflammation, synaptic loss, and neurodegeneration.", difficulty: "hard" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "Acetylcholinesterase inhibitors (donepezil, rivastigmine) treat Alzheimer's by:", options: JSON.stringify(["A) Reducing amyloid plaque formation", "B) Increasing acetylcholine availability by preventing its breakdown", "C) Blocking NMDA receptors", "D) Stimulating hippocampal neurogenesis"]), correctAnswer: "B", explanation: "Acetylcholinesterase inhibitors prevent the breakdown of acetylcholine in synapses, compensating for the cholinergic deficit (loss of basal nucleus of Meynert neurons) in Alzheimer's.", difficulty: "medium" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What is the key difference between delirium and dementia?", options: JSON.stringify(["A) Delirium is chronic; dementia is acute", "B) Delirium has acute onset with fluctuating attention; dementia is gradual with stable consciousness", "C) Dementia always involves psychosis; delirium does not", "D) Both have the same onset and course"]), correctAnswer: "B", explanation: "Delirium: acute onset, fluctuating course, impaired consciousness/attention, often reversible. Dementia: gradual onset, stable course, consciousness preserved until late, usually progressive.", difficulty: "medium" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "Frontotemporal dementia (FTD) primarily presents with:", options: JSON.stringify(["A) Memory loss as the primary symptom", "B) Personality change, disinhibition, executive dysfunction, or language deficits", "C) Visual hallucinations and parkinsonism", "D) Stepwise cognitive decline"]), correctAnswer: "B", explanation: "FTD primarily affects frontal and temporal lobes, causing personality changes, behavioral disinhibition, executive dysfunction (behavioral variant), or progressive language deficits (semantic or nonfluent variants).", difficulty: "medium" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "Vascular dementia characteristically has which pattern of cognitive decline?", options: JSON.stringify(["A) Gradual, smooth progression", "B) Rapid deterioration over weeks", "C) Stepwise deterioration following strokes or vascular events", "D) Fluctuating cognition with visual hallucinations"]), correctAnswer: "C", explanation: "Vascular dementia typically shows stepwise deterioration, with each step corresponding to a cerebrovascular event (stroke, lacunar infarct), rather than the gradual progression of Alzheimer's.", difficulty: "medium" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "Pseudodementia refers to:", options: JSON.stringify(["A) Dementia that appears worse than it is", "B) Cognitive impairment caused by depression that mimics dementia", "C) Dementia in patients who also have psychiatric illness", "D) Dementia caused by medication side effects"]), correctAnswer: "B", explanation: "Pseudodementia describes cognitive impairment (memory complaints, slowing) caused by depression that resembles dementia but is reversible with treatment of the underlying depression.", difficulty: "medium" },

    // ===== CEREBROVASCULAR SYSTEM =====
    { topicId: topicMap["Cerebrovascular System"], question: "Which type of stroke involves blockage of blood supply to the brain?", options: JSON.stringify(["A) Hemorrhagic stroke", "B) Ischemic stroke", "C) Subarachnoid hemorrhage", "D) Epidural hematoma"]), correctAnswer: "B", explanation: "Ischemic stroke (~80% of all strokes) involves blockage of blood supply, either by thrombosis (in situ clot) or embolism (clot from elsewhere). Hemorrhagic strokes involve bleeding.", difficulty: "easy" },
    { topicId: topicMap["Cerebrovascular System"], question: "A TIA (transient ischemic attack) is defined by:", options: JSON.stringify(["A) Neurological deficit lasting >24 hours without infarction", "B) Brief neurological symptoms from ischemia, resolving without permanent infarction", "C) Any stroke that resolves completely within a week", "D) Hemorrhage that resolves spontaneously"]), correctAnswer: "B", explanation: "TIA is a transient episode of neurological dysfunction from focal cerebral ischemia without permanent infarction; modern definition based on absence of infarct on imaging, not time.", difficulty: "easy" },
    { topicId: topicMap["Cerebrovascular System"], question: "Occlusion of the middle cerebral artery (MCA) would most likely cause:", options: JSON.stringify(["A) Contralateral leg weakness (greater than arm)", "B) Contralateral arm and face weakness (greater than leg) with aphasia if left-sided", "C) Ipsilateral arm weakness", "D) Bilateral weakness and blindness"]), correctAnswer: "B", explanation: "MCA territory includes the lateral cortex (arm and face representation in motor/sensory cortex); occlusion causes contralateral arm and face weakness greater than leg. Left MCA = aphasia.", difficulty: "medium" },
    { topicId: topicMap["Cerebrovascular System"], question: "A subarachnoid hemorrhage (SAH) classically presents with:", options: JSON.stringify(["A) Gradual headache worsening over days", "B) Sudden severe 'thunderclap' headache (worst of life)", "C) Unilateral vision loss", "D) Painless hemiplegia"]), correctAnswer: "B", explanation: "SAH (usually from ruptured aneurysm) presents with a sudden, severe 'thunderclap' headache — the worst headache of the patient's life — often with neck stiffness and photophobia.", difficulty: "medium" },
    { topicId: topicMap["Cerebrovascular System"], question: "The Circle of Willis provides:", options: JSON.stringify(["A) Sensory-motor integration pathways", "B) Collateral blood flow between anterior and posterior cerebral circulations", "C) The blood-brain barrier at the base of the brain", "D) Venous drainage from the brain"]), correctAnswer: "B", explanation: "The Circle of Willis is an arterial anastomosis at the base of the brain connecting the internal carotid and vertebrobasilar systems, providing collateral blood flow if one vessel is occluded.", difficulty: "medium" },
    { topicId: topicMap["Cerebrovascular System"], question: "Lacunar infarcts are associated with:", options: JSON.stringify(["A) Large vessel thrombosis", "B) Cardioembolism from atrial fibrillation", "C) Small vessel disease from chronic hypertension", "D) Vasculitis"]), correctAnswer: "C", explanation: "Lacunar infarcts are small, deep infarcts caused by small vessel disease (lipohyalinosis) typically from chronic hypertension or diabetes, affecting penetrating arteries to basal ganglia, thalamus, or brainstem.", difficulty: "hard" },
    { topicId: topicMap["Cerebrovascular System"], question: "Watershed infarcts typically occur due to:", options: JSON.stringify(["A) Emboli from the heart", "B) Local thrombosis of a large artery", "C) Global hypoperfusion (e.g., cardiac arrest, severe hypotension)", "D) Venous sinus thrombosis"]), correctAnswer: "C", explanation: "Watershed (border zone) infarcts occur in the territories between major arterial distributions; they result from global hypoperfusion when perfusion pressure falls too low.", difficulty: "hard" },
    { topicId: topicMap["Cerebrovascular System"], question: "The blood-brain barrier (BBB) is primarily formed by:", options: JSON.stringify(["A) Microglia surrounding blood vessels", "B) Tight junctions between endothelial cells, astrocyte endfeet, and pericytes", "C) The CSF-blood interface", "D) Myelin surrounding brain capillaries"]), correctAnswer: "B", explanation: "The BBB is a functional barrier formed by cerebral endothelial cells connected by tight junctions, supported by astrocyte endfeet and pericytes, that restricts passage of many substances.", difficulty: "medium" },
    { topicId: topicMap["Cerebrovascular System"], question: "The anterior cerebral artery (ACA) territory includes the:", options: JSON.stringify(["A) Lateral cortex including arm and face areas", "B) Medial frontal and parietal cortex including the leg area", "C) Temporal lobe and visual cortex", "D) Brainstem and cerebellum"]), correctAnswer: "B", explanation: "The ACA supplies the medial frontal and parietal cortex (including the leg area of the motor/sensory homunculus). ACA infarction causes leg weakness greater than arm weakness.", difficulty: "medium" },
    { topicId: topicMap["Cerebrovascular System"], question: "Autoregulation of cerebral blood flow maintains constant perfusion when MAP is between approximately:", options: JSON.stringify(["A) 10-40 mmHg", "B) 60-150 mmHg", "C) 100-200 mmHg", "D) 40-60 mmHg"]), correctAnswer: "B", explanation: "Cerebral autoregulation maintains constant blood flow across a mean arterial pressure (MAP) range of approximately 60-150 mmHg through vessel constriction/dilation.", difficulty: "hard" },

    // ===== NEURORADIOLOGY =====
    { topicId: topicMap["Neuroradiology"], question: "What does T2-weighted MRI best show?", options: JSON.stringify(["A) Acute hemorrhage as bright white", "B) Fat as bright signal", "C) Fluid/water as bright (CSF, edema, demyelination)", "D) Bony structures"]), correctAnswer: "C", explanation: "T2-weighted MRI shows fluid/water as bright: CSF, edema, demyelination, and many pathological lesions. T1 shows fat as bright; CT shows acute hemorrhage and bone well.", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "Which MRI sequence detects acute ischemic stroke within minutes?", options: JSON.stringify(["A) T1-weighted", "B) T2-weighted", "C) FLAIR", "D) Diffusion-weighted imaging (DWI)"]), correctAnswer: "D", explanation: "DWI shows restricted diffusion (bright signal) in cytotoxic edema from ischemia within minutes of onset. This is the most sensitive sequence for hyperacute stroke detection.", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "What does non-contrast CT best visualize?", options: JSON.stringify(["A) Subacute hemorrhage", "B) Acute hemorrhage and bony structures", "C) Demyelinating plaques", "D) Early cerebral edema"]), correctAnswer: "B", explanation: "Non-contrast CT is first-line emergency imaging; acute blood appears hyperdense and bony structures are well-shown. It is fast, widely available, and sensitive for hemorrhage.", difficulty: "easy" },
    { topicId: topicMap["Neuroradiology"], question: "FLAIR MRI is particularly useful for:", options: JSON.stringify(["A) Detecting bony metastases", "B) Suppressing CSF to reveal periventricular lesions like MS plaques", "C) Detecting only acute hemorrhage", "D) Measuring perfusion"]), correctAnswer: "B", explanation: "FLAIR suppresses CSF signal while maintaining lesion signal; excellent for periventricular lesions adjacent to ventricles that would be obscured by CSF on standard T2.", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "Gadolinium enhancement on MRI indicates:", options: JSON.stringify(["A) Old blood products", "B) Normal brain tissue", "C) Blood-brain barrier disruption from active inflammation or tumor", "D) Fat-containing structures"]), correctAnswer: "C", explanation: "Gadolinium highlights areas of BBB breakdown: active MS plaques, tumors, abscesses, and active inflammation. Normal brain does not enhance.", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "Subacute blood (methemoglobin) appears on T1-weighted MRI as:", options: JSON.stringify(["A) Dark (hypointense)", "B) Bright (hyperintense)", "C) Invisible signal", "D) Same signal as CSF"]), correctAnswer: "B", explanation: "Subacute hemorrhage contains methemoglobin which is bright on T1, helping date blood products. Acute blood is T2-dark; chronic hemosiderin is T2-dark.", difficulty: "hard" },
    { topicId: topicMap["Neuroradiology"], question: "Which imaging detects amyloid plaques in Alzheimer disease?", options: JSON.stringify(["A) CT without contrast", "B) Standard structural MRI", "C) Amyloid PET scanning", "D) SPECT imaging only"]), correctAnswer: "C", explanation: "Amyloid PET (using tracers like florbetapir) detects amyloid-beta plaques in vivo. FDG-PET shows metabolic hypometabolism in AD-affected regions.", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "A midline shift greater than 5mm on CT indicates:", options: JSON.stringify(["A) Normal anatomical variation", "B) Significant mass effect with herniation risk", "C) Technical imaging artifact", "D) Bilateral symmetric pathology"]), correctAnswer: "B", explanation: "Midline shift indicates significant unilateral mass effect from hematoma, tumor, or edema; >5mm is clinically significant and may indicate risk of transtentorial herniation.", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "Diffusion tensor imaging (DTI) is primarily used to:", options: JSON.stringify(["A) Measure blood perfusion", "B) Visualize white matter fiber tract architecture", "C) Measure gray matter thickness", "D) Assess CSF flow dynamics"]), correctAnswer: "B", explanation: "DTI maps water diffusion direction along axons for reconstruction of white matter fiber tracts (tractography); used in presurgical planning and studying white matter diseases.", difficulty: "hard" },
    { topicId: topicMap["Neuroradiology"], question: "MR spectroscopy (MRS) elevated choline indicates:", options: JSON.stringify(["A) Normal neuronal metabolism", "B) Ischemia and energy failure", "C) Increased membrane turnover as seen in tumors and active demyelination", "D) Normal aging only"]), correctAnswer: "C", explanation: "Elevated choline on MRS reflects increased membrane phospholipid turnover, characteristic of rapidly dividing cells (tumors), active demyelination, and inflammation. NAA reduction indicates neuronal loss.", difficulty: "hard" },

    // ===== MULTIPLE SCLEROSIS =====
    { topicId: topicMap["Multiple Sclerosis"], question: "The pathological hallmark of multiple sclerosis is:", options: JSON.stringify(["A) Amyloid plaques in white matter", "B) Demyelinating plaques in the CNS disseminated in space and time", "C) Axonal transection in gray matter", "D) Lewy body inclusions in oligodendrocytes"]), correctAnswer: "B", explanation: "MS is characterized by demyelinating plaques (lesions) in CNS white matter, disseminated in space (multiple locations) and time (multiple episodes), causing episodic neurological symptoms.", difficulty: "medium" },
    { topicId: topicMap["Multiple Sclerosis"], question: "Uhthoff's phenomenon refers to:", options: JSON.stringify(["A) Pain in the optic nerve during movement", "B) Temporary worsening of MS symptoms with increased body temperature", "C) Recovery from MS symptoms with rest", "D) Electric shock sensation on neck flexion"]), correctAnswer: "B", explanation: "Uhthoff's phenomenon: temporary worsening of pre-existing MS symptoms with increases in body temperature (fever, exercise, hot bath), because heat impairs conduction in demyelinated axons.", difficulty: "hard" },
    { topicId: topicMap["Multiple Sclerosis"], question: "Which is the most common type of MS?", options: JSON.stringify(["A) Primary progressive MS (PPMS)", "B) Secondary progressive MS (SPMS)", "C) Relapsing-remitting MS (RRMS)", "D) Progressive-relapsing MS (PRMS)"]), correctAnswer: "C", explanation: "RRMS is the most common form (~85% of initial diagnoses), characterized by discrete episodes of neurological dysfunction (relapses) followed by complete or partial recovery.", difficulty: "easy" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What is Lhermitte's sign?", options: JSON.stringify(["A) Temporary vision loss in one eye", "B) An electric shock sensation down the spine on neck flexion", "C) Trigeminal neuralgia in MS", "D) Progressive spastic paraplegia"]), correctAnswer: "B", explanation: "Lhermitte's sign: an electric shock-like sensation traveling from the neck down the spine and into the limbs on neck flexion; indicates demyelination of the dorsal cervical spinal cord.", difficulty: "hard" },
    { topicId: topicMap["Multiple Sclerosis"], question: "The McDonald criteria for MS diagnosis require evidence of:", options: JSON.stringify(["A) At least one MS plaque on MRI", "B) Oligoclonal bands in CSF only", "C) Lesions disseminated in space AND time", "D) Positive evoked potentials in all three modalities"]), correctAnswer: "C", explanation: "The McDonald criteria require demonstration of CNS lesions disseminated in space (two or more areas) and time (two or more episodes or new lesion on follow-up MRI).", difficulty: "medium" },
    { topicId: topicMap["Multiple Sclerosis"], question: "Optic neuritis in MS presents as:", options: JSON.stringify(["A) Bilateral sudden painless vision loss", "B) Unilateral painful vision loss with impaired color vision", "C) Bilateral gradual progressive vision loss", "D) Flashing lights and field defects"]), correctAnswer: "B", explanation: "Optic neuritis in MS: unilateral eye pain (worsened by movement) with decreased visual acuity, color vision impairment, and a central scotoma; about 50% develop MS within 15 years.", difficulty: "medium" },
    { topicId: topicMap["Multiple Sclerosis"], question: "CSF oligoclonal bands in MS indicate:", options: JSON.stringify(["A) Increased red blood cells from hemorrhage", "B) Intrathecal IgG synthesis (CNS immune activity)", "C) Elevated protein from peripheral nerve disease", "D) Presence of amyloid in CSF"]), correctAnswer: "B", explanation: "Oligoclonal bands represent discrete IgG bands on electrophoresis from intrathecal (within CNS) immunoglobulin production; found in ~90% of MS patients.", difficulty: "hard" },
    { topicId: topicMap["Multiple Sclerosis"], question: "Internuclear ophthalmoplegia (INO) in MS is caused by a lesion in the:", options: JSON.stringify(["A) Optic chiasm", "B) Medial longitudinal fasciculus (MLF)", "C) Oculomotor nerve", "D) Frontal eye field"]), correctAnswer: "B", explanation: "INO results from MLF lesions in the brainstem; the MLF coordinates eye movements between CN VI and CN III nuclei. MLF lesions are a classic finding in MS.", difficulty: "hard" },
    { topicId: topicMap["Multiple Sclerosis"], question: "Interferon-beta is used in MS to:", options: JSON.stringify(["A) Remyelinate damaged axons", "B) Reduce relapse rate by modulating immune response", "C) Repair the blood-brain barrier", "D) Increase dopamine production"]), correctAnswer: "B", explanation: "Interferon-beta reduces relapse frequency and MRI lesion load in RRMS by reducing T-cell activation, migration across the BBB, and cytokine production.", difficulty: "medium" },
    { topicId: topicMap["Multiple Sclerosis"], question: "Which MS subtype is characterized by steady neurological decline without relapses from onset?", options: JSON.stringify(["A) Relapsing-remitting MS", "B) Secondary progressive MS", "C) Primary progressive MS (PPMS)", "D) Clinically isolated syndrome"]), correctAnswer: "C", explanation: "Primary progressive MS (PPMS, ~15% of MS) is characterized by steady neurological deterioration from disease onset, without initial relapsing-remitting episodes.", difficulty: "medium" },

    // ===== PAIN & NOCICEPTION =====
    { topicId: topicMap["Pain & Nociception"], question: "A-delta fibers transmit:", options: JSON.stringify(["A) Slow, burning, diffuse pain", "B) Fast, sharp, well-localized pain", "C) Proprioceptive signals", "D) Temperature only"]), correctAnswer: "B", explanation: "A-delta fibers are thinly myelinated, transmit fast (first pain) that is sharp and well-localized. C-fibers are unmyelinated, transmit slow burning (second pain).", difficulty: "medium" },
    { topicId: topicMap["Pain & Nociception"], question: "The gate control theory of pain proposes that:", options: JSON.stringify(["A) Pain has no gate mechanism in the spinal cord", "B) Large-diameter fiber (non-nociceptive) input can inhibit pain signal transmission at the spinal cord", "C) Pain signals only travel through the brainstem", "D) The spinal cord amplifies all pain signals"]), correctAnswer: "B", explanation: "Melzack and Wall's gate control theory: large Aβ fiber (non-nociceptive touch) input activates inhibitory interneurons in the dorsal horn, 'closing the gate' to C-fiber pain signals.", difficulty: "medium" },
    { topicId: topicMap["Pain & Nociception"], question: "Allodynia refers to:", options: JSON.stringify(["A) Absence of pain sensation", "B) Pain from a normally non-painful stimulus", "C) Exaggerated pain from a painful stimulus", "D) Pain after the stimulus is removed"]), correctAnswer: "B", explanation: "Allodynia is pain caused by a stimulus that would not normally produce pain (e.g., light touch on sunburned skin); a hallmark of central sensitization and neuropathic pain.", difficulty: "medium" },
    { topicId: topicMap["Pain & Nociception"], question: "The periaqueductal gray (PAG) is important in pain because:", options: JSON.stringify(["A) It is the primary site of pain detection", "B) It activates descending inhibitory pathways that modulate pain", "C) It generates all pain signals", "D) It contains the pain gate mechanism"]), correctAnswer: "B", explanation: "The PAG (midbrain) activates descending inhibitory pathways (via the raphe nuclei and locus coeruleus) that release serotonin, norepinephrine, and endorphins to inhibit pain in the spinal cord.", difficulty: "hard" },
    { topicId: topicMap["Pain & Nociception"], question: "Opioids exert their analgesic effect by:", options: JSON.stringify(["A) Blocking sodium channels in pain fibers", "B) Binding to mu, delta, kappa receptors to inhibit pain signaling", "C) Activating NMDA receptors to block sensitization", "D) Increasing substance P release"]), correctAnswer: "B", explanation: "Opioids (endogenous and exogenous) bind to mu, delta, and kappa opioid receptors in the CNS and PNS, inhibiting neurotransmitter release and reducing pain signal transmission.", difficulty: "medium" },
    { topicId: topicMap["Pain & Nociception"], question: "Central sensitization in chronic pain involves:", options: JSON.stringify(["A) Peripheral nerve damage only", "B) Decreased sensitivity in the CNS to pain signals", "C) Increased responsiveness of CNS pain-processing neurons, amplifying pain", "D) Loss of NMDA receptors in the spinal cord"]), correctAnswer: "C", explanation: "Central sensitization is a state of amplified pain processing in the CNS following persistent nociceptive input; involves NMDA receptor activation, wind-up, and synaptic strengthening in dorsal horn neurons.", difficulty: "hard" },
    { topicId: topicMap["Pain & Nociception"], question: "Substance P in pain transmission:", options: JSON.stringify(["A) Inhibits pain transmission at the spinal cord", "B) Is released by C-fibers; activates NK1 receptors to facilitate dorsal horn pain transmission", "C) Only acts in the brain, not the spinal cord", "D) Blocks the gate control mechanism"]), correctAnswer: "B", explanation: "Substance P is a neuropeptide co-released with glutamate from C-fibers at the dorsal horn; it activates NK1 (neurokinin-1) receptors, facilitating and prolonging pain transmission.", difficulty: "hard" },
    { topicId: topicMap["Pain & Nociception"], question: "Phantom limb pain occurs because:", options: JSON.stringify(["A) The amputated limb sends pain signals", "B) Maladaptive cortical reorganization generates ongoing pain in the missing limb's representation", "C) Pain is stored in the amputated tissue", "D) The nervous system rejects the amputation"]), correctAnswer: "B", explanation: "Phantom limb pain involves cortical reorganization and central sensitization; the somatosensory cortex representation of the amputated limb generates ongoing pain signals despite the absence of the limb.", difficulty: "medium" },
    { topicId: topicMap["Pain & Nociception"], question: "Which type of pain is characterized by burning, electric shock-like sensations and allodynia?", options: JSON.stringify(["A) Nociceptive pain from tissue damage", "B) Neuropathic pain from nerve damage", "C) Inflammatory pain from acute injury", "D) Central pain from brainstem damage"]), correctAnswer: "B", explanation: "Neuropathic pain arises from nerve damage or dysfunction; characterized by burning, shooting, or electric shock-like sensations, allodynia, and hyperalgesia.", difficulty: "medium" },
    { topicId: topicMap["Pain & Nociception"], question: "Which condition is characterized by widespread chronic pain without clear tissue damage, involving central sensitization?", options: JSON.stringify(["A) Acute appendicitis", "B) Osteoarthritis", "C) Fibromyalgia", "D) Sciatica"]), correctAnswer: "C", explanation: "Fibromyalgia is a chronic widespread pain condition characterized by central sensitization — amplified pain processing in the CNS without primary peripheral tissue damage.", difficulty: "medium" },

    // ===== NEUROGENETICS =====
    { topicId: topicMap["Neurogenetics"], question: "Huntington's disease is caused by:", options: JSON.stringify(["A) A deletion in the HTT gene", "B) Expanded CAG trinucleotide repeat in the HTT gene on chromosome 4", "C) A frameshift mutation causing protein truncation", "D) An X-linked recessive mutation"]), correctAnswer: "B", explanation: "Huntington's disease is caused by an expanded CAG repeat (>36 repeats) in the HTT gene on chromosome 4, encoding an abnormal polyglutamine huntingtin protein.", difficulty: "medium" },
    { topicId: topicMap["Neurogenetics"], question: "Anticipation in trinucleotide repeat disorders means:", options: JSON.stringify(["A) The disease appears earlier and more severely in successive generations", "B) The disease gets better in subsequent generations", "C) The repeat number decreases in next generations", "D) The disease phenotype disappears after 3 generations"]), correctAnswer: "A", explanation: "Genetic anticipation: trinucleotide repeats tend to expand during transmission (especially through germline), causing disease to appear at earlier ages and with greater severity in successive generations.", difficulty: "medium" },
    { topicId: topicMap["Neurogenetics"], question: "Fragile X syndrome is caused by:", options: JSON.stringify(["A) CAG repeat expansion in the HTT gene", "B) CGG repeat expansion in the FMR1 gene on the X chromosome", "C) CTG repeat expansion in the DMPK gene", "D) Deletion of chromosome 15q11"]), correctAnswer: "B", explanation: "Fragile X syndrome results from CGG repeat expansion in the 5' UTR of the FMR1 gene on the X chromosome (>200 repeats), silencing FMRP production; the most common inherited cause of intellectual disability.", difficulty: "medium" },
    { topicId: topicMap["Neurogenetics"], question: "Which mutation causes the most common form of early-onset familial Alzheimer's disease?", options: JSON.stringify(["A) APOE ε4 allele", "B) PSEN1 (presenilin-1) mutation", "C) APP duplication", "D) TREM2 mutation"]), correctAnswer: "B", explanation: "PSEN1 mutations are the most common cause of early-onset familial Alzheimer's disease; presenilin-1 is a component of the gamma-secretase complex that cleaves APP.", difficulty: "hard" },
    { topicId: topicMap["Neurogenetics"], question: "Neurofibromatosis type 1 (NF1) is caused by mutations in:", options: JSON.stringify(["A) BRCA1 on chromosome 17", "B) NF1 gene (neurofibromin) on chromosome 17", "C) TP53 on chromosome 17", "D) PTEN on chromosome 10"]), correctAnswer: "B", explanation: "NF1 is caused by mutations in the NF1 gene on chromosome 17, which encodes neurofibromin — a tumor suppressor/RAS-GTPase. Autosomal dominant with café-au-lait spots and neurofibromas.", difficulty: "medium" },
    { topicId: topicMap["Neurogenetics"], question: "Duchenne muscular dystrophy is inherited as:", options: JSON.stringify(["A) Autosomal dominant", "B) Autosomal recessive", "C) X-linked recessive", "D) Mitochondrial"]), correctAnswer: "C", explanation: "Duchenne MD is X-linked recessive; mutations in the dystrophin gene (Xp21) cause absence of dystrophin, leading to progressive muscle degeneration predominantly in males.", difficulty: "medium" },
    { topicId: topicMap["Neurogenetics"], question: "Rett syndrome, which primarily affects females, is caused by mutations in:", options: JSON.stringify(["A) HTT gene", "B) MECP2 gene on the X chromosome", "C) FMR1 gene", "D) NF1 gene"]), correctAnswer: "B", explanation: "Rett syndrome is caused by mutations in MECP2 (methyl-CpG binding protein 2) on the X chromosome; almost exclusively in females (males with MECP2 mutations die in infancy).", difficulty: "hard" },
    { topicId: topicMap["Neurogenetics"], question: "What is the mode of inheritance of Huntington's disease?", options: JSON.stringify(["A) Autosomal recessive", "B) X-linked dominant", "C) Autosomal dominant with complete penetrance", "D) Mitochondrial"]), correctAnswer: "C", explanation: "HD is autosomal dominant with complete penetrance; all individuals who inherit the expanded repeat (>36 CAG) will develop the disease if they live long enough.", difficulty: "easy" },
    { topicId: topicMap["Neurogenetics"], question: "Mitochondrial disorders affecting the nervous system are characterized by:", options: JSON.stringify(["A) Autosomal dominant inheritance", "B) Maternal inheritance, variable expression, and multi-system involvement", "C) X-linked recessive inheritance", "D) Sporadic occurrence only"]), correctAnswer: "B", explanation: "Mitochondrial genetic disorders follow maternal inheritance (mitochondria are maternally derived), show variable expression due to heteroplasmy, and typically affect high-energy tissues (muscle, brain, heart).", difficulty: "hard" },
    { topicId: topicMap["Neurogenetics"], question: "The APOE gene has three alleles (ε2, ε3, ε4). Which allele is PROTECTIVE against Alzheimer's disease?", options: JSON.stringify(["A) ε4", "B) ε3", "C) ε2", "D) All alleles carry equal risk"]), correctAnswer: "C", explanation: "APOE ε2 is associated with reduced risk of Alzheimer's disease (protective). ε3 is neutral. ε4 increases risk significantly.", difficulty: "hard" },

    // ===== PSYCHOPHARMACOLOGY =====
    { topicId: topicMap["Psychopharmacology"], question: "SSRIs primarily work by:", options: JSON.stringify(["A) Blocking MAO enzymes", "B) Blocking serotonin reuptake transporters (SERT)", "C) Activating postsynaptic 5-HT receptors directly", "D) Blocking dopamine receptors"]), correctAnswer: "B", explanation: "SSRIs (selective serotonin reuptake inhibitors) block SERT (the serotonin transporter), preventing serotonin reuptake and increasing its synaptic availability.", difficulty: "easy" },
    { topicId: topicMap["Psychopharmacology"], question: "Tardive dyskinesia is caused by:", options: JSON.stringify(["A) Acute extrapyramidal effects of antipsychotics", "B) Long-term dopamine receptor blockade leading to receptor supersensitivity", "C) Serotonin syndrome from antidepressant combinations", "D) Direct neurotoxicity of lithium"]), correctAnswer: "B", explanation: "Tardive dyskinesia results from chronic D2 blockade causing dopamine receptor upregulation/supersensitivity; manifests as involuntary orofacial and limb movements.", difficulty: "hard" },
    { topicId: topicMap["Psychopharmacology"], question: "Benzodiazepines enhance the effect of:", options: JSON.stringify(["A) Glutamate at NMDA receptors", "B) GABA at GABA-A receptors (increase Cl- influx frequency)", "C) Serotonin at 5-HT1A receptors", "D) Norepinephrine at alpha-1 receptors"]), correctAnswer: "B", explanation: "Benzodiazepines are positive allosteric modulators of GABA-A receptors; they increase the frequency of Cl- channel opening in response to GABA, enhancing inhibitory neurotransmission.", difficulty: "medium" },
    { topicId: topicMap["Psychopharmacology"], question: "Neuroleptic malignant syndrome (NMS) is characterized by:", options: JSON.stringify(["A) Hyperthermia, muscle rigidity, autonomic instability, and altered consciousness", "B) Diarrhea, tremor, and tachycardia", "C) Sedation and respiratory depression", "D) Agranulocytosis and neutropenia"]), correctAnswer: "A", explanation: "NMS is a life-threatening reaction to antipsychotics (dopamine blockade): hyperthermia, lead-pipe rigidity, autonomic instability, and altered consciousness. Requires immediate discontinuation and dantrolene.", difficulty: "hard" },
    { topicId: topicMap["Psychopharmacology"], question: "Lithium's therapeutic window is narrow. Toxicity signs include:", options: JSON.stringify(["A) Hypertension and tachycardia", "B) Coarse tremor, ataxia, confusion, and cardiac arrhythmias", "C) Sedation and respiratory depression", "D) Akathisia and dystonia"]), correctAnswer: "B", explanation: "Lithium toxicity (serum >1.5 mEq/L) manifests as coarse tremor, ataxia, confusion, polyuria, and cardiac arrhythmias; requires regular serum monitoring due to narrow therapeutic index.", difficulty: "hard" },
    { topicId: topicMap["Psychopharmacology"], question: "Which antidepressant mechanism carries the risk of hypertensive crisis with tyramine-rich foods?", options: JSON.stringify(["A) SSRIs", "B) TCAs", "C) MAOIs", "D) SNRIs"]), correctAnswer: "C", explanation: "MAOIs inhibit monoamine oxidase, which normally metabolizes tyramine in the gut. With MAOIs, ingested tyramine reaches the circulation and causes massive catecholamine release → hypertensive crisis.", difficulty: "medium" },
    { topicId: topicMap["Psychopharmacology"], question: "The mechanism of atypical antipsychotics (e.g., clozapine, olanzapine) differs from typical ones by:", options: JSON.stringify(["A) Higher D2 receptor affinity", "B) Blocking both D2 and 5-HT2A receptors; lower EPS risk", "C) Exclusively blocking serotonin receptors", "D) Enhancing dopamine release"]), correctAnswer: "B", explanation: "Atypical antipsychotics have combined D2 and 5-HT2A receptor antagonism; their lower D2 affinity (especially clozapine) and 5-HT2A blockade contribute to lower extrapyramidal side effects.", difficulty: "medium" },
    { topicId: topicMap["Psychopharmacology"], question: "Serotonin syndrome results from:", options: JSON.stringify(["A) Dopamine receptor blockade", "B) Excess serotonergic activity (combining multiple serotonergic drugs)", "C) Acetylcholine excess from AChE inhibition", "D) GABA deficiency"]), correctAnswer: "B", explanation: "Serotonin syndrome arises from excess serotonergic activity (e.g., MAOI + SSRI combination); presents with agitation, hyperthermia, myoclonus, clonus, and autonomic instability.", difficulty: "hard" },
    { topicId: topicMap["Psychopharmacology"], question: "Methylphenidate (Ritalin) treats ADHD by:", options: JSON.stringify(["A) Blocking dopamine and norepinephrine reuptake in prefrontal circuits", "B) Stimulating GABA receptors to calm hyperactivity", "C) Blocking serotonin receptors in the limbic system", "D) Increasing acetylcholine in the hippocampus"]), correctAnswer: "A", explanation: "Methylphenidate blocks dopamine and norepinephrine transporters, increasing catecholamine levels in prefrontal circuits, improving attention, working memory, and impulse control.", difficulty: "medium" },
    { topicId: topicMap["Psychopharmacology"], question: "Ketamine's rapid antidepressant effects are thought to be mediated by:", options: JSON.stringify(["A) Serotonin reuptake inhibition", "B) NMDA receptor antagonism and AMPA receptor potentiation", "C) Monoamine oxidase inhibition", "D) Direct opioid receptor activation"]), correctAnswer: "B", explanation: "Ketamine (NMDA antagonist) produces rapid (within hours) antidepressant effects; proposed mechanism involves NMDA blockade on inhibitory interneurons → disinhibition of glutamate → AMPA activation → BDNF release.", difficulty: "hard" },

    // ===== SLEEP & CIRCADIAN RHYTHMS =====
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "Which brain structure serves as the 'master circadian clock'?", options: JSON.stringify(["A) Pineal gland", "B) Suprachiasmatic nucleus (SCN) of the hypothalamus", "C) Hippocampus", "D) Locus coeruleus"]), correctAnswer: "B", explanation: "The SCN in the hypothalamus is the master circadian clock; it receives retinal light input and coordinates circadian rhythms throughout the body via hormonal and neural signals.", difficulty: "medium" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "Narcolepsy is caused by loss of which neurons?", options: JSON.stringify(["A) Dopaminergic neurons in the VTA", "B) Serotonergic neurons in the raphe", "C) Hypocretin/orexin neurons in the hypothalamus", "D) Noradrenergic neurons in the locus coeruleus"]), correctAnswer: "C", explanation: "Narcolepsy is caused by autoimmune loss of hypocretin (orexin)-producing neurons in the lateral hypothalamus; hypocretin promotes wakefulness and suppresses REM sleep.", difficulty: "hard" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "Which sleep stage is associated with dreaming and muscle atonia?", options: JSON.stringify(["A) N1 (light sleep)", "B) N2 (sleep spindles)", "C) N3 (slow-wave sleep)", "D) REM sleep"]), correctAnswer: "D", explanation: "REM sleep is characterized by rapid eye movements, dreaming, and active brainstem inhibition of motor neurons causing muscle atonia. Brain activity resembles wakefulness.", difficulty: "easy" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "Adenosine promotes sleep by:", options: JSON.stringify(["A) Activating arousal circuits in the brainstem", "B) Accumulating during waking and inhibiting arousal neurons", "C) Stimulating melatonin secretion directly", "D) Activating NMDA receptors"]), correctAnswer: "B", explanation: "Adenosine accumulates in the brain during wakefulness, creating homeostatic sleep pressure by inhibiting wake-promoting neurons (especially in the basal forebrain and locus coeruleus).", difficulty: "medium" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "Slow-wave sleep (N3) is characterized by:", options: JSON.stringify(["A) Rapid eye movements and muscle atonia", "B) High-amplitude, low-frequency (delta) EEG waves", "C) Sleep spindles and K-complexes", "D) Alpha waves"]), correctAnswer: "B", explanation: "N3 (slow-wave sleep, deep sleep) is characterized by high-amplitude delta waves (<4 Hz) on EEG; it is the most restorative sleep stage and is involved in memory consolidation.", difficulty: "medium" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "REM sleep behavior disorder (RBD) is a risk marker for:", options: JSON.stringify(["A) Alzheimer's disease", "B) Parkinson's disease and Lewy body dementia", "C) Multiple sclerosis", "D) Frontotemporal dementia"]), correctAnswer: "B", explanation: "RBD (loss of REM muscle atonia causing physical dream enactment) is strongly predictive of Parkinson's disease and Lewy body dementia, often appearing years before motor symptoms.", difficulty: "hard" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "The two-process model of sleep regulation refers to:", options: JSON.stringify(["A) Two stages of REM sleep", "B) The interaction of circadian (Process C) and homeostatic (Process S) drives", "C) Two types of insomnia", "D) REM and NREM alternation"]), correctAnswer: "B", explanation: "Borbély's two-process model: Process S (sleep homeostasis — adenosine buildup during wakefulness) and Process C (circadian timing from SCN) interact to determine sleep onset, duration, and depth.", difficulty: "hard" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "Obstructive sleep apnea (OSA) is most strongly associated with:", options: JSON.stringify(["A) Iron deficiency", "B) Obesity and upper airway obstruction during sleep", "C) Narcolepsy", "D) Circadian rhythm disruption only"]), correctAnswer: "B", explanation: "OSA is caused by upper airway collapse during sleep, most commonly associated with obesity, large neck circumference, and anatomical airway narrowing; treated with CPAP.", difficulty: "medium" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "During which sleep stage does the majority of growth hormone release occur?", options: JSON.stringify(["A) REM sleep", "B) N1 light sleep", "C) N3 slow-wave (deep) sleep", "D) During wakefulness only"]), correctAnswer: "C", explanation: "Growth hormone is predominantly secreted during slow-wave (N3) sleep, which is why disrupted deep sleep in children may affect growth and why sleep deprivation impairs recovery and anabolism.", difficulty: "medium" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "Melatonin is secreted by the pineal gland in response to:", options: JSON.stringify(["A) Bright light exposure", "B) Darkness (absence of light)", "C) Exercise", "D) Cortisol release"]), correctAnswer: "B", explanation: "Melatonin is secreted by the pineal gland in response to darkness, signaled via the retino-hypothalamic tract → SCN → superior cervical ganglion → pineal gland pathway.", difficulty: "easy" },

    // ===== PSYCHOPATHOLOGY =====
    { topicId: topicMap["Psychopathology"], question: "The dopamine hypothesis of schizophrenia proposes that positive symptoms are caused by:", options: JSON.stringify(["A) Reduced dopamine in the prefrontal cortex", "B) Excess dopaminergic activity in the mesolimbic pathway", "C) Excess serotonin throughout the brain", "D) Glutamate excess in the striatum"]), correctAnswer: "B", explanation: "The dopamine hypothesis proposes excess D2 receptor activation in the mesolimbic pathway causes positive symptoms (hallucinations, delusions); reduced dopamine in mesocortical pathway relates to negative/cognitive symptoms.", difficulty: "hard" },
    { topicId: topicMap["Psychopathology"], question: "Which of the following are NEGATIVE symptoms of schizophrenia?", options: JSON.stringify(["A) Hallucinations and delusions", "B) Disorganized thinking and speech", "C) Flat affect, alogia, avolition, anhedonia", "D) Agitation and aggression"]), correctAnswer: "C", explanation: "Negative symptoms of schizophrenia are reductions of normal functions: flat/blunted affect, alogia (poverty of speech), avolition (lack of motivation), anhedonia (inability to feel pleasure).", difficulty: "medium" },
    { topicId: topicMap["Psychopathology"], question: "The neural basis of PTSD involves:", options: JSON.stringify(["A) Reduced amygdala reactivity and prefrontal hyperactivity", "B) Amygdala hyperactivation, hippocampal atrophy, and reduced vmPFC regulation", "C) Dopaminergic excess in the mesolimbic system", "D) Cholinergic deficiency in the basal forebrain"]), correctAnswer: "B", explanation: "PTSD involves amygdala hyperreactivity to threat, reduced hippocampal volume (affecting contextual memory), and impaired vmPFC regulation of fear extinction.", difficulty: "hard" },
    { topicId: topicMap["Psychopathology"], question: "Major depressive disorder (MDD) requires at least how long of a symptomatic period?", options: JSON.stringify(["A) 1 week", "B) 2 weeks", "C) 1 month", "D) 6 months"]), correctAnswer: "B", explanation: "DSM-5 requires at least 2 weeks of depressed mood and/or anhedonia, plus four or more additional symptoms (from sleep, appetite, concentration, energy, guilt, psychomotor, suicidality).", difficulty: "easy" },
    { topicId: topicMap["Psychopathology"], question: "The monoamine hypothesis of depression suggests that depression involves:", options: JSON.stringify(["A) Excess serotonin and norepinephrine", "B) Deficient serotonin and/or norepinephrine neurotransmission", "C) Excess dopamine in the prefrontal cortex", "D) Glutamate excess in the hippocampus"]), correctAnswer: "B", explanation: "The monoamine hypothesis proposes depression results from deficient serotonin, norepinephrine, and/or dopamine; basis for antidepressants that increase these transmitters.", difficulty: "medium" },
    { topicId: topicMap["Psychopathology"], question: "Bipolar I disorder requires:", options: JSON.stringify(["A) Only depressive episodes", "B) At least one manic episode", "C) Both hypomanic and major depressive episodes", "D) Psychotic features in all episodes"]), correctAnswer: "B", explanation: "Bipolar I disorder requires at least one manic episode (elevated/irritable mood, increased energy, lasting ≥7 days or requiring hospitalization); depressive episodes are common but not required.", difficulty: "medium" },
    { topicId: topicMap["Psychopathology"], question: "The fear circuit involved in anxiety and PTSD primarily includes:", options: JSON.stringify(["A) Basal ganglia and thalamus", "B) Amygdala, hippocampus, and prefrontal cortex", "C) Cerebellum and motor cortex", "D) Visual cortex and parietal lobe"]), correctAnswer: "B", explanation: "The fear circuit involves: amygdala (threat detection), hippocampus (contextual fear memory), and prefrontal cortex (fear regulation and extinction). Disruption of this circuit underlies anxiety disorders and PTSD.", difficulty: "hard" },
    { topicId: topicMap["Psychopathology"], question: "Anhedonia refers to:", options: JSON.stringify(["A) Excessive pleasure-seeking", "B) Inability to experience pleasure from normally enjoyable activities", "C) Intense emotional sensitivity", "D) Social withdrawal without mood changes"]), correctAnswer: "B", explanation: "Anhedonia (literally 'without pleasure') is the loss of interest in or inability to experience pleasure from previously enjoyable activities; a core symptom of depression and negative symptom of schizophrenia.", difficulty: "medium" },
    { topicId: topicMap["Psychopathology"], question: "Generalized anxiety disorder (GAD) is characterized by:", options: JSON.stringify(["A) Discrete panic attacks with sudden onset", "B) Excessive worry about multiple areas of life for ≥6 months", "C) Fear limited to specific phobic stimuli", "D) Social anxiety only in performance situations"]), correctAnswer: "B", explanation: "GAD is characterized by excessive, difficult-to-control worry about multiple life domains (work, health, family) for at least 6 months, with physical symptoms (muscle tension, sleep disturbance, fatigue).", difficulty: "medium" },
    { topicId: topicMap["Psychopathology"], question: "Which neurotransmitter system is targeted by antipsychotic medications?", options: JSON.stringify(["A) Serotonin system exclusively", "B) Dopamine system (primarily D2 receptor blockade)", "C) GABA system", "D) Opioid system"]), correctAnswer: "B", explanation: "All currently approved antipsychotics (typical and atypical) block dopamine D2 receptors; this is considered the primary mechanism for reducing positive symptoms of schizophrenia.", difficulty: "medium" },

    // ===== VISUAL SYSTEM =====
    { topicId: topicMap["Visual System"], question: "A lesion at the optic chiasm causes:", options: JSON.stringify(["A) Monocular blindness", "B) Bitemporal hemianopia", "C) Homonymous hemianopia", "D) Quadrantanopia"]), correctAnswer: "B", explanation: "The optic chiasm contains crossing nasal fibers from both eyes. Chiasm damage (e.g., pituitary tumor) interrupts these crossed fibers, causing loss of both temporal fields (bitemporal hemianopia).", difficulty: "hard" },
    { topicId: topicMap["Visual System"], question: "The primary visual cortex (V1) receives input from the:", options: JSON.stringify(["A) Superior colliculus", "B) Lateral geniculate nucleus (LGN) of the thalamus", "C) Optic chiasm directly", "D) Inferior temporal cortex"]), correctAnswer: "B", explanation: "V1 receives its main input from the LGN (lateral geniculate nucleus) of the thalamus via the optic radiations (geniculocalcarine tract).", difficulty: "medium" },
    { topicId: topicMap["Visual System"], question: "The ventral visual stream ('what pathway') projects to:", options: JSON.stringify(["A) Posterior parietal cortex for spatial processing", "B) Inferior temporal cortex for object/face recognition", "C) Primary motor cortex for visuomotor control", "D) Prefrontal cortex for attention"]), correctAnswer: "B", explanation: "The ventral stream (V1 → V4 → inferior temporal cortex) processes object identity, color, and face recognition — the 'what' pathway.", difficulty: "medium" },
    { topicId: topicMap["Visual System"], question: "Damage to the right homonymous visual cortex causes:", options: JSON.stringify(["A) Blindness in the right eye", "B) Left homonymous hemianopia", "C) Right homonymous hemianopia", "D) Bitemporal hemianopia"]), correctAnswer: "B", explanation: "The right occipital cortex represents the left visual field of both eyes. Damage causes left homonymous hemianopia (loss of the left half of the visual field in both eyes).", difficulty: "medium" },
    { topicId: topicMap["Visual System"], question: "Prosopagnosia is defined as:", options: JSON.stringify(["A) Inability to name objects", "B) Inability to recognize familiar faces despite intact vision", "C) Loss of color vision", "D) Double vision"]), correctAnswer: "B", explanation: "Prosopagnosia ('face blindness') is the selective inability to recognize familiar faces; caused by damage to the fusiform face area in the right fusiform gyrus.", difficulty: "hard" },
    { topicId: topicMap["Visual System"], question: "Color vision is primarily processed by:", options: JSON.stringify(["A) Rod photoreceptors in the peripheral retina", "B) Cone photoreceptors in the central fovea", "C) The superior colliculus", "D) The dorsal visual stream"]), correctAnswer: "B", explanation: "Color vision depends on the three types of cone photoreceptors (S, M, L) concentrated in the fovea; processed in area V4 of the ventral stream.", difficulty: "easy" },
    { topicId: topicMap["Visual System"], question: "Retinotopic mapping means:", options: JSON.stringify(["A) The retina maps onto the cornea", "B) Adjacent retinal regions project to adjacent cortical regions throughout the visual system", "C) The visual cortex is randomly organized", "D) Each eye has its own separate cortical area"]), correctAnswer: "B", explanation: "Retinotopic (visuotopic) mapping means the spatial arrangement of retinal photoreceptors is preserved throughout the visual pathway, with adjacent retinal points projecting to adjacent cortical points.", difficulty: "medium" },
    { topicId: topicMap["Visual System"], question: "The optic radiations carry visual information from the LGN to V1. A lesion in the lower optic radiations (Meyer's loop) causes:", options: JSON.stringify(["A) Contralateral lower quadrantanopia", "B) Contralateral upper quadrantanopia (contralateral superior quadrant loss)", "C) Bitemporal hemianopia", "D) Monocular blindness"]), correctAnswer: "B", explanation: "Meyer's loop carries fibers representing the superior visual field; its damage (e.g., temporal lobe surgery) causes a 'pie in the sky' — contralateral superior quadrantanopia.", difficulty: "hard" },
    { topicId: topicMap["Visual System"], question: "What do rods detect compared to cones?", options: JSON.stringify(["A) Color at high acuity; cones detect motion", "B) Low-light, black-and-white, peripheral vision; cones detect color and fine detail in bright light", "C) Rods and cones detect the same information", "D) Rods detect far vision; cones detect near vision"]), correctAnswer: "B", explanation: "Rods are sensitive to dim light, detect motion, and mediate peripheral (scotopic) vision without color discrimination. Cones require bright light, detect color (three types for RGB), and mediate central high-acuity (photopic) vision.", difficulty: "easy" },
    { topicId: topicMap["Visual System"], question: "Left homonymous hemianopia with macular sparing most likely indicates:", options: JSON.stringify(["A) Left occipital lobe lesion", "B) Right optic nerve lesion", "C) Right occipital lobe lesion with preserved tip (macular cortex has dual blood supply)", "D) Optic chiasm lesion"]), correctAnswer: "C", explanation: "Left homonymous hemianopia with macular (central vision) sparing suggests a right occipital lesion that spares the posterior occipital tip, which has dual (MCA and PCA) blood supply and represents the fovea/macula.", difficulty: "hard" },

    // ===== AUDITORY SYSTEM =====
    { topicId: topicMap["Auditory System"], question: "Tonotopy in the cochlea means:", options: JSON.stringify(["A) Tonotopy refers to the number of hair cells", "B) Different sound frequencies are processed at different locations along the basilar membrane", "C) Both ears process the same frequencies", "D) High frequencies are processed at the apex"]), correctAnswer: "B", explanation: "Tonotopy: the basilar membrane is frequency-tuned, with high frequencies at the basal end (stiff, narrow) and low frequencies at the apical end (flexible, wide).", difficulty: "medium" },
    { topicId: topicMap["Auditory System"], question: "The primary auditory cortex (A1) is located in:", options: JSON.stringify(["A) The occipital lobe", "B) The parietal lobe", "C) Heschl's gyrus in the superior temporal plane", "D) The prefrontal cortex"]), correctAnswer: "C", explanation: "The primary auditory cortex (A1, Brodmann areas 41-42) is located in Heschl's gyrus (transverse temporal gyri) in the superior temporal plane within the Sylvian fissure.", difficulty: "medium" },
    { topicId: topicMap["Auditory System"], question: "The main difference between conductive and sensorineural hearing loss:", options: JSON.stringify(["A) Conductive involves cochlear damage; sensorineural involves middle ear damage", "B) Conductive: problem transmitting sound through outer/middle ear; sensorineural: cochlear/auditory nerve damage", "C) They cannot be distinguished clinically", "D) Conductive is always permanent; sensorineural is always reversible"]), correctAnswer: "B", explanation: "Conductive hearing loss: mechanical transmission problem in outer/middle ear (otitis media, cerumen, ossicular damage). Sensorineural: cochlear hair cell damage or auditory nerve pathology.", difficulty: "medium" },
    { topicId: topicMap["Auditory System"], question: "Sound localization (azimuth) is processed in the:", options: JSON.stringify(["A) Cochlea", "B) Superior olivary complex using interaural time and level differences", "C) Primary auditory cortex only", "D) Thalamus"]), correctAnswer: "B", explanation: "The superior olivary complex is the first site of binaural (both ears) processing; it detects interaural time differences (ITD) and interaural level differences (ILD) for horizontal sound localization.", difficulty: "hard" },
    { topicId: topicMap["Auditory System"], question: "Tinnitus (ringing in the ears) is associated with:", options: JSON.stringify(["A) Excess hair cell activity in the cochlea causing perceived sound", "B) Cochlear damage leading to cortical reorganization and phantom auditory perception", "C) Auditory cortex hyperactivity from too much hearing", "D) Vestibular dysfunction only"]), correctAnswer: "B", explanation: "Tinnitus often follows cochlear damage; loss of peripheral input leads to cortical reorganization and spontaneous/synchronized firing in the auditory cortex perceived as sound.", difficulty: "medium" },
    { topicId: topicMap["Auditory System"], question: "Which cranial nerve carries auditory information from the cochlea to the brain?", options: JSON.stringify(["A) CN VII (facial)", "B) CN V (trigeminal)", "C) CN VIII (vestibulocochlear)", "D) CN IX (glossopharyngeal)"]), correctAnswer: "C", explanation: "CN VIII (the vestibulocochlear nerve) has two divisions: the cochlear branch (carrying auditory information) and the vestibular branch (carrying balance/head movement information).", difficulty: "easy" },
    { topicId: topicMap["Auditory System"], question: "The auditory pathway ascends from the cochlea to the cortex via:", options: JSON.stringify(["A) Cochlea → thalamus → cortex directly", "B) Cochlea → cochlear nuclei → superior olive → inferior colliculus → MGN → A1", "C) Cochlea → cerebellum → cortex", "D) Cochlea → hippocampus → frontal cortex"]), correctAnswer: "B", explanation: "The ascending auditory pathway: cochlea → cochlear nuclei (medulla) → superior olivary complex → lateral lemniscus → inferior colliculus (midbrain) → medial geniculate nucleus (thalamus) → primary auditory cortex.", difficulty: "hard" },
    { topicId: topicMap["Auditory System"], question: "What is pure word deafness?", options: JSON.stringify(["A) Deafness in one ear only", "B) Inability to understand spoken words despite normal hearing and intact reading/speech", "C) Loss of all auditory perception", "D) Inability to hear pure tones"]), correctAnswer: "B", explanation: "Pure word deafness is inability to comprehend spoken language despite normal hearing, normal reading, and intact speech production; results from bilateral or disconnection lesions of auditory cortex.", difficulty: "hard" },
    { topicId: topicMap["Auditory System"], question: "Otoacoustic emissions (OAEs) reflect the function of:", options: JSON.stringify(["A) Inner hair cells", "B) Outer hair cells (and their mechanical amplification)", "C) The auditory nerve", "D) The cochlear nucleus"]), correctAnswer: "B", explanation: "OAEs are sounds generated by outer hair cells due to their motility (electromotility from prestin protein); they amplify basilar membrane vibration. OAEs are absent when outer hair cells are damaged.", difficulty: "hard" },
    { topicId: topicMap["Auditory System"], question: "Central auditory processing disorder (CAPD) is best described as:", options: JSON.stringify(["A) Hearing loss from cochlear damage", "B) Difficulty processing and interpreting auditory information in the CNS despite normal peripheral hearing", "C) Tinnitus caused by central pathology", "D) Inability to produce speech sounds"]), correctAnswer: "B", explanation: "CAPD involves difficulty understanding/interpreting auditory information at the central level (auditory cortex, brainstem) despite normal cochlear and peripheral auditory function.", difficulty: "hard" },

    // ===== SOMATOSENSORY & TOUCH =====
    { topicId: topicMap["Somatosensory & Touch"], question: "Which mechanoreceptor detects light touch and texture in glabrous skin?", options: JSON.stringify(["A) Pacinian corpuscles", "B) Meissner's corpuscles", "C) Merkel's discs", "D) Ruffini endings"]), correctAnswer: "B", explanation: "Meissner's corpuscles are rapidly adapting mechanoreceptors in glabrous (hairless) skin, particularly at fingertips, specialized for detecting light touch and surface texture.", difficulty: "medium" },
    { topicId: topicMap["Somatosensory & Touch"], question: "Astereognosis refers to:", options: JSON.stringify(["A) Loss of all somatosensory sensation", "B) Inability to identify objects by touch alone despite intact sensation", "C) Loss of pain sensation", "D) Inability to sense vibration"]), correctAnswer: "B", explanation: "Astereognosis is the inability to identify objects by touch with intact basic sensation; it results from parietal lobe damage (higher-level tactile agnosia) rather than primary sensory loss.", difficulty: "hard" },
    { topicId: topicMap["Somatosensory & Touch"], question: "The primary somatosensory cortex (S1) is located in:", options: JSON.stringify(["A) Precentral gyrus", "B) Superior temporal gyrus", "C) Postcentral gyrus", "D) Inferior frontal gyrus"]), correctAnswer: "C", explanation: "S1 occupies the postcentral gyrus (Brodmann areas 1, 2, 3), immediately posterior to the central sulcus. It processes touch, pressure, temperature, and proprioception from the contralateral body.", difficulty: "easy" },
    { topicId: topicMap["Somatosensory & Touch"], question: "Proprioception is primarily mediated by:", options: JSON.stringify(["A) Meissner's corpuscles in the skin", "B) Muscle spindles (Ia and II afferents) and Golgi tendon organs (Ib afferents)", "C) Pacinian corpuscles detecting joint vibration", "D) Free nerve endings detecting limb position"]), correctAnswer: "B", explanation: "Proprioception (sense of joint position and movement) is mediated primarily by muscle spindles (detect muscle length and velocity) and Golgi tendon organs (detect muscle force/tension).", difficulty: "medium" },
    { topicId: topicMap["Somatosensory & Touch"], question: "The cortical magnification factor in somatosensory cortex explains why:", options: JSON.stringify(["A) Larger body parts have more cortical representation", "B) Highly innervated areas (fingers, lips) have disproportionately large cortical representation", "C) All body parts have equal cortical representation", "D) Motor cortex is larger than sensory cortex"]), correctAnswer: "B", explanation: "Cortical magnification means that body areas with high tactile acuity and dense innervation (fingertips, lips, tongue) are represented by disproportionately large areas of somatosensory cortex.", difficulty: "medium" },
    { topicId: topicMap["Somatosensory & Touch"], question: "Two-point discrimination is poorest on:", options: JSON.stringify(["A) Fingertips", "B) Lips", "C) Back of the trunk", "D) Palm of the hand"]), correctAnswer: "C", explanation: "The back of the trunk has the poorest two-point discrimination (~70mm) because of sparse receptor density and small somatosensory cortical representation, unlike fingertips (~2mm) or lips.", difficulty: "medium" },
    { topicId: topicMap["Somatosensory & Touch"], question: "Slowly adapting mechanoreceptors that detect sustained pressure and fine spatial detail include:", options: JSON.stringify(["A) Meissner's corpuscles", "B) Pacinian corpuscles", "C) Merkel's discs", "D) Free nerve endings"]), correctAnswer: "C", explanation: "Merkel's discs (SA-I) are slowly adapting mechanoreceptors with small receptive fields that detect sustained pressure and fine spatial detail; important for texture discrimination and Braille reading.", difficulty: "medium" },
    { topicId: topicMap["Somatosensory & Touch"], question: "Vibration sense travels primarily via which spinal pathway?", options: JSON.stringify(["A) Spinothalamic tract", "B) Dorsal column–medial lemniscal pathway", "C) Spinocerebellar tract", "D) Corticospinal tract"]), correctAnswer: "B", explanation: "Vibration (and fine touch, proprioception) travels via the dorsal column–medial lemniscal pathway: enters dorsal columns, ascends ipsilaterally, crosses in medulla, reaches contralateral VPL thalamus → S1.", difficulty: "medium" },
    { topicId: topicMap["Somatosensory & Touch"], question: "The secondary somatosensory cortex (S2/parietal operculum) is involved in:", options: JSON.stringify(["A) Primary detection of touch", "B) Processing pain, temperature, and tactile learning; bilateral representation", "C) Only motor planning", "D) Visual-tactile integration only"]), correctAnswer: "B", explanation: "S2 (parietal operculum, insula) processes pain, temperature, and discriminative touch bilaterally; plays a role in tactile learning and memory, and is activated by both painful and non-painful stimuli.", difficulty: "hard" },
    { topicId: topicMap["Somatosensory & Touch"], question: "Loss of vibration sense and proprioception in the legs with preserved pain/temperature suggests:", options: JSON.stringify(["A) Spinothalamic tract lesion", "B) Dorsal column lesion (e.g., B12 deficiency, tabes dorsalis)", "C) Anterior horn cell disease", "D) Pyramidal tract lesion"]), correctAnswer: "B", explanation: "Selective loss of vibration and proprioception with preserved pain/temperature indicates dorsal column pathology; classic causes include B12 deficiency (subacute combined degeneration) and tabes dorsalis (syphilis).", difficulty: "hard" },

    // ===== CHEMICAL SENSES =====
    { topicId: topicMap["Chemical Senses"], question: "Anosmia (loss of smell) following head trauma is most commonly due to:", options: JSON.stringify(["A) Cortical damage to the orbitofrontal cortex", "B) Shearing of olfactory nerve filaments at the cribriform plate", "C) Damage to the olfactory bulb neurons directly", "D) Thalamic relay nucleus damage"]), correctAnswer: "B", explanation: "Head trauma can shear the olfactory nerve (CN I) filaments as they pass through the cribriform plate of the ethmoid bone, causing post-traumatic anosmia.", difficulty: "medium" },
    { topicId: topicMap["Chemical Senses"], question: "Olfaction differs from other senses in that it:", options: JSON.stringify(["A) Does not have any cortical representation", "B) Has a direct connection to the limbic system without first relaying through the thalamus", "C) Uses the same receptors as taste", "D) Is processed exclusively in the right hemisphere"]), correctAnswer: "B", explanation: "Olfactory signals travel directly to primary olfactory cortex (piriform cortex/amygdala) without first passing through the thalamus — unique among all sensory modalities.", difficulty: "hard" },
    { topicId: topicMap["Chemical Senses"], question: "The five basic tastes detected by taste receptors are:", options: JSON.stringify(["A) Sweet, salty, sour, bitter, spicy", "B) Sweet, salty, sour, bitter, umami", "C) Sweet, salty, sour, umami, metallic", "D) Sweet, salty, sour, bitter, astringent"]), correctAnswer: "B", explanation: "The five primary taste qualities are: sweet, salty, sour, bitter, and umami (savory/glutamate). These are detected by specialized taste receptor cells in taste buds.", difficulty: "easy" },
    { topicId: topicMap["Chemical Senses"], question: "Taste information from the anterior 2/3 of the tongue is carried by:", options: JSON.stringify(["A) CN IX (glossopharyngeal)", "B) CN VII (facial nerve, chorda tympani branch)", "C) CN X (vagus)", "D) CN V (trigeminal)"]), correctAnswer: "B", explanation: "The chorda tympani branch of CN VII carries taste from the anterior 2/3 of the tongue. CN IX carries taste from the posterior 1/3, and CN X from the epiglottis.", difficulty: "hard" },
    { topicId: topicMap["Chemical Senses"], question: "Early loss of olfactory function in Parkinson's disease is thought to be due to:", options: JSON.stringify(["A) Early damage to the olfactory epithelium", "B) Alpha-synuclein pathology beginning in olfactory bulb and anterior olfactory nucleus", "C) Dopaminergic depletion affecting olfactory perception", "D) Side effects of dopaminergic medication"]), correctAnswer: "B", explanation: "Braak staging of PD pathology shows alpha-synuclein (Lewy body) pathology beginning in the olfactory bulb and dorsal motor nucleus (stage 1-2) before spreading to substantia nigra; explaining early anosmia.", difficulty: "hard" },
    { topicId: topicMap["Chemical Senses"], question: "Phantosmia (phantom odors) can be a symptom of:", options: JSON.stringify(["A) Complete anosmia", "B) Temporal lobe epilepsy (olfactory aura)", "C) Cerebellar dysfunction", "D) Thalamic lesions"]), correctAnswer: "B", explanation: "Phantosmia (perceiving odors without external stimulus) can be an olfactory hallucination/aura in temporal lobe epilepsy (especially uncal seizures), as well as migraines and certain psychiatric conditions.", difficulty: "medium" },
    { topicId: topicMap["Chemical Senses"], question: "Taste buds are located on which structures of the tongue?", options: JSON.stringify(["A) On the taste pores only at the tongue tip", "B) Fungiform, circumvallate, and foliate papillae", "C) The entire tongue surface uniformly", "D) Only on the soft palate"]), correctAnswer: "B", explanation: "Taste buds are found in papillae: fungiform (scattered on anterior tongue), circumvallate (row at tongue base), and foliate (lateral tongue folds). Each bud contains 50-100 taste receptor cells.", difficulty: "medium" },
    { topicId: topicMap["Chemical Senses"], question: "All taste pathways eventually converge on which brainstem nucleus?", options: JSON.stringify(["A) Spinal trigeminal nucleus", "B) Nucleus tractus solitarius (NTS) in the medulla", "C) Lateral geniculate nucleus", "D) Parabrachial nucleus of the pons only"]), correctAnswer: "B", explanation: "All taste afferents (CN VII, IX, X) converge on the rostral part of the nucleus tractus solitarius (NTS) in the medulla for initial central taste processing.", difficulty: "hard" },
    { topicId: topicMap["Chemical Senses"], question: "The orbitofrontal cortex role in chemical senses is:", options: JSON.stringify(["A) Primary detection of odors and tastes", "B) Integration of olfactory and gustatory signals to create flavor perception and food reward", "C) Regulation of sympathetic responses to tastes", "D) Processing painful oral stimuli only"]), correctAnswer: "B", explanation: "The orbitofrontal cortex integrates olfactory and gustatory inputs, creating the perception of complex flavors (flavor = taste + smell + texture) and encoding food reward/palatability.", difficulty: "hard" },
    { topicId: topicMap["Chemical Senses"], question: "Parosmia is defined as:", options: JSON.stringify(["A) Complete absence of smell", "B) Perception of odors without any odor source", "C) Distorted perception where familiar odors smell different or unpleasant", "D) Hypersensitivity to all odors"]), correctAnswer: "C", explanation: "Parosmia is a distortion of smell where familiar odors are perceived differently, often unpleasantly (e.g., coffee smells like rotting garbage); common during recovery from COVID-19 or other anosmia.", difficulty: "medium" },

    // ===== VESTIBULAR SYSTEM =====
    { topicId: topicMap["Vestibular System"], question: "The semicircular canals detect:", options: JSON.stringify(["A) Linear acceleration (gravitational forces)", "B) Angular (rotational) acceleration of the head", "C) Sound vibrations", "D) Proprioception from neck muscles"]), correctAnswer: "B", explanation: "The three semicircular canals (anterior, posterior, lateral) detect angular/rotational acceleration of the head via deflection of cupula and stereocilia by endolymph movement.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "BPPV (benign paroxysmal positional vertigo) is treated with:", options: JSON.stringify(["A) Antibiotics", "B) The Epley canalith repositioning maneuver", "C) Vestibular suppressants only", "D) Surgical labyrinthectomy"]), correctAnswer: "B", explanation: "BPPV (displaced otoconia/canalith in the posterior semicircular canal) is treated with the Epley maneuver — a series of head positions to reposition the canalith back into the utricle.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "The utricle detects:", options: JSON.stringify(["A) Angular acceleration only", "B) Horizontal linear acceleration and static head tilt (gravity)", "C) Vertical linear acceleration only", "D) Sound frequencies"]), correctAnswer: "B", explanation: "The utricle (with horizontal macula) detects horizontal linear acceleration and static head tilt (through gravity's effect on otolith membrane and stereocilia).", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "The vestibulo-ocular reflex (VOR) functions to:", options: JSON.stringify(["A) Stabilize gaze during head movement by generating compensatory eye movements", "B) Detect changes in light intensity", "C) Coordinate eye movements with facial expression", "D) Enable the optokinetic reflex"]), correctAnswer: "A", explanation: "The VOR stabilizes visual gaze during head movement; head movement detected by semicircular canals → compensatory eye movement in opposite direction → stabilized image on retina.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "Menière's disease is caused by:", options: JSON.stringify(["A) Bacterial infection of the vestibular nerve", "B) Endolymphatic hydrops (excess endolymph in the membranous labyrinth)", "C) Displaced otoconia from the utricle", "D) Viral neuritis of CN VIII"]), correctAnswer: "B", explanation: "Menière's disease is caused by endolymphatic hydrops (abnormal buildup of endolymph in the inner ear), disrupting ion homeostasis and causing episodic vertigo, hearing loss, tinnitus, and aural fullness.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "Which finding distinguishes CENTRAL vertigo from PERIPHERAL vertigo?", options: JSON.stringify(["A) Presence of nausea in central vertigo only", "B) Direction-changing nystagmus and associated neurological signs in central vertigo", "C) Severity of vertigo (central is always worse)", "D) Presence of tinnitus in central vertigo only"]), correctAnswer: "B", explanation: "Central vertigo (e.g., cerebellar/brainstem stroke): direction-changing nystagmus, not suppressed by fixation, neurological signs, HINTS exam positive. Peripheral: unidirectional, suppressed by fixation, no neurological signs.", difficulty: "hard" },
    { topicId: topicMap["Vestibular System"], question: "Vestibular neuritis is characterized by:", options: JSON.stringify(["A) Sudden hearing loss with gradual vertigo onset", "B) Severe prolonged vertigo without hearing loss, usually following viral illness", "C) Brief positional vertigo triggered by head movements", "D) Progressive unilateral hearing loss and balance problems"]), correctAnswer: "B", explanation: "Vestibular neuritis: viral inflammation of the vestibular nerve causing severe, constant vertigo for days-weeks without associated hearing loss; typically follows an upper respiratory infection.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "The HINTS exam for acute vestibular syndrome includes:", options: JSON.stringify(["A) Hearing test, Imaging, Nystagmus, Temperature test, Stability", "B) Head Impulse test, Nystagmus pattern, Test of Skew (skew deviation)", "C) Hallpike, Imaging, Nystagmus, Treatment, Stability", "D) Head position, Inspection, Nystagmus, Temperature, Sound"]), correctAnswer: "B", explanation: "HINTS exam: (1) Head Impulse test — normal = central; (2) Nystagmus — direction-changing = central; (3) Test of skew — skew deviation = central. A central HINTS predicts stroke > MRI in acute setting.", difficulty: "hard" },
    { topicId: topicMap["Vestibular System"], question: "The saccule is primarily responsible for detecting:", options: JSON.stringify(["A) Horizontal linear acceleration", "B) Rotational acceleration", "C) Vertical linear acceleration and gravity", "D) Sound vibrations in the inner ear"]), correctAnswer: "C", explanation: "The saccule (with vertical macula) detects vertical linear acceleration (e.g., elevator movement) and the pull of gravity on the body.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "CN VIII exits the brainstem at which level?", options: JSON.stringify(["A) Midbrain", "B) Pons-medulla junction", "C) Upper medulla", "D) Lower medulla"]), correctAnswer: "B", explanation: "CN VIII (vestibulocochlear nerve) exits the brainstem at the cerebellopontine angle (pontomedullary junction), enters the internal auditory meatus alongside CN VII.", difficulty: "medium" },

    // ===== MOTOR CONTROL =====
    { topicId: topicMap["Motor Control"], question: "The motor unit is defined as:", options: JSON.stringify(["A) A group of motor neurons innervating one muscle", "B) A single motor neuron and all muscle fibers it innervates", "C) The minimum force generated by a muscle", "D) The motor cortex representation of one limb"]), correctAnswer: "B", explanation: "A motor unit consists of one alpha motor neuron and all the skeletal muscle fibers it innervates — the fundamental unit of motor control.", difficulty: "easy" },
    { topicId: topicMap["Motor Control"], question: "The primary motor cortex is located in:", options: JSON.stringify(["A) Postcentral gyrus", "B) Precentral gyrus (Brodmann area 4)", "C) Superior frontal gyrus", "D) Supplementary motor area"]), correctAnswer: "B", explanation: "The primary motor cortex (M1) is in the precentral gyrus (BA 4), immediately anterior to the central sulcus; it contains Betz cells whose axons form the lateral corticospinal tract.", difficulty: "easy" },
    { topicId: topicMap["Motor Control"], question: "The Henneman size principle states that motor units are recruited:", options: JSON.stringify(["A) Largest first (high-threshold units), then small units", "B) Smallest first (low-threshold, slow-twitch), then progressively larger as force demand increases", "C) Randomly depending on the task", "D) All at once for any voluntary movement"]), correctAnswer: "B", explanation: "Henneman's size principle: smaller, slow-twitch, fatigue-resistant motor units are recruited first; larger, fast-twitch units are added as force requirements increase.", difficulty: "medium" },
    { topicId: topicMap["Motor Control"], question: "Spasticity following a stroke is characterized by:", options: JSON.stringify(["A) Flaccid paralysis and muscle atrophy", "B) Velocity-dependent increase in muscle tone and exaggerated stretch reflexes", "C) Hypotonia and cerebellar signs", "D) Fasciculations and denervation atrophy"]), correctAnswer: "B", explanation: "Spasticity (UMN sign) is velocity-dependent increased muscle tone (tonic stretch reflex activation) with exaggerated tendon reflexes; results from loss of corticospinal inhibition of spinal circuits.", difficulty: "medium" },
    { topicId: topicMap["Motor Control"], question: "Muscle spindles detect:", options: JSON.stringify(["A) Muscle force and prevent excessive tension", "B) Muscle length changes and velocity of stretch", "C) Joint angle only", "D) Tendon compliance"]), correctAnswer: "B", explanation: "Muscle spindles (intrafusal fibers) detect muscle length and velocity of length change; Ia afferents signal dynamic stretch, II afferents signal static length.", difficulty: "medium" },
    { topicId: topicMap["Motor Control"], question: "Golgi tendon organs function to:", options: JSON.stringify(["A) Detect muscle length", "B) Detect muscle tension and inhibit the same muscle (prevent excessive force)", "C) Facilitate muscle contraction during stretch", "D) Detect joint position"]), correctAnswer: "B", explanation: "Golgi tendon organs (GTOs) detect tension at the muscle-tendon junction; Ib afferents activate inhibitory interneurons that inhibit the same muscle (autogenic inhibition) to protect against excessive force.", difficulty: "medium" },
    { topicId: topicMap["Motor Control"], question: "The supplementary motor area (SMA) is primarily active during:", options: JSON.stringify(["A) Processing of external sensory input", "B) Internally generated, self-initiated movements and motor planning", "C) Balance control only", "D) Passive movement perception"]), correctAnswer: "B", explanation: "The SMA (medial BA 6) is active during planning and execution of internally-generated (self-initiated) movements; damage causes difficulty initiating voluntary movements (motor initiation).", difficulty: "hard" },
    { topicId: topicMap["Motor Control"], question: "EMG (electromyography) can distinguish between myopathies and neuropathies because:", options: JSON.stringify(["A) Myopathies show larger motor unit potentials; neuropathies show smaller ones", "B) Myopathies show short-duration, low-amplitude potentials; neuropathies show large-amplitude, long-duration potentials", "C) EMG cannot distinguish them", "D) Both show identical findings on EMG"]), correctAnswer: "B", explanation: "Myopathies: small, short-duration motor unit potentials (fewer muscle fibers per unit); neuropathies: large, long-duration, polyphasic potentials (reinnervation collateral sprouting) and denervation activity.", difficulty: "hard" },
    { topicId: topicMap["Motor Control"], question: "What is the function of the corticobulbar tract?", options: JSON.stringify(["A) Carries sensory information from the face to the cortex", "B) Controls the muscles of the face, head, and neck via cranial nerve nuclei", "C) Controls the trunk muscles", "D) Carries cerebellar output to the cortex"]), correctAnswer: "B", explanation: "The corticobulbar tract carries motor signals from the cortex to brainstem cranial nerve nuclei (V, VII, IX, X, XI, XII), controlling facial expression, speech, swallowing, and head/neck movement.", difficulty: "medium" },
    { topicId: topicMap["Motor Control"], question: "Alpha motor neurons in the spinal cord directly innervate:", options: JSON.stringify(["A) Muscle spindles (intrafusal fibers)", "B) Extrafusal muscle fibers (the main contractile muscle)", "C) Gamma motor neurons", "D) Golgi tendon organs"]), correctAnswer: "B", explanation: "Alpha motor neurons innervate extrafusal muscle fibers — the main contractile elements of skeletal muscle. Gamma motor neurons innervate the intrafusal fibers (muscle spindles).", difficulty: "medium" },

    // ===== NEUROENDOCRINOLOGY =====
    { topicId: topicMap["Neuroendocrinology"], question: "The HPA axis stress response sequence is:", options: JSON.stringify(["A) ACTH → CRH → cortisol", "B) CRH (hypothalamus) → ACTH (pituitary) → cortisol (adrenal cortex)", "C) Cortisol → CRH → ACTH", "D) Cortisol (adrenal) → ACTH (hypothalamus) → CRH (pituitary)"]), correctAnswer: "B", explanation: "The HPA axis: stress activates hypothalamus to release CRH → anterior pituitary releases ACTH → adrenal cortex releases cortisol → negative feedback on hypothalamus and pituitary.", difficulty: "medium" },
    { topicId: topicMap["Neuroendocrinology"], question: "Chronic stress and elevated cortisol affect the hippocampus by:", options: JSON.stringify(["A) Causing hippocampal hypertrophy and enhanced memory", "B) Causing hippocampal atrophy, suppressing neurogenesis, and impairing memory", "C) Having no effect on hippocampal structure", "D) Increasing synaptic density in hippocampus"]), correctAnswer: "B", explanation: "Chronic cortisol excess damages hippocampal pyramidal neurons, suppresses dentate gyrus neurogenesis, and impairs memory formation — explaining memory deficits in chronic stress and depression.", difficulty: "hard" },
    { topicId: topicMap["Neuroendocrinology"], question: "Oxytocin is released from the:", options: JSON.stringify(["A) Anterior pituitary", "B) Adrenal cortex", "C) Posterior pituitary (synthesized in hypothalamus)", "D) Pineal gland"]), correctAnswer: "C", explanation: "Oxytocin is synthesized by hypothalamic paraventricular and supraoptic nuclei and released from the posterior pituitary; it promotes uterine contractions, lactation, social bonding, and trust.", difficulty: "medium" },
    { topicId: topicMap["Neuroendocrinology"], question: "Melatonin secretion by the pineal gland is triggered by:", options: JSON.stringify(["A) Bright light exposure", "B) Cortisol release", "C) Darkness, mediated by the SCN via sympathetic innervation", "D) Exercise and physical activity"]), correctAnswer: "C", explanation: "Melatonin secretion is triggered by darkness: retinal input → SCN (master clock) → superior cervical ganglion → pineal gland releases melatonin. Light suppresses melatonin secretion.", difficulty: "medium" },
    { topicId: topicMap["Neuroendocrinology"], question: "Vasopressin (ADH) primarily acts to:", options: JSON.stringify(["A) Increase urine production", "B) Promote water reabsorption in the kidneys and regulate blood pressure", "C) Stimulate adrenal cortex hormone release", "D) Inhibit thirst"]), correctAnswer: "B", explanation: "ADH (vasopressin), released from posterior pituitary, promotes water reabsorption in renal collecting ducts (via V2 receptors) and causes vasoconstriction (via V1 receptors), regulating water balance and blood pressure.", difficulty: "medium" },
    { topicId: topicMap["Neuroendocrinology"], question: "Thyroid hormone deficiency in infancy causes:", options: JSON.stringify(["A) Hyperthyroidism in adults", "B) Cretinism — severe intellectual disability, growth retardation, and neurological deficits", "C) Precocious puberty", "D) Only metabolic effects without neurological consequences"]), correctAnswer: "B", explanation: "Congenital hypothyroidism (insufficient thyroid hormone) during the critical period of brain development causes cretinism: severe intellectual disability, hearing loss, motor deficits, and growth retardation.", difficulty: "hard" },
    { topicId: topicMap["Neuroendocrinology"], question: "The hypothalamus controls the anterior pituitary via:", options: JSON.stringify(["A) Direct neural connections via the infundibular stalk axons", "B) Releasing and inhibiting hormones via the hypophyseal portal blood system", "C) The vagus nerve", "D) The optic tract"]), correctAnswer: "B", explanation: "The hypothalamus controls the anterior pituitary (adenohypophysis) via releasing (e.g., CRH, TRH, GnRH) and inhibiting (e.g., dopamine, somatostatin) hormones transported through the hypophyseal portal system.", difficulty: "medium" },
    { topicId: topicMap["Neuroendocrinology"], question: "Cushing's syndrome from excess cortisol causes which neurological effects?", options: JSON.stringify(["A) Parkinsonism and movement disorder", "B) Hippocampal atrophy, memory deficits, depression, and psychosis", "C) Only peripheral neuropathy", "D) Increased neurogenesis"]), correctAnswer: "B", explanation: "Excess cortisol in Cushing's syndrome causes hippocampal atrophy (memory impairment), psychiatric symptoms (depression, anxiety, psychosis), and cognitive dysfunction.", difficulty: "medium" },
    { topicId: topicMap["Neuroendocrinology"], question: "The HPG (hypothalamic-pituitary-gonadal) axis is regulated by:", options: JSON.stringify(["A) Cortisol from the adrenal cortex", "B) GnRH (hypothalamus) → LH and FSH (pituitary) → sex hormones (gonads)", "C) Insulin from the pancreas", "D) Thyroid hormone"]), correctAnswer: "B", explanation: "The HPG axis: GnRH released in pulsatile fashion from hypothalamus → LH and FSH from anterior pituitary → estrogen/progesterone (ovaries) or testosterone (testes) → negative feedback.", difficulty: "medium" },
    { topicId: topicMap["Neuroendocrinology"], question: "Estrogen's effects on the brain include:", options: JSON.stringify(["A) Reducing dendritic spine density", "B) Promoting dendritic spine density, serotonin synthesis, and neuroprotection", "C) Inhibiting neurogenesis in the hippocampus", "D) Reducing glucose uptake in the cortex"]), correctAnswer: "B", explanation: "Estrogen promotes dendritic spine density, enhances serotonergic transmission, supports hippocampal neurogenesis, and has neuroprotective effects; estrogen decline at menopause affects cognitive function.", difficulty: "medium" },

    // ===== PERSONALITY DISORDERS =====
    { topicId: topicMap["Personality Disorders"], question: "DSM-5 Cluster B personality disorders (dramatic, emotional, erratic) include:", options: JSON.stringify(["A) Paranoid, schizoid, schizotypal", "B) Antisocial, borderline, histrionic, narcissistic", "C) Avoidant, dependent, OCPD", "D) OCD, PTSD, acute stress disorder"]), correctAnswer: "B", explanation: "Cluster B: antisocial (disregard for others), borderline (emotional instability, identity), histrionic (attention-seeking, dramatic), narcissistic (grandiosity, entitlement).", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "DBT (Dialectical Behavior Therapy) was specifically developed for:", options: JSON.stringify(["A) Antisocial personality disorder", "B) Borderline personality disorder", "C) Narcissistic personality disorder", "D) Paranoid personality disorder"]), correctAnswer: "B", explanation: "DBT was developed by Marsha Linehan specifically for BPD; it targets emotional dysregulation, distress tolerance, mindfulness, and interpersonal effectiveness — the most evidence-based treatment for BPD.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "'Splitting' as a defense mechanism means:", options: JSON.stringify(["A) Splitting attention between two tasks", "B) Viewing people as all good or all bad, unable to integrate opposing qualities", "C) Splitting the brain hemispheres", "D) Splitting awareness to avoid trauma"]), correctAnswer: "B", explanation: "Splitting is a primitive defense mechanism where people/situations are viewed as entirely good or entirely bad; typical of BPD and reflecting difficulty integrating ambivalent feelings about the same person.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "Antisocial personality disorder (ASPD) requires which developmental history?", options: JSON.stringify(["A) Childhood anxiety disorder", "B) Conduct disorder before age 15", "C) Attention deficit hyperactivity disorder", "D) Major depressive disorder in adolescence"]), correctAnswer: "B", explanation: "DSM-5 requires evidence of conduct disorder before age 15 for ASPD diagnosis; the adult disorder (≥18 years) represents a continuation of early antisocial behavioral patterns.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "Brain imaging in antisocial personality disorder typically shows:", options: JSON.stringify(["A) Enlarged hippocampus", "B) Reduced amygdala volume and vmPFC gray matter, reduced fear conditioning", "C) Hyperactive prefrontal cortex", "D) Increased serotonin levels"]), correctAnswer: "B", explanation: "ASPD is associated with reduced amygdala and ventromedial prefrontal cortex (vmPFC) volume and function; reduced fear conditioning capacity; and reduced gray matter in frontotemporal regions.", difficulty: "hard" },
    { topicId: topicMap["Personality Disorders"], question: "Schizotypal personality disorder is genetically related to:", options: JSON.stringify(["A) Bipolar disorder", "B) Schizophrenia (part of the schizophrenia spectrum)", "C) Borderline personality disorder", "D) Obsessive-compulsive disorder"]), correctAnswer: "B", explanation: "Schizotypal personality disorder is considered part of the schizophrenia spectrum; it is more common in relatives of people with schizophrenia and shares some cognitive and neurological features.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "A key diagnostic criterion for a personality disorder is that the traits are:", options: JSON.stringify(["A) Present only during episodes of major mental illness", "B) Ego-syntonic, pervasive, inflexible, causing distress/impairment, since early adulthood", "C) Always caused by a medical condition", "D) Easily modified by insight and education"]), correctAnswer: "B", explanation: "Personality disorders are diagnosed when personality traits are: inflexible and maladaptive, ego-syntonic (feel normal to the patient), pervasive across situations, cause significant distress or impairment, and are stable since early adulthood.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "Narcissistic personality disorder is characterized by:", options: JSON.stringify(["A) Fear of abandonment and unstable identity", "B) Grandiosity, need for admiration, and lack of empathy", "C) Odd beliefs and social anxiety", "D) Excessive help-seeking and submissiveness"]), correctAnswer: "B", explanation: "NPD features a pattern of grandiosity (real or fantasied), need for excessive admiration, sense of entitlement, and lack of empathy; may have fragile underlying self-esteem despite surface grandiosity.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "Avoidant personality disorder differs from social anxiety disorder (SAD) in that:", options: JSON.stringify(["A) They are completely different with no overlap", "B) APD involves pervasive avoidance and feelings of inadequacy across all relationships; SAD may be more limited", "C) SAD is more severe and chronic than APD", "D) APD only involves avoidance of specific social situations"]), correctAnswer: "B", explanation: "APD and SAD overlap significantly; APD involves a more pervasive pattern of self-perceived inadequacy, social inhibition, and hypersensitivity to rejection across multiple domains, while SAD may be more circumscribed.", difficulty: "hard" },
    { topicId: topicMap["Personality Disorders"], question: "Heritability of personality disorder traits is approximately:", options: JSON.stringify(["A) 0-10% (mostly environmental)", "B) 40-60% (moderate heritability)", "C) 90-100% (almost entirely genetic)", "D) 100% — entirely genetic"]), correctAnswer: "B", explanation: "Twin and adoption studies suggest moderate heritability (~40-60%) for personality disorder traits; both genetic predispositions and environmental factors (especially early adversity) contribute.", difficulty: "medium" },

    // ===== DISSOCIATIVE DISORDERS =====
    { topicId: topicMap["Dissociative Disorders"], question: "Dissociative identity disorder (DID) is characterized by:", options: JSON.stringify(["A) Inability to form new memories after trauma", "B) Two or more distinct personality states (alters) with recurrent amnesia between them", "C) Persistent derealization only", "D) Deliberate simulation of mental illness"]), correctAnswer: "B", explanation: "DID (formerly multiple personality disorder) involves two or more distinct personality states (alters) that recurrently take control of behavior, typically with amnesia barriers between alters.", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "Depersonalization is best described as:", options: JSON.stringify(["A) Loss of the sense of personal identity permanently", "B) Feeling detached from one's own mental processes or body, like an outside observer", "C) Inability to recognize familiar people", "D) Loss of all emotional experience"]), correctAnswer: "B", explanation: "Depersonalization: feeling detached from oneself (observing from the outside, feeling like a robot); ego-dystonic with intact reality testing. Derealization involves detachment from the external world.", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "The neural mechanism underlying depersonalization disorder involves:", options: JSON.stringify(["A) Amygdala hyperactivation driving emotional flooding", "B) Excessive prefrontal inhibition of the amygdala, reducing emotional experience", "C) Hippocampal damage preventing memory access", "D) Thalamic disconnection from the cortex"]), correctAnswer: "B", explanation: "In depersonalization disorder, excessive prefrontal (especially right inferior frontal) activity inhibits the amygdala and emotional processing, reducing emotional experience — 'emotional numbing' with preserved cognition.", difficulty: "hard" },
    { topicId: topicMap["Dissociative Disorders"], question: "Dissociative amnesia is characterized by:", options: JSON.stringify(["A) Difficulty forming new memories (anterograde amnesia)", "B) Inability to recall important personal information, usually trauma-related, too extensive for ordinary forgetting", "C) Global amnesia for all knowledge", "D) Amnesia from organic brain disease"]), correctAnswer: "B", explanation: "Dissociative amnesia involves gaps in autobiographical memory, typically related to traumatic or stressful events, not explained by ordinary forgetting, substances, or neurological disease.", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "Dissociation as a defense mechanism is thought to occur in response to:", options: JSON.stringify(["A) Mild everyday stress", "B) Overwhelming trauma that cannot be processed consciously", "C) Genetic predisposition only, unrelated to experience", "D) Voluntary attention control"]), correctAnswer: "B", explanation: "Dissociation is understood as a defense mechanism against overwhelming traumatic experience — 'detaching' from intolerable emotional/physical experiences; explains high rates of childhood trauma in dissociative disorders.", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "In dissociative disorders, reality testing is:", options: JSON.stringify(["A) Always severely impaired", "B) Intact — patients know something is wrong despite their symptoms", "C) Variable depending on the specific alter", "D) Only impaired during severe episodes"]), correctAnswer: "B", explanation: "Unlike psychosis, dissociative disorders preserve reality testing; the patient is aware of and distressed by their symptoms (e.g., knowing they feel unreal while knowing they actually exist).", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "A dissociative fugue state involves:", options: JSON.stringify(["A) Sustained vegetative state", "B) Purposeful travel with amnesia for one's past and confusion about identity", "C) Repeated absence seizures", "D) Sleepwalking episodes"]), correctAnswer: "B", explanation: "A dissociative fugue involves unexpected travel away from home with amnesia for one's past (sometimes adopting a new identity), usually following severe stress; often brief and resolves with return of memories.", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "Which psychiatric conditions commonly co-occur with DID?", options: JSON.stringify(["A) Psychosis and dementia", "B) PTSD, depression, anxiety, and borderline personality disorder", "C) Obsessive-compulsive disorder and schizophrenia", "D) Parkinson's disease and epilepsy"]), correctAnswer: "B", explanation: "DID commonly co-occurs with PTSD (due to shared trauma etiology), major depression, anxiety disorders, and borderline personality disorder; suicidality and self-harm are frequent comorbidities.", difficulty: "medium" },
    { topicId: topicMap["Dissociative Disorders"], question: "Serotonergic medications (SSRIs) may help which dissociative disorder?", options: JSON.stringify(["A) Dissociative identity disorder only", "B) Depersonalization/derealization disorder", "C) Dissociative amnesia", "D) No dissociative disorders respond to SSRIs"]), correctAnswer: "B", explanation: "SSRIs have some evidence for treating depersonalization/derealization disorder, particularly when comorbid anxiety or depression is present; the serotonin system's role in emotional regulation is implicated.", difficulty: "hard" },
    { topicId: topicMap["Dissociative Disorders"], question: "What distinguishes dissociative identity disorder from malingering?", options: JSON.stringify(["A) DID patients always remember their alters", "B) DID involves genuine amnesia between alters and is ego-dystonic; malingering is conscious deception for gain", "C) Malingering causes more impairment than DID", "D) They cannot be distinguished clinically"]), correctAnswer: "B", explanation: "DID involves genuine dissociative amnesia between alter states and is ego-dystonic (distressing); malingering is deliberate, conscious simulation of symptoms for identifiable external gain.", difficulty: "hard" },

    // ===== COPING & DEFENSE MECHANISMS =====
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "Which is a MATURE defense mechanism?", options: JSON.stringify(["A) Splitting", "B) Projection", "C) Sublimation", "D) Denial"]), correctAnswer: "C", explanation: "Sublimation (redirecting unacceptable impulses into socially valued activities) is a mature defense mechanism. Splitting is primitive; projection is neurotic; denial can be primitive or neurotic.", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "Projection as a defense mechanism involves:", options: JSON.stringify(["A) Attributing one's own unacceptable thoughts or feelings to others", "B) Behaving opposite to one's actual impulses", "C) Channeling impulses into constructive activities", "D) Excluding memories from consciousness"]), correctAnswer: "A", explanation: "Projection: attributing one's own unacceptable impulses, feelings, or thoughts to another person (e.g., someone who feels angry accusing others of being hostile toward them).", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "Reaction formation occurs when:", options: JSON.stringify(["A) A person acts in the opposite way to their actual feelings", "B) A person displaces anger onto a safer target", "C) A person denies reality to reduce anxiety", "D) A person explains behavior with false but reasonable-sounding justifications"]), correctAnswer: "A", explanation: "Reaction formation: behaving in the polar opposite of one's unconscious impulses (e.g., being excessively kind to someone one unconsciously dislikes or being a crusader against one's own impulses).", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "Repression differs from suppression in that:", options: JSON.stringify(["A) They are identical mechanisms", "B) Repression is unconscious exclusion of distressing thoughts; suppression is conscious deferral", "C) Suppression is unconscious; repression is conscious", "D) Only repression can be reversed"]), correctAnswer: "B", explanation: "Repression is an unconscious process excluding distressing thoughts from consciousness. Suppression is a conscious/deliberate decision to defer thinking about a problem — a mature defense.", difficulty: "hard" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "Which defense mechanism is characteristic of borderline personality disorder?", options: JSON.stringify(["A) Sublimation", "B) Intellectualization", "C) Splitting", "D) Altruism"]), correctAnswer: "C", explanation: "Splitting (all-or-nothing thinking, seeing people as entirely good or bad) is a primitive defense mechanism strongly associated with borderline personality disorder.", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "Intellectualization is:", options: JSON.stringify(["A) Using intelligence to solve problems", "B) Avoiding emotional engagement by focusing on abstract, intellectual aspects of distressing situations", "C) Rationalizing unconscious impulses", "D) Using humor to deflect anxiety"]), correctAnswer: "B", explanation: "Intellectualization: excessive use of abstract thinking or intellectual analysis to avoid confronting emotions; similar to rationalization but emphasizes thinking over feeling (e.g., discussing a terminal diagnosis in purely clinical terms).", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "Problem-focused coping is most effective when:", options: JSON.stringify(["A) The stressor is uncontrollable", "B) The stressor is controllable and can be modified", "C) Emotional support is needed", "D) The person is highly emotional"]), correctAnswer: "B", explanation: "Problem-focused coping (addressing the stressor directly) is most effective when the stressor is controllable/modifiable. Emotion-focused coping is more adaptive when the stressor cannot be changed.", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "Rationalization as a defense mechanism means:", options: JSON.stringify(["A) Using logic to truly understand a problem", "B) Creating plausible but false justifications for behavior motivated by unacceptable impulses", "C) Thinking through problems rationally and effectively", "D) Displacing feelings onto a substitute target"]), correctAnswer: "B", explanation: "Rationalization: generating logical-sounding but false justifications for behaviors that are actually motivated by unconscious or unacceptable desires (e.g., 'I failed because the test was unfair,' hiding self-protection).", difficulty: "easy" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "Displacement as a defense mechanism involves:", options: JSON.stringify(["A) Moving physically to avoid stressors", "B) Redirecting emotions from an unacceptable target to a safer substitute", "C) Moving a memory from conscious to unconscious", "D) Acting opposite to one's feelings"]), correctAnswer: "B", explanation: "Displacement: redirecting an emotion (often anger or frustration) from the original, threatening target to a safer substitute (e.g., snapping at a family member after a frustrating day at work).", difficulty: "easy" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "Altruism as a mature defense mechanism means:", options: JSON.stringify(["A) Being generally helpful in daily life", "B) Resolving internal conflicts by meeting others' needs in a genuinely satisfying way", "C) Donating money to charity as guilt relief only", "D) Sacrificing oneself to avoid conflict"]), correctAnswer: "B", explanation: "Altruism as a mature defense: genuinely helping others in a way that also provides personal satisfaction and conflict resolution, different from reaction formation (helping out of repressed hostility).", difficulty: "hard" },
  ];

  await db.insert(quizQuestionsTable).values(mapQuizQuestions(quizQuestions));
  console.log(`Inserted ${quizQuestions.length} quiz questions`);

  // ---------------------------------------------------------------------------
  // STUDY GUIDES — 10 comprehensive guides
  // ---------------------------------------------------------------------------
  const studyGuides = [
    {
      topicId: topicMap["Neuropsychology Overview"],
      title: "Neuropsychology Overview Study Guide",
      content: `# Neuropsychology Overview

## What is Neuropsychology?
Neuropsychology is the scientific study of the relationship between brain structure and function on one hand, and psychological processes and behavior on the other. It bridges neurology and psychology, applying knowledge of brain-behavior relationships to assessment, diagnosis, and rehabilitation.

## Key Historical Figures
- **Paul Broca (1861):** Identified the language production area in the left frontal lobe
- **Carl Wernicke (1874):** Described the language comprehension area in the temporal lobe
- **Karl Lashley:** Proposed equipotentiality; studied maze learning in rats
- **Alexander Luria:** Developed functional systems theory; created the Luria-Nebraska Battery

## Brain-Behavior Relationships
### Localization of Function
Specific brain regions are specialized for particular functions (e.g., primary visual cortex processes vision, hippocampus forms memories).

### Distributed Processing
Most complex cognitive functions involve networks of brain regions working together.

### Lateralization
| Function | Dominant Hemisphere (Usually Left) | Right Hemisphere |
|----------|-------------------------------------|-----------------|
| Language (95% right-handers) | ✓ | |
| Visuospatial processing | | ✓ |
| Emotional processing | | ✓ |
| Music (melody) | | ✓ |

## Neuropsychological Assessment
### Purposes
1. Diagnosis and differential diagnosis
2. Characterizing cognitive strengths and weaknesses
3. Tracking change over time
4. Treatment planning and rehabilitation

### Key Domains Assessed
1. **Attention** — sustained, selective, divided, alternating
2. **Memory** — verbal, visual, working memory, remote
3. **Language** — fluency, comprehension, naming, repetition
4. **Visuospatial** — construction, perception, navigation
5. **Executive Function** — planning, inhibition, flexibility
6. **Processing Speed** — motor and cognitive speed

### Common Tests
- **MMSE / MoCA:** Brief cognitive screens
- **WAIS-IV:** Intelligence assessment
- **WMS-IV:** Memory assessment
- **Trail Making Test:** Attention and set-shifting
- **Stroop Test:** Response inhibition
- **Wisconsin Card Sorting:** Executive function

## Key Concepts
### Anterograde vs. Retrograde Amnesia
- **Anterograde:** Cannot form NEW memories after injury
- **Retrograde:** Loss of memories FROM BEFORE injury

### Double Dissociation
Evidence that two cognitive functions are neurally independent: Lesion A impairs function X but not Y; Lesion B impairs Y but not X.

### Ecological Validity
The degree to which neuropsychological test performance predicts real-world functional outcomes.

### Diaschisis
Transient loss of function in brain regions remote from but connected to an injured area; structurally intact areas malfunction due to disrupted connections.

## Rehabilitation Principles
- Neuroplasticity allows for recovery and compensation
- Cognitive rehabilitation targets specific impaired functions
- Environmental modifications support independent functioning
- Goal-setting based on patient's values and priorities`
    },
    {
      topicId: topicMap["Cell Biology & Neuron Anatomy"],
      title: "Cell Biology & Neuron Anatomy Study Guide",
      content: `# Cell Biology & Neuron Anatomy

## The Neuron
The neuron is the basic signaling unit of the nervous system. There are approximately 86 billion neurons in the human brain.

### Structural Components
| Component | Function |
|-----------|----------|
| **Soma (cell body)** | Contains nucleus, metabolic center |
| **Dendrites** | Receive inputs from other neurons |
| **Axon hillock** | Decision point — generates action potentials |
| **Axon** | Transmits signal to next neuron |
| **Axon terminal (bouton)** | Releases neurotransmitters |
| **Myelin sheath** | Insulates axon, speeds conduction |
| **Node of Ranvier** | Gaps in myelin — site of AP regeneration |

### Types of Neurons
- **Multipolar:** Motor neurons, interneurons (most common)
- **Bipolar:** Retinal ganglion cells, olfactory neurons
- **Unipolar (pseudounipolar):** Sensory neurons in dorsal root ganglia

## The Action Potential
The action potential is an all-or-none electrical signal that transmits information along the axon.

### Phases
1. **Resting state:** -70 mV (maintained by Na+/K+ ATPase)
2. **Depolarization:** Na+ channels open → Na+ rushes IN → reaches +40 mV
3. **Repolarization:** Na+ channels inactivate, K+ channels open → K+ flows OUT
4. **Hyperpolarization:** Briefly more negative than resting potential
5. **Return to resting:** Na+/K+ pump restores ion gradients

### Refractory Periods
- **Absolute refractory:** Na+ channels inactivated — NO new AP possible
- **Relative refractory:** K+ channels still open — stronger stimulus needed

### Saltatory Conduction (Myelinated Axons)
Action potentials "jump" between Nodes of Ranvier → speeds up conduction (up to 120 m/s vs. 0.5 m/s in unmyelinated)

## Synaptic Transmission
### Steps
1. AP arrives at presynaptic terminal
2. Voltage-gated Ca²⁺ channels open
3. Ca²⁺ influx triggers vesicle fusion
4. Neurotransmitter released into synaptic cleft
5. Binds postsynaptic receptors
6. EPSP or IPSP generated
7. Neurotransmitter removed (reuptake, degradation, diffusion)

### EPSP vs. IPSP
- **EPSP (Excitatory):** Depolarizes membrane toward threshold → increases AP probability
- **IPSP (Inhibitory):** Hyperpolarizes membrane → decreases AP probability

## Glial Cells
| Cell Type | Location | Key Functions |
|-----------|----------|---------------|
| **Astrocytes** | CNS | BBB, ion regulation, metabolic support, gliosis |
| **Oligodendrocytes** | CNS | Myelin production (up to 50 axons each) |
| **Microglia** | CNS | Immune surveillance, phagocytosis |
| **Schwann cells** | PNS | Myelin (one cell per axon segment), nerve repair |
| **Ependymal cells** | CNS | Line ventricles, produce CSF |

## Synaptic Plasticity
### Long-Term Potentiation (LTP)
- High-frequency stimulation strengthens synapses
- Requires NMDA receptor activation (coincidence detector)
- Ca²⁺ influx activates kinases → AMPA receptor insertion
- Thought to underlie learning and memory

### Long-Term Depression (LTD)
- Low-frequency stimulation weakens synapses
- Opposite of LTP; important for synaptic specificity

## Blood-Brain Barrier (BBB)
- Formed by tight junctions between endothelial cells
- Astrocyte endfeet and pericytes support the BBB
- Protects the CNS from pathogens and large molecules
- Selectively permeable: lipid-soluble substances cross freely`
    },
    {
      topicId: topicMap["Dementia & Alzheimer's Disease"],
      title: "Dementia & Alzheimer's Disease Study Guide",
      content: `# Dementia & Alzheimer's Disease

## What is Dementia?
Dementia is an umbrella term for a group of symptoms affecting memory, thinking, and social abilities severely enough to interfere with daily life. It is a syndrome, not a specific disease.

### Key Features
- Progressive cognitive decline
- Affects at least two cognitive domains
- Interferes with daily function
- Not explained by delirium

## Types of Dementia

### Alzheimer's Disease (60-70% of cases)
**Pathology:**
- Extracellular amyloid-β plaques (senile plaques)
- Intracellular neurofibrillary tangles (hyperphosphorylated tau)
- Cholinergic neuron loss (basal nucleus of Meynert)

**Progression (Braak Stages):**
1. Stages I-II: Entorhinal cortex, hippocampus
2. Stages III-IV: Association cortex
3. Stages V-VI: Primary motor/sensory cortex

**Clinical Features:**
- Earliest: Episodic memory loss (anterograde amnesia)
- Middle: Language (anomia), visuospatial deficits
- Late: Personality changes, motor decline

### Lewy Body Dementia (LBD)
- **Alpha-synuclein** (Lewy body) deposits
- Fluctuating cognition
- Recurrent detailed visual hallucinations
- Parkinsonism (after cognitive decline)
- REM sleep behavior disorder
- Caution: Neuroleptics can be fatal

### Vascular Dementia
- Cerebrovascular disease (strokes, small vessel disease)
- Stepwise deterioration
- Focal neurological signs
- Risk factors: hypertension, diabetes, smoking

### Frontotemporal Dementia (FTD)
**Behavioral Variant (bvFTD):**
- Personality change, disinhibition
- Apathy and executive dysfunction
- Stereotyped behaviors

**Language Variants:**
- Progressive nonfluent aphasia
- Semantic dementia (loss of word meanings)

## Genetics of Alzheimer's Disease

| Gene | Type | Inheritance |
|------|------|-------------|
| PSEN1 | Early-onset FAD (most common) | Autosomal dominant |
| PSEN2 | Early-onset FAD | Autosomal dominant |
| APP | Early-onset FAD | Autosomal dominant |
| APOE ε4 | Late-onset risk factor | Not deterministic |

### APOE Status
- ε2/ε2: Protective (lowest risk)
- ε3/ε3: Average risk
- ε3/ε4: ~3x increased risk
- ε4/ε4: ~8-12x increased risk

## Diagnosis
- Clinical criteria (history, neuropsychological testing)
- Neuroimaging: MRI (hippocampal atrophy), PET (amyloid, FDG)
- Biomarkers: CSF Aβ42, tau; blood-based biomarkers (emerging)
- Neuropsychological evaluation: Memory, language, visuospatial, executive function

## Delirium vs. Dementia

| Feature | Delirium | Dementia |
|---------|----------|---------|
| Onset | Acute (hours-days) | Gradual (months-years) |
| Course | Fluctuating | Stable or progressive |
| Consciousness | Impaired | Preserved (until late) |
| Reversibility | Usually reversible | Usually not |
| Attention | Severely impaired | Variable |

## Treatment
### Pharmacological
| Drug Class | Examples | Target |
|------------|---------|--------|
| AChE Inhibitors | Donepezil, Rivastigmine, Galantamine | Mild-moderate AD |
| NMDA Antagonist | Memantine | Moderate-severe AD |

### Non-Pharmacological
- Cognitive stimulation therapy
- Physical exercise (reduces progression)
- Social engagement
- Caregiver support and education

## Pseudodementia
- Depression mimicking dementia
- Characterized by subjective memory complaints, psychomotor slowing
- Reversible with antidepressant treatment
- Key clue: Mood symptoms precede or coincide with cognitive symptoms`
    },
    {
      topicId: topicMap["Limbic System"],
      title: "Limbic System Study Guide",
      content: `# The Limbic System

## Overview
The limbic system is a collection of interconnected brain structures that regulate emotional behavior, memory formation, motivation, and autonomic responses. The term was coined by Paul MacLean (1952).

## Key Structures

### Hippocampus
**Location:** Medial temporal lobe, curved formation in the floor of the lateral ventricle  
**Functions:**
- Formation of new declarative (explicit) memories
- Spatial navigation (place cells and grid cells)
- Binding sensory information from different modalities into a unified memory

**Cytoarchitecture:**
- CA1, CA2, CA3 (cornu ammonis regions)
- Dentate gyrus (site of adult neurogenesis)
- Subiculum

**Clinical Relevance:**
- Bilateral damage (H.M.) → severe anterograde amnesia
- First region affected in Alzheimer's disease
- Hippocampal atrophy in chronic stress, PTSD, depression

### Amygdala
**Location:** Almond-shaped nucleus in the medial temporal lobe, anterior to hippocampus  
**Functions:**
- Processing emotional memories (especially fear and threat)
- Conditioned fear learning
- Emotional modulation of memory consolidation
- Social cognition and threat detection

**Key Connections:**
- Receives input from all sensory cortices
- Projects to hypothalamus (autonomic response)
- Projects to brainstem (fight-or-flight behaviors)

**Clinical Relevance:**
- Bilateral damage → Klüver-Bucy syndrome
- Hyperactivation in PTSD, anxiety, BPD
- Hypoactivation in antisocial personality disorder

### Hippocampal-Entorhinal Circuit
- **Entorhinal cortex:** Gateway to hippocampus; receives from all association cortices
- **Parahippocampal cortex:** Object-place associations
- **Perirhinal cortex:** Familiarity judgments

## The Papez Circuit
The circuit for emotion and memory:
**Hippocampus → Fornix → Mammillary Bodies → Anterior Thalamus → Cingulate Cortex → Entorhinal Cortex → Hippocampus**

### Clinical Relevance
- Korsakoff syndrome: Mammillary body damage → amnesia + confabulation
- Lesions at any point can disrupt memory

## Cingulate Cortex
### Anterior Cingulate (ACC)
- Error monitoring and conflict detection
- Emotional regulation
- Motivational aspects of behavior
- Attention to emotionally salient stimuli

### Posterior Cingulate (PCC)
- Default mode network hub
- Self-referential processing
- Spatial orientation
- Autobiographical memory retrieval

## Memory Systems

| Type | Brain Region | Examples |
|------|-------------|---------|
| **Episodic** | Hippocampus, MTL | Personal events |
| **Semantic** | Temporal neocortex | Facts, concepts |
| **Procedural** | Basal ganglia, cerebellum | Motor skills |
| **Priming** | Neocortex | Prior exposure effects |
| **Conditioning** | Amygdala (emotional), Cerebellum (somatic) | Fear, eye-blink |
| **Working Memory** | Prefrontal cortex | Online maintenance |

## Memory Consolidation
1. **Encoding:** Initial learning (hippocampus-dependent)
2. **Consolidation:** Strengthening during sleep (hippocampal replay → neocortex)
3. **Retrieval:** Accessing stored information

## Common Clinical Syndromes

### Korsakoff Syndrome
- **Cause:** Thiamine (B1) deficiency (chronic alcoholism)
- **Pathology:** Mammillary body and dorsomedial thalamus damage
- **Symptoms:** Severe anterograde amnesia, retrograde amnesia, confabulation (filling memory gaps with false information)
- **Treatment:** Thiamine replacement (Wernicke's precedes Korsakoff's)

### Klüver-Bucy Syndrome
- **Cause:** Bilateral amygdala damage
- **Symptoms:** Hyperphagia, hypersexuality, visual agnosia, extreme docility, oral exploration`
    },
    {
      topicId: topicMap["Cerebrovascular System"],
      title: "Cerebrovascular System Study Guide",
      content: `# Cerebrovascular System

## Brain Vasculature

### Arterial Supply — Two Systems
**Anterior Circulation (Internal Carotid Artery System):**
- Anterior cerebral artery (ACA)
- Middle cerebral artery (MCA)
- Posterior communicating artery (connects to posterior)

**Posterior Circulation (Vertebrobasilar System):**
- Vertebral arteries → Basilar artery
- Posterior inferior cerebellar artery (PICA)
- Anterior inferior cerebellar artery (AICA)
- Superior cerebellar artery (SCA)
- Posterior cerebral artery (PCA)

### Circle of Willis
An arterial anastomosis at the brain base connecting anterior and posterior circulations:
- Anterior communicating artery
- Bilateral posterior communicating arteries
- Provides collateral flow when one vessel is occluded

### Arterial Territories
| Artery | Territory | Deficits if Occluded |
|--------|----------|----------------------|
| **ACA** | Medial frontal, parietal | Leg weakness > arm; frontal behavior changes |
| **MCA** | Lateral cortex, subcortical | Arm/face > leg; aphasia (left); hemineglect (right) |
| **PCA** | Occipital, temporal, thalamus | Contralateral hemianopia; alexia without agraphia |
| **PICA** | Lateral medulla, cerebellum | Wallenberg's syndrome |
| **Basilar** | Pons, midbrain | Locked-in syndrome; coma |

## Types of Stroke

### Ischemic Stroke (~80%)
**Thrombotic:** In situ clot forming on atherosclerotic vessel wall  
**Embolic:** Clot from distant source (cardiac, carotid artery)  
**Small Vessel (Lacunar):** Lipohyalinosis of penetrating arteries from hypertension

**Treatment:** tPA (tissue plasminogen activator) within 4.5 hours; mechanical thrombectomy within 24 hours for large vessel occlusion

### Hemorrhagic Stroke (~20%)
**Intracerebral Hemorrhage (ICH):**
- Most common: hypertension (putamen, thalamus, cerebellum, pons)
- Also: AVM, amyloid angiopathy, coagulopathy

**Subarachnoid Hemorrhage (SAH):**
- Usually from ruptured aneurysm (berry/saccular aneurysm)
- Presents with "thunderclap" headache (worst of life)
- Risk of rebleeding and vasospasm

### Transient Ischemic Attack (TIA)
- Brief neurological symptoms from focal ischemia
- No permanent infarction on imaging
- High-risk period for subsequent stroke (ABCD2 score)
- Requires urgent evaluation and management

## Vascular Anatomy — Clinical Pearls

### Watershed Infarcts
- Occur in border zones between major arterial territories
- Caused by global hypoperfusion (cardiac arrest, severe hypotension)
- "Man in a barrel" syndrome: bilateral shoulder/proximal arm weakness

### Berry Aneurysms
- Common at bifurcations in Circle of Willis
- Rupture causes SAH
- Associated with ADPKD, connective tissue disorders

### Cerebral Autoregulation
- Maintains constant CBF despite MAP changes (60-150 mmHg)
- Fails in severe hypertension or hypotension
- Impaired in acute stroke, TBI

## Clinical Syndromes

### Wallenberg Syndrome (Lateral Medullary)
- **Cause:** PICA or vertebral artery occlusion
- **Ipsilateral:** Facial pain/temperature loss, Horner's (ptosis/miosis/anhidrosis), ataxia, dysphagia, hoarseness
- **Contralateral:** Limb pain and temperature loss

### Locked-In Syndrome
- **Cause:** Basilar artery occlusion (bilateral ventral pons infarct)
- **Features:** Complete paralysis (quadriplegia, facial), but consciousness preserved
- **Communication:** Preserved vertical eye movements only

## Blood-Brain Barrier (BBB)
- Tight junctions between cerebral endothelial cells
- Astrocyte endfeet and pericytes support function
- Impermeable to most drugs, large molecules, polar substances
- Disrupted in: infection, inflammation, tumor, trauma
- Clinical utility: Gadolinium enhancement on MRI shows BBB breakdown

## Risk Factors for Stroke
**Modifiable:** Hypertension, atrial fibrillation, diabetes, smoking, hyperlipidemia, obesity  
**Non-modifiable:** Age, sex, race, family history, prior TIA/stroke`
    },
    {
      topicId: topicMap["Multiple Sclerosis"],
      title: "Multiple Sclerosis Study Guide",
      content: `# Multiple Sclerosis

## Definition
Multiple sclerosis is a chronic, immune-mediated demyelinating disease of the CNS characterized by lesions disseminated in space and time, causing episodic or progressive neurological dysfunction.

## Epidemiology
- Affects ~2.8 million people worldwide
- Onset typically 20-40 years
- Female:Male ratio ~3:1
- Higher prevalence at higher latitudes (vitamin D hypothesis)

## Pathophysiology
1. Autoimmune T-cell attack on CNS myelin
2. Inflammatory plaques (demyelination, axonal injury)
3. Astrocytic gliosis → sclerosis
4. Partial or failed remyelination
5. Progressive axonal loss → permanent disability

## Clinical Subtypes

| Type | Features | % at Onset |
|------|---------|-----------|
| **RRMS** | Relapses with recovery | 85% |
| **SPMS** | RRMS evolving to progressive | Later |
| **PPMS** | Progressive from onset | 15% |
| **CIS** | First episode, not yet MS | — |

## Common Presentations

### Optic Neuritis
- Unilateral eye pain (worsened by movement)
- Decreased visual acuity
- Impaired color vision (red desaturation)
- Central scotoma
- Delayed VEP (P100)

### Internuclear Ophthalmoplegia (INO)
- MLF lesion in brainstem
- Failure of adduction on lateral gaze
- Nystagmus in the abducting eye
- Bilateral INO is almost pathognomonic for MS

### Spinal Cord (Transverse Myelitis)
- Limb weakness/spasticity
- Sensory level
- Bladder dysfunction
- Lhermitte's sign

### Other Manifestations
- Trigeminal neuralgia (young person)
- Fatigue (most common and disabling symptom)
- Cognitive impairment (memory, processing speed)
- Depression

## Diagnostic Criteria (McDonald 2017)
Evidence of CNS lesions disseminated in:
**Space:** ≥2 areas (periventricular, cortical/juxtacortical, infratentorial, spinal cord)  
**Time:** ≥2 attacks OR new lesion on follow-up MRI OR simultaneous Gd+ and Gd- lesions

## MRI Findings
- **T2/FLAIR:** Hyperintense lesions in white matter
- **Dawson's fingers:** Periventricular lesions perpendicular to ventricles
- **Gadolinium enhancement:** Active/inflammatory lesions (BBB breakdown)
- **Black holes (T1 hypointense):** Chronic axonal loss

## Cerebrospinal Fluid
- Oligoclonal bands (≥2, present in CNS but not serum): ~90% sensitivity
- Elevated IgG index
- Mild lymphocytic pleocytosis

## Special Phenomena

### Uhthoff's Phenomenon
Temporary worsening with increased body temperature; heat impairs conduction in demyelinated axons

### Lhermitte's Sign
Electric shock-like sensation traveling down spine on neck flexion; indicates cervical cord demyelination

### Pulfrich Phenomenon
Delayed perception in the affected eye due to slowed conduction; causes 3D distortion

## Disease-Modifying Therapies (DMTs)

| Category | Examples | Mechanism |
|---------|---------|-----------|
| **Injectable** | Interferon-β, Glatiramer | Immune modulation |
| **Oral** | Fingolimod, Dimethyl fumarate | Lymphocyte sequestration / Nrf2 |
| **High efficacy** | Natalizumab, Ocrelizumab | Anti-VLA-4; Anti-CD20 |

## Rehabilitation
- Physical therapy for spasticity and gait
- Occupational therapy for daily living
- Cognitive rehabilitation for memory/attention
- Speech therapy for dysarthria/dysphagia
- Fatigue management strategies`
    },
    {
      topicId: topicMap["Psychopharmacology"],
      title: "Psychopharmacology Study Guide",
      content: `# Psychopharmacology

## Overview
Psychopharmacology is the study of how drugs affect mood, behavior, cognition, and brain function. Understanding drug mechanisms requires knowledge of neurotransmitter systems.

## Antidepressants

### SSRIs (Selective Serotonin Reuptake Inhibitors)
**Mechanism:** Block SERT → increase synaptic serotonin  
**Examples:** Fluoxetine, sertraline, escitalopram, paroxetine  
**Uses:** Depression, anxiety disorders, OCD, PTSD, eating disorders  
**Side Effects:** Sexual dysfunction, GI upset, insomnia, serotonin syndrome (overdose)  
**Onset:** Clinical effect takes 2-6 weeks

### SNRIs (Serotonin-Norepinephrine Reuptake Inhibitors)
**Mechanism:** Block both SERT and NET  
**Examples:** Venlafaxine, duloxetine  
**Advantage:** May have additional benefit for neuropathic pain and anxiety

### TCAs (Tricyclic Antidepressants)
**Mechanism:** Block SERT + NET + muscarinic + histamine + alpha-1 receptors  
**Examples:** Amitriptyline, nortriptyline, clomipramine  
**Side Effects:** Anticholinergic (dry mouth, constipation, urinary retention), sedation, cardiac arrhythmias, dangerous in overdose

### MAOIs (Monoamine Oxidase Inhibitors)
**Mechanism:** Inhibit MAO enzyme → prevent monoamine degradation  
**Examples:** Phenelzine, tranylcypromine, selegiline  
**Risk:** Hypertensive crisis with tyramine-rich foods (cheese, wine, cured meats)  
**Serotonin Syndrome:** With other serotonergic drugs

### Other
- **Bupropion:** NDRI; also used for smoking cessation; activating
- **Mirtazapine:** α2-antagonist + 5-HT2/3 blocker; sedating, weight gain
- **Ketamine/Esketamine:** NMDA antagonist; rapid onset (hours); for treatment-resistant depression

## Antipsychotics

### Typical (First Generation)
**Mechanism:** Primarily D2 receptor antagonism  
**Examples:** Haloperidol, chlorpromazine, fluphenazine  
**Extrapyramidal Side Effects (EPS):**
- Akathisia (inner restlessness)
- Acute dystonia (muscle spasm)
- Parkinsonism (tremor, rigidity, bradykinesia)
- Tardive dyskinesia (late-onset involuntary movements)

### Atypical (Second Generation)
**Mechanism:** D2 + 5-HT2A antagonism (variable D2 affinity)  
**Examples:** Olanzapine, risperidone, quetiapine, aripiprazole, clozapine  
**Advantages:** Lower EPS; better negative/cognitive symptoms  
**Metabolic Side Effects:** Weight gain, diabetes, dyslipidemia

### Clozapine (Special Case)
- Most effective antipsychotic for treatment-resistant schizophrenia
- Risk of agranulocytosis (requires regular WBC monitoring)
- Minimal EPS, effective for suicidality

## Mood Stabilizers

### Lithium
**Mechanism:** Inhibits inositol monophosphatase and GSK-3β; affects second messenger systems  
**Uses:** Bipolar disorder (mania and depression), augmentation  
**Monitoring:** Serum levels, renal function, thyroid function  
**Toxicity:** Coarse tremor, ataxia, confusion, arrhythmias (level >1.5 mEq/L)

### Anticonvulsants
| Drug | Use in Psychiatry |
|------|------------------|
| Valproate | Bipolar mania, rapid cycling |
| Lamotrigine | Bipolar depression |
| Carbamazepine | Bipolar mania |

## Anxiolytics

### Benzodiazepines
**Mechanism:** Positive allosteric modulator of GABA-A receptors → increase Cl- influx frequency  
**Examples:** Diazepam, lorazepam, clonazepam, alprazolam  
**Risks:** Dependence, withdrawal (seizures), respiratory depression with opioids  
**Uses:** Acute anxiety, alcohol withdrawal, seizures, insomnia

### Buspirone
- Partial 5-HT1A agonist
- Non-addictive; requires 2-4 weeks for effect
- GAD (not panic)

## Stimulants (ADHD)

### Methylphenidate
**Mechanism:** Blocks dopamine (DAT) and norepinephrine (NET) reuptake  
**Uses:** ADHD, narcolepsy  
**Side Effects:** Appetite suppression, insomnia, cardiovascular effects

### Amphetamines (Mixed Amphetamine Salts, Lisdexamfetamine)
**Mechanism:** Reverse DAT and NET (active release) + reuptake inhibition

### Non-Stimulants
- **Atomoxetine:** Selective NET inhibitor
- **Guanfacine/Clonidine:** Alpha-2 agonists

## Critical Side Effect Syndromes

### Neuroleptic Malignant Syndrome (NMS)
- Hyperthermia, lead-pipe rigidity, autonomic instability, altered consciousness
- From antipsychotic-induced dopamine blockade
- Treatment: Stop drug, supportive care, dantrolene, bromocriptine

### Serotonin Syndrome
- Agitation, hyperthermia, myoclonus/clonus, diarrhea
- From excess serotonergic activity (MAOI + SSRI)
- Treatment: Stop serotonergic drugs, cyproheptadine, supportive care

### Tardive Dyskinesia
- Late-onset involuntary movements (orofacial, limb, trunk)
- From long-term D2 blockade → receptor upregulation
- VMAT2 inhibitors (valbenazine, deutetrabenazine) as treatment`
    },
    {
      topicId: topicMap["Sleep & Circadian Rhythms"],
      title: "Sleep & Circadian Rhythms Study Guide",
      content: `# Sleep & Circadian Rhythms

## Sleep Architecture
Normal sleep involves cycling through NREM and REM sleep stages, with a full cycle taking approximately 90 minutes.

### NREM Sleep
| Stage | EEG | Features |
|-------|-----|---------|
| **N1** (5%) | Theta waves | Transition to sleep; hypnic jerks |
| **N2** (45%) | Sleep spindles, K-complexes | Core sleep; memory consolidation |
| **N3** (25%) | Delta waves (slow-wave sleep) | Deep restorative sleep; GH release |

### REM Sleep (25%)
- Rapid eye movements
- Dreaming (vivid, narrative)
- Muscle atonia (brainstem inhibits motor neurons)
- Brain activity resembles wakefulness
- Emotional memory processing
- Early night: More N3; Later night: More REM

## Circadian Regulation

### Suprachiasmatic Nucleus (SCN)
- Location: Anterior hypothalamus, above optic chiasm
- Master circadian clock (~24.2 hour rhythm)
- Light synchronizes via retinohypothalamic tract
- Regulates: Sleep-wake, body temperature, cortisol, melatonin, feeding

### Molecular Clock
- CLOCK/BMAL1 transcription factors activate Period (Per) and Cryptochrome (Cry) genes
- PER/CRY proteins inhibit CLOCK/BMAL1 (negative feedback loop)
- Cycle completes in ~24 hours

### Melatonin
- Secreted by pineal gland in darkness
- Inhibited by light (especially blue wavelengths)
- Signals "biological night" to the body
- Used therapeutically for jet lag and circadian disorders

## Two-Process Model of Sleep (Borbély)

**Process S (Homeostatic):**
- Adenosine accumulates during wakefulness
- Creates increasing sleep pressure
- Caffeine blocks adenosine receptors

**Process C (Circadian):**
- SCN promotes alertness during the day
- Permits sleep at night (melatonin rise)

## Sleep Disorders

### Insomnia Disorder
- Difficulty initiating/maintaining sleep or early awakening
- Causes daytime distress/impairment for ≥3 months
- Most common sleep complaint
- Treatment: CBT-I (first line), sleep hygiene

### Obstructive Sleep Apnea (OSA)
- Upper airway collapse during sleep
- Repetitive desaturations and arousals
- Risk factors: Obesity, male sex, large neck
- Consequences: Hypertension, cognitive impairment, cardiovascular disease
- Diagnosis: Polysomnography (AHI ≥5)
- Treatment: CPAP, weight loss, positional therapy

### Narcolepsy Type 1
- Excessive daytime sleepiness
- Cataplexy (sudden loss of muscle tone triggered by emotion)
- Sleep paralysis and hypnagogic/hypnopompic hallucinations
- Cause: Autoimmune destruction of hypocretin (orexin) neurons
- Treatment: Modafinil, sodium oxybate, SSRIs (for cataplexy)

### REM Sleep Behavior Disorder (RBD)
- Loss of normal REM muscle atonia
- Physical acting out of dreams (may cause injury)
- Clonazepam or melatonin (treatment)
- 80-90% risk of developing synucleinopathy (PD, LBD, MSA) within 10-15 years

### Restless Legs Syndrome (RLS)
- Urge to move legs (worse at rest, at night, relieved by movement)
- Associated with iron deficiency, pregnancy, CKD
- Treatment: Dopamine agonists, iron supplementation, gabapentin

### Fatal Familial Insomnia
- Prion disease causing progressive insomnia, autonomic dysfunction, and death
- Thalamic degeneration (especially mediodorsal nucleus)
- Autosomal dominant (FFI) or sporadic

## Sleep and Memory Consolidation
- **N2 sleep spindles:** Episodic memory replay from hippocampus to cortex
- **N3 slow oscillations:** Synchronize hippocampal-cortical dialogue
- **REM sleep:** Emotional memory processing, procedural memory
- Sleep deprivation impairs new memory formation and consolidation

## Circadian Rhythm Disorders

| Disorder | Feature | Treatment |
|---------|---------|-----------|
| Delayed sleep phase | Sleeps late, wakes late | Morning light, melatonin (evening) |
| Advanced sleep phase | Sleeps early, wakes early | Evening light therapy |
| Shift work disorder | Misaligned schedule | Modafinil, melatonin |
| Jet lag | Travel across time zones | Light exposure, melatonin |`
    },
    {
      topicId: topicMap["Psychopathology"],
      title: "Psychopathology Study Guide",
      content: `# Psychopathology

## Schizophrenia

### Symptoms
**Positive Symptoms** (excess/distortions):
- Hallucinations (usually auditory — hearing voices)
- Delusions (fixed false beliefs)
- Disorganized thinking/speech
- Abnormal motor behavior

**Negative Symptoms** (reductions):
- Flat affect
- Alogia (poverty of speech)
- Avolition (lack of motivation)
- Anhedonia
- Social withdrawal

**Cognitive Symptoms:**
- Working memory deficits
- Processing speed slowing
- Executive dysfunction

### Neurobiological Basis
**Dopamine Hypothesis:**
- Mesolimbic hyperdopaminergia → positive symptoms
- Mesocortical hypodopaminergia → negative/cognitive symptoms

**Glutamate Hypothesis:**
- NMDA receptor hypofunction (ketamine mimics schizophrenia)
- Disinhibition of dopamine release

**Brain Changes:**
- Enlarged lateral ventricles
- Reduced gray matter (frontal, temporal, hippocampal)
- Disrupted white matter connectivity

## Major Depressive Disorder (MDD)

### Diagnostic Criteria (DSM-5)
≥2 weeks of depressed mood AND/OR anhedonia PLUS ≥4 of:
- Sleep disturbance (insomnia or hypersomnia)
- Appetite/weight change
- Psychomotor agitation or retardation
- Fatigue or loss of energy
- Worthlessness or guilt
- Concentration difficulties
- Suicidal ideation

### Neurobiological Models
- **Monoamine hypothesis:** Serotonin, norepinephrine, dopamine deficiency
- **Neuroinflammation:** Elevated cytokines in depression
- **HPA axis:** Cortisol hypersecretion, hippocampal atrophy
- **Neural circuits:** Prefrontal hypoactivity, amygdala hyperactivity
- **Neuroplasticity:** Reduced BDNF, impaired neurogenesis

## Bipolar Disorders

| Type | Requirements |
|------|-------------|
| **Bipolar I** | At least one manic episode |
| **Bipolar II** | Hypomania + major depression |
| **Cyclothymia** | Subthreshold hypomania + depression ≥2 years |

### Mania Criteria (DIGFAST)
**D**istractibility, **I**mpulsivity/Impaired judgment, **G**randiosity, **F**light of ideas, **A**ctivity increase, **S**leep decreased, **T**alkativeness

## Anxiety Disorders

| Disorder | Core Feature |
|---------|-------------|
| **GAD** | Excessive worry about multiple areas (≥6 months) |
| **Panic Disorder** | Recurrent unexpected panic attacks |
| **Social Anxiety** | Fear of social scrutiny |
| **Specific Phobia** | Fear of specific object/situation |
| **Agoraphobia** | Fear of situations where escape is difficult |

### Neurobiology of Anxiety
- Amygdala hyperactivation to threats
- Prefrontal hypoactivation (insufficient top-down control)
- Serotonin and GABA deficits
- HPA axis dysregulation

## PTSD

### Diagnostic Criteria (DSM-5)
- Exposure to trauma (death, injury, sexual violence — direct/indirect)
- Intrusion symptoms (flashbacks, nightmares)
- Avoidance (stimuli associated with trauma)
- Negative alterations (cognitions, mood)
- Hyperarousal (hypervigilance, startle)
- Duration >1 month

### Neural Basis
- **Amygdala:** Hyperactivation — exaggerated fear response
- **Hippocampus:** Atrophy — impaired contextualization of fear
- **vmPFC:** Hypoactivation — failure of fear extinction

### Treatment
- Trauma-Focused CBT (TF-CBT)
- EMDR (Eye Movement Desensitization and Reprocessing)
- Prolonged Exposure
- SSRIs/SNRIs (pharmacological)

## OCD (Obsessive-Compulsive Disorder)

### Features
- **Obsessions:** Intrusive, distressing thoughts
- **Compulsions:** Repetitive behaviors to neutralize obsessions
- Insight variable (good → absent)

### Neural Basis
- Hyperactivity in cortico-striato-thalamo-cortical (CSTC) circuit
- Orbitofrontal cortex + caudate nucleus dysfunction
- Serotonin system involvement

### Treatment
- ERP (Exposure and Response Prevention) — gold standard
- SSRIs (high doses; clomipramine)
- Deep brain stimulation (refractory cases)

## OCD-Related Disorders
- Body Dysmorphic Disorder
- Hoarding Disorder
- Trichotillomania (hair pulling)
- Excoriation (skin picking)

## Eating Disorders
| Disorder | Core Feature | Medical Risks |
|---------|-------------|--------------|
| **Anorexia Nervosa** | Restriction + body image disturbance | Malnutrition, cardiac arrhythmia, osteoporosis |
| **Bulimia Nervosa** | Binge-purge cycles | Electrolyte imbalances, dental erosion, Mallory-Weiss tears |
| **Binge Eating Disorder** | Binge episodes without purging | Obesity-related complications |`
    },
  ];

  await db.insert(studyGuidesTable).values(studyGuides);
  console.log(`Inserted ${studyGuides.length} study guides`);

  console.log("Seeding complete!");
  console.log(`Summary: ${flashcards.length} flashcards, ${quizQuestions.length} quiz questions, ${studyGuides.length} study guides`);
}

seed()
  .then(() => {
    console.log("Done!");
    process.exit(0);
  })
  .catch(err => {
    console.error("Seed error:", err);
    process.exit(1);
  });
