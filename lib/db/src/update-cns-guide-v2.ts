import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

async function update() {
  console.log("Updating CNS study guide with improved formatting...");

  const content = `# Central Nervous System — Study Guide

---

## 1. Overview and Protection

The central nervous system — the **brain** and **spinal cord** — is the body's integration and command center: processing sensation, generating thought and emotion, forming and retrieving memories, and initiating motor responses. Because of its critical importance and extreme fragility, it is protected by overlapping systems working from the outside in.

### Meningeal Layers (Outer → Inner)

**Dura Mater** *(outermost)*
Tough, fibrous, double-layered in the cranium (periosteal + meningeal layers) — these split to form dural venous sinuses. In the spine it is a single layer, separated from vertebral bone by the **real epidural space** (fat + venous plexuses). Dural folds form the falx cerebri (separating hemispheres) and tentorium cerebelli (separating cerebrum from cerebellum).

**Arachnoid Mater** *(middle)*
Thin, avascular, connected to the pia below by delicate trabeculae — like a cobweb. Does not follow sulci or fissures; instead bridges over them, creating the subarachnoid space below.

**Pia Mater** *(innermost)*
Intimately adherent to every contour of the brain and spinal cord surface — follows all sulci and fissures. Highly vascularized. Contributes to the choroid plexus with ependymal cells.

### Clinical Spaces

| Space | Location | Contents | Clinical Significance |
|---|---|---|---|
| **Epidural** | Cranium: potential only; Spine: real space | Spine: fat, venous plexuses | Epidural hematoma (arterial — middle meningeal artery); epidural anesthesia/analgesia |
| **Subdural** | Between dura and arachnoid | Bridging veins traverse it | Bridging vein rupture → subdural hematoma (venous; often from trivial trauma in elderly) |
| **Subarachnoid** | Between arachnoid and pia | CSF + major cerebral arteries | Aneurysm rupture → subarachnoid hemorrhage; site of LP sampling |

---

## 2. Glial Cells of the CNS

The CNS contains two principal cell populations: neurons and **glia** (which outnumber neurons by approximately 10:1 and are essential for survival, not merely support).

**Astrocytes** — *the structural and metabolic backbone*
- Maintain the blood-brain barrier by ensheathing capillaries with astrocytic endfeet
- Regulate extracellular K⁺ (spatial buffering) and glutamate (reuptake via EAAT transporters)
- Provide metabolic support via the **astrocyte-neuron lactate shuttle**: astrocytes convert glucose → lactate → exported to neurons for oxidative phosphorylation
- Modulate synaptic transmission (tripartite synapse)
- Respond to injury with **reactive astrogliosis** — glial scar formation that limits spread of damage but may also inhibit axon regrowth

**Oligodendrocytes** — *the CNS myelin builders*
- Each oligodendrocyte myelinates up to **50 different axons** (contrast: Schwann cells myelinate one internode of one axon)
- Myelin is a lipid-rich insulating sheath that concentrates voltage-gated Na⁺ channels at **nodes of Ranvier**, enabling rapid saltatory conduction
- *Clinical correlation:* In multiple sclerosis, autoimmune attack on oligodendrocytes → demyelinating plaques → slowed/blocked conduction → relapsing-remitting neurological deficits

**Microglia** — *the CNS immune sentinels*
- Derived from yolk-sac macrophage precursors (not neural tube or neural crest) — unique embryological origin among CNS cells
- **Resting state:** Continuous parenchymal surveillance with highly motile processes
- **Activated state:** Phagocytize debris, release cytokines (IL-1β, TNF-α), participate in synaptic pruning during development
- *Clinical correlation:* Chronically activated (dysregulated) microglia drive neuroinflammation in Alzheimer's disease, ALS, and multiple sclerosis

**Ependymal Cells** — *lining and production*
- Single-cell layer lining all ventricles and the central canal of the spinal cord
- Modified ependymal cells in the **choroid plexus** (with pia vasculature) actively produce CSF

---

## 3. Cerebrospinal Fluid — Circulation

CSF is produced at approximately **500 mL/day**; only ~150 mL circulates at any moment. Turnover is ~3-4 times per day.

### The CSF Circuit
Choroid plexus (lateral ventricles) → **Foramina of Monro** → Third ventricle → **Aqueduct of Sylvius** (cerebral aqueduct) → Fourth ventricle → **Foramina of Luschka (×2)** and **Foramen of Magendie** → Subarachnoid space → **Arachnoid granulations** → Dural venous sinuses → Systemic venous circulation

> **Obstruction anywhere in this circuit produces hydrocephalus.** Obstruction at the aqueduct of Sylvius (the narrowest point) causes non-communicating hydrocephalus. Impaired reabsorption at the arachnoid granulations produces communicating hydrocephalus (including NPH).

### CSF Composition (Normal Values)
| Parameter | Normal Value | Clinical Change |
|---|---|---|
| Pressure | 60-200 mmH₂O (LP) | ↑ ICP; ↓ overdrainage |
| Protein | 15-45 mg/dL | ↑ in infection, GBS, tumor, MS |
| Glucose | 50-80 mg/dL (~2/3 serum) | ↓ in bacterial meningitis; normal in viral |
| WBC | <5/μL (lymphocytes) | ↑ in infection, inflammation |
| Color | Clear, colorless | Xanthochromic (yellow) = bilirubin from prior hemorrhage |

---

## 4. Blood-Brain Barrier

The BBB is formed by three interacting components:
1. **Cerebral capillary endothelial cells** — connected by exceptionally tight junctions (claudin-5, occludin) that block paracellular diffusion
2. **Astrocytic endfeet** — surround >99% of capillary surface, providing inductive signals that maintain tight junction formation
3. **Pericytes** — embedded in the capillary basement membrane; regulate BBB permeability and cerebral blood flow

**What crosses freely:** Small, lipid-soluble molecules (O₂, CO₂, ethanol, most CNS drugs); some gases
**Active transport needed:** Glucose (GLUT1), amino acids, ions
**Blocked:** Most proteins, large molecules, many drugs, bacteria, cells

*Regions without BBB:* The circumventricular organs — **area postrema** (chemoreceptor trigger zone for vomiting), **subfornical organ**, **OVLT**, **neurohypophysis**, and **pineal gland** — monitor blood composition directly.

---

## 5. Major Ascending Sensory Pathways

### Dorsal Column-Medial Lemniscal Pathway
*Modality: Fine touch, vibration, proprioception, two-point discrimination*

1st neuron: Peripheral receptor → dorsal root ganglion → enters spinal cord → ascends **ipsilaterally** in dorsal columns (gracilis: leg; cuneatus: arm)
↓ Crosses (decussates) in the **medulla** at nucleus gracilis/cuneatus
2nd neuron: Medial lemniscus → ascends to **VPL nucleus of thalamus**
↓
3rd neuron: VPL → primary somatosensory cortex (S1, postcentral gyrus)

*Lesion:* Ipsilateral loss of fine touch and proprioception below the lesion (e.g., dorsal column lesion in MS, B12 deficiency)

---

### Spinothalamic Tract
*Modality: Pain, temperature, crude touch*

1st neuron: Peripheral receptor → dorsal root ganglion → enters spinal cord → synapses in **dorsal horn** (Rexed laminae I and V)
↓ Crosses **immediately** (within 1-2 spinal levels) through the anterior white commissure
2nd neuron: Ascends **contralaterally** in the anterolateral column → **VPL nucleus of thalamus**
↓
3rd neuron: VPL → S1

*Lesion:* Contralateral loss of pain and temperature starting 1-2 levels below the lesion (e.g., hemisection of spinal cord = Brown-Séquard syndrome)

---

### Brown-Séquard Syndrome (Spinal Cord Hemisection)
A lesion of one half of the spinal cord produces a distinctive split pattern:
- **Ipsilateral:** UMN weakness (corticospinal) + loss of fine touch/proprioception (dorsal column) — both ipsilateral because they haven't crossed yet
- **Contralateral:** Loss of pain and temperature (spinothalamic) — crossed 1-2 levels below entry

---

## 6. Corticospinal Tract (Motor)

### Pathway
Upper motor neuron: Primary motor cortex (precentral gyrus, BA 4) → descends through **internal capsule (posterior limb)** → cerebral peduncles → basis pontis → **pyramidal decussation at cervicomedullary junction** → descends **contralaterally** in the lateral corticospinal tract
↓
Lower motor neuron: Synapse in the anterior horn → peripheral nerve → neuromuscular junction → skeletal muscle

### UMN vs LMN Signs

| Feature | UMN Lesion | LMN Lesion |
|---|---|---|
| **Location** | Above anterior horn (brain/cord) | Anterior horn, root, peripheral nerve |
| **Muscle tone** | Spastic (↑) | Flaccid (↓) |
| **Reflexes** | Hyperreflexia | Hyporeflexia/areflexia |
| **Babinski sign** | Present (upgoing toe) | Absent |
| **Atrophy** | Disuse atrophy (mild, late) | Rapid, severe atrophy |
| **Fasciculations** | Absent | Present (denervation) |

---

## 7. The Thalamus — Relay and Integration

The thalamus is not a passive relay — it actively filters, amplifies, and gates information traveling to and from the cortex. Almost all information reaching the cortex passes through it.

**Sensory relay nuclei:**

*VPL (Ventral Posterolateral)* — Receives dorsal columns and spinothalamic input; projects to S1. Body sensation relay (trunk, limbs).

*VPM (Ventral Posteromedial)* — Receives trigeminal sensory input and taste (via solitary nucleus); projects to S1. Face sensation relay.

*LGN (Lateral Geniculate Nucleus)* — Optic tract input; projects to V1. The six-layered visual relay (layers 1-2 magnocellular = motion/contrast; layers 3-6 parvocellular = color/fine detail).

*MGN (Medial Geniculate Nucleus)* — Inferior colliculus input; projects to primary auditory cortex (Heschl's gyri). Tonotopically organized.

**Motor relay nuclei:**

*VA/VL (Ventral Anterior/Ventral Lateral)* — VA receives basal ganglia output (GPi/SNr); VL receives cerebellar output (dentate nucleus via superior cerebellar peduncle). Both project to motor/premotor cortex. These are the final subcortical relays through which the basal ganglia and cerebellum influence voluntary movement. Targets for deep brain stimulation in tremor.

**Associative and limbic nuclei:**

*Mediodorsal (MD)* — Bidirectional connections with prefrontal cortex, amygdala, and limbic system. Involved in executive function, decision-making, and emotional regulation. Bilateral MD damage → thalamic amnesia and affective blunting.

*Anterior Nuclear Group* — Node in the **Papez memory circuit**: receives mammillary body input (via mammillothalamic tract) → projects to cingulate cortex. Damage disrupts memory consolidation.

*Pulvinar* — Largest thalamic nucleus (posterior pole). Receives visual cortex, parietal association cortex, and superior colliculus input. Projects to parieto-occipital and temporal areas. Directs **visual attention** toward salient stimuli. Right pulvinar lesions → contralateral neglect.

*Thalamic Reticular Nucleus (TRN)* — Shell of GABAergic neurons encasing the thalamus. Does NOT project to cortex — projects inhibitory axons back onto thalamocortical relay neurons. Acts as a **selective attention gate**: amplifies task-relevant signals, suppresses others. Generates **sleep spindles** (NREM stage 2 oscillatory signature).

---

## 8. Hypothalamus — Nuclei and Functions

The hypothalamus is the master regulator of homeostasis, integrating hormonal, autonomic, and behavioral control through a small region at the base of the diencephalon.

**Anterior hypothalamus:**

*Suprachiasmatic Nucleus (SCN)* — Master circadian clock. Self-sustaining transcription-translation feedback loop (CLOCK/BMAL1 → PER/CRY → suppress their own expression, ~24-hour cycle). Entrained by light via the retinohypothalamic tract. Coordinates daily rhythms of sleep, hormone secretion, and body temperature throughout the body via autonomic and neuroendocrine outputs.

*Preoptic Area / VLPO* — Sleep center. GABAergic neurons of the ventrolateral preoptic nucleus fire during NREM sleep, inhibiting the wake-promoting aminergic nuclei (LC, raphe, TMN) — like a flip-switch: when VLPO dominates → sleep; when aminergic systems dominate → waking.

*Supraoptic and Paraventricular Nuclei (PVN)* — Produce **vasopressin (ADH)** and **oxytocin**, transported axonally to the posterior pituitary for systemic release. PVN also releases **CRH** into the portal system → pituitary ACTH → adrenal cortisol (HPA stress axis). Supraoptic damage → central diabetes insipidus.

**Medial hypothalamus:**

*Ventromedial Nucleus (VMH)* — Satiety center. Stimulation → cessation of eating; destruction → hyperphagia and obesity.

*Arcuate Nucleus* — Contains NPY/AgRP neurons (orexigenic — hunger-promoting) and POMC neurons (anorexigenic — satiety-promoting). Receives leptin signals from adipose tissue to modulate long-term energy balance.

**Posterior/lateral hypothalamus:**

*Lateral Hypothalamic Area (LHA) / Orexin neurons* — Wakefulness and arousal. Orexin (hypocretin)-producing neurons activate all aminergic wake-promoting systems and stabilize the sleep-wake switch. Loss of orexin neurons → **narcolepsy with cataplexy**.

*Mammillary Bodies* — Critical Papez circuit nodes. Receive hippocampal output via the fornix → project to anterior thalamus via mammillothalamic tract. Bilateral damage (from thiamine deficiency) → **Korsakoff syndrome**.

**Epithalamus:**

*Pineal Gland* — Secretes melatonin (suppressed by SCN during light; released at night) — communicates circadian time to peripheral tissues.

*Habenula* — Connects limbic system to monoaminergic brainstem nuclei. Lateral habenula stimulates the raphe's RMTg, which inhibits dopamine → activated by absence of expected reward (aversion, disappointment). Implicated in depression.

---

## 9. Spinal Cord Organization

### Laminar Organization (Rexed Laminae)
The spinal cord gray matter is divided into 10 laminae (I-X):

| Laminae | Location | Function |
|---|---|---|
| I-II (Substantia Gelatinosa) | Dorsal horn superficial | Pain/temperature processing; gate control of pain |
| III-IV | Dorsal horn deeper | Touch and proprioception processing |
| V | Dorsal horn | Pain (receives both nociceptive and non-nociceptive input — convergence for referred pain) |
| VII | Intermediate zone | Autonomic preganglionic neurons (IML: T1-L2 sympathetic; S2-S4 parasympathetic) |
| IX | Ventral horn | Alpha and gamma motor neurons innervating skeletal muscle |
| X | Central canal | Commissural neurons |

### Spinal Cord Cross-Section: White Matter Tracts
- **Posterior (dorsal) columns:** Fine touch, vibration, proprioception (ascending, ipsilateral to entry)
- **Lateral corticospinal tract:** Voluntary motor (descending, contralateral — already crossed in medulla)
- **Anterolateral tract (spinothalamic):** Pain and temperature (ascending, contralateral — crossed near entry)
- **Posterior spinocerebellar tract:** Unconscious proprioception to ipsilateral cerebellum
- **Anterior spinocerebellar tract:** Unconscious proprioception — crosses twice (net ipsilateral to cerebellum)

---

## 10. Neuroplasticity

The nervous system retains the capacity to change its structure and function throughout life — a property called **neuroplasticity** — that underlies learning, memory, recovery from injury, and adaptation to experience.

### Long-Term Potentiation (LTP) — The Cellular Basis of Memory

LTP is a persistent strengthening of synaptic connections following repeated co-activation of pre- and postsynaptic neurons. It is the primary cellular mechanism of learning and memory.

**The NMDA receptor as a coincidence detector:**

Presynaptic glutamate release + Postsynaptic depolarization (relief of Mg²⁺ block)
↓ Both conditions met simultaneously
Ca²⁺ influx through NMDA receptor
↓
Activation of CaMKII and other kinases
↓
Phosphorylation and insertion of AMPA receptors → increased synaptic sensitivity
↓
Long-term potentiation (Hebb's rule: "neurons that fire together, wire together")

> **Key principle:** NMDA receptors require BOTH glutamate (presynaptic event) AND sufficient postsynaptic depolarization to open — making them molecular coincidence detectors that only respond to correlated activity.

### Long-Term Depression (LTD)
The functional complement of LTP. Asynchronous or low-frequency stimulation → insufficient NMDA activation → internalization (removal) of AMPA receptors → weakened synapse. Particularly important in **cerebellar motor learning**: climbing fiber error signals (inferior olive) paired with parallel fiber activity induce LTD at parallel fiber-Purkinje cell synapses, gradually refining motor programs over repeated trials.

### Cortical Remapping
- **After deafferentation** (e.g., limb amputation): Cortical territory of the lost limb is invaded by adjacent body part representations → **phantom limb sensation** (cortex now activated by neighboring inputs)
- **With skilled practice** (musicians, athletes, Braille readers): Cortical territory devoted to the trained region expands → increased representational precision

### Glymphatic System — Sleep-Dependent Brain Clearance
A waste clearance system in which **CSF is driven through perivascular spaces** by arterial pulsatility, flushing interstitial metabolic waste (amyloid-beta, tau, metabolites) into venous and lymphatic drainage.

Mechanism:
1. Arteriole pulsation drives CSF into brain parenchyma along perivascular spaces
2. **Astrocyte AQP4 water channels** (at perivascular endfeet) facilitate rapid convective exchange between CSF and interstitial fluid
3. Waste-laden fluid exits via perivenous spaces to cervical lymphatics

> **Glymphatic flow is dramatically upregulated during slow-wave sleep and nearly halted during wakefulness.** Chronic sleep deprivation impairs this clearance → amyloid-beta accumulation — a mechanistic link between poor sleep and accelerated neurodegeneration.

---

## 11. Thalamus as Relay Center — Summary

The thalamus is not a passive gateway but an active modulator of cortical information flow. Key organizing principles:

1. **Every sensory modality** (except olfaction) relays through the thalamus before reaching cortex
2. The **TRN provides gain control** — a GABAergic shell that filters thalamocortical transmission based on attentional demands
3. **Motor output nuclei** (VA/VL) receive converging basal ganglia and cerebellar input and route it to motor cortex — the thalamus is where these two motor control systems converge
4. **Limbic/associative nuclei** (MD, anterior) connect with prefrontal and cingulate cortex — the thalamus participates in working memory, decision-making, and memory consolidation
5. **Bilateral thalamic damage** from paramedian stroke or Wernicke's disease (mammillary bodies + MD) produces severe amnesia and changes in level of consciousness disproportionate to the small lesion size`;

  const result = await db.update(studyGuidesTable)
    .set({ content, title: "Central Nervous System — Study Guide" })
    .where(eq(studyGuidesTable.id, 28))
    .returning();

  console.log(`  ✓ CNS guide updated (id=${result[0]?.id})`);
  console.log("✅ CNS formatting complete.");
}

update().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
