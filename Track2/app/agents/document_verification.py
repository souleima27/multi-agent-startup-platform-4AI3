from __future__ import annotations

from pathlib import Path
from statistics import mean
from app.models.schemas import DocumentItem, DocumentVerificationItemResult, DocumentVerificationResult
from app.utils.vision import (
    detect_blue_signature,
    detect_red_stamp,
    estimate_quality,
    lightweight_text_extraction,
    load_ground_truth_if_exists,
    load_image,
)


class DocumentVerificationAgent:
    name = "B2_DocumentVerificationAgent"

    REQUIRED_FIELDS_BY_TYPE = {
        "statuts": ["signature", "stamp"],
        "rc": ["signature"],
        "if": ["stamp"],
        "cin": [],
        "attestation_bancaire": ["signature", "stamp"],
    }

    def _infer_document_type(self, declared_type: str | None, ground_truth: dict | None, file_name: str) -> str:
        if declared_type:
            return declared_type
        if ground_truth and ground_truth.get("document_type"):
            return str(ground_truth["document_type"])
        lower = file_name.lower()
        for key in ["statuts", "rc", "if", "cin", "attestation_bancaire"]:
            if key in lower:
                return key
        return "unknown"

    def _verify_one(self, item: DocumentItem) -> DocumentVerificationItemResult:
        image = load_image(item.path)
        gt = load_ground_truth_if_exists(item.path)
        file_name = Path(item.path).name
        document_type = self._infer_document_type(item.declared_type, gt, file_name)

        signature_present = detect_blue_signature(image)
        stamp_present = detect_red_stamp(image)
        quality = estimate_quality(image)
        text_preview = lightweight_text_extraction(image)

        issues: list[str] = []
        completeness = 100.0
        required = self.REQUIRED_FIELDS_BY_TYPE.get(document_type, [])

        if "signature" in required and not signature_present:
            issues.append("Missing signature.")
            completeness -= 30
        if "stamp" in required and not stamp_present:
            issues.append("Missing stamp.")
            completeness -= 30
        if quality == "blurred":
            issues.append("Image quality is blurred.")
            completeness -= 15
        elif quality == "unreadable":
            issues.append("Image quality is unreadable.")
            completeness -= 35

        is_valid = len(issues) == 0
        completeness = max(0.0, completeness)

        return DocumentVerificationItemResult(
            file_name=file_name,
            document_type=document_type,
            signature_present=signature_present,
            stamp_present=stamp_present,
            quality=quality,
            completeness_score=completeness,
            issues=issues,
            is_valid=is_valid,
            extracted_text_preview=text_preview,
            ground_truth=gt,
        )

    def run(self, documents: list[DocumentItem]) -> DocumentVerificationResult:
        if not documents:
            return DocumentVerificationResult(documents=[], overall_completeness_score=0.0, cross_document_issues=["No documents uploaded."])

        results = [self._verify_one(d) for d in documents]
        types = [r.document_type for r in results]
        cross_issues: list[str] = []

        if len(types) != len(set(types)):
            cross_issues.append("Duplicate document types detected.")
        if "statuts" in types and "rc" not in types:
            cross_issues.append("Statuts provided without RC document.")

        overall = mean(r.completeness_score for r in results)
        return DocumentVerificationResult(
            documents=results,
            overall_completeness_score=round(overall, 2),
            cross_document_issues=cross_issues,
        )
