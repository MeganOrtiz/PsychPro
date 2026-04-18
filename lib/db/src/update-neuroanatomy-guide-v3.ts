import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

async function update() {
  console.log("Updating Neuroanatomy guide v3 — removing italic labels and Brodmann areas...");

  const content = `# Neuroanatomy — Cortical and Subcortical Structures

---

# PART I: THE CEREBRAL CORTEX

The cerebral cortex is the outer layer of gray matter (~2-4 mm thick) covering the cerebral hemispheres — folded into gyri (ridges) and sulci (grooves) that expand surface area to roughly 2,500 cm². It is organized along a gradient: **primary areas** handle direct sensory input or motor output; **unimodal association areas** process a single modality more abstractly; **heteromodal association areas** integrate across modalities. The further from primary cortex, the more abstract and flexible the processing. The left hemisphere dominates for language in approximately 95% of right-handers.

---

## 1. Frontal Lobe

### Primary Motor Cortex

Located in the precentral gyrus, the motor cortex generates voluntary movement commands through **Betz cells** — the largest neurons in the brain — whose axons form the corticospinal tract. Its body map, the **motor homunculus**, is contralateral and distorted: the face and hand occupy disproportionately large territory because of their fine motor demands; the lower limb representation lies on the medial surface.

Damage produces contralateral upper motor neuron weakness — initially flaccid (due to cortical shock), then evolving to spastic with hyperreflexia and a Babinski sign.

---

### Premotor Cortex

Located on the lateral surface anterior to the primary motor cortex, the premotor cortex sequences and programs complex movements that are externally cued — for example, reaching for a visible object. It contributes axons to the corticospinal tract and is distinguished from the supplementary motor area by its dependence on external triggers rather than internal intention.

---

### Supplementary Motor Area (SMA)

Located on the medial surface anterior to the primary motor cortex, the SMA generates self-initiated, internally programmed movement sequences and bimanual coordination. It is active even during mental rehearsal of movement, before any muscle contraction occurs.

Bilateral SMA damage produces **akinetic mutism**: the patient appears awake with open eyes but initiates no spontaneous movement or speech. Unilateral damage can produce **alien hand syndrome**, where one hand performs complex goal-directed actions outside conscious control.

---

### Dorsolateral Prefrontal Cortex

The executive hub of the frontal lobe, responsible for **working memory** (holding and manipulating information on-line), **cognitive flexibility** (switching between rules or tasks), **planning**, and **inhibitory control** over automatic responses. It maintains continuous dialogue with parietal cortex and the thalamus to regulate goal-directed behavior.

Damage produces the **dysexecutive syndrome** — impaired planning, perseveration (rigid adherence to one response set), reduced working memory, and difficulty suppressing irrelevant information. This is the neuroanatomical substrate for executive dysfunction after TBI, frontal stroke, and in many neuropsychiatric conditions.

---

### Orbitofrontal and Ventromedial Prefrontal Cortex

Located at the base of the frontal lobe and on the medial orbital surface, this region integrates emotional and reward information into real-world decision-making. It receives dense direct input from the amygdala and encodes the emotional value of outcomes — essential for learning from consequences and guiding behavior by anticipated reward and punishment.

Damage produces a **pseudopsychopathic syndrome**: socially disinhibited behavior, impaired risk assessment, emotional lability, and poor impulse control despite intact performance on formal intelligence testing. This is the classic picture after OFC injury (Phineas Gage is the historical archetype). The **somatic marker hypothesis** (Damasio) proposes that this region provides the emotional "gut-feeling" signals that normally bias advantageous decisions — without it, behavior becomes detached from consequences.

---

### Anterior Cingulate Cortex

Located on the medial surface surrounding the corpus callosum, the anterior cingulate monitors conflict between competing responses, allocates cognitive control resources accordingly, and integrates cognitive demands with motivational and emotional signals. It also processes the affective dimension of pain — the unpleasantness and suffering, distinct from pain location.

Bilateral damage produces akinetic mutism; hyperactivity is associated with OCD and anxiety; hypoactivity with depression and apathy.

---

### Broca's Area

Located in the left inferior frontal gyrus, Broca's area coordinates language production — articulatory programming, syntactic processing, and grammatical assembly. It is connected to Wernicke's area via the **arcuate fasciculus**.

Damage produces **Broca's (expressive/nonfluent) aphasia** — effortful, telegraphic speech with relatively intact comprehension. Speech is agrammatic: the patient omits function words and grammatical morphemes, producing content-word-only output.

---

### Frontal Eye Fields

Located in the posterior frontal lobe just anterior to the premotor cortex, the frontal eye fields generate contralateral voluntary saccades — deliberate gaze shifts — and are involved in covert visual attention.

Damage causes conjugate eye deviation toward the side of the lesion: the intact contralateral frontal eye field drives the eyes toward its contralateral side, unopposed.

---

## 2. Parietal Lobe

### Primary Somatosensory Cortex

Located in the postcentral gyrus, the primary somatosensory cortex receives somatotopically organized input from the VPL (body) and VPM (face) thalamic nuclei. Its body map, the **sensory homunculus**, is contralateral and distorted — the face and hand are over-represented proportional to their sensory acuity.

Damage produces contralateral loss of fine touch, vibration, proprioception, and two-point discrimination, as well as **astereognosis** (inability to identify objects by touch alone) and **graphesthesia** (inability to identify numbers traced on skin).

---

### Superior Parietal Lobule

The superior parietal lobule integrates proprioceptive, vestibular, and visual information to construct a body-centered map of space — knowing where limbs are and guiding movement within the environment. It is a core node of the dorsal visual stream.

Damage produces **optic ataxia** (misreaching for visual targets), impaired limb position sense, and spatial disorientation. Bilateral posterior parietal damage can produce **Balint's syndrome** (simultanagnosia, optic ataxia, and ocular apraxia).

---

### Angular Gyrus

Located at the junction of the parietal, temporal, and occipital lobes, the angular gyrus is a cross-modal integration hub that converges visual, auditory, and somatosensory information. It is essential for reading, writing, arithmetic, and semantic processing.

Left hemisphere damage produces **Gerstmann's syndrome**: the tetrad of acalculia (impaired arithmetic), agraphia (impaired writing), finger agnosia (inability to identify or name fingers), and right-left disorientation.

---

### Supramarginal Gyrus

Located in the left inferior parietal lobule, the supramarginal gyrus supports phonological processing and is a node in the perisylvian language network. It is also involved in the pathway for learned limb movements.

Damage to the left supramarginal gyrus is associated with **conduction aphasia** — fluent speech with paraphasic errors, markedly impaired repetition, and relatively preserved comprehension — reflecting disruption of the arcuate fasciculus connection between Broca's and Wernicke's areas.

---

### Right Parietal Cortex

The right inferior parietal lobule is the dominant hemisphere for spatial attention and awareness of the entire peripersonal space. It receives converging input from the right frontal eye fields, right superior colliculus, and the pulvinar.

Damage to the right parietal cortex produces **hemispatial neglect** — a failure to attend to the left side of space that is distinct from blindness. The patient does not register stimuli on the neglected side and may be unaware of the deficit. Neglect is more severe, more common, and more persistent after right hemisphere damage than after equivalent left hemisphere lesions.

---

## 3. Temporal Lobe

### Primary Auditory Cortex

Located in Heschl's gyri on the superior temporal plane (buried within the lateral sulcus), the primary auditory cortex receives tonotopically organized input from the medial geniculate nucleus. The left hemisphere is dominant for speech sounds; the right hemisphere is dominant for non-speech sounds including music, prosody, and environmental sounds.

Bilateral damage produces **cortical deafness** — sound is perceived (pure-tone audiometry is intact) but cannot be recognized or identified.

---

### Wernicke's Area

Located in the left posterior superior temporal gyrus, Wernicke's area mediates language comprehension — phonological decoding, word recognition, and semantic access. It is connected to Broca's area via the arcuate fasciculus.

Damage produces **Wernicke's (receptive/fluent) aphasia** — fluent, melodic speech filled with **paraphasias** (substituted phonemes or words) and **neologisms**; severely impaired auditory and reading comprehension; and typically preserved prosody. Patients are often unaware of their errors.

---

### Fusiform Gyrus

Located in the ventral occipitotemporal cortex, the fusiform gyrus contains specialized regions for recognizing faces, objects, written words, and other categories requiring fine-grained within-category discrimination. It is a critical node of the ventral visual stream.

Bilateral damage produces **prosopagnosia** — the selective inability to recognize familiar faces by visual appearance alone, despite intact object recognition, visual acuity, and memory. Familiar individuals may still be recognized by voice, gait, or contextual cues.

---

### Medial Temporal Lobe

The medial temporal lobe — comprising the **hippocampus**, **entorhinal cortex**, **perirhinal cortex**, and **parahippocampal gyrus** — is the memory encoding gateway of the brain. The entorhinal cortex is the primary input-output interface of the hippocampus; all cortical information is funneled through it before reaching hippocampal circuits. The hippocampus binds multimodal cortical inputs into unified episodic memories and is essential for spatial navigation. The parahippocampal gyrus encodes contextual spatial and scene information.

Bilateral hippocampal damage produces **dense anterograde amnesia** — the inability to form new declarative memories while remote memories, procedural skills, and personality remain intact (the pattern established by patient H.M.). Entorhinal cortex is the first site of tau pathology in Alzheimer's disease (Braak stages I-II), which explains why episodic memory — and specifically delayed recall — is the earliest cognitive symptom.

---

## 4. Occipital Lobe

### Primary Visual Cortex

Located in the calcarine sulcus on the medial occipital surface, the primary visual cortex receives retinotopically organized input from the lateral geniculate nucleus. The macula (central vision) is represented at the occipital pole; peripheral vision is represented anteriorly. Upper visual field projects to the lingual gyrus (lower bank); lower visual field projects to the cuneus (upper bank).

Unilateral damage produces a contralateral homonymous hemianopia, typically with **macular sparing** (because the occipital pole has a dual blood supply from both the posterior cerebral artery and middle cerebral artery collaterals).

---

### Dorsal Visual Stream

Running from the primary visual cortex through the superior parietal lobule to the posterior parietal and frontal cortex, the dorsal stream processes motion, depth, spatial location, and visually guided action — answering "where is this?" and "how do I interact with it?" It operates rapidly but at lower resolution.

Damage produces akinetopsia (inability to perceive motion), optic ataxia, and spatial disorientation.

---

### Ventral Visual Stream

Running from the primary visual cortex through the inferior temporal cortex, the ventral stream builds progressively complex representations of object form, color, and identity — answering "what is this?" Primary visual cortex extracts edges → V2 extracts contours → V4 processes color and form → inferotemporal cortex represents whole objects.

Damage produces visual agnosia, prosopagnosia, and cortical achromatopsia (color blindness from V4 damage despite intact cone function).

---

# PART II: SUBCORTICAL STRUCTURES

---

## 5. The Thalamus

See the CNS study guide for comprehensive thalamic nuclei detail. Key organizing principles:

- Every sensory modality except olfaction relays through the thalamus before reaching cortex
- Motor relays: VA nucleus (basal ganglia output) and VL nucleus (cerebellar output) both converge on motor and premotor cortex — the thalamus is where these two motor systems meet
- The **Thalamic Reticular Nucleus** is a GABAergic shell that gates thalamocortical transmission — the substrate of selective attention
- Bilateral thalamic damage (paramedian stroke, Wernicke's encephalopathy) causes amnesia and impaired consciousness dramatically disproportionate to lesion size

---

## 6. Basal Ganglia — Circuits and Function

The basal ganglia are a group of subcortical nuclei that modulate motor, cognitive, and limbic cortical activity through inhibitory and disinhibitory circuits. They do not initiate movement — they **select wanted actions and suppress competing ones**.

### Key Structures

| Structure | Composition | Neurotransmitter |
|---|---|---|
| **Striatum** | Caudate nucleus + Putamen | GABA (medium spiny neurons); ACh (interneurons) |
| **Globus Pallidus externa (GPe)** | Projects to STN | GABA |
| **Globus Pallidus interna (GPi)** | Primary output nucleus — tonically inhibits thalamus | GABA |
| **Substantia Nigra pars compacta (SNc)** | Dopamine input to striatum | Dopamine (D1 and D2 receptors) |
| **Substantia Nigra pars reticulata (SNr)** | Output (especially to brainstem/superior colliculus) | GABA |
| **Subthalamic Nucleus (STN)** | The only excitatory nucleus in the circuit | Glutamate |

### The Direct Pathway — Movement Facilitation

Cortex (glutamate) → Striatum D1-MSNs → GPi/SNr inhibited → Thalamus (VA/VL) released from inhibition → Motor cortex facilitated → **Movement**

Less GPi activity = more thalamic output = more movement.

### The Indirect Pathway — Movement Suppression

Cortex (glutamate) → Striatum D2-MSNs → GPe inhibited → STN released from inhibition → STN excites GPi → GPi inhibits thalamus more strongly → Motor cortex suppressed → **Movement suppressed**

More GPi activity = less thalamic output = less movement.

### Dopamine's Opposing Effects on the Two Pathways

| State | Direct Pathway (D1) | Indirect Pathway (D2) | Net Effect |
|---|---|---|---|
| **Normal dopamine** | D1 activation facilitates direct pathway | D2 activation inhibits indirect pathway | Both favor movement — balanced, smooth control |
| **Parkinson's** (dopamine depleted) | Direct pathway underactive | Indirect pathway overactive | Excessive GPi inhibition → **akinesia, rigidity** |
| **Huntington's** (indirect MSNs lost first) | Direct pathway relatively intact | Indirect pathway underactive | Insufficient GPi activity → **chorea, hyperkinesia** |

### Basal Ganglia Output Circuits

- GPi → VA/VL thalamus → motor and premotor cortex (the primary motor loop)
- GPi/SNr → superior colliculus (saccadic eye movement control)
- Ventral striatum (nucleus accumbens) → ventral pallidum → mediodorsal thalamus → prefrontal cortex (the limbic-cognitive loop)

---

## 7. The Limbic System — Memory and Emotion

The limbic system is a network of interconnected regions mediating emotion, motivation, and memory consolidation.

### The Papez Circuit — Memory Consolidation

Hippocampus → Fornix → Mammillary Bodies → Mammillothalamic Tract → Anterior Thalamic Nucleus → Cingulate Cortex → Entorhinal Cortex → back to Hippocampus

Each node is clinically significant:

- **Hippocampus** — bilateral damage → anterograde amnesia (H.M.)
- **Fornix** — section or compression → anterograde amnesia
- **Mammillary bodies** — thiamine deficiency (Korsakoff syndrome)
- **Anterior thalamus** — paramedian stroke → thalamic amnesia
- **Entorhinal cortex** — first site of AD tau pathology (Braak I-II)

### Key Limbic Structures

**Hippocampus**
Located in the medial temporal lobe arching alongside the lateral ventricle, the hippocampus encodes new declarative (episodic and semantic) memories and supports spatial navigation through place cells. It does not store memories permanently — it binds multimodal cortical inputs during encoding, then consolidates them to distributed neocortical sites during sleep. The CA1 subfield is exquisitely vulnerable to ischemia. Bilateral hippocampal damage from any cause produces dense anterograde amnesia with preserved procedural memory and remote autobiographical memory.

**Amygdala**
Located in the anterior medial temporal lobe, the amygdala is the brain's threat detector and emotional memory amplifier. It processes fear, threat detection, and emotional salience. The dual-route model explains fear conditioning: the "low road" (sensory thalamus → amygdala, milliseconds) allows rapid unconscious threat responses; the "high road" (thalamus → cortex → amygdala, slower) provides contextual analysis. Bilateral amygdala damage produces **Klüver-Bucy syndrome**: hypersexuality, hyperorality, visual agnosia, placidity, and loss of fear responses.

**Anterior Cingulate Cortex**
A bridge between limbic and cognitive systems — monitors response conflict, integrates emotional significance into goal-directed behavior, and allocates cognitive control based on stakes and effort required. Also processes the affective dimension of pain.

**Posterior Cingulate Cortex and Retrosplenial Cortex**
A major hub of the **Default Mode Network (DMN)** — active during rest, self-referential thought, episodic memory retrieval, and future planning. This is one of the first cortical regions to show hypometabolism on FDG-PET in Alzheimer's disease, often detectable years before symptom onset.

**Nucleus Accumbens**
The limbic-motor interface, converting motivational states (reward, desire, aversion) into motor behavior. The core of the **mesolimbic dopamine reward circuit**: dopamine release from the ventral tegmental area into the nucleus accumbens encodes reward prediction error and drives reinforcement learning. Addiction involves chronic overactivation of this pathway by drugs, shifting the system toward compulsive drug-seeking.

**Fornix**
The primary output pathway of the hippocampus, arching from hippocampus to mammillary bodies, septal nuclei, and anterior thalamus. Damage or surgical sectioning produces anterograde amnesia.

---

## 8. Brainstem — Nuclei and Syndromes

### Monoaminergic Systems

| System | Nucleus | Projects To | Functions |
|---|---|---|---|
| **Dopamine** | Substantia nigra pars compacta | Striatum (nigrostriatal pathway) | Motor control; loss → Parkinson's disease |
| **Dopamine** | Ventral tegmental area (VTA) | Nucleus accumbens, prefrontal cortex | Reward, motivation, working memory |
| **Norepinephrine** | Locus coeruleus | Entire brain (diffuse) | Arousal, vigilance, attention, stress response |
| **Serotonin** | Raphe nuclei | Entire brain (diffuse) | Mood, sleep, appetite, pain modulation |
| **Acetylcholine** | Pedunculopontine nucleus | Thalamus, basal ganglia | REM sleep induction; arousal |

### Named Brainstem Syndromes

| Syndrome | Location | Key Features |
|---|---|---|
| **Wallenberg (Lateral Medullary)** | Lateral medulla — PICA territory | Ipsilateral: facial pain/temperature loss, Horner's syndrome, dysphagia, ataxia. Contralateral: body pain/temperature loss (spinothalamic). Also vertigo, hiccups. |
| **Weber** | Midbrain — cerebral peduncle | Ipsilateral CN III palsy (down-and-out pupil, ptosis). Contralateral: UMN hemiplegia |
| **Benedikt** | Midbrain tegmentum | Ipsilateral CN III palsy. Contralateral: tremor and ataxia (red nucleus/superior cerebellar peduncle) |
| **Parinaud's** | Dorsal midbrain (tectal plate) | Upgaze palsy; light-near dissociation; convergence-retraction nystagmus. Caused by pineal tumors, hydrocephalus. |
| **Internuclear Ophthalmoplegia (INO)** | Medial longitudinal fasciculus (MLF) | Ipsilateral adduction failure; contralateral abduction nystagmus. Bilateral INO = multiple sclerosis until proven otherwise. |
| **Locked-in Syndrome** | Ventral pons (basilar artery occlusion) | Quadriplegia and anarthria with preserved consciousness and vertical gaze (midbrain intact) |

---

## 9. Cerebellum

The cerebellum computes error-based correction of ongoing movements, refining timing, coordination, and trajectory through a continuous comparison of intended vs. actual movement. It does not initiate movement — it shapes it. Cerebellar control is **ipsilateral**: the right cerebellar hemisphere controls the right body side, because the output pathway (superior cerebellar peduncle → VL thalamus → motor cortex → corticospinal tract) crosses twice, returning to the ipsilateral side.

### Three Functional Divisions

| Division | Structures | Main Inputs | Function | Effects of Damage |
|---|---|---|---|---|
| **Vestibulocerebellum** | Flocculonodular lobe | Vestibular nuclei, visual system | Equilibrium, balance, VOR adaptation | Truncal ataxia, wide-based gait, nystagmus |
| **Spinocerebellum** | Vermis + intermediate zone | Spinocerebellar tracts (proprioception) | Ongoing limb and gait correction; muscle tone | Limb dysmetria, gait ataxia, dysdiadochokinesia |
| **Cerebrocerebellum** | Lateral hemispheres | Cortex → pontine nuclei | Motor planning, timing, and cognitive processing | Dysmetria, intention tremor, poor timing; Schmahmann's syndrome |

**Schmahmann's syndrome** (cerebellar cognitive affective syndrome): damage to the lateral cerebellar hemispheres produces executive dysfunction, visuospatial impairment, language changes, and affective blunting — reflecting the cerebellum's participation in cognitive, not only motor, networks.

### Cerebellar Peduncles

| Peduncle | Direction | Major Contents |
|---|---|---|
| **Inferior cerebellar peduncle** | Input | Inferior olive climbing fibers, posterior spinocerebellar tract, vestibular input |
| **Middle cerebellar peduncle** | Input | Pontine nuclei relay from motor cortex — the largest afferent pathway |
| **Superior cerebellar peduncle** | Output | Dentate nucleus → crosses midline → VL thalamus → motor cortex; also to red nucleus |

---

## 10. White Matter Pathways

### Projection Fibers (Cortex ↔ Subcortical Targets)

The **internal capsule** is the main two-way highway between cortex and subcortex:

- **Anterior limb:** Frontopontine and anterior thalamic radiations (prefrontal-thalamic connections)
- **Genu:** Corticobulbar fibers — voluntary control of cranial nerve motor nuclei
- **Posterior limb:** Corticospinal tract (voluntary motor) + thalamocortical sensory radiations
- **Retrolenticular part:** Optic radiations — Meyer's loop (lower fibers, anterior temporal) carries upper visual field; superior radiation carries lower visual field

**Optic radiations — clinical significance:** A temporal lobe lesion interrupts Meyer's loop → contralateral **superior quadrantanopia** ("pie in the sky" visual field defect). A parietal lesion interrupts the superior radiation → contralateral inferior quadrantanopia.

### Commissural Fibers (Hemisphere ↔ Hemisphere)

The **corpus callosum** is the largest white matter structure — approximately 200-250 million axons connecting homotopic cortical regions across the midline:
- Genu: prefrontal connections
- Body: motor and somatosensory connections
- Splenium: visual and parietal connections

Corpus callosum section produces the **split-brain syndrome**: each hemisphere processes information in isolation — the left hand can perform a task that the language-dominant left hemisphere cannot name, because the information is inaccessible across hemispheres.

The **anterior commissure** connects the olfactory regions and anterior temporal poles.

### Long Association Fibers (Cortex ↔ Cortex, Same Hemisphere)

| Bundle | Connects | Function |
|---|---|---|
| **Arcuate fasciculus** | Broca's area ↔ Wernicke's area (perisylvian) | Language; damage → conduction aphasia |
| **Uncinate fasciculus** | OFC/anterior temporal ↔ frontal pole | Emotional memory and semantic associations; affected in bvFTD |
| **Superior longitudinal fasciculus** | Frontal ↔ parietal ↔ temporal | Attention, spatial processing, working memory |
| **Inferior longitudinal fasciculus** | Occipital ↔ temporal | Object recognition and visual memory |
| **Cingulum** | Cingulate cortex ↔ hippocampus/parahippocampal | Memory and emotion (the limbic white matter highway) |

### Key Limbic White Matter Tracts

**Fornix** — Hippocampus → mammillary bodies → anterior thalamus (core of the Papez circuit)
**Stria terminalis** — Amygdala → hypothalamus and BNST (anxiety and fear output)
**Medial forebrain bundle** — VTA/SNc dopaminergic fibers → limbic cortex (reward and motivation)
**Mammillothalamic tract** — Mammillary bodies → anterior thalamic nucleus; interrupted by thiamine deficiency → Korsakoff syndrome`;

  const result = await db.update(studyGuidesTable)
    .set({ content })
    .where(eq(studyGuidesTable.id, 32))
    .returning();

  console.log(`  ✓ Neuroanatomy guide updated (id=${result[0]?.id})`);
  console.log("✅ Done.");
}

update().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
