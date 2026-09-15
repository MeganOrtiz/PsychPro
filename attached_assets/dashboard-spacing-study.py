from PIL import Image, ImageDraw, ImageFont, ImageChops

ROOT = "attached_assets/"
brain = Image.open("artifacts/neuronotes/src/assets/psychpro-chrome-brain.webp").convert("RGBA")
rows = [
    ("main", "Screenshot_2026-09-15_at_4.54.54_PM_1789509305125.png",
     "Screenshot_2026-09-09_at_12.38.02_PM_1788975499258.png", (380, 57, 640, 90), 300),
    ("eppp", "Screenshot_2026-09-15_at_4.54.59_PM_1789509312058.png",
     "Screenshot_2026-09-09_at_12.38.14_PM_1788975500983.png", (248, 61, 771, 99), 309),
]

def load(name):
    im = Image.open(ROOT + name).convert("RGBA")
    return im.resize((1024, round(im.height * 1024 / im.width)), Image.Resampling.LANCZOS)

for name, current_file, context_file, box, content_y in rows:
    current, context = load(current_file), load(context_file)
    # Current screenshots supply the exact header, controls and title.
    # Earlier full screenshots supply unchanged cards for visual context only.
    height = 410
    out = Image.new("RGBA", (1024, height), "white")
    out.paste(context.crop((0, 0, 198, height)), (0, 0))
    out.paste(current.crop((0, 0, 1024, 42)), (0, 0))
    out.paste(current.crop((0, 42, 198, current.height)), (0, 42))
    out.paste(context.crop((198, content_y, 1024, min(context.height, content_y + height - 198))), (198, 198))
    title = current.crop(box).convert("RGB")
    mask = title.convert("L").point(lambda p: 255 if p < 200 else 0)
    bounds = mask.getbbox()
    title = title.crop(bounds)
    title = title.resize((round(title.width * 24 / title.height), 24), Image.Resampling.LANCZOS)
    out.paste(title, ((1024 - title.width)//2, 44))
    b = brain.copy()
    b.thumbnail((144, 116), Image.Resampling.LANCZOS)
    out.alpha_composite(b, ((1024-b.width)//2, 80))
    # Align the top of the right-hand panel with the wordmark.
    if name == "main":
        panel = out.crop((740, 198, 1002, 410))
        out.paste("white", (736, 194, 1024, 410))
        # Spotlight remains a full-height rail; retain its original header
        # and copy, extending its existing neutral surface beneath them.
        rail = Image.new("RGBA", (262, 366), "white")
        rd = ImageDraw.Draw(rail)
        rd.rounded_rectangle((3, 0, 259, 365), radius=14, fill=(94, 95, 97, 255))
        rail.paste(panel.crop((0, 0, 262, 180)), (0, 0))
        out.alpha_composite(rail, (740, 44))
    else:
        panel = out.crop((774, 198, 994, 380))
        out.paste("white", (770, 194, 1002, 386))
        out.paste(panel, (774, 44))
    # A small footer distinguishes the screenshot composition from a live page.
    result = Image.new("RGB", (1024, 452), "white")
    result.paste(out.convert("RGB"), (0, 0))
    draw = ImageDraw.Draw(result)
    f = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
    draw.line((0, 415, 1024, 415), fill="#dddddd")
    draw.text((18, 426), "LAYOUT MOCKUP • Right-hand panel aligned with the dashboard title • No live-page changes", font=f, fill="#555555")
    result.save(ROOT + f"dashboard-right-panel-{name}.png")