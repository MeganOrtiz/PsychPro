import { db } from "./index";
import { eq } from "drizzle-orm";
import { topicsTable, studyGuidesTable, flashcardsTable, quizQuestionsTable } from "./schema";

// ================================================================
// COMPREHENSIVE DSM-5 PSYCHIATRIC DISORDERS EXPANSION
// Renames topic 10, rebuilds study guide, adds flashcards & quizzes.
// Excludes Neurodevelopmental (topic 19) and Neurocognitive (topic 15).
// ================================================================

const TOPIC_ID = 10;
const GUIDE_ID = 10;

const STUDY_GUIDE = `## Classification Systems and Foundations

The **DSM-5-TR** (Diagnostic and Statistical Manual, 5th Edition, Text Revision) provides categorical diagnoses based on operationalized clinical criteria, with dimensional severity ratings layered onto most categories. The **ICD-11** is the international equivalent. Both systems are evolving toward dimensional conceptualizations — recognizing that mental disorders exist on continua and share common neurobiological substrates (the **RDoC** framework explicitly organizes research around transdiagnostic neural circuits and behavioral domains rather than DSM categories).

**Major DSM-5 changes from DSM-IV:**
- Removal of the multiaxial system
- Autism spectrum consolidation (Asperger's, autistic disorder, PDD-NOS → ASD)
- ADHD now diagnosable in adults; symptom threshold reduced to 5 (was 6) for adults
- PTSD moved from anxiety disorders to a new **Trauma- and Stressor-Related Disorders** chapter
- OCD given its own chapter (**Obsessive-Compulsive and Related Disorders**)
- Substance abuse + dependence collapsed into a single **Substance Use Disorder** with severity specifier
- Bereavement exclusion removed from MDD
- Catatonia recognized as a cross-diagnostic specifier rather than a schizophrenia subtype
- Hoarding, binge-eating disorder, DMDD, PMDD, and excoriation added as standalone diagnoses

This guide covers the major DSM-5 diagnostic categories. **Neurodevelopmental disorders** (ADHD, ASD, intellectual disability, learning, communication) and **neurocognitive disorders** (delirium, AD, VCI, DLB/PDD, FTD, etc.) are covered in their own dedicated topics.

## Schizophrenia Spectrum and Other Psychotic Disorders

### Schizophrenia — Diagnostic Criteria

Two or more of the following for at least 1 month (active phase), with at least one being **(1), (2), or (3)**:

1. Delusions
2. Hallucinations
3. Disorganized speech
4. Grossly disorganized or catatonic behavior
5. Negative symptoms

Plus: significant social/occupational dysfunction; **continuous signs for at least 6 months** (including the 1-month active phase, with prodromal/residual periods counting toward the 6 months); not better explained by schizoaffective, mood disorder with psychotic features, substance use, or another medical condition.

### Symptom Dimensions

**Positive symptoms** — excess or distortion of normal functions:
- **Hallucinations:** Most commonly auditory (command hallucinations, commenting voices, conversing voices); can also be visual, olfactory, somatic, or tactile
- **Delusions:** Fixed false beliefs — persecutory (most common), referential, grandiose, somatic, erotomanic, thought broadcasting/insertion/withdrawal, delusions of control
- **Disorganized speech:** Looseness of associations, tangentiality, circumstantiality, neologisms, word salad, clanging, derailment
- **Grossly disorganized behavior:** Bizarre dress, public masturbation, unprovoked agitation
- **Catatonic behavior:** Stupor, mutism, posturing, waxy flexibility, echolalia, echopraxia

**Negative symptoms** (the **5 A's**):
- **Alogia:** Poverty of speech or speech content
- **Affective blunting:** Reduced emotional expression
- **Anhedonia:** Inability to experience pleasure
- **Avolition:** Lack of motivation, goal-directed activity
- **Asociality:** Social withdrawal

**Cognitive symptoms** (most predictive of long-term functional outcome):
Working memory, verbal learning and memory, processing speed, executive function, sustained attention, and social cognition — averaging 1.5–2 SD below healthy controls. Current antipsychotics do not adequately address cognitive symptoms.

### Neurobiological Models

**Dopamine hypothesis:** Mesolimbic D2 hyperactivity → positive symptoms; mesocortical hypoactivity → negative and cognitive symptoms. Evidence: every effective antipsychotic blocks D2; dopaminergic agents (amphetamine, cocaine, L-DOPA) can induce psychosis; PET shows elevated presynaptic dopamine synthesis capacity in patients.

**Glutamate / NMDA hypothesis:** NMDA receptor hypofunction disinhibits dopamine release and directly produces negative/cognitive symptoms. Evidence: PCP and ketamine (NMDA antagonists) reproduce the full syndrome — including negative and cognitive features that D2 blockers cannot produce. Parvalbumin-positive fast-spiking GABA interneurons are particularly NMDA-dependent — their hypofunction → cortical desynchronization and excitation/inhibition imbalance.

**Neurodevelopmental model:** Risk factors include prenatal infection (especially second-trimester influenza), obstetric complications, urban birth, adolescent cannabis exposure, advanced paternal age, and migration. Subtle premorbid cognitive deficits and social withdrawal precede the first psychotic break by years.

**Structural brain changes:** Enlarged lateral and third ventricles, reduced prefrontal gray matter (frontal hypofunction on PET), reduced hippocampal and amygdala volume, reduced thalamic volume, and decreased cortical thickness — present before antipsychotic exposure, implying these are part of the disease process.

### Other Schizophrenia Spectrum Disorders

| Disorder | Duration | Key Distinguishing Feature |
|---|---|---|
| **Brief psychotic disorder** | ≥1 day to <1 month | Full return to premorbid function; often follows marked stressor (brief reactive psychosis) |
| **Schizophreniform disorder** | 1 to <6 months | Same psychotic criteria as schizophrenia but shorter duration; functional decline not required |
| **Schizophrenia** | ≥6 months total | Active phase plus prodromal/residual; functional decline required |
| **Schizoaffective disorder** | Mood episode meets criteria, AND psychosis ≥2 weeks WITHOUT mood symptoms | Bridges schizophrenia and mood disorder; bipolar or depressive subtype |
| **Delusional disorder** | ≥1 month | One or more delusions; functioning otherwise preserved; non-bizarre or bizarre subtypes (erotomanic, grandiose, jealous, persecutory, somatic, mixed) |
| **Schizotypal personality disorder** | Lifelong pattern | Cognitive/perceptual oddness, social deficits, magical thinking — falls within the spectrum genetically; coded as a personality disorder |

**Substance/medication-induced psychotic disorder:** Stimulants, cannabis, hallucinogens, alcohol withdrawal, corticosteroids, anticholinergics. Symptoms typically resolve with cessation; persistence >1 month suggests primary psychosis.

**Psychotic disorder due to another medical condition:** Temporal lobe epilepsy, CNS tumors/infections, lupus, Huntington's disease, autoimmune encephalitis (anti-NMDA receptor encephalitis classically presents as a young woman with psychosis, seizures, dyskinesias, and dysautonomia).

### Catatonia (Cross-Diagnostic)

DSM-5 allows catatonia to be diagnosed across many disorders (mood, psychotic, substance, medical). Requires three or more of: stupor, catalepsy, waxy flexibility, mutism, negativism, posturing, mannerism, stereotypy, agitation, grimacing, echolalia, echopraxia.

**Malignant catatonia** — with autonomic instability and hyperthermia — is **life-threatening**. First-line treatment is a **lorazepam challenge** (often dramatically effective); second-line is **ECT**. Antipsychotics may worsen catatonia and should be used with caution.

## Bipolar and Related Disorders

### Manic Episode (DIGFAST mnemonic)

Distinct period of abnormally elevated, expansive, or irritable mood **AND** abnormally increased goal-directed activity or energy, lasting **≥1 week** (any duration if hospitalization required), most of the day nearly every day. During the period, three or more of the following (four if mood only irritable):

- **D**istractibility
- **I**nsomnia (decreased need for sleep — feels rested after 2–3 hours)
- **G**randiosity / inflated self-esteem
- **F**light of ideas / racing thoughts
- **A**ctivity increase (goal-directed) / psychomotor agitation
- **S**peech pressured / more talkative than usual
- **T**houghtlessness (excessive involvement in high-risk activities — spending sprees, sexual indiscretions, foolish business deals)

The episode causes marked impairment, may require hospitalization, or has psychotic features. **DSM-5 added the increased-energy/activity requirement to Criterion A** to reduce over-diagnosis.

### Hypomanic Episode

Same symptom list, but only **≥4 consecutive days**, with unequivocal change observable by others, **NOT severe enough** to cause marked impairment or require hospitalization. Psychotic features by definition convert the episode to manic.

### Bipolar Disorders

| Disorder | Required Episodes | Notes |
|---|---|---|
| **Bipolar I** | At least one **manic** episode (lifetime) | Depressive episodes common but not required |
| **Bipolar II** | At least one **hypomanic** AND one **major depressive** episode; never a manic episode | Not "milder" — depressive episodes often severe; high suicide risk |
| **Cyclothymic disorder** | ≥2 years (1 year in youth) of subthreshold hypomanic and depressive symptoms; never met full criteria for any episode | Symptoms present at least half the time, never asymptomatic >2 months |

**Specifiers:** with anxious distress; with mixed features; with rapid cycling (≥4 mood episodes in prior 12 months); with melancholic features; with atypical features; with catatonia; with peripartum onset; with seasonal pattern; with psychotic features (mood-congruent or mood-incongruent).

**Substance/medication-induced bipolar:** Antidepressant-emergent mania **persisting beyond the physiological effect** of the medication is sufficient evidence for a bipolar diagnosis.

**Bipolar due to another medical condition:** MS, stroke, TBI, hyperthyroidism, Cushing's, neoplasms.

### Treatment Highlights

- **Mood stabilizers:** Lithium (gold standard; reduces suicide risk; narrow therapeutic window 0.6–1.2 mEq/L; toxicity at >1.5; monitor renal and thyroid function), valproate (avoid in pregnancy — neural tube defects), lamotrigine (especially for bipolar depression; titrate slowly to avoid Stevens–Johnson syndrome), carbamazepine.
- **Atypical antipsychotics:** Quetiapine, olanzapine, aripiprazole, lurasidone, cariprazine — used for acute mania, mixed states, and bipolar depression.
- **Antidepressant monotherapy is contraindicated** in bipolar I — risk of induced mania and rapid cycling.
- **Kindling model:** Each mood episode lowers the threshold for the next; early aggressive treatment is neuroprotective.

**Clinical pearl:** Patients rarely present in hypomania (they feel great) — they present in depression. Always screen depressed patients for past hypomania to avoid missing bipolar II. A single lifetime manic episode is sufficient for bipolar I; no depressive episode required.

## Depressive Disorders

### Major Depressive Disorder (SIGECAPS mnemonic)

Five or more symptoms during the same **2-week period** representing a change from previous functioning; at least one must be **(1) depressed mood** OR **(2) anhedonia**:

- **S**leep — insomnia or hypersomnia
- **I**nterest — anhedonia
- **G**uilt — worthlessness or excessive/inappropriate guilt (may be delusional)
- **E**nergy — fatigue or loss of energy
- **C**oncentration — diminished thinking or indecisiveness
- **A**ppetite — significant weight or appetite change (>5% body weight in a month)
- **P**sychomotor agitation or retardation (observable by others)
- **S**uicidality — recurrent thoughts of death, suicidal ideation, plan, or attempt

Plus depressed mood most of the day, nearly every day. Causes clinically significant distress or impairment; not attributable to a substance or medical condition; never a manic or hypomanic episode (substance-induced manic-like episodes do not count).

**Specifiers:** with anxious distress; with mixed features; with melancholic features; with atypical features; with psychotic features (mood-congruent or mood-incongruent); with catatonia; with peripartum onset (during pregnancy or within 4 weeks postpartum); with seasonal pattern.

**DSM-5 removed the bereavement exclusion** — grief and MDD can co-occur and both be diagnosed.

### Persistent Depressive Disorder (Dysthymia)

Depressed mood **most of the day, more days than not, for ≥2 years** (≥1 year in youth, where mood may be irritable), with at least two of: poor appetite/overeating, insomnia/hypersomnia, low energy, low self-esteem, poor concentration, hopelessness. Never asymptomatic >2 months. **DSM-5 combined dysthymia and chronic MDD** under this heading.

### Disruptive Mood Dysregulation Disorder (DMDD)

Created in DSM-5 partly to combat over-diagnosis of pediatric bipolar disorder. Severe recurrent temper outbursts (≥3/week) grossly out of proportion, plus persistently irritable/angry mood between outbursts, present ≥12 months in ≥2 settings. **Onset before age 10; never diagnosed before age 6 or after age 18.** Cannot coexist with ODD, IED, or bipolar disorder.

### Premenstrual Dysphoric Disorder (PMDD)

Five or more symptoms in the final premenstrual week, improving within days of menses onset, minimal/absent postmenses. At least one must be from the affective cluster (lability, irritability, depressed mood, anxiety). **Confirmed by prospective daily ratings over ≥2 cycles.** Elevated to a full disorder in DSM-5.

### Substance/Medication-Induced and Medical Depressive Disorders

- **Substance/medication-induced:** alcohol, sedatives, interferon, corticosteroids, beta-blockers, hormonal contraceptives, opioids
- **Due to medical condition:** hypothyroidism, stroke, Parkinson's, MS, Cushing's, pancreatic cancer, OSA

### Neurobiology of Depression

**Monoamine hypothesis:** Reduced synaptic availability of serotonin, norepinephrine, and dopamine. Evidence: SSRIs/SNRIs/TCAs/MAOIs all increase monoamines; reserpine (which depletes monoamines) induces depression. Limitation: monoamine effects are immediate; clinical response takes weeks — implicating downstream changes.

**Neuroplasticity / neurotrophic hypothesis:** Reduced **BDNF**, hippocampal atrophy, and impaired neurogenesis in the dentate gyrus. Antidepressants and ECT increase BDNF and restore hippocampal volume. Stress (cortisol) is neurotoxic to hippocampal neurons.

**Inflammatory/immune hypothesis:** Elevated IL-6, TNF-alpha, CRP in many depressed patients. Sickness-behavior model — cytokines cross the blood–brain barrier and induce anhedonia, fatigue, and social withdrawal. Interferon-alpha treatment for hepatitis C reliably induces depression.

**HPA axis dysregulation:** Hypercortisolemia, blunted dexamethasone suppression. Early-life stress sensitizes the HPA axis lifelong.

**Network-level findings:** Hyperactive **default mode network** (rumination), hypoactive **central executive network** (cognitive control), abnormal **salience network** switching. Subgenual anterior cingulate (Brodmann area 25 — note: targeted in DBS for treatment-resistant depression) is hyperactive in depression.

**Cognitive and behavioral models:**
- **Beck's cognitive triad:** negative views of the self, the world, and the future
- **Learned helplessness (Seligman):** uncontrollable aversive experience → passive resignation; later reformulated as attributional style (internal, stable, global attributions for negative events)
- **Behavioral activation:** depression maintained by avoidance and loss of positive reinforcement; treatment focuses on rebuilding rewarding activity

### Treatment

- **First-line:** SSRIs (sertraline, escitalopram, fluoxetine), SNRIs (venlafaxine, duloxetine), CBT, behavioral activation, exercise
- **Other agents:** Bupropion (NDRI; activating; lowers seizure threshold; avoid in eating disorders), mirtazapine (5-HT2/H1 antagonist; sedating, weight gain), atypical augmentation (aripiprazole, quetiapine), lithium augmentation
- **Refractory depression:** ECT (highest response rate; first-line for catatonic, psychotic, severe suicidal, peripartum); rTMS (FDA-approved for medication-resistant MDD); ketamine/esketamine (rapid antidepressant via NMDA antagonism / glutamate surge → BDNF release); VNS; DBS (subgenual ACC)

**Red flag:** Always assess for suicidal ideation, plan, intent, and access to means. The post-discharge period from an inpatient depression admission is itself a high-risk window for suicide.

## Anxiety Disorders

Anxiety disorders share **excessive fear** (response to imminent threat) **and anxiety** (anticipation of future threat) with related behavioral disturbances. They differ from normal fear/anxiety by being excessive or persistent beyond developmentally appropriate periods.

### Diagnostic Summary Table

| Disorder | Core Feature | Duration |
|---|---|---|
| **Separation anxiety disorder** | Developmentally inappropriate fear of separation from attachment figures | ≥4 weeks (children); ≥6 months (adults) |
| **Selective mutism** | Consistent failure to speak in specific social situations despite speaking elsewhere | ≥1 month (not limited to first month of school) |
| **Specific phobia** | Marked fear of a specific object/situation, almost always provoking anxiety | ≥6 months |
| **Social anxiety disorder** | Marked fear of social/performance situations involving possible scrutiny | ≥6 months |
| **Panic disorder** | Recurrent unexpected panic attacks + ≥1 month of worry or behavioral change | — |
| **Agoraphobia** | Marked fear of ≥2 of 5 situations (transit, open spaces, enclosed spaces, lines/crowds, being out alone) | ≥6 months |
| **Generalized anxiety disorder (GAD)** | Excessive uncontrollable worry about multiple domains, plus ≥3 of 6 symptoms | ≥6 months, more days than not |

### Specific Phobia Subtypes

- **Animal** (spiders, dogs, snakes)
- **Natural environment** (heights, storms, water)
- **Blood-injection-injury (BII)** — uniquely associated with vasovagal fainting; treated with **applied tension** to maintain blood pressure
- **Situational** (planes, elevators, enclosed spaces)
- **Other** (choking, vomiting, loud sounds, costumed characters)

### GAD Symptoms (need 3 of 6 in adults; 1 in children)

Restlessness, easy fatigability, concentration difficulty, irritability, muscle tension, sleep disturbance.

### Panic Disorder

Recurrent **unexpected** panic attacks (only unexpected attacks count toward diagnosis) plus **≥1 month** of persistent worry about further attacks or maladaptive behavioral change. A panic attack: abrupt surge of intense fear/discomfort peaking within minutes, with **≥4 of 13 symptoms** (palpitations, sweating, trembling, shortness of breath, choking, chest pain, nausea, dizziness, chills/heat, paresthesias, derealization/depersonalization, fear of losing control, fear of dying).

**Neurobiology:** "Suffocation alarm" — brainstem chemoreceptor hypersensitivity to CO2 → amygdala activation → panic. Locus coeruleus norepinephrine hyperactivation. Sodium lactate infusion and CO2 inhalation provoke attacks in susceptible individuals.

**Treatment:** SSRIs (first-line); SNRI (venlafaxine); benzodiazepines for short-term acute relief (avoid long-term); CBT with **interoceptive exposure** (deliberate provocation of feared bodily sensations to extinguish catastrophic interpretation).

### Agoraphobia

Now a **standalone diagnosis** in DSM-5 (separated from panic disorder). Many patients have agoraphobia without a panic disorder history. Fear of escape difficulty or unavailability of help in the event of panic-like or incapacitating symptoms.

### Substance/Medication-Induced and Medical Anxiety

- **Substances:** caffeine, stimulants, cannabis, alcohol/BZD withdrawal, corticosteroids, thyroid medications
- **Medical conditions:** hyperthyroidism, pheochromocytoma, hypoglycemia, cardiopulmonary disease, asthma

**Red flag:** New-onset anxiety in a previously calm older adult warrants medical workup — TSH, cardiac evaluation, medication review — before psychiatric attribution.

### Anxiety Treatment Overview

- **First-line:** SSRIs/SNRIs + CBT (exposure-based)
- **Short-term:** Benzodiazepines for acute relief — avoid chronic use (tolerance, dependence, cognitive impairment, falls in older adults)
- **Other:** Buspirone (5-HT1A partial agonist; non-sedating; takes weeks); pregabalin (GAD); beta-blockers (performance situational anxiety only)

## Obsessive-Compulsive and Related Disorders

Separated from anxiety disorders in DSM-5. Shared feature: repetitive thoughts and/or behaviors.

### Obsessive-Compulsive Disorder (OCD)

**Obsessions:** Recurrent, intrusive, unwanted thoughts/urges/images causing marked distress. The individual attempts to ignore, suppress, or neutralize them (often with a compulsion).

**Compulsions:** Repetitive behaviors (handwashing, ordering, checking) or mental acts (counting, praying, repeating) the individual feels driven to perform; aimed at preventing distress or a feared event but not realistically connected or clearly excessive.

Symptoms are time-consuming (>1 hour/day) or cause clinically significant distress/impairment. **Ego-dystonic** — the individual usually recognizes obsessions as excessive (insight specifier ranges from good/fair → poor → absent/delusional).

**Neural circuit:** Cortico-striato-thalamo-cortical (**CSTC**) loop dysfunction — hyperactivation of orbitofrontal cortex → ventromedial caudate → thalamus → back to OFC, forming a positive-feedback loop. The OFC hyperactivity behaves as an "error signal" that won't reset. Modulated by serotonin.

**Treatment:**
- **First-line:** **Exposure and response prevention (ERP)** + SSRI (often higher doses than for depression — fluoxetine 60–80 mg, sertraline 200 mg)
- **Second-line:** Clomipramine (TCA with strong serotonin reuptake inhibition)
- **Augmentation:** Atypical antipsychotics (aripiprazole, risperidone) — particularly when tic-related
- **Refractory:** DBS (typically targeting the ventral capsule/ventral striatum or nucleus accumbens), TMS

### Related Disorders

| Disorder | Core Feature | Key Treatment |
|---|---|---|
| **Body dysmorphic disorder (BDD)** | Preoccupation with perceived physical defect not observable to others; repetitive checking, comparing, mirror behavior; **muscle dysmorphia** subtype | SSRIs, ERP-based CBT |
| **Hoarding disorder** | Persistent difficulty discarding possessions; clutter compromises living areas | CBT (cognitive restructuring + sorting/discarding practice); SSRIs less effective than for OCD |
| **Trichotillomania (hair-pulling)** | Recurrent pulling resulting in hair loss; repeated attempts to stop | **Habit reversal training** |
| **Excoriation (skin-picking)** | Recurrent skin picking causing lesions; repeated attempts to stop | Habit reversal training; SSRIs |

**Red flag — BDD:** has one of the highest suicide rates in psychiatry. Always assess suicide risk, especially in adolescents and patients seeking repeated cosmetic procedures.

**Substance/medication-induced OC and related disorders:** Stimulants and cocaine are notable causes. **PANDAS/PANS** (pediatric autoimmune neuropsychiatric disorders associated with streptococcal infection) is a classic medical etiology of acute-onset OCD-like symptoms in children.

## Trauma- and Stressor-Related Disorders

This DSM-5 category groups conditions in which exposure to a traumatic or stressful event is **explicitly required** as a diagnostic criterion. The predominant clinical feature may be anhedonia, dysphoria, anger, aggression, or dissociation rather than fear or anxiety.

### Reactive Attachment Disorder (RAD) vs Disinhibited Social Engagement Disorder (DSED)

Both require a documented pattern of **insufficient care** (social neglect, repeated changes of caregivers, institutional rearing). Diagnosed in children with developmental age ≥9 months and not before age 5.

| Feature | RAD | DSED |
|---|---|---|
| **Behavior toward caregivers** | Inhibited, emotionally withdrawn — rarely seeks or responds to comfort | Overly familiar with unfamiliar adults — willingness to go off without hesitation |
| **Affect/social pattern** | Minimal social/emotional responsiveness, limited positive affect | Reduced reticence with strangers; culturally inappropriate over-friendliness |
| **Resembles** | Internalizing/depressive features | Externalizing/ADHD-like features |

### Posttraumatic Stress Disorder (PTSD)

**Criterion A — Exposure** to actual or threatened death, serious injury, or sexual violence by direct experience, witnessing, learning a close family member/friend was exposed (violent or accidental), or repeated/extreme exposure to aversive details (first responders, child-abuse investigators).

**Symptoms (≥1 month duration), in 4 clusters:**

1. **Intrusion symptoms** (≥1): recurrent involuntary memories, distressing dreams, dissociative reactions/flashbacks, intense distress at cues, marked physiological reactivity at cues
2. **Avoidance** (≥1): of distressing memories/thoughts/feelings OR of external reminders
3. **Negative alterations in cognitions and mood** (≥2): inability to remember key features of the event, persistent negative beliefs about self/others/world, distorted blame, persistent negative emotional state, markedly diminished interest, detachment/estrangement, persistent inability to experience positive emotions
4. **Alterations in arousal and reactivity** (≥2): irritable/aggressive behavior, reckless or self-destructive behavior, hypervigilance, exaggerated startle, concentration problems, sleep disturbance

**Specifiers:** with dissociative symptoms (depersonalization or derealization); with delayed expression (full criteria not met until ≥6 months after the event); preschool subtype for children ≤6 years (lower symptom thresholds).

**Neurobiology:**
- **Amygdala hyperactivity** → exaggerated threat detection
- **Hippocampal volume reduction and dysfunction** → impaired contextual memory and fear extinction; unclear whether pre-existing risk factor or consequence
- **Ventromedial PFC hypoactivity** → impaired top-down inhibition of amygdala fear responses
- **HPA axis paradox:** Despite chronic stress, **cortisol is often LOW** in PTSD (in contrast to depression's hypercortisolemia) — reflecting enhanced negative feedback sensitivity
- **Genetic vulnerability:** FKBP5 polymorphisms modulate glucocorticoid receptor sensitivity and gene–environment interaction with childhood trauma

**Evidence-based treatments:**
- **Trauma-focused psychotherapies (first-line):**
  - **Prolonged Exposure (PE):** Systematic in vivo and imaginal exposure to trauma memories and cues — extinguishes conditioned fear through habituation and new learning
  - **Cognitive Processing Therapy (CPT):** Targets maladaptive cognitions ("stuck points") about the trauma and its meaning
  - **EMDR (Eye Movement Desensitization and Reprocessing):** Bilateral stimulation while processing traumatic memories — mechanism debated; likely involves working-memory taxation enabling reconsolidation
- **Medications:** Sertraline and paroxetine (FDA-approved); **prazosin** (alpha-1 antagonist) for trauma-related nightmares; **avoid benzodiazepines** (worsen PTSD course, interfere with extinction learning)

### Acute Stress Disorder

Same trauma exposure as PTSD, with **≥9 of 14 symptoms** across the same clusters, lasting **3 days to 1 month** post-trauma. If symptoms persist beyond 1 month, the diagnosis converts to PTSD. Not all PTSD cases are preceded by acute stress disorder.

### Adjustment Disorder

Emotional or behavioral symptoms in response to an **identifiable stressor** (not necessarily traumatic), occurring **within 3 months** of stressor onset, marked by distress out of proportion or significant impairment. Resolves within **6 months** after the stressor (or its consequences) ends. Subtypes: with depressed mood, with anxiety, with mixed anxiety and depressed mood, with disturbance of conduct, with mixed disturbance of emotions and conduct, unspecified.

## Dissociative Disorders

A spectrum of disorders involving disruption in the integration of consciousness, memory, identity, emotion, perception, body representation, and behavior.

| Disorder | Core Feature | Notes |
|---|---|---|
| **Dissociative identity disorder (DID)** | ≥2 distinct personality states with amnesia between them | Etiologically linked to severe early childhood trauma and attachment disruption; the most controversial diagnosis in psychiatry |
| **Dissociative amnesia** | Inability to recall important autobiographical information, usually of a traumatic/stressful nature, inconsistent with ordinary forgetting | **Dissociative fugue** specifier — purposeful travel or bewildered wandering with identity confusion or new identity assumption |
| **Depersonalization/derealization disorder** | Persistent feelings of detachment from one's mental processes/body (depersonalization) or external world (derealization), with intact reality testing | Associated with temporal/parietal cortex abnormalities and reduced limbic activation |

## Somatic Symptom and Related Disorders

| Disorder | Core Feature |
|---|---|
| **Somatic symptom disorder** | One or more distressing somatic symptoms PLUS excessive thoughts/feelings/behaviors about them — disproportionate health concern, persistent high anxiety, excessive time/energy. **DSM-5 dropped the requirement that symptoms be medically unexplained.** |
| **Illness anxiety disorder** | Preoccupation with having or acquiring a serious illness; somatic symptoms not present or only mild. Care-seeking or care-avoidant subtypes |
| **Conversion disorder (Functional Neurological Symptom Disorder)** | Altered voluntary motor or sensory function (weakness, paralysis, abnormal movements, seizures, sensory loss) incompatible with recognized neurological conditions. Positive examination signs (Hoover's sign, tremor entrainment) support diagnosis |
| **Factitious disorder** | Falsification of physical or psychological signs/symptoms in self (or another, by proxy) without external incentives (in contrast to **malingering**, which involves external incentives like financial gain or avoidance of duty) |

## Disruptive, Impulse-Control, and Conduct Disorders

Conditions involving problems in emotional and behavioral self-control, with behaviors that violate the rights of others and/or bring the individual into significant conflict with societal norms or authority.

| Disorder | Key Features |
|---|---|
| **Oppositional defiant disorder (ODD)** | Pattern of angry/irritable mood, argumentative/defiant behavior, or vindictiveness ≥6 months; ≥4 symptoms with at least one non-sibling. Severity by number of settings (mild = 1, moderate = 2, severe = 3+) |
| **Intermittent explosive disorder (IED)** | Recurrent verbal or physical aggression — verbal/non-damaging (twice/week for 3 months) OR severe destructive episodes (3 within 12 months); aggression grossly disproportionate; not premeditated; age ≥6 |
| **Conduct disorder** | Repetitive pattern violating major societal norms; ≥3 of 15 criteria across aggression to people/animals, destruction of property, deceitfulness/theft, serious rules violations, in past 12 months. Childhood-onset (<10), adolescent-onset (≥10), unspecified-onset specifiers; **with limited prosocial emotions** specifier (callous-unemotional traits) marks worst prognosis |
| **Antisocial personality disorder** | Pervasive disregard for rights of others since age 15; conduct disorder before age 15; age ≥18 (overlaps with personality disorder topic) |
| **Pyromania** | Deliberate fire-setting on more than one occasion; tension/affective arousal before; fascination with fire; pleasure/relief afterward; not for monetary gain, ideology, or anger expression |
| **Kleptomania** | Recurrent failure to resist impulses to steal objects not needed for personal use or monetary value; tension before, pleasure/relief during; not for anger or vengeance |

**Clinical pearl:** ODD, DMDD, IED, and bipolar disorder often present with irritability in youth — careful differential is essential. DMDD requires persistently irritable mood **between** outbursts; IED has normal mood between outbursts; ODD is defined by oppositionality not just outbursts.

## Feeding and Eating Disorders

| Disorder | Key Features |
|---|---|
| **Pica** | Eating nonnutritive, nonfood substances ≥1 month, inappropriate to developmental level (minimum age 2); associated with iron/zinc deficiency, pregnancy, intellectual disability |
| **Rumination disorder** | Repeated regurgitation of food (re-chewed, re-swallowed, or spit out) ≥1 month; not due to GI condition |
| **Avoidant/Restrictive Food Intake Disorder (ARFID)** | Persistent failure to meet nutritional/energy needs (lack of interest, sensory aversion, fear of aversive consequences) with weight loss, nutritional deficiency, dependence on enteral feeds, or psychosocial impairment. **Distinguished from anorexia by absence of body image concerns** |
| **Anorexia nervosa** | Restriction of intake → significantly low body weight; intense fear of weight gain (or persistent behavior interfering with weight gain); body image disturbance. **Restricting** vs **binge-eating/purging** subtype. **DSM-5 removed amenorrhea requirement.** Severity by BMI (mild ≥17, moderate 16–16.99, severe 15–15.99, extreme <15). **Highest mortality of any psychiatric disorder.** |
| **Bulimia nervosa** | Recurrent binge eating + recurrent inappropriate compensatory behaviors (vomiting, laxatives, diuretics, fasting, excessive exercise) — both ≥1×/week for 3 months; self-evaluation unduly influenced by shape/weight; usually normal-weight or overweight. **Russell's sign** (knuckle calluses) and parotid hypertrophy are classic |
| **Binge-eating disorder (BED)** | Recurrent binges ≥1×/week for 3 months WITHOUT compensatory behaviors; binges associated with eating rapidly, until uncomfortably full, alone due to embarrassment, feeling disgusted/depressed/guilty. **Most common eating disorder.** Lisdexamfetamine FDA-approved |

**Red flag — anorexia:** Severe or rapid weight loss requires medical stabilization before outpatient treatment. **Refeeding syndrome** (hypophosphatemia, hypokalemia, hypomagnesemia, fluid shifts → cardiac dysfunction) can be fatal — start refeeding slowly with electrolyte monitoring.

**Red flag — bulimia:** Severe purging can cause hypokalemia, cardiac arrhythmias, esophageal rupture (Boerhaave syndrome), and dental erosion. Electrolyte monitoring is essential.

### Elimination Disorders

- **Enuresis:** Repeated voiding of urine into bed/clothes ≥2×/week for 3 months OR causing significant distress/impairment; chronological age ≥5. Subtypes: nocturnal only (most common), diurnal only, both. First-line behavioral: bell-and-pad alarm; pharmacologic: desmopressin
- **Encopresis:** Repeated passage of feces into inappropriate places ≥1×/month for 3 months; age ≥4. Subtypes: with or without constipation and overflow incontinence

## Sleep-Wake Disorders

DSM-5 replaced primary/secondary distinctions with focus on independent clinical attention regardless of coexisting conditions.

| Disorder | Core Features |
|---|---|
| **Insomnia disorder** | Dissatisfaction with quantity/quality (initiating, maintaining, or early-morning awakening) ≥3 nights/week for ≥3 months despite adequate opportunity. **CBT-I is first-line** — not medication |
| **Hypersomnolence disorder** | Excessive sleepiness despite ≥7-hour main sleep period; ≥3×/week for ≥3 months |
| **Narcolepsy** | Recurrent irrepressible sleep episodes ≥3×/week for ≥3 months PLUS one of: cataplexy, hypocretin deficiency on CSF, or REM latency ≤15 min on PSG / mean sleep latency ≤8 min on MSLT with ≥2 SOREMPs. **Tetrad:** excessive daytime sleepiness, cataplexy, sleep paralysis, hypnagogic/hypnopompic hallucinations (only cataplexy is specific) |
| **Obstructive Sleep Apnea Hypopnea (OSA)** | ≥5 obstructive apneas/hypopneas per hour with symptoms (snoring, gasping, sleepiness) OR ≥15/hour regardless of symptoms. Severity by apnea-hypopnea index (AHI): mild <15, moderate 15–30, severe >30 |
| **Central sleep apnea** | ≥5 central apneas/hour. Subtypes: idiopathic, Cheyne–Stokes, comorbid with opioid use |
| **Sleep-related hypoventilation** | Decreased respiration with elevated CO2 on PSG. Subtypes: idiopathic, congenital central alveolar (CCHS), comorbid |
| **Circadian rhythm sleep-wake disorders** | Misalignment of endogenous circadian rhythm with required schedule. Subtypes: delayed sleep phase, advanced sleep phase, irregular sleep-wake, non-24-hour, shift work, jet lag |

### Parasomnias

- **NREM sleep arousal disorders** (slow-wave sleep, first third of night): **Sleepwalking** and **sleep terrors** — unresponsive during episode, amnesia for it
- **Nightmare disorder** (REM sleep, late in night): Distressing dreams with full alertness on awakening and detailed recall
- **REM sleep behavior disorder (RBD):** Loss of normal REM atonia → acting out dreams (often violent). Strongly associated with **synucleinopathies** — eventually 80%+ develop Parkinson's, DLB, or MSA
- **Restless legs syndrome (RLS):** Urge to move legs accompanied by uncomfortable sensations, worse at rest, relieved by movement, worse in evening/night, ≥3×/week for 3+ months. Associated with iron deficiency (check ferritin); first-line: dopamine agonists (pramipexole, ropinirole) or alpha-2-delta ligands (gabapentin enacarbil)

## Sexual Dysfunctions, Gender Dysphoria, and Paraphilic Disorders

### Sexual Dysfunctions

All require **≥6 months duration** and clinically significant distress. DSM-5 specifiers: lifelong vs acquired; generalized vs situational; mild/moderate/severe based on distress.

| Disorder | Core Feature |
|---|---|
| **Delayed ejaculation** | Marked delay or absence of ejaculation in 75%+ of partnered sexual activity |
| **Erectile disorder** | Marked difficulty obtaining/maintaining erection or decrease in erectile rigidity |
| **Female orgasmic disorder** | Marked delay/infrequency/absence of orgasm or reduced orgasm intensity |
| **Female sexual interest/arousal disorder** | Lack of/reduced sexual interest or arousal; ≥3 of 6 indicators (DSM-5 merged hypoactive desire and arousal disorders for women) |
| **Genito-pelvic pain/penetration disorder** | Difficulty with vaginal penetration, vulvovaginal/pelvic pain, fear/anxiety, or pelvic-floor tensing (DSM-5 merged vaginismus and dyspareunia) |
| **Male hypoactive sexual desire disorder** | Persistently deficient sexual/erotic thoughts, fantasies, and desire |
| **Premature (early) ejaculation** | Ejaculation within ~1 minute of penetration in 75–100% of sexual activity |
| **Substance/medication-induced sexual dysfunction** | SSRIs, antipsychotics, 5-alpha-reductase inhibitors, beta-blockers, opioids are common culprits |

### Gender Dysphoria

Gender dysphoria refers to the **distress** that may accompany incongruence between one's experienced/expressed gender and assigned gender. **Gender nonconformity itself is not a mental disorder** — the diagnosis requires clinically significant distress or impairment. Separate criteria sets for **children** (≥6 of 8 indicators including "strong desire to be of the other gender") and **adolescents/adults** (≥2 of 6 indicators). Specifier "posttransition" identifies individuals in cross-gender living and on hormones or post-surgery.

**Clinical pearl:** Not all transgender or gender-diverse people experience dysphoria. The diagnosis exists to facilitate access to gender-affirming care, not to pathologize identity.

### Paraphilic Disorders

DSM-5 distinguishes a **paraphilia** (atypical sexual interest) from a **paraphilic disorder** (a paraphilia that causes distress/impairment to the individual OR whose satisfaction entails harm or risk of harm to others — including all acts with nonconsenting persons or children). **Only the latter is a mental disorder.**

| Disorder | Core Feature |
|---|---|
| **Voyeuristic** | Sexual arousal from observing unsuspecting persons; age ≥18 |
| **Exhibitionistic** | Sexual arousal from exposing genitals to unsuspecting persons |
| **Frotteuristic** | Sexual arousal from touching/rubbing nonconsenting persons (often crowded public settings) |
| **Sexual masochism** | Sexual arousal from being humiliated, beaten, bound, or made to suffer; **with asphyxiophilia** specifier carries fatal risk |
| **Sexual sadism** | Sexual arousal from physical/psychological suffering of another |
| **Pedophilic** | Sexual arousal involving prepubertal children; age ≥16 and ≥5 years older than child. Diagnosis does not require acting; acting constitutes child sexual abuse |
| **Fetishistic** | Sexual arousal from nonliving objects or specific nongenital body parts |
| **Transvestic** | Sexual arousal from cross-dressing (distinct from gender dysphoria) |

All paraphilic disorders share two general specifiers: **in a controlled environment** and **in full remission** (≥5 years asymptomatic in an uncontrolled environment).

**Red flag:** Any indication that a child is currently being abused triggers **mandatory reporting** to child protective services, regardless of diagnostic considerations.

## Substance-Related and Addictive Disorders

DSM-5 collapsed DSM-IV's "abuse" and "dependence" categories into a single **Substance Use Disorder (SUD)** measured on a continuum of severity. Each substance class has its own SUD plus associated intoxication and withdrawal syndromes where applicable. **Gambling disorder** is the only behavioral addiction included as a formal DSM-5 disorder (Internet gaming disorder remains in the research appendix).

### The 11 DSM-5 SUD Criteria — Four Clusters

Diagnosis requires a problematic pattern of use causing impairment/distress, with **≥2 of 11 criteria within 12 months**.

**Impaired Control (1–4):**
1. Used in larger amounts or longer than intended
2. Persistent desire or unsuccessful efforts to cut down
3. Great deal of time spent obtaining, using, or recovering from substance
4. Craving — strong desire or urge to use

**Social Impairment (5–7):**
5. Failure to fulfill major role obligations
6. Continued use despite social/interpersonal problems
7. Important activities given up or reduced

**Risky Use (8–9):**
8. Recurrent use in physically hazardous situations
9. Continued use despite known physical/psychological problems caused or exacerbated

**Pharmacological (10–11):**
10. Tolerance — need increased amounts or markedly diminished effect
11. Withdrawal — characteristic syndrome OR substance taken to relieve/avoid withdrawal

**Note:** Tolerance and withdrawal during appropriate medical supervision (e.g., opioid pain management, prescribed BZDs) **do not count** toward diagnosis.

**Severity:** mild (2–3), moderate (4–5), severe (6+). **Course specifiers:** early remission (3–12 months without criteria except craving); sustained remission (≥12 months). **Setting specifiers:** in a controlled environment; on maintenance therapy.

### Substance-Specific Highlights

| Substance | Intoxication | Withdrawal | Key Notes |
|---|---|---|---|
| **Alcohol** | Slurred speech, incoordination, nystagmus, attention/memory impairment, stupor/coma | Tremor, autonomic hyperactivity, anxiety, GI upset, transient hallucinations, **seizures, delirium tremens (DTs)** | Withdrawal can be fatal — benzodiazepine taper (CIWA-Ar guides dosing); thiamine before glucose to prevent Wernicke's encephalopathy |
| **Opioid** | **Pupillary constriction** (miosis), drowsiness, slurred speech, attention/memory impairment | Dysphoria, nausea, muscle aches, lacrimation/rhinorrhea, **pupillary dilation**, piloerection, sweating, diarrhea, yawning, fever, insomnia | **Overdose triad: miosis, respiratory depression, coma — give naloxone**, expect repeat dosing with fentanyl. MAT (methadone, buprenorphine/naloxone, naltrexone) reduces overdose mortality; never discontinue MAT during hospitalization without planning |
| **Sedative/Hypnotic/Anxiolytic** | Resembles alcohol intoxication | Autonomic hyperactivity, tremor, insomnia, nausea, hallucinations/illusions, agitation, anxiety, **grand mal seizures** | **Withdrawal can be fatal** — long-acting BZD cross-taper in monitored setting |
| **Stimulants** (cocaine, amphetamine) | Tachycardia/bradycardia, pupillary dilation, BP changes, sweating, nausea, agitation, chest pain, arrhythmias, seizures | "Crash" — dysphoria, fatigue, vivid unpleasant dreams, insomnia/hypersomnia, increased appetite, psychomotor changes | **Hyperthermia, rhabdomyolysis, MI** are fatal risks; benzodiazepines first-line for agitation; **avoid pure beta-blockade** (unopposed alpha effect → hypertensive crisis). Suicide risk during crash. No FDA-approved pharmacotherapy for stimulant use disorder; **contingency management** has strongest evidence |
| **Cannabis** | Conjunctival injection, increased appetite, dry mouth, tachycardia, perceptual changes | Irritability, anxiety, sleep difficulty, decreased appetite, restlessness, depressed mood, somatic symptoms (DSM-5 added) | Adolescent use is a risk factor for psychosis |
| **Hallucinogen** | Perceptual changes (hallucinations, synesthesia), depersonalization, derealization, ideas of reference, autonomic arousal | No characteristic withdrawal syndrome | **Hallucinogen Persisting Perception Disorder (HPPD)** — flashbacks |
| **Inhalant** | Dizziness, nystagmus, incoordination, slurred speech, lethargy, tremor, blurred vision, euphoria | None recognized | Sudden sniffing death syndrome (cardiac arrhythmia) |
| **Tobacco** | (No DSM-5 intoxication category) | Irritability, anxiety, concentration difficulty, increased appetite, restlessness, depressed mood, insomnia | First-line: **varenicline, combination NRT, bupropion**; counseling + pharmacotherapy > either alone |
| **Caffeine** | Restlessness, nervousness, excitement, insomnia, flushed face, diuresis, GI disturbance, muscle twitching, rambling speech, tachycardia/arrhythmia, periods of inexhaustibility, psychomotor agitation | Headache, fatigue, dysphoric mood, concentration difficulty, flu-like symptoms | **No DSM-5 caffeine use disorder** (only intoxication and withdrawal); proposed for further study |

### Addictive Disorder

**Gambling disorder:** ≥4 of 9 criteria in 12 months — escalating bets, restlessness when cutting back, repeated unsuccessful efforts to stop, preoccupation, gambling when distressed, "chasing" losses, lying, jeopardizing relationships/career, relying on others for money. Severity by criteria count (mild 4–5, moderate 6–7, severe 8–9). High suicide risk. **Always screen patients newly started on dopamine agonists** (e.g., for Parkinson's or RLS) — impulse control disorders are recognized iatrogenic effects.

### Neurobiological Models of Addiction

- **Mesolimbic dopamine reward circuit:** All addictive substances increase dopamine in nucleus accumbens; stimulants do so most directly
- **Allostatic model (Koob):** Repeated drug use → counter-adaptive changes that lower reward set point and recruit anti-reward systems (CRF, dynorphin) → negative emotional state in absence of drug → use shifts from positive reinforcement (euphoria) to **negative reinforcement** (relief)
- **Three-stage cycle:** Binge/intoxication (NAc, VTA) → withdrawal/negative affect (extended amygdala, CRF, dynorphin) → preoccupation/anticipation (PFC, glutamate, executive dysfunction)
- **Incentive sensitization (Robinson & Berridge):** Repeated use sensitizes "wanting" (incentive salience, dopamine-mediated) without sensitizing "liking" (hedonic value, opioid-mediated) — explains craving despite reduced pleasure

## Medication-Induced Movement Disorders and Other Adverse Effects

These are not formally mental disorders but are included in DSM-5 because their differential is important and they often arise during psychiatric treatment.

### Extrapyramidal Symptoms (EPS) — Antipsychotic-Induced

| Disorder | Onset | Key Features | Treatment |
|---|---|---|---|
| **Acute dystonia** | Hours to days | Sustained muscle contraction (oculogyric crisis, torticollis, retrocollis); **highest risk in young men, high-potency typicals, IM depot** | **IM/IV anticholinergic** (benztropine, diphenhydramine) — dramatic relief within minutes |
| **Akathisia** | Days to weeks | **Subjective inner restlessness**, observable fidgeting/pacing, inability to sit still | Reduce dose; switch agent; **propranolol** (often most effective); benzodiazepine; anticholinergic |
| **Parkinsonism** | Weeks | Bradykinesia, rigidity, 3–6 Hz pill-rolling tremor, masked face | Reduce dose; anticholinergic (benztropine) or amantadine |
| **Tardive dyskinesia (TD)** | Months to years | Involuntary choreoathetoid movements — lip smacking, tongue protrusion, grimacing, choreoathetoid limb movements; often persists after drug discontinuation | **VMAT2 inhibitors** (valbenazine, deutetrabenazine — FDA-approved); discontinue or switch; clozapine has lowest risk |

**Clinical pearl — akathisia:** Well-documented risk factor for **suicidality and violence** — patients describe it as intolerable. Ask directly; motor signs can be subtle. **AIMS** (Abnormal Involuntary Movement Scale) is the standard screening instrument used every 6 months for patients on chronic antipsychotic therapy.

**Red flag — laryngeal dystonia:** Can compromise the airway and cause stridor or asphyxiation — medical emergency requiring immediate IM anticholinergic and airway monitoring.

### Neuroleptic Malignant Syndrome (NMS)

**Tetrad:** fever, lead-pipe rigidity, autonomic instability, altered mental status. Plus: diaphoresis, dysphagia, mutism, tachycardia, labile BP, leukocytosis, **markedly elevated CK** (rhabdomyolysis), AKI. Onset typically within days to 2 weeks of antipsychotic exposure or dose increase. Mortality ~10%.

**Treatment:** Stop the offending agent; aggressive cooling and IV hydration; consider **dantrolene** (muscle relaxation), **bromocriptine** (dopamine agonist), or benzodiazepines. ECT for refractory cases. Restart of antipsychotic only after 2-week washout, preferably with low-potency or atypical agent.

### Serotonin Syndrome (Differential from NMS)

Triggered by serotonergic medication combinations (SSRI + MAOI, SSRI + tramadol, SSRI + linezolid, SSRI + triptan, SSRI + dextromethorphan).

| Feature | Serotonin Syndrome | NMS |
|---|---|---|
| **Onset** | Hours | Days to weeks |
| **Trigger** | Serotonergic medication | Dopamine antagonist |
| **Neuromuscular** | **Hyperreflexia, clonus** (especially lower extremity), tremor, **shivering** | **Lead-pipe rigidity**, hyporeflexia |
| **GI** | Diarrhea, hyperactive bowel sounds | Decreased bowel sounds |
| **Pupils** | Mydriasis | Normal |
| **Treatment** | Stop serotonergic agents; cooling; benzodiazepines; cyproheptadine (5-HT2A antagonist) | Stop antipsychotic; cooling; dantrolene, bromocriptine |

### Other Medication-Induced Conditions

- **Medication-induced postural tremor:** Fine 8–12 Hz tremor with lithium, antidepressants, valproate. **Lithium tremor is dose-dependent**; consider checking level (toxicity ≥1.5 mEq/L). Adjunctive propranolol can help.
- **Antidepressant discontinuation syndrome (FINISH mnemonic):** **F**lu-like symptoms, **I**nsomnia, **N**ausea, **I**mbalance, **S**ensory disturbances (electric-shock "brain zaps"), **H**yperarousal. Highest risk with short-half-life agents (paroxetine, venlafaxine); fluoxetine rarely causes it. Symptoms begin 2–4 days after cessation, last 1–2 weeks. **Prevention:** taper over 2–4 weeks (or longer for high-risk agents).

## A Note on Clinical Judgment

DSM-5 criteria are diagnostic tools, not substitutes for clinical reasoning. Real-world presentations are often ambiguous — overlapping features across categories, culturally shaped symptom expression, and significant comorbidity are the rule rather than the exception. Specifiers and severity ratings exist to **sharpen formulation and treatment planning**, not to be checked mechanically.

Use this reference to build pattern recognition across the nosology, but ground individual diagnoses in full history, mental status examination, collateral information, longitudinal observation, and — where uncertainty remains — a provisional diagnosis with careful follow-up rather than premature closure.
`;

// ================================================================
// NEW FLASHCARDS (added on top of existing 50)
// ================================================================
const NEW_FLASHCARDS: Array<{ q: string; a: string; difficulty: string }> = [
  // --- Schizophrenia spectrum (additional) ---
  { q: "How long must symptoms persist for a diagnosis of schizophrenia vs schizophreniform vs brief psychotic disorder?", a: "**Brief psychotic disorder:** ≥1 day to <1 month with full return to premorbid function. **Schizophreniform:** 1 to <6 months. **Schizophrenia:** ≥6 months total (with ≥1 month of active-phase symptoms; functional decline required).", difficulty: "medium" },
  { q: "What distinguishes delusional disorder from schizophrenia?", a: "Delusional disorder requires ≥1 month of one or more delusions WITHOUT prominent hallucinations, disorganized speech, disorganized behavior, or negative symptoms. Functioning is otherwise relatively preserved. Subtypes: erotomanic, grandiose, jealous, persecutory, somatic, mixed, unspecified.", difficulty: "medium" },
  { q: "What is anti-NMDA receptor encephalitis and why does it matter for psychiatric differential?", a: "An autoimmune encephalitis classically presenting as a young woman with new-onset psychosis, seizures, dyskinesias (especially orofacial), autonomic instability, and progressive decreased consciousness. Often paraneoplastic (ovarian teratoma). Mimics primary psychosis but requires urgent neurologic workup, CSF NMDA-R antibodies, and immunotherapy.", difficulty: "hard" },
  { q: "What is the first-line treatment for malignant catatonia?", a: "**Lorazepam challenge** (often dramatically effective). Second-line: **ECT**. Antipsychotics may worsen catatonia and should be used with caution. Malignant catatonia (with autonomic instability and hyperthermia) is life-threatening.", difficulty: "medium" },

  // --- Bipolar (additional) ---
  { q: "Recall the DIGFAST mnemonic for manic episode symptoms.", a: "**D**istractibility, **I**nsomnia (decreased need for sleep), **G**randiosity, **F**light of ideas, **A**ctivity increase (goal-directed), **S**peech pressured, **T**houghtlessness (high-risk activities — spending sprees, sexual indiscretions). Need 3 (or 4 if mood only irritable) for ≥1 week, plus increased energy/activity.", difficulty: "easy" },
  { q: "What duration distinguishes a manic episode from a hypomanic episode?", a: "**Manic:** ≥1 week (or any duration if hospitalization required); causes marked impairment, hospitalization, or psychotic features. **Hypomanic:** ≥4 consecutive days; observable change but NOT severe enough to cause marked impairment or require hospitalization. Psychotic features by definition convert hypomania to mania.", difficulty: "easy" },
  { q: "What does 'rapid cycling' bipolar disorder mean?", a: "≥4 mood episodes (manic, hypomanic, or major depressive) within 12 months, with full remission or switch to opposite polarity between episodes. A specifier, not a separate diagnosis. More common in women, bipolar II, and with antidepressant exposure.", difficulty: "medium" },
  { q: "Why is antidepressant monotherapy contraindicated in bipolar I disorder?", a: "Risk of inducing a manic episode and accelerating rapid cycling. Antidepressants in bipolar should always be combined with a mood stabilizer (lithium, valproate, lamotrigine, atypical antipsychotic). A persistent manic episode emerging during antidepressant treatment that continues beyond the drug's physiological effect counts as evidence of bipolar I.", difficulty: "medium" },
  { q: "What is the therapeutic range for lithium and what are signs of toxicity?", a: "Therapeutic: 0.6–1.2 mEq/L (acute mania may require up to 1.5). **Toxicity ≥1.5 mEq/L** — coarse tremor, ataxia, dysarthria, confusion, nausea/vomiting, diarrhea. Severe (>2.5): seizures, coma, arrhythmias, renal failure, death. Monitor renal and thyroid function (lithium can cause hypothyroidism, nephrogenic diabetes insipidus, and chronic kidney disease).", difficulty: "medium" },

  // --- Depressive (additional) ---
  { q: "Recall the SIGECAPS mnemonic for MDD symptoms.", a: "**S**leep, **I**nterest (anhedonia), **G**uilt/worthlessness, **E**nergy, **C**oncentration, **A**ppetite/weight, **P**sychomotor agitation/retardation, **S**uicidality. Need 5 of 9 (one must be depressed mood OR anhedonia) for ≥2 weeks.", difficulty: "easy" },
  { q: "What is persistent depressive disorder (dysthymia)?", a: "Depressed mood most of the day, more days than not, for ≥2 years (≥1 year in youth) plus ≥2 of: poor appetite/overeating, insomnia/hypersomnia, low energy, low self-esteem, poor concentration, hopelessness. Never asymptomatic >2 months. DSM-5 combined dysthymia and chronic MDD under this heading.", difficulty: "medium" },
  { q: "What is disruptive mood dysregulation disorder (DMDD) and why was it added to DSM-5?", a: "Severe recurrent temper outbursts ≥3×/week + persistently irritable/angry mood between outbursts, ≥12 months in ≥2 settings. Onset before age 10; never first diagnosed before age 6 or after 18. **Created largely to combat over-diagnosis of pediatric bipolar disorder** in irritable youth without distinct mood episodes.", difficulty: "medium" },
  { q: "What is premenstrual dysphoric disorder (PMDD)?", a: "Five or more symptoms in the final premenstrual week, improving within days of menses onset, minimal/absent post-menses. At least one must be affective (lability, irritability, depressed mood, anxiety). **Confirmed by prospective daily ratings over ≥2 cycles.** Elevated to a full disorder in DSM-5. SSRIs (continuous or luteal-phase only) are first-line.", difficulty: "medium" },
  { q: "What is the role of BDNF in depression and antidepressant action?", a: "BDNF (brain-derived neurotrophic factor) is reduced in depression — particularly in the hippocampus, contributing to volume loss and impaired neurogenesis. Antidepressants, ECT, exercise, and ketamine all increase BDNF expression and restore hippocampal volume — the **neuroplasticity hypothesis** explains why clinical response takes weeks despite immediate monoamine changes.", difficulty: "hard" },
  { q: "When is ECT first-line for depression?", a: "Catatonic depression, depression with psychotic features, severe suicidality requiring rapid response, peripartum depression, treatment-resistant depression, and patients unable to tolerate medication side effects. Has the highest response rate of any antidepressant intervention. Main side effect: anterograde and retrograde amnesia, usually transient.", difficulty: "medium" },
  { q: "How does ketamine differ mechanistically from traditional antidepressants?", a: "Ketamine is an NMDA receptor antagonist (not a monoamine modulator). Blockade of NMDA receptors on inhibitory interneurons → glutamate surge → AMPA activation → BDNF release → rapid synaptogenesis. Antidepressant effect within hours rather than weeks. Esketamine (intranasal) is FDA-approved for treatment-resistant depression. Limited durability — typically requires repeated dosing.", difficulty: "hard" },

  // --- Anxiety (additional) ---
  { q: "What is unique about blood-injection-injury (BII) phobia among specific phobias?", a: "BII phobia is the only phobia classically associated with a **vasovagal (fainting) response** rather than the typical fight-or-flight pattern — biphasic with initial sympathetic activation followed by parasympathetic dominance, bradycardia, and hypotension. Treatment includes **applied tension** (deliberately tensing muscles) to maintain blood pressure during exposure.", difficulty: "medium" },
  { q: "How did DSM-5 change agoraphobia?", a: "Agoraphobia was separated from panic disorder and is now a **standalone diagnosis**. Many patients have agoraphobia without a panic disorder history. Requires marked fear of ≥2 of 5 situations: public transit, open spaces, enclosed spaces, lines/crowds, being out alone — for ≥6 months.", difficulty: "easy" },
  { q: "What are the 6 GAD physical symptoms and how many are required?", a: "**Restlessness**, easy **fatigability**, **concentration** difficulty (mind going blank), **irritability**, **muscle tension**, **sleep** disturbance. Need ≥3 of 6 in adults (only 1 in children). Plus uncontrollable worry about multiple domains for ≥6 months, more days than not.", difficulty: "easy" },
  { q: "What is interoceptive exposure and which disorder is it used for?", a: "A CBT technique for **panic disorder** in which the patient deliberately provokes feared bodily sensations (spinning to induce dizziness, breathing through a straw to induce dyspnea, hyperventilation to induce paresthesias) to extinguish the catastrophic interpretation of those sensations.", difficulty: "medium" },
  { q: "What features of new-onset late-life anxiety require medical workup before psychiatric attribution?", a: "New-onset anxiety in a previously calm older adult should prompt evaluation for: hyperthyroidism (TSH), pheochromocytoma, hypoglycemia, cardiac (arrhythmia, MI presenting as anxiety), pulmonary (PE, COPD), substances (caffeine, stimulants, decongestants), and medication review (corticosteroids, thyroid replacement).", difficulty: "medium" },

  // --- OCD-related (additional) ---
  { q: "What is body dysmorphic disorder (BDD) and what is the major safety concern?", a: "Preoccupation with perceived physical defects not observable (or only slight) to others, with repetitive behaviors (mirror checking, comparing, reassurance seeking) or mental acts. **Muscle dysmorphia** subtype involves preoccupation that one's body is too small/insufficiently muscular. **BDD has one of the highest suicide rates in psychiatry** — always assess suicide risk, especially in adolescents and patients seeking repeated cosmetic procedures.", difficulty: "medium" },
  { q: "What is hoarding disorder and how does it differ from OCD?", a: "Persistent difficulty discarding possessions regardless of value, with accumulation that congests living spaces and impairs functioning. Unlike OCD, the saving behavior is **ego-syntonic** (the items feel needed) rather than driven by intrusive obsessions. CBT (cognitive restructuring + sorting/discarding) is more effective than SSRIs.", difficulty: "medium" },
  { q: "What is trichotillomania and what is the first-line treatment?", a: "Recurrent pulling out of one's own hair resulting in hair loss, with repeated attempts to stop. Scalp most common; eyebrows and eyelashes also common. **First-line treatment: habit reversal training** (awareness + competing response). SSRIs less consistently effective than for OCD. Excoriation (skin-picking) disorder has the same treatment approach.", difficulty: "easy" },
  { q: "What is PANDAS/PANS?", a: "**Pediatric autoimmune neuropsychiatric disorders associated with streptococcal infection (PANDAS)** and the broader **PANS** (pediatric acute-onset neuropsychiatric syndrome) — abrupt onset of OCD or tics in children following infection (group A streptococcus for PANDAS; broader triggers for PANS). Hypothesized molecular mimicry → basal ganglia autoantibodies. Diagnostic and management criteria remain debated.", difficulty: "hard" },

  // --- Trauma & stressor (additional) ---
  { q: "Compare reactive attachment disorder (RAD) and disinhibited social engagement disorder (DSED).", a: "Both follow documented insufficient care. **RAD:** inhibited, emotionally withdrawn — child rarely seeks or responds to comfort; resembles internalizing/depressive features. **DSED:** indiscriminate over-familiarity with unfamiliar adults — willingness to go off without hesitation; resembles externalizing/ADHD-like features. Diagnosed only after age 9 months developmental level; not before age 5.", difficulty: "medium" },
  { q: "What are the four PTSD symptom clusters in DSM-5?", a: "**(1) Intrusion** — recurrent memories, dreams, flashbacks, distress at cues, physiological reactivity. **(2) Avoidance** — of internal reminders or external cues. **(3) Negative alterations in cognitions and mood** — distorted blame, detachment, anhedonia, persistent negative emotional state. **(4) Alterations in arousal and reactivity** — hypervigilance, exaggerated startle, irritability/aggression, reckless behavior, sleep/concentration problems.", difficulty: "medium" },
  { q: "Why is cortisol often LOW in PTSD, in contrast to depression?", a: "PTSD is associated with **enhanced glucocorticoid receptor sensitivity and exaggerated HPA negative feedback** → suppressed cortisol output despite chronic stress. This contrasts with depression's hypercortisolemia and blunted dexamethasone suppression. The FKBP5 gene polymorphism modulates GR sensitivity and interacts with childhood trauma to increase risk.", difficulty: "hard" },
  { q: "Why are benzodiazepines avoided in PTSD treatment?", a: "Benzodiazepines worsen long-term PTSD outcomes — they interfere with fear extinction learning (the mechanism through which exposure-based therapies work), do not address core symptoms, increase risk of substance use disorder, and are associated with worse course in longitudinal studies. **First-line treatments are trauma-focused psychotherapies** (PE, CPT, EMDR) plus SSRIs (sertraline, paroxetine).", difficulty: "medium" },
  { q: "What is acute stress disorder and how does it differ from PTSD?", a: "Same trauma exposure as PTSD with ≥9 of 14 symptoms across the same clusters, but lasting **3 days to 1 month** post-trauma. If symptoms persist beyond 1 month, the diagnosis converts to PTSD. Not all PTSD cases are preceded by acute stress disorder — and not all acute stress disorder progresses to PTSD.", difficulty: "easy" },
  { q: "What is adjustment disorder?", a: "Emotional or behavioral symptoms in response to an identifiable stressor (not necessarily traumatic), occurring **within 3 months** of stressor onset, marked by distress out of proportion or significant impairment. Resolves within **6 months** after the stressor (or its consequences) ends. Subtypes by predominant features: depressed mood, anxiety, mixed, conduct, mixed emotional + conduct, unspecified.", difficulty: "medium" },

  // --- Eating disorders (additional) ---
  { q: "What is ARFID and how is it distinguished from anorexia nervosa?", a: "**Avoidant/Restrictive Food Intake Disorder** — failure to meet nutritional/energy needs from lack of interest in food, sensory aversion, or fear of aversive consequences (choking, vomiting), with weight loss, nutritional deficiency, dependence on enteral feeds, or psychosocial impairment. **Distinguished from anorexia by the absence of body image concerns or fear of weight gain.** New DSM-5 category.", difficulty: "medium" },
  { q: "What are the DSM-5 severity criteria for anorexia nervosa based on BMI?", a: "**Mild:** BMI ≥17. **Moderate:** 16–16.99. **Severe:** 15–15.99. **Extreme:** <15. DSM-5 also removed the amenorrhea requirement. Subtypes: restricting type vs binge-eating/purging type (within the past 3 months).", difficulty: "medium" },
  { q: "What is refeeding syndrome and how is it prevented?", a: "Potentially fatal complication when malnourished patients are refed too rapidly: sudden insulin release drives potassium, phosphate, and magnesium intracellularly → **hypophosphatemia, hypokalemia, hypomagnesemia**, fluid shifts, cardiac dysfunction, arrhythmias. Prevention: start refeeding slowly (low calories), check and replete electrolytes (especially **phosphate**) before and during refeeding, monitor cardiac rhythm.", difficulty: "hard" },
  { q: "What are Russell's sign and parotid hypertrophy associated with?", a: "**Bulimia nervosa.** Russell's sign = calluses or scarring on the dorsum of the hand from repeated self-induced vomiting (knuckles striking the teeth). Parotid (and submandibular) gland hypertrophy — sialadenosis — gives a chipmunk-cheek appearance. Other physical signs: dental enamel erosion (perimylolysis), esophagitis, electrolyte abnormalities (hypokalemic alkalosis from vomiting).", difficulty: "medium" },
  { q: "What is binge-eating disorder and what is its DSM-5 status?", a: "Recurrent binges (large amount of food in discrete period + sense of loss of control) ≥1×/week for 3 months, WITHOUT the compensatory behaviors of bulimia. Binges associated with: eating rapidly, until uncomfortably full, alone due to embarrassment, feeling disgusted/depressed/guilty afterward. **Promoted to standalone disorder in DSM-5; most common eating disorder.** Lisdexamfetamine FDA-approved.", difficulty: "easy" },

  // --- Disruptive/Impulse-Control ---
  { q: "What are the three symptom categories of oppositional defiant disorder (ODD)?", a: "**(1) Angry/irritable mood:** loses temper, touchy/easily annoyed, angry/resentful. **(2) Argumentative/defiant behavior:** argues with authority, defies rules, deliberately annoys, blames others. **(3) Vindictiveness:** spiteful or vindictive ≥2 times in past 6 months. Need ≥4 symptoms over ≥6 months, with at least one non-sibling. Severity by number of settings (1=mild, 2=moderate, 3+=severe).", difficulty: "medium" },
  { q: "What distinguishes intermittent explosive disorder (IED) from antisocial behavior?", a: "IED features recurrent aggressive outbursts that are **impulsive (not premeditated)**, grossly disproportionate to provocation, and not for tangible gain. Either verbal/non-damaging aggression twice/week for 3 months OR three destructive outbursts in 12 months. Age ≥6. Mood is normal between episodes. Cannot coexist with conduct disorder, antisocial PD, or DMDD as the primary diagnosis.", difficulty: "medium" },
  { q: "What is the 'with limited prosocial emotions' specifier in conduct disorder?", a: "Identifies youth with **callous-unemotional (CU) traits** — lack of remorse/guilt, callousness/lack of empathy, unconcerned about performance, shallow/deficient affect — present persistently in ≥2 settings. Carries the worst prognosis, predicts adult antisocial personality disorder, and is associated with reduced amygdala reactivity to fearful faces and impaired empathy circuits.", difficulty: "hard" },

  // --- Sleep ---
  { q: "What is the first-line treatment for chronic insomnia disorder?", a: "**CBT-I (cognitive behavioral therapy for insomnia)** — NOT medication. Includes sleep restriction, stimulus control, cognitive restructuring of catastrophic beliefs, sleep hygiene, and relaxation training. Pharmacologic options (BZRAs, ramelteon, suvorexant, low-dose doxepin) are second-line and problematic long-term — particularly benzodiazepine receptor agonists in older adults (falls, cognitive impairment).", difficulty: "easy" },
  { q: "What is the classic narcolepsy tetrad, and which symptom is specific?", a: "**(1) Excessive daytime sleepiness** with irrepressible sleep attacks. **(2) Cataplexy** — sudden bilateral loss of muscle tone triggered by strong emotion (especially laughter). **(3) Sleep paralysis** on falling asleep or waking. **(4) Hypnagogic/hypnopompic hallucinations**. **Only cataplexy is specific to narcolepsy** — the others occur in many sleep-deprived individuals. Type 1 narcolepsy involves hypocretin (orexin) deficiency.", difficulty: "medium" },
  { q: "What is REM sleep behavior disorder (RBD) and what is its prognostic significance?", a: "Loss of normal REM atonia → patient acts out dreams (often violent — punching, kicking, jumping out of bed). Diagnosed by polysomnography showing REM without atonia plus history. **Strongly associated with synucleinopathies** — over 80% of patients eventually develop Parkinson's disease, dementia with Lewy bodies, or multiple system atrophy, often years after RBD onset. Treated with melatonin or clonazepam.", difficulty: "hard" },
  { q: "How is OSA severity categorized and what are the cardiovascular risks?", a: "Severity by **apnea-hypopnea index (AHI)**: mild <15, moderate 15–30, severe >30. Diagnosis requires ≥5 obstructive apneas/hypopneas per hour with symptoms (snoring, gasping, daytime sleepiness) OR ≥15/hour regardless of symptoms. Strongly associated with hypertension, atrial fibrillation, heart failure, stroke, and metabolic syndrome. CPAP is first-line treatment.", difficulty: "medium" },
  { q: "What is restless legs syndrome and what laboratory test is essential?", a: "Urge to move legs accompanied by uncomfortable sensations, **worse at rest, relieved by movement, worse in evening/night**, ≥3×/week for 3+ months. **Always check ferritin and iron studies** — iron deficiency is a frequent reversible cause (target ferritin >75 ng/mL for symptom relief). First-line pharmacotherapy: alpha-2-delta ligands (gabapentin enacarbil, pregabalin) or dopamine agonists (pramipexole, ropinirole — risk of augmentation and impulse-control disorders).", difficulty: "medium" },

  // --- Sexual/Gender/Paraphilic ---
  { q: "How does DSM-5 distinguish a paraphilia from a paraphilic disorder?", a: "A **paraphilia** is an atypical sexual interest. A **paraphilic disorder** is a paraphilia that EITHER causes distress/impairment to the individual OR whose satisfaction entails personal harm or risk of harm to others (including all acts with nonconsenting persons or children). **Only paraphilic disorders are mental disorders** in DSM-5. This change explicitly avoided pathologizing atypical but harmless sexual interests.", difficulty: "medium" },
  { q: "What is the key principle behind the DSM-5 gender dysphoria diagnosis?", a: "**Gender nonconformity itself is NOT a mental disorder.** The diagnosis requires clinically significant distress or impairment from the incongruence between experienced/expressed gender and assigned gender. The diagnosis exists to facilitate access to gender-affirming care, not to pathologize identity. Not all transgender or gender-diverse people experience dysphoria.", difficulty: "easy" },
  { q: "What sexual dysfunctions did DSM-5 merge from earlier editions?", a: "**Female sexual interest/arousal disorder** combined the previous separate diagnoses of hypoactive sexual desire and arousal in women. **Genito-pelvic pain/penetration disorder** combined vaginismus and dyspareunia. The change reflected difficulty distinguishing these in clinical practice.", difficulty: "medium" },
  { q: "Which medications are common causes of substance/medication-induced sexual dysfunction?", a: "**SSRIs** (decreased libido, anorgasmia, delayed ejaculation), **antipsychotics** (especially via prolactin elevation), **5-alpha-reductase inhibitors** (finasteride — sometimes persistent), **beta-blockers** (erectile dysfunction), **opioids** (hypogonadism, decreased libido). Symptoms typically begin within days to weeks of starting the agent. Always review medications before psychogenic attribution.", difficulty: "medium" },

  // --- Substance use ---
  { q: "What are the four clusters of the 11 DSM-5 substance use disorder criteria?", a: "**Impaired control (1–4):** larger amounts/longer than intended; unsuccessful efforts to cut down; time spent obtaining/using/recovering; craving. **Social impairment (5–7):** failure to fulfill role obligations; continued use despite social problems; activities given up. **Risky use (8–9):** physically hazardous use; continued use despite known harm. **Pharmacological (10–11):** tolerance; withdrawal. ≥2 within 12 months for diagnosis.", difficulty: "medium" },
  { q: "How is substance use disorder severity rated in DSM-5?", a: "**Mild:** 2–3 criteria. **Moderate:** 4–5 criteria. **Severe:** 6 or more criteria. Replaces the DSM-IV abuse/dependence dichotomy. Course specifiers: early remission (3–12 months without criteria except craving), sustained remission (≥12 months). Setting specifiers: in a controlled environment, on maintenance therapy.", difficulty: "easy" },
  { q: "Why are tolerance and withdrawal alone not sufficient for an SUD diagnosis in patients on prescribed medications?", a: "DSM-5 explicitly excludes tolerance and withdrawal that occur during **appropriate medical supervision** (e.g., opioid pain management, prescribed benzodiazepines, ADHD stimulants) from counting toward SUD criteria. Physical dependence on a prescribed medication taken as directed is a normal pharmacological phenomenon — distinct from the impaired control, social impairment, and risky use that define addiction.", difficulty: "medium" },
  { q: "What is the opioid overdose triad and what is the antidote?", a: "**Triad: miosis (pinpoint pupils), respiratory depression, coma.** Treat with **naloxone** (intranasal or IM/IV) — expect to repeat dosing, especially with fentanyl, which has high potency and may require multiple doses. Withdrawal precipitated by naloxone is uncomfortable but not life-threatening; under-dosing in the setting of fentanyl-related arrest is the bigger danger.", difficulty: "easy" },
  { q: "Which substance withdrawals are potentially fatal?", a: "**Alcohol** (delirium tremens, seizures, autonomic instability — mortality untreated up to 5%) and **sedative/hypnotic/anxiolytic** (especially benzodiazepines and barbiturates — seizures, autonomic instability). **Opioid withdrawal is severely uncomfortable but rarely fatal in healthy adults.** Stimulant, cannabis, and tobacco withdrawal are not life-threatening. Suicide during the stimulant 'crash' is a separate critical risk.", difficulty: "medium" },
  { q: "What MAT options are available for opioid use disorder, and why should they not be discontinued during hospitalization?", a: "**Medications for Addiction Treatment (MAT):** methadone (full mu agonist, opioid treatment program only), **buprenorphine/naloxone** (partial mu agonist, office-based), naltrexone (mu antagonist; PO daily or extended-release IM monthly). Methadone and buprenorphine substantially reduce overdose mortality. Discontinuing MAT during hospitalization without planning markedly increases overdose risk after discharge — patients lose tolerance and may use prior amounts.", difficulty: "medium" },
  { q: "What is the allostatic model of addiction (Koob)?", a: "Repeated drug use causes counter-adaptive changes that LOWER the brain's reward set point and recruit anti-reward systems (corticotropin-releasing factor, dynorphin) → persistent **negative emotional state** in absence of drug. Use shifts from positive reinforcement (euphoria) to **negative reinforcement** (relief from dysphoria/withdrawal). Three stages: binge/intoxication → withdrawal/negative affect → preoccupation/anticipation.", difficulty: "hard" },
  { q: "What is the only behavioral addiction recognized as a formal disorder in DSM-5?", a: "**Gambling disorder** — ≥4 of 9 criteria over 12 months (escalating bets, restless when cutting back, repeated unsuccessful efforts to stop, preoccupation, gambling when distressed, chasing losses, lying, jeopardizing relationships/career, relying on others for money). Internet gaming disorder remains in the research appendix only. **Always screen patients newly started on dopamine agonists** — gambling and other impulse-control disorders are recognized iatrogenic effects.", difficulty: "medium" },
  { q: "What is the first-line pharmacotherapy for tobacco use disorder?", a: "**Varenicline** (alpha-4-beta-2 nicotinic partial agonist), **combination nicotine replacement therapy** (long-acting patch + short-acting gum/lozenge/inhaler), or **bupropion** (NDRI). Counseling plus pharmacotherapy is superior to either alone. There is no DSM-5 tobacco intoxication category — only tobacco use disorder and withdrawal.", difficulty: "medium" },

  // --- Medication-induced ---
  { q: "What is the classic tetrad of neuroleptic malignant syndrome (NMS)?", a: "**Fever, lead-pipe rigidity, autonomic instability, altered mental status.** Plus diaphoresis, tachycardia, labile BP, mutism, leukocytosis, **markedly elevated CK** (rhabdomyolysis), AKI. Onset within days to 2 weeks of antipsychotic exposure or dose increase. Mortality ~10%. Treatment: stop offending agent, supportive care (cooling, IV fluids), dantrolene, bromocriptine; ECT for refractory cases.", difficulty: "medium" },
  { q: "How is serotonin syndrome distinguished from NMS?", a: "**Serotonin syndrome:** rapid onset (hours), **hyperreflexia and clonus** (especially lower extremity), shivering, mydriasis, hyperactive bowel sounds, diarrhea — triggered by serotonergic combinations (SSRI + MAOI, SSRI + tramadol, SSRI + linezolid, triptan, dextromethorphan). **NMS:** slow onset (days–weeks), **lead-pipe rigidity and hyporeflexia**, normal pupils, decreased bowel sounds — triggered by dopamine antagonists. Treat serotonin syndrome with cyproheptadine; NMS with dantrolene/bromocriptine.", difficulty: "hard" },
  { q: "What is acute dystonia and how is it treated?", a: "Sustained involuntary muscle contractions (oculogyric crisis, torticollis, retrocollis, tongue/jaw involvement) within hours to days of starting/increasing an antipsychotic. **Highest risk in young men, high-potency typical antipsychotics, and IM depot formulations.** Treatment: **IM/IV anticholinergic** (benztropine 1–2 mg or diphenhydramine 25–50 mg) — dramatic relief within minutes. Laryngeal dystonia is a medical emergency requiring immediate airway management.", difficulty: "easy" },
  { q: "What is akathisia and why is it a critical safety issue?", a: "Subjective sense of inner restlessness with observable fidgeting/pacing/inability to sit still — develops within weeks of starting/increasing an antipsychotic. **Akathisia is a documented risk factor for suicidality and violence** — patients describe it as intolerable. Ask directly because motor signs can be subtle. Treatment: dose reduction, switch agent, **propranolol** (often most effective), benzodiazepines, anticholinergics.", difficulty: "medium" },
  { q: "What is tardive dyskinesia and what is the standard screening tool?", a: "Involuntary choreoathetoid movements (lip smacking, tongue protrusion, grimacing, choreoathetoid extremity movements) developing after months to years of antipsychotic use. Cumulative risk ~5%/year with typical antipsychotics; lower with atypicals. Often persists after discontinuation. **AIMS** (Abnormal Involuntary Movement Scale) is the standard screening every 6 months. **VMAT2 inhibitors** (valbenazine, deutetrabenazine) are FDA-approved treatments. Clozapine has the lowest risk of inducing TD.", difficulty: "medium" },
  { q: "What is antidepressant discontinuation syndrome (FINISH mnemonic)?", a: "**F**lu-like symptoms, **I**nsomnia, **N**ausea, **I**mbalance, **S**ensory disturbances (electric-shock 'brain zaps'), **H**yperarousal. Highest risk with short-half-life agents (paroxetine, venlafaxine); fluoxetine rarely causes it (long half-life acts as a self-taper). Symptoms begin 2–4 days after cessation, last 1–2 weeks. Prevention: taper over 2–4 weeks (or longer for high-risk agents).", difficulty: "medium" },
  { q: "What is lithium toxicity and what factors predispose to it?", a: "Toxicity at lithium levels ≥1.5 mEq/L: coarse tremor, ataxia, dysarthria, confusion, nausea/vomiting, diarrhea. Severe (>2.5): seizures, coma, arrhythmias, renal failure, death. **Predisposing factors:** dehydration, NSAIDs, ACE inhibitors/ARBs, thiazide diuretics, low-sodium diet, renal impairment, drug interactions. Lithium is renally excreted — anything reducing GFR or sodium delivery raises levels.", difficulty: "hard" },

  // --- Misc cross-cutting ---
  { q: "What is the difference between mood-congruent and mood-incongruent psychotic features?", a: "**Mood-congruent:** psychotic content is consistent with the predominant mood — depression with delusions of guilt, worthlessness, deserved punishment, or nihilism; mania with delusions of grandeur, special abilities, or persecution related to one's importance. **Mood-incongruent:** psychotic content is inconsistent with mood — bizarre delusions, thought insertion/broadcasting, persecutory delusions unrelated to mood theme. Mood-incongruent features generally portend worse prognosis and may suggest schizoaffective.", difficulty: "medium" },
  { q: "What is the catatonia specifier and when can it be applied?", a: "DSM-5 broadened catatonia from a schizophrenia subtype to a **cross-diagnostic specifier** that can be applied to schizophrenia, mood disorders (bipolar, MDD), substance-induced disorders, and medical conditions. Requires ≥3 of 12 symptoms (stupor, catalepsy, waxy flexibility, mutism, negativism, posturing, mannerism, stereotypy, agitation, grimacing, echolalia, echopraxia). Treat with lorazepam challenge first; ECT if refractory.", difficulty: "medium" },
];

// ================================================================
// NEW QUIZ QUESTIONS
// ================================================================
const NEW_QUIZ: Array<{
  q: string; a: string; b: string; c: string; d: string;
  correct: "A"|"B"|"C"|"D"; explanation: string; examOnly?: boolean;
}> = [
  {
    q: "A 24-year-old man presents with 7 days of decreased need for sleep (sleeping 2–3 hours and feeling rested), pressured speech, racing thoughts, grandiose plans, and a $40,000 unplanned credit-card spending spree. He has no history of psychiatric illness. What is the most likely diagnosis?",
    a: "Bipolar I disorder", b: "Bipolar II disorder", c: "Cyclothymic disorder", d: "Schizoaffective disorder, bipolar type",
    correct: "A",
    explanation: "A single manic episode (≥1 week of elevated/irritable mood + increased energy with ≥3 DIGFAST symptoms causing marked impairment) is sufficient for bipolar I, regardless of any prior depressive history. Bipolar II requires hypomania (4+ days, no marked impairment) AND a major depressive episode, and never a full manic episode."
  },
  {
    q: "Which of the following is the FIRST-LINE treatment for chronic insomnia disorder according to current evidence?",
    a: "A long-acting benzodiazepine such as clonazepam", b: "A benzodiazepine receptor agonist such as zolpidem", c: "Cognitive behavioral therapy for insomnia (CBT-I)", d: "Trazodone at bedtime",
    correct: "C",
    explanation: "CBT-I (sleep restriction, stimulus control, cognitive restructuring, sleep hygiene) is first-line for chronic insomnia and produces more durable benefit than pharmacotherapy. Benzodiazepines and Z-drugs are problematic long-term, particularly in older adults (falls, cognitive impairment, dependence)."
  },
  {
    q: "A 19-year-old woman is brought in with new-onset bizarre behavior over 2 weeks: paranoid delusions, command hallucinations, agitation alternating with catatonia, orofacial dyskinesias, and an episode of generalized seizure. Vital signs show autonomic instability. What is the most appropriate next step?",
    a: "Start risperidone for first-episode psychosis", b: "Begin urgent neurologic workup including LP for autoimmune encephalitis", c: "Diagnose schizophreniform disorder and refer outpatient", d: "Administer lorazepam for malignant catatonia and observe",
    correct: "B",
    explanation: "Anti-NMDA receptor encephalitis classically presents in young women with subacute psychosis, seizures, dyskinesias (especially orofacial), and dysautonomia. Often paraneoplastic (ovarian teratoma). Requires CSF NMDA-R antibodies, MRI, EEG, and immunotherapy. Misdiagnosis as primary psychosis delays effective treatment."
  },
  {
    q: "A 52-year-old man on chronic high-potency antipsychotic therapy is found to have lip smacking, tongue protrusion, and choreoathetoid finger movements that began over the past year and persist despite dose reduction. Which is the most appropriate management?",
    a: "Add benztropine for extrapyramidal symptoms", b: "Increase the antipsychotic dose to suppress the movements", c: "Initiate a VMAT2 inhibitor such as valbenazine", d: "Refer for deep brain stimulation",
    correct: "C",
    explanation: "This is tardive dyskinesia. Anticholinergics (benztropine) help acute dystonia and parkinsonism but typically WORSEN TD. Increasing the antipsychotic transiently masks symptoms but accelerates the underlying process. VMAT2 inhibitors (valbenazine, deutetrabenazine) are FDA-approved for TD. Switching to clozapine (lowest TD risk) is also reasonable."
  },
  {
    q: "Which feature most reliably distinguishes serotonin syndrome from neuroleptic malignant syndrome?",
    a: "The presence of fever", b: "Hyperreflexia and clonus, especially in the lower extremities", c: "Elevated creatine kinase", d: "Altered mental status",
    correct: "B",
    explanation: "Both syndromes can produce fever, mental status changes, and elevated CK. The distinguishing neuromuscular finding is hyperreflexia and lower-extremity clonus in serotonin syndrome (often with shivering and mydriasis), versus lead-pipe rigidity and hyporeflexia in NMS. Serotonin syndrome onsets in hours after a serotonergic combination; NMS onsets over days after a dopamine antagonist."
  },
  {
    q: "A 30-year-old woman with chronic depression on paroxetine 40 mg discontinues abruptly and 3 days later develops flu-like symptoms, dizziness, nausea, insomnia, and intermittent 'electric-shock' sensations in her head. What is the most likely diagnosis?",
    a: "Recurrent major depressive episode", b: "Panic disorder relapse", c: "Antidepressant discontinuation syndrome", d: "Serotonin syndrome",
    correct: "C",
    explanation: "FINISH mnemonic: Flu-like, Insomnia, Nausea, Imbalance, Sensory disturbances (brain zaps), Hyperarousal. Onset 2–4 days after cessation, lasts 1–2 weeks. Highest risk with short-half-life agents (paroxetine, venlafaxine). Distinguished from depressive relapse by rapid temporal correlation with discontinuation and characteristic sensory symptoms; reinstating the SSRI rapidly resolves it."
  },
  {
    q: "Which of the following is required to diagnose Disruptive Mood Dysregulation Disorder (DMDD)?",
    a: "Onset before age 6", b: "Persistent irritable/angry mood between temper outbursts", c: "Distinct episodes of elevated mood lasting ≥4 days", d: "A history of trauma exposure",
    correct: "B",
    explanation: "DMDD requires severe recurrent temper outbursts (≥3/week) PLUS persistently irritable or angry mood between outbursts, present ≥12 months in ≥2 settings. Onset must be before age 10, but the diagnosis is never first made before age 6 or after age 18. DMDD was created largely to combat over-diagnosis of pediatric bipolar disorder in chronically irritable youth without distinct mood episodes."
  },
  {
    q: "A 16-year-old girl presents with a BMI of 14.5, intense fear of weight gain, and persistent denial of the seriousness of her low weight. She has been losing weight by restricting and excessive exercise without binge or purge episodes. What is the most appropriate initial step?",
    a: "Begin outpatient family-based therapy", b: "Start fluoxetine to address mood symptoms", c: "Initiate inpatient medical stabilization with cautious refeeding", d: "Begin lisdexamfetamine for binge regulation",
    correct: "C",
    explanation: "BMI 14.5 meets DSM-5 'extreme' severity for anorexia nervosa, restricting subtype. Severe or rapid weight loss requires inpatient medical stabilization before outpatient psychotherapy. Refeeding must be cautious to prevent refeeding syndrome (hypophosphatemia, hypokalemia, hypomagnesemia → cardiac dysfunction). Family-based therapy is highly effective once medically stable. Lisdexamfetamine is approved for binge-eating disorder, not anorexia."
  },
  {
    q: "Which DSM-5 disorder requires the symptoms to be confirmed by prospective daily ratings over at least two cycles?",
    a: "Premenstrual dysphoric disorder (PMDD)", b: "Bipolar II disorder", c: "Cyclothymic disorder", d: "Persistent depressive disorder",
    correct: "A",
    explanation: "PMDD uniquely requires prospective daily symptom ratings over at least two symptomatic menstrual cycles to confirm the cyclical pattern. The diagnosis can be made provisionally before confirmation. Symptoms must occur in the final premenstrual week, improve within days of menses onset, and be minimal/absent post-menses."
  },
  {
    q: "Which statement about DSM-5 substance use disorder (SUD) diagnosis is correct?",
    a: "Tolerance and withdrawal are required for diagnosis", b: "DSM-5 retains the abuse/dependence distinction with separate severity criteria", c: "Tolerance and withdrawal during appropriately supervised medical use do not count toward diagnosis", d: "Severity is determined by the substance class rather than number of criteria met",
    correct: "C",
    explanation: "DSM-5 collapsed abuse and dependence into a single SUD with severity by criteria count (mild 2–3, moderate 4–5, severe 6+). Tolerance and withdrawal are 2 of 11 criteria but are EXPLICITLY excluded when occurring during appropriate medical supervision (prescribed opioids for pain, prescribed benzodiazepines, ADHD stimulants taken as directed) — physical dependence on a prescribed medication is distinct from addiction."
  },
  {
    q: "A patient with REM sleep behavior disorder (RBD) is at substantially increased risk of developing which of the following?",
    a: "Alzheimer's disease", b: "Frontotemporal dementia", c: "Parkinson's disease, dementia with Lewy bodies, or multiple system atrophy", d: "Vascular dementia",
    correct: "C",
    explanation: "RBD is a strong prodromal marker of synucleinopathies. Over 80% of patients with RBD eventually develop Parkinson's disease, dementia with Lewy bodies, or multiple system atrophy — often years to decades after RBD onset. AD, FTD, and vascular dementia do not show this association. Treatment with melatonin or clonazepam reduces injury risk during enacted dreams."
  },
  {
    q: "Which paraphilia is uniquely defined as a disorder regardless of whether the individual has acted on the urges or experiences distress?",
    a: "Voyeuristic disorder", b: "Pedophilic disorder", c: "Fetishistic disorder", d: "Transvestic disorder",
    correct: "B",
    explanation: "For most paraphilias (voyeuristic, exhibitionistic, frotteuristic), the disorder requires either acting on the urges with a nonconsenting person OR clinically significant distress. Pedophilic disorder is diagnosed if criteria A (urges/fantasies/behaviors regarding prepubertal children for ≥6 months), B (acted on OR distress), and C (age ≥16 and ≥5 years older than child) are met — but acting itself constitutes child sexual abuse and triggers mandatory reporting independent of the diagnostic question."
  },
  {
    q: "A 28-year-old combat veteran on sertraline reports persistent trauma-related nightmares that wake him nightly. Which adjunctive medication has the strongest evidence for nightmares specifically?",
    a: "Clonazepam", b: "Quetiapine", c: "Prazosin", d: "Trazodone",
    correct: "C",
    explanation: "Prazosin (an alpha-1 adrenergic antagonist) reduces trauma-related nightmares by attenuating noradrenergic arousal during REM sleep. Benzodiazepines (clonazepam) are AVOIDED in PTSD — they worsen long-term outcomes and impair fear extinction. Quetiapine has weak evidence and significant metabolic side effects. Trazodone helps general insomnia but not nightmares specifically."
  },
  {
    q: "Which feature is most characteristic of disinhibited social engagement disorder (DSED) compared with reactive attachment disorder (RAD)?",
    a: "Inhibited, emotionally withdrawn behavior toward caregivers", b: "Indiscriminate over-familiarity with unfamiliar adults", c: "Severe restrictive eating", d: "Recurrent dissociative episodes",
    correct: "B",
    explanation: "Both RAD and DSED follow documented insufficient care. RAD is characterized by INHIBITED behavior — the child rarely seeks or responds to comfort. DSED is characterized by indiscriminate over-familiarity — the child shows reduced reticence with unfamiliar adults and willingness to go off without hesitation. RAD resembles internalizing/depressive features; DSED resembles externalizing/ADHD-like features."
  },
  {
    q: "Which statement about gender dysphoria in DSM-5 is correct?",
    a: "Gender nonconformity is itself a mental disorder", b: "All transgender individuals meet criteria for gender dysphoria", c: "The diagnosis requires clinically significant distress or impairment", d: "The diagnosis cannot be made after gender-affirming treatment has begun",
    correct: "C",
    explanation: "Gender nonconformity is NOT a mental disorder. The DSM-5 diagnosis requires the additional element of clinically significant distress or impairment from the incongruence between experienced/expressed gender and assigned gender. Many transgender people do not experience dysphoria. The diagnosis exists to facilitate access to gender-affirming care, not to pathologize identity. The 'posttransition' specifier exists for individuals who continue to need clinical attention after transition."
  },
  {
    q: "A patient on chronic risperidone reports a profound, intolerable inner sense of restlessness, constantly shifting his weight while seated and pacing. Which intervention has the strongest evidence?",
    a: "Increase the risperidone dose", b: "Add benztropine 1 mg twice daily", c: "Add propranolol", d: "Reassure the patient that this will resolve spontaneously",
    correct: "C",
    explanation: "This is akathisia — a critical side effect because it is a documented risk factor for suicidality and violence. Best evidence supports propranolol (often most effective), with dose reduction or agent switch. Anticholinergics may help if dystonic features coexist. Reassurance alone is inappropriate given the safety risk. Increasing risperidone would worsen akathisia."
  },
  {
    q: "Which substance withdrawal syndrome is potentially fatal in healthy adults?",
    a: "Opioid withdrawal", b: "Benzodiazepine withdrawal", c: "Stimulant withdrawal", d: "Cannabis withdrawal",
    correct: "B",
    explanation: "Benzodiazepine (and barbiturate, alcohol) withdrawal can be fatal due to seizures, autonomic instability, and delirium. Long-acting benzodiazepine cross-taper in a monitored setting is required for severe dependence. Opioid withdrawal is severely uncomfortable but rarely fatal in healthy adults. Stimulant 'crash' carries acute suicide risk during severe dysphoria but is not directly lethal. Cannabis withdrawal is uncomfortable but not life-threatening."
  },
  {
    q: "What is the first-line treatment for trichotillomania?",
    a: "Habit reversal training", b: "High-dose SSRI", c: "Clomipramine", d: "Atypical antipsychotic augmentation",
    correct: "A",
    explanation: "Habit reversal training (awareness training + competing response + social support) has the strongest evidence for trichotillomania and excoriation disorder. SSRIs are less consistently effective than for OCD. N-acetylcysteine (NAC) has emerging supportive evidence. The same approach is used for skin-picking disorder."
  },
  {
    q: "Which neurobiological finding is most characteristic of PTSD compared with major depression?",
    a: "Elevated baseline cortisol with blunted dexamethasone suppression", b: "Reduced baseline cortisol with enhanced dexamethasone suppression", c: "Reduced hippocampal volume only on the left side", d: "Elevated norepinephrine with reduced serotonin",
    correct: "B",
    explanation: "Despite chronic stress exposure, PTSD is paradoxically associated with reduced baseline cortisol and ENHANCED HPA negative feedback (greater dexamethasone suppression) — opposite the pattern in depression (hypercortisolemia, blunted suppression). FKBP5 polymorphisms modulate glucocorticoid receptor sensitivity and interact with childhood trauma to confer risk. Hippocampal volume reduction is bilateral in PTSD."
  },
  {
    q: "A patient on chronic clozapine develops a sore throat and fever. What is the most urgent next step?",
    a: "Reassure and start symptomatic treatment", b: "Obtain an absolute neutrophil count immediately", c: "Increase the clozapine dose to address possible psychotic prodrome", d: "Switch to risperidone empirically",
    correct: "B",
    explanation: "Clozapine carries a small but serious risk of agranulocytosis. Any sign of infection in a patient on clozapine warrants immediate ANC. The REMS program requires regular ANC monitoring (weekly for first 6 months, then biweekly, then monthly). ANC <1000 typically requires holding the medication. Clozapine is uniquely effective for treatment-resistant schizophrenia and reduces suicide risk, so the decision to discontinue is consequential and should follow protocol."
  },
];

async function run() {
  console.log("⏳ Renaming topic 10 → Psychiatric Disorders");
  await db.update(topicsTable).set({
    name: "Psychiatric Disorders",
    description: "Comprehensive DSM-5 reference covering psychotic, mood, anxiety, OCD, trauma, dissociative, somatic, eating, sleep, sexual, paraphilic, substance, impulse-control, and medication-induced disorders. (Neurodevelopmental and neurocognitive disorders are covered in their own topics.)",
  }).where(eq(topicsTable.id, TOPIC_ID));

  console.log("⏳ Replacing study guide content");
  await db.update(studyGuidesTable).set({ content: STUDY_GUIDE })
    .where(eq(studyGuidesTable.id, GUIDE_ID));

  console.log(`⏳ Inserting ${NEW_FLASHCARDS.length} new flashcards`);
  for (const fc of NEW_FLASHCARDS) {
    await db.insert(flashcardsTable).values({
      topicId: TOPIC_ID,
      question: fc.q,
      answer: fc.a,
      difficulty: fc.difficulty,
    });
  }

  console.log(`⏳ Inserting ${NEW_QUIZ.length} new quiz questions`);
  for (const q of NEW_QUIZ) {
    await db.insert(quizQuestionsTable).values({
      topicId: TOPIC_ID,
      question: q.q,
      optionA: q.a,
      optionB: q.b,
      optionC: q.c,
      optionD: q.d,
      correctAnswer: q.correct,
      explanation: q.explanation,
      examOnly: q.examOnly ?? false,
    });
  }

  const fcRows = await db.select().from(flashcardsTable).where(eq(flashcardsTable.topicId, TOPIC_ID));
  const qzRows = await db.select().from(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, TOPIC_ID));
  console.log(`✅ Topic 10 (Psychiatric Disorders): ${STUDY_GUIDE.length} chars guide; ${fcRows.length} flashcards; ${qzRows.length} quiz questions.`);
}

run().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
