import { CoursesShell, type CardRecipe } from "./_data";

const EPPP_CURRENT: CardRecipe = {
  background:
    "radial-gradient(125% 80% at 50% 0%, rgba(118,228,247,0.10) 0%, rgba(118,228,247,0.00) 58%), linear-gradient(145deg, hsl(192 88% 19% / 0.74), hsl(192 88% 14% / 0.85))",
  border: "rgba(196,232,242,0.22)",
  borderRadius: 20,
  backdropFilter: "blur(20px) saturate(135%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.12), inset 0 0 40px -22px rgba(118,228,247,0.42), 0 0 28px -6px rgba(118,228,247,0.30), 0 24px 60px -42px rgba(0,0,0,0.72)",
};

export function EpppCurrent() {
  return <CoursesShell recipe={EPPP_CURRENT} />;
}
