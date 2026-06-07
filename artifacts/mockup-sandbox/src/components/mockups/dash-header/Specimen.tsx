export function Specimen() {
  return (
    <div
      className="w-full min-h-screen flex items-center justify-center"
      style={{
        background:
          "radial-gradient(120% 140% at 18% 0%, #06212d 0%, #04141c 55%, #031016 100%)",
        padding: "40px 28px",
      }}
    >
      <style>{`
        @keyframes spec-float {
          0%   { transform: translateY(0px) rotate(-0.2deg); }
          50%  { transform: translateY(-12px) rotate(0.3deg); }
          100% { transform: translateY(0px) rotate(-0.2deg); }
        }
        @keyframes spec-breathe {
          0%   { opacity: 0.55; transform: scale(0.98); }
          50%  { opacity: 0.95; transform: scale(1.04); }
          100% { opacity: 0.55; transform: scale(0.98); }
        }
        @keyframes spec-reflect {
          0%   { opacity: 0.18; transform: scaleY(-1) translateY(0px); }
          50%  { opacity: 0.30; transform: scaleY(-1) translateY(-6px); }
          100% { opacity: 0.18; transform: scaleY(-1) translateY(0px); }
        }
        @keyframes spec-shimmer {
          0%   { opacity: 0.35; }
          50%  { opacity: 0.75; }
          100% { opacity: 0.35; }
        }
        .spec-float { animation: spec-float 9s ease-in-out infinite; }
        .spec-breathe { animation: spec-breathe 7s ease-in-out infinite; }
        .spec-reflect { animation: spec-reflect 9s ease-in-out infinite; }
      `}</style>

      <div
        className="relative w-full overflow-hidden"
        style={{
          maxWidth: 1180,
          minHeight: 240,
          borderRadius: 22,
          background:
            "linear-gradient(150deg, rgba(8,40,55,0.55) 0%, rgba(5,24,34,0.66) 100%)",
          backdropFilter: "blur(22px) saturate(135%)",
          WebkitBackdropFilter: "blur(22px) saturate(135%)",
          border: "1px solid rgba(118,228,247,0.15)",
          boxShadow:
            "0 30px 80px -30px rgba(0,0,0,0.75), 0 0 60px -10px rgba(118,228,247,0.12), inset 0 1px 0 rgba(167,243,255,0.18)",
        }}
      >
        {/* subtle ambient cyan glow top-left where the specimen sits */}
        <div
          className="pointer-events-none absolute"
          style={{
            left: "-6%",
            top: "-30%",
            width: "60%",
            height: "160%",
            background:
              "radial-gradient(closest-side, rgba(118,228,247,0.20) 0%, rgba(118,228,247,0.06) 45%, rgba(118,228,247,0) 75%)",
            filter: "blur(6px)",
          }}
        />

        {/* hairline inset top highlight */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, rgba(167,243,255,0) 0%, rgba(167,243,255,0.45) 50%, rgba(167,243,255,0) 100%)",
          }}
        />

        <div className="relative flex items-stretch" style={{ minHeight: 240 }}>
          {/* LEFT — the specimen */}
          <div
            className="relative flex items-center justify-center"
            style={{ flex: "0 0 46%", minWidth: 0 }}
          >
            {/* breathing halo behind brain */}
            <div
              className="spec-breathe pointer-events-none absolute"
              style={{
                left: "50%",
                top: "48%",
                width: "78%",
                height: "78%",
                transform: "translate(-50%,-50%)",
                background:
                  "radial-gradient(closest-side, rgba(118,228,247,0.35) 0%, rgba(118,228,247,0.10) 50%, rgba(118,228,247,0) 78%)",
                filter: "blur(10px)",
              }}
            />

            {/* floor reflection */}
            <img
              src="/__mockup/images/brain-cut.png"
              alt=""
              aria-hidden="true"
              className="spec-reflect pointer-events-none absolute select-none"
              style={{
                left: "-4%",
                bottom: "-34%",
                width: "112%",
                maxWidth: "none",
                WebkitMaskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 60%)",
                maskImage:
                  "linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 60%)",
                filter: "blur(2px)",
              }}
            />

            {/* the brain specimen, bleeding slightly past the left edge */}
            <img
              src="/__mockup/images/brain-cut.png"
              alt="Glowing cerulean brain — PsychPro"
              className="spec-float relative select-none"
              style={{
                left: "-6%",
                width: "120%",
                maxWidth: "none",
                filter:
                  "drop-shadow(0 0 26px rgba(118,228,247,0.45)) drop-shadow(0 18px 40px rgba(0,0,0,0.55))",
              }}
            />
          </div>

          {/* RIGHT — typographic column */}
          <div
            className="relative flex flex-col justify-center"
            style={{
              flex: "1 1 auto",
              padding: "44px 56px 44px 24px",
            }}
          >
            <div
              style={{
                color: "#7FBFD0",
                fontFamily: '"Inter", sans-serif',
                fontWeight: 400,
                fontSize: 13,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                marginBottom: 18,
                opacity: 0.9,
              }}
            >
              Welcome back, Dr. Mara
            </div>

            <div
              style={{
                color: "#F4FBFF",
                fontFamily: '"Outfit","Inter",sans-serif',
                fontWeight: 300,
                fontSize: 56,
                lineHeight: 1,
                textTransform: "uppercase",
                letterSpacing: "0.42em",
                textIndent: "0.42em",
                textShadow:
                  "0 0 18px rgba(118,228,247,0.45), 0 0 2px rgba(167,243,255,0.6)",
              }}
            >
              PSYCHPRO
            </div>

            <div
              style={{
                color: "#A7F3FF",
                fontFamily: '"Outfit","Inter",sans-serif',
                fontWeight: 300,
                fontSize: 15,
                letterSpacing: "0.34em",
                textIndent: "0.34em",
                marginTop: 20,
                textTransform: "lowercase",
              }}
            >
              learn. expand. connect.
            </div>

            {/* thin cyan divider + meta row for dashboard realism */}
            <div
              style={{
                marginTop: 28,
                height: 1,
                width: "100%",
                background:
                  "linear-gradient(90deg, rgba(118,228,247,0.30) 0%, rgba(118,228,247,0) 80%)",
              }}
            />

            <div
              className="flex items-center gap-7"
              style={{ marginTop: 18 }}
            >
              {[
                { k: "Streak", v: "12 days" },
                { k: "Mastery", v: "78%" },
                { k: "Due today", v: "24 cards" },
              ].map((m) => (
                <div key={m.k} className="flex flex-col">
                  <span
                    style={{
                      color: "#7FBFD0",
                      fontFamily: '"Inter", sans-serif',
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                    }}
                  >
                    {m.k}
                  </span>
                  <span
                    style={{
                      color: "#F4FBFF",
                      fontFamily: '"Outfit","Inter",sans-serif',
                      fontWeight: 300,
                      fontSize: 18,
                      marginTop: 2,
                      letterSpacing: "0.02em",
                    }}
                  >
                    {m.v}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
