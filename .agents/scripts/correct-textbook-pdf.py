"""Preserve the original PDF and produce a verified, corrected digital copy."""
import argparse
from collections import Counter
import json
from pathlib import Path
import re
import sys
import unicodedata

try:
    import pymupdf as pdf
except ModuleNotFoundError:
    cached = next(Path(".cache/uv/archive-v0").glob("*/pymupdf/__init__.py"))
    sys.path.insert(0, str(cached.parent.parent))
    import pymupdf as pdf

SOURCE = Path("attached_assets/PsychPro_Foundations_in_Clinical_Psychology_Volume_1_1790923615062.pdf")
OUT = Path("deliverables/PsychPro_Foundations_in_Clinical_Psychology_Volume_1_Corrected.pdf")
WORK = Path(".agents/outputs/textbook-corrections")
WORK.mkdir(parents=True, exist_ok=True)
doc = pdf.open(SOURCE)


def normalize(text, stem=False):
    text = unicodedata.normalize("NFKC", text).lower()
    text = re.sub(r"(?<=\w)[-\u00ad‐‑–]\s*\n\s*(?=\w)", "", text)
    text = re.sub(r"[-‐‑–]", " ", text)
    words = re.findall(r"[a-z0-9]+", text)
    if stem:
        words = [
            w[:-3] + "y" if w.endswith("ies") and len(w) > 5
            else w[:-1] if len(w) > 4 and w.endswith("s") and not w.endswith(("ss", "us", "is"))
            else w for w in words
        ]
    return " ".join(words)


texts = [page.get_text() for page in doc]
pages = [normalize(t) for t in texts]
stem_pages = [normalize(t, True) for t in texts]
headings = {}
for index in range(10, 698):
    for block in doc[index].get_text("dict")["blocks"]:
        block_lines = []
        for line in block.get("lines", []):
            spans = line["spans"]
            line_text = normalize("".join(s["text"] for s in spans))
            if line_text and any(s["color"] != 0 or s["size"] >= 12 for s in spans):
                headings.setdefault(line_text, []).append((index, line["bbox"][1]))
            if line_text and spans and all(s["size"] >= 12 for s in spans):
                block_lines.append((line_text, line["bbox"][1]))
        if len(block_lines) > 1:
            headings.setdefault(" ".join(t for t, _ in block_lines), []).append((index, block_lines[0][1]))


def parse_index():
    result = []
    for page in doc[759:]:
        columns = [[], []]
        for block in page.get_text("dict")["blocks"]:
            for line in block.get("lines", []):
                text = "".join(s["text"] for s in line["spans"]).strip()
                if text == "Index" or re.fullmatch(r"[A-Z]", text):
                    continue
                columns[0 if line["bbox"][0] < 220 else 1].append((line["bbox"][1], text))
        for column in columns:
            pending = ""
            for _, text in sorted(column):
                pending += ("" if pending.endswith("-") else " ") + text
                if "—" in text:
                    term = pending.rsplit(",", 1)[0].strip()
                    result.append(term)
                    pending = ""
            if pending.strip():
                raise ValueError(f"Unfinished index term: {pending}")
    return result


terms = sorted(parse_index(), key=normalize)
aliases = {
    "achievement tests": "achievement test",
    "wechsler scales": "wechsler",
    "woodcock johnson battery": "woodcock johnson",
    "continuity discontinuity issue": "continuitydiscontinuity issue",
    "independent self construals": "independent selfconstruals",
}
entries = []
unmatched = []
for term in terms:
    key = normalize(term)
    exact_heading = headings.get(key, [])
    pattern = re.compile(r"(?<!\w)" + re.escape(aliases.get(key, key)) + r"(?!\w)")
    literal_matches = [i for i in range(10, 698) if pattern.search(pages[i])]
    if exact_heading:
        destinations = sorted(set([i for i, _ in exact_heading[:2]] + literal_matches[:1]))
    else:
        destinations = literal_matches
        if not destinations:
            pattern = re.compile(r"(?<!\w)" + re.escape(normalize(term, True)) + r"(?!\w)")
            destinations = [i for i in range(10, 698) if pattern.search(stem_pages[i])]
    if not destinations:
        unmatched.append(term)
    else:
        # Exact topic headings take precedence over incidental mentions.
        # Limit broad terms to a few useful references rather than long lists.
        entries.append({"term": term, "targets": destinations[:3]})

print(json.dumps({
    "index_terms": len(terms), "resolved": len(entries), "unmatched": unmatched,
    "bookmarks": len(doc.get_toc()),
    "bookmark_destinations": Counter(item[2] for item in doc.get_toc()),
}, indent=2))
(WORK / "index-map.json").write_text(json.dumps(entries, indent=2))

if "--analyze" in sys.argv:
    sys.exit(0)
if unmatched:
    raise ValueError("Every index entry must resolve before creating the corrected PDF.")

SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif.ttf"
SANS_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
serif = pdf.Font(fontfile=SERIF)
INK = (0.16, 0.18, 0.19)
TEAL = (0.0471, 0.5608, 0.6275)

# Remove the individual vector dots, not titles, rules, or page numbers.
leader_count = 0
for index in (7, 8, 9):
    page = doc[index]
    original_links = page.get_links()
    for drawing in page.get_drawings():
        box = drawing["rect"]
        if 0 < box.width <= 2 and 0 < box.height <= 1 and box.x0 > 145:
            page.add_redact_annot(box + (-0.08, -0.08, 0.08, 0.08), fill=None)
            leader_count += 1
    page.apply_redactions(images=0, graphics=1, text=1)
    # Redactions can remove links overlapping the dots. Restore only missing
    # links, preserving the actual destination and clickable TOC row.
    existing = page.get_links()
    for link in original_links:
        if not any(l["from"] == link["from"] and l.get("page") == link.get("page") for l in existing):
            clean = {k: v for k, v in link.items() if k not in ("xref", "id")}
            page.insert_link(clean)

# Correct only the DSM attribution lines, keeping the surrounding notice.
page = doc[2]
rect = pdf.Rect(62.8, 233.5, 369, 275)
page.add_redact_annot(rect, fill=(1, 1, 1))
page.apply_redactions(images=0, graphics=0)
page.insert_font(fontname="ReviewNotice", fontfile=SERIF)
remaining = page.insert_textbox(
    rect, "(DSM-5-TR; American Psychiatric Association, 2022); readers\n"
    "should consult the primary source for official diagnostic criteria.",
    fontname="ReviewNotice", fontsize=9.2, lineheight=1.5, color=INK,
)
assert remaining >= 0, "Disclaimer text must fit."

# Remove the editorial instruction, retaining the existing reference prose.
page = doc[698]
for block in page.get_text("rawdict")["blocks"]:
    for line in block.get("lines", []):
        for span in line["spans"]:
            chars = span["chars"]
            text = "".join(c["c"] for c in chars)
            if text.startswith(("editions, publishers,", "updated to the chosen")):
                page.add_redact_annot(pdf.Rect(span["bbox"]), fill=(1, 1, 1))
            if text.endswith("APA style;"):
                char = chars[-1]
                page.add_redact_annot(pdf.Rect(char["bbox"]), fill=(1, 1, 1))
                period_origin = char["origin"]
page.apply_redactions(images=0, graphics=0)
page.insert_font(fontname="ReviewSerif", fontfile=SERIF)
page.insert_text(period_origin, ".", fontname="ReviewSerif", fontsize=10.5, color=INK)


def wrap(text, width, size):
    lines = []
    current = ""
    for word in text.split():
        trial = f"{current} {word}".strip()
        if current and serif.text_length(trial, fontsize=size) > width:
            lines.append(current)
            current = word
        else:
            current = trial
    if current:
        lines.append(current)
    return lines


def layout_index(lineheight):
    layout = []
    page_index, column, y = 759, 0, 120.0
    previous_letter = None
    for entry in entries:
        letter = entry["term"][0].upper()
        label = entry["term"] + ", " + ", ".join(str(i) for i in entry["targets"])
        lines = wrap(label, 150, 9.3)
        header_height = 24 if letter != previous_letter else 0
        needed = header_height + len(lines) * lineheight + 3
        if y + needed > 601:
            column += 1
            if column == 2:
                page_index += 1
                column = 0
            y = 120 if page_index == 759 else 64
        x = 81 if column == 0 else 248.4
        if letter != previous_letter:
            layout.append(("letter", page_index, x, y, letter, None))
            y += 24
        layout.append(("entry", page_index, x, y, lines, entry))
        y += len(lines) * lineheight + 3
        previous_letter = letter
    return layout, page_index


# Preserve all existing page numbers and the sixteen-page index footprint.
low, high = 10.0, 20.0
for _ in range(30):
    mid = (low + high) / 2
    _, final = layout_index(mid)
    if final > 774:
        high = mid
    else:
        low = mid
layout, final = layout_index(low)
assert final == 774, f"Index should occupy its existing 16 pages, got {final - 758}."
for index in range(759, 775):
    page = doc[index]
    page.add_redact_annot(pdf.Rect(50, 108 if index == 759 else 48, 402, 630), fill=(1, 1, 1))
    page.apply_redactions(images=0, graphics=1)
    page.insert_font(fontname="IndexSerif", fontfile=SERIF)
    page.insert_font(fontname="IndexHeading", fontfile=SANS_BOLD)
index_links = 0
for kind, index, x, y, content, entry in layout:
    page = doc[index]
    if kind == "letter":
        page.insert_text((x, y), content, fontname="IndexHeading", fontsize=11, color=TEAL)
        page.draw_line((x, y + 6), (x + 150, y + 6), color=(0.78, 0.91, 0.94), width=0.5)
    else:
        cursor = 0
        reference_start = len(" ".join(entry["term"].split())) + 2
        for offset, text in enumerate(content):
            baseline = y + offset * low
            page.insert_text((x, baseline), text, fontname="IndexSerif", fontsize=9.3, color=INK)
            term_chars = max(0, min(len(text), reference_start - cursor - 2))
            if term_chars:
                page.insert_link({
                    "kind": pdf.LINK_GOTO,
                    "from": pdf.Rect(x, baseline - 9, x + serif.text_length(text[:term_chars], fontsize=9.3), baseline + 2),
                    "page": entry["targets"][0], "to": pdf.Point(0, 55),
                })
                index_links += 1
            for number in re.finditer(r"\b\d+\b", text):
                if cursor + number.start() < reference_start:
                    continue
                x0 = x + serif.text_length(text[:number.start()], fontsize=9.3)
                x1 = x + serif.text_length(text[:number.end()], fontsize=9.3)
                page.insert_link({
                    "kind": pdf.LINK_GOTO, "from": pdf.Rect(x0, baseline - 9, x1, baseline + 2),
                    "page": int(number.group()), "to": pdf.Point(0, 55),
                })
                index_links += 1
            cursor += len(text) + 1

# The source's sidebar bookmarks all pointed to the copyright page.
# Repair destinations using actual heading text while retaining hierarchy.
toc = doc.get_toc()
fixed_toc = []
unresolved_toc = []
chapter_starts = [i for i, text in enumerate(texts) if "CHMARK_" in text]
chapter_window = None
fixed_anchors = {
    "foundations in clinical psychology": 1,
    "copyright": 1, "disclaimer and trademark notice": 2,
    "preface": 3, "how to use this book": 5, "table of contents": 7,
    "select references and further reading": 698, "glossary": 709, "index": 759,
}
for level, title, _ in toc:
    key = normalize(title)
    if level == 1:
        starts = [i for i in chapter_starts if key.replace(" ", "") in pages[i].replace(" ", "")]
        chapter_window = (starts[0], next((i for i in chapter_starts if i > starts[0]), 698)) if starts else None
    first, last = chapter_window if chapter_window else (0, 759)
    candidates = [(i, y) for i, y in headings.get(key, []) if first <= i < last]
    if not candidates:
        candidates = [
            (i, y) for heading, locations in headings.items()
            if heading.replace(" ", "") == key.replace(" ", "")
            for i, y in locations if first <= i < last
        ]
    if key in fixed_anchors and not chapter_window:
        target, y = fixed_anchors[key], 55
    elif level == 1 and chapter_window:
        target, y = first, 55
    elif candidates:
        target, y = candidates[0]
    else:
        target, y = None, 0
        for i in range(first, last):
            page_text = pages[i]
            if re.search(r"(?<!\w)" + re.escape(key) + r"(?!\w)", page_text) or key.replace(" ", "") in page_text.replace(" ", ""):
                target = i
                break
        if target is None:
            unresolved_toc.append(title)
            continue
    fixed_toc.append([level, title, target + 1, y])
if unresolved_toc:
    raise ValueError(f"Unresolved bookmarks: {unresolved_toc}")
doc.set_toc(fixed_toc)

OUT.parent.mkdir(parents=True, exist_ok=True)
doc.save(OUT, garbage=4, deflate=True)
doc.close()
corrected = pdf.open(OUT)
assert len(corrected) == 775
assert len(corrected.get_toc()) == len(toc)
assert len(set(t[2] for t in corrected.get_toc())) > 50
assert "American Psychological Association/American" not in corrected[2].get_text()
assert "publication style beforehand" not in corrected[698].get_text()
assert all("—" not in corrected[i].get_text() for i in range(759, 775))
assert sum(len(corrected[i].get_links()) for i in range(759, 775)) == index_links
for index in (7, 8, 9):
    assert normalize(corrected[index].get_text()) == normalize(texts[index]), "TOC text changed."
    assert not any(0 < d["rect"].width <= 2 and 0 < d["rect"].height <= 1 for d in corrected[index].get_drawings())
for name, index in [("contents", 7), ("contents-last", 9), ("disclaimer", 2), ("references", 698), ("index-first", 759), ("index-middle", 767), ("index-last", 774)]:
    corrected[index].get_pixmap(matrix=pdf.Matrix(1.65, 1.65)).save(WORK / f"{name}.png")
print(json.dumps({
    "output": str(OUT), "pages": len(corrected), "leader_dots_removed": leader_count,
    "index_entries": len(entries), "index_links": index_links,
    "bookmarks_repaired": len(fixed_toc), "index_line_height": low,
    "bytes": OUT.stat().st_size,
}, indent=2))