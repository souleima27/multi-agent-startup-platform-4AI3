from __future__ import annotations

import sys
import os
from copy import deepcopy
from pathlib import Path
from typing import Any
from urllib.parse import quote_plus

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

PROJECT_ROOT = Path(__file__).resolve().parents[1]
TRACK2_ROOT = PROJECT_ROOT / "Track2"

os.environ.setdefault("LLM_TIMEOUT_SECONDS", "6")
os.environ.setdefault("REPORTS_DIR", str(Path(__file__).resolve().parent / "track2_reports"))

if str(TRACK2_ROOT) not in sys.path:
    sys.path.insert(0, str(TRACK2_ROOT))

from app.models.schemas import ChatRequest, TrackBRequest  # noqa: E402
from app.services.chatbot import TrackBChatbot  # noqa: E402
from app.services.knowledge_base import load_knowledge_base  # noqa: E402
from app.services.local_llm import get_local_llm_client  # noqa: E402
from app.services.orchestrator import TrackBOrchestrator  # noqa: E402

app = FastAPI(title="Track B Legal Bridge")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

orchestrator = TrackBOrchestrator()
chatbot = TrackBChatbot(llm=get_local_llm_client(), kb=load_knowledge_base())
latest_result = None

SAMPLE_REQUEST: dict[str, Any] = {
    "startup_profile": {
        "startup_name": "Neuronix Legal AI",
        "sector": "AI SaaS",
        "activity_description": "AI platform for startup legal guidance and compliance automation.",
        "founders_count": 3,
        "funding_need_tnd": 250000,
        "wants_investors": True,
        "needs_limited_liability": True,
        "has_foreign_investors": False,
        "innovative": True,
        "scalable": True,
        "uses_technology": True,
        "associates": [
            {"name": "Mariam", "role": "CEO", "equity_pct": 45, "active": True},
            {"name": "Youssef", "role": "CTO", "equity_pct": 35, "active": True},
            {"name": "Nour", "role": "COO", "equity_pct": 20, "active": True},
        ],
    },
    "documents": [
        {"path": "Track2/data/synthetic_docs/scans/fake_01_statuts.png", "declared_type": "statuts"},
        {"path": "Track2/data/synthetic_docs/scans/fake_02_rc.png", "declared_type": "registre_commerce"},
        {"path": "Track2/data/synthetic_docs/scans/fake_03_if.png", "declared_type": "identifiant_fiscal"},
        {"path": "Track2/data/synthetic_docs/scans/fake_04_attestation_bancaire.png", "declared_type": "attestation_bancaire"},
        {"path": "Track2/data/synthetic_docs/scans/fake_05_cin.png", "declared_type": "cin"},
    ],
    "label_input": {
        "startup_name": "Neuronix Legal AI",
        "transcript": "We automate legal readiness for Tunisian startups.",
        "slide_text": "AI legal compliance, Startup Act readiness, document diagnostics.",
        "sector": "AI SaaS",
        "traction_signals": ["pilot customers", "legal workflow automation"],
        "team_signals": ["technical founder", "legal operations experience"],
        "pitch_notes": ["clear market pain", "strong compliance use case"],
    },
    "options": {
        "strict_mode": True,
        "generate_json_report": True,
        "generate_pdf_report": False,
        "report_prefix": "track_b_template_run",
    },
}


def _as_text_list(values: Any) -> list[str]:
    if not values:
        return []
    if isinstance(values, list):
        return [str(item).strip() for item in values if str(item).strip()]
    return [str(values).strip()]


def _build_external_research(payload: dict[str, Any], result: dict[str, Any] | None = None) -> dict[str, Any]:
    profile = payload.get("startup_profile", {})
    label_input = payload.get("label_input") or {}
    final_output = (result or {}).get("final_output", {})
    startup_name = str(profile.get("startup_name") or "startup").strip()
    sector = str(profile.get("sector") or "").strip()
    activity = str(profile.get("activity_description") or "").strip()
    founders = profile.get("associates") or []
    founder_names = [str(item.get("name", "")).strip() for item in founders if isinstance(item, dict) and item.get("name")]

    core_terms = " ".join([startup_name, sector, "Tunisia startup"]).strip()
    founder_terms = " OR ".join(founder_names) if founder_names else startup_name

    searches = [
        {
            "platform": "Google",
            "purpose": "Company, market, regulatory and public credibility check",
            "query": f'"{startup_name}" {sector} Tunisia startup legal registration Startup Act',
            "url": f"https://www.google.com/search?q={quote_plus(f'{startup_name} {sector} Tunisia startup legal registration Startup Act')}",
            "signals_to_check": [
                "Official website or product page",
                "Press, accelerator, investor, or partner mentions",
                "Regulatory or public registry mentions",
                "Conflicting names, inactive pages, or reputation risks",
            ],
        },
        {
            "platform": "LinkedIn",
            "purpose": "Founder and company professional presence check",
            "query": f'site:linkedin.com/in OR site:linkedin.com/company "{startup_name}" {founder_terms}',
            "url": f"https://www.google.com/search?q={quote_plus(f'site:linkedin.com/in OR site:linkedin.com/company {startup_name} {founder_terms}')}",
            "signals_to_check": [
                "Founder profiles match the declared team",
                "Company page exists and matches sector/activity",
                "Roles and experience support the legal dossier",
                "Team claims are consistent with pitch and documents",
            ],
        },
        {
            "platform": "Facebook",
            "purpose": "Public social proof and activity check",
            "query": f'site:facebook.com "{startup_name}" {sector} Tunisia',
            "url": f"https://www.google.com/search?q={quote_plus(f'site:facebook.com {startup_name} {sector} Tunisia')}",
            "signals_to_check": [
                "Active public page or founder/community presence",
                "Recent posts, launch activity, or customer signals",
                "Contact details consistent with the legal dossier",
                "Negative comments, abandoned pages, or impersonation risks",
            ],
        },
    ]

    recommendations = [
        "Open each search result and confirm the public evidence before submitting the legal dossier.",
        "Save screenshots or URLs for strong evidence such as company page, founder profiles, press, or accelerator mentions.",
        "Treat missing LinkedIn/Facebook presence as a warning, not an automatic blocker.",
    ]

    if final_output.get("final_decision") == "FAIL":
        recommendations.insert(0, "Fix blocking document issues first, then use public research to strengthen the dossier.")

    return {
        "startup_name": startup_name,
        "sector": sector,
        "activity_description": activity,
        "traction_signals": _as_text_list(label_input.get("traction_signals")),
        "team_signals": _as_text_list(label_input.get("team_signals")),
        "searches": searches,
        "recommendations": recommendations,
        "automation_note": (
            "Google, LinkedIn and Facebook pages often block unauthenticated scraping. "
            "This bridge prepares reliable public search URLs and review criteria; it can be connected to a search API key later for automatic result extraction."
        ),
    }


def _resolve_document_paths(payload: dict[str, Any]) -> dict[str, Any]:
    normalized = deepcopy(payload)
    for document in normalized.get("documents", []):
        path_value = document.get("path")
        if not path_value:
            continue
        path = Path(path_value)
        if not path.is_absolute():
            document["path"] = str(PROJECT_ROOT / path)
    return normalized


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "app": "track-b-legal-bridge"}


@app.get("/track2/sample")
def sample() -> dict[str, Any]:
    return _resolve_document_paths(SAMPLE_REQUEST)


@app.post("/track2/run")
def run_track_b(payload: dict[str, Any]) -> dict[str, Any]:
    global latest_result
    normalized_payload = _resolve_document_paths(payload)
    request = TrackBRequest.model_validate(normalized_payload)
    latest_result = orchestrator.run(request)
    result = latest_result.model_dump()
    result["external_research"] = _build_external_research(normalized_payload, result)
    return result


@app.post("/track2/chat")
def chat(payload: ChatRequest) -> dict[str, Any]:
    return chatbot.answer(payload.question, latest_result).model_dump()


@app.post("/track2/research")
def external_research(payload: dict[str, Any]) -> dict[str, Any]:
    return _build_external_research(_resolve_document_paths(payload))
