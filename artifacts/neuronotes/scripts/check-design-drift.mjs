#!/usr/bin/env node
// =============================================================================
// DESIGN SYSTEM LOCK  (shape / structure guardrail)
//
// Companion to check-surface-hue.mjs. The hue guardrail pins COLOR; this one
// pins the STRUCTURAL design tokens and the canonical glass-card recipe, so a
// page-level tweak can never silently change the global look. It locks:
//
//   1. Global structural tokens  — the corner-radius token (--radius) and the
//      surface-hue base token (--surf-hue).
//   2. The canonical cerulean glass card — the main-site `.bg-card` rule,
//      which mirrors the EPPP `.epd-card`: a 145° diagonal TRANSLUCENT fill,
//      fixed 20px (NON-pill) corner, blur(20px) saturate(135%) glass, and the
//      subtle cyan top-bloom + inner/outer corona (the June-27 refined glass).
//      Guards against drift AND against the flat opaque pigment variant creeping
//      back (which strips the glass and reads dark/muddy).
//   3. A ban on mint / teal-green accents — cerulean #76E4F7 is the only accent;
//      mint was retracted app-wide and keeps trying to creep back.
//
// Every locked value lives in a table below. When you INTENTIONALLY change the
// design system, update the matching entry here in the SAME commit — that is the
// deliberate "unlock". An accidental drift fails this check loudly.
//
// Run: node scripts/check-design-drift.mjs   (exit 1 on any violation)
// =============================================================================
import fs from "fs";
import path from "path";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const CSS = path.join(ROOT, "src", "index.css");
const REL = path.relative(ROOT, CSS);

const raw = fs.readFileSync(CSS, "utf8");
// Blank out CSS comments (keeping newlines, so line numbers stay accurate) so a
// value mentioned in a comment can never satisfy OR trip a lock.
const css = raw.replace(/\/\*[\s\S]*?\*\//g, (mm) => mm.replace(/[^\n]/g, " "));
const lineOf = (idx) => css.slice(0, idx).split("\n").length;

const violations = [];
const fail = (what, fix) => violations.push({ what, fix });

// Extract a flat CSS rule body by brace-matching from a selector substring.
function ruleBlock(source, selectorNeedle) {
  const sel = source.indexOf(selectorNeedle);
  if (sel === -1) return null;
  const open = source.indexOf("{", sel);
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < source.length; i++) {
    if (source[i] === "{") depth++;
    else if (source[i] === "}") {
      depth--;
      if (depth === 0) return source.slice(open + 1, i);
    }
  }
  return null;
}

// --- 1) Global structural tokens (scoped to :root) -------------------------
const rootBlock = ruleBlock(css, ":root");
const TOKENS = [
  { name: "global corner radius", re: /--radius:\s*\.625rem;/, expected: "--radius: .625rem;" },
  { name: "surface hue base", re: /--surf-hue:\s*193;/, expected: "--surf-hue: 193;" },
];
if (!rootBlock) {
  fail(":root block not found in index.css", "restore the :root design-token block");
} else {
  for (const t of TOKENS) {
    if (!t.re.test(rootBlock)) {
      fail(`${t.name} token drifted or missing`, `restore \`${t.expected}\` in the index.css :root block`);
    }
  }
}

// --- 2) Canonical pigment-only glass card (.bg-card == EPPP .epd-card) -------
const cardRecipe = ruleBlock(css, ".study-page-bg .bg-card");
if (!cardRecipe) {
  fail(
    "canonical .bg-card glass recipe block not found",
    "the `.study-page-bg .bg-card` rule was removed — restore the EPPP .epd-card recipe",
  );
} else {
  const RECIPE = [
    { name: "non-pill 20px corner", re: /border-radius:\s*20px;/, expected: "border-radius: 20px;" },
    { name: "glass blur", re: /backdrop-filter:\s*blur\(20px\)\s*saturate\(135%\)/, expected: "backdrop-filter: blur(20px) saturate(135%)" },
    { name: "145° diagonal bloom", re: /linear-gradient\(\s*145deg/, expected: "linear-gradient(145deg, …)" },
    { name: "cerulean hairline border", re: /rgba\(196,\s*232,\s*242,\s*0\.22\)/, expected: "border: 1px solid rgba(196, 232, 242, 0.22)" },
  ];
  for (const r of RECIPE) {
    if (!r.re.test(cardRecipe)) {
      fail(`.bg-card recipe: ${r.name} changed or removed`, `restore \`${r.expected}\``);
    }
  }
  // Glow lock (June-27 glass): the card MUST keep the subtle cyan top-bloom +
  // inner-glow / outer-corona that define the owner's canonical refined glass.
  // The flat opaque pigment variant (no rgba(118,228,247) glow) kept getting
  // applied by mistake — it strips the glass and reads dark/muddy — so the glow
  // is pinned PRESENT. Depth = translucent fill + heavy blur + a SOFT glow.
  if (!/rgba\(118,\s*228,\s*247/.test(cardRecipe)) {
    fail(
      ".bg-card recipe: cyan glass glow removed (no rgba(118, 228, 247, …) in the card)",
      "restore the June-27 glass — add back the cyan top-bloom radial and the cyan inner/outer corona box-shadow layers",
    );
  }
}

// --- 3) Banned mint / teal-green accents -----------------------------------
// Cerulean #76E4F7 is the only locked accent. These mint/teal hexes keep
// drifting back in. (Scoped to index.css — TS files legitimately mention them
// in "never mint" comments.)
const MINT = /#(5eead4|2dd4bf|14b8a6)\b/gi;
let m;
while ((m = MINT.exec(css))) {
  fail(
    `mint/teal-green accent ${m[0]} at ${REL}:${lineOf(m.index)}`,
    "use the locked cerulean #76E4F7 / rgba(118, 228, 247, A) — mint was retracted app-wide",
  );
}

// --- Report ----------------------------------------------------------------
if (violations.length) {
  console.error(`\n✗ Design system lock FAILED — ${violations.length} drift(s) from the locked visual system:\n`);
  for (const v of violations) console.error(`  • ${v.what}\n      → ${v.fix}`);
  console.error(`\nThese values are pinned in scripts/check-design-drift.mjs (see docs/design-system-lock.md).`);
  console.error(`If the change is intentional, update the matching lock entry in the same commit.\n`);
  process.exit(1);
}
console.log("✓ Design system lock passed — glass-card recipe, radius/hue tokens, and cerulean accent are intact.");
