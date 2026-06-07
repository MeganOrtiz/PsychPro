export function SynapseCore() {
  const CERULEAN = "#76E4F7";
  const ICY = "#A7F3FF";
  const NEARWHITE = "#F4FBFF";
  const MUTED = "#7FBFD0";

  const chips = [
    { label: "Streak", value: "12d", top: "20%", left: "52%", delay: "0s" },
    { label: "Mastery", value: "78%", top: "50%", left: "46%", delay: "1.1s" },
    { label: "Reviews", value: "24 due", top: "78%", left: "55%", delay: "2.2s" },
  ];

  const particles = Array.from({ length: 14 }).map((_, i) => ({
    id: i,
    angle: (i / 14) * 360,
    dur: 7 + (i % 5) * 1.3,
    delay: -(i * 0.6),
    size: 2 + (i % 3),
    radius: 96 + (i % 3) * 14,
  }));

  return (
    <div
      className="w-full min-h-screen flex items-center justify-center"
      style={{
        background:
          "radial-gradient(1200px 480px at 78% 20%, rgba(10,52,70,0.55) 0%, rgba(4,20,28,0) 60%), #04141c",
        padding: "40px 28px",
      }}
    >
      <style>{`
        @keyframes syn-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes syn-orbit-rev {
          from { transform: rotate(360deg); }
          to   { transform: rotate(0deg); }
        }
        @keyframes syn-core-float {
          0%,100% { transform: translateY(0) scale(1); }
          50%     { transform: translateY(-6px) scale(1.012); }
        }
        @keyframes syn-glow-pulse {
          0%,100% { opacity: 0.55; transform: scale(1); }
          50%     { opacity: 0.9;  transform: scale(1.06); }
        }
        @keyframes syn-particle-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes syn-line-flow {
          0%   { opacity: 0.15; }
          50%  { opacity: 0.55; }
          100% { opacity: 0.15; }
        }
        @keyframes syn-chip-float {
          0%,100% { transform: translateY(0); }
          50%     { transform: translateY(-4px); }
        }
        @keyframes syn-dash {
          to { stroke-dashoffset: -40; }
        }
        @keyframes syn-word-shimmer {
          0%,100% { text-shadow: 0 0 18px rgba(118,228,247,0.25), 0 0 2px rgba(118,228,247,0.4); }
          50%     { text-shadow: 0 0 26px rgba(118,228,247,0.4), 0 0 3px rgba(118,228,247,0.55); }
        }
        @media (prefers-reduced-motion: reduce) {
          .syn-anim { animation: none !important; }
        }
      `}</style>

      <div
        className="relative w-full overflow-hidden"
        style={{
          maxWidth: 1180,
          height: 240,
          borderRadius: 22,
          background:
            "linear-gradient(150deg, rgba(8,40,55,0.55) 0%, rgba(5,24,34,0.66) 100%)",
          border: "1px solid rgba(118,228,247,0.15)",
          backdropFilter: "blur(22px) saturate(135%)",
          WebkitBackdropFilter: "blur(22px) saturate(135%)",
          boxShadow:
            "0 24px 70px -28px rgba(0,0,0,0.7), 0 0 60px -20px rgba(118,228,247,0.25), inset 0 1px 0 rgba(167,243,255,0.12)",
        }}
      >
        {/* faint grid / tech texture */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(118,228,247,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(118,228,247,0.04) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage:
              "radial-gradient(120% 120% at 80% 50%, #000 0%, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(120% 120% at 80% 50%, #000 0%, transparent 75%)",
          }}
        />

        {/* connecting energy lines from core toward wordmark */}
        <svg
          aria-hidden
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1180 240"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="syn-lg" x1="1" y1="0" x2="0" y2="0">
              <stop offset="0%" stopColor={CERULEAN} stopOpacity="0.55" />
              <stop offset="100%" stopColor={CERULEAN} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[
            "M 940 120 C 760 70, 620 60, 470 96",
            "M 940 120 C 740 120, 600 120, 460 134",
            "M 940 120 C 760 180, 600 190, 480 168",
          ].map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke="url(#syn-lg)"
              strokeWidth="1.2"
              strokeDasharray="5 7"
              className="syn-anim"
              style={{
                animation: `syn-dash ${6 + i}s linear infinite, syn-line-flow ${4 + i}s ease-in-out infinite`,
              }}
            />
          ))}
        </svg>

        {/* ===== LEFT: wordmark, tagline, greeting ===== */}
        <div
          className="absolute z-20 flex flex-col justify-center"
          style={{ left: 48, top: 0, bottom: 0, maxWidth: 560 }}
        >
          <div
            className="uppercase syn-anim"
            style={{
              fontFamily: '"Outfit","Inter",sans-serif',
              fontWeight: 300,
              fontSize: 52,
              lineHeight: 1,
              letterSpacing: "0.42em",
              textIndent: "0.42em",
              color: NEARWHITE,
              animation: "syn-word-shimmer 5s ease-in-out infinite",
            }}
          >
            PSYCHPRO
          </div>

          <div
            style={{
              marginTop: 18,
              fontFamily: '"Outfit","Inter",sans-serif',
              fontWeight: 300,
              fontSize: 14,
              letterSpacing: "0.34em",
              color: ICY,
            }}
          >
            learn. expand. connect.
          </div>

          <div
            style={{
              marginTop: 26,
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: '"Inter",sans-serif',
              fontWeight: 400,
              fontSize: 13,
              letterSpacing: "0.04em",
              color: MUTED,
            }}
          >
            <span
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: CERULEAN,
                boxShadow: `0 0 10px ${CERULEAN}`,
                display: "inline-block",
              }}
              className="syn-anim"
            />
            Welcome back, Dr. Mara
          </div>
        </div>

        {/* ===== floating stat chips ===== */}
        {chips.map((c) => (
          <div
            key={c.label}
            className="absolute z-20 syn-anim"
            style={{
              top: c.top,
              left: c.left,
              animation: `syn-chip-float 6s ease-in-out infinite`,
              animationDelay: c.delay,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: 7,
                padding: "6px 12px",
                borderRadius: 999,
                background: "rgba(8,40,55,0.5)",
                border: "1px solid rgba(118,228,247,0.22)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                boxShadow: "0 0 18px -8px rgba(118,228,247,0.5)",
                fontFamily: '"Inter",sans-serif',
                whiteSpace: "nowrap",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: MUTED,
                }}
              >
                {c.label}
              </span>
              <span
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: NEARWHITE,
                }}
              >
                {c.value}
              </span>
            </div>
          </div>
        ))}

        {/* ===== RIGHT: brain core medallion ===== */}
        <div
          className="absolute z-10"
          style={{
            right: 70,
            top: "50%",
            width: 230,
            height: 230,
            transform: "translateY(-50%)",
          }}
        >
          {/* outer ambient glow */}
          <div
            aria-hidden
            className="absolute syn-anim"
            style={{
              inset: -40,
              borderRadius: "50%",
              background:
                "radial-gradient(circle, rgba(118,228,247,0.35) 0%, rgba(118,228,247,0.08) 45%, transparent 70%)",
              animation: "syn-glow-pulse 5s ease-in-out infinite",
              filter: "blur(6px)",
            }}
          />

          {/* concentric orbiting rings */}
          <div
            aria-hidden
            className="absolute syn-anim"
            style={{
              inset: 2,
              borderRadius: "50%",
              border: "1px solid rgba(118,228,247,0.22)",
              borderTopColor: "rgba(118,228,247,0.7)",
              animation: "syn-orbit 14s linear infinite",
            }}
          />
          <div
            aria-hidden
            className="absolute syn-anim"
            style={{
              inset: 18,
              borderRadius: "50%",
              border: "1px dashed rgba(118,228,247,0.2)",
              borderLeftColor: "rgba(118,228,247,0.55)",
              animation: "syn-orbit-rev 22s linear infinite",
            }}
          />

          {/* orbiting neural particles */}
          <div
            aria-hidden
            className="absolute syn-anim"
            style={{
              inset: 0,
              animation: "syn-particle-spin 18s linear infinite",
            }}
          >
            {particles.map((p) => (
              <span
                key={p.id}
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  width: p.size,
                  height: p.size,
                  borderRadius: "50%",
                  background: ICY,
                  boxShadow: `0 0 8px ${CERULEAN}`,
                  transform: `rotate(${p.angle}deg) translateX(${p.radius}px)`,
                }}
              />
            ))}
          </div>

          {/* inner glass disc + brain image masked into circle */}
          <div
            className="absolute syn-anim"
            style={{
              inset: 26,
              borderRadius: "50%",
              overflow: "hidden",
              background:
                "radial-gradient(circle at 50% 40%, rgba(12,56,76,0.7) 0%, rgba(4,20,28,0.9) 80%)",
              border: "1px solid rgba(118,228,247,0.35)",
              boxShadow:
                "inset 0 0 30px rgba(118,228,247,0.25), 0 0 30px -6px rgba(118,228,247,0.5)",
              animation: "syn-core-float 7s ease-in-out infinite",
            }}
          >
            <img
              src="/__mockup/images/brain-cut.png"
              alt="Glowing neural brain core"
              style={{
                position: "absolute",
                width: "150%",
                maxWidth: "none",
                top: "50%",
                left: "50%",
                transform: "translate(-58%, -50%)",
                filter:
                  "drop-shadow(0 0 14px rgba(118,228,247,0.55)) saturate(125%) brightness(1.08)",
                pointerEvents: "none",
              }}
            />
            {/* cyan tint wash to integrate into glass world */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 45%, rgba(118,228,247,0.12) 0%, transparent 60%)",
                mixBlendMode: "screen",
              }}
            />
            {/* inset top highlight */}
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                borderRadius: "50%",
                boxShadow: "inset 0 2px 6px rgba(167,243,255,0.18)",
              }}
            />
          </div>
        </div>

        {/* inset top edge highlight on the whole card */}
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 pointer-events-none"
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(167,243,255,0.4), transparent)",
          }}
        />
      </div>
    </div>
  );
}
