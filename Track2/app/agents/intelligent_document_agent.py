from __future__ import annotations

import re
import unicodedata
from pathlib import Path
from datetime import date, datetime
from statistics import mean

from app.models.schemas import (
    AgentDocumentAction,
    AgentQuestionAnswer,
    CrossDocumentValidationItem,
    DiagnosticCheck,
    DocumentDiagnostic,
    DocumentItem,
    DocumentOpsItemResult,
    DocumentOpsResult,
    IntelligentAction,
)
from app.services.document_parser import parse_document
from app.services.knowledge_base import KnowledgeBase
from app.services.local_llm import LocalLLMClient
from app.utils.vision import (
    detect_blue_signature,
    detect_red_stamp,
    estimate_quality,
    extract_text_with_ocr,
    load_ground_truth_if_exists,
    load_image,
)


class IntelligentDocumentAgent:
    name = "A2_IntelligentDocumentAgent"
    IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".bmp", ".tif", ".tiff", ".webp"}
    OFFICE_EXTENSIONS = {".pdf", ".docx", ".pptx"}

    REQUIRED_FIELDS_BY_TYPE = {
        "statuts": ["signature", "stamp"],
        "rc": ["signature"],
        "if": ["stamp"],
        "cin": [],
        "attestation_bancaire": ["signature", "stamp"],
    }

    REQUIRED_TEXT_FIELDS_BY_TYPE = {
        "statuts": ["societe", "forme", "capital social", "associes", "date de signature"],
        "rc": ["numero rc", "tribunal", "date immatriculation", "activite"],
        "if": ["identifiant fiscal", "centre fiscal", "date attribution"],
        "cin": ["nom", "prenom", "numero cin", "date de naissance", "date de delivrance"],
        "attestation_bancaire": ["banque", "titulaire", "compte bloque", "montant depot", "date attestation"],
    }

    def __init__(self, llm: LocalLLMClient) -> None:
        self.llm = llm

    def _extract_dates_from_text(self, text: str) -> list[date]:
        matches = re.findall(r"\b(\d{4}-\d{2}-\d{2}|\d{2}/\d{2}/\d{4}|\d{2}-\d{2}-\d{4})\b", text)
        parsed: list[date] = []
        for value in matches:
            try:
                if re.fullmatch(r"\d{4}-\d{2}-\d{2}", value):
                    parsed.append(date.fromisoformat(value))
                elif "/" in value:
                    parsed.append(datetime.strptime(value, "%d/%m/%Y").date())
                else:
                    parsed.append(datetime.strptime(value, "%d-%m-%Y").date())
            except ValueError:
                continue
        return parsed

    def _normalize_text(self, text: str) -> str:
        normalized = unicodedata.normalize("NFKD", text)
        normalized = "".join(ch for ch in normalized if not unicodedata.combining(ch))
        return normalized.lower()

    def _check_required_text_fields(self, document_type: str, text_preview: str) -> list[str]:
        required_fields = self.REQUIRED_TEXT_FIELDS_BY_TYPE.get(document_type, [])
        if not required_fields:
            return []

        normalized = self._normalize_text(text_preview)
        missing: list[str] = []
        for field in required_fields:
            if field not in normalized:
                missing.append(field)
        return missing

    def _build_document_diagnostic(
        self,
        file_name: str,
        document_type: str,
        required: list[str],
        source_format: str,
        quality: str,
        signature_present: bool | None,
        stamp_present: bool | None,
        issues: list[str],
        completeness: float,
    ) -> DocumentDiagnostic:
        checks: list[DiagnosticCheck] = []

        quality_status = "pass"
        quality_severity = "low"
        quality_details = "Image quality is acceptable for legal review."
        if source_format != "image":
            quality_status = "warning"
            quality_severity = "low"
            quality_details = "Visual quality checks are not applicable for non-image documents."
        elif quality == "blurred":
            quality_status = "warning"
            quality_severity = "medium"
            quality_details = "Image quality is blurred and may affect validation confidence."
        elif quality == "unreadable":
            quality_status = "fail"
            quality_severity = "critical"
            quality_details = "Image quality is unreadable and blocks legal verification."

        checks.append(
            DiagnosticCheck(
                name="image_quality",
                status=quality_status,
                severity=quality_severity,
                details=quality_details,
            )
        )

        if "signature" in required:
            signature_ok = bool(signature_present)
            if signature_present is None:
                checks.append(
                    DiagnosticCheck(
                        name="required_signature",
                        status="warning",
                        severity="high",
                        details="Required signature cannot be verified automatically on this file format.",
                    )
                )
            else:
                checks.append(
                    DiagnosticCheck(
                        name="required_signature",
                        status="pass" if signature_ok else "fail",
                        severity="critical" if not signature_ok else "low",
                        details=(
                            "Required signature is visible."
                            if signature_ok
                            else "Required signature is missing."
                        ),
                    )
                )

        if "stamp" in required:
            stamp_ok = bool(stamp_present)
            if stamp_present is None:
                checks.append(
                    DiagnosticCheck(
                        name="required_stamp",
                        status="warning",
                        severity="medium",
                        details="Required stamp cannot be verified automatically on this file format.",
                    )
                )
            else:
                checks.append(
                    DiagnosticCheck(
                        name="required_stamp",
                        status="pass" if stamp_ok else "warning",
                        severity="high" if not stamp_ok else "low",
                        details=(
                            "Required stamp is visible."
                            if stamp_ok
                            else "Required stamp is missing or not detected."
                        ),
                    )
                )

        checks.append(
            DiagnosticCheck(
                name="source_format_support",
                status="pass" if source_format in {"image", "pdf", "docx", "pptx"} else "warning",
                severity="low" if source_format in {"image", "pdf", "docx", "pptx"} else "medium",
                details=f"Detected source format: {source_format}.",
            )
        )

        if source_format != "image":
            checks.append(
                DiagnosticCheck(
                    name="content_extraction",
                    status="pass" if any("extract" not in issue.lower() for issue in issues) else "warning",
                    severity="low" if not issues else "medium",
                    details="Text extraction was attempted for non-image document validation.",
                )
            )

        checks.append(
            DiagnosticCheck(
                name="document_type_recognition",
                status="pass" if document_type != "unknown" else "warning",
                severity="low" if document_type != "unknown" else "medium",
                details=(
                    f"Document recognized as '{document_type}'."
                    if document_type != "unknown"
                    else "Document type could not be confidently recognized."
                ),
            )
        )

        legal_blocker = quality == "unreadable" or ("signature" in required and signature_present is False)

        if legal_blocker:
            risk_level = "critical"
        elif issues:
            risk_level = "high"
        elif completeness < 90:
            risk_level = "medium"
        else:
            risk_level = "low"

        probable_causes: list[str] = []
        if source_format != "image":
            probable_causes.append("Non-image file requires content extraction and manual visual legal checks.")
        if quality == "blurred":
            probable_causes.append("Low scan resolution or motion blur during capture.")
        if quality == "unreadable":
            probable_causes.append("Severe image degradation, bad lighting, or strong compression.")
        if "Missing signature." in issues:
            probable_causes.append("Unsigned draft uploaded instead of final signed version.")
        if "Missing stamp." in issues:
            probable_causes.append("Officially stamped copy was not provided.")
        if not probable_causes:
            probable_causes.append("No major anomaly detected from visual validation rules.")

        if legal_blocker:
            business_impact = "Submission is blocked until this document is corrected."
        elif issues:
            business_impact = "Submission quality is degraded and may trigger review delays."
        else:
            business_impact = "No immediate legal risk detected for this document."

        recommended_actions: list[str] = []
        if quality in {"blurred", "unreadable"}:
            recommended_actions.append("Re-scan the document at 300 DPI minimum with uniform lighting.")
        if "signature" in required and signature_present is False:
            recommended_actions.append("Upload a version signed by all required parties.")
        if "stamp" in required and stamp_present is False:
            recommended_actions.append("Provide an officially stamped copy from the relevant authority.")
        if source_format in {"pdf", "docx", "pptx"}:
            recommended_actions.append("Run manual legal verification on visual markers (signature/stamp).")
        if document_type == "unknown":
            recommended_actions.append("Declare document type explicitly in metadata for traceability.")
        if not recommended_actions:
            recommended_actions.append("No corrective action required.")

        max_severity_weight = {
            "low": 10.0,
            "medium": 35.0,
            "high": 65.0,
            "critical": 90.0,
        }
        severity_score = max(max_severity_weight[ch.severity] for ch in checks)
        priority_score = min(100.0, round(max(severity_score, 100.0 - completeness), 2))

        if legal_blocker:
            summary = (
                f"{file_name} is non-compliant for immediate filing. Blocking issues detected."
            )
        elif issues:
            summary = f"{file_name} is partially compliant and requires correction before filing."
        else:
            summary = f"{file_name} passed automated legal-quality diagnostics."

        return DocumentDiagnostic(
            summary=summary,
            risk_level=risk_level,
            legal_blocker=legal_blocker,
            checks=checks,
            probable_causes=probable_causes,
            business_impact=business_impact,
            recommended_actions=recommended_actions,
            priority_score=priority_score,
        )

    def _infer_document_type(
        self,
        declared_type: str | None,
        file_name: str,
        ground_truth_type: str | None = None,
    ) -> str:
        if declared_type:
            return declared_type.lower()
        if ground_truth_type:
            return ground_truth_type.lower()
        lower = file_name.lower()
        for key in ["statuts", "rc", "if", "cin", "attestation_bancaire"]:
            if key in lower:
                return key
        return "unknown"

    def _detect_source_format(self, file_name: str) -> str:
        suffix = Path(file_name).suffix.lower()
        if suffix in self.IMAGE_EXTENSIONS:
            return "image"
        if suffix == ".pdf":
            return "pdf"
        if suffix == ".docx":
            return "docx"
        if suffix == ".pptx":
            return "pptx"
        return "other"

    def _collect_blocking_documents(self, results: list[DocumentOpsItemResult]) -> list[DocumentOpsItemResult]:
        return [
            res
            for res in results
            if (res.diagnostic and res.diagnostic.legal_blocker)
            or res.completeness_score < 80
        ]

    def _select_priority_action(self, results: list[DocumentOpsItemResult]) -> tuple[str, list[str]]:
        if not results:
            return (
                "Upload the full document pack first.",
                ["No documents are available for automated correction."],
            )

        ranked = sorted(
            results,
            key=lambda res: (
                0 if (res.diagnostic and res.diagnostic.legal_blocker) else 1,
                -(res.diagnostic.priority_score if res.diagnostic else 0.0),
                res.completeness_score,
            ),
        )
        top = ranked[0]
        if top.diagnostic and top.diagnostic.recommended_actions:
            return top.diagnostic.recommended_actions[0], [
                f"Top priority file: {top.file_name}",
                f"Risk level: {top.diagnostic.risk_level}",
                f"Reason: {top.diagnostic.summary}",
            ]
        return (
            "Review the highest-risk document first.",
            [f"Top priority file: {top.file_name}", "No explicit recommendation available."],
        )

    def _build_cross_document_validations(
        self,
        results: list[DocumentOpsItemResult],
        missing_docs: list[str],
    ) -> list[CrossDocumentValidationItem]:
        validations: list[CrossDocumentValidationItem] = []

        type_to_files: dict[str, list[str]] = {}
        for res in results:
            type_to_files.setdefault(res.document_type, []).append(res.file_name)

        duplicates = {doc_type: files for doc_type, files in type_to_files.items() if len(files) > 1}
        if duplicates:
            impacted = [name for files in duplicates.values() for name in files]
            details = ", ".join(f"{doc_type}: {files}" for doc_type, files in duplicates.items())
            validations.append(
                CrossDocumentValidationItem(
                    check="duplicate_document_types",
                    status="warning",
                    details=f"Duplicate document types found: {details}",
                    impacted_documents=impacted,
                )
            )
        else:
            validations.append(
                CrossDocumentValidationItem(
                    check="duplicate_document_types",
                    status="pass",
                    details="No duplicate document types detected.",
                    impacted_documents=[],
                )
            )

        has_statuts = "statuts" in type_to_files
        has_rc = "rc" in type_to_files
        if has_statuts and not has_rc:
            validations.append(
                CrossDocumentValidationItem(
                    check="statuts_requires_rc",
                    status="fail",
                    details="Statuts is present but RC is missing.",
                    impacted_documents=type_to_files.get("statuts", []),
                )
            )
        else:
            validations.append(
                CrossDocumentValidationItem(
                    check="statuts_requires_rc",
                    status="pass",
                    details="Dependency between statuts and RC is satisfied.",
                    impacted_documents=[],
                )
            )

        if missing_docs:
            validations.append(
                CrossDocumentValidationItem(
                    check="required_documents_presence",
                    status="fail",
                    details=f"Missing required document types: {', '.join(missing_docs)}",
                    impacted_documents=[],
                )
            )
        else:
            validations.append(
                CrossDocumentValidationItem(
                    check="required_documents_presence",
                    status="pass",
                    details="All required document types are present.",
                    impacted_documents=[],
                )
            )

        low_quality_docs = [res.file_name for res in results if res.quality in {"blurred", "unreadable"}]
        if low_quality_docs:
            validations.append(
                CrossDocumentValidationItem(
                    check="portfolio_quality_consistency",
                    status="warning",
                    details="Some documents have low visual quality.",
                    impacted_documents=low_quality_docs,
                )
            )
        else:
            validations.append(
                CrossDocumentValidationItem(
                    check="portfolio_quality_consistency",
                    status="pass",
                    details="No cross-portfolio visual quality issue detected.",
                    impacted_documents=[],
                )
            )

        operational_docs = [res for res in results if res.document_type in {"statuts", "rc", "if", "attestation_bancaire"}]
        operational_dates: list[tuple[str, date]] = []
        date_parse_issues: list[str] = []
        for res in operational_docs:
            parsed_dates = self._extract_dates_from_text(res.extracted_text_preview)
            if not parsed_dates:
                date_parse_issues.append(res.file_name)
                continue
            operational_dates.extend((res.file_name, dt) for dt in parsed_dates)

        if date_parse_issues:
            validations.append(
                CrossDocumentValidationItem(
                    check="operational_date_presence",
                    status="warning",
                    details=f"No parseable operational date found in: {', '.join(date_parse_issues)}",
                    impacted_documents=date_parse_issues,
                )
            )
        else:
            validations.append(
                CrossDocumentValidationItem(
                    check="operational_date_presence",
                    status="pass",
                    details="Parseable operational dates were found in all core administrative documents.",
                    impacted_documents=[],
                )
            )

        if operational_dates:
            min_date = min(dt for _, dt in operational_dates)
            max_date = max(dt for _, dt in operational_dates)
            span_days = (max_date - min_date).days
            if span_days > 45:
                impacted = sorted({name for name, _ in operational_dates})
                validations.append(
                    CrossDocumentValidationItem(
                        check="operational_date_coherence",
                        status="warning",
                        details=(
                            f"Operational document dates span {span_days} days, which may indicate inconsistent filing chronology."
                        ),
                        impacted_documents=impacted,
                    )
                )
            else:
                validations.append(
                    CrossDocumentValidationItem(
                        check="operational_date_coherence",
                        status="pass",
                        details=(
                            f"Operational document dates are coherent within a {span_days}-day span."
                        ),
                        impacted_documents=[],
                    )
                )

            future_dates = [name for name, dt in operational_dates if dt > date.today()]
            if future_dates:
                validations.append(
                    CrossDocumentValidationItem(
                        check="future_operational_dates",
                        status="fail",
                        details=f"Future dates detected in: {', '.join(sorted(set(future_dates)))}",
                        impacted_documents=sorted(set(future_dates)),
                    )
                )
            else:
                validations.append(
                    CrossDocumentValidationItem(
                        check="future_operational_dates",
                        status="pass",
                        details="No future operational dates detected.",
                        impacted_documents=[],
                    )
                )

        return validations

    def _compute_global_risk_score(
        self,
        results: list[DocumentOpsItemResult],
        strict_fail: bool,
        validations: list[CrossDocumentValidationItem],
    ) -> float:
        if not results:
            return 100.0

        document_risk = 100.0 - mean(res.completeness_score for res in results)
        blocker_ratio = len([res for res in results if res.diagnostic and res.diagnostic.legal_blocker]) / max(1, len(results))
        blocker_component = blocker_ratio * 40.0
        validation_penalty = 0.0
        for val in validations:
            if val.status == "fail":
                validation_penalty += 10.0
            elif val.status == "warning":
                validation_penalty += 4.0

        strict_penalty = 15.0 if strict_fail else 0.0
        score = min(100.0, max(0.0, round(document_risk + blocker_component + validation_penalty + strict_penalty, 2)))
        return score

    def _compute_global_priority_action(
        self,
        results: list[DocumentOpsItemResult],
        missing_docs: list[str],
    ) -> str:
        if missing_docs:
            return f"Collect missing required documents first: {', '.join(missing_docs)}."

        blockers = [res for res in results if res.diagnostic and res.diagnostic.legal_blocker]
        if blockers:
            top = sorted(blockers, key=lambda x: -(x.diagnostic.priority_score if x.diagnostic else 0.0))[0]
            rec = top.diagnostic.recommended_actions[0] if top.diagnostic and top.diagnostic.recommended_actions else "Resolve blocking issue."
            return f"Resolve highest blocker ({top.file_name}) first: {rec}"

        return "No blocking issue detected. Proceed with final compliance review and submission."

    def _answer_user_questions(
        self,
        questions: list[str],
        results: list[DocumentOpsItemResult],
        missing_docs: list[str],
        kb: KnowledgeBase,
    ) -> list[AgentQuestionAnswer]:
        if not questions:
            return []

        blocking_docs = self._collect_blocking_documents(results)
        priority_action, priority_evidence = self._select_priority_action(results)
        document_context = [
            {
                "file_name": res.file_name,
                "document_type": res.document_type,
                "issues": res.issues,
                "diagnostic_summary": res.diagnostic.summary if res.diagnostic else "",
                "recommended_actions": res.diagnostic.recommended_actions if res.diagnostic else [],
                "preview": res.extracted_text_preview,
            }
            for res in results
        ]
        kb_snippets = kb.find_evidence(["startup", "label", "legal", "documents", "compliance"], limit=8)
        answers: list[AgentQuestionAnswer] = []

        for q in questions:
            lowered = q.lower()

            if any(token in lowered for token in ["bloqu", "depot", "dépôt", "block", "stop"]):
                if blocking_docs:
                    blockers_text = "; ".join(
                        f"{res.file_name} ({res.document_type}): {res.diagnostic.summary if res.diagnostic else 'Issue detected'}"
                        for res in blocking_docs
                    )
                    answers.append(
                        AgentQuestionAnswer(
                            question=q,
                            answer=f"Les documents qui bloquent le dépôt sont: {blockers_text}.",
                            confidence="high",
                            evidence=[
                                *(f"{res.file_name}: {', '.join(res.issues) or 'blocking diagnostic'}" for res in blocking_docs),
                                *priority_evidence,
                            ],
                        )
                    )
                else:
                    answers.append(
                        AgentQuestionAnswer(
                            question=q,
                            answer="Aucun document bloquant n'a été détecté automatiquement.",
                            confidence="high",
                            evidence=["No blocking documents detected in diagnostics."],
                        )
                    )
                continue

            if any(token in lowered for token in ["priorit", "premier", "first", "action"]):
                answers.append(
                    AgentQuestionAnswer(
                        question=q,
                        answer=f"L'action prioritaire est: {priority_action}",
                        confidence="high",
                        evidence=priority_evidence + [
                            f"Blocking documents: {', '.join(res.file_name for res in blocking_docs) if blocking_docs else 'none'}",
                        ],
                    )
                )
                continue

            if any(token in lowered for token in ["manquant", "missing", "quels documents", "which documents"]):
                missing_text = ", ".join(missing_docs) if missing_docs else "aucun document manquant détecté"
                answers.append(
                    AgentQuestionAnswer(
                        question=q,
                        answer=f"Documents manquants ou à compléter: {missing_text}.",
                        confidence="high",
                        evidence=["Missing document inference from KB", *kb_snippets[:3]],
                    )
                )
                continue

            prompt = f"""
            You are a legal-admin assistant. Answer the user's question from the document diagnostics and KB.
            Return ONLY JSON with key: answer, confidence (low|medium|high), evidence (array of strings).

            Question: {q}
            Missing documents: {missing_docs}
            Document context: {document_context}
            KB snippets: {kb_snippets}
            """
            fallback = {
                "answer": "Information is partially available. Please review document diagnostics and complete missing items.",
                "confidence": "medium",
                "evidence": ["Automated document diagnostics", "Knowledge base snippets"],
            }
            llm_json = self.llm.complete_json(
                prompt=prompt,
                system="Return strict JSON only and keep answers operational.",
                fallback=fallback,
            )
            confidence = str(llm_json.get("confidence", fallback["confidence"])).lower()
            if confidence not in {"low", "medium", "high"}:
                confidence = "medium"
            evidence = llm_json.get("evidence", fallback["evidence"])
            if not isinstance(evidence, list):
                evidence = [str(evidence)]
            answers.append(
                AgentQuestionAnswer(
                    question=q,
                    answer=str(llm_json.get("answer", fallback["answer"])),
                    confidence=confidence,
                    evidence=[str(item) for item in evidence],
                )
            )
        return answers

    def _verify_one(self, item: DocumentItem) -> DocumentOpsItemResult:
        file_name = Path(item.path).name
        ground_truth = load_ground_truth_if_exists(item.path)
        gt_type_raw = None
        if isinstance(ground_truth, dict) and ground_truth.get("document_type"):
            gt_type_raw = str(ground_truth.get("document_type")).strip().lower()

        document_type = self._infer_document_type(item.declared_type, file_name, gt_type_raw)
        source_format = self._detect_source_format(file_name)
        required = self.REQUIRED_FIELDS_BY_TYPE.get(document_type, [])
        issues: list[str] = []
        completeness = 100.0

        signature_present: bool | None = None
        stamp_present: bool | None = None
        quality = "n_a"
        text_preview = ""

        if source_format == "image":
            image = load_image(item.path)
            signature_present = detect_blue_signature(image)
            stamp_present = detect_red_stamp(image)
            quality = estimate_quality(image)
            text_preview = extract_text_with_ocr(image)

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
        else:
            parsed = parse_document(item.path)
            text_preview = parsed.extracted_text_preview
            if source_format == "other":
                issues.append("Unsupported file format for automatic extraction.")
                completeness -= 50
            elif not parsed.extraction_ok:
                issues.append("Text extraction failed or produced empty content.")
                completeness -= 25

            for note in parsed.extraction_notes:
                issues.append(note)
            if "signature" in required:
                issues.append("Signature verification requires manual review for non-image format.")
                completeness -= 10
            if "stamp" in required:
                issues.append("Stamp verification requires manual review for non-image format.")
                completeness -= 10

        missing_text_fields = self._check_required_text_fields(document_type, text_preview)
        if missing_text_fields:
            issues.append(f"Missing mandatory fields: {', '.join(missing_text_fields)}.")
            completeness -= min(30.0, 6.0 * len(missing_text_fields))

        completeness = max(0.0, completeness)

        suggested_fix = "No correction needed."
        auto_correction_applied = False
        corrected_declared_type = None

        if not item.declared_type and gt_type_raw:
            auto_correction_applied = True
            corrected_declared_type = gt_type_raw
        elif item.declared_type and gt_type_raw and item.declared_type.lower() != gt_type_raw:
            issues.append(
                f"Declared type '{item.declared_type.lower()}' mismatches detected type '{gt_type_raw}'."
            )
            completeness -= 10
            suggested_fix = "Verify declared type against source document and update metadata if needed."

        if issues:
            if "Missing signature." in issues and "Missing stamp." in issues:
                suggested_fix = "Re-upload document with visible signature and stamp."
            elif "Missing signature." in issues:
                suggested_fix = "Provide a signed version of this document."
            elif "Missing stamp." in issues:
                suggested_fix = "Provide a stamped or officially validated version."
            elif any(issue.startswith("Missing mandatory fields:") for issue in issues):
                suggested_fix = "Complete the missing mandatory fields in the document content."
            elif "Unsupported file format for automatic extraction." in issues:
                suggested_fix = "Upload PDF, DOCX, PPTX, or image formats supported by the agent."
            elif "Text extraction failed or produced empty content." in issues:
                suggested_fix = "Export document to a text-readable version or provide clearer source content."

            if quality in {"blurred", "unreadable"}:
                suggested_fix += " Scan at higher resolution and better lighting."

        if not item.declared_type and document_type != "unknown":
            auto_correction_applied = True
            corrected_declared_type = document_type

        diagnostic = self._build_document_diagnostic(
            file_name=file_name,
            document_type=document_type,
            required=required,
            source_format=source_format,
            quality=quality,
            signature_present=signature_present,
            stamp_present=stamp_present,
            issues=issues,
            completeness=completeness,
        )

        if missing_text_fields:
            diagnostic.checks.append(
                DiagnosticCheck(
                    name="mandatory_text_fields",
                    status="fail",
                    severity="high",
                    details=f"Missing mandatory fields: {', '.join(missing_text_fields)}.",
                )
            )
            if diagnostic.risk_level == "low":
                diagnostic.risk_level = "medium"

        return DocumentOpsItemResult(
            file_name=file_name,
            document_type=document_type,
            source_format=source_format,
            signature_present=signature_present,
            stamp_present=stamp_present,
            quality=quality,
            completeness_score=completeness,
            issues=issues,
            extracted_text_preview=text_preview,
            suggested_fix=suggested_fix,
            corrected_declared_type=corrected_declared_type,
            auto_correction_applied=auto_correction_applied,
            diagnostic=diagnostic,
        )

    def run(
        self,
        documents: list[DocumentItem],
        kb: KnowledgeBase,
        strict_mode: bool = False,
        legal_context: dict | None = None,
    ) -> DocumentOpsResult:
        if not documents:
            return DocumentOpsResult(
                documents=[],
                overall_completeness_score=0.0,
                missing_documents=sorted(kb.infer_required_document_types()),
                cross_document_issues=["No documents uploaded."],
                categorized_documents={},
                version_tracking={},
                suggested_folders=[
                    "01_Company_Creation",
                    "02_Tax_and_RNE",
                    "03_Banking",
                    "04_Founders_ID",
                    "05_Startup_Label",
                    "06_Archive",
                ],
                reasoning_trace=["No documents to verify.", "Missing-documents inference executed from KB."],
                actions=[
                    IntelligentAction(
                        action="Request full document pack",
                        status="suggested",
                        details="Upload core legal documents to start automated correction and validation.",
                    )
                ],
                document_actions=[],
                question_answers=[],
                strict_fail=strict_mode,
                strict_violations=["No documents uploaded under strict mode."] if strict_mode else [],
            )

        results = [self._verify_one(doc) for doc in documents]
        types = [res.document_type for res in results]
        overall = round(mean(res.completeness_score for res in results), 2)

        cross_issues: list[str] = []
        if len(types) != len(set(types)):
            cross_issues.append("Duplicate document types detected.")
        if "statuts" in types and "rc" not in types:
            cross_issues.append("Statuts provided without RC document.")

        categorized: dict[str, list[str]] = {}
        version_tracking: dict[str, str] = {}
        declared_types: list[str] = []
        for doc in documents:
            ground_truth = load_ground_truth_if_exists(doc.path)
            gt_type_raw = None
            if isinstance(ground_truth, dict) and ground_truth.get("document_type"):
                gt_type_raw = str(ground_truth.get("document_type")).strip().lower()

            doc_type = self._infer_document_type(doc.declared_type, Path(doc.path).name, gt_type_raw)
            categorized.setdefault(doc_type, []).append(doc.path)
            declared_types.append(doc_type)
            version_tracking[Path(doc.path).name] = "v1"

        required_docs = set(["statuts", "rc", "if", "cin", "attestation_bancaire"])
        required_docs.update(kb.infer_required_document_types())
        if legal_context:
            required_from_agent1 = legal_context.get("required_documents", [])
            normalized_required = [str(item).strip().lower() for item in required_from_agent1 if str(item).strip()]
            required_docs.update(normalized_required)
        missing_docs = sorted(doc for doc in required_docs if doc not in declared_types)
        cross_validations = self._build_cross_document_validations(results, missing_docs)

        prompt = f"""
        You are a legal document quality assistant.
        Return ONLY JSON with keys: reasoning_trace (array of strings), actions (array of strings).
        Document completeness score: {overall}
        Missing docs: {missing_docs}
        Cross issues: {cross_issues}
        """
        fallback_reasoning = [
            "Analyze visual compliance signals and document consistency.",
            "Prioritize correction actions by legal criticality.",
            "Produce actionable remediation plan for resubmission.",
        ]
        fallback_actions = [
            "Re-upload low quality documents in high resolution.",
            "Complete missing mandatory documents from legal pack.",
            "Validate signatures and stamps before submission.",
        ]
        llm_json = self.llm.complete_json(
            prompt=prompt,
            system="Return strict JSON, concise reasoning, and practical remediation actions.",
            fallback={"reasoning_trace": fallback_reasoning, "actions": fallback_actions},
        )

        reasoning_trace = [str(x) for x in llm_json.get("reasoning_trace", fallback_reasoning)]
        llm_actions = [str(x) for x in llm_json.get("actions", fallback_actions)]
        actions = [
            IntelligentAction(action="Document correction recommendation", status="suggested", details=detail)
            for detail in llm_actions
        ]

        document_actions: list[AgentDocumentAction] = []
        for res in results:
            if res.auto_correction_applied and res.corrected_declared_type:
                document_actions.append(
                    AgentDocumentAction(
                        file_name=res.file_name,
                        action_type="auto_document_type_correction",
                        status="applied",
                        details=f"Declared type inferred as '{res.corrected_declared_type}'.",
                    )
                )
            if res.source_format in {"pdf", "docx", "pptx"}:
                document_actions.append(
                    AgentDocumentAction(
                        file_name=res.file_name,
                        action_type="content_extraction",
                        status="applied" if bool(res.extracted_text_preview) else "failed",
                        details=(
                            "Text content extracted and used for diagnostics."
                            if bool(res.extracted_text_preview)
                            else "Extraction produced no usable text; manual review needed."
                        ),
                    )
                )
            if res.diagnostic and res.diagnostic.legal_blocker:
                document_actions.append(
                    AgentDocumentAction(
                        file_name=res.file_name,
                        action_type="legal_blocker_remediation",
                        status="suggested",
                        details=res.diagnostic.recommended_actions[0],
                    )
                )

        if any(res.auto_correction_applied for res in results):
            actions.append(
                IntelligentAction(
                    action="Auto-correct document typing",
                    status="applied",
                    details="Applied inferred declared_type for documents missing explicit type metadata.",
                )
            )

        strict_violations: list[str] = []
        if strict_mode:
            for res in results:
                if res.quality == "unreadable":
                    strict_violations.append(f"{res.file_name}: unreadable quality.")
                if res.signature_present is False:
                    required = self.REQUIRED_FIELDS_BY_TYPE.get(res.document_type, [])
                    if "signature" in required:
                        strict_violations.append(f"{res.file_name}: missing required signature.")
                if res.source_format in {"pdf", "docx", "pptx"}:
                    required = self.REQUIRED_FIELDS_BY_TYPE.get(res.document_type, [])
                    if "signature" in required:
                        strict_violations.append(
                            f"{res.file_name}: signature must be manually verified for {res.source_format} format."
                        )

        strict_fail = len(strict_violations) > 0
        global_risk_score = self._compute_global_risk_score(results, strict_fail, cross_validations)
        global_priority_action = self._compute_global_priority_action(results, missing_docs)

        return DocumentOpsResult(
            documents=results,
            overall_completeness_score=overall,
            missing_documents=missing_docs,
            cross_document_issues=cross_issues,
            cross_document_validations=cross_validations,
            categorized_documents=categorized,
            version_tracking=version_tracking,
            suggested_folders=[
                "01_Company_Creation",
                "02_Tax_and_RNE",
                "03_Banking",
                "04_Founders_ID",
                "05_Startup_Label",
                "06_Archive",
            ],
            reasoning_trace=reasoning_trace,
            actions=actions,
            document_actions=document_actions,
            question_answers=[],
            global_risk_score=global_risk_score,
            global_priority_action=global_priority_action,
            strict_fail=strict_fail,
            strict_violations=strict_violations,
        )
