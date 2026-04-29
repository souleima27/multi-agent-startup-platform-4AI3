from __future__ import annotations

from datetime import datetime
import json
from pathlib import Path
from typing import Any

from app.models.schemas import TrackBResponse


def write_json_report(response: TrackBResponse, output_dir: Path, prefix: str) -> Path:
    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    target = output_dir / f"{prefix}_{timestamp}.json"
    target.write_text(json.dumps(response.model_dump(), indent=2, ensure_ascii=False), encoding="utf-8")
    return target


def write_pdf_report(response: TrackBResponse, output_dir: Path, prefix: str) -> Path | None:
    try:
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
        from reportlab.lib.units import mm
        from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
    except Exception:
        return None

    output_dir.mkdir(parents=True, exist_ok=True)
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    target = output_dir / f"{prefix}_{timestamp}.pdf"

    doc = SimpleDocTemplate(
        str(target),
        pagesize=A4,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
        topMargin=16 * mm,
        bottomMargin=14 * mm,
        title="Track B Legal & Administrative Report",
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "TitleStyle",
        parent=styles["Title"],
        fontName="Helvetica-Bold",
        fontSize=18,
        leading=22,
        textColor=colors.HexColor("#0F172A"),
    )
    section_style = ParagraphStyle(
        "SectionStyle",
        parent=styles["Heading2"],
        fontName="Helvetica-Bold",
        fontSize=12,
        leading=15,
        textColor=colors.HexColor("#1E3A8A"),
        spaceBefore=8,
        spaceAfter=4,
    )
    text_style = ParagraphStyle(
        "TextStyle",
        parent=styles["BodyText"],
        fontName="Helvetica",
        fontSize=9.5,
        leading=13,
        textColor=colors.HexColor("#111827"),
    )

    final = response.final_output
    story: list = []

    story.append(Paragraph("Track B - Legal & Administrative Client Report", title_style))
    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph(f"Date de generation: {datetime.now().isoformat(timespec='seconds')}", text_style))
    story.append(Paragraph("Ce document est pret a etre partage avec un client non technique.", text_style))
    story.append(Spacer(1, 5 * mm))

    story.append(Paragraph("Executive Summary", section_style))
    summary_rows = [
        ["Decision", str(final.get("go_no_go", "N/A"))],
        ["Recommended Legal Structure", str(final.get("legal_structure_recommendation", "N/A"))],
        ["Document Completeness", str(final.get("document_completeness_score", "N/A"))],
        ["Startup Label Probability", str(final.get("startup_label_probability", "N/A"))],
        ["Strict Mode", str(final.get("strict_mode", "N/A"))],
    ]
    summary_table = Table(summary_rows, colWidths=[65 * mm, 105 * mm])
    summary_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#EFF6FF")),
                ("FONTNAME", (0, 0), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 4),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
            ]
        )
    )
    story.append(summary_table)
    if final.get("user_message"):
        story.append(Spacer(1, 2 * mm))
        story.append(Paragraph(f"<b>Message utilisateur:</b> {final.get('user_message')}", text_style))
    story.append(Spacer(1, 5 * mm))

    story.append(Paragraph("Strategic Plan", section_style))
    story.append(
        Paragraph(
            f"<b>Recommended legal structure:</b> {final.get('legal_structure_recommendation', 'N/A')}<br/>"
            f"<b>Checklist steps:</b> {len(response.strategic_agent.checklist)}",
            text_style,
        )
    )
    for idx, step in enumerate(response.strategic_agent.checklist, start=1):
        story.append(
            Paragraph(
                f"{idx}. {step.title} - institution: {step.institution} - delay: {step.estimated_delay_days} days",
                text_style,
            )
        )
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("Document Diagnosis Overview", section_style))
    diagnosis_rows = [["File", "Type", "Format", "Score", "Risk", "Blocker"]]
    for doc_result in response.document_agent.documents:
        diagnosis_rows.append(
            [
                doc_result.file_name,
                doc_result.document_type,
                doc_result.source_format,
                str(doc_result.completeness_score),
                doc_result.diagnostic.risk_level if doc_result.diagnostic else "n/a",
                str(doc_result.diagnostic.legal_blocker) if doc_result.diagnostic else "False",
            ]
        )
    diagnosis_table = Table(
        diagnosis_rows,
        colWidths=[35 * mm, 28 * mm, 22 * mm, 20 * mm, 22 * mm, 20 * mm],
        repeatRows=1,
    )
    diagnosis_table.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#DBEAFE")),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 8.5),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 5),
                ("RIGHTPADDING", (0, 0), (-1, -1), 5),
            ]
        )
    )
    story.append(diagnosis_table)
    story.append(Spacer(1, 4 * mm))

    story.append(Paragraph("Detailed Diagnosis By Document", section_style))
    for doc_result in response.document_agent.documents:
        story.append(
            Paragraph(
                f"<b>{doc_result.file_name}</b> - {doc_result.document_type} ({doc_result.source_format})",
                text_style,
            )
        )
        if doc_result.diagnostic:
            story.append(
                Paragraph(
                    f"Summary: {doc_result.diagnostic.summary}<br/>"
                    f"Business impact: {doc_result.diagnostic.business_impact}<br/>"
                    f"Priority score: {doc_result.diagnostic.priority_score}",
                    text_style,
                )
            )
            if doc_result.diagnostic.recommended_actions:
                for action in doc_result.diagnostic.recommended_actions[:3]:
                    story.append(Paragraph(f"- Recommended action: {action}", text_style))
        if doc_result.issues:
            for issue in doc_result.issues:
                story.append(Paragraph(f"- Detected issue: {issue}", text_style))
        else:
            story.append(Paragraph("- Detected issue: none", text_style))
        story.append(Spacer(1, 2 * mm))

    story.append(Paragraph("Automated Action Plan", section_style))
    if response.document_agent.document_actions:
        for action in response.document_agent.document_actions:
            story.append(
                Paragraph(
                    f"- {action.file_name}: [{action.status}] {action.action_type} -> {action.details}",
                    text_style,
                )
            )
    else:
        story.append(Paragraph("No automated document-level action generated.", text_style))

    story.append(Spacer(1, 4 * mm))
    story.append(Paragraph("Strict Compliance", section_style))
    story.append(Paragraph(f"Strict fail: {response.document_agent.strict_fail}", text_style))
    if response.document_agent.strict_violations:
        for violation in response.document_agent.strict_violations:
            story.append(Paragraph(f"- {violation}", text_style))
    else:
        story.append(Paragraph("No strict violation detected.", text_style))

    correction_examples = final.get("correction_examples", {})
    if correction_examples:
        story.append(Spacer(1, 4 * mm))
        story.append(Paragraph("Correction Examples Generated", section_style))
        for file_name, path in correction_examples.items():
            story.append(Paragraph(f"- {file_name}: {path}", text_style))

    if response.final_output.get("reports"):
        story.append(Spacer(1, 4 * mm))
        story.append(Paragraph("Output Artifacts", section_style))
        reports = response.final_output.get("reports", {})
        story.append(Paragraph(f"JSON report path: {reports.get('json_report', 'N/A')}", text_style))
        story.append(Paragraph(f"PDF report path: {reports.get('pdf_report', 'N/A')}", text_style))

    doc.build(story)
    return target


def stringify_report_paths(paths: dict[str, Path | None]) -> dict[str, str]:
    result: dict[str, str] = {}
    for key, value in paths.items():
        result[key] = str(value) if value else "not_generated"
    return result
