from __future__ import annotations

from pathlib import Path
from app.models.schemas import DocumentItem, DocumentManagementResult
from app.services.knowledge_base import KnowledgeBase


class DocumentManagementAgent:
    name = "B5_DocumentManagementAgent"

    REQUIRED_CORE = ["statuts", "rc", "if", "cin", "attestation_bancaire"]

    def run(self, documents: list[DocumentItem], kb: KnowledgeBase | None = None) -> DocumentManagementResult:
        categorized: dict[str, list[str]] = {}
        version_tracking: dict[str, str] = {}
        declared_types = []

        for doc in documents:
            doc_type = (doc.declared_type or "uncategorized").lower()
            categorized.setdefault(doc_type, []).append(doc.path)
            declared_types.append(doc_type)
            version_tracking[Path(doc.path).name] = "v1"

        required_docs = set(self.REQUIRED_CORE)
        if kb is not None:
            required_docs.update(kb.infer_required_document_types())

        missing = [d for d in sorted(required_docs) if d not in declared_types]
        suggested_folders = [
            "01_Company_Creation",
            "02_Tax_and_RNE",
            "03_Banking",
            "04_Founders_ID",
            "05_Startup_Label",
            "06_Archive",
        ]
        return DocumentManagementResult(
            categorized_documents=categorized,
            missing_documents=missing,
            version_tracking=version_tracking,
            suggested_folders=suggested_folders,
        )
