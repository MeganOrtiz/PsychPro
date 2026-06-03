import { DiagramCalib } from "./_calib";
export function CalCoronal() {
  return (
    <DiagramCalib
      title="Coronal"
      src="/__mockup/images/bl-coronal.png"
      markers={[
        { id: "lateral-ventricles", name: "Lateral ventricles", x: 48, y: 40 },
        { id: "caudate", name: "Caudate", x: 44, y: 41 },
        { id: "globus-pallidus", name: "Globus pallidus", x: 40, y: 50 },
        { id: "putamen", name: "Putamen", x: 34, y: 48 },
        { id: "thalamus", name: "Thalamus", x: 45, y: 53 },
        { id: "internal-capsule", name: "Internal capsule", x: 41, y: 48, isNew: true },
      ]}
    />
  );
}
