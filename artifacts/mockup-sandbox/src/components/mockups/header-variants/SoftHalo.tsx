import "./_group.css";

const laser: React.CSSProperties = {
  marginTop: 14,
  width: "min(520px, 64%)",
  height: 2,
  borderRadius: 2,
  background:
    "linear-gradient(90deg, rgba(118,228,247,0) 0%, rgba(118,228,247,0.85) 30%, #FFFFFF 50%, rgba(118,228,247,0.85) 70%, rgba(118,228,247,0) 100%)",
  boxShadow: "0 0 18px rgba(118,228,247,0.8), 0 0 4px rgba(255,255,255,0.6)",
};

const wordmarkBase: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: 0,
  whiteSpace: "nowrap",
  fontWeight: 300,
  fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
  color: "#F4FBFF",
  textShadow: "0 1px 14px rgba(0,0,0,0.5)",
};

const mainWordmark: React.CSSProperties = {
  ...wordmarkBase,
  fontSize: "clamp(34px, 3.6vw, 50px)",
  letterSpacing: "0.42em",
  textIndent: "0.42em",
};

const epppWordmark: React.CSSProperties = {
  ...wordmarkBase,
  fontSize: "clamp(34px, 3.6vw, 50px)",
  letterSpacing: "0.24em",
  textIndent: "0.24em",
};

function Controls({ label }: { label: string }) {
  return (
    <div
      className="absolute right-6 top-0 bottom-0 flex items-center gap-3"
      style={{ zIndex: 3 }}
    >
      <div
        style={{
          padding: "9px 16px",
          borderRadius: 9999,
          border: "1px solid rgba(118,228,247,0.4)",
          background: "rgba(118,228,247,0.08)",
          color: "#A7F3FF",
          fontSize: 13,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </div>
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 9999,
          border: "1px solid rgba(196,232,242,0.25)",
        }}
      />
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 9999,
          border: "1px solid rgba(118,228,247,0.4)",
        }}
      />
    </div>
  );
}

function HeaderBand({
  label,
  controlLabel,
  wordmark,
  reserve,
  text,
}: {
  label: string;
  controlLabel: string;
  wordmark: React.CSSProperties;
  reserve: string;
  text: string;
}) {
  return (
    <div style={{ position: "relative", minHeight: 150 }}>
      <span
        style={{
          position: "absolute",
          left: 24,
          top: 14,
          fontSize: 10,
          letterSpacing: "0.34em",
          textTransform: "uppercase",
          color: "rgba(167,243,255,0.4)",
        }}
      >
        {label}
      </span>
      {/* Hero wordmark overlay — centered in the OPEN space (right padding
          reserves room for the control cluster) and vertically centered.
          Laser-beam underline, no glow halo, no side details. */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingRight: reserve }}
      >
        <h1 style={wordmark}>{text}</h1>
        <span style={laser} />
      </div>
      <Controls label={controlLabel} />
    </div>
  );
}

export function SoftHalo() {
  return (
    <div className="hv-stage">
      <HeaderBand
        label="Main Dashboard"
        controlLabel="EPPP Mastery Suite"
        wordmark={mainWordmark}
        reserve="clamp(220px, 25vw, 350px)"
        text="PSYCHPRO"
      />
      <div className="hv-divider" />
      <HeaderBand
        label="EPPP Suite Dashboard"
        controlLabel="Back to PsychPro"
        wordmark={epppWordmark}
        reserve="clamp(210px, 24vw, 330px)"
        text="EPPP MASTERY SUITE"
      />
    </div>
  );
}
