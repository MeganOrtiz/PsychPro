import { db } from "./index";
import {
  topicsTable,
  flashcardsTable,
  quizQuestionsTable,
  studyGuidesTable,
  practiceExamsTable,
  practiceExamQuestionsTable,
} from "./schema";

async function addFoundationTopics() {
  console.log("Adding Brain Structures, Cranial Nerves, and Vascular System of the Brain topics...");

  const topics = await db.insert(topicsTable).values([
    { name: "Brain Structures", category: "Foundations", description: "Major cortical regions, lobes, subcortical structures, brainstem, cerebellum, and white matter pathways — the essential anatomical map of the brain." },
    { name: "Cranial Nerves", category: "Foundations", description: "All 12 cranial nerves — their fiber types, functions, clinical testing, and lesion syndromes essential for neurological examination." },
    { name: "Vascular System of the Brain", category: "Foundations", description: "Cerebral blood supply, the Circle of Willis, arterial territories, venous drainage, and stroke syndromes of the anterior and posterior circulations." },
  ]).returning();

  const T: Record<string, number> = {};
  topics.forEach(t => { T[t.name] = t.id; });

  // ===========================================================================
  // FLASHCARDS
  // ===========================================================================
  const flashcards = [
    // ===== BRAIN STRUCTURES (50) =====
    { topicId: T["Brain Structures"], question: "What are the four lobes of the cerebral cortex?", answer: "Frontal (executive, motor), Parietal (somatosensory, spatial), Temporal (auditory, memory, language), and Occipital (visual processing). Each lobe has distinct primary and association areas.", difficulty: "easy" },
    { topicId: T["Brain Structures"], question: "What is the central sulcus and why is it important?", answer: "The groove separating the frontal and parietal lobes. The precentral gyrus (anterior) is the primary motor cortex (M1); the postcentral gyrus (posterior) is the primary somatosensory cortex (S1).", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is Broca's area and what happens when it is damaged?", answer: "Broca's area (BA 44/45) is in the left inferior frontal gyrus. It controls speech production and motor programming of language. Damage causes Broca's aphasia — nonfluent, effortful speech with preserved comprehension.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is Wernicke's area and what happens when it is damaged?", answer: "Wernicke's area (BA 22) is in the posterior superior temporal gyrus of the left hemisphere. It processes language comprehension. Damage causes Wernicke's aphasia — fluent but meaningless speech with poor comprehension.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the primary motor cortex (M1) and how is it organized?", answer: "Located in the precentral gyrus. Controls voluntary movement with contralateral somatotopic organization — the 'motor homunculus.' Hands, face, and lips have disproportionately large representations reflecting motor precision demands.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the Sylvian fissure (lateral sulcus)?", answer: "The deep groove separating the frontal and parietal lobes (above) from the temporal lobe (below). The insula lies deep within it, and it marks the location of key language areas (Broca's, Wernicke's).", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the insula and what are its functions?", answer: "Cortex buried deep in the Sylvian fissure. Involved in interoception, taste, pain, emotional awareness, autonomic regulation, and language. Implicated in addiction (craving) and empathy.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What does the parietal lobe do?", answer: "Processes somatosensory information (postcentral gyrus), integrates multimodal sensory input, mediates spatial attention and visuospatial skills, supports calculation and reading. Right parietal damage → hemispatial neglect.", difficulty: "easy" },
    { topicId: T["Brain Structures"], question: "What is Gerstmann's syndrome?", answer: "Caused by left angular gyrus (inferior parietal) damage. Four features: acalculia, agraphia, finger agnosia (cannot name/identify fingers), and left-right disorientation.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is the temporal lobe responsible for?", answer: "Auditory processing (Heschl's gyri), language comprehension (Wernicke's area), episodic memory (hippocampus), face recognition (fusiform gyrus), and object recognition (inferior temporal). Medial temporal lobe is critical for memory.", difficulty: "easy" },
    { topicId: T["Brain Structures"], question: "What is the hippocampus and what does it do?", answer: "Seahorse-shaped structure in the medial temporal lobe. Essential for encoding new explicit (declarative) memories — episodic and semantic. Bilateral hippocampal damage causes severe anterograde amnesia (as in patient H.M.).", difficulty: "easy" },
    { topicId: T["Brain Structures"], question: "What is the amygdala and what does it do?", answer: "Almond-shaped medial temporal lobe structure critical for emotional processing — especially fear conditioning, threat detection, and emotional memory enhancement. Bilateral damage causes Klüver-Bucy syndrome (loss of fear, hypersexuality, hyperphagia).", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What does the occipital lobe do?", answer: "Houses primary visual cortex (V1) in the calcarine fissure — processes basic visual features (edges, color, motion). Extrastriate areas (V2–V5) process progressively complex visual information. Bilateral V1 damage → cortical blindness.", difficulty: "easy" },
    { topicId: T["Brain Structures"], question: "What are the dorsal and ventral visual streams?", answer: "Dorsal ('where/how') stream: V1 → parietal lobe — spatial processing and visuomotor guidance. Ventral ('what') stream: V1 → temporal lobe — object identification and face recognition.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the fusiform face area (FFA)?", answer: "A region in the right fusiform gyrus of the inferotemporal cortex specialized for recognizing faces. Damage causes prosopagnosia — inability to recognize familiar faces despite intact basic vision.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the cingulate cortex and what are its parts?", answer: "Cortex wrapping around the corpus callosum, part of the limbic system. Anterior cingulate (ACC): attention, error monitoring, emotional control. Posterior cingulate (PCC): key hub of the default mode network, episodic memory retrieval.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the thalamus?", answer: "Paired diencephalic structure that is the primary relay station for almost all sensory information (except olfaction) en route to the cortex. Also critical for arousal, consciousness, and gating of attention.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What are the major thalamic relay nuclei and their cortical targets?", answer: "VPL → somatosensory cortex; LGN → primary visual cortex; MGN → primary auditory cortex; VA/VL → motor cortex; MD → prefrontal cortex; anterior nucleus → cingulate; pulvinar → parieto-occipital association areas.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is the hypothalamus?", answer: "Small diencephalic structure controlling homeostasis: hunger, thirst, body temperature, circadian rhythms, sleep-wake cycles, and HPA axis stress responses. Controls anterior and posterior pituitary. Located below the thalamus and above the pituitary gland.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the basal ganglia?", answer: "Group of subcortical nuclei: caudate, putamen (together = striatum), globus pallidus (internal and external), substantia nigra, and subthalamic nucleus. Involved in voluntary motor initiation, habit learning, reward processing, and motor suppression.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the striatum?", answer: "The main input structure of the basal ganglia, composed of the caudate nucleus and putamen. Receives dopaminergic input from substantia nigra (nigrostriatal pathway). The caudate is more cognitive; the putamen is more motor-oriented.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the substantia nigra pars compacta and what disease involves its loss?", answer: "Dopaminergic neurons in the midbrain that project to the striatum via the nigrostriatal pathway. Their degeneration causes Parkinson's disease — the loss of dopaminergic modulation leads to the motor triad of tremor, rigidity, and bradykinesia.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the globus pallidus interna (GPi) and its role?", answer: "The primary output nucleus of the basal ganglia. Sends inhibitory (GABAergic) signals to the thalamus. Normally suppresses unwanted movements. GPi is the target for deep brain stimulation (DBS) for dystonia.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is the subthalamic nucleus (STN) and its clinical relevance?", answer: "A small excitatory nucleus in the basal ganglia indirect pathway. It drives GPi inhibition to suppress unwanted movements. The STN is the most common DBS target for Parkinson's disease — stimulation reduces GPi inhibition and restores thalamic output.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is the corpus callosum?", answer: "The largest white matter commissure connecting the two cerebral hemispheres. Allows interhemispheric communication. Parts: genu (frontal), body (central), isthmus (parietal/temporal), splenium (occipital). Surgical severing causes split-brain syndrome.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the fornix?", answer: "A C-shaped white matter tract connecting the hippocampus to the mammillary bodies (and other limbic structures). Critical for episodic memory — bilateral fornix damage causes severe anterograde amnesia (diencephalic amnesia).", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What are the mammillary bodies and what happens when they degenerate?", answer: "Part of the hypothalamus, connected to hippocampus via fornix and to anterior thalamus via the mammillothalamic tract. Degeneration of mammillary bodies (due to thiamine deficiency) is the hallmark of Wernicke's encephalopathy.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What are the three parts of the brainstem?", answer: "Midbrain (mesencephalon) — contains substantia nigra, red nucleus, CN III/IV; Pons — contains CN V/VI/VII/VIII nuclei, basis pontis; Medulla — contains CN IX/X/XI/XII nuclei, vital cardiorespiratory centers, pyramidal decussation.", difficulty: "easy" },
    { topicId: T["Brain Structures"], question: "What does the midbrain contain?", answer: "Superior/inferior colliculi (visual/auditory reflexes), periaqueductal gray (PAG — pain modulation and defense), substantia nigra, red nucleus, cerebral peduncles (descending motor fibers), and CN III and IV nuclei.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What vital functions are controlled by the medulla?", answer: "The medulla houses the dorsal and ventral respiratory groups (breathing), vasomotor center (blood pressure), cardiac center (heart rate), vomiting center (area postrema), and the pyramidal decussation where motor fibers cross.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the cerebellum and what does it do?", answer: "Located posterior to the brainstem. Coordinates movement, balance, and timing by comparing intended vs. actual movement. Damage causes ipsilateral ataxia, dysmetria, dysdiadochokinesia, dysarthria, and intention tremor.", difficulty: "easy" },
    { topicId: T["Brain Structures"], question: "What are the three functional divisions of the cerebellum?", answer: "Vestibulocerebellum (flocculonodular lobe) — balance/eye movements. Spinocerebellum (vermis/paravermis) — gait and limb coordination. Cerebrocerebellum (lateral hemispheres) — planning fine voluntary movements and motor learning.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is the cerebellar cognitive affective syndrome (Schmahmann syndrome)?", answer: "Posterior fossa cerebellar lesions impair executive function (planning, working memory), spatial cognition, language (dysarthria, agrammatism), and emotional regulation. Demonstrates that the cerebellum contributes to non-motor functions.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is the ventricular system?", answer: "Four interconnected cavities producing and circulating CSF: two lateral ventricles (one per hemisphere), third ventricle (between thalami), and fourth ventricle (between brainstem and cerebellum). CSF flows lateral → 3rd → aqueduct → 4th → subarachnoid space.", difficulty: "easy" },
    { topicId: T["Brain Structures"], question: "What is the cerebral aqueduct (Aqueduct of Sylvius)?", answer: "The narrow channel connecting the third and fourth ventricles, running through the midbrain. It is the narrowest part of the CSF pathway — aqueductal stenosis is a common cause of non-communicating (obstructive) hydrocephalus.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What are the prefrontal cortex subregions?", answer: "Dorsolateral PFC (dlPFC): working memory, executive control, attention. Ventromedial/orbitofrontal PFC (vmPFC/OFC): decision-making, reward evaluation, emotional regulation, social behavior. Medial PFC: self-referential thought, default mode network.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What happens with orbitofrontal cortex (OFC) damage?", answer: "Disinhibition, impaired social judgment, poor decision-making (gambling task failures), emotional dysregulation, and socially inappropriate behavior — while preserving most standard cognitive tests. Classic case: Phineas Gage.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the supplementary motor area (SMA)?", answer: "Located in the medial frontal lobe (BA 6). Involved in planning internally generated motor sequences, bilateral hand coordination, and initiation of voluntary movement. SMA damage causes akinesia, mutism, and the alien hand sign.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is the nucleus accumbens?", answer: "The key node of the reward circuit — located in the ventral striatum. Receives dopaminergic input from VTA (mesolimbic pathway). Critical for motivation, reinforcement learning, and addiction. Targeted by drugs of abuse.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the locus coeruleus?", answer: "A pontine nucleus that is the brain's primary source of norepinephrine. Projects diffusely throughout the cortex, hippocampus, and spinal cord. Regulates arousal, attention, and stress responses. Severely degenerated in Parkinson's and Alzheimer's disease.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the periaqueductal gray (PAG)?", answer: "A midbrain region surrounding the cerebral aqueduct. Central role in pain modulation (activates descending inhibitory pathways via endogenous opioids), defense and threat responses, and autonomic control.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is the default mode network (DMN)?", answer: "A set of regions (medial PFC, posterior cingulate cortex, angular gyrus, hippocampus) most active during rest and self-referential thought — mind-wandering, autobiographical memory, and social cognition. Deactivates during focused tasks. Disrupted in Alzheimer's disease.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is the angular gyrus (BA 39) and why is it important?", answer: "Located in the inferior parietal lobule. Integrates visual, auditory, and somatosensory information. Critical for reading, writing, arithmetic, and cross-modal associations. Part of the Geschwind territory. Angular gyrus damage causes Gerstmann's syndrome.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is the hippocampal formation?", answer: "Includes the dentate gyrus, CA fields (CA1–CA4), subiculum, and entorhinal cortex. The entorhinal cortex is the main gateway for information in and out of the hippocampus, receiving convergent input from all sensory modalities.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is the internal capsule?", answer: "A dense band of white matter containing all ascending and descending fiber tracts between the cortex and subcortical structures. Anterior limb: frontothalamic/corticopontine. Posterior limb: corticospinal, corticobulbar, thalamocortical sensory fibers.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What is the reticular activating system (RAS)?", answer: "A network in the brainstem (particularly the midbrain and pons) that projects ascending activating signals to the cortex via the thalamus. Regulates arousal, consciousness, and the sleep-wake cycle. Damage causes coma.", difficulty: "medium" },
    { topicId: T["Brain Structures"], question: "What are the three meningeal layers?", answer: "Dura mater (outermost, tough): contains venous sinuses. Arachnoid mater (middle): trabeculae bridge subarachnoid space. Pia mater (innermost): adheres to brain surface. CSF circulates in the subarachnoid space between arachnoid and pia.", difficulty: "easy" },
    { topicId: T["Brain Structures"], question: "What is the anterior commissure?", answer: "A small white matter commissure anterior to the fornix, connecting parts of the temporal lobes bilaterally (olfactory regions, amygdala, inferior temporal gyri). Preserved in split-brain operations (only the corpus callosum and hippocampal commissure are severed).", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is the parahippocampal cortex?", answer: "Medial temporal cortex surrounding the hippocampus, including the entorhinal cortex, perirhinal cortex, and parahippocampal gyrus. Critical interface for memory encoding — receives convergent polymodal sensory input and relays it to the hippocampus.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is the red nucleus?", answer: "A midbrain structure in the tegmentum that receives cerebellar output (dentate nucleus) and cortical input. Gives rise to the rubrospinal tract — important for motor coordination in species where the corticospinal tract is less developed; in humans plays a smaller role.", difficulty: "hard" },
    { topicId: T["Brain Structures"], question: "What is Papez circuit?", answer: "A limbic circuit for emotional and memory processing: hippocampus → fornix → mammillary bodies → anterior thalamus (via mammillothalamic tract) → cingulate cortex → parahippocampal gyrus → hippocampus. Damage at any point can cause amnesia.", difficulty: "hard" },

    // ===== CRANIAL NERVES (50) =====
    { topicId: T["Cranial Nerves"], question: "How many cranial nerves are there and what is the mnemonic for their names?", answer: "12 pairs (CN I–XII). Mnemonic: 'Oh, Oh, Oh, To Touch And Feel Very Good Velvet, Ah Heaven' = Olfactory, Optic, Oculomotor, Trochlear, Trigeminal, Abducens, Facial, Vestibulocochlear, Glossopharyngeal, Vagus, Accessory, Hypoglossal.", difficulty: "easy" },
    { topicId: T["Cranial Nerves"], question: "What are the three types of cranial nerve fibers?", answer: "Motor (somatic efferent — skeletal muscle control), Sensory (somatic/visceral afferent — touch, pain, special senses), and Mixed (both). Some also carry parasympathetic autonomic fibers.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is CN I (Olfactory Nerve)?", answer: "Pure sensory nerve for smell. Olfactory neurons in nasal mucosa → cribriform plate → olfactory bulb → olfactory cortex (piriform cortex). The only cranial nerve that does NOT relay through the thalamus. Damage causes anosmia.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is CN II (Optic Nerve) and what is its pathway?", answer: "Pure sensory nerve for vision. Retinal ganglion cells → optic nerve → optic chiasm (nasal fibers cross) → optic tract → lateral geniculate nucleus (LGN) → optic radiations → primary visual cortex (V1) in the calcarine fissure.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What visual field defect results from complete optic nerve (CN II) lesion?", answer: "Monocular blindness — complete loss of vision in the ipsilateral eye. All visual input from that eye is lost before reaching the chiasm where pathways from both eyes merge.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What visual field defect results from optic chiasm damage?", answer: "Bitemporal hemianopia — loss of both temporal (outer) visual fields. The crossing nasal fibers (from both nasal retinae, representing temporal fields) are damaged. Classic cause: pituitary adenoma compressing from below.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is CN III (Oculomotor Nerve)?", answer: "Mixed nerve. Motor to 4 extraocular muscles: superior rectus, inferior rectus, medial rectus, inferior oblique — plus levator palpebrae superioris (raises eyelid). Parasympathetic: pupillary constriction (sphincter pupillae) and lens accommodation (ciliary muscle) via Edinger-Westphal nucleus.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What are the signs of a complete CN III palsy?", answer: "Ptosis (levator palpebrae weakness), 'down and out' eye position (unopposed CN IV and VI), and mydriasis (dilated pupil — loss of parasympathetic constriction). A compressive CN III palsy (aneurysm) affects the pupil early.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is the difference between compressive and ischemic CN III palsy?", answer: "Compressive CN III palsy (e.g., posterior communicating artery aneurysm): parasympathetic fibers on the outside are compressed first → pupil involved (mydriasis). Ischemic CN III palsy (diabetes, hypertension): intrinsic ischemia spares outer parasympathetic fibers → pupil spared.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is CN IV (Trochlear Nerve)?", answer: "Pure motor nerve to the superior oblique muscle. The superior oblique moves the eye downward when adducted. CN IV has the longest intracranial course and decussates in the dorsal midbrain. Damage causes vertical diplopia worse going downstairs. Patient tilts head away from the lesion to compensate.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is CN V (Trigeminal Nerve) and what are its divisions?", answer: "Mixed nerve — the largest cranial nerve. Provides sensation to the entire face. Three divisions: V1 (ophthalmic — forehead, cornea), V2 (maxillary — cheek, upper teeth), V3 (mandibular — lower face, jaw; also motor to muscles of mastication). Nucleus spans midbrain to C3.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is the corneal reflex and which nerves mediate it?", answer: "Touch to cornea → blink. Afferent: CN V1 (ophthalmic division of trigeminal — corneal sensation). Efferent: CN VII (facial nerve — orbicularis oculi closes the eyelid). Tests integrity of both CN V and CN VII.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is trigeminal neuralgia?", answer: "Severe lancinating facial pain (CN V, usually V2 or V3 territory) triggered by light touch, eating, or talking. Often caused by vascular compression of CN V at the trigeminal root entry zone. First-line treatment: carbamazepine.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is CN VI (Abducens Nerve)?", answer: "Pure motor nerve to the lateral rectus muscle, which abducts the eye (moves it outward). CN VI palsy causes ipsilateral medial deviation (esotropia) and failure to abduct — horizontal diplopia on lateral gaze toward the lesion.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "Why is CN VI commonly injured in raised intracranial pressure?", answer: "CN VI has a very long intracranial course — it ascends the clivus and bends sharply over the petrous bone. Raised ICP can cause downward displacement of the brainstem, stretching CN VI. This is a 'false localizing sign' — does not indicate a VI nerve nucleus lesion.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is CN VII (Facial Nerve)?", answer: "Mixed nerve. Motor: all muscles of facial expression. Sensory: taste from anterior 2/3 of tongue (via chorda tympani). Autonomic: lacrimal glands (greater petrosal nerve), submandibular and sublingual salivary glands (chorda tympani). Also mediates the efferent limb of the corneal reflex.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is the difference between upper and lower motor neuron CN VII palsy?", answer: "UMN (central) lesion: only contralateral lower face weakness — forehead muscles are bilaterally represented and are SPARED. LMN (peripheral) lesion (Bell's palsy): entire ipsilateral face is weak, INCLUDING the forehead.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is Bell's palsy?", answer: "Acute idiopathic peripheral CN VII palsy, likely from HSV-1 reactivation. Causes ipsilateral complete facial weakness including forehead, possible loss of taste, hyperacusis (stapedius weakness), and reduced lacrimation. Treated with corticosteroids; most resolve spontaneously.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is CN VIII (Vestibulocochlear Nerve)?", answer: "Pure sensory nerve with two components. Cochlear division: hearing (from organ of Corti hair cells). Vestibular division: balance and spatial orientation (from semicircular canals and otolith organs — saccule and utricle). Damage causes sensorineural hearing loss, tinnitus, vertigo, and nystagmus.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is a vestibular schwannoma (acoustic neuroma)?", answer: "Benign tumor arising from Schwann cells of CN VIII's vestibular division in the internal auditory canal or cerebellopontine angle. Presents with unilateral sensorineural hearing loss, tinnitus, and imbalance. Can compress CN VII and V. Treatment: observation, radiosurgery, or surgical resection.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is CN IX (Glossopharyngeal Nerve)?", answer: "Mixed nerve. Sensory: taste from posterior 1/3 of tongue, general sensation of pharynx/soft palate, carotid body/sinus (chemo/baroreception). Motor: stylopharyngeus (elevates pharynx during swallowing). Parasympathetic: parotid gland. Mediates the afferent limb of the gag reflex.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is CN X (Vagus Nerve)?", answer: "Mixed nerve with the widest distribution. Motor: pharynx and larynx (voice/swallowing). Sensory: ear, pharynx, larynx, thorax and abdominal viscera. Parasympathetic: heart (slows rate), lungs (bronchodilation), GI tract to splenic flexure. Efferent limb of gag reflex.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What are the signs of unilateral CN X (vagus) damage?", answer: "Dysphonia (hoarse or breathy voice — recurrent laryngeal nerve branch), dysphagia, absent gag reflex on the affected side, and uvular deviation away from the lesion (intact contralateral palatoglossus pulls uvula toward the normal side).", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is CN XI (Spinal Accessory Nerve)?", answer: "Pure motor nerve to two muscles: sternocleidomastoid (SCM — turns head to contralateral side) and trapezius (elevates shoulder/shrugs). Arises from C1-C5 spinal cord, ascends through foramen magnum. Damage causes ipsilateral shoulder drop, weakness turning head to opposite side.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is CN XII (Hypoglossal Nerve)?", answer: "Pure motor nerve innervating all intrinsic tongue muscles and most extrinsic muscles (genioglossus, hyoglossus, styloglossus). Controls tongue movement. LMN lesion: tongue deviates toward the side of the lesion on protrusion (ipsilateral genioglossus weakness). Atrophy and fasciculations with LMN lesions.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "With a right cortical (UMN) lesion, which way does the tongue deviate?", answer: "The tongue deviates away from the lesion — to the LEFT (toward the side of weakness in a right hemisphere stroke). This is the opposite of LMN lesions, where the tongue deviates toward the lesion.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "Which cranial nerves are purely sensory?", answer: "CN I (Olfactory), CN II (Optic), CN VIII (Vestibulocochlear). Mnemonic: 'Some Say Marry' — the first three 'S' nerves in type sequence are sensory.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "Which cranial nerves are purely motor?", answer: "CN III (Oculomotor), CN IV (Trochlear), CN VI (Abducens), CN XI (Accessory), CN XII (Hypoglossal). They control eye movements, eyelid, facial expression motor (partial), shoulder, and tongue.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "Which cranial nerves carry parasympathetic fibers?", answer: "CN III (pupil constriction, lens accommodation), CN VII (lacrimation and salivation — submandibular/sublingual), CN IX (parotid salivation), CN X (heart, lungs, GI tract). Mnemonic: 3, 7, 9, 10.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is the gag reflex?", answer: "Touch to posterior pharynx triggers pharyngeal contraction. Afferent limb: CN IX (sensation from pharynx). Efferent limb: CN X (motor to pharyngeal constrictors). Absent gag suggests CN IX/X lesion, brainstem pathology, or deep sedation.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is the pupillary light reflex?", answer: "Light in one eye (afferent CN II) → pretectal nucleus → Edinger-Westphal nucleus (bilateral) → CN III (efferent) → ciliary ganglion → sphincter pupillae → pupil constriction bilaterally (direct and consensual). Tests CN II and CN III.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is a relative afferent pupillary defect (RAPD / Marcus Gunn pupil)?", answer: "In the swinging flashlight test, the affected pupil paradoxically dilates when light is moved to it (compared to brisk constriction when the normal eye is illuminated). Indicates optic nerve (CN II) damage on the affected side — reduced afferent signal.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What passes through the cavernous sinus?", answer: "CN III, CN IV, CN V1 (ophthalmic), CN V2 (maxillary), CN VI, and the internal carotid artery (with surrounding sympathetic plexus). Cavernous sinus lesions affect multiple nerves → ophthalmoplegia + facial numbness.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is internuclear ophthalmoplegia (INO)?", answer: "Damage to the medial longitudinal fasciculus (MLF) connecting CN VI nucleus to contralateral CN III nucleus. Result: failure of adduction (CN III side) on attempted lateral gaze, with nystagmus in the abducting eye. Bilateral INO is highly characteristic of multiple sclerosis.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is Horner's syndrome and how does it relate to cranial nerves?", answer: "Disruption of the oculosympathetic pathway causes: ptosis (mild — Müller's muscle), miosis (pupil constriction), and anhidrosis (ipsilateral face). The three-neuron sympathetic pathway is separate from cranial nerves but must be distinguished from CN III palsy (which causes mydriasis, not miosis).", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is the chorda tympani branch of CN VII?", answer: "Carries taste from anterior 2/3 of tongue and provides parasympathetic supply to submandibular and sublingual glands. Travels through the middle ear and exits through the petrotympanic fissure to join the lingual nerve (V3 branch). Damage in Bell's palsy or middle ear surgery → ipsilateral taste loss.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is the greater petrosal nerve?", answer: "A branch of CN VII that carries preganglionic parasympathetic fibers to the lacrimal gland (via pterygopalatine ganglion). Arises at the geniculate ganglion. Lesion proximal to geniculate ganglion → loss of both tearing (greater petrosal) and taste/salivation (chorda tympani).", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is Foster Kennedy syndrome?", answer: "Caused by a large frontal or olfactory groove meningioma: ipsilateral optic atrophy (direct CN II compression), contralateral papilledema (raised ICP), and anosmia (CN I compression). A localizing sign of frontal mass lesion.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "How is CN V (trigeminal) tested clinically?", answer: "Sensory: light touch and pinprick to all three divisions (forehead V1, cheek V2, jaw V3) bilaterally. Motor: jaw clench (masseter), jaw opening against resistance (pterygoids), jaw deviates toward weak side with V3 motor lesion. Also: corneal reflex.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "How is CN VIII (vestibulocochlear) tested clinically?", answer: "Cochlear: whispered voice, finger rub, tuning fork tests (Rinne and Weber). Vestibular: Romberg test (sway with eyes closed), Unterberger test, head impulse test (HIT), and Dix-Hallpike for BPPV. Formal: pure tone audiometry and electronystagmography.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is the H-test for extraocular movements?", answer: "The patient tracks the examiner's finger moving in an H pattern, testing all six cardinal directions of gaze. This evaluates CN III (up, down, and medially), CN IV (down and medially when adducted), and CN VI (laterally).", difficulty: "easy" },
    { topicId: T["Cranial Nerves"], question: "What cranial nerves emerge from the midbrain?", answer: "CN III (oculomotor) exits from the interpeduncular fossa on the ventral midbrain. CN IV (trochlear) uniquely exits from the DORSAL midbrain (the only cranial nerve to do so) and decussates before emerging.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What cranial nerves emerge from the pons?", answer: "CN V (trigeminal) — lateral pons. CN VI (abducens) — pontomedullary junction ventral. CN VII (facial) — lateral pontomedullary junction (cerebellopontine angle). CN VIII (vestibulocochlear) — same area as CN VII.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What cranial nerves emerge from the medulla?", answer: "CN IX (glossopharyngeal), CN X (vagus), and CN XI (accessory) — from the lateral medulla (postolivary sulcus). CN XII (hypoglossal) — from the anterior medulla between pyramid and olive.", difficulty: "medium" },
    { topicId: T["Cranial Nerves"], question: "What is the jugular foramen and what passes through it?", answer: "A foramen at the skull base transmitting CN IX, X, and XI, along with the sigmoid sinus forming the internal jugular vein. Jugular foramen syndrome (Vernet's syndrome): dysphonia, dysphagia, loss of gag, ipsilateral shoulder weakness.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is the vestibuloocular reflex (VOR)?", answer: "Uses CN VIII (vestibular input) to stabilize gaze during head movement by generating compensatory eye movements (via CN III and VI). The head impulse test (HIT) assesses the VOR — a corrective catch-up saccade indicates a peripheral vestibular (CN VIII) lesion.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is the Adie's (tonic) pupil?", answer: "Parasympathetic denervation of the ciliary ganglion (usually from viral illness). Large pupil, very slow constriction to sustained light/near stimulus. Supersensitive to dilute pilocarpine (0.1%) — constricts. Distinguished from CN III palsy by absence of ptosis and ophthalmoplegia.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is Ramsay Hunt syndrome?", answer: "Herpes zoster (VZV) reactivation in the geniculate ganglion of CN VII. Causes: ipsilateral peripheral facial palsy, ear pain, and vesicular eruption in the ear canal/pinna (herpes zoster oticus). May also affect CN VIII → hearing loss, vertigo.", difficulty: "hard" },
    { topicId: T["Cranial Nerves"], question: "What is the near reflex triad?", answer: "Three components triggered by focusing on a near object: 1) Convergence (medial rectus bilateral — CN III), 2) Accommodation (ciliary muscle thickens lens — CN III/ciliary ganglion), 3) Miosis (pupil constricts — CN III). Light-near dissociation: near reflex preserved but light reflex lost (e.g., Argyll Robertson pupils in neurosyphilis).", difficulty: "hard" },

    // ===== VASCULAR SYSTEM OF THE BRAIN (50) =====
    { topicId: T["Vascular System of the Brain"], question: "What are the two main arterial systems supplying the brain?", answer: "The internal carotid system (anterior circulation) — supplies anterior 2/3 of the brain. The vertebrobasilar system (posterior circulation) — supplies posterior 1/3, brainstem, and cerebellum. They are connected by the Circle of Willis.", difficulty: "easy" },
    { topicId: T["Vascular System of the Brain"], question: "What is the internal carotid artery (ICA)?", answer: "Arises from the common carotid at C4. Enters the skull through the carotid canal, traverses the cavernous sinus (forming the carotid siphon), and terminates by dividing into the anterior cerebral artery (ACA) and middle cerebral artery (MCA).", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What are the main branches of the internal carotid artery?", answer: "Ophthalmic artery (first branch — retinal supply), posterior communicating artery (connects to PCA), anterior choroidal artery (supplies posterior internal capsule, hippocampus, optic tract), and terminal branches: ACA and MCA.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is the anterior cerebral artery (ACA) and what does it supply?", answer: "Branch of ICA supplying the medial surface of the frontal and parietal lobes, including the leg and foot area of the motor/sensory homunculus, anterior cingulate cortex, supplementary motor area, and the body and genu of the corpus callosum.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is the ACA stroke syndrome?", answer: "Contralateral leg and foot weakness/sensory loss (leg > arm/face — opposite of MCA), urinary incontinence, abulia (frontal lobe — anterior cingulate), and akinesia. Bilateral ACA infarcts cause paraplegia with profound behavioral changes.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the middle cerebral artery (MCA) and what does it supply?", answer: "Largest branch of ICA. Supplies the lateral surface of frontal, parietal, and temporal lobes — including primary motor and sensory cortices for face and arm, Broca's area, Wernicke's area, optic radiations, and basal ganglia/internal capsule (via lenticulostriate arteries).", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is the MCA stroke syndrome (dominant hemisphere)?", answer: "Contralateral hemiplegia and hemisensory loss (face and arm > leg), contralateral homonymous hemianopia, global aphasia (total MCA) or Broca's/Wernicke's aphasia (partial MCA divisions). Plus contralateral gaze deviation (frontal eye field damage).", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the MCA stroke syndrome (non-dominant hemisphere)?", answer: "Contralateral hemiplegia and hemisensory loss (face/arm > leg), homonymous hemianopia, and prominently: hemispatial neglect (ignoring left space), anosognosia (unawareness of deficits), aprosodia, and constructional apraxia.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What are the lenticulostriate arteries?", answer: "Small perforating branches of the MCA supplying the basal ganglia (striatum, globus pallidus) and posterior limb of the internal capsule. Common site of lacunar infarcts (in hypertension/diabetes) and hypertensive intracerebral hemorrhage.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the posterior cerebral artery (PCA) and what does it supply?", answer: "Typically arises from the basilar artery (fetal PCA variant arises from ICA in 15–20%). Supplies the occipital lobe (V1, V2), inferomedial temporal lobe (hippocampus, parahippocampal gyrus, fusiform gyrus), posterior thalamus, and midbrain via perforating branches.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is the PCA stroke syndrome?", answer: "Contralateral homonymous hemianopia (often with macular sparing — macular cortex has dual blood supply). Left PCA: alexia without agraphia, color anomia. Right PCA: prosopagnosia, visual neglect. Both thalami: amnesia. Midbrain: CN III palsy + contralateral hemiplegia (Weber's syndrome).", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the vertebrobasilar system?", answer: "Posterior circulation formed by the two vertebral arteries (arising from subclavian arteries, ascending through C6–C1 transverse foramina) joining at the pontomedullary junction to form the basilar artery, which supplies the brainstem, cerebellum, thalamus, and occipital lobes.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is PICA (posterior inferior cerebellar artery) and what does it supply?", answer: "The largest branch of the vertebral artery. Supplies the lateral medulla and the inferior surface of the cerebellum. Occlusion causes Wallenberg syndrome (lateral medullary syndrome).", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is Wallenberg syndrome (lateral medullary syndrome)?", answer: "PICA or vertebral artery occlusion. Ipsilateral: face pain/numbness (CN V), limb ataxia, Horner's syndrome, hoarseness/dysphagia (CN IX/X). Contralateral: body pain and temperature loss (spinothalamic tract). Classically: face and body sensory losses are on OPPOSITE sides.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is AICA (anterior inferior cerebellar artery)?", answer: "Arises from the lower basilar artery. Supplies the anterior-inferior cerebellum and lateral pons (including CN VII and VIII nuclei). AICA occlusion causes: ipsilateral facial palsy, deafness, vertigo, ataxia, Horner's, and contralateral body pain/temperature loss.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the superior cerebellar artery (SCA)?", answer: "Arises from the upper basilar artery just before bifurcation. Supplies the superior cerebellar surface, deep cerebellar nuclei, and upper lateral pons. SCA occlusion: ipsilateral cerebellar ataxia, Horner's syndrome, contralateral pain/temperature loss (CN IV occasionally affected).", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the basilar artery?", answer: "Formed by union of both vertebral arteries at the pontomedullary junction. Runs along the ventral pons. Gives off AICA, pontine perforating arteries, SCA, and terminates as the two PCAs. Complete occlusion causes devastating brainstem ischemia.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is locked-in syndrome?", answer: "Caused by basilar artery occlusion affecting the ventral pons (bilateral corticospinal and corticobulbar tract damage). Patients are conscious (dorsal tegmentum/reticular formation spared) but completely paralyzed, unable to speak, with only vertical gaze and blinking preserved.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the Circle of Willis?", answer: "An anastomotic arterial ring at the base of the brain. Components: two ACAs connected by the anterior communicating artery (ACoA), two ICAs, two posterior communicating arteries (PCoAs), and two PCAs. Provides collateral flow between anterior and posterior circulations and left/right sides.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is the anterior communicating artery (ACoA)?", answer: "Connects the two ACAs. The most common site of intracranial saccular (berry) aneurysm. Rupture causes subarachnoid hemorrhage. Large aneurysms can cause visual field defects, amnesia (proximity to hypothalamus/fornix), and abulia.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the posterior communicating artery (PCoA)?", answer: "Connects the ICA to the PCA on each side. Second most common aneurysm site. A PCoA aneurysm classically presents with pupil-involving CN III palsy (mydriasis, ptosis, 'down and out' eye) — a neurosurgical emergency before rupture.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is amaurosis fugax?", answer: "Transient monocular blindness (classically 'a shade coming down over the eye') lasting minutes, caused by temporary ischemia of the ophthalmic artery or central retinal artery. A TIA indicating ipsilateral ICA disease — requires urgent evaluation.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is a lacunar infarct?", answer: "A small (<15mm) subcortical infarct caused by occlusion of small perforating arteries (lenticulostriates from MCA, thalamoperforators from PCA, pontine perforators from basilar). Associated with hypertension and diabetes. Causes distinctive pure motor, pure sensory, or sensorimotor syndromes.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What are the classic lacunar stroke syndromes?", answer: "Pure motor stroke (posterior limb internal capsule or pons — corticospinal). Pure sensory stroke (thalamus VPL). Sensorimotor stroke (IC/thalamus). Ataxic hemiparesis (pons or posterior limb IC). Clumsy hand-dysarthria syndrome (pons or IC).", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is a watershed (border zone) infarct?", answer: "Infarct at the boundary between two major arterial territories, caused by systemic hypoperfusion (shock, cardiac arrest). ACA-MCA border zone: 'man in a barrel' syndrome (proximal arm weakness, face and leg spared). MCA-PCA border zone: transcortical aphasia or cortical blindness with macular sparing.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the blood-brain barrier (BBB)?", answer: "A highly selective barrier formed by tight junctions between brain capillary endothelial cells (assisted by pericytes and astrocytic end-feet). Restricts passage of most molecules to protect the brain from pathogens and toxins. Broken down in stroke, inflammation, and tumors — causing vasogenic edema.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is subarachnoid hemorrhage (SAH)?", answer: "Bleeding into the subarachnoid space, most often from rupture of a saccular (berry) aneurysm. Presents with sudden 'thunderclap' headache (worst headache of life), meningismus, photophobia, and loss of consciousness. Diagnosed with CT (blood in cisterns) then LP (xanthochromia).", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is a berry aneurysm?", answer: "A saccular outpouching at an arterial bifurcation, most commonly in the Circle of Willis (ACoA > PCoA-ICA junction > MCA bifurcation). Associated with hypertension, smoking, polycystic kidney disease, Ehlers-Danlos, and Marfan syndrome. Rupture → subarachnoid hemorrhage.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is a hypertensive intracerebral hemorrhage and where does it typically occur?", answer: "Rupture of small perforating arteries weakened by chronic hypertension (Charcot-Bouchard microaneurysms). Most common sites in order: putamen (most common), thalamus, pons (causes coma with pinpoint pupils), cerebellum (treatable with surgery), and subcortical white matter.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What are the major dural venous sinuses?", answer: "Superior sagittal sinus (along falx cerebri), inferior sagittal sinus, straight sinus (receives inferior sagittal + great cerebral vein of Galen), confluence of sinuses (torcular), transverse sinuses → sigmoid sinuses → internal jugular veins, and bilateral cavernous sinuses.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the cavernous sinus and why is it clinically important?", answer: "A paired venous sinus on either side of the sella turcica. Contains CN III, IV, V1, V2, and VI, and the ICA with its sympathetic plexus. Cavernous sinus thrombosis causes proptosis, chemosis, ophthalmoplegia, facial numbness, and risk of septic extension. Cavernous aneurysm → CN palsies.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is cerebral autoregulation?", answer: "The brain's ability to maintain constant cerebral blood flow (~50 mL/100g/min) over a wide range of mean arterial pressures (MAP 50–150 mmHg) by adjusting vascular resistance. Lost in severe ischemia, hypertensive crisis, and TBI — making the brain vulnerable to pressure changes.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is cerebral perfusion pressure (CPP)?", answer: "CPP = MAP − ICP. Normal CPP is 70–90 mmHg. Below 50 mmHg → cerebral ischemia. Central to TBI management — maintain adequate MAP and control elevated ICP (via positioning, osmotherapy, surgical decompression) to preserve CPP.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the ischemic penumbra?", answer: "The zone of potentially salvageable brain tissue surrounding the irreversibly damaged ischemic core after stroke. The core dies within minutes; the penumbra has reduced but not absent flow and can survive hours with reperfusion. The penumbra is the therapeutic target of acute stroke treatment (tPA, thrombectomy).", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is a transient ischemic attack (TIA)?", answer: "A brief episode of focal neurological symptoms from temporary brain ischemia, fully resolving without infarction on DWI-MRI. A TIA is a stroke warning — 10–15% risk of stroke within 3 months (highest in first 48–90 hours). ABCD2 score guides risk stratification and hospitalization.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is macular sparing in PCA strokes and why does it occur?", answer: "PCA infarcts often spare central vision (the macula) because the macular cortex in the occipital pole receives dual blood supply from both PCA and MCA. Macular sparing indicates a vascular (ischemic) cause, while cortical blindness without macular sparing suggests a different etiology.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the anterior choroidal artery (AChA) and what does occlusion cause?", answer: "A small ICA branch supplying the posterior limb of the internal capsule, hippocampus, amygdala, medial globus pallidus, and optic tract. AChA occlusion causes the triad: contralateral hemiplegia, hemisensory loss, and homonymous hemianopia — despite being a tiny artery.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the artery of Percheron?", answer: "A rare anatomical variant — a single trunk arising from PCA or top of basilar that supplies both medial thalami and sometimes the rostral midbrain. Occlusion causes bilateral thalamic infarcts: sudden hypersomnolence, vertical gaze palsy, memory impairment, and behavioral changes ('thalamic dementia').", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is Weber's syndrome?", answer: "Midbrain (cerebral peduncle) infarct from PCA perforator occlusion. Ipsilateral CN III palsy (mydriasis, ptosis, 'down and out' eye) plus contralateral hemiplegia (corticospinal tract in cerebral peduncle). A classic crossed brainstem syndrome.", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the difference between thrombotic, embolic, and lacunar stroke mechanisms?", answer: "Thrombotic: clot forms at an atherosclerotic plaque in situ (usually large vessels at bifurcations). Embolic: clot travels from a remote source (heart, aorta, proximal artery — 'artery-to-artery'). Lacunar: small perforating artery occlusion from lipohyalinosis (hypertension/diabetes). Each has different risk factors, patterns, and treatment.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is a cerebral arteriovenous malformation (AVM)?", answer: "An abnormal tangle of blood vessels (nidus) directly connecting arteries to veins without a capillary bed, causing high-pressure arterial flow into the venous system. Can cause intracerebral hemorrhage, seizures, headache, and focal neurological deficits. Treatment: resection, radiosurgery (Gamma Knife), or embolization.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is a cerebral venous sinus thrombosis (CVST)?", answer: "Clotting of the dural venous sinuses (most commonly superior sagittal sinus). Causes venous congestion → headache, papilledema, seizures, and hemorrhagic venous infarction. Associated with hypercoagulable states, OCP, pregnancy, dehydration. Treat with anticoagulation (even if hemorrhage present).", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What areas of the brain lack a blood-brain barrier?", answer: "The circumventricular organs (CVOs): area postrema (chemoreceptor trigger zone — vomiting), subfornical organ, organum vasculosum of the lamina terminalis (OVLT), median eminence, pineal gland, and neurohypophysis. These sense blood-borne signals (hormones, toxins, osmolarity).", difficulty: "hard" },
    { topicId: T["Vascular System of the Brain"], question: "What is the significance of the posterior limb of the internal capsule in vascular strokes?", answer: "The posterior limb contains the densely packed corticospinal tract — a small lacunar infarct here (from lenticulostriate or anterior choroidal artery occlusion) causes pure motor stroke. It is one of the most common sites for clinically significant small vessel disease.", difficulty: "medium" },
    { topicId: T["Vascular System of the Brain"], question: "What is IV tPA and when can it be used?", answer: "Intravenous alteplase (tissue plasminogen activator) is the standard treatment for acute ischemic stroke, given within 4.5 hours of symptom onset. It dissolves the clot by converting plasminogen to plasmin. Contraindicated in hemorrhagic stroke, recent surgery, or uncontrolled hypertension.", difficulty: "medium" },
  ];

  await db.insert(flashcardsTable).values(flashcards);
  console.log(`  ✓ ${flashcards.length} flashcards inserted`);

  // ===========================================================================
  // QUIZ QUESTIONS (10 per topic = 30 total)
  // ===========================================================================
  const quizQuestions = [
    // ===== BRAIN STRUCTURES =====
    { topicId: T["Brain Structures"], question: "Which structure in the left inferior frontal gyrus is responsible for speech production?", optionA: "Angular gyrus", optionB: "Wernicke's area", optionC: "Broca's area", optionD: "Supramarginal gyrus", correctAnswer: "C", explanation: "Broca's area (BA 44/45) in the left inferior frontal gyrus controls speech production and motor programming of language. Damage causes nonfluent Broca's aphasia.", examOnly: false },
    { topicId: T["Brain Structures"], question: "A lesion of the right parietal lobe is most likely to cause:", optionA: "Expressive aphasia", optionB: "Hemispatial neglect", optionC: "Prosopagnosia", optionD: "Severe anterograde amnesia", correctAnswer: "B", explanation: "Right parietal lobe lesions typically cause hemispatial neglect (ignoring the contralateral left side of space) and visuospatial deficits, while language functions are primarily left-hemisphere dominant.", examOnly: false },
    { topicId: T["Brain Structures"], question: "Which thalamic nucleus relays visual information to the primary visual cortex?", optionA: "Ventral posterolateral nucleus (VPL)", optionB: "Lateral geniculate nucleus (LGN)", optionC: "Medial geniculate nucleus (MGN)", optionD: "Pulvinar", correctAnswer: "B", explanation: "The lateral geniculate nucleus (LGN) receives visual input from retinal ganglion cells and relays it to the primary visual cortex (V1) in the calcarine fissure.", examOnly: false },
    { topicId: T["Brain Structures"], question: "Bilateral damage to the hippocampus most characteristically causes:", optionA: "Loss of fear responses", optionB: "Inability to form new explicit memories", optionC: "Impaired procedural motor learning", optionD: "Personality disinhibition", correctAnswer: "B", explanation: "The hippocampus is essential for encoding new explicit (declarative) memories. Bilateral damage (as in patient H.M.) causes profound anterograde amnesia while sparing implicit memory and remote memories.", examOnly: false },
    { topicId: T["Brain Structures"], question: "The primary output structure of the basal ganglia that sends inhibitory signals to the thalamus is:", optionA: "Caudate nucleus", optionB: "Putamen", optionC: "Subthalamic nucleus", optionD: "Globus pallidus interna (GPi)", correctAnswer: "D", explanation: "The internal segment of the globus pallidus (GPi) is the main output of the basal ganglia, sending GABAergic inhibitory signals to the ventral anterior/ventrolateral thalamus to regulate motor output.", examOnly: false },
    { topicId: T["Brain Structures"], question: "Gerstmann's syndrome is caused by damage to which brain region?", optionA: "Left superior temporal gyrus", optionB: "Right posterior parietal cortex", optionC: "Left angular gyrus", optionD: "Left prefrontal cortex", correctAnswer: "C", explanation: "Gerstmann's syndrome (acalculia, agraphia, finger agnosia, left-right disorientation) results from lesions to the left angular gyrus in the inferior parietal lobule.", examOnly: false },
    { topicId: T["Brain Structures"], question: "Damage to the orbitofrontal cortex is most likely to produce:", optionA: "Dense anterograde amnesia", optionB: "Wernicke's aphasia", optionC: "Disinhibition and poor social judgment", optionD: "Contralateral limb weakness", correctAnswer: "C", explanation: "Orbitofrontal cortex (OFC) lesions cause disinhibition, impaired decision-making, and socially inappropriate behavior (as in Phineas Gage) while preserving most standardized cognitive test performance.", examOnly: false },
    { topicId: T["Brain Structures"], question: "The locus coeruleus is the brain's primary source of which neurotransmitter?", optionA: "Dopamine", optionB: "Serotonin", optionC: "Norepinephrine", optionD: "Acetylcholine", correctAnswer: "C", explanation: "The locus coeruleus (pontine nucleus) is the principal source of norepinephrine in the brain, projecting widely to regulate arousal, attention, and stress responses.", examOnly: false },
    { topicId: T["Brain Structures"], question: "The mammillary bodies receive their primary input via which white matter tract?", optionA: "Medial forebrain bundle", optionB: "Fornix", optionC: "Mammillothalamic tract", optionD: "Cingulum", correctAnswer: "B", explanation: "The mammillary bodies receive major input from the hippocampus via the fornix. They are part of the Papez circuit and are critically damaged in Wernicke-Korsakoff syndrome.", examOnly: false },
    { topicId: T["Brain Structures"], question: "Degeneration of the substantia nigra pars compacta most directly causes which disease?", optionA: "Huntington's disease", optionB: "Alzheimer's disease", optionC: "Parkinson's disease", optionD: "Multiple sclerosis", correctAnswer: "C", explanation: "Parkinson's disease results from degeneration of dopaminergic neurons in the substantia nigra pars compacta, reducing nigrostriatal dopamine and causing the motor triad of tremor, rigidity, and bradykinesia.", examOnly: false },

    // ===== CRANIAL NERVES =====
    { topicId: T["Cranial Nerves"], question: "A patient has sudden onset complete left facial weakness including the forehead. This is most consistent with:", optionA: "Right cortical stroke", optionB: "Left peripheral CN VII lesion (e.g., Bell's palsy)", optionC: "Right peripheral CN VII lesion", optionD: "Left CN V lesion", correctAnswer: "B", explanation: "A peripheral (LMN) CN VII lesion affects the entire ipsilateral face, including the forehead. The forehead is bilaterally represented in the cortex, so UMN lesions SPARE the forehead — only peripheral (Bell's palsy) lesions paralyze the complete ipsilateral face.", examOnly: false },
    { topicId: T["Cranial Nerves"], question: "A posterior communicating artery aneurysm compresses CN III, characteristically causing:", optionA: "Miosis, ptosis, and anhidrosis (Horner's syndrome)", optionB: "Mydriasis, ptosis, and 'down and out' eye position", optionC: "Medial deviation of the eye with horizontal diplopia", optionD: "Vertical diplopia with head tilt", correctAnswer: "B", explanation: "PCoA aneurysms compress the parasympathetic fibers on the outside of CN III first, producing mydriasis (fixed dilated pupil), ptosis, and 'down and out' eye (unopposed CN IV and VI). This is a neurosurgical emergency.", examOnly: false },
    { topicId: T["Cranial Nerves"], question: "The afferent limb of the corneal reflex is mediated by:", optionA: "CN III", optionB: "CN VII (facial)", optionC: "CN V (ophthalmic division)", optionD: "CN VI", correctAnswer: "C", explanation: "The corneal reflex afferent limb is CN V1 (ophthalmic division — corneal sensation); the efferent limb is CN VII (orbicularis oculi closes the eyelid). Testing this reflex evaluates the integrity of both CN V and VII.", examOnly: false },
    { topicId: T["Cranial Nerves"], question: "Which muscle is innervated by CN IV (trochlear nerve)?", optionA: "Inferior oblique", optionB: "Lateral rectus", optionC: "Medial rectus", optionD: "Superior oblique", correctAnswer: "D", explanation: "CN IV (trochlear) is the only cranial nerve to exit the dorsal brainstem and exclusively innervates the superior oblique muscle. The superior oblique depresses the adducted eye — CN IV palsy causes vertical diplopia, worse looking downward.", examOnly: false },
    { topicId: T["Cranial Nerves"], question: "Which cranial nerve carries taste from the anterior 2/3 of the tongue?", optionA: "CN V (V3 mandibular)", optionB: "CN IX (glossopharyngeal)", optionC: "CN X (vagus)", optionD: "CN VII (facial — chorda tympani)", correctAnswer: "D", explanation: "CN VII carries taste from the anterior 2/3 of the tongue via the chorda tympani branch, which travels with the lingual nerve (V3). CN IX carries taste from the posterior 1/3.", examOnly: false },
    { topicId: T["Cranial Nerves"], question: "The gag reflex is mediated by:", optionA: "CN VII afferent, CN XII efferent", optionB: "CN IX afferent, CN X efferent", optionC: "CN V afferent, CN VII efferent", optionD: "CN X afferent, CN IX efferent", correctAnswer: "B", explanation: "The gag reflex: afferent limb (pharyngeal sensation) is CN IX (glossopharyngeal); efferent limb (pharyngeal muscle contraction) is CN X (vagus). Absence of gag suggests CN IX/X lesion or brainstem pathology.", examOnly: false },
    { topicId: T["Cranial Nerves"], question: "A patient cannot abduct the right eye past the midline with intact adduction. The most likely diagnosis is:", optionA: "Right CN III palsy", optionB: "Right CN IV palsy", optionC: "Right CN VI palsy", optionD: "Left internuclear ophthalmoplegia", correctAnswer: "C", explanation: "CN VI (abducens) palsy causes failure to abduct the ipsilateral eye (lateral rectus weakness), resulting in esotropia and horizontal diplopia on lateral gaze toward the lesion side.", examOnly: false },
    { topicId: T["Cranial Nerves"], question: "A relative afferent pupillary defect (RAPD) indicates pathology in which cranial nerve?", optionA: "CN III", optionB: "CN II", optionC: "CN VI", optionD: "CN VII", correctAnswer: "B", explanation: "A RAPD (Marcus Gunn pupil) indicates optic nerve (CN II) dysfunction — the damaged nerve carries less light information, so when light swings to that eye, both pupils appear to dilate (reduced consensual drive from the weaker afferent signal).", examOnly: false },
    { topicId: T["Cranial Nerves"], question: "Bilateral internuclear ophthalmoplegia (INO) in a young adult is most characteristic of:", optionA: "Cavernous sinus thrombosis", optionB: "Vertebrobasilar stroke", optionC: "Multiple sclerosis", optionD: "Myasthenia gravis", correctAnswer: "C", explanation: "Bilateral INO from medial longitudinal fasciculus (MLF) damage is highly characteristic of multiple sclerosis in young adults. The MLF connects the CN VI nucleus to the contralateral CN III nucleus for coordinated horizontal gaze.", examOnly: false },
    { topicId: T["Cranial Nerves"], question: "A right CN XII (hypoglossal) lower motor neuron lesion causes the tongue to deviate:", optionA: "To the left on protrusion", optionB: "To the right on protrusion", optionC: "No deviation — tongue is symmetric", optionD: "The tongue retracts and cannot protrude", correctAnswer: "B", explanation: "With an LMN CN XII lesion, the tongue deviates toward the side of the lesion — the weakened ipsilateral genioglossus cannot push the tongue to the opposite side. Right LMN lesion = tongue deviates right.", examOnly: false },

    // ===== VASCULAR SYSTEM OF THE BRAIN =====
    { topicId: T["Vascular System of the Brain"], question: "Occlusion of the left MCA (dominant hemisphere) most characteristically causes:", optionA: "Contralateral leg weakness with preserved arm and face", optionB: "Contralateral arm and face weakness with aphasia", optionC: "Bilateral visual field loss", optionD: "Ipsilateral limb ataxia and Horner's syndrome", correctAnswer: "B", explanation: "Left MCA occlusion causes contralateral hemiplegia (face/arm > leg — lateral homunculus), hemisensory loss, homonymous hemianopia, and aphasia (Broca's, Wernicke's, or global depending on MCA division involved).", examOnly: false },
    { topicId: T["Vascular System of the Brain"], question: "A stroke causing isolated contralateral leg weakness with urinary incontinence most likely involves the:", optionA: "Middle cerebral artery (MCA)", optionB: "Anterior cerebral artery (ACA)", optionC: "Posterior cerebral artery (PCA)", optionD: "PICA", correctAnswer: "B", explanation: "ACA territory infarcts affect the medial surface of the frontal and parietal lobes, causing weakness greatest in the contralateral leg and foot (medial homunculus), urinary incontinence, and frontal behavioral changes (abulia).", examOnly: false },
    { topicId: T["Vascular System of the Brain"], question: "Wallenberg syndrome (lateral medullary syndrome) is most commonly caused by occlusion of:", optionA: "MCA", optionB: "AICA", optionC: "PICA or the vertebral artery", optionD: "Basilar artery", correctAnswer: "C", explanation: "Wallenberg syndrome results from infarction of the lateral medulla, most commonly from PICA or vertebral artery occlusion. It causes crossed sensory loss (ipsilateral face, contralateral body), Horner's, dysphonia, dysphagia, and ipsilateral ataxia.", examOnly: false },
    { topicId: T["Vascular System of the Brain"], question: "The most common site of saccular (berry) aneurysm in the Circle of Willis is:", optionA: "Middle cerebral artery bifurcation", optionB: "Anterior communicating artery (ACoA)", optionC: "Posterior communicating artery (PCoA)", optionD: "Basilar tip", correctAnswer: "B", explanation: "The anterior communicating artery (ACoA) is the most common site of intracranial aneurysm. Rupture causes subarachnoid hemorrhage with potential amnesia and abulia from proximity to the hypothalamus and fornix.", examOnly: false },
    { topicId: T["Vascular System of the Brain"], question: "A patient with hypertension has acute onset contralateral hemiplegia and hemisensory loss. CT shows hemorrhage in the putamen. Which vessel is most likely the source?", optionA: "Middle cerebral artery trunk", optionB: "Lenticulostriate perforating arteries", optionC: "Anterior choroidal artery", optionD: "Thalamoperforating arteries", correctAnswer: "B", explanation: "Hypertensive hemorrhage most commonly occurs in the putamen, caused by rupture of lenticulostriate perforating arteries (branches of MCA) weakened by hypertension-induced lipohyalinosis.", examOnly: false },
    { topicId: T["Vascular System of the Brain"], question: "The ischemic penumbra refers to:", optionA: "The irreversibly infarcted core", optionB: "Hemorrhagic transformation of an infarct", optionC: "Potentially salvageable tissue surrounding the ischemic core", optionD: "Perilesional vasogenic edema", correctAnswer: "C", explanation: "The ischemic penumbra is the zone of reduced but not absent blood flow surrounding the infarct core — cells are electrically silent but structurally intact. Timely reperfusion (tPA, thrombectomy) can rescue penumbral tissue.", examOnly: false },
    { topicId: T["Vascular System of the Brain"], question: "Amaurosis fugax (transient monocular blindness 'like a shade coming down') is a warning sign of disease in which vessel?", optionA: "Middle cerebral artery", optionB: "Vertebral artery", optionC: "Internal carotid artery (via ophthalmic artery)", optionD: "Basilar artery", correctAnswer: "C", explanation: "Amaurosis fugax is caused by transient ischemia of the ophthalmic artery (first branch of ICA) or central retinal artery, indicating ipsilateral ICA stenosis or cardioembolism. It is a TIA requiring urgent carotid evaluation.", examOnly: false },
    { topicId: T["Vascular System of the Brain"], question: "A small infarct in the posterior limb of the internal capsule most typically causes:", optionA: "Pure sensory stroke", optionB: "Pure motor stroke", optionC: "Wernicke's aphasia", optionD: "Contralateral visual field loss", correctAnswer: "B", explanation: "The posterior limb of the internal capsule contains densely packed corticospinal tract fibers. A small lacunar infarct here (from lenticulostriate occlusion) causes pure motor stroke — contralateral hemiplegia without sensory, visual, or cognitive deficits.", examOnly: false },
    { topicId: T["Vascular System of the Brain"], question: "A posterior cerebral artery (PCA) infarct most characteristically produces:", optionA: "Contralateral pure motor hemiplegia", optionB: "Contralateral homonymous hemianopia, often with macular sparing", optionC: "Ipsilateral cerebellar ataxia", optionD: "Expressive aphasia", correctAnswer: "B", explanation: "PCA infarcts affect the occipital lobe visual cortex, causing contralateral homonymous hemianopia. Macular sparing often occurs because the macular cortex at the occipital pole receives dual supply from PCA and MCA.", examOnly: false },
    { topicId: T["Vascular System of the Brain"], question: "Locked-in syndrome results from occlusion of which vessel?", optionA: "Top of basilar artery", optionB: "Ventral basilar artery (bilateral pons)", optionC: "PICA bilaterally", optionD: "Both MCAs", correctAnswer: "B", explanation: "Basilar artery occlusion affecting the ventral pons bilaterally destroys the corticospinal and corticobulbar tracts, causing complete paralysis and anarthria. Consciousness is preserved (dorsal tegmentum/reticular formation intact) — patients communicate only by vertical eye movements or blinking.", examOnly: false },
  ];

  const insertedQuestions = await db.insert(quizQuestionsTable).values(quizQuestions).returning();
  console.log(`  ✓ ${quizQuestions.length} quiz questions inserted`);

  // ===========================================================================
  // STUDY GUIDES (1 per topic)
  // ===========================================================================
  const studyGuides = [
    {
      topicId: T["Brain Structures"],
      title: "Brain Structures — Study Guide",
      content: `## Overview of Brain Organization

The brain is organized hierarchically — from the brainstem (which manages survival functions) upward through subcortical structures (which regulate drives, emotion, and movement) to the cerebral cortex (which mediates complex cognition, language, and personality). Understanding the major structures and their connections is foundational for neuropsychological localization.

## The Cerebral Cortex

The cerebral cortex is divided into four lobes, each with primary (sensory/motor) and association areas.

### Frontal Lobe
The largest lobe, anterior to the central sulcus. Key regions:
- **Primary Motor Cortex (M1, precentral gyrus):** Controls contralateral voluntary movement via the corticospinal tract. Organized as the motor homunculus — disproportionate representation of hands, lips, and tongue.
- **Premotor Cortex (lateral BA 6):** Programs complex motor sequences; contributes to the corticospinal tract.
- **Supplementary Motor Area (SMA, medial BA 6):** Internally generated movements, bilateral coordination, motor initiation. Damage → akinesia, mutism, alien hand.
- **Prefrontal Cortex:** Dorsolateral PFC (dlPFC) — working memory, cognitive flexibility, attention. Orbitofrontal/ventromedial PFC — decision-making, reward, emotional regulation, social behavior. Medial PFC — self-referential processing, default mode network.
- **Broca's Area (BA 44/45):** Left inferior frontal gyrus — speech production and motor language programming. Damage → Broca's (nonfluent) aphasia.
- **Frontal Eye Fields (FEF, BA 8):** Voluntary contralateral gaze; acute damage causes ipsilateral gaze deviation (eyes look toward the lesion).

**Frontal lobe damage:** Executive dysfunction, disinhibition (OFC), perseveration, personality change, apraxia (SMA), akinetic mutism (bilateral medial frontal).

### Parietal Lobe
Posterior to the central sulcus.
- **Primary Somatosensory Cortex (S1, postcentral gyrus):** Processes contralateral touch, proprioception, and pain in a homuncular organization.
- **Superior Parietal Lobule:** Spatial attention, proprioception, and visuomotor integration.
- **Inferior Parietal Lobule:**
  - Angular gyrus (BA 39): Reading, writing, arithmetic, cross-modal integration. Damage → Gerstmann's syndrome (left) or visual neglect (right).
  - Supramarginal gyrus (BA 40): Phonological processing, limb-kinetic praxis.
- **Right Parietal Lobe:** Dominant for visuospatial processing and directed attention. Lesions → hemispatial neglect, anosognosia, constructional apraxia.

### Temporal Lobe
- **Primary Auditory Cortex (Heschl's gyri, BA 41/42):** Processes contralateral auditory input.
- **Wernicke's Area (BA 22):** Left posterior superior temporal gyrus — language comprehension. Damage → Wernicke's aphasia.
- **Fusiform Gyrus:** Face recognition (fusiform face area, right-dominant). Damage → prosopagnosia.
- **Inferior Temporal Gyrus:** Object recognition (ventral visual stream).
- **Medial Temporal Lobe (MTL):** Hippocampus, parahippocampal cortex, amygdala — essential for memory and emotion.

### Occipital Lobe
- **Primary Visual Cortex (V1, calcarine fissure):** Retinotopically organized. Bilateral damage → cortical blindness. Unilateral → contralateral homonymous hemianopia.
- **Extrastriate Cortex:** V2/V3 (intermediate), V4 (color, fusiform), V5/MT (motion). Lesions produce specific visual agnosias.

## Subcortical Structures

### Limbic System
- **Hippocampus:** Encoding new episodic and semantic memories. Bilateral damage → severe anterograde amnesia (H.M. case). CA1 is most vulnerable to ischemia.
- **Amygdala:** Fear conditioning, emotional memory, threat detection. Bilateral damage → Klüver-Bucy syndrome.
- **Cingulate Cortex:** Anterior cingulate (ACC) — attention, error detection, emotion regulation. Posterior cingulate (PCC) — default mode network hub.
- **Parahippocampal Cortex:** Entorhinal cortex, perirhinal cortex — memory gateway to hippocampus.
- **Fornix:** Hippocampus → mammillary bodies. Bilateral damage → amnesia.
- **Mammillary Bodies:** Part of Papez circuit (hippocampus → fornix → mammillary bodies → anterior thalamus → cingulate → hippocampus). Thiamine deficiency → Wernicke's encephalopathy (mammillary body hemorrhage).

### Thalamus
The primary sensory relay nucleus with multiple divisions:
- VPL/VPM → somatosensory cortex (body/face)
- LGN → V1 (vision)
- MGN → auditory cortex (hearing)
- VA/VL → motor cortex (basal ganglia/cerebellar output)
- MD → prefrontal cortex (cognition)
- Anterior nucleus → cingulate (Papez circuit)
- Pulvinar → parieto-occipital association cortex

### Hypothalamus
Controls homeostasis: hunger (lateral hypothalamus — feeding; ventromedial — satiety), thirst, body temperature, circadian rhythms (suprachiasmatic nucleus — master clock), HPA axis (CRH → pituitary → cortisol), and the autonomic nervous system. Controls pituitary via releasing hormones.

### Basal Ganglia
- **Striatum (caudate + putamen):** Input structure. Caudate — cognitive; putamen — motor.
- **Globus Pallidus (GPi/GPe):** GPi is main output — inhibits thalamus. GPe modulates indirect pathway.
- **Subthalamic Nucleus (STN):** Excitatory drive to GPi (indirect pathway brake). DBS target for Parkinson's.
- **Substantia Nigra:** Pars compacta (SNc) → dopamine → striatum (nigrostriatal pathway). Degeneration = Parkinson's.
- **Direct pathway:** Striatum inhibits GPi → releases thalamus → facilitates motor cortex (movement GO).
- **Indirect pathway:** Striatum inhibits GPe → releases STN → drives GPi → inhibits thalamus → suppresses cortex (movement STOP).
- **Dysfunction:** Parkinson's (loss of dopamine → excessive inhibition), Huntington's (striatal degeneration → loss of indirect pathway brake).

## White Matter Tracts
- **Corpus Callosum:** Largest commissure. Genu (frontal), body (central), splenium (occipital). Damage → interhemispheric disconnection (split-brain syndrome).
- **Internal Capsule:** Dense corticospinal, corticobulbar, and thalamocortical fibers. Posterior limb contains corticospinal tract — lacunar infarct here → pure motor stroke.
- **Uncinate Fasciculus:** Orbitofrontal ↔ anterior temporal; damaged in behavioral variant FTD.
- **Arcuate Fasciculus / Superior Longitudinal Fasciculus:** Broca's ↔ Wernicke's; damage → conduction aphasia.

## Brainstem
- **Midbrain:** Superior colliculus (visual reflexes), inferior colliculus (auditory reflexes), PAG (pain modulation), substantia nigra, red nucleus, CN III/IV nuclei.
- **Pons:** Basis pontis (corticopontine-cerebellar relay), CN V/VI/VII/VIII nuclei, respiratory pneumotaxic center, horizontal gaze center (PPRF).
- **Medulla:** CN IX/X/XI/XII nuclei, respiratory centers (DRG/VRG), cardiovascular control, pyramidal decussation.

## Cerebellum
Three functional divisions: vestibulocerebellum (balance), spinocerebellum (limb/gait coordination), cerebrocerebellum (motor planning). Output via deep cerebellar nuclei (dentate → thalamus VL → motor cortex). Cerebellar lesions are ipsilateral — the cerebellum coordinates ipsilateral limb movement.`,
    },
    {
      topicId: T["Cranial Nerves"],
      title: "Cranial Nerves — Study Guide",
      content: `## Overview

There are 12 pairs of cranial nerves (CN I–XII), numbered by their anterior-to-posterior emergence from the brain. They mediate sensory, motor, and autonomic functions of the head, neck, and viscera. Mastery of cranial nerves is essential for neurological localization and clinical examination.

**Fiber types:** Somatic motor (skeletal muscle), somatic sensory (touch/pain from skin), special sensory (vision, hearing, taste, smell, balance), visceral motor (autonomic/parasympathetic), and visceral sensory (visceral afferents).

## CN I — Olfactory (Sensory)
- **Function:** Smell (olfaction)
- **Pathway:** Olfactory epithelium (nasal mucosa) → cribriform plate → olfactory bulb → olfactory tract → primary olfactory cortex (piriform cortex, amygdala)
- **Unique:** ONLY cranial nerve that does NOT relay through the thalamus; most direct cortical connection
- **Lesion:** Anosmia (loss of smell). Clinical testing: each nostril tested separately with recognizable, non-pungent scents (pungent substances test CN V)
- **Clinical relevance:** Olfactory groove meningiomas; cribriform plate trauma; COVID-19-related anosmia

## CN II — Optic (Sensory)
- **Function:** Vision
- **Pathway:** Retinal ganglion cells → optic nerve → optic chiasm (nasal fibers decussate) → optic tract → LGN thalamus → optic radiations → V1 (calcarine cortex)
- **Visual field defects by location:**
  - Optic nerve: monocular blindness (ipsilateral)
  - Chiasm: bitemporal hemianopia (pituitary tumor from below)
  - Optic tract/radiation/cortex: contralateral homonymous hemianopia
  - PCA territory: hemianopia with macular sparing
- **RAPD (Marcus Gunn pupil):** CN II damage causes less afferent signal → paradoxical dilation on swinging flashlight test

## CN III — Oculomotor (Motor + Parasympathetic)
- **Motor:** Superior rectus, inferior rectus, medial rectus, inferior oblique (4/6 extraocular muscles), levator palpebrae superioris
- **Parasympathetic:** Pupillary constriction (sphincter pupillae) and accommodation (ciliary muscle) — via Edinger-Westphal nucleus → ciliary ganglion
- **CN III palsy:** Ptosis, mydriasis (dilated fixed pupil), eye deviates "down and out" (CN IV and VI unopposed)
- **Compressive vs. ischemic:** Compressive (aneurysm) → pupil involved early (parasympathetics on outside). Ischemic (diabetes) → pupil spared

## CN IV — Trochlear (Motor)
- **Motor:** Superior oblique (depresses adducted eye — looking down-in)
- **Unique:** Only CN that exits the DORSAL brainstem; decussates before emerging; longest intracranial course
- **Lesion:** Vertical diplopia worse going downstairs or reading; patient tilts head away from lesion (compensates by excyclotorsion)

## CN V — Trigeminal (Sensory + Motor) — LARGEST CN
- **Sensory:** Entire face, scalp, cornea, nasal/oral mucosa
  - V1 (Ophthalmic): forehead, eye, nose tip → superior orbital fissure
  - V2 (Maxillary): cheek, upper lip/teeth, palate → foramen rotundum
  - V3 (Mandibular): lower face, chin, lower teeth, tongue (general sensation) → foramen ovale
- **Motor (V3 only):** Muscles of mastication (masseter, temporalis, pterygoids), mylohyoid, anterior digastric, tensor tympani/veli palatini
- **Reflexes:** Corneal reflex (afferent V1, efferent VII); jaw jerk reflex (both limbs V3)
- **Trigeminal neuralgia:** Lancinating facial pain (V2/V3), triggered by light touch; treat with carbamazepine

## CN VI — Abducens (Motor)
- **Motor:** Lateral rectus (abducts eye)
- **Lesion:** Esotropia (medial deviation); cannot abduct ipsilateral eye; horizontal diplopia on ipsilateral gaze
- **Vulnerable in raised ICP:** Long intracranial course bending over petrous ridge → false localizing sign

## CN VII — Facial (Motor + Sensory + Parasympathetic)
- **Motor:** All muscles of facial expression
- **Sensory:** Taste from anterior 2/3 tongue (chorda tympani branch)
- **Parasympathetic:** Lacrimal gland (greater petrosal nerve → pterygopalatine ganglion); submandibular/sublingual glands (chorda tympani → submandibular ganglion)
- **UMN vs. LMN palsy:**
  - UMN (cortical stroke): contralateral lower face only — forehead SPARED (bilateral cortical representation)
  - LMN (Bell's palsy): complete ipsilateral face paralysis INCLUDING forehead
- **Bell's palsy:** Idiopathic (HSV-1), entire ipsilateral face, possible taste loss and hyperacusis. Treat with steroids ± antivirals

## CN VIII — Vestibulocochlear (Sensory)
- **Cochlear division:** Hearing — hair cells of organ of Corti → spiral ganglion → cochlear nucleus (pons) → superior olivary complex → inferior colliculus → MGN → auditory cortex
- **Vestibular division:** Balance — semicircular canals (rotational) + otolith organs (linear; saccule and utricle) → vestibular nuclei → cerebellum/spinal cord/ocular motor nuclei
- **Lesion:** Sensorineural hearing loss, tinnitus, vertigo, nystagmus
- **Acoustic neuroma (vestibular schwannoma):** Cerebellopontine angle; also compresses CN VII, V

## CN IX — Glossopharyngeal (Mixed)
- **Sensory:** Posterior 1/3 tongue (taste), pharynx/soft palate (gag reflex afferent), carotid body/sinus (chemoreception/baroreception)
- **Motor:** Stylopharyngeus (elevates pharynx)
- **Parasympathetic:** Parotid gland (via otic ganglion)
- **Gag reflex:** Afferent limb

## CN X — Vagus (Mixed) — WIDEST DISTRIBUTION
- **Motor:** Pharyngeal and laryngeal muscles (voice and swallowing); recurrent laryngeal nerve → all intrinsic laryngeal muscles except cricothyroid
- **Sensory:** Ear, pharynx, larynx, thorax, abdomen (to splenic flexure)
- **Parasympathetic:** Heart (slows rate), lungs (bronchodilation), GI (peristalsis, secretion)
- **Gag reflex:** Efferent limb
- **Lesion:** Dysphonia, dysphagia, uvular deviation AWAY from lesion, absent gag

## CN XI — Spinal Accessory (Motor)
- **Motor:** Sternocleidomastoid (SCM — ipsilateral neck flexion, contralateral head rotation); trapezius (shoulder elevation/shrugging)
- **Arises from C1–C5 spinal cord, ascends through foramen magnum**
- **Lesion:** Ipsilateral shoulder drop, weakness turning head to contralateral side

## CN XII — Hypoglossal (Motor)
- **Motor:** All intrinsic tongue muscles and most extrinsic (genioglossus, hyoglossus, styloglossus)
- **LMN lesion:** Tongue deviates TOWARD the lesion (ipsilateral genioglossus cannot push tongue away); atrophy and fasciculations
- **UMN lesion:** Tongue deviates AWAY from the lesion (same side as limb weakness)

## Key Clinical Reflexes
| Reflex | Afferent | Efferent |
|--------|----------|----------|
| Corneal | CN V1 | CN VII |
| Gag | CN IX | CN X |
| Pupillary light | CN II | CN III |
| Jaw jerk | CN V3 | CN V3 |

## Parasympathetic Cranial Nerves (3, 7, 9, 10)
- **CN III:** Ciliary ganglion → pupil constriction and accommodation
- **CN VII:** Pterygopalatine ganglion (lacrimation); submandibular ganglion (sublingual/submandibular salivation)
- **CN IX:** Otic ganglion → parotid salivation
- **CN X:** Distributed ganglia → cardiac, pulmonary, GI parasympathetics`,
    },
    {
      topicId: T["Vascular System of the Brain"],
      title: "Vascular System of the Brain — Study Guide",
      content: `## Overview

The brain receives approximately 20% of cardiac output despite being only 2% of body weight, and consumes 20% of the body's oxygen. It lacks significant energy stores, making it exquisitely sensitive to ischemia — irreversible damage begins within 4–6 minutes of complete blood flow cessation. Understanding the cerebral vasculature is essential for stroke localization, clinical examination, and treatment decisions.

## The Anterior Circulation (Internal Carotid System)

### Internal Carotid Artery (ICA)
- Arises from the common carotid artery at the carotid bifurcation (level C4)
- Enters the skull via the carotid canal in the petrous temporal bone
- Traverses the cavernous sinus (forming the carotid siphon — C-shaped curve)
- Terminates as ACA and MCA

**Branches of the ICA:**
1. **Ophthalmic artery** (first intracranial branch): retina (central retinal artery), optic nerve, orbit. Occlusion → monocular blindness. Transient occlusion → amaurosis fugax ("shade coming down").
2. **Posterior communicating artery (PCoA):** Connects ICA to PCA; second most common aneurysm site → compressive CN III palsy.
3. **Anterior choroidal artery (AChA):** Supplies posterior limb of internal capsule, hippocampus, amygdala, globus pallidus, optic tract. Occlusion → contralateral hemiplegia + hemisensory loss + hemianopia.

### Anterior Cerebral Artery (ACA)
- Supplies the medial frontal and parietal lobes (medial homunculus — leg/foot area)
- Connected across midline by the anterior communicating artery (ACoA) — most common aneurysm site
- **ACA infarct:** Contralateral leg/foot weakness (> arm/face), urinary incontinence, abulia, akinesia, frontal behavioral changes. Bilateral → paraplegia + profound behavioral syndrome.

### Middle Cerebral Artery (MCA)
- The largest cerebral artery; direct continuation of the ICA
- Supplies the lateral surface of frontal, parietal, and temporal lobes
- Gives off lenticulostriate arteries (basal ganglia, internal capsule)
- Most common artery involved in embolic stroke

**MCA territory:** Primary motor/sensory cortex for face/arm, Broca's and Wernicke's areas, optic radiations, frontal eye fields.

**MCA syndrome — dominant (left) hemisphere:**
- Contralateral hemiplegia and hemisensory loss (face/arm > leg)
- Contralateral homonymous hemianopia (optic radiations)
- Aphasia: global (total MCA), Broca's (superior division), Wernicke's (inferior division)
- Contralateral gaze deviation toward lesion (frontal eye field damage)

**MCA syndrome — non-dominant (right) hemisphere:**
- Contralateral hemiplegia and hemisensory loss
- Hemispatial neglect, anosognosia (unawareness of deficits)
- Aprosodia, constructional apraxia

## The Posterior Circulation (Vertebrobasilar System)

### Vertebral Arteries
- Arise from the subclavian arteries; ascend through the transverse foramina of C6–C1
- Enter the skull through the foramen magnum
- Give off: **anterior spinal artery** (anterior 2/3 of cervical spinal cord) and **PICA**
- Join at the pontomedullary junction to form the basilar artery

### PICA (Posterior Inferior Cerebellar Artery)
- Largest vertebral artery branch
- Supplies: lateral medulla, inferior cerebellar surface, choroid plexus of 4th ventricle
- **Occlusion → Wallenberg syndrome (lateral medullary syndrome):**
  - Ipsilateral: face pain/numbness (CN V nucleus), limb ataxia (inferior cerebellar peduncle), Horner's syndrome (descending sympathetic), hoarseness/dysphagia (CN IX/X nuclei)
  - Contralateral: body pain and temperature loss (spinothalamic tract)
  - KEY: ipsilateral face loss + contralateral body loss = crossed sensory deficit

### Basilar Artery
- Runs along the ventral pons
- **Branches:** AICA (lower), pontine perforators (midline), SCA (upper), PCAs (terminal)
- **Basilar thrombosis:** Devastating — often fatal or locked-in syndrome
- **Top of basilar syndrome:** Bilateral PCA territory + thalami → cortical blindness, amnesia, behavioral changes, oculomotor abnormalities

### AICA (Anterior Inferior Cerebellar Artery)
- Supplies: anterior-inferior cerebellum, lateral pons (CN VII, VIII nuclei), labyrinthine artery
- **Occlusion:** Ipsilateral facial palsy (CN VII), deafness/tinnitus (CN VIII), vertigo, ataxia + contralateral body pain/temp loss

### SCA (Superior Cerebellar Artery)
- Supplies: superior cerebellar surface, deep cerebellar nuclei, upper lateral pons
- **Occlusion:** Ipsilateral cerebellar ataxia, Horner's, contralateral pain/temp loss

### Posterior Cerebral Artery (PCA)
- Terminal branches of the basilar artery (may arise from ICA as "fetal PCA" in 15–20%)
- Supplies: occipital lobe (V1/V2), inferior temporal lobe (hippocampus, fusiform), posterior thalamus (thalamogeniculate arteries), midbrain
- **PCA infarct:**
  - Contralateral homonymous hemianopia (usually macular sparing — dual MCA/PCA supply to macula)
  - Left PCA: alexia without agraphia (V1 + splenium), color anomia, memory loss (hippocampus)
  - Right PCA: prosopagnosia, visual neglect
  - Both PCAs: cortical blindness with Anton's syndrome (patient denies blindness)
  - Midbrain perforators: Weber's syndrome (CN III palsy + contralateral hemiplegia)
  - Thalamus (paramedian): artery of Percheron occlusion → bilateral thalamic infarcts, amnesia, hypersomnolence, vertical gaze palsy

## Circle of Willis

An anastomotic ring at the base of the brain providing collateral circulation:
- **Anterior communicating artery (ACoA):** Connects two ACAs — most common aneurysm site
- **Posterior communicating arteries (PCoA):** Connect ICA to PCA — second most common aneurysm
- Complete Circle of Willis is present in only ~25% of individuals — many have hypoplastic segments reducing collateral reserve

## Small Vessel Disease

### Lacunar Infarcts
Small (<15mm) subcortical infarcts from occlusion of perforating arteries, caused by lipohyalinosis (hypertension, diabetes).

| Syndrome | Location |
|----------|----------|
| Pure motor stroke | Posterior limb IC or pons |
| Pure sensory stroke | Thalamus (VPL nucleus) |
| Sensorimotor stroke | IC/thalamus junction |
| Ataxic hemiparesis | Pons or posterior limb IC |
| Clumsy hand-dysarthria | Pons or IC |

### Hypertensive Hemorrhage
Rupture of Charcot-Bouchard microaneurysms in lenticulostriate/thalamoperforating arteries.
Locations (frequency order): **Putamen > Thalamus > Pons > Cerebellum > Subcortical white matter**

## Watershed Infarcts
At boundary zones between major arterial territories — caused by systemic hypoperfusion:
- **ACA-MCA border zone (superior):** "Man in a barrel" — proximal arm weakness, face/leg spared
- **MCA-PCA border zone (posterior):** Transcortical aphasia (speech preserved but repetition impaired) or cortical blindness

## Venous Drainage

**Superficial system:** Cortical veins → superior sagittal sinus (along falx) → confluence of sinuses → transverse sinuses → sigmoid sinuses → internal jugular vein.

**Deep system:** Internal cerebral veins + basal veins → great vein of Galen → straight sinus → confluence.

**Cavernous sinus:** Contains CN III, IV, V1, V2, VI, and the ICA. Thrombosis causes proptosis, ophthalmoplegia, chemosis.

**Cerebral venous sinus thrombosis (CVST):** Venous congestion → raised ICP, headache, papilledema, seizures, hemorrhagic venous infarction. Associated with hypercoagulability, OCP, pregnancy. Treat with anticoagulation (even with hemorrhage).

## Stroke Pathophysiology

**Ischemic stroke (85%):**
- **Thrombotic:** Atherosclerotic plaque at bifurcations (carotid bifurcation, MCA, basilar)
- **Embolic:** Cardioembolism (AF, valvular, LV thrombus) or artery-to-artery embolism — often abrupt onset with hemorrhagic transformation
- **Lacunar:** Small perforating artery occlusion from lipohyalinosis

**Hemorrhagic stroke (15%):**
- Intracerebral hemorrhage: hypertension, amyloid angiopathy, AVM, coagulopathy
- Subarachnoid hemorrhage: aneurysm rupture (80%), AVM, unknown

**Ischemic core vs. penumbra:** The core (complete ischemia) dies within minutes. The penumbra (partial ischemia, electrically silent but viable) can survive hours — the target of acute treatment (IV tPA within 4.5h; mechanical thrombectomy for large vessel occlusion within 24h in selected patients).

## Key Vascular Principles
- **Autoregulation:** CBF maintained constant (50 mL/100g/min) across MAP 50–150 mmHg by vasoconstriction/dilation. Lost in severe ischemia and TBI.
- **CPP = MAP − ICP:** Target CPP >70 mmHg in TBI management.
- **BBB:** Tight junctions of endothelium + pericytes + astrocytic end-feet. Broken in ischemia → vasogenic edema. Absent at circumventricular organs.
- **Amaurosis fugax:** TIA of the ophthalmic/central retinal artery → monocular visual loss → indicator of ipsilateral ICA disease.`,
    },
  ];

  await db.insert(studyGuidesTable).values(studyGuides);
  console.log(`  ✓ ${studyGuides.length} study guides inserted`);

  // ===========================================================================
  // PRACTICE EXAMS (1 per topic, using first 5 quiz questions from each)
  // ===========================================================================
  const questionsByTopic: Record<number, number[]> = {};
  for (const q of insertedQuestions) {
    if (!questionsByTopic[q.topicId]) questionsByTopic[q.topicId] = [];
    questionsByTopic[q.topicId].push(q.id);
  }

  const examDefs = [
    { topicId: T["Brain Structures"], title: "Brain Structures — Practice Exam" },
    { topicId: T["Cranial Nerves"], title: "Cranial Nerves — Practice Exam" },
    { topicId: T["Vascular System of the Brain"], title: "Vascular System of the Brain — Practice Exam" },
  ];

  const insertedExams = await db.insert(practiceExamsTable).values(
    examDefs.map(e => ({
      topicId: e.topicId,
      title: e.title,
      timeLimit: 600,
      passingScore: 70,
    }))
  ).returning();

  const examQuestionLinks = [];
  for (const exam of insertedExams) {
    const qIds = questionsByTopic[exam.topicId] ?? [];
    const selected = qIds.slice(0, 5);
    for (let i = 0; i < selected.length; i++) {
      examQuestionLinks.push({ examId: exam.id, questionId: selected[i], questionOrder: i + 1 });
    }
  }

  if (examQuestionLinks.length > 0) {
    await db.insert(practiceExamQuestionsTable).values(examQuestionLinks);
  }

  console.log(`  ✓ ${insertedExams.length} practice exams inserted`);
  console.log(`\n✅ Done! Added 3 new Foundation topics:`);
  topics.forEach(t => console.log(`   • ${t.name} (id: ${t.id})`));
}

addFoundationTopics()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
