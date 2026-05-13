import React from 'react';

/**
 * BrainMark
 * Small glowing brain SVG used as logo mark in nav and sidebar.
 */
export default function BrainMark({ size = 28, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: 'drop-shadow(0 0 6px rgba(77, 228, 255, 0.6))' }}
    >
      <path
        d="M16 4C12 4 9 6.5 9 10c0 1-0.5 1.5-1.5 2C6 13 5 14.5 5 16.5c0 1.5 0.8 3 2 3.5 0 2 1.5 4 4 4 1 0 2-0.3 2.5-1 0.5 0.7 1.5 1 2.5 1V4Z"
        stroke="var(--cyan-glow)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M16 4c4 0 7 2.5 7 6 0 1 0.5 1.5 1.5 2 1.5 1 2.5 2.5 2.5 4.5 0 1.5-0.8 3-2 3.5 0 2-1.5 4-4 4-1 0-2-0.3-2.5-1-0.5 0.7-1.5 1-2.5 1V4Z"
        stroke="var(--cyan-glow)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path
        d="M16 4v20"
        stroke="var(--cyan-glow)"
        strokeWidth="1"
        opacity="0.5"
      />
      <circle cx="12" cy="12" r="1" fill="var(--cyan-bright)" />
      <circle cx="20" cy="14" r="1" fill="var(--cyan-bright)" />
      <circle cx="13" cy="18" r="1" fill="var(--cyan-bright)" />
      <circle cx="19" cy="19" r="1" fill="var(--cyan-bright)" />
    </svg>
  );
}
