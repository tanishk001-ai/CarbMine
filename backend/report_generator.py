"""
CarbMine — PDF Sustainability Report Generator
Uses reportlab to produce structured emission reports.
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
import io
from datetime import datetime


def generate_pdf_report(data: dict) -> bytes:
    """
    Generate a PDF emission report from calculation results.

    Args:
        data: dict with keys — company_name, mine_name, period,
              scope1, scope2, scope3, total_co2e_tonnes

    Returns:
        PDF as bytes
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=2.5 * cm,
        bottomMargin=2 * cm,
    )

    styles = getSampleStyleSheet()
    green = colors.HexColor("#2d6a4f")
    light_green = colors.HexColor("#d8f3dc")

    title_style = ParagraphStyle(
        "Title", parent=styles["Title"],
        textColor=green, fontSize=20, spaceAfter=6, alignment=TA_CENTER
    )
    heading_style = ParagraphStyle(
        "Heading", parent=styles["Heading2"],
        textColor=green, fontSize=13, spaceBefore=14, spaceAfter=4
    )
    body_style = ParagraphStyle(
        "Body", parent=styles["Normal"], fontSize=10, spaceAfter=4
    )

    story = []

    # ── Header ──────────────────────────────────────────────────
    story.append(Paragraph("🌿 CarbMine", title_style))
    story.append(Paragraph("Carbon Footprint Assessment Report", styles["Heading2"]))
    story.append(HRFlowable(width="100%", thickness=1.5, color=green))
    story.append(Spacer(1, 0.4 * cm))

    meta = [
        ["Company", data.get("company_name", "—")],
        ["Mine / Site", data.get("mine_name", "—")],
        ["Reporting Period", data.get("period", "—")],
        ["Generated On", datetime.now().strftime("%d %B %Y, %H:%M")],
    ]
    meta_table = Table(meta, colWidths=[5 * cm, 11 * cm])
    meta_table.setStyle(TableStyle([
        ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
        ("ROWBACKGROUNDS", (0, 0), (-1, -1), [colors.white, light_green]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 0.6 * cm))

    # ── Emission Summary ─────────────────────────────────────────
    story.append(Paragraph("Emission Summary", heading_style))

    scope1 = data.get("scope1", {})
    scope2 = data.get("scope2", {})
    scope3 = data.get("scope3", {})
    total = data.get("total_co2e_tonnes", 0)

    summary_data = [
        ["Scope", "Category", "Tonnes CO₂e"],
        ["Scope 1", "Direct (mining operations)", str(round(scope1.get("total", 0), 2))],
        ["Scope 2", "Indirect (electricity)", str(round(scope2.get("total", 0), 2))],
        ["Scope 3", "Value chain (transport + combustion)", str(round(scope3.get("total", 0), 2))],
        ["TOTAL", "", str(round(total, 2))],
    ]
    summary_table = Table(summary_data, colWidths=[3.5 * cm, 9 * cm, 3.5 * cm])
    summary_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), green),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("BACKGROUND", (0, -1), (-1, -1), light_green),
        ("ROWBACKGROUNDS", (0, 1), (-1, -2), [colors.white, colors.HexColor("#f0f4f8")]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ("ALIGN", (2, 0), (2, -1), "RIGHT"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(summary_table)
    story.append(Spacer(1, 0.6 * cm))

    # ── Scope 1 Breakdown ────────────────────────────────────────
    story.append(Paragraph("Scope 1 — Direct Emissions Breakdown", heading_style))
    s1_rows = [["Source", "Tonnes CO₂e"]]
    for key, label in [
        ("fugitive_methane_extraction", "Fugitive Methane (extraction)"),
        ("fugitive_methane_venting", "Fugitive Methane (venting)"),
        ("diesel_combustion", "Diesel Combustion"),
        ("explosives", "Explosives (ANFO)"),
    ]:
        s1_rows.append([label, str(round(scope1.get(key, 0), 4))])
    _add_simple_table(story, s1_rows, green, light_green)

    # ── Footer ───────────────────────────────────────────────────
    story.append(Spacer(1, 1 * cm))
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.lightgrey))
    story.append(Paragraph(
        "Emission factors sourced from IPCC AR6, MoEF&CC India, and CEA Grid Emission Factors 2022-23. "
        "This report was generated by CarbMine v1.0.",
        ParagraphStyle("Footer", parent=body_style, fontSize=8, textColor=colors.grey)
    ))

    doc.build(story)
    return buffer.getvalue()


def _add_simple_table(story, rows, header_color, alt_color):
    t = Table(rows, colWidths=[12 * cm, 4 * cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), header_color),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, alt_color]),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.lightgrey),
        ("ALIGN", (1, 0), (1, -1), "RIGHT"),
        ("FONTSIZE", (0, 0), (-1, -1), 10),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    story.append(t)
    story.append(Spacer(1, 0.4 * cm))
