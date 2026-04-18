import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  topicsTable, flashcardsTable, quizQuestionsTable,
  studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable,
} from "./schema";

async function seed() {
  console.log("Seeding Central Nervous System topic...");

  const [topic] = await db.insert(topicsTable).values({
    name: "Central Nervous System",
    category: "Neuroanatomy",
    description: "Organization and structure of the CNS — meninges, CSF, blood-brain barrier, spinal cord anatomy, ascending and descending tracts, brainstem, thalamus, spinal cord syndromes, and neuroplasticity.",
  }).returning();

  const topicId = topic.id;
  console.log(`✓ Topic id=${topicId}`);

  const flashcards = [
    // Organization
    { question: "What two structures make up the central nervous system (CNS)?", answer: "The brain (cerebrum, cerebellum, brainstem) and the spinal cord. The CNS is protected by bone (skull and vertebral column), meninges, and the blood-brain barrier, and it is bathed in cerebrospinal fluid.", difficulty: "easy" },
    { question: "What are the three meningeal layers and what spaces lie between them?", answer: "1) Dura mater — outermost, thick, fibrous (two layers in cranium: periosteal and meningeal). 2) Arachnoid mater — middle, avascular, web-like. 3) Pia mater — innermost, tightly adherent to brain/cord surface. Spaces: epidural (potential space in skull; real space in spinal cord with fat/veins), subdural (potential space between dura and arachnoid), subarachnoid (real space between arachnoid and pia — contains CSF, major arteries).", difficulty: "medium" },
    { question: "What is the epidural space and why does it differ between the cranium and spinal cord?", answer: "In the cranium, the epidural space is a potential space (dura is adherent to skull) — arterial bleeds can strip the dura to form epidural hematomas. In the spinal canal, the epidural space is a real space filled with fat and venous plexuses — the target for epidural anesthesia.", difficulty: "hard" },
    { question: "What is the subdural space and what fills it clinically?", answer: "The subdural space is a potential space between the dura and arachnoid. Under normal conditions it contains a thin film of serous fluid. Clinically, bridging veins crossing this space can tear (often from venous bleeding in elderly or trauma), producing a subdural hematoma — venous blood accumulates, compressing the brain.", difficulty: "medium" },
    // CSF
    { question: "Where is cerebrospinal fluid (CSF) produced and where is it absorbed?", answer: "CSF is produced primarily by the choroid plexus (specialized epithelial cells) lining the lateral, third, and fourth ventricles — approximately 500 mL/day, with ~150 mL circulating at any time. It is absorbed back into the venous system primarily through arachnoid granulations (villi) projecting into the superior sagittal sinus.", difficulty: "medium" },
    { question: "What is the path of CSF circulation?", answer: "Lateral ventricles → interventricular foramina (Monro) → third ventricle → cerebral aqueduct (Sylvius) → fourth ventricle → median aperture (Magendie) and lateral apertures (Luschka) → subarachnoid space → absorbed at arachnoid granulations. Blockage at any point causes obstructive (non-communicating) hydrocephalus.", difficulty: "medium" },
    { question: "What are the functions of cerebrospinal fluid?", answer: "1) Mechanical cushion — buoyancy reduces effective brain weight from ~1,400g to ~50g, protecting against acceleration/deceleration injury. 2) Metabolic waste removal — 'glymphatic' flow during sleep clears amyloid and tau. 3) Chemical buffering — pH regulation affects brainstem respiratory control. 4) Delivery of neuroactive substances between brain regions. 5) Immune surveillance.", difficulty: "medium" },
    { question: "What is hydrocephalus and how are obstructive and communicating types different?", answer: "Hydrocephalus is abnormal accumulation of CSF causing ventricular enlargement. Obstructive (non-communicating): blockage within the ventricular system (e.g., cerebral aqueduct stenosis, posterior fossa tumor) — CSF cannot exit ventricles. Communicating: CSF exits ventricles but absorption is impaired (e.g., meningitis scarring arachnoid granulations, subarachnoid hemorrhage) or overproduction (rare choroid plexus papilloma).", difficulty: "hard" },
    // BBB
    { question: "What is the blood-brain barrier (BBB) and what structures form it?", answer: "The BBB is a selective permeability barrier between the systemic circulation and the CNS. It is formed by: 1) Tight junctions between brain capillary endothelial cells (primary barrier). 2) Astrocyte endfeet (perivascular processes that envelop capillaries and signal barrier maintenance). 3) Pericytes (regulate BBB permeability). 4) Basement membrane.", difficulty: "medium" },
    { question: "What substances can cross the blood-brain barrier freely?", answer: "Freely crossing: lipid-soluble molecules (O2, CO2, steroid hormones, anesthetic gases, ethanol, many psychoactive drugs). Transported across: glucose (GLUT1), amino acids (LAT1), and certain ions (Na+, K+ regulated). Cannot cross freely: large molecules, most water-soluble drugs, proteins, most ions — unless transported.", difficulty: "medium" },
    { question: "What are the circumventricular organs (CVOs) and why are they significant?", answer: "CVOs are specialized brain regions that lack a complete BBB — including the area postrema (chemoreceptor trigger zone for vomiting), median eminence, subfornical organ, organum vasculosum of the lamina terminalis, and neurohypophysis. They allow the brain to sample circulating molecules (hormones, toxins, osmolality) and coordinate systemic responses.", difficulty: "hard" },
    { question: "How does the blood-brain barrier break down in disease?", answer: "BBB disruption occurs in: stroke (ischemia disrupts tight junctions), multiple sclerosis (inflammation), traumatic brain injury, CNS infections (meningitis), tumors (glioblastoma destroys normal BBB — allowing gadolinium enhancement on MRI). Breakdown allows immune cell infiltration and edema, often worsening injury.", difficulty: "hard" },
    // Spinal cord external
    { question: "What are the two enlargements of the spinal cord and what do they supply?", answer: "1) Cervical enlargement (C3-T1): contains the motor neurons supplying the upper limbs — gives rise to the brachial plexus. 2) Lumbar enlargement (L1-S2): contains motor neurons supplying the lower limbs — gives rise to the lumbosacral plexus. These enlargements reflect the disproportionate motor neuron pools for limb control.", difficulty: "medium" },
    { question: "What is the conus medullaris and where is it located in adults?", answer: "The conus medullaris is the tapered terminal end of the spinal cord proper, located at approximately the L1-L2 vertebral level in adults (higher in newborns — L3). Below the conus, nerve roots continue in the spinal canal as the cauda equina before exiting through their respective intervertebral foramina.", difficulty: "medium" },
    { question: "What is the filum terminale?", answer: "A thin strand of pial connective tissue (pia mater) that extends from the conus medullaris downward — the filum terminale internum extends to the caudal end of the dural sac (S2), and the filum terminale externum (part of the coccygeal ligament) anchors to the coccyx. It has no neural function — it tethers the cord.", difficulty: "hard" },
    { question: "What is cauda equina syndrome and how does it differ from conus medullaris syndrome?", answer: "Cauda equina syndrome: compression of the lumbar/sacral nerve roots BELOW the conus (L1-S5) — causes LMN signs (flaccid weakness, areflexia, muscle atrophy), saddle anesthesia (S2-S5), and bowel/bladder dysfunction. Conus medullaris syndrome: damage at L1-L2 — mixed UMN/LMN signs because both cord (UMN) and roots (LMN) are involved; prominent sphincter and sexual dysfunction.", difficulty: "hard" },
    // Spinal cord gray matter
    { question: "What are Rexed laminae and how is the spinal cord gray matter organized?", answer: "Rexed laminae are 10 cytoarchitectural zones of the spinal cord gray matter: Laminae I-II (dorsal marginal zone + substantia gelatinosa): pain/temperature input, gate control. Laminae III-IV (nucleus proprius): touch and pressure. Lamina V (WDR neurons): wide-dynamic-range neurons for pain convergence. Lamina VI: joint/muscle proprioception. Lamina VII: intermediate zone (autonomic preganglionic in lateral horn). Lamina VIII-IX: motor interneurons and alpha/gamma motor neurons. Lamina X: central canal region.", difficulty: "hard" },
    { question: "What is the substantia gelatinosa (Lamina II) and its role in pain?", answer: "The substantia gelatinosa is Lamina II of the dorsal horn — densely packed small neurons that receive input from small-diameter pain/temperature fibers (C and Aδ) and modulate pain transmission to projection neurons in Lamina I and V. It is a key site for gate control of pain and opioid action (rich in opioid receptors).", difficulty: "hard" },
    { question: "What is the lateral horn of the spinal cord and where does it exist?", answer: "The lateral horn (also called the intermediolateral cell column) exists only in T1-L2 and S2-S4 cord levels — it contains the preganglionic cell bodies of the autonomic nervous system. T1-L2 lateral horn = sympathetic preganglionic neurons. S2-S4 = parasympathetic preganglionic neurons (sacral parasympathetic).", difficulty: "hard" },
    // White matter tracts
    { question: "What are the three columns (funiculi) of the spinal cord white matter?", answer: "1) Dorsal (posterior) columns: ascending fine touch/proprioception (fasciculus gracilis medially, fasciculus cuneatus laterally). 2) Lateral columns: ascending spinothalamic (anterolateral) and spinocerebellar tracts; descending lateral corticospinal and rubrospinal tracts. 3) Anterior (ventral) columns: descending anterior corticospinal, vestibulospinal, reticulospinal tracts; some ascending anterior spinothalamic.", difficulty: "hard" },
    { question: "What is the dorsal column-medial lemniscal (DCML) pathway?", answer: "The primary ascending pathway for fine touch, vibration, two-point discrimination, joint position sense, and conscious proprioception. First-order: peripheral receptor → dorsal root ganglion → enters spinal cord → ascends IPSILATERALLY (fasciculus gracilis for lower body, fasciculus cuneatus for upper body) → synapses in nucleus gracilis/cuneatus in medulla. Second-order: crosses at medulla (internal arcuate fibers/sensory decussation) → ascends in medial lemniscus → VPL thalamus. Third-order: VPL → posterior limb of internal capsule → S1 (postcentral gyrus).", difficulty: "hard" },
    { question: "What is the spinothalamic (anterolateral) system?", answer: "The primary ascending pathway for pain, temperature, and crude touch. First-order: peripheral nociceptors → dorsal root ganglion → dorsal horn. Second-order: synapses in dorsal horn → crosses immediately via anterior white commissure → ascends CONTRALATERALLY in anterolateral white matter → VPL thalamus. Third-order: VPL → S1 cortex. Clinical: because it crosses immediately in the cord, a unilateral cord lesion causes CONTRALATERAL pain/temperature loss below the lesion.", difficulty: "hard" },
    { question: "What is the lateral corticospinal tract and where does it cross?", answer: "The primary descending voluntary motor pathway. Cell bodies in the motor cortex (M1) → descend through corona radiata → posterior limb of internal capsule → cerebral peduncles → pons base → medullary pyramids → ~85-90% cross at the pyramidal decussation (medulla-cord junction) → descend in the LATERAL column of the cord → synapse on anterior horn motor neurons. The 10-15% that don't cross form the anterior corticospinal tract, crossing segmentally.", difficulty: "hard" },
    { question: "What are the four major descending motor tracts of the spinal cord?", answer: "1) Lateral corticospinal tract: voluntary fine motor control of distal limbs (crossed, from motor cortex). 2) Anterior corticospinal tract: axial/proximal motor control (uncrossed initially, crosses segmentally). 3) Rubrospinal tract: from red nucleus — crosses immediately, assists distal limb control. 4) Vestibulospinal tract (lateral): from vestibular nuclei — ipsilateral, facilitates extensor tone for balance. Also: reticulospinal (medial and lateral) for posture and flexor/extensor modulation; tectospinal for head turning.", difficulty: "hard" },
    // UMN vs LMN
    { question: "What are the distinguishing signs of upper motor neuron (UMN) vs lower motor neuron (LMN) lesions?", answer: "UMN lesion (above anterior horn): spasticity (increased tone), hyperreflexia, Babinski sign (dorsiflexion of great toe with plantar stimulation), clonus, minimal atrophy, no fasciculations — weakness affects groups of muscles. LMN lesion (anterior horn cells, nerve roots, peripheral nerves): flaccidity (decreased/absent tone), areflexia, fasciculations, muscle atrophy, no Babinski — weakness may be localized to single muscles or distributions.", difficulty: "medium" },
    { question: "What is the Babinski sign and why does it occur in UMN lesions?", answer: "Babinski sign (extensor plantar response): stimulation of the lateral sole causes dorsiflexion of the great toe and fanning of others. It occurs with UMN lesions because loss of corticospinal input releases the primitive extensor reflex. It is normal in infants before corticospinal myelination. Presence in adults always indicates UMN pathology.", difficulty: "medium" },
    // Spinal cord syndromes
    { question: "What is Brown-Séquard syndrome and what are its characteristic deficits?", answer: "Brown-Séquard syndrome results from hemisection (half-transection) of the spinal cord. Below the lesion: ipsilateral loss of fine touch, vibration, and proprioception (DCML uncrossed in cord — crosses in medulla, above the lesion); contralateral loss of pain and temperature (spinothalamic crosses immediately in cord); ipsilateral UMN weakness and hyperreflexia (corticospinal crosses in medulla, above lesion); at lesion level: ipsilateral LMN signs.", difficulty: "hard" },
    { question: "What is central cord syndrome?", answer: "The most common incomplete spinal cord injury — usually from hyperextension in older patients with cervical spondylosis or from a central cord hemorrhage/syrinx. Mechanism: central gray matter and the most medially located corticospinal fibers (serving upper limbs) are disproportionately damaged. Presentation: upper extremity weakness greater than lower extremity; variable sensory loss; bladder dysfunction; sacral sparing (lateral cord fibers intact).", difficulty: "hard" },
    { question: "What is anterior cord syndrome?", answer: "Infarction or compression of the anterior spinal cord — from anterior spinal artery compromise. Damage to anterior two-thirds of cord: bilateral loss of pain and temperature (spinothalamic tracts) and bilateral motor weakness (corticospinal tracts) below the lesion. Preservation of the dorsal columns: fine touch, vibration, and proprioception are INTACT. Caused by: aortic aneurysm repair, anterior spinal artery occlusion, large disc herniation.", difficulty: "hard" },
    { question: "What is posterior cord syndrome?", answer: "Damage isolated to the dorsal columns — rare in isolation. Loss of fine touch, vibration, proprioception, and two-point discrimination below the lesion — pain/temperature and motor function preserved. Causes: vitamin B12 deficiency (subacute combined degeneration also affects corticospinal tracts), tabes dorsalis (neurosyphilis), Friedreich's ataxia.", difficulty: "hard" },
    { question: "What is syringomyelia?", answer: "A fluid-filled cavity (syrinx) within the spinal cord, most commonly in the cervical cord. The expanding cavity preferentially destroys crossing fibers in the anterior white commissure (spinothalamic fibers crossing to reach the anterolateral system) before damaging gray or dorsal column matter. Clinical result: bilateral loss of pain and temperature sensation in a 'cape' distribution (C5-T1 — shoulders, arms, upper chest) with preserved proprioception and light touch (dorsal columns intact). As the syrinx expands: anterior horn destruction (LMN signs) and eventually corticospinal tract damage (UMN signs below).", difficulty: "hard" },
    { question: "What is subacute combined degeneration of the spinal cord?", answer: "A spinal cord syndrome from vitamin B12 (cobalamin) deficiency — demyelination affects the dorsal columns AND lateral corticospinal tracts simultaneously ('combined'). Presentation: bilateral loss of vibration and proprioception (dorsal columns), UMN signs (spasticity, hyperreflexia — from corticospinal damage), and peripheral neuropathy (since B12 also maintains peripheral myelin). Can also cause subacute cognitive decline. Caused by pernicious anemia, strict veganism, gastric bypass.", difficulty: "hard" },
    // Brainstem
    { question: "What are the three divisions of the brainstem and their major features?", answer: "1) Midbrain: cerebral aqueduct; CN III (oculomotor) and CN IV (trochlear) nuclei; substantia nigra pars compacta (DA neurons); red nucleus; superior/inferior colliculi (visual/auditory reflexes). 2) Pons: CN V, VI, VII, VIII nuclei; middle cerebellar peduncles; respiratory control (apneustic center). 3) Medulla: CN IX, X, XI, XII nuclei; pyramidal decussation; sensory decussation; cardiovascular/respiratory/vomiting centers; inferior olivary nucleus.", difficulty: "hard" },
    { question: "What is the reticular formation and what does it do?", answer: "The reticular formation is a diffuse network of neurons and fibers throughout the brainstem tegmentum (core of midbrain, pons, and medulla). Functions: 1) Arousal/consciousness — ascending reticular activating system (ARAS) → thalamus → cortex; damage causes coma. 2) Autonomic regulation (cardiovascular, respiratory). 3) Motor modulation — reticulospinal tracts. 4) Pain modulation — descending inhibitory control via periaqueductal gray and raphe nuclei. 5) Sleep-wake cycle regulation.", difficulty: "hard" },
    { question: "What is the medial longitudinal fasciculus (MLF) and what happens when it is damaged?", answer: "The MLF is a white matter tract connecting the CN VI nucleus in the pons to the CN III nucleus in the midbrain — coordinating horizontal conjugate eye movements. Damage to the MLF (usually from MS or brainstem stroke) causes internuclear ophthalmoplegia (INO): the ipsilateral eye fails to adduct on lateral gaze, while the contralateral eye abducts with nystagmus. Convergence (CN III via a different pathway) is preserved.", difficulty: "hard" },
    { question: "What is the pyramidal decussation and where does it occur?", answer: "The pyramidal decussation is where the corticospinal tract fibers (from the medullary pyramids) cross the midline to the contralateral side — occurring at the caudal medulla/rostral spinal cord junction. This crossing is the anatomical basis for contralateral motor control: left cortex controls right body. Approximately 85-90% of corticospinal fibers cross here.", difficulty: "medium" },
    // Thalamus
    { question: "What are the major thalamic relay nuclei and what do they transmit?", answer: "VPL (ventral posterolateral): body somatosensory (touch, pain, proprioception from spinal cord) → S1. VPM (ventral posteromedial): face somatosensory (trigeminal) and taste (NTS) → S1/insula. LGN (lateral geniculate): vision (optic tract) → V1 (calcarine cortex). MGN (medial geniculate): auditory (inferior colliculus) → A1 (Heschl's gyri). VA/VL: motor control (from basal ganglia and cerebellum) → motor cortex. MD (mediodorsal): frontal lobe/limbic → PFC. Anterior nucleus: Papez circuit → cingulate cortex.", difficulty: "hard" },
    // Plasticity
    { question: "What is neuroplasticity?", answer: "The ability of the nervous system to change its structure and function in response to experience, injury, development, or learning. Forms include: synaptic plasticity (LTP/LTD), structural plasticity (dendritic spine remodeling, axon sprouting), cortical remapping (changes in representational maps), and adult neurogenesis (hippocampal dentate gyrus and olfactory bulb).", difficulty: "easy" },
    { question: "What is long-term potentiation (LTP) and what is its significance?", answer: "LTP is a long-lasting increase in synaptic strength following high-frequency stimulation — the primary cellular mechanism underlying learning and memory. It requires: 1) AMPA receptor activation (initial depolarization). 2) Relief of NMDA receptor Mg2+ block (voltage-dependent). 3) Ca2+ entry through NMDA receptors → activates signaling cascades → increased AMPA receptor number/conductance. LTP is NMDA receptor-dependent, Hebbian ('neurons that fire together wire together'), and input-specific.", difficulty: "hard" },
    { question: "What is cortical remapping and why is it clinically relevant?", answer: "Cortical remapping (cortical reorganization) is the use-dependent modification of cortical representational maps — adjacent cortical areas can 'take over' deafferented regions, or repeatedly used areas can expand. Clinically relevant: phantom limb pain (adjacent cortical areas invade deafferented hand area), constraint-induced movement therapy for stroke recovery (forces remapping by restricting intact limb), and instrument-specific cortical changes in musicians.", difficulty: "hard" },
    { question: "What is the glymphatic system?", answer: "A CNS waste clearance system that operates primarily during sleep — cerebrospinal fluid (CSF) is driven along para-arterial channels (lined by astrocyte endfeet with aquaporin-4 water channels) through the brain parenchyma, flushing metabolic waste (including amyloid-beta and tau) into para-venous spaces for drainage. Sleep deprivation impairs glymphatic clearance and is associated with increased amyloid accumulation.", difficulty: "hard" },
    { question: "What are the cerebral peduncles and what do they contain?", answer: "The cerebral peduncles are large fiber bundles forming the anterior midbrain — the crus cerebri (ventral portion) contains the descending corticospinal, corticobulbar, and corticopontine fibers. The tegmentum (dorsal) contains ascending sensory tracts, CN III/IV nuclei, substantia nigra, and red nucleus. The basis pontis (at the pons level) contains the corticopontine fibers that relay to the cerebellum via middle cerebellar peduncles.", difficulty: "hard" },
    { question: "What is Wallerian degeneration?", answer: "Anterograde degeneration of the axon and its myelin sheath distal to the site of axonal injury — the severed axon segment (cut off from the cell body) degenerates, and Schwann cells or microglia phagocytose the myelin debris. Retrograde changes also occur in the cell body (chromatolysis). Wallerian degeneration creates a permissive environment for axonal regeneration in the PNS (Schwann cells form Bands of Büngner) but is poorly resolved in the CNS.", difficulty: "hard" },
    { question: "What is the internal capsule and what does it contain?", answer: "The internal capsule is a compact white matter structure between the thalamus (medially) and basal ganglia (laterally), containing major ascending and descending fibers: anterior limb (frontopontine, anterior thalamic radiations), genu (corticobulbar tract), posterior limb (corticospinal tract, thalamocortical sensory fibers, optic radiations in retrolenticular part). It is the most common site of lacunar infarcts — small vessel disease causes dense contralateral motor/sensory deficits disproportionate to lesion size.", difficulty: "hard" },
  ];

  const inserted = await db.insert(flashcardsTable).values(flashcards.map(f => ({ ...f, topicId }))).returning();
  console.log(`✓ ${inserted.length} flashcards`);

  const regular = [
    { question: "Which space contains cerebrospinal fluid under normal conditions?", optionA: "Epidural space", optionB: "Subdural space", optionC: "Subarachnoid space", optionD: "Periventricular space", correctAnswer: "C", explanation: "The subarachnoid space — between the arachnoid mater and the pia mater — is the real space that contains CSF, major cerebral arteries, and draining veins. The epidural and subdural spaces are potential spaces that fill pathologically.", examOnly: false },
    { question: "CSF is produced primarily by the:", optionA: "Arachnoid granulations", optionB: "Ependymal cells lining the spinal cord", optionC: "Choroid plexus", optionD: "Astrocyte endfeet", correctAnswer: "C", explanation: "The choroid plexus — modified ependymal cells lining the lateral, third, and fourth ventricles — produces approximately 500 mL of CSF per day. Arachnoid granulations are where CSF is reabsorbed into the venous system.", examOnly: false },
    { question: "The primary structural basis of the blood-brain barrier is:", optionA: "Myelin sheaths around cerebral capillaries", optionB: "Tight junctions between brain capillary endothelial cells", optionC: "Astrocyte cell bodies surrounding neurons", optionD: "The skull and dural sinus system", correctAnswer: "B", explanation: "Tight junctions (claudins, occludins) between adjacent brain capillary endothelial cells form the primary physical barrier. Astrocyte endfeet and pericytes are essential for BBB maintenance and signaling but are not the primary structural element.", examOnly: false },
    { question: "A patient has loss of pain and temperature sensation on the LEFT side and loss of fine touch and proprioception on the RIGHT side below the T6 level. This pattern is consistent with:", optionA: "Complete spinal cord transection at T6", optionB: "Brown-Séquard syndrome (right hemisection) at T6", optionC: "Syringomyelia at T6", optionD: "Anterior cord syndrome at T6", correctAnswer: "B", explanation: "Brown-Séquard (right hemisection): ipsilateral (right) DCML loss — fine touch/proprioception; contralateral (left) spinothalamic loss — pain/temperature. The DCML crosses in the medulla (above the lesion), spinothalamic crosses immediately at cord entry level.", examOnly: false },
    { question: "Upper motor neuron lesions are distinguished from lower motor neuron lesions by the presence of:", optionA: "Flaccidity and muscle atrophy", optionB: "Fasciculations and areflexia", optionC: "Spasticity, hyperreflexia, and Babinski sign", optionD: "Saddle anesthesia and sphincter dysfunction", correctAnswer: "C", explanation: "UMN lesions (above the anterior horn — in cortex, internal capsule, brainstem, or spinal cord lateral column) cause spasticity (increased tone), hyperreflexia, Babinski sign, and clonus. LMN lesions cause flaccidity, areflexia, fasciculations, and atrophy.", examOnly: false },
    { question: "Vitamin B12 deficiency causes subacute combined degeneration, which damages which two CNS tracts?", optionA: "Spinothalamic tract and anterior corticospinal tract", optionB: "Dorsal columns (DCML) and lateral corticospinal tracts", optionC: "Anterior cord only (motor + spinothalamic)", optionD: "Dorsal columns and spinocerebellar tracts only", correctAnswer: "B", explanation: "Subacute combined degeneration (B12 deficiency) demyelinates the dorsal columns (causing loss of vibration/proprioception) AND the lateral corticospinal tracts (causing UMN signs: spasticity, hyperreflexia). The 'combined' refers to these two separate column systems both being affected.", examOnly: false },
    { question: "A syrinx (syringomyelia) in the cervical cord characteristically produces:", optionA: "Bilateral loss of fine touch and proprioception in the arms with intact pain/temperature", optionB: "Bilateral loss of pain and temperature in a 'cape' distribution with preserved dorsal column function", optionC: "Contralateral loss of all sensation below the lesion", optionD: "Saddle anesthesia and bladder dysfunction", correctAnswer: "B", explanation: "The syrinx destroys crossing spinothalamic fibers in the anterior white commissure → bilateral pain and temperature loss in a cape (C5-T1) distribution. Dorsal columns are spared (posterior cord intact) → fine touch and proprioception are preserved. This dissociated sensory loss is characteristic.", examOnly: false },
    { question: "Which circumventricular organ is the chemoreceptor trigger zone (CTZ) for vomiting?", optionA: "Subfornical organ", optionB: "Median eminence", optionC: "Area postrema", optionD: "Neurohypophysis", correctAnswer: "C", explanation: "The area postrema (dorsal surface of the medulla, floor of the fourth ventricle) lacks a BBB, allowing it to detect blood-borne emetic agents. It is the anatomical basis for chemotherapy-induced nausea and is the target of 5-HT3 and NK1 receptor antagonist antiemetics.", examOnly: false },
    { question: "The pyramidal decussation — where the corticospinal tract crosses — occurs at the level of the:", optionA: "Internal capsule", optionB: "Mid-pons", optionC: "Caudal medulla / rostral spinal cord junction", optionD: "Cervical spinal cord at C4", correctAnswer: "C", explanation: "The pyramidal decussation occurs at the caudal medulla / rostral spinal cord junction — this crossing is why a left cortex lesion causes right body weakness. The 85-90% of fibers that cross here form the lateral corticospinal tract.", examOnly: false },
    { question: "Damage to the medial longitudinal fasciculus (MLF) causes:", optionA: "Loss of ipsilateral pain and temperature from the face", optionB: "Internuclear ophthalmoplegia — ipsilateral adduction failure with contralateral nystagmus on lateral gaze", optionC: "Bilateral loss of hearing", optionD: "Contralateral loss of proprioception from the body", correctAnswer: "B", explanation: "The MLF connects CN VI (pons) to CN III (midbrain), coordinating conjugate horizontal gaze. MLF damage (classically bilateral in MS) causes internuclear ophthalmoplegia: the ipsilateral eye cannot adduct (CN III pathway disrupted) while the contralateral eye abducts with nystagmus. Convergence is preserved.", examOnly: false },
  ];

  const examOnly = [
    { question: "Rexed Lamina II (substantia gelatinosa) functions primarily to:", optionA: "Receive proprioceptive input from muscle spindles", optionB: "Modulate pain transmission from Aδ and C fibers — a key site of gate control and opioid action", optionC: "Contain autonomic preganglionic neurons", optionD: "House alpha motor neurons for skeletal muscle", correctAnswer: "B", explanation: "The substantia gelatinosa (Lamina II) receives Aδ and C fiber input and modulates transmission to projection neurons in Laminae I and V. It is densely populated with opioid receptors and is central to gate control theory of pain modulation.", examOnly: true },
    { question: "What distinguishes anterior cord syndrome from Brown-Séquard syndrome at the same spinal level?", optionA: "Anterior cord syndrome is bilateral; Brown-Séquard is unilateral — anterior cord preserves dorsal columns, Brown-Séquard loses contralateral pain/temperature", optionB: "Brown-Séquard preserves motor function; anterior cord does not", optionC: "Anterior cord syndrome affects only motor function", optionD: "They produce identical clinical pictures", correctAnswer: "A", explanation: "Anterior cord syndrome: bilateral motor loss + bilateral pain/temperature loss + preserved proprioception/vibration (dorsal columns spared). Brown-Séquard: ipsilateral fine touch/proprioception loss + contralateral pain/temperature loss + ipsilateral motor loss — unilateral hemisection.", examOnly: true },
    { question: "Which component of the internal capsule contains the primary corticospinal (voluntary limb motor) fibers?", optionA: "Anterior limb", optionB: "Genu", optionC: "Posterior limb", optionD: "Sublenticular portion", correctAnswer: "C", explanation: "The posterior limb of the internal capsule contains the corticospinal tract (voluntary limb motor), thalamocortical sensory projections (from VPL/VPM), and the auditory radiations. The genu contains corticobulbar fibers (voluntary face/throat motor). The retrolenticular portion contains the optic radiations.", examOnly: true },
    { question: "Long-term potentiation (LTP) requires NMDA receptor activation because:", optionA: "NMDA receptors are the only ionotropic glutamate receptors in the brain", optionB: "NMDA receptors are both ligand- AND voltage-gated — requiring coincident presynaptic activity and postsynaptic depolarization to relieve Mg2+ block and allow Ca2+ entry", optionC: "NMDA receptors directly insert AMPA receptors into the postsynaptic membrane", optionD: "NMDA receptors are activated by GABA", correctAnswer: "B", explanation: "NMDA receptors act as coincidence detectors — they require both glutamate binding (presynaptic activity) AND sufficient postsynaptic depolarization to relieve the Mg2+ block. Ca2+ entry through the unblocked NMDA receptor triggers the signaling cascade that strengthens the synapse (LTP). This is the cellular basis of Hebbian learning.", examOnly: true },
    { question: "The glymphatic system is most active during which state and what is its primary function?", optionA: "Wakefulness — to support rapid cognitive processing by delivering nutrients", optionB: "Sleep — to clear metabolic waste (including amyloid-beta and tau) from the brain parenchyma", optionC: "REM sleep only — to consolidate memory traces", optionD: "Exercise — to enhance cerebral blood flow and waste removal", correctAnswer: "B", explanation: "The glymphatic system, driven by astrocyte aquaporin-4 channels and CSF flow along perivascular spaces, is primarily active during sleep. It clears metabolic byproducts including amyloid-beta and tau — providing a mechanistic link between sleep deprivation and neurodegenerative disease risk.", examOnly: true },
    { question: "A patient with anterior spinal artery occlusion at T4 would have which pattern of deficits below T4?", optionA: "Bilateral loss of proprioception and vibration with preserved motor function", optionB: "Bilateral motor loss and bilateral pain/temperature loss with preserved proprioception and vibration", optionC: "Unilateral motor loss with contralateral pain/temperature loss", optionD: "Saddle anesthesia only", correctAnswer: "B", explanation: "The anterior spinal artery supplies the anterior two-thirds of the cord — containing the corticospinal tracts (motor) and the spinothalamic tracts (pain/temperature). The posterior dorsal columns (DCML) receive blood from the posterior spinal arteries and are spared — a classic dissociated sensory loss.", examOnly: true },
    { question: "Wallerian degeneration is clinically significant because:", optionA: "It occurs only in the CNS and always results in complete functional recovery", optionB: "Axons distal to the injury degenerate; PNS recovery is enabled by Schwann cell scaffolding, but CNS recovery is poor due to inhibitory myelin debris and lack of regrowth scaffold", optionC: "It destroys only the myelin sheath while preserving the axon", optionD: "It triggers LTP and drives cortical remapping", correctAnswer: "B", explanation: "After axotomy, Wallerian degeneration clears the axon and myelin distal to the cut. In the PNS, Schwann cells form Bands of Büngner (guidance channels) enabling axon regrowth (~1 mm/day). In the CNS, oligodendrocyte myelin debris releases growth inhibitors (Nogo-A, MAG), and astrocyte scar formation further limits regrowth.", examOnly: true },
    { question: "The VPL nucleus of the thalamus receives somatosensory input from the body and projects to:", optionA: "The prefrontal cortex via the anterior thalamic radiation", optionB: "The primary somatosensory cortex (S1) via the posterior limb of the internal capsule", optionC: "The primary motor cortex (M1) to drive voluntary movement", optionD: "The hippocampus for spatial memory processing", correctAnswer: "B", explanation: "The VPL (ventral posterolateral) nucleus receives body somatosensory information (from the medial lemniscus and spinothalamic tract) and projects via the posterior limb of the internal capsule to S1 (postcentral gyrus). VPM receives face/taste input from the trigeminal and NTS. VA/VL receive motor loop input and project to M1.", examOnly: true },
    { question: "Central cord syndrome disproportionately affects upper limb function because:", optionA: "The cervical cord is smaller and thus more completely damaged", optionB: "Corticospinal fibers serving the upper extremity run more medially in the lateral column, closer to the central gray, and are thus disproportionately damaged by central hemorrhage or edema", optionC: "The brachial plexus exits at a cervical level that is closest to the injury", optionD: "The anterior horn cells for the arm are located in the dorsal horn, which is centrally positioned", correctAnswer: "B", explanation: "The corticospinal tract has a somatotopic arrangement in the lateral column: fibers serving upper extremities are most medial (near the central gray), lower extremities are most lateral. Central cord pathology preferentially disrupts the medial (upper limb) fibers while sparing the more lateral (lower limb) fibers and sacral fibers (sacral sparing).", examOnly: true },
    { question: "The area postrema lacks a blood-brain barrier. The clinical consequence of this is:", optionA: "It allows toxic substances to directly damage cerebellar Purkinje cells", optionB: "It allows blood-borne emetic substances (drugs, toxins) to trigger vomiting without crossing the BBB", optionC: "It permits peripheral hormones to directly modulate limbic circuits", optionD: "It explains why peripheral infections frequently cause encephalitis", correctAnswer: "B", explanation: "The area postrema (floor of fourth ventricle, caudal medulla) is a chemoreceptor trigger zone — its absent BBB allows direct sampling of circulating emetics (chemotherapy agents, opioids, uremic toxins). It connects to the vomiting center in the medullary reticular formation, initiating the emetic reflex.", examOnly: true },
    { question: "What is the clinical significance of the filum terminale being tethered pathologically?", optionA: "Tethered cord syndrome — progressive UMN deficits as the cord is stretched", optionB: "Tethered cord syndrome — progressive LMN and bladder/bowel dysfunction as the conus is pulled inferiorly, causing ischemic injury to the low spinal cord", optionC: "Cauda equina syndrome from compression of the filum itself", optionD: "Hydrocephalus from impaired CSF outflow", correctAnswer: "B", explanation: "Tethered cord syndrome occurs when the filum terminale (or adhesions) pathologically restrict the normal ascent of the conus during growth. Traction on the low spinal cord causes progressive ischemia: LMN signs in the legs, bladder/bowel dysfunction, and back pain — often requiring surgical release.", examOnly: true },
  ];

  const allQs = [...regular, ...examOnly].map(q => ({ ...q, topicId }));
  const qs = await db.insert(quizQuestionsTable).values(allQs).returning();
  console.log(`✓ ${qs.length} questions`);

  const sgContent = `# Central Nervous System — Study Guide

## 1. CNS Overview

The **central nervous system** comprises the **brain** (cerebrum, cerebellum, brainstem) and the **spinal cord**. It is protected by: bony encasement (skull + vertebral column), three meningeal layers, the blood-brain barrier, and cerebrospinal fluid.

---

## 2. Meninges and CSF Spaces

### Three Meningeal Layers

| Layer | Features | Clinical Space |
|---|---|---|
| **Dura mater** | Outermost; thick fibrous; two layers in cranium (periosteal + meningeal); single layer in spinal canal | Epidural space (potential in skull; real in spinal canal with fat/veins) |
| **Arachnoid mater** | Middle; avascular; thin; connected to pia by trabeculae | Subdural space (potential space; bridging veins) |
| **Pia mater** | Innermost; tightly adherent to brain/cord surface; follows all sulci | Subarachnoid space (real; contains CSF + major arteries) |

### Clinical Hemorrhages
- **Epidural hematoma:** Arterial (middle meningeal artery); lens-shaped on CT; lucid interval typical; strips dura from skull
- **Subdural hematoma:** Venous (bridging veins); crescent-shaped; no lucid interval; common in elderly/trauma
- **Subarachnoid hemorrhage:** Arterial (aneurysm rupture); "worst headache of life"; blood in subarachnoid space; CT shows hyperdensity in cisterns

---

## 3. Cerebrospinal Fluid

**Production:** Choroid plexus (lateral, 3rd, 4th ventricles) → ~500 mL/day; ~150 mL circulating

**Circulation path:**
Lateral ventricles → **foramina of Monro** → 3rd ventricle → **cerebral aqueduct (Sylvius)** → 4th ventricle → **foramina of Magendie + Luschka** → subarachnoid space → absorbed at **arachnoid granulations** into superior sagittal sinus

**Functions:** Mechanical cushion (reduces brain weight ~97%), metabolic waste clearance (glymphatic), pH buffering, neuroactive substance transport

**Hydrocephalus:**
- Obstructive (non-communicating): blockage within ventricular system
- Communicating: impaired reabsorption (post-meningitis) or overproduction
- Normal-pressure hydrocephalus: triad of gait apraxia + dementia + urinary incontinence

---

## 4. Blood-Brain Barrier

**Structure:** Tight junctions between brain capillary endothelial cells (primary barrier) + astrocyte endfeet + pericytes + basement membrane

**Crosses freely:** O2, CO2, lipid-soluble substances, steroid hormones, most anesthetics, alcohol

**Transported across:** Glucose (GLUT1), amino acids, selected ions

**Circumventricular organs (no BBB):** Area postrema (emesis CTZ), median eminence, subfornical organ, neurohypophysis — allow CNS to sample circulating blood

**BBB breakdown:** Stroke, MS plaques, TBI, CNS tumors (glioblastoma — gadolinium enhancement on MRI)

---

## 5. Spinal Cord Anatomy

### External Organization
| Feature | Detail |
|---|---|
| **Cervical enlargement** | C3-T1 — upper limb motor neurons; brachial plexus origin |
| **Lumbar enlargement** | L1-S2 — lower limb motor neurons; lumbosacral plexus |
| **Conus medullaris** | Terminal cord; adults L1-L2 |
| **Cauda equina** | Lumbar/sacral roots below conus; L1-S5 |
| **Filum terminale** | Pia strand anchoring cord to coccyx; no neural function |

### Gray Matter — Rexed Laminae

| Laminae | Location | Function |
|---|---|---|
| I-II | Dorsal marginal zone + substantia gelatinosa | Pain/temperature input; gate control; opioid action |
| III-IV | Nucleus proprius | Touch and pressure |
| V | Wide-dynamic-range (WDR) neurons | Pain convergence; nociception modulation |
| VI | Deep dorsal horn | Proprioception from joints/muscles |
| VII | Intermediate zone + lateral horn (T1-L2, S2-S4) | Autonomic preganglionic neurons |
| VIII-IX | Ventral horn | Motor interneurons (VIII); alpha + gamma motor neurons (IX) |
| X | Central canal region | Visceral pain (commissural fibers) |

### White Matter Columns (Funiculi)

| Column | Major Tracts |
|---|---|
| **Dorsal (posterior)** | Fasciculus gracilis (lower body DCML), fasciculus cuneatus (upper body DCML) |
| **Lateral** | Lateral corticospinal (descending), spinothalamic (ascending), spinocerebellar (ascending), rubrospinal (descending) |
| **Anterior (ventral)** | Anterior corticospinal, vestibulospinal, reticulospinal |

---

## 6. Major Spinal Cord Tracts

### Ascending (Sensory)

| Tract | Carries | Crosses |
|---|---|---|
| **DCML** (dorsal columns → medial lemniscus) | Fine touch, vibration, proprioception, two-point discrimination | Medulla (sensory decussation) |
| **Spinothalamic (anterolateral)** | Pain, temperature, crude touch | Immediately in cord (anterior white commissure) |
| **Spinocerebellar (dorsal)** | Proprioception → cerebellum | Does NOT cross — ipsilateral |

### Descending (Motor)

| Tract | Origin | Crosses | Controls |
|---|---|---|---|
| **Lateral corticospinal** | Motor cortex | Pyramidal decussation (medulla) | Voluntary distal limb |
| **Anterior corticospinal** | Motor cortex | Segmentally in cord | Axial/proximal |
| **Rubrospinal** | Red nucleus (midbrain) | Immediately (midbrain) | Distal limb (minor in humans) |
| **Lateral vestibulospinal** | Vestibular nuclei | Ipsilateral | Extensor tone, balance |
| **Reticulospinal** | Reticular formation | Variable | Posture, flexor/extensor tone |

---

## 7. UMN vs LMN Lesions

| Sign | UMN Lesion | LMN Lesion |
|---|---|---|
| **Tone** | Increased (spasticity) | Decreased (flaccidity) |
| **Reflexes** | Hyperreflexia, clonus | Hyporeflexia / areflexia |
| **Babinski** | Present (extensor plantar) | Absent |
| **Atrophy** | Minimal, late | Rapid, prominent |
| **Fasciculations** | Absent | Present |
| **Weakness** | Groups of muscles | Single muscles / distributions |

---

## 8. Spinal Cord Syndromes

| Syndrome | Cause | Deficits |
|---|---|---|
| **Complete transection** | Trauma, tumor | Bilateral loss of all sensation, motor, bowel/bladder below lesion; UMN eventually |
| **Brown-Séquard** | Penetrating trauma, MS, tumor | Ipsilateral DCML loss + contralateral spinothalamic loss + ipsilateral UMN weakness |
| **Central cord** | Hyperextension (cervical spondylosis) | UE > LE weakness; variable sensory; bladder dysfunction; sacral sparing |
| **Anterior cord** | Anterior spinal artery occlusion | Bilateral motor loss + bilateral pain/temp loss; dorsal columns intact |
| **Posterior cord** | B12 deficiency (SCD), neurosyphilis | Bilateral proprioception/vibration loss; motor intact |
| **Syringomyelia** | Syrinx in central cord | Bilateral pain/temp loss (cape) — anterior commissure; preserved dorsal columns |
| **Cauda equina** | Disc, tumor at L1-L2 and below | LMN signs, saddle anesthesia, bladder/bowel dysfunction — neurosurgical emergency |

---

## 9. Brainstem

| Division | Level | Key Structures |
|---|---|---|
| **Midbrain** | Superior | CN III/IV; substantia nigra; red nucleus; superior/inferior colliculi; cerebral aqueduct |
| **Pons** | Middle | CN V/VI/VII/VIII; middle cerebellar peduncles; pneumotaxic center |
| **Medulla** | Inferior | CN IX/X/XI/XII; pyramidal decussation; sensory decussation; cardiac/respiratory/vomiting centers; inferior olivary nucleus |

**Reticular formation:** Diffuse brainstem network for arousal (ARAS), autonomic regulation, pain modulation, sleep-wake, and motor modulation

**MLF:** Connects CN VI → CN III for conjugate horizontal gaze; damage → internuclear ophthalmoplegia (INO)

---

## 10. Thalamic Relay Nuclei

| Nucleus | Input | Cortical Target | Modality |
|---|---|---|---|
| **VPL** | Medial lemniscus, spinothalamic | S1 | Body touch, pain, proprioception |
| **VPM** | Trigeminal nucleus, NTS | S1, insula | Face, taste |
| **LGN** | Optic tract | V1 (calcarine cortex) | Vision |
| **MGN** | Inferior colliculus | A1 (Heschl's gyri) | Hearing |
| **VA/VL** | Basal ganglia, cerebellum | Motor cortex | Motor control |
| **MD** | Frontal lobe, limbic | PFC | Executive, emotion |
| **Anterior** | Mammillary bodies | Cingulate cortex | Emotion, memory (Papez) |

---

## 11. Neuroplasticity

| Form | Description |
|---|---|
| **LTP** | Long-term potentiation: NMDA-dependent, Hebbian, increases synaptic strength — cellular basis of learning |
| **LTD** | Long-term depression: weakens synaptic connections — important for cerebellar motor learning |
| **Cortical remapping** | Use-dependent changes in cortical maps (phantom limb, instrument practice, stroke recovery) |
| **Adult neurogenesis** | Hippocampal dentate gyrus + olfactory bulb — functional significance debated |
| **Glymphatic clearance** | Sleep-dependent CSF-mediated waste clearance — disrupted in sleep deprivation and neurodegeneration |`;

  const [sg] = await db.insert(studyGuidesTable).values({ topicId, title: "Central Nervous System — Study Guide", content: sgContent }).returning();
  console.log(`✓ Study guide id=${sg.id}`);

  const [exam] = await db.insert(practiceExamsTable).values({ topicId, title: "Central Nervous System Practice Exam", timeLimit: 90, passingScore: 70 }).returning();
  const allQsFromDb = await db.select({ id: quizQuestionsTable.id }).from(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, topicId));
  await db.insert(practiceExamQuestionsTable).values(allQsFromDb.map((q, i) => ({ examId: exam.id, questionId: q.id, questionOrder: i + 1 })));
  console.log(`✓ Practice exam with ${allQsFromDb.length} questions`);

  console.log(`\n✅ CNS (topic ${topicId}) fully seeded!`);
}

seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
