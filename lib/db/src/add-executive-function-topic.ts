import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  topicsTable, flashcardsTable, quizQuestionsTable,
  studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable,
} from "./schema";

async function seed() {
  console.log("Seeding Executive Function topic...");

  const [topic] = await db.insert(topicsTable).values({
    name: "Executive Function",
    category: "Neuropsychological Assessment",
    description: "Core executive function domains, prefrontal cortex systems, assessment frameworks, clinical presentations, developmental considerations, and rehabilitation approaches.",
  }).returning();

  const topicId = topic.id;
  console.log(`✓ Topic id=${topicId}`);

  const flashcards = [
    { question: "What is executive function?", answer: "A set of higher-order cognitive processes that regulate, plan, and direct other cognitive and behavioral processes toward goal-directed activity. Executive functions depend critically on prefrontal cortex integrity and its connections to subcortical structures.", difficulty: "easy" },
    { question: "What are the three core domains most consistently identified as executive function?", answer: "1) Working memory — holding and manipulating information in mind. 2) Inhibitory control — suppressing prepotent responses. 3) Cognitive flexibility — shifting between tasks, rules, or mental sets.", difficulty: "medium" },
    { question: "What is working memory and why is it considered executive in nature?", answer: "Working memory is the ability to hold information in mind and actively manipulate it — not simply store it. It is executive because it requires active maintenance, updating, and integration rather than passive retention.", difficulty: "medium" },
    { question: "What is inhibitory control and what are its two main components?", answer: "Inhibitory control is the ability to suppress prepotent responses, distractors, or habitual behaviors. Components: 1) Response inhibition — suppressing a motor response once initiated (e.g., stopping). 2) Interference control — filtering distracting information to protect goal-directed processing.", difficulty: "medium" },
    { question: "What is cognitive flexibility (set-shifting)?", answer: "The ability to switch attention between tasks, rules, or mental sets — adapting to changing demands rather than perseverating on a prior strategy. Depends on both shifting attention and inhibiting the previous set.", difficulty: "medium" },
    { question: "What is planning and problem-solving in the executive function framework?", answer: "Planning is the ability to identify and organize steps required to achieve a future goal. Problem-solving involves generating, evaluating, and selecting solutions when no direct path to a goal is available. Both require holding multiple representations in working memory simultaneously.", difficulty: "medium" },
    { question: "What is fluency in neuropsychological assessment?", answer: "The ability to generate responses efficiently within a rule structure — typically measured for verbal categories (semantic fluency) or phonemic constraints (letter fluency). Reflects both initiation and self-monitoring of output against rules.", difficulty: "easy" },
    { question: "Why do letter/phonemic fluency tasks have greater executive demand than semantic fluency?", answer: "Phonemic fluency requires inhibiting more common word associations and imposing a novel rule (initial letter), demanding greater top-down control. Semantic fluency draws more heavily on semantic memory organization with less executive constraint.", difficulty: "hard" },
    { question: "What is the prefrontal cortex (PFC) and what are its three main functional regions?", answer: "The PFC is the anterior portion of the frontal lobe critical for executive control. Three regions: 1) Dorsolateral PFC — working memory, planning, cognitive flexibility. 2) Ventromedial/orbitofrontal PFC — emotional regulation, reward-based decision-making. 3) Anterior cingulate cortex (ACC) — conflict monitoring, error detection, effortful control.", difficulty: "hard" },
    { question: "What is the dorsolateral PFC syndrome?", answer: "Damage to the dorsolateral PFC produces difficulties with working memory, planning, abstract reasoning, cognitive flexibility, fluency, and sustained attention. The classic 'dysexecutive syndrome' — impaired goal-directed behavior with relatively intact personality and emotion.", difficulty: "hard" },
    { question: "What is the orbitofrontal/ventromedial PFC syndrome?", answer: "Damage produces impaired decision-making based on reward/punishment feedback, disinhibition, poor social judgment, impulsivity, and emotional dysregulation — despite preserved performance on many traditional cognitive tests. Personality and social behavior are prominently affected.", difficulty: "hard" },
    { question: "What is the anterior cingulate cortex (ACC) syndrome?", answer: "Damage to the ACC produces akinesia (reduced initiation of movement and speech), abulia (loss of will or motivation), and profound apathy. Severe bilateral lesions can produce akinetic mutism — absence of spontaneous movement and speech despite preserved arousal.", difficulty: "hard" },
    { question: "What are frontal-subcortical circuits and why do they matter for executive function?", answer: "Loops connecting the prefrontal cortex to basal ganglia, thalamus, and back. At least five distinct circuits identified (motor, oculomotor, dorsolateral prefrontal, lateral orbitofrontal, and anterior cingulate). Disruption anywhere along a circuit produces deficits similar to direct PFC damage — important for understanding subcortical dementias and movement disorders.", difficulty: "hard" },
    { question: "What is perseveration and what does it indicate?", answer: "Continuing a response pattern despite it being no longer correct or appropriate — failure to shift set. Perseveration is a cardinal sign of frontal/executive dysfunction, particularly dorsolateral PFC and associated circuits.", difficulty: "medium" },
    { question: "What is the difference between perseveration and stereotypy?", answer: "Perseveration: repeating a previously correct response in a new context where it is no longer appropriate. Stereotypy: repetitive, invariant behaviors not tied to a prior rule — more associated with severe dementia or stereotyped movement disorders.", difficulty: "hard" },
    { question: "What is utilization behavior?", answer: "A form of disinhibition (orbitofrontal/frontomedial damage) in which the patient automatically uses objects placed in front of them even when not instructed to — driven by environmental cues without goal-directed control.", difficulty: "hard" },
    { question: "What is the difference between initiation and termination deficits in executive function?", answer: "Initiation deficits: difficulty starting goal-directed behavior (associated with medial frontal/ACC damage — seen in abulia, akinesia). Termination deficits: difficulty stopping a response once started (associated with orbital frontal/inhibitory control deficits).", difficulty: "hard" },
    { question: "What is prospective memory and how does it relate to executive function?", answer: "Prospective memory is remembering to perform an intended action at a future time or event. It is executive in nature because it requires maintaining an intention, monitoring for the appropriate cue, and switching from ongoing activity to execute the intention.", difficulty: "medium" },
    { question: "What is metacognition and its relationship to executive function?", answer: "Metacognition is the ability to monitor, evaluate, and regulate one's own cognitive processes and outputs — 'thinking about thinking.' It is a high-level executive skill involving both monitoring (detecting errors, gauging difficulty) and control (adjusting strategy, slowing down).", difficulty: "medium" },
    { question: "What is the unity-diversity framework of executive function?", answer: "A neuropsychological framework (Miyake et al., 2000) proposing that the three core EF components (updating/working memory, shifting, inhibition) are both separable (fractionable — damaged independently) and interrelated (correlate with each other and share a common EF factor).", difficulty: "hard" },
    { question: "What is the hot vs. cool executive function distinction?", answer: "Cool EF: purely cognitive, abstract problem-solving under emotionally neutral conditions (dorsolateral PFC). Hot EF: executive processes in affectively charged, motivationally significant contexts (orbitofrontal/ventromedial PFC). Real-world EF failure often involves hot EF even when cool EF tasks are passed.", difficulty: "hard" },
    { question: "Why do some individuals with documented frontal lesions perform normally on standardized EF tests?", answer: "The 'frontal lobe paradox' — standardized tests provide structure, cues, and a clear start/stop, which scaffolds the very processes that are impaired. Real-world executive failure often manifests only in unstructured environments requiring self-generated goals.", difficulty: "hard" },
    { question: "What is abstract reasoning and which EF components does it require?", answer: "Abstract reasoning is the ability to identify underlying rules, principles, or conceptual relationships that are not perceptually obvious. Requires working memory (holding multiple representations), cognitive flexibility (trying alternative conceptual frames), and inhibitory control (suppressing concrete, salient features).", difficulty: "medium" },
    { question: "What is response inhibition and what are the two phases of a stopping process?", answer: "Response inhibition is the ability to suppress a prepotent motor response. Two phases: 1) Triggering the stop process (detecting the signal to stop). 2) The stop process itself (inhibiting the ongoing motor program — modeled by the Stop-Signal Task).", difficulty: "hard" },
    { question: "What are the main categories of EF assessment measures used in neuropsychological evaluation?", answer: "1) Problem-solving/concept formation (card sorting tasks, conceptual shifting). 2) Verbal and design fluency (letter, semantic, figural). 3) Working memory span (forward/backward spans, sequencing). 4) Response inhibition (go/no-go paradigms, interference tasks like color-word). 5) Planning and sequencing (maze, tower tasks). 6) Trail-making type tasks (sequencing, set-shifting).", difficulty: "medium" },
    { question: "Why are trail-making tasks considered to have an executive component?", answer: "Part A tests visual scanning and processing speed (not primarily executive). Part B requires alternating between two sequences — a set-shifting task. The difference between Parts A and B indexes executive set-shifting while controlling for motor and scanning speed.", difficulty: "medium" },
    { question: "What are common confounds when interpreting EF test performance?", answer: "Processing speed (slow response affects timed tasks), language ability (verbal fluency confounded by vocabulary), motor function (manual tasks confounded by motor speed/coordination), anxiety/depression (impairs working memory and sustained effort), cultural and educational factors (affect test familiarity and normative comparisons).", difficulty: "hard" },
    { question: "How does depression affect executive function test performance?", answer: "Severe depression produces working memory impairment, reduced processing speed, and diminished initiation (similar to medial frontal syndrome), making the EF profile potentially overlap with executive dysfunction. Motivational effects can also reduce performance on effort-demanding tasks.", difficulty: "medium" },
    { question: "What is ADHD and how does it relate to executive dysfunction?", answer: "ADHD is a neurodevelopmental disorder characterized by executive dysfunction — primarily in inhibitory control, working memory, and sustained attention. Barkley's model places behavioral inhibition (response inhibition) as the core deficit that cascades into impaired working memory, emotional regulation, and goal-directed persistence.", difficulty: "medium" },
    { question: "How does age affect executive function across the lifespan?", answer: "EF develops gradually through childhood and adolescence, reaching maturity in the mid-20s (parallel to prefrontal myelination). EF is among the earliest cognitive domains to decline in normal aging and is disproportionately affected in most dementing conditions, particularly frontotemporal dementia and Parkinson's disease.", difficulty: "medium" },
    { question: "What is frontotemporal dementia (FTD) and what executive features characterize it?", answer: "FTD is a neurodegenerative syndrome affecting frontal and temporal lobes. The behavioral variant (bvFTD) presents with prominent early executive dysfunction, disinhibition, apathy, compulsive/stereotyped behaviors, social-emotional dysregulation, and loss of empathy — often with relatively preserved memory and visuospatial function early on.", difficulty: "hard" },
    { question: "What role does the basal ganglia play in executive function?", answer: "Basal ganglia are involved in the selection and initiation of goal-directed behaviors through frontal-subcortical circuits — filtering competing behavioral programs and selecting the most appropriate response. Dysfunction produces both motor and cognitive/executive deficits (e.g., in Parkinson's disease, Huntington's disease).", difficulty: "hard" },
    { question: "What is a Tower task (e.g., Tower of London/Hanoi) and what does it assess?", answer: "Tower tasks require moving discs or balls between pegs to reach a goal configuration in a minimum number of moves. They assess planning (thinking ahead, forming a mental representation of future states), problem-solving, and working memory. Performance requires inhibiting the immediate move in favor of a strategically optimal sequence.", difficulty: "medium" },
    { question: "What are ecological validity concerns in EF assessment?", answer: "Traditional EF tests have limited ecological validity — structured test environments scaffold the very processes that are impaired. Real-world EF failures (job loss, financial mismanagement, medication non-adherence) often occur despite normal test performance. Behavioral inventories and naturalistic performance measures supplement objective tests.", difficulty: "hard" },
    { question: "What is a behavioral/informant-based EF rating scale and why is it used?", answer: "Rating scales completed by the patient or a reliable informant capture everyday EF behaviors (initiation, organization, monitoring, flexibility, working memory) in naturalistic settings. They address the ecological validity limitation of structured testing and are especially important when tests are normal but functional impairment is reported.", difficulty: "medium" },
    { question: "What is self-awareness deficit (anosognosia) and how does it relate to frontal dysfunction?", answer: "Anosognosia is impaired awareness of one's own deficits. Frontal/executive dysfunction often impairs self-monitoring capacity — patients may fail tasks but not recognize their own errors or the extent of their impairment. This has direct implications for treatment adherence and safety.", difficulty: "hard" },
    { question: "What rehabilitation approaches target executive dysfunction?", answer: "Compensatory strategies: external aids (calendars, alarms, checklists), environmental restructuring. Restitution approaches: computerized working memory training (limited generalization). Metacognitive strategy training (Goal Management Training, Problem-Solving Therapy): teaching patients to self-monitor, plan, and check. Errorless learning when initiation is the primary barrier.", difficulty: "hard" },
    { question: "What is Goal Management Training (GMT)?", answer: "A structured rehabilitation program targeting executive dysfunction — teaches patients to: STOP and define the goal, LIST the steps needed, LEARN the steps, DO the plan, CHECK results. GMT improves real-world task performance and has replicated evidence across multiple clinical populations.", difficulty: "hard" },
    { question: "What is the stop-signal paradigm and what does it measure?", answer: "A laboratory task where participants respond to a go-signal but occasionally must inhibit their response when a stop-signal follows. The stop-signal reaction time (SSRT) indexes the speed of the internal inhibition process. A longer SSRT indicates less efficient response inhibition — elevated in ADHD, substance use disorders, and frontal lesions.", difficulty: "hard" },
    { question: "What does performance on dual-task paradigms reveal about executive function?", answer: "Dual-task performance requires dividing or coordinating attention between two simultaneous tasks — a demanding executive task. Individuals with executive dysfunction show disproportionate dual-task costs compared to controls, even when single-task performance is adequate.", difficulty: "hard" },
  ];

  const inserted = await db.insert(flashcardsTable).values(flashcards.map(f => ({ ...f, topicId }))).returning();
  console.log(`✓ ${inserted.length} flashcards`);

  const regular = [
    { question: "Which three core components are most consistently identified as executive function?", optionA: "Attention, memory, and language", optionB: "Working memory, inhibitory control, and cognitive flexibility", optionC: "Processing speed, reasoning, and planning", optionD: "Fluency, abstract reasoning, and decision-making", correctAnswer: "B", explanation: "Miyake et al.'s unity-diversity framework identifies updating/working memory, shifting/cognitive flexibility, and inhibition/inhibitory control as the three most reliably separable core EF components.", examOnly: false },
    { question: "What is the 'frontal lobe paradox'?", optionA: "Frontal lesions cause motor and cognitive deficits simultaneously", optionB: "Individuals with documented frontal damage sometimes perform normally on standardized EF tests despite real-world executive failure", optionC: "The frontal lobe has both excitatory and inhibitory functions", optionD: "EF tests require frontal integrity but are scored by subcortical processes", correctAnswer: "B", explanation: "Structured tests provide the scaffolding (cues, time limits, clear rules) that patients with frontal lesions need. Real-world failures emerge in open-ended, self-regulated contexts that tests don't replicate.", examOnly: false },
    { question: "What does the Part B of a trail-making type task specifically assess compared to Part A?", optionA: "Visual acuity and color discrimination", optionB: "Set-shifting (cognitive flexibility) while controlling for motor speed and visual scanning", optionC: "Sustained attention over a long period", optionD: "Working memory for alphanumeric sequences", correctAnswer: "B", explanation: "Part A (number sequencing alone) indexes processing speed and visual scanning. Part B (alternating between numbers and letters) adds the set-shifting demand. The B-A difference score isolates the executive component.", examOnly: false },
    { question: "Damage to the orbitofrontal/ventromedial PFC most characteristically produces:", optionA: "Impaired working memory and planning with preserved personality", optionB: "Akinetic mutism with loss of spontaneous speech", optionC: "Disinhibition, poor social judgment, and impaired reward-based decision-making with preserved traditional cognitive test performance", optionD: "Impaired verbal fluency with intact inhibitory control", correctAnswer: "C", explanation: "The orbital/ventromedial PFC syndrome involves impaired hot executive function — emotional regulation, social behavior, and reward learning — while performance on structured cognitive tests (cool EF) can appear normal.", examOnly: false },
    { question: "Why does phonemic fluency (letter fluency) have greater executive demand than semantic fluency (category fluency)?", optionA: "Phonemic fluency requires more words per trial", optionB: "Phonemic fluency draws on a less organized lexical structure, requiring greater top-down inhibitory control of dominant semantic associations", optionC: "Semantic fluency depends on executive planning while phonemic fluency is automatic", optionD: "There is no difference in executive demand between the two", correctAnswer: "B", explanation: "Phonemic fluency imposes a novel constraint (initial letter) and requires inhibiting dominant category associations. Semantic fluency leverages well-organized semantic memory networks with less top-down constraint.", examOnly: false },
    { question: "What behavioral feature most specifically indicates anterior cingulate cortex (ACC) dysfunction?", optionA: "Perseveration on concept formation tasks", optionB: "Impaired reward-based decision-making", optionC: "Profound apathy, reduced initiation of movement and speech (abulia/akinesia)", optionD: "Impaired working memory with normal inhibitory control", correctAnswer: "C", explanation: "The ACC mediates effortful engagement and conflict monitoring. Bilateral ACC damage produces akinesia and abulia — loss of the drive to initiate action and speech, while basic motor and language capacity remain intact.", examOnly: false },
    { question: "What is the clinical significance of the hot versus cool executive function distinction?", optionA: "Hot EF refers to tasks performed quickly; cool EF refers to slow, deliberate reasoning", optionB: "Hot EF involves decision-making in emotional/motivational contexts; cool EF involves abstract reasoning under neutral conditions — patients may fail one while passing the other", optionC: "Hot and cool EF are synonymous terms for the same construct", optionD: "Hot EF is tested with verbal tasks; cool EF with visuospatial tasks", correctAnswer: "B", explanation: "The hot/cool distinction has clinical importance because orbitofrontal damage impairs hot EF (real-world judgment, social behavior, impulse control) while sparing cool EF. Traditional tests assess cool EF and may entirely miss hot EF deficits.", examOnly: false },
    { question: "Why are informant-based behavioral rating scales important for EF assessment?", optionA: "They replace objective EF testing in clinical settings", optionB: "They capture real-world executive behaviors in naturalistic settings, addressing the ecological validity limitations of structured tests", optionC: "They are more reliable than performance-based measures", optionD: "They assess hot EF only — not cool EF", correctAnswer: "B", explanation: "Structured tests scaffold the very processes that are impaired. Informant ratings capture everyday failures (planning meals, managing finances, initiating activities) that tests can miss — they are complementary, not redundant.", examOnly: false },
    { question: "Which neurodevelopmental disorder is most associated with executive dysfunction, specifically in inhibitory control and working memory?", optionA: "Autism spectrum disorder", optionB: "Intellectual disability", optionC: "ADHD", optionD: "Dyslexia", correctAnswer: "C", explanation: "Barkley's model of ADHD places behavioral inhibition (response inhibition) at the core, cascading into impaired working memory, self-regulation, emotional control, and goal-directed persistence — a broad executive deficit profile.", examOnly: false },
    { question: "What is anosognosia and how does it relate to frontal/executive dysfunction?", optionA: "Inability to recognize faces; related to temporal lobe damage", optionB: "Impaired awareness of one's own cognitive deficits; frontal dysfunction impairs the self-monitoring required for accurate self-appraisal", optionC: "Loss of voluntary motor control; related to premotor cortex damage", optionD: "Impaired language production; related to Broca's area damage", correctAnswer: "B", explanation: "Self-awareness depends on executive self-monitoring. Frontal dysfunction can disrupt the capacity to accurately evaluate one's own performance, leading to underestimation of deficits — with direct implications for rehabilitation engagement and safety.", examOnly: false },
  ];

  const examOnly = [
    { question: "The unity-diversity framework of executive function proposes that:", optionA: "All EF components are a single unified construct with no independent subprocesses", optionB: "EF components are entirely independent and unrelated", optionC: "EF components are both separable (fractionable by brain damage) and interrelated (sharing a common factor)", optionD: "Executive function cannot be reliably measured", correctAnswer: "C", explanation: "Miyake et al. demonstrated that updating, shifting, and inhibition are separable (lesions can independently impair each) yet share variance consistent with a common EF factor — unity-diversity.", examOnly: true },
    { question: "What is utilization behavior and which PFC region is most implicated?", optionA: "Compulsive use of environmental objects despite not being instructed to; orbitofrontal/frontomedial PFC disinhibition", optionB: "Repetitive verbal responses; dorsolateral PFC perseveration", optionC: "Automatic tool use in skilled tasks; premotor cortex", optionD: "Impaired object naming when objects are present; left temporal lobe", correctAnswer: "A", explanation: "Utilization behavior reflects loss of top-down inhibitory control over environmental cue-driven behavior — hallmark of orbitofrontal/medial frontal disinhibition. The patient reaches for and uses objects because the environment 'affords' the action without goal-directed suppression.", examOnly: true },
    { question: "A patient performs normally on a card-sorting task but has repeated job losses due to poor planning and inability to manage complex projects. This is best explained by:", optionA: "Test-retest unreliability of card-sorting tasks", optionB: "The frontal lobe paradox — structured tests scaffold impaired EF processes that fail in unstructured real-world demands", optionC: "The patient likely has a personality disorder rather than EF deficit", optionD: "Card-sorting tasks measure different constructs than planning", correctAnswer: "B", explanation: "Structured EF tests provide the temporal structure, clear rules, and external cues that support goal-directed behavior. Real-world failure despite normal testing is the classic frontal lobe paradox — the test environment compensates for the very deficits present.", examOnly: true },
    { question: "Frontal-subcortical circuit disruption can produce executive deficits through damage to:", optionA: "Only the prefrontal cortex itself", optionB: "Any structure along the circuit — including basal ganglia and thalamus — producing deficits similar to direct PFC damage", optionC: "Only the thalamus", optionD: "Only the basal ganglia striatal regions", correctAnswer: "B", explanation: "Because frontal-subcortical circuits form complete loops, damage anywhere along the circuit (PFC, caudate, globus pallidus, thalamus) disrupts the circuit's function. This explains executive deficits in Parkinson's disease, Huntington's disease, and vascular lesions in white matter.", examOnly: true },
    { question: "What specifically does the stop-signal reaction time (SSRT) measure?", optionA: "The speed of visually detecting a stop signal", optionB: "The speed of the internal inhibition process that cancels an already-initiated motor response", optionC: "Working memory capacity indexed by response delays", optionD: "Sustained attention to stop-signal trials over time", correctAnswer: "B", explanation: "SSRT is an estimate of the speed of the covert stop process — how quickly the brain can cancel an action already in progress. A longer SSRT means less efficient inhibition, not slower perception or sustained attention.", examOnly: true },
    { question: "Goal Management Training (GMT) is a rehabilitation approach that specifically targets:", optionA: "Procedural motor learning in patients with basal ganglia damage", optionB: "Metacognitive self-monitoring and goal-directed planning through structured stop-check-plan-do-review cycles", optionC: "Implicit memory consolidation through spaced repetition", optionD: "Errorless learning of daily routines through environmental cueing only", correctAnswer: "B", explanation: "GMT teaches patients to explicitly manage their own goal-directed behavior through metacognitive stages: stopping ongoing activity, defining the current goal, listing steps, executing the plan, and checking outcomes — targeting the self-regulatory failure at the core of executive dysfunction.", examOnly: true },
    { question: "What distinguishes the dorsolateral PFC syndrome from the orbitofrontal PFC syndrome?", optionA: "Dorsolateral damage causes personality change; orbitofrontal damage causes cognitive impairment", optionB: "Dorsolateral damage impairs working memory, planning, and cool EF with relatively preserved personality; orbitofrontal damage impairs hot EF, social judgment, and disinhibition with relatively preserved traditional cognitive testing", optionC: "Orbitofrontal damage impairs memory; dorsolateral damage impairs language", optionD: "They produce identical deficits — PFC is functionally homogeneous", correctAnswer: "B", explanation: "The DLPFC syndrome impairs structured, cognitive executive tasks. The orbital/ventromedial PFC syndrome impairs emotional regulation, decision-making under uncertainty, and social behavior — often appearing as personality change rather than cognitive impairment.", examOnly: true },
    { question: "Why do dual-task paradigms have particular sensitivity to executive dysfunction?", optionA: "They are longer than single tasks, revealing fatigue effects", optionB: "Coordinating two tasks simultaneously taxes the central executive capacity of working memory, which is impaired with PFC dysfunction", optionC: "They include inhibitory control demands not present in single tasks", optionD: "They are administered without time limits, increasing validity", correctAnswer: "B", explanation: "Dual-task performance requires active coordination of two concurrent processes — the 'central executive' component of working memory. Individuals with PFC/EF dysfunction show disproportionate dual-task interference even when each individual task is managed adequately.", examOnly: true },
    { question: "The behavioral variant of frontotemporal dementia (bvFTD) is distinguished from other dementias by:", optionA: "Early prominent memory impairment followed by behavioral change", optionB: "Early executive dysfunction, personality change, disinhibition, apathy, and social-emotional dysregulation — with relative sparing of memory and visuospatial function initially", optionC: "Early visuospatial and perceptual deficits with frontal sparing", optionD: "A purely motor presentation with no cognitive features", correctAnswer: "B", explanation: "bvFTD presents with prominent frontal-executive and behavioral features as the earliest manifestation — distinguishing it from Alzheimer's disease (early memory) and posterior cortical atrophy (early visuospatial). Memory and visuospatial functions are often relatively preserved early.", examOnly: true },
    { question: "What is the relationship between response inhibition failure and disinhibited behavior in orbitofrontal damage?", optionA: "They are unrelated — disinhibition is a social concept, not neurological", optionB: "Impaired inhibitory control over prepotent behavioral responses to environmental and emotional stimuli produces socially inappropriate, impulsive actions", optionC: "Disinhibition reflects dorsolateral PFC damage, not orbitofrontal", optionD: "Response inhibition failure only affects motor responses, not social behavior", correctAnswer: "B", explanation: "Orbitofrontal damage impairs the regulation of behavioral responses to emotionally salient stimuli. Without adequate inhibitory control, prepotent responses to reward, social triggers, and environmental cues drive behavior — producing the disinhibited, impulsive profile of the syndrome.", examOnly: true },
    { question: "What is prospective memory and why does it depend on executive function?", optionA: "Memory for past events — depends on hippocampal function, not PFC", optionB: "Memory for intended future actions — requires maintaining an intention, monitoring for the appropriate trigger, and switching from ongoing activity to execute the plan", optionC: "Working memory span for digit sequences", optionD: "The ability to remember the examiner's instructions during testing", correctAnswer: "B", explanation: "Prospective memory ('remember to do X when Y happens') is deeply executive: it requires holding a delayed intention in mind, monitoring the environment for the trigger, and flexibly interrupting ongoing activity — all PFC-dependent processes.", examOnly: true },
    { question: "Abstract reasoning tasks such as concept formation assess which combination of executive functions?", optionA: "Processing speed and motor coordination", optionB: "Working memory (holding multiple representations), cognitive flexibility (trying alternative conceptual frames), and inhibitory control (suppressing salient but incorrect features)", optionC: "Language fluency and semantic memory only", optionD: "Visual pattern recognition — not primarily executive", correctAnswer: "B", explanation: "Concept formation requires holding candidate rules in working memory, flexibly shifting hypotheses when a rule is disconfirmed, and inhibiting perseverative attachment to an incorrect rule — a combined executive load.", examOnly: true },
  ];

  const allQs = [...regular, ...examOnly].map(q => ({ ...q, topicId }));
  const qs = await db.insert(quizQuestionsTable).values(allQs).returning();
  console.log(`✓ ${qs.length} questions (${regular.length} regular + ${examOnly.length} exam-only)`);

  const sgContent = `# Executive Function — Study Guide

## 1. What Is Executive Function?

Executive function (EF) refers to higher-order cognitive processes that regulate, plan, and direct other cognitive and behavioral processes toward goal-directed activity. EF is critically dependent on the **prefrontal cortex (PFC)** and its extensive connections to subcortical structures.

---

## 2. Core Components

| Component | Definition | Key Demands |
|---|---|---|
| **Working Memory** | Hold and manipulate information in mind | Active maintenance, updating, integration |
| **Inhibitory Control** | Suppress prepotent responses and distractors | Response inhibition + interference control |
| **Cognitive Flexibility** | Shift between tasks, rules, or mental sets | Set-shifting, disengagement from prior set |
| **Planning** | Identify and organize steps toward a future goal | Forward thinking, subgoal sequencing |
| **Fluency** | Generate responses efficiently under rule constraints | Initiation, self-monitoring |
| **Abstract Reasoning** | Identify underlying rules not perceptually obvious | Working memory + flexibility + inhibition |

**Unity-Diversity Framework (Miyake et al., 2000):** The three core components (working memory, shifting, inhibition) are both **separable** (fractionable by lesion) and **interrelated** (share a common EF factor).

---

## 3. Neuroanatomy

### Three Key PFC Regions

| Region | Primary Functions | Dysfunction Syndrome |
|---|---|---|
| **Dorsolateral PFC** | Working memory, planning, abstract reasoning, fluency, cognitive flexibility | Impaired goal-directed cognition, perseveration — personality relatively preserved |
| **Orbitofrontal / Ventromedial PFC** | Emotional regulation, reward-based decision-making, social judgment | Disinhibition, impulsivity, poor social judgment, impaired hot EF — may pass traditional cognitive tests |
| **Anterior Cingulate Cortex (ACC)** | Conflict monitoring, error detection, effortful initiation | Abulia, akinesia, apathy; bilateral = akinetic mutism |

### Frontal-Subcortical Circuits
Damage **anywhere along** a circuit (PFC → striatum → globus pallidus → thalamus → PFC) produces deficits similar to direct PFC damage. Explains executive deficits in Parkinson's disease, Huntington's disease, and subcortical vascular disease.

---

## 4. Hot vs. Cool Executive Function

| | Cool EF | Hot EF |
|---|---|---|
| **Context** | Emotionally neutral, abstract | Emotionally/motivationally significant |
| **Neural basis** | Dorsolateral PFC | Orbitofrontal / Ventromedial PFC |
| **Example deficits** | Poor planning, perseveration | Impulsivity, poor social judgment, risk-taking |
| **Test sensitivity** | Captured by standard EF tests | Often missed by standard EF tests |

---

## 5. Clinical Presentations

### Frontal Lobe Paradox
Individuals with documented frontal lesions may perform **normally on structured EF tests** yet show profound real-world executive failure. Structured tests scaffold the very processes that are impaired.

### Classic Syndromes

| Syndrome | Features |
|---|---|
| **Dysexecutive (Dorsolateral)** | Poor planning, cognitive inflexibility, perseveration, reduced fluency — intact personality |
| **Orbitofrontal** | Disinhibition, impulsivity, social inappropriateness, utilization behavior, poor decision-making |
| **Medial Frontal / ACC** | Apathy, abulia, akinesia; bilateral = akinetic mutism |

### Key Clinical Signs

- **Perseveration:** Continuing a previously correct response despite feedback that it is wrong
- **Utilization behavior:** Automatically using objects placed in view without being instructed to
- **Anosognosia:** Impaired awareness of one's own deficits (impaired self-monitoring)

---

## 6. Assessment Approaches

### Categories of EF Measures

| Category | What It Assesses |
|---|---|
| Concept formation / card sorting | Cognitive flexibility, rule learning, perseveration |
| Verbal and design fluency | Initiation, self-monitoring, lexical search |
| Working memory spans | Forward/backward span, sequencing |
| Trail-making (Part B) | Set-shifting (B-A difference isolates EF from speed) |
| Go/no-go and stop-signal tasks | Response inhibition, SSRT |
| Tower tasks | Planning, problem-solving, forward thinking |
| Dual-task paradigms | Central executive capacity, divided attention |
| Behavioral rating scales | Everyday EF behaviors; informant or self-report |

### Common Confounds
Processing speed, language ability, motor function, anxiety/depression, education, and cultural familiarity all affect EF test scores and require careful interpretation.

---

## 7. Developmental and Aging Considerations

- EF develops through childhood/adolescence, reaching maturity in the **mid-20s** (parallel to prefrontal myelination)
- EF is among the **earliest to decline** in normal aging
- **ADHD:** Behavioral inhibition deficit (Barkley's model) cascades into working memory and EF impairments
- **bvFTD:** Early prominent executive dysfunction, disinhibition, and personality change — with relatively preserved memory early

---

## 8. Rehabilitation

| Approach | Description |
|---|---|
| **Compensatory aids** | Calendars, alarms, checklists — environmental scaffolding |
| **Goal Management Training (GMT)** | Stop → Define goal → List steps → Do → Check; metacognitive self-regulation |
| **Environmental restructuring** | Reduce distractors, simplify decision environments |
| **Errorless learning** | When initiation is impaired — structured practice that eliminates trial-and-error |`;

  const [sg] = await db.insert(studyGuidesTable).values({ topicId, title: "Executive Function — Study Guide", content: sgContent }).returning();
  console.log(`✓ Study guide id=${sg.id}`);

  const [exam] = await db.insert(practiceExamsTable).values({ topicId, title: "Executive Function Practice Exam", timeLimit: 90, passingScore: 70 }).returning();
  const allQsFromDb = await db.select({ id: quizQuestionsTable.id }).from(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, topicId));
  await db.insert(practiceExamQuestionsTable).values(allQsFromDb.map((q, i) => ({ examId: exam.id, questionId: q.id, questionOrder: i + 1 })));
  console.log(`✓ Practice exam linked to ${allQsFromDb.length} questions`);

  console.log(`\n✅ Executive Function (topic ${topicId}) fully seeded!`);
}

seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
