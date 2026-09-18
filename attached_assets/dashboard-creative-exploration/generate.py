from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
import math
import os

ROOT = "attached_assets/"
OUT_DIR = "attached_assets/dashboard-creative-exploration/"
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

def create_gradient_mask(size, direction='horizontal', start_val=255, end_val=0):
    mask = Image.new('L', size)
    draw = ImageDraw.Draw(mask)
    if direction == 'horizontal':
        for x in range(size[0]):
            alpha = int(start_val + (end_val - start_val) * (x / size[0]))
            draw.line([(x, 0), (x, size[1])], fill=alpha)
    else:
        for y in range(size[1]):
            alpha = int(start_val + (end_val - start_val) * (y / size[1]))
            draw.line([(0, y), (size[0], y)], fill=alpha)
    return mask

brain = Image.open(CHROME_BRAIN).convert("RGBA")
brain_height = round(brain.height * BRAIN_WIDTH / brain.width)
brain = brain.resize((BRAIN_WIDTH, brain_height), Image.Resampling.LANCZOS)

glass_source = Image.open(TEAL_GLASS).convert("RGBA")
alpha_bounds = glass_source.getchannel("A").getbbox()
if alpha_bounds:
    glass_source = glass_source.crop(alpha_bounds)

DIRECTIONS = [
    {
        "id": "neural_current",
        "title": "Neural Current",
        "desc": "Stream emerging behind brain, accelerating right, layered depth"
    },
    {
        "id": "cerebral_horizon",
        "title": "Cerebral Horizon",
        "desc": "Low panoramic glass horizon, calm architecture, controlled fade"
    },
    {
        "id": "synaptic_bloom",
        "title": "Synaptic Bloom",
        "desc": "Expressive branching, expanding from brain, coalescing right"
    }
]

def apply_direction(base_canvas, direction_id, center_x, center_y, width_avail):
    art_layer = Image.new("RGBA", (TARGET_WIDTH, base_canvas.height), (0,0,0,0))
    
    if direction_id == "neural_current":
        # Stream: stretched horizontally, motion blur feel, layering
        glass_w = width_avail + 100
        glass_h = round(glass_source.height * (glass_w / glass_source.width) * 0.6)
        glass_resized = glass_source.resize((glass_w, glass_h), Image.Resampling.LANCZOS)
        
        # Base layer: heavily blurred for depth
        layer1 = glass_resized.copy().filter(ImageFilter.GaussianBlur(15))
        
        # Soft left fade and partial opacity
        l1_mask = Image.new('L', layer1.size)
        draw = ImageDraw.Draw(l1_mask)
        for x in range(glass_w):
            if x < glass_w * 0.3:
                val = int((x / (glass_w * 0.3)) * 180) # fade in up to 180 max alpha
            else:
                val = 180
            draw.line([(x, 0), (x, glass_h)], fill=val)
            
        layer1.putalpha(Image.composite(l1_mask, Image.new('L', l1_mask.size, 0), layer1.getchannel('A')))
        art_layer.alpha_composite(layer1, (center_x - 50, center_y - glass_h//2 + 30))
        
        # Sharp stream layer, shifted right
        glass_w2 = int(width_avail * 0.8)
        glass_h2 = round(glass_source.height * (glass_w2 / glass_source.width) * 0.4)
        glass2 = glass_source.resize((glass_w2, glass_h2), Image.Resampling.LANCZOS)
        
        # Fade left heavily so it looks like it emerges
        mask2 = create_gradient_mask((glass_w2, glass_h2), 'horizontal', 0, 255)
        glass2.putalpha(Image.composite(mask2, Image.new('L', mask2.size, 0), glass2.getchannel('A')))
        
        art_layer.alpha_composite(glass2, (center_x + 30, center_y - glass_h2//2 + 10))
        
        # Add a flipped, overlay piece for "acceleration"
        glass3 = glass2.transpose(Image.FLIP_LEFT_RIGHT)
        art_layer.alpha_composite(glass3, (center_x + width_avail//2, center_y - glass_h2//2 + 20))

    elif direction_id == "cerebral_horizon":
        # Horizon: wide, low, very calm, feathered edges
        glass_w = width_avail + 200
        glass_h = 120
        
        slice_box = (0, glass_source.height//2 - 100, glass_source.width, glass_source.height//2 + 100)
        glass_slice = glass_source.crop(slice_box)
        glass_resized = glass_slice.resize((glass_w, glass_h), Image.Resampling.LANCZOS)
        
        final_mask = Image.new('L', (glass_w, glass_h), 255)
        for y in range(glass_h):
            dist = abs(y - glass_h/2) / (glass_h/2)
            alpha = max(0, min(255, int((1 - dist**2) * 255)))
            ImageDraw.Draw(final_mask).line([(0, y), (glass_w, y)], fill=alpha)
            
        h_mask = Image.new('L', (glass_w, glass_h), 255)
        for x in range(glass_w):
            if x < 150:
                alpha = int((x / 150) * 255)
            elif x > glass_w - 100:
                alpha = int(((glass_w - x) / 100) * 255)
            else:
                alpha = 255
            ImageDraw.Draw(h_mask).line([(x, 0), (x, glass_h)], fill=alpha)
            
        combined_mask = Image.composite(final_mask, Image.new('L', final_mask.size, 0), h_mask)
        actual_alpha = Image.composite(combined_mask, Image.new('L', combined_mask.size, 0), glass_resized.getchannel('A'))
        glass_resized.putalpha(actual_alpha)
        
        glass_blur = glass_resized.filter(ImageFilter.GaussianBlur(2))
        art_layer.alpha_composite(glass_blur, (center_x - 100, center_y - glass_h//2 + 40))

    elif direction_id == "synaptic_bloom":
        bloom1_w = 350
        bloom1_h = round(glass_source.height * (bloom1_w / glass_source.width))
        bloom1 = glass_source.resize((bloom1_w, bloom1_h), Image.Resampling.LANCZOS)
        
        bloom1 = bloom1.filter(ImageFilter.GaussianBlur(8))
        bloom1_mask = create_gradient_mask((bloom1_w, bloom1_h), 'horizontal', 150, 0)
        bloom1.putalpha(Image.composite(bloom1_mask, Image.new('L', bloom1_mask.size, 0), bloom1.getchannel('A')))
        art_layer.alpha_composite(bloom1, (center_x - 50, center_y - bloom1_h//2 + 40))
        
        branch1_w = 300
        branch1_h = round(glass_source.height * (branch1_w / glass_source.width))
        branch1 = glass_source.resize((branch1_w, branch1_h), Image.Resampling.LANCZOS)
        branch1 = branch1.rotate(-5, expand=True)
        b1_mask = create_gradient_mask(branch1.size, 'horizontal', 0, 255)
        branch1.putalpha(Image.composite(b1_mask, Image.new('L', b1_mask.size, 0), branch1.getchannel('A')))
        art_layer.alpha_composite(branch1, (center_x + 80, center_y - branch1.height//2 + 60))
        
        branch2_w = 280
        branch2_h = round(glass_source.height * (branch2_w / glass_source.width))
        branch2 = glass_source.resize((branch2_w, branch2_h), Image.Resampling.LANCZOS)
        branch2 = branch2.transpose(Image.FLIP_TOP_BOTTOM).rotate(-20, expand=True)
        b2_mask = create_gradient_mask(branch2.size, 'horizontal', 0, 200)
        branch2.putalpha(Image.composite(b2_mask, Image.new('L', b2_mask.size, 0), branch2.getchannel('A')))
        art_layer.alpha_composite(branch2, (center_x + 180, center_y - branch2.height//2 + 90))
        
        clear_mask = Image.new('L', art_layer.size, 255)
        clear_draw = ImageDraw.Draw(clear_mask)
        for y in range(0, 105):
            clear_draw.line([(0, y), (TARGET_WIDTH, y)], fill=0)
        for y in range(105, 125):
            alpha = int(((y - 105) / 20) * 255)
            clear_draw.line([(0, y), (TARGET_WIDTH, y)], fill=alpha)
        art_layer.putalpha(Image.composite(art_layer.getchannel('A'), Image.new('L', art_layer.size, 0), clear_mask))
        
    return art_layer

results = []

for direction in DIRECTIONS:
    dir_results = []
    for mockup in MOCKUPS:
        source = normalized(ROOT + mockup["source"])
        canvas_height = max(source.height, 240)
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

        brain_x = CONTENT_LEFT + ((TARGET_WIDTH - CONTENT_LEFT - brain.width) // 2)
        title_x = CONTENT_LEFT + ((TARGET_WIDTH - CONTENT_LEFT - title.width) // 2)
        
        brain_center_x = brain_x + brain.width // 2
        brain_center_y = BRAIN_TOP + brain.height // 2
        width_avail = TARGET_WIDTH - brain_center_x
        
        art_layer = apply_direction(composed, direction["id"], brain_center_x, brain_center_y, width_avail)
        composed.alpha_composite(art_layer, (0, 0))

        composed.alpha_composite(title, (title_x, TITLE_TOP))
        composed.alpha_composite(brain, (brain_x, BRAIN_TOP))

        result = Image.new("RGB", (TARGET_WIDTH, canvas_height + 42), "white")
        result.paste(composed.convert("RGB"), (0, 0))
        draw = ImageDraw.Draw(result)
        draw.line((0, canvas_height + 4, TARGET_WIDTH, canvas_height + 4), fill="#dddddd")
        
        try:
            font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", 12)
            title_font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 14)
        except:
            font = ImageFont.load_default()
            title_font = ImageFont.load_default()
            
        draw.text(
            (18, canvas_height + 12),
            f"{direction['title']} — {mockup['name'].upper()}",
            font=title_font,
            fill="#333333",
        )
        draw.text(
            (18, canvas_height + 30),
            direction['desc'],
            font=font,
            fill="#666666",
        )
        
        out_path = f"{OUT_DIR}{direction['id']}_{mockup['name']}.png"
        result.save(out_path)
        dir_results.append(result)
        
    results.append({
        "direction": direction,
        "images": dir_results
    })

sheet_width = TARGET_WIDTH * 2
sheet_height = sum([r["images"][0].height for r in results])
sheet = Image.new("RGB", (sheet_width, sheet_height), "white")

y_offset = 0
for r in results:
    img_main = r["images"][0]
    img_eppp = r["images"][1]
    sheet.paste(img_main, (0, y_offset))
    sheet.paste(img_eppp, (TARGET_WIDTH, y_offset))
    y_offset += img_main.height

sheet.save(f"{OUT_DIR}comparison_sheet.png")

print(f"Generated 6 variations and 1 comparison sheet in {OUT_DIR}")
