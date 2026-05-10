// Exact palette from user spec.
// BACKGROUNDS: #031923 primary, #062634 secondary, #082B3A card,
//   #0C3446 card-hover, #041A24 sidebar, #0A2D3D input.
// ACCENTS: #5EB0C8 primary, #72C7E2 bright, #8FD3E3 soft,
//   #2A7387 dark, #0C3846 deep sea teal.
// TEXT: #E4F4F6 primary, #B7D5DC secondary, #7FA4AD muted.
export const STUDY_PALETTE = {
  bg: "#041A24",         // sidebar / deepest anchor
  steel: "#062634",      // bg-secondary
  surface: "#082B3A",    // bg-card
  surfaceElev: "#0C3446", // bg-card-hover
  teal: "#5EB0C8",       // cerulean-primary
  tealDeep: "#2A7387",   // cerulean-dark
  surf: "#8FD3E3",       // cerulean-soft
  mist: "#E4F4F6",       // text-primary
  ink: "#031923",        // bg-primary (darkest)
  inkSoft: "#7FA4AD",    // text-muted
  paper: "#E4F4F6",      // text-primary (light text)
  paperSoft: "#B7D5DC",  // text-secondary
  cloud: "#E4F4F6",
} as const;

export type StudyTone = "light" | "dark" | "accent" | "card-front";
