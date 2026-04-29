from __future__ import annotations

from dataclasses import dataclass
from functools import lru_cache
import json
from pathlib import Path
from typing import Any

from app.core.config import get_settings


@dataclass(frozen=True)
class KnowledgeBase:
    path: Path
    documents: list[dict[str, Any]]

    @property
    def entry_count(self) -> int:
        return len(self.documents)

    def find_evidence(self, keywords: list[str], limit: int = 2) -> list[str]:
        if not keywords:
            return []

        lowered_keywords = [k.lower() for k in keywords]
        matches: list[str] = []
        for row in self.documents:
            canonical_name = str(row.get("canonical_name", "")).lower()
            evidence = str(row.get("evidence", "")).lower()
            haystack = f"{canonical_name} {evidence}"
            if any(k in haystack for k in lowered_keywords):
                text = str(row.get("evidence", "")).strip()
                if text:
                    matches.append(text)
            if len(matches) >= limit:
                break
        return matches

    def infer_required_document_types(self) -> set[str]:
        aliases = {
            "statuts": ["statuts", "acte constitutif"],
            "rc": ["registre de commerce", "registre national des entreprises", "trade_register_extract", "register_extract"],
            "if": ["fiscale", "tax", "identification fiscale", "certificate"],
            "cin": ["carte d'identite", "carte d’identite", "cin", "carte d'identification"],
            "attestation_bancaire": ["banque", "bancaire", "depot", "compte bloque"],
        }

        inferred: set[str] = set()
        for row in self.documents:
            canonical_name = str(row.get("canonical_name", "")).lower()
            evidence = str(row.get("evidence", "")).lower()
            haystack = f"{canonical_name} {evidence}"
            for doc_type, keywords in aliases.items():
                if any(keyword in haystack for keyword in keywords):
                    inferred.add(doc_type)
        return inferred


@lru_cache(maxsize=1)
def load_knowledge_base() -> KnowledgeBase:
    settings = get_settings()
    kb_path = settings.dataset_dir / "kb_master.json"
    payload = json.loads(kb_path.read_text(encoding="utf-8"))
    documents = payload.get("documents", [])
    if not isinstance(documents, list):
        documents = []
    return KnowledgeBase(path=kb_path, documents=documents)
