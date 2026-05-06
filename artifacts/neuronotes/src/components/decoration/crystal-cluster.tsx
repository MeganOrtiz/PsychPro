import { type CSSProperties } from "react";

interface CrystalClusterProps {
  className?: string;
  style?: CSSProperties;
  variant?: "cluster" | "shard" | "spire";
  opacity?: number;
}

/**
 * Decorative ice/crystal SVG cluster used as ambient page accent.
 * Pure SVG — scales crisply, themeable via currentColor on strokes,
 * and ships with internal cerulean→cyan gradients tuned to the site
 * palette (#5EB0C8 / #9FD3E3 / #2A7387). Pointer-events none.
 */
export function CrystalCluster({
  className,
  style,
  variant = "cluster",
  opacity = 0.55,
}: CrystalClusterProps) {
  if (variant === "shard") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 200 240"
        className={className}
        style={{ pointerEvents: "none", opacity, ...style }}
      >
        <defs>
          <linearGradient id="shardFace" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#9FD3E3" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#5EB0C8" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2A7387" stopOpacity="0.30" />
          </linearGradient>
          <linearGradient id="shardEdge" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#082B3A" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#1F4F66" stopOpacity="0.65" />
          </linearGradient>
        </defs>
        <polygon
          points="100,10 160,90 130,230 70,230 40,90"
          fill="url(#shardFace)"
          stroke="#9FD3E3"
          strokeOpacity="0.55"
          strokeWidth="1"
        />
        <polygon
          points="100,10 130,230 70,230"
          fill="url(#shardEdge)"
          opacity="0.55"
        />
        <polyline
          points="100,10 100,230"
          stroke="#E4F4F6"
          strokeOpacity="0.35"
          strokeWidth="0.8"
        />
      </svg>
    );
  }

  if (variant === "spire") {
    return (
      <svg
        aria-hidden
        viewBox="0 0 320 200"
        className={className}
        style={{ pointerEvents: "none", opacity, ...style }}
      >
        <defs>
          <linearGradient id="spireFace" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#9FD3E3" stopOpacity="0.75" />
            <stop offset="100%" stopColor="#2A7387" stopOpacity="0.20" />
          </linearGradient>
        </defs>
        {/* Three back spires */}
        <polygon points="60,200 80,40 100,200" fill="url(#spireFace)" stroke="#5EB0C8" strokeOpacity="0.45" strokeWidth="1" />
        <polygon points="180,200 210,20 240,200" fill="url(#spireFace)" stroke="#5EB0C8" strokeOpacity="0.45" strokeWidth="1" />
        <polygon points="240,200 270,80 300,200" fill="url(#spireFace)" stroke="#5EB0C8" strokeOpacity="0.45" strokeWidth="1" />
        {/* Front spires */}
        <polygon points="20,200 50,90 80,200" fill="url(#spireFace)" stroke="#9FD3E3" strokeOpacity="0.55" strokeWidth="1" opacity="0.9" />
        <polygon points="120,200 150,55 180,200" fill="url(#spireFace)" stroke="#9FD3E3" strokeOpacity="0.55" strokeWidth="1" opacity="0.9" />
      </svg>
    );
  }

  // cluster — full ice-crystal formation (matches the reference mockup)
  return (
    <svg
      aria-hidden
      viewBox="0 0 360 260"
      className={className}
      style={{ pointerEvents: "none", opacity, ...style }}
    >
      <defs>
        <linearGradient id="clusterFace" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#9FD3E3" stopOpacity="0.80" />
          <stop offset="60%" stopColor="#5EB0C8" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#2A7387" stopOpacity="0.22" />
        </linearGradient>
        <linearGradient id="clusterShadow" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#062634" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#1F4F66" stopOpacity="0.45" />
        </linearGradient>
        <radialGradient id="clusterGlow" cx="50%" cy="60%" r="60%">
          <stop offset="0%" stopColor="#5EB0C8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#5EB0C8" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Underglow */}
      <ellipse cx="180" cy="230" rx="170" ry="40" fill="url(#clusterGlow)" />

      {/* Background spires (smaller, dimmer) */}
      <polygon points="30,260 60,140 90,260" fill="url(#clusterFace)" stroke="#5EB0C8" strokeOpacity="0.35" strokeWidth="0.8" opacity="0.7" />
      <polygon points="270,260 300,160 330,260" fill="url(#clusterFace)" stroke="#5EB0C8" strokeOpacity="0.35" strokeWidth="0.8" opacity="0.7" />
      <polygon points="310,260 335,180 360,260" fill="url(#clusterFace)" stroke="#5EB0C8" strokeOpacity="0.30" strokeWidth="0.8" opacity="0.55" />

      {/* Main cluster — left tall shard */}
      <polygon points="80,260 110,80 140,260" fill="url(#clusterFace)" stroke="#9FD3E3" strokeOpacity="0.55" strokeWidth="1" />
      <polygon points="110,80 140,260 125,260" fill="url(#clusterShadow)" opacity="0.7" />
      <polyline points="110,80 110,260" stroke="#E4F4F6" strokeOpacity="0.30" strokeWidth="0.8" />

      {/* Main cluster — center tallest shard */}
      <polygon points="140,260 180,30 220,260" fill="url(#clusterFace)" stroke="#9FD3E3" strokeOpacity="0.65" strokeWidth="1.2" />
      <polygon points="180,30 220,260 200,260" fill="url(#clusterShadow)" opacity="0.7" />
      <polyline points="180,30 180,260" stroke="#E4F4F6" strokeOpacity="0.40" strokeWidth="0.9" />

      {/* Main cluster — right mid shard */}
      <polygon points="200,260 240,110 280,260" fill="url(#clusterFace)" stroke="#9FD3E3" strokeOpacity="0.55" strokeWidth="1" />
      <polygon points="240,110 280,260 260,260" fill="url(#clusterShadow)" opacity="0.7" />
      <polyline points="240,110 240,260" stroke="#E4F4F6" strokeOpacity="0.30" strokeWidth="0.8" />

      {/* Front small foreground crystal */}
      <polygon points="155,260 175,180 195,260" fill="url(#clusterFace)" stroke="#9FD3E3" strokeOpacity="0.70" strokeWidth="1" opacity="0.95" />

      {/* Sparkle highlights */}
      <circle cx="180" cy="55" r="1.6" fill="#E4F4F6" opacity="0.9" />
      <circle cx="110" cy="100" r="1.2" fill="#E4F4F6" opacity="0.8" />
      <circle cx="240" cy="130" r="1.2" fill="#E4F4F6" opacity="0.8" />
      <circle cx="60" cy="160" r="1" fill="#E4F4F6" opacity="0.6" />
      <circle cx="300" cy="180" r="1" fill="#E4F4F6" opacity="0.6" />
    </svg>
  );
}
