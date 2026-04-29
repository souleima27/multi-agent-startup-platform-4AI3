from __future__ import annotations

import json
from pathlib import Path

from app.core.config import get_settings
from app.models.schemas import ChatResponse, TrackBResponse
from app.services.knowledge_base import KnowledgeBase
from app.services.local_llm import LocalLLMClient


class TrackBChatbot:
    def __init__(self, llm: LocalLLMClient, kb: KnowledgeBase) -> None:
        self.llm = llm
        self.kb = kb

    def _load_latest_context_from_reports(self) -> TrackBResponse | None:
        reports_dir: Path = get_settings().reports_dir
        if not reports_dir.exists():
            return None

        json_reports = sorted(
            reports_dir.glob("*.json"),
            key=lambda p: p.stat().st_mtime,
            reverse=True,
        )
        for report_path in json_reports:
            try:
                payload = json.loads(report_path.read_text(encoding="utf-8"))
                return TrackBResponse.model_validate(payload)
            except Exception:
                continue
        return None

    def answer(self, question: str, latest: TrackBResponse | None) -> ChatResponse:
        if latest is None:
            latest = self._load_latest_context_from_reports()

        if latest is None:
            return ChatResponse(
                answer=(
                    "Aucun contexte d'analyse n'est disponible. Lancez d'abord /track-b/run avec vos documents, "
                    "puis posez votre question ici."
                ),
                confidence="high",
                suggested_actions=["Executer /track-b/run", "Reposer la question"],
                correction_artifacts={},
                context_available=False,
            )

        final = latest.final_output
        doc_agent = latest.document_agent
        blockers = [doc.file_name for doc in doc_agent.documents if doc.diagnostic and doc.diagnostic.legal_blocker]
        kb_snippets = self.kb.find_evidence(["documents", "legal", "signature", "startup"], limit=4)

        prompt = f"""
        Tu es un assistant chatbot legal/administratif. Reponds en francais.
        Retourne STRICTEMENT un JSON avec: answer, confidence (low|medium|high), suggested_actions (array).

        Question utilisateur: {question}
        Decision go/no-go: {final.get('go_no_go')}
        Risk global: {final.get('global_risk_score')}
        Priorite globale: {final.get('global_priority_action')}
        Documents bloquants: {blockers}
        Violations strictes: {doc_agent.strict_violations}
        Extraits KB: {kb_snippets}
        """

        fallback = {
            "answer": (
                f"Decision actuelle: {final.get('go_no_go')}. "
                f"Priorite: {final.get('global_priority_action', 'corriger les documents bloquants')}."
            ),
            "confidence": "high",
            "suggested_actions": [
                "Corriger le document le plus prioritaire",
                "Regenerer une analyse via /track-b/run",
            ],
        }

        llm_json = self.llm.complete_json(
            prompt=prompt,
            system="Retourne uniquement du JSON valide, sans texte hors JSON.",
            fallback=fallback,
        )

        confidence = str(llm_json.get("confidence", fallback["confidence"]))
        if confidence not in {"low", "medium", "high"}:
            confidence = "medium"

        actions = llm_json.get("suggested_actions", fallback["suggested_actions"])
        if not isinstance(actions, list):
            actions = [str(actions)]

        correction_artifacts = {}
        for action in doc_agent.document_actions:
            if action.artifact_path:
                correction_artifacts[action.file_name] = action.artifact_path

        return ChatResponse(
            answer=str(llm_json.get("answer", fallback["answer"])),
            confidence=confidence,
            suggested_actions=[str(item) for item in actions],
            correction_artifacts=correction_artifacts,
            context_available=True,
        )
