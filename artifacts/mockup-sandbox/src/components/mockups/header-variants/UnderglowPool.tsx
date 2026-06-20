import "./_group.css";

const pool: React.CSSProperties = {
  marginTop: 6,
  width: "min(620px, 70%)",
  height: 96,
  background:
    "radial-gradient(ellipse at center top, rgba(118,228,247,0.55) 0%, rgba(118,228,247,0.22) 34%, rgba(118,228,247,0) 72%)",
  filter: "blur(11px)",
  pointerEvents: "none",
};

export function UnderglowPool() {
  return (
    <div className="hv-stage">
      <div className="hv-band">
        <span className="hv-label">Main Dashboard</span>
        <div className="hv-wrap">
          <h1 className="hv-main">PSYCHPRO</h1>
        </div>
        <div style={pool} />
      </div>
      <div className="hv-divider" />
      <div className="hv-band">
        <span className="hv-label">EPPP Suite Dashboard</span>
        <div className="hv-wrap">
          <h1 className="hv-eppp">EPPP MASTERY SUITE</h1>
        </div>
        <div style={pool} />
      </div>
    </div>
  );
}
