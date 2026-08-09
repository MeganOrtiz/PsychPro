/**
 * PsychPro mobile design tokens — synced from the web app's white/luminous
 * system (artifacts/neuronotes src/index.css + src/lib/palette.ts).
 *
 * Ground is PURE WHITE. Neutral ink text, silver-chrome primary actions with
 * dark ink labels (never white labels on light fills), cyan (hue-192) accents
 * reserved for icons/rings/data viz.
 */

const colors = {
  light: {
    // Legacy aliases
    text: '#24282c',
    tint: '#0891b2',

    // Core surfaces — pure white ground
    background: '#ffffff',
    foreground: '#24282c',

    // Cards / elevated surfaces
    card: '#ffffff',
    cardForeground: '#24282c',

    // Primary action = silver chrome with dark ink label
    primary: '#e2e5e8',
    primaryForeground: '#24282c',

    // Secondary surfaces
    secondary: '#f8f9fa',
    secondaryForeground: '#24282c',

    // Muted
    muted: '#f5f5f5',
    mutedForeground: '#6b7278',

    // Accent — cyan hue-192 (icons, rings, charts only; not fills)
    accent: '#0891b2',
    accentForeground: '#ffffff',
    accentSoft: '#e0f4f9',

    // Status
    destructive: '#ef4444',
    destructiveForeground: '#ffffff',
    success: '#22c55e',
    successDeep: '#15803d',
    amber: '#f59e0b',

    // Borders / inputs
    border: '#e2e5e8',
    borderStrong: '#c8d2d6',
    input: '#e2e5e8',

    // Chrome button gradient stops (silver-chrome primaries)
    chromeTop: '#f7f8f9',
    chromeBottom: '#dfe3e6',
    chromeBorder: '#c3c9ce',

    // Ink ladder
    ink: '#24282c',
    inkSoft: '#4b5157',
    inkDim: '#6b7278',
  },

  // Matches web --radius vibe; chrome buttons use 10px radius site-wide.
  radius: 10,
};

export default colors;
