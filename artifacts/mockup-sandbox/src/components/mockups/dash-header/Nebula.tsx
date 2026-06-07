export function Nebula() {
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center"
      style={{
        background:
          "radial-gradient(1200px 600px at 50% -10%, #06202c 0%, #04141c 60%, #03101a 100%)",
        padding: "40px 50px",
      }}
    >
      <style>{`
        @keyframes neb-drift {
          0%   { transform: scale(1.12) translate3d(0px, 0px, 0); }
          50%  { transform: scale(1.16) translate3d(-26px, -10px, 0); }
          100% { transform: scale(1.12) translate3d(0px, 0px, 0); }
        }
        @keyframes neb-sweep {
          0%   { transform: translateX(-120%) skewX(-14deg); opacity: 0; }
          12%  { opacity: 0.55; }
          40%  { opacity: 0; }
          100% { transform: translateX(220%) skewX(-14deg); opacity: 0; }
        }
        @keyframes neb-glow {
          0%, 100% { opacity: 0.55; }
          50%      { opacity: 0.9; }
        }
        @keyframes neb-rise {
          0%   { transform: translateY(0px); opacity: 0.0; }
          25%  { opacity: 0.7; }
          75%  { opacity: 0.7; }
          100% { transform: translateY(-46px); opacity: 0; }
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden"
        style={{
          maxWidth: 1180,
          height: 260,
          borderRadius: 22,
          border: "1px solid rgba(118,228,247,0.15)",
          backgroundImage:
            "linear-gradient(150deg, rgba(8,40,55,0.55) 0%, rgba(5,24,34,0.66) 100%)",
          backdropFilter: "blur(22px) saturate(135%)",
          WebkitBackdropFilter: "blur(22px) saturate(135%)",
          boxShadow:
            "0 24px 70px -20px rgba(0,0,0,0.7), 0 0 60px -10px rgba(118,228,247,0.22), inset 0 1px 0 rgba(167,243,255,0.18)",
        }}
      >
        {/* Full-bleed atmospheric brain backdrop */}
        <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 22 }}>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'url("/__mockup/images/brain-full.png")',
              backgroundSize: "cover",
              backgroundPosition: "62% 38%",
              backgroundRepeat: "no-repeat",
              transformOrigin: "60% 40%",
              animation: "neb-drift 26s ease-in-out infinite",
              filter: "saturate(1.15) contrast(1.05)",
              willChange: "transform",
            }}
          />

          {/* Cyan tint over the whole image to lock it into the palette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(900px 420px at 70% 42%, rgba(118,228,247,0.18) 0%, rgba(118,228,247,0.04) 40%, rgba(4,20,28,0) 70%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Left-to-right darkening so the wordmark stays crisp on the left */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(3,16,24,0.94) 0%, rgba(3,16,24,0.8) 26%, rgba(4,20,28,0.42) 52%, rgba(4,20,28,0.18) 78%, rgba(4,20,28,0.4) 100%)",
            }}
          />

          {/* Vertical depth vignette top/bottom */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(3,16,24,0.55) 0%, rgba(4,20,28,0) 30%, rgba(4,20,28,0) 64%, rgba(3,14,22,0.7) 100%)",
            }}
          />

          {/* Faint cinematic light sweep */}
          <div
            className="absolute"
            style={{
              top: "-20%",
              left: 0,
              width: "38%",
              height: "140%",
              background:
                "linear-gradient(90deg, rgba(167,243,255,0) 0%, rgba(167,243,255,0.16) 50%, rgba(167,243,255,0) 100%)",
              filter: "blur(8px)",
              animation: "neb-sweep 11s ease-in-out infinite",
              pointerEvents: "none",
            }}
          />

          {/* Drifting synaptic motes */}
          {[
            { left: "58%", top: "62%", size: 3, delay: "0s", dur: "7s" },
            { left: "72%", top: "70%", size: 2, delay: "1.6s", dur: "9s" },
            { left: "66%", top: "30%", size: 2.5, delay: "3.1s", dur: "8s" },
            { left: "84%", top: "52%", size: 2, delay: "4.4s", dur: "10s" },
            { left: "50%", top: "74%", size: 2, delay: "2.2s", dur: "8.5s" },
          ].map((m, i) => (
            <span
              key={i}
              className="absolute rounded-full"
              style={{
                left: m.left,
                top: m.top,
                width: m.size,
                height: m.size,
                background: "#A7F3FF",
                boxShadow: "0 0 8px 2px rgba(118,228,247,0.8)",
                animation: `neb-rise ${m.dur} ease-in-out ${m.delay} infinite`,
                pointerEvents: "none",
              }}
            />
          ))}
        </div>

        {/* Inset top highlight line */}
        <div
          className="absolute left-0 right-0 top-0"
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, rgba(167,243,255,0) 0%, rgba(167,243,255,0.45) 50%, rgba(167,243,255,0) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative h-full flex flex-col justify-center" style={{ padding: "0 52px" }}>
          <div
            style={{
              fontFamily: '"Outfit","Inter",sans-serif',
              fontWeight: 300,
              fontSize: 13,
              letterSpacing: "0.26em",
              textTransform: "uppercase",
              color: "#7FBFD0",
              marginBottom: 18,
            }}
          >
            Welcome back, Dr. Mara
          </div>

          <h1
            style={{
              fontFamily: '"Outfit","Inter",sans-serif',
              fontWeight: 300,
              fontSize: 64,
              lineHeight: 1,
              textTransform: "uppercase",
              letterSpacing: "0.42em",
              textIndent: "0.42em",
              color: "#F4FBFF",
              margin: 0,
              textShadow:
                "0 0 22px rgba(118,228,247,0.55), 0 0 48px rgba(118,228,247,0.28), 0 2px 4px rgba(0,0,0,0.45)",
            }}
          >
            PSYCHPRO
          </h1>

          <div
            style={{
              fontFamily: '"Outfit","Inter",sans-serif',
              fontWeight: 300,
              fontSize: 15,
              letterSpacing: "0.34em",
              color: "#A7F3FF",
              marginTop: 18,
              textShadow: "0 0 16px rgba(118,228,247,0.35)",
            }}
          >
            learn. expand. connect.
          </div>
        </div>

        {/* Soft inner border glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 22,
            boxShadow: "inset 0 0 60px -16px rgba(118,228,247,0.3)",
            animation: "neb-glow 7s ease-in-out infinite",
          }}
        />
      </div>
    </div>
  );
}
