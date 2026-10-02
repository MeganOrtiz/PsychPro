"""Read-only sample review of the uploaded textbook; never modifies the PDF."""
import json
import sys
from pathlib import Path

# The package tool prepared PyMuPDF but couldn't install into Nix's read-only
# Python directory. Use that already-prepared wheel without changing the app.
try:
    import fitz
except ModuleNotFoundError:
    cached = next(Path(".cache/uv/archive-v0").glob("*/pymupdf/__init__.py"))
    sys.path.insert(0, str(cached.parent.parent))
    import fitz

source = Path(
    "attached_assets/PsychPro_Foundations_in_Clinical_Psychology_Volume_1_1790923615062.pdf"
)
output = Path(".agents/outputs/textbook-review")
output.mkdir(parents=True, exist_ok=True)
doc = fitz.open(source)
print(json.dumps({
    "pages": len(doc),
    "bytes": source.stat().st_size,
    "bookmarks": len(doc.get_toc()),
    "links": sum(len(page.get_links()) for page in doc),
    "metadata": doc.metadata,
}, indent=2))

text = [page.get_text() for page in doc]
interesting = {}
for label, needle in [
    ("chapter-one", "CHMARK_1_START"),
    ("psychometrics", "CHMARK_21_START"),
    ("research", "CHMARK_30_START"),
    ("references", "Select References and Further Reading"),
    ("glossary", "Glossary\n"),
    ("index", "Index\n"),
]:
    hits = [i for i, content in enumerate(text) if needle in content]
    print(label, "PDF pages", [i + 1 for i in hits])
    if hits:
        interesting[label] = hits[-1] if label == "glossary" else hits[0]

samples = {
    "title": 0,
    "copyright": 1,
    "contents": 7,
    "chapter-one": interesting["chapter-one"],
    "body": interesting["chapter-one"] + 4,
    "psychometrics": interesting["psychometrics"] + 2,
    "references": interesting["references"],
    "index": len(doc) - 2,
}
for label, index in samples.items():
    page = doc[index]
    page.get_pixmap(matrix=fitz.Matrix(1.65, 1.65)).save(output / f"{label}.png")
    print(f"\n--- {label}, PDF page {index + 1} ---\n{text[index][:6000]}")

markers = []
for i, page in enumerate(doc):
    if "CHMARK_" not in text[i]:
        continue
    for block in page.get_text("dict")["blocks"]:
        for line in block.get("lines", []):
            for span in line["spans"]:
                if "CHMARK_" in span["text"]:
                    markers.append({
                        "page": i + 1,
                        "text": span["text"],
                        "color": span["color"],
                        "size": span["size"],
                    })
print("CHAPTER MARKERS", json.dumps(markers[:3]))
print("TOTAL CHAPTER MARKERS", len(markers))