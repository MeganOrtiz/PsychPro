#!/usr/bin/env node
// =============================================================================
// SURFACE HUE GUARDRAIL
//
// PsychPro's deep-cerulean surface palette repeatedly drifts toward navy. The
// only lever is HUE: the locked accent #76E4F7 is hue ~189, and surfaces must
// sit right next to it (canonical hue 192). When surfaces drift up to ~196 the
// app reads navy; below ~187 it reads green.
//
// Surfaces are centralized behind the `--surf-hue` CSS variable
// (hsl(var(--surf-hue) S% L% / A)) — that form has no literal hue, so it is the
// preferred, always-passing way to write a surface color. This check fails when
// a LITERAL surface color (dark + saturated cerulean) drifts outside [188, 193].
// It inspects rgb/hex, literal hsl()/hsla(), and bare HSL token tuples inside
// the .dark and .study-page-bg blocks of index.css. Accents (light, hue ~189),
// charts, reds, greens and neutrals are ignored.
//
// Run: node scripts/check-surface-hue.mjs   (exit 1 on any violation)
// =============================================================================
import fs from "fs";
import path from "path";

const ROOT = path.join(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC = path.join(ROOT, "src");

// Safe hue window for surfaces (canonical = 192; accent = 189).
const ALLOW_LO = 188;
const ALLOW_HI = 193;
// Detection band: only consider dark, saturated cerulean-family colors.
const DETECT_LO = 180;
const DETECT_HI = 210;
const MAX_L = 0.5; // surfaces are dark (<45%); excludes bright cyan accents / light text
const MIN_S = 0.2; // exclude near-neutrals

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

const isSurface = (h, s, l) => h >= DETECT_LO && h <= DETECT_HI && l < MAX_L && s > MIN_S;
const lineOf = (text, idx) => text.slice(0, idx).split("\n").length;

const violations = [];
function flag(file, line, raw, h) {
  violations.push(
    `${file}:${line}  ${raw}  (hue ${h.toFixed(1)} — must be ${ALLOW_LO}-${ALLOW_HI}; canonical 192). ` +
      `Use hsl(var(--surf-hue) S% L% / A) instead of a literal.`,
  );
}
function checkHsl(file, line, raw, h, sFrac, lFrac) {
  if (!isSurface(h, sFrac, lFrac)) return;
  if (h < ALLOW_LO || h > ALLOW_HI) flag(file, line, raw, h);
}

function scanText(file, text, { tuples = false } = {}) {
  let m;
  // rgb()/rgba()
  const rgba = /rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})/g;
  while ((m = rgba.exec(text))) {
    const [h, s, l] = rgbToHsl(+m[1], +m[2], +m[3]);
    checkHsl(file, lineOf(text, m.index), m[0] + ")", h, s, l);
  }
  // #rrggbb
  const hex = /#([0-9a-fA-F]{6})\b/g;
  while ((m = hex.exec(text))) {
    const x = m[1];
    const [h, s, l] = rgbToHsl(parseInt(x.slice(0, 2), 16), parseInt(x.slice(2, 4), 16), parseInt(x.slice(4, 6), 16));
    checkHsl(file, lineOf(text, m.index), m[0], h, s, l);
  }
  // literal hsl()/hsla() with a NUMERIC hue (skips hsl(var(--surf-hue) ...))
  const hsl = /hsla?\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%/g;
  while ((m = hsl.exec(text))) {
    checkHsl(file, lineOf(text, m.index), m[0] + " …)", parseFloat(m[1]), parseFloat(m[2]) / 100, parseFloat(m[3]) / 100);
  }
  // bare HSL token tuples (e.g. shadcn `--card: 196 58% 12%`) — opt-in, dark blocks only
  if (tuples) {
    const tup = /(?:^|[:\s])(\d{2,3})\s+(\d{1,3})%\s+(\d{1,3})%/g;
    while ((m = tup.exec(text))) {
      checkHsl(file, lineOf(text, m.index), m[0].trim() + " (token)", +m[1], +m[2] / 100, +m[3] / 100);
    }
  }
}

// Extract the .dark and .study-page-bg blocks (these hold surface token tuples;
// the :root light theme is intentionally excluded — different rules).
function darkBlocks(css) {
  const out = [];
  for (const re of [/\.dark\s*\{/g, /\.study-page-bg\s*,\s*\.study-page-aurora\s*\{/g]) {
    const mm = re.exec(css);
    if (!mm) continue;
    const open = css.indexOf("{", mm.index);
    let depth = 0, i = open;
    for (; i < css.length; i++) { if (css[i] === "{") depth++; else if (css[i] === "}") { depth--; if (depth === 0) { i++; break; } } }
    out.push({ start: open + 1, body: css.slice(open + 1, i - 1) });
  }
  return out;
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
  const text = fs.readFileSync(file, "utf8");
  scanText(rel, text);
  if (file.endsWith("index.css")) {
    const fullLineBase = text;
    for (const blk of darkBlocks(text)) {
      // scan tuples within the block; line numbers offset to the full file
      let m;
      const tup = /(?:^|[:\s])(\d{2,3})\s+(\d{1,3})%\s+(\d{1,3})%/g;
      while ((m = tup.exec(blk.body))) {
        const [h, s, l] = [+m[1], +m[2] / 100, +m[3] / 100];
        if (!isSurface(h, s, l)) continue;
        if (h < ALLOW_LO || h > ALLOW_HI) flag(rel, lineOf(fullLineBase, blk.start + m.index), m[0].trim() + " (token)", h);
      }
    }
  }
}

if (violations.length) {
  console.error(`\n✗ Surface hue guardrail FAILED — ${violations.length} color(s) drifted out of the cerulean window:\n`);
  for (const v of violations) console.error("  " + v);
  console.error("\nFix: pull the hue back to 192, or express it as hsl(var(--surf-hue) S% L% / A).\n");
  process.exit(1);
}
console.log("✓ Surface hue guardrail passed — all literal surfaces are within the cerulean window (188-193).");
