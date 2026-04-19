import { db } from "./index";
import { topicsTable, studyGuidesTable } from "./schema";

const TOPIC = {
  name: "Brain Networks",
  category: "Neuroscience",
  description:
    "Large-scale functional brain networks — default mode, central executive, salience, dorsal and ventral attention, sensorimotor, visual, auditory, language, limbic/affective, reward, cerebellar and subcortical loops. Covers network neuroscience foundations, the triple network model, network dynamics, and how disorders of network connectivity underlie major neurological and psychiatric disease.",
};

const TITLE = "Brain Networks — Study Guide";

const CONTENT = `# Brain Networks

For more than a century, neuroscience was dominated by **localization** — the idea that specific mental functions are carried out by specific regions. Broca's area produced speech; the primary visual cortex produced sight; the hippocampus produced memory. That framework, built on careful lesion studies from the nineteenth century onward, remains foundational. But it is incomplete.

A central insight of twenty-first-century neuroscience is that the brain is organized not only into regions but into **networks** — sets of anatomically distinct areas whose coordinated activity supports particular functions. A single cognitive task such as reading, planning a trip, or listening to a friend recruits many regions distributed across both hemispheres, coupled by white-matter tracts and dynamic functional coupling. The orchestrated activity of these distributed sets is what the brain actually does.

This shift was driven by advances in neuroimaging — functional MRI, diffusion MRI, and magnetoencephalography — that let us observe activity and connectivity in living people. A pivotal discovery was that the brain is organized into a small number of recurrent, reproducible networks visible **even at rest**, when no task is being performed. These intrinsic connectivity networks map closely onto the task-related networks engaged during active cognition.

## Foundations of Network Neuroscience

### What Is a Large-Scale Brain Network?

A large-scale brain network is a set of widely distributed regions whose activity is correlated over time and which share structural connections supporting that coordination. Networks are defined in three complementary ways:

- **Structural connectivity** — the physical white-matter pathways linking regions, mapped with diffusion MRI and tractography.
- **Functional connectivity** — the statistical correlation of activity between regions over time, measured most often with resting-state fMRI. Regions whose BOLD signals rise and fall together over minutes of rest are said to be functionally connected.
- **Effective connectivity** — the causal influence one region exerts on another, inferred through dynamic causal modeling, Granger causality, or stimulation-based methods.

The networks described below are defined primarily by resting-state functional connectivity, with structural connectivity providing the anatomical scaffold. The same networks observed at rest are engaged — with task-specific modulations — during active cognition, emotion, and perception.

### How Networks Are Measured

Resting-state fMRI captures low-frequency BOLD fluctuations (below 0.1 Hz) while the participant lies still. Independent component analysis and seed-based correlation are the standard analytic methods. Task-based fMRI identifies networks engaged by specific demands such as working memory or language. Diffusion MRI maps white-matter tracts. EEG and MEG capture network dynamics with millisecond resolution. **Graph theory** treats the brain as a network of nodes and edges, allowing quantitative description of hubs, clusters, and global properties.

### Hubs, Modularity, and Integration

A few concepts from network science are essential.

**Nodes and edges.** Nodes are brain regions; edges are connections between them, structural or functional.

**Hubs.** Highly connected regions that integrate information across many networks. The posterior cingulate, precuneus, anterior insula, and dorsolateral prefrontal cortex are classic hubs. Hubs are metabolically expensive and disproportionately affected in many diseases.

**Modularity.** The tendency of the brain to organize into relatively segregated subnetworks (modules) that handle specialized functions.

**Integration vs. segregation.** Healthy cognition depends on a balance — segregation allows specialized processing, while integration allows flexible combination of information across modules. Too much of either is associated with disease.

**Small-world organization.** The brain is neither fully clustered nor fully random; it has dense local connections plus a few long-range shortcuts that enable efficient global communication while minimizing wiring cost.

Many neurological and psychiatric disorders are now understood less as damage to specific regions and more as disruptions of network organization — altered hub function, reduced modularity, or imbalanced integration. This reframing has profoundly changed how we think about diseases such as Alzheimer's, schizophrenia, and depression.

## The Default Mode Network (DMN)

The default mode network is the most studied network in the brain. It was discovered almost accidentally in the 1990s, when researchers noticed that a consistent set of regions became *less* active during externally focused tasks compared with rest. Far from being "off," these regions were doing their most active work when the mind was not engaged with the outside world. The DMN is the network of inward-focused thought.

**Key nodes:** medial prefrontal cortex, posterior cingulate cortex and precuneus, inferior parietal lobule and angular gyrus, lateral temporal cortex, and medial temporal lobe (hippocampus and parahippocampal gyrus).

The DMN supports **self-referential thought** — thinking about yourself, your traits, and your preferences — together with **autobiographical memory**, **mental simulation** of future and hypothetical events ("mental time travel"), **theory of mind**, **mind-wandering** (which occupies roughly 30 to 50 percent of waking life), and **moral and social cognition**.

The DMN emerges gradually through childhood and adolescence, with adult-like organization reached in the early twenties. It is largely bilaterally symmetric, though the right hemisphere is somewhat more engaged during nonverbal self-referential tasks and the left during verbally mediated ones.

The DMN is affected in a remarkably wide range of conditions. In Alzheimer's disease it shows early and severe disruption, with the posterior cingulate and precuneus among the first regions to show metabolic decline — mirroring the distribution of amyloid plaques. In depression, DMN hyperconnectivity is linked to rumination. In schizophrenia, DMN abnormalities correlate with altered self-awareness. In autism, atypical DMN organization relates to social cognitive differences.

## The Central Executive (Frontoparietal) Network

The central executive network — also called the frontoparietal, cognitive control, or executive control network — is the brain's goal-directed cognition system. It is engaged whenever we hold information in mind, make decisions, solve problems, or flexibly adapt to changing circumstances. It operates in **anticorrelated rhythm with the DMN**: when one is active, the other tends to quiet down.

**Key nodes:** dorsolateral prefrontal cortex, posterior parietal cortex (especially around the intraparietal sulcus), dorsal anterior cingulate cortex, and lateral prefrontal areas.

Functions include **working memory** (holding and manipulating information over short periods), **cognitive control** (suppressing irrelevant information and maintaining focus), **planning and problem solving**, **attention switching**, and **decision making** under uncertainty.

Although bilateral, the left frontoparietal network is somewhat more specialized for language-mediated cognition and serial task switching, while the right is more engaged during visuospatial reasoning and sustained attention.

Executive network dysfunction underlies the core cognitive symptoms of ADHD, schizophrenia, major depression, and the frontal variants of dementia. Stroke or tumor involving the dorsolateral prefrontal cortex produces the classic dysexecutive syndrome — poor planning, perseveration, reduced working memory, and difficulty adapting to new task demands. Aging selectively affects this network, contributing to declines in processing speed and multitasking.

## The Salience Network

The salience network detects important events — whether external (a sudden loud noise) or internal (an intense emotion, a pain signal) — and coordinates the brain's response to them. It decides what deserves attention and which other network should take over. As such, it acts as a **switching hub** between the default mode and central executive networks.

**Key nodes:** anterior insula (particularly on the right) and dorsal anterior cingulate cortex. Subcortical partners include the amygdala, ventral striatum, and substantia nigra/ventral tegmental area.

Functions include **salience detection** (identifying behaviorally, emotionally, or homeostatically important stimuli), **interoceptive awareness** (monitoring internal bodily states such as heartbeat, breathing, hunger, and pain), **network switching** between the introspective DMN and the goal-directed executive network, **error detection and conflict monitoring** (the dorsal anterior cingulate signals when something has gone wrong or when competing responses must be resolved), and **autonomic regulation**.

The salience network shows a right-hemispheric bias, particularly in the anterior insula, paralleling the right hemisphere's general role in detecting behaviorally relevant novelty.

Salience network dysfunction is implicated in many psychiatric conditions. In schizophrenia, **aberrant salience attribution** — tagging irrelevant stimuli as meaningful — is a leading account of how delusions form. In anxiety disorders and PTSD, the network is hyperactive, amplifying threat detection. The behavioral variant of frontotemporal dementia is marked by degeneration of von Economo neurons in the anterior insula and dorsal anterior cingulate, producing the disinhibition, loss of empathy, and apathy characteristic of the syndrome.

## The Dorsal Attention Network

The dorsal attention network supports **voluntary, top-down attention** — the deliberate allocation of processing resources to a chosen target. When you scan a page for a particular word, search a crowd for a familiar face, or keep your eyes on the road, your dorsal attention network is at work.

**Key nodes:** frontal eye fields, superior parietal lobule, and intraparietal sulcus, bilaterally.

It directs attention to locations in space based on goals, supports **feature-based attention** (preferentially processing color, motion, or orientation), controls **eye movements** and saccades, and guides **visuomotor coordination** for reaching and grasping.

The network is largely bilateral and symmetric, with each hemisphere attending preferentially to the contralateral visual field. This symmetric organization is one reason why left-hemisphere damage rarely causes severe attentional neglect — the right hemisphere can still attend to both sides.

Damage to the dorsal attention network — especially the superior parietal lobule or intraparietal sulcus — impairs deliberate visual search and the voluntary allocation of attention. Patients may have difficulty focusing on a target in a cluttered scene. In extreme cases, bilateral parieto-occipital damage produces **Bálint syndrome** (simultanagnosia, optic ataxia, and oculomotor apraxia), reflecting a severe breakdown of spatial attention.

## The Ventral Attention Network

The ventral attention network detects **unexpected but behaviorally relevant events** — a movement in your peripheral vision, your name called from across a room, an unusual sound. It serves as the brain's circuit breaker, interrupting ongoing activity when something important appears. It works closely with — but distinctly from — the dorsal attention network.

**Key nodes:** temporoparietal junction and ventral frontal cortex (including the inferior frontal gyrus and middle frontal gyrus). Strongly **right-lateralized** in most people.

It supports **stimulus-driven (bottom-up) attention** with automatic capture by salient or unexpected events, **reorienting** (disengaging from a current focus and redirecting to a new stimulus), and **behavioral relevance filtering** — prioritizing stimuli that matter for current goals over those that are merely salient.

Unlike the bilateral dorsal attention network, the ventral attention network is predominantly right-lateralized. This asymmetry is the functional substrate for the right hemisphere's specialization in spatial attention and explains why right-hemisphere damage — especially to the right temporoparietal junction — produces severe **hemispatial neglect** while comparable left-hemisphere lesions typically do not. Patients with neglect may ignore food on the left half of a plate, fail to dress the left side of the body, or draw only the right half of a clock face. Neglect is among the most clinically important consequences of right-hemisphere stroke and a strong negative prognostic factor for functional recovery.

## The Sensorimotor Network

The sensorimotor network links perception and action. It comprises the primary motor and somatosensory cortices along with the supplementary motor area, premotor cortex, and related subcortical structures (thalamus, basal ganglia, cerebellum). Although traditionally studied as separate motor and sensory systems, resting-state imaging reveals them as a single tightly coupled network.

**Key nodes:** primary motor cortex (M1), primary somatosensory cortex (S1), supplementary motor area, and premotor cortex, with subcortical participation from the thalamus, basal ganglia, and cerebellum.

It supports planning and execution of voluntary movement, processing of touch, proprioception, and kinesthesia, sensorimotor integration for skilled action, motor learning (working with the cerebellum and basal ganglia), and motor imagery and simulation.

The network is largely contralaterally organized — each hemisphere controls and receives sensation from the opposite side of the body — with a modest left-hemisphere dominance for skilled motor sequencing in right-handers, which is part of the basis for handedness.

Stroke affecting the sensorimotor network produces contralateral weakness and sensory loss; involvement of higher-order motor regions adds **apraxia** — difficulty performing learned skilled movements despite intact strength and comprehension. Parkinson's disease disrupts the network through its effects on basal-ganglia–motor cortex loops; cerebellar disorders disrupt it through loss of sensorimotor calibration.

## The Visual Network

The visual network encompasses the entire occipital cortex and spreads forward along two great processing streams into the parietal and temporal lobes. Resting-state imaging identifies it as a tightly coupled module centered on the occipital cortex, with sub-networks corresponding to the classical dorsal ("where/how") and ventral ("what") streams.

**Key nodes:** primary visual cortex (V1), extrastriate areas (V2, V3, V4, V5/MT), ventral temporal cortex (fusiform gyrus), and posterior parietal cortex.

Basic processing — edge detection, orientation, color, and motion — occurs in V1 and early extrastriate cortex. The **ventral stream** supports object and face recognition, reading (with the visual word form area), and scene perception. The **dorsal stream** supports spatial localization, visually guided action, and motion processing.

Damage to the visual network produces highly specific deficits depending on the site. V1 lesions cause homonymous visual field defects. V4 damage causes cortical color blindness (achromatopsia). V5/MT damage causes motion blindness (akinetopsia). Ventral stream damage causes visual agnosias, prosopagnosia, or pure alexia; dorsal stream damage causes optic ataxia and Bálint syndrome.

## The Auditory Network

The auditory network comprises the primary and associative auditory cortices and their connections with subcortical auditory structures and the language network. It processes all acoustic input — speech, music, environmental sounds — and supports the perceptual foundations of communication.

**Key nodes:** primary auditory cortex (Heschl's gyrus), superior temporal gyrus, planum temporale, and subcortical auditory structures (medial geniculate nucleus, inferior colliculus).

The auditory network shows one of the clearest functional lateralizations in the brain. The left hemisphere is preferentially engaged in processing **rapid temporal changes**, which are critical for speech, while the right hemisphere is preferentially engaged in **spectral analysis**, which supports pitch, melody, and musical perception. This temporal–spectral division provides a natural basis for left-lateralization of language and right-lateralization of music processing.

Unilateral auditory cortex damage produces subtle deficits because auditory input is bilaterally represented. Bilateral damage causes cortical deafness. More selective deficits include **pure word deafness** (loss of speech comprehension with preserved reading and nonspeech hearing), **amusia** (loss of musical perception), and auditory agnosia for environmental sounds.

## The Language Network

Language is one of the most striking examples of a large-scale network supporting a high-level cognitive function. While the classical Broca–Wernicke model localized language to two regions, modern imaging shows that language depends on a **distributed left-hemisphere network** with contributions from both dorsal and ventral processing streams.

**Key nodes:** Broca's area (inferior frontal gyrus), Wernicke's area (posterior superior temporal gyrus), the arcuate fasciculus connecting them, the angular gyrus, the middle and inferior temporal gyri, and the supplementary motor area. Strongly left-lateralized in most right-handers.

The **dorsal stream** is a frontal–parietal–temporal pathway supported by the arcuate fasciculus. It maps sound to articulation and supports speech repetition, phonological processing, and reading aloud. The **ventral stream** is a temporal–frontal pathway via the uncinate fasciculus and inferior longitudinal fasciculus. It maps sound to meaning and supports comprehension.

Language is the most strongly lateralized cognitive function in the brain. Approximately 95 percent of right-handers and 70 percent of left-handers show left-hemisphere language dominance. The Wada procedure and functional MRI are used clinically to confirm language laterality before neurosurgery.

The aphasias provide some of the most precise clinico-anatomical correlations in neurology. **Broca's (non-fluent) aphasia** follows left inferior frontal damage. **Wernicke's (fluent) aphasia** follows left posterior temporal damage. **Conduction aphasia** follows arcuate fasciculus damage and produces profound difficulty with repetition despite preserved fluency and comprehension. **Global aphasia** follows extensive left-hemisphere damage. **Primary progressive aphasia**, a variant of frontotemporal dementia, produces selective progressive degeneration of the language network with subtypes (semantic, nonfluent, logopenic) that map onto different network components.

## The Limbic / Affective Network

The limbic or affective network encompasses the structures that generate and regulate emotion. It straddles cortex and subcortex, integrating visceral inputs, memory traces, and cognitive evaluations into the feelings that shape behavior.

**Key nodes:** amygdala, hippocampus, anterior cingulate cortex, orbitofrontal cortex, ventromedial prefrontal cortex, hypothalamus, insula, and ventral striatum.

**Emotion generation** arises from the amygdala, insula, and brainstem nuclei, which create the raw affective response to a stimulus. **Emotion regulation** is provided by the ventromedial prefrontal cortex and anterior cingulate, which modulate limbic responses and allow reappraisal, suppression, or contextual shaping of emotion. Amygdala–hippocampus interactions encode the **emotional significance** of events. Orbital and medial prefrontal cortex interact with subcortical limbic structures to generate **social and moral emotion**.

Limbic network dysfunction is central to many psychiatric conditions. Major depression is associated with hyperactivity of the amygdala and subgenual anterior cingulate, with hypoactivity of prefrontal regulatory regions. Anxiety disorders show similar amygdala hyperactivity. In PTSD, altered coupling between amygdala and prefrontal cortex produces exaggerated threat responses and impaired extinction. Bilateral amygdala damage (as in Urbach–Wiethe disease) impairs fear recognition and conditioning. Klüver–Bucy syndrome, from bilateral medial temporal damage, produces placidity, hyperorality, and hypersexuality.

## The Reward Network

The reward network — also called the mesocorticolimbic dopamine system — encodes the value of stimuli and drives motivation, learning from outcomes, and the pursuit of pleasurable or beneficial goals. It is the system whose dysregulation underlies addiction, anhedonia, and several aspects of mood disorders.

**Key nodes:** ventral tegmental area (VTA), nucleus accumbens / ventral striatum, ventromedial prefrontal cortex, orbitofrontal cortex, and amygdala. The VTA's dopamine projections provide the reward signal that tunes the network.

Dopamine neurons in the VTA generate **reward prediction errors** — the difference between expected and received reward. The nucleus accumbens and its dopaminergic input drive **motivation** and goal-directed behavior. The network supports **reinforcement learning**, updating the value of actions and cues based on outcomes. **Hedonic experience** — the "liking" signal — is carried by specific hotspots within the ventral striatum and pallidum.

Addiction involves persistent hijacking of the reward network by drugs or behaviors that produce outsized dopamine responses, altering valuation and learning. Depression is associated with reduced reward-network responsivity, producing anhedonia. Parkinson's disease disrupts the network through VTA degeneration, contributing to apathy and impaired reward learning. Impulse-control disorders sometimes emerge as a side effect of dopaminergic medications that overstimulate the reward system.

## The Cerebellar and Subcortical Networks

Most discussed networks are cortical, but the cerebellum and basal ganglia form their own large-scale functional networks — tightly linked to cortical networks through looping circuits.

### Cerebellar Network

The cerebellum is connected to nearly every cortical network through the pons and thalamus. Functional imaging reveals a **cerebellar homologue of each cortical network**: there are cerebellar regions that belong to the default mode network, executive network, salience network, dorsal attention network, and sensorimotor network. This supports the modern view that the cerebellum contributes to cognition and emotion as well as motor control.

Cerebellar damage can produce not only ataxia but also **cerebellar cognitive affective syndrome** (Schmahmann's syndrome), with executive, language, and personality changes that reflect disrupted cerebellar participation in cortical networks.

### Basal Ganglia (Cortico-Striato-Thalamo-Cortical) Loops

The basal ganglia participate in a series of parallel loops with the cortex and thalamus, each serving a different network. The **motor loop** (via the putamen) supports movement. The **associative loop** (via the caudate) supports cognition. The **limbic loop** (via the ventral striatum) supports motivation and emotion. The **oculomotor loop** supports eye movements.

Diseases of the basal ganglia disrupt these loops selectively. Parkinson's disease prominently affects the motor loop. Huntington's disease disrupts all three. Basal-ganglia disease produces a mixture of motor, cognitive, and psychiatric symptoms precisely because these structures participate in networks serving all three domains.

## The Triple Network Model

Proposed by Vinod Menon in 2011, the triple network model offers a simple but powerful framework for understanding much of higher cognition and its disruption in disease. Three networks — the default mode, central executive, and salience networks — interact dynamically to support goal-directed behavior.

- The **default mode network** dominates during rest, introspection, and self-referential thought.
- The **central executive network** dominates during externally focused, goal-directed cognition.
- The **salience network** monitors internal and external events and switches engagement between the DMN and executive network as demands change.

The salience network's switching function is critical. Healthy cognition requires fluid transitions from introspection to action and back again. When the salience network signals that something important is happening in the outside world, the executive network ramps up and the DMN quiets; when external demands subside, the DMN reasserts itself.

Many psychiatric and neurological conditions can be understood as disruptions of one or more of these three networks, or of the transitions between them. Depression is marked by DMN hyperactivity (rumination) and reduced salience-network switching. Schizophrenia shows altered salience attribution and disrupted executive control. Alzheimer's disease begins with DMN dysfunction. Anxiety disorders feature hyperactive salience processing. ADHD involves reduced executive-network engagement.

## Network Dynamics: Switching and Flexibility

Brain networks are not static. They reconfigure moment-to-moment in response to changing task demands, internal states, and unexpected events. Understanding this dynamic reconfiguration is one of the frontiers of network neuroscience.

**Network flexibility** is the ease with which regions change network membership over time. Greater flexibility is associated with better learning and cognitive adaptability.

**Anticorrelation** describes the negative coupling between networks like the DMN and executive network — when one is active, the other tends to deactivate. Weakening of this anticorrelation is associated with cognitive decline in aging and disease.

**State transitions.** The brain transitions between a small number of recurrent activity states, each dominated by different networks. The timing, duration, and transition pattern among these states vary with age, task, and disease.

**Arousal and consciousness.** Network organization changes markedly with arousal. Sleep, anesthesia, and disorders of consciousness are characterized by reduced integration between networks, while conscious wakefulness depends on flexible, balanced network coordination.

**Development and aging.** Networks refine throughout childhood and adolescence, with the DMN and executive networks among the last to mature. In older age, within-network connectivity tends to decline while between-network connectivity may increase, blurring network boundaries.

## Summary Table of Networks

| Network | Key Nodes | Primary Function | Signature Disruption |
|---|---|---|---|
| Default mode | mPFC, PCC/precuneus, angular gyrus, MTL | Introspection, memory, mind-wandering | Alzheimer's; depression; schizophrenia |
| Central executive | DLPFC, posterior parietal cortex | Working memory, goal-directed cognition | Dysexecutive syndrome; ADHD |
| Salience | Anterior insula, dACC | Salience detection; network switching | Schizophrenia; bvFTD; anxiety |
| Dorsal attention | Frontal eye fields, IPS | Top-down spatial attention | Bálint syndrome |
| Ventral attention | TPJ, ventral frontal cortex (right) | Stimulus-driven reorienting | Hemispatial neglect |
| Sensorimotor | M1, S1, SMA, premotor | Voluntary movement and touch | Hemiparesis; apraxia |
| Visual | Occipital cortex, fusiform, posterior parietal | Visual perception and recognition | Agnosias; hemianopia; akinetopsia |
| Auditory | Heschl's gyrus, superior temporal gyrus | Sound and speech processing | Cortical deafness; word deafness; amusia |
| Language | Broca's, Wernicke's, arcuate fasciculus, angular gyrus (left) | Comprehension and production of language | Aphasias; primary progressive aphasia |
| Limbic / affective | Amygdala, hippocampus, ACC, OFC, vmPFC, insula | Emotion generation and regulation | Depression; anxiety; PTSD; Klüver–Bucy |
| Reward | VTA, nucleus accumbens, vmPFC, OFC | Value, motivation, reinforcement learning | Addiction; anhedonia; apathy |
| Cerebellar | Cerebellar hemispheres, vermis | Motor coordination; cognitive and emotional contributions | Ataxia; Schmahmann's syndrome |

## Networks in Disease

A powerful insight of modern neuroscience is that many disorders are best understood as **network diseases**. Pathology does not always respect anatomical boundaries, but it often targets specific networks with striking selectivity.

### Alzheimer's Disease

Alzheimer's preferentially targets the default mode network. The posterior cingulate, precuneus, and medial temporal lobe show the earliest metabolic decline and amyloid deposition. As the disease progresses, the DMN disintegrates, correlating with memory loss and disorientation. Other networks are affected later in the course.

### Behavioral Variant Frontotemporal Dementia

bvFTD selectively degenerates the salience network, with prominent loss of von Economo neurons in the anterior insula and anterior cingulate. This produces the characteristic clinical picture of disinhibition, loss of empathy, apathy, and compulsive behaviors — all of which reflect failure of the network that monitors social and emotional salience.

### Primary Progressive Aphasias

The primary progressive aphasias are network-specific neurodegenerative diseases of the language network. The nonfluent/agrammatic variant targets Broca's area and surrounding left frontal regions. The semantic variant targets the anterior temporal lobes. The logopenic variant targets the left temporoparietal junction.

### Schizophrenia

Schizophrenia is increasingly conceptualized as a disorder of **network dysconnection**. The salience network shows abnormal function, with aberrant assignment of meaning to irrelevant stimuli — a leading account of how delusions form. The DMN is hyperactive and poorly suppressed during tasks. The executive network shows reduced efficiency.

### Depression

Major depression features hyperconnectivity within the default mode network (linked to rumination), reduced executive-network engagement (contributing to cognitive symptoms), hyperactivity of the subgenual anterior cingulate and amygdala, and blunted reward-network responsivity (linked to anhedonia). These network changes are the rationale for targets in neuromodulation therapies such as deep brain stimulation of the subgenual cingulate and TMS of the dorsolateral prefrontal cortex.

### Addiction

Addiction is fundamentally a disease of the reward network. Repeated drug exposure produces neuroadaptations in the VTA–nucleus accumbens pathway and alters prefrontal regulation, shifting the balance from goal-directed decision-making toward habitual, cue-driven use. Recovery requires rebalancing this system.

### ADHD

Attention-deficit/hyperactivity disorder is associated with reduced executive-network activity, impaired DMN suppression during tasks, and altered salience-network function. The resulting difficulty in switching out of the internally focused DMN state and maintaining engagement with external goals mirrors the behavioral profile of ADHD.

### Stroke and Traumatic Brain Injury

Beyond the immediate effects of tissue damage, stroke and TBI disrupt networks — often with effects that extend far beyond the lesion itself, a phenomenon known as **diaschisis**. Recovery depends not just on local healing but on network reorganization, often involving contralesional homologues and other structurally connected regions.

### Therapeutic Implications

The network perspective has opened new therapeutic strategies. Deep brain stimulation targets hubs within disrupted networks — subgenual cingulate for depression, subthalamic nucleus for Parkinson's. Transcranial magnetic stimulation modulates network activity through cortical targets such as the dorsolateral prefrontal cortex for depression. Neurofeedback and cognitive training aim to restore healthy network dynamics directly. Understanding which network is disrupted — not just which region is damaged — increasingly guides where and how to intervene.

## Conclusion

The discovery that the brain is organized into large-scale networks has transformed neuroscience. Rather than a collection of independent modules, the brain is now understood as a dynamic system of interacting networks, each specialized for particular functions but working together to produce the seamless unity of mental life. No thought, perception, emotion, or action is the product of a single region; all are emergent properties of coordinated activity across distributed networks.

This network perspective has clarified the anatomy of many disorders — Alzheimer's as a disease of the default mode network, behavioral variant frontotemporal dementia as a salience network disease, depression as a disorder of DMN–executive balance, aphasia as a disruption of the language network. It has also opened new therapeutic frontiers, from deep brain stimulation to network-informed cognitive rehabilitation. As imaging, stimulation, and computational methods continue to advance, the picture of the brain's networks will only deepen.
`;

async function run() {
  console.log("Inserting Brain Networks topic...");
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
