import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

async function update() {
  console.log("Updating ENS study guide with improved formatting...");

  const content = `# Enteric Nervous System — Study Guide

---

## 1. Overview: The Second Brain

The enteric nervous system is an intrinsic neural network embedded in the wall of the gastrointestinal tract, extending continuously from the esophagus to the internal anal sphincter. It contains an estimated **400-600 million neurons** — comparable to the entire spinal cord — along with an even larger population of enteric glial cells. The ENS expresses the same neurotransmitters, neuropeptides, and receptors as the brain, and can coordinate the full repertoire of GI behaviors — peristalsis, secretion, absorption, local blood flow — **entirely without input from the CNS**.

Although autonomous, the ENS is in constant bidirectional dialogue with the CNS through the **gut-brain axis**, which uses neural, endocrine, immune, and microbial channels. This makes the ENS not merely a peripheral relay but an active participant in systemic health, behavior, and disease.

---

## 2. Structure: The Two Plexuses

The ENS is organized into two concentric ganglionated networks (plexuses) within the GI wall.

| Feature | Myenteric Plexus (Auerbach's) | Submucosal Plexus (Meissner's) |
|---|---|---|
| **Location** | Between circular and longitudinal smooth muscle layers | Within the submucosa |
| **Extent** | Full length of GI tract (esophagus → internal anal sphincter) | Most developed in small intestine; sparse in esophagus |
| **Primary function** | Motor control — coordinates smooth muscle contraction (peristalsis, segmentation, MMC) | Secretomotor — regulates mucosal secretion, absorption, and local blood flow |
| **Clinical relevance** | Absent in Hirschsprung's disease (aganglionic segment) | Samples luminal environment; target in secretory diarrhea |

---

## 3. Enteric Neuron Types

The ENS contains all three circuit elements — sensory, interneurons, and motor neurons — enabling complete local reflex arcs without CNS involvement.

### Sensory (Intrinsic Primary Afferent Neurons — IPANs)
Also called AH neurons for their distinctive long **after-hyperpolarization**. Detect:
- Mechanical distension of the gut wall
- Chemical composition and pH of luminal contents
- Osmotic state of the mucosa

The long after-hyperpolarization makes IPANs well-suited to sustained stimuli (ongoing distension, persistent chemical signals) rather than brief transients. They initiate the peristaltic reflex by detecting the advancing bolus.

### Interneurons

**Ascending interneurons** → relay excitatory signals **orally** (toward the mouth): activate the contracting (oral) segment above the bolus
**Descending interneurons** → relay inhibitory signals **anally** (toward rectum): activate the relaxing (anal) segment below the bolus

This ascending excitation + descending inhibition creates the **polarity** of the peristaltic reflex — the bolus is propelled because the segment above it squeezes while the segment below relaxes.

### Motor Neurons

**Excitatory motor neurons:** Release **acetylcholine (ACh)** and **substance P** → smooth muscle **contraction**
**Inhibitory motor neurons:** Release **nitric oxide (NO)** and **vasoactive intestinal peptide (VIP)** → smooth muscle **relaxation**
**Secretomotor neurons** (submucosal plexus): Release **ACh** and **VIP** onto intestinal epithelium → fluid and mucus secretion

---

## 4. The Peristaltic Reflex

The fundamental propulsive movement of the gut — coordinated entirely by the ENS.

Luminal distension by bolus
↓ IPANs activated
↓
Ascending interneurons → oral segment → excitatory motor neurons (ACh + substance P) → **contraction** (propulsive squeeze)
*simultaneously*
Descending interneurons → anal segment → inhibitory motor neurons (NO + VIP) → **relaxation** (receptive opening)
↓
Net effect: Bolus propelled aborally

---

## 5. Interstitial Cells of Cajal — The Pacemakers

Interstitial cells of Cajal (ICCs) are the electrical pacemakers of the GI tract — not neurons but specialized mesenchymal cells expressing the **c-Kit receptor (CD117)**. They generate rhythmic **slow-wave depolarizations** that spread through gap junctions to smooth muscle cells, setting the basal electrical rhythm that determines the maximum frequency of contractions:
- Stomach: ~3 contractions/minute
- Duodenum: ~12 contractions/minute
- Ileum: ~8 contractions/minute

ENS input modifies whether slow waves actually trigger action potentials and contractions, but the ICC-set rhythm determines the *timing* template. Loss of ICCs (as in diabetic gastroparesis) disrupts this pacemaker function.

---

## 6. Serotonin (5-HT) — The ENS Master Coordinator

The gut contains approximately **95% of the body's total serotonin** — not the brain. Serotonin is the primary signaling molecule coordinating ENS activity.

**Source:** Enterochromaffin (EC) cells in the intestinal mucosa, which detect luminal chemistry and mechanical stimulation

**Key ENS functions of 5-HT:**
- Activates IPANs (via 5-HT₃ and 5-HT₄ receptors) to initiate peristalsis
- Stimulates ascending (excitatory) and descending (inhibitory) interneuron circuits
- Modulates secretion and mucosal blood flow
- Coordinates motility patterns (peristalsis vs. MMC)

**Reuptake:** By the **serotonin reuptake transporter (SERT)** on enterocytes and enteric neurons — the same transporter targeted by SSRIs. SSRIs and SNRIs alter gut 5-HT availability, explaining GI side effects.

> **Clinical implication:** 5-HT₄ receptor agonists (e.g., prucalopride) enhance peristalsis and are used to treat chronic constipation. 5-HT₃ receptor antagonists (e.g., ondansetron) block activation of vagal afferents, reducing nausea.

---

## 7. The Migrating Motor Complex (MMC)

The MMC is a cycling pattern of GI motility that occurs during **fasting** (it is abolished by eating).

**Cycle (~90-120 minutes, repeated while fasting):**
- **Phase I:** Quiescence — no contractions
- **Phase II:** Irregular contractions begin
- **Phase III (activity front):** Powerful, organized sweeping contractions move from stomach through small intestine — the "housekeeper wave" that clears undigested material, bacteria, and secretions from the small bowel into the colon

Motilin (from duodenal Mo cells) triggers Phase III. The MMC is disrupted in small intestinal bacterial overgrowth (SIBO) — loss of Phase III cleaning allows bacterial proliferation.

---

## 8. The Gut-Brain Axis

The gut-brain axis is a **bidirectional communication network** — signals travel both from brain to gut (top-down) and from gut to brain (bottom-up).

### Communication Channels

| Channel | Direction | Examples |
|---|---|---|
| **Vagus nerve** | ↑ Gut → brain (80-90% afferent) and ↓ brain → gut (10-20% efferent) | Satiety signals, nausea, mood; parasympathetic control of gut |
| **Spinal afferents** | ↑ Gut → brain | Visceral pain; pelvic and thoracolumbar splanchnic nerves |
| **Hormones** | ↑ Gut → brain | GLP-1, PYY, ghrelin, CCK → hypothalamus; affect appetite, metabolism |
| **Immune signals** | ↑ Bidirectional | Cytokines, mast cell activation; visceral hypersensitivity in IBS |
| **Gut microbiota** | ↑ Gut → brain | SCFAs, tryptophan → 5-HT synthesis; GABA precursors; HPA axis modulation |
| **HPA axis** | ↓ Brain → gut | CRH → mast cell activation; stress → altered motility and permeability |

> **Key fact:** The vagus nerve is approximately 80-90% afferent (carrying gut-to-brain information), not primarily efferent — the ENS acts far more autonomously than originally assumed.

---

## 9. Clinical Conditions of the ENS

### Hirschsprung's Disease (Congenital Aganglionosis)
**Mechanism:** Failure of neural crest cells to migrate to the distal colon during development → aganglionic segment (no myenteric or submucosal plexus neurons). Without inhibitory motor neurons, the aganglionic segment is tonically contracted and cannot relax → functional obstruction.

**Clinical picture:** Neonatal failure to pass meconium; abdominal distension; short-segment disease (most common: rectosigmoid) or long-segment. Diagnosed by suction rectal biopsy (absence of ganglion cells; increased AChE staining). Treatment: surgical resection of aganglionic segment.

---

### Achalasia
**Mechanism:** Selective autoimmune destruction of **inhibitory (NO-producing) neurons** in the myenteric plexus of the lower esophageal sphincter (LES) and esophageal body → LES fails to relax during swallowing → no peristaltic clearance.

Impaired NO release from myenteric inhibitory neurons
↓
LES fails to open with swallowing
↓
Progressive dysphagia (solids > liquids initially) + regurgitation + chest discomfort + weight loss

**Manometry:** Absent peristalsis + incomplete LES relaxation + elevated LES pressure. Treatment: pneumatic dilation, surgical myotomy, or Botox injection (blocks ACh from excitatory neurons to reduce unopposed contraction).

---

### Gastroparesis
**Mechanism:** Loss of ICC pacemaker function and ENS motor neuron function → impaired antral contractions and pyloric relaxation → delayed gastric emptying without mechanical obstruction. Most commonly caused by **diabetes mellitus** (chronic hyperglycemia damages both ICC network and enteric neurons) or post-surgical vagal injury.

**Symptoms:** Nausea, vomiting, early satiety, bloating, postprandial abdominal discomfort. **Gold standard diagnosis:** Nuclear medicine gastric emptying scintigraphy (>10% retention at 4 hours = abnormal). Treatment: dietary modification (small frequent meals, low fat/fiber), metoclopramide or erythromycin (motilin agonist), gastric electrical stimulation.

---

### Irritable Bowel Syndrome (IBS)
IBS is a **gut-brain axis disorder** — symptoms (pain, altered bowel habits) without structural pathology — driven by convergent mechanisms at multiple levels:

- **Visceral hypersensitivity:** IPAN and spinal afferent sensitization → lowered pain threshold (allodynia and hyperalgesia)
- **Altered 5-HT signaling:** Abnormal EC cell serotonin release and SERT function → abnormal motility
- **Low-grade mucosal inflammation:** Mast cell activation → sensitization of afferent neurons
- **Microbiome dysbiosis:** Altered SCFA production, abnormal 5-HT synthesis
- **Increased intestinal permeability:** Barrier dysfunction amplifies immune activation
- **Central sensitization + HPA stress reactivity:** Stress → CRH → mast cells → pain amplification

IBS is a disorder of the entire gut-brain system, not of the ENS alone.

---

### Parkinson's Disease — The Braak Gut-First Hypothesis
PD produces prominent GI symptoms (severe constipation) that can predate motor symptoms by **a decade or more**.

**Braak hypothesis:** Misfolded alpha-synuclein pathology may begin in the ENS (or olfactory epithelium) and spread centrally via vagal afferents:

ENS alpha-synuclein pathology → vagal afferents → dorsal motor nucleus of vagus → rostral brainstem (locus coeruleus, raphe) → substantia nigra → motor symptoms

Supporting evidence:
- Lewy body pathology found in ENS post-mortem in PD patients
- Constipation precedes motor PD onset by 10+ years in many patients
- Epidemiological data: truncal vagotomy modestly reduces later PD risk

---

### Opioid-Induced Constipation (OIC)
**Mechanism:** The ENS is densely populated with **mu (μ) opioid receptors**. Exogenous opioids activate these receptors in the gut → inhibit ACh release from excitatory motor neurons → suppress peristalsis → impair secretion → constipation. This affects virtually all opioid-treated patients.

Opioids act at μ receptors in ENS
↓
ACh release from excitatory motor neurons suppressed
↓
Peristalsis and secretion impaired → constipation

**Treatment:** **Peripherally restricted μ-opioid antagonists** (methylnaltrexone, naloxegol, naldemedine) — do not cross the blood-brain barrier, so they reverse gut-mediated constipation without reversing central analgesia.

---

## 10. ENS Neurotransmitters — Summary

| Neurotransmitter | Primary Source | Receptor | Effect in ENS |
|---|---|---|---|
| **Acetylcholine (ACh)** | Excitatory motor neurons, interneurons | Nicotinic (ganglia), Muscarinic (smooth muscle) | Smooth muscle contraction; secretion |
| **Nitric Oxide (NO)** | Inhibitory motor neurons | Diffuses directly into smooth muscle | Smooth muscle relaxation; LES opening |
| **VIP** | Inhibitory motor neurons, secretomotor neurons | VPAC1/VPAC2 | Smooth muscle relaxation; mucosal secretion |
| **Substance P** | Excitatory motor neurons, IPANs | NK1 receptors | Smooth muscle contraction; pain signaling |
| **Serotonin (5-HT)** | Enterochromaffin cells | 5-HT₃, 5-HT₄ | Activates IPANs; coordinates peristalsis |
| **Motilin** | Mo cells (duodenum/jejunum) | Motilin receptor | Triggers MMC Phase III |`;

  const result = await db.update(studyGuidesTable)
    .set({ content, title: "Enteric Nervous System — Study Guide" })
    .where(eq(studyGuidesTable.id, 27))
    .returning();

  console.log(`  ✓ ENS guide updated (id=${result[0]?.id})`);
  console.log("✅ ENS formatting complete.");
}

update().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
