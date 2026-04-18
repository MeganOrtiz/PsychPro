import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  topicsTable, flashcardsTable, quizQuestionsTable,
  studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable,
} from "./schema";

const TOPIC_ID = 15;

async function rework() {
  console.log("Reworking Neurocognitive Disorders (topic 15)...");

  // --- CLEAR EXISTING DATA ---
  const exams = await db.select({ id: practiceExamsTable.id }).from(practiceExamsTable).where(eq(practiceExamsTable.topicId, TOPIC_ID));
  for (const e of exams) {
    await db.delete(practiceExamQuestionsTable).where(eq(practiceExamQuestionsTable.examId, e.id));
  }
  await db.delete(practiceExamsTable).where(eq(practiceExamsTable.topicId, TOPIC_ID));
  await db.delete(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, TOPIC_ID));
  await db.delete(flashcardsTable).where(eq(flashcardsTable.topicId, TOPIC_ID));
  await db.delete(studyGuidesTable).where(eq(studyGuidesTable.topicId, TOPIC_ID));
  console.log("  ✓ Cleared old data");

  // Update topic description
  await db.update(topicsTable).set({
    description: "Comprehensive overview of major and minor neurocognitive disorders — Alzheimer's disease, vascular dementia, Lewy body disorders, FTD, Huntington's disease, NPH, TBI/CTE, and prion diseases — covering epidemiology, pathophysiology, genetics, staging, neuropsychological profiles, and treatment."
  }).where(eq(topicsTable.id, TOPIC_ID));

  // --- FLASHCARDS ---
  const flashcards = [
    // ===== MCI & Classification =====
    { question: "What is the DSM-5 distinction between minor and major neurocognitive disorder?", answer: "Minor NCD (Mild Cognitive Impairment): modest cognitive decline (~1-2 SD below normative mean on testing) that does NOT impair functional independence — patient compensates with effort, strategies, or extra time. Major NCD (Dementia): substantial cognitive decline (typically >2 SD) with impairment in functional independence — assistance is required with everyday activities. Both require documented decline from a prior level of performance.", difficulty: "medium" },
    { question: "What are the four subtypes of MCI and what are their rates of progression?", answer: "1) Amnestic MCI single-domain (memory only): highest risk for AD progression (~15%/year). 2) Amnestic MCI multi-domain: elevated risk for AD. 3) Non-amnestic MCI single-domain: may progress to FTD, DLB, or VaD depending on domain affected. 4) Non-amnestic MCI multi-domain: elevated risk for VaD or DLB. ~10-15% of MCI patients progress to dementia per year; ~15% revert to normal in any given year.", difficulty: "hard" },
    // ===== Alzheimer's Disease =====
    { question: "What are the two core neuropathological hallmarks of Alzheimer's disease?", answer: "1) Amyloid plaques (neuritic/senile plaques): extracellular deposits of aggregated amyloid-beta (Aβ42) peptide — Aβ is derived from cleavage of amyloid precursor protein (APP) by β-secretase and γ-secretase (presenilin complex). 2) Neurofibrillary tangles (NFTs): intraneuronal accumulations of hyperphosphorylated tau protein that has detached from microtubules and paired into helical filaments.", difficulty: "medium" },
    { question: "What is the amyloid cascade hypothesis of Alzheimer's disease?", answer: "The amyloid cascade hypothesis proposes that accumulation of amyloid-beta (Aβ42) is the initiating event in AD pathogenesis. Aβ42 oligomers (the most neurotoxic form) disrupt synaptic function → trigger tau hyperphosphorylation → neuroinflammation (microglial activation, astrocyte reactivity) → synaptic loss and neuronal death. The hypothesis is supported by familial AD genetics (APP, PSEN1/2 mutations all increase Aβ42 production or reduce clearance).", difficulty: "hard" },
    { question: "What is the APOE ε4 allele and how does it affect Alzheimer's risk?", answer: "APOE ε4 (chromosome 19) is the most significant genetic risk factor for sporadic AD. One copy increases risk ~3x; two copies increase risk ~8-12x. APOE ε4 impairs Aβ clearance (reduces glymphatic and CSF-mediated Aβ removal), promotes tau hyperphosphorylation, accelerates neuroinflammation, and impairs lipid metabolism in neurons. APOE ε2 is protective (~40% reduced risk vs ε3). APOE ε3 is neutral.", difficulty: "hard" },
    { question: "What are the three autosomal dominant genes causing familial early-onset Alzheimer's disease?", answer: "1) PSEN1 (presenilin-1, chromosome 14): Most common FAD gene; >400 mutations; onset typically 30s-50s; alters γ-secretase → increased Aβ42:Aβ40 ratio. 2) PSEN2 (presenilin-2, chromosome 1): Rarer; slightly later onset than PSEN1. 3) APP (amyloid precursor protein, chromosome 21): Mutations near β- and γ-secretase cleavage sites → overproduction of Aβ42. Also explains why Down syndrome (trisomy 21, 3 APP copies) causes AD pathology by age 40.", difficulty: "hard" },
    { question: "What is Braak staging of Alzheimer's disease?", answer: "Braak staging describes the stereotyped spread of neurofibrillary tau pathology in AD: Stages I-II (transentorhinal): NFTs confined to the entorhinal cortex and perirhinal cortex → earliest memory impairment (EC is the gateway to hippocampal memory encoding). Stages III-IV (limbic): NFTs spread to hippocampus, amygdala, basal forebrain → overt amnestic syndrome. Stages V-VI (neocortical): NFTs in association neocortex → all cognitive domains affected, full dementia.", difficulty: "hard" },
    { question: "What is the characteristic neuropsychological profile of Alzheimer's disease?", answer: "AD typically presents with: Prominent episodic memory impairment — encoding deficit (rapid forgetting, failure to benefit from cues/recognition) reflecting hippocampal pathology. Early: Anterograde amnesia, anomia (word-finding), topographic disorientation. Middle: Visuospatial decline, impaired executive function, acalculia. Late: Language breakdown, apraxia, agnosia, loss of ADLs. Key distinction: AD amnesia is an encoding deficit (poor free recall AND poor recognition) — unlike subcortical disorders where recognition is relatively preserved.", difficulty: "hard" },
    { question: "What is the A/T/N biomarker framework for Alzheimer's disease?", answer: "The NIA-AA 2018 framework allows biological staging independent of clinical symptoms: A (Amyloid): CSF Aβ42 decreased (trapped in plaques); Amyloid PET positive. T (Tau): CSF phospho-tau elevated; Tau PET positive (flortaucipir). N (Neurodegeneration): FDG-PET hypometabolism (temporoparietal pattern); MRI atrophy (hippocampus, entorhinal cortex). A+/T+/N+ = full AD biology. A-/T-/N- = normal AD biology. A+/T-/N- = Alzheimer's pathological change only.", difficulty: "hard" },
    { question: "What pharmacological treatments are approved for Alzheimer's disease and what do they do?", answer: "1) Cholinesterase inhibitors (e.g., donepezil, rivastigmine, galantamine): Inhibit acetylcholinesterase → increase synaptic ACh — compensating for cholinergic neuron loss from the nucleus basalis of Meynert. Approved for mild-moderate (donepezil also for severe) AD. Modest symptomatic benefit; do not alter disease course. 2) Memantine: NMDA receptor antagonist — blocks excessive glutamate-mediated excitotoxicity. Approved for moderate-severe AD. 3) Anti-amyloid immunotherapies (lecanemab, donanemab): Monoclonal antibodies that clear Aβ plaques — FDA approved with demonstrated slowing of decline in early AD; risk of ARIA (amyloid-related imaging abnormalities).", difficulty: "hard" },
    // ===== Vascular Dementia =====
    { question: "What is vascular cognitive impairment (VCI) and what causes it?", answer: "VCI is the spectrum of cognitive disorders caused by cerebrovascular disease — from minor VCI to major vascular dementia (VaD). Second most common cause of dementia (~15-20% of cases). Causes: large vessel disease (cortical strokes), small vessel disease (lacunar infarcts in basal ganglia, thalamus, white matter — hypertensive arteriopathy), strategic infarcts (thalamus, angular gyrus — small lesions causing disproportionate cognitive impact), cerebral amyloid angiopathy (CAA — amyloid deposits in vessel walls → lobar hemorrhages, white matter disease).", difficulty: "medium" },
    { question: "What is the characteristic neuropsychological profile of vascular dementia?", answer: "VaD typically shows a frontal-subcortical pattern: prominent executive dysfunction (planning, initiation, set-shifting), psychomotor slowing, attention and processing speed deficits, and gait disturbance — with relatively preserved memory (retrieval deficit more than encoding). Stepwise progression (each stroke/infarct adds a step) vs. gradual decline in AD. Temporal relationship to vascular event is a hallmark. Focal neurological signs often present.", difficulty: "hard" },
    { question: "What is CADASIL and why is it clinically important?", answer: "CADASIL (Cerebral Autosomal Dominant Arteriopathy with Subcortical Infarcts and Leukoencephalopathy) is caused by NOTCH3 mutations — the most common hereditary cerebral small vessel disease. Clinical features: early-onset migraine with aura, recurrent subcortical strokes (lacunar), progressive subcortical dementia, and psychiatric features (depression). MRI: characteristic white matter lesions in the anterior temporal poles and external capsule. Occurs in the absence of traditional vascular risk factors.", difficulty: "hard" },
    // ===== Lewy Body Disorders =====
    { question: "What is the pathological basis of Lewy body disorders?", answer: "Lewy body disorders (Parkinson's disease, PD dementia, DLB) share the same core pathology: alpha-synuclein misfolding and aggregation → forms Lewy bodies (cytoplasmic inclusions of aggregated α-syn + ubiquitin + neurofilament) and Lewy neurites. α-Synuclein pathology spreads in a prion-like manner. In PDD, pathology predominantly begins in brainstem (Braak PD staging). In DLB, pathology is more diffuse/neocortical from early stages.", difficulty: "hard" },
    { question: "What are the four core clinical features of dementia with Lewy bodies (DLB)?", answer: "1) Fluctuating cognition (with pronounced variations in attention and alertness — 'clouding' episodes). 2) Recurrent well-formed visual hallucinations (typically vivid, detailed — animals, people). 3) REM sleep behavior disorder (RBD) — acting out dreams, often precedes dementia by years. 4) Parkinsonism (bradykinesia, rigidity, rest tremor — usually after cognitive decline, unlike PD). Two core features = probable DLB; one = possible DLB. Plus supportive: severe neuroleptic sensitivity (can cause life-threatening reactions), DAT scan abnormality, low MIBG cardiac scintigraphy.", difficulty: "hard" },
    { question: "What is the distinction between Parkinson's disease dementia (PDD) and dementia with Lewy bodies (DLB)?", answer: "The primary distinction is the temporal relationship between motor and cognitive symptoms — the '1-year rule': PDD: Parkinson's motor symptoms clearly precede cognitive decline by ≥1 year. DLB: Cognitive symptoms and parkinsonism occur within 1 year of each other (or cognition first). Both share Lewy body pathology. PDD: More posterior cortical + frontal-subcortical involvement. DLB: Often more widespread early cortical involvement. Practically, they represent a disease spectrum (Lewy body disease).", difficulty: "hard" },
    { question: "What is the neuropsychological profile of DLB/PDD?", answer: "DLB/PDD shows prominent: Visuospatial dysfunction (one of the most prominent early features — copying figures, visual perception, navigation). Attention fluctuation (vigilance deficits, episodes of confusion). Executive dysfunction (frontal). Memory: typically retrieval deficit more than encoding (unlike AD) — recognition relatively preserved. Hallucinations tied to visual cortex involvement. Motor features: bradykinesia, rigidity, gait impairment. REM sleep behavior disorder often predates cognitive symptoms by years.", difficulty: "hard" },
    { question: "Why are antipsychotic medications dangerous in DLB/PDD?", answer: "Patients with DLB/PDD have severe dopaminergic deficit in the striatum AND reduced D2/D3 receptor expression. Typical and most atypical antipsychotics block dopamine D2 receptors → can precipitate severe neuroleptic sensitivity reaction in DLB/PDD: acute parkinsonism, sedation, altered consciousness, autonomic instability, and sudden death risk. Avoid all dopamine-blocking agents. If antipsychotics are needed for severe psychosis, quetiapine or clozapine (which have minimal D2 blockade) are preferred.", difficulty: "hard" },
    // ===== FTD =====
    { question: "What are the three main clinical subtypes of frontotemporal lobar degeneration?", answer: "1) Behavioral variant FTD (bvFTD): Early behavioral/personality change — disinhibition, apathy, loss of empathy, hyperorality, stereotyped/perseverative behaviors; executive dysfunction prominent; memory relatively spared early. 2) Semantic variant PPA (svPPA): Loss of word meaning (semantic knowledge) — fluent speech with profound anomia, single-word comprehension loss, surface dyslexia; left anterior temporal lobe. 3) Nonfluent/Agrammatic variant PPA (nfvPPA): Effortful, apraxic speech, agrammatism, phonological errors; left posterior frontal-insular.", difficulty: "hard" },
    { question: "What are the molecular pathologies underlying frontotemporal lobar degeneration?", answer: "FTLD is pathologically heterogeneous: FTLD-TDP (most common, ~50%): TDP-43 protein inclusions — Types A-E with different distributions and clinical correlates. C9orf72 mutations produce FTLD-TDP Type B (or A). GRN mutations → Type A. FTLD-tau (~40%): Pick's disease (3R tau — Pick bodies), CBD and PSP (4R tau — astrocytic plaques, coiled bodies, NFTs). MAPT mutations → FTLD-tau. FTLD-FUS (~5%): FUS protein inclusions — typically young-onset bvFTD.", difficulty: "hard" },
    { question: "What genetic mutations are associated with FTD and what are their clinical correlates?", answer: "C9orf72 hexanucleotide repeat expansion (chromosome 9): Most common familial FTD mutation; also causes ALS — FTD-ALS overlap; prominent psychiatric features (psychosis, anxiety). GRN (progranulin, chromosome 17): Haploinsufficiency → loss of neurotrophic support; associated with asymmetric cortical syndrome, parkinsonism; penetrance ~90% by 70. MAPT (microtubule-associated protein tau, chromosome 17): Tau protein mutations → FTLD-tau; variable penetrance. VCP mutations: FTD + ALS + IBM (inclusion body myopathy) + Paget's disease.", difficulty: "hard" },
    { question: "What is the neuropsychological profile of behavioral variant FTD vs. Alzheimer's disease in early stages?", answer: "bvFTD: Predominant executive dysfunction, behavioral disinhibition, apathy, loss of empathy; relatively preserved episodic memory early (hippocampus often spared early); social cognition severely impaired (theory of mind, emotion recognition). AD: Predominant episodic memory impairment (encoding deficit, poor recognition); behavioral changes emerge later; social awareness often preserved early. The bvFTD patient may score relatively normally on memory testing but show striking personality change; the AD patient shows striking memory failure with relatively preserved personality early.", difficulty: "hard" },
    // ===== Huntington's Disease =====
    { question: "What is the genetic basis of Huntington's disease?", answer: "Huntington's disease (HD) is caused by an autosomal dominant CAG trinucleotide repeat expansion in the HTT gene (chromosome 4p16.3) encoding huntingtin protein. Normal alleles: <36 CAG repeats. Intermediate (reduced penetrance): 36-39. Full penetrance: ≥40 repeats. Anticipation: CAG repeats expand across generations (especially through paternal transmission), causing earlier onset in successive generations. Repeat length is inversely correlated with age of onset — longer repeats → earlier onset.", difficulty: "hard" },
    { question: "What is the neuropathology of Huntington's disease and what syndrome does it cause?", answer: "Mutant huntingtin protein misfolds and aggregates — causing striatal neurodegeneration, preferentially of medium spiny neurons (MSNs) in the caudate nucleus (then putamen, then cortex). Caudate atrophy is the neuroimaging hallmark on MRI. Loss of the indirect pathway (MSNs expressing D2 receptors) → disinhibition of movement → chorea. Clinical triad: Chorea (involuntary, dance-like movements), psychiatric/behavioral symptoms (depression, irritability, psychosis, OCD), and subcortical dementia (executive dysfunction, processing speed, memory). Invariably progressive and fatal.", difficulty: "hard" },
    { question: "What is the characteristic neuropsychological profile of Huntington's disease?", answer: "HD produces a subcortical dementia pattern: Prominent executive dysfunction (planning, set-shifting, verbal fluency), psychomotor slowing (processing speed), attention deficits, and visuospatial impairment. Memory: retrieval deficit with relatively preserved encoding — recognition testing shows better performance than free recall. Language: not a primary feature but fluency and organization are affected. Psychiatric: Depression is most common (~40%), followed by irritability/aggression, OCD, apathy, and psychosis. Motor: chorea, oculomotor abnormalities (saccade initiation delay — early sign), dysarthria, dysphagia.", difficulty: "hard" },
    // ===== NPH =====
    { question: "What is normal pressure hydrocephalus (NPH) and what causes it?", answer: "NPH is a syndrome of enlarged ventricles (hydrocephalus ex vacuo excluded) with normal CSF opening pressure on lumbar puncture — caused by impaired CSF reabsorption at the arachnoid granulations despite normal intracranial pressure. Idiopathic NPH (iNPH): no identified cause — primarily affects adults >60. Secondary NPH: follows subarachnoid hemorrhage, meningitis, head trauma, or aqueductal stenosis. The ventricles enlarge, stretching periventricular white matter fibers (especially frontal-subcortical tracts).", difficulty: "medium" },
    { question: "What is the classic triad of normal pressure hydrocephalus?", answer: "Hakim-Adams triad: 1) Gait disturbance (most prominent and earliest): magnetic, apraxic gait — short shuffling steps, wide-based, difficulty initiating ('feet stuck to floor'), frequent falls. 2) Urinary incontinence: frontal disinhibition + loss of cortical bladder control. 3) Cognitive impairment: frontal-subcortical pattern — executive dysfunction, psychomotor slowing, attention deficits, apathy; memory less affected than in AD. Key: 'Wacky, wobbly, wet' — cognitive, gait, urinary in that mnemonic order. Gait responds best to shunting.", difficulty: "medium" },
    // ===== TBI & CTE =====
    { question: "How is traumatic brain injury classified by severity?", answer: "Severity is classified by: GCS (Glasgow Coma Scale = Eye [1-4] + Verbal [1-5] + Motor [1-6]): Mild TBI: GCS 13-15; LOC <30 min; PTA <24h. Moderate TBI: GCS 9-12; LOC 30 min-24h; PTA 1-7 days. Severe TBI: GCS ≤8; LOC >24h; PTA >7 days. Duration of post-traumatic amnesia (PTA) is the best predictor of functional outcome. Additional biomarkers (serum GFAP, UCH-L1) emerging for mild TBI diagnosis.", difficulty: "medium" },
    { question: "What is chronic traumatic encephalopathy (CTE) and how does it differ from other tauopathies?", answer: "CTE is a progressive tauopathy found in individuals with a history of repetitive traumatic head impacts — former contact sport athletes (American football, boxing, ice hockey), military veterans. Pathological hallmark: perivascular accumulation of hyperphosphorylated tau (3R+4R) at the depths of sulci — a pattern distinct from AD, PSP, and CBD. CTE CANNOT be diagnosed in vivo — diagnosis requires neuropathological examination at autopsy. Clinical features: behavioral/mood changes (depression, irritability, impulsivity), cognitive decline, and motor symptoms.", difficulty: "hard" },
    { question: "What is second impact syndrome and what makes it dangerous?", answer: "Second impact syndrome occurs when a second concussion is sustained before the brain has fully recovered from the first. Mechanism: prior concussion impairs cerebrovascular autoregulation → second impact causes rapid, catastrophic cerebral edema due to loss of the ability to regulate cerebral blood flow → massive malignant edema and herniation. Predominantly seen in adolescent athletes. Often rapidly fatal or causes severe permanent disability. The basis for graduated return-to-play protocols that require full symptom resolution before return.", difficulty: "medium" },
    // ===== Prion Diseases =====
    { question: "What is Creutzfeldt-Jakob disease (CJD) and what causes it?", answer: "CJD is the most common human prion disease — caused by misfolded prion protein (PrPsc) that pathologically converts normal PrPc into more PrPsc in a self-propagating cascade, causing spongiform degeneration of the brain. Four forms: Sporadic CJD (sCJD, ~85%): no known cause; rapid progression. Familial CJD: PRNP gene mutations. Variant CJD (vCJD): linked to BSE ('mad cow disease') — affects younger patients; psychiatric onset; pulvinar sign on MRI. Iatrogenic CJD: contaminated dura, corneas, pituitary-derived growth hormone.", difficulty: "hard" },
    { question: "What are the clinical features and prognosis of sporadic CJD?", answer: "Sporadic CJD: Extremely rapid progression — median survival ~4-6 months from onset; 90% die within 1 year. Clinical: subacute progressive dementia (weeks to months), cerebellar ataxia, myoclonus (startle-sensitive), cortical visual disturbances, and akinetic mutism terminally. Biomarkers: CSF 14-3-3 protein (sensitivity ~94%), RT-QuIC assay (high specificity for prion seeding); MRI DWI: cortical ribboning and basal ganglia/thalamic DWI hyperintensities (pulvinar sign in vCJD). EEG: periodic sharp wave complexes (PSWC, 1-2 Hz) in sCJD.", difficulty: "hard" },
    // ===== PSP & CBS =====
    { question: "What are the cardinal features of progressive supranuclear palsy (PSP)?", answer: "PSP-Richardson syndrome (the classic form): 1) Vertical supranuclear gaze palsy — particularly impaired downward vertical saccades (early and most specific sign). 2) Postural instability with backward falls (falls in the first year is characteristic). 3) Axial rigidity (neck > trunk > limbs). 4) Frontal-subcortical dementia (executive dysfunction, apathy). 5) Pseudobulbar palsy (dysarthria, dysphagia, emotional incontinence). Pathology: 4R tauopathy (NFTs, tuft-shaped astrocytes, coiled bodies) in basal ganglia, brainstem, cerebellum. Hummingbird sign on MRI (midbrain atrophy).", difficulty: "hard" },
    { question: "What is corticobasal syndrome (CBS) and how does its pathology relate to its presentation?", answer: "CBS is a clinical syndrome of asymmetric cortical + basal ganglia dysfunction: unilateral limb rigidity, ideomotor apraxia, dystonia, myoclonus, cortical sensory loss (astereognosis, graphesthesia loss), alien limb phenomenon (limb moves involuntarily), and dementia. CBS is a CLINICAL syndrome — the underlying pathology may be: CBD (corticobasal degeneration, 4R tau — most specific), PSP, AD (posterior cortical atrophy variant), FTLD-TDP, or others. Asymmetric atrophy on MRI (superior parietal, superior frontal — contralateral to more affected limb).", difficulty: "hard" },
    // ===== Additional =====
    { question: "What is posterior cortical atrophy (PCA)?", answer: "PCA ('visual variant of AD') is a syndrome of progressive visuospatial/visuoperceptual dysfunction with relatively preserved episodic memory and insight early. Underlying pathology is most commonly AD (posterior neocortical distribution of NFTs) in ~80% of cases. Clinical: simultanagnosia (inability to perceive >1 object at once), optic ataxia, oculomotor apraxia (Balint syndrome), hemispatial neglect, alexia, dressing apraxia. Brain: parieto-occipital and occipitotemporal atrophy. Important: patients often present to ophthalmologists before neurologists.", difficulty: "hard" },
    { question: "What is the role of tau in neurodegenerative disease beyond Alzheimer's?", answer: "Tau is a microtubule-associated protein that stabilizes axonal microtubules. In tauopathies, tau becomes hyperphosphorylated → detaches from microtubules → aggregates. Tau isoforms: 3-repeat (3R tau): Pick's disease. 4-repeat (4R tau): PSP, CBD, FTLD-tau (MAPT mutations). Mixed 3R+4R: AD, CTE. Tau spreads transneuronally in a prion-like manner, following specific anatomical circuits. Tau PET imaging can now track tau stage clinically. Tau pathology correlates better with cognitive symptoms than amyloid burden in AD.", difficulty: "hard" },
    { question: "What are the stages of Alzheimer's disease clinically?", answer: "Clinical staging: Preclinical AD: Biomarker-positive (amyloid+) but cognitively normal — can last 15-20 years. Stage 1 (MCI due to AD): Measurable cognitive decline, primarily memory; intact functional independence; biomarker-positive. Stage 2 (Mild dementia): Memory plus ≥1 other domain impaired; functional independence partially compromised; IADL difficulties. Stage 3 (Moderate dementia): Multiple domain impairment; basic ADL dependence emerging; hallucinations, delusions common. Stage 4 (Severe dementia): Profound cognitive impairment; complete ADL dependence; minimal verbal output; immobility, dysphagia.", difficulty: "medium" },
    { question: "What non-pharmacological interventions are evidence-based for neurocognitive disorders?", answer: "1) Cognitive stimulation therapy (CST): Group-based activities targeting cognition — shown to improve cognition and quality of life in mild-moderate dementia. 2) Physical exercise: Aerobic exercise may slow hippocampal atrophy and cognitive decline in MCI and early dementia. 3) Cognitive rehabilitation: Compensatory strategy training for MCI — adaptive aids, errorless learning, spaced retrieval. 4) Caregiver education and support: Reduces caregiver burden, delays institutionalization. 5) Sleep hygiene/treatment of comorbid sleep disorders: Impaired sleep accelerates Aβ accumulation (glymphatic clearance). 6) Management of vascular risk factors (especially in VaD): Hypertension control, antiplatelet therapy, glycemic control.", difficulty: "medium" },
    { question: "What is Wernicke-Korsakoff syndrome?", answer: "A two-phase disorder from thiamine (B1) deficiency — most commonly from chronic alcohol use disorder, malnutrition, or malabsorption. Wernicke's encephalopathy (acute): Triad of confusion/encephalopathy, oculomotor dysfunction (nystagmus, CN VI palsy, gaze palsy), and ataxia — caused by thiamine-dependent enzyme failure in glucose metabolism. Treat emergently with IV thiamine. Korsakoff syndrome (chronic): Dense anterograde amnesia + retrograde amnesia + confabulation — from mammillary body and dorsomedial thalamus damage. Memory deficit is permanent in ~80% if thiamine not given early enough.", difficulty: "hard" },
    { question: "What are the vascular risk factors for dementia and why is vascular health important?", answer: "Modifiable vascular risk factors increase dementia risk substantially: midlife hypertension (~60% increased risk for dementia), diabetes mellitus, hyperlipidemia, obesity, smoking, atrial fibrillation, and physical inactivity. They contribute directly to vascular dementia and also accelerate AD pathology (cerebrovascular disease lowers the threshold for symptomatic AD by reducing cognitive reserve). Controlling hypertension is the single most impactful modifiable risk reduction. Sleep disorders (especially sleep apnea) are increasingly recognized as modifiable dementia risk factors via impaired glymphatic clearance.", difficulty: "medium" },
    { question: "What is the role of neuroinflammation in Alzheimer's disease?", answer: "Neuroinflammation is now considered a core feature, not just a consequence, of AD pathophysiology. Microglia (CNS-resident immune cells): Early state — attempt to phagocytose Aβ and promote clearance. Chronic state — become dysfunctional, release pro-inflammatory cytokines (IL-1β, TNF-α, IL-6), and amplify tau phosphorylation and synaptic damage. TREM2 (Triggering Receptor Expressed on Myeloid Cells-2): Variant rs75932628 doubles AD risk — TREM2 regulates microglial phagocytosis and clearance of Aβ. Loss-of-function TREM2 impairs Aβ clearance. Astrocytes also become reactive (astrogliosis) and lose homeostatic functions.", difficulty: "hard" },
    { question: "What is the neuropsychological profile of normal pressure hydrocephalus?", answer: "NPH produces a frontal-subcortical dementia: executive dysfunction (working memory, planning, mental flexibility), psychomotor slowing, attention deficits, and apathy — all from compression of periventricular white matter tracts connecting the frontal lobes to basal ganglia and thalamus. Memory deficits are less prominent and of a retrieval type (improves with cues). Language is relatively preserved. Crucially, all three triad features (gait, cognition, incontinence) are potentially treatable with ventriculoperitoneal shunting — gait responds best, cognition moderately, incontinence variably.", difficulty: "hard" },
    { question: "What distinguishes cortical from subcortical dementia patterns?", answer: "Cortical dementia (AD, DLB, PCA): Aphasia, apraxia, agnosia, acalculia ('4 As'); prominent amnesia (encoding failure); motor system relatively preserved early; visuospatial deficits in posterior variants. Subcortical dementia (HD, PSP, VaD, PD, NPH): Psychomotor slowing (bradyphrenia), executive dysfunction, memory retrieval deficits (recognition preserved), dysarthria, gait disturbance, personality/mood changes; language relatively intact; motor features prominent.", difficulty: "medium" },
    { question: "What is the neuropsychological profile of traumatic brain injury?", answer: "Mild TBI (concussion): Executive dysfunction, processing speed slowing, attention/concentration deficits, memory consolidation difficulties — typically resolves within days-weeks; persistent symptoms >3 months = post-concussion syndrome. Moderate-Severe TBI: Amnesia (post-traumatic amnesia duration predicts outcomes), executive dysfunction (frontal systems most vulnerable — diffuse axonal injury), attention, processing speed, and learning deficits. Frontal lobe contusions: disinhibition, impulsivity, poor self-regulation. Temporal contusions: memory and language deficits. Emotional/behavioral: depression, anxiety, irritability, PTSD.", difficulty: "hard" },
    { question: "What is the significance of the nucleus basalis of Meynert in Alzheimer's disease?", answer: "The nucleus basalis of Meynert (NBM) in the basal forebrain is the primary source of cholinergic innervation to the entire cerebral cortex. In AD, cholinergic neurons of the NBM undergo early and severe neuronal loss (~75-80% by mid-stage AD) → profound cortical cholinergic deficiency. This cholinergic deficit contributes to memory impairment and attention dysfunction — and is the pharmacological target of cholinesterase inhibitors. The cholinergic hypothesis led to the development of acetylcholinesterase inhibitors as the first symptomatic AD treatments.", difficulty: "hard" },
    { question: "What is tau PET imaging and what patterns are seen in different tauopathies?", answer: "Tau PET uses tracers that bind aggregated tau to map tau distribution in vivo. AD pattern: mesial temporal (hippocampus, entorhinal) early → inferior temporal → parietal → frontal — follows Braak staging, correlates with cognitive severity better than amyloid PET. PSP: tau in brainstem, basal ganglia, dentate nucleus. CBD: asymmetric frontoparietal tau, basal ganglia. Pick's disease (3R): frontotemporal — though current tau tracers bind 3R less well. Tau PET is increasingly used in diagnosis of atypical dementias and in clinical trials of anti-tau therapies.", difficulty: "hard" },
  ];

  const insertedFC = await db.insert(flashcardsTable).values(flashcards.map(f => ({ ...f, topicId: TOPIC_ID }))).returning();
  console.log(`  ✓ ${insertedFC.length} flashcards`);

  // --- QUIZ QUESTIONS ---
  const regular = [
    { question: "Alzheimer's disease amyloid plaques are composed of:", optionA: "Hyperphosphorylated tau protein filaments", optionB: "Aggregated amyloid-beta (Aβ42) peptide derived from APP cleavage", optionC: "Alpha-synuclein protein aggregates", optionD: "TDP-43 protein inclusions", correctAnswer: "B", explanation: "Amyloid plaques (senile/neuritic plaques) are extracellular deposits of aggregated Aβ42 — generated by sequential β-secretase (BACE1) and γ-secretase cleavage of APP. Tau forms the neurofibrillary tangles (the second hallmark). Alpha-synuclein forms Lewy bodies. TDP-43 is found in FTLD-TDP and ALS.", examOnly: false },
    { question: "A patient with DLB is agitated with hallucinations. Which class of medication should be AVOIDED?", optionA: "Cholinesterase inhibitors", optionB: "Typical antipsychotics (dopamine D2 blockers)", optionC: "Memantine", optionD: "Quetiapine at low dose", correctAnswer: "B", explanation: "Patients with DLB/PDD have severe dopaminergic deficits and reduced D2 receptor expression. Dopamine D2-blocking antipsychotics can cause severe neuroleptic sensitivity reactions — acute parkinsonism, sedation, altered consciousness, autonomic instability, and sudden death. If antipsychotics are absolutely necessary, quetiapine or clozapine (minimal D2 blockade) are preferred.", examOnly: false },
    { question: "The classic presentation of sporadic Creutzfeldt-Jakob disease (sCJD) is characterized by:", optionA: "Gradual decline over 5-10 years with prominent personality change", optionB: "Rapid-onset dementia with myoclonus and 90% mortality within 1 year", optionC: "Fluctuating cognition with visual hallucinations and parkinsonism", optionD: "Episodic memory loss with preserved language for many years", correctAnswer: "B", explanation: "Sporadic CJD is one of the most rapidly fatal brain diseases — median survival ~4-6 months from symptom onset; >90% die within 1 year. Key features: subacute progressive dementia, cerebellar ataxia, myoclonus (often startle-sensitive), and akinetic mutism terminally. EEG shows periodic sharp wave complexes; CSF 14-3-3 is sensitive; MRI DWI shows cortical ribboning.", examOnly: false },
    { question: "The 1-year rule distinguishes PDD from DLB based on:", optionA: "Whether memory or behavior is the primary complaint", optionB: "Whether parkinsonism precedes cognitive decline by ≥1 year (PDD) or develops within 1 year of cognitive decline (DLB)", optionC: "The type of alpha-synuclein aggregation pattern", optionD: "Whether levodopa improves the patient's symptoms", correctAnswer: "B", explanation: "The '1-year rule': PDD = established Parkinson's motor disease (≥1 year) followed by dementia. DLB = cognitive symptoms and parkinsonism begin within 1 year of each other (or cognition first). Clinically useful distinction, though both share Lewy body pathology and represent a disease spectrum.", examOnly: false },
    { question: "The Hakim-Adams triad of normal pressure hydrocephalus consists of:", optionA: "Tremor, rigidity, and bradykinesia", optionB: "Gait disturbance (magnetic gait), urinary incontinence, and cognitive impairment (frontal-subcortical)", optionC: "Visual hallucinations, fluctuating consciousness, and parkinsonism", optionD: "Aphasia, apraxia, and agnosia", correctAnswer: "B", explanation: "The NPH triad (Hakim-Adams): gait disturbance (magnetic/apraxic gait — the most prominent and earliest), urinary incontinence (frontal disinhibition), and cognitive impairment (frontal-subcortical pattern — executive dysfunction, psychomotor slowing, apathy). Gait responds best to ventriculoperitoneal shunting.", examOnly: false },
    { question: "Huntington's disease is caused by a CAG trinucleotide repeat expansion in the HTT gene. Clinical disease typically begins when repeat length exceeds:", optionA: "10 repeats", optionB: "20 repeats", optionC: "40 repeats", optionD: "100 repeats", correctAnswer: "C", explanation: "HD trinucleotide repeat ranges: <36 = normal; 36-39 = intermediate/reduced penetrance; ≥40 = full penetrance (disease will occur). Repeat length inversely predicts age of onset — longer repeats cause earlier-onset HD (juvenile HD with >60 repeats). CAG repeats tend to expand across generations (anticipation), especially through paternal transmission.", examOnly: false },
    { question: "Which Alzheimer's disease biomarker finding on PET imaging is most characteristic of early AD pathology?", optionA: "Frontal lobe FDG-PET hypometabolism", optionB: "Positive amyloid PET (Aβ accumulation in neocortex) in conjunction with medial temporal tau uptake", optionC: "Bilateral caudate hypometabolism on FDG-PET", optionD: "Increased dopamine transporter signal in the striatum", correctAnswer: "B", explanation: "In early AD (A/T/N framework): positive amyloid PET (A+) appears first — often decades before symptoms. Tau PET (T+) begins in the medial temporal lobe (Braak I-II) and tracks more closely with cognitive symptoms. FDG-PET shows temporoparietal hypometabolism in symptomatic AD. Frontal hypometabolism suggests FTD; caudate changes suggest HD or VaD.", examOnly: false },
    { question: "The episodic memory impairment in Alzheimer's disease is best characterized as a:", optionA: "Retrieval deficit — impaired free recall but preserved recognition", optionB: "Encoding deficit — poor free recall AND poor recognition, failure to benefit from cues", optionC: "Storage deficit — rapid loss of information held in remote memory", optionD: "Frontal-executive memory deficit — impaired prospective memory only", correctAnswer: "B", explanation: "AD amnesia reflects hippocampal/entorhinal dysfunction during encoding — information never gets properly stored. Clinically: impaired free recall AND impaired recognition (unlike retrieval deficits in subcortical dementias where recognition is preserved). Recognition savings are absent; cued recall provides minimal benefit. This distinguishes AD from the retrieval-type memory deficits of VaD, DLB, and FTD.", examOnly: false },
    { question: "C9orf72 repeat expansion is most strongly associated with:", optionA: "Early-onset Alzheimer's disease with amyloid angiopathy", optionB: "Frontotemporal dementia and/or ALS — often both in the same patient or family", optionC: "Huntington's disease when repeat length exceeds 40", optionD: "Progressive supranuclear palsy with 4R tau accumulation", correctAnswer: "B", explanation: "C9orf72 hexanucleotide (GGGGCC) repeat expansion is the most common genetic cause of familial FTD and familial ALS — and FTD-ALS overlap (patients can have features of both). The same family may have some members with FTD, others with ALS, and others with both. C9orf72 mutations produce FTLD-TDP type B/C pathology.", examOnly: false },
    { question: "APOE ε4 allele affects Alzheimer's disease risk primarily by:", optionA: "Directly causing early-onset familial AD through presenilin mutations", optionB: "Impairing amyloid-beta clearance, promoting tau pathology, and accelerating neuroinflammation", optionC: "Reducing production of neprilysin, the enzyme that produces amyloid-beta", optionD: "Increasing the expression of the APP gene, leading to amyloid overproduction", correctAnswer: "B", explanation: "APOE4 is a risk modifier (not a causal mutation) for sporadic AD: it impairs Aβ clearance (reduces glymphatic, perivascular, and cellular Aβ removal), promotes tau hyperphosphorylation, dysregulates lipid metabolism in neurons and glia, and amplifies neuroinflammatory microglial responses — lowering the threshold for AD pathology. One copy ~3x risk; two copies ~8-12x risk.", examOnly: false },
  ];

  const examOnly = [
    { question: "Braak staging of neurofibrillary tau pathology in Alzheimer's disease is important because:", optionA: "It directly determines amyloid plaque burden and correlates with CSF Aβ42 levels", optionB: "Tau pathology spreads in a stereotyped transneuronal pattern from entorhinal cortex → limbic → neocortex, with each stage correlating with progressive clinical deterioration", optionC: "Braak stages predict which genetic variant (APOE2/3/4) a patient carries", optionD: "It determines eligibility for anti-amyloid immunotherapy", correctAnswer: "B", explanation: "Braak I-II (transentorhinal): NFTs in entorhinal cortex and perirhinal cortex → subtle memory impairment. Braak III-IV (limbic): hippocampus, amygdala → overt amnestic syndrome, MCI-dementia transition. Braak V-VI (neocortical): association cortex → full dementia with multi-domain impairment. Tau pathology correlates more closely with cognitive severity than amyloid plaque burden.", examOnly: true },
    { question: "The A/T/N biomarker framework for Alzheimer's disease is significant because:", optionA: "It provides a clinical staging system based only on cognitive testing, replacing the need for biomarkers", optionB: "It decouples the biological definition of AD from its clinical expression — allowing preclinical detection and biological staging years before cognitive symptoms appear", optionC: "It identifies which patients should receive antipsychotic treatment for behavioral symptoms", optionD: "It predicts which genetic mutation (PSEN1, PSEN2, or APP) caused a given case of AD", correctAnswer: "B", explanation: "The A/T/N framework (NIA-AA, 2018) defines AD biologically rather than clinically: A= (amyloid), T= (tau), N= (neurodegeneration). A patient can be biologically 'A+' for years before any cognitive symptoms — this preclinical window is the target for disease-modifying prevention trials. Anti-amyloid immunotherapies (lecanemab, donanemab) are only effective in A+/T+ patients in early clinical stages.", examOnly: true },
    { question: "What distinguishes the memory deficit in DLB/PDD from that in Alzheimer's disease on neuropsychological testing?", optionA: "DLB/PDD patients show complete anterograde amnesia with no recognition memory whatsoever", optionB: "DLB/PDD shows a retrieval deficit (impaired free recall but relatively preserved recognition) while AD shows an encoding deficit (impaired free recall AND impaired recognition)", optionC: "AD patients have better visuospatial memory than DLB/PDD patients in all cases", optionD: "DLB/PDD memory deficit primarily affects semantic rather than episodic memory", correctAnswer: "B", explanation: "This is a critical neuropsychological distinction: AD encoding deficit (hippocampal/entorhinal dysfunction) → poor free recall AND poor recognition, fails to benefit from cues or recognition format. DLB/PDD retrieval deficit (frontal-subcortical) → poor free recall but relatively preserved recognition memory (the information was encoded and stored, but retrieval is impaired). Recognition memory paradigms are key to making this distinction.", examOnly: true },
    { question: "In frontotemporal dementia, the bvFTD phenotype is differentiated from Alzheimer's disease most critically by:", optionA: "The presence of memory impairment — AD has worse memory than bvFTD", optionB: "The pattern of social cognition impairment — bvFTD severely impairs theory of mind, empathy, and emotion recognition while these are relatively preserved in early AD", optionC: "The age of onset — bvFTD occurs exclusively after age 75 while AD occurs in younger patients", optionD: "The response to cholinesterase inhibitors — bvFTD responds better than AD", correctAnswer: "B", explanation: "bvFTD hallmark: profound early impairment of social cognition (theory of mind, emotion recognition, empathy), disinhibition, apathy, and executive dysfunction — while episodic memory can be relatively spared early (hippocampus often intact initially). In AD, social awareness and empathy are preserved early even as memory fails. Social cognition tests are among the most discriminating measures for bvFTD vs. AD.", examOnly: true },
    { question: "Why does Down syndrome (trisomy 21) lead to Alzheimer's disease pathology by age 40?", optionA: "Trisomy 21 causes overexpression of the APOE ε4 allele on chromosome 19", optionB: "The APP gene is on chromosome 21 — three copies of APP lead to overproduction of amyloid-beta, causing amyloid plaque accumulation decades earlier than in the general population", optionC: "Trisomy 21 causes PSEN1 mutations that increase γ-secretase activity", optionD: "Down syndrome individuals have reduced neprilysin, the enzyme that degrades Aβ", correctAnswer: "B", explanation: "The amyloid precursor protein (APP) gene is located on chromosome 21. Trisomy 21 provides 3 copies of APP rather than 2 → ~50% increased APP expression → lifelong overproduction of Aβ → amyloid plaques detectable by age 30-40 in virtually all individuals with Down syndrome. By their 60s, most individuals with Down syndrome have dementia.", examOnly: true },
    { question: "Thiamine (B1) deficiency causes Wernicke's encephalopathy primarily by:", optionA: "Disrupting dopamine synthesis in the substantia nigra", optionB: "Impairing thiamine-dependent oxidative metabolism (pyruvate dehydrogenase, α-ketoglutarate dehydrogenase), causing energy failure and excitotoxic necrosis in metabolically vulnerable brain regions (mammillary bodies, dorsomedial thalamus, periaqueductal gray)", optionC: "Causing demyelination of the dorsal columns and corticospinal tracts", optionD: "Reducing ACh synthesis in the nucleus basalis of Meynert", correctAnswer: "B", explanation: "Thiamine is a cofactor for pyruvate dehydrogenase and α-ketoglutarate dehydrogenase — critical enzymes in oxidative glucose metabolism. Deficiency causes metabolic failure in regions with high metabolic demand: mammillary bodies, dorsomedial thalamus, periaqueductal gray, floor of the fourth ventricle. Necrosis of the mammillary bodies + dorsomedial thalamus causes the dense amnesia of Korsakoff syndrome.", examOnly: true },
    { question: "The pathological hallmark that distinguishes CTE from Alzheimer's disease at autopsy is:", optionA: "CTE has amyloid plaques but no tau — while AD has both", optionB: "CTE shows perivascular accumulation of hyperphosphorylated tau (3R+4R) at the depths of cortical sulci — a pattern not seen in AD, PSP, or CBD", optionC: "CTE has alpha-synuclein Lewy bodies in addition to tau tangles", optionD: "CTE shows TDP-43 inclusions exclusively, without tau pathology", correctAnswer: "B", explanation: "The pathognomonic CTE lesion is perivascular phospho-tau accumulation at the depths of cortical sulci — a distribution reflecting the mechanical stress of sulcal walls during head impact. This perivascular sulcal depth pattern is unique to CTE and distinguishes it from all other tauopathies (AD tau begins in entorhinal/hippocampus; PSP tau is subcortical; CBD tau is frontoparietal asymmetric).", examOnly: true },
    { question: "Progressive supranuclear palsy is characterized by 4R tauopathy. The cardinal eye movement abnormality is:", optionA: "Bilateral horizontal gaze palsy (unable to look left or right)", optionB: "Downward vertical saccade impairment — the patient cannot make voluntary fast (saccadic) eye movements downward, though slow pursuit may be preserved initially", optionC: "Complete vertical and horizontal gaze palsy from onset", optionD: "Nystagmus on lateral gaze only", correctAnswer: "B", explanation: "PSP-Richardson syndrome: impaired downward vertical saccades are the earliest and most specific eye movement finding. The superior colliculus (generates saccades) and its connections to brainstem vertical gaze centers are disrupted by 4R tau. Patients have difficulty reading, going down stairs, and eating. With progression: complete vertical then horizontal supranuclear gaze palsy. The palsy is 'supranuclear' — the VOR (brainstem reflex) can overcome it initially (doll's eye intact early).", examOnly: true },
    { question: "Cerebral amyloid angiopathy (CAA) is most likely to cause which pattern of hemorrhage?", optionA: "Deep ganglionic hemorrhages (basal ganglia, thalamus) related to hypertension", optionB: "Lobar (cortical/subcortical) hemorrhages and multiple cortical microbleeds — because amyloid deposits in superficial cortical and leptomeningeal vessels weaken vessel walls", optionC: "Pontine hemorrhages from small vessel disease in the brainstem", optionD: "Bilateral subdural hematomas from bridging vein rupture", correctAnswer: "B", explanation: "CAA: amyloid-beta accumulates in the walls of cortical and leptomeningeal vessels (not deep perforating vessels), causing vessel wall weakness → lobar hemorrhages (cortical/subcortical, not deep ganglionic). MRI susceptibility-weighted imaging shows cortical superficial siderosis and lobar microbleeds as hallmarks of CAA. Unlike hypertensive hemorrhages which are deep (basal ganglia, thalamus, brainstem).", examOnly: true },
    { question: "The TREM2 variant rs75932628 doubles Alzheimer's disease risk by:", optionA: "Directly promoting tau hyperphosphorylation in cortical neurons", optionB: "Impairing microglial phagocytic function and Aβ clearance — loss of TREM2-mediated microglial activation reduces amyloid plaque clearance", optionC: "Increasing APP gene expression through transcriptional dysregulation", optionD: "Blocking the glymphatic pathway independent of sleep", correctAnswer: "B", explanation: "TREM2 is a cell surface receptor on microglia that activates phagocytosis and metabolic support of neurons around amyloid plaques (a 'disease-associated microglia' DAM response). The rs75932628 R47H variant reduces TREM2 function → impaired microglial Aβ phagocytosis, impaired synaptic pruning regulation, and reduced neuroprotective responses → increased AD risk. TREM2 is a key neuroinflammation target in AD therapeutic development.", examOnly: true },
    { question: "Post-traumatic amnesia (PTA) duration is significant in TBI because:", optionA: "It is the best predictor of long-term functional outcome in moderate-severe TBI", optionB: "It determines whether a patient should receive cholinesterase inhibitors", optionC: "It predicts the probability of developing CTE", optionD: "It directly measures hippocampal volume loss on MRI", correctAnswer: "A", explanation: "PTA duration (the period from injury to when continuous memory is restored) is the single strongest predictor of functional outcome in moderate-severe TBI: PTA <1 hour = very good recovery; PTA 1-24 hours = good; PTA 1-7 days = moderate disability; PTA >7 days = severe disability likely. PTA duration outperforms initial GCS, neuroimaging findings, and LOC duration as a predictor of long-term outcomes. It is assessed serially at bedside during the acute period.", examOnly: true },
    { question: "In Huntington's disease, the earliest motor sign detectable neuropsychologically and clinically is often:", optionA: "Chorea beginning in the lower limbs", optionB: "Saccadic eye movement abnormalities — prolonged latency to initiate saccades (especially in cognitively demanding paradigms) and impaired smooth pursuit", optionC: "Dysphagia from bulbar involvement", optionD: "Rigidity and bradykinesia indistinguishable from Parkinson's disease", correctAnswer: "B", explanation: "In prodromal and early HD, oculomotor abnormalities often precede overt chorea: prolonged saccade initiation latency, increased error rates on antisaccade tasks (executive control of eye movements), and impaired smooth pursuit. These reflect striatal and frontal circuit dysfunction in early HD. Chorea typically begins in the hands/fingers and tongue. Rigidity/bradykinesia emerge in later stages or in juvenile HD (Westphal variant, >60 CAG repeats).", examOnly: true },
  ];

  const allQs = [...regular, ...examOnly].map(q => ({ ...q, topicId: TOPIC_ID }));
  const insertedQs = await db.insert(quizQuestionsTable).values(allQs).returning();
  console.log(`  ✓ ${insertedQs.length} quiz questions`);

  // --- STUDY GUIDE ---
  const sgContent = `# Neurocognitive Disorders — Comprehensive Study Guide

---

## Overview: Classification

| Term | DSM-5 Severity | Functional Impact | Typical Test Performance |
|---|---|---|---|
| **Minor NCD (MCI)** | Modest decline (~1-2 SD below normative mean) | **Preserved independence** — compensates with more effort/time | Below expected but above dementia cutoff |
| **Major NCD (Dementia)** | Substantial decline (typically >2 SD) | **Functional independence impaired** — assistance required for IADLs/ADLs | Multiple domains impaired objectively |

**Key principle:** Decline must represent a change from prior level of functioning (not lifelong baseline) and must be documented by both history AND objective cognitive assessment.

---

## 1. Alzheimer's Disease (AD)

### Epidemiology
- Most common cause of dementia: **60-70% of all cases**
- ~6.7 million Americans affected (2023); prevalence doubles every 5 years after age 65: ~5% at 65-74; ~13% at 75-84; ~33% at 85+
- Women disproportionately affected (hormonal, genetic, longevity factors)
- 2nd leading cause of death in adults >65 in the US
- Preclinical phase (biomarker-positive, cognitively normal) begins **15-20 years** before clinical symptoms

### Pathophysiology
**Amyloid cascade:** APP (chromosome 21) cleaved by β-secretase (BACE1) + γ-secretase (presenilin complex) → Aβ40/42 peptides. Aβ42 aggregates: oligomers (most neurotoxic) → protofibrils → amyloid plaques. Oligomers disrupt synaptic function and activate microglia.

**Tau neurofibrillary tangles (NFTs):** Tau hyperphosphorylation → detaches from microtubules (collapse) → pairs into helical filaments → NFTs. Tau pathology spreads transneuronally (Braak staging, see below).

**Neuroinflammation:** Activated microglia (TREM2-mediated) initially attempt Aβ clearance — become chronically dysregulated → release IL-1β, TNF-α → synaptic damage. APOE4 impairs microglial Aβ phagocytosis.

**Cholinergic loss:** Nucleus basalis of Meynert (NBM) — major cortical cholinergic source — undergoes ~75-80% neuronal loss by mid-stage AD → memory and attention deficits.

**Final common pathway:** Synaptic density loss is the best correlate of cognitive impairment (not plaque/tangle burden per se).

### Genetic and Other Risk Factors
| Factor | Effect | Mechanism |
|---|---|---|
| **APOE ε4** | 1 copy: ~3x risk; 2 copies: ~8-12x risk | Impairs Aβ clearance, promotes tau, amplifies neuroinflammation |
| **APOE ε2** | ~40% reduced risk vs ε3 | Enhances Aβ clearance |
| **PSEN1** (ch 14) | Autosomal dominant, earliest onset (30s-50s) | Alters γ-secretase → ↑Aβ42:Aβ40 ratio |
| **PSEN2** (ch 1) | Autosomal dominant, slightly later than PSEN1 | Alters γ-secretase |
| **APP** (ch 21) | Autosomal dominant | Overproduction of Aβ42; explains Down syndrome AD |
| **TREM2** R47H | ~2x increased risk | Impairs microglial Aβ phagocytosis |
| **Modifiable risks** | Midlife hypertension, diabetes, obesity, low education, hearing loss, depression, physical inactivity, smoking | Reduce cognitive reserve; ↑ vascular pathology |

### Clinical Staging
| Stage | Clinical Picture | Functional Status |
|---|---|---|
| **Preclinical AD** | Biomarker-positive (A+); cognitively normal | Fully independent; lasts ~15-20 years |
| **MCI due to AD** | Measurable memory decline; biomarker-positive | **Independent** — compensates with strategies |
| **Mild AD** | Memory + ≥1 other domain; IADL difficulties | **Partially dependent** (finances, medications) |
| **Moderate AD** | Multi-domain; BPSD (behavioral/psychological symptoms) | **Substantially dependent**; basic ADL help needed |
| **Severe AD** | Profound impairment; minimal verbal output; immobility | **Fully dependent**; swallowing fails; palliative phase |

**Braak Tau Staging:**
- I-II: Transentorhinal (entorhinal cortex, perirhinal cortex) → subtle memory impairment
- III-IV: Limbic (hippocampus, amygdala, basal forebrain) → overt amnestic syndrome
- V-VI: Neocortical (association cortex) → full multi-domain dementia

### Characteristic Neuropsychological Profile
**Core deficit: Encoding failure (hippocampal/entorhinal dysfunction)**
- Impaired free recall AND impaired recognition (information not stored) — fails to benefit from cues
- Rapid forgetting (high intrusion errors, poor delayed recall)
- **Early:** Anterograde amnesia, anomia/word-finding, topographic disorientation, category fluency > letter fluency
- **Middle:** Visuospatial decline, executive dysfunction, acalculia, constructional apraxia
- **Late:** Language breakdown, limb apraxia, agnosia, complete ADL dependence

**Key distinction:** Encoding deficit (poor recognition) vs. subcortical retrieval deficit (recognition preserved)

### Biomarker Framework (A/T/N)
| Biomarker | Method | Finding |
|---|---|---|
| **A** (Amyloid) | CSF Aβ42 (↓); Amyloid PET | Plaques trap Aβ → low CSF; PET positive |
| **T** (Tau) | CSF p-tau (↑); Tau PET | NFTs → elevated p-tau; mesial temporal uptake early |
| **N** (Neurodegeneration) | FDG-PET; MRI atrophy | Temporoparietal hypometabolism; hippocampal atrophy |

### Treatment / Intervention
| Intervention | Mechanism | Stage |
|---|---|---|
| **Cholinesterase inhibitors** | Inhibit AChE → ↑ synaptic ACh; compensate for NBM loss | Mild-moderate (donepezil also severe) |
| **Memantine** | NMDA receptor antagonist → reduces excitotoxicity | Moderate-severe |
| **Anti-amyloid immunotherapies** (lecanemab, donanemab) | Clear Aβ plaques; slow cognitive decline | Early symptomatic (MCI/mild AD) + biomarker-positive; risk of ARIA |
| **Non-pharmacological** | Cognitive stimulation therapy, physical exercise, sleep hygiene | All stages |
| **Risk factor management** | Treat hypertension, diabetes, sleep apnea; hearing aids | Prevention/MCI stage |

### Other Considerations
- **Down syndrome:** Universal AD pathology by age 40 (3 APP gene copies from trisomy 21)
- **Posterior cortical atrophy (PCA):** "Visual variant of AD" — visuospatial/perceptual deficits, Balint syndrome, asymmetric posterior atrophy; ~80% have AD pathology
- **Logopenic aphasia (lvPPA):** Impaired sentence repetition, word retrieval pauses; phonological working memory; most have AD pathology
- **Vascular-AD mixed pathology:** Common in the oldest old; additive impairment

---

## 2. Vascular Cognitive Impairment (VCI)

### Epidemiology
- 2nd most common cause of dementia: ~15-20% of cases (pure); much more common in mixed AD+VaD
- Highly prevalent in African Americans and Asian populations (hypertension burden)
- Strongest risk factors: hypertension, atrial fibrillation, diabetes, smoking, hyperlipidemia

### Pathophysiology
| Mechanism | Brain Lesion | Clinical Impact |
|---|---|---|
| **Large vessel disease** | Cortical infarcts | Focal deficits, stepwise progression |
| **Small vessel disease** | Lacunar infarcts, white matter hyperintensities (leukoaraiosis) | Frontal-subcortical syndrome; gait, bladder |
| **Strategic infarcts** | Thalamus, angular gyrus, caudate | Disproportionate cognitive impact from small lesions |
| **Cerebral amyloid angiopathy (CAA)** | Lobar hemorrhages, cortical microbleeds, superficial siderosis | Cognitive impairment + hemorrhage risk |
| **CADASIL** | Diffuse WMH, especially anterior temporal poles | Hereditary small vessel disease (NOTCH3) |

### Genetic and Other Risk Factors
- **Modifiable:** Hypertension (#1 modifiable risk), diabetes, atrial fibrillation, hyperlipidemia, smoking, obesity, sleep apnea
- **CADASIL:** NOTCH3 mutations (chromosome 19) — autosomal dominant hereditary small vessel disease; early-onset migraine with aura, recurrent lacunar strokes, subcortical dementia

### Clinical Staging
- Variable — depends on lesion burden and location; can show **stepwise progression** (each infarct adds a step) rather than the gradual decline of AD
- Minor VCI (no functional impairment) → Major VaD (functionally dependent)

### Characteristic Neuropsychological Profile
- **Frontal-subcortical pattern:** Executive dysfunction (planning, set-shifting, cognitive flexibility), psychomotor slowing, attention deficits, category verbal fluency reduced
- **Memory:** Retrieval deficit (recognition relatively preserved) — contrasts with AD encoding deficit
- **Gait disturbance:** Often early and prominent (periventricular WM damage)
- Focal neurological signs may be present
- Temporal relationship to a vascular event is diagnostically important

### Treatment / Intervention
- **Control vascular risk factors:** Blood pressure management is primary
- **Antiplatelet therapy** (if non-cardioembolic stroke)
- **Anticoagulation** (if atrial fibrillation)
- **No approved pharmacological treatments** specifically for vascular dementia cognition
- Cholinesterase inhibitors show modest benefit in vascular dementia (especially mixed AD+VaD)
- Cognitive rehabilitation, exercise

### Other Considerations
- **CADASIL:** Migraine with aura in early adulthood; anterior temporal pole and external capsule WMH on MRI; no treatment; genetic counseling
- Mixed AD+VaD is very common in the elderly — vascular pathology lowers the threshold for clinical expression of AD

---

## 3. Lewy Body Disorders

### Spectrum
Parkinson's Disease (PD) → Parkinson's Disease Dementia (PDD) → Dementia with Lewy Bodies (DLB) — all share **alpha-synuclein Lewy body pathology**

### Epidemiology
- DLB: ~10-15% of all dementias; 2nd most common neurodegenerative dementia
- PDD: ~80% of PD patients develop dementia after 20 years
- Male predominance in DLB/PD; mean onset 60s-70s

### Pathophysiology
Alpha-synuclein misfolding → Lewy bodies (cytoplasmic inclusions of α-syn + ubiquitin + neurofilament) + Lewy neurites. Pathology spreads in a prion-like manner (Braak PD staging: brainstem → limbic → neocortex in PD; more diffuse early in DLB). Cholinergic deficits (NBM) often MORE severe than in AD. Dopaminergic deficits (substantia nigra). Posterior cortical involvement especially prominent in DLB.

### Genetic and Other Risk Factors
- **GBA mutations** (glucocerebrosidase): Most common genetic risk for both PD and DLB; impairs lysosomal function → α-syn accumulation
- **SNCA** (alpha-synuclein gene): Duplications/triplications → overproduction of α-syn; point mutations (A53T)
- **LRRK2** mutations: Most common single-gene PD cause worldwide; variable expression
- **REM sleep behavior disorder (RBD):** ~80% of those with isolated RBD develop a synucleinopathy (PD, DLB, or MSA) within 10-15 years — a prodromal biomarker

### Clinical Features and Staging

**DLB Core Features (Diagnostic Criteria):**
| Feature | Detail |
|---|---|
| **Fluctuating cognition** | Marked variation in alertness/attention; daytime somnolence; episodes of staring |
| **Recurrent visual hallucinations** | Well-formed, detailed (people, animals); often non-threatening initially |
| **REM sleep behavior disorder (RBD)** | Acting out dreams; precedes dementia by years (prodromal biomarker) |
| **Parkinsonism** | Bradykinesia, rigidity, rest tremor — typically after cognitive onset (unlike PD) |

**Supportive biomarkers:** Abnormal DAT scan (reduced striatal dopamine transporter uptake), low cardiac MIBG scintigraphy, polysomnographic RBD confirmation

**1-Year Rule (PDD vs. DLB):**
- PDD: Motor parkinsonism clearly established ≥1 year BEFORE cognitive decline
- DLB: Cognitive symptoms and parkinsonism within 1 year of each other

### Characteristic Neuropsychological Profile
- **Most prominent early deficits:** Visuospatial/visuoperceptual dysfunction (figure copying, visual perception, navigation), attention fluctuation
- **Executive dysfunction:** Frontal systems involvement; working memory, verbal fluency
- **Memory:** Retrieval deficit (recognition relatively preserved — contrasts with AD)
- **Fluctuations:** Wax-and-wane cognition with episodes of confusion — key distinguishing feature
- **BPSD:** Vivid visual hallucinations, delusions (often paranoid), RBD
- Language typically preserved until late stages

### Treatment / Intervention
- **Cholinesterase inhibitors** (rivastigmine FDA-approved for PDD; also used for DLB): cholinergic deficits are prominent; may improve cognition and BPSD
- **Memantine:** Modest evidence in DLB
- **Motor symptoms:** Levodopa (cautiously — may worsen hallucinations); avoid high doses
- **AVOID:** Dopamine D2-blocking antipsychotics (neuroleptic sensitivity — potentially fatal); use quetiapine or clozapine only if needed
- **Clonazepam / melatonin:** For RBD management
- **Non-pharmacological:** Environmental modifications, caregiver support

---

## 4. Frontotemporal Lobar Degeneration (FTLD)

### Epidemiology
- 2nd most common young-onset dementia (<65 years); equal to AD in prevalence at age 45-64
- bvFTD: mean onset 50s-60s; strong familial component (~40% have positive family history)
- FTD-ALS overlap: ~15% of FTD patients develop ALS; ~15% of ALS patients develop FTD

### Clinical Subtypes

| Variant | Core Feature | Brain Region |
|---|---|---|
| **bvFTD** | Behavioral/personality change, disinhibition, apathy, hyperorality, loss of empathy | Bilateral frontal > temporal; often right-predominant |
| **svPPA** | Loss of word meaning (semantic), fluent anomia, surface dyslexia, prosopagnosia | Left anterior temporal lobe |
| **nfvPPA** | Effortful apraxic speech, agrammatism, phonological errors | Left posterior frontal-insular (Broca area) |
| **lvPPA** | Impaired sentence repetition, word retrieval pauses, phonological WM | Left temporoparietal; often AD pathology |
| **FTD-MND/ALS** | bvFTD + upper and lower motor neuron signs | Frontal + motor cortex, spinal cord |

### Pathophysiology and Genetics
| Pathology | Protein | Genetic Associations |
|---|---|---|
| **FTLD-TDP** (~50%) | TDP-43 inclusions (Types A-E) | C9orf72 (most common), GRN, VCP |
| **FTLD-tau** (~40%) | 3R tau (Pick), 4R tau (PSP, CBD), mixed | MAPT mutations |
| **FTLD-FUS** (~5%) | FUS protein | FUS mutations (often young-onset bvFTD) |

**Key genetic causes:**
- **C9orf72:** Hexanucleotide repeat expansion (GGGGCC); most common hereditary FTD and ALS cause; FTD-ALS overlap; psychiatric features (psychosis, anxiety)
- **GRN (progranulin):** Haploinsufficiency → neurotrophic failure; often asymmetric cortical syndrome; age of onset 50s-70s
- **MAPT:** Tau protein mutations → FTLD-tau; parkinsonism features common

### Characteristic Neuropsychological Profile

**bvFTD:**
- Profound **social cognition impairment** (theory of mind, emotion recognition, empathy) — often the most discriminating feature vs. AD
- Executive dysfunction (frontal): poor planning, set-shifting, response inhibition
- **Relatively preserved episodic memory early** (hippocampus often spared)
- Verbal fluency: letter > category (opposite of AD)
- Stereotyped, perseverative behaviors; echolalia; environmental dependency

**bvFTD vs. AD early differentiation:**
| Feature | bvFTD | Alzheimer's |
|---|---|---|
| Episodic memory | Relatively spared early | Primary deficit |
| Social cognition | Severely impaired | Relatively preserved |
| Verbal fluency | Letter > category | Category > letter |
| Behavior | Disinhibition, apathy | Preserved early; anxiety |
| Insight | Often impaired | Initially preserved, then lost |

### Treatment / Intervention
- No disease-modifying treatments (no amyloid/tau FDA-approved drugs for FTLD)
- **SSRIs:** May reduce disinhibition, compulsive behaviors, and emotional lability (modest evidence)
- **Avoid antipsychotics** where possible (especially in those with tau pathology/parkinsonism)
- **Memantine, cholinesterase inhibitors:** Generally NOT effective (limited cholinergic deficit)
- **Speech therapy:** For PPA variants — augmentative communication, word retrieval strategies
- **Genetic counseling:** Essential when C9orf72, GRN, or MAPT mutation identified
- **Behavioral management:** Structured routine, distraction, environmental modification for bvFTD

---

## 5. Huntington's Disease (HD)

### Epidemiology
- Prevalence: ~5-10 per 100,000 in Western populations (higher in European descent)
- **Autosomal dominant** — 50% offspring affected
- Mean onset of motor symptoms: **35-44 years** (range: juvenile <21 to late-onset >60)
- Invariably progressive and fatal; mean survival ~15-20 years from motor onset

### Pathophysiology
**Mutant huntingtin (mHTT):** CAG repeat expansion → polyglutamine (polyQ) expansion in HTT protein → mHTT misfolds, forms nuclear inclusions → disrupts transcription (CREB-mediated gene expression), impairs mitochondrial function, triggers apoptosis, and spreads pathology.

**Selective vulnerability:** Medium spiny neurons (MSNs) of the **caudate nucleus** (especially D2-expressing indirect pathway neurons) → progressive striatal degeneration → disinhibition of thalamus → **chorea**. With progression: putamen, then cortex atrophy.

**Neuroimaging hallmark:** Caudate head atrophy → 'boxcar' or 'butterfly' ventriculomegaly (expansion of the frontal horns as the caudate shrinks).

### Genetic and Other Risk Factors
| Repeat Length | Status |
|---|---|
| <36 | Normal — no risk |
| 36-39 | Intermediate: reduced penetrance — may or may not develop HD |
| ≥40 | Full penetrance — disease is certain (timing depends on repeat length) |
| >60 | Juvenile HD (Westphal variant) — rigidity, dystonia, seizures; paternal transmission preferential |

**Anticipation:** CAG repeats expand across generations, especially through **paternal** transmission → earlier onset in successive generations.

### Clinical Staging (Total Functional Capacity Scale)
| Stage | TFC | Clinical Features |
|---|---|---|
| **I** | 11-13 | Prodromal: subtle cognitive/behavioral; early motor signs (oculomotor, chorea) |
| **II** | 7-10 | Mild: employment affected; independence maintained |
| **III** | 3-6 | Moderate: cannot work; limited independence |
| **IV** | 1-2 | Severe: requires substantial assistance |
| **V** | 0 | Total care; full dependence; terminal phase |

### Characteristic Neuropsychological Profile
- **Subcortical dementia pattern:** Psychomotor slowing, executive dysfunction, attention deficits
- **Memory:** Retrieval deficit (recognition relatively preserved) — distinct from AD encoding deficit
- **Verbal fluency:** Both category and letter impaired (striatal-frontal circuit)
- **Visuospatial:** Impaired; processing speed prominently reduced
- **Language:** Relatively preserved until late; dysarthria from motor involvement
- **Psychiatric:** Depression (~40%, most common); irritability/aggression; OCD; apathy; psychosis (less common)
- **Motor:** Chorea (involuntary writhing movements), oculomotor abnormalities (saccade initiation delay — early sign), dysarthria, dysphagia, balance impairment
- **Prodromal biomarkers:** Oculomotor saccade delays, subtle motor changes, and psychiatric symptoms precede clinical HD diagnosis

### Treatment / Intervention
- **No disease-modifying treatments** currently approved (clinical trials ongoing)
- **Chorea:** Vesicular monoamine transporter-2 inhibitors (VMAT2 — tetrabenazine, valbenazine, deutetrabenazine) reduce dopamine release → reduce chorea. Antipsychotics (quetiapine) for severe chorea + psychiatric symptoms
- **Depression/anxiety:** SSRIs, SNRIs
- **Irritability/aggression:** SSRIs, mood stabilizers, low-dose antipsychotics
- **OCD:** SSRIs, CBT
- **Psychosis:** Quetiapine (preferred), risperidone
- **Motor rehabilitation:** Physical therapy (gait, balance), speech therapy (dysarthria, dysphagia), occupational therapy
- **Genetic counseling:** Pre-symptomatic testing available; complex ethical considerations (predictive test for inevitably fatal disease); psychological support essential

---

## 6. Normal Pressure Hydrocephalus (NPH)

### Epidemiology
- Prevalence increases with age: ~3-4% of those >65 with cognitive impairment
- Under-recognized and under-treated despite potential reversibility
- **Idiopathic NPH (iNPH):** Adults >60; no identified cause
- **Secondary NPH:** Follows SAH, meningitis, head trauma, aqueductal stenosis

### Pathophysiology
Impaired CSF reabsorption at the arachnoid granulations → ventricular enlargement despite normal CSF opening pressure (≤20 cmH₂O on LP). Enlarged ventricles stretch and compress periventricular white matter tracts — especially those connecting frontal cortex to basal ganglia, thalamus, and spinal cord → frontal-subcortical syndrome + gait apraxia + bladder dysfunction.

### Genetic and Other Risk Factors
- No specific genetic cause for iNPH identified
- Associated with: prior head trauma, SAH, meningitis, cardiac surgery, aqueductal stenosis

### Clinical Staging / Diagnosis
**Hakim-Adams Triad:**
1. **Gait disturbance** (most prominent/earliest): Magnetic/apraxic gait — short shuffling steps, wide-based, difficulty initiating, en-bloc turning, frequent falls; resembles parkinsonism
2. **Urinary incontinence:** Frontal disinhibition + loss of cortical bladder control; urgency first, then incontinence
3. **Cognitive impairment:** Frontal-subcortical dementia (executive dysfunction, psychomotor slowing, apathy)

**Diagnostic workup:**
- MRI: Ventriculomegaly disproportionate to sulcal widening (Evans index >0.3); DESH pattern (disproportionately enlarged subarachnoid spaces in the high-convexity)
- Large volume LP (30-50 mL): Gait improvement after drainage predicts shunt response
- Extended lumbar drainage or infusion testing in uncertain cases

### Characteristic Neuropsychological Profile
- Executive dysfunction: working memory, planning, mental flexibility, processing speed
- Psychomotor slowing (bradyphrenia)
- Attention and concentration deficits
- Memory: retrieval deficit (improves with cues); less severe than AD
- Language: relatively preserved
- Apathy prominent; depression common
- All features are **potentially reversible with VP shunting** — gait responds best, cognition moderately, incontinence variably

### Treatment
- **Ventriculoperitoneal (VP) shunt:** Primary treatment; gait improvement is most robust and rapid; cognitive improvement develops over months
- **Large-volume LP (therapeutic):** Temporary improvement confirms shunt candidacy
- **Programmable valves:** Allow post-operative pressure adjustment without re-operation

---

## 7. Traumatic Brain Injury (TBI) and CTE

### Epidemiology
- ~2.8 million TBI-related ED visits, hospitalizations, and deaths per year in the US
- Leading causes: falls (#1, especially in elderly), MVAs, sports, violence
- Mild TBI (concussion): 75-90% of all TBI cases
- CTE: Diagnosed at autopsy; estimated prevalence in former contact sport athletes (esp. football) is substantial but exact rates in the general population unknown

### TBI Severity Classification
| Severity | GCS | LOC | PTA |
|---|---|---|---|
| **Mild (concussion)** | 13-15 | <30 min | <24 hours |
| **Moderate** | 9-12 | 30 min – 24 hours | 1-7 days |
| **Severe** | ≤8 | >24 hours | >7 days |

**Post-traumatic amnesia (PTA) duration** is the strongest predictor of long-term functional outcome.

### Pathophysiology
**Primary injury:** Mechanical forces → diffuse axonal injury (DAI — axonal shearing at gray-white junctions), focal contusions (temporal and frontal poles most common), hemorrhage.

**Secondary injury (minutes-days):** Excitotoxicity (glutamate release), ion imbalance, mitochondrial dysfunction, free radical production, blood-brain barrier breakdown, neuroinflammation, cerebral edema.

**CTE pathophysiology:** Repetitive subconcussive impacts → repetitive axonal injury → tau accumulation (perivascular, sulcal depths) → progressive tauopathy spreading from sulcal epicenters. CTE is definitively diagnosed only at **autopsy** — antemortem biomarkers (plasma p-tau217, tau PET) are under investigation.

### Genetic and Other Risk Factors
- **APOE ε4:** Worse outcome after TBI; may accelerate CTE-related tau pathology
- Age, prior TBI, substance use, pre-existing psychiatric conditions worsen outcomes
- **Number and severity of impacts:** Primary risk factor for CTE — cumulative subconcussive exposure, not just diagnosed concussions

### Clinical Staging / Presentations
| Presentation | Key Features |
|---|---|
| **Acute concussion** | Headache, dizziness, nausea, confusion, amnesia (RA + AA), light/noise sensitivity |
| **Post-concussion syndrome (PCS)** | Symptoms persisting >3 months; headache (#1), cognitive complaints, mood, sleep |
| **Moderate-severe TBI** | Longer PTA; frontal-executive deficits; memory impairment; behavioral dysregulation |
| **Second impact syndrome** | 2nd concussion before recovery → catastrophic edema; predominantly adolescents |
| **CTE** | Behavioral/mood changes → cognitive decline; motor symptoms late; found at autopsy |

### Characteristic Neuropsychological Profile
**Mild TBI:** Attention/concentration, processing speed, working memory — typically normalizes within weeks; persistent symptoms in post-concussion syndrome tied to biopsychosocial factors

**Moderate-Severe TBI:** Executive dysfunction (frontal most vulnerable to DAI), processing speed, learning and memory, attention; behavioral dysregulation, impulsivity, emotional lability; anosognosia (reduced awareness of deficits)

**CTE (clinical, before death):** Mood/behavioral changes (irritability, impulsivity, depression, suicidality), cognitive decline, motor symptoms (parkinsonism, ataxia) in late stages

### Treatment / Intervention
- **Acute:** Symptom management (rest, graduated return to activity/sport — protocol-based), avoid NSAID and anticoagulants acutely, manage ICP in severe TBI
- **PCS:** Graduated exercise (now shown to accelerate recovery — NOT full rest); cognitive rehabilitation; treat mood/sleep comorbidities; psychoeducation
- **Moderate-severe TBI:** Inpatient rehab, cognitive rehabilitation (errorless learning, compensatory strategies), vocational rehabilitation
- **CTE:** No disease-modifying treatment; symptomatic management of mood and behavior; awareness/prevention (helmet use, rule changes)
- **Return-to-play protocols:** Stepwise, graduated — must be symptom-free at rest before advancing; full protocol before return to contact sport

---

## 8. Prion Diseases

### Epidemiology
- Extremely rare: ~1-2 cases per million per year (CJD)
- Sporadic CJD (sCJD): ~85% of all prion disease; median onset 60s
- Familial CJD: ~10-15% (PRNP mutations)
- Variant CJD (vCJD): <250 cases worldwide; associated with BSE exposure (UK, 1990s); younger patients (mean age ~28)
- **Invariably fatal** — no treatments alter disease course

### Pathophysiology
Normal prion protein (PrPc) is a cell surface glycoprotein of uncertain function. PrPsc (misfolded conformer) is protease-resistant and acts as a template that converts PrPc → PrPsc in a self-propagating cascade. This causes spongiform degeneration (neuronal vacuolation, astrocytosis, spongiform holes), neuronal loss, and death. No virus or bacteria — the infectious agent is solely a misfolded protein.

### Genetic and Other Risk Factors
- **PRNP codon 129 polymorphism:** MM homozygosity (methionine/methionine) is a risk factor for sCJD and required for vCJD susceptibility
- **PRNP mutations:** Familial CJD, Gerstmann-Sträussler-Scheinker (GSS), Fatal Familial Insomnia (FFI)
- **Iatrogenic:** Contaminated neurosurgical instruments, dura mater grafts, corneal transplants, cadaveric pituitary hormones

### Clinical Staging
**Sporadic CJD:** Prodrome (anxiety, depression, insomnia) → rapidly progressive dementia (weeks-months) → myoclonus → akinetic mutism → death. Median survival: **4-6 months**; >90% dead within 1 year.

**Variant CJD:** Psychiatric prodrome (anxiety, depression, behavioral change) → painful sensory symptoms → cerebellar ataxia → dementia → myoclonus → death. Slower than sCJD; median survival ~13 months.

### Characteristic Neuropsychological Profile
- **Rapidly progressive dementia:** Cognitive decline over weeks to months (not years) — a key red flag
- Cortical features: visuospatial impairment, cortical blindness (Heidenhain variant), aphasia, apraxia, amnesia — developing rapidly
- Cerebellar ataxia: prominent in many cases
- Psychiatric: anxiety, depression, personality change — often the presenting complaint
- Myoclonus: startle-sensitive; highly characteristic

### Diagnostic Biomarkers
| Biomarker | Sensitivity | Notes |
|---|---|---|
| **CSF 14-3-3 protein** | ~85-94% | Non-specific; also elevated in stroke, encephalitis |
| **RT-QuIC** (real-time quaking-induced conversion) | >97% specificity | Detects prion seeding activity; nasal brushings also useful |
| **MRI DWI** | Cortical ribboning; basal ganglia/thalamic hyperintensities | Pulvinar sign (hockey-stick) in vCJD |
| **EEG** | Periodic sharp wave complexes (1-2 Hz) | Characteristic of sCJD; less common in vCJD |

### Treatment / Intervention
- No disease-modifying treatments available
- Supportive/palliative care only
- Public health notification and body fluid precautions (blood, CSF, brain tissue)
- **Genetic counseling** for familial PRNP mutation carriers

---

## 9. Progressive Supranuclear Palsy (PSP)

### Epidemiology
- Prevalence: ~5-6 per 100,000; mean onset ~63 years
- Often misdiagnosed initially as PD; mean time to correct diagnosis ~3-4 years
- Prognosis: Mean survival ~7 years from onset

### Pathophysiology
4-Repeat (4R) tauopathy — predominantly 4R tau isoform aggregates in: globus pallidus, subthalamic nucleus, substantia nigra, cerebellum (dentate nucleus), brainstem nuclei (superior colliculus, periaqueductal gray), and frontal cortex. Tau forms NFTs, tuft-shaped astrocytes, and coiled bodies. Neuroimaging hallmark: **midbrain atrophy** → hummingbird sign (sagittal MRI) and morning glory sign (axial).

### Genetic and Other Risk Factors
- No major single-gene cause identified for sporadic PSP
- **MAPT H1 haplotype:** Strong genetic risk factor for PSP (and CBD) — influences 4R tau splicing

### Clinical Staging
- PSP-Richardson syndrome (most common): Early falls within first year + vertical gaze palsy → progressive motor and cognitive decline → dysphagia, dysarthria, akinetic mutism → death ~7 years
- Other phenotypes: PSP-parkinsonism (mimics PD), PSP-pure akinesia with gait freezing (PAGF), PSP-CBS, PSP-PPA

### Characteristic Neuropsychological Profile
- **Frontal-subcortical dementia:** Executive dysfunction (planning, set-shifting, response inhibition), apathy, perseveration
- Bradyphrenia (psychomotor slowing)
- Memory: Retrieval deficit; relatively preserved encoding
- Language: Dysarthria (hypokinetic) early; mild aphasia may develop
- **Oculomotor:** Impaired downward vertical saccades (cardinal early sign), square wave jerks
- **Psychiatric:** Apathy (most prominent psychiatric feature), pseudobulbar affect (emotional incontinence)
- Falls: Backward falls in the first year are highly characteristic

### Treatment / Intervention
- No disease-modifying treatments
- **Levodopa:** Partial and transient benefit in some (especially PSP-P subtype); less responsive than PD
- Falls prevention: Physical therapy, weighted walkers, environmental modification
- Dysphagia: Speech therapy, modified diet, PEG tube consideration in late stages
- Pseudobulbar affect: SSRIs, dextromethorphan/quinidine combination
- Eye movement: Prism glasses for downgaze difficulties

---

## 10. Corticobasal Syndrome (CBS) / Corticobasal Degeneration (CBD)

### Epidemiology
- Rare: ~1-2 per 100,000; mean onset ~63 years
- Mean survival: ~6-8 years
- CBS is a clinical syndrome — pathology may be CBD, PSP, AD, or FTLD-TDP

### Pathophysiology
CBD: 4R tauopathy — astrocytic plaques (unique to CBD), ballooned (achromatic) neurons, tau-positive NFTs and oligodendroglial coiled bodies. Distribution: asymmetric frontoparietal cortex + basal ganglia. MAPT H1 haplotype is a risk factor.

### Characteristic Neuropsychological Profile
- Pronounced **asymmetry** — one side much more affected
- Ideomotor apraxia (inability to pantomime tool use despite knowing what it is)
- Cortical sensory loss: astereognosis, graphesthesia loss, extinction
- **Alien limb phenomenon:** The limb moves involuntarily and purposelessly — patient reports it "has a mind of its own"
- Myoclonus (stimulus-sensitive), dystonia
- Executive dysfunction, attention deficits
- Memory relatively preserved early
- Aphasia may develop (especially nfvPPA if left-sided)

### Treatment / Intervention
- No disease-modifying treatments
- Clonazepam for myoclonus
- Occupational therapy for apraxia and self-care
- Physical therapy for dystonia/rigidity
- Botulinum toxin for focal dystonia
- Dystonia: Levodopa rarely helps; baclofen, trihexyphenidyl

---

## 11. Wernicke-Korsakoff Syndrome

### Epidemiology
- Caused by thiamine (B1) deficiency — primarily from chronic alcohol use disorder, malnutrition, malabsorption, chemotherapy, bariatric surgery
- Wernicke's encephalopathy is an acute, medical emergency; Korsakoff syndrome is the chronic sequela
- ~25% of patients with Wernicke's develop Korsakoff syndrome; permanent amnesia in ~80% if not treated early

### Pathophysiology
Thiamine is a cofactor for pyruvate dehydrogenase and α-ketoglutarate dehydrogenase — critical for oxidative glucose metabolism. Deficiency → energy failure and excitotoxic necrosis in metabolically vulnerable regions: **mammillary bodies, dorsomedial thalamus, periaqueductal gray, floor of fourth ventricle**. Mammillary body and dorsomedial thalamus damage → dense amnesia.

### Clinical Presentation
**Wernicke's encephalopathy (acute triad):**
1. Confusion/encephalopathy
2. Oculomotor dysfunction (nystagmus, CN VI palsy, gaze palsy)
3. Ataxia (cerebellar/vestibular)
**TREAT EMERGENTLY WITH IV THIAMINE — before glucose administration**

**Korsakoff syndrome (chronic):**
- Dense anterograde amnesia (cannot form new memories)
- Retrograde amnesia (variable — may have temporal gradient)
- **Confabulation** (unintentional fabrication of memories to fill gaps)
- Relatively intact procedural memory and intelligence
- Apathy, lack of insight into amnesia

### Neuropsychological Profile
- **Profound anterograde amnesia** — the defining feature; patient cannot learn new information
- Retrograde amnesia: often with temporal gradient (recent more impaired than remote)
- Confabulation: more common in acute phases; decreases over time
- Executive dysfunction (frontal involvement in chronic alcohol use)
- Procedural learning intact (preserved basal ganglia and cerebellum)
- Intelligence relatively preserved (scattered knowledge intact)

### Treatment
- Acute: High-dose IV thiamine immediately (before glucose) → reversal of Wernicke's in most
- Chronic Korsakoff: Oral thiamine maintenance; abstinence from alcohol
- Cognitive rehabilitation: memory aids, structured environment, errorless learning`;

  const [sg] = await db.insert(studyGuidesTable).values({
    topicId: TOPIC_ID,
    title: "Neurocognitive Disorders — Comprehensive Study Guide",
    content: sgContent,
  }).returning();
  console.log(`  ✓ Study guide id=${sg.id}`);

  // Practice exam
  const [exam] = await db.insert(practiceExamsTable).values({
    topicId: TOPIC_ID,
    title: "Neurocognitive Disorders Practice Exam",
    timeLimit: 90,
    passingScore: 70,
  }).returning();

  const allQsFromDb = await db.select({ id: quizQuestionsTable.id }).from(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, TOPIC_ID));
  await db.insert(practiceExamQuestionsTable).values(allQsFromDb.map((q, i) => ({ examId: exam.id, questionId: q.id, questionOrder: i + 1 })));
  console.log(`  ✓ Practice exam with ${allQsFromDb.length} questions`);

  console.log(`\n✅ Neurocognitive Disorders fully reworked!`);
  console.log(`   Flashcards: ${insertedFC.length} | Questions: ${insertedQs.length} | Study guide: updated | Exam: updated`);
}

rework().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
