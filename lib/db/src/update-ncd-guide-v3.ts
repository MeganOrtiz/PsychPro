import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

async function update() {
  console.log("Updating Neurocognitive Disorders study guide with condition-specific formatting...");

  const content = `# Neurocognitive Disorders — Comprehensive Study Guide

---

## Overview: Classification

**Minor Neurocognitive Disorder (MCI):** Modest cognitive decline (~1-2 SD below normative mean) that does **not** impair functional independence — the patient compensates with greater effort, time, or strategies.

**Major Neurocognitive Disorder (Dementia):** Substantial cognitive decline (typically >2 SD) with **functional independence impaired** — assistance is required for instrumental or basic ADLs.

Both require documented decline from a prior level AND objective cognitive assessment. The line between minor and major NCD is dimensional, not categorical.

---

## 1. Alzheimer's Disease (AD)

**Typical Age of Onset:** Sporadic AD rises sharply after 65 (~5% at 65-74; ~13% at 75-84; ~33% at 85+). Familial early-onset AD (PSEN1, PSEN2, APP): 30s-50s. Preclinical biology begins 15-20 years before any symptoms.

### The Amyloid Cascade

APP (chromosome 21) cleaved by β-secretase (BACE1) and γ-secretase (presenilin complex)
↓ → Aβ42 peptides
↓ Aβ42 oligomers form (most neurotoxic) → protofibrils → amyloid plaques
↓ Oligomers disrupt synaptic function + activate microglia
↓ Tau hyperphosphorylation → detaches from microtubules → neurofibrillary tangles (NFTs)
↓ Neuroinflammation (TREM2-mediated microglial activation) → synaptic loss
↓ Nucleus basalis of Meynert cholinergic degeneration (~75-80% by mid-stage)
↓ **Cognitive impairment** — synaptic density loss is the best correlate (not plaque/tangle burden)

### Tau Spread — Braak Staging

| Stage | Location | Clinical Impact |
|---|---|---|
| **I-II** (Transentorhinal) | Entorhinal cortex, perirhinal cortex | Subtle episodic memory impairment |
| **III-IV** (Limbic) | Hippocampus, amygdala, basal forebrain | Overt amnestic syndrome; MCI-dementia transition |
| **V-VI** (Neocortical) | Association cortex (parietal, frontal) | Full multi-domain dementia |

Tau stage correlates more closely with cognitive severity than amyloid plaque burden.

### Genetic and Modifiable Risk Factors
The most significant genetic risk factor for sporadic AD is **APOE ε4** (chromosome 19). One copy increases risk approximately threefold; two copies (homozygous) approximately 8-12-fold. APOE ε4 impairs amyloid-beta clearance through multiple pathways — reducing glymphatic and perivascular Aβ removal, impairing microglial phagocytosis, and promoting tau hyperphosphorylation. APOE ε2 is protective (~40% reduced risk vs ε3 neutral).

Familial early-onset AD is caused by three autosomal dominant genes. **PSEN1** (chromosome 14, >400 mutations) alters γ-secretase to increase the Aβ42:Aβ40 ratio — the most common FAD gene with onset typically in the 30s to 50s. **PSEN2** (chromosome 1) has the same mechanism with slightly later and more variable onset. **APP** (chromosome 21) mutations near the cleavage sites increase Aβ42 production — triplication in Down syndrome explains universal AD pathology by age 40 in trisomy 21. **TREM2 R47H** variant approximately doubles AD risk by impairing microglial phagocytosis of Aβ.

Modifiable risks: midlife hypertension (the single most impactful modifiable risk), diabetes, obesity, low educational attainment, social isolation, untreated hearing loss, depression, physical inactivity, smoking, and sleep disorders.

### Neuropsychological Profile
- **Core deficit — Encoding failure:** Both free recall AND recognition are impaired; information never properly stored
- Fails to benefit from cues or recognition format; high intrusion errors; rapid forgetting
- **Early:** Anterograde amnesia (most prominent), anomia, topographic disorientation
- **Fluency:** Category (semantic) worse than phonemic (letter) — opposite of FTD
- **Middle:** Visuospatial decline, executive dysfunction, acalculia, constructional apraxia
- **Late:** Language breakdown, limb apraxia, agnosia, complete ADL dependence
- *Key distinction:* Encoding deficit (poor recognition) vs. subcortical retrieval deficit (recognition preserved)

### Biomarkers (A/T/N Framework)

| Biomarker | Method | Finding in AD |
|---|---|---|
| **A** (Amyloid) | CSF Aβ42 ↓; Amyloid PET | Plaques trap Aβ → ↓CSF; PET positive |
| **T** (Tau) | CSF p-tau ↑; Tau PET | NFTs → elevated p-tau; mesial temporal uptake first |
| **N** (Neurodegeneration) | FDG-PET; MRI atrophy | Temporoparietal hypometabolism; hippocampal atrophy |

A patient can be A+ for 15-20 years before any cognitive symptoms (preclinical AD) — this window is the target for disease-modifying prevention trials.

### Critical Considerations
Anti-amyloid immunotherapies (lecanemab, donanemab) represent genuine disease modification — they slow decline in early symptomatic AD — but carry ARIA risk (edema and microhemorrhages), particularly elevated in APOE ε4 homozygotes. Only appropriate for A+ patients at MCI or mild dementia stage with regular MRI monitoring.

Cholinesterase inhibitors and memantine are **symptomatic only** — they do not alter disease trajectory. Posterior cortical atrophy (PCA) and logopenic variant PPA (lvPPA) are AD variants presenting without prominent memory loss; ~80% of PCA and most lvPPA cases have underlying AD pathology.

### Differential Diagnosis Considerations

| Compare To | How to Distinguish from AD | How to Distinguish the Differential |
|---|---|---|
| **DLB** | Encoding deficit (recognition AND recall impaired); gait preserved early; no visual hallucinations | Retrieval deficit (recognition preserved); early visuospatial impairment; attention fluctuations; visual hallucinations; parkinsonism; RBD |
| **bvFTD** | Memory failure is primary; social cognition/personality preserved early; posterior/hippocampal atrophy | Behavioral change with preserved memory early; profound social cognition impairment; frontal atrophy; phonemic fluency worse |
| **NPH** | Gait preserved until middle-late stages; no early incontinence; no LP improvement | Prominent early gait apraxia + incontinence disproportionate to cognition; improves with LP |
| **VaD** | Gradual decline; encoding deficit; hippocampal atrophy | Frontal-subcortical profile; preserved recognition; vascular MRI lesions; stepwise progression |
| **Depression** | Objective deficits; biomarkers positive; progressive course | Retrieval deficit that improves with cuing; subjective > objective complaints; mood disorder history; negative biomarkers |

### Treatment
- Cholinesterase inhibitors (donepezil, rivastigmine, galantamine) — moderate symptomatic benefit
- Memantine — NMDA antagonist; approved moderate-severe AD
- Anti-amyloid immunotherapy (lecanemab, donanemab) — early AD, A+ patients; disease-slowing
- Non-pharmacological: cognitive stimulation therapy, aerobic exercise, sleep hygiene, caregiver education, modifiable risk factor management

---

## 2. Vascular Cognitive Impairment (VCI)

**Typical Age of Onset:** Sporadic VaD typically after 60-65. CADASIL (hereditary form) causes cognitive symptoms as early as 40s-50s, preceded by migraine with aura from the 30s.

### Mechanisms of Vascular Injury

| Mechanism | Brain Lesion | Clinical Impact |
|---|---|---|
| **Large vessel disease** | Cortical infarcts | Focal deficits, stepwise progression |
| **Small vessel disease** | Lacunar infarcts, white matter hyperintensities (leukoaraiosis) | Frontal-subcortical syndrome; gait, bladder |
| **Strategic infarcts** | Thalamus, angular gyrus, caudate | Disproportionate cognitive impact from small lesions |
| **Cerebral amyloid angiopathy (CAA)** | Lobar hemorrhages, cortical microbleeds, superficial siderosis | Cognitive impairment + hemorrhage risk |
| **CADASIL** | Anterior temporal pole + external capsule WMH | Hereditary; NOTCH3 mutations; no traditional vascular risk factors |

### Genetic and Modifiable Risk Factors
The primary determinants are modifiable vascular risk factors: **hypertension** (the single most impactful, most evidence-based modifiable risk), diabetes mellitus, atrial fibrillation, hyperlipidemia, smoking, obesity, and obstructive sleep apnea. Midlife hypertension contributes to both direct cerebrovascular injury and accelerated AD pathology by lowering cognitive reserve thresholds.

The principal hereditary cause is CADASIL, caused by **NOTCH3** mutations (chromosome 19) — autosomal dominant. Characteristic MRI findings (white matter lesions prominently in the anterior temporal poles and external capsule) are highly specific and should prompt genetic testing even without a known family history or traditional vascular risk factors.

### Neuropsychological Profile
- **Core deficit — Frontal-subcortical pattern:** Executive dysfunction is prominent and early (planning, set-shifting, flexibility)
- **Psychomotor slowing:** Processing speed — one of the most sensitive early markers
- **Memory — retrieval deficit:** Recognition relatively preserved; cued recall improves performance
- **Gait disturbance:** Often early and prominent from periventricular WM involvement
- **Focal neurological signs** may accompany depending on lesion location
- *Key distinction:* Retrieval deficit (recognition preserved) vs. AD's encoding failure

### Critical Considerations
A temporal relationship between a vascular event and cognitive change is a useful diagnostic clue, but is often absent with cumulative small vessel disease — which can produce gradual decline mimicking AD. Mixed AD-vascular pathology is extremely common in the elderly; the two interact additively. Controlling blood pressure is the single most evidence-based intervention for both prevention and slowing of progression.

### Differential Diagnosis Considerations

| Compare To | Key Features of VaD | Key Features of the Differential |
|---|---|---|
| **AD** | Frontal-subcortical profile; preserved recognition; vascular MRI lesions; stepwise progression (large vessel) | Encoding deficit (recognition AND recall impaired); hippocampal atrophy; gradual decline; gait preserved late |
| **NPH** | Vascular lesion burden; gait does not improve with CSF drainage | Ventriculomegaly disproportionate to sulcal widening; magnetic gait improves with LP; Evans index >0.3 |
| **PSP** | Vascular MRI burden; no vertical gaze palsy; no characteristic backward falls | Vertical supranuclear gaze palsy (especially downward saccades); backward falls in year 1; midbrain atrophy |

### Treatment
Aggressive vascular risk factor management is the cornerstone — blood pressure control, antiplatelet therapy (non-cardioembolic stroke), anticoagulation (atrial fibrillation), glycemic and lipid management, smoking cessation. No pharmacological agents are specifically approved for VaD cognition; cholinesterase inhibitors show modest benefit in mixed AD+VaD. Cognitive rehabilitation and aerobic exercise have supporting evidence.

---

## 3. Lewy Body Disorders (DLB and PDD)

**Typical Age of Onset:** Mean onset 60s-70s. PD motor symptoms typically begin in the 60s with dementia developing an average of 10-15 years later (PDD). DLB cognitive symptoms typically begin in the 70s. Male predominance. ~80% of PD patients develop dementia within 20 years.

### Pathophysiology
Alpha-synuclein misfolding and aggregation → **Lewy bodies** (cytoplasmic inclusions: α-syn + ubiquitin + neurofilament) and **Lewy neurites** in axons. Pathology spreads in a prion-like manner. In PD: Braak PD staging begins in the olfactory bulb and dorsal vagal nucleus → brainstem dopaminergic nuclei → limbic → neocortex. In DLB: more diffuse cortical involvement from early stages. Cholinergic deficits (nucleus basalis of Meynert) are often more severe in DLB than in AD.

### Genetic and Modifiable Risk Factors
The most common genetic risk factor for both PD and DLB is **GBA** (glucocerebrosidase, chromosome 1) mutations — these impair lysosomal function, reducing alpha-synuclein clearance and promoting aggregation. GBA heterozygous mutations increase PD/DLB risk approximately 5-10-fold.

**SNCA** (alpha-synuclein gene) duplications and triplications cause autosomal dominant PD/DLB through α-syn overproduction — a dose-response relationship. **LRRK2** mutations are the most common single-gene PD cause worldwide.

**Isolated RBD** (REM sleep behavior disorder — acting out dreams without atonia, confirmed by polysomnography) is a prodromal biomarker: approximately 80% of individuals with isolated RBD develop a synucleinopathy (PD, DLB, or MSA) within 10-15 years, reflecting early α-syn pathology in the pontine REM-atonia circuit.

### Core Diagnostic Features of DLB

**1. Fluctuating cognition**
Marked variation in alertness and attention — daytime somnolence, episodes of staring, transient confusion. Waxing and waning within hours or days. Distinguishes DLB from the stable-plateau days seen in AD.

**2. Recurrent visual hallucinations**
Well-formed, detailed, often of people or animals — typically initially non-threatening. Result from visual cortex involvement and impaired acetylcholine-mediated visual gating.

**3. REM sleep behavior disorder (RBD)**
Acting out dreams (vocalizing, punching, kicking) with potentially injurious behavior. Often predates cognitive symptoms by years — a major prodromal biomarker. Confirmed by polysomnography showing loss of REM atonia.

**4. Parkinsonism**
Bradykinesia, rigidity, rest tremor — typically occurring concurrent with or after cognitive onset (unlike PD where motor precedes cognition by years). If motor symptoms precede cognition by ≥1 year → **PDD**; within 1 year → **DLB** (the 1-year rule).

*Probable DLB* = 2+ core features. *Possible DLB* = 1 core feature.

**Supportive biomarkers:** Abnormal DAT scan (reduced striatal dopamine transporter uptake), low cardiac MIBG scintigraphy, polysomnographic RBD confirmation.

### Neuropsychological Profile
- **Visuospatial/visuoperceptual dysfunction:** Among the earliest and most prominent features; figure copying, visual discrimination, mental rotation, navigation
- **Attention fluctuations:** Waxing and waning; episodes of confusion; vigilance deficits
- **Executive dysfunction:** Frontal systems; working memory, verbal fluency
- **Memory — retrieval deficit:** Recognition relatively preserved; information was stored but retrieval is impaired
- **BPSD:** Well-formed visual hallucinations; paranoid delusions; RBD
- **Language:** Typically preserved until late stages
- *Key distinction:* Retrieval deficit (recognition preserved) vs. AD's encoding failure (both impaired)

### ⚠ Critical Safety Consideration — Neuroleptic Sensitivity
Patients with DLB/PDD have severe striatal dopaminergic deficits and reduced D2/D3 receptor expression. Typical antipsychotics and most atypical antipsychotics can precipitate life-threatening **neuroleptic sensitivity reactions**: acute parkinsonism, profound sedation, impaired consciousness, autonomic instability, and sudden death. **Even a single dose of haloperidol can be fatal.** Metoclopramide and prochlorperazine (common antiemetics) must also be avoided. If antipsychotic treatment is unavoidable, **quetiapine** (first choice) or **clozapine** (with hematological monitoring) are the only relatively safe options due to their low D2 affinity.

### Differential Diagnosis Considerations

| Compare To | Key Features of DLB/PDD | Key Features of the Differential |
|---|---|---|
| **AD** | Retrieval deficit (recognition preserved); early visuospatial; attention fluctuations; visual hallucinations; parkinsonism; RBD | Encoding deficit (recognition AND recall impaired); gait preserved early; no hallucinations or parkinsonism early |
| **PSP** | Visual hallucinations; attention fluctuations; RBD; limb-predominant parkinsonism | Vertical gaze palsy (especially downward saccades); axial retrocollic rigidity; backward falls in year 1; no hallucinations |
| **NPH** | Parkinsonism (rigidity, bradykinesia); visual hallucinations | Magnetic gait without rigidity; prominent incontinence; improves with CSF drainage |

### Treatment
Cholinesterase inhibitors (rivastigmine — FDA approved for PDD; also used for DLB) — profound cholinergic deficit; may improve cognition and BPSD. Memantine modest evidence. Levodopa cautiously for parkinsonism at lowest effective dose (may worsen hallucinations). Clonazepam or melatonin for RBD. **Actively avoid all D2-blocking drugs including antiemetics.**

---

## 4. Frontotemporal Lobar Degeneration (FTLD)

**Typical Age of Onset:** The most common dementia in patients under 65. Mean onset for bvFTD and PPA variants in the 50s-60s; ~40% have positive family history. C9orf72-associated FTD: 50s-60s; GRN-associated: 60s-70s.

### Clinical Subtypes

| Variant | Core Feature | Language? | Brain Region |
|---|---|---|---|
| **bvFTD** | Behavioral/personality change — disinhibition, apathy, loss of empathy, hyperorality, perseverative behaviors | Preserved early | Bilateral frontal > temporal (often right-predominant) |
| **svPPA** | Loss of word meaning — fluent but anomic; surface dyslexia; prosopagnosia | Fluent but empty | Left anterior temporal lobe |
| **nfvPPA** | Effortful apraxic speech; agrammatism; phonological errors | Non-fluent, effortful | Left posterior frontal-insular |
| **lvPPA** | Impaired sentence repetition; word retrieval pauses; phonological WM | Fluent with pauses | Left temporoparietal; often AD pathology |
| **FTD-MND** | bvFTD features + upper and lower motor neuron signs | Variable | Frontal + motor cortex, spinal cord |

### Pathophysiology and Genetics
Three major genetic causes account for most familial FTLD:

**C9orf72** hexanucleotide (GGGGCC) repeat expansion (chromosome 9) — the most common cause of both familial FTD and familial ALS worldwide. The same mutation can cause pure FTD, pure ALS, or FTD-ALS overlap — even within the same family. Prominent psychiatric features (psychosis, anxiety) frequently lead to misdiagnosis as a primary psychiatric disorder. Produces FTLD-TDP pathology.

**GRN** (progranulin, chromosome 17) haploinsufficiency → loss of neurotrophic and anti-inflammatory support. Clinical presentation depends on hemisphere predominance (asymmetric cortical syndrome). Parkinsonism features are common. ~90% penetrance by age 70.

**MAPT** (microtubule-associated protein tau, chromosome 17) mutations cause FTLD-tau directly by altering tau splicing or function. Presentations vary widely — can resemble bvFTD, PSP, or CBS. Parkinsonism is common.

Pathologically: FTLD-TDP (~50%, includes C9orf72, GRN, VCP) | FTLD-tau (~40%, includes Pick's disease, PSP, CBD, MAPT mutations) | FTLD-FUS (~5%, young-onset bvFTD)

### Neuropsychological Profile

**bvFTD:**
- **Social cognition — profoundly impaired (earliest and most discriminating feature):** Theory of mind, empathy, emotion recognition
- Executive dysfunction: poor planning, set-shifting, response inhibition
- Memory relatively spared early — hippocampus often structurally preserved
- Phonemic (letter) fluency worse than semantic (category) — opposite of AD
- Stereotyped behaviors, echolalia, environmental dependency
- Insight often severely impaired

**PPA variants:**
- **svPPA:** Profound anomia, loss of word meaning, surface dyslexia, prosopagnosia; fluent but empty speech
- **nfvPPA:** Effortful apraxic speech, agrammatism, phonological paraphasias; comprehension relatively preserved

### Critical Considerations
bvFTD is frequently misdiagnosed as a primary psychiatric disorder — particularly when C9orf72-related psychiatric features (psychosis, anxiety, OCD-like behaviors) are prominent. The average delay to correct diagnosis in bvFTD is 3-4 years. Cholinesterase inhibitors and memantine have **no established benefit** — the cholinergic deficit of AD is absent in most FTLD pathologies. SSRIs may modestly reduce disinhibition, compulsive behaviors, and emotional lability.

### Differential Diagnosis Considerations

| Compare To | Key Features of bvFTD | Key Features of the Differential |
|---|---|---|
| **AD** | Behavioral and executive changes dominate with preserved memory early; phonemic fluency worse; frontal atrophy | Memory failure primary; semantic fluency worse; hippocampal/posterior atrophy; social cognition preserved early |
| **Psychiatric disorders** | Insidious progressive course; objective neuropsychological deficits; frontal atrophy on imaging | Episodic course with recovery; neuropsychological testing relatively intact; normal imaging |
| **PSP** | Behavioral change; less prominent backward falls and gaze palsy early | Vertical gaze palsy (downward saccades); backward falls in year 1; axial rigidity; 4R tauopathy |

### Treatment
No disease-modifying treatments for any FTLD subtype. SSRIs for disinhibition, compulsive behaviors, irritability. Antipsychotics cautiously — avoid in those with tau pathology (PSP/CBD overlap) or parkinsonism. Speech-language therapy for PPA variants. Genetic counseling essential when C9orf72, GRN, or MAPT mutation identified.

---

## 5. Huntington's Disease (HD)

**Typical Age of Onset:** Mean 35-44 years for motor symptom onset. Juvenile HD (>60 CAG repeats): before age 21. Late-onset HD (intermediate repeats): may not manifest until 60+. Psychiatric and cognitive symptoms often predate motor diagnosis by years.

### Genetics — CAG Repeat Spectrum

The HTT gene (chromosome 4p16.3) contains a CAG trinucleotide repeat whose length determines disease destiny:
- **<36 repeats:** Normal — no disease risk
- **36-39 repeats:** Intermediate / reduced penetrance — may or may not develop HD during a normal lifespan
- **≥40 repeats:** Full penetrance — disease is certain; repeat length inversely predicts age of onset
- **>60 repeats:** Juvenile HD (Westphal variant) — rigidity, dystonia, bradykinesia, seizures rather than chorea; predominantly through paternal transmission

**Anticipation:** CAG repeats expand across generations, especially through spermatogenesis (paternal transmission), producing earlier onset in successive generations — with profound implications for genetic counseling.

### Pathophysiology
Mutant huntingtin (mHTT) misfolds and forms nuclear/cytoplasmic inclusions → disrupts transcription (CREB-mediated gene regulation), impairs mitochondrial function, and triggers apoptotic cascades. **Medium spiny neurons (MSNs)** of the caudate nucleus — particularly D2-expressing indirect-pathway MSNs — are selectively vulnerable. Loss → disinhibition of movement → chorea. With progression: putamen, then cortex atrophy. MRI hallmark: **caudate head atrophy** → "butterfly/boxcar" expansion of frontal horns.

### Clinical Staging (Total Functional Capacity Scale)

| Stage | TFC Score | Functional Capacity |
|---|---|---|
| **I** | 11-13 | Prodromal: subtle cognitive/behavioral changes; early oculomotor signs; maintains employment |
| **II** | 7-10 | Mild: employment affected; independence maintained |
| **III** | 3-6 | Moderate: cannot work; limited independence |
| **IV** | 1-2 | Severe: requires substantial assistance |
| **V** | 0 | Total care; full dependence; terminal phase |

### Neuropsychological Profile
- **Psychomotor slowing:** Processing speed — the earliest and most sensitive cognitive marker; pervasive and prominent
- **Executive dysfunction:** Planning, mental flexibility, verbal fluency (both letter AND category reduced — distinguishes from AD where category > letter)
- **Memory — retrieval deficit:** Recognition outperforms free recall; encoding is relatively preserved
- **Visuospatial impairment:** Present but secondary to speed and executive deficits
- **Language:** Relatively preserved until late; dysarthria from motor involvement
- **Psychiatric:** Depression most common (~40%); irritability/aggression; OCD; apathy; psychosis
- **Motor:** Choreiform movements (hands, fingers, tongue → generalizes); oculomotor abnormalities (saccade initiation delay — one of the earliest detectable motor signs); dysarthria; dysphagia

### Critical Considerations
Presymptomatic genetic testing is available for at-risk individuals (50% risk offspring) but raises profound ethical issues — a positive test predicts an invariably fatal, currently incurable illness with no proven disease prevention. International guidelines require comprehensive pre-test and post-test psychological counseling. Most at-risk individuals opt not to be tested. Testing of minors is generally not recommended.

### Differential Diagnosis Considerations

| Compare To | Key Features of HD | Key Features of the Differential |
|---|---|---|
| **PD** | Hyperkinesia (chorea) early; onset 30s-40s; autosomal dominant; caudate atrophy | Resting tremor; bradykinesia/rigidity; onset 60s+; excellent levodopa response |
| **Drug-induced chorea** | Progressive dementia + psychiatric decline; positive CAG repeat test | Choreiform movements without progressive dementia; antidopaminergic exposure; stabilizes with medication change |
| **bvFTD** | Motor signs (chorea, oculomotor) accompany behavioral change; genetic CAG basis | Behavioral change without movement disorder until late; frontal atrophy; FUS/TDP/tau pathology |

### Treatment
No disease-modifying treatments currently approved. VMAT2 inhibitors (tetrabenazine, valbenazine, deutetrabenazine) reduce striatal dopamine → reduce chorea. SSRIs/SNRIs for depression and irritability. Quetiapine for psychosis and severe psychiatric symptoms. PT/OT/SLP throughout the disease course. Genetic counseling for all family members.

---

## 6. Progressive Supranuclear Palsy (PSP)

**Typical Age of Onset:** Mean 63-65 years — essentially never before age 50. Male predominance (~60%). Survival after PSP-Richardson syndrome onset averages 5-7 years.

### Pathophysiology
PSP is a **4R tauopathy** — tau protein with preferential 4-repeat (4R) isoform deposition. Tau aggregates as globose NFTs and in glia as **tuft-shaped astrocytes** (characteristic of PSP). Pathology concentrates in: midbrain tegmentum → substantia nigra → subthalamic nucleus → globus pallidus → dentate nucleus of cerebellum → brainstem reticular formation.

**MRI hallmarks:**
- **Hummingbird sign** (sagittal): Atrophied midbrain resembles a hummingbird with the preserved pons as the body
- **Morning glory sign**: Reduced cross-sectional midbrain area on axial cut

Midbrain atrophy disrupts the superior colliculi and vertical gaze centers → impaired downward saccades. Substantia nigra degeneration → levodopa-unresponsive parkinsonism. Subthalamic nucleus degeneration → postural instability.

### Cardinal Features — PSP-Richardson Syndrome

**1. Vertical supranuclear gaze palsy — especially downward saccades**
The most specific early sign. Voluntary fast downward eye movements are slow or absent; the vestibuloocular reflex (doll's eye) may initially overcome the palsy, confirming the problem is above the oculomotor nuclei (supranuclear). Patients have difficulty reading, going down stairs, and eating. Eventually, all voluntary gaze is affected.

**2. Unexplained backward falls in the first year**
Patients fall backward without warning or attempted correction — they seem unaware of being off-balance until impact. Falls in the first 1-2 years of a parkinsonian syndrome are a red flag for PSP vs. PD (where falls typically emerge years later).

**3. Axial rigidity — neck and trunk predominant (retrocollic posture)**
Rigid neck extended backward ("surprised face" with frontalis overaction) — contrasting with the stooped flexion of PD. Rigidity is axial-predominant, not limb-predominant.

**4. Frontal-subcortical dementia**
Executive dysfunction, apathy (often severe and early), and reduced verbal fluency dominate. Episodic memory is less impaired than in AD. Pseudobulbar affect (pathological laughing or crying) common.

**5. Pseudobulbar palsy**
Dysarthria (harsh, strained, low-volume), dysphagia, emotional incontinence.

### PSP Variants

| Variant | Key Features |
|---|---|
| **PSP-RS** (Richardson syndrome) | Classic — gaze palsy + backward falls + axial rigidity + dementia |
| **PSP-P** (parkinsonism) | Resembles PD closely; asymmetric; may have partial levodopa response initially |
| **PSP-PAGF** (pure akinesia with gait freezing) | Gait freezing, micrographia, hypophonia without other PSP features |
| **PSP-CBS** | Overlaps with corticobasal syndrome — asymmetric, apraxia, alien limb |
| **PSP-PF** (frontal) | Prominent frontal dementia with minimal eye movement findings initially |

### Neuropsychological Profile
- **Executive dysfunction:** Poor planning, mental inflexibility, perseveration — among the most prominent cognitive features
- **Apathy:** Often severe; one of the earliest and most prominent behavioral features — may be mistaken for depression
- **Memory — retrieval deficit:** Recognition relatively preserved; free recall impaired
- **Verbal fluency:** Both letter and category reduced
- **Language:** Vocabulary and syntax preserved; speech is dysarthric and prosodically flat
- **Social cognition:** Some impairment in theory of mind, but less profound than in bvFTD
- **Insight:** Often relatively preserved early

### Genetic and Modifiable Risk Factors
PSP is sporadic in virtually all cases. A common haplotype in the **MAPT** gene (H1 haplotype, particularly H1c) is a genetic susceptibility factor — not a causative mutation. No other confirmed genetic causes or known modifiable risk factors.

### Critical Considerations
PSP is **almost always levodopa-unresponsive** — failure to respond to an adequate levodopa trial (1,000 mg/day for ≥3 months) in a patient with parkinsonism is a major diagnostic clue pointing to PSP, CBD, or MSA rather than PD. **Dysphagia is severe** — aspiration pneumonia is the leading cause of death. Prism glasses can partially compensate for gaze palsy. Intensive physical therapy with balance training reduces fall risk.

### Differential Diagnosis Considerations

| Compare To | Key Features of PSP | Key Features of the Differential |
|---|---|---|
| **PD** | Backward falls in year 1; vertical gaze palsy; retrocollic axial rigidity; levodopa non-response | Resting tremor; flexed posture; excellent sustained levodopa response; falls emerge later |
| **NPH** | Vertical gaze palsy; axial rigidity; levodopa non-response | Magnetic gait without rigidity; incontinence; ventriculomegaly; improves with LP |
| **DLB** | No visual hallucinations; no RBD; no attention fluctuations | Visual hallucinations; attention fluctuations; RBD; limb-predominant parkinsonism |
| **bvFTD** | Gaze palsy; backward falls; axial rigidity; 4R tauopathy | Prominent disinhibition; less prominent motor features early; TDP-43/Pick pathology more common |

### Treatment
No disease-modifying treatments. Levodopa trial should be attempted — continue only with meaningful response. Weighted walkers (front-weighted) to compensate for backward fall tendency. Intensive balance training. Speech therapy and modified diet textures for dysphagia; feeding tube when aspiration risk is high. Prism glasses for gaze palsy. Fall prevention is the central ongoing management goal.

---

## 7. Normal Pressure Hydrocephalus (NPH)

**Typical Age of Onset:** Idiopathic NPH almost exclusively affects adults over 60, with prevalence increasing substantially after 70. One of the few potentially reversible causes of dementia.

### The Hakim-Adams Triad

**1. Gait disturbance** *(most prominent; typically earliest feature)*
Magnetic or apraxic gait: short shuffling steps, wide base, difficulty initiating walking ("feet stuck to the floor"), en-bloc turning (cannot turn in segments), frequent unexplained falls. Resembles parkinsonism but **without resting tremor or rigidity**.

**2. Urinary incontinence** *(typically precedes frank incontinence with urgency)*
Frontal disinhibition of bladder control + loss of cortical suppression of detrusor contractions. Urgency first, then incontinence.

**3. Cognitive impairment** *(frontal-subcortical pattern)*
Executive dysfunction, psychomotor slowing, apathy. Generally less severe than memory-predominant dementias.

> **Mnemonic:** "Wobbly, Wet, Wacky" — gait, incontinence, cognition (in order of typical appearance)

### Pathophysiology
Impaired CSF reabsorption at the arachnoid granulations → ventricular enlargement despite normal CSF opening pressure (≤20 cmH₂O on LP). Enlarged ventricles stretch and compress periventricular white matter tracts, particularly frontal-subcortical connections → the characteristic triad. The precise mechanism of impaired reabsorption in idiopathic NPH is incompletely understood; venous hypertension and glymphatic dysfunction have been implicated.

### Diagnostic Workup
MRI: Ventriculomegaly disproportionate to sulcal widening (Evans index >0.3 on axial scan) and DESH pattern (disproportionately enlarged subarachnoid spaces in high convexity/parasagittal region).
**Large-volume LP (30-50 mL):** Assess gait before and after — improvement in gait predicts shunt response. Extended lumbar drainage (5 days) or infusion testing for uncertain cases.

### Neuropsychological Profile
- **Executive dysfunction:** Working memory, planning, mental flexibility, processing speed — all reduced
- **Psychomotor slowing (bradyphrenia):** Prominent and early
- **Memory — retrieval deficit:** Improves with cuing; notably less severe than AD
- **Language:** Relatively preserved
- **Apathy:** Prominent; depression common
- **Potentially reversible:** Gait responds best and fastest to VP shunting; cognitive improvement develops over months

### Critical Considerations
NPH is frequently misdiagnosed as AD, PD, or depression. The key clinical clue: **gait disturbance is prominent and early** — often presenting concurrently with or even before significant cognitive impairment (opposite of AD, where gait is preserved until late). The magnetic gait may be confused with PD, but NPH lacks resting tremor, rigidity, and bradykinesia. The **LP tap test** — measurably better gait after removing 30-50 mL of CSF — is the most practical predictor of shunt benefit.

### Differential Diagnosis Considerations

| Compare To | Key Features of NPH | Key Features of the Differential |
|---|---|---|
| **AD** | Gait apraxia and incontinence are early/prominent, disproportionate to cognitive impairment; MRI shows ventriculomegaly; LP improves gait | Gait preserved until late; memory (encoding failure) is primary; hippocampal atrophy; no LP improvement |
| **PD** | Magnetic gait without resting tremor or rigidity; no levodopa response; LP improves gait | Resting tremor; bradykinesia + rigidity; flexed posture; excellent levodopa response |
| **VaD** | Ventriculomegaly disproportionate to sulcal widening; LP improves gait | WM lesion burden drives profile; gait does not improve with LP; vascular risk factor history |

### Treatment
Ventriculoperitoneal (VP) shunting is the primary treatment. Gait improvement is most robust (days to weeks); cognitive improvement develops over months; urinary improvement is intermediate. Programmable valves allow post-operative pressure adjustment. Large-volume LP provides temporary benefit and diagnostic information simultaneously.

---

## 8. Traumatic Brain Injury (TBI) and CTE

**Typical Age of Onset:** TBI occurs across the lifespan — falls are the leading cause in the elderly (>75), sports-related and assault-related TBI peak in adolescents and young adults. CTE symptom onset is typically in the 40s-70s, decades after the exposure period.

### TBI Severity Classification

| Severity | GCS Score | Loss of Consciousness | Post-Traumatic Amnesia |
|---|---|---|---|
| **Mild (concussion)** | 13-15 | <30 minutes | <24 hours |
| **Moderate** | 9-12 | 30 minutes – 24 hours | 1-7 days |
| **Severe** | ≤8 | >24 hours | >7 days |

**Post-traumatic amnesia (PTA) duration** is the strongest single predictor of long-term functional outcome in moderate-severe TBI.

### Pathophysiology

**Primary injury:** Mechanical forces → diffuse axonal injury (DAI — axonal shearing at gray-white matter junctions from rotational acceleration-deceleration) + focal contusions (temporal and frontal poles most vulnerable due to irregular skull base).

**Secondary injury** (minutes to days):
Glutamate excitotoxicity → ionic imbalance (Na⁺/K⁺ pump failure) → mitochondrial dysfunction → free radical production → blood-brain barrier breakdown → neuroinflammation → cerebral edema

**CTE:** Repetitive subconcussive and concussive impacts → repetitive axonal injury → tau accumulation, beginning **perivascularly at the depths of cortical sulci** (hallmark distribution). 3R+4R mixed tau pathology spreads from sulcal epicenters. CTE is definitively diagnosed only at **autopsy** — current antemortem biomarkers (plasma p-tau217, tau PET) are under investigation.

### Neuropsychological Profile

**Mild TBI (acute):**
- Attention, concentration, and working memory — most sensitive
- Processing speed slowing
- Memory consolidation difficulties
- Typically resolves days to weeks; persistent symptoms >3 months = **post-concussion syndrome (PCS)**, strongly influenced by biopsychosocial factors

**Moderate-Severe TBI:**
- Executive dysfunction — frontal systems most vulnerable to DAI
- Processing speed severely reduced; learning and memory impaired
- Behavioral dysregulation: impulsivity, emotional lability, poor self-regulation
- Anosognosia (reduced awareness of one's own deficits) — common after frontal injury
- Emotional and behavioral sequelae: depression, anxiety, irritability, PTSD

**CTE (clinical picture before death):**
- Behavioral and mood changes (irritability, impulsivity, depression, suicidality) — typically precede cognitive decline
- Cognitive decline: executive function, memory
- Motor symptoms (parkinsonism, ataxia) emerge in later stages

### Critical Considerations
**CTE cannot be diagnosed during life** — no validated antemortem imaging or blood test yet exists, though research with tau PET and plasma p-tau217 is progressing. **Second impact syndrome** — a second concussion before full recovery from the first — can cause catastrophic and rapidly fatal cerebral edema in young athletes through loss of cerebrovascular autoregulation. The graduated return-to-play (RTP) protocol requires complete symptom resolution at rest before initiating any stepwise activity progression.

**APOE ε4** worsens outcomes after TBI and may accelerate CTE-related tau accumulation. Cumulative subconcussive exposure — not only diagnosed concussions — appears to be the primary determinant of CTE risk.

### Differential Diagnosis Considerations

| Compare To | Key Features of TBI/CTE | Key Features of the Differential |
|---|---|---|
| **AD** | Clear trauma exposure history; behavioral/mood symptoms often early; executive-first cognitive decline; CTE only at autopsy | Encoding deficit (recognition AND recall both impaired); positive AD biomarkers; hippocampal atrophy; no trauma required |
| **bvFTD** | Trauma exposure history; motor features (parkinsonism) in later CTE | Progressive course without trauma; frontal-temporal atrophy; familial genetics |
| **PTSD** | Objective neuropsychological deficits on testing (processing speed, executive function); structural brain changes in moderate-severe TBI | Intrusive re-experiencing, hypervigilance, avoidance; no structural brain pathology on standard MRI; responds to trauma-focused therapy |

### Treatment
**Acute TBI:** Symptom management, graduated rest then graduated activity, avoid NSAIDs acutely, ICP management in severe TBI.
**Post-concussion syndrome:** Graduated aerobic exercise (shown to accelerate recovery — NOT prolonged rest); treat mood, sleep, and headache comorbidities; psychoeducation.
**Moderate-severe TBI:** Inpatient rehabilitation, cognitive rehabilitation (errorless learning, compensatory strategies), vocational rehabilitation.
**CTE:** No disease-modifying treatment; symptomatic management of mood and behavioral dysregulation; prevention through rule changes and improved protective equipment.

---

## 9. Prion Diseases

**Typical Age of Onset:** Sporadic CJD: median in the 60s. Familial CJD (PRNP mutations): earlier, depending on mutation. Variant CJD (vCJD): mean age ~28 years (range 12-74) — distinctive for its young onset.

### Forms of Prion Disease

| Form | Frequency | Age | Distinguishing Features |
|---|---|---|---|
| **Sporadic CJD (sCJD)** | ~85% | 60s | Rapid progression; myoclonus; PSWC on EEG; cortical ribboning on DWI |
| **Familial CJD** | ~10-15% | Variable | PRNP gene mutation; autosomal dominant; variable phenotype |
| **Variant CJD (vCJD)** | <250 cases worldwide | ~28 years | BSE-linked; psychiatric onset; painful dysesthesias; pulvinar sign (thalamic MRI) |
| **Fatal Familial Insomnia (FFI)** | Rare | Variable | PRNP mutation; selective thalamic destruction; untreatable insomnia → death |
| **Iatrogenic CJD** | Rare | Variable | Contaminated dura, cornea, pituitary-derived growth hormone |

### Pathophysiology
Normal prion protein (PrPc) is converted by misfolded PrPsc (scrapie form) into more PrPsc in a self-propagating cascade — entirely protein-based (no DNA or RNA). PrPsc is protease-resistant, accumulates, and causes **spongiform degeneration** (vacuolation of the neuropil). All forms invariably fatal; no treatments alter disease course.

### Diagnostic Biomarkers for sCJD
- **MRI DWI:** Cortical ribboning (gyral DWI restriction) + basal ganglia/thalamic hyperintensities
- **CSF 14-3-3 protein:** Sensitive (~94%) but not specific (also elevated in herpes encephalitis, stroke, etc.)
- **RT-QuIC assay:** High specificity for prion seeding activity in CSF or nasal brushing
- **EEG:** Periodic sharp wave complexes (PSWC, 1-2 Hz) — present in ~60-70% of sCJD; NOT present in vCJD
- **Pulvinar sign** (MRI DWI/FLAIR): Bilateral thalamic hyperintensity — characteristic of vCJD (the "hockey stick" sign)

### Neuropsychological Profile
- **Rapid multi-domain cognitive decline:** Weeks to months — the most compressed trajectory of any dementia
- **Memory impairment:** Part of a global cognitive collapse rather than isolated amnesia
- **Visuospatial dysfunction:** Cortical visual disturbances early; may resemble posterior cortical atrophy
- **Cerebellar ataxia:** Uncommon as a primary feature in other dementias — a distinguishing sign
- **Myoclonus:** Startle-sensitive; present in the majority; a key distinguishing clinical feature
- **Akinetic mutism:** Terminal state — profound cognitive and behavioral withdrawal

### ⚠ Infection Control — Critical
CJD is a reportable disease. Prions are resistant to standard autoclaving, alcohol, formalin, and UV radiation. Surgical instruments exposed to high-risk CJD tissue (brain, spinal cord) require special alkaline/autoclave decontamination protocols. Early diagnosis is important for appropriate infection control and family counseling even though no treatment alters prognosis.

### Differential Diagnosis Considerations

| Compare To | Key Features of CJD | Key Features of the Differential |
|---|---|---|
| **AD** | Progression in weeks-months (not years); myoclonus; cerebellar ataxia; cortical DWI ribboning; RT-QuIC positive | Progression over years to decades; no myoclonus or ataxia early; positive amyloid/tau biomarkers; normal DWI early |
| **DLB** | Myoclonus; cerebellar ataxia; no RBD; cortical DWI ribboning; progression in months | Visual hallucinations; RBD; parkinsonism; fluctuating cognition over months-years |
| **Autoimmune encephalitis** | RT-QuIC positive; prion-specific MRI; no autoantibodies; irreversible | Positive autoantibody panel (anti-NMDAR, anti-LGI1, etc.); inflammatory CSF; responds to immunotherapy; **potentially reversible — must be excluded urgently** |
| **Metabolic encephalopathy** | Progressive deterioration; prion biomarkers positive; structural DWI changes | Fluctuating delirium with a systemic precipitant; normal DWI; resolves with treatment of underlying cause |`;

  const result = await db.update(studyGuidesTable)
    .set({ content })
    .where(eq(studyGuidesTable.id, 33))
    .returning();

  console.log(`  ✓ Neurocognitive guide updated (id=${result[0]?.id})`);
  console.log("✅ Neurocognitive formatting complete.");
}

update().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
