import { db } from "./index";
import { topicsTable, flashcardsTable, quizQuestionsTable, studyGuidesTable } from "./schema";
import { sql } from "drizzle-orm";

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

  const flashcards = [
    // Neuropsychology Overview
    { topicId: topicMap["Neuropsychology Overview"], question: "What is neuropsychology?", answer: "The scientific study of the relationship between brain function and behavior, cognition, and emotion.", difficulty: "easy" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What is the Luria-Nebraska Neuropsychological Battery used for?", answer: "A standardized battery assessing a broad range of neuropsychological functions including motor, rhythm, tactile, visual, receptive speech, expressive speech, writing, reading, arithmetic, memory, and intellectual processes.", difficulty: "medium" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What is the difference between a neurologist and a neuropsychologist?", answer: "A neurologist is a medical doctor specializing in diagnosing and treating neurological conditions. A neuropsychologist is a psychologist specializing in brain-behavior relationships, assessment, and rehabilitation.", difficulty: "easy" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What does lateralization of brain function mean?", answer: "The tendency for some neural functions to be more dominant in one hemisphere (e.g., language typically in left hemisphere, visuospatial in right hemisphere).", difficulty: "medium" },
    { topicId: topicMap["Neuropsychology Overview"], question: "What is diaschisis?", answer: "A transient loss of function in brain regions remote from the site of injury due to the disruption of connections, even when those remote areas are structurally intact.", difficulty: "hard" },

    // Cell Biology & Neuron Anatomy
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What are the main structural parts of a neuron?", answer: "Cell body (soma), dendrites (receive input), axon (carries output), axon terminals, and myelin sheath (in myelinated neurons).", difficulty: "easy" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What is the function of myelin?", answer: "Myelin insulates the axon and speeds up signal conduction via saltatory conduction, jumping between Nodes of Ranvier.", difficulty: "easy" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What are astrocytes and their functions?", answer: "Glial cells that support neurons: regulate ion concentrations, form the blood-brain barrier, provide metabolic support, and respond to injury (gliosis).", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What is an action potential?", answer: "An all-or-none electrical signal in a neuron: rapid depolarization caused by Na+ influx, followed by repolarization via K+ efflux, allowing signal transmission down the axon.", difficulty: "medium" },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "What are oligodendrocytes?", answer: "CNS glial cells that produce myelin for multiple axons simultaneously (one oligodendrocyte can myelinate up to 50 axons).", difficulty: "medium" },

    // Spinal Cord & PNS
    { topicId: topicMap["Spinal Cord & PNS"], question: "What is a dermatome?", answer: "A region of skin innervated by sensory fibers from a single spinal nerve root.", difficulty: "easy" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What is the difference between UMN and LMN lesions?", answer: "UMN (upper motor neuron) lesions cause spasticity, hyperreflexia, and Babinski sign. LMN (lower motor neuron) lesions cause flaccid weakness, hyporeflexia, and muscle atrophy.", difficulty: "hard" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What is the cauda equina?", answer: "The bundle of spinal nerve roots below the conus medullaris (L1-L2), resembling a horse's tail. Damage causes LMN signs affecting the lower limbs, bladder, and bowel.", difficulty: "medium" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What spinal levels control the bicep reflex?", answer: "C5-C6 (musculocutaneous nerve).", difficulty: "hard" },
    { topicId: topicMap["Spinal Cord & PNS"], question: "What is Brown-Séquard syndrome?", answer: "Hemisection of the spinal cord causing ipsilateral loss of motor function and proprioception, with contralateral loss of pain and temperature sensation.", difficulty: "hard" },

    // Cerebellum
    { topicId: topicMap["Cerebellum"], question: "What are the three functional zones of the cerebellum?", answer: "Vestibulocerebellum (balance/eye movements), spinocerebellum (limb/trunk coordination), cerebrocerebellum (planning fine movements).", difficulty: "hard" },
    { topicId: topicMap["Cerebellum"], question: "What are the key signs of cerebellar damage?", answer: "Ataxia, dysmetria, intention tremor, dysdiadochokinesia, nystagmus, and scanning (ataxic) speech.", difficulty: "medium" },
    { topicId: topicMap["Cerebellum"], question: "What is the Purkinje cell?", answer: "The primary output neuron of the cerebellar cortex; sends inhibitory (GABAergic) signals to deep cerebellar nuclei.", difficulty: "medium" },
    { topicId: topicMap["Cerebellum"], question: "What is dysmetria?", answer: "The inability to judge distance or scale of movement (under- or overshooting a target), a hallmark of cerebellar dysfunction.", difficulty: "medium" },

    // Basal Ganglia
    { topicId: topicMap["Basal Ganglia"], question: "What structures comprise the basal ganglia?", answer: "Striatum (caudate + putamen), globus pallidus (internal and external), subthalamic nucleus, and substantia nigra.", difficulty: "medium" },
    { topicId: topicMap["Basal Ganglia"], question: "What is the direct pathway in basal ganglia circuitry?", answer: "Striatum → GPi/SNr (inhibit) → thalamus → cortex: net effect is to facilitate movement.", difficulty: "hard" },
    { topicId: topicMap["Basal Ganglia"], question: "What neurotransmitter is lost in Parkinson's disease and where?", answer: "Dopamine is lost in the substantia nigra pars compacta (SNpc), disrupting the nigrostriatal pathway.", difficulty: "medium" },
    { topicId: topicMap["Basal Ganglia"], question: "What are the cardinal features of Parkinson's disease?", answer: "Tremor at rest (pill-rolling), rigidity, bradykinesia, and postural instability (TRAP).", difficulty: "easy" },

    // Brainstem & Diencephalon
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What are the three components of the brainstem?", answer: "Midbrain (mesencephalon), pons, and medulla oblongata.", difficulty: "easy" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What is the reticular activating system?", answer: "A network of brainstem nuclei that regulate arousal, consciousness, and sleep-wake cycles.", difficulty: "medium" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What are the primary functions of the thalamus?", answer: "Relay station for sensory and motor information to the cortex; regulates consciousness and alertness.", difficulty: "medium" },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "What does the hypothalamus regulate?", answer: "Homeostasis: temperature, hunger, thirst, circadian rhythms, autonomic function, and hormonal secretion via pituitary.", difficulty: "medium" },

    // Limbic System
    { topicId: topicMap["Limbic System"], question: "What are the key structures of the limbic system?", answer: "Hippocampus, amygdala, cingulate cortex, parahippocampal gyrus, septal nuclei, and mammillary bodies.", difficulty: "medium" },
    { topicId: topicMap["Limbic System"], question: "What is the primary function of the hippocampus?", answer: "Formation of new declarative (episodic and semantic) memories; spatial navigation.", difficulty: "easy" },
    { topicId: topicMap["Limbic System"], question: "What is the role of the amygdala?", answer: "Processing emotional memories (especially fear), emotional responses, and threat detection.", difficulty: "easy" },
    { topicId: topicMap["Limbic System"], question: "What is the Papez circuit?", answer: "A neural circuit for emotion and memory: hippocampus → fornix → mammillary bodies → anterior thalamus → cingulate cortex → hippocampus.", difficulty: "hard" },
    { topicId: topicMap["Limbic System"], question: "What is Klüver-Bucy syndrome?", answer: "Result of bilateral amygdala damage: hyperphagia, hypersexuality, visual agnosia, docility, and oral exploration of objects.", difficulty: "hard" },

    // Cerebral Cortex
    { topicId: topicMap["Cerebral Cortex"], question: "What are the four cortical lobes and their primary functions?", answer: "Frontal (motor, executive function), Parietal (somatosensory, spatial), Temporal (auditory, language, memory), Occipital (visual processing).", difficulty: "easy" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is Broca's area and what happens when it is damaged?", answer: "Broca's area (left inferior frontal gyrus) is involved in speech production. Damage causes Broca's aphasia: non-fluent speech with intact comprehension.", difficulty: "medium" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is Wernicke's area?", answer: "Left posterior superior temporal gyrus; involved in language comprehension. Damage causes Wernicke's aphasia: fluent but meaningless speech with poor comprehension.", difficulty: "medium" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is the homunculus?", answer: "A map of the human body on the motor and somatosensory cortex, where the size of each body part represents the density of cortical representation.", difficulty: "medium" },
    { topicId: topicMap["Cerebral Cortex"], question: "What is prefrontal cortex dysfunction associated with?", answer: "Deficits in executive function: planning, working memory, impulse control, decision-making, and personality changes.", difficulty: "medium" },

    // Sensory & Motor Pathways
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What does the dorsal column-medial lemniscal pathway carry?", answer: "Fine touch, vibration, proprioception, and discriminative touch from the contralateral body.", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What does the spinothalamic tract carry?", answer: "Pain, temperature, and crude touch from the contralateral side of the body.", difficulty: "medium" },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "What is the corticospinal tract?", answer: "The main voluntary motor pathway from the motor cortex to spinal motor neurons; crosses at the medullary pyramids.", difficulty: "medium" },

    // CNS Development
    { topicId: topicMap["CNS Development"], question: "What is neural tube defect?", answer: "Failure of the neural tube to close during early development, leading to spina bifida (lower) or anencephaly (upper).", difficulty: "medium" },
    { topicId: topicMap["CNS Development"], question: "What is a critical period in brain development?", answer: "A time window during which the nervous system is especially sensitive to environmental experience, required for normal development of specific functions.", difficulty: "medium" },
    { topicId: topicMap["CNS Development"], question: "What is synaptic pruning?", answer: "The elimination of excess synapses during development, refining neural circuits based on activity and experience.", difficulty: "easy" },

    // Dementia & Alzheimer's
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What are the hallmark pathological features of Alzheimer's disease?", answer: "Amyloid plaques (extracellular beta-amyloid deposits) and neurofibrillary tangles (intracellular hyperphosphorylated tau).", difficulty: "medium" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What is the earliest cognitive symptom typically seen in Alzheimer's disease?", answer: "Episodic memory impairment, particularly difficulty forming new memories (anterograde amnesia).", difficulty: "easy" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "How does Lewy body dementia differ from Alzheimer's disease?", answer: "Lewy body dementia features fluctuating cognition, visual hallucinations, REM sleep behavior disorder, and Parkinsonism; caused by alpha-synuclein deposits.", difficulty: "hard" },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "What is vascular dementia?", answer: "Cognitive impairment caused by cerebrovascular disease (strokes or small vessel disease), often with stepwise progression.", difficulty: "medium" },

    // Cerebrovascular System
    { topicId: topicMap["Cerebrovascular System"], question: "What is the Circle of Willis?", answer: "An anastomotic ring of arteries at the base of the brain connecting the anterior and posterior circulation, providing collateral blood flow.", difficulty: "medium" },
    { topicId: topicMap["Cerebrovascular System"], question: "What is the difference between ischemic and hemorrhagic stroke?", answer: "Ischemic stroke: blockage of blood supply (thrombotic or embolic). Hemorrhagic stroke: rupture of a vessel causing bleeding into brain tissue or subarachnoid space.", difficulty: "easy" },
    { topicId: topicMap["Cerebrovascular System"], question: "What is a TIA?", answer: "Transient Ischemic Attack: brief episode of neurological dysfunction from temporary cerebral ischemia with no permanent infarction, resolving within 24 hours.", difficulty: "easy" },
    { topicId: topicMap["Cerebrovascular System"], question: "What artery supplies the Broca and motor cortex areas?", answer: "The middle cerebral artery (MCA).", difficulty: "medium" },

    // Neuroradiology
    { topicId: topicMap["Neuroradiology"], question: "What appears bright (hyperintense) on T2-weighted MRI?", answer: "Water/fluid appears bright on T2. This includes CSF, edema, demyelination, and many lesions.", difficulty: "medium" },
    { topicId: topicMap["Neuroradiology"], question: "What is DWI (diffusion-weighted imaging) used for?", answer: "Detecting acute ischemic stroke — restricted diffusion (bright on DWI) indicates cytotoxic edema within minutes of ischemia.", difficulty: "hard" },
    { topicId: topicMap["Neuroradiology"], question: "What does CT without contrast best show?", answer: "Acute hemorrhage (appears hyperdense/bright white) and bony structures.", difficulty: "easy" },

    // Multiple Sclerosis
    { topicId: topicMap["Multiple Sclerosis"], question: "What is the pathological hallmark of multiple sclerosis?", answer: "Demyelinating plaques (lesions) in the CNS white matter, disseminated in space and time.", difficulty: "medium" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What is Uhthoff's phenomenon?", answer: "Temporary worsening of MS symptoms with increased body temperature (e.g., after exercise or a hot bath).", difficulty: "hard" },
    { topicId: topicMap["Multiple Sclerosis"], question: "What is the most common clinical presentation of MS?", answer: "Relapsing-remitting MS (RRMS): episodes of neurological symptoms followed by full or partial recovery.", difficulty: "easy" },

    // Pain & Nociception
    { topicId: topicMap["Pain & Nociception"], question: "What are the two main types of pain fibers?", answer: "A-delta fibers (fast, sharp, localized pain) and C fibers (slow, burning, diffuse pain).", difficulty: "medium" },
    { topicId: topicMap["Pain & Nociception"], question: "What is central sensitization?", answer: "Increased responsiveness of pain-processing neurons in the CNS following repeated or intense stimulation, contributing to chronic pain.", difficulty: "hard" },
    { topicId: topicMap["Pain & Nociception"], question: "What is the gate control theory of pain?", answer: "Non-nociceptive stimuli (large-fiber input) can inhibit pain transmission at the spinal cord level, effectively 'closing the gate' to pain signals.", difficulty: "medium" },

    // Neurogenetics
    { topicId: topicMap["Neurogenetics"], question: "What gene mutation causes Huntington's disease?", answer: "An expanded CAG trinucleotide repeat in the HTT gene on chromosome 4; more repeats correlate with earlier onset.", difficulty: "medium" },
    { topicId: topicMap["Neurogenetics"], question: "What is the mode of inheritance of Huntington's disease?", answer: "Autosomal dominant with complete penetrance.", difficulty: "easy" },
    { topicId: topicMap["Neurogenetics"], question: "What is anticipation in genetics?", answer: "A phenomenon where certain genetic diseases become more severe or appear at an earlier age in successive generations, often due to expanding trinucleotide repeats.", difficulty: "medium" },

    // Visual System
    { topicId: topicMap["Visual System"], question: "What visual field defect results from optic chiasm damage?", answer: "Bitemporal hemianopia (loss of both temporal visual fields), classically caused by pituitary tumors.", difficulty: "hard" },
    { topicId: topicMap["Visual System"], question: "Where does the optic nerve cross in the brain?", answer: "At the optic chiasm — nasal fibers from each eye cross to the opposite side; temporal fibers remain ipsilateral.", difficulty: "medium" },
    { topicId: topicMap["Visual System"], question: "What is the primary visual cortex?", answer: "V1 (area 17/striate cortex) in the occipital lobe, along the calcarine sulcus. Processes basic visual features like orientation and contrast.", difficulty: "easy" },

    // Auditory System
    { topicId: topicMap["Auditory System"], question: "What is tonotopy?", answer: "The systematic spatial organization of the auditory system where different frequencies are processed at different locations (base of cochlea = high freq, apex = low freq).", difficulty: "medium" },
    { topicId: topicMap["Auditory System"], question: "What is the primary auditory cortex?", answer: "Heschl's gyrus (A1, Brodmann areas 41-42) in the superior temporal plane; processes pitch, tone, and loudness.", difficulty: "medium" },

    // Somatosensory & Touch
    { topicId: topicMap["Somatosensory & Touch"], question: "What are Meissner's corpuscles?", answer: "Rapidly adapting mechanoreceptors in glabrous (hairless) skin that detect light touch and texture discrimination.", difficulty: "medium" },
    { topicId: topicMap["Somatosensory & Touch"], question: "What is the two-point discrimination test?", answer: "A test of tactile acuity measuring the smallest distance at which two simultaneous touch stimuli can be distinguished as separate.", difficulty: "easy" },

    // Chemical Senses
    { topicId: topicMap["Chemical Senses"], question: "What is anosmia and what can cause it?", answer: "Loss of smell. Causes include head trauma (shearing olfactory nerves), viral infection (COVID-19), neurodegenerative diseases (Parkinson's, Alzheimer's), and normal aging.", difficulty: "easy" },
    { topicId: topicMap["Chemical Senses"], question: "What are the five basic tastes?", answer: "Sweet, salty, sour, bitter, and umami (savory).", difficulty: "easy" },

    // Vestibular System
    { topicId: topicMap["Vestibular System"], question: "What are the semicircular canals and what do they detect?", answer: "Three fluid-filled canals in the inner ear (anterior, posterior, lateral) that detect rotational/angular acceleration of the head.", difficulty: "medium" },
    { topicId: topicMap["Vestibular System"], question: "What is BPPV?", answer: "Benign Paroxysmal Positional Vertigo: brief episodes of vertigo caused by displaced otoconia in the semicircular canals, triggered by head position changes.", difficulty: "medium" },

    // Motor Control
    { topicId: topicMap["Motor Control"], question: "What is the motor unit?", answer: "A single motor neuron and all the muscle fibers it innervates; the basic functional unit of motor control.", difficulty: "easy" },
    { topicId: topicMap["Motor Control"], question: "What is the size principle of motor unit recruitment?", answer: "Small, slow-twitch motor units are recruited first; larger, fast-twitch units are recruited as force demand increases.", difficulty: "medium" },

    // Sleep & Circadian Rhythms
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "What are the stages of sleep?", answer: "NREM stages N1 (light sleep), N2 (sleep spindles, K-complexes), N3 (slow-wave/deep sleep); and REM (rapid eye movement with dreaming).", difficulty: "easy" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "What is the role of the suprachiasmatic nucleus (SCN)?", answer: "The SCN in the hypothalamus is the master circadian clock, regulating ~24-hour biological rhythms synchronized to light-dark cycles.", difficulty: "medium" },
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "What is REM sleep behavior disorder?", answer: "Loss of normal REM muscle atonia, causing people to physically act out dreams; associated with neurodegenerative diseases (Parkinson's, Lewy body dementia).", difficulty: "hard" },

    // Neuroendocrinology
    { topicId: topicMap["Neuroendocrinology"], question: "What is the HPA axis?", answer: "The Hypothalamic-Pituitary-Adrenal axis: regulates the stress response through CRH → ACTH → cortisol release.", difficulty: "medium" },
    { topicId: topicMap["Neuroendocrinology"], question: "What is cortisol's effect on the hippocampus?", answer: "Chronic high cortisol causes hippocampal atrophy and impairs memory formation, contributing to cognitive effects of chronic stress.", difficulty: "hard" },

    // Psychopathology
    { topicId: topicMap["Psychopathology"], question: "What are negative symptoms of schizophrenia?", answer: "Reduction or absence of normal functions: flat affect, alogia, avolition, anhedonia, and social withdrawal.", difficulty: "medium" },
    { topicId: topicMap["Psychopathology"], question: "What is the dopamine hypothesis of schizophrenia?", answer: "Excess dopaminergic activity in the mesolimbic pathway is associated with positive symptoms; hypoactivity in the mesocortical pathway is associated with negative/cognitive symptoms.", difficulty: "hard" },
    { topicId: topicMap["Psychopathology"], question: "What is the triad of symptoms in PTSD?", answer: "Re-experiencing (flashbacks/nightmares), avoidance, and hyperarousal (hypervigilance, exaggerated startle).", difficulty: "easy" },

    // Personality Disorders
    { topicId: topicMap["Personality Disorders"], question: "What are the three clusters of personality disorders in DSM-5?", answer: "Cluster A (odd/eccentric): paranoid, schizoid, schizotypal. Cluster B (dramatic): antisocial, borderline, histrionic, narcissistic. Cluster C (anxious): avoidant, dependent, OCD.", difficulty: "medium" },
    { topicId: topicMap["Personality Disorders"], question: "What is the core feature of borderline personality disorder?", answer: "Pervasive instability in mood, interpersonal relationships, self-image, and impulsivity, with frantic efforts to avoid abandonment.", difficulty: "easy" },

    // Dissociative Disorders
    { topicId: topicMap["Dissociative Disorders"], question: "What is depersonalization?", answer: "The experience of feeling detached from one's mental processes or body, as if one is an outside observer of one's thoughts, feelings, or actions.", difficulty: "easy" },
    { topicId: topicMap["Dissociative Disorders"], question: "What is dissociative identity disorder (DID)?", answer: "Presence of two or more distinct personality states (alters) with recurrent amnesia between states, associated with severe early trauma.", difficulty: "easy" },

    // Psychopharmacology
    { topicId: topicMap["Psychopharmacology"], question: "What is the mechanism of SSRIs?", answer: "Selective Serotonin Reuptake Inhibitors block the serotonin transporter (SERT), increasing synaptic serotonin levels.", difficulty: "easy" },
    { topicId: topicMap["Psychopharmacology"], question: "What is tardive dyskinesia?", answer: "A side effect of prolonged antipsychotic use characterized by involuntary, repetitive body movements (especially oral/facial), caused by dopamine receptor supersensitivity.", difficulty: "hard" },
    { topicId: topicMap["Psychopharmacology"], question: "How do benzodiazepines work?", answer: "They enhance the effect of GABA at the GABA-A receptor by increasing the frequency of chloride channel opening, producing anxiolytic, sedative, and anticonvulsant effects.", difficulty: "medium" },

    // Coping & Defense Mechanisms
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "What is the difference between mature and immature defense mechanisms?", answer: "Mature defenses (e.g., humor, sublimation, suppression) adaptively manage distress. Immature defenses (e.g., splitting, projection, denial) are less adaptive and associated with personality pathology.", difficulty: "medium" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "What is projection as a defense mechanism?", answer: "Attributing one's own unacceptable thoughts, feelings, or impulses to another person.", difficulty: "easy" },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "What is sublimation?", answer: "A mature defense mechanism where unacceptable impulses are redirected into socially acceptable or even productive activities.", difficulty: "easy" },
  ];

  await db.insert(flashcardsTable).values(flashcards);
  console.log(`Inserted ${flashcards.length} flashcards`);

  const quizQuestions = [
    // Neuropsychology Overview
    { topicId: topicMap["Neuropsychology Overview"], question: "Which of the following best describes neuropsychology?", optionA: "The study of drug effects on the nervous system", optionB: "The scientific study of brain-behavior relationships", optionC: "The surgical treatment of brain disorders", optionD: "The radiological imaging of brain structures", correctAnswer: "B", explanation: "Neuropsychology studies how brain structure and function relate to cognitive, behavioral, and emotional processes." },
    { topicId: topicMap["Neuropsychology Overview"], question: "Diaschisis refers to:", optionA: "Neuronal death at the lesion site", optionB: "Inflammation following brain injury", optionC: "Loss of function in areas remote from the actual lesion", optionD: "Regeneration of severed axons", correctAnswer: "C", explanation: "Diaschisis is a transient loss of function in structurally intact brain regions due to disruption of connections from the lesion site." },

    // Cell Biology & Neuron Anatomy
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "Saltatory conduction occurs because:", optionA: "Dendrites amplify signals", optionB: "Action potentials jump between Nodes of Ranvier in myelinated axons", optionC: "The soma fires repeatedly", optionD: "Neurotransmitters are released continuously", correctAnswer: "B", explanation: "Myelin insulates the axon, and the action potential jumps between unmyelinated nodes, increasing conduction speed." },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "Which glial cells produce myelin in the CNS?", optionA: "Schwann cells", optionB: "Microglia", optionC: "Oligodendrocytes", optionD: "Astrocytes", correctAnswer: "C", explanation: "Oligodendrocytes myelinate CNS axons. Schwann cells myelinate PNS axons." },
    { topicId: topicMap["Cell Biology & Neuron Anatomy"], question: "An excitatory postsynaptic potential (EPSP) is caused by:", optionA: "Cl- influx", optionB: "K+ influx", optionC: "Na+ influx causing depolarization", optionD: "Ca2+ efflux", correctAnswer: "C", explanation: "EPSPs are produced when Na+ enters the postsynaptic cell, bringing the membrane potential closer to threshold." },

    // Spinal Cord & PNS
    { topicId: topicMap["Spinal Cord & PNS"], question: "A patient presents with ipsilateral motor weakness and loss of proprioception, and contralateral pain/temperature loss. This is consistent with:", optionA: "Complete spinal cord transection", optionB: "Anterior cord syndrome", optionC: "Brown-Séquard syndrome", optionD: "Cauda equina syndrome", correctAnswer: "C", explanation: "Brown-Séquard syndrome results from hemisection: ipsilateral corticospinal and dorsal column deficits, contralateral spinothalamic deficit." },
    { topicId: topicMap["Spinal Cord & PNS"], question: "Upper motor neuron lesions are characterized by:", optionA: "Flaccid paralysis and hyporeflexia", optionB: "Spasticity and hyperreflexia", optionC: "Muscle atrophy and fasciculations", optionD: "Loss of all sensation", correctAnswer: "B", explanation: "UMN lesions release spinal interneurons from cortical inhibition, causing spasticity, hyperreflexia, and Babinski sign." },

    // Cerebellum
    { topicId: topicMap["Cerebellum"], question: "Intention tremor that worsens as a limb approaches its target is most consistent with:", optionA: "Basal ganglia dysfunction", optionB: "Cerebellar dysfunction", optionC: "Dorsal column lesion", optionD: "Motor cortex damage", correctAnswer: "B", explanation: "Intention tremor is a classic cerebellar sign, worsening with purposeful movement toward a target." },
    { topicId: topicMap["Cerebellum"], question: "Which cerebellar region primarily controls balance and eye movements?", optionA: "Spinocerebellum", optionB: "Cerebrocerebellum", optionC: "Vestibulocerebellum", optionD: "Deep cerebellar nuclei", correctAnswer: "C", explanation: "The vestibulocerebellum (flocculonodular lobe) receives vestibular input and controls balance and eye movements via vestibular nuclei." },

    // Basal Ganglia
    { topicId: topicMap["Basal Ganglia"], question: "In Parkinson's disease, degeneration of which structure is most critical?", optionA: "Striatum", optionB: "Substantia nigra pars compacta", optionC: "Subthalamic nucleus", optionD: "Globus pallidus internus", correctAnswer: "B", explanation: "Loss of dopaminergic neurons in the SNpc disrupts the nigrostriatal pathway, leading to Parkinsonian motor symptoms." },
    { topicId: topicMap["Basal Ganglia"], question: "The indirect pathway in basal ganglia circuitry has the net effect of:", optionA: "Facilitating movement", optionB: "Inhibiting movement", optionC: "Increasing cortical excitation directly", optionD: "Stimulating cerebellar output", correctAnswer: "B", explanation: "The indirect pathway: striatum → GPe → STN → GPi → thalamus (inhibited) → reduced cortical excitation, suppressing movement." },

    // Brainstem & Diencephalon
    { topicId: topicMap["Brainstem & Diencephalon"], question: "The thalamus primarily functions as:", optionA: "The origin of all voluntary motor commands", optionB: "A relay station for sensory and motor information to the cortex", optionC: "The generator of emotional responses", optionD: "The regulator of hormonal secretion", correctAnswer: "B", explanation: "The thalamus relays sensory and motor information to appropriate cortical areas and regulates arousal/consciousness." },
    { topicId: topicMap["Brainstem & Diencephalon"], question: "Damage to which brainstem structure would most directly impair respiration?", optionA: "Midbrain tegmentum", optionB: "Superior colliculus", optionC: "Medullary respiratory centers", optionD: "Red nucleus", correctAnswer: "C", explanation: "The medulla contains pre-Bötzinger complex and respiratory centers that generate the respiratory rhythm." },

    // Limbic System
    { topicId: topicMap["Limbic System"], question: "A patient cannot form new long-term memories but remote memories are intact. Which structure is most likely damaged?", optionA: "Amygdala", optionB: "Hippocampus", optionC: "Cingulate cortex", optionD: "Mammillary bodies", correctAnswer: "B", explanation: "The hippocampus is critical for encoding new declarative memories (anterograde memory). Its damage causes anterograde amnesia as in H.M." },
    { topicId: topicMap["Limbic System"], question: "Klüver-Bucy syndrome results from bilateral damage to the:", optionA: "Hippocampus", optionB: "Cingulate cortex", optionC: "Amygdala", optionD: "Frontal lobes", correctAnswer: "C", explanation: "Bilateral amygdala damage causes Klüver-Bucy syndrome: hypersexuality, hyperphagia, visual agnosia, and docility." },

    // Cerebral Cortex
    { topicId: topicMap["Cerebral Cortex"], question: "A patient produces fluent, grammatical-sounding speech but uses incorrect words and cannot understand language. This is most consistent with:", optionA: "Broca's aphasia", optionB: "Global aphasia", optionC: "Wernicke's aphasia", optionD: "Conduction aphasia", correctAnswer: "C", explanation: "Wernicke's aphasia (posterior superior temporal gyrus lesion) produces fluent but paraphasic speech with poor comprehension." },
    { topicId: topicMap["Cerebral Cortex"], question: "The homunculus is largest for which body regions?", optionA: "Torso and legs", optionB: "Hands and face (lips, tongue)", optionC: "Shoulders and hips", optionD: "Eyes and ears", correctAnswer: "B", explanation: "Hands and face have the largest cortical representation due to their high density of sensory/motor innervation." },

    // Sensory & Motor Pathways
    { topicId: topicMap["Sensory & Motor Pathways"], question: "Where do fibers of the dorsal column-medial lemniscal pathway decussate (cross)?", optionA: "Spinal cord level of entry", optionB: "Brainstem at the medullary decussation", optionC: "Thalamus", optionD: "Internal capsule", correctAnswer: "B", explanation: "Dorsal column fibers ascend ipsilaterally to the medulla, synapse in nuclei gracilis/cuneatus, then cross in the medial lemniscus." },
    { topicId: topicMap["Sensory & Motor Pathways"], question: "The spinothalamic tract carries which sensations?", optionA: "Vibration and fine touch", optionB: "Proprioception and stereognosis", optionC: "Pain and temperature", optionD: "Motor commands", correctAnswer: "C", explanation: "The spinothalamic tract (anterolateral system) carries pain, temperature, and crude touch from the contralateral body." },

    // CNS Development
    { topicId: topicMap["CNS Development"], question: "Folic acid supplementation during pregnancy is most important for preventing:", optionA: "Down syndrome", optionB: "Neural tube defects", optionC: "Cerebral palsy", optionD: "Fetal alcohol syndrome", correctAnswer: "B", explanation: "Folic acid is critical for neural tube closure during weeks 3-4 of gestation; deficiency increases risk of spina bifida and anencephaly." },

    // Dementia & Alzheimer's
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "The pathological hallmarks of Alzheimer's disease include:", optionA: "Lewy bodies and synuclein deposits", optionB: "Amyloid plaques and neurofibrillary tangles", optionC: "Huntingtin aggregates", optionD: "TDP-43 inclusions", correctAnswer: "B", explanation: "AD is characterized by beta-amyloid plaques (extracellular) and tau neurofibrillary tangles (intracellular)." },
    { topicId: topicMap["Dementia & Alzheimer's Disease"], question: "Fluctuating cognition, visual hallucinations, and Parkinsonism are characteristic of:", optionA: "Alzheimer's disease", optionB: "Frontotemporal dementia", optionC: "Lewy body dementia", optionD: "Vascular dementia", correctAnswer: "C", explanation: "Lewy body dementia features this triad plus REM sleep behavior disorder; caused by alpha-synuclein (Lewy body) accumulation." },

    // Cerebrovascular System
    { topicId: topicMap["Cerebrovascular System"], question: "The middle cerebral artery (MCA) occlusion typically causes:", optionA: "Homonymous hemianopia only", optionB: "Contralateral hemiplegia and hemisensory loss, worse in the face and arm", optionC: "Bilateral leg weakness", optionD: "Ipsilateral cranial nerve palsies", correctAnswer: "B", explanation: "MCA supplies lateral cortex: motor/sensory areas for face and arm are primarily affected; leg fibers (ACA territory) are spared." },

    // Neuroradiology
    { topicId: topicMap["Neuroradiology"], question: "Which imaging modality is BEST for detecting hyperacute ischemic stroke within the first hour?", optionA: "CT without contrast", optionB: "MRI T1", optionC: "MRI Diffusion-Weighted Imaging (DWI)", optionD: "PET scan", correctAnswer: "C", explanation: "DWI detects restricted water diffusion (cytotoxic edema) within minutes of ischemic onset, before changes appear on CT or T1/T2." },

    // Multiple Sclerosis
    { topicId: topicMap["Multiple Sclerosis"], question: "Lhermitte's sign (electric shock sensation down the spine with neck flexion) suggests lesions in the:", optionA: "Lumbar spinal cord", optionB: "Cervical spinal cord", optionC: "Brainstem", optionD: "Cerebellum", correctAnswer: "B", explanation: "Lhermitte's sign occurs with cervical cord demyelination; flexion mechanically irritates demyelinated dorsal column fibers." },

    // Pain & Nociception
    { topicId: topicMap["Pain & Nociception"], question: "According to gate control theory, activation of large A-beta fibers can reduce pain because:", optionA: "They carry pain signals faster than C fibers", optionB: "They inhibit substantia gelatinosa interneurons that modulate pain transmission", optionC: "They release endorphins in the brainstem", optionD: "They depolarize nociceptors directly", correctAnswer: "B", explanation: "Large fiber input activates inhibitory interneurons in the dorsal horn that reduce C-fiber pain transmission — 'closing the gate'." },

    // Neurogenetics
    { topicId: topicMap["Neurogenetics"], question: "Huntington's disease is caused by:", optionA: "Autosomal recessive mutation in the PARK2 gene", optionB: "X-linked trinucleotide expansion in FMR1", optionC: "Autosomal dominant CAG repeat expansion in HTT", optionD: "Mitochondrial DNA mutation", correctAnswer: "C", explanation: "Huntington's disease: autosomal dominant CAG repeat expansion in huntingtin gene (chromosome 4); > 36 repeats is pathological." },

    // Visual System
    { topicId: topicMap["Visual System"], question: "Bitemporal hemianopia is classically caused by:", optionA: "Optic nerve lesion", optionB: "Lateral geniculate nucleus lesion", optionC: "Optic chiasm lesion (e.g., pituitary tumor)", optionD: "Occipital cortex lesion", correctAnswer: "C", explanation: "At the optic chiasm, nasal fibers (carrying temporal visual field information) cross; damage here causes bitemporal hemianopia." },

    // Auditory System
    { topicId: topicMap["Auditory System"], question: "In the cochlea, high-frequency sounds are detected at the:", optionA: "Apex of the cochlea", optionB: "Base of the cochlea", optionC: "Middle turns uniformly", optionD: "Outer hair cells only", correctAnswer: "B", explanation: "Tonotopy: high-frequency sounds cause maximum basilar membrane vibration at the basal (stiff, narrow) end of the cochlea." },

    // Somatosensory & Touch
    { topicId: topicMap["Somatosensory & Touch"], question: "Which mechanoreceptor is best suited for detecting vibration?", optionA: "Merkel's discs", optionB: "Ruffini endings", optionC: "Meissner's corpuscles", optionD: "Pacinian corpuscles", correctAnswer: "D", explanation: "Pacinian corpuscles are rapidly adapting receptors sensitive to high-frequency vibration (200-300 Hz)." },

    // Chemical Senses
    { topicId: topicMap["Chemical Senses"], question: "Anosmia (loss of smell) can be an early sign of:", optionA: "Multiple sclerosis", optionB: "Parkinson's disease and Alzheimer's disease", optionC: "Huntington's disease", optionD: "ALS", correctAnswer: "B", explanation: "Olfactory dysfunction is one of the earliest symptoms in Parkinson's and Alzheimer's, preceding motor symptoms by years." },

    // Vestibular System
    { topicId: topicMap["Vestibular System"], question: "BPPV is best treated with:", optionA: "Surgical vestibular neurectomy", optionB: "Antihistamines indefinitely", optionC: "Canalith repositioning maneuver (Epley maneuver)", optionD: "Corticosteroids", correctAnswer: "C", explanation: "The Epley maneuver repositions dislodged otoconia from the semicircular canals back to the utricle, resolving BPPV." },

    // Motor Control
    { topicId: topicMap["Motor Control"], question: "The size principle states that during increasing force production:", optionA: "Large motor units are recruited first, then small ones", optionB: "All motor units are recruited simultaneously", optionC: "Small, slow-twitch motor units are recruited before large, fast-twitch units", optionD: "Motor unit size does not predict recruitment order", correctAnswer: "C", explanation: "Henneman's size principle: small motor neurons are recruited first for fine control; larger units recruited for greater force demands." },

    // Sleep & Circadian Rhythms
    { topicId: topicMap["Sleep & Circadian Rhythms"], question: "Which sleep stage is characterized by high-amplitude, low-frequency delta waves and is most restorative?", optionA: "N1", optionB: "N2", optionC: "N3 (slow-wave sleep)", optionD: "REM", correctAnswer: "C", explanation: "N3 (slow-wave sleep) has delta waves, growth hormone release, and is critical for physical restoration and memory consolidation." },

    // Neuroendocrinology
    { topicId: topicMap["Neuroendocrinology"], question: "In the HPA stress response, the sequence is:", optionA: "ACTH → CRH → cortisol", optionB: "Cortisol → ACTH → CRH", optionC: "CRH → ACTH → cortisol", optionD: "ADH → ACTH → cortisol", correctAnswer: "C", explanation: "The HPA axis: Hypothalamus releases CRH → Anterior pituitary releases ACTH → Adrenal cortex releases cortisol." },

    // Psychopathology
    { topicId: topicMap["Psychopathology"], question: "Negative symptoms of schizophrenia include:", optionA: "Hallucinations and delusions", optionB: "Disorganized speech and thought", optionC: "Flat affect, avolition, and alogia", optionD: "Grandiosity and euphoria", correctAnswer: "C", explanation: "Negative symptoms represent deficits of normal function: flat affect, poverty of speech (alogia), loss of motivation (avolition), anhedonia." },

    // Personality Disorders
    { topicId: topicMap["Personality Disorders"], question: "Which personality disorder is characterized by identity disturbance, emotional instability, impulsivity, and fear of abandonment?", optionA: "Narcissistic PD", optionB: "Borderline PD", optionC: "Antisocial PD", optionD: "Histrionic PD", correctAnswer: "B", explanation: "Borderline PD features: unstable identity, intense/unstable relationships, emotional dysregulation, impulsivity, and chronic fear of abandonment." },

    // Dissociative Disorders
    { topicId: topicMap["Dissociative Disorders"], question: "Depersonalization is best described as:", optionA: "Believing you are two different people", optionB: "Feeling detached from one's own mind or body as an outside observer", optionC: "Memory gaps for personal history", optionD: "Seeing oneself as unreal or unimportant", correctAnswer: "B", explanation: "Depersonalization: feeling of being detached or 'outside' one's mental processes or body. Derealization refers to the external world feeling unreal." },

    // Psychopharmacology
    { topicId: topicMap["Psychopharmacology"], question: "SSRIs work by:", optionA: "Blocking dopamine reuptake", optionB: "Inhibiting MAO enzymes", optionC: "Blocking serotonin reuptake by binding to SERT", optionD: "Enhancing GABA transmission", correctAnswer: "C", explanation: "SSRIs selectively block the serotonin transporter (SERT), preventing serotonin reuptake and increasing synaptic serotonin." },
    { topicId: topicMap["Psychopharmacology"], question: "Benzodiazepines produce their effects by:", optionA: "Blocking NMDA receptors", optionB: "Increasing GABA-A receptor channel opening frequency", optionC: "Inhibiting serotonin reuptake", optionD: "Blocking dopamine D2 receptors", correctAnswer: "B", explanation: "Benzodiazepines are positive allosteric modulators of GABA-A receptors, increasing the frequency of chloride channel opening." },

    // Coping & Defense Mechanisms
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "Which of the following is considered a mature defense mechanism?", optionA: "Splitting", optionB: "Projection", optionC: "Denial", optionD: "Sublimation", correctAnswer: "D", explanation: "Sublimation (channeling impulses into socially acceptable activities) is a mature defense. Splitting, projection, and denial are more primitive." },
    { topicId: topicMap["Coping & Defense Mechanisms"], question: "Projection involves:", optionA: "Attributing your own unacceptable feelings to others", optionB: "Converting anxiety into physical symptoms", optionC: "Reverting to earlier developmental behaviors", optionD: "Channeling impulses into productive activities", correctAnswer: "A", explanation: "Projection: an individual attributes their own repressed/unacceptable thoughts, feelings, or motivations to other people." },
  ];

  await db.insert(quizQuestionsTable).values(quizQuestions);
  console.log(`Inserted ${quizQuestions.length} quiz questions`);

  const studyGuides = [
    {
      topicId: topicMap["Neuropsychology Overview"],
      title: "Neuropsychology Overview Study Guide",
      content: `# Neuropsychology Overview

## What is Neuropsychology?
Neuropsychology is the scientific discipline studying the relationship between brain structure/function and psychological processes including cognition, behavior, and emotion. It bridges neurology and psychology.

## Key Concepts

### Brain-Behavior Relationships
- **Localization of function**: Specific brain regions are associated with specific functions (e.g., hippocampus → memory)
- **Equipotentiality**: The brain can compensate for damage; other regions can take over functions (especially in early development)
- **Plasticity**: The brain's ability to reorganize following injury or experience

### Assessment Approaches
- **Standardized batteries**: Halstead-Reitan, Luria-Nebraska — comprehensive testing of multiple domains
- **Flexible approach**: Tailoring tests to specific referral question
- **Process approach**: HOW a patient performs, not just what score they achieve

### Lateralization
- Left hemisphere: Language (in most right-handers), analytical processing
- Right hemisphere: Visuospatial processing, prosody, holistic processing
- Split-brain research (Gazzaniga, Sperry): revealed independent functioning of hemispheres

### Important Terms
- **Diaschisis**: Remote functional loss from intact areas connected to a lesion
- **Hemineglect**: Failure to attend to one side of space (usually right hemisphere lesion → left neglect)
- **Anosognosia**: Unawareness of one's own neurological deficit
- **Double dissociation**: Two conditions each selectively impair different functions, proving independence

## Key Figures
- **Paul Broca**: Identified left frontal role in speech production
- **Carl Wernicke**: Identified posterior temporal role in language comprehension
- **Alexander Luria**: Developed systematic neuropsychological assessment
- **Roger Sperry**: Split-brain research (Nobel Prize 1981)

## Clinical Applications
- Neuropsychological assessment for: TBI, dementia, epilepsy, stroke, learning disabilities
- Rehabilitation planning based on cognitive strengths and weaknesses
- Legal/forensic neuropsychology: capacity evaluations, disability assessments`
    },
    {
      topicId: topicMap["Cell Biology & Neuron Anatomy"],
      title: "Cell Biology & Neuron Anatomy Study Guide",
      content: `# Cell Biology & Neuron Anatomy

## Neuron Structure
- **Soma (cell body)**: Contains nucleus and organelles; integrates signals
- **Dendrites**: Branching extensions that receive synaptic input
- **Axon**: Single projection transmitting action potentials; can be very long (motor neurons > 1m)
- **Axon hillock**: Where action potentials are initiated (lowest threshold)
- **Axon terminals (boutons)**: Contain synaptic vesicles with neurotransmitters
- **Myelin sheath**: Lipid-rich insulation produced by oligodendrocytes (CNS) or Schwann cells (PNS)
- **Nodes of Ranvier**: Unmyelinated gaps where action potentials jump (saltatory conduction)

## Types of Neurons
- **Multipolar**: Most common; one axon, many dendrites (motor neurons)
- **Bipolar**: One axon + one dendrite; sensory neurons (retina, cochlea)
- **Unipolar (pseudounipolar)**: Single process; most sensory neurons in PNS
- **Interneurons**: Connect neurons; most numerous type in CNS

## Glial Cells
| Cell Type | Location | Function |
|-----------|----------|----------|
| Astrocytes | CNS | BBB, metabolic support, K+ buffering, synapse formation |
| Oligodendrocytes | CNS | Myelin production (one cell → 50 axons) |
| Schwann cells | PNS | Myelin production (one cell → one axon segment) |
| Microglia | CNS | Immune defense, phagocytosis |
| Ependymal cells | Ventricles | CSF production and circulation |

## Action Potential
1. **Resting**: -70mV; Na+ outside, K+ inside
2. **Threshold**: -55mV triggers opening of voltage-gated Na+ channels
3. **Depolarization**: Na+ rushes in → membrane reaches +40mV
4. **Repolarization**: Na+ channels inactivate; K+ channels open, K+ exits
5. **Hyperpolarization**: Brief undershoot below -70mV (absolute then relative refractory period)
6. **Restoration**: Na+/K+ ATPase pump restores resting state

## Synaptic Transmission
1. Action potential arrives at terminal bouton
2. Depolarization opens voltage-gated Ca²+ channels
3. Ca²+ influx triggers vesicle fusion and neurotransmitter release
4. Neurotransmitters bind postsynaptic receptors
5. EPSP or IPSP generated
6. Neurotransmitter cleared (reuptake, enzymatic degradation, or diffusion)

## Key Neurotransmitters
- **Glutamate**: Main excitatory; NMDA, AMPA, kainate receptors
- **GABA**: Main inhibitory; GABA-A (Cl-), GABA-B (K+)
- **Dopamine**: Motor control, reward, motivation
- **Serotonin**: Mood, sleep, appetite, cognition
- **Acetylcholine**: Neuromuscular junction, memory, autonomic nervous system
- **Norepinephrine**: Arousal, attention, stress response`
    },
    {
      topicId: topicMap["Cerebral Cortex"],
      title: "Cerebral Cortex Study Guide",
      content: `# Cerebral Cortex

## Cortical Organization
The cerebral cortex is divided into 4 lobes, with ~52 Brodmann areas defined by cytoarchitecture. It contains ~16 billion neurons organized in 6 layers.

## Lobes and Functions

### Frontal Lobe
- **Primary motor cortex (M1)**: Precentral gyrus (BA 4) — voluntary movement
- **Premotor cortex (PMC)**: Movement planning and preparation
- **Supplementary motor area (SMA)**: Complex movement sequences, bimanual coordination
- **Prefrontal cortex (PFC)**: Executive function, working memory, decision-making, personality
- **Broca's area (BA 44, 45)**: Left hemisphere speech production
- **Frontal eye fields**: Voluntary eye movements

### Parietal Lobe
- **Primary somatosensory cortex (S1)**: Postcentral gyrus (BA 1, 2, 3) — touch, proprioception
- **Association cortex**: Spatial awareness, attention, body schema
- **Angular gyrus (BA 39)**: Reading, writing, math (dominant hemisphere)
- **Lesion effects**: Hemi-neglect (right), apraxia, Gerstmann syndrome (left: finger agnosia, agraphia, acalculia, L-R disorientation)

### Temporal Lobe
- **Primary auditory cortex (A1)**: Heschl's gyrus (BA 41-42)
- **Wernicke's area (BA 22)**: Left hemisphere language comprehension
- **Fusiform gyrus**: Face recognition, object recognition
- **Parahippocampal gyrus**: Memory encoding context
- **Lesion effects**: Wernicke's aphasia, prosopagnosia, semantic memory deficits

### Occipital Lobe
- **Primary visual cortex (V1/striate)**: BA 17 — basic visual processing
- **V2-V5**: Higher visual processing
- **Dorsal stream (where)**: To parietal → spatial processing, motion
- **Ventral stream (what)**: To temporal → object/face recognition
- **Lesion effects**: Visual field deficits, cortical blindness (bilateral), visual agnosia

## Language
- **Broca's aphasia**: Non-fluent, effortful speech; comprehension intact; repetition poor
- **Wernicke's aphasia**: Fluent but paraphasic; comprehension poor; repetition poor
- **Conduction aphasia**: Fluent speech, intact comprehension, poor repetition (arcuate fasciculus)
- **Global aphasia**: All language functions severely impaired (large left MCA)
- **Transcortical aphasias**: Repetition preserved

## Executive Function (PFC)
- Working memory, cognitive flexibility, inhibition
- Planning, problem-solving, abstract reasoning
- Emotional regulation, social behavior
- Damage → perseveration, disinhibition, poor planning (frontal lobe syndrome)

## Hemispheric Specialization
| Function | Left | Right |
|----------|------|-------|
| Language | Dominant (95% right-handers) | Prosody, pragmatics |
| Visuospatial | Analytical | Holistic, spatial |
| Attention | Bilateral | Right hemisphere dominant for sustained attention |
| Face processing | Part-based | Holistic |`
    },
    {
      topicId: topicMap["Limbic System"],
      title: "Limbic System Study Guide",
      content: `# Limbic System

## Overview
The limbic system is a set of brain structures involved in emotion, memory, and certain aspects of behavior. The term was introduced by Paul MacLean; includes both cortical and subcortical structures.

## Key Structures

### Hippocampus
- Located in medial temporal lobe
- Critical for **declarative memory** (episodic + semantic) formation
- Role in **spatial navigation** (place cells)
- Patient H.M.: bilateral hippocampectomy → profound anterograde amnesia
- Damage → anterograde amnesia; remote memories often preserved (consolidation)

### Amygdala
- Almond-shaped structure in anterior temporal lobe
- Processes **emotional memories** (especially fear conditioning)
- **Threat detection** and emotional response generation
- Modulates memory consolidation (emotional events remembered better)
- Lesions → impaired fear conditioning, Klüver-Bucy syndrome (bilateral)

### Cingulate Cortex
- **Anterior cingulate**: Conflict monitoring, error detection, emotional regulation, pain
- **Posterior cingulate**: Default mode network, self-referential processing, memory

### Other Structures
- **Fornix**: White matter output tract of hippocampus → mammillary bodies
- **Mammillary bodies**: Memory relay (part of Papez circuit)
- **Septal nuclei**: Reward, pleasure, modulation of hippocampal activity
- **Parahippocampal gyrus**: Scene recognition, contextual memory encoding
- **Entorhinal cortex**: Gateway to hippocampus; affected early in AD

## Papez Circuit (Memory Circuit)
Hippocampus → Fornix → Mammillary bodies → Anterior thalamus → Cingulate cortex → Parahippocampal gyrus → Hippocampus

## Memory Types
- **Explicit/Declarative**: Requires hippocampus
  - Episodic: personal events with time/place context
  - Semantic: general knowledge/facts
- **Implicit/Non-declarative**: Does NOT require hippocampus
  - Procedural: motor skills (cerebellum, basal ganglia)
  - Priming: implicit memory effects
  - Conditioning: classical conditioning (amygdala for fear)

## Clinical Correlates
| Condition | Structure | Effects |
|-----------|-----------|---------|
| Anterograde amnesia | Hippocampus bilateral | Cannot form new declarative memories |
| PTSD | Amygdala hyperactivity, hippocampal atrophy | Fear memories, contextual memory disruption |
| Temporal lobe epilepsy | Hippocampus | Seizures, memory impairment, emotional symptoms |
| Korsakoff syndrome | Mammillary bodies + thalamus | Anterograde + retrograde amnesia, confabulation |`
    },
    {
      topicId: topicMap["Dementia & Alzheimer's Disease"],
      title: "Dementia & Alzheimer's Disease Study Guide",
      content: `# Dementia & Alzheimer's Disease

## What is Dementia?
Dementia is a syndrome of progressive cognitive decline affecting memory, language, executive function, and/or other domains, severe enough to interfere with daily functioning. It is NOT a normal part of aging.

## Alzheimer's Disease (AD)

### Epidemiology
- Most common cause of dementia (~60-70% of cases)
- Prevalence doubles every 5 years after age 65
- Risk factors: age, APOE ε4 allele, family history, Down syndrome (chromosome 21 — amyloid precursor protein)

### Pathophysiology
- **Amyloid plaques**: Extracellular deposits of beta-amyloid (Aβ) peptide, derived from APP cleavage by β- and γ-secretase
- **Neurofibrillary tangles (NFTs)**: Intracellular hyperphosphorylated tau protein disrupts microtubule stability
- **Neuronal loss**: Especially cholinergic neurons (nucleus basalis of Meynert) and hippocampal neurons
- **Neuroinflammation**: Microglial activation contributes to progression

### Clinical Features
- **Early**: Episodic memory loss (especially new learning), word-finding difficulties
- **Moderate**: Getting lost, language deficits, behavioral changes
- **Late**: Inability to recognize family, incontinence, loss of basic ADLs
- Language: anomia → paraphasias → aphasia
- Visuospatial: getting lost, difficulty copying figures

### Neuropsychological Profile
- Impaired: new learning/recall > recognition, naming
- Preserved early: procedural memory, remote memory (initially), personality (until moderate stage)
- Executive function and attention impaired as disease progresses

## Other Dementias

### Lewy Body Dementia (LBD)
- Alpha-synuclein Lewy bodies throughout cortex and brainstem
- Core features: **fluctuating cognition**, **visual hallucinations** (complex, formed), **Parkinsonism**
- REM sleep behavior disorder is common
- Sensitivity to antipsychotics (can cause severe reactions)
- Visuospatial deficits more prominent than memory early

### Vascular Dementia
- Caused by cerebrovascular disease (multiple infarcts, white matter disease)
- **Stepwise** decline following strokes
- Executive dysfunction and processing speed impaired early
- Focal neurological signs present

### Frontotemporal Dementia (FTD)
- Earlier onset (50s-60s), personality/behavioral changes (bvFTD) or language variants (PPA)
- bvFTD: disinhibition, apathy, compulsive behaviors, dietary changes
- Frontotemporal and temporal atrophy on imaging
- TDP-43 or tau pathology

### Normal Pressure Hydrocephalus (NPH)
- Triad: cognitive impairment, gait disturbance ("magnetic gait"), urinary incontinence
- Treatable with ventriculoperitoneal shunt!

## Assessment
- Cognitive screening: MMSE (30-point), MoCA (more sensitive, 30-point)
- Comprehensive neuropsychological testing
- Neuroimaging: MRI (atrophy pattern), FDG-PET (hypometabolism), amyloid PET
- Biomarkers: CSF Aβ42/tau ratio; plasma Aβ42/40

## Management
- Cholinesterase inhibitors (donepezil, rivastigmine, galantamine) for AD and LBD
- Memantine (NMDA antagonist) for moderate-severe AD
- Amyloid antibodies (lecanemab, donanemab) for early AD
- Behavioral and environmental interventions`
    },
    {
      topicId: topicMap["Multiple Sclerosis"],
      title: "Multiple Sclerosis Study Guide",
      content: `# Multiple Sclerosis

## Overview
Multiple sclerosis is a chronic autoimmune, demyelinating disease of the CNS. Characterized by inflammation causing demyelination, axonal damage, and scarring (sclerosis) in the white matter.

## Epidemiology
- Peak onset 20-40 years; female > male (3:1)
- Higher prevalence at higher latitudes (less sunlight/Vitamin D)
- More common in people of Northern European descent

## Pathophysiology
- Autoreactive T cells attack myelin
- Demyelination disrupts signal conduction → symptoms
- Inflammation leads to plaques (sclerotic lesions)
- Remyelination possible → recovery; repeated attacks → permanent axonal damage
- CSF: oligoclonal bands (IgG), elevated IgG index

## Types
| Type | Description |
|------|-------------|
| RRMS | Relapsing-remitting: attacks with recovery periods (85% at onset) |
| SPMS | Secondary progressive: progressive after initial RRMS phase |
| PPMS | Primary progressive: steady progression from onset (15%) |
| PRMS | Progressive-relapsing: progressive with superimposed relapses |

## Clinical Features
- **Optic neuritis**: Painful vision loss, afferent pupillary defect (RAPD); common first presentation
- **Internuclear ophthalmoplegia**: MLF lesion → impaired adduction with nystagmus of abducting eye
- **Lhermitte's sign**: Electric shock with neck flexion (cervical cord lesion)
- **Uhthoff's phenomenon**: Symptom worsening with heat/exercise
- **Charcot's triad**: Nystagmus, intention tremor, scanning speech (cerebellar MS)
- Sensory disturbances, spasticity, bladder dysfunction, fatigue, cognitive impairment

## Diagnosis (McDonald Criteria)
- Dissemination in space AND time on MRI
- MRI: periventricular, juxtacortical, infratentorial, or spinal cord lesions
- Lesions: T2 hyperintense, gadolinium-enhancing (active)
- Exclude other diagnoses (neuromyelitis optica, vasculitis, etc.)

## Treatment
- **Acute attacks**: IV methylprednisolone (steroids)
- **Disease-modifying therapies (DMTs)**: Reduce relapse rate and slow progression
  - Low-efficacy: interferon-beta, glatiramer acetate
  - Moderate: natalizumab, dimethyl fumarate
  - High-efficacy: alemtuzumab, ocrelizumab (anti-CD20)
- Symptom management: spasticity (baclofen), fatigue (amantadine), bladder dysfunction

## Neuropsychological Impact
- Cognitive slowing (processing speed) most common
- Working memory and executive function impaired
- Episodic memory affected
- Depression and anxiety highly prevalent (50%)
- Fatigue is the most disabling symptom for many patients`
    },
    {
      topicId: topicMap["Psychopharmacology"],
      title: "Psychopharmacology Study Guide",
      content: `# Psychopharmacology

## Major Neurotransmitter Systems

### Serotonin System
- Produced in raphe nuclei (brainstem)
- Regulates: mood, sleep, appetite, cognition, pain
- Receptors: 5-HT1 through 5-HT7 (14+ subtypes)

### Dopamine System
- Pathways: mesolimbic (reward), mesocortical (cognition), nigrostriatal (motor), tuberoinfundibular (prolactin)
- Receptors: D1-D5 (D1/D5 = Gs; D2/D3/D4 = Gi)

### Norepinephrine System
- Produced in locus coeruleus
- Regulates: arousal, attention, stress response, mood

### GABA System
- Main inhibitory neurotransmitter
- GABA-A (ionotropic, Cl-) and GABA-B (metabotropic, K+)

### Glutamate System  
- Main excitatory neurotransmitter
- NMDA, AMPA, kainate, metabotropic receptors
- NMDA: learning, memory, plasticity (Mg²+ block removed by depolarization)

## Antidepressants

### SSRIs (Selective Serotonin Reuptake Inhibitors)
- Mechanism: Block SERT → increase synaptic serotonin
- Examples: fluoxetine, sertraline, escitalopram, paroxetine
- Uses: Depression, anxiety, OCD, PTSD, eating disorders
- Side effects: Sexual dysfunction, GI effects, insomnia/sedation, initial anxiety spike

### SNRIs (Serotonin-Norepinephrine Reuptake Inhibitors)
- Mechanism: Block SERT and NET
- Examples: venlafaxine, duloxetine
- Uses: Depression, anxiety, pain disorders, fibromyalgia

### TCAs (Tricyclic Antidepressants)
- Mechanism: Block SERT, NET, histamine, muscarinic, alpha receptors
- Examples: amitriptyline, imipramine, nortriptyline
- Risk: Anticholinergic effects, cardiotoxic in overdose

### MAOIs (Monoamine Oxidase Inhibitors)
- Mechanism: Inhibit MAO → increase monoamines
- Risk: Tyramine-containing foods → hypertensive crisis; multiple drug interactions

### Atypicals
- **Bupropion**: NE/DA reuptake inhibitor; activating; no sexual side effects; used for smoking cessation
- **Mirtazapine**: Alpha-2 blocker + antihistamine; sedating; weight gain; good for insomnia + depression

## Antipsychotics

### Typical/First-Generation
- Mechanism: Primarily D2 antagonism
- Examples: haloperidol, chlorpromazine
- Side effects: EPS (akathisia, dystonia, Parkinsonism), tardive dyskinesia, NMS

### Atypical/Second-Generation
- Mechanism: D2 + 5-HT2A antagonism (reduced EPS)
- Examples: clozapine, olanzapine, risperidone, quetiapine, aripiprazole
- Side effects: Metabolic syndrome (weight gain, diabetes, dyslipidemia)
- Clozapine: Most effective for treatment-resistant schizophrenia; risk of agranulocytosis

### Tardive Dyskinesia
- Caused by chronic D2 blockade → receptor supersensitivity
- Involuntary, repetitive movements (oral-facial, limbs)
- Treatment: VMAT2 inhibitors (valbenazine, deutetrabenazine)

## Anxiolytics

### Benzodiazepines
- Mechanism: Positive allosteric modulator of GABA-A (↑ Cl- channel opening frequency)
- Examples: diazepam, lorazepam, alprazolam, clonazepam
- Short-acting: Lorazepam, oxazepam (safer in elderly/liver disease — no active metabolites)
- Risk: Dependence, tolerance, withdrawal (seizures), sedation, cognitive impairment

### Buspirone
- Mechanism: 5-HT1A partial agonist (not a BZD)
- No dependence risk; takes weeks to work; no acute effects
- Use: GAD (not panic or PTSD)

## Mood Stabilizers
- **Lithium**: Exact mechanism uncertain; reduces inositol signaling; narrow therapeutic index; monitor levels, renal function, thyroid
- **Valproate**: Sodium channel block + GABA enhancement; teratogenic
- **Lamotrigine**: Sodium channel blocker; effective for bipolar depression; Stevens-Johnson syndrome risk

## Stimulants (ADHD)
- Methylphenidate: Blocks DAT and NET
- Amphetamines: Reverse DAT and NET (release > reuptake block)
- Non-stimulant alternative: Atomoxetine (NET inhibitor)`
    },
    {
      topicId: topicMap["Sleep & Circadian Rhythms"],
      title: "Sleep & Circadian Rhythms Study Guide",
      content: `# Sleep & Circadian Rhythms

## Sleep Architecture

### NREM Sleep
- **N1 (Stage 1)**: Light sleep; theta waves; hypnic jerks; 5% of sleep
- **N2 (Stage 2)**: Sleep spindles (12-15 Hz bursts) and K-complexes; 50% of sleep
- **N3 (Slow-wave sleep)**: Delta waves (< 2 Hz); most restorative; growth hormone; memory consolidation

### REM Sleep
- Rapid Eye Movements; EEG similar to waking (desynchronized)
- Muscle atonia (except diaphragm and eye muscles)
- Dreaming most vivid here
- Memory consolidation (especially procedural and emotional memories)
- ~25% of total sleep

### Sleep Cycle
- 90-minute cycles repeated 4-6 times per night
- More deep sleep (N3) in early night; more REM in later cycles

## Circadian Regulation

### Suprachiasmatic Nucleus (SCN)
- Located in hypothalamus above optic chiasm
- Master circadian pacemaker (~24-hour rhythm)
- Synchronizes to light via retinohypothalamic tract
- Controls melatonin secretion from pineal gland

### Two-Process Model of Sleep
- **Process S (homeostatic)**: Sleep pressure builds during waking (adenosine accumulation)
- **Process C (circadian)**: Internal clock modulates alertness
- Sleep occurs when pressure S > circadian wake signal

### Melatonin
- Secreted by pineal gland in darkness
- Signals circadian phase (not a sleep-inducer per se)
- Suppressed by blue light; peaks 2-3 hours before habitual sleep time

## Neurotransmitters in Sleep
- **Wake-promoting**: Orexin/hypocretin (lateral hypothalamus), histamine, NE, 5-HT, ACh
- **Sleep-promoting**: GABA, adenosine, galanin (VLPO)

## Sleep Disorders

### Insomnia
- Difficulty initiating/maintaining sleep or early awakening
- Cognitive behavioral therapy for insomnia (CBT-I) is first-line treatment

### Obstructive Sleep Apnea (OSA)
- Repeated upper airway collapse during sleep → hypoxia, arousal
- Daytime sleepiness, snoring, witnessed apneas
- Treatment: CPAP

### Narcolepsy
- Excessive daytime sleepiness + cataplexy (sudden muscle weakness with emotion)
- Caused by loss of orexin (hypocretin) neurons in hypothalamus
- Sleep paralysis and hypnagogic hallucinations common

### REM Sleep Behavior Disorder (RBD)
- Loss of REM muscle atonia → physically acting out dreams
- Strong prodromal marker for alpha-synucleinopathies (Parkinson's, DLB, MSA)

### Restless Leg Syndrome
- Irresistible urge to move legs, worse at rest/night
- Associated with dopamine deficiency, iron deficiency
- Treatment: dopamine agonists, iron supplementation`
    },
    {
      topicId: topicMap["Psychopathology"],
      title: "Psychopathology Study Guide",
      content: `# Psychopathology

## Schizophrenia

### Positive Symptoms (excess of normal function)
- Hallucinations: Auditory most common (command, commenting, 3rd person)
- Delusions: Persecutory, referential, grandiose, somatic
- Disorganized thinking: Loose associations, tangentiality, word salad
- Disorganized behavior: Catatonia, inappropriate affect

### Negative Symptoms (deficit of normal function)
- **Flat affect**: Diminished emotional expression
- **Alogia**: Poverty of speech
- **Avolition**: Lack of motivation/goal-directed behavior
- **Anhedonia**: Inability to experience pleasure
- **Asociality**: Social withdrawal

### Neurobiology
- Dopamine hypothesis: mesolimbic hyperactivity (positive symptoms); mesocortical hypoactivity (negative/cognitive)
- Glutamate hypothesis: NMDA hypofunction (ketamine model)
- Structural: Enlarged ventricles, reduced grey matter (especially PFC, temporal)

## Mood Disorders

### Major Depressive Disorder (MDD)
- At least 5 of: depressed mood, anhedonia, weight/appetite change, sleep disturbance, psychomotor agitation/retardation, fatigue, worthlessness/guilt, poor concentration, suicidal ideation
- At least 2 weeks; causes functional impairment
- Neural correlates: Reduced prefrontal activity, amygdala hyperactivity, HPA axis dysregulation

### Bipolar Disorder
- **Bipolar I**: Full manic episodes (7+ days or hospitalized); depressive episodes
- **Bipolar II**: Hypomanic episodes (4+ days); major depressive episodes; NO full mania
- Cyclothymia: Subsyndromal hypomania + depression ≥ 2 years

## Anxiety Disorders

### Generalized Anxiety Disorder (GAD)
- Excessive worry (≥ 6 months) across multiple domains
- Physical symptoms: muscle tension, fatigue, sleep disturbance, difficulty concentrating

### Panic Disorder
- Recurrent unexpected panic attacks + worry about future attacks or behavior change
- Attacks: palpitations, shortness of breath, chest pain, dizziness, derealization, fear of dying

### PTSD
- After traumatic event: Re-experiencing (flashbacks, nightmares), avoidance, negative cognitions/mood, hyperarousal
- Amygdala hyperactivity, hippocampal volume reduction, prefrontal hypoactivity

## OCD and Related Disorders
- **OCD**: Intrusive obsessions + compulsions; ego-dystonic; responds to SSRIs + ERP
- **Body Dysmorphic Disorder**: Preoccupation with perceived physical defect
- Neural: Orbitofrontal-striatal circuit hyperactivity

## ADHD
- Inattention and/or hyperactivity-impulsivity; onset before age 12; present in ≥ 2 settings
- Prefrontal and striatal dopamine/norepinephrine deficiency
- Neuropsychological: Working memory, inhibition, processing speed deficits

## Autism Spectrum Disorder
- Social communication deficits + restricted/repetitive behaviors
- Early onset; highly heterogeneous
- Neural: Atypical connectivity patterns, mirror neuron system differences`
    },
  ];

  await db.insert(studyGuidesTable).values(studyGuides);
  console.log(`Inserted ${studyGuides.length} study guides`);

  console.log("Seeding complete!");
  process.exit(0);
}

seed().catch(err => {
  console.error("Seed error:", err);
  process.exit(1);
});
