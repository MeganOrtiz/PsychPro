import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  topicsTable, flashcardsTable, quizQuestionsTable,
  studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable,
} from "./schema";

const TOPIC_ID = 16;

async function rework() {
  console.log("Reworking Brain Structures (topic 16) — term-definition format + 55 flashcards...");

  const exams = await db.select({ id: practiceExamsTable.id }).from(practiceExamsTable).where(eq(practiceExamsTable.topicId, TOPIC_ID));
  for (const e of exams) {
    await db.delete(practiceExamQuestionsTable).where(eq(practiceExamQuestionsTable.examId, e.id));
  }
  await db.delete(practiceExamsTable).where(eq(practiceExamsTable.topicId, TOPIC_ID));
  await db.delete(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, TOPIC_ID));
  await db.delete(flashcardsTable).where(eq(flashcardsTable.topicId, TOPIC_ID));
  await db.delete(studyGuidesTable).where(eq(studyGuidesTable.topicId, TOPIC_ID));
  console.log("  ✓ Cleared old data");

  await db.update(topicsTable).set({
    description: "A structure-by-structure guide to the human brain — cortical lobes and their functional areas, the diencephalon, basal ganglia, limbic system, brainstem, cerebellum, and white matter pathways, with connectivity and clinical correlates for each region."
  }).where(eq(topicsTable.id, TOPIC_ID));

  // ─────────────────────────────────────────────────────────────────
  // STUDY GUIDE — term-definition format throughout
  // ─────────────────────────────────────────────────────────────────
  const sgContent = `# Brain Structures

---

# PART I: THE CEREBRAL CORTEX

The cerebral cortex is the outer layer of gray matter covering the cerebral hemispheres — approximately 2–4 mm thick and densely folded into gyri (ridges) and sulci (grooves) that increase its surface area to roughly 2,500 cm². It is organized into **primary areas** (direct sensory input or motor output), **unimodal association areas** (processing a single modality more abstractly), and **heteromodal association areas** (integrating across modalities). The further from primary cortex, the more abstract and integrative the function. The left and right hemispheres are functionally lateralized — left dominant for language in ~95% of right-handers.

---

## 1. Frontal Lobe

**Primary Motor Cortex (M1)**
*Location:* Precentral gyrus — Brodmann Area (BA) 4.
The motor cortex generates voluntary movement commands. It contains the **Betz cells** — the largest neurons in the brain — whose axons form the corticospinal tract. Its body map, the **motor homunculus**, is contralateral and distorted: the face and hand occupy a disproportionately large territory because of their fine motor demands; the leg is on the medial surface.

*Clinical damage:* Contralateral upper motor neuron (UMN) weakness — initially flaccid, then spastic with hyperreflexia and a Babinski sign.

---

**Premotor Cortex**
*Location:* Lateral BA 6, anterior to M1.
Sequences and programs complex, externally cued movements. It contributes axons to the corticospinal tract and is engaged when movement is triggered by an external stimulus (e.g., reaching for an object in view).

*Contrast with SMA:* The premotor cortex is externally triggered; the SMA is internally driven.

---

**Supplementary Motor Area (SMA)**
*Location:* Medial BA 6, on the medial surface of the hemisphere.
Generates self-initiated, internally programmed movements — sequences performed from memory, bimanual coordination, and movements initiated without an external cue. It is active even during mental rehearsal of a movement.

*Clinical damage:* **Akinesia** — difficulty initiating movement. Bilateral SMA damage causes **akinetic mutism**: the patient is awake with open eyes but makes no spontaneous movement or speech. Unilateral SMA lesions can produce **alien hand syndrome** (the hand acts as if controlled by another will).

---

**Dorsolateral Prefrontal Cortex (dlPFC)**
*Location:* BA 9 and 46.
The executive hub of the brain — responsible for **working memory** (holding and manipulating information on-line), **cognitive flexibility** (switching between rules or tasks), **planning**, and **inhibitory control** over prepotent responses. Maintains continuous dialogue with the parietal cortex and thalamus.

*Clinical damage:* **Dysexecutive syndrome** — impaired planning, perseveration (getting stuck on one response set), poor working memory, and difficulty suppressing irrelevant information. This is the neuroanatomical substrate for executive dysfunction after TBI, frontal stroke, and in many psychiatric disorders.

---

**Orbitofrontal / Ventromedial Prefrontal Cortex (OFC / vmPFC)**
*Location:* BA 11, 12, 25 — the base of the frontal lobe and medial surface.
Integrates emotion and reward information into real-world decision-making. Receives dense input directly from the amygdala and encodes the emotional value of outcomes. Essential for learning from consequences and guiding behavior by anticipated reward or punishment.

*Clinical damage:* **Pseudopsychopathic syndrome** — socially disinhibited behavior, impaired risk assessment, emotional lability, inappropriate humor, and poor impulse control, despite intact intelligence on formal testing. This is the classical picture after OFC injury (Phineas Gage being the historical archetype). The **somatic marker hypothesis** (Damasio) proposes that OFC/vmPFC damage removes the emotional "gut feeling" signals that normally bias advantageous decisions.

---

**Anterior Cingulate Cortex (ACC)**
*Location:* BA 24 and 32 — wraps over the genu of the corpus callosum on the medial frontal surface.
Monitors **conflict** (when competing responses are simultaneously active), detects **errors**, and processes the **affective component of pain** — the unpleasantness and suffering associated with painful experience, distinct from its sensory quality (which is processed in S1). A key node of the **default mode network** and a bridge between cognitive and emotional control systems.

*Clinical damage:* Bilateral ACC damage causes profound apathy and abulia (severe reduction in spontaneous behavior and speech). The ACC is implicated in OCD (hyperactivity) and depression.

---

**Broca's Area**
*Location:* Left inferior frontal gyrus — BA 44 (pars opercularis) and BA 45 (pars triangularis).
Responsible for **speech production**, motor programming of articulation, syntactic processing (grammar), and verbal working memory. Critical for generating the motor plan that converts a linguistic intention into fluent speech.

*Clinical damage:* **Broca's (expressive / nonfluent) aphasia** — effortful, halting, agrammatic speech with relatively preserved comprehension. Repetition is impaired. Often accompanied by right face and hand weakness because M1 is adjacent.

---

**Frontal Eye Fields (FEF)**
*Location:* BA 8, posterior middle frontal gyrus.
Generate **voluntary saccades** to the contralateral visual hemifield. The FEF is tonically inhibited at rest; activation drives the eyes toward the opposite side.

*Clinical damage:* Acute lesion → **ipsilateral gaze deviation** (eyes look toward the lesion, away from the hemiparesis) because the intact contralateral FEF drives eyes unopposed. In seizures, the irritating focus drives excess activation → eyes deviate **away** from the seizure focus (contralateral).

---

## 2. Parietal Lobe

**Primary Somatosensory Cortex (S1)**
*Location:* Postcentral gyrus — BA 1, 2, 3.
Receives touch, pressure, vibration, temperature, and proprioception from the contralateral body via the VPL thalamus. Organized as the **sensory homunculus** — a distorted body map mirroring the motor homunculus, with the face and hand disproportionately represented.

*Clinical damage:* Contralateral hemisensory loss — impaired tactile discrimination, graphesthesia (identifying numbers traced on skin), and stereognosis (identifying objects by touch).

---

**Superior Parietal Lobule (SPL)**
*Location:* BA 5 and 7, above the intraparietal sulcus.
Integrates somatosensory and visual information for **visuomotor guidance** — reaching, grasping, and directing limb movements through space. Also contributes to body-schema representation and spatial working memory.

---

**Angular Gyrus**
*Location:* Left BA 39 — inferior parietal lobule, at the junction of the temporal and parietal lobes.
A cross-modal integration hub linking language, reading, writing, arithmetic, and body-schema. Connects auditory, visual, and somatosensory association cortices.

*Clinical damage (left):* **Gerstmann's syndrome** — a tetrad of finger agnosia (cannot identify individual fingers), left-right disorientation, agraphia (impaired writing), and acalculia (impaired arithmetic). Also associated with alexia (reading impairment) when the lesion is larger.

---

**Supramarginal Gyrus**
*Location:* Left BA 40 — inferior parietal lobule, surrounding the upturned end of the lateral sulcus.
Contributes to **phonological processing** (the sound-based representation of language) and **limb-kinetic praxis** (the fine motor programming needed for skilled tool use).

*Clinical damage:* Conduction aphasia (with arcuate fasciculus involvement) and ideomotor apraxia.

---

**Right Parietal Lobe and Hemispatial Neglect**
The right parietal lobe — particularly the right temporoparietal junction (TPJ) and inferior parietal lobule — is dominant for **directed spatial attention** and **spatial representation** of the entire environment, including both hemispaces. The left parietal attends only to the right; the right attends to both.

*Clinical damage:* **Hemispatial neglect** — failure to attend to, represent, or respond to stimuli in the contralateral (left) hemispace, despite intact primary vision. Approximately five times more common and more severe after right than left parietal lesions. Associated with **anosognosia** (unawareness of deficit) and **constructional apraxia** (inability to copy drawings or assemble objects). Diagnosed by line bisection (patients bisect far to the right of center) and cancellation tasks (miss left-sided targets).

---

## 3. Temporal Lobe

**Primary Auditory Cortex (A1)**
*Location:* Heschl's gyri — BA 41 and 42, on the superior surface of the temporal lobe within the lateral sulcus.
Receives tonotopically organized input from the medial geniculate nucleus (MGN) of the thalamus. Processes basic acoustic features of sound — frequency, intensity, and timing.

---

**Wernicke's Area**
*Location:* Left posterior superior temporal gyrus — BA 22.
Essential for **language comprehension** and phonological decoding — mapping heard sound sequences onto stored word representations. Connects with Broca's area via the arcuate fasciculus.

*Clinical damage:* **Wernicke's (receptive / fluent) aphasia** — fluent but semantically incoherent speech filled with paraphasias (word substitutions) and neologisms ("word salad"), with severely impaired auditory comprehension and repetition. No motor deficit.

---

**Fusiform Gyrus**
*Location:* Inferior temporal / occipito-temporal cortex — BA 37.
Contains the **fusiform face area (FFA)**, specialized for identifying individual faces — right-lateralized. Part of the ventral visual ("what") stream for object identity.

*Clinical damage (right):* **Prosopagnosia** — inability to recognize faces as individuals (familiar people are not recognized by face alone), despite recognizing that a face is a face. Other object recognition is typically preserved.

---

**Medial Temporal Lobe (MTL)**
A collective term for the hippocampus, parahippocampal gyrus (perirhinal and entorhinal cortex), and amygdala — the brain's memory and emotion hub. Covered in detail under the Limbic System section below.

---

## 4. Occipital Lobe

**Primary Visual Cortex (V1 / Striate Cortex)**
*Location:* Banks of the calcarine sulcus — BA 17. The upper bank (cuneus) represents the lower visual field; the lower bank (lingual gyrus) represents the upper visual field.
Processes the initial cortical representation of visual input, organized **retinotopically**. The macula (central vision) is disproportionately represented at the posterior pole and has dual blood supply (middle and posterior cerebral arteries), explaining macular sparing in posterior MCA/PCA strokes.

*Clinical damage:* Bilateral V1 destruction → **cortical blindness** with intact pupillary light reflexes (the pupillary arc bypasses V1 via the superior colliculus). Unilateral lesion → **contralateral homonymous hemianopia**.

---

**Dorsal Visual Stream ("Where / How" Pathway)**
*Route:* V1 → extrastriate cortex → posterior parietal cortex.
Processes **spatial location**, **motion**, and **visually guided action** — reaching, grasping, and navigating through space. Operates largely unconsciously and rapidly.

*Clinical damage:* Optic ataxia (unable to reach accurately under visual guidance), hemispatial neglect, akinetopsia (V5/MT damage — cannot perceive visual motion).

---

**Ventral Visual Stream ("What" Pathway)**
*Route:* V1 → extrastriate cortex → inferotemporal cortex.
Processes **object identity**, **color**, **face recognition**, and **word form** — building a detailed conscious representation of what is being looked at.

*Clinical damage:* Visual agnosias (failure to recognize objects, faces, or words despite intact primary vision). Pure alexia ("word blindness") from disconnection of the left visual cortex and the word-form area.

---

# PART II: SUBCORTICAL STRUCTURES

Subcortical structures are compact gray-matter nuclei located beneath the cortex. Several organizing principles govern their function and clinical impact:

- **Small lesions, large deficits** — high density of fibers and nuclei means even tiny infarcts produce dramatic syndromes.
- **Circuit thinking** — similar deficits arise from damage anywhere in a shared loop (Papez circuit for memory; cortico-striato-thalamo-cortical loops for movement and cognition).
- **Lateralization mirrors cortex** — left and right subcortical lesions produce different cognitive profiles.
- **Cognition, not just movement** — subcortical damage affects mood, memory, and executive function, and can closely mimic psychiatric disease.

---

## 5. The Diencephalon

### 5a. Thalamus

**Ventral Posterolateral Nucleus (VPL)**
Relays somatosensory information from the body — fine touch and proprioception (from the medial lemniscus) and pain and temperature (from the spinothalamic tract) — to S1.

*Clinical damage:* Contralateral hemisensory loss; with recovery, may evolve into **thalamic pain syndrome (Déjerine-Roussy)** — burning, allodynic, treatment-refractory contralateral pain.

---

**Ventral Posteromedial Nucleus (VPM)**
Relays somatosensory input from the face (trigeminal system) and taste (from the nucleus tractus solitarius) to the face area of S1 and the insula.

---

**Lateral Geniculate Nucleus (LGN)**
The dedicated visual relay — receives retinal ganglion axons from the optic tract and projects via the optic radiations to V1. Organized across six laminae that alternately receive input from the ipsilateral and contralateral eyes.

---

**Medial Geniculate Nucleus (MGN)**
The auditory relay — receives input from the inferior colliculus and projects to the primary auditory cortex (Heschl's gyri). Tonotopically organized, preserving the cochlear frequency map.

---

**Ventral Anterior (VA) and Ventral Lateral (VL) Nuclei**
Motor relay nuclei. VA receives basal ganglia output (from GPi/SNr); VL receives cerebellar output (from the dentate nucleus via the superior cerebellar peduncle). Both project to motor and premotor cortex. These are the final subcortical relays through which the basal ganglia and cerebellum influence voluntary movement. VA/VL are targets for **deep brain stimulation** in tremor disorders.

---

**Mediodorsal Nucleus (MD)**
Connects bidirectionally with the prefrontal cortex, amygdala, and limbic system. Involved in executive function, decision-making, and emotional regulation. Bilateral MD damage — as in paramedian thalamic stroke — produces **thalamic amnesia** and affective blunting.

---

**Anterior Nuclear Group**
A critical node in the **Papez memory circuit** — receives input from the mammillary bodies via the mammillothalamic tract and projects to the cingulate cortex. Damage disrupts the memory circuit and contributes to anterograde amnesia.

---

**Pulvinar**
The largest thalamic nucleus, occupying the posterior pole. Receives convergent input from visual cortex, parietal association cortex, and superior colliculus. Projects to parieto-occipital and temporal association areas. Involved in **visual attention** — directing processing toward salient stimuli. Right pulvinar lesions are more likely to produce hemispatial neglect.

---

**Thalamic Reticular Nucleus (TRN)**
A shell of GABAergic neurons encasing the thalamus that does **not** project to the cortex — instead, it projects inhibitory axons back onto thalamocortical relay neurons. Modulates the gain of thalamocortical transmission, functioning as a **selective attention gate** (amplifying task-relevant signals, suppressing others). Also generates **sleep spindles** — the oscillatory signature of NREM stage 2 sleep.

---

### 5b. Hypothalamus

**Suprachiasmatic Nucleus (SCN)**
*Location:* Anterior hypothalamus, immediately above the optic chiasm.
The body's **master circadian clock** — a self-sustaining transcription-translation feedback loop (CLOCK/BMAL1 drive PER/CRY, which feed back to suppress their own expression, cycling every ~24 hours). Entrained by light via the retinohypothalamic tract. Coordinates daily rhythms of sleep, hormone secretion, body temperature, and behavior throughout the entire body via autonomic and neuroendocrine outputs.

---

**Paraventricular Nucleus (PVN)**
Produces **oxytocin** and **vasopressin (ADH)** (transported axonally to the posterior pituitary) and releases **corticotropin-releasing hormone (CRH)** into the portal system to drive pituitary ACTH → cortisol — the core of the **HPA stress axis**.

---

**Supraoptic Nucleus**
Also synthesizes vasopressin and oxytocin, projecting to the posterior pituitary for release into blood. Damage (tumor, surgery, TBI) causes **central diabetes insipidus** — loss of ADH → massive dilute polyuria and polydipsia.

---

**Arcuate Nucleus**
Regulates energy balance and releases hypothalamic releasing hormones (GHRH, TRH, GnRH) into the portal system. Contains two opposing neuronal populations: **NPY/AgRP neurons** (orexigenic — promote eating) and **POMC/CART neurons** (anorexigenic — suppress eating). The arcuate is a key target for hormones such as leptin (satiety signal from fat tissue).

---

**Ventromedial Nucleus (VMH)**
The **satiety center** — signals fullness and inhibits further food intake. VMH lesions → hyperphagia and obesity.

---

**Lateral Hypothalamic Area (LHA)**
The **feeding/hunger center** — promotes food seeking and eating. LHA lesions → aphagia (cessation of eating) and wasting. Contains **orexin (hypocretin) neurons** — critical stabilizers of the sleep-wake cycle. Loss of orexin neurons (autoimmune) causes **narcolepsy type 1**: excessive daytime sleepiness, cataplexy (sudden muscle weakness triggered by strong emotion), sleep paralysis, and hypnagogic hallucinations.

---

**Preoptic Area**
Serves as the **thermostat set-point** for body temperature regulation and plays a central role in sleep onset. The **ventrolateral preoptic nucleus (VLPO)** contains GABAergic and galaninergic neurons that inhibit the major arousal nuclei (locus coeruleus, TMN, raphe, orexin neurons) to initiate sleep.

---

**Mammillary Bodies**
Two small nuclei on the ventral hypothalamic surface. Receive hippocampal output (arriving via the fornix) and relay it forward to the anterior thalamus via the **mammillothalamic tract** — a critical node in the Papez memory circuit.

*Clinical damage:* Bilateral atrophy of the mammillary bodies (visible on MRI as loss of normal T1 signal) is the pathological hallmark of **Wernicke's encephalopathy** from thiamine deficiency, leading to **Korsakoff syndrome** — dense anterograde amnesia, retrograde amnesia with a temporal gradient, and confabulation.

---

### 5c. Epithalamus

**Pineal Gland**
Secretes **melatonin** in response to darkness — the signal travels from the SCN through a multisynaptic sympathetic pathway (superior cervical ganglion → pineal). Melatonin promotes sleep onset and entrains circadian rhythms. Pineal calcification with age makes it a useful midline landmark on head CT.

*Clinical damage:* Pineal tumors compress the dorsal midbrain (tectum), causing **Parinaud's syndrome** (impaired upward gaze, convergence-retraction nystagmus, light-near dissociation) and may obstruct the cerebral aqueduct, causing obstructive hydrocephalus.

---

**Habenular Nuclei**
Connect the limbic forebrain (via the stria medullaris) to brainstem monoaminergic systems (via the fasciculus retroflexus to the raphe and interpeduncular nucleus). The **lateral habenula** responds to negative outcomes and reward prediction errors, signaling the VTA and raphe to suppress dopamine and serotonin release. Lateral habenula hyperactivity is implicated in anhedonia and the "depressive brake" on reward circuits. Ketamine's rapid antidepressant effect is partly mediated by suppressing pathological burst firing in the lateral habenula.

---

## 6. The Basal Ganglia

**Striatum (Caudate + Putamen)**
The primary **input structure** of the basal ganglia — receives dense glutamatergic input from virtually all areas of the cortex and dopaminergic input from the substantia nigra pars compacta. The caudate (C-shaped, following the lateral ventricle) is most connected with associative and limbic circuits; the putamen (lateral, largest striatal component) is most connected with somatomotor cortex and drives motor execution and motor learning.

*Caudate clinical damage:* Bilateral caudate atrophy is the hallmark of **Huntington's disease** — producing the classic triad of chorea, cognitive decline, and psychiatric symptoms. Focal caudate strokes cause **abulia** and executive dysfunction.

---

**Globus Pallidus External (GPe)**
An intermediate node of the **indirect pathway** — receives inhibitory (GABAergic) input from D2-bearing striatal neurons and projects inhibitory fibers to the subthalamic nucleus (STN). When the striatum is active, the GPe is inhibited → the STN is released from inhibition and drives more GPi output → movement is suppressed.

---

**Globus Pallidus Internal (GPi)**
A major **output nucleus** of the basal ganglia. Sends tonic GABAergic inhibitory fibers to the VA/VL thalamus. It is continuously active, tonically suppressing thalamic (and thus cortical) activity. The degree of this tonic inhibition is modulated by the two pathways. GPi lesions cause **dystonia**; GPi DBS is a treatment for Parkinson's disease and primary dystonia.

---

**Substantia Nigra Pars Compacta (SNc)**
Contains dopaminergic neurons (dark from neuromelanin accumulation) that project via the **nigrostriatal pathway** to the striatum. Dopamine modulates both pathways: D1 receptors (direct pathway) are excitatory → facilitates movement; D2 receptors (indirect pathway) are inhibitory → reduces movement suppression.

*Clinical damage:* Progressive SNc degeneration (alpha-synuclein Lewy body accumulation) causes **Parkinson's disease** — resting tremor, rigidity, and bradykinesia emerge after ~70–80% of neurons are lost.

---

**Substantia Nigra Pars Reticulata (SNr)**
A GABAergic output nucleus functionally similar to the GPi — projects inhibitory output to the superior colliculus (gaze control) and thalamus. It processes oculomotor and limbic basal ganglia loops.

---

**Subthalamic Nucleus (STN)**
Located at the diencephalic-mesencephalic junction. The key **excitatory (glutamatergic) driver** of the indirect pathway — projects to GPi and SNr, increasing their inhibitory output to the thalamus and suppressing movement. The STN acts as a "brake" on competing movements.

*Clinical damage:* Unilateral STN lesion (typically lacunar stroke) → **hemiballismus** — violent, flinging, large-amplitude involuntary movements of the contralateral limbs from loss of GPi excitation → thalamic disinhibition → motor cortex overactivation. The STN is the most common **DBS target** in Parkinson's disease.

---

**Direct Pathway ("Go" Signal)**
Cortex → Striatum (D1 MSNs) → GPi/SNr *(inhibit)* → Thalamus disinhibited → Motor cortex facilitated → **Movement**.

Dopamine excites D1 receptors on direct-pathway MSNs → amplifies the go signal.

---

**Indirect Pathway ("Stop" Signal)**
Cortex → Striatum (D2 MSNs) → GPe *(inhibit)* → STN released → GPi/SNr excited → Thalamus inhibited → Motor cortex suppressed → **Movement suppressed**.

Dopamine inhibits D2 receptors on indirect-pathway MSNs → reduces the stop signal.

In **Parkinson's disease**, dopamine loss tips the balance toward the indirect pathway → GPi overactive → thalamus excessively inhibited → **hypokinesia**. In early **Huntington's disease**, D2-bearing indirect-pathway MSNs die first → indirect brake released → **chorea** (hyperkinesia).

---

## 7. The Limbic System

**Hippocampus**
*Location:* Medial temporal lobe — forms the floor of the inferior horn of the lateral ventricle.
Essential for **forming new declarative (explicit) memories** — both episodic (autobiographical events) and semantic (facts). Binds together the distributed cortical representations of a memory during encoding and is critical during the initial consolidation period. Also supports **spatial navigation** via place cells that fire selectively in specific locations. One of only two brain regions sustaining robust **adult neurogenesis** (along with the olfactory bulb) — new granule cells are continuously added to the dentate gyrus.

*Major circuit:* Entorhinal cortex → Perforant path → Dentate gyrus → CA3 → CA1 → Subiculum → Fornix → Mammillary bodies → Anterior thalamus → Cingulate cortex (Papez circuit).

*Lateralization:* Left hippocampus → verbal memory (words, stories). Right hippocampus → spatial/visuospatial memory (places, routes, faces).

*Clinical damage:* Bilateral damage → **profound anterograde amnesia** with relatively preserved remote memories and intact procedural learning (as in patient H.M.). The hippocampus is among the first structures damaged in **Alzheimer's disease** (entorhinal cortex and CA1 — Braak stages I–II) and is highly vulnerable to **herpes simplex encephalitis**.

---

**Amygdala**
*Location:* Medial temporal lobe, immediately anterior to the hippocampus.
The brain's primary **emotional salience detector** — especially for fear, threat, and reward. Critical for emotional learning (fear conditioning), retrieval of emotional memories, and social cognition (reading emotion in faces and body language).

*Two input routes:*
- **Fast "low road"** (thalamus → amygdala direct): rapid, coarse, ~12 ms — enables immediate threat responses before full perceptual analysis.
- **Slow "high road"** (thalamus → sensory cortex → amygdala): ~40–50 ms, detailed and accurate.

*Lateralization:* Right amygdala — rapid, automatic, nonverbal emotional processing. Left amygdala — sustained, verbally mediated emotional evaluation and regulation.

*Clinical damage:* Bilateral damage (e.g., Urbach-Wiethe disease) → impaired fear conditioning, inability to recognize fearful facial expressions, elimination of normal personal-space responses, and **Klüver-Bucy syndrome** features (hyperorality, hypersexuality, visual agnosia, placidity).

---

**Cingulate Cortex — Anterior (ACC)**
*Location:* BA 24 and 32, medial frontal surface wrapping over the genu of the corpus callosum.
Monitors **response conflict** (detects when competing options are active), signals **errors**, and processes the **affective dimension of pain** (how much pain is suffered, distinct from where it is located). A bridge between cognitive and emotional systems and a key DMN node.

---

**Cingulate Cortex — Posterior (PCC)**
*Location:* BA 23 and 31, medial parietal surface.
A central hub of the **default mode network (DMN)** — active during self-referential thought, autobiographical memory retrieval, and mind-wandering. More active at rest than during externally directed tasks. PCC and medial PFC are among the earliest sites of amyloid accumulation in Alzheimer's disease, and failure to properly deactivate the PCC during external tasks is an early sign of AD.

---

**Fornix**
The principal white-matter **output tract of the hippocampus** — arcs beneath the corpus callosum from the hippocampal subiculum to the mammillary bodies (and anteriorly to the septal nuclei and lateral hypothalamus). An essential Papez circuit connector.

*Clinical damage:* Fornix transection (colloid cyst, surgical injury, deep tumors) → dense anterograde amnesia.

---

**Mammillary Bodies**
Two small paired nuclei on the ventral hypothalamic surface. Relay hippocampal output (arriving via the fornix) to the anterior thalamus via the **mammillothalamic tract**, linking the hippocampal formation to the thalamocortical limb of the Papez circuit. Despite their small size, they are indispensable nodes in the memory circuit.

*Clinical damage:* Bilateral damage (thiamine deficiency) → **Korsakoff syndrome** — dense anterograde amnesia, retrograde amnesia with temporal gradient, and confabulation.

---

**Nucleus Accumbens**
*Location:* Ventral striatum, at the junction of the caudate and putamen.
The central node of the brain's **reward circuit** — receives dopaminergic input from the **ventral tegmental area (VTA)** via the **mesolimbic pathway** and integrates motivation signals from the amygdala, hippocampus, and PFC. Divided into a **shell** (connected with amygdala and hypothalamus — mediates primary reward and aversion) and a **core** (connected with dorsal striatum and motor systems — mediates learned instrumental behaviors).

*Clinical relevance:* Addictive drugs produce supraphysiological dopamine release here, hijacking the reward circuit. Chronic activation leads to D2 receptor downregulation → anhedonia (reduced pleasure from natural rewards). The nucleus accumbens is an emerging DBS target for treatment-refractory depression and OCD.

---

## 8. The Brainstem

**Midbrain (Mesencephalon)**
*Location:* Most rostral brainstem region, between the diencephalon and pons.
Contains: oculomotor (CN III) and trochlear (CN IV) nuclei; **substantia nigra**; **red nucleus** (rubrospinal tract origin, motor coordination); **superior colliculi** (visual orienting reflexes, gaze); **inferior colliculi** (obligatory auditory relay → MGN); **periaqueductal gray (PAG)** (pain modulation, defensive behavior); and the **ventral tegmental area (VTA)** (source of mesolimbic dopamine to nucleus accumbens and mesocortical dopamine to PFC).

*Clinical damage syndromes:*
- **Weber syndrome** (ventral midbrain): ipsilateral CN III palsy + contralateral hemiparesis (cerebral peduncle).
- **Benedikt syndrome** (tegmental midbrain): ipsilateral CN III palsy + contralateral tremor/ataxia (red nucleus).

---

**Pons**
*Location:* Middle brainstem, between midbrain and medulla.
Contains: abducens (CN VI), facial (CN VII), vestibulocochlear (CN VIII), and trigeminal (CN V) nuclei; **middle cerebellar peduncles** (corticopontine input to cerebellum); pneumotaxic and apneustic respiratory centers; **paramedian pontine reticular formation (PPRF)** (horizontal gaze center); and REM-generating nuclei (subcoeruleus — drives the skeletal muscle atonia of REM sleep).

*Clinical damage:*
- **Locked-in syndrome** (bilateral ventral pons): bilateral corticospinal and corticobulbar tract destruction → complete paralysis except for vertical gaze/blinking; consciousness fully preserved (ARAS spared).
- **Central pontine myelinolysis**: rapid correction of chronic hyponatremia → osmotic pontine myelin destruction → dysphagia, dysarthria, quadriparesis.
- **Internuclear ophthalmoplegia (INO)**: MLF damage → failure of ipsilateral eye adduction on horizontal gaze, contralateral abducting nystagmus; convergence preserved.

---

**Medulla Oblongata**
*Location:* Most caudal brainstem, continuous with the spinal cord at the foramen magnum.
Contains: hypoglossal (CN XII), accessory (CN XI), vagal (CN X), and glossopharyngeal (CN IX) nuclei; **cardiovascular center** (vasomotor control); **respiratory rhythm generators** (pre-Bötzinger complex, dorsal/ventral respiratory groups); and the sites of the **pyramidal decussation** (85–90% of corticospinal fibers cross here) and **sensory decussation** (DCML internal arcuate fibers cross here).

*Clinical damage:*
- **Lateral medullary (Wallenberg) syndrome** (PICA occlusion): ipsilateral facial sensory loss (CN V nucleus) + ipsilateral Horner's (descending sympathetics) + ipsilateral limb ataxia (inferior cerebellar peduncle) + dysarthria/dysphagia (vagal nuclei) + vertigo/nystagmus (vestibular nuclei) + **contralateral** body pain/temperature loss (spinothalamic tract).
- **Medial medullary syndrome** (anterior spinal artery): contralateral hemiparesis (pyramid) + contralateral DCML loss + ipsilateral tongue weakness (CN XII).

---

**Reticular Formation**
A diffuse network of interconnected neurons running the full length of the brainstem core from medulla to midbrain. Four critical roles:

1. **Arousal and consciousness** — the **ascending reticular activating system (ARAS)** projects to the intralaminar thalamic nuclei and directly to the cortex, sustaining wakefulness. Bilateral ARAS damage at any level causes coma.
2. **Monoaminergic modulation** — **locus coeruleus** (norepinephrine; arousal, attention, stress); **raphe nuclei** (serotonin; mood, appetite, sleep, pain); **VTA/SNc** (dopamine; reward, motivation, movement).
3. **Autonomic integration** — connects to hypothalamus and spinal autonomic preganglionic neurons.
4. **Motor modulation** — reticulospinal tracts regulate muscle tone, posture, and gait.

---

## 9. The Cerebellum

**Vestibulocerebellum (Flocculonodular Lobe)**
The oldest cerebellar division (archicerebellum). Connects with the vestibular nuclei. Controls **balance**, **posture**, and **eye movements** (vestibulo-ocular reflex).

*Clinical damage:* Truncal and gait ataxia, nystagmus. Patients cannot maintain balance even with eyes open. Characteristic of midline lesions in children (medulloblastoma) and alcoholic cerebellar degeneration (which preferentially destroys the anterior vermis, adjacent to the vestibulocerebellum).

---

**Spinocerebellum (Vermis and Paravermis)**
Receives proprioceptive and somatosensory input from the spinal cord (spinocerebellar tracts). Monitors and corrects ongoing movement in real time. The **vermis** regulates axial and proximal muscles (gait, posture); the **paravermis** regulates distal limb movement.

*Clinical damage:* Vermis lesions → gait ataxia ("drunken sailor" gait, wide-based, unable to tandem walk). Paravermal lesions → ipsilateral limb dysmetria (past-pointing) and intention tremor.

---

**Cerebrocerebellum (Lateral Hemispheres)**
The largest and most recently evolved division. Connects with the cerebral cortex via the pons (corticopontine input, middle cerebellar peduncle) and dentate nucleus-thalamus-motor cortex circuit (superior cerebellar peduncle output). Involved in **motor planning**, **timing**, **automation of complex movement**, and — increasingly recognized — cognition and language timing.

*Clinical damage:* Ipsilateral appendicular ataxia, dysmetria, intention tremor, dysdiadochokinesia (inability to perform rapid alternating movements), and scanning dysarthria. Also produces **cerebellar cognitive affective syndrome (Schmahmann's syndrome)** — executive dysfunction, linguistic difficulties, visuospatial impairment, and personality changes.

---

**Cerebellar Peduncles**
Three paired fiber bundles connecting the cerebellum to the brainstem:
- **Inferior cerebellar peduncle** — input from spinal cord (spinocerebellar tracts) and inferior olivary nucleus (climbing fibers → motor learning).
- **Middle cerebellar peduncle** — the largest; input from pontine nuclei (relaying cortical motor commands).
- **Superior cerebellar peduncle** — output from deep cerebellar nuclei (primarily dentate nucleus) crossing to the contralateral VL thalamus and red nucleus. This decussation, combined with the second crossing of the corticospinal tract at the pyramidal decussation, means cerebellar deficits are **ipsilateral** to the lesion.

---

**Why Cerebellar Damage Is Ipsilateral**
The cerebellar output crosses once (superior cerebellar peduncle decussation in the midbrain) to reach the contralateral motor cortex — which then crosses again at the pyramidal decussation. These two crossings cancel: right cerebellum → left thalamus/cortex → right spinal motor neurons → **right muscles**. A right cerebellar lesion produces right-sided ataxia.

---

## 10. White Matter Tracts

**Projection Fibers**
Connect the cortex with subcortical structures and the spinal cord. Run vertically through the brain.

Key examples:
- **Internal capsule** — compact V-shaped bundle; anterior limb carries frontopontine and anterior thalamic radiations; posterior limb carries the corticospinal and corticobulbar tracts and somatosensory thalamocortical radiations. A tiny lacunar infarct in the posterior limb → pure motor hemiparesis.
- **Corona radiata** — the fan-like spread of internal capsule fibers through the white matter to the cortex.
- **Cerebral peduncles** — the midbrain extension of the corticospinal/corticopontine tracts.

---

**Commissural Fibers**
Connect the two hemispheres horizontally.

- **Corpus callosum** — the largest white-matter structure in the brain; genu connects prefrontal areas, body connects motor/somatosensory areas, splenium connects occipital and parietal areas. Transection (surgical or Marchiafava-Bignami disease) → **interhemispheric disconnection syndrome** — left hand literally does not know what the right hand is doing; left hand apraxia; right visual field cannot name objects shown to the left visual field.
- **Anterior commissure** — connects anterior temporal lobes and olfactory structures.
- **Posterior commissure** — connects pretectal nuclei; mediates the consensual pupillary light reflex.

---

**Association Fibers**
Connect cortical regions within the same hemisphere.

- **Arcuate fasciculus / Superior longitudinal fasciculus (SLF)** — connects Broca's and Wernicke's areas; damage → **conduction aphasia** (fluent speech, intact comprehension, severely impaired repetition).
- **Uncinate fasciculus** — connects OFC with anterior temporal lobe; damaged in behavioral variant frontotemporal dementia.
- **Inferior longitudinal fasciculus (ILF)** — connects occipital and temporal lobes along the ventral visual stream.
- **Cingulum** — runs within the cingulate gyrus, connecting medial limbic structures front to back.

---

**Dedicated Limbic and Motor Tracts**

- **Fornix** — hippocampus → mammillary bodies (Papez circuit output).
- **Stria terminalis** — amygdala → hypothalamus and bed nucleus of the stria terminalis (BNST); mediates sustained anxiety signals.
- **Mammillothalamic tract** — mammillary bodies → anterior thalamus (Papez circuit relay).
- **Medial forebrain bundle** — connects hypothalamus with brainstem limbic and monoaminergic nuclei; carries reward-related dopamine fibers from VTA to nucleus accumbens.
- **Medial longitudinal fasciculus (MLF)** — connects abducens nucleus (CN VI, pons) with oculomotor nucleus (CN III, midbrain); coordinates horizontal conjugate gaze. Damage → internuclear ophthalmoplegia (INO).`;

  // ─────────────────────────────────────────────────────────────────
  // FLASHCARDS — 55 total
  // ─────────────────────────────────────────────────────────────────
  const flashcards = [
    // === FRONTAL LOBE ===
    { question: "What is the motor homunculus and where does it reside?", answer: "The motor homunculus is a distorted, contralateral body map on the primary motor cortex (M1, precentral gyrus, BA 4). The face and hand occupy disproportionately large territories (reflecting fine motor demands); the leg is represented on the medial surface. M1 contains Betz cells — the largest neurons in the CNS — whose axons form the corticospinal tract. Damage produces contralateral UMN weakness.", difficulty: "medium" },
    { question: "What distinguishes the premotor cortex from the supplementary motor area (SMA)?", answer: "Premotor cortex (lateral BA 6): programs movement sequences triggered by EXTERNAL cues (reaching for a visible object, responding to a signal). SMA (medial BA 6): generates SELF-INITIATED, internally programmed movements — sequences from memory, bimanual coordination. The SMA is active even during motor imagery. Damage to the SMA causes akinesia; bilateral SMA damage causes akinetic mutism.", difficulty: "medium" },
    { question: "What is akinetic mutism and what lesion produces it?", answer: "Akinetic mutism is a state of apparent wakefulness (eyes open, sleep-wake cycles preserved) with complete absence of spontaneous movement, speech, or behavioral initiative. The patient does not respond to questions or commands despite being neurologically 'awake.' It results from bilateral SMA damage (medial BA 6), large bifrontal lesions, or cingulate gyrus damage — all of which destroy the motivational drive to initiate action. Distinct from coma (which involves impaired arousal) and locked-in syndrome (which involves motor paralysis with preserved intention).", difficulty: "hard" },
    { question: "What is the clinical difference between dlPFC and OFC/vmPFC damage?", answer: "dlPFC (BA 9/46) damage: dysexecutive syndrome — impaired working memory, poor planning, perseveration, and difficulty shifting cognitive set. Intelligence is often measurably reduced and deficits are detectable on formal testing. OFC/vmPFC damage: pseudopsychopathic syndrome — intact intellectual performance on formal tests but dramatically impaired real-world decision-making, social disinhibition, poor impulse control, emotional lability, and disregard for consequences. This dissociation (normal IQ tests but ruinous real-world behavior) is the crux of the somatic marker hypothesis.", difficulty: "hard" },
    { question: "What is Broca's aphasia and where is the lesion?", answer: "Broca's (expressive/nonfluent) aphasia: effortful, halting, agrammatic speech with relatively intact auditory comprehension. Repetition is impaired. Lesion: left inferior frontal gyrus, BA 44 (pars opercularis) and BA 45 (pars triangularis). Often accompanied by right face and hand weakness because M1 is adjacent. The patient knows what they want to say but cannot produce it fluently — frustration is common and insight is preserved.", difficulty: "easy" },
    { question: "What causes ipsilateral gaze deviation after an acute frontal stroke, and why does gaze reverse in seizures?", answer: "Frontal Eye Fields (FEF, BA 8) generate voluntary saccades to the CONTRALATERAL visual field. In an acute frontal lesion, the damaged FEF cannot drive contralateral gaze, so the intact opposite FEF drives eyes TOWARD the lesion (ipsilateral deviation — toward the hemisphere with the lesion, away from the paresis). In a seizure, the irritating focus drives EXCESS activation of the FEF → eyes deviate AWAY from the seizure focus (contralateral). Remembering 'the stroke patient looks at their lesion, the seizing patient looks away from their focus' is the clinical shorthand.", difficulty: "medium" },
    // === PARIETAL LOBE ===
    { question: "What is Gerstmann's syndrome and what lesion produces it?", answer: "Gerstmann's syndrome is a tetrad produced by left angular gyrus (BA 39) damage: 1) Finger agnosia (cannot identify individual fingers), 2) Left-right disorientation, 3) Agraphia (impaired writing), 4) Acalculia (impaired arithmetic). It reflects disruption of body-schema and cross-modal integration at the left temporo-parietal junction. Larger lesions also produce alexia.", difficulty: "easy" },
    { question: "How does hemispatial neglect differ from hemianopia, and how is it diagnosed?", answer: "Hemianopia: visual field loss from damage to the optic pathway or V1 — a sensory deficit. The patient is often aware and compensates by moving eyes/head. Hemispatial neglect: attentional failure from right parietal/TPJ damage — the patient fails to attend to the left hemispace despite potentially intact primary vision. Key distinction: neglect patients extinguish the left stimulus when both sides are simultaneously presented (extinction), even if they detect a single left-sided stimulus. Bedside tests: line bisection (bisects far right of center), cancellation tasks (misses left-sided targets), clock drawing (draws only right half).", difficulty: "hard" },
    { question: "What is the role of the right parietal lobe in spatial attention?", answer: "The left parietal lobe directs attention only to the RIGHT hemispace. The right parietal lobe directs attention to BOTH hemispaces — making it the dominant hemisphere for spatial attention. This asymmetry explains why right parietal damage causes severe, persistent hemispatial neglect (left attention is lost with no compensation from the left hemisphere), while left parietal damage causes only mild, transient right-sided neglect (the intact right hemisphere covers both sides). The right temporoparietal junction (TPJ) is the critical node.", difficulty: "hard" },
    { question: "What is conduction aphasia and what structure is damaged?", answer: "Conduction aphasia: fluent speech, intact auditory comprehension, but severely impaired REPETITION — the ability to repeat heard words and phrases. Cause: damage to the arcuate fasciculus (superior longitudinal fasciculus) connecting Broca's area (left IFG) with Wernicke's area (left posterior STG). Because both areas are intact, fluency and comprehension are preserved; only the intrahemispheric connection is severed. Phonemic paraphasias (sound substitution errors) are also common in spontaneous speech.", difficulty: "medium" },
    // === TEMPORAL LOBE ===
    { question: "What is Wernicke's aphasia and where is the lesion?", answer: "Wernicke's (receptive/fluent) aphasia: fluent but semantically incoherent speech with phonemic paraphasias, neologisms, and 'word salad.' Auditory comprehension is severely impaired — patients cannot understand what is said to them. Repetition is impaired. No motor deficit (unlike Broca's). Lesion: left posterior superior temporal gyrus, BA 22. The patient is often unaware of their comprehension deficit (anosognosia), which can be mistaken for confusion or psychosis.", difficulty: "easy" },
    { question: "What is prosopagnosia and where is the lesion?", answer: "Prosopagnosia: inability to recognize individual faces — familiar people (family members, celebrities) cannot be identified by their face alone, though they can be identified by voice, gait, or other cues. The person is perceived as a face; recognition of the specific individual is lost. Lesion: right fusiform gyrus (BA 37) — the fusiform face area. Bilateral lesions produce more severe and permanent prosopagnosia. Associated with right occipito-temporal damage and can co-occur with topographical agnosia (inability to navigate familiar environments).", difficulty: "medium" },
    { question: "What structures form the medial temporal lobe (MTL) memory system?", answer: "The MTL memory system includes: 1) Hippocampus (CA1–CA4 + dentate gyrus) — encoding and initial consolidation of declarative memories. 2) Entorhinal cortex — the primary 'gateway' conveying cortical input to the hippocampus via the perforant path. 3) Perirhinal cortex — object recognition memory and familiarity judgments. 4) Parahippocampal cortex — spatial context and scene memory. 5) Amygdala — emotional memory and emotional modulation of hippocampal consolidation. All five structures work together; the hippocampus proper is most critical for episodic memory formation.", difficulty: "medium" },
    // === OCCIPITAL LOBE ===
    { question: "What is the retinotopic organization of V1 and what is macular sparing?", answer: "V1 (calcarine sulcus, BA 17) maps the visual field retinotopically: lower visual field → upper bank (cuneus); upper visual field → lower bank (lingual gyrus); macula (central vision) → most posterior pole, with disproportionately large representation. Macular sparing after posterior occipital lesions occurs because the macula has dual blood supply (posterior cerebral artery AND middle cerebral artery) — when one is occluded, the other maintains macular cortex. A patient with cortical blindness retains intact pupillary reflexes because the pupillary arc uses the superior colliculus and pretectum, bypassing V1.", difficulty: "medium" },
    { question: "What is akinetopsia and what area is damaged?", answer: "Akinetopsia: inability to perceive visual motion — the world appears as a series of frozen snapshots rather than continuous movement. Patients cannot track a moving car, judge when to cross a street, or follow a conversation if speakers gesticulate. Caused by bilateral damage to area V5/MT (middle temporal area) in the lateral occipito-temporal cortex. A rare but pure demonstration of the dorsal visual stream's motion-processing specialization.", difficulty: "hard" },
    // === DIENCEPHALON — THALAMUS ===
    { question: "What are the VPL and VPM nuclei and what do they relay?", answer: "VPL (ventral posterolateral): relays body somatosensation — fine touch/proprioception (medial lemniscus) and pain/temperature (spinothalamic tract) — to S1 postcentral gyrus. VPM (ventral posteromedial): relays face somatosensation (trigeminal system) and taste (NTS) — to the face area of S1 and the insula. Together they are the final thalamic relay for all somatic sensation. Damage to either produces contralateral hemisensory loss; VPL damage can evolve into Déjerine-Roussy thalamic pain syndrome.", difficulty: "medium" },
    { question: "What is Déjerine-Roussy syndrome?", answer: "Thalamic pain syndrome (Déjerine-Roussy): a chronic, severe, burning pain syndrome affecting the contralateral hemibody that develops weeks to months after a thalamic stroke involving the VPL/VPM. Initially the stroke causes hemisensory loss; as partial recovery occurs, abnormal nociceptive processing within the damaged thalamus generates intense spontaneous pain, allodynia (pain from light touch), and hyperalgesia. Often treatment-refractory. Illustrates that the thalamus actively modulates — not merely passively relays — sensory experience.", difficulty: "hard" },
    { question: "What is the thalamic reticular nucleus (TRN) and what does it do?", answer: "The TRN is a shell of GABAergic neurons enveloping the thalamus. Crucially, it does NOT project to the cortex — it projects inhibitory axons BACK onto thalamocortical relay neurons. It acts as a selective attention gate: during focused attention, TRN suppresses irrelevant thalamic relay channels while allowing task-relevant signals through to cortex. During NREM sleep, TRN generates rhythmic inhibition of relay neurons that produces sleep spindles (the oscillatory hallmark of stage 2 sleep). TRN dysfunction is proposed in ADHD (impaired filtering) and certain schizophrenia models (impaired sensory gating).", difficulty: "hard" },
    { question: "What is bilateral paramedian thalamic infarction and why is it devastating despite its small size?", answer: "Bilateral paramedian thalamic infarction results from occlusion of the artery of Percheron — a single unpaired artery (a normal variant) that supplies both paramedian thalami simultaneously. Despite causing tiny bilateral infarcts, it produces: profound disturbance of consciousness (often coma initially), severe anterograde amnesia (MD nucleus damage — disconnecting PFC from limbic memory circuit), vertical gaze palsy (intralaminar nuclei involvement), and behavioral change. The disproportionate clinical severity relative to lesion size illustrates how the thalamus is a compact relay hub where small damage disrupts enormous downstream systems.", difficulty: "hard" },
    // === DIENCEPHALON — HYPOTHALAMUS ===
    { question: "What is narcolepsy type 1 and what hypothalamic cells are lost?", answer: "Narcolepsy type 1 (narcolepsy with cataplexy): caused by destruction of orexin (hypocretin)-producing neurons in the lateral hypothalamic area — almost certainly by an autoimmune mechanism (strongly associated with HLA DQB1*06:02; often triggered by infection or vaccination). Orexin normally stabilizes the flip-flop switch between wake and sleep. Its loss causes: excessive daytime sleepiness, cataplexy (sudden bilateral muscle weakness/atonia triggered by strong emotion — the pathognomonic feature), sleep paralysis, and hypnagogic/hypnopompic hallucinations. CSF orexin-1 levels < 110 pg/mL are diagnostic.", difficulty: "hard" },
    { question: "What is central diabetes insipidus and what hypothalamic structures are involved?", answer: "Central diabetes insipidus (DI): deficient production or axonal transport of ADH (vasopressin) from the supraoptic and/or paraventricular nuclei of the hypothalamus to the posterior pituitary. Without ADH, the collecting duct cannot concentrate urine → massive polyuria (up to 15–20 L/day) of extremely dilute urine, compensatory polydipsia, and hypernatremic dehydration if fluid intake is inadequate. Causes: hypothalamic tumors (craniopharyngioma is the classic mass lesion), TBI, neurosurgery, infiltrative disease (sarcoid, Langerhans cell histiocytosis), autoimmune destruction. Treatment: desmopressin (synthetic ADH analog).", difficulty: "medium" },
    { question: "What is the role of the hypothalamic suprachiasmatic nucleus (SCN) in circadian biology?", answer: "The SCN is the master circadian pacemaker — a self-sustaining molecular clock based on a transcription-translation feedback loop (CLOCK/BMAL1 proteins drive expression of PER/CRY genes, whose protein products then inhibit their own transcription, cycling with a ~24-hour period). Light entrains the SCN via the retinohypothalamic tract (intrinsically photosensitive retinal ganglion cells → optic chiasm → SCN). The SCN then coordinates the timing of the entire body's physiology — sleep-wake timing, cortisol secretion, body temperature, immune function — via autonomic, neuroendocrine, and behavioral outputs. Light suppresses melatonin release from the downstream pineal gland.", difficulty: "hard" },
    { question: "What are the hypothalamic VMH and LHA nuclei and how do they interact?", answer: "VMH (ventromedial nucleus): the SATIETY center — signals food satisfaction and terminates eating. VMH destruction → hyperphagia, obesity, and increased adiposity (the 'hypothalamic obesity' model). LHA (lateral hypothalamic area): the HUNGER/feeding center — promotes food-seeking behavior and eating. LHA destruction → aphagia (refusal to eat), body weight loss, and wasting. Together they form a push-pull system governing energy intake. The LHA also contains orexin neurons (wakefulness/arousal) and melanin-concentrating hormone (MCH) neurons (promoting sleep and food intake).", difficulty: "medium" },
    { question: "What is Wernicke's encephalopathy and what structures are damaged?", answer: "Wernicke's encephalopathy: an acute neurological emergency caused by thiamine (vitamin B1) deficiency — most commonly from alcoholism, but also malnutrition, bariatric surgery, or prolonged IV nutrition without thiamine supplementation. Classic triad: confusion/encephalopathy, ophthalmoplegia (CN VI palsy most common — lateral gaze palsy/nystagmus), and ataxia. Pathology: symmetric hemorrhagic necrosis of the mammillary bodies, periventricular gray matter, and medial thalami. If untreated or incompletely treated → **Korsakoff syndrome**: dense anterograde amnesia + retrograde amnesia + confabulation (permanent). Treatment: IV thiamine BEFORE glucose administration.", difficulty: "medium" },
    // === EPITHALAMUS ===
    { question: "What is Parinaud's syndrome and what causes it?", answer: "Parinaud's (dorsal midbrain / pretectal) syndrome: 1) Impaired upward vertical gaze, 2) Convergence-retraction nystagmus (eyes converge and retract when upward gaze is attempted rather than moving upward), 3) Light-near dissociation (pupils fail to constrict to light but constrict normally to near accommodation). Cause: compression of the tectum (dorsal midbrain) — most commonly by a pineal region tumor (germinoma, pinealoma) or obstructive hydrocephalus from aqueductal compression. The pretectal nuclei (which mediate the light reflex) are destroyed; the near reflex arc (via visual cortex → EW nucleus, bypassing the pretectum) is spared.", difficulty: "medium" },
    { question: "What is the role of the lateral habenula in mood disorders?", answer: "The lateral habenula (LHb) receives input from reward-related areas (VTA, basal ganglia) and projects inhibitory signals (via the fasciculus retroflexus) to the raphe nuclei (serotonin) and VTA (dopamine). It fires in response to NEGATIVE outcomes and unfulfilled reward predictions — essentially a 'disappointment detector' that suppresses monoamine release when expectations are not met. In depression, the LHb is proposed to be hyperactive → excessively suppressing VTA and raphe → anhedonia and depressive hopelessness. Ketamine's rapid antidepressant effect partly involves suppressing pathological burst firing in the LHb. LHb DBS is under investigation for treatment-resistant depression.", difficulty: "hard" },
    // === BASAL GANGLIA ===
    { question: "Trace the direct basal ganglia pathway from cortex to movement facilitation.", answer: "Cortex (glutamate) → Striatum D1 MSNs (GABA inhibit) → GPi/SNr (now less active) → Thalamus (VA/VL) less inhibited (disinhibited) → Motor cortex more active → Movement facilitated. Dopamine from SNc excites D1 receptors on direct-pathway striatal neurons → AMPLIFIES the go signal. This is the basal ganglia's 'go' mechanism.", difficulty: "medium" },
    { question: "Trace the indirect basal ganglia pathway from cortex to movement suppression.", answer: "Cortex (glutamate) → Striatum D2 MSNs (GABA inhibit) → GPe (less active) → STN released from inhibition → STN (glutamate excites) → GPi/SNr more active → Thalamus (VA/VL) more strongly inhibited → Motor cortex less active → Movement suppressed. Dopamine from SNc inhibits D2 receptors on indirect-pathway neurons → REDUCES the stop signal. This is the basal ganglia's 'stop' mechanism.", difficulty: "medium" },
    { question: "How does Parkinson's disease alter the direct and indirect pathway balance?", answer: "Loss of dopaminergic SNc neurons removes dopamine from the striatum. D1-bearing direct pathway neurons lose excitatory dopamine → direct pathway UNDERACTIVE (less thalamic disinhibition → less motor cortex facilitation). D2-bearing indirect pathway neurons lose inhibitory dopamine → indirect pathway OVERACTIVE (more STN → GPi → thalamic inhibition → less motor cortex activation). Net result: GPi is excessively active → thalamus is chronically over-inhibited → motor cortex is underactivated → bradykinesia, akinesia, rigidity, and difficulty initiating movement.", difficulty: "hard" },
    { question: "What is hemiballismus and what subcortical structure is damaged?", answer: "Hemiballismus: violent, flinging, large-amplitude involuntary movements of the contralateral arm and leg, caused by a unilateral subthalamic nucleus (STN) lesion — typically a lacunar infarct. Without STN excitation, GPi becomes underactive → insufficient inhibition of the thalamus → thalamus disinhibited → motor cortex overactivated → explosive, uncontrolled contralateral limb movements. Usually resolves within weeks to months as compensatory circuit changes occur. The STN is the DBS target in Parkinson's disease (high-frequency stimulation disrupts pathological GPi overactivity).", difficulty: "medium" },
    { question: "What is the Huntington's disease mechanism and why does chorea precede rigidity?", answer: "Huntington's disease (HD): autosomal dominant expansion of CAG repeats in the huntingtin gene → mutant protein is selectively toxic to medium spiny neurons (MSNs) in the striatum. EARLY: D2-bearing indirect-pathway MSNs (more vulnerable to mHTT toxicity) die preferentially → indirect brake on movement is removed → GPi underactive → thalamus disinhibited → motor cortex overactivated → CHOREA (hyperkinesia). LATE: D1-bearing direct-pathway MSNs also die, GPe neurons degenerate, and global striatal loss → direct pathway also impaired → net GPi overactivity → thalamic over-inhibition → RIGIDITY and bradykinesia. The progression from chorea to rigidity reflects the sequential loss of indirect before direct pathway neurons.", difficulty: "hard" },
    { question: "What are the anatomical groupings within the basal ganglia?", answer: "Striatum: caudate + putamen (the main input nuclei). Lentiform (lenticular) nucleus: putamen + globus pallidus (anatomical, not functional grouping — lens-shaped). Corpus striatum: caudate + putamen + globus pallidus. Ventral striatum: nucleus accumbens + olfactory tubercle (limbic/reward circuits). The basal ganglia proper also include the substantia nigra (SNc — dopaminergic input; SNr — output) and subthalamic nucleus (indirect pathway excitatory driver). All are functionally interconnected through the direct and indirect pathways.", difficulty: "medium" },
    // === LIMBIC SYSTEM ===
    { question: "Describe the Papez circuit and what happens when any node is damaged.", answer: "Papez circuit: Hippocampus → Fornix → Mammillary bodies → Mammillothalamic tract → Anterior thalamic nucleus → Cingulate cortex → Parahippocampal gyrus → Entorhinal cortex → Hippocampus. Each node is critical: hippocampus damage (H.M.) → anterograde amnesia; fornix transection (colloid cyst) → anterograde amnesia; mammillary body damage (Korsakoff) → anterograde amnesia + confabulation; anterior thalamic damage (paramedian stroke) → thalamic amnesia. The circuit functions as an integrated memory loop — damage at any point disrupts new declarative memory formation.", difficulty: "hard" },
    { question: "What is the difference between left and right hippocampal function?", answer: "Left hippocampus: preferentially involved in VERBAL memory — encoding and retrieving words, stories, verbal facts, names, and language-based episodes. Left temporal lobectomy typically impairs verbal memory. Right hippocampus: preferentially involved in SPATIAL and NONVERBAL memory — encoding and retrieving places, routes, spatial layouts, faces, and non-verbal patterns. Right temporal lobectomy more commonly impairs visuospatial memory and navigation. This lateralization mirrors the broader language (left) vs. spatial (right) cortical asymmetry and is clinically relevant when assessing preoperative memory risk in epilepsy surgery.", difficulty: "medium" },
    { question: "What is Korsakoff syndrome and what are its defining neuropsychological features?", answer: "Korsakoff syndrome: a chronic amnesia caused by thiamine deficiency, typically after inadequate treatment of Wernicke's encephalopathy in alcoholism. Pathology: bilateral damage to mammillary bodies and dorsomedial thalamus. Features: 1) Dense ANTEROGRADE amnesia (cannot form new long-term declarative memories). 2) RETROGRADE amnesia with a temporal gradient (recent memories more impaired than remote). 3) CONFABULATION — spontaneous, unintentional fabrication of plausible-sounding memories to fill gaps (not deliberate lying). 4) Relatively preserved procedural memory and intelligence. The patient lives perpetually in the past, unaware of their amnesia.", difficulty: "medium" },
    { question: "What is Klüver-Bucy syndrome and what bilateral damage produces it?", answer: "Klüver-Bucy syndrome follows bilateral medial temporal lobe damage — amygdala and anterior temporal cortex. Features: visual agnosia (objects not recognized visually), hyperorality (compulsively examining objects with mouth), hypersexuality (inappropriate, indiscriminate sexual behavior), placidity (profound emotional blunting — loss of fear and aggression), and dietary changes (hyperphagia, altered food preferences). In humans it can follow bilateral temporal lobectomy, herpes simplex encephalitis (which has a predilection for the medial temporal lobes), severe TBI, or advanced temporal neurodegeneration. The full syndrome is rare; partial forms are more common.", difficulty: "medium" },
    { question: "What is the dual-route model of amygdala threat processing?", answer: "LeDoux proposed two parallel routes by which sensory information reaches the amygdala: 1) Fast 'low road' (thalamus → amygdala directly): ~12 ms — rapid, coarse, imprecise — conveys a rough threat signal before full perceptual analysis. Allows immediate autonomic fear responses (heart rate increase, freezing) before the stimulus is fully identified. 2) Slow 'high road' (thalamus → sensory cortex → amygdala): ~40–50 ms — detailed, accurate — provides full perceptual evaluation of whether the threat is real. The low road explains why conditioned fear responses can occur to degraded or masked stimuli, and why startle and fear can precede conscious awareness of a threat.", difficulty: "hard" },
    { question: "What is the nucleus accumbens and how does addiction involve it?", answer: "The nucleus accumbens (ventral striatum) is the central reward node — receives dopamine from the VTA (mesolimbic pathway) and integrates motivation signals from the amygdala, hippocampus, and PFC. In addiction: all addictive drugs converge on the accumbens by producing supraphysiological dopamine release or blocking its reuptake → intense pleasure and reinforcement. With repeated exposure: 1) D2 receptors downregulate → anhedonia (reduced pleasure from natural rewards). 2) Glutamatergic inputs from PFC/amygdala sensitize → drug cues drive intense craving. 3) Incentive salience ('wanting') dissociates from 'liking'. 4) PFC inhibitory control over accumbens weakens → compulsive drug-seeking.", difficulty: "hard" },
    { question: "What is adult hippocampal neurogenesis and what regulates it?", answer: "New neurons (granule cells) are continuously generated in the subgranular zone of the hippocampal dentate gyrus throughout life — one of only two adult neurogenic niches in the brain (the other is the olfactory bulb's subventricular zone). Proposed function: pattern separation — distinguishing highly similar experiences as distinct memories. Positive regulators (promote neurogenesis): aerobic exercise (the most consistent evidence in both animals and humans), environmental enrichment, social interaction, antidepressants (SSRIs/SNRIs), and learning itself. Negative regulators (suppress neurogenesis): chronic stress, elevated glucocorticoids (cortisol), aging, chronic alcohol, sleep deprivation, and radiation therapy.", difficulty: "medium" },
    // === BRAINSTEM ===
    { question: "What is Wallenberg (lateral medullary) syndrome — structure by structure?", answer: "Caused by PICA (posterior inferior cerebellar artery) occlusion. Damaged structures and deficits: 1) Trigeminal nucleus → ipsilateral facial pain/temperature loss. 2) Descending sympathetic fibers → ipsilateral Horner's syndrome (ptosis, miosis, anhidrosis). 3) Inferior cerebellar peduncle → ipsilateral limb and gait ataxia. 4) Vagal nuclei (NA/DMNX) → dysarthria, dysphagia, hoarseness. 5) Vestibular nuclei → vertigo, nausea, nystagmus. 6) Spinothalamic tract → contralateral body pain and temperature loss (already crossed). The classic CROSSED sensory pattern (ipsilateral face, contralateral body) is pathognomonic for a lateral brainstem location.", difficulty: "hard" },
    { question: "What is locked-in syndrome, what causes it, and how does it differ from coma and vegetative state?", answer: "Locked-in syndrome: bilateral ventral pontine destruction (corticospinal and corticobulbar tracts + motor cranial nerve nuclei) from basilar artery thrombosis, pontine hemorrhage, or CPM. The patient is FULLY CONSCIOUS (ARAS and cortex intact) but completely paralyzed — cannot move, speak, or breathe voluntarily. Preserved: vertical gaze and blinking (dorsal midbrain/CN III intact). Coma: impaired arousal — ARAS damaged, patient cannot be awakened. Vegetative state: arousal intact (sleep-wake cycles) but no awareness — cortex functionally disconnected from the ARAS. The critical distinction: locked-in patients have full cognitive awareness and can communicate through eye movements if identified.", difficulty: "hard" },
    { question: "What is internuclear ophthalmoplegia (INO) and what structure is damaged?", answer: "INO: damage to the medial longitudinal fasciculus (MLF) — the white matter tract connecting the CN VI nucleus (abducens, pons) with the contralateral CN III nucleus (oculomotor, midbrain). On horizontal gaze toward the SIDE OF THE LESION, the ipsilateral eye fails to adduct (it stays at midline or adducts incompletely) while the contralateral eye abducts with nystagmus. Convergence, which uses a different pathway, is preserved — this is the clinical confirmation that the adduction deficit is nuclear/fascicular (MLF) rather than a CN III lesion. In young people, INO is most commonly caused by MS; in the elderly, by brainstem stroke.", difficulty: "medium" },
    { question: "What is the role of the locus coeruleus (LC) and what happens when it is activated?", answer: "The locus coeruleus (LC) is a compact nucleus in the dorsal pons and is the brain's principal source of NOREPINEPHRINE (NE), with projections to virtually the entire CNS — cortex, thalamus, hippocampus, cerebellum, and spinal cord. LC activation: increases arousal and alertness, narrows attentional focus (signal-to-noise ratio), enhances working memory, facilitates fight-or-flight sympathetic responses, and promotes memory consolidation for emotionally salient events (via amygdalo-hippocampal interactions). In PTSD, chronic LC hyperactivity from stress exposure maintains a state of hyperarousal, hypervigilance, and exaggerated startle. LC neurons are among those lost in Alzheimer's disease (contributing to attentional and arousal deficits).", difficulty: "hard" },
    { question: "What are the key contents of the midbrain and what named syndromes result from midbrain damage?", answer: "Midbrain contents: CN III (oculomotor), CN IV (trochlear), substantia nigra (pars compacta: dopaminergic; pars reticulata: GABAergic output), red nucleus (rubrospinal tract), superior/inferior colliculi (visual/auditory reflexes), PAG (pain modulation), VTA (mesolimbic/mesocortical dopamine), and the cerebral peduncles (corticospinal/corticopontine tracts). Syndromes: Weber syndrome (ventral midbrain infarct): ipsilateral CN III palsy + contralateral hemiparesis (peduncle). Benedikt syndrome (tegmental): ipsilateral CN III palsy + contralateral tremor/ataxia (red nucleus). Parinaud's syndrome (dorsal midbrain compression): impaired upward gaze, convergence-retraction nystagmus, light-near dissociation.", difficulty: "hard" },
    // === CEREBELLUM ===
    { question: "What are the three cerebellar functional divisions, their connections, and damage patterns?", answer: "1) Vestibulocerebellum (flocculonodular lobe / archicerebellum): connects with vestibular nuclei → balance, posture, VOR. Damage: truncal/gait ataxia, nystagmus, cannot stand with eyes closed. 2) Spinocerebellum (vermis + paravermis / paleocerebellum): receives spinocerebellar proprioceptive input → corrects ongoing movement. Vermis damage: gait ataxia; paravermal damage: ipsilateral limb dysmetria and intention tremor. 3) Cerebrocerebellum (lateral hemispheres / neocerebellum): connects with cortex via pons and dentate-thalamo-cortical circuit → motor planning, timing, automation, cognition. Damage: ipsilateral appendicular ataxia, dysmetria, intention tremor, dysdiadochokinesia, Schmahmann's syndrome.", difficulty: "hard" },
    { question: "Why are cerebellar lesion deficits ipsilateral rather than contralateral?", answer: "Two crossings cancel each other out. 1st crossing: cerebellar output from the dentate nucleus exits via the superior cerebellar peduncle and decussates in the midbrain (reaching the CONTRALATERAL VL thalamus and red nucleus). 2nd crossing: the corticospinal tract (which carries the final motor command influenced by cerebellar thalamo-cortical input) crosses AGAIN at the pyramidal decussation in the medulla. Net result: Right cerebellum → Left VL thalamus → Left motor cortex → Right spinal motor neurons → Right muscles. A right cerebellar lesion causes right-sided ataxia.", difficulty: "hard" },
    { question: "What is Schmahmann's syndrome (cerebellar cognitive affective syndrome)?", answer: "Cerebellar cognitive affective syndrome (CCAS, Schmahmann 1998): cognitive and behavioral deficits from posterior cerebellar damage — especially posterior vermis and right lateral hemisphere. Features: 1) Executive dysfunction (impaired planning, working memory, set-shifting). 2) Linguistic difficulties (dysprosodia, word-finding difficulty, impaired syntax with complex sentences). 3) Visuospatial deficits. 4) Affective and behavioral changes (emotional blunting, impulsivity, disinhibition resembling frontal syndrome). Mechanism: the cerebellum modulates frontal, parietal, and temporal cortex function through dentato-thalamo-cortical projections — damage disrupts these cognitive feedback loops. CCAS is now recognized as a genuine cerebellar contribution to higher cognition.", difficulty: "hard" },
    { question: "What is the role of climbing fibers in cerebellar motor learning?", answer: "Climbing fibers originate from the inferior olivary nucleus (medulla) and synapse powerfully on Purkinje cells. They carry MOTOR ERROR SIGNALS — firing when a movement is executed incorrectly. When a climbing fiber fires coincident with parallel fiber (mossy fiber relay) activation of the same Purkinje cell, this induces LONG-TERM DEPRESSION (LTD) at the parallel fiber-Purkinje cell synapse. LTD reduces Purkinje cell output → reduced inhibition of the deep cerebellar nuclei (dentate) → more cerebellar output → movement correction. Over repeated trials, LTD builds a stored motor program that progressively corrects the error. This is the cellular basis of cerebellar motor learning.", difficulty: "hard" },
    // === WHITE MATTER ===
    { question: "What is a pure motor hemiparesis and what does it localize to?", answer: "Pure motor hemiparesis: complete contralateral face, arm, and leg weakness with NO sensory deficit, NO visual field cut, and NO cortical dysfunction (no aphasia, neglect, etc.). This pattern indicates a small lesion in the POSTERIOR LIMB OF THE INTERNAL CAPSULE — where all corticospinal and corticobulbar fibers are packed tightly, such that a small lacunar infarct disrupts all motor fibers while leaving adjacent somatosensory thalamocortical fibers (in a slightly different position) intact. Other pure motor stroke locations: basis pontis and corona radiata. The 'purity' of the deficit is the localizing feature.", difficulty: "medium" },
    { question: "What is the corpus callosum and what deficits result from its transection?", answer: "The corpus callosum is the largest white-matter structure in the brain — approximately 200 million fibers connecting homotopic cortical areas of the two hemispheres. Regions: genu (connects prefrontal), body (connects motor/somatosensory), splenium (connects occipital/parietal). Transection deficits: 1) Left hand apraxia (right motor cortex cannot access left motor cortex's language-driven commands). 2) Left hand alien hand syndrome. 3) Right visual field cannot name objects seen only in the left visual field (visual-verbal disconnection). 4) Double hemianopia (split visual field test: each hemisphere sees only its visual half and cannot share). Caused surgically (callosotomy) or by Marchiafava-Bignami disease (alcoholic corpus callosum demyelination).", difficulty: "hard" },
    { question: "What is the internal capsule and what are the clinical implications of a lesion in its posterior limb?", answer: "The internal capsule is a compact, V-shaped white-matter structure through which all cortical projection fibers pass between the cortex and subcortical/spinal targets. It lies between the thalamus medially and the lentiform nucleus laterally. Anterior limb: fronto-pontine and anterior thalamic radiations. Genu: corticobulbar fibers (to cranial nerve motor nuclei). Posterior limb: CORTICOSPINAL TRACT (voluntary limb movement) and somatosensory thalamocortical radiations. A lacunar infarct in the posterior limb damages the densely packed corticospinal tract → contralateral pure motor hemiparesis affecting face, arm, and leg. Because sensory fibers travel in a slightly separate fascicle, sensation may be partially preserved.", difficulty: "medium" },
    { question: "What are the three categories of white matter fibers and key examples of each?", answer: "1) PROJECTION fibers (cortex ↔ subcortical/spinal): Internal capsule, corona radiata, cerebral peduncles — carry all motor output and sensory input between cortex and brainstem/spinal cord. 2) COMMISSURAL fibers (hemisphere ↔ hemisphere): Corpus callosum (main interhemispheric connector), anterior commissure (anterior temporal/olfactory), posterior commissure (pretectal — pupillary reflex). 3) ASSOCIATION fibers (within hemisphere): Arcuate fasciculus/SLF (Broca's ↔ Wernicke's — language); uncinate fasciculus (OFC ↔ anterior temporal); inferior longitudinal fasciculus (occipital ↔ temporal — ventral visual stream); cingulum (limbic structures front-to-back).", difficulty: "medium" },
    { question: "What is the medial longitudinal fasciculus (MLF) and what syndrome results from its damage?", answer: "The MLF is a white-matter tract running the length of the brainstem, connecting the abducens nucleus (CN VI, pons) with the contralateral oculomotor nucleus (CN III, midbrain). It coordinates horizontal conjugate gaze: when the right abducens fires to move the right eye out, the MLF simultaneously signals the left CN III to move the left eye in — producing conjugate rightward gaze. Damage (MS, brainstem stroke): INTERNUCLEAR OPHTHALMOPLEGIA (INO) — on horizontal gaze toward the lesion side, the ipsilateral eye fails to adduct (stays at midline) while the contralateral eye abducts with nystagmus. Convergence is preserved (uses a separate pathway). Bilateral INO is virtually pathognomonic of MS.", difficulty: "medium" },
    // === CROSS-CUTTING / CLINICAL ===
    { question: "What is the default mode network (DMN) and which structures form its core nodes?", answer: "The default mode network (DMN) is a set of regions more active during REST and self-referential cognition than during externally directed tasks. It is the brain's 'idling' network — active during mind-wandering, daydreaming, autobiographical memory retrieval, social cognition (mentalizing), and imagining the future. Core nodes: medial PFC (mPFC) — self-referential processing; posterior cingulate cortex (PCC) / precuneus — self-relevant retrieval and integration; angular gyrus — cross-modal integration and semantic memory; hippocampus — autobiographical and episodic memory; lateral temporal cortex. DMN deactivation during external tasks is impaired in early Alzheimer's disease. DMN hyperconnectivity is linked to rumination in depression.", difficulty: "medium" },
    { question: "What are the major monoaminergic systems of the brainstem reticular formation?", answer: "1) NOREPINEPHRINE — Locus coeruleus (dorsal pons) → widespread projections (cortex, thalamus, hippocampus, spinal cord). Function: arousal, focused attention, stress responses, fight-or-flight. 2) SEROTONIN — Raphe nuclei (midline brainstem, medulla to midbrain) → widespread projections. Function: mood, appetite, sleep regulation, pain modulation. Target of SSRIs/SNRIs. 3) DOPAMINE — Substantia nigra pars compacta (SNc) → striatum (nigrostriatal — motor control). Ventral tegmental area (VTA) → nucleus accumbens (mesolimbic — reward/motivation) and PFC (mesocortical — executive function). 4) HISTAMINE — Tuberomammillary nucleus (TMN) of the posterior hypothalamus → widespread projections. Function: wakefulness. Blocked by first-generation antihistamines → sedation.", difficulty: "hard" },
    { question: "What are the key differences between UMN and LMN lesion signs?", answer: "UMN lesions (damage above the anterior horn — motor cortex, corticospinal tract, corticobulbar tract): spasticity (increased tone — clasp-knife), hyperreflexia, clonus, Babinski sign (extensor plantar response), and minimal early atrophy. The release of descending inhibitory control allows primitive reflexes to emerge. LMN lesions (damage at or below the anterior horn — anterior horn cells, ventral roots, peripheral nerve): flaccidity (absent tone), areflexia, fasciculations (spontaneous motor unit firing from denervated instability), and rapid muscle atrophy (denervation atrophy). The key clinical rule: tone and reflexes UP with UMN, DOWN with LMN.", difficulty: "easy" },
    { question: "What are the ascending reticular activating system (ARAS) and its clinical significance?", answer: "The ARAS is the collection of reticular formation projections from the brainstem (primarily from the rostral pons and midbrain) to the intralaminar thalamic nuclei and directly to the cortex, sustaining arousal and wakefulness. Neurotransmitters: norepinephrine (LC), serotonin (raphe), acetylcholine (pedunculopontine and laterodorsal tegmental nuclei), histamine (TMN), and orexin (LHA) all converge on the thalamic and cortical targets of the ARAS. Clinical significance: BILATERAL ARAS damage at any level → coma. Small strategically placed brainstem lesions can abolish consciousness despite leaving the entire cortex intact. Conversely, large cortical lesions (even bilateral) do not cause coma if the ARAS is intact — the cortex can be severely damaged while arousal is preserved (vegetative state).", difficulty: "hard" },
  ];

  const inserted = await db.insert(flashcardsTable).values(flashcards.map(f => ({ ...f, topicId: TOPIC_ID }))).returning();
  console.log(`  ✓ ${inserted.length} flashcards`);

  // ─────────────────────────────────────────────────────────────────
  // QUIZ QUESTIONS — 10 regular + 8 exam-only
  // ─────────────────────────────────────────────────────────────────
  const questions = [
    // Regular
    { question: "A patient sustains a small lacunar infarct in the posterior limb of the internal capsule. What clinical syndrome is expected?", optionA: "Contralateral hemisensory loss with preserved motor function", optionB: "Contralateral pure motor hemiparesis (face, arm, and leg) with no sensory, visual, or cortical deficits", optionC: "Contralateral homonymous hemianopia with macular sparing", optionD: "Ipsilateral cerebellar ataxia with contralateral weakness", correctAnswer: "B", explanation: "The posterior limb of the internal capsule contains densely packed corticospinal and corticobulbar fibers. A small lacunar infarct here disrupts all motor fibers without involving adjacent somatosensory fibers, producing a textbook pure motor hemiparesis. The absence of sensory, visual, or cognitive deficits precisely localizes the lesion to the internal capsule (or basis pontis). This is one of the most reliably localizing syndromes in clinical neurology.", examOnly: false },
    { question: "What distinguishes hemispatial neglect from a homonymous hemianopia?", optionA: "Neglect is caused by damage to V1; hemianopia is caused by parietal damage", optionB: "Hemianopia is a primary sensory loss — the patient sees nothing in the affected field. Neglect is an attentional failure — the patient can potentially detect a single left-sided stimulus but fails to attend to left-sided stimuli when competing with right-sided ones, and is often unaware of the deficit", optionC: "Both produce identical deficits; the distinction is only apparent on neuroimaging", optionD: "Neglect affects the ipsilateral hemispace; hemianopia affects the contralateral hemifield", correctAnswer: "B", explanation: "Hemianopia is a primary visual field deficit from optic pathway or V1 damage — the patient typically knows they cannot see the affected field and compensates by moving their eyes. Hemispatial neglect from right parietal/TPJ damage is an attentional failure — the affected hemispace is not attended to or represented, even though primary vision may be intact. Key clinical distinction: the neglect patient extinguishes the left stimulus when both sides are simultaneously presented (extinction), even if they detect a single left-sided stimulus in isolation.", examOnly: false },
    { question: "A patient with a right superior temporal gyrus infarct presents with fluent but incoherent speech. Repetition and comprehension are severely impaired. No motor deficit is present. What is the diagnosis?", optionA: "Broca's aphasia from left inferior frontal gyrus damage", optionB: "Conduction aphasia from arcuate fasciculus damage", optionC: "Wernicke's aphasia from left posterior superior temporal gyrus damage", optionD: "Global aphasia from large left MCA territory infarction", correctAnswer: "C", explanation: "The clinical picture — fluent paraphasic speech, impaired comprehension, impaired repetition, no motor deficit — is Wernicke's aphasia. The lesion is the left posterior superior temporal gyrus (BA 22), Wernicke's area. Note that the question states 'right superior temporal' — this is a deliberate distractor; Wernicke's aphasia results from LEFT hemisphere damage. In a right-handed patient presenting with this aphasia, the lesion must be in the left (dominant) hemisphere regardless of which side the question initially suggests.", examOnly: false },
    { question: "Which basal ganglia pathway imbalance explains the bradykinesia of Parkinson's disease?", optionA: "Overactivity of the direct pathway causing excessive thalamic inhibition", optionB: "Loss of striatal dopamine tips the balance toward indirect pathway overactivity — GPi becomes excessively active, overtly inhibiting the VA/VL thalamus and thus suppressing motor cortex activation", optionC: "Direct loss of motor cortex neurons due to dopamine deficiency in the cortex", optionD: "Underactivity of the indirect pathway causing thalamic disinhibition and hyperkinesia", correctAnswer: "B", explanation: "Dopamine normally excites D1 (direct) and inhibits D2 (indirect) striatal neurons. Loss of dopamine in PD: direct pathway underactive (less thalamic disinhibition → less cortical facilitation) AND indirect pathway overactive (less D2 inhibition → more GPe inhibition → more STN excitation → more GPi output → more thalamic inhibition → less cortical activation). Both effects converge on GPi overactivity → chronic VA/VL thalamic suppression → bradykinesia, akinesia, and the characteristic difficulty initiating movement.", examOnly: false },
    { question: "Bilateral mammillary body damage from thiamine deficiency produces which specific amnesia pattern?", optionA: "Retrograde amnesia only — the patient cannot recall any past events but can form new memories", optionB: "Dense anterograde amnesia, retrograde amnesia with temporal gradient (recent > remote), and confabulation", optionC: "Procedural memory impairment with intact declarative memory", optionD: "Selective impairment of semantic memory with preserved episodic memory", correctAnswer: "B", explanation: "Korsakoff syndrome (chronic consequence of Wernicke's encephalopathy): bilateral mammillary body damage disrupts the Papez circuit (fornix → mammillary bodies → anterior thalamus → cingulate → hippocampus), blocking hippocampal output from reaching the thalamocortical consolidation system. Result: 1) Dense anterograde amnesia (cannot form new long-term declarative memories). 2) Retrograde amnesia with temporal gradient (recent memories, not yet consolidated to neocortex, are more vulnerable than remote memories). 3) Confabulation — unintentional fabrication of memories. Procedural memory is intact because it depends on striatum/cerebellum rather than the Papez circuit.", examOnly: false },
    { question: "A patient experiences violent, flinging movements of the left arm and leg following a right-sided lacunar stroke. Which structure is most likely affected?", optionA: "Right putamen", optionB: "Right subthalamic nucleus (STN)", optionC: "Left substantia nigra pars compacta", optionD: "Right caudate nucleus head", correctAnswer: "B", explanation: "Unilateral STN lesions cause hemiballismus — violent, large-amplitude, flinging movements of the contralateral limbs. The STN normally excites the GPi, which tonically inhibits the thalamus. Without STN excitation, GPi output drops → thalamus is disinhibited → motor cortex is overactivated → explosive contralateral movements. The right STN controls the left body (contralateral). Hemiballismus typically resolves within weeks to months as compensatory circuit changes occur.", examOnly: false },
    { question: "What is Parinaud's syndrome and what anatomical compression causes it?", optionA: "Ipsilateral facial droop, contralateral hemiparesis, and internuclear ophthalmoplegia from midbrain tegmental infarction", optionB: "Impaired upward vertical gaze, convergence-retraction nystagmus, and light-near dissociation of the pupils from dorsal midbrain (tectum) compression", optionC: "Bilateral horizontal gaze palsy and facial diplegia from pontine lesion", optionD: "Ipsilateral hypoglossal palsy, contralateral hemisensory loss, and Horner's from medullary infarction", correctAnswer: "B", explanation: "Parinaud's syndrome results from compression of the dorsal midbrain (tectum) — most commonly by a pineal region tumor or obstructive hydrocephalus. The pretectal nuclei that mediate the pupillary light reflex are destroyed → loss of light response. The near reflex pathway (visual cortex → Edinger-Westphal nucleus, bypassing the pretectum) is spared → pupils constrict to near but not to light (light-near dissociation). The superior colliculi control vertical gaze → impaired upward gaze. Convergence-retraction nystagmus occurs when patients attempt upward gaze.", examOnly: false },
    { question: "Why do cerebellar lesions produce ipsilateral rather than contralateral motor deficits?", optionA: "The cerebellum does not cross — it projects directly to ipsilateral motor cortex without decussation", optionB: "Two crossings cancel: cerebellar output decussates at the superior cerebellar peduncle to reach the contralateral thalamus/cortex, which then decussates again at the pyramidal decussation — net result is ipsilateral body control", optionC: "Cerebellar lesions always produce bilateral deficits; ipsilateral predominance is a clinical artifact", optionD: "The cerebellar cortex projects ipsilaterally to spinal cord via the rubrospinal tract without any decussation", correctAnswer: "B", explanation: "First crossing: dentate nucleus → superior cerebellar peduncle → decussates in the midbrain → reaches contralateral VL thalamus and red nucleus → contralateral motor cortex. Second crossing: corticospinal tract decussates at the pyramidal decussation in the medulla. Two crossings cancel: right cerebellum → left thalamus → left motor cortex → crosses → right spinal motor neurons → right body. A right cerebellar lesion therefore produces right-sided ataxia.", examOnly: false },
    { question: "What is the functional significance of the thalamic reticular nucleus (TRN)?", optionA: "The TRN is the main relay for pain signals from the spinal cord to the somatosensory cortex", optionB: "The TRN projects GABAergic inhibition onto thalamocortical relay neurons, gating the flow of sensory information to the cortex — amplifying task-relevant signals during attention and generating sleep spindles during NREM sleep", optionC: "The TRN generates the primary motor drive for voluntary movement via its direct projection to M1", optionD: "The TRN is responsible for generating the pupillary light reflex via its projection to the Edinger-Westphal nucleus", correctAnswer: "B", explanation: "The TRN is a shell of GABAergic neurons surrounding the thalamus that does not project to the cortex — uniquely, it only projects BACK onto relay neurons. It is ideally positioned as a selective attention gate: corticothalamic feedback adjusts TRN activity to suppress relay nuclei receiving irrelevant information while allowing relevant channels to pass. During NREM stage 2 sleep, rhythmic TRN inhibition of relay neurons generates sleep spindles. TRN dysfunction is proposed in ADHD and schizophrenia (impaired sensory gating).", examOnly: false },
    { question: "What clinical syndrome results from bilateral amygdala damage?", optionA: "Dense anterograde amnesia with intact emotional processing", optionB: "Impaired acquisition of conditioned fear responses, reduced recognition of fearful facial expressions, elimination of appropriate personal space maintenance, and the features of Klüver-Bucy syndrome", optionC: "Selective loss of semantic memory with intact episodic memory and emotion", optionD: "Bilateral amygdala damage is clinically silent because the hippocampus compensates for all amygdala functions", correctAnswer: "B", explanation: "Bilateral amygdala damage (e.g., Urbach-Wiethe disease, bilateral temporal lobectomy) impairs: 1) Fear conditioning (cannot learn CS-US pairings). 2) Recognition of fearful and angry facial expressions (amygdala is critical for reading emotional faces). 3) Appropriate maintenance of personal space (bilateral amygdala patients allow strangers to stand much closer than normal). 4) Features of Klüver-Bucy syndrome: hyperorality, hypersexuality, visual agnosia, and profound emotional placidity. Declarative memory may be relatively preserved (hippocampus intact), demonstrating the independence of the amygdalar and hippocampal memory systems.", examOnly: false },
    // Exam-only
    { question: "Why does loss of orexin (hypocretin) neurons specifically cause cataplexy?", optionA: "Orexin neurons directly inhibit muscle contraction; their loss allows tonic muscle activation to spread uncontrollably during wakefulness", optionB: "Orexin normally stabilizes the wake state by simultaneously exciting all major arousal systems — without it, strong emotion (which activates limbic circuits) can inappropriately trigger the REM-sleep atonia circuit (subcoeruleus → spinal inhibitory interneurons), producing sudden muscle weakness during wakefulness", optionC: "Loss of orexin causes permanent REM sleep by directly activating pontine REM generators 24 hours a day", optionD: "Cataplexy results from dopamine deficiency, not orexin loss — narcolepsy is primarily a dopaminergic disorder", correctAnswer: "B", explanation: "Orexin (hypocretin) neurons in the lateral hypothalamus send excitatory projections to all major arousal nuclei (LC, raphe, TMN, BF cholinergic), tonically maintaining wakefulness. In narcolepsy, orexin loss destabilizes the flip-flop switch between wake and REM sleep. Strong emotions (laughter, surprise, anger) activate limbic circuits that, in the absence of orexin stabilization, can inappropriately activate the pontine REM-atonia generator (subcoeruleus area) → glycinergic/GABAergic inhibition of spinal motor neurons → bilateral muscle atonia during full wakefulness. This is cataplexy: the patient is conscious but cannot move.", examOnly: true },
    { question: "What does the dual-route model of amygdala threat processing reveal about the relationship between conscious awareness and fear responses?", optionA: "Fear responses always follow conscious threat appraisal — the cortical route is essential for any fear to occur", optionB: "The low road (thalamus → amygdala) allows conditioned fear responses — including autonomic arousal, freezing, and behavioral avoidance — to be triggered before, and independent of, conscious threat appraisal via the cortex; this explains why fear conditioning can occur to degraded or masked stimuli that never achieve conscious awareness", optionC: "The two routes are redundant and both require conscious awareness for fear responses to occur", optionD: "The cortical route is faster because it uses myelinated white matter tracts; the subcortical route is slower because it passes through more synapses", correctAnswer: "B", explanation: "LeDoux's dual-route model: the 'low road' (sensory thalamus → lateral nucleus of amygdala, ~12 ms) provides a fast, crude threat signal that initiates autonomic and behavioral fear responses before the stimulus is fully processed. The 'high road' (sensory thalamus → sensory cortex → amygdala, ~40-50 ms) provides a slower but detailed and accurate evaluation. The low road operates BELOW the threshold of conscious awareness — fear responses (heart rate, freezing, galvanic skin response) can occur to stimuli that never reach conscious perception (e.g., masked fearful faces, subliminal threat cues). This has profound implications for understanding phobias, PTSD, and automatic emotional reactions.", examOnly: true },
    { question: "A patient with an acute left internal capsule lacune has right face, arm, and leg UMN weakness but also reports mild right-sided numbness. What does the sensory finding suggest about lesion location?", optionA: "The sensory finding is impossible with an internal capsule lesion and indicates a cortical rather than capsular location", optionB: "Somatosensory thalamocortical fibers travel in the posterior limb of the internal capsule, just posterior to the corticospinal tract — a slightly larger or more posteriorly placed lacune can involve both motor and sensory fibers, producing a sensorimotor stroke rather than a pure motor stroke", optionC: "The sensory finding indicates the lesion has extended to involve the thalamus itself", optionD: "Mild sensory findings always accompany internal capsule motor strokes because the two fiber systems are anatomically inseparable", correctAnswer: "B", explanation: "In the posterior limb of the internal capsule, the corticospinal tract occupies the anterior portion and the somatosensory thalamocortical radiations (from VPL/VPM thalamus to S1) travel slightly more posteriorly. A small, precisely placed lacunar infarct may affect only the corticospinal fibers → pure motor stroke. A slightly larger or more posteriorly placed lacune may additionally disrupt the somatosensory radiations → sensorimotor stroke. This lesion 'purity' spectrum allows precise intra-capsular localization: pure motor = anterior posterior limb; sensorimotor = more posterior posterior limb.", examOnly: true },
    { question: "How does Korsakoff syndrome confabulation differ from lying, and what does it reveal about the relationship between memory retrieval and self-monitoring?", optionA: "Korsakoff confabulation is deliberate fabrication that patients use to avoid embarrassment about their memory loss", optionB: "Korsakoff confabulation is spontaneous and unintentional — patients produce plausible but false memories without awareness that they are incorrect, revealing a dissociation between memory retrieval (impaired: generates false outputs) and metamemory / self-monitoring (also impaired: fails to detect the errors and suppress the response before it is expressed)", optionC: "Confabulation is caused by posterior parietal damage and represents an executive, not memory, failure", optionD: "Confabulations are always bizarre and impossible accounts, distinguishing them from real memories which are always plausible", correctAnswer: "B", explanation: "Confabulation in Korsakoff syndrome is not deliberate or conscious — patients are not lying. Rather, two systems fail simultaneously: 1) Memory retrieval produces false outputs — fragments of real memory, intrusions, and confabulated narratives fill the gaps from anterograde and retrograde amnesia. 2) Metamemory and self-monitoring fail — normally, the frontal-executive system evaluates retrieved memory for plausibility and temporal context before expressing it; in Korsakoff syndrome, damage to the dorsomedial thalamus and PFC connections disrupts this verification step. The false memory passes unchecked into expression. This distinguishes Korsakoff confabulation from the deliberate fabrication of a malingerer.", examOnly: true },
    { question: "What cellular mechanism underlies long-term potentiation (LTP) and how does the NMDA receptor function as a 'coincidence detector'?", optionA: "LTP depends on GABA receptor activation, which hyperpolarizes the postsynaptic membrane and allows permanent structural change", optionB: "The NMDA receptor requires simultaneous presynaptic glutamate release (binding to the receptor) AND sufficient postsynaptic depolarization (to displace the Mg²⁺ ion blocking the channel pore) before Ca²⁺ can flow through — making it a molecular AND gate that detects the co-occurrence of pre- and postsynaptic activity; Ca²⁺ influx then activates kinases that increase AMPA receptor number and conductance, strengthening the synapse", optionC: "LTP is caused by an increase in presynaptic neurotransmitter release probability — the postsynaptic side is passive in this process", optionD: "The NMDA receptor detects coincidence between dopamine and glutamate release, not between pre- and postsynaptic neural activity", correctAnswer: "B", explanation: "NMDA receptors require two simultaneous events to open: 1) Glutamate binding (presynaptic activity indicator). 2) Sufficient postsynaptic depolarization to eject the Mg²⁺ ion that normally blocks the channel at resting membrane potential (postsynaptic activity indicator). This AND gate property — firing only when both conditions are met together — makes it the molecular detector of Hebbian coincidence ('neurons that fire together'). When open, Ca²⁺ enters and activates CaMKII → AMPA receptor phosphorylation and trafficking to the membrane → more AMPA receptors → stronger response to the same presynaptic input. Late-phase LTP also involves new protein synthesis (CREB, BDNF) for long-term structural changes.", examOnly: true },
    { question: "What is the functional distinction between the nucleus accumbens shell and core, and why does it matter for understanding the progression of addiction?", optionA: "The shell responds to drug use; the core responds to withdrawal — their relative activity determines whether a person continues using", optionB: "The shell (connected with amygdala, hypothalamus, brainstem) mediates the primary hedonic impact and motivational salience of rewards — the initial pleasurable 'high.' The core (connected with dorsal striatum, PFC, motor systems) mediates learned instrumental behaviors and habit execution — the compulsive component. In addiction, use shifts from shell-mediated 'liking' to core-mediated compulsive habit, explaining why late-stage addicts often use without experiencing pleasure but cannot stop", optionC: "Shell and core are anatomically distinct but functionally identical — the distinction has no clinical relevance in addiction", optionD: "The core mediates the initial drug high; the shell mediates withdrawal and craving", correctAnswer: "B", explanation: "Addiction progression reflects a shift from ventral to dorsal striatal control (within the shell→core→dorsal striatum progression): Early addiction: nucleus accumbens shell mediates the primary reinforcing effects — the hedonic impact, the 'high,' the incentive salience. With repeated use: the core becomes increasingly involved as stimulus-response habits form. Late addiction: the dorsal striatum (caudate/putamen) dominates — behavior is habitual, automatic, and triggered by drug-associated cues regardless of desire or hedonic value. This shift from goal-directed (PFC/shell-dependent) to habit (dorsal striatum-dependent) behavior is why addicts describe 'using without wanting to, or even enjoying it' — the behavior has become a cue-triggered habit independent of pleasure.", examOnly: true },
    { question: "How does the glymphatic system function and why is it relevant to Alzheimer's disease risk?", optionA: "The glymphatic system is a lymphatic network that removes dead neurons from the brain parenchyma during waking hours", optionB: "During sleep, arterial pulsations drive CSF through perivascular spaces into the brain interstitium via astrocyte AQP4 water channels, flushing metabolic waste (including amyloid-beta and tau) into venous and lymphatic drainage — with flow dramatically higher during sleep than wakefulness; chronic sleep deprivation impairs this clearance, accelerating amyloid accumulation in the parenchyma", optionC: "The glymphatic system is active only during REM sleep and selectively clears neurotransmitters rather than protein aggregates", optionD: "Glymphatic clearance is dependent on microglial activity rather than astrocyte water channels, and is not affected by sleep patterns", correctAnswer: "B", explanation: "The glymphatic (glia + lymphatic) system, described by Iliff and Nedergaard, uses perivascular channels as CSF conduits: CSF enters perivascular spaces surrounding penetrating arteries and is driven through the brain interstitium by arterial pulsation, then exits via paravenous channels → cervical lymphatics. Astrocyte AQP4 channels at perivascular endfeet facilitate this convective exchange. During slow-wave (NREM) sleep, the interstitial space expands ~60%, dramatically increasing glymphatic flow. Amyloid-beta and tau — the proteins aggregating in Alzheimer's disease — are among the waste products cleared. Epidemiological and experimental evidence links chronic insufficient sleep to higher CSF amyloid-beta and accelerated AD biomarker accumulation, implicating glymphatic failure as a mechanism.", examOnly: true },
    { question: "What is the somatic marker hypothesis and how does OFC/vmPFC damage explain the pseudopsychopathic syndrome?", optionA: "The somatic marker hypothesis proposes that the OFC stores explicit lists of rules for socially appropriate behavior — damage removes these rules", optionB: "Somatic markers (Damasio) are interoceptive body-state signals — gut feelings, changes in heart rate, skin conductance — that tag decision options with their anticipated emotional outcome. The OFC/vmPFC integrates amygdala-generated somatic markers with deliberate reasoning to bias choices toward favorable outcomes. Damage removes this emotional heuristic, leaving the patient to rely only on slow, explicit deliberation — which fails in complex real-world decisions — producing impulsive, disadvantageous choices despite intact formal reasoning", optionC: "The hypothesis proposes that the vmPFC stores long-term memory for emotional events and damage produces retrograde amnesia for emotional experiences", optionD: "Somatic markers are generated purely by the hippocampus; OFC damage impairs their retrieval but not their generation", correctAnswer: "B", explanation: "The somatic marker hypothesis (Damasio, 1994) proposes that complex decisions are guided not by exhaustive explicit analysis alone but by implicit emotional 'marks' on each option — these are somatic states (autonomic changes, interoceptive feelings) generated by the amygdala and body in response to anticipated outcomes, relayed to the OFC/vmPFC via interoceptive pathways (insula, brainstem). Patients with OFC/vmPFC damage fail to generate these somatic markers when contemplating decisions (flat skin conductance responses to risky choices in the Iowa Gambling Task) — their rational reasoning (measured by IQ, formal tests) is intact, but they consistently choose disadvantageously. The theory explains why 'gut feeling' serves as an efficient heuristic and why its loss — despite preserved intellect — leads to real-world behavioral disasters.", examOnly: true },
  ];

  const insertedQs = await db.insert(quizQuestionsTable).values(questions.map(q => ({ ...q, topicId: TOPIC_ID }))).returning();
  console.log(`  ✓ ${insertedQs.length} quiz questions`);

  const [sg] = await db.insert(studyGuidesTable).values({
    topicId: TOPIC_ID,
    title: "Brain Structures — Cortical and Subcortical",
    content: sgContent,
  }).returning();
  console.log(`  ✓ Study guide id=${sg.id}`);

  const [exam] = await db.insert(practiceExamsTable).values({
    topicId: TOPIC_ID,
    title: "Brain Structures Practice Exam",
    timeLimit: 90,
    passingScore: 70,
  }).returning();

  const allQsDb = await db.select({ id: quizQuestionsTable.id }).from(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, TOPIC_ID));
  await db.insert(practiceExamQuestionsTable).values(allQsDb.map((q, i) => ({ examId: exam.id, questionId: q.id, questionOrder: i + 1 })));

  console.log(`\n✅ Brain Structures rework complete!`);
  console.log(`   Flashcards: ${inserted.length} | Questions: ${insertedQs.length} | Study guide: id=${sg.id}`);
}

rework().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
