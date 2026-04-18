import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  topicsTable, flashcardsTable, quizQuestionsTable,
  studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable,
} from "./schema";

async function seed() {
  console.log("Seeding Enteric Nervous System topic...");

  const [topic] = await db.insert(topicsTable).values({
    name: "Enteric Nervous System",
    category: "Neuroanatomy",
    description: "The 'second brain' — structure and function of the ENS, gut-brain axis, enteric neurotransmitters, gut motility reflex circuits, ENS-immune interactions, and clinical disorders involving ENS dysfunction.",
  }).returning();

  const topicId = topic.id;
  console.log(`✓ Topic id=${topicId}`);

  const flashcards = [
    { question: "What is the enteric nervous system (ENS)?", answer: "The ENS is a vast intrinsic neural network embedded in the gastrointestinal tract wall — from the esophagus to the internal anal sphincter. It contains 400-600 million neurons (comparable to the spinal cord), can function independently of the CNS, and regulates motility, secretion, absorption, blood flow, and immune responses. It is the largest division of the peripheral nervous system.", difficulty: "easy" },
    { question: "Why is the ENS called the 'second brain'?", answer: "1) Sheer neuron number (~500 million — comparable to the spinal cord). 2) Functional independence — the ENS coordinates complex behaviors (peristalsis, migrating motor complex) even after the vagus and spinal nerves are severed. 3) Same neurotransmitters and glial cell types as the CNS. 4) Bidirectional communication with the CNS via the gut-brain axis. 5) Intrinsic sensory, interneuron, and motor neuron circuits.", difficulty: "easy" },
    { question: "What are the two main plexuses of the ENS and where are they located?", answer: "1) Myenteric plexus (Auerbach's plexus): located between the circular and longitudinal smooth muscle layers — primarily controls gut motility (muscle contraction patterns, peristalsis, segmentation). 2) Submucosal plexus (Meissner's plexus): located in the submucosa — primarily controls secretion, absorption, and mucosal blood flow; also contains sensory neurons responding to luminal chemical environment.", difficulty: "medium" },
    { question: "What does the myenteric plexus control?", answer: "The myenteric (Auerbach's) plexus controls gut motility — it regulates the pattern, timing, and coordination of smooth muscle contractions. It mediates: peristaltic reflex (coordinated ascending excitation and descending inhibition to propel contents), migrating motor complex (between meals), and segmentation contractions (mixing). It extends the full length of the GI tract from the esophagus to the internal anal sphincter.", difficulty: "medium" },
    { question: "What does the submucosal plexus control?", answer: "The submucosal (Meissner's) plexus regulates mucosal function: secretion (water, electrolytes, mucus), absorption, and mucosal blood flow. It contains chemoreceptive sensory neurons that sample the luminal environment and interneurons that relay to secretomotor neurons. The submucosal plexus is more prominent in the small intestine (where secretion/absorption is most important) and is absent in the esophagus.", difficulty: "medium" },
    { question: "What types of neurons make up the ENS?", answer: "1) Intrinsic primary afferent neurons (IPANs / AH neurons): sensory — detect mechanical distension, chemical content, and pH; have long after-hyperpolarizations. 2) Interneurons: ascending (excitatory) and descending (inhibitory) — relay information along the gut wall. 3) Motor neurons: excitatory (ACh + substance P → muscle contraction) and inhibitory (NO, VIP → muscle relaxation). Proportionally: ~15-20% sensory, ~20-25% motor, ~50-60% interneurons.", difficulty: "hard" },
    { question: "What are enteric glial cells and what do they do?", answer: "Enteric glial cells (EGCs) are the ENS counterpart to astrocytes — they far outnumber enteric neurons (4:1 ratio). Functions: structural support, regulation of synaptic neurotransmission, maintenance of the intestinal epithelial barrier, immunomodulation, and trophic support for enteric neurons. EGC loss is associated with intestinal dysmotility and increased intestinal permeability ('leaky gut').", difficulty: "hard" },
    { question: "What are interstitial cells of Cajal (ICC) and their role?", answer: "ICCs are specialized mesenchymal cells (distinct from neurons) distributed throughout the gut wall — particularly in the myenteric region (between muscle layers) and deep within the circular muscle. They are the pacemaker cells of the GI tract: generating slow-wave electrical activity (basic electrical rhythm) that sets the timing of muscular contractions. ICCs are coupled to smooth muscle via gap junctions and are innervated by enteric motor neurons. Loss of ICCs → gastroparesis (as in diabetic gastroparesis).", difficulty: "hard" },
    { question: "What neurotransmitters does the ENS use?", answer: "Excitatory motor neurons: acetylcholine (ACh) and substance P — activate circular muscle above the bolus (propulsion). Inhibitory motor neurons: nitric oxide (NO) and vasoactive intestinal peptide (VIP) — relax circular muscle below the bolus. Other key ENS transmitters: serotonin (5-HT, in enterochromaffin cells — initiates peristaltic reflex), neuropeptide Y (NPY), gastrin-releasing peptide (GRP), enkephalins, calretinin, calbindin.", difficulty: "hard" },
    { question: "Why is serotonin especially important in the ENS?", answer: "~90-95% of the body's total serotonin (5-HT) is found in the GI tract — stored in enterochromaffin (EC) cells of the intestinal epithelium, not in enteric neurons. Luminal mechanical or chemical stimuli trigger EC cells to release 5-HT → activates 5-HT3 and 5-HT4 receptors on intrinsic afferent neurons (IPANs) → initiates peristaltic reflex and secretomotor responses. 5-HT also activates vagal and spinal afferents → 'gut feelings' reach the brain.", difficulty: "hard" },
    { question: "What is the peristaltic reflex?", answer: "The fundamental propulsive reflex of the GI tract — triggered by luminal distension or mucosal stimulation: 1) IPANs detect the stimulus. 2) ASCENDING excitation (oral direction): interneurons → excitatory motor neurons (ACh, substance P) → circular muscle contracts above the bolus. 3) DESCENDING inhibition (anal direction): interneurons → inhibitory motor neurons (NO, VIP) → circular muscle relaxes below the bolus. This coordinated ascending excitation + descending inhibition propels contents aborally.", difficulty: "medium" },
    { question: "What is the migrating motor complex (MMC)?", answer: "The MMC is a cyclical pattern of electrical and mechanical activity that sweeps through the GI tract between meals — occurring every 90-120 minutes in four phases (quiescence → increasing activity → intense activity [phase III 'housekeeper wave'] → transition). Functions: propels undigested residue and bacteria from the stomach through the small intestine (prevents bacterial overgrowth); requires motilin (hormone) and enteric neural coordination. Disrupted in SIBO (small intestinal bacterial overgrowth) and diabetic gastroparesis.", difficulty: "hard" },
    { question: "What is the gut-brain axis?", answer: "The gut-brain axis (GBA) is the bidirectional communication network between the ENS/GI tract and the CNS — involving neural, endocrine, immune, and microbial pathways. Gut → brain: vagal afferents (~80% vagal fibers are afferent), spinal afferents, hormones (ghrelin, leptin, CCK), immune mediators, microbial metabolites (SCFAs, serotonin precursors). Brain → gut: vagal efferents, sympathetic efferents, HPA axis stress hormones → affect motility, secretion, permeability.", difficulty: "medium" },
    { question: "What percentage of vagal fibers are afferent vs. efferent?", answer: "Approximately 80% of vagal fibers are AFFERENT (sensory, gut → brain) and only ~20% are efferent (motor, brain → gut). This reflects that the GI tract is a massive sensory organ continuously communicating to the brainstem (NTS — nucleus tractus solitarius) about luminal contents, distension, gut hormones, and inflammation — far more information flows from gut to brain than from brain to gut.", difficulty: "hard" },
    { question: "What is the nucleus tractus solitarius (NTS) and why is it important for gut-brain communication?", answer: "The NTS is a brainstem nucleus in the dorsal medulla that receives the primary central termination of vagal afferents from all visceral organs including the GI tract. It integrates gut sensory signals with autonomic, endocrine, and homeostatic regulation. NTS projects to: hypothalamus (satiety, stress), parabrachial nucleus (pain, taste), amygdala (emotional processing of gut signals), and reticular formation (autonomic reflexes).", difficulty: "hard" },
    { question: "How does the gut microbiome influence the ENS and gut-brain axis?", answer: "The gut microbiome (trillions of bacteria, fungi, viruses) modulates the ENS and gut-brain axis through: 1) Short-chain fatty acids (SCFAs — butyrate, propionate, acetate): produced by bacterial fermentation; support ENS neurons and colonocytes; modulate enteric glial function. 2) Serotonin precursor synthesis (tryptophan → 5-HT): gut bacteria influence EC cell serotonin production. 3) Immune modulation: microbiome trains gut-associated lymphoid tissue (GALT). 4) Direct activation of IPANs and vagal afferents via bacterial metabolites.", difficulty: "hard" },
    { question: "What is the ENS-immune system interaction?", answer: "The GI tract contains ~70% of the body's immune cells (gut-associated lymphoid tissue, GALT) and the ENS is intimately linked to this immune tissue. ENS neurons release neuropeptides (VIP, substance P) that modulate immune cell function. Conversely, immune cells (mast cells, macrophages) release cytokines and histamine that directly activate enteric neurons and IPANs — linking inflammation, stress, and altered gut motility. This neuro-immune axis is critical in IBS and IBD.", difficulty: "hard" },
    { question: "What is Hirschsprung's disease?", answer: "A congenital condition in which neural crest cells fail to migrate fully into the distal colon during development — resulting in the absence of ganglia (aganglionosis) from the myenteric and submucosal plexuses in the affected segment (usually rectosigmoid). Without inhibitory ENS neurons (NO, VIP), the aganglionic segment remains tonically contracted — causing functional obstruction, proximal megacolon, and failure to pass meconium. Treatment: surgical resection of the aganglionic segment.", difficulty: "medium" },
    { question: "What is the neural mechanism of achalasia?", answer: "Achalasia is a disorder of the esophagus and lower esophageal sphincter (LES) caused by loss of inhibitory ENS neurons (nitric oxide-producing neurons) in the myenteric plexus of the LES and esophageal body — resulting in: failure of LES relaxation upon swallowing, and absence of normal peristaltic contractions. The LES remains tonically contracted, causing progressive dysphagia. There is also autoimmune destruction of the esophageal myenteric plexus.", difficulty: "hard" },
    { question: "What is gastroparesis and what ENS/ICC mechanism underlies it?", answer: "Gastroparesis is delayed gastric emptying without mechanical obstruction — resulting in nausea, vomiting, bloating, and early satiety. Primary ENS/ICC mechanism: loss or dysfunction of interstitial cells of Cajal (ICCs), which generate slow-wave electrical activity pacing gastric contractions. Diabetic gastroparesis: chronic hyperglycemia damages ICC networks and enteric neurons. Vagal neuropathy (in diabetes) also impairs gastric accommodation and emptying.", difficulty: "hard" },
    { question: "What is irritable bowel syndrome (IBS) and how is ENS/gut-brain axis involvement conceptualized?", answer: "IBS is a functional GI disorder characterized by altered bowel habits (constipation, diarrhea, or mixed) and abdominal pain without structural pathology. ENS/GBA mechanisms: 1) Visceral hypersensitivity — lowered pain threshold from IPANs and spinal sensitization. 2) Altered motility — abnormal serotonin signaling (5-HT3/5-HT4) in the ENS. 3) Gut microbiome dysbiosis — altered SCFA and serotonin production. 4) Psychological stress — HPA axis → CRF → alters ENS function and mucosal permeability. 5) Low-grade mucosal inflammation and mast cell activation.", difficulty: "hard" },
    { question: "What is the Braak hypothesis regarding Parkinson's disease and the ENS?", answer: "Braak et al. proposed that Parkinson's disease may begin in the ENS (or olfactory bulb) rather than in the substantia nigra. Alpha-synuclein (the pathological protein in Parkinson's) accumulates in enteric neurons of the ENS years to decades before it appears in the brainstem — possibly spreading via vagal afferents in a prion-like manner to the dorsal motor nucleus of the vagus, then upward through the brainstem (Lewy body pathology progression). Supports the 'gut-first' hypothesis for at least a subset of PD cases.", difficulty: "hard" },
    { question: "What is nitric oxide's role in the ENS?", answer: "Nitric oxide (NO) is the primary inhibitory neurotransmitter of the ENS — produced by inhibitory motor neurons (nitrergic neurons) in the myenteric plexus. NO causes smooth muscle relaxation by activating guanylyl cyclase → cGMP → PKG → smooth muscle relaxation. Critical for: LES relaxation (allowing food to pass), pyloric relaxation, and the descending inhibitory limb of the peristaltic reflex. Loss of nitrergic neurons → achalasia (LES), pyloric stenosis (pylorus), Hirschsprung's (colon).", difficulty: "hard" },
    { question: "What is VIP (vasoactive intestinal peptide) in the ENS?", answer: "VIP is a neuropeptide co-released with NO from inhibitory enteric motor neurons — acting on VPAC1 and VPAC2 receptors to cause smooth muscle relaxation, stimulate mucosal secretion, and promote vasodilation of the mucosal microvasculature. VIP also has anti-inflammatory properties in the gut. It is a key mediator of non-adrenergic, non-cholinergic (NANC) inhibitory transmission in the GI tract.", difficulty: "hard" },
    { question: "What is the physiological role of substance P in the ENS?", answer: "Substance P (SP) is a neuropeptide released from excitatory enteric motor neurons (and IPANs) — acts on NK1 receptors on smooth muscle to produce contraction. It is co-released with ACh to mediate the ascending excitatory limb of the peristaltic reflex (circular muscle contraction above the bolus). SP also has pro-inflammatory effects, stimulates mast cell degranulation, and contributes to visceral pain sensitization — elevated in IBS.", difficulty: "hard" },
    { question: "What is neuropeptide Y (NPY) in the ENS?", answer: "NPY is an inhibitory neuropeptide released from descending interneurons and submucosal neurons — acts on Y1 and Y2 receptors to inhibit secretion, reduce gut motility, and cause vasoconstriction of mucosal vessels. NPY is co-released with NE from sympathetic postganglionic fibers to inhibit ENS activity during stress (suppressing digestion). It also modulates appetite and food intake when released centrally.", difficulty: "hard" },
    { question: "How does the ENS develop embryologically?", answer: "The ENS originates entirely from the neural crest — specifically vagal neural crest cells (contributing most of the ENS, craniocaudal) and sacral neural crest cells (contributing to the distal colon). Neural crest cells migrate into the developing gut, proliferate, differentiate, and establish connections to form the full ENS network. Failure of this migration causes aganglionosis (Hirschsprung's disease). ENS development depends on glial cell line-derived neurotrophic factor (GDNF) and its receptor Ret.", difficulty: "hard" },
    { question: "What is the role of GDNF and the Ret receptor in ENS development?", answer: "GDNF (glial cell line-derived neurotrophic factor) is secreted by the developing gut mesenchyme — it binds the Ret receptor tyrosine kinase on migrating neural crest cells, stimulating their proliferation, migration, and survival. Loss-of-function mutations in Ret or GDNF are the most common genetic causes of Hirschsprung's disease — impairing neural crest cell migration and preventing ENS formation in the affected gut segment.", difficulty: "hard" },
    { question: "What is small intestinal bacterial overgrowth (SIBO) and what is the ENS's role in preventing it?", answer: "SIBO is abnormal proliferation of bacteria in the small intestine (normally relatively low bacterial density). The ENS prevents SIBO primarily through the migrating motor complex (MMC) — specifically phase III (housekeeper wave) sweeps bacteria and undigested material into the colon every 90-120 minutes between meals. Disruption of ENS-mediated MMC (from diabetes, opioids, intestinal dysmotility, or anatomical stasis) allows bacterial overgrowth. SIBO causes bloating, diarrhea, and malabsorption.", difficulty: "hard" },
    { question: "What is the role of enkephalins in the ENS?", answer: "Enkephalins are endogenous opioid peptides in the ENS (released from interneurons) — they bind mu and delta opioid receptors on enteric neurons to: inhibit ACh release (reducing motility), reduce secretion, and modulate pain transmission. This is why exogenous opioids (morphine, codeine) cause constipation — they act on ENS opioid receptors to profoundly suppress propulsive motility. Peripheral opioid antagonists (e.g., methylnaltrexone) treat opioid-induced constipation without crossing the BBB.", difficulty: "hard" },
    { question: "How does psychological stress affect the ENS and gut function?", answer: "The HPA axis response to stress releases CRF (corticotropin-releasing factor) → acts on ENS and gut to: increase colonic motility (stress-induced diarrhea), increase intestinal permeability ('leaky gut'), activate mast cells → histamine and serotonin release → IPAN activation → altered sensation and motility. Brainstem centers (NTS, locus coeruleus) also directly modulate enteric function via vagal and sympathetic efferents. This stress-gut interaction is central to IBS pathophysiology.", difficulty: "hard" },
    { question: "What is the role of motilin in ENS function?", answer: "Motilin is a hormone released from enteroendocrine cells (M cells) of the small intestine during fasting — it acts on motilin receptors on enteric neurons and smooth muscle to initiate phase III of the migrating motor complex (housekeeper contraction). Erythromycin (a macrolide antibiotic) is a motilin receptor agonist and is used off-label as a prokinetic agent in gastroparesis.", difficulty: "hard" },
  ];

  const inserted = await db.insert(flashcardsTable).values(flashcards.map(f => ({ ...f, topicId }))).returning();
  console.log(`✓ ${inserted.length} flashcards`);

  const regular = [
    { question: "Approximately how many neurons does the enteric nervous system contain?", optionA: "~1 million (similar to the cerebellum)", optionB: "~400-600 million (comparable to the spinal cord)", optionC: "~100 billion (comparable to the cerebral cortex)", optionD: "~10,000 (about the size of a small ganglion)", correctAnswer: "B", explanation: "The ENS contains ~400-600 million neurons — approximately the same number as the entire spinal cord. This massive neuronal population supports independent regulation of GI function without requiring CNS input.", examOnly: false },
    { question: "The myenteric plexus (Auerbach's plexus) is located:", optionA: "In the submucosa, beneath the intestinal mucosa", optionB: "Between the circular and longitudinal muscle layers — primarily controlling gut motility", optionC: "In the mucosa, directly beneath the epithelium", optionD: "In the adventitia, surrounding the outer gut wall", correctAnswer: "B", explanation: "The myenteric (Auerbach's) plexus lies between the circular and longitudinal smooth muscle layers throughout the GI tract. It controls motor patterns — peristalsis, segmentation, and MMC. The submucosal (Meissner's) plexus lies in the submucosa and controls secretion and absorption.", examOnly: false },
    { question: "What percentage of the body's total serotonin is found in the GI tract?", optionA: "~10-15%", optionB: "~50%", optionC: "~90-95%", optionD: "~5% — the rest is in the brain", correctAnswer: "C", explanation: "Approximately 90-95% of the body's total serotonin (5-HT) is found in the GI tract — stored in enterochromaffin (EC) cells of the intestinal epithelium. This gut serotonin is critical for initiating peristaltic reflexes and communicating gut status to the brain via vagal afferents.", examOnly: false },
    { question: "The ascending limb of the peristaltic reflex above the bolus is mediated by:", optionA: "NO and VIP causing smooth muscle relaxation", optionB: "ACh and substance P causing smooth muscle contraction", optionC: "Serotonin causing mucosal secretion", optionD: "Neuropeptide Y inhibiting motility", correctAnswer: "B", explanation: "The peristaltic reflex has two coordinated limbs: ASCENDING excitation (oral/above the bolus): excitatory motor neurons release ACh and substance P → circular muscle contracts. DESCENDING inhibition (anal/below the bolus): inhibitory motor neurons release NO and VIP → circular muscle relaxes. Together they propel contents aborally.", examOnly: false },
    { question: "Hirschsprung's disease results from:", optionA: "Overactivity of inhibitory ENS neurons in the rectosigmoid", optionB: "Failure of neural crest cell migration — resulting in absence of ENS ganglia (aganglionosis) in the affected gut segment", optionC: "Loss of interstitial cells of Cajal from the entire GI tract", optionD: "Autoimmune destruction of vagal efferents to the colon", correctAnswer: "B", explanation: "In Hirschsprung's disease, neural crest cells fail to complete their craniocaudal migration into the distal bowel — leaving an aganglionic segment (no myenteric or submucosal ganglia). Without inhibitory neurons (NO, VIP), the aganglionic segment remains tonically contracted, causing functional obstruction.", examOnly: false },
    { question: "The Braak hypothesis proposes that Parkinson's disease may begin in:", optionA: "The substantia nigra, consistent with classic motor-first progression", optionB: "The ENS (or olfactory bulb), with alpha-synuclein pathology spreading via vagal afferents to the brainstem before the substantia nigra", optionC: "The cerebral cortex, with retrograde spread to the brainstem", optionD: "The locus coeruleus exclusively", correctAnswer: "B", explanation: "Braak et al. proposed a 'gut-first' hypothesis: alpha-synuclein pathology appears in enteric neurons (and olfactory bulb) years before substantia nigra involvement — possibly spreading in a prion-like fashion via vagal afferents to the dorsal motor nucleus of the vagus, then rostrally through the brainstem. GI symptoms (constipation) frequently precede motor symptoms in PD.", examOnly: false },
    { question: "Achalasia is caused by loss of which type of enteric neuron?", optionA: "Excitatory ACh-releasing motor neurons", optionB: "Inhibitory nitric oxide-producing neurons in the myenteric plexus of the LES", optionC: "Submucosal secretomotor neurons", optionD: "IPANs (intrinsic primary afferent neurons)", correctAnswer: "B", explanation: "Achalasia results from loss of inhibitory (NO-producing, nitrergic) neurons in the myenteric plexus of the lower esophageal sphincter and esophageal body. Without NO-mediated inhibition, the LES fails to relax during swallowing and the esophageal body loses normal peristalsis — causing progressive dysphagia.", examOnly: false },
    { question: "The migrating motor complex (MMC) primarily functions to:", optionA: "Coordinate digestion and absorption during a meal", optionB: "Sweep undigested residue and bacteria from the small intestine into the colon between meals — preventing bacterial overgrowth", optionC: "Regulate acid secretion in the stomach", optionD: "Control the internal anal sphincter during defecation", correctAnswer: "B", explanation: "The MMC is the 'housekeeper' of the GI tract — cycling every ~90-120 minutes between meals. Phase III (housekeeper wave) generates intense peristaltic activity that propels bacteria and debris from the small intestine into the colon. Disruption causes SIBO (small intestinal bacterial overgrowth).", examOnly: false },
    { question: "Approximately 80% of vagal fibers are:", optionA: "Efferent (brain → gut) — transmitting autonomic commands to the ENS", optionB: "Afferent (gut → brain) — transmitting sensory information from the GI tract to the brainstem", optionC: "Equally divided between sensory and motor", optionD: "Myelinated Aα fibers transmitting proprioception from the gut wall", correctAnswer: "B", explanation: "A counterintuitive but critical fact: ~80% of vagal fibers are AFFERENT (gut → brain) and only ~20% are efferent (brain → gut). The GI tract is a massive sensory organ — continuously broadcasting information about luminal contents, distension, hormones, and inflammation to the brainstem NTS.", examOnly: false },
    { question: "Opioid-induced constipation occurs because exogenous opioids:", optionA: "Block CNS pain pathways that normally stimulate gut motility", optionB: "Act on mu opioid receptors on enteric neurons to suppress ACh release and propulsive motility in the ENS", optionC: "Activate sympathetic efferents to the gut, overriding the ENS", optionD: "Destroy interstitial cells of Cajal", correctAnswer: "B", explanation: "The ENS is densely populated with opioid receptors. Exogenous opioids act peripherally (in the gut) on mu receptors on enteric neurons → inhibit ACh release → suppress propulsive peristalsis → constipation. Peripheral opioid receptor antagonists (methylnaltrexone, naloxegol) treat opioid-induced constipation without crossing the BBB or reversing analgesia.", examOnly: false },
  ];

  const examOnly = [
    { question: "Intrinsic primary afferent neurons (IPANs) of the ENS are characterized by:", optionA: "Rapid-onset, brief action potentials with no afterpotential", optionB: "A long after-hyperpolarization (AH neurons) — allowing them to detect slow changes in luminal mechanics and chemistry", optionC: "Exclusively mechanical sensitivity — insensitive to chemical luminal content", optionD: "Large myelinated axons transmitting rapidly to the myenteric plexus", correctAnswer: "B", explanation: "IPANs (also called AH neurons for 'after-hyperpolarization') are the sensory neurons of the ENS — they detect luminal distension, chemical content, and pH. Their characteristic long after-hyperpolarization (from IKCa channels) makes them adapt slowly — suited for detecting sustained luminal stimuli rather than brief events.", examOnly: true },
    { question: "Interstitial cells of Cajal (ICCs) are functionally significant because:", optionA: "They are the primary inhibitory interneurons of the myenteric plexus", optionB: "They are the pacemakers of the GI tract — generating slow-wave electrical activity that coordinates smooth muscle contraction timing", optionC: "They produce the majority of gut serotonin stored in the ENS", optionD: "They form the blood-gut barrier within mucosal capillaries", correctAnswer: "B", explanation: "ICCs generate the basic electrical rhythm (slow waves) — pacemaker activity that sets the timing of GI smooth muscle contractions. They are coupled to smooth muscle via gap junctions and are innervated by enteric neurons. Loss of ICCs (in diabetes, aging) impairs the coordinated electrical pacing of gut contractions — leading to gastroparesis and dysmotility.", examOnly: true },
    { question: "GDNF (glial cell line-derived neurotrophic factor) and its receptor Ret are critical in ENS development because:", optionA: "They regulate myelination of enteric neurons postnatally", optionB: "Ret mutations are the most common cause of Hirschsprung's disease — Ret signaling is required for neural crest cell proliferation, migration, and survival during ENS formation", optionC: "GDNF stimulates serotonin production in enterochromaffin cells", optionD: "They determine the ratio of excitatory to inhibitory enteric neurons", correctAnswer: "B", explanation: "GDNF (secreted by gut mesenchyme) binds the GFRα1/Ret co-receptor complex on migrating vagal neural crest cells — driving their proliferation, migration (craniocaudally through the gut), and survival. Loss-of-function mutations in Ret are the most common (and first identified) genetic cause of Hirschsprung's disease.", examOnly: true },
    { question: "The gut microbiome influences the gut-brain axis via short-chain fatty acids (SCFAs) primarily by:", optionA: "Directly crossing the BBB to activate dopamine receptors in the CNS", optionB: "Serving as energy substrates for colonocytes, supporting ENS neuronal health, modulating enteric glial function, and activating free fatty acid receptors on enteroendocrine cells and vagal afferents", optionC: "Replacing serotonin as the primary ENS neurotransmitter in the absence of enterochromaffin cells", optionD: "Inhibiting motilin release to slow intestinal transit", correctAnswer: "B", explanation: "SCFAs (butyrate, propionate, acetate) produced by bacterial fermentation of dietary fiber: provide ~70% of colonocyte energy (butyrate), support ENS neuron and glial health, activate FFAR2/FFAR3 receptors on EECs and vagal afferents (gut → brain signaling), and modulate immune function. Reduced SCFA production (dysbiosis) is implicated in IBD, IBS, and metabolic disorders.", examOnly: true },
    { question: "IBS is conceptualized as a gut-brain axis disorder involving:", optionA: "Structural destruction of enteric ganglia detectable on endoscopy", optionB: "Visceral hypersensitivity from altered IPAN and spinal afferent sensitization, abnormal ENS serotonin signaling, low-grade mucosal inflammation, microbiome dysbiosis, and CNS stress axis amplification", optionC: "Complete absence of peristaltic reflex due to myenteric plexus atrophy", optionD: "Primarily a CNS disorder with no peripheral gut mechanism", correctAnswer: "B", explanation: "IBS involves multiple interacting mechanisms: visceral hypersensitivity (lowered pain threshold in IPANs and dorsal horn), abnormal 5-HT signaling (excessive or deficient), mast cell/immune activation at the mucosa, microbiome dysbiosis, increased intestinal permeability, and CNS sensitization via HPA axis stress responses. No single mechanism explains all IBS subtypes.", examOnly: true },
    { question: "The role of enteric glial cells (EGCs) in gut homeostasis includes:", optionA: "Generating slow-wave pacemaker activity in the muscularis propria", optionB: "Structural support, trophic support for enteric neurons, maintenance of the epithelial barrier, and immunomodulation — EGC loss is associated with dysmotility and increased permeability", optionC: "Producing all the serotonin used by the enteric nervous system", optionD: "Forming the myelin sheath around enteric neuron axons", correctAnswer: "B", explanation: "EGCs (4:1 ratio over neurons) perform astrocyte-like functions in the gut: structural scaffolding, regulating synaptic neurotransmission, maintaining intestinal epithelial barrier integrity (via S-nitrosoglutathione and other factors), and modulating mucosal immune responses. Experimental EGC ablation causes severe intestinal inflammation and dysmotility.", examOnly: true },
    { question: "The pharmacological basis for using erythromycin as a prokinetic agent in gastroparesis is:", optionA: "It activates 5-HT4 receptors on ENS interneurons to enhance peristalsis", optionB: "It is a motilin receptor agonist — mimicking motilin to trigger phase III of the migrating motor complex and enhance gastric emptying", optionC: "It inhibits ENS enkephalins, releasing the inhibitory brake on GI motility", optionD: "It blocks muscarinic M2 receptors on the pylorus, causing pyloric relaxation", correctAnswer: "B", explanation: "Erythromycin (and other macrolide antibiotics) are motilin receptor agonists — they mimic motilin, the hormone that initiates phase III MMC activity. By activating motilin receptors on gastric enteric neurons and smooth muscle, they enhance gastric antral contractions and speed emptying. Used at sub-antibiotic doses for gastroparesis. Tachyphylaxis (receptor downregulation) limits long-term use.", examOnly: true },
    { question: "The descending inhibitory limb of the peristaltic reflex is mediated by which neurotransmitters?", optionA: "Acetylcholine and substance P", optionB: "Serotonin (5-HT3) and NPY", optionC: "Nitric oxide (NO) and VIP — causing smooth muscle relaxation below the bolus", optionD: "Enkephalins and GABA", correctAnswer: "C", explanation: "Descending inhibition (anal direction, below the bolus) is mediated by inhibitory enteric motor neurons releasing NO (via guanylyl cyclase → cGMP → smooth muscle relaxation) and VIP (via VPAC receptors → relaxation + secretion). This relaxation allows the bolus to advance. The ascending excitatory limb uses ACh + substance P.", examOnly: true },
    { question: "Psychological stress induces changes in gut function via which primary pathway?", optionA: "Activation of vagal efferents → direct enteric neuron depolarization", optionB: "HPA axis → CRF → alters ENS activity, increases mucosal permeability, activates mast cells → altered motility and visceral hypersensitivity", optionC: "Parasympathetic withdrawal → complete cessation of peristalsis", optionD: "Direct sympathetic activation of myenteric neurons via NE at β2 receptors", correctAnswer: "B", explanation: "Stress activates the HPA axis → CRF (corticotropin-releasing factor) acts on ENS neurons and mast cells to: accelerate colonic transit, increase intestinal permeability, activate mucosal mast cells → histamine and serotonin release → IPAN activation → altered visceral sensation. This neuro-immune-endocrine cascade explains stress-triggered IBS flares and functional gut symptoms.", examOnly: true },
    { question: "Small intestinal bacterial overgrowth (SIBO) most commonly results from impaired:", optionA: "Gastric acid secretion — allowing oral bacteria to survive in the stomach", optionB: "MMC-mediated 'housekeeper' contractions — the primary mechanism clearing bacteria from the small intestine between meals", optionC: "Colonic bacterial fermentation producing excess SCFAs that reflux", optionD: "Ileocecal valve function — allowing colonic bacteria to reflux into the ileum", correctAnswer: "B", explanation: "The MMC (especially phase III) is the primary defense against SIBO — sweeping bacteria and debris from the small intestine into the colon every ~90-120 minutes. Impaired MMC (from diabetes, opioids, scleroderma, anatomical stasis, post-surgical dysmotility) allows bacteria to accumulate → bloating, diarrhea, malabsorption, and gas. Gastric acid and ileocecal valve are also important but MMC is the key ENS mechanism.", examOnly: true },
    { question: "The involvement of substance P in visceral pain sensitization is significant because:", optionA: "Substance P inhibits IPAN activity, reducing visceral afferent signaling", optionB: "Substance P released from excitatory motor neurons and IPANs acts on NK1 receptors to promote mast cell degranulation, enhance nociceptor sensitivity, and contribute to central sensitization — elevated in IBS", optionC: "Substance P acts exclusively on smooth muscle to cause contraction without sensory effects", optionD: "Substance P is only relevant in the CNS spinal dorsal horn, not in the ENS", correctAnswer: "B", explanation: "Substance P (NK1 receptor agonist) in the gut: mediates ascending excitatory peristalsis, activates mast cells (degranulation → histamine → IPAN sensitization), and sensitizes nociceptive afferents contributing to visceral hyperalgesia. NK1 receptor antagonists have been explored for IBS and chemotherapy-induced nausea/vomiting.", examOnly: true },
  ];

  const allQs = [...regular, ...examOnly].map(q => ({ ...q, topicId }));
  const qs = await db.insert(quizQuestionsTable).values(allQs).returning();
  console.log(`✓ ${qs.length} questions`);

  const sgContent = `# Enteric Nervous System — Study Guide

## 1. What Is the Enteric Nervous System?

The **enteric nervous system (ENS)** is an intrinsic neural network embedded in the wall of the gastrointestinal tract — from the esophagus to the internal anal sphincter. It is the largest division of the peripheral nervous system and the most complex peripheral neural network.

| Feature | Detail |
|---|---|
| **Neuron count** | ~400-600 million (comparable to the spinal cord) |
| **Location** | Wall of the GI tract — esophagus to internal anal sphincter |
| **Independence** | Functions autonomously from the CNS (coordinates peristalsis after vagotomy) |
| **Neurotransmitters** | Same molecules as CNS — ACh, NO, serotonin, dopamine, GABA, neuropeptides |
| **Glial cells** | Enteric glial cells (astrocyte-like); 4:1 ratio over neurons |

---

## 2. The Two ENS Plexuses

| Feature | **Myenteric Plexus (Auerbach's)** | **Submucosal Plexus (Meissner's)** |
|---|---|---|
| **Location** | Between circular and longitudinal muscle layers | Within the submucosa |
| **Distribution** | Entire GI tract (esophagus to internal anal sphincter) | Prominent in small intestine; absent in esophagus |
| **Primary function** | Motility — coordinates peristalsis, MMC, segmentation | Secretion, absorption, mucosal blood flow regulation |
| **Neuron types** | Motor, sensory (IPANs), interneurons | Secretomotor neurons, sensory neurons, interneurons |

---

## 3. Enteric Neuron Types

| Type | Characteristics | Function |
|---|---|---|
| **IPANs** (intrinsic primary afferent neurons / AH neurons) | Pseudounipolar; long after-hyperpolarization (AH) | Detect mechanical distension, luminal chemical content and pH |
| **Ascending interneurons** | Oral direction | Relay excitatory signals above the bolus |
| **Descending interneurons** | Anal direction | Relay inhibitory signals below the bolus |
| **Excitatory motor neurons** | Release ACh + substance P | Circular muscle contraction |
| **Inhibitory motor neurons** | Release NO + VIP | Circular muscle relaxation |
| **Secretomotor neurons** | Release ACh, VIP | Stimulate mucosal secretion |

---

## 4. Key ENS Neurotransmitters

| Transmitter | Source | Receptor | Effect |
|---|---|---|---|
| **Acetylcholine (ACh)** | Excitatory motor neurons, secretomotor | Muscarinic (M3) | Smooth muscle contraction, secretion |
| **Substance P** | Excitatory motor neurons, IPANs | NK1 | Smooth muscle contraction; pro-inflammatory |
| **Nitric oxide (NO)** | Inhibitory motor neurons | cGMP ↑ | Smooth muscle relaxation (LES, pylorus, descending inhibition) |
| **VIP** | Inhibitory motor neurons | VPAC1/2 | Smooth muscle relaxation + secretion + vasodilation |
| **Serotonin (5-HT)** | Enterochromaffin (EC) cells | 5-HT3, 5-HT4 | Initiates peristaltic reflex; activates vagal afferents |
| **NPY** | Descending interneurons, sympathetics | Y1, Y2 | Inhibits secretion and motility; vasoconstriction |
| **Enkephalins** | ENS interneurons | Mu, delta opioid | Inhibit ACh release → reduce motility |
| **Motilin** | Enteroendocrine M cells | Motilin receptor | Initiates MMC phase III |

**Key fact:** ~90-95% of total body serotonin is stored in GI enterochromaffin cells — not enteric neurons.

---

## 5. The Peristaltic Reflex

The fundamental propulsive reflex — triggered by luminal distension or mucosal stimulation:

1. IPANs detect distension/chemical stimulus → EC cells release 5-HT
2. **Ascending (oral) excitation:** ACh + substance P → circular muscle contracts ABOVE bolus
3. **Descending (anal) inhibition:** NO + VIP → circular muscle relaxes BELOW bolus
4. Bolus propelled aborally

---

## 6. Migrating Motor Complex (MMC)

Cyclical pattern during fasting — repeats every ~90-120 minutes

| Phase | Activity | Duration |
|---|---|---|
| **I** | Quiescence | ~45-60 min |
| **II** | Increasing irregular contractions | ~30 min |
| **III (Housekeeper wave)** | Intense propulsive activity — sweeps bacteria + debris into colon | ~5-10 min |
| **IV** | Transition back to quiescence | Brief |

**Triggered by:** Motilin (hormone)
**Disrupted by:** Diabetes, opioids, scleroderma, post-surgical adhesions → SIBO

---

## 7. Special Cells

### Interstitial Cells of Cajal (ICCs)
- Location: Between muscle layers and within circular muscle
- Function: **GI tract pacemakers** — generate slow-wave basic electrical rhythm
- Mechanism: Coupled to smooth muscle via gap junctions; innervated by enteric neurons
- Clinical: ICC loss → gastroparesis (especially diabetic)

### Enteric Glial Cells (EGCs)
- Ratio: 4:1 over neurons
- Functions: Structural support, trophic support (like astrocytes), maintain epithelial barrier integrity, immunomodulation
- Clinical: EGC loss → dysmotility + increased intestinal permeability

---

## 8. The Gut-Brain Axis

**Bidirectional communication** between GI tract/ENS and CNS via multiple pathways:

| Direction | Pathways |
|---|---|
| **Gut → Brain** (dominant) | Vagal afferents (80% of vagal fibers), spinal afferents, hormones (ghrelin, CCK, leptin), immune cytokines, microbial metabolites (SCFAs, tryptophan) |
| **Brain → Gut** | Vagal efferents (20%), sympathetic efferents, HPA axis (CRF) |

**Brainstem relay:** Vagal afferents terminate in the **nucleus tractus solitarius (NTS)** → projects to hypothalamus, amygdala, parabrachial nucleus, reticular formation

### Gut Microbiome — ENS Interactions
- **SCFAs** (butyrate, propionate, acetate): colonocyte energy; support ENS neuron health; activate FFAR receptors on EECs and vagal afferents
- **Tryptophan → serotonin:** gut bacteria influence EC cell 5-HT production
- **Immune training:** microbiome shapes GALT (gut-associated lymphoid tissue)
- **Dysbiosis** → impaired SCFA production → altered ENS function, visceral hypersensitivity

---

## 9. ENS Development

- ENS originates from **neural crest cells** (primarily vagal, then sacral)
- Neural crest cells migrate craniocaudally through the developing gut
- Key molecular signals: **GDNF** (gut mesenchyme) → **Ret receptor** (neural crest cells) → migration, proliferation, survival
- **Failure:** Loss-of-function Ret mutations → Hirschsprung's disease

---

## 10. Clinical Conditions

### Hirschsprung's Disease
**Mechanism:** Failure of neural crest migration → aganglionosis (no ENS ganglia) in rectosigmoid → tonic contraction → functional obstruction → proximal megacolon
**Presentation:** Failure to pass meconium (newborn); chronic constipation; abdominal distension
**Treatment:** Surgical resection of aganglionic segment

### Achalasia
**Mechanism:** Autoimmune loss of inhibitory (NO-producing) neurons in myenteric plexus of LES and esophageal body → LES fails to relax → absent peristalsis
**Presentation:** Progressive dysphagia (solids > liquids initially), regurgitation, weight loss
**Diagnosis:** Esophageal manometry — absent peristalsis + incomplete LES relaxation

### Gastroparesis
**Mechanism:** Loss/dysfunction of ICCs + enteric neuron damage (especially in diabetes) → impaired slow-wave pacemaker activity + ENS dysmotility
**Presentation:** Nausea, vomiting, early satiety, bloating after meals
**Treatment:** Dietary modification; prokinetics (motilin agonists, 5-HT4 agonists)

### IBS (Irritable Bowel Syndrome)
**Mechanisms:** Visceral hypersensitivity (sensitized IPANs), altered 5-HT signaling, low-grade mucosal inflammation, microbiome dysbiosis, HPA axis sensitization, increased intestinal permeability

### Parkinson's Disease — ENS Involvement (Braak Hypothesis)
Alpha-synuclein accumulates in ENS years before substantia nigra → spreads via vagal afferents → brainstem → midbrain
GI symptoms (constipation, dysphagia) often precede motor symptoms by years

### Opioid-Induced Constipation
Mu opioid receptors on ENS neurons → inhibit ACh release → suppress peristalsis
Treated by peripheral opioid antagonists (methylnaltrexone) that do not cross BBB`;

  const [sg] = await db.insert(studyGuidesTable).values({ topicId, title: "Enteric Nervous System — Study Guide", content: sgContent }).returning();
  console.log(`✓ Study guide id=${sg.id}`);

  const [exam] = await db.insert(practiceExamsTable).values({ topicId, title: "Enteric Nervous System Practice Exam", timeLimit: 90, passingScore: 70 }).returning();
  const allQsFromDb = await db.select({ id: quizQuestionsTable.id }).from(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, topicId));
  await db.insert(practiceExamQuestionsTable).values(allQsFromDb.map((q, i) => ({ examId: exam.id, questionId: q.id, questionOrder: i + 1 })));
  console.log(`✓ Practice exam with ${allQsFromDb.length} questions`);

  console.log(`\n✅ ENS (topic ${topicId}) fully seeded!`);
}

seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
