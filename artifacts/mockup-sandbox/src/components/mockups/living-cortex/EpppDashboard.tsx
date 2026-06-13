import { CortexStage, type CortexZone } from "./_CortexStage";

const ZONES: CortexZone[] = [
  // left hemisphere (anterior → posterior)
  { id: "d1", label: "Domain I", title: "Biological Bases", pct: 100, mastered: true, side: "left", zx: 492, zy: 228, cx: 24, cy: 150 },
  { id: "d3", label: "Domain III", title: "Social & Cultural", pct: 64, side: "left", zx: 462, zy: 338, cx: 24, cy: 300 },
  { id: "d5", label: "Domain V", title: "Assessment & Diagnosis", pct: 47, side: "left", zx: 474, zy: 452, cx: 24, cy: 450 },
  { id: "d7", label: "Domain VII", title: "Research & Statistics", pct: 22, side: "left", zx: 508, zy: 560, cx: 24, cy: 600 },
  // right hemisphere
  { id: "d2", label: "Domain II", title: "Cognitive-Affective", pct: 71, side: "right", zx: 628, zy: 228, cx: 828, cy: 150 },
  { id: "d4", label: "Domain IV", title: "Lifespan Development", pct: 55, side: "right", zx: 658, zy: 338, cx: 828, cy: 300 },
  { id: "d6", label: "Domain VI", title: "Treatment & Intervention", pct: 38, side: "right", zx: 646, zy: 452, cx: 828, cy: 450 },
  { id: "d8", label: "Domain VIII", title: "Ethical & Legal", pct: 9, side: "right", zx: 612, zy: 560, cx: 828, cy: 600 },
];

const PASSED: Record<string, [number, number]> = {
  d1: [12, 12], d3: [7, 11], d5: [8, 17], d7: [3, 14],
  d2: [10, 14], d4: [6, 11], d6: [9, 24], d8: [1, 11],
};

export function EpppDashboard() {
  return (
    <div style={{ background: "#062c35", minHeight: "100vh" }}>
      <CortexStage
        brain="superior"
        overline="EPPP Command Center"
        heading="The Living Cortex"
        overallPct={47}
        overallLabel="exam readiness across 8 domains"
        zones={ZONES}
      />

      {/* context: existing Domain Progress grid sits BELOW, untouched */}
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
          Domain Progress
          <span style={{ flex: 1, height: 1, background: "rgba(118,228,247,0.18)" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {ZONES.map((z) => {
            const [passed, total] = PASSED[z.id];
            return (
              <div
                key={z.id}
                style={{
                  padding: 16,
                  borderRadius: 18,
                  background: "rgba(17,90,108,0.45)",
                  border: "1px solid rgba(118,228,247,0.18)",
                  backdropFilter: "blur(16px)",
                }}
              >
                <div style={{ fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase", color: "#7fbfd0", fontWeight: 600 }}>
                  {z.label}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                  <span style={{ color: "#f4fbff", fontWeight: 600, fontSize: 14 }}>{z.title}</span>
                  {z.mastered && (
                    <span style={{ fontSize: 10, color: "#062c35", background: "#76e4f7", padding: "2px 7px", borderRadius: 9999, fontWeight: 700 }}>
                      Mastered
                    </span>
                  )}
                </div>
                <div style={{ marginTop: 12, height: 6, borderRadius: 9999, background: "rgba(118,228,247,0.14)" }}>
                  <div style={{ width: `${z.pct}%`, height: "100%", borderRadius: 9999, background: z.mastered ? "#76e4f7" : "#68ccde" }} />
                </div>
                <div style={{ marginTop: 8, fontSize: 12, color: "#a9c6cf" }}>
                  {z.pct}% · {passed}/{total} lessons
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
