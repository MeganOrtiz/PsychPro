from PIL import Image, ImageDraw, ImageFont

ROOT = "attached_assets/"
SOURCE_BRAIN = "artifacts/neuronotes/src/assets/psychpro-chrome-brain.webp"

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


brain = Image.open(SOURCE_BRAIN).convert("RGBA")
brain_height = round(brain.height * BRAIN_WIDTH / brain.width)
brain = brain.resize((BRAIN_WIDTH, brain_height), Image.Resampling.LANCZOS)

for mockup in MOCKUPS:
    source = normalized(ROOT + mockup["source"])
    canvas_height = max(source.height, 240)

    # Preserve the actual sidebar and top-right controls. Only the dashboard
    # title/brain field is cleared and rebuilt with shared geometry.
    composed = Image.new("RGBA", (TARGET_WIDTH, canvas_height), "white")
    composed.alpha_composite(source, (0, 0))
    ImageDraw.Draw(composed).rectangle(
        (CONTENT_LEFT, 40, TARGET_WIDTH - 1, canvas_height - 1),
        fill="white",
    )
    composed.alpha_composite(source.crop((0, 0, CONTENT_LEFT, source.height)), (0, 0))
    composed.alpha_composite(source.crop((780, 0, TARGET_WIDTH, 40)), (780, 0))

    title = crop_ink(source, mockup["title_box"])
    title_width = round(title.width * TITLE_HEIGHT / title.height)
    title = title.resize((title_width, TITLE_HEIGHT), Image.Resampling.LANCZOS)
    title_x = CONTENT_LEFT + ((TARGET_WIDTH - CONTENT_LEFT - title.width) // 2)
    brain_x = CONTENT_LEFT + ((TARGET_WIDTH - CONTENT_LEFT - brain.width) // 2)

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
        "HEADER MOCKUP • Shared title height, brain width and vertical spacing • Positioned higher",
        font=font,
        fill="#555555",
    )
    result.save(ROOT + f"dashboard-header-congruent-{mockup['name']}.png")