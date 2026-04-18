import { db } from "./index";
import { eq } from "drizzle-orm";
import {
  topicsTable, flashcardsTable, quizQuestionsTable,
  studyGuidesTable, practiceExamsTable, practiceExamQuestionsTable,
} from "./schema";

async function seed() {
  console.log("Seeding Peripheral Nervous System topic...");

  const [topic] = await db.insert(topicsTable).values({
    name: "Peripheral Nervous System",
    category: "Neuroanatomy",
    description: "Structure and function of the PNS — somatic (sensory afferent and motor efferent) pathways, autonomic nervous system (sympathetic and parasympathetic divisions), neuromuscular junction, peripheral nerve anatomy, plexuses, dermatomes, and clinical neuropathies.",
  }).returning();

  const topicId = topic.id;
  console.log(`✓ Topic id=${topicId}`);

  const flashcards = [
    // PNS overview
    { question: "What structures comprise the peripheral nervous system (PNS)?", answer: "All nervous tissue OUTSIDE the brain and spinal cord: cranial nerve fibers (excluding CN II which is CNS), spinal nerve roots and ganglia, peripheral nerves (somatic and autonomic), and peripheral ganglia. The PNS connects the CNS to sensory receptors, muscles, and glands.", difficulty: "easy" },
    { question: "What are the two major divisions of the PNS?", answer: "1) Somatic PNS: voluntary sensory (afferent) and motor (efferent) control of skeletal muscle and skin — conscious. 2) Autonomic PNS (ANS): involuntary regulation of smooth muscle, cardiac muscle, glands, and visceral organs — further divided into sympathetic, parasympathetic, and enteric systems.", difficulty: "easy" },
    { question: "What glial cells support peripheral nerves (and how do they differ from CNS glia)?", answer: "Schwann cells: myelinate peripheral axons (one Schwann cell per internode); produce BDNF and form Bands of Büngner guiding axon regrowth after injury. Satellite cells: surround cell bodies in dorsal root and autonomic ganglia, regulate the microenvironment. Key difference from CNS: Schwann cells enable peripheral nerve regeneration (unlike oligodendrocytes in CNS).", difficulty: "medium" },
    { question: "What are the three connective tissue layers of a peripheral nerve and what do they contain?", answer: "1) Endoneurium: innermost; surrounds individual axons and their Schwann cells. 2) Perineurium: surrounds a fascicle (bundle of axons); provides a diffusion barrier (forms a blood-nerve barrier within fascicles). 3) Epineurium: outermost; surrounds the entire nerve trunk; contains vessels (vasa nervorum) and adipose tissue.", difficulty: "medium" },
    // Nerve fiber types
    { question: "What are the major peripheral nerve fiber types and their characteristics?", answer: "Classified by diameter/myelination: Aα (Ia, Ib): large myelinated (12-20 μm); fastest (70-120 m/s); muscle spindle afferents and motor to extrafusal muscle. Aβ: medium myelinated; touch and pressure. Aδ: small myelinated (2-5 μm); fast pain (sharp, pricking), cold temperature, pre-touch. B: small myelinated; autonomic preganglionic. C: unmyelinated (0.2-1.5 μm); slowest (0.5-2 m/s); slow/burning pain, warmth, postganglionic autonomic.", difficulty: "hard" },
    { question: "What distinguishes Aδ-mediated pain from C-fiber mediated pain clinically?", answer: "Aδ fibers: first pain — sharp, well-localized, pricking/stabbing sensation; rapidly transmitted (fast myelinated fibers). C fibers: second pain — burning, aching, poorly localized, persistent; slowly conducted (unmyelinated). The two-pain phenomenon: after a noxious stimulus, the sharp first pain (Aδ) arrives before the burning second pain (C fibers).", difficulty: "hard" },
    // Sensory afferent pathways
    { question: "What is the sensory (afferent) pathway and where are its cell bodies?", answer: "Sensory (afferent) neurons transmit information FROM the periphery (receptors) TO the CNS. Their cell bodies are located in the dorsal root ganglia (DRG) for spinal sensory neurons and in cranial nerve sensory ganglia (e.g., trigeminal ganglion, geniculate ganglion). They are pseudounipolar — a single axon bifurcates into a peripheral branch (to the receptor) and a central branch (entering the spinal cord).", difficulty: "medium" },
    { question: "What is the DCML pathway and where does it serve the face vs. body?", answer: "DCML (body): first-order DRG → dorsal columns (ipsilateral) → nucleus gracilis (lower body) / nucleus cuneatus (upper body) in medulla → sensory decussation (internal arcuate fibers) → medial lemniscus → VPL thalamus → S1 cortex. Face equivalent: trigeminal primary afferents → trigeminal sensory nucleus → trigeminothalamic tract → VPM thalamus → S1 face area.", difficulty: "hard" },
    { question: "What is the spinothalamic pathway and how does it cross?", answer: "Spinothalamic (body, pain/temperature/crude touch): first-order DRG → dorsal horn (Laminae I, II, V) → second-order neuron immediately crosses via anterior white commissure → ascends contralaterally in anterolateral column → VPL thalamus → S1 cortex. Crosses immediately in the cord — so a unilateral cord lesion causes contralateral pain/temperature loss below the lesion level.", difficulty: "hard" },
    { question: "What are the different types of peripheral sensory receptors?", answer: "Mechanoreceptors: Meissner's corpuscles (fine touch, moving stimuli), Merkel discs (sustained pressure, texture), Pacinian corpuscles (vibration, deep pressure), Ruffini endings (skin stretch). Proprioceptors: muscle spindles (length/stretch), Golgi tendon organs (tension/force). Thermoreceptors: warm receptors (C fibers, 30-45°C), cool receptors (Aδ). Nociceptors: free nerve endings (Aδ and C fibers); respond to thermal, mechanical, or chemical stimuli. Chemoreceptors: carotid and aortic bodies (O2/CO2).", difficulty: "hard" },
    { question: "What is a dermatome and why is it clinically important?", answer: "A dermatome is the region of skin innervated by a single spinal nerve root's sensory fibers. Key landmarks: C2-C3 = scalp/neck; C6 = thumb; C7 = middle finger; C8 = little finger; T4 = nipple line; T10 = umbilicus; L4 = medial leg and ankle; L5 = dorsum of foot and big toe; S1 = lateral foot and heel; S2-S4 = perineum ('saddle area'). Clinical: loss of sensation in a dermatomal pattern localizes to a specific root or spinal cord level.", difficulty: "medium" },
    { question: "What is a myotome?", answer: "A myotome is the group of muscles innervated by a single spinal nerve root. Key myotomes: C5 = shoulder abduction (deltoid); C6 = elbow flexion (biceps); C7 = elbow extension (triceps), wrist flexion; C8 = finger flexion; T1 = finger abduction; L2 = hip flexion; L3 = knee extension (quads); L4 = ankle dorsiflexion; L5 = great toe extension; S1 = ankle plantarflexion (gastrocnemius).", difficulty: "medium" },
    // Motor efferent
    { question: "What is the motor (efferent) pathway?", answer: "Motor efferent neurons transmit commands FROM the CNS TO effectors (muscles, glands). The somatic motor pathway: upper motor neurons (UMN) in motor cortex → corticospinal tract → anterior horn of spinal cord → lower motor neurons (LMN, alpha motor neurons) → ventral roots → peripheral nerves → neuromuscular junction → skeletal muscle. LMN cell bodies are in the anterior horn (spinal cord) or cranial nerve motor nuclei (brainstem).", difficulty: "medium" },
    { question: "What is the neuromuscular junction (NMJ) and how does it work?", answer: "The NMJ is the synapse between an alpha motor neuron axon terminal and a skeletal muscle fiber. Mechanism: action potential arrives → voltage-gated Ca2+ channels open → Ca2+ influx triggers vesicle fusion → acetylcholine (ACh) released into synaptic cleft → ACh binds nicotinic ACh receptors (nAChR, ionotropic) on motor end plate → Na+ influx → end-plate potential → muscle action potential → contraction. ACh is broken down by acetylcholinesterase (AChE) in the cleft.", difficulty: "medium" },
    { question: "What are the two types of motor neurons and what do they do?", answer: "Alpha (α) motor neurons: large; innervate extrafusal muscle fibers (the actual force-generating fibers); activation causes muscle contraction. Gamma (γ) motor neurons: smaller; innervate intrafusal fibers of muscle spindles; regulate spindle sensitivity during contraction — prevents spindle from 'going slack' during shortening (alpha-gamma coactivation), maintaining sensitivity to stretch throughout the movement range.", difficulty: "hard" },
    { question: "What is a motor unit?", answer: "A motor unit is a single alpha motor neuron and all the muscle fibers it innervates. Properties: small motor units (few fibers, slow-twitch oxidative, fatigue-resistant) are recruited first at low force levels; large motor units (many fibers, fast-twitch glycolytic, fatigue quickly) are recruited for higher forces. Orderly recruitment from small to large is Henneman's size principle.", difficulty: "medium" },
    // Reflexes
    { question: "What is the muscle stretch reflex (myotatic reflex) and what is its arc?", answer: "The muscle stretch reflex is a monosynaptic spinal reflex that resists sudden muscle lengthening. Arc: muscle stretch → Ia afferent (from muscle spindle) → dorsal root → anterior horn → directly synapses on alpha motor neuron → contraction of the same muscle (agonist). Simultaneously, Ia afferent via interneurons inhibits the antagonist muscle (reciprocal inhibition). Used clinically to test spinal cord integrity — biceps (C5-C6), triceps (C7), patellar (L2-L4), Achilles (S1-S2).", difficulty: "medium" },
    { question: "What is the Golgi tendon organ (GTO) reflex and what does it protect against?", answer: "The GTO is a Ib afferent receptor in tendons that detects muscle tension (not length). When tension is excessive: Ib afferents activate → inhibitory interneurons → alpha motor neuron inhibition of the same muscle → muscle relaxes (autogenic inhibition). This protects against excessive force and tendon rupture. GTOs are more sensitive to active contraction than passive stretch.", difficulty: "hard" },
    { question: "What is the withdrawal (flexor) reflex and what is its significance?", answer: "A polysynaptic reflex triggered by a noxious stimulus — flexor muscles contract to withdraw the limb from harm. Simultaneously, the crossed extensor reflex activates extensor muscles in the contralateral limb (to support body weight during withdrawal). The reflex involves multiple interneurons and can cross multiple spinal segments — it overrides voluntary motor commands at the spinal level.", difficulty: "medium" },
    // Plexuses
    { question: "What is the brachial plexus and what nerve roots form it?", answer: "The brachial plexus (C5-T1) is the network of nerves supplying the upper limb. Organization: roots → trunks (superior C5-C6, middle C7, inferior C8-T1) → divisions (anterior/posterior) → cords (lateral, medial, posterior) → terminal branches (musculocutaneous, median, ulnar, radial, axillary).", difficulty: "medium" },
    { question: "What are the clinical presentations of upper vs. lower brachial plexus injuries?", answer: "Upper plexus (C5-C6) = Erb-Duchenne palsy: shoulder abduction/external rotation and elbow flexion lost; 'waiter's tip' posture. Cause: traction during delivery, falls on shoulder. Lower plexus (C8-T1) = Klumpke's palsy: hand intrinsic muscles lost, claw hand deformity, Horner's syndrome (if T1 preganglionic sympathetic damaged). Cause: pulling on an abducted arm.", difficulty: "hard" },
    { question: "What are the main branches of the lumbosacral plexus?", answer: "Lumbar plexus (L1-L4): femoral nerve (L2-L4 — knee extension, anterior thigh sensation), obturator nerve (L2-L4 — hip adduction, medial thigh), lateral femoral cutaneous nerve (L2-L3), genitofemoral, ilioinguinal. Sacral plexus (L4-S3): sciatic nerve (L4-S3 — largest nerve in the body; posterior thigh, everything below knee); superior/inferior gluteal nerves; pudendal nerve (S2-S4 — perineum, sphincters).", difficulty: "hard" },
    // ANS
    { question: "What are the two main divisions of the autonomic nervous system?", answer: "1) Sympathetic ('fight or flight'): thoracolumbar outflow (T1-L2); short preganglionic axons → paravertebral/prevertebral ganglia → long postganglionic axons to target organs. 2) Parasympathetic ('rest and digest'): craniosacral outflow (CN III, VII, IX, X + S2-S4); long preganglionic axons → ganglia near/in target organs → short postganglionic axons.", difficulty: "easy" },
    { question: "What neurotransmitters does the autonomic nervous system use?", answer: "ALL preganglionic neurons (sympathetic and parasympathetic): release ACh → acts on nicotinic nAChRs on postganglionic neurons. Parasympathetic postganglionic: release ACh → acts on muscarinic receptors (M1-M5) on target organs. Sympathetic postganglionic: release norepinephrine (NE) → acts on adrenergic receptors (α1, α2, β1, β2) on target organs. EXCEPTIONS: sympathetic postganglionic to sweat glands (ACh → muscarinic); adrenal medulla (directly innervated by preganglionic → releases epinephrine + NE directly into blood).", difficulty: "hard" },
    { question: "What are adrenergic receptor subtypes and their major effects?", answer: "α1 (postsynaptic): vasoconstriction (blood vessels), pupil dilation (iris dilator), urethral contraction. α2 (presynaptic autoreceptor): inhibits NE release; also postsynaptic in some locations (platelet aggregation, insulin inhibition). β1: increased heart rate and contractility (cardiac); renin release (kidney). β2: bronchodilation (lung); vasodilation (skeletal muscle); glycogenolysis (liver); uterine relaxation. β3: lipolysis (adipose tissue).", difficulty: "hard" },
    { question: "What are muscarinic receptor subtypes and their major effects?", answer: "M1: CNS (cortex, hippocampus) and gastric parietal cells — cognitive function, acid secretion. M2: cardiac (SA and AV nodes) — slows heart rate, decreases conduction; presynaptic (inhibits ACh release). M3: smooth muscle contraction (GI, bladder detrusor), glandular secretion (salivary, lacrimal, sweat), pupil constriction (iris sphincter), ciliary muscle (accommodation). M4, M5: CNS roles.", difficulty: "hard" },
    { question: "What are the effects of sympathetic activation on major organ systems?", answer: "Cardiovascular: increased HR (β1), increased contractility (β1), vasoconstriction of skin/viscera (α1). Respiratory: bronchodilation (β2). GI: decreased motility and secretion (α2, β2); sphincter contraction (α1). Urinary: detrusor relaxation (β2), urethral sphincter contraction (α1). Eye: pupil dilation/mydriasis (α1 iris dilator), ciliary muscle relaxation/far vision (β). Metabolic: glycogenolysis (β2), lipolysis (β3), glucagon release, decreased insulin secretion (α2). Skin: piloerection (α1), sweat (ACh/muscarinic).", difficulty: "hard" },
    { question: "What are the effects of parasympathetic activation on major organ systems?", answer: "Cardiovascular: decreased HR, decreased AV conduction (M2 — vagal tone). GI: increased motility and secretion (M3), sphincter relaxation. Urinary: detrusor contraction/micturition (M3), urethral sphincter relaxation. Eye: pupil constriction/miosis (M3 iris sphincter), ciliary muscle contraction/accommodation for near vision (M3). Salivary/lacrimal/bronchial glands: increased secretion (M3). Sexual: erection (parasympathetic — 'point and shoot': parasympathetic = erection, sympathetic = ejaculation).", difficulty: "hard" },
    { question: "What is the sympathetic trunk and what does it consist of?", answer: "The sympathetic trunk (paravertebral chain) is a paired chain of ganglia running along both sides of the vertebral column from the cervical to the sacral region — 22-23 ganglia total. Each ganglion contains sympathetic postganglionic cell bodies. Preganglionic fibers from T1-L2 can synapse at their entry level, travel up or down the trunk to synapse at other levels, or pass through to reach collateral ganglia (celiac, superior/inferior mesenteric).", difficulty: "hard" },
    { question: "What is Horner's syndrome and what is the pathway disrupted?", answer: "Horner's syndrome: ipsilateral ptosis (drooping upper eyelid), miosis (small pupil), anhidrosis (no sweating, face), and apparent enophthalmos (sunken eye). Caused by interruption of the three-neuron sympathetic pathway at any point: 1st neuron (hypothalamus → ciliospinal center of Budge, C8-T2); 2nd neuron (exit spinal cord → over apex of lung → cervical sympathetic chain); 3rd neuron (with internal carotid artery → superior cervical ganglion → orbit). Causes: Pancoast tumor (2nd), carotid dissection (3rd), brainstem stroke (1st).", difficulty: "hard" },
    { question: "What is autonomic dysreflexia and what causes it?", answer: "A medical emergency occurring in patients with spinal cord injuries above T6 — a noxious stimulus below the injury (full bladder, bowel obstruction, pressure sore) triggers massive unmodulated sympathetic activation (hypertension, sweating, piloerection below lesion) with reflex bradycardia (baroreceptors activate parasympathetic). Dangerous: can cause intracranial hemorrhage. Treatment: identify/remove trigger; position upright; antihypertensives.", difficulty: "hard" },
    // Peripheral neuropathy
    { question: "What is the difference between axonal and demyelinating peripheral neuropathy?", answer: "Axonal neuropathy: primary axon loss — reduced amplitude on nerve conduction studies; denervation changes on EMG (fibrillations, positive sharp waves); slower, incomplete recovery. Demyelinating neuropathy: primary myelin loss — severely slowed conduction velocity; conduction block; normal or near-normal amplitudes; generally faster and more complete recovery (Schwann cells can remyelinate). Mixed patterns exist.", difficulty: "hard" },
    { question: "What is the difference between a mononeuropathy, mononeuritis multiplex, and polyneuropathy?", answer: "Mononeuropathy: single peripheral nerve affected (e.g., carpal tunnel = median nerve). Mononeuritis multiplex: multiple individual nerves affected in a non-systematic pattern — suggests vasculitis, diabetes, or sarcoidosis. Polyneuropathy: diffuse symmetric involvement, typically 'length-dependent' (stocking-glove distribution — longest axons affected first → starts in feet, ascends symmetrically). Causes: metabolic, toxic, hereditary, autoimmune.", difficulty: "hard" },
    { question: "What are the common causes of peripheral neuropathy?", answer: "Metabolic/endocrine: diabetes mellitus (most common in developed countries — both axonal and demyelinating), hypothyroidism, uremia. Nutritional: B12 deficiency (combined dorsal column and peripheral involvement), B1 (thiamine/beriberi), B6 toxicity. Toxic: alcohol, chemotherapy (cisplatin, paclitaxel), heavy metals (lead, arsenic). Inflammatory/immune: Guillain-Barré syndrome (acute demyelinating), chronic inflammatory demyelinating polyneuropathy (CIDP). Hereditary: Charcot-Marie-Tooth (most common hereditary neuropathy).", difficulty: "hard" },
    { question: "What is the craniosacral outflow of the parasympathetic nervous system?", answer: "Cranial parasympathetic: CN III (oculomotor) → ciliary ganglion → pupil constriction + accommodation. CN VII (facial) → pterygopalatine ganglion (lacrimal gland, nasal mucosa) and submandibular ganglion (submandibular/sublingual salivary glands). CN IX (glossopharyngeal) → otic ganglion → parotid gland. CN X (vagus) → ganglia in/near target organs of thorax and abdomen (heart, lungs, GI tract to splenic flexure). Sacral: S2-S4 → pelvic splanchnic nerves → pelvic organs (bladder, rectum, genitalia, descending colon).", difficulty: "hard" },
    { question: "What is the femoral nerve and what does it do?", answer: "Femoral nerve (L2-L4): the largest branch of the lumbar plexus — descends through the psoas muscle and exits below the inguinal ligament lateral to the femoral artery. Motor: quadriceps (knee extension), iliopsoas (hip flexion). Sensory: anterior thigh (anterior femoral cutaneous branches) and medial leg/foot (saphenous nerve — its longest branch, purely sensory). Injury: loss of knee extension and decreased knee reflex; anterior thigh numbness.", difficulty: "medium" },
    { question: "What is the sciatic nerve and its two major divisions?", answer: "The sciatic nerve (L4-S3) is the largest peripheral nerve in the body — runs through the greater sciatic foramen below piriformis, descends in the posterior thigh, and divides into: 1) Common fibular (peroneal) nerve — winds around the fibular head (vulnerable to compression); supplies foot dorsiflexors and evertors, and dorsal foot sensation. Injury → foot drop. 2) Tibial nerve — supplies posterior leg flexors (plantarflexion), and sole sensation. Injury → loss of plantarflexion.", difficulty: "medium" },
  ];

  const inserted = await db.insert(flashcardsTable).values(flashcards.map(f => ({ ...f, topicId }))).returning();
  console.log(`✓ ${inserted.length} flashcards`);

  const regular = [
    { question: "The cell bodies of primary sensory (afferent) neurons are located in the:", optionA: "Anterior horn of the spinal cord", optionB: "Dorsal root ganglia (and cranial nerve sensory ganglia)", optionC: "Paravertebral sympathetic chain ganglia", optionD: "Nucleus gracilis and cuneatus of the medulla", correctAnswer: "B", explanation: "Primary sensory neurons are pseudounipolar — their cell bodies are in the dorsal root ganglia (spinal) or cranial nerve sensory ganglia (trigeminal, geniculate, etc.). They send one process to the periphery (receptor) and one central process into the spinal cord or brainstem.", examOnly: false },
    { question: "Which peripheral nerve fiber type mediates fast, sharp, well-localized pain?", optionA: "C fibers (unmyelinated)", optionB: "Aα fibers (large myelinated)", optionC: "Aδ fibers (small myelinated)", optionD: "B fibers (small myelinated autonomic)", correctAnswer: "C", explanation: "Aδ fibers are thinly myelinated (fast), mediating the first pain — sharp, pricking, well-localized. C fibers mediate second pain — burning, poorly localized, persistent. Aα fibers transmit proprioception and motor commands, not pain.", examOnly: false },
    { question: "All preganglionic autonomic neurons (both sympathetic and parasympathetic) release which neurotransmitter?", optionA: "Norepinephrine", optionB: "Acetylcholine", optionC: "Dopamine", optionD: "Serotonin", correctAnswer: "B", explanation: "A critical rule: ALL preganglionic neurons (sympathetic and parasympathetic) release acetylcholine onto nicotinic receptors on postganglionic neurons. Postganglionic neurons then differentiate: parasympathetic releases ACh (muscarinic) and sympathetic releases NE (adrenergic) — except sweat glands (ACh/muscarinic).", examOnly: false },
    { question: "Parasympathetic stimulation of the eye causes:", optionA: "Pupil dilation (mydriasis) and relaxation of the ciliary muscle", optionB: "Pupil constriction (miosis) and contraction of the ciliary muscle for near vision", optionC: "Pupil dilation and ciliary muscle contraction", optionD: "No effect on the eye — only sympathetic innervation affects the eye", correctAnswer: "B", explanation: "Parasympathetic (M3 receptors): iris sphincter → pupil constriction (miosis); ciliary muscle contraction → lens thickens → accommodation for near vision. Sympathetic: iris dilator → mydriasis; ciliary muscle relaxation → far vision.", examOnly: false },
    { question: "A patient has ipsilateral ptosis, miosis, and anhidrosis of the face. This is:", optionA: "Third nerve palsy from uncal herniation", optionB: "Horner's syndrome from disruption of the sympathetic pathway", optionC: "Facial nerve (CN VII) palsy", optionD: "Parasympathetic over-activation from a vagal tumor", correctAnswer: "B", explanation: "Horner's syndrome (ptosis, miosis, anhidrosis, apparent enophthalmos) results from loss of sympathetic innervation to the eye and face. Sympathetics normally dilate the pupil, keep the eyelid elevated (Müller's muscle), and regulate facial sweating.", examOnly: false },
    { question: "Which dermatome level corresponds to the umbilicus?", optionA: "T4", optionB: "T6", optionC: "T10", optionD: "L1", correctAnswer: "C", explanation: "Key dermatomal landmarks: T4 = nipples; T10 = umbilicus; L1 = inguinal ligament; L4 = medial knee/ankle; S1 = lateral foot. These are essential for localizing spinal cord injury levels and thoracic nerve root lesions.", examOnly: false },
    { question: "The muscle stretch reflex is monosynaptic. This means:", optionA: "It has only one synapse — between the Ia afferent and the alpha motor neuron", optionB: "It involves only one muscle", optionC: "It is mediated by a single muscle spindle", optionD: "It does not cross the spinal cord midline", correctAnswer: "A", explanation: "The stretch reflex arc has exactly one central synapse: the Ia afferent (from the muscle spindle) directly synapses on the alpha motor neuron in the anterior horn, causing the same muscle to contract. This makes it the fastest spinal reflex. Reciprocal inhibition of the antagonist involves an additional interneuron.", examOnly: false },
    { question: "Upper brachial plexus injury (Erb-Duchenne palsy) characteristically presents with:", optionA: "Claw hand deformity and Horner's syndrome", optionB: "'Waiter's tip' posture — shoulder adducted/internally rotated, elbow extended and pronated", optionC: "Loss of finger flexion and wrist drop", optionD: "Pure sensory loss of the medial arm and forearm", correctAnswer: "B", explanation: "C5-C6 injury (Erb-Duchenne): deltoid (shoulder abduction), biceps (elbow flexion/supination), and brachioradialis are lost. The unopposed muscles produce the 'waiter's tip' — arm hangs with shoulder internally rotated/adducted, elbow extended, forearm pronated. Common in birth trauma and falls on the shoulder.", examOnly: false },
    { question: "Sympathetic postganglionic neurons release which neurotransmitter onto smooth muscle and cardiac muscle?", optionA: "Acetylcholine (muscarinic)", optionB: "Acetylcholine (nicotinic)", optionC: "Norepinephrine (adrenergic)", optionD: "Dopamine", correctAnswer: "C", explanation: "Sympathetic postganglionic neurons release norepinephrine (NE) onto adrenergic receptors (α1, α2, β1, β2). Exception: postganglionic sympathetic fibers to sweat glands are cholinergic (ACh → muscarinic receptors). The adrenal medulla is directly innervated by sympathetic preganglionic neurons, releasing EPI and NE into the bloodstream.", examOnly: false },
    { question: "In an axonal peripheral neuropathy, nerve conduction studies typically show:", optionA: "Severely reduced conduction velocity with normal amplitude", optionB: "Conduction block at sites of compression", optionC: "Reduced amplitude with relatively preserved conduction velocity", optionD: "Normal results because axonal neuropathy does not affect conduction", correctAnswer: "C", explanation: "Axonal neuropathy: loss of axons reduces the compound action potential amplitude (fewer axons carrying the signal). Conduction velocity is relatively preserved in the surviving axons because myelin is intact. Demyelinating neuropathy shows severely slowed conduction velocity due to loss of saltatory conduction.", examOnly: false },
  ];

  const examOnly = [
    { question: "The alpha-gamma coactivation during voluntary movement serves to:", optionA: "Prevent the Golgi tendon organ from triggering inhibition", optionB: "Keep the muscle spindle sensitive to stretch throughout the range of motion by simultaneously activating intrafusal fibers", optionC: "Activate the crossed extensor reflex during voluntary movement", optionD: "Produce reciprocal inhibition of the antagonist muscle", correctAnswer: "B", explanation: "During voluntary contraction, the CNS simultaneously activates alpha motor neurons (extrafusal fibers → force production) and gamma motor neurons (intrafusal fibers → maintain spindle tension). Without gamma coactivation, shortening would cause the spindle to go slack and become unresponsive to stretch — eliminating proprioceptive feedback needed for smooth movement.", examOnly: true },
    { question: "The difference between Ia and Ib afferents is:", optionA: "Ia fibers come from Golgi tendon organs; Ib from muscle spindles", optionB: "Ia fibers come from primary muscle spindle endings (velocity-sensitive); Ib fibers come from Golgi tendon organs (tension-sensitive)", optionC: "Both come from muscle spindles but respond to different stimulus intensities", optionD: "Ia fibers are unmyelinated; Ib fibers are myelinated", correctAnswer: "B", explanation: "Ia (primary spindle afferents): large myelinated, sensitive to both static length AND dynamic changes in length (velocity). Ib (GTO afferents): monitor muscle tension — active during active contraction. Ia → monosynaptic stretch reflex. Ib → autogenic inhibition (Ib inhibitory interneuron → same muscle). Both are group A (fast myelinated).", examOnly: true },
    { question: "What is the consequence of common fibular (peroneal) nerve injury at the fibular head?", optionA: "Loss of plantarflexion and sole sensation", optionB: "Foot drop (loss of dorsiflexion and eversion) and sensory loss over the dorsum of the foot and lateral leg", optionC: "Loss of knee extension and anterior thigh sensation", optionD: "Claw toe deformity and loss of intrinsic foot muscles", correctAnswer: "B", explanation: "The common fibular nerve winds around the fibular neck (vulnerable to compression from casts, prolonged squatting). Its branches supply: deep fibular → dorsiflexion (tibialis anterior) and toe extension; superficial fibular → eversion and dorsal foot sensation. Injury produces foot drop (high-stepping gait) and loss of dorsal foot/lateral leg sensation.", examOnly: true },
    { question: "Autonomic dysreflexia in a patient with T4 spinal cord injury is triggered by a distended bladder. The mechanism of hypertension is:", optionA: "Parasympathetic overstimulation of the heart below the lesion", optionB: "Unmodulated sympathetic activation below the lesion level — because descending inhibitory control from supraspinal centers is cut off by the injury", optionC: "Loss of baroreceptor function below the injury level", optionD: "Direct pressure on the aorta from spinal cord edema", correctAnswer: "B", explanation: "With injury above T6, supraspinal inhibitory control of the sympathetic preganglionic neurons (T1-L2) is disrupted. A noxious stimulus below the lesion triggers reflex sympathetic activation (vasoconstriction, hypertension) that cannot be modulated by descending pathways. Baroreceptors sense the hypertension and activate parasympathetic (bradycardia), but cannot effectively lower BP because sympathetic outflow is uncontrolled.", examOnly: true },
    { question: "Why is Guillain-Barré syndrome (GBS) classified as a demyelinating peripheral neuropathy?", optionA: "It destroys dorsal root ganglion neurons", optionB: "Autoimmune attack targets Schwann cell myelin → markedly slowed nerve conduction velocities with conduction block, while axons are relatively spared initially", optionC: "It causes axonal loss that is more severe distally than proximally", optionD: "It demyelinates CNS pathways including the dorsal columns", correctAnswer: "B", explanation: "GBS (specifically AIDP — the most common form) involves molecular mimicry triggering autoimmune attack on peripheral myelin (Schwann cells). NCS shows markedly slowed conduction velocities, conduction blocks, prolonged distal latencies — characteristic of demyelinating neuropathy. AMAN (axonal variant) targets nodes of Ranvier and axolemma instead.", examOnly: true },
    { question: "The vagus nerve (CN X) provides parasympathetic innervation to the GI tract up to which landmark?", optionA: "Ileocecal valve", optionB: "Mid-transverse colon (splenic flexure)", optionC: "Sigmoid colon", optionD: "Entire GI tract to the internal anal sphincter", correctAnswer: "B", explanation: "The vagus nerve (cranial parasympathetic) innervates the GI tract from the esophagus to approximately the splenic flexure (mid-transverse colon). Beyond that — the descending colon, sigmoid, rectum, and internal anal sphincter — parasympathetic supply comes from the sacral parasympathetic (S2-S4) via the pelvic splanchnic nerves.", examOnly: true },
    { question: "A patient taking a non-selective beta-blocker who has asthma would be at risk for bronchospasm because:", optionA: "Beta-blockers activate α1 receptors on bronchial smooth muscle", optionB: "Beta-2 receptors on bronchial smooth muscle are blocked, preventing sympathetic bronchodilation and allowing unopposed parasympathetic bronchoconstriction", optionC: "Beta-blockers increase acetylcholine release from parasympathetic postganglionic neurons", optionD: "Beta-blockers directly contract bronchial smooth muscle via β2 receptor-mediated contraction", correctAnswer: "B", explanation: "Sympathetic activation of β2 receptors produces bronchodilation. Non-selective beta-blockade (blocking both β1 and β2) removes this bronchodilatory tone, leaving unopposed parasympathetic (M3-mediated) bronchoconstriction — dangerous in asthma. Cardioselective beta-blockers (β1-selective) are preferred when beta-blockade is needed in asthma patients.", examOnly: true },
    { question: "Which receptor subtype mediates the decrease in heart rate with parasympathetic activation?", optionA: "Nicotinic nAChR on the SA node", optionB: "M2 (muscarinic) receptors on the SA and AV nodes", optionC: "M3 (muscarinic) receptors on cardiac myocytes", optionD: "β1 adrenergic receptors inhibited by acetylcholine", correctAnswer: "B", explanation: "Vagal parasympathetic activation releases ACh → binds M2 (muscarinic) receptors on SA node (slows pacemaker rate) and AV node (increases PR interval, slows conduction). M2 couples to Gi → inhibits adenylyl cyclase → decreases cAMP → hyperpolarizes pacemaker cells via IKACh channels.", examOnly: true },
    { question: "In a demyelinating polyneuropathy, which nerve conduction study finding is most characteristic?", optionA: "Reduced compound muscle action potential amplitude with normal conduction velocity", optionB: "Markedly slowed nerve conduction velocities, prolonged distal latencies, and conduction block", optionC: "Fibrillation potentials and positive sharp waves on EMG", optionD: "Normal sensory and motor conduction studies with abnormal EMG only", correctAnswer: "B", explanation: "Demyelinating neuropathies (GBS, CIDP, CMT) lose saltatory conduction → markedly slowed velocities, prolonged distal latencies, and conduction block. Amplitude is relatively preserved (axons intact). Axonal neuropathies show reduced amplitude with relatively normal velocities. EMG fibrillations/PSWs indicate axonal denervation — seen in axonal, not pure demyelinating.", examOnly: true },
    { question: "The adrenal medulla is unique in the sympathetic nervous system because:", optionA: "It is innervated by postganglionic sympathetic neurons", optionB: "It is directly innervated by preganglionic cholinergic neurons and releases epinephrine (and NE) into the bloodstream, acting as a neuroendocrine organ", optionC: "It releases norepinephrine exclusively and does not release epinephrine", optionD: "It is under parasympathetic (vagal) control", correctAnswer: "B", explanation: "The adrenal medulla is embryologically derived from neural crest cells and is considered a modified sympathetic ganglion. Preganglionic cholinergic fibers (from the splanchnic nerves) synapse directly on chromaffin cells → release ~80% epinephrine + ~20% NE into the bloodstream, producing systemic 'fight-or-flight' responses.", examOnly: true },
    { question: "The crossed extensor reflex is associated with which primary reflex?", optionA: "Stretch reflex (myotatic reflex)", optionB: "Withdrawal (flexor) reflex — as one limb withdraws, the contralateral limb extends to bear weight", optionC: "Babinski reflex in response to plantar stimulation", optionD: "Blink reflex in response to corneal stimulation", correctAnswer: "B", explanation: "When the withdrawal reflex flexes one limb away from a painful stimulus, the crossed extensor reflex simultaneously activates extensor muscles in the opposite limb to maintain posture and support body weight. This is mediated by commissural interneurons crossing the cord midline.", examOnly: true },
    { question: "Klumpke's palsy from lower brachial plexus injury (C8-T1) characteristically presents with:", optionA: "Deltoid weakness and loss of shoulder abduction", optionB: "Intrinsic hand muscle weakness (claw hand) and Horner's syndrome if T1 root is avulsed", optionC: "Loss of elbow flexion and decreased biceps reflex", optionD: "Wrist drop from radial nerve involvement", correctAnswer: "B", explanation: "C8-T1 (lower plexus / Klumpke's palsy): loss of intrinsic hand muscles (interossei, lumbricals) → weak grip, claw hand (hyperextended MCPs, flexed IPs). If T1 root is involved, preganglionic sympathetic fibers to the face are damaged → Horner's syndrome (ptosis, miosis, anhidrosis). Caused by traction on an abducted arm.", examOnly: true },
  ];

  const allQs = [...regular, ...examOnly].map(q => ({ ...q, topicId }));
  const qs = await db.insert(quizQuestionsTable).values(allQs).returning();
  console.log(`✓ ${qs.length} questions`);

  const sgContent = `# Peripheral Nervous System — Study Guide

## 1. PNS Overview

The **peripheral nervous system (PNS)** includes all nervous tissue outside the CNS: cranial nerve fibers (CN I-XII, except CN II which is CNS), spinal nerve roots and ganglia, peripheral nerves, and peripheral ganglia.

**Two main divisions:**
1. **Somatic PNS:** Sensory (afferent) + motor (efferent) — voluntary, conscious
2. **Autonomic PNS (ANS):** Sympathetic, parasympathetic, enteric — involuntary

**Supporting cells:**
- **Schwann cells:** Myelinate peripheral axons; enable regeneration after injury (Bands of Büngner)
- **Satellite cells:** Surround cell bodies in sensory and autonomic ganglia

**Peripheral nerve layers:** Endoneurium (individual axon) → Perineurium (fascicle) → Epineurium (entire nerve)

---

## 2. Peripheral Nerve Fiber Types

| Type | Diameter | Myelination | Speed | Function |
|---|---|---|---|---|
| **Aα (Ia/Ib)** | 12-20 μm | Heavy | 70-120 m/s | Muscle spindle afferents, motor to extrafusal fibers |
| **Aβ** | 6-12 μm | Moderate | 30-70 m/s | Fine touch, pressure |
| **Aδ** | 2-5 μm | Light | 5-30 m/s | Fast/sharp pain (first pain), cold temperature |
| **B** | <3 μm | Light | 3-15 m/s | Autonomic preganglionic |
| **C** | 0.2-1.5 μm | None | 0.5-2 m/s | Slow/burning pain (second pain), warmth, postganglionic |

**Two-pain phenomenon:** Noxious stimulus → sharp pricking pain (Aδ, fast) followed by burning aching pain (C fibers, slow)

---

## 3. Somatic Sensory (Afferent) System

### Cell Bodies
Primary sensory neurons are **pseudounipolar** — cell bodies in **dorsal root ganglia** (spinal) or **cranial nerve sensory ganglia** (trigeminal, geniculate, etc.)

### Sensory Receptors

| Receptor | Type | Stimulus |
|---|---|---|
| **Meissner's corpuscles** | Mechanoreceptor | Fine touch, moving stimuli, fingertips |
| **Merkel discs** | Mechanoreceptor | Sustained pressure, texture, edges |
| **Pacinian corpuscles** | Mechanoreceptor | Vibration, deep pressure |
| **Ruffini endings** | Mechanoreceptor | Skin stretch |
| **Muscle spindles (Ia)** | Proprioceptor | Muscle length and velocity |
| **Golgi tendon organs (Ib)** | Proprioceptor | Muscle tension |
| **Free nerve endings (Aδ, C)** | Nociceptor/thermoreceptor | Pain, temperature |

### Ascending Sensory Pathways

| Pathway | Modality | 1st-order | Where it crosses | Projects to |
|---|---|---|---|---|
| **DCML** | Fine touch, vibration, proprioception | DRG → dorsal columns (ipsilateral) | Medulla (nucleus gracilis/cuneatus → internal arcuate fibers) | VPL → S1 |
| **Spinothalamic** | Pain, temperature, crude touch | DRG → dorsal horn | Immediately (anterior white commissure) | VPL → S1 |

### Key Dermatomes
| Level | Landmark |
|---|---|
| C6 | Thumb |
| C7 | Middle finger |
| C8 | Little finger |
| T4 | Nipple line |
| T10 | Umbilicus |
| L4 | Medial leg and ankle |
| L5 | Dorsum of foot / big toe |
| S1 | Lateral foot and heel |
| S2-S4 | Perineum (saddle area) |

---

## 4. Somatic Motor (Efferent) System

### Motor Pathway
Motor cortex (UMN) → corticospinal tract → anterior horn (LMN / alpha motor neuron) → ventral root → peripheral nerve → NMJ → skeletal muscle

### Neuromuscular Junction
Action potential → Ca²⁺ influx → ACh release → nicotinic nAChRs on end plate → Na⁺ influx → muscle action potential → contraction. ACh broken down by acetylcholinesterase.

### Motor Neuron Types
- **Alpha (α):** Innervate extrafusal fibers; force production
- **Gamma (γ):** Innervate intrafusal fibers; regulate spindle sensitivity during contraction (alpha-gamma coactivation)

### Henneman's Size Principle
Small (slow, fatigue-resistant) motor units recruited first → large (fast, fatiguable) recruited for high force demands

### Reflexes

| Reflex | Arc | Function |
|---|---|---|
| **Stretch (myotatic)** | Ia afferent → monosynaptic → alpha motor neuron | Resist sudden muscle lengthening |
| **GTO (inverse stretch)** | Ib afferent → Ib inhibitory interneuron → alpha MN inhibition | Prevent excessive tension / protect tendon |
| **Withdrawal (flexor)** | Polysynaptic; noxious stimulus → flexion | Withdraw limb from harm |
| **Crossed extensor** | Accompanies withdrawal; contralateral extension | Maintain posture during withdrawal |

---

## 5. Major Peripheral Plexuses

### Brachial Plexus (C5-T1)
Roots → Trunks (Superior C5-C6, Middle C7, Inferior C8-T1) → Divisions → Cords (Lateral, Medial, Posterior) → Branches

| Injury | Roots | Posture / Signs |
|---|---|---|
| **Erb-Duchenne** | C5-C6 | Waiter's tip — shoulder adducted/internally rotated, elbow extended |
| **Klumpke's** | C8-T1 | Claw hand; Horner's if T1 avulsed |

### Lumbosacral Plexus

| Nerve | Roots | Motor | Sensory |
|---|---|---|---|
| **Femoral** | L2-L4 | Quadriceps (knee extension), iliopsoas | Anterior thigh, medial leg (saphenous) |
| **Obturator** | L2-L4 | Hip adductors | Medial thigh |
| **Sciatic** | L4-S3 | Hamstrings, all below knee | Posterior thigh, all below knee |
| **Common fibular** | L4-S2 | Dorsiflexion, eversion | Dorsal foot, lateral leg → foot drop if injured |
| **Tibial** | L4-S3 | Plantarflexion, toe flexion | Sole of foot |
| **Pudendal** | S2-S4 | External sphincters | Perineum |

---

## 6. Autonomic Nervous System

### Overview

| Feature | Sympathetic | Parasympathetic |
|---|---|---|
| **Outflow** | Thoracolumbar (T1-L2) | Craniosacral (CN III, VII, IX, X; S2-S4) |
| **Preganglionic** | Short | Long |
| **Postganglionic** | Long | Short |
| **Ganglia location** | Paravertebral chain + collateral ganglia | Near or within target organ |
| **Response** | Fight or flight | Rest and digest |

### Neurotransmitters

| Neuron | Transmitter | Receptor |
|---|---|---|
| All preganglionic (sympathetic + parasympathetic) | ACh | Nicotinic (nAChR) |
| Parasympathetic postganglionic | ACh | Muscarinic (M1-M5) |
| Sympathetic postganglionic (most) | Norepinephrine | Adrenergic (α1, α2, β1, β2) |
| Sympathetic → sweat glands (exception) | ACh | Muscarinic |
| Adrenal medulla (chromaffin cells) | Epinephrine + NE | Bloodstream → all adrenergic |

### Adrenergic Receptors
- **α1:** Vasoconstriction, mydriasis, urethral contraction
- **α2:** Presynaptic autoreceptor (inhibits NE); platelet aggregation
- **β1:** ↑HR, ↑contractility (heart), renin (kidney)
- **β2:** Bronchodilation, vasodilation (skeletal muscle), glycogenolysis
- **β3:** Lipolysis (adipose)

### Muscarinic Receptors
- **M1:** CNS, gastric acid
- **M2:** Cardiac (SA/AV) → ↓HR, ↓conduction; presynaptic (Gi)
- **M3:** Smooth muscle contraction (bladder, GI), glands (salivary, lacrimal), miosis, accommodation

### Sympathetic vs. Parasympathetic Effects

| Organ | Sympathetic | Parasympathetic |
|---|---|---|
| **Heart** | ↑HR, ↑contractility (β1) | ↓HR (M2) |
| **Bronchi** | Dilation (β2) | Constriction (M3) |
| **GI motility** | ↓ (α2, β) | ↑ (M3) |
| **Bladder detrusor** | Relaxation (β2) | Contraction (M3) |
| **Urethral sphincter** | Contraction (α1) | Relaxation |
| **Eye — pupil** | Mydriasis (α1 iris dilator) | Miosis (M3 iris sphincter) |
| **Eye — ciliary** | Relaxation / far vision (β) | Contraction / near vision (M3) |
| **Sexual** | Ejaculation | Erection |

### Craniosacral Parasympathetic Outflow

| CN | Ganglion | Target |
|---|---|---|
| CN III | Ciliary ganglion | Iris sphincter (miosis), ciliary muscle (accommodation) |
| CN VII | Pterygopalatine ganglion | Lacrimal gland, nasal mucosa |
| CN VII | Submandibular ganglion | Submandibular + sublingual glands |
| CN IX | Otic ganglion | Parotid gland |
| CN X (vagus) | Terminal ganglia in/near organs | Heart, lungs, GI to splenic flexure |
| S2-S4 | Pelvic ganglia | Descending colon, rectum, bladder, genitalia |

---

## 7. Clinical Conditions

### Horner's Syndrome
Ipsilateral ptosis, miosis, anhidrosis — 3-neuron sympathetic chain disruption
1st neuron: hypothalamus → C8-T2 (stroke, MS)
2nd neuron: cord → over lung apex → cervical chain (Pancoast tumor)
3rd neuron: superior cervical ganglion → orbit (carotid dissection, cavernous sinus)

### Autonomic Dysreflexia
Spinal cord injury above T6 → noxious stimulus → unmodulated sympathetic hypertension + reflex bradycardia → medical emergency

### Peripheral Neuropathy Types

| Type | Nerve Conduction | EMG | Recovery |
|---|---|---|---|
| **Axonal** | ↓ Amplitude, normal velocity | Fibrillations, PSWs | Slow, incomplete |
| **Demyelinating** | Severely ↓ velocity, prolonged latency, conduction block | Often normal early | Faster (Schwann cells remyelinate) |

**Common causes:** Diabetes (most common), B12 deficiency, alcohol, GBS (acute demyelinating), CIDP (chronic demyelinating), hereditary (Charcot-Marie-Tooth)`;

  const [sg] = await db.insert(studyGuidesTable).values({ topicId, title: "Peripheral Nervous System — Study Guide", content: sgContent }).returning();
  console.log(`✓ Study guide id=${sg.id}`);

  const [exam] = await db.insert(practiceExamsTable).values({ topicId, title: "Peripheral Nervous System Practice Exam", timeLimit: 90, passingScore: 70 }).returning();
  const allQsFromDb = await db.select({ id: quizQuestionsTable.id }).from(quizQuestionsTable).where(eq(quizQuestionsTable.topicId, topicId));
  await db.insert(practiceExamQuestionsTable).values(allQsFromDb.map((q, i) => ({ examId: exam.id, questionId: q.id, questionOrder: i + 1 })));
  console.log(`✓ Practice exam with ${allQsFromDb.length} questions`);

  console.log(`\n✅ PNS (topic ${topicId}) fully seeded!`);
}

seed().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
