import json
import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware


BASE_DIR = Path(__file__).resolve().parent
STATE_PATH = BASE_DIR / "startup_state.json"
OUTPUTS_DIR = BASE_DIR / "execution_agent_outputs"

app = FastAPI(title="Track3 Execution API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if origin.strip()
    ],
    allow_origin_regex=os.getenv("CORS_ORIGIN_REGEX"),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def read_json(path: Path) -> dict:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=f"{path.name} not found") from exc
    except json.JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail=f"{path.name} is not valid JSON") from exc


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "app": "track3-execution-api"}


@app.get("/track3/status")
def track3_status() -> dict:
    return {
        "track": "Track3",
        "execution_agent": "available",
        "pitch_coach": "local_or_paid_worker_required",
        "render_free_note": (
            "Pitch Coach needs Whisper/Torch/MediaPipe. It is intentionally not "
            "started on Render free because it is too heavy for that runtime."
        ),
    }


@app.get("/track3/execution/state")
def get_startup_state() -> dict:
    return read_json(STATE_PATH)


@app.get("/track3/execution/reports")
def list_execution_reports() -> dict:
    if not OUTPUTS_DIR.exists():
        return {"reports": []}

    reports = []
    for path in sorted(OUTPUTS_DIR.glob("execution_result_*.json")):
        reports.append(
            {
                "name": path.name,
                "endpoint": f"/track3/execution/reports/{path.stem}",
                "updated_at": path.stat().st_mtime,
            }
        )
    return {"reports": reports}


@app.get("/track3/execution/reports/latest")
def get_latest_execution_report() -> dict:
    if not OUTPUTS_DIR.exists():
        raise HTTPException(status_code=404, detail="No execution reports found")

    reports = sorted(
        OUTPUTS_DIR.glob("execution_result_*.json"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )
    if not reports:
        raise HTTPException(status_code=404, detail="No execution reports found")
    return read_json(reports[0])


@app.get("/track3/execution/reports/{report_id}")
def get_execution_report(report_id: str) -> dict:
    safe_id = report_id.replace("/", "").replace("\\", "")
    if not safe_id.endswith(".json"):
        safe_id = f"{safe_id}.json"

    path = OUTPUTS_DIR / safe_id
    if not path.name.startswith("execution_result_"):
        path = OUTPUTS_DIR / f"execution_result_{safe_id}"
    return read_json(path)


@app.get("/track3/pitch/status")
def pitch_status() -> dict:
    return {
        "available_on_render_free": False,
        "reason": "Track3 Pitch Coach depends on Whisper, Torch, OpenCV, MediaPipe, and video/audio processing.",
        "recommended_solution": "Run it locally with Docker or deploy it separately on a paid CPU/GPU service.",
        "local_command": (
            "docker compose --env-file .env.docker --profile tools run --rm "
            "track3-pitch python agentic_pitch_coach.py --video my_pitch.mp4 "
            "--output pitch_coach_output --whisper-size tiny --max-frames 30 --skip-voice-emotion"
        ),
    }
