#!/usr/bin/env node
// =============================================================================
// DESIGN SYSTEM LOCK  (blue three-material system, locked 2026-07-09)
//
// Companion to check-surface-hue.mjs. The palette guardrail pins COLOR; this
// one pins STRUCTURE. The app runs on the owner-approved three-material system:
//
//   OPAQUE — structural panels: solid near-black gradient, lit top bevel,
//            neutral black shadow. Never glows.
//   GLASS  — nested tiles: tinted transparency (NO backdrop-filter/blur),
//            brighter bevel; interactive glass glows + lifts on hover only.
//   GLOSS  — buttons: light-gray gradient + glossy highlight; hover corona.
//   (Grayscale foundation 2026-07-10 — the landing page alone keeps blue.)
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
  { name: "surface hue knob", re: /--surf-hue:\s*0;/, expected: "--surf-hue: 0;  (locked neutral surface hue — landing overrides to 211 in its scoped block)" },
  { name: "surface saturation knob", re: /--surf-sat:\s*0%;/, expected: "--surf-sat: 0%;" },
  // The locked --pp-* palette primitives.
  { name: "pp floor token", re: /--pp-floor:\s*#000000;/, expected: "--pp-floor: #000000;" },
  { name: "pp deep surface token", re: /--pp-deep:\s*#0a0a0a;/, expected: "--pp-deep: #0a0a0a;" },
  { name: "pp surface token", re: /--pp-surface:\s*#141414;/, expected: "--pp-surface: #141414;" },
  { name: "pp navy token", re: /--pp-navy:\s*#181818;/, expected: "--pp-navy: #181818;" },
  { name: "pp navy-bright token", re: /--pp-navy-bright:\s*#2e2e2e;/, expected: "--pp-navy-bright: #2e2e2e;" },
  { name: "pp ocean token", re: /--pp-ocean:\s*#3c3c3c;/, expected: "--pp-ocean: #3c3c3c;" },
  { name: "pp ocean-deep token", re: /--pp-ocean-deep:\s*#4a4a4a;/, expected: "--pp-ocean-deep: #4a4a4a;" },
  { name: "pp cyan token", re: /--pp-cyan:\s*#d6d6d6;/, expected: "--pp-cyan: #d6d6d6;" },
  { name: "pp bright token", re: /--pp-bright:\s*#f0f0f0;/, expected: "--pp-bright: #f0f0f0;" },
  { name: "pp icy token", re: /--pp-icy:\s*#fafafa;/, expected: "--pp-icy: #fafafa;" },
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
  const GLOW = /var\(--pp-glow(?:-strong)?\)|rgba\(\s*240\s*,\s*240\s*,\s*240/;
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

// --- 8b) MATERIAL DISCIPLINE: no hand-rolled material recipes in TSX ---------
// Tiles/cards/buttons must COMPOSE the shared material classes from index.css
// (.mat-opaque / .mat-glass / .mat-icon-well / .pp-btn-* / .eppp-launch-btn).
// Re-declaring the material values inline or in page <style> blocks is banned.
const MATERIAL_SIGNATURES = [
  {
    re: /linear-gradient\(\s*180deg\s*,\s*var\(--pp-surface\)/,
    name: "OPAQUE gradient (var(--pp-surface) → var(--pp-deep))",
    fix: "compose .mat-opaque instead of re-declaring the opaque material",
  },
  {
    re: /inset 0 1px 0 var\(--pp-bevel\)\s*,\s*0 22px 48px -32px var\(--pp-shadow\)/,
    name: "OPAQUE shadow stack (bevel + 22/48 drop)",
    fix: "compose .mat-opaque instead of re-declaring the opaque material",
  },
  {
    re: /rgba\(var\(--pp-ocean-deep-rgb\),\s*0\.16\)/,
    name: "GLASS base fill (ocean-deep 0.16)",
    fix: "compose .mat-glass / .mat-glass-interactive instead of re-declaring the glass material (state modifiers use elevated steps, not the base fill)",
  },
  {
    re: /border:\s*["'`]?1px solid rgba\(var\(--pp-cyan-rgb\),\s*0\.35\)/,
    name: "ICON-WELL border (cyan 0.35)",
    fix: "compose .mat-icon-well (+ --round) instead of re-declaring the icon-well material",
  },
];
// sonner.tsx styles third-party toast internals through sonner's classNames
// API, which needs !important arbitrary values — it cannot compose the
// shared classes, so its glass-tinted action button is tolerated.
const MATERIAL_WHITELIST = [path.join("src", "components", "ui", "sonner.tsx")];
for (const file of walkSrc(SRC, [])) {
  const rel = path.relative(ROOT, file);
  if (rel.includes("dev-glass-preview")) continue;
  if (rel === path.join("src", "index.css")) continue;
  if (MATERIAL_WHITELIST.some((w) => rel === w)) continue;
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    if (/^\s*(\/\/|\*|\/\*)/.test(lines[i])) continue;
    for (const sig of MATERIAL_SIGNATURES) {
      if (sig.re.test(lines[i])) {
        fail(`hand-rolled material in ${rel}:${i + 1} — ${sig.name}`, sig.fix);
      }
    }
  }
}

// --- 9) TOKEN DISCIPLINE: no raw color literals in TS/TSX --------------------
// Every color in application code must come from the CSS tokens
// (var(--pp-*), rgba(var(--pp-*-rgb), a)) or from src/lib/palette.ts
// (PP.* / alpha()). Raw literals live ONLY in the whitelisted files.
const LITERAL_WHITELIST = [
  path.join("src", "lib", "palette.ts"),          // the single TS literal source
  path.join("src", "data", "brain-structures.ts"), // anatomy atlas colors (own system)
  path.join("src", "pages", "dev-glass-preview.tsx"), // dev-only material specimen
];
const HEX_RE = /#[0-9a-fA-F]{3,8}\b/;
const RGB_RE = /\brgba?\(\s*\d/;
const HSL_NUM_RE = /\bhsla?\(\s*\d/;
for (const file of walkSrc(SRC, [])) {
  const rel = path.relative(ROOT, file);
  if (LITERAL_WHITELIST.some((w) => rel === w)) continue;
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(\/\/|\*|\/\*)/.test(line)) continue;
    if (HEX_RE.test(line) || RGB_RE.test(line) || HSL_NUM_RE.test(line)) {
      fail(
        `raw color literal in ${rel}:${i + 1} \`${line.trim().slice(0, 80)}\``,
        "consume tokens instead: var(--pp-*) / rgba(var(--pp-*-rgb), a) in styles, PP/alpha() from @/lib/palette in SVG/JS",
      );
    }
  }
}

// --- 10) TOKEN DISCIPLINE: index.css literals only in the token blocks -------
// Outside :root/.dark, index.css must consume tokens. The only raw literals
// tolerated outside the token blocks are neutrals (black/white/gray) and
// semantic status colors (red/amber/green) — palette blues MUST be tokens.
{
  const blankBlock = (source, needle) => {
    const sel = source.indexOf(needle);
    if (sel === -1) return source;
    const open = source.indexOf("{", sel);
    let depth = 0;
    for (let i = open; i < source.length; i++) {
      if (source[i] === "{") depth++;
      else if (source[i] === "}") {
        depth--;
        if (depth === 0) {
          return source.slice(0, open) + source.slice(open, i + 1).replace(/[^\n]/g, " ") + source.slice(i + 1);
        }
      }
    }
    return source;
  };
  let outside = blankBlock(css, ":root");
  outside = blankBlock(outside, "\n.dark {");
  const toRgb = (str) => {
    const hex = str.match(/^#([0-9a-fA-F]{3,8})$/)?.[1];
    if (hex) {
      const h = hex.length < 6 ? hex.split("").map((c) => c + c).join("").slice(0, 6) : hex.slice(0, 6);
      return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
    }
    const nums = str.match(/rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
    return nums ? [Number(nums[1]), Number(nums[2]), Number(nums[3])] : null;
  };
  const hueOf = ([r, g, b]) => {
    const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
    if (d === 0) return null; // neutral
    let h;
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    return ((h * 60) + 360) % 360;
  };
  const litRe = /#[0-9a-fA-F]{3,8}\b|rgba?\(\s*\d+\s*,\s*\d+\s*,\s*\d+[^)]*\)|hsla?\(\s*[\d.]+[^)]*\)/g;
  let lm;
  while ((lm = litRe.exec(outside))) {
    let hue, sat;
    const hslNums = lm[0].match(/^hsla?\(\s*([\d.]+)(?:deg)?[\s,]+([\d.]+)%/);
    if (hslNums) {
      hue = Number(hslNums[1]) % 360;
      sat = Number(hslNums[2]) * 2.55; // scale % to the 0-255 chroma range used below
      if (sat === 0) hue = null;
    } else {
      const rgb = toRgb(lm[0]);
      if (!rgb) continue;
      hue = hueOf(rgb);
      sat = Math.max(...rgb) - Math.min(...rgb);
    }
    const neutral = hue === null || sat <= 12;
    const semantic = hue !== null && ((hue <= 25 || hue >= 340) || (hue >= 26 && hue <= 65) || (hue >= 100 && hue <= 170));
    if (!neutral && !semantic) {
      fail(
        `raw palette literal ${lm[0]} outside the token blocks at ${REL}:${lineOf(lm.index)}`,
        "palette colors outside :root/.dark must be tokens: var(--pp-*) or rgba(var(--pp-*-rgb), a)",
      );
    }
  }
}

// --- 11) SELECTOR HYGIENE: scoped classes, not category rules ----------------
// Broad recipes are how one edit silently restyles unrelated surfaces:
//   - attribute wildcards ([class*=…]) once hijacked every bg-primary/NN chip;
//   - descendant bare-element rules (.study-page-bg button {…}) skinned every
//     button on every page. Materials are OPT-IN via named classes only.
{
  const wildcard = /\[class[*^|~]?=/g;
  let wm;
  while ((wm = wildcard.exec(css))) {
    fail(
      `attribute-wildcard selector at ${REL}:${lineOf(wm.index)}`,
      "never select by [class*=…] — add a named material class to the element instead",
    );
  }
  const descendant = /\.study-page-(?:bg|aurora)[^,{}\s]*[ >+~]+[^,{}\s][^,{}]*\{/g;
  let dm;
  while ((dm = descendant.exec(css))) {
    fail(
      `descendant recipe under a page scope at ${REL}:${lineOf(dm.index)} \`${dm[0].slice(0, 70)}\``,
      "materials are opt-in named classes (.pp-btn-*, .pp-card-opaque, .pp-input-well, .mat-*) — never .study-page-bg <element> category rules",
    );
  }
}

// --- 12) Scoped material classes exist + primitives emit them ---------------
for (const cls of [".pp-card-opaque", ".pp-input-well", ".pp-btn-gloss", ".pp-btn-glass", ".pp-btn-outline"]) {
  if (!new RegExp(`\\${cls}\\s*[{,:]`).test(css)) {
    fail(`${cls} scoped material class missing from index.css`, `restore the ${cls} recipe`);
  }
}
const PRIMITIVE_CLASSES = [
  ["card.tsx", "pp-card-opaque"],
  ["input.tsx", "pp-input-well"],
  ["textarea.tsx", "pp-input-well"],
  ["select.tsx", "pp-btn-outline"],
  ["toggle.tsx", "pp-btn-outline"],
];
for (const [fileName, cls] of PRIMITIVE_CLASSES) {
  const p = path.join(ROOT, "src", "components", "ui", fileName);
  if (!fs.readFileSync(p, "utf8").includes(cls)) {
    fail(`ui/${fileName} no longer emits .${cls}`, `keep the ${cls} class in the shared primitive so the material applies app-wide`);
  }
}

// --- 13) palette.ts stays in sync with the CSS tokens ------------------------
{
  const palettePath = path.join(ROOT, "src", "lib", "palette.ts");
  const paletteSrc = fs.readFileSync(palettePath, "utf8");
  const CORE = {
    floor: "--pp-floor", deep: "--pp-deep", surface: "--pp-surface",
    navy: "--pp-navy", navyBright: "--pp-navy-bright", ocean: "--pp-ocean",
    oceanDeep: "--pp-ocean-deep", cyan: "--pp-cyan", bright: "--pp-bright",
    icy: "--pp-icy", text: "--pp-text", textDim: "--pp-text-dim", ink: "--pp-ink",
  };
  for (const [key, cssVar] of Object.entries(CORE)) {
    const tsHex = paletteSrc.match(new RegExp(`\\b${key}:\\s*"(#[0-9a-fA-F]{6})"`))?.[1]?.toLowerCase();
    const cssHex = rootBlock?.match(new RegExp(`${cssVar}:\\s*(#[0-9a-fA-F]{6})\\s*;`))?.[1]?.toLowerCase();
    if (!tsHex) fail(`PP.${key} missing from src/lib/palette.ts`, "palette.ts must mirror every core --pp-* token");
    else if (cssHex && tsHex !== cssHex) {
      fail(`PP.${key} (${tsHex}) out of sync with ${cssVar} (${cssHex})`, "edit the index.css token AND palette.ts in the same commit");
    }
    // The rgb channel triplet must match the hex numerically.
    const rgbVar = `${cssVar}-rgb`;
    const trip = rootBlock?.match(new RegExp(`${rgbVar}:\\s*(\\d+),\\s*(\\d+),\\s*(\\d+)\\s*;`));
    if (trip && cssHex) {
      const want = [1, 3, 5].map((i) => parseInt(cssHex.slice(i, i + 2), 16));
      const got = [Number(trip[1]), Number(trip[2]), Number(trip[3])];
      if (want.join() !== got.join()) {
        fail(`${rgbVar} (${got.join(", ")}) does not match ${cssVar} ${cssHex}`, "keep the channel triplet numerically in sync with the hex token");
      }
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
console.log("✓ Design system lock passed — grayscale three-material system (landing blue exception), typography, and shared component contracts are intact.");
