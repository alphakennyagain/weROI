"""Export weROI logo PNG for Google Business Profile (min ~10KB)."""
from pathlib import Path

from PIL import Image, ImageDraw

OUT = Path(r"C:\Users\EverybodyHatesA1one\Documents\WEROI\frontend\public\gbp\weroi-logo-gbp.png")
SIZE = 512
BG = (255, 255, 255, 0)  # transparent
BLACK = (20, 20, 20, 255)
LIME = (200, 245, 66, 255)

img = Image.new("RGBA", (SIZE, SIZE), BG)
draw = ImageDraw.Draw(img)

pad = int(SIZE * 0.08)
radius = int(SIZE * 0.22)
draw.rounded_rectangle(
    [pad, pad, SIZE - pad, SIZE - pad],
    radius=radius,
    fill=BLACK,
)

# Chart line + dot (scaled from 32x32 SVG)
sx = (SIZE - 2 * pad) / 32
ox, oy = pad, pad

def pt(x, y):
    return ox + x * sx, oy + y * sx

line = [pt(7.5, 22.5), pt(12.5, 16.5), pt(17, 18.5), pt(24.5, 10)]
stroke = max(4, int(2.75 * sx))
draw.line(line, fill=LIME, width=stroke, joint="curve")
cx, cy = pt(24.5, 10)
r = max(3, int(2.25 * sx))
draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=LIME)

# Save with light compression so file exceeds 9.77 KB
OUT.parent.mkdir(parents=True, exist_ok=True)
img.save(OUT, format="PNG", compress_level=1)
print(f"saved {OUT} ({OUT.stat().st_size} bytes)")
