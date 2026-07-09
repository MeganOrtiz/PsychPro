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
//   2. The liquid-neuroglass card — the main-site `.bg-card` rule, which
//      mirrors the EPPP `.epd-card`: near-black glass, cyan specular edge light,
//      fixed 18px corner, blur(18px) saturate(210%) glass, and restrained glow.
//   3. A ban on mint / teal-green accents — cyan #76E4F7 is the only accent;
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
const BUTTON = path.join(ROOT, "src", "components", "ui", "button.tsx");
const CARD = path.join(ROOT, "src", "components", "ui", "card.tsx");
const LANDING = path.join(ROOT, "src", "pages", "landing.tsx");
const EPPP_DASHBOARD = path.join(ROOT, "src", "pages", "eppp-dashboard.tsx");
const REL = path.relative(ROOT, CSS);

const raw = fs.readFileSync(CSS, "utf8");
const buttonSource = fs.readFileSync(BUTTON, "utf8");
const cardSource = fs.readFileSync(CARD, "utf8");
const landingSource = fs.readFileSync(LANDING, "utf8");
const epppDashboardSource = fs.readFileSync(EPPP_DASHBOARD, "utf8");
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
  { name: "surface hue base", re: /--surf-hue:\s*190;/, expected: "--surf-hue: 190;" },
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

// --- 1b) Native background artwork ----------------------------------------
// Keep one sanctioned app stage and one sanctioned landing hero reference.
// Gradients are now part of the intentional black-stage treatment; CSS filter
// remains banned because it dulls the glossy cyan source art.
const appBackdrop = ruleBlock(css, ".study-page-bg::before");
const landingBackdrop = ruleBlock(css, ".landing-root.study-page-bg::before");
for (const [name, block, asset] of [
  ["app", appBackdrop, "app-smoke.webp"],
  ["landing", landingBackdrop, "liquid-brain.jpeg"],
]) {
  if (!block) {
    fail(`${name} backdrop rule missing`, `restore the canonical ${name} ::before backdrop rule`);
    continue;
  }
  if (!new RegExp(`url\\(["']?\\./assets/bg/${asset.replace('.', '\\.')}["']?\\)`).test(block)) {
    fail(`${name} backdrop asset drifted`, `keep ${asset} in the canonical ${name} backdrop`);
  }
  if (/\bfilter\s*:/.test(block)) {
    fail(`${name} backdrop filter reintroduced`, "keep the background artwork free of global CSS filters");
  }
}

// --- 2) Canonical liquid-neuroglass card (.bg-card == EPPP .epd-card) -------
const cardRecipe = ruleBlock(css, ".study-page-bg .bg-card");
if (!cardRecipe) {
  fail(
    "canonical .bg-card liquid-neuroglass recipe block not found",
    "the `.study-page-bg .bg-card` rule was removed — restore the EPPP .epd-card recipe",
  );
} else {
  const RECIPE = [
    { name: "non-pill 18px corner", re: /border-radius:\s*18px;/, expected: "border-radius: 18px;" },
    { name: "liquid glass blur", re: /backdrop-filter:\s*blur\(18px\)\s*saturate\(210%\)/, expected: "backdrop-filter: blur(18px) saturate(210%)" },
    { name: "specular top highlight", re: /radial-gradient\(\s*120%\s+90%\s+at\s+50%\s+0%/, expected: "radial-gradient(120% 90% at 50% 0%, …)" },
    { name: "145° black-cyan glass", re: /linear-gradient\(\s*145deg,\s*hsl\(var\(--surf-hue\)\s+100%\s+12%\s+\/\s+0\.82\),\s*hsl\(var\(--surf-hue\)\s+100%\s+5%\s+\/\s+0\.96\)\s*\)/, expected: "linear-gradient(145deg, hsl(var(--surf-hue) 100% 12% / 0.82), hsl(var(--surf-hue) 100% 5% / 0.96))" },
    { name: "icy cyan hairline border", re: /rgba\(167,\s*243,\s*255,\s*0\.30\)/, expected: "border: 1px solid rgba(167, 243, 255, 0.30)" },
    { name: "specular inset highlight", re: /inset\s+0\s+1px\s+0\s+rgba\(255,\s*255,\s*255,\s*0\.16\)/, expected: "inset 0 1px 0 rgba(255, 255, 255, 0.16)" },
    { name: "cyan lower reflection", re: /inset\s+0\s+-18px\s+40px\s+-34px\s+rgba\(118,\s*228,\s*247,\s*0\.38\)/, expected: "inset 0 -18px 40px -34px rgba(118, 228, 247, 0.38)" },
  ];
  for (const r of RECIPE) {
    if (!r.re.test(cardRecipe)) {
      fail(`.bg-card recipe: ${r.name} changed or removed`, `restore \`${r.expected}\``);
    }
  }
}

// Landing, authenticated app, and EPPP must use one card recipe. These checks
// intentionally span the page-local CSS sources so none of the three surfaces
// can quietly become brighter, blurrier, rounder, or a different hue.
const SHARED_CARD_CONTRACT = [
  { name: "specular radial highlight", re: /radial-gradient\(120%\s+90%\s+at\s+50%\s+0%,\s*rgba\(167,\s*243,\s*255,\s*0\.13\)/ },
  { name: "145° black-cyan glass", re: /linear-gradient\(145deg,\s*hsl\(var\(--surf-hue\) 100% 12% \/ 0\.82\),\s*hsl\(var\(--surf-hue\) 100% 5% \/ 0\.96\)\)/ },
  { name: "icy cyan hairline", re: /rgba\(167,\s*243,\s*255,\s*0\.30\)/ },
  { name: "liquid glass blur", re: /blur\(18px\) saturate\(210%\)/ },
  { name: "specular inset highlight", re: /inset\s+0\s+1px\s+0\s+rgba\(255,\s*255,\s*255,\s*0\.16\)/ },
  { name: "cyan lower reflection", re: /inset\s+0\s+-18px\s+40px\s+-34px\s+rgba\(118,\s*228,\s*247,\s*0\.38\)/ },
  { name: "black depth shadow", re: /0\s+28px\s+72px\s+-46px\s+rgba\(0,\s*0,\s*0,\s*0\.92\)/ },
];
for (const [surface, source] of [["landing", landingSource], ["EPPP", epppDashboardSource]]) {
  for (const item of SHARED_CARD_CONTRACT) {
    if (!item.re.test(source)) {
      fail(`${surface} card ${item.name} drifted`, "restore the canonical card recipe shared with .study-page-bg .bg-card");
    }
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

// --- 4) Typography contract ------------------------------------------------
// A declared font that is not actually loaded silently falls back differently
// across machines. Keep one interface family and one editorial family.
const TYPE_CONTRACT = [
  {
    name: "Montserrat webfont load",
    re: /family=Montserrat:wght@300;400;500;600;700/,
    expected: "load Montserrat weights 300–700 in the Google Fonts import",
  },
  {
    name: "Merriweather webfont load",
    re: /family=Merriweather:ital,wght@0,400;0,700;1,400/,
    expected: "load the locked Merriweather editorial faces",
  },
  {
    name: "interface font token",
    re: /--app-font-sans:\s*'Montserrat',\s*'Inter',\s*'SF Pro Display',\s*sans-serif;/,
    expected: "restore --app-font-sans to Montserrat with the documented fallbacks",
  },
  {
    name: "editorial font token",
    re: /--app-font-serif:\s*'Merriweather',\s*Georgia,\s*serif;/,
    expected: "restore --app-font-serif to Merriweather with Georgia fallback",
  },
];
for (const t of TYPE_CONTRACT) {
  if (!t.re.test(raw)) fail(`${t.name} changed or missing`, t.expected);
}

// --- 5) Shared component contract -----------------------------------------
// Page-level edits should consume these primitives, not quietly redefine them.
const BUTTON_VARIANTS = [
  ['default', 'btn-glass-strong'],
  ['destructive', 'btn-glass-destructive'],
  ['outline', 'btn-glass'],
  ['secondary', 'btn-glass'],
  ['ghost', 'btn-glass-ghost'],
  ['link', 'btn-link-glow'],
];
for (const [variant, className] of BUTTON_VARIANTS) {
  const re = new RegExp(`${variant}:\\s*["'][^"']*\\b${className}\\b`);
  if (!re.test(buttonSource)) {
    fail(`shared Button ${variant} variant drifted`, `restore the ${className} recipe in src/components/ui/button.tsx`);
  }
}
if (!/rounded-xl\s+border\s+bg-card\s+text-card-foreground\s+shadow/.test(cardSource)) {
  fail(
    "shared Card base recipe drifted",
    "restore `rounded-xl border bg-card text-card-foreground shadow` in src/components/ui/card.tsx",
  );
}

// Parallel glass utilities are how page-level tweaks previously escaped the
// shared recipes. Comments are intentionally ignored by scanning `css`.
for (const banned of ['glass-button', 'cta-glass']) {
  if (new RegExp(`\\.${banned}\\s*\\{`).test(css)) {
    fail(`competing .${banned} utility introduced`, "use the shared btn-glass variants instead");
  }
}

// --- Report ----------------------------------------------------------------
if (violations.length) {
  console.error(`\n✗ Design system lock FAILED — ${violations.length} drift(s) from the locked visual system:\n`);
  for (const v of violations) console.error(`  • ${v.what}\n      → ${v.fix}`);
  console.error(`\nThese values are pinned in scripts/check-design-drift.mjs (see docs/design-system-lock.md).`);
  console.error(`If the change is intentional, update the matching lock entry in the same commit.\n`);
  process.exit(1);
}
console.log("✓ Design system lock passed — color, glass, typography, and shared component contracts are intact.");
