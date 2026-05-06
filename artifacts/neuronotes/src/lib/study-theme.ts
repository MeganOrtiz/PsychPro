// Reference palette (from landing page swatches):
//   Deep Sea Teal   #0C3846  — primary card surface
//   Arctic Ocean    #2A7387  — mid accent / lifted surface
//   Cerulean Ripple #5EB0C8  — cerulean accent
//   Icy Glaze       #9FD3E3  — light text / muted
//   Frost White     #E4F4F8  — pure light text
export const STUDY_PALETTE = {
  bg: "#08252F",         // page bg — slightly deeper than Deep Sea Teal
  steel: "#0C3846",      // Deep Sea Teal
  surface: "#0C3846",    // Deep Sea Teal — card surface
  surfaceElev: "#2A7387", // Arctic Ocean Blue — lifted/hover
  teal: "#5EB0C8",       // Cerulean Ripple
  tealDeep: "#2A7387",   // Arctic Ocean Blue
  surf: "#9FD3E3",       // Icy Glaze
  mist: "#E4F4F8",       // Frost White
  ink: "#06202A",        // darkest navy text on light surfaces
  inkSoft: "#3D5A6E",
  paper: "#E4F4F8",      // Frost White
  paperSoft: "#9FD3E3",  // Icy Glaze
  cloud: "#E4F4F8",
} as const;

export type StudyTone = "light" | "dark" | "accent";
