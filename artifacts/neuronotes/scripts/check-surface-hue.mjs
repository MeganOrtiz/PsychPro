#!/usr/bin/env node
// =============================================================================
// NEUTRAL PALETTE GUARDRAIL  (black-foundation baseline, 2026-07-09)
//
// The entire visual layer was stripped to a black foundation: pure-black page
// floors, flat dark-gray panels, neutral gray borders, white/gray text. The
// old cerulean/cyan palette, glass, glow, and colored tiles were removed.
//
// This check fails when a SATURATED color drifts back into the UI. Allowed:
//   - Neutrals (saturation <= 25%).
//   - Semantic status colors: red/amber (hue 0-70) and green (hue 90-160)
//     for destructive/warning/success states.
//   - src/data/brain-structures.ts — functional anatomy colors used by the
//     Brain Lab 3D/2D viewers (educational content, not UI chrome).
//
// Everything else — cyan, blue, indigo, violet, purple, magenta, pink — is a
// regression toward the retired palette and fails loudly.
//
// Run: node scripts/check-surface-hue.mjs   (exit 1 on any violation)
// =============================================================================
import fs from "fs";
import path from "path";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "src");

const MAX_NEUTRAL_S = 0.25; // anything at/below this saturation is fine
// Allowed saturated hue windows (semantic status colors only).
const ALLOWED_HUES = [
  [0, 70],    // red … amber (destructive, warnings)
  [90, 160],  // green (success)
  [345, 360], // wrap-around reds
];
// Files exempt from the saturation ban.
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
      `saturated non-semantic color; the app is a neutral black foundation).`,
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
  // #rrggbb
  const hex = /#([0-9a-fA-F]{6})\b/g;
  while ((m = hex.exec(text))) {
    const x = m[1];
    const [h, s] = rgbToHsl(parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16));
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
  // Tailwind blue-family utility classes (text-cyan-300, bg-sky-100/40, …)
  const tw = /\b(?:text|bg|border|ring|from|via|to|divide|outline|decoration|fill|stroke|shadow)-(cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose|teal)-\d{2,3}\b/g;
  while ((m = tw.exec(text))) {
    violations.push(
      `${file}:${lineOf(text, m.index)}  ${m[0]}  (Tailwind ${m[1]} utility — ` +
        `use neutral-* instead; the app is a neutral black foundation).`,
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
  console.error(`\n✗ Neutral palette guardrail FAILED — ${violations.length} saturated color(s) crept back in:\n`);
  for (const v of violations) console.error("  " + v);
  console.error("\nFix: use neutral grays (#0a0a0a…#f5f5f5) or a semantic red/amber/green status color.\n");
  process.exit(1);
}
console.log("✓ Neutral palette guardrail passed — no saturated non-semantic colors in src.");
