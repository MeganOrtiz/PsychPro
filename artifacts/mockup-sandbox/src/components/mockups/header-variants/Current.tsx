import "./_group.css";

const laser: React.CSSProperties = {
  marginTop: 20,
  width: "min(560px, 58%)",
  height: 2,
  borderRadius: 2,
  background:
    "linear-gradient(90deg, rgba(118,228,247,0) 0%, rgba(118,228,247,0.85) 30%, #FFFFFF 50%, rgba(118,228,247,0.85) 70%, rgba(118,228,247,0) 100%)",
  boxShadow: "0 0 18px rgba(118,228,247,0.8), 0 0 4px rgba(255,255,255,0.6)",
};

export function Current() {
  return (
    <div className="hv-stage">
      <div className="hv-band">
        <span className="hv-label">Main Dashboard</span>
        <div className="hv-wrap">
          <h1 className="hv-main">PSYCHPRO</h1>
        </div>
        <div style={laser} />
      </div>
      <div className="hv-divider" />
      <div className="hv-band">
        <span className="hv-label">EPPP Suite Dashboard</span>
        <div className="hv-wrap">
          <h1 className="hv-eppp">EPPP MASTERY SUITE</h1>
        </div>
        <div style={laser} />
      </div>
    </div>
  );
}
