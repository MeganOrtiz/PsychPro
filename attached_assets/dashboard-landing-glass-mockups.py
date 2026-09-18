from PIL import Image, ImageDraw, ImageFont

ROOT = "attached_assets/"
CHROME_BRAIN = "artifacts/neuronotes/src/assets/psychpro-chrome-brain.webp"
TEAL_GLASS = "artifacts/neuronotes/src/assets/psychpro-teal-glass.webp"

MOCKUPS = [
    {
        "name": "main",
        "source": "Screenshot_2026-09-15_at_4.54.54_PM_1789509305125.png",
        "title_box": (380, 53, 642, 94),
    },
    {
        "name": "eppp",
        "source": "Screenshot_2026-09-15_at_4.54.59_PM_1789509312058.png",
        "title_box": (244, 53, 778, 103),
    },
]

TARGET_WIDTH = 1024
CONTENT_LEFT = 198
TITLE_TOP = 44
TITLE_HEIGHT = 31
BRAIN_TOP = 82
BRAIN_WIDTH = 166


def normalized(path):
    image = Image.open(path).convert("RGBA")
    height = round(image.height * TARGET_WIDTH / image.width)
    return image.resize((TARGET_WIDTH, height), Image.Resampling.LANCZOS)


def crop_ink(image, box):
    crop = image.crop(box).convert("RGBA")
    gray = crop.convert("L")
    mask = gray.point(lambda value: 255 if value < 205 else 0)
    bounds = mask.getbbox()
    return crop.crop(bounds) if bounds else crop


brain = Image.open(CHROME_BRAIN).convert("RGBA")
brain_height = round(brain.height * BRAIN_WIDTH / brain.width)
brain = brain.resize((BRAIN_WIDTH, brain_height), Image.Resampling.LANCZOS)

# Use the exact landing-page asset as a continuous right-edge composition.
# At this width, the artwork starts behind the brain and reaches the dashboard
# viewport edge without tiling or inventing a second texture.
glass_width = 600
glass_source = Image.open(TEAL_GLASS).convert("RGBA")
alpha_bounds = glass_source.getchannel("A").getbbox()
if alpha_bounds:
    glass_source = glass_source.crop(alpha_bounds)
glass_height = round(glass_source.height * glass_width / glass_source.width)
glass = glass_source.resize((glass_width, glass_height), Image.Resampling.LANCZOS)

for mockup in MOCKUPS:
    source = normalized(ROOT + mockup["source"])
    canvas_height = max(source.height, 240)
    composed = Image.new("RGBA", (TARGET_WIDTH, canvas_height), "white")
    composed.alpha_composite(source, (0, 0))

    # Preserve the real sidebar and top-right controls, clearing only the
    # dashboard hero field before applying the proposed art treatment.
    ImageDraw.Draw(composed).rectangle(
        (CONTENT_LEFT, 40, TARGET_WIDTH - 1, canvas_height - 1),
        fill="white",
    )
    composed.alpha_composite(source.crop((0, 0, CONTENT_LEFT, source.height)), (0, 0))
    composed.alpha_composite(source.crop((780, 0, TARGET_WIDTH, 40)), (780, 0))

    title = crop_ink(source, mockup["title_box"])
    title_width = round(title.width * TITLE_HEIGHT / title.height)
    title = title.resize((title_width, TITLE_HEIGHT), Image.Resampling.LANCZOS)

    brain_x = CONTENT_LEFT + ((TARGET_WIDTH - CONTENT_LEFT - brain.width) // 2)
    title_x = CONTENT_LEFT + ((TARGET_WIDTH - CONTENT_LEFT - title.width) // 2)
    glass_x = brain_x - 78
    glass_y = 80

    composed.alpha_composite(glass, (glass_x, glass_y))
    composed.alpha_composite(title, (title_x, TITLE_TOP))
    composed.alpha_composite(brain, (brain_x, BRAIN_TOP))

    result = Image.new("RGB", (TARGET_WIDTH, canvas_height + 42), "white")
    result.paste(composed.convert("RGB"), (0, 0))
    draw = ImageDraw.Draw(result)
    draw.line((0, canvas_height + 4, TARGET_WIDTH, canvas_height + 4), fill="#dddddd")
    font = ImageFont.truetype(
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        12,
    )
    draw.text(
        (18, canvas_height + 16),
        "MOCKUP • Existing landing-page glass extended from the brain to the right edge",
        font=font,
        fill="#555555",
    )
    result.save(ROOT + f"dashboard-with-landing-glass-{mockup['name']}.png")