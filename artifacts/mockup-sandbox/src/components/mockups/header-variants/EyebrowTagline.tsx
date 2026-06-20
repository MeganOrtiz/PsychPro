import "./_group.css";

const eyebrow: React.CSSProperties = {
  marginTop: 18,
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.4em",
  paddingLeft: "0.4em",
  textTransform: "uppercase",
  color: "rgba(167,243,255,0.82)",
};

export function EyebrowTagline() {
  return (
    <div className="hv-stage">
      <div className="hv-band">
        <span className="hv-label">Main Dashboard</span>
        <div className="hv-wrap">
          <h1 className="hv-main">PSYCHPRO</h1>
        </div>
        <div style={eyebrow}>Learn · Connect · Expand</div>
      </div>
      <div className="hv-divider" />
      <div className="hv-band">
        <span className="hv-label">EPPP Suite Dashboard</span>
        <div className="hv-wrap">
          <h1 className="hv-eppp">EPPP MASTERY SUITE</h1>
        </div>
        <div style={eyebrow}>Part 1 &amp; 2 · Board Mastery</div>
      </div>
    </div>
  );
}
