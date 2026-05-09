from __future__ import annotations

import os
import sys
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles


ROOT_DIR = Path(__file__).resolve().parents[1]
TRACK1_DIR = ROOT_DIR / "Track1"
TRACK2_DIR = ROOT_DIR / "Track2"
FRONTEND_DIST = ROOT_DIR / "Template" / "dist"

startup_errors: dict[str, str] = {}


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
    from api import analyze_startup, get_saved_report, health as track1_health  # noqa: E402
except Exception as exc:  # pragma: no cover - startup guard for hosted deploys
    analyze_startup = _unavailable("track1")
    get_saved_report = _unavailable("track1")
    track1_health = _unavailable("track1")
    startup_errors["track1"] = repr(exc)


def _parse_cors_origins() -> list[str]:
    raw = os.getenv("CORS_ALLOW_ORIGINS", "")
    origins = [origin.strip().rstrip("/") for origin in raw.split(",") if origin.strip()]
    return origins or [
        "https://startup-platform-frontend.onrender.com",
    ]


app = FastAPI(title="Startup Multi-Agent Platform")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_parse_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {
        "status": "ok" if not startup_errors else "degraded",
        "service": "startup-platform-api",
        "startup_errors": startup_errors,
    }


app.add_api_route("/track1/health", track1_health, methods=["GET"])
app.add_api_route("/track1/analyze", analyze_startup, methods=["POST"])
app.add_api_route("/track1/report", get_saved_report, methods=["GET"])

if track2_app is not None:
    app.mount("/track2", track2_app)
else:
    app.add_api_route("/track2/health", _unavailable("track2"), methods=["GET"])

if FRONTEND_DIST.exists():
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="frontend")
