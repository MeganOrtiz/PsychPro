from PIL import Image

base = "attached_assets/"
glass = Image.open(base + "psychpro-teal-glass-transparent.png").convert("RGBA")
brain = Image.open("artifacts/neuronotes/src/assets/psychpro-chrome-brain.webp").convert("RGBA")

for name, file, title_box, content_y in [
    ("main", "Screenshot_2026-09-09_at_12.38.02_PM_1788975499258.png", (380, 241, 639, 278), 300),
    ("eppp", "Screenshot_2026-09-09_at_12.38.14_PM_1788975500983.png", (247, 274, 767, 308), 309),
]:
    source = Image.open(base + file).convert("RGBA")
    source = source.resize((1024, round(source.height * 1024 / source.width)), Image.Resampling.LANCZOS)
    output = source.copy()
    header = Image.new("RGBA", source.size, "white")
    artwork = glass.resize((760, 428), Image.Resampling.LANCZOS)
    header.alpha_composite(artwork, (270, -36))
    title = source.crop(title_box)
    header.alpha_composite(title, ((1024-title.width)//2, 47))
    b = brain.copy()
    b.thumbnail((192, 157), Image.Resampling.LANCZOS)
    header.alpha_composite(b, ((1024-b.width)//2, 94))
    # Keep the uploaded navigation and cards intact. The compact title-first
    # header reflects the approved layout; only the new art is added.
    output.paste(header.crop((195, 42, 1024, 260)), (195, 42))
    output.paste(source.crop((195, content_y, 1024, source.height)), (195, 260))
    height = source.height - (content_y - 260)
    output = output.crop((0, 0, 1024, height)).convert("RGB")
    output.save(base + f"dashboard-teal-glass-{name}-final.png")