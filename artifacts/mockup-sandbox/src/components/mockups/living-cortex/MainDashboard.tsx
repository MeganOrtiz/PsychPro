import { CortexStage, type CortexZone } from "./_CortexStage";

const ZONES: CortexZone[] = [
  // left hemisphere chips (anterior → posterior)
  { id: "foundations", label: "Course", title: "Foundations", pct: 100, mastered: true, side: "left", zx: 488, zy: 250, cx: 36, cy: 168 },
  { id: "neuroanatomy", label: "Course", title: "Neuroanatomy", pct: 72, side: "left", zx: 470, zy: 388, cx: 36, cy: 360 },
  { id: "neuroscience", label: "Course", title: "Neuroscience", pct: 41, side: "left", zx: 502, zy: 528, cx: 36, cy: 552 },
  // right hemisphere chips
  { id: "clinical", label: "Course", title: "Clinical", pct: 58, side: "right", zx: 632, zy: 250, cx: 816, cy: 168 },
  { id: "neuropsychology", label: "Course", title: "Neuropsychology", pct: 33, side: "right", zx: 650, zy: 388, cx: 816, cy: 360 },
  { id: "assessment", label: "Course", title: "Assessment", pct: 14, side: "right", zx: 618, zy: 528, cx: 816, cy: 552 },
];

export function MainDashboard() {
  return (
    <div style={{ background: "#062c35", minHeight: "100vh" }}>
      <CortexStage
        brain="superior"
        overline="Your Mind, Mapped"
        heading="The Living Cortex"
        overallPct={53}
        overallLabel="overall course mastery"
        zones={ZONES}
      />

      {/* context: existing Course Mastery grid sits BELOW, untouched */}
      <div className="lc-root" style={{ background: "#062c35", padding: "8px 40px 56px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "var(--lc-mist)",
            fontWeight: 600,
            fontSize: 15,
            letterSpacing: "0.04em",
            marginBottom: 16,
            opacity: 0.9,
          }}
        >
          <span style={{ flex: 1, height: 1, background: "rgba(118,228,247,0.18)" }} />
          Course Mastery
          <span style={{ flex: 1, height: 1, background: "rgba(118,228,247,0.18)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {ZONES.map((z) => (
            <div
              key={z.id}
              style={{
                padding: 18,
                borderRadius: 18,
                background: "rgba(17,90,108,0.45)",
                border: "1px solid rgba(118,228,247,0.18)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "#f4fbff", fontWeight: 600 }}>{z.title}</span>
                {z.mastered && (
                  <span style={{ fontSize: 11, color: "#062c35", background: "#76e4f7", padding: "2px 8px", borderRadius: 9999, fontWeight: 700 }}>
                    Mastered
                  </span>
                )}
              </div>
              <div style={{ marginTop: 12, height: 6, borderRadius: 9999, background: "rgba(118,228,247,0.14)" }}>
                <div style={{ width: `${z.pct}%`, height: "100%", borderRadius: 9999, background: z.mastered ? "#76e4f7" : "#68ccde" }} />
              </div>
              <div style={{ marginTop: 8, fontSize: 12.5, color: "#a9c6cf" }}>{z.pct}% mastered</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
