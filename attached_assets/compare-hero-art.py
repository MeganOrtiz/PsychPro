from PIL import Image, ImageDraw, ImageFont
import math

ROOT = "attached_assets/"
original = Image.open(ROOT + "ChatGPT_Image_Sep_15,_2026_at_02_14_52_PM_1789500987294.jpeg").convert("RGBA")
cutout = Image.open(ROOT + "psychpro-teal-glass-transparent.png").convert("RGBA")
brain = Image.open("artifacts/neuronotes/src/assets/psychpro-chrome-brain.webp").convert("RGBA")

def font(size):
    return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size)

def centered(draw, text, y, size, color="#333333"):
    draw.text((512, y), text, font=font(size), fill=color, anchor="mt")

def panel(source, blend):
    canvas = Image.new("RGBA", (1024, 590), "white")
    art = source.resize((860, 484), Image.Resampling.LANCZOS)
    if blend:
        # Preserve original RGB detail; fade only the outer edges into white.
        mask = Image.new("L", art.size)
        px = mask.load()
        for y in range(art.height):
            for x in range(art.width):
                edge = min(x / 180, y / 65, (art.height - 1 - y) / 95, 1)
                t = max(0, edge)
                px[x, y] = round(255 * t * t * (3 - 2 * t))
        art.putalpha(mask)
    canvas.alpha_composite(art, (205, -5))
    draw = ImageDraw.Draw(canvas)
    centered(draw, "P S Y C H P R O", 26, 42)
    centered(draw, "l e a r n .  e x p a n d .  c o n n e c t .", 84, 13)
    b = brain.copy()
    b.thumbnail((270, 245), Image.Resampling.LANCZOS)
    canvas.alpha_composite(b, ((1024-b.width)//2, 145))
    draw = ImageDraw.Draw(canvas)
    centered(draw, "Learn Smarter. Not Harder.", 398, 29)
    centered(draw, "Evidence-based study tools for psych students.", 445, 16)
    centered(draw, "Concepts in psychology, neuroscience, assessment and intervention", 472, 16)
    centered(draw, "for classroom and clinical learning all in one space.", 499, 16)
    return canvas.convert("RGB")

a = panel(cutout, False)
b = panel(original, True)
result = Image.new("RGB", (2080, 674), "#eeeeee")
result.paste(a, (8, 76))
result.paste(b, (1048, 76))
d = ImageDraw.Draw(result)
d.text((30, 18), "A — Transparent cutout on white", font=font(26), fill="#222222")
d.text((1070, 18), "B — Original with edges faded into white", font=font(26), fill="#222222")
result.save(ROOT + "psychpro-art-comparison.jpg", quality=95)
a.save(ROOT + "psychpro-art-transparent-preview.png")
b.save(ROOT + "psychpro-art-blended-preview.png")