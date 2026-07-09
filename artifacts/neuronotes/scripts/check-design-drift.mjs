#!/usr/bin/env node
// =============================================================================
// DESIGN SYSTEM LOCK  (blue three-material system, locked 2026-07-09)
//
// Companion to check-surface-hue.mjs. The palette guardrail pins COLOR; this
// one pins STRUCTURE. The app runs on the owner-approved three-material system:
//
//   OPAQUE — structural panels: solid navy-tint gradient, lit top bevel,
//            neutral black shadow. Never glows.
//   GLASS  — nested tiles: tinted transparency (NO backdrop-filter/blur),
//            brighter bevel; interactive glass glows + lifts on hover only.
//   GLOSS  — buttons: saturated cyan gradient + glossy highlight; hover corona.
//
// Structural invariants enforced here:
//   1. Pure-black page floors (body + .study-page-bg::before), no wallpaper,
//      no filters, no vignette — the ONLY page artwork is the landing page's
//      hero brain <img> at the top of the hero.
//   2. A global reset that bans backdrop-filter (frosted glass) app-wide —
//      GLASS is tinted transparency, never blur.
//   3. Glow discipline: the glow tokens (--pp-glow*) may only be consumed
//      inside :hover / :active / :focus-visible states (or @keyframes).
//   4. The --pp-* palette tokens and material classes exist in index.css.
//   5. Shared component contract — pages consume the shared Button/Card
//      primitives instead of redefining them.
//   6. Typography: Montserrat body, Outfit display, Merriweather editorial.
//
// When you INTENTIONALLY change the design system, update the matching lock
// entry here in the SAME commit. An accidental drift fails this check loudly.
//
// Run: node scripts/check-design-drift.mjs   (exit 1 on any violation)
// =============================================================================
import fs from "fs";
import path from "path";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const CSS = path.join(ROOT, "src", "index.css");
const BUTTON = path.join(ROOT, "src", "components", "ui", "button.tsx");
const CARD = path.join(ROOT, "src", "components", "ui", "card.tsx");
const REL = path.relative(ROOT, CSS);

const raw = fs.readFileSync(CSS, "utf8");
const buttonSource = fs.readFileSync(BUTTON, "utf8");
const cardSource = fs.readFileSync(CARD, "utf8");
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

// --- 1) Global structural + palette tokens (scoped to :root) ---------------
const rootBlock = ruleBlock(css, ":root");
const TOKENS = [
  { name: "global corner radius", re: /--radius:\s*\.625rem;/, expected: "--radius: .625rem;" },
  { name: "surface hue knob", re: /--surf-hue:\s*211;/, expected: "--surf-hue: 211;  (locked blue surface hue)" },
  { name: "surface saturation knob", re: /--surf-sat:\s*62%;/, expected: "--surf-sat: 62%;" },
  // The locked --pp-* palette primitives.
  { name: "pp floor token", re: /--pp-floor:\s*#000000;/, expected: "--pp-floor: #000000;" },
  { name: "pp deep surface token", re: /--pp-deep:\s*#04101f;/, expected: "--pp-deep: #04101f;" },
  { name: "pp surface token", re: /--pp-surface:\s*#071c33;/, expected: "--pp-surface: #071c33;" },
  { name: "pp navy token", re: /--pp-navy:\s*#052a58;/, expected: "--pp-navy: #052a58;" },
  { name: "pp navy-bright token", re: /--pp-navy-bright:\s*#0e4e71;/, expected: "--pp-navy-bright: #0e4e71;" },
  { name: "pp ocean token", re: /--pp-ocean:\s*#0b669a;/, expected: "--pp-ocean: #0b669a;" },
  { name: "pp ocean-deep token", re: /--pp-ocean-deep:\s*#0d58a2;/, expected: "--pp-ocean-deep: #0d58a2;" },
  { name: "pp cyan token", re: /--pp-cyan:\s*#08a5d1;/, expected: "--pp-cyan: #08a5d1;" },
  { name: "pp bright token", re: /--pp-bright:\s*#0bd4df;/, expected: "--pp-bright: #0bd4df;" },
  { name: "pp icy token", re: /--pp-icy:\s*#aaedf0;/, expected: "--pp-icy: #aaedf0;" },
  { name: "pp text token", re: /--pp-text:\s*#e5e5e5;/, expected: "--pp-text: #e5e5e5;" },
  { name: "pp text-dim token", re: /--pp-text-dim:\s*#a3a3a3;/, expected: "--pp-text-dim: #a3a3a3;" },
];
if (!rootBlock) {
  fail(":root block not found in index.css", "restore the :root design-token block");
} else {
  for (const t of TOKENS) {
    if (!t.re.test(rootBlock)) {
      fail(`${t.name} drifted or missing`, `restore \`${t.expected}\` in the index.css :root block`);
    }
  }
}

// --- 1b) Material classes exist ---------------------------------------------
for (const mat of [".mat-opaque", ".mat-glass", ".mat-glass-interactive", ".mat-chip"]) {
  if (!new RegExp(`\\${mat}\\s*[{,]`).test(css)) {
    fail(`${mat} material class missing`, `restore the ${mat} material recipe in index.css`);
  }
}
// The OPAQUE material never glows: it must not define a :hover state.
if (/\.mat-opaque:hover/.test(css)) {
  fail(".mat-opaque:hover introduced", "OPAQUE structural panels never glow or react — remove the hover state");
}

// --- 2) Pure-black page floors ----------------------------------------------
const bodyBlock = ruleBlock(css, "\nbody {");
if (!bodyBlock || !/background-color:\s*#000000;/.test(bodyBlock)) {
  fail("body floor drifted", "keep `background-color: #000000;` on body (prevents white route-transition flashes)");
}

const appBackdrop = ruleBlock(css, ".study-page-bg::before");
const landingBackdrop = ruleBlock(css, ".landing-root.study-page-bg::before");
const overlayBackdrop = ruleBlock(css, ".study-page-bg::after");
if (!appBackdrop) {
  fail("canonical app backdrop rule missing", "restore the .study-page-bg::before backdrop rule");
} else {
  if (!/background-image:\s*none;/.test(appBackdrop) || /url\(/.test(appBackdrop)) {
    fail("canonical backdrop drifted", "the app backdrop is pure black — keep background-image: none (no wallpaper)");
  }
  if (!/background-color:\s*#000000;/.test(appBackdrop)) {
    fail("canonical backdrop floor color drifted", "keep the pure-black floor #000000 (must match the body floor)");
  }
  if (/\bfilter\s*:|radial-gradient\(|linear-gradient\(|background-blend-mode\s*:/.test(appBackdrop)) {
    fail("canonical backdrop film reintroduced", "keep the backdrop free of filters, blend modes, and vignette gradients");
  }
}
if (!landingBackdrop) {
  fail("landing backdrop rule missing", "restore the .landing-root.study-page-bg::before rule (pure-black floor, no wallpaper)");
} else {
  if (!/background-image:\s*none;/.test(landingBackdrop) || /url\(/.test(landingBackdrop)) {
    fail("landing backdrop wallpaper reintroduced", "the landing floor is pure black — the hero brain is an inline <img> in landing.tsx, NOT a page background");
  }
  if (!/background-color:\s*#000;/.test(landingBackdrop)) {
    fail("landing backdrop floor drifted", "keep the landing floor pure black (#000) to match the hero artwork's edges");
  }
  if (/\bfilter\s*:|radial-gradient\(|linear-gradient\(|background-blend-mode\s*:/.test(landingBackdrop)) {
    fail("landing backdrop film reintroduced", "keep the landing floor free of filters, blend modes, and vignette gradients");
  }
}
// Owner artwork lock (2026-07-09): the hero brain image sits at the very top
// of the landing page with the text stack beginning right below it.
const LANDING = path.join(ROOT, "src", "pages", "landing.tsx");
const landingSource = fs.readFileSync(LANDING, "utf8");
if (!/landing-hero-brain\.jpeg/.test(landingSource) || !/className="landing-hero-brain"/.test(landingSource)) {
  fail(
    "landing hero brain artwork missing",
    "keep the owner's hero brain <img> (assets/bg/landing-hero-brain.jpeg, .landing-hero-brain) at the top of the landing hero",
  );
}
{
  const heroImgIdx = landingSource.indexOf('className="landing-hero-brain"');
  const wordmarkIdx = landingSource.indexOf('className="landing-wordmark"');
  if (heroImgIdx !== -1 && wordmarkIdx !== -1 && heroImgIdx > wordmarkIdx) {
    fail(
      "landing hero brain not at the top",
      "owner: the hero brain image comes FIRST, with the wordmark/text beginning right below it",
    );
  }
}
if (!overlayBackdrop) {
  fail("reserved backdrop overlay rule missing", "restore the empty .study-page-bg::after overlay rule");
} else {
  if (!/background-image:\s*none;/.test(overlayBackdrop) || !/opacity:\s*0;/.test(overlayBackdrop)) {
    fail("backdrop overlay glow reintroduced", "keep .study-page-bg::after visually empty so the black floor stays exact");
  }
}

// --- 3) Backdrop-filter ban (GLASS = tinted transparency, never blur) --------
if (!/backdrop-filter:\s*none\s*!important;/.test(css)) {
  fail(
    "material discipline reset missing",
    "restore the global `backdrop-filter: none !important;` reset at the end of index.css",
  );
}
// No rule may set a real backdrop-filter value anywhere in index.css.
{
  const bf = /backdrop-filter:(?!\s*none\b)[^;]+;/g;
  let m2;
  while ((m2 = bf.exec(css))) {
    fail(
      `backdrop-filter value at ${REL}:${lineOf(m2.index)}`,
      "GLASS is tinted transparency — backdrop-filter/blur is banned app-wide",
    );
  }
}

// --- 3b) Glow discipline: glow only on hover/active/focus --------------------
// Walk top-level rules; any rule body consuming the glow tokens must belong to
// an interactive-state selector (or a keyframes animation, which is opt-in).
{
  // Collect top-level "selector { body }" spans (depth-1 blocks).
  const spans = [];
  let depth = 0, selStart = 0, bodyStart = -1, sel = "";
  for (let i = 0; i < css.length; i++) {
    const c = css[i];
    if (c === "{") {
      depth++;
      if (depth === 1) { sel = css.slice(selStart, i).trim(); bodyStart = i + 1; }
    } else if (c === "}") {
      depth--;
      if (depth === 0) { spans.push({ sel, body: css.slice(bodyStart, i), at: bodyStart }); selStart = i + 1; }
    }
  }
  const GLOW = /var\(--pp-glow(?:-strong)?\)|rgba\(\s*11\s*,\s*212\s*,\s*223/;
  for (const s of spans) {
    if (!GLOW.test(s.body)) continue;
    if (/@keyframes/.test(s.sel)) continue;
    if (/:hover|:active|:focus/.test(s.sel)) continue;
    // Token DEFINITIONS (:root / .dark) are the source of the glow values —
    // consuming them at rest elsewhere is what's banned.
    if (/^(:root|\.dark)$/.test(s.sel)) continue;
    // Nested blocks (e.g. @layer utilities) — check inner selectors instead.
    if (s.body.includes("{")) {
      const inner = s.body;
      const innerRe = /([^{}]+)\{([^{}]*)\}/g;
      let im;
      while ((im = innerRe.exec(inner))) {
        if (GLOW.test(im[2]) && !/:hover|:active|:focus/.test(im[1]) && !/@keyframes/.test(im[1])) {
          fail(
            `resting glow in nested rule \`${im[1].trim().slice(0, 60)}\``,
            "glow is hover/active/focus ONLY — at-rest depth comes from pigment (gradients, bevels, black shadows)",
          );
        }
      }
      continue;
    }
    fail(
      `resting glow in rule \`${s.sel.slice(0, 60)}\` at ${REL}:${lineOf(s.at)}`,
      "glow is hover/active/focus ONLY — at-rest depth comes from pigment (gradients, bevels, black shadows)",
    );
  }
}

// --- 4) No wallpaper images in index.css -------------------------------------
let m;
const urls = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
while ((m = urls.exec(css))) {
  const target = m[1];
  if (target.includes("fonts.googleapis.com")) continue;
  fail(
    `unexpected image url(${target}) at ${REL}:${lineOf(m.index)}`,
    "no images in index.css — the hero brain lives as an inline <img> in landing.tsx",
  );
}

// --- 5) Banned legacy accents ------------------------------------------------
// The retired mint/cerulean accent hexes must never come back (the new palette
// uses ONLY the --pp-* values; these legacy accents sit just outside it).
const LEGACY = /#(5eead4|2dd4bf|14b8a6|76e4f7|67e8f9|22d3ee|06b6d4)\b/gi;
while ((m = LEGACY.exec(css))) {
  fail(
    `legacy accent ${m[0]} at ${REL}:${lineOf(m.index)}`,
    "the mint/cerulean accents are retired — use the --pp-* blue palette tokens",
  );
}

// --- 6) Typography contract ------------------------------------------------
const TYPE_CONTRACT = [
  {
    name: "Montserrat webfont load",
    re: /family=Montserrat:wght@300;400;500;600;700/,
    expected: "load Montserrat weights 300–700 in the Google Fonts import",
  },
  {
    name: "Outfit webfont load",
    re: /family=Outfit:wght@300;400;500;600;700/,
    expected: "load Outfit weights 300–700 in the Google Fonts import (display/headings face)",
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
    name: "display font token",
    re: /--app-font-display:\s*'Outfit',\s*'Inter',\s*system-ui,\s*sans-serif;/,
    expected: "restore --app-font-display to Outfit with the documented fallbacks",
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

// --- 7) Shared component contract -----------------------------------------
// Page-level edits should consume these primitives, not quietly redefine them.
// (Class NAMES are legacy "glass" names; the recipes are the material system:
// btn-glass-strong = GLOSS primary, btn-glass = GLASS secondary.)
const BUTTON_VARIANTS = [
  ["default", "btn-glass-strong"],
  ["destructive", "btn-glass-destructive"],
  ["outline", "btn-glass"],
  ["secondary", "btn-glass"],
  ["ghost", "btn-glass-ghost"],
  ["link", "btn-link-glow"],
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

// Parallel utilities are how page-level tweaks previously escaped the shared
// recipes. Comments are intentionally ignored by scanning `css`.
for (const banned of ["glass-button", "cta-glass"]) {
  if (new RegExp(`\\.${banned}\\s*\\{`).test(css)) {
    fail(`competing .${banned} utility introduced`, "use the shared btn-glass variants instead");
  }
}

// --- 8) No backdrop-blur Tailwind utilities in TSX ---------------------------
const SRC = path.join(ROOT, "src");
function walkSrc(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkSrc(p, acc);
    else if (/\.tsx?$/.test(e.name)) acc.push(p);
  }
  return acc;
}
for (const file of walkSrc(SRC, [])) {
  const rel = path.relative(ROOT, file);
  if (rel.includes("dev-glass-preview")) continue;
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(\/\/|\*|\/\*)/.test(lines[i])) continue;
    if (/\bbackdrop-blur(?:-(?:\w+|\[[^\]]+\]))?\b|(?:Webkit)?[bB]ackdropFilter\s*:\s*["'`](?!none)/.test(lines[i])) {
      fail(
        `backdrop blur in ${rel}:${i + 1}`,
        "GLASS is tinted transparency — backdrop-filter/blur is banned app-wide",
      );
    }
  }
}

// --- Report ----------------------------------------------------------------
if (violations.length) {
  console.error(`\n✗ Design system lock FAILED — ${violations.length} drift(s) from the locked blue three-material system:\n`);
  for (const v of violations) console.error(`  • ${v.what}\n      → ${v.fix}`);
  console.error(`\nThese values are pinned in scripts/check-design-drift.mjs.`);
  console.error(`If the change is intentional, update the matching lock entry in the same commit.\n`);
  process.exit(1);
}
console.log("✓ Design system lock passed — blue three-material system, typography, and shared component contracts are intact.");
