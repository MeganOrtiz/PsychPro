import BrainQuiz, { type QuizItem } from "./_BrainQuiz";

const ITEMS: QuizItem[] = [
  {
    "id": "prefrontal-cortex",
    "name": "Prefrontal Cortex (DLPFC)",
    "shortName": "Prefrontal Cortex (DLPFC)",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 14,
    "y": 46,
    "blurb": "Working memory maintenance and manipulation"
  },
  {
    "id": "frontal-lobe",
    "name": "Frontal Lobe",
    "shortName": "Frontal Lobe",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 25,
    "y": 34,
    "blurb": "Voluntary motor planning and execution"
  },
  {
    "id": "motor-cortex",
    "name": "Primary Motor Cortex",
    "shortName": "Primary Motor Cortex",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 41,
    "y": 20,
    "blurb": "Initiation of voluntary movement"
  },
  {
    "id": "somatosensory-cortex",
    "name": "Primary Somatosensory Cortex",
    "shortName": "Primary Somatosensory Cortex",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 49,
    "y": 20,
    "blurb": "Conscious perception of touch, pain, and temperature"
  },
  {
    "id": "parietal-lobe",
    "name": "Parietal Lobe",
    "shortName": "Parietal Lobe",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 60,
    "y": 28,
    "blurb": "Primary somatosensation (postcentral gyrus)"
  },
  {
    "id": "occipital-lobe",
    "name": "Occipital Lobe",
    "shortName": "Occipital Lobe",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 82,
    "y": 42,
    "blurb": "Primary visual processing (V1, calcarine cortex)"
  },
  {
    "id": "temporal-lobe",
    "name": "Temporal Lobe",
    "shortName": "Temporal Lobe",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 44,
    "y": 66,
    "blurb": "Primary auditory cortex (Heschl's gyrus)"
  },
  {
    "id": "orbitofrontal-cortex",
    "name": "Orbitofrontal Cortex",
    "shortName": "Orbitofrontal Cortex",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 20,
    "y": 60,
    "blurb": "Reward valuation and reversal learning"
  },
  {
    "id": "broca-area",
    "name": "Broca's Area",
    "shortName": "Broca's Area",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 27,
    "y": 52,
    "blurb": "Speech production and articulation planning"
  },
  {
    "id": "wernicke-area",
    "name": "Wernicke's Area",
    "shortName": "Wernicke's Area",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 58,
    "y": 54,
    "blurb": "Comprehension of spoken and written language"
  },
  {
    "id": "auditory-cortex",
    "name": "Primary Auditory Cortex",
    "shortName": "Primary Auditory Cortex",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 49,
    "y": 57,
    "blurb": "Processes pitch, loudness, and the timing of sound"
  },
  {
    "id": "supramarginal-gyrus",
    "name": "Supramarginal Gyrus",
    "shortName": "Supramarginal Gyrus",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 61,
    "y": 40,
    "blurb": "Phonological processing of language"
  },
  {
    "id": "angular-gyrus",
    "name": "Angular Gyrus",
    "shortName": "Angular Gyrus",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 67,
    "y": 45,
    "blurb": "Reading and writing (mapping symbols to meaning)"
  },
  {
    "id": "posterior-cingulate",
    "name": "Posterior Cingulate Cortex",
    "shortName": "Posterior Cingulate Cortex",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 57,
    "y": 34,
    "blurb": "Self-referential thought and autobiographical recall"
  },
  {
    "id": "fornix",
    "name": "Fornix",
    "shortName": "Fornix",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 41,
    "y": 47,
    "blurb": "Carries hippocampal output to mammillary bodies and septal nuclei"
  },
  {
    "id": "mammillary-bodies",
    "name": "Mammillary Bodies",
    "shortName": "Mammillary Bodies",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 42,
    "y": 57,
    "blurb": "Relay memory signals from hippocampus to anterior thalamus"
  },
  {
    "id": "hippocampus",
    "name": "Hippocampus",
    "shortName": "Hippocampus",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 36,
    "y": 62,
    "blurb": "Encoding episodic and semantic memory"
  },
  {
    "id": "amygdala",
    "name": "Amygdala",
    "shortName": "Amygdala",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 30,
    "y": 60,
    "blurb": "Fear conditioning and threat detection"
  },
  {
    "id": "midbrain",
    "name": "Midbrain",
    "shortName": "Midbrain",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 51,
    "y": 57,
    "blurb": "Eye movement control (CN III, IV nuclei)"
  },
  {
    "id": "locus-coeruleus",
    "name": "Locus Coeruleus",
    "shortName": "Locus Coeruleus",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 53,
    "y": 62,
    "blurb": "Sole source of cortical norepinephrine"
  },
  {
    "id": "pons",
    "name": "Pons",
    "shortName": "Pons",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 50,
    "y": 66,
    "blurb": "Houses cranial nerve nuclei V (trigeminal), VI (abducens), VII (facial), VIII (vestibulocochlear)"
  },
  {
    "id": "medulla",
    "name": "Medulla Oblongata",
    "shortName": "Medulla Oblongata",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 49,
    "y": 77,
    "blurb": "Cardiac and respiratory rhythm generation"
  },
  {
    "id": "cerebellum",
    "name": "Cerebellum",
    "shortName": "Cerebellum",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 71,
    "y": 69,
    "blurb": "Coordinates voluntary movement and timing"
  },
  {
    "id": "pineal-gland",
    "name": "Pineal Gland",
    "shortName": "Pineal Gland",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 55,
    "y": 49,
    "blurb": "Secretes melatonin to regulate the sleep-wake cycle"
  },
  {
    "id": "corpus-callosum",
    "name": "Corpus Callosum",
    "shortName": "Corpus Callosum",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 47,
    "y": 39,
    "blurb": "Interhemispheric transfer of sensory, motor, and cognitive information"
  },
  {
    "id": "optic-chiasm",
    "name": "Optic Chiasm",
    "shortName": "Optic Chiasm",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 33,
    "y": 57,
    "blurb": "Crosses nasal retinal fibers to the opposite hemisphere"
  },
  {
    "id": "lateral-ventricles",
    "name": "Lateral Ventricles",
    "shortName": "Lateral Ventricles",
    "viewKey": "/__mockup/images/bl-coronal.png",
    "viewSrc": "/__mockup/images/bl-coronal.png",
    "viewName": "Coronal section",
    "x": 48,
    "y": 40,
    "blurb": "Produce and circulate cerebrospinal fluid (via choroid plexus)"
  },
  {
    "id": "caudate",
    "name": "Caudate Nucleus",
    "shortName": "Caudate Nucleus",
    "viewKey": "/__mockup/images/bl-coronal.png",
    "viewSrc": "/__mockup/images/bl-coronal.png",
    "viewName": "Coronal section",
    "x": 44,
    "y": 41,
    "blurb": "Goal-directed action selection"
  },
  {
    "id": "globus-pallidus",
    "name": "Globus Pallidus",
    "shortName": "Globus Pallidus",
    "viewKey": "/__mockup/images/bl-coronal.png",
    "viewSrc": "/__mockup/images/bl-coronal.png",
    "viewName": "Coronal section",
    "x": 40,
    "y": 50,
    "blurb": "GPi: tonic inhibition of the thalamus (motor brake)"
  },
  {
    "id": "putamen",
    "name": "Putamen",
    "shortName": "Putamen",
    "viewKey": "/__mockup/images/bl-coronal.png",
    "viewSrc": "/__mockup/images/bl-coronal.png",
    "viewName": "Coronal section",
    "x": 34,
    "y": 48,
    "blurb": "Habit learning and procedural memory"
  },
  {
    "id": "thalamus",
    "name": "Thalamus",
    "shortName": "Thalamus",
    "viewKey": "/__mockup/images/bl-coronal.png",
    "viewSrc": "/__mockup/images/bl-coronal.png",
    "viewName": "Coronal section",
    "x": 45,
    "y": 53,
    "blurb": "Relay sensory input to primary cortical areas"
  },
  {
    "id": "internal-capsule",
    "name": "Internal Capsule",
    "shortName": "Internal Capsule",
    "viewKey": "/__mockup/images/bl-coronal.png",
    "viewSrc": "/__mockup/images/bl-coronal.png",
    "viewName": "Coronal section",
    "x": 42,
    "y": 46,
    "blurb": "Carries corticospinal (motor) fibers to the body"
  }
];

export function Quiz() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{ background: "radial-gradient(120% 120% at 50% 0%, #083240 0%, #061F2B 55%, #03151D 100%)" }}
    >
      <div
        className="w-full max-w-3xl h-[820px] rounded-2xl overflow-hidden border"
        style={{ background: "#0A2D3Dcc", borderColor: "#2A738799", boxShadow: "0 30px 80px -20px #000" }}
      >
        <BrainQuiz items={ITEMS} />
      </div>
    </div>
  );
}
