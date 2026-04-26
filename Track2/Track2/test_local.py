from app.run.run_agent2 import build_demo_request
from app.services.orchestrator import TrackBOrchestrator


def test_track_b_pipeline_runs():
    orchestrator = TrackBOrchestrator()
    result = orchestrator.run(build_demo_request())
    assert result.strategic_agent.recommended_legal_form in {"SUARL", "SARL", "SA"}
    assert result.document_agent.overall_completeness_score >= 0
    assert len(result.strategic_agent.checklist) > 0
