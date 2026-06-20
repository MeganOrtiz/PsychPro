import "./_group.css";

const halo: React.CSSProperties = {
  position: "absolute",
  left: "50%",
  top: "50%",
  transform: "translate(-50%, -50%)",
  width: "150%",
  height: "320%",
  background:
    "radial-gradient(ellipse at center, rgba(118,228,247,0.32) 0%, rgba(118,228,247,0.18) 26%, rgba(118,228,247,0.06) 50%, rgba(118,228,247,0) 72%)",
  filter: "blur(16px)",
  pointerEvents: "none",
  zIndex: 1,
};

const wordmarkBase: React.CSSProperties = {
  position: "relative",
  zIndex: 2,
  margin: 0,
  whiteSpace: "nowrap",
  fontWeight: 300,
  fontFamily: '"Outfit", "Inter", system-ui, sans-serif',
  color: "#F4FBFF",
  textShadow:
    "0 0 30px rgba(118,228,247,0.5), 0 0 64px rgba(118,228,247,0.22)",
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
          reserves room for the control cluster) and vertically centered. */}
      <div
        className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
        style={{ paddingRight: reserve }}
      >
        <span className="relative inline-flex items-center justify-center">
          <span style={halo} />
          <h1 style={wordmark}>{text}</h1>
        </span>
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
