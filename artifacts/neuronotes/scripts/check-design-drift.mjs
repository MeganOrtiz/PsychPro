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
//   2. The luminous cerulean glass card — the main-site `.bg-card` rule, which
//      mirrors the EPPP `.epd-card`: a 145° diagonal bloom, a fixed 20px (NON-
//      pill) corner, blur(20px) saturate(135%) glass, and the cyan inner glow +
//      outer corona shadow. Guards against the recurring drift toward rounder,
//      softer, pill-like controls.
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
// The canonical background is one supplied JPEG rendered directly everywhere.
// No page may add a separate landing/dashboard asset, global color-processing
// filter, vignette, blend mode, or pseudo-element glow over it.
const appBackdrop = ruleBlock(css, ".study-page-bg::before");
const landingBackdrop = ruleBlock(css, ".landing-root.study-page-bg::before");
const overlayBackdrop = ruleBlock(css, ".study-page-bg::after");
if (!appBackdrop) {
  fail("canonical app backdrop rule missing", "restore the .study-page-bg::before backdrop rule");
} else {
  if (!/background-image:\s*url\(["']?\.\/assets\/bg\/psychpro-smoke-bg-hq\.jpeg["']?\);/.test(appBackdrop)) {
    fail("canonical backdrop asset or layering drifted", "render psychpro-smoke-bg-hq.jpeg directly as the sole background-image");
  }
  if (/\bfilter\s*:|radial-gradient\(|linear-gradient\(|background-blend-mode\s*:/.test(appBackdrop)) {
    fail("canonical backdrop film reintroduced", "keep the background artwork free of filters, blend modes, and vignette gradients");
  }
}
if (landingBackdrop) {
  fail("landing backdrop override reintroduced", "landing must inherit the shared .study-page-bg::before psychpro-smoke-bg-hq.jpeg artwork");
}
if (!overlayBackdrop) {
  fail("reserved backdrop overlay rule missing", "restore the empty .study-page-bg::after overlay rule");
} else {
  if (!/background-image:\s*none;/.test(overlayBackdrop) || !/opacity:\s*0;/.test(overlayBackdrop)) {
    fail("backdrop overlay glow reintroduced", "keep .study-page-bg::after visually empty so the supplied background color stays exact");
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
    { name: "145° diagonal pigment", re: /linear-gradient\(\s*145deg/, expected: "linear-gradient(145deg, …)" },
    { name: "cerulean hairline border", re: /rgba\(196,\s*232,\s*242,\s*0\.22\)/, expected: "border: 1px solid rgba(196, 232, 242, 0.22)" },
    { name: "restrained inset highlight", re: /inset\s+0\s+1px\s+0\s+rgba\(255,\s*255,\s*255,\s*0\.03\)/, expected: "inset 0 1px 0 rgba(255, 255, 255, 0.03)" },
    { name: "neutral depth shadow", re: /0\s+22px\s+52px\s+-40px\s+rgba\(0,\s*0,\s*0,\s*0\.80\)/, expected: "0 22px 52px -40px rgba(0, 0, 0, 0.80)" },
  ];
  for (const r of RECIPE) {
    if (!r.re.test(cardRecipe)) {
      fail(`.bg-card recipe: ${r.name} changed or removed`, `restore \`${r.expected}\``);
    }
  }
  // Pigment-only glass: no cyan top-bloom, inset glow, or outer corona layered
  // back onto the canonical card. This is the recurring drift direction — the
  // opposite of the checks above, which is why it's a ban, not a requirement.
  const bannedGlow = [
    { name: "cyan top-bloom", re: /radial-gradient\([^)]*rgba\(118,\s*228,\s*247/ },
    { name: "cyan inset/outer glow in box-shadow", re: /rgba\(118,\s*228,\s*247,\s*0\.\d+\)/ },
  ];
  for (const g of bannedGlow) {
    if (g.re.test(cardRecipe)) {
      fail(`.bg-card recipe: ${g.name} re-introduced`, "cards are pigment-only glass — remove the cyan bloom/glow layer, keep the neutral dark depth shadow");
    }
  }
}

// Landing, authenticated app, and EPPP must use one card recipe. These checks
// intentionally span the page-local CSS sources so none of the three surfaces
// can quietly become brighter, blurrier, rounder, or a different hue.
const EPPP_CARD_CONTRACT = [
  { name: "145° pigment gradient", re: /linear-gradient\(145deg,\s*hsl\(var\(--surf-hue\)\s+88%\s+19%\s+\/\s+0\.74\),\s*hsl\(var\(--surf-hue\)\s+88%\s+14%\s+\/\s+0\.85\)\)/ },
  { name: "cerulean hairline", re: /rgba\(196,\s*232,\s*242,\s*0\.22\)/ },
  { name: "glass blur", re: /blur\(20px\) saturate\(135%\)/ },
  { name: "restrained inset highlight", re: /inset\s+0\s+1px\s+0\s+rgba\(255,\s*255,\s*255,\s*0\.03\)/ },
  { name: "neutral depth shadow", re: /0\s+22px\s+52px\s+-40px\s+rgba\(0,\s*0,\s*0,\s*0\.80\)/ },
];

for (const item of EPPP_CARD_CONTRACT) {
  if (!item.re.test(epppDashboardSource)) {
    fail(`EPPP card ${item.name} drifted`, "restore the canonical card recipe shared with .study-page-bg .bg-card");
  }
}

const LANDING_SYSTEM_CONTRACT = [
  { name: "tokenized cerulean surfaces", re: /hsl\(var\(--surf-hue\)\s+88%\s+1[49]%\s+\/\s+0\.(8|9)/ },
  { name: "glass blur", re: /backdrop-filter:\s*blur\(\d+px\)\s+saturate\(1[34]0%\)/ },
  { name: "cerulean hairlines", re: /\$\{C\.hairline(?:Strong)?\}/ },
  { name: "cerulean glow accents", re: /\$\{C\.cyan\}/ },
];
for (const item of LANDING_SYSTEM_CONTRACT) {
  if (!item.re.test(landingSource)) {
    fail(`landing ${item.name} drifted`, "keep landing surfaces on the locked cerulean glass system");
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
