import BrainQuiz, { type QuizItem } from "./_BrainQuiz";

// Real quiz data lifted from PsychPro Brain Lab (HOTSPOTS + structures),
// pointed at copies of the actual section images so this preview matches
// what signed-in users see on /brain-lab (Quiz tab).
const ITEMS: QuizItem[] = [
  {
    "id": "prefrontal-cortex",
    "name": "Prefrontal Cortex (DLPFC)",
    "shortName": "Prefrontal Cortex (DLPFC)",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 14,
    "y": 46
  },
  {
    "id": "frontal-lobe",
    "name": "Frontal Lobe",
    "shortName": "Frontal Lobe",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 25,
    "y": 34
  },
  {
    "id": "motor-cortex",
    "name": "Primary Motor Cortex",
    "shortName": "Primary Motor Cortex",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 41,
    "y": 20
  },
  {
    "id": "somatosensory-cortex",
    "name": "Primary Somatosensory Cortex",
    "shortName": "Primary Somatosensory Cortex",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 49,
    "y": 20
  },
  {
    "id": "parietal-lobe",
    "name": "Parietal Lobe",
    "shortName": "Parietal Lobe",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 60,
    "y": 28
  },
  {
    "id": "occipital-lobe",
    "name": "Occipital Lobe",
    "shortName": "Occipital Lobe",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 82,
    "y": 42
  },
  {
    "id": "temporal-lobe",
    "name": "Temporal Lobe",
    "shortName": "Temporal Lobe",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 44,
    "y": 66
  },
  {
    "id": "orbitofrontal-cortex",
    "name": "Orbitofrontal Cortex",
    "shortName": "Orbitofrontal Cortex",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 20,
    "y": 60
  },
  {
    "id": "broca-area",
    "name": "Broca's Area",
    "shortName": "Broca's Area",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 27,
    "y": 52
  },
  {
    "id": "wernicke-area",
    "name": "Wernicke's Area",
    "shortName": "Wernicke's Area",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 58,
    "y": 54
  },
  {
    "id": "auditory-cortex",
    "name": "Primary Auditory Cortex",
    "shortName": "Primary Auditory Cortex",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 49,
    "y": 57
  },
  {
    "id": "supramarginal-gyrus",
    "name": "Supramarginal Gyrus",
    "shortName": "Supramarginal Gyrus",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 61,
    "y": 40
  },
  {
    "id": "angular-gyrus",
    "name": "Angular Gyrus",
    "shortName": "Angular Gyrus",
    "viewKey": "/__mockup/images/bl-lateral.png",
    "viewSrc": "/__mockup/images/bl-lateral.png",
    "viewName": "Lateral view",
    "x": 67,
    "y": 45
  },
  {
    "id": "posterior-cingulate",
    "name": "Posterior Cingulate Cortex",
    "shortName": "Posterior Cingulate Cortex",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 57,
    "y": 34
  },
  {
    "id": "fornix",
    "name": "Fornix",
    "shortName": "Fornix",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 41,
    "y": 47
  },
  {
    "id": "mammillary-bodies",
    "name": "Mammillary Bodies",
    "shortName": "Mammillary Bodies",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 42,
    "y": 57
  },
  {
    "id": "hippocampus",
    "name": "Hippocampus",
    "shortName": "Hippocampus",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 36,
    "y": 62
  },
  {
    "id": "amygdala",
    "name": "Amygdala",
    "shortName": "Amygdala",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 30,
    "y": 60
  },
  {
    "id": "midbrain",
    "name": "Midbrain",
    "shortName": "Midbrain",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 51,
    "y": 57
  },
  {
    "id": "locus-coeruleus",
    "name": "Locus Coeruleus",
    "shortName": "Locus Coeruleus",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 53,
    "y": 62
  },
  {
    "id": "pons",
    "name": "Pons",
    "shortName": "Pons",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 50,
    "y": 66
  },
  {
    "id": "medulla",
    "name": "Medulla Oblongata",
    "shortName": "Medulla Oblongata",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 49,
    "y": 77
  },
  {
    "id": "cerebellum",
    "name": "Cerebellum",
    "shortName": "Cerebellum",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 71,
    "y": 69
  },
  {
    "id": "pineal-gland",
    "name": "Pineal Gland",
    "shortName": "Pineal Gland",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 55,
    "y": 49
  },
  {
    "id": "corpus-callosum",
    "name": "Corpus Callosum",
    "shortName": "Corpus Callosum",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 47,
    "y": 39
  },
  {
    "id": "optic-chiasm",
    "name": "Optic Chiasm",
    "shortName": "Optic Chiasm",
    "viewKey": "/__mockup/images/bl-midsagittal.png",
    "viewSrc": "/__mockup/images/bl-midsagittal.png",
    "viewName": "Midsagittal view",
    "x": 33,
    "y": 57
  },
  {
    "id": "lateral-ventricles",
    "name": "Lateral Ventricles",
    "shortName": "Lateral Ventricles",
    "viewKey": "/__mockup/images/bl-coronal.png",
    "viewSrc": "/__mockup/images/bl-coronal.png",
    "viewName": "Coronal section",
    "x": 48,
    "y": 40
  },
  {
    "id": "caudate",
    "name": "Caudate Nucleus",
    "shortName": "Caudate Nucleus",
    "viewKey": "/__mockup/images/bl-coronal.png",
    "viewSrc": "/__mockup/images/bl-coronal.png",
    "viewName": "Coronal section",
    "x": 44,
    "y": 41
  },
  {
    "id": "globus-pallidus",
    "name": "Globus Pallidus",
    "shortName": "Globus Pallidus",
    "viewKey": "/__mockup/images/bl-coronal.png",
    "viewSrc": "/__mockup/images/bl-coronal.png",
    "viewName": "Coronal section",
    "x": 40,
    "y": 50
  },
  {
    "id": "putamen",
    "name": "Putamen",
    "shortName": "Putamen",
    "viewKey": "/__mockup/images/bl-coronal.png",
    "viewSrc": "/__mockup/images/bl-coronal.png",
    "viewName": "Coronal section",
    "x": 34,
    "y": 48
  },
  {
    "id": "thalamus",
    "name": "Thalamus",
    "shortName": "Thalamus",
    "viewKey": "/__mockup/images/bl-coronal.png",
    "viewSrc": "/__mockup/images/bl-coronal.png",
    "viewName": "Coronal section",
    "x": 45,
    "y": 53
  },
  {
    "id": "internal-capsule",
    "name": "Internal Capsule",
    "shortName": "Internal Capsule",
    "viewKey": "/__mockup/images/bl-coronal.png",
    "viewSrc": "/__mockup/images/bl-coronal.png",
    "viewName": "Coronal section",
    "x": 42,
    "y": 46
  }
];

export function Quiz() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center p-6"
      style={{ background: "radial-gradient(120% 120% at 50% 0%, #083240 0%, #061F2B 55%, #03151D 100%)" }}
    >
      <div
        className="w-full max-w-3xl h-[760px] rounded-2xl overflow-hidden border"
        style={{ background: "#0A2D3Dcc", borderColor: "#2A738799", boxShadow: "0 30px 80px -20px #000" }}
      >
        <BrainQuiz items={ITEMS} />
      </div>
    </div>
  );
}
