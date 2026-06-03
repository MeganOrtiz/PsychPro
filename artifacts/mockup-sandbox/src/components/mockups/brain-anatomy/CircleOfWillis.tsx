const P = {
  surf: "#76E4F7",
  teal: "#5EB0C8",
  mist: "#A7F3FF",
  vessel: "#7FE0F2",
  vesselDeep: "#3FB6D9",
  chip: "#0E3C50",
};

type Pin = {
  x: number;
  y: number;
  label: string;
  lx: number;
  ly: number;
  anchor: "start" | "end";
};

const PINS: Pin[] = [
  { x: 300, y: 70, label: "ACA · Anterior cerebral", lx: 36, ly: 70, anchor: "start" },
  { x: 300, y: 120, label: "AComm · Ant. communicating", lx: 36, ly: 128, anchor: "start" },
  { x: 168, y: 196, label: "MCA · Middle cerebral", lx: 36, ly: 196, anchor: "start" },
  { x: 256, y: 210, label: "ICA · Internal carotid", lx: 36, ly: 264, anchor: "start" },
  { x: 262, y: 286, label: "PComm · Post. communicating", lx: 36, ly: 340, anchor: "start" },
  { x: 214, y: 322, label: "PCA · Posterior cerebral", lx: 564, ly: 196, anchor: "end" },
  { x: 300, y: 380, label: "Basilar artery", lx: 564, ly: 300, anchor: "end" },
  { x: 268, y: 470, label: "Vertebral arteries", lx: 564, ly: 392, anchor: "end" },
];

function PinMark({ p }: { p: Pin }) {
  const c = P.surf;
  const tx = p.anchor === "end" ? p.lx - 10 : p.lx + 10;
  const w = Math.max(p.label.length * 6.9 + 20, 90);
  const chipX = p.anchor === "end" ? p.lx - w + 2 : p.lx - 2;
  return (
    <g>
      <line x1={p.x} y1={p.y} x2={p.lx} y2={p.ly} stroke={c} strokeWidth={1} opacity={0.45} />
      <rect
        x={chipX}
        y={p.ly - 12}
        width={w}
        height={24}
        rx={6}
        fill={P.chip}
        opacity={0.92}
        stroke={c}
        strokeOpacity={0.5}
      />
      <text
        x={tx}
        y={p.ly + 1}
        textAnchor={p.anchor}
        fill="#fff"
        fontSize={13}
        fontWeight={600}
        dominantBaseline="middle"
        fontFamily="ui-sans-serif, system-ui"
      >
        {p.label}
      </text>
      <circle cx={p.x} cy={p.y} r={6.5} fill={c} stroke="#fff" strokeWidth={2} />
    </g>
  );
}

export function CircleOfWillis() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 gap-4"
      style={{ background: "radial-gradient(120% 120% at 50% 0%, #083240 0%, #061F2B 55%, #03151D 100%)" }}
    >
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: P.surf }}>
          Vasculature — Circle of Willis
        </p>
        <p className="text-[11px] mt-1" style={{ color: "#A7F3FFaa" }}>
          Anterior at top · classic teaching schematic · vessel positions are exact
        </p>
      </div>

      <div
        className="rounded-2xl border p-3"
        style={{ borderColor: "#2A738766", background: "#0A2D3D55", boxShadow: "0 30px 80px -20px #000" }}
      >
        <svg viewBox="0 0 600 560" width={560} height={523} role="img" aria-label="Circle of Willis">
          <defs>
            <linearGradient id="vesselGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={P.vessel} />
              <stop offset="100%" stopColor={P.vesselDeep} />
            </linearGradient>
            <filter id="vglow" x="-40%" y="-40%" width="180%" height="180%">
              <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={P.surf} floodOpacity="0.45" />
            </filter>
          </defs>

          {/* faint brain-base silhouette for context */}
          <g fill="#5EB0C815" stroke="#5EB0C830" strokeWidth={1}>
            <ellipse cx={300} cy={150} rx={150} ry={110} />
            <ellipse cx={300} cy={360} rx={130} ry={140} />
          </g>

          <g
            stroke="url(#vesselGrad)"
            strokeWidth={11}
            strokeLinecap="round"
            fill="none"
            filter="url(#vglow)"
          >
            {/* ACA — two anterior cerebrals sweeping up & apart */}
            <path d="M286 124 C 280 96, 268 74, 248 56" />
            <path d="M314 124 C 320 96, 332 74, 352 56" />
            {/* AComm — bridges the two ACAs */}
            <path d="M286 124 L314 124" />
            {/* ICA — carotid trunks rising to the T */}
            <path d="M256 232 C 254 200, 270 160, 286 132" />
            <path d="M344 232 C 346 200, 330 160, 314 132" />
            {/* MCA — lateral from the ICA bifurcation */}
            <path d="M286 150 C 240 168, 200 184, 156 200" />
            <path d="M314 150 C 360 168, 400 184, 444 200" />
            {/* PComm — joins ICA to PCA */}
            <path d="M262 246 C 250 280, 238 300, 224 316" />
            <path d="M338 246 C 350 280, 362 300, 376 316" />
            {/* PCA — posterior cerebrals from basilar tip */}
            <path d="M300 322 C 268 312, 240 318, 206 332" />
            <path d="M300 322 C 332 312, 360 318, 394 332" />
            {/* Basilar — midline trunk */}
            <path d="M300 322 L300 432" />
            {/* Vertebral arteries — converge into basilar */}
            <path d="M266 510 C 276 480, 292 452, 300 432" />
            <path d="M334 510 C 324 480, 308 452, 300 432" />
          </g>

          {/* vessel junction nodes */}
          <g fill={P.mist} opacity={0.85}>
            <circle cx={300} cy={124} r={4} />
            <circle cx={286} cy={132} r={4} />
            <circle cx={314} cy={132} r={4} />
            <circle cx={300} cy={322} r={4} />
            <circle cx={300} cy={432} r={4} />
          </g>

          {PINS.map((p) => (
            <PinMark key={p.label} p={p} />
          ))}
        </svg>
      </div>
    </div>
  );
}
