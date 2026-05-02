from __future__ import annotations

import sys
import os
import html
import hashlib
import json
import re
from datetime import datetime, timezone
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor
from copy import deepcopy
from pathlib import Path
from typing import Any
from urllib.parse import quote_plus, unquote, urlparse, parse_qs

from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

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
UPLOADS_DIR = Path(__file__).resolve().parent / "track2_uploads"

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


def _clean_search_url(url: str) -> str:
    if url.startswith("//"):
        url = f"https:{url}"
    parsed = urlparse(url)
    if parsed.path.startswith("/l/"):
        redirect = parse_qs(parsed.query).get("uddg", [""])[0]
        if redirect:
            return unquote(redirect)
    return url


def _fetch_public_search_results(query: str, limit: int = 3) -> dict[str, Any]:
    search_url = f"https://duckduckgo.com/html/?q={quote_plus(query)}"
    request = urllib.request.Request(
        search_url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
            )
        },
    )

    try:
        with urllib.request.urlopen(request, timeout=7) as response:
            page = response.read().decode("utf-8", errors="ignore")
    except (urllib.error.URLError, TimeoutError, OSError) as exc:
        return {
            "status": "unavailable",
            "source": "DuckDuckGo public HTML",
            "message": f"External search could not be reached from the local API: {exc}",
            "results": [],
        }

    results = []
    title_matches = list(
        re.finditer(
            r'<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>(.*?)</a>',
            page,
            flags=re.IGNORECASE | re.DOTALL,
        )
    )

    for match in title_matches:
        url, title = match.groups()
        block = page[match.end() : match.end() + 2400]
        snippet_match = re.search(
            r'<a[^>]*class="result__snippet"[^>]*>(.*?)</a>',
            block,
            flags=re.IGNORECASE | re.DOTALL,
        )
        snippet = snippet_match.group(1) if snippet_match else ""
        clean_title = re.sub(r"<[^>]+>", "", html.unescape(title)).strip()
        clean_snippet = re.sub(r"<[^>]+>", "", html.unescape(snippet)).strip()
        clean_url = _clean_search_url(html.unescape(url))
        if clean_title and clean_url:
            results.append(
                {
                    "title": clean_title,
                    "url": clean_url,
                    "snippet": clean_snippet or "Public result found for this research query.",
                    "domain": urlparse(clean_url).netloc.replace("www.", ""),
                }
            )
        if len(results) >= limit:
            break

    return {
        "status": "completed" if results else "no_results",
        "source": "DuckDuckGo public HTML",
        "message": "Public web search executed by the local Track B bridge.",
        "results": results,
    }


def _hash_payload(value: Any) -> str:
    safe_value = _json_safe(value)
    encoded = json.dumps(safe_value, sort_keys=True, ensure_ascii=True, default=str).encode("utf-8")
    return hashlib.sha256(encoded).hexdigest()


def _build_blockchain_audit(payload: dict[str, Any], result: dict[str, Any], external_research: dict[str, Any]) -> dict[str, Any]:
    timestamp = datetime.now(timezone.utc).isoformat(timespec="seconds")
    documents = payload.get("documents") or []
    searches = external_research.get("searches") or []
    discovered_results = sum(len(search.get("agent_search", {}).get("results", [])) for search in searches)
    events = [
        {
            "event": "case_intake",
            "label": "Case intake sealed",
            "summary": f"{payload.get('startup_profile', {}).get('startup_name', 'Startup')} profile and legal context captured.",
            "payload": payload.get("startup_profile", {}),
        },
        {
            "event": "document_evidence",
            "label": "Document evidence hashed",
            "summary": f"{len(documents)} uploaded or declared documents included in the review.",
            "payload": documents,
        },
        {
            "event": "agent_decision",
            "label": "Agent decision recorded",
            "summary": result.get("final_output", {}).get("user_message") or "Track B legal decision generated.",
            "payload": result.get("final_output", {}),
        },
        {
            "event": "external_research",
            "label": "External research notarized",
            "summary": f"{len(searches)} searches executed with {discovered_results} public results captured.",
            "payload": searches,
        },
    ]

    previous_hash = "0" * 64
    chain = []
    for index, event in enumerate(events, start=1):
        payload_hash = _hash_payload(event["payload"])
        block_content = {
            "index": index,
            "timestamp": timestamp,
            "event": event["event"],
            "payload_hash": payload_hash,
            "previous_hash": previous_hash,
        }
        block_hash = _hash_payload(block_content)
        chain.append(
            {
                **block_content,
                "label": event["label"],
                "summary": event["summary"],
                "block_hash": block_hash,
            }
        )
        previous_hash = block_hash

    return {
        "network": "Track B local proof chain",
        "status": "sealed",
        "verification": "local_sha256",
        "case_hash": _hash_payload({"payload": payload, "result": result, "research": external_research}),
        "latest_block_hash": previous_hash,
        "blocks": chain,
    }


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

    with ThreadPoolExecutor(max_workers=3) as executor:
        search_results = list(executor.map(lambda item: _fetch_public_search_results(str(item["query"])), searches))

    for search, search_result in zip(searches, search_results):
        search["agent_search"] = search_result

    recommendations = [
        "Review the returned results and keep only public evidence that matches the startup identity.",
        "Save screenshots or URLs for strong evidence such as company page, founder profiles, press, accelerator mentions, or events.",
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
        "automation_note": "The local API executes public search queries and displays the results it can retrieve.",
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


def _json_safe(value: Any, seen: set[int] | None = None) -> Any:
    if seen is None:
        seen = set()

    if value is None or isinstance(value, (str, int, float, bool)):
        return value

    if isinstance(value, Path):
        return str(value)

    if isinstance(value, BaseModel):
        value = value.model_dump()

    if isinstance(value, dict):
        value_id = id(value)
        if value_id in seen:
            return "[circular-reference]"
        seen.add(value_id)
        cleaned = {str(key): _json_safe(item, seen) for key, item in value.items()}
        seen.remove(value_id)
        return cleaned

    if isinstance(value, (list, tuple, set)):
        value_id = id(value)
        if value_id in seen:
            return ["[circular-reference]"]
        seen.add(value_id)
        cleaned = [_json_safe(item, seen) for item in value]
        seen.remove(value_id)
        return cleaned

    return str(value)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "app": "track-b-legal-bridge"}


@app.get("/track2/sample")
def sample() -> dict[str, Any]:
    return _resolve_document_paths(SAMPLE_REQUEST)


@app.post("/track2/upload")
async def upload_documents(files: list[UploadFile] = File(...)) -> dict[str, Any]:
    UPLOADS_DIR.mkdir(parents=True, exist_ok=True)
    uploaded: list[dict[str, str | None]] = []

    for file in files:
        safe_name = Path(file.filename or "document").name.replace("|", "_")
        target = UPLOADS_DIR / safe_name
        suffix = target.suffix
        stem = target.stem
        counter = 1
        while target.exists():
            target = UPLOADS_DIR / f"{stem}_{counter}{suffix}"
            counter += 1

        target.write_bytes(await file.read())
        uploaded.append(
            {
                "path": str(target),
                "declared_type": None,
                "file_name": safe_name,
            }
        )

    return {"documents": uploaded}


@app.post("/track2/run")
def run_track_b(payload: dict[str, Any]) -> JSONResponse:
    global latest_result
    normalized_payload = _resolve_document_paths(payload)
    request = TrackBRequest.model_validate(normalized_payload)
    latest_result = orchestrator.run(request)
    result = latest_result.model_dump()
    external_research = _build_external_research(normalized_payload, result)
    result["external_research"] = external_research
    result["blockchain_audit"] = _build_blockchain_audit(normalized_payload, result, external_research)
    return JSONResponse(content=_json_safe(result))


@app.post("/track2/chat")
def chat(payload: ChatRequest) -> dict[str, Any]:
    return chatbot.answer(payload.question, latest_result).model_dump()


@app.post("/track2/research")
def external_research(payload: dict[str, Any]) -> JSONResponse:
    return JSONResponse(content=_json_safe(_build_external_research(_resolve_document_paths(payload))))
