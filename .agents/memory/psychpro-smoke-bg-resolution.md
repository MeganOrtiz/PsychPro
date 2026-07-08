---
name: PsychPro smoke background resolution
description: The shared teal-smoke background source is intrinsically low-res; "looks cheap/blurry" is a resolution problem, not CSS.
---

# PsychPro smoke background is resolution-limited

The single shared backdrop asset (`artifacts/neuronotes/src/assets/bg/psychpro-smoke-bg.jpeg`)
originally came from the owner at only **941×1672 px** (~276KB). On a desktop hero
(~1920px+ wide, landscape) `background-size: cover` upscales that portrait image >2×,
which reads as soft/pixelated/"cheap." The owner re-attached the "same" image thinking
it was higher-res — it was byte-for-byte identical. They have no larger source.

**Why:** No CSS change can fix this — the pixels aren't in the file. The built-in
`generateImage` caps ~1408px and changes the artwork. fal.ai managed billing only does
background removal (no upscaler). inference.sh Topaz upscaler needs the owner's own login.

**How to apply:** If quality/"looks cheap" complaints resurface for the background, the
fix is **super-resolution of the existing asset**, not CSS or a regenerate. The exact
image was upscaled in-repl with Real-ESRGAN (spandrel + `RealESRGAN_x4plus_anime_6B.pth`,
the 6-block model — general x4plus is too slow on CPU), then Lanczos-downscaled to 2560px
wide, saved JPEG q90 (~1MB) over the same filename (re-skins landing+app+dashboards+EPPP).

**July 8, 2026 update:** owner supplied a NEW backdrop artwork (deep navy-blue smoke,
also low-res at 1672×941). Same recipe reused successfully: Real-ESRGAN anime-6B 4x
(tiled, resumable), Lanczos to 2560 wide, JPEG q90 over the same shared filename
(psychpro-smoke-bg-hq.jpeg). The letterbox base color AND the body dark floor were
both aligned to the new artwork's darkest tone (#030d24) — keep those two in sync
with whatever artwork ships, or first-paint/letterbox seams appear.

**Sandbox constraints that shaped the run (also apply to any CPU ML task here):**
- bash calls hard-cap at 120s; a full 4× pass on 1.57MP takes ~200s → must be resumable.
- Backgrounded/nohup processes do NOT survive between bash tool calls (get reaped).
- ~3.6GB free RAM (app workflows eat ~4.8GB of 8GB); large float output tensors OOM-kill.
- Working recipe: write output into an on-disk `np.memmap` (uint8), tile=128 (low peak mem),
  track done rows in a json, stop at a time budget, re-run until ALLDONE. tile=256 OOM'd.
