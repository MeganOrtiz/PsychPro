import "./_group.css";

const halo: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  width: "150%",
  height: "320%",
  background:
    "radial-gradient(ellipse at center, rgba(118,228,247,0.26) 0%, rgba(118,228,247,0.14) 26%, rgba(118,228,247,0.05) 50%, rgba(118,228,247,0) 72%)",
  filter: "blur(16px)",
  pointerEvents: "none",
  zIndex: 1,
};

export function SoftHalo() {
  return (
    <div className="hv-stage">
      <div className="hv-band">
        <span className="hv-label">Main Dashboard</span>
        <div className="hv-wrap">
          <div style={halo} />
          <h1 className="hv-main">PSYCHPRO</h1>
        </div>
      </div>
      <div className="hv-divider" />
      <div className="hv-band">
        <span className="hv-label">EPPP Suite Dashboard</span>
        <div className="hv-wrap">
          <div style={halo} />
          <h1 className="hv-eppp">EPPP MASTERY SUITE</h1>
        </div>
      </div>
    </div>
  );
}
