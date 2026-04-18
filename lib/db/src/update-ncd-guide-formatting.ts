import { db } from "./index";
import { eq } from "drizzle-orm";
import { studyGuidesTable } from "./schema";

const TOPIC_ID = 15;

async function update() {
  console.log("Updating Neurocognitive Disorders study guide — bullets for NP profiles, tables for differential diagnosis...");

  const sgContent = `# Neurocognitive Disorders — Comprehensive Study Guide

---

## Overview: Classification

**Minor Neurocognitive Disorder (MCI):** Modest cognitive decline — approximately 1-2 standard deviations below the normative mean on objective testing — that does **not** impair functional independence. The patient compensates through greater effort, time, or adaptive strategies.

**Major Neurocognitive Disorder (Dementia):** Substantial cognitive decline — typically more than 2 standard deviations below the normative mean — with **functional independence impaired**. Assistance is required for instrumental or basic activities of daily living.

Both diagnoses require documented decline from a prior level of functioning (not a lifelong baseline) and must be supported by both clinical history and objective cognitive assessment. The distinction between minor and major NCD is dimensional rather than categorical — severity is a continuum.

---

## 1. Alzheimer's Disease (AD)

**Typical Age of Onset:** Sporadic late-onset AD: risk rises sharply after age 65 (prevalence ~5% at 65-74; ~13% at 75-84; ~33% at 85+). Familial early-onset AD (PSEN1, PSEN2, APP mutations): onset typically 30s-50s. Women are disproportionately affected, partly due to longevity and partly to hormonal and genetic factors.

### Epidemiology
The most common cause of dementia, accounting for 60-70% of all cases. Approximately 6.7 million Americans are currently affected. Prevalence doubles every five years after age 65. The preclinical phase — when amyloid pathology is accumulating but the patient is cognitively normal — begins approximately 15-20 years before clinical onset.

### Pathophysiology
**Amyloid cascade:** Amyloid precursor protein (APP, chromosome 21) is cleaved by β-secretase (BACE1) and γ-secretase (a complex including presenilin 1 and 2) to generate amyloid-beta (Aβ) peptides. When Aβ42 production or clearance is disrupted, it aggregates — first forming soluble oligomers (the most synaptically toxic form), then protofibrils, then insoluble plaques. Aβ42 oligomers disrupt synaptic transmission, activate microglia, and initiate tau hyperphosphorylation.

**Neurofibrillary tangles (NFTs):** Hyperphosphorylated tau detaches from microtubules → microtubule collapse → paired helical filaments → NFTs. Tau pathology spreads transneuronally in a stereotyped pattern (Braak staging): Stages I-II (entorhinal/perirhinal cortex) → earliest memory impairment; Stages III-IV (hippocampus, amygdala, basal forebrain) → overt amnestic syndrome; Stages V-VI (association neocortex) → full multi-domain dementia. Tau pathology correlates more closely with cognitive severity than amyloid plaque burden.

**Neuroinflammation:** Microglia (TREM2-regulated) initially attempt Aβ phagocytosis but become chronically dysregulated, releasing pro-inflammatory cytokines (IL-1β, TNF-α) that amplify tau phosphorylation and synaptic damage. Neuroinflammation is a core feature, not merely a consequence.

**Cholinergic loss:** Neurons of the nucleus basalis of Meynert (NBM) — the primary cortical cholinergic source — undergo 75-80% degeneration by mid-stage AD, producing the cholinergic deficit targeted by acetylcholinesterase inhibitors.

### Genetic and Modifiable Risk Factors
The most significant genetic risk factor for sporadic AD is the **APOE ε4 allele** (chromosome 19). A single copy increases risk approximately threefold; two copies (homozygous) increase risk approximately eight to twelvefold. APOE ε4 impairs amyloid-beta clearance through multiple pathways — reducing glymphatic and perivascular Aβ removal, impairing microglial phagocytosis, and promoting tau hyperphosphorylation. The **APOE ε2** allele is protective, reducing risk by approximately 40% relative to the neutral APOE ε3.

Familial early-onset AD is caused by autosomal dominant mutations in three genes. **PSEN1** (presenilin-1, chromosome 14) is the most common familial AD gene, with over 400 identified mutations that alter γ-secretase to increase the Aβ42:Aβ40 ratio, with onset typically in the 30s to 50s. **PSEN2** (chromosome 1) causes a similar mechanism with a slightly later and more variable onset. **APP** (chromosome 21) mutations increase Aβ42 production — this same gene is triplicated in Down syndrome (trisomy 21), explaining why individuals with Down syndrome develop amyloid pathology by age 30-40 and dementia by their 60s. The **TREM2 R47H variant** approximately doubles AD risk by impairing microglial phagocytic clearance of Aβ.

Modifiable risk factors include midlife hypertension (the most impactful single modifiable risk), diabetes mellitus, obesity, low educational attainment, social isolation, untreated hearing loss, depression, physical inactivity, smoking, and sleep disorders. Controlling blood pressure in midlife appears to have the greatest population-level impact.

### Neuropsychological Profile
- **Core deficit — Encoding failure:** Both free recall AND recognition are impaired; patient does not benefit from cues or recognition format; information is never properly stored
- **Rapid forgetting:** Steep forgetting curve between immediate and delayed recall; high intrusion errors (false recalls from prior lists)
- **Early:** Anterograde amnesia (most prominent), anomia and word-finding difficulty, topographic disorientation
- **Fluency pattern:** Semantic/category fluency worse than phonemic/letter fluency (opposite of FTD)
- **Middle:** Visuospatial decline, executive dysfunction, acalculia, constructional apraxia
- **Late:** Language breakdown, limb apraxia, agnosia, complete ADL dependence
- **Key distinction:** Encoding deficit (poor recognition) differentiates AD from the retrieval deficits of subcortical dementias, where recognition is relatively preserved

### Clinical Staging
Preclinical AD: biomarker-positive (amyloid-positive) but cognitively normal — a window lasting 15-20 years. MCI due to AD: measurable cognitive decline, primarily memory, biomarker-positive, intact functional independence. Mild AD: memory plus at least one other domain impaired; IADL difficulties. Moderate AD: multi-domain impairment; BPSD emerge (delusions, hallucinations, agitation); substantial daily assistance needed. Severe AD: profound impairment; minimal verbal output; immobility; dysphagia; palliative phase.

### Critical Considerations
Anti-amyloid immunotherapies (lecanemab, donanemab) slow decline in early AD but carry significant ARIA risk (edema and microhemorrhages), more frequent in APOE ε4 carriers. Treatment is only appropriate for A+ patients at the MCI or mild dementia stage and requires regular MRI monitoring. Cholinesterase inhibitors and memantine are purely symptomatic and do not alter disease trajectory.

Posterior cortical atrophy (PCA), the "visual variant of AD," presents with Balint syndrome (simultanagnosia, optic ataxia, oculomotor apraxia), prominent visuospatial/perceptual deficits, and relative early preservation of episodic memory and insight. Approximately 80% have underlying AD pathology. Logopenic variant PPA (lvPPA) shows sentence repetition impairment, word retrieval pauses, and phonological working memory failure — also most commonly underlain by AD pathology.

### Differential Diagnosis Considerations

| Compare To | Key Distinguishing Features of AD | Key Distinguishing Features of the Other Condition |
|---|---|---|
| **DLB** | Encoding deficit (recognition AND recall both impaired); gait and behavior preserved early; gradual decline | Retrieval deficit (recognition relatively preserved); prominent early visuospatial impairment; attention fluctuations; visual hallucinations; parkinsonism; RBD |
| **bvFTD** | Memory failure is the primary early complaint; social cognition and personality preserved early; posterior/hippocampal atrophy | Behavioral change with relatively preserved memory early; profound social cognition impairment; frontal-predominant atrophy; phonemic fluency worse than semantic |
| **NPH** | Gait is preserved until middle-to-late stages; no incontinence early; no improvement with CSF drainage | Prominent early gait apraxia ("magnetic gait") and incontinence often disproportionate to cognitive change; improves with LP |
| **VaD** | Gradual progressive decline; encoding deficit; hippocampal atrophy on MRI | Frontal-subcortical profile; preserved recognition; vascular MRI lesions (WMH, lacunae); stepwise progression with vascular events |
| **Depression** | Objective cognitive deficit on testing; biomarkers positive; progressive course | Retrieval deficit that improves with cuing; subjective complaints disproportionate to objective findings; history of mood disorder; negative AD biomarkers |

### Treatment
Cholinesterase inhibitors (donepezil, rivastigmine, galantamine) increase synaptic acetylcholine — modest symptomatic benefit on cognition and function. Memantine (NMDA receptor antagonist) for moderate-severe AD. Anti-amyloid immunotherapies (lecanemab, donanemab) for early AD in biomarker-positive patients. Non-pharmacological: cognitive stimulation therapy, aerobic exercise, sleep hygiene, caregiver support and education, and aggressive management of modifiable risk factors.

---

## 2. Vascular Cognitive Impairment (VCI)

**Typical Age of Onset:** Most cases present after age 60-65, though CADASIL (the hereditary form) causes cognitive symptoms as early as the 40s-50s, preceded by migraine with aura in the 30s.

### Epidemiology
The second most common cause of dementia, accounting for approximately 15-20% of pure cases and far more in mixed AD+VaD pathology. Highly prevalent in African American and Asian populations due to hypertension burden. Pure vascular dementia is often less common than mixed AD-vascular pathology in older populations.

### Pathophysiology
VCI encompasses several distinct cerebrovascular mechanisms. Large vessel disease (cortical strokes) causes focal deficits and stepwise cognitive deterioration. Small vessel disease — the most common mechanism — produces lacunar infarcts and white matter hyperintensities (leukoaraiosis), generating a frontal-subcortical syndrome. Strategic infarcts in the thalamus, angular gyrus, or caudate produce disproportionate cognitive effects from small lesions. Cerebral amyloid angiopathy (CAA) — amyloid-beta deposits in superficial cortical and leptomeningeal vessels — causes lobar hemorrhages and cortical microbleeds. CAA is both a distinct entity and a common comorbidity with AD.

### Genetic and Modifiable Risk Factors
The modifiable vascular risk factors are the primary determinants: hypertension (the single most impactful and best-established modifiable factor), diabetes mellitus, atrial fibrillation, hyperlipidemia, smoking, obesity, and obstructive sleep apnea. Midlife hypertension substantially increases dementia risk both through direct cerebrovascular injury and by accelerating AD pathology.

The primary hereditary cause is CADASIL, caused by **NOTCH3** mutations (chromosome 19). This autosomal dominant condition causes diffuse thickening of small vessel walls. Characteristic MRI findings — white matter lesions with prominent involvement of the anterior temporal poles and external capsule — are highly specific and should prompt consideration even without a known family history. No traditional vascular risk factors are required for CADASIL to develop.

### Neuropsychological Profile
- **Core deficit — Frontal-subcortical pattern:** Executive dysfunction is the most prominent and early feature (planning, task initiation, set-shifting, cognitive flexibility)
- **Psychomotor slowing:** Reduced processing speed — one of the most sensitive early markers
- **Attention and working memory deficits**
- **Memory — retrieval deficit:** Recognition memory is relatively preserved; cued recall and recognition format improve performance; contrasts with the encoding failure of AD
- **Verbal fluency:** Category and letter fluency both reduced; often less asymmetric than in AD or FTD
- **Gait disturbance:** Often an early and prominent feature from periventricular white matter involvement — can predate or co-present with cognitive symptoms
- **Focal neurological signs:** May accompany cognitive impairment depending on lesion location

### Critical Considerations
A temporal relationship between a vascular event and cognitive change is an important diagnostic clue, but is often absent when the mechanism is cumulative small vessel disease — which can mimic gradual AD-like decline. Stepwise progression is characteristic of large vessel disease but not universal. Mixed AD-vascular pathology is extremely common in the elderly and the two conditions interact additively. Controlling blood pressure is the single most evidence-based intervention for both prevention and slowing of progression.

### Differential Diagnosis Considerations

| Compare To | Key Distinguishing Features of VaD | Key Distinguishing Features of the Other Condition |
|---|---|---|
| **AD** | Frontal-subcortical profile; preserved recognition memory; vascular MRI lesions (WMH, lacunae); stepwise progression; gait disturbance early | Encoding deficit (recognition AND recall impaired); hippocampal atrophy; gradual decline; gait preserved until late |
| **NPH** | Vascular lesion burden on MRI; gait does not improve with CSF drainage; incontinence related to vascular frontal dysfunction | Ventriculomegaly disproportionate to sulcal widening; magnetic gait improves with large-volume LP; Evans index >0.3 |
| **DLB** | Vascular MRI findings; no visual hallucinations; no RBD; no fluctuating cognition in the DLB sense | Visual hallucinations; attention fluctuations; RBD; parkinsonism; minimal vascular MRI burden |
| **PSP** | Vascular MRI burden; no vertical gaze palsy; no backward falls pattern | Vertical supranuclear gaze palsy (especially downward saccades); backward falls in year 1; midbrain atrophy (hummingbird sign) |

### Treatment
Aggressive management of vascular risk factors is the cornerstone. Blood pressure control, antiplatelet therapy (for non-cardioembolic ischemic stroke), anticoagulation (for atrial fibrillation), glycemic control, lipid management, and smoking cessation are all indicated. No pharmacological agents are specifically approved for vascular dementia cognition, though cholinesterase inhibitors show modest benefit, particularly in mixed AD+VaD. Cognitive rehabilitation and aerobic exercise have supporting evidence.

---

## 3. Lewy Body Disorders (DLB and PDD)

**Typical Age of Onset:** Mean onset in the 60s-70s. Parkinson's disease motor symptoms typically begin in the 60s, with dementia developing an average of 10-15 years later (PDD). DLB cognitive symptoms typically begin in the 70s. Male predominance for both PD and DLB.

### Epidemiology
DLB accounts for approximately 10-15% of all dementias and is the second most common neurodegenerative dementia after AD. Approximately 80% of people with PD develop dementia within 20 years of motor diagnosis. Lewy body disorders are systematically underdiagnosed — in part because of clinical complexity and overlap with other conditions.

### Pathophysiology
All Lewy body disorders share the same core pathology: misfolding and aggregation of alpha-synuclein (α-syn) into Lewy bodies (cytoplasmic inclusions of α-syn + ubiquitin + neurofilament) and Lewy neurites in axons. Pathology spreads in a prion-like manner between connected neurons — in PD, Braak PD staging begins in the olfactory bulb and dorsal vagal nucleus before reaching the brainstem dopaminergic nuclei and limbic/cortical regions. In DLB, pathology is more diffuse and cortically widespread from early stages. Cholinergic deficits (nucleus basalis of Meynert) are often more severe in DLB than in AD.

### Genetic and Modifiable Risk Factors
The most common genetic risk factor for both PD and DLB is **GBA** gene mutations (glucocerebrosidase, chromosome 1), which impair lysosomal function, reducing alpha-synuclein clearance and promoting aggregation. GBA heterozygous mutations increase PD/DLB risk approximately 5-10-fold.

**SNCA** (alpha-synuclein gene) duplications and triplications cause autosomal dominant PD/DLB through α-syn overproduction — a dose-response relationship. SNCA point mutations (A53T, A30P, E46K) cause familial parkinsonism.

**LRRK2** (leucine-rich repeat kinase 2) mutations are the most common single-gene cause of PD worldwide, with variable penetrance and variable age of onset.

**REM sleep behavior disorder (RBD):** Isolated RBD — acting out dreams without muscle atonia, confirmed polysomnographically — is a prodromal biomarker of synucleinopathy. Approximately 80% of individuals with isolated RBD develop a synucleinopathy within 10-15 years, reflecting early alpha-synuclein pathology in the pontine REM-atonia circuit (subcoeruleus area).

### Clinical Features (DLB Core Diagnostic Criteria)
**Fluctuating cognition:** Marked variation in alertness and attention; daytime somnolence; episodes of staring or transient confusion — waxing and waning within hours or days. **Recurrent visual hallucinations:** Well-formed, detailed (people, animals), often initially non-threatening. **REM sleep behavior disorder:** Acting out dreams, often predating dementia by years — one of the most specific prodromal biomarkers. **Parkinsonism:** Bradykinesia, rigidity, rest tremor — typically concurrent with or after cognitive onset.

The **1-year rule** distinguishes PDD from DLB: PDD = motor parkinsonism established at least 1 year before dementia onset. DLB = cognitive symptoms and parkinsonism within 1 year of each other.

### Neuropsychological Profile
- **Visuospatial/visuoperceptual dysfunction:** Among the earliest and most prominent features — figure copying, visual discrimination, mental rotation, and route navigation impaired early
- **Attention fluctuations:** Waxing and waning cognition (minutes to hours); episodes of confusion and daytime somnolence
- **Executive dysfunction:** Frontal systems involvement; working memory and verbal fluency reduced
- **Memory — retrieval deficit:** Recognition relatively preserved; contrasts with the encoding failure of AD; information was stored but retrieval is impaired
- **BPSD:** Recurrent well-formed visual hallucinations; paranoid delusions; RBD
- **Language:** Typically preserved until late stages
- **Key distinction:** Retrieval deficit (preserved recognition) vs. AD's encoding deficit (both free recall and recognition impaired)

### Critical Considerations
The most critical safety consideration is avoidance of dopamine D2-blocking agents. Typical antipsychotics and many atypical antipsychotics can precipitate life-threatening neuroleptic sensitivity reactions — acute parkinsonism, profound sedation, impaired consciousness, autonomic instability, and sudden death. Even a single dose of haloperidol can be fatal. Metoclopramide and prochlorperazine (common antiemetics) must also be avoided. If antipsychotic treatment is unavoidable, quetiapine (first choice) or clozapine (with hematological monitoring) are the only relatively safe options due to their low D2 affinity.

### Differential Diagnosis Considerations

| Compare To | Key Distinguishing Features of DLB/PDD | Key Distinguishing Features of the Other Condition |
|---|---|---|
| **AD** | Retrieval deficit (recognition relatively preserved); prominent early visuospatial impairment; attention fluctuations; visual hallucinations; parkinsonism; RBD; DAT scan abnormality | Encoding deficit (recognition AND recall both impaired); gait and behavior preserved early; no visual hallucinations or parkinsonism early |
| **PSP** | Visual hallucinations; attention fluctuations; RBD; less prominent downward gaze palsy; DLB parkinsonism more limb-predominant | Vertical supranuclear gaze palsy (especially downward saccades); axial rigidity and retrocollic posture; backward falls in year 1; no visual hallucinations |
| **PD (without dementia)** | Cognitive and psychiatric symptoms appear within 1 year of motor onset (DLB) or ≥1 year later (PDD) | Motor symptoms clearly precede cognitive symptoms by many years; tremor often more prominent; better levodopa response; less prominent early dementia |
| **VaD** | No significant vascular MRI burden; visual hallucinations; RBD; fluctuating cognition | Frontal-subcortical profile; vascular MRI lesions; no visual hallucinations; no RBD |
| **NPH** | Parkinsonism (rigidity, bradykinesia); visual hallucinations; no response to LP | Magnetic gait without rigidity; prominent incontinence; improves with CSF drainage |

### Treatment
Cholinesterase inhibitors (rivastigmine — FDA approved for PDD; also used for DLB) are particularly important given the profound cholinergic deficit — may improve cognition and reduce behavioral symptoms. Memantine has modest evidence. Levodopa cautiously for parkinsonism at lowest effective dose, as it may worsen hallucinations. Clonazepam or melatonin for RBD. Actively avoid all D2-blocking drugs including common antiemetics.

---

## 4. Frontotemporal Lobar Degeneration (FTLD)

**Typical Age of Onset:** Predominantly a young-onset dementia — the most common dementia in patients under 65. Mean onset for bvFTD and PPA variants is in the 50s-60s. Approximately 40% of FTD cases have a positive family history. C9orf72-associated FTD tends to onset in the 50s-60s; GRN-associated FTD typically onsets in the 60s-70s.

### Epidemiology
The second most common young-onset dementia (after AD) at ages 45-64. Approximately 15% of FTD patients develop concurrent ALS; approximately 15% of ALS patients develop FTD — reflecting overlapping genetic and molecular mechanisms.

### Clinical Subtypes
Behavioral variant FTD (bvFTD) presents with early behavioral and personality change — disinhibition, apathy, loss of empathy, hyperorality, stereotyped and perseverative behaviors, and executive dysfunction — with relatively preserved episodic memory in early stages. Semantic variant PPA (svPPA) presents with progressive loss of word meaning — fluent speech but profound anomia, loss of single-word comprehension, surface dyslexia, and eventually prosopagnosia from left anterior temporal lobe atrophy. Nonfluent/agrammatic variant PPA (nfvPPA) presents with effortful, apraxic speech, grammatical errors, and phonological paraphasias from left posterior frontal-insular pathology. FTD with motor neuron disease (FTD-MND) combines bvFTD features with upper and lower motor neuron signs.

### Pathophysiology
FTLD is pathologically heterogeneous. FTLD-TDP (~50% of cases): pathological TDP-43 inclusions, classified into Types A-E. FTLD-tau (~40%): 3R tau (Pick's disease), 4R tau (PSP, CBD), or mixed forms. FTLD-FUS (~5%): FUS protein inclusions, typically young-onset bvFTD.

### Genetic and Modifiable Risk Factors
Three major genetic causes account for the majority of familial FTLD. The **C9orf72** hexanucleotide (GGGGCC) repeat expansion (chromosome 9) is the most common cause of both familial FTD and familial ALS worldwide. The same mutation can cause pure FTD, pure ALS, or FTD-ALS overlap — even within the same family. C9orf72 FTD is associated with prominent psychiatric features including psychosis and anxiety, leading to frequent misdiagnosis as a primary psychiatric disorder. It produces FTLD-TDP pathology (Types B/C).

**GRN** (progranulin, chromosome 17) haploinsufficiency leads to loss of a neurotrophic and anti-inflammatory growth factor. GRN-associated FTD typically presents with an asymmetric cortical syndrome depending on hemisphere predominance. Parkinsonism features are common. Penetrance is approximately 90% by age 70.

**MAPT** (microtubule-associated protein tau, chromosome 17) mutations cause FTLD-tau directly by altering tau splicing or function. Clinical presentations vary widely — some resemble bvFTD, others resemble PSP or CBS. Parkinsonism is common. VCP mutations cause a rare syndrome combining FTD, ALS, inclusion body myopathy, and Paget's disease of bone.

### Neuropsychological Profile

**bvFTD:**
- **Social cognition — profoundly impaired (earliest and most discriminating feature):** Theory of mind, empathy, and emotion recognition are among the most sensitive markers
- **Executive dysfunction:** Poor planning, task initiation, set-shifting, and response inhibition
- **Memory — relatively spared early:** Hippocampus is often structurally preserved; episodic memory may be near-normal early in the course
- **Fluency pattern:** Phonemic (letter) fluency worse than semantic (category) — opposite of the AD pattern
- **Stereotyped and perseverative behaviors:** Echolalia, environmental dependency (reflexive interaction with nearby objects)
- **Insight:** Often severely impaired — patient unaware of behavioral change despite profound social dysfunction

**PPA variants:**
- **svPPA:** Profound anomia; loss of word meaning (single-word comprehension impaired); surface dyslexia; prosopagnosia; fluent but empty speech; left anterior temporal atrophy
- **nfvPPA:** Effortful, apraxic speech; agrammatism; phonological paraphasias; relatively preserved comprehension; left posterior frontal-insular atrophy

### Critical Considerations
FTD is frequently misdiagnosed — particularly bvFTD, which is often mistaken for primary psychiatric disorders (depression, bipolar disorder, OCD, schizophrenia), particularly when psychiatric features are prominent (as in C9orf72). The average delay from symptom onset to correct diagnosis in bvFTD is 3-4 years. Cholinesterase inhibitors and memantine have no established benefit in FTLD — the cholinergic deficit present in AD is absent in most FTD pathologies. SSRIs may reduce disinhibition, compulsive behaviors, and emotional lability.

### Differential Diagnosis Considerations

| Compare To | Key Distinguishing Features of bvFTD | Key Distinguishing Features of the Other Condition |
|---|---|---|
| **AD** | Behavioral and executive changes predominate with relatively preserved memory early; phonemic fluency worse than semantic; frontal-predominant atrophy; social cognition impaired | Memory failure is primary; semantic fluency worse than phonemic; hippocampal/posterior atrophy; social cognition and personality preserved early |
| **Psychiatric disorders** (depression, OCD, bipolar) | Insidious progressive course; objective neuropsychological deficits; neuroimaging showing frontal atrophy; increasingly poor functional capacity | Episodic course with periods of recovery; neuropsychological testing relatively intact; neuroimaging normal or non-specific; mood disorder history |
| **DLB** | No visual hallucinations or RBD; behavioral change rather than visuospatial dysfunction; frontal atrophy; minimal parkinsonism | Visual hallucinations; attention fluctuations; RBD; prominent early visuospatial impairment; parkinsonism |
| **PSP** | More prominent behavioral/personality change; less prominent backward falls and eye movement palsy early; TDP-43 or Pick pathology (not 4R tau in bvFTD) | Vertical gaze palsy (especially downward saccades); backward falls in year 1; axial rigidity; 4R tauopathy; less prominent behavioral disinhibition |

### Treatment
No disease-modifying treatments are available for any FTLD subtype. SSRIs (particularly sertraline, fluvoxamine) may reduce disinhibition, compulsive behaviors, and irritability. Antipsychotics should be used cautiously — avoid in those with tau pathology or parkinsonism. Speech-language therapy and augmentative communication for PPA variants. Genetic counseling is essential when a pathogenic C9orf72, GRN, or MAPT mutation is identified.

---

## 5. Huntington's Disease (HD)

**Typical Age of Onset:** Mean onset of motor symptoms is 35-44 years. Range is broad: juvenile HD (>60 CAG repeats) begins before age 21; late-onset HD (intermediate repeat lengths) may not manifest until age 60+. Psychiatric and cognitive symptoms often predate the motor diagnosis by years. CAG repeat length inversely predicts age of onset.

### Epidemiology
Prevalence is approximately 5-10 per 100,000 in Western populations. Autosomal dominant inheritance — 50% of offspring of an affected parent will develop HD. Invariably progressive and fatal; mean survival after motor symptom onset is approximately 15-20 years.

### Pathophysiology
Expanded CAG repeats in the HTT gene encode an abnormally long polyglutamine (polyQ) tract in huntingtin protein (mHTT). Mutant huntingtin misfolds and forms nuclear and cytoplasmic inclusions that disrupt transcription (CREB-mediated gene regulation), impair mitochondrial function, trigger apoptotic cascades, and spread pathology transneuronally. Striatal medium spiny neurons (MSNs) are selectively vulnerable — particularly D2-receptor-expressing indirect-pathway MSNs of the caudate nucleus. Loss of these neurons causes disinhibition of movement → chorea. The characteristic MRI finding is caudate head atrophy producing the "butterfly" or "boxcar" appearance of frontal horns.

### Genetic Risk Factors
Repeat length ranges: fewer than 36 CAG repeats is normal with no disease risk. Between 36 and 39 repeats constitutes the intermediate zone of reduced penetrance — these individuals may or may not develop HD during a normal lifespan. Forty or more repeats represents full penetrance — disease is certain; repeat length inversely predicts age of onset. More than 60 repeats causes juvenile HD (Westphal variant), which presents with rigidity, dystonia, bradykinesia, and seizures rather than chorea, and is transmitted predominantly by paternal inheritance.

Anticipation — expansion of CAG repeat length across generations — occurs preferentially through spermatogenesis (paternal transmission), producing earlier onset in successive generations with profound implications for genetic counseling.

### Neuropsychological Profile
- **Psychomotor slowing:** Reduced processing speed — among the earliest and most sensitive cognitive markers; pervasive and prominent
- **Executive dysfunction:** Impaired planning, mental flexibility, and verbal fluency (both letter AND category equally reduced — distinguishes from AD where category > letter)
- **Attention deficits:** Working memory and sustained attention impaired
- **Memory — retrieval deficit:** Recognition memory outperforms free recall; encoding is relatively preserved — contrasts with AD's encoding failure
- **Visuospatial impairment:** Present but secondary to processing speed and executive deficits
- **Language:** Relatively preserved until late stages; dysarthria from motor involvement
- **Psychiatric:** Depression most common (~40%); irritability and aggression; OCD; apathy; psychosis
- **Motor:** Choreiform movements (hands, fingers, tongue); oculomotor abnormalities (saccade initiation delay — an early motor sign); dysarthria; dysphagia; gait instability
- **Prodromal:** Psychomotor slowing, subtle executive deficits, and psychiatric symptoms (depression, irritability) predate clinical motor diagnosis by years

### Critical Considerations
Presymptomatic genetic testing is available for at-risk individuals (children of affected parents, 50% risk) but raises profound ethical and psychological issues — a positive test predicts an invariably fatal, currently incurable illness. International guidelines require comprehensive pre-test and post-test psychological counseling. The majority of at-risk individuals opt not to be tested. Testing of minors is generally not recommended unless there are exceptional circumstances.

### Differential Diagnosis Considerations

| Compare To | Key Distinguishing Features of HD | Key Distinguishing Features of the Other Condition |
|---|---|---|
| **PD** | Hyperkinesia (chorea) early rather than resting tremor and rigidity; onset in 30s-40s; autosomal dominant with 50% inheritance; caudate atrophy on MRI | Resting tremor (pill-rolling); bradykinesia and rigidity; onset in 60s+; excellent sustained levodopa response |
| **Drug-induced chorea** | Progressive course with cognitive/psychiatric decline; caudate atrophy; positive CAG repeat genetic test | Choreiform movements without progressive dementia; antidopaminergic medication exposure; resolves or stabilizes with medication change |
| **bvFTD** | Motor signs (chorea, oculomotor abnormalities) accompany behavioral change; genetic basis (CAG expansion); subcortical dementia pattern | Behavioral change without movement disorder until late; frontal atrophy; TDP-43, tau, or FUS pathology |
| **Wilson's disease** | No Kayser-Fleischer rings; no liver disease; normal serum ceruloplasmin; CAG repeat positive | Presents in teens-30s; Kayser-Fleischer rings; hepatic dysfunction; copper accumulation; treatable with chelation |

### Treatment
No disease-modifying treatments are currently approved. VMAT2 inhibitors (tetrabenazine, valbenazine, deutetrabenazine) reduce striatal dopamine release, reducing chorea. SSRIs and SNRIs for depression and irritability. Quetiapine (preferred) for psychosis and severe psychiatric symptoms. Physical therapy for gait and balance; speech therapy for dysarthria and dysphagia. Genetic counseling for all family members with an identified mutation.

---

## 6. Progressive Supranuclear Palsy (PSP)

**Typical Age of Onset:** Almost exclusively a disease of older adults — mean onset is 63-65 years. PSP essentially never begins before age 50. Male predominance (~60%). Survival after symptom onset averages 5-7 years for PSP-Richardson syndrome (the classic form).

### Epidemiology
PSP is the most common atypical parkinsonian disorder — affecting approximately 5-6 per 100,000 people. It is substantially underdiagnosed, with many patients initially diagnosed with Parkinson's disease, NPH, or stroke. Sporadic in virtually all cases.

### Pathophysiology
PSP is a **4R tauopathy** — tau protein with preferential 4-repeat (4R) isoform deposition, distinct from the mixed 3R+4R of AD. Tau aggregates accumulate in neurons as globose neurofibrillary tangles, and in glia as tuft-shaped astrocytes (characteristic of PSP) and coiled bodies. Pathology concentrates in the midbrain tegmentum, substantia nigra, subthalamic nucleus, globus pallidus, dentate nucleus of the cerebellum, and brainstem reticular formation.

Midbrain atrophy produces the **hummingbird sign** (also called the penguin sign) on sagittal MRI: atrophied midbrain resembles a hummingbird with the preserved pons as the body. The **morning glory sign** reflects reduced cross-sectional midbrain area on axial imaging. Disruption of superior colliculi and their vertical gaze center connections → impaired downward vertical saccades. Substantia nigra degeneration → parkinsonism unresponsive to levodopa. Subthalamic nucleus degeneration → postural instability.

### Clinical Features
PSP-Richardson syndrome — the classic form — presents with:

**Vertical supranuclear gaze palsy**, particularly impaired downward saccades — the most specific early sign. Patients have difficulty reading, going down stairs, and eating. The term "supranuclear" means the deficit is above the oculomotor nuclei — the vestibuloocular reflex (doll's eye) may initially overcome the palsy, confirming CN III is intact. Eventually both upward and downward saccades are lost.

**Postural instability with unexplained backward falls**, often in the first year of disease. Patients fall backward without warning or attempted correction. Backward falls in the first 1-2 years of a parkinsonian syndrome are a red flag for PSP.

**Axial rigidity** — predominantly neck and trunk rather than limbs. Characteristic rigid erect or retrocollic (neck extended backward) posture — contrasting with the stooped flexion of PD.

**Frontal-subcortical dementia** — executive dysfunction, apathy, and reduced verbal fluency dominate. Episodic memory is less impaired than in AD.

**Pseudobulbar palsy** — dysarthria (harsh, strained, low-volume), dysphagia, and emotional incontinence.

PSP variants include: PSP-parkinsonism (PSP-P, resembles PD closely); PSP-pure akinesia with gait freezing (PAGF); PSP-CBS (overlap with corticobasal syndrome); PSP-progressive nonfluent aphasia; PSP-frontal.

### Genetic and Modifiable Risk Factors
PSP is sporadic in nearly all cases. A common haplotype in the **MAPT** gene (H1 haplotype, particularly H1c) is a genetic susceptibility factor — not a causative mutation. No other confirmed genetic causes have been established for sporadic PSP, and there are no known modifiable risk factors.

### Neuropsychological Profile
- **Executive dysfunction:** Poor planning, mental inflexibility, perseveration — among the most prominent cognitive features
- **Apathy:** Often severe; one of the most prominent and early behavioral features; may be mistaken for depression
- **Psychomotor slowing:** Reduced processing speed; bradyphrenia
- **Verbal fluency:** Both letter and category reduced
- **Memory — retrieval deficit:** Recognition relatively preserved; free recall impaired; distinct from AD's encoding failure
- **Language:** Vocabulary and syntax preserved; speech is dysarthric and prosodically flat; emotional incontinence (pseudobulbar affect)
- **Social cognition:** Some impairment in theory of mind and emotion recognition, but less profound than in bvFTD
- **Insight:** Often relatively preserved early

### Critical Considerations
PSP is almost always levodopa-unresponsive or only minimally and transiently responsive — this is a critical diagnostic clue. Failure to respond to adequate levodopa trials (1,000 mg/day for at least 3 months) in a patient with parkinsonism should raise suspicion for PSP, CBD, or MSA. Dysphagia in PSP is severe and a leading cause of aspiration pneumonia — the primary cause of death. Prism glasses can partially compensate for the gaze palsy. Botulinum toxin may help focal dystonia.

### Differential Diagnosis Considerations

| Compare To | Key Distinguishing Features of PSP | Key Distinguishing Features of the Other Condition |
|---|---|---|
| **PD** | Backward falls in year 1; vertical gaze palsy (especially downward saccades); axial rigidity with retrocollic posture; levodopa non-response; no resting tremor (typically) | Resting tremor (pill-rolling); flexed posture; excellent sustained levodopa response; gait freezing and falls emerge later; eye movements preserved until late |
| **NPH** | Vertical gaze palsy; axial rigidity; levodopa non-response; no improvement with CSF drainage | Magnetic gait without rigidity; prominent incontinence; ventriculomegaly on MRI; improves with large-volume LP |
| **DLB** | No visual hallucinations; no RBD; no attention fluctuations; backward falls and downward gaze palsy | Visual hallucinations; attention fluctuations; RBD; limb-predominant (not axial) parkinsonism; DAT scan abnormality |
| **CBS** | More symmetric presentation; vertical gaze palsy present; axial rigidity predominant; no alien limb | Asymmetric presentation; alien limb phenomenon; ideomotor apraxia; cortical sensory loss; more asymmetric cortical atrophy |
| **bvFTD** | Gaze palsy (especially downward saccades); backward falls; axial rigidity; 4R tauopathy | More prominent disinhibition and behavioral change; less prominent motor features early; TDP-43/Pick pathology more common than 4R tau |

### Treatment
No disease-modifying treatments exist. Levodopa trials should be attempted — continue only if there is meaningful response. Physical therapy with intensive balance training reduces fall risk. Weighted walkers can compensate for backward fall tendency. Speech therapy and modified diet textures for dysphagia. Feeding tube consideration when aspiration risk becomes high. Prism glasses for gaze palsy compensation. Careful fall prevention is critical throughout.

---

## 7. Normal Pressure Hydrocephalus (NPH)

**Typical Age of Onset:** Idiopathic NPH almost exclusively affects adults over 60, with prevalence increasing substantially after 70. Secondary NPH (from SAH, meningitis, or trauma) can affect younger adults if the precipitating event occurs earlier.

### Epidemiology
Prevalence of approximately 3-4% in those over 65 with cognitive impairment. Substantially under-recognized and under-treated, despite its potential reversibility making it one of the few treatable causes of dementia. Idiopathic NPH has no identified cause; secondary NPH follows a specific precipitating event.

### Pathophysiology
Impaired CSF reabsorption at the arachnoid granulations — despite normal CSF opening pressure (≤20 cmH₂O on LP) — leads to ventricular enlargement. The enlarged ventricles stretch and compress periventricular white matter tracts, particularly those connecting the frontal cortex to the basal ganglia, thalamus, and spinal cord. This explains the frontal-subcortical cognitive syndrome, gait apraxia, and bladder dysfunction.

### Genetic and Modifiable Risk Factors
No specific genetic causes have been identified for idiopathic NPH. Prior subarachnoid hemorrhage, meningitis, head trauma, cardiac surgery, and aqueductal stenosis are associated with secondary NPH.

### Clinical Features (Hakim-Adams Triad)
**Gait disturbance** (most prominent and typically earliest): magnetic or apraxic gait — short shuffling steps, wide-based, difficulty initiating walking (freezing), en-bloc turning, frequent unexplained falls. The patient appears as if their feet are "stuck to the floor." Resembles parkinsonism but without resting tremor or rigidity.

**Urinary incontinence:** Frontal disinhibition of bladder control. Urgency typically precedes frank incontinence.

**Cognitive impairment:** Frontal-subcortical pattern — generally less severe than memory-predominant dementias.

Diagnostic workup: MRI showing ventriculomegaly disproportionate to sulcal widening (Evans index >0.3) and DESH pattern (disproportionately enlarged subarachnoid spaces in high convexity/parasagittal region). Large-volume LP (30-50 mL removal) with gait assessment before and after — improvement predicts shunt response.

### Neuropsychological Profile
- **Executive dysfunction:** Working memory, planning, mental flexibility, and processing speed — all reduced
- **Psychomotor slowing (bradyphrenia):** A prominent and early feature
- **Attention and concentration deficits**
- **Memory — retrieval deficit:** Improves with cues and recognition format; notably less severe than in AD
- **Language:** Relatively preserved
- **Apathy:** Prominent; depression common
- **Potentially reversible:** All three triad components (gait, cognition, incontinence) can improve with VP shunting — gait improvement is most robust and rapid; cognitive improvement develops over months

### Critical Considerations
NPH is frequently misdiagnosed as AD, PD, or depression. The key distinguishing feature is that gait disturbance is prominent and often presents concurrently with or even before significant cognitive impairment — whereas in AD, gait is typically preserved until late stages. The magnetic gait may be confused with parkinsonian gait, but NPH lacks resting tremor, rigidity, and bradykinesia beyond the gait itself. Response to a large-volume LP tap test — measurably better gait after removing 30-50 mL of CSF — is the most practical bedside predictor of shunt response.

### Differential Diagnosis Considerations

| Compare To | Key Distinguishing Features of NPH | Key Distinguishing Features of the Other Condition |
|---|---|---|
| **AD** | Gait apraxia and incontinence are early and prominent, disproportionate to cognitive impairment; MRI shows ventriculomegaly; improves with CSF drainage | Gait preserved until late stages; memory (encoding failure) is primary; hippocampal atrophy on MRI; no improvement with LP |
| **PD** | Magnetic gait without resting tremor or rigidity; no levodopa response; improves with LP | Resting tremor; bradykinesia and rigidity; flexed posture; excellent sustained levodopa response; gait freezing does not improve with LP |
| **VaD** | Ventriculomegaly disproportionate to sulcal widening; improves with LP; less prominent WM lesion burden than VaD | Periventricular WM lesion burden drives cognitive profile; gait does not improve with CSF drainage; vascular risk factor history |
| **Depression** | Gait apraxia and incontinence are not features of depression; ventriculomegaly on MRI | Psychomotor slowing without gait apraxia; subjective memory complaints disproportionate to objective findings; normal MRI |

### Treatment
Ventriculoperitoneal (VP) shunting is the primary treatment. Gait improvement is most robust and occurs within days to weeks. Cognitive improvement typically requires months. Programmable valves allow post-operative pressure adjustment without re-operation. Large-volume LP serves as both a diagnostic tap test and temporary symptom relief.

---

## 8. Traumatic Brain Injury (TBI) and Chronic Traumatic Encephalopathy (CTE)

**Typical Age of Onset:** TBI occurs across the lifespan — falls are the leading cause in the elderly (>75 years, highest mortality) while sports-related and assault-related TBI peak in adolescents and young adults. CTE symptom onset is typically in the 40s-70s, decades after the period of head trauma exposure.

### Epidemiology
Approximately 2.8 million TBI-related emergency department visits, hospitalizations, and deaths occur annually in the US. Falls account for the majority in the elderly; motor vehicle accidents, sports, and assault are leading causes in younger people. Mild TBI (concussion) accounts for 75-90% of all TBIs. CTE is diagnosed exclusively at autopsy.

### Pathophysiology
**Primary injury:** Mechanical forces produce diffuse axonal injury (DAI) — axonal shearing at gray-white matter junctions from rotational acceleration-deceleration — and focal contusions (temporal and frontal poles most vulnerable).

**Secondary injury** (minutes to days): Excitotoxicity from glutamate release, ionic imbalance, mitochondrial dysfunction, free radical production, blood-brain barrier breakdown, neuroinflammation, and cerebral edema.

**CTE:** Repetitive subconcussive and concussive impacts cause repetitive axonal injury → tau accumulation beginning perivascularly at the depths of cortical sulci (the hallmark distribution). This 4R+3R mixed tau pathology spreads progressively. CTE is definitively diagnosed only at autopsy.

### Genetic and Modifiable Risk Factors
**APOE ε4** is associated with worse cognitive outcome after TBI and may accelerate CTE-related tau accumulation. Number and severity of cumulative head impacts — not just diagnosed concussions — is the primary risk factor for CTE. Second impact syndrome — a second concussion before complete recovery from the first — can cause catastrophic, rapidly fatal cerebral edema in young athletes through loss of cerebrovascular autoregulation.

### Neuropsychological Profile

**Mild TBI (acute and post-concussion):**
- Attention, concentration, and working memory — most sensitive
- Processing speed slowing
- Memory consolidation difficulties
- Typically resolves within days to weeks; persistent symptoms >3 months = post-concussion syndrome (PCS)
- PCS strongly influenced by biopsychosocial factors (anxiety, sleep disruption, premorbid functioning, expectations)

**Moderate-Severe TBI:**
- Executive dysfunction — frontal systems most vulnerable to diffuse axonal injury
- Processing speed severely reduced
- Learning and memory impairment
- Behavioral dysregulation: impulsivity, emotional lability, poor self-regulation
- Anosognosia (reduced awareness of one's own deficits) common after frontal injury
- Depression, anxiety, irritability, PTSD common

**CTE (clinical, before death):**
- Behavioral and mood changes (irritability, impulsivity, depression, suicidality) — typically precede cognitive decline
- Cognitive decline: executive function, memory
- Motor symptoms (parkinsonism, ataxia) emerge in later stages

### Critical Considerations
CTE cannot be diagnosed during life with current clinical or imaging tools — plasma p-tau217 and tau PET are under investigation as potential antemortem biomarkers but are not yet validated for clinical use. Second impact syndrome is a neurosurgical emergency — any suspected second concussion before full recovery from the first warrants immediate removal from activity. The graduated return-to-play (RTP) protocol requires complete symptom resolution at rest before initiating stepwise activity progression.

### Differential Diagnosis Considerations

| Compare To | Key Distinguishing Features of TBI/CTE | Key Distinguishing Features of the Other Condition |
|---|---|---|
| **AD** | History of significant head trauma; younger age of onset (relative to sporadic AD); prominent behavioral/mood symptoms early; executive-first cognitive profile; CTE confirmed only at autopsy | Encoding deficit (recognition and recall both impaired); older age of onset; positive AD biomarkers (A/T/N); hippocampal atrophy; no trauma history required |
| **bvFTD** | Clear trauma exposure history; behavioral changes in context of known TBI/CTE; motor features (parkinsonism) in later CTE stages | Progressive course without trauma history; frontal-temporal atrophy; TDP-43/tau/FUS pathology; FTD genetic mutations in familial cases |
| **PTSD** | Specific objective cognitive deficits on neuropsychological testing (processing speed, executive function); structural brain changes on MRI in moderate-severe TBI | Intrusive re-experiencing, hypervigilance, avoidance behaviors; no specific structural brain pathology on standard MRI; responds to trauma-focused psychotherapy |
| **Depression** | Documented TBI event; objective neuropsychological deficits; anosognosia (impaired self-awareness); structural MRI changes | Mood disorder without TBI history; subjective complaints disproportionate to objective testing; normal brain MRI; responds to antidepressants |

### Treatment
**Acute TBI:** Symptom management, graduated rest then graduated return to activity, avoid NSAIDs acutely, manage ICP in severe TBI. **Post-concussion syndrome:** Graduated aerobic exercise (accelerates recovery — NOT complete rest); cognitive rehabilitation; treat mood, sleep, and headache comorbidities. **Moderate-severe TBI:** Inpatient rehabilitation, cognitive rehabilitation, vocational rehabilitation. **CTE:** No disease-modifying treatment; symptomatic management of mood and behavioral dysregulation; prevention through rule changes and improved protective equipment.

---

## 9. Prion Diseases

**Typical Age of Onset:** Sporadic CJD: median onset in the 60s. Familial CJD (PRNP mutations): onset may be earlier depending on the specific mutation. Variant CJD (vCJD): distinctive for its young age of onset (mean ~28 years, range 12-74).

### Epidemiology
Extremely rare: approximately 1-2 cases per million per year (CJD). Sporadic CJD accounts for ~85% of all prion disease; familial CJD ~10-15%; variant CJD has affected fewer than 250 people worldwide. All forms are invariably fatal.

### Pathophysiology
Normal prion protein (PrPc) is converted by misfolded PrPsc (scrapie form) into more PrPsc in a self-propagating cascade. PrPsc is protease-resistant, accumulates, and causes spongiform degeneration — vacuolation of the neuropil. The PRNP gene (chromosome 20) has polymorphisms that influence susceptibility: all vCJD cases have been homozygous Met/Met at codon 129.

### Clinical Features by Form
**Sporadic CJD:** Median survival 4-6 months; >90% die within 1 year. Subacute progressive dementia (weeks-months), cerebellar ataxia, myoclonus (often startle-sensitive), cortical visual disturbances, akinetic mutism terminally. Biomarkers: CSF 14-3-3 protein, RT-QuIC assay (high specificity), MRI DWI cortical ribboning and basal ganglia/thalamic hyperintensities, EEG periodic sharp wave complexes (PSWC, 1-2 Hz).

**Variant CJD:** Younger age (~28 years mean), psychiatric onset (depression, personality change) before dementia, painful dysesthesias, pulvinar sign on MRI (bilateral thalamic hyperintensity). Slower progression (~14 months median). Prion detectable in lymphoid tissue (tonsil biopsy).

**Fatal Familial Insomnia (FFI):** PRNP mutation — selectively destroys thalamic nuclei → progressive untreatable insomnia, autonomic failure, and death.

### Neuropsychological Profile
- **Rapid multi-domain cognitive decline:** Weeks to months — the most compressed trajectory of any dementia
- **Memory impairment:** Anterograde and retrograde; part of a global cognitive collapse rather than isolated amnesia
- **Visuospatial dysfunction:** Cortical visual disturbances early; may resemble PCA
- **Cerebellar signs:** Ataxia — uncommon as a primary presenting feature in other dementias
- **Myoclonus:** Startle-sensitive; present in the majority — a key distinguishing clinical feature
- **Akinetic mutism:** Terminal state — profound cognitive and behavioral withdrawal
- **No classic neuropsychological profile opportunity:** Progression is typically too rapid for staged neuropsychological characterization

### Critical Considerations
CJD is a reportable disease and must be handled with strict infection control precautions — prions are resistant to standard autoclaving, alcohol, formalin, and UV radiation. Surgical instruments exposed to high-risk CJD tissue require special decontamination protocols. Early diagnosis is important for appropriate infection control and family counseling, though no treatment alters prognosis. Autoimmune encephalitis (anti-NMDAR, anti-LGI1, etc.) is a critical reversible differential that must be excluded early — it can cause rapid cognitive decline with psychiatric features and is treatable.

### Differential Diagnosis Considerations

| Compare To | Key Distinguishing Features of CJD | Key Distinguishing Features of the Other Condition |
|---|---|---|
| **AD** | Progression in weeks-months (not years); myoclonus; cerebellar ataxia; cortical ribboning on DWI; 14-3-3/RT-QuIC positive | Progression over years to decades; no myoclonus or ataxia early; gradual slope; positive amyloid/tau biomarkers; normal DWI early |
| **DLB** | Myoclonus; cerebellar ataxia; no RBD; cortical ribboning on DWI; no sustained visual hallucinations; progression in months | Visual hallucinations; RBD; parkinsonism; fluctuating cognition over months-years; normal or DWI-normal early |
| **Autoimmune encephalitis** | Prion-specific biomarkers (RT-QuIC); no inflammatory CSF (or mild only); no autoantibodies; irreversible | Positive autoantibody panel (anti-NMDAR, anti-LGI1, etc.); inflammatory CSF; responds to immunotherapy; potentially reversible — must be excluded urgently |
| **Metabolic encephalopathy** | Progressive deterioration without fluctuation; structural MRI findings on DWI; prion biomarkers positive | Fluctuating delirium related to a systemic precipitant (electrolytes, hepatic failure, thyroid); resolves with treatment of underlying cause; normal DWI |`;

  const result = await db.update(studyGuidesTable)
    .set({ content: sgContent })
    .where(eq(studyGuidesTable.topicId, TOPIC_ID))
    .returning();

  console.log(`  ✓ Study guide updated (id=${result[0]?.id})`);
  console.log("\n✅ Formatting update complete — bullets for NP profiles, tables for differential diagnosis.");
}

update().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
