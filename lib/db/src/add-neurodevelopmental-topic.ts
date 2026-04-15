import { db } from "./index";
import {
  topicsTable,
  flashcardsTable,
  quizQuestionsTable,
  studyGuidesTable,
  practiceExamsTable,
  practiceExamQuestionsTable,
} from "./schema";

async function addNeurodevelopmentalTopic() {
  console.log("Adding Neurodevelopmental Disorders topic...");

  const [topic] = await db.insert(topicsTable).values([
    {
      name: "Neurodevelopmental Disorders",
      category: "Clinical",
      description: "Intellectual disability, communication disorders, autism spectrum disorder, ADHD, specific learning disorders, motor disorders, and other neurodevelopmental conditions.",
    },
  ]).returning();

  const topicId = topic.id;
  console.log(`  ✓ Topic inserted (id: ${topicId})`);

  // ===========================================================================
  // FLASHCARDS (50)
  // ===========================================================================
  const flashcards = [
    // Intellectual Developmental Disorders
    { topicId, question: "What are the three diagnostic criteria for Intellectual Developmental Disorder (IDD)?", answer: "1) Deficits in intellectual functions (reasoning, problem-solving, planning, abstract thinking, learning from experience — typically IQ ≤70, or 2 SD below mean). 2) Deficits in adaptive functioning in ≥1 domain (conceptual, social, or practical). 3) Onset during the developmental period. IQ alone is insufficient — adaptive functioning deficits are required.", difficulty: "medium" },
    { topicId, question: "How is severity of IDD determined in DSM-5?", answer: "Severity (mild, moderate, severe, profound) is based on ADAPTIVE FUNCTIONING — not IQ score alone. Adaptive functioning reflects the level of supports required across three domains: conceptual (language, reading, money), social (interpersonal skills, social judgment), and practical (self-care, job performance, money management).", difficulty: "hard" },
    { topicId, question: "What is the most common chromosomal cause of IDD?", answer: "Down syndrome (Trisomy 21). Features include: mild to moderate IDD, characteristic facial features (epicanthal folds, flat nasal bridge), hypotonia, congenital heart defects, and markedly elevated risk of early-onset Alzheimer's disease (chromosome 21 carries the APP gene — amyloid precursor protein).", difficulty: "medium" },
    { topicId, question: "What is Fragile X syndrome?", answer: "The most common INHERITED cause of IDD. Caused by CGG repeat expansion in the FMR1 gene on the X chromosome (silencing FMRP protein). Features: IDD (mild to severe), macroorchidism, long face, large ears, prominent jaw, social anxiety, gaze aversion, and autism-like features. X-linked — males more severely affected.", difficulty: "medium" },
    { topicId, question: "What is Fetal Alcohol Spectrum Disorder (FASD)?", answer: "The most common PREVENTABLE cause of IDD. Caused by prenatal alcohol exposure. Features: IDD or learning difficulties, growth deficiency, characteristic facial features (smooth philtrum, thin upper lip, small palpebral fissures), and deficits in executive function, attention, memory, and impulse control. No safe level of alcohol in pregnancy.", difficulty: "medium" },
    { topicId, question: "What is Global Developmental Delay (GDD)?", answer: "A DSM-5 diagnosis used for children UNDER 5 years of age who fail to meet developmental milestones in multiple areas but whose intellectual level cannot be reliably assessed by standardized tests. It is a provisional diagnosis — re-evaluation is required after the child can be formally tested.", difficulty: "medium" },
    // Communication Disorders
    { topicId, question: "What are the Communication Disorders in DSM-5?", answer: "Language Disorder, Speech Sound Disorder, Childhood-Onset Fluency Disorder (Stuttering), Social (Pragmatic) Communication Disorder, and Other Specified/Unspecified Communication Disorder.", difficulty: "easy" },
    { topicId, question: "What is Language Disorder?", answer: "Persistent difficulties acquiring and using language (spoken, written, or sign) due to deficits in comprehension or production. Includes reduced vocabulary, limited sentence structure, and impaired discourse. Not due to hearing loss, motor dysfunction, or other medical/neurological conditions. Symptoms present from early childhood.", difficulty: "medium" },
    { topicId, question: "What is Speech Sound Disorder?", answer: "Persistent difficulty with speech sound production that interferes with intelligibility and communication, not explained by congenital/acquired conditions (cleft palate, hearing loss, neurological disorders). Previously called phonological disorder. Characterized by errors in sound production and organization (substitutions, omissions, distortions).", difficulty: "medium" },
    { topicId, question: "What is Childhood-Onset Fluency Disorder (Stuttering)?", answer: "Disturbance in normal fluency and time patterning of speech, including: sound/syllable repetitions, sound prolongations, broken words, blocking (inability to produce sound), circumlocutions, word substitutions, and excess physical tension. Most children recover spontaneously; neurobiological basis involves basal ganglia-thalamo-cortical circuit dysfunction.", difficulty: "medium" },
    { topicId, question: "What is Social (Pragmatic) Communication Disorder (SCD) and how does it differ from ASD?", answer: "SCD involves persistent difficulties using verbal and nonverbal communication for social purposes — greetings, conversation turn-taking, adjusting language to context, and understanding figurative language. KEY DISTINCTION from ASD: SCD does NOT involve restricted, repetitive behaviors or interests. If RRBs are present, ASD must be diagnosed instead.", difficulty: "hard" },
    // Autism Spectrum Disorder
    { topicId, question: "What is Autism Spectrum Disorder (ASD)?", answer: "A neurodevelopmental disorder with two core domains: A) Persistent deficits in social communication and social interaction across contexts (social-emotional reciprocity, nonverbal communicative behaviors, developing/maintaining relationships). B) Restricted, repetitive patterns of behavior, interests, or activities. Symptoms must be present early in development.", difficulty: "easy" },
    { topicId, question: "What are the DSM-5 severity levels for ASD?", answer: "Based on required support level — NOT IQ. Level 1 (Requiring Support): noticeable deficits, difficulties initiating, reduced reciprocity. Level 2 (Requiring Substantial Support): marked deficits, limited initiation, narrow interests, inflexibility. Level 3 (Requiring Very Substantial Support): severe deficits, very limited communication, extreme difficulty with change.", difficulty: "medium" },
    { topicId, question: "What was the change between DSM-IV and DSM-5 regarding autism diagnoses?", answer: "DSM-5 merged the separate DSM-IV diagnoses (Autistic Disorder, Asperger's Disorder, PDD-NOS, Childhood Disintegrative Disorder) into a single diagnosis: Autism Spectrum Disorder. Asperger's was characterized by ASD features WITHOUT language or cognitive delays — these individuals typically become ASD Level 1 in DSM-5.", difficulty: "hard" },
    { topicId, question: "What is the prevalence and sex ratio of ASD?", answer: "Approximately 1 in 36 children (CDC 2023). Male-to-female ratio approximately 4:1. The higher male prevalence may partly reflect a diagnostic bias — females more often camouflage/mask deficits through social mimicry, leading to later and underdiagnosis. The 'female autism phenotype' is increasingly recognized.", difficulty: "medium" },
    { topicId, question: "What is 'camouflaging' or 'masking' in ASD?", answer: "A compensatory strategy — especially prevalent in females with ASD — of mimicking social behaviors, suppressing stimming, and using scripts to appear neurotypical. Camouflaging reduces diagnostic recognition and is associated with higher rates of anxiety, depression, autistic burnout, and later diagnosis in girls and women.", difficulty: "hard" },
    { topicId, question: "What are the restricted, repetitive behaviors (RRBs) in ASD?", answer: "Domain B symptoms: 1) Stereotyped/repetitive motor movements, use of objects, or speech (echolalia, idiosyncratic phrases). 2) Insistence on sameness, inflexible routines, extreme distress at small changes. 3) Highly restricted, fixated interests of abnormal intensity/focus. 4) Hyper- or hyporeactivity to sensory input (seeking/avoiding).", difficulty: "medium" },
    { topicId, question: "What is the evidence-based behavioral intervention for ASD?", answer: "Applied Behavior Analysis (ABA) is the most evidence-based intervention. Based on operant conditioning principles (reinforcement schedules). Early Intensive Behavioral Intervention (EIBI) — 20-40 hours/week for young children — shows strongest outcomes for communication, adaptive behavior, and IQ gains. Also: PECS, social skills training, speech/language therapy.", difficulty: "medium" },
    { topicId, question: "What medications are FDA-approved for ASD?", answer: "Risperidone (Risperdal) and Aripiprazole (Abilify) are FDA-approved for irritability/aggression/self-injury associated with ASD. No medication treats the core social communication deficits. SSRIs target repetitive behaviors (mixed evidence). Stimulants treat comorbid ADHD (response is often lower and side effects more frequent in ASD).", difficulty: "medium" },
    { topicId, question: "What genetic syndromes are commonly associated with ASD?", answer: "Fragile X (~30% have ASD features), Tuberous Sclerosis (~50% ASD), Angelman syndrome, Phelan-McDermid syndrome (22q13.3/SHANK3 deletion), Rett syndrome (MECP2), 15q11-13 duplication, PTEN mutations. Chromosomal microarray (detects copy number variants) is first-line genetic testing for ASD.", difficulty: "hard" },
    // ADHD
    { topicId, question: "What is ADHD and what are the DSM-5 criteria?", answer: "A neurodevelopmental disorder with persistent inattention and/or hyperactivity-impulsivity. Requires: ≥6 symptoms of inattention OR hyperactivity-impulsivity (≥5 for individuals ≥17 years), present BEFORE age 12, in ≥2 settings, causing functional impairment, not better explained by another condition.", difficulty: "easy" },
    { topicId, question: "What are the three presentations of ADHD in DSM-5?", answer: "Predominantly Inattentive (ADHD-PI): ≥6 inattention symptoms, <6 hyperactive-impulsive. Predominantly Hyperactive-Impulsive (ADHD-PHI): ≥6 hyperactive-impulsive, <6 inattention. Combined Presentation (ADHD-C): ≥6 of both types. Presentations can change over time.", difficulty: "medium" },
    { topicId, question: "What are the inattention symptoms of ADHD (DSM-5)?", answer: "Six or more: 1) Fails to give close attention/careless errors, 2) Difficulty sustaining attention, 3) Doesn't seem to listen when spoken to directly, 4) Doesn't follow through on tasks, 5) Difficulty organizing, 6) Avoids/dislikes tasks requiring sustained mental effort, 7) Loses things, 8) Easily distracted by extraneous stimuli, 9) Forgetful in daily activities.", difficulty: "hard" },
    { topicId, question: "What is the neurobiological basis of ADHD?", answer: "Underactivation of prefrontal cortical circuits with reduced dopaminergic and noradrenergic signaling. Key regions: prefrontal cortex (executive function, inhibition), striatum (reward/motivation), and cerebellum (timing). Heritability ~75-80%. Key genes: DRD4, DRD5, DAT1, SNAP-25. Smaller frontal lobe and cerebellar vermis on neuroimaging.", difficulty: "hard" },
    { topicId, question: "How do stimulant medications work in ADHD?", answer: "Methylphenidate (Ritalin, Concerta): primarily blocks dopamine and norepinephrine reuptake transporters. Amphetamines (Adderall, Vyvanse): block reuptake AND promote release of DA and NE via reversal of transporters. Both increase synaptic DA/NE in prefrontal circuits — improving signal-to-noise ratio and executive control. Response rate ~70-80%.", difficulty: "medium" },
    { topicId, question: "What non-stimulant medications are used for ADHD?", answer: "Atomoxetine (Strattera) — selective NE reuptake inhibitor (non-controlled). Viloxazine (Qelbree) — NE reuptake inhibitor. Guanfacine ER (Intuniv) and Clonidine ER (Kapvay) — alpha-2A adrenergic agonists; reduce 'noise' in PFC by hyperpolarizing non-optimal neurons. Used when stimulants are ineffective, contraindicated, or when substance abuse is a concern.", difficulty: "medium" },
    { topicId, question: "What is the prevalence and sex ratio of ADHD?", answer: "~5% in children, ~2.5% in adults worldwide. Male-to-female ratio approximately 2:1 in community samples (3:1 in clinic-referred samples). Females more often present with inattentive subtype — less disruptive, more likely to internalize — leading to underdiagnosis. Adult ADHD often persists but hyperactivity diminishes while inattention remains.", difficulty: "medium" },
    { topicId, question: "What is executive function and how does it relate to ADHD?", answer: "Executive functions are prefrontal-mediated cognitive abilities: response inhibition, working memory, cognitive flexibility, planning, and self-monitoring. Barkley's model places response inhibition as the primary ADHD deficit — impairing all other executive functions dependent on the ability to inhibit dominant responses. ADHD is fundamentally an executive function disorder.", difficulty: "hard" },
    { topicId, question: "What is the age-of-onset criterion for ADHD in DSM-5 and how did it change from DSM-IV?", answer: "DSM-5 raised the age-of-onset criterion from age 7 (DSM-IV) to age 12. This change acknowledged that: 1) The age-7 cutoff had poor empirical support, 2) Inattentive symptoms may not become apparent until academic demands increase, and 3) Retrospective recall before age 7 is unreliable.", difficulty: "medium" },
    { topicId, question: "What are the most common comorbidities with ADHD?", answer: "Oppositional Defiant Disorder (~50%), Conduct Disorder (~25%), anxiety disorders (~25-50%), mood disorders (depression, dysthymia), specific learning disorders, tic disorders (Tourette's in 7%), and sleep problems. At least 2/3 of children with ADHD have ≥1 comorbid condition.", difficulty: "medium" },
    // Specific Learning Disorders
    { topicId, question: "What is Specific Learning Disorder (SLD)?", answer: "Persistent difficulties learning and using academic skills despite appropriate instruction, for ≥6 months. Must specify: impairment in reading (dyslexia), written expression (dysgraphia), or mathematics (dyscalculia). Performance substantially and quantifiably below expected level. Not explained by intellectual disability, sensory deficits, or inadequate instruction.", difficulty: "easy" },
    { topicId, question: "What is dyslexia (SLD with reading impairment)?", answer: "Persistent difficulties with accurate/fluent word recognition, decoding, and spelling — despite adequate instruction and normal IQ. The phonological deficit theory is the most supported: dyslexia results from impaired phonological processing (phoneme-grapheme mapping). fMRI shows underactivation of the left temporoparietal system and compensatory right-hemisphere or frontal activation.", difficulty: "medium" },
    { topicId, question: "What is the phonological deficit theory of dyslexia?", answer: "The most empirically supported explanation: dyslexia results from deficits in phonological awareness — the ability to identify, segment, blend, and manipulate phonemes (individual sounds). This impairs grapheme-phoneme correspondence needed for decoding. Key brain regions implicated: left angular gyrus, supramarginal gyrus, and Wernicke's area.", difficulty: "hard" },
    { topicId, question: "What is dyscalculia (SLD with mathematics impairment)?", answer: "Persistent difficulties with number sense, arithmetic fact retrieval, accurate calculation, and mathematical reasoning, despite adequate instruction. Neurobiological basis: dysfunction in the intraparietal sulcus (IPS) — the brain's 'number region' for magnitude processing. Prevalence ~5-7%, similar to dyslexia.", difficulty: "medium" },
    { topicId, question: "What is dysgraphia (SLD with written expression impairment)?", answer: "Persistent difficulties with spelling, grammatical/punctuation accuracy, and clarity/organization of written expression. May involve motor components (poor letter formation, slow handwriting) and/or language components. Commonly co-occurs with dyslexia. Must be distinguished from fine motor deficits alone (which would suggest DCD).", difficulty: "medium" },
    // Motor Disorders
    { topicId, question: "What are the Motor Disorders listed in DSM-5?", answer: "Developmental Coordination Disorder (DCD), Stereotypic Movement Disorder, and Tic Disorders: Tourette's Disorder, Persistent Motor or Vocal Tic Disorder, Provisional Tic Disorder, Other Specified Tic Disorder, and Unspecified Tic Disorder.", difficulty: "easy" },
    { topicId, question: "What is Developmental Coordination Disorder (DCD)?", answer: "Also called dyspraxia. Acquisition and execution of coordinated motor skills is substantially below expected for chronological age — manifesting as clumsiness, slowness, and inaccuracy (dropping objects, poor handwriting, bumping into things, difficulty with sports). Not explained by intellectual disability, visual impairment, or other neurological conditions. Interferes with daily life and academics.", difficulty: "medium" },
    { topicId, question: "What is Tourette's Disorder?", answer: "Characterized by: multiple MOTOR tics AND at least one VOCAL tic, present for >1 year (though not necessarily simultaneously), with onset before age 18. Tics are sudden, rapid, recurrent, nonrhythmic motor movements or vocalizations. They wax and wane in frequency, can be transiently suppressed (with a 'premonitory urge'), and often diminish in adulthood.", difficulty: "medium" },
    { topicId, question: "What is the difference between simple and complex tics?", answer: "Simple motor tics: single muscle groups — eye blinking, head jerking, shoulder shrugging, nose twitching. Simple vocal tics: throat clearing, sniffing, grunting. Complex motor tics: coordinated movements involving multiple muscle groups — facial gestures, jumping, touching, copropaxia. Complex vocal tics: words, phrases, coprolalia (involuntary obscenities — only ~10-15% of Tourette's).", difficulty: "hard" },
    { topicId, question: "What is the neurobiological basis of tic disorders?", answer: "Dysfunction in cortico-striato-thalamo-cortical (CSTC) circuits — specifically impaired basal ganglia filtering allows unwanted motor programs to 'break through.' Dopamine plays a central role. First-line pharmacological treatments: alpha-2 agonists (guanfacine, clonidine). Antipsychotics (haloperidol, fluphenazine, aripiprazole) for more severe cases. CBIT (Comprehensive Behavioral Intervention for Tics) is first-line non-pharmacological.", difficulty: "hard" },
    { topicId, question: "What is Stereotypic Movement Disorder?", answer: "Repetitive, seemingly driven, apparently purposeless motor behavior (hand waving/flapping, rocking, head banging, self-biting) that interferes with activities or causes self-injury. Must be distinguished from: tics (suppressible, non-purposeless appearing), ASD stereotypies (if ASD is present, separate diagnosis only if stereotypies cause additional independent impairment), and OCD compulsions.", difficulty: "hard" },
    { topicId, question: "How are tics treated behaviorally?", answer: "CBIT (Comprehensive Behavioral Intervention for Tics) includes Habit Reversal Training (HRT) — identifying the premonitory urge, then performing a competing response — and function-based assessment. This is the first-line non-pharmacological treatment with strong RCT evidence. ERP (Exposure with Response Prevention) components are also used.", difficulty: "medium" },
    // Cross-cutting and other
    { topicId, question: "What is the relationship between ASD and ADHD in DSM-5?", answer: "DSM-5 allows co-diagnosis of ASD and ADHD — this was EXCLUDED in DSM-IV. Up to 30-50% of individuals with ASD also meet ADHD criteria. They share genetic risk factors and overlapping neurobiological underpinnings (frontostriatal circuits). ADHD stimulant response in ASD is often attenuated, with more side effects.", difficulty: "medium" },
    { topicId, question: "What is the role of the cerebellum in neurodevelopmental disorders?", answer: "The cerebellum is implicated in timing, automatization of learned skills, and error-prediction. Cerebellar abnormalities are found in ADHD (smaller vermis), ASD (Purkinje cell loss, cerebellar hypoplasia), and dyslexia (timing deficits). Schmahmann's cerebellar model extends cerebellar function to cognition and emotion — relevant to neurodevelopmental conditions.", difficulty: "hard" },
    { topicId, question: "What is Rett Syndrome?", answer: "A neurodevelopmental disorder caused by MECP2 gene mutations (X-linked dominant — almost exclusively in females). Normal development followed by regression (ages 6-18 months): loss of purposeful hand use, characteristic hand-wringing stereotypies, gait disturbances, seizures, and severe language impairment. Previously a DSM-IV PDD; now coded separately as a known medical/genetic condition in DSM-5.", difficulty: "hard" },
    { topicId, question: "What is Williams syndrome and why is it neuropsychologically notable?", answer: "Caused by deletion of 7q11.23 (elastin gene region). Features: mild-moderate IDD, but unusually sociable/loquacious personality, strong language/verbal abilities, excellent music appreciation, and severely impaired visuospatial skills. Represents a striking double dissociation: intact verbal/social → impaired spatial — informing the modularity of cognitive abilities.", difficulty: "hard" },
    { topicId, question: "What is Prader-Willi syndrome?", answer: "Caused by loss of paternal chromosome 15q11-13 (or maternal uniparental disomy). Features: mild IDD, hyperphagia (insatiable appetite → obesity), behavioral rigidity, obsessive-compulsive behaviors, hypotonia in infancy, short stature, and hypogonadism. High rates of ASD-like behaviors and psychosis in adolescence.", difficulty: "hard" },
    { topicId, question: "How does the female presentation of ADHD differ from the male presentation?", answer: "Females more commonly present with Predominantly Inattentive type — daydreaming, disorganization, emotional dysregulation — rather than hyperactive/impulsive symptoms. They internalize rather than externalize, leading to anxiety and depression rather than behavioral disruption. This results in later diagnosis, underdiagnosis, and higher psychological burden.", difficulty: "medium" },
    { topicId, question: "What are neurodevelopmental disorders as defined in DSM-5?", answer: "The opening DSM-5 chapter — conditions with onset in the developmental period (typically before school age, though symptoms may not be fully recognized until demands exceed capacities). Grouped together because of overlapping genetic risk, neurobiology, and developmental trajectories. Includes: IDD, Communication Disorders, ASD, ADHD, SLD, Motor Disorders, and other neurodevelopmental disorders.", difficulty: "easy" },
    { topicId, question: "What is the 'double-deficit hypothesis' of dyslexia?", answer: "Proposes that dyslexia involves two independent deficits: 1) Phonological awareness deficit (core deficit — impaired phoneme processing) and 2) Processing speed/naming speed deficit (rapid automatized naming — RAN). Having both deficits ('double deficit') predicts a more severe reading disorder than either deficit alone.", difficulty: "hard" },
    { topicId, question: "What is Persistent Motor or Vocal Tic Disorder and how does it differ from Tourette's?", answer: "Characterized by either motor tics OR vocal tics (but NOT both) for >1 year. Tourette's requires BOTH motor tics and vocal tics for >1 year. Provisional Tic Disorder includes motor and/or vocal tics present for <1 year since first onset.", difficulty: "medium" },
  ];

  await db.insert(flashcardsTable).values(flashcards);
  console.log(`  ✓ ${flashcards.length} flashcards inserted`);

  // ===========================================================================
  // QUIZ QUESTIONS (10)
  // ===========================================================================
  const quizQuestions = [
    {
      topicId,
      question: "A 7-year-old has an IQ of 65 but age-appropriate adaptive functioning in social and practical domains. What is the most appropriate diagnosis?",
      optionA: "Intellectual Developmental Disorder, mild severity",
      optionB: "No diagnosis — adaptive functioning deficits are required in addition to intellectual deficits",
      optionC: "Borderline intellectual functioning",
      optionD: "Global Developmental Delay",
      correctAnswer: "B",
      explanation: "IDD requires BOTH intellectual deficits (IQ ~2 SD below mean) AND deficits in adaptive functioning in at least one domain (conceptual, social, or practical). IQ score alone is insufficient — if adaptive functioning is intact, the diagnosis of IDD cannot be made.",
      examOnly: false,
    },
    {
      topicId,
      question: "Which feature BEST distinguishes Autism Spectrum Disorder from Social (Pragmatic) Communication Disorder?",
      optionA: "ASD requires intellectual disability; SCD does not",
      optionB: "ASD onset is always before age 3; SCD can onset later",
      optionC: "ASD includes restricted, repetitive behaviors; SCD does not",
      optionD: "SCD involves more severe language deficits than ASD",
      correctAnswer: "C",
      explanation: "The defining distinction is Domain B — restricted, repetitive patterns of behavior, interests, or activities. ASD requires both social communication deficits AND restricted/repetitive behaviors. Social (Pragmatic) Communication Disorder involves only social communication deficits without RRBs. If RRBs are present, ASD must be diagnosed.",
      examOnly: false,
    },
    {
      topicId,
      question: "The most common INHERITED cause of intellectual developmental disorder is:",
      optionA: "Down syndrome (Trisomy 21)",
      optionB: "Fetal Alcohol Spectrum Disorder",
      optionC: "Fragile X syndrome",
      optionD: "Rett syndrome",
      correctAnswer: "C",
      explanation: "Fragile X syndrome (FMR1 CGG repeat expansion — X-linked) is the most common single-gene inherited cause of IDD. Down syndrome is the most common chromosomal cause. FASD is the most common preventable cause. These distinctions are commonly tested.",
      examOnly: false,
    },
    {
      topicId,
      question: "A child has motor tics (eye blinking, neck jerking) AND a vocal tic (throat clearing) that have been present for 14 months. The correct DSM-5 diagnosis is:",
      optionA: "Provisional Tic Disorder",
      optionB: "Persistent Motor Tic Disorder",
      optionC: "Stereotypic Movement Disorder",
      optionD: "Tourette's Disorder",
      correctAnswer: "D",
      explanation: "Tourette's Disorder requires multiple motor tics AND at least one vocal tic, present for more than 1 year, with onset before age 18. This child meets all criteria. Provisional Tic Disorder is used when tics have been present for less than 1 year.",
      examOnly: false,
    },
    {
      topicId,
      question: "DSM-5 severity levels for ASD are primarily based on:",
      optionA: "IQ score and language development level",
      optionB: "Number of diagnostic criteria met",
      optionC: "Level of support required for daily functioning",
      optionD: "Age of symptom onset",
      correctAnswer: "C",
      explanation: "ASD severity levels (1 = Requiring Support, 2 = Requiring Substantial Support, 3 = Requiring Very Substantial Support) are based on the level of support the individual needs — reflecting functional impairment across the two symptom domains — not IQ, language level, or number of criteria.",
      examOnly: false,
    },
    {
      topicId,
      question: "A child has persistent difficulties with word recognition, decoding, and spelling despite adequate instruction and normal intelligence. The most likely diagnosis is:",
      optionA: "Language Disorder",
      optionB: "Speech Sound Disorder",
      optionC: "Specific Learning Disorder with impairment in reading (dyslexia)",
      optionD: "Intellectual Developmental Disorder, mild",
      correctAnswer: "C",
      explanation: "Dyslexia (SLD with reading impairment) is characterized by deficits in word recognition, decoding, and spelling due to impaired phonological processing. It occurs despite adequate instruction and normal IQ, distinguishing it from IDD or instructional deprivation.",
      examOnly: false,
    },
    {
      topicId,
      question: "Stimulant medications for ADHD primarily work by:",
      optionA: "Increasing GABA activity in the cortex",
      optionB: "Blocking serotonin reuptake in limbic circuits",
      optionC: "Increasing dopamine and norepinephrine availability in prefrontal circuits",
      optionD: "Decreasing glutamate activity in the striatum",
      correctAnswer: "C",
      explanation: "Stimulants (methylphenidate and amphetamines) increase synaptic dopamine and norepinephrine — primarily in prefrontal circuits — by blocking reuptake (both drugs) and promoting release (amphetamines). This addresses the core neurobiological deficit in ADHD: underactivation of prefrontal executive circuits.",
      examOnly: false,
    },
    {
      topicId,
      question: "Coprolalia (involuntary use of obscene words) occurs in approximately what proportion of individuals with Tourette's Disorder?",
      optionA: "The majority (~70-80%)",
      optionB: "About half (~50%)",
      optionC: "A small minority (~10-15%)",
      optionD: "It is required for the diagnosis",
      correctAnswer: "C",
      explanation: "Coprolalia occurs in only approximately 10-15% of individuals with Tourette's Disorder. It is NOT required for diagnosis and is dramatically overrepresented in media portrayals. Diagnosis requires only multiple motor tics and at least one vocal tic for >1 year.",
      examOnly: false,
    },
    {
      topicId,
      question: "DSM-5 allows co-diagnosis of ASD and ADHD. This represents a change from DSM-IV because:",
      optionA: "DSM-IV only allowed ADHD to be diagnosed, not ASD",
      optionB: "DSM-IV excluded ADHD diagnosis when ASD was present",
      optionC: "DSM-IV required ASD to be diagnosed before ADHD",
      optionD: "There is no significant change between DSM-IV and DSM-5 on this point",
      correctAnswer: "B",
      explanation: "DSM-IV had an exclusionary rule preventing ADHD diagnosis when ASD was present. DSM-5 removed this exclusion, recognizing that 30-50% of individuals with ASD also have clinically significant ADHD symptoms requiring independent treatment.",
      examOnly: false,
    },
    {
      topicId,
      question: "A 4-year-old is not meeting developmental milestones in motor, language, and cognitive domains. Formal intellectual testing is unreliable at this age. The most appropriate DSM-5 diagnosis is:",
      optionA: "Intellectual Developmental Disorder, moderate severity",
      optionB: "Unspecified Neurodevelopmental Disorder",
      optionC: "Global Developmental Delay",
      optionD: "Other Specified Neurodevelopmental Disorder",
      correctAnswer: "C",
      explanation: "Global Developmental Delay is the DSM-5 diagnosis for children UNDER 5 years who fail to meet developmental milestones in multiple areas, but whose intellectual level cannot yet be reliably measured by standardized tests. It is a provisional diagnosis requiring re-evaluation when the child is older.",
      examOnly: false,
    },
  ];

  const insertedQuestions = await db.insert(quizQuestionsTable).values(quizQuestions).returning();
  console.log(`  ✓ ${quizQuestions.length} quiz questions inserted`);

  // ===========================================================================
  // STUDY GUIDE
  // ===========================================================================
  const studyGuide = {
    topicId,
    title: "Neurodevelopmental Disorders — Study Guide",
    content: `## Overview

Neurodevelopmental disorders constitute the first chapter of DSM-5 — a group of conditions with onset in the developmental period (before school age in most cases, though symptoms may not be fully recognized until demands exceed the individual's capacities). They are unified by overlapping genetic risk, shared neurobiological underpinnings, frequent co-occurrence, and a life-course perspective. The major categories are: Intellectual Developmental Disorder, Communication Disorders, Autism Spectrum Disorder, Attention-Deficit/Hyperactivity Disorder, Specific Learning Disorder, Motor Disorders, and Other Neurodevelopmental Disorders.

---

## Intellectual Developmental Disorder (IDD)

### Diagnostic Criteria
Three domains must all be present:
1. **Intellectual deficits** — deficits in reasoning, problem-solving, planning, abstract thinking, judgment, learning from experience, and practical understanding; confirmed by clinical assessment AND standardized testing (IQ ~2 SD below mean, typically ≤70)
2. **Adaptive functioning deficits** — failure to meet developmental/sociocultural standards in ≥1 adaptive domain (conceptual, social, or practical)
3. **Onset during the developmental period**

**IQ alone is not sufficient** — adaptive functioning must be impaired. Severity is determined by adaptive functioning level (not IQ), reflecting the supports required.

| Severity | Conceptual | Social | Practical |
|----------|-----------|--------|-----------|
| Mild | Academic difficulties; concrete thinking | Immature social judgment | May need support with money, scheduling |
| Moderate | Limited academic attainment | Communication simpler; romantic relationships limited | Needs support for complex daily living |
| Severe | Limited conceptual skills | Simple speech | Supervised in all activities |
| Profound | Physical, not conceptual skills | Symbolic communication limited | Constant support needed |

### Common Etiologies
- **Down syndrome (Trisomy 21):** Most common chromosomal cause. IDD (mild-moderate), congenital heart disease, elevated Alzheimer's risk (APP gene on chr 21).
- **Fragile X syndrome:** Most common INHERITED cause. FMR1 CGG repeat expansion; macroorchidism, ASD features, elongated face.
- **FASD (Fetal Alcohol Spectrum Disorder):** Most common PREVENTABLE cause. Impairs executive function, attention, and learning.
- **Global Developmental Delay (GDD):** Provisional diagnosis for children <5 years — reassess when formal testing is possible.

---

## Communication Disorders

### Language Disorder
Persistent deficits in language comprehension or production — reduced vocabulary, limited sentence structure, impaired discourse. Not attributable to hearing loss, motor dysfunction, or neurological conditions. Onset in early developmental period.

### Speech Sound Disorder
Persistent difficulty producing speech sounds affecting intelligibility. Not explained by structural or neurological causes. Previously called phonological disorder.

### Childhood-Onset Fluency Disorder (Stuttering)
Disruptions in normal speech fluency: sound/syllable repetitions, prolongations, blocks, circumlocutions, physical tension. ~75% of children recover; persistent stuttering involves basal ganglia-cortical circuit dysfunction. Worsens under stress, improves when alone or singing.

### Social (Pragmatic) Communication Disorder (SCD)
Persistent difficulties using communication for social purposes — adjusting language to context, following conversation rules, understanding implication and figurative language. **Critical distinction from ASD: NO restricted/repetitive behaviors (RRBs).** If RRBs are present, ASD is diagnosed instead.

---

## Autism Spectrum Disorder (ASD)

### Core Diagnostic Domains (DSM-5)
**Domain A — Social Communication and Interaction** (must have all 3):
1. Deficits in social-emotional reciprocity (abnormal social approach, reduced sharing of interest/emotions)
2. Deficits in nonverbal communicative behaviors (poor eye contact, limited gesture, absent facial expression)
3. Deficits in developing/maintaining/understanding relationships (difficulty adjusting behavior to context, lack of interest in peers)

**Domain B — Restricted, Repetitive Behaviors** (must have ≥2 of 4):
1. Stereotyped/repetitive motor movements, use of objects, or speech (echolalia, idiosyncratic phrases, lining objects)
2. Insistence on sameness, inflexible routines, ritualized patterns; extreme distress at small changes
3. Highly restricted, fixated interests of abnormal intensity or focus
4. Hyper- or hyporeactivity to sensory input (aversion to certain textures/sounds, seeking vestibular stimulation)

**Additional specifiers:** With/without intellectual impairment; with/without language impairment; associated with known genetic condition; severity level (1/2/3).

### DSM-5 Changes from DSM-IV
- Merged autistic disorder, Asperger's, PDD-NOS, and childhood disintegrative disorder into a single spectrum
- Removed the exclusion of co-occurring ADHD diagnosis
- Added sensory processing as an RRB criterion

### Epidemiology and Neurobiological Basis
- Prevalence: ~1 in 36 (CDC 2023); male:female ~4:1 (partly reflects underdiagnosis in females)
- Heritability: 60–90%; polygenic + rare high-penetrance mutations (SHANK3, CNTNAP2, PTEN, NLGN3/4)
- Neuroimaging: early brain overgrowth, altered long-range connectivity, reduced mirror neuron system activity, cerebellar abnormalities
- **Camouflaging/masking** in females: mimicking social behavior, suppressing stimming — leads to later diagnosis and higher rates of anxiety/depression

### Treatment
- **ABA (Applied Behavior Analysis):** Most evidence-based; EIBI (early intensive) for young children
- **Communication:** PECS, AAC devices, speech/language therapy
- **Social skills:** Social Skills Training (SST)
- **Pharmacological:** No FDA-approved treatment for core symptoms. Risperidone/Aripiprazole for irritability. SSRIs for repetitive behaviors (mixed evidence). Stimulants for comorbid ADHD.

---

## Attention-Deficit/Hyperactivity Disorder (ADHD)

### Diagnostic Criteria (DSM-5)
- ≥6 inattention symptoms AND/OR ≥6 hyperactivity-impulsivity symptoms (≥5 for individuals ≥17 years)
- Present **before age 12**
- In **≥2 settings** (home, school, work, social)
- Clinically significant functional impairment
- Not better explained by another mental disorder

**Age of onset:** Changed from age 7 (DSM-IV) to age 12 (DSM-5) — acknowledges that inattentive symptoms may not be apparent until academic demands increase.

**Three Presentations:**
- **ADHD-PI** (Predominantly Inattentive): formerly ADD
- **ADHD-PHI** (Predominantly Hyperactive-Impulsive): more common in young children
- **ADHD-C** (Combined): most common overall

### Neurobiology
- Prefrontal cortical underactivation with reduced dopamine and norepinephrine signaling
- Smaller frontal lobes, caudate, cerebellum (vermis) on MRI
- Heritability: ~75–80%; DRD4, DRD5, DAT1, SNAP-25 variants
- **Barkley's model:** Core deficit is response inhibition — impairs all executive functions

### Pharmacotherapy

| Drug Class | Examples | Mechanism |
|------------|----------|-----------|
| Stimulants (first-line) | Methylphenidate (Ritalin, Concerta), Amphetamines (Adderall, Vyvanse) | Block DA/NE reuptake; amphetamines also promote release |
| Non-stimulants | Atomoxetine (Strattera), Viloxazine (Qelbree) | Selective NE reuptake inhibition |
| Alpha-2 agonists | Guanfacine ER (Intuniv), Clonidine ER (Kapvay) | Reduce prefrontal circuit noise |

Response to stimulants: ~70–80%. Non-stimulants take 4–6 weeks for full effect.

### Sex Differences
- Males: more hyperactive-impulsive, externalizing, clinic-referred
- Females: more inattentive, internalizing, underdiagnosed; higher rates of anxiety, depression, and emotional dysregulation

---

## Specific Learning Disorder (SLD)

### Diagnostic Criteria
Persistent difficulties in ≥1 of reading, written expression, or mathematics for ≥6 months despite targeted intervention. Performance substantially below expected level for age. Not explained by intellectual disability, sensory deficits, inadequate instruction, or psychosocial adversity.

### Subtypes

| Subtype | Common Name | Core Deficit | Neural Basis |
|---------|-------------|--------------|--------------|
| SLD in reading | Dyslexia | Phonological processing, decoding, fluency | Left temporoparietal (angular gyrus, Wernicke's area) |
| SLD in math | Dyscalculia | Number sense, calculation, reasoning | Intraparietal sulcus (bilateral) |
| SLD in written expression | Dysgraphia | Spelling, grammar, written organization | Left frontal/parietal + motor systems |

### Phonological Deficit Model of Dyslexia
The core impairment is in phonological awareness — identifying and manipulating the sound units (phonemes) of language. This disrupts grapheme-phoneme correspondence, impairing decoding. The **double-deficit hypothesis** proposes a second independent deficit: slow naming speed (RAN — Rapid Automatized Naming), making combined deficits more severe.

fMRI: underactivation of left temporoparietal circuits; compensatory overactivation of frontal (Broca's) and right-hemisphere regions.

---

## Motor Disorders

### Developmental Coordination Disorder (DCD)
- Substantially below-expected motor skill acquisition — clumsiness, slowness, inaccuracy
- Interferes with daily activities and academic achievement (handwriting, PE)
- Not explained by intellectual disability, neurological conditions, or visual impairment
- Also called **dyspraxia**; prevalence ~5–6%; more common in males; often comorbid with ADHD

### Tic Disorders

| Disorder | Motor Tics | Vocal Tics | Duration |
|----------|-----------|-----------|---------|
| Tourette's Disorder | Multiple | ≥1 | >1 year |
| Persistent Motor Tic | Motor only | None | >1 year |
| Persistent Vocal Tic | None | Vocal only | >1 year |
| Provisional Tic | Motor and/or vocal | Motor and/or vocal | <1 year |

**Coprolalia** (involuntary obscenities): Only ~10-15% of Tourette's — NOT required for diagnosis.

**Neurobiology:** CSTC circuit dysfunction; dopaminergic system dysregulation → basal ganglia disinhibition of unwanted motor programs.

**Treatment:**
- Behavioral: CBIT (Comprehensive Behavioral Intervention for Tics) including Habit Reversal Training — first-line
- Pharmacological: alpha-2 agonists (guanfacine, clonidine); antipsychotics (aripiprazole, haloperidol, fluphenazine) for severe cases

### Stereotypic Movement Disorder
Repetitive, purposeless motor behaviors (rocking, hand-flapping, head-banging) causing impairment or self-injury. Must be distinguished from tics (suppressible, wax/wane) and ASD stereotypies.

---

## Comorbidity and Co-occurrence

Neurodevelopmental disorders frequently co-occur:
- **ADHD + ODD:** ~50%; **ADHD + CD:** ~25%; **ADHD + anxiety:** ~25-50%
- **ASD + ADHD:** 30-50% (DSM-5 now allows co-diagnosis)
- **ADHD + SLD:** ~20-30%
- **Tourette's + ADHD:** ~50%; **Tourette's + OCD:** ~50%

The shared genetic architecture, overlapping neural circuits, and frequent co-occurrence support a dimensional/spectrum view of neurodevelopmental conditions rather than discrete categorical boundaries.`,
  };

  await db.insert(studyGuidesTable).values([studyGuide]);
  console.log(`  ✓ 1 study guide inserted`);

  // ===========================================================================
  // PRACTICE EXAM (first 5 quiz questions)
  // ===========================================================================
  const questionsByTopic: Record<number, number[]> = {};
  for (const q of insertedQuestions) {
    if (!questionsByTopic[q.topicId]) questionsByTopic[q.topicId] = [];
    questionsByTopic[q.topicId].push(q.id);
  }

  const [exam] = await db.insert(practiceExamsTable).values([{
    topicId,
    title: "Neurodevelopmental Disorders — Practice Exam",
    timeLimit: 600,
    passingScore: 70,
  }]).returning();

  const qIds = questionsByTopic[topicId] ?? [];
  const selected = qIds.slice(0, 5);
  if (selected.length > 0) {
    await db.insert(practiceExamQuestionsTable).values(
      selected.map((qId, i) => ({ examId: exam.id, questionId: qId, questionOrder: i + 1 }))
    );
  }

  console.log(`  ✓ 1 practice exam inserted`);
  console.log(`\n✅ Done! Added "Neurodevelopmental Disorders" (id: ${topicId})`);
  console.log(`   50 flashcards | 10 quiz questions | 1 study guide | 1 practice exam`);
}

addNeurodevelopmentalTopic()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
