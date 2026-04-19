import { db } from "./index";
import { topicsTable, studyGuidesTable } from "./schema";

const TOPIC = {
  name: "Neuroimaging & Neuromodulation",
  category: "Neuropsychological Assessment",
  description:
    "Structural and functional neuroimaging modalities — X-ray, CT, MRI, fMRI, PET, SPECT, EEG, MEG, DTI, and vascular imaging — alongside therapeutic neuromodulation techniques including ECT, TMS, DBS, and ablation. Covers what each method measures, its spatial and temporal resolution, clinical strengths, and limitations.",
};

const TITLE = "Neuroimaging & Neuromodulation — Study Guide";

const CONTENT = `# Neuroimaging & Neuromodulation

The first question to ask of any imaging method is: **does it show structure or function?** Structural imaging produces a picture of anatomy — what is there, where it is, whether it is intact. Functional imaging shows the brain *at work* — electrical activity, blood flow, oxygen consumption, or metabolism. Most clinical workups combine the two.

The second question is **resolution**, which has two dimensions:

- **Spatial resolution** — how precisely a method localizes a signal in three-dimensional space.
- **Temporal resolution** — how quickly it captures change over time.

No single modality excels at both. Methods that follow electrical activity in real time (EEG, MEG) trade spatial precision for speed. Methods that map anatomy or metabolism in fine detail (MRI, PET) trade speed for precision. Choosing an imaging study is largely about choosing which trade-off matches the clinical question.

## Structural Imaging

### X-ray

The oldest imaging modality. External radiation passes through the body and produces a flat, negative-image projection. X-ray excels at **hard tissue** — bone fractures, calcifications, foreign bodies — but resolves soft tissue poorly. In neurological practice it has largely been displaced by CT and MRI for everything except quick skull and spine surveys.

### Computed Tomography (CT)

CT uses rotating X-ray beams to produce a series of cross-sectional slices, which can be reconstructed into a three-dimensional image. Compared with plain X-ray, CT resolves **hard tissue, soft tissue, and blood vessels** and is fast, widely available, and tolerant of patients who cannot lie still for long periods. It is the workhorse of acute neurology — the first study ordered for suspected stroke, head trauma, or hemorrhage — because it acquires images in seconds and reliably distinguishes fresh blood from brain parenchyma.

### Magnetic Resonance Imaging (MRI)

MRI uses powerful magnetic fields and radiofrequency pulses rather than ionizing radiation. A standard scan takes substantially longer than CT — often close to an hour — but the spatial resolution is far higher and soft-tissue contrast is unmatched. MRI is the preferred modality for evaluating subtle parenchymal lesions, demyelinating disease, posterior fossa structures, and the spinal cord.

The strong magnet introduces an absolute safety constraint: **no ferromagnetic metal** in or near the scanner. Patients with certain pacemakers, cochlear implants, aneurysm clips, or retained metallic foreign bodies may be ineligible.

### Diffusion Tensor Imaging (DTI)

DTI is an MRI-based technique that maps the diffusion of water molecules along **white matter fiber tracts**. Because water moves preferentially along the length of myelinated axons, DTI can reconstruct major bundles and detect microstructural injury that conventional MRI misses — diffuse axonal injury after head trauma, demyelination, and subtle disconnection syndromes. It is structural in nature but provides information about tract integrity that bridges anatomy and function.

### Vascular Imaging

A family of techniques — CT angiography, MR angiography, and conventional catheter angiography — that visualize the cerebral vasculature directly. Contrast injected into the bloodstream highlights arteries and veins, revealing **atherosclerotic plaques, arterial stenosis, aneurysms, and arteriovenous malformations**. These studies are essential in the workup of stroke, suspected vascular malformation, and vasculitis.

## Functional Imaging

### Functional MRI (fMRI)

fMRI uses the same scanner as structural MRI but exploits the **BOLD signal** — Blood Oxygen Level Dependent contrast. Active brain regions consume oxygen and trigger local vasodilation, briefly raising the ratio of oxygenated to deoxygenated hemoglobin. The scanner detects this magnetic difference and maps it onto anatomy.

fMRI offers **good spatial resolution but poor temporal resolution**. The hemodynamic response unfolds over several seconds, so fMRI cannot follow events on the millisecond timescale of neural firing. It is the dominant tool for cognitive neuroscience research and for presurgical mapping of language and motor cortex.

### Positron Emission Tomography (PET)

PET measures **metabolism and biochemistry**. A radioactive tracer — most commonly a glucose analog — is injected into the bloodstream and accumulates in metabolically active tissue. Detectors capture the positron emissions, and the resulting map is typically coregistered with a CT or MRI image so that activity can be referenced to anatomy.

PET is uniquely suited to detecting **regional metabolic abnormalities** — hypometabolism in early Alzheimer's disease, hypermetabolism in tumors, and tracer-specific imaging of amyloid, tau, or dopamine systems. Spatial resolution is moderate; temporal resolution is on the order of minutes.

### Single Photon Emission Computed Tomography (SPECT)

Often described as a less expensive cousin of PET. SPECT uses a longer-lived radioactive tracer that distributes according to **regional cerebral blood flow**. Spatial resolution is lower than PET and the images are coarser, but the equipment is more widely available and the tracers are easier to handle. SPECT is used to evaluate epilepsy foci, dementia patterns, and cerebrovascular reserve.

### Electroencephalography (EEG)

EEG records **electrical activity** generated by cortical neurons through electrodes placed on the scalp. Its great strength is **temporal resolution** — events are captured on the millisecond timescale, making EEG indispensable for evaluating seizures and sleep. Its weakness is **spatial resolution**: the skull and scalp blur the signal, and pinpointing the source of a given waveform is difficult. Adding more electrodes improves localization, but EEG remains a regional rather than a focal tool.

EEG is the primary diagnostic study for epilepsy. Photic stimulation with flashing lights is sometimes used to provoke epileptiform activity, and on rare occasions can elicit a seizure during the recording.

### Magnetoencephalography (MEG)

MEG records the **magnetic fields** produced by the same neuronal currents that EEG measures electrically. Because magnetic fields pass through the skull less distorted than electrical fields, MEG offers better spatial resolution than EEG while preserving millisecond temporal precision. A typical MEG system uses on the order of 150 sensors arranged around the head, and unlike EEG nothing is attached to the scalp. MEG is particularly useful for **localizing epileptogenic zones** and for picking up activity from sources that EEG handles poorly.

### Evoked and Event-Related Potentials

Evoked potentials use scalp electrodes to record the brain's electrical response to a specific, repeated stimulus — visual, auditory, somatosensory, or motor. Averaging across many trials cancels out background EEG and isolates the time-locked response. **Event-related potentials (ERPs)** extend the same logic to cognitive tasks, indexing attention, perception, and decision processes with millisecond precision.

### Single-Unit Recording

An invasive research technique in which a microelectrode is placed near an individual neuron to record its action potentials in real time. Single-unit recording provides the highest temporal and spatial resolution of any method but is essentially limited to animal research and to a small number of intraoperative or implanted-electrode situations in humans.

### Electromyography (EMG)

EMG is functional in the same sense as EEG, but its target is the **peripheral neuromuscular system** rather than the brain. Surface or needle electrodes record the electrical activity of muscle fibers and of the motor units that drive them. EMG is used to differentiate **muscle disease, neuromuscular junction disorders, and peripheral neuropathies**, often paired with nerve conduction studies.

### Transcranial Doppler (TCD)

TCD uses ultrasound to measure **blood flow velocity** in the major intracranial arteries in real time. Spatial resolution is poor — TCD does not produce an anatomic image — but it provides bedside, continuous monitoring of cerebral hemodynamics, useful in vasospasm after subarachnoid hemorrhage, sickle cell disease, and intraoperative monitoring.

## Resolution at a Glance

The clinical choice between modalities almost always reduces to a trade-off between how precisely a method localizes a signal and how quickly it captures change.

### High temporal resolution — millisecond range

- **EEG** — cortical electrical activity
- **MEG** — cortical magnetic fields, with better localization than EEG
- **Single-unit recording** — individual neuron firing (research / specialized clinical)

### Moderate temporal resolution — seconds to minutes

- **fMRI** — hemodynamic response
- **PET** — metabolic uptake of tracer
- **SPECT** — regional blood flow

### High spatial resolution

- **MRI / DTI** — millimeter-scale soft tissue and white matter
- **CT** — millimeter-scale, faster but lower contrast than MRI
- **PET / fMRI** — moderate, sufficient for regional and lobe-level inference

### Structural vs functional summary

**Structural:** X-ray, CT, MRI, DTI, vascular imaging.
**Functional:** fMRI, PET, SPECT, EEG, MEG, evoked potentials, single-unit recording, EMG.

## Therapeutic Neuromodulation

Several procedures use the same physical principles as imaging — electrical current, magnetic fields, focused energy — but apply them therapeutically rather than diagnostically.

### Electroconvulsive Therapy (ECT)

ECT delivers a brief electrical current through scalp electrodes under general anesthesia to induce a controlled generalized seizure. The therapeutic mechanism is incompletely understood but is thought to involve a broad "reset" of neural circuits. ECT is among the most effective treatments available for **severe depression, mania, catatonia, and the agitation and aggression of advanced dementia**, and often works when medications have failed.

The most common adverse effects are **anterograde and retrograde memory disturbance, transient difficulty learning new information after a course, headache, nausea, fatigue, and post-ictal confusion**. Memory effects typically improve after treatment ends, though some patients report persistent gaps for events around the treatment period.

### Transcranial Magnetic Stimulation (TMS)

TMS uses a coil held against the scalp to deliver focused magnetic pulses that induce small electrical currents in the cortex beneath. Repeated pulses (rTMS) modulate the excitability of targeted circuits and, over a course of treatment, are thought to **strengthen neural pathways disrupted in psychiatric illness**. The standard target for depression is the **dorsolateral prefrontal cortex**.

TMS is approved for **major depressive disorder, obsessive-compulsive disorder, and smoking cessation**, with growing applications in other conditions. It is non-invasive and does not require anesthesia, but its reach is limited to superficial cortex — it cannot directly modulate deep structures.

### Deep Brain Stimulation (DBS)

DBS implants a thin electrode into a precisely chosen deep brain target and delivers continuous low-amplitude electrical stimulation through a subcutaneous pulse generator. Surgery is required to place and later to remove or revise the device. DBS is best established for **movement disorders** — Parkinson's disease, essential tremor, dystonia — and is used in selected cases of obsessive-compulsive disorder, treatment-resistant depression, and epilepsy.

### Ablation

Ablative procedures intentionally destroy a small, precisely defined volume of brain tissue using **heat (radiofrequency or focused ultrasound) or laser energy**. Modern image-guided techniques have made these procedures far more targeted than the lesion surgeries of earlier eras. Indications include **medication-refractory movement disorders, certain psychiatric conditions, chronic pain syndromes, focal epilepsy, and tumors**.

## How These Tools Are Combined

In practice, structural and functional studies complement each other rather than competing. A typical workup pairs an anatomic image — usually MRI or CT — with a functional study chosen to answer a specific question: PET when metabolism matters, fMRI when localization of cognitive function matters, EEG when timing matters, vascular imaging when the question concerns blood vessels. Coregistration software allows results from one modality to be overlaid on another, so the clinician can read function in its anatomic context.

Subtraction designs — particularly with PET and ERPs — sharpen this further. Two conditions are presented and the brain's response to one is digitally subtracted from the response to the other, isolating the activity uniquely associated with the cognitive process of interest. The remaining signal, displayed in a graded color map, highlights regions that did or did not change with task demand.
`;

async function run() {
  console.log("Inserting Imaging topic...");
  const [topic] = await db.insert(topicsTable).values(TOPIC).returning();
  console.log(`  ✓ Topic inserted: id=${topic.id}, name="${topic.name}"`);

  console.log("Inserting study guide...");
  const [guide] = await db.insert(studyGuidesTable).values({
    topicId: topic.id,
    title: TITLE,
    content: CONTENT,
  }).returning();
  console.log(`  ✓ Study guide inserted: id=${guide.id}`);

  console.log("✅ Done.");
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
