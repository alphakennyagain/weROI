"""Generate the branded weROI visibility checklist PDF."""

from __future__ import annotations

from io import BytesIO

from fpdf import FPDF

from visibility_checklist_content import (
    VISIBILITY_CHECKLIST_CLOSING,
    VISIBILITY_CHECKLIST_INTRO,
    VISIBILITY_CHECKLIST_ITEMS,
    VISIBILITY_CHECKLIST_TITLE,
)

LIME = (200, 245, 66)
DARK = (17, 17, 19)
MUTED = (102, 102, 102)
PAPER = (245, 245, 240)


class VisibilityChecklistPDF(FPDF):
    def header(self):
        self.set_fill_color(*DARK)
        self.rect(0, 0, 210, 36, "F")
        self.set_fill_color(*LIME)
        self.rect(0, 36, 210, 2, "F")
        self.set_text_color(*LIME)
        self.set_font("Helvetica", "B", 11)
        self.set_xy(14, 10)
        self.cell(0, 6, "weROI", ln=True)
        self.set_text_color(255, 255, 255)
        self.set_font("Helvetica", "B", 16)
        self.set_x(14)
        self.cell(0, 8, VISIBILITY_CHECKLIST_TITLE, ln=True)
        self.set_font("Helvetica", "", 9)
        self.set_text_color(210, 210, 210)
        self.set_x(14)
        self.cell(0, 5, "Free visibility checklist  |  weroi.net", ln=True)
        self.ln(14)

    def footer(self):
        self.set_y(-18)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(*MUTED)
        self.cell(0, 5, "weROI  |  Engineered for Growth  |  weroi.net/growth-preview", align="C")


def build_visibility_checklist_pdf() -> bytes:
    pdf = VisibilityChecklistPDF()
    pdf.set_auto_page_break(auto=True, margin=22)
    pdf.add_page()
    pdf.set_left_margin(14)
    pdf.set_right_margin(14)

    pdf.set_font("Helvetica", "", 11)
    pdf.set_text_color(50, 50, 50)
    pdf.multi_cell(0, 6, VISIBILITY_CHECKLIST_INTRO)
    pdf.ln(4)

    for index, (title, body) in enumerate(VISIBILITY_CHECKLIST_ITEMS, 1):
        if pdf.get_y() > 250:
            pdf.add_page()

        y = pdf.get_y()
        pdf.set_fill_color(*PAPER)
        pdf.set_draw_color(220, 220, 220)
        pdf.rect(14, y, 182, 34, style="DF")

        pdf.set_xy(18, y + 5)
        pdf.set_fill_color(*DARK)
        pdf.set_text_color(*LIME)
        pdf.set_font("Helvetica", "B", 10)
        pdf.cell(10, 8, str(index), align="C", fill=True)

        pdf.set_xy(30, y + 5)
        pdf.set_text_color(*DARK)
        pdf.set_font("Helvetica", "B", 11)
        pdf.multi_cell(160, 5, title)

        pdf.set_xy(30, pdf.get_y() + 1)
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(70, 70, 70)
        pdf.multi_cell(160, 5, body)
        pdf.ln(8)

    pdf.ln(2)
    pdf.set_font("Helvetica", "B", 11)
    pdf.set_text_color(*DARK)
    pdf.multi_cell(0, 6, VISIBILITY_CHECKLIST_CLOSING)
    pdf.ln(3)
    pdf.set_font("Helvetica", "", 10)
    pdf.set_text_color(70, 70, 70)
    pdf.multi_cell(
        0,
        5,
        "Want the full picture? Get your free personalized weROI GrowthIQ score at weroi.net/growth-preview. "
        "Takes 3-5 minutes. No sales call unless you ask for one.",
    )

    out = pdf.output(dest="S")
    if isinstance(out, str):
        return out.encode("latin-1")
    return bytes(out)


def build_visibility_checklist_pdf_buffer() -> BytesIO:
    buf = BytesIO(build_visibility_checklist_pdf())
    buf.seek(0)
    return buf
