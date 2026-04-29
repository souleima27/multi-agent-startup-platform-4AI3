from __future__ import annotations

from pathlib import Path

from app.models.schemas import DocumentOpsResult


def _template_for_type(document_type: str) -> str:
    templates = {
        "statuts": (
            "STATUTS - VERSION CORRIGEE (EXEMPLE)\n"
            "1) Denomination sociale\n"
            "2) Siege social\n"
            "3) Objet social\n"
            "4) Capital social et repartition\n"
            "5) Gerance / administration\n"
            "6) Clauses de cession\n"
            "7) Signatures des parties\n"
            "8) Cachet si requis\n"
        ),
        "rc": (
            "REGISTRE DE COMMERCE - VERSION CORRIGEE (EXEMPLE)\n"
            "- Numero RC\n"
            "- Date d'immatriculation\n"
            "- Identite de la societe\n"
            "- Signature / validation officielle\n"
        ),
        "if": (
            "IDENTIFICATION FISCALE - VERSION CORRIGEE (EXEMPLE)\n"
            "- Matricule fiscal\n"
            "- Denomination\n"
            "- Adresse fiscale\n"
            "- Cachet/validation administration\n"
        ),
        "attestation_bancaire": (
            "ATTESTATION BANCAIRE - VERSION CORRIGEE (EXEMPLE)\n"
            "- Banque\n"
            "- Titulaire\n"
            "- Montant bloque/depose\n"
            "- Date\n"
            "- Signature et cachet banque\n"
        ),
        "cin": (
            "CIN - VERSION CORRIGEE (EXEMPLE)\n"
            "- Recto/verso lisibles\n"
            "- Identite complete\n"
            "- Date de validite\n"
        ),
    }
    return templates.get(
        document_type,
        "DOCUMENT - VERSION CORRIGEE (EXEMPLE)\n- Ajouter les champs obligatoires\n- Fournir version lisible\n- Signature/cachet si requis\n",
    )


def generate_correction_examples(result: DocumentOpsResult, output_dir: Path) -> dict[str, str]:
    output_dir.mkdir(parents=True, exist_ok=True)
    generated: dict[str, str] = {}

    for doc in result.documents:
        is_blocker = bool(doc.diagnostic and doc.diagnostic.legal_blocker)
        has_issues = len(doc.issues) > 0
        if not is_blocker and not has_issues:
            continue

        target = output_dir / f"correction_example_{doc.file_name}.md"
        lines = [
            f"# Exemple de correction - {doc.file_name}",
            "",
            f"Type detecte: {doc.document_type}",
            f"Format source: {doc.source_format}",
            f"Score de completude: {doc.completeness_score}",
            "",
            "## Problemes detectes",
        ]

        if doc.issues:
            lines.extend(f"- {issue}" for issue in doc.issues)
        else:
            lines.append("- Aucun probleme explicite, correction preventive.")

        lines.extend(["", "## Actions recommandees"])
        if doc.diagnostic and doc.diagnostic.recommended_actions:
            lines.extend(f"- {act}" for act in doc.diagnostic.recommended_actions)
        else:
            lines.append("- Produire une version propre et officiellement validee.")

        lines.extend(["", "## Modele de document corrige (exemple)", "```text", _template_for_type(doc.document_type), "```"])
        target.write_text("\n".join(lines), encoding="utf-8")
        generated[doc.file_name] = str(target)

    return generated
