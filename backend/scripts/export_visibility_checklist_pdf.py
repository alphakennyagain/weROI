"""Export the visibility checklist PDF to frontend/public for static hosting."""

from pathlib import Path
import sys

BACKEND_DIR = Path(__file__).resolve().parents[1]
ROOT = BACKEND_DIR.parent
sys.path.insert(0, str(BACKEND_DIR))

from checklist_pdf import build_visibility_checklist_pdf  # noqa: E402

OUT = ROOT / "frontend" / "public" / "downloads" / "weROI-Visibility-Checklist.pdf"


def main() -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_bytes(build_visibility_checklist_pdf())
    print(f"Wrote {OUT}")


if __name__ == "__main__":
    main()
