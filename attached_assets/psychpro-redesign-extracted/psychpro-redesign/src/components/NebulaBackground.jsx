import React, { useMemo } from 'react';

/**
 * NebulaBackground
 * Fixed full-viewport background layer that sits behind all content.
 * Mount once at the root of the app.
 *
 * Layered composition:
 *   1. Deep navy base
 *   2. Radial cyan glow zones (the "nebula clouds")
 *   3. Drifting particle field
 *
 * No lightning bolts. No electrical arcs. Soft luminescence only.
 */
export default function NebulaBackground({ particleCount = 60 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }).map((_, i) => ({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 12,
        duration: 10 + Math.random() * 14,
        size: 1 + Math.random() * 2,
        opacity: 0.2 + Math.random() * 0.5,
      })),
    [particleCount]
  );

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
        background: 'var(--bg-deepest)',
      }}
    >
      {/* Base radial glow — center brain area */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 60% 50% at 50% 30%, rgba(77, 228, 255, 0.18) 0%, rgba(27, 77, 122, 0.10) 35%, transparent 70%)',
        }}
      />

      {/* Left nebula cloud */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '-10%',
          width: '60%',
          height: '70%',
          background:
            'radial-gradient(ellipse at center, rgba(27, 77, 122, 0.45) 0%, rgba(13, 37, 64, 0.25) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Right nebula cloud */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          right: '-10%',
          width: '60%',
          height: '70%',
          background:
            'radial-gradient(ellipse at center, rgba(27, 77, 122, 0.45) 0%, rgba(13, 37, 64, 0.25) 40%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Bottom darkening vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, transparent 50%, rgba(5, 11, 20, 0.6) 100%)',
        }}
      />

      {/* Particle starfield */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            top: `${p.top}%`,
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
