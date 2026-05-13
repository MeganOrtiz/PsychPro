import { useMemo } from "react";

export function CosmicBackground() {
  const stars = useMemo(
    () =>
      Array.from({ length: 80 }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 4,
        duration: 3 + Math.random() * 4,
      })),
    []
  );

  return (
    <div className="cosmic-bg" aria-hidden="true">
      <div className="nebula-cloud nebula-cloud--left" />
      <div className="nebula-cloud nebula-cloud--right" />
      <div className="nebula-cloud nebula-cloud--bottom-left" />
      <div className="nebula-cloud nebula-cloud--bottom-right" />

      {stars.map((s) => (
        <span
          key={s.id}
          className="star"
          style={{
            top: `${s.top}%`,
            left: `${s.left}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export function BrainHero() {
  const filaments = useMemo(
    () =>
      Array.from({ length: 20 }).map((_, i) => ({
        id: i,
        angle: (i * 360) / 20 + Math.random() * 8,
        length: 280 + Math.random() * 200,
        delay: Math.random() * 4,
      })),
    []
  );

  return (
    <div className="brain-hero-container">
      {filaments.map((f) => (
        <div
          key={f.id}
          className="filament"
          style={{
            width: `${f.length}px`,
            transform: `translate(0, -50%) rotate(${f.angle}deg)`,
            animationDelay: `${f.delay}s`,
          }}
        />
      ))}

      <div className="brain-halo" />

      <svg
        className="brain-hero"
        viewBox="0 0 400 400"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
      >
        <defs>
          <radialGradient id="brainGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#7FF0FF" stopOpacity="1" />
            <stop offset="40%" stopColor="#4DE4FF" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#1B6B8A" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0A2840" stopOpacity="0.95" />
          </radialGradient>

          <linearGradient id="ridgeGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#A8F0FF" stopOpacity="1" />
            <stop offset="100%" stopColor="#4DE4FF" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="fissure" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#7FF0FF" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#4DE4FF" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1B4D7A" stopOpacity="0.4" />
          </linearGradient>

          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g filter="url(#softGlow)">
          <path
            d="M 200 60 C 130 60, 80 110, 75 180 C 72 240, 90 300, 130 335 C 160 360, 185 365, 200 365 L 200 60 Z"
            fill="url(#brainGlow)"
            stroke="#7FF0FF"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          <g stroke="url(#ridgeGlow)" strokeWidth="1.2" fill="none" opacity="0.85">
            <path d="M 195 80 Q 150 90, 120 130 Q 100 160, 105 200" />
            <path d="M 195 110 Q 140 120, 105 165 Q 90 200, 100 240" />
            <path d="M 195 145 Q 130 155, 95 200 Q 85 235, 105 275" />
            <path d="M 195 180 Q 125 190, 95 230 Q 90 265, 120 305" />
            <path d="M 195 215 Q 130 225, 110 265 Q 110 295, 140 325" />
            <path d="M 195 250 Q 140 260, 130 295 Q 140 320, 170 345" />
            <path d="M 195 285 Q 160 295, 160 320 Q 175 345, 195 355" />
          </g>
          <g stroke="#A8F0FF" strokeWidth="0.7" fill="none" opacity="0.5">
            <path d="M 110 140 Q 145 145, 180 135" />
            <path d="M 95 180 Q 135 185, 175 175" />
            <path d="M 90 220 Q 135 225, 175 215" />
            <path d="M 100 260 Q 140 265, 180 255" />
            <path d="M 120 300 Q 155 305, 185 295" />
          </g>
        </g>

        <g filter="url(#softGlow)">
          <path
            d="M 200 60 C 270 60, 320 110, 325 180 C 328 240, 310 300, 270 335 C 240 360, 215 365, 200 365 L 200 60 Z"
            fill="url(#brainGlow)"
            stroke="#7FF0FF"
            strokeWidth="1"
            strokeOpacity="0.6"
          />
          <g stroke="url(#ridgeGlow)" strokeWidth="1.2" fill="none" opacity="0.85">
            <path d="M 205 80 Q 250 90, 280 130 Q 300 160, 295 200" />
            <path d="M 205 110 Q 260 120, 295 165 Q 310 200, 300 240" />
            <path d="M 205 145 Q 270 155, 305 200 Q 315 235, 295 275" />
            <path d="M 205 180 Q 275 190, 305 230 Q 310 265, 280 305" />
            <path d="M 205 215 Q 270 225, 290 265 Q 290 295, 260 325" />
            <path d="M 205 250 Q 260 260, 270 295 Q 260 320, 230 345" />
            <path d="M 205 285 Q 240 295, 240 320 Q 225 345, 205 355" />
          </g>
          <g stroke="#A8F0FF" strokeWidth="0.7" fill="none" opacity="0.5">
            <path d="M 290 140 Q 255 145, 220 135" />
            <path d="M 305 180 Q 265 185, 225 175" />
            <path d="M 310 220 Q 265 225, 225 215" />
            <path d="M 300 260 Q 260 265, 220 255" />
            <path d="M 280 300 Q 245 305, 215 295" />
          </g>
        </g>

        <rect x="198" y="60" width="4" height="305" fill="url(#fissure)" opacity="0.95" />
        <rect x="199" y="60" width="2" height="305" fill="#A8F0FF" opacity="0.7" />

        <ellipse cx="200" cy="70" rx="60" ry="12" fill="#A8F0FF" opacity="0.4" filter="url(#softGlow)" />

        <circle cx="150" cy="180" r="3" fill="#A8F0FF" opacity="0.7" />
        <circle cx="250" cy="180" r="3" fill="#A8F0FF" opacity="0.7" />
        <circle cx="170" cy="250" r="2.5" fill="#A8F0FF" opacity="0.6" />
        <circle cx="230" cy="250" r="2.5" fill="#A8F0FF" opacity="0.6" />
        <circle cx="160" cy="120" r="2" fill="#A8F0FF" opacity="0.8" />
        <circle cx="240" cy="120" r="2" fill="#A8F0FF" opacity="0.8" />
      </svg>
    </div>
  );
}
