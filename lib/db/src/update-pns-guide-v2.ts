import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

async function update() {
  console.log("Updating PNS study guide with improved formatting...");

  const content = `# Peripheral Nervous System — Study Guide

---

## 1. Overview and Organization

The peripheral nervous system comprises all neural tissue outside the brain and spinal cord: cranial nerve fibers (except CN II, which is a CNS tract), spinal nerve roots and ganglia, peripheral nerves, and peripheral autonomic ganglia. The PNS is the communication network linking the CNS to sensory receptors, muscles, and glands.

**Two functional divisions:**
- **Somatic nervous system** — conscious sensory perception and voluntary control of skeletal muscle
- **Autonomic nervous system (ANS)** — largely unconscious homeostatic control of smooth muscle, cardiac muscle, and glands

### Supporting Cells of the PNS

**Schwann cells** myelinate peripheral axons — critically, each Schwann cell wraps a **single internode of a single axon** (contrast: oligodendrocytes myelinate up to 50 axons simultaneously). After axonal injury, Schwann cells form aligned tubes called **Bands of Büngner** that guide regenerating axons back to their targets. This is the primary reason peripheral nerves can regenerate while CNS axons generally cannot.

**Satellite cells** surround the cell bodies of sensory and autonomic neurons in ganglia, regulating their microenvironment — analogous to astrocytes in the CNS.

### Peripheral Nerve Architecture (Outer → Inner)

| Layer | What It Surrounds | Key Contents |
|---|---|---|
| **Epineurium** | Entire nerve trunk | Blood vessels (vasa nervorum); loose connective tissue |
| **Perineurium** | Individual fascicles | Forms diffusion barrier (blood-nerve barrier); perineurial cells joined by tight junctions |
| **Endoneurium** | Individual axons | Each axon + its Schwann cell + basal lamina |

---

## 2. Peripheral Nerve Fiber Classification

Fiber type is determined by diameter and myelination — both directly control conduction velocity.

| Fiber Type | Diameter | Velocity | Myelination | Function |
|---|---|---|---|---|
| **Aα** (Group Ia/Ib) | 12-20 μm | 70-120 m/s | Heavy | Primary muscle spindle (Ia), Golgi tendon organ (Ib), alpha motor neurons to extrafusal muscle |
| **Aβ** (Group II) | 6-12 μm | 30-70 m/s | Moderate | Fine touch, sustained pressure, secondary muscle spindle (II), low-threshold mechanoreceptors |
| **Aδ** (Group III) | 1-5 μm | 5-30 m/s | Light | First pain (sharp, well-localized), cold temperature, initial contact |
| **C** (Group IV) | <1 μm | 0.5-2 m/s | Unmyelinated | Second pain (burning, aching, persistent), warmth, most postganglionic autonomic fibers |

### The Two-Pain Phenomenon
A sharp noxious stimulus produces two temporally separate pain sensations:
- **First pain** (immediate): Sharp, pricking, well-localized — mediated by fast **Aδ fibers**
- **Second pain** (delayed ~1-2 sec): Burning, aching, poorly localized — mediated by slow **C fibers**

This delay is most noticeable in the distal limbs because the long conduction distance amplifies the difference between Aδ and C fiber arrival times.

---

## 3. Somatic Sensory System

### 3.1 Cutaneous Mechanoreceptors

| Receptor | Fiber | Adaptation | Location | Detects |
|---|---|---|---|---|
| **Meissner's corpuscle** | Aβ | Rapidly | Fingertips, lips (glabrous skin) | Flutter, texture discrimination, light touch |
| **Merkel disc** | Aβ | Slowly | Fingertips, lips | Fine spatial detail, edges, static pressure |
| **Ruffini ending** | Aβ | Slowly | Deep dermis, joints | Skin stretch, finger position |
| **Pacinian corpuscle** | Aβ | Rapidly | Deep dermis, periosteum | Vibration, pressure transients, tool use |

### 3.2 Muscle Proprioceptors

**Muscle Spindle (Ia/II afferents + γ motor efferents)**
Structure: Intrafusal muscle fibers (nuclear bag and nuclear chain) enclosed in a connective tissue capsule, arranged in parallel with extrafusal (force-producing) fibers.
- **Ia afferents** (primary endings) detect changes in muscle length AND rate of change (dynamic and static)
- **II afferents** (secondary endings) detect mainly static length
- **γ motor neurons** (fusimotor) adjust spindle sensitivity during movement — keep spindles taut so they can detect length changes even as the muscle shortens

**The Stretch Reflex:**
Muscle stretch → Ia afferent activation → ventral horn → alpha motor neuron → muscle contraction (resistance to further stretch). Monosynaptic. Tapping a tendon stretches the spindle briefly → patellar reflex (L3/L4), Achilles reflex (S1/S2).

**Golgi Tendon Organ (Ib afferents)**
Located at the musculotendinous junction, in series with muscle fibers (contrast: spindle is in parallel). Detects muscle tension/force. When tension is too high → Ib inhibitory interneurons → **autogenic inhibition** (protective relaxation). Provides force feedback for fine motor control.

---

## 4. The Autonomic Nervous System (ANS)

The ANS operates through **two-neuron chains**: a preganglionic neuron (CNS) synapses in a peripheral ganglion onto a postganglionic neuron that innervates the effector. The two divisions — sympathetic and parasympathetic — are anatomically and functionally distinct.

### Sympathetic vs. Parasympathetic Comparison

| Feature | Sympathetic | Parasympathetic |
|---|---|---|
| **Origin** | Thoracolumbar (T1-L2) — lateral horn | Craniosacral (CN III, VII, IX, X; S2-S4) |
| **Preganglionic length** | Short | Long |
| **Ganglion location** | Paravertebral chain or prevertebral ganglia (near spine) | Terminal ganglia (near or within target organ) |
| **Postganglionic length** | Long | Short |
| **Preganglionic neurotransmitter** | Acetylcholine (nicotinic receptor) | Acetylcholine (nicotinic receptor) |
| **Postganglionic neurotransmitter** | Norepinephrine (most organs); ACh (sweat glands) | Acetylcholine (muscarinic receptor) |
| **General effect** | Fight-or-flight: ↑ HR, ↑ BP, dilated pupils, bronchodilation, ↓ GI motility, glycogenolysis | Rest-and-digest: ↓ HR, ↑ GI motility, bronchoconstriction, pupil constriction, ↑ gland secretion |

### Sympathetic Pathway
Hypothalamus → lateral horn of thoracolumbar spinal cord → **preganglionic fiber exits ventral root** → synapse in paravertebral ganglion (sympathetic chain) or prevertebral ganglion → **postganglionic fiber** → effector organ

*Adrenal medulla exception:* Preganglionic fiber synapses directly on chromaffin cells of the adrenal medulla (modified postganglionic neurons that secrete epinephrine/norepinephrine directly into bloodstream — a hormonal rather than neural pathway).

### Parasympathetic Pathway
Cranial outflow (CN X — vagus): Brainstem → long preganglionic fiber → terminal ganglion (within or near target organ) → short postganglionic → effector

Sacral outflow (S2-S4): **Pelvic splanchnic nerves** → pelvic and perineal ganglia → descending colon, sigmoid, rectum, bladder, genitalia

### Muscarinic Receptor Subtypes

| Receptor | Location | Function |
|---|---|---|
| **M1** | Ganglia, cortex, stomach | Cognitive, gastric acid secretion |
| **M2** | Heart, smooth muscle | ↓ HR (SA/AV node), presynaptic autoinhibition |
| **M3** | Exocrine glands, smooth muscle | Secretion, smooth muscle contraction, pupil constriction |

---

## 5. Cranial Nerves Summary

| CN | Name | Type | Key Functions |
|---|---|---|---|
| I | Olfactory | Sensory | Smell |
| II | Optic | Sensory | Vision (CNS tract — no Schwann cells) |
| III | Oculomotor | Motor | Eye movement (SR, IR, MR, IO), lid elevation, pupil constriction (PS), lens accommodation |
| IV | Trochlear | Motor | Superior oblique — intorsion and downward gaze (CN IV palsy → vertical diplopia going downstairs) |
| V | Trigeminal | Mixed | Facial sensation (V1/V2/V3), mastication |
| VI | Abducens | Motor | Lateral rectus — abduction |
| VII | Facial | Mixed | Facial expression, taste (anterior 2/3 tongue), lacrimal/salivary glands, stapedius |
| VIII | Vestibulocochlear | Sensory | Hearing (cochlear) and balance (vestibular) |
| IX | Glossopharyngeal | Mixed | Taste (posterior 1/3 tongue), pharyngeal sensation, parotid secretion, carotid body/sinus |
| X | Vagus | Mixed | Parasympathetics to thorax/abdomen, larynx, pharynx, taste |
| XI | Accessory | Motor | SCM, trapezius |
| XII | Hypoglossal | Motor | Tongue movement (deviation to side of lesion) |

**CN VII — Central vs. Peripheral Facial Palsy:**
- **Peripheral (LMN) VII palsy:** Entire ipsilateral face — including forehead — is paralyzed (Bell's palsy)
- **Central (UMN) VII lesion:** Lower face contralateral only — forehead spared because it receives bilateral cortical input

---

## 6. Reflexes

### Deep Tendon Reflexes (DTRs)

| Reflex | Segment | Test Site |
|---|---|---|
| Biceps | C5-C6 | Biceps tendon |
| Brachioradialis | C5-C6 | Radial styloid |
| Triceps | C7-C8 | Olecranon |
| Patellar (knee jerk) | L3-L4 | Patellar tendon |
| Achilles (ankle jerk) | S1-S2 | Achilles tendon |

**Grading:** 0 = absent, 1 = reduced, 2 = normal, 3 = brisk, 4 = clonus. UMN lesions produce hyperreflexia (3-4); LMN lesions produce hyporeflexia (0-1).

### Plantar Reflex (Babinski)
Normal: Flexion of toes (downgoing). **Pathological (Babinski sign):** Extension of the great toe + fanning of other toes — indicates UMN lesion above the L1 spinal segment. Present normally in infants until the corticospinal tract is fully myelinated (~18 months).

---

## 7. Clinical Conditions

### Horner's Syndrome
Interruption of the three-neuron sympathetic chain to the eye and face produces the classic triad:

**ptosis** (drooping upper lid — Müller's muscle paralysis) + **miosis** (small pupil — iris dilator paralysis) + **anhidrosis** (absent facial sweating)

**Localizing the lesion — 3 neurons:**
1. **First-order:** Hypothalamus → brainstem → cervical cord → ciliospinal center (C8-T2). Lesion: Wallenberg syndrome (lateral medullary), cord tumors
2. **Second-order:** Exits cord, arches over lung apex, along subclavian and carotid arteries → superior cervical ganglion. Lesion: **Pancoast tumor** (lung apex), thyroid mass, neck dissection
3. **Third-order:** Travels with internal carotid artery into orbit. Lesion: **Carotid artery dissection**, cavernous sinus, middle ear infection

### Autonomic Dysreflexia
Occurs in **spinal cord injury at T6 or above**. A noxious stimulus below the injury level (full bladder, bowel impaction, pressure ulcer) triggers massive unmodulated sympathetic activation below the lesion — because descending inhibitory control is severed.

**The crisis:**
Noxious stimulus below T6 → spinal sympathetic activation → severe hypertension + piloerection + sweating below lesion → baroreceptors detect hypertension → **vagal bradycardia above the injury level** (the only autonomic response above the lesion)

> **Medical emergency:** Hypertension can cause intracranial hemorrhage. Identify and remove the trigger immediately (drain bladder, check bowel). Manage blood pressure pharmacologically if trigger removal insufficient.

### Peripheral Neuropathy — Axonal vs. Demyelinating

| Feature | Axonal Neuropathy | Demyelinating Neuropathy |
|---|---|---|
| **Pathology** | Axon loss | Myelin loss (axons relatively spared) |
| **NCS — Amplitude** | Reduced (fewer axons conducting) | Relatively preserved |
| **NCS — Conduction velocity** | Relatively normal | Markedly slowed |
| **NCS — Distal latency** | Relatively normal | Prolonged |
| **EMG** | Fibrillations, positive sharp waves (denervation) | Relatively normal (unless severe, secondary axon loss) |
| **Recovery** | Slow, often incomplete (axon must regrow at ~1 mm/day) | Often faster (Schwann cell remyelination) |
| **Common causes** | Diabetes, B12 deficiency, alcohol, chemotherapy, uremia | GBS, CIDP, Charcot-Marie-Tooth disease |

**Guillain-Barré Syndrome (GBS):** Acute ascending demyelinating polyradiculoneuropathy. Autoimmune attack on peripheral myelin following infection (Campylobacter, CMV, EBV, Zika). Ascending flaccid paralysis with areflexia; autonomic instability; CSF shows **albuminocytologic dissociation** (elevated protein, normal WBC). Respiratory failure is the main cause of mortality — respiratory monitoring is critical. Treatment: IVIG or plasmapheresis.`;

  const result = await db.update(studyGuidesTable)
    .set({ content, title: "Peripheral Nervous System — Study Guide" })
    .where(eq(studyGuidesTable.id, 29))
    .returning();

  console.log(`  ✓ PNS guide updated (id=${result[0]?.id})`);
  console.log("✅ PNS formatting complete.");
}

update().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
