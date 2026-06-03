// Before / after of the PsychPro "Courses" left rail (CourseRailButton).
// BEFORE = the washed-out white-tint glass (bg-white/[0.04]) that let the brain
// background bleed through. AFTER = the crisp dark-cerulean glass now live in
// artifacts/neuronotes/src/pages/topics.tsx. Long names wrap instead of cutting.
const COURSES = [
  { name: "Assessment", count: 3, icon: "▤", active: true },
  { name: "Neuropsychology", count: 6, icon: "〜" },
  { name: "Neuroscience", count: 12, icon: "⚛" },
  { name: "Pediatric & Neuropsychology", count: 7, icon: "▦" },
  { name: "Psychology", count: 2, icon: "🧠" },
  { name: "Psychotherapy", count: 10, icon: "💬" },
];

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ width: 300 }}>
      <div
        style={{
          fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase",
          color: "#7FBFD0", fontWeight: 600, marginBottom: 14,
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
    </div>
  );
}

export function BeforeAfter() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 40,
        display: "flex",
        gap: 56,
        boxSizing: "border-box",
        color: "#F4FBFF",
        fontFamily: "Inter, system-ui, sans-serif",
        background:
          "radial-gradient(1100px 700px at 75% -10%, #103a4d 0%, rgba(16,58,77,0) 55%), linear-gradient(180deg, #061F2B 0%, #03151D 100%)",
      }}
    >
      {/* BEFORE — muddy white-tint */}
      <Panel title="Before — muddy">
        {COURSES.map((c) => (
          <button
            key={c.name}
            style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%",
              padding: "10px 12px", borderRadius: 8, textAlign: "left", cursor: "pointer",
              backdropFilter: "blur(12px)",
              color: c.active ? "#fff" : "rgba(255,255,255,0.80)",
              background: c.active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
              border: c.active
                ? "1px solid rgba(118,228,247,0.65)"
                : "1px solid rgba(255,255,255,0.10)",
              boxShadow: c.active
                ? "0 12px 32px -10px rgba(118,228,247,0.5), inset 0 1px 0 0 rgba(255,255,255,0.16)"
                : "none",
            }}
          >
            <span style={{ color: "#76E4F7", fontSize: 16, width: 16, textAlign: "center" }}>{c.icon}</span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  display: "block", fontSize: 14, fontWeight: 500, lineHeight: 1.2,
                  whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}
              >
                {c.name}
              </span>
              <span style={{ display: "block", fontSize: 11, marginTop: 2, color: "rgba(167,243,255,0.60)" }}>
                {c.count} {c.count === 1 ? "lesson" : "lessons"}
              </span>
            </span>
          </button>
        ))}
      </Panel>

      {/* AFTER — crisp dark cerulean (live) */}
      <Panel title="After — crisp cerulean (live)">
        {COURSES.map((c) => (
          <button
            key={c.name}
            style={{
              display: "flex", alignItems: "center", gap: 12, width: "100%",
              padding: "10px 12px", borderRadius: 8, textAlign: "left", cursor: "pointer",
              backdropFilter: "blur(12px)",
              color: c.active ? "#F4FBFF" : "rgba(244,251,255,0.92)",
              background: c.active
                ? "linear-gradient(135deg, rgba(118,228,247,0.15), rgba(10,45,61,0.90))"
                : "linear-gradient(135deg, rgba(10,45,61,0.78), rgba(2,13,18,0.86))",
              border: c.active
                ? "1px solid rgba(118,228,247,0.55)"
                : "1px solid rgba(118,228,247,0.20)",
              boxShadow: c.active
                ? "0 14px 34px -14px rgba(118,228,247,0.55), inset 0 1px 0 0 rgba(255,255,255,0.10)"
                : "inset 0 1px 0 0 rgba(255,255,255,0.05)",
            }}
          >
            <span
              style={{
                width: 36, height: 36, flexShrink: 0, borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "radial-gradient(circle at 50% 40%, rgba(118,228,247,0.18), rgba(10,45,61,0.55) 70%)",
                border: "1px solid rgba(118,228,247,0.28)",
              }}
            >
              <span
                style={{
                  color: "#76E4F7", fontSize: 16,
                  filter: c.active
                    ? "drop-shadow(0 0 6px rgba(118,228,247,0.85))"
                    : "drop-shadow(0 0 3px rgba(118,228,247,0.45))",
                }}
              >
                {c.icon}
              </span>
            </span>
            <span style={{ flex: 1, minWidth: 0 }}>
              <span
                style={{
                  display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                  overflow: "hidden", fontSize: 14, fontWeight: 500, lineHeight: 1.3,
                }}
              >
                {c.name}
              </span>
              <span
                style={{
                  display: "block", fontSize: 11, marginTop: 2,
                  color: c.active ? "rgba(167,243,255,0.87)" : "rgba(167,243,255,0.67)",
                }}
              >
                {c.count} {c.count === 1 ? "lesson" : "lessons"}
              </span>
            </span>
            <span style={{ color: "#76E4F7", fontSize: 14, opacity: c.active ? 0.9 : 0 }}>›</span>
          </button>
        ))}
      </Panel>
    </div>
  );
}
