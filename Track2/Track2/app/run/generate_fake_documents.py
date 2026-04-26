from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import date
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


@dataclass
class FakeDocTemplate:
    doc_type: str
    title: str
    body_lines: list[str]


def _safe_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    try:
        return ImageFont.truetype("arial.ttf", size)
    except Exception:
        return ImageFont.load_default()


def _templates() -> list[FakeDocTemplate]:
    today = date.today().isoformat()
    return [
        FakeDocTemplate(
            doc_type="statuts",
            title="STATUTS DE SOCIETE - DOCUMENT FICTIF",
            body_lines=[
                "Societe: NovaLegal Labs (fictif)",
                "Forme: SARL",
                "Capital social: 50 000 TND",
                "Associes: 3",
                "Objet: Plateforme SaaS de legal tech",
                "Date de signature: " + today,
                "Article 1: Denomination",
                "Article 2: Objet social",
                "Article 3: Siege social",
                "Article 4: Repartition des parts",
                "Article 5: Gouvernance",
                "Ce document est genere pour des tests techniques uniquement.",
            ],
        ),
        FakeDocTemplate(
            doc_type="rc",
            title="EXTRAIT REGISTRE DE COMMERCE - DOCUMENT FICTIF",
            body_lines=[
                "Societe: NovaLegal Labs (fictif)",
                "Numero RC: RC-2026-000999",
                "Tribunal: Tunis 1",
                "Date immatriculation: " + today,
                "Activite: Edition de logiciels",
                "Adresse: 10 Rue Exemple, Tunis",
                "Gerant: Youssef Ben Test",
                "Ce document est genere pour des tests techniques uniquement.",
            ],
        ),
        FakeDocTemplate(
            doc_type="if",
            title="ATTESTATION IDENTIFIANT FISCAL - DOCUMENT FICTIF",
            body_lines=[
                "Contribuable: NovaLegal Labs (fictif)",
                "Identifiant fiscal: IF-2026-778899",
                "Centre fiscal: Tunis Centre",
                "Date attribution: " + today,
                "Regime fiscal: IS",
                "Ce document est genere pour des tests techniques uniquement.",
            ],
        ),
        FakeDocTemplate(
            doc_type="attestation_bancaire",
            title="ATTESTATION BANCAIRE - DOCUMENT FICTIF",
            body_lines=[
                "Banque: Banque Exemple Tunisie",
                "Titulaire: NovaLegal Labs (fictif)",
                "Compte bloque: OUI",
                "Montant depot: 50 000 TND",
                "Date attestation: " + today,
                "Reference dossier: BANK-AT-2026-1234",
                "Ce document est genere pour des tests techniques uniquement.",
            ],
        ),
        FakeDocTemplate(
            doc_type="cin",
            title="CARTE D'IDENTITE NATIONALE - DOCUMENT FICTIF",
            body_lines=[
                "Nom: BEN TEST",
                "Prenom: AMIRA",
                "Numero CIN: 12345678",
                "Date de naissance: 1995-05-14",
                "Lieu de naissance: Tunis",
                "Date de delivrance: " + today,
                "Autorite: Ministere de l'Interieur",
                "Ce document est genere pour des tests techniques uniquement.",
            ],
        ),
    ]


def _write_pdf(path: Path, template: FakeDocTemplate) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    c = canvas.Canvas(str(path), pagesize=A4)
    width, height = A4

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, height - 60, template.title)

    c.setFont("Helvetica", 11)
    y = height - 100
    for line in template.body_lines:
        c.drawString(50, y, line)
        y -= 18

    c.setStrokeColorRGB(0.0, 0.2, 0.7)
    c.line(70, 150, 250, 130)
    c.line(250, 130, 380, 145)
    c.drawString(50, 110, "Signature fictive")

    c.setStrokeColorRGB(0.8, 0.0, 0.0)
    c.circle(470, 130, 35)
    c.drawString(430, 85, "Cachet fictif")

    c.showPage()
    c.save()


def _write_scan_image(path: Path, template: FakeDocTemplate) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    w, h = 1654, 2339
    image = Image.new("RGB", (w, h), "white")
    draw = ImageDraw.Draw(image)

    title_font = _safe_font(54)
    body_font = _safe_font(32)

    draw.text((80, 90), template.title, fill=(15, 15, 15), font=title_font)

    y = 210
    for line in template.body_lines:
        draw.text((100, y), line, fill=(20, 20, 20), font=body_font)
        y += 58

    # Blue signature strokes
    draw.line((140, 1980, 450, 1940), fill=(30, 70, 200), width=8)
    draw.line((450, 1940, 730, 1965), fill=(35, 80, 210), width=8)
    draw.text((100, 2015), "Signature fictive", fill=(40, 40, 40), font=body_font)

    # Red stamp ring
    draw.ellipse((1180, 1860, 1500, 2180), outline=(190, 25, 20), width=12)
    draw.text((1200, 2200), "Cachet fictif", fill=(40, 40, 40), font=body_font)

    array = np.array(image)

    # Apply light scan artifacts: blur + gaussian noise + jpeg compression roundtrip
    blurred = cv2.GaussianBlur(array, (3, 3), 0)
    noise = np.random.normal(0, 6, blurred.shape).astype(np.int16)
    noisy = np.clip(blurred.astype(np.int16) + noise, 0, 255).astype(np.uint8)

    ok, encoded = cv2.imencode(".jpg", noisy, [int(cv2.IMWRITE_JPEG_QUALITY), 86])
    if ok:
        noisy = cv2.imdecode(encoded, cv2.IMREAD_COLOR)

    cv2.imwrite(str(path), noisy)


def _write_pitch_deck(pdf_path: Path, outline_path: Path) -> None:
    pdf_path.parent.mkdir(parents=True, exist_ok=True)

    slides = [
        {
            "title": "NovaLegal Labs",
            "subtitle": "AI legal-admin automation for startups",
            "bullets": [
                "Problem: startup legal setup is slow, fragmented, and error-prone.",
                "Solution: AI agents validate documents and produce client-ready reports.",
                "Target: Tunisian startups, incubators, and legal advisors.",
            ],
        },
        {
            "title": "The Problem",
            "subtitle": "Legal and administrative setup creates friction",
            "bullets": [
                "Manual checks take time and create avoidable errors.",
                "Founders do not know which document blocks filing.",
                "Advisors spend time re-reading the same evidence across packs.",
            ],
        },
        {
            "title": "Our Solution",
            "subtitle": "Two-agent workflow with OCR and legal validation",
            "bullets": [
                "A1 recommends legal form, Startup Act path, and label strategy.",
                "A2 inspects each document, detects blockers, and suggests fixes.",
                "Outputs: JSON report, PDF report, corrections, and clear next steps.",
            ],
        },
        {
            "title": "Why Now",
            "subtitle": "Compliance automation is ready for practical deployment",
            "bullets": [
                "OCR and local LLMs enable practical automation on-premise.",
                "Startups need faster validation for setup and investment readiness.",
                "Institutions and advisors need cleaner decision support artifacts.",
            ],
        },
        {
            "title": "Traction and Next Steps",
            "subtitle": "Prototype validated on synthetic and real document packs",
            "bullets": [
                "OCR active on generated scan packs.",
                "Strict mode, date checks, mandatory fields, and associate structure checks are in place.",
                "Next: richer regulation rules, stronger pitch scoring, and production hardening.",
            ],
        },
    ]

    outline_lines: list[str] = []
    c = canvas.Canvas(str(pdf_path), pagesize=A4)
    width, height = A4

    for index, slide in enumerate(slides, start=1):
        outline_lines.append(f"Slide {index}: {slide['title']} - {slide['subtitle']}")

        c.setFillColorRGB(0.08, 0.09, 0.12)
        c.rect(0, 0, width, height, fill=1, stroke=0)

        c.setFillColorRGB(1, 1, 1)
        c.setFont("Helvetica-Bold", 26)
        c.drawString(50, height - 70, slide["title"])

        c.setFont("Helvetica", 14)
        c.setFillColorRGB(0.7, 0.85, 1)
        c.drawString(50, height - 100, slide["subtitle"])

        c.setFillColorRGB(1, 1, 1)
        y = height - 160
        for bullet in slide["bullets"]:
            c.circle(60, y + 5, 2, fill=1, stroke=0)
            text = c.beginText(75, y)
            text.setFont("Helvetica", 13)
            text.textLines(bullet)
            c.drawText(text)
            y -= 56

        c.setFont("Helvetica-Oblique", 10)
        c.setFillColorRGB(0.75, 0.75, 0.75)
        c.drawRightString(width - 40, 30, f"Synthetic pitch deck - slide {index}")
        c.showPage()

    c.save()
    outline_path.write_text("\n".join(outline_lines), encoding="utf-8")


def _build_request_json(scan_paths: list[Path], output_path: Path) -> None:
    payload = {
        "startup_profile": {
            "startup_name": "NovaLegal Labs",
            "sector": "AI SaaS",
            "activity_description": "Fictitious startup for legal-admin pipeline testing.",
            "founders_count": 3,
            "funding_need_tnd": 200000,
            "wants_investors": True,
            "needs_limited_liability": True,
            "has_foreign_investors": False,
            "innovative": True,
            "scalable": True,
            "uses_technology": True,
            "associates": [
                {"name": "Amira Ben Test", "role": "CEO", "equity_pct": 40.0},
                {"name": "Youssef Ben Test", "role": "CTO", "equity_pct": 35.0},
                {"name": "Nadia Ben Test", "role": "COO", "equity_pct": 25.0},
            ],
            "pitch_notes": [
                "Problem: legal setup is slow and fragmented for startups.",
                "Solution: AI agents automate legal-admin validation and reporting.",
                "Market: Tunisian startups and incubators.",
                "Proof: OCR pipeline, rule checks, and client-ready reports.",
            ],
        },
        "documents": [{"path": str(p.resolve())} for p in scan_paths],
        "options": {
            "strict_mode": True,
            "generate_json_report": True,
            "generate_pdf_report": True,
            "report_prefix": "synthetic_packet",
        },
    }
    output_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")


def main() -> None:
    root = Path(__file__).resolve().parents[2]
    out_root = root / "data" / "synthetic_docs"
    scans_dir = out_root / "scans"
    pdf_dir = out_root / "pdf"
    pitch_dir = out_root / "pitch_deck"

    scan_paths: list[Path] = []

    for idx, template in enumerate(_templates(), start=1):
        stem = f"fake_{idx:02d}_{template.doc_type}"
        pdf_path = pdf_dir / f"{stem}.pdf"
        scan_path = scans_dir / f"{stem}.png"

        _write_pdf(pdf_path, template)
        _write_scan_image(scan_path, template)
        scan_paths.append(scan_path)

    request_path = root / "request_synthetic.json"
    _build_request_json(scan_paths, request_path)

    pitch_pdf = pitch_dir / "fake_pitch_deck.pdf"
    pitch_outline = pitch_dir / "fake_pitch_deck_outline.txt"
    _write_pitch_deck(pitch_pdf, pitch_outline)

    print("Synthetic documents generated:")
    print(f"- PDF folder: {pdf_dir}")
    print(f"- Scan folder: {scans_dir}")
    print(f"- Pitch deck: {pitch_pdf}")
    print(f"- Request file: {request_path}")


if __name__ == "__main__":
    main()
