type M = { id: string; name: string; x: number; y: number; isNew?: boolean };

const IMG_FILTER =
  "grayscale(1) contrast(1.05) brightness(1.03) drop-shadow(0 24px 60px #061F2B) drop-shadow(0 0 40px #5EB0C855)";

export function DiagramCalib({ title, src, markers }: { title: string; src: string; markers: M[] }) {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center p-6 gap-3"
      style={{ background: "radial-gradient(120% 120% at 50% 0%, #083240 0%, #061F2B 55%, #03151D 100%)" }}
    >
      <p className="text-sm font-semibold uppercase tracking-wider" style={{ color: "#76E4F7" }}>
        {title} — marker calibration
      </p>
      <p className="text-[11px]" style={{ color: "#A7F3FFaa" }}>
        Amber = newly added structures to verify · Cyan = existing
      </p>
      <div className="relative" style={{ width: 760 }}>
        <img src={src} alt={title} className="block w-full object-contain select-none" draggable={false} style={{ filter: IMG_FILTER }} />
        {markers.map((m) => {
          const c = m.isNew ? "#FBBF24" : "#76E4F7";
          const flip = m.x > 58;
          return (
            <span key={m.id} className="absolute z-10" style={{ left: `${m.x}%`, top: `${m.y}%`, transform: "translate(-50%, -50%)" }}>
              <span
                className="block rounded-full"
                style={{ width: 14, height: 14, background: c, border: "2px solid #fff", boxShadow: `0 0 0 3px #061F2Baa, 0 0 12px 2px ${c}` }}
              />
              <span
                className="absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-semibold"
                style={{
                  [flip ? "right" : "left"]: "calc(100% + 6px)",
                  background: "#0E3C50f2",
                  color: m.isNew ? "#FBBF24" : "#fff",
                  border: `1px solid ${c}99`,
                }}
              >
                {m.name}
              </span>
            </span>
          );
        })}
      </div>
    </div>
  );
}
