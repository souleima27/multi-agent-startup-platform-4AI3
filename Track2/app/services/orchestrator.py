from __future__ import annotations

from app.agents.intelligent_document_agent import IntelligentDocumentAgent
from app.agents.strategic_legal_agent import StrategicLegalAgent
from app.models.schemas import (
    TrackBRequest,
    TrackBResponse,
)
from app.core.config import get_settings
from app.services.a2a import A2ABus, A2AMessage
from app.services.document_actions import generate_correction_examples
from app.services.knowledge_base import load_knowledge_base
from app.services.local_llm import get_local_llm_client
from app.services.mcp_context import MCPContextManager
from app.services.reporting import stringify_report_paths, write_json_report, write_pdf_report


class TrackBOrchestrator:
    def __init__(self) -> None:
        llm = get_local_llm_client()
        self.a1 = StrategicLegalAgent(llm=llm)
        self.a2 = IntelligentDocumentAgent(llm=llm)
        self.kb = load_knowledge_base()
        self.bus = A2ABus()
        self.bus.register(self.a1.name, self.a1.run)
        self.bus.register(self.a2.name, self.a2.run)

    def run(self, request: TrackBRequest) -> TrackBResponse:
        options = request.options
        context = MCPContextManager(
            startup_info=request.startup_profile.model_dump(),
            sector=request.startup_profile.sector,
            funding_needs={
                "funding_need_tnd": request.startup_profile.funding_need_tnd,
                "wants_investors": request.startup_profile.wants_investors,
            },
            uploaded_documents=[doc.path for doc in request.documents],
        )
        strategic_payload = {
            "startup_profile": request.startup_profile,
            "label_input": request.label_input,
        }
        strategic = self.bus.send(
            A2AMessage("orchestrator", self.a1.name, "strategic_assessment", strategic_payload, kwargs={"kb": self.kb})
        )

        agent1_packet = {
            "agent": "legal_classification_agent",
            "recommended_legal_form": strategic.recommended_legal_form,
            "startup_act_score": round(strategic.startup_act_eligibility_score / 100.0, 4),
            "required_documents": strategic.required_documents,
            "sector_classification": strategic.sector_classification,
            "founders_structure": strategic.founders_structure,
            "funding_analysis": strategic.funding_analysis,
            "regulatory_compatibility": strategic.regulatory_compatibility,
        }

        document = self.bus.send(
            A2AMessage(
                "orchestrator",
                self.a2.name,
                "document_intelligence",
                request.documents,
                kwargs={
                    "kb": self.kb,
                    "strict_mode": options.strict_mode,
                    "legal_context": agent1_packet,
                },
            )
        )

        go_no_go = "GO"
        if options.strict_mode and document.strict_fail:
            go_no_go = "NO_GO"
        elif document.overall_completeness_score < 80:
            go_no_go = "NO_GO"
        elif document.global_risk_score >= 60:
            go_no_go = "NO_GO"

        user_message = (
            "Submission is blocked. Please fix critical document issues and re-run validation."
            if go_no_go == "NO_GO"
            else "Submission is ready for filing."
        )

        if go_no_go == "NO_GO" and document.strict_fail:
            decision_status = "FAIL"
        elif go_no_go == "NO_GO":
            decision_status = "WARNING"
        else:
            decision_status = "PASS"

        context.recommended_legal_form = strategic.recommended_legal_form
        context.founders_structure = strategic.founders_structure
        context.startup_act_score = strategic.startup_act_eligibility_score
        context.ocr_text = {item.file_name: item.extracted_text_preview for item in document.documents}
        context.document_validation_results = {
            "cross_document_validations": [item.model_dump() for item in document.cross_document_validations],
            "global_risk_score": document.global_risk_score,
            "strict_fail": document.strict_fail,
        }
        context.missing_documents = document.missing_documents
        context.workflow_steps = [step.model_dump() for step in strategic.checklist]
        context.checklist = [step.model_dump() for step in strategic.checklist]

        final_output = {
            "legal_structure_recommendation": strategic.recommended_legal_form,
            "sector_classification": strategic.sector_classification,
            "founders_structure": strategic.founders_structure,
            "funding_analysis": strategic.funding_analysis,
            "regulatory_compatibility": strategic.regulatory_compatibility,
            "required_documents": strategic.required_documents,
            "step_by_step_checklist_count": len(strategic.checklist),
            "document_completeness_score": document.overall_completeness_score,
            "startup_label_probability": strategic.startup_label_probability,
            "startup_label_multimodal": strategic.startup_label_multimodal.model_dump(),
            "pitch_score": strategic.pitch_score,
            "pitch_summary": strategic.pitch_summary,
            "pitch_strengths": strategic.pitch_strengths,
            "pitch_weaknesses": strategic.pitch_weaknesses,
            "pitch_recommendations": strategic.pitch_recommendations,
            "missing_documents": document.missing_documents,
            "cross_document_validations": [item.model_dump() for item in document.cross_document_validations],
            "kb_used": True,
            "kb_entries_loaded": self.kb.entry_count,
            "llm_model": get_local_llm_client().model,
            "agents_count": 2,
            "a2a_message_agent1_to_agent2": agent1_packet,
            "global_risk_score": document.global_risk_score,
            "global_priority_action": document.global_priority_action,
            "strict_mode": options.strict_mode,
            "strict_fail": document.strict_fail,
            "strict_violations": document.strict_violations,
            "go_no_go": go_no_go,
            "final_decision": decision_status,
            "user_message": user_message,
        }

        response = TrackBResponse(
            strategic_agent=strategic,
            document_agent=document,
            final_output=final_output,
        )

        settings = get_settings()
        correction_map = generate_correction_examples(document, settings.reports_dir / "corrections")
        if correction_map:
            for action in document.document_actions:
                if action.file_name in correction_map and action.action_type == "legal_blocker_remediation":
                    action.artifact_path = correction_map[action.file_name]
            response.final_output["correction_examples"] = correction_map

        report_paths = {"json_report": None, "pdf_report": None}
        if options.generate_json_report:
            report_paths["json_report"] = write_json_report(response, settings.reports_dir, options.report_prefix)
        if options.generate_pdf_report:
            report_paths["pdf_report"] = write_pdf_report(response, settings.reports_dir, options.report_prefix)

        response.final_output["reports"] = stringify_report_paths(report_paths)
        context.final_report = response.final_output
        response.final_output["mcp_context"] = context.to_dict()
        return response
