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
//   2. The pigment cerulean glass card — the main-site `.bg-card` rule: a 145°
//      diagonal max-saturation cerulean gradient, a fixed 20px (NON-pill) corner,
//      blur(5px) saturate(140%) glass, and a crisp cerulean hairline. Depth comes
//      from PIGMENT (saturation + contrast), NOT cyan glow — the owner explicitly
//      rejected the bloom/corona look, so there is intentionally no cyan inner
//      glow or outer corona here. Guards against drift toward rounder, softer,
//      pill-like controls and against the glow creeping back.
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

// --- 2) Canonical luminous glass card (.bg-card == EPPP .epd-card) ----------
const cardRecipe = ruleBlock(css, ".study-page-bg .bg-card");
if (!cardRecipe) {
  fail(
    "canonical .bg-card glass recipe block not found",
    "the `.study-page-bg .bg-card` rule was removed — restore the EPPP .epd-card recipe",
  );
} else {
  const RECIPE = [
    { name: "non-pill 20px corner", re: /border-radius:\s*20px;/, expected: "border-radius: 20px;" },
    { name: "glass blur", re: /backdrop-filter:\s*blur\(5px\)\s*saturate\(140%\)/, expected: "backdrop-filter: blur(5px) saturate(140%)" },
    { name: "145° diagonal gradient", re: /linear-gradient\(\s*145deg/, expected: "linear-gradient(145deg, …)" },
    { name: "max-saturation pigment fill", re: /hsl\(var\(--surf-hue\)\s*100%\s*18%/, expected: "hsl(var(--surf-hue) 100% 18% / 0.96)" },
    { name: "no cyan glow/corona (pigment, not glow)", re: /rgba\(118,\s*228,\s*247/, expected: "remove any cyan inner glow / outer corona from .bg-card — depth is pigment, not glow", forbidden: true },
    { name: "cerulean hairline border", re: /rgba\(196,\s*232,\s*242,\s*0\.22\)/, expected: "border: 1px solid rgba(196, 232, 242, 0.22)" },
  ];
  for (const r of RECIPE) {
    const present = r.re.test(cardRecipe);
    // `forbidden` entries must be ABSENT (e.g. the rejected cyan glow); all
    // others must be PRESENT.
    if (r.forbidden ? present : !present) {
      fail(
        `.bg-card recipe: ${r.name} ${r.forbidden ? "crept back in" : "changed or removed"}`,
        r.forbidden ? r.expected : `restore \`${r.expected}\``,
      );
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

// --- 4) No cyan card-bloom on main-site pages ------------------------------
// The owner rejected cyan glow on content cards/panels (pigment, not glow).
// The card top-bloom signature `radial-gradient(125% 80% at 50% 0%, rgba(118,
// 228, 247 …)` is unambiguously that glow (legit accents — borders, icon discs,
// chart strokes, heading text-shadows — never use this exact signature), so ban
// it from the main-site sidebar pages. EPPP pages are the untouched template.
const BLOOM = /radial-gradient\(\s*125%\s*80%\s*at\s*50%\s*0%,\s*rgba\(118,\s*228,\s*247/;
const PAGES = [
  "pages/dashboard.tsx",
  "pages/progress.tsx",
  "pages/reflections.tsx",
  "pages/topics.tsx",
  "pages/brain-lab.tsx",
];
for (const rel of PAGES) {
  const fp = path.join(ROOT, "src", rel);
  if (!fs.existsSync(fp)) continue;
  const src = fs.readFileSync(fp, "utf8");
  if (BLOOM.test(src)) {
    fail(
      `cyan card-bloom glow crept back into src/${rel}`,
      "remove the `radial-gradient(125% 80% at 50% 0%, rgba(118,228,247 …)` card top-bloom — content cards use pigment, not glow",
    );
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
console.log("✓ Design system lock passed — glass-card recipe, radius/hue tokens, and cerulean accent are intact.");
