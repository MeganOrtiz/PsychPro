---
name: Mockup preview heavy images
description: Large PNGs in mockup-sandbox previews cause intermittent blank/missing renders perceived as "crashing"
---

# Heavy images break mockup-sandbox previews intermittently

Large unoptimized PNGs referenced from a mockup-sandbox preview (e.g. a multi-hundred-KB
hero image + a multi-MB background layer) lose the load race: the screenshot service
(and slow client loads) capture the page before the image decodes, so the hero appears
blank/missing while sibling glow/bloom divs still show. Users report this as the preview
"crashing." A genuinely white preview is usually a different cause — the dev server caught
mid-restart (Vite ~1-2s startup) returns blank; re-capture after it's confirmed up.

**Why:** binary asset weight, not a code bug. Same component/image renders fine on one
preview and blank on another in the same batch purely on timing.

**How to apply:** keep preview PNGs small. ImageMagick is available (`magick`); no
sharp/pngquant/cwebp. Quantize to PNG8 preserving alpha:
`magick in.png -resize 520x -strip -depth 8 -define png:compression-level=9 PNG8:out.png`
(verify alpha kept via `magick out.png -format "%[channels]" info:` → expect `srgba`).
Also add `loading="eager" decoding="async" fetchPriority="high"` to the hero <img>.
NOTE: never put a `//` line comment between JSX attributes — esbuild/Vite parse-errors and
white-screens the preview; use camelCase props React supports directly instead.
