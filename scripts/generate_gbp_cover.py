"""Generate weROI Google Business Profile cover (1024x576, 16:9)."""
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

W, H = 1024, 576
LIME = (200, 245, 66)
LIME_INK = (24, 38, 4)
INK = (32, 32, 32)
MUTED = (107, 107, 107)
FROST = (245, 245, 245)
WHITE = (255, 255, 255)

OUT = Path(__file__).resolve().parent.parent / "frontend" / "public" / "gbp" / "weroi-cover-gbp.png"


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
    draw.rounded_rectangle([x, y, x + size, y + size], radius=r, fill=(20, 20, 20))
    draw.rounded_rectangle(
        [x, y, x + size, y + size],
        radius=r,
        outline=(200, 245, 66, 72),
        width=max(2, size // 32),
    )
    pad = size * 0.22
    x1, y1 = x + pad, y + size - pad
    x2, y2 = x + size * 0.38, y + size * 0.48
    x3, y3 = x + size * 0.52, y + size * 0.58
    x4, y4 = x + size - pad, y + pad + size * 0.08
    sw = max(3, size // 14)
    draw.line([(x1, y1), (x2, y2), (x3, y3), (x4, y4)], fill=LIME, width=sw, joint="curve")
    cr = max(4, size // 18)
    draw.ellipse([x4 - cr, y4 - cr, x4 + cr, y4 + cr], fill=LIME)


def main():
    img = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(img)

    for i in range(H):
        t = i / H
        c = int(FROST[0] + (WHITE[0] - FROST[0]) * (1 - t * 0.35))
        draw.line([(int(W * 0.52), i), (W, i)], fill=(c, c, c))

    draw.rectangle([0, H - 6, W, H], fill=LIME)

    mark_size = 72
    mark_x, mark_y = 56, 48
    draw_logo_mark(draw, mark_x, mark_y, mark_size)

    font_we = load_font(54, bold=False)
    font_roi = load_font(54, bold=True)
    wx = mark_x + mark_size + 20
    wy = mark_y + 4
    draw.text((wx, wy), "we", fill=INK, font=font_we)
    we_bbox = draw.textbbox((wx, wy), "we", font=font_we)
    draw.text((we_bbox[2] - 4, wy), "ROI", fill=LIME_INK, font=font_roi)

    font_h1 = load_font(48, bold=True)
    font_h2 = load_font(38, bold=True)
    draw.text((56, 168), "Digital Growth Agency", fill=INK, font=font_h1)
    h1_bbox = draw.textbbox((56, 168), "Digital Growth Agency", font=font_h1)
    draw.text((56, h1_bbox[3] + 4), "Jamaica", fill=LIME_INK, font=font_h2)

    font_tag = load_font(30, bold=True)
    font_body = load_font(22, bold=False)
    draw.text((56, 300), "We engineer revenue.", fill=INK, font=font_tag)
    tag_bbox = draw.textbbox((56, 300), "We engineer revenue.", font=font_tag)
    body = "Websites, SEO, apps & growth systems that deliver measurable ROI."
    draw.text((56, tag_bbox[3] + 12), body, fill=MUTED, font=font_body)

    chart_x = 640
    chart_y = 72
    chart_w, chart_h = 320, 400
    draw.rounded_rectangle(
        [chart_x, chart_y, chart_x + chart_w, chart_y + chart_h],
        radius=20,
        fill=FROST,
        outline=(220, 220, 220),
        width=1,
    )
    big_mark = 168
    draw_logo_mark(
        draw,
        chart_x + (chart_w - big_mark) // 2,
        chart_y + 48,
        big_mark,
    )
    draw.text(
        (chart_x + 36, chart_y + chart_h - 64),
        "Kingston, JA",
        fill=MUTED,
        font=load_font(18, bold=False),
    )
    draw.text(
        (chart_x + 36, chart_y + chart_h - 38),
        "weroi.net",
        fill=INK,
        font=load_font(20, bold=True),
    )

    OUT.parent.mkdir(parents=True, exist_ok=True)
    img.save(OUT, "PNG", compress_level=6)
    print(f"Saved {OUT} ({W}x{H}, {OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
