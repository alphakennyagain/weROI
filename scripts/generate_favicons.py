"""Generate favicon.ico and PNG icons from weROI growth-line mark (matches favicon.svg)."""
from pathlib import Path

from PIL import Image, ImageDraw

OUT_DIR = Path(__file__).resolve().parents[1] / "frontend" / "public"

BLACK = (20, 20, 20, 255)
LIME = (200, 245, 66, 255)


def render_icon(size: int) -> Image.Image:
    """Render the logo at `size`×`size` — black rounded card + lime growth line."""
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    sx = size / 32
    radius = max(1, round(9 * sx))
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=BLACK)

    def pt(x: float, y: float) -> tuple[float, float]:
        return x * sx, y * sx

    line = [pt(7.5, 22.5), pt(12.5, 16.5), pt(17, 18.5), pt(24.5, 10)]
    stroke = max(1, round(2.75 * sx))
    draw.line(line, fill=LIME, width=stroke, joint="curve")

    cx, cy = pt(24.5, 10)
    r = max(1, round(2.25 * sx))
    draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=LIME)

    return img


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    png_targets = {
        "logo192.png": 192,
        "logo512.png": 512,
        "apple-touch-icon.png": 180,
    }
    for name, size in png_targets.items():
        path = OUT_DIR / name
        render_icon(size).save(path, format="PNG", optimize=True)
        print(f"saved {path} ({path.stat().st_size} bytes)")

    ico_sizes = [16, 32, 48]
    ico_images = [render_icon(s) for s in ico_sizes]
    ico_path = OUT_DIR / "favicon.ico"
    # Save from largest frame; PIL embeds all listed sizes
    ico_images[-1].save(
        ico_path,
        format="ICO",
        sizes=[(s, s) for s in ico_sizes],
    )
    print(f"saved {ico_path} ({ico_path.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
