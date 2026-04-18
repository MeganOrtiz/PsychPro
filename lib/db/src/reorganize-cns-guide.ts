import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

async function reorganize() {
  console.log("Reorganizing CNS study guide...");

  const newContent = `# Central Nervous System

## 1. Overview and Protection

The central nervous system (CNS) consists of the **brain** and the **spinal cord**. It is the body's command and integration center — responsible for processing sensory input, generating thoughts and emotions, forming and retrieving memories, initiating voluntary and involuntary motor responses, and regulating virtually all bodily functions. Because of its critical importance and extreme fragility, the CNS is protected by several overlapping systems.

**Bony protection** is provided by the cranium (skull) for the brain and the vertebral column for the spinal cord. Within these bony enclosures, the CNS is wrapped by three meningeal layers. The **dura mater** is the outermost layer — tough, fibrous, and protective. In the cranium the dura consists of two layers (periosteal and meningeal), which split to form the dural venous sinuses; in the spinal canal the dura is a single layer separated from the vertebral bone by the real epidural space, filled with fat and venous plexuses. Beneath the dura lies the **arachnoid mater** — a thin, avascular layer connected to the pia below by delicate trabeculae. The innermost layer, the **pia mater**, is intimately adherent to every contour of the brain and spinal cord surface, following all sulci and fissures.

The spaces between these layers are clinically important. The **epidural space** is a potential space in the cranium but a real anatomical space in the spine. The **subdural space** (between dura and arachnoid) is a potential space traversed by bridging veins — rupture of these veins produces subdural hematomas. The **subarachnoid space** (between arachnoid and pia) is a real, CSF-filled space containing the major cerebral arteries; subarachnoid hemorrhage from aneurysm rupture fills this space with blood.

---

## 2. Cellular Components of the CNS

The CNS is built from two principal cell populations: **neurons**, which generate and propagate electrical signals, and **glial cells**, which provide essential structural, metabolic, and immune support.

**Astrocytes** are the most numerous glial cells. They maintain the blood-brain barrier by ensheathing capillaries with their endfeet, regulate extracellular potassium and glutamate concentrations, provide metabolic support to neurons (the astrocyte-neuron lactate shuttle), modulate synaptic transmission, and respond to injury with reactive astrogliosis (glial scar formation).

**Oligodendrocytes** extend processes that wrap around multiple axons to form the **myelin sheath** in the CNS — the lipid-rich insulation that enables rapid saltatory conduction by concentrating ion channels at the nodes of Ranvier. A single oligodendrocyte can myelinate up to 50 different axons. In multiple sclerosis, autoimmune attack on oligodendrocytes and their myelin causes demyelinating plaques and conduction failure.

**Microglia** are the CNS-resident macrophages — derived from yolk-sac precursors rather than neural crest or neural tube. In their resting state, they continually survey the parenchyma with highly motile processes. When activated by injury, infection, or accumulated misfolded proteins, they phagocytize debris, release cytokines, and participate in synaptic pruning during development. Chronically activated microglia contribute to neuroinflammatory damage in Alzheimer's disease and other neurodegenerative conditions.

**Ependymal cells** line the ventricles and central canal of the spinal cord with a single-cell layer. Modified ependymal cells in the choroid plexus actively produce CSF.

---

## 3. Cerebrospinal Fluid

Cerebrospinal fluid (CSF) is a clear, colorless fluid produced primarily by the **choroid plexuses** — specialized secretory epithelium lining the lateral, third, and fourth ventricles. Approximately 500 mL is produced per day, with only about 150 mL in circulation at any given moment.

CSF circulates through a defined pathway: from the lateral ventricles it passes through the **interventricular foramina of Monro** into the third ventricle, then through the **cerebral aqueduct of Sylvius** into the fourth ventricle, and finally exits into the subarachnoid space via the **median aperture (Magendie)** and **lateral apertures (Luschka)**. It is ultimately reabsorbed into the venous system through **arachnoid granulations** projecting into the superior sagittal sinus.

CSF serves multiple functions: it acts as a mechanical cushion — buoyancy reduces the effective weight of the brain from approximately 1,400 g to about 50 g, protecting against acceleration-deceleration injury. It also removes metabolic waste from neural tissue (a process amplified by the **glymphatic system** during sleep), buffers pH, and facilitates transport of neuroactive substances between brain regions.

When CSF circulation is impaired, **hydrocephalus** results. Obstructive (non-communicating) hydrocephalus occurs when flow is blocked within the ventricular system — for example, by an aqueductal stenosis or posterior fossa tumor. Communicating hydrocephalus occurs when CSF can exit the ventricles but reabsorption is impaired, as occurs after meningitis scars the arachnoid granulations. Normal-pressure hydrocephalus (NPH) is a special communicating form presenting with the triad of gait apraxia, urinary incontinence, and cognitive impairment (frontal-subcortical pattern).

---

## 4. The Blood-Brain Barrier

The **blood-brain barrier (BBB)** is a selective permeability interface between the systemic circulation and the CNS parenchyma. Its primary structural basis is the presence of **tight junctions** (claudins, occludins) between adjacent brain capillary endothelial cells — unlike capillaries elsewhere in the body, brain endothelial cells are sealed together, preventing paracellular passage of most substances. This barrier is maintained and signaled by **astrocyte endfeet**, which envelop essentially the entire capillary surface, and by **pericytes** embedded in the basement membrane.

Substances cross the BBB through one of three mechanisms. Lipid-soluble molecules — including oxygen, carbon dioxide, steroid hormones, ethanol, most anesthetics, and many psychoactive drugs — diffuse freely across the lipid membrane. Essential polar molecules such as glucose (via GLUT1 transporters) and amino acids (via LAT1) are carried by specific transporter proteins. Most water-soluble drugs, large molecules, and plasma proteins cannot cross.

There are, however, several specialized regions of the brain that intentionally lack a complete BBB — the **circumventricular organs (CVOs)**. These include the **area postrema** (the chemoreceptor trigger zone for vomiting, at the floor of the fourth ventricle), the median eminence, subfornical organ, and neurohypophysis. Their absence of a barrier allows the brain to directly sample circulating blood for hormones, toxins, and osmotic changes.

The BBB breaks down in a variety of pathological states — stroke, traumatic brain injury, multiple sclerosis (MS), meningitis, and brain tumors. In glioblastoma, the disrupted BBB allows gadolinium contrast to leak in on MRI, producing the characteristic ring-enhancing appearance of high-grade tumors.

---

## 5. The Brainstem

The brainstem is the critical corridor connecting the cerebrum and cerebellum to the spinal cord. It is divided into three regions, each with characteristic structures and clinical significance.

The **midbrain** (mesencephalon) contains the oculomotor (CN III) and trochlear (CN IV) nuclei, the substantia nigra pars compacta (the dopaminergic neurons whose loss causes Parkinson's disease), the red nucleus (rubrospinal tract origin), and the superior and inferior colliculi (visual and auditory reflex centers, respectively). The cerebral aqueduct passes through the midbrain tegmentum.

The **pons** houses the nuclei for the abducens (CN VI), facial (CN VII), and vestibulocochlear (CN VIII) nerves, as well as the trigeminal (CN V) sensory and motor nuclei. The middle cerebellar peduncles connect the pons to the cerebellum. Pontine respiratory centers (the pneumotaxic center) modulate breathing rhythm.

The **medulla oblongata** contains the hypoglossal (CN XII), accessory (CN XI), vagal (CN X), and glossopharyngeal (CN IX) nuclei. Critically, the **pyramidal decussation** (crossing of the corticospinal tracts) and the **sensory decussation** (crossing of the DCML medial lemniscus) both occur here. Vital cardiovascular and respiratory centers reside in the medullary reticular formation.

Running through the core of the entire brainstem is the **reticular formation** — a diffuse network of interconnected neurons responsible for arousal and consciousness (the ascending reticular activating system, ARAS), autonomic regulation, pain modulation via the periaqueductal gray and raphe nuclei, and sleep-wake cycle control. Damage to the ARAS at any level causes impaired consciousness or coma.

The **medial longitudinal fasciculus (MLF)** connects the CN VI nucleus in the pons to the CN III nucleus in the midbrain, coordinating horizontal conjugate eye movements. Damage to the MLF — classically from MS or brainstem stroke — causes **internuclear ophthalmoplegia (INO)**: failure of adduction of the ipsilateral eye on lateral gaze, while the contralateral eye abducts with nystagmus. Convergence, which uses a different pathway, is preserved.

---

## 6. Spinal Cord Anatomy

### 6.1 External Organization

The spinal cord extends from the caudal medulla to approximately the L1-L2 vertebral level in adults, where it tapers into the **conus medullaris**. Below the conus, the lumbar and sacral nerve roots continue within the spinal canal as the **cauda equina** before exiting through their respective intervertebral foramina. A thin filament of pia mater called the **filum terminale** extends from the conus to anchor the cord to the coccyx; it has no neural function.

The cord has two notable thickenings reflecting its major motor pools. The **cervical enlargement** (C3-T1) contains the large motor neuron pools supplying the upper limbs and is the origin of the brachial plexus. The **lumbar enlargement** (L1-S2) similarly houses the motor neurons supplying the lower limbs, giving rise to the lumbosacral plexus.

Thirty-one pairs of spinal nerves emerge from the cord — 8 cervical, 12 thoracic, 5 lumbar, 5 sacral, and 1 coccygeal. Each spinal nerve is formed by the union of a dorsal (sensory) root carrying afferent fibers from the dorsal root ganglion, and a ventral (motor) root carrying efferent fibers from the anterior horn.

### 6.2 Internal Organization: Gray Matter

In cross-section, the spinal cord shows a butterfly-shaped region of **gray matter** (containing neuronal cell bodies and dendrites) surrounded by **white matter** (myelinated axon tracts). The gray matter is organized into ten cytoarchitectural zones called **Rexed laminae**.

Laminae I and II (the marginal zone and substantia gelatinosa) receive input from small-diameter pain and temperature fibers (Aδ and C fibers) and are rich in opioid receptors — they are the primary site of gate control of pain transmission. Laminae III and IV (the nucleus proprius) process light touch and pressure. Lamina V contains wide-dynamic-range (WDR) neurons that respond to both innocuous and noxious stimuli, contributing to pain facilitation and modulation. Lamina VI processes proprioceptive input from joints and muscles. Lamina VII constitutes the intermediate zone, which contains the **lateral horn** in thoracic (T1-L2) and sacral (S2-S4) segments — the location of preganglionic autonomic neurons (sympathetic and sacral parasympathetic, respectively). Laminae VIII and IX occupy the ventral horn, housing motor interneurons and the large alpha and gamma motor neurons whose axons innervate skeletal muscle.

### 6.3 Internal Organization: White Matter Tracts

The white matter is organized into three paired columns (funiculi), each containing major ascending and descending tracts.

The **dorsal (posterior) columns** carry the dorsal column-medial lemniscal (DCML) pathway — fine touch, vibration, two-point discrimination, and conscious proprioception. The medial fasciculus gracilis carries information from the lower body (sacral, lumbar, lower thoracic), and the lateral fasciculus cuneatus carries upper body information (upper thoracic, cervical). These fibers ascend ipsilaterally and synapse in the nucleus gracilis and cuneatus in the medulla, where they cross the midline (internal arcuate fibers/sensory decussation) to ascend as the medial lemniscus to the VPL thalamus.

The **lateral columns** are the most functionally complex. On the descending side, the lateral corticospinal tract (from the motor cortex, having crossed in the pyramidal decussation at the medulla) carries voluntary motor commands to the ipsilateral anterior horn. On the ascending side, the lateral spinothalamic tract (pain, temperature) ascends contralaterally, having crossed immediately upon entering the cord via the anterior white commissure.

The **anterior (ventral) columns** contain the anterior corticospinal tract (a minority of voluntary motor fibers that cross segmentally), vestibulospinal fibers (for extensor tone and balance), and reticulospinal fibers (for posture and tone modulation).

---

## 7. The Ascending and Descending Pathways

### 7.1 The Dorsal Column-Medial Lemniscal (DCML) Pathway

This is the primary route for fine touch, vibration, two-point discrimination, and conscious proprioception. First-order neurons originate in peripheral receptors with their cell bodies in the **dorsal root ganglia (DRG)**. They enter the spinal cord and ascend ipsilaterally in the dorsal columns all the way to the medulla, where they synapse in the nucleus gracilis (lower body) or nucleus cuneatus (upper body). Second-order neurons then cross the midline via the internal arcuate fibers (the sensory decussation) and ascend in the contralateral medial lemniscus to the **ventral posterolateral (VPL) nucleus** of the thalamus. Third-order neurons project from the VPL through the posterior limb of the internal capsule to the primary somatosensory cortex (S1, postcentral gyrus).

A lesion in the dorsal columns causes **ipsilateral** loss of fine touch, vibration, and proprioception below the lesion — because the pathway has not yet crossed.

### 7.2 The Spinothalamic (Anterolateral) Pathway

This pathway carries pain, temperature, and crude touch. First-order DRG neurons synapse in the dorsal horn (Laminae I, II, V). Second-order neurons immediately cross the midline via the **anterior white commissure** — just anterior to the central canal — and ascend in the contralateral anterolateral white matter to the VPL thalamus. Third-order neurons then project to S1.

Because the spinothalamic tract crosses immediately in the cord, a unilateral cord lesion causes **contralateral** loss of pain and temperature below the lesion level. This contrasts sharply with the ipsilateral DCML deficit and forms the basis of Brown-Séquard syndrome.

### 7.3 The Corticospinal (Pyramidal) Pathway

Voluntary motor commands originate in the motor cortex (M1, precentral gyrus). Axons descend through the corona radiata, posterior limb of the internal capsule, cerebral peduncles, and pons, converging in the medullary pyramids. Approximately 85-90% of fibers cross the midline at the **pyramidal decussation** (caudal medulla/rostral cord junction), forming the lateral corticospinal tract in the contralateral lateral column. These fibers synapse on anterior horn alpha motor neurons, which then directly drive skeletal muscle contraction. The remaining 10-15% descend uncrossed in the anterior column, crossing segmentally.

---

## 8. Upper vs. Lower Motor Neuron Lesions

One of the most clinically important distinctions in neurology is between lesions of the **upper motor neuron (UMN)** — the corticospinal and corticobulbar tracts above the anterior horn — and the **lower motor neuron (LMN)** — the anterior horn cells, ventral roots, and peripheral motor nerves.

UMN lesions, because they remove descending inhibitory control, produce **spasticity** (increased tone), **hyperreflexia**, **clonus**, and the **Babinski sign** (dorsiflexion of the great toe with plantar stimulation — a primitive extensor reflex released from inhibition). Muscle atrophy is minimal early. LMN lesions, in contrast, remove direct motor drive and produce **flaccidity** (absent tone), **areflexia**, **fasciculations** (spontaneous firing of denervated motor units visible under the skin), and **rapid muscle atrophy**.

---

## 9. Spinal Cord Syndromes

The spatial organization of the cord's tracts means that different disease processes produce distinctive, localized deficit patterns. Understanding these allows precise anatomical lesion localization.

**Brown-Séquard syndrome** results from hemisection (half-transection) of the cord — most commonly from penetrating trauma, a compressive tumor, or MS. The DCML has not yet crossed at the cord level, so damage to it produces **ipsilateral** loss of fine touch, vibration, and proprioception below the lesion. The spinothalamic tract has already crossed at cord entry, so damage produces **contralateral** loss of pain and temperature. Additionally, the corticospinal tract (crossed above in the medulla) produces **ipsilateral UMN weakness** below the lesion.

**Central cord syndrome** is the most common incomplete spinal cord injury, usually from cervical hyperextension in older patients with pre-existing spondylosis. The expanding central hemorrhage or edema preferentially damages the most medial corticospinal fibers (which supply the upper extremities) while sparing the lateral fibers (lower extremities). The result is upper extremity weakness disproportionately greater than lower extremity weakness, with variable sensory loss and bladder dysfunction.

**Anterior cord syndrome** typically results from occlusion of the anterior spinal artery, which supplies the anterior two-thirds of the cord. The corticospinal tracts and spinothalamic tracts are both lost, producing bilateral motor paralysis and bilateral loss of pain and temperature below the lesion. The dorsal columns, supplied by the posterior spinal arteries, are spared — proprioception and vibration are preserved. This dissociated sensory loss is characteristic.

**Posterior cord syndrome** in isolation (rare) spares motor function and pain/temperature while eliminating fine touch, vibration, and proprioception. It is caused by vitamin B12 deficiency (subacute combined degeneration also affects the lateral corticospinal tracts), neurosyphilis (tabes dorsalis), or Friedreich's ataxia.

**Syringomyelia** is a fluid-filled cavity (syrinx) that expands from within the central canal, first destroying the crossing spinothalamic fibers in the anterior white commissure. This produces **bilateral loss of pain and temperature in a cape distribution** (upper extremities, shoulders, and upper chest) while the dorsal columns — being posterior to the syrinx — remain intact. As the syrinx expands outward, anterior horn (LMN signs), then corticospinal tract (UMN signs below) damage follows.

**Cauda equina syndrome** occurs when compression of the lumbar and sacral nerve roots below the conus (L1-L2 and below) — typically by a large disc herniation or tumor — produces **lower motor neuron signs** (flaccidity, areflexia, muscle atrophy), saddle anesthesia (S2-S4 dermatomes), and bowel/bladder dysfunction. It is a neurosurgical emergency.

---

## 10. Thalamus as Relay Center

The thalamus is the brain's primary relay and integration hub — almost all sensory information (with the notable exception of olfaction) passes through specific thalamic nuclei before reaching the cortex. Each nucleus below is presented as a relay station: what it receives, what it sends, and what it means clinically.

---

**Ventral Posterolateral Nucleus (VPL)**
Receives somatosensory information from the body — specifically, fine touch and proprioception arriving via the medial lemniscus, and pain and temperature arriving via the spinothalamic tract. Projects to the primary somatosensory cortex (S1, postcentral gyrus). The VPL is the final subcortical relay for all body sensation; damage produces contralateral hemisensory loss and, with recovery, can lead to thalamic pain syndrome (Déjerine-Roussy).

---

**Ventral Posteromedial Nucleus (VPM)**
Receives somatosensory information from the face via the trigeminal sensory system, and taste information from the nucleus tractus solitarius (NTS). Projects to the face area of S1 and to the insula (taste cortex). The VPM is the body's counterpart for the head — VPL covers the trunk and limbs, VPM covers everything above the neck.

---

**Lateral Geniculate Nucleus (LGN)**
Receives visual input directly from retinal ganglion cell axons traveling in the optic tract. Projects via the optic radiations to the primary visual cortex (V1) in the calcarine sulcus of the occipital lobe. The LGN is organized retinotopically across six laminae, with alternating layers receiving input from the ipsilateral and contralateral eyes — the anatomical basis of binocular vision integration.

---

**Medial Geniculate Nucleus (MGN)**
Receives auditory input from the inferior colliculus of the midbrain, completing the ascending auditory pathway. Projects to the primary auditory cortex (A1, Heschl's gyri) in the superior temporal plane. The MGN is tonotopically organized, preserving the frequency map of the cochlea throughout the ascending pathway.

---

**Ventral Anterior / Ventral Lateral Nuclei (VA / VL)**
Receive motor loop input: VA from the basal ganglia (GPi/SNr output via the thalamic fasciculus) and VL from the cerebellum (dentate nucleus via the superior cerebellar peduncle). Both project to the motor and premotor cortex. These are the final relays through which both major motor control systems — the basal ganglia and cerebellum — influence voluntary movement. The VA/VL complex is the target of deep brain stimulation for tremor disorders.

---

**Mediodorsal Nucleus (MD)**
Receives input from the prefrontal cortex, amygdala, and limbic system. Projects reciprocally to the prefrontal cortex. The MD is the thalamic hub for executive function and emotional regulation — it is the only thalamic nucleus significantly connected with the PFC rather than primary sensory or motor cortex. Bilateral MD damage contributes to thalamic amnesia and affective blunting, as seen in paramedian thalamic strokes.

---

**Anterior Nuclear Group**
Receives input from the mammillary bodies via the mammillothalamic tract — a key station in the Papez memory circuit (hippocampus → fornix → mammillary bodies → anterior thalamus → cingulate cortex → hippocampus). Projects to the cingulate gyrus. Damage to the anterior nucleus — as from infarction or surgical disruption — disrupts the Papez circuit and contributes to anterograde amnesia.

---

**Pulvinar**
The largest thalamic nucleus, occupying the posterior pole of the thalamus. Receives convergent input from visual cortex, parietal association cortex, and superior colliculus. Projects to parieto-occipital and temporal association areas. The pulvinar is involved in visual attention — directing processing resources toward salient stimuli — and in integrating visual information across cortical areas. Right pulvinar lesions are more likely to produce hemispatial neglect than left-sided lesions.

---

## 11. Neuroplasticity

The nervous system retains the capacity to change its structure and function in response to experience, learning, and injury throughout life — a property called **neuroplasticity**.

---

**Long-Term Potentiation (LTP)**
A persistent strengthening of synaptic connections following repeated co-activation of pre- and postsynaptic neurons. LTP is the primary cellular mechanism of learning and memory in the CNS.

LTP depends on **NMDA receptors**, which function as molecular coincidence detectors: they require simultaneous presynaptic glutamate release AND sufficient postsynaptic depolarization (to relieve a magnesium ion block) before calcium can flow through. When both conditions are met, the calcium influx triggers intracellular signaling cascades that increase the number and conductance of AMPA receptors at the synapse, making the connection more sensitive and durable. This is the cellular instantiation of Hebb's rule — "neurons that fire together, wire together."

---

**Long-Term Depression (LTD)**
A persistent weakening of synaptic connections that is the functional complement of LTP. LTD results from synaptic activity that falls below the threshold needed for LTP — typically asynchronous or low-frequency stimulation — reducing AMPA receptor density or function at the synapse.

LTD is particularly important in **cerebellar motor learning**: climbing fiber error signals from the inferior olive, when paired with parallel fiber activity during an erroneous movement, induce LTD at parallel fiber-Purkinje cell synapses, gradually correcting the motor program over repeated trials.

---

**Cortical Remapping**
Use-dependent reorganization of the representational maps in the sensory and motor cortex. The maps are not anatomically fixed — they continuously update based on patterns of activity and experience.

Following **deafferentation** (loss of sensory input, such as from limb amputation), the cortical territory previously devoted to the missing limb is invaded by representations from adjacent body parts, driven by spreading of thalamocortical connections and unmasking of previously suppressed synapses. This produces **phantom limb sensations** — the amputated limb is felt because its cortical representation is now activated by neighboring inputs. Conversely, extensive skilled practice (in musicians, athletes, or Braille readers) expands the cortical territory devoted to the trained body part, increasing representational precision.

---

**Glymphatic System**
A sleep-dependent waste clearance system in the CNS in which cerebrospinal fluid is driven through perivascular spaces by the pulsatile flow of arterial blood, flushing interstitial metabolic waste — including amyloid-beta and tau — into the venous circulation and lymphatic drainage.

The system depends on **astrocyte aquaporin-4 (AQP4) water channels**, which line the perivascular endfeet and facilitate convective CSF-interstitial fluid exchange. Glymphatic flow is dramatically upregulated during slow-wave sleep and nearly halted during wakefulness. Chronic sleep deprivation impairs this clearance, leading to accumulation of amyloid-beta in the brain parenchyma — a mechanistic link between poor sleep and accelerated neurodegeneration in Alzheimer's disease.`;

  await db.update(studyGuidesTable).set({ content: newContent }).where(eq(studyGuidesTable.id, 28));
  console.log("✅ CNS study guide reorganized.");
}

reorganize().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
