import { DiagramCalib } from "./_calib";
export function CalLateral() {
  return (
    <DiagramCalib
      title="Lateral"
      src="/__mockup/images/bl-lateral.png"
      markers={[
        { id: "prefrontal-cortex", name: "Prefrontal", x: 14, y: 46 },
        { id: "frontal-lobe", name: "Frontal lobe", x: 25, y: 34 },
        { id: "motor-cortex", name: "Motor cortex", x: 41, y: 20 },
        { id: "somatosensory-cortex", name: "Somatosensory", x: 49, y: 20 },
        { id: "parietal-lobe", name: "Parietal lobe", x: 60, y: 28 },
        { id: "occipital-lobe", name: "Occipital lobe", x: 82, y: 42 },
        { id: "temporal-lobe", name: "Temporal lobe", x: 44, y: 66 },
        { id: "orbitofrontal-cortex", name: "Orbitofrontal", x: 20, y: 60 },
        { id: "broca-area", name: "Broca's area", x: 34, y: 53, isNew: true },
        { id: "wernicke-area", name: "Wernicke's area", x: 58, y: 54, isNew: true },
        { id: "auditory-cortex", name: "Auditory cortex", x: 49, y: 57, isNew: true },
        { id: "supramarginal-gyrus", name: "Supramarginal g.", x: 61, y: 40, isNew: true },
        { id: "angular-gyrus", name: "Angular gyrus", x: 67, y: 45, isNew: true },
      ]}
    />
  );
}
