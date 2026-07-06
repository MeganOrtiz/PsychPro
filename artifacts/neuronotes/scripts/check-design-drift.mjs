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
//   2. The pigment-only cerulean glass card — the main-site `.bg-card` rule,
//      which mirrors the EPPP `.epd-card`: a 145° diagonal fill, fixed 20px
//      (NON-pill) corner, blur(5px) saturate(190%) glass, and no cyan bloom or
//      corona. Guards against both structural drift and the recurring glow.
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

// --- 1b) Native background artwork ----------------------------------------
// The global color-processing filter and dark vignette made both background
// variants look as though a film had been laid over the page. Keep the two
// sanctioned assets, but render each directly at its native color/contrast.
const appBackdrop = ruleBlock(css, ".study-page-bg::before");
const landingBackdrop = ruleBlock(css, ".landing-root.study-page-bg::before");
for (const [name, block, asset] of [
  ["app", appBackdrop, "app-smoke.webp"],
  ["landing", landingBackdrop, "brain-clouds.webp"],
]) {
  if (!block) {
    fail(`${name} backdrop rule missing`, `restore the canonical ${name} ::before backdrop rule`);
    continue;
  }
  if (!new RegExp(`background-image:\\s*url\\(["']?\\./assets/bg/${asset.replace('.', '\\.')}["']?\\);`).test(block)) {
    fail(`${name} backdrop asset or layering drifted`, `render ${asset} directly as the sole background-image`);
  }
  if (/\bfilter\s*:|radial-gradient\(/.test(block)) {
    fail(`${name} backdrop film reintroduced`, "keep the background artwork free of global filters and vignette gradients");
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
    { name: "glass blur", re: /backdrop-filter:\s*blur\(5px\)\s*saturate\(190%\)/, expected: "backdrop-filter: blur(5px) saturate(190%)" },
    { name: "145° diagonal bloom", re: /linear-gradient\(\s*145deg/, expected: "linear-gradient(145deg, …)" },
    { name: "cerulean hairline border", re: /rgba\(196,\s*232,\s*242,\s*0\.22\)/, expected: "border: 1px solid rgba(196, 232, 242, 0.22)" },
    { name: "restrained inset highlight", re: /inset\s+0\s+1px\s+0\s+rgba\(255,\s*255,\s*255,\s*0\.03\)/, expected: "inset 0 1px 0 rgba(255, 255, 255, 0.03)" },
  ];
  for (const r of RECIPE) {
    if (!r.re.test(cardRecipe)) {
      fail(`.bg-card recipe: ${r.name} changed or removed`, `restore \`${r.expected}\``);
    }
  }
  // Pigment-only lock: the card must NOT reintroduce the cyan top-bloom radial
  // or the cyan inner-glow / outer-corona box-shadow layers. Depth comes from
  // PIGMENT (saturation + contrast), not glow. This cyan glow kept drifting back
  // onto the dashboards, so the card is pinned glow-free — its only colors are
  // the hsl() fill and the rgba(196,232,242) hairline border.
  if (/rgba\(118,\s*228,\s*247/.test(cardRecipe)) {
    fail(
      ".bg-card recipe: cyan glow re-added (rgba(118, 228, 247, …) inside the card)",
      "keep the card pigment-only — remove the cyan top-bloom radial and the cyan inner/outer corona box-shadow layers",
    );
  }
}

// Landing, authenticated app, and EPPP must use one card recipe. These checks
// intentionally span the page-local CSS sources so none of the three surfaces
// can quietly become brighter, blurrier, rounder, or a different hue.
const SHARED_CARD_CONTRACT = [
  { name: "145° pigment gradient", re: /linear-gradient\(145deg,\s*hsl\(var\(--surf-hue\) 100% 17% \/ 0\.95\),\s*hsl\(var\(--surf-hue\) 100% 11% \/ 0\.99\)\)/ },
  { name: "cerulean hairline", re: /rgba\(196,\s*232,\s*242,\s*0\.22\)/ },
  { name: "glass blur", re: /blur\(5px\) saturate\(190%\)/ },
  { name: "restrained inset highlight", re: /inset\s+0\s+1px\s+0\s+rgba\(255,\s*255,\s*255,\s*0\.03\)/ },
  { name: "neutral depth shadow", re: /0\s+22px\s+52px\s+-40px\s+rgba\(0,\s*0,\s*0,\s*0\.80\)/ },
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
