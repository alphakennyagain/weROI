"""Generate weROI Open Graph image (1200x630) — light mode, on-brand."""
from PIL import Image, ImageDraw, ImageFont
import os

W, H = 1200, 630
LIME = (200, 245, 66)
LIME_INK = (24, 38, 4)
INK = (32, 32, 32)
MUTED = (107, 107, 107)
FROST = (245, 245, 245)
WHITE = (255, 255, 255)

OUT = os.path.join(os.path.dirname(__file__), "..", "frontend", "public", "og-image.png")


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
    """Dark rounded card with lime growth line (matches site logo)."""
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

    # Soft frost band on the right
    for i in range(H):
        t = i / H
        c = int(FROST[0] + (WHITE[0] - FROST[0]) * (1 - t * 0.35))
        draw.line([(W * 0.55, i), (W, i)], fill=(c, c, c))

    # Subtle lime accent bar at bottom
    draw.rectangle([0, H - 8, W, H], fill=LIME)

    # Logo mark
    mark_size = 96
    mark_x, mark_y = 80, 80
    draw_logo_mark(draw, mark_x, mark_y, mark_size)

    # Wordmark: weROI
    font_we = load_font(72, bold=False)
    font_roi = load_font(72, bold=True)
    wx = mark_x + mark_size + 28
    wy = mark_y + 8
    draw.text((wx, wy), "we", fill=INK, font=font_we)
    we_bbox = draw.textbbox((wx, wy), "we", font=font_we)
    draw.text((we_bbox[2] - 4, wy), "ROI", fill=LIME_INK, font=font_roi)

    # Headline
    headline = "Digital Growth Agency"
    subhead = "Jamaica"
    font_h1 = load_font(64, bold=True)
    font_h2 = load_font(52, bold=True)
    draw.text((80, 230), headline, fill=INK, font=font_h1)
    h1_bbox = draw.textbbox((80, 230), headline, font=font_h1)
    draw.text((80, h1_bbox[3] + 8), subhead, fill=LIME_INK, font=font_h2)

    # Tagline
    tagline = "We engineer revenue."
    body = "Websites, SEO, apps & growth systems\nthat deliver measurable ROI."
    font_tag = load_font(36, bold=True)
    font_body = load_font(28, bold=False)
    draw.text((80, 400), tagline, fill=INK, font=font_tag)
    tag_bbox = draw.textbbox((80, 400), tagline, font=font_tag)
    draw.multiline_text((80, tag_bbox[3] + 16), body, fill=MUTED, font=font_body, spacing=8)

    # Right-side decorative chart (large, subtle)
    chart_x = 780
    chart_y = 120
    chart_w, chart_h = 340, 380
    draw.rounded_rectangle(
        [chart_x, chart_y, chart_x + chart_w, chart_y + chart_h],
        radius=24,
        fill=FROST,
        outline=(32, 32, 32, 25),
        width=1,
    )
    big_mark = 200
    draw_logo_mark(draw, chart_x + (chart_w - big_mark) // 2, chart_y + 60, big_mark)
    draw.text(
        (chart_x + 40, chart_y + chart_h - 72),
        "Kingston, JA",
        fill=MUTED,
        font=load_font(22, bold=False),
    )
    draw.text(
        (chart_x + 40, chart_y + chart_h - 42),
        "weroi.net",
        fill=INK,
        font=load_font(24, bold=True),
    )

    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    img.save(OUT, "PNG", optimize=True)
    print(f"Saved {OUT} ({W}x{H})")


if __name__ == "__main__":
    main()
