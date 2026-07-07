---
name: PsychPro landing Brain Lab brain — owner decision
description: Owner REJECTED the glowing-teal brain in the landing Brain Lab promo; that section keeps the grayscale lateral.webp brain.
---

# Landing Brain Lab promo keeps the grayscale brain (owner decision)

The owner supplied a glowing teal brain image and asked for its rectangular box
removed and "seamless integration into the background for the landing page."
A transparent cutout was made (`src/assets/brain-views/lateral-glow.png`, kept
in the repo, currently UNUSED) and placed into the landing Brain Lab promo split
section — the owner **rejected that placement** ("Why are you touching the brain
lab!?") and asked for the original grayscale `lateral.webp` back there.

**Why:** The Brain Lab promo section's grayscale brain is intentional; the owner
did not want the glowing brain there. As of this writing the owner has NOT said
where (or whether) the glowing brain should appear.

**How to apply:**
- Never swap the Brain Lab promo image without explicit placement instructions.
- If the glowing brain comes up again, `lateral-glow.png` is a ready-made cutout
  that blends seamlessly over the smoke bg (residual teal haze matches the palette
  — verify blend by compositing over `assets/bg/psychpro-smoke-bg.jpeg`, not on white).
- The grayscale `lateral.webp` is also used by the Brain Lab tool; never overwrite it.
