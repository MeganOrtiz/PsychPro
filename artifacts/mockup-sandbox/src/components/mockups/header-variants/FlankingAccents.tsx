import "./_group.css";

const rule = (dir: "left" | "right"): React.CSSProperties => ({
  width: "clamp(40px, 7vw, 92px)",
  height: 1,
  background:
    dir === "left"
      ? "linear-gradient(90deg, rgba(118,228,247,0) 0%, rgba(118,228,247,0.85) 100%)"
      : "linear-gradient(90deg, rgba(118,228,247,0.85) 0%, rgba(118,228,247,0) 100%)",
});

const diamond: React.CSSProperties = {
  width: 7,
  height: 7,
  transform: "rotate(45deg)",
  background: "#76E4F7",
  boxShadow: "0 0 10px rgba(118,228,247,0.9)",
  flexShrink: 0,
};

function Flank({
  children,
  cls,
}: {
  children: React.ReactNode;
  cls: string;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={rule("left")} />
      <span style={diamond} />
      <h1 className={cls} style={{ padding: "0 6px" }}>
        {children}
      </h1>
      <span style={diamond} />
      <div style={rule("right")} />
    </div>
  );
}

export function FlankingAccents() {
  return (
    <div className="hv-stage">
      <div className="hv-band">
        <span className="hv-label">Main Dashboard</span>
        <Flank cls="hv-main">PSYCHPRO</Flank>
      </div>
      <div className="hv-divider" />
      <div className="hv-band">
        <span className="hv-label">EPPP Suite Dashboard</span>
        <Flank cls="hv-eppp">EPPP MASTERY SUITE</Flank>
      </div>
    </div>
  );
}
