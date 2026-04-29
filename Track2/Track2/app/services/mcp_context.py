from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any


@dataclass
class MCPContextManager:
    startup_info: dict[str, Any] = field(default_factory=dict)
    sector: str = ""
    recommended_legal_form: str = ""
    founders_structure: str = ""
    funding_needs: dict[str, Any] = field(default_factory=dict)
    startup_act_score: float = 0.0
    uploaded_documents: list[str] = field(default_factory=list)
    ocr_text: dict[str, str] = field(default_factory=dict)
    document_validation_results: dict[str, Any] = field(default_factory=dict)
    missing_documents: list[str] = field(default_factory=list)
    workflow_steps: list[dict[str, Any]] = field(default_factory=list)
    checklist: list[dict[str, Any]] = field(default_factory=list)
    final_report: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "startup_info": self.startup_info,
            "sector": self.sector,
            "recommended_legal_form": self.recommended_legal_form,
            "founders_structure": self.founders_structure,
            "funding_needs": self.funding_needs,
            "startup_act_score": self.startup_act_score,
            "uploaded_documents": self.uploaded_documents,
            "ocr_text": self.ocr_text,
            "document_validation_results": self.document_validation_results,
            "missing_documents": self.missing_documents,
            "workflow_steps": self.workflow_steps,
            "checklist": self.checklist,
            "final_report": self.final_report,
        }
