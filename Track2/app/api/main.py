from __future__ import annotations

import json
from pathlib import Path

from fastapi import FastAPI
from app.agents.intelligent_document_agent import IntelligentDocumentAgent
from app.agents.strategic_legal_agent import StrategicLegalAgent
from app.core.config import get_settings
from app.models.schemas import (
    ChatRequest,
    ChatResponse,
    DocumentItem,
    DocumentOpsResult,
    RunCaseResponse,
    StrategicAssessmentResult,
    TrackBRequest,
    TrackBResponse,
)
from app.services.chatbot import TrackBChatbot
from app.services.knowledge_base import load_knowledge_base
from app.services.local_llm import get_local_llm_client
from app.services.orchestrator import TrackBOrchestrator

settings = get_settings()
app = FastAPI(title=settings.app_name)

orchestrator = TrackBOrchestrator()
llm = get_local_llm_client()
kb = load_knowledge_base()
a1 = StrategicLegalAgent(llm=llm)
a2 = IntelligentDocumentAgent(llm=llm)
chatbot = TrackBChatbot(llm=llm, kb=kb)
latest_track_b_result: TrackBResponse | None = None


def _to_run_case_response(result: TrackBResponse) -> RunCaseResponse:
    final_output = result.final_output
    document_items = result.document_agent.documents
    signature_stamp_validation = {
        item.file_name: {
            "signature_present": item.signature_present,
            "stamp_present": item.stamp_present,
            "quality": item.quality,
        }
        for item in document_items
    }
    deadlines = [
        {
            "step_no": step.step_no,
            "title": step.title,
            "estimated_delay_days": step.estimated_delay_days,
        }
        for step in result.strategic_agent.checklist
    ]
    dependencies = [
        {
            "step_no": step.step_no,
            "depends_on": step.depends_on,
        }
        for step in result.strategic_agent.checklist
        if step.depends_on
    ]

    return RunCaseResponse(
        recommended_legal_structure=result.strategic_agent.recommended_legal_form,
        startup_act_score=result.strategic_agent.startup_act_eligibility_score,
        missing_documents=result.document_agent.missing_documents,
        document_completeness_score=result.document_agent.overall_completeness_score,
        signature_stamp_validation=signature_stamp_validation,
        administrative_checklist=[step.model_dump() for step in result.strategic_agent.checklist],
        deadlines=deadlines,
        dependencies=dependencies,
        final_decision=str(final_output.get("final_decision", "WARNING")),
        details={
            "global_risk_score": result.document_agent.global_risk_score,
            "strict_fail": result.document_agent.strict_fail,
            "strict_violations": result.document_agent.strict_violations,
            "cross_document_validations": [item.model_dump() for item in result.document_agent.cross_document_validations],
        },
    )


def _resolve_latest_track_b_result() -> TrackBResponse | None:
    if latest_track_b_result is not None:
        return latest_track_b_result

    reports_dir = settings.reports_dir
    if not reports_dir.exists():
        return None

    report_files = sorted(
        reports_dir.glob("*.json"),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    for path in report_files:
        try:
            payload = json.loads(path.read_text(encoding="utf-8"))
            return TrackBResponse.model_validate(payload)
        except Exception:
            continue
    return None


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "app": settings.app_name}


@app.post("/track-b/run", response_model=TrackBResponse)
def run_track_b(request: TrackBRequest) -> TrackBResponse:
    global latest_track_b_result
    latest_track_b_result = orchestrator.run(request)
    return latest_track_b_result


@app.post("/run-case", response_model=RunCaseResponse)
def run_case(request: TrackBRequest) -> RunCaseResponse:
    global latest_track_b_result
    latest_track_b_result = orchestrator.run(request)
    return _to_run_case_response(latest_track_b_result)


@app.post("/chat/ask", response_model=ChatResponse)
def chat_ask(request: ChatRequest) -> ChatResponse:
    return chatbot.answer(request.question, latest_track_b_result)


@app.get("/documents/corrections")
def list_corrections() -> dict:
    resolved = _resolve_latest_track_b_result()
    if resolved is None:
        return {"available": False, "items": {}, "message": "No analysis context in memory."}

    corrections = resolved.final_output.get("correction_examples", {})
    return {
        "available": bool(corrections),
        "items": corrections,
        "message": "Correction examples ready." if corrections else "No correction examples generated.",
    }


@app.get("/documents/corrections/content")
def get_correction_contents() -> dict:
    resolved = _resolve_latest_track_b_result()
    if resolved is None:
        return {"available": False, "items": {}, "message": "No analysis context in memory."}

    corrections = resolved.final_output.get("correction_examples", {})
    contents: dict[str, str] = {}
    for file_name, path_str in corrections.items():
        try:
            path = Path(path_str)
            contents[file_name] = path.read_text(encoding="utf-8") if path.exists() else "File not found."
        except Exception as exc:
            contents[file_name] = f"Unable to load correction content: {exc}"

    return {
        "available": bool(contents),
        "items": contents,
        "message": "Correction content loaded." if contents else "No correction content available.",
    }


@app.post("/agents/a1/strategic-assessment", response_model=StrategicAssessmentResult)
def strategic_assessment(request: TrackBRequest) -> StrategicAssessmentResult:
    return a1.run({"startup_profile": request.startup_profile, "label_input": request.label_input}, kb=kb)


@app.post("/agents/a2/document-intelligence", response_model=DocumentOpsResult)
def document_intelligence(documents: list[DocumentItem]) -> DocumentOpsResult:
    return a2.run(documents, kb=kb)
