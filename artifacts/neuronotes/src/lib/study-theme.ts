// LOCKED PALETTE — pure cyan-blue (hue ~200), no green/teal cast.
// Do NOT shift hues toward 180-194 (that reads green/teal). Backgrounds
// stay deep navy. Accents stay clean cerulean-blue, matching the
// Brain Lab PALETTE constant.
// BACKGROUNDS: #031923 primary, #062634 secondary, #082B3A card,
//   #0C3446 card-hover, #041A24 sidebar, #0A2D3D input.
// ACCENTS: #5EB8E0 primary, #7CCEF0 bright, #9FDBF2 soft,
//   #2A7E97 dark, #0C3846 deep sea blue.
// TEXT: #E4F4F6 primary, #B7D5DC secondary, #7FA4AD muted.
export const STUDY_PALETTE = {
  bg: "#041A24",         // sidebar / deepest anchor
  steel: "#062634",      // bg-secondary
  surface: "#082B3A",    // bg-card
  surfaceElev: "#0C3446", // bg-card-hover
  teal: "#5EB8E0",       // cerulean-primary (was #5EB0C8 — too green)
  tealDeep: "#2A7E97",   // cerulean-dark (was #2A7387)
  surf: "#9FDBF2",       // cerulean-soft (was #8FD3E3)
  mist: "#E4F4F6",       // text-primary
  ink: "#031923",        // bg-primary (darkest)
  inkSoft: "#7FA4AD",    // text-muted
  paper: "#E4F4F6",      // text-primary (light text)
  paperSoft: "#B7D5DC",  // text-secondary
  cloud: "#E4F4F6",
} as const;

export type StudyTone = "light" | "dark" | "accent" | "card-front";
