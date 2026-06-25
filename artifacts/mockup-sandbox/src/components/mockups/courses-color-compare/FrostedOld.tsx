import { CoursesShell, type CardRecipe } from "./_data";

const FROSTED_OLD: CardRecipe = {
  background:
    "linear-gradient(180deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.035) 22%, rgba(255,255,255,0.00) 55%), linear-gradient(160deg, hsl(192 46% 16% / 0.48), hsl(192 52% 9% / 0.66))",
  border: "rgba(118,228,247,0.22)",
  borderRadius: 22,
  backdropFilter: "blur(18px) saturate(118%)",
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,0.16), 0 18px 44px -26px rgba(0,0,0,0.70)",
};

export function FrostedOld() {
  return <CoursesShell recipe={FROSTED_OLD} />;
}
