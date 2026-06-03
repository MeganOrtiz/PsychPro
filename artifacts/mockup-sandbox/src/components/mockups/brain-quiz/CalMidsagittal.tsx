import { DiagramCalib } from "./_calib";
export function CalMidsagittal() {
  return (
    <DiagramCalib
      title="Midsagittal"
      src="/__mockup/images/bl-midsagittal.png"
      markers={[
        { id: "posterior-cingulate", name: "Post. cingulate", x: 57, y: 34 },
        { id: "fornix", name: "Fornix", x: 41, y: 47 },
        { id: "mammillary-bodies", name: "Mammillary", x: 42, y: 57 },
        { id: "hippocampus", name: "Hippocampus", x: 36, y: 62 },
        { id: "amygdala", name: "Amygdala", x: 30, y: 60 },
        { id: "midbrain", name: "Midbrain", x: 51, y: 57 },
        { id: "locus-coeruleus", name: "Locus coeruleus", x: 53, y: 62 },
        { id: "pons", name: "Pons", x: 50, y: 66 },
        { id: "medulla", name: "Medulla", x: 49, y: 77 },
        { id: "cerebellum", name: "Cerebellum", x: 71, y: 69 },
        { id: "corpus-callosum", name: "Corpus callosum", x: 47, y: 39 },
        { id: "pineal-gland", name: "Pineal gland", x: 55, y: 49, isNew: true },
        { id: "optic-chiasm", name: "Optic chiasm", x: 31, y: 61, isNew: true },
      ]}
    />
  );
}
