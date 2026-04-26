from __future__ import annotations

import json
import sys
from pathlib import Path

from app.models.schemas import RunCaseResponse, TrackBRequest
from app.services.orchestrator import TrackBOrchestrator


def _load_request(path: Path) -> TrackBRequest:
    payload = json.loads(path.read_text(encoding="utf-8-sig"))
    return TrackBRequest.model_validate(payload)


def _to_run_case_response(result) -> RunCaseResponse:
    final_output = result.final_output
    return RunCaseResponse(
        recommended_legal_structure=result.strategic_agent.recommended_legal_form,
        startup_act_score=result.strategic_agent.startup_act_eligibility_score,
        missing_documents=result.document_agent.missing_documents,
        document_completeness_score=result.document_agent.overall_completeness_score,
        signature_stamp_validation={
            item.file_name: {
                "signature_present": item.signature_present,
                "stamp_present": item.stamp_present,
                "quality": item.quality,
            }
            for item in result.document_agent.documents
        },
        administrative_checklist=[step.model_dump() for step in result.strategic_agent.checklist],
        deadlines=[
            {
                "step_no": step.step_no,
                "title": step.title,
                "estimated_delay_days": step.estimated_delay_days,
            }
            for step in result.strategic_agent.checklist
        ],
        dependencies=[
            {
                "step_no": step.step_no,
                "depends_on": step.depends_on,
            }
            for step in result.strategic_agent.checklist
            if step.depends_on
        ],
        final_decision=str(final_output.get("final_decision", "WARNING")),
        details={
            "global_risk_score": result.document_agent.global_risk_score,
            "strict_fail": result.document_agent.strict_fail,
            "strict_violations": result.document_agent.strict_violations,
            "cross_document_validations": [item.model_dump() for item in result.document_agent.cross_document_validations],
            "reports": final_output.get("reports", {}),
        },
    )


def main() -> None:
    arg = Path(sys.argv[1]) if len(sys.argv) > 1 else Path("sample_data/request_demo.json")
    if not arg.exists():
        raise FileNotFoundError(
            f"Request file not found: {arg}. Use: python -m app.run.run_case sample_data/request_demo.json"
        )

    request = _load_request(arg)
    result = TrackBOrchestrator().run(request)
    run_case_response = _to_run_case_response(result)
    print(json.dumps(run_case_response.model_dump(), indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
