from __future__ import annotations

import os
import sys
import asyncio
import hashlib
import json
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests
from fastapi import FastAPI, File, Form, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


ROOT_DIR = Path(__file__).resolve().parents[1]
TRACK1_DIR = ROOT_DIR / "Track1"
TRACK2_DIR = ROOT_DIR / "Track2"
TEMPLATE_DIR = ROOT_DIR / "Template"
FRONTEND_DIST = ROOT_DIR / "Template" / "dist"

startup_errors: dict[str, str] = {}
track3_jobs: dict[str, dict[str, Any]] = {}


def _unavailable(track: str):
    async def endpoint() -> Any:
        raise HTTPException(
            status_code=503,
            detail=f"{track} is unavailable: {startup_errors.get(track, 'unknown startup error')}",
        )

    return endpoint


try:
    sys.path.insert(0, str(TRACK2_DIR))
    from app.api.main import app as track2_app  # noqa: E402
except Exception as exc:  # pragma: no cover - startup guard for hosted deploys
    track2_app = None
    startup_errors["track2"] = repr(exc)

try:
    sys.path.insert(0, str(TRACK1_DIR))
    from api import analyze_startup, get_saved_report  # noqa: E402

    def track1_health() -> dict[str, str]:
        return {"status": "ok", "app": "track1"}
except Exception as exc:  # pragma: no cover - startup guard for hosted deploys
    analyze_startup = _unavailable("track1")
    get_saved_report = _unavailable("track1")
    track1_health = _unavailable("track1")
    startup_errors["track1"] = repr(exc)

try:
    sys.path.insert(0, str(TEMPLATE_DIR))
    from track3_run_agent import build_api_result, build_fallback_result, build_response, merge_state, run_agent  # noqa: E402
except Exception as exc:  # pragma: no cover - startup guard for hosted deploys
    build_api_result = None
    build_fallback_result = None
    build_response = None
    merge_state = None
    run_agent = None
    startup_errors["track3"] = repr(exc)


def _parse_cors_origins() -> list[str]:
    raw = os.getenv("CORS_ALLOW_ORIGINS", "")
    origins = [origin.strip().rstrip("/") for origin in raw.split(",") if origin.strip()]
    return origins or [
        "https://startup-platform-frontend.onrender.com",
    ]


app = FastAPI(title="Startup Multi-Agent Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_origin_regex=os.getenv("CORS_ALLOW_ORIGIN_REGEX", r"https://.*\.onrender\.com"),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, Any]:
    return {
        "status": "ok" if not startup_errors else "degraded",
        "service": "startup-platform-api",
        "startup_errors": startup_errors,
    }


@app.get("/track3/health")
def track3_health() -> dict[str, Any]:
    return {
        "ok": run_agent is not None,
        "startup_error": startup_errors.get("track3"),
        "model_mode": os.getenv("MODEL_MODE", ""),
        "llm_base_url_set": bool(os.getenv("LLM_BASE_URL")),
        "jira_sync_enabled": os.getenv("JIRA_SYNC_ENABLED", "false"),
        "track3_render_free_mode": os.getenv("TRACK3_RENDER_FREE_MODE", "true"),
    }


@app.get("/pitch/health")
def pitch_health() -> dict[str, Any]:
    return {
        "ok": True,
        "service": "pitch-coach-api",
        "mode": "api",
        "llm_base_url_set": bool(os.getenv("LLM_BASE_URL") or os.getenv("OPENAI_BASE_URL")),
        "llm_api_key_set": bool(os.getenv("LLM_API_KEY") or os.getenv("OPENAI_API_KEY")),
        "model": os.getenv("OPENAI_MODEL") or os.getenv("LLM_MODEL") or os.getenv("LLM_PLANNER_MODEL", ""),
    }


def _extract_json_object(text: str) -> dict[str, Any]:
    try:
        parsed = json.loads(text)
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        pass

    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        raise ValueError("No JSON object found in model response")
    parsed = json.loads(text[start : end + 1])
    if not isinstance(parsed, dict):
        raise ValueError("Model response JSON is not an object")
    return parsed


def _call_pitch_llm(prompt: str) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY") or os.getenv("LLM_API_KEY") or ""
    base_url = (os.getenv("OPENAI_BASE_URL") or os.getenv("LLM_BASE_URL") or "").rstrip("/")
    model = os.getenv("OPENAI_MODEL") or os.getenv("LLM_MODEL") or os.getenv("LLM_PLANNER_MODEL") or ""

    if not base_url or not model:
        raise RuntimeError("LLM_BASE_URL and LLM_MODEL are required.")

    headers = {"Content-Type": "application/json"}
    if api_key:
        headers["Authorization"] = f"Bearer {api_key}"

    response = requests.post(
        f"{base_url}/chat/completions",
        headers=headers,
        json={
            "model": model,
            "messages": [
                {
                    "role": "system",
                    "content": (
                        "You are an expert startup pitch coach. Return only valid JSON. "
                        "Give practical feedback for an uploaded pitch video when only metadata is available."
                    ),
                },
                {"role": "user", "content": prompt},
            ],
            "temperature": 0.25,
            "max_tokens": int(os.getenv("PITCH_MAX_TOKENS", "1200")),
        },
        timeout=int(os.getenv("PITCH_API_TIMEOUT_SECONDS", "120")),
    )
    response.raise_for_status()
    body = response.json()
    content = ((body.get("choices") or [{}])[0].get("message") or {}).get("content", "")
    return _extract_json_object(str(content))


def _fallback_pitch_report(filename: str, coaching_mode: str, file_size_kb: int) -> dict[str, Any]:
    return {
        "overall_score": 72,
        "overall_status": "Needs sharpening",
        "criteria": [
            {
                "id": "content_clarity",
                "label": "Content clarity",
                "score": 74,
                "status": "solid",
                "what_it_means": "The pitch should make the problem, customer, solution, traction, and ask explicit.",
            },
            {
                "id": "narrative_structure",
                "label": "Narrative structure",
                "score": 70,
                "status": "improve",
                "what_it_means": "Open with the pain, then show proof and close with a clear ask.",
            },
            {
                "id": "investor_readiness",
                "label": "Investor readiness",
                "score": 68,
                "status": "improve",
                "what_it_means": "Add market size, business model, milestones, and funding use.",
            },
            {
                "id": "delivery",
                "label": "Delivery",
                "score": 76,
                "status": "solid",
                "what_it_means": "Keep sentences short and rehearse transitions for confidence.",
            },
        ],
        "summary": {
            "strongest_criteria": [{"label": "Delivery", "score": 76}],
            "weakest_criteria": [{"label": "Investor readiness", "score": 68}],
        },
        "markdown_report": (
            f"# Pitch Coach Report\n\n"
            f"Video: {filename}\n\n"
            f"Mode: {coaching_mode}\n\n"
            f"File size: {file_size_kb} KB\n\n"
            "## Next best action\n"
            "Rewrite the first 30 seconds to clearly state the customer pain, the solution, and the ask.\n\n"
            "## Recommendations\n"
            "- Add one sentence about the target customer.\n"
            "- Show traction or validation evidence.\n"
            "- End with a clear investment, pilot, or partnership ask.\n"
        ),
    }


@app.post("/pitch/analyze")
async def pitch_analyze(
    file: UploadFile = File(...),
    coaching_mode: str = Form("investor"),
    skip_visual: str = Form("false"),
    skip_voice_emotion: str = Form("false"),
    whisper_size: str = Form("medium"),
) -> dict[str, Any]:
    content = await file.read()
    filename = Path(file.filename or "pitch_video.mp4").name
    execution_id = f"pitch_{uuid.uuid4().hex[:12]}"
    file_hash = hashlib.md5(content).hexdigest()[:12]
    file_size_kb = round(len(content) / 1024)

    prompt = f"""
Analyze this startup pitch video from metadata only.
Filename: {filename}
File size KB: {file_size_kb}
Coaching mode: {coaching_mode}
Skip visual: {skip_visual}
Skip voice emotion: {skip_voice_emotion}
Whisper size selected: {whisper_size}

Return JSON with:
{{
  "overall_score": 0-100,
  "overall_status": "short status",
  "criteria": [
    {{"id":"content_clarity","label":"Content clarity","score":0-100,"status":"short","what_it_means":"specific feedback"}},
    {{"id":"narrative_structure","label":"Narrative structure","score":0-100,"status":"short","what_it_means":"specific feedback"}},
    {{"id":"investor_readiness","label":"Investor readiness","score":0-100,"status":"short","what_it_means":"specific feedback"}},
    {{"id":"delivery","label":"Delivery","score":0-100,"status":"short","what_it_means":"specific feedback"}}
  ],
  "summary": {{
    "strongest_criteria": [{{"label":"...", "score": 0}}],
    "weakest_criteria": [{{"label":"...", "score": 0}}]
  }},
  "markdown_report": "A useful markdown report with next best action and recommendations"
}}
"""
    try:
        scorecard = _call_pitch_llm(prompt)
    except Exception:
        scorecard = _fallback_pitch_report(filename, coaching_mode, file_size_kb)

    scorecard.setdefault("criteria", _fallback_pitch_report(filename, coaching_mode, file_size_kb)["criteria"])
    scorecard.setdefault("markdown_report", _fallback_pitch_report(filename, coaching_mode, file_size_kb)["markdown_report"])

    return {
        "ok": True,
        "_execution_meta": {
            "execution_id": execution_id,
            "file_hash": file_hash,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "filename": filename,
            "file_size_kb": file_size_kb,
            "coaching_mode": coaching_mode,
            "skip_visual": skip_visual == "true",
            "skip_voice_emotion": skip_voice_emotion == "true",
            "whisper_size": whisper_size,
            "mode": "api",
        },
        "reports": {
            "scorecard": scorecard,
            "full_report": {
                "final_report": {
                    "title": "Pitch Coach Report",
                    "markdown_report": scorecard.get("markdown_report", ""),
                    "next_best_action": "Clarify the opening problem statement and close with a concrete ask.",
                    "limitations": ["Render API mode analyzes metadata and pitch structure guidance, not full video transcription."],
                }
            },
            "markdown": scorecard.get("markdown_report", ""),
        },
    }


@app.options("/track3/execution/run")
def track3_execution_options() -> dict[str, str]:
    return {"ok": "true"}


@app.post("/track3/execution/ping")
def track3_execution_ping(payload: dict[str, Any] | None = None) -> dict[str, Any]:
    return {
        "ok": True,
        "service": "startup-platform-api",
        "track": "track3",
        "received_payload": bool(payload),
    }


@app.get("/track3/execution/ping")
def track3_execution_ping_get() -> dict[str, Any]:
    return track3_execution_ping()


async def _run_track3_job(job_id: str, payload: dict[str, Any]) -> None:
    track3_jobs[job_id].update({"status": "running", "started_at": datetime.now(timezone.utc).isoformat()})

    if not all([build_fallback_result, build_response, merge_state, run_agent]):
        track3_jobs[job_id].update(
            {
                "status": "failed",
                "error": f"track3 is unavailable: {startup_errors.get('track3', 'unknown startup error')}",
                "finished_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        return

    if os.getenv("TRACK3_RENDER_FREE_MODE", "true").lower() in {"1", "true", "yes"}:
        result = await asyncio.to_thread(build_api_result, payload) if build_api_result else build_fallback_result(
            payload,
            "Render free mode is enabled; full Track3 agent is skipped.",
        )
        track3_jobs[job_id].update(
            {
                "status": "completed",
                "result": build_response(result),
                "warning": "Render free API mode is enabled; local Track3 models are skipped.",
                "finished_at": datetime.now(timezone.utc).isoformat(),
            }
        )
        return

    try:
        state = merge_state(payload)
        timeout_seconds = float(os.getenv("TRACK3_JOB_TIMEOUT_SECONDS", "180"))
        result = await asyncio.wait_for(
            asyncio.to_thread(lambda: asyncio.run(run_agent(state))),
            timeout=timeout_seconds,
        )
        track3_jobs[job_id].update(
            {
                "status": "completed",
                "result": build_response(result),
                "finished_at": datetime.now(timezone.utc).isoformat(),
            }
        )
    except asyncio.TimeoutError:
        result = build_fallback_result(payload, "Track3 async execution timed out on Render.")
        track3_jobs[job_id].update(
            {
                "status": "completed",
                "result": build_response(result),
                "warning": "Track3 async execution timed out on Render.",
                "finished_at": datetime.now(timezone.utc).isoformat(),
            }
        )
    except Exception as exc:
        result = build_fallback_result(payload, f"{type(exc).__name__}: {exc}")
        track3_jobs[job_id].update(
            {
                "status": "completed",
                "result": build_response(result),
                "warning": f"{type(exc).__name__}: {exc}",
                "finished_at": datetime.now(timezone.utc).isoformat(),
            }
        )


@app.post("/track3/execution/start")
async def track3_execution_start(payload: dict[str, Any]) -> dict[str, Any]:
    job_id = uuid.uuid4().hex
    track3_jobs[job_id] = {
        "job_id": job_id,
        "status": "queued",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    asyncio.create_task(_run_track3_job(job_id, payload))
    return {"ok": True, "job_id": job_id, "status": "queued"}


@app.get("/track3/execution/status/{job_id}")
def track3_execution_status(job_id: str) -> dict[str, Any]:
    job = track3_jobs.get(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Track3 job not found")
    return job


@app.post("/track3/execution/run")
async def track3_execution_run(payload: dict[str, Any]) -> dict[str, Any]:
    if not all([build_fallback_result, build_response, merge_state, run_agent]):
        raise HTTPException(
            status_code=503,
            detail=f"track3 is unavailable: {startup_errors.get('track3', 'unknown startup error')}",
        )

    try:
        state = merge_state(payload)
        timeout_seconds = float(os.getenv("TRACK3_RUN_TIMEOUT_SECONDS", "25"))
        result = await asyncio.wait_for(
            asyncio.to_thread(lambda: asyncio.run(run_agent(state))),
            timeout=timeout_seconds,
        )
    except asyncio.TimeoutError:
        result = build_fallback_result(payload, "Track3 execution timed out before Render request limit.")
    except Exception as exc:
        result = build_fallback_result(payload, f"{type(exc).__name__}: {exc}")

    return build_response(result)


app.add_api_route("/track1/health", track1_health, methods=["GET"])
app.add_api_route("/track1/analyze", analyze_startup, methods=["POST"])
app.add_api_route("/track1/report", get_saved_report, methods=["GET"])

if track2_app is not None:
    app.mount("/track2", track2_app)
else:
    app.add_api_route("/track2/health", _unavailable("track2"), methods=["GET"])

if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
