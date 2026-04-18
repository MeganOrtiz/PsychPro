import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable, topicsTable } from "./schema";

async function update() {
  console.log("Renaming Brain Structures → Neuroanatomy and updating study guide...");

  // Rename the topic
  await db.update(topicsTable).set({
    name: "Neuroanatomy",
    description: "Comprehensive review of brain and spinal cord structures — cerebral cortex, subcortical nuclei, thalamus, hypothalamus, basal ganglia, limbic system, brainstem, cerebellum, and white matter pathways — with clinical correlations throughout."
  }).where(eq(topicsTable.id, 16));
  console.log("  ✓ Topic renamed to Neuroanatomy");

  const content = `# Neuroanatomy — Cortical and Subcortical Structures

---

# PART I: THE CEREBRAL CORTEX

The cerebral cortex is the outer layer of gray matter (~2-4 mm thick) covering the cerebral hemispheres — folded into gyri (ridges) and sulci (grooves) that expand surface area to approximately 2,500 cm². Organization follows a gradient:
- **Primary areas:** Direct sensory input or motor output
- **Unimodal association areas:** Process a single modality more abstractly
- **Heteromodal association areas:** Integrate across modalities

The further from primary cortex → more abstract, integrative, flexible processing. The left hemisphere dominates for language in ~95% of right-handers.

---

## 1. Frontal Lobe

**Primary Motor Cortex (M1)** | *Precentral gyrus — BA 4*
Contains **Betz cells** — the largest neurons in the brain — whose axons form the corticospinal tract. Body map = contralateral motor homunculus (face and hand disproportionately large; leg on medial surface).
*Damage:* Contralateral UMN weakness — initially flaccid, then spastic with hyperreflexia and Babinski sign.

---

**Premotor Cortex** | *Lateral BA 6, anterior to M1*
Sequences and programs externally-cued movements (reaching for a visible object). Contributes axons to the corticospinal tract.
*Key distinction from SMA:* Premotor = externally triggered; SMA = internally driven.

---

**Supplementary Motor Area (SMA)** | *Medial BA 6*
Generates self-initiated, internally programmed movement sequences and bimanual coordination. Active during mental rehearsal of movement.
*Damage:* Akinesia (difficulty initiating movement). Bilateral SMA → **akinetic mutism** (awake but no spontaneous movement or speech). Unilateral → **alien hand syndrome**.

---

**Dorsolateral Prefrontal Cortex (dlPFC)** | *BA 9 and 46*
The executive hub: **working memory** (holding and manipulating information on-line), **cognitive flexibility** (task-switching), **planning**, and **inhibitory control** over prepotent responses. Continuous dialogue with parietal cortex and thalamus.
*Damage:* **Dysexecutive syndrome** — poor planning, perseveration, impaired working memory, difficulty suppressing irrelevant information. Substrate for executive dysfunction in TBI, frontal stroke, ADHD.

---

**Orbitofrontal / Ventromedial Prefrontal Cortex (OFC/vmPFC)** | *BA 11, 12, 25*
Integrates emotion and reward into real-world decision-making. Dense amygdala input. Encodes the emotional value of outcomes; essential for learning from consequences.
*Damage:* **Pseudopsychopathic syndrome** — socially disinhibited behavior, impaired risk assessment, emotional lability, poor impulse control despite intact intelligence on formal testing. The **somatic marker hypothesis** (Damasio): OFC/vmPFC damage removes the emotional "gut-feeling" signals that normally bias advantageous decisions.

---

**Anterior Cingulate Cortex (ACC)** | *BA 24, 32 — medial surface*
Monitors conflict between competing responses, allocates cognitive control resources, and integrates cognitive with motivational/emotional information. Also involved in pain affect (the unpleasantness of pain, not its location).
*Damage:* Akinetic mutism (bilateral), attentional deficits, impaired error monitoring. Hyperactivity linked to OCD and anxiety; hypoactivity to depression.

---

**Broca's Area** | *Left BA 44/45 (pars triangularis and opercularis)*
Language production — coordinates articulatory programming, syntactic processing, and grammar. Connected to Wernicke's area via the **arcuate fasciculus**.
*Damage:* **Broca's (expressive/nonfluent) aphasia** — effortful, telegraphic speech with intact comprehension. "Agrammatic" — patient omits function words and morphological endings.

---

**Frontal Eye Fields (FEF)** | *BA 8*
Generate **contralateral voluntary saccades** (deliberate gaze shifts). Also involved in covert visual attention.
*Damage:* Eyes deviate toward the lesion (ipsilateral) — the intact FEF drives the eyes to its contralateral side, unopposed.

---

## 2. Parietal Lobe

**Primary Somatosensory Cortex (S1)** | *Postcentral gyrus — BA 1, 2, 3*
Receives somatotopically organized input from the VPL and VPM thalamic nuclei. Contains the **sensory homunculus** (contralateral; face and hand over-represented).
*Damage:* Contralateral loss of fine touch, vibration, proprioception, and two-point discrimination; astereognosis (inability to identify objects by touch alone).

---

**Superior Parietal Lobule (SPL)** | *BA 5, 7*
Integrates proprioceptive and visual information for **body-centered spatial processing** — knowing where your limbs are and guiding movement in space. Contributes to the dorsal visual stream ("where" pathway).
*Damage:* Optic ataxia (misreaching), impaired limb position sense, spatial disorientation.

---

**Angular Gyrus** | *Left BA 39*
Cross-modal integration hub — converges visual, auditory, and somatosensory information. Critical for reading, writing, arithmetic, and semantic processing. Part of the heteromodal association cortex.
*Damage (left):* **Gerstmann's syndrome** — acalculia (cannot calculate) + agraphia (cannot write) + finger agnosia (cannot name fingers) + right-left disorientation.

---

**Supramarginal Gyrus** | *Left BA 40*
Involved in phonological processing, somatosensory integration, and ideomotor apraxia pathways. Part of the perisylvian language network.
*Damage (left):* **Conduction aphasia** — fluent, paraphasic speech with impaired repetition (cannot repeat back what they hear); the arcuate fasciculus connecting Broca's and Wernicke's is disrupted.

---

**Right Parietal Cortex** | *BA 39/40, right hemisphere*
Dominant for spatial attention and **hemispatial neglect**. Receives input from the pulvinar, superior colliculus, and right FEF. Mediates attention to the contralateral (left) half of space.
*Damage (right):* **Hemispatial neglect** — the patient does not attend to the left side of space (not blindness — a failure of attention and awareness). Neglect is more severe and persistent after right hemisphere damage.

---

## 3. Temporal Lobe

**Primary Auditory Cortex (A1)** | *Heschl's gyri — BA 41, 42*
Receives tonotopically organized input from the medial geniculate nucleus. Left A1 dominant for speech sounds; right A1 dominant for non-speech sounds (music, prosody, environmental sounds).
*Damage (bilateral):* Cortical deafness — sound is perceived but not recognized.

---

**Wernicke's Area** | *Left superior temporal gyrus — BA 22*
Language comprehension — phonological decoding, word recognition, and semantic access. Connected to Broca's area via the arcuate fasciculus.
*Damage:* **Wernicke's (receptive/fluent) aphasia** — fluent, melodic speech filled with **paraphasias** (substituted sounds or words) and **neologisms**; severely impaired comprehension. Patient often unaware of errors.

---

**Fusiform Gyrus (Fusiform Face Area)** | *Occipitotemporal sulcus — BA 37, ventral stream*
Specialist region for face recognition (also objects, words, expertise-based categories). Part of the ventral visual stream ("what" pathway).
*Damage (bilateral):* **Prosopagnosia** — cannot recognize familiar faces by visual appearance alone (but can recognize by voice).

---

**Medial Temporal Lobe (MTL)** | *Hippocampus, entorhinal cortex, parahippocampal gyrus, perirhinal cortex*
The memory encoding gateway. The **entorhinal cortex** is the primary input-output interface for the hippocampus — all cortical information entering the hippocampus is funneled through it (Braak staging in AD begins here). The **hippocampus** binds multimodal cortical inputs into unified episodic memories and is essential for **spatial navigation** (place cells, grid cells). The **parahippocampal gyrus** stores contextual spatial and scene information.
*Damage (bilateral):* **Dense anterograde amnesia** — inability to form new declarative memories while remote memories and skills remain intact (as in patient H.M.).

---

## 4. Occipital Lobe

**Primary Visual Cortex (V1)** | *Calcarine sulcus — BA 17*
Receives retinotopically organized input from the LGN. Contains orientation-selective neurons (Hubel and Wiesel). The macula (central vision) is represented at the occipital pole; peripheral vision is represented anteriorly. Visual field is contralateral — upper visual field projects to the lower bank of the calcarine (lingual gyrus); lower visual field projects to the upper bank (cuneus).
*Damage:* Contralateral homonymous hemianopia with macular sparing (macular cortex has dual blood supply).

---

**Dorsal Visual Stream ("Where/How" pathway)** | *V1 → V2/V3 → MT/V5 → parietal cortex*
Processes **motion, depth, spatial location**, and **visually-guided action** — how to interact with objects in space. Fast but low-resolution.
*Damage:* Akinetopsia (motion blindness), optic ataxia (misreaching), spatial disorientation.

---

**Ventral Visual Stream ("What" pathway)** | *V1 → V2 → V4 → inferior temporal cortex*
Processes **form, color, identity** — what objects are. Builds object representations through progressively more complex feature extraction: V1 edges → V2 contours → V4 color/form → IT object identity.
*Damage:* Visual agnosia (cannot recognize objects by sight alone), prosopagnosia, achromatopsia (cortical color blindness from V4 damage).

---

# PART II: SUBCORTICAL STRUCTURES

---

## 5. The Thalamus

See CNS Study Guide Section 7 for comprehensive thalamic nuclei detail. Key organizing principles:

1. **Every sensory modality** (except olfaction) relays through the thalamus before reaching cortex
2. **Motor relay:** VA (basal ganglia output) and VL (cerebellar output) both project to motor/premotor cortex — the convergence point for these two motor systems
3. **The TRN (Thalamic Reticular Nucleus)** is a GABAergic shell that gates thalamocortical transmission — it is the substrate for selective attention
4. **Bilateral thalamic damage** (paramedian stroke, Wernicke's) → devastating amnesia disproportionate to lesion size

---

## 6. Basal Ganglia — Circuits and Function

The basal ganglia are a group of subcortical nuclei that **modulate** motor, cognitive, and limbic cortical activity through inhibitory and disinhibitory circuits. They do not initiate movement directly — they select wanted actions and suppress competing ones.

### Key Structures

| Structure | Composition | Dominant Neurotransmitter |
|---|---|---|
| **Striatum** | Caudate nucleus + Putamen | GABA (MSNs); ACh (interneurons) |
| **Globus Pallidus externa (GPe)** | Inhibitory projection to STN | GABA |
| **Globus Pallidus interna (GPi)** | Main BG output — inhibits thalamus | GABA |
| **Substantia Nigra pars compacta (SNc)** | Dopamine input to striatum | Dopamine (D1 and D2 receptors) |
| **Substantia Nigra pars reticulata (SNr)** | BG output (especially to brainstem) | GABA |
| **Subthalamic Nucleus (STN)** | Only glutamatergic (excitatory) BG nucleus | Glutamate |

### The Direct Pathway — Movement Facilitation

Cortex (glutamate) → Striatum D1-MSNs → GPi/SNr inhibited → Thalamus (VA/VL) released from inhibition → Motor cortex facilitated → **Movement**

Key: *Less GPi inhibition = more thalamic activity = more movement*

### The Indirect Pathway — Movement Suppression

Cortex (glutamate) → Striatum D2-MSNs → GPe inhibited → STN released from inhibition → STN excites GPi → GPi inhibits thalamus more → Motor cortex suppressed → **Movement suppressed**

Key: *More GPi activity = less thalamic activity = less movement*

### Dopamine's Opposing Effects

| Dopamine Effect | On Direct Pathway (D1 receptors) | On Indirect Pathway (D2 receptors) | Net Result |
|---|---|---|---|
| **Dopamine present (normal)** | D1 activation → facilitates direct pathway | D2 activation → inhibits indirect pathway | Both effects favor movement facilitation |
| **Dopamine absent (Parkinson's)** | Direct pathway underactive | Indirect pathway overactive | Net: excessive GPi inhibition of thalamus → **akinesia, rigidity** |
| **Dopamine excess** | Direct pathway overactive | Indirect pathway underactive | Net: insufficient GPi inhibition → **hyperkinesia, chorea** (HD) |

### Basal Ganglia Output Targets
- **GPi → VA/VL thalamus** → motor and premotor cortex (the primary motor circuit)
- **GPi/SNr → superior colliculus** → saccadic eye movements (frontal eye fields circuit)
- **Ventral striatum (nucleus accumbens) → ventral pallidum → mediodorsal thalamus** → prefrontal cortex (the limbic/reward circuit)

---

## 7. The Limbic System — Memory and Emotion

The limbic system is not a single structure but a network of interconnected regions that collectively mediate **emotion, motivation, and memory**.

### The Papez Circuit — Memory
The fundamental memory circuit, originally described by James Papez (1937):

Hippocampus → Fornix → Mammillary Bodies → Mammillothalamic Tract → Anterior Thalamic Nucleus → Cingulate Cortex → Entorhinal Cortex → back to Hippocampus

Each node in this circuit is clinically important:
- **Hippocampus:** Anterograde amnesia with bilateral damage (H.M.)
- **Fornix:** Severing → anterograde amnesia (anterior commissure surgery)
- **Mammillary bodies:** Thiamine deficiency → Korsakoff syndrome
- **Anterior thalamus:** Paramedian stroke → thalamic amnesia
- **Entorhinal cortex:** First site of Braak stage I-II tau in AD → earliest memory impairment

### Key Limbic Structures

**Hippocampus**
*Location:* Medial temporal lobe — arches alongside the lateral ventricle.
Encodes new declarative memories (episodic and semantic) and is critical for spatial navigation (place cells). Its CA1 region is exquisitely sensitive to ischemia and is the primary site of hippocampal atrophy in AD. The hippocampus does not store memories — it binds multimodal cortical inputs into coherent episodes, then consolidates them to distributed neocortical sites during sleep.

**Amygdala**
*Location:* Anterior temporal pole, medial.
The brain's threat detector and emotional memory modulator. Processes fear, threat, and emotional salience. The **dual-route model** explains why emotional stimuli can be processed without conscious awareness: the "low road" (sensory thalamus → amygdala, milliseconds) vs. the "high road" (sensory thalamus → cortex → amygdala, slower but more accurate).
*Damage (bilateral — Klüver-Bucy syndrome):* Hypersexuality, hyperorality, visual agnosia, placidity/tameness, and loss of fear responses.

**Anterior Cingulate Cortex (ACC)**
A bridge between limbic and cognitive systems. Monitors conflict between competing responses and integrates emotional significance into goal-directed behavior. Allocates cognitive control based on stakes and conflict level. Also processes the **affective dimension of pain** (the suffering, not just the location).

**Posterior Cingulate Cortex (PCC) / Retrosplenial Cortex**
A major hub of the **Default Mode Network (DMN)** — active during rest, self-referential thought, episodic memory retrieval, and future planning. Highly metabolically active at rest; deactivates during focused tasks. PCC is one of the earliest cortical regions to show FDG-PET hypometabolism in AD.

**Nucleus Accumbens (NAcc)** — shell and core
The limbic-motor interface: converts motivational states (reward, desire, aversion) into motor action. The core of the **mesolimbic dopamine reward circuit** — dopamine release from the VTA into the NAcc is the neural basis of reward, anticipation, and reinforcement learning. NAcc is dysregulated in addiction (chronically elevated dopamine signaling from drugs → reward dysregulation → craving).

**Fornix**
The main output pathway of the hippocampus, arching from the hippocampus to the mammillary bodies, septal nuclei, and anterior thalamus. Damage or surgical section → anterograde amnesia.

---

## 8. Brainstem — Nuclei and Syndromes

The brainstem (midbrain → pons → medulla) contains the nuclei of cranial nerves III-XII, critical autonomic centers, ascending and descending long tracts, and the monoaminergic nuclei that modulate the entire forebrain.

### Monoaminergic Systems (Key Brainstem Nuclei)

| System | Nucleus | Projects To | Primary Functions |
|---|---|---|---|
| **Dopamine** | Substantia nigra pars compacta (SNc) | Striatum (nigrostriatal) | Motor control; loss → Parkinson's disease |
| **Dopamine** | Ventral tegmental area (VTA) | NAcc, PFC (mesolimbic/mesocortical) | Reward, motivation, working memory |
| **Norepinephrine** | Locus coeruleus (LC) | Entire brain (diffuse) | Arousal, vigilance, attention, stress response |
| **Serotonin** | Raphe nuclei | Entire brain (diffuse) | Mood, sleep, appetite, pain modulation |
| **Acetylcholine** | Pedunculopontine nucleus (PPN) | Thalamus, basal ganglia | REM sleep induction; arousal |

### Named Brainstem Syndromes

| Syndrome | Location | Key Features |
|---|---|---|
| **Wallenberg (Lateral Medullary)** | Lateral medulla — PICA territory | Ipsilateral: facial pain/temp loss, Horner's, dysphagia, ataxia. Contralateral: body pain/temp loss (STT). Vertigo, hiccups |
| **Weber** | Midbrain — cerebral peduncle | Ipsilateral CN III palsy (down-and-out eye, dilated pupil). Contralateral: hemiplegia (UMN) |
| **Benedikt** | Midbrain tegmentum | Ipsilateral CN III palsy. Contralateral: tremor/ataxia (red nucleus/superior cerebellar peduncle) |
| **Parinaud's** | Dorsal midbrain (tectal) | Upgaze palsy; pupillary light-near dissociation; convergence-retraction nystagmus; caused by pineal tumors or hydrocephalus |
| **Internuclear Ophthalmoplegia (INO)** | Medial longitudinal fasciculus (MLF) | Ipsilateral adduction failure (cannot look toward midline); contralateral abduction nystagmus; bilateral INO = MS until proven otherwise |
| **Locked-in Syndrome** | Ventral pons (basilar artery) | Quadriplegia + anarthria but preserved consciousness and vertical gaze (intact midbrain) |

---

## 9. Cerebellum

The cerebellum computes **error-based correction** of movements and refines timing, coordination, and motor learning. It does not initiate movement but shapes ongoing movements to match intended trajectories.

> **Critical fact:** Cerebellar control is **ipsilateral** — the right cerebellar hemisphere controls the right body side. This is because the cerebellum's primary pathway crosses twice (once in the superior cerebellar peduncle and once in the motor pathway to the spinal cord), returning control to the ipsilateral side. This is opposite to the cortex, which is contralateral.

### Three Functional Divisions

| Division | Structures | Afferents | Function | Damage |
|---|---|---|---|---|
| **Vestibulocerebellum** | Flocculonodular lobe | Vestibular nuclei | Equilibrium, balance, eye movement stabilization (VOR adaptation) | Truncal ataxia, gait imbalance, nystagmus |
| **Spinocerebellum** | Vermis + intermediate zone | Spinocerebellar tracts (proprioception) | Ongoing limb movement correction; regulates muscle tone | Limb ataxia (intermediate zone), gait ataxia (vermis), dysdiadochokinesia |
| **Cerebrocerebellum** | Lateral hemispheres | Corticopontine → pontine nuclei | Motor planning, timing, cognitive processing; receives from motor cortex | Dysmetria, intention tremor, poor motor timing; Schmahmann's syndrome |

### Cerebellar Peduncles

| Peduncle | Primary Direction | Major Contents |
|---|---|---|
| **Inferior cerebellar peduncle (restiform body)** | Input | Inferior olivary climbing fibers, posterior spinocerebellar tract, vestibular input |
| **Middle cerebellar peduncle (brachium pontis)** | Input | Pontine nuclei relay from motor cortex (corticopontocerebellar pathway) — the massive afferent pathway |
| **Superior cerebellar peduncle (brachium conjunctivum)** | Output | Dentate nucleus → crosses midline → VL thalamus → motor cortex; also to red nucleus |

### Schmahmann's Syndrome (Cerebellar Cognitive Affective Syndrome)
Lateral cerebellar hemisphere damage → cognitive symptoms: executive dysfunction (planning, set-shifting), visuospatial impairment, language changes, blunted affect. Demonstrates that the cerebellum is part of cognitive, not just motor, networks.

---

## 10. White Matter Pathways

White matter consists of myelinated axon bundles connecting different brain regions. Three anatomical categories:

### 1. Projection Fibers (Cortex ↔ Subcortical Targets)
**Internal capsule** — major two-way highway; contains:
- *Anterior limb:* Frontopontine and anterior thalamic radiations
- *Genu:* Corticobulbar fibers (cranial nerve motor control)
- *Posterior limb:* **Corticospinal tract** (voluntary motor — contralateral body) + thalamocortical sensory radiations
- *Retrolenticular:* Optic radiations (Meyer's loop = lower visual field; superior radiation = upper visual field)

**Optic Radiations — Clinical Significance:**
Meyer's loop (anterior temporal → LGN) carries upper visual field (lower retina). Temporal lobe lesion → **"pie in the sky" defect** (contralateral superior quadrantanopia).

### 2. Commissural Fibers (Hemisphere ↔ Hemisphere)
**Corpus callosum** — the largest white matter structure: ~200-250 million axons connecting homotopic cortical regions across hemispheres.
- Genu: prefrontal connections
- Body: motor and somatosensory connections
- Splenium: visual and parietal connections; damage → visual disconnection syndromes

*Corpus callosum section (split-brain):* Each hemisphere processes information in isolation. Right hand can complete a task that the left hand cannot name (because language is left-lateralized and cannot access right hemisphere motor activity).

**Anterior commissure** — connects olfactory regions and anterior temporal poles; involved in amygdala interhemispheric communication.

### 3. Association Fibers (Cortex ↔ Cortex within same hemisphere)

| Bundle | Connects | Function |
|---|---|---|
| **Arcuate fasciculus** | Broca's area ↔ Wernicke's area (perisylvian) | Language; damage → conduction aphasia |
| **Uncinate fasciculus** | OFC/anterior temporal ↔ frontal pole | Emotional memory, semantic associations; affected in FTD |
| **Superior longitudinal fasciculus (SLF)** | Frontal ↔ parietal ↔ temporal | Attention, spatial processing, working memory |
| **Inferior longitudinal fasciculus (ILF)** | Occipital ↔ temporal | Object recognition, visual memory |
| **Cingulum** | Cingulate cortex, retrosplenial → hippocampus, parahippocampal | Memory, emotion (limbic highway) |

### Key Limbic White Matter Tracts

**Fornix:** Hippocampus → mammillary bodies → anterior thalamus (Papez circuit); main hippocampal output
**Stria terminalis:** Amygdala → hypothalamus + BNST; anxiety and fear output pathway
**Medial forebrain bundle (MFB):** VTA/SNc dopaminergic fibers → limbic cortex; reward and motivation highway
**Mammillothalamic tract:** Mammillary bodies → anterior thalamic nucleus (Papez circuit); thiamine deficiency interrupts → Korsakoff syndrome`;

  const result = await db.update(studyGuidesTable)
    .set({ content, title: "Neuroanatomy — Cortical and Subcortical Structures" })
    .where(eq(studyGuidesTable.id, 32))
    .returning();

  console.log(`  ✓ Neuroanatomy guide updated (id=${result[0]?.id})`);
  console.log("✅ Neuroanatomy formatting complete.");
}

update().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
