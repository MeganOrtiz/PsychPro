const RADIUS = 10;

const PRIMARY = {
  idle: {
    background: "rgba(118, 228, 247, 0.26)",
    border: "1px solid rgba(118, 228, 247, 0.5)",
    boxShadow: "0 0 20px rgba(118, 228, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
    color: "#f2feff",
  },
  hover: {
    background: "rgba(118, 228, 247, 0.36)",
    border: "1px solid rgba(118, 228, 247, 0.65)",
    boxShadow: "0 0 28px rgba(118, 228, 247, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.12)",
    color: "#f2feff",
  },
  active: {
    background: "rgba(118, 228, 247, 0.46)",
    border: "1px solid rgba(118, 228, 247, 0.78)",
    boxShadow: "0 0 36px rgba(118, 228, 247, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.14)",
    color: "#f2feff",
  },
};

const SECONDARY = {
  idle: {
    background: "rgba(20, 46, 60, 0.72)",
    border: "1px solid rgba(118, 228, 247, 0.34)",
    boxShadow: "0 0 14px rgba(118, 228, 247, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
    color: "#e6fafe",
  },
  hover: {
    background: "rgba(118, 228, 247, 0.16)",
    border: "1px solid rgba(118, 228, 247, 0.5)",
    boxShadow: "0 0 22px rgba(118, 228, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
    color: "#e6fafe",
  },
  active: {
    background: "rgba(118, 228, 247, 0.24)",
    border: "1px solid rgba(118, 228, 247, 0.62)",
    boxShadow: "0 0 30px rgba(118, 228, 247, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.09)",
    color: "#e6fafe",
  },
};

const OUTLINE = {
  idle: {
    background: "rgba(20, 46, 60, 0.6)",
    border: "1px solid rgba(118, 228, 247, 0.34)",
    boxShadow: "0 0 14px rgba(118, 228, 247, 0.16), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
    color: "#e6fafe",
  },
  hover: {
    background: "rgba(118, 228, 247, 0.16)",
    border: "1px solid rgba(118, 228, 247, 0.5)",
    boxShadow: "0 0 22px rgba(118, 228, 247, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
    color: "#e6fafe",
  },
  active: {
    background: "rgba(118, 228, 247, 0.24)",
    border: "1px solid rgba(118, 228, 247, 0.62)",
    boxShadow: "0 0 30px rgba(118, 228, 247, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.09)",
    color: "#e6fafe",
  },
};

type StateSet = typeof PRIMARY;

function Btn({ style, label }: { style: React.CSSProperties; label: string }) {
  return (
    <button
      style={{
        ...style,
        borderRadius: RADIUS,
        padding: "10px 22px",
        fontSize: 14,
        fontWeight: 600,
        letterSpacing: 0.2,
        backdropFilter: "blur(12px) saturate(130%)",
        WebkitBackdropFilter: "blur(12px) saturate(130%)",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </button>
  );
}

function Row({ name, set }: { name: string; set: StateSet }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
      <div style={{ width: 170, color: "#9fc7d4", fontSize: 13, fontWeight: 600, letterSpacing: 0.4 }}>
        {name}
      </div>
      <Btn style={set.idle} label="Idle" />
      <Btn style={set.hover} label="Hover" />
      <Btn style={set.active} label="Active / Click" />
    </div>
  );
}

export function ButtonStates() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(1200px 600px at 30% -10%, #0e2733 0%, #081019 60%, #050b12 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 36,
        padding: "56px 64px",
        fontFamily: "Inter, system-ui, sans-serif",
      }}
    >
      <div>
        <h1 style={{ color: "#eafaff", fontSize: 22, fontWeight: 700, margin: 0 }}>
          Button visibility &amp; glow — idle → hover → active
        </h1>
        <p style={{ color: "#6f95a3", fontSize: 13, margin: "8px 0 0" }}>
          Exact index.css recipe values on the dark study surface. Square corners (10px), cerulean #76E4F7 only.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
        <div style={{ display: "flex", gap: 28, paddingLeft: 198, color: "#5d8190", fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
          <div style={{ width: 96 }}>Idle</div>
          <div style={{ width: 96 }}>Hover</div>
          <div style={{ width: 130 }}>Active / Click</div>
        </div>
        <Row name="Primary" set={PRIMARY} />
        <Row name="Secondary" set={SECONDARY} />
        <Row name="Outline" set={OUTLINE} />
      </div>
    </div>
  );
}
