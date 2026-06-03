const P = {
  surf: "#76E4F7",
  teal: "#5EB0C8",
  mist: "#A7F3FF",
  fillA: "#D7EEF4",
  fillB: "#9DC2CE",
  stroke: "#5EB0C8",
  chip: "#0E3C50",
};

type Pin = {
  x: number;
  y: number;
  label: string;
  lx: number;
  ly: number;
  anchor: "start" | "end";
  isNew?: boolean;
};

// Cranial nerve emergence points on the ventral surface (SVG user units).
const PINS: Pin[] = [
  { x: 268, y: 196, label: "I · Olfactory", lx: 36, ly: 150, anchor: "start" },
  { x: 300, y: 250, label: "II · Optic", lx: 36, ly: 205, anchor: "start" },
  { x: 282, y: 340, label: "III · Oculomotor", lx: 36, ly: 270, anchor: "start" },
  { x: 262, y: 366, label: "IV · Trochlear", lx: 36, ly: 330, anchor: "start" },
  { x: 234, y: 416, label: "V · Trigeminal", lx: 36, ly: 392, anchor: "start" },
  { x: 286, y: 474, label: "VI · Abducens", lx: 36, ly: 452, anchor: "start" },
  { x: 252, y: 480, label: "VII · Facial", lx: 36, ly: 512, anchor: "start" },
  { x: 246, y: 494, label: "VIII · Vestibulocochlear", lx: 36, ly: 572, anchor: "start" },
  { x: 262, y: 516, label: "IX · Glossopharyngeal", lx: 564, ly: 392, anchor: "end" },
  { x: 264, y: 532, label: "X · Vagus", lx: 564, ly: 452, anchor: "end" },
  { x: 266, y: 550, label: "XI · Accessory", lx: 564, ly: 512, anchor: "end" },
  { x: 286, y: 524, label: "XII · Hypoglossal", lx: 564, ly: 572, anchor: "end" },
];

function PinMark({ p }: { p: Pin }) {
  const c = P.surf;
  const tx = p.anchor === "end" ? p.lx - 10 : p.lx + 10;
  const w = Math.max(p.label.length * 7.0 + 20, 80);
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
      <circle cx={p.x} cy={p.y} r={11} fill="none" stroke={c} strokeWidth={1} opacity={0.4} />
    </g>
  );
}

export function VentralCN() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 gap-4"
      style={{ background: "radial-gradient(120% 120% at 50% 0%, #083240 0%, #061F2B 55%, #03151D 100%)" }}
    >
      <div className="text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em]" style={{ color: P.surf }}>
          Cranial Nerves — Ventral View
        </p>
        <p className="text-[11px] mt-1" style={{ color: "#A7F3FFaa" }}>
          All 12 nerve roots on the inferior surface · schematic SVG (precise, editable, on-brand)
        </p>
      </div>

      <div
        className="rounded-2xl border p-3"
        style={{ borderColor: "#2A738766", background: "#0A2D3D55", boxShadow: "0 30px 80px -20px #000" }}
      >
        <svg viewBox="0 0 600 720" width={560} height={672} role="img" aria-label="Ventral brain view">
          <defs>
            <linearGradient id="brainFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={P.fillA} />
              <stop offset="100%" stopColor={P.fillB} />
            </linearGradient>
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feDropShadow dx="0" dy="0" stdDeviation="10" floodColor={P.surf} floodOpacity="0.35" />
            </filter>
          </defs>

          <g filter="url(#glow)" stroke={P.stroke} strokeOpacity={0.55} fill="url(#brainFill)">
            {/* Cerebral hemispheres (underside) */}
            <ellipse cx={222} cy={300} rx={132} ry={250} />
            <ellipse cx={378} cy={300} rx={132} ry={250} />
            {/* Frontal poles */}
            <ellipse cx={238} cy={140} rx={86} ry={96} />
            <ellipse cx={362} cy={140} rx={86} ry={96} />
            {/* Temporal lobes */}
            <ellipse cx={168} cy={340} rx={74} ry={120} />
            <ellipse cx={432} cy={340} rx={74} ry={120} />
            {/* Pons */}
            <ellipse cx={300} cy={430} rx={74} ry={52} />
            {/* Medulla */}
            <path d="M268 470 Q300 460 332 470 L322 560 Q300 575 278 560 Z" />
            {/* Cerebellar hemispheres */}
            <ellipse cx={236} cy={585} rx={86} ry={92} />
            <ellipse cx={364} cy={585} rx={86} ry={92} />
          </g>

          {/* Midline + sulci accents */}
          <g stroke={P.stroke} strokeOpacity={0.32} fill="none" strokeWidth={1.4} strokeLinecap="round">
            <path d="M300 56 L300 250" />
            <path d="M170 120 Q210 160 245 150" />
            <path d="M430 120 Q390 160 355 150" />
            <path d="M120 320 Q160 350 200 345" />
            <path d="M480 320 Q440 350 400 345" />
            {/* cerebellar foliation */}
            <path d="M190 560 Q236 575 282 560" />
            <path d="M190 585 Q236 600 282 585" />
            <path d="M318 560 Q364 575 410 560" />
            <path d="M318 585 Q364 600 410 585" />
          </g>

          {/* Optic chiasm (X) */}
          <g stroke={P.surf} strokeWidth={6} strokeLinecap="round" opacity={0.95}>
            <path d="M280 232 L320 268" />
            <path d="M320 232 L280 268" />
          </g>
          {/* Cerebral peduncles (V) */}
          <g stroke={P.teal} strokeWidth={10} strokeLinecap="round" opacity={0.8}>
            <path d="M284 312 L296 356" />
            <path d="M316 312 L304 356" />
          </g>
          {/* Pyramids */}
          <g stroke={P.teal} strokeWidth={5} strokeLinecap="round" opacity={0.6}>
            <path d="M291 478 L289 552" />
            <path d="M309 478 L311 552" />
          </g>

          {PINS.map((p) => (
            <PinMark key={p.label} p={p} />
          ))}
        </svg>
      </div>
    </div>
  );
}
