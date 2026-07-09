#!/usr/bin/env node
// =============================================================================
// DESIGN SYSTEM LOCK  (black-foundation baseline, 2026-07-09)
//
// Companion to check-surface-hue.mjs. The palette guardrail pins COLOR; this
// one pins STRUCTURE. The app was stripped to a black foundation:
//
//   1. Pure-black page floors (body + .study-page-bg::before), no wallpaper,
//      no filters, no vignette, no blend modes — the ONLY page artwork is the
//      landing page's glass-brain image, unstretched (contain) on #000.
//   2. A global reset that bans backdrop-filter (frosted glass) and
//      text-shadow (text glow) app-wide.
//   3. No gradients in index.css — surfaces are flat fills.
//   4. Shared component contract — pages consume the shared Button/Card
//      primitives instead of redefining them.
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

// --- 1) Global structural tokens (scoped to :root) -------------------------
const rootBlock = ruleBlock(css, ":root");
const TOKENS = [
  { name: "global corner radius", re: /--radius:\s*\.625rem;/, expected: "--radius: .625rem;" },
  { name: "neutral surface hue base", re: /--surf-hue:\s*0;/, expected: "--surf-hue: 0;  (neutral — saturation is 0% everywhere it is consumed)" },
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
  fail("landing glass-brain backdrop missing", "restore the .landing-root.study-page-bg::before rule with the owner's landing-glass-brain.jpeg artwork");
} else {
  if (!/background-image:\s*url\(["']?\.\/assets\/bg\/landing-glass-brain\.jpeg["']?\);/.test(landingBackdrop)) {
    fail("landing backdrop asset drifted", "the landing background must be the owner's landing-glass-brain.jpeg artwork");
  }
  if (!/background-size:\s*contain;/.test(landingBackdrop)) {
    fail("landing backdrop stretch reintroduced", "owner: do NOT stretch the landing artwork — keep background-size: contain");
  }
  if (!/background-color:\s*#000;/.test(landingBackdrop)) {
    fail("landing backdrop floor drifted", "keep the landing letterbox floor pure black (#000) to match the artwork's edges");
  }
  if (/\bfilter\s*:|radial-gradient\(|linear-gradient\(|background-blend-mode\s*:/.test(landingBackdrop)) {
    fail("landing backdrop film reintroduced", "keep the landing artwork free of filters, blend modes, and vignette gradients");
  }
}
if (!overlayBackdrop) {
  fail("reserved backdrop overlay rule missing", "restore the empty .study-page-bg::after overlay rule");
} else {
  if (!/background-image:\s*none;/.test(overlayBackdrop) || !/opacity:\s*0;/.test(overlayBackdrop)) {
    fail("backdrop overlay glow reintroduced", "keep .study-page-bg::after visually empty so the black floor stays exact");
  }
}

// --- 3) Global glass/glow kill-switch ---------------------------------------
// The BLACK FOUNDATION RESET block must stay at the end of index.css: it bans
// backdrop-filter (frosted glass) and text-shadow (text glow) app-wide.
if (!/backdrop-filter:\s*none\s*!important;[\s\S]*?text-shadow:\s*none\s*!important;/.test(css)) {
  fail(
    "black-foundation reset block missing",
    "restore the global `backdrop-filter: none !important; text-shadow: none !important;` reset in index.css",
  );
}

// --- 4) No gradients / wallpapers in index.css -------------------------------
// Surfaces are flat fills. The only url() allowed in index.css is the landing
// glass-brain artwork (and the Google Fonts @import).
let m;
const grad = /(?:linear|radial|conic)-gradient\(/g;
while ((m = grad.exec(css))) {
  fail(
    `gradient at ${REL}:${lineOf(m.index)}`,
    "surfaces are flat — use a solid fill (gradients were removed in the black-foundation reset)",
  );
}
const urls = /url\(\s*["']?([^"')]+)["']?\s*\)/g;
while ((m = urls.exec(css))) {
  const target = m[1];
  if (target.includes("fonts.googleapis.com")) continue;
  if (target === "./assets/bg/landing-glass-brain.jpeg") continue;
  fail(
    `unexpected image url(${target}) at ${REL}:${lineOf(m.index)}`,
    "the landing glass-brain artwork is the ONLY image allowed in index.css",
  );
}

// --- 4b) No decorative gradients in TS/TSX inline styles ---------------------
// Page components must not smuggle gradient fills past the index.css ban.
// Allowed: mask-image edge fades (functional, not decorative) and the
// dev-only glass preview page.
const SRC = path.join(ROOT, "src");
function walkSrc(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkSrc(p, acc);
    else if (/\.(tsx?|)$/.test(e.name) && /\.tsx?$/.test(e.name)) acc.push(p);
  }
  return acc;
}
for (const file of walkSrc(SRC, [])) {
  const rel = path.relative(ROOT, file);
  if (rel.includes("dev-glass-preview")) continue;
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split("\n");
  const gradRe = /(?:linear|radial|conic)-gradient\(/;
  for (let i = 0; i < lines.length; i++) {
    if (!gradRe.test(lines[i])) continue;
    // Functional mask fades: the gradient feeds a mask-image, not a fill.
    const context = lines.slice(Math.max(0, i - 3), i + 2).join("\n");
    if (/mask(?:-image)?|maskImage|WebkitMask/i.test(context)) continue;
    // Comments mentioning gradients are fine.
    if (/^\s*(\/\/|\*|\/\*)/.test(lines[i])) continue;
    fail(
      `decorative gradient in ${rel}:${i + 1}`,
      "surfaces are flat solid fills — gradients are only allowed as functional mask-image fades",
    );
  }
}

// --- 5) Banned legacy accents ------------------------------------------------
// The retired cerulean/mint accents must never come back.
const LEGACY = /#(5eead4|2dd4bf|14b8a6|76e4f7|67e8f9|22d3ee|06b6d4)\b/gi;
while ((m = LEGACY.exec(css))) {
  fail(
    `legacy accent ${m[0]} at ${REL}:${lineOf(m.index)}`,
    "the cerulean/mint accent system was retired — use neutral grays",
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

// --- 7) Shared component contract -----------------------------------------
// Page-level edits should consume these primitives, not quietly redefine them.
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

// --- Report ----------------------------------------------------------------
if (violations.length) {
  console.error(`\n✗ Design system lock FAILED — ${violations.length} drift(s) from the locked black foundation:\n`);
  for (const v of violations) console.error(`  • ${v.what}\n      → ${v.fix}`);
  console.error(`\nThese values are pinned in scripts/check-design-drift.mjs.`);
  console.error(`If the change is intentional, update the matching lock entry in the same commit.\n`);
  process.exit(1);
}
console.log("✓ Design system lock passed — black foundation, typography, and shared component contracts are intact.");
