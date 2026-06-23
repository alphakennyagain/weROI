"""Logo-focused Google Business Profile cover banner (1024x576)."""
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1024, 576
LIME = (200, 245, 66)
LIME_INK = (24, 38, 4)
INK = (32, 32, 32)
MUTED = (120, 120, 120)
WHITE = (255, 255, 255)
BLACK = (20, 20, 20)

OUT = Path(__file__).resolve().parent.parent / "frontend" / "public" / "gbp" / "weroi-cover-logo-gbp.png"


def load_font(size, bold=False):
    candidates = [
        "C:/Windows/Fonts/segoeuib.ttf" if bold else "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            return ImageFont.truetype(path, size)
    return ImageFont.load_default()


def draw_logo_mark(draw, x, y, size):
    r = int(size * 0.28)
    draw.rounded_rectangle([x, y, x + size, y + size], radius=r, fill=BLACK)
    draw.rounded_rectangle(
        [x, y, x + size, y + size],
        radius=r,
        outline=(200, 245, 66, 90),
        width=max(3, size // 28),
    )
    pad = size * 0.22
    x1, y1 = x + pad, y + size - pad
    x2, y2 = x + size * 0.38, y + size * 0.48
    x3, y3 = x + size * 0.52, y + size * 0.58
    x4, y4 = x + size - pad, y + pad + size * 0.08
    sw = max(4, size // 12)
    draw.line([(x1, y1), (x2, y2), (x3, y3), (x4, y4)], fill=LIME, width=sw, joint="curve")
    cr = max(5, size // 16)
    draw.ellipse([x4 - cr, y4 - cr, x4 + cr, y4 + cr], fill=LIME)


def main():
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    # Subtle lime wash left to right
    for x in range(W):
        t = x / W
        g = int(255 - (255 - 248) * (1 - t) * 0.4)
        b = int(255 - (255 - 242) * (1 - t) * 0.5)
        draw.line([(x, 0), (x, H)], fill=(g, 255, b))

    # Bottom accent bar
    draw.rectangle([0, H - 10, W, H], fill=LIME)

    # Large centered logo lockup
    mark_size = 200
    font_we = load_font(118, bold=False)
    font_roi = load_font(118, bold=True)
    font_sub = load_font(28, bold=False)

    we_text = "we"
    roi_text = "ROI"
    we_bbox = draw.textbbox((0, 0), we_text, font=font_we)
    roi_bbox = draw.textbbox((0, 0), roi_text, font=font_roi)
    word_w = (we_bbox[2] - we_bbox[0]) + (roi_bbox[2] - roi_bbox[0]) - 6
    gap = 36
    total_w = mark_size + gap + word_w

    sub_text = "Digital Growth Agency  ·  Kingston, Jamaica"
    sub_bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
    sub_w = sub_bbox[2] - sub_bbox[0]

    block_w = max(total_w, sub_w)
    start_x = (W - block_w) // 2
    mark_y = (H - 10 - mark_size) // 2 - 24
    mark_x = start_x + (block_w - total_w) // 2

    draw_logo_mark(draw, mark_x, mark_y, mark_size)

    wx = mark_x + mark_size + gap
    wy = mark_y + (mark_size - (we_bbox[3] - we_bbox[1])) // 2 - 4
    draw.text((wx, wy), we_text, fill=INK, font=font_we)
    draw.text((wx + we_bbox[2] - we_bbox[0] - 6, wy), roi_text, fill=LIME_INK, font=font_roi)

    sub_x = (W - sub_w) // 2
    sub_y = mark_y + mark_size + 36
    draw.text((sub_x, sub_y), sub_text, fill=MUTED, font=font_sub)

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG", compress_level=6)
    print(f"Saved {OUT} ({W}x{H}, {OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
