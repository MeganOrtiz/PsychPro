// Verification preview: PSYCHPRO wordmark recreated as LIVE thin text over the
// smoke backdrop, so the letter weight can be tuned (the attached banner has
// baked-in pixels that can't be thinned). Shows three thin weights side by side.
const ROWS: { label: string; weight: number; font: string; spacing: string }[] = [
  { label: "Outfit 200", weight: 200, font: "'Outfit', sans-serif", spacing: "0.22em" },
  { label: "Outfit 100-ish (Saira 100)", weight: 100, font: "'Saira', sans-serif", spacing: "0.20em" },
  { label: "Montserrat 300 (current sidebar font)", weight: 300, font: "'Montserrat', sans-serif", spacing: "0.22em" },
];

export function Preview() {
  return (
    <div
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(130% 90% at 50% -10%, #0a2230 0%, #07151f 55%, #040c12 100%)",
      }}
    >
      <div className="mx-auto max-w-[1100px] px-6 py-10 space-y-8">
        {ROWS.map((r) => (
          <div key={r.label}>
            <p style={{ color: "#6f97a3", fontSize: 12, marginBottom: 8, fontFamily: "monospace" }}>
              {r.label}
            </p>
            <div
              className="relative w-full overflow-hidden rounded-xl"
              style={{
                aspectRatio: "1024 / 220",
                backgroundImage: "url(/__mockup/images/brain-clouds.png)",
                backgroundSize: "cover",
                backgroundPosition: "center 35%",
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "radial-gradient(120% 140% at 50% 0%, rgba(6,28,38,0.15) 0%, rgba(5,20,28,0.55) 100%)",
                }}
              />
              <div className="relative h-full flex flex-col items-center justify-center">
                <div
                  style={{
                    fontFamily: r.font,
                    fontWeight: r.weight,
                    letterSpacing: r.spacing,
                    fontSize: "clamp(28px, 7vw, 76px)",
                    color: "#eafcff",
                    textShadow: "0 0 24px rgba(118,228,247,0.35)",
                    lineHeight: 1,
                    paddingLeft: r.spacing,
                  }}
                >
                  PSYCHPRO
                </div>
                <div
                  style={{
                    fontFamily: r.font,
                    fontWeight: Math.max(r.weight, 300),
                    letterSpacing: "0.42em",
                    fontSize: "clamp(9px, 1.5vw, 15px)",
                    color: "rgba(167,243,255,0.85)",
                    marginTop: 14,
                    paddingLeft: "0.42em",
                    textTransform: "lowercase",
                  }}
                >
                  learn. expand. connect.
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
