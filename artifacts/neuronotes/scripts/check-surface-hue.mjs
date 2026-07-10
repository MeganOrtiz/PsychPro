#!/usr/bin/env node
// =============================================================================
// PALETTE GUARDRAIL  (blue three-material system, locked 2026-07-09)
//
// The app runs on the owner-approved BLUE system: pure-black page floors,
// navy-tint opaque panels, blue glass tiles, cyan gloss buttons, icy/gray text.
// Palette (the --pp-* tokens in src/index.css):
//   floor #000000 · surfaces #04101f/#071c33 · navy #052a58/#0e4e71
//   ocean #0b669a/#0d58a2 · cyan #08a5d1/#0bd4df · icy #aaedf0
//   grays #e5e5e5/#a3a3a3
//
// This check fails when a color OUTSIDE the system drifts into the UI. Allowed:
//   - Neutrals (saturation <= 25%).
//   - The blue family (hue 180-220) — retained ONLY for the landing page
//     (LANDING consts in palette.ts + .landing-root scope) and brain-structure
//     teaching colors; the logged-in app itself is black/white/gray.
//   - Semantic status colors: red/amber (hue 0-70) and green (hue 90-160)
//     for destructive/warning/success states.
//   - src/data/brain-structures.ts — functional anatomy colors used by the
//     Brain Lab 3D/2D viewers (educational content, not UI chrome).
//
// Everything else — mint/green-teal, indigo, violet, purple, magenta, pink,
// orange-as-accent — is a drift out of the locked system and fails loudly.
//
// Run: node scripts/check-surface-hue.mjs   (exit 1 on any violation)
// =============================================================================
import fs from "fs";
import path from "path";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "src");

const MAX_NEUTRAL_S = 0.25; // anything at/below this saturation is fine
// Allowed saturated hue windows.
const ALLOWED_HUES = [
  [0, 70],     // red … amber (destructive, warnings)
  [90, 160],   // green (success)
  [178, 220],  // BLUE FAMILY — landing page + brain-structures only (app is gray)
  [345, 360],  // wrap-around reds
];
// Files exempt from the palette ban.
const EXEMPT = [
  path.join("src", "data", "brain-structures.ts"),
];

function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b);
  let h = 0, s = 0; const l = (mx + mn) / 2; const d = mx - mn;
  if (d !== 0) {
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    switch (mx) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return [h, s, l];
}

const isAllowedHue = (h) => ALLOWED_HUES.some(([lo, hi]) => h >= lo && h <= hi);
const lineOf = (text, idx) => text.slice(0, idx).split("\n").length;

const violations = [];
function check(file, line, raw, h, s) {
  if (s <= MAX_NEUTRAL_S) return;
  if (isAllowedHue(h)) return;
  violations.push(
    `${file}:${line}  ${raw}  (hue ${h.toFixed(1)}, sat ${(s * 100).toFixed(0)}% — ` +
      `outside the locked blue/semantic palette).`,
  );
}

function scanText(file, text) {
  let m;
  // rgb()/rgba()
  const rgba = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g;
  while ((m = rgba.exec(text))) {
    const [h, s] = rgbToHsl(+m[1], +m[2], +m[3]);
    check(file, lineOf(text, m.index), m[0] + ")", h, s);
  }
  // #rgb, #rgba, #rrggbb, #rrggbbaa
  const hex = /#([0-9a-fA-F]{3,8})\b/g;
  while ((m = hex.exec(text))) {
    const x = m[1];
    let r, g, b;
    if (x.length === 3 || x.length === 4) {
      r = parseInt(x[0] + x[0], 16); g = parseInt(x[1] + x[1], 16); b = parseInt(x[2] + x[2], 16);
    } else if (x.length === 6 || x.length === 8) {
      r = parseInt(x.slice(0, 2), 16); g = parseInt(x.slice(2, 4), 16); b = parseInt(x.slice(4, 6), 16);
    } else {
      continue; // 5- or 7-digit strings are not colors (likely ids/hashes)
    }
    const [h, s] = rgbToHsl(r, g, b);
    check(file, lineOf(text, m.index), m[0], h, s);
  }
  // literal hsl()/hsla() with a NUMERIC hue (skips hsl(var(--surf-hue) …))
  const hsl = /hsla?\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%/g;
  while ((m = hsl.exec(text))) {
    check(file, lineOf(text, m.index), m[0] + " …)", parseFloat(m[1]), parseFloat(m[2]) / 100);
  }
  // shadcn bare HSL token tuples (e.g. `--card: 196 58% 12%;`)
  const tup = /--[\w-]+:\s*(\d{1,3})\s+(\d{1,3})%\s+(\d{1,3})%/g;
  while ((m = tup.exec(text))) {
    check(file, lineOf(text, m.index), m[0] + " (token)", +m[1], +m[2] / 100);
  }
  // Tailwind off-palette utility classes. The blue family (cyan/sky/blue/teal)
  // is allowed; purple/pink families and mint-adjacent utilities are not.
  const tw = /\b(?:text|bg|border|ring|from|via|to|divide|outline|decoration|fill|stroke|shadow)-(indigo|violet|purple|fuchsia|pink)-\d{2,3}\b/g;
  while ((m = tw.exec(text))) {
    violations.push(
      `${file}:${lineOf(text, m.index)}  ${m[0]}  (Tailwind ${m[1]} utility — ` +
        `outside the locked blue/semantic palette).`,
    );
  }
}

function walk(dir, acc) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, acc);
    else if (/\.(tsx?|css)$/.test(e.name)) acc.push(p);
  }
  return acc;
}

for (const file of walk(SRC, [])) {
  const rel = path.relative(ROOT, file);
  if (EXEMPT.includes(rel)) continue;
  scanText(rel, fs.readFileSync(file, "utf8"));
}

if (violations.length) {
  console.error(`\n✗ Palette guardrail FAILED — ${violations.length} off-palette color(s) crept in:\n`);
  for (const v of violations) console.error("  " + v);
  console.error("\nFix: use the neutral gray --pp-* tokens (app), LANDING consts (landing page only), or a semantic red/amber/green status color.\n");
  process.exit(1);
}
console.log("✓ Palette guardrail passed — all colors within the locked palette (gray app, blue landing, semantic status).");
