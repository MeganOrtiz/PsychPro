---
name: PsychPro landing Brain Lab cutout
description: The landing Brain Lab split brain is a transparent glowing-teal cutout meant to blend into the smoke bg; residual haze is intentional.
---

# Landing "Brain Lab" split brain is a blend-in cutout

The brain shown in the landing page's Brain Lab split section
(`landing-split-media--brain`, imported into `landing.tsx`) is a **glowing teal
brain cut out with background removal** and placed over the shared smoke
background so it looks like it floats in the page, with **no rectangular image
box**. The owner explicitly wanted "no indication it doesn't flow with the page."

**Why residual haze is fine (do not 'fix' it):** background removal on a glowing
subject over a glowing cloud leaves faint semi-transparent teal haze at the edges.
That haze is the SAME cerulean/teal family as the page's smoke background, so it
blends invisibly — there is no visible edge. Hard-cropping it tighter would remove
the soft glow and make the brain look pasted-on. Verify blend by compositing the
exact cutout PNG over `assets/bg/psychpro-smoke-bg.jpeg`, not by inspecting the PNG
on white/checkerboard (which makes the haze look like a defect).

**How to apply:** The existing `.landing-split-img` drop-shadow + `.landing-split-glow`
radial are part of the blend — keep them. The grayscale `brain-views/lateral.webp`
is a SEPARATE asset still used by the Brain Lab tool; the landing uses its own
`lateral-glow.png`. Don't overwrite lateral.webp to change the landing brain.
