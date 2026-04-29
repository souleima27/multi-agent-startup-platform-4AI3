from __future__ import annotations

import json
import sys
from pathlib import Path
from app.core.config import get_settings
from app.models.schemas import DocumentItem, StartupLabelSimulationInput, StartupProfile, TrackBRequest
from app.services.orchestrator import TrackBOrchestrator


def build_demo_request() -> TrackBRequest:
    settings = get_settings()
    image_dir = settings.dataset_dir / "images"
    demo_files = [
        DocumentItem(path=str(image_dir / "doc_0.png")),
        DocumentItem(path=str(image_dir / "doc_1.png")),
        DocumentItem(path=str(image_dir / "doc_2.png")),
        DocumentItem(path=str(image_dir / "doc_3.png")),
        DocumentItem(path=str(image_dir / "doc_4.png")),
    ]
    profile = StartupProfile(
        startup_name="Neuronix Legal AI",
        sector="AI SaaS",
        activity_description="AI platform for startup legal guidance, OCR document verification, and compliance automation.",
        founders_count=3,
        funding_need_tnd=250000,
        wants_investors=True,
        innovative=True,
        scalable=True,
        uses_technology=True,
    )
    label_input = StartupLabelSimulationInput(
        startup_name="Neuronix Legal AI",
        sector="AI SaaS",
        transcript="We solve startup legal complexity with AI agents, OCR, workflow automation, and startup label preparation.",
        slide_text="Problem Solution Market Business Model Team Traction AI OCR Agent Platform B2B SaaS",
        traction_signals=["pilot users", "university validation"],
        team_signals=["AI engineering", "full stack", "domain research"],
    )
    return TrackBRequest(startup_profile=profile, documents=demo_files, label_input=label_input)


def load_request_from_json(path: Path) -> TrackBRequest:
    payload = json.loads(path.read_text(encoding="utf-8-sig"))
    return TrackBRequest.model_validate(payload)


def main() -> None:
    orchestrator = TrackBOrchestrator()
    arg_path = Path(sys.argv[1]).resolve() if len(sys.argv) > 1 else None
    default_path = Path("request.json").resolve()

    if arg_path and arg_path.exists():
        request = load_request_from_json(arg_path)
    elif default_path.exists():
        request = load_request_from_json(default_path)
    else:
        raise FileNotFoundError(
            "No input JSON file found. Provide a request file path (e.g. 'python -m app.run.run_agent2 request_strict.json') "
            "or create request.json in the project root."
        )

    result = orchestrator.run(request)
    print(json.dumps(result.model_dump(), indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
