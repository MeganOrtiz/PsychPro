import "./_group.css";

export type CortexZone = {
  id: string;
  label: string;
  title: string;
  pct: number;
  mastered?: boolean;
  side: "left" | "right";
  zx: number;
  zy: number;
  cx: number;
  cy: number;
};

type StageProps = {
  brain: "superior" | "lateral";
  overline: string;
  heading: string;
  overallPct: number;
  overallLabel: string;
  zones: CortexZone[];
};

const STAGE_W = 1120;
const STAGE_H = 720;
const CHIP_W = 268;

function hueFor(pct: number, mastered?: boolean) {
  if (mastered) return "#76e4f7";
  if (pct >= 60) return "#68ccde";
  if (pct >= 30) return "#4fa9c4";
  return "#3a8298";
}

function Ring({ pct, mastered }: { pct: number; mastered?: boolean }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  const stroke = hueFor(pct, mastered);
  return (
    <svg width="38" height="38" viewBox="0 0 38 38" className="shrink-0">
      <circle cx="19" cy="19" r={r} fill="none" stroke="rgba(118,228,247,0.14)" strokeWidth="3.5" />
      <circle
        cx="19"
        cy="19"
        r={r}
        fill="none"
        stroke={stroke}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={off}
        transform="rotate(-90 19 19)"
        style={{ filter: `drop-shadow(0 0 4px ${stroke})` }}
      />
      <text
        x="19"
        y="22.5"
        textAnchor="middle"
        fontSize="10.5"
        fontWeight={700}
        fill="var(--lc-cloud)"
      >
        {pct}
      </text>
    </svg>
  );
}

function Zone({ zone }: { zone: CortexZone }) {
  const color = hueFor(zone.pct, zone.mastered);
  const size = 34 + (zone.pct / 100) * 60;
  return (
    <>
      {/* corona */}
      <div
        className={zone.mastered ? "lc-pulse-strong" : "lc-pulse"}
        style={{
          position: "absolute",
          left: zone.zx,
          top: zone.zy,
          width: size,
          height: size,
          borderRadius: "9999px",
          transform: "translate(-50%, -50%)",
          background: `radial-gradient(circle, ${color}cc 0%, ${color}40 42%, transparent 72%)`,
          pointerEvents: "none",
        }}
      />
      {/* core dot */}
      <div
        style={{
          position: "absolute",
          left: zone.zx,
          top: zone.zy,
          width: 13,
          height: 13,
          borderRadius: "9999px",
          transform: "translate(-50%, -50%)",
          background: color,
          boxShadow: `0 0 12px 3px ${color}, 0 0 26px 6px ${color}66`,
          border: "1.5px solid rgba(244,251,255,0.85)",
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function Chip({ zone }: { zone: CortexZone }) {
  const color = hueFor(zone.pct, zone.mastered);
  return (
    <div
      style={{
        position: "absolute",
        left: zone.cx,
        top: zone.cy,
        width: CHIP_W,
        transform: "translateY(-50%)",
        display: "flex",
        flexDirection: zone.side === "left" ? "row" : "row-reverse",
        alignItems: "center",
        gap: 12,
        padding: "12px 14px",
        borderRadius: 16,
        background: "rgba(11,54,70,0.62)",
        border: `1px solid ${zone.mastered ? "rgba(118,228,247,0.5)" : "var(--lc-glass-border)"}`,
        backdropFilter: "blur(20px) saturate(135%)",
        WebkitBackdropFilter: "blur(20px) saturate(135%)",
        boxShadow: zone.mastered
          ? `0 0 0 1px ${color}33, 0 10px 30px -12px ${color}aa`
          : "0 10px 26px -16px rgba(0,0,0,0.7)",
      }}
    >
      <Ring pct={zone.pct} mastered={zone.mastered} />
      <div style={{ textAlign: zone.side === "left" ? "left" : "right", minWidth: 0, flex: 1 }}>
        <div
          style={{
            fontSize: 10.5,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--lc-mist-soft)",
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 6,
            justifyContent: zone.side === "left" ? "flex-start" : "flex-end",
          }}
        >
          {zone.mastered && <span style={{ color }}>★</span>}
          {zone.label}
        </div>
        <div
          style={{
            fontSize: 14.5,
            lineHeight: 1.2,
            color: "var(--lc-cloud)",
            fontWeight: 600,
            marginTop: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {zone.title}
        </div>
      </div>
    </div>
  );
}

export function CortexStage({ brain, overline, heading, overallPct, overallLabel, zones }: StageProps) {
  const brainSrc =
    brain === "superior"
      ? "/__mockup/images/brain-superior-cut.png"
      : "/__mockup/images/dashboard-lateral-brain.png";

  return (
    <div
      className="lc-root"
      style={{
        position: "relative",
        width: "100%",
        minHeight: STAGE_H + 120,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "hidden",
        padding: "28px 16px 0",
        background:
          "radial-gradient(120% 80% at 50% -10%, #0a4d5e 0%, #083f4d 45%, #062c35 100%)",
      }}
    >
      {/* atmospheric cloud layer */}
      <div
        className="lc-drift"
        style={{
          position: "absolute",
          inset: "-6% -6% 0 -6%",
          backgroundImage: "url(/__mockup/images/brain-clouds.png)",
          backgroundSize: "cover",
          backgroundPosition: "center top",
          opacity: 0.14,
          mixBlendMode: "screen",
          pointerEvents: "none",
        }}
      />

      {/* heading */}
      <div style={{ position: "relative", textAlign: "center", zIndex: 4, marginBottom: 4 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "var(--lc-teal)",
            fontWeight: 600,
          }}
        >
          {overline}
        </div>
        <h1
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "var(--lc-cloud)",
            margin: "6px 0 0",
            textShadow: "0 0 28px rgba(118,228,247,0.35)",
          }}
        >
          {heading}
        </h1>
        <div style={{ fontSize: 13.5, color: "var(--lc-ink-soft)", marginTop: 4 }}>
          <span style={{ color: "var(--lc-surf)", fontWeight: 700 }}>{overallPct}%</span> {overallLabel}
        </div>
      </div>

      {/* stage */}
      <div style={{ position: "relative", width: STAGE_W, height: STAGE_H, zIndex: 3 }}>
        {/* leader lines */}
        <svg
          width={STAGE_W}
          height={STAGE_H}
          style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "visible" }}
        >
          {zones.map((z) => {
            const anchorX = z.side === "left" ? z.cx + CHIP_W : z.cx;
            const anchorY = z.cy;
            const color = hueFor(z.pct, z.mastered);
            const midX = (anchorX + z.zx) / 2;
            return (
              <path
                key={z.id}
                d={`M ${anchorX} ${anchorY} C ${midX} ${anchorY}, ${midX} ${z.zy}, ${z.zx} ${z.zy}`}
                fill="none"
                stroke={color}
                strokeWidth={1.4}
                strokeOpacity={z.mastered ? 0.7 : 0.4}
                strokeDasharray="2 5"
              />
            );
          })}
        </svg>

        {/* brain (outer wrapper holds the centering transform; inner div animates so
            the breathe keyframe never clobbers translate) */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 430,
          }}
        >
          <div
            className="lc-breathe"
            style={{
              position: "relative",
              filter: "drop-shadow(0 0 55px rgba(118,228,247,0.45))",
            }}
          >
            {/* inner bloom */}
            <div
              style={{
                position: "absolute",
                inset: "14%",
                borderRadius: "9999px",
                background: "radial-gradient(circle, rgba(118,228,247,0.34) 0%, transparent 64%)",
                filter: "blur(18px)",
              }}
            />
            <img
              src={brainSrc}
              alt="PsychPro brain"
              loading="eager"
              decoding="async"
              fetchPriority="high"
              style={{ position: "relative", width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </div>

        {/* zones */}
        {zones.map((z) => (
          <Zone key={`zone-${z.id}`} zone={z} />
        ))}

        {/* chips */}
        {zones.map((z) => (
          <Chip key={`chip-${z.id}`} zone={z} />
        ))}
      </div>
    </div>
  );
}
